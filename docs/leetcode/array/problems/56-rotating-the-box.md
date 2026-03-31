---
layout: page
title: "Rotating the Box"
difficulty: Medium
category: Array
tags: [Array, Two Pointers, Matrix]
leetcode_url: "https://leetcode.com/problems/rotating-the-box"
---

# Rotating the Box / Xoay Hộp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Matrix Simulation + Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hộp cát — đá (`#`) rơi về phía phải do trọng lực cho đến khi gặp chướng ngại vật (`*`) hoặc mép hộp. Sau đó xoay hộp 90° theo chiều kim đồng hồ.

**Pattern Recognition:**

- Signal: "stones fall in direction" → **Two Pointers** (next empty slot pointer)
- Signal: "rotate matrix 90°" → công thức: `result[j][m-1-i] = box[i][j]`
- Key insight: xử lý trọng lực trước trên mỗi hàng (right to left), rồi xoay

**Visual — Gravity then Rotate:**

```
Input:          After gravity:   After 90° CW rotate:
[ # . # ]       [ . # # ]        [ # . ]
[ # # * ]       [ # # * ]        [ # # ]
                                 [ * # ]
                                 [ . # ]

Gravity: pointer 'empty' tracks rightmost free slot
'*' resets pointer  |  '#' swaps to empty slot
Rotate: (i,j) → (j, m-1-i)
```

---

## Problem Description

Given an `m×n` matrix `box` of chars: `'#'` (stone), `'*'` (obstacle), `'.'` (empty). Gravity pulls stones right. After applying gravity, rotate the box 90° clockwise and return the result. ([LeetCode](https://leetcode.com/problems/rotating-the-box))

Difficulty: Medium | Acceptance: 79.1%

- Example 1: `[["#",".","."],["#","#","*"]]` → `[["#","."],["#","#"],["*","#"],[".","."] ]`
- Example 2: `[["#","#","*",".","*","."]]` → `[["#"],["#"],["*"],["."],[" *"],["."]]`

Constraints: `1 ≤ m, n ≤ 500`, cells are `'#'`, `'*'`, or `'.'`

---

## 📝 Interview Tips

1. **Clarify**: "Trọng lực theo hướng nào? Phải không?" / Confirm gravity direction (rightward in given orientation)
2. **Brute force**: "Mô phỏng từng bước — di chuyển đá cho đến khi không di chuyển được" / Simulate stone movement step by step
3. **Optimize**: "Dùng pointer 'empty' cho slot trống → mỗi hàng O(n)" / One-pass per row with empty slot pointer
4. **Two pointers**: "Duyệt từ phải sang trái, '\*' reset pointer, '#' hoán vị sang slot trống" / Scan right-to-left
5. **Rotate formula**: "result[j][m-1-i] = box[i][j] cho ma trận n×m mới" / Standard 90° CW formula
6. **Edge cases**: "Hàng toàn đá, toàn chướng ngại, ma trận 1×1" / Row of all stones, all obstacles

---

## Solutions

```typescript
/**
 * Solution 1: Simulate Gravity Step by Step (Brute Force per row)
 * Time: O(m·n²) — for each row, repeatedly scan until stable
 * Space: O(1) extra (modifies in place, result O(m·n))
 */
function rotatingTheBoxBrute(box: string[][]): string[][] {
  const m = box.length,
    n = box[0].length;
  for (let i = 0; i < m; i++) {
    let moved = true;
    while (moved) {
      moved = false;
      for (let j = n - 2; j >= 0; j--) {
        if (box[i][j] === "#" && box[i][j + 1] === ".") {
          box[i][j + 1] = "#";
          box[i][j] = ".";
          moved = true;
        }
      }
    }
  }
  const result: string[][] = Array.from({ length: n }, () => new Array(m).fill("."));
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) result[j][m - 1 - i] = box[i][j];
  return result;
}

/**
 * Solution 2: Two-Pointer Gravity + Rotation
 * Time: O(m·n) — one pass per row for gravity, one pass for rotation
 * Space: O(m·n) — result matrix
 */
function rotatingTheBox(box: string[][]): string[][] {
  const m = box.length,
    n = box[0].length;

  // Step 1: Apply gravity — stones fall right
  for (let i = 0; i < m; i++) {
    let empty = n - 1; // rightmost available empty slot
    for (let j = n - 1; j >= 0; j--) {
      if (box[i][j] === "*") {
        empty = j - 1; // reset: obstacle blocks further movement
      } else if (box[i][j] === "#") {
        box[i][j] = ".";
        box[i][empty] = "#";
        empty--;
      }
    }
  }

  // Step 2: Rotate 90° clockwise → new n×m matrix
  const result: string[][] = Array.from({ length: n }, () => new Array(m).fill("."));
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) result[j][m - 1 - i] = box[i][j];

  return result;
}

// === Test Cases ===
console.log(
  rotatingTheBox([
    ["#", ".", "#"],
    ["#", "#", "*"],
  ]),
);
// [['#','.'],[' #','#'],['*','#'],['.','.'] ] (approximately)
console.log(rotatingTheBox([["#"]])); // [['#']]
console.log(rotatingTheBox([["*", "#"]])); // [['*'], ['#']]
console.log(rotatingTheBox([["#", "#", "*", ".", "*", "."]]));
// 6×1 matrix after rotation
```

---

## 🔗 Related Problems

- [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) — matrix traversal / simulation
- [Rotate Image](https://leetcode.com/problems/rotate-image) — 90° matrix rotation in-place
- [Flipping an Image](https://leetcode.com/problems/flipping-an-image) — row-wise matrix manipulation
- [Gravity (Candy Crush)](https://leetcode.com/problems/candy-crush) — gravity simulation in 2D grid
- [Move Zeroes](https://leetcode.com/problems/move-zeroes) — same two-pointer "fill empty slot" pattern
