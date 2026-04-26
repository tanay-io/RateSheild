package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
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
	now := time.Now().UnixMilli()
	windowMs := int64(window)
	windowStartUnix := (now / windowMs) * windowMs
	redisKey := fmt.Sprintf("rl:%s:%s:%d", algo, key, windowStartUnix)
	pipe := a.rdb.TxPipeline()
	incRes := pipe.Incr(ctx, redisKey)
	ttlRes := pipe.TTL(ctx, redisKey)
	_, err := pipe.Exec(ctx)
	if err != nil {
		return models.RateLimitResponse{}, err
	}

	if ttlRes.Val() == -1 {
		a.rdb.PExpire(ctx, redisKey, time.Duration(windowMs)*time.Millisecond)
	}
	count := int(incRes.Val())
	allowed := count <= limit
	remaining := limit - count
	if remaining < 0 {
		remaining = 0
	}
	retryAfter := 0
	if !allowed {
		windowEndUnix := windowStartUnix + windowMs
		retryAfter = int(windowEndUnix - now)
	}
	return models.RateLimitResponse{
		Allowed:    allowed,
		Limit:      limit,
		Remaining:  remaining,
		RetryAfter: retryAfter,
	}, nil
}
func (a *Algo) CheckSlidingWindow(ctx context.Context, key string, window, limit int, algo string) (models.RateLimitResponse, error) {
	member, now, err := generateMember()
	if err != nil {
		return models.RateLimitResponse{}, err
	}

	windowMs := int64(window)
	windowStartUnix := now - windowMs
	redisKey := fmt.Sprintf("rl:%s:%s", algo, key)
	pipe := a.rdb.TxPipeline()
	//remove all the req older than the hmara jaha se vo window start hua hai
	pipe.ZRemRangeByScore(ctx, redisKey, "0", fmt.Sprintf("%d", windowStartUnix))

	pipe.ZAdd(ctx, redisKey, redis.Z{
		Score:  float64(now),
		Member: member,
	})

	countReq := pipe.ZCard(ctx, redisKey)
	pipe.Expire(ctx, redisKey, time.Duration(windowMs)*time.Millisecond)
	_, err = pipe.Exec(ctx)
	if err != nil {
		return models.RateLimitResponse{}, err
	}

	count := int(countReq.Val())
	allowed := count <= limit
	remaining := limit - count
	if remaining < 0 {
		remaining = 0
	}
	fmt.Println("COUNT:", count, "LIMIT:", limit)
	return models.RateLimitResponse{
		Allowed:    allowed,
		Limit:      limit,
		Remaining:  remaining,
		RetryAfter: 0,
	}, nil

}
func (a *Algo) CheckTokenBucket(ctx context.Context, key string, window int, limit int, algo string) (models.RateLimitResponse, error) {

	now := time.Now().UnixMilli()
	redisKey := fmt.Sprintf("r1:%s:%s", algo, key)

	capacity := int64(limit)
	windowMs := int64(window)

	vals, err := a.rdb.HMGet(ctx, redisKey, "tokens", "last_refill").Result()
	if err != nil {
		return models.RateLimitResponse{}, err
	}

	var tokens int64
	var lastRefill int64

	if vals[0] == nil || vals[1] == nil {
		tokens = capacity
		lastRefill = now
	} else {
		tokens, _ = strconv.ParseInt(vals[0].(string), 10, 64)
		lastRefill, _ = strconv.ParseInt(vals[1].(string), 10, 64)
	}

	timePassed := now - lastRefill
	if timePassed > 0 {
		tokensToAdd := (timePassed * capacity) / windowMs
		if tokensToAdd > 0 {
			tokens = min(capacity, tokens+tokensToAdd)
			//important line we saved .sometime here ex if 10000ms is now but we add 2 tokens if we did lastrefill now we would be adding only 2tokens we wasted 0.5ms
			//but by doing this tokens to add 2 * 10000 / capacity(limit)=>exact amount of time taken that we add to lastrefill
			lastRefill += (tokensToAdd * windowMs) / capacity
		}
	}

	allowed := false
	if tokens > 0 {
		tokens--
		allowed = true
	}

	pipe := a.rdb.TxPipeline()
	pipe.HSet(ctx, redisKey, map[string]interface{}{
		"tokens":      tokens,
		"last_refill": lastRefill,
	})
	pipe.Expire(ctx, redisKey, time.Duration(windowMs*2)*time.Millisecond)

	_, err = pipe.Exec(ctx)
	if err != nil {
		return models.RateLimitResponse{}, err
	}

	return models.RateLimitResponse{
		Allowed:   allowed,
		Remaining: int(tokens),
	}, nil
}

