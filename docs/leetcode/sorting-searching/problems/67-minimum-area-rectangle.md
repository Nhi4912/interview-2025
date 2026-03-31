---
layout: page
title: "Minimum Area Rectangle"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Hash Table, Math, Geometry, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-area-rectangle"
---

# Minimum Area Rectangle / Hình Chữ Nhật Diện Tích Nhỏ Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hình chữ nhật trục-căn chỉnh có đặc điểm: hai điểm đường chéo xác định hoàn toàn hình chữ nhật. Nếu `(x1,y1)` và `(x2,y2)` là hai góc đối diện, thì hai góc còn lại là `(x1,y2)` và `(x2,y1)`. Chỉ cần kiểm tra xem hai điểm đó có tồn tại trong tập điểm không.

**Pattern Recognition:**

- Duyệt mọi cặp điểm như đường chéo → O(n²) cặp
- HashSet tra cứu O(1) hai điểm còn lại
- Track diện tích nhỏ nhất

**Visual — points = [[1,1],[1,3],[3,1],[3,3],[2,2]]:**

```
  3   ●           ●
  2       ●
  1   ●           ●
      1   2   3

Pair (1,1)-(3,3): check (1,3) ✅ check (3,1) ✅
Area = |3-1| × |3-1| = 4 ✅
```

---

## Problem Description

Given an array of 2D `points` (all distinct) that lie on integer coordinates, return the **minimum area** of any axis-aligned rectangle formed by four of the points. Return `0` if no such rectangle exists.

- Example 1: `points = [[1,1],[1,3],[3,1],[3,3],[2,2]]` → `4`
- Example 2: `points = [[1,1],[1,3],[3,1],[3,3],[4,1],[4,3]]` → `2`

---

## 📝 Interview Tips

1. **Clarify**: "Hình chữ nhật có phải axis-aligned không?" / Must the rectangle be axis-aligned?
2. **Key insight**: "Hai điểm đường chéo xác định đủ hình chữ nhật" / Diagonal pair fully determines the rectangle
3. **Hash lookup**: "Dùng Set với key `x,y` để tra O(1)" / Use Set with string key for O(1) lookup
4. **Skip degenerate**: "Nếu x1 === x2 hoặc y1 === y2 thì không thành hình chữ nhật" / Skip if same x or same y
5. **Edge case**: "Ít hơn 4 điểm → return 0" / Fewer than 4 points → 0
6. **Follow-up**: "Hình chữ nhật bất kỳ góc (không axis-aligned)?" / What about rotated rectangles?

---

## Solutions

```typescript
/**
 * Solution 1: HashSet + Diagonal Pair Enumeration
 * Time: O(n²) — n² pairs, O(1) set lookup each
 * Space: O(n) — point set
 */
function minAreaRect(points: number[][]): number {
  const pointSet = new Set(points.map(([x, y]) => `${x},${y}`));
  let minArea = Infinity;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[j];
      // Skip if not a valid diagonal (same row or col = line not rectangle)
      if (x1 === x2 || y1 === y2) continue;
      // Check if other two corners exist
      if (pointSet.has(`${x1},${y2}`) && pointSet.has(`${x2},${y1}`)) {
        const area = Math.abs(x2 - x1) * Math.abs(y2 - y1);
        minArea = Math.min(minArea, area);
      }
    }
  }

  return minArea === Infinity ? 0 : minArea;
}

/**
 * Solution 2: Group points by x-coordinate, check column pairs
 * Time: O(n² log n) — sort columns then pair
 * Space: O(n)
 */
function minAreaRect2(points: number[][]): number {
  const byX = new Map<number, number[]>();
  for (const [x, y] of points) {
    if (!byX.has(x)) byX.set(x, []);
    byX.get(x)!.push(y);
  }
  for (const ys of byX.values()) ys.sort((a, b) => a - b);

  const lastSeen = new Map<string, number>();
  let minArea = Infinity;
  const xs = [...byX.keys()].sort((a, b) => a - b);

  for (const x of xs) {
    const ys = byX.get(x)!;
    for (let i = 0; i < ys.length; i++) {
      for (let j = i + 1; j < ys.length; j++) {
        const key = `${ys[i]},${ys[j]}`;
        if (lastSeen.has(key)) {
          minArea = Math.min(minArea, (x - lastSeen.get(key)!) * (ys[j] - ys[i]));
        }
        lastSeen.set(key, x);
      }
    }
  }
  return minArea === Infinity ? 0 : minArea;
}

// === Test Cases ===
console.log(
  minAreaRect([
    [1, 1],
    [1, 3],
    [3, 1],
    [3, 3],
    [2, 2],
  ]),
); // 4
console.log(
  minAreaRect([
    [1, 1],
    [1, 3],
    [3, 1],
    [3, 3],
    [4, 1],
    [4, 3],
  ]),
); // 2
console.log(
  minAreaRect([
    [1, 1],
    [2, 2],
    [3, 3],
  ]),
); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                | Pattern            | Difficulty |
| -------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Minimum Area Rectangle II](https://leetcode.com/problems/minimum-area-rectangle-ii)   | Geometry + HashMap | Medium     |
| [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line)             | Math + HashMap     | Hard       |
| [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) | Heap               | Medium     |
| [Rectangle Area](https://leetcode.com/problems/rectangle-area)                         | Math               | Medium     |
