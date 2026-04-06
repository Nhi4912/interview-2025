# API Design — Deep Theory & Interview Questions

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Networking Theory](../../shared/01-cs-fundamentals/networking-theory.md) | [Go Fundamentals](../01-golang/01-language-fundamentals.md)
> **See also**: [Table of Contents](../../00-table-of-contents.md) | [Microservices](./02-microservices.md)

> **Phạm vi**: REST, gRPC, GraphQL, API Gateway, Rate Limiting, Security, Documentation.
> Tập trung lý thuyết sâu, so sánh trade-off, ít code — phù hợp ôn phỏng vấn Backend.

---

## Real-World Scenario / Tình Huống Thực Tế

Mobile app cần hiển thị user profile với posts, followers, recent activity. Với REST:

- `GET /users/123` → 1 request
- `GET /users/123/posts` → 2nd request
- `GET /users/123/followers` → 3rd request

3 round trips trên mobile 3G ở Việt Nam = ~900ms latency. Users chờ và bounce.

**GraphQL:** 1 query, 1 round trip, chỉ lấy data cần thiết. **gRPC:** nếu đây là internal service-to-service call, binary protocol nhanh hơn JSON ~3-5x.

Chọn đúng API protocol là quyết định kiến trúc, không thể dễ dàng thay đổi sau.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng:** API là "hợp đồng" giữa các services. Thiết kế tốt = hợp đồng rõ ràng, backward compatible, không thay đổi tùy tiện.

| Protocol      | Best for                           | Trade-off                              |
| ------------- | ---------------------------------- | -------------------------------------- |
| **REST**      | Public APIs, browser clients, CRUD | Verbose, multiple round trips          |
| **gRPC**      | Internal microservices, streaming  | Binary (not browser-friendly), codegen |
| **GraphQL**   | Mobile/BFF, flexible queries       | Complex caching, N+1 risk              |
| **WebSocket** | Real-time (chat, live data)        | Stateful, harder to scale              |

**REST Stateless principle → horizontal scaling:**
Server không lưu session → bất kỳ instance nào xử lý được bất kỳ request nào → scale dễ dàng với load balancer.

---

## Concept Map / Bản Đồ Khái Niệm

```
      [HTTP + Networking Fundamentals]
              │
              ▼
     [API DESIGN]  ← bạn đang ở đây
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
[REST]    [gRPC]   [GraphQL]
Resources  Protobuf  Schema/SDL
HATEOAS    Streaming  Resolvers
Versioning  Codegen   DataLoader (N+1 fix)
    │
    ▼
[Cross-cutting]
Auth (JWT/OAuth2) | Rate limiting | Caching | Versioning
    │
    ▼
[API Gateway]
Single entry point | Kong | AWS API GW | rate limit/auth here
```

---

## Overview / Tổng Quan

File này cover toàn bộ API Design theory cần cho phỏng vấn Backend — từ REST fundamentals đến gRPC, GraphQL, API Gateway, Rate Limiting, Security, và Contract Testing.

| #   | Core Concept                | Vai trò                                                             | Interview Weight |
| --- | --------------------------- | ------------------------------------------------------------------- | ---------------- |
| 1   | **REST API Design**         | Foundation protocol — resource-based, stateless, cacheable          | ⭐⭐⭐⭐⭐       |
| 2   | **Idempotency**             | Đảm bảo safety khi retry — critical cho distributed systems         | ⭐⭐⭐⭐         |
| 3   | **gRPC & Protocol Buffers** | High-performance internal communication — binary, HTTP/2, streaming | ⭐⭐⭐⭐         |
| 4   | **GraphQL**                 | Flexible client-driven queries — giải quyết over/under-fetching     | ⭐⭐⭐           |
| 5   | **API Gateway & BFF**       | Single entry point — routing, auth, rate limiting aggregated        | ⭐⭐⭐⭐         |
| 6   | **Rate Limiting**           | Protect services from abuse — token bucket, sliding window          | ⭐⭐⭐⭐         |
| 7   | **API Security & Contract** | Auth, CORS, versioning, backward compatibility                      | ⭐⭐⭐⭐⭐       |

**Mối quan hệ:** REST là nền tảng → gRPC/GraphQL là alternatives cho specific use cases → API Gateway aggregates tất cả → Rate Limiting + Security protect → Contract ensures backward compatibility.

---

## Core Concepts — Deep Analysis / Phân Tích Sâu

### Concept 1: REST API Design

> 🧠 **Memory Hook:** REST = **R**esource **E**verywhere, **S**tateless **T**ransfer — mỗi URL là một resource, mỗi request tự chứa đủ context.

**Tại sao tồn tại? / Why does this exist?**

Cần standard way để client-server communicate qua HTTP — trước REST, mỗi API là ad-hoc RPC với convention riêng.
→ **Why?** Web cần stateless protocol để scale horizontally — server không lưu session = bất kỳ instance nào xử lý được.
→ **Why?** Roy Fielding's 2000 dissertation formalized HTTP best practices thành architectural constraints — từ chaos of RPC-style APIs thành uniform interface, enabling the web to scale to billions of users.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng thư viện công cộng. Mỗi cuốn sách có mã số (URL). Bạn có thể mượn sách (GET), thêm sách mới (POST), thay toàn bộ nội dung sách (PUT), hoặc xóa sách (DELETE). Thư viện không nhớ bạn là ai giữa các lần ghé thăm — mỗi lần bạn phải mang thẻ thư viện (stateless). Và bạn có thể photocopy sách về nhà đọc thay vì mượn lại mỗi lần (caching).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

REST hoạt động qua HTTP protocol với 6 constraints:

```
Client                                    Server
  │                                         │
  ├── GET /users/42 ──────────────────────►│
  │   Headers: Accept: application/json     │
  │   Auth: Bearer <JWT>                    │
  │                                         ├── Route to handler
  │                                         ├── Query database
  │                                         ├── Serialize to JSON
  │◄── 200 OK ────────────────────────────┤
  │   Content-Type: application/json        │
  │   Cache-Control: max-age=60             │
  │   ETag: "abc123"                        │
  │   Body: {"id":42,"name":"Alice"}        │
  │                                         │
  ├── GET /users/42 ──────────────────────►│
  │   If-None-Match: "abc123"               │
  │◄── 304 Not Modified ─────────────────┤  ← Cache hit!
```

