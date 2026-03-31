---
layout: page
title: "Burst Balloons"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/burst-balloons"
---

# Burst Balloons / Nổ Bong Bóng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Interval DP
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Strange Printer](https://leetcode.com/problems/strange-printer) | [Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như dọn bàn tiệc — thay vì nghĩ "nổ cái nào trước", hãy nghĩ "cái nào được nổ CUỐI CÙNG trong đoạn [l,r]". Khi đó biên của nó là 1 và nums[l-1] và nums[r+1] vẫn còn.

**Pattern Recognition:**

- Signal: "interval" + "order matters" + "merge/burst operations" → **Interval DP**
- `dp[l][r]` = max coins khi burst tất cả bóng trong khoảng mở (l, r)
- Key insight: Nghĩ backward — k là bóng CUỐI CÙNG bị nổ trong (l, r) → coins = nums[l]*nums[k]*nums[r]

**Visual — nums=[3,1,5,8] → padded=[1,3,1,5,8,1]:**

```
dp[l][r] = max coins bursting everything strictly between l and r

Interval (0,5): try k=1,2,3,4 as last balloon
  k=4 (val=8): coins = nums[0]*nums[4]*nums[5] = 1*8*1=8
               + dp[0][4] + dp[4][5]
  ...
  k=1 (val=3): dp[0][1]=0, burst k=1: 1*3*1=3, dp[1][5]=...
               Build up from smaller intervals!
Answer: dp[0][5] = 167
```

---

## Problem Description

Given `n` balloons with values `nums`, burst them one by one. When you burst balloon `i`, earn `nums[i-1] * nums[i] * nums[i+1]` coins (neighbors at time of bursting). Return maximum coins. Boundaries are treated as 1. ([LeetCode 312](https://leetcode.com/problems/burst-balloons))

- Example 1: `nums=[3,1,5,8]` → `167`
- Example 2: `nums=[1,5]` → `10`

Constraints: `1 ≤ n ≤ 300`, `0 ≤ nums[i] ≤ 100`

---

## 📝 Interview Tips

1. **Key insight**: "Đừng nghĩ ai nổ trước — nghĩ ai nổ CUỐI CÙNG trong khoảng" / Think last-to-burst, not first
2. **Padding**: "Thêm 1 vào hai đầu để xử lý boundary — nums = [1, ...original, 1]" / Add sentinel 1s
3. **State**: "`dp[l][r]` = max coins khi burst tất cả trong khoảng MỞ (l, r)" / Open interval is cleaner
4. **Transition**: "k là last balloon: `coins = nums[l]*nums[k]*nums[r] + dp[l][k] + dp[k][r]`" / Combine sub-intervals
5. **Order**: "Fill by increasing interval length: len=2,3,...,n" / Smaller intervals first
6. **Complexity**: "O(n³) time, O(n²) space — standard interval DP" / Classic n³ complexity

---

## Solutions

```typescript
/**
 * Solution 1: Recursion + Memoization (Top-Down)
 * Time: O(n³)
 * Space: O(n²)
 */
function maxCoinsMemo(nums: number[]): number {
  const arr = [1, ...nums, 1];
  const n = arr.length;
  const memo: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1));

  function dp(l: number, r: number): number {
    if (r - l < 2) return 0; // no balloons between l and r
    if (memo[l][r] !== -1) return memo[l][r];

    let best = 0;
    for (let k = l + 1; k < r; k++) {
      // k is the LAST balloon to burst in open interval (l, r)
      const coins = arr[l] * arr[k] * arr[r] + dp(l, k) + dp(k, r);
      best = Math.max(best, coins);
    }
    return (memo[l][r] = best);
  }

  return dp(0, n - 1);
}

/**
 * Solution 2: Bottom-Up Interval DP
 * Time: O(n³)
 * Space: O(n²)
 */
function maxCoins(nums: number[]): number {
  const arr = [1, ...nums, 1];
  const n = arr.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // Fill by increasing interval length (gap between l and r)
  for (let gap = 2; gap < n; gap++) {
    for (let l = 0; l + gap < n; l++) {
      const r = l + gap;
      for (let k = l + 1; k < r; k++) {
        const coins = arr[l] * arr[k] * arr[r] + dp[l][k] + dp[k][r];
        dp[l][r] = Math.max(dp[l][r], coins);
      }
    }
  }

  return dp[0][n - 1];
}

// === Test Cases ===
console.log(maxCoins([3, 1, 5, 8])); // 167
console.log(maxCoins([1, 5])); // 10
console.log(maxCoins([5])); // 5
console.log(maxCoins([1, 2, 3])); // 12
```

---

## 🔗 Related Problems

- [Strange Printer](https://leetcode.com/problems/strange-printer) — interval DP với print operations
- [Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones) — interval DP merge
- [Zuma Game](https://leetcode.com/problems/zuma-game) — interval DP xóa chuỗi
- [Scramble String](https://leetcode.com/problems/scramble-string) — 3D interval DP
- [Optimal BST](https://leetcode.com/problems/unique-binary-search-trees-ii) — interval DP on trees
