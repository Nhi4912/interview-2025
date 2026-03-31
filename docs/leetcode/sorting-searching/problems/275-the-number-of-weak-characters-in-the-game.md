---
layout: page
title: "The Number of Weak Characters in the Game"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Stack, Greedy, Sorting, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/the-number-of-weak-characters-in-the-game"
---

# The Number of Weak Characters in the Game / The Number of Weak Characters in the Game

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Shortest Unsorted Continuous Subarray](https://leetcode.com/problems/shortest-unsorted-continuous-subarray) | [Max Chunks To Make Sorted](https://leetcode.com/problems/max-chunks-to-make-sorted)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống dãy núi — giữ stack luôn đơn điệu (tăng hoặc giảm). Khi gặp phần tử phá vỡ tính đơn điệu, ta biết ngay đáp án cho các phần tử trước đó.

**Pattern Recognition:**

- Signal: "next greater/smaller element" → **Monotonic Stack**
- Bài này thuộc dạng Monotonic Stack — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — The Number of Weak Characters in the Game example:**

```
arr = [2, 1, 5, 6, 2, 3]
stack (indices): []

i=0: push 0         stack=[0]          (vals: [2])
i=1: 1<2 → push     stack=[0,1]        (vals: [2,1])
i=2: 5>1 → pop, process; 5>2 → pop, process
     push           stack=[2]          (vals: [5])
...
```

---

## Problem Description

The Number of Weak Characters in the Game. ([LeetCode](https://leetcode.com/problems/the-number-of-weak-characters-in-the-game))

Difficulty: Medium | Acceptance: 44.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/the-number-of-weak-characters-in-the-game) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Xác nhận input constraints, edge cases" / Confirm input size, types, edge cases with interviewer
2. **Brute force**: "Bắt đầu từ brute force, rồi optimize" / Always start with naive approach, then optimize
3. **Optimize**: "Phân tích bottleneck của brute force, tìm cách giảm" / Identify the bottleneck and reduce it
4. **Edge cases**: "Input rỗng, một phần tử, giá trị cực biên" / Empty input, single element, boundary values
5. **Follow-up**: "Nếu input rất lớn? Nếu cần streaming?" / What if input is huge? What about streaming?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function theNumberOfWeakCharactersInTheGameBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Monotonic Stack
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function theNumberOfWeakCharactersInTheGame(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Monotonic Stack
  // Hint: Maintain monotonic property, pop when new element breaks it
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(theNumberOfWeakCharactersInTheGame(/* example 1 */)); // expected
// console.log(theNumberOfWeakCharactersInTheGame(/* example 2 */)); // expected
// console.log(theNumberOfWeakCharactersInTheGame(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Shortest Unsorted Continuous Subarray](https://leetcode.com/problems/shortest-unsorted-continuous-subarray) — same pattern: Monotonic Stack
- [Max Chunks To Make Sorted](https://leetcode.com/problems/max-chunks-to-make-sorted) — same pattern: Monotonic Stack
- [Car Fleet](https://leetcode.com/problems/car-fleet) — same pattern: Monotonic Stack
- [Minimum Cost Tree From Leaf Values](https://leetcode.com/problems/minimum-cost-tree-from-leaf-values) — same pattern: Monotonic Stack
- [The Number of Weak Characters in the Game — LeetCode](https://leetcode.com/problems/the-number-of-weak-characters-in-the-game) — problem page
