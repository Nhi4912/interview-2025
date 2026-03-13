# Message Queues in Go / Hàng Đợi Tin Nhắn với Go

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Distributed Systems](./03-distributed-systems.md) | [Resilience Patterns](./07-resilience-patterns.md)
> **See also**: [Shared Message Queues Theory](../../shared/02-system-design/05-message-queues.md) | [Distributed Patterns](../04-be-system-design/04-distributed-patterns.md)

---

## Overview / Tổng Quan

Phần này tập trung vào **implementation và production patterns** với Go — Kafka consumer, RabbitMQ worker, và các patterns phổ biến khi dùng message queues ở backend Go.

Lý thuyết nền (Kafka architecture, at-least-once vs exactly-once, Saga pattern): xem [Shared Message Queues](../../shared/02-system-design/05-message-queues.md).

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

| Scenario | Choice | Why |
|----------|--------|-----|
| Ride booking events (Grab-style) | **Kafka** | Multiple consumers (analytics, billing, driver app), need replay |
| Order processing pipeline | **RabbitMQ** | Complex routing (country → warehouse), DLQ built-in, simpler ops |
| Live location updates (driver → map) | **Redis Pub/Sub** | Ultra-low latency, ephemeral — old locations irrelevant |
| Audit log / compliance | **Kafka** | Immutable log, long retention, queryable via Kafka Streams |
| Email/notification worker | **RabbitMQ or SQS** | Simple task queue, at-most-once acceptable |

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
