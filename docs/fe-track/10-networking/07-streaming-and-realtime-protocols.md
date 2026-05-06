# Streaming & Realtime Protocols — SSE, WebSocket, WebTransport

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [WebSockets & Realtime](./04-websockets-realtime.md), [HTTP Fundamentals](./01-http-fundamentals.md)
> **See also**: [WebSockets & Realtime](./04-websockets-realtime.md) | [FE System Design](../08-fe-system-design/) | [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Interviewer hỏi: _"ChatGPT streams tokens to your browser in real time. How does that work technically, and why didn't OpenAI use WebSocket?"_

Hầu hết ứng viên sẽ nói: _"WebSocket — vì nó realtime."_ Đây là câu trả lời của Junior. Một Senior Engineer sẽ dừng lại và nói: "Actually, ChatGPT dùng **Server-Sent Events (SSE)** qua HTTP/1.1 hoặc HTTP/2. Không phải WebSocket." Và sau đó giải thích tại sao: streaming AI tokens là **half-duplex** — server push text về client, client không gửi ngược lại trong khi stream đang chạy. SSE hoàn toàn phù hợp, không cần overhead của WS handshake, dễ đi qua HTTP proxies, có auto-reconnect tích hợp sẵn, và tương thích hoàn hảo với HTTP/2 multiplexing.

Các ví dụ thực tế bạn cần nắm:

- **ChatGPT / OpenAI API** → SSE (`text/event-stream`) cho token streaming
- **Anthropic Claude API** → SSE với `event: content_block_delta`
- **Vercel AI SDK** → `useChat()` hook wrap fetch ReadableStream hoặc SSE
- **Linear** (project management) → WebSocket cho realtime issue updates, presence
- **Figma** (multiplayer canvas) → WebSocket với binary protocol (Flatbuffers)
- **Discord** → WebSocket với gateway opcodes, heartbeat protocol
- **Google Docs** → WebSocket cho operational transforms, presence awareness
- **Grab** (driver location) → WebSocket từ driver app → backend → SSE/WS tới passenger
- **Shopee Live** (live-stream chat) → WebSocket fan-out qua NATS/Redis pub/sub
- **Zalo** (presence, chat) → Long polling fallback + WebSocket primary trên mobile

Đây là lý do tại sao biết **streaming & realtime protocol landscape** là senior signal: protocol choice ảnh hưởng đến infrastructure cost, scaling strategy, và mobile battery life.

---

## What & Why / Cái Gì & Tại Sao

**Realtime communication** = data xuất hiện ở client trong vòng milliseconds đến vài giây sau khi sự kiện xảy ra ở server — không cần client phải hỏi lại.

```
EVOLUTION OF REALTIME ON THE WEB:

2000s: Polling
  Client: "Any updates?" → Server: "Nope"   (every 5s, waste 99% of requests)

2006: Long Polling (Comet)
  Client: "Any updates?" → Server: [hangs open]... "Yes! Here." → Client reconnects

2006: XMLHttpRequest streaming
  Client opens XHR → Server drips bytes → Client reads incrementally

2011: Server-Sent Events (EventSource API)
  Client: "Subscribe" → Server drips events → Auto-reconnect built-in

2011: WebSocket (RFC 6455)
  Client ↔ Server: full-duplex, single TCP connection

2021+: WebTransport (HTTP/3 QUIC)
  Streams + datagrams + no HOL blocking, zero-RTT connection

2015+: fetch() + ReadableStream (Streams API)
  Manual streaming without EventSource wrapper
```

**Tại sao phải biết sự khác biệt?**

→ **Why?** Mỗi protocol có tradeoff khác nhau về: hướng data flow, proxy friendliness, reconnection, scale, và mobile battery consumption.
→ **Why?** Protocol sai = infrastructure nightmare. WS cho one-way notifications = sticky session hell không cần thiết. Polling cho live chat = database write storm.
→ **Why?** Các công ty như Grab, Zalo, Shopee cần scale tới hàng triệu concurrent connections — protocol choice ảnh hưởng trực tiếp đến cost và reliability.

---

## Concept Map / Bản Đồ Khái Niệm (Decision Tree)

```
REALTIME PROTOCOL DECISION TREE
─────────────────────────────────────────────────────────────

START: What is the data flow direction?
│
├── ONE-WAY (Server → Client only)
│   │
│   ├── Is content-type text? Auto-reconnect needed?
│   │   YES → SSE / EventSource
│   │          • ChatGPT token streaming
│   │          • Notification feeds
│   │          • Stock ticker, live scores
│   │          • AI generation progress
│   │
│   └── Just need incremental HTTP response?
│       YES → fetch() + ReadableStream
│              • NDJSON streaming
│              • File download progress
│              • Manual SSE parsing
│
├── BIDIRECTIONAL (Client ↔ Server)
│   │
│   ├── What is the latency requirement?
│   │   │
│   │   ├── < 100ms, sustained duplex
│   │   │   YES → WebSocket
│   │   │          • Chat (Discord, Zalo)
│   │   │          • Multiplayer canvas (Figma)
│   │   │          • Collaborative editing (Google Docs)
│   │   │          • Live gaming
│   │   │
│   │   ├── Need unreliable datagrams (UDP-like)?
│   │   │   YES → WebTransport (HTTP/3 QUIC)
│   │   │          • Real-time gaming (position updates)
│   │   │          • Video/audio sync signals
│   │   │          • Sensor telemetry (prefer fresh over complete)
│   │   │
│   │   └── Infrequent, < 1 msg/min
│   │       YES → Long Polling (legacy fallback only)
│   │              • Dùng khi WS/SSE bị chặn bởi enterprise proxy
│   │
│   └── Browser support constraints?
│       WebTransport: Chrome 97+, Firefox 114+, Safari ❌ (2026)
│       WebSocket: all browsers ✅
│       SSE: all browsers ✅ (IE11 cần polyfill)
│
└── EXISTING INFRA CONSTRAINTS
    │
    ├── Enterprise proxy / Cloudflare → Prefer SSE (HTTP-native)
    ├── Mobile (Android Doze / iOS background) → Push + reconnect
    └── HTTP/2 already enabled → SSE multiplexes free of charge
```

---

## Comparison Matrix / Bảng So Sánh Giao Thức

| Protocol                 | Direction                          | Transport                | Browser Support                        | Auto-Reconnect              | Auth / Headers                           | Proxy-Friendly            | Max Message Size                    | Typical Use Case                          |
| ------------------------ | ---------------------------------- | ------------------------ | -------------------------------------- | --------------------------- | ---------------------------------------- | ------------------------- | ----------------------------------- | ----------------------------------------- |
| **HTTP Polling**         | Client → Server (pull)             | HTTP/1.1+                | ✅ All                                 | Manual                      | ✅ Full headers                          | ✅ Yes                    | Unlimited (per req)                 | Legacy systems, infrequent data           |
| **Long Polling**         | Server → Client (push, pull-based) | HTTP/1.1+                | ✅ All                                 | Manual re-request           | ✅ Full headers                          | ✅ Yes                    | Unlimited                           | Fallback when WS blocked                  |
| **SSE / EventSource**    | Server → Client only               | HTTP/1.1+ (text)         | ✅ All modern (IE needs polyfill)      | ✅ Built-in (`lastEventId`) | ⚠️ Header on handshake only              | ✅ Yes (HTTP-native)      | Unlimited (streamed text)           | AI token streaming, notifications         |
| **WebSocket**            | Bidirectional (full-duplex)        | TCP (upgraded from HTTP) | ✅ All                                 | ❌ Manual                   | ⚠️ Handshake only (no per-frame headers) | ⚠️ Proxy issues common    | 64KB per frame (fragmented)         | Chat, gaming, collaboration               |
| **WebTransport**         | Bidirectional + datagrams          | QUIC (HTTP/3)            | 🟡 Chrome 97+, Firefox 114+, Safari ❌ | ✅ Streams reconnect        | ✅ HTTP/3 headers                        | ⚠️ Requires UDP unblocked | Streams unlimited; Datagrams ~1200B | Gaming, media sync, telemetry             |
| **fetch ReadableStream** | Server → Client (manual)           | HTTP/1.1+                | ✅ All modern                          | ❌ Manual                   | ✅ Full headers per request              | ✅ Yes                    | Unlimited                           | Custom SSE parsing, NDJSON, binary chunks |

---

## Part 1: Server-Sent Events (SSE / EventSource) / Chi Tiết SSE

### How SSE Works / Cách SSE Hoạt Động

SSE sử dụng một **HTTP response thông thường** với `Content-Type: text/event-stream`. Connection được giữ mở, server drip-feeds text events.

```
Client                          Server
  │                               │
  │──── GET /events ─────────────▶│
  │     Accept: text/event-stream │
  │                               │
  │◀─── HTTP/1.1 200 OK ──────────│
  │     Content-Type: text/event-stream
  │     Cache-Control: no-cache   │
  │     Connection: keep-alive    │
  │                               │
  │◀─── data: {"token":"Hello"}\n\n
  │◀─── data: {"token":" world"}\n\n
  │◀─── event: done\n             │
  │     data: {}\n\n              │
  │                               │
  │  [Client closes or server     │
  │   sends connection: close]    │
```

### SSE Wire Format / Định Dạng Wire

```
# Single-line event (most common)
data: Hello world\n\n

# Event with type
event: token\n
data: {"text": "Hello"}\n\n

# Event with ID (enables lastEventId reconnect)
id: 42\n
event: message\n
data: {"text": "World"}\n\n

# Multi-line data (each line prefixed with "data:")
data: {"partial":\n
data:   "multiline"\n
data: }\n\n

# Keep-alive comment (prevents proxy timeout)
: heartbeat\n\n

# Retry hint (tells client reconnect delay in ms)
retry: 3000\n\n
```

> **Key rule**: Two newlines `\n\n` terminate an event. Single `\n` continues the same event's fields.

### EventSource API

```typescript
// Basic EventSource usage
const es = new EventSource("/api/stream");

// Default "message" event
es.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Received:", data);
};

// Named custom events
es.addEventListener("token", (event) => {
  appendToken(JSON.parse(event.data).text);
});

es.addEventListener("done", () => {
  es.close();
});

// Error + reconnect
es.onerror = (event) => {
  if (es.readyState === EventSource.CLOSED) {
    console.log("Connection closed — will NOT auto-reconnect (server closed)");
  } else if (es.readyState === EventSource.CONNECTING) {
    console.log("Auto-reconnecting... (network drop)");
  }
};

// readyState values
// EventSource.CONNECTING = 0
// EventSource.OPEN       = 1
// EventSource.CLOSED     = 2
```

### Full SSE Parser (Manual — for fetch ReadableStream) / Parser SSE Thủ Công

Khi dùng `fetch()` thay vì `EventSource` (để có full headers, POST body, auth tokens):

```typescript
interface SSEEvent {
  id?: string;
  event?: string;
  data: string;
  retry?: number;
}

async function* parseSSEStream(stream: ReadableStream<Uint8Array>): AsyncGenerator<SSEEvent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  // Current event fields being accumulated
  let currentEvent: Partial<SSEEvent> = {};

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Split on newlines — process complete lines
      const lines = buffer.split("\n");
      // Keep last (possibly incomplete) line in buffer
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line === "") {
          // Blank line = event dispatch boundary
          if (currentEvent.data !== undefined) {
            yield currentEvent as SSEEvent;
          }
          currentEvent = {};
          continue;
        }

        if (line.startsWith(":")) {
          // Comment / keep-alive — ignore
          continue;
        }

        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) {
          // Field with no value (rare)
          currentEvent[line as keyof SSEEvent] = "" as never;
          continue;
        }

        const field = line.slice(0, colonIdx);
        // Spec: if first char after ":" is space, strip it
        const value = line.slice(colonIdx + 1).replace(/^ /, "");

        switch (field) {
          case "data":
            // Multi-line data: concatenate with \n
            currentEvent.data =
              currentEvent.data !== undefined ? currentEvent.data + "\n" + value : value;
            break;
          case "event":
            currentEvent.event = value;
            break;
          case "id":
            currentEvent.id = value;
            break;
          case "retry":
            currentEvent.retry = parseInt(value, 10);
            break;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// Usage: ChatGPT-style AI streaming with POST + auth
async function streamChatCompletion(
  messages: Array<{ role: string; content: string }>,
  onToken: (token: string) => void,
): Promise<void> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`HTTP ${response.status}`);
  }

  for await (const event of parseSSEStream(response.body)) {
    if (event.data === "[DONE]") break;

    try {
      const chunk = JSON.parse(event.data);
      const token = chunk.choices?.[0]?.delta?.content;
      if (token) onToken(token);
    } catch {
      // Partial JSON or comment — skip
    }
  }
}
```

### SSE with lastEventId — Resume from Disconnect / Tiếp Tục Sau Ngắt Kết Nối

```typescript
// Server-side (Node.js / Express example)
import type { Request, Response } from "express";

function sseHandler(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  // CRITICAL for Nginx — disable buffering
  res.setHeader("X-Accel-Buffering", "no");

  // Resume from last seen event ID
  const lastId = req.headers["last-event-id"];
  let eventId = lastId ? parseInt(lastId as string, 10) : 0;

  const sendEvent = (data: unknown, type = "message") => {
    eventId++;
    res.write(`id: ${eventId}\n`);
    res.write(`event: ${type}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Keep-alive comment every 15s to prevent proxy timeout
  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 15_000);

  req.on("close", () => {
    clearInterval(heartbeat);
  });

  // Send buffered events since lastId (replay)
  if (lastId) {
    const missed = getEventsSince(parseInt(lastId as string, 10));
    missed.forEach((e) => sendEvent(e.data, e.type));
  }
}
```

---

## Part 2: WebSocket Deep-Dive (Comparison Focus) / WebSocket — So Sánh Tập Trung

> 💡 WebSocket internals (handshake, frame format, opcodes) được cover chi tiết trong [`04-websockets-realtime.md`](./04-websockets-realtime.md). Phần này tập trung vào **khi nào** dùng WS và **so sánh** với các alternatives.

### Subprotocols, Ping/Pong, và Close Codes

```typescript
// WebSocket với subprotocol negotiation
const ws = new WebSocket("wss://api.example.com/ws", [
  "graphql-ws", // Apollo GraphQL subscriptions
  // hoặc: "v13.stomp", "chat.v2", "json"
]);

