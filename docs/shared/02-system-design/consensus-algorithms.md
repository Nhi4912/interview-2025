# Consensus Algorithms / Thuật Toán Đồng Thuận Trong Hệ Thống Phân Tán

> **Track**: Shared | **Difficulty**: 🔴 Senior
> **See also**: [System Design Theory](./system-design-theory.md) | [Replication & Partitioning](./replication-partitioning.md) | [Distributed Systems](../../be-track/02-backend-knowledge/03-distributed-systems.md)

## Real-World Scenario / Tình Huống Thực Tế

**Kubernetes cluster at Grab (thực tế):** K8s control plane dùng etcd (Raft consensus) để lưu cluster state. Trong một maintenance window, 2 trong 5 etcd nodes bị restart cùng lúc — cluster vẫn hoạt động (quorum = 3/5). Khi engineer accidentally restart node thứ 3, cluster mất quorum → etcd bị block, không thể deploy pod mới, không thể schedule workloads. Running pods vẫn OK (kubelet local state), nhưng control plane "frozen". Fix: restart etcd nodes từng cái, không quá 1 tại một thời điểm.

**Bài học:** Consensus (Raft/Paxos) là không thể thiếu cho distributed systems với strong consistency. Quorum rule (majority) quyết định fault tolerance — hiểu điều này giúp design HA clusters đúng.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Consensus giống bầu chọn trong hội đồng: cần đa số phiếu (quorum) để ra quyết định. Nếu hội đồng có 5 thành viên, cần ít nhất 3 đồng ý. Raft là "chairman" (Leader) nhận proposals và broadcast → members ACK → leader commit khi nhận majority ACKs. Paxos là phiên bản phức tạp hơn của cùng nguyên lý.

**Why it matters:** etcd (K8s), ZooKeeper (Kafka, Hadoop), và Consul (service discovery) đều dùng consensus algorithms. Senior engineer được expect biết Raft basics, quorum math, và failure scenarios.

## Concept Map / Bản Đồ Khái Niệm

```
         ┌─────────────────────────────┐
         │  CONSENSUS PROBLEM          │
         │  FLP Impossibility (1985)   │
         └──────────┬──────────────────┘
                    │
         ┌──────────▼──────────────┐
         │  FAILURE MODELS         │
         │  Crash │ Byzantine      │
         └──┬─────────────────┬────┘
            │                 │
   ┌────────▼────────┐  ┌────▼──────────────┐
   │  CRASH TOLERANT │  │  BYZANTINE (BFT)  │
   │  2f+1 nodes     │  │  3f+1 nodes       │
   └──┬─────────┬────┘  │  PBFT protocol    │
      │         │        └──────────────────┘
 ┌────▼───┐ ┌──▼────┐
 │ PAXOS  │ │ RAFT  │
 │ 1989   │ │ 2014  │
 │ Theory │ │ Pract.│
 └────┬───┘ └──┬────┘
      │         │
      └────┬────┘
           │
   ┌───────▼──────────┐
   │  QUORUM SYSTEMS  │
   │  Majority rule   │
   │  R + W > N       │
   └───────┬──────────┘
           │
   ┌───────▼───────────────┐
   │  PRODUCTION SYSTEMS   │
   │  etcd │ ZK │ Consul   │
   └───────────────────────┘
```

## Overview / Tổng Quan

| #   | Concept / Khái niệm               | Role / Vai trò                              | Interview Weight                         |
| --- | --------------------------------- | ------------------------------------------- | ---------------------------------------- |
| 1   | **Consensus Problem & FLP**       | Lý thuyết nền tảng — tại sao đồng thuận khó | ⭐⭐ (biết FLP = senior signal)          |
| 2   | **Paxos Algorithm**               | Thuật toán đồng thuận gốc — hiểu lý thuyết  | ⭐⭐ (theory, hiếm khi hỏi chi tiết)     |
| 3   | **Raft Algorithm**                | Thuật toán production — etcd, CockroachDB   | ⭐⭐⭐⭐⭐ (must-know cho senior)        |
| 4   | **Quorum Systems**                | Toán học đằng sau fault tolerance           | ⭐⭐⭐⭐ (quorum math = instant test)    |
| 5   | **Leader Election & Split Brain** | Pattern thực tế — failure handling          | ⭐⭐⭐⭐ (always asked in system design) |
| 6   | **Byzantine Fault Tolerance**     | BFT — blockchain, adversarial environments  | ⭐⭐ (niche, biết concept là đủ)         |
| 7   | **Production Systems (etcd/ZK)**  | Ứng dụng thực tế — K8s, Kafka               | ⭐⭐⭐⭐⭐ (etcd = must for K8s roles)   |

