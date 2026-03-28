# Data Structures Theory / Lý Thuyết Cấu Trúc Dữ Liệu

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Algorithms Theory](./algorithms-theory.md) | [Complexity Analysis](./complexity-analysis.md) | [LeetCode Practice](../../leetcode/)

---

## Real-World Scenario / Tình Huống Thực Tế

**Leetcode interview at Shopee (ứng viên chia sẻ):** Câu hỏi "Design a leaderboard system" — ứng viên dùng array + linear scan: O(n) per update. Với 1M players, mỗi score update cần scan toàn bộ → 1M operations. Interviewer gợi ý: "Có data structure nào tốt hơn không?" Câu trả lời: Redis Sorted Set (Balanced BST internally) → O(log n) update và O(log n + k) range query. Biết data structure phù hợp = 100x performance improvement với 1 dòng code thay đổi.

**Bài học:** Data structures là công cụ — chọn đúng công cụ quyết định hiệu năng. Biết time/space complexity của mỗi operation là kiến thức bắt buộc.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Data structures là các loại hộp chứa đồ: array như ngăn kéo có đánh số (truy cập nhanh, sắp xếp lại chậm), linked list như chuỗi hạt (thêm/xóa giữa chừng dễ), hash table như tủ có nhãn (tìm ngay bằng tên), heap như tháp cao nhất luôn ở đỉnh (min/max nhanh). Chọn sai hộp = làm chậm mọi thứ không cần thiết.

**Why it matters:** Mọi algorithm đều cần data structure phù hợp. Interview coding round thường test việc chọn DS đúng cho bài toán cho trước. Đây là nền tảng của mọi kỹ thuật tối ưu.

---

## How to Read This Guide / Cách Đọc Tài Liệu Này

Mỗi cấu trúc dữ liệu được trình bày theo format:

1. **Analogy** — liên tưởng thực tế dễ nhớ
2. **Visual diagram** — sơ đồ ASCII trực quan
3. **Complexity table** — bảng độ phức tạp
4. **Real use cases** — dùng ở đâu trong production
5. **Interview tip** — tip phỏng vấn cụ thể

**Nguyên tắc chọn data structure:**

```
Cần access by index nhanh?          → Array
Cần insert/delete ở đầu/giữa nhiều? → Linked List
Cần LIFO (undo, parse)?             → Stack
Cần FIFO (task queue, BFS)?         → Queue
Cần lookup O(1)?                    → Hash Table
Cần sorted + range query?           → BST / B+Tree
Cần priority (task scheduling)?     → Heap
Cần prefix search?                  → Trie
Cần graph traversal?                → Adjacency List/Matrix
```

---

---

## Overview / Tổng Quan

| #   | Concept               | Role                                                               | Interview Weight |
| --- | --------------------- | ------------------------------------------------------------------ | ---------------- |
| 1   | Array & Dynamic Array | Sequential access O(1), cache-friendly, foundation of mọi DS       | ⭐⭐⭐⭐⭐       |
| 2   | Linked List           | O(1) insert/delete at known position, basis of Stack/Queue/LRU     | ⭐⭐⭐⭐         |
| 3   | Hash Table            | O(1) avg lookup — Two Sum, frequency count, dedup                  | ⭐⭐⭐⭐⭐       |
| 4   | BST / Balanced Tree   | Sorted operations O(log n), range queries, DB indexes              | ⭐⭐⭐⭐         |
| 5   | Heap / Priority Queue | O(1) min/max, O(log n) insert — top-K, scheduling, merge K lists   | ⭐⭐⭐⭐⭐       |
| 6   | Trie                  | Prefix search O(L), autocomplete, spell check                      | ⭐⭐⭐           |
| 7   | Graph Representations | Model relationships — BFS/DFS foundation, social networks, routing | ⭐⭐⭐⭐         |

**Quan hệ:** Array (1) → Linked List (2) = linear structures. Hash Table (3) = O(1) lookup built on array. BST (4) + Heap (5) = tree structures. Trie (6) = specialized tree. Graph (7) = general structure combining all.

---

## Core Concepts — Phase 2 Deep Dive

### Concept 1: Array & Dynamic Array

🪝 **Memory Hook:** Array = **dãy tủ đồ có đánh số** — biết số = mở tủ O(1). Dynamic array = tủ tự mở rộng (ArrayList/Go slice) — đầy thì dọn sang tủ gấp đôi.

**Why exists / Tại sao tồn tại:**

- Level 1: Cần truy cập phần tử bất kỳ bằng index O(1) — base case cho mọi data structure
- Level 2: CPU cache line loads contiguous memory → array access sequential = cache-friendly = thực tế nhanh hơn linked list dù cùng O(n)
- Level 3: Dynamic array (Go slice, Java ArrayList) amortized O(1) append giải quyết "fixed size" limitation

**Layer 1 — Simple Analogy / Lớp 1:**
Array giống **dãy ghế trong rạp phim** đánh số 0→n-1. Muốn ghế #42 = đi thẳng đến. Muốn thêm ghế giữa = phải dời tất cả ghế phía sau.

**Layer 2 — Mechanics / Lớp 2:**

```
Memory layout: [elem0|elem1|elem2|elem3|...|elem_n-1]
                ↑ base address
Index access: base + index × sizeof(elem) = O(1)

Operation     │ Static Array │ Dynamic Array (amortized)
──────────────┼──────────────┼─────────────────────────
Access [i]    │ O(1)         │ O(1)
Append        │ N/A          │ O(1) amortized
Insert at i   │ O(n) shift   │ O(n) shift
Delete at i   │ O(n) shift   │ O(n) shift
Search        │ O(n)         │ O(n)
```

**Layer 3 — Edge Cases / Lớp 3:**

- Go slice: append beyond capacity → allocate new backing array, copy → old array eligible for GC
- 2D array: row-major vs column-major → iterate row-by-row for cache locality
- Sparse array: 10⁶ elements but 99% empty → use HashMap instead

| Sai lầm                         | Tại sao sai                                | Đúng là                                                      |
| ------------------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| "Array insert = O(1)"           | Insert at i requires shifting n-i elements | O(n) worst case. Only append to end = O(1) amortized         |
| "Slice is reference type in Go" | Slice header is value (ptr, len, cap)      | Passing slice copies header; append may change backing array |

🎯 **Interview Pattern:** "Use array when need random access + cache locality. Switch to hash map when need O(1) search."

🔗 **Knowledge Chain:** Array → Dynamic Array → Hash Table (array of buckets) → Matrix (2D array)

---

### Concept 2: Linked List

🪝 **Memory Hook:** Linked List = **chuỗi hạt xâu bằng dây** — thêm/bớt hạt giữa chỉ cần cắt dây + nối lại. Nhưng tìm hạt thứ 42 phải đếm từ đầu.

**Why exists / Tại sao tồn tại:**

- Level 1: O(1) insert/delete at known position — array phải shift O(n) elements
- Level 2: LRU Cache = doubly linked list + hash map → O(1) evict + O(1) lookup. Used by every caching system
- Level 3: Lock-free concurrent data structures (lock-free linked list) — CAS on node pointers

**Layer 1 — Simple Analogy / Lớp 1:**
Danh sách liên kết giống **đoàn tàu**: mỗi toa (node) chứa hàng (data) + móc nối (pointer) sang toa kế. Thêm toa giữa = unhook + rehook. Tìm toa #42 = đi từ đầu tàu đếm qua.