ws.onopen = () => {
  console.log("Negotiated protocol:", ws.protocol); // "graphql-ws"
};

// Ping/Pong — browser WebSocket API không expose ping/pong trực tiếp
// Server gửi ping frame → browser tự động trả pong
// Từ server (Node.js ws library):
// wss.on("connection", (ws) => {
//   ws.ping(); // sends ping opcode 0x9
//   ws.on("pong", () => { /* still alive */ });
// });

// Application-level heartbeat (vì browser không expose ping API)
function startHeartbeat(ws: WebSocket, intervalMs = 30_000): () => void {
  const id = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "ping", ts: Date.now() }));
    }
  }, intervalMs);
  return () => clearInterval(id);
}

// Close codes — quan trọng để debug
ws.onclose = (event) => {
  // Standard codes:
  // 1000 = Normal closure (intentional)
  // 1001 = Going away (browser navigate/close tab)
  // 1006 = Abnormal closure (no close frame — network drop!)
  // 1007 = Invalid frame payload (encoding error)
  // 1008 = Policy violation
  // 1009 = Message too large
  // 1011 = Internal server error
  // 4000–4999 = Application-defined codes
  // e.g. 4001 = Unauthorized, 4004 = Room full

  console.log(`Closed: ${event.code} ${event.reason} wasClean=${event.wasClean}`);

  if (event.code === 1006) {
    // Network drop — reconnect with backoff
    scheduleReconnect();
  } else if (event.code >= 4000) {
    // App-level error — may not want to reconnect
    handleAppError(event.code, event.reason);
  }
};
```

---

## Part 3: fetch + ReadableStream / Streams API

### Incremental Rendering với fetch ReadableStream

```typescript
// NDJSON (Newline-Delimited JSON) streaming — từng object trên một dòng
async function* streamNDJSON<T>(url: string): AsyncGenerator<T> {
  const response = await fetch(url);
  if (!response.body) throw new Error("No body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.trim()) {
          yield JSON.parse(line) as T;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// Usage: render results as they arrive (search results, product listings)
async function renderSearchResults(query: string) {
  const container = document.getElementById("results")!;

  for await (const result of streamNDJSON<SearchResult>(
    `/api/search?q=${encodeURIComponent(query)}`,
  )) {
    const card = createResultCard(result);
    container.appendChild(card);
    // User sees results incrementally — không đợi toàn bộ response
  }
}
```

### TransformStream — Piping và Transforming

```typescript
// TransformStream: middleware trong stream pipeline
// Ví dụ: decompress + decode + parse JSON
function createJSONParseTransform<T>(): TransformStream<string, T> {
  let buffer = "";

  return new TransformStream<string, T>({
    transform(chunk, controller) {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.trim()) {
          try {
            controller.enqueue(JSON.parse(line) as T);
          } catch {
            // Skip malformed lines
          }
        }
      }
    },
    flush(controller) {
      if (buffer.trim()) {
        try {
          controller.enqueue(JSON.parse(buffer) as T);
        } catch {
          // Ignore incomplete final line
        }
      }
    },
  });
}

// Pipe chain: fetch → decode → parse JSON
async function streamAndParse<T>(url: string): Promise<ReadableStream<T>> {
  const response = await fetch(url);
  if (!response.body) throw new Error("No body");

  return response.body
    .pipeThrough(new TextDecoderStream()) // Uint8Array → string
    .pipeThrough(createJSONParseTransform<T>()); // string → T objects
}

