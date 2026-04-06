# System Design Interview Framework - Deep Theory

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**FAANG-style interview (thực tế):** Một kỹ sư mid-level phỏng vấn vào Shopee bị reject vì dành 25 phút đầu vẽ database schema mà không clarify requirements. Interviewer đã dừng và hỏi: "Hệ thống cần hỗ trợ bao nhiêu QPS?" — ứng viên không biết. Kết quả: architecture không phù hợp với scale, không có thời gian deep dive vào bottlenecks.

**Bài học:** System design interview là bài kiểm tra _tư duy có cấu trúc_, không phải kiểm tra kiến thức. Framework 5 bước cho phép phân bổ 45 phút đúng nơi, đúng lúc.

## What & Why / Cái Gì & Tại Sao

**Analogy:** System design interview giống kiến trúc sư xây tòa nhà: bước đầu tiên không phải vẽ bản thiết kế — mà là hỏi chủ đầu tư "bao nhiêu người sẽ ở? Ngân sách là bao nhiêu? Địa chấn mức mấy?" Requirements trước, architecture sau.

**Why structure matters:** Không có framework, ứng viên thường sa vào chi tiết quá sớm (database schema, API endpoint) mà quên clarify scale — dẫn đến architecture sai từ đầu. Framework giúp interviewer thấy rõ _tư duy hệ thống_, không chỉ kiến thức kỹ thuật.

## Concept Map / Bản Đồ Khái Niệm

```
[System Design Interview — 45 min]
        │
        ├── Step 1 (5min): Requirements → FR (what) + NFR (how well)
        │     └── Output: scope + scale constraints
        │
        ├── Step 2 (5min): Estimation → QPS, storage, bandwidth
        │     └── Output: choose SQL vs NoSQL, cache size, server count
        │
        ├── Step 3 (10min): High-Level Design → API + data model + diagram
        │     └── Output: interviewer sees breadth of knowledge
        │
        ├── Step 4 (15min): Deep Dive → bottleneck + tradeoffs
        │     └── Output: shows depth + production experience
        │
        └── Step 5 (5min): Wrap-up → monitoring + failure modes + next steps
              └── Output: shows production-ready thinking
```

---

## Overview / Tổng Quan

System Design Interview Framework là **meta-skill** — không phải kiến thức kỹ thuật riêng lẻ mà là cách **tổ chức tư duy** để giải quyết bài toán thiết kế hệ thống trong 45 phút. File này bao gồm 7 khái niệm cốt lõi, từ quy trình phỏng vấn đến kỹ năng đánh giá tradeoff:

| #   | Concept                     | Role                               | Interview Weight                        |
| --- | --------------------------- | ---------------------------------- | --------------------------------------- |
| 1   | 5-Step Framework            | Quy trình 45-phút                  | ⭐⭐⭐⭐⭐ — mọi interview đều dùng     |
| 2   | Requirements Analysis       | FR/NFR decomposition               | ⭐⭐⭐⭐⭐ — bước quan trọng nhất       |
| 3   | Back-of-Envelope Estimation | QPS, storage, bandwidth            | ⭐⭐⭐⭐ — numbers justify architecture |
| 4   | Scalability Patterns        | Horizontal/vertical, LB, sharding  | ⭐⭐⭐⭐ — core knowledge               |
| 5   | Availability & Reliability  | SLA, failover, RPO/RTO             | ⭐⭐⭐⭐ — production thinking          |
| 6   | Building Blocks & Selection | 10 components + DB/protocol choice | ⭐⭐⭐⭐ — toolkit knowledge            |
| 7   | Tradeoff Reasoning          | CAP, latency/throughput, push/pull | ⭐⭐⭐⭐⭐ — strongest hiring signal    |

**Mối quan hệ:** Framework (1) cung cấp skeleton → Requirements (2) xác định scope → Estimation (3) biến scope thành numbers → Scalability (4) + Availability (5) + Building Blocks (6) là tools để thiết kế → Tradeoff Reasoning (7) là tư duy xuyên suốt mọi quyết định.

---

## Core Concepts — Phase 2 Deep Content

### Concept 1: 5-Step Framework

🧠 **Memory Hook:** "**5-5-10-15-5** — năm bước, tổng 45 phút. Bỏ bước 1 là phí 40 phút còn lại."

❓ **Why exists:**

- **Level 1:** Tại sao cần framework? → Vì không có cấu trúc, ứng viên sẽ nhảy vào vẽ database schema mà chưa hiểu bài toán.
- **Level 2:** Tại sao 5 bước cụ thể này? → Vì chúng mirror cách engineering team thực sự approach project: scope → estimate → design → build → operate.
- **Level 3:** Tại sao phân bổ thời gian 5-5-10-15-5? → Vì Deep Dive (15 min) là nơi interviewer đánh giá depth — phải dành nhiều thời gian nhất cho nó.

**Layer 1 — Analogia đơn giản:**
Giống xây nhà: trước tiên hỏi chủ nhà bao nhiêu người ở, ngân sách bao nhiêu (Requirements) → tính vật liệu cần bao nhiêu (Estimation) → vẽ bản thiết kế tổng (HLD) → đi sâu vào nền móng và hệ thống điện (Deep Dive) → kiểm tra an toàn (Wrap-up).

**Layer 2 — How it works:**

