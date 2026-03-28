# Distributed Systems - Deep Theory

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Microservices Architecture](./02-microservices.md), [Database Theory](../../shared/03-database/database-theory.md)
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee Flash Sale, 11.11:** 1 triệu user click "Buy" cùng lúc cho 1000 iPhone. Nếu dùng single database với `SELECT ... FOR UPDATE`, mọi request serialize — 1 giây để xử lý 1 request × 1 triệu request = 11 ngày. Giải pháp thực tế: Redis DECR (atomic, sub-millisecond) làm inventory counter, Kafka queue hóa orders, và chấp nhận rằng inventory count có thể temporarily negative — compensate sau.

**Bài học:** Distributed systems không phải "làm hệ thống lớn hơn" — mà là **trade-off engineering**: consistency vs availability, latency vs throughput. CAP theorem, eventual consistency, và idempotency là vocabulary bạn cần để nói chuyện được với senior engineers.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Distributed system giống **chuỗi nhà hàng franchise** — mỗi chi nhánh (node) phục vụ khách riêng, inventory riêng, nhưng phải "eventually" đồng bộ với trung tâm. Khi mạng đứt (partition), chi nhánh phải chọn: từ chối bán (CP) hay bán dù có thể hết hàng thật (AP)? Không có câu trả lời đúng — phụ thuộc vào business requirement.

**Why it matters for interviews:** Hầu hết hệ thống production ở Grab, Shopee, Tiki đều distributed. Hiểu CAP, consensus algorithms, và idempotency là baseline để discuss system design problems.

## Concept Map / Bản Đồ Khái Niệm

```
[Distributed Systems Fundamentals]
         │
         ├──► CAP Theorem: C vs A khi có Partition (P là mandatory)
         │       ├── CP: etcd, ZooKeeper, HBase, MongoDB (strong mode)
         │       └── AP: Cassandra, DynamoDB, CouchDB
         │
         ├──► Consistency Models (spectrum)
         │       Strong → Sequential → Causal → Eventual
         │
         ├──► Consensus Algorithms
         │       ├── Paxos (theoretical foundation)
         │       └── Raft (used in etcd, CockroachDB — easier to understand)
         │
         ├──► Distributed Transactions
         │       ├── 2PC (blocking, single point of failure)
         │       └── Saga (choreography / orchestration)
         │
         └──► Reliability Patterns
                 ├── Idempotency (safe retries)
                 ├── Exactly-once delivery (Kafka transactions)
                 └── Vector clocks (causal ordering)
```

---

## Overview / Tổng Quan

Distributed Systems là nền tảng engineering cho mọi hệ thống quy mô lớn — từ Shopee Flash Sale đến Grab ride-matching. File này cover 7 nhóm khái niệm cốt lõi:

| #   | Concept Group                  | Vai trò                                                           | Interview Weight |
| --- | ------------------------------ | ----------------------------------------------------------------- | ---------------- |
| 1   | CAP Theorem & PACELC           | Trade-off framework — mọi câu system design bắt đầu từ đây        | ⭐⭐⭐⭐⭐       |
| 2   | Consistency Models             | Spectrum từ Strong→Eventual — quyết định UX và correctness        | ⭐⭐⭐⭐         |
| 3   | Consensus & Leader Election    | Raft/Paxos — cách nodes đồng ý trong chaos                        | ⭐⭐⭐⭐         |
| 4   | Replication & Partitioning     | Scale data horizontally — consistent hashing, sharding strategies | ⭐⭐⭐⭐⭐       |
| 5   | Message Queues & Events        | Kafka/RabbitMQ — decouple services, handle backpressure           | ⭐⭐⭐⭐         |
| 6   | Distributed Locking & Caching  | Redis Redlock, cache patterns — practical interview favorites     | ⭐⭐⭐⭐         |
| 7   | Clocks, Failures & Idempotency | Vector clocks, split brain, exactly-once — deep senior topics     | ⭐⭐⭐           |

**Mối quan hệ:** CAP/PACELC (1) là framework → Consistency Models (2) là spectrum cụ thể → Consensus (3) là mechanism đảm bảo consistency → Replication/Partitioning (4) là cách scale → Message Queues (5) decouple communication → Locking/Caching (6) giải quyết contention → Clocks/Failures/Idempotency (7) xử lý edge cases trong production.

---

## Core Concepts — Phase 2 Deep Content

### Concept 1: CAP Theorem & PACELC

> 🧠 **Memory Hook:** "**CAP = Choose 2 of 3, but P is mandatory → really C vs A.** PACELC adds: Even without partition, Latency vs Consistency."

**Tại sao tồn tại? / Why does this exist?**

Trong mạng thực tế, đường truyền có thể bị gián đoạn bất cứ lúc nào — hệ thống phân tán PHẢI có hành vi xác định khi partition xảy ra.
→ **Why?** Brewer (2000) chứng minh rằng C+A+P đồng thời là bất khả thi — buộc kỹ sư phải chọn: từ chối request (CP) hay trả về data cũ (AP).
→ **Why?** PACELC (Abadi 2012) mở rộng: ngay cả khi không có partition, việc đồng bộ dữ liệu giữa các node vẫn tốn thời gian — đây là lý do DynamoDB chọn eventual consistency để đạt low latency hàng ngày.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng bạn quản lý **chuỗi siêu thị** với 3 chi nhánh nối với nhau qua đường dây điện thoại. Khi đường dây bị đứt (network partition), bạn phải chọn:

- **CP**: Tất cả chi nhánh ngừng bán hàng cho đến khi đường dây thông lại — tồn kho luôn chính xác, nhưng khách hàng bị từ chối phục vụ.
- **AP**: Mỗi chi nhánh tiếp tục bán theo tồn kho ước tính — khách hàng được phục vụ, nhưng có thể bán vượt số lượng thực tế.
  Không có lựa chọn nào sai — phụ thuộc vào bạn đang bán gì: vé máy bay (cần CP!) hay bánh mì (AP là đủ).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

CAP phân loại cách hệ thống ứng xử khi xảy ra network partition:

