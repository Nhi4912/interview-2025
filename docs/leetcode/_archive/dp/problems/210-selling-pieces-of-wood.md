---
layout: page
title: "Selling Pieces of Wood"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Memoization]
leetcode_url: "https://leetcode.com/problems/selling-pieces-of-wood"
---

# Selling Pieces of Wood / Bán Gỗ Theo Mảnh

---

## 🧠 Intuition / Tư Duy

**Analogy:** > Bạn có tấm gỗ m×n. Khách mua các miếng nhỏ với giá cố định. Bạn có thể cắt dọc hoặc ngang bao nhiêu lần tùy ý.  
> Giống cắt pizza: mỗi lần cắt tạo 2 phần, tối ưu hóa doanh thu từng phần.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Selling Pieces of Wood example:**

```
m=3, n=5, prices=[[1,4,2],[2,2,7],[2,1,3]]
dp[h][w] = max profit for piece of height h, width w

dp[1][4] = 2  (from prices)
dp[2][2] = 7  (from prices)
dp[3][5]:
  try cut row at h=1: dp[1][5] + dp[2][5]
  try cut row at h=2: dp[2][5] + dp[1][5]
  try cut col at w=1: dp[3][1] + dp[3][4]
  try cut col at w=2: dp[3][2] + dp[3][3]
  ...
  Best = 19
```

---

## Problem Description

Given an `m × n` board and `prices[i] = [hi, wi, pricei]`, you can make horizontal/vertical cuts to
split the board into pieces and sell each piece. Return the **maximum** total money you can earn.

**Constraints:** `1 <= m, n <= 200`, `1 <= prices.length <= 10000`

---

## 📝 Interview Tips

1. **DP state** — `dp[h][w]` = max profit for a `h × w` piece; transition tries all cuts.
2. **Base case** — initialize `dp[h][w]` from price list directly.
3. **Horizontal cut** — for cut at row `i`: `dp[h][w] = max(dp[i][w] + dp[h-i][w])` for `1 <= i < h`.
4. **Vertical cut** — for cut at col `j`: `dp[h][w] = max(dp[h][j] + dp[h][w-j])` for `1 <= j < w`.
5. **Order matters** — build dp from small pieces to large (bottom-up).
6. **Complexity** — O(m*n*(m+n)) which is O(200*200*400) ≈ 16M ops — fast enough.

---

## Solutions

```typescript
function sellingWood(m: number, n: number, prices: number[][]): number {
  // dp[h][w] = max profit for h×w piece
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Initialize from given prices
  for (const [h, w, price] of prices) {
    dp[h][w] = Math.max(dp[h][w], price);
  }

  // Fill bottom-up
  for (let h = 1; h <= m; h++) {
    for (let w = 1; w <= n; w++) {
      // Horizontal cuts: split at row i
      for (let i = 1; i < h; i++) {
        dp[h][w] = Math.max(dp[h][w], dp[i][w] + dp[h - i][w]);
      }
      // Vertical cuts: split at col j
      for (let j = 1; j < w; j++) {
        dp[h][w] = Math.max(dp[h][w], dp[h][j] + dp[h][w - j]);
      }
    }
  }

  return dp[m][n];
}

console.log(
  sellingWood(3, 5, [
    [1, 4, 2],
    [2, 2, 7],
    [2, 1, 3],
  ]),
); // 19
console.log(
  sellingWood(4, 6, [
    [3, 2, 10],
    [1, 4, 2],
    [4, 1, 3],
  ]),
); // 32
console.log(sellingWood(1, 1, [[1, 1, 5]])); // 5

function sellingWoodMemo(m: number, n: number, prices: number[][]): number {
  const priceMap = new Map<string, number>();
  for (const [h, w, price] of prices) {
    const key = `${h},${w}`;
    priceMap.set(key, Math.max(priceMap.get(key) ?? 0, price));
  }

  const memo = new Map<string, number>();

  function dp(h: number, w: number): number {
    const key = `${h},${w}`;
    if (memo.has(key)) return memo.get(key)!;

    let best = priceMap.get(key) ?? 0;

    // Try horizontal cuts
    for (let i = 1; i < h; i++) {
      best = Math.max(best, dp(i, w) + dp(h - i, w));
    }
    // Try vertical cuts
    for (let j = 1; j < w; j++) {
      best = Math.max(best, dp(h, j) + dp(h, w - j));
    }

    memo.set(key, best);
    return best;
  }

  return dp(m, n);
}

console.log(
  sellingWoodMemo(3, 5, [
    [1, 4, 2],
    [2, 2, 7],
    [2, 1, 3],
  ]),
); // 19
console.log(
  sellingWoodMemo(4, 6, [
    [3, 2, 10],
    [1, 4, 2],
    [4, 1, 3],
  ]),
); // 32

function sellingWoodOpt(m: number, n: number, prices: number[][]): number {
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (const [h, w, price] of prices) dp[h][w] = Math.max(dp[h][w], price);

  for (let h = 1; h <= m; h++) {
    for (let w = 1; w <= n; w++) {
      // Horizontal: only need i <= h/2 (symmetric)
      for (let i = 1; i * 2 <= h; i++) {
        dp[h][w] = Math.max(dp[h][w], dp[i][w] + dp[h - i][w]);
      }
      // If h is odd, need the middle cut too
      if (h % 2 !== 0) {
        const i = Math.floor(h / 2) + 1;
        if (i < h) dp[h][w] = Math.max(dp[h][w], dp[i][w] + dp[h - i][w]);
      }
      // Vertical
      for (let j = 1; j * 2 <= w; j++) {
        dp[h][w] = Math.max(dp[h][w], dp[h][j] + dp[h][w - j]);
      }
      if (w % 2 !== 0) {
        const j = Math.floor(w / 2) + 1;
        if (j < w) dp[h][w] = Math.max(dp[h][w], dp[h][j] + dp[h][w - j]);
      }
    }
  }
  return dp[m][n];
}

// Note: Solution 1 is cleaner; use it in interviews
console.log(
  sellingWoodOpt(3, 5, [
    [1, 4, 2],
    [2, 2, 7],
    [2, 1, 3],
  ]),
); // 19
```

---

## 🔗 Related Problems

| Problem                                                                                   | Difficulty | Key Concept |
| ----------------------------------------------------------------------------------------- | ---------- | ----------- |
| [Burst Balloons](https://leetcode.com/problems/burst-balloons/)                           | Hard       | Interval DP |
| [Strange Printer](https://leetcode.com/problems/strange-printer/)                         | Hard       | Interval DP |
| [Minimum Cost to Cut a Stick](https://leetcode.com/problems/minimum-cost-to-cut-a-stick/) | Hard       | Interval DP |
