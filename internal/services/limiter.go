package services

import (
	"context"
	"fmt"

	"github.com/tanay-io/RateSheild/internal/models"
)

type Limiter interface {
	Allow(ctx context.Context, key string, window, limit int) (models.RateLimitResponse, error)
}

type RateLimiterService struct {
	fixedLimiter Limiter
	Sliding_window Limiter
	Token_bucket Limiter
}

func NewRateLimiterService(fixed Limiter, sliding Limiter,token Limiter) *RateLimiterService {
	return &RateLimiterService{
		fixedLimiter: fixed,
		Sliding_window: sliding,
		Token_bucket: token,
	}
}

func (s *RateLimiterService) Allow(ctx context.Context, key string, window, limit int, algo string) (models.RateLimitResponse, error) {
	switch algo {
	case "fixed":
		return s.fixedLimiter.Allow(ctx, key, window, limit)
	case "sliding":
		return s.Sliding_window.Allow(ctx ,key,window,limit)
	default:
		return models.RateLimitResponse{}, fmt.Errorf("unknown algorithm")
	}
}