# LeetCode Study Guide — Interview-Focused Strategy / Chiến Lược Ôn LeetCode

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **L5 Competencies**: Problem-Solving (15pts), Technical Mastery (20pts)
> **See also**: [Patterns Index](./00-patterns-index.md) | [Problem-Solving Meta Guide](../fe-track/13-coding-practice/00-problem-solving-meta-guide.md) | [Algorithms Theory](../shared/01-cs-fundamentals/algorithms-theory.md)

---

## Tại Sao Guide Này? / Why This Guide?

133 bài trong repo này. Bạn không cần (và không nên) giải hết. Interview tại FAANG/top companies lặp lại **30-40 bài core** với biến thể. Guide này giúp bạn:

1. **Biết ôn gì trước** — xếp hạng theo tần suất phỏng vấn thực tế
2. **Hiểu pattern, không thuộc bài** — mỗi bài là ví dụ của 1 pattern
3. **Biết khi nào dừng** — diminishing returns sau ~80 bài

---

## Interview Frequency Tiers / Xếp Hạng Theo Tần Suất

### 🔥 Tier 1 — Must Know (Gặp >70% interviews) — Làm TRƯỚC

Nếu chỉ có 2 tuần, chỉ làm tier này. 25 bài cover 70%+ coding rounds.

| # | Problem | Pattern | Diff | Why Essential |
|---|---------|---------|------|---------------|
| 1 | [Two Sum](./array/problems/04-two-sum.md) | Hash Map | 🟢 | Bài #1 mọi danh sách, test hash map thinking |
| 2 | [Valid Parentheses](./others/problems/01-valid-parentheses.md) | Stack | 🟢 | Classic stack, mở rộng thành nhiều variants |
| 3 | [Merge Two Sorted Lists](./linked-list/problems/02-merge-two-sorted-lists.md) | Linked List | 🟢 | Foundation cho merge sort, merge K lists |
| 4 | [Best Time Buy Sell Stock](./dp/problems/02-best-time-to-buy-and-sell-stock.md) | DP/Greedy | 🟢 | Kadane variant, rất hay gặp |
| 5 | [Valid Palindrome](./string/problems/05-valid-palindrome.md) | Two Pointers | 🟢 | Two pointer foundation |
| 6 | [Reverse Linked List](./linked-list/problems/01-reverse-linked-list.md) | Linked List | 🟢 | Building block, in-place reversal |
| 7 | [Maximum Depth Binary Tree](./tree-graph/problems/01-maximum-depth-of-binary-tree.md) | DFS | 🟢 | DFS recursion foundation |
| 8 | [Climbing Stairs](./dp/problems/01-climbing-stairs.md) | DP | 🟢 | DP = Fibonacci nhận dạng |
| 9 | [3Sum](./array/problems/12-3sum.md) | Two Pointers | 🟡 | Sort + two pointers, cực kỳ phổ biến |
| 10 | [Longest Substring Without Repeating](./string/problems/10-longest-substring-without-repeating-characters.md) | Sliding Window | 🟡 | Sliding window foundation |
| 11 | [Product of Array Except Self](./array/problems/17-product-of-array-except-self.md) | Array | 🟡 | Prefix/suffix product, O(1) space trick |
| 12 | [Binary Tree Level Order](./tree-graph/problems/03-binary-tree-level-order-traversal.md) | BFS | 🟡 | BFS foundation, queue pattern |
| 13 | [Validate BST](./tree-graph/problems/02-validate-binary-search-tree.md) | DFS | 🟡 | Inorder traversal trick |
| 14 | [Coin Change](./dp/problems/07-coin-change.md) | DP | 🟡 | Classic unbounded knapsack DP |
| 15 | [Number of Islands](./tree-graph/problems/12-number-of-islands.md) | BFS/DFS | 🟡 | Grid traversal, connected components |
| 16 | [Merge Intervals](./array/problems/19-merge-intervals.md) | Sort+Merge | 🟡 | Interval pattern foundation |
| 17 | [LRU Cache](./design/problems/09-lru-cache.md) | Design | 🟡 | HashMap + Doubly LL, gặp cực nhiều |
| 18 | [Search in Rotated Sorted Array](./sorting-searching/problems/03-search-in-rotated-sorted-array.md) | Binary Search | 🟡 | Modified binary search |
| 19 | [Subsets](./backtracking/problems/02-subsets.md) | Backtracking | 🟡 | Backtracking template |
| 20 | [Permutations](./backtracking/problems/03-permutations.md) | Backtracking | 🟡 | Backtracking swap pattern |
| 21 | [House Robber](./dp/problems/04-house-robber.md) | DP | 🟡 | Linear DP, include/exclude pattern |
| 22 | [Maximum Subarray](./dp/problems/03-maximum-subarray.md) | DP/Kadane | 🟡 | Kadane's algorithm |
| 23 | [Word Search](./backtracking/problems/06-word-search.md) | Backtracking | 🟡 | Grid + backtracking combo |
| 24 | [Container With Most Water](./array/problems/18-container-with-most-water.md) | Two Pointers | 🟡 | Greedy + two pointers |
| 25 | [Trapping Rain Water](./array/problems/20-trapping-rain-water.md) | Two Pointers | 🔴 | Hard classic, đa dạng approaches |