```
┌─────────────────────────────────────────────────────────┐
│  Step 1 (5min)     │ Clarify scope → output: FR + NFR   │
│  Step 2 (5min)     │ Numbers → output: QPS + storage    │
│  Step 3 (10min)    │ API + Data + Diagram → breadth     │
│  Step 4 (15min)    │ 2-3 components → depth + tradeoff  │
│  Step 5 (5min)     │ Bottleneck + monitor → production  │
└─────────────────────────────────────────────────────────┘
Interviewer evaluates:
  Step 1-2: Communication + analytical thinking
  Step 3:   Breadth of knowledge
  Step 4:   Depth + experience
  Step 5:   Production-ready mindset
```

**Layer 3 — Edge cases & tradeoffs:**

- Nếu interviewer nói "skip estimation" → vẫn mentally estimate nhưng chuyển sang HLD nhanh.
- Nếu chỉ có 30 phút (phone screen) → compress thành 3-5-10-10-2.
- Nếu interviewer muốn deep dive sớm → adapt, không cứng nhắc theo framework.

| Sai lầm                      | Tại sao sai                            | Đúng là                                    |
| ---------------------------- | -------------------------------------- | ------------------------------------------ |
| Nhảy thẳng vào vẽ diagram    | Thiết kế cho bài toán sai              | Luôn clarify requirements 5 phút đầu       |
| Dành 20 phút cho 1 component | Bỏ lỡ big picture                      | High-level trước, deep dive 2-3 components |
| Im lặng khi nghĩ             | Interviewer không thấy thought process | Think out loud — verbalize reasoning       |

🎯 **Interview Pattern:**

- **Trigger:** "Design a [system]..." hoặc "How would you build..."
- **Concept:** 5-Step Framework
- **Opening:** "I'd like to start by clarifying requirements before jumping into design. Can I ask a few questions about the scope and scale?"

🔑 **Knowledge Chain:**

- 📚 Prereq: Basic understanding of web architecture
- ➡️ Enables: [Classic Problems](./02-classic-problems.md), [Advanced Problems](./03-advanced-problems.md)

---

### Concept 2: Requirements Analysis (FR/NFR)

🧠 **Memory Hook:** "**FR = WHAT the system does. NFR = HOW WELL it does it.** Thiếu NFR là thiết kế đúng feature nhưng sai scale."

❓ **Why exists:**

- **Level 1:** Tại sao phải phân FR/NFR? → Vì cùng feature "send message" nhưng 1K users vs 1B users → architecture hoàn toàn khác.
- **Level 2:** Tại sao NFR quyết định architecture? → Vì consistency requirement chọn SQL vs NoSQL, latency requirement chọn cache layer, availability requirement chọn redundancy level.

**Layer 1 — Analogia đơn giản:**
Đặt hàng pizza: FR = "pizza phải có cheese, pepperoni" (what). NFR = "giao trong 30 phút, nóng hổi, giá dưới 200K" (how well). Nếu chỉ nói "pizza ngon" mà không nói thời gian giao → nhà bếp không biết cần ship nhanh hay chậm.

**Layer 2 — How it works:**

```
┌─────────────────────────────────────────┐
│  FR Extraction (WHO-WHAT-INPUT-SCOPE):  │
│  "Design a chat system" →               │
│  ├── WHO: 1:1 + group (max 500)?        │
│  ├── WHAT: text? images? video call?    │
│  ├── INPUT: mobile + web?               │
│  └── SCOPE: online status? read receipt?│
├─────────────────────────────────────────┤
│  NFR Extraction (SCALE-PERF-AVAIL):     │
│  ├── DAU: 200M → QPS = 200M×40/86K     │
│  ├── Latency: P99 < 200ms              │
│  ├── Availability: 99.99%              │
│  └── Consistency: Eventual OK for feed  │
└─────────────────────────────────────────┘
```

**Layer 3 — Edge cases & tradeoffs:**

- Group chat vs 1:1 → entirely different fan-out architecture.
- E2E encryption requirement → cannot index/search messages server-side.
- Multi-region → eventual consistency mandatory → message ordering becomes hard.

| Sai lầm                    | Tại sao sai                         | Đúng là                                |
| -------------------------- | ----------------------------------- | -------------------------------------- |
| Không hỏi scale            | Architecture sai từ đầu             | Luôn hỏi DAU, read/write ratio         |
| Assume everything in-scope | Hết thời gian trước khi deep dive   | Giới hạn top 3-5 core features         |
| Quên NFR                   | Feature đúng nhưng architecture sai | Hỏi latency, availability, consistency |

🎯 **Interview Pattern:**

- **Trigger:** Khi interviewer đưa đề bài — trước khi vẽ bất cứ gì
- **Concept:** FR/NFR decomposition
- **Opening:** "Before I start designing, let me clarify the functional and non-functional requirements. What's the expected DAU and read/write ratio?"

🔑 **Knowledge Chain:**

- 📚 Prereq: Domain knowledge (e-commerce, chat, social)
- ➡️ Enables: Estimation (Concept 3), chọn architecture phù hợp

---

### Concept 3: Back-of-Envelope Estimation

🧠 **Memory Hook:** "**QPS = DAU × actions / 86,400.** Nhớ 86,400 ≈ 100K cho dễ tính nhẩm. Sai 2x vẫn OK — đúng order of magnitude là đủ."

❓ **Why exists:**

- **Level 1:** Tại sao cần estimate? → Vì numbers quyết định architecture: 100 QPS dùng 1 server, 100K QPS cần sharding + cache + LB.
- **Level 2:** Tại sao chấp nhận approximate? → Vì ở interview stage, order of magnitude (100 vs 1K vs 100K) quan trọng hơn con số chính xác.

