---
layout: page
title: "Non-overlapping Intervals"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/non-overlapping-intervals"
---

# Non-overlapping Intervals / Khoảng Không Chồng Lấp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy (Interval Scheduling)
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons) | [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn là người quản lý phòng họp. Nhiều cuộc họp cùng xin đặt phòng, bạn muốn loại bỏ ít cuộc họp nhất để không cuộc nào bị trùng giờ. Bí quyết: ưu tiên giữ những cuộc họp kết thúc sớm nhất — chúng "chiếm" phòng ít nhất, để lại nhiều chỗ cho các cuộc họp sau.

**Pattern Recognition:**

- Signal: "remove minimum intervals to make non-overlapping" → **Greedy: sort by end time**
- Keep max non-overlapping intervals → remove = total - kept
- Key insight: luôn chọn interval kết thúc sớm nhất để tối đa hóa chỗ trống

**Visual — intervals = [[1,2],[2,3],[3,4],[1,3]]:**

```
Sort by end: [[1,2],[2,3],[1,3],[3,4]]
             end=2   end=3   end=3  end=4

Step 1: Keep [1,2], lastEnd=2, kept=1
Step 2: [2,3] starts at 2 ≥ lastEnd=2 → Keep [2,3], lastEnd=3, kept=2
Step 3: [1,3] starts at 1 < lastEnd=3 → REMOVE (overlap), removals=1
Step 4: [3,4] starts at 3 ≥ lastEnd=3 → Keep [3,4], lastEnd=4, kept=3

Kept = 3, Removed = 4-3 = 1 ✅
```

---

## Problem Description

Given an array of intervals `[start, end]`, find the minimum number of intervals to remove to make the rest non-overlapping. ([LeetCode 435](https://leetcode.com/problems/non-overlapping-intervals))

Difficulty: Medium | Acceptance: 55.5%

- **Example 1**: intervals = [[1,2],[2,3],[3,4],[1,3]] → **1** (remove [1,3])
- **Example 2**: intervals = [[1,2],[1,2],[1,2]] → **2** (remove 2 overlapping copies)

Constraints:

- `1 <= intervals.length <= 10^5`
- `intervals[i].length == 2`
- `-5 * 10^4 <= start < end <= 5 * 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Touching intervals (end==start) có overlap không?" / Do touching intervals count as overlapping?
2. **Insight**: "Giữ tối đa interval = bài Interval Scheduling Maximization" / This is the classic ISM problem
3. **Sort key**: "Sort theo end time, không phải start time" / Critical: sort by END not start
4. **Greedy**: "Luôn giữ interval kết thúc sớm nhất trong số không overlap" / Always keep earliest-ending valid interval
5. **Answer**: "Xóa = tổng - giữ được" / removals = total - kept intervals count
6. **Edge cases**: "0 hoặc 1 interval → 0; tất cả overlap → n-1" / Boundary cases

---

## Solutions

```typescript
/**
 * Solution 1: DP (LIS-style) — O(n²)
 * Time: O(n²) — for each interval find best non-overlapping predecessor
 * Space: O(n) — dp array
 */
function eraseOverlapIntervalsDP(intervals: number[][]): number {
  if (intervals.length === 0) return 0;
  intervals.sort((a, b) => a[0] - b[0]);
  const n = intervals.length;

  // dp[i] = max non-overlapping intervals ending at i
  const dp = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // intervals[j] and intervals[i] are non-overlapping if j's end <= i's start
      if (intervals[j][1] <= intervals[i][0]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  const maxKept = Math.max(...dp);
  return n - maxKept;
}

/**
 * Solution 2: Greedy (Optimal) — O(n log n)
 * Time: O(n log n) — sorting dominates
 * Space: O(1) — constant extra space (ignoring sort)
 */
function eraseOverlapIntervals(intervals: number[][]): number {
  if (intervals.length === 0) return 0;

  // Sort by end time — greedy: keep intervals ending earliest
  intervals.sort((a, b) => a[1] - b[1]);

  let removals = 0;
  let lastEnd = -Infinity;

  for (const [start, end] of intervals) {
    if (start >= lastEnd) {
      // Non-overlapping: keep this interval
      lastEnd = end;
    } else {
      // Overlapping: remove it (greedy keeps the one with smaller end, already sorted)
      removals++;
    }
  }

  return removals;
}

// === Test Cases ===
console.log(
  eraseOverlapIntervals([
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 3],
  ]),
); // 1
console.log(
  eraseOverlapIntervals([
    [1, 2],
    [1, 2],
    [1, 2],
  ]),
); // 2
console.log(
  eraseOverlapIntervals([
    [1, 2],
    [2, 3],
  ]),
); // 0
console.log(
  eraseOverlapIntervals([
    [1, 100],
    [11, 22],
    [1, 11],
    [2, 12],
  ]),
); // 2
console.log(eraseOverlapIntervals([])); // 0
```
