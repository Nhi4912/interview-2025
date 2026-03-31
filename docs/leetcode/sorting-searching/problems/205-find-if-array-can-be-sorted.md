---
layout: page
title: "Find if Array Can Be Sorted"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Bit Manipulation, Sorting]
leetcode_url: "https://leetcode.com/problems/find-if-array-can-be-sorted"
---

# Find if Array Can Be Sorted / Kiểm Tra Xem Mảng Có Thể Được Sắp Xếp Không

🟡 Medium

## 🧠 Intuition

> **Hình ảnh:** Chỉ được hoán đổi hai phần tử **kề nhau** nếu chúng có cùng số bit 1 trong biểu diễn nhị phân. Điều này chia mảng thành các **"nhóm"** — trong mỗi nhóm, mọi phần tử đều hoán đổi được tự do. Bài toán trở thành: các nhóm có thể sắp xếp thành chuỗi tăng dần không?

```
nums = [8, 4, 2, 30, 15]
popcount: [1, 1, 1,  4,  4]

Group 1 (popcount=1): [8, 4, 2] → sorted: [2, 4, 8]
Group 2 (popcount=4): [30, 15] → sorted: [15, 30]

Max of group1 = 8, Min of group2 = 15 → 8 < 15 ✓ → can be sorted!

Counter-example: [3, 16, 8, 4, 2]
popcount:        [2,  1, 1, 1, 1]
Group1 (pop=2): [3] max=3
Group2 (pop=1): [16,8,4,2] min=2
max(group1) > min(group2): 3 > 2 → CANNOT sort ✗
```

**Chiến lược:** Group consecutive elements with same popcount. Each group can be internally sorted. Check that `max(group[i]) < min(group[i+1])` for all i.

## 📋 Problem Description

Given an array `nums`. In one operation, swap two **adjacent** elements if they have the **same number of set bits** in binary. Return `true` if the array can be sorted in non-decreasing order, `false` otherwise.

**Example 1:** `nums=[8,4,2,30,15]` → `true`
**Example 2:** `nums=[1,2,3,4,5]` → `true`
**Example 3:** `nums=[3,16,8,4,2]` → `false`

**Constraints:** `1 ≤ n ≤ 50`, `1 ≤ nums[i] ≤ 2^8`

## 📝 Interview Tips

- **Key insight:** Elements with same popcount form a "free swap zone" — they can be sorted among themselves
- **Group property:** Within a group of same popcount, any permutation is reachable via adjacent swaps
- **Inter-group check:** `max of current group < min of next group`
- **Consecutive grouping:** Only adjacent elements with same popcount can be swapped, so groups are contiguous
- **popcount in JS:** `val.toString(2).split('0').join('').length` or bit manipulation loop
- **Simpler approach:** Just run bubble sort mentally — two adjacent swaps possible only if same popcount

## 💡 Solutions

### Solution 1: Group Max/Min Check — O(n)

```typescript
function canSortArray(nums: number[]): boolean {
  const popcount = (n: number): number => {
    let count = 0;
    while (n > 0) {
      count += n & 1;
      n >>= 1;
    }
    return count;
  };

  const n = nums.length;
  let i = 0;

  while (i < n) {
    // Find extent of current group (consecutive same popcount)
    const pc = popcount(nums[i]);
    let j = i;
    let groupMax = -Infinity;
    while (j < n && popcount(nums[j]) === pc) {
      groupMax = Math.max(groupMax, nums[j]);
      j++;
    }

    // Ensure the sorted minimum of next group > sorted maximum of current group
    // (Equivalently: all elements in current group must come before next group)
    if (j < n) {
      // Find min of next group
      const nextPc = popcount(nums[j]);
      let k = j;
      let nextGroupMin = Infinity;
      while (k < n && popcount(nums[k]) === nextPc) {
        nextGroupMin = Math.min(nextGroupMin, nums[k]);
        k++;
      }
      if (groupMax > nextGroupMin) return false;
    }

    i = j;
  }
  return true;
}
```

### Solution 2: Segment-Based with Prev Max Tracking — O(n)

```typescript
function canSortArrayClean(nums: number[]): boolean {
  const popcount = (n: number) => n.toString(2).replace(/0/g, "").length;

  let prevGroupMax = -Infinity;
  let curGroupMax = -Infinity;
  let curGroupMin = Infinity;
  let curPop = popcount(nums[0]);

  for (const num of nums) {
    const pc = popcount(num);
    if (pc === curPop) {
      // Same group — extend it
      curGroupMax = Math.max(curGroupMax, num);
      curGroupMin = Math.min(curGroupMin, num);
    } else {
      // New group — check transition: prev group's max < this group's min
      if (prevGroupMax > curGroupMin) return false;
      prevGroupMax = curGroupMax;
      curGroupMax = num;
      curGroupMin = num;
      curPop = pc;
    }
  }

  // Final check: last group must start after previous group's max
  return prevGroupMax <= curGroupMin;
}
```

### Solution 3: Simulate Bubble Sort — O(n²) brute force

```typescript
function canSortArrayBubble(nums: number[]): boolean {
  const popcount = (n: number) => {
    let c = 0;
    while (n) {
      c += n & 1;
      n >>>= 1;
    }
    return c;
  };

  const arr = [...nums];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - 1; j++) {
      if (arr[j] > arr[j + 1] && popcount(arr[j]) === popcount(arr[j + 1])) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }

  // Check if sorted
  for (let i = 1; i < n; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}
```

## 🔗 Related Problems

| Problem                                                                                                       | Similarity                      |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| [Sort Integers by The Number of 1 Bits](https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits/) | Sort by popcount                |
| [Missing Number](https://leetcode.com/problems/missing-number/)                                               | Bit manipulation                |
| [Find the Maximum Sum of Node Values](https://leetcode.com/problems/find-the-maximum-sum-of-node-values/)     | XOR/bit constraint optimization |
| [Bubble Sort Theory](https://leetcode.com/problems/sort-an-array/)                                            | Adjacent swap sort              |
