---
layout: page
title: "Word Search"
difficulty: Medium
category: Backtracking
tags: [Backtracking, Array, Matrix, DFS]
leetcode_url: "https://leetcode.com/problems/word-search/"
leetcode_number: 79
pattern: "Grid DFS + Backtracking"
frequency_tier: 1
companies: [Amazon, Meta, Bloomberg, Microsoft]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Word Search / Tìm Từ Trong Lưới

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Grid DFS + Backtracking
> **Frequency**: 🔥 Tier 1 — Hay gặp ở onsite, kiểm tra DFS + backtracking trên ma trận
> **Target**: ⏱️ 20 min | **Companies**: Amazon, Meta, Bloomberg, Microsoft
> **See also**: [Number of Islands](../../tree-graph/problems/12-number-of-islands.md) | [Word Search II](./09-word-search-ii.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống trò chơi ô chữ (word search puzzle) — bạn tìm một từ bằng cách di chuyển từng ô liền kề theo 4 hướng. Nếu đi sai hướng thì quay lại (backtrack) và thử hướng khác.

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
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                       |
| ---------------- | -------------------------------------------------------------- |
| **When you see** | "find word in grid", "path exists in matrix", "adjacent cells" |
| **Think**        | Grid DFS + Backtracking — try all starts, prune on mismatch    |
| **Template**     | `dfs(r, c, idx): mark → recurse 4 dirs → unmark`               |
| **Time target**  | ⏱️ 20 min (Medium)                                             |

> 💡 **Memory hook / Móc nhớ:** "Trò ô chữ — đi từng bước, sai thì quay lại, đúng thì tiếp!"

---

## Problem Description

Given an `m × n` grid of characters and a string `word`, return `true` if `word` exists in the grid. The word must be constructed from adjacent (horizontally or vertically) cells. The same cell may not be used more than once.

```
Example 1: board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED" → true
Example 2: same board, word="SEE" → true
Example 3: same board, word="ABCB" → false
```

Constraints:

- `1 <= m, n <= 6`, `1 <= word.length <= 15`

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We have an m×n character grid and a target word.
> We need to check if the word can be formed by adjacent cells (no reuse).
> Clarification: Only horizontal/vertical adjacency, not diagonal?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "This is a path-finding problem on a grid — classic DFS + Backtracking.
> For each cell matching word[0], run DFS checking 4 directions.
> Mark cells in-place with '#' to avoid revisiting; restore on backtrack.
> Time O(m×n×4^L), where L = word length. Shall I code it?"

### Step 3 — Implement / Viết Code (5-7 min)

> "I'll write a dfs(r, c, idx) helper.
> Base case: idx === word.length → found. Bounds/mismatch → false.
> Save board[r][c], mark '#', recurse 4 directions, restore on return."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace 'ABCCED': start (0,0)='A' → (0,1)='B' → (0,2)='C' → (1,2)='C'
> → (2,2)='E' → (2,1)='D'. idx=6 === length → true. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(m×n×4^L) worst case, pruned early by char mismatch.
> Space: O(L) recursion depth. In-place marking avoids visited array.
> Follow-up: multiple words? → Word Search II with Trie (#212)."

---

## 📝 Interview Tips

1. **Clarify**: Can we revisit a cell? (No) / Có thể dùng lại ô không? — Không
2. **Approach**: DFS from every cell matching word[0] — O(m×n×4^L)
3. **Optimize**: Mark in-place with `'#'` to avoid allocating visited array
4. **Edge cases**: Word longer than m×n → false; single char word → just search grid
5. **Follow-up**: Find multiple words? → Word Search II (#212) with Trie

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                   | Why Wrong / Tại sao sai                              | Fix / Cách sửa                                |
| --- | ----------------------------------- | ---------------------------------------------------- | --------------------------------------------- |
| 1   | Forget to restore cell on backtrack | Board stays corrupted for other paths starting later | Always restore: `board[r][c] = tmp` after DFS |
| 2   | Not restoring before early return   | `return true` inside loop skips restore              | Restore before returning true                 |
| 3   | Using separate visited array        | Not wrong but wastes O(m×n) space unnecessarily      | Use in-place '#' marking for O(1) extra space |

---

## Solutions

```typescript
/**
 * Solution 1: Backtracking — in-place marking (Optimal)
 * Time: O(m × n × 4^L) — L = word.length; prune early on mismatch
 * Space: O(L) — recursion stack depth equals word length
 */
function exist(board: string[][], word: string): boolean {
  const m = board.length;
  const n = board[0].length;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  function dfs(r: number, c: number, idx: number): boolean {
    if (idx === word.length) return true;
    if (r < 0 || r >= m || c < 0 || c >= n) return false;
    if (board[r][c] !== word[idx]) return false;

    const tmp = board[r][c];
    board[r][c] = "#";

    for (const [dr, dc] of dirs) {
      if (dfs(r + dr, c + dc, idx + 1)) {
        board[r][c] = tmp;
        return true;
      }
    }

    board[r][c] = tmp;
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
const board1 = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
];
console.log(
  exist(
    board1.map((r) => [...r]),
    "ABCCED",
  ),
); // true
console.log(
  exist(
    board1.map((r) => [...r]),
    "SEE",
  ),
); // true
console.log(
  exist(
    board1.map((r) => [...r]),
    "ABCB",
  ),
); // false
```

---

## 🔗 Related Problems

- [Number of Islands](../../tree-graph/problems/12-number-of-islands.md) — cùng pattern DFS trên grid
- [Word Search II](./09-word-search-ii.md) — nhiều từ cùng lúc, tối ưu bằng Trie

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 20 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
