---
layout: page
title: "Building H2O"
difficulty: Medium
category: Others
tags: [Concurrency]
leetcode_url: "https://leetcode.com/problems/building-h2o"
---

# Building H2O / Building H2O

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Ad-hoc
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Web Crawler Multithreaded](https://leetcode.com/problems/web-crawler-multithreaded) | [Design Bounded Blocking Queue](https://leetcode.com/problems/design-bounded-blocking-queue)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Phân tích bài "Building H2O" — xác định pattern phù hợp dựa trên constraints và input/output.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Ad-hoc**
- Bài này thuộc dạng Ad-hoc — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Building H2O example:**

```
// TODO: Add step-by-step visual for Ad-hoc
// Show one complete example with state at each step
```

---

## Problem Description

Building H2O. ([LeetCode](https://leetcode.com/problems/building-h2o))

Difficulty: Medium | Acceptance: 57.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/building-h2o) for full constraints

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
function buildingH2oBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Ad-hoc
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function buildingH2o(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Ad-hoc
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(buildingH2o(/* example 1 */)); // expected
// console.log(buildingH2o(/* example 2 */)); // expected
// console.log(buildingH2o(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Web Crawler Multithreaded](https://leetcode.com/problems/web-crawler-multithreaded) — same pattern: BFS
- [Design Bounded Blocking Queue](https://leetcode.com/problems/design-bounded-blocking-queue) — same pattern: Ad-hoc
- [Print in Order](https://leetcode.com/problems/print-in-order) — same pattern: Ad-hoc
- [Building H2O — LeetCode](https://leetcode.com/problems/building-h2o) — problem page
