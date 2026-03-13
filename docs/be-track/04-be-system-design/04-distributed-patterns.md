# Distributed Patterns for Backend Interviews — Mẫu Thiết Kế Phân Tán


> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Backend Track — System Design
> Cross-referenced by: `shared/02-system-design/system-design-theory.md`, `shared/02-system-design/consensus-algorithms.md`, `shared/01-cs-fundamentals/networking-theory.md`, `be-track/02-backend-knowledge/02-microservices.md`, `be-track/02-backend-knowledge/03-distributed-systems.md`

---

## Pattern 1: Saga Pattern / Mẫu Saga

### 🟡 Q: What is Saga? `[Mid]`

**A:**
Saga là pattern quản lý transaction xuyên nhiều service mà không dùng distributed 2PC. Mỗi bước local transaction thành công thì phát event hoặc gọi bước tiếp theo; nếu lỗi thì chạy compensation để undo logic business.

```text
Order Service -> Payment Service -> Inventory Service -> Shipping Service
       ▲               ▲                 ▲
       └──── compensation chain nếu fail ─┘
```

### 🟡 Q: Choreography vs Orchestration `[Mid]`

**A:**
- **Choreography:** services tự lắng nghe event của nhau, không có coordinator trung tâm.
- **Orchestration:** có Saga Orchestrator điều phối flow rõ ràng.

| Mode | Ưu điểm | Nhược điểm |
|---|---|---|
| Choreography | Loose coupling, ít central SPOF | Flow khó trace, dễ thành event spaghetti |
| Orchestration | Dễ quan sát, logic tập trung | Coordinator phức tạp, có thể bottleneck |

### 🔴 Q: When NOT to use Saga? `[Senior]`

**A:**
- Khi domain yêu cầu strict ACID cross-service real-time.
- Khi compensation không khả thi (external irreversible effects).
- Khi team chưa có event observability tốt (trace/debug khó).

### 🟡 Go sketch (orchestrator) `[Mid]`

```go
type Step interface {
	Do(ctx context.Context, data map[string]any) error
	Compensate(ctx context.Context, data map[string]any) error
}

func RunSaga(ctx context.Context, steps []Step, data map[string]any) error {
	completed := make([]Step, 0, len(steps))
	for _, s := range steps {
		if err := s.Do(ctx, data); err != nil {
			for i := len(completed) - 1; i >= 0; i-- {
				_ = completed[i].Compensate(ctx, data)
			}
			return err
		}
		completed = append(completed, s)
	}
	return nil
}
```

---

## Pattern 2: Circuit Breaker / Mạch Ngắt

### 🟢 Q: Circuit breaker là gì? `[Junior]`

**A:**
Circuit breaker bảo vệ service khỏi gọi dependency đang lỗi liên tục. Nó có 3 trạng thái:
- **Closed:** call bình thường.
- **Open:** chặn call trong một khoảng thời gian.
- **Half-open:** cho một số request test để quyết định đóng lại hay mở tiếp.

```text
Closed --(failure threshold)--> Open --(timeout)--> Half-open
Half-open --(success threshold)--> Closed
Half-open --(failure)-----------> Open
```

### 🟡 Q: Khi nào nên dùng? `[Mid]`

**A:**
- Gọi remote service qua network (payment, profile, recommendations).
- Dependency có thể timeout/latency spike.
- Cần graceful degradation thay vì treo toàn hệ thống.

### 🔴 Q: Khi nào KHÔNG nên dùng? `[Senior]`

**A:**
- Local function/memory call không qua network.
- Operation cực hiếm, metrics không đủ để mở/đóng breaker chính xác.
- Flow bắt buộc fail fast ngay lập tức bởi policy business.

### 🟡 Go code sketch `[Mid]`

```go
type State int

const (
	Closed State = iota
	Open
	HalfOpen
)

type Breaker struct {
	state          State
	failureCount   int
	successCount   int
	failureThresh  int
	halfOpenSucc   int
	openUntil      time.Time
	openDuration   time.Duration
	mu             sync.Mutex
}

func (b *Breaker) Allow() bool {
	b.mu.Lock()
	defer b.mu.Unlock()
	if b.state == Open {
		if time.Now().After(b.openUntil) {
			b.state = HalfOpen
			b.successCount = 0
			return true
		}
		return false
	}
	return true
}

func (b *Breaker) OnResult(err error) {
	b.mu.Lock()
	defer b.mu.Unlock()
	if err == nil {
		if b.state == HalfOpen {
			b.successCount++
			if b.successCount >= b.halfOpenSucc {
				b.state, b.failureCount = Closed, 0
			}
			return
		}
		b.failureCount = 0
		return
	}

	b.failureCount++
	if b.failureCount >= b.failureThresh {
		b.state = Open
		b.openUntil = time.Now().Add(b.openDuration)
	}
}
```

---

## Pattern 3: CQRS / Tách Lệnh và Truy Vấn

### 🟡 Q: CQRS là gì? `[Mid]`

**A:**
CQRS tách write model (Command) và read model (Query) thành hai đường riêng để tối ưu khác nhau.
- Command side ưu tiên consistency/business invariants.
- Query side ưu tiên latency và shape dữ liệu cho UI.

```text
Command API -> Write DB -> Event Bus -> Read Model Projector -> Read DB -> Query API
```

### 🟡 Q: Khi nên dùng? `[Mid]`

**A:**
- Read/write pattern chênh lệch lớn.
- Query phức tạp, cần denormalized view.
- Domain có nhiều business rule trên write.

### 🔴 Q: Khi không nên dùng? `[Senior]`

**A:**
- CRUD đơn giản, scale nhỏ.
- Team chưa sẵn sàng vận hành eventual consistency.
- Không có nhu cầu projection/read model đặc thù.

---

## Pattern 4: Event Sourcing / Nguồn Sự Thật Dựa Trên Event

### 🟡 Q: Event sourcing hoạt động thế nào? `[Mid]`

**A:**
Thay vì lưu trạng thái hiện tại, hệ thống lưu chuỗi event bất biến. State hiện tại được rebuild bằng replay event.

```text
Event Store:
[AccountCreated, MoneyDeposited, MoneyWithdrawn, ...]
State(account) = fold(events)
```

### 🔴 Q: Snapshots để làm gì? `[Senior]`

**A:**
Khi stream event dài, replay toàn bộ tốn thời gian. Snapshot lưu state tại version N, khi load chỉ replay từ N+1.

### 🔴 Q: Rủi ro chính? `[Senior]`

**A:**
- Event schema evolution phức tạp.
- Debug khó nếu tooling chưa tốt.
- Storage tăng nhanh nếu retention không quản trị.

### 🟡 Go fold sketch `[Mid]`