// BYOB (Bring Your Own Buffer) — zero-copy for performance-critical paths
async function readWithBYOB(stream: ReadableStream<Uint8Array>): Promise<void> {
  // BYOB reader lets you supply your own ArrayBuffer — avoids allocation
  const reader = stream.getReader({ mode: "byob" });
  let buffer = new ArrayBuffer(65536); // 64KB reusable buffer

  try {
    while (true) {
      const { done, value } = await reader.read(new Uint8Array(buffer));
      if (done) break;
      buffer = value.buffer; // Reuse the same buffer next iteration
      processChunk(value);
    }
  } finally {
    reader.releaseLock();
  }
}
```

### Backpressure / Áp Suất Ngược

```typescript
// WritableStream với backpressure — slow consumer signals slow producer
function createBackpressureDemo() {
  const writableStream = new WritableStream<string>(
    {
      write(chunk, controller) {
        // Simulate slow consumer (e.g., DOM rendering, disk write)
        return new Promise((resolve) => setTimeout(resolve, 100)); // 100ms per chunk
        // Returning a Promise = WritableStream will NOT pull next chunk
        // until this Promise resolves → backpressure propagates upstream
      },
    },
    new CountQueuingStrategy({ highWaterMark: 5 }), // Buffer max 5 chunks
  );

  return writableStream;
}

// Server-side backpressure (Node.js Streams)
// import { Readable } from "stream";
// readable.pipe(writable); // Node.js pipe() handles backpressure automatically
// writable.on("drain", () => readable.resume()); // Manual: pause when full
```

---

## Part 4: WebTransport (HTTP/3 QUIC)

### What Is WebTransport / WebTransport Là Gì

WebTransport là API mới (Chrome 97+, Firefox 114+) cho phép client mở **multiple independent streams** và **unreliable datagrams** qua HTTP/3 QUIC — không bị Head-of-Line blocking như WebSocket trên TCP.

```
WebSocket (TCP):
  Stream 1: [A1][A2][A3][...LOST...][A5] ← A4 dropped = entire stream stalls

WebTransport QUIC streams:
  Stream 1: [A1][A2]     [A4][A5]  ← stream-level HOL blocking only
  Stream 2: [B1][B2][B3]           ← independent, unaffected by Stream 1

WebTransport datagrams (unreliable):
  [C1] [C2] [C4]  ← C3 dropped and NOT retransmitted (like UDP)
  Perfect for: game position updates, audio level meters — stale data useless
```

```typescript
// WebTransport API (Chrome 97+)
async function connectWebTransport(url: string) {
  // url must be HTTPS with HTTP/3 support
  const transport = new WebTransport(url);

  // Wait for connection (0-RTT possible on reconnect)
  await transport.ready;
  console.log("Connected via WebTransport");

  // --- Reliable, ordered streams (like WebSocket) ---
  const stream = await transport.createBidirectionalStream();
  const writer = stream.writable.getWriter();
  const reader = stream.readable.getReader();

  await writer.write(new TextEncoder().encode("Hello!"));
  const { value } = await reader.read();
  console.log("Response:", new TextDecoder().decode(value));

  // --- Unreliable datagrams (like UDP) ---
  const dgWriter = transport.datagrams.writable.getWriter();
  await dgWriter.write(new Uint8Array([0x01, 0x02, 0x03])); // fire and forget

  const dgReader = transport.datagrams.readable.getReader();
  const { value: dgValue } = await dgReader.read();
  console.log("Datagram received:", dgValue);

  // Connection closed
  transport.closed.then(() => {
    console.log("WebTransport connection closed");
  });
}

// Browser support check (2026 reality)
function supportsWebTransport(): boolean {
  return "WebTransport" in globalThis;
  // Chrome 97+ ✅ | Firefox 114+ ✅ | Safari ❌ (not supported as of 2026)
  // → Always provide WebSocket fallback for Safari users
}
```

---

## Part 5: Reconnection Strategies / Chiến Lược Kết Nối Lại

### Exponential Backoff with Jitter

```typescript
interface ReconnectConfig {
  baseDelayMs: number; // Starting delay (e.g. 1000ms)
  maxDelayMs: number; // Cap (e.g. 30_000ms)
  maxAttempts: number; // Give up after N attempts
  jitterFactor: number; // 0–1, randomness to avoid thundering herd
}

class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private attempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private closed = false;

  constructor(
    private readonly url: string,
    private readonly config: ReconnectConfig = {
      baseDelayMs: 1_000,
      maxDelayMs: 30_000,
      maxAttempts: 10,
      jitterFactor: 0.3,
    },
  ) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.attempts = 0; // Reset on successful connection
      console.log("Connected");
    };

    this.ws.onclose = (event) => {
      if (this.closed) return; // Intentional close — don't reconnect

      if (event.code === 1000) return; // Normal closure

      if (this.attempts >= this.config.maxAttempts) {
        console.error("Max reconnect attempts reached");
        return;
      }

      const delay = this.calculateBackoff();
      console.log(`Reconnecting in ${delay}ms (attempt ${this.attempts + 1})`);
      this.reconnectTimer = setTimeout(() => this.connect(), delay);
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(JSON.parse(event.data));
    };
  }

  private calculateBackoff(): number {
    this.attempts++;
    // Exponential: 1s, 2s, 4s, 8s, 16s, 30s (capped)
    const exponential = Math.min(
      this.config.baseDelayMs * Math.pow(2, this.attempts - 1),
      this.config.maxDelayMs,
    );
    // Jitter: ±30% to avoid thundering herd (1000 clients all reconnecting at same time)
    const jitter = exponential * this.config.jitterFactor * (Math.random() * 2 - 1);
    return Math.max(0, Math.round(exponential + jitter));
  }

  private handleMessage(data: unknown) {
    // Application message handling
  }

  send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  close() {
    this.closed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close(1000, "Client closed");
  }
}

// SSE reconnection với resume token
class ReconnectingSSE {
  private es: EventSource | null = null;
  private lastEventId: string | null = null;

  constructor(private readonly baseUrl: string) {
    this.connect();
  }

  private connect() {
    const url = this.lastEventId ? `${this.baseUrl}?lastEventId=${this.lastEventId}` : this.baseUrl;

    // EventSource tự động gửi "Last-Event-ID" header khi reconnect
    // nếu server đã gán id: field cho events
    this.es = new EventSource(url);

    this.es.addEventListener("message", (event) => {
      this.lastEventId = event.lastEventId; // Track for manual reconnect
      this.handleEvent(event);
    });

    // EventSource auto-reconnects trừ khi server gửi HTTP 204 No Content
    // hoặc response không phải text/event-stream
  }

  private handleEvent(event: MessageEvent) {}
}
```

### Server Resume Token / Server-Side Deduplication

```typescript
// Server sends a resume token — client replays from checkpoint
interface ResumeToken {
  cursor: string; // Opaque server cursor (e.g. Redis stream ID)
  timestamp: number;
}

// Client stores resume token in sessionStorage
function saveResumeToken(token: ResumeToken) {
  sessionStorage.setItem("sse-resume", JSON.stringify(token));
}

function loadResumeToken(): ResumeToken | null {
  const raw = sessionStorage.getItem("sse-resume");
  return raw ? JSON.parse(raw) : null;
}

// Server: use cursor to replay missed events
// Redis Streams: XREAD COUNT 100 STREAMS events <cursor>
// Deduplicate on client: track seen event IDs
const seenEventIds = new Set<string>();

function deduplicatedHandler(event: MessageEvent): boolean {
  if (seenEventIds.has(event.lastEventId)) {
    return false; // Already processed (replayed duplicate)
  }
  seenEventIds.add(event.lastEventId);
  // Trim old IDs to avoid unbounded growth
  if (seenEventIds.size > 1000) {
    const oldest = [...seenEventIds].slice(0, 100);
    oldest.forEach((id) => seenEventIds.delete(id));
  }
  return true;
}
```

---

## Part 6: Scaling / Scale Hàng Triệu Kết Nối

### The Sticky Session Problem / Vấn Đề Sticky Session

```
NAIVE SCALING (WRONG):
                     ┌─── Server A: connections for users 1–3000
Client ──▶ LB ──────┤
                     └─── Server B: connections for users 3001–6000

Problem: User 1 connects to Server A.
         User 2's message TO User 1 hits Server B.
         Server B has NO WebSocket for User 1 → message lost!

SOLUTION 1: Sticky Sessions (Session Affinity)
  LB hashes client IP or session cookie → always route to same server
  Problem: Server A dies → ALL its connections drop simultaneously
           "Thundering herd" when all 3000 reconnect at once
           Uneven load (popular IPs all hash to same server)

