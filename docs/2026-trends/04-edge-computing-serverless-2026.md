> **Track**: Shared (FE + BE) | **Difficulty**: 🟢 Junior → 🔴 Senior
> [← Back to Table of Contents](../00-table-of-contents.md)

# Edge Computing & Serverless 2026

> _"Code chạy gần user nhất, scale về 0 khi rảnh, scale ra hàng triệu khi cần — đó là edge serverless 2026."_

---

## 🌍 Real-World Scenario — Vercel Ship 2024 Cold Start Crisis

**Context:** Cuối 2023, một startup fintech dùng Vercel deploy Next.js app. Lượng user tăng từ 10K → 500K trong 2 tháng. Marketing team chạy campaign vào 9h sáng — và mỗi sáng, **30% requests đầu tiên timeout** vì cold start.

**Root cause:** Họ deploy như Lambda truyền thống (Node.js runtime, 200MB bundle, full Next.js server). Cold start ~2.5s. Khi traffic spike từ 10 RPS → 2000 RPS trong 30s, Vercel phải khởi tạo hàng trăm container mới — và user đầu tiên gánh hết.

**Fix (2024):** Migrate critical paths sang **Vercel Edge Runtime** (V8 isolates, không phải containers):

- Cold start: 2.5s → **5ms** (500x faster)
- Bundle giới hạn: 4MB → ép họ refactor, dùng Web APIs thay Node APIs
- Auth middleware, A/B test, geolocation, rate limit → tất cả chạy ở edge (300+ PoP)
- Heavy work (DB writes, payment) vẫn ở Lambda (serverless functions), nhưng đứng sau edge

**Kết quả:** P99 latency 2800ms → 180ms. Cost giảm 40% (edge tier rẻ hơn function tier). Conversion tăng 8% (mỗi 100ms latency = 1% conversion theo Amazon).

**Bài học:** Edge ≠ serverless functions ≠ containers. **3 thứ khác nhau hoàn toàn về cold start, runtime, và use case.** Senior engineer phải biết khi nào dùng cái nào — interviewer 2026 sẽ hỏi.

---

## A. Theory & Core Concepts

### 🧠 Memory Hook

> **"PEACE: PoP, Edge runtime, Async durability, Cold start, Egress."**
> 5 thứ phải nhớ về edge computing — PoP (điểm phục vụ), Edge runtime (V8 isolates không Node), Async durability (Durable Objects/D1), Cold start (5ms vs 200ms vs 2s), Egress (chi phí dữ liệu ra).

### Why Edge Computing Exists?

**Level 1 — User experience:** Speed of light is finite. Singapore → US East = 230ms RTT minimum. Mỗi request đi vòng nửa quả đất → user cảm thấy app "lag". Edge đặt code tại 300+ thành phố → RTT < 30ms cho 95% dân số.

**Level 2 — Cost:** Cloud bills 2024 tăng 40% YoY (Flexera report). Egress fees từ AWS region về internet = $0.09/GB. Edge platforms (Cloudflare) tính $0/GB egress + per-request pricing rẻ hơn 10x cho stateless workloads.

**Level 3 — Architecture:** Monolith → microservices → serverless → edge-first. Mỗi bước **giảm operational overhead** và **tăng granularity scaling**. 2026 trend: "Compute everywhere, data nearby."

---

### Concept 1: PoP & Anycast Routing — Tại Sao Edge Nhanh?

**Layer 1 — Analogy (12 tuổi):**

> Hãy tưởng tượng pizza. McDonald's có 1 nhà bếp trung tâm ở US — bạn ở VN order pizza, ship 24 giờ. Còn Pizza Hut có 200 cửa hàng ở VN — bạn order, 30 phút có pizza. **Edge = chuỗi cửa hàng địa phương; Cloud region = nhà bếp trung tâm.**

**Layer 2 — Technical:**

```
[User ở Hà Nội]
     │
     │ DNS query: api.example.com
     ▼
[Anycast IP — same IP toàn cầu]
     │
     │ BGP routing chọn PoP gần nhất
     ▼
┌──────────────────────────────────┐
│ Cloudflare PoP Hà Nội (HAN)      │
│ - V8 Isolate worker chạy code    │
│ - KV cache hit → trả luôn         │
│ - KV miss → fetch origin (xa)     │
└──────────────────────────────────┘
     │ Cache miss
     ▼
[Origin server ở Singapore]
```

**Anycast magic:** Cùng 1 địa chỉ IP `1.1.1.1` được announce từ 300+ PoP. Router của ISP tự động chọn PoP gần nhất theo BGP path. User Hà Nội → HAN PoP. User Tokyo → NRT PoP. **Không cần GeoDNS, không cần load balancer riêng.**

**So sánh latency điển hình (từ Hà Nội):**

| Đích                | Latency RTT | Use case phù hợp         |
| ------------------- | ----------- | ------------------------ |
| HAN PoP (edge)      | 5-15ms      | Auth, cache, A/B test    |
| Singapore region    | 60-90ms     | DB read, API logic       |
| US-East region      | 220-280ms   | Bad UX, tránh nếu có thể |
| Origin xa (no edge) | 250-400ms   | Cold start tệ + RTT tệ   |

