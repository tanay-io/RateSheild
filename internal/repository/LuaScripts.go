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
