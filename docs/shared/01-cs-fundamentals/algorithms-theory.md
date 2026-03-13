# Algorithms Theory / Lý Thuyết Thuật Toán

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Data Structures](./data-structures-theory.md) | [Complexity Analysis](./complexity-analysis.md) | [LeetCode Practice](../../leetcode/)

---

## Algorithm Patterns Map / Bản Đồ Các Pattern

```
PROBLEM TYPE               →  ALGORITHM PATTERN
─────────────────────────────────────────────────────
"Find max/min subarray"    →  Sliding Window
"Find pair with sum X"     →  Two Pointers
"Binary search on answer"  →  Binary Search (modified)
"Shortest path"            →  BFS (unweighted) / Dijkstra (weighted)
"All combinations"         →  Backtracking
"Optimal subproblem"       →  Dynamic Programming
"Repeated subproblems"     →  Memoization / DP
"Connectivity"             →  Union-Find / DFS
"Top K elements"           →  Heap
"Sorted merge"             →  Merge Sort
```

---

## Part 1: Sorting / Sắp Xếp

### Visual: Sorting Comparison

```
Array: [5, 3, 8, 1, 9, 2]

BUBBLE SORT (swap adjacent if out of order):
Pass 1: [3,5,1,8,2,9]  ← 9 bubbles to end
Pass 2: [3,1,5,2,8,9]  ← 8 bubbles to position
Pass n: O(n²) comparisons

SELECTION SORT (find min, place at front):
Step 1: min=1  [1, 3,8,5,9,2]
Step 2: min=2  [1,2, 8,5,9,3]
Step 3: min=3  [1,2,3, 5,9,8]
          O(n²) regardless of input

INSERTION SORT (like sorting playing cards):
Hand: [5]
Add 3: [3,5]         ← insert 3 before 5
Add 8: [3,5,8]       ← 8 fits at end
Add 1: [1,3,5,8]     ← slide 1 to front
Add 9: [1,3,5,8,9]   ← 9 fits at end
O(n) for nearly-sorted, O(n²) worst case

MERGE SORT (divide → sort halves → merge):
[5,3,8,1,9,2]
    /       \
[5,3,8]   [1,9,2]
  / \       / \
[5,3] [8] [1,9] [2]
 / \        / \
[5] [3]   [1] [9]

Merge [3,5] + [8] = [3,5,8]
Merge [1,9] + [2] = [1,2,9]
Merge [3,5,8] + [1,2,9] = [1,2,3,5,8,9] ✓

QUICK SORT (pivot partition):
[5, 3, 8, 1, 9, 2]  pivot=5
[3,1,2] 5 [8,9]     ← elements < 5 | pivot | elements > 5
Recurse on both sides
```

### Sorting Algorithm Summary

| Algorithm | Best | Average | Worst | Space | Stable? | When to use |
|-----------|------|---------|-------|-------|---------|-------------|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | Yes | Never in production |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | No | Never |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes | Nearly sorted / small n |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | Need stable sort, linked lists |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | No | Default choice (fast in practice) |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | No | Sort in-place, memory-constrained |
| Counting | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes | Small integer range |
| Radix | O(nk) | O(nk) | O(nk) | O(n+k) | Yes | Large integers, fixed length strings |

**Stable sort** = equal elements maintain their original relative order.

**Interview tip**: "Which sort would you use?" → Quick sort for general purpose. Merge sort if stability required or sorting linked lists. Counting/Radix for integer sorting with known range.

---

## Part 2: Searching / Tìm Kiếm

### Binary Search / Tìm Kiếm Nhị Phân

```
Array (MUST be sorted): [1, 3, 5, 7, 9, 11, 13]
Search for: 7

Step 1: lo=0, hi=6, mid=3 → arr[3]=7 → FOUND ✓

Search for: 5:
Step 1: lo=0, hi=6, mid=3 → arr[3]=7 > 5 → search left
Step 2: lo=0, hi=2, mid=1 → arr[1]=3 < 5 → search right
Step 3: lo=2, hi=2, mid=2 → arr[2]=5 → FOUND ✓

Each step eliminates HALF the remaining elements → O(log n)
```

