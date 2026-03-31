---
layout: page
title: "Number of Flowers in Full Bloom"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Hash Table, Binary Search, Sorting, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/number-of-flowers-in-full-bloom"
---

# Number of Flowers in Full Bloom / Số Hoa Đang Nở

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search + Events
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Đếm số cửa hàng đang mở khi bạn đi qua một con phố vào thời điểm t — cửa hàng "đang mở" nếu giờ mở ≤ t ≤ giờ đóng. Tách thành: đã mở - đã đóng.

**Pattern Recognition:**

- Signal: "count intervals covering point t" → **Sort starts/ends + Binary Search**
- Flowers blooming at t = count(start ≤ t) - count(end < t)
- Key insight: tách vấn đề 2D (khoảng thời gian) thành 2 vấn đề 1D (binary search trên mảng đã sort)

**Visual — flowers=[[1,6],[3,7],[9,12],[4,13]], persons=[2,3,7,11]:**

```
starts sorted: [1, 3, 4, 9]
ends sorted:   [6, 7, 12, 13]

Person at t=2:
  started ≤ 2: bisect_right([1,3,4,9], 2) = 1   (only flower starting at 1)
  ended < 2:   bisect_left([6,7,12,13], 2) = 0
  blooming = 1 - 0 = 1 ✅

Person at t=7:
  started ≤ 7: 3 (flowers 1,3,4)
  ended < 7:   1 (flower ending at 6)
  blooming = 3 - 1 = 2 ✅
```

---

## Problem Description

Cho mảng `flowers[i] = [start_i, end_i]` (hoa nở từ start đến end, cả hai đầu), và mảng `persons[j]` (thời điểm người j đến). Trả về mảng `answer` với `answer[j]` = số hoa đang nở khi người j đến. ([LeetCode](https://leetcode.com/problems/number-of-flowers-in-full-bloom))

Difficulty: Hard | Acceptance: 57.2%

- `flowers=[[1,6],[3,7],[9,12],[4,13]], persons=[2,3,7,11]` → `[1,2,2,2]`
- `flowers=[[1,10],[3,3]], persons=[3,3,2]` → `[2,2,1]`

Constraints: `1 <= flowers.length <= 5×10^4`, `1 <= persons.length <= 5×10^4`, `1 <= start ≤ end ≤ 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Hoa nở cả ngày start lẫn end không?" / Inclusive on both endpoints?
2. **Brute force**: "Với mỗi person, duyệt tất cả flowers — O(nm)" / Per-person linear scan
3. **Key insight**: "blooming(t) = #{start ≤ t} - #{end < t}" / Count starts minus already-ended
4. **Binary search**: "Sort starts và ends riêng → upper_bound và lower_bound" / Two sorted arrays + bisect
5. **Edge cases**: "Person đến trước tất cả hoa nở → 0; person = start = end → 1" / Before any bloom → 0
6. **Follow-up**: "Nếu persons cũng cần query theo thứ tự → offline sort + two-pointer O(n log n)" / Offline approach

---

## Solutions

```typescript
/**
 * Binary search helpers
 */
// Count of values in sorted array that are <= target (upper bound index)
function upperBound(arr: number[], target: number): number {
  let lo = 0,
    hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
// Count of values in sorted array that are < target (lower bound index)
function lowerBound(arr: number[], target: number): number {
  let lo = 0,
    hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/**
 * Solution 1: Brute Force — Check Every Flower per Person
 * Time: O(n × m) — n flowers, m persons
 * Space: O(1) — excluding output
 */
function fullBloomFlowersBrute(flowers: number[][], persons: number[]): number[] {
  return persons.map((t) => flowers.filter(([s, e]) => s <= t && t <= e).length);
}

/**
 * Solution 2: Sort + Binary Search
 * Time: O((n + m) log n) — sort O(n log n), each query O(log n)
 * Space: O(n) — two sorted arrays
 */
function fullBloomFlowers(flowers: number[][], persons: number[]): number[] {
  const starts = flowers.map((f) => f[0]).sort((a, b) => a - b);
  const ends = flowers.map((f) => f[1]).sort((a, b) => a - b);

  return persons.map((t) => {
    const started = upperBound(starts, t); // #{start <= t}
    const ended = lowerBound(ends, t); // #{end < t}
    return started - ended;
  });
}

// === Test Cases ===
console.log(
  fullBloomFlowers(
    [
      [1, 6],
      [3, 7],
      [9, 12],
      [4, 13],
    ],
    [2, 3, 7, 11],
  ),
);
// [1, 2, 2, 2]
console.log(
  fullBloomFlowers(
    [
      [1, 10],
      [3, 3],
    ],
    [3, 3, 2],
  ),
);
// [2, 2, 1]
console.log(
  fullBloomFlowersBrute(
    [
      [1, 6],
      [3, 7],
      [9, 12],
      [4, 13],
    ],
    [2, 3, 7, 11],
  ),
);
// [1, 2, 2, 2]
console.log(
  fullBloomFlowers(
    [
      [1, 3],
      [2, 4],
    ],
    [1, 2, 3, 4],
  ),
);
// [1, 2, 2, 1]
```

---

## 🔗 Related Problems

- [Brightest Position on Street](https://leetcode.com/problems/brightest-position-on-street) — overlap counting with events
- [Count Positions on Street With Required Brightness](https://leetcode.com/problems/count-positions-on-street-with-required-brightness) — prefix sum on events
- [My Calendar I](https://leetcode.com/problems/my-calendar-i) — interval overlap detection
- [Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element) — sliding window on sorted
- [Number of Flowers in Full Bloom — LeetCode](https://leetcode.com/problems/number-of-flowers-in-full-bloom) — problem page
