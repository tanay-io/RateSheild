package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/tanay-io/RateSheild/internal/handlers"
	"github.com/tanay-io/RateSheild/internal/services/app"
	"github.com/tanay-io/RateSheild/internal/services/ratelimiter"
	"gorm.io/gorm"
)

type API struct {
	Config  Config
	Limiter *ratelimiter.RateLimiterService  // Injecting the service router into API
	Auth    *app.Auth
	DB *gorm.DB
}
type DB struct {
	db *gorm.DB
}
type Config struct {
	Addr     string
}


func (app *API) mount() http.Handler {
	r := chi.NewRouter()
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("healthy"))
		log.Println("healthy!")
	})

	r.Post("/check", handlers.Check(app.Limiter))
	r.Post("/apikey", handlers.CreateApiKey(app.Auth))

	return r
}

func (app *API) run(ctx context.Context) error {
	log.Println("Starting server on ", app.Config.Addr)
	server := &http.Server{
		Addr:    app.Config.Addr,
		Handler: app.mount(),
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	<-ctx.Done()

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	log.Println("Shutting down server...")
	return server.Shutdown(shutdownCtx)
}
