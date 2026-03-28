# WebSockets & Real-time - Bidirectional Communication

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Real-time features require bidirectional communication. WebSockets, SSE, and polling each have their use cases.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                  REAL-TIME APPROACHES                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   POLLING                  SSE                    WEBSOCKET      │
│   ┌──────────────┐        ┌──────────────┐       ┌──────────────┐│
│   │ Client ────▶ │        │ Client ────▶ │       │ Client ◀───▶ ││
│   │        ◀──── │        │        ◀──── │       │        ◀───▶ ││
│   │ Server       │        │ Server ──▶   │       │ Server       ││
│   │              │        │         ──▶  │       │              ││
│   └──────────────┘        └──────────────┘       └──────────────┘│
│                                                                   │
│   Request/Response        Server → Client        Full duplex     │
│   Simple                  One-way stream         Bidirectional   │
│   Inefficient             Auto-reconnect         Low latency     │
│                           Text only              Binary support  │
│                                                                   │
│   Use for:                Use for:               Use for:        │
│   • Legacy systems        • Live feeds           • Chat apps     │
│   • Infrequent updates    • Notifications        • Gaming        │
│   • Simple needs          • Stock prices         • Collaboration │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 WebSockets

> **Specification:** [RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) – The WebSocket Protocol

### Basic WebSocket Connection

```javascript
// Create connection
const socket = new WebSocket("wss://example.com/socket");

// Connection opened
socket.addEventListener("open", (event) => {
  console.log("Connected to server");
  socket.send("Hello Server!");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  console.log("Message from server:", event.data);

  // Parse JSON messages
  const data = JSON.parse(event.data);
  handleMessage(data);
});

// Connection closed
socket.addEventListener("close", (event) => {
  console.log("Disconnected:", event.code, event.reason);
  // Implement reconnection logic
});

// Error handling
socket.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});

// Send data
socket.send("Hello");
socket.send(JSON.stringify({ type: "message", text: "Hi" }));

// Check state
console.log(socket.readyState);
// 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED

// Close connection
socket.close(1000, "Normal closure");
```

### WebSocket with Reconnection

```javascript
class WebSocketClient {
  constructor(url, options = {}) {
    this.url = url;
    this.reconnectInterval = options.reconnectInterval || 5000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 10;
    this.reconnectAttempts = 0;
    this.handlers = new Map();

    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("Connected");
      this.reconnectAttempts = 0;
      this.emit("connect");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit(data.type, data.payload);
    };

    this.socket.onclose = (event) => {
      console.log("Disconnected");
      this.emit("disconnect", event);
      this.attemptReconnect();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.emit("error", error);
    };
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Reconnecting in ${this.reconnectInterval}ms... (attempt ${this.reconnectAttempts})`,
    );

    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  send(type, payload) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    } else {
      console.warn("Socket not open, message queued");
      // Could queue messages for later
    }
  }

  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event).push(handler);
  }

  emit(event, data) {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach((handler) => handler(data));
  }

  close() {
    this.socket.close();
  }
}

// Usage
const ws = new WebSocketClient("wss://api.example.com/ws");

ws.on("connect", () => {
  ws.send("subscribe", { channel: "updates" });
});

ws.on("message", (data) => {
  console.log("Received:", data);
});

ws.on("disconnect", () => {
  console.log("Disconnected");
});
```

### React Hook for WebSocket

```javascript
import { useState, useEffect, useCallback, useRef } from "react";

