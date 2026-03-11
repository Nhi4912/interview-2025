# System Design Interview Framework - Deep Theory

---

## 1. System Design Interview Framework

### Q: Trình bày framework 5 bước để approach một bài System Design Interview? 🟢 [Junior]

**A:**

System Design Interview thường kéo dài 45-60 phút. Framework chuẩn chia thành 5 bước:

```
┌─────────────────────────────────────────────────────────────┐
│              SYSTEM DESIGN INTERVIEW TIMELINE               │
│                                                             │
│  Step 1        Step 2        Step 3         Step 4   Step 5 │
│  Require-      Estimation    High-Level     Deep     Wrap   │
│  ments                       Design         Dive     Up     │
│  ├──5min──┤   ├──5min──┤   ├──10min──┤   ├─15min─┤ ├5min┤  │
│  0       5   10       15   25       35   50     55 60min   │
│                                                             │
│  Clarify      Numbers     API + Data    Tradeoffs   Bot-   │
│  scope        matter!     + Arch        + Detail    tle-   │
│                                                    necks   │
└─────────────────────────────────────────────────────────────┘
```

| Step | Time | Mục đích | Signal cho interviewer |
|------|------|----------|----------------------|
| **1. Requirements** | 5 min | Thu hẹp scope, hiểu rõ bài toán | Biết cách phân tích vấn đề |
| **2. Estimation** | 5 min | Xác định scale để chọn architecture | Hiểu về scale thực tế |
| **3. High-Level** | 10 min | Vẽ kiến trúc tổng quan | Có kiến thức rộng |
| **4. Deep Dive** | 15 min | Đi sâu 2-3 components | Có depth + tradeoff reasoning |
| **5. Wrap-up** | 5 min | Nhận diện bottleneck, mở rộng | Tư duy production-ready |

---

### Q: Step 1 - Requirements Clarification: Functional vs Non-functional? 🟡 [Mid]

**A:**

**Functional Requirements (FR)** - Hệ thống **LÀM GÌ**:

```
FR Questions:
├── WHO: Ai là user? Bao nhiêu loại user?
├── WHAT: Core features là gì? Top 3-5
├── INPUT/OUTPUT: User input gì? System trả về gì?
├── SCOPE: Feature nào in-scope vs out-of-scope?
└── EDGE CASES: Constraint đặc biệt?
```

**Non-functional Requirements (NFR)** - Hệ thống hoạt động **NHƯ THẾ NÀO**:

```
NFR Questions:
├── SCALE: Bao nhiêu DAU? Read-heavy hay write-heavy?
├── PERFORMANCE: Latency requirement? P99 bao nhiêu ms?
├── AVAILABILITY: Cần mấy 9s? 99.9%? 99.99%?
├── CONSISTENCY: Strong hay eventual?
├── DURABILITY: Data có thể mất không? Retention bao lâu?
└── SECURITY: Auth? Encryption? Compliance?
```

**Tại sao quan trọng nhất:** Nếu không clarify, bạn có thể thiết kế hệ thống hoàn hảo... cho bài toán sai. Ví dụ "Design a chat system" - nếu không hỏi 1:1 hay group chat, có media hay không, cần E2E encryption không → architecture hoàn toàn khác nhau.

---

### Q: Step 3 - High-Level Design gồm những gì? Step 4 - Deep Dive nên focus đâu? 🟡 [Mid]

**A:**

**High-Level Design (10 min) - Produce 3 thứ:**

1. **API Design** - Define interfaces trước (REST endpoints / gRPC methods)
2. **Data Model** - Key entities + relationships
3. **Architecture Diagram** - Components + data flow (vẽ trái→phải: client → server → storage)

**Deep Dive (15 min) - Chọn 2-3 components phức tạp nhất:**

```
Deep Dive Framework cho mỗi component:
├── 1. WHY: Tại sao cần component này?
├── 2. HOW: Hoạt động chi tiết thế nào?
├── 3. TRADEOFFS: Lựa chọn nào? Tại sao chọn cái này?
├── 4. FAILURE: Component fail thì sao?
└── 5. SCALE: Scale 10x/100x cần thay đổi gì?
```

Không chỉ nói "dùng Redis cache" mà phải giải thích: Cache policy nào? Invalidation strategy? Cache stampede handling? Hot key problem?

