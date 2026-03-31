---
layout: page
title: "Walls and Gates"
difficulty: Medium
category: Tree-Graph
tags: [Array, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/walls-and-gates"
---

# Walls and Gates / Tường và Cổng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Multi-Source BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Rotting Oranges](https://leetcode.com/problems/rotting-oranges) | [01 Matrix](https://leetcode.com/problems/01-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như dịch bệnh lan ra từ nhiều nguồn cùng lúc — mỗi cổng là một nguồn lây, khoảng cách tới phòng trống là số bước BFS. Bắt đầu từ TẤT CẢ cổng đồng thời thay vì từng phòng riêng lẻ.

**Pattern Recognition:**

- Signal: "fill distance to nearest X" + "multiple starting points" → **Multi-Source BFS**
- INF rooms = chưa thăm, 0 = cổng, -1 = tường
- Key insight: push tất cả cổng vào queue trước, BFS lan khoảng cách ra

**Visual — Multi-source BFS từ gates:**

```
Initial:          After BFS:
INF -1  0 INF     3  -1  0   1
INF INF INF -1    2   2  1  -1
INF -1 INF -1     1  -1  2  -1
  0 -1 INF INF    0  -1  3   4

Gates (0s) → queue → BFS fills distances simultaneously
```

---

## Problem Description

Cho một grid `m x n` chứa: `-1` (tường), `0` (cổng), `INF = 2^31-1` (phòng trống). Điền vào mỗi phòng trống khoảng cách ngắn nhất tới cổng gần nhất. Nếu không thể đến cổng nào thì giữ nguyên `INF`. ([LeetCode](https://leetcode.com/problems/walls-and-gates))

**Example 1:**

```
Input:  [[INF,-1,0,INF],[INF,INF,INF,-1],[INF,-1,INF,-1],[0,-1,INF,INF]]
Output: [[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]
```

**Example 2:**

```
Input:  [[-1]]
Output: [[-1]]
```

Constraints: `1 <= m, n <= 250`, values ∈ {-1, 0, 2^31-1}

---

## 📝 Interview Tips

1. **Clarify**: "Grid có guaranteed có ít nhất 1 gate không?" / Is there guaranteed at least one gate, or can all be walls?
2. **Brute force**: "BFS từ mỗi phòng riêng lẻ O(m·n·(m+n))" → multi-source O(m·n) / Single-source per room vs all gates at once
3. **Key insight**: "Bắt đầu từ tất cả gate đồng thời — BFS đảm bảo level = distance" / All gates in queue simultaneously guarantees shortest path
4. **Edge cases**: "Không có gate → tất cả giữ INF; toàn tường → không đổi" / No gates keeps all INF, all walls no change
5. **In-place**: "Modify trực tiếp grid, không cần visited array vì INF → distance thay thế" / Modifying grid in-place replaces visited set
6. **Follow-up**: "Điều gì thay đổi nếu tường cũng có chi phí đi qua?" / What if walls had traversal cost? → Dijkstra

---

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

const INF = 2147483647;

/**
 * Solution 1: Brute Force — BFS from each empty room
 * Time: O((m·n)²) — BFS per room
 * Space: O(m·n) — visited set per BFS
 */
function wallsAndGatesBrute(rooms: number[][]): void {
  const m = rooms.length,
    n = rooms[0].length;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (rooms[r][c] !== INF) continue;
      // BFS from (r,c) to find nearest gate
      const queue: [number, number, number][] = [[r, c, 0]];
      const visited = new Set<number>();
      visited.add(r * n + c);
      let found = false;
      while (queue.length && !found) {
        const [row, col, dist] = queue.shift()!;
        for (const [dr, dc] of dirs) {
          const nr = row + dr,
            nc = col + dc;
          if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
          if (visited.has(nr * n + nc) || rooms[nr][nc] === -1) continue;
          if (rooms[nr][nc] === 0) {
            rooms[r][c] = dist + 1;
            found = true;
            break;
          }
          visited.add(nr * n + nc);
          queue.push([nr, nc, dist + 1]);
        }
      }
    }
  }
}

/**
 * Solution 2: Optimal — Multi-Source BFS from all gates simultaneously
 * Time: O(m·n) — each cell visited once
 * Space: O(m·n) — queue size
 */
function wallsAndGates(rooms: number[][]): void {
  const m = rooms.length,
    n = rooms[0].length;
  const queue: [number, number][] = [];
  // Seed queue with all gates
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (rooms[r][c] === 0) queue.push([r, c]);

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let head = 0;
  while (head < queue.length) {
    const [r, c] = queue[head++];
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (rooms[nr][nc] !== INF) continue; // wall, gate, or already filled
      rooms[nr][nc] = rooms[r][c] + 1;
      queue.push([nr, nc]);
    }
  }
}

// === Test Cases ===
const g1 = [
  [INF, -1, 0, INF],
  [INF, INF, INF, -1],
  [INF, -1, INF, -1],
  [0, -1, INF, INF],
];
wallsAndGates(g1);
console.log(g1[0]); // [3, -1, 0, 1]

const g2 = [
  [0, -1],
  [INF, INF],
];
wallsAndGates(g2);
console.log(g2[1]); // [1, 2]

const g3 = [[-1]];
wallsAndGates(g3);
console.log(g3[0]); // [-1]

const g4 = [[INF]];
wallsAndGates(g4);
console.log(g4[0]); // [INF] - no gate
```

---

## 🔗 Related Problems

- [Rotting Oranges](https://leetcode.com/problems/rotting-oranges) — cùng dạng multi-source BFS, nhiều nguồn lan đồng thời
- [01 Matrix](https://leetcode.com/problems/01-matrix) — tính khoảng cách tới 0 gần nhất, bản chất giống hệt
- [Nearest Exit from Entrance in Maze](https://leetcode.com/problems/nearest-exit-from-entrance-in-maze) — BFS tìm exit gần nhất
- [Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow) — multi-source DFS/BFS từ border
