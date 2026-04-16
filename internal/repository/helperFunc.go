package repository

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"time"
)

func generateMember() (string, int64, error) {
	now := time.Now().UnixMilli()
	b := make([]byte, 4)
	_, err := rand.Read(b)
	if err != nil {
		return "", 0, err
	}
	member := fmt.Sprintf("%d-%s", now, hex.EncodeToString(b))
	return member, now, nil
}