**Layer 2 — Mechanics / Lớp 2:**

```
Singly: [data|next] → [data|next] → [data|null]
Doubly: null ← [prev|data|next] ⇄ [prev|data|next] ⇄ [prev|data|next] → null

Operation      │ Singly  │ Doubly  │ Array
───────────────┼─────────┼─────────┼────────
Access [i]     │ O(n)    │ O(n)    │ O(1)
Insert at head │ O(1)    │ O(1)    │ O(n)
Insert at known│ O(1)    │ O(1)    │ O(n)
Delete known   │ O(n)*   │ O(1)    │ O(n)
Search         │ O(n)    │ O(n)    │ O(n)

*Singly delete = O(n) to find prev; O(1) if prev already known
```

**Layer 3 — Edge Cases / Lớp 3:**

- Cycle detection: Floyd's tortoise-and-hare O(n) time O(1) space — common interview question
- Dummy head node simplifies edge cases (empty list, insert at head)
- Memory fragmentation: each node separate allocation → poor cache locality vs array

| Sai lầm                                           | Tại sao sai                                     | Đúng là                                           |
| ------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| "Linked list always faster than array for insert" | Only at known position; finding position = O(n) | Array with binary search + shift sometimes better |
| "Singly linked list delete = O(1)"                | Need prev pointer, singly doesn't have it       | O(n) unless prev already tracked                  |

🎯 **Interview Pattern:** "Reverse linked list", "Detect cycle", "Merge two sorted lists", "LRU Cache" — top interview patterns.

🔗 **Knowledge Chain:** Linked List → LRU Cache → Stack/Queue implementation → Skip List

---

### Concept 3: Hash Table

🪝 **Memory Hook:** Hash table = **tủ có nhãn tên** — đưa tên (key) → hash function nói "ngăn #7" → mở ngăn lấy đồ O(1). Collision = 2 tên cùng ngăn → chain hoặc probe.

**Why exists / Tại sao tồn tại:**

- Level 1: O(1) average lookup/insert/delete — fastest general-purpose search
- Level 2: Two Sum = hash map. Frequency count = hash map. Dedup = hash set. 60%+ LeetCode problems dùng hash map
- Level 3: Load factor + resize strategy quyết định performance. Go map: bucket = 8 slots, load factor 6.5 → trigger growth

**Layer 1 — Simple Analogy / Lớp 1:**
Hash table giống **từ điển có index chữ cái**: muốn tìm "Algorithm" → mở tab chữ "A" → scan vài từ → found. Nếu tất cả từ bắt đầu bằng "A" (collision) → chậm như linear search.

**Layer 2 — Mechanics / Lớp 2:**

```
hash("key") = bucket_index

Bucket array: [0] → [k1:v1] → [k2:v2]    ← chaining
              [1] → [k3:v3]
              [2] → null
              [3] → [k4:v4] → [k5:v5] → [k6:v6]
              ...

Collision resolution:
├── Chaining: linked list per bucket (Go, Java 7)
├── Open addressing: probe next slot (Python dict, Robin Hood)
└── Java 8+: chain > 8 → convert to Red-Black Tree

Load factor = n/capacity → threshold triggers resize (typically 0.75)
Resize = rehash all keys into 2× capacity array → O(n) but amortized O(1)
```

**Layer 3 — Edge Cases / Lớp 3:**

- Hash collision attack: adversary crafts keys all mapping to same bucket → O(n) per lookup. Mitigation: randomized hash seed
- Go map: iteration order randomized by design — never depend on map order
- Thread safety: Go map concurrent read OK, concurrent write = panic. Use sync.Map or mutex

| Sai lầm                         | Tại sao sai                                   | Đúng là                                                                           |
| ------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| "Hash map always O(1)"          | Worst case O(n) — all collisions              | O(1) average, O(n) worst. Good hash + load factor keeps average                   |
| "Map preserves insertion order" | Most implementations don't (Go, Java HashMap) | Python 3.7+ dict preserves order. Go/Java: use LinkedHashMap or ordered structure |

🎯 **Interview Pattern:** "Two Sum" → hash map. "Group Anagrams" → hash map. "First non-repeating char" → hash map. 60% of LeetCode.

🔗 **Knowledge Chain:** Hash Table → Frequency Count → Two Sum Pattern → Caching (Redis) → Distributed Hash Table

---

### Concept 4: BST / Balanced Tree

🪝 **Memory Hook:** BST = **cây gia phả** — left child nhỏ hơn, right child lớn hơn. Balanced = cây cân đối, không bị nghiêng một bên → O(log n) guaranteed. Unbalanced = linked list O(n).

**Why exists / Tại sao tồn tại:**

- Level 1: Sorted data + O(log n) search/insert/delete — hash table can't do range queries or sorted traversal
- Level 2: Database indexes (B-Tree/B+ Tree), in-memory sorted containers (TreeMap/TreeSet)
- Level 3: Self-balancing variants: AVL (strict balance, read-heavy), Red-Black (relaxed, write-heavy, used in Linux CFS, Java TreeMap)

**Layer 1 — Simple Analogy / Lớp 1:**
BST giống **cây quyết định yes/no**: "Số này > 50?" → Yes → đi phải. "Số này > 75?" → No → đi trái. Mỗi bước loại bỏ nửa → O(log n). Nhưng nếu insert sorted data → cây thành đường thẳng = O(n).

**Layer 2 — Mechanics / Lớp 2:**

```
Balanced BST:          Degenerate BST:
       50                  10
      /  \                   \
    25    75                  20
   / \   / \                   \
  10 30 60 90                   30
                                 \
                                  40

Operation    │ Balanced │ Degenerate │ Notes
─────────────┼──────────┼────────────┼──────────────
Search       │ O(log n) │ O(n)       │ Binary search property
Insert       │ O(log n) │ O(n)       │ + rebalance for AVL/RB
Delete       │ O(log n) │ O(n)       │ Find successor/predecessor
In-order     │ O(n)     │ O(n)       │ Gives sorted output
Range query  │ O(log n+k)│ O(n)      │ k = results in range

AVL vs Red-Black:
├── AVL: height ≤ 1.44·log(n), strict → more rotations on insert
├── Red-Black: height ≤ 2·log(n), relaxed → fewer rotations
└── Practice: RB tree preferred (Java TreeMap, Linux scheduler)
```

**Layer 3 — Edge Cases / Lớp 3:**

- B-Tree for disk: high branching factor → fewer disk reads → database indexes
- Skip List: probabilistic alternative to balanced BST → Redis Sorted Set → simpler implementation
- AVL vs RB: AVL better for read-heavy (shorter height), RB better for write-heavy (fewer rotations)

| Sai lầm                         | Tại sao sai                  | Đúng là                                                          |
| ------------------------------- | ---------------------------- | ---------------------------------------------------------------- |
| "BST always O(log n)"           | Only if balanced             | Unbalanced BST = O(n). Always specify "balanced BST"             |
| "Use BST for everything sorted" | Hash map + sort often faster | BST for dynamic sorted data + range queries. Static = sort array |

🎯 **Interview Pattern:** "Validate BST", "Kth smallest in BST", "LCA of BST" — use in-order property.

🔗 **Knowledge Chain:** BST → Balanced Trees → B-Tree (DB indexes) → Skip List (Redis) → Range Queries

