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

## 1. Array / Mảng

### Analogy / Liên Tưởng
Think of a row of numbered lockers in a school hallway. Each locker has a number (index). To get locker #42 — you walk directly to it. No searching needed.

*Giống như dãy tủ có số thứ tự ở trường học. Muốn tủ số 42 → đi thẳng đến, không cần tìm.*

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

| Operation | Time | Why |
|-----------|------|-----|
| Access `arr[i]` | O(1) | Direct address calculation |
| Search (unsorted) | O(n) | Must check every element |
| Search (sorted, binary) | O(log n) | Eliminate half each step |
| Insert/delete at end | Amortized O(1) | Dynamic arrays double capacity |
| Insert/delete at middle | O(n) | Must shift elements |
| Space | O(n) | n elements stored |

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

*Giống như trò tìm kho báu — mỗi mảnh giấy chỉ chỗ mảnh tiếp theo. Không thể nhảy thẳng đến mảnh số 5.*

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

| Operation | Singly | Doubly | Why |
|-----------|--------|--------|-----|
| Access by index | O(n) | O(n) | Must traverse from head |
| Insert at head | O(1) | O(1) | Just change head pointer |
| Insert at tail | O(n) / O(1)* | O(1)* | *if tail pointer maintained |
| Delete known node | O(n)** | O(1) | **need predecessor; doubly has prev |
| Search | O(n) | O(n) | Sequential scan |
| Space | O(n) | O(n) | + pointer overhead vs array |

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

*Chồng đĩa. Chỉ có thể lấy hoặc để từ trên xuống. Cái nào để vào sau, lấy ra trước.*

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

| Operation | Time | Space |
|-----------|------|-------|
| Push | O(1) | O(1) |
| Pop | O(1) | O(1) |
| Peek (top) | O(1) | O(1) |
| isEmpty | O(1) | O(1) |
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

*Hàng chờ ở quán cà phê. Người đến trước phục vụ trước.*

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

| Type | Description | Use case |
|------|-------------|----------|
| Regular Queue | FIFO | BFS, task scheduling |
| Deque | Insert/remove from both ends | Sliding window max (LeetCode 239) |
| Priority Queue | Dequeue highest priority first | Dijkstra, job scheduling, Top-K |
| Circular Queue | Fixed size, no realloc | Ring buffer, OS kernel |

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

*Thư viện khổng lồ với công thức: `giá sách = f(tên sách)`. Tìm sách trong O(1) bất kể thư viện bao nhiêu cuốn.*

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

| Operation | Average | Worst Case | Why worst |
|-----------|---------|------------|-----------|
| Get(key) | O(1) | O(n) | All keys hash to same bucket |
| Put(key, val) | O(1) | O(n) | Same — hash collision |
| Delete(key) | O(1) | O(n) | Same |
| Space | O(n) | O(n) | |

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

*Danh bạ điện thoại được tổ chức: "tên cần tìm nhỏ hơn → rẽ trái, lớn hơn → rẽ phải." Mỗi bước loại bỏ nửa không gian tìm kiếm.*

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

| Operation | Balanced | Unbalanced |
|-----------|----------|------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Min/Max | O(log n) | O(n) |
| In-order traversal | O(n) | O(n) |

**Self-balancing variants:** AVL Tree, Red-Black Tree (Java TreeMap), B+Tree (DB indexes)

### Real Use Cases / Dùng Ở Đâu
- **Database B+Tree index**: Range queries `WHERE age BETWEEN 20 AND 30`
- **Linux kernel**: CFS scheduler uses Red-Black Tree for process priority
- **TreeMap/TreeSet** in Java: Sorted map with O(log n) operations

### Interview Tip / Tip Phỏng Vấn
> BST interview patterns:
> - Validate BST: In-order traversal should be sorted
> - LCA (Lowest Common Ancestor): Compare values to find split point
> - Kth smallest: In-order traversal with counter

---

## 7. Heap / Đống (Priority Queue)

### Analogy / Liên Tưởng
A hospital emergency room. Patients are prioritized by severity — most critical always seen first, regardless of when they arrived.

*Phòng cấp cứu: bệnh nhân nặng nhất luôn được gặp bác sĩ trước, không kể ai đến trước.*

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