**Relationship / Mối quan hệ:** FLP chứng minh consensus là bất khả thi trong async system → Paxos/Raft giải quyết bằng timeouts + quorum → etcd/ZK là implementation production. Byzantine mở rộng failure model cho adversarial cases. Quorum math là foundation chung cho tất cả.

---

## Core Concepts — Phase 2 Deep Treatment

### Concept 1: Consensus Problem & FLP Impossibility

🪝 **Memory Hook:** "FLP = ba chữ F-L-P = ba giáo sư chứng minh điều BẤT KHẢ THI duy nhất của distributed systems"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Nhiều node cần agree trên 1 value → cần protocol đảm bảo tất cả thấy cùng kết quả
- **Level 2:** Asynchronous network = không phân biệt được "node chết" vs "node chậm" → FLP 1985 chứng minh KHÔNG THỂ có deterministic consensus trong async model with 1 crash → buộc phải dùng timeouts (randomized/partial synchrony)

**Layer 1 — Analogy / Ví dụ đơn giản:**
Bầu cử trong phòng họp qua điện thoại — nếu 1 người không trả lời, bạn không biết họ "bận" hay "đã rời đi". Nếu chờ mãi → deadlock; nếu bỏ qua → sai kết quả.

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
FLP Impossibility (Fischer, Lynch, Paterson 1985):
┌─────────────────────────────────────────────┐
│ Given: Asynchronous model + 1 crash failure │
│                                             │
│ Prove: ∄ deterministic algorithm satisfying │
│   Agreement + Validity + Termination        │
│                                             │
│ Key insight: Always exists a "bivalent"     │
│   state where decision can go either way    │
│   → adversary delays messages to keep       │
│   system in bivalent state forever          │
│                                             │
│ Workaround: Partial synchrony (timeouts)    │
│   Raft: 150-300ms randomized timeout        │
│   Paxos: leader election with backoff       │
└─────────────────────────────────────────────┘
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- FLP chỉ áp dụng cho **deterministic** algorithms → randomized (Raft timeout) bypass FLP
- FLP chỉ nói về **crash** failures, không nói Byzantine
- Thực tế: không ai build async system thuần túy — luôn có timeout → FLP là theoretical limit, không phải practical blocker

| Sai lầm                                          | Tại sao sai                                      | Đúng là                                                       |
| ------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------- |
| "FLP means consensus is impossible"              | FLP only applies to deterministic + purely async | Raft/Paxos work because they use timeouts (partial synchrony) |
| "Consensus = all nodes must respond"             | Only majority needed                             | Quorum (N/2+1) is sufficient                                  |
| "FLP means we can't build distributed databases" | FLP is theoretical; real systems use timeouts    | etcd, ZK, CockroachDB all work in practice                    |

🎯 **Interview Pattern:** "Explain FLP impossibility" → Answer: 3 properties (agreement, validity, termination) can't all be satisfied in async + crash failure. Workaround: timeouts.

🔗 **Knowledge Chain:** FLP → Partial synchrony model → Paxos/Raft use timeouts → CAP theorem (consensus requires coordination → CP)

---

### Concept 2: Paxos Algorithm

🪝 **Memory Hook:** "Paxos = Parliament trên đảo Paxos — Leslie Lamport viết paper dưới dạng câu chuyện nghị viện Hy Lạp"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Cần protocol chứng minh được correctness cho consensus — Paxos là cái đầu tiên
- **Level 2:** Trước Paxos (1989), không có algorithm nào vừa safe vừa live cho consensus. Paxos chứng minh: với 2 phases (Prepare + Accept) và majority quorum, chỉ 1 value có thể được chọn

