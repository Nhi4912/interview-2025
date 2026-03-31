---
layout: page
title: "Verbal Arithmetic Puzzle"
difficulty: Hard
category: Backtracking
tags: [Array, Math, String, Backtracking]
leetcode_url: "https://leetcode.com/problems/verbal-arithmetic-puzzle"
---

# Verbal Arithmetic Puzzle / Verbal Arithmetic Puzzle

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Word Break II](https://leetcode.com/problems/word-break-ii) | [Minimum Time Difference](https://leetcode.com/problems/minimum-time-difference)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Verbal Arithmetic Puzzle example:**

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

Verbal Arithmetic Puzzle. ([LeetCode](https://leetcode.com/problems/verbal-arithmetic-puzzle))

Difficulty: Hard | Acceptance: 34.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/verbal-arithmetic-puzzle) for full constraints

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
function verbalArithmeticPuzzleBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function verbalArithmeticPuzzle(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(verbalArithmeticPuzzle(/* example 1 */)); // expected
// console.log(verbalArithmeticPuzzle(/* example 2 */)); // expected
// console.log(verbalArithmeticPuzzle(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Word Break II](https://leetcode.com/problems/word-break-ii) — same pattern: Trie
- [Minimum Time Difference](https://leetcode.com/problems/minimum-time-difference) — same pattern: Sorting
- [Guess the Word](https://leetcode.com/problems/guess-the-word) — same pattern: Math
- [Synonymous Sentences](https://leetcode.com/problems/synonymous-sentences) — same pattern: Union Find
- [Verbal Arithmetic Puzzle — LeetCode](https://leetcode.com/problems/verbal-arithmetic-puzzle) — problem page
