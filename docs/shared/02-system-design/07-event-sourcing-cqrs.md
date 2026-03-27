# Event Sourcing & CQRS / Event Sourcing và CQRS

> **Track**: Shared | **Difficulty**: 🔴 Senior
> **See also**: [Message Queues](./05-message-queues.md) | [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md) | [System Design Theory](./system-design-theory.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Axon Active banking module:** Hệ thống lưu số dư tài khoản — user complain số dư hiển thị sai sau một loạt transactions. Debug: không có audit log đủ chi tiết để tái hiện timeline của transactions. Sau khi migrate sang Event Sourcing: thay vì lưu `balance = 500`, lưu `[Deposit +200, Withdrawal -100, Deposit +400]` — số dư được tính bằng cách replay events. Bug trở nên reproducible: developer replay events đến thời điểm bất kỳ để xem state tại đó.

**Bài học:** Event Sourcing đổi "current state" thành "history of changes" — giải quyết audit trail và time-travel debugging nhưng thêm complexity. Chỉ dùng khi lợi ích này thực sự cần.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Event Sourcing giống sổ kế toán kép (double-entry bookkeeping): không ghi "số dư = 500", mà ghi "ngày 1: +200, ngày 2: -100, ngày 3: +400". Số dư 500 là _kết quả_ của các ghi chép, không phải dữ liệu gốc. CQRS giống tách bộ phận kế toán (write: ghi giao dịch) và báo cáo (read: xem tổng hợp) thành hai phòng riêng.

**Why it matters:** Event Sourcing + CQRS là pattern Senior phải biết cho banking, e-commerce, và audit-heavy systems. Nhưng cũng phải biết _khi nào không nên dùng_.

---

## Overview / Tổng Quan

Hai pattern này giải quyết vấn đề khác nhau nhưng thường dùng cùng nhau:

- **Event Sourcing**: lưu _sự kiện_ (events) thay vì _trạng thái hiện tại_
- **CQRS**: tách biệt _đọc_ và _ghi_ thành hai model riêng

Hay được hỏi ở Axon, Grab, các công ty làm financial/audit systems.

---

## Concept Map / Bản Đồ Khái Niệm

```
Event Sourcing                    CQRS
    │                               │
    ├── Event Store (append-only)   ├── Command Side (write model)
    │     ├── Aggregate + Apply     │     ├── Validate + Business Logic
    │     ├── Snapshot Pattern      │     └── Emit Events
    │     └── Schema Evolution      │
    │                               ├── Query Side (read model)
    │                               │     ├── Projectors
    │                               │     └── Optimized Views
    │                               │
    └───── Combined: ES + CQRS ─────┘
              │
              ├── Event Store → source of truth
              ├── Projectors → build read models
              ├── Snapshot → optimize replay
              └── Rebuild → fix projector bugs
```

---

## Overview Table / Bảng Tổng Quan

| #   | Concept                   | Role                                                        | Interview Weight               |
| --- | ------------------------- | ----------------------------------------------------------- | ------------------------------ |
| 1   | Event Sourcing Core       | Store events not state — immutable append-only log          | ⭐⭐⭐ (foundation of ES)      |
| 2   | Aggregate & Apply Pattern | Load state by replaying events through apply function       | ⭐⭐⭐ (Go implementation)     |
| 3   | CQRS Pattern              | Separate read and write models for independent optimization | ⭐⭐⭐ (always paired with ES) |
| 4   | Projectors & Read Models  | Build denormalized views from event stream                  | ⭐⭐ (read side mechanics)     |
| 5   | Snapshot Pattern          | Cache aggregate state periodically to avoid full replay     | ⭐⭐ (production optimization) |
| 6   | Event Schema Evolution    | Handle old event types without breaking replay              | ⭐⭐ (production reality)      |
| 7   | When NOT to Use           | CRUD apps, small teams, strong consistency needs            | ⭐⭐⭐ (shows maturity)        |

**Relationship:** Event Sourcing provides the **what happened** (immutable event log). CQRS provides **how to read efficiently** (projectors build optimized views). Together they enable **time travel debugging**, **independent read/write scaling**, and **event-driven integration** — but at significant complexity cost.

---

## Core Concepts Phase 2 / Khái Niệm Cốt Lõi — Chuyên Sâu

### Concept 1: Event Sourcing Core

🪝 **Memory Hook:** ES = Sổ kế toán kép — ghi "ngày 1: +200, ngày 2: -100", không ghi "số dư = 100"

**Why exists / Tại sao tồn tại:**

- Level 1: Need audit trail — traditional UPDATE overwrites history
- Level 2: Business needs time travel — reproduce state at any past point
- Level 3: Events are natural integration boundaries — publish to downstream systems

**Layer 1 (Simple Analogy):** Git for data — every commit (event) is saved, current state is HEAD = replay all commits. You never lose history, and you can checkout any past state.

**Layer 2 (Technical Mechanics):**

```
Append-only Event Log:
┌────┬──────────┬─────────────────┬───────────────────────┐
│ ID │ Aggregate│ Event Type      │ Payload               │
├────┼──────────┼─────────────────┼───────────────────────┤
│ 1  │ order:1  │ OrderCreated    │ {customer: "Alice"}   │
│ 2  │ order:1  │ PaymentReceived │ {amount: 150}         │
│ 3  │ order:1  │ OrderShipped    │ {tracking: "VN123"}   │
└────┴──────────┴─────────────────┴───────────────────────┘

State = fold(events, initialState, applyFn)
      = reduce [e1, e2, e3] → current state
```

**Layer 3 (Edge Cases):**

- Event ordering: concurrent commands on same aggregate → optimistic concurrency (expected_version check)
- Large aggregates: 10M events → snapshot every N events
- Event vs Command: event = past tense (OrderCreated), command = imperative (CreateOrder) — never mix

| Sai lầm                         | Tại sao sai                   | Đúng là                               |
| ------------------------------- | ----------------------------- | ------------------------------------- |
| Store current state AND events  | Dual source of truth → desync | Events = single source of truth       |
| Mutable events (UPDATE event)   | Breaks immutability guarantee | Append compensating events instead    |
| Replay all events on every read | O(N) per request → unusable   | Use snapshots + read-side projections |

🎯 **Interview Pattern:** "How does Event Sourcing differ from audit log?" → ES: events ARE the data (replay to get state); audit log: separate table alongside state

🔗 **Knowledge Chain:** Append-only log → Aggregate pattern → Snapshot optimization → Schema evolution → CQRS integration

### Concept 2: Aggregate & Apply Pattern

🪝 **Memory Hook:** Aggregate = trọng tài — nhận events, apply rules, output new events

**Why exists / Tại sao tồn tại:**

- Level 1: Need boundary for consistency — one aggregate = one transactional boundary
- Level 2: Separate business logic (command handler) from state reconstruction (apply function)

**Layer 1:** Aggregate is like a bank teller — receives transaction slips (commands), validates them against account rules, stamps them (events), and files them

**Layer 2:**

```
Command Flow:
  Command(Ship order:1)
    → Load aggregate: replay events → current state
    → Validate: status must be PAID
    → Emit: OrderShipped event
    → Persist: append to event store

Apply is PURE (no side effects, no I/O):
  func (o *Order) Apply(e Event) {
    switch e.(type) {
    case OrderCreated:  o.Status = PENDING
    case PaymentReceived: o.Status = PAID
    case OrderShipped:  o.Status = SHIPPED
    }
  }
```

**Layer 3:** Aggregate boundaries — two aggregates can't share a transaction. Cross-aggregate consistency requires Saga pattern.

| Sai lầm                     | Tại sao sai                             | Đúng là                                      |
| --------------------------- | --------------------------------------- | -------------------------------------------- |
| Put side effects in Apply() | Apply called during replay → duplicates | Apply = pure state change only               |
| One aggregate per entity    | Aggregate too large → contention        | Aggregate = consistency boundary, not entity |
| Skip optimistic concurrency | Lost events under concurrent writes     | Check expected_version on append             |

🎯 **Interview Pattern:** "Show me ES in Go" → Event interface, Aggregate with Apply, Repository with Load (replay) + Save (append)

🔗 **Knowledge Chain:** DDD Aggregate root → Command handler → Apply function → Event store persistence

### Concept 3: CQRS Pattern

🪝 **Memory Hook:** CQRS = tách phòng kế toán (write) và phòng báo cáo (read) — mỗi phòng optimize riêng

**Why exists / Tại sao tồn tại:**

- Level 1: Read and write workloads have fundamentally different characteristics
- Level 2: Read needs denormalized, cached, aggregated views; write needs normalized, transactional
- Level 3: Independent scaling — 100x more reads than writes

**Layer 1:** Restaurant analogy — kitchen (write side) optimizes for cooking speed and ingredient management; menu display (read side) optimizes for customer browsing with pictures and descriptions. Same food, different presentations.

**Layer 2:**

```
CQRS Architecture:
Command → Write Model → Event Store
                            │ (publish events)
                            ▼
                       Projectors → Read DB 1 (Postgres)
                                  → Read DB 2 (Elasticsearch)
                                  → Read DB 3 (Redis cache)
                            ▲
                       Query → Read Model
```

**Layer 3:** CQRS without ES is valid (separate DB tables for read/write). ES without CQRS is painful (querying event store directly is slow). Together they complement naturally.

| Sai lầm                           | Tại sao sai                                       | Đúng là                                                 |
| --------------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| Expect immediate read-after-write | Read model is eventually consistent               | Design UI for eventual consistency (optimistic updates) |
| One read model fits all queries   | Different queries need different denormalizations | Multiple projections from same event stream             |
| Use CQRS for simple CRUD          | Massive complexity overhead, no benefit           | CQRS when read/write ratio > 10:1 and different shapes  |

🎯 **Interview Pattern:** "Why CQRS?" → reads and writes have different optimization needs: reads want denormalized/cached, writes want normalized/consistent

🔗 **Knowledge Chain:** Read/write asymmetry → Separate models → Projectors → Eventually consistent → Optimistic UI

### Concept 4: Projectors & Read Models

🪝 **Memory Hook:** Projector = máy chiếu phim — events là film reel, read model là hình trên màn

**Why exists / Tại sao tồn tại:**

- Level 1: Event store is not queryable efficiently — need materialized views
- Level 2: Different consumers need different shapes of the same data

**Layer 1:** News editor receives raw wire stories (events), then creates: newspaper front page (summary view), web article (full view), tweet (compact view) — all from same source.

**Layer 2:**

```
Projector lifecycle:
1. Subscribe to event stream (Kafka consumer group)
2. For each event: UPDATE read_table SET ... WHERE ...
3. Track projection position (offset/cursor)
4. On crash: resume from last known position

Multiple projectors from same events:
Events → OrderSummaryProjector → orders_summary (Postgres)
       → SearchProjector → orders_search (Elasticsearch)
       → DashboardProjector → order_metrics (Redis)
```

**Layer 3:** Projector idempotency — same event processed twice must produce same result. Use event ID as dedup key.

| Sai lầm                             | Tại sao sai                      | Đúng là                                     |
| ----------------------------------- | -------------------------------- | ------------------------------------------- |
| Non-idempotent projector            | Replay = double-counted data     | Use event ID for dedup, upsert not insert   |
| Don't track projection offset       | Crash = replay from start (slow) | Store last processed event ID per projector |
| Block writes waiting for projection | Defeats CQRS purpose             | Accept eventual consistency, optimistic UI  |

🎯 **Interview Pattern:** "How rebuild corrupted read model?" → Fix projector, drop read table, replay all events — ES's killer feature

🔗 **Knowledge Chain:** Event stream → Consumer group → Projector logic → Read DB → Query optimization

### Concept 5: Snapshot Pattern

🪝 **Memory Hook:** Snapshot = bookmark giữa sách — không cần đọc lại từ trang 1

**Why exists / Tại sao tồn tại:**

- Level 1: Replaying millions of events is too slow for real-time
- Level 2: Trade storage for speed — periodic checkpoint of aggregate state

**Layer 1:** Video game save points — instead of replaying the entire game from start, load last save + replay only recent actions.

**Layer 2:**

```
Without snapshot: Load order:1 → replay 1,000,000 events → ~10s
With snapshot every 100 events:
  Load snapshot at event #999,900 (1 DB read) → state at that point
  Replay events #999,901 to #1,000,000 (100 events) → ~1ms
  Total: ~2ms vs ~10s

Snapshot storage options:
  (a) Special event in same store: {type: "Snapshot", data: serialized_state}
  (b) Separate snapshots table: aggregate_id + version + state
```

**Layer 3:** Snapshot versioning — when aggregate schema changes, old snapshots may be invalid. Strategy: include schema version in snapshot, migrate or invalidate on mismatch.

| Sai lầm                           | Tại sao sai                      | Đúng là                                           |
| --------------------------------- | -------------------------------- | ------------------------------------------------- |
| Snapshot on every event           | Excessive storage, slow writes   | Every N events (100) or time-based                |
| Trust snapshot without validation | Corrupted snapshot = wrong state | Verify snapshot version matches current schema    |
| Start with snapshots              | Premature optimization           | Add snapshots when replay becomes measurably slow |

🎯 **Interview Pattern:** "How handle 10M events aggregate?" → Snapshot every N events, load snapshot + replay delta

🔗 **Knowledge Chain:** Event count growth → Performance degradation → Snapshot strategy → Schema versioning → Cache invalidation

### Concept 6: Event Schema Evolution

🪝 **Memory Hook:** Events = chữ khắc trên đá — không thể xóa, chỉ thêm bản dịch mới (upcaster)

**Why exists / Tại sao tồn tại:**

- Level 1: Events are immutable — can't UPDATE old events when schema changes
- Level 2: System must replay old events forever — backward compatibility required

**Layer 1:** Legal documents — old contracts can't be rewritten, but you can add amendments. Upcaster = amendment that translates old format to new format during replay.

**Layer 2:**

```
Evolution strategies:
1. Weak schema: store JSON, handle missing fields with defaults
2. Upcasting: transform old events on-the-fly during replay
   v1: {amount: 100}
   v2: {amount: 100, currency: "USD"}
   Upcaster: if no currency → default "USD"
3. New event type: deprecate old, emit new going forward
   OrderCreatedV1 → OrderCreatedV2 (both coexist)
```

**Layer 3:** Never rename event types — downstream consumers depend on them. Never delete event types — old events still exist in store.

| Sai lầm                          | Tại sao sai                               | Đúng là                                       |
| -------------------------------- | ----------------------------------------- | --------------------------------------------- |
| Delete old event type            | Old events in store can't be deserialized | Keep all event types forever, add upcasters   |
| Rename event type                | Breaks all consumers expecting old name   | Add new type, deprecate old, upcaster bridge  |
| Strong schema validation on read | Old events fail new schema                | Tolerant reader — handle missing/extra fields |

🎯 **Interview Pattern:** "How handle schema changes in ES?" → Never modify events, use upcasting or versioned event types

🔗 **Knowledge Chain:** Immutable events → Schema drift → Upcasting → Versioned events → Protobuf evolution parallel

### Concept 7: When NOT to Use

🪝 **Memory Hook:** ES+CQRS = xe tải 18 bánh — đừng lái đi mua sữa (simple CRUD)

**Why exists / Tại sao tồn tại:**

- Level 1: ES+CQRS adds enormous complexity — must justify with real business need
- Level 2: Eventual consistency breaks many UI patterns — not all teams can handle this

**Layer 1:** Using a crane to move a chair — technically works, but the setup time and cost far exceed the benefit. Same with ES for a blog or TODO app.

**Layer 2:**

```
Decision matrix:
┌────────────────────────────┬──────────┬───────────┐
│ Criterion                  │ Use ES   │ Skip ES   │
├────────────────────────────┼──────────┼───────────┤
│ Audit trail required       │ ✅       │           │
│ Time travel debugging      │ ✅       │           │
│ Event-driven integration   │ ✅       │           │
│ Read/write ratio > 10:1    │ ✅ CQRS  │           │
│ Simple CRUD                │          │ ✅        │
│ Team < 5 engineers         │          │ ✅        │
│ Strong consistency needed  │          │ ✅        │
│ No event replay business   │          │ ✅        │
└────────────────────────────┴──────────┴───────────┘
```

**Layer 3:** Partial adoption — you can use ES for one bounded context (payments) and CRUD for others (user profiles). Don't go all-or-nothing.

| Sai lầm                  | Tại sao sai                                            | Đúng là                                             |
| ------------------------ | ------------------------------------------------------ | --------------------------------------------------- |
| ES for everything        | Most domains don't need event replay                   | ES only where audit/replay justified                |
| "We might need it later" | YAGNI — complexity cost is immediate                   | Start CRUD, migrate to ES when pain is real         |
| Ignore team readiness    | ES requires deep understanding of eventual consistency | Train team first, start with simple bounded context |

🎯 **Interview Pattern:** "When would you NOT use ES?" → Shows senior judgment — simple CRUD, small teams, strong consistency needs

🔗 **Knowledge Chain:** Business requirements → Complexity assessment → Bounded context selection → Partial adoption → Migration strategy

---

## Part 1: Event Sourcing

### Q: What is Event Sourcing and how does it differ from traditional storage? 🟢 Junior → 🔴 Senior

**A:**

```
TRADITIONAL STORAGE (current state):
orders table:
id | customer | status   | total | updated_at
1  | Alice    | SHIPPED  | $150  | 2024-01-05

Problem: How did order get to SHIPPED? What was it before?
→ Lost history, no audit trail

EVENT SOURCING (append-only event log):
events table:
id | aggregate_id | event_type          | data                | timestamp
1  | order:1      | OrderCreated        | {customer:"Alice"}  | 2024-01-01
2  | order:1      | PaymentReceived     | {amount:150}        | 2024-01-02
3  | order:1      | OrderFulfilled      | {warehouse:"HN"}    | 2024-01-04
4  | order:1      | OrderShipped        | {tracking:"VN123"}  | 2024-01-05

Current state = REPLAY all events:
OrderCreated → {status: PENDING, customer: Alice}
+ PaymentReceived → {status: PAID, total: 150}
+ OrderFulfilled → {status: FULFILLING}
+ OrderShipped → {status: SHIPPED, tracking: VN123}
```

**Event Sourcing benefits:**

1. **Full audit log**: Every state change recorded — regulatory compliance
2. **Time travel**: Reconstruct state at any point in time
3. **Event replay**: Replay events to rebuild projections, fix bugs, populate new views
4. **Natural integration**: Events = messages → publish to Kafka, trigger sideffects

**Event Sourcing costs:**

1. **Eventual consistency**: Read model may lag behind event log
2. **Query complexity**: Can't `SELECT * FROM orders WHERE status='SHIPPED'` directly
3. **Event schema evolution**: Old events must stay valid forever — painful to change
4. **Snapshot needed**: Replaying 1M events to get current state is slow → periodic snapshot

---

### Q: How do you handle Event Sourcing in Go? 🔴 Senior

**A:**

```go
// Event types
type Event interface {
    AggregateID() string
    EventType() string
    Timestamp() time.Time
}

type OrderCreated struct {
    ID         string
    CustomerID string
    OccurredAt time.Time
}
func (e OrderCreated) AggregateID() string  { return e.ID }
func (e OrderCreated) EventType() string    { return "OrderCreated" }
func (e OrderCreated) Timestamp() time.Time { return e.OccurredAt }

// Aggregate: business logic + event application
type Order struct {
    ID         string
    CustomerID string
    Status     OrderStatus
    Total      decimal.Decimal
    changes    []Event  // uncommitted events
}

// Apply event to update state (pure — no side effects)
func (o *Order) Apply(event Event) {
    switch e := event.(type) {
    case OrderCreated:
        o.ID = e.ID
        o.CustomerID = e.CustomerID
        o.Status = StatusPending
    case PaymentReceived:
        o.Total = e.Amount
        o.Status = StatusPaid
    case OrderShipped:
        o.Status = StatusShipped
    }
}

// Command handlers generate events
func (o *Order) Ship(trackingNumber string) error {
    if o.Status != StatusPaid {
        return errors.New("order must be paid before shipping")
    }
    event := OrderShipped{
        OrderID:       o.ID,
        TrackingNumber: trackingNumber,
        OccurredAt:    time.Now(),
    }
    o.Apply(event)
    o.changes = append(o.changes, event)  // track uncommitted
    return nil
}

// Repository: load by replaying events
type OrderRepository struct {
    store EventStore
}

func (r *OrderRepository) Load(id string) (*Order, error) {
    events, err := r.store.LoadEvents(id)  // load from DB
    if err != nil {
        return nil, err
    }
    order := &Order{}
    for _, e := range events {
        order.Apply(e)  // rebuild state by replaying
    }
    return order, nil
}

func (r *OrderRepository) Save(order *Order) error {
    return r.store.AppendEvents(order.ID, order.changes)
    // Append-only — never update/delete
}
```

---

## Part 2: CQRS (Command Query Responsibility Segregation)

### Q: What is CQRS and why separate reads from writes? 🟡 Mid

**A:**

```
TRADITIONAL (same model for R&W):

Client → Service → Single DB
         │
         ├── Write: INSERT/UPDATE
         └── Read:  SELECT (often complex joins)

Problem: Read and write have DIFFERENT characteristics:
- Writes: transactional, strict consistency, normalized data
- Reads: denormalized, aggregated, cached, often much more frequent

CQRS (separate models):

Commands (write side):         Queries (read side):
Write model                    Read model (projections)
Normalized DB                  Denormalized, optimized for queries
Strong consistency             Eventual consistency OK
Few writes per second          Many reads per second

Client → Command → Write DB → Events → Project → Read DB → Query → Client
```

### Q: CQRS with Event Sourcing together — how does it work? 🔴 Senior

**A:**

```
Full CQRS + Event Sourcing architecture:

                    ┌──────────────────────────────┐
                    │     WRITE SIDE               │
                    │                              │
Command             │  Command Handler             │
(PlaceOrder) ──────►│  → Validate                 │
                    │  → Load Aggregate (replay)   │
                    │  → Execute business logic    │
                    │  → Emit Events               │
                    └────────────┬─────────────────┘
                                 │ events appended to Event Store
                                 ▼
                    ┌────────────────────────────────┐
                    │     EVENT STORE                │
                    │  (append-only, source of truth)│
                    │  OrderCreated, PaymentReceived │
                    │  OrderShipped, ...             │
                    └────────────┬───────────────────┘
                                 │ events published
                                 ▼
                    ┌────────────────────────────────┐
                    │     PROJECTORS                 │
                    │  Build read models from events │
                    │                                │
                    │  OrderSummaryProjector         │
                    │  → updates orders_summary table│
                    │                                │
                    │  CustomerOrderProjector        │
                    │  → updates customer_orders view│
                    └────────────┬───────────────────┘
                                 │
                    ┌────────────▼───────────────────┐
                    │     READ SIDE                  │
                    │  Optimized for queries         │
                    │  Denormalized, indexed         │
                    │  Can use different DB!         │
                    └────────────────────────────────┘
                                 ▲
Query (GetOrder) ────────────────┘
```

**Read side can be ANYTHING**:

- Postgres for complex filtering
- Elasticsearch for full-text search
- Redis for real-time counters
- MongoDB for flexible document structure

All built from the SAME event stream!

---

## When to Use / Khi Nào Dùng

### Event Sourcing is a good fit when:

- Audit trail is required (financial, medical, legal)
- Need to replay history for analytics or debugging
- Building event-driven microservices
- Complex business workflows with many state transitions

### CQRS is a good fit when:

- Read and write loads are very different (10:1 or higher)
- Read models are complex aggregations of multiple entities
- Need different scaling for reads vs writes
- Separate teams working on read vs write paths

### When NOT to use:

- Simple CRUD apps — enormous complexity overhead
- Small teams — operational burden too high
- Strong consistency everywhere required — eventual consistency is hard

---

## 7. Snapshot & Projection Patterns / Snapshot và Projection

### Q: How do snapshots solve the event replay performance problem? / Snapshot giải quyết vấn đề replay performance thế nào? 🔴 Senior

**A:** After N events, serialize the current aggregate state as a snapshot. On next load, read the snapshot + only events that occurred after it. This reduces replay cost from O(all events) to O(events since last snapshot).

```
Without snapshot: replay 1,000,000 events = slow
With snapshot at event #999,000:
  Load snapshot (1 read) + replay events 999,001–1,000,000 (1,000 events) = fast

Snapshot strategy:
  - Every N events (e.g., every 100)
  - Time-based (every hour)
  - On explicit command (admin trigger)

Storage: same event store with special "Snapshot" event type,
         or separate snapshot table for quick lookup
```

Vietnamese: Snapshot là optimization quan trọng cho Event Sourcing trong production. Không dùng snapshot → aggregate với lịch sử dài (tài khoản ngân hàng 10 năm) sẽ replay rất chậm. Snapshot không phải bắt buộc — bắt đầu không có snapshot, thêm vào khi performance cần. Trade-off: snapshot tạo complexity (phải versioned cùng schema), nhưng giải quyết được bottleneck thực sự.

---

### Q: How do you rebuild a CQRS read model after a bug in the projector? / Rebuild read model CQRS sau bug trong projector thế nào? 🔴 Senior

**A:** Since all data is preserved as immutable events in the event store, you can fix the projector bug, delete the corrupted read model, and replay all events from the beginning to rebuild a correct read model. This is one of ES's strongest advantages over CRUD.

Vietnamese: Đây là một trong những điểm mạnh nhất của Event Sourcing: **time travel**. Nếu projection logic có bug → read model bị sai → không panic: (1) Fix bug trong projector code. (2) Drop bảng read model bị sai. (3) Replay tất cả events qua projector mới. Read model mới được tạo từ đầu, đúng hoàn toàn. Trong CRUD system, lỗi logic nghĩa là data đã bị ghi sai vào DB và không thể recover. ES events = source of truth không bao giờ bị modified → projection errors là recoverable.

---

## Interview Q&A Summary / Tổng Kết Câu Hỏi Phỏng Vấn

| #   | Question                      | Difficulty | Core Concept      | Key Signal                                                       |
| --- | ----------------------------- | ---------- | ----------------- | ---------------------------------------------------------------- |
| 1   | What is Event Sourcing?       | 🟢→🔴      | ES Core           | Store events not state; replay to reconstruct                    |
| 2   | ES implementation in Go?      | 🔴         | Aggregate & Apply | Event interface, Aggregate.Apply(), Repository.Load(replay)      |
| 3   | What is CQRS?                 | 🟡         | CQRS Pattern      | Separate read model (denormalized) from write model (normalized) |
| 4   | ES+CQRS together?             | 🔴         | Projectors        | Events → projectors → multiple optimized read DBs                |
| 5   | Snapshot pattern?             | 🔴         | Snapshot          | Cache state every N events → O(delta) vs O(all)                  |
| 6   | Rebuild read model after bug? | 🔴         | Projectors        | Fix projector → drop read → replay all events                    |
| 7   | When NOT to use ES?           | 🟡         | When NOT to Use   | Simple CRUD, small teams, strong consistency                     |
| 8   | Event schema evolution?       | 🔴         | Schema Evolution  | Never delete events, use upcasting for old formats               |

**Distribution:** 🟢 Junior (1) | 🟡 Mid (2) | 🔴 Senior (5)

---

**See also**: [Message Queues](./05-message-queues.md) | [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md)

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **"Banking system balance shows wrong value after a series of transactions. How would you redesign using Event Sourcing?"**

**30-second answer / Trả lời 30 giây:**
Instead of `UPDATE balance = 500`, store each transaction as an immutable event: `[Deposit +200, Withdrawal -100, Deposit +400]`. Current balance = replay all events = 500. Now every state change has a timestamp and can be verified. Add snapshots every N events for performance. Pair with CQRS: write side appends events, read side projects into denormalized balance view for fast queries.

**Follow-up / Hỏi thêm:** "After 2 years, aggregate has 5M events and load takes 3 seconds. How do you optimize without losing the ES guarantee?" → Snapshot every 1000 events + separate snapshot table + only replay delta from last snapshot.

---

## Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại và trả lời:

| #   | Type           | Question                                                      | Key Points                                                                                                     |
| --- | -------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | So sánh Event Sourcing vs traditional CRUD — 3 pros, 3 cons   | Pros: audit trail, time travel, replay. Cons: eventual consistency, query complexity, schema evolution         |
| 2   | 🎨 Visual      | Vẽ ES+CQRS full architecture từ command đến read query        | Command → Write → Event Store → Projectors → Read DBs → Query                                                  |
| 3   | 🛠️ Application | Design ES cho payment system — aggregate, events, projections | PaymentAggregate, events: Created/Authorized/Captured/Refunded, projections: balance view, reconciliation view |
| 4   | 🐛 Debug       | Read model shows stale data 5 minutes after write — diagnosis | Projector lag: check consumer offset, Kafka partition lag, projector error log, dead letter queue              |
| 5   | 🎓 Teach       | Giải thích cho junior tại sao "never delete event types"      | Old events in store reference that type → deserialize fails → replay broken → entire aggregate unloadable      |

💬 **Feynman Prompt:** Giải thích tại sao "never delete old event types" trong Event Sourcing — điều gì xảy ra nếu bạn xóa một event type mà vẫn còn events cũ trong store?

---

## 📅 Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | When   | Focus                                                       |
| ----- | ------ | ----------------------------------------------------------- |
| 1     | Day 1  | ES vs CRUD basics, Aggregate+Apply pattern, CQRS why        |
| 2     | Day 3  | Go implementation (Event interface, Repository), Projectors |
| 3     | Day 7  | Snapshot pattern, schema evolution, upcasting               |
| 4     | Day 14 | When NOT to use, decision matrix, partial adoption          |
| 5     | Day 30 | Full cold call: design ES+CQRS for banking/payment system   |

---

## Connections / Liên Kết

**Same track (Shared — System Design):**

- ⬅️ [System Design Theory](./system-design-theory.md) — distributed system fundamentals underpin ES+CQRS
- ⬅️ [Message Queues](./05-message-queues.md) — events published to Kafka/RabbitMQ for projectors
- 🔗 [Consensus Algorithms](./consensus-algorithms.md) — event store ordering requires consensus in distributed setup
- 🔗 [Replication & Partitioning](./replication-partitioning.md) — event store sharding by aggregate_id
- 🔗 [Caching Patterns](./caching-patterns.md) — read-side projections are a form of materialized cache

**Cross-track:**

- ➡️ [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md) — Saga + CQRS + Event Sourcing combined patterns
- 🔗 [Advanced Problems](../../be-track/04-be-system-design/03-advanced-problems.md) — payment/booking systems use ES+CQRS
- 🔗 [Database Sharding](../03-database/04-sharding-and-transactions.md) — event store sharding strategies differ from OLTP
