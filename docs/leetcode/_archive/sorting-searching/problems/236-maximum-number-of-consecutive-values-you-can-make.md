---
layout: page
title: "Maximum Number of Consecutive Values You Can Make"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-consecutive-values-you-can-make"
---

# Maximum Number of Consecutive Values You Can Make / Maximum Number of Consecutive Values You Can Make

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Largest Number](https://leetcode.com/problems/largest-number) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy / Gốc nhìn:** Xây cầu qua sông bằng những tấm ván. Nếu khoảng hở tiếp theo ≤ tổng ván đã có + 1, ta có thể bắc qua. Nếu khoảng hở quá lớn, ta không thể đi tiếp.

**Pattern Recognition:**

- Keyword: "consecutive values from subsets" + "sort" → **Greedy Reach Extension**
- Key insight: nếu `reach = r` (có thể tạo mọi giá trị [0..r]), coin tiếp theo `c ≤ r+1` → extend reach = `r + c`
- Nếu `c > r+1` → có gap [r+1..c-1] không thể tạo → dừng

**Visual — Reach Extension:**

```
coins=[1,1,1,4], sorted=[1,1,1,4]
reach=0 → coin=1 ≤ 0+1=1 → reach=1   (can make [0..1])
reach=1 → coin=1 ≤ 1+1=2 → reach=2   (can make [0..2])
reach=2 → coin=1 ≤ 2+1=3 → reach=3   (can make [0..3])
reach=3 → coin=4 ≤ 3+1=4 → reach=7   (can make [0..7])
Answer = reach+1 = 8
```

---

## Problem Description

Cho mảng `coins` (các đồng xu). Tìm số lượng giá trị liên tiếp bắt đầu từ 0 mà bạn có thể tạo ra bằng cách chọn **bất kỳ tập con** của coins.

**Example 1:** `coins=[1,3]` → có thể tạo 0,1 → reach=1, coin 3 > 2 → dừng → `2`
**Example 2:** `coins=[1,1,1,4]` → reach mở rộng: 0→1→2→3→7 → `8`
**Example 3:** `coins=[1,2,3,4]` → 0→1→3→6→10 → `11`

Constraints: `1 ≤ coins.length ≤ 4×10⁴`, `1 ≤ coins[i] ≤ 4×10⁴`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Có thể dùng mỗi coin nhiều lần không?" — Không, mỗi coin dùng tối đa 1 lần / Each coin used at most once (subset, not multiset)
2. **Brute Force**: "Duyệt tất cả subsets 2^n, check từng tổng" → O(2^n) TLE / Enumerate all subsets — TLE
3. **Insight**: "Sau khi sort: nếu coin ≤ reach+1 thì reach += coin, else gap → stop" / Sort first, then greedy extend
4. **Prove Greedy**: "Nếu coin ≤ reach+1, ta đã có [0..reach], thêm coin cho [coin..reach+coin]" / Inductive proof via range extension
5. **Edge Case**: "coins=[5] → chỉ có 0 → return 1; coins=[1] → có 0,1 → return 2" / Single large coin yields answer 1
6. **Follow-up**: "Nếu coins không giới hạn (unbounded)?" — vẫn greedy, nhưng cần sort bỏ > reach+1 / Still greedy, prune early

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Greedy Reach Extension (Optimal)
 * @time O(n log n) — dominated by sort; single O(n) scan
 * @space O(1)
 */
function getMaximumConsecutive(coins: number[]): number {
  coins.sort((a, b) => a - b);
  let reach = 0; // can currently make all values in [0..reach]

  for (const c of coins) {
    if (c > reach + 1) break; // gap: [reach+1..c-1] unreachable
    reach += c; // extend: now can make [0..reach+c]
  }
  return reach + 1; // count of values: 0,1,...,reach
}

/**
 * Solution 2: 0/1 Knapsack DP (Brute-force reference, correct but slower)
 * @time O(n × S) where S = sum of all coins — up to ~1.6×10⁹ (TLE on large input)
 * @space O(S)
 */
function getMaximumConsecutiveDP(coins: number[]): number {
  const S = coins.reduce((a, b) => a + b, 0);
  const dp = new Uint8Array(S + 1); // dp[v]=1 if value v is reachable
  dp[0] = 1;

  for (const c of coins) {
    // Standard 0/1 knapsack: iterate backwards to avoid reuse
    for (let v = S; v >= c; v--) {
      if (dp[v - c]) dp[v] = 1;
    }
  }

  let result = 0;
  while (result <= S && dp[result]) result++;
  return result;
}

// === Test Cases ===
console.log(getMaximumConsecutive([1, 3])); // 2  (can make 0,1)
console.log(getMaximumConsecutive([1, 1, 1, 4])); // 8  (can make 0..7)
console.log(getMaximumConsecutive([1, 2, 3, 4])); // 11 (can make 0..10)
console.log(getMaximumConsecutive([5])); // 1  (only 0)
console.log(getMaximumConsecutiveDP([1, 1, 1, 4])); // 8
```

---

## 🔗 Related Problems

- [Patching Array](https://leetcode.com/problems/patching-array) — identical reach-extension greedy, add minimum patch
- [Jump Game II](https://leetcode.com/problems/jump-game-ii) — greedy range extension on positions
- [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) — sort + greedy selection
- [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum) — knapsack DP for subset sums
- [Coin Change II](https://leetcode.com/problems/coin-change-ii) — count subsets reaching target sum
