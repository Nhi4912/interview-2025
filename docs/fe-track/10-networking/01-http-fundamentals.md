# HTTP Fundamentals - The Web Protocol

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> HTTP là foundation của web communication. Hiểu methods, status codes, headers là essential.

---

## 🎯 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP REQUEST/RESPONSE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   CLIENT                                    SERVER                │
│   ┌──────────┐                             ┌──────────┐          │
│   │          │  ─────── REQUEST ────────▶  │          │          │
│   │ Browser  │                             │  Server  │          │
│   │          │  ◀────── RESPONSE ───────   │          │          │
│   └──────────┘                             └──────────┘          │
│                                                                   │
│   REQUEST:                     RESPONSE:                         │
│   • Method (GET, POST...)     • Status Code (200, 404...)        │
│   • URL                        • Headers                          │
│   • Headers                    • Body                             │
│   • Body (optional)                                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📨 HTTP Methods

### Common Methods

```
┌─────────────────────────────────────────────────────────────────┐
│                      HTTP METHODS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   GET        │ Retrieve resource                                 │
│              │ Safe, Idempotent, Cacheable                       │
│              │ No body                                           │
│                                                                   │
│   POST       │ Create resource / Submit data                     │
│              │ Not safe, Not idempotent                          │
│              │ Has body                                          │
│                                                                   │
│   PUT        │ Replace resource completely                       │
│              │ Idempotent                                        │
│              │ Has body                                          │
│                                                                   │
│   PATCH      │ Partial update                                    │
│              │ Not necessarily idempotent                        │
│              │ Has body                                          │
│                                                                   │
│   DELETE     │ Remove resource                                   │
│              │ Idempotent                                        │
│              │ Usually no body                                   │
│                                                                   │
│   OPTIONS    │ Get allowed methods (CORS preflight)              │
│   HEAD       │ GET without body (check existence)                │
│                                                                   │
│   Safe: No side effects                                          │
│   Idempotent: Same result if called multiple times               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Usage Examples

```javascript
// GET - Retrieve data
fetch('/api/users/123')
    .then(res => res.json());

// POST - Create new
fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John', email: 'john@example.com' })
});

// PUT - Replace entirely
fetch('/api/users/123', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John', email: 'new@example.com', age: 30 })
});

// PATCH - Partial update
fetch('/api/users/123', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'new@example.com' })
});

// DELETE - Remove
fetch('/api/users/123', { method: 'DELETE' });
```

---

## 📊 Status Codes

### Categories

```
┌─────────────────────────────────────────────────────────────────┐
│                      STATUS CODES                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1xx - Informational                                            │
│   100 Continue                                                    │
│   101 Switching Protocols (WebSocket upgrade)                    │
│                                                                   │
│   2xx - Success                                                   │
│   200 OK                     │ Request succeeded                 │
│   201 Created                │ Resource created (POST)           │
│   204 No Content             │ Success, no body (DELETE)         │
│                                                                   │
│   3xx - Redirection                                              │
│   301 Moved Permanently      │ URL changed permanently           │
│   302 Found (Temporary)      │ Temporary redirect                │
│   304 Not Modified           │ Use cached version                │
│   307 Temporary Redirect     │ Same method                       │
│   308 Permanent Redirect     │ Same method                       │
│                                                                   │
│   4xx - Client Error                                             │
│   400 Bad Request            │ Invalid request syntax            │
│   401 Unauthorized           │ Authentication required           │
│   403 Forbidden              │ No permission                     │
│   404 Not Found              │ Resource doesn't exist            │
│   405 Method Not Allowed     │ Wrong HTTP method                 │
│   409 Conflict               │ Resource conflict                 │
│   422 Unprocessable Entity   │ Validation failed                 │
│   429 Too Many Requests      │ Rate limited                      │
│                                                                   │
│   5xx - Server Error                                             │
│   500 Internal Server Error  │ Generic server error              │
│   502 Bad Gateway            │ Invalid upstream response         │
│   503 Service Unavailable    │ Server overloaded/maintenance     │
│   504 Gateway Timeout        │ Upstream timeout                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Handling in Code

```javascript
async function fetchWithHandling(url) {
    const response = await fetch(url);

    switch (response.status) {
        case 200:
        case 201:
            return response.json();

        case 204:
            return null; // No content

        case 400:
            throw new Error('Bad request - check your data');

        case 401:
            // Redirect to login
            window.location.href = '/login';
            break;

        case 403:
            throw new Error('You do not have permission');

        case 404:
            throw new Error('Resource not found');

        case 422:
            const errors = await response.json();
            throw new ValidationError(errors);

        case 429:
            // Rate limited - retry after delay
            const retryAfter = response.headers.get('Retry-After');
            await delay(retryAfter * 1000);
            return fetchWithHandling(url);

        case 500:
        case 502:
        case 503:
            throw new Error('Server error - please try again later');

        default:
            throw new Error(`Unexpected status: ${response.status}`);
    }
}
```

---

## 📋 HTTP Headers

### Request Headers

```javascript
fetch('/api/data', {
    headers: {
        // Content type
        'Content-Type': 'application/json',

        // Authentication
        'Authorization': 'Bearer eyJhbGc...',

        // Accept types
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',

        // Caching
        'Cache-Control': 'no-cache',
        'If-None-Match': '"abc123"',
        'If-Modified-Since': 'Wed, 21 Oct 2023 07:28:00 GMT',

        // CORS
        'Origin': 'https://example.com',

        // Custom headers
        'X-Request-ID': 'uuid-here',
        'X-API-Version': '2'
    }
});
```

