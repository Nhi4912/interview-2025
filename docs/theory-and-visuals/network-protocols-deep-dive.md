# 🌐 Network Protocols Deep Dive

## 📋 Table of Contents

- [HTTP/HTTPS Fundamentals](#httphttps-fundamentals)
- [WebSocket Protocol](#websocket-protocol)
- [HTTP/2 & HTTP/3](#http2--http3)
- [Caching Strategies](#caching-strategies)
- [Security Protocols](#security-protocols)
- [Performance Optimization](#performance-optimization)
- [Visual Diagrams](#visual-diagrams)

## 🌍 HTTP/HTTPS Fundamentals

### HTTP Request/Response Flow

```mermaid
sequenceDiagram
    participant Client
    participant DNS
    participant Server
    participant CDN

    Client->>DNS: DNS Lookup
    DNS-->>Client: IP Address
    Client->>Server: TCP Connection
    Server-->>Client: Connection Established
    Client->>Server: HTTP Request
    Server->>CDN: Check Cache
    CDN-->>Server: Cache Response
    Server-->>Client: HTTP Response
    Client->>Client: Parse & Process
```

### HTTP Methods & Status Codes

```mermaid
graph TB
    subgraph "HTTP Methods"
        A[GET] --> B[Safe, Idempotent]
        C[POST] --> D[Not Safe, Not Idempotent]
        E[PUT] --> F[Not Safe, Idempotent]
        G[DELETE] --> H[Not Safe, Idempotent]
        I[PATCH] --> J[Not Safe, Not Idempotent]
    end

    subgraph "Status Code Ranges"
        K[1xx Informational] --> L[100 Continue]
        M[2xx Success] --> N[200 OK, 201 Created]
        O[3xx Redirection] --> P[301 Moved, 304 Not Modified]
        Q[4xx Client Error] --> R[400 Bad Request, 404 Not Found]
        S[5xx Server Error] --> T[500 Internal Server Error]
    end
```

### HTTP Headers Deep Dive

{% raw %}
```javascript
// Common HTTP Headers
const httpHeaders = {
  // Request Headers
  request: {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "If-None-Match": '"abc123"',
    "If-Modified-Since": "Wed, 21 Oct 2015 07:28:00 GMT",
  },

  // Response Headers
  response: {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": "1234",
    "Cache-Control": "public, max-age=3600",
    ETag: '"abc123"',
    "Last-Modified": "Wed, 21 Oct 2015 07:28:00 GMT",
    "Set-Cookie": "sessionId=abc123; HttpOnly; Secure; SameSite=Strict",
    "Access-Control-Allow-Origin": "*",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  },
};

// HTTP Client Implementation
class HTTPClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    this.timeout = options.timeout || 5000;
    this.retries = options.retries || 3;
  }

  async request(method, endpoint, data = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = { ...this.defaultHeaders, ...options.headers };

    const config = {
      method,
      headers,
      timeout: this.timeout,
      ...options,
    };

    if (data && method !== "GET") {
      config.body = JSON.stringify(data);
    }

    let lastError;

    for (let attempt = 0; attempt < this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new HTTPError(response.status, response.statusText);
        }

        return await this.parseResponse(response);
      } catch (error) {
        lastError = error;

        if (error.name === "AbortError") {
          console.warn(`Request timeout on attempt ${attempt + 1}`);
        } else if (error instanceof HTTPError && error.status >= 500) {
          console.warn(
            `Server error on attempt ${attempt + 1}: ${error.status}`
          );
        } else {
          throw error; // Don't retry client errors
        }

        if (attempt < this.retries - 1) {
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
        }
      }
    }

    throw lastError;
  }

  async parseResponse(response) {
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else if (contentType && contentType.includes("text/")) {
      return await response.text();
    } else {
      return await response.blob();
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Convenience methods
  async get(endpoint, options = {}) {
    return this.request("GET", endpoint, null, options);
  }

  async post(endpoint, data, options = {}) {
    return this.request("POST", endpoint, data, options);
  }

  async put(endpoint, data, options = {}) {
    return this.request("PUT", endpoint, data, options);
  }

  async delete(endpoint, options = {}) {
    return this.request("DELETE", endpoint, null, options);
  }

  async patch(endpoint, data, options = {}) {
    return this.request("PATCH", endpoint, data, options);
  }
}

class HTTPError extends Error {
  constructor(status, statusText) {
    super(`HTTP ${status}: ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.name = "HTTPError";
  }
}

// Usage
const client = new HTTPClient("https://api.example.com", {
  timeout: 10000,
  retries: 3,
  headers: {
    Authorization: "Bearer token",
  },
});

// Example usage
try {
  const users = await client.get("/users");
  const newUser = await client.post("/users", {
    name: "John",
    email: "john@example.com",
  });
  const updatedUser = await client.put("/users/1", { name: "John Updated" });
  await client.delete("/users/1");
} catch (error) {
  console.error("HTTP request failed:", error);
}
```
{% endraw %}

## 🔌 WebSocket Protocol

### WebSocket Handshake & Communication

```mermaid
sequenceDiagram
    participant Client
    participant Server

    Client->>Server: HTTP Upgrade Request
    Note over Client,Server: GET /chat HTTP/1.1<br/>Upgrade: websocket<br/>Connection: Upgrade<br/>Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==

    Server-->>Client: HTTP 101 Switching Protocols
    Note over Client,Server: HTTP/1.1 101 Switching Protocols<br/>Upgrade: websocket<br/>Connection: Upgrade<br/>Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

    Note over Client,Server: WebSocket Connection Established

    Client->>Server: Text Frame: "Hello Server"
    Server-->>Client: Text Frame: "Hello Client"
    Client->>Server: Binary Frame: [binary data]
    Server-->>Client: Ping Frame
    Client-->>Server: Pong Frame
```

### WebSocket Implementation

{% raw %}
```javascript
class WebSocketClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      reconnectAttempts: 5,
      reconnectInterval: 1000,
      heartbeatInterval: 30000,
      ...options,
    };

    this.socket = null;
    this.reconnectCount = 0;
    this.heartbeatTimer = null;
    this.messageQueue = [];
    this.eventListeners = new Map();

    this.connect();
  }

  connect() {
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      this.scheduleReconnect();
    }
  }

  handleOpen(event) {
    console.log("WebSocket connected");
    this.reconnectCount = 0;
    this.startHeartbeat();
    this.flushMessageQueue();
    this.emit("open", event);
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      this.emit("message", data);

      // Handle specific message types
      if (data.type === "pong") {
        this.handlePong();
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  }

  handleClose(event) {
    console.log("WebSocket disconnected:", event.code, event.reason);
    this.stopHeartbeat();
    this.emit("close", event);

    if (
      !event.wasClean &&
      this.reconnectCount < this.options.reconnectAttempts
    ) {
      this.scheduleReconnect();
    }
  }

  handleError(error) {
    console.error("WebSocket error:", error);
    this.emit("error", error);
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      this.messageQueue.push(data);
    }
  }

  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: "ping", timestamp: Date.now() });
    }, this.options.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  handlePong() {
    // Reset heartbeat on pong received
    this.stopHeartbeat();
    this.startHeartbeat();
  }

  scheduleReconnect() {
    this.reconnectCount++;
    const delay =
      this.options.reconnectInterval * Math.pow(2, this.reconnectCount - 1);

    console.log(
      `Scheduling reconnect attempt ${this.reconnectCount} in ${delay}ms`
    );

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Event handling
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  close() {
    if (this.socket) {
      this.socket.close(1000, "Client initiated close");
    }
  }
}