```go
type Event struct {
	Type string
	Amt  int64
}

type Balance struct { Value int64 }

func Apply(b Balance, e Event) Balance {
	switch e.Type {
	case "Deposited":
		b.Value += e.Amt
	case "Withdrawn":
		b.Value -= e.Amt
	}
	return b
}
```

---

## Pattern 5: Service Mesh / Lưới Dịch Vụ

### 🟢 Q: Service mesh là gì? `[Junior]`

**A:**
Service mesh là tầng hạ tầng xử lý network concerns (mTLS, retry, timeout, traffic shifting, observability) qua sidecar proxy thay vì code trong từng service.

```text
[Service A + Sidecar] <----mTLS----> [Service B + Sidecar]
             \                         /
              \---- Control Plane ----/
```

### 🟡 Q: Khi dùng Istio/Linkerd có lợi gì? `[Mid]`

**A:**
- Chính sách bảo mật thống nhất (mTLS, authz).
- Quan sát tốt hơn (metrics/traces chuẩn).
- Canary, blue/green, traffic split dễ hơn.

### 🔴 Q: Khi không nên dùng mesh? `[Senior]`

**A:**
- Hệ thống nhỏ, overhead sidecar không đáng.
- Team SRE chưa đủ bandwidth vận hành control plane.
- Latency budget quá chặt và không chấp nhận overhead proxy.

---

## Pattern 6: Distributed Tracing / Theo Dõi Phân Tán

### 🟡 Q: Tracing giải quyết vấn đề gì? `[Mid]`

**A:**
Giúp theo dõi 1 request đi qua nhiều service, biết chỗ nào chậm/lỗi. Core concepts:
- **Trace:** toàn bộ hành trình request.
- **Span:** 1 bước con trong trace.
- **Context propagation:** truyền `trace-id/span-id` qua headers.

```text
Client -> API -> OrderSvc -> PaymentSvc -> DB
TraceID: abc123 xuyên suốt tất cả spans
```

### 🟡 Go OpenTelemetry sketch `[Mid]`

```go
ctx, span := tracer.Start(ctx, "checkout.handle")
defer span.End()

ctx2, child := tracer.Start(ctx, "payment.authorize")
err := paymentClient.Authorize(ctx2, req)
if err != nil {
	child.RecordError(err)
}
child.End()
```

### 🔴 Q: Common pitfalls `[Senior]`

**A:**
- Quên propagate context qua goroutine/channel.
- Sampling sai khiến mất trace quan trọng.
- High-cardinality tags gây tốn storage/cost.

---

## Pattern 7: Idempotency Patterns / Mẫu Idempotency

### 🟡 Q: Idempotency key là gì? `[Mid]`

**A:**
Idempotency key giúp retry nhiều lần vẫn chỉ tạo 1 business effect. Thường áp dụng cho POST quan trọng: payment, order creation, notification send.

### 🟡 Q: Exactly-once có thật không? `[Mid]`

**A:**
Trong distributed systems, thường đạt được “effectively once” bằng:
- at-least-once delivery + dedupe/idempotent consumer
- atomic write + outbox pattern
- unique constraints business key

### 🔴 Q: Khi nào idempotency không đủ? `[Senior]`

**A:**
Khi side effect external không support dedupe (ví dụ downstream legacy). Lúc này cần compensating flow + reconciliation định kỳ.

---

## Pattern 8: Bulkhead Pattern / Vách Ngăn Tài Nguyên

### 🟢 Q: Bulkhead là gì? `[Junior]`

**A:**
Bulkhead tách tài nguyên (thread pool, connection pool, queue) theo dependency hoặc workload để lỗi ở một khu vực không làm sập toàn bộ hệ thống.

```text
Pool A (payment)   Pool B (search)   Pool C (email)
   full?               healthy            healthy
=> chỉ payment degraded, hệ thống còn lại vẫn chạy
```

### 🟡 Q: Khi dùng? `[Mid]`

**A:**
- Một service gọi nhiều downstream có profile khác nhau.
- Muốn tránh cascade failure khi 1 downstream bị treo.

### 🔴 Q: Tradeoff `[Senior]`

**A:**
- Isolation tốt nhưng tổng hiệu suất có thể giảm do không chia sẻ pool linh hoạt.
- Cần tuning giới hạn mỗi compartment liên tục.

---

## Pattern 9: Retry with Backoff / Thử Lại Có Backoff

### 🟢 Q: Tại sao cần jitter? `[Junior]`

**A:**
Nếu tất cả client retry cùng thời điểm sẽ tạo thundering herd. Jitter random hóa delay giúp dàn đều tải.

### 🟡 Q: Công thức backoff phổ biến `[Mid]`

**A:**
- Exponential: `delay = min(base * 2^attempt, max)`
- Full jitter: `sleep = rand(0, delay)`
- Decorrelated jitter: ổn định hơn trong hệ thống lớn.

### 🟡 Go retry sketch `[Mid]`

```go
func Retry(ctx context.Context, max int, base, maxWait time.Duration, fn func(context.Context) error) error {
	var err error
	for i := 0; i < max; i++ {
		err = fn(ctx)
		if err == nil {
			return nil
		}
		capDelay := base << i
		if capDelay > maxWait {
			capDelay = maxWait
		}
		jitter := time.Duration(rand.Int63n(int64(capDelay)))
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(jitter):
		}
	}
	return err
}
```

### 🔴 Q: Khi nào KHÔNG retry? `[Senior]`

**A:**
- Lỗi business logic chắc chắn thất bại (validation, auth 4xx).
- Operation không idempotent và không có guard.
- Deadline request còn quá ngắn, retry chỉ làm tệ hơn.

---

## Interview Q&A Drill / Bộ Câu Hỏi Phỏng Vấn

### 🟢 Q1: Saga khác 2PC ở điểm cốt lõi nào? `[Junior]`

**A:** Saga dùng local transactions + compensation, không lock distributed như 2PC, nên scale tốt hơn nhưng consistency thường eventual.

### 🟡 Q2: Tại sao circuit breaker cần half-open state? `[Mid]`

**A:** Để thăm dò dependency đã hồi phục chưa bằng một lượng request nhỏ, tránh mở lại full traffic quá sớm.

### 🟡 Q3: CQRS có bắt buộc đi cùng event sourcing không? `[Mid]`

**A:** Không bắt buộc. CQRS chỉ là tách read/write model; event sourcing là cách lưu state dựa event log, có thể đi cùng hoặc không.

### 🔴 Q4: Event schema evolution nên xử lý sao để replay không vỡ? `[Senior]`

**A:** Dùng versioned events, upcaster/translator khi replay, giữ backward compatibility, và test replay trên dữ liệu lịch sử.

### 🟡 Q5: Service mesh thay thế được API gateway không? `[Mid]`

**A:** Không hoàn toàn. Mesh xử lý east-west traffic nội bộ tốt, gateway vẫn cần cho north-south concerns (auth edge, WAF, public routing).

