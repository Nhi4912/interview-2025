---
layout: page
title: "Count Good Meals"
difficulty: Medium
category: Array
tags: [Array, Hash Table]
leetcode_url: "https://leetcode.com/problems/count-good-meals"
---

# Count Good Meals / Count Good Meals

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [First Missing Positive](https://leetcode.com/problems/first-missing-positive) | [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống từ điển — tra cứu tức thì O(1). Đổi space lấy time, lưu thông tin đã thấy để tránh tìm lại.

**Pattern Recognition:**

- Signal: "find complement/match in O(1)" → **Hash Map**
- Bài này thuộc dạng Hash Map — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Count Good Meals example:**

```
Scan array:
i=0: num=2, need=target-2=7 → not in map → map={2:0}
i=1: num=7, need=target-7=2 → found in map! → return [map[2], 1] ✅

Key insight: store complement for O(1) lookup
```

---

## Problem Description

Count Good Meals. ([LeetCode](https://leetcode.com/problems/count-good-meals))

Difficulty: Medium | Acceptance: 31.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/count-good-meals) for full constraints

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
function countGoodMealsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Hash Map
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function countGoodMeals(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Hash Map
  // Hint: Store seen values for O(1) lookup of complement/match
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(countGoodMeals(/* example 1 */)); // expected
// console.log(countGoodMeals(/* example 2 */)); // expected
// console.log(countGoodMeals(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [First Missing Positive](https://leetcode.com/problems/first-missing-positive) — same pattern: Hash Map
- [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence) — same pattern: Union Find
- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) — same pattern: Prefix Sum
- [Majority Element](https://leetcode.com/problems/majority-element) — same pattern: Divide and Conquer
- [Count Good Meals — LeetCode](https://leetcode.com/problems/count-good-meals) — problem page
