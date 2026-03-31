---
layout: page
title: "Minimum Number of Arrows to Burst Balloons"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons"
---

# Minimum Number of Arrows to Burst Balloons / Số Mũi Tên Tối Thiểu Để Bắn Vỡ Bóng Bay

> **Difficulty**: 🟡 Medium | **Category**: Sorting-Searching | **Pattern**: Greedy Interval Merging

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như bắn tên vào hàng bóng bay treo trên dây — một mũi tên bay thẳng đứng bắn vỡ tất cả bóng có vùng trùng nhau. Cứ bắn tại điểm kết thúc sớm nhất để bao phủ nhiều bóng nhất.

**Pattern Recognition:**

- Overlapping intervals → shoot at one position to hit all → **Greedy**
- Sort by end position → fire at earliest end → extend coverage greedily
- New arrow only when next balloon starts AFTER current arrow position

**Visual:**

```
points=[[10,16],[2,8],[1,6],[7,12]]
Sort by end: [[1,6],[2,8],[7,12],[10,16]]
  Arrow 1 at x=6: hits [1,6] ✓ and [2,8] ✓
  [7,12]: 7 > 6 → new arrow at x=12: hits [7,12] ✓ and [10,16] ✓
  Total = 2 arrows
```

## Problem Description

There are some spherical balloons taped onto a flat wall, represented as `points[i]=[xstart, xend]`. Arrows shot vertically burst any balloon whose range includes the arrow's x-coordinate (inclusive). Return the minimum number of arrows needed to burst all balloons.

**Example:**

- points=[[10,16],[2,8],[1,6],[7,12]] → 2
- points=[[1,2],[3,4],[5,6],[7,8]] → 4
- points=[[1,2],[2,3],[3,4],[4,5]] → 2

**Constraints:** 1 ≤ points.length ≤ 10⁵, -2³¹ ≤ xstart < xend ≤ 2³¹-1

## 📝 Interview Tips

1. **Clarify**: Are boundary points inclusive? (Yes: [1,2] burst by arrow at x=2)
2. **Approach**: Sort by end coordinate, greedily fire at current end, skip overlapping balloons
3. **Edge cases**: All balloons overlap completely, no overlap at all, single balloon
4. **Optimize**: This is already O(n log n) — optimal
5. **Follow-up**: Minimum arrows if each arrow can burst only one balloon at a time?
6. **Complexity**: Time O(n log n), Space O(1)

## Solutions

```typescript
// Solution 1: Greedy — Sort by End — Time: O(n log n) | Space: O(1)
function findMinArrowShots(points: number[][]): number {
  if (points.length === 0) return 0;
  // Sort by end position
  points.sort((a, b) => a[1] - b[1]);

  let arrows = 1;
  let arrowPos = points[0][1];

  for (let i = 1; i < points.length; i++) {
    // If balloon starts after current arrow, need new arrow
    if (points[i][0] > arrowPos) {
      arrows++;
      arrowPos = points[i][1];
    }
    // Otherwise, current arrow already bursts this balloon
  }

  return arrows;
}

// Solution 2: Sort by Start + Track overlap end — Time: O(n log n) | Space: O(1)
function findMinArrowShots2(points: number[][]): number {
  points.sort((a, b) => a[0] - b[0]);

  let arrows = 0;
  let i = 0;

  while (i < points.length) {
    arrows++;
    let end = points[i][1]; // current overlap end
    i++;
    // Merge all overlapping balloons
    while (i < points.length && points[i][0] <= end) {
      end = Math.min(end, points[i][1]); // tighten overlap window
      i++;
    }
  }

  return arrows;
}

// Solution 3: Explicit interval merging — Time: O(n log n) | Space: O(1)
function findMinArrowShots3(points: number[][]): number {
  if (!points.length) return 0;
  points.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let prevEnd = -Infinity;

  for (const [start, end] of points) {
    if (start > prevEnd) {
      // No overlap with last group — fire new arrow
      count++;
      prevEnd = end;
    }
    // Otherwise this balloon is already burst
  }

  return count;
}

// Tests
console.log(
  findMinArrowShots([
    [10, 16],
    [2, 8],
    [1, 6],
    [7, 12],
  ]),
); // 2
console.log(
  findMinArrowShots([
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
  ]),
); // 4
console.log(
  findMinArrowShots([
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
  ]),
); // 2
console.log(findMinArrowShots([[1, 2]])); // 1
console.log(
  findMinArrowShots([
    [-2147483646, -2147483645],
    [2147483646, 2147483647],
  ]),
); // 2
```

## 🔗 Related Problems

| Problem                                                                              | Relationship                    |
| ------------------------------------------------------------------------------------ | ------------------------------- |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) | Same greedy — sort by end       |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii)                   | Count max overlapping intervals |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals)                     | Combine overlapping intervals   |