| Constraint        | Mechanism                                | Benefit                    |
| ----------------- | ---------------------------------------- | -------------------------- |
| Client-Server     | HTTP request-response                    | Independent evolution      |
| Stateless         | Token/JWT in each request                | Horizontal scaling         |
| Cacheable         | Cache-Control, ETag, Last-Modified       | Reduced server load        |
| Uniform Interface | Resources + HTTP verbs + representations | Decoupled, predictable     |
| Layered System    | Proxy, LB, CDN transparent to client     | Infrastructure flexibility |
| Code-on-Demand    | Server sends JS to client (optional)     | Extended client capability |

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Hầu hết API tự gọi "REST" chỉ đạt Level 2 Richardson Maturity — HATEOAS gần như không ai implement
- Stateless constraint buộc dùng JWT/token → JWT không revoke được trực tiếp → cần refresh token strategy
- Over-fetching (trả quá nhiều data) và under-fetching (cần nhiều requests) là nhược điểm lớn nhất → GraphQL ra đời vì lý do này
- Caching headers (ETag, Cache-Control) bị bỏ qua ở hầu hết API → miss performance gains lớn
- PATCH semantics không standardized — JSON Merge Patch vs JSON Patch có behavior khác nhau

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                        | Đúng là                                                |
| -------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| Dùng verbs trong URL (`/getUser/123`)        | REST dùng HTTP methods cho actions, URL chỉ cho resources          | `GET /users/123` — method = action, URI = resource     |
| Trả 200 OK cho tất cả responses kể cả errors | Client không biết request fail, phải parse body để check           | Dùng đúng status codes: 400, 404, 422, 500             |
| Không implement pagination                   | API trả 100K records → timeout, OOM, bandwidth waste               | Luôn paginate list endpoints, default limit 20-50      |
| Confuse REST với "just HTTP + JSON"          | REST là architectural style với 6 constraints, không chỉ là format | REST bao gồm statelessness, caching, uniform interface |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "thiết kế REST API", "API design", "endpoint design"
- → Nhớ đến: REST 6 constraints + Richardson Maturity Model
- → Mở đầu trả lời: _"REST API design bắt đầu với resource identification — tôi xác định resources trước, map HTTP methods vào CRUD, rồi xử lý cross-cutting concerns: pagination, versioning, caching headers, error format."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Networking Theory](../../shared/01-cs-fundamentals/networking-theory.md) — HTTP protocol fundamentals
- ➡️ Để hiểu tiếp: [API Gateway & BFF](#concept-5-api-gateway--bff) — aggregation layer trên REST APIs

---

### Concept 2: Idempotency

> 🧠 **Memory Hook:** Idempotent = "Bấm nút thang máy 10 lần, kết quả vẫn như bấm 1 lần" — f(f(x)) = f(x).

**Tại sao tồn tại? / Why does this exist?**

Network có thể timeout → client retry → server nhận duplicate request → cần guarantee rằng retry không gây side effects.
→ **Why?** Distributed systems có partial failures — không biết request đã thành công hay chưa → cần safe retry mechanism.
→ **Why?** Exactly-once delivery là impossible trong distributed systems (FLP impossibility) → idempotency là workaround: at-least-once delivery + idempotent operations = effectively exactly-once.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bạn gửi thư qua bưu điện. Thư bị mất giữa đường, bạn gửi lại. Nếu thư là "đặt địa chỉ mới = 123 Nguyễn Huệ" (PUT) — gửi 2 lần vẫn same kết quả. Nhưng nếu thư là "thêm 100k vào tài khoản" (POST) — gửi 2 lần = thêm 200k! Idempotency key giống như số tracking — bưu điện thấy cùng tracking number → chỉ deliver 1 lần.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
┌──────────────────────────────────────────────────────────┐
│              HTTP Method Idempotency Matrix               │
├──────────┬────────────┬─────────────┬────────────────────┤
│ Method   │ Safe?      │ Idempotent? │ Why                │
├──────────┼────────────┼─────────────┼────────────────────┤
│ GET      │ ✅ Yes     │ ✅ Yes      │ Read-only          │
│ HEAD     │ ✅ Yes     │ ✅ Yes      │ Read-only          │
│ OPTIONS  │ ✅ Yes     │ ✅ Yes      │ Read-only          │
│ PUT      │ ❌ No      │ ✅ Yes      │ Full replace       │
│ DELETE   │ ❌ No      │ ✅ Yes      │ Already deleted=OK │
│ POST     │ ❌ No      │ ❌ No       │ Creates new each   │
│ PATCH    │ ❌ No      │ ❌ No*      │ Can increment      │
└──────────┴────────────┴─────────────┴────────────────────┘

Idempotency Key Pattern (biến POST thành idempotent):

Client                    Server                     Redis
  │                         │                          │
  ├─ POST + Key:uuid-1 ──►│                          │
  │                         ├─ SETNX uuid-1 ────────►│
  │                         │◄─ OK (new) ─────────────┤
  │                         ├─ Process payment         │
  │                         ├─ SET uuid-1=response ──►│
  │◄─ 201 Created ────────┤                          │
  │                         │                          │
  │  (timeout, retry)       │                          │
  │                         │                          │
  ├─ POST + Key:uuid-1 ──►│                          │
  │                         ├─ SETNX uuid-1 ────────►│
  │                         │◄─ EXISTS ────────────────┤
  │                         ├─ GET uuid-1 ────────────►│
  │                         │◄─ cached response ───────┤
  │◄─ 201 Created (cached)─┤  ← Không xử lý lại!    │
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- PATCH không idempotent vì `{"op": "increment", "path": "/views", "value": 1}` — gọi 2 lần tăng 2
- Idempotency key cần TTL (24-48h) — không expire → Redis/DB bloat
- Race condition: 2 requests cùng key đến đồng thời → cần SETNX atomic hoặc DB unique constraint
- Request fingerprint: nếu client gửi cùng key nhưng body khác → phải reject (422) vì semantic conflict
- DELETE idempotent nhưng response có thể khác: lần 1 → 200, lần 2 → 404 — tuy nhiên final state giống nhau

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                            | Tại sao sai                                                               | Đúng là                                                       |
| ---------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Assume POST luôn non-idempotent    | Có thể implement idempotency key để biến POST thành idempotent            | POST + idempotency key = safe retry (Stripe, Square đều dùng) |
| Không phân biệt idempotent vs safe | GET = safe + idempotent; PUT = idempotent nhưng not safe (thay đổi state) | Safe = không thay đổi state; Idempotent = N lần = 1 lần       |
| Idempotency key không expire       | Database/Redis bloat vô hạn, key collision risk tăng                      | Set TTL 24-48h, cleanup expired keys                          |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "duplicate payments", "retry safety", "exactly-once"
- → Nhớ đến: Idempotency key pattern
- → Mở đầu trả lời: _"Trong distributed systems, exactly-once delivery là impossible — nhưng at-least-once delivery + idempotent processing cho ta effectively exactly-once. Tôi implement bằng idempotency key: client gửi UUID, server check Redis trước khi process."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [REST API Design](#concept-1-rest-api-design) — HTTP methods và safety/idempotency semantics
- ➡️ Để hiểu tiếp: [Distributed Systems](./03-distributed-systems.md) — at-least-once, exactly-once delivery guarantees

---

### Concept 3: gRPC & Protocol Buffers

> 🧠 **Memory Hook:** gRPC = "Google's Remote Procedure Call trên HTTP/2" — binary protobuf thay JSON, streaming thay request-response, codegen thay manual parsing.

**Tại sao tồn tại? / Why does this exist?**

REST + JSON quá chậm cho internal microservice communication — text-based serialization, no multiplexing, no streaming.
→ **Why?** HTTP/2 multiplexing eliminates head-of-line blocking → multiple streams trên 1 TCP connection → gRPC leverage HTTP/2 natively.
→ **Why?** Google cần framework thống nhất cho 10B+ internal RPCs/second → Stubby (internal) → gRPC (open-source). Strong typing via proto schema prevents integration bugs at compile time, saving enormous debugging cost at scale.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

REST + JSON giống gửi thư viết tay — dễ đọc, ai cũng hiểu, nhưng chậm và tốn giấy. gRPC + Protobuf giống gửi mã Morse — người thường không đọc được (binary), nhưng nhanh gấp nhiều lần, và cả hai bên đều có codebook (proto file) để encode/decode chính xác. Thêm nữa, Morse có thể gửi nhiều message song song trên cùng dây (HTTP/2 multiplexing).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
gRPC Architecture Stack:

┌─────────────────────────────────────────────┐
│         Client Application Code              │
├─────────────────────────────────────────────┤
│     Generated Client Stub (from .proto)      │
├─────────────────────────────────────────────┤
│     gRPC Framework (interceptors, etc.)      │
├─────────────────────────────────────────────┤
│     HTTP/2 Transport (multiplexing)          │
├─────────────────────────────────────────────┤
│     TLS / TCP                                │
└─────────────────────────────────────────────┘
         ║ Binary Protobuf frames ║
┌─────────────────────────────────────────────┐
│     TLS / TCP                                │
├─────────────────────────────────────────────┤
│     HTTP/2 Transport                         │
├─────────────────────────────────────────────┤
│     gRPC Framework (interceptors)            │
├─────────────────────────────────────────────┤
│     Generated Server Stub (from .proto)      │
├─────────────────────────────────────────────┤
│         Server Application Code              │
└─────────────────────────────────────────────┘

4 Communication Patterns:
┌─────────────┬──────────────────────────────────┐
│ Unary       │ 1 req → 1 resp (CRUD)            │
│ Server-stream│ 1 req → N resp (feed, logs)      │
│ Client-stream│ N req → 1 resp (upload, batch)   │
│ Bidi-stream │ N req ↔ M resp (chat, collab)    │
└─────────────┴──────────────────────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Browsers không support native gRPC → cần gRPC-Web proxy (Envoy) → thêm complexity cho web clients
- Breaking proto schema changes: đổi field number hoặc type → toàn bộ clients break. Rule: NEVER change field numbers
- Không set deadlines → request chờ vô hạn → cascade timeout across services
- Binary protocol khó debug — không thể dùng curl, cần grpcurl hoặc BloomRPC
- Load balancing phức tạp hơn REST: HTTP/2 long-lived connections → L4 LB không hiệu quả → cần L7 gRPC-aware LB
- Protobuf encoding: field number < 16 dùng 1 byte, ≥16 dùng 2 bytes → plan field numbers carefully

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                   | Đúng là                                                       |
| ---------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| Dùng gRPC cho public-facing APIs         | Browsers không support native gRPC, tooling hạn chế           | gRPC cho internal service-to-service; REST/GraphQL cho public |
| Breaking proto schema (đổi field number) | Field number là wire format ID — đổi = silent data corruption | Chỉ thêm field mới, reserve deleted field numbers             |
| Không set deadlines cho RPC calls        | Request chờ vô hạn → resource leak → cascade failure          | Luôn set deadline, propagate qua service chain                |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "gRPC vs REST", "microservice communication", "protocol buffers"
- → Nhớ đến: binary vs text, HTTP/2 benefits, 4 streaming patterns, schema evolution
- → Mở đầu trả lời: _"gRPC là Google's RPC framework trên HTTP/2 với Protocol Buffers — binary serialization nhanh 3-10x so với JSON, HTTP/2 multiplexing eliminates head-of-line blocking, và proto schema cho strong typing + code generation đa ngôn ngữ."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Networking Theory](../../shared/01-cs-fundamentals/networking-theory.md) — HTTP/2, TCP, TLS
- ➡️ Để hiểu tiếp: [gRPC & Protobuf Deep](./09-grpc-protobuf.md) — implementation patterns, interceptors, deadline propagation

---

### Concept 4: GraphQL

> 🧠 **Memory Hook:** GraphQL = "SQL for APIs" — client viết query chính xác data cần, server trả đúng shape đó, không thừa không thiếu.

**Tại sao tồn tại? / Why does this exist?**

Mobile apps cần flexible data fetching — REST over-fetches (too much data) hoặc under-fetches (multiple round trips).
→ **Why?** Facebook 2012 — News Feed cần khác nhau trên iOS/Android/Web → 1 REST endpoint per screen không scale → GraphQL cho phép mỗi client tự define data shape.
→ **Why?** Graph-based data model (social network) naturally maps to graph queries — single endpoint, type system, introspection → self-documenting API. Fundamental constraint: diverse clients with different data needs nhưng cùng backend.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

REST giống đặt cơm phần — nhà hàng quyết định món gì trong phần, bạn không chọn được (over-fetching). Muốn thêm món phải gọi phần khác (under-fetching). GraphQL giống buffet — bạn tự chọn chính xác món cần, không thừa không thiếu, chỉ 1 lần lấy. Nhưng buffet cần quản lý phức tạp hơn — ai lấy quá nhiều thì phải giới hạn (query complexity limiting).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
GraphQL Request/Response Flow:

Client                      GraphQL Server              Database
  │                              │                         │
  ├─ POST /graphql ────────────►│                         │
  │  query {                     │                         │
  │    user(id: 42) {           ├─ Parse query             │
  │      name                    ├─ Validate vs schema     │
  │      posts(first: 3) {      ├─ Execute resolvers       │
  │        title                 │                         │
  │      }                       ├─ user resolver ────────►│
  │    }                         │◄─ {id:42, name, ...} ──┤
  │  }                           │                         │
  │                              ├─ posts resolver ───────►│
  │                              │◄─ [{title}, ...] ──────┤
  │                              │                         │
  │◄─ 200 OK ─────────────────┤                         │
  │  { "data": {                │                         │
  │      "user": {              │                         │
  │        "name": "Alice",     │                         │
  │        "posts": [           │                         │
  │          {"title": "..."}   │                         │
  │        ]                    │                         │
  │  }}}                        │                         │

N+1 Problem vs DataLoader Fix:
Without DataLoader: 1 + N queries    With DataLoader: 1 + 1 queries
user(42)      → SELECT * users      user(42)      → SELECT * users
  posts(42)   → SELECT * posts...   [batch all]   → SELECT * posts
  posts(43)   → SELECT * posts...                    WHERE user_id
  posts(44)   → SELECT * posts...                    IN (42,43,44)
  ...100 more queries                → 2 queries total!
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- N+1 query problem: mỗi resolver fetch independently → cần DataLoader batching (Facebook pattern)
- Query complexity attack: deeply nested query → DoS → cần depth limiting + cost analysis
- Caching khó hơn REST: mỗi query unique (POST-based) → HTTP caching không áp dụng → cần application-level cache (persisted queries, CDN với query hashing)
- File upload phức tạp — GraphQL spec không support multipart → cần workaround (separate REST endpoint hoặc multipart spec extension)
- Schema stitching/federation khi có nhiều teams: Apollo Federation vs schema merging

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                        | Tại sao sai                                                      | Đúng là                                                                     |
| ------------------------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Không implement DataLoader     | N+1 query problem → database overwhelm (100 users = 101 queries) | DataLoader batch + cache per-request: 100 users = 2 queries                 |
| Allow arbitrarily deep queries | DoS attack: `{a{b{c{d{e{...}}}}}}` → exponential DB load         | Set max depth (e.g., 10), query cost analysis, timeout                      |
| Dùng GraphQL cho mọi thứ       | Overhead không justify cho simple CRUD, server-to-server         | GraphQL cho complex client needs; REST cho simple/public; gRPC cho internal |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "GraphQL N+1", "over-fetching", "flexible API"
- → Nhớ đến: DataLoader pattern, query complexity, caching challenges
- → Mở đầu trả lời: _"GraphQL giải quyết over/under-fetching bằng cách cho client specify exact data shape — nhưng đi kèm trade-offs: N+1 query problem cần DataLoader, caching phức tạp hơn REST vì POST-based, và cần query complexity limiting để chống abuse."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [REST API Design](#concept-1-rest-api-design) — hiểu REST limitations mà GraphQL giải quyết
- ➡️ Để hiểu tiếp: [API Gateway & BFF](#concept-5-api-gateway--bff) — GraphQL thường deploy ở BFF layer

---

### Concept 5: API Gateway & BFF

> 🧠 **Memory Hook:** API Gateway = "bảo vệ chung cư" — mọi khách phải qua reception (auth, rate limit, logging) trước khi lên phòng (service). BFF = "trợ lý riêng cho từng loại khách" — mỗi client type có gateway riêng.

**Tại sao tồn tại? / Why does this exist?**

Microservices có nhiều services → client không muốn biết từng service address → cần single entry point.
→ **Why?** Cross-cutting concerns (auth, rate limiting, logging) duplicate ở mỗi service → centralize vào gateway.
→ **Why?** BFF pattern (Sam Newman 2015) — mobile cần ít data + different format vs web → 1 general-purpose gateway không optimize cho ai → BFF = specialized gateway per client type, mỗi frontend có backend riêng.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng chung cư có 50 công ty. Không có lễ tân → khách phải biết từng công ty ở tầng nào, tự kiểm tra ID. API Gateway = lễ tân chung — kiểm tra ID (auth), ghi sổ (logging), giới hạn lượt vào (rate limiting), chỉ đường đúng tầng (routing). BFF = mỗi tầng có thêm lễ tân riêng — tầng mobile, tầng web, tầng partner — mỗi lễ tân biết khách của mình cần gì.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
API Gateway Architecture:

                   Internet
                      │
                ┌─────┴──────┐
                │ API Gateway │  ← Single entry point
                │  - Auth     │
                │  - Rate Limit│
                │  - Logging  │
                │  - Transform│
                └──┬──┬──┬───┘
                   │  │  │
          ┌────────┘  │  └────────┐
          ▼           ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ User Svc │ │ Order Svc│ │Product Svc│
    └──────────┘ └──────────┘ └──────────┘

BFF Pattern (Backend for Frontend):

  Mobile App      Web App       Partner API
      │              │              │
      ▼              ▼              ▼
 ┌─────────┐   ┌─────────┐   ┌─────────┐
 │Mobile BFF│   │ Web BFF │   │Partner  │
 │-Compact  │   │-Rich    │   │BFF      │
 │-Offline  │   │-Full    │   │-Stable  │
 │ support  │   │ features│   │-Versioned│
 └────┬─────┘   └────┬────┘   └────┬────┘
      │              │              │
      └──────────┬───┴──────────────┘
                 ▼
          Internal Services
```

| Pattern  | Use Case                            | Trade-off                 |
| -------- | ----------------------------------- | ------------------------- |
| Gateway  | Single entry, cross-cutting         | Single point of failure   |
| BFF      | Client-specific optimization        | N BFFs to maintain        |
| Sidecar  | Per-service concerns (service mesh) | Resource overhead per pod |
| API Mesh | Decentralized gateway (e.g., Istio) | Operational complexity    |

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- API Gateway là single point of failure → cần high availability (active-active, multi-region)
- Gateway trở thành "God service" nếu chứa business logic → giữ gateway thin: chỉ cross-cutting concerns
- Confuse API Gateway với Service Mesh — gateway = north-south traffic (external→internal), mesh = east-west traffic (service→service with sidecars)
- Request aggregation: fan-out to N services + merge → latency = slowest service → cần timeout + partial response strategy
- BFF per team vs BFF per client type: quá nhiều BFFs → maintenance burden

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                                              | Đúng là                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Đặt business logic trong API Gateway      | Gateway thành monolith mới, coupling tất cả services                     | Gateway chỉ cho cross-cutting: auth, rate limit, logging, routing |
| Một BFF cho tất cả client types           | Mobile cần compact data, web cần rich data — 1 BFF không optimize cho ai | BFF per client type: mobile BFF, web BFF, partner BFF             |
| Không implement circuit breaker ở gateway | 1 downstream service chết → gateway block → toàn bộ API chết             | Circuit breaker per upstream service, fallback responses          |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "API gateway", "BFF pattern", "API Gateway vs Service Mesh"
- → Nhớ đến: cross-cutting concerns centralization + client-specific optimization
- → Mở đầu trả lời: _"API Gateway centralize cross-cutting concerns — auth, rate limiting, logging. Gateway = north-south traffic; Service Mesh = east-west. Khi clients có data needs khác nhau, tôi thêm BFF layer per client type."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Microservices](./02-microservices.md) — service decomposition patterns
- ➡️ Để hiểu tiếp: [Rate Limiting](#concept-6-rate-limiting--throttling) — rate limiting thường implement tại gateway layer

---

### Concept 6: Rate Limiting & Throttling

> 🧠 **Memory Hook:** Rate Limiting = "vòi nước có van" — mở hết thì tràn (DDoS), van điều chỉnh flow đúng capacity. Token bucket = xô chứa xu — mỗi request lấy 1 xu, hết xu thì chờ.

**Tại sao tồn tại? / Why does this exist?**

Protect servers from overload — too many requests = service crash.
→ **Why?** Fairness — prevent single client from monopolizing resources → ensure SLA for all clients.
→ **Why?** Cascading failure prevention — without rate limiting, upstream spike → downstream overwhelm → cascade → total system failure. Rate limiting là circuit breaker's cousin ở API layer — defense at the perimeter.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng cửa hàng có quầy thu ngân duy nhất, xử lý 10 khách/phút. Nếu 100 khách ùa vào cùng lúc → hỗn loạn → shop đóng cửa (crash). Rate limiter giống bảo vệ ở cửa — chỉ cho 10 khách/phút vào, còn lại xếp hàng chờ (throttle) hoặc quay về sau (429). Token bucket = bảo vệ có hộp xu, mỗi khách vào lấy 1 xu, hết xu thì chờ xu mới được thêm vào (refill rate).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
4 Rate Limiting Algorithms So Sánh:

┌─────────────────┬────────────────────┬────────────────────┬──────────────┐
│ Algorithm       │ How it works       │ Pros               │ Cons         │
├─────────────────┼────────────────────┼────────────────────┼──────────────┤
│ Token Bucket    │ Bucket fills at    │ Allow bursts,      │ Memory per   │
│                 │ constant rate,     │ smooth rate,       │ bucket       │
│                 │ 1 token per req    │ simple to impl.    │              │
├─────────────────┼────────────────────┼────────────────────┼──────────────┤
│ Leaky Bucket    │ Queue fills,       │ Constant output    │ No burst     │
│                 │ drains at fixed    │ rate, predictable  │ handling     │
│                 │ rate               │                    │              │
├─────────────────┼────────────────────┼────────────────────┼──────────────┤
│ Fixed Window    │ Counter per time   │ Memory efficient   │ Boundary     │
│                 │ window (e.g., /min)│ (1 counter)        │ spike (2x)   │
├─────────────────┼────────────────────┼────────────────────┼──────────────┤
│ Sliding Window  │ Weighted sum of    │ No boundary spike  │ More memory  │
│ Log/Counter     │ current + previous │ Accurate           │ & compute    │
└─────────────────┴────────────────────┴────────────────────┴──────────────┘

Token Bucket in Action (limit: 5 tokens, refill: 1/sec):

Time  Bucket  Request    Result
t=0   [5]     req1       ✅ Allow (4 left)
t=0   [4]     req2       ✅ Allow (3 left)
t=0   [3]     req3-5     ✅ Allow (0 left)
t=0   [0]     req6       ❌ 429 Too Many Requests
t=1   [1]     req7       ✅ Allow (0 left, refilled 1)
t=5   [5]     burst!     ✅ All 5 allowed (full refill)

Distributed Rate Limiting (Redis + Lua):

Service A ──┐                    ┌── Service A
Service B ──┼── Redis Cluster ──┤── Service B
Service C ──┘   (Lua atomic)    └── Service C

-- Redis Lua script (atomic increment + check):
local current = redis.call('INCR', KEYS[1])
if current == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
end
if current > tonumber(ARGV[2]) then
    return 0  -- Rate limited
end
return 1  -- Allowed
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- Fixed window boundary spike: 100 req limit/min, 100 requests ở t=0:59, 100 requests ở t=1:00 → 200 requests in 2 seconds!
- Distributed rate limiting: local counters per instance → inconsistent → cần Redis centralized hoặc approximate algorithms
- Không return `Retry-After` header → client retry storm → amplifies the problem
- Rate limiting by IP problematic khi shared NAT (e.g., corporate network: 1000 users, 1 IP)
- Graceful degradation: shed low-priority traffic first, keep health checks and admin endpoints exempt

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                       | Tại sao sai                                               | Đúng là                                                  |
| --------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| Dùng fixed window cho production              | Boundary spike: 2x traffic at window edge (59s + 1s)      | Token bucket hoặc sliding window counter cho smooth rate |
| Local counter mỗi instance (không centralize) | 5 instances × 100 req limit = 500 actual requests allowed | Redis centralized counter với Lua atomic operations      |
| Không trả Retry-After header                  | Client retry immediately → retry storm → amplify problem  | `429 + Retry-After: 30` → client backoff gracefully      |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "design rate limiter", "throttling", "DDoS protection"
- → Nhớ đến: token bucket algorithm + distributed Redis implementation
- → Mở đầu trả lời: _"Tôi clarify scope trước: rate limit per-user, per-IP, hay global? Sau đó chọn token bucket (cho phép burst), implement distributed via Redis + Lua atomic script, return 429 + Retry-After header."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [API Gateway & BFF](#concept-5-api-gateway--bff) — rate limiting deploy ở đâu
- ➡️ Để hiểu tiếp: [Resilience Patterns](./07-resilience-patterns.md) — circuit breaker, bulkhead cùng family with rate limiting

---

### Concept 7: API Security & Contract

> 🧠 **Memory Hook:** API Security = "3 câu hỏi cửa khẩu" — Bạn là ai? (AuthN) → Bạn được phép làm gì? (AuthZ) → Bạn có đang thay đổi hợp đồng không? (Contract/Versioning).

**Tại sao tồn tại? / Why does this exist?**

APIs exposed to internet → cần verify identity + permissions.
→ **Why?** JWT stateless auth enables horizontal scaling (no session store) → OAuth2 standardizes delegation → mTLS for service-to-service zero-trust.
→ **Why?** API contract (OpenAPI/Swagger) makes API-first development possible — design before implement, auto-generate clients, contract testing catches breaking changes before deploy. Without contracts, API changes break consumers silently.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng tòa nhà an ninh. Bước 1 — bảo vệ kiểm tra CMND (Authentication): bạn là ai? Bước 2 — check danh sách phòng được vào (Authorization): bạn được phép làm gì? Bước 3 — check hợp đồng thuê (API Contract): bạn thuê phòng nào, điều kiện gì? Nếu tòa nhà đổi layout (breaking change) mà không thông báo → người thuê không tìm được phòng (client break).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Authentication → Authorization → Request Processing

                 JWT Token Lifecycle:
Client                    Auth Server              API Server
  │                           │                       │
  ├─ POST /auth/login ──────►│                       │
  │  {user, pass}             ├─ Verify credentials   │
  │                           ├─ Create JWT:          │
  │                           │  Header.Payload.Sig   │
  │◄─ {access_token, ───────┤                       │
  │    refresh_token}         │                       │
  │                           │                       │
  ├─ GET /api/data ─────────────────────────────────►│
  │  Authorization: Bearer <JWT>                      │
  │                           │    ├─ Verify signature │
  │                           │    ├─ Check expiry     │
  │                           │    ├─ Extract claims   │
  │                           │    ├─ Check permissions│
  │◄─ 200 OK ───────────────────────────────────────┤

API Security Layers (Defense in Depth):
┌────────────────────────────────────────────┐
│ 1. HTTPS/TLS         (transport)           │
├────────────────────────────────────────────┤
│ 2. Authentication     (JWT/OAuth2/mTLS)    │
├────────────────────────────────────────────┤
│ 3. Authorization      (RBAC/ABAC)          │
├────────────────────────────────────────────┤
│ 4. Rate Limiting      (per client/IP)      │
├────────────────────────────────────────────┤
│ 5. Input Validation   (schema + sanitize)  │
├────────────────────────────────────────────┤
│ 6. CORS               (origin whitelist)   │
├────────────────────────────────────────────┤
│ 7. API Versioning     (URL/header/content) │
└────────────────────────────────────────────┘

Versioning Strategies:
┌──────────────┬──────────────────────┬──────────────┐
│ Strategy     │ Example              │ Trade-off    │
├──────────────┼──────────────────────┼──────────────┤
│ URL path     │ /api/v1/users        │ Simple, ugly │
│ Header       │ X-API-Version: 2     │ Clean, hidden│
│ Content-Type │ Accept: app/vnd.v2   │ RESTful, hard│
│ Query param  │ /users?version=2     │ Easy, messy  │
└──────────────┴──────────────────────┴──────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- JWT stored in localStorage → XSS attack có thể steal token → dùng httpOnly cookie (but then CSRF risk → need CSRF token)
- JWT stateless = cannot revoke immediately → short expiry (15min) + refresh token rotation
- OAuth2 complexity: 4 grant types, mỗi cái cho use case khác nhau — chọn sai → security vulnerability
- CORS `Access-Control-Allow-Origin: *` cho authenticated APIs = security hole → whitelist specific origins
- Contract testing (Pact) vs API gateway validation: both needed for different failure modes
- Backward compatibility: additive changes OK (new fields), removal/rename = breaking → version or deprecate

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                        | Tại sao sai                                                    | Đúng là                                                            |
| ---------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------ |
| Store JWT trong localStorage                   | XSS attack steal token — any injected JS can read localStorage | httpOnly secure cookie (immune to XSS) + CSRF protection           |
| Không validate JWT signature                   | Anyone can modify payload (đổi role: "admin")                  | Always verify signature with server's secret/public key            |
| `Access-Control-Allow-Origin: *` cho auth APIs | Any website can make authenticated requests                    | Whitelist specific origins, never wildcard for auth APIs           |
| Breaking API without versioning                | Client code breaks silently, trust destroyed                   | Additive changes only; breaking = new version + deprecation period |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "secure a public API", "JWT vs session", "API versioning"
- → Nhớ đến: defense-in-depth layers + JWT lifecycle + versioning strategies
- → Mở đầu trả lời: _"API security là defense in depth: HTTPS → Authentication (JWT/OAuth2) → Authorization (RBAC) → Rate limiting → Input validation → CORS → Versioning. Mỗi layer catches failures mà layer khác miss."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Auth & Security](./04-auth-security.md) — deep dive vào JWT, OAuth2, mTLS
- ➡️ Để hiểu tiếp: [Security Shared](../../shared/04-security/) — OWASP, threat modeling, encryption

---

## 1. REST API Design Principles

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q1: 6 ràng buộc (constraints) của REST theo luận văn Roy Fielding là gì? 🟡 🟡 [Mid]

**A:**

REST (Representational State Transfer) được Roy Fielding định nghĩa trong luận văn tiến sĩ năm 2000 với **6 ràng buộc kiến trúc**:

| #   | Constraint                      | Ý nghĩa                                                                     | Hệ quả                                           |
| --- | ------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------ |
| 1   | **Client-Server**               | Tách biệt UI (client) và data storage (server)                              | Cho phép phát triển độc lập, tăng portability    |
| 2   | **Stateless**                   | Mỗi request chứa ĐẦY ĐỦ thông tin để server xử lý, server không lưu session | Dễ scale horizontally, mỗi server đều xử lý được |
| 3   | **Cacheable**                   | Response phải khai báo rõ có cache được không                               | Giảm tải server, tăng tốc client                 |
| 4   | **Uniform Interface**           | Giao tiếp thống nhất qua resource + representation                          | Đơn giản hóa kiến trúc, decouple client-server   |
| 5   | **Layered System**              | Client không biết mình đang nói chuyện với server cuối hay proxy/LB         | Cho phép thêm proxy, cache, gateway giữa chừng   |
| 6   | **Code-on-Demand** _(optional)_ | Server có thể gửi executable code cho client (JS)                           | Mở rộng chức năng client mà không cần deploy lại |

**Uniform Interface** là ràng buộc quan trọng nhất, gồm 4 nguyên tắc con:

- **Resource identification** — URI xác định tài nguyên
- **Manipulation through representations** — Client dùng representation (JSON/XML) để thao tác resource
- **Self-descriptive messages** — Mỗi message chứa đủ metadata để hiểu cách xử lý
- **HATEOAS** — Hypermedia as the Engine of Application State

> **Lưu ý phỏng vấn**: Phần lớn API tự gọi là "REST" thực ra chỉ là "REST-ish" — rất ít API triển khai đầy đủ cả 6 constraints, đặc biệt HATEOAS.

---

### Q2: Resource naming conventions và URI design best practices? 🟢 🟢 [Junior]

**A:**

**Nguyên tắc cốt lõi**: URI đại diện cho **resource** (danh từ), KHÔNG phải hành động (động từ).

| Rule                    | Good                   | Bad                               |
| ----------------------- | ---------------------- | --------------------------------- |
| Dùng danh từ số nhiều   | `/users`               | `/getUser`                        |
| Dùng lowercase, hyphen  | `/user-profiles`       | `/UserProfiles`, `/user_profiles` |
| Phân cấp rõ ràng        | `/users/123/orders`    | `/getOrdersByUser?id=123`         |
| Không đuôi file         | `/users/123`           | `/users/123.json`                 |
| Không trailing slash    | `/users`               | `/users/`                         |
| Filter qua query params | `/users?status=active` | `/active-users`                   |

**Hierarchy pattern:**

```
/collection/{id}/sub-collection/{sub-id}
/users/42/orders/7/items/3
```

**Hành động không CRUD** — dùng sub-resource hoặc action:

- `POST /users/42/activate` (action)
- `POST /orders/7/cancel`
- `POST /payments/refund`

> Đây là ngoại lệ hợp lý khi hành động không map được vào CRUD.

---

### Q3: HTTP methods — ngữ nghĩa, idempotency, safety? 🟢 🟢 [Junior]

**A:**

| Method    | Mục đích                   | Safe? | Idempotent? | Request Body | Ví dụ              |
| --------- | -------------------------- | ----- | ----------- | ------------ | ------------------ |
| `GET`     | Đọc resource               | ✅    | ✅          | Không        | `GET /users/42`    |
| `POST`    | Tạo mới resource           | ❌    | ❌          | Có           | `POST /users`      |
| `PUT`     | Thay thế toàn bộ resource  | ❌    | ✅          | Có           | `PUT /users/42`    |
| `PATCH`   | Cập nhật một phần          | ❌    | ❌\*        | Có           | `PATCH /users/42`  |
| `DELETE`  | Xóa resource               | ❌    | ✅          | Không/Có     | `DELETE /users/42` |
| `HEAD`    | Giống GET nhưng không body | ✅    | ✅          | Không        | `HEAD /users/42`   |
| `OPTIONS` | Xem methods được phép      | ✅    | ✅          | Không        | `OPTIONS /users`   |

**Giải thích quan trọng:**

- **Safe**: Không thay đổi state trên server. GET gọi 1000 lần vẫn không đổi data.
- **Idempotent**: Gọi N lần cho kết quả giống gọi 1 lần. `DELETE /users/42` gọi 2 lần — lần 2 trả 404 nhưng state cuối cùng giống nhau (user đã bị xóa).
- **PATCH không idempotent\***: Vì `PATCH` có thể dùng kiểu `{"op": "increment", "path": "/views", "value": 1}` — gọi 2 lần tăng 2.

**PUT vs PATCH — sự khác biệt thực sự:**

- `PUT` gửi **toàn bộ** resource → nếu thiếu field, field đó bị reset về default/null
- `PATCH` chỉ gửi **field cần thay đổi** → các field khác giữ nguyên

---

### Q4: HTTP Status Codes — bảng đầy đủ? 🟢 🟢 [Junior]

**A:**

#### 2xx — Thành công

| Code | Tên        | Ý nghĩa                                           |
| ---- | ---------- | ------------------------------------------------- |
| 200  | OK         | Request thành công, có response body              |
| 201  | Created    | Tạo mới thành công (dùng với POST)                |
| 202  | Accepted   | Server nhận request nhưng chưa xử lý xong (async) |
| 204  | No Content | Thành công nhưng không có body (dùng với DELETE)  |

#### 3xx — Chuyển hướng

| Code | Tên               | Ý nghĩa                                   |
| ---- | ----------------- | ----------------------------------------- |
| 301  | Moved Permanently | Resource đã chuyển vĩnh viễn sang URL mới |
| 302  | Found             | Chuyển hướng tạm thời                     |
| 304  | Not Modified      | Resource chưa thay đổi, client dùng cache |

#### 4xx — Lỗi từ Client

| Code | Tên                  | Ý nghĩa                                                             |
| ---- | -------------------- | ------------------------------------------------------------------- |
| 400  | Bad Request          | Request sai format, thiếu field, validation fail                    |
| 401  | Unauthorized         | Chưa xác thực (thiếu/sai token) — đúng ra nên gọi "Unauthenticated" |
| 403  | Forbidden            | Đã xác thực nhưng không có quyền — đây mới là "Unauthorized"        |
| 404  | Not Found            | Resource không tồn tại                                              |
| 405  | Method Not Allowed   | HTTP method không được hỗ trợ cho URI này                           |
| 409  | Conflict             | Xung đột (duplicate, version conflict)                              |
| 422  | Unprocessable Entity | Cú pháp đúng nhưng logic sai (email format invalid)                 |
| 429  | Too Many Requests    | Bị rate limit                                                       |

#### 5xx — Lỗi từ Server

| Code | Tên                   | Ý nghĩa                              |
| ---- | --------------------- | ------------------------------------ |
| 500  | Internal Server Error | Lỗi không xác định từ server         |
| 502  | Bad Gateway           | Upstream server trả response lỗi     |
| 503  | Service Unavailable   | Server quá tải hoặc đang maintenance |
| 504  | Gateway Timeout       | Upstream server không trả lời kịp    |

> **Mẹo phỏng vấn**: 401 vs 403 là câu hỏi cực kỳ phổ biến. Nhớ: **401 = "Bạn là ai?"**, **403 = "Tôi biết bạn là ai, nhưng bạn không được phép."**

---

### Q5: HATEOAS là gì? Tại sao ít API dùng? 🟡 🟡 [Mid]

**A:**

**HATEOAS** (Hypermedia As The Engine Of Application State) — client khám phá API qua các link được server trả về, thay vì hardcode URL.

```json
{
  "id": 42,
  "name": "Alice",
  "links": [
    { "rel": "self", "href": "/users/42" },
    { "rel": "orders", "href": "/users/42/orders" },
    { "rel": "update", "href": "/users/42", "method": "PUT" },
    { "rel": "delete", "href": "/users/42", "method": "DELETE" }
  ]
}
```

**Lợi ích**: Client không cần biết trước cấu trúc URL → server có thể thay đổi URL mà không break client.

**Tại sao ít dùng**:

- Phức tạp hóa response, tăng payload
- Frontend thường hardcode URL anyway
- Thiếu tooling hỗ trợ tốt
- Overhead không xứng với lợi ích cho hầu hết ứng dụng

> Thực tế: GitHub API là một trong những API nổi tiếng triển khai HATEOAS tốt nhất.

---

### Q6: Richardson Maturity Model là gì? 🟡 🟡 [Mid]

**A:**

Mô hình đánh giá mức độ "REST" của API, gồm 4 level:

```
Level 3: Hypermedia Controls (HATEOAS)        ← TRUE REST
    ↑    API trả link navigable
Level 2: HTTP Verbs                            ← Hầu hết API hiện tại
    ↑    Dùng đúng GET/POST/PUT/DELETE + status codes
Level 1: Resources
    ↑    Có URI cho từng resource, nhưng chỉ dùng POST
Level 0: The Swamp of POX (Plain Old XML)
         Một endpoint duy nhất, tất cả dùng POST
         Ví dụ: SOAP — POST /api với body chứa action
```

| Level | Đặc điểm                  | Ví dụ                                           |
| ----- | ------------------------- | ----------------------------------------------- |
| 0     | 1 URI, 1 method (POST)    | `POST /api` body: `{action: "getUser", id: 42}` |
| 1     | Nhiều URI, nhưng chỉ POST | `POST /users/42` body: `{action: "get"}`        |
| 2     | URI + HTTP methods đúng   | `GET /users/42`, `DELETE /users/42`             |
| 3     | Level 2 + HATEOAS links   | Response chứa navigable links                   |

> **Thực tế**: Đa số production API đạt Level 2 và coi đó là đủ tốt.

---

## 2. API Versioning Strategies

### Q7: Có những chiến lược versioning nào? Trade-off? 🟡 🟡 [Mid]

**A:**

#### So sánh các chiến lược

| Strategy                      | Ví dụ                                 | Pros                         | Cons                                         |
| ----------------------------- | ------------------------------------- | ---------------------------- | -------------------------------------------- |
| **URI Path**                  | `/v1/users`                           | Rõ ràng, dễ hiểu, dễ cache   | "Ô nhiễm" URI, phải maintain nhiều route     |
| **Query Param**               | `/users?version=1`                    | Không thay đổi URI structure | Dễ quên, khó enforce, cache phức tạp hơn     |
| **Header** (Custom)           | `X-API-Version: 1`                    | URI sạch, linh hoạt          | Không nhìn thấy version trong URL, debug khó |
| **Content Negotiation**       | `Accept: application/vnd.api.v1+json` | Chuẩn HTTP nhất              | Phức tạp, ít dev quen                        |
| **No versioning** (evolution) | Chỉ thêm field, không xóa             | Đơn giản nhất                | Cần discipline cao, tech debt tiềm ẩn        |

#### Ai dùng gì?

| Company/API   | Strategy                      | Lý do                                                |
| ------------- | ----------------------------- | ---------------------------------------------------- |
| **Stripe**    | API version qua header + date | `Stripe-Version: 2023-10-16` — pin version theo ngày |
| **GitHub**    | Accept header + URI           | `Accept: application/vnd.github.v3+json`             |
| **Google**    | URI path                      | `/v1/projects/...` — rõ ràng cho API đa dạng         |
| **Twitter/X** | URI path                      | `/2/tweets`                                          |
| **Slack**     | No versioning                 | Evolve API, deprecate fields dần                     |

**Khuyến nghị thực tế:**

- **URI path** (`/v1/`) — phù hợp public API, dễ hiểu nhất
- **Header-based** — phù hợp internal API, microservices
- **Date-based** (kiểu Stripe) — phù hợp khi cần kiểm soát chi tiết breaking changes

> **Quy tắc vàng**: Chỉ bump major version khi có **breaking change**. Thêm field mới KHÔNG phải breaking change nếu client bỏ qua field lạ.

---

## 3. Pagination Patterns

### Q8: So sánh các chiến lược pagination? 🟡 🟡 [Mid]

**A:**

#### 3.1 Offset-based Pagination

```
GET /users?offset=20&limit=10
```

```
       Page 1         Page 2         Page 3
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ Row 1-10 │  │ Row 11-20│  │ Row 21-30│
    └──────────┘  └──────────┘  └──────────┘
    offset=0       offset=10      offset=20
```

| Aspect             | Chi tiết                                                       |
| ------------------ | -------------------------------------------------------------- |
| Ưu điểm            | Đơn giản, dễ hiểu, nhảy đến page bất kỳ                        |
| Nhược điểm lớn     | `OFFSET 1000000` → DB phải scan 1M rows rồi bỏ → **cực chậm**  |
| Vấn đề consistency | Nếu có insert/delete giữa 2 request → duplicate hoặc miss rows |
| Khi nào dùng       | Dataset nhỏ (<100K rows), cần "jump to page X"                 |

#### 3.2 Cursor-based Pagination

```
GET /users?cursor=eyJpZCI6NDJ9&limit=10
```

```
    Request 1: "Give me 10 items"
    Response: items + next_cursor = "abc123"

    Request 2: "Give me 10 items after cursor abc123"
    Response: items + next_cursor = "def456"
    ...
```

| Aspect         | Chi tiết                                                                |
| -------------- | ----------------------------------------------------------------------- |
| Ưu điểm        | Performance ổn định O(limit), không bị duplicate/miss khi data thay đổi |
| Nhược điểm     | Không nhảy đến page bất kỳ, không biết tổng số page                     |
| Cursor chứa gì | Thường là encoded giá trị của sort column (base64 encoded ID/timestamp) |
| Khi nào dùng   | Dataset lớn, feed/timeline, real-time data                              |

#### 3.3 Keyset Pagination (Seek Method)

Bản chất giống cursor nhưng dùng trực tiếp giá trị thay vì opaque cursor:

```
GET /users?created_after=2024-01-15T10:30:00Z&limit=10
-- SQL: WHERE created_at > '2024-01-15T10:30:00Z' ORDER BY created_at LIMIT 10
```

| Aspect     | Chi tiết                                                          |
| ---------- | ----------------------------------------------------------------- |
| Ưu điểm    | Hiệu quả nhất về DB performance (dùng index seek)                 |
| Nhược điểm | Yêu cầu column có giá trị unique + indexed, khó sort multi-column |

#### Decision Matrix

| Tiêu chí                     | Offset | Cursor | Keyset |
| ---------------------------- | ------ | ------ | ------ |
| Dataset < 100K               | ✅     | ✅     | ✅     |
| Dataset > 1M                 | ❌     | ✅     | ✅     |
| Jump to page N               | ✅     | ❌     | ❌     |
| Real-time feed               | ❌     | ✅     | ✅     |
| Đơn giản implement           | ✅     | 🟡     | 🟡     |
| Consistent khi data thay đổi | ❌     | ✅     | ✅     |

---

## 4. Idempotency

### Q9: Idempotency là gì và tại sao quan trọng? 🟡 🟡 [Mid]

**A:**

**Idempotency** (tính lũy đẳng): Một operation gọi **N lần** cho **cùng kết quả** như gọi **1 lần**.

**Tại sao quan trọng:**

- Network không tin cậy → timeout, retry xảy ra thường xuyên
- Nếu `POST /payments` không idempotent → retry có thể charge khách hàng 2 lần
- Distributed systems luôn cần xử lý duplicate requests

#### Bảng idempotency theo HTTP method

| Method | Idempotent? | Giải thích                                                 |
| ------ | ----------- | ---------------------------------------------------------- |
| GET    | ✅          | Đọc data, không thay đổi state                             |
| PUT    | ✅          | Set resource = giá trị cụ thể, gọi lại vẫn same state      |
| DELETE | ✅          | Xóa resource, gọi lại → đã xóa rồi (404 nhưng state giống) |
| POST   | ❌          | Tạo mới → gọi 2 lần có thể tạo 2 records                   |
| PATCH  | ❌          | Có thể increment → gọi 2 lần tăng 2                        |

---

### Q10: Idempotency Key pattern hoạt động thế nào? 🔴 🔴 [Senior]

**A:**

Để biến POST (non-idempotent) thành idempotent, client gửi **Idempotency-Key** header:

```
POST /payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

**Luồng xử lý:**

```
Client                          Server                         Store
  │                               │                              │
  ├── POST + Idempotency-Key ────►│                              │
  │                               ├── Check key in store ───────►│
  │                               │◄── Not found ───────────────┤
  │                               ├── Process request            │
  │                               ├── Save {key, response} ────►│
  │◄── 201 Created ──────────────┤                              │
  │                               │                              │
  │  (Network timeout, client retries)                           │
  │                               │                              │
  ├── POST + SAME Key ──────────►│                              │
  │                               ├── Check key in store ───────►│
  │                               │◄── Found! Return saved resp ┤
  │◄── 201 Created (cached) ─────┤   (không xử lý lại)         │
```

**Store lưu gì:**

- Idempotency key (UUID do client generate)
- Response status code + body
- TTL (thường 24-48h)
- Request fingerprint (để detect nếu client gửi key cũ nhưng body khác → 422 error)

**Lưu trữ ở đâu:**

- Redis (phổ biến nhất — nhanh, có TTL tự động)
- Database table riêng
- In-memory (chỉ cho single instance)

> **Stripe** là ví dụ điển hình: tất cả POST requests đều hỗ trợ `Idempotency-Key` header.

---

### Q11: At-most-once, at-least-once, exactly-once khác nhau thế nào? 🔴 🔴 [Senior]

**A:**

| Semantics         | Ý nghĩa                | Cách đạt được                 | Rủi ro                 |
| ----------------- | ---------------------- | ----------------------------- | ---------------------- |
| **At-most-once**  | Gửi 1 lần, không retry | Fire-and-forget, không ack    | Có thể **mất message** |
| **At-least-once** | Retry đến khi nhận ack | Client retry + server ack     | Có thể **duplicate**   |
| **Exactly-once**  | Xử lý đúng 1 lần       | At-least-once + deduplication | Khó nhất, đắt nhất     |

**Exactly-once trong thực tế:**

Thực ra "exactly-once **processing**" = "at-least-once **delivery**" + "**idempotent processing**"

```
Exactly-once = At-least-once delivery + Idempotent consumer
```

Không có hệ thống nào đảm bảo gửi message đúng 1 lần qua network (Two Generals' Problem). Thay vào đó, ta gửi nhiều lần nhưng **xử lý đúng 1 lần** bằng deduplication.

---

## 5. gRPC Deep Theory

### Q12: Tại sao gRPC tồn tại? HTTP/2 mang lại gì? 🟡 🟡 [Mid]

**A:**

**gRPC** (Google Remote Procedure Call) được Google tạo ra để giải quyết vấn đề giao tiếp giữa hàng ngàn microservices nội bộ.

**HTTP/2 advantages cho RPC:**

| Feature            | HTTP/1.1                            | HTTP/2                                    |
| ------------------ | ----------------------------------- | ----------------------------------------- |
| Multiplexing       | 1 request/connection (HOL blocking) | Nhiều request song song trên 1 connection |
| Header compression | Không                               | HPACK compression — giảm overhead đáng kể |
| Server push        | Không                               | Server chủ động push data                 |
| Binary protocol    | Text-based                          | Binary framing — parse nhanh hơn          |
| Stream             | Không native                        | Bidirectional streaming built-in          |

```
HTTP/1.1: Head-of-line blocking
┌─────────────────────────────────────────┐
│ Req1 ──────► Resp1 │ Req2 ──► Resp2    │  Sequential
└─────────────────────────────────────────┘

HTTP/2: Multiplexing
┌─────────────────────────────────────────┐
│ ──Req1──  ──Req2──  ──Req3──            │
│ ──Resp2── ──Resp1── ──Resp3──           │  Parallel on 1 conn
└─────────────────────────────────────────┘
```

---

### Q13: Protocol Buffers — schema evolution rules? 🔴 🔴 [Senior]

**A:**

**Protocol Buffers (protobuf)** là binary serialization format, nhỏ hơn JSON 3-10x, parse nhanh hơn 20-100x.

**Quy tắc backward/forward compatibility:**

| Rule                                        | Chi tiết                                             |
| ------------------------------------------- | ---------------------------------------------------- |
| **KHÔNG BAO GIỜ** thay đổi field number     | Field number là ID duy nhất, thay đổi = break tất cả |
| **KHÔNG** thay đổi type của field hiện tại  | `int32` → `string` sẽ break                          |
| **CÓ THỂ** thêm field mới                   | Old client bỏ qua field lạ (forward compatible)      |
| **CÓ THỂ** xóa field (nhưng reserve number) | Dùng `reserved` keyword để tránh tái sử dụng number  |
| **CÓ THỂ** rename field                     | Vì wire format dùng number, không dùng name          |

```protobuf
// Version 1
message User {
  int32 id = 1;
  string name = 2;
}

// Version 2 — backward compatible
message User {
  int32 id = 1;
  string name = 2;
  string email = 3;      // New: old clients ignore this
  reserved 4;            // Reserved for deleted field
  reserved "phone";      // Prevent reuse of name
}
```

**Backward compatible**: New server đọc được message từ old client.
**Forward compatible**: Old server đọc được message từ new client (bỏ qua field lạ).

---

### Q14: 4 communication patterns của gRPC? 🟡 🟡 [Mid]

**A:**

```
1. Unary RPC (1 request → 1 response)
   Client ──── Request ────► Server
   Client ◄─── Response ──── Server

2. Server Streaming (1 request → N responses)
   Client ──── Request ────► Server
   Client ◄─── Response 1 ── Server
   Client ◄─── Response 2 ── Server
   Client ◄─── Response N ── Server

3. Client Streaming (N requests → 1 response)
   Client ──── Request 1 ───► Server
   Client ──── Request 2 ───► Server
   Client ──── Request N ───► Server
   Client ◄─── Response ──── Server

4. Bidirectional Streaming (N requests ↔ M responses)
   Client ──── Request 1 ───► Server
   Client ◄─── Response 1 ── Server
   Client ──── Request 2 ───► Server
   Client ◄─── Response 2 ── Server
   (independent streams, không cần request-response xen kẽ)
```

| Pattern          | Use Case                                         |
| ---------------- | ------------------------------------------------ |
| Unary            | CRUD thông thường, hầu hết API calls             |
| Server streaming | Real-time feed, log tailing, stock price updates |
| Client streaming | Upload file chunks, batch data ingestion         |
| Bidirectional    | Chat, collaborative editing, gaming              |

---

### Q15: gRPC vs REST — so sánh chi tiết? 🟡 🟡 [Mid]

**A:**

| Tiêu chí                 | REST                           | gRPC                                |
| ------------------------ | ------------------------------ | ----------------------------------- |
| **Protocol**             | HTTP/1.1 (thường)              | HTTP/2 (bắt buộc)                   |
| **Format**               | JSON (text)                    | Protobuf (binary)                   |
| **Schema**               | Optional (OpenAPI)             | Bắt buộc (.proto file)              |
| **Performance**          | Chậm hơn (text parse, lớn hơn) | 2-10x nhanh hơn                     |
| **Streaming**            | Workaround (SSE, WebSocket)    | Native 4 patterns                   |
| **Browser support**      | ✅ Native                      | ❌ Cần gRPC-Web proxy               |
| **Tooling**              | curl, Postman, mọi HTTP tool   | grpcurl, BloomRPC, hạn chế hơn      |
| **Code generation**      | Optional                       | Built-in (nhiều ngôn ngữ)           |
| **Human readable**       | ✅ JSON dễ đọc                 | ❌ Binary khó debug                 |
| **Caching**              | HTTP caching built-in          | Phải tự implement                   |
| **Load balancing**       | L7 LB đơn giản                 | Cần gRPC-aware LB (L7)              |
| **Deadline propagation** | Không native                   | ✅ Built-in                         |
| **Error model**          | HTTP status codes              | Rich error model (status + details) |

**Decision matrix — khi nào dùng gì:**

| Scenario                             | Chọn                        |
| ------------------------------------ | --------------------------- |
| Public API cho third-party           | REST                        |
| Internal microservice ↔ microservice | gRPC                        |
| Browser/mobile client                | REST (hoặc gRPC-Web)        |
| High performance, low latency        | gRPC                        |
| Streaming real-time data             | gRPC                        |
| Cần human-readable debugging         | REST                        |
| Polyglot microservices               | gRPC (code-gen đa ngôn ngữ) |

---

### Q16: gRPC Interceptors, Deadline propagation, Error model? 🔴 🔴 [Senior]

**A:**

**Interceptors** = middleware trong gRPC. Chạy trước/sau mỗi RPC call.

```
Client                                          Server
  │                                                │
  ├─► Client Interceptor 1 (logging)               │
  │   ├─► Client Interceptor 2 (auth token)        │
  │   │   ├────── Network ──────────────────►       │
  │   │   │                    Server Interceptor 1 (auth check) ─►│
  │   │   │                    Server Interceptor 2 (logging) ────►│
  │   │   │                                    Handler             │
  │   │   │◄─────── Network ────────────────        │
  │   │◄──┤                                        │
  │◄──┤                                            │
```

**Deadline Propagation:**

gRPC cho phép set deadline (thời gian tối đa cho toàn bộ chain). Deadline tự động propagate qua các service:

```
Client (deadline=5s) ──► Service A (còn 4.5s) ──► Service B (còn 3s) ──► Service C (còn 1.5s)
                                                                         Nếu hết deadline → CANCELLED
```

Lợi ích: Tránh cascade failure — nếu hết thời gian, toàn bộ chain dừng thay vì chờ vô nghĩa.

**Error Model:**

| gRPC Status        | HTTP Tương đương | Ý nghĩa                |
| ------------------ | ---------------- | ---------------------- |
| OK                 | 200              | Thành công             |
| INVALID_ARGUMENT   | 400              | Client gửi sai         |
| NOT_FOUND          | 404              | Resource không tồn tại |
| ALREADY_EXISTS     | 409              | Đã tồn tại             |
| PERMISSION_DENIED  | 403              | Không có quyền         |
| UNAUTHENTICATED    | 401              | Chưa xác thực          |
| RESOURCE_EXHAUSTED | 429              | Rate limit             |
| INTERNAL           | 500              | Lỗi server             |
| UNAVAILABLE        | 503              | Service không sẵn sàng |
| DEADLINE_EXCEEDED  | 504              | Hết thời gian          |

gRPC error model phong phú hơn HTTP: có thể đính kèm **error details** (structured metadata) vào response, không chỉ là status code.

---

## 6. GraphQL Theory

### Q17: GraphQL giải quyết vấn đề gì? 🟡 🟡 [Mid]

**A:**

**Over-fetching và Under-fetching** trong REST:

```
REST — Over-fetching:
GET /users/42
→ Trả về 30 fields, client chỉ cần name + avatar
→ Bandwidth lãng phí, đặc biệt trên mobile

REST — Under-fetching:
GET /users/42          → Lấy user info
GET /users/42/posts    → Lấy posts
GET /posts/1/comments  → Lấy comments
→ 3 round-trips cho 1 màn hình

GraphQL — Giải quyết cả hai:
query {
  user(id: 42) {
    name
    avatar
    posts(first: 5) {
      title
      comments(first: 3) { text }
    }
  }
}
→ 1 request, chỉ lấy đúng data cần
```

**Các khái niệm cốt lõi:**

- **Schema-first**: Server define schema (types + relationships), client query theo schema
- **Strong typing**: Mỗi field có type rõ ràng, validation tự động
- **Introspection**: Client có thể query schema để biết API hỗ trợ gì

---

### Q18: Query, Mutation, Subscription trong GraphQL? 🟡 🟡 [Mid]

**A:**

| Operation        | Mục đích               | Tương đương REST      |
| ---------------- | ---------------------- | --------------------- |
| **Query**        | Đọc data               | GET                   |
| **Mutation**     | Thay đổi data          | POST/PUT/PATCH/DELETE |
| **Subscription** | Nhận real-time updates | WebSocket/SSE         |

**Type System:**

```graphql
type User {
  id: ID! # ! = non-nullable
  name: String!
  email: String
  posts: [Post!]! # non-null array of non-null Posts
}

type Query {
  user(id: ID!): User
  users(first: Int, after: String): UserConnection
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}

type Subscription {
  messageAdded(channelId: ID!): Message!
}
```

---

### Q19: N+1 Problem trong GraphQL và DataLoader? 🔴 🔴 [Senior]

**A:**

**Vấn đề N+1:**

```
query {
  users {          # 1 query: SELECT * FROM users (returns 100 users)
    posts {        # 100 queries: SELECT * FROM posts WHERE user_id = ?
      title        # Tổng: 1 + 100 = 101 queries!
    }
  }
}
```

**DataLoader pattern giải quyết bằng batching + caching:**

```
Không có DataLoader:
  User 1 → SELECT * FROM posts WHERE user_id = 1
  User 2 → SELECT * FROM posts WHERE user_id = 2
  ...
  User 100 → SELECT * FROM posts WHERE user_id = 100
  → 100 queries

Có DataLoader (batching):
  Collect: [1, 2, 3, ..., 100]
  → SELECT * FROM posts WHERE user_id IN (1, 2, ..., 100)
  → 1 query!
```

**Cách DataLoader hoạt động:**

1. Trong 1 tick của event loop, DataLoader **thu thập** tất cả `.load(id)` calls
2. Cuối tick, gọi **batch function** 1 lần với tất cả IDs
3. Cache kết quả cho các request trùng ID trong cùng request

> **Lưu ý**: DataLoader cache chỉ tồn tại trong scope 1 request, không phải global cache.

---

### Q20: GraphQL vs REST vs gRPC — khi nào dùng gì? 🔴 🔴 [Senior]

**A:**

| Tiêu chí                   | REST                      | gRPC                          | GraphQL                           |
| -------------------------- | ------------------------- | ----------------------------- | --------------------------------- |
| **Tốt nhất cho**           | Public API, CRUD đơn giản | Service-to-service, high perf | Complex queries, multiple clients |
| **Flexibility cho client** | Thấp (fixed response)     | Thấp (fixed schema)           | Cao (client chọn fields)          |
| **Performance**            | Trung bình                | Cao nhất                      | Trung bình (thêm layer parse)     |
| **Caching**                | HTTP cache native         | Tự implement                  | Phức tạp (POST-based)             |
| **Learning curve**         | Thấp                      | Trung bình                    | Cao                               |
| **Tooling**                | Rất tốt                   | Tốt                           | Tốt                               |
| **Real-time**              | SSE/WebSocket             | Streaming native              | Subscription                      |
| **File upload**            | Đơn giản                  | Streaming                     | Phức tạp                          |
| **Error handling**         | HTTP status               | Rich status                   | errors array trong response       |

**Khi KHÔNG dùng GraphQL:**

- API đơn giản, ít relationships
- Cần HTTP caching mạnh
- File upload/download là chính
- Team nhỏ, không cần flexibility
- Server-to-server communication (gRPC tốt hơn)
- Khi bạn không muốn client có quá nhiều quyền kiểm soát query (security concern)

---

## 7. API Gateway Pattern

### Q21: API Gateway là gì? Tại sao cần? 🟡 🟡 [Mid]

**A:**

**API Gateway** là single entry point cho tất cả client requests vào hệ thống microservices.

```
Không có Gateway:                    Có Gateway:
┌────────┐                           ┌────────┐
│ Client ├──► Service A              │ Client ├──► ┌─────────────┐ ──► Service A
│        ├──► Service B              │        │    │ API Gateway │ ──► Service B
│        ├──► Service C              │        │    │             │ ──► Service C
│        ├──► Service D              └────────┘    └─────────────┘ ──► Service D
└────────┘                                         Một entry point
Client phải biết mọi service                       Client chỉ biết gateway
```

**Responsibilities:**

| Chức năng                  | Mô tả                                               |
| -------------------------- | --------------------------------------------------- |
| **Routing**                | Route request đến đúng service dựa trên path/header |
| **Authentication**         | Verify JWT/API key một lần tại gateway              |
| **Rate Limiting**          | Giới hạn requests per client                        |
| **Load Balancing**         | Phân tải giữa service instances                     |
| **Circuit Breaking**       | Ngắt mạch khi service downstream fail               |
| **Request Transformation** | Aggregate, transform request/response               |
| **SSL Termination**        | Handle HTTPS tại gateway, internal dùng HTTP        |
| **Logging/Monitoring**     | Central point for observability                     |
| **CORS handling**          | Xử lý CORS một chỗ                                  |
| **Response caching**       | Cache response phổ biến                             |

---

### Q22: API Gateway vs Service Mesh? 🔴 🔴 [Senior]

**A:**

| Aspect         | API Gateway                   | Service Mesh                   |
| -------------- | ----------------------------- | ------------------------------ |
| **Vị trí**     | Edge (ranh giới hệ thống)     | Bên trong (giữa services)      |
| **Traffic**    | North-South (client → system) | East-West (service ↔ service)  |
| **Deployment** | Centralized (1-2 instances)   | Sidecar per service            |
| **Focus**      | External API management       | Internal service communication |
| **Ví dụ**      | Kong, AWS API GW, Nginx       | Istio, Linkerd, Consul Connect |

```
                    North-South Traffic
                         │
                    ┌─────▼─────┐
                    │ API Gateway│  ← Rate limit, auth, routing
                    └─────┬─────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
    ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
    │  Service A │  │  Service B │  │  Service C │
    │  [sidecar] │  │  [sidecar] │  │  [sidecar] │  ← Service Mesh
    └─────┬─────┘  └─────┬─────┘  └─────┬─────┘     (mTLS, retry,
          │               │               │            circuit break)
          └───── East-West Traffic ───────┘
```

> Chúng **bổ sung** cho nhau, không thay thế.

---

### Q23: BFF Pattern (Backend for Frontend) là gì? 🟡 🟡 [Mid]

**A:**

**Vấn đề**: Mobile app cần ít data, web cần nhiều data, TV app cần data khác. Một API Gateway duy nhất phải phục vụ tất cả → phình to, phức tạp.

**Giải pháp**: Mỗi loại client có một backend riêng (BFF).

```
┌──────────┐     ┌──────────────┐
│ Web App  ├────►│ Web BFF      ├──┐
└──────────┘     └──────────────┘  │
                                   ├──► Service A
┌──────────┐     ┌──────────────┐  ├──► Service B
│ Mobile   ├────►│ Mobile BFF   ├──┤   Service C
└──────────┘     └──────────────┘  │
                                   │
┌──────────┐     ┌──────────────┐  │
│ TV App   ├────►│ TV BFF       ├──┘
└──────────┘     └──────────────┘
```

**Lợi ích:**

- Mỗi BFF tối ưu cho client riêng (payload size, format)
- Team frontend có thể own BFF của mình
- Thay đổi cho mobile không ảnh hưởng web

**Nhược điểm:**

- Duplicate logic giữa các BFF
- Nhiều service hơn cần maintain
- Cần cân nhắc kỹ: nếu chỉ có 1-2 loại client, chưa chắc cần BFF

---

## 8. Rate Limiting Theory

### Q24: 5 thuật toán Rate Limiting — giải thích sâu? 🔴 🔴 [Senior]

**A:**

#### 8.1 Fixed Window Counter

```
Window 1 (0:00-0:59)    Window 2 (1:00-1:59)
┌────────────────────┐   ┌────────────────────┐
│ Count: 98/100      │   │ Count: 0/100       │
│ ✅ Allow            │   │ ✅ Allow            │
└────────────────────┘   └────────────────────┘
                ▲
                │ Problem: 99 requests at 0:59
                │        + 99 requests at 1:00
                │        = 198 requests in 1 second!
```

| Aspect         | Chi tiết                                              |
| -------------- | ----------------------------------------------------- |
| Cách hoạt động | Đếm requests trong window cố định (VD: mỗi phút)      |
| Ưu điểm        | Đơn giản, memory ít (1 counter per window)            |
| Nhược điểm lớn | **Burst tại biên window** — có thể vượt gấp đôi limit |
| Storage        | 1 counter + 1 timestamp                               |

#### 8.2 Sliding Window Log

```
Lưu timestamp mỗi request: [0:00:45, 0:00:50, 0:00:55, 0:01:02, 0:01:10]
                                                         ▲
Window: [now - 60s, now]                                 │
Khi request mới đến (0:01:15):                          now
  1. Xóa entries cũ hơn 60s trước
  2. Đếm entries còn lại
  3. Nếu < limit → allow + add timestamp
```

| Aspect         | Chi tiết                                                |
| -------------- | ------------------------------------------------------- |
| Cách hoạt động | Lưu log timestamp mỗi request, sliding window chính xác |
| Ưu điểm        | Chính xác tuyệt đối, không bị burst                     |
| Nhược điểm     | **Memory cao** — lưu mọi timestamp trong window         |
| Storage        | Sorted set of timestamps per user                       |

#### 8.3 Sliding Window Counter

**Kết hợp Fixed Window + Sliding**: Ước lượng count dựa trên tỷ lệ thời gian trong window trước.

```
Previous window: 84 requests     Current window: 36 requests
┌─────────────────────────┐     ┌─────────────────────────┐
│                         │     │ ████                    │
└─────────────────────────┘     └─────────────────────────┘
                              now ^
                              25% vào current window
                              75% overlap với previous window

Estimated count = 84 × 0.75 + 36 = 99
Limit = 100 → Allow (99 < 100)
```

| Aspect         | Chi tiết                                                |
| -------------- | ------------------------------------------------------- |
| Cách hoạt động | Weighted count giữa 2 windows liền kề                   |
| Ưu điểm        | Memory thấp (2 counters), gần chính xác, không bị burst |
| Nhược điểm     | Chỉ là ước lượng, không 100% chính xác                  |
| Storage        | 2 counters per window                                   |

> **Cloudflare** dùng Sliding Window Counter — balance tốt giữa accuracy và memory.

#### 8.4 Token Bucket

```
Bucket capacity: 10 tokens
Refill rate: 2 tokens/second

    ┌─── Refill: 2 tokens/sec ───┐
    ▼                             │
┌─────────┐                      │
│ ●●●●●●  │ Bucket (6/10)       Timer
│          │
└────┬─────┘
     │ Take 1 token per request
     ▼
  Request → Token available? ── Yes → Allow
                               No  → Reject (429)
```

| Aspect         | Chi tiết                                                             |
| -------------- | -------------------------------------------------------------------- |
| Cách hoạt động | Bucket chứa tokens, mỗi request lấy 1 token, tokens refill theo rate |
| Ưu điểm        | Cho phép burst (dùng hết tokens tích lũy), smooth rate               |
| Nhược điểm     | 2 parameters cần tune (bucket size, refill rate)                     |
| Storage        | 1 counter + 1 timestamp (last refill)                                |

> **AWS API Gateway**, **Stripe** dùng Token Bucket.

#### 8.5 Leaky Bucket

```
    Requests đổ vào bucket
         │ │ │
         ▼ ▼ ▼
    ┌───────────┐
    │           │ Bucket (queue)
    │  ●●●●●   │ Fixed capacity
    │           │
    └─────┬─────┘
          │ Xử lý ở tốc độ cố định
          ▼
    Process 1 request/sec (constant rate)

    Bucket đầy → Reject new requests
```

| Aspect         | Chi tiết                                                          |
| -------------- | ----------------------------------------------------------------- |
| Cách hoạt động | Requests vào queue, xử lý ở tốc độ cố định                        |
| Ưu điểm        | Output rate cực kỳ đều đặn, tốt cho API cần stable throughput     |
| Nhược điểm     | Burst bị queue (latency tăng), không tận dụng được capacity trống |
| Storage        | Queue + drain rate                                                |

#### So sánh tổng hợp

| Algorithm       | Memory   | Accuracy   | Burst Allowed | Complexity |
| --------------- | -------- | ---------- | ------------- | ---------- |
| Fixed Window    | ⭐       | ⭐⭐       | ❌ (boundary) | ⭐         |
| Sliding Log     | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌            | ⭐⭐       |
| Sliding Counter | ⭐⭐     | ⭐⭐⭐⭐   | ❌            | ⭐⭐       |
| Token Bucket    | ⭐       | ⭐⭐⭐⭐   | ✅            | ⭐⭐       |
| Leaky Bucket    | ⭐⭐     | ⭐⭐⭐⭐   | ❌ (queued)   | ⭐⭐       |

---

### Q25: Distributed rate limiting challenges? 🔴 🔴 [Senior]

**A:**

**Vấn đề**: Khi có nhiều API Gateway instances, mỗi instance đếm riêng → tổng requests vượt limit.

```
Client ──► Gateway 1 (count: 80/100) ──┐
Client ──► Gateway 2 (count: 80/100) ──┤  Thực tế: 160 requests
Client ──► Gateway 3 (count: 80/100) ──┘  nhưng mỗi instance thấy < 100
```

**Giải pháp:**

| Approach                  | Mô tả                                                | Trade-off                                      |
| ------------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| **Central store (Redis)** | Tất cả instances đọc/ghi counter trên Redis          | Thêm latency mỗi request (~1ms), Redis là SPOF |
| **Sticky session**        | Route cùng client đến cùng instance                  | Mất load balancing đều                         |
| **Sync giữa instances**   | Gossip protocol đồng bộ count                        | Eventually consistent, có thể vượt limit tạm   |
| **Local + global**        | Rate limit local (rough) + global trên Redis (exact) | Phức tạp nhưng giảm Redis load                 |

**Rate Limit Response Headers:**

```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100          ← Tổng requests được phép
X-RateLimit-Remaining: 0        ← Còn lại bao nhiêu
X-RateLimit-Reset: 1672531200   ← Unix timestamp khi reset
Retry-After: 30                 ← Seconds đợi trước khi retry
```

---

## 9. API Security

### Q26: Authentication vs Authorization — phân biệt? 🟢 🟢 [Junior]

**A:**

| Aspect                   | Authentication (AuthN)       | Authorization (AuthZ)   |
| ------------------------ | ---------------------------- | ----------------------- |
| **Câu hỏi**              | "Bạn là **ai**?"             | "Bạn được **làm gì**?"  |
| **Xảy ra khi**           | Đầu tiên                     | Sau authentication      |
| **Ví dụ**                | Login bằng username/password | Check quyền admin/user  |
| **HTTP status khi fail** | 401 Unauthorized             | 403 Forbidden           |
| **Mechanisms**           | Password, JWT, OAuth, mTLS   | RBAC, ABAC, ACL, Policy |

```
Request ──► Authentication ──► Authorization ──► Handler
            "Who are you?"     "Can you do this?"
            (verify identity)  (check permissions)
```

---

### Q27: API Key vs OAuth 2.0 vs JWT vs mTLS? 🟡 🟡 [Mid]

**A:**

| Method        | Cách hoạt động                                                                   | Khi nào dùng                           | Bảo mật                                  |
| ------------- | -------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------- |
| **API Key**   | Static key gửi qua header/query                                                  | Server-to-server đơn giản, public APIs | Thấp — key lộ = toàn quyền               |
| **OAuth 2.0** | Authorization framework, nhiều flows (Authorization Code, Client Credentials...) | Third-party access, social login       | Cao — scoped, revocable tokens           |
| **JWT**       | Self-contained token chứa claims, signed                                         | Stateless auth, microservices          | Trung bình — không revoke được trực tiếp |
| **mTLS**      | Cả client và server verify certificate lẫn nhau                                  | Service-to-service trong zero-trust    | Rất cao — identity ở transport layer     |

**JWT deep points thường hỏi phỏng vấn:**

```
Header.Payload.Signature
  │       │        │
  │       │        └─ HMAC-SHA256(header + "." + payload, secret)
  │       └─ {"sub":"42","name":"Alice","exp":1700000000}
  └─ {"alg":"HS256","typ":"JWT"}
```

- **Không thể revoke** JWT trước expiry → giải pháp: short-lived token + refresh token, hoặc blacklist
- **Không nên lưu sensitive data** trong payload — ai cũng decode được (chỉ signed, không encrypted)
- Access token: 15-30 min. Refresh token: 7-30 days.

**OAuth 2.0 Flows:**

| Flow                        | Dùng cho                     | Có user interaction? |
| --------------------------- | ---------------------------- | -------------------- |
| Authorization Code          | Web app (có backend)         | ✅                   |
| Authorization Code + PKCE   | SPA, Mobile                  | ✅                   |
| Client Credentials          | Machine-to-machine           | ❌                   |
| ~~Implicit~~                | ~~SPA (deprecated)~~         | ~~✅~~               |
| ~~Resource Owner Password~~ | ~~Trusted app (deprecated)~~ | ~~✅~~               |

---

### Q28: CORS giải thích sâu? 🟡 🟡 [Mid]

**A:**

**CORS** (Cross-Origin Resource Sharing) — cơ chế cho phép browser gửi request đến domain khác origin.

**Same-Origin Policy**: Browser chặn request từ `app.com` đến `api.com` vì khác origin (`scheme + host + port`).

**Preflight request** (OPTIONS):

```
Browser                              Server (api.com)
  │                                     │
  │ OPTIONS /users                      │
  │ Origin: https://app.com             │
  │ Access-Control-Request-Method: POST │
  │ Access-Control-Request-Headers:     │
  │   Content-Type, Authorization       │
  ├────────────────────────────────────►│
  │                                     │
  │ 204 No Content                      │
  │ Access-Control-Allow-Origin: *      │
  │ Access-Control-Allow-Methods:       │
  │   GET, POST, PUT, DELETE            │
  │ Access-Control-Allow-Headers:       │
  │   Content-Type, Authorization       │
  │ Access-Control-Max-Age: 86400       │
  │◄────────────────────────────────────┤
  │                                     │
  │ POST /users (actual request)        │
  ├────────────────────────────────────►│
  │◄──── 201 Created ─────────────────┤
```

**Simple requests** (không cần preflight):

- Method: GET, HEAD, POST
- Headers: chỉ Accept, Accept-Language, Content-Language, Content-Type (chỉ 3 giá trị: `text/plain`, `multipart/form-data`, `application/x-www-form-urlencoded`)

**Mọi request khác** → preflight trước.

> **Lưu ý bảo mật**: `Access-Control-Allow-Origin: *` KHÔNG gửi cookies. Nếu cần credentials, phải specify domain cụ thể + `Access-Control-Allow-Credentials: true`.

---

### Q29: API abuse prevention strategies? 🔴 🔴 [Senior]

**A:**

| Strategy                         | Mô tả                                             |
| -------------------------------- | ------------------------------------------------- |
| **Rate limiting**                | Giới hạn requests/time per client (xem mục 8)     |
| **Input validation**             | Validate tất cả input, reject early               |
| **Request size limit**           | Giới hạn body size (VD: 1MB)                      |
| **Timeout**                      | Set timeout cho mọi request (VD: 30s)             |
| **IP allowlisting/blocklisting** | Chặn IP spam, cho phép IP tin cậy                 |
| **Bot detection**                | CAPTCHA, fingerprinting, behavior analysis        |
| **Payload inspection**           | Chặn SQL injection, XSS trong input               |
| **API key rotation**             | Rotate keys định kỳ, revoke keys bị lộ            |
| **Quota management**             | Giới hạn tổng requests/ngày/tháng per client      |
| **Request signing**              | HMAC signature cho mỗi request (timestamp + body) |
| **Throttling by tier**           | Free tier: 100 req/min, Pro: 10K req/min          |

---

## 10. API Documentation & Contract

### Q30: API-first design là gì? Tại sao quan trọng? 🟡 🟡 [Mid]

**A:**

**API-first** = Thiết kế API contract **TRƯỚC** khi code. API spec là "source of truth."

```
Traditional:                    API-first:
Code first ──► Generate docs    Design spec ──► Review ──► Code
  (docs lệch code)               (spec IS the contract)
```

**Lợi ích:**

- Frontend và Backend develop **song song** (dựa trên spec đã thống nhất)
- Detect design issues sớm (review spec rẻ hơn review code)
- Auto-generate client SDKs, server stubs, mock servers
- Spec là documentation luôn up-to-date

**OpenAPI (Swagger) Spec — key components:**

| Component    | Mô tả                              |
| ------------ | ---------------------------------- |
| `paths`      | Danh sách endpoints + methods      |
| `schemas`    | Data models (request/response)     |
| `parameters` | Path, query, header params         |
| `responses`  | Status codes + response schema     |
| `security`   | Auth schemes (API key, OAuth, JWT) |
| `servers`    | Base URLs cho các environments     |

---

### Q31: Contract testing là gì? 🔴 🔴 [Senior]

**A:**

**Contract testing** — verify rằng API provider và consumer tuân thủ đúng contract đã thỏa thuận, **mà không cần integration test**.

```
Consumer                          Provider
  │                                  │
  ├── Định nghĩa expectations ──►   │
  │   (Pact file / contract)        │
  │                                  │
  │   Consumer test:                 Provider test:
  │   "Khi tôi gửi GET /users/1     "Contract nói khi nhận
  │    tôi expect {id, name, email}" GET /users/1, tôi phải trả
  │                                   {id, name, email}"
  │                                  │
  └── Cả 2 test pass ──► Contract satisfied ✅
```

**Tại sao không dùng integration test thay?**

- Integration test chậm, flaky, cần cả 2 services running
- Contract test chạy **độc lập**, nhanh, reliable
- Mỗi team test riêng, chỉ cần share contract file

**Tools**: Pact (phổ biến nhất), Spring Cloud Contract.

---

### Q32: Backward compatibility rules? 🟡 🟡 [Mid]

**A:**

**Breaking changes** (KHÔNG được làm với API đã publish):

| Action                          | Tại sao break                 |
| ------------------------------- | ----------------------------- |
| Xóa field khỏi response         | Client đang expect field đó   |
| Đổi type của field              | Client parse sai              |
| Đổi URL path                    | Client hardcode URL cũ        |
| Thêm required field vào request | Client cũ không gửi field mới |
| Thay đổi error format           | Client handle error sai       |
| Thay đổi auth mechanism         | Client cũ không auth được     |

**Non-breaking changes** (an toàn):

| Action                          | Tại sao safe                     |
| ------------------------------- | -------------------------------- |
| Thêm field mới vào response     | Client bỏ qua field lạ           |
| Thêm optional field vào request | Client cũ không gửi = OK         |
| Thêm endpoint mới               | Không ảnh hưởng endpoint cũ      |
| Thêm enum value mới             | Nếu client handle "unknown" đúng |

**Robustness Principle (Postel's Law):**

> "Be conservative in what you send, be liberal in what you accept."

Client nên **bỏ qua** fields không nhận diện được (forward compatible).
Server nên **chấp nhận** input thiếu optional fields.

---

## Interview Tips & Common Questions by Company

### Câu hỏi phổ biến theo level 🟡 [Mid]

#### 🟢 Junior

1. GET vs POST vs PUT vs PATCH — khác nhau gì?
2. HTTP status codes 200, 201, 400, 401, 403, 404, 500 — khi nào dùng?
3. REST API naming conventions?
4. JWT là gì? Structure?
5. Pagination hoạt động thế nào?

#### 🟡 Middle

6. Thiết kế REST API cho hệ thống e-commerce (resources, endpoints, status codes).
7. gRPC vs REST — khi nào chọn gì?
8. Giải thích idempotency. Tại sao POST không idempotent?
9. Rate limiting algorithms — explain Token Bucket.
10. API versioning — bạn chọn strategy nào, tại sao?
11. CORS hoạt động thế nào? Preflight request là gì?
12. N+1 problem trong GraphQL?

#### 🔴 Senior

13. Thiết kế hệ thống rate limiting distributed cho 1M+ users.
14. gRPC deadline propagation hoạt động thế nào? Tại sao quan trọng?
15. Exactly-once semantics — có đạt được thật không? Giải thích.
16. API Gateway vs Service Mesh — khi nào dùng gì?
17. Protobuf schema evolution — rules cho backward/forward compatibility?
18. Thiết kế BFF pattern cho hệ thống có web, mobile, IoT clients.
19. Contract testing vs integration testing — trade-offs?
20. Idempotency key pattern — implement cho payment system thế nào?

### Theo công ty

| Company type                          | Focus areas                                                 |
| ------------------------------------- | ----------------------------------------------------------- |
| **Fintech** (VNPay, Momo, ZaloPay)    | Idempotency, exactly-once, payment API design, security     |
| **E-commerce** (Shopee, Tiki, Lazada) | Pagination cho catalog, rate limiting, caching, API Gateway |
| **Social/Chat** (Zalo, Facebook)      | gRPC streaming, real-time, GraphQL for social graph         |
| **Cloud/Infra** (VNG Cloud, FPT)      | API Gateway, Service Mesh, gRPC internal, mTLS              |
| **Startup**                           | REST design, JWT auth, basic rate limiting, CORS            |
| **Big Tech (Google, Grab)**           | Tất cả ở trên + system design kết hợp                       |

### Mẹo trả lời

1. **Luôn nói trade-off**: Không có giải pháp hoàn hảo. "Tôi chọn A vì... nhưng nhược điểm là..."
2. **Dùng ví dụ thực tế**: "Stripe dùng idempotency key pattern", "GitHub API dùng HATEOAS"
3. **Vẽ diagram**: Rate limiting algorithms, request flow, architecture — vẽ ra giúp giải thích rõ hơn
4. **Đừng chỉ biết lý thuyết**: Khi nói về Token Bucket, sẵn sàng nói "Tôi đã implement dùng Redis với MULTI/EXEC"
5. **Phân biệt rõ concept**: 401 vs 403, PUT vs PATCH, authentication vs authorization — những chi tiết nhỏ thể hiện hiểu biết sâu

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is the difference between REST, GraphQL, and gRPC? / REST vs GraphQL vs gRPC khác nhau thế nào? 🟡 Mid

**A:** Three API paradigms with different strengths:

- **REST**: HTTP verbs + resources. Stateless, cacheable, wide tooling. Under/over-fetching common.
- **GraphQL**: client specifies exact data needed. Eliminates over/under-fetching. Single endpoint. More complex caching.
- **gRPC**: binary protocol (Protocol Buffers), HTTP/2. Extremely fast, bidirectional streaming. Best for internal service-to-service.

```
Choose REST when:     Choose GraphQL when:   Choose gRPC when:
Public API            Multiple clients with  Internal microservices
Simple CRUD           different data needs   Real-time streaming
Wide compatibility    Complex, nested data   Performance critical
Team knows REST       Rapid frontend iter.   Type-safe contracts
```

Vietnamese explanation: REST = flexible, widely understood. GraphQL = solves client data needs but server complexity increase (N+1 queries, complex caching). gRPC = performance king cho internal services (protobuf ~5x smaller than JSON, HTTP/2 multiplexing). Practical: nhiều companies dùng REST for public API + gRPC for internal + GraphQL for BFF (Backend for Frontend).

---

### Q: What is idempotency and why is it important in API design? / Idempotency là gì và tại sao quan trọng? 🟡 Mid

**A:** An operation is **idempotent** if performing it multiple times has the same effect as performing it once. Critical for API reliability — clients need to safely retry on network failures.

```
HTTP methods and idempotency:
GET     → idempotent (read only)
PUT     → idempotent (full replace — same result each time)
DELETE  → idempotent (delete already-deleted = no error)
POST    → NOT idempotent (creates new resource each call)
PATCH   → NOT idempotent by default (depends on implementation)

Idempotency key pattern (for POST):
Client sends: POST /payments + Idempotency-Key: uuid-123
Server: if uuid-123 seen before → return cached response
        if new → process, store result for uuid-123

Use case: payment processing (retry on timeout — must not charge twice!)
```

Vietnamese explanation: Network is unreliable — clients must retry. GET/PUT/DELETE idempotent by design. POST not idempotent → use idempotency keys (Stripe, Square, Braintree all support this). Implementation: store idempotency key → result in Redis with TTL. Race condition: use DB unique constraint on idempotency key, let second write fail gracefully.

---

### Q: What is rate limiting and how do you implement it? / Rate limiting là gì và cách implement? 🔴 Senior

**A:** Rate limiting restricts how many requests a client can make in a time window. Protects against abuse, DoS, ensures fair resource usage.

```
Algorithms:
1. Fixed Window: count requests in current window (e.g., 100/min)
   Simple but boundary burst problem (200 reqs at window edge)

2. Sliding Window: track per-second within rolling window
   More accurate, more memory

3. Token Bucket: bucket refills at rate R, max capacity C
   Allows bursts up to C, sustained rate R
   (Stripe, AWS use token bucket)

4. Leaky Bucket: queue requests, process at fixed rate
   Smooths traffic, no bursts

Implementation with Redis:
MULTI
  INCR rate_limit:user123:window
  EXPIRE rate_limit:user123:window 60
EXEC
if count > limit → 429 Too Many Requests + Retry-After header
```

Vietnamese explanation: Distributed rate limiting: Redis is the standard (Lua script for atomicity). Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`. Rate limit by: IP (unauthenticated), user ID (authenticated), API key (third-party). Tiered limits: free tier (100/min), paid tier (1000/min). Implement rate limiting at API Gateway level để không duplicate logic in every service.

---

## Interview Q&A Summary / Tổng Kết Câu Hỏi Phỏng Vấn

| #   | Question                                      | Difficulty | Core Concept  | Key Signal                                               |
| --- | --------------------------------------------- | ---------- | ------------- | -------------------------------------------------------- |
| Q1  | 6 constraints của REST theo Roy Fielding      | 🟡         | REST          | Nhớ đủ 6 + giải thích Uniform Interface 4 sub-principles |
| Q2  | Resource naming conventions                   | 🟢         | REST          | Plural nouns, nesting ≤3 levels, kebab-case              |
| Q3  | HTTP methods — semantics, idempotency, safety | 🟢         | REST          | GET safe+idempotent, PUT idempotent, POST neither        |
| Q4  | HTTP Status Codes                             | 🟢         | REST          | 2xx/3xx/4xx/5xx families + specific codes meaning        |
| Q5  | HATEOAS là gì? Tại sao ít API dùng?           | 🟡         | REST          | Discoverability via links, complexity trade-off          |
| Q6  | Richardson Maturity Model                     | 🟡         | REST          | Level 0-3, most APIs at Level 2                          |
| Q7  | API Versioning strategies & trade-offs        | 🟡         | REST          | URL vs Header vs Content Negotiation comparison          |
| Q8  | Pagination patterns comparison                | 🟡         | REST          | Offset vs Cursor vs Keyset trade-offs                    |
| Q9  | Idempotency là gì, tại sao quan trọng         | 🟡         | Idempotency   | f(f(x))=f(x), safe retry, network failures               |
| Q10 | Idempotency Key pattern                       | 🔴         | Idempotency   | Client UUID → server check Redis/DB → dedup              |
| Q11 | At-most-once vs at-least-once vs exactly-once | 🔴         | Idempotency   | Exactly-once impossible → at-least-once + idempotent     |
| Q12 | gRPC: tại sao tồn tại, HTTP/2 benefits        | 🟡         | gRPC          | Binary protobuf, multiplexing, header compression        |
| Q13 | Protocol Buffers schema evolution             | 🔴         | gRPC          | Field numbers immutable, required → optional migration   |
| Q14 | gRPC 4 communication patterns                 | 🟡         | gRPC          | Unary, server-stream, client-stream, bidirectional       |
| Q15 | gRPC vs REST chi tiết                         | 🟡         | gRPC          | Internal vs public, binary vs text, streaming vs req-res |
| Q16 | gRPC interceptors, deadline, error model      | 🔴         | gRPC          | Deadline propagation prevents cascade, rich error model  |
| Q17 | GraphQL giải quyết vấn đề gì                  | 🟡         | GraphQL       | Over/under-fetching, client-driven queries               |
| Q18 | Query, Mutation, Subscription                 | 🟡         | GraphQL       | Read, write, real-time push via WebSocket                |
| Q19 | N+1 Problem và DataLoader                     | 🔴         | GraphQL       | Batch resolvers, deferred execution, caching             |
| Q20 | GraphQL vs REST vs gRPC comparison            | 🔴         | GraphQL       | Decision matrix by use case                              |
| Q21 | API Gateway là gì, tại sao cần                | 🟡         | Gateway       | Single entry, cross-cutting concerns centralized         |
| Q22 | API Gateway vs Service Mesh                   | 🔴         | Gateway       | North-south vs east-west traffic                         |
| Q23 | BFF Pattern                                   | 🟡         | Gateway       | Per-client-type gateway, tailored API shape              |
| Q24 | 5 thuật toán Rate Limiting                    | 🔴         | Rate Limiting | Token bucket vs sliding window vs leaky bucket           |
| Q25 | Distributed rate limiting challenges          | 🔴         | Rate Limiting | Redis centralized, Lua atomic, approximate counts        |
| Q26 | Authentication vs Authorization               | 🟢         | Security      | Who are you vs what can you do                           |
| Q27 | API Key vs OAuth2 vs JWT vs mTLS              | 🟡         | Security      | Stateless JWT, delegated OAuth2, zero-trust mTLS         |
| Q28 | CORS deep dive                                | 🟡         | Security      | Preflight OPTIONS, allowed origins, credentials          |
| Q29 | API abuse prevention                          | 🔴         | Security      | Layered: rate limit + CAPTCHA + IP reputation + WAF      |
| Q30 | API-first design                              | 🟡         | Contract      | Design before implement, OpenAPI spec, codegen           |
| Q31 | Contract testing                              | 🔴         | Contract      | Pact/consumer-driven, catch breaking changes pre-deploy  |
| Q32 | Backward compatibility rules                  | 🟡         | Contract      | Additive OK, removal/rename = breaking                   |
| A1  | REST vs GraphQL vs gRPC (bilingual)           | 🟡         | Cross-cutting | Protocol selection decision framework                    |
| A2  | Idempotency importance (bilingual)            | 🟡         | Idempotency   | Retry safety, idempotency key pattern                    |
| A3  | Rate limiting implementation (bilingual)      | 🔴         | Rate Limiting | Token bucket + Redis + Retry-After header                |

> **Phân bổ:** 🟢 Junior: 4 | 🟡 Mid: 19 | 🔴 Senior: 12 | **Tổng: 35 câu hỏi**

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn Bất Ngờ

> **Interviewer:** "Your team is building a new microservice. How do you decide between REST, gRPC, and GraphQL?"

**30-second answer:**
"It depends on the consumer and communication pattern. For **public APIs** consumed by browsers or third parties, **REST** is the standard — cacheable, well-understood, great tooling. For **internal service-to-service** communication where performance matters, **gRPC** — binary protobuf is 3-5x faster than JSON, HTTP/2 multiplexing, and strong typing via proto schema catches bugs at compile time. For **mobile clients** or **BFF patterns** where different clients need different data shapes, **GraphQL** — client specifies exact fields, eliminates over/under-fetching. In practice, most systems use REST for public + gRPC for internal."

**Follow-up:** "What if you need real-time streaming between services?"
→ "gRPC server streaming or bidirectional streaming. For client-facing real-time, WebSocket or GraphQL Subscriptions. gRPC streaming is preferred internally because it's typed, multiplexed, and has built-in flow control via HTTP/2."

---

## Self-Check / Tự Kiểm Tra — Retrieval Practice

> ⏱️ Che cột "Câu hỏi" rồi tự trả lời, sau đó mở ra kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                                   |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Kể tên 6 REST constraints và giải thích tại sao statelessness quan trọng nhất cho scaling?                                                                |
| 2   | 🎨 Visual      | Vẽ diagram Token Bucket algorithm: bucket size=5, refill=1/sec — 8 requests đến t=0, chuyện gì xảy ra?                                                    |
| 3   | 🛠️ Application | Implement idempotency key pattern: client gửi POST /payments + Idempotency-Key header — viết pseudocode cho server xử lý (check Redis → process → store). |
| 4   | 🐛 Debug       | GraphQL API trả response chậm 10x khi query nested 3 level — root cause là gì? Giải pháp?                                                                 |
| 5   | 🎓 Teach       | Giải thích cho junior: API Gateway và BFF khác nhau thế nào? Khi nào cần BFF thay vì chỉ dùng gateway?                                                    |

💬 **Feynman Prompt:** Giải thích cho một frontend developer tại sao gRPC không thể dùng trực tiếp từ browser, và khi nào nên chọn gRPC vs REST vs GraphQL. Dùng ví dụ thực tế: e-commerce app có mobile + web + internal microservices.

### 📅 Spaced Repetition Schedule

| Round | Timing        | Focus                                    |
| ----- | ------------- | ---------------------------------------- |
| 1     | Day 1 (today) | Đọc toàn bộ, highlight Memory Hooks      |
| 2     | Day 3         | Self-Check without looking — đạt ≥4/5    |
| 3     | Day 7         | Cold Call simulation — trả lời trong 30s |
| 4     | Day 14        | Q&A 🔴 only — giải thích deep trade-offs |
| 5     | Day 30        | Mock interview — API design full topic   |

---

## Connections / Liên Kết

**Cùng track (be-track):**

- ➡️ [Microservices](./02-microservices.md) — API design is communication backbone of microservices
- ➡️ [Auth & Security](./04-auth-security.md) — JWT, OAuth2, mTLS in depth
- ➡️ [gRPC & Protobuf](./09-grpc-protobuf.md) — Deep dive gRPC implementation
- ➡️ [Resilience Patterns](./07-resilience-patterns.md) — Circuit breaker, retry, timeout
- ➡️ [Message Queues](./08-message-queues.md) — Async communication alternative to sync APIs

**Khác track:**

- ⬅️ [Networking Theory](../../shared/01-cs-fundamentals/networking-theory.md) — HTTP/TCP/DNS foundations
- 🔗 [System Design](../04-be-system-design/01-design-framework.md) — API design as first step in system design interviews
- 🔗 [Database](../03-database-advanced/01-sql-fundamentals.md) — N+1 query problem in both GraphQL and ORM

---

## Quick Recap / Tóm Tắt Nhanh

### Key Takeaways / Điểm Chính

- **REST uses HTTP verbs + nouns**: GET (read), POST (create), PUT/PATCH (update), DELETE (remove) — method semantics matter for caching and idempotency / **REST dùng HTTP verb + noun**: GET đọc, POST tạo, PUT/PATCH cập nhật, DELETE xoá — semantics ảnh hưởng caching và idempotency.
- **Idempotency**: GET/PUT/DELETE are idempotent (repeat = same result); POST is not — use idempotency keys for safe retries / **Idempotency**: GET/PUT/DELETE là idempotent (lặp lại = cùng kết quả); POST thì không — dùng idempotency key để retry an toàn.
- **Status codes matter**: 2xx success, 3xx redirect, 4xx client error, 5xx server error — never return 200 with an error body / **Status code quan trọng**: 2xx thành công, 3xx redirect, 4xx lỗi client, 5xx lỗi server — không bao giờ trả 200 kèm body lỗi.
- **gRPC uses Protocol Buffers** over HTTP/2 — strongly typed, binary, lower latency; ideal for internal microservice calls / **gRPC dùng Protocol Buffers** qua HTTP/2 — strongly typed, binary, latency thấp; lý tưởng cho giao tiếp microservice nội bộ.
- **GraphQL lets clients specify shape** — solves over/under-fetching; but N+1 query problem requires DataLoader / **GraphQL để client chỉ định shape** — giải quyết over/under-fetching; nhưng vấn đề N+1 cần DataLoader.
- **Rate limiting protects services**: Token Bucket (burst allowed), Leaky Bucket (smooth), Fixed/Sliding Window — implement at gateway / **Rate limiting bảo vệ service**: Token Bucket (cho phép burst), Leaky Bucket (mượt), Fixed/Sliding Window — implement ở gateway.
- **API versioning strategies**: URL path (`/v1/`), header (`Accept: application/vnd.api+json;version=1`), query param — URL is most visible / **Chiến lược versioning API**: URL path (`/v1/`), header, query param — URL path rõ ràng nhất.
- **CORS is a browser security mechanism** — server must respond with `Access-Control-Allow-Origin` header; preflight OPTIONS for non-simple requests / **CORS là cơ chế bảo mật của browser** — server phải trả header `Access-Control-Allow-Origin`; preflight OPTIONS cho request phức tạp.

### Interview Tips / Mẹo Phỏng Vấn

- **"REST vs gRPC vs GraphQL — when to use each?"** — REST for public APIs; gRPC for low-latency internal services; GraphQL for flexible client-driven queries / **"REST vs gRPC vs GraphQL — khi nào dùng cái nào?"** — REST cho public API; gRPC cho service nội bộ latency thấp; GraphQL cho query linh hoạt từ client.
- **"How do you design a paginated API?"** — Cursor/keyset pagination for large datasets (no offset drift); include `next_cursor` and `has_more` in response / **"Thiết kế API phân trang thế nào?"** — Cursor/keyset pagination cho dataset lớn (không bị offset drift); trả `next_cursor` và `has_more`.
- **"How do you handle API backward compatibility?"** — Add fields (don't remove); version breaking changes; use `required: false` for new fields; document deprecation timeline / **"Xử lý backward compatibility thế nào?"** — Thêm field (đừng xoá); version khi thay đổi breaking; dùng `required: false` cho field mới; ghi rõ deprecation.
- **"Explain idempotency keys"** — Client generates a unique UUID per request; server stores result keyed on it; duplicate requests return cached result / **"Giải thích idempotency key"** — Client tạo UUID duy nhất cho mỗi request; server lưu kết quả theo key đó; request trùng lặp trả kết quả đã cache.
- **"What is an API Gateway?"** — Single entry point that handles auth, rate limiting, routing, load balancing, and observability before reaching services / **"API Gateway là gì?"** — Điểm vào duy nhất xử lý auth, rate limit, routing, load balance và observability trước khi đến service.
