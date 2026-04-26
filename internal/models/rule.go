package models

import "time"

type Rule struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	UserID       uint       `json:"userId" gorm:"not null;index"`
	RoutePattern string     `json:"routePattern" gorm:"not null"`
	Algo         string     `json:"algo" gorm:"not null"`
	Limit        int        `json:"limit" gorm:"not null"`
	Window       int        `json:"window" gorm:"not null"`
	KeyBy        string     `json:"keyBy" gorm:"not null;default:'ip'"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
	DeletedAt    *time.Time `json:"deletedAt,omitempty" gorm:"index"`
}
