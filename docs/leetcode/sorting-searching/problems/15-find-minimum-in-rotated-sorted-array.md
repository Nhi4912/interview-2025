---
layout: page
title: "Find Minimum in Rotated Sorted Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array"
---

# Find Minimum in Rotated Sorted Array / Tìm Phần Tử Nhỏ Nhất Trong Mảng Xoay

> **Track**: Binary Search | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search on Rotated Array
> **Frequency**: 📗 Tier 2 — Gặp ở 20+ companies (Amazon, Microsoft, Google)
> **See also**: [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array) | [Find Peak Element](https://leetcode.com/problems/find-peak-element)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn có một vòng số được cắt ra — phần tử nhỏ nhất là "điểm gãy" nơi giá trị nhảy xuống. Trong binary search, bạn so sánh `nums[mid]` với `nums[hi]`: nếu `nums[mid] > nums[hi]`, điểm gãy nằm bên phải (minimum ở right half); ngược lại, minimum ở left half (bao gồm mid).

**Pattern Recognition:**

- Signal: "rotated sorted array", "find minimum" → **Binary Search trên vị trí pivot**
- Invariant: so sánh `nums[mid]` với `nums[hi]` để xác định nửa nào chứa minimum
- No duplicates → strict binary search; with duplicates → handle `nums[mid] === nums[hi]` separately

**Visual — nums=[4,5,6,7,0,1,2]:**

```
     4  5  6  7  0  1  2
lo=0            hi=6   mid=3

nums[mid]=7 > nums[hi]=2 → minimum in RIGHT half → lo = mid+1 = 4

     4  5  6  7  0  1  2
               lo=4 hi=6  mid=5

nums[mid]=1 < nums[hi]=2 → minimum in LEFT half (incl. mid) → hi = mid = 5

               lo=4 hi=5  mid=4
nums[mid]=0 < nums[hi]=1 → hi = mid = 4

               lo=hi=4 → nums[4]=0 ✅
```

---

## Problem Description

Given a sorted array of unique integers that has been rotated between 1 and n times, find the minimum element. The original array was sorted in ascending order before rotation.

```
Example 1: nums=[3,4,5,1,2]   → 1
Example 2: nums=[4,5,6,7,0,1,2] → 0
Example 3: nums=[11,13,15,17]  → 11 (not rotated)
```

Constraints: `n == nums.length`, `1 <= n <= 5000`, all integers are **unique**

---

## 📝 Interview Tips

1. **Clarify**: "Array có duplicate không?" / No duplicates here — follow-up problem 154 has duplicates.
2. **Linear**: O(n) scan is obvious — interviewer wants O(log n) binary search.
3. **Invariant**: Compare `nums[mid]` with `nums[hi]` (NOT `nums[lo]`) — avoids off-by-one issues.
4. **Loop condition**: `lo < hi` (not `lo <= hi`) — terminates when lo===hi pointing at minimum.
5. **Not rotated**: If `nums[lo] < nums[hi]`, entire range is sorted — minimum is `nums[lo]`.
6. **Follow-up**: With duplicates (LC 154) → worst case O(n) because `nums[mid]===nums[hi]` is ambiguous.

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan
 * Time: O(n) — scan entire array
 * Space: O(1)
 */
function findMin1(nums: number[]): number {
  let min = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < min) min = nums[i];
  }
  return min;
}

/**
 * Solution 2: Binary Search (Optimal)
 * Time: O(log n) — halve search space each iteration
 * Space: O(1)
 *
 * Key insight: Compare nums[mid] with nums[hi]:
 * - nums[mid] > nums[hi] → rotation point is in right half → lo = mid + 1
 * - nums[mid] < nums[hi] → minimum is in left half (inclusive) → hi = mid
 * Loop terminates when lo === hi, pointing at the minimum.
 */
function findMin(nums: number[]): number {
  let lo = 0,
    hi = nums.length - 1;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) {
      // Right half is unsorted — minimum is somewhere in [mid+1, hi]
      lo = mid + 1;
    } else {
      // Left half is unsorted OR everything is sorted — minimum is in [lo, mid]
      hi = mid;
    }
  }
  return nums[lo];
}

// === Test Cases ===
console.log(findMin([3, 4, 5, 1, 2])); // 1
console.log(findMin([4, 5, 6, 7, 0, 1, 2])); // 0
console.log(findMin([11, 13, 15, 17])); // 11 (not rotated)
console.log(findMin([2, 1])); // 1
console.log(findMin([1])); // 1
console.log(findMin1([4, 5, 6, 7, 0, 1, 2])); // 0 (linear verify)
```

---

## 🔗 Related Problems

| Problem                                                                                                                | Relationship                                           |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [153. Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)       | This problem                                           |
| [154. Find Minimum in Rotated Sorted Array II](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/) | Same but with duplicates — O(n) worst case             |
| [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)                    | Search for target value (not minimum) in rotated array |
| [162. Find Peak Element](https://leetcode.com/problems/find-peak-element/)                                             | Binary search on unsorted — find local maximum         |
| [852. Peak Index in a Mountain Array](https://leetcode.com/problems/peak-index-in-a-mountain-array/)                   | Same binary search pattern on mountain array           |