### 🔴 Q6: Tracing sampling 100% có luôn tốt? `[Senior]`

**A:** Không; cost rất cao. Nên dùng head+tail sampling, giữ full trace cho error/high latency path.

### 🟡 Q7: Idempotency key nên expire khi nào? `[Mid]`

**A:** TTL phải lớn hơn retry window của client/network (thường 24-72h), tùy domain risk của duplicate.

### 🟡 Q8: Bulkhead có thể kết hợp với circuit breaker không? `[Mid]`

**A:** Có, và nên kết hợp. Bulkhead giới hạn blast radius, breaker giảm gọi vô ích tới dependency lỗi.

### 🔴 Q9: Retry policy đặt ở client hay service mesh? `[Senior]`

**A:** Tùy use case; retry infra-level (mesh) cho lỗi mạng đơn giản, retry business-aware nên ở application để hiểu idempotency/deadline.

### 🔴 Q10: Pattern nào dễ bị lạm dụng nhất trong microservices? `[Senior]`

**A:** CQRS + Event Sourcing thường bị over-engineer khi domain chưa đủ phức tạp; cần justify bằng scale/consistency/query requirements rõ ràng.

---

## Cross-Reference Map / Bản Đồ Liên Kết

- Distributed systems foundations: `be-track/02-backend-knowledge/03-distributed-systems.md`
- Microservices operational concerns: `be-track/02-backend-knowledge/02-microservices.md`
- System design principles: `shared/02-system-design/system-design-theory.md`
- Consensus and coordination: `shared/02-system-design/consensus-algorithms.md`
- Network failure/latency model: `shared/01-cs-fundamentals/networking-theory.md`


## Extended Theory and Interview Depth / Mở Rộng Lý Thuyết và Độ Sâu Phỏng Vấn

---

## Pattern Interactions / Tương Tác Giữa Các Pattern

### 🔴 Q: Saga + Outbox + Idempotency kết hợp thế nào? `[Senior]`

**A:**
- Saga điều phối business transaction đa service.
- Outbox đảm bảo event publish không mất khi ghi DB.
- Idempotency đảm bảo retry không tạo side effect trùng.

```text
Write DB txn:
  - business row update
  - outbox event insert
Commit
  -> outbox relay publish event
Consumer -> idempotent handler (dedupe key)
```

Khi kết hợp đúng, hệ thống đạt “effectively-once business outcome” dù hạ tầng là at-least-once.

### 🔴 Q: Circuit breaker + Retry có thể phản tác dụng không? `[Senior]`

**A:**
Có. Nếu retry quá aggressive khi dependency đang lỗi, breaker sẽ mở nhanh hơn và tạo storm. Nguyên tắc:
- retry phải bounded theo deadline/request budget.
- retry count nhỏ cho synchronous user path.
- ưu tiên backoff + jitter và cancellation context.

### 🟡 Q: Bulkhead + CQRS support nhau ra sao? `[Mid]`

**A:**
- CQRS tách read/write path.
- Bulkhead tách resource cho từng path.
- Khi read spike, write path vẫn ổn định do pool/queue riêng.

---

## Pattern 1 Extended: Saga Operational Concerns

### 🔴 Q: Compensation có luôn “undo” hoàn toàn không? `[Senior]`

**A:**
Không phải lúc nào cũng perfect undo. Compensation thường là **new action** để đưa system về state chấp nhận được về business.
Ví dụ:
- Đã gửi email xác nhận thì không thể “thu hồi” email; chỉ có thể gửi correction.
- Đã gọi shipment external có thể cần cancel request, nhưng có thể fail.

### 🟡 Q: Saga timeout policy `[Mid]`

**A:**
- Mỗi step có timeout riêng + toàn saga có TTL tổng.
- Hết TTL:
  - mark saga `timed_out`
  - chạy compensation cho steps completed
  - tạo alert/manual intervention nếu compensation fail

### 🔴 Q: Persist saga state ở đâu? `[Senior]`

**A:**
- Lưu state machine vào DB/event store:
  - saga_id
  - current_step
  - step_status map
  - retry_count
  - last_error
- Tránh giữ state chỉ trong memory orchestrator (dễ mất khi restart).

---

## Pattern 2 Extended: Circuit Breaker Tuning

### 🟡 Q: Các threshold nên chọn thế nào? `[Mid]`

**A:**
- Dựa vào error budget và traffic profile:
  - `failureThreshold`: số lỗi liên tục hoặc error-rate trong window.
  - `openDuration`: đủ để dependency hồi phục ngắn hạn.
  - `halfOpenMaxCalls`: số probe an toàn.
- Không dùng magic number cố định cho mọi dependency.

### 🔴 Q: Error-rate based breaker vs consecutive-failure breaker `[Senior]`

**A:**
| Mode | Pros | Cons |
|---|---|---|
| Consecutive failure | Đơn giản, phản ứng nhanh | Dễ noisy khi traffic thấp |
| Error-rate window | Ổn định hơn traffic cao | Tính toán phức tạp hơn |

Production thường hybrid: cần min requests trước khi đánh giá error rate.

### 🟡 Q: Fallback strategy ví dụ `[Mid]`

**A:**
- Product detail service down:
  - trả cached stale data với marker.
- Recommendation service down:
  - fallback danh sách popular items.
- Payment service down:
  - fail fast, không fallback giả mạo thành công.

---

## Pattern 3 Extended: CQRS Data Synchronization

### 🟡 Q: Projection lag xử lý sao? `[Mid]`

**A:**
- Theo dõi metric `projection_lag_seconds`.
- Nếu lag vượt ngưỡng:
  - scale projector consumers
  - tune batch size
  - kiểm tra hotspot partition
- UI có thể hiển thị badge “updating...” khi read model chưa bắt kịp.

### 🔴 Q: Read-your-own-write trong CQRS đạt được không? `[Senior]`

**A:**
Có thể đạt gần đúng bằng:
- sticky read sang write model ngay sau command success trong một khoảng ngắn.
- hoặc gửi version token từ command response, query chờ projection >= version đó.

### 🔴 Q: CQRS anti-pattern phổ biến `[Senior]`

**A:**
- Split quá sớm khi domain đơn giản.
- Tạo quá nhiều read models khó maintain.
- Không có ownership rõ cho projection failures.

---

## Pattern 4 Extended: Event Sourcing in Practice

### 🟡 Q: Event versioning strategy `[Mid]`

**A:**
- Event schema có `type` + `version`.
- Consumer hỗ trợ backward-compatible parsing.
- Upcaster chuyển event cũ thành shape mới khi replay.

### 🔴 Q: Snapshot cadence chọn sao? `[Senior]`

**A:**
- Snapshot mỗi N events (e.g., 500) hoặc mỗi T phút.
- Cân bằng giữa:
  - write overhead snapshot
  - read/replay latency
