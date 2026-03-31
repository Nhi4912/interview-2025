---
layout: page
title: "Best Meeting Point"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Math, Sorting, Matrix]
leetcode_url: "https://leetcode.com/problems/best-meeting-point"
---

# Best Meeting Point / Điểm Gặp Nhau Tốt Nhất

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Minimum Operations to Make a Uni-Value Grid](https://leetcode.com/problems/minimum-operations-to-make-a-uni-value-grid) | [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng một gia đình có nhiều thành viên sống rải rác trên một con phố thẳng. Điểm gặp nhau tối ưu là nhà của người **ở giữa** (median) — không phải trung bình. Bài toán 2D tách rời thành hai bài 1D độc lập.

**Pattern Recognition:**

- Manhattan distance tách được thành row distance + col distance
- Tổng khoảng cách Manhattan nhỏ nhất → **median** của danh sách tọa độ
- Thu thập tọa độ hàng và cột riêng, sort → lấy median

**Visual — Grid với người ở (1):**

```
Grid:        Collect rows: [0, 0, 2]   sorted → median = 0
1 0 0 0 1    Collect cols: [0, 4, 2]   sorted → median = 2
0 0 0 0 0
0 0 1 0 0    Meeting point = (0, 2)
             Total distance = 2 + 2 + 2 = 6 ✅
```

---

## Problem Description

Given an `m x n` binary grid where each `1` represents a person's home, find the meeting point that minimizes the **total travel distance** (Manhattan distance). The meeting point does not have to be at a home location.

- Example 1: `grid = [[1,0,0,0,1],[0,0,0,0,0],[0,0,1,0,0]]` → `6`
- Example 2: `grid = [[1,1]]` → `1`

---

## 📝 Interview Tips

1. **Clarify**: "Grid có thể rỗng không? Có đúng một người không?" / Can grid be empty? Could there be only one person?
2. **Brute force**: "Thử mọi ô, tính tổng khoảng cách — O(m²·n²)" / Try every cell as meeting point, O(m²·n²)
3. **Optimize**: "Tách hàng và cột — median tối thiểu hóa tổng khoảng cách tuyệt đối" / Separate rows & cols; median minimizes sum of absolute deviations
4. **Key insight**: "Thu thập cột theo thứ tự left→right tự động sorted" / Collecting cols left→right gives pre-sorted list
5. **Edge cases**: "Chỉ một người → distance = 0" / Single person → distance 0
6. **Follow-up**: "Nếu dùng Euclidean distance thay Manhattan?" / What if Euclidean distance instead?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try every cell as meeting point
 * Time: O(m²·n²) — for each cell, sum distances to all homes
 * Space: O(1)
 */
function bestMeetingPointBrute(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  let minDist = Infinity;
  for (let mr = 0; mr < m; mr++) {
    for (let mc = 0; mc < n; mc++) {
      let dist = 0;
      for (let r = 0; r < m; r++)
        for (let c = 0; c < n; c++)
          if (grid[r][c] === 1) dist += Math.abs(r - mr) + Math.abs(c - mc);
      minDist = Math.min(minDist, dist);
    }
  }
  return minDist === Infinity ? 0 : minDist;
}

/**
 * Solution 2: Optimal — Median of sorted coordinates (1D decomposition)
 * Time: O(mn) — collect + sort cols O(mn log mn), sum distances O(mn)
 * Space: O(mn) — store row/col coordinates
 */
function bestMeetingPoint(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const rows: number[] = [],
    cols: number[] = [];

  // Collect row coords — already sorted since we iterate row by row
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (grid[r][c] === 1) rows.push(r);

  // Collect col coords — iterate col by col for sorted order
  for (let c = 0; c < n; c++) for (let r = 0; r < m; r++) if (grid[r][c] === 1) cols.push(c);

  const minDist1D = (points: number[]): number => {
    let lo = 0,
      hi = points.length - 1,
      dist = 0;
    while (lo < hi) dist += points[hi--] - points[lo++];
    return dist;
  };

  return minDist1D(rows) + minDist1D(cols);
}

// === Test Cases ===
console.log(
  bestMeetingPoint([
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
  ]),
); // 6
console.log(bestMeetingPoint([[1, 1]])); // 1
console.log(bestMeetingPoint([[1]])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                                  | Pattern          | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------- | ---------- |
| [Minimum Operations to Make a Uni-Value Grid](https://leetcode.com/problems/minimum-operations-to-make-a-uni-value-grid) | Sorting + Median | Medium     |
| [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal)                       | Prefix Sum       | Hard       |
| [Minimum Absolute Difference](https://leetcode.com/problems/minimum-absolute-difference)                                 | Sorting          | Easy       |
| [Best Meeting Point II](https://leetcode.com/problems/best-meeting-point)                                                | Sorting          | Hard       |