**Layer 1 — Analogy / Ví dụ đơn giản:**
Đề xuất ngân sách trong quốc hội: Phase 1 — "Tôi muốn đề xuất, ai sẵn sàng nghe?" (Prepare). Phase 2 — "Đây là con số, ai đồng ý?" (Accept). Cần quá bán đồng ý ở cả 2 phase.

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
Paxos Two-Phase Protocol:
┌─────────────────────────────────────────┐
│ PHASE 1: PREPARE                        │
│ Proposer → Acceptors: PREPARE(n)        │
│ Acceptors → Proposer: PROMISE(n, v_acc) │
│   "I promise not to accept < n"         │
│   "Here's the highest I've accepted"    │
│                                         │
│ PHASE 2: ACCEPT                         │
│ Proposer → Acceptors: ACCEPT(n, v)      │
│   v = highest v_acc OR proposer's value │
│ Acceptors → Proposer: ACCEPTED(n, v)    │
│   Accept if no higher promise made      │
│                                         │
│ COMMIT: Majority accepted → value chosen│
└─────────────────────────────────────────┘

Quorum math: 2f+1 nodes → tolerate f failures
  3 nodes → tolerate 1 failure
  5 nodes → tolerate 2 failures
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- **Dueling proposers:** 2 proposers keep increasing proposal numbers → livelock → Multi-Paxos fixes with stable leader
- **Holes in log:** Basic Paxos allows gaps in the replicated log → Multi-Paxos needs fill-in logic
- **Implementation gap:** Paper describes algorithm, not implementation → everyone implements differently

| Sai lầm                                 | Tại sao sai                                           | Đúng là                                             |
| --------------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| "Paxos is one algorithm"                | It's a family: Basic, Multi, Fast, Cheap, Egalitarian | Multi-Paxos is what production systems actually use |
| "Paxos guarantees liveness"             | Basic Paxos can livelock with dueling proposers       | Need Multi-Paxos with stable leader for liveness    |
| "I should implement Paxos from scratch" | Extremely hard to get right                           | Use etcd/Consul (Raft) or well-tested libraries     |

🎯 **Interview Pattern:** "Explain Paxos" → Answer: Two phases (Prepare/Accept), majority quorum, safety proven. In practice, use Raft instead because Paxos is hard to implement correctly.

🔗 **Knowledge Chain:** FLP impossibility → Paxos (first solution) → Multi-Paxos (practical) → Raft (understandable equivalent) → etcd/ZK

---

### Concept 3: Raft Algorithm

🪝 **Memory Hook:** "Raft = RAFT thuyền cứu sinh — 'cứu' developers khỏi Paxos phức tạp. 3 states: Follower → Candidate → Leader"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Paxos quá khó hiểu và implement → Raft designed specifically for understandability
- **Level 2:** Diego Ongaro (Stanford 2014) — same guarantees as Multi-Paxos nhưng decompose thành 3 sub-problems: Leader Election, Log Replication, Safety → mỗi phần có thể hiểu và implement riêng

**Layer 1 — Analogy / Ví dụ đơn giản:**
Lớp học có 1 giáo viên (Leader) giảng bài, học sinh (Followers) ghi chép theo. Nếu giáo viên vắng, lớp bầu giáo viên mới (Candidate → election). Giáo viên mới phải có bài giảng ít nhất bằng ai khác (log completeness).

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
Raft State Machine:
┌──────────┐  timeout   ┌───────────┐  majority   ┌────────┐
│ FOLLOWER ├───────────→│ CANDIDATE ├────────────→│ LEADER │
│          │←───────────│           │             │        │
│  Passive │  higher    │ Requests  │             │ All    │
│  Listen  │  term      │ Votes     │  higher     │ Writes │
│  Respond │            │ Self-vote │  term       │ Heart- │
└──────────┘            └───────────┘←────────────│ beats  │
                                                  └────────┘

Election: random timeout 150-300ms → first timeout = first candidate
          → RequestVote(term, lastLogIndex, lastLogTerm) to all
          → majority grants → becomes Leader
          → sends empty AppendEntries (heartbeat) immediately