**Layer 1 — Analogia đơn giản:**
Mở quán cà phê: ước lượng bao nhiêu khách/ngày để biết cần bao nhiêu máy pha, bao nhiêu nhân viên, kho chứa bao nhiêu cà phê. Sai 20% không sao, nhưng sai 100x (tưởng 100 khách nhưng thực tế 10,000) → thảm họa.

**Layer 2 — Formulas & numbers:**

```
┌─────────────────────────────────────────────┐
│  Key Formulas:                               │
│  QPS       = DAU × avg_actions / 86,400     │
│  Peak QPS  = QPS × 2~3                      │
│  Storage   = daily_writes × avg_size × 365  │
│  Bandwidth = QPS × avg_response_size        │
│  Cache     = daily_reads × avg_size × 0.20  │
│  Servers   = Peak_QPS / QPS_per_server      │
├─────────────────────────────────────────────┤
│  Latency Reference:                          │
│  RAM ~100ns │ SSD ~16μs │ Network ~500μs    │
│  Rule: RAM > SSD > Network > HDD            │
│  → Cache hot data in RAM (Redis)            │
└─────────────────────────────────────────────┘
```

**Layer 3 — Edge cases & tradeoffs:**

- Overestimate → over-provisioned, waste money. Underestimate → system crash under load.
- Flash sale/viral event → Peak QPS có thể 10-100x normal, not just 2-3x.
- Storage estimate phải tính replication factor (thường 3x).

| Sai lầm           | Tại sao sai                          | Đúng là                               |
| ----------------- | ------------------------------------ | ------------------------------------- |
| Bỏ qua estimation | Không biết cần cache hay không       | QPS > 10K → cần cache layer           |
| Chính xác quá mức | Mất thời gian, interviewer không cần | Order of magnitude đủ — round numbers |
| Quên peak factor  | Hệ thống crash khi spike             | Peak = 2-3x average, event = 10-100x  |

🎯 **Interview Pattern:**

- **Trigger:** Sau khi clarify requirements, trước HLD
- **Concept:** Back-of-envelope estimation
- **Opening:** "Let me do a quick estimation. With 200M DAU and 40 messages per user per day, that's roughly 80K QPS average, 240K peak."

🔑 **Knowledge Chain:**

- 📚 Prereq: Requirements (Concept 2) — cần DAU + actions per user
- ➡️ Enables: Scalability decisions (Concept 4), cache sizing, server count

---

### Concept 4: Scalability Patterns

🧠 **Memory Hook:** "**Stateless app + External state = Infinite horizontal scaling.** Move state ra Redis/DB, giữ app servers stateless."

❓ **Why exists:**

- **Level 1:** Tại sao cần scale? → Vì single server có hardware ceiling — không thể upgrade vô hạn.
- **Level 2:** Tại sao horizontal over vertical? → Vì vertical có ceiling (max CPU/RAM), horizontal thì thêm machine linearly.

**Layer 1 — Analogia đơn giản:**
Nhà hàng đông khách: vertical = mua bếp lớn hơn (giới hạn vật lý). Horizontal = mở thêm chi nhánh (vô hạn). Nhưng mở chi nhánh cần "recipe book chung" (shared state) để món ăn giống nhau ở mọi nơi.

**Layer 2 — How it works:**

```
┌─────────────────────────────────────────────┐
│  Vertical: 1 server ──upgrade──▶ bigger     │
│  ├── Pro: Simple, no distribution issues    │
│  └── Con: Hardware ceiling, SPOF, expensive │
│                                              │
│  Horizontal: +server ──add──▶ fleet         │
│  ├── Requires: Load Balancer (distribute)   │
│  ├── Requires: Stateless (any server OK)    │
│  └── Requires: Shared state (Redis/DB)      │
│                                              │
│  DB Scaling:                                 │
│  ├── Read Replicas (read:write > 10:1)      │
│  ├── Sharding (too big for 1 DB)            │
│  └── Vertical Partition (hot vs cold data)  │
└─────────────────────────────────────────────┘
```

**Layer 3 — Edge cases & tradeoffs:**

- Stateful WebSocket connections → need sticky sessions or connection registry.
- Sharding → cross-shard joins impossible, resharding is painful.
- Auto-scaling → cold start latency, cost optimization (scale-to-zero).

| Sai lầm                         | Tại sao sai                | Đúng là                                         |
| ------------------------------- | -------------------------- | ----------------------------------------------- |
| Vertical scaling cho production | Hardware ceiling + SPOF    | Horizontal + stateless cho production           |
| Store session in app server     | Không thể scale horizontal | Session → Redis/external store                  |
| Shard too early                 | Complexity premature       | Start single DB → read replicas → shard khi cần |

🎯 **Interview Pattern:**

- **Trigger:** "How would you scale this to 10x/100x?"
- **Concept:** Scalability Patterns
- **Opening:** "First, I'd ensure the application tier is stateless so we can scale horizontally. For the database, given the read-heavy workload, I'd start with read replicas."

🔑 **Knowledge Chain:**

- 📚 Prereq: Estimation (Concept 3) — cần biết QPS để chọn scaling strategy
- ➡️ Enables: [Distributed Patterns](./04-distributed-patterns.md), [Observability](./05-observability-and-scale.md)

---

### Concept 5: Availability & Reliability

🧠 **Memory Hook:** "**Serial = multiply (worse), Parallel = complement (better).** 99.9% × 99.9% = 99.8%. 1 - (0.001)² = 99.9999%. Redundancy = availability."

❓ **Why exists:**