**Layer 3 — Edge cases:**

- PoP downtime → BGP tự reroute sang PoP next-nearest (failover transparent)
- Một số PoP có ít CPU/RAM → workload nặng có thể bị reject, fallback region
- IP-based blocking (Iran, Crimea) → một số PoP không serve

### Concept 2: V8 Isolates vs Containers vs VMs

**Layer 1 — Analogy:**

> **VM** = nhà riêng (mỗi nhà 1 hệ điều hành đầy đủ). **Container** = căn hộ chung cư (chia OS nhưng phòng riêng). **V8 Isolate** = bàn làm việc trong coworking space (chia luôn cả phòng, chỉ có ngăn riêng cho đồ).

**Layer 2 — Technical comparison:**

```
┌─────────────────────────────────────────────────────────┐
│ Cold Start Spectrum (lower = faster scale-from-zero)    │
├─────────────────────────────────────────────────────────┤
│  V8 Isolate    │ ~5ms       │ Cloudflare Workers,       │
│                │            │ Vercel Edge, Deno Deploy  │
│                │            │ ❗ No Node APIs, 4MB limit│
├─────────────────────────────────────────────────────────┤
│  Firecracker   │ ~125ms     │ Lambda SnapStart, Fly.io  │
│  microVM       │            │ machines (V8 + warm pool) │
├─────────────────────────────────────────────────────────┤
│  Container     │ 200ms-2s   │ Lambda, Cloud Run, ECS    │
│  (Docker)      │            │ Full Node/Python/Go OK    │
├─────────────────────────────────────────────────────────┤
│  Full VM       │ 30s-2min   │ EC2, GCE — no scale-to-0  │
└─────────────────────────────────────────────────────────┘
```

**Tradeoffs table:**

| Yếu tố                      | V8 Isolate       | Container | VM        |
| --------------------------- | ---------------- | --------- | --------- |
| Cold start                  | 5ms ⚡           | 200ms-2s  | 30s+      |
| Memory ceiling              | 128MB            | 10GB      | 1TB+      |
| Bundle size                 | 4MB              | GB        | TB        |
| CPU time/request            | 50ms-30s         | unlimited | unlimited |
| Node.js APIs                | ❌ Web APIs only | ✅ Full   | ✅ Full   |
| Native deps (sharp, bcrypt) | ❌               | ✅        | ✅        |
| Long-lived TCP              | ❌ Ephemeral     | ✅        | ✅        |
| Cost @ 1M req               | $0.50            | $5-20     | $50+      |

**Layer 3 — Edge cases:**

- Isolate có thể bị **evict bất cứ lúc nào** giữa request → không có in-memory state đáng tin
- Workers paid plan có giới hạn CPU time 30s; Hobby = 50ms
- Subrequest limit (50 fetch/request) → batch hoặc chuyển queue

### Concept 3: Stateful Edge — Durable Objects, D1, R2

**Vấn đề:** Edge runtime stateless. Nhưng app cần state (session, counter, real-time room). Làm sao?

**Layer 1 — Analogy:**

> **Durable Object** = một người thư ký riêng cho mỗi room (chat room, document, game match). Cloudflare đảm bảo trên toàn cầu chỉ có **1 instance** của thư ký đó tồn tại — mọi request về room đó đều route về đúng người. Strong consistency, single-writer, stateful.

**Layer 2 — Architecture:**

```
[User A — Tokyo]              [User B — London]
     │                              │
     │ "join chat room 42"          │ "send message"
     ▼                              ▼
[NRT PoP Worker]              [LHR PoP Worker]
     │                              │
     │ stub.fetch()                 │ stub.fetch()
     │   ┌──────────────────────────┘
     ▼   ▼
┌──────────────────────────────────┐
│ Durable Object "chat-room-42"    │
│ Singleton globally               │
│ - In-memory state OK             │
│ - SQLite-backed persistence      │
│ - WebSocket hibernation          │
│ - Located near most active user  │
└──────────────────────────────────┘
```

**Storage stack 2026:**

| Storage            | Use case                                | Latency          | Consistency                |
| ------------------ | --------------------------------------- | ---------------- | -------------------------- |
| **KV**             | Config, feature flags, JWT denylist     | 5-50ms read      | Eventual (60s propagation) |
| **R2**             | Object storage (images, logs, datasets) | 50-200ms         | Strong, $0 egress          |
| **D1**             | SQLite per region, replica reads        | 10-50ms read     | Read replicas eventual     |
| **Durable Object** | Coordination, real-time, single-writer  | 10-30ms          | Strong (single instance)   |
| **Hyperdrive**     | Pool TCP to your Postgres/MySQL         | +5ms over direct | Pass-through               |
| **Queues**         | Async jobs, fan-out                     | 100ms-seconds    | At-least-once delivery     |

**Layer 3 — Edge cases:**

