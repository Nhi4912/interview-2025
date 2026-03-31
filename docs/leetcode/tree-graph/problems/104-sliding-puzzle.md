---
layout: page
title: "Sliding Puzzle"
difficulty: Hard
category: Tree-Graph
tags: [Array, Dynamic Programming, Backtracking, Breadth-First Search, Memoization]
leetcode_url: "https://leetcode.com/problems/sliding-puzzle"
---

# Sliding Puzzle / Câu Đố Trượt Ô

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS (State Space Search)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Như giải câu đố Rubik — mỗi trạng thái bảng là một "node", mỗi lần trượt ô trống là một "edge". Bạn cần tìm đường ngắn nhất (ít bước nhất) từ trạng thái ban đầu đến `"123450"`. BFS đảm bảo tìm được đường ngắn nhất trong không gian trạng thái này.

**Pattern Recognition:**

- Minimum moves in state space → BFS on state strings
- State = flattened board as string ("123450" = solved)
- Transitions = swap `0` with each valid neighbor

**Visual:**

```
Board:           String state:
[[1,2,3],        "123045"
 [4,0,5]]
         ↓ BFS
Swap 0↔4: "123405"   (0 moves left)
Swap 0↔5: "123045" unchanged... wait
Swap 0↔2: "102345" ? No, neighbors of pos 4 (row1,col1):
  pos 4's neighbors in 2x3: 1(up), 3(left), 5(right), N/A(down)

neighbors map (precomputed for 2x3):
pos 0→[1,3], pos 1→[0,2,4], pos 2→[1,5]
pos 3→[0,4], pos 4→[3,5,1], pos 5→[2,4]

BFS finds "123450" in minimum steps.
```

## Problem Description

On a 2×3 board, tiles numbered 1–5 and one blank (0) can slide into the blank space. Given the initial `board`, return the minimum number of moves to solve it (reach `[[1,2,3],[4,5,0]]`). If impossible, return `-1`.

**Example 1:** `board = [[1,2,3],[4,0,5]]` → `1`
**Example 2:** `board = [[1,2,3],[5,4,0]]` → `-1`
**Example 3:** `board = [[4,1,2],[5,0,3]]` → `5`

**Constraints:** `board.length == 2`, `board[i].length == 3`, `0 <= board[i][j] <= 5`, all integers 0–5 appear exactly once.

## 📝 Interview Tips

1. **Clarify**: Bảng luôn là 2×3? Có thể unsolvable không? (Có) / Board is always 2×3? Can it be unsolvable? Yes.
2. **Approach**: Model mỗi trạng thái bảng là string, BFS tìm đường ngắn nhất / Represent state as string, BFS for minimum moves.
3. **Edge cases**: Board đã solved sẵn → 0; một số cấu hình không giải được → -1 / Already solved → 0.
4. **Optimize**: Precompute neighbor positions cho 2×3 (fixed size, easy to hardcode) / Hardcode neighbors for this fixed-size board.
5. **Test**: `[[1,2,3],[4,5,0]]` → 0; `[[1,2,3],[5,4,0]]` → -1 / Test solved and unsolvable cases.
6. **Follow-up**: Nếu bảng lớn hơn? → A* search với manhattan distance heuristic / For larger boards, use A*.

## Solutions

```typescript
/** Solution 1: BFS on state strings (Optimal for fixed-size board)
 * Time: O(6! × 6) = O(4320) | Space: O(6!) = O(720) — state space bounded
 */
function slidingPuzzle(board: number[][]): number {
  const target = "123450";
  const start = board.flat().join("");
  if (start === target) return 0;

  // Precomputed neighbors of each position in 2×3 flattened array
  const neighbors = [
    [1, 3],
    [0, 2, 4],
    [1, 5],
    [0, 4],
    [3, 5, 1],
    [4, 2],
  ];
  const visited = new Set<string>([start]);
  const queue: string[] = [start];
  let moves = 0;

  while (queue.length > 0) {
    moves++;
    const size = queue.length;
    for (let k = 0; k < size; k++) {
      const state = queue.shift()!;
      const zeroIdx = state.indexOf("0");
      for (const neighbor of neighbors[zeroIdx]) {
        // Swap 0 with neighbor
        const arr = state.split("");
        [arr[zeroIdx], arr[neighbor]] = [arr[neighbor], arr[zeroIdx]];
        const next = arr.join("");
        if (next === target) return moves;
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
  }
  return -1;
}

/** Solution 2: Bidirectional BFS — faster in practice
 * Time: O(6!/2) average | Space: O(6!)
 */
function slidingPuzzleBiBFS(board: number[][]): number {
  const target = "123450";
  const start = board.flat().join("");
  if (start === target) return 0;

  const neighbors = [
    [1, 3],
    [0, 2, 4],
    [1, 5],
    [0, 4],
    [3, 5, 1],
    [4, 2],
  ];

  let front = new Set<string>([start]);
  let back = new Set<string>([target]);
  const visitedFront = new Map<string, number>([[start, 0]]);
  const visitedBack = new Map<string, number>([[target, 0]]);
  let steps = 0;

  function expand(
    current: Set<string>,
    visited: Map<string, number>,
    other: Map<string, number>,
  ): number {
    steps++;
    const next = new Set<string>();
    for (const state of current) {
      const zeroIdx = state.indexOf("0");
      for (const nb of neighbors[zeroIdx]) {
        const arr = state.split("");
        [arr[zeroIdx], arr[nb]] = [arr[nb], arr[zeroIdx]];
        const ns = arr.join("");
        if (other.has(ns)) return steps + other.get(ns)!;
        if (!visited.has(ns)) {
          visited.set(ns, steps);
          next.add(ns);
        }
      }
    }
    current.clear();
    for (const s of next) current.add(s);
    return -1;
  }

  while (front.size && back.size) {
    const src = front.size <= back.size ? front : back;
    const vis = front.size <= back.size ? visitedFront : visitedBack;
    const oth = front.size <= back.size ? visitedBack : visitedFront;
    const res = expand(src, vis, oth);
    if (res !== -1) return res;
  }
  return -1;
}

// Test cases
console.log(
  slidingPuzzle([
    [1, 2, 3],
    [4, 0, 5],
  ]),
); // 1
console.log(
  slidingPuzzle([
    [1, 2, 3],
    [5, 4, 0],
  ]),
); // -1
console.log(
  slidingPuzzle([
    [4, 1, 2],
    [5, 0, 3],
  ]),
); // 5
console.log(
  slidingPuzzle([
    [1, 2, 3],
    [4, 5, 0],
  ]),
); // 0

console.log(
  slidingPuzzleBiBFS([
    [1, 2, 3],
    [4, 0, 5],
  ]),
); // 1
console.log(
  slidingPuzzleBiBFS([
    [4, 1, 2],
    [5, 0, 3],
  ]),
); // 5
```

## 🔗 Related Problems

| Problem                                                                                                            | Relationship                            |
| ------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| [Word Ladder](https://leetcode.com/problems/word-ladder)                                                           | BFS on state space (string transitions) |
| [Open the Lock](https://leetcode.com/problems/open-the-lock)                                                       | BFS minimum moves in state space        |
| [Minimum Number of Moves to Seat Everyone](https://leetcode.com/problems/minimum-number-of-moves-to-seat-everyone) | State space optimization                |
