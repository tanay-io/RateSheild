package models

type User struct {
	ID           uint     `gorm:"primaryKey"`
	Email        string   `gorm:"uniqueIndex;not null"`
	HashPassword string   `gorm:"not null"`
	Name         string   `gorm:"not null"`
	APIKeys      []APIKey `gorm:"foreignKey:UserID"`
}