```
Khi Network Partition xảy ra:
┌────────────────────────────────────────────────────────────┐
│ CP (Consistency + Partition Tolerance):                    │
│                                                            │
│  Client ──▶ Node A  ══╗ PARTITION ╔══  Node B             │
│                        ╚══════════╝                        │
│  Node A: "Không xác nhận được với B"                       │
│         → Reject write, return error 503                   │
│                                                            │
│ AP (Availability + Partition Tolerance):                   │
│                                                            │
│  Client ──▶ Node A  ══╗ PARTITION ╔══  Node B ◀── Client  │
│                        ╚══════════╝                        │
│  Node A: Accept write (local)                              │
│  Node B: Accept write (local) ← CONFLICT possible!        │
│  Sau khi heal: conflict resolution chạy                    │
└────────────────────────────────────────────────────────────┘

PACELC — Khi KHÔNG có Partition (trường hợp thường ngày):
┌───────────┬──────────────┬────────────────────────────────┐
│ System    │ Partition    │ Else (normal operation)        │
├───────────┼──────────────┼────────────────────────────────┤
│ Cassandra │ AP           │ EL (ưu tiên Low Latency)       │
│ DynamoDB  │ AP           │ EL (ưu tiên Low Latency)       │
│ etcd      │ CP           │ EC (ưu tiên Consistency)       │
│ MongoDB   │ CP           │ EC (majority writes)           │
│ Cosmos DB │ Configurable │ Configurable                   │
└───────────┴──────────────┴────────────────────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **MongoDB không phải luôn là CP**: với `writeConcern: 1` nó có thể mất data nếu primary crash trước khi replicate — hành vi thực tế là AP.
- **"P" không phải là lựa chọn**: Không ai chọn "no partition tolerance" trong production; P là thực tế bắt buộc của mạng vật lý.
- **CAP không nói về latency**: Hệ thống CP vẫn có thể rất nhanh trong điều kiện bình thường — PACELC mới quantify tradeoff latency vs consistency.
- **Split-brain trong AP**: Khi 2 node cùng accept write, ai thắng? Last-Write-Wins có thể mất data; CRDTs giải quyết nhưng phức tạp hơn.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                        | Tại sao sai                                                                 | Đúng là                                            |
| ------------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------- |
| "MongoDB là CP"                | Phụ thuộc vào writeConcern config; mặc định có thể là AP                    | Phải nói "MongoDB với writeConcern majority là CP" |
| "CAP áp dụng cho mọi hệ thống" | CAP chỉ relevant khi data được replicate trên nhiều node                    | Single-node DB không áp dụng CAP                   |
| Bỏ qua PACELC                  | Hầu hết thời gian không có partition — E/L vs E/C mới là tradeoff hàng ngày | Phân tích cả PACELC cho thiết kế hệ thống thực tế  |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "system design where consistency matters" hoặc "distributed database tradeoffs"
- → Nhớ đến: CAP position → CP hay AP? → rồi PACELC cho normal operation
- → Mở đầu trả lời: _"Trước tiên tôi cần xác định CAP position của hệ thống: với yêu cầu này, partition tolerance là bắt buộc, nên câu hỏi thực sự là Consistency hay Availability khi network partition xảy ra..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Microservices Architecture](./02-microservices.md) — hiểu tại sao cần nhiều node trước khi học CAP
- ➡️ Để hiểu tiếp: [Consistency Models](#concept-2-consistency-models) — spectrum từ Strong đến Eventual sau khi nắm CAP framework

### Concept 2: Consistency Models

> 🧠 **Memory Hook:** "**Strong → Sequential → Causal → Eventual = Strictness spectrum.** Strong = expensive, Eventual = fast but stale."

**Tại sao tồn tại? / Why does this exist?**

Các ứng dụng khác nhau có nhu cầu về độ chính xác dữ liệu hoàn toàn khác nhau — không thể dùng một mức consistency cho tất cả.
→ **Why?** Consistency càng mạnh thì hệ thống càng phải đợi nhiều node đồng thuận → latency cao hơn, throughput thấp hơn.
→ **Why?** Tunable consistency (như trong Cassandra) cho phép chọn per-query — analytics dùng ONE, thanh toán dùng QUORUM — tối ưu hóa cho từng use case mà không cần xây 2 hệ thống riêng.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy nghĩ đến **tốc độ cập nhật tin tức** với các kênh khác nhau:

- **Linearizability** = Phát thanh viên đọc tin LIVE, mọi người nghe cùng lúc — không ai nhận tin cũ hơn người khác.
- **Causal consistency** = Báo in: bài phản hồi phải đăng SAU bài gốc, nhưng thứ tự các tin không liên quan thì tùy biên tập.
- **Eventual consistency** = Tin đồn lan truyền: cuối cùng ai cũng biết, nhưng mỗi người biết vào thời điểm khác nhau và tạm thời nghe các phiên bản khác nhau.
  Dùng phát thanh LIVE để đưa tin gossip là lãng phí; dùng tin đồn để thông báo khẩn cấp là nguy hiểm — consistency model phải phù hợp với use case.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Consistency Spectrum — từ mạnh nhất đến yếu nhất:

Client A: write(x=2) ──────── done
Client B:                           read(x) = ?

┌──────────────────────────────────────────────────────────┐
│ Linearizability (Strongest)                              │
│ → read(x) PHẢI trả về 2                                 │
│ → Hệ thống hoạt động như thể chỉ có 1 bản copy duy nhất │
│ → Cost: Cao — cần coordination tất cả nodes             │
├──────────────────────────────────────────────────────────┤
│ Sequential Consistency                                   │
│ → Mọi client thấy ops theo CÙNG thứ tự                  │
│ → Nhưng thứ tự đó không nhất thiết là real-time order   │
│ → Cost: Trung bình — không cần real-time sync            │
├──────────────────────────────────────────────────────────┤
│ Causal Consistency                                       │
│ → Chỉ ops có quan hệ nhân quả mới phải theo thứ tự      │
│ → "Hello" phải thấy trước "Reply to Hello"              │
│ → Cost: Thấp — chỉ track causal dependencies            │
├──────────────────────────────────────────────────────────┤
│ Eventual Consistency (Weakest practical)                 │
│ → Không có write mới → eventually tất cả converge       │
│ → read(x) có thể trả về 0 ngay sau write(x=2)           │
│ → Cost: Rất thấp — no coordination needed               │
└──────────────────────────────────────────────────────────┘

Cassandra Tunable Consistency (N=3 replicas):
┌──────────────────┬───┬───┬──────┬───────────────┬────────────────────┐
│ Level            │ W │ R │ W+R  │ Consistency   │ Use case           │
├──────────────────┼───┼───┼──────┼───────────────┼────────────────────┤
│ ONE/ONE          │ 1 │ 1 │ 2 ≤3 │ Eventual      │ Logging, metrics   │
│ QUORUM/QUORUM    │ 2 │ 2 │ 4 >3 │ Strong        │ Payment, inventory │
│ ALL/ALL          │ 3 │ 3 │ 6 >3 │ Strongest     │ Không nên dùng     │
└──────────────────┴───┴───┴──────┴───────────────┴────────────────────┘
Rule: W + R > N → Strong consistency (ít nhất 1 node overlap)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Linearizability ≠ Serializability**: Linearizability là về single-object real-time ordering; Serializability là về multi-object transaction isolation — hai khái niệm hoàn toàn độc lập.
- **Read-Your-Writes vẫn có thể fail**: Nếu client kết nối vào replica khác nhau qua load balancer, có thể đọc từ replica chưa nhận write. Cần sticky session hoặc read-from-leader.
- **Eventual consistency có thể rất lâu**: Trong điều kiện network partition kéo dài, "eventual" có thể là hàng phút — application phải handle gracefully.
- **Monotonic reads cần state tracking**: Để đảm bảo client không "thấy lùi về quá khứ", server phải track version cuối cùng mà client đã đọc.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                            | Đúng là                                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| "Eventual consistency = data sai"        | Eventual consistency nghĩa là tạm thời stale, KHÔNG phải sai vĩnh viễn | Data sẽ converge; stale window thường dưới 1 giây trong điều kiện bình thường          |
| Nhầm linearizability với serializability | Đây là hai khái niệm ở hai level khác nhau                             | Linearizability = single-object real-time; Serializability = multi-object transactions |
| Không biết tunable consistency tồn tại   | Miss cơ hội optimize per-query trong cùng 1 hệ thống                   | Cassandra/DynamoDB cho phép chọn consistency level per-request                         |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "stale reads", "consistency trong microservices", "database guarantees"
- → Nhớ đến: Consistency spectrum → đặt câu hỏi về business requirement → propose tunable consistency
- → Mở đầu trả lời: _"Câu trả lời phụ thuộc vào use case — nếu đây là hệ thống thanh toán thì cần linearizability, nhưng nếu là social feed thì eventual consistency là đủ và rẻ hơn nhiều về latency..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [CAP Theorem](#concept-1-cap-theorem--pacelc) — framework để hiểu tại sao consistency spectrum tồn tại
- ➡️ Để hiểu tiếp: [Consensus & Leader Election](#concept-3-consensus--leader-election) — cơ chế kỹ thuật để đạt strong consistency

### Concept 3: Consensus & Leader Election

> 🧠 **Memory Hook:** "**Raft = Understandable Paxos.** 3 phases: Leader Election → Log Replication → Safety. Majority quorum = (N/2)+1."

**Tại sao tồn tại? / Why does this exist?**

Trong môi trường nhiều node, mỗi node có thể crash hoặc mất kết nối bất cứ lúc nào — cần cơ chế để tất cả node còn lại đồng ý về một giá trị chung (ai là leader? entry nào đã committed?).
→ **Why?** FLP Impossibility (1985) chứng minh không có thuật toán deterministic nào đảm bảo đồng thuận trong hệ thống async nếu có dù chỉ 1 node crash — Raft dùng timeout (partial synchrony) để bypass giới hạn này.
→ **Why?** Raft tách bài toán thành 3 sub-problem độc lập (election, replication, safety) giúp dễ implement và verify — đây là lý do etcd, CockroachDB, TiKV đều dùng Raft thay vì Paxos phức tạp hơn.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hãy tưởng tượng **hội đồng nhà chung cư** cần bầu ra 1 trưởng ban quản lý:

- Mỗi cư dân (node) cầm 1 phiếu bầu — ai được quá nửa phiếu (majority) thì thắng, dù không phải tất cả đều có mặt.
- Người thắng trở thành "leader", nhận tất cả yêu cầu sửa chữa, ghi vào sổ, rồi thông báo cho tất cả cư dân.
- Nếu trưởng ban đột ngột biến mất (node crash), cư dân đợi một lúc (election timeout), rồi bầu lại — vẫn cần quá nửa đồng ý.
- Điểm mấu chốt: Không bao giờ có 2 "trưởng ban" cùng lúc trong cùng 1 "nhiệm kỳ" (term) — term number là cơ chế ngăn split-brain.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Raft Leader Election:

Term 1: Node A là Leader
─────────────────────────────────────────────────────────────
  Node A ──heartbeat──▶ Node B
         ──heartbeat──▶ Node C

[Node A CRASH!]

Term 2: Election
─────────────────────────────────────────────────────────────
  Node B timer hết trước (randomized 150-300ms)
    ↓ Tăng term=2, vote cho mình
    ↓ Gửi RequestVote(term=2) tới A và C
  Node C: term 2 > term 1 của mình → grant vote
  Node A: đang crash, không reply
    ↓ Node B nhận 2 votes (self + C) ≥ majority(3)=2
    → Node B trở thành Leader!

Raft Log Replication (Node B là leader):
─────────────────────────────────────────────────────────────
Client ──SET x=5──▶ Node B (Leader)
                      ↓ Append (term=2, SET x=5) vào log
                      ↓ Gửi AppendEntries tới C và A
  Node C: ACK success
  Node A: crash (no reply)
                      ↓ Got 2/3 ACKs ≥ majority → COMMIT
                      ↓ Apply to state machine
                    ──200 OK──▶ Client

Safety Invariant (Election Restriction):
┌────────────────────────────────────────────────────────────┐
│  Candidate chỉ thắng election nếu log của nó              │
│  UP-TO-DATE ≥ majority voters                             │
│  → Leader luôn có đầy đủ tất cả committed entries         │
│  → Không bao giờ mất committed data khi failover          │
└────────────────────────────────────────────────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Split vote**: Nếu 2 node cùng timeout và gửi RequestVote đồng thời, không ai đạt majority → restart election với randomized delay mới (giải quyết qua randomized timeout).
- **Stale leader**: Node A recover, nghĩ mình vẫn là leader nhưng đã có B thay thế. Term number giải quyết: B gửi reply với term cao hơn → A tự động revert về follower.
- **Log divergence**: Sau partition heal, follower có thể có log khác leader. Raft xử lý bằng cách follower luôn override log của mình theo leader (không merge, không conflict resolution).
- **Minority partition**: Nếu cluster 5 node mà 3 node bị cô lập, 2 node còn lại KHÔNG thể elect leader — hệ thống unavailable nhưng không corrupt data.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                                              | Đúng là                                                      |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| "Raft cần tất cả node đồng ý"                | Chỉ cần majority (N/2+1) — cluster 3 node chịu được 1 node fail                          | 3-node cluster: 2 votes là đủ; 5-node cluster: 3 votes là đủ |
| Nhầm leader election với distributed locking | Leader election chọn 1 coordinator duy nhất; distributed lock bảo vệ một resource cụ thể | Chúng giải quyết hai bài toán khác nhau với cơ chế khác nhau |
| Không hiểu split-brain risk khi mất quorum   | Nếu không đủ quorum, cluster nên từ chối write — không phải tiếp tục hoạt động           | Majority-based quorum là biện pháp ngăn split-brain chính    |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "etcd consistency", "leader election trong Kubernetes", "consensus algorithm"
- → Nhớ đến: Raft 3 phases → Leader Election với term numbers → Log Replication với majority commit → Safety invariant
- → Mở đầu trả lời: _"etcd dùng Raft consensus — khi leader fail, follower đợi election timeout ngẫu nhiên (để tránh split vote), node đầu tiên tăng term và gửi RequestVote, ai nhận được majority votes trước thì trở thành leader mới..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Consistency Models](#concept-2-consistency-models) — hiểu tại sao cần strong consistency trước khi học cơ chế đạt được nó
- ➡️ Để hiểu tiếp: [Replication & Partitioning](#concept-4-replication--partitioning) — cách áp dụng consensus khi replicate data ở quy mô lớn

### Concept 4: Replication & Partitioning

> 🧠 **Memory Hook:** "**Replication = copies for availability. Partitioning = splits for scale.** Consistent hashing = minimize reshuffling when nodes change."

**Tại sao tồn tại? / Why does this exist?**

Một server đơn lẻ không thể chứa hết dữ liệu hay xử lý hết traffic của một hệ thống lớn — cần phân tán dữ liệu ra nhiều máy.
→ **Why?** Replication tạo nhiều bản sao để tăng read throughput và chịu được node failure; Partitioning chia nhỏ dataset để tăng write throughput và vượt giới hạn dung lượng đĩa của một node.
→ **Why?** Consistent Hashing (Karger 1997) giải quyết vấn đề "thêm/bớt node phải reshuffle toàn bộ data" — chỉ di chuyển ~K/N keys khi node thay đổi, giúp Cassandra và DynamoDB scale mà không cần downtime.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hình dung bạn quản lý **thư viện** với hàng triệu cuốn sách:

- **Replication** = Photocopy mỗi cuốn ra 3 bản, đặt ở 3 tủ khác nhau — nếu 1 tủ bị khóa, vẫn còn 2 tủ kia phục vụ.
- **Partitioning** = Chia sách ra theo chủ đề: tủ A chứa Khoa học, tủ B chứa Lịch sử, tủ C chứa Văn học — mỗi tủ chỉ giữ 1/3 tổng số sách.
- **Consistent Hashing** = Xếp sách theo số hiệu ISBN trên một vòng tròn — khi thêm tủ mới, chỉ di chuyển sách "gần" tủ mới, không cần sắp xếp lại toàn bộ thư viện.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Consistent Hashing Ring (Hash Space: 0 → 2^32):

              0 / 2^32
                 │
          ┌──────┴──────┐
         ╱   Node A      ╲
        │    (pos: 50)    │
        │                 │ Node B
        │                 │ (pos: 150)
         ╲               ╱
          └──────┬──────┘
            Node C
            (pos: 230)

Key routing (clockwise → first node encountered):
  "user:001" → hash=80  → Node B (150) ✓
  "order:42" → hash=200 → Node C (230) ✓
  "prod:99"  → hash=240 → wraps → Node A (50) ✓

Thêm Node D (pos: 120) — chỉ ~1/N keys di chuyển:
  Trước: keys [51..150] → Node B
  Sau:   keys [51..120] → Node D  ← di chuyển
         keys [121..150] → Node B ← giữ nguyên

Virtual Nodes — giải quyết data imbalance:
┌────────────────────────────────────────────────────────────┐
│ Mỗi physical node → nhiều vị trí trên ring (vnodes)       │
│                                                            │
│  Node A: pos 50, 180, 310  (3 vnodes)                     │
│  Node B: pos 100, 230, 350 (3 vnodes)                     │
│  Node C: pos 75, 160, 290  (3 vnodes)                     │
│                                                            │
│  → Phân phối đều hơn giữa các node                        │
│  → Khi Node A fail → data phân tán sang B VÀ C            │
│    (không dồn hết vào 1 node)                             │
│  Cassandra dùng 256 vnodes/node mặc định                   │
└────────────────────────────────────────────────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Hot keys vẫn tồn tại**: Consistent hashing phân phối keys đều, nhưng nếu 1 key được đọc hàng triệu lần/giây (celeb post trên Twitter), node chứa key đó vẫn bị quá tải — giải pháp: key splitting hoặc caching layer riêng.
- **Replication lag trong reads**: Đọc từ replica có thể trả về data cũ nếu replication lag lớn — business phải quyết định có chấp nhận stale reads không.
- **Cross-shard transactions**: 1 giao dịch cần update 2 records ở 2 shard khác nhau buộc phải dùng 2PC hoặc Saga — không có "free" cross-shard ACID.
- **Range queries với hash partitioning**: `SELECT * WHERE time BETWEEN A AND B` cần scatter tới tất cả partitions — range partitioning phù hợp hơn cho time-series data.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                         | Tại sao sai                                                                          | Đúng là                                                                                            |
| ----------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Nhầm replication với partitioning               | Replication = cùng data trên nhiều node; Partitioning = data khác nhau trên mỗi node | Hầu hết hệ thống dùng cả hai: partition để scale write, replicate mỗi partition để fault-tolerance |
| "Hash partitioning luôn tốt hơn range"          | Hash partitioning không hiệu quả cho range queries                                   | Dùng range partitioning cho time-series; hash partitioning cho random key access                   |
| Không dùng virtual nodes với consistent hashing | Physical nodes sẽ nhận data không đều trên ring                                      | Cassandra dùng 256 vnodes/node mặc định để đảm bảo cân bằng tải                                    |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "design distributed key-value store", "database sharding", "horizontal scaling"
- → Nhớ đến: Consistent hashing cho partitioning → replication factor cho durability → quorum reads/writes cho consistency
- → Mở đầu trả lời: _"Tôi sẽ dùng consistent hashing để phân phối data — mỗi key được hash vào ring và route tới node đầu tiên theo chiều kim đồng hồ. Với replication factor 3, mỗi key được lưu trên 3 node liên tiếp để fault-tolerance..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Consensus & Leader Election](#concept-3-consensus--leader-election) — consensus đảm bảo consistency khi replicate data
- ➡️ Để hiểu tiếp: [Message Queues & Events](#concept-5-message-queues--event-streaming) — cách decouple services khi data đã được distributed

### Concept 5: Message Queues & Event Streaming

> 🧠 **Memory Hook:** "**Queue = task distribution (RabbitMQ). Stream = event log (Kafka).** Queue: message consumed once. Stream: message replayable."

**Tại sao tồn tại? / Why does this exist?**

Khi service A gọi service B trực tiếp (synchronous), nếu B chậm hoặc crash thì A cũng bị kéo theo — tight coupling tạo ra cascade failures.
→ **Why?** Message queue tạo buffer giữa producer và consumer: producer không cần đợi consumer xử lý xong — giúp absorb traffic spikes và decouple failure domains.
→ **Why?** Kafka với kiến trúc immutable append-only log cho phép nhiều consumer đọc cùng 1 stream độc lập, replay lại event history, và scale horizontally — các tính năng mà traditional queue không có.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

- **Message Queue (RabbitMQ)** = **Hộp thư email**: bạn nhận email, đọc xong thì xóa. Nếu nhiều người cùng nhận chung 1 inbox, chia nhau mỗi người đọc 1 cái — ai đọc rồi thì người khác không đọc nữa.
- **Event Stream (Kafka)** = **Kênh YouTube**: video được đăng lên một lần, nhưng hàng triệu người có thể xem bất kỳ lúc nào, từ bất kỳ điểm nào trong video. Chủ kênh không xóa video sau khi ai đó xem.

Dùng "hộp thư" cho đơn hàng cần xử lý đúng một lần; dùng "YouTube" cho event log cần nhiều service đọc độc lập và có thể replay khi cần.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Message Queue vs Event Stream Architecture:

RabbitMQ (Task Queue):
┌──────────┐  publish  ┌───────────┐  consume+delete  ┌────────────┐
│ Producer │──────────▶│  Queue    │─────────────────▶│ Consumer A │
└──────────┘           └───────────┘                  └────────────┘
                             │ (round-robin)
                             └─consume+delete──────────▶ Consumer B
                        Each message processed by EXACTLY ONE consumer

Kafka (Event Stream):
┌──────────┐  append  ┌──────────────────────────────────────┐
│ Producer │─────────▶│  Topic: "orders" (3 partitions)      │
└──────────┘          │  P0: [msg0][msg1][msg2][msg3]        │
                      │  P1: [msg0][msg1][msg2]              │
                      │  P2: [msg0][msg1]                    │
                      └──────────────────────────────────────┘
                              │              │
                              ▼              ▼
                     Consumer Group A  Consumer Group B
                      (order-service)  (analytics)
                       reads P0,P1,P2   reads P0,P1,P2
                       INDEPENDENTLY    INDEPENDENTLY
                       → Both groups see ALL messages
                       → Kafka doesn't delete on consume

Consumer Group Parallelism:
Topic "orders" (3 partitions) + Consumer Group "processors":
  Consumer 1 ← Partition 0   (processes independently)
  Consumer 2 ← Partition 1   (processes independently)
  Consumer 3 ← Partition 2   (processes independently)
  → 3x throughput vs 1 consumer
  → Max parallelism = number of partitions
  → If Consumer 4 added: one consumer idle (no partition)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Consumer group rebalancing**: Khi thêm/bớt consumer trong group, Kafka rebalance partition assignment — trong thời gian này có thể xảy ra duplicate processing. Idempotent consumer là bắt buộc.
- **Kafka exactly-once chỉ trong Kafka ecosystem**: Producer + Kafka topic = idempotent qua sequence numbers. Nhưng side effects (DB write, API call bên ngoài) vẫn cần application-level deduplication.
- **RabbitMQ ordering**: Chỉ đảm bảo FIFO trong 1 queue với 1 consumer. Nhiều consumers cùng 1 queue → no ordering guarantee.
- **Backpressure**: Nếu consumer chậm hơn producer, partition lag tăng liên tục — cần monitoring consumer lag và scale consumer kịp thời.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                                                                  | Đúng là                                                                                           |
| ------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Dùng Kafka cho simple task queue      | Kafka có operational overhead cao (KRaft, partition management, consumer group coordination) | Dùng RabbitMQ cho fire-and-forget tasks; Kafka khi cần replay hoặc multiple independent consumers |
| "Kafka đảm bảo exactly-once"          | Chỉ trong Kafka transactions — producer + consumer trong cùng Kafka cluster                  | Side effects bên ngoài Kafka (DB write, API call) vẫn cần application-level idempotency           |
| Không hiểu consumer group rebalancing | Rebalance gây pause và có thể duplicate processing nếu consumer không idempotent             | Thiết kế idempotent consumer để handle duplicates một cách an toàn                                |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "xử lý 100K orders/sec", "event-driven architecture", "decoupling services"
- → Nhớ đến: Queue vs Stream distinction → Kafka cho ingestion → Consumer groups cho parallel processing → Idempotent consumers cho exactly-once semantics
- → Mở đầu trả lời: _"Tôi sẽ dùng Kafka để ingest orders — producer publish vào topic với partition key là user_id để đảm bảo ordering per user, consumer group với N consumers xử lý song song tối đa N partitions..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Replication & Partitioning](#concept-4-replication--partitioning) — hiểu partitioning concept giúp grasp Kafka partition model
- ➡️ Để hiểu tiếp: [Distributed Locking & Caching](#concept-6-distributed-locking--caching) — cách xử lý contention khi nhiều consumers cùng access shared resources

### Concept 6: Distributed Locking & Caching

> 🧠 **Memory Hook:** "**Redlock = Redis distributed lock with majority quorum. Cache patterns: Cache-Aside (lazy), Write-Through (eager), Write-Behind (async).**"

**Tại sao tồn tại? / Why does this exist?**

Trong hệ thống phân tán, nhiều service có thể cùng lúc cố gắng thay đổi cùng một resource — cần cơ chế mutual exclusion để tránh race condition.
→ **Why?** Single Redis instance có SPOF — nếu Redis crash sau khi SET nhưng trước khi replicate, lock bị mất và 2 service có thể cùng hold lock; Redlock dùng N Redis instances độc lập với majority agreement để giảm thiểu rủi ro này.
→ **Why?** Martin Kleppmann (2016) chỉ ra Redlock vẫn không an toàn cho correctness-critical operations vì GC pause và clock skew có thể khiến expired lock holder tiếp tục ghi — dùng etcd/ZooKeeper với fencing token nếu cần safety tuyệt đối.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hình dung **phòng họp** trong văn phòng có nhiều chi nhánh:

- **Distributed lock** = Đặt lịch phòng họp qua hệ thống tập trung — ai đặt trước thì được dùng, người khác phải đợi.
- **Redlock** = Hệ thống đặt phòng có 5 server backup — bạn phải xác nhận với ít nhất 3 server (majority) mới được coi là đặt thành công. Nếu 2 server chết, vẫn hoạt động.
- **Fencing token** = Mã số xác nhận tăng dần — khi vào phòng họp, bạn phải xuất trình mã số, và bảo vệ chỉ cho vào nếu mã số của bạn là mới nhất. Dù ai đó "đặt nhầm" với mã cũ hơn, bảo vệ sẽ từ chối ngay.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Redis Single-Instance Lock:
┌────────┐  SET lock:res "owner" NX PX 10000  ┌─────────┐
│ Client │────────────────────────────────────▶│ Redis   │
│        │◀── OK (lock acquired) ─────────────│         │
│        │                                    └─────────┘
│ ... critical section ...
│        │  EVAL lua: if GET==owner then DEL  ┌─────────┐
│        │────────────────────────────────────▶│ Redis   │
│        │◀── released ───────────────────────│         │
└────────┘                                    └─────────┘

Redlock (N=5 independent Redis instances):
┌────────┐  SET NX  ┌──────────┐
│ Client ├─────────▶│ Redis 1  │ ✓
│        ├─────────▶│ Redis 2  │ ✓
│        ├─────────▶│ Redis 3  │ ✓  ← Majority (3/5) ✓
│        ├─────────▶│ Redis 4  │ ✗  (timeout/down)
│        ├─────────▶│ Redis 5  │ ✗  (timeout/down)
└────────┘  elapsed_time < TTL → LOCK ACQUIRED!

Kleppmann's GC Pause Attack:
  t=0:  Client A acquires lock (TTL=10s)
  t=5:  Client A enters GC pause ← DANGER
  t=10: Lock TTL expires on Redis
  t=11: Client B acquires same lock (token=34)
  t=12: Client B writes to storage → accepted ✓
  t=15: Client A resumes from GC pause
        A still thinks it holds the lock!
        A tries to write (token=33)
        Without fencing → BOTH wrote! DATA CORRUPTION ❌
        With fencing   → Storage rejects token 33 < 34 ✓

Cache Pattern Comparison:
┌──────────────────┬────────────────────────┬────────────────────┐
│ Pattern          │ Write Flow             │ Read Miss Flow     │
├──────────────────┼────────────────────────┼────────────────────┤
│ Cache-Aside      │ App → DB only          │ App→Cache miss     │
│ (Lazy Loading)   │ Cache invalidated/TTL  │ →DB→Cache SET      │
├──────────────────┼────────────────────────┼────────────────────┤
│ Write-Through    │ App→Cache→DB (sync)    │ App→Cache hit      │
│ (Eager)          │ Consistent but slow    │ (always warm)      │
├──────────────────┼────────────────────────┼────────────────────┤
│ Write-Behind     │ App→Cache (async→DB)   │ App→Cache hit      │
│ (Write-Back)     │ Fast writes, data loss │ (always warm)      │
└──────────────────┴────────────────────────┴────────────────────┘
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **SETNX không có TTL**: Nếu lock holder crash mà không release, lock tồn tại mãi mãi — phải luôn set TTL khi acquire lock.
- **Cache stampede**: Hot key hết hạn đồng thời → hàng nghìn request hit DB cùng lúc. Giải pháp: jittered TTL (thêm random delta) + singleflight pattern.
- **Redlock không có fencing token**: Redis không generate monotonic token — nếu cần correctness-critical lock (payment, inventory), dùng etcd/ZooKeeper thay thế.
- **Write-Behind data loss**: Nếu cache node crash trước khi flush async writes xuống DB, data mất vĩnh viễn — không phù hợp cho dữ liệu quan trọng.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                                                    | Đúng là                                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Dùng SETNX mà không có TTL               | Nếu holder crash, lock không bao giờ được release → deadlock vĩnh viễn                         | Luôn kèm expiry: `SET key value NX PX <milliseconds>`                           |
| "Redlock luôn an toàn"                   | Redlock không an toàn cho correctness-critical ops — GC pause và clock skew phá vỡ assumptions | Dùng etcd/ZooKeeper với fencing token cho safety-critical locking               |
| Cache stampede khi TTL đồng loạt hết hạn | Toàn bộ cache miss cùng lúc → DB bị overload đột ngột                                          | Dùng jittered TTL (thêm random 0-10% delta) hoặc singleflight để dedup requests |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "rate limiter", "prevent duplicate processing", "distributed cache strategy"
- → Nhớ đến: Redis atomic ops → Redlock cho distributed lock → fencing token nếu cần safety → cache pattern phù hợp với write/read ratio
- → Mở đầu trả lời: _"Để implement distributed rate limiter, tôi dùng Redis INCR với TTL — atomic operation đảm bảo counter chính xác trên nhiều instances. Nếu cần cross-node mutual exclusion, Redlock với 5 Redis instances độc lập là đủ cho efficiency lock..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Message Queues & Events](#concept-5-message-queues--event-streaming) — hiểu async decoupling trước khi xem xét synchronous locking
- ➡️ Để hiểu tiếp: [Clocks, Failures & Idempotency](#concept-7-clocks-failures--idempotency) — hiểu tại sao clock skew làm Redlock không an toàn

### Concept 7: Clocks, Failures & Idempotency

> 🧠 **Memory Hook:** "**Physical clocks lie. Logical clocks (Lamport/Vector) track causality. Idempotency = safe retries = f(f(x)) = f(x).**"

**Tại sao tồn tại? / Why does this exist?**

Trong mạng thực tế, request có thể bị duplicate (retry), reorder, hoặc mất hoàn toàn — hệ thống cần được thiết kế để handle tất cả trường hợp này một cách an toàn.
→ **Why?** Đồng hồ vật lý (NTP) có drift hàng chục milliseconds và có thể jump backwards — không thể dùng wall clock để sắp xếp thứ tự events trên các node khác nhau, cần logical clocks để track causality.
→ **Why?** Hybrid Logical Clocks (HLC) kết hợp độ "gần thực" của physical time với tính đúng đắn của logical clock — đây là lý do CockroachDB và MongoDB dùng HLC để có cả human-readable timestamps lẫn đúng causal ordering.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hình dung **cuộc trò chuyện nhóm qua messenger** khi internet không ổn định:

- Bạn gửi "Mình đồng ý" lúc 10:01 (đồng hồ điện thoại bạn).
- Bạn bè nhận lúc 10:05 nhưng bạn bè khác gửi "Mình không đồng ý" lúc 10:03 (đồng hồ của họ).
- Ai nói trước? Không thể biết chắc chỉ nhìn vào giờ đồng hồ!
- **Lamport clock** = Đánh số thứ tự mỗi tin nhắn, khi nhận tin của ai thì số của mình phải lớn hơn — không cần đồng hồ chính xác.
- **Idempotency** = Bạn gửi cùng 1 tin nhắn 2 lần vì mạng lỗi → hệ thống chỉ hiển thị 1 lần (dedup bằng message ID duy nhất).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Lamport Timestamps — Logical Ordering:

Process A: (C=1) ──send m1──▶
                             │
Process B: (C=1) ────────── (C=max(1,1)+1=2) ──send m2──▶
                                                          │
Process C: (C=1) ──────────────────────────────────────  (C=max(1,2)+1=3)

Rule: a→b implies L(a) < L(b)  [one direction only!]
Limitation: L(a) < L(b) does NOT mean a happened-before b

Vector Clocks — Detect Causality (3 processes):
             [A, B, C]
Process A:   [1,0,0] ──send──▶
                    │
Process B:   [0,1,0] ◀──recv── [2,1,0]  (merge: max each entry)
             [0,2,0] ──send──▶
                          │
Process C:   [0,0,1] ◀────── [0,2,2]   (merge + increment C)

Comparing:
  [2,0,0] vs [0,2,0]: Neither ≤ other → CONCURRENT events ✓
  [1,0,0] vs [2,2,2]: A ≤ B element-wise → A happened-before B ✓

Idempotency Key Pattern (Payment Example):
┌────────┐  POST /payment                    ┌─────────┐
│ Client │  Idempotency-Key: uuid-abc-123    │ Server  │
│        │──────────────────────────────────▶│         │
│        │                                   │ Check:  │
│        │                                   │ uuid-abc-123 in DB?
│        │                                   │ NO → process & store
│        │◀── 200 OK (payment done) ─────────│         │
│        │                                   └─────────┘
│  [network timeout! client retries]
│        │  POST /payment                    ┌─────────┐
│        │  Idempotency-Key: uuid-abc-123    │ Server  │
│        │──────────────────────────────────▶│         │
│        │                                   │ Check:  │
│        │                                   │ uuid-abc-123 in DB?
│        │                                   │ YES → return stored result
│        │◀── 200 OK (idempotent return) ────│         │
└────────┘                                   └─────────┘
→ Payment processed ONCE, safely returned TWICE
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **NTP backward jump**: Đồng hồ có thể nhảy ngược (time went backward) khi NTP correction lớn — code dùng `time.Now()` để order events có thể tạo ra thứ tự sai hoàn toàn.
- **Vector clock size**: Vector clock có kích thước O(N) với N processes — trong hệ thống hàng nghìn node, impractical; dùng dotted version vectors hoặc HLC thay thế.
- **Idempotency key TTL**: Key TTL quá ngắn → retry sau 25 giờ bị coi là request mới → double charge. Nên dùng tối thiểu 24-48 giờ.
- **"Exactly-once delivery" là myth**: Trong mạng không tin cậy, chỉ có at-least-once hoặc at-most-once delivery. "Exactly-once processing" đạt được qua idempotent consumer, không phải delivery guarantee.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                      | Tại sao sai                                                                                    | Đúng là                                                                         |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Dùng timestamp để order events               | Clock skew có thể khiến event xảy ra sau lại có timestamp nhỏ hơn                              | Dùng Lamport clock hoặc vector clock cho causal ordering giữa các node          |
| "Exactly-once delivery là possible"          | Two Generals Problem chứng minh không thể đảm bảo delivery đúng 1 lần trong mạng không tin cậy | Đạt "effectively exactly-once" = at-least-once delivery + idempotent processing |
| Không dùng idempotency key trong payment API | Payment bị trừ 2 lần khi client retry sau network timeout                                      | Client tạo UUID trước khi gửi request, server dedup theo key đó với TTL ≥ 24h   |

**🎯 Interview Pattern:**

- Khi thấy câu hỏi về: "prevent duplicate payments", "event ordering", "retry safety"
- → Nhớ đến: Idempotency key → deduplication table → at-least-once delivery + idempotent processing = effectively exactly-once
- → Mở đầu trả lời: _"Để tránh duplicate payment, client tạo một UUID trước khi gửi và đính kèm vào header Idempotency-Key. Server kiểm tra key này trong Redis/DB — nếu đã tồn tại thì trả về kết quả cũ mà không xử lý lại..."_

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Distributed Locking & Caching](#concept-6-distributed-locking--caching) — hiểu tại sao clock skew làm distributed lock không an toàn
- ➡️ Để hiểu tiếp: [Microservices Architecture](./02-microservices.md) — áp dụng idempotency trong Saga pattern giữa các microservices

---

## 1. CAP Theorem

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: CAP Theorem là gì? Giải thích chi tiết từng thuộc tính. 🟢 🟢 [Junior]

**A:**

CAP Theorem (Eric Brewer, 2000) phát biểu rằng một hệ thống phân tán chỉ có thể đảm bảo **tối đa 2 trong 3** thuộc tính sau:

| Property                    | Definition                                                                                         | Ý nghĩa thực tế                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Consistency (C)**         | Every read receives the most recent write or an error                                              | Mọi node trả về cùng dữ liệu tại cùng thời điểm. Linearizability - hệ thống hoạt động như thể chỉ có 1 bản copy |
| **Availability (A)**        | Every request receives a (non-error) response, without guarantee it contains the most recent write | Mọi request đều nhận được response (không bị timeout hay error), dù data có thể stale                           |
| **Partition Tolerance (P)** | System continues to operate despite network partitions between nodes                               | Hệ thống vẫn hoạt động khi mạng bị chia cắt (message giữa các node bị mất/delay)                                |

**Tại sao thực tế chỉ là C vs A:**

Trong mạng thực tế, partition **luôn có thể xảy ra** (cable đứt, switch hỏng, cloud AZ mất kết nối). Vì vậy P là bắt buộc. Câu hỏi thực sự là:

```
Khi partition xảy ra, bạn chọn gì?
├── CP: Từ chối request (sacrifice Availability) để đảm bảo Consistency
└── AP: Vẫn trả response (sacrifice Consistency) nhưng data có thể stale
```

### Q: Phân biệt CP và AP systems với ví dụ cụ thể? 🟡 🟡 [Mid]

**A:**

**CP Systems** - Ưu tiên Consistency khi có Partition:

```
┌─────────────────────────────────────────────────┐
│  CP System: Khi partition xảy ra                │
│                                                 │
│  Client ──▶ [Node A] ──✕──  [Node B]           │
│              │                  │                │
│              │  Partition!      │                │
│              │                  │                │
│              ▼                  ▼                │
│         REJECT write      REJECT write          │
│         (return error)    (return error)         │
│                                                 │
│  → Không node nào chấp nhận write nếu không     │
│    confirm được majority                        │
└─────────────────────────────────────────────────┘
```

| System                   | Cách đảm bảo CP                                                                  |
| ------------------------ | -------------------------------------------------------------------------------- |
| **etcd**                 | Raft consensus - write cần majority nodes đồng ý                                 |
| **ZooKeeper**            | ZAB protocol - leader phải confirm với majority                                  |
| **HBase**                | Single master cho mỗi region, nếu master down → unavailable cho đến khi failover |
| **MongoDB** (w:majority) | Write concern majority - write phải được xác nhận bởi majority                   |

**AP Systems** - Ưu tiên Availability khi có Partition:

```
┌─────────────────────────────────────────────────┐
│  AP System: Khi partition xảy ra                │
│                                                 │
│  Client ──▶ [Node A] ──✕──  [Node B] ◀── Client│
│              │                  │                │
│              │  Partition!      │                │
│              ▼                  ▼                │
│         ACCEPT write      ACCEPT write          │
│         (local data)      (local data)          │
│              │                  │                │
│              └──── Reconcile ───┘                │
│                  (after heal)                    │
│                                                 │
│  → Cả hai node vẫn serve request, resolve       │
│    conflict sau khi partition heal               │
└─────────────────────────────────────────────────┘
```

| System        | Cách đảm bảo AP                                    |
| ------------- | -------------------------------------------------- |
| **Cassandra** | Tunable consistency, mặc định eventual consistency |
| **DynamoDB**  | Eventual consistent reads mặc định, hinted handoff |
| **CouchDB**   | Multi-version concurrency, conflict resolution     |

### Q: PACELC Theorem là gì? Tại sao nó mở rộng CAP? 🔴 🔴 [Senior]

**A:**

CAP chỉ nói về trường hợp có Partition. Nhưng **phần lớn thời gian hệ thống không bị partition**. PACELC (Daniel Abadi) mở rộng:

```
if (Partition) {
    choose between Availability and Consistency    // giống CAP
} else {
    choose between Latency and Consistency         // tradeoff bình thường
}
```

| System         | P+A vs P+C | E+L vs E+C | Giải thích                                                                |
| -------------- | ---------- | ---------- | ------------------------------------------------------------------------- |
| Cassandra      | PA         | EL         | Khi partition → vẫn available; bình thường → ưu tiên low latency          |
| DynamoDB       | PA         | EL         | Tương tự Cassandra                                                        |
| MongoDB        | PC         | EC         | Khi partition → ưu tiên consistency; bình thường cũng ưu tiên consistency |
| etcd/ZooKeeper | PC         | EC         | Luôn ưu tiên consistency                                                  |
| Cosmos DB      | PA/PC      | EL/EC      | Tunable - cho phép chọn cả hai chiều                                      |

**Real-world: Grab CAP tradeoffs:**

- **Payment service**: CP - Không thể chấp nhận inconsistency trong tiền bạc. Dùng strong consistency (majority write). Nếu partition → reject transaction.
- **Location tracking**: AP - Driver location cần update liên tục, stale location 2-3 giây vẫn chấp nhận được. Availability quan trọng hơn.
- **Chat/notification**: AP - Tin nhắn có thể delay nhưng không được mất. Eventual consistency là đủ.

---

## 2. Consistency Models

### Q: Giải thích các consistency model từ mạnh đến yếu? 🟡 🟡 [Mid]

**A:**

```
Strong ◀──────────────────────────────────────▶ Weak