---

### Concept 5: Heap / Priority Queue

🪝 **Memory Hook:** Heap = **tháp VIP** — người quan trọng nhất luôn ở đỉnh (min/max). Thêm người mới = đặt cuối rồi "nổi lên" đúng vị trí. Lấy VIP = bốc đỉnh, cuối lên thay rồi "chìm xuống".

**Why exists / Tại sao tồn tại:**

- Level 1: O(1) get min/max + O(log n) insert/delete — sorted array insert = O(n), BST = overhead
- Level 2: Top-K problems (top K frequent, K closest points), merge K sorted lists, task scheduling, Dijkstra
- Level 3: Binary heap stored as array (no pointers!) → cache-friendly. Parent(i) = (i-1)/2, children = 2i+1, 2i+2

**Layer 1 — Simple Analogy / Lớp 1:**
Heap giống **hàng đợi cấp cứu bệnh viện**: bệnh nhân nặng nhất luôn được khám trước, bất kể ai đến trước. Thêm bệnh nhân = xếp vào cuối rồi "nổi lên" nếu nặng hơn.

**Layer 2 — Mechanics / Lớp 2:**

```
Min-Heap (array representation):
Index:  [0] [1] [2] [3] [4] [5]
Values: [1] [3] [2] [7] [4] [5]

Tree view:        1
                /   \
               3     2
              / \   /
             7   4 5

Parent(i) = (i-1)/2    Children(i) = 2i+1, 2i+2

Operations:
├── Peek min/max: O(1) — return root
├── Insert: O(log n) — add at end, bubble up
├── Delete min/max: O(log n) — swap root with last, sift down
├── Heapify array: O(n) — bottom-up sift down (NOT O(n log n))
└── Heap sort: O(n log n) — heapify + extract n times
```

**Layer 3 — Edge Cases / Lớp 3:**

- Heapify is O(n), NOT O(n log n) — bottom-up build. Most nodes are leaves (n/2) requiring 0 sifts
- K-way merge: min-heap of K elements → O(n log K) total — LeetCode "Merge K Sorted Lists"
- Go: `container/heap` interface — implement Len, Less, Swap, Push, Pop

| Sai lầm                           | Tại sao sai                         | Đúng là                                                                        |
| --------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| "Heap sort in-place = O(1) space" | Technically O(1) auxiliary nhưng... | Correct — heap sort IS O(1) extra space, O(n log n) time. But not stable       |
| "Build heap = O(n log n)"         | Bottom-up heapify = O(n)            | Math proof: Σ(n/2^(h+1)) × O(h) = O(n). Textbook often confuses with n inserts |

🎯 **Interview Pattern:** "Find top K" → min-heap size K. "Merge K sorted" → min-heap. "Running median" → max-heap + min-heap.

🔗 **Knowledge Chain:** Heap → Priority Queue → Dijkstra → Task Scheduling → Top-K Pattern

---

### Concept 6: Trie

🪝 **Memory Hook:** Trie = **cây từ điển** — mỗi nhánh = 1 ký tự, đi theo nhánh spell ra từ. "app" và "apple" share nhánh "a→p→p". Autocomplete = "gõ 'ap' → tìm tất cả nhánh con".

**Why exists / Tại sao tồn tại:**

- Level 1: Prefix search O(L) where L = word length — hash map can't do prefix efficiently
- Level 2: Autocomplete (Google search), spell checker, IP routing (longest prefix match), word games
- Level 3: Space optimization: compressed trie (radix tree), memory-efficient for shared prefixes

**Layer 1 — Simple Analogy / Lớp 1:**
Trie giống **menu điện thoại IVR**: "Nhấn 1 cho tiếng Việt → Nhấn 2 cho hỗ trợ → Nhấn 3 cho khiếu nại" — mỗi bước lọc xuống. Gõ "app" = 3 bước lọc → tìm tất cả từ bắt đầu "app".

**Layer 2 — Mechanics / Lớp 2:**

```
Words: ["app", "apple", "api", "bat"]

Trie structure:
         root
        /    \
       a      b
       |      |
       p      a
      / \     |
     p   i*   t*
     |
     l
     |
     e*
   (* = end of word)

Operation         │ Time   │ Notes
──────────────────┼────────┼──────────────
Insert word       │ O(L)   │ L = word length
Search word       │ O(L)   │ Exact match
Prefix search     │ O(L+K) │ K = words with prefix
Delete word       │ O(L)   │ Remove if no children
Autocomplete top-K│ O(L+K) │ DFS from prefix node
```

**Layer 3 — Edge Cases / Lớp 3:**

- Memory: naive trie with 26 children per node = wasteful for sparse data → use HashMap children
- Compressed trie (radix tree): merge single-child nodes → "apple" stored as "a→pp→le" → less memory
- Concurrency: read-heavy → immutable trie (persistent data structure) → safe for concurrent reads

| Sai lầm                          | Tại sao sai                   | Đúng là                                                       |
| -------------------------------- | ----------------------------- | ------------------------------------------------------------- |
| "Hash map can do prefix search"  | Hash map only exact key match | Trie = prefix O(L). Hash map = scan all keys O(n) for prefix  |
| "Trie always better for strings" | Memory overhead per node      | Hash map better for exact match. Trie for prefix/autocomplete |

🎯 **Interview Pattern:** "Implement Trie", "Word Search II", "Autocomplete system" — build trie + DFS.

🔗 **Knowledge Chain:** Trie → Autocomplete → IP Routing → Compressed Trie → Suffix Tree

---

### Concept 7: Graph Representations

🪝 **Memory Hook:** Graph = **bản đồ thành phố** — nodes = ngã tư, edges = đường. Adjacency list = "danh sách hàng xóm mỗi nhà". Adjacency matrix = "bảng khoảng cách mọi cặp nhà" — 1M nhà × 1M nhà = 10¹² ô → KHÔNG dùng matrix cho sparse graph.

**Why exists / Tại sao tồn tại:**

- Level 1: Model relationships: social networks, maps, dependencies, state machines
- Level 2: BFS (shortest path unweighted), DFS (cycle detection, topological sort), Dijkstra (shortest weighted)
- Level 3: Sparse vs dense determines representation: sparse (E << V²) → adjacency list O(V+E), dense → matrix O(V²)

**Layer 1 — Simple Analogy / Lớp 1:**
Graph giống **mạng lưới bạn bè Facebook**: mỗi người = node, kết bạn = edge (undirected). Twitter follow = directed edge. "Ai là bạn chung?" = graph traversal.

**Layer 2 — Mechanics / Lớp 2:**

```
Adjacency List (sparse):    Adjacency Matrix (dense):
A: [B, C]                     A  B  C
B: [C]                    A [ 0  1  1 ]
C: []                     B [ 0  0  1 ]
                          C [ 0  0  0 ]

Space:  List=O(V+E)  Matrix=O(V²)
Edge?:  List=O(deg)  Matrix=O(1)
Add edge: List=O(1)  Matrix=O(1)

Traversal algorithms:
├── BFS: O(V+E) — shortest path (unweighted), level-order
├── DFS: O(V+E) — cycle detection, topological sort, connected components
├── Dijkstra: O((V+E) log V) — shortest path (weighted, no negative)
└── Bellman-Ford: O(V×E) — shortest path (handles negative weights)
```

