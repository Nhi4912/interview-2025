---
layout: page
title: "Number of Spaces Cleaning Robot Cleaned"
difficulty: Medium
category: Array
tags: [Array, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/number-of-spaces-cleaning-robot-cleaned"
---

# Number of Spaces Cleaning Robot Cleaned / Số Ô Robot Lau Đã Lau

> **Difficulty**: 🟡 Medium | **Category**: Array | **Pattern**: Matrix Simulation

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Giống như con robot hút bụi Roomba di chuyển thẳng qua phòng — khi gặp tường hoặc ô đã quét, nó rẽ phải 90°, cứ thế cho đến khi không còn đường nào mới.

**Pattern Recognition:**

- State = (row, col, direction) — robot loops when revisiting same state
- Directions cycle: right → down → left → up → right (0→1→2→3→0)
- Track visited cells AND visited states to detect termination

**Visual:**

```
room = [[1,1,0],[1,1,1],[0,1,1]]  (0=wall, 1=space)
Start (0,0) dir=RIGHT →

(0,0)→(0,1)→WALL  turn DOWN
(0,1)→(1,1)→(2,1)→WALL  turn LEFT
(2,1)→(2,0)→WALL  turn UP
...
Cleaned = {(0,0),(0,1),(1,1),(2,1)} = 4 spaces
```

## Problem Description

A cleaning robot starts at `(0,0)` in a room grid moving right. A cell with `room[r][c] = 1` is a space; `0` is a wall. When it hits a wall or already-cleaned cell, it turns 90° clockwise. It stops when it returns to a state `(row, col, direction)` it has already visited.

**Example 1:** `room = [[1,1,0],[1,1,1],[0,1,1]]` → `Output: 7`
**Example 2:** `room = [[1,1,1,1],[1,0,0,1],[1,1,1,1]]` → `Output: 10`

**Constraints:** `m, n ≤ 300`, cells are `0` or `1`, `room[0][0] == 1`

## 📝 Interview Tips

1. **Clarify**: Does the robot stop or keep going after a full cycle? (Stops when state repeats)
2. **Approach**: Simulate with a visited-state set of (row, col, dir)
3. **Edge cases**: Single-cell room, room that's all walls except start
4. **Optimize**: Early termination when state revisited — O(m×n×4) states max
5. **Follow-up**: What if robot can start anywhere?
6. **Complexity**: Time O(m×n), Space O(m×n)

## Solutions

```typescript
// Solution 1: Simulation with State Tracking — Time: O(m*n) | Space: O(m*n)
function numberOfCleanRooms(room: number[][]): number {
  const m = room.length;
  const n = room[0].length;
  // directions: right, down, left, up
  const dr = [0, 1, 0, -1];
  const dc = [1, 0, -1, 0];

  const cleaned = new Set<string>();
  const visited = new Set<string>();

  let r = 0,
    c = 0,
    dir = 0;

  while (true) {
    const state = `${r},${c},${dir}`;
    if (visited.has(state)) break;
    visited.add(state);
    cleaned.add(`${r},${c}`);

    const nr = r + dr[dir];
    const nc = c + dc[dir];

    if (nr < 0 || nr >= m || nc < 0 || nc >= n || room[nr][nc] === 0) {
      // Turn right 90°
      dir = (dir + 1) % 4;
    } else {
      r = nr;
      c = nc;
    }
  }

  return cleaned.size;
}

// Solution 2: Bit-packed state for memory efficiency — Time: O(m*n) | Space: O(m*n)
function numberOfCleanRooms2(room: number[][]): number {
  const m = room.length;
  const n = room[0].length;
  const dr = [0, 1, 0, -1];
  const dc = [1, 0, -1, 0];

  // Pack state as integer: row*n*4 + col*4 + dir
  const visited = new Set<number>();
  const cleanedCells = new Set<number>();

  let r = 0,
    c = 0,
    dir = 0;

  while (true) {
    const state = r * n * 4 + c * 4 + dir;
    if (visited.has(state)) break;
    visited.add(state);
    cleanedCells.add(r * n + c);

    const nr = r + dr[dir];
    const nc = c + dc[dir];

    if (nr < 0 || nr >= m || nc < 0 || nc >= n || room[nr][nc] === 0) {
      dir = (dir + 1) % 4;
    } else {
      r = nr;
      c = nc;
    }
  }

  return cleanedCells.size;
}

// Tests
console.log(
  numberOfCleanRooms([
    [1, 1, 0],
    [1, 1, 1],
    [0, 1, 1],
  ]),
); // 7
console.log(
  numberOfCleanRooms([
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ]),
); // 10
console.log(numberOfCleanRooms([[1]])); // 1
console.log(
  numberOfCleanRooms2([
    [1, 1, 0],
    [1, 1, 1],
    [0, 1, 1],
  ]),
); // 7
console.log(
  numberOfCleanRooms2([
    [1, 0],
    [1, 1],
  ]),
); // 3
```

## 🔗 Related Problems

| Problem                                                                                 | Relationship                     |
| --------------------------------------------------------------------------------------- | -------------------------------- |
| [Robot Room Cleaner (LeetCode 489)](https://leetcode.com/problems/robot-room-cleaner/)  | Same robot concept, unknown room |
| [Spiral Matrix (LeetCode 54)](https://leetcode.com/problems/spiral-matrix/)             | Directional turning pattern      |
| [Number of Enclaves (LeetCode 1020)](https://leetcode.com/problems/number-of-enclaves/) | Matrix reachability counting     |
