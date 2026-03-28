# Algorithms Theory / Lý Thuyết Thuật Toán

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Data Structures](./data-structures-theory.md) | [Complexity Analysis](./complexity-analysis.md)
> **See also**: [LeetCode Practice](../../leetcode/)

---

## Real-World Scenario / Tình Huống Thực Tế

Google Maps tìm đường đi ngắn nhất giữa 2 thành phố. Spotify gợi ý bài hát phù hợp. Netflix sắp xếp phim theo relevance. Tất cả đều dùng **algorithms** — các bước giải quyết vấn đề theo cách có thể tái sử dụng và đo lường.

Biết thuật toán không chỉ để pass phỏng vấn — mà để **nhận ra pattern** khi gặp vấn đề thực tế:

- "Cần tìm phần tử trong sorted array" → Binary Search O(log n) thay vì Linear Search O(n)
- "Cần xử lý dữ liệu theo thứ tự ưu tiên" → Heap thay vì sort mỗi lần

---

## What & Why / Cái Gì & Tại Sao

**Algorithm là gì (Feynman)?** Như **công thức nấu ăn** — các bước rõ ràng, có thứ tự, đảm bảo ra đúng kết quả với bất kỳ input hợp lệ nào.

**Tại sao cần học algorithm patterns thay vì từng bài cụ thể?**

Có ~2500 bài LeetCode nhưng chỉ có ~15 patterns chính. Nhận ra pattern = biết approach ngay lập tức:

```
Pattern nhận ra →       Approach
─────────────────────────────────────────
Array có order     →    Two Pointers / Sliding Window
Tìm min/max        →    Heap (Priority Queue)
Shortest path      →    BFS (unweighted)
Optimal choice     →    Dynamic Programming
All possibilities  →    Backtracking
Sorted array       →    Binary Search
```

---

## Concept Map / Bản Đồ Khái Niệm

```
[Data Structures] + [Complexity Analysis]
           ↓
    [Algorithm Patterns] ★ ← bạn đang ở đây
           ↓
┌──────────────────────────────────────────┐
│  Sorting    Search     Graph     DP      │
│  ────────   ──────     ─────     ──      │
│  Quick      Binary     BFS       Memo    │
│  Merge      Linear     DFS       Tabul.  │
│  Heap       Two-ptr    Dijkstra  Kadane  │
└──────────────────────────────────────────┘
           ↓
    [LeetCode Practice by Category]
```

---

## Overview / Tổng Quan

| #   | Concept                       | Vai trò                                                        | Interview Weight |
| --- | ----------------------------- | -------------------------------------------------------------- | ---------------- |
| 1   | Sorting Algorithms            | Nền tảng so sánh trade-off: stability, cache, worst-case       | ⭐⭐             |
| 2   | Binary Search                 | O(log n) — search on answer, boundary detection                | ⭐⭐⭐           |
| 3   | Graph: BFS & DFS              | Shortest path, cycle detection, topological sort               | ⭐⭐⭐           |
| 4   | Dynamic Programming           | Overlapping subproblems → memoize for exponential speedup      | ⭐⭐⭐           |
| 5   | Two Pointers & Sliding Window | Linear-time array/string patterns — most common in interviews  | ⭐⭐⭐           |
| 6   | Backtracking                  | Generate all combinations/permutations — decision tree pruning | ⭐⭐             |
| 7   | Shortest Path (Dijkstra)      | Weighted graph routing — greedy + min-heap                     | ⭐⭐             |

Các concept liên kết chặt chẽ: Binary Search + Two Pointers cùng khai thác sorted property. DP builds on recursion + memoization. Graph algorithms (BFS/DFS/Dijkstra) share visited-set pattern. Backtracking = DFS + undo.

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

