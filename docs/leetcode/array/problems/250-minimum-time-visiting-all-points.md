---
layout: page
title: "Minimum Time Visiting All Points"
difficulty: Easy
category: Array
tags: [Array, Math, Geometry]
leetcode_url: "https://leetcode.com/problems/minimum-time-visiting-all-points"
---

# Minimum Time Visiting All Points / Thời Gian Tối Thiểu Thăm Tất Cả Điểm

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line) | [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy tưởng tượng bạn là quân Vua trên bàn cờ — được phép đi theo 8 hướng (kể cả đường chéo), mỗi bước tốn 1 giây. Để đi từ ô A đến ô B, bạn "đi chéo" tối đa rồi đi thẳng — thời gian luôn bằng max(|dx|, |dy|), tức khoảng cách Chebyshev.

**Pattern Recognition:**

- Signal: "8-directional movement", "min time between points" → **Chebyshev Distance**
- Key insight: `time(A→B) = max(|x2-x1|, |y2-y1|)`; total = sum over consecutive pairs

**Visual — points=[[1,1],[3,4],[-1,0]]:**

```
Segment 1→2: dx=|3-1|=2, dy=|4-1|=3 → max(2,3) = 3s
  (1,1) ──2 diagonal──► (3,3) ──1 up──► (3,4)

Segment 2→3: dx=|−1−3|=4, dy=|0−4|=4 → max(4,4) = 4s
  (3,4) ──4 diagonal (SW)──► (−1,0)

Total = 3 + 4 = 7 seconds ✓
```

---

## 📝 Problem Description

Given an array of 2D points in order. Each second you can move ≤1 unit horizontally, vertically, or diagonally. Return the minimum time to visit all points in order.

**Example 1:** `points=[[1,1],[3,4],[-1,0]]` → `7`
**Example 2:** `points=[[3,2],[-2,2]]` → `5`

**Constraints:** `1 ≤ points.length ≤ 100`, `-10^4 ≤ points[i][j] ≤ 10^4`

---

## 🎯 Interview Tips

1. **Chebyshev distance** / Khoảng cách Chebyshev: `max(|dx|, |dy|)` là công thức khi di chuyển 8 hướng
2. **No backtracking** / Không cần quay lui: thứ tự thăm đã cố định → sum các đoạn liên tiếp
3. **One linear pass** / Một lần duyệt: chỉ cần `for i in 0..n-2` cộng dần
4. **Edge case** / Trường hợp đặc biệt: 1 điểm → 0; 2 điểm cùng vị trí → +0
5. **Why diagonal wins** / Tại sao chéo tốt: mỗi bước chéo "tiêu" cả dx lẫn dy cùng lúc → tối ưu
6. **Follow-up** / Mở rộng: không có đường chéo → Manhattan distance = |dx|+|dy|

---

## 💡 Solutions

### Approach 1: Step-by-Step Simulation — Brute Force

/\*_ @complexity Time: O(sum of distances) | Space: O(1) _/

```typescript
function minTimeVisitingBrute(points: number[][]): number {
  let time = 0;
  for (let i = 0; i < points.length - 1; i++) {
    let [x, y] = points[i];
    const [tx, ty] = points[i + 1];
    while (x !== tx || y !== ty) {
      if (x < tx) x++;
      else if (x > tx) x--;
      if (y < ty) y++;
      else if (y > ty) y--;
      time++;
    }
  }
  return time;
}
```

### Approach 2: Chebyshev Distance Formula — Optimal

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function minTimeVisiting(points: number[][]): number {
  let time = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = Math.abs(points[i + 1][0] - points[i][0]);
    const dy = Math.abs(points[i + 1][1] - points[i][1]);
    time += Math.max(dx, dy); // Chebyshev distance
  }
  return time;
}
```

---

## 🧪 Test Cases

```typescript
console.log(
  minTimeVisiting([
    [1, 1],
    [3, 4],
    [-1, 0],
  ]),
); // → 7
console.log(
  minTimeVisiting([
    [3, 2],
    [-2, 2],
  ]),
); // → 5
console.log(minTimeVisiting([[0, 0]])); // → 0 (single point)
console.log(
  minTimeVisiting([
    [0, 0],
    [0, 0],
  ]),
); // → 0 (same point)
console.log(
  minTimeVisitingBrute([
    [1, 1],
    [3, 4],
    [-1, 0],
  ]),
); // → 7
```

---

## Related Problems

| Problem                                                                                                | Difficulty | Pattern            |
| ------------------------------------------------------------------------------------------------------ | ---------- | ------------------ |
| [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin)                 | Medium     | Euclidean Distance |
| [Walking Robot Simulation](https://leetcode.com/problems/walking-robot-simulation)                     | Medium     | Grid Simulation    |
| [Minimum Distance Between BST Nodes](https://leetcode.com/problems/minimum-distance-between-bst-nodes) | Easy       | Tree Traversal     |
