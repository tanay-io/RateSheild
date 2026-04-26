package middlewares

import (
	"net/http/httptest"
	"testing"
)

func TestExtractBearerTokenFromAuthorizationHeader(t *testing.T) {
	req := httptest.NewRequest("GET", "/dashboard/stats", nil)
	req.Header.Set("Authorization", "Bearer token-123")

	token, err := extractBearerToken(req)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if token != "token-123" {
		t.Fatalf("expected token-123, got %q", token)
	}
}

func TestExtractBearerTokenFromWebsocketQuery(t *testing.T) {
	req := httptest.NewRequest("GET", "/dashboard/live?token=query-token", nil)
	req.Header.Set("Upgrade", "websocket")

	token, err := extractBearerToken(req)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if token != "query-token" {
		t.Fatalf("expected query-token, got %q", token)
	}
}

func TestExtractBearerTokenRejectsBadHeader(t *testing.T) {
	req := httptest.NewRequest("GET", "/dashboard/stats", nil)
	req.Header.Set("Authorization", "token-123")

	_, err := extractBearerToken(req)
	if err == nil {
		t.Fatal("expected an error")
	}
}