| Algorithm | Best       | Average    | Worst      | Space    | Stable? | When to use                          |
| --------- | ---------- | ---------- | ---------- | -------- | ------- | ------------------------------------ |
| Bubble    | O(n)       | O(n²)      | O(n²)      | O(1)     | Yes     | Never in production                  |
| Selection | O(n²)      | O(n²)      | O(n²)      | O(1)     | No      | Never                                |
| Insertion | O(n)       | O(n²)      | O(n²)      | O(1)     | Yes     | Nearly sorted / small n              |
| Merge     | O(n log n) | O(n log n) | O(n log n) | O(n)     | Yes     | Need stable sort, linked lists       |
| Quick     | O(n log n) | O(n log n) | O(n²)      | O(log n) | No      | Default choice (fast in practice)    |
| Heap      | O(n log n) | O(n log n) | O(n log n) | O(1)     | No      | Sort in-place, memory-constrained    |
| Counting  | O(n+k)     | O(n+k)     | O(n+k)     | O(k)     | Yes     | Small integer range                  |
| Radix     | O(nk)      | O(nk)      | O(nk)      | O(n+k)   | Yes     | Large integers, fixed length strings |

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

| Problem signal               | Algorithm      | Time           |
| ---------------------------- | -------------- | -------------- |
| "Find X in sorted array"     | Binary Search  | O(log n)       |
| "Shortest path (unweighted)" | BFS            | O(V+E)         |
| "Shortest path (weighted)"   | Dijkstra       | O((V+E) log V) |
| "All paths / permutations"   | Backtracking   | O(n!)          |
| "Optimal substructure"       | DP             | Varies         |
| "Subarray sum/max"           | Sliding Window | O(n)           |
| "Pair/triplet with sum"      | Two Pointers   | O(n)           |
| "Top K elements"             | Heap           | O(n log k)     |
| "Sort"                       | Quick/Merge    | O(n log n)     |
| "Connected components"       | Union-Find     | O(α(n))        |

---

**See also**: [Data Structures](./data-structures-theory.md) | [Complexity Analysis](./complexity-analysis.md) | [LeetCode](../../leetcode/)

---

## Core Concepts — Deep Dive / Khái Niệm Cốt Lõi — Đào Sâu

### Concept 1: Sorting Algorithms

🪝 **Memory Hook:** "Quick picks pivot — splits unfairly but fast. Merge splits fairly — always O(n log n)."

❓ **Why exists (Root-Cause Trace):**

- **Level 1:** Cần sắp xếp data để display, search, hoặc eliminate duplicates
- **Level 2:** Comparison-based sort có lower bound Ω(n log n) — phải chọn trade-off: stability, cache locality, worst-case guarantee
- **Level 3:** Non-comparison sorts (counting, radix) break the bound khi data có constraints — O(n+k) trên integer range

📖 **Layer 1 — Simple Analogy / Ví dụ đơn giản:**
Sorting like organizing a bookshelf. Bubble sort = swap adjacent books one by one (slow). Quick sort = pick a "pivot" book, put smaller left, bigger right, repeat (fast but unlucky pivots = slow). Merge sort = split shelf in half, sort each half, merge back (always same speed).

📐 **Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
Quick Sort partition:
[5, 3, 8, 1, 9, 2]  pivot=5
 i→               ←j
Swap: [2, 3, 8, 1, 9, 5] → [2, 3, 1, 8, 9, 5] → [2, 3, 1] 5 [9, 8]
Average O(n log n), Worst O(n²) when already sorted + bad pivot

