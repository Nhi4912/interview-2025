# Resilience Patterns

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Distributed Systems](./03-distributed-systems.md)
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Grab, 2019 incident:** Payment service gọi Fraud Detection service. Fraud Detection bị slow (200ms → 5s). Vì không có Circuit Breaker, tất cả payment threads block chờ Fraud Detection — payment service cũng dần đơ theo (cascading failure). Toàn bộ Grab payment down 8 phút. Fix: Circuit Breaker mở sau 5 failures liên tiếp, fallback sang "allow with manual review later".

**Bài học:** Distributed systems fail in unpredictable ways. Resilience patterns là "safety net" — không phải optional. Circuit Breaker, Retry với backoff, Timeout, và Bulkhead là bộ tứ cần biết trước khi làm bất kỳ service production nào.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Resilience patterns giống **hệ thống điện tử nhà bạn**:

- **Circuit Breaker** = cầu dao — khi quá tải, ngắt để bảo vệ toàn hệ thống
- **Bulkhead** = tường ngăn thủy thủ thuyền — một khoang thủng không chìm toàn tàu
- **Retry** = gọi điện lại khi bận — nhưng cần exponential backoff để không DDoS chính mình
- **Rate Limit** = giới hạn xe vào hầm — tránh tắc đường ở điểm nghẽn

## Concept Map / Bản Đồ Khái Niệm

```
[Request arrives at service]
        │
        ├── Rate Limiter → reject if too many requests (protect service)
        │
        ├── Circuit Breaker → fast fail if upstream is down (protect caller)
        │       States: Closed → Open (after N failures) → Half-Open (probe)
        │
        ├── Bulkhead → separate thread pools per dependency (prevent cascade)
        │
        ├── Timeout → don't wait forever (release resources)
        │
        └── Retry → retry on transient failures
                └── Exponential backoff + jitter (prevent thundering herd)
```

---

## Go Backend Interview Guide (Mid-Senior)

> Bilingual format: English question headings + Vietnamese explanations  
> Difficulty tags: `🟢 [Junior]`, `🟡 [Mid]`, `🔴 [Senior]`

---

## Overview / Tổng Quan

File này cover 7 nhóm Resilience Patterns thiết yếu cho Go Backend, từ load balancing đến adaptive backpressure:

| #   | Concept                              | Vai trò                                              | Interview Weight |
| --- | ------------------------------------ | ---------------------------------------------------- | ---------------- |
| 1   | Load Balancing Strategies            | Traffic distribution, health-aware routing           | ⭐⭐⭐⭐         |
| 2   | Circuit Breaker                      | Prevent cascade failure to unhealthy dependency      | ⭐⭐⭐⭐⭐       |
| 3   | Bulkhead Isolation                   | Resource partitioning, blast radius containment      | ⭐⭐⭐⭐         |
| 4   | Rate Limiting                        | Protect from overload, fair resource sharing         | ⭐⭐⭐⭐⭐       |
| 5   | Retry & Timeout                      | Recover transient failures, prevent goroutine leak   | ⭐⭐⭐⭐⭐       |
| 6   | Graceful Degradation & Health Checks | Reduce features under stress, K8s readiness/liveness | ⭐⭐⭐⭐         |
| 7   | Backpressure                         | Signal overload upstream, adaptive concurrency       | ⭐⭐⭐⭐         |

**Mối quan hệ:** Timeout → Retry → Circuit Breaker tạo thành defense chain. Bulkhead isolates blast radius. Rate Limiting protects ingress. Backpressure signals overload upstream. Health Checks inform LB decisions. Graceful Degradation reduces scope under stress. All patterns compose — interview expects you to combine them.

---

## Core Concepts — Deep Dive / Khái Niệm Cốt Lõi

### Concept 1: Load Balancing Strategies

> 🧠 **Memory Hook:** "LB = traffic cop at intersection — Round Robin counts cars, Least Connections watches queue length, Consistent Hashing remembers regular routes"

- **Why exists (Level 1):** Single server can't handle all traffic → distribute across multiple servers.
- **Why exists (Level 2):** Different algorithms for different needs: Round Robin for stateless, Least Connections for variable-cost requests, Consistent Hashing for caching (minimize redistribution on server add/remove). Health-check integration: remove unhealthy servers from pool.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hình dung trạm thu phí cao tốc với 5 làn xe. Nếu tất cả xe đổ vào 1 làn → tắc nghẽn. LB giống người điều phối: Round Robin chỉ xe vào làn theo lượt; Least Connections chỉ xe vào làn ít xe nhất; Consistent Hashing cho xe của cùng tỉnh luôn vào cùng một làn (để nhân viên quen mặt — giống cache hit, không phải xử lý lại từ đầu).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

1. Request đến LB
2. LB áp dụng algorithm để chọn backend
3. LB kiểm tra health status — không route vào unhealthy backend
4. Forward request, nhận response, trả về client

```
Round Robin:     req1→B1, req2→B2, req3→B3, req4→B1 ...
Least Conn:      B1:10  B2:5 ←chọn  B3:15
Consistent Hash: hash(user_id=123) → vnode42 → B2
                 hash(user_id=124) → vnode17 → B2  (same node → cache hit)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **LB là single point of failure**: bản thân LB cũng cần HA — dùng active-passive pair hoặc anycast DNS
- **Stale health state**: health check interval lớn → LB vẫn route vào backend vừa die — cần passive health check (observe errors) bổ sung active check
- **Hot keys với Consistent Hashing**: user cực active overload 1 node → dùng virtual nodes + bounded load để phân tán
- **Session affinity phá distribution**: sticky sessions → khi node die, user mất session và distribution bị lệch nghiêm trọng
- **Slow backend không bị eject**: Least Connections kém khi backend slow nhưng connections thấp → kết hợp latency EWMA để detect slow nodes

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm               | Tại sao sai                                                   | Đúng là                                                             |
| --------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| "Round Robin = fair"  | Request costs khác nhau; 1 heavy request ≠ 1 light request    | Dùng Least Connections hoặc weighted cho variable-cost workload     |
| "Thêm server là đủ"   | LB chính nó có thể thành bottleneck nếu không scale           | LB cũng cần scale: anycast, multiple LB tiers                       |
| "Health check = ping" | Ping chỉ check network reachability, không check dependencies | Deep health check: validate DB + cache connectivity trong readiness |

- **Interview Pattern:** "Design LB for caching layer" → Consistent hashing with virtual nodes. On node failure, only 1/N keys redistribute. Bounded load to prevent hot spots.

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Distributed Systems](./03-distributed-systems.md) — network partitions, node failures, CAP theorem
- ➡️ Để hiểu tiếp: [Circuit Breaker](#concept-2-circuit-breaker) — khi backend fail, breaker phối hợp với LB để fast-fail sớm

### Concept 2: Circuit Breaker

> 🧠 **Memory Hook:** "Circuit breaker = electrical fuse: too many shorts (failures) → fuse blows (open) → try small test (half-open) → reset if OK"

- **Why exists (Level 1):** When dependency fails, keep calling it = waste resources + cascade failure. Circuit breaker stops calls to failing dependency.
- **Why exists (Level 2):** 3 states: Closed (normal, counting failures) → Open (reject immediately, return fast error) → Half-Open (allow probe request, success→close, fail→open). Minimum request volume before tripping prevents false triggers on low traffic. Failure counting: only count 5xx and timeouts, not 4xx (client errors).
- **Why exists (Level 3):** Integration with retry: retry first, then breaker evaluates. With bulkhead: breaker per-dependency, bulkhead per-resource-pool. Monitoring: breaker state change = alert. In Go: `sony/gobreaker` or custom with atomic state machine.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Cầu dao điện trong nhà bạn. Khi quá nhiều thiết bị chạy cùng lúc (quá tải) → cầu dao nhảy (Open). Bạn không cứ cắm thêm thiết bị vào ổ chập điện — cầu dao ngắt bảo vệ toàn nhà. Sau vài phút, bạn thử bật lại (Half-Open) — nếu ổn thì dùng bình thường (Closed), nếu vẫn quá tải thì nhảy lại ngay.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
CLOSED ──(failures >= threshold)──► OPEN
  ▲                                   │
  │                              (after openTimeout)
  │                                   ▼
  └──(probe success)────────── HALF-OPEN
                                       │
                              (probe fail) ──► OPEN (lại)
```

