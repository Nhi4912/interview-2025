# Real-time Collaboration with CRDTs — Building the Next Figma

> **Track**: Frontend → Modern Platform | **Difficulty**: 🟢 → 🔴
> [⬅ Back to TOC](../../00-table-of-contents.md) | **Prev**: [Web Components & Shadow DOM](./01-web-components-shadow-dom.md) | **Next**: [Micro-frontends @ Scale](./03-micro-frontends-scale.md)

---

## 🌍 Real-World Scenario — Figma's 32-Person Multiplayer Canvas

In 2016, **Figma** launched and quietly broke design industry assumptions: 30+ designers could edit the same artboard simultaneously, with cursors, selections, comments, and edits all syncing in real time. No "save and reload." No "checkout this file." When a designer in Tokyo moved a frame and a designer in Berlin recolored it at the same instant, **both edits survived** — no overwrites, no conflict modal.

The trick: a **custom multiplayer engine** built on CRDT principles. Figma's CTO Evan Wallace wrote the original conflict-resolution layer in Rust, compiled to WebAssembly. By 2024, Figma was processing **10 billion edits/day**, with average latency under 80ms globally.

Then **Linear** (issue tracker, 2019) used a similar CRDT-based sync engine to make their app feel **instant** — every action is local-first, with background sync. **Notion** rewrote its collaboration engine in 2022 using Yjs to fix a 5-year backlog of merge bugs. **Liveblocks** (2021, $20M Series A) made CRDT-as-a-service so any startup could ship Figma-style multiplayer in a weekend.

In 2026, real-time collaboration is **table stakes** for any document/canvas product. Stripe's invoice editor, Vercel's code review UI, and even Apple's Freeform whiteboard all ride on CRDT engines.

> 🇻🇳 **Tóm tắt**: Figma cho 32 người sửa cùng artboard không xung đột — nhờ CRDT viết bằng Rust+WASM. 2026: mọi sản phẩm document/canvas đều cần multiplayer, CRDT là chuẩn.

---

## A1. 🧠 Memory Hook — **"MERGE"**

| Letter | Stands For                | One-line                                                            |
| ------ | ------------------------- | ------------------------------------------------------------------- |
| **M**  | **Monotonic**             | State only grows — operations never "undo" each other directly      |
| **E**  | **Eventually Consistent** | All replicas converge given enough sync time                        |
| **R**  | **Replica-local**         | Every client edits its own copy, no central lock                    |
| **G**  | **Garbage = tombstones**  | Deleted items become tombstones, never truly removed (mostly)       |
| **E**  | **Encoding matters**      | Wire format & GC strategy decide whether your doc is 100KB or 100MB |

> 🇻🇳 **Catchphrase**: _"MERGE — gộp được mà không cần hỏi ai, ai sửa cũng đúng."_

---

## A2. 🎯 Why It Matters Now

1. **User expectation has shifted**: Post-Figma, post-Notion, users assume "if it's a doc, it's collaborative." Single-user editors feel obsolete.
2. **Local-first movement (Ink & Switch, Martin Kleppmann)**: Apps that work offline first, sync second, are more reliable AND more performant. CRDTs are the math underneath.
3. **AI agents are users too**: When an LLM agent edits your doc concurrently with you, you need conflict-free merge. CRDTs solve this without locks.

> 🇻🇳 **Tóm tắt**: Người dùng mong app nào cũng multiplayer; phong trào local-first; agent AI cũng là "người dùng" sửa cùng → CRDT là math nền tảng.

---

## A3. Layer 1 — Beginner: The Counter Problem

**The setup**: Alice and Bob both have a counter showing `5`. They go offline. Alice clicks +1 three times → `8`. Bob clicks +1 twice → `7`. They reconnect.

**Naïve "last write wins"**: Bob's `7` overwrites Alice's `8` → counter shows `7`. **3 of Alice's clicks lost.** ❌

**CRDT (G-Counter)**: Each replica tracks its own contribution.

```
Alice's view: { Alice: 3, Bob: 0 }   →  total = 3
Bob's view:   { Alice: 0, Bob: 2 }   →  total = 2
Sync (merge by max per key):
              { Alice: 3, Bob: 2 }   →  total = 5  ✅ all 5 clicks counted
```

```
                ┌─────────────┐
                │  Alice +1   │
   replica A    │  Alice +1   │   →  state: {A:3, B:0}
                │  Alice +1   │             ┐
                └─────────────┘             │ merge = max per actor
                ┌─────────────┐             │
   replica B    │  Bob +1     │   →  state: {A:0, B:2}
                │  Bob +1     │             ┘
                └─────────────┘             ▼
                                    {A:3, B:2}  total=5
```

**That's a CRDT.** The merge function is **commutative, associative, idempotent** → no matter the order, you converge to the same state.

> 🇻🇳 **Ví dụ đời thường**: Hai bạn cùng đếm số lần vỗ tay. Mỗi bạn ghi sổ riêng. Khi gặp lại, cộng tổng — không cần ai "đúng hơn ai".

---

## A4. Layer 2 — Intermediate: 4 Core Concepts

### A4.1. CRDT Family Tree