### Response Headers

```javascript
// Common response headers
{
    // Content info
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': '1234',
    'Content-Encoding': 'gzip',

    // Caching
    'Cache-Control': 'max-age=3600',
    'ETag': '"abc123"',
    'Last-Modified': 'Wed, 21 Oct 2023 07:28:00 GMT',
    'Expires': 'Thu, 21 Oct 2024 07:28:00 GMT',

    // Security
    'Strict-Transport-Security': 'max-age=31536000',
    'Content-Security-Policy': "default-src 'self'",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',

    // CORS
    'Access-Control-Allow-Origin': 'https://example.com',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',

    // Cookies
    'Set-Cookie': 'session=abc; HttpOnly; Secure; SameSite=Strict'
}
```

---

## 🔒 HTTPS & TLS

### TLS Handshake

```
┌─────────────────────────────────────────────────────────────────┐
│                     TLS HANDSHAKE                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Client                              Server                     │
│      │                                   │                       │
│      │──── Client Hello ─────────────▶  │                       │
│      │     (supported ciphers, random)   │                       │
│      │                                   │                       │
│      │◀─── Server Hello ─────────────   │                       │
│      │     (chosen cipher, certificate)  │                       │
│      │                                   │                       │
│      │     Verify certificate            │                       │
│      │     Generate pre-master secret    │                       │
│      │                                   │                       │
│      │──── Key Exchange ─────────────▶  │                       │
│      │     (encrypted pre-master)        │                       │
│      │                                   │                       │
│      │     Both derive session keys      │                       │
│      │                                   │                       │
│      │──── Finished ─────────────────▶  │                       │
│      │◀─── Finished ─────────────────   │                       │
│      │                                   │                       │
│      │◀═══ Encrypted Communication ════▶│                       │
│      │                                   │                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### HTTPS Benefits

```
Security:
• Encryption: Data cannot be read in transit
• Integrity: Data cannot be modified in transit
• Authentication: Server identity verified

Required for:
• Cookies with Secure flag
• Service Workers
• Geolocation API
• Camera/Microphone access
• HTTP/2 and HTTP/3
```

---

## 🚀 HTTP/2 & HTTP/3

### HTTP/2 Features

```
┌─────────────────────────────────────────────────────────────────┐
│                   HTTP/1.1 vs HTTP/2                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   HTTP/1.1                         HTTP/2                        │
│   ┌─────────────────────┐         ┌─────────────────────┐       │
│   │ Request 1           │         │ Single Connection   │       │
│   │   └──Response 1     │         │ ┌─────────────────┐ │       │
│   │ Request 2           │         │ │ Stream 1        │ │       │
│   │   └──Response 2     │         │ │ Stream 2        │ │       │
│   │ Request 3           │         │ │ Stream 3        │ │       │
│   │   └──Response 3     │         │ │ (multiplexed)   │ │       │
│   └─────────────────────┘         │ └─────────────────┘ │       │
│                                   └─────────────────────┘       │
│   • Text-based                     • Binary protocol            │
│   • Head-of-line blocking          • Multiplexing               │
│   • Multiple connections           • Single connection          │
│   • No compression                 • Header compression (HPACK) │
│   • Client-initiated only          • Server Push                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### HTTP/3 (QUIC)

```
HTTP/3 improvements:
• Built on QUIC (UDP-based)
• No head-of-line blocking at transport layer
• Faster connection establishment (0-RTT)
• Better performance on unreliable networks
• Connection migration (change IP without reconnect)
```

---

## 📦 Request/Response Body

### Content Types

```javascript
// JSON (most common for APIs)
fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' })
});

// Form data
const formData = new FormData();
formData.append('name', 'John');
formData.append('file', fileInput.files[0]);

fetch('/api/upload', {
    method: 'POST',
    body: formData // Content-Type set automatically
});

// URL-encoded
const params = new URLSearchParams();
params.append('name', 'John');
params.append('email', 'john@example.com');

fetch('/api/form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
});

// Plain text
fetch('/api/text', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: 'Hello, World!'
});
```

---

## ❓ Câu Hỏi Phỏng Vấn

### 🟢 Junior

**Q: GET vs POST?**

A:
- GET: Retrieve data, no body, safe, idempotent, cacheable
- POST: Send data, has body, not safe/idempotent, not cacheable

**Q: 401 vs 403?**

A:
- 401 Unauthorized: Not authenticated (need to log in)
- 403 Forbidden: Authenticated but no permission

### 🟡 Mid-level

**Q: PUT vs PATCH?**

A:
- PUT: Replace entire resource, idempotent
- PATCH: Partial update, not necessarily idempotent

Example: User has {name, email, age}
- PUT: Send all fields, missing fields may be removed
- PATCH: Send only email field to update just email

**Q: Idempotent nghĩa là gì?**

A: Same request executed multiple times produces same result. GET, PUT, DELETE are idempotent. POST is not (creates new resource each time).

### 🔴 Senior

**Q: HTTP/2 improvements?**

A:
- Multiplexing: Multiple requests over single connection
- Header compression (HPACK)
- Server Push
- Binary protocol (more efficient)
- Stream prioritization

---

## 📚 Active Recall

1. [ ] List 5 HTTP methods và use cases
2. [ ] Status code categories (1xx-5xx)
3. [ ] 5 important request headers
4. [ ] TLS handshake steps
5. [ ] HTTP/2 vs HTTP/1.1 differences

---

> **Tiếp theo:** [02-rest-api-design.md](./02-rest-api-design.md) - REST API Design