Merge Sort merge step:
Left: [1, 3, 5]   Right: [2, 4, 6]
Compare front: 1<2 → take 1 → 2<3 → take 2 → 3<4 → take 3...
Result: [1, 2, 3, 4, 5, 6]  Always O(n log n), Extra O(n) space
```

🔬 **Layer 3 — Edge Cases / Cạm bẫy nâng cao:**

- Quick sort O(n²) on sorted input with first-element pivot → use random pivot or median-of-three
- Merge sort on linked list = O(1) space (no array copy needed)
- Hybrid: Timsort (Python/Java) = merge sort + insertion sort for small runs
- Interview gotcha: "Is quicksort stable?" → No. Can be made stable with extra space but defeats purpose.

| Sai lầm                        | Tại sao sai                                    | Đúng là                                      |
| ------------------------------ | ---------------------------------------------- | -------------------------------------------- |
| "Quick sort always O(n log n)" | Worst case O(n²) on sorted input               | Average O(n log n) with random pivot         |
| "Merge sort uses O(1) space"   | Needs O(n) auxiliary array for merging         | O(n) space for arrays, O(1) for linked lists |
| "Stable sort doesn't matter"   | Database sorts, multi-key sorts need stability | Merge sort stable, quick sort not            |

🎯 **Interview Pattern:** "Why does Go use introsort (quicksort + heapsort fallback)?" → Quick sort fast in practice (cache-friendly), heapsort fallback prevents O(n²) worst case.

🔗 **Knowledge Chain:** Comparison sorts → Divide & Conquer → Recursion → [Complexity Analysis](./complexity-analysis.md) → [Data Structures: Heap](./data-structures-theory.md)

---

### Concept 2: Binary Search

🪝 **Memory Hook:** "lo ≤ hi, mid = lo + (hi-lo)/2. Halve the search space every step."

❓ **Why exists (Root-Cause Trace):**

- **Level 1:** Linear search O(n) too slow for large sorted datasets
- **Level 2:** Sorted order means each comparison eliminates half → O(log n)
- **Level 3:** "Binary search on answer" extends to optimization: search answer space, not data

📖 **Layer 1 — Simple Analogy:**
Looking for a word in a dictionary. Don't start from page 1 — open the middle. Word is before? Search first half. After? Second half. Each flip eliminates half the book. 1000 pages → found in ~10 flips.

📐 **Layer 2 — Mechanics:**

```
Standard: find exact value in sorted array
Template:
  lo, hi = 0, n-1
  while lo <= hi:
    mid = lo + (hi-lo)//2     ← avoid overflow
    if arr[mid] == target: return mid
    elif arr[mid] < target: lo = mid+1
    else: hi = mid-1

Boundary: find first position where condition holds
  while lo <= hi:
    mid = (lo+hi)//2
    if condition(mid): result=mid; hi=mid-1   ← keep searching left
    else: lo=mid+1

Binary Search on Answer:
  lo, hi = min_answer, max_answer
  while lo < hi:
    mid = (lo+hi)//2
    if feasible(mid): hi=mid    ← try smaller
    else: lo=mid+1
```

🔬 **Layer 3 — Edge Cases:**

- Off-by-one: `lo <= hi` vs `lo < hi` — depends on whether answer is inclusive
- Integer overflow: `(lo+hi)/2` overflows → use `lo + (hi-lo)/2`
- Infinite loop: forgetting `mid+1` or `mid-1` → always reduce search space
- Rotated sorted array: binary search still works if you check which half is sorted

| Sai lầm                         | Tại sao sai                       | Đúng là                               |
| ------------------------------- | --------------------------------- | ------------------------------------- |
| "lo+hi overflow safe"           | Integer overflow for large arrays | Use lo+(hi-lo)/2                      |
| "Binary search only for arrays" | Works on any monotonic function   | Binary search on answer space         |
| "Off-by-one doesn't matter"     | Infinite loop or miss target      | Template determines boundary behavior |

🎯 **Interview Pattern:** "Find minimum in rotated sorted array" → Modified binary search. Check which half is sorted, target must be in the unsorted half.

🔗 **Knowledge Chain:** Sorted property → Binary Search → Binary Search on Answer → Two Pointers (similar partitioning logic) → [Data Structures: BST](./data-structures-theory.md)

---

### Concept 3: Graph: BFS & DFS

🪝 **Memory Hook:** "BFS = Queue = Level-by-level = Shortest. DFS = Stack = Go deep first = All paths."

❓ **Why exists (Root-Cause Trace):**

- **Level 1:** Need to traverse/search connected structures (networks, maps, dependencies)
- **Level 2:** BFS guarantees shortest path in unweighted graphs (visits all distance-k nodes before distance-k+1). DFS uses less memory (O(depth) vs O(width))
- **Level 3:** Topological sort (DFS-based) enables dependency resolution. BFS enables multi-source shortest path (0-1 BFS with deque)

📖 **Layer 1 — Simple Analogy:**
BFS = searching a building floor-by-floor (check all rooms on floor 1, then floor 2...). DFS = exploring one hallway to its end before backtracking. BFS finds nearest exit first. DFS explores every path.

📐 **Layer 2 — Mechanics:**

```
BFS: Queue-based, O(V+E)
queue = [start], visited = {start}
while queue:
  node = queue.popleft()
  for neighbor in graph[node]:
    if neighbor not in visited:
      visited.add(neighbor); queue.append(neighbor)