- DO hot spot (1 room có 100K user) → có thể bottleneck CPU; cần shard logic
- D1 max DB size 10GB → big tenants phải shard
- KV propagation delay 60s → đừng dùng cho cache invalidation cần real-time

### Concept 4: Edge AI Inference — Khi LLM Chạy Ở PoP

**2025 milestone:** Cloudflare Workers AI và Vercel AI SDK cho phép chạy small LLM (Llama 3.2 3B, Mistral 7B quantized) **trực tiếp tại PoP** với GPU pool dùng chung.

**Layer 1 — Analogy:**

> Trước đây: order món Tây phải gọi đầu bếp Pháp ở Paris (OpenAI API). Giờ: McDonald's địa phương đã có sẵn đầu bếp biết làm burger Pháp đơn giản → ship 5 phút thay vì 24 giờ.

**Layer 2 — Decision flow:**

```
                    ┌─────────────────────┐
                    │ Inference request    │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                              │
        Simple task?                    Complex task?
        (classify, NER,                 (multi-turn, RAG,
         small summarize)                tool use, code gen)
                │                              │
                ▼                              ▼
        ┌──────────────┐              ┌──────────────────┐
        │ Edge AI       │              │ Frontier API      │
        │ Llama 3.2 3B  │              │ Claude Sonnet,    │
        │ at PoP        │              │ GPT-4o            │
        │ ~50-200ms     │              │ ~500-3000ms       │
        │ $0.0001/req   │              │ $0.01-0.10/req    │
        └──────────────┘              └──────────────────┘
```

**Layer 3 — Edge cases:**

- Model availability per PoP không đồng đều → fallback region
- GPU contention spike → P99 latency tăng đột biến
- Compliance: edge AI không log prompt → harder to audit

---

### ❌ Common Mistakes (Senior nào cũng từng mắc)

| Sai lầm                                                | Tại sao sai                                 | Đúng là                                                                              |
| ------------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------ |
| Deploy toàn bộ Next.js app lên Edge Runtime            | Bundle quá 4MB, libs Node-only fail         | Chỉ middleware/API routes nhẹ ở edge; pages/server actions dùng serverless functions |
| Dùng `globalThis.cache = new Map()` ở Worker           | Isolate evict bất cứ lúc nào, không persist | Dùng KV/Durable Object/Cache API                                                     |
| Connect Postgres trực tiếp từ mỗi Worker invocation    | Connection storm, vượt max_connections      | Dùng Hyperdrive/PgBouncer/Neon serverless driver                                     |
| Dùng setTimeout/setInterval expect chạy nhiều phút     | Worker CPU time limit + isolate evict       | Dùng Cron Triggers, Queues, Durable Object alarms                                    |
| Lưu session trong memory ở edge                        | Mỗi request có thể vào isolate khác         | Lưu KV với TTL, hoặc JWT signed                                                      |
| Tin "Edge = serverless = same thing"                   | Khác hoàn toàn về runtime, cold start, APIs | Hiểu 3 tier: Edge (V8) / Serverless function (container) / Long-running (VM)         |
| Xài `fs.readFileSync` trong Worker                     | Không có filesystem                         | Bundle assets vào worker hoặc dùng R2                                                |
| Bỏ qua egress cost khi chọn cloud                      | AWS egress giết startup nhỏ                 | Chọn $0-egress (R2, B2) cho heavy media                                              |
| Cache personalized response ở edge CDN                 | User A nhận data của user B                 | Set `Cache-Control: private` hoặc bypass cho authed                                  |
| Chạy crypto.randomBytes(1024 \* 1024) trong middleware | Block CPU time, throttle                    | Move crypto-heavy ra serverless function                                             |

---

### 🎯 Interview Pattern

**Trigger keywords:** "edge computing", "Cloudflare Workers", "Vercel Edge", "cold start", "serverless at scale", "global low latency", "stateful edge", "Durable Objects".

**Opening 1-2 câu:**

> "Edge computing nghĩa là chạy code ở 300+ PoP gần user, dùng V8 isolates với cold start ~5ms thay vì container ~200ms-2s. Tôi tiếp cận bài toán bằng cách phân loại workload thành 3 tier: edge (auth, A/B, cache, light AI), serverless function (DB writes, heavy compute), và long-running (background jobs, WebSocket bền). Stateful coordination dùng Durable Objects để giữ strong consistency trên global anycast."

---

### 🔑 Knowledge Chain

📚 **Prerequisite (cần biết trước):**

- [HTTP & Networking Fundamentals](../be-track/02-backend-knowledge/06-networking-go.md)
- [Caching Strategies](../shared/02-system-design/04-caching-cdn.md)
- [Distributed Systems Basics](../be-track/02-backend-knowledge/03-distributed-systems.md)

➡️ **Enables (sau khi master sẽ học được):**

- [LLM System Design](./02-llm-system-design.md) — edge AI inference patterns
- [Vector DBs at Edge](./03-vector-databases-embeddings.md) — Cloudflare Vectorize
- [Modern Observability](./11-modern-observability.md) — distributed tracing across edge + region
- [Platform Engineering](./12-platform-engineering-dx.md) — golden paths cho edge deployment

