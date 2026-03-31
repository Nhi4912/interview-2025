---
layout: page
title: "Bricks Falling When Hit"
difficulty: Hard
category: Array
tags: [Array, Union Find, Matrix]
leetcode_url: "https://leetcode.com/problems/bricks-falling-when-hit"
---

# Bricks Falling When Hit / Gạch Rơi Khi Bị Đánh

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Union Find (Reverse)
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng đập gạch từ cuối ngược về đầu: thay vì phá gạch và đếm rơi, ta **thêm gạch trở lại** từ lần đập cuối cùng đến đầu. Khi thêm một viên gạch, ta dùng Union Find để kiểm tra xem nó kết nối bao nhiêu viên vào mái trên (row 0). Sự tăng trưởng của component connected to roof = số gạch "được cứu" = gạch rơi ở bước gốc.

**Pattern Recognition:**

- "Remove elements, check connectivity" → Reverse: add elements + Union Find
- "Connected to ceiling" → Virtual node representing row 0
- After reverse processing: size_before - size_after = bricks that fell

**Visual:**

```
grid=[[1,0,0,0],[1,1,1,0]], hits=[[1,0]]
Reverse: start with grid after all hits applied

Step 1 (restore hit[1,0]=1):
  Before: roof-component size=0
  After union: brick(1,0) joins roof via brick(0,0)→roof
  roof size: 0→2, fell = max(0, 2-1-1) = 0

Step 0: no brick at [1,0] initially anyway...
→ result: [0]

Real example: grid=[[1,0,0,0],[1,1,0,0]], hits=[[1,1],[1,0]]
answer: [0,2] — hitting [1,1] first causes no fall; hitting [1,0] causes 2 bricks to fall
```

## Problem Description

Given `grid` (m×n binary) and `hits` array, after each hit remove `grid[r][c]` (if it's 1). A brick falls if it's no longer connected to the top row (directly or through other bricks). Return array of bricks fallen per hit.

- `grid=[[1,0,0,0],[1,1,1,0]], hits=[[1,0]]` → `[2]`
- `grid=[[1,0,0,0],[1,1,0,0]], hits=[[1,1],[1,0]]` → `[0,2]`

## 📝 Interview Tips

1. **Clarify**: Hitting a 0-cell counts as 0 fallen bricks / đánh ô trống thì không có gạch rơi
2. **Approach**: Reverse time — add bricks back and track roof-component growth / xử lý ngược
3. **Edge cases**: Hit same cell twice — second hit has no brick / đánh hai lần ô giống nhau
4. **Optimize**: Virtual "roof" node at index m\*n, union by size for O(α) / nút roof ảo + union by size
5. **Follow-up**: What if gravity pulls sideways? → Same reverse UF approach / trọng lực ngang
6. **Complexity**: Time O((m*n + hits) * α), Space O(m*n) / thời gian gần O(m*n), không gian O(m\*n)

## Solutions

```typescript
/** Solution 1: BFS per hit — naïve approach
 * Time: O(hits * m * n) | Space: O(m * n)
 */
function hitBricksBFS(grid: number[][], hits: number[][]): number[] {
  const m = grid.length,
    n = grid[0].length;
  const g = grid.map((r) => [...r]);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const countRoofConnected = (): number => {
    const visited = Array.from({ length: m }, () => new Array(n).fill(false));
    const queue: [number, number][] = [];
    for (let c = 0; c < n; c++) {
      if (g[0][c] === 1) {
        queue.push([0, c]);
        visited[0][c] = true;
      }
    }
    let count = 0;
    while (queue.length) {
      const [r, c] = queue.shift()!;
      count++;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc] && g[nr][nc] === 1) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    return count;
  };

  const result: number[] = [];
  for (const [r, c] of hits) {
    if (g[r][c] === 0) {
      result.push(0);
      continue;
    }
    g[r][c] = 0;
    const before = countRoofConnected();
    // temporarily restore
    g[r][c] = 1;
    const after = countRoofConnected();
    result.push(Math.max(0, after - before - 1));
    g[r][c] = 0;
  }
  return result;
}

/** Solution 2: Reverse Union Find — add bricks back, track roof component
 * Time: O((m*n + hits) * α) | Space: O(m*n)
 */
function hitBricks(grid: number[][], hits: number[][]): number[] {
  const m = grid.length,
    n = grid[0].length;
  const ROOF = m * n; // virtual node representing top row
  const parent = Array.from({ length: m * n + 1 }, (_, i) => i);
  const size = new Array(m * n + 1).fill(1);

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (a: number, b: number) => {
    a = find(a);
    b = find(b);
    if (a === b) return;
    if (size[a] < size[b]) [a, b] = [b, a];
    parent[b] = a;
    size[a] += size[b];
  };
  const idx = (r: number, c: number) => r * n + c;
  const roofSize = () => size[find(ROOF)];

  // Apply all hits to a working copy
  const g = grid.map((r) => [...r]);
  for (const [r, c] of hits) g[r][c] = 0;

  // Build initial UF from post-all-hits state
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (g[r][c] !== 1) continue;
      if (r === 0) union(idx(r, c), ROOF);
      if (r > 0 && g[r - 1][c] === 1) union(idx(r, c), idx(r - 1, c));
      if (c > 0 && g[r][c - 1] === 1) union(idx(r, c), idx(r, c - 1));
    }
  }

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const result: number[] = new Array(hits.length).fill(0);

  // Reverse: add bricks back
  for (let h = hits.length - 1; h >= 0; h--) {
    const [r, c] = hits[h];
    if (grid[r][c] === 0) continue; // was already empty — no change

    const prevRoof = roofSize();
    g[r][c] = 1;
    if (r === 0) union(idx(r, c), ROOF);
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && g[nr][nc] === 1) {
        union(idx(r, c), idx(nr, nc));
      }
    }
    const newRoof = roofSize();
    result[h] = Math.max(0, newRoof - prevRoof - 1);
  }
  return result;
}

// Test cases
console.log(
  hitBricks(
    [
      [1, 0, 0, 0],
      [1, 1, 1, 0],
    ],
    [[1, 0]],
  ),
); // [2]
console.log(
  hitBricks(
    [
      [1, 0, 0, 0],
      [1, 1, 0, 0],
    ],
    [
      [1, 1],
      [1, 0],
    ],
  ),
); // [0,2]
console.log(hitBricks([[1]], [[0, 0]])); // [0]
console.log(
  hitBricksBFS(
    [
      [1, 0, 0, 0],
      [1, 1, 1, 0],
    ],
    [[1, 0]],
  ),
); // [2]
console.log(
  hitBricks(
    [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 2],
      [0, 1],
      [1, 1],
    ],
  ),
); // [0,1,2]
```