DFS: Stack-based (or recursion), O(V+E)
stack = [start], visited = set()
while stack:
  node = stack.pop()
  if node not in visited:
    visited.add(node)
    for neighbor in graph[node]:
      stack.append(neighbor)

Topological Sort (DFS + finish time):
Post-order: add to result AFTER processing all neighbors → reverse = topo order
```

🔬 **Layer 3 — Edge Cases:**

- BFS on weighted graph = wrong (use Dijkstra). Exception: 0-1 BFS with deque
- DFS on very deep graphs → stack overflow. Use iterative DFS for safety
- Cycle detection: DFS with 3 colors (white/gray/black). Gray→Gray edge = cycle
- Bidirectional BFS: meet-in-the-middle reduces O(b^d) to O(b^(d/2))

| Sai lầm                          | Tại sao sai                    | Đúng là                           |
| -------------------------------- | ------------------------------ | --------------------------------- |
| "BFS always finds shortest path" | Only for unweighted graphs     | Weighted → Dijkstra               |
| "DFS finds shortest path"        | DFS finds A path, not shortest | DFS = all paths, backtracking     |
| "Recursive DFS is fine"          | Stack overflow on deep graphs  | Iterative DFS for production code |

🎯 **Interview Pattern:** "Number of islands" → DFS/BFS flood fill. "Clone graph" → BFS + hashmap. "Course schedule" → topological sort (DFS).

🔗 **Knowledge Chain:** Graph representation → BFS/DFS → Shortest Path (Dijkstra) → Topological Sort → [Distributed Systems: DAG processing](../02-system-design/system-design-theory.md)

---

### Concept 4: Dynamic Programming

🪝 **Memory Hook:** "If recursion tree has repeated branches → memoize. dp[i] depends on dp[smaller]. Base case → transition → answer."

❓ **Why exists (Root-Cause Trace):**

- **Level 1:** Brute force recursion exponential (O(2^n)) due to recomputation
- **Level 2:** Overlapping subproblems + optimal substructure = cache results → polynomial time
- **Level 3:** Space optimization: if dp[i] only depends on dp[i-1], dp[i-2] → O(1) space instead of O(n)

📖 **Layer 1 — Simple Analogy:**
Climbing stairs: "How many ways to reach step 10 if you can take 1 or 2 steps?" Without DP, you'd count every possible path (exponential). With DP, you realize: ways(10) = ways(9) + ways(8). Save each answer, build up from step 1.

📐 **Layer 2 — Mechanics:**

```
Top-Down (Memoization):
memo = {}
def dp(i):
  if i in memo: return memo[i]
  if i <= 1: return i          ← base case
  memo[i] = dp(i-1) + dp(i-2)  ← transition
  return memo[i]

Bottom-Up (Tabulation):
dp = [0] * (n+1)
dp[0], dp[1] = 0, 1
for i in range(2, n+1):
  dp[i] = dp[i-1] + dp[i-2]

Space Optimized:
prev, curr = 0, 1
for _ in range(2, n+1):
  prev, curr = curr, prev + curr  ← O(1) space
