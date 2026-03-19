# Replication & Partitioning / Sao Chép và Phân Vùng Dữ Liệu

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [System Design Theory](./system-design-theory.md) | [Consensus Algorithms](./consensus-algorithms.md) | [Sharding & Transactions](../../shared/03-database/04-sharding-and-transactions.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**VinID MySQL replication lag incident:** Production setup: 1 primary + 2 read replicas. Analytics team chạy heavy report queries trên replica. Khi primary có burst of writes (flash sale), replica replication lag tăng lên 45 giây. Result: user đặt hàng thành công nhưng refresh trang thấy "order not found" (vì đọc từ lagging replica). Fix: route critical reads (order status) đến primary, analytics reads đến replica with lag tolerance.

**Bài học:** Replication lag không phải vấn đề lý thuyết — nó xảy ra trong production. Architect phải biết khi nào đọc từ primary vs replica.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Replication giống photocopy tài liệu: bản gốc (primary) được sao chép ra nhiều bản (replicas) để nhiều người cùng đọc. Vấn đề: nếu bản gốc vừa sửa xong, photocopy chưa cập nhật — bạn đọc phiên bản cũ. Sharding giống chia tài liệu thành nhiều quyển theo chủ đề (shard key) — mỗi người giữ một phần.

**Why it matters:** Replication (cho read scale + HA) và sharding (cho write scale) là hai kỹ thuật scale DB quan trọng nhất. Senior phải biết khi nào dùng cái nào.

---

## Visual Overview / Sơ Đồ Tổng Quan

### Replication Models
```
SINGLE LEADER (Master-Slave):
        ┌──────────┐
        │  Leader  │  ← all WRITES go here
        └─────┬────┘
              │ replication log
       ┌──────┴──────┐
       ▼             ▼
  ┌─────────┐  ┌─────────┐
  │Follower1│  │Follower2│  ← READS can go here
  └─────────┘  └─────────┘

  Pros: simple, strong consistency for writes
  Cons: leader = bottleneck + SPOF for writes

MULTI-LEADER:
  ┌──────────┐   ┌──────────┐
  │ Leader A │◄──►│ Leader B │  ← both accept writes
  └─────┬────┘   └────┬─────┘   ← sync between leaders
        ▼              ▼
  [Followers]    [Followers]

  Pros: geo-distributed writes, no single write bottleneck
  Cons: CONFLICT RESOLUTION needed (concurrent writes to same data)

LEADERLESS (Dynamo-style):
  Client writes to W of N nodes
  Client reads from R of N nodes
  Consistency if W + R > N

  W=2, R=2, N=3:  ← quorum read+write
  ┌────┐ ┌────┐ ┌────┐
  │ N1 │ │ N2 │ │ N3 │  Write to 2/3, Read from 2/3
  └────┘ └────┘ └────┘  At least 1 overlap → fresh data
```

### Replication Lag Visualization
```
Async replication timeline:
t=0: Client writes user.name="Alice" to Leader
t=0: Leader commits locally
t=2ms: Follower1 receives and applies
t=5ms: Follower2 receives and applies

Read-your-own-writes problem:
t=1ms: Client reads from Follower1 → still "Bob" (stale!)
                                      ↑
                        Replication lag window

Fix: read-after-write consistency:
  Option 1: Read own writes from Leader
  Option 2: Track replication position, wait until follower caught up
  Option 3: Sticky session — always read from same replica
```

### Partitioning Strategies
```
RANGE PARTITIONING:
Key range:  [A-F]  [G-M]  [N-Z]
Shard:       P1     P2     P3
Problem: "A" names are popular → P1 = hotspot!

HASH PARTITIONING:
hash("alice") % 3 = 1 → Shard P1
hash("bob")   % 3 = 2 → Shard P2
Pros: even distribution
Cons: no range queries, resharding = move everything

CONSISTENT HASHING:
Ring: ──────A(0°)──────B(120°)──────C(240°)──────
       ^ key           ^ key           ^ key
       stored at A     stored at B     stored at C

Add node D between A and B:
Only keys previously at B that are now "closer" to D move
≈ 1/N of total keys move (vs ALL with hash mod N!)
```

---

---

## 1. Replication Fundamentals / Nền tảng sao chép

### 🟢 Q: Why do systems replicate data? `[Junior]`
**A:** Sao chép dữ liệu để tăng availability, đọc nhanh hơn ở nhiều vùng địa lý, và tăng khả năng chịu lỗi khi node chết.
Replication cũng hỗ trợ backup/DR và giảm tải read cho primary node.
Trade-off: chi phí hạ tầng và độ phức tạp consistency cao hơn.

### 🟢 Q: What is the difference between replication and backup? `[Junior]`
**A:** Replication phục vụ hệ thống online, dữ liệu được sao chép liên tục gần real-time.
Backup là bản chụp để khôi phục khi sự cố/lỗi logic, thường không dùng trực tiếp cho traffic đọc/ghi.

## 2. Leader-Follower Replication / Sao chép có leader

### 🟡 Q: How does leader-follower replication work? `[Mid]`
**A:** Client ghi vào leader, leader ghi WAL/binlog rồi follower replay log để đồng bộ.
Read có thể đi follower để scale, nhưng cần chú ý replication lag.
Failover cần election/promote follower thành leader mới.

### 🟡 Q: What problems are caused by replication lag? `[Mid]`
**A:** Read-after-write có thể fail nếu đọc follower chưa kịp đồng bộ.
Analytics hoặc API list có thể thấy dữ liệu cũ giữa các request.
Mitigation: read-your-writes routing, session stickiness, hoặc monotonic read policy.

## 3. Multi-Leader Replication / Đa leader

### 🔴 Q: When should we use multi-leader replication? `[Senior]`
**A:** Dùng khi cần ghi ở nhiều region độc lập với latency thấp, hoặc hệ thống thường xuyên disconnected (edge/offline-first).
Multi-leader tăng write availability nhưng conflict resolution phức tạp hơn leader-follower.

### 🔴 Q: How are write conflicts resolved in multi-leader systems? `[Senior]`
**A:** Các chiến lược: Last-Write-Wins (đơn giản nhưng có thể mất dữ liệu), vector clock, merge function theo domain, hoặc CRDT.
Phỏng vấn senior nên nêu rõ: conflict policy phải do business semantics quyết định, không chỉ kỹ thuật.

## 4. Leaderless Replication and Quorum / Sao chép không leader

### 🔴 Q: What is leaderless replication (Dynamo style)? `[Senior]`
**A:** Không có node leader cố định; client/coordinator ghi vào nhiều replica song song.
Đọc/ghi dùng quorum với tham số N (replicas), W (write ack), R (read replicas).
Điều kiện phổ biến để đọc thấy dữ liệu mới: R + W > N (trong điều kiện không split nghiêm trọng).

### 🔴 Q: What are sloppy quorum and hinted handoff? `[Senior]`
**A:** Sloppy quorum cho phép ghi tạm vào node thay thế khi replica mục tiêu down.
Hinted handoff lưu 'ghi hộ' rồi chuyển lại replica gốc khi node phục hồi.
Mục tiêu là tăng availability, đánh đổi consistency tạm thời.

## 5. Sync vs Async Replication / Đồng bộ và bất đồng bộ

### 🟡 Q: Synchronous vs asynchronous replication trade-offs? `[Mid]`
**A:** Synchronous: commit khi replica xác nhận -> consistency mạnh hơn nhưng latency cao hơn và giảm availability khi replica lỗi.
Asynchronous: commit nhanh, availability cao hơn, nhưng có cửa sổ mất dữ liệu khi leader chết trước khi ship log.

## 6. Partitioning and Sharding / Phân vùng dữ liệu

### 🟢 Q: What is data partitioning (sharding)? `[Junior]`
**A:** Partitioning là chia dữ liệu lớn thành nhiều phần nhỏ (shard/partition) để lưu trên nhiều node.
Mục tiêu: scale ngang dung lượng và throughput.

### 🟡 Q: Range-based partitioning works how? `[Mid]`
**A:** Chia theo miền giá trị liên tục, ví dụ user_id 1-1M ở shard A, 1M+-2M ở shard B.
Ưu điểm: query theo range nhanh; nhược điểm: dễ lệch tải nếu key tăng tuần tự (hot shard).

### 🟡 Q: Hash-based partitioning works how? `[Mid]`
**A:** Tính hash(key) rồi mod theo số shard để phân phối đều hơn.
Nhược điểm: query theo range kém và rehash tốn kém khi đổi số shard nếu không dùng consistent hashing.

### 🔴 Q: How does consistent hashing with virtual nodes work? `[Senior]`
**A:** Map node và key lên vòng hash. Key thuộc node đầu tiên theo chiều kim đồng hồ.
Virtual nodes (vnodes) cho mỗi physical node giúp phân phối đều hơn và rebalancing mượt khi node join/leave.
Khi thêm node, chỉ một phần key di chuyển thay vì toàn bộ.

### 🟡 Q: What is directory-based partitioning? `[Mid]`
**A:** Có một directory service/map lưu key-range -> shard location.
Ưu điểm: linh hoạt định tuyến; nhược điểm: cần HA cho directory và tăng complexity vận hành.

## 7. Horizontal vs Vertical Partitioning / Phân vùng ngang và dọc

### 🟢 Q: Horizontal vs vertical partitioning? `[Junior]`
**A:** Horizontal partitioning chia theo hàng (rows) giữa nhiều shard.
Vertical partitioning chia theo cột/nhóm thuộc tính (columns/tables) theo miền nghiệp vụ hoặc access pattern.
Có thể kết hợp cả hai trong hệ thống lớn.

## 8. Rebalancing and Movement / Tái cân bằng dữ liệu

### 🔴 Q: When must partitions move and rebalance? `[Senior]`
**A:** Khi node đầy disk, CPU/hotspot, thêm node mới, hoặc thay đổi pattern truy cập.
Rebalancing cần giới hạn bandwidth, theo dõi lag, và ưu tiên online migration để giảm downtime.

### 🔴 Q: What are safe rebalancing strategies? `[Senior]`
**A:** Dual-write tạm thời + checksum verification + cutover bằng feature flag.
Với DB hỗ trợ native rebalance, vẫn cần runbook rollback và SLO guardrail.

## 9. Cross-Partition Queries / Truy vấn xuyên phân vùng

### 🔴 Q: Why are cross-partition joins expensive? `[Senior]`
**A:** Join cần shuffle dữ liệu qua mạng giữa shard, tăng latency và chi phí I/O.
Global secondary index hoặc data duplication có thể giảm cost nhưng tăng write complexity.

### 🟡 Q: How to reduce cross-shard query cost? `[Mid]`
**A:** Thiết kế shard key theo access pattern chính, pre-aggregate, denormalize có kiểm soát, và dùng query router thông minh.
Nếu cần analytical query phức tạp, chuyển sang data warehouse/OLAP riêng.

## 10. Real-World Database Examples / Ví dụ thực tế

### 🟡 Q: How PostgreSQL implements replication at high level? `[Mid]`
**A:** PostgreSQL dùng WAL shipping/streaming replication từ primary đến standby.
Có thể async hoặc semi-sync/sync tùy cấu hình. Standby thường read-only cho scale đọc.

### 🟡 Q: How MongoDB sharding works conceptually? `[Mid]`
**A:** MongoDB chia dữ liệu theo shard key, có mongos router và config servers quản lý metadata.
Chunk migration hỗ trợ rebalancing; chọn shard key sai dễ gây hotspot.

### 🟡 Q: How Cassandra uses consistent hashing? `[Mid]`
**A:** Cassandra đặt partition key lên token ring, replication theo strategy (Simple/NetworkTopology).
Dữ liệu phân tán bằng consistent hashing + vnode, hỗ trợ scale ngang tốt.

## 11. Interview Drill Q&A / Bộ câu hỏi luyện phỏng vấn

### 🟢 Q: What does R+W>N mean in quorum systems? `[Junior]`
**A:** Đây là điều kiện trực giác để read quorum giao với write quorum, tăng khả năng đọc được phiên bản mới nhất.
Tuy nhiên vẫn cần xử lý clock skew, hinted handoff và repair.

### 🟢 Q: Why not always use synchronous replication? `[Junior]`
**A:** Vì latency cao và giảm availability khi replica chậm/lỗi.
Nhiều hệ thống chọn async + cơ chế bù để cân bằng UX và độ bền dữ liệu.

### 🟡 Q: How do you choose a good shard key? `[Mid]`
**A:** Shard key nên có cardinality cao, phân phối đều, và bám sát query pattern phổ biến.
Tránh key tăng tuần tự hoặc quá lệch theo tenant lớn.

### 🟡 Q: What is monotonic read and why important? `[Mid]`
**A:** Monotonic read đảm bảo user không đọc dữ liệu 'lùi thời gian' giữa hai request liên tiếp.
Hữu ích khi đọc từ follower có lag.

### 🟡 Q: How can we handle tenant hotspot in multi-tenant DB? `[Mid]`
**A:** Tách tenant lớn sang shard riêng (tenant isolation), hoặc thêm tiered partitioning theo tenant+subkey.
Kết hợp rate limiting và adaptive rebalancing.

### 🔴 Q: How to perform zero-downtime shard split? `[Senior]`
**A:** Thực hiện backfill song song, dual-write, verify checksum/row count, sau đó cut traffic dần.
Giữ rollback path đến khi confidence đạt ngưỡng.

### 🔴 Q: How do anti-entropy repairs work in leaderless stores? `[Senior]`
**A:** Node định kỳ so sánh Merkle tree/hash range để phát hiện divergence và đồng bộ lại.
Cơ chế này giảm drift dài hạn do packet loss hoặc partial failures.

### 🔴 Q: How to reason about PACELC with replication choices? `[Senior]`
**A:** PACELC: nếu Partition thì A/C tradeoff; Else thì Latency/Consistency tradeoff.
Ví dụ multi-region sync replication thường tăng consistency nhưng trả giá bằng latency.

### 🔴 Q: What failure mode is often ignored in failover drills? `[Senior]`
**A:** Split-brain và stale DNS/client cache sau failover thường bị đánh giá thấp.
Cần fencing token và health check nhiều tầng.

### 🟡 Q: When should we avoid cross-region writes? `[Mid]`
**A:** Khi business không cần active-active và conflict cost quá cao.
Single-writer per region pair thường đơn giản hơn để vận hành.

## 12. Cross-References / Tài liệu liên quan

- `docs/shared/02-system-design/system-design-theory.md`
- `docs/shared/02-system-design/consensus-algorithms.md`
- `docs/shared/03-database/database-theory.md`
- `docs/be-track/02-backend-knowledge/03-distributed-systems.md`
- `docs/be-track/03-database-advanced/03-nosql-redis-mongo.md`
- `docs/be-track/04-be-system-design/02-classic-problems.md`


---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What are the replication strategies and their trade-offs? / Các chiến lược replication? 🟡 Mid

**A:** Three strategies: **Synchronous**: primary waits for all replicas to acknowledge. Strong consistency, higher latency. **Asynchronous**: primary responds after local write, replicates in background. Low latency, possible data loss on failover. **Semi-synchronous**: wait for at least one replica (MySQL default). Balanced.

```
Sync:   Client → Primary → Replica1 → Replica2 → ACK all → respond
        Latency = max(replica RTTs). No data loss on failover.

Async:  Client → Primary → respond immediately
                              ↓ background
                           Replica1, Replica2 (lag possible)
        Latency = just primary. Risk: failover may lose uncommitted writes.

Semi:   Wait for 1 replica → respond. Balance of both.
```

Vietnamese explanation: PostgreSQL streaming replication mặc định = async (set `synchronous_standby_names` for sync). MySQL Group Replication = semi-sync. Replication lag: replica có thể read stale data. Fix "read-your-writes": read từ primary sau write, hoặc session token route về synced replica. Interview: "Khi nào dùng async vs sync replication?" → business consistency requirements.

---

### Q: What is database sharding and how do you choose a shard key? / Database sharding và cách chọn shard key? 🔴 Senior

**A:** Sharding splits data across multiple DB instances (horizontal partitioning). A **shard key** determines which shard a record belongs to.

```
Shard key strategies:
1. Range-based: user_id 1-1M → Shard1, 1M-2M → Shard2
   ✓ Range queries efficient
   ✗ Hotspot risk (new users all hit last shard)

2. Hash-based: hash(user_id) % N → shard
   ✓ Even distribution
   ✗ Range queries need scatter-gather (slow)

3. Geographic: US → Shard-US, EU → Shard-EU
   ✓ Data residency + latency
   ✗ Uneven load if regions imbalanced

Good shard key: high cardinality, even distribution, immutable,
in most query predicates. Avoid: time-based (hotspot), low cardinality (status).
```

Vietnamese explanation: Chọn shard key là quyết định quan trọng nhất. Pitfalls: (1) `created_at` → all new writes to last shard. (2) `status` → imbalanced. (3) Sequential ID → same hotspot. Best: composite key (`tenant_id + user_id`). Consistent hashing: add/remove shards without full rehash. Cross-shard queries = expensive scatter-gather → design schema to avoid. Interview: don't jump to sharding — read replicas + caching first.

---

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Point |
|----------|-------|-----------|
| Replication strategies | 🟡 | Sync=consistent; async=fast+lag; semi-sync=MySQL default balanced |
| Sharding & shard key | 🔴 | High cardinality, even distribution, immutable; avoid time-based hotspots |

---

## Self-Check / Tự Kiểm Tra

- [ ] Can I explain the difference between synchronous and asynchronous replication (consistency vs performance)?
- [ ] Can I describe 3 bad shard key choices and explain why each causes problems?
- [ ] Can I explain when to use read replica vs primary for reads?
- [ ] Can I describe how replication lag manifests as a user-visible bug?
- 💬 **Feynman Prompt:** Giải thích tại sao "always route reads to primary" solves replication lag but is not a scalable solution — và khi nào bạn *phải* chấp nhận eventual consistency từ replica.

## Connections / Liên Kết

- ⬅️ **Built on**: [System Design Theory](./system-design-theory.md) — scaling strategies require replication understanding
- ⬅️ **Built on**: [Consensus Algorithms](./consensus-algorithms.md) — single-leader replication needs consensus for leader election
- ➡️ **Applied in**: [Sharding & Transactions](../../shared/03-database/04-sharding-and-transactions.md) — detailed sharding implementation
- 🔗 **Related**: [Observability & Scale](../../be-track/04-be-system-design/05-observability-and-scale.md) — DB scaling is a core scale topic
