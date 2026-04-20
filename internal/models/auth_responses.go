package models

type AuthResponse struct {
	Token string  `json:"token"`
	User  UserDTO `json:"user"`
}

type UserDTO struct {
	ID    uint   `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}