```

🔬 **Layer 3 — Edge Cases:**

- 2D DP: knapsack, LCS, edit distance — dp[i][j] grid
- Bitmask DP: state = bitmask of visited nodes (TSP, assignment)
- Interval DP: dp[i][j] = optimal for subarray [i..j]
- DP on trees: dp[node] = f(dp[children])
- Interview pitfall: "I know it's DP but can't define state" → state = minimum info to make future decisions

| Sai lầm                      | Tại sao sai                           | Đúng là                                                 |
| ---------------------------- | ------------------------------------- | ------------------------------------------------------- |
| "DP = recursion with cache"  | Top-down only; bottom-up often faster | Both approaches valid, bottom-up avoids stack           |
| "Always need O(n) space"     | Many DP only need O(1)                | Optimize when dp[i] depends on constant previous states |
| "Can't identify DP problems" | Look for "min/max/count/possible"     | + overlapping subproblems = DP signal                   |

🎯 **Interview Pattern:** Interviewer says "optimal" / "minimum cost" / "number of ways" → think DP. Define state → base case → transition → answer → optimize space.

🔗 **Knowledge Chain:** Recursion → Memoization → Tabulation → Space optimization → [Backtracking] (DP prunes, backtracking explores all)

---

### Concept 5: Two Pointers & Sliding Window

🪝 **Memory Hook:** "Two pointers: sorted → lo/hi converge. Window: expand hi, shrink lo when constraint violated."

❓ **Why exists (Root-Cause Trace):**

- **Level 1:** Brute force O(n²) for pair/subarray problems. Two pointers/window achieves O(n)
- **Level 2:** Exploit sorted order (two pointers) or contiguous subarray property (sliding window) to avoid redundant checks
- **Level 3:** Variable-size window handles "longest/shortest substring with constraint" — frequency map + window expansion/contraction

📖 **Layer 1 — Simple Analogy:**
Two pointers = two people walking from opposite ends of a bridge toward each other, meeting in the middle. Sliding window = a photographer's frame sliding across a panorama — adjust width to capture exactly what you need.

📐 **Layer 2 — Mechanics:**

```
Two Pointers (sorted array, find pair with sum=target):
lo, hi = 0, n-1
while lo < hi:
  s = arr[lo] + arr[hi]
  if s == target: return (lo, hi)
  elif s < target: lo += 1     ← need bigger sum
  else: hi -= 1                ← need smaller sum

Sliding Window (max sum of size k):
window_sum = sum(arr[:k])
max_sum = window_sum
for i in range(k, n):
  window_sum += arr[i] - arr[i-k]  ← slide: add right, remove left
  max_sum = max(max_sum, window_sum)

Variable Window (longest substring without repeating):
freq = {}; lo = 0; max_len = 0
for hi in range(n):
  freq[s[hi]] = freq.get(s[hi], 0) + 1
  while freq[s[hi]] > 1:          ← constraint violated
    freq[s[lo]] -= 1; lo += 1      ← shrink window
  max_len = max(max_len, hi-lo+1)
```

🔬 **Layer 3 — Edge Cases:**

- Two pointers on unsorted array: sort first O(n log n) + O(n) = O(n log n) total
- 3Sum = sort + fix one + two pointers on rest
- Sliding window with negative numbers: doesn't work (sum not monotonic) → use prefix sum
- Multiple constraints in window: use multiple frequency maps or counters

| Sai lầm                          | Tại sao sai                                   | Đúng là                           |
| -------------------------------- | --------------------------------------------- | --------------------------------- |
| "Two pointers works on unsorted" | Need sorted for convergence guarantee         | Sort first or use hash map        |
| "Window always fixed size"       | Variable window for "longest/shortest with X" | Expand right, shrink left         |
| "Sliding window with negatives"  | Sum not monotonic → can't shrink              | Use prefix sum + hash map instead |

🎯 **Interview Pattern:** See "sorted array" + "pair/triplet" → two pointers. See "subarray/substring" + "at most K" → sliding window. These cover ~40% of array/string problems.

🔗 **Knowledge Chain:** Array traversal → Two Pointers → 3Sum → Sliding Window → Prefix Sum → [Binary Search boundary] (same monotonic reasoning)

---

### Concept 6: Backtracking

🪝 **Memory Hook:** "Choose → Explore → Unchoose. Decision tree with pruning."

❓ **Why exists (Root-Cause Trace):**

- **Level 1:** Need to enumerate all valid configurations (permutations, combinations, placements)
- **Level 2:** Brute force generates everything then filters. Backtracking prunes invalid branches early
- **Level 3:** With good pruning, backtracking can be practical even for NP problems (N-Queens, Sudoku)

📖 **Layer 1 — Simple Analogy:**
Solving a maze: walk forward until dead end, then backtrack to last fork and try another path. You don't restart from the beginning — you undo your last choice and try the next option.

📐 **Layer 2 — Mechanics:**

```
Template:
def backtrack(state, choices):
  if is_complete(state):
    result.append(state.copy())
    return
  for choice in choices:
    if is_valid(choice, state):     ← PRUNE invalid
      state.add(choice)             ← CHOOSE
      backtrack(state, next_choices) ← EXPLORE
      state.remove(choice)          ← UNCHOOSE