SOLUTION 2: Message Bus Fan-out (CORRECT for production)
  All servers publish to Redis Pub/Sub or NATS
  Server A wants to send to User 1 (on Server B):
    → Publish to channel "user:1"
    → Server B subscribed to "user:1" → receives → sends via WS

  Works across 100+ server instances
  No sticky sessions needed
  Server death = only that server's connections drop (isolated blast radius)
```

### Redis Pub/Sub Fan-out Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  WS Server 1 │     │  WS Server 2 │     │  WS Server 3 │
│  users: A,B  │     │  users: C,D  │     │  users: E,F  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │ SUBSCRIBE          │ SUBSCRIBE           │ SUBSCRIBE
       │ user:A, user:B     │ user:C, user:D      │ user:E, user:F
       └────────────────────┴─────────────────────┘
                            │
                     ┌──────▼──────┐
                     │   Redis     │
                     │  Pub/Sub    │
                     │  Streams    │
                     └──────▲──────┘
                            │ PUBLISH to "user:C"
                     ┌──────┴──────┐
                     │  API Server │  (receives HTTP request from User A
                     │             │   wanting to message User C)
                     └─────────────┘
```

```typescript
// Simplified Redis pub/sub fan-out (Node.js + ioredis)
import Redis from "ioredis";

const pub = new Redis(); // Publisher connection
const sub = new Redis(); // Subscriber connection (separate — Redis protocol rule)

// Map: userId → WebSocket connection (per-server)
const connections = new Map<string, WebSocket>();

// When a new WebSocket connects
function onUserConnect(userId: string, ws: WebSocket) {
  connections.set(userId, ws);

  // Subscribe to this user's channel on Redis
  sub.subscribe(`user:${userId}`, (err) => {
    if (err) ws.close(1011, "Subscribe failed");
  });

  ws.onclose = () => {
    connections.delete(userId);
    sub.unsubscribe(`user:${userId}`);

    // Update presence: remove from Redis SET with TTL
    pub.del(`presence:${userId}`);
  };
}

// Redis subscriber → forward to local WebSocket
sub.on("message", (channel: string, message: string) => {
  const userId = channel.replace("user:", "");
  const ws = connections.get(userId);
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(message);
  }
});

// Send to any user (from API handler or another WS server)
async function sendToUser(userId: string, data: unknown) {
  await pub.publish(`user:${userId}`, JSON.stringify(data));
}

// Presence tracking with TTL (NOT storing in DB)
async function setPresence(userId: string, status: "online" | "away") {
  // SET with EX 60 = expire in 60s (heartbeat must renew before expiry)
  await pub.set(`presence:${userId}`, status, "EX", 60);
}

async function getPresence(userId: string): Promise<string | null> {
  return pub.get(`presence:${userId}`);
}
```

### Consistent Hash Sharding for 1M+ Connections

```typescript
// Horizontal sharding: deterministically route user to shard
// Each shard handles ~50K connections max

function getUserShard(userId: string, shardCount: number): number {
  // FNV-1a hash — fast, good distribution
  let hash = 2166136261;
  for (const char of userId) {
    hash ^= char.charCodeAt(0);
    hash = (hash * 16777619) >>> 0; // 32-bit unsigned
  }
  return hash % shardCount;
}

// Scale calculation for 1M concurrent WebSocket connections:
// Each WS connection: ~10KB RAM (kernel socket + app buffers)
// 1M connections: ~10GB RAM
// → 20 servers × 50K connections/server = 1M total
// → Redis pub/sub handles cross-shard messaging
// → Consistent hash ensures deterministic routing (no lookup table)
```

---

## Part 7: Proxies, Load Balancers, and Long-Lived Connections / Proxy và Kết Nối Dài Hạn

### SSE Behind Enterprise Proxies / SSE Qua Enterprise Proxy

```
PROBLEM: Enterprise proxies (Squid, Zscaler, Nginx default config)
         buffer HTTP responses until they're "complete".
         SSE response NEVER completes → proxy buffers forever → client gets nothing.

SOLUTION: Nginx configuration
```

```nginx
# Nginx: disable buffering for SSE endpoints
location /api/stream {
    proxy_pass http://backend;
    proxy_buffering off;           # Critical: disable response buffering
    proxy_cache off;
    proxy_set_header Connection '';
    proxy_http_version 1.1;        # Keep-alive
    chunked_transfer_encoding on;

    # Also set in response headers (belt + suspenders):
    # X-Accel-Buffering: no  ← Nginx respects this header from upstream
}
```

```typescript
// Server: always set X-Accel-Buffering: no for SSE responses
function setSseHeaders(res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Nginx + Vercel respect this
  res.setHeader("Access-Control-Allow-Origin", "*"); // CORS if cross-origin
}

// Cloudflare consideration:
// Cloudflare Pro/Business: SSE works (edge does NOT buffer streaming responses)
// Cloudflare Free: Used to buffer — fixed in 2022, now respects text/event-stream
// BUT: Cloudflare has 100s response timeout by default
// → Use keep-alive comments every 30s to reset the timeout:
// res.write(": heartbeat\n\n");
```

### WebSocket Through Reverse Proxies

```nginx
# Nginx WebSocket proxy configuration
http {
  upstream ws_backend {
    # Sticky sessions by IP hash (if not using Redis pub/sub)
    ip_hash;
    server backend1:3000;
    server backend2:3000;
  }

  server {
    location /ws {
      proxy_pass http://ws_backend;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;    # Pass WebSocket upgrade
      proxy_set_header Connection "upgrade";      # Keep upgrade header
      proxy_set_header Host $host;
      proxy_read_timeout 3600s;   # 1 hour — don't close idle WS connections
      proxy_send_timeout 3600s;
    }
  }
}
```

---

## Part 8: Mobile Reality / Thực Tế Mobile

### Android Doze & iOS Background — The Silent Killers

```
MOBILE NETWORK REALITY:
─────────────────────────────────────────────────────────────

Android Doze Mode (Android 6+):
  Screen off > 30min → CPU/network heavily throttled
  WebSocket TCP connection: NAT mapping expires (carrier NAT ~60–90s timeout)
  Result: WS "appears" open but packets silently dropped

iOS Background:
  App goes background → network sockets suspended within seconds
  When app resumes: TCP connection may be dead (no RST sent by peer)
  WebSocket sees: connection appears OPEN but messages don't arrive

Radio Sleep (3G/4G/5G):
  Mobile radio aggressively power-manages: active → idle → sleep
  Waking radio: +100–500ms latency spike
  Frequent WS ping/pong = keeps radio awake = battery drain

NAT Timeout:
  Carrier-grade NAT (CGNAT) typically 60–120s for TCP
  WS with no activity > 60s: NAT mapping removed
  → Next send fails silently (no error until TCP timeout ~minutes later)
```

```typescript
// Mobile-aware WebSocket strategy
class MobileAwareSocket {
  private ws: WebSocket | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private readonly PING_INTERVAL_MS = 25_000; // 25s < 60s NAT timeout

  connect() {
    this.ws = new WebSocket("wss://api.example.com/ws");
    this.startPingPong();

    // Listen for page visibility changes (screen lock, background)
    document.addEventListener("visibilitychange", this.handleVisibility);
  }

  private handleVisibility = () => {
    if (document.hidden) {
      // App going background: stop ping (save battery)
      this.stopPingPong();
    } else {
      // App resumed: verify connection is alive, reconnect if dead
      if (this.ws?.readyState !== WebSocket.OPEN) {
        this.reconnect();
      } else {
        // Send a ping immediately to verify NAT mapping still valid
        this.ws.send(JSON.stringify({ type: "ping" }));
        this.startPingPong();
      }
    }
  };

  private startPingPong() {
    this.stopPingPong();
    this.pingInterval = setInterval(() => {
      this.ws?.send(JSON.stringify({ type: "ping", ts: Date.now() }));
    }, this.PING_INTERVAL_MS);
  }

  private stopPingPong() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private reconnect() {
    // Exponential backoff reconnection
  }

  disconnect() {
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.stopPingPong();
    this.ws?.close(1000);
  }
}

// Fallback strategy for mobile: Push Notifications + reconnect
// When app is background:
//   1. Backend sees WS disconnect → marks user "offline"
//   2. Routes urgent messages via FCM (Android) / APNs (iOS) push
//   3. Push wakes app → app reconnects WS
//   4. Fetches missed messages via REST API (cursor-based)
```

---

## Part 9: HTTP/2 Push (Deprecated) / HTTP/2 Push — Lịch Sử

```
HTTP/2 Server Push (deprecated):
  Server proactively pushes resources BEFORE client requests them
  Problem: Browsers found it unreliable, hard to cache, hard to cancel

  Chrome removed HTTP/2 Server Push in Chrome 106 (Oct 2022)
  Firefox never shipped it
  Safari: removed

  → HTTP/2 Push is DEAD. Do not use.
  → Alternative for resource hints: <link rel="preload"> + Early Hints (103)

HTTP/2 relevance to streaming in 2026:
  ✅ Multiplexing: multiple SSE streams on one TCP connection (no extra overhead)
  ✅ Header compression: SSE headers compressed via HPACK
  ✅ No head-of-line blocking PER STREAM (but TCP HOL still applies)
  → SSE + HTTP/2 = great combo. HTTP/2 Push = dead.
```

