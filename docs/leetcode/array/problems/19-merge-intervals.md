---
layout: page
title: "Merge Intervals"
difficulty: Medium
category: Array
tags: [Array, Sorting, Greedy, Intervals]
leetcode_url: "https://leetcode.com/problems/merge-intervals/"
---

# Merge Intervals / Gộp Các Khoảng Thời Gian

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Merge (Interval)
> **Frequency**: 🔥 Tier 1 — xuất hiện thường xuyên ở Google, Meta dưới dạng lịch họp/lịch trình
> **See also**: [Insert Interval](./23-insert-interval.md) | [Meeting Rooms II](./22-meeting-rooms-ii.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có danh sách các cuộc họp với giờ bắt đầu và kết thúc. Nếu hai cuộc họp chồng lấp nhau (cuộc thứ hai bắt đầu trước khi cuộc đầu kết thúc), gộp chúng lại thành một. Để làm điều này hiệu quả, hãy sắp xếp theo giờ bắt đầu trước — khi đó ta chỉ cần so sánh với khoảng đang xét gần nhất.

**Pattern Recognition:**

- Signal: "overlapping intervals", "merge", "schedule" → **Sort by start + linear scan**
- Sau khi sort, overlap chỉ xảy ra với khoảng ngay liền trước: `current[0] <= last[1]`
- Merge = kéo dài end: `last[1] = max(last[1], current[1])`

**Visual — Merge [1,3],[2,6],[8,10],[15,18]:**

```
Sort by start: [1,3] [2,6] [8,10] [15,18]

[1,3] → result = [[1,3]]
[2,6] → 2 <= 3 (overlap!) → extend: [[1,6]]
[8,10]→ 8 > 6 (no overlap) → add:   [[1,6],[8,10]]
[15,18]→15 > 10 (no overlap)→ add:  [[1,6],[8,10],[15,18]]
```

---

## Problem Description

Given an array of intervals where `intervals[i] = [start, end]`, merge all overlapping intervals and return the non-overlapping result covering all input intervals.

```
Example 1: [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]
Example 2: [[1,4],[4,5]]               → [[1,5]]  (touching = overlapping)
```

Constraints:

- 1 <= intervals.length <= 10⁴
- 0 <= start ≤ end <= 10⁴

---

## 📝 Interview Tips

1. **Clarify**: "Touching intervals như [1,4],[4,5] có được gộp không?" / "Do touching intervals merge?" (yes, overlap = `start <= last_end`)
2. **Brute force**: Sort rồi so sánh từng cặp — O(n log n) time, O(n) space
3. **Optimize**: In-place merge với write pointer — O(n log n) time, O(1) extra space
4. **Edge cases**: 1 interval → trả ngay; interval lồng nhau [1,10],[2,3] → max end quan trọng
5. **Follow-up**: "Insert one new interval vào danh sách đã sorted?" — xem Insert Interval (bài 57)

---

## Solutions

{% raw %}

/\*\*

- Solution 1: Sort + Merge into result array (Standard)
- Time: O(n log n) — dominated by sort; merge scan is O(n)
- Space: O(n) — result array (output space, usually not counted)
  \*/
  function merge(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;

intervals.sort((a, b) => a[0] - b[0]);

const result: number[][] = [intervals[0]];

for (let i = 1; i < intervals.length; i++) {
const current = intervals[i];
const last = result[result.length - 1];

    if (current[0] <= last[1]) {
      // overlap: extend the end of last merged interval
      last[1] = Math.max(last[1], current[1]);
    } else {
      // no overlap: start a new interval
      result.push(current);
    }

}

return result;
}

/\*\*

- Solution 2: Sort + In-place merge with write pointer (Optimal, O(1) extra)
- Time: O(n log n) — same as above
- Space: O(1) extra — modifies input in-place, write pointer compacts result
  \*/
  function mergeInPlace(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;

intervals.sort((a, b) => a[0] - b[0]);

let w = 0; // write pointer

for (let r = 1; r < intervals.length; r++) {
if (intervals[r][0] <= intervals[w][1]) {
intervals[w][1] = Math.max(intervals[w][1], intervals[r][1]);
} else {
w++;
intervals[w] = intervals[r];
}
}

return intervals.slice(0, w + 1);
}

// === Test Cases ===
console.log(JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]]))); // [[1,6],[8,10],[15,18]]
console.log(JSON.stringify(merge([[1,4],[4,5]]))); // [[1,5]]
console.log(JSON.stringify(merge([[1,4],[2,3]]))); // [[1,4]] (nested)
console.log(JSON.stringify(mergeInPlace([[2,3],[4,5],[6,7],[8,9],[1,10]]))); // [[1,10]]

{% endraw %}

---

## 🔗 Related Problems

- [Insert Interval](./23-insert-interval.md) — merge một interval mới vào danh sách đã sorted
- [Meeting Rooms II](./22-meeting-rooms-ii.md) — đếm số phòng tối thiểu (min overlapping count)
