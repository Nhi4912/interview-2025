---
layout: page
title: "Divide Intervals Into Minimum Number of Groups"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Greedy, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups"
---

# Divide Intervals Into Minimum Number of Groups / Divide Intervals Into Minimum Number of Groups

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximum Total Beauty of the Gardens](https://leetcode.com/problems/maximum-total-beauty-of-the-gardens) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Divide Intervals Into Minimum Number of Groups example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Divide Intervals Into Minimum Number of Groups. ([LeetCode](https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups))

Difficulty: Medium | Acceptance: 63.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups) for full constraints

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
function divideIntervalsIntoMinimumNumberOfGroupsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function divideIntervalsIntoMinimumNumberOfGroups(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(divideIntervalsIntoMinimumNumberOfGroups(/* example 1 */)); // expected
// console.log(divideIntervalsIntoMinimumNumberOfGroups(/* example 2 */)); // expected
// console.log(divideIntervalsIntoMinimumNumberOfGroups(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Maximum Total Beauty of the Gardens](https://leetcode.com/problems/maximum-total-beauty-of-the-gardens) — same pattern: Two Pointers
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — same pattern: Heap / Priority Queue
- [IPO](https://leetcode.com/problems/ipo) — same pattern: Heap / Priority Queue
- [Boats to Save People](https://leetcode.com/problems/boats-to-save-people) — same pattern: Two Pointers
- [Divide Intervals Into Minimum Number of Groups — LeetCode](https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups) — problem page
