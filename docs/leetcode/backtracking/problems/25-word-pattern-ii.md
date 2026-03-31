---
layout: page
title: "Word Pattern II"
difficulty: Medium
category: Backtracking
tags: [Hash Table, String, Backtracking]
leetcode_url: "https://leetcode.com/problems/word-pattern-ii"
---

# Word Pattern II / Word Pattern II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Word Break II](https://leetcode.com/problems/word-break-ii) | [Word Ladder II](https://leetcode.com/problems/word-ladder-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Word Pattern II example:**

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

Word Pattern II. ([LeetCode](https://leetcode.com/problems/word-pattern-ii))

Difficulty: Medium | Acceptance: 48.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/word-pattern-ii) for full constraints

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
function wordPatternIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function wordPatternIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(wordPatternIi(/* example 1 */)); // expected
// console.log(wordPatternIi(/* example 2 */)); // expected
// console.log(wordPatternIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Word Break II](https://leetcode.com/problems/word-break-ii) — same pattern: Trie
- [Word Ladder II](https://leetcode.com/problems/word-ladder-ii) — same pattern: Backtracking
- [Synonymous Sentences](https://leetcode.com/problems/synonymous-sentences) — same pattern: Union Find
- [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word) — same pattern: Backtracking
- [Word Pattern II — LeetCode](https://leetcode.com/problems/word-pattern-ii) — problem page
