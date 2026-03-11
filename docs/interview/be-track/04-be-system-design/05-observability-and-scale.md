# Observability and Scale for Go Backend Interviews — Quan sát hệ thống và mở rộng quy mô
> Backend Track — System Design
> Cross-referenced by: `01-design-framework.md`, `02-classic-problems.md`, `04-distributed-patterns.md`, `../02-backend-knowledge/02-microservices.md`, `../02-backend-knowledge/03-distributed-systems.md`, `../02-backend-knowledge/06-networking-go.md`, `../06-devops-infrastructure.md`, `../01-golang/05-testing-profiling.md`, `../../shared/02-system-design/system-design-theory.md`, `../../shared/02-system-design/replication-partitioning.md`, `../../shared/01-cs-fundamentals/networking-theory.md`
---
## 0) Study Orientation
### 🟢 [Junior] Q: What should I focus on first for observability + scale interviews?
**A:**
Bạn nên bắt đầu với một flow rất thực dụng:
```text
Objective -> SLI/SLO -> Instrumentation -> Alerting -> Load test -> Incident learning
```
Ý nghĩa:
- **Objective:** dịch vụ nào critical (checkout, payment, login).
- **SLI/SLO:** đo và đặt mục tiêu rõ ràng.
- **Instrumentation:** metrics + logs + traces.
- **Alerting:** page đúng người, đúng thời điểm.
- **Load test:** kiểm chứng capacity trước traffic thật.
- **Incident learning:** postmortem để không lặp lỗi.
### 🟢 [Junior] Q: Why do observability and scaling always come together?
**A:**
Scale mà không observability giống lái xe tốc độ cao trong sương mù. Bạn có thể “chạy được” ở traffic thấp, nhưng khi tăng tải sẽ xuất hiện lỗi tail latency, queue backlog, retry storm, dependency meltdown. Observability giúp thấy vấn đề sớm và ưu tiên đúng nơi cần tối ưu.
---
## 1) Three Pillars of Observability
### 🟢 [Junior] Q: What are the three pillars of observability?
**A:**
Ba trụ cột là:
1. **Metrics** — dữ liệu số theo thời gian để giám sát xu hướng.
2. **Logs** — sự kiện chi tiết để giải thích “điều gì đã xảy ra”.
3. **Traces** — hành trình end-to-end của một request qua nhiều service.
### 🟢 [Junior] Q: What question does each pillar answer?
**A:**
- Metrics trả lời: **“Có vấn đề không?”**
- Traces trả lời: **“Vấn đề ở hop nào?”**
- Logs trả lời: **“Lỗi chính xác là gì?”**
### 🟡 [Mid] Q: How do metrics, logs, and traces complement each other in production?
**A:**
Quy trình triage rất phổ biến:
1. Dashboard báo P99 tăng.
2. Trace chỉ ra payment span chậm.
3. Log trong payment service cho thấy timeout tới external gateway.
```text
Alert (P99 up)
   -> Trace explorer (which hop is slow)
      -> Log search (why exactly slow)
```
### 🟡 [Mid] Q: What is a practical minimum observability stack for a startup team?
**A:**
Tối thiểu nên có:
- Prometheus + Grafana cho metrics.
- Structured logs (JSON) + Loki/ELK cho logs.
- OpenTelemetry + Tempo/Jaeger cho tracing.
Nếu chưa đủ nguồn lực, ưu tiên theo thứ tự:
1. Metrics RED + basic alerts.
2. Structured logs + trace_id.
3. Tracing cho critical path.
### 🔴 [Senior] Q: What are signs of immature observability?
**A:**
- Chỉ có log text, không có schema chuẩn.
- Không correlation ID giữa logs và traces.
- Metrics label cardinality quá cao (gắn user_id).
- Alert dựa vào CPU/memory đơn thuần, không bám SLO.
- Không có runbook, on-call nhận page nhưng không biết thao tác tiếp theo.
### 🔴 [Senior] Q: Can observability be “over-engineered”?
**A:**
Có. Over-instrumentation gây:
- Chi phí lưu trữ quá lớn.
- Dashboard nhiễu, khó đọc.
- Tracing sample 100% làm collector bottleneck.
Mục tiêu đúng là **actionable telemetry**, không phải thu thập tất cả mọi thứ.
### 🟡 [Mid] Q: Show a simple architecture diagram for the three pillars.
**A:**
```text
                    +----------------------+
                    |     Alertmanager     |
                    +----------+-----------+
                               |
                               v
 +---------+  /metrics   +------------+   query   +---------+
 | Service | -----------> | Prometheus | --------> | Grafana |
 +---------+              +------------+           +---------+
      | /logs                  |
      v                        |
 +-------------+               |
 | Fluent Bit  | ------------> +-----------> Loki / ELK
 +-------------+
      | spans (OTLP)
      v
 +-------------+        +-------------+        +--------+
 | OTel SDK    | -----> | OTel Collect| -----> | Tempo  |
 +-------------+        +-------------+        +--------+
```
---
## 2) Metrics: RED, USE, Golden Signals, Prometheus, Go pprof
### 🟢 [Junior] Q: What is the RED method?
**A:**
RED thường dùng cho service/API:
- **Rate**: số request/giây.
- **Errors**: tỷ lệ request lỗi.
- **Duration**: độ trễ request.
### 🟢 [Junior] Q: What is the USE method?
**A:**
USE thường dùng cho tài nguyên hạ tầng:
- **Utilization**: mức sử dụng.
- **Saturation**: mức chờ/queue.
- **Errors**: lỗi tài nguyên.
Ví dụ DB pool:
- Utilization: active connections / max.
- Saturation: số request chờ connection.
- Errors: connection timeout/reset.
### 🟢 [Junior] Q: What are the golden signals?
**A:**
4 golden signals:
1. Latency
2. Traffic
3. Errors
4. Saturation
### 🟡 [Mid] Q: RED vs USE vs Golden Signals — how should I combine them?
**A:**
- Dùng **RED** cho từng endpoint/service.
- Dùng **USE** cho từng resource quan trọng (CPU, DB, queue, pool).
- Dùng **Golden signals** làm dashboard tổng quan hệ thống.
Không nên chọn một và bỏ hai cái còn lại.
### 🟡 [Mid] Q: What does Prometheus exposition format look like?
**A:**
```text
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="POST",route="/checkout",status="200"} 12345
http_requests_total{method="POST",route="/checkout",status="500"} 123
# HELP http_request_duration_seconds HTTP latency histogram
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{route="/checkout",le="0.05"} 100
http_request_duration_seconds_bucket{route="/checkout",le="0.1"} 260
http_request_duration_seconds_bucket{route="/checkout",le="0.2"} 400
http_request_duration_seconds_bucket{route="/checkout",le="0.5"} 500
http_request_duration_seconds_bucket{route="/checkout",le="+Inf"} 520
http_request_duration_seconds_sum{route="/checkout"} 71.3
http_request_duration_seconds_count{route="/checkout"} 520
```
### 🟡 [Mid] Q: Show Go code to instrument RED metrics.
**A:**
```go
package metrics
import (
	"net/http"
	"strconv"
	"time"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)
var (
	requestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total HTTP requests",
		},
		[]string{"method", "route", "status"},
	)
	requestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "HTTP request latency",
			Buckets: []float64{0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2},
		},
		[]string{"route"},
	)
)
type statusWriter struct {
	http.ResponseWriter
	status int
}
func (w *statusWriter) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}
func MetricsHandler() http.Handler { return promhttp.Handler() }
func Instrument(route string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		sw := &statusWriter{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(sw, r)
		requestsTotal.WithLabelValues(r.Method, route, strconv.Itoa(sw.status)).Inc()
		requestDuration.WithLabelValues(route).Observe(time.Since(start).Seconds())
	})
}
```
### 🟡 [Mid] Q: What labels should we avoid for Prometheus metrics?
**A:**
Tránh label cardinality cao như:
- `user_id`
- `email`
- `session_id`
- `trace_id`
- raw path có id động
Nên dùng route đã normalize (`/users/:id/orders/:id`) thay vì path raw.
### 🔴 [Senior] Q: How do you choose histogram buckets for latency SLO?
**A:**
Nếu SLO là P95 < 300ms, nên đặt bucket dày quanh vùng 50–300ms:
```text
[0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 1, 2, 5]
```
Nguyên tắc:
- Bucket dày ở vùng SLO target.
- Bucket thưa dần ở tail.
- Naming theo giây (`*_seconds`).
### 🔴 [Senior] Q: Which PromQL snippets are interview-friendly and practical?
**A:**
```promql
# Error rate (5m)
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))
# P95 latency by route
histogram_quantile(
  0.95,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route)
)
# Queue depth signal
max(queue_depth{queue="checkout"})
```
### 🟡 [Mid] Q: What is Go pprof and when should we use it?
**A:**
`pprof` dùng để profile CPU, heap, goroutine, mutex/blocking. Dùng khi cần tìm nguyên nhân performance issue, memory leak, lock contention.
### 🟡 [Mid] Q: Go pprof setup example?
**A:**
```go
package main
import (
	"log"
	"net/http"
	_ "net/http/pprof"
)
func main() {
	go func() {
		// Admin/internal only
		if err := http.ListenAndServe("127.0.0.1:6060", nil); err != nil {
			log.Printf("pprof error: %v", err)
		}
	}()
	select {}
}
```
Lệnh thường dùng:
```bash
go tool pprof -http=:8081 http://127.0.0.1:6060/debug/pprof/profile?seconds=30
go tool pprof -http=:8082 http://127.0.0.1:6060/debug/pprof/heap
```
### 🔴 [Senior] Q: How do you connect metrics with pprof for root cause analysis?
**A:**
Flow điển hình:
1. Metrics cho thấy latency tăng.
2. Xem CPU/memory/saturation để khoanh vùng.
3. Chạy pprof trong cùng time window.
4. Xác định hot function / contention point.
5. Fix + verify bằng load test và SLO dashboards.
```text
Metrics anomaly -> Profile capture -> Flame graph -> Code fix -> Regression check
```
---
## 3) Distributed Tracing: OpenTelemetry, Context Propagation, Span Types, Sampling
### 🟢 [Junior] Q: What is distributed tracing in one sentence?
**A:**
Distributed tracing là kỹ thuật theo dõi một request xuyên qua nhiều service bằng trace ID và nhiều span liên kết.
### 🟢 [Junior] Q: What are trace ID and span ID?
**A:**
- **Trace ID:** định danh toàn bộ hành trình request.
- **Span ID:** định danh một bước cụ thể trong trace.
### 🟡 [Mid] Q: How does trace context propagation work over HTTP?
**A:**
Chuẩn W3C dùng header:
- `traceparent`
- `tracestate`
Service nhận request sẽ tiếp tục context hiện tại, tạo span mới, và truyền context này sang downstream service.
```text
Client -> Gateway -> Service A -> Service B
   (same trace_id, different span_id per hop)
```
### 🟡 [Mid] Q: Show OpenTelemetry Go example for HTTP server/client spans.
**A:**
```go
package tracing
import (
	"context"
	"net/http"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/trace"
)
var tr = otel.Tracer("order-service")
func Handler() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/orders", otelhttp.NewHandler(http.HandlerFunc(createOrder), "create-order"))
	return mux
}
func createOrder(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	ctx, span := tr.Start(ctx, "validate-order", trace.WithSpanKind(trace.SpanKindInternal))
	defer span.End()
	span.SetAttributes(attribute.String("feature", "checkout"))
	if err := callInventory(ctx); err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, "inventory failed")
		http.Error(w, "inventory fail", http.StatusBadGateway)
		return
	}
	w.WriteHeader(http.StatusCreated)
}
func callInventory(ctx context.Context) error {
	_, span := tr.Start(ctx, "inventory-client", trace.WithSpanKind(trace.SpanKindClient))
	defer span.End()
	return nil
}
```
### 🟡 [Mid] Q: What span kinds should I mention in interviews?
**A:**
- `SERVER`
- `CLIENT`
- `INTERNAL`
- `PRODUCER`
- `CONSUMER`
Nói đúng span kind giúp trace topology dễ hiểu hơn.
### 🔴 [Senior] Q: How do you propagate trace context across async queues?
**A:**
Với queue, context không đi qua HTTP headers. Bạn phải inject/extract context qua message headers/properties.
```text
Producer:
  span(PRODUCER)
  inject trace headers into message metadata
  publish
Consumer:
  extract trace headers
  start CONSUMER span
  process and emit child spans
```
Go sketch:
```go
package mqtrace
import (
	"context"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/propagation"
)
type Message struct {
	Body    []byte
	Headers map[string]string
}
func Inject(ctx context.Context, msg *Message) {
	carrier := propagation.MapCarrier(msg.Headers)
	otel.GetTextMapPropagator().Inject(ctx, carrier)
}
func Extract(msg Message) context.Context {
	carrier := propagation.MapCarrier(msg.Headers)
	return otel.GetTextMapPropagator().Extract(context.Background(), carrier)
}
```
### 🔴 [Senior] Q: Parent-child vs span links in event-driven systems?
**A:**
- **Parent-child:** phù hợp khi quan hệ xử lý trực tiếp, đồng bộ hoặc async đơn giản.
- **Span links:** phù hợp fan-out, batch processing, hoặc khi một consumer xử lý từ nhiều nguồn event.
Trong hệ thống event lớn, span links thường phản ánh quan hệ thật hơn.
### 🔴 [Senior] Q: Sampling strategies and tradeoffs?
**A:**
Các kiểu sampling:
- **Head sampling:** quyết định lúc bắt đầu trace; rẻ nhưng có thể bỏ lỡ trace lỗi hiếm.
- **Tail sampling:** quyết định sau khi thu đủ span; giữ được trace lỗi/tail tốt hơn nhưng tốn collector resources.
- **Rule-based:** luôn giữ error traces và latency outliers.
Chiến lược thực tế:
```text
Baseline head sampling 1-5%
+ always sample errors
+ always sample high-latency routes
+ temporarily increase during incident
```
### 🔴 [Senior] Q: What common tracing pitfalls should we call out?
**A:**
- Không propagate context qua queue -> trace đứt.
- Gắn PII vào span attributes.
- Mỗi function đều tạo span -> noisy, tốn chi phí.
- Không đồng bộ semantic conventions giữa team/service.
---
## 4) Structured Logging: Levels, JSON Logs in Go, Aggregation (ELK/Loki)
### 🟢 [Junior] Q: Why is structured logging important?
**A:**
Structured log cho phép filter/query hiệu quả theo field (`trace_id`, `service`, `error_code`) thay vì parse text thủ công.
### 🟢 [Junior] Q: What log levels should backend teams use?
**A:**
- `DEBUG`: chi tiết kỹ thuật (thường tắt ở production).
- `INFO`: trạng thái bình thường.
- `WARN`: cảnh báo cần theo dõi.
- `ERROR`: lỗi ảnh hưởng request/job.
- `FATAL`: lỗi nghiêm trọng khiến process không thể tiếp tục.
### 🟡 [Mid] Q: Show Go `slog` JSON logging example.
**A:**
```go
package logx
import (
	"log/slog"
	"os"
)
func NewLogger() *slog.Logger {
	h := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})
	return slog.New(h).With("service", "checkout", "env", "prod")
}
func Example(logger *slog.Logger, traceID, reqID string, err error) {
	logger.Info("request start",
		"trace_id", traceID,
		"request_id", reqID,
		"route", "/checkout",
	)
	if err != nil {
		logger.Error("checkout failed",
			"trace_id", traceID,
			"request_id", reqID,
			"error", err.Error(),
		)
	}
}
```
### 🟡 [Mid] Q: Show Go `zerolog` example.
**A:**
```go
package logx
import (
	"os"
	"time"
	"github.com/rs/zerolog"
)
func NewZero() zerolog.Logger {
	zerolog.TimeFieldFormat = time.RFC3339Nano
	return zerolog.New(os.Stdout).
		With().
		Timestamp().
		Str("service", "payment").
		Logger()
}
```
### 🟡 [Mid] Q: Which fields should exist in almost every production log?
**A:**
Field khuyến nghị:
- `timestamp`
- `level`
- `service`
- `env`
- `trace_id`
- `span_id` (nếu có)
- `request_id`
- `message`
- `error_code` / `error`
### 🔴 [Senior] Q: Explain ELK vs Loki tradeoffs.
**A:**
- **ELK**: mạnh về full-text search, ecosystem lớn; đổi lại chi phí index/storage cao.
- **Loki**: index theo labels nên tiết kiệm hơn cho volume lớn; cần kỷ luật label để query hiệu quả.
### 🔴 [Senior] Q: Show a typical log aggregation pipeline.
**A:**
```text
App stdout (JSON)
   -> Node Agent (Fluent Bit/Vector)
      -> parse + enrich k8s metadata + redact sensitive fields
         -> Loki/ELK
            -> Grafana/Kibana dashboards
               -> alert/rule-based detection
```
### 🔴 [Senior] Q: How to control logging cost at scale?
**A:**
- Sampling INFO logs.
- Giảm verbosity theo route ít quan trọng.
- Retention theo tier: hot/warm/cold.
- Drop noisy logs không actionable.
- Tránh log payload lớn và dữ liệu nhạy cảm.
### 🔴 [Senior] Q: What are compliance concerns in logging?
**A:**
- Không log secrets/tokens/mật khẩu.
- Mask hoặc tokenize PII.
- Có policy retention/delete phù hợp quy định.
- Tách audit log khỏi application logs khi cần forensic.
---
## 5) Alerting: SLI/SLO/SLA, Error Budgets, Alert Fatigue Prevention, Runbooks
### 🟢 [Junior] Q: What are SLI, SLO, and SLA?
**A:**
- **SLI (Indicator):** chỉ số đo chất lượng dịch vụ.
- **SLO (Objective):** mục tiêu nội bộ cho SLI.
- **SLA (Agreement):** cam kết với khách hàng (thường có điều khoản tài chính).
Ví dụ:
```text
SLI: checkout success ratio
SLO: >= 99.9% monthly
SLA: >= 99.5% monthly contract
```
### 🟡 [Mid] Q: What is an error budget?
**A:**
Error budget là phần lỗi cho phép theo SLO.
Ví dụ SLO 99.9% trong 30 ngày:
- Budget downtime khoảng 43.2 phút/tháng.
Nếu burn budget quá nhanh, team nên ưu tiên reliability thay vì ra feature mới.
### 🟡 [Mid] Q: Why does alert fatigue happen?
**A:**
- Quá nhiều cảnh báo không actionable.
- Không phân tầng severity rõ.
- Không dedup/inhibit.
- Alert gửi sai owner/team.
Kết quả là on-call mất niềm tin vào hệ thống cảnh báo.
### 🟡 [Mid] Q: What is runbook-driven alerting?
**A:**
Mỗi alert nên đính kèm runbook có:
1. Ý nghĩa alert.
2. Kiểm tra nhanh để xác nhận.
3. Bước mitigation ưu tiên.
4. Điều kiện escalate.
### 🔴 [Senior] Q: What is multi-window multi-burn-rate alerting?
**A:**
Kỹ thuật này kết hợp cửa sổ ngắn và dài để phát hiện cả sự cố bùng phát nhanh và sự cố âm ỉ.
Ví dụ:
- Fast burn: 5m + 1h.
- Slow burn: 30m + 6h.
### 🔴 [Senior] Q: Show an actionable alert policy skeleton.
**A:**
```text
Page (Critical):
  - user-impact high OR imminent SLO breach
  - on-call acknowledge within 5m
Warn (Ticket/Slack):
  - no immediate user-impact
  - handled in business hours
Inhibition:
  - suppress downstream alerts when upstream outage confirmed
Silence:
  - planned maintenance windows
Runbook:
  - mandatory for every paging alert
```
### 🔴 [Senior] Q: What severity model should incident response align with?
**A:**
```text
SEV-1: major outage / revenue-critical path down
SEV-2: partial major impact
SEV-3: limited impact / degraded but usable
SEV-4: minor issue, no urgent impact
```
### 🟡 [Mid] Q: Give practical alert examples for checkout service.
**A:**
```text
Critical:
- checkout success rate < 97% for 5m
- checkout P99 > 2s for 10m
- payment timeout ratio > 20%
Warning:
- queue lag > threshold for 30m
- pod restart rate abnormal
- db connection wait rising trend
```
---
## 6) Latency Budget Planning: P50/P95/P99, Tail Latency, Hop Breakdown
### 🟢 [Junior] Q: Why not use average latency only?
**A:**
Average dễ che giấu outlier. User bị ảnh hưởng nhiều bởi tail latency (P95/P99) hơn là mean.
### 🟢 [Junior] Q: What are P50, P95, P99?
**A:**
- **P50:** median, 50% request nhanh hơn giá trị này.
- **P95:** 95% request nhanh hơn.
- **P99:** 99% request nhanh hơn (nhạy với tail).
### 🟡 [Mid] Q: What is latency budget planning?
**A:**
Là việc phân bổ latency end-to-end cho từng hop trong critical path để đảm bảo tổng thể đạt SLO.
### 🟡 [Mid] Q: Show a hop-by-hop latency budget example.
**A:**
```text
Checkout E2E target (P95): 500ms
Gateway         30ms
Auth            40ms
Order logic     80ms
Payment call   220ms
DB              90ms
Buffer           40ms
----------------------
Total           500ms
```
### 🟡 [Mid] Q: How does tracing help validate latency budget?
**A:**
Traces cho số liệu span latency theo từng hop để so với budget đã đặt.
```text
Budget vs actual (P95)
Auth:   40ms vs 55ms  -> exceed
Order:  80ms vs 70ms  -> ok
Pay:   220ms vs 260ms -> exceed
DB:     90ms vs 85ms  -> ok
```
### 🔴 [Senior] Q: What causes tail latency amplification?
**A:**
- Chuỗi nhiều hop nối tiếp.
- Fan-out query (nhiều shard/dependency).
- Retry storm.
- Queueing delay khi saturation cao.
- GC pause, lock contention, CPU throttling.
### 🔴 [Senior] Q: Explain “tail at scale” with a simple probability example.
**A:**
Nếu một request gọi song song 20 shard, mỗi shard có 99% khả năng hoàn thành < 100ms.
Xác suất tất cả đều < 100ms:
```text
0.99^20 ≈ 0.818
```
Tức khoảng 18% request sẽ có ít nhất một shard chậm hơn 100ms.
### 🔴 [Senior] Q: Mitigation strategies for tail latency?
**A:**
- Timeout per hop rõ ràng.
- Retry có jitter và hạn mức.
- Hedged request có kiểm soát.
- Cache và precompute cho hotspot.
- Bulkhead/circuit breaker cho dependency.
- Giảm fan-out hoặc dùng partial results.
### 🟡 [Mid] Q: Go example for budget-aware timeout chaining.
**A:**
```go
package budget
import (
	"context"
	"errors"
	"time"
)
func CallFlow(ctx context.Context, total time.Duration, auth, pay func(context.Context) error) error {
	deadline := time.Now().Add(total)
	ctxAuth, cancelAuth := context.WithTimeout(ctx, 80*time.Millisecond)
	defer cancelAuth()
	if err := auth(ctxAuth); err != nil {
		return err
	}
	remaining := time.Until(deadline)
	if remaining <= 0 {
		return errors.New("latency budget exhausted")
	}
	payBudget := minDur(remaining, 220*time.Millisecond)
	ctxPay, cancelPay := context.WithTimeout(ctx, payBudget)
	defer cancelPay()
	return pay(ctxPay)
}
func minDur(a, b time.Duration) time.Duration {
	if a < b {
		return a
	}
	return b
}
```
---
## 7) Multi-Region Deployment: Active-Active vs Active-Passive, DNS Routing, Consistency
### 🟢 [Junior] Q: What is active-passive multi-region?
**A:**
Một region phục vụ chính, region còn lại standby để failover khi sự cố.
### 🟢 [Junior] Q: What is active-active multi-region?
**A:**
Nhiều region cùng phục vụ traffic đồng thời, thường route theo geo/latency.
### 🟡 [Mid] Q: Active-active vs active-passive tradeoffs?
**A:**
**Active-passive**:
- Ưu: đơn giản hơn về consistency và vận hành.
- Nhược: failover có RTO/RPO, standby có thể lãng phí.
**Active-active**:
- Ưu: latency tốt hơn cho user toàn cầu, resilience cao hơn.
- Nhược: conflict data, replication lag, vận hành phức tạp.
### 🟡 [Mid] Q: What DNS routing strategies are common?
**A:**
- Geo routing
- Latency-based routing
- Weighted routing
- Failover routing
### 🔴 [Senior] Q: How do you reason about consistency across regions?
**A:**
Không có một model cho mọi dữ liệu. Phải phân loại:
- Dữ liệu tài chính/order state critical: consistency chặt hơn, có thể single-writer.
- Dữ liệu profile/caching/feed: eventual consistency chấp nhận được.
### 🔴 [Senior] Q: What patterns reduce write conflicts in active-active?
**A:**
- Single-writer per partition/key.
- Idempotency key.
- Version check (optimistic concurrency control).
- Conflict resolution policy rõ (LWW hoặc domain-specific merge).
### 🔴 [Senior] Q: Show an active-active ASCII architecture.
**A:**
```text
                 +----------------------+
                 | Global DNS / GSLB    |
                 +----------+-----------+
                            |
             +--------------+--------------+
             |                             |
             v                             v
      +-------------+               +-------------+
      | Region A    |               | Region B    |
      | API + App   |               | API + App   |
      | Cache A     |               | Cache B     |
      +------+------+               +------+------+
             |                             |
             v                             v
      +-------------+ <---replicate---> +-------------+
      | DB/Log A    |                    | DB/Log B    |
      +-------------+                    +-------------+
```
### 🟡 [Mid] Q: What are RTO and RPO in regional failover?
**A:**
- **RTO**: thời gian khôi phục dịch vụ.
- **RPO**: lượng dữ liệu có thể mất tối đa.
Trong interview, bạn nên nói RTO/RPO target cụ thể thay vì nói chung chung “khôi phục nhanh”.
### 🔴 [Senior] Q: Multi-region pitfalls interviewers often expect you to mention?
**A:**
- Quên stateful dependencies (DB, queue, object storage).
- Không có plan failback.
- Không nói compliance/data residency.
- Chọn active-active nhưng không có conflict strategy.
---
## 8) Capacity Planning: Load Testing, Autoscaling, Queue-Based Load Leveling
### 🟢 [Junior] Q: What is capacity planning in backend systems?
**A:**
Là dự báo nhu cầu và chuẩn bị hạ tầng/kiến trúc để đáp ứng traffic mục tiêu với reliability và cost hợp lý.
### 🟢 [Junior] Q: Why is load testing mandatory before major launches?
**A:**
Vì production traffic có pattern burst và dependency phức tạp. Load test giúp bạn biết giới hạn thật, phát hiện bottleneck trước khi sự cố xảy ra.
### 🟡 [Mid] Q: k6 example for checkout load test?
**A:**
```javascript
import http from "k6/http";
import { check, sleep } from "k6";
export const options = {
  stages: [
    { duration: "2m", target: 100 },
    { duration: "5m", target: 1000 },
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<300", "p(99)<800"],
  },
};
export default function () {
  const res = http.post("https://api.example.com/checkout", JSON.stringify({ cartId: "c-1" }), {
    headers: { "Content-Type": "application/json" },
  });
  check(res, {
    "status is 200 or 202": (r) => r.status === 200 || r.status === 202,
  });
  sleep(1);
}
```
### 🟡 [Mid] Q: Vegeta quick throughput baseline example?
**A:**
```bash
echo "GET https://api.example.com/health" | vegeta attack -rate=500 -duration=60s | vegeta report
echo "POST https://api.example.com/checkout" | vegeta attack -rate=300 -duration=120s -body=body.json | vegeta report
```
### 🟡 [Mid] Q: What metrics are good autoscaling signals?
**A:**
- API pods: concurrency/QPS + latency signals.
- Worker pods: queue lag/depth/oldest message age.
- Resource guardrails: CPU/memory để tránh OOM/throttle.
### 🔴 [Senior] Q: Why CPU-only autoscaling is risky?
**A:**
Nhiều service backend là I/O bound. CPU có thể thấp nhưng latency cao do DB wait hoặc external API chậm. Scaling policy phải kết hợp workload metrics.
### 🔴 [Senior] Q: What is queue-based load leveling?
**A:**
Là kỹ thuật hấp thụ spike bằng queue để tách producer khỏi consumer, xử lý downstream ở tốc độ ổn định.
### 🔴 [Senior] Q: Show ASCII diagram for queue-based load leveling.
**A:**
```text
Client -> API -> Queue (Kafka/Rabbit/SQS) -> Worker Pool -> DB / External API
            |             ^        |
            |             |        +-> DLQ
            +-> 202       +-> lag/age/retry metrics
Backpressure tools:
- max in-flight per worker
- retry with exponential backoff + jitter
- circuit breaker around downstream
```
### 🔴 [Senior] Q: How do you estimate worker count from queue traffic?
**A:**
Ví dụ:
- Arrival rate: 8,000 msg/s
- Avg process time: 50ms/msg
Một worker xử lý ~20 msg/s.
Số worker tối thiểu:
```text
8000 / 20 = 400 workers
```
Sau đó thêm headroom 20–40% cho burst + retry.
### 🔴 [Senior] Q: Capacity planning checklist before a big sale event?
**A:**
1. Forecast peak + worst-case traffic.
2. Stress + soak test với traffic profile thực tế.
3. Verify DB and cache limits.
4. Plan rollback/feature flags.
5. Prepare on-call war room.
6. Freeze risky deploy window.
---
## 9) Incident Response: On-call, Severity Levels, Postmortem, Blameless Retrospectives
### 🟢 [Junior] Q: What is incident response?
**A:**
Incident response là quy trình từ phát hiện -> xử lý -> khôi phục -> học hỏi sau sự cố production.
### 🟢 [Junior] Q: Why does on-call matter for backend teams?
**A:**
Vì hệ thống chạy 24/7, cần người có trách nhiệm phản hồi nhanh khi user impact xảy ra, đặc biệt ngoài giờ hành chính.
### 🟡 [Mid] Q: Standard incident lifecycle?
**A:**
```text
Detect -> Triage -> Mitigate -> Resolve -> Recover -> Postmortem -> Follow-up
```
### 🟡 [Mid] Q: What should an incident commander do?
**A:**
- Điều phối người và quyết định ưu tiên.
- Quản lý communication/timeline.
- Đảm bảo mitigation diễn ra nhanh và có kiểm soát.
- Chốt condition để declare resolved.
### 🟡 [Mid] Q: Suggest a communication update template.
**A:**
```text
[Time][SEV][Status]
Impact: checkout failures in APAC ~30%
Scope: payment dependency timeout after deploy
Mitigation: rollback in progress, ETA 10m
Next update: +15m
Owner: IC @name
```
### 🔴 [Senior] Q: What is blameless postmortem culture?
**A:**
Blameless nghĩa là tập trung vào hệ thống/process/guardrail thay vì đổ lỗi cá nhân. Mục tiêu là học và ngăn tái diễn, không phải tìm người để phạt.
### 🔴 [Senior] Q: What fields should a strong postmortem include?
**A:**
- Summary
- Customer impact
- Timeline chi tiết
- Root cause + contributing factors
- Detection/response gaps
- What went well / poorly
- Action items (owner + deadline)
### 🔴 [Senior] Q: How to ensure postmortem actions are completed?
**A:**
- Mỗi action item thành ticket có owner + due date.
- Theo dõi trong reliability review định kỳ.
- Đo recurrence rate để đánh giá hiệu quả.
### 🔴 [Senior] Q: Common anti-patterns in incident handling?
**A:**
- Không phân vai rõ -> nhiều người sửa lung tung.
- Tranh luận root cause quá sớm, chậm mitigation.
- Không freeze deploy trong incident lớn.
- Không có timeline chuẩn -> học sau sự cố kém.
---
## 10) End-to-End Scenario: Investigating a Latency Spike
### 🟡 [Mid] Q: How would you debug a latency spike in a microservices system?
**A:**
Framework ngắn gọn nhưng hiệu quả:
```text
1) Confirm impact via SLI dashboard
2) Scope: route, region, start time
3) Trace pivot: identify slowest span/hop
4) Log correlation by trace_id
5) Check saturation: DB pool, queue lag, CPU throttling
6) Mitigate first: rollback/fallback/rate limit/scale
7) Root cause fix + verify + write postmortem
```
### 🔴 [Senior] Q: What metrics indicate this is a downstream dependency issue?
**A:**
- Service own CPU bình thường nhưng P99 tăng.
- CLIENT span tới dependency tăng mạnh.
- Timeout/error từ dependency tăng.
- Retry count tăng và queue backlog tăng theo.
### 🔴 [Senior] Q: What immediate mitigations are usually safe?
**A:**
- Rollback deploy gần nhất nếu correlation cao.
- Bật fallback/degraded mode.
- Giảm timeout + hạn chế retry để giảm congestion.
- Scale out layer nghẽn (nếu bottleneck hỗ trợ scale ngang).
### 🔴 [Senior] Q: Show a triage matrix table.
**A:**
| Signal             | Observation | Likely cause                  | Immediate action                    |
| ------------------ | ----------- | ----------------------------- | ----------------------------------- |
| P99 up, CPU normal | yes         | downstream or queueing        | inspect traces, set tighter timeout |
| Error rate up      | yes         | dependency outage or overload | breaker + fallback + rollback       |
| DB wait up         | yes         | pool/query bottleneck         | tune query/pool, shed load          |
| Queue lag up       | yes         | consumer under-provisioned    | scale workers, lower retry storm    |
### 🟡 [Mid] Q: What should be done after mitigation succeeds?
**A:**
Sau khi ổn định:
1. Verify SLI đã về ngưỡng an toàn.
2. Thu thập evidence (metrics/traces/logs timeline).
3. Viết postmortem blameless.
4. Tạo action items cho monitoring, guardrails, test coverage.
---
## 11) Practical Go Snippets (Observability + Resilience)
### 🟡 [Mid] Q: Middleware that logs request summary with trace ID?
**A:**
```go
package middleware
import (
	"log/slog"
	"net/http"
	"time"
	"go.opentelemetry.io/otel/trace"
)
type statusWriter struct {
	http.ResponseWriter
	status int
}
func (w *statusWriter) WriteHeader(code int) {
	w.status = code
	w.ResponseWriter.WriteHeader(code)
}
func AccessLog(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		sw := &statusWriter{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(sw, r)
		spanCtx := trace.SpanContextFromContext(r.Context())
		logger.Info("request done",
			"method", r.Method,
			"path", r.URL.Path,
			"status", sw.status,
			"latency_ms", time.Since(start).Milliseconds(),
			"trace_id", spanCtx.TraceID().String(),
		)
	})
}
```
### 🟡 [Mid] Q: Retry with bounded exponential backoff + jitter in Go?
**A:**
```go
package retry
import (
	"context"
	"math/rand"
	"time"
)
func Do(ctx context.Context, attempts int, base time.Duration, fn func(context.Context) error) error {
	var err error
	for i := 0; i < attempts; i++ {
		err = fn(ctx)
		if err == nil {
			return nil
		}
		if i == attempts-1 {
			break
		}
		backoff := base * time.Duration(1<<i)
		jitter := time.Duration(rand.Int63n(int64(backoff / 2)))
		wait := backoff/2 + jitter
		timer := time.NewTimer(wait)
		select {
		case <-ctx.Done():
			timer.Stop()
			return ctx.Err()
		case <-timer.C:
		}
	}
	return err
}
```
### 🔴 [Senior] Q: Timeout + circuit breaker + fallback integration sketch?
**A:**
```go
package resilience
import (
	"context"
	"errors"
	"time"
)
type Breaker interface {
	Allow() bool
	OnResult(error)
}
func CallDependency(ctx context.Context, br Breaker, call func(context.Context) error, fallback func() error) error {
	if !br.Allow() {
		return fallback()
	}
	ctx, cancel := context.WithTimeout(ctx, 250*time.Millisecond)
	defer cancel()
	err := call(ctx)
	br.OnResult(err)
	if err == nil {
		return nil
	}
	if errors.Is(err, context.DeadlineExceeded) {
		return fallback()
	}
	return err
}
```
### 🔴 [Senior] Q: Queue lag based worker target function (pseudo-code)?
**A:**
```go
func desiredWorkers(
	lag int64,
	ratePerWorker float64,
	targetDrainSec int64,
	minW, maxW int32,
) int32 {
	if lag <= 0 {
		return minW
	}
	requiredRate := float64(lag) / float64(targetDrainSec)
	workers := int32(requiredRate/ratePerWorker + 0.999) // ceil
	if workers < minW {
		workers = minW
	}
	if workers > maxW {
		workers = maxW
	}
	return workers
}
```
---
## 12) Interview Q&A Drill by Topic
### 🟢 [Junior] Q: If I only have one dashboard panel for reliability, what should it be?
**A:**
Một panel tổng hợp SLI gồm error rate + P95/P99 + traffic cho route critical. Panel này cho tín hiệu user impact nhanh nhất.
### 🟡 [Mid] Q: Why should alerts be tied to user impact rather than only infrastructure metrics?
**A:**
CPU cao chưa chắc user bị ảnh hưởng; nhưng checkout error rate tăng chắc chắn là vấn đề user-facing. Alert phải tối ưu cho giá trị kinh doanh và trải nghiệm khách hàng.
### 🔴 [Senior] Q: How do you decide what to page on-call vs what to send as ticket?
**A:**
Page khi có một trong các điều kiện:
- User impact đáng kể.
- Nguy cơ vi phạm SLO trong ngắn hạn.
- Rủi ro leo thang nhanh nếu không xử lý ngay.
Các tín hiệu còn lại gửi ticket/slack và xử lý theo kế hoạch.
### 🟢 [Junior] Q: Why include deployment markers on Grafana charts?
**A:**
Vì giúp correlate biến động metric với thời điểm deploy/config change, giảm đáng kể thời gian triage.
### 🟡 [Mid] Q: What’s the difference between stress test and soak test?
**A:**
- Stress test: tìm điểm gãy ở tải cao.
- Soak test: chạy dài để tìm memory leak/resource leak và degradation theo thời gian.
### 🔴 [Senior] Q: How can retries make incidents worse?
**A:**
Retry thiếu kiểm soát làm tăng load vào dependency đang chậm, gây congestion và thậm chí cascading failure. Cần retry budget, exponential backoff + jitter, và circuit breaker.
### 🟡 [Mid] Q: Why is queue lag often a better scaling signal for workers than CPU?
**A:**
Vì lag phản ánh trực tiếp backlog business. Worker có thể CPU thấp nhưng vẫn chậm do I/O wait hoặc downstream timeout.
### 🔴 [Senior] Q: How do you measure incident management quality itself?
**A:**
Theo dõi:
- MTTD
- MTTA
- MTTR
- Recurrence rate
- % postmortem action items done on time
---
## 13) Final Interview Q&A Section (8–10 Questions)
### 1) 🟢 [Junior] Q: What are SLI, SLO, and SLA? Give examples.
**A:**
SLI là chỉ số đo chất lượng dịch vụ (ví dụ checkout success ratio). SLO là mục tiêu nội bộ cho SLI (ví dụ >= 99.9% theo tháng). SLA là cam kết với khách hàng (ví dụ >= 99.5%, nếu thấp hơn có credit).
### 2) 🟡 [Mid] Q: How would you debug a latency spike in a microservices system?
**A:**
Em sẽ bắt đầu từ metrics để xác định route/region/time ảnh hưởng, dùng traces để tìm hop chậm nhất, dùng logs theo trace_id để xác nhận nguyên nhân, kiểm tra saturation (DB pool, queue lag), rồi mitigation trước (rollback/fallback/scale), sau đó mới tối ưu triệt để và viết postmortem.
### 3) 🔴 [Senior] Q: Design an alerting strategy that avoids alert fatigue.
**A:**
Chiến lược nên dựa trên SLO burn-rate, phân cấp page vs ticket, có dedup/inhibition, và mỗi alert paging bắt buộc kèm runbook. Review định kỳ alert noise để xoá các alert không actionable.
### 4) 🔴 [Senior] Q: How do you propagate trace context across async message queues?
**A:**
Inject trace context vào message headers ở producer, extract ở consumer rồi tạo span mới (CONSUMER) liên kết về trace gốc. Duy trì metadata khi retry hoặc chuyển DLQ để không mất khả năng truy vết.
### 5) 🟡 [Mid] Q: RED and USE differ how in real troubleshooting?
**A:**
RED cho thấy symptom của service (QPS/error/latency). USE cho thấy resource pressure (utilization/saturation/errors). Khi P99 tăng, RED giúp thấy impact; USE giúp chỉ ra bottleneck thực.
### 6) 🔴 [Senior] Q: How would you set and enforce latency budgets in a checkout path?
**A:**
Đặt SLO end-to-end trước (ví dụ P95<500ms), chia budget per hop, cấu hình timeout theo remaining budget, theo dõi via tracing histogram, và điều chỉnh khi dependency profile thay đổi.
### 7) 🟡 [Mid] Q: Why might a team choose active-passive over active-active?
**A:**
Vì active-passive dễ vận hành và consistency hơn, phù hợp team nhỏ hoặc domain cần write ordering chặt. Active-active chỉ nên chọn khi lợi ích latency/availability vượt chi phí vận hành tăng thêm.
### 8) 🔴 [Senior] Q: What would you include in a blameless postmortem after a SEV-1?
**A:**
Impact định lượng, timeline chi tiết, root cause + contributing factors, detection/response gap, what went well/poorly, action items có owner + deadline, và cách verify rằng action sẽ ngăn tái diễn.
### 9) 🟢 [Junior] Q: Why are structured JSON logs better than plain text logs during incidents?
**A:**
Vì có thể query/filter theo field ngay lập tức (`trace_id`, `service`, `error_code`), giảm thời gian tìm nguyên nhân và giảm MTTR.
### 10) 🔴 [Senior] Q: How do you scale queue consumers safely during traffic spikes?
**A:**
Scale dựa trên lag + processing rate, giới hạn concurrency, kiểm soát retry, quan sát downstream saturation, và sẵn sàng bật degrade/rate limit để tránh đẩy overload sang DB hoặc external provider.
---
## 14) Compact Cheat Sheet
### 🟢 [Junior] Q: Can I get a fast recap table?
**A:**
| Topic         | Core idea                  | Key interview phrase                   |
| ------------- | -------------------------- | -------------------------------------- |
| Three pillars | Metrics + Logs + Traces    | “Detect, localize, explain”            |
| Metrics       | RED + USE + Golden signals | “SLI-backed dashboards”                |
| Tracing       | OTel + propagation         | “trace_id continuity across hops”      |
| Logging       | Structured JSON            | “queryable, correlated logs”           |
| Alerting      | SLO + error budget         | “actionable alerts, not noisy alerts”  |
| Latency       | P95/P99 + budget           | “tail latency drives UX”               |
| Multi-region  | active-active/passive      | “availability vs consistency tradeoff” |
| Capacity      | load test + autoscale      | “queue lag for worker scaling”         |
| Incident      | on-call + blameless PM     | “mitigate fast, learn deeply”          |
### 🔴 [Senior] Q: What makes an answer sound senior?
**A:**
Một câu trả lời senior thường có đủ:
1. Objective/SLO rõ.
2. Tradeoff cụ thể.
3. Failure mode và mitigation.
4. Operational detail (runbook, escalation, ownership).
5. Learning loop (postmortem + prevention).
---
## 15) Cross-Reference Reading Path
### 🟢 [Junior] Q: Which documents should I read next to strengthen this chapter?
**A:**
Nội bộ BE track:
- `01-design-framework.md`
- `02-classic-problems.md`
- `04-distributed-patterns.md`
- `../02-backend-knowledge/02-microservices.md`
- `../02-backend-knowledge/03-distributed-systems.md`
- `../02-backend-knowledge/06-networking-go.md`
- `../06-devops-infrastructure.md`
- `../01-golang/05-testing-profiling.md`
Shared theory:
- `../../shared/02-system-design/system-design-theory.md`
- `../../shared/02-system-design/replication-partitioning.md`
- `../../shared/01-cs-fundamentals/networking-theory.md`
### 🟡 [Mid] Q: Suggest a 7-day prep plan for this chapter.
**A:**
```text
Day 1: Three pillars + RED/USE/golden signals
Day 2: Prometheus + PromQL + pprof basics
Day 3: OpenTelemetry tracing + propagation
Day 4: Structured logs + ELK/Loki patterns
Day 5: SLI/SLO/SLA + alert strategy + runbooks
Day 6: Latency budget + capacity planning + queue scaling
Day 7: Incident response drills + mock interview
```
---
## 16) Appendix — Runbook Skeleton (ASCII)
### 🟡 [Mid] Q: Provide a reusable runbook skeleton for high-latency alerts.
**A:**
```text
Runbook: Checkout High Latency
Trigger:
  - P99 checkout latency > 2s for 10m
Impact Check:
  - affected regions/routes
  - conversion impact
Immediate Mitigation:
  - rollback recent deploy
  - enable degraded mode
  - tighten downstream timeout
  - scale bottleneck component
Diagnostics:
  - traces: top slow spans
  - logs: error_code frequency by trace_id
  - metrics: db wait, queue lag, cpu throttle
Escalation:
  - if impact > 20% users for > 15m => SEV-1
Recovery Criteria:
  - P95 < 300ms for 30m
  - error rate < 1%
Post-Incident:
  - postmortem
  - action items with owner/date
```
---
## 17) Appendix — Interview Mistakes and Better Framing
### 🟢 [Junior] Q: Common mistakes when answering observability questions?
**A:**
- Chỉ nêu tên tool mà không có objective/SLO.
- Không nói user impact.
- Quên correlation giữa metrics/logs/traces.
- Quên runbook và on-call ownership.
### 🟡 [Mid] Q: Better framing sentence for interviews?
**A:**
Bạn có thể dùng câu này:
```text
"Em bắt đầu từ SLO và user impact, dùng metrics để detect,
tracing để localize bottleneck, logs để explain root cause,
rồi đặt alert/runbook để giảm MTTR và tránh tái diễn."
```
### 🔴 [Senior] Q: What extra points can impress senior interviewers?
**A:**
- Nhắc đến error budget policy ảnh hưởng release decisions.
- Nói rõ tail latency + retry amplification.
- Đề cập compliance trong logging/tracing.
- Có kinh nghiệm game day / chaos drills / postmortem follow-through.
---
## 18) Final Summary
### 🟢 [Junior] Q: What are the 5 things to remember before interview day?
**A:**
1. Observability = Metrics + Logs + Traces.
2. Alert tốt phải actionable và gắn SLO.
3. Latency budget theo hop, không chỉ nhìn average.
4. Multi-region luôn có tradeoff availability/consistency/cost.
5. Incident response tốt là mitigate nhanh + postmortem chất lượng.
### 🔴 [Senior] Q: Give a strong senior-level closing statement.
**A:**
“Reliability không phải tính năng phụ. Em xem nó như sản phẩm: có objective rõ, có telemetry đủ sâu để ra quyết định, có cơ chế phản ứng nhanh khi incident, và có vòng lặp học tập để hệ thống ổn định hơn theo thời gian.”
