---
layout: page
title: "Next Greater Numerically Balanced Number"
difficulty: Medium
category: Backtracking
tags: [Hash Table, Math, Backtracking, Counting, Enumeration]
leetcode_url: "https://leetcode.com/problems/next-greater-numerically-balanced-number"
---

# Next Greater Numerically Balanced Number / Next Greater Numerically Balanced Number

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count the Number of Good Subsequences](https://leetcode.com/problems/count-the-number-of-good-subsequences) | [Maximum Number of Balls in a Box](https://leetcode.com/problems/maximum-number-of-balls-in-a-box)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Next Greater Numerically Balanced Number example:**

```
                    []
            /       |       \
          [a]      [b]      [c]
         / \        |
      [a,b] [a,c]  [b,c]
       |
    [a,b,c]

Choose → Explore → Un-choose (backtrack)
Prune branches that violate constraints
```

---

## Problem Description

Next Greater Numerically Balanced Number. ([LeetCode](https://leetcode.com/problems/next-greater-numerically-balanced-number))

Difficulty: Medium | Acceptance: 49.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/next-greater-numerically-balanced-number) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Cần all solutions hay count? Có duplicate input không?" / All results or count? Duplicate elements?
2. **Template**: "Choose → Explore → Un-choose" / Follow the standard backtracking template
3. **Pruning**: "Skip nếu biết sớm branch này invalid" / Prune early to avoid TLE
4. **Edge cases**: "Input rỗng, n=0, kết quả có thể rỗng" / Empty input, n=0, possibly empty result set

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function nextGreaterNumericallyBalancedNumberBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function nextGreaterNumericallyBalancedNumber(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(nextGreaterNumericallyBalancedNumber(/* example 1 */)); // expected
// console.log(nextGreaterNumericallyBalancedNumber(/* example 2 */)); // expected
// console.log(nextGreaterNumericallyBalancedNumber(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Count the Number of Good Subsequences](https://leetcode.com/problems/count-the-number-of-good-subsequences) — same pattern: Math
- [Maximum Number of Balls in a Box](https://leetcode.com/problems/maximum-number-of-balls-in-a-box) — same pattern: Math
- [Count Nice Pairs in an Array](https://leetcode.com/problems/count-nice-pairs-in-an-array) — same pattern: Math
- [Right Triangles](https://leetcode.com/problems/right-triangles) — same pattern: Math
- [Next Greater Numerically Balanced Number — LeetCode](https://leetcode.com/problems/next-greater-numerically-balanced-number) — problem page
