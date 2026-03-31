---
layout: page
title: "Distribute Candies Among Children II"
difficulty: Medium
category: Math
tags: [Math, Combinatorics, Enumeration]
leetcode_url: "https://leetcode.com/problems/distribute-candies-among-children-ii"
---

# Distribute Candies Among Children II / Chia Kẹo Cho Trẻ Em II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math / Enumeration
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Distribute Candies Among Children I](https://leetcode.com/problems/distribute-candies-among-children-i) | [Count the Number of Good Subsequences](https://leetcode.com/problems/count-the-number-of-good-subsequences)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chia `n` viên kẹo cho 3 đứa trẻ, mỗi đứa không được quá `limit` viên. Fix số kẹo cho đứa đầu tiên, rồi đếm số cách chia phần còn lại cho 2 đứa còn lại — đây là bài toán interval đơn giản.

**Pattern Recognition:**

- Signal: "count ways" + "3 variables" + "upper bound constraint" → **Enumerate + count valid range**
- Fix child1 = i → remaining = n - i; cần x2 + x3 = remaining, 0 ≤ x2, x3 ≤ limit
- x2 ∈ [max(0, remaining − limit), min(remaining, limit)] → count = hi − lo + 1 if hi ≥ lo

**Visual — n=5, limit=2:**

```
child1=0: rem=5, x2∈[3,2] → invalid (3>2)
child1=1: rem=4, x2∈[2,2] → 1 way  (2,2)
child1=2: rem=3, x2∈[1,2] → 2 ways (1,2),(2,1)
child1=3: rem=2, x2∈[0,2] → 3 ways (0,2),(1,1),(2,0)
child1=4: rem=1, x2∈[0,1] → 2 ways
child1=5: rem=0, x2∈[0,0] → 1 way
Total = 0+1+2+3+2+1 = 9 ✅
```

---

## Problem Description

Count the number of ways to distribute `n` candies among 3 children such that each child receives at most `limit` candies. ([LeetCode #2928](https://leetcode.com/problems/distribute-candies-among-children-ii))

Difficulty: Medium | Acceptance: 56.1%

- **Example 1**: `n=5, limit=2` → `3` (ways: (1,2,2),(2,1,2),(2,2,1))
- **Example 2**: `n=3, limit=3` → `10`

Constraints:

- `1 ≤ n ≤ 10⁶`
- `1 ≤ limit ≤ 10⁶`

---

## 📝 Interview Tips

1. **Clarify**: "Mỗi trẻ có thể nhận 0 kẹo không?" / Can a child receive 0 candies?
2. **Brute force**: "3 vòng for O(n²) → TLE với n=10⁶" / Triple loop is O(n²), too slow
3. **Enumerate**: "Fix child1, tính range hợp lệ cho child2 → O(n) tổng" / Fix one child: O(n) with O(1) per step
4. **Inclusion-Exclusion**: "Tổng không giới hạn − 3×(một child > limit) + 3×(hai child > limit) − ... → O(1)" / Closed-form formula
5. **Edge cases**: "Nếu n > 3×limit → 0 cách; n = 0 → 1 cách (0,0,0)" / When impossible or trivially zero

---

## Solutions

```typescript
/**
 * Solution 1: Enumerate First Child — O(n)
 * Time: O(min(n, limit)) — at most limit+1 values for child1
 * Space: O(1) — running counter
 */
function distributeCandiesEnum(n: number, limit: number): number {
  let count = 0;
  // child1 gets i candies, i in [0, min(n, limit)]
  for (let i = 0; i <= Math.min(n, limit); i++) {
    const rem = n - i;
    // child2 + child3 = rem, each in [0, limit]
    const lo = Math.max(0, rem - limit);
    const hi = Math.min(rem, limit);
    if (hi >= lo) count += hi - lo + 1;
  }
  return count;
}

/**
 * Solution 2: Inclusion-Exclusion — O(1)
 * Time: O(1) — closed-form arithmetic
 * Space: O(1)
 *
 * Without upper bound: C(n+2, 2) ways (stars and bars for x1+x2+x3=n, xi≥0)
 * Subtract: 3 × C(n-limit+1, 2) (at least one child exceeds limit: substitute yi=xi-limit-1)
 * Add back: 3 × C(n-2*(limit+1)+2, 2) (at least two children exceed)
 * C(k, 2) = k*(k-1)/2 for k≥2, else 0
 */
function distributeCandies(n: number, limit: number): number {
  const C2 = (k: number): number => (k >= 2 ? (k * (k - 1)) / 2 : k === 1 ? 0 : 0);
  return (
    C2(n + 2) -
    3 * C2(n - limit + 1) +
    3 * C2(n - 2 * (limit + 1) + 2) -
    C2(n - 3 * (limit + 1) + 2)
  );
}

// === Test Cases ===
console.log(distributeCandies(5, 2)); // 3
console.log(distributeCandies(3, 3)); // 10
console.log(distributeCandies(0, 5)); // 1  (0,0,0)
console.log(distributeCandies(6, 2)); // 1  (2,2,2)
console.log(distributeCandies(7, 2)); // 0  (impossible: max is 6)
console.log(distributeCandiesEnum(5, 2)); // 3
console.log(distributeCandiesEnum(3, 3)); // 10
```

---

## 🔗 Related Problems

- [Distribute Candies Among Children I](https://leetcode.com/problems/distribute-candies-among-children-i) — smaller n, brute force acceptable
- [Count the Number of Good Subsequences](https://leetcode.com/problems/count-the-number-of-good-subsequences) — combinatorics with modular arithmetic
- [Count All Valid Pickup and Delivery Options](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options) — combinatorics
- [Number of Ways to Split a String](https://leetcode.com/problems/number-of-ways-to-split-a-string) — counting with combinatorics
- [Count the Number of Infection Sequences](https://leetcode.com/problems/count-the-number-of-infection-sequences) — inclusion-exclusion
