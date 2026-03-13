# Advanced System Design Problems — Bài Toán Nâng Cao


> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Backend Track — System Design
> Cross-referenced by: `shared/02-system-design/system-design-theory.md`, `shared/03-database/database-theory.md`, `shared/01-cs-fundamentals/networking-theory.md`, `shared/04-security/01-security-fundamentals.md`, `be-track/02-backend-knowledge/03-distributed-systems.md`, `be-track/02-backend-knowledge/04-auth-security.md`

---

## Problem 1: Notification System / Hệ Thống Thông Báo Đa Kênh

### 🟡 Q: Requirements / Yêu Cầu `[Mid]`

**A:**

**Functional Requirements (FR):**
- Hệ thống gửi thông báo qua nhiều channel: push, email, SMS.
- Hỗ trợ template theo ngôn ngữ (EN/VI), placeholder động (`{{name}}`, `{{otp}}`).
- Hỗ trợ ưu tiên: `critical`, `high`, `normal`, `low`.
- User có preference theo channel (opt-in/opt-out), timezone, quiet hours.
- Retry khi provider fail, fallback channel (push fail → SMS).
- Tracking trạng thái: queued, sent, delivered, bounced, clicked, failed.
- Batch send cho campaign + single send cho transactional event.

**Non-Functional Requirements (NFR - estimation):**
- DAU: 20M users.
- Notification generated: 12/user/day → 240M/day.
- Peak multiplier: 5x theo giờ marketing campaign.
- Peak QPS enqueue: ~14K/sec; peak fanout downstream: ~70K/sec.
- P99 enqueue latency < 80ms; time-to-delivery cho critical < 3s.
- Availability: 99.95% cho transactional (OTP, alert), 99.9% cho marketing.
- Durability: event log retention 30-90 ngày; audit trail 1 năm.
- Compliance: unsubscribe, DND, anti-spam, masking PII.

---

### 🟡 Q: High-Level Design / Thiết Kế Tổng Quan `[Mid]`

**A:**

```text
                          ┌─────────────────────────┐
Business Services ───────▶│ Notification API Gateway│
(order, auth, promo)      └───────────┬─────────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │ Ingestion API   │
                              │ + Validation    │
                              └───────┬─────────┘
                                      │ publish
                                      ▼
                            ┌───────────────────────┐
                            │ Kafka / Pulsar Topics │
                            │ notif.requested       │
                            │ notif.retry           │
                            │ notif.dlq             │
                            └─────┬─────────┬───────┘
                                  │         │
                     ┌────────────▼──┐   ┌──▼────────────────┐
                     │ Preference     │   │ Template Service  │
                     │ Service        │   │ + Render Engine   │
                     └──────┬─────────┘   └──────┬────────────┘
                            │                    │
                            └──────┬─────────────┘
                                   ▼
                         ┌───────────────────────┐
                         │ Fanout + Routing Core │
                         │ priority, dedupe, RL  │
                         └───┬──────────┬────────┘
                             │          │
        ┌────────────────────▼─┐   ┌────▼───────────────────┐
        │ Channel Worker Push   │   │ Channel Worker Email   │
        │ APNS/FCM              │   │ SES/SendGrid           │
        └─────────────┬─────────┘   └───────────┬────────────┘
                      │                         │
              ┌───────▼────────┐      ┌────────▼─────────┐
              │ Channel Worker  │      │ Delivery Status   │
              │ SMS (Twilio)    │      │ Collector(Webhook)│
              └───────┬─────────┘      └────────┬─────────┘
                      │                          │
                      └──────────────┬───────────┘
                                     ▼
                               ┌──────────────┐
                               │ OLTP + Redis │
                               │ + Analytics  │
                               └──────────────┘
```

Thiết kế tách rõ ingestion, routing, provider adapters để scale độc lập theo channel. Tư duy interview: transactional path và campaign path nên tách queue/topic để tránh tranh chấp tài nguyên.

---

### 🟡 Q: Data Model / Mô Hình Dữ Liệu `[Mid]`

**A:**

```sql
-- notification event (immutable log)
notifications (
  id UUID PK,
  tenant_id VARCHAR(64),
  user_id VARCHAR(64),
  type VARCHAR(64),          -- OTP, ORDER_SHIPPED, PROMO
  priority SMALLINT,         -- 1 critical ... 4 low
  payload_json JSONB,
  idempotency_key VARCHAR(128),
  scheduled_at TIMESTAMP,
  status VARCHAR(32),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- per-channel attempt
notification_attempts (
  attempt_id UUID PK,
  notification_id UUID,
  channel VARCHAR(16),       -- push/email/sms
  provider VARCHAR(32),
  provider_message_id VARCHAR(128),
  attempt_no INT,
  status VARCHAR(32),
  error_code VARCHAR(64),
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP
)

-- user preference and policy
user_notification_preferences (
  user_id VARCHAR(64) PK,
  locale VARCHAR(8),
  timezone VARCHAR(64),
  quiet_hours_json JSONB,
  channel_opt_in_json JSONB,
  frequency_cap_json JSONB,
  updated_at TIMESTAMP
)

-- template registry
templates (
  template_id VARCHAR(64) PK,
  channel VARCHAR(16),
  locale VARCHAR(8),
  version INT,
  subject TEXT,
  body TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP
)
```

Giải thích:
- `notifications` là source event để replay/reconcile.
- `notification_attempts` tách riêng để audit retry/fallback.
- `idempotency_key` giúp chống gửi trùng khi client retry.

---

### 🟡 Q: API Design / Thiết Kế API `[Mid]`

**A:**

```http
POST /v1/notifications
Headers:
  Idempotency-Key: 5f69...c21
Body:
{
  "tenantId": "shop-1",
  "userId": "u_123",
  "type": "ORDER_SHIPPED",
  "priority": "high",
  "channels": ["push", "email"],
  "locale": "vi-VN",
  "payload": {
    "orderId": "ord_99",
    "eta": "2026-03-11T09:30:00Z"
  }
}

Response 202:
{ "notificationId": "n_abc", "status": "queued" }
```

```http
GET /v1/notifications/{id}
Response 200:
{
  "id": "n_abc",
  "status": "delivered",
  "attempts": [
    {"channel":"push","status":"failed","error":"token_expired"},
    {"channel":"sms","status":"delivered"}
  ]
}
```

```http
POST /v1/preferences/{userId}
Body:
{
  "channelOptIn": {"push": true, "email": true, "sms": false},
  "quietHours": {"start": "22:00", "end": "07:00"},
  "frequencyCap": {"promoPerDay": 3}
}
```

---

### 🔴 Q: Deep Dive — Fanout, Priority, Rate Limiting `[Senior]`

**A:**

**1) Fanout model:**
- Transactional: direct fanout theo user event, độ trễ thấp.
- Campaign: segment trước, fanout batch qua partitioned topic.
- Partition key nên dùng `user_id` để giữ ordering per user.

**2) Priority queues:**
- 4 hàng đợi logic: P1/P2/P3/P4.
- Worker dùng weighted scheduling, ví dụ `70/20/8/2`.
- Tránh starvation bằng aging: message low priority chờ quá lâu được nâng cấp tạm.

**3) Multi-layer rate limiting:**
- Global limit per provider (e.g., SES 10K req/s).
- Tenant limit để tránh một tenant chiếm toàn bộ quota.
- User-level cap chống spam.
- Channel-specific limit theo regulation địa phương.

**4) Retry strategy:**
- Retry với exponential backoff + jitter.
- Error taxonomy:
  - Retryable: timeout, 429, transient 5xx.
  - Non-retryable: invalid email, unsubscribed.
- Đẩy vào DLQ sau N lần thất bại để manual/process async xử lý.

**5) Dedupe và exactly-once cảm nhận:**
- In practice là at-least-once + idempotency key.
- Redis SETNX(`idem:{key}`) TTL 24h trước khi enqueue.
- Provider callback idempotent update bằng unique `(provider_message_id, status)`.

**Go sketch (priority worker):**