---

## B. Interview Questions & Answers

### B1. 🟢 [Junior] Edge computing là gì? Khác serverless function chỗ nào?

**💡 Interview Signal:**

- ✅ **Strong:** Phân biệt rõ V8 isolate vs container, nói được cold start, đưa ví dụ cụ thể workload nào hợp edge
- ❌ **Weak:** "Edge là serverless chạy ở nhiều region" (sai, đó là multi-region serverless, không phải edge)

**Answer (EN):**
Edge computing runs code at hundreds of points-of-presence (PoPs) physically close to users, using V8 isolates with ~5ms cold start. Serverless functions (Lambda, Cloud Run) run in containers in 1-30 regions with ~200ms-2s cold start. Edge is for low-latency stateless work (auth check, A/B test, redirects, light AI); serverless functions handle DB writes, heavy compute, native dependencies. They complement each other.

**VI reinforcement:**
Edge = code chạy ở **hàng trăm PoP gần user**, V8 isolate cold start 5ms, dùng cho việc nhẹ và stateless. Serverless function = container ở vài region, cold start 200ms-2s, dùng cho việc nặng. **Không phải cùng một thứ** — edge nhanh hơn nhưng giới hạn nhiều (4MB bundle, Web APIs only, không có Node native modules).

---

### B2. 🟢 [Junior] Cold start là gì và tại sao nó quan trọng?

**💡 Interview Signal:**

- ✅ **Strong:** Đo bằng ms, đưa con số cụ thể từng platform, nói cách giảm
- ❌ **Weak:** "Là khi function khởi động lần đầu" (đúng nhưng quá nông)

**Answer (EN):**
Cold start = time to initialize a new instance when no warm one exists. Includes: container creation (100-1000ms), runtime boot (50-500ms for Node), code download/parse, dependency init. Matters because: P99 latency directly visible to users, traffic spikes amplify it (sudden burst → many cold starts), cost (you pay for warm pool). Mitigation: V8 isolates (5ms), provisioned concurrency, smaller bundles, lazy imports, SnapStart (Lambda).

**VI reinforcement:**
Cold start = thời gian khởi động instance mới khi chưa có warm. Số liệu thực tế: Cloudflare Workers ~5ms, Vercel Edge ~5-10ms, Lambda Node container ~200-800ms, Lambda Java ~1-3s, AWS Fargate ~30s. **Quan trọng vì** spike traffic = nhiều cold start = user đầu tiên khổ. Cách giảm: dùng V8 isolate, provisioned concurrency, bundle nhỏ, lazy import, SnapStart.

---

### B3. 🟢 [Junior] Khi nào KHÔNG nên dùng edge?

**💡 Interview Signal:**

- ✅ **Strong:** Liệt kê 3+ trường hợp với lý do kỹ thuật cụ thể
- ❌ **Weak:** "Edge luôn tốt hơn" (sai — quá nhiều giới hạn)

**Answer (EN):**
Don't use edge when: (1) need native Node modules (sharp, bcrypt, ffmpeg) — use serverless function; (2) heavy CPU/memory (>30s, >128MB) — use container; (3) long-lived connections (WebSocket > minutes, gRPC streaming) — use Durable Objects or persistent server; (4) data locality requires single region (compliance, low-latency DB writes); (5) bundle naturally exceeds 4MB (large ML models, full Next.js server); (6) your traffic is regional anyway (only Vietnam users → 1 SG region is fine).

**VI reinforcement:**
KHÔNG dùng edge khi: cần Node native (sharp, bcrypt), CPU/RAM nặng (>30s, >128MB), WebSocket bền (giờ), data phải single-region (compliance, DB write nhanh), bundle >4MB, hoặc traffic chỉ ở 1 quốc gia (1 region đã đủ).

---

### B4. 🟡 [Mid] Hyperdrive/Neon serverless driver giải quyết vấn đề gì?

**💡 Interview Signal:**

- ✅ **Strong:** Hiểu connection storm, mô tả pooling architecture, prepared statement cache
- ❌ **Weak:** "Tăng tốc query" (vague — không phải mục đích chính)

**Answer (EN):**
Edge functions can spawn thousands of concurrent invocations globally. Each opening a Postgres connection = connection storm exhausting `max_connections` (default 100-500). Hyperdrive (Cloudflare) and Neon's serverless driver solve this by:

1. **Connection pooling at edge** — Hyperdrive maintains warm pools per region, Workers share connections
2. **Prepared statement cache** — repeated queries skip parse/plan
3. **HTTP-based protocol** (Neon) — works in V8 isolates without TCP
4. **Query result caching** — read-heavy workloads cached at edge

Without these: app dies at 1000+ concurrent edge invocations.

**VI reinforcement:**
Edge function chạy đồng thời hàng nghìn invocation toàn cầu. Mỗi cái mở 1 connection Postgres → connection storm, Postgres chết. **Hyperdrive/Neon driver** giải bằng: pool connection ở edge, cache prepared statement, dùng HTTP protocol (Neon) thay TCP, cache query result. Không có nó: app chết ở 1000+ concurrent.

