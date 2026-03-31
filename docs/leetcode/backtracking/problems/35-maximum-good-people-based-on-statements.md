---
layout: page
title: "Maximum Good People Based on Statements"
difficulty: Hard
category: Backtracking
tags: [Array, Backtracking, Bit Manipulation, Enumeration]
leetcode_url: "https://leetcode.com/problems/maximum-good-people-based-on-statements"
---

# Maximum Good People Based on Statements / Maximum Good People Based on Statements

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count Number of Maximum Bitwise-OR Subsets](https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets) | [Maximum Points in an Archery Competition](https://leetcode.com/problems/maximum-points-in-an-archery-competition)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Good People Based on Statements example:**

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

Maximum Good People Based on Statements. ([LeetCode](https://leetcode.com/problems/maximum-good-people-based-on-statements))

Difficulty: Hard | Acceptance: 51.0%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-good-people-based-on-statements) for full constraints

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
function maximumGoodPeopleBasedOnStatementsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumGoodPeopleBasedOnStatements(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumGoodPeopleBasedOnStatements(/* example 1 */)); // expected
// console.log(maximumGoodPeopleBasedOnStatements(/* example 2 */)); // expected
// console.log(maximumGoodPeopleBasedOnStatements(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Count Number of Maximum Bitwise-OR Subsets](https://leetcode.com/problems/count-number-of-maximum-bitwise-or-subsets) — same pattern: Backtracking
- [Maximum Points in an Archery Competition](https://leetcode.com/problems/maximum-points-in-an-archery-competition) — same pattern: Backtracking
- [Subsets II](https://leetcode.com/problems/subsets-ii) — same pattern: Backtracking
- [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement) — same pattern: Backtracking
- [Maximum Good People Based on Statements — LeetCode](https://leetcode.com/problems/maximum-good-people-based-on-statements) — problem page
