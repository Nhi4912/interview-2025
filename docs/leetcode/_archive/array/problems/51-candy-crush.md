---
layout: page
title: "Candy Crush"
difficulty: Medium
category: Array
tags: [Array, Two Pointers, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/candy-crush"
---

# Candy Crush / Candy Crush

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Matrix Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Flipping an Image](https://leetcode.com/problems/flipping-an-image) | [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn chơi Candy Crush thực sự — bạn quét qua bảng tìm các viên kẹo giống nhau liên tiếp 3+ theo hàng hoặc cột, đánh dấu chúng (phủ vải đỏ), rồi lấy ra đồng thời. Sau đó trọng lực kéo kẹo còn lại rơi xuống. Lặp lại cho đến khi không còn gì để phá.

**Pattern Recognition:**

- Signal: "mark, crush, apply gravity, repeat" → **Simulation with in-place marking**
- Mark phase: negate values to flag cells for crushing (keep sign, lose info elegantly)
- Gravity: use a write-pointer per column to compact non-zero values downward

**Visual — One crush cycle on a column:**

```
Before:   [3, 3, 0, 3, 3, 3]  (bottom to top, after gravity)
Mark col: abs match 3+ consecutive → negate
After mark: [-3,-3, 0,-3,-3,-3]
Crush:    zeros out negatives → [0, 0, 0, 0, 0, 0]
Gravity:  non-zero values (none here) fall down → column cleared ✅
```

---

## Problem Description

Given a `m x n` integer matrix `board` representing a Candy Crush board (non-zero = candy type, 0 = empty), repeatedly crush all groups of **3 or more identical consecutive candies** in the same row or column, then apply gravity (candies fall down). Return the final stable board.

**Example:** `board = [[110,5,112,113,114],[210,211,5,213,214],[310,311,3,313,314],[410,411,412,5,414],[5,1,512,3,3],[600,1,2,3,4],[700,1,2,3,4],[800,1,2,3,4],[900,1,2,3,4],[0,0,0,1,0]]` → (see LeetCode for expected grid output)

**Simple Example:** `board = [[1,3,5,5,2],[3,4,3,3,1],[3,2,4,5,2],[2,4,4,5,5],[1,4,3,2,3]]` (see LeetCode for output)

Constraints:

- `m == board.length`, `n == board[0].length`
- `3 <= m, n <= 50`; `1 <= board[i][j] <= 2000` or `board[i][j] == 0`

---

## 📝 Interview Tips

1. **Clarify**: "Nghiền đồng thời không? Có, toàn bộ match bị xóa cùng lúc" / Crushing is simultaneous — mark first, then crush
2. **Brute force**: "Copy board cho mỗi round — đơn giản nhưng tốn memory" / Copy board each round; works but use in-place marking
3. **Mark trick**: "Negate giá trị để đánh dấu — abs(val) vẫn dùng được khi check" / Negate to mark, abs() to compare
4. **Gravity**: "Dùng write pointer từ dưới lên, điền non-zero trước" / Write pointer packs non-zero to bottom of each column
5. **Edge cases**: "Không có match ngay từ đầu → return luôn; toàn 0 → return luôn" / Stable boards returned immediately
6. **Complexity**: "O((m*n)² worst case) — mỗi round ít nhất 3 ô bị xóa" / Each round removes ≥ 3 cells; at most m*n/3 rounds

---

## Solutions

```typescript
/**
 * Solution 1: Simulation with board copy (easy to understand)
 * Time: O((m*n)²) — up to m*n/3 rounds, each O(m*n)
 * Space: O(m*n) — copy per round
 */
function candyCrushCopy(board: number[][]): number[][] {
  const m = board.length,
    n = board[0].length;

  while (true) {
    const toRemove = Array.from({ length: m }, () => new Array(n).fill(false));
    let found = false;

    // Mark horizontal matches
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n - 2; c++) {
        const v = Math.abs(board[r][c]);
        if (v !== 0 && v === Math.abs(board[r][c + 1]) && v === Math.abs(board[r][c + 2])) {
          toRemove[r][c] = toRemove[r][c + 1] = toRemove[r][c + 2] = true;
          found = true;
        }
      }
    }
    // Mark vertical matches
    for (let r = 0; r < m - 2; r++) {
      for (let c = 0; c < n; c++) {
        const v = Math.abs(board[r][c]);
        if (v !== 0 && v === Math.abs(board[r + 1][c]) && v === Math.abs(board[r + 2][c])) {
          toRemove[r][c] = toRemove[r + 1][c] = toRemove[r + 2][c] = true;
          found = true;
        }
      }
    }
    if (!found) break;

    // Crush
    for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (toRemove[r][c]) board[r][c] = 0;

    // Gravity per column
    for (let c = 0; c < n; c++) {
      let writeRow = m - 1;
      for (let r = m - 1; r >= 0; r--) {
        if (board[r][c] !== 0) board[writeRow--][c] = board[r][c];
      }
      while (writeRow >= 0) board[writeRow--][c] = 0;
    }
  }
  return board;
}

/**
 * Solution 2: Optimized — in-place marking via negation (no extra boolean array)
 * Mark phase: negate cells that are part of a 3+ match
 * Crush phase: set negatives to 0; gravity via column write-pointer
 * Time: O((m*n)²) — same rounds, but O(1) extra space per round
 * Space: O(1) extra (mutates board in place)
 */
function candyCrush(board: number[][]): number[][] {
  const m = board.length,
    n = board[0].length;

  while (true) {
    let crushed = false;

    // Mark horizontal groups of 3+ by negating
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n - 2; c++) {
        const v = Math.abs(board[r][c]);
        if (v !== 0 && v === Math.abs(board[r][c + 1]) && v === Math.abs(board[r][c + 2])) {
          board[r][c] = -Math.abs(board[r][c]);
          board[r][c + 1] = -Math.abs(board[r][c + 1]);
          board[r][c + 2] = -Math.abs(board[r][c + 2]);
          crushed = true;
        }
      }
    }
    // Mark vertical groups of 3+
    for (let r = 0; r < m - 2; r++) {
      for (let c = 0; c < n; c++) {
        const v = Math.abs(board[r][c]);
        if (v !== 0 && v === Math.abs(board[r + 1][c]) && v === Math.abs(board[r + 2][c])) {
          board[r][c] = -Math.abs(board[r][c]);
          board[r + 1][c] = -Math.abs(board[r + 1][c]);
          board[r + 2][c] = -Math.abs(board[r + 2][c]);
          crushed = true;
        }
      }
    }
    if (!crushed) break;

    // Crush negatives → 0, then apply gravity per column
    for (let c = 0; c < n; c++) {
      let writeRow = m - 1;
      for (let r = m - 1; r >= 0; r--) {
        if (board[r][c] > 0) board[writeRow--][c] = board[r][c]; // keep positives
      }
      while (writeRow >= 0) board[writeRow--][c] = 0; // fill top with zeros
    }
  }
  return board;
}

// === Test Cases ===
const b1 = [
  [1, 3, 5, 5, 2],
  [3, 4, 3, 3, 1],
  [3, 2, 4, 5, 2],
  [2, 4, 4, 5, 5],
  [1, 4, 3, 2, 3],
];
console.log(JSON.stringify(candyCrush(b1)));
// [[1,3,0,0,0],[3,4,0,5,2],[3,2,0,3,1],[2,4,4,5,2],[1,4,3,2,3]]

const b2 = [[1, 1, 1]]; // single row horizontal match
console.log(JSON.stringify(candyCrush(b2)));
// [[0,0,0]]
```
