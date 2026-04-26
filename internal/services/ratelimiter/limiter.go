package ratelimiter

import (
	"context"
	"fmt"
	"time"

	"github.com/tanay-io/RateSheild/internal/models"
	"github.com/tanay-io/RateSheild/internal/repository"
)

type Limiter interface {
	Allow(ctx context.Context, key string, window, limit int) (models.RateLimitResponse, error)
}

type RateLimiterService struct {
	fixedLimiter   Limiter
	Sliding_window Limiter
	Token_bucket   Limiter
	repo           *repository.Algo
}

func NewRateLimiterService(fixed Limiter, sliding Limiter, token Limiter, repo *repository.Algo) *RateLimiterService {
	return &RateLimiterService{
		fixedLimiter:   fixed,
		Sliding_window: sliding,
		Token_bucket:   token,
		repo:           repo,
	}
}

func (s *RateLimiterService) Allow(ctx context.Context, key string, window, limit int, algo string) (models.RateLimitResponse, error) {
	switch algo {
	case "fixed":
		return s.fixedLimiter.Allow(ctx, key, window, limit)
	case "sliding":
		return s.Sliding_window.Allow(ctx, key, window, limit)
	case "token_bucket":
		return s.Token_bucket.Allow(ctx, key, window, limit)
	default:
		return models.RateLimitResponse{}, fmt.Errorf("unknown algorithm")
	}
}

func (s *RateLimiterService) AllowAndLog(
	ctx context.Context,
	key string,
	window, limit int,
	algo string,
	ip string,
	userID uint,
) (models.RateLimitResponse, error) {
	res, err := s.Allow(ctx, key, window, limit, algo)
	if err != nil {
		return res, err
	}

	entry := models.CheckLogEntry{
		Key:       key,
		Algo:      algo,
		Allowed:   res.Allowed,
		IP:        ip,
		Timestamp: time.Now().UTC(),
		UserID:    userID,
	}
	
	go func() {
		
		if logErr := s.repo.PushCheckLog(context.Background(), entry); logErr != nil {
			fmt.Printf("check log error: %v\n", logErr)
		}
	}()

	return res, nil
}