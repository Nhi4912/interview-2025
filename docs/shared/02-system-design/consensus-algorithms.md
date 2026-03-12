# Consensus Algorithms / Thuật Toán Đồng Thuận Trong Hệ Thống Phân Tán

> **Track**: Shared | **Difficulty**: 🔴 Senior
> **See also**: [System Design Theory](./system-design-theory.md) | [Replication & Partitioning](./replication-partitioning.md) | [Distributed Systems](../../be-track/02-backend-knowledge/03-distributed-systems.md)

## Achieving Agreement in Distributed Systems / Đạt Được Sự Đồng Thuận

**English:** Consensus algorithms enable multiple nodes in a distributed system to agree on a single value or state, even in the presence of failures, forming the foundation of reliable distributed systems.

**Tiếng Việt:** Các thuật toán đồng thuận cho phép nhiều node trong hệ thống phân tán đồng ý về một giá trị hoặc trạng thái duy nhất, ngay cả khi có lỗi, tạo nền tảng cho các hệ thống phân tán đáng tin cậy.

## Consensus Problem

### Theoretical Foundation

**Definition:** The consensus problem requires processes to agree on a single value, where one or more processes may propose values.

**Formal Requirements:**

1. **Agreement (Safety):** All correct processes decide on the same value
2. **Validity (Safety):** Decided value must be proposed by some process
3. **Termination (Liveness):** All correct processes eventually decide
4. **Integrity:** Each process decides at most once

**Impossibility Results:**

**FLP Impossibility (1985):**
- No deterministic consensus algorithm can guarantee termination in asynchronous systems with even one faulty process
- Fundamental limitation of distributed systems
- Applies to crash failures only
- Real systems use timeouts and probabilistic guarantees

**CAP Theorem Connection:**
- Consensus requires coordination
- Coordination conflicts with availability during partitions
- CP systems use consensus
- AP systems avoid consensus

### Failure Models

**Crash Failures:**
- Process stops executing
- No incorrect behavior before crash
- Simplest failure model
- Most consensus algorithms handle this

**Byzantine Failures:**
- Process behaves arbitrarily
- May send conflicting messages
- Malicious or corrupted behavior
- Requires Byzantine Fault Tolerant (BFT) algorithms

**Network Failures:**
- Message loss
- Message delay
- Message duplication
- Network partitions

## Paxos Algorithm

### Theoretical Overview

**Definition:** Paxos is a family of protocols for solving consensus in a network of unreliable processors.

**Roles:**

1. **Proposers:** Propose values
2. **Acceptors:** Vote on proposals
3. **Learners:** Learn chosen value

**Phases:**

**Phase 1: Prepare**
- Proposer selects proposal number n
- Sends PREPARE(n) to acceptors
- Acceptors respond with promise not to accept proposals < n
- Acceptors return highest-numbered proposal they've accepted

**Phase 2: Accept**
- If majority responds, proposer sends ACCEPT(n, v)
- v is value from highest-numbered proposal or proposer's value
- Acceptors accept if they haven't promised higher number
- If majority accepts, value is chosen

**Theoretical Properties:**

**Safety:** Only one value can be chosen
**Liveness:** Eventually a value is chosen (with assumptions)
**Fault Tolerance:** Tolerates f failures with 2f+1 acceptors

**Why Paxos is Difficult:**

1. **Complexity:** Multiple roles and phases
2. **Edge Cases:** Many subtle scenarios
3. **Liveness:** Not guaranteed without additional mechanisms
4. **Implementation:** Gap between theory and practice

### Multi-Paxos

**Theory:** Optimization of basic Paxos for multiple consensus instances.

**Improvements:**

1. **Leader Election:** Stable leader reduces messages
2. **Phase 1 Optimization:** Skip prepare phase when leader stable
3. **Batching:** Multiple values in single round
4. **Pipelining:** Overlap consensus instances

**Performance:**

- Basic Paxos: 2 round trips per decision
- Multi-Paxos with stable leader: 1 round trip per decision
- Significant improvement for sequential decisions

## Raft Algorithm

### Theoretical Overview

**Definition:** Raft is a consensus algorithm designed to be more understandable than Paxos while providing equivalent guarantees.

**Design Goals:**

1. **Understandability:** Primary goal
2. **Equivalence:** Same guarantees as Paxos
3. **Efficiency:** Practical performance
4. **Safety:** Strong consistency

**Core Concepts:**

**Leader Election:**
- One leader at a time
- Leader handles all client requests
- Leader replicates log to followers
- New election if leader fails

**Log Replication:**
- Leader appends entries to log
- Replicates to followers
- Commits when majority replicated
- Followers apply committed entries

**Safety:**
- Election Safety: At most one leader per term
- Leader Append-Only: Leader never overwrites log
- Log Matching: Logs consistent across servers
- Leader Completeness: Committed entries in future leaders
- State Machine Safety: Same log index → same command

### Raft States

**Three States:**

**Follower:**
- Passive state
- Responds to RPCs
- Becomes candidate if timeout
- Most servers in this state

**Candidate:**
- Requests votes
- Becomes leader if majority votes
- Returns to follower if loses
- Temporary state

