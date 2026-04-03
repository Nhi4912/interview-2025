---
layout: page
title: "Expression Add Operators"
difficulty: Hard
category: Backtracking
tags: [Math, String, Backtracking]
leetcode_url: "https://leetcode.com/problems/expression-add-operators"
---

# Expression Add Operators / Expression Add Operators

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Verbal Arithmetic Puzzle](https://leetcode.com/problems/verbal-arithmetic-puzzle) | [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Expression Add Operators example:**

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

Expression Add Operators. ([LeetCode](https://leetcode.com/problems/expression-add-operators))

Difficulty: Hard | Acceptance: 41.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/expression-add-operators) for full constraints

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
function expressionAddOperatorsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function expressionAddOperators(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(expressionAddOperators(/* example 1 */)); // expected
// console.log(expressionAddOperators(/* example 2 */)); // expected
// console.log(expressionAddOperators(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Verbal Arithmetic Puzzle](https://leetcode.com/problems/verbal-arithmetic-puzzle) — same pattern: Backtracking
- [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii) — same pattern: Stack
- [Integer to English Words](https://leetcode.com/problems/integer-to-english-words) — same pattern: Math
- [Multiply Strings](https://leetcode.com/problems/multiply-strings) — same pattern: Math
- [Expression Add Operators — LeetCode](https://leetcode.com/problems/expression-add-operators) — problem page