// Real-time Chat Implementation
class ChatClient {
  constructor(serverUrl, userId) {
    this.userId = userId;
    this.ws = new WebSocketClient(serverUrl);
    this.messages = [];
    this.onlineUsers = new Set();

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.ws.on("open", () => {
      this.sendMessage({
        type: "join",
        userId: this.userId,
      });
    });

    this.ws.on("message", (data) => {
      this.handleMessage(data);
    });

    this.ws.on("close", () => {
      console.log("Chat disconnected");
    });
  }

  handleMessage(data) {
    switch (data.type) {
      case "chat":
        this.messages.push({
          id: data.id,
          userId: data.userId,
          message: data.message,
          timestamp: data.timestamp,
        });
        this.emit("message", data);
        break;

      case "userJoined":
        this.onlineUsers.add(data.userId);
        this.emit("userJoined", data.userId);
        break;

      case "userLeft":
        this.onlineUsers.delete(data.userId);
        this.emit("userLeft", data.userId);
        break;

      case "userList":
        this.onlineUsers = new Set(data.users);
        this.emit("userList", data.users);
        break;
    }
  }

  sendMessage(data) {
    this.ws.send({
      ...data,
      timestamp: Date.now(),
    });
  }

  sendChatMessage(message) {
    this.sendMessage({
      type: "chat",
      message: message,
    });
  }

