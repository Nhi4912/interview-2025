---
layout: page
title: "Squirrel Simulation"
difficulty: Medium
category: Array
tags: [Array, Math]
leetcode_url: "https://leetcode.com/problems/squirrel-simulation"
---

# Squirrel Simulation / Mô Phỏng Sóc

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Tiếng Việt:** Tổng chi phí cơ bản = 2 × tổng khoảng cách từ cây đến mỗi hạt (cây → hạt → cây). Con sóc xuất phát từ vị trí riêng cho hạt đầu tiên, tiết kiệm được dist(cây, hạt) - dist(sóc, hạt). Chọn hạt tối đa hóa tiết kiệm.

**English:** Base cost = 2 × sum of dist(tree, nut) for all nuts. The squirrel's starting position only matters for the first nut — it saves dist(tree,nut) but costs dist(squirrel,nut). Maximize the saving.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Squirrel Simulation example:**

```
tree=[2,2], squirrel=[2,2], nuts=[[2,3],[3,3]]

Base = 2*|2-2|+|2-3| + 2*|2-3|+|2-3| = 2*1 + 2*2 = 6

Nut[0]: saving = dist(tree,nut0) - dist(sq,nut0)
              = 1 - 1 = 0
Nut[1]: saving = dist(tree,nut1) - dist(sq,nut1)
              = 2 - 2 = 0

min = 6 - 0 = 6
```

---

## Problem Description

| Problem                                                                                               | Difficulty | Pattern |
| ----------------------------------------------------------------------------------------------------- | ---------- | ------- |
| [Minimum Cost to Connect Sticks](https://leetcode.com/problems/minimum-cost-to-connect-sticks/)       | 🟡 Medium  | Greedy  |
| [Minimum Number of Refueling Stops](https://leetcode.com/problems/minimum-number-of-refueling-stops/) | 🔴 Hard    | Greedy  |
| [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)       | 🟡 Medium  | BFS     |

---

## 📝 Interview Tips

- 🔑 **EN:** Base cost assumes squirrel starts at tree for ALL nuts | **VI:** Chi phí cơ bản giả định sóc xuất phát từ cây cho MỌI hạt
- 🔑 **EN:** Only one nut is fetched from squirrel's starting position | **VI:** Chỉ một hạt được lấy từ vị trí bắt đầu của sóc
- 🔑 **EN:** Saving = dist(tree, nut) - dist(squirrel, nut) — can be negative | **VI:** Tiết kiệm = khoảng cách cây-hạt trừ khoảng cách sóc-hạt — có thể âm
- 🔑 **EN:** Choose nut that maximizes saving to minimize total cost | **VI:** Chọn hạt tối đa hóa tiết kiệm để tối thiểu hóa tổng chi phí
- 🔑 **EN:** Manhattan distance: |r1-r2| + |c1-c2| | **VI:** Khoảng cách Manhattan: |r1-r2| + |c1-c2|
- 🔑 **EN:** O(n) — one pass over all nuts | **VI:** O(n) — một lần duyệt qua tất cả các hạt

---

## Solutions

```typescript
/**
 * Squirrel Simulation — maximize saving over first nut choice
 * Time: O(n) — single pass over nuts
 * Space: O(1)
 */
function minDistance(
  height: number,
  width: number,
  tree: number[],
  squirrel: number[],
  nuts: number[][],
): number {
  const manhattan = (a: number[], b: number[]): number =>
    Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

  let baseCost = 0;
  let maxSaving = -Infinity;

  for (const nut of nuts) {
    const distTreeNut = manhattan(tree, nut);
    baseCost += 2 * distTreeNut;
    // Saving if this nut is picked first by squirrel (instead of going from tree)
    const saving = distTreeNut - manhattan(squirrel, nut);
    maxSaving = Math.max(maxSaving, saving);
  }

  return baseCost - maxSaving;
}

console.log(
  minDistance(
    5,
    7,
    [2, 2],
    [4, 4],
    [
      [3, 0],
      [2, 5],
    ],
  ),
); // 12
console.log(minDistance(1, 3, [0, 1], [0, 0], [[0, 2]])); // 3
console.log(minDistance(2, 2, [0, 0], [0, 1], [[1, 1]])); // 4

/**
 * Same logic with explicit helper and for loop
 * Time: O(n) | Space: O(1)
 */
function minDistance2(
  _height: number,
  _width: number,
  tree: number[],
  squirrel: number[],
  nuts: number[][],
): number {
  function dist(a: number[], b: number[]): number {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  let base = 0;
  let bestSaving = -Infinity;

  for (let i = 0; i < nuts.length; i++) {
    const d = dist(tree, nuts[i]);
    base += 2 * d;
    const saving = d - dist(squirrel, nuts[i]);
    if (saving > bestSaving) bestSaving = saving;
  }

  return base - bestSaving;
}

console.log(
  minDistance2(
    5,
    7,
    [2, 2],
    [4, 4],
    [
      [3, 0],
      [2, 5],
    ],
  ),
); // 12

/**
 * Functional style using reduce
 * Time: O(n) | Space: O(1)
 */
function minDistance3(
  _h: number,
  _w: number,
  tree: number[],
  squirrel: number[],
  nuts: number[][],
): number {
  const md = (a: number[], b: number[]) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

  const { base, saving } = nuts.reduce(
    (acc, nut) => {
      const d = md(tree, nut);
      return {
        base: acc.base + 2 * d,
        saving: Math.max(acc.saving, d - md(squirrel, nut)),
      };
    },
    { base: 0, saving: -Infinity },
  );

  return base - saving;
}

console.log(
  minDistance3(
    5,
    7,
    [2, 2],
    [4, 4],
    [
      [3, 0],
      [2, 5],
    ],
  ),
); // 12
```

---

## 🔗 Related Problems

| Problem                                                                                               | Difficulty | Pattern |
| ----------------------------------------------------------------------------------------------------- | ---------- | ------- |
| [Minimum Cost to Connect Sticks](https://leetcode.com/problems/minimum-cost-to-connect-sticks/)       | 🟡 Medium  | Greedy  |
| [Minimum Number of Refueling Stops](https://leetcode.com/problems/minimum-number-of-refueling-stops/) | 🔴 Hard    | Greedy  |
| [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)       | 🟡 Medium  | BFS     |
