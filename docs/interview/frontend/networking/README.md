# Networking Interview Preparation

## Core Concepts

### HTTP Fundamentals

- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **Status Codes**: 1xx (Informational), 2xx (Success), 3xx (Redirection), 4xx (Client Error), 5xx (Server Error)
- **Headers**: Request/Response headers, content negotiation, caching
- **Request/Response Cycle**: How HTTP communication works
- **Stateless Nature**: Each request is independent

### HTTPS & Security

- **SSL/TLS**: Encryption protocols
- **Certificates**: Digital certificates and validation
- **Mixed Content**: HTTP/HTTPS security issues
- **CORS**: Cross-Origin Resource Sharing
- **Security Headers**: CSP, HSTS, X-Frame-Options

### Web APIs

- **REST APIs**: Representational State Transfer
- **GraphQL**: Query language for APIs
- **WebSockets**: Real-time bidirectional communication
- **Server-Sent Events**: One-way real-time updates
- **gRPC**: High-performance RPC framework

## Advanced Topics

### Network Performance

- **HTTP/2**: Multiplexing, server push, header compression
- **HTTP/3**: QUIC protocol, improved performance
- **CDN**: Content Delivery Networks
- **Caching Strategies**: Browser, CDN, application caching
- **Compression**: Gzip, Brotli, compression optimization

### Browser Networking

- **Connection Limits**: Browser connection pooling
- **Resource Hints**: Preload, prefetch, preconnect
- **Service Workers**: Offline capabilities, caching
- **Progressive Web Apps**: Network-independent apps

## Common Interview Questions & Answers

### HTTP Fundamentals & Client-Server Model

#### Q1: Describe the client-server model?

**Answer** (Easy):
In the traditional client-server model, the browser acts as the client and the backend acts as the server. The client sends requests and the server generates responses.

**Key Components**:
- **Client**: Initiates requests (browsers, mobile apps)
- **Server**: Processes requests and sends responses
- **Request**: Contains method, headers, and optional body
- **Response**: Contains status code, headers, and optional body

#### Q2: What is the role of HTTP request methods (HTTP Verbs)?

**Answer** (Medium):
HTTP methods define the intended action for a given resource:

- **GET**: Retrieve data (idempotent, cacheable, safe)
- **POST**: Create new resource (not idempotent, not cacheable)
- **PUT**: Update entire resource (idempotent)
- **PATCH**: Partial update (not idempotent)
- **DELETE**: Remove resource (idempotent)
- **HEAD**: Get headers only (idempotent, cacheable, safe)
- **OPTIONS**: Get allowed methods and CORS preflight

**Idempotent**: Multiple identical requests have the same effect as a single request
**Safe**: Method doesn't modify server state

#### Q3: What is the purpose of HTTP response status codes?

**Answer** (Medium):
Status codes indicate whether a request was successful or failed. They are grouped into categories:

- **1xx (Informational)**: Request received, processing continues
- **2xx (Success)**: Request successfully received and processed
  - 200 OK, 201 Created, 204 No Content
- **3xx (Redirection)**: Further action needed to complete request
  - 301 Moved Permanently, 302 Found, 304 Not Modified
- **4xx (Client Error)**: Client-side error
  - 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- **5xx (Server Error)**: Server-side error
  - 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable

#### Q4: What's the difference between HTTP headers and request body?

**Answer** (Medium):
**HTTP Headers**:
- Contain metadata about the request/response
- Include information like content type, authentication, caching directives
- Present on both requests and responses
- Key-value pairs

**Request Body**:
- Contains the actual payload data
- Used with methods like POST, PUT, PATCH
- Can contain JSON, form data, files, etc.
- Optional depending on request type