  // Event handling
  on(event, callback) {
    this.ws.on(event, callback);
  }

  emit(event, data) {
    this.ws.emit(event, data);
  }
}

// Usage
const chat = new ChatClient("wss://chat.example.com", "user123");

chat.on("message", (data) => {
  console.log(`${data.userId}: ${data.message}`);
});

chat.on("userJoined", (userId) => {
  console.log(`${userId} joined the chat`);
});

chat.on("userLeft", (userId) => {
  console.log(`${userId} left the chat`);
});

// Send a message
chat.sendChatMessage("Hello, everyone!");
```
{% endraw %}

## 🚀 HTTP/2 & HTTP/3

### HTTP/2 Features

```mermaid
graph TB
    subgraph "HTTP/2 Features"
        A[Multiplexing] --> B[Multiple requests over single connection]
        C[Server Push] --> D[Proactive resource delivery]
        E[Header Compression] --> F[HPACK compression]
        G[Binary Protocol] --> H[More efficient parsing]
        I[Stream Prioritization] --> J[Resource priority management]
    end

    subgraph "Performance Benefits"
        K[Reduced Latency] --> L[Faster page loads]
        M[Better Bandwidth] --> N[Improved throughput]
        O[Connection Reuse] --> P[Fewer TCP connections]
    end
```

### HTTP/2 Implementation

{% raw %}
```javascript
// HTTP/2 Client with Server Push
class HTTP2Client {
  constructor() {
    this.connection = null;
    this.pushHandlers = new Map();
  }

  async connect(url) {
    try {
      // Note: This is a simplified example
      // Real HTTP/2 client would use a library like h2 or node:http2
      this.connection = await this.createHTTP2Connection(url);

      this.connection.on("push", this.handleServerPush.bind(this));
      this.connection.on("error", this.handleError.bind(this));

      console.log("HTTP/2 connection established");
    } catch (error) {
      console.error("HTTP/2 connection failed:", error);
      throw error;
    }
  }

  async request(method, path, headers = {}) {
    if (!this.connection) {
      throw new Error("Not connected");
    }

    const requestHeaders = {
      ":method": method,
      ":path": path,
      ":scheme": "https",
      ":authority": this.connection.authority,
      ...headers,
    };

    return new Promise((resolve, reject) => {
      const stream = this.connection.request(requestHeaders);

      let data = "";
      stream.on("data", (chunk) => {
        data += chunk;
      });

      stream.on("end", () => {
        resolve({
          status: stream.headers[":status"],
          headers: stream.headers,
          data: data,
        });
      });

      stream.on("error", reject);
    });
  }

  handleServerPush(stream, headers) {
    const path = headers[":path"];
    console.log(`Server push for: ${path}`);

    let data = "";
    stream.on("data", (chunk) => {
      data += chunk;
    });

    stream.on("end", () => {
      // Handle pushed resource
      this.handlePushedResource(path, data, headers);
    });
  }

  handlePushedResource(path, data, headers) {
    // Cache the pushed resource
    if (path.endsWith(".css")) {
      this.injectCSS(data);
    } else if (path.endsWith(".js")) {
      this.injectJS(data);
    } else if (path.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
      this.preloadImage(path, data);
    }
  }

  injectCSS(css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  injectJS(js) {
    const script = document.createElement("script");
    script.textContent = js;
    document.head.appendChild(script);
  }

  preloadImage(path, data) {
    const blob = new Blob([data]);
    const url = URL.createObjectURL(blob);

    // Preload the image
    const img = new Image();
    img.src = url;

    // Store for later use
    this.pushHandlers.set(path, url);
  }

  handleError(error) {
    console.error("HTTP/2 connection error:", error);
  }

  close() {
    if (this.connection) {
      this.connection.close();
    }
  }
}

// HTTP/3 with QUIC
class HTTP3Client {
  constructor() {
    // HTTP/3 is still experimental
    // This is a conceptual implementation
    console.log("HTTP/3 client - experimental feature");
  }

