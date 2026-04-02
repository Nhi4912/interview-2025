---
layout: page
title: "Transform to Chessboard"
difficulty: Hard
category: Array
tags: [Array, Math, Bit Manipulation, Matrix]
leetcode_url: "https://leetcode.com/problems/transform-to-chessboard"
---

# Transform to Chessboard / Biến Đổi Thành Bàn Cờ

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VN:** Bàn cờ hợp lệ chỉ có 2 loại hàng (đảo của nhau). Kiểm tra tính hợp lệ bằng XOR. Đếm số vị trí sai so với mẫu `i%2` để tính số lần hoán đổi cần thiết cho hàng và cột.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Transform to Chessboard example:**

```
Chessboard pattern A:  1 0 1 0     Pattern B:  0 1 0 1
                        0 1 0 1                 1 0 1 0

Key validity check: board[i][j] XOR board[0][0]
                  = board[i][0] XOR board[0][j]
```

---

---

## Problem Description

| Problem                                                                                                                                       | Difficulty | Pattern           |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------- |
| [Valid Sudoku](https://leetcode.com/problems/valid-sudoku/)                                                                                   | 🟡 Medium  | Matrix Validation |
| [Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/) | 🔴 Hard    | Sorting           |
| [Flip Columns For Maximum Number of Equal Rows](https://leetcode.com/problems/flip-columns-for-maximum-number-of-equal-rows/)                 | 🟡 Medium  | Hashing           |

---

## 📝 Interview Tips

- 🇻🇳 Điều kiện hợp lệ: `board[i][j] ^ board[0][0] == board[i][0] ^ board[0][j]` với mọi i, j.
- 🇺🇸 Validity: `board[i][j] ^ board[0][0] == board[i][0] ^ board[0][j]` for all i, j.
- 🇻🇳 Số lần hoán đổi = số vị trí sai / 2 (mỗi swap sửa 2 vị trí).
- 🇺🇸 Swaps = mismatches / 2 — one swap fixes exactly 2 mismatched positions.
- 🇻🇳 Với n lẻ, số vị trí sai phải chẵn; với n chẵn, chọn min(mis, n-mis).
- 🇺🇸 For odd n, mismatch count must be even; for even n take min(mis, n-mis).

---

---

## Solutions

```typescript
/**
 * Validate board structure, then count row/col mismatches to compute min swaps.
 * Time: O(n²) | Space: O(1)
 */
function movesToChessboard(board: number[][]): number {
  const n = board.length;

  // Validity check: all 2x2 sub-squares must sum to 0, 2, or 4 → XOR rule
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if ((board[i][j] ^ board[0][0] ^ board[i][0] ^ board[0][j]) !== 0) {
        return -1;
      }
    }
  }

  // Count 1s in first row and first col
  let rowOnes = 0,
    colOnes = 0;
  let rowMis = 0,
    colMis = 0; // mismatches vs pattern i%2

  for (let i = 0; i < n; i++) {
    rowOnes += board[0][i];
    colOnes += board[i][0];
    if (board[i][0] !== i % 2) rowMis++;
    if (board[0][i] !== i % 2) colMis++;
  }

  // Each row/col must have floor(n/2) or ceil(n/2) ones
  if (Math.abs(2 * rowOnes - n) > 1 || Math.abs(2 * colOnes - n) > 1) {
    return -1;
  }

  if (n % 2 === 1) {
    // For odd n, mismatch count must be even; fix by taking n-mis if odd
    if (rowMis % 2 === 1) rowMis = n - rowMis;
    if (colMis % 2 === 1) colMis = n - colMis;
  } else {
    // For even n, both patterns are valid; take whichever needs fewer swaps
    rowMis = Math.min(rowMis, n - rowMis);
    colMis = Math.min(colMis, n - colMis);
  }

  // Each swap fixes 2 mismatches
  return (rowMis + colMis) / 2;
}

console.log(
  movesToChessboard([
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ]),
); // 2
console.log(
  movesToChessboard([
    [0, 1],
    [1, 0],
  ]),
); // 0
console.log(
  movesToChessboard([
    [1, 0],
    [1, 0],
  ]),
); // -1

/**
 * Represent rows as bitmasks for compact comparison; same logic.
 * Time: O(n²) | Space: O(n)
 */
function movesToChessboard2(board: number[][]): number {
  const n = board.length;
  const rowMasks: number[] = board.map((row) => row.reduce((mask, v, j) => mask | (v << j), 0));

  // Only two distinct row patterns allowed (and they must be complements)
  const mask0 = rowMasks[0];
  const complement = ((1 << n) - 1) ^ mask0;

  for (const m of rowMasks) {
    if (m !== mask0 && m !== complement) return -1;
  }

  // Check columns similarly via first-row and first-col sums
  let rowOnes = 0,
    colOnes = 0,
    rowMis = 0,
    colMis = 0;
  for (let i = 0; i < n; i++) {
    rowOnes += board[0][i];
    colOnes += board[i][0];
    if (board[i][0] !== i % 2) rowMis++;
    if (board[0][i] !== i % 2) colMis++;
  }

  if (Math.abs(2 * rowOnes - n) > 1 || Math.abs(2 * colOnes - n) > 1) return -1;

  if (n % 2 === 1) {
    if (rowMis % 2 === 1) rowMis = n - rowMis;
    if (colMis % 2 === 1) colMis = n - colMis;
  } else {
    rowMis = Math.min(rowMis, n - rowMis);
    colMis = Math.min(colMis, n - colMis);
  }

  return (rowMis + colMis) / 2;
}

console.log(
  movesToChessboard2([
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ]),
); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                                                       | Difficulty | Pattern           |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------- |
| [Valid Sudoku](https://leetcode.com/problems/valid-sudoku/)                                                                                   | 🟡 Medium  | Matrix Validation |
| [Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/) | 🔴 Hard    | Sorting           |
| [Flip Columns For Maximum Number of Equal Rows](https://leetcode.com/problems/flip-columns-for-maximum-number-of-equal-rows/)                 | 🟡 Medium  | Hashing           |