```go
package notify

import (
	"context"
	"math/rand"
	"time"
)

type Job struct {
	ID       string
	Priority int // 1..4
}

type Queue interface {
	Pop(ctx context.Context, priority int) (*Job, error)
	Ack(ctx context.Context, jobID string) error
	Nack(ctx context.Context, jobID string, delay time.Duration) error
}

func processLoop(ctx context.Context, q Queue, handle func(context.Context, *Job) error) {
	weights := []int{70, 20, 8, 2}
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}

		p := weightedPick(weights) + 1
		job, err := q.Pop(ctx, p)
		if err != nil || job == nil {
			time.Sleep(20 * time.Millisecond)
			continue
		}
		if err := handle(ctx, job); err != nil {
			backoff := time.Duration((1<<min(job.Priority, 5))+rand.Intn(300)) * time.Millisecond
			_ = q.Nack(ctx, job.ID, backoff)
			continue
		}
		_ = q.Ack(ctx, job.ID)
	}
}

func weightedPick(w []int) int {
	total := 0
	for _, x := range w { total += x }
	r := rand.Intn(total)
	for i, x := range w {
		if r < x { return i }
		r -= x
	}
	return len(w) - 1
}

func min(a, b int) int { if a < b { return a }; return b }
```

---

### 🔴 Q: Tradeoffs & Alternatives `[Senior]`

**A:**

| Decision | Ưu điểm | Nhược điểm | Khi chọn |
|---|---|---|---|
| Kafka fanout | Throughput cao, replay được | Operate phức tạp | Quy mô lớn, cần audit |
| Direct DB queue | Dễ triển khai | Khó scale lớn | Startup/low QPS |
| Single provider/channel | Đơn giản | Vendor lock-in | MVP nhanh |
| Multi-provider | HA cao, tối ưu cost | Routing logic phức tạp | Production mature |
| Pre-render template | Giảm latency send | Tăng storage | Mẫu ổn định |
| Render on send | Linh hoạt dynamic data | CPU cao giờ peak | Payload thay đổi nhiều |

---

## Problem 2: Rate Limiter / Bộ Giới Hạn Tốc Độ

### 🟢 Q: What are we designing? / Bài toán cần gì `[Junior]`

**A:**
- Giới hạn số request để bảo vệ hệ thống, kiểm soát abuse, và đảm bảo fairness.
- Scope: per user, per API key, per IP, per tenant, theo endpoint.
- Trả về `429 Too Many Requests` + headers giúp client backoff.

---

### 🟡 Q: Requirements + Estimation `[Mid]`

**A:**

**FR:**
- Hỗ trợ nhiều thuật toán: token bucket, fixed window, sliding window log/counter.
- Policy động (update runtime), có burst allowance.
- Distributed: nhiều stateless API instance cùng dùng chung trạng thái.
- Whitelist/blacklist + emergency kill switch.

**NFR:**
- Peak incoming 300K req/s.
- Decision latency p99 < 3ms tại gateway.
- Availability 99.99% (fail-open hoặc fail-closed theo endpoint criticality).
- Memory-efficient: hàng chục triệu key hoạt động.

---

### 🟡 Q: High-Level Design / Thiết Kế Tổng Quan `[Mid]`

**A:**

```text
Client
  │
  ▼
API Gateway / Envoy Filter
  │
  ├── local warm cache (policy)
  │
  ▼
Rate Limit Service (stateless)
  │
  ├── Redis Cluster (counter, token state)
  ├── Config Store (policy version)
  └── Metrics/Alerting (Prometheus)
```

Gateway gọi gRPC sang Rate Limit Service trước khi forward upstream. Để giảm latency, policy cache local với TTL ngắn + versioning invalidation.

---

### 🟡 Q: Data Model & API `[Mid]`

**A:**

```json
// policy document
{
  "policyId": "checkout-api-user",
  "scope": "user_id",
  "algorithm": "token_bucket",
  "capacity": 100,
  "refillRate": 20,
  "intervalSec": 1,
  "burst": 40,
  "endpointPattern": "/v1/checkout/*",
  "mode": "enforce"
}
```

```http
POST /v1/ratelimit/check
{
  "policyId": "checkout-api-user",
  "subject": "u_123",
  "cost": 1,
  "nowMs": 1770001231231
}

200:
{
  "allowed": false,
  "remaining": 0,
  "retryAfterMs": 250,
  "limit": 100
}
```

Redis key examples:
- `rl:tb:{policy}:{subject}` → hash `{tokens,last_refill_ms}`
- `rl:sw:{policy}:{subject}:{bucket_ts}` → counter per bucket

---

### 🔴 Q: Deep Dive — Token Bucket vs Sliding Window `[Senior]`

**A:**

| Algorithm | Ý tưởng | Ưu điểm | Nhược điểm |
|---|---|---|---|
| Fixed window | Đếm theo cửa sổ cứng | Rất đơn giản | Boundary burst lớn |
| Sliding log | Lưu timestamp từng request | Chính xác | Tốn memory |
| Sliding counter | Approximate bằng sub-window | Cân bằng tốt | Có sai số |
| Token bucket | Token refill đều | Cho burst hợp lý | Cần state + time math |

**Redis Lua cho token bucket (atomic):**

```lua
-- KEYS[1]=bucket key
-- ARGV: now_ms, refill_per_sec, capacity, cost
local key = KEYS[1]
local now = tonumber(ARGV[1])
local refill = tonumber(ARGV[2])
local cap = tonumber(ARGV[3])
local cost = tonumber(ARGV[4])

local data = redis.call('HMGET', key, 'tokens', 'ts')
local tokens = tonumber(data[1])
local ts = tonumber(data[2])
if not tokens then
  tokens = cap
  ts = now
end

local delta = math.max(0, now - ts)
local refill_tokens = delta * refill / 1000.0
local current = math.min(cap, tokens + refill_tokens)

local allowed = 0
if current >= cost then
  current = current - cost
  allowed = 1
end

redis.call('HMSET', key, 'tokens', current, 'ts', now)
redis.call('PEXPIRE', key, 60000)

return {allowed, math.floor(current)}
```

**Scale note:**
- Dùng consistent hashing để route cùng subject về cùng shard Redis.
- Với multi-region, local limit + global soft quota để tránh cross-region RTT.

---

### 🔴 Q: Tradeoffs & Failure Modes `[Senior]`

**A:**
- **Fail-open**: tăng rủi ro abuse nhưng giữ availability.
- **Fail-closed**: an toàn hơn nhưng có thể gây outage dây chuyền.
- Đề xuất: endpoint auth/payment fail-closed; read/public fail-open + alert.
- Hot key (1 subject cực nóng) → thêm local leaky bucket trước remote check.

---

## Problem 3: Payment System / Hệ Thống Thanh Toán

### 🟡 Q: Requirements / Yêu Cầu `[Mid]`

**A:**

**FR:**
- Tạo payment intent, authorize, capture, refund.
- Hỗ trợ nhiều phương thức: card, wallet, bank transfer.
- Idempotent cho create/capture/refund.
- Ledger double-entry nội bộ để chống sai lệch số dư.
- Reconciliation với PSP/bank cuối ngày.
- Webhook inbound từ PSP (asynchronous status updates).

**NFR:**
- Peak checkout: 8K txn/s (campaign có thể 20K).
- P99 authorize latency < 700ms (phụ thuộc PSP).
- Exactly-once business effect (không trừ tiền 2 lần).
- Durability/audit: giữ bản ghi tối thiểu 7 năm.
- Compliance: PCI DSS scope minimization, tokenization PAN.

---

### 🟡 Q: High-Level Design `[Mid]`

**A:**

```text
Client/App
  │
  ▼
Payment API
  │
  ├── Idempotency Store (Redis/DB)
  ├── Risk/Fraud Check
  ├── Orchestrator (state machine)
  ├── PSP Connector(s)
  ├── Ledger Service (double-entry)
  └── Reconciliation + Settlement Jobs

PSP Webhook ───────▶ Webhook Ingest ──▶ Event Bus ──▶ Orchestrator
```

Luồng chuẩn card payment:
1. Create intent (`requires_payment_method`).
2. Authorize hold tiền.
3. Capture khi order confirm.
4. Refund toàn phần/một phần nếu cần.

---

### 🟡 Q: Data Model / Mô Hình Dữ Liệu `[Mid]`

**A:**

```sql
payment_intents (
  intent_id VARCHAR(64) PK,
  order_id VARCHAR(64) UNIQUE,
  user_id VARCHAR(64),
  amount_cents BIGINT,
  currency CHAR(3),
  status VARCHAR(32),
  idempotency_key VARCHAR(128),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

payment_transactions (
  txn_id VARCHAR(64) PK,
  intent_id VARCHAR(64),
  type VARCHAR(16),          -- AUTH/CAPTURE/REFUND
  psp VARCHAR(32),
  psp_txn_id VARCHAR(128),
  amount_cents BIGINT,
  status VARCHAR(32),
  error_code VARCHAR(64),
  created_at TIMESTAMP
)

ledger_entries (
  entry_id BIGSERIAL PK,
  ledger_txn_id VARCHAR(64),
  account_id VARCHAR(64),
  direction VARCHAR(8),      -- DEBIT/CREDIT
  amount_cents BIGINT,
  currency CHAR(3),
  created_at TIMESTAMP
)

reconciliation_records (
  recon_id BIGSERIAL PK,
  business_date DATE,
  source VARCHAR(16),        -- INTERNAL/PSP/BANK
  reference_id VARCHAR(128),
  amount_cents BIGINT,
  status VARCHAR(16),
  mismatch_reason TEXT
)
```