Linearizability → Sequential → Causal → Eventual
      │               │           │          │
  Mọi op thấy    Mọi client   Chỉ ops có   Cuối cùng
  state mới      thấy cùng    quan hệ      tất cả sẽ
  nhất ngay      thứ tự ops   nhân quả     converge
                              phải ordered
```

**Linearizability (Strongest):**

- Mọi operation diễn ra "atomically" tại một thời điểm giữa invocation và response
- External observer không thể phân biệt với single-server system
- Ví dụ: Nếu write(x=2) hoàn thành trước read(x) bắt đầu → read phải trả về 2
- Cost: **Rất cao** - cần coordination giữa tất cả nodes, tăng latency

**Sequential Consistency:**

- Mọi client thấy operations theo **cùng một thứ tự**, nhưng thứ tự đó **không nhất thiết phải là real-time order**
- Khác linearizability: cho phép "re-order" miễn sao tất cả đồng ý cùng order
- Ví dụ: Client A write x=1 rồi y=2. Client B có thể thấy y=2 trước x=1, nhưng MỌI client phải thấy cùng thứ tự

**Causal Consistency:**

- Operations có quan hệ nhân quả (cause-effect) phải được thấy theo đúng thứ tự
- Operations không liên quan (concurrent) có thể thấy khác thứ tự trên mỗi node
- Ví dụ: User A post "Hello", User B reply "Hi back" → Mọi người phải thấy "Hello" trước "Hi back"

**Read-Your-Writes (Session Consistency):**

- Sau khi client write, chính client đó luôn đọc được giá trị vừa write
- Các client khác có thể chưa thấy
- Implementation: sticky session hoặc read from leader

**Monotonic Reads:**

- Nếu client đã đọc được version X, các read tiếp theo không bao giờ trả về version cũ hơn X
- Ngăn "time travel" - đọc data mới rồi bỗng thấy data cũ

**Eventual Consistency (Weakest useful):**

- Nếu không có write mới, cuối cùng tất cả replicas sẽ converge về cùng giá trị
- Không đảm bảo khi nào converge hoặc thứ tự nào
- DNS là ví dụ kinh điển

### Q: Tunable Consistency trong Cassandra hoạt động thế nào? 🔴 🔴 [Senior]

**A:**

Cassandra cho phép **chọn consistency level per-query**:

```
N = total replicas (thường 3)
W = number of nodes must ACK a write
R = number of nodes must respond to a read

