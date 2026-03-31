---
layout: page
title: "Rotate Image"
difficulty: Medium
category: Array
tags: [Array, Math, Matrix]
leetcode_url: "https://leetcode.com/problems/rotate-image/"
---

# Rotate Image / Xoay Ma Trận Ảnh 90 Độ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Matrix Transformation (Transpose + Reverse)
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Set Matrix Zeroes](./13-set-matrix-zeroes.md) | [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Xoay một tờ giấy 90° theo chiều kim đồng hồ — bạn có thể làm điều này bằng hai bước: đầu tiên lật tờ giấy dọc theo đường chéo chính (transpose), sau đó lật ngang (reverse mỗi hàng). Hai thao tác đơn giản kết hợp cho ra kết quả xoay hoàn hảo mà không cần thêm tờ giấy mới (in-place, O(1) space).

**Pattern Recognition:**

- Signal: "rotate 90° in-place, n×n matrix" → **Transpose then reverse each row**
- Math insight: after 90° CW rotation, `result[j][n-1-i] = original[i][j]`
- This equals: transpose (`matrix[i][j] ↔ matrix[j][i]`) then reverse each row

**Visual — Rotate [[1,2,3],[4,5,6],[7,8,9]] 90° clockwise:**

```
Original:        Step 1 — Transpose:      Step 2 — Reverse rows:
[ 1  2  3 ]      [ 1  4  7 ]              [ 7  4  1 ]
[ 4  5  6 ]  →   [ 2  5  8 ]      →       [ 8  5  2 ]
[ 7  8  9 ]      [ 3  6  9 ]              [ 9  6  3 ]  ✅

Transpose swaps (i,j) ↔ (j,i) for upper triangle only (j > i):
  (0,1)↔(1,0): 2↔4  |  (0,2)↔(2,0): 3↔7  |  (1,2)↔(2,1): 6↔8

Each row then reversed: [1,4,7]→[7,4,1], [2,5,8]→[8,5,2], [3,6,9]→[9,6,3]
```

---

## Problem Description

Given an n×n 2D matrix representing an image, rotate it 90° clockwise in-place. Do NOT allocate a second matrix.

```
Example 1: [[1,2,3],[4,5,6],[7,8,9]] → [[7,4,1],[8,5,2],[9,6,3]]
Example 2: [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
           → [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]
```

Constraints:

- n == matrix.length == matrix[i].length
- 1 <= n <= 20, -1000 <= matrix[i][j] <= 1000

---

## 📝 Interview Tips

1. **Clarify**: Always clockwise? Could it be counter-clockwise or 180°? / VI: "Xoay chiều nào? Clockwise, counter-clockwise hay 180°?"
2. **Brute force**: Allocate a new matrix, copy using `rotated[j][n-1-i] = original[i][j]`, then copy back / VI: Tạo ma trận copy, áp công thức mapping trực tiếp, rồi ghi đè lại ma trận gốc
3. **Optimize**: In-place transpose then reverse — no extra space, works because n×n is square / VI: Transpose trước (đổi chỗ phần tử đối xứng qua đường chéo), rồi reverse từng hàng — chỉ cần n² swaps
4. **Edge cases**: 1×1 matrix is a no-op; 2×2 has only one transpose pair / VI: Ma trận 1×1 không cần làm gì; với 2×2 chỉ có một cặp cần hoán đổi khi transpose
5. **Follow-up**: Counter-clockwise rotation? (Reverse each row first, then transpose) / VI: Xoay ngược chiều: reverse hàng trước rồi mới transpose — thứ tự ngược lại

---

## Solutions

```typescript

/**

- Solution 1: Extra Space Copy (Brute Force)
- Time: O(n²) — visit every element twice
- Space: O(n²) — copy matrix for reference
  */
  function rotateBrute(matrix: number[][]): void {
  const n = matrix.length;
  const copy = matrix.map(row => [...row]);
  for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
  matrix[j][n - 1 - i] = copy[i][j]; // rotated position formula
  }
  }
  }

/**

- Solution 2: Transpose + Reverse Each Row (Optimal — In-Place)
- Time: O(n²) — transpose is n²/2 swaps, reverse is n²/2 swaps
- Space: O(1) — all swaps done in-place, no extra memory
  */
  function rotate(matrix: number[][]): void {
  const n = matrix.length;

// Step 1: Transpose — swap elements across the main diagonal
for (let i = 0; i < n; i++) {
for (let j = i + 1; j < n; j++) {
[matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
}
}

// Step 2: Reverse each row
for (let i = 0; i < n; i++) {
matrix[i].reverse();
}
}

// === Test Cases ===
const m1 = [[1,2,3],[4,5,6],[7,8,9]];
rotate(m1);
console.log(m1); // [[7,4,1],[8,5,2],[9,6,3]]

const m2 = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]];
rotate(m2);
console.log(m2); // [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]

const m3 = [[1]];
rotate(m3);
console.log(m3); // [[1]] (no-op for 1×1)

```

---

## 🔗 Related Problems

- [Set Matrix Zeroes](./13-set-matrix-zeroes.md) — in-place matrix modification with markers
- [Transpose Matrix](https://leetcode.com/problems/transpose-matrix/) — core operation used in Solution 2
- [Spiral Matrix](https://leetcode.com/problems/spiral-matrix/) — matrix traversal by layer pattern
- [Rotate Array](https://leetcode.com/problems/rotate-array/) — same rotation concept on 1D array
