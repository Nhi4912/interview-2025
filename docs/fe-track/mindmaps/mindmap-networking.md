# Networking Mind Map - Quick Reference

> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp kiến thức Networking cho ôn tập nhanh.

---

## 🗺️ Networking Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NETWORKING LANDSCAPE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│                              ┌─────────────┐                                 │
│                              │    HTTP     │                                 │
│                              │ Foundation  │                                 │
│                              └──────┬──────┘                                 │
│                                     │                                        │
│              ┌──────────────────────┼──────────────────────┐                 │
│              │                      │                      │                 │
│        ┌─────▼─────┐          ┌─────▼─────┐          ┌─────▼─────┐          │
│        │   REST    │          │  GraphQL  │          │ WebSocket │          │
│        │   APIs    │          │   APIs    │          │ Real-time │          │
│        └─────┬─────┘          └─────┬─────┘          └─────┬─────┘          │
│              │                      │                      │                 │
│              └──────────────────────┼──────────────────────┘                 │
│                                     │                                        │
│              ┌──────────────────────┼──────────────────────┐                 │
│              │                      │                      │                 │
│        ┌─────▼─────┐          ┌─────▼─────┐          ┌─────▼─────┐          │
│        │  Caching  │          │  Security │          │    CDN    │          │
│        │ Strategies│          │   CORS    │          │ Delivery  │          │
│        └───────────┘          └───────────┘          └───────────┘          │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 HTTP Methods Cheatsheet

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP METHODS                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   METHOD     SAFE    IDEMPOTENT    BODY      USE CASE            │
│   ──────────────────────────────────────────────────────────────  │
│   GET        ✅       ✅            ❌       Read resource        │
│   HEAD       ✅       ✅            ❌       Check headers        │
│   OPTIONS    ✅       ✅            ❌       CORS preflight       │
│   POST       ❌       ❌            ✅       Create resource      │
│   PUT        ❌       ✅            ✅       Replace resource     │
│   PATCH      ❌       ❌            ✅       Partial update       │
│   DELETE     ❌       ✅            ❌       Remove resource      │
│                                                                   │
│   Safe: No side effects on server                                │
│   Idempotent: Same result if called multiple times               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 HTTP Status Codes

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATUS CODES QUICK REF                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   1xx INFORMATIONAL                                              │
│   ├─ 100 Continue                                                │
│   └─ 101 Switching Protocols (WebSocket)                         │
│                                                                   │
│   2xx SUCCESS                                                    │
│   ├─ 200 OK                    ← Standard success                │
│   ├─ 201 Created               ← POST created resource           │
│   ├─ 204 No Content            ← DELETE success                  │
│   └─ 206 Partial Content       ← Range request                   │
│                                                                   │
│   3xx REDIRECTION                                                │
│   ├─ 301 Moved Permanently     ← SEO, permanent redirect         │
│   ├─ 302 Found                 ← Temporary redirect              │
│   ├─ 304 Not Modified          ← Cache valid                     │
│   └─ 307/308 Redirect          ← Preserve method                 │
│                                                                   │
│   4xx CLIENT ERROR                                               │
│   ├─ 400 Bad Request           ← Invalid syntax                  │
│   ├─ 401 Unauthorized          ← Need authentication             │
│   ├─ 403 Forbidden             ← No permission                   │
│   ├─ 404 Not Found             ← Resource missing                │
│   ├─ 409 Conflict              ← State conflict                  │
│   ├─ 422 Unprocessable         ← Validation failed               │
│   └─ 429 Too Many Requests     ← Rate limited                    │
│                                                                   │
│   5xx SERVER ERROR                                               │
│   ├─ 500 Internal Error        ← Generic server error            │
│   ├─ 502 Bad Gateway           ← Upstream error                  │
│   ├─ 503 Service Unavailable   ← Overloaded/maintenance          │
│   └─ 504 Gateway Timeout       ← Upstream timeout                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 REST vs GraphQL vs WebSocket