**Wrap-up (5 min):** Bottlenecks → SPOF → Monitoring (metrics, alerting) → Future scaling → Cost optimization.

---

## 2. Back-of-Envelope Numbers

### Q: Latency numbers mà mọi programmer nên biết? 🟢 [Junior]

**A:**

```
┌─────────────────────────────────────────┬───────────────────┐
│ Operation                               │ Latency           │
├─────────────────────────────────────────┼───────────────────┤
│ L1 cache reference                      │ ~1 ns             │
│ L2 cache reference                      │ ~4 ns             │
│ Main memory reference (RAM)             │ ~100 ns           │
│ Compress 1KB with Snappy                │ ~3 μs             │
│ Send 1KB over 1 Gbps network           │ ~10 μs            │
│ SSD random read                         │ ~16 μs            │
│ Read 1MB sequentially from memory       │ ~250 μs           │
│ Round trip within same datacenter       │ ~500 μs           │
│ Read 1MB sequentially from SSD          │ ~1 ms             │
│ HDD disk seek                           │ ~10 ms            │
│ Read 1MB sequentially from HDD          │ ~20 ms            │
│ Send packet CA → Netherlands → CA       │ ~150 ms           │
└─────────────────────────────────────────┴───────────────────┘
  1,000 ns = 1 μs  │  1,000 μs = 1 ms  │  1,000 ms = 1 s
```

**Key takeaways:** Memory nhanh hơn SSD ~100x → dùng Redis. SSD nhanh hơn HDD ~100x → SSD cho hot data. Network round trip ~0.5ms → giảm inter-service calls. Cross-continent ~150ms → CDN.

---

### Q: Power of 2 table và common data sizes? 🟢 [Junior]

**A:**

```
2^10 = 1 KB (Thousand)     │   1 char (ASCII) = 1 byte
2^20 = 1 MB (Million)      │   1 UUID = 16 bytes
2^30 = 1 GB (Billion)      │   1 tweet ≈ 300 bytes (with metadata)
2^40 = 1 TB (Trillion)     │   1 small JSON ≈ 1 KB
2^50 = 1 PB (Quadrillion)  │   1 image (compressed) ≈ 200KB-2MB
                            │   1 video (1min, 720p) ≈ 50-100MB
```

---

### Q: Các công thức estimation thường dùng? 🟡 [Mid]

**A:**

```
1. QPS = DAU × (avg queries per user per day) / 86,400
   Peak QPS = QPS × 2~3
   (86,400 ≈ 100K cho dễ tính nhẩm)

2. Storage/day = Daily active writes × avg size per write
   Storage/year = Storage/day × 365

3. Bandwidth = QPS × avg request/response size (bytes/sec)

4. Servers needed = Peak QPS / QPS per server
   (1 web server ≈ 500-1000 QPS simple, 100-500 QPS complex)

5. Cache memory = Daily reads × avg response size × 0.20
   (Pareto: cache 20% data phục vụ 80% reads)
```

---

### Q: Ví dụ estimation cho Chat System (200M DAU) và URL Shortener (100M DAU)? 🟡 [Mid]

**A:**

**Chat System (200M DAU, 40 messages/user/day):**

```
QPS     = 200M × 40 / 100K ≈ 80K QPS → Peak ≈ 240K QPS
Storage = 8B messages × 500 bytes = 4 TB/day → 1.5 PB/year
         With 3x replication: ~4.5 PB/year
Bandwidth: Incoming 80K × 500B = 40 MB/s
           Outgoing (5:1 read ratio) = 200 MB/s
Cache   = 4TB × 0.2 = 800 GB → ~12 Redis nodes (64GB each)
```

**URL Shortener (100M DAU, read:write = 100:1):**

```
Write QPS = 100M / 10 users/write / 100K ≈ 100 QPS
Read QPS  = 10K QPS → Peak 30K QPS
Storage   = 10M URLs/day × 500 bytes = 5 GB/day → 1.8 TB/year
URL length: 18B URLs in 5 years → Base62^7 = 3.5T > 18B ✓ (7 chars đủ)
Cache     = 864M daily reads × 0.2 × 500B ≈ 86 GB → 2 Redis nodes
```

---

## 3. Scalability Concepts

