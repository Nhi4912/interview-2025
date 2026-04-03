---
layout: page
title: "Cyclically Rotating a Grid"
difficulty: Medium
category: Array
tags: [Array, Matrix, Simulation]
leetcode_url: "https://leetcode.com/problems/cyclically-rotating-a-grid"
---

# Cyclically Rotating a Grid / Xoay Lưới Theo Vòng Tròn

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Phép so sánh tiếng Việt:** Hãy nghĩ đến những chiếc khung ảnh lồng nhau — khung ngoài cùng, rồi khung trong, rồi khung trong nữa. Mỗi khung là một "layer" (lớp). Bài này yêu cầu xoay từng lớp theo chiều kim đồng hồ k bước. Kỹ thuật: "trải phẳng" mỗi lớp thành mảng 1D, rotate mảng đó, rồi "ghi ngược lại" vào grid.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Cyclically Rotating a Grid example:**

```
Grid 4x4, layer 0 (viền ngoài):
┌─────────────┐
│ → → → → ↓  │    Trải phẳng theo chiều kim đồng hồ:
│ ↑         ↓ │    [1,2,3,4, 8,12,16, 15,14,13, 9,5]
│ ↑         ↓ │
│ ← ← ← ← ←  │    Rotate 1 bước: [5,1,2,3,4,8,12,16,15,14,13,9]
└─────────────┘    Ghi ngược lại vào grid.
```

---

## Problem Description

---

## 📝 Interview Tips

1. **Số lớp = min(m,n)/2**: Grid m×n có tối đa `floor(min(m,n)/2)` lớp.
2. **Trải phẳng theo chiều kim đồng hồ**: Top → Right → Bottom (ngược) → Left (ngược) → tạo mảng 1D.
3. **Rotate mảng 1D**: Dịch phải k bước = slice(-k) + slice(0,-k). Nhớ `k % len` để tránh xoay quá.
4. **Ghi ngược lại**: Dùng cùng thứ tự trải phẳng để write back vào đúng vị trí.
5. **Layer i**: hàng trên: row=i, col từ i đến n-1-i; cột phải: col=n-1-i, row từ i+1 đến m-1-i; v.v.
6. **In-place vs new grid**: Nên tạo grid mới (deep copy) để không bị conflict khi ghi.

---

## Solutions

```typescript
/**
 * Approach 1: Extract-Rotate-Writeback cho từng layer
 * Time: O(m * n)  Space: O(m * n)
 */
function rotateGrid(grid: number[][], k: number): number[][] {
  const m = grid.length;
  const n = grid[0].length;
  const result = grid.map((row) => [...row]); // deep copy

  const numLayers = Math.min(m, n) >> 1; // Math.floor(min(m,n)/2)

  for (let layer = 0; layer < numLayers; layer++) {
    // Trích xuất layer thành mảng 1D theo chiều kim đồng hồ
    const cells: Array<[number, number]> = [];

    // Top: trái → phải
    for (let c = layer; c < n - layer; c++) cells.push([layer, c]);
    // Right: trên → dưới (bỏ góc trên đã thêm)
    for (let r = layer + 1; r < m - layer; r++) cells.push([r, n - 1 - layer]);
    // Bottom: phải → trái (bỏ góc phải đã thêm)
    for (let c = n - 2 - layer; c >= layer; c--) cells.push([m - 1 - layer, c]);
    // Left: dưới → trên (bỏ hai góc đã thêm)
    for (let r = m - 2 - layer; r > layer; r--) cells.push([r, layer]);

    const len = cells.length;
    const shift = k % len;

    // Lấy giá trị hiện tại của layer
    const vals = cells.map(([r, c]) => grid[r][c]);

    // Rotate: xoay phải shift bước
    // idx mới của vals[i] = cells[(i + shift) % len]
    for (let i = 0; i < len; i++) {
      const [r, c] = cells[(i + shift) % len];
      result[r][c] = vals[i];
    }
  }

  return result;
}

// Tests
console.log(
  rotateGrid(
    [
      [40, 10],
      [30, 20],
    ],
    1,
  ),
);
// [[10,20],[40,30]]

console.log(
  rotateGrid(
    [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ],
    2,
  ),
);
// [[3,4,8,12],[2,11,10,16],[1,7,6,15],[5,9,13,14]]

/**
 * Approach 2: Helper functions tách biệt để dễ đọc
 * Time: O(m * n)  Space: O(m * n)
 */
function rotateGridClean(grid: number[][], k: number): number[][] {
  const m = grid.length;
  const n = grid[0].length;

  /** Trích xuất layer thành flat array [giá_trị, ...] và vị trí tương ứng */
  function extractLayer(layer: number): { vals: number[]; positions: [number, number][] } {
    const positions: [number, number][] = [];

    for (let c = layer; c < n - layer; c++) positions.push([layer, c]);
    for (let r = layer + 1; r < m - layer; r++) positions.push([r, n - 1 - layer]);
    for (let c = n - 2 - layer; c >= layer; c--) positions.push([m - 1 - layer, c]);
    for (let r = m - 2 - layer; r > layer; r--) positions.push([r, layer]);

    return { vals: positions.map(([r, c]) => grid[r][c]), positions };
  }

  /** Xoay mảng 1D sang phải k bước */
  function rotateArr(arr: number[], k: number): number[] {
    const len = arr.length;
    const s = k % len;
    return [...arr.slice(len - s), ...arr.slice(0, len - s)];
  }

  const result = grid.map((row) => [...row]);

  for (let layer = 0; layer < Math.min(m, n) >> 1; layer++) {
    const { vals, positions } = extractLayer(layer);
    const rotated = rotateArr(vals, k);
    for (let i = 0; i < positions.length; i++) {
      const [r, c] = positions[i];
      result[r][c] = rotated[i];
    }
  }

  return result;
}

// Tests
console.log(
  rotateGridClean(
    [
      [40, 10],
      [30, 20],
    ],
    1,
  ),
);
// [[10,20],[40,30]]

console.log(
  JSON.stringify(
    rotateGridClean(
      [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ],
      2,
    ),
  ),
);
// [[3,4,8,12],[2,11,10,16],[1,7,6,15],[5,9,13,14]]
```

---

## 🔗 Related Problems

| Problem                                                            | Difficulty | Pattern         |
| ------------------------------------------------------------------ | ---------- | --------------- |
| [Rotate Matrix](https://leetcode.com/problems/rotate-image)        | Medium     | Matrix rotation |
| [Spiral Matrix](https://leetcode.com/problems/spiral-matrix)       | Medium     | Layer traversal |
| [Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii) | Medium     | Layer fill      |
