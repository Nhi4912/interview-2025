---
layout: page
title: "Count of Range Sum"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Divide and Conquer, Binary Indexed Tree, Segment Tree]
leetcode_url: "https://leetcode.com/problems/count-of-range-sum"
---

# Count of Range Sum / Đếm Số Tổng Đoạn Trong Khoảng

> **Track**: Sorting-Searching | **Difficulty**: 🔴 Hard | **Pattern**: Merge Sort on Prefix Sums
> **Frequency**: ★★☆ Occasional — Hard level, gặp ở các round thuật toán nâng cao
> **See also**: [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) | [Reverse Pairs](https://leetcode.com/problems/reverse-pairs/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang đếm số cặp bạn bè trong một hàng người, sao cho tổng chiều cao của những người từ bạn A đến bạn B nằm trong khoảng [lower, upper]. Thay vì kiểm tra từng cặp (O(n²)), bạn dùng kỹ thuật merge sort: khi gộp hai nửa đã sắp xếp, đếm các cặp hợp lệ bằng hai con trỏ trượt — giống như đếm inversions nhưng với điều kiện khoảng.

**Pattern Recognition:**

- Signal: "count pairs (i,j) where lower ≤ prefix[j] - prefix[i] ≤ upper" → **Merge Sort on Prefix Sums**
- Bài này thuộc dạng Divide & Conquer trên prefix sums — đếm cặp hợp lệ khi merge
- Key insight: `rangeSum(i,j) = prefix[j+1] - prefix[i]`, cần đếm cặp `(i,j)` với `lower ≤ prefix[j]-prefix[i] ≤ upper`

**Visual — Merge sort counting:**

```
prefix = [0, -2, 0, 3], lower=-2, upper=-1

During merge([0,-2] sorted=[-2,0]) and ([0,3] sorted=[0,3]):
Left sorted: [-2, 0]
Right sorted: [0, 3]

For left[0]=-2: find right in [-2-(-2), -1-(-2)]=[ 0, 1] → right[0]=0 ✓ count+=1
For left[1]=0:  find right in [-2-0, -1-0]=[-2,-1]       → none      count+=0

Total valid pairs = 1
```

---

## Problem Description

Given integer array `nums` and integers `lower`, `upper`, return the number of range sums `[i, j]` (0-indexed, inclusive) where `lower <= sum(nums[i..j]) <= upper`. ([LeetCode](https://leetcode.com/problems/count-of-range-sum))

```
Example 1: nums=[-2,5,-1], lower=-2, upper=2  → 3
Example 2: nums=[0],       lower=0,  upper=0  → 1
```

Constraints: `1 <= nums.length <= 10^5`, `-2^31 <= nums[i] <= 2^31 - 1`, `-10^5 <= lower <= upper <= 10^5`

---

## 📝 Interview Tips

1. **Convert to prefix sum problem** — _rangeSum(i,j) = prefix[j+1]-prefix[i], cần đếm cặp hợp lệ_
2. **Merge sort counts pairs across left/right halves** — _Khi merge, dùng two pointers để đếm cặp (left[i], right[j])_
3. **Two sliding pointers for [lower, upper] bounds** — _Một con trỏ cho lower bound, một cho upper bound trong nửa phải_
4. **Watch for integer overflow in prefix sums** — _Tổng tích lũy có thể vượt 32-bit; dùng BigInt hoặc number (JS 64-bit float)_
5. **Brute O(n²) is straightforward; optimize to O(n log n)** — _Nói brute force trước, rồi giải thích merge sort approach_
6. **Coordinate compression + BIT is alternative** — _Có thể dùng BIT với coordinate compression thay cho merge sort_

---

## Solutions

```typescript
/** Solution 1: Brute Force @complexity Time: O(n²) | Space: O(n) */
function countRangeSumBrute(nums: number[], lower: number, upper: number): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j <= n; j++) {
      const s = prefix[j] - prefix[i];
      if (s >= lower && s <= upper) count++;
    }
  }
  return count;
}

/** Solution 2: Merge Sort on Prefix Sums @complexity Time: O(n log n) | Space: O(n) */
function countRangeSum(nums: number[], lower: number, upper: number): number {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];

  let count = 0;

  const mergeSort = (arr: number[], left: number, right: number): void => {
    if (right - left <= 1) return;
    const mid = (left + right) >> 1;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid, right);

    // Count valid pairs: left half [left, mid), right half [mid, right)
    let lo = mid,
      hi = mid;
    for (let i = left; i < mid; i++) {
      // Advance lo: first j where arr[j] - arr[i] >= lower
      while (lo < right && arr[lo] - arr[i] < lower) lo++;
      // Advance hi: first j where arr[j] - arr[i] > upper
      while (hi < right && arr[hi] - arr[i] <= upper) hi++;
      count += hi - lo;
    }

    // Standard merge
    const temp: number[] = [];
    let l = left,
      r = mid;
    while (l < mid && r < right) {
      temp.push(arr[l] <= arr[r] ? arr[l++] : arr[r++]);
    }
    while (l < mid) temp.push(arr[l++]);
    while (r < right) temp.push(arr[r++]);
    for (let i = 0; i < temp.length; i++) arr[left + i] = temp[i];
  };

  mergeSort(prefix, 0, prefix.length);
  return count;
}

// === Test Cases ===
console.log(countRangeSum([-2, 5, -1], -2, 2)); // 3
console.log(countRangeSum([0], 0, 0)); // 1
console.log(countRangeSum([2, -1], -1, 1)); // 1
```

---

## 🔗 Related Problems

| #   | Problem                                                                                                             | Difficulty | Pattern          |
| --- | ------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| 1   | [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)           | Hard       | Merge Sort / BIT |
| 2   | [Reverse Pairs](https://leetcode.com/problems/reverse-pairs/)                                                       | Hard       | Merge Sort       |
| 3   | [Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions/) | Hard       | BIT              |
| 4   | [Count Good Triplets in an Array](https://leetcode.com/problems/count-good-triplets-in-an-array/)                   | Hard       | BIT              |
