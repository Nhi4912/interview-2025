---
layout: page
title: "Detect Cycles in 2D Grid"
difficulty: Medium
category: Tree & Graph
tags: [Array, DFS, BFS, Union Find, Matrix]
leetcode_url: "https://leetcode.com/problems/detect-cycles-in-2d-grid"
---

# Detect Cycles in 2D Grid / Phát Hiện Chu Trình Trong Lưới 2D

> **Track**: Tree & Graph | **Difficulty**: 🟡 Medium | **Pattern**: DFS Cycle Detection / Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở một số công ty
> **See also**: [Number of Islands](https://leetcode.com/problems/number-of-islands) | [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng một tòa nhà có các phòng được nối với nhau bằng cửa đi giữa. Mỗi phòng có màu sơn (ký tự), và cửa chỉ tồn tại giữa hai phòng cùng màu. Câu hỏi là: liệu có tồn tại một vòng tham quan — xuất phát từ một phòng, đi qua 4+ phòng cùng màu, và quay lại điểm xuất phát mà không đi ngược lại cửa vừa vào? Nếu có, tòa nhà có "chu trình màu" — một vòng kín gồm toàn phòng cùng màu.

## Visual (Minh họa trực quan)

```
grid = [["a","a","a","a"],
        ["a","b","b","a"],
        ["a","b","b","a"],
        ["a","a","a","a"]]

DFS from (0,0) tracing 'a':
(0,0)→(0,1)→(0,2)→(0,3)→(1,3)→(2,3)→(3,3)→(3,2)→(3,1)→(3,0)→(2,0)→(1,0)→(1,0 visited!)
    ↑_______________________________________________↓
         Found cycle (length > 3) → return true ✓

Union Find approach:
Each 'a' cell: union with same-char neighbors
When union finds both already in same component → cycle!
```

## Problem (Bài toán)

Given an `m x n` 2D character grid, determine if there exists a **cycle** consisting of at least **4** cells, where every cell in the cycle has the same value, and adjacent cells share an edge (not diagonal). A cycle cannot reuse the edge it just traversed.

**Example 1:** `grid=[["a","a","a","a"],["a","b","b","a"],["a","b","b","a"],["a","a","a","a"]]` → `true`
**Example 2:** `grid=[["c","c","c","a"],["c","d","c","c"],["c","c","e","c"],["f","c","c","c"]]` → `true`
**Example 3:** `grid=[["a","b","b"],["b","z","b"],["b","b","a"]]` → `false`

**Constraints:** `1 ≤ m, n ≤ 500`, `grid[i][j]` is a lowercase English letter

## Tips (Mẹo phỏng vấn)

- **Cycle length ≥ 4** / Chu trình ≥ 4: Tránh nhầm lần — không được đi ngược lại ô vừa từ đó đến, nên ô đã thăm nhưng không phải parent mới là cycle
- **DFS with parent tracking** / DFS theo dõi parent: Lưu `(prevRow, prevCol)` để tránh quay lại ngay liền — không phải DFS thông thường
- **Union Find alternative** / Union Find thay thế: Khi union hai ô cùng ký tự, nếu chúng cùng component → có cycle; thường gọn hơn
- **4-direction movement** / Di chuyển 4 chiều: Chỉ trên/dưới/trái/phải — không chéo
- **Early termination** / Dừng sớm: Ngay khi tìm thấy một cycle, return `true` luôn — không cần tìm hết
- **Mark visited globally** / Đánh dấu toàn cục: Dùng visited[][] dùng chung cho tất cả DFS calls để không xử lý lại ô đã biết

## Solution 1 - DFS with Parent Tracking

```typescript
/**
 * @complexity Time: O(m*n) | Space: O(m*n)
 * DFS tracking previous cell; visited cell (not parent) = cycle
 */
function containsCycle(grid: string[][]): boolean {
  const m = grid.length,
    n = grid[0].length;
  const visited = Array.from({ length: m }, () => new Uint8Array(n));
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function dfs(r: number, c: number, pr: number, pc: number): boolean {
    visited[r][c] = 1;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (nr === pr && nc === pc) continue; // skip parent edge
      if (grid[nr][nc] !== grid[r][c]) continue; // different char
      if (visited[nr][nc]) return true; // found cycle!
      if (dfs(nr, nc, r, c)) return true;
    }
    return false;
  }

  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) if (!visited[r][c] && dfs(r, c, -1, -1)) return true;

  return false;
}
```

## Solution 2 - Union Find (Optimal)

```typescript
/**
 * @complexity Time: O(m*n*α(m*n)) | Space: O(m*n)
 * Union adjacent same-char cells; if already same component → cycle exists
 */
function containsCycleUF(grid: string[][]): boolean {
  const m = grid.length,
    n = grid[0].length;
  const parent = Int32Array.from({ length: m * n }, (_, i) => i);
  const rank = new Uint8Array(m * n);

  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }

  function union(a: number, b: number): boolean {
    const ra = find(a),
      rb = find(b);
    if (ra === rb) return false; // already same → cycle
    if (rank[ra] < rank[rb]) {
      parent[ra] = rb;
    } else if (rank[ra] > rank[rb]) {
      parent[rb] = ra;
    } else {
      parent[rb] = ra;
      rank[ra]++;
    }
    return true;
  }

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      const id = r * n + c;
      if (r > 0 && grid[r][c] === grid[r - 1][c] && !union(id, (r - 1) * n + c)) return true;
      if (c > 0 && grid[r][c] === grid[r][c - 1] && !union(id, r * n + c - 1)) return true;
    }
  }
  return false;
}
```

## Test Cases

```typescript
console.log(
  containsCycle([
    ["a", "a", "a", "a"],
    ["a", "b", "b", "a"],
    ["a", "b", "b", "a"],
    ["a", "a", "a", "a"],
  ]),
); // → true
console.log(
  containsCycle([
    ["a", "b", "b"],
    ["b", "z", "b"],
    ["b", "b", "a"],
  ]),
); // → false
console.log(
  containsCycleUF([
    ["c", "c", "c", "a"],
    ["c", "d", "c", "c"],
    ["c", "c", "e", "c"],
    ["f", "c", "c", "c"],
  ]),
); // → true
console.log(containsCycleUF([["a"]])); // → false
```

## Related Problems

| Problem              | Difficulty | Link                                                         |
| -------------------- | ---------- | ------------------------------------------------------------ |
| Number of Islands    | Medium     | [LC 200](https://leetcode.com/problems/number-of-islands)    |
| Graph Valid Tree     | Medium     | [LC 261](https://leetcode.com/problems/graph-valid-tree)     |
| Redundant Connection | Medium     | [LC 684](https://leetcode.com/problems/redundant-connection) |
