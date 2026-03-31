---
layout: page
title: "My Calendar I"
difficulty: Medium
category: Design
tags: [Array, Binary Search, Design, Segment Tree, Ordered Set]
leetcode_url: "https://leetcode.com/problems/my-calendar-i"
---

# My Calendar I / My Calendar I

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Segment Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Implement Router](https://leetcode.com/problems/implement-router) | [Online Majority Element In Subarray](https://leetcode.com/problems/online-majority-element-in-subarray)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Cấu trúc dữ liệu cho range queries — cập nhật và truy vấn đoạn trong O(log n).

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Segment Tree**
- Bài này thuộc dạng Segment Tree — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — My Calendar I example:**

```
// TODO: Add step-by-step visual for Segment Tree
// Show one complete example with state at each step
```

---

## Problem Description

My Calendar I. ([LeetCode](https://leetcode.com/problems/my-calendar-i))

Difficulty: Medium | Acceptance: 58.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/my-calendar-i) for full constraints

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
function myCalendarIBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Segment Tree
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function myCalendarI(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Segment Tree
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(myCalendarI(/* example 1 */)); // expected
// console.log(myCalendarI(/* example 2 */)); // expected
// console.log(myCalendarI(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Implement Router](https://leetcode.com/problems/implement-router) — same pattern: Binary Search
- [Online Majority Element In Subarray](https://leetcode.com/problems/online-majority-element-in-subarray) — same pattern: Segment Tree
- [Range Frequency Queries](https://leetcode.com/problems/range-frequency-queries) — same pattern: Segment Tree
- [Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions) — same pattern: Segment Tree
- [My Calendar I — LeetCode](https://leetcode.com/problems/my-calendar-i) — problem page
