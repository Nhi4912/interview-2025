---
layout: page
title: "Brightest Position on Street"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Sorting, Prefix Sum, Ordered Set]
leetcode_url: "https://leetcode.com/problems/brightest-position-on-street"
---

# Brightest Position on Street / Brightest Position on Street

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) | [Contains Duplicate III](https://leetcode.com/problems/contains-duplicate-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Brightest Position on Street example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Brightest Position on Street. ([LeetCode](https://leetcode.com/problems/brightest-position-on-street))

Difficulty: Medium | Acceptance: 60.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/brightest-position-on-street) for full constraints

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
function brightestPositionOnStreetBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function brightestPositionOnStreet(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(brightestPositionOnStreet(/* example 1 */)); // expected
// console.log(brightestPositionOnStreet(/* example 2 */)); // expected
// console.log(brightestPositionOnStreet(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) — same pattern: Prefix Sum
- [Contains Duplicate III](https://leetcode.com/problems/contains-duplicate-iii) — same pattern: Sliding Window
- [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) — same pattern: Sliding Window
- [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal) — same pattern: Prefix Sum
- [Brightest Position on Street — LeetCode](https://leetcode.com/problems/brightest-position-on-street) — problem page
