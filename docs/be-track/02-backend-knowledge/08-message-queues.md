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

> 🧠 **Memory Hook:** "Offset is a bookmark — commit it before finishing the book, and you lose your page forever."
> _Offset là bookmark — commit trước khi đọc xong trang, bạn mất vị trí mãi mãi._

**❓ Why exists (root-cause tracing):**

- Level 1: Why manual commit? → AutoCommit may commit before processing finishes → message loss on crash
- Level 2: Why consumer groups? → Parallel consumption needs partition assignment coordination → Kafka uses group protocol for rebalance
- Level 3: Why partitions ≤ consumers hard limit? → Each partition is a unit of parallelism, assigning 2 consumers to 1 partition would create duplicate reads

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bạn đọc truyện tranh và dùng bookmark. Khi đọc xong 1 trang, bạn dời bookmark sang trang tiếp. Nếu dời bookmark _trước khi đọc xong_ rồi đèn tắt đột ngột — lần sau mở sách bạn sẽ bỏ qua trang đó mãi mãi. **Kafka offset** giống vậy: chỉ commit (dời bookmark) _sau khi_ xử lý xong message!

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Topic "orders" (3 partitions)
┌──────────────────────────────────────────┐
│ Partition 0: [0][1][2][3]...             │
│                    ↑ committed=2         │
│ Partition 1: [0][1][2]...               │
│               ↑ committed=0             │
│ Partition 2: [0][1][2][3][4]...         │
│                         ↑ committed=4   │
└──────────────────────────────────────────┘
Consumer Group "order-service":
  Consumer A → Partition 0, 1
  Consumer B → Partition 2

Flow mỗi message:
  1. Kafka giao msg → consumer nhận
  2. Consumer xử lý (gọi DB / external API)
  3. Thành công → MarkMessage() đánh dấu offset locally
  4. Sarama flush offset lên Kafka broker (commit)
  5. Crash trước bước 3 → msg được giao lại (at-least-once ✅)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Rebalance storm:** Consumer join/leave nhanh → rebalance liên tục → xử lý bị gián đoạn; dùng `StickyAssignor` để giữ partition assignment ổn định hơn
- **Commit quá thưa vs quá dày:** Commit per-message → overhead RTT mỗi message; commit quá thưa → replay window lớn khi crash; cân bằng ở mỗi 500ms hoặc 100 messages
- **Slow message blocking partition:** 1 message xử lý chậm (external API timeout 30s) → toàn bộ partition bị block; cần timeout per-message + DLQ
- **Offset reset sai:** Consumer group mới chọn `OffsetNewest` → bỏ qua tất cả messages cũ; chọn `OffsetOldest` → replay toàn bộ lịch sử gây data storm
- **AutoCommit race condition:** `AutoCommit.Enable = true` commit theo timer, không theo trạng thái xử lý → message loss nếu crash sau commit nhưng trước khi xử lý xong

**⚠️ Common Mistakes:**

| Sai lầm                                           | Tại sao sai                                                                        | Đúng là                                                          |
| ------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Để `AutoCommit.Enable = true` cho critical events | Commit theo thời gian, không theo kết quả xử lý → message loss khi crash           | Tắt AutoCommit, gọi `MarkMessage()` chỉ sau khi xử lý thành công |
| Không handle rebalance trong `Setup/Cleanup`      | State cũ (cache, in-flight counter) vẫn còn sau partition reassignment → logic sai | Reset state trong `Cleanup()`, khởi tạo lại trong `Setup()`      |
| Commit per-message thay vì per-batch              | Mỗi commit = 1 round-trip network tới Kafka → throughput giảm 10-100x              | Batch commit mỗi 500ms hoặc mỗi 100 messages                     |

**🎯 Interview Pattern:** "Design a reliable order consumer" → show manual commit + DLQ + graceful shutdown + idempotent processing