```http
POST /api/users HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer token123

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Q5: List some common HTTP headers and describe their purposes

**Answer** (Medium):
**Request Headers**:
- `Accept`: Media types client can process
- `Authorization`: Authentication credentials
- `Content-Type`: Type of data in request body
- `User-Agent`: Client application information
- `Referer`: URL of the referring page

**Response Headers**:
- `Content-Type`: Type of data in response body
- `Set-Cookie`: Set cookies in client
- `Cache-Control`: Caching directives
- `ETag`: Entity tag for caching
- `Location`: Redirect URL
- `Access-Control-Allow-Origin`: CORS permissions

**Security Headers**:
- `Content-Security-Policy`: XSS protection
- `X-Frame-Options`: Clickjacking protection
- `Strict-Transport-Security`: Force HTTPS

### State Management & Cookies

#### Q6: HTTP is a stateless protocol - what does this mean?

**Answer** (Hard):
HTTP stateless means each request is processed independently without knowledge of previous requests. The server doesn't retain information about the client between requests.

**Implications**:
- No memory of previous interactions
- Each request must contain all necessary information
- Requires mechanisms like cookies, sessions, or tokens to maintain state

**Solutions for State Management**:
```javascript
// Cookies - server sets, browser sends automatically
document.cookie = "sessionId=abc123; Secure; HttpOnly";

// Local Storage - client-side only
localStorage.setItem('user', JSON.stringify(userData));

// Session Storage - tab-scoped
sessionStorage.setItem('tempData', value);

// JWT Tokens - stateless authentication
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

#### Q7: What is the purpose of HTTP cookies?

**Answer** (Easy):
Cookies are small pieces of data that servers send to browsers. The browser stores them and sends them back with subsequent requests to the same domain.

**Common Uses**:
- Session management (login state)
- Personalization (user preferences)
- Tracking (analytics, advertising)

```javascript
// Server sets cookie
res.setHeader('Set-Cookie', 'sessionId=abc123; HttpOnly; Secure; SameSite=Lax');

// Client sends cookie automatically
// Cookie: sessionId=abc123
```

#### Q8: What are cookies commonly used for?

**Answer** (Medium):
**Session Management**:
- User authentication status
- Shopping cart contents
- User preferences

**Personalization**:
- Language settings
- Theme preferences
- Recently viewed items

**Tracking**:
- Analytics data
- Advertising targeting
- User behavior analysis

#### Q9: What's the difference between first-party and third-party cookies?

**Answer** (Medium):
**First-party cookies**:
- Set by the domain you're currently visiting
- Used for site functionality (login, preferences)
- Generally accepted by users and browsers

**Third-party cookies**:
- Set by domains other than the current site
- Used for cross-site tracking and advertising
- Increasingly blocked by browsers
- Privacy concerns

```html
<!-- First-party cookie -->
<script>
  document.cookie = "theme=dark; domain=.mysite.com";
</script>

<!-- Third-party cookie (from embedded content) -->
<img src="https://tracker.com/pixel.gif" />
```

#### Q10: What's the purpose of setting Secure and HttpOnly attributes on cookies?

**Answer** (Hard):
**Secure attribute**:
- Cookie only transmitted over HTTPS
- Prevents interception over unsecured connections
- Essential for sensitive data

**HttpOnly attribute**:
- Cookie not accessible via JavaScript
- Prevents XSS attacks from stealing cookies
- Server-side only access

```javascript
// Secure cookie setup
res.setHeader('Set-Cookie', [
  'sessionId=abc123; HttpOnly; Secure; SameSite=Strict; Max-Age=3600'
]);

// ❌ This won't work with HttpOnly
document.cookie; // Won't include HttpOnly cookies

// ✅ Automatically sent with requests
fetch('/api/data'); // Includes HttpOnly cookies
```

### Content Types & MIME Types

#### Q11: What is a MIME type and what's its purpose?

**Answer** (Medium):
MIME (Multipurpose Internet Mail Extensions) type indicates the format of a byte stream (usually a file). Browser behavior varies based on the MIME type sent by the server.

**Format**: `type/subtype`

**Common MIME Types**:
- `text/html`: HTML documents
- `text/css`: CSS stylesheets  
- `application/json`: JSON data
- `application/javascript`: JavaScript files
- `image/jpeg`, `image/png`: Images
- `video/mp4`: Video files

```http
Content-Type: application/json; charset=utf-8
Content-Type: text/html; charset=utf-8
Content-Type: multipart/form-data; boundary=something
```

#### Q12: How do browsers and clients use headers to negotiate content representation?

**Answer** (Hard):
Content negotiation allows clients to specify preferred content types, languages, and encodings.

