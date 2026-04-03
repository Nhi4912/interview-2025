---
layout: page
title: "Linked List Cycle II"
difficulty: Medium
category: Linked-List
tags: [Hash Table, Linked List, Two Pointers]
leetcode_url: "https://leetcode.com/problems/linked-list-cycle-ii"
---

# Linked List Cycle II / Linked List Cycle II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Happy Number](https://leetcode.com/problems/happy-number) | [LFU Cache](https://leetcode.com/problems/lfu-cache)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Linked List Cycle II example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Linked List Cycle II. ([LeetCode](https://leetcode.com/problems/linked-list-cycle-ii))

Difficulty: Medium | Acceptance: 54.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/linked-list-cycle-ii) for full constraints

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
function linkedListCycleIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function linkedListCycleIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(linkedListCycleIi(/* example 1 */)); // expected
// console.log(linkedListCycleIi(/* example 2 */)); // expected
// console.log(linkedListCycleIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Happy Number](https://leetcode.com/problems/happy-number) — same pattern: Two Pointers
- [LFU Cache](https://leetcode.com/problems/lfu-cache) — same pattern: Linked List
- [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) — same pattern: Two Pointers
- [Rotate List](https://leetcode.com/problems/rotate-list) — same pattern: Two Pointers
- [Linked List Cycle II — LeetCode](https://leetcode.com/problems/linked-list-cycle-ii) — problem page
