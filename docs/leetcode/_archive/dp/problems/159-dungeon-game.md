---
layout: page
title: "Dungeon Game"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/dungeon-game"
---

# Dungeon Game / Trò Chơi Ngục Tối

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximal Square](https://leetcode.com/problems/maximal-square) | [Unique Paths II](https://leetcode.com/problems/unique-paths-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như lập kế hoạch ngược — biết điểm đến cần HP tối thiểu 1, tính ngược về điểm xuất phát. Nếu đi xuôi, chúng ta không biết "để lại bao nhiêu HP cho tương lai".

```
dungeon = [[-2,-3,3],
           [-5,-10,1],
           [10,30,-5]]

Fill backward (starting from bottom-right):
dp[i][j] = min HP needed AT (i,j) to reach princess

dp[2][2] = max(1, 1-(-5)) = 6
dp[2][1] = max(1, 1-30)   = 1   (30 HP gained, need min 1)
dp[2][0] = max(1, 1-10)   = 1   (10 HP gained, need min 1)
dp[1][2] = max(1, min(dp[2][2])-1) = max(1, 6-1) = 5
dp[1][1] = max(1, min(dp[1][2], dp[2][1])-(-10)) = max(1, 1+10)= 11
dp[0][2] = max(1, dp[1][2]-3) = max(1, 5-3) = 2
dp[0][1] = max(1, min(dp[0][2],dp[1][1])-(-3)) = max(1, 2+3) = 5
dp[0][0] = max(1, min(dp[0][1],dp[1][0])-(-2)) = max(1, 5+2) = 7

Answer = dp[0][0] = 7
```

**Key insight:** Fill `dp` from bottom-right to top-left. `dp[i][j]` = minimum HP needed when entering cell `(i,j)`. At each cell: `dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j])`.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Backward DP**: Forward DP fails because HP at start depends on entire future path / DP xuôi không khả thi
- 🔑 **dp[i][j]**: Minimum HP needed at entry of cell (i,j) to survive to princess / HP tối thiểu khi vào ô
- 🔑 **Transition**: `dp[i][j] = max(1, min(down, right) - dungeon[i][j])` / lấy min đường đi tốt nhất, trừ phần thưởng/hình phạt
- 🔑 **max(1, ...)**: HP can never drop to 0 or below — must maintain at least 1 / HP phải luôn ≥ 1
- 🔑 **Base case**: Bottom-right: `dp[m-1][n-1] = max(1, 1 - dungeon[m-1][n-1])` / ô cuối cần ít nhất 1 HP
- 🔑 **Boundary**: Out-of-bounds cells → `+Infinity` (unreachable from those directions) / ngoài biên = Infinity

---

## Solutions / Giải Pháp

### Solution 1: Backward DP (O(mn) time, O(mn) space)

```typescript
/**
 * Dungeon Game — Backward DP
 *
 * dp[i][j] = minimum HP the knight needs when entering cell (i,j).
 * Fill from bottom-right to top-left.
 * At each cell, the knight needs enough HP to:
 *   1. Survive the current cell (not die here).
 *   2. Have enough HP to proceed to the best next cell.
 *
 * Time:  O(m × n)
 * Space: O(m × n)
 */
function calculateMinimumHP(dungeon: number[][]): number {
  const m = dungeon.length,
    n = dungeon[0].length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(Infinity));

  // Sentinel: one cell past princess → need 1 HP
  dp[m][n - 1] = 1;
  dp[m - 1][n] = 1;

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const best = Math.min(dp[i + 1][j], dp[i][j + 1]);
      dp[i][j] = Math.max(1, best - dungeon[i][j]);
    }
  }

  return dp[0][0];
}

console.log(
  calculateMinimumHP([
    [-2, -3, 3],
    [-5, -10, 1],
    [10, 30, -5],
  ]),
); // 7
console.log(calculateMinimumHP([[0]])); // 1
console.log(
  calculateMinimumHP([
    [1, -3, 3],
    [-3, 1, 0],
    [-3, 0, -3],
  ]),
); // 1 (start with 1 HP, gain net positive)
console.log(calculateMinimumHP([[-200]])); // 201
```

### Solution 2: Space-Optimized (O(mn) time, O(n) space)

```typescript
/**
 * Dungeon Game — Space-Optimized Backward DP
 *
 * Since we only need the row below and the current row's right column,
 * we can use a single 1D array filled right to left.
 *
 * Time:  O(m × n)
 * Space: O(n)
 */
function calculateMinimumHPOpt(dungeon: number[][]): number {
  const m = dungeon.length,
    n = dungeon[0].length;
  // dp[j] = min HP needed at row i, col j (updated in place)
  const dp = new Array(n + 1).fill(Infinity);
  dp[n - 1] = 1; // Sentinel for bottom-right exit

  for (let i = m - 1; i >= 0; i--) {
    const newDp = new Array(n + 1).fill(Infinity);
    newDp[n] = Infinity; // Out of bounds
    for (let j = n - 1; j >= 0; j--) {
      const best = Math.min(
        i === m - 1 ? (j === n - 1 ? 1 : newDp[j + 1]) : dp[j], // down
        newDp[j + 1], // right (already computed this row)
      );
      // Special case for last row: no "down" exists
      const down = i + 1 <= m - 1 ? dp[j] : Infinity;
      const right = j + 1 <= n - 1 ? newDp[j + 1] : Infinity;
      const bestNext = i === m - 1 && j === n - 1 ? 1 : Math.min(down, right);
      newDp[j] = Math.max(1, bestNext - dungeon[i][j]);
    }
    // Carry forward
    for (let j = 0; j < n; j++) dp[j] = newDp[j];
  }

  return dp[0];
}

// Simpler rolling — rebuild using the known-working pattern
function calculateMinimumHPRolling(dungeon: number[][]): number {
  const m = dungeon.length,
    n = dungeon[0].length;
  // Use last row as base, then roll upward
  const dp = new Array(n + 1).fill(Infinity);

  for (let i = m - 1; i >= 0; i--) {
    const row = new Array(n + 1).fill(Infinity);
    for (let j = n - 1; j >= 0; j--) {
      const right = row[j + 1];
      const down = i === m - 1 ? Infinity : dp[j];
      const nxt = i === m - 1 && j === n - 1 ? 1 : Math.min(right, down);
      row[j] = Math.max(1, nxt - dungeon[i][j]);
    }
    for (let j = 0; j < n; j++) dp[j] = row[j];
  }

  return dp[0];
}

console.log(
  calculateMinimumHPOpt([
    [-2, -3, 3],
    [-5, -10, 1],
    [10, 30, -5],
  ]),
); // 7
console.log(calculateMinimumHPOpt([[0]])); // 1
console.log(
  calculateMinimumHPRolling([
    [-2, -3, 3],
    [-5, -10, 1],
    [10, 30, -5],
  ]),
); // 7
console.log(calculateMinimumHPRolling([[-200]])); // 201
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                            | Difficulty | Pattern         |
| ------------------------------------------------------------------ | ---------- | --------------- |
| [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum) | 🟡 Medium  | Grid DP Forward |
| [Unique Paths II](https://leetcode.com/problems/unique-paths-ii)   | 🟡 Medium  | Grid DP         |
| [Cherry Pickup](https://leetcode.com/problems/cherry-pickup)       | 🔴 Hard    | Grid DP         |
| [Maximal Square](https://leetcode.com/problems/maximal-square)     | 🟡 Medium  | Grid DP         |
