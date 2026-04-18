package repository

import (
	"context"

	"github.com/tanay-io/RateSheild/internal/models"
	"gorm.io/gorm"
)

type Database struct {
	db *gorm.DB
}

func NewDB(db *gorm.DB) *Database {
	return &Database{db:db}
}

func(d *Database) MakeAPiKey(ctx context.Context ,userID uint , name string , revoked bool )(models.MakeAPiKeyResponse,error){
	var count int64
	err := d.db.WithContext(ctx).Model(&models.User{}).Where("id = ?",userID).Count(&count).Error
	if(err!=nil){
		return models.MakeAPiKeyResponse{},err
	}
		if count == 0 {
		return models.MakeAPiKeyResponse{},err
	}
	rawApiKey:= generateAPIKey()
	hashApiKey := hashKey(rawApiKey)
	prefix := rawApiKey[:6]

	apiKey := models.APIKey{
		KeyHash: hashApiKey,
		UserID:  userID,
		Name: name,
		Revoked: false,
		Prefix: prefix,
	}
	 res:= d.db.WithContext(ctx).Create(&apiKey).Error
	 if res!=nil{
		return models.MakeAPiKeyResponse{},res
	 }

	return models.MakeAPiKeyResponse{
		Key: rawApiKey,
	},nil



}
