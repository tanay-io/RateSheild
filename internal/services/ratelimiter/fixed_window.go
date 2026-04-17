package ratelimiter
import (
	"context"

	"github.com/tanay-io/RateSheild/internal/models"
	"github.com/tanay-io/RateSheild/internal/repository"
)

type FixedWindowLimiter struct {
	repo *repository.Algo
}

func NewFixedWindowLimiter(repo *repository.Algo) *FixedWindowLimiter {
	return &FixedWindowLimiter{repo: repo}
}

func (f *FixedWindowLimiter) Allow(ctx context.Context, key string, window, limit int) (models.RateLimitResponse, error) {

	res, err := f.repo.CheckFixedWindow(ctx, key, window, limit, "fixed")
	if err != nil {
		return models.RateLimitResponse{}, err
	}

	return models.RateLimitResponse{
		Allowed:    res.Allowed,
		Limit:      res.Limit,
		Remaining:  res.Remaining,
		RetryAfter: res.RetryAfter,
	}, nil
}