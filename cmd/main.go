package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/redis/go-redis/v9"
	"github.com/tanay-io/RateSheild/internal/repository"
	"github.com/tanay-io/RateSheild/internal/services"
	"gorm.io/driver/postgres"
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
	dbRepo, err := repository.NewDB(postgres.Open(dsn))
	if(err!=nil){
		log.Fatalf("Could not connect to Database: %v", err)
	}
	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}
	log.Println("Connected to Redis successfully.")

	repo := repository.NewAlgo(rdb)
	fixedWindow := services.NewFixedWindowLimiter(repo)
	slidingWindow := services.NewSlidingWindowService(repo)
	token_bucket := services.NewTokenBucketService(repo)
	limiterService := services.NewRateLimiterService(fixedWindow, slidingWindow ,token_bucket)

	cfg := Config{
		Addr:     ":3000",
	}
	app := API{
		Config:  cfg,
		Limiter: limiterService,
		DB:dbRepo,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	err = app.run(ctx)
	if err != nil {
		log.Fatal(err)
	}
}