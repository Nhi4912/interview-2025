---
layout: page
title: "Sort Array By Parity"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Two Pointers, Sorting]
leetcode_url: "https://leetcode.com/problems/sort-array-by-parity"
---

# Sort Array By Parity / Sắp Xếp Mảng Theo Tính Chẵn Lẻ

🟢 Easy | 🏷️ Array, Two Pointers, Sorting

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Bạn có một hàng người — một số mặc áo chẵn (even), số khác mặc áo lẻ (odd). Đưa tất cả người áo chẵn ra phía trước, lẻ ra sau. Dùng hai con trỏ: trái từ đầu tìm số lẻ, phải từ cuối tìm số chẵn — hoán đổi cặp không đúng chỗ. O(n) thời gian, O(1) không gian.

```
nums = [3,1,2,4]

left=0(odd=3)  right=3(even=4) → swap → [4,1,2,3]
left=1(odd=1)  right=2(even=2) → swap → [4,2,1,3]
left=2 >= right=1 → stop

Result: [4,2,1,3] ✓ (all evens before odds)
```

## Problem Description

Given an integer array `nums`, move all **even integers** to the beginning and all **odd integers** to the end. Return any valid ordering; relative order within each group does not matter.

**Example 1:** `nums = [3,1,2,4]` → `[2,4,3,1]` (or any arrangement with evens first)

**Example 2:** `nums = [0]` → `[0]`

## 📝 Interview Tips

- 🔑 **Two-pointer / Hai con trỏ:** Left seeks odd, right seeks even — swap when both found; O(n) time O(1) space
- 🔑 **Partition / Phân vùng:** This is exactly partition step of QuickSort with pivot = "even/odd"
- 🔑 **In-place / Tại chỗ:** Avoid creating a new array; two-pointer does it in-place
- ⚠️ **Order not required / Không cần thứ tự:** Relative order within evens/odds doesn't matter — simplifies to two-pointer
- ⚠️ **All evens / Toàn chẵn:** If all even or all odd, two-pointer terminates immediately without swaps
- 🔗 **Pattern / Mẫu:** Two-pointer partition is a building block for Dutch National Flag, QuickSelect, etc.

## Solutions

### Solution 1: Two-Pointer In-Place (Optimal)

```typescript
/**
 * Two pointers from both ends; swap misplaced pairs.
 * Time: O(n)  Space: O(1)
 */
function sortArrayByParity(nums: number[]): number[] {
  let left = 0,
    right = nums.length - 1;

  while (left < right) {
    // Advance left past evens
    while (left < right && nums[left] % 2 === 0) left++;
    // Advance right past odds
    while (left < right && nums[right] % 2 !== 0) right--;
    // Swap odd at left with even at right
    if (left < right) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++;
      right--;
    }
  }

  return nums;
}

console.log(sortArrayByParity([3, 1, 2, 4])); // [4,2,1,3] or similar evens-first
console.log(sortArrayByParity([0])); // [0]
console.log(sortArrayByParity([1, 3, 5])); // [1,3,5] (all odd, already valid)
console.log(sortArrayByParity([2, 4, 6])); // [2,4,6] (all even)
```

### Solution 2: Stable Partition with Filter (Extra Space)

```typescript
/**
 * Create two partitions, concatenate. Stable (preserves original order within groups).
 * Time: O(n)  Space: O(n)
 */
function sortArrayByParityStable(nums: number[]): number[] {
  const evens = nums.filter((x) => x % 2 === 0);
  const odds = nums.filter((x) => x % 2 !== 0);
  return [...evens, ...odds];
}

console.log(sortArrayByParityStable([3, 1, 2, 4])); // [2,4,3,1]
console.log(sortArrayByParityStable([0])); // [0]
```

### Solution 3: Single Pass with Index Tracking

```typescript
/**
 * One pass: write evens to front of result array, odds to back.
 * Time: O(n)  Space: O(n)
 */
function sortArrayByParitySinglePass(nums: number[]): number[] {
  const result = new Array(nums.length);
  let lo = 0,
    hi = nums.length - 1;

  for (const num of nums) {
    if (num % 2 === 0) result[lo++] = num;
    else result[hi--] = num;
  }

  return result;
}

console.log(sortArrayByParitySinglePass([3, 1, 2, 4])); // [2,4,...] evens first
console.log(sortArrayByParitySinglePass([0])); // [0]
console.log(sortArrayByParitySinglePass([1, 3, 2, 4])); // [2,4,3,1] or similar
```

### Solution 4: Sort with Comparator

```typescript
/**
 * Use sort() with custom comparator: even < odd.
 * Time: O(n log n)  Space: O(log n) for sort stack
 * Simple but not optimal; good for code golf.
 */
function sortArrayByParitySort(nums: number[]): number[] {
  return [...nums].sort((a, b) => (a % 2) - (b % 2));
}

console.log(sortArrayByParitySort([3, 1, 2, 4])); // [2,4,3,1]
console.log(sortArrayByParitySort([0])); // [0]
```

## 🔗 Related Problems

| Problem                                                                                                             | Difficulty | Pattern                 |
| ------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| [Sort Array By Parity II](https://leetcode.com/problems/sort-array-by-parity-ii/)                                   | Easy       | Two-pointer interleaved |
| [Move Zeroes](https://leetcode.com/problems/move-zeroes/)                                                           | Easy       | Partition / two-pointer |
| [Partition Array According to Given Pivot](https://leetcode.com/problems/partition-array-according-to-given-pivot/) | Medium     | Stable partition        |
| [Dutch National Flag](https://leetcode.com/problems/sort-colors/)                                                   | Medium     | Three-way partition     |
