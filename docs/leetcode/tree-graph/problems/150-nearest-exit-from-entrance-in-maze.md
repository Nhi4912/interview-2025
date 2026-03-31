---
layout: page
title: "Nearest Exit from Entrance in Maze"
difficulty: Medium
category: Tree-Graph
tags: [Array, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/nearest-exit-from-entrance-in-maze"
---

# Nearest Exit from Entrance in Maze / Lối Thoát Gần Nhất Trong Mê Cung

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS Shortest Path
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Rotting Oranges](https://leetcode.com/problems/rotting-oranges) | [Snakes and Ladders](https://leetcode.com/problems/snakes-and-ladders)

---

## 🧠 Intuition / Tư Duy

**Analogy (VI):** Như tìm đường thoát khỏi mê cung — BFS từ điểm vào, tìm ô đầu tiên nằm trên biên (không phải điểm vào). BFS đảm bảo đường đi ngắn nhất.

**Analogy (EN):** BFS from entrance, spreading outward level by level. First border cell we reach (that isn't the entrance) is the answer — BFS guarantees minimum steps.

```
Maze ('.' = open, '+' = wall):
  +  +  .  +
  .  .  .  +      entrance = [0,2]
  +  +  +  .

BFS steps:
  step 0: (0,2)
  step 1: (1,2)
  step 2: (1,1),(1,0)  ← (1,0) is border! return 2
```

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Entrance là exit không?" / Entrance itself does NOT count as exit even if on border
2. **Border check / Kiểm tra biên**: Cell (r,c) là exit nếu r=0 hoặc r=m-1 hoặc c=0 hoặc c=n-1 / Border = row 0, last row, col 0, or last col
3. **Mark visited / Đánh dấu**: Đánh dấu cell đã thăm ngay khi enqueue để tránh revisit / Mark visited when enqueuing, not dequeuing
4. **BFS level / Đếm bước**: Track steps with level counter hoặc store (row, col, steps) trong queue
5. **Edge case / Biên**: Không có exit → return -1; maze 1x1 → return -1
6. **Follow-up**: "Nếu có nhiều entrance?" → Multi-source BFS, enqueue all entrances initially

---

## Solutions

```typescript
/**
 * Solution 1: BFS with Step Counter
 * Time: O(M × N) — visit each cell at most once
 * Space: O(M × N) — queue + visited set
 *
 * BFS từ entrance, đếm số bước. Cell trên biên (không phải entrance) → trả về steps.
 */
function nearestExit(maze: string[][], entrance: number[]): number {
  const m = maze.length,
    n = maze[0].length;
  const [er, ec] = entrance;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Mark entrance as visited (walls '+' naturally blocked)
  const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
  visited[er][ec] = true;

  const queue: [number, number, number][] = [[er, ec, 0]]; // [row, col, steps]

  while (queue.length > 0) {
    const [r, c, steps] = queue.shift()!;
    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (visited[nr][nc] || maze[nr][nc] === "+") continue;
      // Border cell that is not the entrance = exit
      if (nr === 0 || nr === m - 1 || nc === 0 || nc === n - 1) return steps + 1;
      visited[nr][nc] = true;
      queue.push([nr, nc, steps + 1]);
    }
  }
  return -1;
}

/**
 * Solution 2: BFS with Level Processing
 * Time: O(M × N) — visit each cell at most once
 * Space: O(M × N) — queue
 *
 * Process queue level by level — cleaner step counting.
 * Modify maze in-place as visited marker to save space.
 */
function nearestExitV2(maze: string[][], entrance: number[]): number {
  const m = maze.length,
    n = maze[0].length;
  const [er, ec] = entrance;
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  const queue: [number, number][] = [[er, ec]];
  maze[er][ec] = "+"; // mark entrance as visited
  let steps = 0;

  while (queue.length > 0) {
    steps++;
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n || maze[nr][nc] === "+") continue;
        if (nr === 0 || nr === m - 1 || nc === 0 || nc === n - 1) return steps;
        maze[nr][nc] = "+"; // mark visited
        queue.push([nr, nc]);
      }
    }
  }
  return -1;
}

// === Test Cases ===
console.log(
  nearestExit(
    [
      ["+", "+", ".", "+"],
      [".", ".", ".", "+"],
      ["+", "+", "+", "."],
    ],
    [0, 2],
  ),
); // 1
console.log(
  nearestExit(
    [
      ["+", "+", "+"],
      [".", ".", "."],
      ["+", "+", "+"],
    ],
    [1, 0],
  ),
); // 2
console.log(nearestExit([[".", "+"]], [0, 0])); // -1 (no other exit)
console.log(
  nearestExitV2(
    [
      ["+", "+", ".", "+"],
      [".", ".", ".", "+"],
      ["+", "+", "+", "."],
    ],
    [0, 2],
  ),
); // 1
```

---

## 🔗 Related Problems

| Problem                                                                | Pattern           | Difficulty |
| ---------------------------------------------------------------------- | ----------------- | ---------- |
| [Rotting Oranges](https://leetcode.com/problems/rotting-oranges)       | Multi-source BFS  | 🟡 Medium  |
| [Snakes and Ladders](https://leetcode.com/problems/snakes-and-ladders) | BFS Shortest Path | 🟡 Medium  |
| [01 Matrix](https://leetcode.com/problems/01-matrix)                   | Multi-source BFS  | 🟡 Medium  |
| [Max Area of Island](https://leetcode.com/problems/max-area-of-island) | BFS/DFS Grid      | 🟡 Medium  |
