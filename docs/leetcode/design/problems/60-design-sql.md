---
layout: page
title: "Design SQL"
difficulty: Medium
category: Design
tags: [Array, Hash Table, String, Design]
leetcode_url: "https://leetcode.com/problems/design-sql"
---

# Design SQL / Design SQL

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Design
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) | [Design a Food Rating System](https://leetcode.com/problems/design-a-food-rating-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài Design yêu cầu xây dựng cấu trúc dữ liệu — quan trọng là chọn đúng cấu trúc nền và đảm bảo các operations đạt complexity yêu cầu.

**Pattern Recognition:**

- Signal: "implement class with specific API" → **Design**
- Bài này thuộc dạng Design — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Design SQL example:**

```
// TODO: Add step-by-step visual for Design
// Show one complete example with state at each step
```

---

## Problem Description

Design SQL. ([LeetCode](https://leetcode.com/problems/design-sql))

Difficulty: Medium | Acceptance: 69.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/design-sql) for full constraints

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
function designSqlBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Design
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function designSql(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Design
  // Hint: Choose right data structure combination for required operations
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(designSql(/* example 1 */)); // expected
// console.log(designSql(/* example 2 */)); // expected
// console.log(designSql(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula) — same pattern: Topological Sort
- [Design a Food Rating System](https://leetcode.com/problems/design-a-food-rating-system) — same pattern: Heap / Priority Queue
- [Shortest Word Distance II](https://leetcode.com/problems/shortest-word-distance-ii) — same pattern: Two Pointers
- [Encrypt and Decrypt Strings](https://leetcode.com/problems/encrypt-and-decrypt-strings) — same pattern: Trie
- [Design SQL — LeetCode](https://leetcode.com/problems/design-sql) — problem page