Log Replication:
  Client → Leader: write request
  Leader: append to local log
  Leader → Followers: AppendEntries(entries, prevLogIndex, prevLogTerm)
  Majority ACK → Leader commits → apply to state machine
  Next heartbeat: followers learn commitIndex → apply locally
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- **Split vote:** 2 candidates cùng term → neither gets majority → timeout → new term with new random timeouts (extremely unlikely to repeat)
- **Network partition:** minority side can't elect leader (no quorum) → majority side elects new leader → partition heals → old leader steps down (lower term)
- **Log divergence:** follower has uncommitted entries from old leader → new leader overwrites (AppendEntries consistency check)
- **Pre-vote optimization:** prevents disrupted nodes from incrementing terms unnecessarily (etcd uses this)

| Sai lầm                           | Tại sao sai                                        | Đúng là                                        |
| --------------------------------- | -------------------------------------------------- | ---------------------------------------------- |
| "Raft always has a leader"        | During election, there's no leader (~1-2s)         | Most of the time yes, but election gaps exist  |
| "Followers can serve writes"      | All writes MUST go through leader                  | Followers can serve stale reads (configurable) |
| "4-node cluster is better than 3" | 4 nodes: quorum=3, tolerates 1 failure (same as 3) | Odd numbers: 3(tol 1), 5(tol 2), 7(tol 3)      |

🎯 **Interview Pattern:** "How does Raft work?" → 3 sub-problems: Leader Election (random timeout + majority vote), Log Replication (leader-driven, majority ACK), Safety (term comparison + log completeness). Always mention: odd number of nodes, quorum = N/2+1.

🔗 **Knowledge Chain:** Paxos (theory) → Raft (practical equivalent) → etcd (K8s) → CockroachDB/TiKV (distributed SQL)

---

### Concept 4: Quorum Systems

🪝 **Memory Hook:** "Quorum = QUO-RUM = 'enough for a meeting' — luôn cần hơn nửa phòng đồng ý"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Cần đảm bảo 2 operations bất kỳ luôn overlap ít nhất 1 node → consistency
- **Level 2:** Quorum math: R + W > N đảm bảo mọi read quorum chứa ít nhất 1 node có latest write. Majority quorum (N/2+1) là special case phổ biến nhất

**Layer 1 — Analogy / Ví dụ đơn giản:**
5 người giữ bản sao tài liệu. Khi cập nhật, gửi cho ít nhất 3 người. Khi đọc, hỏi ít nhất 3 người. Đảm bảo luôn có ít nhất 1 người trong nhóm đọc có bản mới nhất (3+3 > 5).

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
Quorum Mathematics:
┌────────────────────────────────────────┐
│ N = total nodes                        │
│ W = write quorum, R = read quorum      │
│                                        │
│ Safety: R + W > N                      │
│   → every read overlaps with writes    │
│                                        │
│ Majority: W = R = N/2 + 1             │
│   3 nodes: W=2, R=2 (overlap 1)       │
│   5 nodes: W=3, R=3 (overlap 1)       │
│   7 nodes: W=4, R=4 (overlap 1)       │
│                                        │
│ Fault tolerance: f = (N-1)/2          │
│   3 nodes → 1 failure                 │
│   5 nodes → 2 failures                │
│   7 nodes → 3 failures                │
│                                        │
│ Tunable: W=N, R=1 (read-heavy)        │
│          W=1, R=N (write-heavy)        │
│          As long as R+W > N            │
└────────────────────────────────────────┘
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- **Even number of nodes:** 4 nodes → quorum = 3, tolerates 1 failure (same as 3 nodes!) → wastes resources
- **Cross-datacenter quorum:** latency of quorum write = max(latency to quorum nodes) → put majority in primary DC
- **Flexible quorum (Dynamo-style):** W=1, R=N → fast writes, slow reads → eventual consistency

| Sai lầm                            | Tại sao sai                             | Đúng là                             |
| ---------------------------------- | --------------------------------------- | ----------------------------------- |
| "More nodes = more fault tolerant" | 4 nodes tolerates same as 3 (1 failure) | Use odd numbers: 3, 5, 7            |
| "Quorum means all nodes agree"     | Only majority needed                    | N/2+1 is sufficient for safety      |
| "5-node cluster is always better"  | More nodes = higher write latency       | 3 nodes suffices for most use cases |

