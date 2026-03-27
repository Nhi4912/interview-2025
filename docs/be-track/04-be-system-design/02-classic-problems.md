# Classic System Design Problems / Các Bài Toán Thiết Kế Hệ Thống Kinh Điển

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Design Framework](./01-design-framework.md) | [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md)
> **See also**: [Advanced Problems](./03-advanced-problems.md) | [Distributed Patterns](./04-distributed-patterns.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee Interview (2023, ứng viên chia sẻ):** Câu hỏi "Design a URL shortener" — ứng viên nhảy thẳng vào database schema. Interviewer dừng lại: "Bao nhiêu URLs được tạo mỗi ngày? Cần analytics không? TTL có expiry không?" Không có answers, ứng viên không biết nên dùng SQL hay NoSQL, không biết scale cỡ nào. Kết quả: fail vòng system design.

**Bài học:** Classic problems như URL shortener, rate limiter, notification system _có vẻ_ đơn giản nhưng ẩn chứa nhiều trade-off. Framework 5 bước (requirements → estimation → HLD → deep dive → wrap-up) phải được áp dụng ngay cả với bài "đơn giản".

## What & Why / Cái Gì & Tại Sao

**Analogy:** Classic system design problems giống bài thi lái xe: không ai hỏi bạn "tự thiết kế một chiếc xe" — họ hỏi các tình huống điển hình (đường trơn, biển cấm, đường ưu tiên). Mỗi "classic problem" là một tập hợp trade-off quen thuộc mà senior engineer phải biết navigate trong 45 phút.

**Why these problems:** URL shortener (hashing, redirect, analytics), rate limiter (token bucket, distributed counters), notification system (queue, fan-out, priority) — mỗi bài test một domain kiến thức khác nhau nhưng dùng chung framework.

## Concept Map / Bản Đồ Khái Niệm

```
[Classic Problems — Key Trade-offs]
        │
        ├── URL Shortener
        │     ├── Hashing strategy: MD5 vs base62 vs custom
        │     ├── Read-heavy: cache aggressively
        │     └── Analytics: async pipeline (Kafka → ClickHouse)
        │
        ├── Rate Limiter
        │     ├── Algorithm: Token Bucket vs Sliding Window
        │     ├── Distributed: Redis INCR + TTL vs Lua script
        │     └── Where: API Gateway vs per-service vs user-level
        │
        └── Notification System
              ├── Fan-out strategies: push vs pull per user type
              ├── Priority queues: OTP > transactional > marketing
              └── Deduplication: idempotency keys + DLQ
```

---

## Overview / Tổng Quan

Classic System Design Problems là bộ 6 bài toán xuất hiện nhiều nhất trong phỏng vấn — mỗi bài test một miền kiến thức khác nhau nhưng đều dùng chung framework 5 bước. Nắm vững 6 bài này giúp cover ~80% câu hỏi system design ở mọi cấp độ.

| #   | Problem             | Domain Tested                                     | Interview Weight                    |
| --- | ------------------- | ------------------------------------------------- | ----------------------------------- |
| 1   | URL Shortener       | Hashing, caching, read-heavy optimization         | ⭐⭐⭐⭐ — most common entry-level  |
| 2   | Chat System         | Real-time, WebSocket, fan-out, message ordering   | ⭐⭐⭐⭐⭐ — tests depth            |
| 3   | Rate Limiter        | Algorithms, distributed counters, Redis atomicity | ⭐⭐⭐⭐ — concurrency knowledge    |
| 4   | Distributed Cache   | Consistent hashing, LRU, replication              | ⭐⭐⭐⭐ — infrastructure knowledge |
| 5   | Notification System | Queue, priority, deduplication, multi-channel     | ⭐⭐⭐ — async patterns             |
| 6   | Search Autocomplete | Trie, prefix cache, data pipeline                 | ⭐⭐⭐ — data structure + pipeline  |

**Mối quan hệ:** URL Shortener = "hello world" của system design (đơn giản nhất) → Chat = complexity tăng (real-time) → Rate Limiter = focus algorithms → Cache = infrastructure → Notification = async + multi-channel → Autocomplete = data pipeline + search.

---

## Core Concepts — Phase 2 Deep Content

### Concept 1: URL Shortener

🧠 **Memory Hook:** "**Base62 counter + Redis cache = URL shortener.** Read:write 100:1 → cache-heavy. 302 for analytics, 301 for CDN."

❓ **Why exists:**

- **Level 1:** Tại sao cần URL shortener? → Chia sẻ link dài trên SMS (160 char), social media, QR code.
- **Level 2:** Tại sao nó là classic interview problem? → Vì nó test nhiều concept: hashing, caching, redirect semantics, scaling read-heavy systems.

**Layer 1 — Analogia đơn giản:**
Giống số phòng khách sạn: thay vì nói "phòng ở tầng 5, hành lang trái, cửa thứ 3" (URL dài), bạn chỉ cần nói "phòng 503" (short code). Lễ tân (redirect service) biết 503 → tầng 5 hành lang trái.

**Layer 2 — Mechanics:**

```
Write path: long_url → Counter Service (Redis INCR) → Base62 encode → store in DB
Read path:  short_code → Redis cache (90% hit) → DB fallback → 302 redirect
Key decisions:
  Code gen: Base62(counter) > MD5 (shorter, no collision)
  Redirect: 302 (analytics) vs 301 (CDN-friendly)
  Storage:  MySQL sharded by short_code hash range
```

**Layer 3 — Edge cases:**

- Custom alias collision → check uniqueness, return 409.
- Expired URLs → TTL + lazy deletion + background cleanup.
- Hot URL (viral) → CDN edge cache + Redis cluster.

| Sai lầm              | Tại sao sai                      | Đúng là                                |
| -------------------- | -------------------------------- | -------------------------------------- |
| Dùng MD5 hash        | Collision possible, longer codes | Base62 counter — shorter, no collision |
| 301 redirect         | Browser caches → no analytics    | 302 cho analytics, 301 cho CDN-only    |
| Single Redis counter | SPOF cho write path              | Counter service sharded by range       |

🎯 **Interview Pattern:**

- **Trigger:** "Design a URL shortener" hoặc "Design bit.ly"
- **Concept:** Hashing + caching + redirect semantics
- **Opening:** "I'd start with requirements: 100M URLs/day, read:write 100:1, so this is a cache-heavy read system. For code generation, I'd use Base62 encoding of an auto-increment counter..."

🔑 **Knowledge Chain:**

- 📚 Prereq: [Design Framework](./01-design-framework.md) — 5-step process
- ➡️ Enables: Understanding cache-heavy architectures, [Caching Patterns](../03-database-advanced/04-caching-patterns.md)

---

### Concept 2: Chat System

🧠 **Memory Hook:** "**WebSocket cho real-time + Kafka cho fan-out + Cassandra cho time-series history.** 15M concurrent connections = 300 WS servers."

❓ **Why exists:**

- **Level 1:** Tại sao chat cần thiết kế riêng? → Vì real-time bidirectional communication khác hoàn toàn request-response.
- **Level 2:** Tại sao interview hỏi chat? → Vì nó test: WebSocket management, message ordering, fan-out strategies, distributed state.

**Layer 1 — Analogia đơn giản:**
Giống hệ thống bưu điện: mỗi người có hòm thư (WebSocket connection). Khi A gửi thư cho B, bưu điện (message service) phải biết hòm thư B ở đâu (user→server mapping), rồi đưa thư đến đúng nơi.

**Layer 2 — Mechanics:**

```
Connection: Client ←WebSocket→ WS Gateway (stateful, 50K conn/server)
Routing:    Redis stores user:123 → ws2.chat.com
Persistence: Cassandra (time-series optimized) — partition by conversation_id
Fan-out:    1:1 = direct route via Redis lookup
            Group = Kafka topic per conversation → delivery service → each member's WS server
Ordering:   Sequence number per conversation (monotonic) OR Hybrid Logical Clock
```

**Layer 3 — Edge cases:**

- User switches device mid-conversation → multiple connections, need dedup.
- WS server crashes → reconnect + replay from last sequence number.
- Group of 500 → fan-out on write for active users, fan-out on read for inactive.

| Sai lầm                    | Tại sao sai                      | Đúng là                                           |
| -------------------------- | -------------------------------- | ------------------------------------------------- |
| HTTP polling cho real-time | Latency cao, server load lớn     | WebSocket persistent connection                   |
| Store messages in MySQL    | Not optimized cho time-series    | Cassandra — designed for append-heavy time-series |
| Global message ordering    | Impossible without single writer | Per-conversation ordering là đủ                   |

🎯 **Interview Pattern:**

- **Trigger:** "Design a chat system" hoặc "Design WhatsApp/Slack"
- **Concept:** Real-time messaging, fan-out, message ordering
- **Opening:** "Let me clarify: is this 1:1 only or group chat? What's the max group size? For real-time delivery, I'd use WebSocket connections with a gateway layer..."

🔑 **Knowledge Chain:**

- 📚 Prereq: WebSocket, [Message Queues](../02-backend-knowledge/08-message-queues.md)
- ➡️ Enables: [Ride-Hailing](./06-ride-hailing-system.md) real-time tracking

---

### Concept 3: Rate Limiter

🧠 **Memory Hook:** "**Token Bucket = best default (allows bursts). Redis Lua script = atomic distributed counter.** Response: 429 + Retry-After header."

❓ **Why exists:**

- **Level 1:** Tại sao cần rate limiting? → Chống abuse, DDoS protection, cost control.
- **Level 2:** Tại sao nó là senior interview topic? → Vì cần hiểu algorithms (4 loại), distributed coordination (Redis), và atomicity.

**Layer 1 — Analogia đơn giản:**
Giống cổng soát vé concert: chỉ cho 100 người/phút vào. Token bucket = mỗi phút phát 100 vé mới, hết vé thì chờ. Sliding window = đếm bao nhiêu người đã vào trong 60 giây qua.

**Layer 2 — Algorithm comparison:**

```
┌─────────────────┬──────────┬──────────┬───────────────┐
│ Algorithm       │ Accuracy │ Memory   │ Burst Support │
├─────────────────┼──────────┼──────────┼───────────────┤
│ Fixed Window    │ Low      │ O(1)     │ ❌ Boundary   │
│ Sliding Log     │ Exact    │ O(N)     │ ✅ None       │
│ Sliding Counter │ ~99.97%  │ O(1)     │ ✅ Minimal    │
│ Token Bucket    │ Good     │ O(1)     │ ✅ Controlled │
└─────────────────┴──────────┴──────────┴───────────────┘
Recommendation: Token Bucket (AWS API Gateway uses it)
Distributed: Redis Lua script for INCR + EXPIRE atomicity
```

**Layer 3 — Edge cases:**

- Multi-server without Redis → each server allows 100 → 1000 total (10x limit).
- Redis down → fail-open (allow all) vs fail-closed (deny all) — business decides.
- Rate limit per user vs per IP vs per API key — different use cases.

| Sai lầm                     | Tại sao sai             | Đúng là                                  |
| --------------------------- | ----------------------- | ---------------------------------------- |
| Fixed window cho production | Boundary burst problem  | Sliding window counter hoặc Token bucket |
| Per-server counter          | 10 servers × 100 = 1000 | Redis centralized counter                |
| Blocking request thread     | Thread pool exhaustion  | Return 429 immediately + Retry-After     |

🎯 **Interview Pattern:**

- **Trigger:** "Design a rate limiter" hoặc "How would you protect an API?"
- **Concept:** Rate limiting algorithms + distributed coordination
- **Opening:** "I'd use a Token Bucket algorithm for its burst tolerance. For distributed rate limiting across multiple servers, I'd use Redis with a Lua script for atomic check-and-increment..."

🔑 **Knowledge Chain:**

- 📚 Prereq: Redis, [Resilience Patterns](../02-backend-knowledge/07-resilience-patterns.md)
- ➡️ Enables: API Gateway design, DDoS protection

---

### Concept 4: Distributed Cache

🧠 **Memory Hook:** "**Consistent hashing = minimal key redistribution. LRU = HashMap + Doubly Linked List = O(1) everything.** Đây là 2 interview answers for cache design."

❓ **Why exists:**

- **Level 1:** Tại sao cần distributed cache? → Vì single-node cache có memory limit và SPOF.
- **Level 2:** Tại sao interview hỏi? → Vì test data structure knowledge (LRU) + distributed systems (consistent hashing, replication).

**Layer 1 — Analogia đơn giản:**
Giống tủ sách thư viện nhiều chi nhánh: consistent hashing = mỗi cuốn sách có "chi nhánh chủ" dựa trên tên sách. Thêm chi nhánh mới → chỉ chuyển một phần sách, không phải sắp xếp lại toàn bộ.

**Layer 2 — Mechanics:**

```
Consistent Hashing Ring:
  hash(key) → position on ring → nearest clockwise shard
  Add shard: only ~1/N keys remapped (vs ALL with hash%N)

LRU Data Structure:
  HashMap: key → DLL node (O(1) lookup)
  DLL:    [MRU head] ←→ node ←→ ... ←→ [LRU tail]
  GET:    HashMap lookup → move to head → O(1)
  PUT:    If full, remove tail → insert at head → O(1)
  EVICT:  Remove tail node + HashMap entry → O(1)
```

**Layer 3 — Edge cases:**

- Consistent hashing with virtual nodes → smoother distribution.
- Hot key problem → replicate across multiple shards with random suffix.
- Cache stampede → distributed locking or probabilistic early expiration.

| Sai lầm              | Tại sao sai                    | Đúng là                                     |
| -------------------- | ------------------------------ | ------------------------------------------- |
| hash(key) % N        | Adding 1 shard remaps ALL keys | Consistent hashing — minimal redistribution |
| LRU with sorted list | O(N) for insertion/removal     | HashMap + DLL = O(1) everything             |
| No replication       | Shard failure = data loss      | Primary + replica per shard                 |

🎯 **Interview Pattern:**

- **Trigger:** "Design a distributed cache" hoặc "Implement LRU cache"
- **Concept:** Consistent hashing + LRU eviction
- **Opening:** "I'd use consistent hashing to distribute keys across shards, with each shard having a primary and replica. For eviction, LRU implemented with a HashMap and doubly linked list gives O(1) for all operations."

🔑 **Knowledge Chain:**

- 📚 Prereq: [Caching Patterns](../03-database-advanced/04-caching-patterns.md), Hash Tables
- ➡️ Enables: Redis cluster understanding, any cache-heavy system design

---

### Concept 5: Notification System

🧠 **Memory Hook:** "**Kafka + Priority Queue + Idempotency Key = reliable notifications.** Phải check user preferences TRƯỚC khi gửi — không gửi marketing cho người đã opt-out."

❓ **Why exists:**

- **Level 1:** Tại sao notification cần design riêng? → Vì multi-channel (push/email/SMS), priority (OTP > marketing), deduplication (không gửi 2 lần).
- **Level 2:** Tại sao interview hỏi? → Vì test async patterns, queue management, exactly-once delivery.

**Layer 1 — Analogia đơn giản:**
Giống bưu điện có nhiều loại dịch vụ: thư thường (email), chuyển phát nhanh (push), điện tín (SMS). Mỗi loại có queue riêng, priority riêng (OTP = khẩn cấp). Phải ghi nhận đã gửi (idempotency) để không gửi trùng.

**Layer 2 — Mechanics:**

```
Flow: Service → Notification API → Kafka → Channel Workers → Provider
      ↓ check preferences (Redis)  ↓ priority sort   ↓ dedup (Redis SET NX)
      ↓ template + i18n            ↓ retry (exp backoff) ↓ DLQ for failures

Priority Queue:
  HIGH:   OTP, security alerts → immediate
  MEDIUM: Order confirmation, password reset → < 1 min
  LOW:    Marketing, newsletter → can batch/delay
```

**Layer 3 — Edge cases:**

- Provider down (SendGrid outage) → retry + circuit breaker + fallback provider.
- Rate limit per user (max 5 push/hour) → avoid notification fatigue.
- Timezone-aware scheduling → marketing emails at 9 AM local time.

| Sai lầm                  | Tại sao sai                           | Đúng là                             |
| ------------------------ | ------------------------------------- | ----------------------------------- |
| Gửi notification đồng bộ | Block user request                    | Async via Kafka → instant response  |
| Không check preferences  | Legal violation (GDPR/CAN-SPAM)       | Check opt-in/opt-out BEFORE sending |
| Không idempotency key    | Kafka at-least-once → duplicate sends | Redis SET NX với notification_id    |

🎯 **Interview Pattern:**

- **Trigger:** "Design a notification system" hoặc "Design push notification service"
- **Concept:** Async queue + priority + deduplication
- **Opening:** "I'd decouple notification sending from the main request flow using Kafka. Priority queues ensure OTP notifications aren't delayed by marketing batches. For exactly-once delivery, I'd use idempotency keys in Redis."

🔑 **Knowledge Chain:**

- 📚 Prereq: [Message Queues](../02-backend-knowledge/08-message-queues.md), [gRPC](../02-backend-knowledge/09-grpc-protobuf.md) for internal communication
- ➡️ Enables: Event-driven architecture understanding

---

### Concept 6: Search Autocomplete

🧠 **Memory Hook:** "**Trie + Redis prefix cache + daily Spark rebuild = autocomplete.** Top 3-char prefixes cached → 90%+ hit rate."

❓ **Why exists:**

- **Level 1:** Tại sao cần autocomplete riêng? → Vì latency < 100ms khi user gõ, và data thay đổi hàng ngày theo trending.
- **Level 2:** Tại sao interview hỏi? → Vì test data structure (Trie), caching strategy, và data pipeline (batch rebuild).

**Layer 1 — Analogia đơn giản:**
Giống mục lục sách theo alphabet: muốn tìm từ "app" → lật đến trang A → P → P → thấy tất cả từ bắt đầu bằng "app" (apple, application, apply). Trie = mục lục dạng cây, mỗi node là 1 ký tự.

**Layer 2 — Mechanics:**

```
Trie: root → a → p → p → [results: apple(100), app(80), apply(40)]
                           Each node stores top-K results (pre-computed)

Serving: Client → CDN → Redis (prefix:3char → top5) → Trie Service (fallback)
Pipeline: Search logs → Spark (daily) → count frequencies → rebuild Trie → warm Redis
Optimization: Only cache top 3-char prefixes (26³ = 17K entries → fits in Redis)
```

**Layer 3 — Edge cases:**

- Offensive/dangerous queries → filtering layer before caching.
- Cold start (new prefix, no data) → fallback to substring search.
- Multi-language → separate tries per language, detect by keyboard input.

| Sai lầm                     | Tại sao sai                    | Đúng là                            |
| --------------------------- | ------------------------------ | ---------------------------------- |
| Query DB on every keystroke | Latency 50-100ms per keystroke | Cache popular prefixes in Redis    |
| Real-time trie update       | Complex + unnecessary          | Daily batch rebuild from logs      |
| Store all prefix results    | Memory explosion               | Only store top-K (5-10) per prefix |

🎯 **Interview Pattern:**

- **Trigger:** "Design search autocomplete" hoặc "Design typeahead"
- **Concept:** Trie + prefix caching + data pipeline
- **Opening:** "I'd use a Trie data structure to store search queries ranked by frequency. For performance, I'd cache top-5 results for popular 3-character prefixes in Redis, with daily batch rebuilds from search logs using Spark."

🔑 **Knowledge Chain:**

- 📚 Prereq: Trie data structure, [Data Structures](../01-golang/06-data-structures-go.md)
- ➡️ Enables: Search engine design, [Advanced Problems](./03-advanced-problems.md)

---

## How to Use This Guide / Cách Sử Dụng

Mỗi bài toán trình bày theo framework 5 bước:

```
1. Requirements  → FR + NFR rõ ràng
2. Estimation    → Back-of-envelope (QPS, storage, bandwidth)
3. Architecture  → High-level diagram + key components
4. Deep Dive     → Critical subsystems (thường là bottleneck)
5. Trade-offs    → Alternatives and why this design wins
```

Trong phỏng vấn 45-60 phút: dành 5 phút cho requirements, 5 cho estimation, 15 cho architecture, 20 cho deep dive.

---

## 1. URL Shortener / Rút Gọn URL (e.g., bit.ly)

### Requirements

**Functional:**

- `POST /shorten` → given long URL, return short code (e.g., `bit.ly/abc123`)
- `GET /:code` → redirect to original URL
- Custom alias support (optional)
- Link expiration (optional)
- Analytics: click count per link

**Non-Functional:**

- 100M URLs created/day → ~1200 writes/sec
- Read:Write = 100:1 → 120,000 redirects/sec
- Latency: redirect < 10ms p99
- Availability: 99.9%
- URLs never change (immutable after creation)

### Estimation / Ước Tính

```
WRITE:
  100M URLs/day ÷ 86,400s = ~1,200 write/sec

READ (redirects):
  100:1 read-write ratio → 120,000 read/sec

STORAGE:
  Each URL record: short_code(7) + long_url(100) + metadata(50) ≈ 157 bytes
  5 years retention: 100M × 365 × 5 × 157B ≈ 28.7 TB

BANDWIDTH:
  Read: 120,000 req/s × 100 bytes = ~12 MB/s
  → CDN handles most redirect responses → actual origin traffic much lower
```

### Architecture / Kiến Trúc

```
Client
  │
  ▼
[CDN / Edge Cache]   ← cache redirect responses (301 → browser caches)
  │ cache miss
  ▼
[Load Balancer]
  │
  ├──[URL Service]   ← reads short_code → long_url from cache/DB
  │       │
  │       ▼
  │  [Redis Cache]   ← hot URLs (LRU, TTL=24h), ~90% hit rate
  │       │ miss
  │       ▼
  │  [DB: MySQL]     ← source of truth, sharded by short_code
  │
  └──[Shorten Service]  ← generates unique short codes
          │
          ▼
     [ID Generator]  ← Snowflake ID or Base62 counter
```

### Deep Dive: Short Code Generation / Sinh Mã Ngắn

**Option 1: MD5/Hash**

```
hash = MD5(long_url + salt)
short_code = base62(hash[:7])   # take first 7 chars = 62^7 = 3.5 trillion combos

Problem: MD5 is deterministic → same URL = same code (good for dedup)
Problem: Hash collision → two different URLs, same first 7 chars
```

**Option 2: Auto-increment ID + Base62 (recommended)**

```
DB auto_increment: 1000000
Base62(1000000) = "4c92"   → 4-6 char codes initially, grows slowly

Scale: shard by counter ranges (Shard1: 0-1B, Shard2: 1B-2B)
OR: single Redis INCR for counter → fast, single-threaded → no collisions
```

**Option 3: Snowflake ID**

```
64-bit: [41-bit timestamp][10-bit machine][12-bit sequence]
= globally unique, time-ordered, no coordination needed
```

**Redirect strategy:**

```
301 Permanent: browser caches → no repeated requests → low load
              Bad for analytics (can't count clicks)
302 Temporary: every redirect hits our servers → analytics ✓
              Higher load but can update destination

Most URL shorteners: 302 for analytics-enabled links
```

### Trade-offs / Đánh Đổi

| Concern  | Chosen        | Alternative         | Why                                             |
| -------- | ------------- | ------------------- | ----------------------------------------------- |
| Storage  | MySQL sharded | NoSQL (DynamoDB)    | Simple key-value access pattern, SQL works fine |
| Caching  | Redis LRU     | In-memory app cache | Shared across instances, survives restart       |
| ID gen   | Redis INCR    | UUID                | Shorter codes, no collision                     |
| Redirect | 302           | 301                 | Analytics requirement                           |

---

## 2. Chat System / Hệ Thống Nhắn Tin (e.g., Slack, WhatsApp)

### Requirements

**Functional:**

- 1:1 and group messaging (up to 500 members)
- Real-time message delivery
- Online/offline status
- Message history (persistent)
- Read receipts (optional)
- File/media sharing (out of scope for basic)

**Non-Functional:**

- DAU: 50M, each sends 40 messages/day → 23,000 msg/sec
- Latency: message delivery < 100ms
- Consistency: messages ordered per sender, eventual consistency for delivery
- Storage: retain messages 5 years

### Estimation

```
Message rate: 50M users × 40 msg/day ÷ 86,400s = ~23,000 msg/sec
Peak (2x avg): 46,000 msg/sec

Storage per message: sender_id(8) + receiver_id(8) + content(100) + ts(8) ≈ 124 bytes
5 years: 23,000 × 86,400 × 365 × 5 × 124B ≈ 52 TB
→ Use Cassandra/HBase for time-series chat history (designed for this)

WebSocket connections: 50M DAU × 30% online simultaneously = 15M concurrent connections
→ Need ~300 WebSocket servers (50k connections each)
```

### Architecture

```
[Mobile/Web Client]
        │ WebSocket (persistent)
        ▼
[WebSocket Gateway]  ← stateful servers, handle 50k connections each
  (ws1.chat.com)         maintain user→server mapping in Redis
  (ws2.chat.com)
        │
        ▼
[Message Service]    ← receive, persist, fan-out
        │
   ┌────┴────┐
   ▼         ▼
[Kafka]    [Chat DB]
(fan-out)  (Cassandra)
   │
   ▼
[Delivery Service]   ← reads from Kafka, routes to correct WebSocket server
        │
        ▼
  [Redis: user→server map]
  user:123 → ws2.chat.com
        │
        ▼
[Target WebSocket Server]  → push to client
```

### Deep Dive: Message Ordering / Thứ Tự Tin Nhắn

```
Problem: Multi-region, multiple servers → messages can arrive out of order

VECTOR CLOCK approach (WhatsApp):
  Each device maintains a logical clock
  msg.vector_clock = {device1: 5, device2: 3}
  Receiver orders by vector clock

SIMPLER: Sequence number per conversation
  Each conversation has a monotonic sequence number
  seq_num generated by conversation service (single writer)
  seq_num stored with message

Trade-off: Sequence number service = bottleneck
  Scale: one sequence service per conversation shard
  OR: use HLC (Hybrid Logical Clock) = physical time + logical counter
```

### Deep Dive: Fan-out Strategy

```
Group message to 500 members:

FAN-OUT ON WRITE (WhatsApp):
  Write one message to Kafka
  Delivery service reads and delivers to each member's WebSocket

  Pros: Fast delivery
  Cons: Message stored once, but delivered 500x from Kafka

FAN-OUT ON READ (Slack):
  Store message once in DB
  Each user reads from DB when they open the conversation

  Pros: Storage efficient
  Cons: Slow initial load (all 500 members read on open)

Facebook Messenger hybrid:
  Active users → fan-out on write (WebSocket push)
  Inactive users → fan-out on read (pull on next login)
```

---

## 3. Rate Limiter / Giới Hạn Tốc Độ

### Requirements

**Functional:**

- Limit requests per user/IP/API key
- Multiple rules: 100 req/min per user, 1000 req/hour per IP
- Return 429 Too Many Requests with retry-after header
- Rules configurable without deployment

**Non-Functional:**

- Added latency < 2ms for allow path
- Handle 100k req/sec
- Distributed: multiple app servers share the same rate limit state
- Fail-open: if rate limiter unavailable, allow requests (availability > strictness)

### Algorithms / Thuật Toán

```
FIXED WINDOW:
  window: [00:00 - 01:00], count per window
  Simple but: burst at window boundary (99 req at :59, 100 req at :01)

  [────────────────][────────────────]
  0s               60s              120s
  Count: 100 ok    Count: 0 reset → 100 more immediately = 200 in 2s ✗

SLIDING WINDOW LOG:
  Store timestamp of each request in sorted set
  Count requests in [now - 60s, now]

  Pros: Exact, no boundary burst
  Cons: Memory heavy (store each request timestamp)

SLIDING WINDOW COUNTER (recommended):
  Blend of fixed windows:
  current_count = curr_window_count + prev_window_count × (1 - elapsed%)

  Example: 100 req/min limit
  Prev window (40s ago): 80 requests
  Current window (20s elapsed): 30 requests
  elapsed% in current = 20/60 = 33%

  estimated_count = 30 + 80 × (1 - 0.33) = 30 + 54 = 84 → allow

  Memory efficient, approximation < 0.003% error

TOKEN BUCKET:
  Bucket capacity = burst limit
  Tokens refilled at rate R per second
  Request costs 1 token, rejected if empty

  Pros: Allows bursts up to capacity
  AWS API Gateway uses token bucket
```

### Distributed Rate Limiter Architecture

```
                    App Server 1
                    App Server 2   → [Redis Cluster] ← central rate limit state
                    App Server 3

Per-server counter (bad):
  S1 allows 100, S2 allows 100 → 200 requests pass (2x the limit)

Redis ATOMIC operations:
  INCR user:123:count:minute:1234
  EXPIRE user:123:count:minute:1234 60
  Both in Lua script = atomic

Redis sliding window with sorted set:
  ZADD user:123:requests <timestamp> <request_id>
  ZREMRANGEBYSCORE user:123:requests 0 <now-60s>  ← remove old
  ZCARD user:123:requests                          ← count
  All in pipeline = fast

Performance:
  Redis: 100k+ ops/sec
  Rate limit check: ~0.5ms → meets our 2ms target
```

---

## 4. Distributed Cache / Cache Phân Tán (Redis Clone)

### Requirements

**Functional:**

- GET/SET/DELETE operations
- TTL/expiration
- LRU eviction when memory full

**Non-Functional:**

- < 1ms p99 for GET/SET
- 99.99% availability
- Horizontal scalability
- Persistence optional (configurable)

### Architecture

```
CLIENT
  │
  ▼
[Proxy / Router]   ← consistent hashing to route key to correct shard
  │
  ├── Shard 1 (keys 0-33%)
  │     ├── Primary
  │     └── Replica(s)
  ├── Shard 2 (keys 33-66%)
  │     ├── Primary
  │     └── Replica(s)
  └── Shard 3 (keys 66-100%)
        ├── Primary
        └── Replica(s)

Consistent hashing ring:
hash(key) → position on ring → nearest shard primary
Adding shard: only ≈ 1/N keys remapped (vs all keys with hash%N)
```

### LRU Eviction Implementation

```
HashMap + Doubly Linked List = O(1) get/put/evict

HashMap: {key → node}
LinkedList: [MRU] ←→ node ←→ node ←→ node ←→ [LRU]

GET key:
  1. HashMap lookup → find node
  2. Move node to MRU end of list
  3. Return value

SET key=value:
  1. If exists: update value + move to MRU
  2. If new + capacity full: remove LRU (tail node + HashMap entry)
  3. Insert new node at MRU head + HashMap

All operations O(1) ← this is the entire LRU Cache interview answer
```

---

## 5. Notification System / Hệ Thống Thông Báo

### Requirements

**Functional:**

- Push notifications (iOS/Android), email, SMS
- Template-based messages with user data
- Schedule and bulk send
- Delivery tracking

**Non-Functional:**

- 10M notifications/day → ~115 notifications/sec
- Peak 10x: 1,150/sec
- Each notification delivered exactly once (at-least-once + idempotency)
- Email: 5min delivery SLA; Push: 1min; SMS: 2min

### Architecture

```
Producer Services             ┌──────────────────────────────────┐
(Order Service,               │         Notification Service      │
 Marketing,                   │                                  │
 System Alerts)               │  [Priority Queue]                │
        │                     │  HIGH: system alerts              │
        │ REST / Event         │  MEDIUM: user-triggered          │
        ▼                     │  LOW: marketing                  │
[Notification API]            └──────────────────────────────────┘
        │                              │
        ▼                     ┌────────┼────────┐
[Kafka: notifications]        ▼        ▼        ▼
        │               [Email    ] [Push    ] [SMS
        │               [Worker   ] [Worker  ] [Worker]
        │                   │          │          │
        ▼               [SendGrid] [APNs/FCM] [Twilio]
[Notification DB]           │          │          │
(status tracking)           └──────────┴──────────┘
                                    Delivery
```

### Deduplication / Chống Gửi Trùng

```
Problem: Kafka at-least-once → notification sent twice if worker crashes mid-send

Solution: Idempotency key
  notification_id → generated once, stored in DB
  Worker checks: has this notification_id been sent?

Redis dedup check:
  SET notification:abc123:sent "1" NX EX 86400
  → SET if Not Exists, expire in 24h
  → Returns 1 if newly set (send it), 0 if already set (skip)
  → Atomic → safe in distributed env
```

---

## 6. Search Autocomplete / Tìm Kiếm Gợi Ý

### Requirements

**Functional:**

- Return top 5 suggestions for a prefix as user types
- Rank by search frequency
- Low latency (< 100ms end-to-end)
- Updated daily with new trending queries

**Non-Functional:**

- 100M DAU, each types 10 searches/day
- ~11,600 queries/sec peak
- Read-heavy (queries >> updates)

### Data Structure: Trie / Cây Tìm Kiếm

```
Trie storing ["apple":100, "app":80, "application":60, "apply":40]:

    root
    └── a
        └── p
            ├── p (freq:80) ← "app"
            │   ├── l
            │   │   ├── e (freq:100) ← "apple"
            │   │   └── i
            │   │       └── c
            │   │           └── a
            │   │               └── t
            │   │                   └── i
            │   │                       └── o
            │   │                           └── n (freq:60) ← "application"
            │   └── y (freq:40) ← "apply"

Query "app": traverse a→p→p → return top-5 children by freq
= ["apple":100, "app":80, "application":60, "apply":40]
```

### Architecture

```
Client types "app":
  1. Client sends GET /suggestions?q=app
  2. Load Balancer → nearest edge (CDN)
  3. Cache: check Redis "suggestions:app" → HIT → return in < 1ms
  4. MISS → Trie Service → traverse trie → top 5 → cache result

Data pipeline (daily updates):
  Search logs → Spark job → count top queries per prefix
  → rebuild trie → push to Trie Service
  → warm up Redis cache for popular prefixes

Scale:
  Trie in memory (top 3-char prefixes cached in Redis)
  Trie Service: read replicas, no writes during serving
  Cache TTL: 1 hour (trends don't change that fast)
```

---

## Interview Q&A Summary / Tổng Kết

| System            | Key Insight                                                 | Common Follow-up                |
| ----------------- | ----------------------------------------------------------- | ------------------------------- |
| URL Shortener     | 302 for analytics, Base62+counter for codes                 | How to handle custom aliases?   |
| Chat              | WebSocket + Redis pubsub for routing, Cassandra for history | Message ordering in groups?     |
| Rate Limiter      | Sliding window counter in Redis, Lua script for atomicity   | Distributed race condition?     |
| Distributed Cache | Consistent hashing + LRU = HashMap+DLL                      | Cache invalidation strategy?    |
| Notifications     | Priority queues + Kafka + idempotency key                   | Dead letter queue for failures? |
| Autocomplete      | Trie + Redis prefix cache, daily rebuild from logs          | Real-time updates vs batch?     |

---

**See also**: [Design Framework](./01-design-framework.md) | [Advanced Problems](./03-advanced-problems.md) | [Distributed Patterns](./04-distributed-patterns.md)

---

## Interview Q&A Summary / Tổng hợp câu hỏi phỏng vấn

### Q: How would you design a URL shortener? / Thiết kế URL shortener như thế nào? 🟡 Mid

**A:**

```
Requirements:
  Functional: shorten URL, redirect short → long, custom aliases, expiry
  Non-functional: 100M URLs, 10:1 read:write ratio, <10ms redirect latency

Core Algorithm — short code generation:
  Option 1: Base62 encode auto-increment ID
  ├── ID=1 → "000001", ID=2 → "000002", ...
  ├── Pros: simple, no collision
  └── Cons: predictable (can enumerate), single point of ID generation

  Option 2: Hash (MD5/SHA256 of long URL)
  ├── MD5 → 128 bits → take first 6 chars → "dGh2aX"
  ├── Pros: deterministic (same URL → same short code)
  └── Cons: collision possible (handle with counter suffix)

  Option 3: Random token (recommended)
  ├── random 6 chars from [A-Za-z0-9] → 62⁶ = 56B combinations
  ├── Store in DB with uniqueness constraint
  └── Retry on collision (< 0.001% probability)

System Architecture:
            ┌─────────┐    ┌──────────────┐    ┌──────────┐
 Create ───►│  API    │───►│  Short Code  │───►│   DB     │
            │ Gateway │    │  Generator   │    │(Postgres)│
            └─────────┘    └──────────────┘    └─────┬────┘
                                                      │
            ┌─────────┐    ┌──────────────┐    ┌─────▼────┐
 Redirect ─►│  CDN /  │───►│ Cache Layer  │───►│   DB     │
            │ LB      │    │   (Redis)    │    │          │
            └─────────┘    └──────────────┘    └──────────┘

Redirect flow (hot path):
1. GET /abc123 → check Redis cache
2. Cache hit → 301/302 redirect (HTTP) → ~2ms total
3. Cache miss → query DB → cache result → redirect → ~15ms

HTTP 301 vs 302:
├── 301 Permanent: browser caches redirect → fewer requests (good for CDN)
└── 302 Temporary: browser always asks server → analytics work correctly

Database schema:
  urls: id, short_code(indexed), long_url, user_id, created_at, expires_at
  clicks: id, url_id, timestamp, ip, user_agent (analytics)

Scale to 100M URLs:
├── DB: Postgres sharded by short_code hash range
├── Cache: Redis with 80/20 rule (top 20% URLs = 80% traffic)
└── Analytics: write clicks to Kafka → async aggregation
```

**Điểm interview:** URL shortener là câu classic để demo: DB schema design, caching strategy, HTTP fundamentals (301 vs 302), ID generation. Biết trade-off 301 vs 302 thường impressed interviewer.

### Q: How would you design a rate limiter? / Thiết kế rate limiter như thế nào? 🔴 Senior

**A:**

```
Rate limiting algorithms:

1. Token Bucket (most common, recommended)
   ├── Bucket holds N tokens, refills at R tokens/sec
   ├── Each request consumes 1 token
   ├── Request rejected if bucket empty
   ├── Allows short bursts up to bucket capacity
   └── Redis implementation:
```

```python
def is_allowed(user_id, max_tokens=100, refill_rate=10):
    key = f"rate:{user_id}"
    pipe = redis.pipeline()
    now = time.time()
    pipe.hgetall(key)
    # Fetch current state
    state = pipe.execute()[0]

    tokens = float(state.get("tokens", max_tokens))
    last_refill = float(state.get("last_refill", now))

    # Refill tokens
    elapsed = now - last_refill
    tokens = min(max_tokens, tokens + elapsed * refill_rate)

    if tokens >= 1:
        tokens -= 1
        redis.hset(key, mapping={"tokens": tokens, "last_refill": now})
        redis.expire(key, 3600)
        return True  # allowed
    return False  # rejected
```

```
2. Fixed Window Counter
   ├── Count requests in fixed time window (e.g., 100 req/min)
   └── Redis: INCR key:user:YYYYMMDDHHMM + EXPIRE 60

   Problem: boundary burst — 100 req at 00:59 + 100 req at 01:00 = 200 in 2 sec

3. Sliding Window Log
   ├── Store timestamp of each request in sorted set
   ├── Remove timestamps outside window, count remaining
   └── Redis: ZADD + ZREMRANGEBYSCORE + ZCARD
   ├── Pro: precise, no boundary burst
   └── Con: memory per user × request rate

4. Sliding Window Counter (best: precision + memory)
   ├── Hybrid: use current + previous window proportionally
   └── count = curr_window + prev_window × (1 - elapsed/window_size)

Distributed rate limiting:
  Problem: if 10 servers, each checks its own counter → 10× the limit
  Solution: centralized Redis (single source of truth)

  Redis Lua script for atomicity:
  local current = redis.call('INCR', KEYS[1])
  if current == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
  if current > tonumber(ARGV[2]) then return 0 end
  return 1

Rate limit response:
  HTTP 429 Too Many Requests
  Retry-After: 60  (seconds until limit resets)
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 0
  X-RateLimit-Reset: 1678886400
```

**Điểm senior interview:** Biết 4 algorithms và trade-off của mỗi cái. Token bucket là best balance (burst + refill). Distributed rate limiting cần centralized store. Redis Lua script cho atomicity. Response headers là production detail được đánh giá cao.

### Q: How would you design a notification system? / Thiết kế hệ thống notification? 🔴 Senior

**A:**

```
Requirements:
  Channels: email, SMS, push (iOS/Android), in-app
  Scale: 10M users, 1M notifications/day
  Types: transactional (order confirmation), marketing (promotions)
  Features: user preferences, retry logic, delivery tracking

Architecture:
                  ┌────────────┐
 Services ───────►│ Notification│
 (Order svc,      │   API      │
  Payment svc)    └─────┬──────┘
                        │
                        ▼
                  ┌─────────────┐
                  │   Message   │
                  │    Queue    │
                  │  (Kafka)    │
                  └──┬──┬──┬───┘
                     │  │  │
          ┌──────────┘  │  └──────────┐
          ▼             ▼             ▼
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │  Email   │  │   Push   │  │   SMS    │
    │ Worker   │  │  Worker  │  │  Worker  │
    │(SendGrid)│  │  (FCM/   │  │(Twilio)  │
    └──────────┘  │  APNs)   │  └──────────┘
                  └──────────┘
                        │
                  ┌──────────────┐
                  │  Delivery    │
                  │  Tracker DB  │
                  └──────────────┘

Key design decisions:

1. User preferences (respect opt-outs)
   ├── DB: notification_preferences(user_id, channel, type, enabled)
   ├── Check before sending: if !preferences.IsEnabled(user, channel, type) skip
   └── Cache preferences in Redis (updated infrequently)

2. Retry logic
   ├── Exponential backoff: 1s, 2s, 4s, 8s, 16s...
   ├── Max retries: 3-5 attempts
   ├── Dead letter queue (DLQ) for permanently failed notifications
   └── Alert on high DLQ rate

3. Deduplication
   ├── Idempotency key: hash(user_id + type + reference_id)
   ├── Check key before sending → skip if already delivered
   └── Prevents duplicate notifications on retry

4. Template management
   ├── Templates in DB/S3 (not hardcoded)
   ├── Localization: template_id + locale → localized template
   └── Variable substitution: "Hello {{name}}, your order {{order_id}}..."

5. Priority queues
   ├── Transactional (high): order confirmation, OTP → immediate
   ├── System (medium): password reset, alerts
   └── Marketing (low): promotions, newsletters → can batch/delay
```

**Điểm senior:** Notification systems cần: user preferences/opt-outs (legal requirement), retry với DLQ, deduplication với idempotency keys, priority queues (user doesn't want marketing delayed OTP). Multi-channel routing qua queue decouples senders từ channel-specific logic.

---

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                                   | Difficulty | Core Concept      | Key Signal                                    |
| --- | ------------------------------------------ | ---------- | ----------------- | --------------------------------------------- |
| W1  | URL Shortener walkthrough                  | 🟡         | URL Shortener     | Base62 counter + 302 analytics + Redis cache  |
| W2  | Chat System walkthrough                    | 🟡         | Chat System       | WebSocket + Redis routing + Cassandra history |
| W3  | Rate Limiter walkthrough                   | 🟡         | Rate Limiter      | Token Bucket + Redis Lua + sliding window     |
| W4  | Distributed Cache walkthrough              | 🟡         | Distributed Cache | Consistent hashing + LRU (HashMap+DLL)        |
| W5  | Notification System walkthrough            | 🟡         | Notification      | Kafka + priority queue + idempotency key      |
| W6  | Search Autocomplete walkthrough            | 🟡         | Autocomplete      | Trie + Redis prefix cache + daily Spark       |
| Q1  | Design URL shortener (interview Q&A)       | 🟡         | URL Shortener     | 3 code gen options + 301 vs 302 tradeoff      |
| Q2  | Design rate limiter (interview Q&A)        | 🔴         | Rate Limiter      | 4 algorithms + distributed Lua + fail-open    |
| Q3  | Design notification system (interview Q&A) | 🔴         | Notification      | Multi-channel + preferences + DLQ + dedup     |

**Distribution:** 🟢 0 (0%) | 🟡 7 (78%) | 🔴 2 (22%)

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Scenario:** Interviewer bất ngờ hỏi: _"If you have 45 minutes, how would you design a chat system for 50M users?"_

**30-second answer:**
"I'd start by clarifying requirements — 1:1 and group chat up to 500 members, 23K messages per second, P99 delivery under 100ms. For the architecture, I'd use WebSocket gateways handling 50K connections each — about 300 servers for 15M concurrent users. Message routing uses Redis to map users to their WebSocket server. For persistence, Cassandra is ideal because chat history is time-series append-heavy. For group fan-out, I'd use Kafka — active users get push delivery, inactive users pull on next login."

**Follow-up:** "How do you handle message ordering in a group with 500 members across multiple servers?"
→ "I'd assign a monotonic sequence number per conversation, generated by a single conversation coordinator service. Each message gets a seq_num before fan-out. Clients display messages sorted by seq_num, not by arrival time. For the coordinator bottleneck, I'd shard by conversation_id so different conversations use different coordinators."

---

## Self-Check / Tự Kiểm Tra

> **Instruction:** Đóng tài liệu lại. Trả lời 5 câu hỏi dưới đây KHÔNG nhìn notes.

1. **🔄 Retrieval:** Liệt kê 6 classic problems và key tradeoff chính của mỗi bài (1 câu/bài).
2. **🖼️ Visual:** Vẽ architecture diagram cho URL shortener — write path và read path, label mỗi component.
3. **🛠️ Application:** Cho Chat System 50M DAU: estimate concurrent WebSocket connections, số server cần, storage 5 năm.
4. **🐛 Debug:** Rate limiter dùng Fixed Window cho phép 200 requests trong 2 giây (boundary burst). Giải thích vấn đề và cách fix.
5. **🎓 Teach:** Giải thích cho junior tại sao notification system cần idempotency key — dùng ví dụ cụ thể (OTP gửi 2 lần).

💬 **Feynman Prompt:** Giải thích tại sao URL shortener cần "read-heavy optimization" nhưng rate limiter cần "write-heavy optimization" — và điều đó dẫn đến kiến trúc khác nhau như thế nào.

---

## 🔁 Spaced Repetition / Lịch Ôn Tập

| Round | Ngày   | Focus                                                      |
| ----- | ------ | ---------------------------------------------------------- |
| 1     | Day 1  | Đọc full — highlight key tradeoff mỗi problem              |
| 2     | Day 3  | Tự practice: design URL Shortener 45 phút không nhìn notes |
| 3     | Day 7  | Mock interview: Chat System + Rate Limiter back-to-back    |
| 4     | Day 14 | Mock interview: random pick 1 trong 6 problems             |
| 5     | Day 30 | Tự review Cold Call + Self-Check                           |

---

## Connections / Liên Kết

**Same-track (BE System Design):**

- ⬅️ [Design Framework](./01-design-framework.md) — apply 5-step framework to each problem
- ➡️ [Advanced Problems](./03-advanced-problems.md) — search engine, video streaming, payment systems
- ➡️ [Distributed Patterns](./04-distributed-patterns.md) — patterns used in deep dives
- ➡️ [Observability](./05-observability-and-scale.md) — monitoring for wrap-up step
- ➡️ [Ride-Hailing](./06-ride-hailing-system.md) — full walkthrough combining multiple patterns

**Cross-track:**

- 🔗 [Message Queues](../02-backend-knowledge/08-message-queues.md) — Kafka used in Chat + Notification
- 🔗 [Caching Patterns](../03-database-advanced/04-caching-patterns.md) — URL shortener cache strategy
- 🔗 [Resilience Patterns](../02-backend-knowledge/07-resilience-patterns.md) — rate limiting, circuit breaker
