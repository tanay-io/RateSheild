package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/tanay-io/RateSheild/internal/models"
)

type Algo struct {
	rdb *redis.Client
}

func NewAlgo(rdb *redis.Client) *Algo {
	return &Algo{rdb: rdb}
}

func (a *Algo) CheckFixedWindow(ctx context.Context, key string, window, limit int, algo string) (models.RateLimitResponse, error) {
	now := time.Now().Unix()
	windowStartUnix := (now / int64(window)) * int64(window)
	redisKey := fmt.Sprintf("rl:%s:%s:%d", algo, key, windowStartUnix)
	pipe := a.rdb.TxPipeline()
	incRes := pipe.Incr(ctx, redisKey)
	ttlRes := pipe.TTL(ctx, redisKey)
	_, err := pipe.Exec(ctx)
	if err != nil {
		return models.RateLimitResponse{}, err
	}

	if ttlRes.Val() == -1 {
		a.rdb.Expire(ctx, redisKey, time.Duration(window)*time.Second)
	}
	count := int(incRes.Val())
	allowed := count <= limit
	remaining := limit - count
	if remaining < 0 {
		remaining = 0
	}
	retryAfter := 0
	if !allowed {
		windowEndUnix := windowStartUnix + int64(window)
		retryAfter = int(windowEndUnix - now)
	}
	return models.RateLimitResponse{
		Allowed:    allowed,
		Limit:      limit,
		Remaining:  remaining,
		RetryAfter: retryAfter,
	}, nil
}