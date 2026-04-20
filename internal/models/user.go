package models

type User struct {
	ID           uint   `gorm:"primaryKey"`
	Email        string `gorm:"not null"`
	HashPassword string `gorm:"uniqueIndex;not null"`
	Name         string
	APIKeys      []APIKey `gorm:"foreignKey:UserID"`
}
