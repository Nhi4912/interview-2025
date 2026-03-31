---
layout: page
title: "Battleships in a Board"
difficulty: Medium
category: Tree-Graph
tags: [Array, Depth-First Search, Matrix]
leetcode_url: "https://leetcode.com/problems/battleships-in-a-board"
---

# Battleships in a Board / Đếm Tàu Chiến Trên Bảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Matrix Scan (O(1) space)

## 🧠 Intuition

**VI**: Mỗi tàu chiến là một dãy ô 'X' liên tiếp theo hàng ngang hoặc dọc. Thay vì DFS đánh dấu toàn bộ tàu, ta chỉ đếm "ô đầu tiên" của mỗi tàu: ô 'X' mà KHÔNG có 'X' phía trên (hàng trước) VÀ KHÔNG có 'X' bên trái (cột trước). Đây là thuật toán O(1) space!

**EN**: A battleship's "head" cell is any 'X' with no 'X' above (`board[r-1][c] !== 'X'`) and no 'X' to the left (`board[r][c-1] !== 'X'`). Count only head cells — one per battleship.

```
Board:                Head detection:
X . . X               ✓ . . ✓   ← (0,0) and (0,3) are heads
. . . X      →        . . . ×   ← (1,3) has X above → not head
. . . X               . . . ×   ← (2,3) has X above → not head

Count = 2 ✓
```

## 📝 Interview Tips

- 🇻🇳 Trick quan trọng: chỉ đếm "đầu tàu" — ô 'X' không có 'X' phía trên và bên trái.
- 🇬🇧 Key trick: only count "head" cells — 'X' with no 'X' above or to the left.
- 🇻🇳 Không cần modify board, không cần visited array — O(1) space cực kỳ elegant.
- 🇬🇧 No board modification, no visited array — pure O(1) space solution.
- 🇻🇳 DFS/BFS cũng đúng nhưng O(n\*m) space và modify board (phải restore).
- 🇬🇧 DFS works too but uses O(nm) space or requires board restoration — worse tradeoff.

## Solutions

```typescript
// ─── Solution 1: O(1) Space — Count only head cells ───
// Time: O(n*m)  Space: O(1)
function countBattleships(board: string[][]): number {
  let count = 0;
  const rows = board.length,
    cols = board[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== "X") continue;
      // Skip if there's an 'X' above (same column, previous row)
      if (r > 0 && board[r - 1][c] === "X") continue;
      // Skip if there's an 'X' to the left (same row, previous column)
      if (c > 0 && board[r][c - 1] === "X") continue;
      count++;
    }
  }
  return count;
}

// ─── Solution 2: DFS — Mark visited (modifies board, O(nm) space if clone) ───
// Time: O(n*m)  Space: O(n*m) for clone or O(min(n,m)) recursion stack
function countBattleshipsDFS(board: string[][]): number {
  const grid = board.map((row) => [...row]); // clone to avoid mutation
  let count = 0;

  function dfs(r: number, c: number): void {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== "X") return;
    grid[r][c] = "."; // mark visited
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === "X") {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}

// ─── Solution 3: Union-Find (overkill but demonstrates pattern) ───
function countBattleshipsUF(board: string[][]): number {
  const rows = board.length,
    cols = board[0].length;
  const parent = Array.from({ length: rows * cols }, (_, i) => i);

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (a: number, b: number) => {
    parent[find(a)] = find(b);
  };

  const ships = new Set<number>();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] !== "X") continue;
      const id = r * cols + c;
      ships.add(id);
      if (r > 0 && board[r - 1][c] === "X") union(id, (r - 1) * cols + c);
      if (c > 0 && board[r][c - 1] === "X") union(id, r * cols + (c - 1));
    }
  }

  const roots = new Set<number>();
  for (const id of ships) roots.add(find(id));
  return roots.size;
}

// Tests
const board1 = [
  ["X", ".", ".", "X"],
  [".", ".", ".", "X"],
  [".", ".", ".", "X"],
];
console.log(countBattleships(board1)); // 2
console.log(countBattleshipsDFS(board1)); // 2
console.log(countBattleshipsUF(board1)); // 2

const board2 = [["."]];
console.log(countBattleships(board2)); // 0
```

## 🔗 Related Problems

| #   | Title              | Difficulty | Pattern        |
| --- | ------------------ | ---------- | -------------- |
| 200 | Number of Islands  | 🟡 Medium  | DFS/BFS Matrix |
| 695 | Max Area of Island | 🟡 Medium  | DFS Matrix     |
| 463 | Island Perimeter   | 🟢 Easy    | Matrix Scan    |
| 130 | Surrounded Regions | 🟡 Medium  | DFS/BFS        |