### Q: Horizontal vs Vertical Scaling? Stateless vs Stateful? 🟢 [Junior]

**A:**

```
Vertical (Scale Up)                 Horizontal (Scale Out)
┌─────────────────────┐             ┌──────┐ ┌──────┐ ┌──────┐
│    BIG SERVER       │             │Srv 1 │ │Srv 2 │ │Srv 3 │
│  64 CPU, 512GB RAM  │             └──────┘ └──────┘ └──────┘
└─────────────────────┘             Add more machines
  Upgrade 1 machine
```

| Tiêu chí | Vertical | Horizontal |
|----------|----------|------------|
| **Giới hạn** | Hardware ceiling | Gần như vô hạn |
| **Downtime** | Cần restart | Rolling update, no downtime |
| **Complexity** | Đơn giản | Load balancing, data distribution |
| **Cost** | Đắt exponentially | Tăng linearly |
| **SPOF** | Có | Không |

**Stateless vs Stateful:** Stateless services không lưu state trong server memory → bất kỳ server nào cũng xử lý được request → dễ scale horizontal. **Nguyên tắc:** Move state ra external store (Redis, DB), giữ app servers stateless.

---

### Q: Load Balancing strategies và Database Scaling? 🟡 [Mid]

**A:**

**Load Balancing:**

| Strategy | Cách hoạt động | Use case |
|----------|---------------|----------|
| **Round Robin** | Lần lượt từng server | Servers đồng đều |
| **Weighted Round Robin** | Server mạnh nhận nhiều hơn | Servers không đồng đều |
| **Least Connections** | Server ít connection nhất | Long-lived connections |
| **IP Hash** | Cùng IP → cùng server | Session affinity |
| **Consistent Hashing** | Minimize redistribution | Distributed cache |

**Database Scaling:**

```
1. Read Replicas:
   Writes ──▶ Primary ──replication──▶ Replica 1, 2, 3 ◀── Reads
   Khi nào: Read-heavy (read:write > 10:1)
   Tradeoff: Eventual consistency (replication lag)

2. Sharding (Horizontal Partitioning):
   user_id % 4 == 0 → Shard 0 | == 1 → Shard 1 | ...
   Khi nào: Single DB không chứa hết data / write throughput cao
   Challenges: Cross-shard queries, resharding, hotspot

3. Vertical Partitioning:
   Split columns: hot data (fast SSD) vs cold data (standard storage)
```

---

### Q: Caching layers và CDN? Message Queue cho async? 🟡 [Mid]

**A:**

**Caching Layers (từ gần user → xa user):**
① Browser Cache → ② CDN → ③ API Gateway Cache → ④ Application Cache (Redis) → ⑤ Database Cache → ⑥ OS Page Cache

**Caching Strategies:**

| Strategy | Mô tả | Use case |
|----------|--------|----------|
| **Cache-Aside** | App đọc cache, miss thì đọc DB rồi populate | Most common |
| **Write-Through** | Write cả cache + DB đồng thời | Strong consistency |
| **Write-Behind** | Write cache trước, async write DB | High write throughput |

**CDN:** Mạng edge servers cache static content gần user. User (VN) → CDN Edge (SG) ~20ms thay vì → Origin (US) ~200ms.

**Message Queue** - Tách producer/consumer, xử lý bất đồng bộ:

```
Sync:  User ──▶ API ──▶ Send Email (3s) ──▶ Response  → User chờ 3 giây
Async: User ──▶ API ──▶ Queue ──▶ Response (instant)
                          └──▶ Worker ──▶ Send Email   → User nhận <100ms
```

Dùng khi: tác vụ tốn thời gian, spike traffic (absorb burst), decouple services, retry logic, fan-out.

---

## 4. Availability & Reliability

### Q: SLA/SLO/SLI và Availability Nines Table? 🟢 [Junior]

**A:**

```
SLI = Metric đo lường thực tế     ("P99 latency = 45ms")
SLO = Target nội bộ team đặt      ("P99 phải < 100ms")
SLA = Hợp đồng với khách hàng     ("Uptime 99.9%, vi phạm → đền bù")
Quan hệ: SLI measures → SLO targets → SLA promises
```

**Availability Nines Table:**

