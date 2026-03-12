# API Design — Deep Theory & Interview Questions

> **Phạm vi**: REST, gRPC, GraphQL, API Gateway, Rate Limiting, Security, Documentation.
> Tập trung lý thuyết sâu, so sánh trade-off, ít code — phù hợp ôn phỏng vấn Backend.

---

## 1. REST API Design Principles


## Câu Hỏi Phỏng Vấn / Interview Q&A
### Q1: 6 ràng buộc (constraints) của REST theo luận văn Roy Fielding là gì? 🟡 🟡 [Mid]

**A:**

REST (Representational State Transfer) được Roy Fielding định nghĩa trong luận văn tiến sĩ năm 2000 với **6 ràng buộc kiến trúc**:

| # | Constraint | Ý nghĩa | Hệ quả |
|---|-----------|---------|---------|
| 1 | **Client-Server** | Tách biệt UI (client) và data storage (server) | Cho phép phát triển độc lập, tăng portability |
| 2 | **Stateless** | Mỗi request chứa ĐẦY ĐỦ thông tin để server xử lý, server không lưu session | Dễ scale horizontally, mỗi server đều xử lý được |
| 3 | **Cacheable** | Response phải khai báo rõ có cache được không | Giảm tải server, tăng tốc client |
| 4 | **Uniform Interface** | Giao tiếp thống nhất qua resource + representation | Đơn giản hóa kiến trúc, decouple client-server |
| 5 | **Layered System** | Client không biết mình đang nói chuyện với server cuối hay proxy/LB | Cho phép thêm proxy, cache, gateway giữa chừng |
| 6 | **Code-on-Demand** *(optional)* | Server có thể gửi executable code cho client (JS) | Mở rộng chức năng client mà không cần deploy lại |

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

| Rule | Good | Bad |
|------|------|-----|
| Dùng danh từ số nhiều | `/users` | `/getUser` |
| Dùng lowercase, hyphen | `/user-profiles` | `/UserProfiles`, `/user_profiles` |
| Phân cấp rõ ràng | `/users/123/orders` | `/getOrdersByUser?id=123` |
| Không đuôi file | `/users/123` | `/users/123.json` |
| Không trailing slash | `/users` | `/users/` |
| Filter qua query params | `/users?status=active` | `/active-users` |

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

| Method | Mục đích | Safe? | Idempotent? | Request Body | Ví dụ |
|--------|---------|-------|-------------|-------------|-------|
| `GET` | Đọc resource | ✅ | ✅ | Không | `GET /users/42` |
| `POST` | Tạo mới resource | ❌ | ❌ | Có | `POST /users` |
| `PUT` | Thay thế toàn bộ resource | ❌ | ✅ | Có | `PUT /users/42` |
| `PATCH` | Cập nhật một phần | ❌ | ❌* | Có | `PATCH /users/42` |
| `DELETE` | Xóa resource | ❌ | ✅ | Không/Có | `DELETE /users/42` |
| `HEAD` | Giống GET nhưng không body | ✅ | ✅ | Không | `HEAD /users/42` |
| `OPTIONS` | Xem methods được phép | ✅ | ✅ | Không | `OPTIONS /users` |

**Giải thích quan trọng:**

- **Safe**: Không thay đổi state trên server. GET gọi 1000 lần vẫn không đổi data.
- **Idempotent**: Gọi N lần cho kết quả giống gọi 1 lần. `DELETE /users/42` gọi 2 lần — lần 2 trả 404 nhưng state cuối cùng giống nhau (user đã bị xóa).
- **PATCH không idempotent***: Vì `PATCH` có thể dùng kiểu `{"op": "increment", "path": "/views", "value": 1}` — gọi 2 lần tăng 2.

**PUT vs PATCH — sự khác biệt thực sự:**
- `PUT` gửi **toàn bộ** resource → nếu thiếu field, field đó bị reset về default/null
- `PATCH` chỉ gửi **field cần thay đổi** → các field khác giữ nguyên

---

### Q4: HTTP Status Codes — bảng đầy đủ? 🟢 🟢 [Junior]

**A:**

#### 2xx — Thành công

| Code | Tên | Ý nghĩa |
|------|-----|---------|
| 200 | OK | Request thành công, có response body |
| 201 | Created | Tạo mới thành công (dùng với POST) |
| 202 | Accepted | Server nhận request nhưng chưa xử lý xong (async) |
| 204 | No Content | Thành công nhưng không có body (dùng với DELETE) |