- Aggregate nóng có thể snapshot dày hơn.

### 🔴 Q: GDPR/right-to-be-forgotten với event sourcing `[Senior]`

**A:**
- Event immutable gây khó xóa dữ liệu.
- Cách tiếp cận:
  - tách PII khỏi event stream (reference token).
  - crypto-shredding key của PII blobs.
  - data minimization từ đầu.

---

## Pattern 5 Extended: Service Mesh Operational Tradeoffs

### 🟡 Q: Data plane vs control plane `[Mid]`

**A:**
- Data plane: sidecar proxy xử lý traffic runtime.
- Control plane: phân phối policy/config/cert.
- Outage control plane không nên làm data plane chết ngay (cần cached config).

### 🔴 Q: mTLS rollout strategy `[Senior]`

**A:**
1. Observe mode trước (permissive).
2. Enforce dần theo namespace/service.
3. Theo dõi handshake errors và cert rotation incidents.

### 🔴 Q: Mesh cost model `[Senior]`

**A:**
- Overhead CPU/memory per sidecar.
- Network hop và serialization overhead.
- Ops overhead cho control plane upgrades.
- Cần business justification rõ trước khi full adoption.

---

## Pattern 6 Extended: Distributed Tracing Architecture

### 🟡 Q: Span taxonomy nên chuẩn hóa thế nào? `[Mid]`

**A:**
- Server span: entry handler.
- Client span: outbound RPC/HTTP.
- Internal span: compute đáng kể.
- DB span: query execution.

### 🔴 Q: Sampling strategies `[Senior]`

**A:**
- Head sampling: quyết định ở đầu request, rẻ nhưng có thể bỏ sót lỗi hiếm.
- Tail sampling: quyết định cuối trace, giữ trace lỗi/latency cao tốt hơn, nhưng tốn infra hơn.

### 🟡 Q: Correlate trace với log/metric `[Mid]`

**A:**
- Log phải chứa `trace_id`, `span_id`.
- Metrics labels nên gọn (tránh cardinality cao).
- Incident drilldown từ alert metric -> trace -> logs.

---

## Pattern 7 Extended: Idempotency Beyond HTTP

### 🟡 Q: Idempotent consumer cho message queue `[Mid]`

**A:**
- Mỗi event có `event_id`.
- Consumer lưu processed IDs (TTL hoặc permanent tùy domain).
- Nếu thấy event_id đã xử lý thì ack bỏ qua.

### 🔴 Q: Dedupe store retention policy `[Senior]`

**A:**
- TTL quá ngắn: duplicate lọt qua.
- TTL quá dài: tốn storage + false block nếu key reuse không đúng.
- Chọn theo max retry window + business dispute window.

### 🔴 Q: Exactly-once semantics với Kafka? `[Senior]`

**A:**
Kafka EOS giúp producer/transaction stream processing, nhưng end-to-end business exactly-once vẫn cần idempotent sink/consumer design.

---

## Pattern 8 Extended: Bulkhead Resource Design

### 🟡 Q: Bulkhead dimensions `[Mid]`

**A:**
- Theo dependency (payment/search/email).
- Theo endpoint criticality (checkout vs analytics).
- Theo tenant tiers (enterprise/free).

### 🔴 Q: Queue bulkhead vs thread pool bulkhead `[Senior]`

**A:**
| Type | Ưu điểm | Nhược điểm |
|---|---|---|
| Queue bulkhead | absorb burst tốt | queueing delay có thể cao |
| Thread/worker pool bulkhead | latency control tốt | burst tolerance thấp hơn |

### 🟡 Q: Capacity planning quick rule `[Mid]`

**A:**
- Mỗi compartment cần:
  - max concurrency
  - max queue depth
  - timeout budget
- Khi queue depth vượt ngưỡng, ưu tiên shed low-priority traffic.

---

## Pattern 9 Extended: Retry Backoff Policies

### 🟡 Q: Retry budget là gì? `[Mid]`

**A:**
Retry budget giới hạn tổng request phụ do retry so với request gốc, ví dụ không quá 20%. Giúp tránh khuếch đại sự cố.

### 🔴 Q: Hedged requests khác retry thế nào? `[Senior]`

**A:**
- Retry: gửi lại sau khi thất bại/timeout.
- Hedge: gửi request thứ 2 sau một ngưỡng latency mà request đầu chưa xong.
- Hedge giảm tail latency nhưng tăng load, cần giới hạn nghiêm.

### 🔴 Q: Deadline-aware retries `[Senior]`

**A:**
- Mỗi retry phải kiểm tra `remaining_time` của context.
- Nếu không còn đủ thời gian cho attempt meaningful thì fail fast.

---

## End-to-End Scenario Q&A / Q&A Kịch Bản Tổng Hợp

### 🔴 Q: Checkout service timeout chain xảy ra, bạn áp dụng pattern nào theo thứ tự? `[Senior]`

**A:**
1. Timeout + cancellation propagation chuẩn.
2. Retry with jitter cho lỗi transient.
3. Circuit breaker để cắt dependency unhealthy.
4. Bulkhead để bảo vệ luồng checkout khỏi luồng phụ.
5. Tracing để xác định bottleneck cụ thể.

### 🔴 Q: Đội ngũ muốn chuyển từ sync calls sang event-driven cho order flow, nên bắt đầu đâu? `[Senior]`

**A:**
- Bắt đầu bằng outbox pattern ở service write-heavy.
- Thiết kế idempotent consumers trước khi mở rộng topics.
- Chọn orchestration Saga cho flow có compensation rõ.
- Thiết lập observability baseline (lag, DLQ, trace).

### 🟡 Q: Khi nào service mesh không giải quyết được vấn đề latency? `[Mid]`

**A:**
Khi bottleneck nằm ở application logic/DB query hoặc network topology vật lý; mesh chỉ giúp policy/network control, không sửa được thuật toán chậm.

---

## Architecture ASCII Collection / Bộ Sơ Đồ ASCII

### Saga Orchestration Diagram

```text
Client
  │
  ▼
Order API
  │ create saga
  ▼
Saga Orchestrator
  ├── Step1: Reserve Inventory
  ├── Step2: Authorize Payment
  ├── Step3: Create Shipment
  └── On failure: Compensate in reverse order
```

### Circuit Breaker + Retry + Bulkhead

```text
[Handler]
   │
   ├─(bulkhead pool A)─▶ [CB] ─▶ [Retry policy] ─▶ Downstream A
   └─(bulkhead pool B)─▶ [CB] ─▶ [Retry policy] ─▶ Downstream B
```

### CQRS + Event Sourcing Integration

```text
Command API -> Aggregate -> Append Event -> Event Store
                                  │
                                  └-> Projector -> Read DB -> Query API
```

### Tracing Propagation

