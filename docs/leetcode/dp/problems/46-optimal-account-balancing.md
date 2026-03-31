---
layout: page
title: "Optimal Account Balancing"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/optimal-account-balancing"
---

# Optimal Account Balancing / Optimal Account Balancing

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement) | [Find Minimum Time to Finish All Jobs](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Optimal Account Balancing example:**

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

Optimal Account Balancing. ([LeetCode](https://leetcode.com/problems/optimal-account-balancing))

Difficulty: Hard | Acceptance: 49.9%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/optimal-account-balancing) for full constraints

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
function optimalAccountBalancingBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function optimalAccountBalancing(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(optimalAccountBalancing(/* example 1 */)); // expected
// console.log(optimalAccountBalancing(/* example 2 */)); // expected
// console.log(optimalAccountBalancing(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement) — same pattern: Backtracking
- [Find Minimum Time to Finish All Jobs](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs) — same pattern: Backtracking
- [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets) — same pattern: Backtracking
- [Shopping Offers](https://leetcode.com/problems/shopping-offers) — same pattern: Backtracking
- [Optimal Account Balancing — LeetCode](https://leetcode.com/problems/optimal-account-balancing) — problem page
