---
layout: page
title: "Maximum Score Words Formed by Letters"
difficulty: Hard
category: Dynamic Programming
tags: [Array, String, Dynamic Programming, Backtracking, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/maximum-score-words-formed-by-letters"
---

# Maximum Score Words Formed by Letters / Maximum Score Words Formed by Letters

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word) | [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Maximum Score Words Formed by Letters example:**

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

Maximum Score Words Formed by Letters. ([LeetCode](https://leetcode.com/problems/maximum-score-words-formed-by-letters))

Difficulty: Hard | Acceptance: 81.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/maximum-score-words-formed-by-letters) for full constraints

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
function maximumScoreWordsFormedByLettersBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function maximumScoreWordsFormedByLetters(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(maximumScoreWordsFormedByLetters(/* example 1 */)); // expected
// console.log(maximumScoreWordsFormedByLetters(/* example 2 */)); // expected
// console.log(maximumScoreWordsFormedByLetters(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word) — same pattern: Backtracking
- [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement) — same pattern: Backtracking
- [Optimal Account Balancing](https://leetcode.com/problems/optimal-account-balancing) — same pattern: Backtracking
- [Find Minimum Time to Finish All Jobs](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs) — same pattern: Backtracking
- [Maximum Score Words Formed by Letters — LeetCode](https://leetcode.com/problems/maximum-score-words-formed-by-letters) — problem page