**Layer 3 — Edge Cases / Lớp 3:**

- Social graph: ~1B users, ~500 friends avg → sparse → adjacency list mandatory
- Complete graph (V=1000): only 10⁶ edges → matrix OK. V=10⁶ → matrix = 10¹² = impossible
- Directed vs undirected: undirected = 2 directed edges. Cycle in directed = DFS gray/black coloring

| Sai lầm                          | Tại sao sai                                          | Đúng là                                                          |
| -------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| "Always use adjacency list"      | Dense graph (complete) → matrix more cache-efficient | List for sparse (most real-world), matrix for small dense graphs |
| "BFS always finds shortest path" | Only for unweighted graphs                           | Weighted → Dijkstra. Negative weights → Bellman-Ford             |

🎯 **Interview Pattern:** "Number of islands" (BFS/DFS grid), "Course schedule" (topological sort), "Shortest path" (BFS/Dijkstra).

🔗 **Knowledge Chain:** Graph → BFS/DFS → Shortest Path → Network Flow → Social Networks → Recommendation Systems

---

## 1. Array / Mảng

### Analogy / Liên Tưởng

Think of a row of numbered lockers in a school hallway. Each locker has a number (index). To get locker #42 — you walk directly to it. No searching needed.

_Giống như dãy tủ có số thứ tự ở trường học. Muốn tủ số 42 → đi thẳng đến, không cần tìm._

### Visual / Sơ Đồ

```
Memory layout (contiguous):
Index:  [ 0 ][ 1 ][ 2 ][ 3 ][ 4 ]
Value:  [ 10][ 20][ 30][ 40][ 50]
Addr:   1000 1004 1008 1012 1016   (each int = 4 bytes)

Access arr[3] → jump to 1000 + (3 × 4) = 1012 → O(1) ✓

Insert at index 2:
Before: [10, 20, 30, 40, 50]
Shift:  [10, 20, XX, 30, 40, 50]  ← shift right = O(n)
After:  [10, 20, 99, 30, 40, 50]
```

### Complexity

| Operation               | Time           | Why                            |
| ----------------------- | -------------- | ------------------------------ |
| Access `arr[i]`         | O(1)           | Direct address calculation     |
| Search (unsorted)       | O(n)           | Must check every element       |
| Search (sorted, binary) | O(log n)       | Eliminate half each step       |
| Insert/delete at end    | Amortized O(1) | Dynamic arrays double capacity |
| Insert/delete at middle | O(n)           | Must shift elements            |
| Space                   | O(n)           | n elements stored              |

### Real Use Cases / Dùng Ở Đâu

- **React Virtual DOM diffing**: Arrays of children nodes, index-based comparison
- **Database buffer pool**: Fixed-size array of page frames
- **Sliding window problems**: LeetCode classics — Two Pointers, Subarray Sum

### Interview Tip / Tip Phỏng Vấn

> "Khi nào nên tránh Array?" — Khi cần insert/delete ở giữa nhiều lần (O(n) mỗi lần). Nếu dataset dynamic và cần thêm/xóa ở đầu → dùng Linked List hoặc Deque.

---

## 2. Linked List / Danh Sách Liên Kết

### Analogy / Liên Tưởng

Think of a treasure hunt where each clue tells you where the next clue is. You can't skip to clue #5 without following the chain from the start.

_Giống như trò tìm kho báu — mỗi mảnh giấy chỉ chỗ mảnh tiếp theo. Không thể nhảy thẳng đến mảnh số 5._

### Visual / Sơ Đồ

```
Singly Linked List:
[Head]
  ↓
[10 | next]──→[20 | next]──→[30 | next]──→[40 | null]

Doubly Linked List:
[Head]                                      [Tail]
  ↓                                           ↓
null←─[10|prev|next]⟷[20|prev|next]⟷[30|prev|next]─→null

Insert at Head (O(1)):
new_node.next = head
head = new_node

Insert at Middle after node X (O(1) if you have pointer):
new_node.next = X.next
X.next = new_node
```

### Complexity

| Operation         | Singly        | Doubly | Why                                   |
| ----------------- | ------------- | ------ | ------------------------------------- |
| Access by index   | O(n)          | O(n)   | Must traverse from head               |
| Insert at head    | O(1)          | O(1)   | Just change head pointer              |
| Insert at tail    | O(n) / O(1)\* | O(1)\* | \*if tail pointer maintained          |
| Delete known node | O(n)\*\*      | O(1)   | \*\*need predecessor; doubly has prev |
| Search            | O(n)          | O(n)   | Sequential scan                       |
| Space             | O(n)          | O(n)   | + pointer overhead vs array           |

### Real Use Cases / Dùng Ở Đâu

- **LRU Cache** (most common interview Q): Doubly linked list + HashMap for O(1) eviction
- **Browser history**: Next/back navigation (doubly linked)
- **Undo queue in editors**: LinkedList of states

### Interview Tip / Tip Phỏng Vấn

> LRU Cache là câu hỏi kinh điển kết hợp HashMap + Doubly Linked List. HashMap để O(1) lookup, LinkedList để O(1) move-to-front khi accessed.

```
LRU Cache visualization:
HashMap: {A→node_A, B→node_B, C→node_C}
List: [Head]←→[C]←→[B]←→[A]←→[Tail]
                ↑ most recent

Access B: move B to head
List: [Head]←→[B]←→[C]←→[A]←→[Tail]
```

---

## 3. Stack / Ngăn Xếp

### Analogy / Liên Tưởng

A stack of plates. You can only add/remove from the top. **LIFO** — Last In, First Out.

_Chồng đĩa. Chỉ có thể lấy hoặc để từ trên xuống. Cái nào để vào sau, lấy ra trước._

### Visual / Sơ Đồ

```
Push(1), Push(2), Push(3):
        ┌───┐
   Top→ │ 3 │  ← Push here, Pop here
        ├───┤
        │ 2 │
        ├───┤
        │ 1 │
        └───┘

Pop() → returns 3
        ┌───┐
   Top→ │ 2 │
        ├───┤
        │ 1 │
        └───┘

Call Stack Example:
main() calls foo() calls bar():
┌─────────┐
│  bar()  │  ← currently executing
├─────────┤
│  foo()  │
├─────────┤
│ main()  │
└─────────┘
bar() returns → stack pops → foo() resumes
```

### Complexity

| Operation   | Time                | Space |
| ----------- | ------------------- | ----- |
| Push        | O(1)                | O(1)  |
| Pop         | O(1)                | O(1)  |
| Peek (top)  | O(1)                | O(1)  |
| isEmpty     | O(1)                | O(1)  |
| Space total | O(n) for n elements |

### Real Use Cases / Dùng Ở Đâu

- **JavaScript Call Stack**: Every function call pushed, return pops
- **Undo/Redo** in editors: past actions on stack, redo on another stack
- **Browser back button**: Pages on a stack
- **Expression evaluation**: `(3 + 4) * 2` — operators and operands on stack
- **DFS traversal**: Explicit stack instead of recursion

### Interview Tip / Tip Phỏng Vấn

> Classic interview problems: Valid Parentheses, Min Stack, Decode String, Daily Temperatures.
> Pattern: whenever you need to "remember the previous state" → think Stack.

---

## 4. Queue / Hàng Đợi

### Analogy / Liên Tưởng

