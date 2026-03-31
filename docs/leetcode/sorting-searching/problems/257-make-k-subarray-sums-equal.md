---
layout: page
title: "Make K-Subarray Sums Equal"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, Greedy, Sorting, Number Theory]
leetcode_url: "https://leetcode.com/problems/make-k-subarray-sums-equal"
---

# Make K-Subarray Sums Equal / Make K-Subarray Sums Equal

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Minimize Length of Array Using Operations](https://leetcode.com/problems/minimize-length-of-array-using-operations) | [Sell Diminishing-Valued Colored Balls](https://leetcode.com/problems/sell-diminishing-valued-colored-balls)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Make K-Subarray Sums Equal example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Make K-Subarray Sums Equal. ([LeetCode](https://leetcode.com/problems/make-k-subarray-sums-equal))

Difficulty: Medium | Acceptance: 36.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/make-k-subarray-sums-equal) for full constraints

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
function makeKSubarraySumsEqualBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function makeKSubarraySumsEqual(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(makeKSubarraySumsEqual(/* example 1 */)); // expected
// console.log(makeKSubarraySumsEqual(/* example 2 */)); // expected
// console.log(makeKSubarraySumsEqual(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Minimize Length of Array Using Operations](https://leetcode.com/problems/minimize-length-of-array-using-operations) — same pattern: Greedy
- [Sell Diminishing-Valued Colored Balls](https://leetcode.com/problems/sell-diminishing-valued-colored-balls) — same pattern: Binary Search
- [Minimize Rounding Error to Meet Target](https://leetcode.com/problems/minimize-rounding-error-to-meet-target) — same pattern: Greedy
- [Stone Game VI](https://leetcode.com/problems/stone-game-vi) — same pattern: Heap / Priority Queue
- [Make K-Subarray Sums Equal — LeetCode](https://leetcode.com/problems/make-k-subarray-sums-equal) — problem page
