package models

type RateLimitResponse struct {
	Allowed    bool
	Limit      int
	Remaining  int
	RetryAfter int
}