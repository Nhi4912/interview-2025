---
layout: page
title: "Valid Sudoku"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Matrix]
leetcode_url: "https://leetcode.com/problems/valid-sudoku/"
---

# Valid Sudoku / Kiểm Tra Bảng Sudoku Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Set Validation — 3-Constraint Check
> **Frequency**: 📘 Tier 1 — FAANG staple; thường xuất hiện ở vòng onsite, kiểm tra kỹ năng index 2D
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Sudoku Solver #37](https://leetcode.com/problems/sudoku-solver/)

## 🧠 Intuition / Tư Duy

- **Analogy:** Bảng Sudoku có 3 loại "vùng kiểm tra" độc lập: hàng ngang, cột dọc và ô 3×3. Hãy tưởng tượng mỗi vùng là một hộp đựng bi — mỗi số chỉ được có một viên bi mang số đó trong cùng một hộp. Nhiệm vụ là kiểm tra xem có hộp nào chứa hai viên bi cùng số không.

- **Pattern Recognition:**
  - 3 ràng buộc độc lập (row, col, box) → cần 3 tập Set song song
  - Box index từ (i, j): `boxIndex = ⌊i/3⌋ * 3 + ⌊j/3⌋` — công thức quan trọng cần nhớ
  - Single-pass với bit mask: mỗi số 1-9 map vào bit → kiểm tra collision bằng AND

- **Visual — Box Index Formula:**
  ```
  Bảng 9×9 chia thành 9 ô 3×3 (đánh số 0-8):
  ┌─────┬─────┬─────┐
  │  0  │  1  │  2  │   row i=0..2,  col j=0..2  → box 0
  │     │     │     │   row i=0..2,  col j=3..5  → box 1
  ├─────┼─────┼─────┤
  │  3  │  4  │  5  │   Formula: box = floor(i/3)*3 + floor(j/3)
  ├─────┼─────┼─────┤
  │  6  │  7  │  8  │   (i=4, j=7) → floor(4/3)*3 + floor(7/3) = 3+2 = 5 ✅
  └─────┴─────┴─────┘
  ```

## Problem Description

Xác định xem bảng Sudoku 9×9 có hợp lệ hay không. Chỉ cần kiểm tra các ô đã điền (`.` là ô trống).

**3 quy tắc:** (1) Mỗi hàng chứa chữ số 1-9 không trùng. (2) Mỗi cột chứa chữ số 1-9 không trùng. (3) Mỗi ô 3×3 chứa chữ số 1-9 không trùng.

| Board                    | Output  | Lý do                  |
| ------------------------ | ------- | ---------------------- |
| Board hợp lệ chuẩn       | `true`  | Không vi phạm quy tắc  |
| Có `"8"` trùng ở cột đầu | `false` | Vi phạm quy tắc cột    |
| Toàn `.`                 | `true`  | Board rỗng luôn hợp lệ |

## 📝 Interview Tips

- 🇻🇳 Công thức box index `⌊i/3⌋*3 + ⌊j/3⌋` là điểm dễ sai nhất — viết ra giấy trước / 🇬🇧 _Box index formula is the most error-prone part — derive it explicitly_
- 🇻🇳 Board kích thước cố định 9×9 → O(81) = O(1) về mặt lý thuyết / 🇬🇧 _Board is fixed 9×9 → technically O(1) time and space_
- 🇻🇳 Phân biệt: "valid" ≠ "solvable" — đề không yêu cầu giải Sudoku / 🇬🇧 _"Valid" ≠ "solvable" — only check existing digits, not completeness_
- 🇻🇳 Bit manipulation (Solution 2) dùng ít bộ nhớ hơn nhưng khó đọc hơn / 🇬🇧 _Bit mask uses less memory but reduces readability — explain trade-off_
- 🇻🇳 Single-pass duyệt 81 ô một lần duy nhất — đây là cách tối ưu nhất / 🇬🇧 _Single-pass over 81 cells is the cleanest optimal approach_
- 🇻🇳 Hỏi: interviewer muốn dễ đọc hay tối ưu memory? → chọn solution phù hợp / 🇬🇧 _Ask: readability vs memory efficiency? Then pick the right solution_

## Solutions

```typescript
/**

- Solution 1: Single-Pass — Three Sets in Parallel (Readable)
- Duyệt 81 ô một lần. Mỗi iteration i kiểm tra hàng i, cột i và box i song song.
- Trick: dùng cùng biến j để index cả row, col và box cùng lúc.
-
- @time O(81) = O(1) — fixed 9×9 board
- @space O(27) = O(1) — 3 Sets × tối đa 9 phần tử mỗi Set
  */
  function isValidSudoku(board: string[][]): boolean {
  for (let i = 0; i < 9; i++) {
  const rowSet = new Set<string>();
  const colSet = new Set<string>();
  const boxSet = new Set<string>();

      for (let j = 0; j < 9; j++) {
        // Check row i
        if (board[i][j] !== ".") {
          if (rowSet.has(board[i][j])) return false;
          rowSet.add(board[i][j]);
        }
        // Check col i (swap i↔j to traverse column)
        if (board[j][i] !== ".") {
          if (colSet.has(board[j][i])) return false;
          colSet.add(board[j][i]);
        }
        // Check box i: map (i,j) → actual grid coordinates
        const r = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        const c = (i % 3) * 3 + (j % 3);
        if (board[r][c] !== ".") {
          if (boxSet.has(board[r][c])) return false;
          boxSet.add(board[r][c]);
        }
      }

  }
  return true;
  }

// isValidSudoku(validBoard) → true
// isValidSudoku(invalidBoard) → false (duplicate in row/col/box)
// isValidSudoku(emptyBoard) → true (all ".")

/**

- Solution 2: Single-Pass — Bit Manipulation (Memory-Optimal)
- Thay Set bằng integer bit mask: bit k = số (k) đã xuất hiện hay chưa.
- Int32Array(9) cho rows/cols/boxes → chỉ 27 integers tổng cộng.
-
- @time O(81) = O(1)
- @space O(27) = O(1) — 3 arrays × 9 integers, không allocate Set objects
  */
  function isValidSudokuBits(board: string[][]): boolean {
  const rows = new Int32Array(9);
  const cols = new Int32Array(9);
  const boxes = new Int32Array(9);

for (let i = 0; i < 9; i++) {
for (let j = 0; j < 9; j++) {
if (board[i][j] === ".") continue;

      const bit = 1 << parseInt(board[i][j]); // bit position for digit 1-9
      const box = Math.floor(i / 3) * 3 + Math.floor(j / 3);

      if ((rows[i] & bit) || (cols[j] & bit) || (boxes[box] & bit)) return false;

      rows[i] |= bit;
      cols[j] |= bit;
      boxes[box] |= bit;
    }

}
return true;
}

// isValidSudokuBits(validBoard) → true
// isValidSudokuBits(invalidBoard) → false
```

## 🔗 Related Problems

- [37. Sudoku Solver](https://leetcode.com/problems/sudoku-solver/) — bước tiếp theo: backtracking để giải bảng
- [36. Valid Sudoku](https://leetcode.com/problems/valid-sudoku/) — bài này (tự tham chiếu để bookmark)
- [51. N-Queens](https://leetcode.com/problems/n-queens/) — cùng kỹ thuật kiểm tra ràng buộc nhiều chiều
- [73. Set Matrix Zeroes](https://leetcode.com/problems/set-matrix-zeroes/) — cùng kỹ năng index 2D và in-place
