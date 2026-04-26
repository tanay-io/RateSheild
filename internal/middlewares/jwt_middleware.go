package middlewares

import (
	"context"
	"errors"
	"net/http"
	"strings"

	auth "github.com/tanay-io/RateSheild/internal/services/auth"
)

func JWTAuth(authService *auth.Service) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token, err := extractBearerToken(r)
			if err != nil {
				switch {
				case errors.Is(err, errMissingAuthorization):
					http.Error(w, "missing Authorization header", http.StatusUnauthorized)
				case errors.Is(err, errInvalidAuthorization):
					http.Error(w, "invalid Authorization header", http.StatusUnauthorized)
				default:
					http.Error(w, err.Error(), http.StatusUnauthorized)
				}
				return
			}

			userID, err := authService.ValidateToken(token)
			if err != nil {
				http.Error(w, err.Error(), http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

var (
	errMissingAuthorization = errors.New("missing Authorization header")
	errInvalidAuthorization = errors.New("invalid Authorization header")
)

func extractBearerToken(r *http.Request) (string, error) {
	header := r.Header.Get("Authorization")
	if header != "" {
		const prefix = "Bearer "
		if !strings.HasPrefix(header, prefix) {
			return "", errInvalidAuthorization
		}

		token := strings.TrimSpace(strings.TrimPrefix(header, prefix))
		if token == "" {
			return "", auth.ErrInvalidToken
		}

		return token, nil
	}

	if strings.EqualFold(r.Header.Get("Upgrade"), "websocket") {
		token := strings.TrimSpace(r.URL.Query().Get("token"))
		if token != "" {
			return token, nil
		}
	}

	return "", errMissingAuthorization
}
