---
layout: page
title: "Insert Interval"
difficulty: Medium
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/insert-interval/"
leetcode_number: 57
pattern: "Linear Scan (3-phase merge)"
frequency_tier: 2
companies: [Google, Facebook, Amazon, LinkedIn]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
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

## 🎯 Pattern Trigger / Nhận Dạng

| When you see... | Think... | Template |
|---|---|---|
| Insert new interval into sorted non-overlapping intervals | 3 phases: add all before new (end < newStart), merge overlapping (start ≤ newEnd), add remaining | `while end < newStart: add; while start ≤ newEnd: expand newInterval; add remaining` |
| Sorted input with a single insertion point | Don't re-sort — exploit existing sort order with a linear scan | Identify the insertion zone, process it, and pass through the rest unchanged |
| Two intervals touch at a boundary (e.g. [1,3] and [3,5]) | They overlap — use `<=` not `<` for the merge condition | `intervals[i][0] <= newInterval[1]` — boundary contact counts as overlap |
| Input intervals array is empty | Early return — no phases needed | `if (!intervals.length) return [newInterval]` |

**Memory hook:** "3 phases: trước | gộp | sau — đơn giản nếu nhớ 3 pha"

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

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

> **Understand:** "I have a list of sorted, non-overlapping intervals, and I need to insert a new interval — merging wherever they overlap. Quick confirms: intervals are already sorted by start, guaranteed non-overlapping. Empty intervals array is possible — I should handle that. Touching boundaries like [1,3] and [3,5] — do those merge? I'll assume yes."

> **Match:** "Since input is already sorted, I don't need to re-sort. I can do a single O(n) linear scan split into three clean phases: copy all intervals that end before the new one starts, merge all that overlap with it, then copy the rest."

> **Plan:** "Phase 1: `while intervals[i][1] < newInterval[0]` → push directly. Phase 2: `while intervals[i][0] <= newInterval[1]` → expand newInterval to cover the union. Phase 3: push remaining. This naturally handles the edge case where newInterval goes before everything or after everything."

> **Implement:** "The merge condition `intervals[i][0] <= newInterval[1]` uses `<=` not `<` — boundary-touching intervals must merge. During phase 2, I update `newInterval[0] = min(...)` and `newInterval[1] = max(...)` to track the growing merged interval. I push `newInterval` once after phase 2 exits."

> **Review:** "Trace example 2: [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval=[4,8]. Phase 1: [1,2] ends at 2 < 4 → push. Phase 2: [3,5] start 3≤8 → new=[3,8]; [6,7] start 6≤8 → new=[3,8]; [8,10] start 8≤8 → new=[3,10]; [12,16] start 12>8 → stop. Push [3,10]. Phase 3: push [12,16]. Result: [[1,2],[3,10],[12,16]]. Correct."

---

## 📝 Interview Tips

1. **Clarify**: Can `intervals` be empty? Is `newInterval` guaranteed to have `start <= end`? / Mảng có thể rỗng không? Start có thể bằng end không?
2. **Brute force**: Insert newInterval → re-sort all → single merge-intervals pass. O(n log n) time.
3. **Optimize**: Three-phase single scan — skip non-overlapping before, expand newInterval through all overlaps, append rest. O(n) time.
4. **Edge cases**: Empty intervals; newInterval before/after all; newInterval swallows all existing intervals.
5. **Overlap condition**: Remember it's `intervals[i][0] <= newInterval[1]` (not `<`) — touching intervals at boundary DO overlap.

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| Mistake | Why it happens | Correct approach |
|---|---|---|
| Checking overlap with `<` instead of `<=` | Off-by-one: intervals [1,3] and [3,5] share boundary 3 — they must merge | Use `intervals[i][0] <= newInterval[1]` — touching at boundary counts as overlap |
| Not handling empty intervals array | Forgetting the edge case — the while loops never run but `newInterval` still needs to be pushed | The three-phase structure handles it automatically — phase 2 exits immediately and `newInterval` is pushed; no special case needed if code is structured correctly |
| Not updating newInterval bounds during phase 2 merge | Only updating one bound (max end) but forgetting to also take min of starts | Update both: `newInterval[0] = Math.min(newInterval[0], intervals[i][0])` and `newInterval[1] = Math.max(newInterval[1], intervals[i][1])` |

---

## Solutions

```typescript

/**

- Solution 1: Insert + Sort + Merge (Brute Force)
- Time: O(n log n) — sorting dominates
- Space: O(n) — result array
  */
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

/**

- Solution 2: Three-Phase Linear Scan (Optimal)
- Time: O(n) — single pass; input already sorted
- Space: O(n) — result array
  */
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

```

---

## 🔗 Related Problems

- [Merge Intervals](./22-merge-intervals.md) — same merge logic but sort first
- [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) — greedy removal to minimize overlaps
- [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) — count max concurrent intervals
- [Data Stream as Disjoint Intervals](https://leetcode.com/problems/data-stream-as-disjoint-intervals/) — dynamic insert pattern

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric | Target | Your Result |
|---|---|---|
| Time to solve | ≤ 20 min | ___ min |
| Solution correctness | All test cases pass | ✅ / ❌ |
| Space complexity | O(n) | ___ |
| Explained out loud | Yes | ✅ / ❌ |

**SRS Schedule:** First review → 1 day · Second → 3 days · Third → 7 days · Then → 14 days

| Date | Attempt # | Time (min) | Confidence (1-5) | Notes |
|---|---|---|---|---|
| | | | | |
