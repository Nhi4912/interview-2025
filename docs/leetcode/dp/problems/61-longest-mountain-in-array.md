---
layout: page
title: "Longest Mountain in Array"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Two Pointers, Dynamic Programming, Enumeration]
leetcode_url: "https://leetcode.com/problems/longest-mountain-in-array"
---

# Longest Mountain in Array / Dãy Núi Dài Nhất Trong Mảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers / Linear DP
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Valid Mountain Array](https://leetcode.com/problems/valid-mountain-array) | [Longest Turbulent Subarray](https://leetcode.com/problems/longest-turbulent-subarray)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Như tìm ngọn núi dài nhất trên mặt cắt địa hình — một "núi" phải có phần dốc lên (strictly) rồi dốc xuống (strictly), đỉnh không ở đầu hay cuối. Với mỗi đỉnh tiềm năng, mở rộng sang hai bên trong khi còn dốc.

**Pattern Recognition:**

- Signal: "strictly increasing then strictly decreasing" → **Enumerate peaks + expand**
- Một đỉnh hợp lệ: `arr[i-1] < arr[i] > arr[i+1]`
- Key insight: DP với `up[i]` = độ dài sườn lên kết thúc tại i, `down[i]` = sườn xuống bắt đầu tại i

**Visual — arr = [2, 1, 4, 7, 3, 2, 5]:**

```
Index:  0  1  2  3  4  5  6
arr:    2  1  4  7  3  2  5

up[i]:  0  0  1  2  0  0  1   (len of strictly increasing run ending at i)
down[i]:0  0  0  2  1  0  0   (len of strictly decreasing run starting at i)

Mountain at peak i=3: up[3]=2, down[3]=2 → length = 2+2+1 = 5  [1,4,7,3,2]
Mountain at peak i=2: up[2]=1, down[2]=0 → not a mountain (no descent)
Answer: 5
```

---

## Problem Description

Given an integer array `arr`, return the length of the longest subarray that forms a mountain. A mountain has at least 3 elements, strictly increases to a peak, then strictly decreases.

- Example 1: `arr = [2,1,4,7,3,2,5]` → `5` (subarray `[1,4,7,3,2]`)
- Example 2: `arr = [2,2,2]` → `0` (no mountain — not strictly increasing/decreasing)
- Example 3: `arr = [0,1,2,3,4,5,4,3,2,1,0]` → `11` (entire array)

Constraints: `1 <= arr.length <= 10^4`, `0 <= arr[i] <= 10^4`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Strictly increasing AND decreasing — equal elements không tạo núi" / Strict inequalities required
2. **Minimum length**: Mountain cần ít nhất 3 phần tử (lên + đỉnh + xuống)
3. **Brute force**: Với mỗi đỉnh i (arr[i-1]<arr[i]>arr[i+1]), expand left và right — O(n²) worst case
4. **DP approach**: `up[i]` + `down[i]` được tính trong 2 pass O(n), answer = max(up[i]+down[i]+1) where both >0
5. **Two-pass DP**: Forward pass cho up[], backward pass cho down[]
6. **Edge case**: n < 3 → return 0 immediately; flat sequences → up/down stay 0

---

## Solutions

```typescript
/**
 * Solution 1: Enumerate Peaks — Brute Force
 * Time: O(n²) — for each of n peaks, expand up to n steps in each direction
 * Space: O(1)
 */
function longestMountainBrute(arr: number[]): number {
  const n = arr.length;
  if (n < 3) return 0;
  let ans = 0;

  for (let peak = 1; peak < n - 1; peak++) {
    if (arr[peak] <= arr[peak - 1] || arr[peak] <= arr[peak + 1]) continue;
    let lo = peak - 1,
      hi = peak + 1;
    while (lo > 0 && arr[lo - 1] < arr[lo]) lo--;
    while (hi < n - 1 && arr[hi + 1] < arr[hi]) hi++;
    ans = Math.max(ans, hi - lo + 1);
  }

  return ans;
}

/**
 * Solution 2: Two-Pass Linear DP (Optimal)
 * Time: O(n) — two linear passes to build up[] and down[]
 * Space: O(n) — two auxiliary arrays
 */
function longestMountain(arr: number[]): number {
  const n = arr.length;
  if (n < 3) return 0;

  // up[i] = length of strictly increasing run ending at index i (from left)
  const up = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    up[i] = arr[i] > arr[i - 1] ? up[i - 1] + 1 : 0;
  }

  // down[i] = length of strictly decreasing run starting at index i (to right)
  const down = new Array(n).fill(0);
  for (let i = n - 2; i >= 0; i--) {
    down[i] = arr[i] > arr[i + 1] ? down[i + 1] + 1 : 0;
  }

  let ans = 0;
  for (let i = 1; i < n - 1; i++) {
    // Valid mountain peak: must have ascent on left AND descent on right
    if (up[i] > 0 && down[i] > 0) {
      ans = Math.max(ans, up[i] + down[i] + 1);
    }
  }

  return ans;
}

// === Test Cases ===
console.log(longestMountain([2, 1, 4, 7, 3, 2, 5])); // 5
console.log(longestMountain([2, 2, 2])); // 0
console.log(longestMountain([0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0])); // 11
console.log(longestMountain([9, 8, 7, 6, 5])); // 0
```

---

## 🔗 Related Problems

- [Valid Mountain Array](https://leetcode.com/problems/valid-mountain-array) — check if entire array is a mountain
- [Longest Turbulent Subarray](https://leetcode.com/problems/longest-turbulent-subarray) — alternating up/down pattern, same DP idea
- [Peak Index in a Mountain Array](https://leetcode.com/problems/peak-index-in-a-mountain-array) — find peak index in guaranteed mountain
- [Find in Mountain Array](https://leetcode.com/problems/find-in-mountain-array) — binary search on mountain
- [Minimum Number of Removals to Make Mountain Array](https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array) — harder mountain DP
