---
layout: page
title: "Lexicographically Smallest String After Applying Operations"
difficulty: Medium
category: Tree-Graph
tags: [String, Depth-First Search, Breadth-First Search, Enumeration]
leetcode_url: "https://leetcode.com/problems/lexicographically-smallest-string-after-applying-operations"
---

# Lexicographically Smallest String After Applying Operations / Lexicographically Smallest String After Applying Operations

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như ném đá xuống ao — sóng lan ra theo từng vòng đều đặn. Khám phá hết tất cả ở khoảng cách 1, rồi mới sang khoảng cách 2.

**Pattern Recognition:**

- Signal: "shortest path (unweighted)" + "level-order" → **BFS**
- Bài này thuộc dạng BFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Lexicographically Smallest String After Applying Operations example:**

```
Level 0:     [root]
Level 1:   [A, B]
Level 2: [C, D, E]

BFS: process level by level using queue
```

---

## Problem Description

Lexicographically Smallest String After Applying Operations. ([LeetCode](https://leetcode.com/problems/lexicographically-smallest-string-after-applying-operations))

Difficulty: Medium | Acceptance: 65.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/lexicographically-smallest-string-after-applying-operations) for full constraints

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
function lexicographicallySmallestStringAfterApplyingOperationsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — BFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function lexicographicallySmallestStringAfterApplyingOperations(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using BFS
  // Hint: Use queue, process level by level
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(lexicographicallySmallestStringAfterApplyingOperations(/* example 1 */)); // expected
// console.log(lexicographicallySmallestStringAfterApplyingOperations(/* example 2 */)); // expected
// console.log(lexicographicallySmallestStringAfterApplyingOperations(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) — same pattern: BFS
- [Accounts Merge](https://leetcode.com/problems/accounts-merge) — same pattern: Union Find
- [Web Crawler](https://leetcode.com/problems/web-crawler) — same pattern: BFS
- [Lexicographically Smallest String After Applying Operations — LeetCode](https://leetcode.com/problems/lexicographically-smallest-string-after-applying-operations) — problem page