#### 3xx — Chuyển hướng

| Code | Tên | Ý nghĩa |
|------|-----|---------|
| 301 | Moved Permanently | Resource đã chuyển vĩnh viễn sang URL mới |
| 302 | Found | Chuyển hướng tạm thời |
| 304 | Not Modified | Resource chưa thay đổi, client dùng cache |

#### 4xx — Lỗi từ Client

| Code | Tên | Ý nghĩa |
|------|-----|---------|
| 400 | Bad Request | Request sai format, thiếu field, validation fail |
| 401 | Unauthorized | Chưa xác thực (thiếu/sai token) — đúng ra nên gọi "Unauthenticated" |
| 403 | Forbidden | Đã xác thực nhưng không có quyền — đây mới là "Unauthorized" |
| 404 | Not Found | Resource không tồn tại |
| 405 | Method Not Allowed | HTTP method không được hỗ trợ cho URI này |
| 409 | Conflict | Xung đột (duplicate, version conflict) |
| 422 | Unprocessable Entity | Cú pháp đúng nhưng logic sai (email format invalid) |
| 429 | Too Many Requests | Bị rate limit |

#### 5xx — Lỗi từ Server

| Code | Tên | Ý nghĩa |
|------|-----|---------|
| 500 | Internal Server Error | Lỗi không xác định từ server |
| 502 | Bad Gateway | Upstream server trả response lỗi |
| 503 | Service Unavailable | Server quá tải hoặc đang maintenance |
| 504 | Gateway Timeout | Upstream server không trả lời kịp |

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
    {"rel": "self",    "href": "/users/42"},
    {"rel": "orders",  "href": "/users/42/orders"},
    {"rel": "update",  "href": "/users/42", "method": "PUT"},
    {"rel": "delete",  "href": "/users/42", "method": "DELETE"}
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

| Level | Đặc điểm | Ví dụ |
|-------|----------|-------|
| 0 | 1 URI, 1 method (POST) | `POST /api` body: `{action: "getUser", id: 42}` |
| 1 | Nhiều URI, nhưng chỉ POST | `POST /users/42` body: `{action: "get"}` |
| 2 | URI + HTTP methods đúng | `GET /users/42`, `DELETE /users/42` |
| 3 | Level 2 + HATEOAS links | Response chứa navigable links |

> **Thực tế**: Đa số production API đạt Level 2 và coi đó là đủ tốt.

---

## 2. API Versioning Strategies

### Q7: Có những chiến lược versioning nào? Trade-off? 🟡 🟡 [Mid]

**A:**

#### So sánh các chiến lược

| Strategy | Ví dụ | Pros | Cons |
|----------|-------|------|------|
| **URI Path** | `/v1/users` | Rõ ràng, dễ hiểu, dễ cache | "Ô nhiễm" URI, phải maintain nhiều route |
| **Query Param** | `/users?version=1` | Không thay đổi URI structure | Dễ quên, khó enforce, cache phức tạp hơn |
| **Header** (Custom) | `X-API-Version: 1` | URI sạch, linh hoạt | Không nhìn thấy version trong URL, debug khó |
| **Content Negotiation** | `Accept: application/vnd.api.v1+json` | Chuẩn HTTP nhất | Phức tạp, ít dev quen |
| **No versioning** (evolution) | Chỉ thêm field, không xóa | Đơn giản nhất | Cần discipline cao, tech debt tiềm ẩn |

#### Ai dùng gì?

| Company/API | Strategy | Lý do |
|-------------|----------|-------|
| **Stripe** | API version qua header + date | `Stripe-Version: 2023-10-16` — pin version theo ngày |
| **GitHub** | Accept header + URI | `Accept: application/vnd.github.v3+json` |
| **Google** | URI path | `/v1/projects/...` — rõ ràng cho API đa dạng |
| **Twitter/X** | URI path | `/2/tweets` |
| **Slack** | No versioning | Evolve API, deprecate fields dần |

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

| Aspect | Chi tiết |
|--------|---------|
| Ưu điểm | Đơn giản, dễ hiểu, nhảy đến page bất kỳ |
| Nhược điểm lớn | `OFFSET 1000000` → DB phải scan 1M rows rồi bỏ → **cực chậm** |
| Vấn đề consistency | Nếu có insert/delete giữa 2 request → duplicate hoặc miss rows |
| Khi nào dùng | Dataset nhỏ (<100K rows), cần "jump to page X" |

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

