---
layout: page
title: "Permutations II"
difficulty: Medium
category: Backtracking
tags: [Array, Backtracking, Sorting]
leetcode_url: "https://leetcode.com/problems/permutations-ii"
---

# Permutations II / Permutations II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [The Number of Beautiful Subsets](https://leetcode.com/problems/the-number-of-beautiful-subsets) | [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thử đồ — bạn thử từng lựa chọn, nếu không phù hợp thì cởi ra thử cái khác. Quan trọng là biết khi nào nên dừng thử (pruning).

**Pattern Recognition:**

- Signal: "generate all valid combinations/permutations" → **Backtracking**
- Bài này thuộc dạng Backtracking — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Permutations II example:**

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

Permutations II. ([LeetCode](https://leetcode.com/problems/permutations-ii))

Difficulty: Medium | Acceptance: 61.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/permutations-ii) for full constraints

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
function permutationsIiBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Backtracking
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function permutationsIi(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Backtracking
  // Hint: Choose → Explore → Unchoose, prune invalid branches early
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(permutationsIi(/* example 1 */)); // expected
// console.log(permutationsIi(/* example 2 */)); // expected
// console.log(permutationsIi(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [The Number of Beautiful Subsets](https://leetcode.com/problems/the-number-of-beautiful-subsets) — same pattern: Backtracking
- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) — same pattern: Heap / Priority Queue
- [4Sum](https://leetcode.com/problems/4sum) — same pattern: Two Pointers
- [Majority Element](https://leetcode.com/problems/majority-element) — same pattern: Divide and Conquer
- [Permutations II — LeetCode](https://leetcode.com/problems/permutations-ii) — problem page
