---
layout: page
title: "Widest Vertical Area Between Two Points Containing No Points"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Sorting]
leetcode_url: "https://leetcode.com/problems/widest-vertical-area-between-two-points-containing-no-points"
---

# Widest Vertical Area Between Two Points Containing No Points / Vùng Dọc Rộng Nhất Không Chứa Điểm

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sorting
> **Frequency**: 📗 Tier 3 — Bài khởi động, nền tảng về sort
> **See also**: [Maximum Gap](https://leetcode.com/problems/maximum-gap) | [Minimum Absolute Difference](https://leetcode.com/problems/minimum-absolute-difference)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn nhìn từ trên xuống một sân với nhiều cột đèn. Muốn tìm khoảng trống rộng nhất giữa hai cột liên tiếp không có cột nào khác ở giữa — tức là tìm khoảng cách lớn nhất giữa các tọa độ x liên tiếp sau khi sắp xếp. Y-coordinate không quan trọng vì vùng là dọc (vertical strip).

**Pattern Recognition:**

- Signal: "widest vertical area" + "no points between" → **Sort by x + max gap**
- Y-coordinate hoàn toàn không liên quan — chỉ cần x
- Sau sort, answer = max gap giữa x[i] và x[i-1]

**Visual — points=[[8,7],[9,9],[7,4],[9,7]]:**

```
Extract x: [8, 9, 7, 9]
Sort x:    [7, 8, 9, 9]

Gaps: 8-7=1, 9-8=1, 9-9=0
Max gap = 1 ✅

points=[[3,1],[9,0],[1,0],[1,4],[5,3],[8,8]]:
x sorted: [1,1,3,5,8,9]
Gaps: 0,2,2,3,1 -> max=3 ✅
```

---

## Problem Description

Given 2D `points` array, find the width of the widest vertical area between two consecutive points (sorted by x) that contains no other points.

```
Example 1: points=[[8,7],[9,9],[7,4],[9,7]]                       -> 1
Example 2: points=[[3,1],[9,0],[1,0],[1,4],[5,3],[8,8]]           -> 3
```

---

## 📝 Interview Tips

1. **Ignore y**: Vertical strip không phụ thuộc y-coordinate, extract x only
2. **After sort**: Gap giữa x[i] và x[i-1] là chiều rộng vùng dọc không có điểm
3. **Edge case**: Nhiều điểm cùng x → gap = 0, không ảnh hưởng max
4. **Brute force vs optimal**: O(n^2) check all pairs vs O(n log n) sort — always sort
5. **Hỏi follow-up**: "Widest horizontal area?" → Same logic nhưng sort by y
6. **Complexity**: Time O(n log n), Space O(n) để tách x, hoặc O(1) nếu sort in-place

---

## Solutions

```typescript
/**
 * Solution 1: Sort x-coordinates + Max Gap (Optimal)
 * Time O(n log n), Space O(n)
 *
 * Extract all x values, sort, find maximum consecutive difference.
 * Y-coordinate is irrelevant for vertical area width.
 */
function maxWidthOfVerticalArea(points: number[][]): number {
  const xs = points.map(p => p[0]).sort((a, b) => a - b);
  let maxGap = 0;
  for (let i = 1; i < xs.length; i++) {
    maxGap = Math.max(maxGap, xs[i] - xs[i - 1]);
  }
  return maxGap;
}

/**
 * Solution 2: Sort points by x directly (avoid extra array)
 * Time O(n log n), Space O(1) extra
 */
function maxWidthOfVerticalArea2(points: number[][]): number {
  points.sort((a, b) => a[0] - b[0]);
  let maxGap = 0;
  for (let i = 1; i < points.length; i++) {
    maxGap = Math.max(maxGap, points[i][0] - points[i - 1][0]);
  }
  return maxGap;
}

/**
 * Solution 3: One-liner functional style
 * Time O(n log n), Space O(n)
 */
function maxWidthOfVerticalArea3(points: number[][]): number {
  return points
    .map(p => p[0])
    .sort((a, b) => a - b)
    .reduce((max, x, i, arr) => i === 0 ? 0 : Math.max(max, x - arr[i - 1]), 0);
}

// --- Quick inline tests ---
console.log(maxWidthOfVerticalArea([[8,7],[9,9],[7,4],[9,7]]));  // 1
console.log(maxWidthOfVerticalArea([[3,1],[9,0],[1,0],[1,4],[5,3],[8,8]])); // 3
console.log(maxWidthOfVerticalArea([[1,1],[1,2],[1,3]]));         // 0
console.log(maxWidthOfVerticalArea2([[8,7],[9,9],[7,4],[9,7]])); // 1
console.log(maxWidthOfVerticalArea3([[3,1],[9,0],[1,0],[1,4],[5,3],[8,8]])); // 3
```

---

## 🔗 Related Problems

| Problem | Relationship |
| ------- | ------------ |
| [1637. Widest Vertical Area Between Two Points Containing No Points](https://leetcode.com/problems/widest-vertical-area-between-two-points-containing-no-points/) | This problem |
| [164. Maximum Gap](https://leetcode.com/problems/maximum-gap/) | Same idea, max gap after sort |
| [1200. Minimum Absolute Difference](https://leetcode.com/problems/minimum-absolute-difference/) | Min gap after sort |
| [2612. Minimum Reverse Operations](https://leetcode.com/problems/minimum-reverse-operations/) | Coordinate-based reasoning |
| [179. Largest Number](https://leetcode.com/problems/largest-number/) | Custom sort comparator |
