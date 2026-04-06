# LeetCode Patterns Mind Map - Sơ Đồ Mẫu LeetCode

> **Track**: Algorithms | **Difficulty**: 🟢 Easy → 🔴 Hard
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp các mẫu giải LeetCode phổ biến để review nhanh trước phỏng vấn

---

## Overview / Tổng Quan

```
                        ┌──────────────────────────────────────────────────────────┐
                        │                   LEETCODE PATTERNS                       │
                        └──────────────────────────────────────────────────────────┘
                                                    │
       ┌──────────┬──────────┬──────────────────────┼──────────────────┬──────────┐
       │          │          │                       │                  │          │
  ┌────▼───┐ ┌───▼────┐ ┌───▼─────┐          ┌─────▼────┐       ┌────▼───┐ ┌───▼────┐
  │ Array  │ │ Stack  │ │  Linked │          │  Tree &  │       │  DP    │ │ Binary │
  │ String │ │ Queue  │ │  List   │          │  Graph   │       │        │ │ Search │
  └────┬───┘ └───┬────┘ └───┬─────┘          └─────┬────┘       └────┬───┘ └───┬────┘
       │         │          │                       │                  │          │
  ┌────▼───┐ ┌───▼────┐ ┌───▼─────┐          ┌─────▼────┐       ┌────▼───┐ ┌───▼────┐
  │2Ptr/SW │ │Mono-   │ │Fast/Slow│          │BFS / DFS │       │1D/2D   │ │Std /   │
  │Prefix  │ │Stack   │ │Reverse  │          │Trie/Union│       │Knapsack│ │Rotated │
  └────────┘ └────────┘ └─────────┘          └──────────┘       └────────┘ └────────┘
       │         │          │                       │                  │          │
  ┌────▼──────────────────────────────────────────────────────────────────────────▼───┐
  │   Backtracking │ Greedy │ Heap / PQ │ Bit Manipulation │ Math                     │
  └────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Array & String / Mảng & Chuỗi

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              ARRAY & STRING                                            │
├────────────────────────┬──────────────────────────┬─────────────────────────────────┤
│    TWO POINTERS        │    SLIDING WINDOW         │       PREFIX SUM                │
│    Con Trỏ Đôi         │    Cửa Sổ Trượt           │       Tổng Tiền Tố              │
├────────────────────────┼──────────────────────────┼─────────────────────────────────┤
│                        │                          │                                 │
│  Opposite direction:   │  Fixed size window:      │  prefix[0] = 0                  │
│  L=0, R=n-1           │  max sum subarray k      │  prefix[i] = prefix[i-1]+a[i]   │
│  move toward center    │  → slide by 1, O(n)      │                                 │
│                        │                          │  Range sum [l,r]:               │
│  Same direction:       │  Variable size window:   │  sum = prefix[r+1]-prefix[l]    │
│  slow/fast runners     │  longest subarray ≤ k    │                                 │
│  (remove duplicates)   │  → expand right,         │  2D prefix sum for              │
│                        │    shrink left           │  rectangle queries              │
│  🟢 Two Sum II         │                          │                                 │
│  🟡 3Sum               │  🟢 Max Avg Subarray      │  🟢 Running Sum of 1D           │
│  🟡 Container w/ Water │  🟡 Longest Substr no Rpt │  🟡 Subarray Sum = K            │
│  🟡 Trapping Rain Water│  🟡 Minimum Window Substr │  🟡 Range Sum Query 2D          │
│  🔴 4Sum               │  🔴 Minimum Window Subseq │  🔴 Count of Range Sum          │
│                        │                          │                                 │
│  💡 RECOGNIZE: sorted  │  💡 RECOGNIZE: contiguous │  💡 RECOGNIZE: range queries,  │
│  array + find pair/    │  subarray, substring,    │  cumulative sums, "sum         │
│  triplet with target   │  longest/shortest/max    │  equals k" patterns            │
├────────────────────────┴──────────────────────────┴─────────────────────────────────┤
│                          SORTING-BASED / SẮP XẾP                                     │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  Sort first to enable greedy / two-pointer approaches                               │
│                                                                                      │
│  🟢 Merge Sorted Array         🟡 Merge Intervals     🟡 Non-overlapping Intervals  │
│  🟢 Sort Colors (Dutch Flag)   🟡 Meeting Rooms II    🔴 Maximum Gap                │
│                                                                                      │
│  💡 RECOGNIZE: "arrange", "group", "overlap", "interval" → sort + linear scan       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Stack & Queue / Ngăn Xếp & Hàng Đợi

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              STACK & QUEUE                                             │
├─────────────────────────────────────────┬────────────────────────────────────────────┤
│         MONOTONIC STACK                 │          QUEUE PATTERNS                    │
│         Ngăn Xếp Đơn Điệu              │          Mẫu Hàng Đợi                     │
├─────────────────────────────────────────┼────────────────────────────────────────────┤
│                                         │                                            │
│  Increasing stack → find next SMALLER  │  BFS queue: deque / collections.deque     │
│  Decreasing stack → find next LARGER   │  Monotonic deque: sliding window max       │
│                                         │                                            │
│  Pattern:                              │  Sliding Window Maximum:                   │
│  for each num:                         │  • Keep deque decreasing                   │
│    while stack and stack[-1] < num:    │  • Pop left when out of window             │
│      process(stack.pop())              │  • Front is always max                     │
│    stack.append(num)                   │                                            │
│                                         │  🟡 Sliding Window Maximum                │
│  🟢 Valid Parentheses                  │  🟡 Design Circular Queue                  │
│  🟡 Daily Temperatures                 │  🔴 Shortest Path in Binary Matrix         │
│  🟡 Next Greater Element I/II          │                                            │
│  🟡 Largest Rectangle in Histogram    │                                            │
│  🟡 Asteroid Collision                 │  💡 RECOGNIZE: "next greater/smaller       │
│  🔴 Maximal Rectangle                  │  element", "valid brackets",              │
│                                         │  "stock span", "buildings"               │
│  💡 RECOGNIZE: "next greater/smaller   │                                            │
│  element", "span", "visibility"        │                                            │
└─────────────────────────────────────────┴────────────────────────────────────────────┘
```

