---
layout: page
title: "Word Search"
difficulty: Medium
category: Backtracking
tags: [Backtracking, Array, Matrix, DFS]
leetcode_url: "https://leetcode.com/problems/word-search/"
---

# Word Search / Tìm Từ Trong Lưới

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking (Grid DFS)
> **Frequency**: 🔥 Tier 1 — Hay gặp ở các vòng onsite, kiểm tra DFS + backtracking trên ma trận
> **See also**: [Number of Islands](../../tree-graph/problems/12-number-of-islands.md) | [Word Search II](./09-word-search-ii.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như trò chơi ô chữ (word search puzzle) — bạn tìm một từ bằng cách di chuyển từng ô liền kề theo 4 hướng. Nếu đi sai hướng thì quay lại (backtrack) và thử hướng khác.

**Pattern Recognition:**

- Signal: "word exists in grid / path on matrix" → **Grid DFS + Backtracking**
- Mark ô đang thăm để tránh dùng lại (`board[r][c] = '#'`), restore khi backtrack
- DFS trên 4 hướng, prune sớm khi ký tự không khớp

**Visual — DFS path for word = "ABCCED":**

```
Board:                    DFS trace (word[0..5]):
A* B* C* E                (0,0)A → (0,1)B → (0,2)C
S  F  C* S                              ↓
A  D* E* E                        (1,2)C → (2,2)E → (2,1)D  ✓

* = visited in this path

Each step: if board[r][c] === word[i] → mark '#' → recurse → restore
If word[i] = word.length → return true (found!)
```

---

## Problem Description

Given an `m × n` grid of characters and a string `word`, return `true` if `word` exists in the grid. The word must be constructed from adjacent (horizontally or vertically) cells. The same cell may not be used more than once.

```
Example 1: board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED" → true
Example 2: same board, word="SEE" → true
Example 3: same board, word="ABCB" → false
```

Constraints:

- `1 <= m, n <= 6`, `1 <= word.length <= 15`, board and word contain only uppercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "Có thể dùng lại ô không?" — Can we revisit a cell? (No for #79, Yes for #212 with Trie)
2. **Brute force**: Thử DFS từ mọi ô — Try DFS from every cell O(m × n × 4^L), L = word length
3. **Optimize**: Đánh dấu trực tiếp trên board (`'#'`) để tránh cấp phát mảng visited riêng
4. **Edge cases**: Word dài hơn m×n → false; word chỉ 1 ký tự → tìm ký tự đó trong board
5. **Follow-up**: "Tìm nhiều từ cùng lúc?" → Word Search II (#212) — dùng Trie để prune

---

## Solutions

```typescript

/**

- Solution 1: Backtracking — in-place marking (Optimal & recommended)
- Time: O(m × n × 4^L) — L = word.length; prune early when chars mismatch
- Space: O(L) — recursion stack depth equals word length
-
- Trick: mark visited by replacing board[r][c] with '#', restore after backtrack.
- Avoids allocating a separate visited array.
  */
  function exist(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function dfs(r: number, c: number, idx: number): boolean {
if (idx === word.length) return true;
if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[idx]) return false;

    const tmp = board[r][c];
    board[r][c] = '#'; // mark visited

    for (const [dr, dc] of dirs) {
      if (dfs(r + dr, c + dc, idx + 1)) {
        board[r][c] = tmp; // restore before returning
        return true;
      }
    }

    board[r][c] = tmp; // backtrack
    return false;

}

for (let r = 0; r < m; r++) {
for (let c = 0; c < n; c++) {
if (dfs(r, c, 0)) return true;
}
}
return false;
}

/**

- Solution 2: Backtracking — separate visited array (Clearer state, no board mutation)
- Time: O(m × n × 4^L) — same
- Space: O(m × n + L) — visited grid + recursion stack
  */
  function existVisited(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function dfs(r: number, c: number, idx: number): boolean {
if (idx === word.length) return true;
if (r < 0 || r >= m || c < 0 || c >= n) return false;
if (visited[r][c] || board[r][c] !== word[idx]) return false;

    visited[r][c] = true;
    for (const [dr, dc] of dirs) {
      if (dfs(r + dr, c + dc, idx + 1)) return true;
    }
    visited[r][c] = false; // backtrack
    return false;

}

for (let r = 0; r < m; r++) {
for (let c = 0; c < n; c++) {
if (dfs(r, c, 0)) return true;
}
}
return false;
}

// === Test Cases ===
const board1 = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]];
console.log(exist(board1.map(r => [...r]), "ABCCED")); // true
console.log(exist(board1.map(r => [...r]), "SEE")); // true
console.log(exist(board1.map(r => [...r]), "ABCB")); // false

```

---

## 🔗 Related Problems

- [Number of Islands](../../tree-graph/problems/12-number-of-islands.md) — cùng pattern DFS trên grid, mark visited
- [Word Search II](./09-word-search-ii.md) — nhiều từ cùng lúc, tối ưu bằng Trie