```python
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2  # avoid integer overflow
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1  # not found

# Template for "find first position where condition is true":
def binary_search_boundary(arr, condition):
    lo, hi = 0, len(arr) - 1
    result = -1
    while lo <= hi:
        mid = (lo + hi) // 2
        if condition(arr[mid]):
            result = mid
            hi = mid - 1  # search left for first occurrence
        else:
            lo = mid + 1
    return result
```

**Binary search variants** (all O(log n)):
- Find exact value
- Find first occurrence (leftmost)
- Find last occurrence (rightmost)
- Find first position where `arr[i] >= target` (lower_bound)
- **Binary search on answer**: "Minimum max" problems — binary search on the answer space, not the array

```
"Binary search on answer" example:
  Problem: "Minimum days to eat N oranges" (LeetCode 1553)
  Instead of searching array, binary search on answer:
  lo = 1, hi = N
  "Can we do it in `mid` days?" → yes/no
  Find minimum `mid` where answer is yes
```

---

## Part 3: Graph Algorithms / Thuật Toán Đồ Thị

### BFS vs DFS Visualization

```
Graph:
    1
   / \
  2   3
 / \   \
4   5   6

BFS (Queue — Level by Level):
Queue: [1]
Visit 1 → Queue: [2, 3]
Visit 2 → Queue: [3, 4, 5]
Visit 3 → Queue: [4, 5, 6]
Visit 4 → Queue: [5, 6]
Visit 5 → Queue: [6]
Visit 6 → Queue: []
BFS order: 1, 2, 3, 4, 5, 6

DFS (Stack — Go Deep First):
Stack: [1]
Visit 1 → Stack: [2, 3]
Visit 3 → Stack: [2, 6]   ← LIFO, process 3 before 2
Visit 6 → Stack: [2]
Visit 2 → Stack: [4, 5]
Visit 5 → Stack: [4]
Visit 4 → Stack: []
DFS order: 1, 3, 6, 2, 5, 4
```

**When to use which:**
| Algorithm | Use When |
|-----------|----------|
| BFS | Shortest path (unweighted), find if path exists, level-order traversal |
| DFS | Detect cycle, topological sort, connected components, backtracking |

```python
# BFS template
from collections import deque
def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

# DFS template (iterative)
def dfs(graph, start):
    visited = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            for neighbor in graph[node]:
                stack.append(neighbor)
```

### Dijkstra's Shortest Path

```
Graph with weights:
    A
  2/ \5
  B   C
 1\  /3
    D
    |1
    E

Find shortest path A → E:

Priority Queue (min-heap by distance):
Start: {A:0}
Process A(0): update B=2, C=5 → PQ: [(2,B),(5,C)]
Process B(2): update D=3 → PQ: [(3,D),(5,C)]
Process D(3): update C=6, E=4 → PQ: [(4,E),(5,C),(6,C)]
Process E(4): DONE ✓

Shortest path A→E = 4 (via A→B→D→E: 0+2+1+1=4)
```

```python
import heapq

def dijkstra(graph, start, end):
    # graph = {node: [(cost, neighbor), ...]}
    dist = {start: 0}
    heap = [(0, start)]
    
    while heap:
        cost, node = heapq.heappop(heap)
        if cost > dist.get(node, float('inf')):
            continue  # stale entry
        if node == end:
            return cost
        for edge_cost, neighbor in graph[node]:
            new_cost = cost + edge_cost
            if new_cost < dist.get(neighbor, float('inf')):
                dist[neighbor] = new_cost
                heapq.heappush(heap, (new_cost, neighbor))
    return -1
```

---

## Part 4: Dynamic Programming / Quy Hoạch Động

### The Key Insight / Ý Tưởng Cốt Lõi