---

## 3. Linked List / Danh Sách Liên Kết

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                               LINKED LIST                                              │
├────────────────────────┬─────────────────────────┬───────────────────────────────────┤
│   FAST / SLOW PTRS     │   REVERSE               │   MERGE / OTHER                   │
│   Con Trỏ Nhanh/Chậm   │   Đảo Ngược             │   Gộp / Khác                     │
├────────────────────────┼─────────────────────────┼───────────────────────────────────┤
│                        │                         │                                   │
│  slow = fast = head    │  prev, curr = None, head│  Merge Two Sorted:                │
│  fast moves 2 steps    │  while curr:            │  dummy → compare heads            │
│  slow moves 1 step     │    nxt = curr.next      │  → attach smaller                 │
│                        │    curr.next = prev     │                                   │
│  Find cycle: fast      │    prev = curr          │  In-place reversal:               │
│  meets slow in cycle   │    curr = nxt           │  reverse in groups of k           │
│                        │  return prev            │  using prev ptr                   │
│  Find middle: when     │                         │                                   │
│  fast reaches end,     │  🟢 Reverse Linked List  │  🟢 Merge Two Sorted Lists        │
│  slow is at middle     │  🟡 Reverse in K Groups  │  🟡 Add Two Numbers               │
│                        │  🟡 Palindrome List      │  🟡 Copy List w/ Random Ptr       │
│  🟢 Linked List Cycle  │  🟡 Swap Pairs           │  🔴 Merge K Sorted Lists          │
│  🟡 Find Cycle Start   │                         │  🔴 Reverse Nodes in k-Group      │
│  🟡 Happy Number       │                         │                                   │
│  🟡 Middle of List     │  💡 RECOGNIZE: "reverse" │  💡 RECOGNIZE: "merge", "sort",   │
│                        │  "palindrome", "k group" │  "rearrange", "interleave"       │
│  💡 RECOGNIZE: "cycle" │                         │                                   │
│  "middle", "kth node"  │                         │                                   │
└────────────────────────┴─────────────────────────┴───────────────────────────────────┘
```

---

## 4. Tree & Graph / Cây & Đồ Thị

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                               TREE & GRAPH                                             │
├──────────────────────┬──────────────────────────┬─────────────────────────────────────┤
│   BFS / DFS TREE     │    BINARY SEARCH TREE    │         TRIE                       │
│   BFS / DFS Cây      │    Cây Tìm Kiếm NP       │         Cây Tiền Tố               │
├──────────────────────┼──────────────────────────┼─────────────────────────────────────┤
│                      │                          │                                   │
│  BFS (level-order):  │  Insert: left < node     │  class TrieNode:                  │
│  queue = deque([r])  │          right > node    │    children = {}                  │
│  while queue:        │  Inorder → sorted seq    │    is_end = False                 │
│    node = queue.pop  │                          │                                   │
│    process(node)     │  Validate BST: track     │  Insert: O(m) m=word len          │
│    add children      │  [min, max] range        │  Search: O(m)                     │
│                      │  for each node           │  StartsWith: O(p)                 │
│  DFS traversals:     │                          │                                   │
│  Pre:  root,L,R      │  LCA of BST: if both     │  🟡 Implement Trie                │
│  In:   L,root,R      │  keys < node → go left   │  🟡 Word Search II                │
│  Post: L,R,root      │  if both > node → right  │  🔴 Word Break II                 │
│                      │  else → node is LCA      │                                   │
│  🟢 Max Depth        │                          │  💡 RECOGNIZE: "prefix",          │
│  🟡 Level Order      │  🟡 Validate BST         │  "autocomplete", "word           │
│  🟡 Binary Tree Paths│  🟡 Kth Smallest in BST  │  dictionary" problems            │
│  🟡 LCA              │  🟡 BST Iterator         │                                   │
│  🔴 Serialize Tree   │  🔴 Recover BST          │                                   │
├──────────────────────┴──────────────────────────┴─────────────────────────────────────┤
│                         GRAPH ALGORITHMS / Thuật Toán Đồ Thị                          │
├────────────────────────────────┬─────────────────────────────┬──────────────────────┤
│   BFS / DFS GRAPH              │   DIJKSTRA / TOPOSORT       │   UNION-FIND         │
│   BFS / DFS Đồ Thị            │                             │   Hợp-Tìm            │
├────────────────────────────────┼─────────────────────────────┼──────────────────────┤
│                                │                             │                      │
│  BFS → shortest path           │  Dijkstra: min heap         │  parent = [i for i   │
│  (unweighted)                  │  dist[start] = 0            │    in range(n)]      │
│  DFS → connected components,  │  heap = [(0, start)]        │                      │
│  cycle detection, paths        │  while heap:                │  def find(x):        │
│                                │    d, u = heappop(heap)     │    if parent[x]!=x:  │
│  Visited set to avoid cycles   │    for v, w in adj[u]:      │      parent[x] =     │
│  adj list: defaultdict(list)   │      if d+w < dist[v]:      │        find(parent   │
│                                │        update & push        │          [x])        │
│  🟡 Number of Islands          │                             │    return parent[x]  │
│  🟡 Clone Graph                │  Topo Sort (Kahn's):        │                      │
│  🟡 Course Schedule            │  in-degree array + queue    │  def union(x, y):    │
│  🟡 Pacific Atlantic           │  → BFS with in-degree=0    │    px,py=find(x,y)   │
│  🔴 Alien Dictionary           │                             │    parent[px]=py     │
│  🔴 Word Ladder                │  🟡 Network Delay Time      │                      │
│                                │  🟡 Course Schedule II      │  🟡 Number of        │
│  💡 RECOGNIZE: grid problems,  │  🔴 Cheapest Flights K Stops│  Provinces           │
│  "connected components",       │  🔴 Reconstruct Itinerary   │  🟡 Redundant Conn.  │
│  "shortest path"               │                             │  🔴 Accounts Merge   │
└────────────────────────────────┴─────────────────────────────┴──────────────────────┘
```

