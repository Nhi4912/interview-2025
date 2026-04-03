---
layout: page
title: "Spiral Matrix II"
difficulty: Medium
category: Array
tags: [Array, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/spiral-matrix-ii"
---

# Spiral Matrix II / Ma Trận Xoắn Ốc II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Matrix Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 10 companies
> **See also**: [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) | [Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Tưởng tượng bạn quét sơn lên bức tường hình vuông theo hướng xoắn ốc — trái → xuống → phải → lên, mỗi vòng thu hẹp lại một lớp. Hoặc dùng 4 hướng với tường "bounds" co lại.

**Pattern Recognition:** "Fill matrix in spiral order" → Layer-by-layer shrinking boundaries, hoặc direction vector + turn-when-blocked.

```
n = 3, fill 1..9:
Layer 0:  → [1,2,3]         Boundaries:
          ↓ [_,_,6]         top=0  bot=2
          ← [9,8,7]         left=0 right=2
          ↑ [4,_,_]
Layer 1:  fill [5]
Result: [[1,2,3],[4,5,6],[7,8,9]]
```

---

## 📋 Problem / Bài Toán

Given integer `n`, generate an `n×n` matrix filled with elements from `1` to `n²` in **spiral order** (clockwise, starting top-left).

- `n=3` → `[[1,2,3],[4,5,6],[7,8,9]]`
- `n=1` → `[[1]]`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Boundary shrink**: Duy trì `top, bottom, left, right`. Sau mỗi edge, shrink boundary tương ứng.
- 🔑 **Nhận biết**: "Spiral fill/read" → luôn là boundary simulation; 2 variants: shrink borders hoặc direction vector.
- ⚡ **Direction vector**: `dirs = [[0,1],[1,0],[0,-1],[-1,0]]` (right/down/left/up); xoay hướng khi đụng biên/visited.
- ⚡ **Layer approach**: Tổng `n//2` layers; layer `i` có top/bottom/left/right cách đều `i` từ border.
- 🚨 **n=1 edge case**: Một ô duy nhất — cả hai giải pháp đều handle đúng, nhưng kiểm tra boundary loop.
- 💡 **Variant Spiral Matrix I**: Đọc thay vì ghi — cùng cấu trúc, chỉ push thay vì assign.

---

## Solutions

### Solution 1 — Layer-by-Layer Fill · O(n²) time · O(n²) space

```typescript
/**
 * Shrink top/bottom/left/right boundaries after each side is filled.
 * Go right → down → left → up, repeat until all cells filled.
 * Time: O(n²) | Space: O(n²) for result matrix
 */
function generateMatrix_layers(n: number): number[][] {
  const matrix = Array.from({ length: n }, () => new Array(n).fill(0));
  let top = 0,
    bottom = n - 1,
    left = 0,
    right = n - 1;
  let num = 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) matrix[top][c] = num++; // →
    top++;
    for (let r = top; r <= bottom; r++) matrix[r][right] = num++; // ↓
    right--;
    if (top <= bottom) for (let c = right; c >= left; c--) matrix[bottom][c] = num++; // ←
    bottom--;
    if (left <= right) for (let r = bottom; r >= top; r--) matrix[r][left] = num++; // ↑
    left++;
  }
  return matrix;
}

console.log(generateMatrix_layers(3));
// [[1,2,3],[4,5,6],[7,8,9]]
console.log(generateMatrix_layers(1));
// [[1]]
console.log(generateMatrix_layers(4));
// [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]] — first two rows
```

### Solution 2 — Direction Vectors · O(n²) time · O(n²) space

```typescript
/**
 * Walk using direction vectors. Turn clockwise when hitting boundary or visited cell.
 * dirs cycle: right → down → left → up (indices 0→1→2→3→0)
 * Time: O(n²) | Space: O(n²)
 */
function generateMatrix(n: number): number[][] {
  const matrix = Array.from({ length: n }, () => new Array(n).fill(0));
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]; // right down left up
  let r = 0,
    c = 0,
    dir = 0;

  for (let num = 1; num <= n * n; num++) {
    matrix[r][c] = num;
    const [dr, dc] = dirs[dir];
    const nr = r + dr,
      nc = c + dc;
    const outOfBounds = nr < 0 || nr >= n || nc < 0 || nc >= n;
    const alreadyFilled = !outOfBounds && matrix[nr][nc] !== 0;
    if (outOfBounds || alreadyFilled) {
      dir = (dir + 1) % 4; // turn clockwise
      r += dirs[dir][0];
      c += dirs[dir][1];
    } else {
      r = nr;
      c = nc;
    }
  }
  return matrix;
}

console.log(JSON.stringify(generateMatrix(3)));
// [[1,2,3],[4,5,6],[7,8,9]]
console.log(JSON.stringify(generateMatrix(1)));
// [[1]]
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                              | Difficulty | Pattern           |
| -------------------------------------------------------------------- | ---------- | ----------------- |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)         | 🟡 Medium  | Matrix Simulation |
| [Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse) | 🟡 Medium  | Matrix Simulation |
| [Game of Life](https://leetcode.com/problems/game-of-life)           | 🟡 Medium  | Matrix Simulation |
| [Rotate Image](https://leetcode.com/problems/rotate-image)           | 🟡 Medium  | Matrix In-place   |
