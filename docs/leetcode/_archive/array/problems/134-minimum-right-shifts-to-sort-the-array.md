---
layout: page
title: "Minimum Right Shifts to Sort the Array"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/minimum-right-shifts-to-sort-the-array"
---

# Minimum Right Shifts to Sort the Array / Số Lần Dịch Phải Tối Thiểu Để Sắp Xếp Mảng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array / Pivot Detection
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng mảng là một vòng đồng hồ đã được xáo trộn — bạn cần xoay kim đồng hồ về đúng vị trí "12 giờ" (phần tử nhỏ nhất ở đầu). Nếu có nhiều hơn một "điểm gãy" (chỗ số lớn đứng trước số nhỏ) thì không có cách xoay nào sửa được — trả về -1.

**Pattern Recognition:**

- "Rotation to sort" → Find the single drop point (where arr[i] > arr[i+1])
- Exactly one drop → `n - (drop_index + 1)` right shifts needed
- Zero drops → already sorted → 0 shifts
- More than one drop → impossible → -1

**Visual:**

```
nums = [3, 4, 5, 1, 2]
drops at: 5→1 (index 2)  → exactly 1 drop

n=5, dropIdx=2 → shifts = n - (dropIdx+1) = 5 - 3 = 2
Verify: right shift 2 → [1,2,3,4,5] ✓

nums = [1, 3, 2, 4]
drops at: 3→2 (idx 1), and wraparound 4→1 (idx 3) → 2 drops → return -1
```

## Problem Description

Given `nums` of **distinct** elements, return the minimum number of right-shift operations to sort it in non-decreasing order, or `-1` if impossible. Right shift: last element moves to front.

- `[3,4,5,1,2]` → `2`
- `[1,3,2,4]` → `-1`
- `[1,2,3]` → `0`

## 📝 Interview Tips

1. **Clarify**: All distinct values — no duplicates / tất cả phân biệt, không trùng
2. **Approach**: Count drop points; exactly 0 → 0 shifts, 1 → n-dropIdx-1, else -1 / đếm điểm gãy
3. **Edge cases**: Already sorted → return 0 / single element → return 0 / đã sắp xếp → 0
4. **Optimize**: Also need to check wrap-around (last > first) counts as drop / kiểm tra wrap-around
5. **Follow-up**: Same as "Check Sorted and Rotated" — nearly identical / giống bài 130
6. **Complexity**: Time O(n), Space O(1) / thời gian O(n), không gian O(1)

## Solutions

```typescript
/** Solution 1: Brute Force — try each rotation
 * Time: O(n²) | Space: O(1)
 */
function minimumRightShiftsBrute(nums: number[]): number {
  const n = nums.length;
  for (let k = 0; k < n; k++) {
    let sorted = true;
    for (let i = 0; i < n - 1; i++) {
      if (nums[(i + k) % n] > nums[(i + k + 1) % n]) {
        sorted = false;
        break;
      }
    }
    if (sorted) return k;
  }
  return -1;
}

/** Solution 2: Find single drop point — O(n) linear scan
 * Time: O(n) | Space: O(1)
 */
function minimumRightShifts(nums: number[]): number {
  const n = nums.length;
  let dropIdx = -1;
  let drops = 0;

  for (let i = 0; i < n - 1; i++) {
    if (nums[i] > nums[i + 1]) {
      drops++;
      dropIdx = i;
      if (drops > 1) return -1;
    }
  }

  if (drops === 0) return 0; // already sorted

  // Check wrap-around: last element must be <= first element for valid rotation
  if (nums[n - 1] > nums[0]) return -1;

  return n - dropIdx - 1;
}

/** Solution 3: Functional — find pivot using reduce
 * Time: O(n) | Space: O(1)
 */
function minimumRightShiftsFn(nums: number[]): number {
  const n = nums.length;
  const pivots: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    if (nums[i] > nums[i + 1]) pivots.push(i);
  }

  if (pivots.length === 0) return 0;
  if (pivots.length > 1) return -1;
  if (nums[n - 1] > nums[0]) return -1;
  return n - pivots[0] - 1;
}

// Test cases
console.log(minimumRightShifts([3, 4, 5, 1, 2])); // 2
console.log(minimumRightShifts([1, 3, 2, 4])); // -1
console.log(minimumRightShifts([1, 2, 3])); // 0
console.log(minimumRightShifts([2, 1])); // 1
console.log(minimumRightShiftsBrute([3, 4, 5, 1, 2])); // 2
console.log(minimumRightShiftsFn([1, 3, 2, 4])); // -1
```

## 🔗 Related Problems

| Problem                                                                                                    | Relationship                               |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| [Check if Array Is Sorted and Rotated](https://leetcode.com/problems/check-if-array-is-sorted-and-rotated) | Same pivot detection — check then count    |
| [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array) | Find the rotation point with binary search |
| [Rotate Array](https://leetcode.com/problems/rotate-array)                                                 | Perform rotation given count               |
