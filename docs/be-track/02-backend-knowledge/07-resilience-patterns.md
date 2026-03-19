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

## Table of Contents

1. [Load Balancing Strategies](#1-load-balancing-strategies) 2. [Circuit Breaker Pattern](#2-circuit-breaker-pattern) 3. [Bulkhead Isolation](#3-bulkhead-isolation) 4. [Rate Limiting](#4-rate-limiting) 5. [Retry Patterns](#5-retry-patterns) 6. [Timeout Patterns](#6-timeout-patterns) 7. [Graceful Degradation](#7-graceful-degradation) 8. [Health Checks](#8-health-checks) 9. [Backpressure](#9-backpressure)
10. [Interview Q&A Section](#10-interview-qa-section)

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

## Final Notes

Resilience là hệ thống nhiều lớp, không phải một kỹ thuật đơn lẻ. Trong interview Mid-Senior, hãy trả lời theo khung: failure mode → pattern → trade-off → metrics → Go implementation detail.
