# Message Queues & Event Streaming / Hàng Đợi Tin Nhắn và Event Streaming

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [System Design Theory](./system-design-theory.md) | [Replication & Partitioning](./replication-partitioning.md)
> **See also**: [BE Message Queues](../../be-track/02-backend-knowledge/08-message-queues.md) | [Distributed Systems](../../be-track/02-backend-knowledge/03-distributed-systems.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee Order Service (thực tế):** Khi user đặt hàng, hệ thống cần: (1) trừ inventory, (2) charge payment, (3) gửi email xác nhận, (4) notify warehouse. Nếu gọi synchronous, một bước chậm → toàn bộ request timeout. Sau khi migrate sang event-driven: Order service emit `OrderCreated` event vào Kafka → 4 services consume independently, retry riêng biệt khi fail. Response time: 2s → 150ms.

**Bài học:** Message queue giải quyết temporal coupling — producer và consumer không cần online cùng lúc. Nhưng tạo ra eventual consistency — cần thiết kế idempotency từ đầu.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Message queue giống hệ thống phiếu đặt đồ ăn ở nhà hàng: khách (producer) đưa phiếu cho cashier (broker), bếp (consumer) lấy phiếu theo thứ tự. Khách không cần chờ bếp nấu xong mới ngồi xuống. Kafka là nhà hàng lưu lại _toàn bộ lịch sử phiếu_ (log-based) — bếp mới có thể đọc lại từ đầu.

**Why it matters:** Mọi hệ thống scale > 1 service đều cần async communication. Biết Kafka vs RabbitMQ, at-least-once vs exactly-once, và Saga pattern là kiến thức bắt buộc cho Senior Backend.

---

## Overview / Tổng Quan

Message queues và event streaming là backbone của distributed systems hiện đại — cho phép decoupling các services, xử lý async, và scale độc lập.

**Two paradigms:**

- **Message Queue** (RabbitMQ, SQS): point-to-point, consumer nhận và xóa message
- **Event Stream** (Kafka, Kinesis): log bất biến, nhiều consumer đọc độc lập, retain theo thời gian

## Concept Map / Bản Đồ Khái Niệm

```
         ┌──────────────────────────┐
         │   MESSAGE QUEUE vs       │
         │   EVENT STREAM           │
         │   (paradigm choice)      │
         └──────────┬───────────────┘
                    │
         ┌──────────▼───────────────┐
         │  KAFKA ARCHITECTURE      │
         │  Partition │ Consumer Grp│
         │  Offset │ Replication    │
         └──────┬──────────────┬────┘
                │              │
    ┌───────────▼────┐   ┌────▼──────────────┐
    │ DELIVERY       │   │ KAFKA vs RABBIT   │
    │ SEMANTICS      │   │ vs REDIS PUB/SUB  │
    │ at-least-once  │   │ (decision matrix) │
    └───────┬────────┘   └──────────────────┘
            │
   ┌────────▼─────────────────────────┐
   │  PATTERNS                        │
   │  Outbox │ Saga │ DLQ │ CDC      │
   └──────────────────────────────────┘
```

| #   | Concept / Khái niệm            | Role / Vai trò                                          | Interview Weight |
| --- | ------------------------------ | ------------------------------------------------------- | ---------------- |
| 1   | **Queue vs Stream Paradigm**   | Khi nào point-to-point vs log-based                     | ⭐⭐⭐⭐         |
| 2   | **Kafka Architecture**         | Partitions, consumer groups, replication, offsets       | ⭐⭐⭐⭐⭐       |
| 3   | **Delivery Semantics**         | At-most-once, at-least-once, exactly-once + idempotency | ⭐⭐⭐⭐⭐       |
| 4   | **Kafka vs RabbitMQ vs Redis** | Decision framework cho tool selection                   | ⭐⭐⭐⭐         |
| 5   | **Outbox Pattern**             | Solve dual-write problem — DB + event atomically        | ⭐⭐⭐⭐⭐       |
| 6   | **Saga Pattern**               | Distributed transactions via compensating events        | ⭐⭐⭐⭐⭐       |
| 7   | **Dead Letter Queue**          | Safety net cho poison pill messages                     | ⭐⭐⭐⭐         |

**Relationship:** Kafka architecture (partitions/offsets) → enables delivery semantics (commit control) → Outbox pattern guarantees event emission → Saga orchestrates multi-service flows → DLQ catches failures.

---

## Core Concepts — Phase 2 Deep Treatment

### Concept 1: Queue vs Stream Paradigm

🪝 **Memory Hook:** "Queue = lấy vé rồi xé bỏ (consumed once). Stream = cuộn phim — ai cũng có thể xem lại"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Hai mô hình cho 2 use cases khác nhau: task distribution (queue) vs event history (stream)
- **Level 2:** Queue (RabbitMQ/SQS): message consumed → deleted → chỉ 1 consumer nhận. Stream (Kafka): append-only log → retained → multiple consumer groups read independently at own pace

**Layer 1 — Analogy:** Queue = quầy lấy số: bạn lấy số 42, không ai khác lấy số 42. Stream = tạp chí có số: mọi người đều đọc số 42, bạn đọc tháng trước cũng được.

**Layer 2 — Mechanics:**

```
Queue (RabbitMQ):                    Stream (Kafka):
Producer → [Q] → Consumer A         Producer → [Log: 0,1,2,3,4...]
  Message deleted after ACK            → Consumer Group A (offset=3)
  Only 1 consumer gets each msg        → Consumer Group B (offset=1)
  No replay possible                   → Consumer Group C (offset=4)
                                       Replay possible (reset offset)
```

**Layer 3 — Edge Cases:** Queue: message lost if consumer crashes before ACK → use manual ACK + DLQ. Stream: consumer falls behind → lag builds up → may need to skip or scale consumers.

| Sai lầm                           | Tại sao sai                                   | Đúng là                                                |
| --------------------------------- | --------------------------------------------- | ------------------------------------------------------ |
| "Kafka is just a faster RabbitMQ" | Different paradigms: log vs queue             | Choose based on replay/multi-consumer needs, not speed |
| "Queue can replay messages"       | Messages deleted after consumption            | Use Kafka if replay needed                             |
| "Stream is always better"         | More complex, overkill for simple task queues | RabbitMQ simpler for task distribution                 |

🎯 **Interview Pattern:** "Queue vs stream?" → Queue: task distribution, consumed once, simple. Stream: event log, replay, multi-consumer. Choose queue for job workers, stream for event-driven architecture.

🔗 **Knowledge Chain:** Paradigm choice → Architecture decisions → Consumer patterns → Scale model

---

### Concept 2: Kafka Architecture

🪝 **Memory Hook:** "Kafka = 3 chữ P: Partition (parallelism), Producer (push), Pull (consumer pulls)"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Need distributed, fault-tolerant, high-throughput event log
- **Level 2:** Partition = unit of parallelism and ordering. Consumer group = collaborative consumption. Replication = fault tolerance. Sequential I/O + zero-copy + batching = throughput

**Layer 1 — Analogy:** Kafka topic = thư viện có nhiều kệ sách (partitions). Mỗi kệ = 1 thứ tự riêng. Consumer group = team đọc sách: mỗi người đọc 1 kệ, không ai đọc trùng kệ.

**Layer 2 — Mechanics:**

```
Topic "orders" with 3 partitions:
┌─────────────────────────────────────────┐
│ P0: [msg0, msg3, msg6, msg9...]         │
│ P1: [msg1, msg4, msg7, msg10...]        │
│ P2: [msg2, msg5, msg8, msg11...]        │
│                                         │
│ Each partition: 1 leader + N followers  │
│ Leader handles reads/writes             │
│ Follower sync for fault tolerance       │
│                                         │
│ Consumer Group A: 3 consumers           │
│   C1 ← P0, C2 ← P1, C3 ← P2          │
│ Consumer Group B: 2 consumers           │
│   C1 ← P0+P1, C2 ← P2                 │
└─────────────────────────────────────────┘

Performance secrets:
  Sequential disk I/O → 600MB/s
  Zero-copy (sendfile) → skip user space
  Batching + compression → network efficiency
```

**Layer 3 — Edge Cases:** More consumers than partitions → extras idle. Rebalancing pauses all consumption. Partition count can only increase (never decrease). Key-based partitioning: null key → round-robin, same key → same partition (ordering guarantee).

| Sai lầm                                             | Tại sao sai                            | Đúng là                                    |
| --------------------------------------------------- | -------------------------------------- | ------------------------------------------ |
| "Adding more consumers always increases throughput" | Max consumers = partition count        | Must increase partitions first             |
| "Kafka ordering is global"                          | Only per-partition ordering guaranteed | Use message key for ordering within entity |
| "Kafka stores everything in memory"                 | Disk-based with OS page cache          | Sequential I/O makes disk fast enough      |

🎯 **Interview Pattern:** "How does Kafka achieve high throughput?" → 3 keys: sequential disk I/O (append-only), zero-copy (sendfile syscall), batching + compression. Partition = parallelism unit.

🔗 **Knowledge Chain:** Kafka partitions → Consumer groups → Rebalancing → Offset management → Delivery semantics

---

### Concept 3: Delivery Semantics

🪝 **Memory Hook:** "At-LEAST-once = 'có thể nhận 2 lần, nhưng không mất'. IDEMPOTENT consumer = 'nhận 2 lần cũng OK'"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Network failures → message may be delivered 0, 1, or >1 times → need to choose guarantee
- **Level 2:** At-most-once (commit before process) → may lose. At-least-once (commit after process) → may duplicate. Exactly-once (Kafka transactions) → complex + overhead. Practical default: at-least-once + idempotent consumer

**Layer 1 — Analogy:** At-most-once = gửi thư không bảo đảm (có thể mất). At-least-once = gửi bảo đảm (có thể gửi 2 lần nếu bưu điện không chắc). Exactly-once = gửi bảo đảm + check tracking number (chắc chắn đúng 1 lần).

**Layer 2 — Mechanics:**

```
At-most-once:    commit offset → process → if crash: message lost ❌
At-least-once:   process → commit offset → if crash: reprocess (dup) ⚠️
Exactly-once:    Kafka TX: produce + commit offset atomically → ✅

Idempotent Consumer Pattern:
┌─────────────────────────────────────┐
│ 1. Read message (msg_id = "abc123") │
│ 2. Check dedup table: EXISTS?       │
│    YES → skip (already processed)   │
│    NO → process + INSERT dedup      │
│ 3. Commit offset                    │
│                                     │
│ Dedup key options:                  │
│   - Kafka message ID               │
│   - Business ID (order_id)         │
│   - Hash of message content         │
└─────────────────────────────────────┘
```

**Layer 3 — Edge Cases:** Exactly-once only works within Kafka (produce to output topic + commit offset). Cross-system exactly-once impossible — need idempotency. Dedup table TTL: can't store forever → 7-day window typical.

| Sai lầm                               | Tại sao sai                                     | Đúng là                                            |
| ------------------------------------- | ----------------------------------------------- | -------------------------------------------------- |
| "Exactly-once is always best"         | High overhead, only works within Kafka          | At-least-once + idempotent is practical default    |
| "At-least-once means data corruption" | Only means duplicates, not wrong data           | Idempotent consumer handles duplicates safely      |
| "Dedup table is simple"               | Needs TTL, distributed dedup for multi-consumer | Use Redis or DB with expiry, partition-level dedup |

🎯 **Interview Pattern:** "How do you handle duplicate messages?" → At-least-once delivery + idempotent consumer (dedup by message/business ID). Exactly-once only within Kafka; cross-system needs idempotency.

🔗 **Knowledge Chain:** Delivery semantics → Idempotent consumer → Outbox pattern → Saga compensation

---

### Concept 4: Kafka vs RabbitMQ vs Redis Pub/Sub

🪝 **Memory Hook:** "Kafka = log warehouse (replay). Rabbit = post office (routing). Redis = megaphone (fire-and-forget)"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Different tools for different communication patterns
- **Level 2:** Kafka: log-based, retain, replay, millions/sec. RabbitMQ: queue-based, complex routing, push-based, ~50K/sec. Redis Pub/Sub: in-memory, no persistence, ultra-low latency

**Layer 1 — Analogy:** Kafka = kho hàng có camera (mọi thứ được ghi lại). RabbitMQ = bưu điện (routing packages to right address). Redis = loa phát thanh (ai nghe thì nghe, không lưu lại).

**Layer 2 — Mechanics:**

```
Decision Matrix:
┌────────────┬────────────┬────────────┬────────────┐
│ Need       │ Kafka      │ RabbitMQ   │ Redis      │
├────────────┼────────────┼────────────┼────────────┤
│ Replay     │ ✅ Native   │ ❌          │ ❌          │
│ Routing    │ ❌ Basic    │ ✅ Advanced │ ❌          │
│ Scale      │ ✅ Millions │ ⚠️ 50K/s   │ ✅ In-mem  │
│ Persist    │ ✅ Days     │ ✅ Until ACK│ ❌          │
│ Multi-cons │ ✅ Groups   │ ⚠️ Limited │ ✅ Pub/Sub │
│ Latency    │ ⚠️ ms      │ ⚠️ ms      │ ✅ sub-ms  │
└────────────┴────────────┴────────────┴────────────┘
```

**Layer 3 — Edge Cases:** Kafka for small teams: operational overhead high (ZK/KRaft, topics, partitions). RabbitMQ: message size limit, no native replay. Redis: subscriber offline = messages lost permanently. Cloud alternatives: SQS+SNS (AWS), Pub/Sub (GCP), Event Hubs (Azure).

| Sai lầm                              | Tại sao sai                                        | Đúng là                                                 |
| ------------------------------------ | -------------------------------------------------- | ------------------------------------------------------- |
| "Always use Kafka"                   | Overkill for simple task queues                    | RabbitMQ simpler for job workers                        |
| "Redis Pub/Sub for order processing" | No persistence — messages lost if consumer offline | Use for ephemeral events only (notifications, presence) |
| "RabbitMQ can't scale"               | Can scale with clustering and sharded queues       | 50K/sec is enough for most applications                 |

🎯 **Interview Pattern:** "Kafka vs RabbitMQ?" → Kafka: event log, replay, millions/sec, multiple consumer groups. RabbitMQ: task queue, complex routing, simpler ops. Decision: replay needed? → Kafka. Complex routing? → RabbitMQ. Ephemeral? → Redis.

🔗 **Knowledge Chain:** Tool selection → Architecture pattern → Scaling model → Operational cost

---

### Concept 5: Outbox Pattern

🪝 **Memory Hook:** "Outbox = 'hộp thư đi' trong DB — ghi cùng transaction, gửi ra sau"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Can't atomically update DB AND publish event → dual-write problem
- **Level 2:** Solution: write event to outbox table in SAME DB transaction → separate process (CDC/polling) reads outbox → publishes to Kafka. Atomic because same DB transaction.

**Layer 1 — Analogy:** Viết thư và bỏ vào hộp thư đi trên bàn (cùng lúc ghi sổ). Bưu tá đến lấy thư sau. Nếu bưu tá chưa đến, thư vẫn nằm đó — không bao giờ mất.

**Layer 2 — Mechanics:**

```
Dual-Write Problem:
  1. UPDATE orders SET status='paid'  ✅
  2. kafka.publish('order.paid')      ❌ crash → event lost!

Outbox Pattern:
  BEGIN TRANSACTION;
    UPDATE orders SET status='paid';
    INSERT INTO outbox (type, payload, created_at)
      VALUES ('order.paid', '{"id":123}', NOW());
  COMMIT;  ← atomic: both or neither

  CDC Process (Debezium):
    Read WAL → detect outbox INSERT → publish to Kafka
    → idempotent (same event_id → dedup)
```

**Layer 3 — Edge Cases:** CDC lag: outbox row inserted but CDC hasn't published yet → eventual consistency window. Outbox table grows: need TTL/cleanup job. Multiple consumers: CDC publishes same event multiple times during recovery → consumers must be idempotent.

| Sai lầm                                   | Tại sao sai                        | Đúng là                                                   |
| ----------------------------------------- | ---------------------------------- | --------------------------------------------------------- |
| "Just use distributed transaction (2PC)"  | 2PC doesn't work across DB + Kafka | Outbox keeps everything in DB transaction                 |
| "Polling outbox table is fine"            | Polling has latency + DB overhead  | CDC (Debezium) reads WAL — real-time, no polling overhead |
| "Outbox guarantees exactly-once delivery" | CDC may replay on restart          | Consumers must be idempotent regardless                   |

🎯 **Interview Pattern:** "How to atomically update DB and publish event?" → Outbox pattern: write event to outbox table in same DB transaction. CDC (Debezium) reads WAL → publishes to Kafka. No distributed transaction needed.

🔗 **Knowledge Chain:** Dual-write problem → Outbox pattern → CDC (Debezium) → Saga orchestration → Event sourcing

---

### Concept 6: Saga Pattern

🪝 **Memory Hook:** "Saga = chuỗi domino — mỗi quân đổ kích hoạt quân tiếp theo. Quân đổ sai → dọn ngược lại (compensate)"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Distributed transactions (2PC) don't scale → need alternative for cross-service consistency
- **Level 2:** Saga: sequence of local transactions + compensating actions. Two styles: choreography (event-driven, decentralized) vs orchestration (centralized coordinator)

**Layer 1 — Analogy:** Đặt tour du lịch: book vé máy bay → book khách sạn → book xe. Nếu xe hết → hủy khách sạn → hủy vé máy bay (compensate ngược lại).

**Layer 2 — Mechanics:**

```
Choreography:
  Order → event:created → Payment → event:paid → Inventory → event:reserved
  If Inventory fails → event:reserve_failed → Payment:refund → Order:cancel

Orchestration:
  Orchestrator → Payment.charge() → OK
              → Inventory.reserve() → OK
              → Shipping.ship() → FAIL
              → Inventory.release() (compensate)
              → Payment.refund() (compensate)
```

**Layer 3 — Edge Cases:** Choreography: hard to debug (events scatter across services). Orchestration: orchestrator = single point of failure → need to make stateless + idempotent. Both: compensations can fail too → need retry + alert.

| Sai lầm                         | Tại sao sai                                                | Đúng là                                                    |
| ------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| "Saga = 2PC"                    | 2PC blocks all participants; Saga is eventually consistent | Saga uses compensating actions, not distributed locks      |
| "Choreography is always better" | Hard to debug, easy to create circular dependencies        | Orchestration better for complex flows with clear rollback |
| "Compensation always succeeds"  | Network failures affect compensation too                   | Compensations must be idempotent + retried                 |

🎯 **Interview Pattern:** "How to handle distributed transactions?" → Saga pattern. Choreography for simple flows (event-driven). Orchestration for complex flows (centralized control). Each step: idempotent + compensatable.

🔗 **Knowledge Chain:** 2PC limitations → Saga → Choreography vs Orchestration → Idempotency → Outbox for reliable event emission

---

### Concept 7: Dead Letter Queue (DLQ)

🪝 **Memory Hook:** "DLQ = phòng cấp cứu cho messages — nơi messages 'bệnh' (poison pill) được cách ly"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Poison pill message (malformed, unprocessable) → infinite retry → blocks entire queue
- **Level 2:** DLQ isolates failed messages after N retries. Enables: investigation, fix, redrive. Without DLQ: one bad message blocks all subsequent messages in queue

**Layer 1 — Analogy:** Assembly line: defective product keeps failing inspection → infinite loop → blocks entire line. DLQ = remove defective product to side shelf → line continues → fix defect later.

**Layer 2 — Mechanics:**

```
Normal: Producer → Queue → Consumer → ACK → done
DLQ:    Producer → Queue → Consumer → NACK
                         → retry 1 → NACK
                         → retry 2 → NACK
                         → retry 3 → NACK
                         → → DLQ (isolated)
                         → alert team
                         → fix bug → redrive from DLQ
```

**Layer 3 — Edge Cases:** Kafka has no native DLQ → implement manually (produce to error topic). DLQ messages need metadata (original topic, failure reason, timestamp). Redrive: must be idempotent (message may have been partially processed).

| Sai lầm                        | Tại sao sai                             | Đúng là                                                    |
| ------------------------------ | --------------------------------------- | ---------------------------------------------------------- |
| "DLQ means message is lost"    | DLQ preserves message for investigation | Messages can be redriven after fix                         |
| "Kafka has built-in DLQ"       | Kafka has no native DLQ                 | Implement manually: produce failed messages to error topic |
| "Retry forever instead of DLQ" | Poison pill blocks entire queue         | DLQ isolates bad messages, queue continues                 |

🎯 **Interview Pattern:** "How to handle poison pill messages?" → DLQ after N retries. Alert on DLQ count. Investigate root cause. Fix consumer → redrive. Without DLQ: one bad message blocks everything.

🔗 **Knowledge Chain:** Retry patterns → DLQ → Monitoring/alerting → Redrive → Idempotent reprocessing

---

## 1. Why Message Queues? / Tại Sao Cần Hàng Đợi?

### Q: What problems do message queues solve? / Hàng đợi tin nhắn giải quyết vấn đề gì? 🟢 Junior

**A:** Three core problems:

| Problem            | Without Queue                                              | With Queue                                             |
| ------------------ | ---------------------------------------------------------- | ------------------------------------------------------ |
| **Coupling**       | Service A calls Service B directly — if B is down, A fails | A publishes to queue — B processes when ready          |
| **Speed mismatch** | A produces 10k req/s, B handles 1k req/s → B overwhelmed   | Queue buffers the difference, B drains at its own pace |
| **Reliability**    | Synchronous call fails → data lost                         | Message persisted in queue → retried on failure        |

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

| Term               | Description                                               |
| ------------------ | --------------------------------------------------------- |
| **Producer**       | Publishes messages to queue/topic                         |
| **Consumer**       | Reads and processes messages                              |
| **Queue**          | Ordered buffer, each message consumed once                |
| **Topic**          | Named stream; multiple consumer groups read independently |
| **Partition**      | Topic sharded for parallelism; ordered within a partition |
| **Offset**         | Consumer's position in a partition (Kafka)                |
| **Consumer Group** | Group of consumers sharing work across partitions         |

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

| Semantic          | How                                     | Risk                                                |
| ----------------- | --------------------------------------- | --------------------------------------------------- |
| **At-most-once**  | Commit offset before processing         | Message lost if processing fails                    |
| **At-least-once** | Commit offset after processing          | Message duplicated if commit fails after processing |
| **Exactly-once**  | Idempotent producer + transactional API | Overhead, complexity                                |

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

| Feature            | Kafka                              | RabbitMQ                        | Redis Pub/Sub                             |
| ------------------ | ---------------------------------- | ------------------------------- | ----------------------------------------- |
| **Model**          | Append-only log                    | Queue (push-based)              | Fire-and-forget                           |
| **Retention**      | Days/weeks (configurable)          | Until consumed                  | None (no persistence)                     |
| **Throughput**     | Millions/sec                       | ~50k/sec                        | Very high (in-memory)                     |
| **Consumer model** | Pull, any consumer re-reads        | Push, message deleted after ACK | All subscribers get it simultaneously     |
| **Ordering**       | Per partition                      | Per queue                       | No guarantee                              |
| **Best for**       | Event streaming, audit log, replay | Task queues, RPC, routing       | Real-time notifications, ephemeral events |

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

|               | Choreography                 | Orchestration                   |
| ------------- | ---------------------------- | ------------------------------- |
| **Coupling**  | Low (event-driven)           | Higher (orchestrator knows all) |
| **Debugging** | Hard (trace across services) | Easy (one place to look)        |
| **Best for**  | Simple flows, many services  | Complex flows, clear rollback   |

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

| Question                                        | Level | Key Answer                                                                     |
| ----------------------------------------------- | ----- | ------------------------------------------------------------------------------ |
| Why use a message queue?                        | 🟢    | Decouple, buffer speed mismatch, reliability                                   |
| Kafka partition vs queue?                       | 🟢    | Partition = ordered log, multiple consumers; Queue = consumed once             |
| Why can't I add more consumers than partitions? | 🟡    | Partition = unit of parallelism — extras idle                                  |
| At-least-once vs exactly-once?                  | 🟡    | At-least-once + idempotent consumer is practical default                       |
| Kafka vs RabbitMQ?                              | 🟡    | Kafka = log/replay/scale; Rabbit = routing/tasks/simplicity                    |
| Dead Letter Queue?                              | 🟡    | Safety net for poison pill messages — N retries exceeded → DLQ                 |
| Outbox pattern?                                 | 🔴    | Solve dual-write: DB tx + outbox table, CDC publishes to Kafka                 |
| Saga pattern?                                   | 🔴    | Distributed transactions via compensating steps; choreography vs orchestration |

---

**See also**: [BE Message Queues (Go)](../../be-track/02-backend-knowledge/08-message-queues.md) | [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md) | [Replication & Partitioning](./replication-partitioning.md)

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                              | Difficulty | Core Concept       | Key Signal                                     |
| --- | ------------------------------------- | ---------- | ------------------ | ---------------------------------------------- |
| 1   | Why use a message queue?              | 🟢         | Queue vs Stream    | Decouple, buffer, reliability                  |
| 2   | Producer, Consumer, Topic, Partition? | 🟢         | Kafka Architecture | Partition = parallelism unit                   |
| 3   | Kafka high throughput how?            | 🟡         | Kafka Architecture | Sequential I/O, zero-copy, batching            |
| 4   | Consumer Group + rebalancing?         | 🟡         | Kafka Architecture | Partition = max consumers, static membership   |
| 5   | Delivery semantics?                   | 🔴         | Delivery Semantics | At-least-once + idempotent = practical default |
| 6   | Kafka vs RabbitMQ vs Redis?           | 🟡         | Tool Selection     | Log/replay vs routing vs ephemeral             |
| 7   | Outbox pattern?                       | 🔴         | Outbox Pattern     | Same DB transaction, CDC publishes             |
| 8   | Saga pattern?                         | 🔴         | Saga Pattern       | Choreography vs orchestration, compensate      |
| 9   | Dead Letter Queue?                    | 🟡         | DLQ                | N retries → isolate, alert, fix, redrive       |

**Distribution:** 🟢 2 | 🟡 4 | 🔴 3

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn Bất Ngờ

**"Your Kafka consumer group shows 2-hour lag during a flash sale. The consumer count equals partition count. What do you do?"**

> **30-second answer:** "If consumer count already equals partitions, adding more consumers won't help — extras idle. Three immediate actions: (1) Check if consumers are slow due to downstream bottleneck (DB, API call), (2) Increase partition count and add consumers proportionally, (3) Optimize consumer processing — batch DB writes, reduce per-message processing time. Long term: consider async processing of non-critical steps within the consumer."

**Follow-up:** "How would you handle exactly-once for payment processing?"

> "Don't rely on Kafka exactly-once for cross-system guarantee. Use at-least-once + idempotent consumer: each payment has unique idempotency_key. Before processing, check dedup table. If already processed, skip. If not, process + insert dedup in same DB transaction. This is how Stripe and Grab handle payment idempotency."

---

## Self-Check / Tự Kiểm Tra

_Close this document and answer from memory:_

| #   | Type           | Question                                                                    | Key Points                                                             |
| --- | -------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Why can't you add more consumers than partitions in Kafka?                  | Partition = unit of parallelism, one partition → one consumer in group |
| 2   | 🎨 Visual      | Draw the Outbox pattern flow (DB transaction → CDC → Kafka)                 | Same-tx write to orders + outbox; CDC reads WAL → publishes            |
| 3   | 🛠️ Application | Design idempotent consumer for payment processing                           | Dedup by payment_id in DB; check before process; same-tx               |
| 4   | 🐛 Debug       | Consumer lag growing despite enough consumers — diagnose                    | Slow downstream, GC pauses, rebalancing storms, commit frequency       |
| 5   | 🗣️ Teach       | Explain to a junior why "fire-and-forget" Redis Pub/Sub can't replace Kafka | No persistence, no replay, subscriber offline = lost                   |

💬 **Feynman Prompt:** Giải thích tại sao Kafka lưu messages như log (không xóa sau khi consume) — và lợi ích cụ thể là gì khi cần replay events.

---

## 📅 Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | When          | Focus                                            |
| ----- | ------------- | ------------------------------------------------ |
| 1     | Day 1 (today) | Read all Core Concepts, do Self-Check            |
| 2     | Day 3         | Kafka architecture + delivery semantics          |
| 3     | Day 7         | Outbox pattern + Saga walkthrough                |
| 4     | Day 14        | Cold Call simulation, Kafka vs RabbitMQ decision |
| 5     | Day 30        | Full review, design event-driven order system    |

---

## Connections / Liên Kết

**Same track / Cùng track:**

- ➡️ [System Design Theory](./system-design-theory.md) — async communication patterns
- ➡️ [Event Sourcing & CQRS](./07-event-sourcing-cqrs.md) — events published to message queues
- ➡️ [Replication & Partitioning](./replication-partitioning.md) — Kafka replication model
- ➡️ [Consensus Algorithms](./consensus-algorithms.md) — Kafka KRaft uses Raft
- ➡️ [Caching Patterns](./caching-patterns.md) — cache invalidation via events

**Cross track / Liên track:**

- 🔗 [BE Message Queues Go](../../be-track/02-backend-knowledge/08-message-queues.md) — Go-specific consumer patterns
- 🔗 [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md) — Saga uses message queues
- 🔗 [Distributed Systems](../../be-track/02-backend-knowledge/03-distributed-systems.md) — async messaging in distributed context
