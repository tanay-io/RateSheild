package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/tanay-io/RateSheild/internal/services/app"
)


type MakeAPiKeyRequest struct {
	UserId string `json:"userId"`
    Name   string  `json:"name"`
	Revoked bool   `json:"revoked"`
}

func CreateApiKey(authService *app.Auth) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req MakeAPiKeyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.Header().Set("Content-Type", "application/json")
			http.Error(w, "bad req", http.StatusBadRequest)
			return
		}
	if req.Name=="" || req.Revoked!=false ||req.UserId ==""{
					w.Header().Set("Content-Type", "application/json")
			http.Error(w, "bad req", http.StatusBadRequest)
			return
		}
	}
	
}