**Client Request Headers**:
- `Accept`: Preferred media types
- `Accept-Language`: Preferred languages
- `Accept-Encoding`: Supported compressions
- `Accept-Charset`: Character encodings

**Server Response Headers**:
- `Content-Type`: Actual media type sent
- `Content-Language`: Language of content
- `Content-Encoding`: Compression used
- `Vary`: Headers used for negotiation

```http
# Client request
Accept: application/json, text/html;q=0.9, */*;q=0.8
Accept-Language: en-US,en;q=0.9,es;q=0.8
Accept-Encoding: gzip, deflate, br

# Server response
Content-Type: application/json; charset=utf-8
Content-Language: en-US
Content-Encoding: gzip
Vary: Accept, Accept-Language, Accept-Encoding
```

#### Q13: HTTP/1 is a text protocol - how do you send binary data?

**Answer** (Hard):
Binary data is encoded for transmission over text-based HTTP/1:

**Content Encoding Methods**:
- **Base64**: Encodes binary as ASCII text
- **Multipart**: For forms with files
- **URL encoding**: For form data

```javascript
// Base64 encoding for JSON payloads
const fileBuffer = await file.arrayBuffer();
const base64String = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

fetch('/api/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ file: base64String })
});

// FormData for file uploads (multipart/form-data)
const formData = new FormData();
formData.append('file', file);

fetch('/api/upload', {
  method: 'POST',
  body: formData // Browser sets Content-Type automatically
});
```

### Streaming & Real-time Communication

#### Q14: How can a client stream data from a server without constantly polling?

**Answer** (Hard):
Several techniques enable real-time data streaming without polling:

**Long Polling**:
- Client holds request open until server has data
- Server responds when data available or timeout occurs
- Client immediately makes new request

**Server-Sent Events (SSE)**:
- One-way communication from server to client
- Built-in reconnection and event types
- Uses standard HTTP

**WebSockets**:
- Full-duplex, bidirectional communication
- Persistent connection after handshake
- Lower latency than HTTP

```javascript
// Server-Sent Events
const eventSource = new EventSource('/events');
eventSource.onmessage = (event) => {
  console.log('Data:', event.data);
};

// WebSocket
const ws = new WebSocket('wss://api.example.com/ws');
ws.onmessage = (event) => {
  console.log('Data:', JSON.parse(event.data));
};
ws.send(JSON.stringify({ type: 'subscribe', channel: 'updates' }));

// Long Polling
async function longPoll() {
  try {
    const response = await fetch('/poll', { 
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' }
    });
    const data = await response.json();
    handleData(data);
  } catch (error) {
    console.error('Polling error:', error);
  } finally {
    setTimeout(longPoll, 1000); // Retry after 1 second
  }
}
```

**Comparison**:
- **WebSockets**: Bidirectional, low latency, complex setup
- **SSE**: Simple, automatic reconnection, one-way only
- **Long Polling**: Compatible with all browsers, higher server load

### HTTP Versions & Evolution

#### Q15: What's new in HTTP/2?

**Answer** (Hard):
HTTP/2 introduces several performance improvements over HTTP/1.1:

**Key Features**:
- **Stream Multiplexing**: Multiple requests over single connection
- **Header Compression**: HPACK algorithm reduces header overhead
- **Server Push**: Server proactively sends resources
- **Binary Protocol**: More efficient than text-based HTTP/1.1
- **Stream Prioritization**: Important resources loaded first

```javascript
// HTTP/1.1 limitations
// - 6 connections per domain limit
// - Head-of-line blocking
// - Header redundancy
// - No server push

// HTTP/2 benefits
// - Single connection multiplexing
// - Compressed headers
// - Server can push CSS/JS without request
// - Binary framing layer
```

**Server Push Example**:
```javascript
// Server can push critical resources
// When client requests /index.html
// Server also pushes /style.css and /script.js
```

#### Q16: What's new in HTTP/3?

**Answer** (Hard):
HTTP/3 is the latest version, though not yet widely deployed:

**Key Innovation - QUIC Protocol**:
- Uses UDP instead of TCP as transport layer
- Eliminates head-of-line blocking at transport level
- Built-in encryption (TLS 1.3)
- Connection migration support
- 0-RTT connection establishment

