---
layout: page
title: "Smallest Range Covering Elements from K Lists"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Hash Table, Greedy, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists"
---

# Smallest Range Covering Elements from K Lists / Smallest Range Covering Elements from K Lists

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Task Scheduler](https://leetcode.com/problems/task-scheduler) | [Reduce Array Size to The Half](https://leetcode.com/problems/reduce-array-size-to-the-half)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như nhìn qua một khung cửa sổ di chuyển trên dãy nhà. Mỗi lần trượt, bạn thêm nhà mới bên phải, bỏ nhà cũ bên trái — luôn giữ đúng kích thước khung.

**Pattern Recognition:**

- Signal: "contiguous subarray/substring" + "max/min length" → **Sliding Window**
- Bài này thuộc dạng Sliding Window — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Smallest Range Covering Elements from K Lists example:**

```
[a, b, c, d, e, f, g]
 |--window--|
    |--window--|     → slide right, update state

Track: current window state
Update: add right, remove left when window exceeds constraint
```

---

## Problem Description

Smallest Range Covering Elements from K Lists. ([LeetCode](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists))

Difficulty: Hard | Acceptance: 69.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Cần contiguous subarray hay subsequence?" / Subarray (contiguous) vs subsequence (non-contiguous)
2. **Brute force**: "Thử mọi subarray O(n²)" → optimize with sliding window O(n) / Try all subarrays then optimize
3. **Optimize**: "Dùng window expand/shrink, track state bằng map/counter" / Use expand right, shrink left pattern
4. **Edge cases**: "Chuỗi rỗng, k > array length, tất cả unique/duplicate" / Empty input, k exceeds length

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function smallestRangeCoveringElementsFromKListsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Sliding Window
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function smallestRangeCoveringElementsFromKLists(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Sliding Window
  // Hint: Expand right pointer, shrink left when constraint violated
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(smallestRangeCoveringElementsFromKLists(/* example 1 */)); // expected
// console.log(smallestRangeCoveringElementsFromKLists(/* example 2 */)); // expected
// console.log(smallestRangeCoveringElementsFromKLists(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [Reduce Array Size to The Half](https://leetcode.com/problems/reduce-array-size-to-the-half) — same pattern: Heap / Priority Queue
- [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words) — same pattern: Trie
- [Reorganize String](https://leetcode.com/problems/reorganize-string) — same pattern: Heap / Priority Queue
- [Smallest Range Covering Elements from K Lists — LeetCode](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) — problem page