Invariant quan trọng: Tổng DEBIT = Tổng CREDIT trong cùng `ledger_txn_id`.

---

### 🟡 Q: API Design `[Mid]`

**A:**

```http
POST /v1/payments/intents
Headers: Idempotency-Key: idem_123
{
  "orderId":"ord_1001",
  "userId":"u_1",
  "amountCents": 259900,
  "currency":"VND",
  "method":"card"
}

201:
{ "intentId":"pi_1", "status":"requires_action" }
```

```http
POST /v1/payments/intents/{intentId}/capture
Headers: Idempotency-Key: idem_capture_1
{
  "amountCents": 259900
}
```

```http
POST /v1/payments/intents/{intentId}/refund
Headers: Idempotency-Key: idem_refund_1
{
  "amountCents": 50000,
  "reason": "customer_request"
}
```

---

### 🔴 Q: Deep Dive — Idempotency, Double-Spending, Reconciliation `[Senior]`

**A:**

**Idempotency pattern:**
- Key scope: `(merchant_id, endpoint, idempotency_key)`.
- Lần đầu xử lý: lock + persist response snapshot.
- Lần retry: trả lại đúng response cũ.
- TTL key > retry window (24-72h).

**Double spending prevention:**
- Sử dụng transaction + row lock (`SELECT ... FOR UPDATE`) trên payment intent.
- State machine hợp lệ: `created -> authorized -> captured`.
- Reject transition bất hợp lệ, ví dụ capture 2 lần.

**Webhook consistency:**
- Webhook đến out-of-order là bình thường.
- Lưu event raw + version/time; apply theo state precedence.
- Signature verification bắt buộc để tránh giả mạo callback.

**Reconciliation:**
- T+1 batch đối soát giữa internal ledger và PSP file.
- Chênh lệch được đưa vào queue điều tra (`recon_mismatch`).
- Có thể auto-heal các mismatch known pattern (duplicate callback).

**PCI basics:**
- Không lưu PAN/CVV trong hệ thống core nếu không cần.
- Dùng tokenization từ PSP, segment network, encrypt at rest/in transit.
- Principle of least privilege + audit access log.

**Go sketch (idempotent handler):**

```go
func HandleCreateIntent(ctx context.Context, req CreateIntentReq) (CreateIntentResp, error) {
	key := req.MerchantID + ":create_intent:" + req.IdempotencyKey
	if cached, ok := idemStore.Get(ctx, key); ok {
		return cached.(CreateIntentResp), nil
	}

	lock, err := lockSvc.Acquire(ctx, key, 5*time.Second)
	if err != nil { return CreateIntentResp{}, err }
	defer lock.Release(ctx)

	if cached, ok := idemStore.Get(ctx, key); ok {
		return cached.(CreateIntentResp), nil
	}

	resp, err := orchestrator.CreateIntent(ctx, req)
	if err != nil { return CreateIntentResp{}, err }

	_ = idemStore.Set(ctx, key, resp, 48*time.Hour)
	return resp, nil
}
```

---

### 🔴 Q: Tradeoffs & Alternatives `[Senior]`

**A:**

| Approach | Pros | Cons |
|---|---|---|
| Strong consistency DB txn | Đúng dữ liệu cao | Throughput thấp hơn |
| Event-driven eventual | Scale tốt | Debug/reconcile phức tạp |
| Single PSP | Integrate nhanh | Rủi ro downtime/cost |
| Multi-PSP routing | Resilience/cost tối ưu | Orchestration phức tạp |

---

## Problem 4: Ride-Matching / Real-Time Location (Grab-like)

### 🟡 Q: Requirements + Estimation `[Mid]`

**A:**

**FR:**
- Rider tạo booking, hệ thống tìm driver phù hợp gần nhất.
- Real-time location update từ driver mỗi 2-5 giây.
- ETA estimation cho pickup/dropoff.
- Surge pricing theo cung-cầu khu vực.
- Dispatch retry nếu driver từ chối hoặc timeout.

**NFR:**
- Concurrent drivers online: 1.5M.
- Location updates: trung bình 0.3 update/sec/driver → ~450K updates/sec.
- Booking peak: 25K req/sec.
- Matching response target p95 < 300ms.
- Availability: 99.99% cho dispatch path.

---

### 🟡 Q: High-Level Design `[Mid]`

**A:**

```text
Driver App ──GPS──▶ Location Gateway ─▶ Stream Processor ─▶ Geo Index Store
Rider App  ───────▶ Booking API ──────▶ Matching Engine ───▶ Dispatch Service
                                                     │
                                                     ├── ETA Service (map graph)
                                                     ├── Pricing Service (surge)
                                                     └── Notification Service
```

```text
Geo index options:
- Geohash: encode lat/lng thành prefix để query nearby nhanh.
- Quadtree: chia không gian theo vùng recursive.
- H3/S2: cell-based index ổn định hơn cho production lớn.
```

---

### 🟡 Q: Data Model + API `[Mid]`

**A:**

```sql
drivers_live (
  driver_id VARCHAR(64) PK,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  geohash VARCHAR(16),
  heading SMALLINT,
  speed_kmh SMALLINT,
  status VARCHAR(16),          -- available/busy/offline
  vehicle_type VARCHAR(16),
  updated_at TIMESTAMP
)

ride_requests (
  request_id VARCHAR(64) PK,
  rider_id VARCHAR(64),
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  drop_lat DOUBLE PRECISION,
  drop_lng DOUBLE PRECISION,
  status VARCHAR(16),          -- searching/matched/cancelled/completed
  surge_multiplier NUMERIC(4,2),
  created_at TIMESTAMP
)
```

```http
POST /v1/rides/request
{
  "riderId":"r_1",
  "pickup":{"lat":10.7769,"lng":106.7009},
  "dropoff":{"lat":10.8020,"lng":106.7140},
  "vehicleType":"car"
}

200:
{
  "requestId":"rq_100",
  "etaSeconds": 240,
  "surge": 1.4
}
```

```http
POST /v1/drivers/{driverId}/location
{
  "lat":10.78,
  "lng":106.71,
  "heading":120,
  "speedKmh":32,
  "ts":177001111
}
```

---

### 🔴 Q: Deep Dive — Matching Algorithm, ETA, Surge `[Senior]`

**A:**

**Matching pipeline đề xuất:**
1. Tìm candidate drivers trong bán kính nhỏ (1-2km) bằng geohash prefix.
2. Filter constraints: vehicle type, online, acceptance score, trip state.
3. Score function:
   - ETA pickup (weight cao nhất).
   - Driver reliability (acceptance/cancel ratio).
   - Fairness (không dồn job vào 1 nhóm tài xế).
4. Gửi offer theo batch nhỏ (e.g., top 3), timeout 8-10s.
5. Nếu fail, mở rộng bán kính + retry wave 2.

**ETA calculation:**
- Không chỉ dùng Haversine distance.
- Cần graph road + traffic speed profile theo thời gian thực.
- Cache route matrix cho hotspot zones.

**Surge pricing:**
- Tính theo vùng cell (geohash/H3), time window 5 phút.
- `surge = f(demand/supply, weather, event)` với cap max.
- Cần guardrail để tránh biến động quá nhanh (smoothing).

**Consistency challenge:**
- Driver nhận 2 booking cùng lúc (race condition).
- Giải pháp: atomic compare-and-set trạng thái `available -> reserved` với TTL.

**Go sketch (atomic reserve pseudo):**

```go
func ReserveDriver(ctx context.Context, driverID, requestID string, ttl time.Duration) (bool, error) {
	// Redis SET key value NX PX <ttl>
	key := "drv:reserve:" + driverID
	ok, err := redisClient.SetNX(ctx, key, requestID, ttl).Result()
	if err != nil { return false, err }
	return ok, nil
}
```

---

### 🔴 Q: Tradeoffs & Alternatives `[Senior]`

**A:**