A line at a coffee shop. First person in line gets served first. **FIFO** — First In, First Out.

_Hàng chờ ở quán cà phê. Người đến trước phục vụ trước._

### Visual / Sơ Đồ

```
Enqueue(1), Enqueue(2), Enqueue(3):

Front                         Back
  ↓                             ↓
[ 1 ] → [ 2 ] → [ 3 ]  ← Enqueue here
  ↑
Dequeue here → returns 1

After Dequeue():
Front             Back
  ↓                 ↓
[ 2 ] → [ 3 ]

Circular Queue (fixed size, no wasted space):
  0   1   2   3   4
[ B ] [  ] [  ] [A] [  ]
         ↑            ↑
        rear          front
Wrap around when pointer hits end
```

### Special Queue Types

| Type           | Description                    | Use case                          |
| -------------- | ------------------------------ | --------------------------------- |
| Regular Queue  | FIFO                           | BFS, task scheduling              |
| Deque          | Insert/remove from both ends   | Sliding window max (LeetCode 239) |
| Priority Queue | Dequeue highest priority first | Dijkstra, job scheduling, Top-K   |
| Circular Queue | Fixed size, no realloc         | Ring buffer, OS kernel            |

### Real Use Cases / Dùng Ở Đâu

- **BFS** (Breadth-First Search): Queue of nodes to visit
- **Message queues** (Kafka, RabbitMQ): Producer enqueues, consumer dequeues
- **Rate limiter** (sliding window): Queue of timestamps
- **OS task scheduler**: CPU job queue

### Interview Tip / Tip Phỏng Vấn

> Priority Queue / Heap is used for: Top-K elements, Merge K sorted lists, Dijkstra's shortest path.
> In Python: `heapq` is a min-heap. To get max-heap: push negatives.

---

## 5. Hash Table / Bảng Băm

### Analogy / Liên Tưởng

A massive library where instead of searching every shelf, you get a formula: `shelf = f(book_title)`. The formula maps any title to a specific shelf number. Find any book in O(1) regardless of library size.

_Thư viện khổng lồ với công thức: `giá sách = f(tên sách)`. Tìm sách trong O(1) bất kể thư viện bao nhiêu cuốn._

### Visual / Sơ Đồ

```
Hash Table with chaining (separate chaining):

keys → hash function → index → linked list

"alice"  → hash() % 5 → 2 → [alice:90] → null
"bob"    → hash() % 5 → 4 → [bob:85] → null
"carol"  → hash() % 5 → 2 → [carol:92] → null  ← collision! same bucket as alice
"dave"   → hash() % 5 → 1 → [dave:78] → null

Bucket:  0: null
         1: [dave:78]
         2: [alice:90] → [carol:92]   ← chain
         3: null
         4: [bob:85]

Load Factor = n/m = 4/5 = 0.8
When load factor > 0.75 → rehash (double size)

Open Addressing (linear probing):
"alice" → slot 2 → empty → store here
"carol" → slot 2 → taken → try slot 3 → empty → store here
```

### Complexity

| Operation     | Average | Worst Case | Why worst                    |
| ------------- | ------- | ---------- | ---------------------------- |
| Get(key)      | O(1)    | O(n)       | All keys hash to same bucket |
| Put(key, val) | O(1)    | O(n)       | Same — hash collision        |
| Delete(key)   | O(1)    | O(n)       | Same                         |
| Space         | O(n)    | O(n)       |                              |

**Collision resolution:**

- **Separate chaining**: Each slot is a linked list — Python dict, Java HashMap
- **Open addressing**: Find next open slot — Python `set`, Go `map`

### Real Use Cases / Dùng Ở Đâu

- **Database indexes** (hash index): Exact match queries — O(1) lookup
- **Caching** (Redis, Memcached): Key → value store
- **Deduplication**: Seen set for unique visitors, unique URLs
- **Two Sum** (LeetCode): Store complement in hash map — O(n) solution

### Interview Tip / Tip Phỏng Vấn

> When you see "O(1) lookup" requirement → HashMap. Pattern: store `{value: index}` as you scan.
> Common trick: use HashMap as frequency counter: `{char: count}` for anagram problems.

---

## 6. Binary Search Tree (BST) / Cây Tìm Kiếm Nhị Phân

### Analogy / Liên Tưởng

A sorted phone book where each page tells you "if the name you want comes before mine, go left; if after, go right." Each step eliminates half the remaining search space.

_Danh bạ điện thoại được tổ chức: "tên cần tìm nhỏ hơn → rẽ trái, lớn hơn → rẽ phải." Mỗi bước loại bỏ nửa không gian tìm kiếm._

### Visual / Sơ Đồ

```
BST with values [5, 3, 7, 1, 4, 6, 8]:

           5           ← root
          / \
         3   7
        / \ / \
       1  4 6  8

BST Property: left < node < right (at every node)

Search(4):
  Start at 5 → 4 < 5, go left
  At 3 → 4 > 3, go right
  At 4 → found! O(log n) = 2 steps for 7 nodes

In-order traversal (left→root→right):
1, 3, 4, 5, 6, 7, 8  ← always sorted!

Unbalanced BST (worst case — like a linked list):
1
 \
  2
   \
    3      ← O(n) search, not O(log n)
     \
      4
```

### Complexity (Balanced BST)

| Operation          | Balanced | Unbalanced |
| ------------------ | -------- | ---------- |
| Search             | O(log n) | O(n)       |
| Insert             | O(log n) | O(n)       |
| Delete             | O(log n) | O(n)       |
| Min/Max            | O(log n) | O(n)       |
| In-order traversal | O(n)     | O(n)       |

**Self-balancing variants:** AVL Tree, Red-Black Tree (Java TreeMap), B+Tree (DB indexes)

### Real Use Cases / Dùng Ở Đâu

- **Database B+Tree index**: Range queries `WHERE age BETWEEN 20 AND 30`
- **Linux kernel**: CFS scheduler uses Red-Black Tree for process priority
- **TreeMap/TreeSet** in Java: Sorted map with O(log n) operations

### Interview Tip / Tip Phỏng Vấn

> BST interview patterns:
>
> - Validate BST: In-order traversal should be sorted
> - LCA (Lowest Common Ancestor): Compare values to find split point
> - Kth smallest: In-order traversal with counter

---

## 7. Heap / Đống (Priority Queue)

### Analogy / Liên Tưởng

A hospital emergency room. Patients are prioritized by severity — most critical always seen first, regardless of when they arrived.

_Phòng cấp cứu: bệnh nhân nặng nhất luôn được gặp bác sĩ trước, không kể ai đến trước._

### Visual / Sơ Đồ

```
Max-Heap (parent ≥ children):

Tree view:          Array view:
      90               [90, 80, 70, 40, 30, 60, 50]
     /  \               0   1   2   3   4   5   6
    80   70
   / \ / \
  40 30 60 50

Heap Property: parent ≥ both children (max-heap)
              parent ≤ both children (min-heap)

Index relationships:
  Parent of i:       (i-1) / 2
  Left child of i:    2*i + 1
  Right child of i:   2*i + 2

Extract Max (O(log n)):
1. Swap root (90) with last element (50)
2. Remove last (90 is extracted)
3. Sift down 50:
      50              80
     /  \            /  \
    80   70  →      50   70   → valid heap
   / \ / \         / \ / \
  40 30 60        40 30 60

Insert 85 (O(log n)):
1. Add to end: [..., 85]
2. Sift up: 85 > 70 → swap, 85 > 90? No → stop
```