| Availability | Downtime/Year | Downtime/Month | Ví dụ |
|-------------|--------------|----------------|-------|
| 99% (2 9s) | 3.65 days | 7.31 hours | Internal tools |
| 99.9% (3 9s) | 8.76 hours | 43.83 min | Hầu hết SaaS |
| 99.99% (4 9s) | 52.6 min | 4.38 min | Payment, trading |
| 99.999% (5 9s) | 5.26 min | 26.3 sec | DNS, cloud core |

**Công thức:**

```
Serial:   A_total = A₁ × A₂            → 99.9% × 99.9% = 99.8%  (tệ hơn!)
Parallel: A_total = 1 - (1-A₁)(1-A₂)   → 1 - 0.001² = 99.9999% (tốt hơn!)
```

Đây là lý do **redundancy** quan trọng: thêm 1 component song song tăng availability đáng kể.

---

### Q: Active-Active vs Active-Passive? RPO vs RTO? 🟡 [Mid]

**A:**

```
Active-Passive:                     Active-Active:
  Active ──heartbeat──▶ Passive       Active1 ◀──sync──▶ Active2
  Khi Active die → Passive promote    Cả hai serve traffic
  Failover: seconds-minutes           Failover: near-zero
  Simple, 50% resource wasted         Complex, 100% utilized
  Use: Database primary               Use: Stateless web servers
```

**RPO & RTO (Disaster Recovery):**

```
  ──────────────────────────────────────▶ Time
  │                  │                  │
  Last backup        Disaster           Recovery complete
  │◀──── RPO ──────▶│◀───── RTO ─────▶│
     (Data Loss)         (Downtime)
```

| Metric | Định nghĩa | Example |
|--------|-----------|---------|
| **RPO** | Lượng data tối đa có thể mất | RPO=1h → backup mỗi giờ |
| **RTO** | Thời gian tối đa để khôi phục | RTO=30min → recovery trong 30min |

RPO thấp → cần sync replication (đắt). RTO thấp → cần hot standby (đắt). Balance theo business criticality.

---

## 5. Common Building Blocks

### Q: 10 building blocks thường dùng trong System Design - What, When, How to discuss? 🟡 [Mid]

**A:**

| # | Block | What | When to use | Key discussion points |
|---|-------|------|-------------|----------------------|
| 1 | **Load Balancer** | Phân phối traffic | >1 server instance | L4 (IP/port) vs L7 (URL/header), algorithms |
| 2 | **API Gateway** | Unified entry point | Microservices | Routing, auth, rate limiting, BFF pattern |
| 3 | **CDN** | Edge cache static content | Global users, media | Push vs Pull, TTL, cache invalidation |
| 4 | **Cache (Redis)** | In-memory fast reads | Hot data, sessions | Strategies (cache-aside, write-through), eviction (LRU), stampede |
| 5 | **Message Queue** | Async message passing | Decouple, async processing | Kafka (streaming) vs RabbitMQ (task queue), delivery guarantees |
| 6 | **Database** | Persistent storage | Always needed | SQL vs NoSQL selection (see §6) |
| 7 | **Object Storage (S3)** | File/blob storage | Images, videos, backups | 11-nines durability, storage tiers, pre-signed URLs |
| 8 | **Search Engine (ES)** | Full-text search | Text search, log analytics | Inverted index, near real-time, ELK stack |
| 9 | **Notification Service** | Push/email/SMS | User engagement, alerts | APNs/FCM, priority queue, rate limiting per user |
| 10 | **Rate Limiter** | Limit requests | Abuse protection | Token Bucket, Sliding Window, Redis counter, HTTP 429 |

**Interview approach cho mỗi block:** Nêu rõ (1) tại sao cần, (2) alternatives và tradeoff, (3) failure handling.

---

## 6. Database Selection Framework

### Q: Decision tree chọn SQL vs NoSQL? 🟡 [Mid]

**A:**

```
                    ┌──────────────────────┐
                    │ Cần ACID transaction │
                    │ (financial, order)?  │
                    └──────────┬───────────┘
                         YES ──┤── NO
                          │         │
                    ┌─────▼─────┐   ▼
                    │   SQL     │  Complex relationships?
                    │ (PG/MySQL)│  YES → SQL or Graph DB
                    └───────────┘  NO ──▶ Schema thay đổi nhiều?
                                         YES → Document (MongoDB)
                                         NO  → Write-heavy time-series?
                                               YES → Wide-Column (Cassandra)
                                               NO  → Simple KV (Redis/DDB)
```