📚 Cần biết trước: [Distributed Systems](./03-distributed-systems.md) — CAP theorem, partition tolerance
➡️ Để hiểu tiếp: [Kafka Producer & Idempotency](#concept-2-kafka-producer--idempotency) — producer cũng cần tránh duplicate khi retry

---

### Concept 2: Kafka Producer & Idempotency

> 🧠 **Memory Hook:** "Idempotent producer = dedup at broker level — same message sent twice, stored once."
> _Producer idempotent = dedup ở broker — gửi 2 lần, lưu 1 lần._

**❓ Why exists (root-cause tracing):**

- Level 1: Why `RequiredAcks = WaitForAll`? → Ensures all ISR replicas have the message before ACK → survives broker failure
- Level 2: Why `Idempotent = true`? → Network retry can duplicate messages → broker dedup via producer ID + sequence number
- Level 3: Why `MaxOpenRequests = 1` for idempotent? → Multiple in-flight requests can arrive out-of-order → sequence number check would fail

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Khi gửi email và không nhận được xác nhận, bạn gửi lại — nhưng người nhận lại nhận 2 bản. **Idempotent producer** giống như bưu điện thông minh: dù bạn gửi cùng 1 phong bì 10 lần, bưu điện nhận ra trùng (qua mã định danh) và chỉ giữ lại 1 bản duy nhất, phong bì trùng tự động bị bỏ qua!

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Producer                   Kafka Leader Broker          ISR Replicas
    │                              │                          │
    ├─ msg(PID=1, seq=0) ─────────►│                          │
    │                              ├─ replicate ─────────────►│
    │                              │◄── ack ─────────────────-┤
    │◄── ACK ─────────────────────-┤                          │
    │                              │                          │
    ├─ retry(PID=1, seq=0) ───────►│  (network retry)         │
    │                              ├─ DUPLICATE DETECTED!     │
    │◄── ACK (deduplicated) ──────-┤  same PID+seq → ignore   │
    │                              │                          │

RequiredAcks=WaitForAll : chờ leader + tất cả ISR replicas confirm
Idempotent=true         : broker track (PID, seq) → auto dedup khi retry
MaxOpenRequests=1       : đảm bảo seq number luôn tăng tuần tự
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **AsyncProducer silent loss:** `AsyncProducer` gửi không đồng bộ — nếu không đọc `Errors()` channel, lỗi bị bỏ qua hoàn toàn; luôn có goroutine riêng drain Errors channel
- **Ordering guarantee breakdown:** Không set key → messages phân tán ngẫu nhiên vào các partitions → ordering bị phá; cùng orderID phải dùng cùng key
- **Idempotency scope giới hạn:** Idempotent producer chỉ dedup trong 1 session (PID reset khi restart) → không thay thế idempotent consumer ở phía xử lý
- **WaitForAll vs WaitForLocal:** `WaitForLocal` chỉ chờ leader → nếu leader crash trước khi replicate xong, message mất dù ACK đã trả; luôn dùng `WaitForAll` cho critical data
- **Throughput trade-off:** `MaxOpenRequests=1` + `WaitForAll` giảm throughput ~30% so với defaults; chấp nhận được với payment/order, không nên dùng cho log events

**⚠️ Common Mistakes:**

| Sai lầm                                          | Tại sao sai                                                                          | Đúng là                                                                     |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Dùng AsyncProducer mà không drain Errors channel | Lỗi publish bị bỏ qua hoàn toàn → silent message loss không có log                   | Luôn có goroutine riêng đọc `producer.Errors()` và log/alert/retry          |
| Không set message key                            | Messages phân tán random vào partitions → cùng entity xử lý song song → ordering mất | Set key = entity ID (orderID, userID) → cùng key → cùng partition → ordered |
| Dùng `RequiredAcks = WaitForLocal`               | Leader crash trước khi replicate → message mất dù ACK đã trả về                      | Dùng `WaitForAll` cho critical events; chỉ dùng `NoResponse` cho log/metric |

**🎯 Interview Pattern:** "Your Kafka producer loses messages occasionally" → check acks setting + idempotent flag + retry config + error channel handling

📚 Cần biết trước: [Kafka Consumer & Offset Management](#concept-1-kafka-consumer--offset-management) — consumer cần idempotency vì producer có thể retry
➡️ Để hiểu tiếp: [Dead Letter Queue (DLQ)](#concept-3-dead-letter-queue-dlq) — khi message vẫn fail sau retry, DLQ là tuyến phòng thủ tiếp theo

---

### Concept 3: Dead Letter Queue (DLQ)

> 🧠 **Memory Hook:** "DLQ = hospital for sick messages — quarantine, diagnose, cure, re-inject."
> _DLQ = bệnh viện cho message bị lỗi — cách ly, chẩn đoán, chữa, đưa lại._

**❓ Why exists (root-cause tracing):**

- Level 1: Why not just retry forever? → Poison messages block the entire partition → consumer lag grows infinitely
- Level 2: Why separate topic, not in-memory retry? → Pod restart loses retry state → DLQ topic persists across restarts
- Level 3: Why attach original metadata (topic, partition, error)? → Debug requires context → without it, DLQ messages are opaque blobs

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng băng chuyền hành lý ở sân bay. Nếu 1 kiện hàng bị hỏng không thể xử lý, nó cứ chạy vòng tròn mãi và chặn hết hành lý phía sau. **DLQ** giống như khu vực tách biệt để đặt kiện hàng hỏng ra ngoài — các hành lý khác tiếp tục chạy bình thường, còn hàng hỏng được đội kỹ thuật kiểm tra và sửa chữa sau!

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Message arrive → Consumer processes
                       │
                  ┌────▼────┐
                  │  FAIL?  │
                  └────┬────┘
                       │ YES
                  ┌────▼───────────────┐
                  │ retry_count < MAX? │
                  └────┬───────────────┘
             YES  │                │ NO (poison message)
                  ▼                ▼
           republish with     sendToDLQ(msg, err, metadata)
           retry_count+1           │
           + backoff delay         ▼
                            orders.dlq topic
                            headers:
                              error=<processing error>
                              original-topic=orders
                              original-partition=2
                                   │
                                   ▼
                         Alert → Human inspect
                         → Fix bug → Replay
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **DLQ không có alert:** Poison messages tích lũy hàng tuần mà không ai biết; DLQ phải đi kèm alert ngay khi có message đầu tiên vào queue
- **Quên commit sau khi send DLQ:** Nếu không commit offset sau khi gửi DLQ, message sẽ vừa retry vừa bị gửi vào DLQ lặp lại vô tận
- **DLQ producer cũng có thể fail:** Cần fallback (log to disk / dead drop alert) và không để lỗi DLQ crash consumer chính
- **Replay ordering:** Khi replay từ DLQ, messages có thể đến sau messages mới hơn → idempotent consumer là bắt buộc để tránh state corruption
- **Exponential backoff vs fixed delay:** Fixed delay lãng phí thời gian cho lỗi thoáng qua; exponential backoff (100ms → 200ms → 400ms) phù hợp với external service temporarily down

**⚠️ Common Mistakes:**

| Sai lầm                                        | Tại sao sai                                                                     | Đúng là                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| DLQ không có monitoring/alerting               | Poison messages tích lũy hàng tuần → business impact lớn trước khi ai phát hiện | Gắn alert trên DLQ consumer lag; mỗi message vào DLQ phải trigger notification |
| Infinite retry trước khi vào DLQ               | 1 poison message block toàn bộ partition → consumer lag tăng không kiểm soát    | Giới hạn retry (ví dụ 3 lần) với exponential backoff, sau đó gửi DLQ ngay      |
| Không commit offset sau khi gửi DLQ thành công | Message tiếp tục retry và gửi DLQ lặp lại → DLQ topic bị spam, metrics bị nhiễu | Luôn `MarkMessage()` sau khi DLQ send thành công, dù processing fail           |

**🎯 Interview Pattern:** "A message keeps failing — what do you do?" → retry N times with backoff → DLQ → alert → human inspect → fix + replay

📚 Cần biết trước: [Kafka Producer & Idempotency](#concept-2-kafka-producer--idempotency) — hiểu retry behavior trước khi thiết kế DLQ threshold
➡️ Để hiểu tiếp: [Consumer Lag & Scaling](#concept-6-consumer-lag--scaling) — DLQ ngăn lag từ poison messages, nhưng lag vẫn có thể xảy ra vì lý do khác

---

### Concept 4: RabbitMQ Worker Pattern

> 🧠 **Memory Hook:** "RabbitMQ is a smart post office — it routes letters (messages) to the right mailbox (queue) using rules (exchange + routing key)."
> _RabbitMQ là bưu điện thông minh — định tuyến thư đến đúng hòm thư theo quy tắc._

**❓ Why exists (root-cause tracing):**

- Level 1: Why prefetch=1? → Without it, RabbitMQ pushes all messages to one consumer → uneven load
- Level 2: Why reconnection loop? → AMQP connections are TCP-based → network blip drops connection → need auto-recovery
- Level 3: Why Nack with requeue vs reject? → Requeue gives the message another chance → reject sends to DLX (Dead Letter Exchange)

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng 3 nhân viên bưu điện (consumers) và 1 chồng thư cần giao (queue). Không có quy tắc → người nhanh nhất ôm hết 100 bức thư trong khi 2 người kia ngồi không. **Prefetch=1** như quy tắc: mỗi nhân viên chỉ được cầm 1 bức thư, giao xong ký nhận (ACK) mới lấy cái tiếp — tải được chia đều tự nhiên!

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Producer
    │
    ▼
Exchange (direct/topic/fanout)
    │  routing key: "order.created"
    ▼
Queue: "order-processing" (durable=true)
    │
    ├── Consumer A (prefetch=1)
    │      ├── Receive msg
    │      ├── process()
    │      ├── Ack(false)  ─────────► RabbitMQ removes msg ✅
    │      │   OR Nack(false, true) ► RabbitMQ requeues msg 🔄
    │      │   OR Nack(false,false) ► Dead Letter Exchange  ☠️
    │      └── [get next msg only after ACK]
    │
    └── Consumer B (prefetch=1)
           └── ... (same flow)

NotifyClose: TCP drop → reconnect outer loop → re-declare → re-consume
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Nack với requeue=true tạo infinite loop:** Nếu message luôn fail, `Nack(requeue=true)` sẽ requeue mãi mãi → tốn CPU và network; phải có retry counter header hoặc dùng DLX với message TTL
- **Channel vs Connection error:** Channel error (bad operation) không đồng nghĩa connection error; channel cần re-create độc lập; không nên close connection khi chỉ channel bị lỗi
- **Publisher confirms bị bỏ qua:** Producer mặc định không biết message đã vào queue chưa; phải bật `Channel.Confirm()` để nhận ack/nack từ broker
- **Durable queue không đủ:** Queue khai báo durable không đảm bảo messages survive restart — message cũng phải publish với `DeliveryMode=Persistent`
- **Prefetch size tuning:** prefetch=1 → low throughput (1 RTT per message ack); prefetch=100 → có thể load imbalance; tune theo message processing time thực tế

**⚠️ Common Mistakes:**

| Sai lầm                                 | Tại sao sai                                                                          | Đúng là                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Không set `Qos(prefetch)`               | RabbitMQ push toàn bộ queue vào buffer của 1 consumer nhanh nhất → load imbalance    | Set `ch.Qos(1, 0, false)` — mỗi consumer chỉ hold 1 unacked message tại một lúc       |
| Bỏ qua `NotifyClose` channel            | Consumer ngừng nhận message sau network drop mà không có log/alert → silent downtime | Monitor `conn.NotifyClose()` trong goroutine riêng; trigger reconnect loop khi detect |
| Dùng `Ack(multiple=true)` mà không hiểu | Ack tất cả messages có delivery tag ≤ current → có thể ack message chưa xử lý xong   | Luôn dùng `Ack(false)` (multiple=false) để ack từng message riêng lẻ                  |

**🎯 Interview Pattern:** "How do you ensure no message loss in RabbitMQ?" → publisher confirms + consumer manual ACK + durable queue + persistent messages

📚 Cần biết trước: [Shared Message Queues Theory](../../shared/02-system-design/05-message-queues.md) — delivery semantics và broker architecture
➡️ Để hiểu tiếp: [Queue Selection (Kafka vs RabbitMQ vs Redis)](#concept-5-queue-selection-kafka-vs-rabbitmq-vs-redis) — khi nào dùng RabbitMQ thay vì Kafka

---

### Concept 5: Queue Selection (Kafka vs RabbitMQ vs Redis)

> 🧠 **Memory Hook:** "Kafka = newspaper archive (replay forever), RabbitMQ = postal service (deliver and forget), Redis Pub/Sub = loudspeaker (miss it, gone)."
> _Kafka = kho báo (phát lại mãi), RabbitMQ = bưu điện (giao xong xóa), Redis = loa phát thanh (lỡ thì mất)._

**❓ Why exists (root-cause tracing):**

- Level 1: Why not just use Kafka for everything? → Kafka overkill for simple task queues → operational complexity (ZooKeeper/KRaft, partition management)
- Level 2: Why Redis Pub/Sub for ephemeral data? → Zero persistence overhead → microsecond latency → perfect for "latest value only" use cases
- Level 3: Why Grab uses all three? → Different use cases have different durability/latency/ordering requirements → one tool cannot optimize all three

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

- **Kafka** = **thư viện lưu trữ báo cũ**: đọc lại bất kỳ số báo nào từ 7 ngày trước, nhiều người đọc cùng lúc, báo không bị xóa sau khi đọc
- **RabbitMQ** = **bưu điện**: thư giao đến đúng địa chỉ, sau khi người nhận ký nhận thì thư bị xóa, có thể định tuyến thư theo quy tắc phức tạp
- **Redis Pub/Sub** = **loa phát thanh công cộng**: không nghe vào đúng lúc phát thì mất nội dung mãi mãi — không có ghi âm lại!

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
┌──────────────┬──────────────┬─────────────┬─────────────────┐
│ Tiêu chí     │ Kafka        │ RabbitMQ    │ Redis Pub/Sub   │
├──────────────┼──────────────┼─────────────┼─────────────────┤
│ Retention    │ Days/weeks   │ Until ACK   │ None (fire&forget)
│ Replay       │ ✅ Yes        │ ❌ No       │ ❌ No           │
│ Throughput   │ 1M+ msg/s    │ 100K msg/s  │ 1M+ msg/s       │
│ Routing      │ Topic/key    │ Complex     │ Channel only    │
│ Ordering     │ Per-partition│ Per-queue   │ None            │
│ Ops cost     │ High         │ Medium      │ Low (reuse Redis)│
│ Best for     │ Event bus    │ Task queue  │ Realtime feed   │
└──────────────┴──────────────┴─────────────┴─────────────────┘

Decision tree:
  Need replay? ────────────────────────────────────► Kafka
  Complex routing? ───────────────────────────────► RabbitMQ
  Sub-millisecond + ephemeral OK? ────────────────► Redis Pub/Sub
  Simple task queue, cloud-native? ───────────────► SQS / RabbitMQ
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Kafka overhead ở quy mô nhỏ:** Kafka cluster tối thiểu 3 brokers + ZooKeeper/KRaft; cho 10 msg/sec thì quá overkill — chi phí vận hành không tương xứng giá trị
- **Redis Pub/Sub không có buffer:** Subscriber chậm hoặc disconnect → messages drop hoàn toàn; dùng Redis Streams nếu cần persistence nhưng vẫn muốn dùng Redis
- **Hybrid architecture complexity:** Dùng 3 tools cùng lúc tăng operational complexity; mỗi tool cần monitoring, alerting, runbook riêng; cần team đủ kinh nghiệm
- **Cloud-managed alternatives:** SQS thay RabbitMQ, Kinesis thay Kafka, SNS thay Redis Pub/Sub — đổi operational cost thành financial cost; thường là đúng cho startup
- **Kafka không có native priority/TTL:** Kafka không support priority queue, per-message TTL, hay scheduling — những feature RabbitMQ hỗ trợ natively

**⚠️ Common Mistakes:**

| Sai lầm                                        | Tại sao sai                                                                           | Đúng là                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Chọn Kafka cho queue 10 msg/giây vì "scalable" | Kafka cluster cần ≥3 brokers + ops team → chi phí vận hành không xứng với yêu cầu     | RabbitMQ hoặc SQS đủ tốt; Kafka chỉ cần khi throughput cao và replay là bắt buộc    |
| Dùng Redis Pub/Sub cho payment events          | Không có persistence → subscriber disconnect 1 giây là mất payment event vĩnh viễn    | Dùng Kafka hoặc RabbitMQ với durable queue + persistent messages cho financial data |
| Không tính operational cost                    | Kafka cluster đòi hỏi dedicated DevOps, monitoring, partition management thường xuyên | Tính TCO: cloud-managed (SQS/Kinesis) thường rẻ hơn self-hosted Kafka cho team nhỏ  |

**🎯 Interview Pattern:** "Design the messaging for an e-commerce platform" → event bus (Kafka) + task queue (RabbitMQ/SQS) + real-time (Redis) with justification

📚 Cần biết trước: [Distributed Systems](./03-distributed-systems.md) — CAP theorem giải thích trade-off durability vs availability
➡️ Để hiểu tiếp: [Consumer Lag & Scaling](#concept-6-consumer-lag--scaling) — sau khi chọn tool, cần biết cách scale khi lag xảy ra

---

### Concept 6: Consumer Lag & Scaling

> 🧠 **Memory Hook:** "Consumer lag = unread emails — too many means your inbox (consumer) is too slow or too few."
> _Consumer lag = email chưa đọc — quá nhiều nghĩa là inbox xử lý quá chậm hoặc quá ít._

**❓ Why exists (root-cause tracing):**

- Level 1: Why does lag grow? → Processing rate < production rate → offset falls behind head
- Level 2: Why can't you just add more consumers? → Consumers in a group ≤ partitions → adding beyond that leaves idle consumers
- Level 3: Why is hot partition a common root cause? → Bad key distribution → one partition gets 80% of traffic → that consumer is bottleneck

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng hộp thư email: nhận 1000 email/ngày nhưng chỉ đọc được 800 — tồn đọng 200 email mỗi ngày. Thuê thêm người đọc tốt, nhưng nếu chỉ có 3 hộp thư (partitions) mà thuê 5 người thì 2 người thừa ngồi không. **Và nếu 1 hộp thư nhận 800/1000 emails** (hot partition) — cả 4 người kia cũng không giúp được!

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Topic "orders" - Partition 0
Head offset (latest produced):  ████████████████████████ 1000
                                                         ↑ producer
Committed offset (consumer at): ███████████████ 750
                                               ↑ consumer
Lag = 1000 - 750 = 250 messages behind ⚠️

Per-partition lag diagnosis:
  Partition 0: lag=250  ┐
  Partition 1: lag=248  ┼── Even lag → slow processing OR need more consumers
  Partition 2: lag=3000 ┘  ← SPIKE! Hot partition → bad key distribution

Fix strategy map:
  Even high lag + consumers < partitions  → Add more consumers
  Even high lag + consumers = partitions  → Optimize processing (async/batch)
  Concentrated lag on 1 partition         → Re-key for better distribution
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Idle consumers sau khi add:** Consumer count > partition count → extra consumers idle hoàn toàn, waste resource; luôn kiểm tra partition count trước khi scale consumer
- **Tăng partition phá ordering:** Tăng partition từ 3 lên 6 → messages cùng key sẽ hash vào partition khác → ordering break trong thời gian migration; cần plan kỹ
- **Hot partition từ timestamp key:** Dùng timestamp làm key → tất cả messages trong cùng giây vào cùng partition → hot spot cực kỳ phổ biến; hash theo entity ID thay thế
- **Async processing đánh đổi ordering:** Parallel goroutines per message giải quyết lag nhưng phá ordering; chỉ dùng khi business logic rõ ràng cho phép out-of-order
- **Lag monitoring per consumer group:** Lag là per consumer group, không per topic; cùng 1 topic có thể có nhiều groups với lag rất khác nhau — monitor đúng group

**⚠️ Common Mistakes:**

| Sai lầm                                            | Tại sao sai                                                                              | Đúng là                                                                                               |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Thêm consumer mà không check partition count       | Consumer count > partition count → extra consumers idle, lãng phí resource               | Chạy `kafka-consumer-groups --describe` trước; nếu cần scale → tăng partitions rồi mới tăng consumers |
| Tăng partition count mà không hiểu ordering impact | Messages cùng key có thể split sang partition mới trong migration → ordering break       | Tăng partitions trong maintenance window; consumer phải idempotent để handle rebalance                |
| Async consumer không có idempotency                | Parallel processing + rebalance → same message processed ≥2 lần → duplicate side effects | Mọi async consumer phải idempotent; dùng unique message ID để dedup trong DB/cache                    |

**🎯 Interview Pattern:** "Consumers are falling behind in production" → check lag per partition → identify bottleneck (slow processing? hot partition?) → scale or optimize

📚 Cần biết trước: [Queue Selection](#concept-5-queue-selection-kafka-vs-rabbitmq-vs-redis) — chỉ Kafka-based system có partition model này
➡️ Để hiểu tiếp: [Go-Specific Patterns](#concept-7-go-specific-patterns) — semaphore pattern để tăng throughput consumer trong Go

---

### Concept 7: Go-Specific Patterns

> 🧠 **Memory Hook:** "Go MQ patterns = context cancel for shutdown + semaphore for concurrency + outbox for atomicity."
> _Go MQ patterns = context cancel để dừng + semaphore để giới hạn + outbox để atomic._

**❓ Why exists (root-cause tracing):**

- Level 1: Why graceful shutdown matters? → Without it, in-flight messages are abandoned → reprocessed after restart → duplicate side effects
- Level 2: Why semaphore (bounded concurrency)? → Unbounded goroutines per message → OOM or overwhelming downstream services
- Level 3: Why outbox pattern? → "Write to DB then publish to Kafka" = two-phase problem → if publish fails, DB and Kafka diverge → outbox makes it single-transaction + poller

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Ba pattern của Go MQ như ba công cụ của thợ điện: **context cancel** như công tắc điện chính — tắt an toàn từ từ, không ngắt đột ngột; **semaphore** như cầu dao giới hạn ampe — bảo vệ hệ thống không bị quá tải; **outbox** như máy UPS backup — đảm bảo kể cả khi điện cúp giữa chừng, dữ liệu vẫn nhất quán giữa DB và Kafka!

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Pattern 1: Graceful Shutdown
  SIGTERM ──► context.Cancel() ──► consumer loop exits
                                ──► WaitGroup.Wait() (chờ in-flight xong)
                                ──► clean exit ✅
  WRONG: os.Exit(0) → kills goroutines mid-flight → messages processed but not committed

Pattern 2: Semaphore (Bounded Concurrency)
  sem := make(chan struct{}, 10)  // max 10 concurrent goroutines
  for msg := range claim.Messages() {
      sem <- struct{}{}           // acquire (blocks if 10 already running)
      go func(m *sarama.ConsumerMessage) {
          defer func() { <-sem } // release when done
          process(m)
          sess.MarkMessage(m, "")
      }(msg)
  }

Pattern 3: Outbox Pattern (atomicity)
  ┌─────────────────────────────────────────────┐
  │ BEGIN TRANSACTION                           │
  │   INSERT INTO orders (id, status, ...)      │
  │   INSERT INTO outbox (topic, payload, ...)  │
  │ COMMIT ← atomic: both succeed or both fail  │
  └─────────────────────────────────────────────┘
          │
          ▼
  Poller goroutine (every 1s):
    SELECT * FROM outbox WHERE published=false
    → Publish to Kafka (idempotent producer)
    → UPDATE outbox SET published=true WHERE id=?
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Graceful shutdown timeout:** Context cancel không force goroutines dừng ngay; cần `context.WithTimeout` cho shutdown để tránh trường hợp goroutine bị stuck vô hạn
- **Semaphore và ordering:** Parallel processing với semaphore phá ordering; nếu ordering quan trọng (payments), phải process sequentially hoặc dùng partition-aware workers
- **Outbox poller latency:** Outbox pattern thêm latency (poller interval thường 1s) so với publish trực tiếp; không phù hợp cho use case cần sub-second event delivery
- **Outbox table growth:** Nếu không cleanup `published=true` rows định kỳ, outbox table phình to → query chậm; cần scheduled job purge rows cũ
- **At-least-once từ outbox:** Poller có thể fail sau publish nhưng trước update `published=true` → publish lại khi restart → consumer bắt buộc phải idempotent

**⚠️ Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                                                              | Đúng là                                                                                  |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Dùng `os.Exit(0)` để shutdown consumer       | Kills toàn bộ goroutines ngay lập tức; messages đang xử lý bị drop → reprocess sau restart gây duplicate | Dùng `context.WithCancel()` + `WaitGroup.Wait()` để chờ goroutines kết thúc gracefully   |
| Spawn `go func()` per message không giới hạn | 100K messages pending → 100K goroutines → OOM hoặc downstream service bị overwhelm                       | Dùng semaphore (`chan struct{}` buffer = max concurrency) để cap số goroutines đang chạy |
| Publish to Kafka sau DB commit (dual-write)  | Kafka publish có thể fail → DB có order nhưng Kafka không có event → data inconsistency vĩnh viễn        | Dùng Outbox pattern: write event vào DB trong cùng transaction, poller publish sau       |

**🎯 Interview Pattern:** "How do you ensure exactly-once between DB write and Kafka publish?" → outbox pattern + idempotent consumer + transactional outbox poll

📚 Cần biết trước: [Go Concurrency](../01-golang/03-concurrency.md) — channel patterns, goroutine lifecycle
➡️ Để hiểu tiếp: [Microservices](./02-microservices.md) — outbox pattern là nền tảng của event-driven microservices

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

| Type           | Question                                                                                                             | Key Points to Recall                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔍 Retrieval   | Why does committing offset before processing cause message loss?                                                     | Crash after commit but before processing → message skipped → never reprocessed                                                                  |
| 🎨 Visual      | Sketch a Kafka topic with 3 partitions and 2 consumers — show uneven lag and identify the hot partition              | Partition 2 lag 10x higher → bad key distribution → re-key by entity ID not timestamp                                                           |
| 🛠️ Application | Design an order consumer with zero message loss — what 4 components are required?                                    | Manual commit + DLQ after N retries + graceful shutdown via context cancel + idempotent processing                                              |
| 🐛 Debug       | Consumer lag growing on Partition 2 only (lag=3000) while Partitions 0 and 1 are fine (lag≈10) — root cause and fix? | Hot partition from bad key distribution → re-key by orderID hash OR add sub-partitions                                                          |
| 🎓 Teach       | Explain to a junior dev why "just publish to Kafka after DB commit" is dangerous and what to do instead              | Dual-write: Kafka publish may fail → DB has record but no event; fix: Outbox pattern — write event row in same DB transaction, poller publishes |

💬 **Feynman Prompt:** "Explain to a 12-year-old: (1) how Kafka keeps track of where you stopped reading using bookmarks (offsets), (2) why we need a hospital for broken messages (DLQ) instead of just trying forever, and (3) why saving to the database AND sending to Kafka at the same time is dangerous (dual-write problem)."

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