---

### B5. 🟡 [Mid] Phân biệt Edge Function vs Edge Middleware vs Origin Function trong Next.js/Vercel.

**💡 Interview Signal:**

- ✅ **Strong:** Vẽ được request flow, biết khi nào nên dùng cái nào, hiểu giới hạn từng layer
- ❌ **Weak:** Lẫn lộn middleware với route handler

**Answer (EN):**

```
[User] → [Edge Network — 300+ PoP]
          │
          ├─ Edge Middleware (next/middleware.ts)
          │  • Runs BEFORE everything
          │  • Auth, geolocation, A/B, rewrites
          │  • Web APIs only, ~50ms CPU limit
          │
          ├─ Edge Function (export const runtime = 'edge')
          │  • Route handler in edge runtime
          │  • Light API logic, streaming responses
          │  • Web APIs only, 4MB bundle
          │
          └─ Serverless Function (default Next.js API)
             • Origin region (e.g. US-East)
             • Full Node.js, native modules OK
             • DB writes, heavy compute
```

Use Middleware: auth gate, redirect, A/B variant assignment, geolocation header injection.
Use Edge Function: simple GET API, streaming AI response, edge-rendered React.
Use Serverless: POST/PUT with DB writes, ML inference with native libs, file processing.

**VI reinforcement:**
3 layer khác nhau:

1. **Middleware** chạy đầu tiên cho mọi request — auth, redirect, A/B
2. **Edge Function** = route handler chạy ở edge runtime — API nhẹ, streaming
3. **Serverless Function** = route handler chạy ở region — heavy work, DB write

---

### B6. 🟡 [Mid] Stateful workload ở edge — design 1 chat room real-time global.

**💡 Interview Signal:**

- ✅ **Strong:** Vẽ Durable Object architecture, giải thích single-writer, WebSocket hibernation, scale strategy
- ❌ **Weak:** "Dùng Redis pub/sub" (đúng cho 1 region, không scale toàn cầu tốt)

**Answer (EN):**

```
                    ┌────────────────────┐
                    │ User A (Tokyo)     │
                    └────────┬───────────┘
                             │ WebSocket
                             ▼
                    ┌────────────────────┐
                    │ NRT Worker         │
                    │ stub = DO.idFromName("room-42")│
                    └────────┬───────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                          │
        ▼                                          ▼
┌──────────────────┐                  ┌──────────────────┐
│ Durable Object   │                  │ User B (London)  │
│ "room-42"        │ ◄────────────────┤ (LHR Worker)     │
│ • SQLite state   │                  └──────────────────┘
│ • WS hibernation │
│ • Single-writer  │
│ • Located near   │
│   most active    │
│   user           │
└──────────────────┘
```

Key design decisions:

1. **Naming:** `idFromName("room-42")` → deterministic ID, all rooms route to same DO
2. **WebSocket hibernation:** DO sleeps when idle, wakes on message → cost-efficient
3. **State:** SQLite-backed, survives restarts; in-memory for hot data
4. **Scale:** if room > 10K concurrent users, shard by user-hash → multiple DOs + fanout
5. **Persistence:** mirror to D1/R2 for history beyond DO storage limit

**VI reinforcement:**
Dùng **Durable Object** — Cloudflare đảm bảo mỗi room name = duy nhất 1 instance trên toàn cầu. User Tokyo và London đều route về cùng 1 DO. WebSocket hibernation = DO ngủ khi không có message, tỉnh dậy khi có → tiết kiệm cost. State lưu SQLite trong DO. Scale bằng shard hash nếu room quá đông.

---

### B7. 🟡 [Mid] Edge caching strategy — làm sao cache personalized data an toàn?

**💡 Interview Signal:**

- ✅ **Strong:** Phân biệt public/private cache, đưa pattern Vary header, cache key composition
- ❌ **Weak:** "Cache mọi thứ ở edge" (nguy hiểm — leak data user)

**Answer (EN):**
Three tiers of edge caching:

1. **Public cache (CDN):** anyone can hit. Static assets, public pages. `Cache-Control: public, max-age=3600`
2. **Personalized cache:** segment by user attribute. Use `Cache-Control: private` + `Vary` header (e.g. `Vary: Cookie, Accept-Language`). Or compose cache key: `${url}|${userTier}|${locale}`
3. **No cache:** sensitive (account balance, PII). `Cache-Control: no-store`

Patterns:

- **Stale-while-revalidate:** serve stale + refresh in background
- **Tagged invalidation:** Cloudflare Cache Tags or `surrogate-key` (Fastly) → bulk purge by tag
- **Edge KV cache:** for compute results, not just HTTP

Anti-pattern: caching authenticated API response by URL alone → leaks user A's data to user B.

**VI reinforcement:**
3 tier cache: **public** (CDN, ai cũng được), **personalized** (segment by tier/locale, dùng Vary header), **no-cache** (sensitive data). Pattern: stale-while-revalidate (serve stale + refresh background), cache tag invalidation. **Tuyệt đối tránh:** cache authed response theo URL → user A nhận data user B.

