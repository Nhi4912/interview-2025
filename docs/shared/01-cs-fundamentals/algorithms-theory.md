# Algorithms Theory / Lý Thuyết Thuật Toán

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Data Structures](./data-structures-theory.md) | [Complexity Analysis](./complexity-analysis.md) | [LeetCode Practice](../../leetcode/)

## Essential Algorithms for Technical Interviews / Các Thuật Toán Cần Nắm

**English:** Algorithms are step-by-step procedures for solving computational problems. Understanding common algorithms and their applications is crucial for technical interviews and efficient problem-solving.

**Tiếng Việt:** Thuật toán là các thủ tục từng bước để giải quyết các vấn đề tính toán. Hiểu các thuật toán phổ biến và ứng dụng của chúng là rất quan trọng cho phỏng vấn kỹ thuật và giải quyết vấn đề hiệu quả.

## Sorting Algorithms

### Bubble Sort

**Theory:** Repeatedly swap adjacent elements if they're in wrong order.

**Time Complexity:**

- Best: O(n) - already sorted
- Average: O(n²)
- Worst: O(n²)

**Space Complexity:** O(1)

**When to Use:**

- Small datasets
- Nearly sorted data
- Educational purposes

**Characteristics:**

- Stable sort
- In-place
- Simple implementation

### Quick Sort

**Theory:** Divide-and-conquer algorithm that picks a pivot and partitions array around it.

**Time Complexity:**

- Best: O(n log n)
- Average: O(n log n)
- Worst: O(n²) - poor pivot choice

**Space Complexity:** O(log n) - recursion stack

**When to Use:**

- General purpose sorting
- Large datasets
- In-place sorting needed

**Characteristics:**

- Not stable (can be made stable)
- In-place
- Cache-friendly

**Pivot Selection Strategies:**

- First element
- Last element
- Random element
- Median-of-three

### Merge Sort

**Theory:** Divide array into halves, recursively sort, then merge.

**Time Complexity:**

- Best: O(n log n)
- Average: O(n log n)
- Worst: O(n log n)

**Space Complexity:** O(n) - temporary arrays

**When to Use:**

- Stable sort required
- Linked lists
- External sorting
- Guaranteed O(n log n)

**Characteristics:**

- Stable sort
- Not in-place
- Predictable performance

### Heap Sort

**Theory:** Build max heap, repeatedly extract maximum.

**Time Complexity:**

- Best: O(n log n)
- Average: O(n log n)
- Worst: O(n log n)

**Space Complexity:** O(1)

**When to Use:**

- Memory constrained
- Guaranteed O(n log n)
- Priority queue operations

**Characteristics:**

- Not stable
- In-place
- No worst-case degradation

## Searching Algorithms

### Binary Search

**Theory:** Divide and conquer on sorted array.

**Time Complexity:** O(log n)
**Space Complexity:** O(1) iterative, O(log n) recursive

**Requirements:**

- Array must be sorted
- Random access needed

**Variations:**

- Find first occurrence
- Find last occurrence
- Find insertion position
- Search in rotated array

**Template:**

```
while left <= right:
    mid = left + (right - left) // 2
    if target == arr[mid]:
        return mid
    elif target < arr[mid]:
        right = mid - 1
    else:
        left = mid + 1
```

### Depth-First Search (DFS)

**Theory:** Explore as far as possible along each branch before backtracking.

**Time Complexity:** O(V + E) - vertices + edges
**Space Complexity:** O(V) - recursion stack

**When to Use:**

- Path finding
- Cycle detection
- Topological sorting
- Connected components

**Implementation Approaches:**

- Recursive
- Iterative with stack
- Backtracking

### Breadth-First Search (BFS)

**Theory:** Explore all neighbors before moving to next level.

**Time Complexity:** O(V + E)
**Space Complexity:** O(V) - queue

**When to Use:**

- Shortest path (unweighted)
- Level-order traversal
- Minimum steps problems
- Connected components

**Characteristics:**

- Uses queue
- Finds shortest path
- Level by level

## Dynamic Programming

### Theory

**Definition:** Solve complex problems by breaking down into simpler subproblems and storing results.

**Key Concepts:**

- Optimal substructure
- Overlapping subproblems
- Memoization (top-down)
- Tabulation (bottom-up)

