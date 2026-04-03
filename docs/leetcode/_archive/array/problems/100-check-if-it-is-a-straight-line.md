---
layout: page
title: "Check If It Is a Straight Line"
difficulty: Easy
category: Array
tags: [Array, Math, Geometry]
leetcode_url: "https://leetcode.com/problems/check-if-it-is-a-straight-line"
---

# Check If It Is a Straight Line / Kiểm Tra Điểm Thẳng Hàng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math / Geometry
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Tưởng tượng bạn đang kiểm tra xem hàng cột điện trên đường có thẳng hàng không. Thay vì đo góc nghiêng (dễ bị lỗi khi cột thẳng đứng), bạn dùng **tích chéo** — nhân chéo 2 vector để so sánh hướng mà không cần phép chia.

**Pattern Recognition:**

- 3 điểm thẳng hàng ↔ cross product của 2 vector = 0
- Tránh dùng slope = dy/dx vì chia cho 0 khi đường thẳng đứng
- Dùng `(dy) * (dx2) == (dy2) * (dx)` thay vì `dy/dx == dy2/dx2`

**Visual:**

```
points = [[1,2],[2,3],[3,4],[4,5]]
dx = 2-1 = 1, dy = 3-2 = 1  (base vector from p0 to p1)

Check i=2: cross = (4-2)*1 - (3-1)*1 = 2 - 2 = 0 ✅
Check i=3: cross = (5-2)*1 - (4-1)*1 = 3 - 3 = 0 ✅
→ true

points = [[1,1],[2,2],[3,4]]
dx=1, dy=1
Check i=2: cross = (4-1)*1 - (3-1)*1 = 3 - 2 = 1 ≠ 0 ❌
→ false
```

## Problem Description

Given an array of coordinates `coordinates[i] = [x, y]`, return `true` if and only if all given points form a straight line in the XY plane.

**Example 1:** `coordinates = [[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]` → `true`

**Example 2:** `coordinates = [[1,1],[2,2],[3,4],[4,5],[5,6],[7,7]]` → `false`

**Constraints:** `2 <= coordinates.length <= 1000`, `-10^4 <= xi, yi <= 10^4`, all points are distinct.

## 📝 Interview Tips

1. **Clarify**: Có đảm bảo ít nhất 2 điểm không? — Yes, constraints guarantee ≥ 2 points; 2 points always form a line.
2. **Approach**: Tại sao không dùng slope? — Division by zero for vertical lines; use cross product instead.
3. **Edge cases**: 2 điểm → luôn true; đường thẳng đứng x=const → cross product handles correctly.
4. **Optimize**: O(n) đã là tối ưu — Must check every point; can't do better than O(n).
5. **Test**: Thử `[[0,0],[0,1],[0,2]]` (dọc) và `[[0,0],[1,0],[2,0]]` (ngang) — both should return true.
6. **Follow-up**: Nếu cho phép noise nhỏ → dùng least squares fit và check R² ≥ threshold.

## Solutions

```typescript
/** Solution 1: Cross Product — check every point collinear with first two
 * Time: O(n) | Space: O(1)
 */
function checkStraightLine(coordinates: number[][]): boolean {
  const [x0, y0] = coordinates[0];
  const [x1, y1] = coordinates[1];
  const dx = x1 - x0;
  const dy = y1 - y0;

  for (let i = 2; i < coordinates.length; i++) {
    const [xi, yi] = coordinates[i];
    // Cross product of vectors (dx,dy) and (xi-x0, yi-y0) must be 0
    if ((yi - y0) * dx !== (xi - x0) * dy) return false;
  }
  return true;
}

/** Solution 2: Reduce to bool with every() — same math, more idiomatic
 * Time: O(n) | Space: O(1)
 */
function checkStraightLine2(coordinates: number[][]): boolean {
  const [[x0, y0], [x1, y1]] = coordinates;
  const dx = x1 - x0;
  const dy = y1 - y0;
  return coordinates.every(([xi, yi]) => (yi - y0) * dx === (xi - x0) * dy);
}

/** Solution 3: Slope as fraction (GCD-normalized) — alternative for interview discussion
 * Time: O(n log(max)) | Space: O(1)
 */
function checkStraightLine3(coordinates: number[][]): boolean {
  if (coordinates.length <= 2) return true;
  const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const slope = (a: number[], b: number[]): string => {
    const dy = b[1] - a[1],
      dx = b[0] - a[0];
    if (dx === 0) return "INF";
    const g = gcd(Math.abs(dy), Math.abs(dx));
    return `${dx < 0 ? -dy / g : dy / g}/${dx < 0 ? -dx / g : dx / g}`;
  };
  const base = slope(coordinates[0], coordinates[1]);
  return coordinates.slice(2).every((p) => slope(coordinates[0], p) === base);
}

// Test cases
console.log(
  checkStraightLine([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
  ]),
); // true
console.log(
  checkStraightLine([
    [1, 1],
    [2, 2],
    [3, 4],
    [4, 5],
    [5, 6],
    [7, 7],
  ]),
); // false
console.log(
  checkStraightLine([
    [0, 0],
    [0, 1],
    [0, 2],
  ]),
); // true (vertical)
console.log(
  checkStraightLine2([
    [1, 2],
    [2, 3],
    [3, 4],
  ]),
); // true
console.log(
  checkStraightLine3([
    [0, 0],
    [1, 0],
    [2, 0],
  ]),
); // true (horizontal)
```

## 🔗 Related Problems

| Problem                                                                                | Relationship                                            |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line)             | Same cross-product technique; find max collinear subset |
| [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) | Geometry + distance without sqrt                        |
| [Minimum Area Rectangle](https://leetcode.com/problems/minimum-area-rectangle)         | Geometry with point-set operations                      |
