package models

import "time"

type RateLimitResponse struct {
	Allowed    bool
	Limit      int
	Remaining  int
	RetryAfter int
}

type MakeAPiKeyResponse struct {
	Key string `json:"key"`
}

type APIKeyResponse struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Prefix    string    `json:"prefix"`
	Revoked   bool      `json:"revoked"`
	CreatedAt time.Time `json:"createdAt"`
}

type APIKeyListResponse struct {
	Keys []APIKeyResponse `json:"keys"`
}