func (a *Algo) CheckSlidingWindow_via_Lua(ctx context.Context, key string, window int, limit int, algo string) (models.RateLimitResponse, error) {
	member, now, err := generateMember()
	if err != nil {
		return models.RateLimitResponse{}, err
	}
	windowMs := int64(window)
	redisKey := fmt.Sprintf("rl:%s:%s", algo, key)
	res, err := slidingWindowScript.Run(
		ctx,
		a.rdb,
		[]string{redisKey},
		now,
		windowMs,
		limit,
		member,
	).Result()
	if err != nil {
		return models.RateLimitResponse{}, err
	}
	vals, ok := res.([]interface{})
	if !ok {
		return models.RateLimitResponse{}, fmt.Errorf("unexpected response type")
	}

	if len(vals) < 3 {
		return models.RateLimitResponse{}, fmt.Errorf("invalid lua response")
	}

	allowed := vals[0].(int64) == 1

	remainingVal, ok := vals[2].(int64)
	if !ok {
		return models.RateLimitResponse{}, fmt.Errorf("invalid remaining type")
	}

	return models.RateLimitResponse{
		Allowed:    allowed,
		Limit:      limit,
		Remaining:  int(remainingVal),
		RetryAfter: 0,
	}, nil
}

func (a *Algo) CheckTokenBucket_via_Lua(ctx context.Context, key string, window int, limit int, algo string) (models.RateLimitResponse, error) {
	now := time.Now().UnixMilli()
	redisKey := fmt.Sprintf("r1:%s:%s", algo, key)
	capacity := int64(limit)
	windowMs := int64(window)
	res, err := tokenBucketScript.Run(
		ctx,
		a.rdb,
		[]string{redisKey},
		now,
		windowMs,
		capacity,
	).Result()

	if err != nil {
		return models.RateLimitResponse{}, err
	}
	vals, ok := res.([]interface{})
	if !ok {
		return models.RateLimitResponse{}, fmt.Errorf("unexpected response type")
	}

	if len(vals) < 2 {
		return models.RateLimitResponse{}, fmt.Errorf("invalid lua response")
	}

	allowedVal, ok := vals[0].(int64)
	if !ok {
		return models.RateLimitResponse{}, fmt.Errorf("invalid allowed type")
	}
	allowed := allowedVal == 1

	tokens, ok := vals[1].(int64)
	if !ok {
		return models.RateLimitResponse{}, fmt.Errorf("invalid remaining type")
	}
	return models.RateLimitResponse{
		Allowed:   allowed,
		Remaining: int(tokens),
	}, nil

}


func (a *Algo) PushCheckLog(ctx context.Context, entry models.CheckLogEntry) error {
	data, err := json.Marshal(entry)
	if err != nil {
		return fmt.Errorf("log marshal: %w", err)
	}

	listKey := fmt.Sprintf("log:user:%d", entry.UserID)
	pipe := a.rdb.Pipeline()
	pipe.LPush(ctx, listKey, data)
	pipe.LTrim(ctx, listKey, 0, 999)
	pipe.Incr(ctx, "stats:total_requests")
	if entry.Allowed {
		pipe.Incr(ctx, "stats:allowed_count")
	} else {
		pipe.Incr(ctx, "stats:blocked_count")
	}

	if _, err = pipe.Exec(ctx); err != nil {
		return err
	}

	type envelope struct {
		UserID  uint            `json:"userId"`
		Payload json.RawMessage `json:"payload"`
	}
	env, err := json.Marshal(envelope{UserID: entry.UserID, Payload: data})
	if err != nil {
		return fmt.Errorf("event envelope marshal: %w", err)
	}

	channel := fmt.Sprintf("events:user:%d", entry.UserID)
	return a.rdb.Publish(ctx,channel ,env).Err()
}