---

## 5. Dynamic Programming / Quy Hoạch Động

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                           DYNAMIC PROGRAMMING                                          │
├─────────────────────────────────┬────────────────────────────────────────────────────┤
│           1D DP                 │                   2D DP                             │
│           QHĐ 1 chiều           │                   QHĐ 2 chiều                      │
├─────────────────────────────────┼────────────────────────────────────────────────────┤
│                                 │                                                    │
│  dp[i] = f(dp[i-1], dp[i-2])   │  dp[i][j] = f(dp[i-1][j], dp[i][j-1], ...)        │
│                                 │                                                    │
│  Fibonacci pattern:             │  Grid paths:                                       │
│  dp[i] = dp[i-1] + dp[i-2]     │  dp[i][j] = dp[i-1][j] + dp[i][j-1]               │
│                                 │  (paths to reach cell)                             │
│  🟢 Climbing Stairs             │                                                    │
│  🟢 House Robber                │  Edit Distance (Levenshtein):                      │
│  🟡 Decode Ways                 │  if s[i]==t[j]: dp[i][j]=dp[i-1][j-1]             │
│  🟡 Jump Game                   │  else: 1 + min(insert, delete, replace)            │
│  🟡 Min Cost Climbing Stairs    │                                                    │
│  🔴 Longest Valid Parentheses   │  🟡 Unique Paths                                   │
│                                 │  🟡 Minimum Path Sum                               │
│  💡 RECOGNIZE: overlapping      │  🟡 Edit Distance                                  │
│  subproblems, optimize          │  🟡 Longest Common Subsequence                     │
│  from brute-force recursion     │  🔴 Interleaving String                            │
├─────────────────────────────────┴────────────────────────────────────────────────────┤
│                         KNAPSACK & SEQUENCE / Ba Lô & Dãy Số                          │
├──────────────────────────────────────────────┬───────────────────────────────────────┤
│          0/1 KNAPSACK                        │       LIS / LCS PATTERNS             │
│          Ba Lô 0/1                           │       Dãy Con Tăng Dần / Chung       │
├──────────────────────────────────────────────┼───────────────────────────────────────┤
│                                              │                                       │
│  dp[i][w] = max(dp[i-1][w],                 │  LIS (O(n²)):                        │
│    dp[i-1][w-wt[i]] + val[i])               │  dp[i] = max(dp[j]+1)                │
│                                              │  for all j<i where a[j]<a[i]         │
│  1D optimization:                           │                                       │
│  dp[w] = max(dp[w], dp[w-wt]+val)           │  LIS (O(n log n)):                   │
│  iterate w from W down to 0                 │  Binary search on tails array         │
│                                              │                                       │
│  Unbounded: iterate w from 0 to W           │  LCS: classic 2D DP                  │
│                                              │  dp[i][j] = dp[i-1][j-1]+1           │
│  🟡 Partition Equal Subset Sum              │  if a[i]==b[j]                        │
│  🟡 Coin Change                             │                                       │
│  🟡 Coin Change II (count ways)             │  🟡 Longest Increasing Subsequence    │
│  🟡 Target Sum                              │  🟡 Russian Doll Envelopes            │
│  🔴 Ones and Zeroes                         │  🟡 Longest Common Subsequence        │
│                                              │  🔴 Edit Distance                     │
│  💡 RECOGNIZE: "subset sum",                │                                       │
│  "pick or skip items",                      │  💡 RECOGNIZE: "longest subseq",     │
│  "exactly/at most k items"                  │  "common subsequence",               │
│                                              │  "increasing sequence"               │
└──────────────────────────────────────────────┴───────────────────────────────────────┘
```

---

## 6. Binary Search / Tìm Kiếm Nhị Phân

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              BINARY SEARCH                                             │
├──────────────────────┬──────────────────────────┬─────────────────────────────────────┤
│   STANDARD           │   ROTATED ARRAY          │   SEARCH ANSWER SPACE              │
│   Tiêu Chuẩn        │   Mảng Xoay              │   Tìm Kiếm Không Gian Đáp Án      │
├──────────────────────┼──────────────────────────┼─────────────────────────────────────┤
│                      │                          │                                   │
│  lo, hi = 0, n-1    │  Find pivot first, or    │  Binary search on the ANSWER      │
│  while lo <= hi:    │  check which half sorted │  not on the array index            │
│    mid=(lo+hi)//2   │                          │                                   │
│    if arr[mid]==t:  │  if arr[mid]>=arr[lo]:   │  Template:                        │
│      return mid     │    left half sorted      │  lo, hi = min_ans, max_ans        │
│    elif arr[mid]<t: │  else:                   │  while lo < hi:                   │
│      lo = mid+1     │    right half sorted     │    mid = (lo+hi)//2               │
│    else:            │                          │    if feasible(mid):              │
│      hi = mid-1     │  🟡 Search in Rotated    │      hi = mid                     │
│                     │  🟡 Find Min in Rotated  │    else:                          │
│  Bisect left:       │  🟡 Find Peak Element    │      lo = mid+1                   │
│  while lo<hi:       │  🔴 Find Min II (dups)   │                                   │
│    mid=(lo+hi)//2   │                          │  🟡 Koko Eating Bananas           │
│    if arr[mid]<t:   │  💡 RECOGNIZE: "rotated" │  🟡 Capacity to Ship Packages     │
│      lo=mid+1       │  "sorted with rotation"  │  🟡 Minimum in Rotated Array      │
│    else: hi=mid     │  "circular sorted"       │  🔴 Split Array Largest Sum       │
│                     │                          │  🔴 Minimize Max Distance         │
│  🟢 Binary Search   │                          │                                   │
│  🟡 First/Last Pos  │                          │  💡 RECOGNIZE: "minimize max",    │
│  🟡 Search Matrix   │                          │  "maximize min", "at least k"    │
│                     │                          │  feasibility check on answer     │
└──────────────────────┴──────────────────────────┴─────────────────────────────────────┘
```

