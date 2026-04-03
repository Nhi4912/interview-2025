---
layout: page
title: "Minimum Space Wasted From Packaging"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Sorting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimum-space-wasted-from-packaging"
---

# Minimum Space Wasted From Packaging / Minimum Space Wasted From Packaging

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) | [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Space Wasted From Packaging example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Minimum Space Wasted From Packaging. ([LeetCode](https://leetcode.com/problems/minimum-space-wasted-from-packaging))

Difficulty: Hard | Acceptance: 32.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-space-wasted-from-packaging) for full constraints

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
function minimumSpaceWastedFromPackagingBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumSpaceWastedFromPackaging(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumSpaceWastedFromPackaging(/* example 1 */)); // expected
// console.log(minimumSpaceWastedFromPackaging(/* example 2 */)); // expected
// console.log(minimumSpaceWastedFromPackaging(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) — same pattern: Prefix Sum
- [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) — same pattern: Sliding Window
- [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal) — same pattern: Prefix Sum
- [Apply Operations to Maximize Frequency Score](https://leetcode.com/problems/apply-operations-to-maximize-frequency-score) — same pattern: Sliding Window
- [Minimum Space Wasted From Packaging — LeetCode](https://leetcode.com/problems/minimum-space-wasted-from-packaging) — problem page
