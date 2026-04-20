package models

import "time"

type APIKey struct {
	ID        uint      `gorm:"primaryKey"`
	KeyHash   string    `gorm:"uniqueIndex;not null"`
	UserID    uint      `gorm:"index;not null"`
	Name      string
	Prefix    string    `gorm:"index"`
	Revoked   bool
	CreatedAt time.Time
}