| Decision | Option A | Option B | Nhận xét |
|---|---|---|---|
| Geo index | Geohash | H3/S2 | H3 tốt cho phân vùng đều hơn |
| Dispatch | Single offer | Batch offer | Batch giảm latency nhưng có conflict |
| ETA | Great-circle | Road graph + traffic | Option B chính xác hơn, tốn compute |
| Surge | Static rules | ML dynamic | ML tốt hơn nhưng khó explain |

---

## Problem 5: News Feed / Timeline

### 🟡 Q: Requirements + Estimation `[Mid]`

**A:**

**FR:**
- User post bài, follow user khác, xem feed cá nhân hoá.
- Feed phân trang theo thời gian/score.
- Có ranking và lọc nội dung vi phạm.
- Hỗ trợ realtime-ish update (seconds-level).

**NFR:**
- DAU 80M, MAU 250M.
- Post write 6K/sec peak.
- Feed read 300K/sec peak (read-heavy).
- P95 feed query < 200ms (first page).
- Availability 99.95%.

---

### 🟡 Q: High-Level Design `[Mid]`

**A:**

```text
Post API ──▶ Post Store (object + metadata)
      │
      └──▶ Fanout Service ──▶ Inbox Cache (per user timeline IDs)

Feed Query API ──▶ Ranking Service ──▶ Feature Store
          │
          ├──▶ Graph Service (follow edges)
          └──▶ Content Store + Cache
```

Hai chiến lược:
- **Fanout on write (push model):** post mới đẩy vào inbox follower.
- **Fanout on read (pull model):** query mới join theo follow graph khi đọc.

---

### 🟡 Q: Data Model + API `[Mid]`

**A:**

```sql
posts (
  post_id VARCHAR(64) PK,
  author_id VARCHAR(64),
  content_ref VARCHAR(256),
  created_at TIMESTAMP,
  visibility VARCHAR(16),
  rank_features JSONB
)

follows (
  follower_id VARCHAR(64),
  followee_id VARCHAR(64),
  created_at TIMESTAMP,
  PRIMARY KEY (follower_id, followee_id)
)

user_inbox (
  user_id VARCHAR(64),
  post_id VARCHAR(64),
  score DOUBLE PRECISION,
  created_at TIMESTAMP,
  PRIMARY KEY (user_id, post_id)
)
```

```http
GET /v1/feed?userId=u1&cursor=eyJzY29yZSI6...&limit=20
200:
{
  "items": [{"postId":"p1","authorId":"u2","score":0.91}],
  "nextCursor":"..."
}
```

---

### 🔴 Q: Deep Dive — Fanout write vs read, Celebrity Problem `[Senior]`

**A:**

**Fanout on write:**
- Ưu: read cực nhanh vì inbox đã materialized.
- Nhược: write amplification khủng khi author có nhiều follower.

**Fanout on read:**
- Ưu: write nhẹ, phù hợp celebrity.
- Nhược: read đắt, phải merge nhiều source.

**Hybrid thường dùng:**
- User bình thường: fanout on write.
- Celebrity: fanout on read + cache precompute top K.

**Ranking:**
- Candidate generation: recent posts từ graph + interest clusters.
- Scoring: freshness, affinity, engagement prior, quality score.
- Re-ranking cho diversity + policy safety.

**Cache strategy:**
- First page cache theo user short TTL (10-30s).
- Pre-warm cache cho user active.
- Cursor-based pagination tránh offset scan.

---

### 🔴 Q: Tradeoffs & Alternatives `[Senior]`

**A:**

| Choice | Pros | Cons |
|---|---|---|
| Push feed only | Read fast | Write explosion |
| Pull feed only | Write cheap | Read slow |
| Hybrid | Cân bằng tốt | Logic phức tạp |
| Full ML ranking | Engagement cao | Khó debug + bias risk |

---

## Problem 6: Distributed File Storage / Lưu Trữ File Phân Tán

### 🟡 Q: Requirements + Estimation `[Mid]`

**A:**

**FR:**
- Upload/download file lớn (MB-GB), resumable upload.
- Chunking + parallel upload/download.
- Replication đa AZ/region.
- Metadata service quản lý object, version, ACL.
- Signed URL cho truy cập tạm thời.

**NFR:**
- New uploads 2PB/tháng.
- Peak upload bandwidth 200Gbps.
- Durability mục tiêu 11 nines (99.999999999%).
- Availability read 99.99%.
- P95 metadata lookup < 20ms.

---

### 🟡 Q: High-Level Design `[Mid]`

**A:**

```text
Client
  │
  ├── Request upload session ──▶ Metadata API
  │                              │
  │                              ├── Object metadata DB
  │                              └── Chunk placement service
  │
  ├── PUT chunk to Storage Nodes / Blob tier
  │
  └── Complete upload ──────────▶ Metadata API (commit manifest)

Download:
Client ─▶ Metadata API (resolve manifest) ─▶ parallel GET chunk(s)
```

---

### 🟡 Q: Data Model + API `[Mid]`

**A:**

```sql
objects (
  object_id VARCHAR(64) PK,
  bucket_id VARCHAR(64),
  key TEXT,
  size_bytes BIGINT,
  etag VARCHAR(64),
  version INT,
  storage_class VARCHAR(16),
  status VARCHAR(16),
  created_at TIMESTAMP
)

object_chunks (
  object_id VARCHAR(64),
  chunk_no INT,
  chunk_hash VARCHAR(64),
  size_bytes INT,
  replica_nodes JSONB,
  PRIMARY KEY (object_id, chunk_no)
)
```

```http
POST /v1/objects/upload-sessions
{
  "bucket":"media",
  "key":"videos/a.mp4",
  "sizeBytes": 734003200,
  "chunkSize": 8388608
}

200:
{
  "uploadId":"up_1",
  "parts":[
    {"partNo":1,"signedUrl":"https://..."}
  ]
}
```

```http
POST /v1/objects/upload-sessions/{uploadId}/complete
{
  "parts":[{"partNo":1,"etag":"..."}]
}
```

---

### 🔴 Q: Deep Dive — Chunking, Replication, Consistency, Metadata `[Senior]`

**A:**

**Chunking:**
- Chunk 8-64MB để cân bằng metadata overhead và parallelism.
- Hash per chunk để verify integrity.
- Dedup optional: content-addressable chunks.

**Replication strategy:**
- 3 replicas across 3 AZ (quorum write 2/3, read 1/3 hoặc 2/3 theo class).
- Cold storage dùng erasure coding (e.g., 10+4) tiết kiệm hơn replication thuần.

**Consistency choices:**
- Metadata cần strong consistency cho create/delete/list chính xác.
- Data path có thể eventual cho replication hoàn tất async.
- Read-after-write strong cho object mới thường là yêu cầu product quan trọng.

**Metadata scaling:**
- Partition theo `(bucket, key prefix hash)`.
- Secondary index cho listing theo prefix.
- Background compaction cho tombstone/version cũ.

**Failure scenarios:**
- Node chết giữa upload: client retry part sang node khác.
- Split brain metadata: dùng consensus (Raft) cho metadata control plane.
- Bit rot: scrub job định kỳ + repair từ replica parity.

**Go sketch (multipart completion validation):**

```go
func CompleteUpload(ctx context.Context, uploadID string, parts []Part) error {
	if len(parts) == 0 {
		return errors.New("empty parts")
	}
	sort.Slice(parts, func(i, j int) bool { return parts[i].No < parts[j].No })
	for i := 1; i < len(parts); i++ {
		if parts[i].No == parts[i-1].No {
			return fmt.Errorf("duplicate part: %d", parts[i].No)
		}
		if parts[i].No != parts[i-1].No+1 {
			return fmt.Errorf("missing part between %d and %d", parts[i-1].No, parts[i].No)
		}
	}
	return metadataSvc.CommitManifest(ctx, uploadID, parts)
}

type Part struct {
	No   int
	ETag string
}
```

---

### 🔴 Q: Tradeoffs & Alternatives `[Senior]`

**A:**

| Topic | Option A | Option B | Tradeoff |
|---|---|---|---|
| Durability | 3x replication | Erasure coding | Replication đơn giản, EC rẻ hơn |
| Consistency | Strong everywhere | Hybrid strong+eventual | Strong toàn diện đắt hơn |
| Metadata | SQL NewSQL | NoSQL KV + index | SQL dễ query, KV scale rẻ |
| Upload | Single stream | Multipart parallel | Multipart phức tạp hơn nhưng nhanh |

---

