---
layout: page
title: "Insert Interval"
difficulty: Medium
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/insert-interval/"
---

# Insert Interval / Chèn Khoảng Vào Danh Sách

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Three-Phase Linear Scan
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Merge Intervals](./22-merge-intervals.md) | [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn có một lịch họp đã đặt sẵn và cần thêm một cuộc họp mới vào. Nếu cuộc họp mới chồng lên các cuộc họp cũ, bạn gộp chúng thành một khung giờ duy nhất. Quá trình này chia làm 3 giai đoạn rõ ràng: xử lý các cuộc họp trước khi có chồng lấp, gộp những cái chồng lấp lại, rồi thêm phần còn lại vào sau.

**Pattern Recognition:**

- Signal: "sorted non-overlapping intervals", "insert and merge" → **Three-Phase Linear Scan**
- Overlap condition: two intervals `[a,b]` and `[c,d]` overlap if `a <= d && c <= b`
- No overlap (before): `interval[1] < new[0]`; No overlap (after): `interval[0] > new[1]`
- Input already sorted → single O(n) pass, no sorting needed

**Visual — intervals = [[1,3],[6,9]], newInterval = [2,5]:**

```
Phase 1 — end before new starts (interval[1] < 2):
  [1,3]: 3 < 2? NO → stop. Nothing added yet.

Phase 2 — merge overlapping (interval[0] <= 5):
  [1,3]: 1<=5 AND 3>=2 → merge → new = [min(2,1), max(5,3)] = [1,5]
  [6,9]: 6<=5? NO → stop.
  → push [1,5]

Phase 3 — add remaining:
  [6,9] → push

Result: [[1,5],[6,9]] ✅
```

---

## Problem Description

You are given sorted non-overlapping intervals and a `newInterval`. Insert `newInterval`, merging any overlapping intervals. Return the result in sorted order with no overlaps.

```
Example 1: intervals=[[1,3],[6,9]], newInterval=[2,5]
           → [[1,5],[6,9]]

Example 2: intervals=[[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval=[4,8]
           → [[1,2],[3,10],[12,16]]

Example 3: intervals=[], newInterval=[5,7]  → [[5,7]]
```

Constraints:

- `0 <= intervals.length <= 10^4`
- Intervals sorted by `start`, non-overlapping
- `0 <= start <= end <= 10^5`

---

## 📝 Interview Tips

1. **Clarify**: Can `intervals` be empty? Is `newInterval` guaranteed to have `start <= end`? / Mảng có thể rỗng không? Start có thể bằng end không?
2. **Brute force**: Insert newInterval → re-sort all → single merge-intervals pass. O(n log n) time.
3. **Optimize**: Three-phase single scan — skip non-overlapping before, expand newInterval through all overlaps, append rest. O(n) time.
4. **Edge cases**: Empty intervals; newInterval before/after all; newInterval swallows all existing intervals.
5. **Overlap condition**: Remember it's `intervals[i][0] <= newInterval[1]` (not `<`) — touching intervals at boundary DO overlap.

---

## Solutions

{% raw %}

/\*\*

- Solution 1: Insert + Sort + Merge (Brute Force)
- Time: O(n log n) — sorting dominates
- Space: O(n) — result array
  \*/
  function insertBrute(intervals: number[][], newInterval: number[]): number[][] {
  const all = [...intervals, newInterval].sort((a, b) => a[0] - b[0]);
  const result: number[][] = [];

for (const interval of all) {
if (!result.length || result[result.length - 1][1] < interval[0]) {
result.push([...interval]);
} else {
result[result.length - 1][1] = Math.max(result[result.length - 1][1], interval[1]);
}
}

return result;
}

/\*\*

- Solution 2: Three-Phase Linear Scan (Optimal)
- Time: O(n) — single pass; input already sorted
- Space: O(n) — result array
  \*/
  function insert(intervals: number[][], newInterval: number[]): number[][] {
  const result: number[][] = [];
  let i = 0;
  const n = intervals.length;

// Phase 1: add all intervals that end before newInterval starts (no overlap)
while (i < n && intervals[i][1] < newInterval[0]) {
result.push(intervals[i++]);
}

// Phase 2: merge all overlapping intervals into newInterval
while (i < n && intervals[i][0] <= newInterval[1]) {
newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
i++;
}
result.push(newInterval); // push the fully merged interval

// Phase 3: add remaining intervals (all start after newInterval ends)
while (i < n) {
result.push(intervals[i++]);
}

return result;
}

// === Test Cases ===
console.log(JSON.stringify(insert([[1,3],[6,9]], [2,5])));
// [[1,5],[6,9]]
console.log(JSON.stringify(insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8])));
// [[1,2],[3,10],[12,16]]
console.log(JSON.stringify(insert([], [5,7])));
// [[5,7]]
console.log(JSON.stringify(insert([[1,5]], [2,3])));
// [[1,5]]

{% endraw %}

---

## 🔗 Related Problems

- [Merge Intervals](./22-merge-intervals.md) — same merge logic but sort first
- [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) — greedy removal to minimize overlaps
- [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) — count max concurrent intervals
- [Data Stream as Disjoint Intervals](https://leetcode.com/problems/data-stream-as-disjoint-intervals/) — dynamic insert pattern
