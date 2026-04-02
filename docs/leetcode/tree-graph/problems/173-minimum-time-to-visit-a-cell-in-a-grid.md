---
layout: page
title: "Minimum Time to Visit a Cell In a Grid"
difficulty: Hard
category: Tree-Graph
tags: [Array, Breadth-First Search, Graph, Heap (Priority Queue), Matrix]
leetcode_url: "https://leetcode.com/problems/minimum-time-to-visit-a-cell-in-a-grid"
---

# Minimum Time to Visit a Cell In a Grid / Thời Gian Tối Thiểu Thăm Ô Lưới

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Bài toán như người giao hàng phải chờ cửa mở mới vào được. Nếu đến ô (r,c) quá sớm (time < grid[r][c]), ta phải đi qua lại giữa ô hiện tại và ô hàng xóm để "chờ thời gian". Kỹ thuật: nếu cần chờ, cộng thêm 1 hoặc 2 bước tuỳ theo tính chẵn lẻ.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Time to Visit a Cell In a Grid example:**

```
grid[r][c]=5, arrive at t=3 → too early, must wait
Bounce: 3→4→5 (2 extra steps), parity same → enter at t=5
grid[r][c]=5, arrive at t=4 → too early
Bounce: 4→5→6 (2 extra steps), enter at t=6 (same parity trick)

Key formula: if (grid[r][c] - t) % 2 == 1 → t = grid[r][c]
                                          else → t = grid[r][c] + 1
```

---

---

## Problem Description

| Problem                                                                                                                  | Difficulty | Key Idea                              |
| ------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------- |
| [Swim in Rising Water 778](https://leetcode.com/problems/swim-in-rising-water)                                           | Hard       | Dijkstra on grid with time constraint |
| [Min Cost to Make Path Valid 1368](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid) | Hard       | 0-1 BFS on grid                       |
| [Path With Min Effort 1631](https://leetcode.com/problems/path-with-minimum-effort)                                      | Medium     | Dijkstra on grid                      |
| [Network Delay Time 743](https://leetcode.com/problems/network-delay-time)                                               | Medium     | Classic Dijkstra                      |

---

## 📝 Interview Tips

- 🔑 **EN:** Early exit: if grid[0][1] > 1 AND grid[1][0] > 1 → impossible (return -1) | **VI:** Nếu cả hai ô kề (0,0) đều không đến được lúc t=1 → trả -1
- 🔑 **EN:** Use Dijkstra with dist[r][c] = minimum time to reach (r,c) | **VI:** Dijkstra với dist[r][c] = thời gian tối thiểu
- 🔑 **EN:** Parity trick: if (grid[r][c] - t) is odd → need one extra bounce → arrive at grid[r][c]+1 | **VI:** Lẻ thì cần thêm 1 bước dội
- 🔑 **EN:** Can always bounce between two adjacent cells to kill time | **VI:** Luôn có thể dội qua lại để chờ
- 🔑 **EN:** Normal move cost = 1; waiting adds extra steps based on parity | **VI:** Di chuyển thường = +1 bước
- 🔑 **EN:** Min-heap stores [time, row, col] | **VI:** Min-heap với [thời gian, hàng, cột]

---

---

## Solutions

```typescript
/**
 * Modified Dijkstra with Parity-Wait
 * Time: O(m*n * log(m*n)) — Dijkstra on grid
 * Space: O(m*n) for dist array + heap
 */
function minimumTime(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;

  // Early exit: can't escape (0,0) at t=1
  if (grid[0][1] > 1 && grid[1][0] > 1) return -1;

  const dist: number[][] = Array.from({ length: m }, () => Array(n).fill(Infinity));
  dist[0][0] = 0;

  // Min-heap: [time, row, col]
  const heap: [number, number, number][] = [[0, 0, 0]];
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  const pop = (): [number, number, number] => {
    // Simple heap using sorted array (for clarity; in prod use real min-heap)
    heap.sort((a, b) => a[0] - b[0]);
    return heap.shift()!;
  };

  while (heap.length > 0) {
    const [t, r, c] = pop();

    if (r === m - 1 && c === n - 1) return t;
    if (t > dist[r][c]) continue;

    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;

      let newTime = t + 1;
      if (newTime < grid[nr][nc]) {
        // Need to wait — bounce to kill time, adjust for parity
        const diff = grid[nr][nc] - newTime;
        newTime = grid[nr][nc] + (diff % 2 === 0 ? 1 : 0);
      }

      if (newTime < dist[nr][nc]) {
        dist[nr][nc] = newTime;
        heap.push([newTime, nr, nc]);
      }
    }
  }

  return dist[m - 1][n - 1] === Infinity ? -1 : dist[m - 1][n - 1];
}

// Test cases
console.log(
  minimumTime([
    [0, 1, 3, 2],
    [5, 1, 2, 5],
    [4, 3, 8, 6],
  ]),
); // 7
console.log(
  minimumTime([
    [0, 2, 4],
    [3, 2, 1],
    [1, 0, 4],
  ]),
); // -1

/**
 * Dijkstra with proper binary heap (array-based)
 * Time: O(m*n * log(m*n))  Space: O(m*n)
 */
function minimumTimeV2(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  if (grid[0][1] > 1 && grid[1][0] > 1) return -1;

  const dist = Array.from({ length: m }, () => new Array(n).fill(Infinity));
  dist[0][0] = 0;

  // Priority queue as sorted array for simplicity
  const pq: Array<[number, number, number]> = [[0, 0, 0]];
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [t, r, c] = pq.shift()!;
    if (t > dist[r][c]) continue;
    if (r === m - 1 && c === n - 1) return t;

    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;

      // Compute earliest arrival time considering wait
      let arrive = t + 1;
      if (arrive < grid[nr][nc]) {
        // Must wait: parity determines extra bounce needed
        const gap = grid[nr][nc] - arrive;
        arrive = grid[nr][nc] + (gap % 2 === 0 ? 1 : 0);
      }

      if (arrive < dist[nr][nc]) {
        dist[nr][nc] = arrive;
        pq.push([arrive, nr, nc]);
      }
    }
  }
  return -1;
}

console.log(
  minimumTimeV2([
    [0, 1, 3, 2],
    [5, 1, 2, 5],
    [4, 3, 8, 6],
  ]),
); // 7
console.log(
  minimumTimeV2([
    [0, 2, 4],
    [3, 2, 1],
    [1, 0, 4],
  ]),
); // -1
```

---

## 🔗 Related Problems

| Problem                                                                                                                  | Difficulty | Key Idea                              |
| ------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------- |
| [Swim in Rising Water 778](https://leetcode.com/problems/swim-in-rising-water)                                           | Hard       | Dijkstra on grid with time constraint |
| [Min Cost to Make Path Valid 1368](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid) | Hard       | 0-1 BFS on grid                       |
| [Path With Min Effort 1631](https://leetcode.com/problems/path-with-minimum-effort)                                      | Medium     | Dijkstra on grid                      |
| [Network Delay Time 743](https://leetcode.com/problems/network-delay-time)                                               | Medium     | Classic Dijkstra                      |
