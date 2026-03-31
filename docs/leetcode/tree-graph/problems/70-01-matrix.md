---
layout: page
title: "01 Matrix"
difficulty: Medium
category: Tree-Graph
tags: [Array, Dynamic Programming, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/01-matrix"
---

# 01 Matrix / Ma Trận 0-1

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Multi-Source BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Shortest Bridge](https://leetcode.com/problems/shortest-bridge) | [Walls and Gates](https://leetcode.com/problems/walls-and-gates)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đợt lũ lụt — nước từ tất cả các ô `0` cùng dâng lên đồng thời, lan đến các ô `1` theo từng bước. Ô `1` nào được nước chạm tới trước thì khoảng cách đó là đáp án — đây là **Multi-source BFS**.

**Pattern Recognition:**

- Signal: "distance to nearest 0" + matrix → **Multi-source BFS from all 0s**
- Anti-pattern: BFS từ mỗi ô `1` riêng lẻ là O(N²·M²) — quá chậm
- Key trick: đẩy tất cả ô `0` vào queue ngay từ đầu, BFS mở rộng ra tính distance cho ô `1`

**Visual:**

```
Input:           BFS waves from 0s:
0 0 0            0  0  0
0 1 0    →       0  1  0   (1 step from nearest 0)
1 1 1            1  2  1   (2 steps for center 1)
Answer:
0 0 0
0 1 0
1 2 1
```

---

## Problem Description

Given an `m x n` binary matrix `mat`, return a matrix of the same size where each cell contains the **distance to the nearest 0**. Distance is measured as the number of steps (4-directional moves). All `0` cells have distance 0.

**Example 1:** `mat=[[0,0,0],[0,1,0],[0,0,0]]` → `[[0,0,0],[0,1,0],[0,0,0]]`
**Example 2:** `mat=[[0,0,0],[0,1,0],[1,1,1]]` → `[[0,0,0],[0,1,0],[1,2,1]]`

Constraints: `m, n` in `[1, 10⁴]`, `m*n <= 10⁴`, at least one `0` in `mat`.

---

## 📝 Interview Tips

1. **Clarify**: "Có ít nhất 1 ô 0 không? Di chuyển 4 chiều hay 8 chiều?" / Confirm at least one 0 and movement direction
2. **Multi-source BFS**: "Seed queue với tất cả ô 0, set dist=0; các ô 1 set dist=Infinity" / Seed all 0s, expand outward
3. **DP alternative**: "DP 2 pass: top-left rồi bottom-right cũng được O(MN)" / Two-pass DP is also valid
4. **Edge cases**: "Ma trận toàn 0 → tất cả khoảng cách = 0" / All-zero matrix: answer is all zeros
5. **Space**: "Có thể modify in-place bằng cách dùng -1 làm unvisited marker" / Use -1 for unvisited to save space
6. **Follow-up**: "Nếu có thể di chuyển 8 hướng? Dùng Chebyshev distance" / 8-direction uses max(|dr|,|dc|)

---

## Solutions

```typescript
/**
 * Solution 1: Multi-source BFS (optimal)
 * Time: O(M·N) — each cell processed once
 * Space: O(M·N) — queue + distance matrix
 */
function updateMatrix(mat: number[][]): number[][] {
  const m = mat.length,
    n = mat[0].length;
  const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  const queue: [number, number][] = [];

  // Seed all 0 cells
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (mat[i][j] === 0) {
        dist[i][j] = 0;
        queue.push([i, j]);
      }
    }
  }

  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && dist[nr][nc] > dist[r][c] + 1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
  return dist;
}

/**
 * Solution 2: Two-pass Dynamic Programming
 * Time: O(M·N) — two sweeps over the matrix
 * Space: O(M·N) — distance matrix only
 */
function updateMatrixDP(mat: number[][]): number[][] {
  const m = mat.length,
    n = mat[0].length;
  const INF = m + n; // max possible distance
  const dist = mat.map((row) => row.map((v) => (v === 0 ? 0 : INF)));

  // Top-left sweep
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i > 0) dist[i][j] = Math.min(dist[i][j], dist[i - 1][j] + 1);
      if (j > 0) dist[i][j] = Math.min(dist[i][j], dist[i][j - 1] + 1);
    }
  }
  // Bottom-right sweep
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (i < m - 1) dist[i][j] = Math.min(dist[i][j], dist[i + 1][j] + 1);
      if (j < n - 1) dist[i][j] = Math.min(dist[i][j], dist[i][j + 1] + 1);
    }
  }
  return dist;
}

// === Test Cases ===
console.log(
  updateMatrix([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]),
); // [[0,0,0],[0,1,0],[0,0,0]]
console.log(
  updateMatrix([
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
  ]),
); // [[0,0,0],[0,1,0],[1,2,1]]
console.log(
  updateMatrixDP([
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
  ]),
); // [[0,0,0],[0,1,0],[1,2,1]]
```

---

## 🔗 Related Problems

| Problem                                                                                                              | Pattern          | Difficulty |
| -------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| [Shortest Bridge](https://leetcode.com/problems/shortest-bridge)                                                     | DFS + BFS        | 🟡 Medium  |
| [Walls and Gates](https://leetcode.com/problems/walls-and-gates)                                                     | Multi-source BFS | 🟡 Medium  |
| [Rotting Oranges](https://leetcode.com/problems/rotting-oranges)                                                     | Multi-source BFS | 🟡 Medium  |
| [As Far from Land as Possible](https://leetcode.com/problems/as-far-from-land-as-possible)                           | Multi-source BFS | 🟡 Medium  |
| [Minimum Number of Visited Cells in a Grid](https://leetcode.com/problems/minimum-number-of-visited-cells-in-a-grid) | BFS DP           | 🔴 Hard    |
