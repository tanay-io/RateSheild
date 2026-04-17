package app

import (
	"context"

	"github.com/tanay-io/RateSheild/internal/models"
	"github.com/tanay-io/RateSheild/internal/repository"
)

type Auth struct {
	db *repository.Database
}
func NewAuth(db *repository.Database) *Auth {
	return &Auth{db : db}
}

func (a *Auth)CreateApiKey(ctx context.Context , userId string , name string , revoked bool) (models.MakeAPiKeyResponse,error){
	
}