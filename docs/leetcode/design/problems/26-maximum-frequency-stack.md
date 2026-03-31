---
layout: page
title: "Maximum Frequency Stack"
difficulty: Hard
category: Design
tags: [Hash Table, Stack, Design, Ordered Set]
leetcode_url: "https://leetcode.com/problems/maximum-frequency-stack"
---

# Maximum Frequency Stack / Maximum Frequency Stack

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Stock Price Fluctuation](https://leetcode.com/problems/stock-price-fluctuation) | [Max Stack](https://leetcode.com/problems/max-stack)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chồng đĩa — đĩa nào đặt cuối cùng sẽ được lấy ra đầu tiên (LIFO). Nhiều bài toán về matching và nesting dùng stack.

**Pattern Recognition:**

- Signal: "matching/nesting" + "most recent element" → **Stack**
- Bài này thuộc dạng Stack — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Frequency Stack example:**

```
stack = []

push/pop from right →
Process: scan left to right, stack maintains invariant
```

---

## Problem Description

Maximum Frequency Stack. ([LeetCode](https://leetcode.com/problems/maximum-frequency-stack))

Difficulty: Hard | Acceptance: 66.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-frequency-stack) for full constraints

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
function maximumFrequencyStackBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Stack
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumFrequencyStack(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Stack
  // Hint: Push/pop to maintain invariant, process when stack condition changes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumFrequencyStack(/* example 1 */)); // expected
// console.log(maximumFrequencyStack(/* example 2 */)); // expected
// console.log(maximumFrequencyStack(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Stock Price Fluctuation](https://leetcode.com/problems/stock-price-fluctuation) — same pattern: Heap / Priority Queue
- [Max Stack](https://leetcode.com/problems/max-stack) — same pattern: Linked List
- [Design a Food Rating System](https://leetcode.com/problems/design-a-food-rating-system) — same pattern: Heap / Priority Queue
- [Design a 3D Binary Matrix with Efficient Layer Tracking](https://leetcode.com/problems/design-a-3d-binary-matrix-with-efficient-layer-tracking) — same pattern: Heap / Priority Queue
- [Maximum Frequency Stack — LeetCode](https://leetcode.com/problems/maximum-frequency-stack) — problem page