**Benefits over HTTP/2**:
- No TCP head-of-line blocking
- Better performance on unreliable networks
- Faster connection establishment
- Improved congestion control

```javascript
// HTTP/3 is still emerging
// Not widely supported yet
// Benefits primarily for high-latency/lossy networks
// Mobile networks see significant improvements
```

### Advanced HTTP Topics

#### Q17: Explain the difference between HTTP and HTTPS.

**Answer**:
- **HTTP**: Unencrypted, data sent in plain text, vulnerable to interception
- **HTTPS**: Encrypted using SSL/TLS, secure communication, requires certificate
- **Ports**: HTTP uses port 80, HTTPS uses port 443
- **Security**: HTTPS provides confidentiality, integrity, and authentication

#### Q18: What are the main HTTP methods and when would you use each?

**Answer**:
- **GET**: Retrieve data (idempotent, cacheable)
- **POST**: Create new resource (not idempotent, not cacheable)
- **PUT**: Update entire resource (idempotent)
- **PATCH**: Partial update (not idempotent)
- **DELETE**: Remove resource (idempotent)
- **HEAD**: Get headers only (idempotent, cacheable)
- **OPTIONS**: Get allowed methods

#### Q19: Explain HTTP status codes 200, 201, 400, 401, 403, 404, 500.

**Answer**:
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Client error in request
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### CORS Questions

**Q: What is CORS and why is it needed?**
A: CORS (Cross-Origin Resource Sharing) is a security feature that controls which domains can access resources from your domain. It prevents malicious websites from making requests to your API on behalf of users.

**Q: How do you handle CORS in a web application?**
A:

```javascript
// Server-side (Node.js/Express)
app.use(
  cors({
    origin: ["https://yourdomain.com", "https://app.yourdomain.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Client-side
fetch("https://api.example.com/data", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Include cookies
  body: JSON.stringify(data),
});
```

### WebSocket Questions

**Q: When would you use WebSockets instead of HTTP?**
A: Use WebSockets for:

- Real-time applications (chat, gaming, live updates)
- Bidirectional communication
- Low-latency requirements
- Persistent connections
- Server push notifications

**Q: How do you implement a WebSocket connection?**
A:

```javascript
// Client-side
const socket = new WebSocket("wss://api.example.com/ws");

socket.onopen = function (event) {
  console.log("Connected to WebSocket");
  socket.send(JSON.stringify({ type: "join", room: "chat" }));
};

socket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log("Received:", data);
};

socket.onclose = function (event) {
  console.log("Disconnected from WebSocket");
};

// Server-side (Node.js with ws library)
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    const data = JSON.parse(message);
    // Handle message
    ws.send(JSON.stringify({ type: "response", data: "processed" }));
  });
});
```

## Advanced Interview Questions

**Q: How does HTTP/2 improve performance over HTTP/1.1?**
A: HTTP/2 improvements:

- **Multiplexing**: Multiple requests over single connection
- **Server Push**: Server can push resources proactively
- **Header Compression**: HPACK compression for headers
- **Binary Protocol**: More efficient than text-based HTTP/1.1
- **Stream Prioritization**: Prioritize important resources

**Q: Explain the difference between REST and GraphQL.**
A:
**REST**:

- Multiple endpoints for different resources
- Over-fetching/under-fetching issues
- Stateless, cacheable
- Simple to implement

**GraphQL**:

- Single endpoint for all data
- Precise data fetching
- Strong typing system
- Introspection capabilities

**Q: How would you implement request caching in a frontend application?**
A:

{% raw %}
```javascript
class RequestCache {
  constructor() {
    this.cache = new Map();
    this.maxAge = 5 * 60 * 1000; // 5 minutes
  }

  async get(url, options = {}) {
    const key = this.generateKey(url, options);
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.maxAge) {
      return cached.data;
    }

    const response = await fetch(url, options);
    const data = await response.json();

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    return data;
  }

  generateKey(url, options) {
    return `${url}-${JSON.stringify(options)}`;
  }

  clear() {
    this.cache.clear();
  }
}
```
{% endraw %}

## Practical Problems & Solutions

### Problem 1: Implement a Retry Mechanism

