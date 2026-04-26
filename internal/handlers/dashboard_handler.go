package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/tanay-io/RateSheild/internal/middlewares"
	"github.com/tanay-io/RateSheild/internal/repository"
)

func GetStats(redisRepo *repository.Algo, dbRepo *repository.Database) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := userIDFromCtx(r)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		activeKeys, err := dbRepo.CountActiveKeys(r.Context(), userID)
		if err != nil {
			http.Error(w, "failed to count active keys", http.StatusInternalServerError)
			return
		}

		stats, err := redisRepo.GetStats(r.Context(), userID, activeKeys)
		if err != nil {
			http.Error(w, "failed to read stats", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(stats)
	}
}

func GetLogs(redisRepo *repository.Algo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value(middlewares.UserIDKey).(uint)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		limit := 50
		if raw := r.URL.Query().Get("limit"); raw != "" {
			if n, err := strconv.Atoi(raw); err == nil && n > 0 {
				limit = n
			}
		}

		entries, err := redisRepo.GetLogs(r.Context(), userID, limit)
		if err != nil {
			http.Error(w, "failed to read logs", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(entries)
	}
}
