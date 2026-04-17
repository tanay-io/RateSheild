package repository

import "github.com/redis/go-redis/v9"

var slidingWindowScript = redis.NewScript(`
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member = ARGV[4]

local windowStart = now - window

redis.call("ZREMRANGEBYSCORE", key, 0, windowStart)
redis.call("ZADD", key, now, member)

local count = redis.call("ZCARD", key)

redis.call("PEXPIRE", key, window)

local allowed = 0
if count <= limit then
    allowed = 1
end

local remaining = limit - count
if remaining < 0 then
    remaining = 0
end

return {allowed, count, remaining}
`)
var tokenBucketScript = redis.NewScript(
        `local key = KEYS[1]
        local now = tonumber(ARGV[1])
        local window = tonumber(ARGV[2])
        local limit = tonumber(ARGV[3])
         

        local data = redis.call("HMGET", key, "tokens", "last_refill")
        local tokens = tonumber(data[1]) or limit
        local lastRefill = tonumber(data[2]) or now

        local timePassed = now - lastRefill
        local tokensToAdd = 0

        if timePassed > 0 then 
            tokensToAdd = math.floor((timePassed * limit) / window)

            if tokensToAdd > 0 then
                tokens = math.min(limit, tokens + tokensToAdd)
                lastRefill = lastRefill + (tokensToAdd * window) / limit
            end 
        end 

        local allowed = false 

        if tokens > 0 then
            tokens = math.floor(tokens - 1)
            allowed = true
        end 

        redis.call("HSET", key,
            "tokens", tokens,
            "last_refill", lastRefill
        )
        redis.call("EXPIRE", key, math.ceil(window / 1000))
        return {allowed, tokens}
        `)
