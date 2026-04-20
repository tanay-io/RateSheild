package auth

import (
	"context"

	"github.com/tanay-io/RateSheild/internal/models"
	"github.com/tanay-io/RateSheild/internal/repository"
)

type Auth struct {
	db *repository.Database
}

func NewAuth(db *repository.Database) *Auth {
	return &Auth{db: db}
}

func (a *Auth) CreateApiKey(ctx context.Context, userId uint, name string) (models.MakeAPiKeyResponse, error) {
	res, err := a.db.MakeAPiKey(ctx, userId, name)
	if err != nil {
		return models.MakeAPiKeyResponse{}, err
	}
	return res, nil
}

func (a *Auth) GetAPIKeys(ctx context.Context, userID uint) (models.APIKeyListResponse, error) {
	keys, err := a.db.GetAPIKeysByUser(ctx, userID)
	if err != nil {
		return models.APIKeyListResponse{}, err
	}
	return models.APIKeyListResponse{Keys: keys}, nil
}

func (a *Auth) RevokeAPIKey(ctx context.Context, userID uint, keyID uint) error {
	return a.db.RevokeAPIKey(ctx, userID, keyID)
}

func (a *Auth) ValidateAPIKey(ctx context.Context, rawKey string) (models.APIKey, error) {
	return a.db.ValidateAPIKey(ctx, rawKey)
}