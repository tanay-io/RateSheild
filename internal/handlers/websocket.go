package handlers

import (
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/tanay-io/RateSheild/internal/hub"
)
var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true // TODO: false in production
    },
}
func LiveHandler(h *hub.Hub) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        userID := r.Context().Value("userID").(uint)

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

func writePump(client *hub.Client , h *hub.Hub){
	ticker := time.NewTicker(30 * time.Second)
    defer func() {
        ticker.Stop()
        client.Conn.Close()
    }()


	for{
		select{
		case message,ok := <-client.Send:
			if !ok {
                client.Conn.WriteMessage(websocket.CloseMessage, []byte{})
                return
            }
			client.Conn.WriteMessage(websocket.TextMessage , message)
		case <-ticker.C:
			 if err := client.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
                return

     		}
	   }
   }
}

func readPump(client *hub.Client , h *hub.Hub)  {
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