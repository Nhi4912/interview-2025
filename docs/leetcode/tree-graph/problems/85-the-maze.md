---
layout: page
title: "The Maze"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/the-maze"
---

# The Maze / Mê Cung

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS / DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [The Maze II](https://leetcode.com/problems/the-maze-ii) | [The Maze III](https://leetcode.com/problems/the-maze-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như bi-a trên bàn có tường — quả bóng lăn theo một hướng cho đến khi chạm tường, rồi mới dừng. Mỗi vị trí dừng là một "node", và từ đó bóng có thể tiếp tục theo 4 hướng. Hỏi: có thể dừng tại đích không?

**Pattern Recognition:**

- Signal: "ball rolls until hitting wall" + "can reach destination?" → **BFS/DFS**
- Từ mỗi vị trí, bóng lăn tối đa đến 4 vị trí "dừng" tiếp theo
- Key insight: visited chỉ lưu vị trí dừng, không phải mọi ô trên đường lăn

**Visual — Ball rolling in maze:**

```
maze (0=empty, 1=wall):
 0 0 1 0 0
 0 0 0 0 0     Start=(0,4), Dest=(4,4)
 0 0 0 1 0
 1 1 0 0 1
 0 0 0 0 0

From (0,4): roll LEFT → stop at (0,2) [hits wall at (0,1)]
            roll DOWN → stop at (4,4) ← destination! ✅
```

---

## Problem Description

A ball is dropped at position `start` in a maze with walls. The ball rolls until it hits a wall, then stops. Given `maze`, `start`, and `destination`, determine if the ball can stop at `destination`. ([LeetCode #490](https://leetcode.com/problems/the-maze))

**Example 1:** `maze=[[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,0,1],[0,0,0,0,0]]`, `start=[0,4]`, `dest=[4,4]` → `true`
**Example 2:** Same maze, `start=[0,4]`, `dest=[3,2]` → `false`

---

## 📝 Interview Tips

1. **Clarify**: "Bóng phải dừng tại destination (không thể đi qua)? Maze có tường bao quanh không?" / Must stop at dest, not pass through
2. **Rolling logic**: "Lăn tiếp cho đến khi gặp tường hoặc ra ngoài bounds" / Roll until out-of-bounds or wall
3. **BFS vs DFS**: "Cả hai đều OK — BFS dùng queue, DFS dùng visited set để tránh cycle" / Both work; use visited to avoid cycles
4. **Visited set**: "Visited chỉ track vị trí dừng để tránh thăm lại" / Track stopping positions only
5. **Edge cases**: "Start == destination: ball phải dừng tại đó (không cần di chuyển)" / Start equals dest
6. **Follow-up**: "The Maze II: tìm đường ngắn nhất → Dijkstra vì edge weight là số bước lăn" / Maze II needs Dijkstra

---

## Solutions

```typescript
/**
 * Solution 1: BFS
 * Time: O(M * N * max(M, N)) — rolling across entire row/col each time
 * Space: O(M * N) — visited array
 */
function hasPathBFS(maze: number[][], start: number[], destination: number[]): boolean {
  const rows = maze.length,
    cols = maze[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const queue: [number, number][] = [[start[0], start[1]]];
  visited[start[0]][start[1]] = true;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === destination[0] && c === destination[1]) return true;

    for (const [dr, dc] of dirs) {
      let nr = r,
        nc = c;
      // Roll until hitting a wall
      while (
        nr + dr >= 0 &&
        nr + dr < rows &&
        nc + dc >= 0 &&
        nc + dc < cols &&
        maze[nr + dr][nc + dc] === 0
      ) {
        nr += dr;
        nc += dc;
      }
      if (!visited[nr][nc]) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  return false;
}

/**
 * Solution 2: DFS
 * Time: O(M * N * max(M, N))
 * Space: O(M * N) — visited + recursion stack
 */
function hasPath(maze: number[][], start: number[], destination: number[]): boolean {
  const rows = maze.length,
    cols = maze[0].length;
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function dfs(r: number, c: number): boolean {
    if (r === destination[0] && c === destination[1]) return true;
    if (visited[r][c]) return false;
    visited[r][c] = true;

    for (const [dr, dc] of dirs) {
      let nr = r,
        nc = c;
      while (
        nr + dr >= 0 &&
        nr + dr < rows &&
        nc + dc >= 0 &&
        nc + dc < cols &&
        maze[nr + dr][nc + dc] === 0
      ) {
        nr += dr;
        nc += dc;
      }
      if (dfs(nr, nc)) return true;
    }
    return false;
  }

  return dfs(start[0], start[1]);
}

// === Test Cases ===
const maze1 = [
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0],
  [1, 1, 0, 0, 1],
  [0, 0, 0, 0, 0],
];
console.log(hasPath(maze1, [0, 4], [4, 4])); // true
console.log(hasPath(maze1, [0, 4], [3, 2])); // false
console.log(hasPathBFS(maze1, [0, 4], [4, 4])); // true
console.log(hasPathBFS(maze1, [0, 4], [3, 2])); // false
```

---

## 🔗 Related Problems

| Problem                                                                                        | Difficulty | Pattern              |
| ---------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| [The Maze II](https://leetcode.com/problems/the-maze-ii)                                       | 🟡 Medium  | Dijkstra (min steps) |
| [The Maze III](https://leetcode.com/problems/the-maze-iii)                                     | 🔴 Hard    | Dijkstra + lex path  |
| [Flood Fill](https://leetcode.com/problems/flood-fill)                                         | 🟢 Easy    | DFS/BFS grid         |
| [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix) | 🟡 Medium  | BFS grid             |
