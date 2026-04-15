package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	dbConfig := dbConfig{
		Host:     "localhost",
		Port:     5432,
		User:     "postgres",
		Password: "[PASSWORD]",
		DBName:   "postgres",
	}
	cfg := Config{
		Addr:     ":3000",
		DbConfig: dbConfig,
	}
	app := API{
		Config: cfg,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	err := app.run(ctx)
	if err != nil {
		log.Fatal(err)
	}
}