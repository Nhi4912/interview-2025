---
layout: page
title: "Maximum Gap"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Sorting, Bucket Sort, Radix Sort]
leetcode_url: "https://leetcode.com/problems/maximum-gap"
---

# Maximum Gap / Khoảng Cách Tối Đa

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Hình ảnh:** Bạn cần tìm khoảng cách lớn nhất giữa hai phần tử **liên tiếp nhau** sau khi sort. Nếu dùng sort thông thường O(n log n) thì dễ — nhưng bài yêu cầu O(n) time và O(n) space. Đây là lúc **Pigeonhole Principle** phát huy.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Gap example:**

```
nums = [3, 6, 9, 1], n=4

Range = 9-1 = 8.  Bucket size = ceil(8/3) = 3
Buckets: [1..3], [4..6], [7..9]
  Bucket 0: {1, 3}  → min=1, max=3
  Bucket 1: {6}     → min=6, max=6
  Bucket 2: {9}     → min=9, max=9

Max gap is BETWEEN buckets: 6-3=3, 9-6=3 → answer=3 ✓

Pigeonhole: n numbers in n-1 gaps → at least one gap ≥ ceil(range/(n-1))
→ max gap CANNOT be within a single bucket of that size!
```

**Chiến lược:** n numbers → n-1 buckets of size `ceil((max-min)/(n-1))`. Max gap must span bucket boundaries.

---

## Problem Description

Given unsorted integer array `nums`, return the **maximum difference** between successive elements in its sorted form. Return `0` if fewer than 2 elements. Must run in O(n) time and O(n) space.

**Example 1:** `nums=[3,6,9,1]` → `3`
**Example 2:** `nums=[10]` → `0`

**Constraints:** `1 ≤ n ≤ 10^5`, `0 ≤ nums[i] ≤ 10^9`

---

## 📝 Interview Tips

- **Why O(n) is possible:** Pigeonhole principle — max gap ≥ bucket size, so it spans buckets
- **Bucket size:** `ceil((max - min) / (n - 1))` ensures no two consecutive elements in same bucket
- **Only track:** min/max of each bucket — the gap is `nextBucket.min - prevBucket.max`
- **Skip empty buckets:** Only compare adjacent non-empty buckets
- **Alternative O(n):** Radix sort on 32-bit integers with base 2^8 (4 passes)
- **Edge cases:** n < 2 → return 0; all elements equal → return 0

---

## Solutions

```typescript
function maximumGap(nums: number[]): number {
  const n = nums.length;
  if (n < 2) return 0;

  const minVal = Math.min(...nums);
  const maxVal = Math.max(...nums);
  if (minVal === maxVal) return 0;

  // Bucket size: ensures max gap spans at least two buckets
  const bucketSize = Math.max(1, Math.ceil((maxVal - minVal) / (n - 1)));
  const bucketCount = Math.floor((maxVal - minVal) / bucketSize) + 1;

  // Each bucket tracks [min, max] of elements inside
  const bMin = new Array(bucketCount).fill(Infinity);
  const bMax = new Array(bucketCount).fill(-Infinity);

  for (const num of nums) {
    const idx = Math.floor((num - minVal) / bucketSize);
    bMin[idx] = Math.min(bMin[idx], num);
    bMax[idx] = Math.max(bMax[idx], num);
  }

  // Max gap = max difference between consecutive non-empty buckets
  let ans = 0;
  let prevMax = minVal;

  for (let i = 0; i < bucketCount; i++) {
    if (bMin[i] === Infinity) continue; // empty bucket
    ans = Math.max(ans, bMin[i] - prevMax);
    prevMax = bMax[i];
  }

  return ans;
}

function maximumGapRadix(nums: number[]): number {
  const n = nums.length;
  if (n < 2) return 0;

  // Radix sort base-256 (4 passes for 32-bit integers)
  const RADIX = 256;
  let arr = new Int32Array(nums);
  let tmp = new Int32Array(n);

  for (let shift = 0; shift < 32; shift += 8) {
    const count = new Array(RADIX).fill(0);
    for (const v of arr) count[(v >>> shift) & 0xff]++;
    for (let i = 1; i < RADIX; i++) count[i] += count[i - 1];
    for (let i = n - 1; i >= 0; i--) {
      tmp[--count[(arr[i] >>> shift) & 0xff]] = arr[i];
    }
    [arr, tmp] = [tmp, arr];
  }

  let maxGap = 0;
  for (let i = 1; i < n; i++) {
    maxGap = Math.max(maxGap, arr[i] - arr[i - 1]);
  }
  return maxGap;
}

function maximumGapSort(nums: number[]): number {
  if (nums.length < 2) return 0;
  nums.sort((a, b) => a - b);
  let maxGap = 0;
  for (let i = 1; i < nums.length; i++) {
    maxGap = Math.max(maxGap, nums[i] - nums[i - 1]);
  }
  return maxGap;
}
```

---

## 🔗 Related Problems

| Problem                                                                                   | Similarity                         |
| ----------------------------------------------------------------------------------------- | ---------------------------------- |
| [Contains Duplicate III](https://leetcode.com/problems/contains-duplicate-iii/)           | Bucket sort for range queries      |
| [Sort an Array](https://leetcode.com/problems/sort-an-array/)                             | Radix / bucket sort implementation |
| [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)     | Pigeonhole principle               |
| [Minimum Absolute Difference](https://leetcode.com/problems/minimum-absolute-difference/) | Adjacent difference after sort     |
