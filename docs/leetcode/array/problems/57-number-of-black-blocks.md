---
layout: page
title: "Number of Black Blocks"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Enumeration]
leetcode_url: "https://leetcode.com/problems/number-of-black-blocks"
---

# Number of Black Blocks / Number of Black Blocks

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Maximum Square Area by Removing Fences From a Field](https://leetcode.com/problems/maximum-square-area-by-removing-fences-from-a-field) | [Count Lattice Points Inside a Circle](https://leetcode.com/problems/count-lattice-points-inside-a-circle)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống từ điển — tra cứu tức thì O(1). Đổi space lấy time, lưu thông tin đã thấy để tránh tìm lại.

**Pattern Recognition:**

- Signal: "find complement/match in O(1)" → **Hash Map**
- Bài này thuộc dạng Hash Map — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Number of Black Blocks example:**

```
Scan array:
i=0: num=2, need=target-2=7 → not in map → map={2:0}
i=1: num=7, need=target-7=2 → found in map! → return [map[2], 1] ✅

Key insight: store complement for O(1) lookup
```

---

## Problem Description

Number of Black Blocks. ([LeetCode](https://leetcode.com/problems/number-of-black-blocks))

Difficulty: Medium | Acceptance: 38.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/number-of-black-blocks) for full constraints

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
function numberOfBlackBlocksBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Hash Map
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function numberOfBlackBlocks(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Hash Map
  // Hint: Store seen values for O(1) lookup of complement/match
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(numberOfBlackBlocks(/* example 1 */)); // expected
// console.log(numberOfBlackBlocks(/* example 2 */)); // expected
// console.log(numberOfBlackBlocks(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Maximum Square Area by Removing Fences From a Field](https://leetcode.com/problems/maximum-square-area-by-removing-fences-from-a-field) — same pattern: Hash Map
- [Count Lattice Points Inside a Circle](https://leetcode.com/problems/count-lattice-points-inside-a-circle) — same pattern: Math
- [Form Smallest Number From Two Digit Arrays](https://leetcode.com/problems/form-smallest-number-from-two-digit-arrays) — same pattern: Hash Map
- [Count Almost Equal Pairs I](https://leetcode.com/problems/count-almost-equal-pairs-i) — same pattern: Sorting
- [Number of Black Blocks — LeetCode](https://leetcode.com/problems/number-of-black-blocks) — problem page
