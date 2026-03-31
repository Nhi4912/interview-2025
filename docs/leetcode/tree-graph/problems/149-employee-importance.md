---
layout: page
title: "Employee Importance"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, Tree, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/employee-importance"
---

# Employee Importance / Employee Importance

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Smallest Common Region](https://leetcode.com/problems/smallest-common-region) | [Operations on Tree](https://leetcode.com/problems/operations-on-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như ném đá xuống ao — sóng lan ra theo từng vòng đều đặn. Khám phá hết tất cả ở khoảng cách 1, rồi mới sang khoảng cách 2.

**Pattern Recognition:**

- Signal: "shortest path (unweighted)" + "level-order" → **BFS**
- Bài này thuộc dạng BFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Employee Importance example:**

```
Level 0:     [root]
Level 1:   [A, B]
Level 2: [C, D, E]

BFS: process level by level using queue
```

---

## Problem Description

Employee Importance. ([LeetCode](https://leetcode.com/problems/employee-importance))

Difficulty: Medium | Acceptance: 68.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/employee-importance) for full constraints

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
function employeeImportanceBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — BFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function employeeImportance(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using BFS
  // Hint: Use queue, process level by level
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(employeeImportance(/* example 1 */)); // expected
// console.log(employeeImportance(/* example 2 */)); // expected
// console.log(employeeImportance(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Smallest Common Region](https://leetcode.com/problems/smallest-common-region) — same pattern: BFS
- [Operations on Tree](https://leetcode.com/problems/operations-on-tree) — same pattern: BFS
- [Reachable Nodes With Restrictions](https://leetcode.com/problems/reachable-nodes-with-restrictions) — same pattern: Union Find
- [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree) — same pattern: BFS
- [Employee Importance — LeetCode](https://leetcode.com/problems/employee-importance) — problem page
