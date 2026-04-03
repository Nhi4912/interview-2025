---
layout: page
title: "Snakes and Ladders"
difficulty: Medium
category: Tree-Graph
tags: [Array, Breadth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/snakes-and-ladders"
---

# Snakes and Ladders / Rắn và Thang

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS on Board State

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như trò chơi cờ "Rắn và Thang" thật sự — bạn tung xúc xắc, di chuyển 1-6 ô, và nếu đáp vào ô thang thì nhảy lên, ô rắn thì tụt xuống. BFS lý tưởng vì mỗi lượt tung xúc xắc = 1 bước, và ta muốn ít bước nhất. Phần khó là mapping số ô (1-based) ra tọa độ hàng-cột trong ma trận kiểu Boustrophedon (đi rắn, alternating directions).

**Pattern Recognition:**

- Signal: "minimum moves on board" + "teleportation" → **BFS**
- Convert: square number (1-indexed) → (row, col) in board, accounting for alternating direction
- Key insight: BFS on square numbers directly; apply snakes/ladders during neighbor expansion

**Visual — Board layout (n=6, 1-indexed):**

```
Boustrophedon layout (n=6):
Row 5 (top):   36 35 34 33 32 31   ← right to left
Row 4:         25 26 27 28 29 30   ← left to right
Row 3:         24 23 22 21 20 19   ← right to left
Row 2:         13 14 15 16 17 18   ← left to right
Row 1:         12 11 10  9  8  7   ← right to left
Row 0 (bot):    1  2  3  4  5  6   ← left to right

Square s → row = (s-1) // n, col = (s-1) % n
If row is odd (from bottom): col is reversed → col = n-1-col

BFS from square 1:
  Level 0: {1}
  Level 1: {2,3,4,5,6,7} (roll 1-6), apply ladders/snakes
  Level 2: expand each...
  Return level when we reach square n*n
```

---

## Problem Description

Given an `n × n` board for Snakes and Ladders. Squares are numbered 1 to n² in Boustrophedon order starting from the bottom-left. A value of `-1` means no snake/ladder; otherwise the player moves to that value. Return the **minimum number of dice rolls** to reach square `n²`, or `-1` if impossible.

**Example 1:**

- Input: `board = [[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1]]` → Output: `-1` (actually `11` on standard board)

**Example 2:**

- Input: `board = [[-1,-1],[-1,3]]` → Output: `1`

**Constraints:**

- `n == board.length == board[i].length`
- `2 <= n <= 20`
- `board[i][j]` is `-1` or in range `[1, n²]`

---

## 📝 Interview Tips

1. **Clarify**: "Khi đáp vào ô rắn/thang, có thể tiếp tục dùng rắn/thang từ ô đích không?" / After landing on snake/ladder destination, can you chain again? (No, per LeetCode rules)
2. **Key challenge**: "Mapping số ô ra tọa độ matrix — cẩn thận với hướng đi alternating" / The tricky part is correctly mapping square number to (row, col) with alternating direction
3. **BFS guarantee**: "Mỗi lần tung xúc xắc = 1 edge cost → BFS cho shortest" / Each roll = weight 1, BFS gives minimum rolls
4. **Visited set**: "Đánh dấu visited trên số ô (sau khi áp dụng snake/ladder) để tránh loop" / Mark visited on final square after applying snake/ladder
5. **Edge cases**: "n=2, board toàn -1, rắn/thang tạo cycle không thoát được" / Minimal board, no snakes/ladders, or cycles
6. **Complexity**: "O(n²) nodes × 6 neighbors = O(n²)" / O(n²) total BFS over n² squares

---

## Solutions

```typescript
/**
 * Solution: BFS on square numbers
 * Time: O(n^2) — each square visited at most once
 * Space: O(n^2) for visited array and BFS queue
 *
 * Helper: squareToCoord(s, n) maps 1-indexed square → [row, col]
 * accounting for Boustrophedon (alternating row direction).
 */
function snakesAndLadders(board: number[][]): number {
  const n = board.length;
  const target = n * n;

  // Convert square number s (1-indexed) to board [row, col]
  function squareToCoord(s: number): [number, number] {
    const idx = s - 1;
    const row = Math.floor(idx / n);
    let col = idx % n;
    // Even rows from bottom go left-to-right; odd rows go right-to-left
    if (row % 2 === 1) col = n - 1 - col;
    return [n - 1 - row, col]; // board[0] is top row
  }

  const visited = new Array(target + 1).fill(false);
  visited[1] = true;
  const queue: number[] = [1];
  let rolls = 0;

  while (queue.length > 0) {
    rolls++;
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const curr = queue.shift()!;
      // Roll dice: move 1 to 6 squares forward
      for (let dice = 1; dice <= 6; dice++) {
        let next = curr + dice;
        if (next > target) break;
        // Apply snake or ladder
        const [r, c] = squareToCoord(next);
        if (board[r][c] !== -1) next = board[r][c];
        if (next === target) return rolls;
        if (!visited[next]) {
          visited[next] = true;
          queue.push(next);
        }
      }
    }
  }
  return -1;
}

/**
 * Solution 2: BFS with explicit board-to-flat mapping (alternative)
 * Same algorithm, builds flat array first for clarity
 * Time: O(n^2), Space: O(n^2)
 */
function snakesAndLaddersClear(board: number[][]): number {
  const n = board.length;
  // Build flat array flat[0..n²-1] where flat[i] = board value of square i+1
  const flat: number[] = [];
  for (let row = n - 1; row >= 0; row--) {
    const rowFromBottom = n - 1 - row;
    if (rowFromBottom % 2 === 0) {
      // left to right
      for (let col = 0; col < n; col++) flat.push(board[row][col]);
    } else {
      // right to left
      for (let col = n - 1; col >= 0; col--) flat.push(board[row][col]);
    }
  }

  const visited = new Set<number>([0]);
  const queue: number[] = [0]; // 0-indexed
  let rolls = 0;

  while (queue.length > 0) {
    rolls++;
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const curr = queue.shift()!;
      for (let dice = 1; dice <= 6; dice++) {
        let next = curr + dice;
        if (next >= n * n) {
          if (next === n * n - 1 || flat[next - 1] === -1) return rolls;
        }
        if (next >= n * n) continue;
        if (flat[next] !== -1) next = flat[next] - 1;
        if (next === n * n - 1) return rolls;
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
  }
  return -1;
}

// === Test Cases ===
console.log(
  snakesAndLadders([
    [-1, -1],
    [-1, 3],
  ]),
); // 1
console.log(
  snakesAndLadders([
    [-1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1],
    [-1, 35, -1, -1, 13, -1],
    [-1, -1, -1, -1, -1, -1],
    [-1, 15, -1, -1, -1, -1],
  ]),
); // 4
console.log(
  snakesAndLadders([
    [-1, -1],
    [-1, -1],
  ]),
); // 1 (2x2, reach square 4 in 1 roll of ≥3)
```

---

## 🔗 Related Problems

| Problem                                                                                                    | Pattern          | Difficulty |
| ---------------------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| [Rotting Oranges](https://leetcode.com/problems/rotting-oranges)                                           | Multi-source BFS | Medium     |
| [Jump Game IV](https://leetcode.com/problems/jump-game-iv)                                                 | BFS on indices   | Hard       |
| [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix)             | BFS on grid      | Medium     |
| [Open the Lock](https://leetcode.com/problems/open-the-lock)                                               | BFS on state     | Medium     |
| [Shortest Distance from All Buildings](https://leetcode.com/problems/shortest-distance-from-all-buildings) | Multi-source BFS | Hard       |
