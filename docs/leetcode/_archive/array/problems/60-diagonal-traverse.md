---
layout: page
title: "Diagonal Traverse"
difficulty: Medium
category: Array
tags: [Array, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/diagonal-traverse"
---

# Diagonal Traverse / Duyệt Đường Chéo

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Matrix / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng mắt bạn chạy zigzag qua ma trận — lên-phải rồi xuống-trái luân phiên. Mỗi đường chéo được xác định bởi tổng `d = i + j` không đổi. Đường chéo chẵn đi lên, lẻ đi xuống.

**Pattern Recognition:**

- Signal: "traverse matrix diagonally" → **Simulation** (group by diagonal d = i+j)
- d chẵn: đi từ dưới-trái lên trên-phải (row giảm, col tăng)
- d lẻ: đi từ trên-phải xuống dưới-trái (row tăng, col giảm)
- Key insight: starting point của mỗi đường chéo được clip vào boundary

**Visual — Diagonal Traversal:**

```
Matrix 3×4:
d=0(↑): (0,0)
d=1(↓): (1,0),(0,1)
d=2(↑): (0,2),(1,1),(2,0)
d=3(↓): (2,1),(1,2),(0,3)
d=4(↑): (1,3),(2,2)
d=5(↓): (2,3)

Even d: r = min(d, m-1),  col = d - r,  r-- until r<0 or c>=n
Odd d:  c = min(d, n-1),  row = d - c,  c-- until c<0 or r>=m
```

---

## Problem Description

Given an `m×n` matrix `mat`, return all elements in diagonal order (alternating up-right and down-left). ([LeetCode](https://leetcode.com/problems/diagonal-traverse))

Difficulty: Medium | Acceptance: 63.2%

- Example 1: `mat=[[1,2,3],[4,5,6],[7,8,9]]` → `[1,2,4,7,5,3,6,8,9]`
- Example 2: `mat=[[1,2],[3,4]]` → `[1,2,3,4]`

Constraints: `m == mat.length`, `n == mat[0].length`, `1 ≤ m, n ≤ 10^4`, `1 ≤ m·n ≤ 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Hướng đi: d=0 đi lên hay đi xuống?" / Confirm direction for first diagonal (d=0 goes up-right)
2. **Key insight**: "d = i+j là số thứ tự của đường chéo, có m+n-1 đường chéo" / d = i+j identifies the diagonal
3. **Direction**: "d chẵn → đi lên (r--, c++), d lẻ → đi xuống (r++, c--)" / Even d goes up, odd d goes down
4. **Starting point**: "Clip starting position vào boundary của matrix" / Clip start to matrix bounds
5. **Alternative**: "Có thể dùng direction vector và đổi hướng khi chạm tường" / Can also simulate with direction flipping
6. **Edge cases**: "Ma trận 1×1, 1×n, m×1 — đường chéo chỉ có một phần tử" / Single row/column matrices

---

## Solutions

```typescript
/**
 * Solution 1: Simulate with direction flipping
 * Time: O(m·n) — visit every cell once
 * Space: O(m·n) — result array
 */
function findDiagonalOrderSim(mat: number[][]): number[] {
  if (!mat.length || !mat[0].length) return [];
  const m = mat.length,
    n = mat[0].length;
  const result: number[] = [];
  let r = 0,
    c = 0,
    goingUp = true;

  for (let i = 0; i < m * n; i++) {
    result.push(mat[r][c]);
    if (goingUp) {
      if (c === n - 1) {
        r++;
        goingUp = false;
      } else if (r === 0) {
        c++;
        goingUp = false;
      } else {
        r--;
        c++;
      }
    } else {
      if (r === m - 1) {
        c++;
        goingUp = true;
      } else if (c === 0) {
        r++;
        goingUp = true;
      } else {
        r++;
        c--;
      }
    }
  }
  return result;
}

/**
 * Solution 2: Group by Diagonal d = i+j
 * Time: O(m·n) — visit every cell exactly once
 * Space: O(m·n) — result array (no extra per-diagonal storage)
 */
function findDiagonalOrder(mat: number[][]): number[] {
  if (!mat.length || !mat[0].length) return [];
  const m = mat.length,
    n = mat[0].length;
  const result: number[] = [];

  for (let d = 0; d < m + n - 1; d++) {
    if (d % 2 === 0) {
      // Going up-right: start from bottom of diagonal, go up
      let r = Math.min(d, m - 1);
      let c = d - r;
      while (r >= 0 && c < n) {
        result.push(mat[r][c]);
        r--;
        c++;
      }
    } else {
      // Going down-left: start from right of diagonal, go down
      let c = Math.min(d, n - 1);
      let r = d - c;
      while (c >= 0 && r < m) {
        result.push(mat[r][c]);
        r++;
        c--;
      }
    }
  }

  return result;
}

// === Test Cases ===
console.log(
  findDiagonalOrder([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
); // [1,2,4,7,5,3,6,8,9]
console.log(
  findDiagonalOrder([
    [1, 2],
    [3, 4],
  ]),
); // [1,2,3,4]
console.log(findDiagonalOrder([[1]])); // [1]
console.log(findDiagonalOrder([[1, 2, 3, 4]])); // [1,2,3,4]
```

---

## 🔗 Related Problems

- [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) — traverse matrix in spiral order
- [Diagonal Traverse II](https://leetcode.com/problems/diagonal-traverse-ii) — diagonal traversal for jagged arrays
- [Transpose Matrix](https://leetcode.com/problems/transpose-matrix) — matrix transformation
- [Rotate Image](https://leetcode.com/problems/rotate-image) — 90° rotation simulation
- [Toeplitz Matrix](https://leetcode.com/problems/toeplitz-matrix) — diagonal property verification