### Complexity

| Operation       | Time       | Why                            |
| --------------- | ---------- | ------------------------------ |
| Insert          | O(log n)   | Sift up — at most height steps |
| Extract min/max | O(log n)   | Sift down after removing root  |
| Peek min/max    | O(1)       | Root is always min/max         |
| Build heap      | O(n)       | Heapify — not O(n log n)!      |
| Heap sort       | O(n log n) | Build + n extractions          |

### Real Use Cases / Dùng Ở Đâu

- **Dijkstra's shortest path**: Min-heap of (distance, node)
- **Top-K elements**: Max-heap of size K (LeetCode 215, 347)
- **Merge K sorted lists**: Min-heap with one element from each list
- **Task scheduler** (OS): Priority queue of processes
- **Median of data stream**: Two heaps (max-heap for lower half, min-heap for upper)

### Interview Tip / Tip Phỏng Vấn

> "Top K" → Heap of size K.
> "K closest points" (LeetCode 973) → max-heap of size K, keep K smallest.
> "Median stream" (LeetCode 295) → two heaps trick.

---

## 8. Graph / Đồ Thị

### Analogy / Liên Tưởng

A city map. Nodes = intersections, edges = roads. Directed graph = one-way streets. Weighted graph = roads with distances.

_Bản đồ thành phố. Node = giao lộ, edge = con đường. Đồ thị có hướng = đường một chiều._

### Visual / Sơ Đồ

```
Types of Graphs:

Undirected:     Directed:       Weighted:
A - B           A → B           A --5-- B
|   |           ↑   ↓           |       |
C - D           C ← D           3       2
                                 \     /
                                  C--1--D

Representation options:

1. Adjacency List (space efficient for sparse graphs):
A: [B, C]
B: [A, D]
C: [A, D]
D: [B, C]
Space: O(V + E)

2. Adjacency Matrix (fast edge lookup):
   A  B  C  D
A [0, 1, 1, 0]
B [1, 0, 0, 1]
C [1, 0, 0, 1]
D [0, 1, 1, 0]
Space: O(V²) — bad for sparse graphs!

Graph traversal:
BFS (level by level):          DFS (go deep first):
     1                              1
   ↙   ↘                          ↙ ↘
  2     3       BFS: 1,2,3,4,5   2   3
 ↙ ↘                             ↙ ↘   ↘
4   5           DFS: 1,2,4,5,3  4   5
```

### Algorithms & Complexity

| Algorithm        | Time           | Use case                                              |
| ---------------- | -------------- | ----------------------------------------------------- |
| BFS              | O(V+E)         | Shortest path (unweighted), level traversal           |
| DFS              | O(V+E)         | Detect cycles, topological sort, connected components |
| Dijkstra         | O((V+E) log V) | Shortest path (non-negative weights)                  |
| Bellman-Ford     | O(VE)          | Shortest path with negative weights                   |
| Topological Sort | O(V+E)         | Dependency ordering (build systems, courses)          |
| Union-Find       | O(α(n)) ≈ O(1) | Connected components, cycle detection                 |

### Real Use Cases / Dùng Ở Đâu

- **Google Maps / Waze**: Dijkstra/A\* for routing
- **Social networks**: BFS for friend-of-friend (LinkedIn "2nd connections")
- **Build systems** (npm, gradle): Topological sort for dependency order
- **Fraud detection**: Graph clustering to find suspicious patterns

### Interview Tip / Tip Phỏng Vấn

> Graph problem signals: "network", "dependencies", "connections", "path between"
> Default to adjacency list. Use BFS for shortest path (unweighted), Dijkstra for weighted.
> Union-Find for "number of connected components" problems.

---

## 9. Trie / Cây Tiền Tố

### Analogy / Liên Tưởng

An autocomplete system. Type "ca" → shows "cat", "car", "card", "catalog". All words sharing a prefix share a path in the trie.

_Hệ thống autocomplete. Gõ "ca" → hiện "cat", "car", "card". Các từ cùng prefix dùng chung đường đi._

### Visual / Sơ Đồ

```
Trie storing: ["cat", "car", "card", "care", "bat"]

         root
        /    \
       c      b
       |      |
       a      a
      / \     |
     t   r    t*
    (*) (*) \
           d*  e*

* = end of word marker

Search "car": root→c→a→r → found (marked) ✓
Search "ca":  root→c→a → exists but NOT end-of-word → not a word
Search "cab": root→c→a→b? → no b child → not found

Prefix search "car": root→c→a→r → all words below:
- "car" (marked)
- "card" (r→d→*)
- "care" (r→e→*)
```

### Complexity

| Operation          | Time                | Space |
| ------------------ | ------------------- | ----- | --------------- |
| Insert word        | O(m)                | O(m)  | m = word length |
| Search word        | O(m)                | O(1)  |
| Starts with prefix | O(m)                | O(1)  |
| Space total        | O(ALPHABET × n × m) | —     |

### Real Use Cases / Dùng Ở Đâu

- **Search autocomplete** (Google Search suggestions)
- **Spell checker**: Check if word exists + suggest corrections
- **IP routing tables**: Longest prefix match
- **Word games**: Valid word check in Boggle, Scrabble

### Interview Tip / Tip Phỏng Vấn

> Trie problems: Word Search II (LeetCode 212), Design Search Autocomplete, Add and Search Words.
> Trie node in code: `{children: Map<char, TrieNode>, isEnd: boolean}`

---

## 10. Quick Reference: Choosing the Right Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA STRUCTURE DECISION TREE                  │
│                                                                   │
│  Need O(1) access by index?        YES → Array                   │
│                 ↓ NO                                             │
│  Need O(1) insert at head/tail?    YES → Linked List / Deque     │
│                 ↓ NO                                             │
│  Need O(1) lookup by key?          YES → Hash Table              │
│                 ↓ NO                                             │
│  Need sorted order + range query?  YES → BST / B+Tree            │
│                 ↓ NO                                             │
│  Need min/max quickly?             YES → Heap                    │
│                 ↓ NO                                             │
│  Need LIFO (undo, parsing)?        YES → Stack                   │
│                 ↓ NO                                             │
│  Need FIFO (BFS, tasks)?           YES → Queue                   │
│                 ↓ NO                                             │
│  Need prefix matching?             YES → Trie                    │
│                 ↓ NO                                             │
│  Need connection/path queries?     YES → Graph                   │
└─────────────────────────────────────────────────────────────────┘
```

### Complexity Cheatsheet / Bảng Tổng Kết

| Structure      | Access   | Search   | Insert   | Delete   | Space  |
| -------------- | -------- | -------- | -------- | -------- | ------ |
| Array          | O(1)     | O(n)     | O(n)     | O(n)     | O(n)   |
| Linked List    | O(n)     | O(n)     | O(1)\*   | O(1)\*   | O(n)   |
| Stack          | O(n)     | O(n)     | O(1)     | O(1)     | O(n)   |
| Queue          | O(n)     | O(n)     | O(1)     | O(1)     | O(n)   |
| Hash Table     | O(1)     | O(1)     | O(1)     | O(1)     | O(n)   |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n)   |
| Heap           | O(1) top | O(n)     | O(log n) | O(log n) | O(n)   |
| Trie           | O(m)     | O(m)     | O(m)     | O(m)     | O(n×m) |

\*with pointer to node

---

**See also**: [Algorithms Theory](./algorithms-theory.md) | [Complexity Analysis](./complexity-analysis.md) | [LeetCode by Category](../../leetcode/)

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: When should you use an array vs a linked list? / Khi nào dùng array vs linked list? 🟢 Junior

**A:** Use an **array** when you need O(1) random access by index, cache-friendly iteration, or fixed-size data. Use a **linked list** when you need frequent O(1) insertions/deletions at known positions without shifting elements.

```
Array: [0][1][2][3][4]  ← contiguous memory, cache-friendly
        ↑ O(1) access anywhere, O(n) insert middle (shift)

