---
layout: page
title: "Line Reflection"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Math]
leetcode_url: "https://leetcode.com/problems/line-reflection"
---

# Line Reflection / Phản Chiếu Đường Thẳng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống **gương soi** đặt dọc — ta cần tìm đường thẳng dọc `x = mid` sao cho mọi điểm `(x, y)` có đối xứng `(2*mid - x, y)` trong tập. Đường gương duy nhất: `x = (xMin + xMax) / 2`. Dùng `2×mid` để tránh số thực.

```
points = [[1,1],[-1,1]]
xMin=-1, xMax=1 → doubleMid=0
(-1,1): reflect x = 0-(-1)=1 → (1,1) in set ✅
(1,1):  reflect x = 0-1=-1  → (-1,1) in set ✅ → true

points = [[1,1],[-1,-1]]
(-1,-1): reflect x = 0-(-1)=1 → (1,-1) NOT in set ❌ → false
```

---

## Problem Description / Mô Tả Bài Toán

Cho tập điểm `points[i] = [xi, yi]`. Kiểm tra xem có tồn tại **đường thẳng dọc** `x = c` sao cho tất cả điểm đều có điểm đối xứng qua đó trong tập.

- **Input:** `points=[[1,1],[-1,1]]` → **Output:** `true`
- **Input:** `points=[[1,1],[-1,-1]]` → **Output:** `false`

**Constraints:** `1 <= points.length <= 10^4`, `-10^8 <= xi, yi <= 10^8`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Only one candidate line: x = (xMin + xMax) / 2. **VI:** Chỉ một đường gương khả thi: x = (xMin + xMax) / 2.
2. **EN:** Use doubled midLine = xMin + xMax (integer) to avoid floating-point. **VI:** Dùng doubleMid = xMin + xMax (số nguyên) để tránh số thực.
3. **EN:** For each point (x, y), its reflection is (doubleMid - x, y). **VI:** Điểm (x, y) có đối xứng là (doubleMid - x, y).
4. **EN:** Store points as "x,y" strings in a Set for O(1) lookup. **VI:** Lưu điểm dạng "x,y" vào Set để tra O(1).
5. **EN:** Duplicate points are fine — they reflect to themselves (appear twice in set lookup, same result). **VI:** Điểm trùng ổn — tự phản chiếu với chính mình.
6. **EN:** Time O(n), Space O(n). Edge: single point → always true. **VI:** O(n) thời gian/không gian. Một điểm → luôn true.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: HashSet + Integer doubleMid  O(n) time, O(n) space ──────────
function isReflected(points: number[][]): boolean {
  const pointSet = new Set<string>();
  let xMin = Infinity,
    xMax = -Infinity;

  for (const [x, y] of points) {
    pointSet.add(`${x},${y}`);
    xMin = Math.min(xMin, x);
    xMax = Math.max(xMax, x);
  }

  // doubleMid = xMin + xMax (avoids floating point from dividing by 2)
  const doubleMid = xMin + xMax;

  for (const [x, y] of points) {
    const reflectedX = doubleMid - x;
    if (!pointSet.has(`${reflectedX},${y}`)) return false;
  }

  return true;
}

// ─── Solution 2: Sort per Y-group + Two Pointers  O(n log n) ─────────────────
function isReflectedSort(points: number[][]): boolean {
  let xMin = Infinity,
    xMax = -Infinity;
  const byY = new Map<number, number[]>();

  for (const [x, y] of points) {
    xMin = Math.min(xMin, x);
    xMax = Math.max(xMax, x);
    if (!byY.has(y)) byY.set(y, []);
    byY.get(y)!.push(x);
  }

  const doubleMid = xMin + xMax;

  for (const [, xs] of byY) {
    const sorted = [...new Set(xs)].sort((a, b) => a - b);
    let l = 0,
      r = sorted.length - 1;
    while (l <= r) {
      if (sorted[l] + sorted[r] !== doubleMid) return false;
      l++;
      r--;
    }
  }

  return true;
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(
  isReflected([
    [1, 1],
    [-1, 1],
  ]),
); // true
console.log(
  isReflected([
    [1, 1],
    [-1, -1],
  ]),
); // false
console.log(
  isReflected([
    [0, 0],
    [1, 0],
    [3, 0],
  ]),
); // false
console.log(
  isReflected([
    [1, 1],
    [1, 1],
    [-1, 1],
  ]),
); // true (duplicates ok)
console.log(
  isReflectedSort([
    [1, 1],
    [-1, 1],
  ]),
); // true
console.log(
  isReflectedSort([
    [0, 0],
    [1, 0],
    [3, 0],
  ]),
); // false
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                    | Difficulty | Pattern     |
| ---- | ---------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| 149  | [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line)                                 | 🔴 Hard    | Math + Hash |
| 587  | [Erect the Fence](https://leetcode.com/problems/erect-the-fence)                                           | 🔴 Hard    | Geometry    |
| 1131 | [Maximum of Absolute Value Expression](https://leetcode.com/problems/maximum-of-absolute-value-expression) | 🟡 Medium  | Math        |
