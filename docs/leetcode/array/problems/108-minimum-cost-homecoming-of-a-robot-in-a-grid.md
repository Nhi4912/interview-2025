---
layout: page
title: "Minimum Cost Homecoming of a Robot in a Grid"
difficulty: Medium
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-cost-homecoming-of-a-robot-in-a-grid"
---

# Minimum Cost Homecoming of a Robot in a Grid / Minimum Cost Homecoming of a Robot in a Grid

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Largest Number](https://leetcode.com/problems/largest-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống ăn buffet — mỗi lần bạn chọn món ngon nhất hiện tại. Nếu chứng minh được rằng chọn tham lam từng bước vẫn tối ưu toàn cục, thì Greedy là đáp án.

**Pattern Recognition:**

- Signal: "locally optimal → globally optimal" + "sorting + selection" → **Greedy**
- Bài này thuộc dạng Greedy — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Minimum Cost Homecoming of a Robot in a Grid example:**

```
// TODO: Add step-by-step visual for Greedy
// Show one complete example with state at each step
```

---

## Problem Description

Minimum Cost Homecoming of a Robot in a Grid. ([LeetCode](https://leetcode.com/problems/minimum-cost-homecoming-of-a-robot-in-a-grid))

Difficulty: Medium | Acceptance: 51.2%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/minimum-cost-homecoming-of-a-robot-in-a-grid) for full constraints

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
function minimumCostHomecomingOfARobotInAGridBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — Greedy
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function minimumCostHomecomingOfARobotInAGrid(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using Greedy
  // Hint: Sort by key metric, make locally optimal choice at each step
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(minimumCostHomecomingOfARobotInAGrid(/* example 1 */)); // expected
// console.log(minimumCostHomecomingOfARobotInAGrid(/* example 2 */)); // expected
// console.log(minimumCostHomecomingOfARobotInAGrid(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Jump Game II](https://leetcode.com/problems/jump-game-ii) — same pattern: Dynamic Programming
- [Largest Number](https://leetcode.com/problems/largest-number) — same pattern: Greedy
- [Gas Station](https://leetcode.com/problems/gas-station) — same pattern: Greedy
- [Candy](https://leetcode.com/problems/candy) — same pattern: Greedy
- [Minimum Cost Homecoming of a Robot in a Grid — LeetCode](https://leetcode.com/problems/minimum-cost-homecoming-of-a-robot-in-a-grid) — problem page
