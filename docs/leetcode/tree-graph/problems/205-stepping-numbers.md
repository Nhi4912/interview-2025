---
layout: page
title: "Stepping Numbers"
difficulty: Medium
category: Tree-Graph
tags: [Math, Backtracking, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/stepping-numbers"
---

# Stepping Numbers / Stepping Numbers

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Perfect Squares](https://leetcode.com/problems/perfect-squares) | [Word Ladder II](https://leetcode.com/problems/word-ladder-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Stepping Numbers example:**

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

Stepping Numbers. ([LeetCode](https://leetcode.com/problems/stepping-numbers))

Difficulty: Medium | Acceptance: 47.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/stepping-numbers) for full constraints

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
function steppingNumbersBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function steppingNumbers(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(steppingNumbers(/* example 1 */)); // expected
// console.log(steppingNumbers(/* example 2 */)); // expected
// console.log(steppingNumbers(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Perfect Squares](https://leetcode.com/problems/perfect-squares) — same pattern: Dynamic Programming
- [Word Ladder II](https://leetcode.com/problems/word-ladder-ii) — same pattern: Backtracking
- [Remove Invalid Parentheses](https://leetcode.com/problems/remove-invalid-parentheses) — same pattern: Backtracking
- [Gray Code](https://leetcode.com/problems/gray-code) — same pattern: Backtracking
- [Stepping Numbers — LeetCode](https://leetcode.com/problems/stepping-numbers) — problem page
