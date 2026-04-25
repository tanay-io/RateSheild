package hub

import (
	"context"
	"encoding/json"

	"github.com/redis/go-redis/v9"
)

func (h *Hub) StartGlobalSubscriber(redisClient *redis.Client) {
	ctx := context.Background()

	pubsub := redisClient.PSubscribe(ctx, "events:*")
	defer pubsub.Close()

	for msg := range pubsub.Channel() {
		var event struct {
			UserID  uint            `json:"userId"`
			Payload json.RawMessage `json:"payload"`
		}

		if err := json.Unmarshal([]byte(msg.Payload), &event); err != nil {
			continue
		}

		payloadBytes := event.Payload 
		h.Broadcast <- &Message{
			UserID:  event.UserID,
			Payload: payloadBytes,
		}
	}
}