# Distributed Systems Theory
## Theoretical Foundations of Distributed Computing

**English:** Distributed systems theory provides the mathematical foundations for understanding coordination, consistency, and fault tolerance in systems where components communicate over networks, establishing fundamental limits and possibilities.

**Tiếng Việt:** Lý thuyết hệ thống phân tán cung cấp nền tảng toán học để hiểu về điều phối, tính nhất quán và khả năng chịu lỗi trong các hệ thống mà các thành phần giao tiếp qua mạng, thiết lập các giới hạn và khả năng cơ bản.

## Table of Contents
1. [Models of Distributed Systems](#models-of-distributed-systems)
2. [Time and Causality](#time-and-causality)
3. [Consistency Models](#consistency-models)
4. [Consensus and Agreement](#consensus-and-agreement)
5. [Byzantine Fault Tolerance](#byzantine-fault-tolerance)
6. [CAP Theorem](#cap-theorem)
7. [Replication Theory](#replication-theory)
8. [Distributed Transactions](#distributed-transactions)
9. [Impossibility Results](#impossibility-results)
10. [Formal Verification of Distributed Systems](#formal-verification-of-distributed-systems)

## Models of Distributed Systems

### System Models

**Synchronous Model:**
- Bounded message delay
- Bounded processing time
- Synchronized clocks

**Asynchronous Model:**
- Unbounded message delay
- Unbounded processing time
- No clock synchronization

**Partially Synchronous:**
- Eventually synchronous
- Bounds exist but unknown
- Realistic model

**Network Models:**
- **Reliable:** No message loss
- **Fair-loss:** Messages may be lost but retransmission eventually succeeds
- **Arbitrary:** Messages can be lost, duplicated, reordered

### Failure Models

**Crash Failures:**
Process stops executing.
- Fail-stop: Failure detectable
- Fail-silent: Failure not detectable

**Omission Failures:**
Process fails to send/receive messages.
- Send omission
- Receive omission
- General omission

**Timing Failures:**
Process responds too late.
- Only relevant in synchronous systems

**Byzantine Failures:**
Arbitrary behavior.
- Malicious or corrupted processes
- Most general failure model

### Communication Primitives

**Point-to-Point:**
- send(m, p): Send message m to process p
- receive(): Receive message

**Broadcast:**
- broadcast(m): Send m to all processes
- deliver(m): Deliver m to application

**Properties:**
- **Validity:** If correct process broadcasts m, it eventually delivers m
- **Agreement:** If correct process delivers m, all correct processes deliver m
- **Integrity:** m delivered at most once, only if broadcast

**Reliable Broadcast:**
Guarantees all properties even with failures.

## Time and Causality

### Logical Clocks

**Lamport Timestamps:**
Each process maintains counter.

**Rules:**
1. Before event: increment counter
2. Send message: include timestamp
3. Receive message: max(local, received) + 1

**Happens-Before Relation:**
e₁ → e₂ if:
- e₁ and e₂ in same process and e₁ before e₂
- e₁ is send and e₂ is receive of same message
- Transitive closure

**Property:**
If e₁ → e₂, then timestamp(e₁) < timestamp(e₂)

**Limitation:**
Converse not true - concurrent events may have ordered timestamps.

### Vector Clocks

**Definition:**
Each process maintains vector of size n (number of processes).

**Rules:**
1. Before event: increment own component
2. Send message: include vector
3. Receive message: component-wise max, then increment own

**Happens-Before:**
V₁ < V₂ iff V₁[i] ≤ V₂[i] for all i and V₁ ≠ V₂

**Property:**
e₁ → e₂ iff V(e₁) < V(e₂)

**Concurrent Events:**
e₁ ∥ e₂ iff V(e₁) ∦ V(e₂) and V(e₂) ∦ V(e₁)

**Applications:**
- Causal ordering
- Distributed debugging
- Consistent snapshots

### Physical Time

**Clock Synchronization:**
Synchronize physical clocks across processes.

**Challenges:**
- Clock drift
- Network delay
- Asymmetric delays

**Cristian's Algorithm:**
Client requests time from server, estimates delay.

**Berkeley Algorithm:**
Master polls slaves, computes average, sends adjustments.

**Network Time Protocol (NTP):**
Hierarchical time synchronization.
- Stratum levels
- Multiple servers
- Statistical filtering

**Precision Time Protocol (PTP):**
Hardware-assisted synchronization.
- Nanosecond precision
- Used in data centers

## Consistency Models

### Strong Consistency

**Linearizability:**
Operations appear to execute atomically at some point between invocation and response.

**Properties:**
- Real-time ordering preserved
- Strongest consistency model
- Composable

**Example:**
```
P1: write(x, 1)
P2: write(x, 2)
P3: read(x) → 2
P4: read(x) → 2
```

All reads see 2 (latest write).

**Implementation:**
- Consensus required
- High latency
- Limited availability

### Sequential Consistency

**Definition:**
Result of execution is same as if operations executed in some sequential order, and operations of each process appear in order.

**Weaker than Linearizability:**
Real-time ordering not preserved.

**Example:**
```
P1: write(x, 1)
P2: write(x, 2)
P3: read(x) → 2
P4: read(x) → 1
```

Valid if P4's read ordered before P2's write.

### Causal Consistency

**Definition:**
Causally related operations seen in same order by all processes.

**Concurrent Operations:**
May be seen in different orders.

**Example:**
```
P1: write(x, 1)
P2: read(x) → 1; write(y, 2)
P3: read(y) → 2; read(x) → ?
```

P3 must see x = 1 (causally related).

**Implementation:**
- Vector clocks
- Causal broadcast
- Lower latency than sequential

### Eventual Consistency

**Definition:**
If no new updates, eventually all replicas converge.

**Properties:**
- High availability
- Low latency
- Weak guarantees

**Conflicts:**
Concurrent updates may conflict.

**Resolution:**
- Last-writer-wins
- Application-specific
- CRDTs

**Examples:**
- DNS
- Cassandra
- DynamoDB

## Consensus and Agreement

### Consensus Problem

**Definition:**
Processes propose values, must agree on one.

**Properties:**
- **Termination:** Every correct process eventually decides
- **Agreement:** All correct processes decide same value
- **Validity:** Decided value was proposed
- **Integrity:** Process decides at most once

**Variants:**
- Uniform consensus: All processes (including faulty) decide same value
- k-agreement: Decide on at most k values

### FLP Impossibility

**Theorem:**
No deterministic algorithm solves consensus in asynchronous system with even one crash failure.

**Proof Sketch:**
1. Show initial configurations can be univalent or bivalent
2. Prove bivalent configuration always reachable
3. System can remain bivalent forever

**Implications:**
- Fundamental limitation
- Assumptions needed: synchrony, randomization, or failure detectors

**Practical Impact:**
Real systems use timeouts (partial synchrony).

### Paxos

**Roles:**
- Proposers: Propose values
- Acceptors: Vote on proposals
- Learners: Learn chosen value

**Phases:**
1. **Prepare:** Proposer sends prepare(n)
2. **Promise:** Acceptor promises not to accept proposals < n
3. **Accept:** Proposer sends accept(n, v)
4. **Accepted:** Acceptor accepts if no higher promise

**Properties:**
- Safety: At most one value chosen
- Liveness: Eventually some value chosen (with assumptions)

**Multi-Paxos:**
Optimize for multiple consensus instances.
- Stable leader
- Skip prepare phase

### Raft

**Leader-Based:**
- Leader election
- Log replication
- Safety

**Terms:**
Logical time divided into terms.

**Leader Election:**
1. Follower times out, becomes candidate
2. Requests votes
3. Majority votes → leader

**Log Replication:**
1. Leader receives command
2. Appends to log
3. Replicates to followers
4. Commits when majority replicated

**Safety:**
- Election safety: At most one leader per term
- Leader append-only: Leader never overwrites log
- Log matching: If entries have same index/term, logs identical up to that point
- Leader completeness: If entry committed in term, present in all future leaders
- State machine safety: If server applies entry at index, no other server applies different entry at that index

## Byzantine Fault Tolerance

### Byzantine Generals Problem

**Scenario:**
Generals must agree on attack/retreat, some may be traitors.

**Requirements:**
- Agreement: All loyal generals decide same
- Validity: If commander loyal, all loyal generals follow

**Impossibility:**
No solution with ≤ 3m processes for m Byzantine failures.

**Possibility:**
Solution exists with > 3m processes.

### Byzantine Agreement Algorithms

**Lamport-Shostak-Pease:**
Exponential messages.

**Phases:**
Round-based message exchange.

**Complexity:**
- Messages: Exponential
- Rounds: m + 1

**Practical Byzantine Fault Tolerance (PBFT):**
Efficient Byzantine consensus.

**Phases:**
1. **Pre-prepare:** Primary assigns sequence number
2. **Prepare:** Replicas agree on sequence
3. **Commit:** Replicas commit

**Requirements:**
- 3f + 1 replicas for f failures
- Authenticated messages

**Performance:**
- Polynomial messages
- Constant rounds
- Used in blockchains

### Accountability

**Proof of Misbehavior:**
Cryptographic evidence of Byzantine behavior.

**Benefits:**
- Deterrence
- Forensics
- Recovery

**Techniques:**
- Signed messages
- Merkle proofs
- Verifiable logs

## CAP Theorem

### Statement

**Theorem:**
Distributed system cannot simultaneously provide:
- **Consistency:** All nodes see same data
- **Availability:** Every request receives response
- **Partition Tolerance:** System continues despite network partitions

**Trade-off:**
Choose at most two.

### Proof Sketch

**Scenario:**
Network partition separates nodes.

**Case 1 - CP:**
Reject requests to maintain consistency.
Sacrifices availability.

**Case 2 - AP:**
Accept requests on both sides.
Sacrifices consistency.

**Impossibility:**
Cannot have both during partition.

### Practical Implications

**CA Systems:**
Single-site databases.
- No partition tolerance
- Rare in distributed systems

**CP Systems:**
Consistent but may be unavailable.
- HBase
- MongoDB (default)
- Redis (with Sentinel)

**AP Systems:**
Available but eventually consistent.
- Cassandra
- DynamoDB
- Riak

**PACELC:**
Extension of CAP:
- If Partition: Availability vs. Consistency
- Else: Latency vs. Consistency

## Replication Theory

### Replication Strategies

**Primary-Backup:**
- One primary, multiple backups
- Primary handles all writes
- Backups replicate

**Multi-Primary:**
- Multiple primaries
- Concurrent writes
- Conflict resolution needed

**Quorum-Based:**
- Read quorum: R replicas
- Write quorum: W replicas
- R + W > N ensures consistency

### State Machine Replication

**Principle:**
Deterministic state machines with same initial state and same input sequence produce same output.

**Requirements:**
- Deterministic execution
- Total order of operations
- Fault tolerance

**Implementation:**
- Consensus for ordering
- Replicate log
- Apply operations

**Applications:**
- Distributed databases
- Replicated services
- Blockchain

### Chain Replication

**Structure:**
Linear chain of replicas.

**Operations:**
- Writes: Head → Tail
- Reads: Tail only

**Properties:**
- Strong consistency
- High throughput
- Simple recovery

**Failure Handling:**
- Head failure: Next becomes head
- Tail failure: Previous becomes tail
- Middle failure: Remove from chain

## Distributed Transactions

### ACID Properties

**Atomicity:**
All or nothing execution.

**Consistency:**
Maintains invariants.

**Isolation:**
Concurrent transactions don't interfere.

**Durability:**
Committed changes persist.

### Two-Phase Commit (2PC)

**Phases:**
1. **Prepare:** Coordinator asks participants to prepare
2. **Commit/Abort:** Coordinator decides based on votes

**Protocol:**
```
Coordinator:
  Send PREPARE to all participants
  If all vote YES:
    Send COMMIT to all
  Else:
    Send ABORT to all

Participant:
  Receive PREPARE
  If can commit:
    Vote YES, write undo/redo log
  Else:
    Vote NO
  Wait for decision
  Execute decision
```

**Blocking:**
Participants block if coordinator fails.

**Recovery:**
Coordinator logs decision before sending.

### Three-Phase Commit (3PC)

**Phases:**
1. **CanCommit:** Check if participants can commit
2. **PreCommit:** Prepare to commit
3. **DoCommit:** Actually commit

**Non-Blocking:**
Participants can make progress even if coordinator fails.

**Assumptions:**
Requires synchronous network.

**Trade-offs:**
More messages, but non-blocking.

### Distributed Deadlock

**Detection:**
- Wait-for graph
- Distributed cycle detection
- Timeout-based

**Prevention:**
- Timestamp ordering
- Wound-wait
- Wait-die

**Avoidance:**
- Resource ordering
- Banker's algorithm (impractical)

## Impossibility Results

### FLP Impossibility

**Statement:**
No deterministic consensus in asynchronous system with one crash failure.

**Significance:**
Fundamental limit of distributed computing.

**Circumvention:**
- Partial synchrony
- Randomization
- Failure detectors

### CAP Theorem

**Statement:**
Cannot have consistency, availability, and partition tolerance simultaneously.

**Significance:**
Fundamental trade-off in distributed systems.

**Practical Impact:**
System design must choose priorities.

### Lower Bounds

**Communication Complexity:**
Minimum messages for consensus: Ω(n²)

**Time Complexity:**
Minimum rounds for Byzantine agreement: f + 1

**Space Complexity:**
Minimum storage for replicated state machine.

**Impossibility of Consensus with Weak Failure Detectors:**
Some failure detector classes insufficient.

## Formal Verification of Distributed Systems

### Model Checking

**TLA+:**
Temporal Logic of Actions.

**Specification:**
- State variables
- Initial conditions
- Next-state relation
- Temporal properties

**Verification:**
- Exhaustive state exploration
- Counterexample generation
- Liveness checking

**Examples:**
- Raft
- Paxos
- Distributed databases

### Proof Assistants

**Coq:**
- Verdi: Framework for verified distributed systems
- Raft proof
- Key-value store proof

**Isabelle/HOL:**
- Distributed algorithm verification
- Protocol correctness

**Challenges:**
- Complexity of proofs
- Modeling assumptions
- Scalability

### Runtime Verification

**Monitoring:**
Check properties during execution.

**Techniques:**
- Distributed predicates
- Vector clocks
- Causal analysis

**Applications:**
- Debugging
- Anomaly detection
- Compliance checking

### Testing

**Deterministic Simulation:**
Control non-determinism for reproducibility.

**Fault Injection:**
Systematically inject failures.

**Jepsen:**
Test distributed systems under network partitions.

**Techniques:**
- Linearizability checking
- History analysis
- Invariant checking

## Interview Questions

**Q: Explain the FLP impossibility result and its practical implications.**

A: FLP theorem proves no deterministic algorithm can solve consensus in asynchronous systems with even one crash failure. The proof shows systems can remain in bivalent states forever. Practical implications: real systems use timeouts (partial synchrony), randomization (randomized consensus), or failure detectors. This explains why distributed systems need timeouts and why consensus is hard.

**Q: What is the difference between linearizability and sequential consistency?**

A: Linearizability requires operations to appear atomic at some point between invocation and response, preserving real-time ordering. Sequential consistency only requires operations to appear in some sequential order consistent with each process's program order, not necessarily real-time order. Linearizability is stronger and composable but harder to implement. Sequential consistency allows more flexibility but isn't composable.

**Q: Explain the CAP theorem and its practical implications.**

A: CAP theorem states distributed systems cannot simultaneously provide consistency, availability, and partition tolerance. During network partition, must choose between consistency (reject requests) or availability (accept potentially inconsistent requests). Practical implications: CP systems (HBase, MongoDB) prioritize consistency, AP systems (Cassandra, DynamoDB) prioritize availability. PACELC extends this: even without partitions, trade latency vs. consistency.

**Q: How does Paxos achieve consensus and what are its key properties?**

A: Paxos uses proposers, acceptors, and learners. Two phases: (1) Prepare - proposer gets promises from majority of acceptors, (2) Accept - proposer sends value, acceptors accept if no higher promise. Key properties: safety (at most one value chosen), liveness (eventually some value chosen with assumptions). Multi-Paxos optimizes by electing stable leader and skipping prepare phase. Used in many distributed systems.

**Q: Explain Byzantine fault tolerance and why 3f+1 replicas are needed.**

A: Byzantine faults are arbitrary failures including malicious behavior. Byzantine agreement requires > 3f replicas for f failures because: (1) Need majority of honest nodes, (2) Must tolerate f Byzantine nodes, (3) Must tolerate f nodes being slow/partitioned. With 3f+1 replicas, 2f+1 responses guarantee f+1 honest nodes (majority). PBFT implements this efficiently with polynomial messages and constant rounds.

---

[← Back to Formal Verification](./06-formal-verification.md) | [Next: Quantum Computing Theory →](./08-quantum-computing-theory.md)
