---
layout: page
title: "Spiral Matrix"
difficulty: Medium
category: Array
tags: [Array, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/spiral-matrix"
---

# Spiral Matrix / Duyệt Ma Trận Xoắn Ốc

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Matrix Boundary Shrink
> **Frequency**: ⭐ Tier 2 — Gặp ở 45+ companies
> **See also**: [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii) | [Rotate Image](https://leetcode.com/problems/rotate-image)

---

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng bạn đang bóc vỏ hành tây theo vòng xoắn — mỗi vòng ngoài bóc xong thì co lại, bóc vòng trong tiếp. Mỗi lần đi qua 4 cạnh (trên→phải→dưới→trái), bạn thu hẹp 4 biên vào trong.

- **Pattern Recognition:**
  - Signal: "matrix traversal" + "order matters" → **4-boundary shrink simulation**
  - Sau mỗi vòng: `top++`, `bottom--`, `left++`, `right--`
  - Dừng khi `top > bottom` hoặc `left > right`

- **Visual — 3×3 matrix, step-by-step:**

```
matrix:           top=0, bottom=2, left=0, right=2
 1  2  3
 4  5  6
 7  8  9

Step 1: Go RIGHT along top row (row=0): 1,2,3  → top=1
Step 2: Go DOWN along right col (col=2): 6,9   → right=1
Step 3: Go LEFT along bottom row (row=2): 8,7  → bottom=1
Step 4: Go UP along left col (col=0): 4        → left=1
Step 5: top=1,bottom=1,left=1,right=1 → Go RIGHT: 5
Result: [1,2,3,6,9,8,7,4,5] ✓
```

---

## Problem Description

Given an `m × n` matrix, return all elements in **spiral order** (clockwise from top-left).
Traverse outer ring first, then shrink inward until all elements are collected.

```
Input:  [[1,2,3],[4,5,6],[7,8,9]]     → [1,2,3,6,9,8,7,4,5]
Input:  [[1,2,3,4],[5,6,7,8],[9,10,11,12]] → [1,2,3,4,8,12,11,10,9,5,6,7]
Input:  [[1]]                          → [1]
```

Constraints: `m, n ∈ [1, 10]`, values fit in 32-bit int.

---

## 📝 Interview Tips

1. **Vẽ hình trước**: Vẽ ví dụ 3×3 và trace qua trước khi code / **Draw it first**: trace a 3×3 example before touching keyboard
2. **4 biên riêng biệt**: `top`, `bottom`, `left`, `right` — tách biệt giúp logic rõ ràng / **4 separate boundaries** prevent off-by-one errors
3. **Thu hẹp ngay sau mỗi chiều**: Tăng/giảm biên ngay sau khi duyệt xong chiều đó / **Shrink immediately** after each direction to avoid revisiting
4. **Check sau mỗi chiều**: Sau RIGHT check `top <= bottom`; sau DOWN check `left <= right` để tránh duplicate với ma trận hình chữ nhật / **Guard checks** prevent duplicates in non-square matrices
5. **Brute force dùng visited**: Đơn giản hơn nhưng tốn O(m×n) space / **Visited matrix** is simpler but wastes extra space
6. **Edge cases**: single row, single column, 1×1 matrix

---

## Solutions

```typescript
/**
 * Solution 1: Visited Matrix (Brute Force)
 * Time: O(m*n) | Space: O(m*n)
 */
function spiralOrderBrute(matrix: number[][]): number[] {
  const m = matrix.length,
    n = matrix[0].length;
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]; // right, down, left, up
  const result: number[] = [];
  let r = 0,
    c = 0,
    dir = 0;

  for (let i = 0; i < m * n; i++) {
    result.push(matrix[r][c]);
    visited[r][c] = true;
    const [dr, dc] = dirs[dir];
    const nr = r + dr,
      nc = c + dc;
    if (nr < 0 || nr >= m || nc < 0 || nc >= n || visited[nr][nc]) {
      dir = (dir + 1) % 4; // turn clockwise
    }
    r += dirs[dir][0];
    c += dirs[dir][1];
  }
  return result;
}

/**
 * Solution 2: Boundary Shrink (Optimal)
 * Time: O(m*n) | Space: O(1) extra (output not counted)
 */
function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];
  let top = 0,
    bottom = matrix.length - 1;
  let left = 0,
    right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    // → right along top row
    for (let c = left; c <= right; c++) result.push(matrix[top][c]);
    top++;

    // ↓ down along right column
    for (let r = top; r <= bottom; r++) result.push(matrix[r][right]);
    right--;

    // ← left along bottom row (if still valid)
    if (top <= bottom) {
      for (let c = right; c >= left; c--) result.push(matrix[bottom][c]);
      bottom--;
    }

    // ↑ up along left column (if still valid)
    if (left <= right) {
      for (let r = bottom; r >= top; r--) result.push(matrix[r][left]);
      left++;
    }
  }
  return result;
}

// === Test Cases ===
console.log(
  JSON.stringify(
    spiralOrder([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]),
  ),
);
// [1,2,3,6,9,8,7,4,5]
console.log(
  JSON.stringify(
    spiralOrder([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
    ]),
  ),
);
// [1,2,3,4,8,12,11,10,9,5,6,7]
console.log(JSON.stringify(spiralOrder([[1]]))); // [1]
console.log(
  JSON.stringify(
    spiralOrder([
      [1, 2],
      [3, 4],
    ]),
  ),
); // [1,2,4,3]
```

---

## 🔗 Related Problems

| Problem                                                              | Relationship                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii)   | Reverse: fill matrix in spiral order using same boundary technique |
| [Rotate Image](https://leetcode.com/problems/rotate-image)           | In-place matrix transformation, same boundary awareness            |
| [Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse) | Matrix traversal in non-standard order                             |
| [Game of Life](https://leetcode.com/problems/game-of-life)           | In-place matrix state simulation                                   |
