---
layout: page
title: "Sell Diminishing-Valued Colored Balls"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Math, Binary Search, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/sell-diminishing-valued-colored-balls"
---

# Sell Diminishing-Valued Colored Balls / Bán Bóng Màu Giảm Giá Trị

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Greedy Sweep / Binary Search + Math
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Giống bán cổ phiếu theo giá cao nhất trước:** luôn bán màu bóng nhiều nhất (giá trị cao nhất). Thay vì simulate từng quả, tính toán số học cho từng "level" — bán tất cả màu ở level cao trước khi xuống level thấp.

**Pattern Recognition:**

- Signal: "always pick max, value decreases, sell k total" → **Sort desc + Sweep by level**
- Arithmetic series: bán từ level h xuống l: `sum = (h + l+1) * (h - l) / 2`
- Binary search variant: tìm cutoff level t, tính revenue bằng math

**Visual:**

```
inventory=[2,5], orders=4
Sorted desc: [5,2]

Level 5→3: 1 color (just [5])
  balls = (5-2)*1=3 ≤ 4, revenue += (5+3)*3/2=12, orders=4-3=1
Level 2: 2 colors ([5→2],[2])
  balls = (2-1)*2=2 > 1 remaining
  sell 1 ball at level 2 → 1*2=2, orders=0
Total revenue = 12+2=14 ✅
```

## Problem Description

Given `inventory[i]` (balls of color i) and integer `orders`, sell `orders` balls to maximize revenue. Each time you sell a ball of color i, its value decreases by 1 (equal to current count of color i). Return max revenue mod `10^9+7`.

- Example 1: `inventory=[2,5], orders=4` → `14`
- Example 2: `inventory=[3,5], orders=6` → `19`

## 📝 Interview Tips

1. **Clarify**: Có thể bán nhiều màu cùng level không? / Can we sell multiple colors at same level? Yes
2. **Approach**: Sort desc, sweep level by level using math / Arithmetic series formula avoids O(max) iteration
3. **Edge cases**: orders > total inventory? Not possible per constraints / orders ≤ sum(inventory)
4. **Optimize**: O(n log n + n) sweep is optimal / Avoid O(orders) simulation which is up to 10^9
5. **Follow-up**: Minimize revenue? / Sell cheapest first → same approach from bottom up
6. **Complexity**: Time O(n log n), Space O(1) / After sort, single pass

## Solutions

```typescript
const MOD = 1_000_000_007n;

/** Solution 1: Brute Force – Simulate One Ball at a Time (TLE for large input)
 * Time: O(orders * log n) | Space: O(n)
 */
function maxProfitBrute(inventory: number[], orders: number): number {
  // Use a max-heap (simulate with sort)
  const arr = [...inventory].sort((a, b) => b - a);
  let rev = 0n;
  for (let i = 0; i < orders; i++) {
    rev = (rev + BigInt(arr[0])) % MOD;
    arr[0]--;
    // Re-sort (simple bubble for demo)
    let j = 0;
    while (j + 1 < arr.length && arr[j] < arr[j + 1]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      j++;
    }
  }
  return Number(rev);
}

/** Solution 2: Sort + Greedy Level Sweep
 * Time: O(n log n) | Space: O(1)
 */
function maxProfit(inventory: number[], orders: number): number {
  inventory.sort((a, b) => b - a); // descending
  const n = inventory.length;
  let revenue = 0n;
  let rem = orders;

  // Triangle sum: sum from lo+1 to hi (inclusive) = (hi*(hi+1)/2) - (lo*(lo+1)/2)
  const triSum = (lo: number, hi: number): bigint => {
    const H = BigInt(hi),
      L = BigInt(lo);
    return (H * (H + 1n)) / 2n - (L * (L + 1n)) / 2n;
  };

  for (let i = 0; i < n && rem > 0; i++) {
    const currLevel = inventory[i];
    const nextLevel = i + 1 < n ? inventory[i + 1] : 0;
    const colors = i + 1; // number of colors at this level
    const ballsInRange = (currLevel - nextLevel) * colors;

    if (ballsInRange <= rem) {
      // Sell all balls from currLevel down to nextLevel+1 for all `colors` colors
      revenue = (revenue + BigInt(colors) * triSum(nextLevel, currLevel)) % MOD;
      rem -= ballsInRange;
    } else {
      // Sell `rem` balls starting from currLevel downward across `colors` colors
      const fullRows = Math.floor(rem / colors); // complete rows we can sell
      const extra = rem % colors; // partial row
      const bottom = currLevel - fullRows;
      revenue = (revenue + BigInt(colors) * triSum(bottom, currLevel)) % MOD;
      revenue = (revenue + BigInt(extra) * BigInt(bottom)) % MOD;
      rem = 0;
    }
  }
  return Number(revenue);
}

// Tests
console.log(maxProfit([2, 5], 4)); // 14
console.log(maxProfit([3, 5], 6)); // 19
console.log(maxProfit([1000000000], 1000000000)); // 21
console.log(maxProfit([2, 8, 4, 10, 6], 20)); // 110 (sell all)
console.log(maxProfitBrute([2, 5], 4)); // 14
console.log(maxProfit([497978859, 167261111, 483575207, 591579781], 836556809)); // 373219333
```

## 🔗 Related Problems

| Problem                                                                                                                        | Relationship                      |
| ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| [Minimum Cost to Hire K Workers](https://leetcode.com/problems/minimum-cost-to-hire-k-workers)                                 | Sort + greedy selection           |
| [Stone Game VI](https://leetcode.com/problems/stone-game-vi)                                                                   | Greedy ball allocation            |
| [Maximize Number of Events That Can Be Attended](https://leetcode.com/problems/maximize-number-of-events-that-can-be-attended) | Greedy selection with constraints |
