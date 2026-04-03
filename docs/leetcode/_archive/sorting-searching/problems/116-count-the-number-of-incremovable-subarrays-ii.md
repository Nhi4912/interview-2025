---
layout: page
title: "Count the Number of Incremovable Subarrays II"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search]
leetcode_url: "https://leetcode.com/problems/count-the-number-of-incremovable-subarrays-ii"
---

# Count the Number of Incremovable Subarrays II / Đếm Số Mảng Con Có Thể Xóa II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Two Pointers + Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) | [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng một con đường — phần đầu đang dốc lên đúng, phần cuối cũng dốc lên đúng, nhưng giữa bị "lún". Ta cần xóa đúng phần lún đó. Bài toán đếm số cách xóa.

**Pattern Recognition:**

- Signal: "remove subarray so remaining is strictly increasing" + n ≤ 10^5 → **Two Pointers + Binary Search**
- Find longest valid prefix (left) và suffix (right)
- Key insight: for each prefix end `i`, binary search for first valid suffix start `j`

**Visual — nums=[1,2,3,10,4,2,3,5]:**

```
Prefix: [1,2,3,10] → left = 3 (0-indexed, nums[3]=10 breaks at next)
Suffix: [2,3,5]    → right = 5 (0-indexed, start of valid suffix)

For i=0 (remove from start), j ≥ right-1=4: choices j=4,5,6,7 → 4 ways
For i=1 (keep nums[0]=1), need nums[j+1] > 1: j from right-1...
For i=2 (keep nums[0..1]=[1,2]), need nums[j+1] > 2: binary search in suffix
...
```

---

## Problem Description

Count pairs `(i, j)` with `0 ≤ i ≤ j ≤ n-1` such that removing `nums[i..j]` makes the remaining array **strictly increasing** (empty array counts). ([LeetCode 2972](https://leetcode.com/problems/count-the-number-of-incremovable-subarrays-ii))

Difficulty: Hard | Acceptance: 39.0%

```
Example 1: nums=[1,2,3,4]  → 10
  (array already sorted: any subarray removal keeps it sorted or empty)
Example 2: nums=[6,5,7,8]  → 7
Example 3: nums=[8,7,6,6]  → 2
```

Constraints: `1 ≤ n ≤ 10^5`, `1 ≤ nums[i] ≤ 10^9`

---

## 📝 Interview Tips

1. **Define prefix/suffix / Định nghĩa**: "left = max index where nums[0..left] is strictly increasing"
2. **Three cases / Ba trường hợp**: (1) remove only suffix (2) remove only prefix (3) remove middle portion
3. **Binary search for j / Tìm j**: With prefix end i-1, binary search for first j where nums[j] > nums[i-1]
4. **Empty parts valid / Phần rỗng hợp lệ**: i=0 (no prefix) và j=n-1 (no suffix) both valid
5. **Overflow / Tràn số**: dùng BigInt hoặc number nếu n ≤ 10^5 (result ≤ n^2/2 ≈ 5\*10^9 → cần BigInt)
6. **Complexity / Độ phức tạp**: O(n log n) — O(n) for prefix/suffix, O(left \* log n) for binary search

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check every (i,j) pair
 * Time: O(n^3)  Space: O(n)
 * Only feasible for n ≤ 1000
 */
function incremovableSubarrayCountBrute(nums: number[]): number {
  const n = nums.length;
  const isStrictlyIncreasing = (arr: number[]): boolean => {
    for (let i = 1; i < arr.length; i++) if (arr[i] <= arr[i - 1]) return false;
    return true;
  };
  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const remaining = [...nums.slice(0, i), ...nums.slice(j + 1)];
      if (isStrictlyIncreasing(remaining)) count++;
    }
  }
  return count;
}

/**
 * Solution 2: Two Pointers + Binary Search (Optimal)
 * Time: O(n log n)  Space: O(1)
 *
 * Steps:
 * 1. Find `left`: max index so nums[0..left] is strictly increasing
 * 2. Find `right`: min index so nums[right..n-1] is strictly increasing
 * 3. Count (i, j) pairs:
 *    - i = 0 (no prefix): j can be from max(0, right-1) to n-1
 *    - i = 1..left+1 (keep prefix [0..i-1]): binary search for smallest j where
 *      j >= right-1 and (j == n-1 or nums[j+1] > nums[i-1])
 */
function incremovableSubarrayCount(nums: number[]): number {
  const n = nums.length;

  // Find longest strictly increasing prefix
  let left = 0;
  while (left + 1 < n && nums[left + 1] > nums[left]) left++;

  // Already fully sorted
  if (left === n - 1) return (n * (n + 1)) / 2;

  // Find longest strictly increasing suffix
  let right = n - 1;
  while (right - 1 >= 0 && nums[right] > nums[right - 1]) right--;

  // Count pairs
  // Case i=0: remove from index 0 to j (j >= right-1)
  let count = n - right + 1; // j = right-1, right, ..., n-1

  // Case i=1..left+1: keep prefix [0..i-1], remove [i..j]
  // Need: nums[j+1] > nums[i-1] (when j < n-1), and j+1 >= right
  // Suffix nums[right..n-1] is strictly increasing, so binary search for
  // first index k >= right where nums[k] > nums[i-1]
  for (let i = 1; i <= left + 1; i++) {
    const target = nums[i - 1];
    // Binary search: first k in [right, n-1] where nums[k] > target
    let lo = right,
      hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] > target) hi = mid;
      else lo = mid + 1;
    }
    // j = k-1 is the first valid j (where j+1 = k has nums[k] > target)
    // Also j = n-1 always valid (empty right part)
    // Valid j: from max(i, lo-1) to n-1
    const jStart = Math.max(i, lo - 1);
    count += n - jStart;
  }

  return count;
}

// === Tests ===
console.log(incremovableSubarrayCount([1, 2, 3, 4])); // 10
console.log(incremovableSubarrayCount([6, 5, 7, 8])); // 7
console.log(incremovableSubarrayCount([8, 7, 6, 6])); // 3
console.log(incremovableSubarrayCountBrute([6, 5, 7, 8])); // 7
console.log(incremovableSubarrayCountBrute([8, 7, 6, 6])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                                                          | Relationship                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| [2972. Count the Number of Incremovable Subarrays II](https://leetcode.com/problems/count-the-number-of-incremovable-subarrays-ii)               | This problem                    |
| [2970. Count the Number of Incremovable Subarrays I](https://leetcode.com/problems/count-the-number-of-incremovable-subarrays-i)                 | Same problem, O(n²) brute force |
| [1574. Shortest Subarray to be Removed to Make Array Sorted](https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted) | Find shortest such subarray     |
| [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence)                                              | Prefix/suffix monotone analysis |
| [2856. Minimum Array Length After Pair Removals](https://leetcode.com/problems/minimum-array-length-after-pair-removals)                         | Two pointers counting           |
