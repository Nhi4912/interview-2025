---
layout: page
title: "Find the Largest Area of Square Inside Two Rectangles"
difficulty: Medium
category: Array
tags: [Array, Math, Geometry]
leetcode_url: "https://leetcode.com/problems/find-the-largest-area-of-square-inside-two-rectangles"
---

# Find the Largest Area of Square Inside Two Rectangles / Diện Tích Hình Vuông Lớn Nhất Trong Hai Hình Chữ Nhật

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VN:** Với mỗi cặp hình chữ nhật, tính phần giao nhau. Cạnh hình vuông lớn nhất bên trong phần giao là `min(chiều rộng, chiều cao)` của phần giao đó.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Find the Largest Area of Square Inside Two Rectangles example:**

```
Rect A: bottomLeft=[1,1] topRight=[3,3]
Rect B: bottomLeft=[2,2] topRight=[4,4]

Intersection:
  x: max(1,2)=2 → min(3,4)=3 → width=1
  y: max(1,2)=2 → min(3,4)=3 → height=1
  side = min(1,1) = 1  → area = 1
```

---

---

## Problem Description

| Problem                                                                                         | Difficulty | Pattern          |
| ----------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Rectangle Area](https://leetcode.com/problems/rectangle-area/)                                 | 🟡 Medium  | Geometry         |
| [Rectangle Overlap](https://leetcode.com/problems/rectangle-overlap/)                           | 🟢 Easy    | Geometry         |
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | 🔴 Hard    | Stack / Geometry |

---

## 📝 Interview Tips

- 🇻🇳 Phần giao của hai hình chữ nhật: `x_overlap = min(r1,r2) - max(l1,l2)`, tương tự cho y.
- 🇺🇸 Intersection width = `min(r1,r2) - max(l1,l2)`; height same for y-axis.
- 🇻🇳 Nếu chiều rộng hoặc chiều cao ≤ 0, không có giao nhau.
- 🇺🇸 If either dimension ≤ 0 the rectangles don't intersect — skip the pair.
- 🇻🇳 Thời gian O(n²) vì cần duyệt mọi cặp; n ≤ 1000 nên chấp nhận được.
- 🇺🇸 O(n²) brute-force over pairs is fine; n ≤ 1000 gives ≤ 500 000 ops.

---

---

## Solutions

```typescript
/**
 * For every pair of rectangles, compute intersection and track max square area.
 * Time: O(n²) | Space: O(1)
 */
function largestSquareArea(bottomLeft: number[][], topRight: number[][]): number {
  let maxArea = 0;
  const n = bottomLeft.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Intersection rectangle
      const w =
        Math.min(topRight[i][0], topRight[j][0]) - Math.max(bottomLeft[i][0], bottomLeft[j][0]);
      const h =
        Math.min(topRight[i][1], topRight[j][1]) - Math.max(bottomLeft[i][1], bottomLeft[j][1]);

      if (w > 0 && h > 0) {
        const side = Math.min(w, h);
        maxArea = Math.max(maxArea, side * side);
      }
    }
  }

  return maxArea;
}

console.log(
  largestSquareArea(
    [
      [1, 1],
      [2, 2],
      [3, 1],
    ],
    [
      [3, 3],
      [4, 4],
      [6, 6],
    ],
  ),
); // 1
console.log(
  largestSquareArea(
    [
      [1, 1],
      [2, 2],
    ],
    [
      [3, 3],
      [4, 4],
    ],
  ),
); // 1
console.log(
  largestSquareArea(
    [
      [0, 0],
      [1, 0],
    ],
    [
      [2, 2],
      [3, 2],
    ],
  ),
); // 0

/**
 * Identical algorithm, destructured for readability.
 * Time: O(n²) | Space: O(1)
 */
function largestSquareArea2(bottomLeft: number[][], topRight: number[][]): number {
  const n = bottomLeft.length;
  let best = 0;

  for (let i = 0; i < n; i++) {
    const [l1, b1] = bottomLeft[i],
      [r1, t1] = topRight[i];
    for (let j = i + 1; j < n; j++) {
      const [l2, b2] = bottomLeft[j],
        [r2, t2] = topRight[j];
      const w = Math.min(r1, r2) - Math.max(l1, l2);
      const h = Math.min(t1, t2) - Math.max(b1, b2);
      if (w > 0 && h > 0) best = Math.max(best, Math.min(w, h) ** 2);
    }
  }

  return best;
}

console.log(
  largestSquareArea2(
    [
      [1, 1],
      [2, 2],
      [3, 1],
    ],
    [
      [3, 3],
      [4, 4],
      [6, 6],
    ],
  ),
); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                         | Difficulty | Pattern          |
| ----------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Rectangle Area](https://leetcode.com/problems/rectangle-area/)                                 | 🟡 Medium  | Geometry         |
| [Rectangle Overlap](https://leetcode.com/problems/rectangle-overlap/)                           | 🟢 Easy    | Geometry         |
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | 🔴 Hard    | Stack / Geometry |
