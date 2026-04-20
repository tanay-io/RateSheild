package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/redis/go-redis/v9"
	"github.com/tanay-io/RateSheild/internal/models"
	"github.com/tanay-io/RateSheild/internal/repository"
	"github.com/tanay-io/RateSheild/internal/services/apiKey"
	"github.com/tanay-io/RateSheild/internal/services/ratelimiter"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
		Protocol: 2,
	})
	//sample url abhi orignal env ke through ayegi
	dsn := "postgres://user:pass@localhost:5432/rateshield"
	dbRepo, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Could not connect to Database: %v", err)
	}

	if err := dbRepo.AutoMigrate(&models.APIKey{}, &models.User{}); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}
	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}
	log.Println("Connected to Redis successfully.")

	repo := repository.NewAlgo(rdb)
	fixedWindow := ratelimiter.NewFixedWindowLimiter(repo)
	slidingWindow := ratelimiter.NewSlidingWindowService(repo)
	tokenBucket := ratelimiter.NewTokenBucketService(repo)
	limiterService := ratelimiter.NewRateLimiterService(fixedWindow, slidingWindow, tokenBucket)

	db := repository.NewDB(dbRepo)
	authService := auth.NewAuth(db)

	cfg := Config{
		Addr: ":3000",
	}
	server := API{
		Config:  cfg,
		Limiter: limiterService,
		Auth:    authService,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	err = server.run(ctx)
	if err != nil {
		log.Fatal(err)
	}
}