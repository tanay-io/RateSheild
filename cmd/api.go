package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/tanay-io/RateSheild/internal/handlers"
	"github.com/tanay-io/RateSheild/internal/middlewares"
	"github.com/tanay-io/RateSheild/internal/services/app"
	"github.com/tanay-io/RateSheild/internal/services/ratelimiter"
	"gorm.io/gorm"
)

type API struct {
	Config  Config
	Limiter *ratelimiter.RateLimiterService 
	Auth    *app.Auth
	DB      *gorm.DB
}

type Config struct {
	Addr string
}

func (a *API) mount() http.Handler {
	r := chi.NewRouter()

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("healthy"))
		log.Println("healthy!")
	})


	r.Post("/apikeys", handlers.CreateApiKey(a.Auth))
	r.Get("/apikeys/{userId}", handlers.GetAPIKeys(a.Auth))
	r.Delete("/apikeys/{userId}/{keyId}", handlers.RevokeAPIKey(a.Auth))

	r.Group(func(r chi.Router) {
		r.Use(middlewares.APIKeyAuth(a.Auth))
		r.Post("/check", handlers.Check(a.Limiter))
	})

	return r
}

func (a *API) run(ctx context.Context) error {
	log.Println("Starting server on ", a.Config.Addr)
	server := &http.Server{
		Addr:    a.Config.Addr,
		Handler: a.mount(),
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
