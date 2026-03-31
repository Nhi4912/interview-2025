---
layout: page
title: "Most Stones Removed with Same Row or Column"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Depth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column"
---

# Most Stones Removed with Same Row or Column / Most Stones Removed with Same Row or Column

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) | [Minimize Malware Spread II](https://leetcode.com/problems/minimize-malware-spread-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Most Stones Removed with Same Row or Column example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Most Stones Removed with Same Row or Column. ([LeetCode](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column))

Difficulty: Medium | Acceptance: 62.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column) for full constraints

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
function mostStonesRemovedWithSameRowOrColumnBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function mostStonesRemovedWithSameRowOrColumn(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(mostStonesRemovedWithSameRowOrColumn(/* example 1 */)); // expected
// console.log(mostStonesRemovedWithSameRowOrColumn(/* example 2 */)); // expected
// console.log(mostStonesRemovedWithSameRowOrColumn(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) — same pattern: Union Find
- [Minimize Malware Spread II](https://leetcode.com/problems/minimize-malware-spread-ii) — same pattern: Union Find
- [Reachable Nodes With Restrictions](https://leetcode.com/problems/reachable-nodes-with-restrictions) — same pattern: Union Find
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Most Stones Removed with Same Row or Column — LeetCode](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column) — problem page
