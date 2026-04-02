---
layout: page
title: "Check if There is a Valid Path in a Grid"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Union Find, Matrix]
leetcode_url: "https://leetcode.com/problems/check-if-there-is-a-valid-path-in-a-grid"
---

# Check if There is a Valid Path in a Grid / Kiểm Tra Đường Đi Hợp Lệ Trong Lưới

> **Track**: Tree-Graph | **Difficulty**: 🟡 Medium | **Pattern**: BFS / Union Find — Street Connection Rules
> **Frequency**: 📘 Tier 3 — Gặp ở Google, Facebook
> **See also**: [1162 As Far from Land as Possible](https://leetcode.com/problems/as-far-from-land-as-possible) | [1091 Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng một thành phố có 6 loại ô đường khác nhau — loại 1 là đường ngang, loại 2 là đường dọc, loại 3-6 là các khúc cua. Bạn cần kiểm tra xem có đường thông từ góc trên-trái đến góc dưới-phải không, như nối đường ray tàu hỏa. Hai ô kề nhau chỉ kết nối được nếu cả hai "mở cửa" về phía nhau — ô bên phải phải có cổng bên trái, ô bên dưới phải có cổng bên trên.

**Pattern Recognition:**

- Signal: "grid with typed cells, check connectivity" → **BFS with connection rules**
- Bài này thuộc dạng BFS/DFS trên ma trận với luật kết nối đặc biệt theo loại ô
- Key insight: mỗi loại street mở cổng về những hướng cố định; hai ô liền kề kết nối ↔ cả hai đều mở cổng về phía nhau

**Visual — Street types and connections:**

```
Street types (which directions are open):
  1: ←→  (left, right)
  2: ↑↓  (up, down)
  3: ←↓  (left, down)
  4: →↓  (right, down)
  5: →↑  (right, up)
  6: ←↑  (left, up)

Grid: [[2,4,3],[6,5,2]]
  (0,0)=2↑↓  (0,1)=4→↓  (0,2)=3←↓
  (1,0)=6←↑  (1,1)=5→↑  (1,2)=2↑↓

BFS from (0,0):
  (0,0) type2 opens: up, down
  → try down to (1,0): type6 opens left,up — has "up"? yes ✓ → visit (1,0)
  (1,0) type6 opens: left, up
  → try left: out of bounds ✗; try up: already visited ✗
  Dead end... try (0,1):
  (0,0)→right: type2 opens right? No. Not reachable.
  ... continue BFS → eventually reaches (1,2)=target ✅
```

---

## Problem Description

Given an m×n grid where each cell has a "street" value 1–6 indicating which directions it connects, determine if there is a valid path from top-left `(0,0)` to bottom-right `(m-1,n-1)`. Two adjacent cells are connected only if both cells open toward each other. ([LeetCode](https://leetcode.com/problems/check-if-there-is-a-valid-path-in-a-grid))

```
Example 1: grid=[[2,4,3],[6,5,2]] → true
Example 2: grid=[[1,2],[1,2]] → false  (type1 opens left/right, no vertical connection)
```

Constraints: 1 ≤ m, n ≤ 300; grid[i][j] ∈ {1,2,3,4,5,6}.

---

## 📝 Interview Tips

1. **Precompute which directions each street type opens** — _Lập bảng tra cứu: loại đường nào mở hướng nào — tránh if-else lồng nhau_
2. **Two cells connect iff cell A opens toward B AND cell B opens back toward A** — _Kết nối hai chiều: A→B và B→A đều phải mở — kiểm tra cả hai điều kiện_
3. **BFS from (0,0) with visited array to avoid revisiting** — _BFS đơn giản, thêm visited để không lặp vô hạn_
4. **Check boundary before adding to queue** — _Kiểm tra biên trước khi đẩy vào queue — tránh index out of bounds_
5. **Alternative: Union-Find — union neighboring cells that connect, check if (0,0) and (m-1,n-1) same component** — _Cách khác: Union-Find nối các ô kết nối được, rồi hỏi same-component_
6. **Single-cell grid (m=n=1) is always true** — _Lưới 1×1: đã ở đích ngay từ đầu — trả về true_

---

## Solutions

```typescript
/** Solution 1: BFS with direction connection rules
 * @complexity Time: O(m×n) | Space: O(m×n) */
function hasValidPath(grid: number[][]): boolean {
  const m = grid.length,
    n = grid[0].length;
  // For each street type, which directions does it open?
  // directions: 0=left, 1=right, 2=up, 3=down
  const opens: boolean[][] = [
    [],
    [true, true, false, false], // 1: left, right
    [false, false, true, true], // 2: up, down
    [true, false, false, true], // 3: left, down
    [false, true, false, true], // 4: right, down
    [false, true, true, false], // 5: right, up
    [true, false, true, false], // 6: left, up
  ];
  // [dr, dc, myDir, neighborDir]
  const dirs = [
    [0, -1, 0, 1], // move left:  my "left"(0) must open, neighbor's "right"(1) must open
    [0, 1, 1, 0], // move right: my "right"(1), neighbor's "left"(0)
    [-1, 0, 2, 3], // move up:    my "up"(2), neighbor's "down"(3)
    [1, 0, 3, 2], // move down:  my "down"(3), neighbor's "up"(2)
  ];

  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  visited[0][0] = true;
  const queue: [number, number][] = [[0, 0]];

  while (queue.length) {
    const [r, c] = queue.shift()!;
    if (r === m - 1 && c === n - 1) return true;
    const t = grid[r][c];
    for (const [dr, dc, myDir, nbrDir] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (visited[nr][nc]) continue;
      if (!opens[t][myDir]) continue; // current cell must open this direction
      if (!opens[grid[nr][nc]][nbrDir]) continue; // neighbor must open back
      visited[nr][nc] = true;
      queue.push([nr, nc]);
    }
  }
  return false;
}

/** Solution 2: Union-Find approach
 * @complexity Time: O(m×n × α) | Space: O(m×n) */
function hasValidPath2(grid: number[][]): boolean {
  const m = grid.length,
    n = grid[0].length;
  const parent = Array.from({ length: m * n }, (_, i) => i);
  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a: number, b: number): void {
    parent[find(a)] = find(b);
  }

  const opens: boolean[][] = [
    [],
    [true, true, false, false],
    [false, false, true, true],
    [true, false, false, true],
    [false, true, false, true],
    [false, true, true, false],
    [true, false, true, false],
  ];
  const dirs = [
    [0, -1, 0, 1],
    [0, 1, 1, 0],
    [-1, 0, 2, 3],
    [1, 0, 3, 2],
  ];

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      const t = grid[r][c];
      for (const [dr, dc, myDir, nbrDir] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
        if (opens[t][myDir] && opens[grid[nr][nc]][nbrDir]) {
          union(r * n + c, nr * n + nc);
        }
      }
    }
  }
  return find(0) === find((m - 1) * n + (n - 1));
}

// === Test Cases ===
console.log(
  hasValidPath([
    [2, 4, 3],
    [6, 5, 2],
  ]),
); // true
console.log(
  hasValidPath([
    [1, 2],
    [1, 2],
  ]),
); // false
console.log(
  hasValidPath2([
    [2, 4, 3],
    [6, 5, 2],
  ]),
); // true
console.log(hasValidPath([[1]])); // true (single cell)
```

---

## 🔗 Related Problems

| #    | Problem                              | Difficulty | Pattern                  |
| ---- | ------------------------------------ | ---------- | ------------------------ |
| 1091 | Shortest Path in Binary Matrix       | Medium     | BFS                      |
| 695  | Max Area of Island                   | Medium     | DFS/BFS                  |
| 990  | Satisfiability of Equality Equations | Medium     | Union Find               |
| 1631 | Path With Minimum Effort             | Medium     | Dijkstra / Binary Search |
