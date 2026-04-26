package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
	"github.com/tanay-io/RateSheild/internal/models"
	"github.com/tanay-io/RateSheild/internal/repository"
)

func ListRules(db *repository.Database) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := userIDFromCtx(r)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		rules, err := db.GetRules(r.Context(), userID)
		if err != nil {
			http.Error(w, "failed to fetch rules", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(rules)
	}
}

func CreateRule(db *repository.Database) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := userIDFromCtx(r)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		var req models.Rule
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}
		if req.RoutePattern == "" || req.Algo == "" || req.Limit <= 0 || req.Window <= 0 {
			http.Error(w, "routePattern, algo, limit and window are required", http.StatusBadRequest)
			return
		}

		rule, err := db.CreateRule(r.Context(), userID, req)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(rule)
	}
}

func UpdateRule(db *repository.Database) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := userIDFromCtx(r)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		ruleIDStr := chi.URLParam(r, "ruleId")
		ruleID, err := strconv.ParseUint(ruleIDStr, 10, 64)
		if err != nil || ruleID == 0 {
			http.Error(w, "invalid ruleId", http.StatusBadRequest)
			return
		}

		var req models.Rule
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		updated, err := db.UpdateRule(r.Context(), userID, uint(ruleID), req)
		if err != nil {
			if err.Error() == "rule not found" {
				http.Error(w, "rule not found", http.StatusNotFound)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(updated)
	}
}

func DeleteRule(db *repository.Database) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := userIDFromCtx(r)
		if !ok {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		ruleIDStr := chi.URLParam(r, "ruleId")
		ruleID, err := strconv.ParseUint(ruleIDStr, 10, 64)
		if err != nil || ruleID == 0 {
			http.Error(w, "invalid ruleId", http.StatusBadRequest)
			return
		}

		if err := db.DeleteRule(r.Context(), userID, uint(ruleID)); err != nil {
			if err.Error() == "rule not found" {
				http.Error(w, "rule not found", http.StatusNotFound)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "rule deleted"})
	}
}