---

## 7. Backtracking / Quay Lui

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              BACKTRACKING                                              │
├──────────────────────────────────────┬───────────────────────────────────────────────┤
│        TEMPLATE                      │         PROBLEM TYPES                        │
│        Mẫu Chung                    │         Các Loại Bài                         │
├──────────────────────────────────────┼───────────────────────────────────────────────┤
│                                      │                                               │
│  def backtrack(start, path):         │  Permutations: use visited[] or swap trick   │
│    if base_case(path):               │  No duplicates: sort + skip same neighbor    │
│      result.append(path[:])          │                                               │
│      return                          │  Combinations: start index, no revisit       │
│    for choice in choices:            │  With repeats: don't increment start         │
│      if not valid(choice):           │                                               │
│        continue                      │  Subsets: include or exclude each element    │
│      path.append(choice)            │  Power set: 2^n subsets                       │
│      backtrack(next, path)          │                                               │
│      path.pop()  ← UNDO             │  Constraint satisfaction:                    │
│                                      │  • Prune early with constraints              │
│  Time: O(N! or 2^N or N^N)          │  • Track row/col/box for Sudoku              │
│  Space: O(N) recursion depth        │  • Track cols/diagonals for N-Queens         │
│                                      │                                               │
│  Key insight: try → recurse → undo  │  🟡 Permutations I & II                      │
│                                      │  🟡 Combinations                             │
│                                      │  🟡 Subsets I & II                           │
│                                      │  🟡 Combination Sum I & II                   │
│                                      │  🟡 Palindrome Partitioning                  │
│                                      │  🟡 Letter Combinations Phone                │
│                                      │  🔴 N-Queens                                 │
│                                      │  🔴 Sudoku Solver                            │
│                                      │  🔴 Word Search                              │
│                                      │                                               │
│                                      │  💡 RECOGNIZE: "all possible",              │
│                                      │  "generate all", "enumerate"                │
└──────────────────────────────────────┴───────────────────────────────────────────────┘
```

---

## 8. Greedy / Tham Lam

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                  GREEDY                                                │
├────────────────────────────┬───────────────────────────┬─────────────────────────────┤
│   INTERVAL SCHEDULING      │   JUMP GAME VARIANTS      │   OTHER GREEDY             │
│   Lên Lịch Khoảng          │   Bài Nhảy                │   Tham Lam Khác            │
├────────────────────────────┼───────────────────────────┼─────────────────────────────┤
│                            │                           │                             │
│  Sort by END time          │  Track max_reach so far   │  Activity Selection:        │
│  Greedily pick earliest    │  if i > max_reach:        │  sort by finish time,       │
│  finishing activity        │    return False           │  pick if start ≥ last end   │
│  that doesn't overlap      │  max_reach = max(reach,   │                             │
│                            │    i + nums[i])           │  Fractional Knapsack:       │
│  Sort by START for         │                           │  sort by value/weight       │
│  minimum platforms         │  Min jumps (greedy BFS):  │  ratio descending           │
│                            │  track current_end and    │                             │
│  🟡 Non-overlapping Intrvl │  farthest_so_far          │  Assign Cookies, Tasks      │
│  🟡 Minimum # Arrows       │                           │  with deadlines             │
│  🟡 Meeting Rooms II       │  🟡 Jump Game I           │                             │
│  🔴 Employee Free Time     │  🟡 Jump Game II          │  🟢 Assign Cookies          │
│                            │  🔴 Jump Game VII         │  🟡 Gas Station             │
│  💡 RECOGNIZE: "minimum    │                           │  🟡 Task Scheduler          │
│  resources", "no overlap", │  💡 RECOGNIZE: "can you   │  🟡 Queue Reconstruction    │
│  "schedule intervals"      │  reach end", "min steps"  │  🔴 IPO (greedy + heap)     │
└────────────────────────────┴───────────────────────────┴─────────────────────────────┘
```

