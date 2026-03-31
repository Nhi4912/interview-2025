---
layout: page
title: "The Number of Beautiful Subsets"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Hash Table, Math, Dynamic Programming, Backtracking]
leetcode_url: "https://leetcode.com/problems/the-number-of-beautiful-subsets"
---

# The Number of Beautiful Subsets / The Number of Beautiful Subsets

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Minimum Number of Lines to Cover Points](https://leetcode.com/problems/minimum-number-of-lines-to-cover-points) | [Missing Number](https://leetcode.com/problems/missing-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — The Number of Beautiful Subsets example:**

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

The Number of Beautiful Subsets. ([LeetCode](https://leetcode.com/problems/the-number-of-beautiful-subsets))

Difficulty: Medium | Acceptance: 50.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/the-number-of-beautiful-subsets) for full constraints

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
function theNumberOfBeautifulSubsetsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function theNumberOfBeautifulSubsets(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(theNumberOfBeautifulSubsets(/* example 1 */)); // expected
// console.log(theNumberOfBeautifulSubsets(/* example 2 */)); // expected
// console.log(theNumberOfBeautifulSubsets(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Minimum Number of Lines to Cover Points](https://leetcode.com/problems/minimum-number-of-lines-to-cover-points) — same pattern: Backtracking
- [Missing Number](https://leetcode.com/problems/missing-number) — same pattern: Binary Search
- [Longest String Chain](https://leetcode.com/problems/longest-string-chain) — same pattern: Two Pointers
- [Word Break II](https://leetcode.com/problems/word-break-ii) — same pattern: Trie
- [The Number of Beautiful Subsets — LeetCode](https://leetcode.com/problems/the-number-of-beautiful-subsets) — problem page