- **Level 1:** Tại sao cần high availability? → Vì downtime = mất tiền. 99.9% → 8.76h/year downtime cho phép. Payment system cần 99.99%.
- **Level 2:** Tại sao parallel > serial? → Vì serial chuỗi bao nhiêu component availability giảm bấy nhiêu, parallel thì failure cần cả 2 cùng die.

**Layer 1 — Analogia đơn giản:**
Bóng đèn: 1 bóng đèn (serial) tắt → tối. 2 bóng đèn song song → cả 2 phải tắt mới tối. Thêm bóng đèn = thêm an toàn.

**Layer 2 — How it works:**

```
┌─────────────────────────────────────────────┐
│  Availability Math:                          │
│  Serial:   A = A₁ × A₂                     │
│  Parallel: A = 1 - (1-A₁)(1-A₂)            │
│                                              │
│  ┌───────────┐    ┌───────────┐             │
│  │ Active    │◀──▶│ Passive   │             │
│  │ (serve)   │    │ (standby) │             │
│  └───────────┘    └───────────┘             │
│  Failover: seconds~minutes                   │
│  vs                                          │
│  ┌───────────┐    ┌───────────┐             │
│  │ Active 1  │◀──▶│ Active 2  │             │
│  │ (serve)   │    │ (serve)   │             │
│  └───────────┘    └───────────┘             │
│  Failover: near-zero (already serving)       │
├─────────────────────────────────────────────┤
│  RPO = max data loss │ RTO = max downtime    │
│  RPO=0 → sync repl  │ RTO=0 → active-active │
└─────────────────────────────────────────────┘
```

**Layer 3 — Edge cases & tradeoffs:**

- RPO=0 (sync replication) → latency tăng vì mỗi write phải chờ replica confirm.
- Active-Active DB → conflict resolution complex (last-write-wins? vector clocks?).
- Multi-region failover → DNS TTL delay, split-brain risk.

| Sai lầm               | Tại sao sai                                | Đúng là                                   |
| --------------------- | ------------------------------------------ | ----------------------------------------- |
| Không đề cập failover | Interviewer thấy thiếu production thinking | Mỗi component phải có backup plan         |
| Chỉ 1 AZ              | AZ failure → toàn bộ down                  | Multi-AZ minimum cho production           |
| Nhầm SLA vs SLO       | SLA là hợp đồng, SLO là target nội bộ      | SLI measures → SLO targets → SLA promises |

🎯 **Interview Pattern:**

- **Trigger:** "What if this component fails?" hoặc "What's your availability target?"
- **Concept:** Availability & Reliability
- **Opening:** "For this payment system, we need 99.99% availability — that's only 52 minutes downtime per year. I'd use active-active deployment with synchronous replication for the payment database."

🔑 **Knowledge Chain:**

- 📚 Prereq: [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md) — CAP theorem
- ➡️ Enables: [Observability & Scale](./05-observability-and-scale.md), production-ready wrap-up

---

### Concept 6: Building Blocks & Selection

🧠 **Memory Hook:** "**10 blocks, mỗi block 3 câu: WHY needed, ALTERNATIVES + tradeoff, FAILURE handling.** Đừng chỉ nói 'dùng Redis' — nói TẠI SAO Redis."

❓ **Why exists:**

- **Level 1:** Tại sao cần biết building blocks? → Vì system design = combine đúng blocks cho đúng bài toán.
- **Level 2:** Tại sao phải biết selection criteria? → Vì interviewer muốn thấy reasoning, không phải memorization — "tại sao Kafka thay vì RabbitMQ?"

**Layer 1 — Analogia đơn giản:**
Như bộ LEGO: mỗi block có shape riêng (LB, Cache, Queue, DB...). Biết cách chọn block nào, lắp ở đâu, khi nào dùng → xây được mọi hệ thống. Dùng sai block → nhà sập.

**Layer 2 — Building Block Matrix:**

```
┌──────────────┬─────────────┬────────────────────────┐
│ Block        │ When to use │ Key tradeoff           │
├──────────────┼─────────────┼────────────────────────┤
│ Load Balancer│ >1 instance │ L4 (fast) vs L7 (smart)│
│ API Gateway  │ Microservices│ Centralize vs per-svc  │
│ CDN          │ Global users│ Push (eager) vs Pull   │
│ Cache (Redis)│ Hot data    │ Consistency vs speed   │
│ Message Queue│ Async/decouple│ Kafka vs RabbitMQ    │
│ Database     │ Always      │ SQL (ACID) vs NoSQL    │
│ Object Store │ Files/blobs │ Cost tiers (hot/cold)  │
│ Search Engine│ Text search │ Near-RT vs batch index │
│ Notification │ User alerts │ Priority vs rate limit │
│ Rate Limiter │ Protection  │ Token Bucket vs Window │
├──────────────┼─────────────┼────────────────────────┤
│ DB Selection │ Decision tree:                        │
│              │ ACID? → SQL                           │
│              │ Flexible schema? → Document (Mongo)   │
│              │ Time-series? → Cassandra              │
│              │ Simple KV? → Redis/DynamoDB           │
├──────────────┼─────────────┼────────────────────────┤
│ Protocol     │ Decision tree:                        │
│              │ Public API? → REST                    │
│              │ Internal svc? → gRPC                  │
│              │ Complex FE? → GraphQL                 │
│              │ Real-time? → WebSocket                │
└──────────────┴─────────────┴────────────────────────┘
```

**Layer 3 — Edge cases & tradeoffs:**

- Redis as cache vs Redis as primary store → completely different failure modes.
- Kafka ordering guarantee = per-partition only, not global.
- GraphQL N+1 query problem → need DataLoader batching.