```text
Gateway(trace=abc)
  ├─> OrderSvc(span=1)
  │     ├─> PaymentSvc(span=1.1)
  │     └─> InventorySvc(span=1.2)
  └─> NotificationSvc(span=2)
```

---

## Go Snippet Pack / Gói Ví Dụ Go

### 🟡 Context propagation helper `[Mid]`

```go
package traceutil

import "context"

type TraceContextKey struct{}

type TraceMeta struct {
	TraceID string
	SpanID  string
}

func WithTrace(ctx context.Context, t TraceMeta) context.Context {
	return context.WithValue(ctx, TraceContextKey{}, t)
}

func TraceFrom(ctx context.Context) (TraceMeta, bool) {
	v := ctx.Value(TraceContextKey{})
	if v == nil {
		return TraceMeta{}, false
	}
	t, ok := v.(TraceMeta)
	return t, ok
}
```

### 🟡 Simple idempotent consumer skeleton `[Mid]`

```go
package consumer

import "context"

type DedupeStore interface {
	Seen(ctx context.Context, id string) (bool, error)
	Mark(ctx context.Context, id string) error
}

func HandleEvent(ctx context.Context, eventID string, store DedupeStore, fn func(context.Context) error) error {
	seen, err := store.Seen(ctx, eventID)
	if err != nil {
		return err
	}
	if seen {
		return nil
	}
	if err := fn(ctx); err != nil {
		return err
	}
	return store.Mark(ctx, eventID)
}
```

### 🟡 Retry with deadline budget check `[Mid]`

```go
package retry

import (
	"context"
	"time"
)

func CanRetry(ctx context.Context, minAttemptTime time.Duration) bool {
	dl, ok := ctx.Deadline()
	if !ok {
		return true
	}
	return time.Until(dl) > minAttemptTime
}
```

---

## Comparison Matrix / Bảng So Sánh Nhanh

| Pattern | Mục tiêu chính | Độ phức tạp | Rủi ro chính |
|---|---|---:|---|
| Saga | consistency business xuyên service | High | compensation lỗi |
| Circuit Breaker | chống cascade failure | Medium | tune threshold sai |
| CQRS | tối ưu read/write riêng | Medium-High | eventual consistency |
| Event Sourcing | audit + replay mạnh | High | schema evolution |
| Service Mesh | network policy/observability | High | ops overhead |
| Tracing | root cause latency/error | Medium | cost/cardinality |
| Idempotency | chống duplicate effect | Medium | key scope/TTL sai |
| Bulkhead | isolate failure domains | Medium | over-partition tài nguyên |
| Retry+Backoff | recover transient errors | Low-Medium | retry storm |

---

## Interview Mistakes / Lỗi Phỏng Vấn Thường Gặp

### 🟢 Q: Lỗi phổ biến mức Junior `[Junior]`

**A:**
- Trả lời định nghĩa pattern nhưng không nêu use-case.
- Không phân biệt lỗi retryable vs non-retryable.

### 🟡 Q: Lỗi phổ biến mức Mid `[Mid]`

**A:**
- Dùng quá nhiều pattern cùng lúc mà không justify.
- Không nói tradeoff vận hành/cost.
- Thiếu monitoring/alerting plan.

### 🔴 Q: Lỗi phổ biến mức Senior `[Senior]`

**A:**
- Over-engineering trước khi có scale evidence.
- Không đề cập migration strategy từ hệ thống hiện tại.
- Bỏ qua human operations: runbook, ownership, rollback.

---

## Deployment & Migration Q&A / Q&A Triển Khai và Chuyển Đổi

### 🟡 Q: Migrate sang circuit breaker an toàn thế nào? `[Mid]`

**A:**
1. Ship library disabled mode.
2. Enable metrics-only.
3. Enable enforce cho 1 endpoint nhỏ.
4. Mở rộng dần theo risk tier.

### 🔴 Q: Introduce CQRS vào monolith hiện tại `[Senior]`

**A:**
- Bắt đầu từ 1 bounded context read-heavy.
- Tạo read model side-by-side, không cắt ngay write path.
- So sánh correctness + latency trước khi cutover.

### 🔴 Q: Rollback strategy cho service mesh migration `[Senior]`

**A:**
- Canary namespace trước.
- Keep bypass path (direct service-to-service) trong emergency.
- Version pin control plane/data plane trước khi full rollout.

---

## Extra Interview Drill (10 More) / 10 Câu Luyện Thêm

### 🟢 Q11: Pattern nào giải quyết “double charge” trực tiếp nhất? `[Junior]`

**A:** Idempotency key + state transition guard cho payment operations.

### 🟢 Q12: Circuit breaker mở thì client nên thấy gì? `[Junior]`

**A:** Lỗi rõ ràng, nhanh (fail fast), kèm fallback message nếu có.

### 🟡 Q13: CQRS có cải thiện write throughput không luôn? `[Mid]`

**A:** Không luôn; lợi ích chính là tối ưu tách mô hình. Write throughput còn phụ thuộc storage/domain logic.

### 🟡 Q14: Snapshot event sourcing lưu ở đâu? `[Mid]`

**A:** Thường trong snapshot store cùng domain partition với event stream để load nhanh và dễ consistency.

### 🔴 Q15: Half-open cho phép bao nhiêu request là hợp lý? `[Senior]`

**A:** Tùy traffic và risk; thường rất nhỏ (1-10) để tránh bão request khi dependency vừa hồi phục.

### 🔴 Q16: Tại sao retry budget nên global, không chỉ per client? `[Senior]`

**A:** Vì sự cố thường hệ thống-wide; budget global giúp giới hạn tổng amplification load.

### 🟡 Q17: Service mesh có thay thế tracing SDK trong app được không? `[Mid]`

**A:** Mesh có thể tạo network spans nhưng business spans trong app vẫn cần SDK để có ngữ cảnh domain.

### 🔴 Q18: Idempotency dedupe store bị mất dữ liệu tạm thời thì sao? `[Senior]`

**A:** Rủi ro duplicate tăng; cần downstream guards (unique constraints, state machine, reconciliation).

### 🔴 Q19: Bulkhead nào quan trọng nhất trong checkout flow? `[Senior]`

**A:** Tách pool cho payment/ledger khỏi các dependency phụ (recommendation, analytics) để giữ core path sống.

### 🟡 Q20: Khi nào bỏ retry hoàn toàn ở synchronous API? `[Mid]`

**A:** Khi deadline quá ngắn, operation không idempotent, hoặc downstream trả lỗi business chắc chắn.

---

## Cross-Reference Deep Links / Liên Kết Lý Thuyết

- System design & reliability baseline: `shared/02-system-design/system-design-theory.md`
- Consensus and control-plane safety: `shared/02-system-design/consensus-algorithms.md`
- Networking failure model: `shared/01-cs-fundamentals/networking-theory.md`
- Microservice operational patterns: `be-track/02-backend-knowledge/02-microservices.md`
- Backend distributed practices: `be-track/02-backend-knowledge/03-distributed-systems.md`

