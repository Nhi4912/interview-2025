---
layout: page
title: "Remove Colored Pieces if Both Neighbors are the Same Color"
difficulty: Medium
category: String
tags: [Math, String, Greedy, Game Theory]
leetcode_url: "https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color"
---

# Remove Colored Pieces if Both Neighbors are the Same Color / Remove Colored Pieces if Both Neighbors are the Same Color

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Sum Game](https://leetcode.com/problems/sum-game) | [Guess the Word](https://leetcode.com/problems/guess-the-word)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Remove Colored Pieces if Both Neighbors are the Same Color example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Remove Colored Pieces if Both Neighbors are the Same Color. ([LeetCode](https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color))

Difficulty: Medium | Acceptance: 62.8%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color) for full constraints

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
function removeColoredPiecesIfBothNeighborsAreTheSameColorBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function removeColoredPiecesIfBothNeighborsAreTheSameColor(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(removeColoredPiecesIfBothNeighborsAreTheSameColor(/* example 1 */)); // expected
// console.log(removeColoredPiecesIfBothNeighborsAreTheSameColor(/* example 2 */)); // expected
// console.log(removeColoredPiecesIfBothNeighborsAreTheSameColor(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Sum Game](https://leetcode.com/problems/sum-game) — same pattern: Greedy
- [Guess the Word](https://leetcode.com/problems/guess-the-word) — same pattern: Math
- [Stone Game IX](https://leetcode.com/problems/stone-game-ix) — same pattern: Greedy
- [Minimum Swaps to Make Strings Equal](https://leetcode.com/problems/minimum-swaps-to-make-strings-equal) — same pattern: Greedy
- [Remove Colored Pieces if Both Neighbors are the Same Color — LeetCode](https://leetcode.com/problems/remove-colored-pieces-if-both-neighbors-are-the-same-color) — problem page
