---
layout: page
title: "Find Median from Data Stream"
difficulty: Hard
category: Design
tags: [Two Pointers, Design, Sorting, Heap (Priority Queue), Data Stream]
leetcode_url: "https://leetcode.com/problems/find-median-from-data-stream"
---

# Find Median from Data Stream / Find Median from Data Stream

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Two Pointers
> **Frequency**: ⭐ Tier 2 — Gặp ở 23+ companies
> **See also**: [Design Search Autocomplete System](https://leetcode.com/problems/design-search-autocomplete-system) | [Design a File Sharing System](https://leetcode.com/problems/design-a-file-sharing-system)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người đi từ hai đầu con đường, tiến lại gần nhau. Mỗi bước, người nào ở vị trí "tốt hơn" sẽ đứng yên, người kia tiến. Khi họ gặp nhau, bài toán được giải.

**Pattern Recognition:**

- Signal: "sorted array" + "find pair/triplet" → **Two Pointers**
- Bài này thuộc dạng Two Pointers — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find Median from Data Stream example:**

```
arr = [... sorted ...]
 L                 R

Step 1: check condition → move L or R
Step 2: ...
Step N: condition met ✅
```

---

## Problem Description

Find Median from Data Stream. ([LeetCode](https://leetcode.com/problems/find-median-from-data-stream))

Difficulty: Hard | Acceptance: 53.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-median-from-data-stream) for full constraints

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
function findMedianFromDataStreamBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Two Pointers
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findMedianFromDataStream(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Two Pointers
  // Hint: Use L/R pointers on sorted input, move based on comparison
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findMedianFromDataStream(/* example 1 */)); // expected
// console.log(findMedianFromDataStream(/* example 2 */)); // expected
// console.log(findMedianFromDataStream(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Design Search Autocomplete System](https://leetcode.com/problems/design-search-autocomplete-system) — same pattern: Trie
- [Design a File Sharing System](https://leetcode.com/problems/design-a-file-sharing-system) — same pattern: Heap / Priority Queue
- [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements) — same pattern: Sliding Window
- [Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream) — same pattern: Binary Search
- [Find Median from Data Stream — LeetCode](https://leetcode.com/problems/find-median-from-data-stream) — problem page
