---
layout: page
title: "ZigZag Conversion"
difficulty: Medium
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/zigzag-conversion/"
---

# ZigZag Conversion / Chuyển Đổi ZigZag

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Simulation / Row Assignment
> **Frequency**: 📘 Tier 3 — Occasional in Amazon, good test of index math vs simulation
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Longest Common Prefix](08-longest-common-prefix.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Giống như khi bạn viết các chữ cái lên nhiều dòng theo hình sóng xuống-lên — mỗi chữ rơi vào một hàng, khi xuống đến hàng cuối thì đổi chiều lên, khi lên đến hàng đầu thì đổi chiều xuống. Sau đó ghép từng hàng lại từ trên xuống dưới là ra kết quả.

- **Pattern Recognition:**
  - Phân phối ký tự vào hàng theo chiều đi xuống/lên → **Simulation** với mảng rows + direction flag
  - Biết trước vị trí hàng bằng công thức toán → **Cycle Math** O(n) không cần direction flag
  - Khi `numRows = 1` hoặc `numRows >= s.length` → trả lại chuỗi gốc ngay

- **Visual — "PAYPALISHIRING" with numRows = 3:**

  ```
  Direction: ↓ until last row, ↑ until row 0

  P . . A . . H . . N       ← Row 0
  . A . P . L . S . I . I . G  ← Row 1
  . . Y . . I . . R         ← Row 2

  Step-by-step (char → row):
  P→0  A→1  Y→2  P→1  A→0  L→1  I→2  S→1  H→0  I→1  R→2  I→1  N→0  G→1

  Row 0: "P A H N"   → "PAHN"
  Row 1: "A P L S I I G" → "APLSIIG"
  Row 2: "Y I R"     → "YIR"

  Output: "PAHNAPLSIIGYIR"
  ```

## Problem Description

Write `"PAYPALISHIRING"` in a zigzag pattern on `numRows` rows, then read row by row.

```
Input: s="PAYPALISHIRING", numRows=3  → Output: "PAHNAPLSIIGYIR"
Input: s="PAYPALISHIRING", numRows=4  → Output: "PINALSIGYAHRPI"
Input: s="A",              numRows=1  → Output: "A"
```

## 📝 Interview Tips

1. **Edge case first / Biên trước**: `numRows === 1` or `numRows >= s.length` → return `s` unchanged.
2. **Direction flag trick / Mẹo cờ chiều**: Use `direction = 1 | -1`; flip only at row 0 and row `numRows - 1`. Clean O(n) with no modular arithmetic.
3. **Cycle-math alternative / Biến thể công thức chu kỳ**: `cycleLen = 2*(numRows-1)`; row of char `i` = `pos = i % cycleLen; row = pos < numRows ? pos : cycleLen - pos`. Shows mathematical thinking.
4. **Space is O(n) unavoidably / Không thể tránh O(n)**: Output string itself is length n, so row buffers add no asymptotic overhead.
5. **Don't simulate the 2D grid / Không mô phỏng lưới 2D**: Allocating a full matrix wastes space; only the row strings are needed.

## Solutions

```typescript
/**

- ZigZag Conversion
- https://leetcode.com/problems/zigzag-conversion/
  */

/**

- Solution 1: Row Simulation with Direction Flag (Standard)
- Assign each character to its row; flip direction at boundaries.
- Time O(n) | Space O(n)
  */
  function convert(s: string, numRows: number): string {
  if (numRows === 1 || numRows >= s.length) return s;

const rows: string[] = new Array(numRows).fill("");
let row = 0;
let dir = 1; // 1 = going down, -1 = going up

for (const ch of s) {
rows[row] += ch;
if (row === 0) dir = 1;
else if (row === numRows - 1) dir = -1;
row += dir;
}

return rows.join("");
}

/**

- Solution 2: Cycle-Math (no direction flag)
- Compute each character's row from its position in the cycle.
- Time O(n) | Space O(n) — no mutable direction state
  */
  function convertMath(s: string, numRows: number): string {
  if (numRows === 1 || numRows >= s.length) return s;

const cycleLen = 2 * (numRows - 1);
const rows: string[] = new Array(numRows).fill("");

for (let i = 0; i < s.length; i++) {
const pos = i % cycleLen;
const row = pos < numRows ? pos : cycleLen - pos;
rows[row] += s[i];
}

return rows.join("");
}

// Inline tests
console.log(convert("PAYPALISHIRING", 3)); // "PAHNAPLSIIGYIR"
console.log(convert("PAYPALISHIRING", 4)); // "PINALSIGYAHRPI"
console.log(convertMath("PAYPALISHIRING", 3)); // "PAHNAPLSIIGYIR"
console.log(convertMath("A", 1)); // "A"
```

## 🔗 Related Problems

- [942. DI String Match](https://leetcode.com/problems/di-string-match/) — Simulation with direction-based assignment
- [1324. Print Words Vertically](https://leetcode.com/problems/print-words-vertically/) — Row/column matrix construction
- [498. Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse/) — Direction-flip simulation in 2D
- [38. Count and Say](https://leetcode.com/problems/count-and-say/) — String construction via sequential rules