| Aspect | Chi tiết |
|--------|---------|
| Ưu điểm | Performance ổn định O(limit), không bị duplicate/miss khi data thay đổi |
| Nhược điểm | Không nhảy đến page bất kỳ, không biết tổng số page |
| Cursor chứa gì | Thường là encoded giá trị của sort column (base64 encoded ID/timestamp) |
| Khi nào dùng | Dataset lớn, feed/timeline, real-time data |

#### 3.3 Keyset Pagination (Seek Method)

Bản chất giống cursor nhưng dùng trực tiếp giá trị thay vì opaque cursor:

```
GET /users?created_after=2024-01-15T10:30:00Z&limit=10
-- SQL: WHERE created_at > '2024-01-15T10:30:00Z' ORDER BY created_at LIMIT 10
```

| Aspect | Chi tiết |
|--------|---------|
| Ưu điểm | Hiệu quả nhất về DB performance (dùng index seek) |
| Nhược điểm | Yêu cầu column có giá trị unique + indexed, khó sort multi-column |

#### Decision Matrix

| Tiêu chí | Offset | Cursor | Keyset |
|----------|--------|--------|--------|
| Dataset < 100K | ✅ | ✅ | ✅ |
| Dataset > 1M | ❌ | ✅ | ✅ |
| Jump to page N | ✅ | ❌ | ❌ |
| Real-time feed | ❌ | ✅ | ✅ |
| Đơn giản implement | ✅ | 🟡 | 🟡 |
| Consistent khi data thay đổi | ❌ | ✅ | ✅ |

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

| Method | Idempotent? | Giải thích |
|--------|-------------|-----------|
| GET | ✅ | Đọc data, không thay đổi state |
| PUT | ✅ | Set resource = giá trị cụ thể, gọi lại vẫn same state |
| DELETE | ✅ | Xóa resource, gọi lại → đã xóa rồi (404 nhưng state giống) |
| POST | ❌ | Tạo mới → gọi 2 lần có thể tạo 2 records |
| PATCH | ❌ | Có thể increment → gọi 2 lần tăng 2 |

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

| Semantics | Ý nghĩa | Cách đạt được | Rủi ro |
|-----------|---------|--------------|--------|
| **At-most-once** | Gửi 1 lần, không retry | Fire-and-forget, không ack | Có thể **mất message** |
| **At-least-once** | Retry đến khi nhận ack | Client retry + server ack | Có thể **duplicate** |
| **Exactly-once** | Xử lý đúng 1 lần | At-least-once + deduplication | Khó nhất, đắt nhất |

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

| Feature | HTTP/1.1 | HTTP/2 |
|---------|----------|--------|
| Multiplexing | 1 request/connection (HOL blocking) | Nhiều request song song trên 1 connection |
| Header compression | Không | HPACK compression — giảm overhead đáng kể |
| Server push | Không | Server chủ động push data |
| Binary protocol | Text-based | Binary framing — parse nhanh hơn |
| Stream | Không native | Bidirectional streaming built-in |

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

| Rule | Chi tiết |
|------|---------|
| **KHÔNG BAO GIỜ** thay đổi field number | Field number là ID duy nhất, thay đổi = break tất cả |
| **KHÔNG** thay đổi type của field hiện tại | `int32` → `string` sẽ break |
| **CÓ THỂ** thêm field mới | Old client bỏ qua field lạ (forward compatible) |
| **CÓ THỂ** xóa field (nhưng reserve number) | Dùng `reserved` keyword để tránh tái sử dụng number |
| **CÓ THỂ** rename field | Vì wire format dùng number, không dùng name |

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

| Pattern | Use Case |
|---------|----------|
| Unary | CRUD thông thường, hầu hết API calls |
| Server streaming | Real-time feed, log tailing, stock price updates |
| Client streaming | Upload file chunks, batch data ingestion |
| Bidirectional | Chat, collaborative editing, gaming |

---

### Q15: gRPC vs REST — so sánh chi tiết? 🟡 🟡 [Mid]

**A:**

