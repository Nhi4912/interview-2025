---
layout: page
title: "Median of Two Sorted Arrays"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Divide and Conquer]
leetcode_url: "https://leetcode.com/problems/median-of-two-sorted-arrays/"
---

# Median of Two Sorted Arrays / Trung Vị Của Hai Mảng Đã Sắp Xếp

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search on partition
> **Frequency**: 🔥 Tier 1 — Classic Hard, xuất hiện ~80% Big Tech final rounds
> **See also**: [Merge Sorted Array](./01-merge-sorted-array.md) | [Find K Largest](./02-find-k-largest-elements.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hai thư viện (A: m sách, B: n sách) muốn gộp lại và tìm quyển "giữa". Không cần gộp thật sự — chỉ cần tìm "điểm cắt" đúng chia cả hai thành nửa trái (m+n)/2 cuốn và nửa phải. Điểm cắt đúng khi: sách cuối nửa trái của A ≤ sách đầu nửa phải của B, và ngược lại. Dùng binary search trên mảng ngắn hơn để tìm điểm cắt đó.

**Pattern Recognition:**

- Signal: two sorted arrays, O(log(m+n)) required → **binary search on smaller array partition**
- Partition nums1 tại `cut1`, nums2 tại `cut2 = half - cut1` sao cho tổng nửa trái = `(m+n+1)/2`
- Valid partition: `maxLeft1 <= minRight2` AND `maxLeft2 <= minRight1`
- Dùng ±Infinity làm sentinel cho biên ngoài array

**Visual — nums1=[1,3], nums2=[2,4,5,6], total=6, half=3:**

```
Search cut1 in [0..2]:
  cut1=1, cut2=2:  maxL1=1, minR1=3, maxL2=2, minR2=5
    → 1<=5 ✓  but 2<=3 ✓  → valid!
  total even → median = (max(1,2) + min(3,5)) / 2 = (2+3)/2 = 2.5 ✅

Boundary sentinel: cut1=0 → maxLeft1 = -Infinity (nothing on left)
                   cut1=m → minRight1 = +Infinity (nothing on right)
```

---

## Problem Description

Given two sorted arrays `nums1` (size m) and `nums2` (size n), return the **median** of the merged array. Required: O(log(m+n)) time.

```
Example 1: nums1=[1,3], nums2=[2]        → 2.0    (merged=[1,2,3])
Example 2: nums1=[1,2], nums2=[3,4]      → 2.5    ((2+3)/2)
Example 3: nums1=[], nums2=[1]           → 1.0
```

Constraints: `0 <= m, n <= 1000`, `-10^6 <= nums[i] <= 10^6`

---

## 📝 Interview Tips

1. **Bắt đầu với O(m+n)** (merge + find), sau đó optimize lên O(log(m+n)) — show thinking process
2. **Luôn binary search trên mảng nhỏ hơn**: nếu `m > n`, swap — tránh `cut2` âm
3. **Sentinel values**: `maxLeft = -Infinity` khi cut=0, `minRight = +Infinity` khi cut=m/n
4. **Even vs Odd**: tổng lẻ → `Math.max(maxLeft1, maxLeft2)`; tổng chẵn → trung bình 2 giá trị
5. **Nói to invariant**: "tôi duy trì: tất cả nửa trái ≤ tất cả nửa phải" — interviewer đánh giá cao
6. **Edge cases**: một mảng rỗng, mảng không giao nhau (e.g. [1,2] và [3,4])

---

## Solutions

```typescript
/**
 * Solution 1: Merge then Find — O(m+n) time, O(1) extra space
 * Walk both arrays simultaneously, stop at median position.
 * Good starting point to explain before optimizing.
 */
function findMedianSortedArraysMerge(nums1: number[], nums2: number[]): number {
  const total = nums1.length + nums2.length;
  const half = Math.floor(total / 2);
  let i = 0,
    j = 0,
    prev = 0,
    curr = 0;

  for (let k = 0; k <= half; k++) {
    prev = curr;
    if (i >= nums1.length) curr = nums2[j++];
    else if (j >= nums2.length) curr = nums1[i++];
    else if (nums1[i] <= nums2[j]) curr = nums1[i++];
    else curr = nums2[j++];
  }

  return total % 2 === 0 ? (prev + curr) / 2 : curr;
}

/**
 * Solution 2: Binary Search on Partition (Optimal)
 * Time O(log(min(m,n))), Space O(1)
 *
 * Idea: partition nums1 at cut1, nums2 at cut2=half-cut1
 * such that left-halves together have (m+n+1)/2 elements
 * and max(left) <= min(right) across both arrays.
 */
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // Always binary-search the shorter array
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);

  const m = nums1.length;
  const n = nums2.length;
  const half = Math.floor((m + n + 1) / 2); // size of left partition

  let lo = 0,
    hi = m;

  while (lo <= hi) {
    const cut1 = Math.floor((lo + hi) / 2);
    const cut2 = half - cut1;

    const maxL1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];
    const minR1 = cut1 === m ? Infinity : nums1[cut1];
    const maxL2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];
    const minR2 = cut2 === n ? Infinity : nums2[cut2];

    if (maxL1 <= minR2 && maxL2 <= minR1) {
      // Valid partition found
      if ((m + n) % 2 === 1) return Math.max(maxL1, maxL2);
      return (Math.max(maxL1, maxL2) + Math.min(minR1, minR2)) / 2;
    } else if (maxL1 > minR2) {
      hi = cut1 - 1; // too many from nums1 on left
    } else {
      lo = cut1 + 1; // too few from nums1 on left
    }
  }

  throw new Error("Input arrays are not sorted");
}

// --- Quick inline tests ---
console.log(findMedianSortedArrays([1, 3], [2]) === 2.0); // true
console.log(findMedianSortedArrays([1, 2], [3, 4]) === 2.5); // true
console.log(findMedianSortedArrays([], [1]) === 1.0); // true
console.log(findMedianSortedArrays([2], []) === 2.0); // true
```

---

## 🔗 Related Problems

| Problem                                                                                          | Relationship                            |
| ------------------------------------------------------------------------------------------------ | --------------------------------------- |
| [4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)     | This problem                            |
| [88. Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)                      | Easier version — merge in-place         |
| [215. Kth Largest Element](https://leetcode.com/problems/kth-largest-element-in-an-array/)       | Generalisation: find kth element        |
| [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) | Dynamic version using two heaps         |
| [786. K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction/) | Binary search on value space, same idea |
