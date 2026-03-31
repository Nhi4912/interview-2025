---
layout: page
title: "Meeting Scheduler"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/meeting-scheduler"
---

# Meeting Scheduler / Lịch Họp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers + Interval Intersection
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [4Sum](https://leetcode.com/problems/4sum) | [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Hai người A và B cần tìm khoảng thời gian rảnh chung đủ dài cho cuộc họp. Mỗi người có nhiều slot rảnh. Sort cả hai danh sách, rồi dùng hai con trỏ — ai có slot kết thúc sớm hơn thì tiến trước. Khi tìm được overlap đủ dài, trả về ngay.

```
slots1 = [[10,50],[60,120],[140,210]]
slots2 = [[0,15],[60,70]]
duration = 8

Sort both (already sorted)
i=0,j=0: overlap=[max(10,0),min(50,15)]=[10,15] → len=5 < 8 → advance j
i=0,j=1: overlap=[max(10,60),min(50,70)]=[60,50] → empty → advance i
i=1,j=1: overlap=[max(60,60),min(120,70)]=[60,70] → len=10 >= 8 ✅ return [60,68]
```

---

## Problem Description

Given two lists of time slots `slots1` and `slots2` (each `[start, end]`) and a `duration`, find the **earliest** time slot of length `duration` that works for both people. Return `[start, start+duration]` or `[]` if impossible.

- **Example 1:** `slots1=[[10,50],[60,120],[140,210]], slots2=[[0,15],[60,70]], duration=8` → `[60,68]`
- **Example 2:** `slots1=[[10,50],[60,120],[140,210]], slots2=[[0,15],[60,70]], duration=12` → `[]`

---

## 📝 Interview Tips

- 🔄 **Two pointers:** Sort cả hai, advance pointer của slot kết thúc trước — luôn tìm overlap hợp lệ
- 📐 **Overlap formula:** `[max(s1,s2), min(e1,e2)]` → valid nếu end - start >= duration
- 🎯 **Earliest first:** Trả về kết quả đầu tiên thỏa điều kiện (sort đảm bảo đây là sớm nhất)
- ⚠️ **Advance rule:** Luôn advance slot có end nhỏ hơn — slot đó không thể match bất kỳ slot nào còn lại
- 📊 **Complexity:** O(m log m + n log n) sort + O(m+n) scan
- 💡 **Follow-up:** k người thay vì 2 → merge intersections dần từ trái sang phải

---

## Solutions

### Solution 1: Sort + two pointers

```typescript
/**
 * Sort both slot lists, use two pointers to find earliest overlap
 * Time: O(m log m + n log n)  Space: O(1)
 */
function minAvailableDuration(slots1: number[][], slots2: number[][], duration: number): number[] {
  slots1.sort((a, b) => a[0] - b[0]);
  slots2.sort((a, b) => a[0] - b[0]);

  let i = 0,
    j = 0;
  while (i < slots1.length && j < slots2.length) {
    const start = Math.max(slots1[i][0], slots2[j][0]);
    const end = Math.min(slots1[i][1], slots2[j][1]);

    if (end - start >= duration) return [start, start + duration];

    // Advance the pointer whose slot ends earlier
    if (slots1[i][1] < slots2[j][1]) i++;
    else j++;
  }
  return [];
}

console.log(
  minAvailableDuration(
    [
      [10, 50],
      [60, 120],
      [140, 210],
    ],
    [
      [0, 15],
      [60, 70],
    ],
    8,
  ),
);
// [60, 68]
console.log(
  minAvailableDuration(
    [
      [10, 50],
      [60, 120],
      [140, 210],
    ],
    [
      [0, 15],
      [60, 70],
    ],
    12,
  ),
);
// []
```

### Solution 2: Merged + sorted single scan

```typescript
/**
 * Merge both slot lists, tag each, sort by start — scan for common overlap
 * Time: O((m+n) log(m+n))  Space: O(m+n)
 */
function minAvailableDuration2(slots1: number[][], slots2: number[][], duration: number): number[] {
  // Tag: 0 = person1, 1 = person2
  const all = [...slots1.map((s) => [...s, 0]), ...slots2.map((s) => [...s, 1])].sort(
    (a, b) => a[0] - b[0],
  );

  for (let i = 0; i < all.length - 1; i++) {
    if (all[i][2] !== all[i + 1][2]) {
      const start = Math.max(all[i][0], all[i + 1][0]);
      const end = Math.min(all[i][1], all[i + 1][1]);
      if (end - start >= duration) return [start, start + duration];
    }
  }
  return [];
}

console.log(
  minAvailableDuration2(
    [
      [10, 50],
      [60, 120],
    ],
    [
      [0, 15],
      [60, 70],
    ],
    8,
  ),
);
// [60, 68]
```

---

## 🔗 Related Problems

| Problem                                                                                   | Difficulty | Connection                       |
| ----------------------------------------------------------------------------------------- | ---------- | -------------------------------- |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals/)                         | 🟡 Medium  | Interval manipulation foundation |
| [Interval List Intersections](https://leetcode.com/problems/interval-list-intersections/) | 🟡 Medium  | Two-pointer interval overlap     |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)                       | 🟡 Medium  | Interval scheduling with heap    |
| [Employee Free Time](https://leetcode.com/problems/employee-free-time/)                   | 🔴 Hard    | Multi-person free slot finder    |
| [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/)   | 🟢 Easy    | Two-pointer intersection pattern |