| Tiêu chí | REST | gRPC |
|----------|------|------|
| **Protocol** | HTTP/1.1 (thường) | HTTP/2 (bắt buộc) |
| **Format** | JSON (text) | Protobuf (binary) |
| **Schema** | Optional (OpenAPI) | Bắt buộc (.proto file) |
| **Performance** | Chậm hơn (text parse, lớn hơn) | 2-10x nhanh hơn |
| **Streaming** | Workaround (SSE, WebSocket) | Native 4 patterns |
| **Browser support** | ✅ Native | ❌ Cần gRPC-Web proxy |
| **Tooling** | curl, Postman, mọi HTTP tool | grpcurl, BloomRPC, hạn chế hơn |
| **Code generation** | Optional | Built-in (nhiều ngôn ngữ) |
| **Human readable** | ✅ JSON dễ đọc | ❌ Binary khó debug |
| **Caching** | HTTP caching built-in | Phải tự implement |
| **Load balancing** | L7 LB đơn giản | Cần gRPC-aware LB (L7) |
| **Deadline propagation** | Không native | ✅ Built-in |
| **Error model** | HTTP status codes | Rich error model (status + details) |

**Decision matrix — khi nào dùng gì:**

| Scenario | Chọn |
|----------|------|
| Public API cho third-party | REST |
| Internal microservice ↔ microservice | gRPC |
| Browser/mobile client | REST (hoặc gRPC-Web) |
| High performance, low latency | gRPC |
| Streaming real-time data | gRPC |
| Cần human-readable debugging | REST |
| Polyglot microservices | gRPC (code-gen đa ngôn ngữ) |

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

| gRPC Status | HTTP Tương đương | Ý nghĩa |
|-------------|-----------------|---------|
| OK | 200 | Thành công |
| INVALID_ARGUMENT | 400 | Client gửi sai |
| NOT_FOUND | 404 | Resource không tồn tại |
| ALREADY_EXISTS | 409 | Đã tồn tại |
| PERMISSION_DENIED | 403 | Không có quyền |
| UNAUTHENTICATED | 401 | Chưa xác thực |
| RESOURCE_EXHAUSTED | 429 | Rate limit |
| INTERNAL | 500 | Lỗi server |
| UNAVAILABLE | 503 | Service không sẵn sàng |
| DEADLINE_EXCEEDED | 504 | Hết thời gian |

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

| Operation | Mục đích | Tương đương REST |
|-----------|---------|-----------------|
| **Query** | Đọc data | GET |
| **Mutation** | Thay đổi data | POST/PUT/PATCH/DELETE |
| **Subscription** | Nhận real-time updates | WebSocket/SSE |

**Type System:**