  async connect(url) {
    // HTTP/3 uses QUIC protocol over UDP
    // Provides better performance over unreliable networks
    console.log("Connecting via HTTP/3/QUIC...");
  }

  async request(method, path, headers = {}) {
    // HTTP/3 benefits:
    // - 0-RTT connection resumption
    // - Better multiplexing
    // - Improved congestion control
    // - Connection migration
    console.log("HTTP/3 request:", method, path);
  }
}
```
{% endraw %}

## 💾 Caching Strategies

### Cache Hierarchy

```mermaid
graph TB
    subgraph "Cache Layers"
        A[Browser Cache] --> B[Memory Cache]
        A --> C[Disk Cache]
        D[CDN Cache] --> E[Edge Servers]
        F[Application Cache] --> G[Service Workers]
        H[Database Cache] --> I[Redis/Memcached]
    end

    subgraph "Cache Strategies"
        J[Cache-First] --> K[Return cached, fallback to network]
        L[Network-First] --> M[Return network, fallback to cache]
        N[Stale-While-Revalidate] --> O[Return stale, update in background]
        P[Cache-Only] --> Q[Return cached only]
    end
```

### Advanced Caching Implementation

{% raw %}
```javascript
class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.serviceWorker = null;
    this.init();
  }

  async init() {
    if ("serviceWorker" in navigator) {
      try {
        this.serviceWorker = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registered");
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }

  // Memory Cache
  setMemoryCache(key, value, ttl = 300000) {
    // 5 minutes default
    this.memoryCache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });
  }

  getMemoryCache(key) {
    const item = this.memoryCache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.memoryCache.delete(key);
      return null;
    }

    return item.value;
  }

  // HTTP Cache Headers
  setCacheHeaders(response, strategy = "public", maxAge = 3600) {
    const headers = new Headers(response.headers);

    switch (strategy) {
      case "public":
        headers.set("Cache-Control", `public, max-age=${maxAge}`);
        break;
      case "private":
        headers.set("Cache-Control", `private, max-age=${maxAge}`);
        break;
      case "no-cache":
        headers.set("Cache-Control", "no-cache, must-revalidate");
        break;
      case "no-store":
        headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
        break;
      case "stale-while-revalidate":
        headers.set(
          "Cache-Control",
          `public, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`
        );
        break;
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // Cache Strategies
  async cacheFirst(request, cacheName = "app-cache") {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      throw new Error("Network request failed and no cache available");
    }
  }

  async networkFirst(request, cacheName = "app-cache") {
    const cache = await caches.open(cacheName);

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  }

  async staleWhileRevalidate(request, cacheName = "app-cache") {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    // Return cached response immediately if available
    const fetchPromise = fetch(request).then(async (networkResponse) => {
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    });

    if (cachedResponse) {
      return cachedResponse;
    }

    return fetchPromise;
  }

  // Cache Invalidation
  async invalidateCache(pattern, cacheName = "app-cache") {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    const matchingKeys = keys.filter((key) => {
      return pattern.test(key.url);
    });

    await Promise.all(matchingKeys.map((key) => cache.delete(key)));
    console.log(`Invalidated ${matchingKeys.length} cache entries`);
  }

  // Cache Analytics
  async getCacheStats(cacheName = "app-cache") {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    let totalSize = 0;
    const stats = {
      entries: keys.length,
      totalSize: 0,
      averageSize: 0,
      oldestEntry: null,
      newestEntry: null,
    };

    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;

        const date = new Date(response.headers.get("date") || Date.now());
        if (!stats.oldestEntry || date < stats.oldestEntry) {
          stats.oldestEntry = date;
        }
        if (!stats.newestEntry || date > stats.newestEntry) {
          stats.newestEntry = date;
        }
      }
    }

    stats.totalSize = totalSize;
    stats.averageSize = keys.length > 0 ? totalSize / keys.length : 0;

    return stats;
  }
}

// Service Worker Implementation
class ServiceWorkerCache {
  constructor() {
    this.cacheName = "app-cache-v1";
    this.assets = [
      "/",
      "/index.html",
      "/styles/main.css",
      "/scripts/app.js",
      "/images/logo.png",
    ];
  }

  async install(event) {
    console.log("Service Worker installing...");

    event.waitUntil(
      caches.open(this.cacheName).then((cache) => {
        console.log("Caching app shell");
        return cache.addAll(this.assets);
      })
    );
  }

