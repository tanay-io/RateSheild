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

type User struct {
	ID           uint     `gorm:"primaryKey"`
	Email        string   `gorm:"not null"`
	HashPassword string   `gorm:"uniqueIndex;not null"`
	Name         string
	APIKeys      []APIKey `gorm:"foreignKey:UserID"`
}