function useWebSocket(url) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);
    socket.onmessage = (event) => {
      setLastMessage(JSON.parse(event.data));
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = useCallback((message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
}

// Usage
function ChatRoom({ roomId }) {
  const { isConnected, lastMessage, sendMessage } = useWebSocket(
    `wss://api.example.com/chat/${roomId}`,
  );

  useEffect(() => {
    if (lastMessage) {
      // Handle new message
    }
  }, [lastMessage]);

  return (
    <div>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      <button onClick={() => sendMessage({ type: "message", text: "Hello" })}>Send</button>
    </div>
  );
}
```

---

## 📡 Server-Sent Events (SSE)

### Basic SSE Client

```javascript
// Create EventSource connection
const eventSource = new EventSource("/api/events");

// Listen for messages
eventSource.onmessage = (event) => {
  console.log("Message:", event.data);
};

// Listen for specific event types
eventSource.addEventListener("notification", (event) => {
  const data = JSON.parse(event.data);
  showNotification(data);
});

eventSource.addEventListener("update", (event) => {
  const data = JSON.parse(event.data);
  updateUI(data);
});

// Connection opened
eventSource.onopen = () => {
  console.log("SSE connection opened");
};

// Error handling
eventSource.onerror = (error) => {
  console.error("SSE error:", error);
  // EventSource auto-reconnects by default
};

// Close connection
eventSource.close();
```

### SSE with Custom Headers

```javascript
// EventSource doesn't support custom headers natively
// Use fetch with ReadableStream instead

async function connectSSE(url, token) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
    },
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    const lines = text.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = JSON.parse(line.slice(6));
        handleEvent(data);
      }
    }
  }
}
```

### Server-Side SSE (Node.js)

```javascript
// Express example
app.get("/api/events", (req, res) => {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send event
  const sendEvent = (data, eventType = "message") => {
    res.write(`event: ${eventType}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send initial data
  sendEvent({ message: "Connected" });

  // Send periodic updates
  const interval = setInterval(() => {
    sendEvent({ time: new Date().toISOString() }, "update");
  }, 5000);

  // Clean up on disconnect
  req.on("close", () => {
    clearInterval(interval);
  });
});
```

---

## 🔄 Polling Strategies

### Short Polling

```javascript
// Simple polling - request every N seconds
async function startPolling(interval = 5000) {
  const poll = async () => {
    try {
      const response = await fetch("/api/updates");
      const data = await response.json();
      handleUpdate(data);
    } catch (error) {
      console.error("Polling error:", error);
    }
  };

  // Initial fetch
  await poll();

  // Set interval
  return setInterval(poll, interval);
}

// Stop polling
const pollId = startPolling(5000);
clearInterval(pollId);
```

### Long Polling

```javascript
// Long polling - server holds request until data available
async function longPoll() {
  while (true) {
    try {
      const response = await fetch("/api/long-poll", {
        signal: AbortSignal.timeout(30000), // 30s timeout
      });

      if (response.ok) {
        const data = await response.json();
        handleUpdate(data);
      }
    } catch (error) {
      if (error.name === "TimeoutError") {
        // Normal timeout, continue polling
        continue;
      }
      console.error("Polling error:", error);
      // Wait before retry
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

// Server-side (Express)
app.get("/api/long-poll", async (req, res) => {
  // Wait for new data (up to 30 seconds)
  const data = await waitForNewData(30000);

  if (data) {
    res.json(data);
  } else {
    res.status(204).end(); // No content, client should retry
  }
});
```

### Smart Polling with Backoff

```javascript
class SmartPoller {
  constructor(url, options = {}) {
    this.url = url;
    this.minInterval = options.minInterval || 1000;
    this.maxInterval = options.maxInterval || 30000;
    this.interval = this.minInterval;
    this.running = false;
  }

  async start() {
    this.running = true;

    while (this.running) {
      try {
        const response = await fetch(this.url);
        const data = await response.json();

        if (data.hasUpdates) {
          this.handleUpdate(data);
          // Reset to fast polling when there's activity
          this.interval = this.minInterval;
        } else {
          // Slow down if no updates
          this.interval = Math.min(this.interval * 1.5, this.maxInterval);
        }
      } catch (error) {
        console.error("Polling error:", error);
        // Back off on errors
        this.interval = Math.min(this.interval * 2, this.maxInterval);
      }

      await new Promise((r) => setTimeout(r, this.interval));
    }
  }

  stop() {
    this.running = false;
  }

  handleUpdate(data) {
    // Override this
  }
}
```

---

## 📊 Comparison

| Feature             | WebSocket     | SSE             | Long Polling    | Short Polling   |
| ------------------- | ------------- | --------------- | --------------- | --------------- |
| Direction           | Bidirectional | Server → Client | Server → Client | Client → Server |
| Binary data         | ✅            | ❌              | ❌              | ✅              |
| Auto-reconnect      | ❌ (manual)   | ✅              | Manual          | Manual          |
| HTTP/2 multiplexing | ❌            | ✅              | ✅              | ✅              |
| Proxy-friendly      | ❌ Sometimes  | ✅              | ✅              | ✅              |
| Overhead            | Low           | Low             | Medium          | High            |
| Complexity          | Higher        | Low             | Medium          | Low             |

### Socket.io vs Native WebSocket

| Feature            | Native WebSocket         | Socket.io                           |
| ------------------ | ------------------------ | ----------------------------------- |
| Auto-reconnection  | ❌ Manual implementation | ✅ Built-in with backoff            |
| Rooms / Namespaces | ❌ Must build yourself   | ✅ First-class feature              |
| Binary support     | ✅ (ArrayBuffer, Blob)   | ✅ (auto-detected)                  |
| Fallback transport | ❌ WebSocket only        | ✅ Falls back to HTTP long-polling  |
| Bundle size        | 0 KB (browser native)    | ~45 KB (client lib)                 |
| Broadcasting       | ❌ Manual fan-out        | ✅ `io.to(room).emit(...)`          |
| Acknowledgements   | ❌ Not built-in          | ✅ Callback-based ACKs              |
| Protocol overhead  | Low (raw frames)         | Slightly higher (Socket.io framing) |

```
When to use each:

Native WebSocket → You control both client & server, minimal overhead,
                   binary streaming (games, video), or bundle size matters.

Socket.io        → You need rooms, auto-reconnect, mixed client types,
                   or want fallback for restrictive corporate proxies.
```

---

## 🏗️ Real-Time Patterns

### Presence System

```javascript
class PresenceManager {
  constructor(socket) {
    this.socket = socket;
    this.onlineUsers = new Set();

    socket.on("user:online", (userId) => {
      this.onlineUsers.add(userId);
      this.emit("change");
    });

    socket.on("user:offline", (userId) => {
      this.onlineUsers.delete(userId);
      this.emit("change");
    });

    // Heartbeat to maintain presence
    setInterval(() => {
      socket.send("heartbeat");
    }, 30000);
  }

  isOnline(userId) {
    return this.onlineUsers.has(userId);
  }
}
```

### Real-Time Collaboration

```javascript
// Operational Transform or CRDT for collaborative editing
const socket = new WebSocket("wss://api.example.com/doc/123");

// Send local changes
function onLocalChange(operation) {
  socket.send(
    JSON.stringify({
      type: "operation",
      operation,
      version: document.version,
    }),
  );
}

// Receive remote changes
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.type === "operation") {
    // Transform operation against local pending operations
    const transformed = transform(message.operation, pendingOperations);
    applyOperation(transformed);
  }
};
```

---

## 🔐 WebSocket Security

### Key Security Considerations

**1. Always use WSS (WebSocket Secure)**

```javascript
// ❌ BAD - plaintext, vulnerable to MITM
const socket = new WebSocket("ws://example.com/socket");

// ✅ GOOD - TLS-encrypted, same as HTTPS
const socket = new WebSocket("wss://example.com/socket");
```

**2. Origin Checking (prevent Cross-Site WebSocket Hijacking)**

```javascript
// Server-side: validate Origin header on upgrade request
// Node.js / ws library example
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  const origin = req.headers.origin;
  const allowedOrigins = ["https://app.example.com", "https://www.example.com"];

  if (!allowedOrigins.includes(origin)) {
    // Reject unauthorized origins
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});
```

**3. Authentication (token in URL query or initial message)**

```javascript
// Option A: token in URL query param (visible in logs – less ideal)
const socket = new WebSocket(`wss://example.com/ws?token=${accessToken}`);

// Option B: send auth as first message after open (recommended)
socket.addEventListener("open", () => {
  socket.send(JSON.stringify({ type: "auth", token: accessToken }));
});

// Server-side: reject connection if auth message not received within timeout
wss.on("connection", (ws) => {
  let authenticated = false;

  const authTimeout = setTimeout(() => {
    if (!authenticated) {
      ws.close(4001, "Authentication timeout");
    }
  }, 5000);

  ws.on("message", (raw) => {
    const msg = JSON.parse(raw);
    if (!authenticated) {
      authenticated = verifyToken(msg.token);
      if (!authenticated) ws.close(4003, "Invalid token");
      clearTimeout(authTimeout);
      return;
    }
    // Handle other messages...
  });
});
```

**4. Rate Limiting**

```javascript
// Track messages per connection to prevent flooding
const rateLimits = new Map(); // connectionId → { count, resetAt }

wss.on("connection", (ws, req) => {
  const id = req.socket.remoteAddress;

  ws.on("message", (data) => {
    const now = Date.now();
    const limit = rateLimits.get(id) || { count: 0, resetAt: now + 1000 };

    if (now > limit.resetAt) {
      limit.count = 0;
      limit.resetAt = now + 1000; // 1-second window
    }

    limit.count++;
    rateLimits.set(id, limit);

    if (limit.count > 100) {
      // max 100 msgs/second
      ws.close(4029, "Rate limit exceeded");
      return;
    }

    handleMessage(ws, data);
  });
});
```

**5. Input Validation & Message Size Limits**

```javascript
const wss = new WebSocketServer({
  port: 8080,
  maxPayload: 64 * 1024, // 64 KB max per message
});

ws.on("message", (data) => {
  // Always validate/parse defensively
  let msg;
  try {
    msg = JSON.parse(data);
  } catch {
    ws.close(4400, "Invalid JSON");
    return;
  }

  // Validate schema before processing
  if (!isValidMessage(msg)) {
    ws.send(JSON.stringify({ error: "Invalid message format" }));
    return;
  }
});
```

### Security Checklist

```
✅ Use WSS (wss://) in production
✅ Validate Origin header on server upgrade
✅ Authenticate connections (token, cookie, or initial message)
✅ Enforce message rate limits
✅ Set maxPayload to limit message sizes
✅ Validate all incoming message content
✅ Use CSRF tokens or SameSite cookies for session-based auth
✅ Close connections that fail authentication within a timeout
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: WebSocket vs HTTP?**

A: HTTP is request/response, connection closes after response. WebSocket maintains persistent connection for bidirectional real-time communication.

**Q: Khi nào dùng WebSocket?**

A: Chat apps, multiplayer games, live collaboration, real-time dashboards - when you need low-latency bidirectional communication.

### 🟡 Mid-level

**Q: SSE vs WebSocket?**

A:

- SSE: One-way (server→client), text only, auto-reconnect, HTTP/2 friendly
- WebSocket: Bidirectional, binary support, manual reconnect, separate protocol

Use SSE for notifications/feeds. Use WebSocket for chat/games.

**Q: Handle WebSocket reconnection?**

A: Implement exponential backoff, queue messages during disconnect, restore state after reconnect, use heartbeats to detect dead connections.

### 🔴 Senior

**Q: Design scalable real-time system**

A:

1. Load balancer with sticky sessions or pub/sub
2. Redis pub/sub for cross-server messaging
3. Horizontal scaling with message broker
4. Connection pooling and management
5. Graceful degradation to polling
6. Heartbeats and connection health monitoring

---

## 📚 Active Recall

1. [ ] WebSocket readyState values
2. [ ] SSE event format
3. [ ] Long polling vs Short polling
4. [ ] When to use each approach
5. [ ] Reconnection strategies

---

> **Tiếp theo:** [05-caching-cdn.md](./05-caching-cdn.md) - Caching & CDN