Decision tree for permutations [1,2,3]:
         []
      /   |   \
    [1]  [2]  [3]
    / \   / \   / \
 [12] [13] [21] [23] [31] [32]
  |    |    |    |    |    |
[123] [132] [213] [231] [312] [321]
```

🔬 **Layer 3 — Edge Cases:**

- Combinations vs permutations: combinations use start index to avoid duplicates
- Duplicates in input: sort + skip `if i>start and nums[i]==nums[i-1]`
- Constraint propagation: Sudoku reduces choices before recursing
- Time complexity: worst case O(n!) for permutations, O(2^n) for subsets

| Sai lầm                           | Tại sao sai                                   | Đúng là                          |
| --------------------------------- | --------------------------------------------- | -------------------------------- |
| "Backtracking always exponential" | Pruning can drastically reduce                | N-Queens: prune rows/cols/diags  |
| "Forget to unchoose"              | Corrupts state for sibling branches           | Always undo after recursive call |
| "No duplicate handling"           | Gets duplicate results with repeated elements | Sort + skip duplicates           |

🎯 **Interview Pattern:** "Generate all X", "Find all valid Y", "N-Queens", "Word Search" → backtracking. Template is universal — only change `is_valid` and state representation.

🔗 **Knowledge Chain:** Recursion → DFS → Backtracking → Constraint Satisfaction → [DP] (memoized backtracking = DP)

---

### Concept 7: Shortest Path (Dijkstra)

🪝 **Memory Hook:** "Greedy + min-heap. Pop smallest, relax neighbors. No negative weights."

❓ **Why exists (Root-Cause Trace):**

- **Level 1:** BFS only works for unweighted graphs. Real-world routing has costs/distances
- **Level 2:** Greedy choice: once a node's min distance is finalized, no shorter path exists (only with non-negative weights)
- **Level 3:** A\* = Dijkstra + heuristic for faster goal-directed search. Bellman-Ford for negative weights

📖 **Layer 1 — Simple Analogy:**
Google Maps finding fastest route. At each intersection, check all roads out, always expand the currently-cheapest route first. Once you arrive at destination via the cheapest-so-far path, that's guaranteed shortest (because all remaining paths cost more).

📐 **Layer 2 — Mechanics:**

```
Dijkstra:
dist = {start: 0}
heap = [(0, start)]           ← (cost, node) min-heap
while heap:
  cost, u = heappop(heap)
  if cost > dist[u]: continue  ← stale entry, skip
  for (w, v) in graph[u]:
    new_cost = cost + w
    if new_cost < dist.get(v, ∞):
      dist[v] = new_cost
      heappush(heap, (new_cost, v))

