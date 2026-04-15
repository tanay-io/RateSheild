package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/redis/go-redis/v9"
	"github.com/tanay-io/RateSheild/internal/services"
)

func main() {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", 
		DB:       0, 
		Protocol: 2,
	})
	
	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("Could not connect to Redis: %v", err)
	}
	log.Println("Connected to Redis successfully.")

	limiter := services.NewFixedWindow(rdb)

	dbConfig := dbConfig{
		Host:     "localhost",
		Port:     6379,
		User:     "default",
		Password: "",
		DBName:   "RateSheild",
	}
	cfg := Config{
		Addr:     ":3000",
		DbConfig: dbConfig,
	}
	app := API{
		Config:  cfg,
		Limiter: limiter,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	err := app.run(ctx)
	if err != nil {
		log.Fatal(err)
	}
}