---

## Part 10: Interview Q&A / Câu Hỏi Phỏng Vấn

---

### 🟢 Q1: Long Polling vs SSE vs WebSocket — How Do You Choose? / Khi Nào Dùng Cái Nào?

**A:**

The primary decision axis is **data flow direction**, then **frequency**.

**Long Polling**: Client sends request → server holds it until data available → responds → client immediately sends another. Round-trip per message. Use only when: WS/SSE are blocked by enterprise firewall, or update frequency is very low (< 1/min) and you need universal HTTP compatibility. Overhead: one HTTP request per update, header overhead on every cycle.

**SSE**: HTTP response that never ends. Server pushes text events downstream. Use when: **one-way push** (server → client only), text data, need auto-reconnect built-in, want to stay HTTP-native (CDN, proxy, load-balancer friendly). Examples: ChatGPT token streaming, notification feeds, live dashboards. **Cannot send data from client** through the SSE connection (use a separate POST/fetch for client→server).

**WebSocket**: Full-duplex TCP tunnel. Use when: **bidirectional**, low-latency (< 100ms), continuous message flow in both directions. Examples: chat (Zalo, Discord), multiplayer canvas (Figma), collaborative editing (Google Docs), live gaming.

Decision table:

```
One-way? Text? Need auto-reconnect? → SSE
Bidirectional? Low-latency? → WebSocket
Behind strict firewall? Low frequency? → Long Polling (fallback)
```

🇻🇳 **Tóm tắt**: Chọn theo **hướng data flow**. Một chiều (server → client) = SSE. Hai chiều = WebSocket. Firewall chặn tất cả = Long Polling dự phòng. SSE là HTTP-native nên thân thiện hơn với proxy/CDN, không cần sticky sessions, có auto-reconnect tích hợp.

**💡 Interview Signal:**

- ✅ Strong: Leads with direction (one-way vs bidirectional), mentions SSE is HTTP-native so no sticky sessions, knows Long Polling is fallback not default
- ❌ Weak: "Use WebSocket for everything realtime" — over-engineering, misses infrastructure cost

---

### 🟢 Q2: How Does EventSource Auto-Reconnect Work? What Is `lastEventId`?

**A:**

`EventSource` has **built-in automatic reconnection**:

1. Server closes connection (network drop, server restart) → browser detects (`onerror` fires, `readyState` → `CONNECTING`)
2. Browser waits `retry` ms (default ~3000ms, configurable via server sending `retry: <ms>`)
3. Browser reconnects with **`Last-Event-ID` HTTP header** set to the last `id:` field received

```typescript
// Server sends events with IDs:
// id: 42\ndata: {"msg": "hello"}\n\n
// id: 43\ndata: {"msg": "world"}\n\n

// Browser disconnects after id 42, reconnects:
// GET /events HTTP/1.1
// Last-Event-ID: 42   ← browser sets this automatically

// Server receives req.headers["last-event-id"] = "42"
// → replays events 43+ to fill the gap
```

**Key details**:

- `id: ` field sets `event.lastEventId` on the MessageEvent
- Empty `id: ` (blank) clears the stored ID
- `retry: 5000` tells browser to wait 5 seconds before reconnecting
- `EventSource` only reconnects on **network errors** — if server sends HTTP 204 or non-`text/event-stream` response, it **stops reconnecting**

🇻🇳 **Tóm tắt**: `EventSource` tự động reconnect khi mạng bị đứt. Trước khi reconnect, browser gửi header `Last-Event-ID` với giá trị của `id:` field cuối cùng nhận được. Server dùng ID đó để replay các event đã miss. Server có thể gợi ý retry delay bằng `retry: <ms>`.

**💡 Interview Signal:**

- ✅ Strong: Knows `Last-Event-ID` header is sent automatically, explains the gap-filling mechanism, knows blank `id:` clears state
- ❌ Weak: "EventSource auto-reconnects" without explaining the `lastEventId` mechanism — misses the important part

---

### 🟡 Q3: Why Do ChatGPT-Style Apps Use SSE Instead of WebSocket?

**A:**

This is a **half-duplex vs full-duplex mismatch** question. AI token streaming is inherently one-directional:

1. User sends a prompt (one HTTP POST with request body)
2. Server streams tokens back (many small chunks, server → client only)
3. Client doesn't send anything back while receiving

WebSocket would work technically, but adds unnecessary complexity:

- **Infrastructure**: WS requires sticky sessions (or Redis pub/sub) on load balancer. SSE is plain HTTP — any standard LB round-robins it fine
- **Proxy friendliness**: Corporate proxies, Cloudflare, Vercel edge — all handle HTTP streaming natively. WS upgrades often get blocked or need special proxy config
- **Authentication**: SSE over fetch = full HTTP headers (Bearer token) on every request. WS handshake only passes headers at connection open, then uses URL params or first message for auth
- **HTTP/2 multiplexing**: Multiple SSE streams share one HTTP/2 connection automatically. Multiple WS = multiple TCP connections
- **CDN edge streaming**: Vercel Edge Functions, Cloudflare Workers support Response streaming natively — no WS needed

OpenAI, Anthropic, and Vercel AI SDK all use SSE (`text/event-stream`) because the workload is half-duplex and SSE maps perfectly to HTTP semantics.

```typescript
// Vercel AI SDK: useChat() uses fetch ReadableStream / SSE internally
import { useChat } from "ai/react";

function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat", // POST → returns SSE stream
  });
  // SDK handles: streaming, reconnect, token accumulation
}
```

🇻🇳 **Tóm tắt**: ChatGPT dùng SSE vì luồng data là **một chiều** (server → client). WebSocket là full-duplex — overkill cho token streaming. SSE thân thiện hơn với proxy/CDN, không cần sticky sessions trên LB, và có thể dùng full HTTP headers cho authentication. Vercel AI SDK, OpenAI API, và Anthropic API đều dùng SSE.

**💡 Interview Signal:**

- ✅ Strong: Identifies half-duplex as key reason, mentions infrastructure (LB, proxy, CDN), knows Vercel AI SDK uses streaming
- ❌ Weak: "SSE is simpler" — correct but shallow; needs to explain WHY it's appropriate for this use case

---

### 🟡 Q4: How Does fetch with ReadableStream Work for Incremental Rendering?

**A:**

`fetch()` returns a `Response` with a `.body: ReadableStream<Uint8Array>`. You can read chunks incrementally without waiting for the full response.

```typescript
// Pattern: NDJSON streaming (each line = one complete JSON object)
async function* fetchStream<T>(url: string): AsyncGenerator<T> {
  const res = await fetch(url);
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (line.trim()) yield JSON.parse(line) as T;
    }
  }
}

// Render search results incrementally
for await (const result of fetchStream<SearchResult>("/api/search?q=foo")) {
  renderCard(result); // User sees cards appear one-by-one
}
```

**Three streaming patterns**:

1. **NDJSON** — one JSON per line → easiest to parse, used for search results, product listings
2. **SSE via fetch** — use manual SSE parser (see Part 1) → needed when you want POST + auth + custom events
3. **Binary chunks** — ArrayBuffer reads for file downloads, audio, video

**Why prefer fetch over EventSource for AI apps?**

- EventSource only supports GET and no custom request body
- AI APIs need POST with the prompt in the body
- → Use `fetch()` + manual SSE parsing for POST-based streaming

🇻🇳 **Tóm tắt**: `fetch().body` là `ReadableStream<Uint8Array>`. Đọc từng chunk bằng `.getReader().read()`. Ba patterns: NDJSON (một JSON per dòng), SSE manual parsing, binary chunks. AI streaming dùng fetch thay EventSource vì cần POST với request body và custom auth headers.

**💡 Interview Signal:**

- ✅ Strong: Explains NDJSON vs SSE pattern, knows why fetch over EventSource (POST + body + headers), can sketch the reader loop
- ❌ Weak: "Just use EventSource" — misses that EventSource is GET-only and can't send prompt in body

---

### 🟡 Q5: Explain WebSocket Subprotocols, Ping/Pong, and Close Codes

**A:**

**Subprotocols** — negotiate application-level protocol at handshake time:

```
Client: GET /ws HTTP/1.1
        Upgrade: websocket
        Sec-WebSocket-Protocol: graphql-ws, chat.v2

Server: HTTP/1.1 101 Switching Protocols
        Sec-WebSocket-Protocol: graphql-ws  ← selected protocol
```

`ws.protocol` property reflects the negotiated value. Useful for versioning (client supports `chat.v2`, falls back to `chat.v1`).

**Ping/Pong** — keep-alive mechanism at protocol level:

