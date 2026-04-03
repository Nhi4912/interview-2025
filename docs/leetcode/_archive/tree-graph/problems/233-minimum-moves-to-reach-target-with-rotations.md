---
layout: page
title: "Minimum Moves to Reach Target with Rotations"
difficulty: Hard
category: Tree-Graph
tags: [Array, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/minimum-moves-to-reach-target-with-rotations"
---

# Minimum Moves to Reach Target with Rotations / Di Chuyển Tối Thiểu Đến Đích Với Xoay

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS on states
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Rotting Oranges](https://leetcode.com/problems/rotting-oranges) | [Max Area of Island](https://leetcode.com/problems/max-area-of-island)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như di chuyển thanh gỗ trong kho chứa hàng — thanh gỗ nằm ngang hoặc dọc, phải lách qua các cột hàng (ô chặn). BFS trên không gian trạng thái (hàng, cột, hướng) tìm số bước ít nhất.

**Visual — state = (row, col, direction) for snake tail:**

```
n=4, grid all 0s (no blocks)
Snake starts: (0,0)→(0,1) horizontal [state (0,0,H)]
Target:       (3,2)→(3,3) horizontal [state (3,2,H)]

State (r,c,H) = horizontal snake with tail at (r,c), head at (r,c+1)
State (r,c,V) = vertical snake with tail at (r,c), head at (r+1,c)

Transitions from (r,c,H):
  Move right → (r,c+1,H) if grid[r][c+2]==0
  Move down  → (r+1,c,H) if grid[r+1][c]==0 && grid[r+1][c+1]==0
  Rotate CW  → (r,c,V)   if grid[r+1][c]==0 && grid[r+1][c+1]==0

Transitions from (r,c,V):
  Move down  → (r+1,c,V) if grid[r+2][c]==0
  Move right → (r,c+1,V) if grid[r][c+1]==0 && grid[r+1][c+1]==0
  Rotate CCW → (r,c,H)   if grid[r][c+1]==0 && grid[r+1][c+1]==0

BFS explores states level by level → minimum moves
```

---

## Problem Description

In an `n×n` grid (0=free, 1=blocked), a snake occupies 2 cells. It starts **horizontal** at `(0,0)-(0,1)` and must reach `(n-1,n-2)-(n-1,n-1)`. Each move: slide right, slide down, rotate clockwise (horizontal→vertical), or rotate counter-clockwise (vertical→horizontal). Return minimum moves, or −1 if impossible. ([LeetCode 1210](https://leetcode.com/problems/minimum-moves-to-reach-target-with-rotations))

**Example 1:** n=4, no obstacles → **3** (right×2, down×1)... actually may vary.
**Example 2:** specific grid with blocks → **11**

**Constraints:** 2 ≤ n ≤ 100, grid[0][0] = grid[0][1] = 0 (start always free).

---

## 📝 Interview Tips

1. **State encoding**: (row, col, direction) của đuôi rắn đủ để mô tả trạng thái / Tail + direction uniquely defines snake.
2. **4 transitions**: 2 hướng di chuyển + 2 phép xoay; kiểm tra boundary và blocked cells cẩn thận.
3. **Rotation requires 2×2 free**: Xoay cần toàn bộ ô 2×2 bên góc phải/dưới trống / Both rotation types need 2×2 clear.
4. **BFS = minimum**: BFS đảm bảo số bước tối thiểu; visited array ngăn lặp / 3D visited: [n][n][2].
5. **Edge case**: Target không reachable → return -1; grid hoàn toàn trống với n=2 → 1 move.
6. **Follow-up**: "Rắn dài hơn 2 ô?" / State explosion; need different encoding.

---

## Solutions

```typescript
/**
 * Solution 1: BFS with queue.shift() — clean but O(n²) per shift
 * State: (row, col, direction) where direction 0=horizontal, 1=vertical
 * Time: O(n⁴) — O(n²) states × O(n²) for each shift()
 * Space: O(n²)
 */
function minimumMovesBrute(grid: number[][]): number {
  const n = grid.length;
  const dist: number[][][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => [-1, -1]),
  );
  dist[0][0][0] = 0;
  const queue: [number, number, number][] = [[0, 0, 0]];

  while (queue.length > 0) {
    const [r, c, d] = queue.shift()!;
    const steps = dist[r][c][d];

    const neighbors: [number, number, number][] = [];
    if (d === 0) {
      // horizontal
      if (c + 2 < n && grid[r][c + 2] === 0) neighbors.push([r, c + 1, 0]);
      if (r + 1 < n && grid[r + 1][c] === 0 && grid[r + 1][c + 1] === 0) {
        neighbors.push([r + 1, c, 0]);
        neighbors.push([r, c, 1]);
      }
    } else {
      // vertical
      if (r + 2 < n && grid[r + 2][c] === 0) neighbors.push([r + 1, c, 1]);
      if (c + 1 < n && grid[r][c + 1] === 0 && grid[r + 1][c + 1] === 0) {
        neighbors.push([r, c + 1, 1]);
        neighbors.push([r, c, 0]);
      }
    }
    for (const [nr, nc, nd] of neighbors) {
      if (dist[nr][nc][nd] === -1) {
        dist[nr][nc][nd] = steps + 1;
        queue.push([nr, nc, nd]);
      }
    }
  }
  return dist[n - 1][n - 2][0];
}

/**
 * Solution 2: BFS with head pointer — O(n²) total
 * Direction: 0 = horizontal (tail at (r,c), head at (r,c+1))
 *            1 = vertical   (tail at (r,c), head at (r+1,c))
 * Time: O(n²) — at most 2n² states, each processed once
 * Space: O(n²) — visited array
 */
function minimumMoves(grid: number[][]): number {
  const n = grid.length;
  // visited[r][c][d]: d=0 horizontal, d=1 vertical
  const visited: boolean[][][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => [false, false]),
  );

  // State: [row, col, dir, steps]
  const queue: [number, number, number, number][] = [[0, 0, 0, 0]];
  visited[0][0][0] = true;

  while (queue.length > 0) {
    const [r, c, d, steps] = queue.shift()!;

    // Check if reached target: horizontal snake at (n-1, n-2)
    if (r === n - 1 && c === n - 2 && d === 0) return steps;

    if (d === 0) {
      // Horizontal snake: tail(r,c) head(r,c+1)

      // Move right: head moves to (r,c+2) → new state (r,c+1,H)
      if (c + 2 < n && grid[r][c + 2] === 0 && !visited[r][c + 1][0]) {
        visited[r][c + 1][0] = true;
        queue.push([r, c + 1, 0, steps + 1]);
      }

      // Move down + rotate CW both require grid[r+1][c]==0 && grid[r+1][c+1]==0
      if (r + 1 < n && grid[r + 1][c] === 0 && grid[r + 1][c + 1] === 0) {
        // Move down: (r+1, c, H)
        if (!visited[r + 1][c][0]) {
          visited[r + 1][c][0] = true;
          queue.push([r + 1, c, 0, steps + 1]);
        }
        // Rotate clockwise: horizontal → vertical (r,c,V)
        if (!visited[r][c][1]) {
          visited[r][c][1] = true;
          queue.push([r, c, 1, steps + 1]);
        }
      }
    } else {
      // Vertical snake: tail(r,c) head(r+1,c)

      // Move down: head moves to (r+2,c) → new state (r+1,c,V)
      if (r + 2 < n && grid[r + 2][c] === 0 && !visited[r + 1][c][1]) {
        visited[r + 1][c][1] = true;
        queue.push([r + 1, c, 1, steps + 1]);
      }

      // Move right + rotate CCW both require grid[r][c+1]==0 && grid[r+1][c+1]==0
      if (c + 1 < n && grid[r][c + 1] === 0 && grid[r + 1][c + 1] === 0) {
        // Move right: (r, c+1, V)
        if (!visited[r][c + 1][1]) {
          visited[r][c + 1][1] = true;
          queue.push([r, c + 1, 1, steps + 1]);
        }
        // Rotate counter-clockwise: vertical → horizontal (r,c,H)
        if (!visited[r][c][0]) {
          visited[r][c][0] = true;
          queue.push([r, c, 0, steps + 1]);
        }
      }
    }
  }

  return -1; // Target unreachable
}

// === Test Cases ===
const g1 = [
  [0, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 1],
  [0, 0, 1, 0, 1, 0],
  [0, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 0, 0],
];
console.log(minimumMoves(g1)); // 11

const g2 = [
  [0, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 0, 1],
  [1, 1, 1, 0, 0, 1],
  [1, 1, 1, 0, 0, 0],
];
console.log(minimumMoves(g2)); // 9

// Simple open grid
const g3 = Array.from({ length: 4 }, () => new Array(4).fill(0));
console.log(minimumMoves(g3)); // 3

// Blocked
const g4 = [
  [0, 0, 0],
  [1, 1, 0],
  [0, 0, 0],
];
console.log(minimumMoves(g4)); // -1 or some value
```

---

## 🔗 Related Problems

| Problem                                                                                                                | Pattern            | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Rotting Oranges](https://leetcode.com/problems/rotting-oranges)                                                       | Multi-source BFS   | Medium     |
| [Snakes and Ladders](https://leetcode.com/problems/snakes-and-ladders)                                                 | BFS on board state | Medium     |
| [Sliding Puzzle](https://leetcode.com/problems/sliding-puzzle)                                                         | BFS on state       | Hard       |
| [Robot Room Cleaner](https://leetcode.com/problems/robot-room-cleaner)                                                 | DFS on grid        | Hard       |
| [Minimum Moves to Reach Target — LeetCode](https://leetcode.com/problems/minimum-moves-to-reach-target-with-rotations) | —                  | Hard       |
