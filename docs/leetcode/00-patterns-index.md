# LeetCode Patterns Index / Chỉ Mục Theo Pattern

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **L5 Competencies**: Problem-Solving (15pts), Technical Mastery (20pts)
> **See also**: [LeetCode Index](./index.md) | [Algorithms Theory](../shared/01-cs-fundamentals/algorithms-theory.md) | [Data Structures Theory](../shared/01-cs-fundamentals/data-structures-theory.md)

---

## Tại Sao Học Theo Pattern? / Why Learn by Pattern?

Phỏng vấn không test bạn nhớ bài nào — mà test bạn **nhận ra pattern** và áp dụng. 133 bài dưới đây được nhóm theo 12 algorithmic patterns. Mỗi pattern là một "công cụ tư duy" — khi thấy dấu hiệu, bạn biết ngay dùng pattern nào.

> 🎯 **Interview tip**: Khi gặp bài mới, hãy hỏi: "Bài này thuộc pattern nào?" trước khi code.

---

## Pattern 1: Two Pointers / Hai Con Trỏ 🟢→🟡

**Khi nào dùng**: Sorted array, tìm pair thỏa điều kiện, so sánh 2 phần tử
**Dấu hiệu**: "sorted", "pair", "two elements", "in-place"

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | [Two Sum](./array/problems/04-two-sum.md) | 🟢 Easy | array |
| 2 | [Remove Duplicates](./array/problems/01-remove-duplicates-from-sorted-array.md) | 🟢 Easy | array |
| 3 | [Move Zeroes](./array/problems/09-move-zeroes.md) | 🟢 Easy | array |
| 4 | [Valid Palindrome](./string/problems/05-valid-palindrome.md) | 🟢 Easy | string |
| 5 | [3Sum](./array/problems/12-3sum.md) | 🟡 Medium | array |
| 6 | [Container With Most Water](./array/problems/18-container-with-most-water.md) | 🟡 Medium | array |
| 7 | [3Sum Closest](./array/problems/24-three-sum-closest.md) | 🟡 Medium | array |
| 8 | [Trapping Rain Water](./array/problems/20-trapping-rain-water.md) | 🔴 Hard | array |
| 9 | [Two Pointers Sorted](./array/problems/28-two-pointers-sorted.md) | 🟡 Medium | array |

**📚 Theory**: [Algorithms Theory — Search & Sort](../shared/01-cs-fundamentals/algorithms-theory.md)

---

## Pattern 2: Sliding Window / Cửa Sổ Trượt 🟡→🔴

**Khi nào dùng**: Substring/subarray liên tục, tối ưu window size
**Dấu hiệu**: "contiguous", "substring", "subarray", "window", "at most k"

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | [Longest Substring Without Repeating](./string/problems/10-longest-substring-without-repeating-characters.md) | 🟡 Medium | string |
| 2 | [Find All Anagrams](./string/problems/19-find-all-anagrams-in-string.md) | 🟡 Medium | string |
| 3 | [Longest Substring with At Most K Distinct](./string/problems/18-longest-substring-with-at-most-k-distinct.md) | 🟡 Medium | string |
| 4 | [Sliding Window Fixed](./array/problems/27-sliding-window-fixed.md) | 🟡 Medium | array |
| 5 | [Minimum Window Substring](./string/problems/15-minimum-window-substring.md) | 🔴 Hard | string |
| 6 | [Sliding Window Maximum](./string/problems/17-sliding-window-maximum.md) | 🔴 Hard | string |

**📚 Theory**: [Algorithms Theory](../shared/01-cs-fundamentals/algorithms-theory.md)

---

## Pattern 3: Binary Search / Tìm Kiếm Nhị Phân 🟢→🔴

**Khi nào dùng**: Sorted data, tìm boundary, minimize/maximize
**Dấu hiệu**: "sorted", "search", "find minimum", "rotated"

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | [First Bad Version](./sorting-searching/problems/02-first-bad-version.md) | 🟢 Easy | sorting |
| 2 | [Merge Sorted Array](./sorting-searching/problems/01-merge-sorted-array.md) | 🟢 Easy | sorting |
| 3 | [Search in Rotated Sorted Array](./sorting-searching/problems/03-search-in-rotated-sorted-array.md) | 🟡 Medium | sorting |
| 4 | [Find K Largest](./sorting-searching/problems/02-find-k-largest-elements.md) | 🟡 Medium | sorting |
| 5 | [Median of Two Sorted Arrays](./sorting-searching/problems/04-median-of-two-sorted-arrays.md) | 🔴 Hard | sorting |