🎯 **Interview Pattern:** "How many nodes for fault tolerance?" → N = 2f+1 for f failures. Always odd. 3 for most, 5 for HA. Quick math: "5-node etcd tolerates 2 failures, quorum = 3."

🔗 **Knowledge Chain:** Quorum → Raft (majority vote) → etcd (3 or 5 nodes) → K8s HA → multi-AZ deployment

---

### Concept 5: Leader Election & Split Brain

🪝 **Memory Hook:** "Split Brain = 2 bộ não trong 1 cơ thể — mỗi bên nghĩ mình đúng → catastrophe"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Distributed system cần 1 leader → network partition có thể tạo 2 leaders → data corruption
- **Level 2:** Split brain prevention = quorum rule: leader cần majority → partition chỉ có 1 side có majority → chỉ 1 leader. Fencing tokens (generation numbers) prevent old leader from writing after partition heals

**Layer 1 — Analogy / Ví dụ đơn giản:**
Công ty có 1 CEO. Nếu văn phòng bị chia 2 do bão (network partition), mỗi bên bầu CEO riêng → 2 CEO ra quyết định mâu thuẫn → hỗn loạn. Giải pháp: CEO cần quá bán board members ủng hộ.

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
Split Brain Prevention:
┌─────────────────────────────────────────────┐
│ 5-node cluster: [A] [B] [C] | [D] [E]      │
│                 majority (3) | minority (2)  │
│                                             │
│ Before partition: A = Leader (term 5)       │
│                                             │
│ During partition:                           │
│   Left side: A can still reach B,C          │
│     → quorum (3/5) → continues as leader    │
│   Right side: D,E cannot get quorum (2/5)   │
│     → cannot elect new leader → read-only   │
│                                             │
│ If A was on minority side:                  │
│   {A,B} = 2/5 → A loses quorum → steps down│
│   {C,D,E} = 3/5 → elect new leader (term 6)│
│                                             │
│ Partition heals:                            │
│   A sees term 6 > term 5 → steps down      │
│   A replicates new leader's log             │
│   Fencing: old leader's uncommitted writes  │
│   are overwritten                           │
└─────────────────────────────────────────────┘
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- **Asymmetric partition:** A can reach B but B can't reach A → confusing election behavior → Raft handles via term comparison
- **Stale reads:** old leader may serve stale reads before realizing it lost leadership → use ReadIndex or lease-based reads
- **Fencing tokens:** distributed locks use monotonically increasing tokens → storage rejects writes with old token

| Sai lầm                                              | Tại sao sai                                                                | Đúng là                                              |
| ---------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------- |
| "Network partition always causes split brain"        | Quorum prevents it — only majority side can operate                        | Split brain only happens WITHOUT quorum mechanism    |
| "Old leader immediately knows it's no longer leader" | No — needs to contact quorum or receive higher term                        | Heartbeat rejection or election message reveals this |
| "Split brain can't happen with Raft"                 | Raft prevents it for consensus, but application-level split brain possible | Always use fencing tokens for distributed locks      |

🎯 **Interview Pattern:** "How do you prevent split brain?" → Quorum (majority required for leadership), term/generation numbers (detect stale leaders), fencing tokens (prevent old leader writes). Mention: odd node count, cross-AZ deployment.

🔗 **Knowledge Chain:** Network partition → split brain risk → quorum prevention → fencing tokens → distributed locking → Redlock debate

---

### Concept 6: Byzantine Fault Tolerance

🪝 **Memory Hook:** "Byzantine = Generals phản bội — 3f+1 nodes để chịu f kẻ phản bội (so với 2f+1 cho crash)"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Crash failure = node im lặng. Byzantine = node nói dối. Cần protocol mạnh hơn
- **Level 2:** Byzantine Generals Problem (Lamport 1982): cần 3f+1 nodes vì với 3f, f traitors có thể collude để chia honest nodes thành 2 groups bằng nhau → không thể quyết định. PBFT (Castro & Liskov 1999) = first practical BFT