```
RECURSION (plain):          MEMOIZATION (top-down DP):
fib(5)                      fib(5)
├─ fib(4)                   ├─ fib(4) [computed once]
│  ├─ fib(3)                │  ├─ fib(3) [computed once]
│  │  ├─ fib(2)             │  │  └─ ...
│  │  └─ fib(1)             │  └─ fib(2) [from cache]
│  └─ fib(2)                └─ fib(3) [from cache]
│     ├─ fib(1)
│     └─ fib(0)
└─ fib(3) ← repeated!
   ├─ fib(2) ← repeated!
   └─ fib(1) ← repeated!

Without memo: O(2^n)   →   With memo: O(n)
```

### DP Decision Framework

```
Can I split problem into SMALLER SUBPROBLEMS?
    ↓ YES
Are subproblems OVERLAPPING (same subproblem solved multiple times)?
    ↓ YES
Does optimal solution use OPTIMAL subproblem solutions?
    ↓ YES
→ USE DYNAMIC PROGRAMMING

Ask yourself:
1. What is dp[i] (or dp[i][j]) representing?
2. Base case: dp[0] = ?
3. Transition: dp[i] = f(dp[i-1], dp[i-2], ...)
4. Answer: dp[n] or max(dp)
```

### Classic DP Patterns with Visualization

**1. Fibonacci (O(n) time, O(1) space)**
```
dp[i] = dp[i-1] + dp[i-2]
i:    0  1  2  3  4  5  6  7
dp:   0  1  1  2  3  5  8  13
```

**2. Climbing Stairs (LeetCode 70)**
```
n stairs, can climb 1 or 2 steps
dp[i] = ways to reach stair i = dp[i-1] + dp[i-2]
n:  1  2  3  4  5
dp: 1  2  3  5  8  ← same as Fibonacci!
```

**3. 0/1 Knapsack**
```
Items: weight=[2,3,4], value=[3,4,5], capacity=5

dp[i][w] = max value using first i items, capacity w

    w=0 w=1 w=2 w=3 w=4 w=5
i=0   0   0   0   0   0   0
i=1   0   0   3   3   3   3   ← item 1 (w=2, v=3)
i=2   0   0   3   4   4   7   ← item 2 (w=3, v=4)
i=3   0   0   3   4   5   7   ← item 3 (w=4, v=5)

Answer: dp[3][5] = 7 (items 1+2: value 3+4=7)
```

**4. Longest Common Subsequence (LCS)**
```
s1 = "ABCDE", s2 = "ACE"

    ""  A  C  E
""   0  0  0  0
A    0  1  1  1
B    0  1  1  1
C    0  1  2  2
D    0  1  2  2
E    0  1  2  3  ← LCS length = 3 ("ACE")

dp[i][j] = s1[i]==s2[j] ? dp[i-1][j-1]+1 : max(dp[i-1][j], dp[i][j-1])
```

---

## Part 5: Two Pointers & Sliding Window

These are the most common FE + BE interview patterns:

### Two Pointers Visualization

```
Problem: Find pair in sorted array that sums to target=9
Array: [1, 2, 3, 4, 5, 6, 7, 8]

lo=0(1), hi=7(8): sum=9 ✓ FOUND

If sum < target: move lo right (need bigger sum)
If sum > target: move hi left (need smaller sum)

Problem: Remove duplicates from sorted array [1,1,2,3,3,4]
slow=0, fast=0:
fast scans, slow writes unique values:

fast: 1,1,2,3,3,4
      ↑
slow writes 1, advances
       ↑ fast: 1 (dup skip)
          ↑ fast: 2 → write 2, slow++
             ↑ fast: 3 → write 3
                ↑ fast: 3 (dup skip)
                   ↑ fast: 4 → write 4
Result: [1,2,3,4] in first 4 positions
```

### Sliding Window Visualization

