---
layout: page
title: "Restore the Array From Adjacent Pairs"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/restore-the-array-from-adjacent-pairs"
---

# Restore the Array From Adjacent Pairs / Restore the Array From Adjacent Pairs

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Accounts Merge](https://leetcode.com/problems/accounts-merge) | [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đi trong mê cung — bạn đi sâu hết một ngõ, nếu cụt thì quay lại ngã rẽ gần nhất chưa thử.

**Pattern Recognition:**

- Signal: "traverse tree/graph" + "all paths" → **DFS**
- Bài này thuộc dạng DFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Restore the Array From Adjacent Pairs example:**

```
       root
      /    \
     A      B
    / \      \
   C   D      E

DFS: root → A → C → D → B → E
Use: recursion or explicit stack
```

---

## Problem Description

Restore the Array From Adjacent Pairs. ([LeetCode](https://leetcode.com/problems/restore-the-array-from-adjacent-pairs))

Difficulty: Medium | Acceptance: 74.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/restore-the-array-from-adjacent-pairs) for full constraints

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
function restoreTheArrayFromAdjacentPairsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — DFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function restoreTheArrayFromAdjacentPairs(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using DFS
  // Hint: Use recursion or stack, track visited nodes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(restoreTheArrayFromAdjacentPairs(/* example 1 */)); // expected
// console.log(restoreTheArrayFromAdjacentPairs(/* example 2 */)); // expected
// console.log(restoreTheArrayFromAdjacentPairs(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Accounts Merge](https://leetcode.com/problems/accounts-merge) — same pattern: Union Find
- [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) — same pattern: Union Find
- [Employee Importance](https://leetcode.com/problems/employee-importance) — same pattern: BFS
- [Smallest Common Region](https://leetcode.com/problems/smallest-common-region) — same pattern: BFS
- [Restore the Array From Adjacent Pairs — LeetCode](https://leetcode.com/problems/restore-the-array-from-adjacent-pairs) — problem page