**Khi nào SQL:** ACID cần thiết, complex queries (JOIN, GROUP BY), data relationships phức tạp, schema ổn định, strong consistency bắt buộc.

**Khi nào NoSQL:** Flexible/evolving schema, horizontal scaling, simple access patterns (key→value), denormalized data OK, eventual consistency chấp nhận được.

---

## 7. Communication Protocol Selection

### Q: REST vs gRPC vs GraphQL vs WebSocket - Decision matrix? 🟡 [Mid]

**A:**

| Criteria | REST | gRPC | GraphQL | WebSocket |
|----------|------|------|---------|-----------|
| **Protocol** | HTTP/1.1 | HTTP/2 | HTTP/1.1 | TCP (upgrade) |
| **Format** | JSON (text) | Protobuf (binary) | JSON | Any |
| **Speed** | Good | Excellent (~10x) | Good | Excellent |
| **Streaming** | No | Bidirectional | Subscription | Bidirectional |
| **Browser** | ✅ Native | ❌ Need grpc-web | ✅ Native | ✅ Native |
| **Best for** | Public API | Internal services | Complex frontend | Real-time |

**Quick decision:**
- Public-facing API → **REST** (universal)
- Internal service-to-service → **gRPC** (fast, typed)
- Complex frontend data needs → **GraphQL** (flexible queries)
- Real-time bidirectional → **WebSocket** (persistent)

**Sync vs Async:** Sync cho user-facing cần response ngay (read data, login). Async (via message queue) cho background tasks (notification, analytics, file processing). Async giúp loose coupling, failure isolation, traffic absorb.

---

## 8. Common Tradeoffs

### Q: Trình bày các tradeoff kinh điển trong System Design? 🔴 [Senior]

**A:**

Khả năng **articulate tradeoffs** là signal quan trọng nhất. Không có giải pháp hoàn hảo, chỉ có giải pháp phù hợp.

---

**1. Consistency vs Availability** (CAP Theorem bản chất)

```
Strong Consistency ◀────────▶ High Availability
Banking, inventory              Social feed, DNS
Reject request if unsure        Always respond, data may be stale
```

**2. Latency vs Throughput**

```
Optimize latency → limit concurrent → lower throughput (trading system)
Optimize throughput → batch/queue → higher latency (data pipeline)
```

**3. SQL vs NoSQL**

| SQL thắng | NoSQL thắng |
|-----------|-------------|
| Consistency, complex queries, ACID | Scalability, flexibility, throughput |

**4. Push vs Pull Model**

```
Push: Server ──▶ Client  │ Real-time, efficient │ Complex scaling
Pull: Client ──▶ Server  │ Simple, client controls │ Wasted requests, delay
```

**5. Long Polling vs WebSocket vs SSE**

```
Long Polling: Hold connection until data → Compatible, overhead mỗi lần reconnect
WebSocket:    Persistent bidirectional   → Real-time, phức tạp connection mgmt
SSE:          Persistent server→client   → Simple, chỉ 1 chiều
```

**6. Monolith vs Microservices**

| | Monolith | Microservices |
|--|----------|---------------|
| Team < 10, MVP | ✅ Fast, simple | ❌ Over-engineering |
| Team > 50, mature | ❌ Coupling, conflicts | ✅ Independent teams/deploy |
| Debugging | Simple stack trace | Distributed tracing needed |

**Advice:** Start monolith → extract microservices khi cần. Đừng microservices premature.

**7. Normalization vs Denormalization**

```
Normalized:   No duplication, JOINs needed → Write-heavy, OLTP
Denormalized: Duplicated data, no JOINs   → Read-heavy, OLAP, caching
```

**8. Cache vs No Cache**

```
Cache:    Fast reads, reduce DB load │ Staleness, invalidation complexity
No Cache: Always fresh, simpler     │ Higher latency, DB bottleneck
Rule: Nếu read > 10x write → Cache.
```

---

## 9. How to Draw Architecture Diagrams

### Q: Conventions vẽ diagram và cách present trong interview? 🟢 [Junior]

**A:**