## Interview Drill Q&A / Câu Hỏi Luyện Phỏng Vấn

### 🟢 Q: Notification system nên ưu tiên design nào đầu tiên? `[Junior]`

**A:** Luôn tách transactional và marketing path vì SLA khác nhau; nếu gom chung sẽ dễ làm trễ OTP.

### 🟡 Q: Khi nào chọn token bucket thay vì sliding window? `[Mid]`

**A:** Khi cần cho burst hợp lý và tính toán nhanh. Sliding window phù hợp khi cần fairness sát thời gian hơn.

### 🔴 Q: Payment webhook đến trễ và out-of-order xử lý sao? `[Senior]`

**A:** Persist raw event, verify signature, áp dụng state transition theo precedence + version/time, idempotent update, reconcile cuối ngày.

### 🟡 Q: Ride matching dùng geohash có nhược điểm gì? `[Mid]`

**A:** Mật độ cell không đều theo latitude, biên cell gây miss candidate; thường phải query cell lân cận.

### 🔴 Q: Celebrity problem trong feed xử lý thực tế thế nào? `[Senior]`

**A:** Hybrid push/pull, celebrity chuyển sang pull + cache precompute top posts, tránh fanout write bùng nổ.

### 🟡 Q: Vì sao metadata storage thường cần strong consistency? `[Mid]`

**A:** Để tránh trạng thái object mâu thuẫn (đã complete nhưng list không thấy, hoặc delete race), ảnh hưởng correctness.

---

## Cross-Reference Map / Bản Đồ Liên Kết Lý Thuyết

- System design process: `shared/02-system-design/system-design-theory.md`
- Consistency, replication, consensus: `shared/02-system-design/consensus-algorithms.md`
- Data modeling fundamentals: `shared/03-database/database-theory.md`
- Network latency/throughput basics: `shared/01-cs-fundamentals/networking-theory.md`
- Security, compliance, threat model: `shared/04-security/01-security-fundamentals.md`
- Distributed systems practical backend context: `be-track/02-backend-knowledge/03-distributed-systems.md`


## Extended Deep-Dive Section / Phần Mở Rộng Chuyên Sâu

> Mục này bổ sung các câu hỏi interview follow-up theo từng problem để tăng độ sâu Senior-level.

---

## Problem 1 Add-on: Notification System Advanced Follow-ups

### 🔴 Q: How to design multi-tenant isolation? / Cách tách tenant an toàn `[Senior]`

**A:**
- Resource quota tách theo tenant:
  - `max_qps_per_tenant`
  - `max_daily_volume`
  - `max_concurrent_campaigns`
- Queue partitioning theo tenant class (enterprise vs free-tier).
- DB schema:
  - shared table + `tenant_id` + RLS.
  - hoặc physically isolated clusters cho tenant lớn.
- Blast radius control:
  - circuit breaker theo tenant.
  - per-tenant DLQ để không ảnh hưởng tenant khác.

### 🔴 Q: Exactly-once delivery có khả thi với email/SMS không? `[Senior]`

**A:**
- End-to-end exactly-once với external channel gần như không đảm bảo tuyệt đối.
- Mục tiêu thực tế:
  - at-least-once send attempt
  - at-most-once user-visible duplicate bằng dedupe key trên business event
- Ví dụ key dedupe:
  - `dedupe = hash(user_id + template_id + business_event_id)`.
- TTL dedupe key tùy domain:
  - OTP: ngắn (5-10 phút)
  - billing reminder: dài hơn (24h)

### 🔴 Q: Anti-spam guardrails cho notification platform? `[Senior]`

**A:**
- Frequency cap nhiều lớp:
  - per user/channel/time window
  - per tenant/channel/day
  - global provider quota
- Content policy checks:
  - phishing keyword detection
  - link reputation checks
- Adaptive throttling theo complaint/bounce rates.
- Auto-pausing campaign khi bounce > threshold.

### 🟡 Q: Capacity formulas / Công thức năng lực `[Mid]`

**A:**
```text
Given:
- DAU = 20M
- avg notif/user/day = 12
- daily notifications = 240M
- avg payload rendered size = 1.4KB

Compute:
1) avg QPS enqueue = 240M / 86,400 ≈ 2,778/s
2) peak factor 5x => peak ≈ 13,890/s
3) provider downstream fanout (2 channels avg) => ~27,780 ops/s
4) daily render data volume => 240M * 1.4KB ≈ 336GB/day
5) with replication 3x, logical+physical ~1TB/day footprint
```

### 🟡 Q: Observability matrix cho notification system `[Mid]`

**A:**

| Layer | Metrics chính | Alert threshold ví dụ |
|---|---|---|
| Ingestion | request rate, 4xx/5xx | 5xx > 1% trong 5 phút |
| Queue | lag per partition, publish error | lag > 2 phút cho critical topic |
| Routing | dedupe hit rate, policy reject rate | reject tăng bất thường > 3x baseline |
| Provider | success %, latency p95, 429 rate | 429 > 2% cần auto-throttle |
| Callback | webhook delay, signature fail | signature fail > 0.1% |
| End-user | time-to-delivery p95 | p95 > 10s cho transactional |

### 🔴 Q: Data privacy cho template payload `[Senior]`

**A:**
- PII minimization: chỉ truyền field cần thiết vào renderer.
- Tokenization cho dữ liệu nhạy cảm.
- Encrypted payload at rest (KMS envelope encryption).
- Redaction trong logs/traces (`email`, `phone`, `otp` masking).
- Access policy theo RBAC + audit trail.

---

## Problem 2 Add-on: Rate Limiter Advanced Follow-ups

### 🟡 Q: Fixed window boundary burst là gì? `[Mid]`

**A:**
- Ví dụ limit 100 req/min:
  - User gửi 100 req ở giây 59.
  - Gửi tiếp 100 req ở giây 60 (window mới).
  - Tổng 200 req trong ~2 giây → unfair burst.
- Sliding window hoặc token bucket giảm hiện tượng này.

### 🔴 Q: Multi-dimensional quotas / quota đa chiều `[Senior]`

**A:**
- Thường cần đồng thời:
  - per API key
  - per user
  - per tenant
  - per IP ASN
- Request chỉ pass nếu **tất cả** quota liên quan đều pass.
- Decision graph:

```text
Check tenant quota --> fail => reject
       │
       ├--> Check user quota --> fail => reject
       │
       └--> Check endpoint quota --> pass => allow
```

### 🔴 Q: Global rate limiting multi-region thiết kế sao? `[Senior]`

**A:**
- Mô hình phổ biến:
  1. Local hard limit per region.
  2. Global soft limit sync async.
- Tránh gọi cross-region synchronous mỗi request (latency cao).
- Token leasing:
  - central allocator cấp quota batch cho từng region.
  - region tiêu thụ local, hết thì xin thêm.

### 🟡 Q: Headers chuẩn khi reject 429 `[Mid]`

**A:**
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 1
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1770009999
Content-Type: application/json

{"error":"rate_limit_exceeded","policy":"checkout-api-user"}
```

### 🔴 Q: Hot key mitigation `[Senior]`

**A:**
- Local pre-check bucket tại gateway node.
- Probabilistic admission khi load cao.
- Split key theo small random suffix + combine approximate counters.
- Load shed theo priority endpoint.

---

## Problem 3 Add-on: Payment System Advanced Follow-ups

### 🟡 Q: Payment state machine ví dụ `[Mid]`

**A:**

```text
created
  ├─(confirm)──────────▶ requires_action
  ├─(auth success)──────▶ authorized
  │                        ├─(capture)────▶ captured
  │                        ├─(void)───────▶ voided
  │                        └─(auth expire)▶ expired
  └─(failure)───────────▶ failed

