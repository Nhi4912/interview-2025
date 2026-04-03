---
layout: page
title: "Interval List Intersections"
difficulty: Medium
category: Array
tags: [Array, Two Pointers, Line Sweep]
leetcode_url: "https://leetcode.com/problems/interval-list-intersections"
---

# Interval List Intersections / Giao Nhau Của Danh Sách Khoảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng hai đoàn xe buýt chạy trên hai tuyến đường khác nhau — mỗi đoàn có lịch trình riêng. Tìm những khoảng thời gian cả hai đoàn cùng hoạt động. Dùng 2 con trỏ, tiến con trỏ nào kết thúc sớm hơn.

**Pattern Recognition:**

- Signal: "two sorted interval lists, find overlaps" → **Two Pointers** (merge-style)
- Two intervals [a,b] and [c,d] intersect iff `max(a,c) ≤ min(b,d)`
- Key insight: luôn advance con trỏ có end nhỏ hơn — nó không thể giao với phần tử tiếp theo của list kia

**Visual — Two Pointer Merge:**

```
firstList:  [0,2]  [5,10]  [13,23]  [24,25]
secondList: [1,5]  [8,12]  [15,24]  [25,26]

i=0,j=0: [0,2]∩[1,5]=[1,2]  end: min(2,5)=2  → advance i
i=1,j=0: [5,10]∩[1,5]=[5,5] end: min(10,5)=5 → advance j
i=1,j=1: [5,10]∩[8,12]=[8,10] end: min(10,12)=10 → advance i
...
```

---

## Problem Description

Given two lists of closed intervals `firstList` and `secondList` (each sorted by start), return their intersection — all intervals appearing in both lists. ([LeetCode](https://leetcode.com/problems/interval-list-intersections))

Difficulty: Medium | Acceptance: 72.7%

- Example 1: `first=[[0,2],[5,10],[13,23],[24,25]], second=[[1,5],[8,12],[15,24],[25,26]]` → `[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]`
- Example 2: `first=[[1,3],[5,9]], second=[]` → `[]`

Constraints: `0 ≤ firstList.length, secondList.length ≤ 1000`, intervals are disjoint and sorted

---

## 📝 Interview Tips

1. **Clarify**: "Các khoảng trong mỗi list đã được sort và không overlap?" / Confirm each list is sorted and disjoint
2. **Brute force**: "Kiểm tra từng cặp O(m·n)" / Check every pair of intervals — O(m×n)
3. **Key formula**: "`lo = max(a,c), hi = min(b,d)` — nếu lo ≤ hi thì có giao nhau" / Intersection exists when lo ≤ hi
4. **Advance rule**: "Tiến con trỏ có end nhỏ hơn — nó không thể match phần tiếp của list kia" / Always advance the pointer with smaller end
5. **Edge cases**: "Một list rỗng → trả về rỗng, khoảng chạm nhau (điểm đơn) cũng tính" / Empty list or touching intervals
6. **Follow-up**: "Merge N lists sorted → dùng heap O(n·k·log k)" / For N lists use priority queue

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check every pair
 * Time: O(m·n) — m and n are lengths of firstList and secondList
 * Space: O(min(m,n)) — output result
 */
function intervalIntersectionBrute(firstList: number[][], secondList: number[][]): number[][] {
  const result: number[][] = [];
  for (const [a, b] of firstList) {
    for (const [c, d] of secondList) {
      const lo = Math.max(a, c),
        hi = Math.min(b, d);
      if (lo <= hi) result.push([lo, hi]);
    }
  }
  return result;
}

/**
 * Solution 2: Two Pointers — linear scan
 * Time: O(m+n) — each pointer advances at most m+n times
 * Space: O(1) extra — output not counted
 */
function intervalIntersection(firstList: number[][], secondList: number[][]): number[][] {
  const result: number[][] = [];
  let i = 0,
    j = 0;

  while (i < firstList.length && j < secondList.length) {
    const [a, b] = firstList[i];
    const [c, d] = secondList[j];

    // Compute potential intersection
    const lo = Math.max(a, c);
    const hi = Math.min(b, d);
    if (lo <= hi) result.push([lo, hi]);

    // Advance the pointer whose interval ends first
    if (b < d) i++;
    else j++;
  }

  return result;
}

// === Test Cases ===
console.log(
  JSON.stringify(
    intervalIntersection(
      [
        [0, 2],
        [5, 10],
        [13, 23],
        [24, 25],
      ],
      [
        [1, 5],
        [8, 12],
        [15, 24],
        [25, 26],
      ],
    ),
  ),
); // [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]
console.log(
  JSON.stringify(
    intervalIntersection(
      [
        [1, 3],
        [5, 9],
      ],
      [],
    ),
  ),
); // []
console.log(JSON.stringify(intervalIntersection([[1, 7]], [[3, 10]]))); // [[3,7]]
console.log(JSON.stringify(intervalIntersection([[1, 2]], [[1, 2]]))); // [[1,2]]
```

---

## 🔗 Related Problems

- [Merge Intervals](https://leetcode.com/problems/merge-intervals) — merge overlapping intervals in one list
- [Insert Interval](https://leetcode.com/problems/insert-interval) — insert and merge into sorted interval list
- [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) — two pointer on sorted arrays
- [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii) — interval scheduling with sweep line
- [Remove Covered Intervals](https://leetcode.com/problems/remove-covered-intervals) — two-pointer interval comparison
