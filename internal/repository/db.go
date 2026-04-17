package repository

import (
	"github.com/tanay-io/RateSheild/internal/models"
	"gorm.io/gorm"
)

type DB struct {
	db *gorm.DB
}

func NewDB(dialector gorm.Dialector) (*DB, error) {
	db, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(&models.APIKey{}); err != nil {
		return nil, err
	}

	return &DB{db: db}, nil
}