captured ──(refund partial/full)──▶ refunded_partially/refunded
```

### 🔴 Q: Double-entry ledger invariants `[Senior]`

**A:**
- Mỗi business action ghi 2+ entries cân bằng:
  - debit buyer/clearing
  - credit merchant receivable/payable
- Invariants:
  - Tổng signed amount = 0 per ledger transaction.
  - currency đồng nhất trong 1 ledger transaction.
  - immutable entries, correction bằng reversal entries.

### 🔴 Q: Reconciliation workflow chi tiết `[Senior]`

**A:**
1. Ingest settlement file từ PSP/bank (SFTP/API).
2. Normalize về canonical schema.
3. Match theo priority keys:
   - psp_txn_id
   - merchant_order_id + amount + date
4. Classify mismatches:
   - missing internal
   - missing external
   - amount mismatch
   - status mismatch
5. Auto-resolve known cases + open ticket manual investigation.
6. Generate financial report + aging dashboard.

### 🟡 Q: PCI scope minimization practical checklist `[Mid]`

**A:**
- Hosted fields/redirect checkout để card data không đi qua backend chính.
- Tokenized payment method IDs.
- Network segmentation cho hệ thống chạm card data.
- Secrets management + key rotation.
- Quarterly ASV scans + logging retention policy.

### 🔴 Q: Fraud controls high-level `[Senior]`

**A:**
- Velocity checks: số lần thử theo card/email/IP/device.
- Risk scoring ML + rules kết hợp.
- 3DS step-up authentication cho risk cao.
- Geo anomaly detection.
- Device fingerprint consistency.

---

## Problem 4 Add-on: Ride-Matching Advanced Follow-ups

### 🟡 Q: Geohash query expansion hoạt động ra sao? `[Mid]`

**A:**
- Bắt đầu với prefix độ chính xác cao (cell nhỏ).
- Nếu candidate ít, mở rộng:
  - query neighboring cells cùng precision.
  - nếu vẫn thiếu, giảm precision 1 level.
- Stop condition:
  - đủ K candidates
  - đạt max radius
  - quá timeout budget

### 🔴 Q: Dispatch fairness vs efficiency `[Senior]`

**A:**
- Nếu chỉ tối ưu ETA, tài xế ở hotspot sẽ nhận quá nhiều cuốc.
- Fairness features:
  - idle time bonus
  - recent assignments penalty
  - cancellation penalty
- Objective hybrid:
  - `score = w1*ETA + w2*accept_prob + w3*fairness_term`

### 🔴 Q: Location update ingestion consistency `[Senior]`

**A:**
- Out-of-order GPS events cần discard theo timestamp monotonic.
- De-dup theo `(driver_id, ts, lat, lng hash)`.
- Dead-reckoning smoothing để giảm jitter GPS.
- Backpressure nếu driver gửi quá dày.

### 🟡 Q: ETA architecture options `[Mid]`

**A:**
| Option | Mô tả | Khi phù hợp |
|---|---|---|
| Heuristic speed model | distance / avg speed theo road class | MVP, chi phí thấp |
| Routing engine nội bộ | shortest path + traffic live | scale lớn, chính xác cao |
| 3rd-party map API | outsource routing | triển khai nhanh, phụ thuộc vendor |

### 🔴 Q: Surge abuse prevention `[Senior]`

**A:**
- Clamp multiplier theo khu vực và thời gian.
- Hysteresis để tránh rung liên tục.
- Detect synthetic demand spikes (bot/order spam).
- Human override panel cho sự kiện bất thường.

---

## Problem 5 Add-on: News Feed Advanced Follow-ups

### 🟡 Q: Feed candidate generation có những nguồn nào? `[Mid]`

**A:**
- Follow graph recent posts.
- Similar-interest graph (embedding nearest neighbors).
- Trending cluster theo region/topic.
- Re-engagement candidates (posts đã bỏ lỡ).

### 🔴 Q: Ranking pipeline nhiều tầng `[Senior]`

**A:**
1. **Candidate retrieval** (10K items).
2. **Lightweight scoring** (lọc còn 500).
3. **Heavy model ranking** (top 100).
4. **Re-rank** diversity/safety/business rules.
5. **Final paging** top 20-50.

### 🔴 Q: Consistency expectations cho feed `[Senior]`

**A:**
- Feed thường chấp nhận eventual consistency giây-level.
- Action nhạy cảm (block/mute/privacy change) cần near-real-time enforcement.
- Cần invalidation nhanh khi user block người khác.

### 🟡 Q: Cache invalidation strategy `[Mid]`

**A:**
- TTL ngắn cho first page user-specific.
- Event-driven invalidation khi có post mới từ close-follow.
- Write-through cho inbox cache ở fanout-on-write path.
- Soft TTL + stale-while-revalidate để giảm cache miss spike.

### 🔴 Q: Abuse controls cho timeline `[Senior]`

**A:**
- Rate limit post creation/comment spam.
- Integrity score cho account mới.
- Link safety scanning.
- Downranking content farm patterns.

---

## Problem 6 Add-on: Distributed File Storage Advanced Follow-ups

### 🟡 Q: Chunk size chọn bao nhiêu là hợp lý? `[Mid]`

**A:**
- Chunk quá nhỏ:
  - nhiều metadata records
  - overhead request cao
- Chunk quá lớn:
  - retry tốn bandwidth
  - parallelism thấp
- Thực tế: 8MB-64MB tùy network client profile.

### 🔴 Q: Erasure coding vs replication chi tiết `[Senior]`

**A:**
- Replication 3x:
  - đơn giản, read nhanh
  - storage overhead 200%
- Erasure coding (k+m):
  - overhead thấp hơn đáng kể
  - encode/decode CPU cao, read path phức tạp hơn
- Hybrid:
  - hot data replication
  - cold data erasure coding

### 🔴 Q: Metadata service HA design `[Senior]`

**A:**
- Control plane dùng consensus group (Raft) cho shard metadata.
- Leader chịu write, followers phục vụ read (tùy consistency mode).
- Snapshot + log compaction bắt buộc khi throughput cao.
- Multi-shard routing qua consistent hash ring.

### 🟡 Q: Signed URL security tips `[Mid]`

**A:**
- TTL ngắn (vài phút).
- Bind theo HTTP method + object key.
- Optional: bind IP CIDR/headers.
- Include nonce để chống replay trong window.

### 🔴 Q: Data lifecycle management `[Senior]`

**A:**
- ILM rules:
  - after 30d -> infrequent access tier
  - after 180d -> archive tier
- Versioning + retention lock cho legal hold.
- Delete marker + background compaction cleanup.

---

## Estimation Workbook / Sổ Tay Ước Lượng

### 🟡 Q: Notification queue partition count tính sao? `[Mid]`

**A:**
```text
Assume per partition stable throughput = 2,000 msg/s
Peak enqueue = 14,000 msg/s
Required partitions = 14,000 / 2,000 = 7
Add headroom 2x => 14 partitions
```

### 🟡 Q: Payment DB write IOPS estimation `[Mid]`

**A:**
```text
Peak txn/s = 8,000
Each txn writes:
- payment_intents update: 1
- payment_transactions insert: 1
- ledger_entries insert: 2
Total writes/txn = 4
Write ops/s ≈ 32,000 (before index overhead)
With index+replication factor 2.5 => ~80,000 effective write IOPS
```

### 🟡 Q: Ride location storage/day `[Mid]`

**A:**
```text
Online drivers = 1.5M
Update rate = 0.3/s
Events/s = 450,000
Assume compact event size = 80 bytes
Raw/day = 450,000 * 80 * 86,400 ≈ 3.11 TB/day
If keep 7 days hot => ~21.8 TB (raw)
```

### 🟡 Q: Feed cache memory rough math `[Mid]`

**A:**
```text
Active users/day reading feed = 40M
Cache first page for 20% hottest users = 8M users
Per first-page entry set (IDs+metadata) = ~8KB
Memory ≈ 8M * 8KB = 64GB
With replication 2x + overhead => ~150GB Redis budget
```

### 🟡 Q: Object metadata scale `[Mid]`

**A:**
```text
New objects/day = 50M
Metadata row avg = 300 bytes
Daily metadata growth = 15GB/day
1 year = 5.4TB (without index overhead)
Index overhead x2 => ~10.8TB/year
```

---

## Failure Mode Catalog / Danh Mục Sự Cố

### 🔴 Q: Notification provider outage toàn phần `[Senior]`

**A:**
- Detect qua error rate + timeout spike.
- Open circuit breaker provider.
- Route sang provider dự phòng nếu policy cho phép.
- Nếu không có fallback: queue buffering + degrade non-critical sends.
- Postmortem cần phân tích loss window và replay plan.

### 🔴 Q: Redis outage cho rate limit `[Senior]`

**A:**
- Dùng degraded local limit ở gateway.
- Endpoint critical fail-closed; non-critical fail-open.
- Bật emergency global traffic shaping.
- Kiểm tra after-recovery thundering retry storm.

### 🔴 Q: Payment reconciliation mismatch tăng mạnh `[Senior]`

**A:**
- Freeze auto-settlement phần nghi ngờ.
- Run targeted replay từ event log.
- Compare webhook ingest lag và duplicate ratio.
- Escalate PSP support với sample txn IDs.

### 🔴 Q: Dispatch latency tăng đột biến giờ mưa `[Senior]`

**A:**
- Scale matching workers theo queue lag.
- Relax candidate constraints tạm thời.
- Tăng surge smoothing để giữ supply.
- Monitor timeout wave và conversion match rate.

### 🔴 Q: Feed ranking dependency timeout `[Senior]`

**A:**
- Fall back sang baseline chronological ranking.
- Cache last-good ranking features.
- Use circuit breaker + deadline budget strict.
- Log business KPI impact for rollback/forward decision.

### 🔴 Q: Metadata shard unavailable trong file storage `[Senior]`

**A:**
- Raft leader election / follower promotion.
- Request retry with jitter ở client SDK.
- Temporarily route writes read-only mode nếu cần.
- Validate manifest integrity sau failover.

---

## API Error Contract Examples / Ví Dụ Hợp Đồng Lỗi API

### 🟢 Q: Notification error contract `[Junior]`

**A:**
```json
{
  "error": {
    "code": "PREFERENCE_BLOCKED",
    "message": "User has disabled this channel",
    "retryable": false,
    "requestId": "req_abc"
  }
}
```

### 🟢 Q: Payment idempotency replay response `[Junior]`

**A:**
```json
{
  "intentId": "pi_123",
  "status": "authorized",
  "idempotentReplay": true
}
```

### 🟡 Q: Rate limit rejection with policy hints `[Mid]`

**A:**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "policyId": "checkout-api-user",
    "retryAfterMs": 750,
    "remaining": 0
  }
}
```

