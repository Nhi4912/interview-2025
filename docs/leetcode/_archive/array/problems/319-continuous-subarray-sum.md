---
layout: page
title: "Continuous Subarray Sum"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Math, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/continuous-subarray-sum"
---

# Continuous Subarray Sum / Continuous Subarray Sum

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays) | [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tổng luỹ tiến — tính trước tổng từ đầu đến mỗi vị trí, rồi truy vấn tổng bất kỳ đoạn nào trong O(1).

**Pattern Recognition:**

- Signal: "range sum queries" + "subarray sum" → **Prefix Sum**
- Bài này thuộc dạng Prefix Sum — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Continuous Subarray Sum example:**

```
// TODO: Add step-by-step visual for Prefix Sum
// Show one complete example with state at each step
```

---

## Problem Description

Continuous Subarray Sum. ([LeetCode](https://leetcode.com/problems/continuous-subarray-sum))

Difficulty: Medium | Acceptance: 30.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/continuous-subarray-sum) for full constraints

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
function continuousSubarraySumBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Prefix Sum
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function continuousSubarraySum(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Prefix Sum
  // Hint: Build prefix sum array, query range sum in O(1)
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(continuousSubarraySum(/* example 1 */)); // expected
// console.log(continuousSubarraySum(/* example 2 */)); // expected
// console.log(continuousSubarraySum(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays) — same pattern: Sliding Window
- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) — same pattern: Prefix Sum
- [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight) — same pattern: Prefix Sum
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Continuous Subarray Sum — LeetCode](https://leetcode.com/problems/continuous-subarray-sum) — problem page
