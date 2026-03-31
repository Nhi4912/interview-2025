---
layout: page
title: "Check if Array Is Sorted and Rotated"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated"
---

# Check if Array Is Sorted and Rotated / Kiểm Tra Mảng Đã Sắp Xếp Và Xoay

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array / Inversion Count
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một chiếc vòng số — nếu bạn "cắt" một vòng tròn đã sắp xếp tăng dần tại một điểm bất kỳ, bạn sẽ có một mảng tăng dần nhưng với đúng một "điểm gãy" (chỗ cuối lớn hơn đầu). Nếu có nhiều hơn một điểm gãy thì mảng không phải là rotation của mảng đã sắp xếp.

**Pattern Recognition:**

- "Sorted array rotated" → at most 1 inversion point when viewed circularly
- Count positions where `arr[i] > arr[(i+1) % n]` — if ≤ 1 then valid
- Circular comparison: wrap around with modulo

**Visual:**

```
nums = [3, 4, 5, 1, 2]
Compare pairs (circular):
 3→4: OK  4→5: OK  5→1: DROP ← inversion  1→2: OK  2→3: OK (wrap)
inversions = 1 → return true

nums = [2, 1, 3, 4]
 2→1: DROP  1→3: OK  3→4: OK  4→2: DROP (wrap)
inversions = 2 → return false
```

## Problem Description

Given `nums`, return `true` if it is a rotation of some non-decreasing sorted array, otherwise `false`. An array `[a,b,c,d,e]` rotated k positions becomes `[c,d,e,a,b]`.

- `[3,4,5,1,2]` → `true` (rotation of `[1,2,3,4,5]`)
- `[2,1,3,4]` → `false`
- `[1,1,1]` → `true`

## 📝 Interview Tips

1. **Clarify**: Duplicates allowed? Yes — condition is non-decreasing / cho phép trùng lặp
2. **Approach**: Count inversions in circular array — O(n) single pass / đếm điểm gãy
3. **Edge cases**: Already sorted → 0 inversions → true / length 1 → always true / đã sort sẵn
4. **Optimize**: Stop early once count > 1 / dừng sớm khi đếm > 1
5. **Follow-up**: Find the rotation index — it's the inversion point / tìm điểm xoay
6. **Complexity**: Time O(n), Space O(1) / thời gian O(n), không gian O(1)

## Solutions

```typescript
/** Solution 1: Brute Force — try each rotation
 * Time: O(n²) | Space: O(n)
 */
function checkBrute(nums: number[]): boolean {
  const n = nums.length;
  for (let k = 0; k < n; k++) {
    const rotated = [...nums.slice(k), ...nums.slice(0, k)];
    let sorted = true;
    for (let i = 0; i + 1 < n; i++) {
      if (rotated[i] > rotated[i + 1]) {
        sorted = false;
        break;
      }
    }
    if (sorted) return true;
  }
  return false;
}

/** Solution 2: Count inversions (circular) — at most 1 allowed
 * Time: O(n) | Space: O(1)
 */
function check(nums: number[]): boolean {
  const n = nums.length;
  let drops = 0;
  for (let i = 0; i < n; i++) {
    if (nums[i] > nums[(i + 1) % n]) drops++;
    if (drops > 1) return false;
  }
  return true;
}

/** Solution 3: Find pivot explicitly — verify both halves sorted
 * Time: O(n) | Space: O(1)
 */
function checkPivot(nums: number[]): boolean {
  const n = nums.length;
  let pivot = -1;
  for (let i = 0; i + 1 < n; i++) {
    if (nums[i] > nums[i + 1]) {
      if (pivot !== -1) return false; // more than one drop
      pivot = i;
    }
  }
  if (pivot === -1) return true; // already sorted
  // rotation is valid only if last element <= first element
  return nums[n - 1] <= nums[0];
}

// Test cases
console.log(check([3, 4, 5, 1, 2])); // true
console.log(check([2, 1, 3, 4])); // false
console.log(check([1, 1, 1])); // true
console.log(check([1])); // true
console.log(checkBrute([3, 4, 5, 1, 2])); // true
console.log(checkPivot([2, 1, 3, 4])); // false
```

## 🔗 Related Problems

| Problem                                                                                                    | Relationship                             |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array) | Find the pivot / rotation point          |
| [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array)             | Binary search on rotated array           |
| [Rotate Array](https://leetcode.com/problems/rotate-array)                                                 | Inverse operation — perform the rotation |