Linked List: [A]→[B]→[C]→[D]  ← scattered in memory
              ↑ O(n) to reach node, O(1) insert at known node
```

Vietnamese explanation: Arrays chiếm vùng nhớ liên tục → cache locality tốt → iteration nhanh hơn linked list trong thực tế dù cùng O(n). Linked list thường được overhyped — thực tế production ít dùng vì pointer chasing gây cache miss. Go `slice` = dynamic array (append amortized O(1)). Khi nào linked list thực sự useful: LRU cache (doubly linked list + hash map), queue với O(1) enqueue/dequeue.

---

### Q: How does a hash table achieve O(1) lookup? What are the failure modes? / Hash table đạt O(1) như thế nào? Khi nào fail? 🟡 Mid

**A:** Hash function maps key → bucket index in an array. Average O(1) insert/search/delete. Failure modes: (1) **Collision** — two keys hash to same bucket, resolved by chaining or open addressing; (2) **High load factor** — too many entries per bucket degrades to O(n); (3) **Poor hash function** — clusters entries.

```
key "alice" → hash() → 42 % N → bucket[42]
key "bob"   → hash() → 42 % N → bucket[42]  ← collision!

Chaining: bucket[42] → [alice:1] → [bob:2] → nil

Load factor = entries / buckets
Java HashMap: rehash when > 0.75
Go map: rehash when ~6.5 entries/bucket
```

Vietnamese explanation: Worst case O(n) khi tất cả keys hash vào cùng bucket (hash DoS attack). Python/Java/Go đều hash randomization (seed per-process) để chống. Concurrent access: Go `sync.Map` cho concurrent reads + occasional writes; `map` + `sync.RWMutex` cho balanced read/write. Java HashMap Java 7: concurrent resize gây infinite loop — dùng `ConcurrentHashMap`.

---

### Q: What is a heap and when should you use it? / Heap là gì và khi nào dùng? 🟡 Mid

**A:** A heap is a complete binary tree with the heap property: min-heap (parent ≤ children), max-heap (parent ≥ children). Operations: O(log n) insert/extract, O(1) peek-min/max. Best for: priority queues, top-K elements, scheduling.

```
Min-Heap:
         1          ← root = minimum (O(1) peek)
       /   \
      3     2
     / \   / \
    7   5  4   6

Array: [1, 3, 2, 7, 5, 4, 6]
Parent(i) = (i-1)/2,  Left(i) = 2i+1,  Right(i) = 2i+2
```

Vietnamese explanation: Heap ≠ balanced BST. BST: O(log n) search any element; Heap: O(1) only for min/max. Interview pattern: "K largest elements" → min-heap of size K. "Running median" → two heaps (max-heap left half + min-heap right half). "Merge K sorted lists" → min-heap of K pointers. Go: `container/heap` interface requires `Len, Less, Swap, Push, Pop`.

---

### Q: Why does a BST need to be balanced? Compare AVL vs Red-Black tree. / Tại sao BST cần balanced? So sánh AVL vs Red-Black? 🟡 Mid

**A:** A plain BST degenerates to O(n) linked list if inserting sorted data. Balanced BSTs maintain height O(log n) via rotations. **AVL**: strictly balanced (height diff ≤ 1), faster lookup, more rotations on insert. **Red-Black**: looser balance, fewer rotations, preferred in practice (std::map C++, TreeMap Java).

```
BST worst case (inserting 1,2,3,4,5):
1
 \
  2
   \
    3      ← O(n) search!
     \
      4

Red-Black Tree (same data):
    2
   / \
  1   4      ← O(log n) guaranteed
     / \
    3   5
```

Vietnamese explanation: Database B+ Tree (multi-way, disk-optimized): node giữ nhiều keys (fill 4KB disk block), tất cả data ở leaf nodes (efficient range scan). PostgreSQL default index: B-tree. Redis sorted set: skip list (probabilistic, easier to implement than RB tree). Interview: "PostgreSQL index dùng gì?" → B-tree. "Redis sorted set?" → skip list.

---

### Q: What is the difference between adjacency matrix and adjacency list? / Ma trận kề vs danh sách kề khác nhau thế nào? 🟡 Mid

**A:** Two graph representations with different trade-offs:

- **Adjacency matrix**: V×V grid. O(1) edge existence check. O(V²) space — good for dense graphs.
- **Adjacency list**: list of neighbors per vertex. O(V+E) space — good for sparse graphs. Most real-world graphs are sparse.

```
Graph: A→B, A→C, B→C

Matrix (O(V²)):      List (O(V+E)):
   A  B  C           A: [B, C]
A [0, 1, 1]          B: [C]
B [0, 0, 1]          C: []
C [0, 0, 0]
```

Vietnamese explanation: Social network (1B users, ~500 friends each) → sparse → adjacency list. Dense graph (complete graph, small V) → matrix. BFS/DFS dùng adjacency list + visited set. "Detect cycle in directed graph" → DFS với white/gray/black coloring. Topological sort → DFS (reverse post-order) hoặc Kahn's algorithm (BFS + in-degree).

---

### Q: What is the difference between a stack and a queue? Give real-world uses. / Stack vs queue — ứng dụng thực tế? 🟢 Junior

**A:** **Stack** (LIFO): push/pop from top. **Queue** (FIFO): enqueue at rear, dequeue from front. Both O(1) operations.

```
Stack (LIFO):              Queue (FIFO):
push →  [5]                enqueue → [1][2][3][4] → dequeue
        [3]
        [1]
 pop ↑