Time: O((V+E) log V) with binary heap
```

🔬 **Layer 3 — Edge Cases:**

- Negative weights: Dijkstra gives wrong answer. Use Bellman-Ford O(VE) or SPFA
- Dense graphs: adjacency matrix + O(V²) Dijkstra (no heap) can be faster
- Negative cycles: Bellman-Ford detects (Vth relaxation still improves)
- Multi-source shortest path: add all sources to initial heap with dist=0

| Sai lầm                                 | Tại sao sai                        | Đúng là                                   |
| --------------------------------------- | ---------------------------------- | ----------------------------------------- |
| "Dijkstra works with negative edges"    | Greedy assumption breaks           | Bellman-Ford for negative                 |
| "Always use Dijkstra for shortest path" | Unweighted → BFS is simpler O(V+E) | BFS for unweighted, Dijkstra for weighted |
| "Forget stale entry check"              | Process same node multiple times   | Skip if cost > dist[node]                 |

🎯 **Interview Pattern:** "Cheapest flight with K stops" → modified Dijkstra with state (node, stops). "Network delay time" → standard Dijkstra from source.

🔗 **Knowledge Chain:** BFS → Dijkstra → A\* → Bellman-Ford → Floyd-Warshall (all-pairs) → [System Design: routing, CDN](../02-system-design/system-design-theory.md)

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

Vietnamese: Dijkstra thường được hỏi trong interview (Google Maps, routing). Key insight: greedy works vì một khi node được visited với min distance, không có path nào ngắn hơn (chỉ đúng với non-negative weights). Bellman-Ford dùng khi có negative weights (currency arbitrage). Thực tế production: A\* (Dijkstra + heuristic) cho pathfinding games.

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

| #   | Question                     | Level | Core Concept    | Key Signal                                     |
| --- | ---------------------------- | ----- | --------------- | ---------------------------------------------- |
| 1   | BFS vs DFS khi nào dùng?     | 🟢    | Graph           | BFS=shortest/nearest, DFS=all paths/cycles     |
| 2   | When to use DP vs recursion? | 🟡    | DP              | Overlapping subproblems + optimal substructure |
| 3   | Dijkstra vs Bellman-Ford?    | 🟡    | Shortest Path   | Non-negative O((V+E)logV) vs negative O(VE)    |
| 4   | Hash collision resolution?   | 🟡    | Data Structures | Chaining vs open addressing, load factor 0.75  |
| 5   | Trie vs hash map khi nào?    | 🔴    | Data Structures | Trie = prefix O(m), hash = exact O(1)          |

**Distribution:** 🟢 1 | 🟡 3 | 🔴 1

---

## ⚡ Cold Call Simulation / Mô Phỏng Cold Call

> **"You have 30 seconds: How would you find two numbers in a sorted array that sum to a target?"**

**Answer (30s):** "Two pointers — start one at beginning, one at end. If sum too small, move left pointer right. If too big, move right pointer left. Meet in the middle. O(n) time, O(1) space, because sorted order guarantees convergence."

> **Follow-up: "What if the array is unsorted?"**

"Sort first O(n log n) then two pointers O(n), total O(n log n). Or use hash map for O(n) time O(n) space — store complement as you scan."

---

## Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại và trả lời:

| #   | Loại           | Câu hỏi                                                                                     |
| --- | -------------- | ------------------------------------------------------------------------------------------- |
| 1   | 🔄 Retrieval   | Liệt kê 6 algorithm patterns chính và khi nào dùng mỗi pattern?                             |
| 2   | 🎨 Visual      | Vẽ decision tree cho backtracking permutations [1,2,3] — bao nhiêu leaf nodes?              |
| 3   | 🛠️ Application | Cho bài "longest substring without repeating characters" — dùng pattern gì? Viết pseudocode |
| 4   | 🐛 Debug       | Code binary search bị infinite loop — 3 nguyên nhân phổ biến nhất?                          |
| 5   | 🎓 Teach       | Giải thích DP cho người chưa biết programming — dùng ví dụ climbing stairs                  |

### Key Points / Điểm Chính

| #   | Key Point                                                                                   |
| --- | ------------------------------------------------------------------------------------------- |
| 1   | Sorting(Quick/Merge), Search(Binary), Graph(BFS/DFS), DP, Two Pointers/Window, Backtracking |
| 2   | 3! = 6 leaf nodes, each level picks from remaining elements                                 |
| 3   | Sliding window + frequency map, expand right shrink left when duplicate                     |
| 4   | (1) lo+1/hi-1 missing → no progress (2) lo<=hi vs lo<hi wrong (3) mid overflow              |
| 5   | "Climbing 10 stairs: ways(10) = ways(9) + ways(8). Save each answer, build up from step 1"  |

💬 **Feynman Prompt:** Giải thích sự khác biệt giữa memoization (top-down) và tabulation (bottom-up) DP cho người mới học. Dùng ví dụ Fibonacci — tại sao top-down dùng recursion stack còn bottom-up chỉ dùng loop?

---

## Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | Khi nào | Focus                                                                    |
| ----- | ------- | ------------------------------------------------------------------------ |
| 1     | Ngày 1  | Đọc toàn bộ, làm Self-Check                                              |
| 2     | Ngày 3  | Viết pseudocode 7 patterns từ memory                                     |
| 3     | Ngày 7  | Giải 1 bài mỗi pattern trên LeetCode                                     |
| 4     | Ngày 14 | Cold Call + Interview Q&A không xem tài liệu                             |
| 5     | Ngày 30 | Mock interview: interviewer cho problem signal → bạn chọn pattern + code |

---

## Practice Problems / Bài Tập Thực Hành

| Pattern | Problem | Difficulty | Key Technique |
|---------|---------|-----------|---------------|
| Binary Search | [First Bad Version](../../leetcode/sorting-searching/problems/02-first-bad-version.md) | 🟢 Easy | lo/hi boundary |
| Binary Search | [Search in Rotated Sorted Array](../../leetcode/sorting-searching/problems/03-search-in-rotated-sorted-array.md) | 🟡 Medium | Modified binary search |
| Two Pointers | [Two Sum (sorted)](../../leetcode/array/problems/04-two-sum.md) | 🟢 Easy | lo+hi converge |
| Two Pointers | [Remove Duplicates](../../leetcode/array/problems/01-remove-duplicates-from-sorted-array.md) | 🟢 Easy | slow/fast write |
| Two Pointers | [3Sum](../../leetcode/array/problems/12-3sum.md) | 🟡 Medium | Sort + two pointers |
| Sliding Window | [Longest Substring Without Repeating](../../leetcode/string/problems/10-longest-substring-without-repeating-characters.md) | 🟡 Medium | Expand/shrink window |
| Sorting | [Sort Colors](../../leetcode/sorting-searching/problems/03-sort-colors.md) | 🟡 Medium | Dutch National Flag |
| Sorting | [Merge Sorted Array](../../leetcode/sorting-searching/problems/01-merge-sorted-array.md) | 🟢 Easy | Merge step |
| BFS/DFS | [Binary Tree Level Order](../../leetcode/tree-graph/problems/03-binary-tree-level-order-traversal.md) | 🟡 Medium | BFS with queue |
| BFS/DFS | [Max Depth of Binary Tree](../../leetcode/tree-graph/problems/01-maximum-depth-of-binary-tree.md) | 🟢 Easy | DFS recursion |
| DP | [Climbing Stairs](../../leetcode/dp/problems/01-climbing-stairs.md) | 🟢 Easy | Fibonacci DP |
| DP | [Maximum Subarray](../../leetcode/dp/problems/03-maximum-subarray.md) | 🟡 Medium | Kadane's algorithm |
| DP | [House Robber](../../leetcode/dp/problems/04-house-robber.md) | 🟡 Medium | Linear DP |
| Backtracking | [Permutations](../../leetcode/backtracking/problems/03-permutations.md) | 🟡 Medium | Swap/backtrack |
| Backtracking | [Subsets](../../leetcode/backtracking/problems/02-subsets.md) | 🟡 Medium | Include/exclude |

🔗 **Full pattern index**: [LeetCode Patterns Index](../../leetcode/00-patterns-index.md)

---

## Connections / Liên Kết

### Same Track

- [Data Structures Theory](./data-structures-theory.md) — prerequisite: array, linked list, tree, heap, graph representations
- [Complexity Analysis](./complexity-analysis.md) — prerequisite: Big O cho mỗi algorithm
- [Concurrency](./07-concurrency-and-parallelism.md) — parallel merge sort, concurrent BFS
- [OS Theory](./os-theory.md) — scheduling algorithms use similar patterns
- [Computation Theory](./08-computation-theory.md) — NP-completeness, reduction

### Cross Track

- [Go Algorithms](../../be-track/01-golang/07-algorithms-go.md) — Go-specific implementations
- [Data Structures Go](../../be-track/01-golang/06-data-structures-go.md) — Go standard library structures
- [System Design](../02-system-design/system-design-theory.md) — consistent hashing, routing = graph algorithms