### ⭐ Tier 2 — High Value (Gặp 40-70% interviews) — Làm tiếp

Thêm 25 bài nữa cho solid coverage. Làm sau khi master Tier 1.

| # | Problem | Pattern | Diff |
|---|---------|---------|------|
| 26 | [Symmetric Tree](./tree-graph/problems/04-symmetric-tree.md) | DFS | 🟢 |
| 27 | [Min Stack](./design/problems/01-min-stack.md) | Stack+Design | 🟡 |
| 28 | [Generate Parentheses](./backtracking/problems/04-generate-parentheses.md) | Backtracking | 🟡 |
| 29 | [Meeting Rooms II](./array/problems/22-meeting-rooms-ii.md) | Interval+Heap | 🟡 |
| 30 | [Longest Increasing Subsequence](./dp/problems/08-longest-increasing-subsequence.md) | DP | 🟡 |
| 31 | [Kth Smallest in BST](./tree-graph/problems/10-kth-smallest-element-in-a-bst.md) | BST | 🟡 |
| 32 | [Combination Sum](./backtracking/problems/05-combination-sum.md) | Backtracking | 🟡 |
| 33 | [Unique Paths](./dp/problems/06-unique-paths.md) | DP | 🟡 |
| 34 | [Find K Largest](./sorting-searching/problems/02-find-k-largest-elements.md) | Heap | 🟡 |
| 35 | [Insert Delete GetRandom O(1)](./design/problems/05-insert-delete-getrandom-o1.md) | Design | 🟡 |
| 36 | [Lowest Common Ancestor](./tree-graph/problems/16-lowest-common-ancestor-binary-tree.md) | DFS | 🟡 |
| 37 | [Course Schedule II](./tree-graph/problems/15-course-schedule-ii.md) | Topological Sort | 🟡 |
| 38 | [Remove Nth from End](./linked-list/problems/04-remove-nth-node-from-end-of-list.md) | Linked List | 🟡 |
| 39 | [Rotate Image](./array/problems/11-rotate-image.md) | Matrix | 🟡 |
| 40 | [Set Matrix Zeroes](./array/problems/13-set-matrix-zeroes.md) | Matrix | 🟡 |
| 41 | [Jump Game](./dp/problems/05-jump-game.md) | Greedy/DP | 🟡 |
| 42 | [Letter Combinations Phone](./backtracking/problems/01-letter-combinations-of-a-phone-number.md) | Backtracking | 🟡 |
| 43 | [Design Hit Counter](./design/problems/07-design-hit-counter.md) | Design | 🟡 |
| 44 | [Insert Interval](./array/problems/23-insert-interval.md) | Interval | 🟡 |
| 45 | [Longest Common Subsequence](./dp/problems/09-longest-common-subsequence.md) | DP | 🟡 |
| 46 | [Edit Distance](./dp/problems/10-edit-distance.md) | DP | 🔴 |
| 47 | [Word Ladder](./tree-graph/problems/13-word-ladder.md) | BFS | 🔴 |
| 48 | [Binary Tree Max Path Sum](./tree-graph/problems/17-binary-tree-maximum-path-sum.md) | DFS | 🔴 |
| 49 | [N-Queens](./backtracking/problems/07-n-queens.md) | Backtracking | 🔴 |
| 50 | [Serialize/Deserialize BT](./tree-graph/problems/14-serialize-deserialize-binary-tree.md) | BFS/DFS | 🔴 |