**Component Notation:**

```
┌──────────┐  = Service          ╔══════════╗ = Database
│  Service  │                     ║ Database ║
└──────────┘                     ╚══════════╝

┌ ─ ─ ─ ─ ┐  = External          ◇──────◇   = Load Balancer
 External                          
└ ─ ─ ─ ─ ┘
```

**Data Flow - LUÔN label connections:**

```
Good: Client ──HTTP/JSON──▶ API Gateway ──gRPC/Protobuf──▶ Service
Bad:  Client ──────────────▶ API Gateway ──────────────────▶ Service
```

**Layout:** Trái→Phải (client → server → storage) hoặc Trên→Dưới (client → infra → data).

**Cách present:**

```
1. Start từ user journey: "User opens app and sends message..."
2. Trace request path: "Request hits LB → API Gateway → Service..."
3. Explain mỗi component's role + WHY
4. Highlight async flows: "Event pushed to Kafka, worker consumes..."
5. Address data flows: "Check Redis first, cache miss → read replica..."
```

| Do | Don't |
|----|-------|
| Vẽ component trước, connect sau | Vẽ loạn xạ |
| Label tất cả connections | Mũi tên trống |
| Giải thích WHY mỗi component | Chỉ liệt kê |
| Start simple, add complexity dần | Vẽ hết ngay từ đầu |

---

## 10. Anti-Patterns in System Design Interviews

### Q: Top 10 sai lầm phổ biến nhất? 🟢 [Junior]

**A:**

```
╔══════════════════════════════════════════════════════════════╗
║            SYSTEM DESIGN ANTI-PATTERNS                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  ❌ 1. JUMPING TO SOLUTION                                   ║
║     Chưa clarify requirements đã vẽ diagram                  ║
║     → Luôn dành 5 phút clarify scope                         ║
║                                                              ║
║  ❌ 2. OVER-ENGINEERING                                      ║
║     Kafka + Cassandra + K8s cho 100 users                    ║
║     → Scale phải match requirements                          ║
║                                                              ║
║  ❌ 3. NOT DISCUSSING TRADEOFFS                              ║
║     "Dùng Redis" mà không giải thích tại sao                 ║
║     → Mỗi quyết định phải có reasoning                       ║
║                                                              ║
║  ❌ 4. SINGLE POINT OF FAILURE                               ║
║     1 DB, 1 server, 0 redundancy                             ║
║     → Critical components cần backup                         ║
║                                                              ║
║  ❌ 5. IGNORING MONITORING/OBSERVABILITY                     ║
║     Design xong không mention metrics/logging                 ║
║     → Luôn đề cập monitoring + alerting                       ║
║                                                              ║
║  ❌ 6. BEING TOO SILENT                                      ║
║     Nghĩ trong đầu, không nói ra                             ║
║     → Think out loud, interviewer cần nghe process            ║
║                                                              ║
║  ❌ 7. GOING TOO DEEP TOO EARLY                              ║
║     20 phút cho 1 component, bỏ qua big picture              ║
║     → High-level trước, deep dive khi được hỏi               ║
║                                                              ║
║  ❌ 8. IGNORING NON-FUNCTIONAL REQUIREMENTS                  ║
║     Chỉ focus features, quên availability/latency             ║
║     → NFRs quyết định architecture                            ║
║                                                              ║
║  ❌ 9. NOT KNOWING THE NUMBERS                               ║
║     Không estimate được QPS, storage                          ║
║     → Thuộc latency numbers + estimation formulas             ║
║                                                              ║
║  ❌ 10. GENERIC ANSWERS (copy từ YouTube)                    ║
║     Trả lời không adapt theo specific requirements            ║
║     → Hiểu concepts, apply theo context cụ thể               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

### Q: SPOF là gì và cách fix? 🟡 [Mid]

**A:**

**SPOF (Single Point of Failure)** - Component nào fail → cả hệ thống fail:

| SPOF | Fix |
|------|-----|
| 1 Load Balancer | LB pair (active-passive) + DNS failover |
| 1 App Server | Multiple instances behind LB |
| 1 Database | Primary + Replicas + Auto-failover |
| 1 Redis | Redis Cluster / Sentinel |
| 1 Availability Zone | Multi-AZ deployment |
| 1 Region | Multi-region (nếu budget cho phép) |

**Trong interview:** Sau khi vẽ diagram, tự hỏi "nếu X fail thì sao?" cho mỗi component. Đây thể hiện production thinking.

---

## Interview Tips by Company

### Q: Các công ty lớn focus gì trong System Design? 🟡 [Mid]

**A:**

```
┌──────────┬──────────────────────────────────────────────────┐
│  GRAB    │ Geo-distributed (multi-region SEA)               │
│          │ Real-time (ride matching, ETA)                    │
│          │ High availability, payment/financial systems      │
│          │ Event-driven (Kafka heavy), practical tradeoffs   │
├──────────┼──────────────────────────────────────────────────┤
│  GOOGLE  │ Billions-scale, distributed systems fundamentals  │
│          │ Data-intensive, infrastructure-level thinking     │
│          │ Clean API design, accurate estimation numbers     │
├──────────┼──────────────────────────────────────────────────┤
│ MICROSOFT│ Cloud architecture (Azure patterns)               │
│          │ Enterprise integration, security + compliance     │
│          │ System evolution (v1→v2→v3), clear communication  │
├──────────┼──────────────────────────────────────────────────┤
│  META    │ Social graph, news feed/timeline at scale         │
│          │ Real-time messaging, data pipeline + analytics    │
├──────────┼──────────────────────────────────────────────────┤
│ SHOPEE/  │ E-commerce: inventory, order, payment             │
│ LAZADA   │ Flash sale (high concurrency), search/recommend   │
│          │ Logistics tracking, multi-tenant architecture     │
└──────────┴──────────────────────────────────────────────────┘
```

---

### Q: Pre-interview checklist cuối cùng? 🟢 [Junior]

**A:**

```
KNOWLEDGE CHECKLIST:                                    Done?
├── 5-step framework (Requirements → Wrap-up)            [ ]
├── Latency numbers + Power of 2 table                   [ ]
├── Estimate QPS, storage, bandwidth                     [ ]
├── 10 building blocks (what + when + tradeoffs)         [ ]
├── Database selection framework                         [ ]
├── Communication protocols + decision matrix            [ ]
├── 8+ common tradeoffs                                  [ ]
├── Architecture diagram conventions                     [ ]
└── 10 anti-patterns to avoid                            [ ]