```
CRDT
 ├── State-based (CvRDT)
 │   └── Send full state, merge with `merge(s1, s2)` (commutative semilattice)
 │       Examples: G-Counter, PN-Counter, OR-Set, LWW-Register
 │
 └── Operation-based (CmRDT)
     └── Send each op; assume reliable causal broadcast
         Examples: RGA (sequence), Logoot, Treedoc, Yjs YATA, Automerge

Hybrid:
 └── Delta-state CRDTs — send only the delta of state, get CmRDT bandwidth + CvRDT simplicity
     Examples: Yjs (in practice), Automerge 2.0
```

| Type        | Pros                            | Cons                                 |
| ----------- | ------------------------------- | ------------------------------------ |
| State-based | Simple, robust to lost messages | Bandwidth grows with state size      |
| Op-based    | Efficient (small ops)           | Needs causal delivery (vector clock) |
| Delta-state | Best of both                    | More complex implementation          |

### A4.2. Sequence CRDTs — The Hard Problem

Counters are easy. **Lists/text are hard**: position itself is contested.

Naïve "insert at index 5": if two people insert at index 5 simultaneously, both inserts go to position 5 → one overwrites. ❌

**Solution**: Each character gets a **stable ID** that defines a total order independent of index.

```
Yjs YATA approach:
  Each char = (clientID, clock, value, originLeft, originRight)

  Insert "X" between "A" and "B":
     X = (alice, 7, 'X', originLeft=A.id, originRight=B.id)

  If Bob also inserts "Y" between A and B simultaneously:
     Y = (bob, 4, 'Y', originLeft=A.id, originRight=B.id)

  Both clients see: A, X, Y, B  (or A, Y, X, B)
                       deterministic order via (clientID, clock) tiebreak
```

The result: every concurrent insert produces the same final order on every replica. **No conflicts, no lost characters.**

### A4.3. Tombstones & Garbage Collection

When you "delete" in a CRDT, you typically can't actually remove — you set a tombstone bit. Why? Because a slow replica might still send an op referencing the deleted item.

```
Time T0:  doc = ['A', 'B', 'C']
Time T1:  Alice deletes 'B'  → doc = ['A', tombstone(B), 'C']
Time T2:  Bob (offline since T0) inserts 'X' after 'B'
Time T3:  sync → ['A', tombstone(B), 'X', 'C']  ✅ Bob's intent preserved
```

**GC strategies**:

- **Causal stability**: When all replicas have observed up to vector clock V, items deleted before V can be GC'd. Yjs does this.
- **Snapshot + replace**: Periodically pack state into a fresh CRDT; old tombstones discarded. Automerge's compaction.
- **Server-coordinated GC**: Liveblocks/centralized servers can authoritatively GC.

Cost of tombstones: a doc with 1M edit history might be 50MB on disk. Modern engines (Yjs v13+) keep this under 5MB via run-length encoding.

### A4.4. Awareness vs Document State

**Don't put everything in the CRDT.** Two separate channels:

```
┌──────────────────────────────────────────────────┐
│  Document (CRDT, persisted)                      │
│  - Content of doc/canvas/spreadsheet             │
│  - Comments (resolved/unresolved)                │
│  - Permissions metadata                          │
└──────────────────────────────────────────────────┘
            │
            │ separate from
            ▼
┌──────────────────────────────────────────────────┐
│  Awareness (ephemeral, in-memory only)           │
│  - Cursor position                               │
│  - Selection range                               │
│  - User color, name, avatar                      │
│  - "Is typing" indicator                         │
└──────────────────────────────────────────────────┘
```

Cursors and selections change **60 times/second**; you don't want that in your persisted CRDT history (it would be 100GB/day). Yjs ships an `Awareness` protocol over the same WebSocket but with TTL — when a client disconnects, their awareness state expires after 30s.

> 🇻🇳 **Quy tắc**: Cái cần lưu lâu (text, comment) → CRDT. Cái chỉ cần thấy realtime (cursor) → ephemeral channel.

---

## A5. Layer 3 — Senior/Staff: 5 Hard Problems

### A5.1. CRDTs vs Operational Transformation (OT) — The Old Battle

Google Docs (2010-2018) used OT. Google Wave failed partly due to OT complexity. CRDTs won the late-2010s debate, but the picture is nuanced:

|                               | OT                                | CRDT                                       |
| ----------------------------- | --------------------------------- | ------------------------------------------ |
| **Server required**           | Yes (canonical sequence assigner) | No (P2P possible)                          |
| **Conflict resolution**       | Server transforms ops             | Math guarantees convergence                |
| **Memory footprint**          | Lower (no tombstones)             | Higher (until GC)                          |
| **Offline support**           | Limited (needs server)            | Native                                     |
| **Implementation difficulty** | Very hard (proof-heavy)           | Hard but tractable                         |
| **Used by**                   | Google Docs (legacy), Etherpad    | Figma, Linear, Notion, iCloud, Apple Notes |

Modern verdict: **CRDT for new builds**. OT only if you must keep a centralized authoritative log (some financial / regulated apps).

### A5.2. Schema Evolution in a CRDT World

You shipped v1 with a `Note` type having `title: string, body: string`. v2 adds `tags: string[]`. Old clients are still online editing v1 docs. How do you handle merges?

