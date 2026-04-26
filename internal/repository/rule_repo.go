package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/tanay-io/RateSheild/internal/models"
)

func (d *Database) CountActiveKeys(ctx context.Context, userID uint) (int64, error) {
	var count int64
	err := d.db.WithContext(ctx).
		Model(&models.APIKey{}).
		Where("user_id = ? AND revoked = false", userID).
		Count(&count).Error
	return count, err
}

func (d *Database) CreateRule(ctx context.Context, userID uint, req models.Rule) (models.Rule, error) {
	rule := models.Rule{
		UserID:       userID,
		RoutePattern: req.RoutePattern,
		Algo:         req.Algo,
		Limit:        req.Limit,
		Window:       req.Window,
		KeyBy:        req.KeyBy,
	}
	if rule.KeyBy == "" {
		rule.KeyBy = "ip"
	}
	if err := d.db.WithContext(ctx).Create(&rule).Error; err != nil {
		return models.Rule{}, fmt.Errorf("create rule: %w", err)
	}
	return rule, nil
}

func (d *Database) GetRules(ctx context.Context, userID uint) ([]models.Rule, error) {
	var rules []models.Rule
	err := d.db.WithContext(ctx).
		Where("user_id = ? AND deleted_at IS NULL", userID).
		Order("created_at DESC").
		Find(&rules).Error
	return rules, err
}

func (d *Database) UpdateRule(ctx context.Context, userID uint, ruleID uint, req models.Rule) (models.Rule, error) {
	var rule models.Rule
	if err := d.db.WithContext(ctx).
		Where("id = ? AND user_id = ? AND deleted_at IS NULL", ruleID, userID).
		First(&rule).Error; err != nil {
		return models.Rule{}, fmt.Errorf("rule not found")
	}

	if req.RoutePattern != "" {
		rule.RoutePattern = req.RoutePattern
	}
	if req.Algo != "" {
		rule.Algo = req.Algo
	}
	if req.Limit != 0 {
		rule.Limit = req.Limit
	}
	if req.Window != 0 {
		rule.Window = req.Window
	}
	if req.KeyBy != "" {
		rule.KeyBy = req.KeyBy
	}

	if err := d.db.WithContext(ctx).Save(&rule).Error; err != nil {
		return models.Rule{}, fmt.Errorf("update rule: %w", err)
	}
	return rule, nil
}

func (d *Database) DeleteRule(ctx context.Context, userID uint, ruleID uint) error {
	now := time.Now().UTC()
	result := d.db.WithContext(ctx).
		Model(&models.Rule{}).
		Where("id = ? AND user_id = ? AND deleted_at IS NULL", ruleID, userID).
		Update("deleted_at", now)

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("rule not found")
	}
	return nil
}
