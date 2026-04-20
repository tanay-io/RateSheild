package repository

import (
	"context"
	"fmt"

	"github.com/tanay-io/RateSheild/internal/models"
	"gorm.io/gorm"
)

type Database struct {
	db *gorm.DB
}

func NewDB(db *gorm.DB) *Database {
	return &Database{db: db}
}

func (d *Database) MakeAPiKey(ctx context.Context, userID uint, name string) (models.MakeAPiKeyResponse, error) {
	var count int64
	err := d.db.WithContext(ctx).Model(&models.User{}).Where("id = ?", userID).Count(&count).Error
	if err != nil {
		return models.MakeAPiKeyResponse{}, err
	}
	if count == 0 {
		return models.MakeAPiKeyResponse{}, fmt.Errorf("user not found")
	}

	rawApiKey := generateAPIKey()
	hashApiKey := hashKey(rawApiKey)
	prefix := rawApiKey[:6]
	apiKey := models.APIKey{
		KeyHash: hashApiKey,
		UserID:  userID,
		Name:    name,
		Revoked: false,
		Prefix:  prefix,
	}

	if err := d.db.WithContext(ctx).Create(&apiKey).Error; err != nil {
		return models.MakeAPiKeyResponse{}, err
	}

	return models.MakeAPiKeyResponse{
		Key: rawApiKey,
	}, nil
}

func (d *Database) GetAPIKeysByUser(ctx context.Context, userID uint) ([]models.APIKeyResponse, error) {
	var keys []models.APIKey
	err := d.db.WithContext(ctx).Where("user_id = ?", userID).Find(&keys).Error
	if err != nil {
		return nil, err
	}

	result := make([]models.APIKeyResponse, len(keys))
	for i, k := range keys {
		result[i] = models.APIKeyResponse{
			ID:        k.ID,
			Name:      k.Name,
			Prefix:    k.Prefix,
			Revoked:   k.Revoked,
			CreatedAt: k.CreatedAt,
		}
	}
	return result, nil
}

func (d *Database) RevokeAPIKey(ctx context.Context, userID uint, keyID uint) error {
	result := d.db.WithContext(ctx).
		Model(&models.APIKey{}).
		Where("id = ? AND user_id = ?", keyID, userID).
		Update("revoked", true)

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("api key not found")
	}
	return nil
}

func (d *Database) ValidateAPIKey(ctx context.Context, rawKey string) (models.APIKey, error) {
	hashed := hashKey(rawKey)

	var apiKey models.APIKey
	err := d.db.WithContext(ctx).Where("key_hash = ?", hashed).First(&apiKey).Error
	if err != nil {
		return models.APIKey{}, fmt.Errorf("invalid api key")
	}
	if apiKey.Revoked {
		return models.APIKey{}, fmt.Errorf("api key has been revoked")
	}
	return apiKey, nil
}
