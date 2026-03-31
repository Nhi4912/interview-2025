---
layout: page
title: "Smallest String With Swaps"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, String, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/smallest-string-with-swaps"
---

# Smallest String With Swaps / Smallest String With Swaps

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Accounts Merge](https://leetcode.com/problems/accounts-merge) | [Similar String Groups](https://leetcode.com/problems/similar-string-groups)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Smallest String With Swaps example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Smallest String With Swaps. ([LeetCode](https://leetcode.com/problems/smallest-string-with-swaps))

Difficulty: Medium | Acceptance: 59.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/smallest-string-with-swaps) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Xác nhận input constraints, edge cases" / Confirm input size, types, edge cases with interviewer
2. **Brute force**: "Bắt đầu từ brute force, rồi optimize" / Always start with naive approach, then optimize
3. **Optimize**: "Phân tích bottleneck của brute force, tìm cách giảm" / Identify the bottleneck and reduce it
4. **Edge cases**: "Input rỗng, một phần tử, giá trị cực biên" / Empty input, single element, boundary values
5. **Follow-up**: "Nếu input rất lớn? Nếu cần streaming?" / What if input is huge? What about streaming?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function smallestStringWithSwapsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function smallestStringWithSwaps(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(smallestStringWithSwaps(/* example 1 */)); // expected
// console.log(smallestStringWithSwaps(/* example 2 */)); // expected
// console.log(smallestStringWithSwaps(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Accounts Merge](https://leetcode.com/problems/accounts-merge) — same pattern: Union Find
- [Similar String Groups](https://leetcode.com/problems/similar-string-groups) — same pattern: Union Find
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) — same pattern: Union Find
- [Smallest String With Swaps — LeetCode](https://leetcode.com/problems/smallest-string-with-swaps) — problem page