1. **Closed**: request đi qua, đếm failures trong rolling window
2. **Open**: reject ngay (trả ErrOpen), không gọi dependency → fast fail
3. **Half-Open**: cho 1 probe request qua; success → Closed, fail → Open lại

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Minimum request volume**: traffic thấp → 1/5 request fail = 20% error rate, đủ trip breaker sai → cần min request threshold trước khi evaluate
- **4xx không nên trip breaker**: lỗi 404/400 là client error, dependency vẫn healthy → chỉ count 5xx và timeout
- **Open timeout quá ngắn**: breaker liên tục Half-Open → probe → fail → Open → flapping, không cho dependency thời gian recover
- **Shared breaker state**: nhiều instance có breaker state riêng → mỗi instance trip độc lập, không đồng bộ → cần centralized state (Redis) cho large deployments
- **Breaker che lỗi thật**: khi breaker Open, mọi request fail-fast → khó phân biệt dependency đã recover hay chưa nếu thiếu monitoring

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                | Tại sao sai                                                    | Đúng là                                                            |
| -------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------ |
| "Open breaker = service của mình down" | Breaker Open nghĩa là đang bảo vệ service khỏi dependency fail | Open breaker = dependency fail, service vẫn sống và trả fast error |
| "Count tất cả errors để trip breaker"  | 4xx là client errors, dependency vẫn healthy                   | Chỉ count 5xx + timeout; bỏ qua 4xx                                |
| "Fixed open timeout"                   | Dependency có thể recover nhanh hoặc chậm tùy loại failure     | Adaptive timeout: tăng dần nếu dependency chậm recover             |

