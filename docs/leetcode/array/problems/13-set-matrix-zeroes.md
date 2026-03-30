---
layout: page
title: "Set Matrix Zeroes"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Matrix]
leetcode_url: "https://leetcode.com/problems/set-matrix-zeroes/"
---

# Set Matrix Zeroes / Đặt Hàng Và Cột Về Không

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: In-Place Matrix Marking
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Rotate Image](./11-rotate-image.md) | [Game of Life](https://leetcode.com/problems/game-of-life/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang đánh dấu những khu vực cần dọn dẹp trên bản đồ. Thay vì mang theo cuốn sổ riêng để ghi tọa độ (O(m+n) space), bạn dùng ngay hàng đầu và cột đầu của bản đồ làm "nhãn dán". Nhưng phải cẩn thận: cần lưu lại trạng thái ban đầu của hàng đầu/cột đầu trước khi dùng chúng làm nhãn — nếu không sẽ nhầm lẫn giữa "ban đầu đã có 0" và "mới được đánh dấu".

**Pattern Recognition:**

- Signal: "in-place modification, if zero → zero entire row and col" → **Use first row/col as O(1) markers**
- Two-phase approach: mark first, apply zeroes second — never zero during marking phase
- Save `firstRowZero` and `firstColZero` before using them as flag arrays

**Visual — setZeroes([[1,1,1],[1,0,1],[1,1,1]]):**

```
Phase 0 — Record first row/col status:
  firstRowZero=false, firstColZero=false

Phase 1 — Scan interior (i≥1, j≥1), mark first row/col:
  Found 0 at [1][1] → set matrix[1][0]=0 and matrix[0][1]=0
  Matrix now:  [ 1  0  1 ]   ← first row used as col markers
               [ 0  0  1 ]   ← first col used as row markers
               [ 1  1  1 ]

Phase 2 — Zero interior cells based on markers:
  matrix[0][1]=0 → col 1: zero [1][1] and [2][1]
  matrix[1][0]=0 → row 1: zero [1][1] and [1][2]
  Result:      [ 1  0  1 ]
               [ 0  0  0 ]
               [ 1  0  1 ]

Phase 3 — Apply firstRowZero/firstColZero (both false → no change) ✅
```

---

## Problem Description

Given an m×n integer matrix, if any element is 0, set its entire row and column to 0. Must be done in-place.

```
Example 1: [[1,1,1],[1,0,1],[1,1,1]] → [[1,0,1],[0,0,0],[1,0,1]]
Example 2: [[0,1,2,0],[3,4,5,2],[1,3,1,5]] → [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
```

Constraints:

- 1 <= m, n <= 200
- -2^31 <= matrix[i][j] <= 2^31 - 1

---

## 📝 Interview Tips

1. **Clarify**: Is O(1) space strictly required, or is O(m+n) acceptable? / VI: "Yêu cầu O(1) space thật sự, hay O(m+n) là chấp nhận được trong interview này?"
2. **Brute force**: Two boolean arrays (zeroRows, zeroCols) — scan once to mark, scan again to zero / VI: Hai mảng boolean để đánh dấu hàng và cột cần xóa, đơn giản và dễ implement
3. **Optimize**: Reuse first row/col as marker arrays — saves O(m+n) space / VI: Tận dụng hàng đầu và cột đầu làm flag, nhớ lưu trạng thái ban đầu của chúng trước
4. **Edge cases**: First row/col originally has zeros — must record this BEFORE using them as markers or you'll lose the info / VI: Đây là bug phổ biến nhất: dùng first row/col làm marker rồi mới check xem chúng có zero ban đầu không — sai thứ tự!
5. **Follow-up**: What if new zeroes created during processing should also propagate? (Game of Life) / VI: Nếu các zero mới tạo ra trong quá trình xử lý cũng cần lan truyền, cần kỹ thuật khác (lưu state gốc)

---

## Solutions

{% raw %}

/\*\*

- Solution 1: Extra Boolean Arrays (Brute Force)
- Time: O(m \* n) — two full scans of the matrix
- Space: O(m + n) — one array per dimension to track zero positions
  \*/
  function setZeroesBrute(matrix: number[][]): void {
  const m = matrix.length, n = matrix[0].length;
  const zeroRows = new Array(m).fill(false);
  const zeroCols = new Array(n).fill(false);

// First pass: record which rows and cols contain zero
for (let i = 0; i < m; i++) {
for (let j = 0; j < n; j++) {
if (matrix[i][j] === 0) { zeroRows[i] = true; zeroCols[j] = true; }
}
}

// Second pass: apply zeroes
for (let i = 0; i < m; i++) {
for (let j = 0; j < n; j++) {
if (zeroRows[i] || zeroCols[j]) matrix[i][j] = 0;
}
}
}

/\*\*

- Solution 2: First Row/Col as Markers (Optimal — O(1) Space)
- Time: O(m * n) — four passes but all O(m*n)
- Space: O(1) — first row and col repurposed as flag storage
  \*/
  function setZeroes(matrix: number[][]): void {
  const m = matrix.length, n = matrix[0].length;

// Save original zero status of first row and col BEFORE using them as markers
const firstRowZero = matrix[0].some(v => v === 0);
const firstColZero = matrix.some(row => row[0] === 0);

// Phase 1: Use first row/col as markers for interior cells (i≥1, j≥1)
for (let i = 1; i < m; i++) {
for (let j = 1; j < n; j++) {
if (matrix[i][j] === 0) {
matrix[i][0] = 0; // mark this row
matrix[0][j] = 0; // mark this col
}
}
}

// Phase 2: Zero interior cells based on markers
for (let i = 1; i < m; i++) {
for (let j = 1; j < n; j++) {
if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
}
}

// Phase 3: Zero first row and col based on saved flags
if (firstRowZero) for (let j = 0; j < n; j++) matrix[0][j] = 0;
if (firstColZero) for (let i = 0; i < m; i++) matrix[i][0] = 0;
}

// === Test Cases ===
const t1 = [[1,1,1],[1,0,1],[1,1,1]];
setZeroes(t1);
console.log(t1); // [[1,0,1],[0,0,0],[1,0,1]]

const t2 = [[0,1,2,0],[3,4,5,2],[1,3,1,5]];
setZeroes(t2);
console.log(t2); // [[0,0,0,0],[0,4,5,0],[0,3,1,0]]

const t3 = [[1]];
setZeroes(t3);
console.log(t3); // [[1]] (no zeros, no change)

{% endraw %}

---

## 🔗 Related Problems

- [Rotate Image](./11-rotate-image.md) — in-place matrix manipulation with two-phase approach
- [Game of Life](https://leetcode.com/problems/game-of-life/) — in-place state update, same two-phase technique
- [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/) — matrix traversal and index management
- [Number of Islands](https://leetcode.com/problems/number-of-islands/) — in-place marking pattern (DFS flood fill)