---

## Final Rapid Revision Notes / Ghi Chú Ôn Nhanh Cuối

### 🟢 Junior rapid notes `[Junior]`

- Mỗi pattern trả lời theo 4 ý: what, when, when-not, tradeoff.
- Luôn nêu 1 ví dụ thực tế gần domain backend.

### 🟡 Mid rapid notes `[Mid]`

- Bổ sung observability và error budget trong câu trả lời.
- Tránh “pattern cargo cult”, luôn có điều kiện áp dụng rõ.

### 🔴 Senior rapid notes `[Senior]`

- Nói được migration path + rollback plan.
- Nói được failure mode và blast radius.
- Nói được cost vận hành chứ không chỉ kỹ thuật.


## Pattern Decision Playbook / Sổ Tay Chọn Pattern

### 🟡 Q: Nếu interviewer cho một bài order platform, chọn pattern nào trước? `[Mid]`

**A:**
- Bước 1: phân loại failure modes chính.
- Bước 2: map pattern theo rủi ro lớn nhất.

Gợi ý nhanh:
1. Duplicate requests -> Idempotency.
2. Downstream flaky -> Retry + Circuit Breaker.
3. Blast radius lớn -> Bulkhead.
4. Cross-service transaction -> Saga.
5. Read-heavy dashboard -> CQRS.
6. Audit/replay requirements mạnh -> Event Sourcing.

### 🔴 Q: Pattern sequencing strategy trong roadmap kỹ thuật `[Senior]`

**A:**
- Không rollout tất cả cùng lúc.
- Thứ tự gợi ý:
  1) Observability (tracing + metrics) trước để đo baseline.
  2) Timeout/retry/circuit breaker.
  3) Idempotency ở core write APIs.
  4) Bulkhead cho critical path.
  5) Saga/CQRS/Event Sourcing khi domain chứng minh cần.

---

## Anti-Patterns Catalog / Danh Mục Phản Mẫu

### 🟢 Q: “Retry forever” sai ở đâu? `[Junior]`

**A:**
- Có thể gây vô hạn load amplification.
- Không tôn trọng deadline user request.
- Tăng nguy cơ outage kéo dài.

### 🟡 Q: “Everything is event-driven” có vấn đề gì? `[Mid]`

**A:**
- Eventual consistency lan tràn khiến debug khó.
- Team thiếu tooling sẽ khó xác định source of truth.
- Một số luồng cần sync response vẫn phải synchronous.

### 🔴 Q: “One global thread pool” nguy hiểm ra sao? `[Senior]`

**A:**
- Dependency chậm có thể chiếm hết worker.
- Critical path bị starvation.
- Cần bulkhead theo dependency/priority.

### 🔴 Q: “Circuit breaker mở là xong” có đủ chưa? `[Senior]`

**A:**
- Chưa đủ; cần fallback strategy, alerting, runbook, và kiểm soát khi đóng lại (half-open tuning).

---

## SLO-Centric Design Q&A / Thiết Kế Theo SLO

### 🟡 Q: Mapping pattern theo SLO objectives `[Mid]`

**A:**
| SLO concern | Pattern hữu ích | Ghi chú |
|---|---|---|
| Availability | Circuit Breaker, Bulkhead | giới hạn cascade failures |
| Latency p99 | Retry budget + timeout + tracing | kiểm soát tail latency |
| Correctness | Idempotency, Saga, CQRS guard | tránh duplicate/inconsistent states |
| Recoverability | Event Sourcing, DLQ, replay | tăng khả năng phục hồi |

### 🔴 Q: Error budget policy ảnh hưởng retry thế nào? `[Senior]`

**A:**
- Khi error budget cạn nhanh, phải giảm retry aggressiveness.
- Retry policy dynamic theo incident mode:
  - normal: retry 2-3 lần.
  - degraded: retry 1 lần hoặc tắt cho non-critical.

### 🔴 Q: Latency budget decomposition ví dụ `[Senior]`

**A:**
```text
Checkout API target p95 = 300ms
- Gateway + auth: 40ms
- Order validation: 50ms
- Payment call: 140ms
- DB write: 40ms
- Buffer/serialization: 30ms

=> Retry/payment timeout phải nằm trong 140ms budget này.
```

---

## Runbook-Oriented Questions / Câu Hỏi Theo Góc Vận Hành

### 🟡 Q: Circuit breaker alert runbook nên có gì? `[Mid]`

**A:**
- Metric trigger rõ ràng (open rate, error rate).
- Dependency impacted list.
- Fallback mode đang active.
- Decision tree: giữ open / thử half-open / rollback release.

### 🔴 Q: Saga stuck ở step giữa, xử lý sao? `[Senior]`

**A:**
1. Tìm saga instances timeout > threshold.
2. Kiểm tra step status và external correlation IDs.
3. Decide continue/retry/compensate dựa domain invariants.
4. Record operator action vào audit log.

### 🟡 Q: CQRS projector behind 30 phút, ưu tiên gì? `[Mid]`

**A:**
- Scale consumers.
- Drop low-priority projections tạm thời.
- Verify poisoned messages causing retry loops.
- Nếu cần, serve stale-but-marked data cho UI.

### 🔴 Q: Event replay runbook cần bước nào để an toàn? `[Senior]`

**A:**
- Dry-run replay vào sandbox projection.
- Validate checksums/count totals.
- Thực hiện replay theo shard/tenant rollout.
- Monitor lag + error before widening scope.

---

## Pattern-by-Pattern “When NOT to Use” Deep Table

### 🔴 Q: Tổng hợp nhanh khi KHÔNG dùng pattern `[Senior]`

**A:**

| Pattern | Khi không nên dùng |
|---|---|
| Saga | cần strict ACID global, compensation bất khả thi |
| Circuit Breaker | call local function, volume quá thấp để tune |
| CQRS | CRUD app nhỏ, team nhỏ, yêu cầu đơn giản |
| Event Sourcing | không cần audit/replay, retention constraints nghiêm |
| Service Mesh | footprint nhỏ, ops chưa đủ năng lực |
| Distributed Tracing | traffic thấp, có thể debug đơn giản bằng logs |
| Idempotency | operation read-only hoặc inherently idempotent rồi |
| Bulkhead | service siêu nhỏ, 1 dependency duy nhất ổn định |
| Retry+Backoff | lỗi 4xx business, non-idempotent side effects |

---

## Interview Simulation Scripts / Kịch Bản Mô Phỏng Phỏng Vấn

### 🟡 Q: 2-minute answer for “What is Circuit Breaker?” `[Mid]`

