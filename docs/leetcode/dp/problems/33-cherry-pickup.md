---
layout: page
title: "Cherry Pickup"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/cherry-pickup"
---

# Cherry Pickup / Hái Anh Đào

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: 3D DP (Two-Walker Simultaneous)
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Cherry Pickup II](https://leetcode.com/problems/cherry-pickup-ii) | [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai người bạn cùng xuất phát từ góc trên-trái của một vườn dâu, đi đến góc dưới-phải để hái quả, rồi cùng quay về. Thay vì giải hai lần (đi rồi về), ta mô phỏng cả hai người đi xuống cùng lúc với tốc độ như nhau — khi cả hai đến ô có dâu, chỉ hái được một lần.

**Pattern Recognition:**

- Signal: "go from (0,0) to (n-1,n-1) and back, maximize cherries" → **Two walkers moving simultaneously**
- State: dp[t][r1][r2] where t = steps taken, r1/r2 = rows of walker 1/2; column = t - row
- Key insight: hai người đi cùng lúc, nếu ở cùng ô thì chỉ tính 1 lần

**Visual — grid = [[0,1,-1],[1,0,-1],[1,1,1]]:**

```
Grid:           Two walkers at step t, rows (r1, r2):
0  1  -1        t=0: both at (0,0)   → cherry=0
1  0  -1        t=1: (r1=0,r2=1)→(0,1)+(1,0)=1+1=2  OR  same cell...
1  1   1        t=2: (r1=1,r2=2)→(1,1)+(2,0)=0+1=1
                t=3: (r1=2,r2=2)→same cell(2,1)+1=2
                t=4: both at (2,2) → cherry=1

Max cherries = 5
```

---

## Problem Description

Given an `n×n` grid where `grid[i][j]` is 0 (empty), 1 (cherry), or -1 (thorn/blocked), walk from `(0,0)` to `(n-1,n-1)` and back collecting maximum cherries (each cell collected only once). Return max cherries or 0 if impossible. ([LeetCode 741](https://leetcode.com/problems/cherry-pickup))

Difficulty: Hard | Acceptance: 37.9%

- **Example 1**: grid = [[0,1,-1],[1,0,-1],[1,1,1]] → **5**
- **Example 2**: grid = [[1,1,-1],[1,-1,1],[-1,1,1]] → **0** (path blocked)

Constraints:

- `n == grid.length == grid[i].length`
- `1 <= n <= 50`
- `grid[i][j] ∈ {-1, 0, 1}`
- `grid[0][0] != -1` and `grid[n-1][n-1] != -1`

---

## 📝 Interview Tips

1. **Reframe**: "Đi rồi về = hai người cùng đi xuống" / Reformulate: round trip = two forward trips simultaneously
2. **State**: "dp[t][r1][r2] — t bước, người 1 ở hàng r1, người 2 ở hàng r2" / Column is derived: c = t - r
3. **Collision**: "Nếu r1==r2 → chỉ tính cherry một lần" / Same cell: count cherry once
4. **Blocked**: "Nếu bất kỳ ô nào là -1 → state invalid = -∞" / Mark unreachable states as -Infinity
5. **Init**: "dp[0][0][0] = grid[0][0]" / Base case: both start at top-left
6. **Answer**: "dp[2n-2][n-1][n-1] — hoặc 0 nếu âm" / Final state, clamp to 0

---

## Solutions

```typescript
/**
 * Solution 1: Top-Down 3D DP with Memoization
 * Time: O(n³) — states: t × r1 × r2
 * Space: O(n³) — memo table
 */
function cherryPickupMemo(grid: number[][]): number {
  const n = grid.length;
  const memo = new Map<string, number>();

  // dfs(t, r1, r2): max cherries both walkers can collect from step t onwards
  // walker1 at (r1, t-r1), walker2 at (r2, t-r2)
  function dfs(t: number, r1: number, r2: number): number {
    const c1 = t - r1,
      c2 = t - r2;
    // Out of bounds or blocked
    if (r1 >= n || c1 >= n || r2 >= n || c2 >= n) return -Infinity;
    if (grid[r1][c1] === -1 || grid[r2][c2] === -1) return -Infinity;
    // Both reached destination
    if (t === 2 * (n - 1)) return grid[r1][c1]; // both at (n-1,n-1)

    const key = `${t},${r1},${r2}`;
    if (memo.has(key)) return memo.get(key)!;

    // Collect cherries (avoid double counting if same cell)
    let cherries = r1 === r2 ? grid[r1][c1] : grid[r1][c1] + grid[r2][c2];

    // Each walker can move right (r stays) or down (r+1)
    const best = Math.max(
      dfs(t + 1, r1, r2), // both right
      dfs(t + 1, r1 + 1, r2), // walker1 down, walker2 right
      dfs(t + 1, r1, r2 + 1), // walker1 right, walker2 down
      dfs(t + 1, r1 + 1, r2 + 1), // both down
    );
    if (best === -Infinity) {
      memo.set(key, -Infinity);
      return -Infinity;
    }
    const result = cherries + best;
    memo.set(key, result);
    return result;
  }

  return Math.max(0, dfs(0, 0, 0));
}

/**
 * Solution 2: Bottom-Up 3D DP (Optimal)
 * Time: O(n³) — fill dp[t][r1][r2]
 * Space: O(n²) — rolling 2D layer
 */
function cherryPickup(grid: number[][]): number {
  const n = grid.length;
  const NEG_INF = -Infinity;

  // dp[r1][r2] = max cherries when both walkers have taken t steps
  let dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(NEG_INF));
  dp[0][0] = grid[0][0];

  for (let t = 1; t <= 2 * (n - 1); t++) {
    const ndp: number[][] = Array.from({ length: n }, () => new Array(n).fill(NEG_INF));

    for (let r1 = Math.max(0, t - (n - 1)); r1 <= Math.min(t, n - 1); r1++) {
      const c1 = t - r1;
      if (c1 < 0 || c1 >= n || grid[r1][c1] === -1) continue;

      for (let r2 = r1; r2 <= Math.min(t, n - 1); r2++) {
        const c2 = t - r2;
        if (c2 < 0 || c2 >= n || grid[r2][c2] === -1) continue;

        // Cherries collected (same cell → count once)
        const cherries = r1 === r2 ? grid[r1][c1] : grid[r1][c1] + grid[r2][c2];

        // Max of 4 previous states (each walker moved down or right)
        let best = NEG_INF;
        for (const pr1 of [r1, r1 - 1]) {
          for (const pr2 of [r2, r2 - 1]) {
            if (pr1 >= 0 && pr2 >= 0 && dp[pr1][pr2] !== NEG_INF) {
              best = Math.max(best, dp[pr1][pr2]);
            }
          }
        }

        if (best !== NEG_INF) {
          ndp[r1][r2] = Math.max(ndp[r1][r2], best + cherries);
        }
      }
    }
    dp = ndp;
  }

  return Math.max(0, dp[n - 1][n - 1]);
}

// === Test Cases ===
console.log(
  cherryPickup([
    [0, 1, -1],
    [1, 0, -1],
    [1, 1, 1],
  ]),
); // 5
console.log(
  cherryPickup([
    [1, 1, -1],
    [1, -1, 1],
    [-1, 1, 1],
  ]),
); // 0
console.log(cherryPickup([[1]])); // 1
console.log(
  cherryPickup([
    [1, 1],
    [1, 1],
  ]),
); // 4
```

---

## 🔗 Related Problems

| Problem                                                            | Difficulty | Pattern                |
| ------------------------------------------------------------------ | ---------- | ---------------------- |
| [Cherry Pickup II](https://leetcode.com/problems/cherry-pickup-ii) | 🔴 Hard    | Two walkers from top   |
| [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum) | 🟡 Medium  | Grid DP                |
| [Unique Paths II](https://leetcode.com/problems/unique-paths-ii)   | 🟡 Medium  | Grid DP with obstacles |
| [Dungeon Game](https://leetcode.com/problems/dungeon-game)         | 🔴 Hard    | Grid DP                |
| [Maximal Square](https://leetcode.com/problems/maximal-square)     | 🟡 Medium  | 2D DP                  |