- Browser cannot send WebSocket ping frames (API limitation) — only servers can initiate WS-level pings
- Browser auto-responds to server pings with pong frames (transparent)
- FE developers use **application-level heartbeat**: send `{"type":"ping"}` JSON message every 25–30s

**Close codes** — why the connection ended:

- `1000`: Normal closure. No reconnect needed.
- `1001`: Going away (tab close, page navigate). No reconnect.
- `1006`: **Abnormal closure** — no close frame received. Network drop! Should reconnect.
- `1008`: Policy violation (server kicked client).
- `1009`: Message too large.
- `1011`: Unexpected server error (like HTTP 500). May retry.
- `4000–4999`: **Application-defined**. Examples: `4001` Unauthorized, `4004` Room full, `4008` Rate limited.

```typescript
ws.onclose = ({ code, reason, wasClean }) => {
  if (code === 1006 || !wasClean)
    scheduleReconnect(); // Network drop
  else if (code >= 4000) handleAppError(code, reason); // Don't retry auth errors
};
```

🇻🇳 **Tóm tắt**: Subprotocols negotiate application protocol tại handshake (e.g. `graphql-ws`). Ping/Pong là keep-alive ở protocol level — browser tự respond pong, không expose API. Application-level heartbeat: gửi JSON ping message mỗi 25–30s. Close codes: `1006` = network drop (retry), `1000` = bình thường (không retry), `4xxx` = app-defined.

**💡 Interview Signal:**

- ✅ Strong: Knows browser can't initiate WS pings (API limitation), explains `1006` as network drop indicator, knows `4xxx` range is app-defined
- ❌ Weak: "Ping/pong keeps connection alive" — correct but misses the browser limitation and `1006` significance

---

### 🟡 Q6: Describe a Robust Reconnection Strategy — Exponential Backoff + Jitter + Server Resume Token

**A:**

A production-grade reconnection strategy has three layers:

**Layer 1: Exponential backoff with jitter**

```
Attempt 1: wait 1s  ± 30% jitter
Attempt 2: wait 2s  ± 30% jitter
Attempt 3: wait 4s  ± 30% jitter
...
Attempt N: wait min(baseDelay × 2^N, 30s) ± 30% jitter
```

**Why jitter?** Without it, 10,000 clients all disconnect (server restart) and all reconnect at second 4 simultaneously → **thundering herd** → server OOM immediately after restart. Jitter spreads reconnect attempts over a window.

**Layer 2: Server resume token / cursor**

- Server assigns an event ID or cursor to each event
- Client stores last seen ID in `sessionStorage` (survives page refresh, lost on tab close)
- On reconnect, client sends cursor → server replays missed events
- For SSE: `Last-Event-ID` header handled automatically by `EventSource`
- For WebSocket: send first message `{type: "resume", cursor: "...", userId: "..."}` after connection open

**Layer 3: Client-side deduplication**

- Replayed events may overlap with events already processed (e.g. server replays from last checkpoint which was 5 events ago)
- Client maintains `Set<string>` of processed event IDs
- Check before processing: `if (seen.has(event.id)) return;`
- Trim set size to avoid unbounded growth

**Additional concerns**:

- Give up after N attempts (10 is typical) — show "connection lost" UI, let user manually retry
- On `visibilitychange` (page becomes visible after background) → verify connection before resuming
- Track connection quality: if reconnects happen frequently → reduce data resolution (e.g. coarser polling interval)

🇻🇳 **Tóm tắt**: Ba lớp reconnection: (1) Exponential backoff + jitter để tránh thundering herd. (2) Server resume token (cursor/event ID) để replay missed events — SSE dùng `Last-Event-ID` tự động, WS gửi manual `{type: "resume"}`. (3) Client-side dedup bằng Set<eventId> để xử lý events replay bị trùng.

**💡 Interview Signal:**

- ✅ Strong: Explains jitter with the thundering herd reason, knows SSE vs WS resume token difference, mentions deduplication
- ❌ Weak: "Reconnect after 3 seconds" — fixed delay misses thundering herd problem entirely

---

### 🔴 Q7: What Is WebTransport and When Would You Choose It Over WebSocket?

**A:**

**WebTransport** is a browser API (Chrome 97+, Firefox 114+, **Safari: not supported 2026**) that opens a connection over **HTTP/3 QUIC** and provides:

1. **Reliable ordered streams** (like WebSocket) — multiple independent streams over one connection
2. **Unreliable datagrams** (like UDP) — fire-and-forget, no retransmission

**Key advantage over WebSocket: No TCP Head-of-Line Blocking**

- WebSocket runs on TCP: packet loss stalls **all messages** until retransmit
- WebTransport on QUIC: packet loss stalls only **affected stream**; other streams and datagrams continue flowing
- QUIC also enables 0-RTT reconnection (much faster than TCP + TLS handshake)

**When to choose WebTransport:**

- Real-time gaming with position updates (prefer **datagram** — stale positions useless)
- WebRTC signaling (can replace the signaling channel)
- Media sync signals (video player synchronization across viewers)
- Sensor telemetry where **fresh data > complete data**
- Low-latency multiplayer where jitter matters more than reliability

**When to stick with WebSocket (2026 reality):**

- **Safari users exist in your audience** — WebTransport not supported, need WS fallback anyway
- Your use case is chat/collaboration (reliability matters, HOL blocking is acceptable)
- Your backend infrastructure runs HTTP/1.1 or HTTP/2 (WebTransport requires HTTP/3)
- Simplicity preferred — WebSocket has wider library ecosystem

