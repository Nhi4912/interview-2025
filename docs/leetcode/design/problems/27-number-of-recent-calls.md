---
layout: page
title: "Number of Recent Calls"
difficulty: Easy
category: Design
tags: [Design, Queue, Data Stream]
leetcode_url: "https://leetcode.com/problems/number-of-recent-calls"
---

# Number of Recent Calls / Number of Recent Calls

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Queue
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream) | [Design Front Middle Back Queue](https://leetcode.com/problems/design-front-middle-back-queue)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống hàng xếp mua vé — ai đến trước được phục vụ trước (FIFO). Thường dùng trong BFS và scheduling.

**Pattern Recognition:**

- Signal: "problem-specific signals" → **Queue**
- Bài này thuộc dạng Queue — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Recent Calls example:**

```
// TODO: Add step-by-step visual for Queue
// Show one complete example with state at each step
```

---

## Problem Description

Number of Recent Calls. ([LeetCode](https://leetcode.com/problems/number-of-recent-calls))

Difficulty: Easy | Acceptance: 77.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-recent-calls) for full constraints

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
function numberOfRecentCallsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Queue
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfRecentCalls(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Queue
  // Hint: Identify the key insight that reduces complexity
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfRecentCalls(/* example 1 */)); // expected
// console.log(numberOfRecentCalls(/* example 2 */)); // expected
// console.log(numberOfRecentCalls(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream) — same pattern: Queue
- [Design Front Middle Back Queue](https://leetcode.com/problems/design-front-middle-back-queue) — same pattern: Linked List
- [Find Consecutive Integers from a Data Stream](https://leetcode.com/problems/find-consecutive-integers-from-a-data-stream) — same pattern: Queue
- [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream) — same pattern: Two Pointers
- [Number of Recent Calls — LeetCode](https://leetcode.com/problems/number-of-recent-calls) — problem page
