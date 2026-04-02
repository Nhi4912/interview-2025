---
layout: page
title: "Count Square Submatrices with All Ones"
difficulty: Medium
category: DP
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/count-square-submatrices-with-all-ones"
---

# Count Square Submatrices with All Ones / Đếm Số Hình Vuông Con Toàn Số 1

> **Track**: DP | **Difficulty**: 🟡 Medium | **Pattern**: 2D DP / Maximal Square
> **Frequency**: 📗 Tier 2 — Gặp ở nhiều companies
> **See also**: [Maximal Square](https://leetcode.com/problems/maximal-square) | [Count Submatrices With All Ones](https://leetcode.com/problems/count-submatrices-with-all-ones)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đang lát gạch một căn phòng, mỗi ô là 1 nếu có gạch và 0 nếu trống. Câu hỏi: có bao nhiêu vùng hình vuông (1×1, 2×2, 3×3, …) được lát đầy đủ? Thay vì kiểm tra từng ô từng kích thước (O(n³)), ta tận dụng kết quả ô trước: nếu ô `(i,j)` có gạch, hình vuông lớn nhất kết thúc tại đây bằng `min(trên, trái, chéo-trái-trên) + 1`. Số hình vuông kết thúc tại `(i,j)` chính là giá trị đó — một viên gạch đóng góp cho TẤT CẢ các hình vuông chứa nó như góc dưới-phải.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Count Square Submatrices with All Ones example:**

```
matrix:           dp[i][j] = min(top, left, diag) + 1
1 0 1             1 0 1   ← each cell = largest square ending here
1 1 1    →        1 1 1
1 1 1             1 2 2

dp values: 1,0,1, 1,1,1, 1,2,2
sum = 1+0+1+1+1+1+1+2+2 = 10

dp[2][1]=2 → 2 squares ending there (1×1 and 2×2)
dp[2][2]=2 → 2 squares ending there (1×1 and 2×2)
Total = sum(dp) = 10 ✓
```

---

## Problem Description

Given an `m × n` matrix of `0`s and `1`s, return the **number of square submatrices that have all ones**.

**Example 1:** `matrix = [[0,1,1,1],[1,1,1,1],[0,1,1,1]]` → `15`
**Example 2:** `matrix = [[1,0,1],[1,1,0],[1,1,0]]` → `7`

**Constraints:** `1 ≤ m, n ≤ 300`, `matrix[i][j]` is `0` or `1`

---

## 📝 Interview Tips

- **dp[i][j] meaning** / Ý nghĩa: Kích thước hình vuông lớn nhất có góc dưới-phải tại `(i,j)`
- **Reuse dp matrix** / Tái dụng: Có thể sửa tại chỗ trên `matrix` để tiết kiệm O(m×n) space
- **Count = sum of dp** / Đếm = tổng dp: Mỗi ô đóng góp đúng bằng giá trị dp của nó vào tổng
- **In-place possible** / Sửa tại chỗ: `matrix[i][j] = min(top,left,diag)+1` — không cần mảng mới
- **First row/col** / Hàng/cột đầu: Giữ nguyên (0 hoặc 1) — không cần kiểm tra bound đặc biệt
- **Same as Maximal Square** / Giống Maximal Square: Chỉ khác ở chỗ trả về tổng thay vì max

---

## Solutions

```typescript
/**
 * @complexity Time: O(min(m,n)·m·n) | Space: O(1)
 * For each cell, try all square sizes and check if all-ones
 */
function countSquaresBrute(matrix: number[][]): number {
  const m = matrix.length,
    n = matrix[0].length;
  let count = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      for (let s = 1; s <= Math.min(m - i, n - j); s++) {
        let valid = true;
        outer: for (let r = i; r < i + s; r++) {
          for (let c = j; c < j + s; c++) {
            if (matrix[r][c] === 0) {
              valid = false;
              break outer;
            }
          }
        }
        if (valid) count++;
        else break;
      }
    }
  }
  return count;
}

/**
 * @complexity Time: O(m·n) | Space: O(1) in-place
 * dp[i][j] = largest square with bottom-right at (i,j)
 * Count = sum of all dp values (each cell contributes dp[i][j] squares)
 */
function countSquares(matrix: number[][]): number {
  const m = matrix.length,
    n = matrix[0].length;
  let count = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 1 && i > 0 && j > 0) {
        matrix[i][j] = Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]) + 1;
      }
      count += matrix[i][j];
    }
  }
  return count;
}

/**
 * @complexity Time: O(m·n) | Space: O(m·n)
 * Same DP logic but preserves original matrix
 */
function countSquaresDP(matrix: number[][]): number {
  const m = matrix.length,
    n = matrix[0].length;
  const dp = Array.from({ length: m }, (_, i) => [...matrix[i]]);
  let count = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (dp[i][j] === 1 && i > 0 && j > 0) {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
      count += dp[i][j];
    }
  }
  return count;
}

// === Test Cases ===
console.log(
  countSquares([
    [0, 1, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 1],
  ]),
); // → 15
console.log(
  countSquares([
    [1, 0, 1],
    [1, 1, 0],
    [1, 1, 0],
  ]),
); // → 7
console.log(
  countSquaresBrute([
    [0, 1, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 1],
  ]),
); // → 15
console.log(
  countSquaresDP([
    [1, 1],
    [1, 1],
  ]),
); // → 5
console.log(countSquares([[1]])); // → 1
```

---

## 🔗 Related Problems

| Problem                         | Difficulty | Link                                                                     |
| ------------------------------- | ---------- | ------------------------------------------------------------------------ |
| Maximal Square                  | Medium     | [LC 221](https://leetcode.com/problems/maximal-square)                   |
| Count Submatrices With All Ones | Medium     | [LC 1504](https://leetcode.com/problems/count-submatrices-with-all-ones) |
| Maximal Rectangle               | Hard       | [LC 85](https://leetcode.com/problems/maximal-rectangle)                 |
