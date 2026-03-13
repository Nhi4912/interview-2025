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

## Raft Leader Election Walkthrough / Raft Bầu Leader Chi Tiết

### Q: Walk through a complete Raft leader election step by step, including edge cases. / Mô tả chi tiết quá trình Raft bầu chọn leader, bao gồm các edge case? 🔴 Senior

**A:**

**Initial state**: All nodes start as Followers. Each follower has a random election timeout (150–300ms). The randomness is the key mechanism preventing simultaneous elections.

**Step-by-step election:**

```
Initial: [F:term=0] [F:term=0] [F:term=0]   (F = Follower)

Step 1: Node A's timeout fires first (say, 150ms vs B's 200ms, C's 250ms)
        A transitions to Candidate, increments term to 1, votes for itself

        [C:term=1] [F:term=0] [F:term=0]   (C = Candidate)

Step 2: A sends RequestVote(term=1, candidateId=A, lastLogIndex=0, lastLogTerm=0) to B and C

Step 3: B receives RequestVote
        - B's current term (0) < A's term (1) → update term to 1
        - B hasn't voted in term 1 → grant vote
        - B sends VoteGranted to A

Step 4: C receives RequestVote
        - C's current term (0) < A's term (1) → update term to 1
        - C hasn't voted → grant vote
        - C sends VoteGranted to A

Step 5: A receives votes from B and C (majority = 2 of 3)
        A transitions to Leader for term 1

        [L:term=1] [F:term=1] [F:term=1]   (L = Leader)

Step 6: A immediately sends AppendEntries (heartbeat, empty entries) to B and C
        to assert leadership and reset their election timers
```

**Edge case 1: Split vote (two candidates tie)**
```
Nodes: A (timeout=150ms), B (timeout=155ms), C (timeout=300ms)

Both A and B time out almost simultaneously in term 1:
- A votes for A, sends RequestVote to B and C
- B votes for B, sends RequestVote to A and C

A receives B's RequestVote — already voted for self in term 1 → DENY
B receives A's RequestVote — already voted for self in term 1 → DENY
C receives both — votes for whichever arrives first (say A) → A gets 2 votes, wins

If C votes for B before A's message arrives:
- A gets 1 vote (itself), B gets 2 votes → B wins

If split: A=1, B=1, C split → NO majority → election times out → new term, random timeouts → retry
```

**Edge case 2: Old leader comes back (network partition heals)**
```
Before partition: [L:term=1: A] [F: B] [F: C] [F: D] [F: E]

Partition: {A, B} | {C, D, E}

{C, D, E}: elect new leader C in term 2
[L:term=2: C] operates, commits entries, clients served

A (old leader, term=1): still sends heartbeats to B
B rejects if B updated to term=2

Partition heals:
A receives heartbeat from C with term=2
A's term (1) < C's term (2) → A immediately steps down to Follower
A updates term to 2, replicates C's log (overwrites any uncommitted entries)
```

**Key safety property**: A candidate can only win if its log is at least as up-to-date as the majority. "Up-to-date" = higher `lastLogTerm`, or same `lastLogTerm` with longer log. This prevents a stale node from becoming leader and overwriting committed entries.

**Raft leader election quan trọng cần nhớ**:
- Random timeout (150–300ms) = cơ chế chính tránh split vote liên tục
- Chỉ bỏ phiếu 1 lần mỗi term → first-come-first-served
- Term number = "logical clock" — node có term nhỏ hơn luôn nhường node có term lớn hơn
- Log completeness check: chỉ vote cho candidate có log ít nhất bằng mình → đảm bảo committed entries không bị mất

---

### Q: How does Raft compare to Paxos in theory and practical implementation? / So sánh Raft với Paxos về lý thuyết và thực tế? 🔴 Senior

**A:**

| Dimension | Paxos | Raft |
|---|---|---|
| **Primary goal** | Correctness proof | Understandability |
| **Leader model** | Weak (any proposer can try) | Strong (one leader per term) |
| **Log gaps** | Allowed — holes in log possible | Not allowed — must be contiguous |
| **Member changes** | Not specified in original paper | Built-in joint consensus |
| **Understandability** | Notoriously hard (Leslie Lamport himself noted this) | Designed to be teachable |
| **Equivalence** | Foundational | Proven equivalent to Multi-Paxos |
| **Real-world use** | Google Chubby, Zookeeper (ZAB), some databases | etcd, CockroachDB, TiKV, Consul |

**Why Paxos is hard to implement:**
1. Basic Paxos only decides a single value — you need Multi-Paxos for a replicated log
2. Multi-Paxos has holes: a leader can have gaps in the log requiring extra fill-in logic
3. Leader election is not specified — left to implementor
4. Membership changes not covered
5. The original paper describes the algorithm abstractly without implementation details

**What Raft specifies that Paxos doesn't:**
- Explicit leader election algorithm (randomized timeouts + RequestVote RPC)
- Log must be contiguous — AppendEntries forces followers to match leader exactly
- Membership changes via joint consensus (both old and new configs active simultaneously)
- Snapshotting to compact the log

**In practice, most "Paxos" implementations are actually Multi-Paxos with Raft-like properties** — the line between them is blurry. ZooKeeper's ZAB (ZooKeeper Atomic Broadcast) and Google's Chubby use Paxos-based algorithms with many of the same properties as Raft.

**Điểm khác biệt thực tế quan trọng nhất**:
- Raft có strong leader — tất cả writes đều qua leader, đơn giản hóa implementation
- Paxos: bất kỳ proposer nào cũng có thể thử → phức tạp hơn nhưng lý thuyết linh hoạt hơn
- Khi implement production system: chọn Raft (etcd, Consul) hoặc dùng thư viện có sẵn, đừng tự implement Paxos