---

## 9. Heap / Priority Queue / Hàng Đợi Ưu Tiên

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                           HEAP / PRIORITY QUEUE                                        │
├──────────────────────┬──────────────────────────┬─────────────────────────────────────┤
│   TOP K ELEMENTS     │   MERGE K SORTED         │   TWO HEAPS PATTERN               │
│   K Phần Tử Lớn Nhất│   Gộp K Dãy Đã Sắp       │   Mẫu Hai Heap                   │
├──────────────────────┼──────────────────────────┼─────────────────────────────────────┤
│                      │                          │                                   │
│  Min-heap of size K: │  Use min-heap of size K  │  Max-heap for lower half          │
│  • push all         │  Each entry: (val, list_i,│  Min-heap for upper half          │
│  • pop until size K │    element_i)             │  Balance: |max_h| - |min_h| ≤ 1  │
│  Top is Kth largest │                          │  Median = top of max_heap or      │
│                      │  Pop min → push next     │  avg of both tops                 │
│  Or QuickSelect O(n) │  from same list          │                                   │
│  (Lomuto partition)  │                          │  🔴 Find Median from Data Stream  │
│                      │  🟡 Merge K Sorted Lists │  🔴 Sliding Window Median         │
│  🟢 Kth Largest in  │  🟡 Merge K Sorted Arrays│                                   │
│     Array (sort)     │  🔴 Smallest Range from K│  💡 RECOGNIZE: "running median", │
│  🟡 Kth Largest in  │     Lists                │  "continuously added data",       │
│     Stream           │                          │  "partition into two halves"     │
│  🟡 K Closest Pts   │  💡 RECOGNIZE: "merge    │                                   │
│  🟡 Top K Frequent  │  multiple sorted",       │                                   │
│  🟡 Sort Characters │  "k sorted lists/arrays" │                                   │
│     by Frequency     │                          │                                   │
│                      │                          │                                   │
│  💡 RECOGNIZE: "top │                          │                                   │
│  k", "k largest",   │                          │                                   │
│  "k most frequent"  │                          │                                   │
└──────────────────────┴──────────────────────────┴─────────────────────────────────────┘
```

---

## 10. Bit Manipulation / Thao Tác Bit

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                           BIT MANIPULATION                                             │
├───────────────────────────────────────┬──────────────────────────────────────────────┤
│          XOR TRICKS                   │      BITMASK & BIT COUNTING                  │
│          Thủ Thuật XOR                │      Bitmask & Đếm Bit                      │
├───────────────────────────────────────┼──────────────────────────────────────────────┤
│                                       │                                              │
│  XOR properties:                      │  Check bit k:   n & (1 << k)                │
│  • a ^ a = 0                          │  Set bit k:     n | (1 << k)                │
│  • a ^ 0 = a                          │  Clear bit k:   n & ~(1 << k)               │
│  • Commutative & Associative          │  Toggle bit k:  n ^ (1 << k)                │
│                                       │                                              │
│  Find single number:                  │  Count set bits (Brian Kernighan):           │
│  XOR all → pairs cancel out           │  while n: n &= n-1; count++                 │
│  Result is the unique number          │                                              │
│                                       │  n & (n-1): removes lowest set bit          │
│  Find two unique numbers:             │  n & (-n):  isolates lowest set bit         │
│  XOR all → xor = a^b                  │  isPow2:    n>0 and (n&(n-1))==0            │
│  find rightmost set bit of xor        │                                              │
│  partition numbers by that bit        │  Bitmask DP (enumerate subsets):            │
│  XOR each partition separately        │  for mask in range(1 << n):                 │
│                                       │    for i in range(n):                       │
│  🟢 Single Number                     │      if mask & (1<<i):                      │
│  🟡 Single Number II (3 occurrences)  │        # i is in subset                     │
│  🟡 Single Number III (two unique)    │                                              │
│  🟡 Missing Number                    │  🟡 Counting Bits                           │
│  🟡 Reverse Bits                      │  🟡 Number of 1 Bits (Hamming Weight)       │
│  🟡 Number of 1 Bits                  │  🔴 Traveling Salesman (bitmask DP)         │
│  🟡 Sum of Two Integers (no +)        │  🔴 Minimum XOR Sum of Two Arrays           │
│                                       │                                              │
│  💡 RECOGNIZE: "find missing",        │  💡 RECOGNIZE: "subset enumeration",        │
│  "single appearing", "no extra space" │  "n ≤ 20 items → try all subsets"          │
└───────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 11. Math / Toán

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                    MATH                                                │
├────────────────────────────┬──────────────────────────┬─────────────────────────────┤
│   GCD / LCM                │   MODULAR ARITHMETIC     │   COMBINATORICS             │
│   ƯCLN / BCNN              │   Số Học Modular         │   Tổ Hợp                   │
├────────────────────────────┼──────────────────────────┼─────────────────────────────┤
│                            │                          │                             │
│  Euclidean algorithm:      │  (a + b) % m =           │  C(n,k) = n! / k!(n-k)!    │
│  gcd(a,b) = gcd(b, a%b)   │    ((a%m) + (b%m)) % m   │                             │
│  gcd(a,0) = a              │                          │  Pascal's triangle:         │
│                            │  (a * b) % m =           │  C(n,k) = C(n-1,k-1) +     │
│  lcm(a,b) = a*b // gcd    │    ((a%m) * (b%m)) % m   │           C(n-1,k)          │
│                            │                          │                             │
│  Applications:             │  Modular exponentiation: │  Stars and bars:            │
│  • Sync cycles             │  fast_pow(base, exp, mod)│  place n items in k buckets │
│  • Fractions in lowest     │  → square & multiply     │  = C(n+k-1, k-1)            │
│    terms                   │                          │                             │
│  • LCM of array            │  Fermat's little theorem │  Catalan numbers:           │
│                            │  a^(p-1) ≡ 1 (mod p)    │  C_n = C(2n,n)/(n+1)        │
│  🟢 GCD of Strings         │  for prime p, a%p != 0   │  (valid parentheses count,  │
│  🟡 Ugly Number            │                          │  BST structures, etc.)      │
│  🟡 Perfect Squares        │  🟡 Pow(x, n)            │                             │
│  🟡 Count Primes (Sieve)   │  🟡 Super Pow             │  🟡 Pascal's Triangle       │
│  🔴 LCM of Array           │  🔴 Reaching Points      │  🟡 Unique Paths (math)     │
│                            │                          │  🔴 K-th Permutation        │
│  Sieve of Eratosthenes:    │  💡 RECOGNIZE: "large    │                             │
│  O(n log log n) primes up  │  numbers", "mod 10^9+7", │  💡 RECOGNIZE: "count ways",│
│  to n                      │  "count combinations"    │  "arrangements", "choose k"│
└────────────────────────────┴──────────────────────────┴─────────────────────────────┘
```