**A (script):**
“Circuit breaker là cơ chế bảo vệ service trước dependency lỗi bằng cách chuyển state closed/open/half-open. Closed cho phép call bình thường. Khi lỗi vượt ngưỡng, breaker mở để fail fast thay vì tiếp tục timeout hàng loạt. Sau khoảng cool-down, breaker vào half-open cho một vài request kiểm tra hồi phục. Nếu thành công thì đóng lại, nếu fail thì mở lại. Pattern này giảm cascade failures và bảo vệ latency/SLO của hệ thống.”

### 🟡 Q: 2-minute answer for “Why CQRS?” `[Mid]`

**A (script):**
“CQRS tách đường command và query vì hai bài toán tối ưu khác nhau. Write side tập trung business invariants và consistency; read side tối ưu latency và shape dữ liệu cho UI, thường bằng denormalized projections. CQRS phù hợp khi read-heavy hoặc query phức tạp, nhưng đánh đổi bằng eventual consistency và tăng complexity vận hành.”

### 🔴 Q: 3-minute answer for “Saga vs 2PC” `[Senior]`

**A (script):**
“2PC cho atomicity mạnh nhưng lock resources lâu, không phù hợp microservices scale lớn hoặc dependency không đồng nhất. Saga chia thành local transactions và compensation, scale tốt hơn và ít coupling hạ tầng, nhưng consistency thường eventual và đòi hỏi thiết kế compensation cẩn thận. Chọn 2PC khi domain bắt buộc strong consistency và participant hỗ trợ; chọn Saga khi ưu tiên availability, autonomy, và chấp nhận eventual consistency có kiểm soát.”

---

## Domain Mapping / Ánh Xạ Pattern Theo Miền Backend

### 🟡 Q: E-commerce domain mapping `[Mid]`

**A:**
- Checkout: Idempotency + Retry budget + Circuit breaker.
- Order workflow: Saga orchestration.
- Product catalog read-heavy: CQRS read model.
- Recommendation dependency: Bulkhead + fallback.
- Fraud analytics: Event sourcing/stream projections (nếu cần audit sâu).

### 🟡 Q: Fintech domain mapping `[Mid]`

**A:**
- Ledger correctness: strong write invariants + idempotency.
- Payment routing: circuit breaker + failover policy.
- Compliance audit: event logs, immutable trails.
- Reconciliation: replayable event pipelines.

### 🟡 Q: Ride-hailing domain mapping `[Mid]`

**A:**
- Dispatch critical path: bulkhead + timeout discipline.
- Matching services: tracing để bắt latency spikes.
- Payment finalization: idempotency + saga cho multi-step trip close.

---

## Monitoring Checklist Per Pattern

### 🟢 Q: Quick metrics starter list `[Junior]`

**A:**
- Circuit breaker: open transitions, open duration.
- Retry: retry count, success-after-retry rate.
- Bulkhead: queue depth, saturation %.
- Saga: active sagas, timeout count, compensation count.
- CQRS: projection lag.
- Tracing: trace error ratio, top slow spans.

### 🔴 Q: Advanced metrics with thresholds `[Senior]`

**A:**

| Pattern | Metric | Threshold example |
|---|---|---|
| Circuit breaker | open_rate_5m | > 3% triggers incident |
| Retry | retry_amplification | > 1.2x baseline alert |
| Saga | compensation_ratio | > 5% suspicious |
| CQRS | projection_lag_p95 | > 60s degraded mode |
| Bulkhead | pool_saturation | > 85% for 10m |
| Idempotency | duplicate_hit_rate | sudden drop indicates dedupe issue |

---

## Additional Go Utilities / Tiện Ích Go Bổ Sung

### 🟡 Q: Minimal bulkhead executor `[Mid]`

```go
package bulkhead

import "context"

type Executor struct {
	sem chan struct{}
}

func New(size int) *Executor {
	return &Executor{sem: make(chan struct{}, size)}
}

func (e *Executor) Do(ctx context.Context, fn func(context.Context) error) error {
	select {
	case e.sem <- struct{}{}:
		defer func() { <-e.sem }()
		return fn(ctx)
	case <-ctx.Done():
		return ctx.Err()
	}
}
```

### 🟡 Q: Simple breaker middleware shape `[Mid]`

```go
package middleware

import "context"

type Breaker interface {
	Allow() bool
	OnResult(error)
}

func WithBreaker(next func(context.Context) error, b Breaker) func(context.Context) error {
	return func(ctx context.Context) error {
		if !b.Allow() {
			return ErrCircuitOpen
		}
		err := next(ctx)
		b.OnResult(err)
		return err
	}
}

var ErrCircuitOpen = errString("circuit open")

type errString string
func (e errString) Error() string { return string(e) }
```

---

## Final Interview Rapid-Fire (8)

### 🟢 Q21: Pattern nào giảm cascade failure trực tiếp nhất? `[Junior]`

**A:** Circuit breaker + bulkhead là cặp trực tiếp nhất.

### 🟢 Q22: Retry nên áp dụng cho lỗi 400 validation không? `[Junior]`

**A:** Không, vì lỗi business deterministic, retry không có lợi.

### 🟡 Q23: Vì sao tracing cần context propagation chuẩn? `[Mid]`

**A:** Nếu mất context, trace bị đứt đoạn, không còn khả năng root-cause xuyên service.

### 🟡 Q24: CQRS có bắt buộc database tách riêng không? `[Mid]`

**A:** Không bắt buộc ở giai đoạn đầu; có thể tách logic trước, tách physical DB sau.

### 🔴 Q25: Saga compensation fail thì làm gì? `[Senior]`

**A:** Mark trạng thái cần manual intervention, retry có kiểm soát, audit đầy đủ và có runbook cho operator.

### 🔴 Q26: Làm sao hạn chế retry storm khi outage lớn? `[Senior]`

**A:** Retry budget, jitter, global throttling, breaker open, và ưu tiên fail-fast cho non-critical paths.

### 🔴 Q27: Event sourcing có phù hợp notification analytics không? `[Senior]`

**A:** Có thể phù hợp nếu cần replay và audit sâu; nếu chỉ dashboard cơ bản thì append-only log + warehouse thường đủ.

### 🔴 Q28: Service mesh có ảnh hưởng chi phí thế nào? `[Senior]`

**A:** Tăng CPU/memory mỗi pod và ops cost control plane; cần cân bằng lợi ích bảo mật/observability với ngân sách.

---

## Closing Summary / Tổng Kết

- Mỗi pattern là công cụ, không phải mục tiêu.
- Trả lời phỏng vấn mạnh nhất khi bạn:
  1) nêu rõ context,
  2) chỉ ra tradeoffs,
  3) gắn với SLO/failure mode,
  4) có plan rollout + observability.

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: Explain the CAP theorem. Can a distributed system ever be both consistent and available? / Giải thích CAP theorem. Hệ thống phân tán có thể vừa consistent vừa available không? 🟡 Mid

