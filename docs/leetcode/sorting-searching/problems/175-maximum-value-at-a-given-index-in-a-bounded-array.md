---
layout: page
title: "Maximum Value at a Given Index in a Bounded Array"
difficulty: Medium
category: Sorting-Searching
tags: [Math, Binary Search, Greedy]
leetcode_url: "https://leetcode.com/problems/maximum-value-at-a-given-index-in-a-bounded-array"
---

# Maximum Value at a Given Index in a Bounded Array / Maximum Value at a Given Index in a Bounded Array

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Sell Diminishing-Valued Colored Balls](https://leetcode.com/problems/sell-diminishing-valued-colored-balls) | [Sqrt(x)](https://leetcode.com/problems/sqrtx)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Value at a Given Index in a Bounded Array example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Maximum Value at a Given Index in a Bounded Array. ([LeetCode](https://leetcode.com/problems/maximum-value-at-a-given-index-in-a-bounded-array))

Difficulty: Medium | Acceptance: 38.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-value-at-a-given-index-in-a-bounded-array) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Input đã sorted? Cần tìm vị trí chính xác hay boundary?" / Is input sorted? Exact match or boundary?
2. **Brute force**: "Linear scan O(n)" → optimize with binary search O(log n) / Start linear, suggest binary
3. **Optimize**: "Chú ý lo/hi boundary: lo <= hi hay lo < hi? mid±1 hay mid?" / Watch boundary conditions carefully
4. **Edge cases**: "Mảng rỗng, một phần tử, target không tồn tại, overflow mid" / Empty, single, not found, overflow

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumValueAtAGivenIndexInABoundedArrayBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumValueAtAGivenIndexInABoundedArray(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumValueAtAGivenIndexInABoundedArray(/* example 1 */)); // expected
// console.log(maximumValueAtAGivenIndexInABoundedArray(/* example 2 */)); // expected
// console.log(maximumValueAtAGivenIndexInABoundedArray(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Sell Diminishing-Valued Colored Balls](https://leetcode.com/problems/sell-diminishing-valued-colored-balls) — same pattern: Binary Search
- [Sqrt(x)](https://leetcode.com/problems/sqrtx) — same pattern: Binary Search
- [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight) — same pattern: Prefix Sum
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Maximum Value at a Given Index in a Bounded Array — LeetCode](https://leetcode.com/problems/maximum-value-at-a-given-index-in-a-bounded-array) — problem page