**Layer 1 — Analogy / Ví dụ đơn giản:**
5 tướng quân bao vây thành phố. 1 tướng là gián điệp, gửi tin "tấn công" cho nhóm A nhưng "rút lui" cho nhóm B. Cần 4 tướng trung thành (3×1+1=4) để phát hiện mâu thuẫn.

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
PBFT (Practical Byzantine Fault Tolerance):
┌─────────────────────────────────────────┐
│ Phase 1: PRE-PREPARE                    │
│   Primary → All: <PRE-PREPARE, n, D(m)>│
│                                         │
│ Phase 2: PREPARE                        │
│   Each replica → All: <PREPARE, n, D(m)>│
│   Wait for 2f matching PREPAREs         │
│                                         │
│ Phase 3: COMMIT                         │
│   Each replica → All: <COMMIT, n, D(m)> │
│   Wait for 2f+1 matching COMMITs        │
│                                         │
│ Execute and reply to client             │
│                                         │
│ Message complexity: O(n²) per operation │
│ Nodes needed: 3f+1 for f failures       │
│ Rounds: 3 (vs 2 for Raft/Paxos)        │
└─────────────────────────────────────────┘
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- O(n²) messages → doesn't scale beyond ~20 nodes → blockchain uses BFT variants with optimizations
- View change (leader rotation) in PBFT is extremely complex → most bugs here
- Most internal systems don't need BFT — crash tolerance (Raft) suffices for trusted environments

| Sai lầm                            | Tại sao sai                                       | Đúng là                                                          |
| ---------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------- |
| "All distributed systems need BFT" | BFT is expensive (3f+1, O(n²))                    | Only for adversarial environments (blockchain, multi-org)        |
| "BFT and Raft are comparable"      | BFT handles arbitrary failures, Raft only crashes | Different threat models → different use cases                    |
| "Blockchain = BFT"                 | Blockchain uses BFT variants, not pure PBFT       | Tendermint, HotStuff are BFT-based; Bitcoin uses PoW (different) |

🎯 **Interview Pattern:** "What's the difference between crash and Byzantine tolerance?" → Crash: 2f+1 nodes (Raft/Paxos), node silent. Byzantine: 3f+1 nodes (PBFT), node lies. 99% of backend systems only need crash tolerance.

🔗 **Knowledge Chain:** Byzantine Generals → PBFT → Blockchain consensus → Tendermint/HotStuff → Web3

---

### Concept 7: Production Systems (etcd, ZooKeeper)

🪝 **Memory Hook:** "etcd = K8s brain, ZooKeeper = Kafka brain (cũ) — mất brain = control plane frozen"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Applications cần coordination service (locks, config, service discovery) → etcd/ZK provide this
- **Level 2:** etcd (Raft) và ZooKeeper (ZAB) encapsulate consensus complexity → developers dùng simple API (get/put/watch) thay vì implement Raft. etcd cho K8s (all cluster state), ZK cho Kafka cũ / HBase / HDFS

**Layer 1 — Analogy / Ví dụ đơn giản:**
etcd = bộ não lưu trữ mọi thứ K8s biết. ZooKeeper = thư ký phòng họp ghi chép mọi quyết định. Mất thư ký = meeting tiếp tục (running pods OK) nhưng không ghi chép mới được (no new deployments).

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
etcd in Kubernetes:
┌─────────────────────────────────────────────┐
│ kubectl apply → API Server → etcd (Raft)    │
│                                             │
│ etcd stores ALL K8s objects:                │
│   /registry/pods/...                        │
│   /registry/services/...                    │
│   /registry/deployments/...                 │
│                                             │
│ Watch API: controller-manager, scheduler,   │
│   kubelet all watch etcd via API server     │
│                                             │
│ Typical: 3 or 5 etcd nodes (SSD required)  │
│ 1 node down → OK (quorum maintained)       │
│ Majority down → control plane frozen        │
│ ALL down → existing pods run, no new ops    │
└─────────────────────────────────────────────┘