**📚 Theory**: [Algorithms Theory — Binary Search](../shared/01-cs-fundamentals/algorithms-theory.md)

---

## Pattern 4: BFS/DFS — Graph & Tree Traversal 🟡→🔴

**Khi nào dùng**: Tree/graph traversal, level-order, connected components, shortest path
**Dấu hiệu**: "tree", "graph", "level order", "island", "connected", "path"

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | [Max Depth of Binary Tree](./tree-graph/problems/01-maximum-depth-of-binary-tree.md) | 🟢 Easy | tree |
| 2 | [Symmetric Tree](./tree-graph/problems/04-symmetric-tree.md) | 🟢 Easy | tree |
| 3 | [Level Order Traversal](./tree-graph/problems/03-binary-tree-level-order-traversal.md) | 🟡 Medium | tree |
| 4 | [Validate BST](./tree-graph/problems/02-validate-binary-search-tree.md) | 🟡 Medium | tree |
| 5 | [Number of Islands](./tree-graph/problems/12-number-of-islands.md) | 🟡 Medium | graph |
| 6 | [Course Schedule II](./tree-graph/problems/15-course-schedule-ii.md) | 🟡 Medium | graph |
| 7 | [Word Ladder](./tree-graph/problems/13-word-ladder.md) | 🔴 Hard | graph |
| 8 | [Serialize/Deserialize Binary Tree](./tree-graph/problems/14-serialize-deserialize-binary-tree.md) | 🔴 Hard | tree |
| 9 | [Alien Dictionary](./tree-graph/problems/18-alien-dictionary.md) | 🔴 Hard | graph |
| 10 | [Binary Tree Max Path Sum](./tree-graph/problems/17-binary-tree-maximum-path-sum.md) | 🔴 Hard | tree |
| 11 | [Clone Graph](./tree-graph/problems/19-clone-graph.md) | 🟡 Medium | graph |

**📚 Theory**: [Data Structures — Trees & Graphs](../shared/01-cs-fundamentals/data-structures-theory.md)

---

## Pattern 5: Dynamic Programming / Quy Hoạch Động 🟡→🔴

**Khi nào dùng**: Overlapping subproblems, optimal substructure, counting paths
**Dấu hiệu**: "minimum/maximum", "how many ways", "can you reach", "longest/shortest"

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | [Climbing Stairs](./dp/problems/01-climbing-stairs.md) | 🟢 Easy | dp |
| 2 | [Best Time to Buy/Sell Stock](./dp/problems/02-best-time-to-buy-and-sell-stock.md) | 🟢 Easy | dp |
| 3 | [Maximum Subarray](./dp/problems/03-maximum-subarray.md) | 🟡 Medium | dp |
| 4 | [House Robber](./dp/problems/04-house-robber.md) | 🟡 Medium | dp |
| 5 | [Coin Change](./dp/problems/07-coin-change.md) | 🟡 Medium | dp |
| 6 | [Unique Paths](./dp/problems/06-unique-paths.md) | 🟡 Medium | dp |
| 7 | [Longest Increasing Subsequence](./dp/problems/08-longest-increasing-subsequence.md) | 🟡 Medium | dp |
| 8 | [Longest Common Subsequence](./dp/problems/09-longest-common-subsequence.md) | 🟡 Medium | dp |
| 9 | [Word Break](./string/problems/20-word-break.md) | 🟡 Medium | string/dp |
| 10 | [Longest Palindromic Substring](./string/problems/23-longest-palindromic-substring.md) | 🟡 Medium | string/dp |
| 11 | [Edit Distance](./dp/problems/10-edit-distance.md) | 🔴 Hard | dp |
| 12 | [Regular Expression Matching](./dp/problems/11-regular-expression-matching.md) | 🔴 Hard | dp |

**📚 Theory**: [Algorithms Theory — DP](../shared/01-cs-fundamentals/algorithms-theory.md)

---

## Pattern 6: Backtracking / Quay Lui 🟡→🔴

