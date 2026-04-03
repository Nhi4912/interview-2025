---
layout: page
title: "Set Matrix Zeroes"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Matrix]
leetcode_url: "https://leetcode.com/problems/set-matrix-zeroes/"
leetcode_number: 73
pattern: "In-place Marker with First Row/Column"
frequency_tier: 2
companies: [Amazon, Microsoft, Google, Apple]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
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

## 🎯 Pattern Trigger / Nhận Dạng

| When you see... | Think... | Template |
|---|---|---|
| Zero entire row/col if cell is zero, O(1) space | Use first row and column as marker arrays | `scan interior → mark matrix[0][j] and matrix[i][0]; second pass apply; then handle first row/col` |
| In-place matrix update where new state depends on original values | Two-phase: mark phase then apply phase | Never modify while reading — mark first, apply second |
| "Can you do it in O(1) space?" after O(m+n) solution | Reuse existing matrix structure as scratch space | Find a part of the matrix that can encode the metadata (e.g. first row/col) |
| First row or first column itself might contain zero | Must save their original state before using them as markers | `firstRowZero = matrix[0].some(v => v === 0)` before any marking |

**Memory hook:** "Dùng hàng 0 và cột 0 làm 'bộ nhớ' — không cần mảng phụ"

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

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

> **Understand:** "I have an m×n matrix and whenever I find a zero I need to zero its entire row and column — in-place. Important constraint: modifications must be based on the original matrix, not on zeros I've added during processing. Let me also confirm: is O(1) space strictly required, or is O(m+n) acceptable?"

> **Match:** "The naive approach uses two boolean arrays of size m and n — O(m+n) space. To hit O(1), I can repurpose the first row and first column as those marker arrays, since they're already size n and m respectively."

> **Plan:** "Four phases: (1) Save whether the first row and first column originally contained any zero — two boolean flags. (2) Scan interior cells (i≥1, j≥1); if zero, set matrix[0][j]=0 and matrix[i][0]=0 as markers. (3) Use those markers to zero interior cells. (4) Apply the two saved booleans to zero the first row/col if needed."

> **Implement:** "I'll be careful to check `firstRowZero` and `firstColZero` before I start writing to matrix[0] and matrix[i][0] — that's the classic gotcha. Interior scan starts at i=1, j=1 to avoid corrupting the markers."

> **Review:** "Trace example 2: [[0,1,2,0],[3,4,5,2],[1,3,1,5]]. firstRowZero=true (matrix[0][0]=0), firstColZero=true. Interior scan: no additional zeros found. Phase 2: no interior markers. Phase 4: firstRowZero → zero row 0; firstColZero → zero col 0. Result: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]. Correct."

---

## 📝 Interview Tips

1. **Clarify**: Is O(1) space strictly required, or is O(m+n) acceptable? / VI: "Yêu cầu O(1) space thật sự, hay O(m+n) là chấp nhận được trong interview này?"
2. **Brute force**: Two boolean arrays (zeroRows, zeroCols) — scan once to mark, scan again to zero / VI: Hai mảng boolean để đánh dấu hàng và cột cần xóa, đơn giản và dễ implement
3. **Optimize**: Reuse first row/col as marker arrays — saves O(m+n) space / VI: Tận dụng hàng đầu và cột đầu làm flag, nhớ lưu trạng thái ban đầu của chúng trước
4. **Edge cases**: First row/col originally has zeros — must record this BEFORE using them as markers or you'll lose the info / VI: Đây là bug phổ biến nhất: dùng first row/col làm marker rồi mới check xem chúng có zero ban đầu không — sai thứ tự!
5. **Follow-up**: What if new zeroes created during processing should also propagate? (Game of Life) / VI: Nếu các zero mới tạo ra trong quá trình xử lý cũng cần lan truyền, cần kỹ thuật khác (lưu state gốc)

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| Mistake | Why it happens | Correct approach |
|---|---|---|
| Zeroing cells as you scan (not two-phase) | Modifying in the scan loop contaminates the matrix — zero-spreads to cells that should stay non-zero | Collect all original zero positions first (or mark via first row/col), then apply zeroes in a separate pass |
| Not saving whether row-0 or col-0 themselves had zeros | After using them as markers, you can no longer distinguish "was zero before" from "marked during scan" | Record `firstRowZero` and `firstColZero` with `.some()` checks before any writes to the matrix |
| Using O(m+n) extra arrays when O(1) is asked | Reaching for the obvious boolean array solution without considering reuse of the matrix | Use first row as column-marker array and first column as row-marker array — they're already the right sizes |

---

## Solutions

```typescript

/**

- Solution 1: Extra Boolean Arrays (Brute Force)
- Time: O(m * n) — two full scans of the matrix
- Space: O(m + n) — one array per dimension to track zero positions
  */
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

/**

- Solution 2: First Row/Col as Markers (Optimal — O(1) Space)
- Time: O(m * n) — four passes but all O(m*n)
- Space: O(1) — first row and col repurposed as flag storage
  */
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

```

---

## 🔗 Related Problems

- [Rotate Image](./11-rotate-image.md) — in-place matrix manipulation with two-phase approach
- [Game of Life](https://leetcode.com/problems/game-of-life/) — in-place state update, same two-phase technique
- [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/) — matrix traversal and index management
- [Number of Islands](https://leetcode.com/problems/number-of-islands/) — in-place marking pattern (DFS flood fill)

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric | Target | Your Result |
|---|---|---|
| Time to solve | ≤ 20 min | ___ min |
| Solution correctness | All test cases pass | ✅ / ❌ |
| Space complexity | O(1) | ___ |
| Explained out loud | Yes | ✅ / ❌ |

**SRS Schedule:** First review → 1 day · Second → 3 days · Third → 7 days · Then → 14 days

| Date | Attempt # | Time (min) | Confidence (1-5) | Notes |
|---|---|---|---|---|
| | | | | |