**Challenge**: Create a function that retries failed HTTP requests with exponential backoff.

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Usage
try {
  const response = await fetchWithRetry("https://api.example.com/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: "test" }),
  });
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error("Request failed after retries:", error);
}
```

### Problem 2: Create a Request Queue

**Challenge**: Implement a queue system to limit concurrent requests and prevent overwhelming the server.

```javascript
class RequestQueue {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        requestFn,
        resolve,
        reject,
      });
      this.process();
    });
  }

  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { requestFn, resolve, reject } = this.queue.shift();

    try {
      const result = await requestFn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }

  getStats() {
    return {
      running: this.running,
      queued: this.queue.length,
      maxConcurrent: this.maxConcurrent,
    };
  }
}

// Usage
const queue = new RequestQueue(2);

// Add requests to queue
const promises = [
  queue.add(() => fetch("https://api.example.com/data1")),
  queue.add(() => fetch("https://api.example.com/data2")),
  queue.add(() => fetch("https://api.example.com/data3")),
  queue.add(() => fetch("https://api.example.com/data4")),
];

const results = await Promise.all(promises);
console.log("All requests completed");
```

### Problem 3: Implement Request/Response Interceptors

**Challenge**: Create a system to intercept and modify HTTP requests and responses.

```javascript
class HttpClient {
  constructor() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  async request(url, options = {}) {
    // Apply request interceptors
    let modifiedOptions = { ...options };
    for (const interceptor of this.requestInterceptors) {
      modifiedOptions = await interceptor(url, modifiedOptions);
    }

    // Make the request
    let response = await fetch(url, modifiedOptions);

    // Apply response interceptors
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }

    return response;
  }

  async get(url, options = {}) {
    return this.request(url, { ...options, method: "GET" });
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  }
}

// Usage
const client = new HttpClient();

// Add authentication interceptor
client.addRequestInterceptor(async (url, options) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return options;
});

// Add error handling interceptor
client.addResponseInterceptor(async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Redirect to login
      window.location.href = "/login";
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response;
});

// Use the client
try {
  const response = await client.get("https://api.example.com/user");
  const user = await response.json();
  console.log(user);
} catch (error) {
  console.error("Request failed:", error);
}
```

### Problem 4: Create a WebSocket Manager

**Challenge**: Build a WebSocket manager that handles reconnection, message queuing, and event handling.

```javascript
class WebSocketManager {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      reconnectAttempts: 5,
      reconnectInterval: 1000,
      heartbeatInterval: 30000,
      ...options
    };

    this.socket = null;
    this.reconnectCount = 0;
    this.messageQueue = [];
    this.eventListeners = new Map();
    this.isConnecting = false;
    this.heartbeatTimer = null;
  }

  connect() {
    if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectCount = 0;
      this.startHeartbeat();
      this.flushMessageQueue();
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.stopHeartbeat();
      this.emit('disconnect', event);

      if (!event.wasClean && this.reconnectCount < this.options.reconnectAttempts) {
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close(1000, 'Client disconnect');
    }
  }

  send(data) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      this.messageQueue.push(data);
    }
  }

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
      listeners.forEach(callback => callback(data));
    }
  }

  private handleMessage(data) {
    if (data.type === 'pong') {
      // Heartbeat response
      return;
    }

    this.emit('message', data);
    this.emit(data.type, data);
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  private scheduleReconnect() {
    this.reconnectCount++;
    const delay = this.options.reconnectInterval * Math.pow(2, this.reconnectCount - 1);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'ping' });
    }, this.options.heartbeatInterval);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

// Usage
const ws = new WebSocketManager('wss://api.example.com/ws');

ws.on('connect', () => {
  console.log('Connected to WebSocket');
});

ws.on('message', (data) => {
  console.log('Received message:', data);
});

ws.on('chat', (data) => {
  console.log('Chat message:', data.message);
});

ws.on('disconnect', () => {
  console.log('Disconnected from WebSocket');
});

ws.connect();

// Send a message
ws.send({ type: 'chat', message: 'Hello, world!' });
```

### Problem 5: Implement API Rate Limiting

**Challenge**: Create a client-side rate limiter to prevent exceeding API rate limits.

```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async throttle(requestFn) {
    const now = Date.now();

    // Remove expired requests
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.requests.push(now);
    return requestFn();
  }

  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    );
    return this.maxRequests - this.requests.length;
  }
}