```
┌─────────────────────────────────────────────────────────────────┐
│                    API PARADIGMS COMPARISON                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│              REST              GraphQL           WebSocket        │
│   ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│   │                  │  │                  │  │                │ │
│   │  GET /users      │  │  query {         │  │  Bidirectional │ │
│   │  GET /users/123  │  │    users {       │  │  Real-time     │ │
│   │  POST /users     │  │      name        │  │  Persistent    │ │
│   │  PUT /users/123  │  │      posts {     │  │  Connection    │ │
│   │  DELETE /users/1 │  │        title     │  │                │ │
│   │                  │  │      }           │  │                │ │
│   │  Multiple        │  │    }             │  │                │ │
│   │  Endpoints       │  │  }               │  │                │ │
│   │                  │  │                  │  │                │ │
│   │                  │  │  Single          │  │                │ │
│   │                  │  │  Endpoint        │  │                │ │
│   └──────────────────┘  └──────────────────┘  └────────────────┘ │
│                                                                   │
│   WHEN TO USE:                                                   │
│   ─────────────                                                  │
│   REST:     Simple CRUD, caching important, public APIs          │
│   GraphQL:  Complex data needs, multiple clients, flexibility    │
│   WebSocket: Chat, gaming, collaboration, live updates           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Caching Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                    CACHING DECISION TREE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    Is content sensitive?                         │
│                           │                                      │
│              ┌────────────┴────────────┐                         │
│              │                         │                         │
│            YES                        NO                         │
│              │                         │                         │
│              ▼                         ▼                         │
│        no-store              Can content be cached?              │
│                                        │                         │
│                           ┌────────────┴────────────┐            │
│                           │                         │            │
│                         YES                        NO            │
│                           │                         │            │
│                           ▼                         ▼            │
│                  Is it user-specific?         no-cache           │
│                           │                  (revalidate)        │
│              ┌────────────┴────────────┐                         │
│              │                         │                         │
│            YES                        NO                         │
│              │                         │                         │
│              ▼                         ▼                         │
│          private                    public                       │
│                                        │                         │
│                           Can it change during max-age?          │
│                                        │                         │
│                           ┌────────────┴────────────┐            │
│                           │                         │            │
│                          NO                        YES           │
│                           │                         │            │
│                           ▼                         ▼            │
│                      immutable            must-revalidate        │
│                  max-age=31536000         max-age=<short>        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 CORS Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CORS DECISION FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    Is request simple?                            │
│                    (GET/HEAD/POST +                              │
│                     simple headers)                              │
│                           │                                      │
│              ┌────────────┴────────────┐                         │
│              │                         │                         │
│            YES                        NO                         │
│              │                         │                         │
│              ▼                         ▼                         │
│    Send request directly      Send OPTIONS preflight             │
│              │                         │                         │
│              │                         ▼                         │
│              │                Server responds with                │
│              │                CORS headers                        │
│              │                         │                         │
│              │              ┌──────────┴──────────┐              │
│              │              │                     │              │
│              │           Allowed              Denied             │
│              │              │                     │              │
│              │              ▼                     ▼              │
│              │       Send actual request    CORS Error           │
│              │              │                                    │
│              └──────────────┤                                    │
│                             ▼                                    │
│                   Check response headers                         │
│                   Access-Control-Allow-Origin                    │
│                             │                                    │
│              ┌──────────────┴──────────────┐                     │
│              │                             │                     │
│           Matches                     No match                   │
│              │                             │                     │
│              ▼                             ▼                     │
│       Allow response                 Block response              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📡 Real-time Approaches

```
┌─────────────────────────────────────────────────────────────────┐
│                    REAL-TIME COMPARISON                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│            SHORT          LONG           SSE           WEBSOCKET │
│            POLLING        POLLING                                │
│                                                                   │
│   Direction:                                                     │
│   ──────────                                                     │
│            Req→Res        Req→Res     Server→Client   ◀──────▶  │
│                                                                   │
│   Connection:                                                    │
│   ───────────                                                    │
│            New each       Held until   Persistent    Persistent  │
│            interval       data                                   │
│                                                                   │
│   Latency:                                                       │
│   ────────                                                       │
│            High           Medium       Low           Very Low    │
│                                                                   │
│   Overhead:                                                      │
│   ─────────                                                      │
│            Very High      Medium       Low           Very Low    │
│                                                                   │
│   Binary:                                                        │
│   ───────                                                        │
│            ✅              ✅           ❌            ✅          │
│                                                                   │
│   Auto-reconnect:                                                │
│   ──────────────                                                 │
│            Manual         Manual       ✅ Auto       Manual      │
│                                                                   │
│   Best for:                                                      │
│   ─────────                                                      │
│            Legacy,        Moderate     Notifications, Chat,      │
│            Simple         updates      Live feeds    Gaming,     │
│                                                     Collab      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Headers

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY HEADERS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   HEADER                         PURPOSE                         │
│   ──────────────────────────────────────────────────────────────  │
│                                                                   │
│   Content-Security-Policy        XSS prevention                  │
│   "default-src 'self'"           Only load from same origin      │
│                                                                   │
│   Strict-Transport-Security      Force HTTPS                     │
│   "max-age=31536000"             HSTS for 1 year                 │
│                                                                   │
│   X-Content-Type-Options         Prevent MIME sniffing           │
│   "nosniff"                                                      │
│                                                                   │
│   X-Frame-Options                Prevent clickjacking            │
│   "DENY" or "SAMEORIGIN"                                         │
│                                                                   │
│   X-XSS-Protection               Legacy XSS filter               │
│   "1; mode=block"                (mostly deprecated)             │
│                                                                   │
│   Referrer-Policy                Control referrer info           │
│   "strict-origin-when-cross-origin"                              │
│                                                                   │
│   Permissions-Policy             Control browser features        │
│   "camera=(), microphone=()"     Disable camera/mic              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 HTTP/1.1 vs HTTP/2 vs HTTP/3

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP VERSIONS                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│           HTTP/1.1           HTTP/2             HTTP/3           │
│                                                                   │
│   Protocol:                                                      │
│   ─────────                                                      │
│           Text-based         Binary            Binary            │
│                                                                   │
│   Transport:                                                     │
│   ──────────                                                     │
│           TCP                TCP               QUIC (UDP)        │
│                                                                   │
│   Multiplexing:                                                  │
│   ─────────────                                                  │
│           ❌ (6 conn)        ✅ Single conn    ✅ Single conn    │
│                                                                   │
│   Head-of-line blocking:                                         │
│   ──────────────────────                                         │
│           ✅ Per conn        ✅ TCP level      ❌ Eliminated     │
│                                                                   │
│   Header compression:                                            │
│   ───────────────────                                            │
│           ❌                 ✅ HPACK          ✅ QPACK          │
│                                                                   │
│   Server Push:                                                   │
│   ────────────                                                   │
│           ❌                 ✅                ✅                │
│                                                                   │
│   Connection setup:                                              │
│   ─────────────────                                              │
│           TCP + TLS         TCP + TLS         0-RTT possible    │
│           (2-3 RTT)         (2-3 RTT)         (0-1 RTT)         │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📝 Interview Quick Answers

