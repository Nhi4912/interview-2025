---
layout: page
title: "Two Furthest Houses With Different Colors"
difficulty: Easy
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/two-furthest-houses-with-different-colors"
---

# Two Furthest Houses With Different Colors / Two Furthest Houses With Different Colors

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Largest Number](https://leetcode.com/problems/largest-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Two Furthest Houses With Different Colors example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Two Furthest Houses With Different Colors. ([LeetCode](https://leetcode.com/problems/two-furthest-houses-with-different-colors))

Difficulty: Easy | Acceptance: 65.6%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/two-furthest-houses-with-different-colors) for full constraints

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
function twoFurthestHousesWithDifferentColorsBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function twoFurthestHousesWithDifferentColors(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(twoFurthestHousesWithDifferentColors(/* example 1 */)); // expected
// console.log(twoFurthestHousesWithDifferentColors(/* example 2 */)); // expected
// console.log(twoFurthestHousesWithDifferentColors(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Jump Game II](https://leetcode.com/problems/jump-game-ii) — same pattern: Dynamic Programming
- [Largest Number](https://leetcode.com/problems/largest-number) — same pattern: Greedy
- [Gas Station](https://leetcode.com/problems/gas-station) — same pattern: Greedy
- [Candy](https://leetcode.com/problems/candy) — same pattern: Greedy
- [Two Furthest Houses With Different Colors — LeetCode](https://leetcode.com/problems/two-furthest-houses-with-different-colors) — problem page
