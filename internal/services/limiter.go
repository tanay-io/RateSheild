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
}

func NewRateLimiterService(lim Limiter) *RateLimiterService {
	return &RateLimiterService{
		fixedLimiter: lim,
	}
}

func (s *RateLimiterService) Allow(ctx context.Context, key string, window, limit int, algo string) (models.RateLimitResponse, error) {
	switch algo {
	case "fixed":
		return s.fixedLimiter.Allow(ctx, key, window, limit)
	default:
		return models.RateLimitResponse{}, fmt.Errorf("unknown algorithm")
	}
}