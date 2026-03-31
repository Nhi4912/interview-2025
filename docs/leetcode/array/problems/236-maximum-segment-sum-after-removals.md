---
layout: page
title: "Maximum Segment Sum After Removals"
difficulty: Hard
category: Array
tags: [Array, Union Find, Prefix Sum, Ordered Set]
leetcode_url: "https://leetcode.com/problems/maximum-segment-sum-after-removals"
---

# Maximum Segment Sum After Removals / Maximum Segment Sum After Removals

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) | [Brightest Position on Street](https://leetcode.com/problems/brightest-position-on-street)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhóm bạn — ban đầu ai cũng riêng, khi hai người kết bạn thì nhóm họ gộp lại. Union Find quản lý các nhóm này hiệu quả.

**Pattern Recognition:**

- Signal: "group elements" + "connectivity queries" → **Union Find**
- Bài này thuộc dạng Union Find — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Segment Sum After Removals example:**

```
// TODO: Add step-by-step visual for Union Find
// Show one complete example with state at each step
```

---

## Problem Description

Maximum Segment Sum After Removals. ([LeetCode](https://leetcode.com/problems/maximum-segment-sum-after-removals))

Difficulty: Hard | Acceptance: 48.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-segment-sum-after-removals) for full constraints

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
function maximumSegmentSumAfterRemovalsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Union Find
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumSegmentSumAfterRemovals(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Union Find
  // Hint: Use union-find with path compression and union by rank
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumSegmentSumAfterRemovals(/* example 1 */)); // expected
// console.log(maximumSegmentSumAfterRemovals(/* example 2 */)); // expected
// console.log(maximumSegmentSumAfterRemovals(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom) — same pattern: Prefix Sum
- [Brightest Position on Street](https://leetcode.com/problems/brightest-position-on-street) — same pattern: Prefix Sum
- [Max Sum of Rectangle No Larger Than K](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k) — same pattern: Prefix Sum
- [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence) — same pattern: Union Find
- [Maximum Segment Sum After Removals — LeetCode](https://leetcode.com/problems/maximum-segment-sum-after-removals) — problem page
