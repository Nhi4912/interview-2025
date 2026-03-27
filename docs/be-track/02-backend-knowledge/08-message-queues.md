# Message Queues in Go / Hàng Đợi Tin Nhắn với Go

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Distributed Systems](./03-distributed-systems.md) | [Resilience Patterns](./07-resilience-patterns.md)
> **See also**: [Shared Message Queues Theory](../../shared/02-system-design/05-message-queues.md) | [Distributed Patterns](../04-be-system-design/04-distributed-patterns.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Tiki Order Processing (real incident):** Khi Tiki ra mắt chương trình Flash Sale, đội backend gặp vấn đề: service xử lý đơn hàng nhận 50,000 events/giây từ Kafka nhưng bị lag 30 giây. Root cause: consumer commit offset _trước_ khi xử lý xong — nếu pod crash, messages bị mất hoàn toàn. Fix: chuyển sang manual commit _sau_ khi xử lý, thêm dead-letter queue cho poisoned messages. Lag giảm về 0, zero message loss.

**Bài học:** Message queue không tự đảm bảo delivery. Ordering, idempotency, và consumer group management phải được thiết kế chủ động.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Message queue giống bưu điện: producer bỏ thư (message) vào hòm thư (queue/topic), consumer lấy thư ra xử lý. Bưu điện không quan tâm producer và consumer có online cùng lúc không — đây là **async decoupling**. Kafka giống bưu điện lưu lại toàn bộ lịch sử thư (log), RabbitMQ giống bưu điện xóa thư khi đã giao.

**Why it matters:** Mọi hệ thống microservices đều cần async communication để scale. Khi một service chậm, message queue hấp thụ áp lực thay vì gây cascading failure.

## Concept Map / Bản Đồ Khái Niệm

```
[Message Queue Patterns]
        │
        ├── Kafka (log-based)
        │     ├── Topic → Partitions → Offsets
        │     ├── Consumer Group → parallel consumers ≤ partitions
        │     ├── At-least-once: commit AFTER processing
        │     └── Exactly-once: idempotent + transactional producer
        │
        ├── RabbitMQ (broker-based)
        │     ├── Exchange → Routing → Queue
        │     ├── ACK/NACK: consumer signals success/failure
        │     └── DLQ: rejected messages → Dead Letter Exchange
        │
        └── Go Patterns
              ├── Consumer group loop + graceful shutdown (context cancel)
              ├── Manual offset commit (sarama AutoCommit=false)
              ├── Semaphore for bounded concurrency
              └── Outbox Pattern: DB write + message in same transaction
```

---

## Overview / Tổng Quan

Phần này tập trung vào **implementation và production patterns** với Go — Kafka consumer, RabbitMQ worker, và các patterns phổ biến khi dùng message queues ở backend Go.

Lý thuyết nền (Kafka architecture, at-least-once vs exactly-once, Saga pattern): xem [Shared Message Queues](../../shared/02-system-design/05-message-queues.md).

| #   | Concept                                      | Role                                              | Interview Weight |
| --- | -------------------------------------------- | ------------------------------------------------- | ---------------- |
| 1   | Kafka Consumer & Offset Management           | At-least-once delivery with manual commit         | ⭐⭐⭐⭐⭐       |
| 2   | Kafka Producer & Idempotency                 | Reliable publishing with retry and ordering       | ⭐⭐⭐⭐         |
| 3   | Dead Letter Queue (DLQ)                      | Isolation of poison messages for later inspection | ⭐⭐⭐⭐         |
| 4   | RabbitMQ Worker Pattern                      | Broker-based queue with ACK/NACK and reconnection | ⭐⭐⭐           |
| 5   | Queue Selection (Kafka vs RabbitMQ vs Redis) | Architectural trade-off reasoning                 | ⭐⭐⭐⭐⭐       |
| 6   | Consumer Lag & Scaling                       | Debug and fix slow consumers in production        | ⭐⭐⭐⭐         |
| 7   | Go-Specific Patterns                         | Graceful shutdown, semaphore concurrency, outbox  | ⭐⭐⭐⭐         |

**Relationship / Mối quan hệ:** Kafka Consumer (1) + Producer (2) form the core event pipeline → DLQ (3) handles failures → RabbitMQ (4) covers task-queue workloads → Selection (5) ties decision-making → Lag (6) is production reality → Go Patterns (7) is the glue binding all concepts to idiomatic Go code.

---

## Core Concepts — Phase 2 Deep Treatment / Khái Niệm Cốt Lõi — Xử Lý Sâu

### Concept 1: Kafka Consumer & Offset Management

**🧠 Memory Hook:** "Offset is a bookmark — commit it before finishing the book, and you lose your page forever."
_Offset là bookmark — commit trước khi đọc xong trang, bạn mất vị trí mãi mãi._

**❓ Why exists (root-cause tracing):**

- Level 1: Why manual commit? → AutoCommit may commit before processing finishes → message loss on crash
- Level 2: Why consumer groups? → Parallel consumption needs partition assignment coordination → Kafka uses group protocol for rebalance
- Level 3: Why partitions ≤ consumers hard limit? → Each partition is a unit of parallelism, assigning 2 consumers to 1 partition would create duplicate reads

**⚠️ Common Mistakes:**

1. Leaving `AutoCommit.Enable = true` for critical events → silent message loss
2. Not handling rebalance in `Setup/Cleanup` → stale state after partition reassignment
3. Committing per-message instead of per-batch → throughput killed by commit latency

**🎯 Interview Pattern:** "Design a reliable order consumer" → show manual commit + DLQ + graceful shutdown + idempotent processing

**🔗 Knowledge Chain:** Consumer Groups → Partition Assignment → Offset Management → At-Least-Once → Idempotency requirement

---

### Concept 2: Kafka Producer & Idempotency

**🧠 Memory Hook:** "Idempotent producer = dedup at broker level — same message sent twice, stored once."
_Producer idempotent = dedup ở broker — gửi 2 lần, lưu 1 lần._

**❓ Why exists (root-cause tracing):**

- Level 1: Why `RequiredAcks = WaitForAll`? → Ensures all ISR replicas have the message before ACK → survives broker failure
- Level 2: Why `Idempotent = true`? → Network retry can duplicate messages → broker dedup via producer ID + sequence number
- Level 3: Why `MaxOpenRequests = 1` for idempotent? → Multiple in-flight requests can arrive out-of-order → sequence number check would fail

**⚠️ Common Mistakes:**

1. Using AsyncProducer without reading Errors channel → silent message loss
2. Not setting key → messages spread across partitions → ordering lost
3. Ignoring `RequiredAcks = WaitForLocal` risk → data loss when leader crashes before replication

**🎯 Interview Pattern:** "Your Kafka producer loses messages occasionally" → check acks setting + idempotent flag + retry config + error channel handling

**🔗 Knowledge Chain:** Producer Config → Acks Level → Idempotency → Ordering Guarantees → Exactly-Once Semantics

---

### Concept 3: Dead Letter Queue (DLQ)

**🧠 Memory Hook:** "DLQ = hospital for sick messages — quarantine, diagnose, cure, re-inject."
_DLQ = bệnh viện cho message bị lỗi — cách ly, chẩn đoán, chữa, đưa lại._

**❓ Why exists (root-cause tracing):**

- Level 1: Why not just retry forever? → Poison messages block the entire partition → consumer lag grows infinitely
- Level 2: Why separate topic, not in-memory retry? → Pod restart loses retry state → DLQ topic persists across restarts
- Level 3: Why attach original metadata (topic, partition, error)? → Debug requires context → without it, DLQ messages are opaque blobs

**⚠️ Common Mistakes:**

1. DLQ without alerting → poison messages accumulate silently for weeks
2. Infinite retry before DLQ → blocking healthy messages behind poison one
3. Not committing after DLQ send → same message retried AND sent to DLQ repeatedly

**🎯 Interview Pattern:** "A message keeps failing — what do you do?" → retry N times with backoff → DLQ → alert → human inspect → fix + replay

**🔗 Knowledge Chain:** Processing Failure → Retry with Backoff → Max Retries → DLQ Topic → Monitoring → Manual Replay

---

### Concept 4: RabbitMQ Worker Pattern

**🧠 Memory Hook:** "RabbitMQ is a smart post office — it routes letters (messages) to the right mailbox (queue) using rules (exchange + routing key)."
_RabbitMQ là bưu điện thông minh — định tuyến thư đến đúng hòm thư theo quy tắc._

**❓ Why exists (root-cause tracing):**

- Level 1: Why prefetch=1? → Without it, RabbitMQ pushes all messages to one consumer → uneven load
- Level 2: Why reconnection loop? → AMQP connections are TCP-based → network blip drops connection → need auto-recovery
- Level 3: Why Nack with requeue vs reject? → Requeue gives the message another chance → reject sends to DLX (Dead Letter Exchange)

**⚠️ Common Mistakes:**

1. Not setting `Qos(prefetch)` → one fast consumer starves others
2. Ignoring `NotifyClose` → consumer silently stops receiving messages after disconnect
3. `Ack(true)` (multiple) without understanding → acknowledges ALL prior messages, not just current

**🎯 Interview Pattern:** "How do you ensure no message loss in RabbitMQ?" → publisher confirms + consumer manual ACK + durable queue + persistent messages

**🔗 Knowledge Chain:** Exchange Binding → Queue Declaration → Consume → ACK/NACK → DLX → Monitoring

---

### Concept 5: Queue Selection (Kafka vs RabbitMQ vs Redis)

**🧠 Memory Hook:** "Kafka = newspaper archive (replay forever), RabbitMQ = postal service (deliver and forget), Redis Pub/Sub = loudspeaker (miss it, gone)."
_Kafka = kho báo (phát lại mãi), RabbitMQ = bưu điện (giao xong xóa), Redis = loa phát thanh (lỡ thì mất)._

**❓ Why exists (root-cause tracing):**

- Level 1: Why not just use Kafka for everything? → Kafka overkill for simple task queues → operational complexity (ZooKeeper/KRaft, partition management)
- Level 2: Why Redis Pub/Sub for ephemeral data? → Zero persistence overhead → microsecond latency → perfect for "latest value only" use cases
- Level 3: Why Grab uses all three? → Different use cases have different durability/latency/ordering requirements → one tool cannot optimize all three

**⚠️ Common Mistakes:**

1. Choosing Kafka for a 10-msg/sec notification queue → over-engineering
2. Using Redis Pub/Sub for payment events → no persistence, message loss on subscriber disconnect
3. Not considering operational cost — Kafka cluster requires dedicated ops team

**🎯 Interview Pattern:** "Design the messaging for an e-commerce platform" → event bus (Kafka) + task queue (RabbitMQ/SQS) + real-time (Redis) with justification

**🔗 Knowledge Chain:** Requirements Analysis → Durability Needs → Throughput Needs → Ordering Needs → Tool Selection → Hybrid Architecture

---

### Concept 6: Consumer Lag & Scaling

**🧠 Memory Hook:** "Consumer lag = unread emails — too many means your inbox (consumer) is too slow or too few."
_Consumer lag = email chưa đọc — quá nhiều nghĩa là inbox xử lý quá chậm hoặc quá ít._

**❓ Why exists (root-cause tracing):**

- Level 1: Why does lag grow? → Processing rate < production rate → offset falls behind head
- Level 2: Why can't you just add more consumers? → Consumers in a group ≤ partitions → adding beyond that leaves idle consumers
- Level 3: Why is hot partition a common root cause? → Bad key distribution → one partition gets 80% of traffic → that consumer is bottleneck

**⚠️ Common Mistakes:**

1. Adding consumers without checking partition count → idle consumers waste resources
2. Increasing partitions without understanding ordering impact → messages for same key may split across partitions during migration
3. Using async processing without idempotency → duplicate processing on rebalance

**🎯 Interview Pattern:** "Consumers are falling behind in production" → check lag per partition → identify bottleneck (slow processing? hot partition?) → scale or optimize

**🔗 Knowledge Chain:** Lag Monitoring → Root Cause (slow processing vs hot partition vs under-provisioned) → Scaling Strategy → Partition Rebalance → Verification

---

### Concept 7: Go-Specific Patterns

**🧠 Memory Hook:** "Go MQ patterns = context cancel for shutdown + semaphore for concurrency + outbox for atomicity."
_Go MQ patterns = context cancel để dừng + semaphore để giới hạn + outbox để atomic._

**❓ Why exists (root-cause tracing):**

- Level 1: Why graceful shutdown matters? → Without it, in-flight messages are abandoned → reprocessed after restart → duplicate side effects
- Level 2: Why semaphore (bounded concurrency)? → Unbounded goroutines per message → OOM or overwhelming downstream services
- Level 3: Why outbox pattern? → "Write to DB then publish to Kafka" = two-phase problem → if publish fails, DB and Kafka diverge → outbox makes it single-transaction + poller

**⚠️ Common Mistakes:**

1. `os.Exit(0)` instead of context cancel → goroutines killed mid-processing
2. Unbounded `go func()` per message → 100K goroutines → memory explosion
3. "Just publish after DB commit" without outbox → eventual inconsistency between DB and event stream

**🎯 Interview Pattern:** "How do you ensure exactly-once between DB write and Kafka publish?" → outbox pattern + idempotent consumer + transactional outbox poll

**🔗 Knowledge Chain:** Graceful Shutdown → Context Propagation → Bounded Concurrency → Outbox Pattern → Idempotent Consumer → End-to-End Delivery Guarantee

---

## 1. Kafka với Go (confluent-kafka-go / sarama)

### Q: How do you implement a robust Kafka consumer in Go? 🟡 Mid

**A:** Key patterns: consumer group loop, graceful shutdown, error handling.

```go
package consumer

import (
    "context"
    "log"
    "os"
    "os/signal"
    "syscall"

    "github.com/IBM/sarama"
)

type OrderConsumer struct {
    client sarama.ConsumerGroup
    topics []string
    ready  chan bool
}

func NewOrderConsumer(brokers []string, groupID string) (*OrderConsumer, error) {
    cfg := sarama.NewConfig()
    cfg.Version = sarama.V3_5_0_0
    cfg.Consumer.Group.Rebalance.GroupStrategies = []sarama.BalanceStrategy{
        sarama.NewBalanceStrategyRoundRobin(),
    }
    cfg.Consumer.Offsets.Initial = sarama.OffsetNewest
    cfg.Consumer.Offsets.AutoCommit.Enable = false // manual commit for at-least-once

    client, err := sarama.NewConsumerGroup(brokers, groupID, cfg)
    if err != nil {
        return nil, err
    }
    return &OrderConsumer{client: client, topics: []string{"orders"}, ready: make(chan bool)}, nil
}

// Run starts the consumer loop with graceful shutdown
func (c *OrderConsumer) Run(ctx context.Context) error {
    ctx, cancel := context.WithCancel(ctx)

    // Handle OS signals
    sigCh := make(chan os.Signal, 1)
    signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
    go func() {
        <-sigCh
        cancel()
    }()

    handler := &orderHandler{ready: c.ready}

    for {
        // Consume blocks until context cancelled or rebalance
        if err := c.client.Consume(ctx, c.topics, handler); err != nil {
            if ctx.Err() != nil {
                return nil // clean shutdown
            }
            return err
        }
        handler.ready = make(chan bool) // reset after rebalance
    }
}

// ConsumeClaim processes messages from one partition
type orderHandler struct{ ready chan bool }

func (h *orderHandler) Setup(sarama.ConsumerGroupSession) error {
    close(h.ready) // signal consumer is ready
    return nil
}
func (h *orderHandler) Cleanup(sarama.ConsumerGroupSession) error { return nil }

func (h *orderHandler) ConsumeClaim(sess sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
    for msg := range claim.Messages() {
        if err := processOrder(msg.Value); err != nil {
            log.Printf("failed to process order: %v", err)
            // Don't commit — message will be redelivered after rebalance/restart
            // For production: send to DLQ instead
            continue
        }
        // Commit only after successful processing (at-least-once)
        sess.MarkMessage(msg, "")
    }
    return nil
}
```

**Các điểm quan trọng**:

1. `AutoCommit.Enable = false` → manual commit sau khi xử lý xong (at-least-once)
2. Context cancel → graceful shutdown, không mất message đang xử lý
3. Rebalance: `Setup/Cleanup` được gọi mỗi lần rebalance — cần reset state

---

### Q: How do you implement a Kafka producer with retry in Go? 🟡 Mid

```go
package producer

import (
    "context"
    "fmt"
    "time"

    "github.com/IBM/sarama"
)

type OrderProducer struct {
    producer sarama.SyncProducer
}

func NewOrderProducer(brokers []string) (*OrderProducer, error) {
    cfg := sarama.NewConfig()
    cfg.Producer.RequiredAcks = sarama.WaitForAll   // wait for all ISR replicas
    cfg.Producer.Retry.Max = 5
    cfg.Producer.Retry.Backoff = 100 * time.Millisecond
    cfg.Producer.Return.Successes = true
    cfg.Producer.Idempotent = true                  // enable idempotent producer
    cfg.Net.MaxOpenRequests = 1                     // required for idempotent

    producer, err := sarama.NewSyncProducer(brokers, cfg)
    if err != nil {
        return nil, fmt.Errorf("create producer: %w", err)
    }
    return &OrderProducer{producer: producer}, nil
}

func (p *OrderProducer) PublishOrderCreated(ctx context.Context, orderID string, payload []byte) error {
    msg := &sarama.ProducerMessage{
        Topic: "orders",
        Key:   sarama.StringEncoder(orderID), // same key → same partition → ordered
        Value: sarama.ByteEncoder(payload),
        Headers: []sarama.RecordHeader{
            {Key: []byte("event-type"), Value: []byte("order.created")},
            {Key: []byte("correlation-id"), Value: []byte(correlationIDFromCtx(ctx))},
        },
    }

    partition, offset, err := p.producer.SendMessage(msg)
    if err != nil {
        return fmt.Errorf("send message: %w", err)
    }
    _ = partition
    _ = offset
    return nil
}
```

**Lý do chọn SyncProducer vs AsyncProducer**:

- `SyncProducer`: chờ broker ack → đơn giản hơn, phù hợp với critical events
- `AsyncProducer`: không chờ → throughput cao hơn, nhưng phải handle Errors/Successes channels riêng

---

## 2. Dead Letter Queue (DLQ) Pattern / Hàng Đợi Lỗi

### Q: How do you implement a Dead Letter Queue in Go? 🟢 Junior → 🔴 Senior

**A:** DLQ nhận message sau N lần retry thất bại — cho phép inspect và reprocess sau.

```go
type MessageProcessor struct {
    mainProducer sarama.SyncProducer
    dlqTopic     string
    maxRetries   int
}

func (p *MessageProcessor) ProcessWithDLQ(
    sess sarama.ConsumerGroupSession,
    msg *sarama.ConsumerMessage,
) {
    retries := getRetryCount(msg.Headers)

    if err := processMessage(msg.Value); err != nil {
        if retries >= p.maxRetries {
            // Send to DLQ with error context
            p.sendToDLQ(msg, err)
        } else {
            // Republish with incremented retry count
            p.republishWithRetry(msg, retries+1)
        }
        // Always commit to avoid infinite redelivery of same message
        sess.MarkMessage(msg, "")
        return
    }
    sess.MarkMessage(msg, "")
}

func (p *MessageProcessor) sendToDLQ(msg *sarama.ConsumerMessage, processingErr error) {
    dlqMsg := &sarama.ProducerMessage{
        Topic: p.dlqTopic,
        Key:   sarama.ByteEncoder(msg.Key),
        Value: sarama.ByteEncoder(msg.Value),
        Headers: append(msg.Headers,
            sarama.RecordHeader{Key: []byte("error"), Value: []byte(processingErr.Error())},
            sarama.RecordHeader{Key: []byte("original-topic"), Value: []byte(msg.Topic)},
            sarama.RecordHeader{Key: []byte("original-partition"), Value: []byte(fmt.Sprint(msg.Partition))},
        ),
    }
    if _, _, err := p.mainProducer.SendMessage(dlqMsg); err != nil {
        // Log only — don't re-panic, just lose the DLQ message
        log.Printf("failed to send to DLQ: %v", err)
    }
}
```

**Quy trình DLQ**:

1. Message fail → increment retry counter trong header
2. Retry < max → republish với delay (exponential backoff)
3. Retry = max → send to `orders.dlq` topic
4. Cron job / admin tool inspect DLQ → fix + replay

---

## 3. RabbitMQ với Go (amqp091-go)

### Q: Implement a RabbitMQ worker with reconnection in Go. 🟡 Mid

**A:**

```go
package rabbitmq

import (
    "context"
    "log"
    "time"

    amqp "github.com/rabbitmq/amqp091-go"
)

type Worker struct {
    url       string
    queueName string
    conn      *amqp.Connection
    ch        *amqp.Channel
}

func (w *Worker) Run(ctx context.Context, handler func([]byte) error) {
    for {
        if err := w.connect(); err != nil {
            log.Printf("connection failed: %v, retrying in 5s", err)
            time.Sleep(5 * time.Second)
            continue
        }

        msgs, err := w.ch.Consume(w.queueName, "", false, false, false, false, nil)
        if err != nil {
            log.Printf("consume failed: %v", err)
            continue
        }

        log.Println("Worker connected, consuming...")

        connClose := w.conn.NotifyClose(make(chan *amqp.Error, 1))

    loop:
        for {
            select {
            case <-ctx.Done():
                return // graceful shutdown
            case err := <-connClose:
                log.Printf("connection closed: %v, reconnecting", err)
                break loop // reconnect outer loop
            case msg, ok := <-msgs:
                if !ok {
                    break loop
                }
                if err := handler(msg.Body); err != nil {
                    log.Printf("processing error: %v", err)
                    msg.Nack(false, true) // requeue=true
                } else {
                    msg.Ack(false)
                }
            }
        }
    }
}

func (w *Worker) connect() error {
    conn, err := amqp.Dial(w.url)
    if err != nil {
        return err
    }
    ch, err := conn.Channel()
    if err != nil {
        conn.Close()
        return err
    }
    // Prefetch = 1: don't send next message until this one is ACK'd
    ch.Qos(1, 0, false)
    w.conn = conn
    w.ch = ch
    return nil
}
```

**Điểm quan trọng**:

- `Qos(1, 0, false)` = prefetch 1: worker chỉ nhận 1 message tại một thời điểm → load balancing tự nhiên
- `NotifyClose` → phát hiện connection drop → reconnect tự động
- `Nack(false, true)` → negative ack + requeue → message được thử lại

---

## 4. Choosing the Right Tool / Chọn Công Cụ Phù Hợp

### Q: For a Go microservice, when would you choose Kafka vs RabbitMQ vs Redis? 🔴 Senior

**A:**

| Scenario                             | Choice              | Why                                                              |
| ------------------------------------ | ------------------- | ---------------------------------------------------------------- |
| Ride booking events (Grab-style)     | **Kafka**           | Multiple consumers (analytics, billing, driver app), need replay |
| Order processing pipeline            | **RabbitMQ**        | Complex routing (country → warehouse), DLQ built-in, simpler ops |
| Live location updates (driver → map) | **Redis Pub/Sub**   | Ultra-low latency, ephemeral — old locations irrelevant          |
| Audit log / compliance               | **Kafka**           | Immutable log, long retention, queryable via Kafka Streams       |
| Email/notification worker            | **RabbitMQ or SQS** | Simple task queue, at-most-once acceptable                       |

**Go-specific considerations**:

- `confluent-kafka-go` requires librdkafka (CGO) — complicates cross-compilation
- `sarama` (IBM) = pure Go, easier to compile for Linux/ARM
- `amqp091-go` = official RabbitMQ Go client, pure Go

**Thực tế production tại Grab**: Kafka cho event bus chính, RabbitMQ cho internal task queues, Redis Pub/Sub cho realtime map updates.

---

## 5. Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: A consumer is falling behind — messages are piling up. How do you debug and fix? 🔴 Senior

**A:**

**Debug steps:**

1. **Check consumer lag**: `kafka-consumer-groups.sh --describe` hoặc Kafka UI → xem lag per partition
2. **Profile the consumer**: Is processing too slow? External API call? DB query?
3. **Check partition count**: Nếu lag tập trung ở 1 partition → hot partition (bad key distribution)

**Fix options:**

```
Option 1: Scale consumers (if partitions > current consumers)
Option 2: Increase partitions (requires rebalance + ordering guarantees break)
Option 3: Async processing within consumer (parallel goroutines per message)
Option 4: Batch processing (process N messages at once)
```

**Async consumer trong Go**:

```go
func (h *handler) ConsumeClaim(sess sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
    sem := make(chan struct{}, 10) // max 10 concurrent goroutines

    for msg := range claim.Messages() {
        sem <- struct{}{}
        go func(m *sarama.ConsumerMessage) {
            defer func() { <-sem }()
            processMessage(m.Value)
            sess.MarkMessage(m, "")
        }(msg)
    }
    return nil
}
```

**Lưu ý**: Async consumer phá vỡ ordering guarantee. Chỉ dùng khi ordering không quan trọng.

---

**See also**: [Shared Message Queues Theory](../../shared/02-system-design/05-message-queues.md) | [Resilience Patterns](./07-resilience-patterns.md) | [Distributed Patterns](../04-be-system-design/04-distributed-patterns.md)

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                                                | Difficulty | Core Concept    | Key Signal                                             |
| --- | ------------------------------------------------------- | ---------- | --------------- | ------------------------------------------------------ |
| Q1  | How do you implement a robust Kafka consumer in Go?     | 🟡 Mid     | Kafka Consumer  | manual commit + graceful shutdown + rebalance handling |
| Q2  | How do you implement a Kafka producer with retry in Go? | 🟡 Mid     | Kafka Producer  | WaitForAll + idempotent + key-based partitioning       |
| Q3  | How do you implement a Dead Letter Queue in Go?         | 🟢→🔴      | DLQ             | retry count header + DLQ topic + commit after DLQ send |
| Q4  | Implement a RabbitMQ worker with reconnection in Go     | 🟡 Mid     | RabbitMQ        | Qos prefetch + NotifyClose + Nack/requeue              |
| Q5  | When would you choose Kafka vs RabbitMQ vs Redis?       | 🔴 Senior  | Queue Selection | durability vs latency vs operational cost trade-off    |
| Q6  | Consumer is falling behind — how to debug and fix?      | 🔴 Senior  | Consumer Lag    | lag per partition + hot partition + scaling strategy   |

**Distribution:** 🟢 1 | 🟡 3 | 🔴 2

---

## ⚡ Cold Call Simulation / Mô Phỏng Cold Call

**Scenario:** "Your team's Kafka consumer is 2 hours behind in lag during a flash sale. Describe your debugging approach."

**30-Second Answer:**
"First, I check consumer lag per partition using `kafka-consumer-groups --describe`. If lag is concentrated on a few partitions, it's a hot partition problem — bad key distribution. If lag is even across all partitions, the processing itself is slow. For hot partitions: re-key or add sub-partitions. For slow processing: profile the consumer — usually it's a downstream DB query or external API call. Quick fix: increase parallelism with bounded goroutines (semaphore pattern). If consumers already equal partitions, I need to increase partition count, understanding that ordering guarantees break during migration."

**Follow-up:** "How would you implement exactly-once delivery for payment events?"
→ "Transactional outbox pattern: write payment record + outbox row in same DB transaction. Poller reads outbox, publishes to Kafka with idempotent producer. Consumer deduplicates using payment ID. This gives end-to-end exactly-once semantics without Kafka transactions."

---

## Self-Check / Tự Kiểm Tra

**Instructions:** Cover the answers, try to recall from memory. Check key points after.

| #   | Question                                                         | Key Points to Recall                                                                              |
| --- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | Why does committing offset before processing cause message loss? | Crash after commit but before processing → message skipped → never reprocessed                    |
| 2   | What is the hard limit for consumers in a consumer group?        | consumers ≤ partitions; extra consumers sit idle; each partition assigned to exactly one consumer |
| 3   | When should you use DLQ instead of infinite retry?               | Poison messages block partition → DLQ isolates → alert + human inspect → fix and replay           |
| 4   | What are the three key RabbitMQ reliability settings?            | Durable queue + persistent messages + manual ACK + publisher confirms                             |
| 5   | Why does Grab use Kafka, RabbitMQ, AND Redis?                    | Different durability/latency/ordering requirements → event bus vs task queue vs real-time         |
| 6   | How do you fix hot partition problem?                            | Identify via per-partition lag → re-key for better distribution OR add sub-partitions             |
| 7   | What is the outbox pattern and why is it needed?                 | DB write + outbox row in same tx → poller publishes → avoids dual-write inconsistency             |

### 📅 Spaced Repetition Schedule

| Round | When   | Focus                                                              |
| ----- | ------ | ------------------------------------------------------------------ |
| 1     | Day 1  | Read all Memory Hooks, redraw Concept Map                          |
| 2     | Day 3  | Answer Self-Check from memory, review Common Mistakes              |
| 3     | Day 7  | Cold Call practice, explain Kafka vs RabbitMQ decision to a friend |
| 4     | Day 14 | Full Interview Q&A walkthrough, implement consumer from memory     |
| 5     | Day 30 | Review only what you got wrong in Round 4                          |

---

## Connections / Liên Kết

**Same-track links:**

- ⬅️ [Distributed Systems](./03-distributed-systems.md) — CAP theorem explains why queues trade consistency for availability
- ⬅️ [Resilience Patterns](./07-resilience-patterns.md) — DLQ and circuit breaker as resilience mechanisms
- ➡️ [Microservices](./02-microservices.md) — Event-driven architecture uses message queues as backbone
- ➡️ [gRPC & Protobuf](./09-grpc-protobuf.md) — Sync (gRPC) vs async (MQ) communication trade-off
- ➡️ [API Design](./01-api-design.md) — API gateway routes to both sync services and async queues

**Cross-track links:**

- 🔗 [Shared Message Queues Theory](../../shared/02-system-design/05-message-queues.md) — Architecture deep dive and delivery semantics
- 🔗 [Distributed Patterns](../04-be-system-design/04-distributed-patterns.md) — Saga pattern uses queues for cross-service transactions
- 🔗 [Go Concurrency](../01-golang/03-concurrency.md) — Channel patterns mirror queue consumer patterns