Real uses:
Stack: function call stack, undo/redo, bracket matching, browser back button
Queue: BFS traversal, task scheduler, print spooler, network packet buffer
```

Vietnamese explanation: Call stack: mỗi function call push frame (local vars + return address), return = pop. Stack overflow = infinite recursion exceeds stack limit. Deque (double-ended): sliding window problems. Go channel = concurrent queue (buffered = fixed capacity). `container/ring` = circular buffer. Priority queue (heap-based) = queue where highest priority dequeued first.

---

## Interview Q&A Summary / Tổng Hợp Q&A Phỏng Vấn

| #   | Question                                 | Difficulty | Core Concept       | Key Signal                                                                |
| --- | ---------------------------------------- | ---------- | ------------------ | ------------------------------------------------------------------------- |
| 1   | Array vs linked list — when to use?      | 🟢 Junior  | Array, Linked List | Cache locality vs O(1) insert. Mention amortized append                   |
| 2   | Hash table O(1) — how and failure modes? | 🟡 Mid     | Hash Table         | Hash→bucket, collision chains, load factor, resize. Hash collision attack |
| 3   | Heap — what and when?                    | 🟡 Mid     | Heap               | Complete binary tree in array. Top-K, scheduling, merge K. Heapify = O(n) |
| 4   | BST balance — AVL vs Red-Black?          | 🟡 Mid     | BST                | Degenerate = O(n). AVL stricter (read), RB relaxed (write). Practice = RB |
| 5   | Adjacency matrix vs adjacency list?      | 🟡 Mid     | Graph              | Dense→matrix, sparse→list. Real graphs sparse. BFS/DFS = O(V+E)           |
| 6   | Stack vs queue — uses?                   | 🟢 Junior  | Linked List        | Stack=LIFO (call stack, undo). Queue=FIFO (BFS, tasks). Both O(1) ops     |

**Distribution:** 🟢 2 | 🟡 4

---

## Cold Call Simulation / Mô Phỏng Cold Call

> **⚡ "Design a leaderboard for 1M players — chọn data structure nào và tại sao?"**

**30-second answer:**
"I'd use a balanced BST or skip list — specifically Redis Sorted Set which uses a skip list internally. It gives O(log n) for score updates and O(log n + k) for range queries like 'top 100 players'. A hash map gives O(1) lookup but can't do sorted range queries. An array would need O(n) for insert/update to maintain order."

**Follow-up: "Nếu cần top-K real-time với 1M concurrent updates thì sao?"**
"A min-heap of size K handles streaming top-K in O(log K) per update. For distributed systems, each shard maintains local top-K, then merge at query time — similar to merge K sorted lists pattern using a min-heap."

---

## Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại và trả lời 5 câu sau:

| #   | Type           | Question                                                                                                                                          |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔄 Retrieval   | Liệt kê time complexity cho: array access, linked list insert at head, hash map lookup (avg/worst), heap insert, BST search (balanced/degenerate) |
| 2   | 🎨 Visual      | Vẽ internal structure của hash table với 3 buckets, 2 collisions ở bucket #1 (chaining)                                                           |
| 3   | 🛠️ Application | LRU Cache cần O(1) get + O(1) put — cần combine data structures nào? Tại sao?                                                                     |
| 4   | 🐛 Debug       | Code dùng Go map trong 2 goroutines không có mutex — lỗi gì xảy ra?                                                                               |
| 5   | 🎓 Teach       | Giải thích cho junior tại sao "build heap = O(n)" chứ không phải O(n log n)                                                                       |

| #   | Key Points                                                                                          |
| --- | --------------------------------------------------------------------------------------------------- |
| 1   | Array O(1), LL O(1), Hash avg O(1)/worst O(n), Heap O(log n), BST balanced O(log n)/degenerate O(n) |
| 2   | Array of buckets, bucket #1 → node(k1:v1) → node(k2:v2) chain                                       |
| 3   | Doubly linked list (O(1) move-to-front + remove) + HashMap (O(1) key→node lookup)                   |
| 4   | fatal: concurrent map writes — Go panics. Use sync.RWMutex or sync.Map                              |
| 5   | Bottom-up: n/2 leaves do 0 work, n/4 nodes do 1 swap, ... → geometric series = O(n)                 |

💬 **Feynman Prompt:** Giải thích tại sao Redis Sorted Set (skip list) được chọn cho leaderboard thay vì B-Tree — trade-off cụ thể là gì?

📅 **Spaced Repetition / Lịch Ôn Tập:**

- Day 1: Đọc toàn bộ, làm Self-Check
- Day 3: Cold Call + Interview Q&A Summary (che answer)
- Day 7: Core Concepts Memory Hooks + Common Mistakes tables
- Day 14: Full Self-Check + giải thích Feynman cho bạn
- Day 30: Mock interview — implement LRU Cache + analyze complexity

---

## Practice Problems / Bài Tập Thực Hành

| Data Structure | Problem | Difficulty | Key Technique |
|---------------|---------|-----------|---------------|
| Array | [Two Sum](../../leetcode/array/problems/04-two-sum.md) | 🟢 Easy | Hash Map lookup |
| Array | [Contains Duplicate](../../leetcode/array/problems/05-contains-duplicate.md) | 🟢 Easy | Set / Hash Map |
| Array | [Rotate Array](../../leetcode/array/problems/03-rotate-array.md) | 🟡 Medium | Reverse trick |
| Linked List | [Reverse Linked List](../../leetcode/linked-list/problems/01-reverse-linked-list.md) | 🟢 Easy | Pointer manipulation |
| Linked List | [Merge Two Sorted Lists](../../leetcode/linked-list/problems/02-merge-two-sorted-lists.md) | 🟢 Easy | Merge pattern |
| Linked List | [Remove Nth Node From End](../../leetcode/linked-list/problems/04-remove-nth-node-from-end-of-list.md) | 🟡 Medium | Two pointers |
| Stack | [Min Stack](../../leetcode/design/problems/01-min-stack.md) | 🟡 Medium | Auxiliary stack |
| Stack | [Valid Parentheses](../../leetcode/string/problems/06-valid-parentheses.md) | 🟢 Easy | Stack matching |
| Hash Map | [First Unique Character](../../leetcode/string/problems/03-first-unique-character-in-a-string.md) | 🟢 Easy | Frequency count |
| Hash Map | [Valid Anagram](../../leetcode/string/problems/04-valid-anagram.md) | 🟢 Easy | Char frequency |
| Tree (BST) | [Validate BST](../../leetcode/tree-graph/problems/02-validate-binary-search-tree.md) | 🟡 Medium | Inorder traversal |
| Tree | [Symmetric Tree](../../leetcode/tree-graph/problems/04-symmetric-tree.md) | 🟢 Easy | Mirror recursion |
| Tree → Array | [Sorted Array to BST](../../leetcode/tree-graph/problems/05-convert-sorted-array-to-binary-search-tree.md) | 🟢 Easy | Binary split |
| Heap | [Find K Largest Elements](../../leetcode/sorting-searching/problems/02-find-k-largest-elements.md) | 🟡 Medium | Min-heap of size K |
| Design (combo) | [Serialize/Deserialize Tree](../../leetcode/design/problems/04-serialize-and-deserialize-binary-tree.md) | 🔴 Hard | BFS/DFS + encoding |

🔗 **Full pattern index**: [LeetCode Patterns Index](../../leetcode/00-patterns-index.md)

---

## Connections / Liên Kết

**Same track:**

- ➡️ [Algorithms Theory](./algorithms-theory.md) — algorithms cần DS phù hợp
- ➡️ [Complexity Analysis](./complexity-analysis.md) — Big O so sánh DS operations
- 🔗 [Concurrency](./07-concurrency-and-parallelism.md) — concurrent data structures (lock-free list, concurrent map)
- 🔗 [OS Theory](./os-theory.md) — memory layout, cache hierarchy ảnh hưởng DS choice
- 🔗 [Information Theory](./information-theory.md) — entropy bounds on search/sort

**Cross track:**

- 🔗 [Go Data Structures](../../be-track/01-golang/06-data-structures-go.md) — Go-specific implementations (slice, map, container/)
- 🔗 [SQL Indexing](../../be-track/03-database-advanced/02-indexing-optimization.md) — B+ Tree index = balanced tree for DB
- 🔗 [Caching Patterns](../../be-track/03-database-advanced/04-caching-patterns.md) — LRU/LFU cache implementations
