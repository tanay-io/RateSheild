package auth

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/tanay-io/RateSheild/internal/models"
	"github.com/tanay-io/RateSheild/internal/repository"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrInvalidToken       = errors.New("invalid token")
)

type Service struct {
	db        *repository.Database
	jwtSecret []byte
	ttl       time.Duration
}

type claims struct {
	Sub string `json:"sub"`
	Exp int64  `json:"exp"`
	Iat int64  `json:"iat"`
}

func NewService(db *repository.Database, jwtSecret string) *Service {
	return &Service{
		db:        db,
		jwtSecret: []byte(jwtSecret),
		ttl:       24 * time.Hour,
	}
}

func (s *Service) Register(ctx context.Context, email string, password string, name string) (models.AuthResponse, error) {
	_, err := s.db.GetUserByEmail(ctx, email)
	if err == nil {
		return models.AuthResponse{}, gorm.ErrDuplicatedKey
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return models.AuthResponse{}, err
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return models.AuthResponse{}, err
	}

	user, err := s.db.Signup(ctx, email, string(passwordHash), name)
	if err != nil {
		return models.AuthResponse{}, err
	}

	token, err := s.GenerateToken(user.ID)
	if err != nil {
		return models.AuthResponse{}, err
	}

	return models.AuthResponse{
		Token: token,
		User:  toUserDTO(user),
	}, nil
}

func (s *Service) Login(ctx context.Context, email string, password string) (models.AuthResponse, error) {
	user, err := s.db.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return models.AuthResponse{}, ErrInvalidCredentials
		}
		return models.AuthResponse{}, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.HashPassword), []byte(password)); err != nil {
		return models.AuthResponse{}, ErrInvalidCredentials
	}

	token, err := s.GenerateToken(user.ID)
	if err != nil {
		return models.AuthResponse{}, err
	}

	return models.AuthResponse{
		Token: token,
		User:  toUserDTO(user),
	}, nil
}

func (s *Service) GenerateToken(userID uint) (string, error) {
	now := time.Now().Unix()
	tokenClaims := claims{
		Sub: strconv.FormatUint(uint64(userID), 10),
		Iat: now,
		Exp: now + int64(s.ttl.Seconds()),
	}

	headerJSON, err := json.Marshal(map[string]string{
		"alg": "HS256",
		"typ": "JWT",
	})
	if err != nil {
		return "", err
	}

	payloadJSON, err := json.Marshal(tokenClaims)
	if err != nil {
		return "", err
	}

	header := base64.RawURLEncoding.EncodeToString(headerJSON)
	payload := base64.RawURLEncoding.EncodeToString(payloadJSON)
	signingInput := header + "." + payload

	mac := hmac.New(sha256.New, s.jwtSecret)
	if _, err := mac.Write([]byte(signingInput)); err != nil {
		return "", err
	}

	signature := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
	return signingInput + "." + signature, nil
}

func (s *Service) ValidateToken(token string) (uint, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return 0, ErrInvalidToken
	}

	signingInput := parts[0] + "." + parts[1]
	mac := hmac.New(sha256.New, s.jwtSecret)
	if _, err := mac.Write([]byte(signingInput)); err != nil {
		return 0, err
	}

	expectedSignature := base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
	if !hmac.Equal([]byte(expectedSignature), []byte(parts[2])) {
		return 0, ErrInvalidToken
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return 0, ErrInvalidToken
	}

	var tokenClaims claims
	if err := json.Unmarshal(payloadBytes, &tokenClaims); err != nil {
		return 0, ErrInvalidToken
	}

	if time.Now().Unix() >= tokenClaims.Exp {
		return 0, fmt.Errorf("%w: token expired", ErrInvalidToken)
	}

	userID, err := strconv.ParseUint(tokenClaims.Sub, 10, 64)
	if err != nil || userID == 0 {
		return 0, ErrInvalidToken
	}

	return uint(userID), nil
}

func toUserDTO(user models.User) models.UserDTO {
	return models.UserDTO{
		ID:    user.ID,
		Email: user.Email,
		Name:  user.Name,
	}
}