### Common Patterns

**1. Fibonacci Sequence**

**Recurrence:** `F(n) = F(n-1) + F(n-2)`

**Approaches:**

- Recursive: O(2^n)
- Memoization: O(n)
- Tabulation: O(n)
- Space optimized: O(1)

**2. Longest Common Subsequence**

**Problem:** Find longest subsequence common to two sequences.

**Recurrence:**

```
if s1[i] == s2[j]:
    dp[i][j] = 1 + dp[i-1][j-1]
else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
```

**Time:** O(m × n)
**Space:** O(m × n), can optimize to O(min(m,n))

**3. Knapsack Problem**

**Problem:** Maximize value within weight constraint.

**0/1 Knapsack Recurrence:**

```
dp[i][w] = max(
    dp[i-1][w],  // don't take item
    value[i] + dp[i-1][w-weight[i]]  // take item
)
```

**Time:** O(n × W)
**Space:** O(n × W), can optimize to O(W)

**4. Coin Change**

**Problem:** Minimum coins to make amount.

**Recurrence:**

```
dp[amount] = min(
    dp[amount - coin] + 1
    for all coins
)
```

**Time:** O(amount × coins)
**Space:** O(amount)

### DP Optimization Techniques

**Space Optimization:**

- Rolling array
- Two rows instead of full matrix
- Single array with careful iteration

**State Compression:**

- Bitmask DP
- Coordinate compression
- Hash map for sparse states

## Greedy Algorithms

### Theory

**Definition:** Make locally optimal choice at each step, hoping to find global optimum.

**When Greedy Works:**

- Greedy choice property
- Optimal substructure
- No need to reconsider choices

### Common Problems

**1. Activity Selection**

**Problem:** Select maximum non-overlapping activities.

**Strategy:** Sort by end time, greedily select earliest ending.

**Time:** O(n log n) - sorting
**Proof:** Greedy choice is safe

**2. Huffman Coding**

**Problem:** Optimal prefix-free encoding.

**Strategy:** Build tree from least frequent characters.

**Time:** O(n log n)
**Result:** Optimal compression

**3. Fractional Knapsack**

**Problem:** Maximize value, can take fractions.

**Strategy:** Sort by value/weight ratio, take greedily.

**Time:** O(n log n)
**Difference from 0/1:** Can take fractions

## Graph Algorithms

### Dijkstra's Algorithm

**Theory:** Find shortest path from source to all vertices (non-negative weights).

**Time Complexity:**

- With min-heap: O((V + E) log V)
- With array: O(V²)

**Space Complexity:** O(V)

**When to Use:**

- Non-negative edge weights
- Single source shortest path
- GPS navigation
- Network routing

**Limitations:**

- Doesn't work with negative weights
- Not for all-pairs shortest path

### Bellman-Ford Algorithm

**Theory:** Find shortest path, handles negative weights.

**Time Complexity:** O(V × E)
**Space Complexity:** O(V)

**When to Use:**

- Negative edge weights
- Detect negative cycles
- Distributed systems

**Advantages over Dijkstra:**

- Handles negative weights
- Detects negative cycles

### Floyd-Warshall Algorithm

**Theory:** All-pairs shortest path using dynamic programming.

**Time Complexity:** O(V³)
**Space Complexity:** O(V²)

**When to Use:**

- All-pairs shortest path
- Dense graphs
- Transitive closure

**Recurrence:**

```
dist[i][j] = min(
    dist[i][j],
    dist[i][k] + dist[k][j]
)
```

### Topological Sort

**Theory:** Linear ordering of vertices in DAG.

**Algorithms:**

- DFS-based: O(V + E)
- Kahn's (BFS): O(V + E)

**When to Use:**

- Task scheduling
- Build systems
- Course prerequisites
- Dependency resolution

**Requirements:**

- Must be DAG (no cycles)
- Multiple valid orderings possible

## String Algorithms

### KMP (Knuth-Morris-Pratt)

**Theory:** Pattern matching with preprocessing to avoid redundant comparisons.

**Time Complexity:**

- Preprocessing: O(m)
- Searching: O(n)
- Total: O(n + m)

**Space Complexity:** O(m) - LPS array

