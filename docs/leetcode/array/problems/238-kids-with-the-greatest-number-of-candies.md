---
layout: page
title: "Kids With the Greatest Number of Candies"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/kids-with-the-greatest-number-of-candies"
---

# Kids With the Greatest Number of Candies / Trẻ Em Có Nhiều Kẹo Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Can Place Flowers](https://leetcode.com/problems/can-place-flowers) | [Richest Customer Wealth](https://leetcode.com/problems/richest-customer-wealth)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như cuộc thi ăn kẹo — trước tiên tìm người có nhiều nhất hiện tại, sau đó hỏi từng bé: "Nếu cho thêm `extraCandies` kẹo, em có bằng hoặc vượt champion không?" Chỉ cần so sánh một lần.

**Pattern Recognition:**

- Find global max first (one pass), then check each element (second pass)
- `candies[i] + extraCandies >= maxCandies` → true for kid i

**Visual — Two-pass approach:**

```
candies = [2,3,5,1,3], extraCandies = 3
maxCandies = 5

kid 0: 2+3=5 >= 5 → true
kid 1: 3+3=6 >= 5 → true
kid 2: 5+3=8 >= 5 → true
kid 3: 1+3=4 >= 5 → false
kid 4: 3+3=6 >= 5 → true

result = [true,true,true,false,true] ✅
```

---

## Problem Description

Given array `candies` where `candies[i]` is kid i's candy count, and integer `extraCandies`, return a boolean array `result` where `result[i]` is true if giving kid i all `extraCandies` makes them have the greatest (or tied greatest) number among all kids. ([LeetCode 1431](https://leetcode.com/problems/kids-with-the-greatest-number-of-candies))

Difficulty: Easy | Acceptance: 88.1%

```
Example 1: candies=[2,3,5,1,3], extraCandies=3 → [true,true,true,false,true]
Example 2: candies=[4,2,1,1,2], extraCandies=1 → [true,false,false,false,false]
```

Constraints:

- `2 <= n <= 100`
- `1 <= candies[i] <= 100`
- `1 <= extraCandies <= 50`

---

## 📝 Interview Tips

1. **Clarify**: "Nếu hai bé bằng nhau sau khi cộng có tính là 'greatest' không?" / Tied for greatest still counts as greatest → true
2. **Find max first**: "Tìm max một lần, rồi so sánh từng phần tử" / Pre-compute max to avoid O(n²) re-comparison
3. **One-liner**: "Dùng Math.max + map là đủ" / Simple map with arrow function is idiomatic
4. **Edge case**: "Tất cả bằng nhau → tất cả true" / All equal → all true since tied is valid
5. **Follow-up**: "Nếu cho extraCandies vào nhiều bé khác nhau? → greedy problem" / Distributing to multiple kids → different problem
6. **Complexity**: "O(n) time, O(1) space ngoài output" / O(n) time, output array doesn't count as extra space

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — recompute max for each kid
 * Time: O(n²) — for each kid, scan all others to find max
 * Space: O(1) — no extra storage beyond output
 */
function kidsWithCandiesBrute(candies: number[], extraCandies: number): boolean[] {
  return candies.map((c, i) => {
    // max of all OTHER kids (they don't get extra candies)
    const maxOthers = candies.reduce((m, v, j) => (j !== i ? Math.max(m, v) : m), 0);
    return c + extraCandies >= maxOthers;
  });
}

/**
 * Solution 2: Pre-compute Max (optimal)
 * Time: O(n) — two passes: one for max, one for comparison
 * Space: O(1) — only output array
 */
function kidsWithTheGreatestNumberOfCandies(candies: number[], extraCandies: number): boolean[] {
  const maxCandies = Math.max(...candies);
  return candies.map((c) => c + extraCandies >= maxCandies);
}

/**
 * Solution 3: Functional one-liner
 * Time: O(n) | Space: O(1)
 */
function kidsWithCandiesOneLiner(candies: number[], extraCandies: number): boolean[] {
  const max = candies.reduce((a, b) => Math.max(a, b), 0);
  return candies.map((c) => c + extraCandies >= max);
}

// === Test Cases ===
console.log(kidsWithTheGreatestNumberOfCandies([2, 3, 5, 1, 3], 3)); // [true,true,true,false,true]
console.log(kidsWithTheGreatestNumberOfCandies([4, 2, 1, 1, 2], 1)); // [true,false,false,false,false]
console.log(kidsWithTheGreatestNumberOfCandies([1, 1], 1)); // [true,true]
console.log(kidsWithTheGreatestNumberOfCandies([12, 1, 12], 10)); // [true,false,true]
```

---

## 🔗 Related Problems

- [Can Place Flowers](https://leetcode.com/problems/can-place-flowers) — same pattern: simple array scan
- [Richest Customer Wealth](https://leetcode.com/problems/richest-customer-wealth) — find max then compare
- [Lucky Numbers in a Matrix](https://leetcode.com/problems/lucky-numbers-in-a-matrix) — precompute row min / col max
- [Kids With the Greatest Number of Candies — LeetCode](https://leetcode.com/problems/kids-with-the-greatest-number-of-candies) — problem page
