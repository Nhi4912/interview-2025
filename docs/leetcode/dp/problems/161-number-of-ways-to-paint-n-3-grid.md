---
layout: page
title: "Number of Ways to Paint N × 3 Grid"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/number-of-ways-to-paint-n-3-grid"
---

# Number of Ways to Paint N × 3 Grid / Số Cách Tô Màu Lưới N×3

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Mỗi hàng của lưới 3 ô chỉ có 12 mẫu hợp lệ (không có 2 ô kề cùng màu với 3 màu).
Đếm số mẫu hàng kế tiếp tương thích với hàng hiện tại → DP chuyển trạng thái.

**EN:** A 3-cell row with 3 colours has exactly 12 valid patterns (no adjacent cells same).
Count how many next-row patterns are compatible (no vertical adjacency conflicts).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Number of Ways to Paint N × 3 Grid example:**

```
3 colours: R G B
Row patterns (12 total):
  RGB RBG GRB GBR BRG BGR  (all 3 colours used — 6 patterns)
  RGR RBR GRG GBG BRB BGB  (only 2 colours used — 6 patterns)

Transition: row[i] compatible with row[i+1] iff no column j has same colour
```

---

## Problem Description

| Problem                                                                                                   | Difficulty | Key Idea             |
| --------------------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| [256. Paint House](https://leetcode.com/problems/paint-house/)                                            | 🟡 Medium  | Row-by-row colour DP |
| [265. Paint House II](https://leetcode.com/problems/paint-house-ii/)                                      | 🔴 Hard    | k colours DP         |
| [1411. Number of Ways to Paint N×3 Grid](https://leetcode.com/problems/number-of-ways-to-paint-n-3-grid/) | 🔴 Hard    | This problem         |
| [790. Domino and Tromino Tiling](https://leetcode.com/problems/domino-and-tromino-tiling/)                | 🟡 Medium  | Tiling state DP      |

---

## 📝 Interview Tips

- 🔑 **EN:** There are exactly 12 valid 3-cell rows; precompute them once.
  **VI:** Chính xác 12 mẫu hàng hợp lệ; tính trước một lần duy nhất.
- 🔑 **EN:** Two rows are compatible iff every column position differs.
  **VI:** Hai hàng tương thích khi mọi cột đều khác nhau.
- 🔑 **EN:** Build a transition adjacency list: `trans[i]` = list of rows compatible with row `i`.
  **VI:** Xây danh sách chuyển trạng thái: `trans[i]` = các hàng tương thích với hàng `i`.
- 🔑 **EN:** DP state: `dp[row_pattern]` = number of ways ending in that pattern.
  **VI:** Trạng thái DP: `dp[mẫu_hàng]` = số cách kết thúc bằng mẫu đó.
- 🔑 **EN:** Observe: 12 patterns split into "3-colour" (6) and "2-colour" (6) groups.
  Each group transitions only within predictable counts — O(1) formula works too.
  **VI:** 12 mẫu chia thành "3 màu" (6) và "2 màu" (6) — có thể dùng công thức O(1).
- 🔑 **EN:** MOD = 10^9+7; apply at every addition.
  **VI:** MOD = 10^9+7; áp dụng tại mọi phép cộng.

---

## Solutions

```typescript
/**
 * Number of Ways to Paint N×3 Grid
 * Enumerate all valid row patterns, precompute transitions.
 * Time: O(n * 12^2) = O(n)  Space: O(12)
 */
function numOfWays(n: number): number {
  const MOD = 1_000_000_007n;
  // Generate all valid 3-cell patterns (no adjacent same, colours 0/1/2)
  const patterns: number[][] = [];
  for (let a = 0; a < 3; a++)
    for (let b = 0; b < 3; b++)
      for (let c = 0; c < 3; c++) if (a !== b && b !== c) patterns.push([a, b, c]);
  // patterns.length === 12

  // Precompute transitions
  const trans: number[][] = patterns.map((p, i) =>
    patterns.map((_, j) => j).filter((j) => patterns[j].every((v, k) => v !== p[k])),
  );

  // DP: dp[i] = ways to end at pattern i
  let dp = new Array(12).fill(1n);
  for (let row = 1; row < n; row++) {
    const ndp = new Array(12).fill(0n);
    for (let i = 0; i < 12; i++) for (const j of trans[i]) ndp[j] = (ndp[j] + dp[i]) % MOD;
    dp = ndp;
  }

  return Number(dp.reduce((s, v) => (s + v) % MOD, 0n));
}

console.log(numOfWays(1)); // 12
console.log(numOfWays(2)); // 54
console.log(numOfWays(3)); // 246
console.log(numOfWays(7000)); // large number mod 1e9+7

/**
 * Mathematical observation:
 *   a3 = ways with 3 distinct colours in last row
 *   a2 = ways with exactly 2 colours in last row
 * Recurrence: new_a3 = 3*a2 + 2*a3,  new_a2 = 2*a2 + 2*a3
 * Time: O(n)  Space: O(1)
 */
function numOfWays2(n: number): number {
  const MOD = 1_000_000_007n;
  let a3 = 6n; // 6 patterns use all 3 colours
  let a2 = 6n; // 6 patterns use exactly 2 colours
  for (let i = 1; i < n; i++) {
    const na3 = (3n * a2 + 2n * a3) % MOD;
    const na2 = (2n * a2 + 2n * a3) % MOD;
    a3 = na3;
    a2 = na2;
  }
  return Number((a3 + a2) % MOD);
}

console.log(numOfWays2(1)); // 12
console.log(numOfWays2(2)); // 54
console.log(numOfWays2(5000)); // large number
```

---

## 🔗 Related Problems

| Problem                                                                                                   | Difficulty | Key Idea             |
| --------------------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| [256. Paint House](https://leetcode.com/problems/paint-house/)                                            | 🟡 Medium  | Row-by-row colour DP |
| [265. Paint House II](https://leetcode.com/problems/paint-house-ii/)                                      | 🔴 Hard    | k colours DP         |
| [1411. Number of Ways to Paint N×3 Grid](https://leetcode.com/problems/number-of-ways-to-paint-n-3-grid/) | 🔴 Hard    | This problem         |
| [790. Domino and Tromino Tiling](https://leetcode.com/problems/domino-and-tromino-tiling/)                | 🟡 Medium  | Tiling state DP      |
