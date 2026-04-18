package repository

import (
	"crypto/rand"
	"crypto/sha256"
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

func generateAPIKey() string {
	b := make([]byte, 32)
	rand.Read(b)
	return hex.EncodeToString(b)
}
func hashKey(key string) string {
	hash := sha256.Sum256([]byte(key))
	return hex.EncodeToString(hash[:])
}