---

## 12. Quick Reference / Tham Khảo Nhanh

| Pattern / Mẫu      | Signal Keywords / Từ Khóa                          | Time Complexity | Difficulty |
| ------------------ | -------------------------------------------------- | --------------- | ---------- |
| Two Pointers       | sorted array, pair sum, partition                  | O(n)            | 🟢–🟡      |
| Sliding Window     | subarray, substring, contiguous, longest/shortest  | O(n)            | 🟢–🟡      |
| Prefix Sum         | range sum, subarray sum equals k                   | O(n) precompute | 🟢–🟡      |
| Monotonic Stack    | next greater/smaller, span, buildings              | O(n)            | 🟡         |
| Fast/Slow Pointers | cycle detection, middle of list, happy number      | O(n)            | 🟢–🟡      |
| BFS (Tree/Graph)   | shortest path, level order, min steps              | O(V+E)          | 🟢–🟡      |
| DFS (Tree/Graph)   | all paths, connected components, cycle             | O(V+E)          | 🟢–🟡      |
| Binary Search      | sorted input, "find kth", "minimum max"            | O(log n)        | 🟢–🔴      |
| 1D DP              | overlapping subproblems, "min/max ways"            | O(n)            | 🟡–🔴      |
| 2D DP / Knapsack   | grid paths, subset sum, LCS                        | O(n²) or O(n·W) | 🟡–🔴      |
| Backtracking       | "generate all", permutations, combinations         | O(N! or 2^N)    | 🟡–🔴      |
| Greedy             | "always best local choice", intervals, scheduling  | O(n log n)      | 🟡–🔴      |
| Heap / Top K       | "kth largest", "k most frequent", "merge k sorted" | O(n log k)      | 🟡–🔴      |
| Trie               | prefix search, word dictionary, autocomplete       | O(m) per op     | 🟡–🔴      |
| Union-Find         | connected components, detect cycle, group elements | O(α(n)) ≈ O(1)  | 🟡–🔴      |
| Bit Manipulation   | single number, missing number, subset enumeration  | O(n) or O(2^n)  | 🟢–🔴      |