```
Problem: Maximum sum of subarray size k=3
Array: [2, 1, 5, 1, 3, 2]

Window [2,1,5]: sum=8
Slide:  [1,5,1]: sum=7  (remove 2, add 1)
Slide:  [5,1,3]: sum=9  ← MAX
Slide:  [1,3,2]: sum=6
Answer: 9

Variable-size window (longest substring without repeat):
s = "abcabcbb"
lo=0 hi=0: "a" (no repeat)
lo=0 hi=1: "ab"
lo=0 hi=2: "abc"
lo=0 hi=3: "abca" → 'a' repeats! → move lo to after first 'a'
lo=1 hi=3: "bca"
...
Max window length = 3 ("abc")
```

---

## Part 6: Backtracking / Quay Lui

```
Problem: Generate all permutations of [1,2,3]

Decision tree:
         []
      /   |   \
    [1]  [2]  [3]
    / \   / \   / \
 [1,2][1,3][2,1][2,3][3,1][3,2]
   |    |    |    |    |    |
[1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]

Backtracking = DFS + undo choice:
choose 1 → recurse → unchoose 1 → choose 2 → ...
```

```python
def permutations(nums):
    result = []
    def backtrack(current, remaining):
        if not remaining:
            result.append(current[:])
            return
        for i, num in enumerate(remaining):
            current.append(num)                    # CHOOSE
            backtrack(current, remaining[:i] + remaining[i+1:])  # EXPLORE
            current.pop()                          # UNCHOOSE
    backtrack([], nums)
    return result
```

**When to use backtracking**: "Generate all...", "Find all combinations", "N-Queens", "Word Search"

---

## Algorithm Interview Cheatsheet / Bảng Tóm Tắt

| Problem signal | Algorithm | Time |
|----------------|-----------|------|
| "Find X in sorted array" | Binary Search | O(log n) |
| "Shortest path (unweighted)" | BFS | O(V+E) |
| "Shortest path (weighted)" | Dijkstra | O((V+E) log V) |
| "All paths / permutations" | Backtracking | O(n!) |
| "Optimal substructure" | DP | Varies |
| "Subarray sum/max" | Sliding Window | O(n) |
| "Pair/triplet with sum" | Two Pointers | O(n) |
| "Top K elements" | Heap | O(n log k) |
| "Sort" | Quick/Merge | O(n log n) |
| "Connected components" | Union-Find | O(α(n)) |

---

**See also**: [Data Structures](./data-structures-theory.md) | [Complexity Analysis](./complexity-analysis.md) | [LeetCode](../../leetcode/)

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: How do you choose between BFS and DFS for graph problems? / Khi nào dùng BFS vs DFS? 🟢 Junior

**A:** BFS (Breadth-First Search) explores layer by layer using a queue — use for shortest path in unweighted graphs, level-order traversal, finding all nodes at distance K. DFS (Depth-First Search) explores deep first using a stack (or recursion) — use for detecting cycles, topological sort, finding connected components, path existence.

Vietnamese: Rule of thumb: BFS khi cần "shortest path" hoặc "nearest" (vì khám phá theo layer). DFS khi cần "all paths", "cycle detection", hoặc "topological order". Memory: BFS lưu toàn bộ frontier (có thể lớn), DFS chỉ lưu current path (O(depth)). Trong interview khi thấy "find shortest path" → ngay lập tức nghĩ BFS. Khi thấy "list all solutions" → nghĩ DFS/backtracking.

---

### Q: When should you use dynamic programming instead of recursion? / Khi nào dùng DP thay vì recursion? 🟡 Mid

**A:** Use DP when the problem has: (1) **overlapping subproblems** — same subproblem solved multiple times in plain recursion, and (2) **optimal substructure** — optimal solution built from optimal sub-solutions. DP avoids recomputation via memoization (top-down) or tabulation (bottom-up).

Example recognition: Fibonacci with plain recursion = O(2^n), with memoization = O(n). Coin change, longest common subsequence, knapsack are classic DP patterns.

