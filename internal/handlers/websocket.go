package handlers

import (
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"github.com/tanay-io/RateSheild/internal/hub"
	"github.com/tanay-io/RateSheild/internal/middlewares"
)

func LiveHandler(h *hub.Hub, allowedOrigins []string) http.HandlerFunc {
	allowed := normalizeAllowedOrigins(allowedOrigins)
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return originAllowed(r, allowed)
		},
	}

	return func(w http.ResponseWriter, r *http.Request) {
		userID, ok := r.Context().Value(middlewares.UserIDKey).(uint)
		if !ok || userID == 0 {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}

		client := &hub.Client{
			UserID: userID,
			Conn:   conn,
			Send:   make(chan []byte, 256),
		}

		h.Register <- client

		go writePump(client, h)
		go readPump(client, h)
	}
}

func normalizeAllowedOrigins(origins []string) map[string]struct{} {
	if len(origins) == 0 {
		return nil
	}

	allowed := make(map[string]struct{}, len(origins))
	for _, origin := range origins {
		origin = strings.TrimSpace(origin)
		if origin == "" {
			continue
		}
		allowed[origin] = struct{}{}
	}
	return allowed
}

func originAllowed(r *http.Request, allowed map[string]struct{}) bool {
	origin := strings.TrimSpace(r.Header.Get("Origin"))
	if origin == "" {
		return true
	}

	if len(allowed) > 0 {
		_, ok := allowed[origin]
		return ok
	}

	parsed, err := url.Parse(origin)
	if err != nil {
		return false
	}

	if strings.EqualFold(parsed.Host, r.Host) {
		return true
	}

	return isLocalhost(parsed.Hostname()) && isLocalhost(hostnameOnly(r.Host))
}

func hostnameOnly(hostport string) string {
	host, _, err := net.SplitHostPort(hostport)
	if err == nil {
		return host
	}
	return hostport
}

func isLocalhost(host string) bool {
	return strings.EqualFold(host, "localhost") || host == "127.0.0.1" || host == "::1"
}

func writePump(client *hub.Client, h *hub.Hub) {
	ticker := time.NewTicker(30 * time.Second)
	defer func() {
		ticker.Stop()
		client.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-client.Send:
			if !ok {
				client.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			client.Conn.WriteMessage(websocket.TextMessage, message)
		case <-ticker.C:
			if err := client.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return

			}
		}
	}
}

func readPump(client *hub.Client, h *hub.Hub) {
	defer func() {
		h.Unregister <- client
		client.Conn.Close()
	}()
	// if we are not hear from browser for 60sec we will close the connection
	client.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	client.Conn.SetPongHandler(func(string) error {
		client.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, _, err := client.Conn.ReadMessage()
		if err != nil {
			break
		}
	}
}