Rule: W + R > N → Strong consistency
      W + R ≤ N → Eventual consistency
```

| Level         | W   | R   | W+R vs N | Consistency   | Latency    | Use case             |
| ------------- | --- | --- | -------- | ------------- | ---------- | -------------------- |
| ONE/ONE       | 1   | 1   | 2 ≤ 3    | Eventual      | Thấp nhất  | Logging, metrics     |
| ONE/QUORUM    | 1   | 2   | 3 = 3    | Hmm, tricky\* | Trung bình | Read-heavy eventual  |
| QUORUM/QUORUM | 2   | 2   | 4 > 3    | Strong        | Cao        | Financial, inventory |
| ALL/ONE       | 3   | 1   | 4 > 3    | Strong        | Write chậm | Write ít, read nhiều |
| ALL/ALL       | 3   | 3   | 6 > 3    | Strong        | Rất cao    | Không nên dùng       |

\*ONE/QUORUM: Nếu write ONE thành công trên node A, nhưng chưa replicate sang B,C → read QUORUM đọc B,C → miss write → NOT strong.

**Tradeoff thực tế:** QUORUM/QUORUM là sweet spot phổ biến nhất cho dữ liệu quan trọng.

---

## 3. Consensus Algorithms

### Q: Tại sao consensus trong distributed systems khó? 🔴 🔴 [Senior]

**A:**

**FLP Impossibility Theorem** (Fischer, Lynch, Paterson, 1985):

> Trong hệ thống asynchronous (không có upper bound cho message delay), **không tồn tại** deterministic consensus algorithm nào đảm bảo termination nếu dù chỉ **1 process có thể crash**.

Điều này có nghĩa: mọi consensus algorithm thực tế đều phải **trade-off**:

- **Paxos/Raft**: Dùng timeout để detect failure → có thể "block" nếu timeout sai
- **Randomized**: Dùng random để phá symmetry → terminate "with probability 1" nhưng không deterministic

### Q: Raft consensus algorithm hoạt động thế nào? (DEEP DIVE) 🔴 🔴 [Senior]

**A:**

Raft được thiết kế để **dễ hiểu hơn Paxos** (Diego Ongaro, 2014). Chia consensus thành 3 sub-problems:

#### 1. Leader Election

Mỗi node ở 1 trong 3 state: **Follower**, **Candidate**, **Leader**

```
                    timeout, start election
            ┌──────────────────────────────────┐
            │                                  ▼
     ┌──────────┐                      ┌──────────────┐
     │ Follower │                      │  Candidate   │
     └──────────┘                      └──────────────┘
         ▲  ▲                            │     │    ▲
         │  │   discover leader/         │     │    │
         │  │   new term                 │     │    │
         │  └────────────────────────────┘     │    │
         │                                     │    │
         │        win election (majority)      │    │
         │  ┌──────────────────────────────────┘    │
         │  │        timeout, new election          │
         │  ▼        (split vote) ──────────────────┘
     ┌──────────┐
     │  Leader  │
     └──────────┘
```

**Election flow chi tiết:**

```
Term 1: Node A is Leader
═══════════════════════════════════════════

Node A (Leader)  ──heartbeat──▶  Node B (Follower)
                 ──heartbeat──▶  Node C (Follower)

[Node A crashes]

Term 2: Election
═══════════════════════════════════════════

