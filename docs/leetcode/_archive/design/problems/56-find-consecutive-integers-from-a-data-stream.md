---
layout: page
title: "Find Consecutive Integers from a Data Stream"
difficulty: Medium
category: Design
tags: [Hash Table, Design, Queue, Counting, Data Stream]
leetcode_url: "https://leetcode.com/problems/find-consecutive-integers-from-a-data-stream"
---

# Find Consecutive Integers from a Data Stream / Find Consecutive Integers from a Data Stream

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Logger Rate Limiter](https://leetcode.com/problems/logger-rate-limiter) | [Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống hàng xếp mua vé — ai đến trước được phục vụ trước (FIFO). Thường dùng trong BFS và scheduling.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Queue**
- Bài này thuộc dạng Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find Consecutive Integers from a Data Stream example:**

```
// TODO: Add step-by-step visual for Queue
// Show one complete example with state at each step
```

---

## Problem Description

Find Consecutive Integers from a Data Stream. ([LeetCode](https://leetcode.com/problems/find-consecutive-integers-from-a-data-stream))

Difficulty: Medium | Acceptance: 49.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-consecutive-integers-from-a-data-stream) for full constraints

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
function findConsecutiveIntegersFromADataStreamBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findConsecutiveIntegersFromADataStream(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Queue
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findConsecutiveIntegersFromADataStream(/* example 1 */)); // expected
// console.log(findConsecutiveIntegersFromADataStream(/* example 2 */)); // expected
// console.log(findConsecutiveIntegersFromADataStream(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Logger Rate Limiter](https://leetcode.com/problems/logger-rate-limiter) — same pattern: Design
- [Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream) — same pattern: Queue
- [Stock Price Fluctuation](https://leetcode.com/problems/stock-price-fluctuation) — same pattern: Heap / Priority Queue
- [Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls) — same pattern: Queue
- [Find Consecutive Integers from a Data Stream — LeetCode](https://leetcode.com/problems/find-consecutive-integers-from-a-data-stream) — problem page
