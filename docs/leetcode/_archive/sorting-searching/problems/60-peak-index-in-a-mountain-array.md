---
layout: page
title: "Peak Index in a Mountain Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/peak-index-in-a-mountain-array"
---

# Peak Index in a Mountain Array / Chỉ Số Đỉnh Trong Mảng Núi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đứng trên sườn núi và chỉ nhìn được hai ô kề nhau. Nếu bên phải cao hơn → đỉnh ở phía phải → đi sang phải. Nếu bên phải thấp hơn → đang ở đỉnh hoặc đỉnh bên trái → đứng yên hoặc đi trái. Binary search nhanh hơn tuyến tính.

**Pattern Recognition:**

- Signal: "find peak in bitonic array" → **Binary Search**
- So sánh `arr[mid]` và `arr[mid+1]`: đang lên dốc hay xuống dốc?
- Key insight: nếu `arr[mid] < arr[mid+1]` → đang lên → peak ở phải → `lo = mid+1`

**Visual — Binary search converges to peak:**

```
arr = [0, 1, 0]
       L  M  R
arr[M]=1 > arr[M+1]=0  → hi = M = 1
L=0, hi=1, mid=0: arr[0]=0 < arr[1]=1 → lo = 1
L=R=1  →  peak = index 1  ✅

arr = [0, 4, 8, 6, 1]
       L        M  R
mid=2: arr[2]=8 > arr[3]=6 → hi = 2
mid=1: arr[1]=4 < arr[2]=8 → lo = 2
L=R=2  →  peak = index 2  ✅
```

---

## Problem Description

Cho một mảng "núi" (tăng rồi giảm, ít nhất 3 phần tử), trả về **chỉ số của đỉnh** (phần tử lớn nhất). Đảm bảo đỉnh là duy nhất và không ở đầu/cuối mảng. ([LeetCode 852](https://leetcode.com/problems/peak-index-in-a-mountain-array))

- Example 1: `arr=[0,1,0]` → `1`
- Example 2: `arr=[0,2,1,0]` → `1`
- Example 3: `arr=[0,10,5,2]` → `1`
- Example 4: `arr=[3,4,5,1]` → `2`

Constraints: `3 ≤ arr.length ≤ 10⁵`, guaranteed mountain array

---

## 📝 Interview Tips

1. **Clarify**: "Mảng đảm bảo là mountain array? Đỉnh duy nhất?" / Confirm exactly one peak, not at edges
2. **Brute force**: "Linear scan O(n): tìm i mà arr[i] > arr[i-1] và arr[i] > arr[i+1]" / Simple linear scan
3. **Binary search**: "arr[mid] < arr[mid+1] → đang ascending → peak ở phải → lo = mid+1" / Halve search space each step
4. **Invariant**: "`lo <= peak <= hi` luôn đúng; loop kết thúc khi lo == hi = peak" / Maintain peak in [lo, hi]
5. **Boundary**: "Dùng `lo < hi` (không có `=`) để tránh infinite loop khi lo==hi" / Use `lo < hi` not `lo <= hi`
6. **Variant**: "Find Peak Element (LC162) là bài tổng quát hơn — đỉnh không nhất thiết là max" / Related LC162 is more general

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan (Brute Force)
 * Time: O(n) — scan until we find arr[i] > arr[i+1] (first descent)
 * Space: O(1) — no extra space
 */
function peakIndexBruteForce(arr: number[]): number {
  for (let i = 1; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return i; // First descent point is the peak
  }
  return arr.length - 2; // Fallback (guaranteed mountain, shouldn't reach here)
}

/**
 * Solution 2: Binary Search (Optimal)
 * Time: O(log n) — halve search space each iteration
 * Space: O(1) — constant extra space
 */
function peakIndexInAMountainArray(arr: number[]): number {
  let lo = 0,
    hi = arr.length - 1;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < arr[mid + 1]) {
      // Still ascending — peak must be to the right of mid
      lo = mid + 1;
    } else {
      // Descending or at peak — peak is at mid or to the left
      hi = mid;
    }
  }

  return lo; // lo === hi === peak index
}

/**
 * Solution 3: Find Max Index (simplest, but O(n))
 * Time: O(n) — just find argmax
 * Space: O(1)
 */
function peakIndexArgMax(arr: number[]): number {
  return arr.indexOf(Math.max(...arr));
}

// === Test Cases ===
console.log(peakIndexInAMountainArray([0, 1, 0])); // 1
console.log(peakIndexInAMountainArray([0, 2, 1, 0])); // 1
console.log(peakIndexInAMountainArray([3, 4, 5, 1])); // 2
console.log(peakIndexInAMountainArray([0, 10, 5, 2])); // 1
```

---

## 🔗 Related Problems

- [Find Peak Element](https://leetcode.com/problems/find-peak-element) — generalized version: peak not necessarily global max
- [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) — classic binary search boundaries
- [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array) — binary search on non-uniformly sorted array
- [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas) — binary search on answer space
- [Peak Index in a Mountain Array — LeetCode](https://leetcode.com/problems/peak-index-in-a-mountain-array) — problem page