// Usage
const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

async function makeApiCall(endpoint) {
  return rateLimiter.throttle(async () => {
    const response = await fetch(`https://api.example.com/${endpoint}`);
    return response.json();
  });
}

// Make multiple API calls
const promises = [
  makeApiCall("users"),
  makeApiCall("posts"),
  makeApiCall("comments"),
  // ... more calls
];

const results = await Promise.all(promises);
console.log("API calls completed");
```

## Network Optimization Techniques

### Resource Hints

```html
<!-- Preload critical resources -->
<link rel="preload" href="/critical.css" as="style" />
<link rel="preload" href="/main.js" as="script" />

<!-- Prefetch non-critical resources -->
<link rel="prefetch" href="/next-page.js" />

<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://cdn.example.com" />
```

### Service Worker Caching

```javascript
// Service Worker for caching
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "/",
        "/styles/main.css",
        "/scripts/main.js",
        "/images/logo.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### HTTP/2 Server Push

```javascript
// Server-side (Node.js with http2)
const http2 = require("http2");
const fs = require("fs");

const server = http2.createSecureServer({
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
});

server.on("stream", (stream, headers) => {
  if (headers[":path"] === "/") {
    // Push critical resources
    stream.pushStream(
      { ":path": "/styles/critical.css" },
      (err, pushStream) => {
        pushStream.respondWithFile("/styles/critical.css");
      }
    );

    stream.pushStream({ ":path": "/scripts/main.js" }, (err, pushStream) => {
      pushStream.respondWithFile("/scripts/main.js");
    });

    stream.respondWithFile("/index.html");
  }
});
```

## Best Practices

### Security

- Always use HTTPS in production
- Implement proper CORS policies
- Validate and sanitize all inputs
- Use security headers (CSP, HSTS, etc.)
- Implement rate limiting
- Use authentication tokens

### Performance

- Minimize HTTP requests
- Use CDNs for static assets
- Implement proper caching strategies
- Compress responses (Gzip/Brotli)
- Use HTTP/2 when possible
- Optimize images and assets

### Error Handling

- Implement proper error boundaries
- Use exponential backoff for retries
- Provide meaningful error messages
- Log errors for debugging
- Handle network timeouts

## Resources

### Documentation

