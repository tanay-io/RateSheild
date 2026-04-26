package models

type StatsResponse struct {
	TotalRequests int64 `json:"total_requests"`
	AllowedCount  int64 `json:"allowed_count"`
	BlockedCount  int64 `json:"blocked_count"`
	ActiveKeys    int64 `json:"active_keys"`
}
