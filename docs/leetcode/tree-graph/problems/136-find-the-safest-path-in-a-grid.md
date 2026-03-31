---
layout: page
title: "Find the Safest Path in a Grid"
difficulty: Medium
category: Tree-Graph
tags: [Array, Binary Search, Breadth-First Search, Union Find, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/find-the-safest-path-in-a-grid"
---

# Find the Safest Path in a Grid / Tìm Đường An Toàn Nhất Trong Lưới

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Multi-source BFS + Binary Search

## 🧠 Intuition

**VI**: Hãy tưởng tượng các tên trộm phát ra "sóng nguy hiểm" lan ra xung quanh — như ném đá xuống ao. Khoảng cách từ mỗi ô đến tên trộm gần nhất chính là "độ an toàn". BFS đa nguồn tính bản đồ này trong O(n²). Sau đó, binary search trên ngưỡng an toàn tối thiểu để tìm giá trị lớn nhất cho phép đi từ (0,0) đến (n-1,n-1).

**EN**: Multi-source BFS from all thieves simultaneously computes `dist[r][c]` = distance to nearest thief. Binary search on threshold k; check reachability via BFS using only cells with `dist ≥ k`.

```
Thieves → dist grid (safeness):   Binary search answer:
1 0 0      0 1 2                  threshold=2? path exists!
0 0 0  →   1 1 1   →  (0,0)→(2,2) via right-right-down
0 0 1      2 1 0                  min dist along path = 1
```

## 📝 Interview Tips

- 🇻🇳 BFS đa nguồn: đẩy TẤT CẢ thief vào queue cùng lúc ở distance=0, không lặp riêng từng cái.
- 🇬🇧 Multi-source BFS: initialize queue with ALL thieves at distance 0 simultaneously.
- 🇻🇳 Binary search trên câu trả lời: nếu threshold k đi được thì mọi k' < k cũng được → tìm max k.
- 🇬🇧 Binary search on answer: monotone property — if k is feasible, k-1 is too; find the maximum feasible k.
- 🇻🇳 Kiểm tra tính khả thi bằng BFS/DFS chỉ qua ô có dist ≥ threshold, O(n²) mỗi lần.
- 🇬🇧 Feasibility check is BFS/DFS restricted to dist ≥ threshold cells, O(n²) per check.

## Solutions

```typescript
// ─── TreeNode helper (used across problems) ───
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

// ─── Solution 1: Multi-source BFS distance map + Binary Search + BFS feasibility ───
// Time: O(n² log n)  Space: O(n²)
function maximumSafenessFactor(grid: number[][]): number {
  const n = grid.length;
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1));
  const queue: number[] = []; // flat [r*n+c, ...]

  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (grid[r][c] === 1) {
        dist[r][c] = 0;
        queue.push(r * n + c);
      }

  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  let head = 0;
  while (head < queue.length) {
    const pos = queue[head++];
    const r = (pos / n) | 0,
      c = pos % n;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push(nr * n + nc);
      }
    }
  }

  const canReach = (threshold: number): boolean => {
    if (dist[0][0] < threshold || dist[n - 1][n - 1] < threshold) return false;
    const visited = Array.from({ length: n }, () => new Uint8Array(n));
    const bq: number[] = [0];
    visited[0][0] = 1;
    let bh = 0;
    while (bh < bq.length) {
      const pos = bq[bh++];
      const r = (pos / n) | 0,
        c = pos % n;
      if (r === n - 1 && c === n - 1) return true;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < n &&
          nc >= 0 &&
          nc < n &&
          !visited[nr][nc] &&
          dist[nr][nc] >= threshold
        ) {
          visited[nr][nc] = 1;
          bq.push(nr * n + nc);
        }
      }
    }
    return false;
  };

  let lo = 0,
    hi = n * 2,
    ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (canReach(mid)) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}

// ─── Solution 2: Same BFS dist map + Dijkstra max-min path ───
// Time: O(n² log n)  Space: O(n²)
// Maximize the minimum dist along the path — classic Dijkstra variant
function maximumSafenessFactor2(grid: number[][]): number {
  const n = grid.length;
  const dist: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1));
  const q: number[] = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (grid[r][c] === 1) {
        dist[r][c] = 0;
        q.push(r * n + c);
      }
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  let head = 0;
  while (head < q.length) {
    const pos = q[head++];
    const r = (pos / n) | 0,
      c = pos % n;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        q.push(nr * n + nc);
      }
    }
  }
  // safe[r][c] = best (max-min) safeness to reach (r,c)
  const safe: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1));
  safe[0][0] = dist[0][0];
  // Simple max-heap via sorted list (interview-friendly)
  const pq: [number, number, number][] = [[dist[0][0], 0, 0]];
  while (pq.length) {
    pq.sort((a, b) => b[0] - a[0]);
    const [s, r, c] = pq.shift()!;
    if (r === n - 1 && c === n - 1) return s;
    if (s < safe[r][c]) continue;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
        const ns = Math.min(s, dist[nr][nc]);
        if (ns > safe[nr][nc]) {
          safe[nr][nc] = ns;
          pq.push([ns, nr, nc]);
        }
      }
    }
  }
  return 0;
}

// Tests
console.log(
  maximumSafenessFactor([
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 1],
  ]),
); // 0
console.log(
  maximumSafenessFactor([
    [0, 0, 1],
    [0, 0, 0],
    [0, 0, 0],
  ]),
); // 2
console.log(
  maximumSafenessFactor([
    [0, 0, 0, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 0, 0, 0],
  ]),
); // 2
```

## 🔗 Related Problems

| #    | Title                          | Difficulty | Pattern             |
| ---- | ------------------------------ | ---------- | ------------------- |
| 1091 | Shortest Path in Binary Matrix | 🟡 Medium  | BFS                 |
| 778  | Swim in Rising Water           | 🔴 Hard    | Binary Search + BFS |
| 1631 | Path With Minimum Effort       | 🟡 Medium  | Dijkstra            |
| 2812 | Find the Safest Path in a Grid | 🟡 Medium  | Multi-source BFS    |