---

### Q: What is ZooKeeper used for and how does it use consensus? / ZooKeeper dùng để làm gì và nó dùng consensus như thế nào? 🟡 Mid

**A:**

**ZooKeeper** is a distributed coordination service — not a general-purpose database. It uses ZAB (ZooKeeper Atomic Broadcast), a Paxos-inspired protocol, to replicate a small in-memory tree of "znodes."

**What ZooKeeper provides:**
1. **Distributed locks** — ephemeral nodes disappear when client disconnects → automatic lock release
2. **Leader election** — services compete to create `/election/leader` ephemeral node; whoever succeeds is leader
3. **Service discovery** — services register at `/services/my-svc/instance-{n}`, clients watch the node
4. **Configuration management** — central config that multiple services watch for changes
5. **Barrier synchronization** — all workers wait for a node to appear before proceeding

**ZooKeeper node types:**
```
Persistent nodes    — survive client disconnect (config, service registry)
Ephemeral nodes     — deleted when creator's session ends (locks, presence)
Sequential nodes    — appended with monotonic counter (/locks/lock-0000000001)
```

**Distributed lock pattern with ZooKeeper:**
```
1. Client A creates ephemeral sequential node: /locks/resource-000001
2. Client B creates: /locks/resource-000002
3. Client A checks — it has the lowest number → acquires lock, proceeds
4. Client B watches /locks/resource-000001 (predecessor)
5. Client A finishes, deletes /locks/resource-000001
6. ZooKeeper notifies Client B → B acquires lock
7. If Client A crashes: ephemeral node auto-deleted → B acquires lock (no stale lock)
```

**Why ZooKeeper uses consensus (ZAB):**
- All writes go through the leader, replicated to a majority before acknowledging
- All reads can go to any replica (slightly stale by default; use `sync()` for linearizable reads)
- This means ZooKeeper is CP — will refuse writes if it can't reach majority

**ZooKeeper limitations (why Kafka moved away from it):**
- Entire namespace in memory — doesn't scale to millions of znodes
- Write throughput limited (~10k writes/sec) — fine for coordination, not for data
- Operational complexity — separate cluster to manage
- Kafka 3.x replaced ZooKeeper with KRaft (Kafka's own Raft implementation)

**ZooKeeper trong hệ thống thực tế**:
- Kafka (phiên bản cũ): lưu broker metadata, partition leader election
- HBase: master election, region server coordination
- HDFS: NameNode HA với automatic failover
- Không dùng ZooKeeper cho: lưu trữ data lớn, high-write-throughput use cases

---

### Q: How does etcd power Kubernetes and what happens when etcd goes down? / etcd hoạt động trong Kubernetes như thế nào và điều gì xảy ra khi etcd down? 🔴 Senior

**A:**

**etcd's role in Kubernetes:**

etcd is the **single source of truth** for all cluster state. Every object in K8s — Pods, Services, Deployments, ConfigMaps, Secrets, RBAC policies — is stored as a key-value pair in etcd.

```
/registry/pods/default/my-app-7d9f8c-xk2lp  → Pod spec JSON
/registry/services/default/my-svc            → Service spec JSON
/registry/deployments/default/my-app         → Deployment spec JSON
/registry/secrets/default/my-secret         → encrypted Secret JSON
```

**How the API server uses etcd:**
1. `kubectl apply -f deployment.yaml` → API server validates → writes to etcd
2. etcd Raft replicates to majority → commits → notifies API server
3. API server sends watch events to controller-manager, scheduler, kubelet
4. Controllers reconcile actual state toward desired state

**etcd uses Raft** with these K8s-specific settings:
- Typical cluster: 3 or 5 etcd nodes (tolerates 1 or 2 failures respectively)
- `--heartbeat-interval=100ms`, `--election-timeout=1000ms` (tunable per cloud latency)
- All writes must go through the leader
- Watch API: clients subscribe to key prefix changes → used for all K8s control loop notifications

**What happens when etcd is degraded:**

| Scenario | Impact |
|---|---|
| 1 of 3 nodes down | Cluster fully operational (majority = 2) |
| 2 of 3 nodes down | **All writes fail** — API server returns 503 for write operations |
| Leader election in progress | Writes blocked for ~1–2s (election timeout) |
| All etcd down | Existing running Pods continue (kubelet cached state), but NO new scheduling, no new deployments |
| etcd data corrupted | Cluster may need restore from backup — catastrophic if no backup |

**Recovery from etcd failure:**
```bash
# Backup etcd (run periodically in production)
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot-$(date +%Y%m%d).db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Restore (disaster recovery)
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot.db \
  --data-dir=/var/lib/etcd-restore
```

**Production etcd best practices for K8s:**
- Run etcd on dedicated nodes (not shared with control plane) — isolates noisy neighbor issues
- Use SSD storage — etcd is I/O sensitive (fsync on every commit)
- 3 nodes minimum; 5 for large clusters (>100 nodes) or multi-AZ HA
- Backup every 30 minutes; test restore quarterly
- Separate etcd from application traffic — dedicated low-latency network

**Điểm mấu chốt về etcd trong K8s**:
- etcd down = control plane down = không deploy được gì mới
- Running workloads vẫn chạy (kubelet độc lập với etcd)
- Đây là lý do tại sao K8s backup strategy = etcd snapshot
- Khi phỏng vấn về K8s HA: luôn đề cập đến etcd quorum (3 hoặc 5 nodes, multi-AZ)