| Sai lầm                       | Tại sao sai                            | Đúng là                                    |
| ----------------------------- | -------------------------------------- | ------------------------------------------ |
| "Dùng Redis" không giải thích | Interviewer muốn reasoning             | WHY Redis? Cache policy? Invalidation?     |
| Dùng Kafka cho mọi thứ        | Over-engineering cho simple task queue | Kafka = streaming, RabbitMQ = task queue   |
| Quên failure handling         | Mỗi block có failure mode riêng        | Mỗi block phải trả lời "nếu fail thì sao?" |

🎯 **Interview Pattern:**

- **Trigger:** Step 3 HLD khi chọn components
- **Concept:** Building Blocks & Selection
- **Opening:** "For the caching layer, I'd use Redis with cache-aside strategy because the read-to-write ratio is 100:1. For the message queue, Kafka because we need ordered event streaming, not just task distribution."

🔑 **Knowledge Chain:**

- 📚 Prereq: [Database Advanced](../03-database-advanced/01-sql-fundamentals.md), [Message Queues](../02-backend-knowledge/08-message-queues.md)
- ➡️ Enables: HLD step in every system design interview

---

### Concept 7: Tradeoff Reasoning

🧠 **Memory Hook:** "**Không có silver bullet. Mỗi quyết định là TRADEOFF.** Interviewer không nghe 'tôi chọn X' — họ nghe 'tôi chọn X VÌ..., tradeoff là..., mitigate bằng...'."

❓ **Why exists:**

- **Level 1:** Tại sao tradeoff là signal mạnh nhất? → Vì nó chứng minh engineer đã suy nghĩ sâu, hiểu implications, không chỉ copy architecture.
- **Level 2:** Tại sao mỗi quyết định đều có tradeoff? → Vì mọi optimization cho 1 dimension (latency) đều sacrifice dimension khác (cost, consistency, complexity).

**Layer 1 — Analogia đơn giản:**
Mua nhà: gần công ty (tiện) nhưng đắt (cost). Xa công ty (rẻ) nhưng mất thời gian đi lại (latency). Không có nhà vừa gần vừa rẻ vừa rộng — phải chọn và giải thích tại sao.

**Layer 2 — Core Tradeoff Map:**

```
┌─────────────────────────────────────────────┐
│  TRADEOFF PAIRS:                             │
│                                              │
│  Consistency ◀─────────▶ Availability        │
│  (CAP/PACELC)                                │
│                                              │
│  Latency ◀─────────────▶ Throughput          │
│  (optimize one = sacrifice other)            │
│                                              │
│  SQL ◀─────────────────▶ NoSQL               │
│  (ACID + JOIN vs Scale + Flexibility)        │
│                                              │
│  Monolith ◀────────────▶ Microservices       │
│  (simple debug vs independent deploy)        │
│                                              │
│  Normalized ◀──────────▶ Denormalized        │
│  (no duplication vs fast reads)              │
│                                              │
│  Push ◀────────────────▶ Pull                │
│  (real-time vs simple + client-controlled)   │
│                                              │
│  Cache ◀───────────────▶ No Cache            │
│  (fast + stale risk vs slow + always fresh)  │
└─────────────────────────────────────────────┘
```

**Layer 3 — Edge cases & tradeoffs:**

- "Choose consistency" doesn't mean 0 availability — it means prioritize consistency DURING partition.
- Microservices can become "distributed monolith" if not properly decomposed.
- Denormalized cache can diverge from source of truth → need TTL + invalidation strategy.

| Sai lầm                           | Tại sao sai                            | Đúng là                                           |
| --------------------------------- | -------------------------------------- | ------------------------------------------------- |
| Chỉ nói "dùng X" không giải thích | Zero signal cho interviewer            | "Tôi chọn X vì Y, tradeoff là Z, mitigate bằng W" |
| Nói "best practice"               | Mọi practice có context                | "Best practice cho use case này vì..."            |
| Không mention alternative         | Interviewer muốn biết bạn biết options | "Giữa X và Y, tôi chọn X vì..."                   |

🎯 **Interview Pattern:**

- **Trigger:** Mọi quyết định design — DB choice, cache strategy, communication protocol
- **Concept:** Tradeoff Reasoning
- **Opening:** "There are two approaches here. Option A gives us [benefit] but sacrifices [cost]. Option B gives [other benefit] but [other cost]. Given our requirements of [NFR], I'd go with Option A because..."

🔑 **Knowledge Chain:**

- 📚 Prereq: Tất cả concepts 1-6 — cần hiểu options trước khi so sánh
- ➡️ Enables: [Advanced System Design Problems](./03-advanced-problems.md), real production decisions

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

| Step                | Time   | Mục đích                            | Signal cho interviewer        |
| ------------------- | ------ | ----------------------------------- | ----------------------------- |
| **1. Requirements** | 5 min  | Thu hẹp scope, hiểu rõ bài toán     | Biết cách phân tích vấn đề    |
| **2. Estimation**   | 5 min  | Xác định scale để chọn architecture | Hiểu về scale thực tế         |
| **3. High-Level**   | 10 min | Vẽ kiến trúc tổng quan              | Có kiến thức rộng             |
| **4. Deep Dive**    | 15 min | Đi sâu 2-3 components               | Có depth + tradeoff reasoning |
| **5. Wrap-up**      | 5 min  | Nhận diện bottleneck, mở rộng       | Tư duy production-ready       |

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

