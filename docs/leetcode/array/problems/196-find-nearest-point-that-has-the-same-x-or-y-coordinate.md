---
layout: page
title: "Find Nearest Point That Has the Same X or Y Coordinate"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/find-nearest-point-that-has-the-same-x-or-y-coordinate"
---

# Find Nearest Point That Has the Same X or Y Coordinate / Tìm Điểm Gần Nhất Cùng Tọa Độ X Hoặc Y

🟢 Easy | Array

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Bạn đứng tại điểm (x, y) trên bản đồ. Một điểm "hợp lệ" là điểm nằm trên cùng hàng ngang hoặc cùng cột dọc với bạn. Trong tất cả điểm hợp lệ, tìm điểm gần nhất theo khoảng cách Manhattan.

```
(x=3, y=4), points=[(1,4),(3,1),(3,4)]
  (1,4): same y=4 ✓, dist=|3-1|+|4-4|=2
  (3,1): same x=3 ✓, dist=|3-3|+|4-1|=3
  (3,4): same x AND y ✓, dist=0
Min dist=0 at index 2 → return 2
```

## Problem Description

Given point `(x, y)` and array `points`, find the **index** of the nearest "valid" point where valid means `points[i][0] === x` or `points[i][1] === y`. Use Manhattan distance. Return `-1` if no valid point.

- **Example 1**: `x=3, y=4, points=[[1,4],[3,1],[3,4]]` → `2` (distance 0)
- **Example 2**: `x=3, y=4, points=[[2,3]]` → `-1` (no valid point)

## 📝 Interview Tips

- 💡 **Valid = same row or col / Hợp lệ = cùng hàng hoặc cột**: Check px===x || py===y / kiểm tra cùng x hoặc cùng y
- 🔍 **Manhattan distance / Khoảng cách Manhattan**: |x-px| + |y-py|, but since one coord matches, it simplifies / vì một tọa độ bằng nhau nên đơn giản hơn
- ⚠️ **Index not value / Chỉ số không phải giá trị**: Return the index in points, not the point itself / trả chỉ số, không phải giá trị
- 🧮 **O(n) linear scan / Quét tuyến tính**: Visit each point once / duyệt mỗi điểm một lần
- 📊 **Tiebreaker / Ưu tiên**: If equal distance, return smaller index / khoảng cách bằng nhau → chỉ số nhỏ hơn
- 🎯 **Distance simplification / Đơn giản hóa khoảng cách**: Same x → dist = |y - py|; same y → dist = |x - px| / cùng x thì dist = |y - py|

## Solutions

### Solution 1: Linear Scan (Optimal)

```typescript
/**
 * Find nearest valid point sharing x or y coordinate
 * Time: O(n) | Space: O(1)
 */
function nearestValidPoint(x: number, y: number, points: number[][]): number {
  let bestIdx = -1;
  let bestDist = Infinity;

  for (let i = 0; i < points.length; i++) {
    const [px, py] = points[i];
    if (px === x || py === y) {
      const dist = Math.abs(x - px) + Math.abs(y - py);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
  }
  return bestIdx;
}

// Tests
console.log(
  nearestValidPoint(3, 4, [
    [1, 4],
    [3, 1],
    [3, 4],
  ]),
); // 2
console.log(nearestValidPoint(3, 4, [[2, 3]])); // -1
console.log(nearestValidPoint(3, 4, [[3, 4]])); // 0
console.log(
  nearestValidPoint(1, 2, [
    [3, 2],
    [1, 5],
    [2, 2],
  ]),
); // 0 (dist=2)
```

### Solution 2: Filter then minimize

```typescript
/**
 * Filter valid points, then find minimum distance
 * Time: O(n) | Space: O(n)
 */
function nearestValidPointFilter(x: number, y: number, points: number[][]): number {
  let bestIdx = -1;
  let bestDist = Infinity;

  points
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => p[0] === x || p[1] === y)
    .forEach(({ p, i }) => {
      const dist = Math.abs(x - p[0]) + Math.abs(y - p[1]);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });

  return bestIdx;
}

// Tests
console.log(
  nearestValidPointFilter(3, 4, [
    [1, 4],
    [3, 1],
    [3, 4],
  ]),
); // 2
console.log(nearestValidPointFilter(3, 4, [[2, 3]])); // -1
```

### Solution 3: Reduce approach

```typescript
/**
 * Reduce over points collecting (bestIdx, bestDist)
 * Time: O(n) | Space: O(1)
 */
function nearestValidPointReduce(x: number, y: number, points: number[][]): number {
  const { idx } = points.reduce(
    (acc, [px, py], i) => {
      if (px !== x && py !== y) return acc;
      const dist = Math.abs(x - px) + Math.abs(y - py);
      return dist < acc.dist ? { idx: i, dist } : acc;
    },
    { idx: -1, dist: Infinity },
  );
  return idx;
}

// Tests
console.log(
  nearestValidPointReduce(3, 4, [
    [1, 4],
    [3, 1],
    [3, 4],
  ]),
); // 2
console.log(nearestValidPointReduce(3, 4, [[2, 3]])); // -1
console.log(
  nearestValidPointReduce(0, 0, [
    [0, 5],
    [5, 0],
    [0, 0],
  ]),
); // 2
```

## 🔗 Related Problems

| #    | Problem                                 | Difficulty | Tags           |
| ---- | --------------------------------------- | ---------- | -------------- |
| 973  | K Closest Points to Origin              | Medium     | Array, Sorting |
| 1030 | Matrix Cells in Distance Order          | Easy       | Array, Sorting |
| 1266 | Minimum Time Visiting All Points        | Easy       | Array          |
| 2280 | Minimum Lines to Represent a Line Chart | Medium     | Array, Math    |
