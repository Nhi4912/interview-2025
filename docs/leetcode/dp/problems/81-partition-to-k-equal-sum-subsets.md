---
layout: page
title: "Partition to K Equal Sum Subsets"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Backtracking, Bit Manipulation, Memoization]
leetcode_url: "https://leetcode.com/problems/partition-to-k-equal-sum-subsets"
---

# Partition to K Equal Sum Subsets / Partition to K Equal Sum Subsets

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Shopping Offers](https://leetcode.com/problems/shopping-offers) | [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Partition to K Equal Sum Subsets example:**

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

Partition to K Equal Sum Subsets. ([LeetCode](https://leetcode.com/problems/partition-to-k-equal-sum-subsets))

Difficulty: Medium | Acceptance: 38.1%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/partition-to-k-equal-sum-subsets) for full constraints

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
function partitionToKEqualSumSubsetsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function partitionToKEqualSumSubsets(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(partitionToKEqualSumSubsets(/* example 1 */)); // expected
// console.log(partitionToKEqualSumSubsets(/* example 2 */)); // expected
// console.log(partitionToKEqualSumSubsets(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Shopping Offers](https://leetcode.com/problems/shopping-offers) — same pattern: Backtracking
- [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word) — same pattern: Backtracking
- [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement) — same pattern: Backtracking
- [Optimal Account Balancing](https://leetcode.com/problems/optimal-account-balancing) — same pattern: Backtracking
- [Partition to K Equal Sum Subsets — LeetCode](https://leetcode.com/problems/partition-to-k-equal-sum-subsets) — problem page
