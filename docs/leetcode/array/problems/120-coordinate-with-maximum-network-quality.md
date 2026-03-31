---
layout: page
title: "Coordinate With Maximum Network Quality"
difficulty: Medium
category: Array
tags: [Array, Enumeration]
leetcode_url: "https://leetcode.com/problems/coordinate-with-maximum-network-quality"
---

# Coordinate With Maximum Network Quality / Tọa Độ Có Chất Lượng Mạng Tối Đa

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Array
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Number of Black Blocks](https://leetcode.com/problems/number-of-black-blocks) | [Longest Mountain in Array](https://leetcode.com/problems/longest-mountain-in-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống **bản đồ sóng điện thoại** — mỗi trạm phát tín hiệu trong bán kính. Đứng tại `(x,y)`, nhận chất lượng từ trạm `i` = `floor(qi / (floor(dist) + 1))` nếu trong vùng. Tìm điểm có tổng chất lượng cao nhất.

**Key Insight:** Constraints nhỏ (coord ≤ 50) → duyệt brute force tất cả tọa độ nguyên O(50² × n).

```
towers = [[1,2,5],[2,1,7],[3,1,9]], radius = 2
Point (2,1): dist to (3,1) = 1 ≤ 2 → +floor(9/(1+1))=4
             dist to (2,1) = 0 ≤ 2 → +floor(7/(0+1))=7
             dist to (1,2) = sqrt(2)≈1.41 ≤ 2 → +floor(5/(1+1))=2
Total at (2,1) = 13 ← best
```

---

## Problem Description / Mô Tả Bài Toán

Cho mảng `towers[i] = [xi, yi, qi]` và `radius`. Chất lượng nhận từ tower `i` tại điểm `(cx,cy)`:

- `floor(qi / (floor(dist(c,i)) + 1))` nếu dist ≤ radius, ngược lại `0`.

Trả về tọa độ nguyên `[cx,cy]` có **tổng chất lượng lớn nhất** (lexicographically smallest nếu tie).

**Constraints:** `1 <= towers.length <= 50`, `0 <= xi, yi, qi <= 50`, `1 <= radius <= 50`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Small constraints (≤50) → brute force over all integer coordinates [0..50] is perfectly fine O(50²×n). **VI:** Ràng buộc nhỏ → duyệt O(50²×n) là ổn.
2. **EN:** Use squared distance to check coverage (dist² ≤ radius²) to avoid sqrt. **VI:** Dùng khoảng cách bình phương để tránh sqrt khi kiểm tra vùng phủ.
3. **EN:** For quality computation, you need actual distance (with sqrt) for the floor formula. **VI:** Tính chất lượng cần khoảng cách thực (có sqrt) để dùng floor.
4. **EN:** Lexicographically smallest: iterate x from 0, y from 0, update only on strictly greater quality. **VI:** Nhỏ nhất theo từ điển: x từ 0, y từ 0, chỉ cập nhật khi lớn hơn (strict).
5. **EN:** The answer coordinate doesn't need to be a tower location. **VI:** Tọa độ đáp án không cần phải là vị trí trạm.
6. **EN:** Time O(50² × n) ≈ 125,000 ops — very fast. **VI:** O(50²×n) ≈ 125,000 phép tính — rất nhanh.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Enumerate All Integer Coordinates  O(50² × n) ───────────────
function bestCoordinate(towers: number[][], radius: number): number[] {
  let maxQuality = 0;
  let bestX = 0,
    bestY = 0;

  for (let x = 0; x <= 50; x++) {
    for (let y = 0; y <= 50; y++) {
      let totalQuality = 0;

      for (const [tx, ty, tq] of towers) {
        const distSq = (x - tx) ** 2 + (y - ty) ** 2;
        if (distSq <= radius * radius) {
          const dist = Math.sqrt(distSq);
          totalQuality += Math.floor(tq / (Math.floor(dist) + 1));
        }
      }

      // Strict greater → lexicographically smallest wins ties automatically
      if (totalQuality > maxQuality) {
        maxQuality = totalQuality;
        bestX = x;
        bestY = y;
      }
    }
  }

  return [bestX, bestY];
}

// ─── Solution 2: Bounded Search (tighter range)  O(range² × n) ───────────────
function bestCoordinateBounded(towers: number[][], radius: number): number[] {
  const xs = towers.map((t) => t[0]);
  const ys = towers.map((t) => t[1]);
  const minX = Math.max(0, Math.min(...xs) - radius);
  const maxX = Math.min(50, Math.max(...xs) + radius);
  const minY = Math.max(0, Math.min(...ys) - radius);
  const maxY = Math.min(50, Math.max(...ys) + radius);

  let maxQuality = 0;
  let bestX = minX,
    bestY = minY;

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      let totalQuality = 0;
      for (const [tx, ty, tq] of towers) {
        const distSq = (x - tx) ** 2 + (y - ty) ** 2;
        if (distSq <= radius * radius) {
          totalQuality += Math.floor(tq / (Math.floor(Math.sqrt(distSq)) + 1));
        }
      }
      if (totalQuality > maxQuality) {
        maxQuality = totalQuality;
        bestX = x;
        bestY = y;
      }
    }
  }

  return [bestX, bestY];
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(
  bestCoordinate(
    [
      [1, 2, 5],
      [2, 1, 7],
      [3, 1, 9],
    ],
    2,
  ),
); // [2,1]
console.log(bestCoordinate([[23, 11, 21]], 9)); // [23,11]
console.log(
  bestCoordinate(
    [
      [1, 2, 13],
      [2, 1, 7],
      [0, 1, 9],
    ],
    2,
  ),
); // [1,2]
console.log(
  bestCoordinateBounded(
    [
      [1, 2, 5],
      [2, 1, 7],
      [3, 1, 9],
    ],
    2,
  ),
); // [2,1]
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                                  | Difficulty | Pattern     |
| ---- | ------------------------------------------------------------------------------------------------------------------------ | ---------- | ----------- |
| 1828 | [Queries on Number of Points Inside a Circle](https://leetcode.com/problems/queries-on-number-of-points-inside-a-circle) | 🟡 Medium  | Geometry    |
| 1030 | [Matrix Cells in Distance Order](https://leetcode.com/problems/matrix-cells-in-distance-order)                           | 🟢 Easy    | Enumeration |
| 973  | [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin)                                   | 🟡 Medium  | Geometry    |