Vietnamese: Dấu hiệu nhận biết DP problem: "minimum/maximum", "count ways", "is possible". Khi thấy recursive tree có nhiều nhánh trùng nhau → memoize. Top-down (memoization): dễ viết, giữ recursive structure. Bottom-up (tabulation): nhanh hơn (no call stack overhead), dễ optimize space. Phỏng vấn: bắt đầu với brute force recursion → nhận ra overlap → thêm memo → tối ưu nếu cần.

---

### Q: What is the difference between Dijkstra and Bellman-Ford? / Dijkstra vs Bellman-Ford khác nhau như thế nào? 🟡 Mid

**A:** Dijkstra finds shortest paths from source, works with non-negative weights, O((V+E) log V) with a min-heap. Bellman-Ford handles negative weights and detects negative cycles, but is O(V×E) — much slower.

```
Dijkstra (greedy, min-heap):
- Pick unvisited node with smallest distance
- Update neighbors
- Does NOT work with negative edges

Bellman-Ford (relaxation):
- Relax ALL edges V-1 times
- Then check for negative cycles (Vth iteration still improves = negative cycle)
- Works with negative edges
```

Vietnamese: Dijkstra thường được hỏi trong interview (Google Maps, routing). Key insight: greedy works vì một khi node được visited với min distance, không có path nào ngắn hơn (chỉ đúng với non-negative weights). Bellman-Ford dùng khi có negative weights (currency arbitrage). Thực tế production: A* (Dijkstra + heuristic) cho pathfinding games.

---

### Q: What is a hash collision and how is it resolved? / Hash collision là gì và xử lý thế nào? 🟡 Mid

**A:** A collision occurs when two different keys hash to the same bucket. Two main resolution strategies: **Chaining** — each bucket stores a linked list of entries, O(n) worst case if many collisions. **Open addressing** — probe for next empty slot (linear probing, quadratic probing, double hashing), more cache-friendly.

Vietnamese: Java HashMap dùng chaining, chuyển sang TreeMap (O(log n)) khi chain dài hơn 8. Load factor quan trọng: nếu > 0.75 thì rehash (thường double size). Python dict dùng open addressing với pseudo-random probing. Interview tip: biết tại sao load factor 0.75 là trade-off tốt (space vs collision rate). Good hash function: uniform distribution, fast to compute, avalanche effect.

---

### Q: When would you use a trie instead of a hash map? / Khi nào dùng trie thay vì hash map? 🔴 Senior

**A:** Use a Trie when you need: (1) prefix matching or autocomplete, (2) lexicographic sorting of strings, (3) longest common prefix. Hash map gives O(1) exact lookup but can't do prefix search. Trie gives O(m) per operation (m=key length) and supports all prefix operations naturally.

```
Trie vs Hash Map for autocomplete:
Query: "app" → find all words starting with "app"
Hash map: O(n) scan all keys
Trie: O(m + results) — traverse to "app" node, then DFS subtree

Memory: Trie shares prefixes, efficient for large string sets
        Hash map stores full key per entry
```

Vietnamese: Trie dùng trong autocomplete (search engines, IDE completions), IP routing tables (longest prefix match), spell checkers. Trade-off: Trie dùng nhiều memory hơn hash map nếu string set nhỏ hoặc ít share prefix. Compressed trie (Patricia tree) giải quyết vấn đề memory. Trong interview khi thấy "prefix", "autocomplete", "words starting with" → nghĩ trie ngay.

---

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Point |
|----------|-------|-----------|
| BFS vs DFS | 🟢 | BFS = shortest path/nearest; DFS = all paths/cycles |
| When to use DP | 🟡 | Overlapping subproblems + optimal substructure |
| Dijkstra vs Bellman-Ford | 🟡 | Dijkstra = non-negative O((V+E)logV); BF = negative edges O(VE) |
| Hash collision resolution | 🟡 | Chaining vs open addressing; load factor triggers rehash |
| Trie vs hash map | 🔴 | Trie = prefix search O(m); hash map = exact lookup O(1) |
