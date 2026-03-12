# Event Sourcing & CQRS / Event Sourcing và CQRS

> **Track**: Shared | **Difficulty**: 🔴 Senior
> **See also**: [Message Queues](./05-message-queues.md) | [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md) | [System Design Theory](./system-design-theory.md)

---

## Overview / Tổng Quan

Hai pattern này giải quyết vấn đề khác nhau nhưng thường dùng cùng nhau:
- **Event Sourcing**: lưu *sự kiện* (events) thay vì *trạng thái hiện tại*
- **CQRS**: tách biệt *đọc* và *ghi* thành hai model riêng

Hay được hỏi ở Axon, Grab, các công ty làm financial/audit systems.

---

## Part 1: Event Sourcing

### Q: What is Event Sourcing and how does it differ from traditional storage? 🟡 Mid → 🔴 Senior

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

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Answer |
|----------|-------|-----------|
| What is Event Sourcing? | 🟡 | Store events not state — reconstruct state by replay |
| ES vs CRUD? | 🟡 | ES: audit trail, time travel, replay; CRUD: simpler, immediate |
| What is CQRS? | 🟡 | Separate read model and write model |
| Why combine ES+CQRS? | 🔴 | Events → publish to projectors → optimized read models |
| Event schema evolution? | 🔴 | Never delete old event types; use upcasting to handle old versions |
| When to avoid? | 🟡 | Simple CRUD, small teams, strong consistency requirement |

---

**See also**: [Message Queues](./05-message-queues.md) | [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md)
