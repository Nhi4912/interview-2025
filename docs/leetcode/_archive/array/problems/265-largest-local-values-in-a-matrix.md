---
layout: page
title: "Largest Local Values in a Matrix"
difficulty: Easy
category: Array
tags: [Array, Matrix]
leetcode_url: "https://leetcode.com/problems/largest-local-values-in-a-matrix"
---

# Largest Local Values in a Matrix / Giá Trị Cục Bộ Lớn Nhất Trong Ma Trận

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Matrix Traversal
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Max Sum of Rectangle No Larger Than K](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k) | [Image Smoother](https://leetcode.com/problems/image-smoother)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một bản đồ địa hình với độ cao từng ô. Bạn cần tạo một bản đồ thu nhỏ: mỗi ô trong bản đồ mới đại diện cho đỉnh cao nhất trong một vùng 3×3 của bản đồ gốc (tâm là ô đó). Kết quả là bản đồ nhỏ hơn 2 hàng và 2 cột so với bản đồ gốc — mỗi ô chứa "ngọn núi cao nhất" của vùng xung quanh nó.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Largest Local Values in a Matrix example:**

```
grid (4×4):                    result (2×2):
9  9  8  1                     For center (1,1): max of 3×3 → 9
5  6  2  6       center(1,1)   9  9  8  1
8  2  6  4    ─────────────►   5 [6] 2  6   max=9
6  2  2  2                     8  2  6  4
                                              For center (1,2): max of 3×3 → 9
result[0][0] = max(3×3 at r=1,c=1) = 9       9  9  8  1
result[0][1] = max(3×3 at r=1,c=2) = 9       5  6 [2] 6   max=9
result[1][0] = max(3×3 at r=2,c=1) = 8       8  2  6  4
result[1][1] = max(3×3 at r=2,c=2) = 6
                                            → [[9,9],[8,6]]
```

---

## Problem Description

Given an `n×n` integer matrix `grid`, generate an `(n-2)×(n-2)` matrix `maxLocal` where `maxLocal[i][j]` is the **largest value** in the 3×3 subgrid centered at `grid[i+1][j+1]`.

**Example 1:** `grid = [[9,9,8,1],[5,6,2,6],[8,2,6,4],[6,2,2,2]]` → `[[9,9],[8,6]]`
**Example 2:** `grid = [[1,1,1,1,1],[1,1,1,1,1],[1,1,2,1,1],[1,1,1,1,1],[1,1,1,1,1]]` → `[[1,1,1],[1,2,1],[1,1,1]]`

**Constraints:** `3 ≤ n ≤ 100`, `1 ≤ grid[i][j] ≤ 100`

---

## 📝 Interview Tips

- **Result size is (n-2)×(n-2)** / Kích thước kết quả: Loại bỏ hàng/cột đầu và cuối → tâm hợp lệ từ (1,1) đến (n-2,n-2)
- **3×3 subgrid scan** / Quét lưới 3×3: Với mỗi tâm `(r,c)`, duyệt `dr∈[-1,0,1]` và `dc∈[-1,0,1]`
- **O(9·n²) = O(n²)** / Độ phức tạp: 9 phép so sánh cho mỗi ô kết quả → O(n²) tổng
- **In-place alternative** / Biến thể tại chỗ: Không thể làm tại chỗ vì cần giá trị gốc → tạo mảng mới
- **Sliding window optimization** / Tối ưu cửa sổ trượt: Với n lớn hơn, dùng sparse table 2D cho O(1)/query
- **Edge case** / Trường hợp đặc biệt: n=3 → chỉ một ô kết quả (1×1), là max của toàn bộ lưới

---

## Solutions

```typescript
/**
 * @complexity Time: O(n²) | Space: O((n-2)²)
 * For each valid center, find max in its 3×3 neighborhood
 */
function largestLocal(grid: number[][]): number[][] {
  const n = grid.length;
  const result: number[][] = [];

  for (let r = 1; r < n - 1; r++) {
    const row: number[] = [];
    for (let c = 1; c < n - 1; c++) {
      let maxVal = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          maxVal = Math.max(maxVal, grid[r + dr][c + dc]);
        }
      }
      row.push(maxVal);
    }
    result.push(row);
  }
  return result;
}

/**
 * @complexity Time: O(n²) | Space: O((n-2)²)
 * Using Array.from for declarative matrix construction
 */
function largestLocalFunctional(grid: number[][]): number[][] {
  const n = grid.length;
  return Array.from({ length: n - 2 }, (_, r) =>
    Array.from({ length: n - 2 }, (_, c) => {
      let max = 0;
      for (let dr = 0; dr < 3; dr++)
        for (let dc = 0; dc < 3; dc++) max = Math.max(max, grid[r + dr][c + dc]);
      return max;
    }),
  );
}

// === Test Cases ===
console.log(
  largestLocal([
    [9, 9, 8, 1],
    [5, 6, 2, 6],
    [8, 2, 6, 4],
    [6, 2, 2, 2],
  ]),
);
// → [[9,9],[8,6]]

console.log(
  largestLocal([
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 2, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ]),
);
// → [[1,1,1],[1,2,1],[1,1,1]]

console.log(
  largestLocal([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]),
); // → [[9]]
console.log(
  largestLocalFunctional([
    [9, 9, 8, 1],
    [5, 6, 2, 6],
    [8, 2, 6, 4],
    [6, 2, 2, 2],
  ]),
);
// → [[9,9],[8,6]]
```

---

## 🔗 Related Problems

| Problem                               | Difficulty | Link                                                                          |
| ------------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| Image Smoother                        | Easy       | [LC 661](https://leetcode.com/problems/image-smoother)                        |
| Matrix Block Sum                      | Medium     | [LC 1314](https://leetcode.com/problems/matrix-block-sum)                     |
| Max Sum of Rectangle No Larger Than K | Hard       | [LC 363](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k) |