**Khi nào dùng**: Generate all combinations/permutations, constraint satisfaction
**Dấu hiệu**: "all combinations", "all permutations", "generate all", "valid configurations"

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | [Subsets](./backtracking/problems/02-subsets.md) | 🟡 Medium | backtracking |
| 2 | [Permutations](./backtracking/problems/03-permutations.md) | 🟡 Medium | backtracking |
| 3 | [Letter Combinations](./backtracking/problems/01-letter-combinations-of-a-phone-number.md) | 🟡 Medium | backtracking |
| 4 | [Generate Parentheses](./backtracking/problems/04-generate-parentheses.md) | 🟡 Medium | backtracking |
| 5 | [Combination Sum](./backtracking/problems/05-combination-sum.md) | 🟡 Medium | backtracking |
| 6 | [Word Search](./backtracking/problems/06-word-search.md) | 🟡 Medium | backtracking |
| 7 | [Palindrome Partitioning](./backtracking/problems/10-palindrome-partitioning.md) | 🟡 Medium | backtracking |
| 8 | [N-Queens](./backtracking/problems/07-n-queens.md) | 🔴 Hard | backtracking |
| 9 | [Sudoku Solver](./backtracking/problems/08-sudoku-solver.md) | 🔴 Hard | backtracking |
| 10 | [Word Search II](./backtracking/problems/09-word-search-ii.md) | 🔴 Hard | backtracking |

**📚 Theory**: [Algorithms Theory — Backtracking](../shared/01-cs-fundamentals/algorithms-theory.md)

---

## Pattern 7: Linked List Techniques 🟢→🔴

**Khi nào dùng**: In-place reversal, fast/slow pointers, merge operations
**Dấu hiệu**: "linked list", "reverse", "cycle", "merge", "nth from end"

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | [Reverse Linked List](./linked-list/problems/01-reverse-linked-list.md) | 🟢 Easy | linked-list |
| 2 | [Merge Two Sorted Lists](./linked-list/problems/02-merge-two-sorted-lists.md) | 🟢 Easy | linked-list |
| 3 | [Palindrome Linked List](./linked-list/problems/03-palindrome-linked-list.md) | 🟢 Easy | linked-list |
| 4 | [Linked List Cycle](./linked-list/problems/06-linked-list-cycle.md) | 🟢 Easy | linked-list |
| 5 | [Remove Nth Node from End](./linked-list/problems/04-remove-nth-node-from-end-of-list.md) | 🟡 Medium | linked-list |
| 6 | [Add Two Numbers](./linked-list/problems/07-add-two-numbers.md) | 🟡 Medium | linked-list |
| 7 | [Copy List with Random Pointer](./linked-list/problems/11-copy-list-with-random-pointer.md) | 🟡 Medium | linked-list |
| 8 | [Merge K Sorted Lists](./linked-list/problems/12-merge-k-sorted-lists.md) | 🔴 Hard | linked-list |

**📚 Theory**: [Data Structures — Linked Lists](../shared/01-cs-fundamentals/data-structures-theory.md)

---

## Pattern 8: Stack & Queue / Ngăn Xếp & Hàng Đợi 🟢→🟡

**Khi nào dùng**: Matching brackets, monotonic stack, BFS with queue
**Dấu hiệu**: "valid parentheses", "next greater", "implement queue/stack"

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | [Valid Parentheses](./others/problems/01-valid-parentheses.md) | 🟢 Easy | others |
| 2 | [Min Stack](./others/problems/04-min-stack.md) | 🟡 Medium | others |
| 3 | [Implement Queue Using Stacks](./others/problems/02-implement-queue-using-stacks.md) | 🟢 Easy | others |
| 4 | [Implement Stack Using Queues](./others/problems/03-implement-stack-using-queues.md) | 🟢 Easy | others |
| 5 | [Design Circular Queue](./others/problems/07-design-circular-queue.md) | 🟡 Medium | others |
| 6 | [Daily Temperatures](./others/problems/11-daily-temperatures.md) | 🟡 Medium | others |

**📚 Theory**: [Data Structures — Stacks & Queues](../shared/01-cs-fundamentals/data-structures-theory.md)

---

## Pattern 9: Hash Map / Bảng Băm 🟢→🟡

**Khi nào dùng**: Counting, grouping, lookup O(1), duplicate detection
**Dấu hiệu**: "frequency", "group", "contains duplicate", "anagram"

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | [Contains Duplicate](./array/problems/05-contains-duplicate.md) | 🟢 Easy | array |
| 2 | [Single Number](./array/problems/06-single-number.md) | 🟢 Easy | array |
| 3 | [Valid Anagram](./string/problems/04-valid-anagram.md) | 🟢 Easy | string |
| 4 | [First Unique Character](./string/problems/03-first-unique-character-in-a-string.md) | 🟢 Easy | string |
| 5 | [Group Anagrams](./string/problems/09-group-anagrams.md) | 🟡 Medium | string |
| 6 | [Top K Frequent Elements](./array/problems/29-top-k-frequent-elements.md) | 🟡 Medium | array |
| 7 | [Intersection of Two Arrays II](./array/problems/07-intersection-of-two-arrays-ii.md) | 🟢 Easy | array |
| 8 | [Product of Array Except Self](./array/problems/17-product-of-array-except-self.md) | 🟡 Medium | array |

