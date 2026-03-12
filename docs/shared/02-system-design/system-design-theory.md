# System Design Theory / Lý Thuyết Thiết Kế Hệ Thống

> **Track**: Shared | **Difficulty**: 🟡 Mid → 🔴 Senior
> **See also**: [Caching Patterns](./caching-patterns.md) | [Replication & Partitioning](./replication-partitioning.md) | [Consensus Algorithms](./consensus-algorithms.md)

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
