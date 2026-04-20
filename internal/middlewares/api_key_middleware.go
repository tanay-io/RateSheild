package middlewares

import (
	"net/http"

	 "github.com/tanay-io/RateSheild/internal/services/apiKey"
)

func APIKeyAuth(authService *auth.Auth) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			apiKey := r.Header.Get("X-API-Key")
			if apiKey == "" {
				http.Error(w, "missing X-API-Key header", http.StatusUnauthorized)
				return
			}

			_, err := authService.ValidateAPIKey(r.Context(), apiKey)
			if err != nil {
				http.Error(w, err.Error(), http.StatusUnauthorized)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