  async fetch(event) {
    event.respondWith(this.strategy(event.request));
  }

  async strategy(request) {
    const cache = await caches.open(this.cacheName);

    // Check cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    try {
      const networkResponse = await fetch(request);

      // Cache successful responses
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
      }

      return networkResponse;
    } catch (error) {
      // Return offline page if available
      const offlineResponse = await cache.match("/offline.html");
      if (offlineResponse) {
        return offlineResponse;
      }

      throw error;
    }
  }

  async activate(event) {
    console.log("Service Worker activating...");

    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== this.cacheName) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
}

// Usage
const cacheManager = new CacheManager();

// Cache API responses
async function fetchWithCache(url, options = {}) {
  const cacheKey = `${url}-${JSON.stringify(options)}`;

  // Check memory cache first
  let data = cacheManager.getMemoryCache(cacheKey);
  if (data) {
    return data;
  }

  // Fetch from network
  const response = await fetch(url, options);
  data = await response.json();

  // Cache the result
  cacheManager.setMemoryCache(cacheKey, data, 300000); // 5 minutes

  return data;
}

// Example usage
const users = await fetchWithCache("/api/users");
```
{% endraw %}

## 🔒 Security Protocols

### TLS/SSL Handshake

```mermaid
sequenceDiagram
    participant Client
    participant Server

    Client->>Server: Client Hello
    Note over Client,Server: Supported cipher suites, random number

    Server-->>Client: Server Hello
    Note over Client,Server: Chosen cipher suite, random number, certificate

    Client->>Server: Client Key Exchange
    Note over Client,Server: Pre-master secret

    Note over Client,Server: Both compute master secret

    Client->>Server: Finished
    Server-->>Client: Finished

    Note over Client,Server: Encrypted communication begins
```

### Security Implementation

{% raw %}
```javascript
class SecurityManager {
  constructor() {
    this.csp = this.createCSP();
    this.hsts = this.createHSTS();
    this.cors = this.createCORS();
  }

  createCSP() {
    return {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "https://cdn.example.com"],
      "style-src": [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      "img-src": ["'self'", "data:", "https:"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "connect-src": ["'self'", "https://api.example.com"],
      "frame-src": ["'none'"],
      "object-src": ["'none'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"],
      "upgrade-insecure-requests": [],
    };
  }

  createHSTS() {
    return {
      "max-age": 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    };
  }

  createCORS() {
    return {
      "Access-Control-Allow-Origin": "https://app.example.com",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    };
  }

  // XSS Prevention
  sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

  // CSRF Protection
  generateCSRFToken() {
    return crypto
      .getRandomValues(new Uint8Array(32))
      .reduce((acc, val) => acc + val.toString(16).padStart(2, "0"), "");
  }

  validateCSRFToken(token, storedToken) {
    return token === storedToken;
  }

  // Content Security Policy
  setCSPHeaders(response) {
    const cspString = Object.entries(this.csp)
      .map(([key, values]) => {
        if (Array.isArray(values)) {
          return `${key} ${values.join(" ")}`;
        }
        return key;
      })
      .join("; ");

    const headers = new Headers(response.headers);
    headers.set("Content-Security-Policy", cspString);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  // HTTPS Enforcement
  enforceHTTPS() {
    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      location.replace(
        `https://${location.host}${location.pathname}${location.search}`
      );
    }
  }

  // Secure Headers
  setSecureHeaders(response) {
    const headers = new Headers(response.headers);

    // HSTS
    headers.set(
      "Strict-Transport-Security",
      `max-age=${this.hsts["max-age"]}; includeSubDomains; preload`
    );

    // X-Frame-Options
    headers.set("X-Frame-Options", "DENY");

    // X-Content-Type-Options
    headers.set("X-Content-Type-Options", "nosniff");

    // Referrer Policy
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // Permissions Policy
    headers.set(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()"
    );

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
}

// Usage
const security = new SecurityManager();

// Enforce HTTPS
security.enforceHTTPS();

// Sanitize user input
const userInput = '<script>alert("xss")</script>';
const sanitized = security.sanitizeInput(userInput);
console.log(sanitized); // &lt;script&gt;alert("xss")&lt;/script&gt;

// Generate CSRF token
const csrfToken = security.generateCSRFToken();
```
{% endraw %}

## ⚡ Performance Optimization

### Network Performance Monitoring

```javascript
class NetworkMonitor {
  constructor() {
    this.metrics = {
      requests: [],
      errors: [],
      performance: {},
    };

    this.init();
  }

  init() {
    // Monitor network requests
    this.interceptFetch();
    this.interceptXMLHttpRequest();
    this.monitorResourceTiming();
  }

  interceptFetch() {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();

        this.recordRequest({
          url,
          method: "GET",
          duration: endTime - startTime,
          status: response.status,
          size: response.headers.get("content-length"),
          timestamp: Date.now(),
        });

        return response;
      } catch (error) {
        const endTime = performance.now();

        this.recordError({
          url,
          method: "GET",
          duration: endTime - startTime,
          error: error.message,
          timestamp: Date.now(),
        });

        throw error;
      }
    };
  }

