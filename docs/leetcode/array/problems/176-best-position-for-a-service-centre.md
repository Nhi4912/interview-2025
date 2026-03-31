---
layout: page
title: "Best Position for a Service Centre"
difficulty: Hard
category: Array
tags: [Array, Math, Geometry, Randomized]
leetcode_url: "https://leetcode.com/problems/best-position-for-a-service-centre"
---

# Best Position for a Service Centre / Vị Trí Tốt Nhất Cho Trung Tâm Dịch Vụ

🔴 Hard | Tags: Array, Math, Geometry, Randomized

---

## 🧠 Intuition / Trực Giác

**VN:** Tìm điểm tối thiểu hóa tổng khoảng cách Euclidean đến tất cả khách hàng — đây là bài toán **Geometric Median**. Không có công thức đóng, dùng Weiszfeld's algorithm (trung bình có trọng số lặp lại) hoặc gradient descent bước nhỏ.

```
Customers: (0,1) (1,0) (1,2) (2,1)
           ↗     ↖     ↙     ↘
       Optimal center ≈ (1, 1)
       sum of distances ≈ 4.0
```

---

## 📝 Interview Tips

- 🇻🇳 Geometric Median ≠ Centroid (trung bình cộng); centroid tối thiểu hóa bình phương khoảng cách.
- 🇺🇸 Geometric median minimizes sum of Euclidean distances, not squared distances like the centroid.
- 🇻🇳 Gradient descent bước nhỏ dần: mỗi lần không cải thiện thì giảm bước đi xuống.
- 🇺🇸 Simulated annealing-style: try 4 directions; if no improvement, halve the step size.
- 🇻🇳 Dừng khi bước nhỏ hơn `1e-6` để đảm bảo sai số nhỏ hơn `1e-5`.
- 🇺🇸 Stop when step < 1e-6; this guarantees < 1e-5 absolute error.

---

## 💡 Solutions

### Solution 1: Gradient Descent (Simulated Annealing Style)

```typescript
/**
 * Start from centroid; step in 4 directions halving step when stuck.
 * Time: O(n * log(1/eps)) | Space: O(1)
 */
function getMinDistSum(positions: number[][]): number {
  const totalDist = (cx: number, cy: number): number =>
    positions.reduce((s, [px, py]) => s + Math.hypot(cx - px, cy - py), 0);

  // Start from centroid
  let x = 0,
    y = 0;
  for (const [px, py] of positions) {
    x += px;
    y += py;
  }
  x /= positions.length;
  y /= positions.length;

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let step = 1.0;

  while (step > 1e-6) {
    let moved = false;
    for (const [dx, dy] of dirs) {
      const nx = x + dx * step,
        ny = y + dy * step;
      if (totalDist(nx, ny) < totalDist(x, y) - 1e-9) {
        x = nx;
        y = ny;
        moved = true;
        break;
      }
    }
    if (!moved) step /= 2;
  }

  return totalDist(x, y);
}

console.log(
  getMinDistSum([
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1],
  ]),
); // ≈ 4.0
console.log(
  getMinDistSum([
    [1, 1],
    [3, 3],
  ]),
); // ≈ 2.828
```

### Solution 2: Weiszfeld's Algorithm (Iterative Weighted Centroid)

```typescript
/**
 * Weiszfeld: update position as weighted average (weight = 1/distance).
 * Time: O(n * iterations) | Space: O(1)
 */
function getMinDistSum2(positions: number[][]): number {
  let x = 0,
    y = 0;
  for (const [px, py] of positions) {
    x += px;
    y += py;
  }
  x /= positions.length;
  y /= positions.length;

  const totalDist = (cx: number, cy: number): number =>
    positions.reduce((s, [px, py]) => s + Math.hypot(cx - px, cy - py), 0);

  for (let iter = 0; iter < 1000; iter++) {
    let nx = 0,
      ny = 0,
      wSum = 0;

    for (const [px, py] of positions) {
      const d = Math.max(Math.hypot(x - px, y - py), 1e-10);
      const w = 1 / d;
      nx += px * w;
      ny += py * w;
      wSum += w;
    }

    nx /= wSum;
    ny /= wSum;

    if (Math.hypot(nx - x, ny - y) < 1e-7) break;
    x = nx;
    y = ny;
  }

  return totalDist(x, y);
}

console.log(
  getMinDistSum2([
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1],
  ]),
); // ≈ 4.0
console.log(
  getMinDistSum2([
    [1, 1],
    [3, 3],
  ]),
); // ≈ 2.828
```

---

## 🔗 Related Problems

| Problem                                                                                                             | Difficulty | Pattern               |
| ------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal/)                 | 🔴 Hard    | Math / Ternary Search |
| [Minimize the Maximum Difference of Pairs](https://leetcode.com/problems/minimize-the-maximum-difference-of-pairs/) | 🟡 Medium  | Binary Search         |
| [Minimum Total Distance Traveled](https://leetcode.com/problems/minimum-total-distance-traveled/)                   | 🔴 Hard    | DP                    |
