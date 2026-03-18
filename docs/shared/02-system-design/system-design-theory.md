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

| Question | Level | Key Point |
|----------|-------|-----------|
| Vertical vs horizontal scaling | 🟢 | Vertical = simpler, limited; Horizontal = unlimited, distributed complexity |
| CAP theorem explained | 🟡 | P is mandatory → real choice is CP vs AP |
| Strong vs eventual consistency | 🟡 | Strong = always fresh; Eventual = converge over time, trade latency for scale |
| Capacity estimation | 🟡 | DAU → QPS → Storage → identify bottleneck |
| Monolith vs microservices | 🔴 | Default monolith; microservices earned via proven need + DevOps maturity |
| High availability design | 🔴 | Eliminate SPOF at every layer + circuit breakers + chaos engineering |

---

## Self-Check / Tự Kiểm Tra

- [ ] Tôi có thể giải thích sự khác biệt giữa vertical scaling và horizontal scaling không?
- [ ] Tôi có thể vẽ sơ đồ CAP Theorem và giải thích tại sao không thể có cả 3 không?
- [ ] Tôi có thể liệt kê 5 "building blocks" của system design (load balancer, cache, message queue, CDN, database)?
- [ ] Tôi có thể giải thích khi nào nên dùng SQL vs NoSQL không?
- [ ] Tôi có thể thiết kế một URL shortener đơn giản từ đầu không?

💬 **Feynman Prompt:** Giải thích System Design cho người không biết lập trình bằng một ví dụ từ cuộc sống hàng ngày (quán ăn, siêu thị, bệnh viện...).

---

## Connections / Liên Kết

- ⬅️ **Built on:** [Algorithms Theory](../01-cs-fundamentals/algorithms-theory.md) | [Data Structures](../01-cs-fundamentals/data-structures-theory.md) — các nền tảng CS cần có trước khi học System Design
- ➡️ **Enables:** [Caching Patterns](./caching-patterns.md) | [Replication & Partitioning](./replication-partitioning.md) — các pattern cụ thể của distributed systems
- 🔗 **Applied in:** [Go Backend](../../be-track/) — implement các system design concepts bằng Go
