---
layout: page
title: "Max Points on a Line"
difficulty: Hard
category: Array
tags: [Array, Hash Table, Math, Geometry]
leetcode_url: "https://leetcode.com/problems/max-points-on-a-line"
---

# Max Points on a Line / Số Điểm Tối Đa Trên Một Đường Thẳng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Minimum Area Rectangle](https://leetcode.com/problems/minimum-area-rectangle) | [Count Lattice Points Inside a Circle](https://leetcode.com/problems/count-lattice-points-inside-a-circle)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đứng tại mỗi điểm trên bản đồ và nhìn ra xung quanh — bạn đếm xem có bao nhiêu ngôi nhà nằm thẳng hàng với bạn theo từng hướng. Với mỗi điểm neo, bạn nhóm các điểm khác theo hệ số góc (slope). Hai điểm nằm cùng đường thẳng qua điểm neo nếu và chỉ nếu chúng có cùng slope.

**Pattern Recognition:**

- Signal: "collinear points" + "group by slope" → fix anchor point, hash slope of all other points
- Slope as fraction: `dy/dx` reduced by GCD → exact rational, no float precision issues
- Handle vertical lines (`dx=0`) and duplicate points separately

**Visual — `points = [[1,1],[2,2],[3,3],[1,4]]` anchor = [1,1]:**

```
Anchor: (1,1)
  → (2,2): slope = (2-1)/(2-1) = 1/1  → key "1/1"   count=1
  → (3,3): slope = (3-1)/(3-1) = 2/2  → gcd=2 → "1/1" count=2
  → (1,4): slope = (4-1)/(1-1) → dx=0 → key "vertical" count=1

max for anchor (1,1) = max(2, 1) + 1(self) = 3
Answer: 3  ✅
```

---

## Problem Description

Given an array of `points` where `points[i] = [xi, yi]`, return the maximum number of points that lie on the same straight line.

**Example 1:** `points = [[1,1],[2,2],[3,3]]` → `3`

**Example 2:** `points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]` → `4`

Constraints:

- `1 <= points.length <= 300`
- `points[i].length == 2`
- `-10^4 <= xi, yi <= 10^4`
- All points are unique

---

## 📝 Interview Tips

1. **Clarify**: "Có điểm trùng nhau không? Points đều unique theo đề" / Confirm no duplicate points as per constraints
2. **Brute force**: "Kiểm tra tất cả bộ 3 điểm — O(n³)" / Check every triplet for collinearity — O(n³)
3. **Optimize**: "Fix anchor, nhóm điểm còn lại theo slope — O(n²)" / For each anchor point, hash slopes of all others
4. **Float pitfall**: "Không dùng float cho slope — mất precision" / Never use float division for slope; use GCD-reduced fraction
5. **Edge cases**: "Chỉ 1 điểm → return 1; slope thẳng đứng (dx=0)" / Single point returns 1; vertical lines need special key
6. **Complexity**: "O(n²) time với GCD tính trong O(log(max_coord))" / O(n²) overall with O(log V) per GCD call

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check all pairs of points, count collinear
 * Time: O(n³) — for each pair of points, scan all others
 * Space: O(1)
 */
function maxPointsBrute(points: number[][]): number {
  const n = points.length;
  if (n <= 2) return n;
  let result = 2;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // line through i and j: count all points on it
      let count = 2;
      const [x1, y1] = points[i],
        [x2, y2] = points[j];
      for (let k = 0; k < n; k++) {
        if (k === i || k === j) continue;
        const [x3, y3] = points[k];
        // collinear: cross product == 0
        if ((x2 - x1) * (y3 - y1) === (x3 - x1) * (y2 - y1)) count++;
      }
      result = Math.max(result, count);
    }
  }
  return result;
}

/**
 * Helper: greatest common divisor
 */
function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

/**
 * Solution 2: Optimized — fix anchor, group by slope using GCD fraction key
 * Time: O(n²) — for each of n anchors, process n-1 other points
 * Space: O(n) — slope map per anchor (reset each outer iteration)
 */
function maxPoints(points: number[][]): number {
  const n = points.length;
  if (n <= 2) return n;
  let result = 1;

  for (let i = 0; i < n; i++) {
    const slopeMap = new Map<string, number>();
    let samePoint = 0;
    let localMax = 0;

    for (let j = i + 1; j < n; j++) {
      let dx = points[j][0] - points[i][0];
      let dy = points[j][1] - points[i][1];

      if (dx === 0 && dy === 0) {
        samePoint++; // duplicate point
        continue;
      }

      // Normalize slope as reduced fraction "dy/dx"
      // Keep denominator positive for consistent sign
      const g = gcd(Math.abs(dx), Math.abs(dy));
      dx /= g;
      dy /= g;
      if (dx < 0) {
        dx = -dx;
        dy = -dy;
      } // canonical form: dx >= 0
      const key = `${dy}/${dx}`;

      const cnt = (slopeMap.get(key) ?? 0) + 1;
      slopeMap.set(key, cnt);
      localMax = Math.max(localMax, cnt);
    }

    // +1 for anchor itself, +samePoint for duplicates
    result = Math.max(result, localMax + samePoint + 1);
  }
  return result;
}

// === Test Cases ===
console.log(
  maxPoints([
    [1, 1],
    [2, 2],
    [3, 3],
  ]),
); // 3
console.log(
  maxPoints([
    [1, 1],
    [3, 2],
    [5, 3],
    [4, 1],
    [2, 3],
    [1, 4],
  ]),
); // 4
console.log(maxPoints([[0, 0]])); // 1
console.log(
  maxPoints([
    [0, 0],
    [1, 1],
    [0, 0],
  ]),
); // 3 (duplicates)
console.log(
  maxPoints([
    [2, 3],
    [3, 3],
    [-5, 3],
  ]),
); // 3 (horizontal)
```
