---
layout: page
title: "Number of Visible People in a Queue"
difficulty: Hard
category: Array
tags: [Array, Stack, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/number-of-visible-people-in-a-queue"
---

# Number of Visible People in a Queue / Number of Visible People in a Queue

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) | [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống dãy núi — giữ stack luôn đơn điệu (tăng hoặc giảm). Khi gặp phần tử phá vỡ tính đơn điệu, ta biết ngay đáp án cho các phần tử trước đó.

**Pattern Recognition:**

- Signal: "next greater/smaller element" → **Monotonic Stack**
- Bài này thuộc dạng Monotonic Stack — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Visible People in a Queue example:**

```
arr = [2, 1, 5, 6, 2, 3]
stack (indices): []

i=0: push 0         stack=[0]          (vals: [2])
i=1: 1<2 → push     stack=[0,1]        (vals: [2,1])
i=2: 5>1 → pop, process; 5>2 → pop, process
     push           stack=[2]          (vals: [5])
...
```

---

## Problem Description

Number of Visible People in a Queue. ([LeetCode](https://leetcode.com/problems/number-of-visible-people-in-a-queue))

Difficulty: Hard | Acceptance: 71.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-visible-people-in-a-queue) for full constraints

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
function numberOfVisiblePeopleInAQueueBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Monotonic Stack
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfVisiblePeopleInAQueue(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Monotonic Stack
  // Hint: Maintain monotonic property, pop when new element breaks it
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfVisiblePeopleInAQueue(/* example 1 */)); // expected
// console.log(numberOfVisiblePeopleInAQueue(/* example 2 */)); // expected
// console.log(numberOfVisiblePeopleInAQueue(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) — same pattern: Monotonic Stack
- [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle) — same pattern: Monotonic Stack
- [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i) — same pattern: Monotonic Stack
- [Car Fleet](https://leetcode.com/problems/car-fleet) — same pattern: Monotonic Stack
- [Number of Visible People in a Queue — LeetCode](https://leetcode.com/problems/number-of-visible-people-in-a-queue) — problem page
