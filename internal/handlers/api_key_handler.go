package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
	auth "github.com/tanay-io/RateSheild/internal/services/apiKey"
)

type MakeAPiKeyRequest struct {
	UserId uint   `json:"userId"`
	Name   string `json:"name"`
}

func CreateApiKey(authService *auth.Auth) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req MakeAPiKeyRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.Header().Set("Content-Type", "application/json")
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		if req.Name == "" || req.UserId == 0 {
			w.Header().Set("Content-Type", "application/json")
			http.Error(w, "name and userId are required", http.StatusBadRequest)
			return
		}

		ctx := r.Context()
		res, err := authService.CreateApiKey(ctx, req.UserId, req.Name)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(res)
	}
}

// GET /apikeys/{userId} 
func GetAPIKeys(authService *auth.Auth) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userIDStr := chi.URLParam(r, "userId")
		userID, err := strconv.ParseUint(userIDStr, 10, 64)
		if err != nil || userID == 0 {
			http.Error(w, "invalid userId", http.StatusBadRequest)
			return
		}

		ctx := r.Context()
		res, err := authService.GetAPIKeys(ctx, uint(userID))
		if err != nil {
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	}
}

//DELETE /apikeys/{userId}/{keyId}
func RevokeAPIKey(authService *auth.Auth) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userIDStr := chi.URLParam(r, "userId")
		userID, err := strconv.ParseUint(userIDStr, 10, 64)
		if err != nil || userID == 0 {
			http.Error(w, "invalid userId", http.StatusBadRequest)
			return
		}

		keyIDStr := chi.URLParam(r, "keyId")
		keyID, err := strconv.ParseUint(keyIDStr, 10, 64)
		if err != nil || keyID == 0 {
			http.Error(w, "invalid keyId", http.StatusBadRequest)
			return
		}

		ctx := r.Context()
		if err := authService.RevokeAPIKey(ctx, uint(userID), uint(keyID)); err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "api key revoked"})
	}
}