```graphql
type User {
  id: ID!              # ! = non-nullable
  name: String!
  email: String
  posts: [Post!]!      # non-null array of non-null Posts
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

| Tiêu chí | REST | gRPC | GraphQL |
|----------|------|------|---------|
| **Tốt nhất cho** | Public API, CRUD đơn giản | Service-to-service, high perf | Complex queries, multiple clients |
| **Flexibility cho client** | Thấp (fixed response) | Thấp (fixed schema) | Cao (client chọn fields) |
| **Performance** | Trung bình | Cao nhất | Trung bình (thêm layer parse) |
| **Caching** | HTTP cache native | Tự implement | Phức tạp (POST-based) |
| **Learning curve** | Thấp | Trung bình | Cao |
| **Tooling** | Rất tốt | Tốt | Tốt |
| **Real-time** | SSE/WebSocket | Streaming native | Subscription |
| **File upload** | Đơn giản | Streaming | Phức tạp |
| **Error handling** | HTTP status | Rich status | errors array trong response |

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

| Chức năng | Mô tả |
|-----------|-------|
| **Routing** | Route request đến đúng service dựa trên path/header |
| **Authentication** | Verify JWT/API key một lần tại gateway |
| **Rate Limiting** | Giới hạn requests per client |
| **Load Balancing** | Phân tải giữa service instances |
| **Circuit Breaking** | Ngắt mạch khi service downstream fail |
| **Request Transformation** | Aggregate, transform request/response |
| **SSL Termination** | Handle HTTPS tại gateway, internal dùng HTTP |
| **Logging/Monitoring** | Central point for observability |
| **CORS handling** | Xử lý CORS một chỗ |
| **Response caching** | Cache response phổ biến |

---

### Q22: API Gateway vs Service Mesh? 🔴 🔴 [Senior]

**A:**

| Aspect | API Gateway | Service Mesh |
|--------|------------|--------------|
| **Vị trí** | Edge (ranh giới hệ thống) | Bên trong (giữa services) |
| **Traffic** | North-South (client → system) | East-West (service ↔ service) |
| **Deployment** | Centralized (1-2 instances) | Sidecar per service |
| **Focus** | External API management | Internal service communication |
| **Ví dụ** | Kong, AWS API GW, Nginx | Istio, Linkerd, Consul Connect |

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

| Aspect | Chi tiết |
|--------|---------|
| Cách hoạt động | Đếm requests trong window cố định (VD: mỗi phút) |
| Ưu điểm | Đơn giản, memory ít (1 counter per window) |
| Nhược điểm lớn | **Burst tại biên window** — có thể vượt gấp đôi limit |
| Storage | 1 counter + 1 timestamp |

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

| Aspect | Chi tiết |
|--------|---------|
| Cách hoạt động | Lưu log timestamp mỗi request, sliding window chính xác |
| Ưu điểm | Chính xác tuyệt đối, không bị burst |
| Nhược điểm | **Memory cao** — lưu mọi timestamp trong window |
| Storage | Sorted set of timestamps per user |

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

| Aspect | Chi tiết |
|--------|---------|
| Cách hoạt động | Weighted count giữa 2 windows liền kề |
| Ưu điểm | Memory thấp (2 counters), gần chính xác, không bị burst |
| Nhược điểm | Chỉ là ước lượng, không 100% chính xác |
| Storage | 2 counters per window |

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

| Aspect | Chi tiết |
|--------|---------|
| Cách hoạt động | Bucket chứa tokens, mỗi request lấy 1 token, tokens refill theo rate |
| Ưu điểm | Cho phép burst (dùng hết tokens tích lũy), smooth rate |
| Nhược điểm | 2 parameters cần tune (bucket size, refill rate) |
| Storage | 1 counter + 1 timestamp (last refill) |

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

| Aspect | Chi tiết |
|--------|---------|
| Cách hoạt động | Requests vào queue, xử lý ở tốc độ cố định |
| Ưu điểm | Output rate cực kỳ đều đặn, tốt cho API cần stable throughput |
| Nhược điểm | Burst bị queue (latency tăng), không tận dụng được capacity trống |
| Storage | Queue + drain rate |

#### So sánh tổng hợp

| Algorithm | Memory | Accuracy | Burst Allowed | Complexity |
|-----------|--------|----------|---------------|------------|
| Fixed Window | ⭐ | ⭐⭐ | ❌ (boundary) | ⭐ |
| Sliding Log | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ | ⭐⭐ |
| Sliding Counter | ⭐⭐ | ⭐⭐⭐⭐ | ❌ | ⭐⭐ |
| Token Bucket | ⭐ | ⭐⭐⭐⭐ | ✅ | ⭐⭐ |
| Leaky Bucket | ⭐⭐ | ⭐⭐⭐⭐ | ❌ (queued) | ⭐⭐ |

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

| Approach | Mô tả | Trade-off |
|----------|-------|-----------|
| **Central store (Redis)** | Tất cả instances đọc/ghi counter trên Redis | Thêm latency mỗi request (~1ms), Redis là SPOF |
| **Sticky session** | Route cùng client đến cùng instance | Mất load balancing đều |
| **Sync giữa instances** | Gossip protocol đồng bộ count | Eventually consistent, có thể vượt limit tạm |
| **Local + global** | Rate limit local (rough) + global trên Redis (exact) | Phức tạp nhưng giảm Redis load |

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

| Aspect | Authentication (AuthN) | Authorization (AuthZ) |
|--------|----------------------|---------------------|
| **Câu hỏi** | "Bạn là **ai**?" | "Bạn được **làm gì**?" |
| **Xảy ra khi** | Đầu tiên | Sau authentication |
| **Ví dụ** | Login bằng username/password | Check quyền admin/user |
| **HTTP status khi fail** | 401 Unauthorized | 403 Forbidden |
| **Mechanisms** | Password, JWT, OAuth, mTLS | RBAC, ABAC, ACL, Policy |

```
Request ──► Authentication ──► Authorization ──► Handler
            "Who are you?"     "Can you do this?"
            (verify identity)  (check permissions)