| Tiêu chí       | Vertical          | Horizontal                        |
| -------------- | ----------------- | --------------------------------- |
| **Giới hạn**   | Hardware ceiling  | Gần như vô hạn                    |
| **Downtime**   | Cần restart       | Rolling update, no downtime       |
| **Complexity** | Đơn giản          | Load balancing, data distribution |
| **Cost**       | Đắt exponentially | Tăng linearly                     |
| **SPOF**       | Có                | Không                             |

**Stateless vs Stateful:** Stateless services không lưu state trong server memory → bất kỳ server nào cũng xử lý được request → dễ scale horizontal. **Nguyên tắc:** Move state ra external store (Redis, DB), giữ app servers stateless.

---

### Q: Load Balancing strategies và Database Scaling? 🟡 [Mid]

**A:**

**Load Balancing:**

| Strategy                 | Cách hoạt động             | Use case               |
| ------------------------ | -------------------------- | ---------------------- |
| **Round Robin**          | Lần lượt từng server       | Servers đồng đều       |
| **Weighted Round Robin** | Server mạnh nhận nhiều hơn | Servers không đồng đều |
| **Least Connections**    | Server ít connection nhất  | Long-lived connections |
| **IP Hash**              | Cùng IP → cùng server      | Session affinity       |
| **Consistent Hashing**   | Minimize redistribution    | Distributed cache      |

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

| Strategy          | Mô tả                                       | Use case              |
| ----------------- | ------------------------------------------- | --------------------- |
| **Cache-Aside**   | App đọc cache, miss thì đọc DB rồi populate | Most common           |
| **Write-Through** | Write cả cache + DB đồng thời               | Strong consistency    |
| **Write-Behind**  | Write cache trước, async write DB           | High write throughput |

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

| Availability   | Downtime/Year | Downtime/Month | Ví dụ            |
| -------------- | ------------- | -------------- | ---------------- |
| 99% (2 9s)     | 3.65 days     | 7.31 hours     | Internal tools   |
| 99.9% (3 9s)   | 8.76 hours    | 43.83 min      | Hầu hết SaaS     |
| 99.99% (4 9s)  | 52.6 min      | 4.38 min       | Payment, trading |
| 99.999% (5 9s) | 5.26 min      | 26.3 sec       | DNS, cloud core  |

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

| Metric  | Định nghĩa                    | Example                          |
| ------- | ----------------------------- | -------------------------------- |
| **RPO** | Lượng data tối đa có thể mất  | RPO=1h → backup mỗi giờ          |
| **RTO** | Thời gian tối đa để khôi phục | RTO=30min → recovery trong 30min |

RPO thấp → cần sync replication (đắt). RTO thấp → cần hot standby (đắt). Balance theo business criticality.

---

## 5. Common Building Blocks

### Q: 10 building blocks thường dùng trong System Design - What, When, How to discuss? 🟡 [Mid]

**A:**

| #   | Block                    | What                      | When to use                | Key discussion points                                             |
| --- | ------------------------ | ------------------------- | -------------------------- | ----------------------------------------------------------------- |
| 1   | **Load Balancer**        | Phân phối traffic         | >1 server instance         | L4 (IP/port) vs L7 (URL/header), algorithms                       |
| 2   | **API Gateway**          | Unified entry point       | Microservices              | Routing, auth, rate limiting, BFF pattern                         |
| 3   | **CDN**                  | Edge cache static content | Global users, media        | Push vs Pull, TTL, cache invalidation                             |
| 4   | **Cache (Redis)**        | In-memory fast reads      | Hot data, sessions         | Strategies (cache-aside, write-through), eviction (LRU), stampede |
| 5   | **Message Queue**        | Async message passing     | Decouple, async processing | Kafka (streaming) vs RabbitMQ (task queue), delivery guarantees   |
| 6   | **Database**             | Persistent storage        | Always needed              | SQL vs NoSQL selection (see §6)                                   |
| 7   | **Object Storage (S3)**  | File/blob storage         | Images, videos, backups    | 11-nines durability, storage tiers, pre-signed URLs               |
| 8   | **Search Engine (ES)**   | Full-text search          | Text search, log analytics | Inverted index, near real-time, ELK stack                         |
| 9   | **Notification Service** | Push/email/SMS            | User engagement, alerts    | APNs/FCM, priority queue, rate limiting per user                  |
| 10  | **Rate Limiter**         | Limit requests            | Abuse protection           | Token Bucket, Sliding Window, Redis counter, HTTP 429             |

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

| Criteria      | REST        | gRPC              | GraphQL          | WebSocket     |
| ------------- | ----------- | ----------------- | ---------------- | ------------- |
| **Protocol**  | HTTP/1.1    | HTTP/2            | HTTP/1.1         | TCP (upgrade) |
| **Format**    | JSON (text) | Protobuf (binary) | JSON             | Any           |
| **Speed**     | Good        | Excellent (~10x)  | Good             | Excellent     |
| **Streaming** | No          | Bidirectional     | Subscription     | Bidirectional |
| **Browser**   | ✅ Native   | ❌ Need grpc-web  | ✅ Native        | ✅ Native     |
| **Best for**  | Public API  | Internal services | Complex frontend | Real-time     |

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

| SQL thắng                          | NoSQL thắng                          |
| ---------------------------------- | ------------------------------------ |
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

|                   | Monolith               | Microservices               |
| ----------------- | ---------------------- | --------------------------- |
| Team < 10, MVP    | ✅ Fast, simple        | ❌ Over-engineering         |
| Team > 50, mature | ❌ Coupling, conflicts | ✅ Independent teams/deploy |
| Debugging         | Simple stack trace     | Distributed tracing needed  |

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

