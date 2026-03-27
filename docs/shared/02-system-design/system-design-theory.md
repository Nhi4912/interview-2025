# System Design Theory / Lý Thuyết Thiết Kế Hệ Thống

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Caching Patterns](./caching-patterns.md) | [Replication & Partitioning](./replication-partitioning.md) | [Consensus Algorithms](./consensus-algorithms.md)

---

## Real-World Scenario / Tình Huống Thực Tế

Năm 2010, Instagram ra mắt với 1 server duy nhất. Sau 3 tháng, họ có 1 triệu users — server sập.
Năm 2012, Facebook mua Instagram với 1 tỷ users đang hoạt động mỗi ngày.

**The question is:** làm thế nào một ứng dụng chia sẻ ảnh trở thành hệ thống phục vụ tỷ người dùng — xử lý hàng triệu uploads, likes, và feed requests mỗi giây — mà không sập?

Câu trả lời: **System Design** — khoa học thiết kế hệ thống có thể scale.

---

## What & Why / Cái Gì & Tại Sao

**Analogy / Liên Tưởng:**
Hãy tưởng tượng bạn mở quán phở. Lúc đầu chỉ 5 khách/ngày: 1 đầu bếp, 1 bàn, 1 nồi là đủ.
Nhưng nếu 5.000 khách/ngày? Bạn cần: nhiều bếp (horizontal scaling), chia ca (load balancing), kho lạnh riêng (caching), nhiều chi nhánh (distributed systems), và quy trình chuẩn (consistency).

**System Design là gì?**
Đó là quá trình đưa ra các quyết định kiến trúc để một hệ thống có thể:

- **Scale**: phục vụ nhiều users hơn khi cần
- **Reliable**: không sập khi một phần bị lỗi
- **Maintainable**: dễ thêm tính năng mới mà không phá vỡ cái cũ

**Tại sao phải học System Design?**

- Phỏng vấn Senior/Staff tại big tech đều có vòng System Design
- Quyết định kiến trúc sai tốn hàng tháng để sửa (Twitter mất 3 năm migrate khỏi Rails monolith)
- Giúp bạn hiểu tại sao YouTube dùng CDN, Uber dùng geo-sharding, Discord dùng event streaming

**Core trade-off mọi system designer phải biết:**

> "You can have Consistency, Availability, or Partition tolerance — pick 2." — CAP Theorem

---

## Concept Map / Bản Đồ Khái Niệm

```
                    [SYSTEM DESIGN]
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
  [Requirements]    [Scalability]    [Reliability]
  - Functional      - Horizontal     - Redundancy
  - Non-functional  - Vertical       - Replication
  - Constraints     - Partitioning   - Fault tolerance
         │                │                │
         └────────────────┼────────────────┘
                          ▼
              [Distributed Systems Core]
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
  [CAP Theorem]    [Consistency]     [Availability]
  - CP systems     - Strong          - 99.9% uptime
  - AP systems     - Eventual        - SLA/SLO/SLI
  - CA (myth)      - Causal
         │
         ▼
  [Building Blocks]
  - Load Balancer → Cache → Message Queue → CDN
  - SQL vs NoSQL → Sharding → Replication
  - Microservices vs Monolith → Service Mesh
```

**Bạn đang ở đây trong lộ trình học:**

```
Data Structures ──► Algorithms ──► [SYSTEM DESIGN] ──► Distributed Systems ──► SRE/Infra
```

---

## Overview / Tổng Quan

| #   | Concept                           | Vai trò                                                | Interview Weight |
| --- | --------------------------------- | ------------------------------------------------------ | ---------------- |
| 1   | **Scalability**                   | Vertical vs Horizontal, stateless design, auto-scaling | ⭐⭐⭐⭐⭐       |
| 2   | **CAP Theorem & PACELC**          | CP vs AP trade-off, partition handling                 | ⭐⭐⭐⭐⭐       |
| 3   | **Consistency Models**            | Strong → eventual spectrum, session guarantees         | ⭐⭐⭐⭐         |
| 4   | **Distributed Systems Fallacies** | 8 fallacies, time & ordering, failure modes            | ⭐⭐⭐⭐         |
| 5   | **Partitioning Strategies**       | Range, hash, consistent hashing, key selection         | ⭐⭐⭐⭐         |
| 6   | **Building Blocks**               | LB, cache, MQ, CDN, DB selection, service mesh         | ⭐⭐⭐⭐⭐       |
| 7   | **High Availability**             | Redundancy, failover, SLA/SLO/SLI, chaos engineering   | ⭐⭐⭐⭐         |

> Mối quan hệ: Scalability → requires Partitioning + Consistency trade-offs (CAP) → implemented via Building Blocks → monitored by HA metrics. Distributed Fallacies là lý do tại sao mọi thứ phức tạp hơn theory.

---

## 📋 Table of Contents

