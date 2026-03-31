---
layout: page
title: "Minimize Manhattan Distances"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Math, Geometry, Sorting, Ordered Set]
leetcode_url: "https://leetcode.com/problems/minimize-manhattan-distances"
---

# Minimize Manhattan Distances / Tối Thiểu Hóa Khoảng Cách Manhattan

🔴 Hard

## 🧠 Intuition

> **Hình ảnh:** Khoảng cách Manhattan `|x1-x2| + |y1-y2|` trông phức tạp — nhưng có một phép biến đổi kỳ diệu: xoay 45°. Đặt `u = x+y`, `v = x-y` thì `|x1-x2| + |y1-y2| = max(|u1-u2|, |v1-v2|)`.

```
Point (x,y) → (u=x+y, v=x-y)

Manhattan distance in (x,y) = Chebyshev distance in (u,v)
= max(|u1-u2|, |v1-v2|)
= max(max_u - min_u, max_v - min_v)   (over all pairs)

So: max Manhattan distance = max(range_u, range_v)
where range_u = max(u) - min(u),  range_v = max(v) - min(v)
```

**Chiến lược:** Loại bỏ từng điểm, tính lại max Manhattan distance → chọn điểm nào loại bỏ làm khoảng cách giảm nhiều nhất. O(n log n) với sorted sets.

## 📋 Problem Description

Given `points[i] = [xi, yi]`, remove **exactly one** point to minimize the **maximum Manhattan distance** between any two remaining points. Return that minimum possible maximum distance.

**Example 1:** `points=[[1,2],[3,4],[2,3]]` → `2`
**Example 2:** `points=[[1,1],[1,3],[3,3],[3,1]]` → `2`

**Constraints:** `3 ≤ n ≤ 10^5`, `-10^8 ≤ xi, yi ≤ 10^8`

## 📝 Interview Tips

- **Key math trick:** Manhattan → Chebyshev rotation: `u=x+y, v=x-y`
- **Max Manhattan dist = max(max_u - min_u, max_v - min_v)**
- **Remove candidate:** The point achieving max/min u or max/min v is a removal candidate (≤4 candidates)
- **After removal:** Recompute range_u and range_v using second extremes if needed
- **Why only 4 candidates?** The point maximizing/minimizing u or v is the only one that can shrink the range
- **Sorted order:** Use sorted arrays to get second-max/second-min in O(1) after sorting

## 💡 Solutions

### Solution 1: Rotation + Try 4 Candidates — O(n log n)

```typescript
function minimumDistance(points: number[][]): number {
  const n = points.length;
  const u = points.map(([x, y]) => x + y);
  const v = points.map(([x, y]) => x - y);

  // Sort indices by u and v values
  const uIdx = [...Array(n).keys()].sort((a, b) => u[a] - u[b]);
  const vIdx = [...Array(n).keys()].sort((a, b) => v[a] - v[b]);

  // Compute max Manhattan distance excluding point i
  const maxDistExcluding = (skip: number): number => {
    // Range of u excluding skip
    const uMin = uIdx[0] === skip ? u[uIdx[1]] : u[uIdx[0]];
    const uMax = uIdx[n - 1] === skip ? u[uIdx[n - 2]] : u[uIdx[n - 1]];
    // Range of v excluding skip
    const vMin = vIdx[0] === skip ? v[vIdx[1]] : v[vIdx[0]];
    const vMax = vIdx[n - 1] === skip ? v[vIdx[n - 2]] : v[vIdx[n - 1]];

    return Math.max(uMax - uMin, vMax - vMin);
  };

  // Only 4 candidates can reduce the maximum: those at extreme u/v positions
  const candidates = new Set([uIdx[0], uIdx[n - 1], vIdx[0], vIdx[n - 1]]);
  let ans = Infinity;
  for (const c of candidates) {
    ans = Math.min(ans, maxDistExcluding(c));
  }
  return ans;
}
```

### Solution 2: Explicit Sorted Arrays with Top-2 Tracking — O(n log n)

```typescript
function minimumDistanceAlt(points: number[][]): number {
  const n = points.length;

  // Transform coordinates
  const us = points.map(([x, y]) => x + y);
  const vs = points.map(([x, y]) => x - y);

  // Keep top-2 max and min for both u and v (value, index)
  type Extreme = [number, number]; // [value, original_index]
  const topK = (arr: number[], k: number, asc: boolean): Extreme[] => {
    const indexed: Extreme[] = arr.map((v, i) => [v, i]);
    indexed.sort(asc ? (a, b) => a[0] - b[0] : (a, b) => b[0] - a[0]);
    return indexed.slice(0, k);
  };

  const uMaxes = topK(us, 2, false); // two largest u
  const uMins = topK(us, 2, true); // two smallest u
  const vMaxes = topK(vs, 2, false);
  const vMins = topK(vs, 2, true);

  const getExtreme = (extremes: Extreme[], skip: number): number =>
    extremes[0][1] === skip ? extremes[1][0] : extremes[0][0];

  const candidates = new Set([uMaxes[0][1], uMins[0][1], vMaxes[0][1], vMins[0][1]]);
  let ans = Infinity;
  for (const skip of candidates) {
    const uRange = getExtreme(uMaxes, skip) - getExtreme(uMins, skip);
    const vRange = getExtreme(vMaxes, skip) - getExtreme(vMins, skip);
    ans = Math.min(ans, Math.max(uRange, vRange));
  }
  return ans;
}
```

### Solution 3: Brute Force for Verification — O(n²) (interview starter)

```typescript
function minimumDistanceBrute(points: number[][]): number {
  const n = points.length;
  let ans = Infinity;

  for (let skip = 0; skip < n; skip++) {
    let maxDist = 0;
    for (let i = 0; i < n; i++) {
      if (i === skip) continue;
      for (let j = i + 1; j < n; j++) {
        if (j === skip) continue;
        const d = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
        maxDist = Math.max(maxDist, d);
      }
    }
    ans = Math.min(ans, maxDist);
  }
  return ans;
}
```

## 🔗 Related Problems

| Problem                                                                                             | Similarity                      |
| --------------------------------------------------------------------------------------------------- | ------------------------------- |
| [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)             | Geometric distance with sorting |
| [Minimum Area Rectangle](https://leetcode.com/problems/minimum-area-rectangle/)                     | Geometry + sorting              |
| [Maximum Sum of Rectangles](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/)   | 2D optimization                 |
| [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal/) | Distance minimization           |