- [MDN Web Docs - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [MDN Web Docs - WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [HTTP/2 Specification](https://http2.github.io/http2-spec/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

### Tools

- [Postman](https://www.postman.com/) - API testing
- [WebSocket King](https://websocketking.com/) - WebSocket testing
- [HTTP/2 Test](https://tools.keycdn.com/http2-test) - HTTP/2 support check
- [SSL Labs](https://www.ssllabs.com/ssltest/) - SSL/TLS testing

### Practice Platforms

- [HTTPbin](https://httpbin.org/) - HTTP testing
- [WebSocket Echo Test](https://www.websocket.org/echo.html)
- [REST API Testing](https://jsonplaceholder.typicode.com/)

---

_This guide covers essential networking concepts for frontend interviews, including practical problems and advanced techniques commonly asked at Big Tech companies._

- Server authentication
- Protection against man-in-the-middle attacks

#### Q2: Explain the difference between TCP and UDP

**Answer**:
**TCP (Transmission Control Protocol)**:

- Connection-oriented
- Reliable delivery
- Ordered delivery
- Error checking
- Flow control
- Used for: HTTP, HTTPS, FTP, SMTP

**UDP (User Datagram Protocol)**:

- Connectionless
- Unreliable delivery
- No ordering guarantee
- No flow control
- Lower overhead
- Used for: DNS, DHCP, streaming, gaming

#### Q3: What is a CDN and how does it work?

**Answer**:
CDN (Content Delivery Network) is a distributed network of servers that deliver content based on geographic location.

**How it works**:

1. User requests content
2. DNS resolves to nearest CDN server
3. CDN server serves cached content
4. If not cached, fetches from origin server

**Benefits**:

- Reduced latency
- Reduced bandwidth costs
- Improved availability
- DDoS protection

#### Q4: Explain the difference between REST and GraphQL

**Answer**:
**REST**:

- Multiple endpoints
- Fixed data structure
- Over-fetching/under-fetching possible
- Stateless
- Cacheable

**GraphQL**:

- Single endpoint
- Flexible queries
- Precise data fetching
- Strong typing
- Introspection

## Advanced Topics

### Modern Web Protocols

#### 1. HTTP/3

**Definition**: Latest HTTP version using QUIC protocol over UDP.

**Features**:

- Multiplexing without head-of-line blocking
- Connection migration
- 0-RTT handshake
- Better performance on unreliable networks

#### 2. WebRTC

**Definition**: Web Real-Time Communication for peer-to-peer communication.

**Use Cases**:

- Video/audio calling
- File sharing
- Screen sharing
- Gaming

#### 3. Server-Sent Events (SSE)

**Definition**: Technology for pushing data from server to client over HTTP.

**Characteristics**:

- One-way communication (server to client)
- Automatic reconnection
- Built-in event types
- Simple implementation

### API Design Patterns

#### 1. RESTful Design

**Principles**:

- Use nouns, not verbs in URLs
- Use HTTP methods appropriately
- Return appropriate status codes
- Use plural nouns for collections
- Implement proper error handling

**Example**:

```
GET /api/users          # Get all users
GET /api/users/123      # Get specific user
POST /api/users         # Create user
PUT /api/users/123      # Update user
DELETE /api/users/123   # Delete user
```

#### 2. GraphQL Schema Design

**Best Practices**:

- Use descriptive field names
- Implement proper pagination
- Use input types for mutations
- Implement proper error handling
- Use fragments for reusable fields

## Security

### Common Security Issues

#### 1. XSS (Cross-Site Scripting)

**Definition**: Attack where malicious scripts are injected into trusted websites.

**Prevention**:

- Input validation and sanitization
- Output encoding
- Content Security Policy (CSP)
- HttpOnly cookies

#### 2. CSRF (Cross-Site Request Forgery)

**Definition**: Attack that forces users to perform unwanted actions.

**Prevention**:

- CSRF tokens
- SameSite cookie attribute
- Custom headers
- Double submit cookies

#### 3. SQL Injection

**Definition**: Attack where malicious SQL code is inserted into queries.

**Prevention**:

- Parameterized queries
- Input validation
- Least privilege principle
- ORM usage

### Authentication & Authorization

#### 1. JWT (JSON Web Tokens)

**Definition**: Compact, URL-safe means of representing claims between parties.

**Structure**:

- Header (algorithm, token type)
- Payload (claims)
- Signature (verification)

**Best Practices**:

- Keep tokens small
- Set appropriate expiration
- Use HTTPS
- Validate on server side

#### 2. OAuth 2.0

**Definition**: Authorization framework for third-party applications.

**Flows**:

- Authorization Code
- Implicit
- Client Credentials
- Resource Owner Password

## Performance

### Optimization Techniques

#### 1. HTTP/2 Optimization

- Use server push for critical resources
- Minimize round trips
- Optimize header compression
- Use appropriate stream prioritization

#### 2. Caching Strategies

- Browser caching
- CDN caching
- Application-level caching
- Database caching

#### 3. Compression

- Gzip compression
- Brotli compression
- Image optimization
- Minification

## Practice Problems

### Problem 1: Design a REST API

Design a REST API for a social media platform with users, posts, and comments.

### Problem 2: Implement Authentication

Build a JWT-based authentication system with refresh tokens.

### Problem 3: Create a Real-time Chat

Implement a WebSocket-based chat application with rooms and private messages.

### Problem 4: Design a CDN Strategy

Plan a CDN implementation for a global e-commerce platform.

### Problem 5: Build a GraphQL API

Create a GraphQL API for a blog platform with nested queries and mutations.

### Problem 6: Implement CORS

Set up proper CORS configuration for a multi-domain application.

### Problem 7: Design a Rate Limiting System

Implement rate limiting for API endpoints with different tiers.

### Problem 8: Create a WebRTC Application

Build a peer-to-peer video calling application using WebRTC.

---

_This guide covers essential networking concepts for frontend interviews at Big Tech companies. Focus on understanding HTTP fundamentals, security best practices, and modern web protocols._
