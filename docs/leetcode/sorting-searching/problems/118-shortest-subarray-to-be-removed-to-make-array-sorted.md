---
layout: page
title: "Shortest Subarray to be Removed to Make Array Sorted"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Stack, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted"
---

# Shortest Subarray to be Removed to Make Array Sorted / Mảng Con Ngắn Nhất Cần Xóa Để Mảng Có Thứ Tự

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers on Prefix/Suffix
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [132 Pattern](https://leetcode.com/problems/132-pattern) | [Create Maximum Number](https://leetcode.com/problems/create-maximum-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng đường núi — phần đầu leo dốc đúng (non-decreasing), phần cuối cũng đúng, nhưng có vùng giữa lộn xộn. Ta xóa đúng vùng giữa. Câu hỏi: vùng giữa ngắn nhất là bao nhiêu?

**Pattern Recognition:**

- Signal: "remove subarray to make sorted" → **Find valid prefix + valid suffix, merge with two pointers**
- Find longest non-decreasing prefix [0..left] và suffix [right..n-1]
- Key insight: try each prefix end i ∈ [0..left], two-pointer find first j in suffix where nums[j] ≥ nums[i]

**Visual — nums=[1,2,3,10,4,2,3,5]:**

```
Prefix (non-decreasing): [1,2,3,10] → left = 3
Suffix (non-decreasing): [2,3,5]    → right = 5

Option A: remove suffix portion → remove [4..7] → length 4
Option B: remove prefix portion → remove [0..4] → length 5
Option C: keep prefix [0..0]=[1], find j where nums[j]≥1 → j=5, remove [1..4] → length 4
Option D: keep prefix [0..1]=[1,2], find j where nums[j]≥2 → j=5, remove [2..4] → length 3 ✓
```

---

## Problem Description

Given integer array `nums`, return the **length of the shortest subarray** to remove so the remaining elements are non-decreasing. ([LeetCode 1574](https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted))

Difficulty: Medium | Acceptance: 51.4%

```
Example 1: nums=[1,2,3,10,4,2,3,5]  → 3
  (remove [10,4,2] → [1,2,3,3,5] non-decreasing)
Example 2: nums=[5,4,3,2,1]         → 4
  (remove 4 elements, keep only one)
Example 3: nums=[1,2,3]             → 0
  (already sorted)
```

Constraints: `1 ≤ n ≤ 10^5`, `0 ≤ nums[i] ≤ 10^9`

---

## 📝 Interview Tips

1. **Non-decreasing / Không giảm**: "Đề nói non-decreasing (≤), không phải strictly increasing (<)"
2. **Three cases / Ba trường hợp**: Remove from right only / Remove from left only / Remove from middle
3. **Two pointers / Hai con trỏ**: For each prefix end i, pointer j moves right (monotone) → total O(n)
4. **Already sorted / Đã sắp xếp**: Kiểm tra left == n-1 trước → return 0
5. **Edge: fully reverse / Hoàn toàn giảm dần**: right = 0 → must remove all but one → n-1
6. **Complexity / Độ phức tạp**: O(n) with two pointers after O(n) prefix/suffix scan

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try every (i, j), check if valid
 * Time: O(n^2)  Space: O(1)
 */
function findLengthOfShortestSubarrayBrute(arr: number[]): number {
  const n = arr.length;
  const isNonDec = (l: number, r: number): boolean => {
    for (let i = l; i < r; i++) if (arr[i] > arr[i + 1]) return false;
    return true;
  };
  let minLen = n - 1;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // remaining: arr[0..i-1] + arr[j+1..n-1]
      const leftOk = isNonDec(0, i - 1);
      const rightOk = isNonDec(j + 1, n - 1);
      const connOk = i === 0 || j === n - 1 || arr[i - 1] <= arr[j + 1];
      if (leftOk && rightOk && connOk) minLen = Math.min(minLen, j - i + 1);
    }
  }
  return minLen;
}

/**
 * Solution 2: Two Pointers on Prefix/Suffix (Optimal)
 * Time: O(n)  Space: O(1)
 *
 * 1. Find left: arr[0..left] is non-decreasing (max prefix)
 * 2. Find right: arr[right..n-1] is non-decreasing (max suffix)
 * 3. If already sorted, return 0
 * 4. Min removal = min(n-1-left, right)  [remove all suffix or all prefix]
 * 5. Two pointers: for each prefix end i (0..left), advance j from right
 *    until arr[j] >= arr[i]. Remove [i+1..j-1] → length j-i-1.
 */
function findLengthOfShortestSubarray(arr: number[]): number {
  const n = arr.length;

  // Find longest non-decreasing prefix
  let left = 0;
  while (left + 1 < n && arr[left + 1] >= arr[left]) left++;

  if (left === n - 1) return 0; // already sorted

  // Find longest non-decreasing suffix
  let right = n - 1;
  while (right - 1 >= 0 && arr[right] >= arr[right - 1]) right--;

  // Option A: remove [left+1..n-1] (everything after prefix)
  // Option B: remove [0..right-1] (everything before suffix)
  let minLen = Math.min(n - 1 - left, right);

  // Option C: keep prefix [0..i] and suffix [j..n-1], need arr[i] <= arr[j]
  let j = right;
  for (let i = 0; i <= left; i++) {
    // advance j until arr[j] >= arr[i]
    while (j < n && arr[j] < arr[i]) j++;
    // remove [i+1..j-1], length = j - i - 1
    minLen = Math.min(minLen, j - i - 1);
  }

  return minLen;
}

// === Tests ===
console.log(findLengthOfShortestSubarray([1, 2, 3, 10, 4, 2, 3, 5])); // 3
console.log(findLengthOfShortestSubarray([5, 4, 3, 2, 1])); // 4
console.log(findLengthOfShortestSubarray([1, 2, 3])); // 0
console.log(findLengthOfShortestSubarray([1])); // 0
console.log(findLengthOfShortestSubarrayBrute([1, 2, 3, 10, 4, 2, 3, 5])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                                                  | Relationship                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| [1574. Shortest Subarray to be Removed to Make Array Sorted](https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted)         | This problem                   |
| [2972. Count the Number of Incremovable Subarrays II](https://leetcode.com/problems/count-the-number-of-incremovable-subarrays-ii)                       | Count all valid removals       |
| [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence)                                                      | LIS for non-contiguous variant |
| [1909. Remove One Element to Make the Array Strictly Increasing](https://leetcode.com/problems/remove-one-element-to-make-the-array-strictly-increasing) | Remove exactly one element     |
| [581. Shortest Unsorted Continuous Subarray](https://leetcode.com/problems/shortest-unsorted-continuous-subarray)                                        | Find unsorted middle subarray  |