**Strategy 1 — Forward-compatible reads**: All clients ignore unknown fields. v1 client receiving a v2 doc with `tags` simply doesn't render them, but preserves them on save. Yjs's `Y.Map` supports this naturally.

**Strategy 2 — Versioned migrations**: Server transforms doc on access. Risky — invalidates the "no central authority" property.

**Strategy 3 — Branching CRDTs (Automerge 2.0)**: Treat schema like Git branches; explicit merge of incompatible structures. Powerful but complex.

**Best practice**: Design your schema like Protobuf — only add fields, never rename or remove. Use `Y.Map` over flat objects. Reserve a `version` field on root.

### A5.3. Persistence: Where Does the Doc Live?

Three architectures, three tradeoffs:

```
ARCHITECTURE A: Server as broker only
  [Client A] ← WebSocket → [Relay Server (no state)]
  [Client B] ← WebSocket →
  Source of truth: every client's IndexedDB

ARCHITECTURE B: Server as authoritative replica (Liveblocks, Hocuspocus)
  [Client A] ← WS → [Server (Yjs in memory + S3 snapshots)]
  [Client B] ← WS →
  Server is "first among equals"

ARCHITECTURE C: Server-as-database (Linear approach)
  [Client A] ← WS → [Server applies ops to Postgres + replays]
  [Client B] ← WS →
  Postgres = source of truth, CRDT logic in app server
```

