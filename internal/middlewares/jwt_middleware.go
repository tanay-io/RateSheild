package middlewares

import (
	"context"
	"net/http"
	"strings"

	auth "github.com/tanay-io/RateSheild/internal/services/auth"
)

func JWTAuth(authService *auth.Service) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			if header == "" {
				http.Error(w, "missing Authorization header", http.StatusUnauthorized)
				return
			}

			const prefix = "Bearer "
			if !strings.HasPrefix(header, prefix) {
				http.Error(w, "invalid Authorization header", http.StatusUnauthorized)
				return
			}

			userID, err := authService.ValidateToken(strings.TrimSpace(strings.TrimPrefix(header, prefix)))
			if err != nil {
				http.Error(w, err.Error(), http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
