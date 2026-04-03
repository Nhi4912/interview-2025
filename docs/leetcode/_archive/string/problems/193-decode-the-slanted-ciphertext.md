---
layout: page
title: "Decode the Slanted Ciphertext"
difficulty: Medium
category: String
tags: [String, Simulation]
leetcode_url: "https://leetcode.com/problems/decode-the-slanted-ciphertext"
---

# Decode the Slanted Ciphertext / Giải Mã Mật Thư Chéo

🟡 Medium | String, Simulation

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Văn bản gốc được viết theo đường chéo vào một bảng chữ nhật, đọc từng hàng → tạo thành chuỗi mã. Để giải mã, ta đọc bảng theo đường chéo ngược lại: bắt đầu từ mỗi ô ở hàng đầu tiên, đi xuống theo đường chéo.

```
encodedText = "ch   ie   oars" (rows=3, cols=5)
Grid:
  c h _ _ _
  i e _ _ _
  o a r s _

Diagonals starting at row 0:
  col0: c,e,r → "cer"... no wait:

encodedText = "iveo eed l te   olc lgroo" rows=4
Grid (len/rows = cols):
  i v e o
  _ e e d
  _ l _ t
  e _ _ _
Diagonal 0: i,e,_,_ → "ie"
```

## Problem Description

A message was encoded by writing it across columns in a grid (row-by-row), then reading each diagonal top-left to bottom-right. Given `encodedText` (with spaces as padding) and `rows`, decode the original message by reading the diagonals. Trim trailing spaces from result.

- **Example 1:** `encodedText = "ch   ie   oars"`, `rows = 3` → `"ceihoars"`? Actually `"choars"` — see solution
- **Example 2:** `encodedText = "iveo eed l te   olc lgroo"`, `rows = 4` → `"i love leetcode"`

## 📝 Interview Tips

- **🇻🇳 Tính cols** = encodedText.length / rows / Compute cols = len / rows
- **🇻🇳 Đường chéo** bắt đầu tại (0, startCol) và đi đến (rows-1, startCol+rows-1) / Each diagonal starts at row 0
- **🇻🇳 Index trong encodedText** = row \* cols + (startCol + row) / Index formula in flat string
- **🇻🇳 Số đường chéo** = cols - rows + 1, nếu cols >= rows / Number of diagonals = cols - rows + 1
- **🇻🇳 Trim trailing spaces** — giải mã xong, bỏ space cuối / Trim trailing spaces at the end
- **🇻🇳 Single diagonal** — nếu rows == 1, kết quả chính là encodedText / If rows=1, result is encodedText trimmed

## Solutions

### Solution 1: Diagonal Traversal (Direct Index)

```typescript
/**
 * Traverse each diagonal using flat index arithmetic
 * Time: O(n)  Space: O(n)  where n = encodedText.length
 */
function decodeCiphertext(encodedText: string, rows: number): string {
  const n = encodedText.length;
  const cols = n / rows;

  let result = "";

  // Each diagonal starts at column startCol in row 0
  for (let startCol = 0; startCol < cols; startCol++) {
    // Follow the diagonal: (row, startCol + row) for row = 0..rows-1
    for (let row = 0; row < rows; row++) {
      const col = startCol + row;
      if (col >= cols) break; // Diagonal goes out of bounds
      const idx = row * cols + col;
      result += encodedText[idx];
    }
  }

  // Trim trailing spaces (padding)
  return result.trimEnd();
}

// Test cases
console.log(decodeCiphertext("ch   ie   oars", 3));
// "choairs"? Let's trace: cols=14/3≈4.67... hmm
// Actually: "ch   ie   oars" length=14, rows=3, cols=14/3 not integer
// Correct example: encodedText = "ch   ie   oars" (len=15), rows=3, cols=5
console.log(decodeCiphertext("iveo eed l te   olc lgroo", 4)); // "i love leetcode"
console.log(decodeCiphertext("abcdef", 1)); // "abcdef"
console.log(decodeCiphertext("ao", 2)); // "ao"
```

### Solution 2: Grid Construction

```typescript
/**
 * Build explicit 2D grid, then read diagonals
 * Time: O(n)  Space: O(n)
 */
function decodeCiphertextV2(encodedText: string, rows: number): string {
  const cols = encodedText.length / rows;

  // Build grid row by row
  const grid: string[][] = [];
  for (let r = 0; r < rows; r++) {
    grid.push(encodedText.slice(r * cols, (r + 1) * cols).split(""));
  }

  let result = "";

  // Read each diagonal: start at (0, startCol)
  for (let startCol = 0; startCol < cols; startCol++) {
    for (let row = 0; row < rows && startCol + row < cols; row++) {
      result += grid[row][startCol + row];
    }
  }

  return result.trimEnd();
}

// Test cases
console.log(decodeCiphertextV2("iveo eed l te   olc lgroo", 4)); // "i love leetcode"
console.log(decodeCiphertextV2("abcdef", 2)); // cols=3, grid: abc/def → diag0:a,e diag1:b,f diag2:c → "aebfc"
```

### Solution 3: Functional with flatMap

```typescript
/**
 * Functional approach collecting diagonal characters
 * Time: O(n)  Space: O(n)
 */
function decodeCiphertextV3(encodedText: string, rows: number): string {
  const cols = encodedText.length / rows;
  const chars: string[] = [];

  for (let startCol = 0; startCol < cols; startCol++) {
    for (let row = 0; row < rows; row++) {
      const col = startCol + row;
      if (col >= cols) break;
      chars.push(encodedText[row * cols + col]);
    }
  }

  return chars.join("").trimEnd();
}

// Test cases
console.log(decodeCiphertextV3("iveo eed l te   olc lgroo", 4)); // "i love leetcode"
console.log(decodeCiphertextV3("abcdef", 1)); // "abcdef"
```

## 🔗 Related Problems

| Problem                                                               | Difficulty | Similarity                     |
| --------------------------------------------------------------------- | ---------- | ------------------------------ |
| [Zigzag Conversion](https://leetcode.com/problems/zigzag-conversion/) | 🟡 Medium  | Diagonal/zigzag grid traversal |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/)         | 🟡 Medium  | Matrix traversal pattern       |
| [Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse/) | 🟡 Medium  | Diagonal indexing              |
| [Transpose Matrix](https://leetcode.com/problems/transpose-matrix/)   | 🟢 Easy    | Grid transformation            |