### 📘 Tier 3 — Practice Depth (Gặp <40%) — Nếu còn thời gian

Còn lại 83 bài trong repo. Ưu tiên nếu target company hay hỏi category cụ thể (e.g., Google yêu thích graph, Grab yêu thích design).

---

## Pattern Mastery Checklist / Checklist Theo Pattern

Mỗi pattern, bạn cần giải được ít nhất số bài minimum trước khi chuyển sang pattern tiếp theo:

```
Pattern Mastery Checklist:
┌────────────────────┬─────────┬───────────┬────────────────────────┐
│ Pattern            │ Minimum │ Repo Has  │ Key Problem to Solve   │
├────────────────────┼─────────┼───────────┼────────────────────────┤
│ Hash Map           │ 3 bài   │ 8 bài     │ Two Sum ← MUST        │
│ Two Pointers       │ 4 bài   │ 9 bài     │ 3Sum ← MUST           │
│ Sliding Window     │ 3 bài   │ 6 bài     │ Longest Substring ← MUST│
│ Binary Search      │ 3 bài   │ 5 bài     │ Search Rotated ← MUST │
│ BFS/DFS Tree       │ 5 bài   │ 14 bài    │ Level Order ← MUST    │
│ BFS/DFS Graph      │ 3 bài   │ 4 bài     │ Number of Islands ← MUST│
│ DP                 │ 5 bài   │ 12 bài    │ Coin Change ← MUST    │
│ Backtracking       │ 3 bài   │ 11 bài    │ Subsets ← MUST        │
│ Linked List        │ 3 bài   │ 11 bài    │ Reverse LL ← MUST     │
│ Stack/Queue        │ 3 bài   │ 10 bài    │ Valid Parentheses ← MUST│
│ Interval           │ 2 bài   │ 4 bài     │ Merge Intervals ← MUST│
│ Design             │ 2 bài   │ 11 bài    │ LRU Cache ← MUST      │
└────────────────────┴─────────┴───────────┴────────────────────────┘
Total minimum: ~39 bài → cover mọi pattern
```

---

## Visual: Pattern Recognition Flowchart / Sơ Đồ Nhận Dạng Pattern

```
                        ┌─────────────┐
                        │ Đọc đề bài  │
                        └──────┬──────┘
                               │
                 ┌─────────────┴─────────────┐
                 │ Input là gì?               │
                 └─────────────┬─────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                   │
      ┌─────▼─────┐    ┌──────▼──────┐    ┌──────▼──────┐
      │Array/String│    │ Tree/Graph  │    │ Number/Math │
      └─────┬─────┘    └──────┬──────┘    └──────┬──────┘
            │                  │                   │
     ┌──────┼──────┐    ┌─────┼──────┐      Bit / Math
     │      │      │    │            │
  Sorted? Subarray? Intervals?  Tree?    Graph?
     │      │      │    │            │
     ▼      ▼      ▼    ▼            ▼
  Two Ptr  Sliding  Sort  DFS/BFS   BFS/DFS
  Binary   Window  +Merge Recursion  Topo Sort
  Search                             Union-Find

     Hỏi "Tìm tất cả..."? → Backtracking
     Hỏi "Min/Max/Count"? → DP
     Hỏi "Design..."?     → HashMap + LinkedList combo
     Hỏi "Next greater"?  → Monotonic Stack
```

---

## Weekly Study Plan / Lịch Ôn Tuần

### 4-Week Intensive (2-3 giờ/ngày)

