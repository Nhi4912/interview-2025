---
layout: page
title: "Find All Groups of Farmland"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/find-all-groups-of-farmland"
---

# Find All Groups of Farmland / Tìm Tất Cả Nhóm Đất Nông Nghiệp

🟡 Medium | BFS/DFS | Matrix

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Giống như nhìn từ trên cao xuống các cánh đồng hình chữ nhật — mỗi cánh đồng là một khối ô `1` hình chữ nhật. Chỉ cần tìm **góc trên-trái** và **góc dưới-phải** của mỗi khối là xong.

```
land:          Farmland groups:
1 1 0 0        [0,0,1,1] ← rect from (0,0) to (1,1)
1 1 0 0
0 0 1 0        [2,2,2,2] ← single cell
0 0 0 1        [3,3,3,3] ← single cell
```

**Key insight:** Scan top-left to bottom-right. When you find a `1` cell, it must be the top-left corner of a new rectangle (since left and above are 0 or boundary). Expand right and down to find bottom-right corner, then mark all cells.

## Problem Description

Given a binary matrix `land` (0=forest, 1=farmland), find all rectangular farmland groups. Each group is a rectangular submatrix of 1s, not adjacent to other farmland. Return `[r1,c1,r2,c2]` for each group where `(r1,c1)` is top-left and `(r2,c2)` is bottom-right.

**Example 1:**

- Input: `[[1,0,0],[0,1,1],[0,1,1]]`
- Output: `[[0,0,0,0],[1,1,2,2]]`

**Example 2:**

- Input: `[[1,1],[1,1]]`
- Output: `[[0,0,1,1]]`

## 📝 Interview Tips

- **Q: Why scan only top-left corners? / Tại sao chỉ quét góc trên-trái?**
  - A: Problem guarantees rectangles don't touch — the first unvisited 1 is always a new top-left corner / Đề bảo đảm các hình chữ nhật không tiếp xúc.
- **Q: How find bottom-right? / Tìm góc dưới-phải thế nào?**
  - A: Expand row and column until hitting a 0 or boundary / Mở rộng hàng và cột cho đến khi gặp 0 hoặc biên.
- **Q: Time complexity? / Độ phức tạp?**
  - A: O(m*n) — each cell visited at most twice / O(m*n) — mỗi ô được thăm tối đa hai lần.
- **Q: Can we use BFS/DFS instead? / Có thể dùng BFS/DFS không?**
  - A: Yes, but the direct expansion is simpler and faster / Có, nhưng mở rộng trực tiếp đơn giản và nhanh hơn.
- **Q: What if land is all 0s? / Nếu ma trận toàn 0?**
  - A: Return empty array / Trả về mảng rỗng.
- **Q: Do we need to restore the matrix? / Có cần khôi phục ma trận không?**
  - A: If modifying in-place, yes — or use visited array / Nếu sửa tại chỗ, cần khôi phục — hoặc dùng mảng visited.

## Solutions

### Solution 1: Scan Top-Left Corners (Optimal)

```typescript
/**
 * Find all rectangular farmland groups.
 * Time: O(m*n)  Space: O(1) extra (modifies input)
 */
function findFarmland(land: number[][]): number[][] {
  const m = land.length,
    n = land[0].length;
  const result: number[][] = [];

  for (let r1 = 0; r1 < m; r1++) {
    for (let c1 = 0; c1 < n; c1++) {
      if (land[r1][c1] !== 1) continue;

      // Found top-left corner, find bottom-right
      let r2 = r1,
        c2 = c1;
      while (r2 + 1 < m && land[r2 + 1][c1] === 1) r2++;
      while (c2 + 1 < n && land[r1][c2 + 1] === 1) c2++;

      result.push([r1, c1, r2, c2]);

      // Mark entire rectangle as visited
      for (let i = r1; i <= r2; i++) for (let j = c1; j <= c2; j++) land[i][j] = 0;
    }
  }
  return result;
}

// Tests
console.log(
  JSON.stringify(
    findFarmland([
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 1],
    ]),
  ),
);
// [[0,0,0,0],[1,1,2,2]]
console.log(
  JSON.stringify(
    findFarmland([
      [1, 1],
      [1, 1],
    ]),
  ),
);
// [[0,0,1,1]]
console.log(JSON.stringify(findFarmland([[0]])));
// []
```

### Solution 2: BFS from Each Unvisited Cell

```typescript
/**
 * Find farmland groups using BFS.
 * Time: O(m*n)  Space: O(m*n)
 */
function findFarmlandBFS(land: number[][]): number[][] {
  const m = land.length,
    n = land[0].length;
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  const result: number[][] = [];

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (land[r][c] !== 1 || visited[r][c]) continue;

      // BFS to find all cells in this farmland group
      const queue: [number, number][] = [[r, c]];
      visited[r][c] = true;
      let r2 = r,
        c2 = c;

      while (queue.length) {
        const [cr, cc] = queue.shift()!;
        r2 = Math.max(r2, cr);
        c2 = Math.max(c2, cc);
        for (const [dr, dc] of [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ]) {
          const nr = cr + dr,
            nc = cc + dc;
          if (nr >= 0 && nr < m && nc >= 0 && nc < n && land[nr][nc] === 1 && !visited[nr][nc]) {
            visited[nr][nc] = true;
            queue.push([nr, nc]);
          }
        }
      }
      result.push([r, c, r2, c2]);
    }
  }
  return result;
}

// Tests
console.log(
  JSON.stringify(
    findFarmlandBFS([
      [1, 0, 0],
      [0, 1, 1],
      [0, 1, 1],
    ]),
  ),
);
// [[0,0,0,0],[1,1,2,2]]
```

## 🔗 Related Problems

| #    | Problem                  | Difficulty | Key Concept |
| ---- | ------------------------ | ---------- | ----------- |
| 200  | Number of Islands        | Medium     | BFS/DFS     |
| 695  | Max Area of Island       | Medium     | DFS         |
| 1020 | Number of Enclaves       | Medium     | BFS         |
| 1254 | Number of Closed Islands | Medium     | DFS         |