| Do                               | Don't              |
| -------------------------------- | ------------------ |
| Vẽ component trước, connect sau  | Vẽ loạn xạ         |
| Label tất cả connections         | Mũi tên trống      |
| Giải thích WHY mỗi component     | Chỉ liệt kê        |
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

| SPOF                | Fix                                     |
| ------------------- | --------------------------------------- |
| 1 Load Balancer     | LB pair (active-passive) + DNS failover |
| 1 App Server        | Multiple instances behind LB            |
| 1 Database          | Primary + Replicas + Auto-failover      |
| 1 Redis             | Redis Cluster / Sentinel                |
| 1 Availability Zone | Multi-AZ deployment                     |
| 1 Region            | Multi-region (nếu budget cho phép)      |

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

_Difficulty: 🟢 Basic (Junior) | 🟡 Intermediate (Mid-level) | 🔴 Advanced (Senior)_

_References: System Design Interview (Alex Xu), Designing Data-Intensive Applications (Martin Kleppmann), Google SRE Book_

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                                        | Difficulty | Core Concept          | Key Signal                                                 |
| --- | ----------------------------------------------- | ---------- | --------------------- | ---------------------------------------------------------- |
| Q1  | Framework 5 bước approach System Design         | 🟢         | 5-Step Framework      | Biết structure 5-5-10-15-5, time allocation                |
| Q2  | FR vs NFR clarification                         | 🟡         | Requirements Analysis | WHO-WHAT-SCOPE + SCALE-PERF-AVAIL questions                |
| Q3  | HLD components + Deep Dive focus                | 🟡         | 5-Step Framework      | API→Data→Diagram + WHY-HOW-TRADEOFF-FAIL-SCALE             |
| Q4  | Latency numbers mọi programmer cần biết         | 🟢         | Estimation            | RAM→SSD→Network→HDD ordering + key takeaways               |
| Q5  | Power of 2 table + data sizes                   | 🟢         | Estimation            | 2^10=KB, 2^20=MB... + common entity sizes                  |
| Q6  | Công thức estimation (QPS, storage, cache)      | 🟡         | Estimation            | QPS = DAU×actions/86K, cache = 20% reads                   |
| Q7  | Estimation ví dụ: Chat 200M DAU, URL Shortener  | 🟡         | Estimation            | End-to-end calculation with replication factor             |
| Q8  | Horizontal vs Vertical, Stateless vs Stateful   | 🟢         | Scalability           | Hardware ceiling + SPOF → horizontal preferred             |
| Q9  | LB strategies + DB scaling (replicas, sharding) | 🟡         | Scalability           | Round Robin vs Consistent Hashing + when to shard          |
| Q10 | Caching layers, CDN, Message Queue              | 🟡         | Building Blocks       | 6 cache layers + strategies + async pattern                |
| Q11 | SLA/SLO/SLI + Availability nines                | 🟢         | Availability          | SLI measures→SLO targets→SLA promises + serial vs parallel |
| Q12 | Active-Active vs Passive + RPO/RTO              | 🟡         | Availability          | Failover time + data loss tolerance + cost tradeoff        |
| Q13 | 10 building blocks: what, when, how             | 🟡         | Building Blocks       | WHY-ALTERNATIVES-FAILURE per block                         |
| Q14 | Decision tree SQL vs NoSQL                      | 🟡         | Building Blocks       | ACID→SQL, Flexible→Document, KV→Redis                      |
| Q15 | REST vs gRPC vs GraphQL vs WebSocket            | 🟡         | Building Blocks       | Public→REST, Internal→gRPC, Complex FE→GraphQL             |
| Q16 | Common tradeoffs kinh điển                      | 🔴         | Tradeoff Reasoning    | 8 tradeoff pairs + articulate reasoning                    |
| Q17 | Architecture diagram conventions                | 🟢         | 5-Step Framework      | Label connections + trace user journey                     |
| Q18 | Top 10 anti-patterns                            | 🟢         | Tradeoff Reasoning    | Jumping to solution, over-engineering, silent              |
| Q19 | SPOF identification + fix                       | 🟡         | Availability          | Each component needs redundancy plan                       |
| Q20 | Company-specific focus areas                    | 🟡         | Interview Prep        | Grab=geo+realtime, Google=billions-scale                   |
| Q21 | Pre-interview checklist                         | 🟢         | 5-Step Framework      | Knowledge + Practice + Reminders                           |

**Distribution:** 🟢 8 (38%) | 🟡 12 (57%) | 🔴 1 (5%)

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Scenario:** Interviewer bất ngờ hỏi: _"Walk me through how you'd approach designing a URL shortener in 45 minutes."_

**30-second answer:**
"I'd start with 5 minutes of requirements clarification — confirming DAU around 100M, read:write ratio 100:1, and URL length 7 characters using Base62. Then I'd do a quick estimation: about 100 write QPS, 10K read QPS peak 30K, 1.8TB storage per year. For the high-level design, I'd sketch a write path through an API gateway to a hash generator with a SQL database, and a read path hitting Redis cache first with cache-aside strategy. In the deep dive, I'd focus on the hashing approach — Base62 with a counter service to avoid collisions — and the caching layer to handle the 100:1 read ratio."

**Follow-up:** "What if a popular URL gets millions of hits per second — how do you handle that hot key?"
→ "I'd use multi-layer caching: CDN edge cache with 1-hour TTL for popular URLs, plus Redis cluster with hash-based key distribution. For extreme hot keys, I'd replicate the key across multiple Redis slots with a random suffix."

---

## Self-Check / Tự Kiểm Tra

