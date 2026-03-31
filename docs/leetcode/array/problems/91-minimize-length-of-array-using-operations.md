---
layout: page
title: "Minimize Length of Array Using Operations"
difficulty: Medium
category: Array
tags: [Array, Math, Greedy, Number Theory]
leetcode_url: "https://leetcode.com/problems/minimize-length-of-array-using-operations"
---

# Minimize Length of Array Using Operations / Minimize Length of Array Using Operations

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Make K-Subarray Sums Equal](https://leetcode.com/problems/make-k-subarray-sums-equal) | [Rabbits in Forest](https://leetcode.com/problems/rabbits-in-forest)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimize Length of Array Using Operations example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Minimize Length of Array Using Operations. ([LeetCode](https://leetcode.com/problems/minimize-length-of-array-using-operations))

Difficulty: Medium | Acceptance: 34.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimize-length-of-array-using-operations) for full constraints

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
function minimizeLengthOfArrayUsingOperationsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimizeLengthOfArrayUsingOperations(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimizeLengthOfArrayUsingOperations(/* example 1 */)); // expected
// console.log(minimizeLengthOfArrayUsingOperations(/* example 2 */)); // expected
// console.log(minimizeLengthOfArrayUsingOperations(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Make K-Subarray Sums Equal](https://leetcode.com/problems/make-k-subarray-sums-equal) — same pattern: Greedy
- [Rabbits in Forest](https://leetcode.com/problems/rabbits-in-forest) — same pattern: Greedy
- [Smallest Missing Non-negative Integer After Operations](https://leetcode.com/problems/smallest-missing-non-negative-integer-after-operations) — same pattern: Greedy
- [Check If It Is a Good Array](https://leetcode.com/problems/check-if-it-is-a-good-array) — same pattern: Math
- [Minimize Length of Array Using Operations — LeetCode](https://leetcode.com/problems/minimize-length-of-array-using-operations) — problem page
