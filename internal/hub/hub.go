package hub

import (
    "sync"
    "github.com/gorilla/websocket"
)

type Client struct {
    UserID uint
    Conn   *websocket.Conn
    Send   chan []byte  // messages waiting to be sent to this browser
}

type Hub struct {
    clients map[uint]map[*Client]bool
    
    mu          sync.RWMutex
    Register    chan *Client
    Unregister  chan *Client
    Broadcast   chan *Message
}

type Message struct {
    UserID  uint
    Payload []byte
}

func NewHub() *Hub {
    return &Hub{
        clients:    make(map[uint]map[*Client]bool),
        Register:   make(chan *Client),
        Unregister: make(chan *Client),
        Broadcast:  make(chan *Message, 256),
    }
}

func (h *Hub) Run() {
    for {
        select {
        
        case client := <-h.Register:
            h.mu.Lock()
            if h.clients[client.UserID] == nil {
                h.clients[client.UserID] = make(map[*Client]bool)
            }
            h.clients[client.UserID][client] = true
            h.mu.Unlock()

        case client := <-h.Unregister:
            h.mu.Lock()
            if clients, ok := h.clients[client.UserID]; ok {
                delete(clients, client)
                close(client.Send)
                if len(clients) == 0 {
                    delete(h.clients, client.UserID)
                }
            }
            h.mu.Unlock()

        case msg := <-h.Broadcast:
            h.mu.RLock()
            clients := h.clients[msg.UserID]
            h.mu.RUnlock()
            
            for client := range clients {
                select {
                case client.Send <- msg.Payload:
                default:
                    close(client.Send)
                    h.mu.Lock()
                    delete(h.clients[client.UserID], client)
                    h.mu.Unlock()
                }
            }
        }
    }
}