**Leader:**
- Handles client requests
- Replicates log
- Sends heartbeats
- One per term

**State Transitions:**

```
Follower → (timeout) → Candidate
Candidate → (receives majority votes) → Leader
Candidate → (discovers leader/higher term) → Follower
Leader → (discovers higher term) → Follower
```

### Terms

**Theory:** Logical clock dividing time into terms.

**Properties:**
- Monotonically increasing
- At most one leader per term
- Some terms have no leader
- Used to detect stale information

**Term Comparison:**

- Higher term always wins
- Servers update to higher terms
- Reject messages from lower terms
- Ensures temporal ordering

### Log Replication

**Theory:** Maintain replicated log across servers.

**Log Structure:**

Each entry contains:
- Command for state machine
- Term when received
- Index in log

**Replication Process:**

1. Leader receives client request
2. Appends entry to local log
3. Sends AppendEntries RPC to followers
4. Waits for majority to replicate
5. Commits entry
6. Applies to state machine
7. Returns result to client

**Consistency Guarantees:**

**Log Matching Property:**
- If two logs contain entry with same index and term, they contain identical entries up to that index
- Maintained through consistency checks

**Commitment Rules:**

Entry is committed when:
- Stored on majority of servers
- At least one entry from current term committed
- All previous entries implicitly committed

## Practical Considerations

### Quorum Systems

**Theory:** Subset of nodes sufficient for operation.

**Quorum Requirements:**

For f failures:
- Read quorum + Write quorum > N
- Write quorum > N/2
- Typical: N = 2f + 1

**Quorum Types:**

**Majority Quorum:**
- Most common
- N/2 + 1 nodes
- Tolerates f = (N-1)/2 failures

**Weighted Quorum:**
- Nodes have different weights
- Flexible configurations
- Optimize for read/write patterns

### Leader Election

**Theory:** Select single leader among distributed nodes.

**Requirements:**

1. **Safety:** At most one leader
2. **Liveness:** Eventually elect leader
3. **Fairness:** All nodes have chance

**Election Strategies:**

**Bully Algorithm:**
- Highest ID becomes leader
- Simple but inefficient
- O(n²) messages

**Ring Algorithm:**
- Pass token in ring
- O(n) messages
- Deterministic

**Raft Election:**
- Randomized timeouts
- Majority vote
- Term-based

### Split Brain Problem

**Theory:** Network partition causes multiple leaders.

**Consequences:**
- Conflicting decisions
- Data inconsistency
- System corruption

**Prevention:**

1. **Quorum:** Require majority for leadership
2. **Fencing:** Prevent old leader from acting
3. **Generation Numbers:** Detect stale leaders
4. **Witness Nodes:** Break ties

## Byzantine Fault Tolerance

### Byzantine Generals Problem

**Theory:** Achieve consensus when some processes may be malicious.

**Problem Statement:**

Generals must agree on attack/retreat, but some may be traitors sending conflicting messages.

**Requirements:**

1. All loyal generals decide on same plan
2. Small number of traitors cannot cause loyal generals to adopt bad plan

**Impossibility Result:**

Requires 3f + 1 generals to tolerate f traitors.

### PBFT (Practical Byzantine Fault Tolerance)

**Theory:** Practical algorithm for Byzantine consensus.

**Phases:**

1. **Pre-Prepare:** Primary broadcasts proposal
2. **Prepare:** Replicas broadcast prepare messages
3. **Commit:** Replicas broadcast commit messages
4. **Reply:** Execute and reply to client

**Requirements:**

- 3f + 1 replicas for f failures
- Cryptographic signatures
- View changes for leader failures

**Performance:**

- O(n²) message complexity
- Expensive but practical
- Used in blockchain systems

## Interview Questions

**Q: What is the consensus problem? 🟡 [Mid]**

A: Consensus requires distributed processes to agree on single value. Must satisfy agreement (all decide same), validity (decided value was proposed), termination (all eventually decide), and integrity (decide once). FLP theorem proves impossible in asynchronous systems with failures.

**Q: Explain Paxos algorithm. 🔴 [Senior]**

A: Paxos achieves consensus through two phases: Prepare (proposer gets promises from acceptors) and Accept (proposer sends value, acceptors accept if no higher promise). Requires majority for decisions. Complex but foundational algorithm.

**Q: How does Raft differ from Paxos? 🟡 [Mid]**

A: Raft designed for understandability with strong leader, explicit leader election, and log replication. Provides same guarantees as Paxos but easier to understand and implement. Uses terms for logical time and randomized timeouts for elections.

**Q: What is Byzantine fault tolerance? 🔴 [Senior]**

A: Handling malicious or arbitrary failures where nodes may send conflicting messages. Requires 3f+1 nodes for f failures. PBFT is practical algorithm using three-phase protocol with cryptographic signatures.

**Q: Why is consensus important? 🟢 [Junior]**

A: Consensus is foundation for distributed systems enabling leader election, atomic broadcast, state machine replication, and distributed transactions. Critical for databases, coordination services, and blockchain systems.

---

**See also**: [System Design Theory](./system-design-theory.md) | [Replication & Partitioning](./replication-partitioning.md)
