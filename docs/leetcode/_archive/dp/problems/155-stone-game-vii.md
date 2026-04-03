---
layout: page
title: "Stone Game VII"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Game Theory]
leetcode_url: "https://leetcode.com/problems/stone-game-vii"
---

# Stone Game VII / Trò Chơi Đá VII

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Predict the Winner](https://leetcode.com/problems/predict-the-winner) | [Stone Game](https://leetcode.com/problems/stone-game)

---

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như hai người tranh giành phần bánh — người hiện tại chọn bỏ một đầu, nhận điểm từ phần còn lại, nhưng đối thủ sẽ cũng chơi tối ưu chống lại mình.

```
stones = [3, 9, 1, 2]
prefix = [0, 3, 12, 13, 15]

dp[i][j] = max score DIFF that current player can achieve over opponent for stones[i..j]

dp[0][1]: remove 3 → get 9; or remove 9 → get 3. diff = max(9-dp[1][1], 3-dp[0][0]) = 9
dp[1][2]: remove 9 → get 1; or remove 1 → get 9. diff = max(1, 9) = 9-0 = 9?
         remove 9: score=1, opponent plays dp[2][2]=0 → diff=1
         remove 1: score=9, opponent plays dp[1][1]=0 → diff=9
         dp[1][2] = 9
dp[0][3]: remove 3 → sum(1,3)=12, then -dp[1][3]; remove 2 → sum(0,2)=13, -dp[0][2]
```

**Key insight:** `dp[i][j]` = score advantage for current player on subarray `[i..j]`. When removing `stones[i]`: get `sum(i+1..j)` then subtract `dp[i+1][j]`. When removing `stones[j]`: get `sum(i..j-1)` then subtract `dp[i][j-1]`. Use prefix sums for O(1) range sums.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **dp[i][j]** = max (current score - opponent score) achievable from stones[i..j] / chênh lệch điểm tối đa
- 🔑 **Remove left** `stones[i]`: gain `sum(i+1,j)`, then opponent has advantage `dp[i+1][j]` / bỏ trái
- 🔑 **Remove right** `stones[j]`: gain `sum(i,j-1)`, then opponent has advantage `dp[i][j-1]` / bỏ phải
- 🔑 **Transition**: `dp[i][j] = max(sum(i+1,j) - dp[i+1][j], sum(i,j-1) - dp[i][j-1])` / lấy max
- 🔑 **Prefix sum**: Precompute prefix sums for O(1) range queries / tổng đoạn trong O(1)
- 🔑 **Fill order**: Diagonal — length 2 first, then 3, ..., n / điền theo đường chéo

---

## Solutions / Giải Pháp

### Solution 1: Interval DP + Prefix Sum (O(n²) time and space)

```typescript
/**
 * Stone Game VII — Interval DP
 *
 * dp[i][j] = maximum score difference (current - opponent) achievable on stones[i..j].
 * Use prefix sums for O(1) range sum queries.
 * Fill table by increasing interval length.
 *
 * Time:  O(n²)
 * Space: O(n²)
 */
function stoneGameVII(stones: number[]): number {
  const n = stones.length;

  // Build prefix sums
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + stones[i];
  const rangeSum = (l: number, r: number): number => prefix[r + 1] - prefix[l];

  // dp[i][j] = max score diff for current player on stones[i..j]
  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // Fill by interval length
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      // Remove stones[i]: score = sum(i+1..j), opponent gets dp[i+1][j]
      const removeLeft = rangeSum(i + 1, j) - dp[i + 1][j];
      // Remove stones[j]: score = sum(i..j-1), opponent gets dp[i][j-1]
      const removeRight = rangeSum(i, j - 1) - dp[i][j - 1];
      dp[i][j] = Math.max(removeLeft, removeRight);
    }
  }

  return dp[0][n - 1];
}

console.log(stoneGameVII([3, 9, 1, 2])); // 12
console.log(stoneGameVII([7, 90, 5, 1, 100, 10, 10, 2])); // 122
console.log(stoneGameVII([1, 2])); // 2
console.log(stoneGameVII([1])); // 0
```

### Solution 2: Space-Optimized (O(n²) time, O(n) space)

```typescript
/**
 * Stone Game VII — Space-Optimized DP
 *
 * Fill dp in-place using 1D array, processing columns from right to left
 * within each diagonal pass. Avoids full n×n matrix.
 *
 * Time:  O(n²)
 * Space: O(n)
 */
function stoneGameVIIOpt(stones: number[]): number {
  const n = stones.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + stones[i];
  const rangeSum = (l: number, r: number): number => prefix[r + 1] - prefix[l];

  // Use 1D dp array, fill by length
  const dp = new Array(n).fill(0);

  for (let len = 2; len <= n; len++) {
    // Process right to left to avoid overwriting needed values
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      const removeLeft = rangeSum(i + 1, j) - dp[i + 1]; // dp[i+1] = dp[i+1][j] before update
      const removeRight = rangeSum(i, j - 1) - dp[i]; // dp[i] = dp[i][j-1] before update
      dp[i] = Math.max(removeLeft, removeRight);
    }
  }

  return dp[0];
}

console.log(stoneGameVIIOpt([3, 9, 1, 2])); // 12
console.log(stoneGameVIIOpt([7, 90, 5, 1, 100, 10, 10, 2])); // 122
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                | Difficulty | Pattern            |
| ---------------------------------------------------------------------- | ---------- | ------------------ |
| [Predict the Winner](https://leetcode.com/problems/predict-the-winner) | 🟡 Medium  | Interval DP / Game |
| [Stone Game](https://leetcode.com/problems/stone-game)                 | 🟡 Medium  | DP / Math          |
| [Stone Game VIII](https://leetcode.com/problems/stone-game-viii)       | 🔴 Hard    | Prefix Sum DP      |
| [Burst Balloons](https://leetcode.com/problems/burst-balloons)         | 🔴 Hard    | Interval DP        |