### HTTP & REST

```
Q: GET vs POST?
A: GET retrieves (safe, idempotent, cacheable, no body)
   POST creates (unsafe, not idempotent, has body)

Q: PUT vs PATCH?
A: PUT replaces entire resource (idempotent)
   PATCH updates partial fields (not necessarily idempotent)

Q: 401 vs 403?
A: 401 = Not authenticated (need to log in)
   403 = Authenticated but no permission

Q: REST constraints?
A: Client-server, Stateless, Cacheable, Uniform interface,
   Layered system, Code on demand (optional)
```

### GraphQL

```
Q: GraphQL vs REST?
A: GraphQL: Single endpoint, client specifies data, no over-fetching
   REST: Multiple endpoints, fixed responses, HTTP caching works

Q: N+1 problem in GraphQL?
A: Nested queries can cause N+1 database calls
   Solution: DataLoader for batching and caching

Q: Subscription vs Polling?
A: Subscription: Real-time via WebSocket, server pushes
   Polling: Client repeatedly requests, higher latency
```

### Caching

```
Q: no-cache vs no-store?
A: no-cache: Can cache but must revalidate before use
   no-store: Never store (sensitive data)

Q: ETag purpose?
A: Version identifier for conditional requests
   Server returns 304 if unchanged

Q: Cache layers?
A: Memory cache → Service Worker → Disk cache → CDN → Origin
```

### CORS

```
Q: What triggers preflight?
A: Non-simple request: PUT/DELETE/PATCH methods,
   custom headers, application/json content-type

Q: Why can't use * with credentials?
A: Security - would allow any site to make authenticated requests

Q: How to fix CORS error?
A: Add Access-Control-Allow-Origin header on SERVER
   (not client-side fix)
```

---

## ✅ Networking Checklist

```
□ HTTP Methods & Status Codes
  □ Know when to use each method
  □ Understand status code categories
  □ Handle errors appropriately

□ REST API Design
  □ Resource naming conventions
  □ CRUD operations mapping
  □ Pagination strategies
  □ Versioning approaches

□ GraphQL
  □ Query, Mutation, Subscription
  □ Schema definition
  □ When to use vs REST

□ Real-time Communication
  □ WebSocket connection lifecycle
  □ SSE for one-way streaming
  □ Polling strategies

□ Caching
  □ Cache-Control directives
  □ ETag and conditional requests
  □ CDN configuration
  □ Service Worker caching

□ Security
  □ Same-Origin Policy
  □ CORS headers and preflight
  □ Credentials handling
  □ Security headers
```

---

> **Module hoàn thành!** Quay lại [README.md](./mindmap-foundations.md) để xem tổng quan module.