ZooKeeper:
┌─────────────────────────────────────────────┐
│ In-memory tree of "znodes"                  │
│ Ephemeral nodes → automatic lock release    │
│ Sequential nodes → distributed ordering     │
│ ZAB protocol (Paxos-inspired)               │
│ Kafka 3.x replaced ZK with KRaft            │
└─────────────────────────────────────────────┘
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- etcd: SSD mandatory (fsync on every commit) → HDD causes election timeouts → false leader changes
- etcd: dedicated nodes recommended → noisy neighbor (co-located apps) causes latency spikes
- ZK: entire namespace in memory → doesn't scale to millions of znodes (not a database!)
- Kafka KRaft replacing ZK → no more separate cluster to manage

| Sai lầm                                 | Tại sao sai                                               | Đúng là                                   |
| --------------------------------------- | --------------------------------------------------------- | ----------------------------------------- |
| "etcd down = all K8s pods die"          | Running pods continue (kubelet local state)               | Only control plane operations fail        |
| "etcd is a general-purpose database"    | etcd is for coordination (small KV) — 8GB max recommended | Use PostgreSQL/Redis for application data |
| "ZooKeeper is still required for Kafka" | Kafka 3.x uses KRaft (built-in Raft)                      | ZK-mode is deprecated                     |

🎯 **Interview Pattern:** "What happens when etcd goes down in K8s?" → Running pods OK (kubelet cached state). No new deployments, no scheduling, no config changes. Recovery: etcd snapshot restore. Prevention: 3 or 5 nodes, SSD, dedicated machines, regular backups.

🔗 **Knowledge Chain:** etcd (Raft) → K8s control plane → HA deployment → disaster recovery → etcd backup strategy

---

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

| Dimension             | Paxos                                                | Raft                             |
| --------------------- | ---------------------------------------------------- | -------------------------------- |
| **Primary goal**      | Correctness proof                                    | Understandability                |
| **Leader model**      | Weak (any proposer can try)                          | Strong (one leader per term)     |
| **Log gaps**          | Allowed — holes in log possible                      | Not allowed — must be contiguous |
| **Member changes**    | Not specified in original paper                      | Built-in joint consensus         |
| **Understandability** | Notoriously hard (Leslie Lamport himself noted this) | Designed to be teachable         |
| **Equivalence**       | Foundational                                         | Proven equivalent to Multi-Paxos |
| **Real-world use**    | Google Chubby, Zookeeper (ZAB), some databases       | etcd, CockroachDB, TiKV, Consul  |

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

| Scenario                    | Impact                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| 1 of 3 nodes down           | Cluster fully operational (majority = 2)                                                         |
| 2 of 3 nodes down           | **All writes fail** — API server returns 503 for write operations                                |
| Leader election in progress | Writes blocked for ~1–2s (election timeout)                                                      |
| All etcd down               | Existing running Pods continue (kubelet cached state), but NO new scheduling, no new deployments |
| etcd data corrupted         | Cluster may need restore from backup — catastrophic if no backup                                 |

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

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                           | Difficulty | Core Concept      | Key Signal                                                         |
| --- | ---------------------------------- | ---------- | ----------------- | ------------------------------------------------------------------ |
| 1   | What is the consensus problem?     | 🟡 Mid     | Consensus & FLP   | Mentions FLP, 3 properties (agreement/validity/termination)        |
| 2   | Explain Paxos algorithm            | 🔴 Senior  | Paxos             | 2 phases, majority quorum, safety vs liveness distinction          |
| 3   | How does Raft differ from Paxos?   | 🟡 Mid     | Raft vs Paxos     | Understandability goal, strong leader, same guarantees             |
| 4   | What is Byzantine fault tolerance? | 🔴 Senior  | BFT               | 3f+1 vs 2f+1, PBFT phases, when NOT to use BFT                     |
| 5   | Why is consensus important?        | 🟢 Junior  | Overview          | Leader election, state machine replication, etcd/ZK examples       |
| 6   | Walk through Raft leader election  | 🔴 Senior  | Raft              | Random timeout, RequestVote, split vote handling, log completeness |
| 7   | Raft vs Paxos theory + practice    | 🔴 Senior  | Paxos + Raft      | Strong vs weak leader, log gaps, membership changes                |
| 8   | ZooKeeper usage and consensus      | 🟡 Mid     | Production (ZK)   | ZAB protocol, ephemeral nodes, Kafka KRaft migration               |
| 9   | etcd in K8s + failure scenarios    | 🔴 Senior  | Production (etcd) | Running pods OK, control plane frozen, snapshot restore            |