PRACTICE PROBLEMS (must-do):
├── URL Shortener (easy)        ├── News Feed (medium-hard)
├── Rate Limiter (medium)       ├── Web Crawler (hard)
├── Chat System (medium)        ├── YouTube/Netflix (hard)
├── Notification System (medium)└── Google Maps/Ride-sharing (hard)

FINAL REMINDERS:
├── Think out loud - đừng im lặng
├── Ask clarifying questions - đừng assume
├── Drive the conversation - đừng chờ interviewer dẫn
├── Discuss tradeoffs - đừng chỉ nói "dùng X"
└── Stay calm - 45 phút là đủ nếu có structure
```

---

## Quick Reference Card

```
╔═══════════════════════════════════════════════════════════════╗
║            SYSTEM DESIGN INTERVIEW CHEAT SHEET               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  TIME: 5→5→10→15→5 (Requirements→Estimate→HLD→Deep→Wrap)     ║
║                                                               ║
║  NUMBERS:                                                     ║
║  QPS = DAU × queries/user / 86400  │  Peak = QPS × 2~3       ║
║  Storage/day = writes × avg_size   │  Cache = 20% daily data  ║
║                                                               ║
║  AVAILABILITY:                                                ║
║  99.9% = 8.76h/year  │  Serial: A₁×A₂  │  Parallel: 1-(1-A)²║
║                                                               ║
║  DB: ACID→SQL  Flexible→Document  KV→Redis  TimeSeries→Cass  ║
║  PROTOCOL: Public→REST  Internal→gRPC  Frontend→GraphQL      ║
║  ALWAYS: Tradeoffs • Monitoring • Failure handling            ║
╚═══════════════════════════════════════════════════════════════╝
```

---

*Difficulty: 🟢 Basic (Junior) | 🟡 Intermediate (Mid-level) | 🔴 Advanced (Senior)*

*References: System Design Interview (Alex Xu), Designing Data-Intensive Applications (Martin Kleppmann), Google SRE Book*
