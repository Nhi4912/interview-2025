---
layout: page
title: "Tallest Billboard"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/tallest-billboard"
---

# Tallest Billboard / Biển Quảng Cáo Cao Nhất

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 | **Company tags**: Google, Airbnb

## 🧠 Intuition / Tư Duy

**Analogy:** Như chia đồ sau ly hôn — hai người cùng nhận đồ từ một danh sách, mục tiêu là cả hai tổng bằng nhau và tổng đó lớn nhất. Theo dõi chênh lệch (hiệu) giữa hai cột và chiều cao cột thấp hơn.

**Pattern Recognition:**

- "Split rods into two equal-sum groups, maximize sum" → DP keyed on height difference
- dp[diff] = max height of the shorter leg when (taller - shorter) = diff
- For each rod: add to taller leg (diff grows), add to shorter leg (diff shrinks or flips), or skip

**Visual:**

```
rods=[1,2,3,6]   target: two legs of equal height, max height
dp[diff] = max shorter-leg height

Init: dp[0]=0
+rod=1: dp[1]=0  (longer gets rod, shorter=0, diff=1)
+rod=2: dp[3]=0, dp[2]=0, dp[1]=1, dp[0]=1 (add 2 to shorter of diff=1 case)
+rod=3: ... dp[0]=3 found! → two legs both height 3? no, (1+2=3 vs 3)
+rod=6: dp[0]=6  ← answer=6  (leg1=[6], leg2=[1,2,3])
```

## Problem Description

Given a list of `rods`, weld some rods to build two steel legs of equal height. Return the largest possible height, or 0 if impossible.

Examples: [1,2,3,6] → 6; [1,2,3,4,5,6] → 10; [1,2] → 0.

## 📝 Interview Tips

1. **Clarify**: Mỗi thanh chỉ dùng một lần — không dùng lại / each rod used at most once.
2. **Approach**: Key: dp[diff] = max shorter-leg height; iterate over rods, for each rod try 3 options (skip, add to taller, add to shorter).
3. **Edge cases**: Nếu không thể chia đều → dp[0] vẫn là 0 (init value) → return 0.
4. **Optimize**: Dùng Map thay vì mảng vì diff có thể dương hoặc âm / Map<diff,shorter> handles negative diffs naturally.
5. **Follow-up**: Khôi phục cách chia — backtrack qua từng quyết định khi xử lý rod.
6. **Complexity**: Time O(n × S), Space O(S) where S = sum of all rods ≤ 5000.

## Solutions

```typescript
/** Solution 1: DP with difference map
 * Time: O(n * S) | Space: O(S)  S = sum of rods
 */
function tallestBillboard(rods: number[]): number {
  // dp[diff] = max height of the shorter leg when legs differ by diff
  let dp = new Map<number, number>([[0, 0]]);
  for (const rod of rods) {
    const cur = new Map(dp);
    for (const [diff, shorter] of cur) {
      const taller = shorter + diff;
      // Option 1: add rod to taller leg (diff increases)
      const d1 = diff + rod;
      dp.set(d1, Math.max(dp.get(d1) ?? 0, shorter));
      // Option 2: add rod to shorter leg
      if (rod <= diff) {
        // shorter grows but stays shorter
        const d2 = diff - rod;
        dp.set(d2, Math.max(dp.get(d2) ?? 0, shorter + rod));
      } else {
        // shorter overtakes taller — swap roles
        const d2 = rod - diff;
        dp.set(d2, Math.max(dp.get(d2) ?? 0, taller));
      }
      // Option 3: skip rod → already in dp from cur
    }
  }
  return dp.get(0) ?? 0;
}

/** Solution 2: DP with offset array (faster constants)
 * Time: O(n * S) | Space: O(S)
 */
function tallestBillboard2(rods: number[]): number {
  const S = rods.reduce((a, b) => a + b, 0);
  // dp[diff + S] = max shorter-leg height; offset S for negative diffs
  const dp = new Array<number>(2 * S + 1).fill(-1);
  dp[S] = 0; // diff = 0 at start
  for (const rod of rods) {
    const prev = [...dp];
    for (let d = 0; d <= 2 * S; d++) {
      if (prev[d] < 0) continue;
      const shorter = prev[d];
      const diff = d - S;
      const taller = shorter + diff;
      // Add rod to taller side
      if (d + rod <= 2 * S) dp[d + rod] = Math.max(dp[d + rod], shorter);
      // Add rod to shorter side
      const newDiff = diff - rod; // can be negative
      const nd = newDiff + S;
      if (nd >= 0 && nd <= 2 * S) {
        const newShorter = newDiff >= 0 ? shorter + rod : taller;
        dp[nd] = Math.max(dp[nd], newShorter);
      }
    }
  }
  return Math.max(0, dp[S]);
}

// Tests
console.log(tallestBillboard([1, 2, 3, 6])); // 6
console.log(tallestBillboard([1, 2, 3, 4, 5, 6])); // 10
console.log(tallestBillboard([1, 2])); // 0
console.log(tallestBillboard2([1, 2, 3, 6])); // 6
console.log(tallestBillboard2([1, 2, 3, 4, 5, 6])); // 10
console.log(tallestBillboard2([1, 2])); // 0
```

## 🔗 Related Problems

| Problem                                                                                | Relationship                                             |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum) | DP on subset sums                                        |
| [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii)             | Minimize difference between two groups                   |
| [Target Sum](https://leetcode.com/problems/target-sum)                                 | Assign +/- to reach target — same DP keyed on difference |
