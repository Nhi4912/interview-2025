---
layout: page
title: "Number of Distinct Islands"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Depth-First Search, Breadth-First Search, Union Find, Hash Function]
leetcode_url: "https://leetcode.com/problems/number-of-distinct-islands"
---

# Number of Distinct Islands / Số Đảo Khác Biệt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS + Shape Hashing
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Number of Islands](https://leetcode.com/problems/number-of-islands) | [Number of Distinct Islands II](https://leetcode.com/problems/number-of-distinct-islands-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như nhận dạng chữ viết tay — hai chữ "A" ở vị trí khác nhau vẫn là cùng 1 hình dạng nếu ta dịch chuyển về cùng gốc toạ độ. Đảo khác biệt = hình dạng khác nhau sau khi normalize về gốc (0,0).

**Pattern Recognition:**

- Signal: "count unique shapes in grid" → **DFS + normalize path as signature**
- Sau khi DFS mỗi đảo, encode lộ trình (relative movement) thành string
- Key insight: hai đảo giống nhau khi path DFS (với same traversal order) giống nhau

**Visual — Normalize bằng relative path:**

```
Grid:          Island A starts (0,0):   Island B starts (2,3):
1 1 0 0 1      DFS path: R D            DFS path: R D
1 0 0 0 1      Relative: (0,0)(0,1)(1,1) Relative: (0,0)(0,1)(1,1)
0 0 0 1 1      Signature: "RDB"          Signature: "RDB"
                                         → SAME shape ✅

Encode: R=right, D=down, L=left, U=up, B=backtrack
```

---

## Problem Description

Cho một grid nhị phân (0=nước, 1=đất). Đảo là nhóm 1s liên thông 4 chiều. Hai đảo **distinct** nếu hình dạng khác nhau (không thể dịch chuyển để trùng nhau). Trả về số đảo distinct. ([LeetCode](https://leetcode.com/problems/number-of-distinct-islands))

**Example 1:**

```
11000    Đảo A: (0,0)(0,1)(1,0)
11000    Đảo B: (0,4)(1,4)(2,4) — hình dạng khác
00011    → Output: 2
```

**Example 2:**

```
11011    Đảo A và B có hình dạng giống nhau
10001    → Output: 3
01101
```

Constraints: `1 <= m, n <= 50`, grid[i][j] ∈ {0, 1}

---

## 📝 Interview Tips

1. **Clarify**: "Distinct theo translation (dịch) hay cả rotation/reflection?" / Distinct by translation only, or also rotation/reflection?
2. **Key insight**: "Encode DFS traversal path as string — same path = same shape" / Path encoding with direction + backtrack markers
3. **Normalize**: "Normalize to (0,0) origin bằng cách trừ start row/col" / Subtract starting position for translation-invariance
4. **Backtrack marker**: "Cần 'B' khi backtrack để phân biệt hình dạng có cùng cell count" / Backtrack marker distinguishes different shapes with same cells
5. **Edge cases**: "Single cell islands đều giống nhau" / All single-cell islands are identical
6. **Follow-up**: "Nếu tính cả rotation và reflection?" / Handle rotation/reflection? → canonical form normalization

---

## Solutions

```typescript
/**
 * Solution 1: DFS with relative coordinate set as signature
 * Time: O(m·n·log(m·n)) — DFS + Set insertion with string comparison
 * Space: O(m·n) — visited + signatures
 */
function numDistinctIslandsByCoords(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const shapes = new Set<string>();
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));

  function dfs(r: number, c: number, r0: number, c0: number, coords: string[]): void {
    if (r < 0 || r >= m || c < 0 || c >= n) return;
    if (visited[r][c] || grid[r][c] === 0) return;
    visited[r][c] = true;
    coords.push(`${r - r0},${c - c0}`);
    dfs(r + 1, c, r0, c0, coords);
    dfs(r - 1, c, r0, c0, coords);
    dfs(r, c + 1, r0, c0, coords);
    dfs(r, c - 1, r0, c0, coords);
  }

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1 && !visited[r][c]) {
        const coords: string[] = [];
        dfs(r, c, r, c, coords);
        shapes.add(coords.join("|"));
      }
    }
  }
  return shapes.size;
}

/**
 * Solution 2: DFS with direction path encoding (more canonical)
 * Time: O(m·n) — DFS + Set with string hash
 * Space: O(m·n) — visited + path strings
 */
function numDistinctIslands(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const shapes = new Set<string>();
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  const dirMap: [number, number, string][] = [
    [1, 0, "D"],
    [-1, 0, "U"],
    [0, 1, "R"],
    [0, -1, "L"],
  ];

  function dfs(r: number, c: number, path: string[]): void {
    if (r < 0 || r >= m || c < 0 || c >= n) return;
    if (visited[r][c] || grid[r][c] === 0) return;
    visited[r][c] = true;
    for (const [dr, dc, dir] of dirMap) {
      path.push(dir);
      dfs(r + dr, c + dc, path);
      path.push("B"); // backtrack marker — crucial for correctness
    }
  }

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1 && !visited[r][c]) {
        const path: string[] = [];
        dfs(r, c, path);
        shapes.add(path.join(""));
      }
    }
  }
  return shapes.size;
}

// === Test Cases ===
console.log(
  numDistinctIslands([
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
  ]),
); // 3
console.log(
  numDistinctIslands([
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]),
); // 2
console.log(
  numDistinctIslands([
    [0, 0, 0],
    [0, 0, 0],
  ]),
); // 0
console.log(
  numDistinctIslands([
    [1, 0, 1],
    [0, 0, 0],
    [1, 0, 1],
  ]),
); // 1 (all single cells)
```

---

## 🔗 Related Problems

- [Number of Islands](https://leetcode.com/problems/number-of-islands) — bài cơ bản, count islands không cần distinct
- [Number of Distinct Islands II](https://leetcode.com/problems/number-of-distinct-islands-ii) — khó hơn: tính cả rotation/reflection
- [Max Area of Island](https://leetcode.com/problems/max-area-of-island) — DFS đếm size của mỗi island
- [Making a Large Island](https://leetcode.com/problems/making-a-large-island) — Union Find + flip one cell to maximize island