```typescript
// WebTransport with WebSocket fallback
async function openRealtimeConnection(url: string) {
  if (supportsWebTransport()) {
    const wt = new WebTransport(`https://example.com/webtransport`);
    await wt.ready;
    return { type: "webtransport", conn: wt };
  } else {
    const ws = new WebSocket(`wss://example.com/ws`);
    return { type: "websocket", conn: ws };
  }
}
```

🇻🇳 **Tóm tắt**: WebTransport = HTTP/3 QUIC streams + datagrams. Ưu điểm: không có TCP HOL blocking, datagram unreliable cho game/telemetry, 0-RTT reconnect. Nhược điểm 2026: Safari không hỗ trợ → phải có WS fallback. Chọn WebTransport khi: gaming, media sync, telemetry cần fresh data. Stick with WS khi: cần Safari support, chat/collaboration, infra chưa hỗ trợ HTTP/3.

**💡 Interview Signal:**

- ✅ Strong: Knows Safari gap (2026), explains HOL blocking difference TCP vs QUIC, distinguishes streams vs datagrams use cases, mentions 0-RTT
- ❌ Weak: "WebTransport is faster than WebSocket" — needs to qualify _when_ and _why_, and acknowledge Safari support gap

---

### 🔴 Q8: How Would You Scale a System to 1 Million Concurrent WebSocket Connections?

**A:**

This is a **systems design** question with three components: connection distribution, message routing, and presence tracking.

**Step 1: Connection Distribution**

Each server instance can handle ~50K–100K WS connections (depending on RAM, CPU, and message rate). For 1M connections: 10–20 WS server instances behind a load balancer.

**Do NOT use sticky sessions as primary strategy** — they create:

- Single-server blast radius (one server dies → 100K users disconnect simultaneously)
- Thundering herd on restart
- Uneven load distribution

**Step 2: Message Routing via Redis Pub/Sub or NATS**

User A (on Server 1) wants to send to User B (on Server 3):

```
App Server → PUBLISH to "user:B" channel on Redis
Server 3    → SUBSCRIBED to "user:B" → receives → forwards via WS
```

NATS is preferred over Redis Pub/Sub for high-throughput (NATS: millions of msgs/sec, lower latency than Redis Pub/Sub).

**Step 3: Presence with TTL — Not in DB**

❌ Never: `UPDATE users SET status='online' WHERE id=?` on every WS message/connect
✅ Correct:

```
CONNECT:    SET presence:{userId} "online" EX 60
HEARTBEAT:  SET presence:{userId} "online" EX 60  (renew every 30s)
DISCONNECT: DEL presence:{userId}  (or let TTL expire)
```

Redis SET with EX 60 = automatically expires if server crashes without cleanup. No write storm.

**Step 4: Consistent Hash for Horizontal Sharding**

Deterministically route user to shard:

```typescript
const shard = fnv32(userId) % shardCount; // Always same server for same user
```

Benefits: cache locality, predictable load, easy scaling by adding shards.

**Numbers to know:**

- 10KB RAM per WS connection → 1M connections = 10GB RAM across fleet
- Redis Pub/Sub: ~100K msgs/sec per node → use Redis Cluster or NATS for higher scale
- NATS: 10M+ msgs/sec, < 1ms latency, built for this use case

🇻🇳 **Tóm tắt**: Scale 1M WS connections: (1) 10–20 server instances × 50K connections/server. (2) Không dùng sticky sessions — dùng Redis Pub/Sub hoặc NATS để route messages cross-server. (3) Presence tracking = Redis SET với TTL (không ghi DB). (4) Consistent hash để shard deterministically. NATS tốt hơn Redis Pub/Sub khi throughput cao.

**💡 Interview Signal:**

- ✅ Strong: Rejects sticky sessions as primary strategy, proposes Redis/NATS pub/sub, knows presence-via-TTL pattern, gives connection/RAM numbers
- ❌ Weak: "Use sticky sessions" — correct for simple cases but doesn't scale; misses message routing problem

---

### 🔴 Q9: SSE Behind Enterprise Proxies — What Breaks and How Do You Fix It?

**A:**

**The problem**: Enterprise proxies (Squid, Zscaler, Blue Coat) and some reverse proxies (Nginx with default config) **buffer HTTP responses**. They wait for `Content-Length` or connection close before forwarding to the client. SSE responses are infinite — the proxy buffers forever and the client receives nothing.

**Symptoms**:

- SSE works in development (direct connection) but breaks in staging/production (behind proxy)
- Events arrive in batches (proxy flushes buffer at intervals) rather than real-time
- Connection appears established but no events for 30–60s

**Fix 1: Nginx `proxy_buffering off`**

```nginx
location /api/events {
    proxy_pass http://backend;
    proxy_buffering off;
    proxy_cache off;
    proxy_set_header Connection '';
    proxy_http_version 1.1;
}
```

**Fix 2: Server sends `X-Accel-Buffering: no` header**
Nginx (and Vercel) respects this header from the upstream application:

```typescript
res.setHeader("X-Accel-Buffering", "no");
```

**Fix 3: Cloudflare-specific**

- Cloudflare Pro+: passes through streaming responses correctly (post-2022 fix)
- Cloudflare Free tier: verify with `curl -N` that events arrive in real-time
- Cloudflare has 100s timeout → send `: heartbeat\n\n` comment every 30s

**Fix 4: For stubborn enterprise proxies (can't configure)**
Fallback to **Long Polling**: send a regular HTTP request, server holds it until an event arrives, responds, client re-requests. Inefficient but works through all proxies.

**Fix 5: HTTP/2 sometimes helps**
HTTP/2 responses flow as binary frames — some proxy buffers don't apply the same buffering logic. Worth testing.

🇻🇳 **Tóm tắt**: Enterprise proxy buffer HTTP responses → SSE bị nghẽn. Fix: (1) Nginx `proxy_buffering off`. (2) Server header `X-Accel-Buffering: no`. (3) Cloudflare: gửi heartbeat comment mỗi 30s để tránh 100s timeout. (4) Fallback to Long Polling nếu không config được proxy.

**💡 Interview Signal:**

- ✅ Strong: Identifies proxy buffering as root cause, knows `X-Accel-Buffering: no` header, explains Cloudflare timeout issue, has Long Polling as fallback
- ❌ Weak: "CORS issue" or "SSE doesn't work in production" — misdiagnoses the problem

---

### 🔴 Q10: Mobile Network Reality — How Do You Handle Radio Sleep, NAT Timeouts, and Android Doze?

**A:**

Mobile networks impose three categories of challenges for persistent connections:

**Challenge 1: NAT Timeout (Carrier-Grade NAT)**
Carrier-grade NAT removes TCP state for inactive connections after **60–90 seconds**. WebSocket appears open on client but packets are silently dropped.

```
Fix: Application-level heartbeat every 25s
ws.send(JSON.stringify({type:"ping"}));  // Keeps NAT mapping alive
```

**Challenge 2: Android Doze Mode (Android 6+) and iOS Background Suspension**
When screen off 30+ minutes (Doze) or app backgrounded (iOS), OS suspends network sockets:

- TCP connection dies silently
- App doesn't know until it tries to send (then gets timeout minutes later)

```typescript
// Detect and recover using Page Visibility API
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // App foregrounded: assume connection may be stale
    // Send ping and check response within 3s, else reconnect
    ws.send(JSON.stringify({ type: "ping", ts: Date.now() }));
    const timeout = setTimeout(() => reconnect(), 3_000);
    ws.once?.("message", () => clearTimeout(timeout));
  }
});
```

**Challenge 3: Radio Sleep / Battery Impact**
Mobile radios aggressively sleep. Frequent WS ping/pong (e.g. every 10s) wakes radio constantly → battery drain.

```
Strategy:
- On foreground: ping every 25s (balance NAT keepalive vs battery)
- On background: stop all pings, rely on push notifications
- Ping interval > 60s: NAT mapping expires → reconnect on wakeup is acceptable cost
```

**Production pattern for mobile apps (e.g. Zalo, Grab):**

```
FOREGROUND:     WebSocket + 25s ping  → realtime
BACKGROUND:     Close WS + FCM/APNs push notifications  → wake on event
WAKE FROM PUSH: Reconnect WS → fetch missed messages via REST (cursor-based)
```

🇻🇳 **Tóm tắt**: Ba thách thức mobile: (1) NAT timeout (60–90s) → gửi ping mỗi 25s để giữ NAT mapping. (2) Android Doze / iOS background = socket chết im lặng → dùng Page Visibility API để detect và reconnect khi app foreground. (3) Radio sleep = battery drain nếu ping quá thường xuyên → background: tắt WS, dùng push notification; foreground: 25s ping.

**💡 Interview Signal:**

- ✅ Strong: Knows NAT timeout ~60s (hence 25s ping), uses Page Visibility API, knows push notification fallback for background (Grab/Zalo pattern)
- ❌ Weak: "WebSocket is unreliable on mobile" — identifies symptom but not causes or fixes

---

## Anti-Patterns / Các Lỗi Cần Tránh

---

### ❌ Anti-Pattern 1: WebSocket for One-Way Notifications (Over-Engineering)

```typescript
// ❌ WRONG: WebSocket for one-way server push (price updates, notifications)
const ws = new WebSocket("wss://api.example.com/prices");
// Client never sends anything — WS is full-duplex but used only one way
// Result: sticky sessions required on LB, more complex infra, no benefit

// ✅ CORRECT: SSE for one-way server push
const es = new EventSource("/api/prices");
es.addEventListener("price", (e) => updateUI(JSON.parse(e.data)));
// HTTP-native, no sticky sessions, auto-reconnect, proxy-friendly
```

🇻🇳 **Tại sao sai**: WebSocket là overkill cho one-way push. SSE đơn giản hơn, không cần sticky sessions trên LB, thân thiện với proxy/CDN hơn. Dùng WebSocket chỉ khi thực sự cần bidirectional.

---

### ❌ Anti-Pattern 2: No Reconnection Logic in WebSocket Client

```typescript
// ❌ WRONG: No reconnect — silent failure on network drop
const ws = new WebSocket("wss://example.com/ws");
ws.onmessage = (e) => handleMessage(JSON.parse(e.data));
// Network drops → ws.onclose fires (code 1006) → connection gone → user sees nothing

// ✅ CORRECT: Reconnect with exponential backoff
const ws = new ReconnectingWebSocket("wss://example.com/ws", {
  baseDelayMs: 1_000,
  maxDelayMs: 30_000,
  maxAttempts: 10,
  jitterFactor: 0.3,
});
```

🇻🇳 **Tại sao sai**: Mạng di động không ổn định. `1006` close code = network drop bình thường. Không có reconnect = user mất kết nối im lặng, không biết mình bị disconnect. Production code phải có exponential backoff + jitter.

---

### ❌ Anti-Pattern 3: Sending Huge JSON Over WebSocket Without Pagination

```typescript
// ❌ WRONG: Send 5MB JSON payload as one WebSocket message
ws.send(JSON.stringify(entire5MBDataset));
// Problem:
// 1. WebSocket frames are 64KB max (fragmented, but reassembled in memory)
// 2. Blocks the connection while sending — head-of-line blocking
// 3. Slow clients cause server buffer to fill → OOM

// ✅ CORRECT: Paginate large data, stream incrementally
async function sendLargeDataset(ws: WebSocket, dataset: Item[]) {
  const CHUNK_SIZE = 50;
  for (let i = 0; i < dataset.length; i += CHUNK_SIZE) {
    const chunk = dataset.slice(i, i + CHUNK_SIZE);
    ws.send(JSON.stringify({ type: "chunk", data: chunk, total: dataset.length }));
    // Optional: yield to event loop between chunks
    await new Promise((r) => setTimeout(r, 0));
  }
  ws.send(JSON.stringify({ type: "done" }));
}
```

🇻🇳 **Tại sao sai**: JSON payload lớn trong một WS message block toàn bộ connection. Slow clients không consume kịp → server buffer đầy → OOM. Paginate + stream từng chunk nhỏ.

---

### ❌ Anti-Pattern 4: SSE Without Keep-Alive Comments

```typescript
// ❌ WRONG: SSE stream with no heartbeat
res.write(`data: ${JSON.stringify(event)}\n\n`);
// Problem: If no events for 60+ seconds, proxies kill idle connection
// Client thinks it's still connected but events are silently lost