Time ───────────────────────────────────────────▶

Node B: ...waiting...election timeout!
        Increment term → 2
        Vote for self
        Send RequestVote(term=2) to A, C
                    │
Node C: ◀───────────┘ Receive RequestVote
        term 2 > my term 1 → grant vote
        Reply: VoteGranted=true
                    │
Node B: ◀───────────┘ Got 2 votes (self + C)
        2 > majority(3)/2 = 2 → I am Leader!
        Start sending heartbeats

Node A: [still down, doesn't matter]
```

**Key mechanisms ngăn split brain:**

1. **Term number**: Monotonically increasing. Mỗi term có tối đa 1 leader. Nếu nhận message với term cao hơn → revert to follower.

2. **Randomized election timeout**: Mỗi node có timeout ngẫu nhiên (150-300ms). Giảm xác suất 2 nodes cùng trở thành candidate.

3. **Majority vote**: Cần > N/2 votes. Vì chỉ có 1 majority set, không thể có 2 leaders cùng term.

#### 2. Log Replication

```
Leader nhận write request → append to log → replicate to followers
→ wait majority ACK → commit → apply to state machine → reply client

┌─────────────────────────────────────────────────────────────┐
│                    Log Replication Flow                       │
│                                                              │
│  Client                                                      │
│    │                                                         │
│    │ SET x=5                                                 │
│    ▼                                                         │
│  Leader (Node A)                                             │
│    │  Log: [..., (term=3, SET x=5)]                         │
│    │                                                         │
│    ├──AppendEntries──▶ Node B                               │
│    │                    Append to log                        │
│    │                    Reply: success                       │
│    │                                                         │
│    ├──AppendEntries──▶ Node C                               │
│    │                    Append to log                        │
│    │                    Reply: success                       │
│    │                                                         │
│    │  Got 3/3 ACKs (majority = 2 needed)                    │
│    │  commitIndex++ → entry committed                       │
│    │  Apply to state machine                                │
│    │                                                         │
│    ▼                                                         │
│  Client: OK (x=5 committed)                                 │
│                                                              │
│  Next heartbeat carries updated commitIndex                  │
│  → Followers also apply committed entries                    │
└─────────────────────────────────────────────────────────────┘
```

**Log structure:**

```
Index:    1        2        3        4        5
        ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐
Leader: │t=1 │  │t=1 │  │t=2 │  │t=3 │  │t=3 │  commitIndex=5
        │x=1 │  │y=2 │  │x=3 │  │y=7 │  │x=5 │
        └────┘  └────┘  └────┘  └────┘  └────┘

        ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐
Node B: │t=1 │  │t=1 │  │t=2 │  │t=3 │  │t=3 │  commitIndex=4
        │x=1 │  │y=2 │  │x=3 │  │y=7 │  │x=5 │  (chưa nhận commit cho 5)
        └────┘  └────┘  └────┘  └────┘  └────┘

        ┌────┐  ┌────┐  ┌────┐
Node C: │t=1 │  │t=1 │  │t=2 │                    (lagging behind)
        │x=1 │  │y=2 │  │x=3 │                    commitIndex=3
        └────┘  └────┘  └────┘
```

#### 3. Safety Properties

**Election Restriction**: Candidate chỉ thắng election nếu log của nó **ít nhất up-to-date bằng** majority. Khi nhận RequestVote, voter kiểm tra:

- Candidate's last log term > voter's last log term → grant
- Candidate's last log term == voter's last log term AND candidate's log length ≥ voter's → grant
- Otherwise → reject

Điều này đảm bảo: **Leader luôn chứa tất cả committed entries**.

**Log Matching Property**: Nếu 2 logs chứa entry cùng index và term → tất cả entries trước đó cũng giống nhau.

**etcd & Raft**: etcd (viết bằng Go) là implementation phổ biến nhất của Raft. Kubernetes dùng etcd làm data store → mọi cluster state đều qua Raft consensus.

### Q: So sánh Paxos vs Raft vs ZAB? 🔴 🔴 [Senior]

**A:**

| Aspect                | Paxos                           | Raft                        | ZAB                          |
| --------------------- | ------------------------------- | --------------------------- | ---------------------------- |
| **Author**            | Lamport (1989)                  | Ongaro (2014)               | Yahoo (2008)                 |
| **Understandability** | Rất khó                         | Thiết kế để dễ hiểu         | Trung bình                   |
| **Leader**            | Không bắt buộc (Multi-Paxos có) | Bắt buộc strong leader      | Bắt buộc (primary)           |
| **Phases**            | Prepare → Accept                | RequestVote → AppendEntries | Discovery → Sync → Broadcast |
| **Log ordering**      | Không đảm bảo gap-free          | Gap-free, sequential        | Gap-free, sequential         |
| **Used by**           | Chubby (Google)                 | etcd, CockroachDB, TiKV     | ZooKeeper                    |
| **Golang impl**       | Ít                              | etcd/raft, hashicorp/raft   | Không (Java)                 |

---

## 4. Replication

### Q: So sánh các replication strategies? 🟡 🟡 [Mid]

**A:**

#### Single-Leader (Master-Slave)

```
┌────────┐  write   ┌────────┐  replicate  ┌────────────┐
│ Client ├─────────▶│ Leader ├────────────▶│ Follower 1 │
└────────┘          │(Master)│             └────────────┘
     │              │        ├────────────▶┌────────────┐
     │   read       │        │  replicate  │ Follower 2 │
     └─────────────▶└────────┘             └────────────┘
           (or read from followers
            with possible staleness)
```

**Sync vs Async replication:**

| Aspect           | Synchronous                    | Asynchronous                                        | Semi-synchronous                 |
| ---------------- | ------------------------------ | --------------------------------------------------- | -------------------------------- |
| **Flow**         | Leader waits ALL followers ACK | Leader returns immediately, replicate in background | Leader waits 1+ follower ACK     |
| **Durability**   | Cao nhất                       | Có thể mất data nếu leader crash                    | Trung bình                       |
| **Latency**      | Cao (wait slowest replica)     | Thấp                                                | Trung bình                       |
| **Availability** | Bất kỳ follower chậm → block   | Không block                                         | Block nếu không đủ ACK           |
| **Ví dụ**        | Rare (quá chậm)                | MySQL default, PostgreSQL streaming                 | MySQL semi-sync, etcd (majority) |

**Leader failover process:**

```
1. Detect leader failure (timeout-based)
2. Choose new leader (follower with most up-to-date log)
3. Reconfigure: clients redirect to new leader
4. Old leader rejoins as follower (if recovers)

Pitfalls:
- Split brain: cả old và new leader đều accept writes
  → Giải quyết: fencing (STONITH), epoch numbers
- Data loss: async replicated data chưa đến followers
  → Giải quyết: semi-sync, hoặc chấp nhận loss
```

#### Multi-Leader

Use case chính: **Multi-datacenter replication**

```
┌──── DC: Ho Chi Minh ────┐    ┌──── DC: Singapore ────┐
│                          │    │                        │
│  Client ──▶ Leader A ◄──────────▶ Leader B ◀── Client │
│             │            │    │          │              │
│          Follower A1     │    │       Follower B1      │
│          Follower A2     │    │       Follower B2      │
│                          │    │                        │
└──────────────────────────┘    └────────────────────────┘
      Async replication between leaders (conflict possible!)
```

**Conflict resolution strategies:**

| Strategy                  | Cách hoạt động               | Pros                    | Cons                 |
| ------------------------- | ---------------------------- | ----------------------- | -------------------- |
| **Last-Write-Wins (LWW)** | Timestamp lớn nhất thắng     | Đơn giản                | Mất data, clock skew |
| **Custom resolution**     | Application logic quyết định | Linh hoạt               | Phức tạp             |
| **CRDTs**                 | Data structures tự merge     | Automatic, no conflicts | Hạn chế data types   |
| **Operational Transform** | Transform concurrent ops     | Google Docs dùng        | Rất phức tạp         |

#### Leaderless (Dynamo-style)

```
Client writes to AND reads from multiple nodes simultaneously

Write (W=2):                Read (R=2):

Client ──▶ Node A ✓        Client ──▶ Node A (x=5, v3)
       ──▶ Node B ✓               ──▶ Node B (x=5, v3)
       ──▶ Node C ✗ (down)        ──▶ Node C (x=3, v1) ← stale!

W=2 satisfied → success    R=2 satisfied, return latest version (v3)
                           Trigger read repair on Node C
```

**Quorum: W + R > N đảm bảo ít nhất 1 node có latest value:**

```
N=3 nodes, W=2, R=2:

Nodes:     A    B    C
Write v2:  ✓    ✓    ✗     (W=2 satisfied)

Read:      ✓    ✗    ✓     (R=2 satisfied)
           v2        v1

Ít nhất 1 node trong read set (A) có v2 → client nhận v2
```

**Anti-entropy mechanisms:**

- **Read repair**: Khi read detect stale node → send latest value
- **Anti-entropy process**: Background process compare và sync data giữa replicas (dùng Merkle trees)
- **Hinted handoff**: Khi target node down, write tạm vào node khác kèm "hint" để forward khi target up lại

### Replication Strategy Comparison

| Aspect               | Single-Leader              | Multi-Leader              | Leaderless                |
| -------------------- | -------------------------- | ------------------------- | ------------------------- |
| **Write conflict**   | Không (single point)       | Có thể xảy ra             | Có thể xảy ra             |
| **Write latency**    | 1 RTT to leader            | Local DC latency          | Max(W nodes RTT)          |
| **Read scalability** | Cao (read from followers)  | Cao                       | Cao                       |
| **Complexity**       | Thấp                       | Cao (conflict resolution) | Trung bình                |
| **Failover**         | Cần election               | Tự động (other leaders)   | Tự động (no leader)       |
| **Consistency**      | Strong possible            | Eventual                  | Tunable (quorum)          |
| **Ví dụ**            | PostgreSQL, MySQL, MongoDB | CouchDB, MySQL Group Rep  | Cassandra, DynamoDB, Riak |

---

## 5. Data Partitioning / Sharding

### Q: Tại sao cần sharding? So sánh các partitioning strategies? 🟡 🟡 [Mid]

**A:**

**Lý do shard:**

1. **Capacity**: Single node không đủ disk cho toàn bộ data
2. **Throughput**: Tăng write throughput bằng cách phân tải sang nhiều nodes
3. **Latency**: Data gần user hơn (geo-partitioning)

| Strategy            | Cách hoạt động                     | Ưu điểm                               | Nhược điểm                                                    |
| ------------------- | ---------------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| **Range-based**     | key range [A-M]→Node1, [N-Z]→Node2 | Range queries hiệu quả, data locality | Hot spots (ví dụ: tên bắt đầu bằng "Nguyễn" ở VN)             |
| **Hash-based**      | hash(key) % N → Node               | Phân phối đều                         | Mất range query capability, thêm/bớt node → reshuffle toàn bộ |
| **Directory-based** | Lookup table: key → node           | Linh hoạt, chuyển data dễ             | Single point of failure (lookup service), thêm hop            |

### Q: Consistent Hashing hoạt động thế nào? (DEEP DIVE) 🔴 🔴 [Senior]

**A:**

**Vấn đề với hash(key) % N:**

- Thêm 1 node (N→N+1): ~toàn bộ keys phải di chuyển
- Ví dụ: N=3→4, key hash=7: 7%3=1 → 7%4=3 (di chuyển!)

**Consistent Hashing giải quyết: chỉ di chuyển ~K/N keys (K = total keys)**

```
Hash Ring (0 to 2^32 - 1):

              0 / 2^32
               │
        ┌──────┴──────┐
       ╱                ╲
      │    Node A        │
      │    (pos: 50)     │
     ╱                    ╲
    │                      │
    │                      │  Node B
    │                      │  (pos: 150)
    │                      │
     ╲                    ╱
      │                  │
      │    Node C        │
       ╲   (pos: 230)  ╱
        └──────┬──────┘
               │
              180

Key "user:123" → hash = 80 → đi theo chiều kim đồng hồ
→ gặp Node B (150) đầu tiên → stored on Node B

Key "order:456" → hash = 200 → clockwise
→ gặp Node C (230) → stored on Node C
```

**Thêm Node D (pos: 120):**

```
Trước:   keys [51..150]  → Node B
Sau:     keys [51..120]  → Node D (di chuyển!)
         keys [121..150] → Node B (giữ nguyên)

Chỉ ~1/N keys di chuyển, không phải toàn bộ!
```

**Vấn đề: Data imbalance** - Nếu ít nodes, phân phối không đều trên ring.

**Giải pháp: Virtual Nodes (vnodes)**

```
Thay vì 1 position/node → mỗi node có nhiều positions (vnodes):

Ring with Virtual Nodes:
              0
              │
       ┌──────┴──────┐
      ╱    A1         ╲
     │          B1     │
     │    C1           │
    ╱          A2       ╲
   │     B2              │
   │           C2        │
    ╲    A3             ╱
     │          B3     │
     │    C3           │
      ╲        A4     ╱
       └──────┬──────┘
              │

A1, A2, A3, A4 = 4 virtual nodes of Node A
B1, B2, B3    = 3 virtual nodes of Node B
C1, C2, C3    = 3 virtual nodes of Node C

Nhiều vnodes hơn → phân phối đều hơn
Khi Node A down → data phân tán sang B và C (không dồn hết vào 1 node)
```

**Ai dùng Consistent Hashing:**

- **Cassandra**: Partitioner dùng consistent hashing với vnodes (mặc định 256 vnodes/node)
- **DynamoDB**: Consistent hashing cho partition key
- **Redis Cluster**: 16384 hash slots (dạng biến thể), mỗi node quản lý 1 subset
- **CDN (Akamai)**: Route request tới cache server gần nhất

### Q: Secondary indexes với partitioning? 🔴 🔴 [Senior]

**A:**

| Approach                         | Cách hoạt động                                              | Ưu điểm                  | Nhược điểm                                                           |
| -------------------------------- | ----------------------------------------------------------- | ------------------------ | -------------------------------------------------------------------- |
| **Local index** (document-based) | Mỗi partition maintain index cho data của nó                | Write nhanh (local)      | Read cần scatter-gather tới TẤT CẢ partitions                        |
| **Global index** (term-based)    | Index được partition riêng (ví dụ: color=red → partition 1) | Read chỉ cần 1 partition | Write chậm (cần update index ở partition khác), eventual consistency |

---

## 6. Message Queues & Event Streaming

### Q: Message Queue vs Event Stream khác nhau cơ bản thế nào? 🟡 🟡 [Mid]

**A:**

```
Message Queue (RabbitMQ):           Event Stream (Kafka):

Producer ──▶ Queue ──▶ Consumer     Producer ──▶ Log ──▶ Consumer A
                                                    ──▶ Consumer B
                                                    ──▶ Consumer C

- Message consumed = deleted         - Events retained (configurable)
- Single consumer per message         - Multiple consumers independently
- No replay                          - Replay by offset possible
- Point-to-point hoặc pub/sub        - Append-only immutable log
- Smart broker, dumb consumer         - Dumb broker, smart consumer
```

| Aspect          | Message Queue                                          | Event Stream                             |
| --------------- | ------------------------------------------------------ | ---------------------------------------- |
| **Paradigm**    | Temporary mailbox                                      | Immutable append-only log                |
| **Consumption** | Destructive (message removed after ACK)                | Non-destructive (consumer tracks offset) |
| **Replay**      | Không thể                                              | Có thể (seek to offset)                  |
| **Ordering**    | Toàn queue (hoặc không đảm bảo nếu multiple consumers) | Per-partition ordering                   |
| **Use case**    | Task distribution, RPC                                 | Event sourcing, analytics, data pipeline |

### Q: Kafka architecture và guarantees? (DEEP DIVE) 🔴 🔴 [Senior]

**A:**

```
┌─────────────────────────────────────────────────────────────────┐
│                     Kafka Cluster                                │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ Broker 0 │  │ Broker 1 │  │ Broker 2 │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                  │
│  Topic: "orders" (3 partitions, replication factor = 2)         │
│                                                                  │
│  Partition 0: Broker 0 (L)  Broker 1 (F)                       │
│  Partition 1: Broker 1 (L)  Broker 2 (F)                       │
│  Partition 2: Broker 2 (L)  Broker 0 (F)                       │
│               L = Leader, F = Follower                          │
│                                                                  │
│  ┌─────────────────────────────┐                                │
│  │ Partition 0 (immutable log) │                                │
│  │ ┌───┬───┬───┬───┬───┬───┐  │                                │
│  │ │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │  │  ◀── offsets                  │
│  │ └───┴───┴───┴───┴───┴───┘  │                                │
│  │           ▲           ▲     │                                │
│  │     Consumer A    Consumer B│  (independent offsets)          │
│  └─────────────────────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

**Consumer Groups:**

```
Topic "orders" (3 partitions)

Consumer Group "order-service":
  Consumer 1 ← Partition 0, Partition 1
  Consumer 2 ← Partition 2

Consumer Group "analytics":
  Consumer 3 ← Partition 0
  Consumer 4 ← Partition 1
  Consumer 5 ← Partition 2

Rules:
- Mỗi partition chỉ assigned cho 1 consumer trong 1 group
- 1 consumer có thể handle nhiều partitions
- Nếu consumers > partitions → some consumers idle
- Khác group → nhận ALL messages (independent)
```

**Delivery Semantics:**

| Semantic          | Cách đạt được                           | Trade-off                     |
| ----------------- | --------------------------------------- | ----------------------------- |
| **At-most-once**  | Commit offset trước khi process         | Nhanh, có thể mất message     |
| **At-least-once** | Process xong rồi commit offset          | An toàn hơn, có thể duplicate |
| **Exactly-once**  | Idempotent producer + transactional API | Chậm hơn, phức tạp            |

**Kafka exactly-once (producer):**

- `enable.idempotence=true`: Mỗi message có producer ID + sequence number → broker detect duplicate
- Transactional API: `beginTransaction()` → send messages → `commitTransaction()` → atomically write to multiple partitions

**Retention**: Kafka giữ messages theo time (7 days mặc định) hoặc size, không phải theo consumption status.

**Log Compaction**: Giữ lại **latest value per key** - hữu ích cho changelog topics (KTable).

### Q: RabbitMQ vs Kafka vs NATS - khi nào dùng cái nào? 🟡 🟡 [Mid]

**A:**

| Aspect         | RabbitMQ                    | Kafka                          | NATS                            |
| -------------- | --------------------------- | ------------------------------ | ------------------------------- |
| **Protocol**   | AMQP 0.9.1                  | Custom binary                  | Custom (text-based)             |
| **Model**      | Smart broker, dumb consumer | Dumb broker, smart consumer    | Both (Core vs JetStream)        |
| **Ordering**   | Per-queue (FIFO)            | Per-partition                  | Per-subject (JetStream)         |
| **Throughput** | ~50K msg/s                  | ~1M msg/s                      | ~10M msg/s (core)               |
| **Latency**    | ~1ms                        | ~5ms (batch-oriented)          | ~0.1ms (core)                   |
| **Retention**  | Until consumed              | Configurable (time/size)       | JetStream: configurable         |
| **Replay**     | Không                       | Có                             | JetStream: Có                   |
| **Language**   | Erlang                      | Java/Scala                     | Go                              |
| **Routing**    | Flexible (exchange types)   | Topic + partition              | Subject-based                   |
| **Use case**   | Task queues, RPC, routing   | Event streaming, data pipeline | Microservice communication, IoT |

**RabbitMQ Exchange Types:**

- **Direct**: Exact routing key match → queue
- **Fanout**: Broadcast to all bound queues
- **Topic**: Pattern matching (orders.\* , orders.#)
- **Headers**: Match on message headers

**NATS specifics:**

- **Core NATS**: Fire-and-forget, at-most-once, ultra-low latency. Tương tự UDP cho messaging.
- **NATS JetStream**: Persistent, at-least-once, replay. Tương tự Kafka nhưng nhẹ hơn.
- Written in Go → rất phù hợp với Go microservices stack.

**Decision Matrix:**

```
Cần message replay/event sourcing?     ──Yes──▶ Kafka
  │ No
  ▼
Cần complex routing logic?             ──Yes──▶ RabbitMQ
  │ No
  ▼
Cần ultra-low latency + Go-native?     ──Yes──▶ NATS
  │ No
  ▼
High throughput data pipeline?          ──Yes──▶ Kafka
  │ No
  ▼
Simple task queue with ACK?             ──Yes──▶ RabbitMQ
```

---

## 7. Distributed Locking

### Q: Tại sao cần distributed lock? Các cách implement? 🟡 🟡 [Mid]

**A:**

**Tại sao cần:** Khi nhiều processes/services cần exclusive access tới shared resource:

- Prevent double-spending (payment)
- Avoid duplicate cron job execution
- Serialize access to external API with rate limit

### Q: Redis-based distributed locking và Redlock controversy? 🔴 🔴 [Senior]

**A:**

**Basic Redis Lock:**

```go
// Acquire lock
result := redis.SetNX("lock:resource", "owner-id", 10*time.Second)
// SetNX = SET if Not eXists + TTL

// Release lock (phải check owner để tránh release lock của người khác)
// Dùng Lua script để atomic check-and-delete:
script := `
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
`
```

**Vấn đề với single Redis instance:** Nếu Redis master crash sau khi SET nhưng trước khi replicate → lock mất → 2 processes cùng hold lock.

**Redlock Algorithm (Antirez):**

1. Lấy current time
2. Gửi SET NX tới **N Redis instances** (N=5 recommended) lần lượt
3. Lock acquired nếu: majority (≥3) instances SET thành công AND tổng thời gian acquire < TTL
4. Effective TTL = initial TTL - time elapsed during acquiring
5. Nếu fail → release lock trên TẤT CẢ instances

```
┌────────┐  SET NX   ┌──────────┐
│ Client ├──────────▶│ Redis 1  │ ✓
│        ├──────────▶│ Redis 2  │ ✓
│        ├──────────▶│ Redis 3  │ ✓  ← Majority (3/5) = Lock acquired!
│        ├──────────▶│ Redis 4  │ ✗
│        ├──────────▶│ Redis 5  │ ✗
└────────┘           └──────────┘
```

**Martin Kleppmann's Critique (2016):**

Kleppmann chỉ ra rằng Redlock vẫn **unsafe** vì:

1. **GC pause / process pause**: Client A acquire lock → GC pause dài → lock TTL expire → Client B acquire lock → Client A resume, nghĩ mình vẫn hold lock → 2 clients in critical section
2. **Clock skew**: Redlock dựa vào wall clock. Nếu clock trên Redis instance bị jump → TTL tính sai → lock expire sớm

**Fencing tokens giải quyết:**

```
┌────────────────────────────────────────────────────┐
│  Fencing Token Flow:                                │
│                                                     │
│  Client A: acquire lock → token=33                  │
│  Client A: GC pause..............                   │
│  Client B: acquire lock → token=34                  │
│  Client B: write(token=34) to storage → accepted    │
│  Client A: resumes, write(token=33) → REJECTED!     │
│            (storage only accepts token ≥ 34)        │
│                                                     │
│  → Storage layer fence out stale lock holders       │
└────────────────────────────────────────────────────┘
```

**Nhưng: Redis không cung cấp fencing token. etcd/ZooKeeper có.**

### Q: So sánh các distributed lock implementations? 🔴 🔴 [Senior]

**A:**

| Aspect                    | Redis (SETNX)                 | Redlock                   | etcd                             | ZooKeeper                    |
| ------------------------- | ----------------------------- | ------------------------- | -------------------------------- | ---------------------------- |
| **Mechanism**             | SET NX + TTL                  | Multi-instance SET NX     | Lease + revision (fencing token) | Ephemeral sequential znode   |
| **Consistency**           | Weak (async replication)      | Stronger (majority)       | Strong (Raft)                    | Strong (ZAB)                 |
| **Fencing token**         | Không                         | Không                     | Có (revision)                    | Có (zxid)                    |
| **Auto-release on crash** | TTL expire                    | TTL expire                | Lease expire                     | Ephemeral node deleted       |
| **Performance**           | Rất nhanh                     | Chậm hơn (5 instances)    | Trung bình                       | Trung bình                   |
| **Complexity**            | Thấp                          | Trung bình                | Thấp (dùng clientv3)             | Trung bình                   |
| **Best for**              | Non-critical mutual exclusion | Nên tránh (controversial) | Correctness-critical locking     | Correctness-critical locking |

**Khi nào dùng distributed lock vs alternatives:**

- **Efficiency lock** (prevent duplicate work): Redis SETNX đủ. Nếu lock fail occasionally → chỉ waste work, không corrupt data.
- **Correctness lock** (prevent data corruption): etcd hoặc ZooKeeper với fencing token. Redis/Redlock không đảm bảo safety.

---

## 8. Distributed Caching

### Q: Các caching patterns và khi nào dùng? 🟡 🟡 [Mid]

**A:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Cache-Aside (Lazy Loading):                                      │
│                                                                  │
│  App ──1. GET──▶ Cache                                          │
│   │      miss ◀──────┘                                          │
│   │──2. GET──▶ DB                                               │
│   │◀── data ──┘                                                 │
│   └──3. SET──▶ Cache                                            │
│                                                                  │
│  Pros: Cache chỉ chứa data thực sự được đọc                    │
│  Cons: Cache miss → 3 round trips; data có thể stale            │
├─────────────────────────────────────────────────────────────────┤
│ Read-Through:                                                    │
│                                                                  │
│  App ──GET──▶ Cache ──miss──▶ DB                                │
│   ◀── data ──┘  ◀── data ──┘                                   │
│              (cache tự load)                                     │
│                                                                  │
│  Giống cache-aside nhưng cache tự biết load từ DB               │
├─────────────────────────────────────────────────────────────────┤
│ Write-Through:                                                   │
│                                                                  │
│  App ──WRITE──▶ Cache ──WRITE──▶ DB                             │
│   ◀── ACK ────┘  ◀── ACK ────┘                                 │
│               (sync, cả hai done mới return)                     │
│                                                                  │
│  Pros: Cache luôn consistent với DB                             │
│  Cons: Write latency cao; cache data có thể không bao giờ đọc  │
├─────────────────────────────────────────────────────────────────┤
│ Write-Behind (Write-Back):                                       │
│                                                                  │
│  App ──WRITE──▶ Cache ──ACK──▶ App                              │
│                  │                                               │
│                  └──async──▶ DB (batch, delayed)                │
│                                                                  │
│  Pros: Write rất nhanh, batch writes to DB                      │
│  Cons: Data loss risk nếu cache crash trước sync                │
└─────────────────────────────────────────────────────────────────┘
```

### Q: Cache invalidation và các vấn đề liên quan? 🔴 🔴 [Senior]

**A:**

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

**Cache stampede / Thundering herd:**
Khi hot key expire → hàng nghìn concurrent requests cùng miss cache → tất cả hit DB → DB overload.

**Giải pháp:**

| Solution                              | Cách hoạt động                                   | Khi nào dùng                                 |
| ------------------------------------- | ------------------------------------------------ | -------------------------------------------- |
| **singleflight**                      | Chỉ 1 goroutine fetch DB, còn lại wait kết quả   | Go services (golang.org/x/sync/singleflight) |
| **Mutex/lock**                        | Lock key khi fetching, others wait               | Single instance                              |
| **Probabilistic early expiration**    | Random % requests refresh cache trước khi expire | High-traffic keys                            |
| **Never expire + background refresh** | Cache không expire, background job update        | Critical hot data                            |

```go
// singleflight example - cực kỳ common trong Go services
var group singleflight.Group

func GetUser(id string) (*User, error) {
    v, err, _ := group.Do("user:"+id, func() (interface{}, error) {
        // Chỉ 1 goroutine thực sự gọi DB
        return db.GetUser(id)
    })
    return v.(*User), err
}
```

**Multi-level Caching:**

```
Request ──▶ L1 (In-process, e.g. sync.Map/bigcache)
              │ miss
              ▼
            L2 (Distributed, e.g. Redis)
              │ miss
              ▼
            Database

L1: ~nanoseconds, limited by process memory, no network hop
L2: ~1ms, shared across instances, large capacity
DB: ~5-50ms

Challenge: Invalidation across L1 caches on different instances
→ Pub/Sub (Redis pub/sub) hoặc event bus để notify invalidation
```

---

## 9. Clock Synchronization

### Q: Tại sao đồng hồ vật lý không đáng tin trong distributed systems? 🟡 🟡 [Mid]

**A:**

- Clock drift: Mỗi máy tính có crystal oscillator riêng, drift ~100ms/day
- NTP chỉ sync được ~1-50ms accuracy (còn tệ hơn qua internet)
- NTP có thể jump time (forward hoặc backward!) → dangerous cho ordering
- Network delay bất định → không thể biết "thời điểm chính xác" event xảy ra

**Hệ quả:** Không thể dùng wall clock để ordering events trong distributed system.

### Q: Giải thích Lamport Timestamps, Vector Clocks, và HLC? 🔴 🔴 [Senior]

**A:**

**Lamport Timestamps (1978) - Logical Clock:**

Rules:

1. Mỗi process maintain counter `C`
2. Trước mỗi event: `C = C + 1`
3. Khi gửi message: gửi kèm `C`
4. Khi nhận message với timestamp `T`: `C = max(C, T) + 1`

```
Process A:   (1)──────(2)───────────────────(5)──send──▶
                                                  │
Process B:         (1)──────(2)──send──▶          │
                                   │              │
Process C:              (1)────────(3)──────(4)───(6)
                                   ▲              ▲
                              receive          receive
                              max(1,2)+1=3     max(4,5)+1=6
```

**Hạn chế:** Nếu `L(a) < L(b)` → KHÔNG có nghĩa a happened-before b. Chỉ đảm bảo chiều ngược: nếu a→b thì `L(a) < L(b)`.

**Vector Clocks - Detect concurrent events:**

Mỗi process maintain vector `[C1, C2, ..., Cn]` (1 entry per process):

```
Process A:  [1,0,0]──[2,0,0]─────────────────────[4,2,0]
                                                     │ send
Process B:     [0,1,0]──[0,2,0]──send──▶             │
                            │                         │
Process C:        [0,0,1]───[2,2,2]──────[2,2,3]─────[4,2,4]
                            ▲                         ▲
                       receive from B            receive from A
                       max each + inc C          max each + inc C
                       [max(0,0), max(0,2),      [max(2,4), max(2,2),
                        max(1,0)] + inc C=1       max(3,0)] + inc C=1
                       = [0,2,1] → [0,2,2]      = [4,2,3] → [4,2,4]

Comparison:
  [2,0,0] vs [0,2,0]: A not ≤ B, B not ≤ A → CONCURRENT!
  [1,0,0] vs [2,2,2]: A ≤ B (element-wise) → A happened-before B
```

**Nhược điểm Vector Clock:** Size grows O(N) với N processes → không scalable cho hệ thống lớn.

**Hybrid Logical Clock (HLC):**

- Kết hợp physical time + logical counter
- `(physical_time, logical_counter)`
- Gần với real time nhưng vẫn đảm bảo causal ordering
- CockroachDB sử dụng HLC

**Google TrueTime (Spanner):**

- GPS receivers + atomic clocks trong mỗi data center
- API: `TrueTime.now()` returns `[earliest, latest]` interval
- Uncertainty interval thường ~1-7ms
- Spanner **chờ đợi** uncertainty interval trước khi commit → đảm bảo external consistency
- Chi phí cực cao → chỉ Google scale mới triển khai thực tế

---

## 10. Distributed System Failure Modes

### Q: Các loại failure trong distributed systems? 🟡 🟡 [Mid]

**A:**

```
┌──────────────────────────────────────────────────────────────┐
│                    Failure Taxonomy                            │
│                                                               │
│  Network Failures:                                            │
│  ├── Partition: Nhóm nodes không giao tiếp được               │
│  ├── Packet loss: Message bị mất trên đường                  │
│  ├── Latency spike: Message đến rất chậm (minutes!)          │
│  └── Asymmetric partition: A→B works, B→A fails              │
│                                                               │
│  Node Failures:                                               │
│  ├── Crash-stop: Node crash và không recover                  │
│  ├── Crash-recovery: Node crash rồi restart (có thể stale)   │
│  ├── Omission: Node drop incoming/outgoing messages           │
│  └── Byzantine: Node hoạt động sai (bug, malicious)          │
│                                                               │
│  Timing Failures:                                             │
│  ├── Clock skew: Đồng hồ các node không đồng bộ              │
│  └── Timeout misconfig: Quá ngắn → false positive failure     │
│                                                               │
│  Grey Failures:                                               │
│  ├── Partial failure: Service hoạt động nhưng response chậm   │
│  ├── Performance degradation: CPU spike, GC pause             │
│  └── Flapping: Node up-down liên tục                          │
└──────────────────────────────────────────────────────────────┘
```

### Q: Split brain là gì và cách ngăn chặn? 🔴 🔴 [Senior]

**A:**

**Split brain**: Khi network partition khiến 2+ nhóm nodes đều nghĩ mình là "active/leader" → cả hai accept writes → data divergence.

```
BEFORE partition:
  [Node A: Leader] ←──▶ [Node B] ←──▶ [Node C]

DURING partition:
  [Node A: Leader]  ──✕──  [Node B] ←──▶ [Node C]
       │                        │
  "I'm still leader"     "A is dead, elect B as leader"
       │                        │
  Accept writes ←──          Accept writes ←──
       │                        │
       └── SPLIT BRAIN! ───────┘
```

**Prevention strategies:**

| Strategy                                       | Cách hoạt động                                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Quorum/Majority**                            | Chỉ partition có >N/2 nodes mới elect leader. Partition nhỏ hơn → read-only hoặc shutdown |
| **STONITH** (Shoot The Other Node In The Head) | Node tin mình là leader → power off node cũ (qua IPMI/BMC) trước khi accept writes        |
| **Fencing**                                    | Old leader không thể write vì storage layer reject stale epoch/token                      |
| **Lease-based**                                | Leader phải renew lease periodically. Partition → lease expire → không còn là leader      |

### Q: Cascading failures và cách ngăn chặn? 🔴 🔴 [Senior]

**A:**

```
Cascading Failure:

Service A ──▶ Service B (overloaded, slow response)
  │
  │ timeout waiting for B...
  │ threads exhausted
  ▼
Service A (also overloaded now)
  │
  │ all callers of A also timeout
  ▼
Service C, D, E... (cascade!)
```

**Prevention patterns:**

| Pattern             | Cách hoạt động                                                   | Analogy            |
| ------------------- | ---------------------------------------------------------------- | ------------------ |
| **Circuit Breaker** | Sau N failures → "open circuit" → fail fast thay vì wait timeout | Cầu chì điện       |
| **Bulkhead**        | Isolate resources per dependency (separate thread pools)         | Vách ngăn tàu thủy |
| **Timeout + Retry** | Giới hạn wait time, retry với backoff                            | --                 |
| **Rate Limiting**   | Giới hạn incoming requests                                       | Van nước           |
| **Load Shedding**   | Reject requests khi quá tải (return 503)                         | Cắt tải điện       |

**Circuit Breaker states:**

```
        success (threshold)
     ┌──────────────────────┐
     │                      ▼
┌─────────┐  failures  ┌─────────┐  timeout  ┌───────────┐
│ CLOSED  │───────────▶│  OPEN   │──────────▶│HALF-OPEN  │
│(normal) │  exceed    │(fail    │ (try one  │(test      │
│         │  threshold │ fast)   │  request) │request)   │
└─────────┘            └─────────┘           └───────────┘
     ▲                      ▲                    │    │
     │                      │   failure          │    │
     │                      └────────────────────┘    │
     │              success                           │
     └────────────────────────────────────────────────┘
```

---

## 11. Leader Election

### Q: Các phương pháp leader election? 🟡 🟡 [Mid]

**A:**

**Bully Algorithm:**

- Node với highest ID luôn thắng
- Khi detect leader failure: gửi election message tới tất cả higher-ID nodes
- Nếu không ai reply → tự trở thành leader
- Nếu higher-ID reply → đợi higher-ID trở thành leader
- Đơn giản nhưng không fault-tolerant tốt

**Ring Algorithm:**

- Nodes tổ chức thành logical ring
- Election message đi vòng quanh ring, collect participant IDs
- Node với highest ID trong message trở thành leader
- Tốn O(N) messages

**Practical: etcd/ZooKeeper-based Election:**

```
etcd election sử dụng lease:

1. Mỗi candidate tạo key với lease:
   PUT /election/leader = "node-1" (lease=30s)

2. Key với lowest revision (create_revision) thắng
   → First come, first served

3. Leader phải keep-alive lease mỗi ~10s

4. Nếu leader crash → lease expire → key tự xóa
   → Candidate tiếp theo (lowest revision) trở thành leader

5. Candidates watch key trước nó (không watch leader key)
   → Avoid herd effect khi leader fail
```

**Lease-based Election properties:**

| Property                | Giải thích                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bounded leader term** | Lease expire → phải renew. Ngăn zombie leader.                                                                                                       |
| **Automatic failover**  | Không cần explicit "step down" message                                                                                                               |
| **Grace period**        | Lease TTL = max time hệ thống không có leader                                                                                                        |
| **Risk**                | Clock skew: leader nghĩ lease còn, nhưng etcd nghĩ expire → brief double leader. Giải quyết: leader stop serving trước lease expire (safety margin). |

---

## 12. Idempotency in Distributed Systems

### Q: Tại sao idempotency critical trong distributed systems? 🟡 🟡 [Mid]

**A:**

```
Không có idempotency:

Client ──POST /pay──▶ Server ──▶ Deduct $100
       ◀── timeout ──┘ (response lost, but payment processed!)

Client ──retry POST /pay──▶ Server ──▶ Deduct $100 AGAIN!
       ◀── 200 OK ────────┘

User bị trừ $200 thay vì $100!
```

**Nguyên nhân cần idempotency:**

- Network timeout: Server xử lý xong nhưng response bị mất → client retry
- At-least-once delivery: Message queue deliver lại message
- Load balancer retry: Retry request khi backend không respond kịp
- Client retry logic: Mobile app retry khi mạng không ổn định

### Q: Cách implement idempotency? 🔴 🔴 [Senior]

**A:**

**Idempotency Key Pattern:**

```
┌────────┐  POST /pay                    ┌────────┐
│ Client │  Idempotency-Key: abc-123     │ Server │
│        │──────────────────────────────▶│        │
│        │                               │  1. Check: "abc-123" in     │
│        │                               │     idempotency store?      │
│        │                               │     NO → process request    │
│        │                               │     Store result with key   │
│        │◀─ 200 OK ────────────────────│                             │
│        │                               │                             │
│        │  (timeout, retry)             │                             │
│        │  POST /pay                    │                             │
│        │  Idempotency-Key: abc-123     │                             │
│        │──────────────────────────────▶│  2. Check: "abc-123" in    │
│        │                               │     store? YES → return     │
│        │◀─ 200 OK (cached result) ────│     stored result           │
└────────┘                               └────────────────────────────┘
```

**Design considerations:**

| Aspect             | Recommendation                                                           |
| ------------------ | ------------------------------------------------------------------------ |
| **Key generation** | Client-generated UUID v4. Không dùng server-side vì retry sẽ tạo key mới |
| **Key storage**    | Redis (fast, TTL tự động) hoặc DB table                                  |
| **TTL**            | 24-48 hours thường đủ. Quá ngắn → retry fail. Quá dài → waste storage    |
| **Scope**          | Per-user + per-action. Cùng key khác user → reject                       |
| **Response**       | Lưu cả response body, không chỉ "processed" flag                         |

**Deduplication strategies khác:**

| Strategy                       | Cách hoạt động                                                     | Use case           |
| ------------------------------ | ------------------------------------------------------------------ | ------------------ |
| **Database unique constraint** | INSERT với unique (user_id, order_id)                              | Simple cases       |
| **Optimistic locking**         | UPDATE WHERE version = X                                           | Concurrent updates |
| **Natural idempotency**        | PUT (replace), DELETE operations tự idempotent                     | RESTful APIs       |
| **State machine**              | Order: PENDING→PAID→SHIPPED. Chỉ transition nếu current state đúng | Workflow/saga      |

### Q: Exactly-once semantics có thực sự khả thi? 🔴 🔴 [Senior]

**A:**

**Strictly speaking: KHÔNG.** Trong mạng không đáng tin cậy, không thể đảm bảo exactly-once delivery. Hai generals' problem chứng minh điều này.

**Thực tế: "Effectively exactly-once" = at-least-once delivery + idempotent processing**

```
"Exactly-once" trong practice:

                    at-least-once                idempotent
Producer ──────────────────────────▶ Consumer ──────────────▶ Side Effect
         (may deliver duplicates)            (dedup before
                                              applying)

Kafka "exactly-once":
- Idempotent producer (sequence numbers) → no duplicates in topic
- Transactional consumer-producer (read-process-write atomically)
- Nhưng: Side effects bên ngoài Kafka (DB write, API call) vẫn cần
  application-level idempotency!
```

---

## Distributed Systems Theory Cheat Sheet

### Key Tradeoffs Summary

```
┌─────────────────────────────────────────────────────────────┐
│              Distributed Systems Tradeoffs                    │
│                                                              │
│  Consistency ◄──────────────────────────▶ Availability       │
│  Consistency ◄──────────────────────────▶ Latency            │
│  Durability  ◄──────────────────────────▶ Performance        │
│  Safety      ◄──────────────────────────▶ Liveness           │
│  Correctness ◄──────────────────────────▶ Throughput         │
│                                                              │
│  There is no silver bullet - chỉ có tradeoffs phù hợp       │
│  với business requirements cụ thể.                           │
└─────────────────────────────────────────────────────────────┘
```

### Concept Quick Reference

| Concept                | One-liner                                                              |
| ---------------------- | ---------------------------------------------------------------------- |
| **CAP**                | Partition xảy ra → chọn Consistency hoặc Availability                  |
| **PACELC**             | CAP + khi không partition: Latency vs Consistency                      |
| **Raft**               | Leader-based consensus: election → log replication → safety            |
| **Consistent Hashing** | Hash ring + virtual nodes → minimal data movement khi add/remove nodes |
| **Quorum**             | W+R>N → guaranteed overlap → strong consistency                        |
| **Vector Clock**       | Detect concurrent events, partial ordering                             |
| **Fencing Token**      | Monotonic token ngăn stale lock holder ghi data                        |
| **singleflight**       | Deduplicate concurrent identical requests (Go pattern)                 |
| **Circuit Breaker**    | Fail fast khi downstream service degraded                              |
| **Idempotency Key**    | Client-generated unique key → dedup retries                            |

### Key Papers to Know

| Paper                           | Year | Key Contribution                                                         | Relevance                          |
| ------------------------------- | ---- | ------------------------------------------------------------------------ | ---------------------------------- |
| **Dynamo** (Amazon)             | 2007 | Leaderless replication, consistent hashing, vector clocks, sloppy quorum | Cassandra, DynamoDB foundation     |
| **Raft** (Ongaro)               | 2014 | Understandable consensus                                                 | etcd, TiKV, CockroachDB            |
| **MapReduce** (Google)          | 2004 | Distributed computation framework                                        | Hadoop foundation                  |
| **Bigtable** (Google)           | 2006 | Wide-column store, SSTable, LSM-tree                                     | HBase, Cassandra influences        |
| **Spanner** (Google)            | 2012 | Global distributed DB, TrueTime, external consistency                    | CockroachDB, YugabyteDB inspired   |
| **Kafka** (LinkedIn)            | 2011 | Distributed commit log                                                   | Event streaming standard           |
| **Paxos Made Simple** (Lamport) | 2001 | Consensus algorithm explanation                                          | Foundation for Raft, ZAB           |
| **Time, Clocks** (Lamport)      | 1978 | Logical clocks, happened-before                                          | Foundation of distributed ordering |

### Interview Questions by Company Focus

**Google-style (Theory heavy):**

- Design a distributed consensus system. What are the trade-offs?
- How would you handle clock synchronization across data centers?
- Explain linearizability vs serializability
- How does Spanner achieve external consistency?

**Grab-style (Practical distributed systems):**

- How to ensure payment is processed exactly once?
- Design a distributed rate limiter across multiple instances
- How would you handle cache invalidation for ride pricing?
- Kafka consumer lag is increasing - how do you debug and fix?
- Design location tracking system (CAP tradeoff discussion)

**Generic Senior/Staff questions:**

- Compare approaches for distributed locking. When is each appropriate?
- How does your system handle split brain scenarios?
- Walk through what happens when a Raft leader fails mid-replication
- Design a distributed cron scheduler (leader election + idempotency)

### Common Misconceptions

| Misconception                             | Reality                                                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| "CAP means choose 2 of 3"                 | P is not optional in real networks. It's really C vs A during partition.                                                                    |
| "Eventual consistency = slow/bad"         | Eventual consistency is sufficient (and optimal) for many use cases. Strong consistency has latency cost.                                   |
| "Raft guarantees no data loss"            | Raft can lose uncommitted entries on leader crash. Only committed (majority ACK) entries are safe.                                          |
| "Kafka is exactly-once"                   | Only within Kafka ecosystem. External side effects still need app-level idempotency.                                                        |
| "Distributed locks are always needed"     | Often, optimistic concurrency or idempotent operations are better alternatives with less coordination overhead.                             |
| "More replicas = more available"          | More replicas with quorum writes = higher write latency. Availability depends on consistency requirements.                                  |
| "Redis is CP"                             | Redis default replication is async → AP. With WAIT command it's closer to CP but still not guaranteed.                                      |
| "Consistent hashing eliminates hot spots" | It distributes keys evenly, but popular keys (hot keys) still create hot spots. Virtual nodes help with node imbalance, not key popularity. |
| "Vector clocks scale well"                | Vector clock size grows with number of actors. For large systems, need alternatives like dotted version vectors or HLC.                     |

---

_Document version: 2026-03. Focus on theory and conceptual understanding for backend engineering interviews at scale-focused companies._

---

## Self-Check / Tự Kiểm Tra — Retrieval Practice

> ⏱️ Che cột "Câu hỏi" rồi tự trả lời, sau đó mở ra kiểm tra.

| #   | Loại           | Câu hỏi                                                                                                                                      |
| --- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | CAP Theorem nói gì? Tại sao trong thực tế chỉ là C vs A chứ không phải C+A+P?                                                                |
| 2   | 🎨 Visual      | Vẽ sơ đồ Consistent Hashing Ring với 3 nodes — chỉ ra key routing và điều gì xảy ra (với bao nhiêu keys) khi thêm node thứ 4.                |
| 3   | 🛠️ Application | Shopee Flash Sale: 1 triệu user mua 1000 iPhone cùng lúc. Bạn chọn CAP position nào, dùng tool gì để handle inventory, và tại sao?           |
| 4   | 🐛 Debug       | Hệ thống payment trừ tiền user 2 lần dù client chỉ bấm 1 lần. Nguyên nhân có thể là gì và bạn fix thế nào mà không cần thay đổi client?      |
| 5   | 🎓 Teach       | Giải thích cho junior developer tại sao Redlock không an toàn cho payment system, GC pause gây ra vấn đề gì cụ thể, và nên dùng gì thay thế. |

💬 **Feynman Prompt:** Giải thích CAP Theorem cho người không biết gì về distributed systems bằng ví dụ chuỗi siêu thị — tại sao khi đường dây điện thoại đứt, bạn không thể vừa "luôn chính xác về tồn kho" vừa "luôn phục vụ khách hàng" cùng lúc?

### 📅 Spaced Repetition Schedule

| Round | When          | Focus                                                                 |
| ----- | ------------- | --------------------------------------------------------------------- |
| 1     | Day 1 (today) | Read all Memory Hooks, answer Self-Check from memory                  |
| 2     | Day 3         | Redo 🟢 Q&As without notes, review CAP + Raft                         |
| 3     | Day 7         | Redo 🟡 Q&As, whiteboard consistent hashing diagram                   |
| 4     | Day 14        | Full Cold Call simulation, tackle 🔴 Q&As                             |
| 5     | Day 30        | Mock interview: design distributed key-value store using all concepts |

## Interview Q&A Summary / Tổng Hợp Q&A Phỏng Vấn

| #   | Question                                    | Difficulty | Core Concept    | Key Signal                                         |
| --- | ------------------------------------------- | ---------- | --------------- | -------------------------------------------------- |
| 1   | CAP Theorem là gì?                          | 🟢         | CAP             | 3 properties, P mandatory, C vs A                  |
| 2   | Phân biệt CP và AP systems?                 | 🟡         | CAP             | etcd=CP, Cassandra=AP, config-dependent            |
| 3   | PACELC Theorem là gì?                       | 🔴         | CAP             | Extends CAP: E/L vs E/C tradeoff                   |
| 4   | Consistency models từ mạnh đến yếu?         | 🟡         | Consistency     | Strong→Sequential→Causal→Eventual                  |
| 5   | Tunable Consistency trong Cassandra?        | 🔴         | Consistency     | QUORUM=majority, ONE=fast, ALL=strong              |
| 6   | Tại sao consensus khó?                      | 🔴         | Consensus       | FLP impossibility, async + 1 crash                 |
| 7   | Raft algorithm hoạt động thế nào?           | 🔴         | Consensus       | Leader election, log replication, safety           |
| 8   | Paxos vs Raft vs ZAB?                       | 🔴         | Consensus       | Raft=understandable, ZAB=ZooKeeper                 |
| 9   | So sánh replication strategies?             | 🟡         | Replication     | Sync/Async/Semi-sync tradeoffs                     |
| 10  | Tại sao cần sharding?                       | 🟡         | Partitioning    | Write scale, range vs hash partitioning            |
| 11  | Consistent Hashing hoạt động thế nào?       | 🔴         | Partitioning    | Ring, virtual nodes, K/N redistribution            |
| 12  | Secondary indexes với partitioning?         | 🔴         | Partitioning    | Local vs global index tradeoff                     |
| 13  | Message Queue vs Event Stream?              | 🟡         | Messaging       | Queue=consumed once, Stream=replayable             |
| 14  | Kafka architecture và guarantees?           | 🔴         | Messaging       | Partitions, ISR, consumer groups                   |
| 15  | RabbitMQ vs Kafka vs NATS?                  | 🟡         | Messaging       | Task queue vs event log vs lightweight             |
| 16  | Tại sao cần distributed lock?               | 🟡         | Locking         | Mutual exclusion across services                   |
| 17  | Redlock và controversy?                     | 🔴         | Locking         | Majority quorum, Kleppmann critique                |
| 18  | So sánh distributed lock implementations?   | 🔴         | Locking         | Redis vs ZooKeeper vs etcd tradeoffs               |
| 19  | Caching patterns và khi nào dùng?           | 🟡         | Caching         | Cache-Aside, Write-Through, Write-Behind           |
| 20  | Cache invalidation và vấn đề?               | 🔴         | Caching         | Stampede, inconsistency, jittered TTL              |
| 21  | Tại sao đồng hồ vật lý không đáng tin?      | 🟡         | Clocks          | NTP drift, clock skew, leap seconds                |
| 22  | Lamport/Vector Clocks và HLC?               | 🔴         | Clocks          | Lamport=total order, Vector=causality, HLC=hybrid  |
| 23  | Các loại failure trong distributed systems? | 🟡         | Failures        | Crash, omission, timing, Byzantine                 |
| 24  | Split brain là gì và cách ngăn chặn?        | 🔴         | Failures        | Network partition, quorum-based prevention         |
| 25  | Cascading failures và cách ngăn chặn?       | 🔴         | Failures        | Circuit breaker, bulkhead, backpressure            |
| 26  | Các phương pháp leader election?            | 🟡         | Leader Election | Bully, ring, Raft-based, lease-based               |
| 27  | Tại sao idempotency critical?               | 🟡         | Idempotency     | Network retries, at-least-once delivery            |
| 28  | Cách implement idempotency?                 | 🔴         | Idempotency     | Idempotency key, dedup table, TTL                  |
| 29  | Exactly-once semantics khả thi?             | 🔴         | Idempotency     | Only processing (not delivery), Kafka transactions |

**Distribution:** 🟢 2 | 🟡 12 | 🔴 15 — Heavily senior-weighted, reflects distributed systems depth.

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Interviewer:** "Your distributed cache shows stale data after a node failure. Walk me through what happened."

**30-Second Answer:**
"When a cache node failed, the load balancer redirected traffic to another node that didn't have the latest data — this is a CAP tradeoff in action. The system chose Availability over Consistency during the partition. I'd investigate: (1) Was it a true network partition or node crash? (2) Check replication lag — was the failover node behind? (3) Short-term: use cache-aside pattern with DB fallback. Long-term: add write-through replication with acknowledgment before confirming writes."

**Follow-up:** "How would you prevent this in a payment system?"
→ "For payments, I'd switch to a CP approach: use etcd or ZooKeeper for critical state, require majority quorum for writes, and implement idempotency keys so retries are safe even during failover."

## Connections / Liên Kết

**Same track (be-track):**

- ↔️ [Microservices Architecture](./02-microservices.md) — Microservices ARE distributed systems; service mesh, circuit breakers
- ↔️ [Auth & Security](./04-auth-security.md) — Distributed auth (JWT stateless vs session replication)
- ↔️ [Resilience Patterns](./07-resilience-patterns.md) — Circuit breaker, bulkhead, retry with backoff
- ↔️ [Message Queues](./08-message-queues.md) — Deep dive on Kafka/RabbitMQ patterns
- ↔️ [gRPC & Protobuf](./09-grpc-protobuf.md) — Efficient inter-service communication

**Cross-track:**

- 🔗 [Database Advanced: SQL Fundamentals](../03-database-advanced/01-sql-fundamentals.md) — ACID vs BASE, transaction isolation
- 🔗 [System Design: Design Framework](../04-be-system-design/01-design-framework.md) — CAP tradeoffs in system design interviews
- 🔗 [Go Concurrency](../01-golang/03-concurrency.md) — Goroutines + channels as local distributed system pattern
