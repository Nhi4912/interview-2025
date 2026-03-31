---
layout: page
title: "Length of Longest V-Shaped Diagonal Segment"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Memoization, Matrix]
leetcode_url: "https://leetcode.com/problems/length-of-longest-v-shaped-diagonal-segment"
---

# Length of Longest V-Shaped Diagonal Segment / Length of Longest V-Shaped Diagonal Segment

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) | [Sliding Puzzle](https://leetcode.com/problems/sliding-puzzle)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xếp gạch xây tường — mỗi viên gạch mới dựa trên viên phía dưới. Bạn giải bài toán nhỏ trước, dùng kết quả đó để giải bài lớn hơn.

**Pattern Recognition:**

- Signal: "min/max result" + "overlapping subproblems" + "optimal substructure" → **Dynamic Programming**
- Bài này thuộc dạng Dynamic Programming — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Length of Longest V-Shaped Diagonal Segment example:**

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

Length of Longest V-Shaped Diagonal Segment. ([LeetCode](https://leetcode.com/problems/length-of-longest-v-shaped-diagonal-segment))

Difficulty: Hard | Acceptance: 33.7%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/length-of-longest-v-shaped-diagonal-segment) for full constraints

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
function lengthOfLongestVShapedDiagonalSegmentBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Dynamic Programming
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function lengthOfLongestVShapedDiagonalSegment(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Dynamic Programming
  // Hint: Define dp state, find transition, optimize space if possible
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(lengthOfLongestVShapedDiagonalSegment(/* example 1 */)); // expected
// console.log(lengthOfLongestVShapedDiagonalSegment(/* example 2 */)); // expected
// console.log(lengthOfLongestVShapedDiagonalSegment(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) — same pattern: Topological Sort
- [Sliding Puzzle](https://leetcode.com/problems/sliding-puzzle) — same pattern: Backtracking
- [Maximal Square](https://leetcode.com/problems/maximal-square) — same pattern: Dynamic Programming
- [Unique Paths II](https://leetcode.com/problems/unique-paths-ii) — same pattern: Dynamic Programming
- [Length of Longest V-Shaped Diagonal Segment — LeetCode](https://leetcode.com/problems/length-of-longest-v-shaped-diagonal-segment) — problem page
