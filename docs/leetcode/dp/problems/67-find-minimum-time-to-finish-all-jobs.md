---
layout: page
title: "Find Minimum Time to Finish All Jobs"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs"
---

# Find Minimum Time to Finish All Jobs / Find Minimum Time to Finish All Jobs

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement) | [Optimal Account Balancing](https://leetcode.com/problems/optimal-account-balancing)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Find Minimum Time to Finish All Jobs example:**

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

Find Minimum Time to Finish All Jobs. ([LeetCode](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs))

Difficulty: Hard | Acceptance: 43.5%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs) for full constraints

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
function findMinimumTimeToFinishAllJobsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function findMinimumTimeToFinishAllJobs(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(findMinimumTimeToFinishAllJobs(/* example 1 */)); // expected
// console.log(findMinimumTimeToFinishAllJobs(/* example 2 */)); // expected
// console.log(findMinimumTimeToFinishAllJobs(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement) — same pattern: Backtracking
- [Optimal Account Balancing](https://leetcode.com/problems/optimal-account-balancing) — same pattern: Backtracking
- [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets) — same pattern: Backtracking
- [Shopping Offers](https://leetcode.com/problems/shopping-offers) — same pattern: Backtracking
- [Find Minimum Time to Finish All Jobs — LeetCode](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs) — problem page
