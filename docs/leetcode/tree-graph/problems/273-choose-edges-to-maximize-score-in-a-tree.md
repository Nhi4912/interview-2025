---
layout: page
title: "Choose Edges to Maximize Score in a Tree"
difficulty: Medium
category: Tree-Graph
tags: [Dynamic Programming, Tree, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/choose-edges-to-maximize-score-in-a-tree"
---

# Choose Edges to Maximize Score in a Tree / Choose Edges to Maximize Score in a Tree

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Binary Tree Cameras](https://leetcode.com/problems/binary-tree-cameras) | [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Choose Edges to Maximize Score in a Tree example:**

```
dp table:
i:     0    1    2    3    4    ...
dp[i]: base  ?    ?    ?    ?

Transition: dp[i] = f(dp[i-1], dp[i-2], ...)
Base case:  dp[0] = ...
Answer:     dp[n] or max(dp)
```

---

## Problem Description

Choose Edges to Maximize Score in a Tree. ([LeetCode](https://leetcode.com/problems/choose-edges-to-maximize-score-in-a-tree))

Difficulty: Medium | Acceptance: 55.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/choose-edges-to-maximize-score-in-a-tree) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Cần giá trị tối ưu hay cần reconstruct solution?" / Need optimal value or actual solution path?
2. **Brute force**: "Recursion O(2^n)" → add memoization → bottom-up DP / Start recursive, add memo, convert to iterative
3. **State definition**: "Xác định dp[i] nghĩa là gì, transition từ đâu" / Define state clearly before coding
4. **Edge cases**: "Base cases, n=0/1, negative values, overflow" / Check base cases and boundary values
5. **Space optimize**: "Nếu dp[i] chỉ phụ thuộc dp[i-1] → dùng 2 biến thay vì mảng" / Roll variables if possible

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function chooseEdgesToMaximizeScoreInATreeBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function chooseEdgesToMaximizeScoreInATree(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(chooseEdgesToMaximizeScoreInATree(/* example 1 */)); // expected
// console.log(chooseEdgesToMaximizeScoreInATree(/* example 2 */)); // expected
// console.log(chooseEdgesToMaximizeScoreInATree(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Binary Tree Cameras](https://leetcode.com/problems/binary-tree-cameras) — same pattern: Dynamic Programming
- [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree) — same pattern: Dynamic Programming
- [Difference Between Maximum and Minimum Price Sum](https://leetcode.com/problems/difference-between-maximum-and-minimum-price-sum) — same pattern: Dynamic Programming
- [House Robber III](https://leetcode.com/problems/house-robber-iii) — same pattern: Dynamic Programming
- [Choose Edges to Maximize Score in a Tree — LeetCode](https://leetcode.com/problems/choose-edges-to-maximize-score-in-a-tree) — problem page