**Distribution:** 🟢 1 | 🟡 3 | 🔴 5

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn Bất Ngờ

**"Your 5-node etcd cluster has 2 nodes down. A third node is showing high disk latency. Should you be worried?"**

> **30-second answer:** "With 2 of 5 down, quorum is exactly 3 — we're at the edge. The third node's disk latency could cause it to miss heartbeats, triggering a leader election. If it times out during election, we effectively lose quorum and the K8s control plane freezes. Immediate action: investigate the disk issue on node 3, and do NOT restart any more nodes. If node 3 fails, we need etcd snapshot restore ready."

**Follow-up:** "What if you only had a 3-node cluster instead of 5?"

> "With 3 nodes and 2 down, we've already lost quorum — control plane is frozen. This is why production K8s uses 5 etcd nodes for critical workloads: tolerates 2 failures vs 1. The tradeoff is higher write latency (3 nodes must ACK vs 2)."

---

## Self-Check / Tự Kiểm Tra

_Close this document and answer from memory:_

| #   | Type           | Question                                                    | Key Points                                                                         |
| --- | -------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | List Raft's 3 states and their transitions                  | Follower→Candidate→Leader, timeout triggers, term comparison                       |
| 2   | 🎨 Visual      | Draw the quorum math for 3, 5, 7 nodes (fault tolerance)    | 3→tol1, 5→tol2, 7→tol3; formula: f=(N-1)/2                                         |
| 3   | 🛠️ Application | Design etcd deployment for 3-AZ K8s cluster                 | 5 nodes across 3 AZs (2-2-1), SSD, dedicated nodes, backup every 30min             |
| 4   | 🐛 Debug       | etcd leader keeps changing every few seconds — diagnose     | Disk latency (HDD?), network jitter, clock skew, noisy neighbor                    |
| 5   | 🗣️ Teach       | Explain to a junior why 4-node cluster is worse than 3-node | Same fault tolerance (1), but needs 3 ACKs vs 2 → higher latency, wasted resources |

💬 **Feynman Prompt:** Giải thích tại sao "split-brain" (2 leaders trong 1 cluster) không thể xảy ra trong Raft — cơ chế nào ngăn chặn điều này? (Hint: majority quorum + term comparison)

---

## 📅 Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | When          | Focus                                                  |
| ----- | ------------- | ------------------------------------------------------ |
| 1     | Day 1 (today) | Read all Core Concepts, do Self-Check                  |
| 2     | Day 3         | Raft election walkthrough from memory, quorum math     |
| 3     | Day 7         | Cold Call simulation, etcd failure scenarios           |
| 4     | Day 14        | Paxos vs Raft comparison, BFT when-to-use              |
| 5     | Day 30        | Full review, teach Raft to someone, design 5-node etcd |

---

## Connections / Liên Kết

**Same track / Cùng track:**

- ➡️ [System Design Theory](./system-design-theory.md) — consensus is foundation of distributed coordination
- ➡️ [Replication & Partitioning](./replication-partitioning.md) — consensus enables single-leader replication
- ➡️ [Caching Patterns](./caching-patterns.md) — distributed cache invalidation uses consensus
- ➡️ [Message Queues](./05-message-queues.md) — Kafka KRaft = Raft for metadata
- ➡️ [Load Balancing](./06-load-balancing.md) — leader-based routing patterns

**Cross track / Liên track:**

- 🔗 [Distributed Systems](../../be-track/02-backend-knowledge/03-distributed-systems.md) — CAP theorem, distributed locking
- 🔗 [Observability & Scale](../../be-track/04-be-system-design/05-observability-and-scale.md) — K8s/etcd HA in production
- 🔗 [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md) — Saga, Circuit Breaker depend on consensus
