package repository

import (
	"context"

	"github.com/tanay-io/RateSheild/internal/models"
)

func (d *Database) Signup(ctx context.Context, email string, passwordHash string, name string) (models.User, error) {
	user := models.User{
		Email:        email,
		HashPassword: passwordHash,
		Name:         name,
	}

	if err := d.db.WithContext(ctx).Create(&user).Error; err != nil {
		return models.User{}, err
	}

	return user, nil
}

func (d *Database) GetUserByEmail(ctx context.Context, email string) (models.User, error) {
	var user models.User
	if err := d.db.WithContext(ctx).Where("email = ?", email).First(&user).Error; err != nil {
		return models.User{}, err
	}
	return user, nil
}

func (d *Database) GetUserByID(ctx context.Context, userID uint) (models.User, error) {
	var user models.User
	if err := d.db.WithContext(ctx).First(&user, userID).Error; err != nil {
		return models.User{}, err
	}
	return user, nil
}