> **Instruction:** Đóng tài liệu lại. Trả lời 5 câu hỏi dưới đây KHÔNG nhìn notes.

1. **🔄 Retrieval:** Liệt kê 5 bước của System Design Framework với thời gian mỗi bước. Bước nào quan trọng nhất cho interviewer signal?
2. **🖼️ Visual:** Vẽ lại availability formula cho serial vs parallel components. Tại sao parallel cho availability cao hơn?
3. **🛠️ Application:** Cho bài "Design a chat system, 200M DAU" — estimate QPS, storage 1 năm, số Redis nodes cần.
4. **🐛 Debug:** Ứng viên dùng Kafka + Cassandra + K8s cho app 100 users. Giải thích tại sao sai và nên dùng gì.
5. **🎓 Teach:** Giải thích cho junior tại sao "dùng Redis" không phải answer — cần nói gì thêm?

💬 **Feynman Prompt:** Một junior hỏi: "Tại sao phải hỏi requirements trước? Cứ vẽ architecture đi rồi điều chỉnh sau?" — giải thích tại sao cách đó sai trong interview context, dùng analogy xây nhà.

---

## 🔁 Spaced Repetition / Lịch Ôn Tập

| Round | Ngày   | Focus                                                           |
| ----- | ------ | --------------------------------------------------------------- |
| 1     | Day 1  | Đọc full — highlight 5-step framework + estimation formulas     |
| 2     | Day 3  | Tự practice: estimate QPS cho 3 systems (chat, URL, e-commerce) |
| 3     | Day 7  | Mock interview: 45-phút design URL Shortener using framework    |
| 4     | Day 14 | Mock interview: Chat System + articulate 3 tradeoffs            |
| 5     | Day 30 | Tự review Cold Call + Self-Check không nhìn notes               |

---

## Connections / Liên Kết

**Same-track (BE System Design):**

- ➡️ [Classic Problems](./02-classic-problems.md) — URL Shortener, Chat, Rate Limiter using this framework
- ➡️ [Advanced Problems](./03-advanced-problems.md) — News Feed, YouTube, Maps at scale
- ➡️ [Distributed Patterns](./04-distributed-patterns.md) — deep dive patterns for Step 4
- ➡️ [Observability & Scale](./05-observability-and-scale.md) — monitoring for Step 5 wrap-up
- ➡️ [Ride-Hailing System](./06-ride-hailing-system.md) — full 45-min walkthrough using framework

**Cross-track:**

- 🔗 [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md) — CAP, consistency models for tradeoff reasoning
- 🔗 [Database Advanced](../03-database-advanced/01-sql-fundamentals.md) — SQL vs NoSQL decision criteria
- 🔗 [Caching Patterns](../03-database-advanced/04-caching-patterns.md) — cache strategies for building blocks

---

## Quick Recap / Tóm Tắt Nhanh

### Key Takeaways / Điểm Chính

- The framework: Clarify → Estimate → API → Data Model → High-Level Design → Deep Dives → Tradeoffs / Framework: Làm rõ → Ước tính → API → Mô hình dữ liệu → Thiết kế tổng quát → Phân tích sâu → Đánh đổi
- Always separate functional requirements (what it does) from non-functional requirements (scale, latency, availability) / Luôn tách yêu cầu chức năng (nó làm gì) khỏi yêu cầu phi chức năng (quy mô, độ trễ, tính sẵn sàng)
- Capacity estimation demonstrates scale intuition: derive QPS, storage, and bandwidth from user counts / Ước tính năng lực thể hiện trực giác về quy mô: suy ra QPS, lưu trữ, băng thông từ số lượng người dùng
- Know your numbers: Redis ~0.1ms, SQL write ~1ms, HDD seek ~10ms, network RTT ~100ms / Nắm rõ con số: Redis ~0.1ms, SQL write ~1ms, tìm HDD ~10ms, RTT mạng ~100ms
- Deep dives prove senior-level depth — pick 2-3 hard sub-problems and solve them with concrete tradeoffs / Phân tích sâu chứng tỏ độ sâu senior — chọn 2-3 bài toán con khó và giải quyết với tradeoff cụ thể
- Communication is half the score — narrate your thinking, ask clarifying questions, invite feedback / Giao tiếp chiếm một nửa điểm số — trình bày quá trình suy nghĩ, hỏi làm rõ, mời phản hồi
- There is no perfect design; demonstrating awareness of tradeoffs is more valuable than a "correct" answer / Không có thiết kế hoàn hảo; thể hiện nhận thức về tradeoff có giá trị hơn một câu trả lời "đúng"

### Interview Tips / Mẹo Phỏng Vấn

- Start with requirements, not architecture — interviewers penalize candidates who jump straight to solutions / Bắt đầu với yêu cầu, không phải kiến trúc — người phỏng vấn trừ điểm thí sinh nhảy thẳng vào giải pháp
- Never choose a specific database or technology until you've established the scale and access patterns / Không bao giờ chọn database hay công nghệ cụ thể cho đến khi xác định rõ quy mô và access pattern
- Practice the 45-minute arc: 5min clarify, 5min estimate, 10min HLD, 20min deep dives, 5min wrap-up / Luyện tập khung 45 phút: 5 phút làm rõ, 5 phút ước tính, 10 phút HLD, 20 phút phân tích sâu, 5 phút tổng kết
- End with "given more time, I'd improve X by doing Y" — signals you see beyond the immediate design / Kết thúc với "nếu có thêm thời gian, tôi sẽ cải thiện X bằng cách Y" — cho thấy bạn nhìn xa hơn thiết kế hiện tại
