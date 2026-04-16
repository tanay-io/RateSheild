package services

import (
	"context"

	"github.com/tanay-io/RateSheild/internal/models"
	"github.com/tanay-io/RateSheild/internal/repository"
)

type Sliding_window struct {
	repo *repository.Algo
}

func NewSlidingWindowService (repo *repository.Algo) *Sliding_window {
	return &Sliding_window{repo: repo}
}
func (s *Sliding_window ) Allow(ctx context.Context, key string, window, limit int ) (models.RateLimitResponse, error) {
	res, err := s.repo.CheckSlidingWindow(ctx , key ,window,limit ,"sliding")
	if err != nil {
		return models.RateLimitResponse{}, err
	}
	return models.RateLimitResponse{
		Allowed: res.Allowed,
		Limit: res.Limit,
		Remaining: res.Remaining,
		RetryAfter: res.RetryAfter,
	}, nil
}