**Key Concept:** Longest Proper Prefix which is also Suffix (LPS)

**When to Use:**

- Pattern matching
- Multiple searches of same pattern
- Avoid backtracking

### Rabin-Karp Algorithm

**Theory:** Use rolling hash for pattern matching.

**Time Complexity:**

- Average: O(n + m)
- Worst: O(nm) - many hash collisions

**Space Complexity:** O(1)

**When to Use:**

- Multiple pattern search
- Plagiarism detection
- String matching with wildcards

**Advantages:**

- Simple implementation
- Easy to extend to multiple patterns

### Trie (Prefix Tree)

**Theory:** Tree structure for storing strings with common prefixes.

**Time Complexity:**

- Insert: O(m) - length of word
- Search: O(m)
- Prefix search: O(p + k) - prefix + results

**Space Complexity:** O(ALPHABET_SIZE × N × M)

**When to Use:**

- Autocomplete
- Spell checker
- IP routing
- Dictionary implementation

**Advantages:**

- Fast prefix search
- Space efficient for common prefixes

## Backtracking

### Theory

**Definition:** Incrementally build solution, abandoning candidates that fail constraints.

**Template:**

```
function backtrack(state):
    if is_solution(state):
        add_to_results(state)
        return

    for choice in get_choices(state):
        if is_valid(choice):
            make_choice(choice)
            backtrack(new_state)
            undo_choice(choice)
```

### Common Problems

**1. N-Queens**

**Problem:** Place N queens on N×N board, no attacks.

**Time:** O(N!)
**Space:** O(N)

**Optimizations:**

- Bit manipulation
- Symmetry reduction

**2. Sudoku Solver**

**Problem:** Fill 9×9 grid following Sudoku rules.

**Time:** O(9^(n×n)) worst case
**Space:** O(n×n)

**Optimizations:**

- Constraint propagation
- Most constrained variable first

**3. Subset Sum**

**Problem:** Find subset with given sum.

**Time:** O(2^n)
**Space:** O(n) - recursion depth

**Variations:**

- Count subsets
- Find all subsets
- Partition problem

## Bit Manipulation

### Common Operations

**Set bit:** `n | (1 << i)`
**Clear bit:** `n & ~(1 << i)`
**Toggle bit:** `n ^ (1 << i)`
**Check bit:** `(n & (1 << i)) != 0`

### Useful Tricks

**Check power of 2:** `n & (n-1) == 0`
**Count set bits:** Brian Kernighan's algorithm
**Get rightmost set bit:** `n & -n`
**Clear rightmost set bit:** `n & (n-1)`

### Applications

**1. Subset Generation**

**Theory:** Use bits to represent subset membership.

**Time:** O(2^n × n)
**Space:** O(1)

**2. Bitmask DP**

**Theory:** Use integer to represent state.

**Example:** Traveling Salesman Problem
**Time:** O(n² × 2^n)
**Space:** O(n × 2^n)

## Interview Questions

**🟡 [Mid] Q: When to use Quick Sort vs Merge Sort?**

A: Use Quick Sort for in-place sorting with average O(n log n). Use Merge Sort when stability is required or for linked lists. Merge Sort guarantees O(n log n) but needs O(n) extra space.

**🟢 [Junior] Q: Difference between DFS and BFS?**

A: DFS explores depth-first using stack/recursion, good for path finding and backtracking. BFS explores level-by-level using queue, finds shortest path in unweighted graphs.

**🟡 [Mid] Q: When to use DP vs Greedy?**

A: Use DP when problem has optimal substructure and overlapping subproblems. Use Greedy when greedy choice property holds and local optimum leads to global optimum. DP is more general but slower.

**🟡 [Mid] Q: How to identify DP problem?**

A: Look for: optimal substructure, overlapping subproblems, counting/optimization, "maximum/minimum" keywords, decision at each step.

**🟡 [Mid] Q: Dijkstra vs Bellman-Ford?**

A: Dijkstra is faster O((V+E) log V) but requires non-negative weights. Bellman-Ford handles negative weights and detects negative cycles but slower O(VE).

---

[← Back to Data Structures](./01-data-structures-comprehensive.md) | [Next: Complexity Analysis →](./03-complexity-analysis.md)