---

## Interview Whiteboard Prompts / Prompt Luyện Whiteboard

### 🟢 Q: Hãy sketch notification architecture trong 3 phút `[Junior]`

**A:**
- Bắt đầu với API + queue + channel workers.
- Nhắc preference store, template service.
- Nói rõ retry + DLQ.

### 🟡 Q: Hãy so sánh token bucket và sliding window bằng ví dụ số `[Mid]`

**A:**
- Đưa 1 policy cụ thể (100 req/min).
- Mô tả behavior ở boundary và burst.
- Chốt bằng use-case thực tế.

### 🔴 Q: Thiết kế payment system cho multi-PSP failover `[Senior]`

**A:**
- Nhấn vào orchestration state machine.
- Idempotency key scope chuẩn.
- Reconciliation và settlement là bắt buộc.

### 🔴 Q: Ride-matching khi city-scale event (concert, mưa lớn) `[Senior]`

**A:**
- Dynamic supply-demand balancing.
- Surge guardrails + fairness.
- Emergency capacity modes.

### 🔴 Q: Feed system xử lý celebrity 100M followers `[Senior]`

**A:**
- Không fanout write full.
- Pull model + precompute top posts.
- Cache tiers + async warmers.

### 🔴 Q: Storage system đảm bảo durability 11 nines ra sao `[Senior]`

**A:**
- Replication/erasure coding design.
- Scrubbing + repair pipeline.
- Metadata consistency via consensus.

---

## Mini Case Studies / Tình Huống Thực Tế Rút Gọn

### 🟡 Case 1: OTP delay incident `[Mid]`

**A:**
- Symptom: OTP tới chậm 30-60s.
- Root cause điển hình:
  - marketing campaign tranh queue với transactional.
  - provider 429 và retry chính sách quá aggressive.
- Fix:
  - tách topic/pool.
  - priority aging + provider-aware throttling.

### 🟡 Case 2: Checkout double charge scare `[Mid]`

**A:**
- Symptom: customer phản ánh bị trừ 2 lần.
- Thực tế thường gặp:
  - duplicate auth + 1 capture hợp lệ.
  - hoặc statement pending hold hiển thị như charge.
- Phòng ngừa:
  - idempotent capture.
  - clear customer communication + recon dashboard.

### 🟡 Case 3: Driver starvation hotspot `[Mid]`

**A:**
- Symptom: tài xế ngoại vi ít nhận cuốc.
- Nguyên nhân: scoring quá ưu tiên ETA.
- Cải tiến: thêm fairness term + spatial balancing.

### 🟡 Case 4: Feed stale page complaints `[Mid]`

**A:**
- Symptom: user không thấy post mới ngay.
- Nguyên nhân: cache TTL dài + invalidation miss.
- Cải tiến: event-driven invalidation cho close-follow posts.

### 🟡 Case 5: Multipart upload failure spike `[Mid]`

**A:**
- Symptom: complete upload fail tăng khi mobile network kém.
- Fix:
  - adaptive chunk size nhỏ hơn cho mạng yếu.
  - resumable parts + checksum verify incrementally.

---

## Additional Go Snippets / Mã Go Bổ Sung

### 🟡 Q: Sliding window counter (approx) in Go `[Mid]`

```go
package ratelimit

import "time"

type WindowCounter struct {
	CurrentBucket int64
	CurrentCount  int
	PrevBucket    int64
	PrevCount     int
	BucketSizeSec int64
	Limit         int
}

func (w *WindowCounter) Allow(now time.Time) bool {
	bucket := now.Unix() / w.BucketSizeSec
	if bucket != w.CurrentBucket {
		w.PrevBucket, w.PrevCount = w.CurrentBucket, w.CurrentCount
		w.CurrentBucket, w.CurrentCount = bucket, 0
	}
	frac := float64(now.Unix()%w.BucketSizeSec) / float64(w.BucketSizeSec)
	est := float64(w.CurrentCount) + float64(w.PrevCount)*(1-frac)
	if int(est) >= w.Limit {
		return false
	}
	w.CurrentCount++
	return true
}
```

### 🟡 Q: Payment state transition guard `[Mid]`

```go
package payment

import "fmt"

type Status string

const (
	Created    Status = "created"
	Authorized Status = "authorized"
	Captured   Status = "captured"
	Refunded   Status = "refunded"
)

func CanTransition(from, to Status) bool {
	allowed := map[Status]map[Status]bool{
		Created:    {Authorized: true},
		Authorized: {Captured: true},
		Captured:   {Refunded: true},
	}
	return allowed[from][to]
}

func Transition(from, to Status) error {
	if !CanTransition(from, to) {
		return fmt.Errorf("invalid transition %s -> %s", from, to)
	}
	return nil
}
```

### 🟡 Q: Feed cursor encoding idea `[Mid]`

```go
package feed

import (
	"encoding/base64"
	"encoding/json"
)

type Cursor struct {
	Score float64 `json:"score"`
	Ts    int64   `json:"ts"`
	Post  string  `json:"post"`
}

func EncodeCursor(c Cursor) (string, error) {
	b, err := json.Marshal(c)
	if err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}
```

### 🟡 Q: Multipart checksum validation helper `[Mid]`

```go
package storage

import (
	"crypto/sha256"
	"encoding/hex"
)

func SHA256Hex(data []byte) string {
	sum := sha256.Sum256(data)
	return hex.EncodeToString(sum[:])
}
```

---

## Final Review Checklist / Checklist Ôn Tập Cuối

### 🟢 Quick checklist `[Junior]`

- Đã nêu FR/NFR rõ chưa?
- Đã đưa estimation cơ bản chưa?
- Đã vẽ architecture trái→phải chưa?
- Đã có API + data model chưa?

### 🟡 Mid checklist `[Mid]`

- Đã nêu 2-3 bottleneck chính chưa?
- Đã có retry, timeout, DLQ/rate limit chưa?
- Đã nói monitoring metrics cốt lõi chưa?
- Đã có tradeoff A/B rõ ràng chưa?

### 🔴 Senior checklist `[Senior]`

- Có nói rõ consistency model per path chưa?
- Có failure mode và runbook sơ bộ chưa?
- Có cost/complexity impact cho từng lựa chọn chưa?
- Có compliance/security implications chưa?

---

## Extra Interview Q&A Pack / Bộ Câu Hỏi Bổ Sung

### 🟢 Q: Vì sao mọi bài system design nên bắt đầu bằng scope clarification? `[Junior]`

**A:** Vì cùng tên bài toán nhưng scope khác thì architecture khác hoàn toàn; hỏi sớm giúp tránh thiết kế sai đề.

### 🟢 Q: P95 và P99 khác nhau thế nào về ý nghĩa vận hành? `[Junior]`

**A:** P95 phản ánh trải nghiệm đa số; P99 phản ánh tail latency, quan trọng cho SLA và incident detection.

### 🟡 Q: Khi nào chấp nhận eventual consistency trong payment-adjacent systems? `[Mid]`

**A:** Với reporting/analytics hoặc non-critical views; core ledger/transaction status phải strong hoặc controlled transitions.

