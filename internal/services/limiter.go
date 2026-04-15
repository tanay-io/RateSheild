package services

import "context"

type Result struct {
	Allowed    bool
	Limit      int
	Remaining  int
	RetryAfter int
}

type Limiter interface {
	Allow(ctx context.Context, key string, window, limit int) (Result, error)
	
}
