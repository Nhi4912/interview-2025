# Networking - HTTP & API Fundamentals

> Hiểu networking là essential cho frontend developers. HTTP, REST, GraphQL, WebSockets là core knowledge.

---

## 🎯 Module Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      NETWORKING                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│   │    HTTP     │   │    REST     │   │   GRAPHQL   │           │
│   │             │   │             │   │             │           │
│   │ Methods     │   │ Resources   │   │ Queries     │           │
│   │ Status      │   │ CRUD        │   │ Mutations   │           │
│   │ Headers     │   │ Best Pract  │   │ Subscript   │           │
│   └─────────────┘   └─────────────┘   └─────────────┘           │
│                                                                   │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│   │ WEBSOCKETS  │   │   CACHING   │   │    CORS     │           │
│   │             │   │             │   │             │           │
│   │ Real-time   │   │ HTTP Cache  │   │ Same-Origin │           │
│   │ Bidirection │   │ CDN         │   │ Preflight   │           │
│   └─────────────┘   └─────────────┘   └─────────────┘           │
│                                                                   │
│   Tại sao quan trọng:                                            │
│   • Communicate với backend services                             │
│   • Optimize data fetching                                       │
│   • Build real-time features                                     │
│   • Handle security correctly                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Nội Dung Module

### 1. [HTTP Fundamentals](./01-http-fundamentals.md)
- HTTP methods (GET, POST, PUT, DELETE)
- Status codes
- Headers
- HTTPS/TLS

### 2. [REST API Design](./02-rest-api-design.md)
- RESTful principles
- Resource naming
- CRUD operations
- Best practices

### 3. [GraphQL Basics](./03-graphql-basics.md)
- Queries và Mutations
- Schema definition
- GraphQL vs REST
- Client libraries

### 4. [WebSockets & Real-time](./04-websockets-realtime.md)
- WebSocket protocol
- Server-Sent Events
- Polling strategies
- Real-time patterns

### 5. [Caching & CDN](./05-caching-cdn.md)
- HTTP caching headers
- Cache strategies
- CDN concepts
- Service Worker caching

### 6. [CORS & Same-Origin](./06-cors-same-origin.md)
- Same-Origin Policy
- CORS headers
- Preflight requests
- Security implications

---

## 🎯 Learning Objectives

Sau khi hoàn thành module này, bạn sẽ:

- [ ] Hiểu HTTP protocol và status codes
- [ ] Design RESTful APIs theo best practices
- [ ] So sánh GraphQL và REST trade-offs
- [ ] Implement real-time features với WebSockets
- [ ] Configure caching strategies
- [ ] Handle CORS issues correctly

---

## 📖 Recommended Path

```
Week 1: HTTP Fundamentals + REST
Week 2: GraphQL + WebSockets
Week 3: Caching + CORS
```

---

> **Tiếp theo:** [01-http-fundamentals.md](./01-http-fundamentals.md) - HTTP Fundamentals
