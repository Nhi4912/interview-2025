---
layout: page
title: "Reverse Bits"
difficulty: Easy
category: Sorting-Searching
tags: [Divide and Conquer, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/reverse-bits"
---

# Reverse Bits / Reverse Bits

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Divide and Conquer
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits) | [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chia đội để thi đấu — chia bài toán thành các phần nhỏ, giải riêng từng phần rồi ghép kết quả lại.

**Pattern Recognition:**

- Signal: "split problem in half" + "merge results" → **Divide and Conquer**
- Bài này thuộc dạng Divide and Conquer — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Reverse Bits example:**

```
// TODO: Add step-by-step visual for Divide and Conquer
// Show one complete example with state at each step
```

---

## Problem Description

Reverse Bits. ([LeetCode](https://leetcode.com/problems/reverse-bits))

Difficulty: Easy | Acceptance: 63.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/reverse-bits) for full constraints

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
function reverseBitsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Divide and Conquer
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function reverseBits(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Divide and Conquer
  // Hint: Split in half, solve recursively, merge results
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(reverseBits(/* example 1 */)); // expected
// console.log(reverseBits(/* example 2 */)); // expected
// console.log(reverseBits(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits) — same pattern: Divide and Conquer
- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) — same pattern: Heap / Priority Queue
- [Majority Element](https://leetcode.com/problems/majority-element) — same pattern: Divide and Conquer
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Reverse Bits — LeetCode](https://leetcode.com/problems/reverse-bits) — problem page
