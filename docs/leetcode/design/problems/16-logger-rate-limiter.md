---
layout: page
title: "Logger Rate Limiter"
difficulty: Easy
category: Design
tags: [Hash Table, Design, Data Stream]
leetcode_url: "https://leetcode.com/problems/logger-rate-limiter"
---

# Logger Rate Limiter / Logger Rate Limiter

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Design
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Stock Price Fluctuation](https://leetcode.com/problems/stock-price-fluctuation) | [Find Consecutive Integers from a Data Stream](https://leetcode.com/problems/find-consecutive-integers-from-a-data-stream)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài Design yêu cầu xây dựng cấu trúc dữ liệu — quan trọng là chọn đúng cấu trúc nền và đảm bảo các operations đạt complexity yêu cầu.

**Pattern Recognition:**

- Signal: "implement class with specific API" → **Design**
- Bài này thuộc dạng Design — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Logger Rate Limiter example:**

```
// TODO: Add step-by-step visual for Design
// Show one complete example with state at each step
```

---

## Problem Description

Logger Rate Limiter. ([LeetCode](https://leetcode.com/problems/logger-rate-limiter))

Difficulty: Easy | Acceptance: 76.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/logger-rate-limiter) for full constraints

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
function loggerRateLimiterBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Design
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function loggerRateLimiter(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Design
  // Hint: Choose right data structure combination for required operations
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(loggerRateLimiter(/* example 1 */)); // expected
// console.log(loggerRateLimiter(/* example 2 */)); // expected
// console.log(loggerRateLimiter(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Stock Price Fluctuation](https://leetcode.com/problems/stock-price-fluctuation) — same pattern: Heap / Priority Queue
- [Find Consecutive Integers from a Data Stream](https://leetcode.com/problems/find-consecutive-integers-from-a-data-stream) — same pattern: Queue
- [Two Sum III - Data structure design](https://leetcode.com/problems/two-sum-iii-data-structure-design) — same pattern: Two Pointers
- [Design a File Sharing System](https://leetcode.com/problems/design-a-file-sharing-system) — same pattern: Heap / Priority Queue
- [Logger Rate Limiter — LeetCode](https://leetcode.com/problems/logger-rate-limiter) — problem page