**A:** The CAP theorem states that a distributed system under a network partition (P) can guarantee either Consistency (every read sees the most recent write) or Availability (every request gets a non-error response), but not both simultaneously. In practice, network partitions are unavoidable, so the real choice is CP vs AP. CP systems (HBase, ZooKeeper, etcd) reject or block requests when partitioned to preserve consistency. AP systems (Cassandra, CouchDB, DynamoDB) return potentially stale data to remain available. Note: PACELC extends CAP by also considering latency vs consistency trade-offs even without partitions.

Vietnamese explanation: CAP thường bị hiểu sai là "chọn 2 trong 3." Thực tế, P (Partition tolerance) không phải là lựa chọn — mạng luôn có thể bị phân vùng, bạn phải chấp nhận P. Vậy chỉ còn chọn C hoặc A khi partition xảy ra. Cassandra chọn AP: vẫn accept write ở cả hai side của partition, sau đó reconcile khi mạng phục hồi (eventual consistency). ZooKeeper chọn CP: không serve request nếu không có quorum. PACELC quan trọng hơn trong thực tế vì nó mô tả trade-off ngay cả khi không có partition.

---

### Q: How does the Circuit Breaker pattern work and how does it differ from a retry strategy? / Circuit Breaker hoạt động thế nào và khác gì retry strategy? 🟡 Mid

**A:** A Circuit Breaker wraps calls to a downstream service and tracks failure rate. It has three states: **Closed** (normal, calls pass through), **Open** (failure threshold exceeded, calls fail immediately without attempting), **Half-Open** (after a timeout, allows a probe request — if it succeeds, transition to Closed; if it fails, back to Open). Unlike pure retry which keeps hammering a failing service (causing cascading failures and overload), Circuit Breaker gives the downstream time to recover and prevents resource exhaustion in the caller.

```text
Closed → [failures > threshold] → Open → [timeout elapsed] → Half-Open
Half-Open → [probe succeeds] → Closed
Half-Open → [probe fails]    → Open
```

Vietnamese explanation: Retry đơn giản là thử lại — hữu ích với transient errors (network blip). Circuit Breaker là lớp bảo vệ cao hơn: khi downstream service đã rõ ràng là down, tiếp tục retry chỉ làm trầm trọng thêm (thread pool cạn kiệt, latency tăng cho user). Circuit Breaker trả lời nhanh với fallback (cached data, default response) thay vì đợi timeout. Trong Go, thư viện `sony/gobreaker` phổ biến. Nên kết hợp cả hai: Circuit Breaker bao bên ngoài retry để không retry khi breaker đang Open.

---

### Q: What is a service mesh and what problems does it solve that cannot be solved at the application layer? / Service mesh là gì và giải quyết vấn đề gì mà application layer không làm được? 🔴 Senior

**A:** A service mesh (e.g., Istio, Linkerd) is an infrastructure layer that intercepts all network traffic between services via sidecar proxies (e.g., Envoy). It provides: mutual TLS (mTLS) for service-to-service auth without code changes, observability (distributed tracing, metrics, access logs) automatically, traffic management (canary deployments, retries, timeouts, circuit breaking) declaratively via control plane config. The key distinction: these concerns are handled uniformly at the infrastructure level regardless of programming language or framework, eliminating the need for each team to implement their own resilience library.

Vietnamese explanation: Application layer có thể implement retry, circuit breaker, TLS — nhưng mỗi team làm mỗi cách khác nhau, mỗi ngôn ngữ một library. Service mesh đồng nhất hóa toàn bộ: bạn configure retry policy một lần trong YAML, áp dụng cho mọi service bất kể Go, Java, hay Python. mTLS được bật tự động — không cần developer nhớ configure certificate. Đây là lý do tại sao large-scale microservices (>50 services) thường adopt service mesh. Nhược điểm: thêm latency ~1-3ms per hop, tăng resource usage (sidecar mỗi pod), và ops complexity của control plane.

---

### Q: Explain the Raft consensus algorithm at a high level. Why is it preferred over Paxos in modern systems? / Giải thích Raft consensus algorithm ở mức cao. Tại sao nó được ưa dùng hơn Paxos? 🔴 Senior

**A:** Raft divides consensus into three sub-problems: **Leader Election** (nodes vote for a leader; leader has the most up-to-date log), **Log Replication** (leader appends entries to its log, replicates to followers; commit when majority acknowledges), **Safety** (only nodes with the most complete log can become leader). Key properties: one leader at a time (strong consistency), entries only flow leader→follower (no complex multi-master scenarios), explicit term numbers prevent stale leaders from causing splits. Raft is preferred over Paxos because it is designed for understandability — it decomposes the problem into clearly defined roles and phases, making correct implementation significantly easier.

Vietnamese explanation: Paxos được Lamport chứng minh là đúng nhưng cực kỳ khó implement đúng — đến mức Google Chubby và nhiều hệ thống phải dùng "Multi-Paxos" (biến thể chưa được formal proof đầy đủ). Raft ra đời với mục tiêu rõ ràng: understandable. etcd (dùng trong Kubernetes), CockroachDB, TiKV đều implement Raft. Trong phỏng vấn, điểm quan trọng: Raft đảm bảo tối đa một leader mỗi term, commit chỉ khi majority nodes acknowledge — đây là nền tảng của CP systems. Raft không giải quyết Byzantine failures (node gửi dữ liệu sai); cho Byzantine, cần PBFT hoặc BFT-based protocols.

---

### Q: What is the Saga pattern's approach to handling partial failures in distributed transactions? / Saga pattern xử lý partial failure trong distributed transaction thế nào? 🟡 Mid

**A:** The Saga pattern replaces a distributed ACID transaction with a sequence of local transactions, each publishing an event or message to trigger the next step. If a step fails, the saga executes **compensating transactions** in reverse order to undo the work done by previous steps. Compensating transactions must be idempotent (safe to execute multiple times) and semantically undo the business effect — they cannot always be a true rollback (e.g., a sent email cannot be unsent; instead, a "cancellation email" is the compensation). Two coordination approaches: Choreography (event-driven, decentralized) and Orchestration (central coordinator, explicit state machine).

Vietnamese explanation: Saga chấp nhận eventual consistency thay vì ACID atomicity. Ví dụ đặt tour du lịch: Book Flight → Book Hotel → Book Car. Nếu Book Car fail, compensation là Cancel Hotel → Cancel Flight. Thách thức chính: compensation không phải lúc nào cũng "sạch" (irreversible effects như charge thẻ, gửi email). Đây là lý do tại sao business logic phải thiết kế "compensatable actions" từ đầu. Trong phỏng vấn, đề cập đến idempotency của compensation (dùng idempotency key), visibility vào saga state (orchestration dễ debug hơn choreography), và cách handle compensation cũng fail (dead letter queue + manual intervention).

