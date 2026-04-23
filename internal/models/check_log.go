package models

import "time"


type CheckLogEntry struct {
	Key       string    `json:"key"`
	Algo      string    `json:"algo"`
	Allowed   bool      `json:"allowed"`
	IP        string    `json:"ip"`
	Timestamp time.Time `json:"timestamp"`
	UserID    uint      `json:"userId"`
}