---

### B8. 🔴 [Senior] Design an edge-native multi-region SaaS với data residency compliance.

**💡 Interview Signal:**

- ✅ **Strong:** Phân tách compute vs data, addressed compliance (GDPR, India DPDP, US HIPAA), failure modes, observability
- ❌ **Weak:** Vẽ 1 sơ đồ generic không nói tới compliance

**Answer (EN):**

**Requirements:** SaaS B2B, customers in EU/US/India. EU data must stay in EU (GDPR), India data in India (DPDP), US has HIPAA tenants. Need <100ms global latency for read APIs.

**Architecture:**

```
                     ┌──────────────────────────────┐
                     │ Edge Layer (Cloudflare)      │
                     │ • Auth, rate limit, routing  │
                     │ • Read cache (KV per region) │
                     └─────────────┬────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
      ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
      │ EU Data Plane │  │ US Data Plane │  │ IN Data Plane │
      │ • Postgres    │  │ • Postgres    │  │ • Postgres    │
      │   eu-west-1   │  │   us-east-1   │  │   ap-south-1  │
      │ • R2 EU only  │  │ • S3 us-east  │  │ • R2 IN only  │
      │ • Vectorize   │  │ • Vectorize   │  │ • Vectorize   │
      └───────────────┘  └───────────────┘  └───────────────┘
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   ▼
                     ┌──────────────────────────────┐
                     │ Control Plane (US-East)      │
                     │ • Tenant config, billing     │
                     │ • Audit logs (replicated)    │
                     │ • Background jobs (Queues)   │
                     └──────────────────────────────┘
```

**Routing logic (edge):**

1. Worker receives request → extract `tenant_id` from JWT
2. Lookup `tenant → data_region` in KV (cached 5min)
3. Route to correct data plane via Hyperdrive
4. If wrong region accessed → 451 Unavailable For Legal Reasons

**Failure modes:**

- Data plane down → degraded read from cache (KV), writes 503 with retry
- Edge KV stale → max 60s drift acceptable for tenant routing
- Region failover: write to alternate region in same jurisdiction (eu-west-1 → eu-west-2)

**Observability:**

- OpenTelemetry traces with `tenant.id`, `data.region`, `pop.id` attributes
- Per-region SLO dashboard
- Compliance audit log: every cross-region access flagged

**VI reinforcement:**
Tách **edge layer** (compute, cache, routing) khỏi **data plane** (1 cái cho mỗi jurisdiction: EU/US/IN). Edge worker đọc tenant → region từ KV, route đến data plane đúng. Cross-region access bị chặn 451. Failure: degraded read từ cache, failover trong cùng jurisdiction. Quan sát: OTel trace có `tenant.id` + `region`, audit log mọi cross-region.

---

### B9. 🔴 [Senior] Đánh giá: nên migrate Lambda → Cloudflare Workers không?

**💡 Interview Signal:**

- ✅ **Strong:** Frame as decision matrix với criteria; nói cả case nên + không nên; tính TCO
- ❌ **Weak:** "Cloudflare rẻ hơn nên migrate" hoặc "Lambda enterprise hơn"

**Answer (EN — Bloom L5 Evaluate):**

**Decision criteria:**

| Criterion                             | Lambda wins                              | Workers wins           |
| ------------------------------------- | ---------------------------------------- | ---------------------- |
| Cold start matters                    | ❌ 200ms+                                | ✅ 5ms                 |
| Need Node native (sharp, bcrypt)      | ✅                                       | ❌                     |
| Bundle > 4MB                          | ✅                                       | ❌                     |
| AWS ecosystem (RDS, SQS, S3 internal) | ✅ near-zero egress                      | ❌ pays egress         |
| Global users (>3 regions)             | ❌ multi-region cost                     | ✅ 1 deploy = global   |
| Long-running (>15min)                 | ❌ Lambda max 15min, but better than 30s | ❌ Workers max 30s CPU |
| Stateful coordination                 | ❌ DynamoDB roundtrip                    | ✅ Durable Objects     |
| Observability tooling maturity        | ✅ X-Ray, CloudWatch deep                | 🟡 Improving           |
| Egress cost (heavy media)             | ❌ $0.09/GB                              | ✅ $0 (R2/Workers)     |
| Compliance/regulated industries       | ✅ HIPAA, FedRAMP                        | 🟡 SOC2, less coverage |

**Decision framework:**

- **Migrate to Workers when:** global low-latency required, traffic is HTTP-heavy, you're paying high AWS egress, app is stateless or coordinatable via DO
- **Keep Lambda when:** AWS data gravity (DB in RDS), need native deps, deep VPC integration, regulated industry needing FedRAMP

**Hybrid pattern (most common 2026):**
Edge (Workers) handles auth, routing, cache, light AI → forwards to Lambda/Fargate for heavy work via Hyperdrive or signed fetch.

**TCO example:** SaaS at 100M req/month, 50% cacheable, 30% need DB:

