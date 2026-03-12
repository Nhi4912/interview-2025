# Classic System Design Problems / Các Bài Toán Thiết Kế Hệ Thống Kinh Điển

> **Track**: BE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **Prerequisites**: [Design Framework](./01-design-framework.md) | [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md)
> **See also**: [Advanced Problems](./03-advanced-problems.md) | [Distributed Patterns](./04-distributed-patterns.md)

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

| Concern | Chosen | Alternative | Why |
|---------|--------|------------|-----|
| Storage | MySQL sharded | NoSQL (DynamoDB) | Simple key-value access pattern, SQL works fine |
| Caching | Redis LRU | In-memory app cache | Shared across instances, survives restart |
| ID gen | Redis INCR | UUID | Shorter codes, no collision |
| Redirect | 302 | 301 | Analytics requirement |

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

| System | Key Insight | Common Follow-up |
|--------|------------|-----------------|
| URL Shortener | 302 for analytics, Base62+counter for codes | How to handle custom aliases? |
| Chat | WebSocket + Redis pubsub for routing, Cassandra for history | Message ordering in groups? |
| Rate Limiter | Sliding window counter in Redis, Lua script for atomicity | Distributed race condition? |
| Distributed Cache | Consistent hashing + LRU = HashMap+DLL | Cache invalidation strategy? |
| Notifications | Priority queues + Kafka + idempotency key | Dead letter queue for failures? |
| Autocomplete | Trie + Redis prefix cache, daily rebuild from logs | Real-time updates vs batch? |

---

**See also**: [Design Framework](./01-design-framework.md) | [Advanced Problems](./03-advanced-problems.md) | [Distributed Patterns](./04-distributed-patterns.md)