---

## 13. Pattern Recognition Tips / Mẹo Nhận Dạng Mẫu

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                       HOW TO IDENTIFY THE RIGHT PATTERN                               │
│                       Cách Nhận Biết Mẫu Phù Hợp                                    │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  INPUT TYPE → LIKELY PATTERNS:                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │ Sorted array / matrix     → Binary Search, Two Pointers                        │ │
│  │ Unsorted array + pairs    → Hash Map, Two Pointers (after sort)                │ │
│  │ String / subarray         → Sliding Window, Prefix Sum, Hash Map               │ │
│  │ Linked list               → Fast/Slow Pointers, Reverse, Dummy Node            │ │
│  │ Tree (any)                → DFS recursion, BFS with queue                      │ │
│  │ Grid / Matrix             → BFS (shortest), DFS (flood fill), DP               │ │
│  │ "All possible" / "count"  → Backtracking, DP                                   │ │
│  │ "Optimal" / "min/max"     → DP, Greedy, Binary Search on answer                │ │
│  │ Top K / K closest         → Heap (min/max), QuickSelect                        │ │
│  │ Intervals / overlaps      → Sort + Greedy, Sweep Line                          │ │
│  │ Graph / network           → BFS, DFS, Dijkstra, Topo Sort, Union-Find          │ │
│  │ Prefix / word search      → Trie                                               │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│  COMPLEXITY CONSTRAINTS → EXPECTED APPROACH:                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │ n ≤ 20         → Backtracking, Bitmask DP (2^n or n! is OK)                   │ │
│  │ n ≤ 300        → O(n³) DP (edit distance, matrix chain)                        │ │
│  │ n ≤ 5000       → O(n²) DP, O(n²) sort comparisons                             │ │
│  │ n ≤ 10⁵        → O(n log n) sorting / binary search / heap                    │ │
│  │ n ≤ 10⁶        → O(n) two pointers, sliding window, prefix sum                │ │
│  │ n ≤ 10⁸        → O(log n) or O(√n) mathematical                               │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                      │
│  5-STEP APPROACH FOR ANY PROBLEM:                                                    │
│  1. Clarify constraints (size, range, edge cases)                                   │
│  2. Draw examples (2-3 small examples, 1 edge case)                                 │
│  3. Identify pattern from input/output structure                                    │
│  4. Code brute force → optimize with pattern                                        │
│  5. Verify time/space complexity and edge cases                                     │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

> **Sử dụng:** In ra hoặc lưu file này để review nhanh các mẫu giải thuật trước phỏng vấn.
> **Usage:** Print or save this file for quick algorithm pattern review before interviews.
