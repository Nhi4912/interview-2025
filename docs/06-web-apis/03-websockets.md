# WebSockets & Real-Time Communication / WebSocket & Giao Tiếp Thời Gian Thực
## Web APIs - Chapter 3 / API Web - Chương 3

[← Previous: Fetch & HTTP](./02-fetch-http.md) | [Back to Table of Contents](../00-table-of-contents.md)

---

## Overview / Tổng Quan

**English:** WebSockets provide full-duplex communication channels over a single TCP connection, enabling real-time bidirectional data exchange between client and server.

**Tiếng Việt:** WebSocket cung cấp kênh giao tiếp song công đầy đủ qua một kết nối TCP duy nhất, cho phép trao đổi dữ liệu hai chiều thời gian thực giữa client và server.

---

## WebSocket Basics / Cơ Bản WebSocket

### Connection Lifecycle / Vòng Đời Kết Nối

```typescript
class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = (event) => {
      console.log('WebSocket connected / Đã kết nối');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      this.handleMessage(event.data);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.handleReconnect();
    };
  }

  send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('WebSocket not connected');
    }
  }

  private handleMessage(data: string): void {
    try {
      const message = JSON.parse(data);
      // Process message / Xử lý tin nhắn
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`Reconnecting in ${delay}ms...`);
      setTimeout(() => this.connect(), delay);
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

### Ready States / Trạng Thái Sẵn Sàng

```typescript
enum WebSocketState {
  CONNECTING = 0, // Connection not yet established / Chưa thiết lập kết nối
  OPEN = 1,       // Connection open and ready / Kết nối mở và sẵn sàng
  CLOSING = 2,    // Connection closing / Đang đóng kết nối
  CLOSED = 3      // Connection closed / Kết nối đã đóng
}

function checkWebSocketState(ws: WebSocket): string {
  switch (ws.readyState) {
    case WebSocket.CONNECTING:
      return 'Connecting... / Đang kết nối...';
    case WebSocket.OPEN:
      return 'Connected / Đã kết nối';
    case WebSocket.CLOSING:
      return 'Closing... / Đang đóng...';
    case WebSocket.CLOSED:
      return 'Closed / Đã đóng';
    default:
      return 'Unknown / Không xác định';
  }
}
```

---

## Real-Time Chat Application / Ứng Dụng Chat Thời Gian Thực

```typescript
interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

class ChatClient {
  private ws: WebSocket;
  private messageHandlers: Array<(message: ChatMessage) => void> = [];

  constructor(url: string, private userId: string, private username: string) {
    this.ws = new WebSocket(url);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.ws.onopen = () => {
      console.log('Chat connected / Chat đã kết nối');
      this.sendJoinMessage();
    };

    this.ws.onmessage = (event) => {
      const message: ChatMessage = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(message));
    };

    this.ws.onerror = (error) => {
      console.error('Chat error:', error);
    };

    this.ws.onclose = () => {
      console.log('Chat disconnected / Chat đã ngắt kết nối');
    };
  }

  sendMessage(text: string): void {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      userId: this.userId,
      username: this.username,
      text,
      timestamp: Date.now()
    };

    this.ws.send(JSON.stringify({
      type: 'message',
      payload: message
    }));
  }

  private sendJoinMessage(): void {
    this.ws.send(JSON.stringify({
      type: 'join',
      payload: {
        userId: this.userId,
        username: this.username
      }
    }));
  }

  onMessage(handler: (message: ChatMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  disconnect(): void {
    this.ws.close();
  }
}

// Usage / Sử dụng
const chat = new ChatClient('ws://localhost:8080', 'user123', 'John');

chat.onMessage((message) => {
  console.log(`${message.username}: ${message.text}`);
});

chat.sendMessage('Hello everyone! / Xin chào mọi người!');
```

---

## Key Takeaways / Điểm Chính

**English:**
1. WebSockets enable real-time bidirectional communication
2. Implement reconnection logic for reliability
3. Use heartbeat/ping-pong for connection health
4. Handle different message types appropriately
5. Consider fallback to polling for older browsers

**Tiếng Việt:**
1. WebSocket cho phép giao tiếp hai chiều thời gian thực
2. Triển khai logic kết nối lại cho độ tin cậy
3. Sử dụng heartbeat/ping-pong cho sức khỏe kết nối
4. Xử lý các loại tin nhắn khác nhau phù hợp
5. Xem xét dự phòng polling cho trình duyệt cũ

---

[← Previous: Fetch & HTTP](./02-fetch-http.md) | [Back to Table of Contents](../00-table-of-contents.md)