- **Interview Pattern:** "How do you prevent cascading failures?" → Circuit breaker per dependency + timeout budget + retry budget (max 10% of traffic) + bulkhead isolation.

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Retry & Timeout](#concept-5-retry--timeout) — retry là bước trước circuit breaker; timeout triggers failure counting
- ➡️ Để hiểu tiếp: [Bulkhead Isolation](#concept-3-bulkhead-isolation) — bulkhead giới hạn resource, breaker giới hạn failure rate — dùng chung cho defense-in-depth

### Concept 3: Bulkhead Isolation

> 🧠 **Memory Hook:** "Bulkhead = ship compartments: water floods one compartment, but bulkhead walls prevent sinking the whole ship"

- **Why exists (Level 1):** One slow dependency shouldn't consume all goroutines/connections → isolate resource pools per dependency.
- **Why exists (Level 2):** Thread-pool isolation (Java Hystrix) vs semaphore isolation (Go preferred). In Go: buffered channel as semaphore (`make(chan struct{}, limit)`). When bulkhead full → reject immediately with 503, not block. Sizing: start with 2× expected concurrent calls to dependency.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tàu Titanic có các ngăn kín nước (bulkhead). Khi một ngăn thủng và ngập nước, các vách ngăn giữ nước không tràn sang ngăn khác. Service của bạn cũng vậy: nếu dependency Payment bị chậm, nó chỉ ăn hết pool 50 goroutine dành riêng cho Payment — không ảnh hưởng pool 100 goroutine dành cho Search hay Catalog.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Không có Bulkhead:
  [Payment slow] ──► goroutine1 ... goroutine500 (tất cả block chờ)
  [Search call]  ──► KHÔNG CÒN goroutine → 503!

Có Bulkhead:
  [Payment pool: max 50]  ──► goroutine1..50 (block, nhưng cô lập)
  [Search pool:  max 100] ──► goroutine1..100 vẫn phục vụ bình thường ✓
```

Implement trong Go:

1. `sem := make(chan struct{}, 50)` — buffered channel là semaphore
2. `select { case sem <- struct{}{}: ... default: return ErrFull }` — acquire hoặc reject
3. `defer func() { <-sem }()` — release sau khi xong

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Sizing quá nhỏ**: reject request hợp lệ → false positive 503 — cần monitor rejection rate và tune dựa trên load test
- **Sizing quá lớn**: bulkhead không hiệu quả — slow dependency vẫn ăn quá nhiều resource khi bị saturation
- **Goroutine rẻ nhưng connection/fd đắt**: tạo 10k goroutines được, nhưng 10k DB connections → OOM → bulkhead protect connections
- **Global limit ≠ bulkhead**: giới hạn tổng goroutine không cô lập blast radius — 1 dependency vẫn dùng hết quota toàn service
- **Bulkhead full → không retry**: retry khi bulkhead full = thêm áp lực lên dependency đang chậm → reject fast và trả 503

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                         | Đúng là                                                          |
| ---------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| "Goroutine rẻ nên Go không cần bulkhead" | Goroutine rẻ nhưng connections, file descriptors, memory không rẻ   | Bulkhead protect connections và fd, không chỉ goroutines         |
| "Global goroutine limit = bulkhead"      | Global limit không cô lập: 1 dependency dùng hết quota toàn service | Per-dependency semaphore: payment pool riêng, search pool riêng  |
| "Bulkhead full → retry"                  | Retry khi full = thêm áp lực lên dependency đang chậm               | Reject ngay (503), không retry; caller quyết định có retry không |

- **Interview Pattern:** "Bulkhead + Circuit Breaker — how do they work together?" → Bulkhead limits concurrency, breaker limits failure rate. Bulkhead triggers when dependency is slow, breaker triggers when dependency fails. Both reduce blast radius.

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Circuit Breaker](#concept-2-circuit-breaker) — breaker và bulkhead thường dùng cùng nhau cho defense-in-depth
- ➡️ Để hiểu tiếp: [Graceful Degradation](#concept-6-graceful-degradation--health-checks) — khi bulkhead full, cần fallback thay vì hard error

### Concept 4: Rate Limiting

> 🧠 **Memory Hook:** "Rate limiter = nightclub bouncer: Token Bucket lets burst in then slows down, Leaky Bucket maintains steady flow, Sliding Window counts heads precisely"

- **Why exists (Level 1):** Protect service from being overwhelmed by too many requests — whether malicious (DDoS) or legitimate (traffic spike).
- **Why exists (Level 2):** Token bucket: burst-friendly (bucket has N tokens, refills at R/sec). Leaky bucket: constant output rate. Sliding window: precise per-second counting. Distributed rate limiting: Redis + Lua for atomic check-and-increment. Key dimensions: per-user, per-IP, per-endpoint, per-tenant.
- **Why exists (Level 3):** Fail-open vs fail-closed when Redis fails: public APIs should fail-closed (deny), internal APIs can fail-open (allow). Response: HTTP 429 + Retry-After header + rate limit headers (X-RateLimit-Remaining). In Go: `golang.org/x/time/rate` for local, Redis Lua for distributed.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hình dung hầm Thủ Thiêm vào giờ cao điểm. Biển báo "Chỉ 500 xe/giờ được vào hầm". Bảo vệ đứng cổng đếm xe — đủ 500 xe rồi thì chặn lại, dù bạn có vé hay không. Token Bucket giống ví có sẵn 50 token — tiêu hết thì chờ nạp thêm; Sliding Window giống đếm xe trong 1 giờ gần nhất bất kể thời điểm nào bạn hỏi.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

| Algorithm      | Cơ chế                                                                     | Phù hợp                          |
| -------------- | -------------------------------------------------------------------------- | -------------------------------- |
| Token Bucket   | Bucket chứa N tokens, nạp R token/giây. Request tiêu 1 token. Hết → reject | Burst OK, API gateway phổ biến   |
| Leaky Bucket   | Queue đầu vào; xử lý đầu ra tốc độ cố định. Queue đầy → reject             | Smooth output, streaming         |
| Fixed Window   | Đếm request trong window cố định (VD: 00:00–00:59)                         | Đơn giản nhưng có boundary spike |
| Sliding Window | Đếm request trong N giây gần nhất tại mọi thời điểm                        | Chính xác nhất, tốn memory hơn   |

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Fixed Window boundary spike**: cuối window + đầu window tiếp theo có thể cho 2× limit (VD: 100 req lúc 00:59 + 100 req lúc 01:00 = 200 req trong 2 giây)
- **Redis failure policy**: fail-open (allow all) tốt cho internal APIs; fail-closed (deny all) tốt cho public APIs — cần quyết định trước incident, không phải trong incident
- **IP-based limiting bị phá bởi NAT**: nhiều user dùng chung IP (corporate proxy) → IP limit không fair → dùng API key/user_id làm key chính
- **Không phân biệt endpoint cost**: GET /list rẻ hơn POST /generate-report 100× → cần endpoint-specific limits thay vì global limit
- **Rate limit bypass qua distributed attack**: attacker dùng nhiều IP → cần WAF layer bổ sung; rate limit không phải security tool

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                          | Tại sao sai                                                                | Đúng là                                                          |
| -------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| "Rate limit ở app level là đủ"   | Infra level (CDN/LB) cần chặn trước khi request đến app, tiết kiệm compute | Rate limit ở nhiều layer: CDN → API Gateway → App                |
| "Cùng limit cho tất cả endpoint" | Read endpoint rẻ hơn write 10–100×; blanket limit quá strict hoặc quá lỏng | Endpoint-specific limits: GET 1000/min, POST write 100/min       |
| "Rate limit = security"          | Rate limit bảo vệ availability, không ngăn được attack phức tạp            | Kết hợp WAF cho security, rate limit cho availability protection |

- **Interview Pattern:** "Design distributed rate limiter" → Redis + Lua script for atomic increment + TTL. Sliding window counter: Redis sorted set with timestamp scores. Token bucket: Redis key with token count + last refill timestamp.

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [API Design](./01-api-design.md) — HTTP 429, Retry-After header, rate limit response format
- ➡️ Để hiểu tiếp: [Backpressure](#concept-7-backpressure) — rate limiting là ingress control; backpressure là internal flow control giữa các component

### Concept 5: Retry & Timeout

> 🧠 **Memory Hook:** "Timeout = alarm clock (don't wait forever), Retry = second chance (try again if failed), together = 'try 3 times but give up after 5 seconds total'"

- **Why exists (Level 1):** Network calls fail transiently. Without timeout → goroutine leaks. Without retry → unnecessary failures on temporary glitches.
- **Why exists (Level 2):** Exponential backoff + jitter prevents thundering herd. Retry budget: cap total retries at 10% of traffic to prevent amplification. Timeout budget: upstream timeout = sum of downstream timeouts + processing. Go context propagates deadline through call chain — `context.WithTimeout`.
- **Why exists (Level 3):** Retry amplification: service A retries 3×, calls B which retries 3× = 9 calls to C. Fix: retry only at edge, pass deadline context downstream. Idempotency key required for write retries — without it, retry can cause duplicate operations.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Gọi điện cho bạn nhưng bận máy. Timeout = bạn đợi tối đa 30 giây, nếu không nghe máy thì cúp. Retry = thử gọi lại lần 2, lần 3. Exponential backoff = lần 1 đợi 1s, lần 2 đợi 2s, lần 3 đợi 4s (không gọi liên tục làm phiền). Jitter = thêm ngẫu nhiên vài giây để không phải 1000 người cùng gọi lại đúng lúc 8:00 AM — tránh quá tải tổng đài.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
attempt 1 ──► [call] ──timeout──► FAIL
   │
   └─ wait: base * 2^0 + jitter = 100ms + 30ms
attempt 2 ──► [call] ──timeout──► FAIL
   │
   └─ wait: base * 2^1 + jitter = 200ms + 50ms
attempt 3 ──► [call] ───────────► SUCCESS ✓

Deadline awareness:
  remaining = deadline - now
  if remaining < min_needed → fail-fast ngay, không retry vô ích

Timeout budget chain (total 2000ms):
  API Gateway  2000ms
  └─ Service A 1500ms (xử lý + gọi B)
     └─ Service B 800ms (gọi DB)
        └─ DB query 300ms
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Retry amplification**: A(3×) → B(3×) → C = 9 calls; 3 tầng × 3 retries = 27 calls tới leaf service — chỉ retry ở edge, pass deadline context xuống
- **Non-idempotent write retry**: retry POST /payment không có idempotency key → double charge → luôn dùng idempotency key cho writes
- **Thundering herd**: 1000 clients timeout đồng thời → cùng retry sau đúng 1 giây → DDoS chính mình → jitter là bắt buộc
- **Context cancellation bị bỏ qua**: dùng `time.Sleep` thay `select { case <-time.After: case <-ctx.Done(): }` → goroutine tiếp tục chạy dù client đã cancel
- **Timeout quá conservative**: timeout 10s cho call thường 50ms → goroutine leak khi dependency hang → timeout nên ≈ p99 × 2–3

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                            | Tại sao sai                                                      | Đúng là                                                              |
| ---------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| "Retry mọi lỗi"                    | 4xx là client error, retry vô nghĩa và lãng phí quota            | Chỉ retry 5xx, timeout, network error; không retry 4xx               |
| "Fixed delay retry"                | Tất cả client retry cùng lúc → thundering herd, DDoS chính mình  | Exponential backoff + jitter: `base × 2^attempt + random(base)`      |
| "Internal calls không cần timeout" | Goroutine block vô hạn → pool cạn → cascade failure toàn service | Mọi network call phải có timeout qua `context.WithTimeout`           |
| "Timeout = time.Sleep"             | `time.Sleep` không cancel khi context cancel → goroutine leak    | Dùng `context.WithTimeout` + `select ctx.Done()` để cancel đúng cách |

- **Interview Pattern:** "Combine timeout + retry + breaker safely" → Check deadline remaining → check breaker state → retry transient only → backoff + jitter → stop before deadline exhaustion → breaker counts final result.

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Distributed Systems](./03-distributed-systems.md) — network failures, partial failures, transient vs permanent errors
- ➡️ Để hiểu tiếp: [Circuit Breaker](#concept-2-circuit-breaker) — retry là lớp đầu; khi failures liên tiếp, circuit breaker ngắt để bảo vệ toàn hệ thống

### Concept 6: Graceful Degradation & Health Checks

> 🧠 **Memory Hook:** "Degradation = airplane losing an engine (still flies but slower), Health Checks = instrument panel (liveness = engine running, readiness = cleared for passengers)"

- **Why exists (Level 1):** Under stress, better to serve reduced functionality than crash entirely. K8s needs to know if pod is alive (liveness) and can accept traffic (readiness).
- **Why exists (Level 2):** Graceful degradation strategies: disable non-critical features (recommendations), return cached data, reduce response richness, priority-based shedding. Liveness: is process alive? Fail → K8s restarts pod. Readiness: can accept traffic? Fail → K8s removes from service endpoints. Deep health check: verify DB + cache connectivity in readiness.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Máy bay mất 1 động cơ (trong 4 động cơ). Phi công không đáp khẩn cấp ngay — máy bay vẫn bay được với 3 động cơ, chỉ chậm hơn và hạn chế hành lý. Liveness = đèn báo "động cơ có chạy không". Readiness = clearance từ kiểm soát không lưu "máy bay sẵn sàng chở khách chưa". Hai thứ khác nhau: động cơ chạy nhưng chưa nạp đủ nhiên liệu thì vẫn chưa ready.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
K8s Probe Flow:
  Liveness  ──fail──► K8s restarts pod   (process crashed / deadlocked)
  Readiness ──fail──► K8s removes pod from Service endpoints (no traffic)
                       (pod stays alive, waiting to recover dependencies)

Graceful Degradation tiers:
  Normal:    Core + Recommendations + Analytics
  Stressed:  Core + Recommendations  (analytics disabled)
  Critical:  Core only               (recommendations off, serve cached)
  Emergency: Core + stale cache      (DB degraded, circuit breaker open)
```

| Probe     | Kiểm tra                      | Fail action    | Nên check dependencies?          |
| --------- | ----------------------------- | -------------- | -------------------------------- |
| Liveness  | Process alive, không deadlock | Restart pod    | ❌ KHÔNG — gây restart loop      |
| Readiness | Có thể serve traffic          | Remove khỏi LB | ✅ CÓ — DB, cache, critical deps |

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Liveness check dependencies → restart loop**: DB down + liveness check DB → pod restart → DB still down → infinite restart → K8s CrashLoopBackOff
- **Readiness quá strict**: optional dependency fail → readiness fail → ALL instances removed → toàn bộ service down (tệ hơn cả partial outage)
- **Degradation path không được test**: fallback code chạy lần đầu trong production → có bugs riêng → test fallback paths trong staging như test bình thường
- **Stale cache không có timestamp**: user nhận data cũ mà không biết → cần metadata `"degraded": true` và `"data_age": "5m"` trong response
- **Priority shedding cần header propagation**: P0 traffic cần mang priority header xuyên service mesh để không bị shed ở hop cuối

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                   | Tại sao sai                                                           | Đúng là                                                                |
| ----------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| "Liveness check dependencies (DB, Redis)" | DB down → liveness fail → K8s restart pod liên tục dù process healthy | Liveness chỉ check process health; dependencies thuộc readiness        |
| "Degradation = hiện trang lỗi"            | User thấy error page = bad UX, không graceful                         | Trả response đầy đủ với feature phụ bị disable; set `"degraded": true` |
| "Health check luôn trả 200"               | Che giấu real state, LB route vào instance không sẵn sàng             | Health check phản ánh actual dependency state với timeout ngắn         |

- **Interview Pattern:** "Liveness healthy but users get 503 — why?" → Liveness only checks process alive. 503 from: breaker open, readiness failed (removed from LB), dependency down, queue saturated.

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Bulkhead Isolation](#concept-3-bulkhead-isolation) — khi bulkhead full, degradation quyết định trả gì thay vì hard fail
- ➡️ Để hiểu tiếp: [Load Balancing Strategies](#concept-1-load-balancing-strategies) — readiness probe kết hợp với LB để route traffic chỉ vào instance đang healthy

### Concept 7: Backpressure

> 🧠 **Memory Hook:** "Backpressure = highway on-ramp meter: when highway is full, traffic light slows cars entering to prevent gridlock"

- **Why exists (Level 1):** When consumer can't keep up with producer, need to signal upstream to slow down — otherwise queue grows unbounded → OOM.
- **Why exists (Level 2):** Go channels naturally create backpressure: buffered channel full → sender blocks. Bounded queue with rejection: `select { case queue <- job: default: reject() }`. Adaptive concurrency limiting: Vegas/AIMD algorithm adjusts concurrency based on latency signals.
- **Why exists (Level 3):** AIMD (Additive Increase Multiplicative Decrease): increase limit by 1 on success, halve on latency spike. Production: Netflix concurrency-limits library inspired. Metrics: queue depth, rejection rate, p99 latency. Backpressure vs rate limiting: rate limiting is ingress control (per-client), backpressure is internal flow control (per-component).

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Đèn đỏ ở điểm nhập cao tốc Hà Nội giờ cao điểm. Khi cao tốc đang kẹt (consumer chậm), đèn tín hiệu bật đỏ để xe (producer) ở lại đường dẫn — không cho thêm xe vào. Nếu không có đèn này, xe cứ vào → cao tốc nghẽn hoàn toàn → tất cả kẹt. Backpressure = đèn đó: tín hiệu ngược lại cho upstream "hãy chậm lại, tôi chưa xử lý kịp".

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Producer ──► [Bounded Queue: cap=100] ──► Consumer workers
              │
              ├── depth < 80%:  accept ✓
              ├── depth 80–95%: accept + warn (slow down hint)
              └── depth >= 95%: reject 503 + Retry-After ✗

AIMD Adaptive Concurrency:
  On success (latency < target): limit += 1        (additive increase)
  On spike   (latency > target): limit = limit / 2 (multiplicative decrease)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Unbounded queue = OOM time bomb**: `make(chan Task)` không bounded → queue tăng tới khi hết RAM → crash toàn service
- **Backpressure không propagate upstream**: service B reject nhưng service A retry ngay → vẫn overload — cần Retry-After header và caller tôn trọng nó
- **AIMD oscillation**: limit giảm một nửa quá nhanh → throughput drop đột ngột → cần smooth decrease (VD: giảm 10% thay vì 50%)
- **Queue depth metric lag**: monitor queue depth với scrape interval 15s → miss burst trong 15 giây → dùng histogram và alert trên rate of change
- **Drop vs slow down**: drop request (reject 503) nhanh hơn slow down (block producer) nhưng cần caller có retry logic đúng cách

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                         | Tại sao sai                                                                 | Đúng là                                                                  |
| ------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| "Unbounded channel = linh hoạt" | Queue tăng vô hạn → OOM khi load cao → toàn service crash                   | Dùng bounded channel với capacity rõ ràng; monitor queue depth           |
| "Backpressure = drop requests"  | Drop ngay là load shedding; backpressure là slow down trước, drop sau       | Signal upstream slow down trước (Retry-After); drop chỉ khi queue đầy    |
| "Backpressure = Rate Limiting"  | Rate limiting là external per-client; backpressure là internal flow control | Dùng cả hai: rate limit ở ingress, backpressure giữa internal components |

- **Interview Pattern:** "How do you handle producer faster than consumer in Go?" → Bounded channel as queue. Full → reject or apply backpressure (return 503 with Retry-After). Monitor queue depth. Adaptive concurrency if load varies.

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Rate Limiting](#concept-4-rate-limiting) — rate limiting là ingress; backpressure là internal — hai layer bổ sung nhau
- ➡️ Để hiểu tiếp: [Graceful Degradation](#concept-6-graceful-degradation--health-checks) — khi backpressure signal, degradation quyết định serve gì với capacity còn lại

---

## Table of Contents

1. [Load Balancing Strategies](#1-load-balancing-strategies) 2. [Circuit Breaker Pattern](#2-circuit-breaker-pattern) 3. [Bulkhead Isolation](#3-bulkhead-isolation) 4. [Rate Limiting](#4-rate-limiting) 5. [Retry Patterns](#5-retry-patterns) 6. [Timeout Patterns](#6-timeout-patterns) 7. [Graceful Degradation](#7-graceful-degradation) 8. [Health Checks](#8-health-checks) 9. [Backpressure](#9-backpressure)
2. [Interview Q&A Section](#10-interview-qa-section)

Related references:

- Networking: [`./06-networking-go.md`](./06-networking-go.md)
- Microservices: [`./02-microservices.md`](./02-microservices.md)
- Distributed systems: [`./03-distributed-systems.md`](./03-distributed-systems.md)
- API design: [`./01-api-design.md`](./01-api-design.md)
- Auth/security: [`./04-auth-security.md`](./04-auth-security.md)
- Distributed patterns: [`../04-be-system-design/04-distributed-patterns.md`](../04-be-system-design/04-distributed-patterns.md)
- Shared system design: [`../../shared/02-system-design/system-design-theory.md`](../../shared/02-system-design/system-design-theory.md)

---

## 1. Load Balancing Strategies

### Q: What is load balancing and why is it required in backend systems? 🟢 [Junior]

**A:** Load balancing là kỹ thuật phân phối request đến nhiều instance backend.

Mục tiêu chính:

- tránh quá tải một node
- tăng availability
- tăng throughput
- giảm tail latency

Nếu không có LB:

- một node nóng sẽ fail trước
- SLA tổng bị ảnh hưởng dù các node khác còn rảnh

---

### Q: Compare round-robin and least-connections. 🟢 [Junior]

**A:** Round-robin:

- đơn giản
- request đi tuần tự qua các node
- phù hợp khi request cost tương đối đồng đều

Least-connections:

- chọn node có ít kết nối active nhất
- phù hợp khi request duration lệch nhau
- cần state realtime

Nên nhớ:

- round-robin dễ predict
- least-connections thường tốt hơn cho workload biến động

---

### Q: Why do weighted strategies matter in production? 🟡 [Mid]

**A:** Production cluster thường không đồng nhất.

Ví dụ:

- node loại c7g.large
- node loại c7g.xlarge
- canary node chỉ muốn 5% traffic

Weighted strategy giúp:

- tận dụng năng lực node
- giảm quá tải node yếu
- rollout an toàn hơn

---

### Q: What problem does consistent hashing solve? 🟡 [Mid]

**A:** Consistent hashing giảm remap keys khi số node thay đổi.

Phù hợp khi route theo key:

- user_id
- tenant_id
- session_id

Lợi ích:

- giảm cache churn
- giữ locality
- giảm blast radius khi autoscale

Lưu ý:

- nên dùng virtual nodes
- cần monitor hot keys

---

### Q: How should health checks be integrated with load balancing? 🟡 [Mid]

**A:** LB phải health-aware.

Nên kết hợp:

- active checks
- passive checks

Best practices:

- readiness để route decision
- hysteresis để tránh flap
- slow start khi node recover
- draining khi node rời pool

---

### Q: Show a simple weighted least-connections picker in Go. 🔴 [Senior]

**A:**

```go
package lb

import (
	"errors"
	"math"
	"sync"
)

type Backend struct {
	ID      string
	Weight  int
	Conns   int
	Healthy bool
}

type Picker struct {
	mu       sync.Mutex
	backends []*Backend
}

func NewPicker(backends []*Backend) *Picker {
	return &Picker{backends: backends}
}

func (p *Picker) Pick() (*Backend, error) {
	p.mu.Lock()
	defer p.mu.Unlock()

	var best *Backend
	bestScore := math.MaxFloat64

	for _, b := range p.backends {
		if !b.Healthy || b.Weight <= 0 {
			continue
		}
		score := (float64(b.Conns) + 1) / float64(b.Weight)
		if score < bestScore {
			bestScore = score
			best = b
		}
	}

	if best == nil {
		return nil, errors.New("no healthy backend")
	}

	best.Conns++
	return best, nil
}

func (p *Picker) Done(id string) {
	p.mu.Lock()
	defer p.mu.Unlock()

	for _, b := range p.backends {
		if b.ID == id && b.Conns > 0 {
			b.Conns--
			return
		}
	}
}
```

Gợi ý production:

- thêm latency EWMA
- thêm error penalty
- thêm outlier ejection

---

### Q: Which load balancing metrics should be monitored? 🟡 [Mid]

**A:** Distribution:

- requests per backend
- active connections per backend

Quality:

- p95/p99 latency per backend
- error rate per backend

Stability:

- ejection/recovery count
- route churn

---

## 2. Circuit Breaker Pattern

### Q: What is a circuit breaker and why do we use it? 🟢 [Junior]

**A:** Circuit breaker fail-fast khi dependency unhealthy.

Mục tiêu:

- giảm pressure lên dependency lỗi
- bảo vệ tài nguyên caller
- ngăn cascading failures

Không có breaker, retry + timeout thường làm tình hình tệ hơn.

---

### Q: Explain circuit breaker states: closed/open/half-open. 🟢 [Junior]

**A:** Closed:

- request đi qua bình thường

Open:

- chặn request
- fail-fast hoặc fallback

Half-open:

- cho một lượng nhỏ request thăm dò
- nếu ổn định -> closed
- nếu fail -> open lại

---

### Q: Which failures should be counted for breaker trip? 🟡 [Mid]

**A:** Nên count:

- timeout
- network errors
- 5xx

Thường không count:

- 4xx do input/business

Sai error classification là lý do breaker hoạt động kém.

---

### Q: Why do we need minimum request volume before opening? 🟡 [Mid]

**A:** Traffic thấp có nhiễu cao.

Nếu không có min volume, vài request lỗi có thể trip breaker sai.

Vì vậy nên dùng điều kiện kép:

- error rate threshold
- request count threshold

---

### Q: Show a minimal circuit breaker in Go. 🟡 [Mid]

**A:**

```go
package cb

import (
	"errors"
	"sync"
	"time"
)

type State int

const (
	Closed State = iota
	Open
	HalfOpen
)

var ErrOpen = errors.New("circuit open")

type Breaker struct {
	mu sync.Mutex

	state State

	failures int
	success  int

	threshold int
	needPass  int
	openFor   time.Duration
	openedAt  time.Time
}

func NewBreaker(threshold int, needPass int, openFor time.Duration) *Breaker {
	return &Breaker{state: Closed, threshold: threshold, needPass: needPass, openFor: openFor}
}

func (b *Breaker) Execute(fn func() error) error {
	b.mu.Lock()
	if b.state == Open {
		if time.Since(b.openedAt) < b.openFor {
			b.mu.Unlock()
			return ErrOpen
		}
		b.state = HalfOpen
		b.success = 0
	}
	b.mu.Unlock()

	err := fn()

	b.mu.Lock()
	defer b.mu.Unlock()

	if err != nil {
		b.failures++
		if b.state == HalfOpen || b.failures >= b.threshold {
			b.state = Open
			b.openedAt = time.Now()
		}
		return err
	}

	if b.state == HalfOpen {
		b.success++
		if b.success >= b.needPass {
			b.state = Closed
			b.failures = 0
			b.success = 0
		}
	} else {
		b.failures = 0
	}

	return nil
}
```

---

### Q: How do you configure breaker thresholds and open timeout? 🔴 [Senior]

**A:** Không có một số “chuẩn” cho mọi service.

Cách tiếp cận:

1. định nghĩa error classes 2. chọn rolling window 3. chọn min request volume 4. đặt threshold theo SLO 5. tune open timeout theo recovery behavior

Sai lầm:

- threshold quá nhạy
- threshold quá lỏng

---

### Q: What should be monitored for circuit breakers? 🟡 [Mid]

**A:**

- breaker state
- transitions
- rejected request count
- half-open success/failure
- dependency latency/error

Nên alert khi:

- breaker open kéo dài
- reject rate tăng bất thường

---

### Q: How should retry interact with circuit breaker? 🔴 [Senior]

**A:** Retry chỉ cho transient errors. Nếu breaker open -> fail-fast.

Retry policy cần:

- backoff
- jitter
- retry budget
- deadline awareness

Mục tiêu: tránh retry storm.

---

## 3. Bulkhead Isolation

### Q: What is bulkhead isolation? 🟢 [Junior]

**A:** Bulkhead là pattern chia tài nguyên thành nhiều ngăn cách ly.

Nếu một dependency bị nghẽn, không kéo sập toàn service.

Ví dụ:

- pool riêng cho payment
- pool riêng cho recommendation

---

### Q: Why do Go services still need bulkheads? 🟡 [Mid]

**A:** Goroutine nhẹ, nhưng không vô hạn.

Không giới hạn concurrency:

- goroutine tăng mất kiểm soát
- memory pressure
- scheduler contention

Bulkhead giúp đặt upper bound rõ ràng.

---

### Q: Compare thread-pool isolation and semaphore isolation. 🟡 [Mid]

**A:** Thread/worker pool isolation:

- phù hợp queue jobs
- throughput control rõ

Semaphore isolation:

- phù hợp outbound calls realtime
- nhẹ và trực tiếp

Trong API request path, semaphore thường practical hơn.

---

### Q: Show semaphore bulkhead in Go. 🟡 [Mid]

**A:**

```go
package bulkhead

import (
	"context"
	"errors"
)

var ErrFull = errors.New("bulkhead full")

type Bulkhead struct {
	sem chan struct{}
}

func New(capacity int) *Bulkhead {
	return &Bulkhead{sem: make(chan struct{}, capacity)}
}

func (b *Bulkhead) Execute(ctx context.Context, fn func(context.Context) error) error {
	select {
	case b.sem <- struct{}{}:
		defer func() { <-b.sem }()
		return fn(ctx)
	case <-ctx.Done():
		return ctx.Err()
	default:
		return ErrFull
	}
}
```

---

### Q: How should bulkhead capacity be sized? 🔴 [Senior]

**A:** Inputs:

- dependency latency profile
- throughput target
- CPU/memory limits
- connection limits
- business criticality

Quy trình:

1. bắt đầu conservative 2. load test 3. quan sát saturation + p99 4. tune iteratively

---

### Q: What response should be returned when bulkhead is full? 🟡 [Mid]

**A:** Tuỳ semantics, trả `429` hoặc `503`.

Nên kèm:

- machine-readable error code
- optional retry hint
- telemetry event

Fail-fast có kiểm soát tốt hơn block vô hạn.

---

### Q: How does bulkhead complement circuit breaker? 🟡 [Mid]

**A:** Bulkhead:

- giới hạn local resource consumption

Circuit breaker:

- dừng gọi dependency unhealthy

Kết hợp:

- giảm pressure
- giảm blast radius
- bảo vệ core path

---

## 4. Rate Limiting

### Q: Why do backend APIs need rate limits? 🟢 [Junior]

**A:** Rate limiting để:

- chống abuse
- bảo vệ tài nguyên
- đảm bảo fairness
- giảm burst impact

Không có limiter, một nhóm client có thể làm degrade toàn hệ thống.

---

### Q: Compare token bucket, leaky bucket, and sliding window. 🟡 [Mid]

**A:** Token bucket:

- cho burst ngắn
- rất phổ biến ở API gateway

Leaky bucket:

- làm phẳng output flow

Sliding window:

- fairness tốt hơn fixed window
- implementation tốn cost hơn

---

### Q: Show token bucket in Go. 🟡 [Mid]

**A:**

```go
package ratelimit

import (
	"sync"
	"time"
)

type Bucket struct {
	mu sync.Mutex

	cap    float64
	rate   float64
	tokens float64
	last   time.Time
}

func NewBucket(capacity int, rate float64) *Bucket {
	return &Bucket{
		cap:    float64(capacity),
		rate:   rate,
		tokens: float64(capacity),
		last:   time.Now(),
	}
}

func (b *Bucket) Allow(cost float64) bool {
	b.mu.Lock()
	defer b.mu.Unlock()

	now := time.Now()
	delta := now.Sub(b.last).Seconds()
	b.tokens += delta * b.rate
	if b.tokens > b.cap {
		b.tokens = b.cap
	}
	b.last = now

	if b.tokens < cost {
		return false
	}
	b.tokens -= cost
	return true
}
```

---

### Q: How do you implement distributed rate limiting with Redis? 🔴 [Senior]

**A:** Dùng Redis shared state + Lua atomic script.

```lua
-- KEYS[1] key
-- ARGV[1] limit
-- ARGV[2] ttl
local c = redis.call("INCR", KEYS[1])
if c == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[2])
end
if c > tonumber(ARGV[1]) then
  return 0
end
return 1
```

Trade-offs:

- network latency
- limiter dependency outage
- multi-region consistency

---

### Q: Which dimensions should be used as rate-limit keys? 🟡 [Mid]

**A:** Nên kết hợp:

- tenant_id
- user_id
- API key
- endpoint group

Không nên chỉ dựa IP, vì NAT làm identity không chính xác.

---

### Q: What should a rate-limited response include? 🟢 [Junior]

**A:** Nên trả:

- HTTP `429`
- `Retry-After`
- optional `X-RateLimit-*`
- machine-readable error payload

Điều này giúp client retry đúng cách.

---

### Q: Fail-open or fail-closed when limiter backend fails? 🔴 [Senior]

**A:** Risk-based decision:

- high-risk writes -> thường fail-closed
- low-risk reads -> có thể fail-open có kiểm soát

Quan trọng:

- chính sách phải có trước incident

---

## 5. Retry Patterns

### Q: When should retries be used? 🟢 [Junior]

**A:** Retry cho lỗi transient:

- network blip
- short timeout
- 503/504
- 429 with retry hint

Không retry cho:

- validation errors
- auth errors
- non-idempotent writes không có bảo vệ

---

### Q: Why use exponential backoff + jitter? 🟡 [Mid]

**A:** Backoff giảm pressure dần theo attempt. Jitter tránh synchronized retries.

Không jitter dễ tạo retry storm.

Nên có:

- max attempts
- max delay cap

---

### Q: Show retry helper in Go. 🟡 [Mid]

**A:**

```go
package retry

import (
	"context"
	"math/rand"
	"time"
)

type ShouldRetry func(error) bool

func Do(ctx context.Context, attempts int, base time.Duration, should ShouldRetry, fn func(context.Context) error) error {
	if attempts < 1 {
		attempts = 1
	}
	if base <= 0 {
		base = 100 * time.Millisecond
	}

	var last error
	for i := 1; i <= attempts; i++ {
		err := fn(ctx)
		if err == nil {
			return nil
		}
		last = err

		if should != nil && !should(err) {
			return err
		}
		if i == attempts {
			break
		}

		d := base * time.Duration(1<<(i-1))
		if d > 2*time.Second {
			d = 2 * time.Second
		}
		j := time.Duration(rand.Int63n(int64(d) + 1))

		select {
		case <-time.After(j):
		case <-ctx.Done():
			return ctx.Err()
		}
	}

	return last
}
```

---

### Q: What is retry budget and why is it useful? 🔴 [Senior]

**A:** Retry budget giới hạn tổng retries trong một window.

Ví dụ:

- budget 20%
- 1000 original requests
- tối đa 200 retries

Lợi ích:

- tránh amplification
- bảo vệ dependency degraded

---

### Q: Why does idempotency matter for write retries? 🟡 [Mid]

**A:** Retry write không idempotent gây duplicate side effects.

Ví dụ:

- double charge
- duplicate order

Giải pháp:

- idempotency key
- lưu result theo key
- trả lại response cũ cho duplicate requests

---

### Q: How does retry amplification happen? 🔴 [Senior]

**A:** Nhiều tầng retry độc lập sẽ nhân downstream calls.

Ví dụ:

- 3 tầng
- mỗi tầng 3 attempts
- tối đa 27 calls

Giảm bằng:

- centralized retry policy
- retry budget
- circuit-aware retry

---

## 6. Timeout Patterns

### Q: Why are timeouts mandatory? 🟢 [Junior]

**A:** Timeout giới hạn waiting time.

Không timeout:

- request treo
- pool cạn
- goroutine leak
- latency cascade

Timeout là control bắt buộc trong distributed systems.

---

### Q: How does Go context help timeout propagation? 🟢 [Junior]

**A:** `context.Context` truyền deadline/cancel xuyên call chain.

Khi parent timeout, child operations cancel theo.

Best practices:

- luôn truyền context
- tránh detached context trong request path

---

### Q: Show context timeout usage in handler. 🟢 [Junior]

**A:**

```go
func Handler(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 700*time.Millisecond)
	defer cancel()

	if err := callService(ctx); err != nil {
		http.Error(w, err.Error(), http.StatusGatewayTimeout)
		return
	}

	w.WriteHeader(http.StatusOK)
}
```

---

### Q: Which net/http timeout knobs matter most? 🟡 [Mid]

**A:**

```go
transport := &http.Transport{
	MaxIdleConns:          200,
	MaxIdleConnsPerHost:   50,
	IdleConnTimeout:       90 * time.Second,
	TLSHandshakeTimeout:   2 * time.Second,
	ResponseHeaderTimeout: 2 * time.Second,
}

client := &http.Client{
	Transport: transport,
	Timeout:   4 * time.Second,
}
```

`Client.Timeout` là hard cap, nhưng transport settings cũng cần tune.

---

### Q: What is cascading timeout budget? 🔴 [Senior]

**A:** Cascading budget = chia deadline tổng thành budgets cho từng hop.

Ví dụ 1200ms:

- app logic 200ms
- DB 350ms
- downstream 400ms
- buffer 250ms

Nếu remaining budget quá thấp, fail-fast tốt hơn gọi vô ích.

---

### Q: Show budget-aware helper in Go. 🔴 [Senior]

**A:**

```go
package timeoutx

import (
	"context"
	"errors"
	"time"
)

var ErrInsufficientBudget = errors.New("insufficient budget")

func WithBudget(parent context.Context, need time.Duration) (context.Context, context.CancelFunc, error) {
	if dl, ok := parent.Deadline(); ok {
		if time.Until(dl) <= need {
			return nil, nil, ErrInsufficientBudget
		}
	}
	ctx, cancel := context.WithTimeout(parent, need)
	return ctx, cancel, nil
}
```

---

### Q: What are common timeout anti-patterns? 🟡 [Mid]

**A:**

- timeout quá dài vì sợ false timeout
- quên `cancel()` context
- retry ignore remaining deadline
- timeout mismatch giữa gateway và service
- detached background contexts

---

## 7. Graceful Degradation

### Q: What is graceful degradation? 🟢 [Junior]

**A:** Graceful degradation là giữ core flow hoạt động, giảm quality hoặc tắt feature phụ khi hệ thống stress.

Ví dụ:

- checkout vẫn chạy
- recommendation tạm tắt

Mục tiêu: tránh full outage.

---

### Q: Graceful degradation vs graceful shutdown? 🟢 [Junior]

**A:** Graceful degradation:

- runtime behavior dưới lỗi/quá tải

Graceful shutdown:

- dừng service an toàn khi deploy/restart

Đây là hai khái niệm khác nhau.

---

### Q: How do feature flags support degradation? 🟡 [Mid]

**A:** Feature flags cho phép:

- tắt nhanh module nặng
- rollback behavior không redeploy
- rollout fallback theo cohort

Best practices:

- owner rõ
- expiry date
- observability theo variant

---

### Q: Show partial response fallback in Go. 🟡 [Mid]

**A:**

```go
type HomeResponse struct {
	Core     any      `json:"core"`
	Reco     []any    `json:"reco,omitempty"`
	Warnings []string `json:"warnings,omitempty"`
	Degraded bool     `json:"degraded"`
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	resp := HomeResponse{}

	core, err := loadCore(ctx)
	if err != nil {
		http.Error(w, "core unavailable", http.StatusServiceUnavailable)
		return
	}
	resp.Core = core

	reco, err := loadReco(ctx)
	if err != nil {
		resp.Degraded = true
		resp.Warnings = append(resp.Warnings, "recommendation unavailable")
	} else {
		resp.Reco = reco
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(resp)
}
```

---

### Q: What is priority-based shedding? 🔴 [Senior]

**A:** Priority shedding là drop traffic ưu tiên thấp trước.

Ví dụ:

- P0: auth/payment
- P1: search
- P2: recommendation

Khi overload:

- drop P2
- giữ P0 lâu nhất

---

### Q: What are degradation anti-patterns? 🟡 [Mid]

**A:**

- fake success cho critical writes
- stale data không timestamp
- fallback path không test
- optional dependency block core path
- không có degraded markers

---

## 8. Health Checks

### Q: What is liveness probe? 🟢 [Junior]

**A:** Liveness probe trả lời: process còn sống không.

Nếu fail, orchestrator restart container.

Liveness endpoint nên lightweight.

---

### Q: What is readiness probe? 🟢 [Junior]

**A:** Readiness probe trả lời: instance có sẵn sàng nhận traffic không.

Nếu fail, LB ngừng route vào instance.

Readiness fail không đồng nghĩa process crash.

---

### Q: Why separate liveness and readiness? 🟡 [Mid]

**A:** Nếu gộp chung, dependency outage có thể gây restart loop.

Separation giúp:

- liveness = process health
- readiness = serving capability

---

### Q: Show liveness/readiness handlers in Go. 🟡 [Mid]

**A:**

```go
type Deps struct {
	DB    func(context.Context) error
	Redis func(context.Context) error
}

func LivenessHandler(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte("ok"))
}

func ReadinessHandler(d Deps) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 200*time.Millisecond)
		defer cancel()

		if err := d.DB(ctx); err != nil {
			http.Error(w, "db not ready", http.StatusServiceUnavailable)
			return
		}
		if err := d.Redis(ctx); err != nil {
			http.Error(w, "redis not ready", http.StatusServiceUnavailable)
			return
		}

		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ready"))
	}
}
```

---

### Q: What is deep health check and what are trade-offs? 🔴 [Senior]

**A:** Deep health check kiểm tra sâu dependency critical.

Ưu điểm:

- route decision chính xác hơn

Nhược điểm:

- tốn tài nguyên hơn
- dễ gây probe storm nếu cấu hình sai

Best practice:

- timeout ngắn
- jitter
- cache ngắn hạn

---

### Q: Should optional dependency failure fail readiness? 🟡 [Mid]

**A:** Không bắt buộc.

Nếu optional dependency có fallback, instance có thể vẫn ready.

Nhưng cần:

- degraded metrics
- degraded logs
- runbook rõ ràng

---

## 9. Backpressure

### Q: What is backpressure? 🟢 [Junior]

**A:** Backpressure là cơ chế phản hồi ngược khi downstream nghẽn.

Không có backpressure:

- queue growth vô hạn
- memory pressure
- latency collapse

Backpressure giữ hệ thống ổn định hơn dưới tải cao.

---

### Q: How do Go channels naturally create backpressure? 🟢 [Junior]

**A:** Buffered channel có capacity hữu hạn.

Khi đầy:

- producer block
  hoặc
- producer reject theo policy

Đây là feedback tự nhiên trong Go pipelines.

---

### Q: Show bounded queue with overload handling in Go. 🟡 [Mid]

**A:**

```go
package backpressure

import (
	"context"
	"errors"
)

var ErrOverloaded = errors.New("overloaded")

type Task func(context.Context) error

type Pool struct {
	q chan Task
}

func NewPool(queueSize int, workers int) *Pool {
	p := &Pool{q: make(chan Task, queueSize)}
	for i := 0; i < workers; i++ {
		go func() {
			for t := range p.q {
				_ = t(context.Background())
			}
		}()
	}
	return p
}

func (p *Pool) Submit(ctx context.Context, t Task) error {
	select {
	case p.q <- t:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	default:
		return ErrOverloaded
	}
}
```

---

### Q: What is adaptive concurrency limiting? 🔴 [Senior]

**A:** Adaptive concurrency limit chỉnh inflight limit theo runtime signals.

Signals:

- p95/p99 latency
- error rate
- queue depth

Khi quality xấu, giảm limit nhanh. Khi ổn định, tăng limit dần.

---

### Q: Show a simple AIMD adaptive limiter in Go. 🔴 [Senior]

**A:**

```go
type AdaptiveLimiter struct {
	mu        sync.Mutex
	limit     int
	inflight  int
	minLimit  int
	maxLimit  int
	targetP95 time.Duration
}

func (l *AdaptiveLimiter) Acquire() bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	if l.inflight >= l.limit {
		return false
	}
	l.inflight++
	return true
}

func (l *AdaptiveLimiter) Release(observed time.Duration, success bool) {
	l.mu.Lock()
	defer l.mu.Unlock()

	if l.inflight > 0 {
		l.inflight--
	}

	if !success || observed > l.targetP95 {
		l.limit = maxInt(l.minLimit, l.limit/2)
		return
	}

	if l.limit < l.maxLimit {
		l.limit++
	}
}

func maxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}
```

---

### Q: Backpressure vs rate limiting — what is the difference? 🟡 [Mid]

**A:** Rate limiting:

- ingress policy
- theo identity/quota

Backpressure:

- runtime reaction theo internal saturation
- theo queue/inflight/latency

Hai pattern bổ sung nhau.

---

### Q: Which metrics indicate backpressure health? 🟡 [Mid]

**A:**

- queue depth
- queue wait time
- drop/reject rate
- inflight count
- timeout while waiting

Nếu queue tăng đều theo thời gian, hãy tìm bottleneck thực sự.

---

## 10. Interview Q&A Section

### Q1: What's the difference between circuit breaker and retry? 🟢 [Junior]

**A:** Retry cố gắng recover lỗi tạm thời. Circuit breaker chặn gọi dependency unhealthy.

Retry là recovery tactic. Breaker là containment tactic.

---

### Q2: How would you implement rate limiting in a distributed system? 🟡 [Mid]

**A:** Thiết kế phổ biến:

- Redis shared state
- Lua atomic updates
- key theo tenant/user/endpoint
- TTL windows
- fail-open/fail-closed policy

---

### Q3: Explain graceful degradation vs graceful shutdown. 🟢 [Junior]

**A:** Graceful degradation:

- giảm feature quality ở runtime khi stress

Graceful shutdown:

- dừng service an toàn khi deploy/restart

---

### Q4: How does Go context help timeout propagation? 🟢 [Junior]

**A:** `context` truyền deadline/cancel xuống toàn call chain. Khi upstream timeout, downstream calls bị cancel theo.

---

### Q5: How do you combine timeout, retry, and breaker safely? 🔴 [Senior]

**A:** Flow an toàn:

1. check remaining deadline 2. check breaker state 3. retry transient only 4. backoff + jitter + budget 5. stop before deadline exhaustion

---

### Q6: How would you design resilience for payment APIs? 🔴 [Senior]

**A:** Payment ưu tiên correctness.

Nên có:

- idempotency keys
- strict timeout budgets
- bounded retries
- breaker + bulkhead
- conservative failure policy

---

### Q7: What should readiness include for DB + cache + optional recommender? 🟡 [Mid]

**A:** DB + cache là critical, nên trong readiness.

Recommender optional có fallback, có thể không fail readiness, nhưng cần degraded markers rõ.

---

### Q8: Why can liveness be healthy while users still get 503? 🟡 [Mid]

**A:** Liveness chỉ nói process sống. 503 có thể do:

- dependency down
- readiness fail
- breaker open
- queue saturation

---

### Q9: Adaptive concurrency limit vs fixed semaphore? 🔴 [Senior]

**A:** Fixed semaphore:

- đơn giản
- tĩnh

Adaptive limit:

- dynamic theo runtime signals
- phù hợp traffic biến động

---

### Q10: How do you prevent cascading failures across microservices? 🔴 [Senior]

**A:** Defense-in-depth:

- timeout budgets
- bounded retries
- circuit breakers
- bulkheads
- health-aware LB
- backpressure
- graceful degradation
- strong observability

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                            | Difficulty | Core Concept         | Key Signal                                                       |
| --- | ----------------------------------- | ---------- | -------------------- | ---------------------------------------------------------------- |
| 1   | What is load balancing?             | 🟢         | Load Balancing       | Distribute traffic, avoid single point failure                   |
| 2   | Round-robin vs least-connections    | 🟢         | Load Balancing       | Stateless vs variable-cost aware                                 |
| 3   | Weighted strategies in production   | 🟡         | Load Balancing       | Heterogeneous servers, gradual rollout                           |
| 4   | Consistent hashing problem solved   | 🟡         | Load Balancing       | Minimize key redistribution, virtual nodes                       |
| 5   | Health checks + load balancing      | 🟡         | Load Balancing       | Remove unhealthy, active vs passive                              |
| 6   | Weighted least-connections Go       | 🔴         | Load Balancing       | Atomic counters, weight\*1/(conn+1)                              |
| 7   | LB monitoring metrics               | 🟡         | Load Balancing       | Request distribution, error rate, latency                        |
| 8   | What is circuit breaker?            | 🟢         | Circuit Breaker      | Fuse analogy, prevent cascade                                    |
| 9   | Breaker states                      | 🟢         | Circuit Breaker      | Closed→Open→Half-Open transitions                                |
| 10  | Which failures count for breaker    | 🟡         | Circuit Breaker      | 5xx + timeout, not 4xx                                           |
| 11  | Minimum request volume              | 🟡         | Circuit Breaker      | Prevent false trigger on low traffic                             |
| 12  | Go circuit breaker                  | 🟡         | Circuit Breaker      | Atomic state, sony/gobreaker                                     |
| 13  | Breaker threshold config            | 🔴         | Circuit Breaker      | Percentile-based, adaptive timeout                               |
| 14  | Breaker monitoring                  | 🟡         | Circuit Breaker      | State changes = alert, success rate                              |
| 15  | Retry + circuit breaker interaction | 🔴         | Circuit Breaker      | Retry first, breaker evaluates                                   |
| 16  | What is bulkhead?                   | 🟢         | Bulkhead             | Ship compartment, resource isolation                             |
| 17  | Why Go needs bulkheads              | 🟡         | Bulkhead             | Goroutines cheap, connections/fd not                             |
| 18  | Thread-pool vs semaphore isolation  | 🟡         | Bulkhead             | Java Hystrix vs Go channel                                       |
| 19  | Go semaphore bulkhead               | 🟡         | Bulkhead             | Buffered channel as semaphore                                    |
| 20  | Bulkhead capacity sizing            | 🔴         | Bulkhead             | 2× expected concurrency, monitor                                 |
| 21  | Bulkhead full response              | 🟡         | Bulkhead             | 503 immediately, don't block                                     |
| 22  | Bulkhead + breaker complement       | 🟡         | Bulkhead             | Concurrency limit + failure rate                                 |
| 23  | Why rate limits needed              | 🟢         | Rate Limiting        | Protect from overload, fair sharing                              |
| 24  | Token/leaky/sliding comparison      | 🟡         | Rate Limiting        | Burst vs constant vs precise                                     |
| 25  | Go token bucket                     | 🟡         | Rate Limiting        | golang.org/x/time/rate                                           |
| 26  | Distributed rate limiting Redis     | 🔴         | Rate Limiting        | Lua atomic, sliding window sorted set                            |
| 27  | Rate limit key dimensions           | 🟡         | Rate Limiting        | Per-user, per-IP, per-endpoint                                   |
| 28  | Rate limited response               | 🟢         | Rate Limiting        | HTTP 429, Retry-After header                                     |
| 29  | Fail-open vs fail-closed            | 🔴         | Rate Limiting        | Public fail-closed, internal fail-open                           |
| 30  | When to retry                       | 🟢         | Retry & Timeout      | Transient errors only, not 4xx                                   |
| 31  | Exponential backoff + jitter        | 🟡         | Retry & Timeout      | Prevent thundering herd                                          |
| 32  | Go retry helper                     | 🟡         | Retry & Timeout      | Context-aware, configurable attempts                             |
| 33  | Retry budget                        | 🔴         | Retry & Timeout      | Max 10% traffic, prevent amplification                           |
| 34  | Idempotency for write retries       | 🟡         | Retry & Timeout      | Idempotency key prevents duplicates                              |
| 35  | Retry amplification                 | 🔴         | Retry & Timeout      | A×B×C retries, retry at edge only                                |
| 36  | Why timeouts mandatory              | 🟢         | Retry & Timeout      | Prevent goroutine/resource leak                                  |
| 37  | Go context timeout propagation      | 🟢         | Retry & Timeout      | context.WithTimeout, deadline chain                              |
| 38  | Context timeout in handler          | 🟢         | Retry & Timeout      | ctx.Done(), ctx.Err()                                            |
| 39  | net/http timeout knobs              | 🟡         | Retry & Timeout      | ReadTimeout, WriteTimeout, IdleTimeout                           |
| 40  | Cascading timeout budget            | 🔴         | Retry & Timeout      | Upstream = sum(downstream) + processing                          |
| 41  | Budget-aware helper Go              | 🔴         | Retry & Timeout      | Check remaining deadline before call                             |
| 42  | Timeout anti-patterns               | 🟡         | Retry & Timeout      | No timeout, time.Sleep, ignore context                           |
| 43  | What is graceful degradation        | 🟢         | Degradation & Health | Reduce features, not crash                                       |
| 44  | Degradation vs shutdown             | 🟢         | Degradation & Health | Runtime vs deploy-time                                           |
| 45  | Feature flags + degradation         | 🟡         | Degradation & Health | Toggle features per-load level                                   |
| 46  | Partial response fallback Go        | 🟡         | Degradation & Health | Cache fallback, default values                                   |
| 47  | Priority-based shedding             | 🔴         | Degradation & Health | Drop low-priority under stress                                   |
| 48  | Degradation anti-patterns           | 🟡         | Degradation & Health | Silent failure, no metrics                                       |
| 49  | What is liveness probe              | 🟢         | Degradation & Health | Process alive, K8s restarts on fail                              |
| 50  | What is readiness probe             | 🟢         | Degradation & Health | Can accept traffic, removed from LB                              |
| 51  | Liveness vs readiness separated     | 🟡         | Degradation & Health | Liveness=process, readiness=dependencies                         |
| 52  | Go liveness/readiness handlers      | 🟡         | Degradation & Health | /healthz, /readyz endpoints                                      |
| 53  | Deep health check trade-offs        | 🔴         | Degradation & Health | Verify deps, risk cascade                                        |
| 54  | Optional dependency + readiness     | 🟡         | Degradation & Health | Degraded marker, don't fail readiness                            |
| 55  | What is backpressure                | 🟢         | Backpressure         | Signal upstream to slow down                                     |
| 56  | Go channels + backpressure          | 🟢         | Backpressure         | Buffered channel full → sender blocks                            |
| 57  | Bounded queue Go                    | 🟡         | Backpressure         | select default: reject                                           |
| 58  | Adaptive concurrency limiting       | 🔴         | Backpressure         | AIMD, latency-based adjustment                                   |
| 59  | AIMD adaptive limiter Go            | 🔴         | Backpressure         | Increase+1, halve on spike                                       |
| 60  | Backpressure vs rate limiting       | 🟡         | Backpressure         | Internal flow vs external per-client                             |
| 61  | Backpressure health metrics         | 🟡         | Backpressure         | Queue depth, rejection rate, p99                                 |
| I1  | Circuit breaker vs retry difference | 🟢         | Circuit Breaker      | Containment vs recovery                                          |
| I2  | Distributed rate limiting design    | 🟡         | Rate Limiting        | Redis + Lua + key strategy                                       |
| I3  | Graceful degradation vs shutdown    | 🟢         | Degradation & Health | Runtime feature reduction vs safe stop                           |
| I4  | Go context timeout propagation      | 🟢         | Retry & Timeout      | Deadline/cancel through call chain                               |
| I5  | Combine timeout+retry+breaker       | 🔴         | All Patterns         | Check deadline→breaker→retry→backoff→stop                        |
| I6  | Payment API resilience design       | 🔴         | All Patterns         | Idempotency, strict timeouts, bounded retry                      |
| I7  | Readiness for DB+cache+optional     | 🟡         | Degradation & Health | Critical in readiness, optional degraded                         |
| I8  | Liveness OK but users get 503       | 🟡         | Degradation & Health | Liveness≠readiness, breaker/queue/dep                            |
| I9  | Adaptive vs fixed concurrency       | 🔴         | Backpressure         | Dynamic AIMD vs static semaphore                                 |
| I10 | Prevent cascading failures          | 🔴         | All Patterns         | Defense-in-depth: timeout+retry+breaker+bulkhead+LB+backpressure |

**Distribution:** 🟢 20 (28%) | 🟡 33 (46%) | 🔴 18 (25%) — Total: 71 Q&As

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

**Interviewer:** "Your Go microservice calls 3 downstream services. One of them starts responding in 10 seconds instead of 100ms. What happens and how do you protect your service?"

**30-second answer:**

> Without protection, every request to the slow dependency blocks a goroutine for 10s → goroutine count explodes → memory/fd exhaustion → your service becomes unresponsive to ALL traffic, even to healthy dependencies. This is **cascade failure**. Protection stack: (1) **Timeout** via `context.WithTimeout(ctx, 200ms)` — don't wait 10s. (2) **Circuit Breaker** — after N timeouts, stop calling the slow service entirely (fail fast). (3) **Bulkhead** — semaphore limiting concurrent calls to that specific dependency (e.g., max 50 goroutines). (4) **Graceful Degradation** — return cached/default response when breaker is open.

**Follow-up:** "How do you set the circuit breaker threshold?"

> Monitor normal error rate (e.g., 0.1%). Set trip threshold at 5× normal (0.5%) with minimum 20 requests in evaluation window. Open timeout: start with 5s, exponentially increase on repeated trips. Half-open probe: allow 1 request through, if success → close, if fail → re-open. Key: threshold too low → false positives, too high → slow to protect.

---

## Self-Check / Tự Kiểm Tra

| #   | Loại           | Câu hỏi                                                                                                                        |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 🔍 Retrieval   | Vẽ Circuit Breaker state machine: 3 states, tên transitions, điều kiện trip và reset về Closed                                 |
| 2   | 🎨 Visual      | Vẽ sơ đồ Timeout + Retry + Circuit Breaker kết hợp an toàn — thứ tự kiểm tra từng bước trước khi gọi                           |
| 3   | 🛠️ Application | Thiết kế distributed rate limiter cho payment API: chọn algorithm, storage backend, fail-open/closed policy và response format |
| 4   | 🐛 Debug       | Service A gọi B, B chậm → A goroutine tăng đột biến → OOM. Nguyên nhân và cách fix với Bulkhead + Timeout + Breaker            |
| 5   | 🎓 Teach       | Giải thích Backpressure cho junior engineer chưa biết distributed systems, dùng ví dụ đời thường Việt Nam                      |

💬 **Feynman Prompt:** Hãy giải thích tại sao cần kết hợp Circuit Breaker + Bulkhead + Timeout + Retry thành một "defense chain" — và nếu bỏ đi bất kỳ một pattern nào, hệ thống sẽ fail như thế nào trong Grab payment scenario từ đầu file này.

### 📅 Spaced Repetition Schedule / Lịch Ôn Tập

| Round | When          | Focus                                                                    |
| ----- | ------------- | ------------------------------------------------------------------------ |
| 1     | Day 1 (Today) | Read all Memory Hooks + draw circuit breaker state machine               |
| 2     | Day 3         | Self-Check questions 1-4 without notes                                   |
| 3     | Day 7         | Cold Call simulation + explain retry amplification to rubber duck        |
| 4     | Day 14        | Full Self-Check + design resilience stack for payment service            |
| 5     | Day 30        | Mock interview: cascading failure prevention + distributed rate limiting |

---

## Connections / Liên Kết

### Same Track / Cùng Track

- ⬅️ **Built on**: [Networking](./06-networking-go.md) — TCP timeouts, connection pooling, HTTP error codes
- ⬅️ **Built on**: [Distributed Systems](./03-distributed-systems.md) — CAP theorem, distributed locking, consistency patterns
- ➡️ **Applied in**: [Microservices](./02-microservices.md) — resilience patterns essential for service mesh
- 🔗 **Related**: [API Design](./01-api-design.md) — rate limiting headers, pagination, error responses
- 🔗 **Related**: [Message Queues](./08-message-queues.md) — backpressure, consumer scaling, dead letter queues

### Cross Track / Khác Track

- 🔗 **[System Design](../04-be-system-design/01-design-framework.md)** — resilience is core non-functional requirement in system design interviews
- 🔗 **[Go Concurrency](../01-golang/03-concurrency.md)** — context propagation, goroutine management, sync primitives
- 🔗 **[DevOps](../05-devops/01-kubernetes-docker.md)** — K8s liveness/readiness probes, pod lifecycle, terminationGracePeriod
