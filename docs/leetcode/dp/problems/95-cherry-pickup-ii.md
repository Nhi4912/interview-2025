---
layout: page
title: "Cherry Pickup II"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/cherry-pickup-ii"
---

# Cherry Pickup II / Thu Hoạch Anh Đào II

> **Difficulty**: 🔴 Hard | **Category**: Dynamic Programming | **Pattern**: Two-pointer Grid DP / Simultaneous Path DP

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Hai nông dân cùng lúc thu hoạch dưa hấu trên cánh đồng lớn — người từ góc trên-trái, người từ góc trên-phải, mỗi bước cùng đi xuống một hàng. Mỗi quả dưa chỉ được hái một lần (nếu cả hai cùng đến).

**Pattern Recognition:**

- Two robots moving simultaneously row by row → track both columns `(c1, c2)` together
- State = `(row, c1, c2)` → can prune by `c1 <= c2` (symmetric)
- Each robot moves to any of 3 adjacent columns → 9 transitions per state

**Visual (grid=[[3,1,1],[2,5,1],[1,5,5],[2,1,1]]):**

```
row=0: robot1@col0=3, robot2@col2=1 → collect 3+1=4
row=1: r1→col1=5, r2→col1 (same)→5 (count once) → +5
       OR r1→col0=2, r2→col2=1 → +3
row=2: continue exploring...
Best = 24
```

## Problem Description

Two robots start at `grid[0][0]` and `grid[0][n-1]` and move down the grid simultaneously. Each step both move to one of 3 cells in the next row. If both on same cell, only collect cherries once. Return **max cherries** both can collect.

**Example 1:** `grid=[[3,1,1],[2,5,1],[1,5,5],[2,1,1]]` → `24`
**Example 2:** `grid=[[1,0,0,0,0,0,1],[2,0,0,0,0,3,0],[2,0,0,0,0,0,1],[0,0,0,0,0,3,0],[1,2,3,4,5,2,1]]` → `35`

**Constraints:** `rows, cols ≤ 70`, `0 ≤ grid[i][j] ≤ 100`

## 📝 Interview Tips

1. **Clarify**: Can robots be on the same cell? Yes — count cherries only once in that case.
2. **Approach**: 3D DP `dp[row][c1][c2]`. Process row by row, track both column positions.
3. **Edge cases**: `cols=1` → both robots same column entire time; `c1==c2` → only count once.
4. **Optimize**: Only need 2D slice at a time (rolling DP); prune `c1 > c2`.
5. **Follow-up**: k robots? → State becomes k-dimensional, exponential in k.
6. **Complexity**: O(rows × cols² × 9) time → O(rows × cols²), O(cols²) space.

## Solutions

```typescript
// Solution 1: 3D DP top-down memoization — Time: O(r×c²) | Space: O(r×c²)
function cherryPickup(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const memo = new Map<string, number>();

  function dp(row: number, c1: number, c2: number): number {
    if (row === rows) return 0;
    const key = `${row},${c1},${c2}`;
    if (memo.has(key)) return memo.get(key)!;

    // Collect cherries at current row
    let cherries = grid[row][c1];
    if (c1 !== c2) cherries += grid[row][c2];

    // Try all 9 combinations of next moves
    let best = -Infinity;
    for (const dc1 of [-1, 0, 1]) {
      for (const dc2 of [-1, 0, 1]) {
        const nc1 = c1 + dc1;
        const nc2 = c2 + dc2;
        if (nc1 >= 0 && nc1 < cols && nc2 >= 0 && nc2 < cols) {
          best = Math.max(best, dp(row + 1, nc1, nc2));
        }
      }
    }

    const result = cherries + (best === -Infinity ? 0 : best);
    memo.set(key, result);
    return result;
  }

  return dp(0, 0, cols - 1);
}

// Solution 2: Bottom-up 2D rolling DP — Time: O(r×c²) | Space: O(c²)
function cherryPickup2(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;

  // dp[c1][c2] = max cherries when robot1@c1, robot2@c2 at current row
  let dp: number[][] = Array.from({ length: cols }, () => new Array(cols).fill(-Infinity));
  dp[0][cols - 1] = grid[0][0] + (cols > 1 ? grid[0][cols - 1] : 0);

  for (let row = 1; row < rows; row++) {
    const next: number[][] = Array.from({ length: cols }, () => new Array(cols).fill(-Infinity));

    for (let c1 = 0; c1 < cols; c1++) {
      for (let c2 = c1; c2 < cols; c2++) {
        // c1 <= c2 by symmetry
        if (dp[c1][c2] === -Infinity) continue;

        for (const dc1 of [-1, 0, 1]) {
          for (const dc2 of [-1, 0, 1]) {
            const nc1 = c1 + dc1;
            const nc2 = c2 + dc2;
            if (nc1 < 0 || nc1 >= cols || nc2 < 0 || nc2 >= cols) continue;

            const [lo, hi] = nc1 <= nc2 ? [nc1, nc2] : [nc2, nc1];
            let cherries = grid[row][lo] + (lo !== hi ? grid[row][hi] : 0);
            next[lo][hi] = Math.max(next[lo][hi], dp[c1][c2] + cherries);
          }
        }
      }
    }
    dp = next;
  }

  let ans = 0;
  for (let c1 = 0; c1 < cols; c1++) {
    for (let c2 = c1; c2 < cols; c2++) {
      ans = Math.max(ans, dp[c1][c2]);
    }
  }
  return ans;
}

// Tests
console.log(
  cherryPickup([
    [3, 1, 1],
    [2, 5, 1],
    [1, 5, 5],
    [2, 1, 1],
  ]),
); // 24
console.log(
  cherryPickup([
    [1, 0, 0, 0, 0, 0, 1],
    [2, 0, 0, 0, 0, 3, 0],
    [2, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 3, 0],
    [1, 2, 3, 4, 5, 2, 1],
  ]),
); // 35
console.log(cherryPickup([[1, 1]])); // 2
console.log(cherryPickup([[1]])); // 1
console.log(
  cherryPickup([
    [1, 0, 0, 3],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [3, 0, 0, 1],
  ]),
); // 8
```

## 🔗 Related Problems

| Problem                                                                                                           | Relationship                           |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [Cherry Pickup](https://leetcode.com/problems/cherry-pickup/)                                                     | 1 robot, go and return — similar 3D DP |
| [Minimum Cost to Connect Two Groups](https://leetcode.com/problems/minimum-cost-to-connect-two-groups-of-points/) | Multi-agent assignment DP              |
| [Grid Game](https://leetcode.com/problems/grid-game/)                                                             | Two robots on grid, first/second pass  |
