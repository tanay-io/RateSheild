package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/tanay-io/RateSheild/internal/models"
	auth "github.com/tanay-io/RateSheild/internal/services/auth"
	"gorm.io/gorm"
)

func Register(authService *auth.Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req models.RegisterRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		if req.Email == "" || req.Password == "" || req.Name == "" {
			http.Error(w, "email, password, and name are required", http.StatusBadRequest)
			return
		}

		res, err := authService.Register(r.Context(), req.Email, req.Password, req.Name)
		if err != nil {
			if errors.Is(err, gorm.ErrDuplicatedKey) {
				http.Error(w, "email already registered", http.StatusConflict)
				return
			}
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		_ = json.NewEncoder(w).Encode(res)
	}
}

func Login(authService *auth.Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req models.LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		if req.Email == "" || req.Password == "" {
			http.Error(w, "email and password are required", http.StatusBadRequest)
			return
		}

		res, err := authService.Login(r.Context(), req.Email, req.Password)
		if err != nil {
			if errors.Is(err, auth.ErrInvalidCredentials) {
				http.Error(w, err.Error(), http.StatusUnauthorized)
				return
			}
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(res)
	}
}
