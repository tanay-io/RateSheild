package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
	"github.com/tanay-io/RateSheild/internal/middlewares"
	auth "github.com/tanay-io/RateSheild/internal/services/apiKey"
)

func userIDFromCtx(r *http.Request) (uint, bool) {
	val := r.Context().Value(middlewares.UserIDKey)
	id, ok := val.(uint)
	return id, ok
}

type MakeAPiKeyRequest struct {
	Name string `json:"name"`
}

// POST /apikeys
func CreateApiKey(authService *auth.Auth) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := userIDFromCtx(r)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		var req MakeAPiKeyRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}
		if req.Name == "" {
			http.Error(w, "name is required", http.StatusBadRequest)
			return
		}

		res, err := authService.CreateApiKey(r.Context(), userID, req.Name)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(res)
	}
}

// GET /apikeys
func GetAPIKeys(authService *auth.Auth) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := userIDFromCtx(r)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		res, err := authService.GetAPIKeys(r.Context(), userID)
		if err != nil {
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	}
}

// DELETE /apikeys/{keyId}
func RevokeAPIKey(authService *auth.Auth) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := userIDFromCtx(r)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		keyIDStr := chi.URLParam(r, "keyId")
		keyID, err := strconv.ParseUint(keyIDStr, 10, 64)
		if err != nil || keyID == 0 {
			http.Error(w, "invalid keyId", http.StatusBadRequest)
			return
		}

		if err := authService.RevokeAPIKey(r.Context(), userID, uint(keyID)); err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "api key revoked"})
	}
}