```

---

### Q27: API Key vs OAuth 2.0 vs JWT vs mTLS? 🟡 🟡 [Mid]

**A:**

| Method | Cách hoạt động | Khi nào dùng | Bảo mật |
|--------|---------------|-------------|---------|
| **API Key** | Static key gửi qua header/query | Server-to-server đơn giản, public APIs | Thấp — key lộ = toàn quyền |
| **OAuth 2.0** | Authorization framework, nhiều flows (Authorization Code, Client Credentials...) | Third-party access, social login | Cao — scoped, revocable tokens |
| **JWT** | Self-contained token chứa claims, signed | Stateless auth, microservices | Trung bình — không revoke được trực tiếp |
| **mTLS** | Cả client và server verify certificate lẫn nhau | Service-to-service trong zero-trust | Rất cao — identity ở transport layer |

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

| Flow | Dùng cho | Có user interaction? |
|------|---------|---------------------|
| Authorization Code | Web app (có backend) | ✅ |
| Authorization Code + PKCE | SPA, Mobile | ✅ |
| Client Credentials | Machine-to-machine | ❌ |
| ~~Implicit~~ | ~~SPA (deprecated)~~ | ~~✅~~ |
| ~~Resource Owner Password~~ | ~~Trusted app (deprecated)~~ | ~~✅~~ |

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

| Strategy | Mô tả |
|----------|-------|
| **Rate limiting** | Giới hạn requests/time per client (xem mục 8) |
| **Input validation** | Validate tất cả input, reject early |
| **Request size limit** | Giới hạn body size (VD: 1MB) |
| **Timeout** | Set timeout cho mọi request (VD: 30s) |
| **IP allowlisting/blocklisting** | Chặn IP spam, cho phép IP tin cậy |
| **Bot detection** | CAPTCHA, fingerprinting, behavior analysis |
| **Payload inspection** | Chặn SQL injection, XSS trong input |
| **API key rotation** | Rotate keys định kỳ, revoke keys bị lộ |
| **Quota management** | Giới hạn tổng requests/ngày/tháng per client |
| **Request signing** | HMAC signature cho mỗi request (timestamp + body) |
| **Throttling by tier** | Free tier: 100 req/min, Pro: 10K req/min |

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

| Component | Mô tả |
|-----------|-------|
| `paths` | Danh sách endpoints + methods |
| `schemas` | Data models (request/response) |
| `parameters` | Path, query, header params |
| `responses` | Status codes + response schema |
| `security` | Auth schemes (API key, OAuth, JWT) |
| `servers` | Base URLs cho các environments |

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

| Action | Tại sao break |
|--------|--------------|
| Xóa field khỏi response | Client đang expect field đó |
| Đổi type của field | Client parse sai |
| Đổi URL path | Client hardcode URL cũ |
| Thêm required field vào request | Client cũ không gửi field mới |
| Thay đổi error format | Client handle error sai |
| Thay đổi auth mechanism | Client cũ không auth được |

**Non-breaking changes** (an toàn):

| Action | Tại sao safe |
|--------|-------------|
| Thêm field mới vào response | Client bỏ qua field lạ |
| Thêm optional field vào request | Client cũ không gửi = OK |
| Thêm endpoint mới | Không ảnh hưởng endpoint cũ |
| Thêm enum value mới | Nếu client handle "unknown" đúng |

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

| Company type | Focus areas |
|-------------|-------------|
| **Fintech** (VNPay, Momo, ZaloPay) | Idempotency, exactly-once, payment API design, security |
| **E-commerce** (Shopee, Tiki, Lazada) | Pagination cho catalog, rate limiting, caching, API Gateway |
| **Social/Chat** (Zalo, Facebook) | gRPC streaming, real-time, GraphQL for social graph |
| **Cloud/Infra** (VNG Cloud, FPT) | API Gateway, Service Mesh, gRPC internal, mTLS |
| **Startup** | REST design, JWT auth, basic rate limiting, CORS |
| **Big Tech (Google, Grab)** | Tất cả ở trên + system design kết hợp |

### Mẹo trả lời

1. **Luôn nói trade-off**: Không có giải pháp hoàn hảo. "Tôi chọn A vì... nhưng nhược điểm là..."
2. **Dùng ví dụ thực tế**: "Stripe dùng idempotency key pattern", "GitHub API dùng HATEOAS"
3. **Vẽ diagram**: Rate limiting algorithms, request flow, architecture — vẽ ra giúp giải thích rõ hơn
4. **Đừng chỉ biết lý thuyết**: Khi nói về Token Bucket, sẵn sàng nói "Tôi đã implement dùng Redis với MULTI/EXEC"
5. **Phân biệt rõ concept**: 401 vs 403, PUT vs PATCH, authentication vs authorization — những chi tiết nhỏ thể hiện hiểu biết sâu
