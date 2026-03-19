# Message Queues & Event Streaming / Hàng Đợi Tin Nhắn và Event Streaming

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [System Design Theory](./system-design-theory.md) | [Replication & Partitioning](./replication-partitioning.md)
> **See also**: [BE Message Queues](../../be-track/02-backend-knowledge/08-message-queues.md) | [Distributed Systems](../../be-track/02-backend-knowledge/03-distributed-systems.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee Order Service (thực tế):** Khi user đặt hàng, hệ thống cần: (1) trừ inventory, (2) charge payment, (3) gửi email xác nhận, (4) notify warehouse. Nếu gọi synchronous, một bước chậm → toàn bộ request timeout. Sau khi migrate sang event-driven: Order service emit `OrderCreated` event vào Kafka → 4 services consume independently, retry riêng biệt khi fail. Response time: 2s → 150ms.

**Bài học:** Message queue giải quyết temporal coupling — producer và consumer không cần online cùng lúc. Nhưng tạo ra eventual consistency — cần thiết kế idempotency từ đầu.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Message queue giống hệ thống phiếu đặt đồ ăn ở nhà hàng: khách (producer) đưa phiếu cho cashier (broker), bếp (consumer) lấy phiếu theo thứ tự. Khách không cần chờ bếp nấu xong mới ngồi xuống. Kafka là nhà hàng lưu lại *toàn bộ lịch sử phiếu* (log-based) — bếp mới có thể đọc lại từ đầu.

**Why it matters:** Mọi hệ thống scale > 1 service đều cần async communication. Biết Kafka vs RabbitMQ, at-least-once vs exactly-once, và Saga pattern là kiến thức bắt buộc cho Senior Backend.

---

## Overview / Tổng Quan

Message queues và event streaming là backbone của distributed systems hiện đại — cho phép decoupling các services, xử lý async, và scale độc lập.

**Two paradigms:**
- **Message Queue** (RabbitMQ, SQS): point-to-point, consumer nhận và xóa message
- **Event Stream** (Kafka, Kinesis): log bất biến, nhiều consumer đọc độc lập, retain theo thời gian

---

## 1. Why Message Queues? / Tại Sao Cần Hàng Đợi?

### Q: What problems do message queues solve? / Hàng đợi tin nhắn giải quyết vấn đề gì? 🟢 Junior

**A:** Three core problems:

| Problem | Without Queue | With Queue |
|---------|--------------|------------|
| **Coupling** | Service A calls Service B directly — if B is down, A fails | A publishes to queue — B processes when ready |
| **Speed mismatch** | A produces 10k req/s, B handles 1k req/s → B overwhelmed | Queue buffers the difference, B drains at its own pace |
| **Reliability** | Synchronous call fails → data lost | Message persisted in queue → retried on failure |

**Giải thích**: Hàng đợi tách biệt producer và consumer theo 3 chiều: thời gian (async), tốc độ (buffer), độ tin cậy (persist + retry). Không cần cả hai bên cùng sống/cùng tốc độ.

---

## 2. Core Concepts / Khái Niệm Cốt Lõi

### Q: Explain Producer, Consumer, Queue, Topic, Partition. 🟢 Junior

**A:**

```
QUEUE MODEL (RabbitMQ, SQS):
Producer → [Queue] → Consumer A (message consumed and deleted)

TOPIC/STREAM MODEL (Kafka):
Producer → [Topic: Partition 0] → Consumer Group A (offset 5)
                [Partition 1] → Consumer Group B (offset 3)
                [Partition 2] → Consumer Group C (offset 8)
```

| Term | Description |
|------|-------------|
| **Producer** | Publishes messages to queue/topic |
| **Consumer** | Reads and processes messages |
| **Queue** | Ordered buffer, each message consumed once |
| **Topic** | Named stream; multiple consumer groups read independently |
| **Partition** | Topic sharded for parallelism; ordered within a partition |
| **Offset** | Consumer's position in a partition (Kafka) |
| **Consumer Group** | Group of consumers sharing work across partitions |

**Điểm mấu chốt**: Partition = đơn vị parallelism trong Kafka. Số partition = số consumer tối đa trong một group đọc song song.

---

## 3. Kafka Deep Dive / Kafka Chi Tiết

### Q: How does Kafka achieve high throughput and durability? 🟡 Mid

**A:** Four design decisions:

**1. Sequential disk I/O (Append-only log)**
Kafka ghi vào cuối file — sequential write = ~600MB/s trên HDD vs ~100MB/s random write. Không xóa message sau khi đọc.

**2. Zero-copy**
Kafka dùng `sendfile()` syscall — data đi thẳng từ page cache → network socket, không qua user space. Giảm CPU ~70%.

**3. Batching + Compression**
Producer batch nhiều message trước khi gửi. Kafka compress toàn batch → throughput tăng, network I/O giảm.

**4. Replication**
Mỗi partition có 1 leader + N-1 followers. Leader xử lý read/write. Follower sync liên tục. Leader chết → follower promote.

```
Broker 1 (Leader P0)  →  Broker 2 (Follower P0)
Broker 2 (Leader P1)  →  Broker 3 (Follower P1)
Broker 3 (Leader P2)  →  Broker 1 (Follower P2)
```

**Cách nhớ**: Kafka nhanh vì 3 điều — sequential write (không random), zero-copy (không qua userspace), batch (không gửi từng message).

---

### Q: What is a Consumer Group and how does rebalancing work? 🟡 Mid

**A:**

**Consumer Group** = multiple consumers sharing work on a topic. Each partition assigned to exactly one consumer in the group.

```
Topic: 6 partitions
Consumer Group A: 3 consumers → each gets 2 partitions
Consumer Group A: 6 consumers → each gets 1 partition
Consumer Group A: 7 consumers → 1 consumer idle (more consumers than partitions)
```

**Rebalancing** triggers when:
- Consumer joins or leaves the group
- New partitions added to topic
- Consumer crashes (detected via heartbeat timeout)

**Impact of rebalancing**: All consumption pauses while partitions reassign. Large groups = slow rebalance. Use static membership (`group.instance.id`) to reduce rebalance frequency.

**Điểm quan trọng phỏng vấn**: "Tại sao tôi thêm consumer nhưng không nhanh hơn?" → vì số partition là giới hạn parallelism. Muốn scale consumer group → phải tăng partition trước.

---

### Q: Explain Kafka's delivery semantics: at-most-once, at-least-once, exactly-once. 🔴 Senior

**A:**

| Semantic | How | Risk |
|----------|-----|------|
| **At-most-once** | Commit offset before processing | Message lost if processing fails |
| **At-least-once** | Commit offset after processing | Message duplicated if commit fails after processing |
| **Exactly-once** | Idempotent producer + transactional API | Overhead, complexity |

**At-least-once** is the default and most practical choice. Make consumers **idempotent** to handle duplicates safely:

```python
# Idempotent consumer pattern
def process_message(msg):
    msg_id = msg.key  # unique per message
    if already_processed(msg_id):  # check dedup table
        return  # skip duplicate
    with transaction():
        do_business_logic(msg)
        mark_as_processed(msg_id)
```

**Exactly-once** via Kafka Transactions:
```java
producer.initTransactions();
producer.beginTransaction();
producer.send(new ProducerRecord<>(outputTopic, key, value));
producer.sendOffsetsToTransaction(offsets, consumerGroup);
producer.commitTransaction();  // atomic: produce + offset commit
```

**Thực tế production**: Hầu hết hệ thống dùng at-least-once + idempotent consumer. Exactly-once tốn overhead và khó debug, chỉ dùng khi thực sự cần (thanh toán, ledger).

---

## 4. RabbitMQ vs Kafka / So Sánh

### Q: When to use Kafka vs RabbitMQ vs Redis Pub/Sub? 🟡 Mid

**A:**

| Feature | Kafka | RabbitMQ | Redis Pub/Sub |
|---------|-------|----------|---------------|
| **Model** | Append-only log | Queue (push-based) | Fire-and-forget |
| **Retention** | Days/weeks (configurable) | Until consumed | None (no persistence) |
| **Throughput** | Millions/sec | ~50k/sec | Very high (in-memory) |
| **Consumer model** | Pull, any consumer re-reads | Push, message deleted after ACK | All subscribers get it simultaneously |
| **Ordering** | Per partition | Per queue | No guarantee |
| **Best for** | Event streaming, audit log, replay | Task queues, RPC, routing | Real-time notifications, ephemeral events |

**Decision framework:**
- Need **replay / audit trail** → Kafka
- Need **complex routing** (topic exchange, fanout, headers) → RabbitMQ
- Need **real-time, ephemeral** (chat, live notifications) → Redis Pub/Sub
- Need **dead letter queue / retry logic** out of the box → RabbitMQ
- Need **massive scale** (millions events/sec) → Kafka

**Ví dụ thực tế**:
- Grab dùng Kafka cho ride events (booking, driver location) vì cần replay và multiple consumer groups
- E-commerce dùng RabbitMQ cho order processing vì cần routing (VN orders → VN warehouse, SG orders → SG warehouse)
- Chat app dùng Redis Pub/Sub cho delivery vì ephemeral, ultra-low latency

---

## 5. System Design Patterns / Mẫu Thiết Kế

### Q: What is the Outbox Pattern and why is it needed? 🔴 Senior

**A:** The Outbox Pattern solves the **dual-write problem**: how to atomically update your database AND publish an event.

**Problem:**
```
# Race condition — what if step 2 fails?
1. UPDATE orders SET status='paid' WHERE id=123  ✓
2. kafka.publish('order.paid', {id: 123})        ✗ crash here → event lost
```

**Solution — Outbox Pattern:**
```sql
-- Step 1: Both in same DB transaction (atomic)
BEGIN;
UPDATE orders SET status='paid' WHERE id=123;
INSERT INTO outbox (event_type, payload) VALUES ('order.paid', '{"id":123}');
COMMIT;

-- Step 2: Separate process reads outbox and publishes to Kafka
-- (can retry safely — message has unique ID for deduplication)
```

```
App DB ──[transaction]──→ orders table + outbox table
                                            ↓
                         CDC / Polling → Kafka
```

**CDC (Change Data Capture)** like Debezium reads the DB write-ahead log and publishes to Kafka — no polling overhead.

**Tại sao quan trọng**: Đây là pattern được hỏi nhiều ở phỏng vấn Senior level. Dual-write không bao giờ atomic — phải dùng outbox hoặc saga để đảm bảo consistency.

---

### Q: Explain the Saga Pattern for distributed transactions. 🔴 Senior

**A:** A Saga is a sequence of local transactions where each step publishes an event to trigger the next, with compensating transactions for rollback.

**Choreography Saga (event-driven):**
```
Order Service    → publishes: order.created
Payment Service  → listens: order.created → publishes: payment.completed
Inventory Service → listens: payment.completed → publishes: stock.reserved
Shipping Service  → listens: stock.reserved → publishes: shipment.created

Failure rollback:
Payment Service  → payment.failed → Order Service listens → order.cancelled
```

**Orchestration Saga (centralized):**
```
Saga Orchestrator controls all steps:
1. → Payment Service: charge()
2. ← success → Inventory Service: reserve()
3. ← success → Shipping Service: ship()
4. ← failure at step 3 → Inventory Service: release() [compensate]
                        → Payment Service: refund() [compensate]
```

| | Choreography | Orchestration |
|--|--|--|
| **Coupling** | Low (event-driven) | Higher (orchestrator knows all) |
| **Debugging** | Hard (trace across services) | Easy (one place to look) |
| **Best for** | Simple flows, many services | Complex flows, clear rollback |

**Thực tế**: Grab/Shopee dùng Saga cho order flow vì không thể có distributed 2PC ở scale đó. Mỗi step phải idempotent và compensatable.

---

## 6. Interview Q&A Summary / Tổng Kết

### Q: What is a Dead Letter Queue (DLQ) and when do messages end up there? / DLQ là gì và khi nào message bị đẩy vào đó? 🟡 Mid

**A:** A Dead Letter Queue receives messages that cannot be processed successfully after N retries, or messages that expired before consumption, or messages rejected by the consumer. It is a safety net to prevent poison pill messages from blocking the main queue indefinitely.

```
Normal flow:
  Producer → Queue → Consumer (success) → message deleted

DLQ flow:
  Producer → Queue → Consumer (fail)
                   → retry 1 (fail)
                   → retry 2 (fail)
                   → retry 3 (fail)
                   → → Dead Letter Queue

  Common DLQ triggers:
  - Max delivery attempts exceeded (RabbitMQ x-max-delivery-count, SQS maxReceiveCount)
  - Message TTL expired before consumption
  - Consumer explicitly rejects/nacks with requeue=false
  - Queue max length exceeded (overflow policy)

  DLQ use cases:
  1. Alert on DLQ → investigate root cause
  2. Fix consumer bug → redrive DLQ messages back to main queue
  3. Audit: preserve failed messages for compliance
  4. Poison pill isolation: one bad message doesn't block entire queue
```

Vietnamese: DLQ là pattern cực kỳ quan trọng trong production. Không có DLQ → một "poison pill" message (message mà consumer không bao giờ xử lý được, ví dụ malformed JSON) sẽ được retry vô tận → consumer bị occupied → queue tắc nghẽn. DLQ cho phép: isolate bad messages, alert team, fix bug, redrive. AWS SQS và RabbitMQ đều có built-in DLQ support. Kafka không có native DLQ — thường implement thủ công bằng cách produce failed message vào topic khác.

---

| Question | Level | Key Answer |
|----------|-------|------------|
| Why use a message queue? | 🟢 | Decouple, buffer speed mismatch, reliability |
| Kafka partition vs queue? | 🟢 | Partition = ordered log, multiple consumers; Queue = consumed once |
| Why can't I add more consumers than partitions? | 🟡 | Partition = unit of parallelism — extras idle |
| At-least-once vs exactly-once? | 🟡 | At-least-once + idempotent consumer is practical default |
| Kafka vs RabbitMQ? | 🟡 | Kafka = log/replay/scale; Rabbit = routing/tasks/simplicity |
| Dead Letter Queue? | 🟡 | Safety net for poison pill messages — N retries exceeded → DLQ |
| Outbox pattern? | 🔴 | Solve dual-write: DB tx + outbox table, CDC publishes to Kafka |
| Saga pattern? | 🔴 | Distributed transactions via compensating steps; choreography vs orchestration |

---

**See also**: [BE Message Queues (Go)](../../be-track/02-backend-knowledge/08-message-queues.md) | [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md) | [Replication & Partitioning](./replication-partitioning.md)

---

## Self-Check / Tự Kiểm Tra

- [ ] Can I explain why "consumers ≤ partitions" is a hard limit in Kafka?
- [ ] Can I describe the Outbox Pattern and why it solves the dual-write problem?
- [ ] Can I compare Kafka and RabbitMQ — use case for each?
- [ ] Can I explain at-least-once delivery and what "idempotent consumer" means?
- 💬 **Feynman Prompt:** Giải thích tại sao Kafka lưu messages như log (không xóa sau khi consume) — và lợi ích cụ thể là gì khi cần replay events.

## Connections / Liên Kết

- ⬅️ **Built on**: [System Design Theory](./system-design-theory.md) — async communication patterns
- ➡️ **Applied in**: [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md) — Saga uses message queues
- ➡️ **Applied in**: [Event Sourcing & CQRS](./07-event-sourcing-cqrs.md) — events published to message queues
- 🔗 **Implementation**: [BE Message Queues Go](../../be-track/02-backend-knowledge/08-message-queues.md) — Go-specific consumer patterns
