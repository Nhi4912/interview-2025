---
layout: page
title: "Minimum Cost to Move Chips to The Same Position"
difficulty: Easy
category: Array
tags: [Array, Math, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position"
---

# Minimum Cost to Move Chips to The Same Position / Minimum Cost to Move Chips to The Same Position

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Rabbits in Forest](https://leetcode.com/problems/rabbits-in-forest) | [Smallest Missing Non-negative Integer After Operations](https://leetcode.com/problems/smallest-missing-non-negative-integer-after-operations)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Cost to Move Chips to The Same Position example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Minimum Cost to Move Chips to The Same Position. ([LeetCode](https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position))

Difficulty: Easy | Acceptance: 72.4%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position) for full constraints

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
function minimumCostToMoveChipsToTheSamePositionBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumCostToMoveChipsToTheSamePosition(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumCostToMoveChipsToTheSamePosition(/* example 1 */)); // expected
// console.log(minimumCostToMoveChipsToTheSamePosition(/* example 2 */)); // expected
// console.log(minimumCostToMoveChipsToTheSamePosition(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Rabbits in Forest](https://leetcode.com/problems/rabbits-in-forest) — same pattern: Greedy
- [Smallest Missing Non-negative Integer After Operations](https://leetcode.com/problems/smallest-missing-non-negative-integer-after-operations) — same pattern: Greedy
- [Minimize Length of Array Using Operations](https://leetcode.com/problems/minimize-length-of-array-using-operations) — same pattern: Greedy
- [Minimum Replacements to Sort the Array](https://leetcode.com/problems/minimum-replacements-to-sort-the-array) — same pattern: Greedy
- [Minimum Cost to Move Chips to The Same Position — LeetCode](https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position) — problem page
