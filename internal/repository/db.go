package repository

import (
	"context"

	"gorm.io/gorm"
)

type Database struct {
	db *gorm.DB
}

func NewDB(db *gorm.DB) *Database {
	return &Database{db:db}
}

func(d *Database) MakeAPiKey(ctx context.Context ,userId string , name string , revoked bool ){
	
}
