package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/tanay-io/RateSheild/internal/middlewares"
	"github.com/tanay-io/RateSheild/internal/services/ratelimiter"
)

type Request struct {
	Key    string `json:"key"`
	Algo   string `json:"algo"`
	Window int    `json:"window"`
	Limit  int    `json:"limit"`
}

func Check(limiter *ratelimiter.RateLimiterService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req Request
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.Header().Set("Content-Type", "application/json")
			http.Error(w, "bad req", http.StatusBadRequest)
			return
		}
		if req.Key == "" || req.Window <= 0 || req.Limit <= 0 {
			w.Header().Set("Content-Type", "application/json")
			http.Error(w, "bad req", http.StatusBadRequest)
			return
		}

		ctx := r.Context()

		userID, _ := ctx.Value(middlewares.UserIDKey).(uint)

		ip := r.Header.Get("X-Forwarded-For")
		if ip == "" {
			ip = r.RemoteAddr
		}

		if limiter != nil {
			res, err := limiter.AllowAndLog(ctx, req.Key, req.Window, req.Limit, req.Algo, ip, userID)
			if err != nil {
				http.Error(w, "internal service error", http.StatusInternalServerError)
				return
			}
			if !res.Allowed {
				http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
				return
			}
		}
		
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	}
}
