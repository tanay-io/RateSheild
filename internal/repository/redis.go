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

func (a * Algo) CheckSlidingWindow(ctx context.Context, key string, window, limit int, algo string)(models.RateLimitResponse, error){
	member, now, err:= generateMember()
		if err != nil {
		return models.RateLimitResponse{}, err
	}

	windowStartUnix := now - int64(window*1000)
	redisKey := fmt.Sprintf("rl:%s:%s", algo, key)
	pipe := a.rdb.TxPipeline()
	//remove all the req older than the hmara jaha se vo window start hua hai
	pipe.ZRemRangeByScore(ctx, redisKey, "0", fmt.Sprintf("%d", windowStartUnix))
	// add the entry of the current req 
	pipe.ZAdd(ctx, redisKey, redis.Z{
		Score:  float64(now),
		Member: member,
	})

	countReq := pipe.ZCard(ctx, redisKey)
	pipe.Expire(ctx, redisKey, time.Duration(window)*time.Second) 
	
	_, err = pipe.Exec(ctx)
	if err != nil {
		return models.RateLimitResponse{}, err
	}

	count := int(countReq.Val())
		allowed := count<= limit
		remaining := limit-count
		if(remaining < 0){
			remaining=0;
		}
		fmt.Println("COUNT:", count, "LIMIT:", limit)
		return models.RateLimitResponse{
			Allowed: allowed,
			Limit: limit,
			Remaining: remaining,
			RetryAfter: 0,
		},nil
	
}