### 🟡 Q: Ride matching cần ưu tiên throughput hay latency? `[Mid]`

**A:** Thường ưu tiên latency cho user experience, nhưng phải giữ throughput đủ bằng queueing + autoscale.

### 🔴 Q: Làm sao tránh dual-write inconsistency giữa DB và event bus? `[Senior]`

**A:** Dùng outbox pattern: ghi DB + outbox trong cùng transaction, worker publish outbox ra bus, đảm bảo eventually consistent an toàn.

### 🔴 Q: Khi nào nên dùng consensus cho metadata plane? `[Senior]`

**A:** Khi cần linearizable writes cho namespace/object state và tránh split brain trong failover.

### 🔴 Q: Nếu interviewer hỏi “design under cost constraint” thì trả lời sao? `[Senior]`

**A:** Nêu tiered architecture, degrade non-critical features, choose simpler storage for cold path, và quant hóa cost theo QPS/storage.

### 🔴 Q: Tại sao DLQ không phải “thùng rác vĩnh viễn”? `[Senior]`

**A:** DLQ phải có ownership + triage SLA + replay policy; nếu không sẽ tích nợ kỹ thuật và mất dữ liệu business-critical.

---

## Appendices / Phụ Lục

### Appendix A — Common SLA targets

| System | Typical SLA target | Ghi chú |
|---|---|---|
| OTP notifications | 99.95% | độ trễ ưu tiên cao |
| Marketing notifications | 99.9% | có thể queue delay |
| Payment auth API | 99.99% | domain nhạy cảm |
| Ride dispatch | 99.99% | real-time critical |
| Feed read API | 99.95% | degrade graceful được |
| Object metadata API | 99.99% | control plane quan trọng |

### Appendix B — Incident severity mapping

| Severity | Điều kiện | Ví dụ |
|---|---|---|
| Sev-1 | customer impact rộng + revenue risk cao | payment capture fail toàn vùng |
| Sev-2 | partial impact đáng kể | feed latency tăng 3x 1 region |
| Sev-3 | impact hẹp/không critical | campaign delay nhẹ |

### Appendix C — Interview answer structure template

```text
1) Clarify scope + assumptions
2) Estimate scale (QPS/storage/latency)
3) Propose high-level architecture
4) Define API + data model
5) Deep dive 2-3 hard parts
6) Discuss tradeoffs + failure handling
7) Wrap with monitoring + future scaling
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: How would you design a rate limiting system that works across multiple server instances? / Thiết kế hệ thống rate limiting hoạt động trên nhiều server như thế nào? 🔴 Senior

**A:** A distributed rate limiter requires a shared state store (typically Redis) so all instances enforce limits consistently. Common algorithms: Token Bucket (smooth bursting), Sliding Window Log (precise but memory-heavy), Sliding Window Counter (approximate but memory-efficient). The key design choices are: fixed vs sliding window, where to enforce (API Gateway vs per-service), and how to handle Redis unavailability (fail-open vs fail-closed).

```text
Client → API Gateway → Redis INCR + EXPIRE → Allow/Reject
                              ↓ (Redis down)
                         Local fallback counter (fail-open)
```

Vietnamese explanation: Rate limiting phân tán cần shared state để mọi server node đếm cùng một bucket. Redis với lệnh `INCR` + `EXPIRE` là lựa chọn phổ biến nhất vì atomic và nhanh. Bạn cần quyết định trade-off giữa độ chính xác (Sliding Window Log tốn memory O(requests)) và hiệu quả (Fixed Window có race condition ở boundary). Trong phỏng vấn, hãy đề cập đến vấn đề Redis SPOF và chiến lược fallback.

---

### Q: What is distributed locking and when should you use it? / Distributed locking là gì và khi nào nên dùng? 🟡 Mid

**A:** A distributed lock ensures that only one process/node executes a critical section at a time across a distributed system. Common implementations: Redis `SET key value NX PX ttl` (Redlock for multi-node), ZooKeeper ephemeral znodes, etcd leases. Use distributed locks when: preventing double-processing of a job, coordinating leader election, or protecting a shared resource (e.g., file write). Pitfalls: lock expiry while holder is still working (use fencing tokens), Redis single-node failure (use Redlock with 5 nodes), deadlock if holder crashes before releasing.

Vietnamese explanation: Distributed lock giải quyết race condition khi nhiều service instance cùng tranh nhau làm một việc — ví dụ cron job chạy trên 3 pod, chỉ 1 pod được phép thực thi. Redis `SET NX PX` là cách đơn giản nhất, nhưng nếu Redis node chết sau khi lock được set thì lock mất. Redlock dùng majority quorum trên 5 Redis node để tăng reliability. Fencing token (monotonic counter) là kỹ thuật quan trọng để phát hiện stale lock holder.

---

### Q: Explain consistent hashing and why it matters for distributed caching. / Giải thích consistent hashing và tại sao nó quan trọng với distributed cache? 🟡 Mid

**A:** Consistent hashing maps both cache nodes and keys onto a virtual ring (0 to 2³²). A key is assigned to the first node clockwise from its hash position. When a node is added/removed, only the keys between the new node and its predecessor need to be remapped — on average `k/n` keys (k = total keys, n = nodes), compared to nearly all keys in naive modulo hashing. Virtual nodes (vnodes) per physical node compensate for uneven load distribution.

```text
Ring: 0 ──── NodeA ──── NodeB ──── NodeC ──── 2³²
      Key1→A, Key2→B, Key3→C  (add NodeD: only ~25% keys move)
```

Vietnamese explanation: Với modulo hashing (`key % N`), thêm hoặc xóa 1 node khiến gần như toàn bộ key phải remap — cache miss hàng loạt gây thundering herd lên database. Consistent hashing chỉ di chuyển `1/N` phần key trung bình. Đây là lý do tại sao Memcached, DynamoDB, Cassandra đều dùng kỹ thuật này. Trong phỏng vấn, hãy đề cập đến virtual nodes để xử lý hot spot khi các node có capacity khác nhau.

---

### Q: What is CQRS and when does it make sense to apply it? / CQRS là gì và khi nào nên áp dụng? 🔴 Senior

**A:** CQRS (Command Query Responsibility Segregation) separates the write model (Commands that mutate state) from the read model (Queries that return data). Commands go through domain logic and update a write store; the read side maintains denormalized projections optimized for specific query patterns. This enables independent scaling, different storage technologies per side, and simpler query models. It adds complexity: eventual consistency between write and read stores, multiple data models to maintain, and more infrastructure.

Vietnamese explanation: CQRS phù hợp khi read/write load chênh lệch lớn (ví dụ: e-commerce có 99% đọc, 1% ghi), hoặc khi domain phức tạp cần tách bạch business logic khỏi query optimization. Read side có thể dùng Elasticsearch cho full-text search trong khi write side dùng PostgreSQL. Không nên áp dụng CQRS cho CRUD đơn giản — overhead không xứng đáng. Trong hệ thống lớn, CQRS thường đi cùng Event Sourcing nhưng hai khái niệm này độc lập nhau.

---

### Q: What is Event Sourcing and how does it differ from traditional state storage? / Event Sourcing là gì và khác gì với lưu trạng thái truyền thống? 🔴 Senior

**A:** Traditional storage saves the current state: `UPDATE orders SET status='shipped' WHERE id=1`. Event Sourcing saves every state-changing event as an immutable append-only log: `[OrderPlaced, PaymentReceived, OrderShipped]`. Current state is derived by replaying events from the beginning (or from a snapshot). Benefits: full audit trail, ability to replay to any point in time, natural fit for event-driven architectures, temporal queries. Drawbacks: eventual consistency for reads, event schema evolution complexity, replay performance (mitigated by snapshots).

```text
Traditional:  orders table → {id:1, status:"shipped", total:99}
Event Sourcing: event_log → [OrderPlaced(99), Paid(99), Shipped] → replay → same state
```

Vietnamese explanation: Event Sourcing giải quyết câu hỏi "tại sao trạng thái lại như vậy?" mà traditional storage không trả lời được. Ví dụ điển hình: hệ thống ngân hàng lưu từng transaction thay vì chỉ lưu balance cuối. Điểm khó nhất là event schema evolution — khi business logic thay đổi, các event cũ vẫn phải replay được. Snapshot giúp tránh replay toàn bộ history mỗi lần đọc. Trong phỏng vấn, phân biệt rõ Event Sourcing (persistence strategy) với Event-Driven Architecture (communication pattern).

