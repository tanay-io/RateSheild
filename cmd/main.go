package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	"github.com/tanay-io/RateSheild/internal/hub"
	"github.com/tanay-io/RateSheild/internal/models"
	"github.com/tanay-io/RateSheild/internal/repository"
	auth "github.com/tanay-io/RateSheild/internal/services/apiKey"
	usersvc "github.com/tanay-io/RateSheild/internal/services/auth"
	"github.com/tanay-io/RateSheild/internal/services/ratelimiter"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func mustEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("required environment variable %q is not set", key)
	}
	return v
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func main() {

	//ye sirf local ke lie hai 
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}

	// Redis
	redisDB, _ := strconv.Atoi(getEnv("REDIS_DB", "0"))
	rdb := redis.NewClient(&redis.Options{
		Addr:     mustEnv("REDIS_ADDR"),
		Password: getEnv("REDIS_PASSWORD", ""),
		DB:       redisDB,
		Protocol: 2,
	})
	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}
	log.Println("Connected to Redis successfully.")

	// PostgreSQL
	dbRepo, err := gorm.Open(postgres.Open(mustEnv("DATABASE_URL")), &gorm.Config{})
	if err != nil {
		log.Fatalf("Could not connect to Database: %v", err)
	}
	if err := dbRepo.AutoMigrate(&models.APIKey{}, &models.User{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	// Services
	repo := repository.NewAlgo(rdb)
	fixedWindow := ratelimiter.NewFixedWindowLimiter(repo)
	slidingWindow := ratelimiter.NewSlidingWindowService(repo)
	tokenBucket := ratelimiter.NewTokenBucketService(repo)
	limiterService := ratelimiter.NewRateLimiterService(fixedWindow, slidingWindow, tokenBucket, repo)

	db := repository.NewDB(dbRepo)
	authService := auth.NewAuth(db)
	userAuthService := usersvc.NewService(db, mustEnv("JWT_SECRET"))

	// WebSocket hub
	wsHub := hub.NewHub()
	go wsHub.Run()
	go wsHub.StartGlobalSubscriber(rdb)

	// HTTP server
	cfg := Config{
		Addr: getEnv("PORT", ":3000"),
	}
	server := API{
		Config:   cfg,
		Limiter:  limiterService,
		Auth:     authService,
		UserAuth: userAuthService,
		Hub:      wsHub,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	if err := server.run(ctx); err != nil {
		log.Fatal(err)
	}
}