- All-Lambda: ~$2,500/mo (compute) + $800 egress = $3,300
- Workers + Lambda hybrid: ~$500 (Workers) + $800 (Lambda for 30% writes) + $0 egress = $1,300
- **Savings: 60%** + better latency

**VI reinforcement:**
Quyết định bằng **decision matrix**: Lambda thắng khi cần Node native, AWS data gravity, regulated industry. Workers thắng khi cần global low-latency, HTTP-heavy, egress cost cao. **2026 thường hybrid:** Workers ở edge (auth, cache, light AI) → forward Lambda cho heavy work. Tiết kiệm 60% TCO ở scale lớn.

---

### B10. 🔴 [Senior] Bạn được giao build "edge-native AI gateway" — kiến trúc?

**💡 Interview Signal:**

- ✅ **Strong:** Đa-tier routing (edge model + region model + frontier API), cost-aware, observability, failure modes
- ❌ **Weak:** "Proxy request đến OpenAI" (không phải gateway)

**Answer (EN — Bloom L6 Create):**

**Goals:** Single endpoint cho mọi internal team, route thông minh giữa Llama@edge / Mistral@region / Claude/GPT@frontier, cap cost, eval, observability.

**Architecture:**

```
┌──────────────────────────────────────────────────────────┐
│ Edge Layer (Cloudflare Worker)                           │
│ 1. Authn (API key → tenant)                              │
│ 2. Rate limit (Durable Object counter per tenant)        │
│ 3. PII scan (regex + small classifier)                   │
│ 4. Semantic cache lookup (Vectorize, top-k=1, sim>0.95)  │
│ 5. Routing decision:                                     │
│    - Classify task complexity (small Llama at edge)      │
│    - simple → Workers AI Llama 3.2 (PoP)                 │
│    - medium → Mistral 7B at region GPU pool              │
│    - hard → Claude Sonnet / GPT-4o (frontier)            │
│ 6. Stream response back                                  │
│ 7. Async: log to ClickHouse, eval sample to LLM-judge    │
└──────────────────────────────────────────────────────────┘
        │
        ├─→ Workers AI (edge GPU pool)
        ├─→ Region inference (Triton on GKE/EKS)
        └─→ Frontier API (Anthropic/OpenAI) via Queue retry

Data plane:
- Vectorize: semantic cache + RAG embeddings
- D1: tenant config, model preferences
- R2: prompt/response logs (compliance)
- Queues: async eval, billing rollup
```

**Cost controls:**

- Per-tenant monthly budget in DO; 80% → warn, 100% → 429
- Token-based pricing pass-through with markup
- Cache hit = $0 cost, ~50ms response (vs $0.01 + 500ms)

**Failure modes:**

- Frontier API down → fallback to region model with degraded quality flag
- Edge model OOM → fallback to region
- Eval-judge disagree threshold → flag for human review

**Observability:**

- OTel traces: `model.tier`, `cache.hit`, `pii.detected`, `cost.usd`
- Dashboards: P50/P99 latency per tier, cost per tenant per day, hallucination rate from eval

**VI reinforcement:**
Edge layer làm 7 việc: auth → rate limit → PII scan → cache lookup → routing (classify task → chọn tier) → stream → async log/eval. 3 tier model: Llama@edge (simple) / Mistral@region (medium) / Claude@frontier (hard). Cost: budget per tenant ở DO, cache hit miễn phí. Failure: fallback tier khi API down. Observability: OTel với tag tier/cache/cost.

---

## C. Study Cases & Synthesis

### C1. Tổng Quan / Overview

Edge computing 2026 không chỉ là "CDN cho code" — nó là **paradigm mới cho việc phân bổ compute và data**. Senior engineer cần biết:

1. **3 tier compute** (Edge V8 / Serverless container / Long-running) và khi nào dùng cái nào
2. **Stateful coordination ở edge** (Durable Objects, D1, KV) — strong consistency vẫn possible
3. **Data residency + compliance** (GDPR, DPDP, HIPAA) khi compute global
4. **AI inference at edge** — small models tại PoP, fallback frontier
5. **Hybrid architectures** — không phải all-or-nothing với cloud incumbent

### C2. Interview Q&A Summary

| #   | Question                              | Difficulty | Core Concept         | Key Signal                          |
| --- | ------------------------------------- | ---------- | -------------------- | ----------------------------------- |
| 1   | Edge vs Serverless function           | 🟢         | Runtime tiers        | Phân biệt V8 isolate vs container   |
| 2   | Cold start là gì                      | 🟢         | Performance          | Số liệu cụ thể từng platform        |
| 3   | Khi nào KHÔNG dùng edge               | 🟢         | Decision making      | Liệt kê constraints kỹ thuật        |
| 4   | Hyperdrive/Neon driver                | 🟡         | Database at edge     | Connection storm + pooling          |
| 5   | Edge Function vs Middleware vs Origin | 🟡         | Next.js architecture | Vẽ request flow                     |
| 6   | Stateful chat room global             | 🟡         | Durable Objects      | Single-writer + WS hibernation      |
| 7   | Edge caching personalized             | 🟡         | Cache safety         | Vary header + cache key composition |
| 8   | Multi-region SaaS + compliance        | 🔴         | Data residency       | Compute vs data plane separation    |
| 9   | Lambda vs Workers migration           | 🔴         | Trade-off analysis   | Decision matrix + TCO               |
| 10  | Edge-native AI gateway                | 🔴         | System design        | Multi-tier routing + cost + obs     |

