---
layout: page
title: "Number of Ways to Build House of Cards"
difficulty: Medium
category: Dynamic Programming
tags: [Math, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/number-of-ways-to-build-house-of-cards"
---

# Number of Ways to Build House of Cards / Số Cách Xây Tháp Bài

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP with Memoization
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) | [Fibonacci Number](https://leetcode.com/problems/fibonacci-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xây tháp bài — mỗi tầng là một hàng tam giác, tầng dưới nhiều cột hơn tầng trên. Bạn đếm số cách xếp `n` lá bài thành kiến trúc hợp lệ.

**Pattern Recognition:**

- Mỗi hàng với `m` cột cần `3m - 1` lá (2m lá xiên + (m-1) lá ngang)
- Các hàng phải có số cột **giảm dần nghiêm ngặt** từ dưới lên trên
- Tổng tất cả lá dùng = `n` chính xác → DP với memoization

```
Hàng với m cột:
m=1: /\ = 2 lá     (3×1-1 = 2)
m=2: /\/\ + ngang = 5 lá  (3×2-1 = 5)
m=3: 8 lá          (3×3-1 = 8)

n=16, tìm phân hoạch:
  [4,2]: 11 + 5 = 16 ✓  (hàng1=4cols, hàng2=2cols, 4>2 ✓)
  [5,1]: 14 + 2 = 16 ✓  (hàng1=5cols, hàng2=1col, 5>1 ✓)
  → Tổng: 2 cách
```

---

## Problem Description / Mô Tả Bài Toán

Cho `n` lá bài. Đếm số cách xây "nhà bài" hợp lệ: mỗi hàng có `m ≥ 1` cột (dùng `3m-1` lá), số cột giảm nghiêm ngặt từ dưới lên trên, tổng lá dùng đúng bằng `n`.

**Example 1:** `n=16` → `2`
**Example 2:** `n=2` → `1` (chỉ 1 hàng, 1 cột)
**Example 3:** `n=4` → `0` (không có phân hoạch hợp lệ)

**Constraints:** `1 ≤ n ≤ 500`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** First derive the formula: row with m columns = 2m (slanted) + (m-1) (horizontal) = 3m-1 cards.
   **VI:** Đầu tiên lập công thức: hàng m cột = 2m (xiên) + (m-1) (ngang) = 3m-1 lá.

2. **EN:** Valid row sizes: 2, 5, 8, 11, ... (arithmetic sequence with step 3). Only these partition n.
   **VI:** Kích thước hàng hợp lệ: 2, 5, 8, 11, ... (cấp số cộng bước 3).

3. **EN:** State: dp(remaining, prevCols) = ways to use exactly `remaining` cards with each new row having < prevCols columns.
   **VI:** State: dp(remaining, prevCols) = số cách dùng đúng `remaining` lá với mỗi hàng < prevCols cột.

4. **EN:** Top-down + memo is cleanest. The state space is small: n ≤ 500, maxCols ≤ 167.
   **VI:** Top-down + memo là sạch nhất. State space nhỏ: n ≤ 500, maxCols ≤ 167.

5. **EN:** Base case: remaining=0 → 1 way (empty structure on top). remaining<0 → 0.
   **VI:** Trường hợp cơ sở: remaining=0 → 1 cách (xây xong). remaining<0 → 0.

6. **EN:** n=1,3 → 0 ways. n=2 → 1 way. n=4 → 0 ways (can't partition into valid row sizes).
   **VI:** n=1,3 → 0 cách. n=2 → 1. n=4 → 0 (không phân hoạch được thành kích thước hợp lệ).

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Top-Down DP + Memoization ────────────────────────────────────
// dp(remaining, prevCols) = ways to place cards using exactly `remaining` cards
// where each row must have strictly fewer columns than `prevCols`.
function houseOfCards(n: number): number {
  const memo = new Map<string, number>();

  function dp(remaining: number, prevCols: number): number {
    if (remaining === 0) return 1;
    const key = `${remaining},${prevCols}`;
    if (memo.has(key)) return memo.get(key)!;

    let ways = 0;
    // Try each valid number of columns m (1 ≤ m < prevCols)
    // Row with m cols uses 3m-1 cards
    for (let m = 1; m < prevCols; m++) {
      const cards = 3 * m - 1;
      if (cards > remaining) break;
      ways += dp(remaining - cards, m);
    }

    memo.set(key, ways);
    return ways;
  }

  // For the bottom row, any number of columns is valid
  let total = 0;
  for (let m = 1; 3 * m - 1 <= n; m++) {
    total += dp(n - (3 * m - 1), m);
  }
  return total;
}

// ─── Solution 2: Bottom-Up DP ─────────────────────────────────────────────────
// dp[rem][maxCols] = ways to use exactly rem cards where each row has < maxCols cols
function houseOfCards_bottomUp(n: number): number {
  const maxCols = Math.floor((n + 1) / 3) + 1;
  // dp[rem][maxCols]: rem = remaining cards, maxCols = upper limit on next row
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(maxCols + 1).fill(0));

  // Base: 0 remaining cards = 1 valid way (done building)
  for (let c = 0; c <= maxCols; c++) dp[0][c] = 1;

  // Fill in increasing order of remaining cards
  for (let rem = 1; rem <= n; rem++) {
    for (let maxC = 1; maxC <= maxCols; maxC++) {
      // No row placed here
      dp[rem][maxC] = 0;
      // Try placing a row with m columns (1 ≤ m < maxC)
      for (let m = 1; m < maxC; m++) {
        const cards = 3 * m - 1;
        if (cards > rem) break;
        dp[rem][maxC] += dp[rem - cards][m];
      }
    }
  }

  let total = 0;
  for (let m = 1; 3 * m - 1 <= n; m++) {
    total += dp[n - (3 * m - 1)][m];
  }
  return total;
}

// ─── Tests ────────────────────────────────────────────────────────────────────
console.log(houseOfCards(16)); // 2
console.log(houseOfCards(2)); // 1
console.log(houseOfCards(4)); // 0
console.log(houseOfCards(48)); // spiraling structure count
console.log(houseOfCards_bottomUp(16)); // 2
console.log(houseOfCards_bottomUp(2)); // 1
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                                                                                | Difficulty | Pattern |
| --- | -------------------------------------------------------------------------------------- | ---------- | ------- |
| 279 | [Perfect Squares](https://leetcode.com/problems/perfect-squares)                       | 🟡 Medium  | DP      |
| 96  | [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) | 🟡 Medium  | DP      |
| 91  | [Decode Ways](https://leetcode.com/problems/decode-ways)                               | 🟡 Medium  | DP      |
