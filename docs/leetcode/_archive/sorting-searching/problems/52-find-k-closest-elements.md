---
layout: page
title: "Find K Closest Elements"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Sliding Window, Sorting]
leetcode_url: "https://leetcode.com/problems/find-k-closest-elements"
---

# Find K Closest Elements / Tìm K Phần Tử Gần Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search on Window
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn muốn chọn cửa sổ k nhà liên tiếp gần nhất với điểm X. Thay vì thử từng vị trí cửa sổ, hãy dùng binary search để tìm **vị trí bắt đầu tối ưu** của cửa sổ k phần tử.

**Pattern Recognition:**

- Signal: "sorted array" + "k closest" → **Binary Search trên điểm bắt đầu window**
- So sánh phần tử ngoài hai đầu window: bên nào xa X hơn thì loại
- Key insight: lo ∈ [0, n-k], tìm vị trí lo tối ưu, output arr[lo..lo+k-1]

**Visual — Binary search the window's left boundary:**

```
arr = [1, 2, 3, 4, 5],  k=4,  x=3

Search lo ∈ [0, 1]:
  mid=0: compare |arr[0]-x|=2  vs  |arr[0+4]-x|=2
         equal → prefer smaller → hi=0  (keep left side)
  lo=0, result = arr[0..3] = [1,2,3,4]  ✅

x=6:
  mid=0: |arr[0]-6|=5  >  |arr[4]-6|=1  → lo=1
  lo=1, result = arr[1..4] = [2,3,4,5]  ✅
```

---

## Problem Description

Cho mảng `arr` đã sắp xếp, số `x`, và `k`, trả về k phần tử gần nhất với x dưới dạng mảng đã sắp xếp. Gần hơn nghĩa là |a-x| nhỏ hơn; nếu bằng nhau, ưu tiên phần tử nhỏ hơn. ([LeetCode 658](https://leetcode.com/problems/find-k-closest-elements))

- Example 1: `arr=[1,2,3,4,5], k=4, x=3` → `[1,2,3,4]`
- Example 2: `arr=[1,2,3,4,5], k=4, x=-1` → `[1,2,3,4]`
- Example 3: `arr=[1,1,2,3,4,5], k=4, x=2` → `[1,1,2,3]`

Constraints: `1 ≤ k ≤ arr.length ≤ 10⁴`, `-10⁴ ≤ arr[i], x ≤ 10⁴`

---

## 📝 Interview Tips

1. **Clarify**: "arr đã sorted chưa? x có trong arr không?" / Confirm arr is sorted, x may not exist in arr
2. **Brute force**: "Sort theo |a-x|, lấy k phần tử đầu, sort lại O(n log n)" / Sort by distance, take k, re-sort
3. **Optimize**: "Binary search trên lo ∈ [0, n-k] O(log(n-k) + k)" / Search for window start position
4. **Key comparison**: "arr[mid] hay arr[mid+k] xa x hơn?" / Compare left & right element of potential window
5. **Tie-breaking**: "Khi bằng nhau, ưu tiên nhỏ hơn → không dịch lo sang phải" / Equal distance → keep smaller (don't move lo right)
6. **Edge case**: "x nhỏ hơn mọi phần tử → k phần tử đầu; x lớn hơn mọi → k phần tử cuối" / x outside range

---

## Solutions

```typescript
/**
 * Solution 1: Sort by Distance (Brute Force)
 * Time: O(n log n) — sort all elements by distance, then re-sort k results
 * Space: O(n) — store all distances
 */
function findKClosestElementsBruteForce(arr: number[], k: number, x: number): number[] {
  return arr
    .slice()
    .sort((a, b) => Math.abs(a - x) - Math.abs(b - x) || a - b)
    .slice(0, k)
    .sort((a, b) => a - b);
}

/**
 * Solution 2: Binary Search on Window Start (Optimal)
 * Time: O(log(n - k) + k) — binary search for left boundary, slice k elements
 * Space: O(1) — no extra space beyond output
 */
function findKClosestElements(arr: number[], k: number, x: number): number[] {
  let lo = 0,
    hi = arr.length - k;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    // Compare: is left element or right element farther from x?
    // If left (arr[mid]) is farther → shift window right
    if (x - arr[mid] > arr[mid + k] - x) {
      lo = mid + 1;
    } else {
      // Equal or right is farther → keep window at mid (prefer smaller)
      hi = mid;
    }
  }

  return arr.slice(lo, lo + k);
}

// === Test Cases ===
console.log(findKClosestElements([1, 2, 3, 4, 5], 4, 3)); // [1,2,3,4]
console.log(findKClosestElements([1, 2, 3, 4, 5], 4, -1)); // [1,2,3,4]
console.log(findKClosestElements([1, 2, 3, 4, 5], 4, 6)); // [2,3,4,5]
console.log(findKClosestElements([1, 1, 2, 3, 4], 3, 2)); // [1,2,3]
```

---

## 🔗 Related Problems

- [Heaters](https://leetcode.com/problems/heaters) — binary search for nearest element in sorted array
- [K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction) — binary search on value space
- [Smallest Range Covering Elements from K Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists) — k-closest across multiple arrays
- [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system) — binary search for prefix matches
- [Find K Closest Elements — LeetCode](https://leetcode.com/problems/find-k-closest-elements) — problem page
