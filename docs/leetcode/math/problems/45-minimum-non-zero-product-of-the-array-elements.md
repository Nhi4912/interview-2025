---
layout: page
title: "Minimum Non-Zero Product of the Array Elements"
difficulty: Medium
category: Math
tags: [Math, Greedy, Recursion]
leetcode_url: "https://leetcode.com/problems/minimum-non-zero-product-of-the-array-elements"
---

# Minimum Non-Zero Product of the Array Elements / Minimum Non-Zero Product of the Array Elements

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Pow(x, n)](https://leetcode.com/problems/powx-n) | [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Non-Zero Product of the Array Elements example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Minimum Non-Zero Product of the Array Elements. ([LeetCode](https://leetcode.com/problems/minimum-non-zero-product-of-the-array-elements))

Difficulty: Medium | Acceptance: 36.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-non-zero-product-of-the-array-elements) for full constraints

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
function minimumNonZeroProductOfTheArrayElementsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumNonZeroProductOfTheArrayElements(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumNonZeroProductOfTheArrayElements(/* example 1 */)); // expected
// console.log(minimumNonZeroProductOfTheArrayElements(/* example 2 */)); // expected
// console.log(minimumNonZeroProductOfTheArrayElements(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Pow(x, n)](https://leetcode.com/problems/powx-n) — same pattern: Math
- [Wildcard Matching](https://leetcode.com/problems/wildcard-matching) — same pattern: Dynamic Programming
- [Integer to English Words](https://leetcode.com/problems/integer-to-english-words) — same pattern: Math
- [Basic Calculator](https://leetcode.com/problems/basic-calculator) — same pattern: Stack
- [Minimum Non-Zero Product of the Array Elements — LeetCode](https://leetcode.com/problems/minimum-non-zero-product-of-the-array-elements) — problem page
