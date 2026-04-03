---
layout: page
title: "Minimum Knight Moves"
difficulty: Medium
category: Tree-Graph
tags: [Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/minimum-knight-moves"
---

# Minimum Knight Moves / Số Bước Mã Tối Thiểu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Rotting Oranges](https://leetcode.com/problems/rotting-oranges)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như tìm đường ngắn nhất trên bàn cờ vua — quân mã nhảy theo hình chữ L. BFS đảm bảo lần đầu đến đích chính là đường ngắn nhất. Dùng tính đối xứng để giảm search space xuống góc phần tư đầu tiên.

**Pattern Recognition:**

- Signal: "minimum steps in unweighted implicit graph" + "8 moves per state" → **BFS**
- State = (x, y) position; goal = reach (x, y) in fewest moves
- Key insight: Symmetry — `(x,y)` has same answer as `(|x|,|y|)` and same if x<y swapped

**Visual — Knight BFS from (0,0) to (2,1):**

```
Bàn cờ vô hạn, quân mã xuất phát (0,0), đến (2,1)

Level 0: {(0,0)}
Level 1: {(1,2),(2,1),(2,-1),(1,-2),(-1,2),(-2,1),(-2,-1),(-1,-2)}
          ↑ (2,1) found at level 1!  → Answer: 1

Symmetry optimization:
  target = (|x|, |y|), swap so x >= y
  Fold into first quadrant — reduces visited states 4x
```

---

## Problem Description

On an infinite chessboard, a knight starts at `(0, 0)`. Given target `(x, y)`, return the minimum number of moves for the knight to reach `(x, y)`. A knight moves in an L-shape: ±1 in one direction and ±2 in another (8 possible moves).

- Example 1: `x=2, y=1` → `1` (one L-move: +2 right, +1 up)
- Example 2: `x=5, y=5` → `4`

Constraints: `-300 <= x, y <= 300`.

---

## 📝 Interview Tips

1. **Clarify**: "Bàn cờ vô hạn — không có biên. Target có thể âm" / Infinite board; negative coordinates valid
2. **BFS guarantee**: "BFS cho shortest path trong unweighted graph — first time reaching target = answer" / BFS = optimal for uniform edge weights
3. **Symmetry trick**: "|(x)|, |y|, swap nếu x<y → giảm visited states 4-8 lần" / Fold to first quadrant; mirror symmetry makes (x,y)=(|x|,|y|)
4. **Visited set**: "Dùng Set<string> hoặc Map — quan trọng để tránh revisit" / String key "(x,y)" for visited; crucial for performance
5. **Edge case**: "target=(0,0) → 0 moves. target=(1,0) → 3 moves (không phải 1)" / Knight cannot reach (1,0) in 1 move
6. **Follow-up**: "DP approach? dp[x][y] = min(dp[x±1][y±2], dp[x±2][y±1]) + 1" / DP with memoization also works; BFS cleaner

---

## Solutions

```typescript
/**
 * Solution 1: BFS with symmetry optimization
 * Fold to first quadrant (|x|,|y|) to reduce search space
 * Time: O(max(|x|,|y|)^2) — BFS covers region around target
 * Space: O(max(|x|,|y|)^2) — visited set
 */
function minKnightMoves(x: number, y: number): number {
  // Use symmetry: fold to first quadrant
  x = Math.abs(x);
  y = Math.abs(y);

  const moves = [
    [1, 2],
    [2, 1],
    [1, -2],
    [2, -1],
    [-1, 2],
    [-2, 1],
    [-1, -2],
    [-2, -1],
  ];
  const visited = new Set<string>(["0,0"]);
  let queue: [number, number][] = [[0, 0]];
  let steps = 0;

  while (queue.length > 0) {
    const next: [number, number][] = [];
    for (const [cx, cy] of queue) {
      if (cx === x && cy === y) return steps;
      for (const [dx, dy] of moves) {
        const nx = cx + dx,
          ny = cy + dy;
        // Allow slight overshoot but stay near target (offset by 2)
        if (nx < -2 || ny < -2) continue;
        const key = `${nx},${ny}`;
        if (!visited.has(key)) {
          visited.add(key);
          next.push([nx, ny]);
        }
      }
    }
    queue = next;
    steps++;
  }

  return steps;
}

/**
 * Solution 2: BFS with coordinate normalization (mirror to first quadrant)
 * Normalize each position to (|x|,|y|) — cuts visited states by 4x
 * Time: O(max(x,y)^2) — bounded by target distance
 * Space: O(max(x,y)^2) — visited
 */
function minKnightMovesOpt(x: number, y: number): number {
  x = Math.abs(x);
  y = Math.abs(y);
  if (x === 0 && y === 0) return 0;

  const moves = [
    [1, 2],
    [2, 1],
    [1, -2],
    [2, -1],
    [-1, 2],
    [-2, 1],
    [-1, -2],
    [-2, -1],
  ];
  const visited = new Set<string>();
  let queue: [number, number, number][] = [[0, 0, 0]]; // x, y, steps
  visited.add("0,0");

  while (queue.length > 0) {
    const [cx, cy, steps] = queue.shift()!;
    for (const [dx, dy] of moves) {
      let nx = Math.abs(cx + dx);
      let ny = Math.abs(cy + dy);
      if (nx === x && ny === y) return steps + 1;
      const key = `${nx},${ny}`;
      if (!visited.has(key) && nx <= x + 2 && ny <= y + 2) {
        visited.add(key);
        queue.push([nx, ny, steps + 1]);
      }
    }
  }

  return -1;
}

// === Test Cases ===
console.log(minKnightMoves(2, 1)); // 1
console.log(minKnightMoves(5, 5)); // 4
console.log(minKnightMoves(0, 0)); // 0
console.log(minKnightMoves(1, 0)); // 3
console.log(minKnightMoves(-300, -300)); // 200 (symmetric)
```

---

## 🔗 Related Problems

- [Rotting Oranges](https://leetcode.com/problems/rotting-oranges) — BFS multi-source level traversal
- [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix) — BFS shortest path on grid
- [Open the Lock](https://leetcode.com/problems/open-the-lock) — BFS state-space search with fixed moves
- [Evaluate Division](https://leetcode.com/problems/evaluate-division) — BFS on implicit weighted graph
