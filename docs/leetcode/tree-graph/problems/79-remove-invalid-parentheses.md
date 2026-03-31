---
layout: page
title: "Remove Invalid Parentheses"
difficulty: Hard
category: Tree-Graph
tags: [String, Backtracking, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/remove-invalid-parentheses"
---

# Remove Invalid Parentheses / Remove Invalid Parentheses

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Word Ladder II](https://leetcode.com/problems/word-ladder-ii) | [Brace Expansion](https://leetcode.com/problems/brace-expansion)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Remove Invalid Parentheses example:**

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

Remove Invalid Parentheses. ([LeetCode](https://leetcode.com/problems/remove-invalid-parentheses))

Difficulty: Hard | Acceptance: 49.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/remove-invalid-parentheses) for full constraints

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
function removeInvalidParenthesesBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function removeInvalidParentheses(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(removeInvalidParentheses(/* example 1 */)); // expected
// console.log(removeInvalidParentheses(/* example 2 */)); // expected
// console.log(removeInvalidParentheses(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Word Ladder II](https://leetcode.com/problems/word-ladder-ii) — same pattern: Backtracking
- [Brace Expansion](https://leetcode.com/problems/brace-expansion) — same pattern: Backtracking
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — same pattern: Shortest Path (BFS/Dijkstra)
- [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) — same pattern: BFS
- [Remove Invalid Parentheses — LeetCode](https://leetcode.com/problems/remove-invalid-parentheses) — problem page
