package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/tanay-io/RateSheild/internal/handlers"
	"github.com/tanay-io/RateSheild/internal/hub"
	"github.com/tanay-io/RateSheild/internal/middlewares"
	auth "github.com/tanay-io/RateSheild/internal/services/apiKey"
	userauth "github.com/tanay-io/RateSheild/internal/services/auth"
	"github.com/tanay-io/RateSheild/internal/services/ratelimiter"
	"gorm.io/gorm"
)

type API struct {
	Config   Config
	Limiter  *ratelimiter.RateLimiterService
	Auth     *auth.Auth
	UserAuth *userauth.Service
	DB       *gorm.DB
	Hub      *hub.Hub
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

	r.Route("/auth", func(r chi.Router) {
		r.Post("/register", handlers.Register(a.UserAuth))
		r.Post("/login", handlers.Login(a.UserAuth))
	})

	r.Group(func(r chi.Router) {
		r.Use(middlewares.JWTAuth(a.UserAuth))
		r.Route("/dashboard", func(r chi.Router) {
			r.Post("/apikeys", handlers.CreateApiKey(a.Auth))
			r.Get("/apikeys", handlers.GetAPIKeys(a.Auth))
			r.Delete("/apikeys/{keyId}", handlers.RevokeAPIKey(a.Auth))

			r.Get("/live", handlers.LiveHandler(a.Hub))

		})
	})

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
