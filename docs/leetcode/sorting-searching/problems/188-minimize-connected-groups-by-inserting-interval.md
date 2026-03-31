---
layout: page
title: "Minimize Connected Groups by Inserting Interval"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/minimize-connected-groups-by-inserting-interval"
---

# Minimize Connected Groups by Inserting Interval / Tối Thiểu Nhóm Kết Nối Khi Chèn Khoảng

🟡 Medium | 🏷️ Array, Binary Search, Sliding Window, Sorting

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Bạn có nhiều đoạn thẳng trên trục số. Bạn được chèn thêm một đoạn mới dài `intervalSize`. Mục tiêu: tối thiểu số "nhóm" (connected components) sau khi merge tất cả đoạn chồng lên nhau. Trước tiên, merge các đoạn hiện có thành các group rời rạc. Sau đó, dùng sliding window để tìm xem một đoạn mới có thể "nối" nhiều nhất bao nhiêu group liên tiếp.

```
intervals = [[1,3],[5,7],[10,12]], size=4
Merged groups: [1,3], [5,7], [10,12]  → 3 groups, gaps=[1,2]
New interval of size 4 can bridge gap ≤ 4:
  Cover [3, 7]: bridges group0+group1 → merges 2, leaves 1 separate → 3-2+1=2
  Cover [7,11]: bridges group1+group2 → 3-2+1=2
Best = 2
```

## Problem Description

Given a 2D array `intervals` (sorted, non-overlapping) and an integer `intervalSize`, insert one new interval of length `intervalSize` to **minimize** the number of connected groups. Return that minimum count.

**Example 1:** `intervals = [[1,3],[5,7],[10,12]], intervalSize = 4` → `2`

**Example 2:** `intervals = [[1,4],[5,6]], intervalSize = 3` → `1`

## 📝 Interview Tips

- 🔑 **Two-phase / Hai bước:** (1) Merge intervals into groups; (2) sliding window on groups to find max bridgeable
- 🔑 **Sliding window / Cửa sổ trượt:** Window valid while `groups[right].start - groups[left].end <= intervalSize`
- 🔑 **Answer formula / Công thức:** `totalGroups - maxBridged + 1`
- ⚠️ **Off-by-one / Lệch 1:** New interval covers `[a, a + intervalSize]` — length = intervalSize, so span = intervalSize
- ⚠️ **Already merged / Đã merge:** Input may have overlapping intervals; always merge first
- 🔗 **Pattern / Mẫu:** Merge intervals + sliding window on merged result

## Solutions

### Solution 1: Merge + Sliding Window

```typescript
/**
 * Merge overlapping intervals, then use sliding window to find max groups bridgeable.
 * Time: O(n log n)  Space: O(n)
 */
function minConnectedGroups(intervals: number[][], intervalSize: number): number {
  if (intervals.length === 0) return 1;

  // Step 1: Sort and merge intervals
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1] + 1) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      merged.push([...intervals[i]]);
    }
  }

  const g = merged.length;
  if (g === 1) return 1;

  // Step 2: Sliding window — find max groups covered by one interval of intervalSize
  let maxCovered = 1;
  let left = 0;

  for (let right = 0; right < g; right++) {
    // New interval needs to span from merged[left].end+1 to merged[right].start
    // so required size = merged[right].start - merged[left].end - 1 + (right-left groups)
    // Actually: new interval covers [merged[left].end, merged[left].end + intervalSize]
    // It covers merged[right] if merged[right].start <= merged[left].end + intervalSize
    while (merged[right][0] - merged[left][1] > intervalSize) {
      left++;
    }
    maxCovered = Math.max(maxCovered, right - left + 1);
  }

  return g - maxCovered + 1;
}

console.log(
  minConnectedGroups(
    [
      [1, 3],
      [5, 7],
      [10, 12],
    ],
    4,
  ),
); // 2
console.log(
  minConnectedGroups(
    [
      [1, 4],
      [5, 6],
    ],
    3,
  ),
); // 1
console.log(
  minConnectedGroups(
    [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
    0,
  ),
); // 3
console.log(minConnectedGroups([[1, 10]], 5)); // 1
```

### Solution 2: Binary Search Per Right Endpoint

```typescript
/**
 * For each right group boundary, binary search for the leftmost group whose
 * end is within intervalSize of the right group's start.
 * Time: O(n log n)  Space: O(n)
 */
function minConnectedGroupsBin(intervals: number[][], intervalSize: number): number {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1] + 1) last[1] = Math.max(last[1], intervals[i][1]);
    else merged.push([...intervals[i]]);
  }

  const g = merged.length;
  let maxCovered = 1;

  for (let r = 0; r < g; r++) {
    // Find leftmost l where merged[l].end >= merged[r].start - intervalSize
    const target = merged[r][0] - intervalSize;
    let lo = 0,
      hi = r;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (merged[mid][1] < target) lo = mid + 1;
      else hi = mid;
    }
    maxCovered = Math.max(maxCovered, r - lo + 1);
  }

  return g - maxCovered + 1;
}

console.log(
  minConnectedGroupsBin(
    [
      [1, 3],
      [5, 7],
      [10, 12],
    ],
    4,
  ),
); // 2
console.log(
  minConnectedGroupsBin(
    [
      [1, 4],
      [5, 6],
    ],
    3,
  ),
); // 1
```

## 🔗 Related Problems

| Problem                                                                                                                 | Difficulty | Pattern                  |
| ----------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------ |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals/)                                                       | Medium     | Sort + merge             |
| [Insert Interval](https://leetcode.com/problems/insert-interval/)                                                       | Medium     | Linear merge             |
| [Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) | Medium     | Greedy intervals         |
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)                                   | Medium     | Greedy / DP on intervals |