### C3. ⚡ Cold Call Simulation

**Câu hỏi:** "Tell me about edge computing in 30 seconds."

**Answer (4 sentences, 30s):**

> "Edge computing means running code at hundreds of PoPs near users — Cloudflare Workers, Vercel Edge, Deno Deploy. The key win is V8 isolate cold start of ~5 milliseconds versus container cold start of 200 milliseconds to 2 seconds. You use it for stateless low-latency work like auth, A/B testing, caching, and increasingly small AI inference, while keeping heavy DB writes and native dependencies in regional serverless or containers. The 2026 pattern is hybrid: edge for the front door, region for the data plane, with Durable Objects for stateful coordination."

**Follow-up trap:** "But isn't edge just a faster CDN?"

**Recovery:**

> "No — CDN caches static responses. Edge runs your custom code per request. With Durable Objects you also get strong-consistent stateful coordination at the edge, which CDNs cannot do."

### C4. ✅ Self-Check (Close-Doc Retrieval)

Đóng tài liệu, tự trả lời 5 câu sau:

1. **Retrieval:** Liệt kê cold start time của V8 isolate, Firecracker, Container, VM.
2. **Visual:** Vẽ ASCII diagram cho Durable Object routing từ 2 PoP khác nhau.
3. **Application:** Bạn có app Next.js. API endpoint nào chuyển sang Edge runtime, cái nào giữ Serverless? Cho 3 ví dụ cụ thể mỗi loại.
4. **Debug:** App đột nhiên trả 502 random ở edge. Bạn debug như thế nào? (Hint: subrequest limit, CPU time, isolate evict)
5. **Teach:** Giải thích cho 1 backend engineer (chỉ biết EC2) tại sao Durable Objects khác Redis cluster.

### C5. 💬 Feynman Prompt

> Hãy giải thích **edge computing và cold start** cho 1 product manager, dùng analogy "chuỗi cửa hàng pizza" và **không dùng từ kỹ thuật nào** (no V8, no isolate, no container). Trong 3 phút.

### C6. 🔁 Spaced Repetition

| Lần | Khi nào  | Bài tập                                                                             |
| --- | -------- | ----------------------------------------------------------------------------------- |
| 1   | Hôm nay  | Đọc hết file, làm Self-Check                                                        |
| 2   | +1 ngày  | Vẽ lại 3 ASCII diagram (PoP routing, isolate vs container, DO chat room) từ trí nhớ |
| 3   | +3 ngày  | Trả lời lại B6, B8 (chat room + multi-region SaaS) trên giấy                        |
| 4   | +7 ngày  | Mock 1 system design: "Build edge-native rate limiter cho 1M tenants"               |
| 5   | +14 ngày | Đọc 1 case study thật: Cloudflare Discord blog hoặc Vercel Edge Functions GA post   |
| 6   | +30 ngày | Build 1 mini project: deploy Hello World Worker + Durable Object + KV trong 1 buổi  |
| 7   | Hàng quý | Update theo trend: WASI 0.2 component model, Workers AI new models, D1 features     |

### C7. 🔗 Connections

**Same track (2026 trends):**

- [LLM System Design](./02-llm-system-design.md) — edge inference tier trong AI gateway
- [Vector Databases](./03-vector-databases-embeddings.md) — Cloudflare Vectorize ở edge
- [Modern JS Runtimes](./05-modern-js-runtimes.md) — Bun/Deno cũng có edge story
- [React Server Components](./06-react-server-components-2026.md) — RSC trên Vercel Edge
- [Modern Observability](./11-modern-observability.md) — distributed tracing edge → region
- [Platform Engineering](./12-platform-engineering-dx.md) — golden paths cho edge deploy

**Cross-track:**

- [System Design — Caching & CDN](../shared/02-system-design/04-caching-cdn.md) — foundation
- [System Design — Microservices](../be-track/02-backend-knowledge/02-microservices.md) — edge thay đổi service boundary
- [Networking — HTTP/3, QUIC](../be-track/02-backend-knowledge/06-networking-go.md) — edge + HTTP/3 = peak speed
- [Next.js Advanced](../fe-track/04-nextjs/) — RSC + Edge + Serverless integration
- [Distributed Systems](../be-track/02-backend-knowledge/03-distributed-systems.md) — DO single-writer = consensus simplification
- [Security — Auth at Edge](../shared/04-security/) — JWT validation, mTLS at PoP

---

> **Senior insight cuối:** Câu hỏi "edge hay không" sai. Câu đúng là **"workload nào ở tier nào trong 3 tier compute?"** Engineer biết phân loại workload chính xác sẽ luôn ra kiến trúc tốt hơn engineer chọn 1 platform rồi nhồi mọi thứ vào.