  interceptXMLHttpRequest() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      this._method = method;
      this._url = url;
      this._startTime = performance.now();

      return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (data) {
      this.addEventListener("load", () => {
        const endTime = performance.now();

        this.recordRequest({
          url: this._url,
          method: this._method,
          duration: endTime - this._startTime,
          status: this.status,
          size: this.getResponseHeader("content-length"),
          timestamp: Date.now(),
        });
      });

      this.addEventListener("error", () => {
        const endTime = performance.now();

        this.recordError({
          url: this._url,
          method: this._method,
          duration: endTime - this._startTime,
          error: "Network error",
          timestamp: Date.now(),
        });
      });

      return originalSend.apply(this, arguments);
    };
  }

  monitorResourceTiming() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === "resource") {
            this.recordResourceTiming(entry);
          }
        });
      });

      observer.observe({ entryTypes: ["resource"] });
    }
  }

  recordRequest(data) {
    this.metrics.requests.push(data);
    this.analyzePerformance();
  }

  recordError(data) {
    this.metrics.errors.push(data);
  }

  recordResourceTiming(entry) {
    this.metrics.performance[entry.name] = {
      duration: entry.duration,
      transferSize: entry.transferSize,
      decodedBodySize: entry.decodedBodySize,
      initiatorType: entry.initiatorType,
      startTime: entry.startTime,
    };
  }

  analyzePerformance() {
    const requests = this.metrics.requests;
    if (requests.length === 0) return;

    const durations = requests.map((r) => r.duration);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);

    const slowRequests = requests.filter((r) => r.duration > 1000);

    this.metrics.analysis = {
      totalRequests: requests.length,
      averageDuration: avgDuration,
      maxDuration,
      minDuration,
      slowRequests: slowRequests.length,
      errorRate: this.metrics.errors.length / requests.length,
    };

    console.log("Network Performance Analysis:", this.metrics.analysis);
  }

  getReport() {
    return {
      ...this.metrics,
      timestamp: Date.now(),
    };
  }

  // Performance recommendations
  getRecommendations() {
    const analysis = this.metrics.analysis;
    const recommendations = [];

    if (analysis.averageDuration > 500) {
      recommendations.push("Consider implementing caching strategies");
    }

    if (analysis.slowRequests > 0) {
      recommendations.push("Optimize slow requests or implement lazy loading");
    }

    if (analysis.errorRate > 0.05) {
      recommendations.push("Investigate and fix network errors");
    }

    return recommendations;
  }
}

// Usage
const networkMonitor = new NetworkMonitor();

// Get performance report
setInterval(() => {
  const report = networkMonitor.getReport();
  const recommendations = networkMonitor.getRecommendations();

  console.log("Network Report:", report);
  console.log("Recommendations:", recommendations);
}, 30000); // Every 30 seconds
```

---

## 🎯 Summary

Understanding network protocols helps you:

1. **Optimize performance** by leveraging protocol features
2. **Implement security** best practices
3. **Debug network issues** more effectively
4. **Choose appropriate protocols** for different use cases
5. **Monitor and improve** network performance

### Key Takeaways

- **HTTP/2** provides multiplexing and server push
- **WebSockets** enable real-time bidirectional communication
- **Caching strategies** significantly improve performance
- **Security protocols** protect data in transit
- **Performance monitoring** helps identify bottlenecks

### Next Steps

1. **Implement caching** strategies in your applications
2. **Monitor network performance** in production
3. **Use appropriate protocols** for different use cases
4. **Stay updated** with protocol improvements
5. **Test with different network conditions**