// ✅ CORRECT: Send keep-alive comment every 15–30 seconds
const heartbeat = setInterval(() => {
  if (!res.writableEnded) {
    res.write(": heartbeat\n\n"); // Comment — ignored by EventSource
  }
}, 15_000);

req.on("close", () => clearInterval(heartbeat));
```

🇻🇳 **Tại sao sai**: Proxy timeout connection sau 60–90s không có traffic. SSE comment `: heartbeat\n\n` là bytes thực sự được gửi, giữ connection sống mà không trigger event trên client.

---

### ❌ Anti-Pattern 5: Server-Side WebSocket Without Backpressure

```typescript
// ❌ WRONG: Broadcast to all clients regardless of their consumption speed
function broadcastToAll(data: unknown) {
  for (const ws of allConnections) {
    ws.send(JSON.stringify(data)); // Fire and forget — no backpressure
  }
  // Problem: Slow clients (bad mobile network) → ws.bufferedAmount grows
  // Server keeps pushing → OOM on server (buffers pile up)
}

// ✅ CORRECT: Check bufferedAmount before sending
function safeSend(ws: WebSocket, data: string, dropThreshold = 1_048_576 /* 1MB */) {
  if (ws.bufferedAmount > dropThreshold) {
    // Slow client — drop this message or close connection
    console.warn(`Dropping message for slow client, buffered: ${ws.bufferedAmount}`);
    return false;
  }
  ws.send(data);
  return true;
}

// Server-side (Node.js ws library): check ws.bufferedAmount equivalent
// ws.send(data, { binary: false }, (err) => {
//   if (err) { /* client disconnected or buffer full */ }
// });
```

🇻🇳 **Tại sao sai**: WS không có built-in backpressure. Slow clients accumulate data in server-side send buffer. Không check = server RAM explosion khi có nhiều slow mobile clients. Dùng `ws.bufferedAmount` để detect slow clients và drop/close.

---

### ❌ Anti-Pattern 6: Storing Presence in Database Synchronously

```typescript
// ❌ WRONG: Write to database on every connect/disconnect/heartbeat
ws.on("connection", async (ws) => {
  await db.query("UPDATE users SET status='online', last_seen=NOW() WHERE id=?", [userId]);
  // Problem: 10K connections/sec = 10K DB writes/sec
  // MySQL/PostgreSQL cannot handle this write rate → connection pool exhaustion
});

// ✅ CORRECT: Presence in Redis with TTL
async function setPresenceOnline(userId: string) {
  await redis.set(`presence:${userId}`, "online", "EX", 60);
  // Cost: Redis SET = ~10μs, 1M ops/sec per Redis node
  // TTL auto-expires if server crashes (no zombie "online" users)
}

// Heartbeat renews TTL every 30s
setInterval(() => {
  redis.expire(`presence:${userId}`, 60);
}, 30_000);

// Read presence: O(1) Redis GET, not DB query
async function isOnline(userId: string): Promise<boolean> {
  return (await redis.exists(`presence:${userId}`)) === 1;
}
```

🇻🇳 **Tại sao sai**: Database không thể handle write storm từ WS connect/disconnect events. Redis SET với TTL = sub-millisecond, tự expire khi server crash, không cần cleanup code. Write storm lên DB → connection pool exhaustion → toàn bộ app bị chậm.

---

## 🧠 Memory Hook / Mẹo Ghi Nhớ

**"SSE is a one-way street, WS is a highway, WebTransport is Formula 1 on UDP — pick your road by traffic direction."**

Bộ nhớ nhanh:

| Keyword                 | Protocol                | Why                                  |
| ----------------------- | ----------------------- | ------------------------------------ |
| **ChatGPT / AI tokens** | SSE                     | Half-duplex, HTTP-native, POST+fetch |
| **Discord / Zalo chat** | WebSocket               | Full-duplex, bidirectional           |
| **Gaming position**     | WebTransport            | Datagrams, UDP-like, no HOL          |
| **Mobile background**   | Push + reconnect        | OS kills WS                          |
| **1M connections**      | Redis Pub/Sub fan-out   | No sticky sessions                   |
| **Proxy buffering**     | `X-Accel-Buffering: no` | Magic header for Nginx               |

---

## Q&A Summary Table / Bảng Tóm Tắt

| #   | Question                                 | Difficulty | One-Line Answer                                                                  |
| --- | ---------------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| Q1  | Long polling vs SSE vs WS                | 🟢         | Direction: one-way→SSE, bidirectional→WS, fallback→long polling                  |
| Q2  | EventSource auto-reconnect & lastEventId | 🟢         | Browser sends `Last-Event-ID` header; server replays missed events               |
| Q3  | Why ChatGPT uses SSE not WS              | 🟡         | Half-duplex token stream; SSE is HTTP-native, proxy-friendly, no sticky sessions |
| Q4  | fetch ReadableStream for streaming       | 🟡         | NDJSON or manual SSE via `reader.read()` loop; needed for POST+auth              |
| Q5  | WS subprotocols, ping/pong, close codes  | 🟡         | Subproto negotiates at handshake; `1006`=network drop; `4xxx`=app codes          |
| Q6  | Reconnection: backoff + jitter + resume  | 🟡         | Exponential + jitter avoids thundering herd; cursor replays missed events        |
| Q7  | WebTransport vs WebSocket                | 🔴         | QUIC streams+datagrams, no TCP HOL; Safari ❌ 2026 → need WS fallback            |
| Q8  | Scale 1M concurrent WS                   | 🔴         | Redis/NATS pub/sub fan-out; presence via Redis TTL; consistent hash sharding     |
| Q9  | SSE behind enterprise proxy              | 🔴         | Proxy buffers SSE; fix: `proxy_buffering off` + `X-Accel-Buffering: no`          |
| Q10 | Mobile: radio sleep, NAT, Doze           | 🔴         | 25s ping < 60s NAT; Page Visibility for reconnect; push notification background  |

---

## Cold Call / Câu Hỏi Bất Ngờ

Interviewer đột ngột hỏi một trong những câu này — bạn có **30 giây** để trả lời:

> _"Our Grab-style driver tracking needs to push location every 2 seconds to passenger. SSE or WebSocket?"_

**Answer**: SSE. Location updates are **one-way** (server → passenger client). SSE is simpler, HTTP-native, no sticky sessions. Driver sends location updates via HTTP POST to API server separately.

---

> _"We have 500K users online on Shopee Live. How does a chat message from user A reach all viewers?"_

**Answer**: Fan-out via NATS/Redis Pub/Sub. User A's WS server receives message → publishes to channel `room:liveId` → all WS servers subscribed to that channel → each delivers to their local connections. Redis Pub/Sub works to ~100K msgs/sec; NATS handles 10M+.

---

> _"Why does our SSE work locally but not on staging?"_

**Answer**: Proxy buffering. Staging has Nginx or Cloudflare in front. Add `X-Accel-Buffering: no` header from server, and `proxy_buffering off` in Nginx config.

---

> _"User complains they stop receiving updates on their phone after 5 minutes of screen-off. What's wrong?"_

**Answer**: Android Doze Mode killed the WebSocket. Add a `visibilitychange` listener — when app foregrounds, check connection state and reconnect if dead. For background: close WS, use FCM push to wake.

---

## Self-Check / Tự Kiểm Tra

Trước khi rời bài này, kiểm tra bạn có thể trả lời **không cần nhìn**:

- [ ] Vẽ được decision tree: one-way vs bidirectional → chọn protocol nào?
- [ ] Giải thích được tại sao ChatGPT dùng SSE không dùng WebSocket (3 lý do)
- [ ] Viết được SSE parser xử lý `data:`, `event:`, `id:`, multi-line, comment
- [ ] Giải thích `lastEventId` hoạt động như thế nào khi SSE reconnect
- [ ] Biết close code `1006` có nghĩa gì và phải làm gì
- [ ] Giải thích thundering herd và tại sao cần jitter trong backoff
- [ ] Nêu được 2 ưu điểm WebTransport vs WS và browser support reality (Safari gap)
- [ ] Vẽ được Redis Pub/Sub fan-out architecture cho 1M WS connections
- [ ] Giải thích tại sao `proxy_buffering off` cần cho SSE trên Nginx
- [ ] Giải thích Android Doze impact và cách handle: 25s ping, Page Visibility, push fallback
- [ ] Liệt kê được 6 anti-patterns trong bài (WS overkill, no reconnect, huge JSON, no keep-alive, no backpressure, presence in DB)

---

> 💡 **Related files**: Xem [`04-websockets-realtime.md`](./04-websockets-realtime.md) cho WebSocket internals (handshake, frame format, binary protocol). File này tập trung vào **comparison và protocol selection** — không duplicate WS internals.
