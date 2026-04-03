---
layout: page
title: "Merge Intervals"
difficulty: Medium
category: Array
tags: [Array, Sorting, Greedy, Intervals]
leetcode_url: "https://leetcode.com/problems/merge-intervals/"
leetcode_number: 56
pattern: "Sort + Merge"
frequency_tier: 1
companies: [Google, Meta, Amazon, Microsoft, Bloomberg]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Merge Intervals / Gộp Các Khoảng Thời Gian

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Merge (Interval)
> **Frequency**: 🔥 Tier 1 — xuất hiện thường xuyên ở Google, Meta dưới dạng lịch họp/lịch trình
> **Target**: ⏱️ 20 min | **Companies**: Google, Meta, Amazon, Microsoft, Bloomberg
> **See also**: [Insert Interval](./23-insert-interval.md) | [Meeting Rooms II](./22-meeting-rooms-ii.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có danh sách các cuộc họp với giờ bắt đầu và kết thúc. Nếu hai cuộc họp chồng lấp nhau (cuộc thứ hai bắt đầu trước khi cuộc đầu kết thúc), gộp chúng lại thành một. Sắp xếp theo giờ bắt đầu — khi đó ta chỉ cần so sánh với khoảng ngay liền trước.

**Pattern Recognition:**

- Signal: "overlapping intervals", "merge", "schedule" → **Sort by start + linear scan**
- Sau khi sort, overlap chỉ xảy ra với khoảng liền trước: `current[0] <= last[1]`
- Merge = kéo dài end: `last[1] = max(last[1], current[1])`

**Visual — Merge [1,3],[2,6],[8,10],[15,18]:**

```
Sort by start: [1,3] [2,6] [8,10] [15,18]

[1,3]  → result = [[1,3]]
[2,6]  → 2 <= 3 (overlap!) → extend: [[1,6]]
[8,10] → 8 > 6 (no overlap) → add:   [[1,6],[8,10]]
[15,18]→ 15 > 10 (no overlap)→ add:  [[1,6],[8,10],[15,18]]
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                        |
| ---------------- | ------------------------------------------------------------------------------- |
| **When you see** | "merge overlapping intervals", "combine ranges", "schedule conflicts"           |
| **Think**        | Sort + Merge — sort by start, linear scan comparing end values                  |
| **Template**     | `intervals.sort((a,b) => a[0]-b[0]); if (cur[0] <= last[1]) last[1] = max(...)` |
| **Time target**  | ⏱️ 20 min (Medium)                                                              |

> 💡 **Memory hook / Móc nhớ:** "Sắp xếp lịch họp → gộp khi chồng chéo — như xếp domino theo thứ tự rồi nối liền"

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

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "Let me make sure I understand. We have an array of intervals [start, end].
> We need to merge all overlapping intervals into non-overlapping ones.
> Clarification: Do touching intervals like [1,4],[4,5] merge? → Yes, since 4 <= 4."

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "If I sort by start time, overlapping intervals become adjacent.
> Then I scan linearly — if current start <= last end, they overlap, extend the end.
> This gives O(n log n) time for sort, O(n) space for result. Should I code this?"

### Step 3 — Implement / Viết Code (5-7 min)

> "I'll sort intervals by start.
> Initialize result with the first interval.
> For each subsequent interval, compare with the last in result — merge or add new."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace: [[1,3],[2,6],[8,10],[15,18]] sorted → same order.
> [1,3] → result. [2,6]: 2<=3 → extend to [1,6]. [8,10]: 8>6 → add. [15,18]: 15>10 → add.
> → [[1,6],[8,10],[15,18]]. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n log n) — dominated by sort. Space: O(n) — result array.
> Edge cases: single interval → return as-is; nested intervals like [1,10],[2,3] → max end handles it.
> Can optimize to O(1) extra space with in-place write pointer approach."

---

## 📝 Interview Tips

1. **Clarify**: "Touching intervals [1,4],[4,5] merge?" / "Khoảng chạm nhau có gộp không?" (yes)
2. **Brute force**: Sort + compare each pair — O(n log n) time, O(n) space
3. **Optimize**: In-place merge with write pointer — O(n log n) time, O(1) extra space
4. **Edge cases**: 1 interval → return; nested [1,10],[2,3] → max end is key
5. **Follow-up**: "Insert one new interval?" → Insert Interval (#57)

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                                                | Why Wrong / Tại sao sai                                  | Fix / Cách sửa                                    |
| --- | ---------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------- |
| 1   | Use `last[1] = current[1]` instead of `max(last[1], current[1])` | Nested intervals like [1,10],[2,3] would shrink to [1,3] | Always use `Math.max(last[1], current[1])`        |
| 2   | Forget to sort first                                             | Unsorted intervals miss non-adjacent overlaps            | Sort by `start` before scanning                   |
| 3   | Modify input while iterating without write pointer               | Index confusion and missed intervals                     | Use separate result array or proper write pointer |

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Merge into result array (Standard)
 * Time: O(n log n) — dominated by sort; merge scan is O(n)
 * Space: O(n) — result array
 */
function merge(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;

  intervals.sort((a, b) => a[0] - b[0]);
  const result: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = result[result.length - 1];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push(current);
    }
  }

  return result;
}

/**
 * Solution 2: Sort + In-place merge with write pointer (Optimal)
 * Time: O(n log n) — same as above
 * Space: O(1) extra — modifies input in-place
 */
function mergeInPlace(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;

  intervals.sort((a, b) => a[0] - b[0]);
  let w = 0;

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
console.log(
  JSON.stringify(
    merge([
      [1, 3],
      [2, 6],
      [8, 10],
      [15, 18],
    ]),
  ),
); // [[1,6],[8,10],[15,18]]
console.log(
  JSON.stringify(
    merge([
      [1, 4],
      [4, 5],
    ]),
  ),
); // [[1,5]]
console.log(
  JSON.stringify(
    merge([
      [1, 4],
      [2, 3],
    ]),
  ),
); // [[1,4]]
console.log(
  JSON.stringify(
    mergeInPlace([
      [2, 3],
      [4, 5],
      [6, 7],
      [8, 9],
      [1, 10],
    ]),
  ),
); // [[1,10]]
```

---

## 🔗 Related Problems

- [Insert Interval](./23-insert-interval.md) — merge một interval mới vào danh sách đã sorted
- [Meeting Rooms II](./22-meeting-rooms-ii.md) — đếm số phòng tối thiểu (min overlapping count)
- [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) — greedy removal

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 20 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
