---
layout: page
title: "Letter Case Permutation"
difficulty: Medium
category: Backtracking
tags: [String, Backtracking, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/letter-case-permutation"
---

# Letter Case Permutation / Letter Case Permutation

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word) | [Maximum Score Words Formed by Letters](https://leetcode.com/problems/maximum-score-words-formed-by-letters)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Letter Case Permutation example:**

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

Letter Case Permutation. ([LeetCode](https://leetcode.com/problems/letter-case-permutation))

Difficulty: Medium | Acceptance: 75.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/letter-case-permutation) for full constraints

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
function letterCasePermutationBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function letterCasePermutation(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(letterCasePermutation(/* example 1 */)); // expected
// console.log(letterCasePermutation(/* example 2 */)); // expected
// console.log(letterCasePermutation(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word) — same pattern: Backtracking
- [Maximum Score Words Formed by Letters](https://leetcode.com/problems/maximum-score-words-formed-by-letters) — same pattern: Backtracking
- [Maximum Length of a Concatenated String with Unique Characters](https://leetcode.com/problems/maximum-length-of-a-concatenated-string-with-unique-characters) — same pattern: Backtracking
- [Add Binary](https://leetcode.com/problems/add-binary) — same pattern: Bit Manipulation
- [Letter Case Permutation — LeetCode](https://leetcode.com/problems/letter-case-permutation) — problem page
