package services

import (
	"context"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

type FixedWindow struct{
	rdb *redis.Client
}

func NewFixedWindow(rdb *redis.Client) *FixedWindow {
	return &FixedWindow{rdb: rdb}
}

func (fw *FixedWindow) Allow(ctx context.Context, key string, window, limit int, algo string) (Result, error) {
	now := time.Now().Unix()
	windowStartUnix := (now / int64(window)) * int64(window)
	redisKey := fmt.Sprintf("rl:%s:%s:%d", algo, key, windowStartUnix)
	windowDuration := time.Duration(window) * time.Second
	pipe := fw.rdb.TxPipeline()
	incrRes := pipe.Incr(ctx,redisKey)
	pipe.Expire(ctx, redisKey, windowDuration) 
	_, err := pipe.Exec(ctx)
	if err != nil {
		return Result{}, err
	}

	count := int(incrRes.Val())
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

	fmt.Println("Generated Redis Key:", redisKey, "Count:", count, "TTL:", window, "seconds")
	
	return Result{
		Allowed:    allowed,
		Limit:      limit,
		Remaining:  remaining,
		RetryAfter: retryAfter,
	}, nil
}

