---
layout: page
title: "Robot Room Cleaner"
difficulty: Hard
category: Backtracking
tags: [Backtracking, Interactive]
leetcode_url: "https://leetcode.com/problems/robot-room-cleaner"
---

# Robot Room Cleaner / Robot Dọn Phòng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking + DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Walking Robot Simulation](https://leetcode.com/problems/walking-robot-simulation) | [Walls and Gates](https://leetcode.com/problems/walls-and-gates)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Robot không biết bản đồ — giống người mù đi trong mê cung. Dùng tọa độ tương đối `(r, c)` so với vị trí khởi đầu và hướng mặt. Sau mỗi nhánh DFS, quay lại vị trí cũ (backtrack bằng cách quay 180°, tiến 1 bước, quay 180°).

**Pattern Recognition:**

- Không biết bản đồ → **virtual coordinates** + `visited` set
- 4 hướng với trạng thái quay robot → track `direction` + rotate relative

```
Directions: 0=Up(-1,0), 1=Right(0,1), 2=Down(1,0), 3=Left(0,-1)
Rotate clockwise: dir = (dir + 1) % 4
Go back: rotate 180°(twice), move(1), rotate 180°(twice)

DFS(r=0,c=0,dir=0):
  clean(0,0)
  try all 4 dirs → if not visited & robot.move() → DFS(nr,nc,newDir)
  backtrack: turnRight,turnRight,move,turnRight,turnRight
```

---

## Problem Description

A robot is in a grid with walls and open cells. It has API: `move()` (tries forward, returns bool), `turnLeft()`/`turnRight()` (90°), `clean()`. The robot starts in an open cell. Clean **all** reachable cells. You cannot read the grid directly.

**Constraints:**

- `1 ≤ room.length ≤ 100`, `1 ≤ room[0].length ≤ 200`
- No info about grid shape — must use robot's limited API

---

## 📝 Interview Tips

- 🇻🇳 **Tọa độ ảo**: dùng `(row, col)` relative, không cần tọa độ thật — chỉ cần tránh ô đã thăm
- 🇬🇧 Use virtual coordinates from start — encode as `"r,c"` in visited Set, no real map needed
- 🇻🇳 **Quay về (backtrack)**: quay 180° → tiến 1 bước → quay 180° về hướng ban đầu
- 🇬🇧 Return to parent: `turnRight × 2 → move → turnRight × 2` restores position and facing
- 🇻🇳 Sau DFS một hướng, **xoay phải 1 lần** để thử hướng kế tiếp (4 hướng tổng cộng)
- 🇬🇧 Try all 4 directions by rotating CW after each attempt — exactly 4 turns returns to start facing

---

## Solutions

### Solution 1: Backtracking DFS with Virtual Coordinates

```typescript
interface Robot {
  move(): boolean;
  turnLeft(): void;
  turnRight(): void;
  clean(): void;
}

/**
 * Clean all reachable cells using DFS + virtual coordinates
 * Time: O(N - M) — N = open cells, M = obstacles (visit each open cell once)
 * Space: O(N - M) — visited set + recursion depth
 */
function cleanRoom(robot: Robot): void {
  // Direction vectors: Up, Right, Down, Left (clockwise order)
  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  const visited = new Set<string>();

  function goBack(): void {
    // Reverse: face backward, step, face forward again
    robot.turnRight();
    robot.turnRight();
    robot.move();
    robot.turnRight();
    robot.turnRight();
  }

  function dfs(row: number, col: number, facing: number): void {
    robot.clean();
    visited.add(`${row},${col}`);

    for (let i = 0; i < 4; i++) {
      const nextFacing = (facing + i) % 4;
      const [dr, dc] = dirs[nextFacing];
      const nr = row + dr;
      const nc = col + dc;

      if (!visited.has(`${nr},${nc}`) && robot.move()) {
        dfs(nr, nc, nextFacing);
        goBack();
      }
      robot.turnRight(); // rotate to next direction
    }
  }

  dfs(0, 0, 0);
}

// Simulation test (since Robot is an interface, we simulate):
class MockRobot implements Robot {
  private grid: number[][];
  private r: number;
  private c: number;
  private dir: number;
  private cleaned: Set<string> = new Set();
  constructor(grid: number[][], startR: number, startC: number) {
    this.grid = grid;
    this.r = startR;
    this.c = startC;
    this.dir = 0;
  }
  private ds = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  move(): boolean {
    const [dr, dc] = this.ds[this.dir];
    const nr = this.r + dr,
      nc = this.c + dc;
    if (
      nr < 0 ||
      nr >= this.grid.length ||
      nc < 0 ||
      nc >= this.grid[0].length ||
      !this.grid[nr][nc]
    )
      return false;
    this.r = nr;
    this.c = nc;
    return true;
  }
  turnLeft(): void {
    this.dir = (this.dir + 3) % 4;
  }
  turnRight(): void {
    this.dir = (this.dir + 1) % 4;
  }
  clean(): void {
    this.cleaned.add(`${this.r},${this.c}`);
  }
  getCleaned(): Set<string> {
    return this.cleaned;
  }
}

const grid = [
  [1, 1, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 0, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
];
const robot = new MockRobot(grid, 1, 3);
cleanRoom(robot);
console.log("Cleaned cells:", robot.getCleaned().size); // all reachable
```

---

## 🔗 Related Problems

- [489. Robot Room Cleaner](https://leetcode.com/problems/robot-room-cleaner) ← this
- [79. Word Search](https://leetcode.com/problems/word-search) — DFS on grid
- [200. Number of Islands](https://leetcode.com/problems/number-of-islands) — flood fill DFS
- [694. Number of Distinct Islands](https://leetcode.com/problems/number-of-distinct-islands) — shape tracking
- [874. Walking Robot Simulation](https://leetcode.com/problems/walking-robot-simulation) — directional movement
