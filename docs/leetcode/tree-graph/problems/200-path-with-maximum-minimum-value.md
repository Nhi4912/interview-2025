---
layout: page
title: "Path With Maximum Minimum Value"
difficulty: Medium
category: Tree-Graph
tags: [Array, Binary Search, Depth-First Search, Breadth-First Search, Union Find]
leetcode_url: "https://leetcode.com/problems/path-with-maximum-minimum-value"
---

# path with maximum minimum value

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Vietnamese analogy:** Bạn cần đi từ góc trên-trái sang góc dưới-phải. Trên đường đi, "điểm yếu" là ô nhỏ nhất. Tìm con đường mà "điểm yếu" lớn nhất có thể — nghĩa là đường đi tốt nhất trong điều kiện xấu nhất.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
Grid:           Best path (greedy max-heap):
5 4 5           5 → 4 → 5
1 2 6     →     Pick largest neighbor greedily
7 4 6           Bottleneck = min(5,4,5,6,6) = 4
```

---

---

## Problem Description

Given an `m x n` integer matrix `grid`, find a path from `(0,0)` to `(m-1, n-1)` that maximizes the **minimum value** along the path. Return that maximum score.

**Example:**

- Input: `grid = [[5,4,5],[1,2,6],[7,4,6]]`
- Output: `4`

**Constraints:**

- `1 <= m, n <= 100`
- `0 <= grid[i][j] <= 10^9`

---

---

## 📝 Interview Tips

- 🔑 **Greedy max-heap (Dijkstra-variant):** always expand the cell with the highest value first
- 🔑 Track `minSoFar` for each path — update as you traverse
- 🔑 **Binary search + BFS:** binary search on answer, check feasibility with BFS
- ⚠️ Unlike standard Dijkstra, the "cost" here is the minimum on path, not sum
- ⚠️ Once `(m-1,n-1)` is popped from max-heap, that's the answer (greedy ensures optimal)
- 💡 Union-Find approach: sort all cells descending, union cells until top-left connects to bottom-right

---

---

## Solutions

```typescript
function maximumMinimumPath(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));

  // Max-heap: [score, row, col]
  // Using array-based heap simulation
  const heap: [number, number, number][] = [[grid[0][0], 0, 0]];
  visited[0][0] = true;

  function heapPush(item: [number, number, number]) {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent][0] >= heap[i][0]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  }

  function heapPop(): [number, number, number] {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let largest = i;
        const l = 2 * i + 1,
          r = 2 * i + 2;
        if (l < heap.length && heap[l][0] > heap[largest][0]) largest = l;
        if (r < heap.length && heap[r][0] > heap[largest][0]) largest = r;
        if (largest === i) break;
        [heap[i], heap[largest]] = [heap[largest], heap[i]];
        i = largest;
      }
    }
    return top;
  }

  let score = grid[0][0];

  while (heap.length > 0) {
    const [val, r, c] = heapPop();
    score = Math.min(score, val);
    if (r === m - 1 && c === n - 1) return score;

    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited[nr][nc]) continue;
      visited[nr][nc] = true;
      heapPush([grid[nr][nc], nr, nc]);
    }
  }

  return score;
}

function maximumMinimumPathBS(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function canReach(minVal: number): boolean {
    if (grid[0][0] < minVal || grid[m - 1][n - 1] < minVal) return false;
    const visited = Array.from({ length: m }, () => new Array(n).fill(false));
    const queue: [number, number][] = [[0, 0]];
    visited[0][0] = true;
    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      if (r === m - 1 && c === n - 1) return true;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
        if (visited[nr][nc] || grid[nr][nc] < minVal) continue;
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
    return false;
  }

  let lo = 0,
    hi = Math.min(grid[0][0], grid[m - 1][n - 1]);
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (canReach(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
```

---

## 🔗 Related Problems

| #    | Problem                                      | Difficulty | Tags          |
| ---- | -------------------------------------------- | ---------- | ------------- |
| 778  | Swim in Rising Water                         | 🔴 Hard    | BFS, Heap     |
| 1631 | Path With Minimum Effort                     | 🟡 Medium  | Dijkstra, BFS |
| 743  | Network Delay Time                           | 🟡 Medium  | Dijkstra      |
| 1368 | Minimum Cost to Make at Least One Valid Path | 🔴 Hard    | BFS, Dijkstra |