1. [System Design Fundamentals](#system-design-fundamentals)
2. [Scalability Theory](#scalability-theory)
3. [Distributed Systems Principles](#distributed-systems-principles)
4. [CAP Theorem Deep Dive](#cap-theorem-deep-dive)
5. [Consistency Models](#consistency-models)
6. [Partitioning Strategies](#partitioning-strategies)
7. [Replication Theory](#replication-theory)
8. [Load Balancing](#load-balancing)
9. [Caching Strategies](#caching-strategies)
10. [Message Queues & Event Streaming](#message-queues-event-streaming)
11. [Microservices Architecture](#microservices-architecture)
12. [Interview Questions](#interview-questions)

---

## 🎯 Learning Objectives

Master system design theory:

- Understand distributed systems principles
- Apply scalability patterns
- Design for reliability and availability
- Handle consistency trade-offs
- Architect microservices
- Make informed design decisions

---

## System Design Fundamentals

### What is System Design?

**English Definition:** System design is the process of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements.

**Định nghĩa (Tiếng Việt):** Thiết kế hệ thống là quá trình xác định kiến trúc, thành phần, module, giao diện và dữ liệu cho một hệ thống để đáp ứng các yêu cầu được chỉ định.

### System Design Mind Map

```
System Design
│
├── Requirements
│   ├── Functional Requirements
│   ├── Non-Functional Requirements
│   ├── Capacity Estimation
│   └── Constraints
│
├── Core Concepts
│   ├── Scalability (Vertical & Horizontal)
│   ├── Reliability & Availability
│   ├── Performance & Latency
│   ├── Consistency & Durability
│   └── Maintainability
│
├── Architecture Patterns
│   ├── Monolithic
│   ├── Microservices
│   ├── Service-Oriented (SOA)
│   ├── Event-Driven
│   └── Serverless
│
├── Distributed Systems
│   ├── CAP Theorem
│   ├── Consistency Models
│   ├── Consensus Algorithms
│   ├── Distributed Transactions
│   └── Failure Handling
│
├── Data Management
│   ├── Database Selection
│   ├── Partitioning/Sharding
│   ├── Replication
│   ├── Caching
│   └── Data Consistency
│
└── Infrastructure
    ├── Load Balancing
    ├── CDN
    ├── Message Queues
    ├── Service Discovery
    └── Monitoring & Logging
```

### Core Design Principles

**1. Separation of Concerns**

**Theory:** Divide system into distinct sections, each addressing a separate concern. This principle reduces complexity and improves maintainability.

**Benefits:**

- Reduced coupling between components
- Easier to understand and modify
- Better testability
- Parallel development possible

**Application:**

- Layered architecture (presentation, business, data)
- Microservices (separate services per domain)
- Module boundaries in monoliths

**2. Single Responsibility Principle**

**Theory:** Each component should have one reason to change. A component should do one thing and do it well.

**Implications:**

- Smaller, focused components
- Easier to test and maintain
- Clear boundaries
- Reduced side effects

**3. Loose Coupling, High Cohesion**

**Coupling Theory:**

- Degree of interdependence between components
- Low coupling: Components independent
- High coupling: Components tightly bound

**Cohesion Theory:**

- Degree to which elements within a component belong together
- High cohesion: Related functionality grouped
- Low cohesion: Unrelated functionality mixed

**Optimal Design:**

- Minimize coupling between components
- Maximize cohesion within components
- Use interfaces and abstractions
- Apply dependency injection

**4. Design for Failure**

**Theory:** Assume components will fail and design systems to handle failures gracefully.

**Principles:**

- Fail fast: Detect failures quickly
- Fail safe: Prevent cascading failures
- Graceful degradation: Maintain partial functionality
- Redundancy: Eliminate single points of failure

**Techniques:**

- Circuit breakers
- Timeouts and retries
- Bulkheads (isolation)
- Health checks
- Fallback mechanisms

---

## Scalability Theory

### Understanding Scalability

**Definition:** Scalability is the capability of a system to handle growing amounts of work by adding resources to the system.

**Theoretical Foundation:**

**Scalability Dimensions:**

1. **Load Scalability:** Handle increased requests/transactions
2. **Data Scalability:** Manage growing data volumes
3. **Geographic Scalability:** Serve users across regions
4. **Administrative Scalability:** Manage larger organizations

**Scalability Metrics:**

- **Throughput:** Requests processed per unit time
- **Latency:** Time to process single request
- **Resource Utilization:** Efficiency of resource usage
- **Cost per Transaction:** Economic scalability

### Vertical vs Horizontal Scaling

**Vertical Scaling (Scale Up):**

**Theory:** Increase capacity by adding more power (CPU, RAM, storage) to existing machines.

**Characteristics:**

- **Simplicity:** No architectural changes needed
- **Consistency:** Single machine, no distributed complexity
- **Limits:** Physical hardware limits
- **Cost:** Exponential cost increase
- **Downtime:** Requires system restart

**When to Use:**

- Small to medium applications
- Legacy systems
- Database servers (initially)
- When consistency is critical

**Horizontal Scaling (Scale Out):**

**Theory:** Increase capacity by adding more machines to the system.

**Characteristics:**

- **Unlimited Growth:** Add machines as needed
- **Fault Tolerance:** Redundancy built-in
- **Complexity:** Distributed system challenges
- **Cost:** Linear cost scaling
- **No Downtime:** Rolling deployments

**When to Use:**

- Large-scale applications
- Web services
- Stateless applications
- When high availability required

**Theoretical Comparison:**

**Amdahl's Law:**

- Theoretical speedup limited by sequential portion
- Applies to vertical scaling
- Diminishing returns at scale

**Gustafson's Law:**

- Speedup increases with problem size
- Applies to horizontal scaling
- Better for large-scale systems

### Scalability Patterns

**1. Stateless Architecture**

**Theory:** Design services without server-side session state. All state stored externally (database, cache, client).

**Benefits:**

- Easy horizontal scaling
- No session affinity needed
- Simple load balancing
- Better fault tolerance

**Challenges:**

- External state management
- Increased latency
- Consistency concerns

**2. Caching Strategy**

**Theory:** Store frequently accessed data in fast-access storage to reduce load on primary data sources.

**Cache Levels:**

- **Client-side:** Browser cache, local storage
- **CDN:** Edge caching for static content
- **Application:** In-memory cache (Redis, Memcached)
- **Database:** Query cache, buffer pool

**Cache Invalidation:**

- **Time-based (TTL):** Expire after duration
- **Event-based:** Invalidate on updates
- **Manual:** Explicit invalidation

**3. Database Scaling**

**Read Replicas:**

**Theory:** Create read-only copies of database to distribute read load.

**Characteristics:**

- Master handles writes
- Replicas handle reads
- Asynchronous replication
- Eventual consistency

**Sharding:**

**Theory:** Partition data across multiple databases based on a shard key.

**Strategies:**

- **Range-based:** Partition by value ranges
- **Hash-based:** Partition by hash function
- **Geographic:** Partition by location
- **Directory-based:** Lookup table for routing

**Challenges:**

- Cross-shard queries
- Rebalancing shards
- Hotspot management
- Transaction complexity

**4. Asynchronous Processing**

**Theory:** Decouple request processing from response, handling work asynchronously.

**Benefits:**

- Improved response times
- Better resource utilization
- Handles traffic spikes
- Enables retry logic

**Patterns:**

- Message queues
- Event-driven architecture
- Background jobs
- Webhooks

---

## Distributed Systems Principles

### Distributed Systems Theory

**Definition:** A distributed system is a collection of independent computers that appears to users as a single coherent system.

**Fundamental Challenges:**

**1. Network Unreliability**

**Theory:** Networks are inherently unreliable. Messages can be lost, delayed, duplicated, or reordered.

**Implications:**

- Cannot distinguish between slow and failed nodes
- Timeouts are necessary but imperfect
- Need retry mechanisms
- Idempotency important

**2. Partial Failures**

**Theory:** In distributed systems, some components can fail while others continue operating.

**Characteristics:**

- Failures are non-deterministic
- Cannot assume all-or-nothing
- Need failure detection
- Require isolation mechanisms

**3. Concurrency**

**Theory:** Multiple operations occur simultaneously across different nodes.

**Challenges:**

- Race conditions
- Deadlocks
- Ordering guarantees
- Consistency maintenance

**4. Lack of Global Clock**

**Theory:** No perfect way to synchronize clocks across distributed nodes.

**Implications:**

- Cannot rely on timestamps for ordering
- Need logical clocks (Lamport, Vector)
- Causality tracking required
- Consensus algorithms necessary

### Fallacies of Distributed Computing

**Theory:** Common false assumptions about distributed systems that lead to design flaws.

**The Eight Fallacies:**

1. **The network is reliable**
   - Reality: Networks fail, packets drop
   - Solution: Retry logic, timeouts, circuit breakers

2. **Latency is zero**
   - Reality: Network calls have significant latency
   - Solution: Minimize network calls, use caching, async processing

3. **Bandwidth is infinite**
   - Reality: Bandwidth is limited and costly
   - Solution: Compress data, batch requests, use CDNs

4. **The network is secure**
   - Reality: Networks are vulnerable to attacks
   - Solution: Encryption, authentication, authorization

5. **Topology doesn't change**
   - Reality: Network topology changes frequently
   - Solution: Service discovery, dynamic routing

6. **There is one administrator**
   - Reality: Multiple teams manage different parts
   - Solution: Clear ownership, documentation, APIs

7. **Transport cost is zero**
   - Reality: Serialization, network transfer have costs
   - Solution: Efficient protocols, minimize data transfer

8. **The network is homogeneous**
   - Reality: Different protocols, versions, implementations
   - Solution: Standard interfaces, versioning, compatibility

### Time and Ordering in Distributed Systems

**Physical Clocks:**

**Theory:** Real-world time measured by physical clocks.

**Problems:**

- Clock drift: Clocks run at different rates
- Clock skew: Clocks show different times
- Synchronization: NTP has limits (~100ms accuracy)

**Logical Clocks:**

**Lamport Timestamps:**

**Theory:** Assigns timestamps to events such that if event A causally precedes event B, then timestamp(A) < timestamp(B).

**Algorithm:**

- Each process maintains counter
- Increment counter on local event
- Send counter with messages
- Receiver takes max(local, received) + 1

**Properties:**

- Captures causal ordering
- Doesn't capture concurrency
- Simple to implement

**Vector Clocks:**

**Theory:** Extends Lamport clocks to capture concurrency and full causal relationships.

**Structure:**

- Each process maintains vector of counters
- One counter per process in system
- Tracks causal dependencies

**Properties:**

- Detects concurrent events
- Captures full causality
- Higher overhead than Lamport

**Hybrid Logical Clocks:**

**Theory:** Combines physical and logical clocks for better ordering with bounded clock skew.

**Benefits:**

- Monotonic timestamps
- Bounded by physical time
- Captures causality
- Used in modern databases (CockroachDB, YugabyteDB)

---

## CAP Theorem Deep Dive

### CAP Theorem Theory

**Statement:** In a distributed data store, it is impossible to simultaneously guarantee all three of the following properties:

1. **Consistency (C):** All nodes see the same data at the same time
2. **Availability (A):** Every request receives a response (success or failure)
3. **Partition Tolerance (P):** System continues operating despite network partitions

**Theoretical Foundation:**

**Proof Sketch:**

- Assume network partition occurs
- Nodes cannot communicate
- Must choose: wait for communication (lose availability) or proceed (lose consistency)
- Cannot have both during partition

**Important Clarifications:**

**1. Partition Tolerance is Not Optional**

**Theory:** In real distributed systems, network partitions will occur. Therefore, must choose between C and A during partitions.

**Implication:** Real choice is between CP and AP systems, not whether to tolerate partitions.

**2. CAP is About Trade-offs During Partitions**

**Theory:** CAP doesn't mean you can't have all three properties. It means during a partition, you must choose between consistency and availability.

**Normal Operation:** Can have both consistency and availability
**During Partition:** Must sacrifice one

**3. Consistency in CAP vs ACID**

**CAP Consistency:** All nodes see same data (linearizability)
**ACID Consistency:** Data satisfies integrity constraints

Different concepts despite same name.

### CP Systems (Consistency + Partition Tolerance)

**Theory:** Prioritize consistency over availability. During partition, system becomes unavailable rather than returning inconsistent data.

**Characteristics:**

- Strong consistency guarantees
- May reject requests during partitions
- Suitable for financial systems
- Requires consensus protocols

**Examples:**

- HBase
- MongoDB (with majority writes)
- Redis (with wait command)
- Zookeeper

**Use Cases:**

- Banking transactions
- Inventory management
- Booking systems
- Any system where correctness critical

### AP Systems (Availability + Partition Tolerance)

**Theory:** Prioritize availability over consistency. During partition, system remains available but may return stale or inconsistent data.

**Characteristics:**

- Always available for reads/writes
- Eventual consistency
- Conflict resolution needed
- Better user experience

**Examples:**

- Cassandra
- DynamoDB
- Riak
- CouchDB

**Use Cases:**

- Social media feeds
- Shopping carts
- User profiles
- Analytics systems

### PACELC Theorem

**Theory:** Extension of CAP that addresses behavior during normal operation (no partition).

**Statement:**

- **If Partition (P):** Choose between Availability (A) and Consistency (C)
- **Else (E):** Choose between Latency (L) and Consistency (C)

**Classification:**

**PA/EL Systems:**

- Prioritize availability during partitions
- Prioritize latency during normal operation
- Example: Cassandra, DynamoDB

**PA/EC Systems:**

- Prioritize availability during partitions
- Prioritize consistency during normal operation
- Example: MongoDB with eventual consistency

**PC/EL Systems:**

- Prioritize consistency during partitions
- Prioritize latency during normal operation
- Rare in practice

**PC/EC Systems:**

- Prioritize consistency always
- Example: Traditional RDBMS, Zookeeper

**Practical Implications:**

PACELC provides more nuanced understanding:

- CAP only addresses partition scenario
- PACELC addresses both partition and normal operation
- Helps make better design decisions
- Recognizes latency-consistency trade-off

---

## Consistency Models

### Consistency Model Spectrum

**Theory:** Consistency models define the order and visibility of operations in distributed systems. They form a spectrum from strong to weak consistency.

**Consistency Hierarchy:**

```
Strongest
  ↓
Linearizability (Atomic Consistency)
  ↓
Sequential Consistency
  ↓
Causal Consistency
  ↓
Eventual Consistency
  ↓
Weakest
```

### Strong Consistency Models

**1. Linearizability**

**Definition:** Operations appear to execute atomically and instantaneously at some point between invocation and response.

**Properties:**

- Strongest consistency model
- Operations have total order
- Matches intuition of single machine
- Real-time ordering preserved

**Formal Definition:**

- For any execution, there exists a total order of operations
- Order respects real-time ordering
- Each read returns most recent write

**Cost:**

- High latency (coordination required)
- Reduced availability during partitions
- Scalability limitations

**Use Cases:**

- Financial transactions
- Distributed locks
- Leader election
- Configuration management

**2. Sequential Consistency**

**Definition:** Operations appear to execute in some sequential order, and operations of each process appear in program order.

**Difference from Linearizability:**

- Doesn't preserve real-time ordering
- Only preserves per-process ordering
- Weaker but more achievable

**Properties:**

- Total order exists
- Per-process order maintained
- No real-time constraints

**3. Causal Consistency**

**Definition:** Operations that are causally related must be seen in the same order by all processes. Concurrent operations may be seen in different orders.

**Causal Relationships:**

- **Happens-before:** If A causes B, A happens before B
- **Concurrent:** If neither causes the other, they're concurrent

**Properties:**

- Preserves causality
- Allows concurrent operations to reorder
- Weaker than sequential consistency
- More scalable

**Implementation:**

- Vector clocks
- Dependency tracking
- Causal broadcast

### Weak Consistency Models

**1. Eventual Consistency**

**Definition:** If no new updates are made, eventually all replicas will converge to the same value.

**Properties:**

- No ordering guarantees
- Temporary inconsistency allowed
- High availability
- Low latency

**Convergence Guarantees:**

- **Liveness:** Eventually consistent
- **Safety:** No guarantee during convergence

**Conflict Resolution:**

- Last-write-wins (LWW)
- Version vectors
- CRDTs (Conflict-free Replicated Data Types)
- Application-level resolution

**2. Read-Your-Writes Consistency**

**Definition:** A process always sees its own writes.

**Properties:**

- Stronger than eventual consistency
- Weaker than causal consistency
- Good user experience
- Achievable with session affinity

**3. Monotonic Reads**

**Definition:** If a process reads value v, subsequent reads will return v or a newer value, never an older value.

**Properties:**

- Prevents reading stale data
- No time travel
- Achievable with sticky sessions

**4. Monotonic Writes**

**Definition:** Writes by a process are seen by all processes in the order they were issued.

**Properties:**

- Preserves write order per process
- Doesn't guarantee read order
- Useful for logging, messaging

### Session Guarantees

**Theory:** Consistency guarantees within a client session, combining multiple weak consistency models.

**Four Session Guarantees:**

1. **Read Your Writes:** See your own updates
2. **Monotonic Reads:** Don't go backwards in time
3. **Monotonic Writes:** Writes ordered
4. **Writes Follow Reads:** Writes after reads see those reads

**Implementation:**

- Session tokens
- Version tracking
- Sticky routing
- Client-side caching

---

## Partitioning Strategies

### Partitioning Theory

**Definition:** Partitioning (sharding) divides data across multiple nodes to improve scalability and performance.

**Goals:**

- Distribute load evenly
- Minimize cross-partition operations
- Enable horizontal scaling
- Maintain query performance

**Challenges:**

- Choosing partition key
- Handling hotspots
- Rebalancing partitions
- Cross-partition queries
- Maintaining consistency

### Partitioning Methods

**1. Range Partitioning**

**Theory:** Partition data based on ranges of partition key values.

**Characteristics:**

- **Simplicity:** Easy to understand and implement
- **Range Queries:** Efficient for range scans
- **Hotspots:** Risk of uneven distribution
- **Rebalancing:** Can split/merge ranges

**Example:**

- Users A-M on partition 1
- Users N-Z on partition 2

**Advantages:**

- Efficient range queries
- Simple routing logic
- Easy to add partitions

**Disadvantages:**

- Hotspot risk (sequential keys)
- Requires knowledge of data distribution
- Manual rebalancing may be needed

**2. Hash Partitioning**

**Theory:** Apply hash function to partition key, use hash to determine partition.

**Characteristics:**

- **Even Distribution:** Hash function distributes uniformly
- **No Range Queries:** Cannot efficiently scan ranges
- **Consistent Hashing:** Minimize rebalancing
- **Deterministic:** Same key always goes to same partition

**Hash Functions:**

- MD5, SHA-1 (cryptographic)
- MurmurHash, CityHash (non-cryptographic, faster)
- Consistent hashing (special case)

**Advantages:**

- Even load distribution
- Prevents hotspots
- Simple implementation

**Disadvantages:**

- No range query support
- Rebalancing requires rehashing
- Lost locality

**3. Consistent Hashing**

**Theory:** Hash both nodes and keys onto a ring. Each key assigned to first node clockwise on ring.

**Properties:**

- **Minimal Rebalancing:** Only K/N keys move when adding/removing nodes
- **Virtual Nodes:** Improve distribution
- **Fault Tolerance:** Automatic failover

**Algorithm:**

1. Hash nodes onto ring (0 to 2^32-1)
2. Hash keys onto same ring
3. Assign key to next node clockwise
4. Use virtual nodes for better distribution

**Advantages:**

- Minimal data movement on rebalancing
- Automatic load distribution
- Fault tolerance built-in

**Disadvantages:**

- More complex than simple hashing
- Still no range query support
- Requires careful virtual node configuration

**4. Directory-Based Partitioning**

**Theory:** Maintain lookup table (directory) mapping keys to partitions.

**Characteristics:**

- **Flexibility:** Any partitioning scheme
- **Dynamic:** Easy to rebalance
- **Overhead:** Directory lookup required
- **Single Point of Failure:** Directory must be highly available

**Advantages:**

- Maximum flexibility
- Easy rebalancing
- Support any access pattern

**Disadvantages:**

- Directory is bottleneck
- Additional complexity
- Directory must be distributed

### Partition Key Selection

**Theory:** Choosing the right partition key is critical for system performance and scalability.

**Criteria:**

**1. Cardinality:**

- High cardinality preferred
- More unique values = better distribution
- Low cardinality causes hotspots

**2. Access Patterns:**

- Align with query patterns
- Minimize cross-partition queries
- Consider read vs write patterns

**3. Data Distribution:**

- Uniform distribution ideal
- Avoid skewed distributions
- Monitor and adjust

**4. Growth:**

- Consider future growth
- Avoid keys that concentrate over time
- Plan for rebalancing

**Anti-Patterns:**

**Sequential IDs:**

- All writes go to latest partition
- Creates hotspot
- Solution: Hash ID or use UUID

**Timestamp-based:**

- Recent data concentrated
- Time-based hotspots
- Solution: Combine with other attributes

**Low Cardinality:**

- Few unique values
- Uneven distribution
- Solution: Composite keys

---

## Summary

### Key Theoretical Concepts

1. **Scalability**
   - Vertical vs horizontal scaling
   - Stateless architecture
   - Caching strategies
   - Database scaling patterns

2. **Distributed Systems**
   - Network unreliability
   - Partial failures
   - Time and ordering
   - Consensus requirements

3. **CAP Theorem**
   - Consistency vs Availability trade-off
   - Partition tolerance mandatory
   - PACELC extension
   - System classification

4. **Consistency Models**
   - Strong to weak spectrum
   - Linearizability vs eventual consistency
   - Session guarantees
   - Trade-offs and use cases

5. **Partitioning**
   - Range vs hash partitioning
   - Consistent hashing
   - Partition key selection
   - Rebalancing strategies

### Design Principles

✅ **DO:**

- Design for failure
- Choose appropriate consistency model
- Select partition keys carefully
- Monitor and measure
- Plan for growth

❌ **DON'T:**

- Assume network reliability
- Ignore CAP theorem
- Create hotspots
- Over-engineer initially
- Neglect operational concerns

---

**See also**: [Caching Patterns](./caching-patterns.md) | [Replication & Partitioning](./replication-partitioning.md) | [Consensus Algorithms](./consensus-algorithms.md)

---

## Core Concepts — Phase 2 Deep Treatment

### Concept 1: Scalability (Vertical vs Horizontal)

🪝 **Memory Hook:** Vertical = tập gym (stronger but one body). Horizontal = clone army (many bodies, need coordination). / Vertical = một người khỏe hơn; Horizontal = nhiều người phải phối hợp.

**Why exists (2+ levels):**

- Level 1: Single server has physical limits (CPU, RAM, disk I/O)
- Level 2: Moore's Law slowing → vertical cost grows exponentially after certain point
- Level 3: Horizontal enables geographic distribution (latency) + fault isolation (blast radius)

**Layer 1 — Simple Analogy:** Quán phở 1 bếp: nấu nhanh hơn (vertical) hay mở 5 chi nhánh (horizontal)? Vertical có trần, horizontal cần quy trình chuẩn.

**Layer 2 — Mechanics + Visual:**

```
VERTICAL                          HORIZONTAL
┌─────────────┐                  ┌────┐ ┌────┐ ┌────┐
│ 256GB RAM   │                  │ 8GB│ │ 8GB│ │ 8GB│
│ 64 cores    │     vs           │ 4c │ │ 4c │ │ 4c │
│ single box  │                  └──┬─┘ └──┬─┘ └──┬─┘
│ SPOF!       │                     │      │      │
└─────────────┘                  ┌──┴──────┴──────┴──┐
                                 │   Load Balancer    │
                                 └────────────────────┘
```

Key mechanics: Stateless services (session → Redis), auto-scaling (CPU/memory triggers), data partitioning for DB layer.

**Layer 3 — Edge Cases:**

- Stateful services (WebSocket, game servers) need sticky sessions or connection draining
- Database horizontal scaling requires sharding → cross-shard queries expensive
- Auto-scaling lag: cold start 30-60s → pre-warming for predictable spikes

| Sai lầm                       | Tại sao sai                                        | Đúng là                                                        |
| ----------------------------- | -------------------------------------------------- | -------------------------------------------------------------- |
| Scale vertical first always   | Cost grows exponentially; creates SPOF             | Vertical for DB (initially), horizontal for stateless services |
| Horizontal = just add servers | Need stateless design, shared-nothing architecture | Refactor state out first, then scale                           |
| Auto-scale solves everything  | Cold start lag, thundering herd on scale-down      | Combine with pre-warming + minimum instances                   |

🎯 **Interview Pattern:** "Design for 10x users" → show horizontal scaling path: stateless services → LB → read replicas → cache → sharding. Mention when vertical is simpler (small DB, single-region).

🔗 **Knowledge Chain:** Scalability → [Partitioning](./replication-partitioning.md) → [Caching](./caching-patterns.md) → [Load Balancing](./06-load-balancing.md)

---

### Concept 2: CAP Theorem & PACELC

🪝 **Memory Hook:** CAP = "Choose your poison": Consistency or Availability when network Partitions. PACELC adds: even without partition, Latency vs Consistency. / Khi mạng bị chia, chọn đúng hay chọn sống? Khi bình thường, chọn nhanh hay chọn đúng?

**Why exists (2+ levels):**

- Level 1: Network partitions ARE inevitable in distributed systems
- Level 2: Brewer's theorem (2000) proved mathematically: can't have all 3 simultaneously during partition
- Level 3: PACELC (Abadi 2012) extends: normal operation also forces latency/consistency trade-off

**Layer 1 — Simple Analogy:** 2 chi nhánh ngân hàng, đường dây điện thoại đứt. Chi nhánh A cho rút tiền (Available) → có thể overdraft. Chi nhánh A từ chối (Consistent) → khách bực. Chọn 1.

**Layer 2 — Mechanics + Visual:**

```
  Network Partition occurs!
          │
    ┌─────┴─────┐
    ▼           ▼
 [Node A]   [Node B]     Cannot communicate
    │           │
    ▼           ▼
 CP: refuse   AP: serve
 requests     stale data
 until heal   resolve later
```

- CP examples: ZooKeeper, etcd, HBase, MongoDB (default)
- AP examples: Cassandra, DynamoDB, CouchDB
- CA: only possible on single node (no real distribution)
- PACELC: DynamoDB = PA/EL (available during partition, low latency normally)

**Layer 3 — Edge Cases:**

- "Partition" includes network delay > timeout, not just full disconnection
- MongoDB: CP by default but can configure read preference to AP-like behavior
- Most systems are actually "tunable consistency" not pure CP or AP

| Sai lầm            | Tại sao sai                                             | Đúng là                                                           |
| ------------------ | ------------------------------------------------------- | ----------------------------------------------------------------- |
| Pick 2 of 3 freely | P is mandatory in distributed → real choice is CP or AP | Say "given P is inevitable, we choose CP or AP based on use case" |
| CA systems exist   | CA = single node = not distributed                      | CA only exists if you never have network issues (localhost)       |
| AP means data loss | AP means temporary inconsistency, not permanent loss    | Conflict resolution (LWW, vector clocks) eventually converges     |

🎯 **Interview Pattern:** "Is your design CP or AP?" → State: "Payment = CP (Raft/etcd), user profile cache = AP (Cassandra). CAP is per-subsystem, not per-system."

🔗 **Knowledge Chain:** CAP → [Consistency Models](#consistency-models) → [Consensus](./consensus-algorithms.md) → [Replication](./replication-partitioning.md)

---

### Concept 3: Consistency Models

🪝 **Memory Hook:** Consistency spectrum = ATM (strong) → social media likes (eventual). Stronger = slower. / Từ "luôn đúng nhưng chậm" đến "nhanh nhưng có thể sai tạm thời".

**Why exists (2+ levels):**

- Level 1: Replication creates multiple copies → which copy is "truth"?
- Level 2: Strong consistency requires coordination (Raft/Paxos) → latency cost
- Level 3: Session guarantees (read-your-writes) give "good enough" consistency at lower cost

**Layer 1 — Simple Analogy:** Google Docs: bạn thấy edit của người khác sau 0.5s (eventual). Bank transfer: bạn phải thấy balance mới ngay (strong). Instagram likes: eventual OK.

**Layer 2 — Mechanics + Visual:**

```
STRONG ◄──────────────────────────────────────► EVENTUAL
  │          │              │            │
Linearizable  Sequential    Causal      Eventual
(real-time)  (global order) (dependency) (converge)
  │          │              │            │
 Raft       Spanner        CRDT        DynamoDB
 etcd       (TrueTime)    (Riak)      Cassandra
```

Key: Read-your-writes = after write W, all subsequent reads from same client see W. Monotonic reads = once you see value X, you never see older value.

**Layer 3 — Edge Cases:**

- Linearizability ≠ serializability (one is about single-object real-time, other is about transactions)
- Causal consistency: sufficient for most social apps (see your own posts, replies after original)
- Session guarantees can be broken by load balancer routing to different replica

| Sai lầm                         | Tại sao sai                                                                                          | Đúng là                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Eventual = inconsistent forever | Eventual converges (guaranteed) — just takes time                                                    | Eventual = "will be consistent, just not immediately" |
| Strong consistency everywhere   | Latency penalty: Raft commit = 2 round trips minimum                                                 | Strong for writes, eventual for reads (read replicas) |
| Linearizable = serializable     | Different concepts: linearizable = real-time single-object; serializable = multi-object transactions | Know the distinction — common interview trap          |

🎯 **Interview Pattern:** Name the consistency model for each subsystem: "Payment: linearizable. Feed: eventual. Chat: causal (see your own messages in order)."

🔗 **Knowledge Chain:** Consistency → [Replication](./replication-partitioning.md) → [Consensus](./consensus-algorithms.md) → [Distributed Systems](../../be-track/02-backend-knowledge/03-distributed-systems.md)

---

### Concept 4: Distributed Systems Fallacies

🪝 **Memory Hook:** 8 lies developers believe: "The network is reliable" is #1. Every fallacy = a production incident waiting to happen. / 8 lời nói dối mà dev tin: "mạng luôn ổn" — cho đến khi 3am on-call.

**Why exists (2+ levels):**

- Level 1: Peter Deutsch (1994) documented recurring mistakes in distributed system design
- Level 2: Each fallacy maps to a specific failure mode (timeout, split-brain, data corruption)
- Level 3: Understanding fallacies prevents designing systems that work only in happy path

**Layer 1 — Simple Analogy:** Gửi thư qua bưu điện: có thể mất, trễ, bị trùng (gửi 2 lần), đến sai thứ tự. Mạng cũng vậy — nhưng dev quên.

**Layer 2 — Mechanics + Visual:**

```
8 FALLACIES → PRODUCTION FAILURES
1. Network is reliable    → Retry + circuit breaker
2. Latency is zero        → Timeout + async
3. Bandwidth is infinite  → Pagination + compression
4. Network is secure      → mTLS + zero trust
5. Topology doesn't change → Service discovery
6. One administrator      → Config management
7. Transport cost is zero  → Batch + edge compute
8. Network is homogeneous → Protocol negotiation
```

**Layer 3 — Edge Cases:**

- Time ordering: NTP drift can be 100ms+ → use logical clocks (Lamport, vector clocks) for ordering
- Network partition ≠ node failure: partially connected networks are hardest to handle
- Byzantine failures in practice: bit flips in memory (ECC), corrupted packets (TCP checksums)

| Sai lầm                      | Tại sao sai                                              | Đúng là                                                      |
| ---------------------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| Retry fixes network issues   | Retry without idempotency → duplicate operations         | Retry + idempotency key + exponential backoff                |
| Set timeout to 30s           | Too long: cascading failures. Too short: false positives | Context-dependent: 99th percentile latency × 2               |
| Assume clock synchronization | NTP drift can be 100ms+; wall clock ≠ monotonic clock    | Use logical clocks for ordering, wall clock only for display |

🎯 **Interview Pattern:** When designing, mention: "Network is unreliable so I add retries with idempotency. Latency is non-zero so I add timeouts and async processing."

🔗 **Knowledge Chain:** Fallacies → [Resilience Patterns](../../be-track/02-backend-knowledge/07-resilience-patterns.md) → [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md)

---

### Concept 5: Partitioning Strategies

🪝 **Memory Hook:** Partitioning = chia thư viện theo alphabet: A-M tầng 1, N-Z tầng 2. Hash = blender (even distribution), Range = alphabetical (range queries). / Chia dữ liệu để mỗi server chỉ giữ 1 phần.

**Why exists (2+ levels):**

- Level 1: Single DB can't handle 1B rows with acceptable latency
- Level 2: Partitioning enables parallel processing + data locality
- Level 3: Bad partition key → hot spots → worse than no partitioning

**Layer 1 — Simple Analogy:** Kho hàng Amazon: không thể để 1 tỷ sản phẩm trong 1 kho. Chia theo category (range) hay theo mã hash (even distribution)?

**Layer 2 — Mechanics + Visual:**

```
RANGE PARTITIONING:        HASH PARTITIONING:
[A-F] [G-M] [N-S] [T-Z]   hash(key) % N → shard
  │     │     │     │        │
Good: range queries        Good: even distribution
Bad: hot spots (popular    Bad: no range queries
     letters)                   cross-shard join
```

Consistent hashing: virtual nodes → minimal redistribution when adding/removing servers. Key selection: high cardinality, even distribution, immutable, appears in most queries.

**Layer 3 — Edge Cases:**

- Time-based partitioning: all new writes go to latest partition → hot spot
- Cross-shard transactions: 2PC needed → slow, avoid by design
- Resharding: consistent hashing moves ~K/N keys (K total, N servers)

| Sai lầm                        | Tại sao sai                                         | Đúng là                                            |
| ------------------------------ | --------------------------------------------------- | -------------------------------------------------- |
| Shard by created_at            | All new writes to one shard = hot spot              | Use composite key: tenant_id + created_at          |
| Jump to sharding first         | Premature optimization; read replicas + cache first | Shard only when single-node DB can't handle writes |
| Shard key can be changed later | Resharding = massive data migration, weeks of work  | Choose shard key carefully from day 1              |

🎯 **Interview Pattern:** "For a social media app with 100M users, I'd shard by user_id (hash) — high cardinality, even distribution, and most queries are per-user."

🔗 **Knowledge Chain:** Partitioning → [Replication](./replication-partitioning.md) → [DB Sharding](../03-database/04-sharding-and-transactions.md) → [Consistent Hashing](../../be-track/02-backend-knowledge/03-distributed-systems.md)

---

### Concept 6: Building Blocks Selection

🪝 **Memory Hook:** System design = LEGO: 6 blocks (LB, Cache, MQ, CDN, DB, Service Mesh). Every design interview uses 4+ of these. / 6 khối LEGO: mọi system design đều ghép từ chúng.

**Why exists (2+ levels):**

- Level 1: Every large-scale system is composed of the same fundamental components
- Level 2: Knowing when to use which block (and trade-offs) separates junior from senior
- Level 3: Block selection depends on requirements: read-heavy (cache+CDN), write-heavy (MQ+sharding), real-time (WebSocket+pub-sub)

**Layer 1 — Simple Analogy:** Nấu ăn: mọi món đều dùng muối, dầu, lửa — nhưng liều lượng khác nhau. System design: mọi hệ thống đều dùng LB, cache, DB — nhưng cấu hình khác nhau.

**Layer 2 — Mechanics + Visual:**

```
REQUEST FLOW (typical):
Client → CDN (static) → LB → App Server → Cache → DB
                              │
                              └→ MQ → Worker → DB
```

Selection guide: SQL (ACID, joins) vs NoSQL (scale, flexibility). Redis (cache, session) vs Memcached (simple cache). Kafka (event streaming, replay) vs RabbitMQ (task queue, routing).

**Layer 3 — Edge Cases:**

- CDN for dynamic content: edge computing (Cloudflare Workers) blurs the line
- Cache in front of MQ: pub to MQ, cache result for idempotency
- Service mesh (Istio/Linkerd): needed only at 50+ microservices scale

| Sai lầm                    | Tại sao sai                                                       | Đúng là                                                       |
| -------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| Always use NoSQL for scale | SQL + read replicas + caching handles most workloads              | Start SQL; migrate to NoSQL only for specific access patterns |
| Add all blocks from start  | Over-engineering; each block adds operational complexity          | Add blocks as you hit specific bottlenecks                    |
| Kafka for everything       | Kafka = complex, high throughput; overkill for simple task queues | RabbitMQ for task queues, Kafka for event streaming/replay    |

🎯 **Interview Pattern:** Draw request flow with blocks. For each block, state why: "LB for horizontal scale, Cache for read amplification, MQ for async processing, CDN for static assets."

🔗 **Knowledge Chain:** Building Blocks → [Caching](./caching-patterns.md) → [MQ](./05-message-queues.md) → [LB](./06-load-balancing.md) → [DB](../03-database/database-theory.md)

---

### Concept 7: High Availability Design

🪝 **Memory Hook:** HA = "no single point of failure" at EVERY layer. 99.99% = 52 minutes downtime/year. Each "9" costs 10x more. / Mỗi tầng phải có backup — từ LB đến DB.

**Why exists (2+ levels):**

- Level 1: Users expect always-on (Google, Netflix SLA = 99.99%+)
- Level 2: Revenue loss: Amazon loses ~$220K/minute of downtime
- Level 3: HA is a spectrum: 99.9% (8.7h/year) vs 99.99% (52min/year) vs 99.999% (5min/year)

**Layer 1 — Simple Analogy:** Bệnh viện có 2 máy phát điện: 1 cái hỏng, cái kia tự bật. Hệ thống cũng vậy — mỗi component cần redundancy.

**Layer 2 — Mechanics + Visual:**

```
SINGLE POINT OF FAILURE ELIMINATION:
                    ┌──► App-1
Client → DNS ──►  LB-1 ──► App-2  ──► DB Primary
         (route53) LB-2 ──► App-3      DB Standby
                    └──► App-4          (auto-failover)
         │              │               │
    Multi-AZ       Auto-scale      Read Replicas
```

Key metrics: SLA (contract), SLO (target), SLI (measurement). Error budget = 1 - SLO. Circuit breaker prevents cascade. Chaos engineering validates HA.

**Layer 3 — Edge Cases:**

- Multi-region active-active: hardest HA pattern (data consistency across regions)
- Cascading failures: one slow service → thread pool exhaustion → everything fails
- False positive health checks: LB removes healthy server → capacity crunch

| Sai lầm                   | Tại sao sai                                               | Đúng là                                                        |
| ------------------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| 99.99% SLA is easy        | Each "9" costs 10x more infrastructure + operational cost | Start with 99.9%, upgrade incrementally based on business need |
| Redundancy = HA           | Redundancy without automatic failover = manual HA (slow)  | Redundancy + automatic detection + automatic failover          |
| Test in staging is enough | Staging ≠ production scale, traffic, failure modes        | Chaos engineering in production (Netflix Chaos Monkey)         |

🎯 **Interview Pattern:** "Eliminate SPOF at every layer: multi-AZ LB, N+1 app servers, DB primary-standby with auto-failover, Redis Sentinel. Target SLO: 99.95% with error budget for deploys."

🔗 **Knowledge Chain:** HA → [Resilience Patterns](../../be-track/02-backend-knowledge/07-resilience-patterns.md) → [Observability](../../be-track/04-be-system-design/05-observability-and-scale.md) → [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md)

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What are the trade-offs between vertical and horizontal scaling? / Sự khác biệt giữa vertical và horizontal scaling là gì? 🟢 Junior

**A:** Vertical scaling (scale-up) adds more resources to a single machine — more CPU, RAM, storage. Simple but has a hard ceiling and creates a single point of failure. Horizontal scaling (scale-out) adds more machines — no ceiling, fault-tolerant, but requires the application to be stateless and adds distributed system complexity.

Vietnamese: Vertical scaling đơn giản hơn cho ứng dụng vì không cần xử lý distributed state. Nhưng giới hạn phần cứng và SPOF là vấn đề lớn. Horizontal scaling không có giới hạn lý thuyết nhưng đòi hỏi: stateless service, distributed cache/session, load balancer, và xử lý partial failure. Trong interview, nêu rõ: "bắt đầu với vertical scaling cho đơn giản, sau đó horizontal khi gần giới hạn hoặc khi cần HA."

---

### Q: Explain the CAP theorem with a concrete example. / Giải thích CAP theorem với ví dụ cụ thể? 🟡 Mid

**A:** CAP states that a distributed system can guarantee at most 2 of: Consistency (every read returns the latest write), Availability (every request gets a response), and Partition Tolerance (system works despite network splits). Since network partitions are unavoidable in distributed systems, the real choice is between CP and AP.

Example: During a network partition in a distributed database:

- **CP** (e.g., HBase, Zookeeper): Returns an error if it can't guarantee consistency — some requests fail but the data returned is always correct.
- **AP** (e.g., Cassandra, DynamoDB): Returns possibly stale data — requests succeed but may not reflect the latest write.

Vietnamese: Trong phỏng vấn, nhiều người nhầm nghĩ có thể chọn CA (không có P). Thực tế: network partition luôn xảy ra trong production, nên P bắt buộc. Trade-off thực tế là CP vs AP. Ví dụ thực tế: banking system chọn CP (không chấp nhận stale balance), social media feed chọn AP (stale post list không sao). PACELC mở rộng CAP: khi không có partition, còn trade-off giữa Latency và Consistency.

---

### Q: What is the difference between strong consistency and eventual consistency? / Sự khác biệt giữa strong consistency và eventual consistency? 🟡 Mid

**A:** Strong (linearizable) consistency: every read reflects the latest write — behaves like a single sequential machine. Any read after a write returns the new value, globally. Eventual consistency: given no new updates, all replicas will converge to the same value — but during propagation, different replicas may return different values.

```
Strong consistency (linearizable):
Client A writes X=1 at t=0
Client B reads X at t=1 → always sees X=1

Eventual consistency:
Client A writes X=1 at t=0 to Replica 1
Client B reads from Replica 2 at t=1 → may still see X=0
Client B reads from Replica 2 at t=100ms → sees X=1 (converged)
```

Vietnamese: Strong consistency dễ lập luận nhưng costly: yêu cầu coordination giữa replicas trước khi commit. Eventual consistency cho phép write nhanh hơn và scale tốt hơn, nhưng ứng dụng phải xử lý stale reads. Các mức giữa: read-your-own-writes, monotonic reads, causal consistency — từng mức giải quyết một anomaly cụ thể mà không cần full linearizability.

---

### Q: How would you estimate capacity for a new system? / Ước tính capacity cho hệ thống mới như thế nào? 🟡 Mid

**A:** Use back-of-envelope estimation: start with DAU (daily active users), estimate requests/user/day, calculate QPS, then estimate storage and bandwidth.

Example for a social media post service:

- 100M DAU × 10 posts read/day = 1B reads/day → ~12K reads/sec
- 100M DAU × 0.1 posts written/day = 10M writes/day → ~120 writes/sec
- Storage: 10M posts × 1KB = 10GB/day → 3.6TB/year
- Use 2-3x margin for peak traffic

Vietnamese: Capacity estimation trong interview không cần chính xác tuyệt đối — mục tiêu là: (1) chứng minh bạn biết đặt câu hỏi đúng, (2) xác định bottleneck sớm (DB? Network? Memory?), (3) quyết định kiến trúc dựa trên scale. Một số số hữu ích cần nhớ: disk seek ~10ms, memory access ~100ns, SSD ~1ms, 1Gbps network ~125MB/s. Nêu assumption rõ ràng và hỏi interviewer để align.

---

### Q: When should you choose microservices over monolith? / Khi nào chọn microservices thay vì monolith? 🔴 Senior

**A:** Default to a monolith. Choose microservices only when you have: (1) proven scaling bottlenecks that can't be solved vertically, (2) independent deployment needs across large teams, (3) heterogeneous technology requirements per domain, (4) mature DevOps (CI/CD, observability, service mesh).

Microservices add: distributed system complexity, network latency, partial failures, data consistency challenges (no ACID across services), and massive operational overhead (observability, deployment).

Vietnamese: "Microservices are earned, not designed" — Martin Fowler. Nhiều team chọn microservices từ đầu rồi hối tiếc vì chưa hiểu domain rõ, boundary dễ vẽ sai → distributed monolith. Quy trình đúng: monolith modular trước → identify seams (xác định ranh giới domain rõ ràng) → extract service khi có nhu cầu thực sự. Câu hỏi để quyết định: "Bao nhiêu team? Mỗi team có thể deploy độc lập không? Domain boundary có ổn định không?"

---

### Q: How do you design for high availability (99.99% uptime)? / Thiết kế cho high availability (99.99% uptime) như thế nào? 🔴 Senior

**A:** 99.99% = 52 minutes downtime/year. Achieve with: eliminate single points of failure (redundancy at every layer), health checks + auto-restart, multi-AZ/region deployment, circuit breakers to isolate failures, graceful degradation, chaos engineering to find hidden SPOFs.

```
HA Architecture Layers:
Load Balancer (active-passive pair)
    ↓
App Servers (N≥2, auto-scaling)
    ↓
Database (primary + standby, automatic failover)
    ↓
Cache (Redis Sentinel or Cluster)
    ↓
Storage (replicated, S3-level durability)
```

Vietnamese: 99.99% nghe đơn giản nhưng cần thiết kế xuyên suốt. Failure domains: dùng nhiều AZ để tránh datacenter failures. Health checks: readiness (có thể nhận traffic không?) vs liveness (cần restart không?). Circuit breaker: khi dependency chậm/lỗi, ngắt circuit để tránh cascade failure. Chaos engineering (Netflix Chaos Monkey): cố tình inject lỗi để tìm weakness trước khi production. SLA composition: nếu 3 dependency mỗi cái 99.9%, tổng = 99.9%^3 = 99.7% — phải thiết kế fallback cho từng dependency.

---

## Interview Q&A Summary / Tổng Kết

| Question                       | Level | Key Point                                                                     |
| ------------------------------ | ----- | ----------------------------------------------------------------------------- |
| Vertical vs horizontal scaling | 🟢    | Vertical = simpler, limited; Horizontal = unlimited, distributed complexity   |
| CAP theorem explained          | 🟡    | P is mandatory → real choice is CP vs AP                                      |
| Strong vs eventual consistency | 🟡    | Strong = always fresh; Eventual = converge over time, trade latency for scale |
| Capacity estimation            | 🟡    | DAU → QPS → Storage → identify bottleneck                                     |
| Monolith vs microservices      | 🔴    | Default monolith; microservices earned via proven need + DevOps maturity      |
| High availability design       | 🔴    | Eliminate SPOF at every layer + circuit breakers + chaos engineering          |

---

## Cold Call Simulation / Mô Phỏng Phỏng Vấn Bất Chợt

> ⚡ **Interviewer:** "Your e-commerce platform is growing from 1K to 100K daily active users. Walk me through how you'd scale it."

**30-second answer:**
"First, I separate stateless app servers behind a load balancer for horizontal scaling. Add Redis cache for product catalog (80% reads → cache hit ratio 95%+). Put static assets on CDN. For the database, start with read replicas; shard by tenant_id only when single primary can't handle writes. Add message queue for async order processing to decouple write spikes from payment processing."

> **Follow-up:** "What if you need 99.99% availability?"

"Eliminate SPOF at every layer: multi-AZ LB, N+2 app servers with auto-scaling, DB primary-standby with automatic failover (< 30s), Redis Sentinel cluster. Define SLI (request success rate, p99 latency), set SLO at 99.95% with error budget for deployments. Add circuit breakers on all external dependencies."

---

## Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại và trả lời 5 câu hỏi:

| #   | Type           | Question                                                                                   | Key Points                                                                                      |
| --- | -------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| 1   | 🔄 Retrieval   | Vẽ CAP Theorem diagram và giải thích tại sao CA không tồn tại trong distributed systems    | P mandatory → CP or AP; CA = single node only                                                   |
| 2   | 🎨 Visual      | Vẽ request flow qua 6 building blocks (Client → CDN → LB → App → Cache → DB + MQ → Worker) | Show cache hit/miss paths, async MQ branch                                                      |
| 3   | 🛠️ Application | E-commerce flash sale: 100K users/second. Thiết kế scaling strategy                        | Horizontal app servers + cache warming + MQ for orders + read replicas + CDN for product images |
| 4   | 🐛 Debug       | System 99.9% SLA nhưng tuần trước downtime 2 giờ. Root cause?                              | Check: SPOF in DB? LB health check false positive? Cascading failure from slow dependency?      |
| 5   | 🎓 Teach       | Giải thích Consistency Models spectrum cho junior dev bằng ví dụ thực tế                   | ATM = strong, Instagram likes = eventual, Chat = causal; stronger = slower                      |

💬 **Feynman Prompt:** Giải thích System Design cho người không biết lập trình bằng một ví dụ từ cuộc sống hàng ngày (quán ăn, siêu thị, bệnh viện...).

---

## Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | Timing | Focus                                                                  |
| ----- | ------ | ---------------------------------------------------------------------- |
| 1     | Day 1  | Đọc Overview + 7 Core Concepts (Hook + Layer 1)                        |
| 2     | Day 3  | Làm Self-Check không mở tài liệu; vẽ Concept Map từ trí nhớ            |
| 3     | Day 7  | Layer 2 mechanics: CAP, Consistency, Partitioning — giải thích cho bạn |
| 4     | Day 14 | Cold Call practice: trả lời mỗi câu trong 30s; review Common Mistakes  |
| 5     | Day 30 | Mock interview: design URL shortener applying all 7 concepts           |

---

## Connections / Liên Kết

**Same track (System Design):**

- ➡️ [Caching Patterns](./caching-patterns.md) — deep dive building block #2
- ➡️ [Replication & Partitioning](./replication-partitioning.md) — deep dive concepts 3+5
- ➡️ [Consensus Algorithms](./consensus-algorithms.md) — mechanism behind CP systems
- ➡️ [Load Balancing](./06-load-balancing.md) — deep dive building block #1
- ➡️ [Message Queues](./05-message-queues.md) — deep dive building block #3

**Cross-track:**

- 🔗 [Distributed Systems (BE)](../../be-track/02-backend-knowledge/03-distributed-systems.md) — Go implementation of distributed concepts
- 🔗 [System Design Framework (BE)](../../be-track/04-be-system-design/01-design-framework.md) — interview-specific design framework
- 🔗 [Database Theory](../03-database/database-theory.md) — SQL vs NoSQL deep dive
