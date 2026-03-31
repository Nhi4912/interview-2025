---
layout: page
title: "Ugly Number III"
difficulty: Medium
category: Sorting-Searching
tags: [Math, Binary Search, Combinatorics, Number Theory]
leetcode_url: "https://leetcode.com/problems/ugly-number-iii"
---

# Ugly Number III / Ugly Number III

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count the Number of Ideal Arrays](https://leetcode.com/problems/count-the-number-of-ideal-arrays) | [Minimize the Maximum of Two Arrays](https://leetcode.com/problems/minimize-the-maximum-of-two-arrays)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng tìm một trang trong từ điển — bạn mở giữa, xem số trang, rồi chọn nửa phù hợp. Mỗi lần giảm một nửa phạm vi tìm kiếm.

**Pattern Recognition:**

- Signal: "sorted" + "find target/position" → **Binary Search**
- Bài này thuộc dạng Binary Search — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Ugly Number III example:**

```
[1, 3, 5, 7, 9, 11, 13]
 L        M            R

Step 1: mid = (L+R)/2, check condition
Step 2: condition true → move L = mid+1 (or R = mid-1)
Step N: L meets R → answer found ✅
```

---

## Problem Description

Ugly Number III. ([LeetCode](https://leetcode.com/problems/ugly-number-iii))

Difficulty: Medium | Acceptance: 30.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/ugly-number-iii) for full constraints

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
function uglyNumberIiiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Binary Search
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function uglyNumberIii(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Binary Search
  // Hint: Define search space, determine which half to discard
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(uglyNumberIii(/* example 1 */)); // expected
// console.log(uglyNumberIii(/* example 2 */)); // expected
// console.log(uglyNumberIii(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Count the Number of Ideal Arrays](https://leetcode.com/problems/count-the-number-of-ideal-arrays) — same pattern: Dynamic Programming
- [Minimize the Maximum of Two Arrays](https://leetcode.com/problems/minimize-the-maximum-of-two-arrays) — same pattern: Binary Search
- [Maximum GCD-Sum of a Subarray](https://leetcode.com/problems/maximum-gcd-sum-of-a-subarray) — same pattern: Binary Search
- [Sqrt(x)](https://leetcode.com/problems/sqrtx) — same pattern: Binary Search
- [Ugly Number III — LeetCode](https://leetcode.com/problems/ugly-number-iii) — problem page