| Operation | Time | Why |
|-----------|------|-----|
| Insert | O(log n) | Sift up — at most height steps |
| Extract min/max | O(log n) | Sift down after removing root |
| Peek min/max | O(1) | Root is always min/max |
| Build heap | O(n) | Heapify — not O(n log n)! |
| Heap sort | O(n log n) | Build + n extractions |

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

*Bản đồ thành phố. Node = giao lộ, edge = con đường. Đồ thị có hướng = đường một chiều.*

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

| Algorithm | Time | Use case |
|-----------|------|----------|
| BFS | O(V+E) | Shortest path (unweighted), level traversal |
| DFS | O(V+E) | Detect cycles, topological sort, connected components |
| Dijkstra | O((V+E) log V) | Shortest path (non-negative weights) |
| Bellman-Ford | O(VE) | Shortest path with negative weights |
| Topological Sort | O(V+E) | Dependency ordering (build systems, courses) |
| Union-Find | O(α(n)) ≈ O(1) | Connected components, cycle detection |

### Real Use Cases / Dùng Ở Đâu
- **Google Maps / Waze**: Dijkstra/A* for routing
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

*Hệ thống autocomplete. Gõ "ca" → hiện "cat", "car", "card". Các từ cùng prefix dùng chung đường đi.*

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

| Operation | Time | Space |
|-----------|------|-------|
| Insert word | O(m) | O(m) | m = word length |
| Search word | O(m) | O(1) |
| Starts with prefix | O(m) | O(1) |
| Space total | O(ALPHABET × n × m) | — |

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

| Structure | Access | Search | Insert | Delete | Space |
|-----------|--------|--------|--------|--------|-------|
| Array | O(1) | O(n) | O(n) | O(n) | O(n) |
| Linked List | O(n) | O(n) | O(1)* | O(1)* | O(n) |
| Stack | O(n) | O(n) | O(1) | O(1) | O(n) |
| Queue | O(n) | O(n) | O(1) | O(1) | O(n) |
| Hash Table | O(1) | O(1) | O(1) | O(1) | O(n) |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Heap | O(1) top | O(n) | O(log n) | O(log n) | O(n) |
| Trie | O(m) | O(m) | O(m) | O(m) | O(n×m) |

*with pointer to node

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

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Point |
|----------|-------|-----------|
| Array vs linked list | 🟢 | Array=cache-friendly O(1) access; linked list=O(1) insert at known node |
| Hash table O(1) & failure modes | 🟡 | Hash→bucket; collision+load factor degrade performance |
| Heap usage | 🟡 | Complete binary tree; O(1) min/max peek; top-K, priority queue patterns |
| BST balance: AVL vs Red-Black | 🟡 | Plain BST degenerates; RB tree fewer rotations preferred in practice |
| Graph: matrix vs adjacency list | 🟡 | Dense→matrix O(V²); sparse→list O(V+E); real graphs = sparse |
| Stack vs queue | 🟢 | Stack=LIFO (call stack); Queue=FIFO (BFS, tasks) |

---

## Self-Check / Tự Kiểm Tra

- [ ] Can I give the time complexity for all major operations of: array, linked list, hash table, heap, and BST?
- [ ] Can I explain when a hash collision degrades O(1) to O(n) and how to prevent it?
- [ ] Can I name 3 real production use cases where a heap is the right data structure?
- [ ] Can I draw the internal structure of a hash table (buckets + chaining)?
- 💬 **Feynman Prompt:** Giải thích tại sao Redis Sorted Set (backed by skip list) được chọn cho leaderboard thay vì B-Tree — trade-off cụ thể là gì?

## Connections / Liên Kết

- ➡️ **Applied in**: [Algorithms Theory](./algorithms-theory.md) — algorithms need the right data structure
- ➡️ **Applied in**: [Data Structures Go](../../be-track/01-golang/06-data-structures-go.md) — Go implementation of these structures
- 🔗 **Practice**: [LeetCode](../../leetcode/) — interview problems test data structure selection
- 🔗 **Related**: [Complexity Analysis](./complexity-analysis.md) — Big-O is how we compare data structures
