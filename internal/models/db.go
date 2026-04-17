package models

import "time"

type APIKey struct {
	ID        uint   `gorm:"primaryKey"`
	KeyHash   string `gorm:"uniqueIndex;not null"`
	UserId    string `gorm:"index;not null"`
	Name      string
	Revoked   bool
	CreatedAt time.Time
	Prefix string `gorm:"index"`
}