**📚 Theory**: [Data Structures — Hash Tables](../shared/01-cs-fundamentals/data-structures-theory.md)

---

## Pattern 10: Interval / Khoảng 🟡→🔴

**Khi nào dùng**: Merging, inserting, scheduling intervals
**Dấu hiệu**: "intervals", "merge", "meeting rooms", "overlap"

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | [Merge Intervals](./array/problems/19-merge-intervals.md) | 🟡 Medium | array |
| 2 | [Meeting Rooms II](./array/problems/22-meeting-rooms-ii.md) | 🟡 Medium | array |
| 3 | [Insert Interval](./array/problems/23-insert-interval.md) | 🟡 Medium | array |

**📚 Theory**: [Algorithms Theory — Greedy/Interval](../shared/01-cs-fundamentals/algorithms-theory.md)

---

## Pattern 11: Design / Thiết Kế 🟡→🔴

**Khi nào dùng**: OOP design, data structure design, system component design
**Dấu hiệu**: "design a", "implement a", "LRU cache", "serialize"

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | [LRU Cache](./design/problems/09-lru-cache.md) | 🟡 Medium | design |
| 2 | [Design Hit Counter](./design/problems/07-design-hit-counter.md) | 🟡 Medium | design |
| 3 | [Insert Delete GetRandom O(1)](./design/problems/05-insert-delete-getrandom-o1.md) | 🟡 Medium | design |
| 4 | [Design Tic-Tac-Toe](./design/problems/06-design-tic-tac-toe.md) | 🟡 Medium | design |
| 5 | [Design Twitter](./design/problems/10-design-twitter.md) | 🟡 Medium | design |
| 6 | [Design Browser History](./others/problems/10-design-browser-history.md) | 🟡 Medium | others |

**📚 Theory**: [System Design Theory](../shared/02-system-design/system-design-theory.md) | [FE Architecture](../fe-track/08-fe-system-design/01-architecture-patterns.md)

---

## Pattern 12: Matrix / Ma Trận 🟡→🔴

**Khi nào dùng**: 2D grid traversal, rotation, search
**Dấu hiệu**: "matrix", "grid", "rotate", "set zeroes"

| # | Problem | Difficulty | Category |
|---|---------|-----------|----------|
| 1 | [Valid Sudoku](./array/problems/10-valid-sudoku.md) | 🟡 Medium | array |
| 2 | [Rotate Image](./array/problems/11-rotate-image.md) | 🟡 Medium | array |
| 3 | [Set Matrix Zeroes](./array/problems/13-set-matrix-zeroes.md) | 🟡 Medium | array |

**📚 Theory**: [Algorithms Theory — Matrix](../shared/01-cs-fundamentals/algorithms-theory.md)

---

## Study Strategy / Chiến Lược Học

### By Level / Theo Cấp Độ

| Level | Patterns to Master | Target |
|-------|-------------------|--------|
| 🟢 L3 Junior | Two Pointers, Hash Map, Stack/Queue, Linked List basics | 30 problems |
| 🟡 L4 Mid | Sliding Window, Binary Search, BFS/DFS, DP basics, Backtracking | 50 problems |
| 🔴 L5 Senior | Advanced DP, Design, Interval, all Hard problems | 30+ problems |

### Pattern Recognition Flow / Luồng Nhận Dạng

```
Bài mới → Đọc đề →
├── Sorted? → Two Pointers hoặc Binary Search
├── Substring/Subarray? → Sliding Window
├── Tree/Graph? → BFS/DFS
├── "How many ways" / "Min/Max"? → DP
├── "All combinations"? → Backtracking
├── Linked list? → Fast/Slow pointers hoặc Reversal
├── Matching/Pairing? → Stack hoặc Hash Map
├── Intervals? → Sort + Merge
├── "Design a..."? → OOP Design pattern
└── 2D grid? → Matrix traversal (BFS/DFS on grid)
```

---

## Connections / Liên Kết

- ⬅️ **Theory**: [Algorithms](../shared/01-cs-fundamentals/algorithms-theory.md) | [Data Structures](../shared/01-cs-fundamentals/data-structures-theory.md) | [Complexity Analysis](../shared/01-cs-fundamentals/complexity-analysis.md)
- 🔗 **FE Practice**: [Coding Practice](../fe-track/13-coding-practice/) | [JS Data Structures](../fe-track/09-advanced-topics/)
- 🔗 **BE Practice**: [Go Data Structures](../be-track/01-golang/06-data-structures-go.md) | [Go Algorithms](../be-track/01-golang/07-algorithms-go.md)