**A** is purest CRDT (true P2P possible) but loses data when last client closes browser without syncing.
**B** is pragmatic — most production apps choose this. Hocuspocus, Liveblocks, Y-Sweet all here.
**C** trades CRDT purity for SQL queryability (Linear can SQL-query issues; pure CRDT doc can't easily).

### A5.4. Network Layer: Sync Protocols

**Yjs sync protocol** (binary, 2-step):

```
Step 1: Client → Server: state vector (current vector clock)
        "I'm at {alice:42, bob:31}"
Step 2: Server → Client: missing updates only
        Binary diff, typically <1KB
```

**Loro / Y-Sweet improvements**: streaming, partial subscription (only sync the section currently visible).

**WebRTC for P2P** (true serverless mode): Yjs has `y-webrtc` provider. Drawback: NAT traversal needs STUN/TURN.

**WebSockets for hub-and-spoke**: 95% of production. Use binary frames. Multiplex multiple docs over one connection.

### A5.5. Performance at 100k Document Size

A Notion-style page with 100k blocks pushes CRDT engines hard. Tactics:

1. **Incremental rendering**: Use a virtual list; CRDT engine emits diffs, only render visible changes.
2. **Worker thread**: Load Yjs in `Web Worker`. Main thread only handles UI; sync transfers via `postMessage` with `Transferable`.
3. **Subdocs**: Yjs `Y.subdoc()` lets you load only the section the user opens. Like SQL lazy joins.
4. **Snapshot + delta**: Persist full snapshot every N ops (e.g., 1000), only stream deltas after.
5. **WASM compaction**: Loro and Automerge 2.0 ship Rust-compiled WASM cores; 10-100x faster than pure-JS for big merges.

---

## A6. ⚠️ Common Mistakes (Top 10 Pitfalls)

| ❌ Sai lầm                                   | 🤔 Tại sao sai                               | ✅ Đúng là                                               |
| -------------------------------------------- | -------------------------------------------- | -------------------------------------------------------- |
| Lưu cursor position trong CRDT               | History phình lên 100MB/ngày                 | Dùng Awareness protocol (ephemeral)                      |
| Dùng `Y.Map` như object thường (`map.x = 1`) | Bypass CRDT; không sync                      | Phải dùng `map.set('x', 1)`                              |
| Lưu file binary lớn trực tiếp trong CRDT     | Mỗi sync >100KB, lag                         | Lưu ở S3, chỉ giữ URL trong CRDT                         |
| Tin "merge xong là instant"                  | Conflict resolution có latency               | Show optimistic UI + reconciliation indicator            |
| Quên rate-limit ops                          | Slider drag = 60 ops/giây × N user           | Throttle/debounce client-side trước khi gửi              |
| Dùng UUID v4 làm clientID                    | Lossy on reconnect; tạo "ghost user"         | Dùng stable session ID + reuse                           |
| Bỏ qua causal order trên op-based CRDT       | Op B đến trước op A nó depend on → state sai | Đảm bảo broadcast theo causal order (vector clock)       |
| Cho phép undo dài vô hạn                     | History bloat → load chậm                    | Bound undo stack (50-100 ops) + GC                       |
| Không test conflict scenarios                | "Hoạt động khi 1 user" ≠ production-ready    | Test 5+ users với fault injection (offline, packet loss) |
| Mix authoritative permissions vào CRDT       | Ai cũng có thể "merge" mình thành admin      | Permissions ở server gate, không CRDT                    |

---

## A7. 🎤 Interview Pattern

**Strong signals**:

- Phân biệt **state-based vs op-based CRDT**, hiểu **commutativity/associativity/idempotency**
- Biết tại sao tombstones cần tồn tại + GC strategies
- Tách bạch **document state vs awareness**
- Hiểu **CRDT vs OT** trade-offs với historical context (Google Wave)
- Đề cập **local-first** philosophy + Martin Kleppmann's research

**Role types**: Senior FE (collaborative apps), FE Platform, Distributed Systems Engineer, anyone at Figma/Linear/Notion/Liveblocks/Replit/Miro/Excalidraw.

**Industries**: Design tools, productivity (notes, docs, sheets), code editors (VS Code Live Share, Replit), whiteboarding, gaming (state sync), IoT (offline sensors).

---

## A8. 🔗 Knowledge Chain

**Prerequisites**: Distributed systems basics (vector clocks, CAP), WebSockets, IndexedDB, JS data structures.

**Unlocks**: Local-first apps, P2P architectures, offline-first PWAs, multiplayer gaming sync, IoT edge sync.

**Cross-track**:

- → [Distributed Systems Theory](../../shared/02-system-design/01-system-design-theory.md)
- → [Consensus Algorithms](../../shared/02-system-design/02-consensus.md)
- → [WebSockets at Scale (BE)](../../be-track/02-backend-knowledge/02-microservices.md)
- → [2026: Edge Computing](../../2026-trends/04-edge-computing-serverless-2026.md) — CRDTs at edge nodes

---

# B. Interview Questions — 10 Graded

---

## B1. 🟢 What problem do CRDTs solve? (L1)

**Answer**: Multiple users editing the same data **concurrently and offline**, without a central server arbitrating each change. Traditional "last write wins" loses data; locking kills UX. CRDTs use math (specifically, conflict-free merge functions) so that **every replica converges to the same state** regardless of update order or network conditions. Think Google Docs, Figma, Notion, Apple Notes — anywhere you'd say "wait, we both edited; whose version won?"

> 💡 **Interview Signal**: ✅ Strong = mentions concurrent + offline + convergence. ❌ Weak = "for real-time apps."

---

## B2. 🟢 What does "eventually consistent" actually mean? (L1)

**Answer**: Given **no new updates** and **enough time for messages to propagate**, all replicas will converge to the **same state**. It's a _liveness_ guarantee (will eventually agree) not a _safety_ guarantee (might temporarily disagree). Critically, eventual consistency does NOT promise: linearizability (instantaneous global order), bounded staleness (might be hours stale), or read-your-writes (a different replica might not have your update yet).

CRDT-specific strengthening: convergence is guaranteed **without coordination** — you don't need consensus or leader election to merge. Just the math.

> 💡 **Interview Signal**: ✅ Strong = distinguishes liveness vs safety + lists what it does NOT promise. ❌ Weak = "consistency happens later."

---

## B3. 🟢 G-Counter, PN-Counter, OR-Set — what's the difference? (L2)

**Answer**:

- **G-Counter (Grow-only)**: Each replica increments only. Merge = max per replica. Use case: page views, likes (you can like, can you "unlike"? if no, G-Counter).
- **PN-Counter (Positive-Negative)**: Two G-Counters: P (increments) and N (decrements). Value = sum(P) - sum(N). Use case: shopping cart count, vote count (allows "unvote").
- **OR-Set (Observed-Remove Set)**: Add wins over remove (with unique add-tag). When you remove an item, you're removing **the specific add observations you've seen**. Concurrent add + remove → add wins. Use case: shared todo list, tag list.

Trade-off: each gets richer semantics but more state. OR-Set's tags accumulate → need GC.

> 💡 **Interview Signal**: ✅ Strong = explains each merge function + chooses correct use case. ❌ Weak = blurs the three.

---

## B4. 🟡 Walk through Yjs YATA: insert "X" between two characters concurrently. (L3)

**Answer**: Doc state: `[A, B]`. Both Alice and Bob insert a character between A and B simultaneously.

```
Alice inserts 'X':  newItem = {
  id: (clientID:'alice', clock:7),
  content: 'X',
  originLeft: A.id,
  originRight: B.id
}

Bob inserts 'Y':    newItem = {
  id: (clientID:'bob', clock:4),
  content: 'Y',
  originLeft: A.id,    ← same!
  originRight: B.id    ← same!
}
```

When the two clients sync, both have to insert two items "between A and B." YATA algorithm:

1. Find all items with the same `originLeft` and `originRight` boundaries.
2. Sort by `clientID` lexicographically (or by `clock`, depending on impl).
3. Place in that deterministic order.

Result on **both** clients: `[A, X, Y, B]` if `'alice' < 'bob'`, else `[A, Y, X, B]`. **Both replicas agree.** No conflict modal, no lost character.

The deeper trick: integration also looks at _transitive_ origins, so even after many concurrent inserts, the algorithm produces a single deterministic order.

> 💡 **Interview Signal**: ✅ Strong = origin boundaries + clientID tiebreak + deterministic. ❌ Weak = "Yjs handles it magically."

---

## B5. 🟡 You have a 5MB Yjs doc that's getting slow. Diagnose. (L3)

**Answer**: First profile. Common causes & fixes:

| Cause                           | Diagnosis                                        | Fix                                       |
| ------------------------------- | ------------------------------------------------ | ----------------------------------------- |
| **Tombstone bloat**             | `Y.encodeStateAsUpdateV2()` >>> rendered content | Force GC: `Y.compress()`/snapshot+restore |
| **Awareness in main doc**       | Many small frequent updates                      | Move cursors to Awareness protocol        |
| **Sync over main thread**       | Long tasks in DevTools                           | Move Yjs to Web Worker                    |
| **Big binary blobs**            | Doc has base64 images                            | Move to S3, store URL only                |
| **No subdoc partitioning**      | Loading whole doc upfront                        | Use `Y.subdoc()` per page/section         |
| **Old protocol v1**             | Wire format inflated                             | Upgrade to v2 binary protocol             |
| **Snapshot bloat in IndexedDB** | y-indexeddb db growing                           | Periodic snapshot replacement             |

Specific Yjs tooling: `Y.logUpdate(update)` shows op size; `Y.snapshot(doc)` for memory inspection; the dev tool **y-protocols/awareness** for awareness-channel inspection.

Real-world fix story: Notion's 2022 rewrite cut typical page from 80MB → 3MB by combining (a) GC pass, (b) moving rich text deltas off the main map, (c) lazy-loading inline databases as subdocs.

> 💡 **Interview Signal**: ✅ Strong = lists multiple causes + fixes + names specific Yjs APIs. ❌ Weak = "make it smaller."

---

## B6. 🟡 Permissions: Why can't you store ACLs in the CRDT itself? (L4)

**Answer**: Because CRDTs are **convergent without authority** — anyone can mutate any field. If "is_admin: true" is a CRDT field, a malicious client can set themselves admin offline, then sync, and the merge will accept it (LWW wins, or even worse, OR-Set adds them).

**Correct architecture**:

```
[Client] → [Auth gateway server] → [CRDT relay/persistence]
              │
              ├── Validates JWT
              ├── Checks ACL (in Postgres, not CRDT)
              └── Allows/rejects ops based on policy
```

The server is the **gatekeeper**, not a participant in CRDT merge logic. ACLs live in a regular relational store with consistency guarantees you control. The CRDT only carries what users are _allowed_ to write.

Liveblocks does this well: each "room" has server-side permissions; CRDT ops are filtered server-side before relay. Hocuspocus has `onAuthenticate` and `onChange` hooks for the same.

> 💡 **Interview Signal**: ✅ Strong = identifies CRDT = no authority + designs server gate. ❌ Weak = "encrypt the field."

---

## B7. 🟡 Compare CRDT vs OT vs "snapshot + diff" for a new collaborative editor. (L4)

**Answer**:

| Approach                       | Bandwidth            | Offline                   | Implementation                     | When to choose                                              |
| ------------------------------ | -------------------- | ------------------------- | ---------------------------------- | ----------------------------------------------------------- |
| **OT (Operational Transform)** | Low (small ops)      | Limited (server-mediated) | Very hard                          | Heavy regulated apps; Google Docs legacy                    |
| **CRDT**                       | Medium (with deltas) | Native                    | Hard but tractable, libs available | New builds, P2P, mobile, offline-first                      |
| **Snapshot + diff**            | High (entire doc)    | Easy                      | Trivial                            | Low-frequency edits, small docs (<10KB), no real-time needs |

**Snapshot + diff** is underrated. For a comments thread or a simple form, just send full state every 5s. Don't reach for CRDT.

**For a new Figma-style editor**: CRDT, with a server-mediated relay (architecture B from A5.3). Use Yjs or Loro. Don't write your own — Figma's "we built CRDT in Rust+WASM" is a 7-year, 30-engineer effort.

**For a Google Docs successor**: Honestly, still use CRDT now. OT's complexity isn't worth it post-2020.

> 💡 **Interview Signal**: ✅ Strong = doesn't dismiss snapshot+diff for simple cases + recommends Yjs/Loro for complex. ❌ Weak = "always use CRDT."

---

## B8. 🔴 Design: Real-time multiplayer for a collaborative whiteboard like Excalidraw, 100 concurrent users per board. (L5)

**Answer (5 min structured)**:

**Constraints**:

- 100 cursors moving 60Hz = 6000 events/sec/board
- 1000+ shapes per board, each editable
- Offline support (commute, plane)
- Soft latency budget: 100ms p95 for shape edits, 50ms p95 for cursors
- Persistence forever

**Architecture**:

```
                ┌──────────────────────────┐
                │   Edge Relay (Cloudflare │
                │     Durable Object per   │
                │     board)               │
                │                          │
                │  ┌────────────────────┐  │
                │  │  Yjs doc in mem    │  │
                │  │  + Awareness       │  │
                │  └────────────────────┘  │
                │           │              │
                │           ▼ (every 30s)  │
                │   R2 snapshot.bin        │
                └──────────────────────────┘
                           ▲
        ┌──────────────────┼─────────────────┐
        │ WS               │ WS              │ WS
   [Client A]        [Client B]        ...100
   ├ Yjs doc (IndexedDB)
   ├ Awareness (in-mem)
   ├ Web Worker for Yjs
   └ Optimistic UI

```

**Key decisions**:

1. **Document model**: One `Y.Doc` per board. Shapes = `Y.Map` keyed by shape ID, each shape is a nested `Y.Map` of properties (x, y, color, points). Layers = `Y.Array` of shape IDs.
2. **Awareness**: Cursor + selection + active tool, NOT in main doc. TTL 30s, throttled to 30Hz client-side.
3. **Edge relay**: Cloudflare Durable Object pinned per board → all 100 users hit the same DO instance. WebSocket fanout via DO native API. ~50ms latency global thanks to edge.
4. **Persistence**: DO has 128MB RAM. Snapshot the Yjs doc to R2 every 30s + on last-disconnect. On cold start, load latest snapshot + replay updates.
5. **GC**: Periodic compaction on snapshot boundary. Discard tombstones older than 24h (acceptable trade-off for whiteboard — undo limited to 24h).
6. **Offline**: Client uses `y-indexeddb` provider. On reconnect, exchange state vectors → diff sync.
7. **Conflict resolution**: Yjs handles automatically. Shape-level conflicts (Alice moves shape, Bob deletes it) → delete wins (use Yjs default, OR-Set semantics).
8. **Bandwidth budget**: At 6000 cursor events/sec, naïve broadcast = 600 events/client/sec. Solution: server-side aggregation — bundle all awareness updates per 50ms tick, send as single binary frame. 20 frames/sec/client.
9. **Cost**: 100 users × 1MB/hour avg = 100MB/hour/board. CF DO billing ~$0.50/board/month for active editing.

**Trade-offs**:

- ❌ Single DO = single point of failure for that board. Mitigate: snapshot to R2 frequently; on DO restart, recover from snapshot in <2s.
- ❌ DO 128MB cap = hard limit on doc size. Mitigate: subdocs for very large boards; archive old layers.
- ❌ Can't run heavy CPU in DO (Workers limit). Mitigate: Yjs is light; if needed, offload to Worker for compaction.

**Counterintuitive insight**: **Don't broadcast every cursor move to every client.** Cursor events are O(N²) — N clients × N cursors. Server-side rate limit to 30Hz aggregate per client, ship a single bundled frame. Excalidraw does this; cuts bandwidth 10×.

**Exit criteria**: 100 concurrent users sustained, p95 cursor latency <50ms, p95 shape edit <100ms, 0 lost edits in 24h fault-injection test (random offline, packet loss 5%, restart edge node).

> 💡 **Interview Signal**: ✅ Strong = Edge DO + awareness throttling + snapshot strategy + counterintuitive cursor batching. ❌ Weak = "use Liveblocks."

---

## B9. 🔴 Diagnose: Users report "ghost edits" — text appears that nobody typed. (L5)

**Answer**: Five most-likely causes, in investigation order:

1. **clientID reuse across sessions** — User opens 2 tabs; both get same clientID; conflicting clocks → algorithm interprets as same user editing concurrently → re-merge produces ghost insertions. **Fix**: New clientID per browser session/tab. Yjs default uses random per `Y.Doc`; check your provider isn't pinning it.

2. **Bad GC** — Tombstones GC'd while a slow client still has ops referencing them. Rebuild on resync materializes ghost text. **Fix**: GC threshold based on global causal stability, not local time.

3. **Server replay bug** — Server crashed mid-broadcast, then replayed from snapshot but missed in-flight ops; client resync produces duplicates. **Fix**: Idempotent op application (Yjs is idempotent by id; check your wrapper isn't bypassing).

4. **Schema migration mid-flight** — v1 client sends a `Y.Text` op; v2 client interprets as `Y.XmlText` (different CRDT). Garbled text. **Fix**: Hard-version the schema; refuse mismatched protocols.

5. **Network reorder + non-causal delivery** — Client receives op B before its dependency A; tries to apply, fails, retries when A arrives, applies twice. **Fix**: Use Yjs's built-in causal ordering; don't roll your own delivery.

Investigation toolkit:

- Enable `Y.logType('all')` to see every op.
- Add server-side audit log of every op with `{clientID, clock, opBody, timestamp}`.
- Replay user session deterministically on a fresh `Y.Doc` from the audit log.

War story: Linear's 2021 incident — race between WebSocket reconnect and IndexedDB flush created ghost issues. Fix: drain queue before reconnect, idempotency keys on server.

> 💡 **Interview Signal**: ✅ Strong = enumerates 5 causes + investigation toolkit + war story. ❌ Weak = "data corruption, just clear cache."

---

## B10. 🔴 Pitch to leadership: Adopt Liveblocks vs build in-house CRDT layer. (L6)

**Answer (4 min structured)**:

> "We need to ship multiplayer for our document editor in Q3. I recommend we adopt **Liveblocks** for v1, with an exit plan to in-house if we hit scale or differentiation needs."

**Why now ($ + metrics)**:

- 78% of new SaaS evaluations cite "real-time collab" as a deciding factor (Gartner 2025).
- Our churn analysis: 22% of churned customers list "no co-editing" as top reason. Each is $1.2K ARR. Multiplayer recoups **~$2.4M ARR** in year 1.
- Time-to-market is the differentiator. Building in-house = 4 engineers × 6 months = $600K + opportunity cost.

**Why Liveblocks (not in-house, not Yjs+self-host)**:

| Option                       | Time to ship  | $ Year 1                 | Year 3 risk                         |
| ---------------------------- | ------------- | ------------------------ | ----------------------------------- |
| In-house CRDT (raw)          | 6-9 months    | $600K-$900K              | Fine — owned IP                     |
| Yjs + self-host (Hocuspocus) | 2-3 months    | $150K + infra ~$50K      | Some maintenance burden             |
| **Liveblocks SaaS**          | **3-4 weeks** | **$3K/month + dev time** | Vendor lock; cost scales with users |
| Convex / Replicache          | 1-2 months    | mid                      | Newer ecosystems                    |

Liveblocks: $0 to $36K/year for first 100K MAU. Cheaper than 1 engineer-month.

**Risk + mitigations**:

- ❌ Vendor lock-in. Mitigate: use their **Yjs adapter** so our doc state is in Yjs format → portable to self-host later.
- ❌ Cost scaling at >1M users. Mitigate: model the curve; at $5K/month we re-evaluate; at $15K/month we migrate to Yjs+Hocuspocus self-host (already designed exit).
- ❌ Custom features (e.g., undo for arbitrary actions, audit log for SOC2). Mitigate: Liveblocks Yjs gives full control of doc model; write our own UI on top.
- ❌ Latency to APAC/SA users. Liveblocks runs on Cloudflare; edge relays exist. Validate p95 <120ms in pilot.

**Phased rollout (Q3)**:

- Week 1-2: Spike with Liveblocks free tier; build prototype `Document` page with Yjs adapter.
- Week 3-4: Internal alpha; 20 employees test 2-week.
- Week 5-6: Beta to 100 customers; measure latency, conflict rate, NPS.
- Week 7-8: GA + pricing adjustment to capture multiplayer value.

**Counterintuitive insight**: We're not buying a CRDT library; we're buying **24 months of focus**. By the time we'd have built our own, our 2 main competitors will have shipped multiplayer twice and iterated. The cost of waiting is much higher than the cost of vendor lock-in we can break later.

**Exit criteria**:

- Q3: GA shipped, p95 sync <120ms, 0 data loss in chaos tests.
- Q4: Multiplayer adoption ≥40% of active accounts, NPS uplift ≥+10.
- Q1 next year: re-evaluate self-host at vendor cost crossing $10K/month.

> 💡 **Interview Signal**: ✅ Strong = "build vs buy" with $ math + Yjs portability hedge + clear exit criteria. ❌ Weak = "use the trendiest one."

---

# C. Memorization Pack

## C1. 📇 Topic Card

```
┌────────────────────────────────────────────────────┐
│  CRDT — Conflict-free Replicated Data Types        │
│                                                     │
│  Mnemonic:  M-E-R-G-E                               │
│  • Monotonic state                                  │
│  • Eventually consistent                            │
│  • Replica-local edits                              │
│  • Garbage = tombstones (need GC)                   │
│  • Encoding & wire format matter                    │
│                                                     │
│  Big idea: math for "everyone wins, no locks"       │
│  Used by: Figma, Linear, Notion, Apple Notes,       │
│           Liveblocks, iCloud, Replit                │
│                                                     │
│  Choose: Yjs (mature), Loro (fast Rust),           │
│          Automerge (research-grade), Liveblocks SaaS│
└────────────────────────────────────────────────────┘
```

## C2. 📊 Q&A Summary Table

| #   | Question                         | Difficulty | Bloom      | Key Phrase                           |
| --- | -------------------------------- | ---------- | ---------- | ------------------------------------ |
| B1  | What problem do CRDTs solve?     | 🟢 L1      | Remember   | concurrent + offline + converge      |
| B2  | "Eventually consistent" meaning? | 🟢 L1      | Understand | liveness, not safety                 |
| B3  | G/PN-Counter, OR-Set             | 🟢 L2      | Understand | merge functions per type             |
| B4  | YATA insert algorithm            | 🟡 L3      | Analyze    | originLeft/Right + clientID tiebreak |
| B5  | Slow Yjs doc diagnosis           | 🟡 L3      | Analyze    | tombstones + awareness + workers     |
| B6  | Why ACLs not in CRDT?            | 🟡 L4      | Evaluate   | no authority, server gate            |
| B7  | CRDT vs OT vs snapshot           | 🟡 L4      | Evaluate   | pick by use case                     |
| B8  | Design Excalidraw multiplayer    | 🔴 L5      | Create     | Edge DO + awareness throttle         |
| B9  | Ghost edits diagnosis            | 🔴 L5      | Analyze    | clientID, GC, replay, schema, causal |
| B10 | Liveblocks vs in-house pitch     | 🔴 L6      | Evaluate   | Yjs adapter as exit hedge            |

## C3. 🎙 Cold-Call (30-second pitch)

> "CRDTs are data structures with mathematically-guaranteed conflict-free merging. The mnemonic is **MERGE**: **M**onotonic state, **E**ventually consistent, **R**eplica-local edits, **G**arbage as tombstones, **E**ncoding matters for wire size. They power Figma's 32-person canvases, Linear's instant feel, Notion's offline editing, and Liveblocks-as-a-service. The two big families are state-based (send full state, merge with a semilattice) and op-based (send each op assuming causal delivery). For text/sequences, modern engines like Yjs's YATA and Automerge solve the position problem with stable IDs and origin pointers. Trade-offs: tombstones grow until GC; awareness data (cursors) shouldn't go in the persisted CRDT; permissions must live server-side. Pick Yjs for production, Loro if you need raw Rust speed, Liveblocks if you want SaaS."

## C4. ✅ Self-Check Quiz (5 items)

1. Why is "last write wins" wrong for collaborative counters? → _It loses concurrent increments._
2. What's the difference between G-Counter and PN-Counter? → _PN allows decrements via two G-Counters (P − N)._
3. Where do cursor positions belong: doc CRDT or awareness? → _Awareness — ephemeral, not persisted._
4. Why can't tombstones be deleted immediately? → _Slow replicas may still send ops referencing them._
5. Why must permissions live outside the CRDT? → _CRDTs converge without authority; anyone could promote themselves._

## C5. 🧒 Feynman Test (~250 words, VI)

Hãy tưởng tượng bạn và 3 bạn khác cùng vẽ chung một bức tranh trên giấy, nhưng mỗi người ngồi ở một thành phố khác nhau và mỗi người có một bản sao của bức tranh. Mỗi người vẽ thêm gì đó vào bản của mình. Sau đó các bản được gửi qua nhau bằng email. Vấn đề: làm sao gộp 4 bản tranh lại thành 1 bức cuối cùng giống hệt nhau ở cả 4 nơi, mà không có ai ghi đè lên nét vẽ của ai?

Đó chính là bài toán **CRDT** giải. CRDT là cách đặc biệt để lưu data sao cho khi gộp lại từ nhiều bản, kết quả luôn giống nhau dù gộp theo thứ tự nào. Giống như cộng số: 1+2+3 = 3+2+1 = 2+1+3 = 6. Kết quả không phụ thuộc thứ tự.

Để làm được điều đó, CRDT thường dùng vài thủ thuật: (1) mỗi sửa đổi có **ID riêng** để biết của ai làm khi nào; (2) khi xóa thì không thực sự xóa mà đánh dấu "đã xóa" (tombstone), để bản chậm đến sau vẫn hiểu được; (3) tách "data thật" (text, hình) khỏi "data tạm" (con trỏ chuột, đang gõ) — cái tạm không cần lưu mãi mãi.

Figma, Notion, Linear đều dùng CRDT để cho phép nhiều người sửa cùng lúc, kể cả khi mất mạng. Khi có mạng lại, các bản tự gộp lại đẹp đẽ, không cần ai phải chọn "version của tôi đúng hay version của bạn đúng". Đây là tương lai của mọi app document — và là một trong những kỹ năng senior FE 2026 cần nắm.

## C6. 📅 Spaced Repetition Schedule

| Day           | Action                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| **Day 1**     | Read full file. Run `npm i yjs` and build a 2-tab text demo.                                          |
| **Day 3**     | Recall MERGE mnemonic. Implement G-Counter + PN-Counter from memory.                                  |
| **Day 7**     | Build Excalidraw-lite: 3 shapes, 2 tabs, drag sync.                                                   |
| **Day 14**    | Whiteboard B8 (whiteboard architecture) in 25 min.                                                    |
| **Day 30**    | Read [Martin Kleppmann's local-first paper](https://www.inkandswitch.com/local-first/). Teach a peer. |
| **Quarterly** | Re-read; check Loro release notes, Automerge 3.0 progress.                                            |

## C7. 🗺 Connections Map

**Same track (FE)**:

- [Web Components & Shadow DOM](./01-web-components-shadow-dom.md)
- [Micro-frontends @ Scale](./03-micro-frontends-scale.md)
- [React 19 Features](../03-react/02-react-19-features-theory.md) — useOptimistic + CRDT
- [Browser Performance — Worker patterns](../06-browser-performance/04-web-performance-comprehensive.md)
- [State Management Comprehensive](../03-react/05-state-management-comprehensive.md)

**Cross-track**:

- [Distributed Systems Theory](../../shared/02-system-design/01-system-design-theory.md)
- [Consensus & Vector Clocks](../../shared/02-system-design/02-consensus.md)
- [Message Queues at Scale](../../be-track/02-backend-knowledge/08-message-queues.md)
- [2026: Edge Computing](../../2026-trends/04-edge-computing-serverless-2026.md)
- [2026: AI Agent Eval](../../2026-trends/09-ai-agent-evaluation-production.md) — agents as concurrent editors

**Further reading**:

- [Yjs documentation](https://docs.yjs.dev/)
- [Loro](https://loro.dev/) — Rust CRDT engine
- [Automerge](https://automerge.org/)
- [Liveblocks](https://liveblocks.io/)
- [Local-first software (Ink & Switch)](https://www.inkandswitch.com/local-first/)
- ["A Conflict-Free Replicated JSON Datatype" — Martin Kleppmann](https://arxiv.org/abs/1608.03960)
- [Figma's multiplayer implementation blog](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/)
- [Replicache + Reflect (Rocicorp)](https://replicache.dev/)

---

[⬅ Back to TOC](../../00-table-of-contents.md) | **Prev**: [Web Components & Shadow DOM](./01-web-components-shadow-dom.md) | **Next**: [Micro-frontends @ Scale →](./03-micro-frontends-scale.md)
