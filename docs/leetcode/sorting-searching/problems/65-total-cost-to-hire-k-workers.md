---
layout: page
title: "Total Cost to Hire K Workers"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Heap (Priority Queue), Simulation]
leetcode_url: "https://leetcode.com/problems/total-cost-to-hire-k-workers"
---

# Total Cost to Hire K Workers / Total Cost to Hire K Workers

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Candy Crush](https://leetcode.com/problems/candy-crush) | [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Total Cost to Hire K Workers example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Total Cost to Hire K Workers. ([LeetCode](https://leetcode.com/problems/total-cost-to-hire-k-workers))

Difficulty: Medium | Acceptance: 43.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/total-cost-to-hire-k-workers) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Mảng đã sorted chưa? Có duplicate không?" / Ask if array is sorted and if duplicates exist
2. **Brute force**: "Dùng 2 vòng for O(n²)" → optimize with two pointers O(n) / Start with nested loops, then optimize
3. **Optimize**: "Vì mảng sorted, dùng 2 con trỏ L/R tiến vào giữa" / Since sorted, use L/R pointers moving inward
4. **Edge cases**: "Mảng rỗng, một phần tử, tất cả giống nhau" / Empty array, single element, all same values

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function totalCostToHireKWorkersBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function totalCostToHireKWorkers(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(totalCostToHireKWorkers(/* example 1 */)); // expected
// console.log(totalCostToHireKWorkers(/* example 2 */)); // expected
// console.log(totalCostToHireKWorkers(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Candy Crush](https://leetcode.com/problems/candy-crush) — same pattern: Two Pointers
- [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements) — same pattern: Sliding Window
- [Number of Orders in the Backlog](https://leetcode.com/problems/number-of-orders-in-the-backlog) — same pattern: Heap / Priority Queue
- [Car Pooling](https://leetcode.com/problems/car-pooling) — same pattern: Prefix Sum
- [Total Cost to Hire K Workers — LeetCode](https://leetcode.com/problems/total-cost-to-hire-k-workers) — problem page
