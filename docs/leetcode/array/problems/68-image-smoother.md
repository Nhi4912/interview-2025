---
layout: page
title: "Image Smoother"
difficulty: Easy
category: Array
tags: [Array, Matrix]
leetcode_url: "https://leetcode.com/problems/image-smoother"
---

# Image Smoother / Làm Mịn Ảnh

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Matrix Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống hiệu ứng blur trong Photoshop — mỗi pixel được thay bằng màu trung bình của chính nó và 8 hàng xóm xung quanh. Nếu hàng xóm nằm ngoài biên thì bỏ qua, vẫn tính trung bình của những cái còn lại.

**Pattern Recognition:**

- Signal: "2D grid", "average of neighbors", "kernel/window" → **Matrix Simulation**
- Bài này duyệt từng cell, lấy trung bình cửa sổ 3×3 xung quanh — cẩn thận boundary
- Key insight: clamp row/col to [0, rows-1] / [0, cols-1] thay vì skip

**Visual — img=[[1,1,1],[1,0,1],[1,1,1]], smooth cell (1,1):**

```
Window 3x3 centered at (1,1):
(0,0)=1  (0,1)=1  (0,2)=1
(1,0)=1  (1,1)=0  (1,2)=1
(2,0)=1  (2,1)=1  (2,2)=1
Sum=8, Count=9 → floor(8/9)=0

Corner cell (0,0): only 4 neighbors valid
(0,0)=1 (0,1)=1
(1,0)=1 (1,1)=0
Sum=3, Count=4 → floor(3/4)=0
```

---

## Problem Description

A **image smoother** is a filter that replaces each pixel with the floor of the average of the pixel itself and all its 8-directional neighbors. Pixels outside the image boundary are skipped. Return the result matrix.

- Example 1: `img=[[1,1,1],[1,0,1],[1,1,1]]` → `[[0,0,0],[0,0,0],[0,0,0]]`
- Example 2: `img=[[100,200,100],[200,50,200],[100,200,100]]` → `[[137,141,137],[141,138,141],[137,141,137]]`

Constraints: `1 <= m, n <= 200`, `0 <= img[i][j] <= 255`

---

## 📝 Interview Tips

1. **Clarify**: "Floor hay round? Có dùng pixel ngoài biên không?" / Floor division; ignore out-of-bounds pixels
2. **Brute force**: "Với mỗi cell, lặp 9 hướng, check boundary" / 9-direction loop per cell is already optimal
3. **Optimize**: "Prefix sum 2D giảm window sum xuống O(1) per cell" / 2D prefix sum for O(1) window sums
4. **Edge cases**: "Ma trận 1×1, biên corner chỉ có 1-4 hàng xóm" / Corner/edge cells have fewer neighbors
5. **Key**: "Dùng Math.floor, không phải Math.round" / Problem says floor of average, not round
6. **Follow-up**: "Cửa sổ k×k thay vì 3×3?" / Generalize to k×k window → prefix sum becomes essential

---

## Solutions

```typescript
/**
 * Solution 1: Direct Simulation
 * Time: O(m*n*9) = O(m*n) — constant 9 neighbors per cell
 * Space: O(m*n) — output matrix
 */
function imageSmoother(img: number[][]): number[][] {
  const m = img.length,
    n = img[0].length;
  const result: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      let sum = 0,
        count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr,
            nc = c + dc;
          if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
            sum += img[nr][nc];
            count++;
          }
        }
      }
      result[r][c] = Math.floor(sum / count);
    }
  }
  return result;
}

/**
 * Solution 2: 2D Prefix Sum — O(1) window queries
 * Time: O(m*n) — build prefix once, each cell O(1)
 * Space: O(m*n) — prefix sum matrix
 */
function imageSmootherPrefixSum(img: number[][]): number[][] {
  const m = img.length,
    n = img[0].length;
  // Build prefix sum (1-indexed for easy boundary math)
  const pre = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let r = 1; r <= m; r++)
    for (let c = 1; c <= n; c++)
      pre[r][c] = img[r - 1][c - 1] + pre[r - 1][c] + pre[r][c - 1] - pre[r - 1][c - 1];

  const result: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      const r1 = Math.max(0, r - 1),
        c1 = Math.max(0, c - 1);
      const r2 = Math.min(m - 1, r + 1),
        c2 = Math.min(n - 1, c + 1);
      const count = (r2 - r1 + 1) * (c2 - c1 + 1);
      const sum = pre[r2 + 1][c2 + 1] - pre[r1][c2 + 1] - pre[r2 + 1][c1] + pre[r1][c1];
      result[r][c] = Math.floor(sum / count);
    }
  }
  return result;
}

// === Test Cases ===
console.log(
  imageSmoother([
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ]),
);
// [[0,0,0],[0,0,0],[0,0,0]]
console.log(
  imageSmoother([
    [100, 200, 100],
    [200, 50, 200],
    [100, 200, 100],
  ]),
);
// [[137,141,137],[141,138,141],[137,141,137]]
console.log(imageSmoother([[1]])); // [[1]]
console.log(
  imageSmoother([
    [1, 2],
    [3, 4],
  ]),
); // [[2,2],[2,2]]
```

---

## 🔗 Related Problems

- [Spiral Matrix](https://leetcode.com/problems/spiral-matrix) — 2D array traversal pattern
- [Game of Life](https://leetcode.com/problems/game-of-life) — 8-directional neighbor simulation
- [Number of Laser Beams in a Bank](https://leetcode.com/problems/number-of-laser-beams-in-a-bank) — matrix row processing
- [Matrix Block Sum](https://leetcode.com/problems/matrix-block-sum) — 2D prefix sum for window averages