```
Week 1: Foundation Patterns
├── Mon: Hash Map (Two Sum, Contains Duplicate, Valid Anagram)
├── Tue: Two Pointers (Valid Palindrome, 3Sum, Container With Most Water)
├── Wed: Sliding Window (Longest Substring, Find All Anagrams)
├── Thu: Stack/Queue (Valid Parentheses, Min Stack)
├── Fri: Linked List (Reverse, Merge Two, Remove Nth)
├── Sat: Review all Week 1 — redo bài nào không nhớ
└── Sun: REST

Week 2: Tree & Graph
├── Mon: DFS basics (Max Depth, Symmetric, Validate BST)
├── Tue: BFS (Level Order, Zigzag, Right Side View)
├── Wed: BST (Kth Smallest, LCA, Sorted Array to BST)
├── Thu: Graph BFS/DFS (Number of Islands, Course Schedule)
├── Fri: Advanced Tree (Max Path Sum, Serialize/Deserialize)
├── Sat: Review Week 2
└── Sun: REST

Week 3: DP & Backtracking
├── Mon: DP intro (Climbing Stairs, House Robber, Max Subarray)
├── Tue: DP medium (Coin Change, LIS, Unique Paths)
├── Wed: DP hard (Edit Distance, LCS, Word Break)
├── Thu: Backtracking intro (Subsets, Permutations, Combination Sum)
├── Fri: Backtracking medium (Generate Parentheses, Word Search, N-Queens)
├── Sat: Review Week 3
└── Sun: REST

Week 4: Advanced + Mock
├── Mon: Binary Search (First Bad Version, Search Rotated, Median 2 Arrays)
├── Tue: Intervals + Design (Merge Intervals, Meeting Rooms II, LRU Cache)
├── Wed: Hard problems (Trapping Rain Water, Binary Tree Max Path Sum)
├── Thu: Mock coding round #1 (45 min, random Tier 1 problem)
├── Fri: Mock coding round #2 (45 min, random Tier 2 problem)
├── Sat: Full review — redo all "weak" problems
└── Sun: REST before interviews
```

---

## Missing Problems — Cần Bổ Sung / Gaps to Fill

Các bài **hay gặp trong interview** mà repo chưa có:

| Priority | Problem | Pattern | Difficulty | Why Important |
|----------|---------|---------|-----------|---------------|
| 🔥 High | Group Anagrams | Hash Map | 🟡 | Top 10 most asked |
| 🔥 High | Top K Frequent Elements | Heap/Bucket | 🟡 | Heap pattern essential |
| 🔥 High | Merge K Sorted Lists | Heap+LL | 🔴 | Combines 2 patterns |
| 🔥 High | Clone Graph | BFS/DFS | 🟡 | Graph traversal + copy |
| 🔥 High | Daily Temperatures | Monotonic Stack | 🟡 | Stack pattern missing |
| 🔥 High | Longest Palindromic Substring | DP/Expand | 🟡 | String DP essential |
| ⭐ Med | Spiral Matrix | Matrix | 🟡 | Matrix traversal |
| ⭐ Med | Find Min in Rotated Array | Binary Search | 🟡 | BS variant |
| ⭐ Med | Path Sum I/II | DFS | 🟢/🟡 | Tree path classic |
| ⭐ Med | Task Scheduler | Greedy/Heap | 🟡 | Greedy + counting |
| ⭐ Med | Gas Station | Greedy | 🟡 | Greedy pattern |
| ⭐ Med | Largest Rectangle Histogram | Stack | 🔴 | Hard stack classic |
| ⭐ Med | Partition Equal Subset Sum | DP | 🟡 | 0/1 Knapsack DP |
| 📘 Low | Implement Trie | Design | 🟡 | Trie data structure |
| 📘 Low | Binary Tree Right Side View | BFS | 🟡 | BFS variant |
| 📘 Low | Pacific Atlantic Water Flow | BFS/DFS | 🟡 | Multi-source BFS |

---

## Connections / Liên Kết

- 🔗 **Pattern Details**: [Patterns Index](./00-patterns-index.md) — all 12 patterns with problem tables
- 🔗 **How to Solve**: [Problem-Solving Meta Guide](../fe-track/13-coding-practice/00-problem-solving-meta-guide.md) — UNPACK method
- 🔗 **Theory**: [Algorithms](../shared/01-cs-fundamentals/algorithms-theory.md) | [Data Structures](../shared/01-cs-fundamentals/data-structures-theory.md)
- 🔗 **Mock Practice**: [Coding Round Mock](../fe-track/14-mock-interview/01-coding-round.md)
- 🔗 **L5 Framework**: [Problem-Solving Frameworks](../shared/08-l5-competencies/02-problem-solving-frameworks.md)
