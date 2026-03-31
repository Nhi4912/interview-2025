---
layout: page
title: "Minimum Moves to Spread Stones Over Grid"
difficulty: Medium
category: Tree-Graph
tags: [Array, Dynamic Programming, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/minimum-moves-to-spread-stones-over-grid"
---

# Minimum Moves to Spread Stones Over Grid / Số Bước Ít Nhất Để Phân Bố Đá Trên Lưới

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking + Min-Cost Matching
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như chuyển hàng từ kho thừa sang kho thiếu — bạn cần phân bổ hàng hóa (đá) từ các ô dư thừa sang các ô trống, sao cho tổng khoảng cách di chuyển là nhỏ nhất. Vì lưới chỉ có 3×3, ta thử mọi cách phân bổ (permutation) và chọn tổng nhỏ nhất.

**Pattern Recognition:**

- Signal: "3×3 grid" + "move to adjacent" + "equalize" → **Backtracking over small state space**
- Excess stones must move to empty cells — Manhattan distance = cost
- Grid is tiny (≤9 cells) so permutation backtracking is feasible O(k! where k≤8)

**Visual:**

```
grid = [[1,0,2],[1,1,1],[1,2,1]]  → total=10... wait total must be 9
grid = [[1,0,2],[1,1,0],[1,2,1]]  → total=9 ✓

Excess (>1):  (0,2)→extra 1, (2,1)→extra 1  → excess list: [(0,2),(2,1)]
Empty  (=0):  (0,1),(1,2)                    → empty  list: [(0,1),(1,2)]

Try matching (0,2)→(0,1) and (2,1)→(1,2):
  dist = |0-0|+|2-1| + |2-1|+|1-2| = 1 + 2 = 3
Try matching (0,2)→(1,2) and (2,1)→(0,1):
  dist = |0-1|+|2-2| + |2-0|+|1-1| = 1 + 2 = 3  ← same
Answer = 3
```

## Problem Description

You have a 3×3 grid where `grid[i][j]` is the number of stones in that cell (total stones = 9). In one move, move one stone to an adjacent cell (up/down/left/right). Return the minimum number of moves to have exactly 1 stone in every cell.

Example 1: `grid=[[1,1,0],[1,1,1],[1,2,1]]` → `3` (wait, correct: `[[1,0,2],[1,1,0],[1,2,1]]` → `3`)
Example 2: `grid=[[1,3,0],[1,0,0],[1,0,3]]` → `4`

## 📝 Interview Tips

1. **Clarify**: "Tổng đá luôn = 9, lưới 3×3 → brute force permutation khả thi" / Total always 9, small grid
2. **Approach**: "Tìm excess cells và empty cells, bài toán = min cost assignment" / Min cost matching
3. **Backtracking**: "k! với k≤8 → tối đa 40320 trạng thái — hoàn toàn chấp nhận được" / k≤8, feasible
4. **BFS alt**: "BFS trên state (grid) cũng được nhưng state space lớn hơn" / BFS on grid state is slower
5. **Edge cases**: "Grid đã hoàn hảo (tất cả = 1) → answer = 0" / Already solved = 0 moves
6. **Complexity**: "Time O(k!) where k = number of excess stones ≤ 8 | Space O(k)"

## Solutions

```typescript
/** Solution 1: BFS on grid state — exact but slow
 * Time: O(S * n²) where S = state space | Space: O(S)
 */
function minimumMovesBFS(grid: number[][]): number {
  const encode = (g: number[][]): string => g.flat().join(",");
  const start = encode(grid);
  const target = encode([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]);
  if (start === target) return 0;

  const visited = new Set<string>([start]);
  const queue: [number[][], number][] = [[grid.map((r) => [...r]), 0]];
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  while (queue.length > 0) {
    const [g, moves] = queue.shift()!;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (g[r][c] <= 1) continue;
        for (const [dr, dc] of dirs) {
          const nr = r + dr,
            nc = c + dc;
          if (nr < 0 || nr >= 3 || nc < 0 || nc >= 3) continue;
          const ng = g.map((row) => [...row]);
          ng[r][c]--;
          ng[nr][nc]++;
          const key = encode(ng);
          if (key === target) return moves + 1;
          if (!visited.has(key)) {
            visited.add(key);
            queue.push([ng, moves + 1]);
          }
        }
      }
    }
  }
  return -1;
}

/** Solution 2: Backtracking min-cost matching — optimal for this constraint
 * Time: O(k!) | Space: O(k)
 */
function minimumMoves(grid: number[][]): number {
  const excess: [number, number][] = [];
  const empty: [number, number][] = [];

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      for (let k = 1; k < grid[r][c]; k++) excess.push([r, c]); // each extra stone
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }

  const dist = (r1: number, c1: number, r2: number, c2: number) =>
    Math.abs(r1 - r2) + Math.abs(c1 - c2);

  let minCost = Infinity;

  function backtrack(idx: number, cost: number): void {
    if (idx === empty.length) {
      minCost = Math.min(minCost, cost);
      return;
    }
    if (cost >= minCost) return; // prune
    const [er, ec] = empty[idx];
    for (let i = idx; i < excess.length; i++) {
      [excess[idx], excess[i]] = [excess[i], excess[idx]];
      backtrack(idx + 1, cost + dist(er, ec, excess[idx][0], excess[idx][1]));
      [excess[idx], excess[i]] = [excess[i], excess[idx]];
    }
  }

  if (empty.length === 0) return 0;
  backtrack(0, 0);
  return minCost;
}

/** Solution 3: DP with bitmask — enumerate all matchings
 * Time: O(2^k * k) | Space: O(2^k)
 */
function minimumMovesDP(grid: number[][]): number {
  const excess: [number, number][] = [];
  const empty: [number, number][] = [];

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      for (let k = 1; k < grid[r][c]; k++) excess.push([r, c]);
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }

  const k = empty.length;
  if (k === 0) return 0;

  const dp = new Array(1 << k).fill(Infinity);
  dp[0] = 0;

  for (let mask = 0; mask < 1 << k; mask++) {
    if (dp[mask] === Infinity) continue;
    const exIdx = Integer.bitCount(mask); // how many excess stones assigned so far
    if (exIdx >= excess.length) continue;
    const [er, ec] = excess[exIdx];
    for (let j = 0; j < k; j++) {
      if (mask & (1 << j)) continue; // already filled
      const [er2, ec2] = empty[j];
      const newMask = mask | (1 << j);
      const cost = Math.abs(er - er2) + Math.abs(ec - ec2);
      dp[newMask] = Math.min(dp[newMask], dp[mask] + cost);
    }
  }

  return dp[(1 << k) - 1];
}

// Helper for DP version
const Integer = { bitCount: (n: number) => n.toString(2).split("1").length - 1 };

// Tests
console.log(
  minimumMoves([
    [1, 1, 0],
    [1, 1, 1],
    [1, 2, 1],
  ]),
); // 3
console.log(
  minimumMoves([
    [1, 3, 0],
    [1, 0, 0],
    [1, 0, 3],
  ]),
); // 4
console.log(
  minimumMovesBFS([
    [1, 1, 0],
    [1, 1, 1],
    [1, 2, 1],
  ]),
); // 3
console.log(
  minimumMovesDP([
    [1, 3, 0],
    [1, 0, 0],
    [1, 0, 3],
  ]),
); // 4
console.log(
  minimumMoves([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]),
); // 0
console.log(
  minimumMoves([
    [0, 0, 0],
    [0, 9, 0],
    [0, 0, 0],
  ]),
); // 8
```

## 🔗 Related Problems

| Problem                                                                                                     | Relationship                  |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [Sliding Puzzle](https://leetcode.com/problems/sliding-puzzle)                                              | BFS on small grid state space |
| [Minimum Cost to Move Chips](https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position) | Min cost assignment problem   |
| [01 Matrix](https://leetcode.com/problems/01-matrix)                                                        | BFS shortest distance in grid |
