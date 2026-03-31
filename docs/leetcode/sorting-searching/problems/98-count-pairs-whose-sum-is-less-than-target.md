---
layout: page
title: "Count Pairs Whose Sum is Less than Target"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/count-pairs-whose-sum-is-less-than-target"
---

# Count Pairs Whose Sum is Less than Target / Đếm Cặp Có Tổng Nhỏ Hơn Target

> **Difficulty**: 🟢 Easy | **Category**: Sorting-Searching | **Pattern**: Two Pointers on Sorted Array

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như tìm cặp học sinh ghép đôi mà tổng điểm không vượt ngưỡng — xếp điểm từ thấp đến cao, ghép người cao nhất với người thấp nhất; nếu thỏa điều kiện thì tất cả cặp từ thấp nhất đến người cao nhất đều thỏa.

**Pattern Recognition:**

- Count pairs with sum < target → sort + two pointers → **Classic Two-Pointer**
- If nums[l]+nums[r] < target: all pairs (l, l+1), (l, l+2)…(l, r) satisfy → add r-l
- If not, shrink from right

**Visual:**

```
nums=[-1,1,2,3,1], target=2
Sort: [-1,1,1,2,3]
l=0(-1), r=4(3): -1+3=2 not < 2 → r--
l=0(-1), r=3(2): -1+2=1 < 2 → pairs: (0,1),(0,2),(0,3) count+=3, l++
l=1(1),  r=3(2): 1+2=3 not < 2 → r--
l=1(1),  r=2(1): 1+1=2 not < 2 → r--
l=1 >= r=1: stop
Total = 3
```

## Problem Description

Given a 0-indexed integer array `nums` of length `n` and integer `target`, return the number of pairs `(i, j)` where `0 ≤ i < j < n` and `nums[i] + nums[j] < target`.

**Example:**

- nums=[-1,1,2,3,1], target=2 → 3 (pairs: (-1,1),(-1,1),(-1,2))
- nums=[-6,2,5,-2,-7,-1,3], target=-2 → 10

**Constraints:** 1 ≤ nums.length ≤ 50, -50 ≤ nums[i] < 50, -50 < target ≤ 50

## 📝 Interview Tips

1. **Clarify**: Are (i,j) and (j,i) counted as one pair? (Yes, pairs are unordered with i<j)
2. **Approach**: Sort + two pointers; when left+right < target, all middle pairs also satisfy
3. **Edge cases**: All pairs satisfy, no pairs satisfy, duplicate values, negative numbers
4. **Optimize**: Two-pointer O(n log n) beats brute force O(n²); binary search also works
5. **Follow-up**: Count pairs with sum exactly equal to target? (Classic Two Sum count)
6. **Complexity**: Time O(n log n), Space O(1)

## Solutions

```typescript
// Solution 1: Sort + Two Pointers — Time: O(n log n) | Space: O(1)
function countPairs(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  let count = 0;
  let l = 0,
    r = nums.length - 1;

  while (l < r) {
    if (nums[l] + nums[r] < target) {
      // All pairs (l, l+1), (l, l+2), ..., (l, r) are valid
      count += r - l;
      l++;
    } else {
      r--;
    }
  }

  return count;
}

// Solution 2: Brute Force — Time: O(n²) | Space: O(1)
function countPairs2(nums: number[], target: number): number {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] < target) count++;
    }
  }
  return count;
}

// Solution 3: Sort + Binary Search per element — Time: O(n log n) | Space: O(1)
function countPairs3(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  let count = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    // Find largest j where nums[i] + nums[j] < target
    const need = target - nums[i]; // nums[j] < need
    // Binary search for rightmost value < need in nums[i+1..]
    let lo = i + 1,
      hi = nums.length - 1,
      pos = i; // pos = last valid index
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (nums[mid] < need) {
        pos = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    count += pos - i; // indices i+1..pos are all valid
  }

  return count;
}

// Tests
console.log(countPairs([-1, 1, 2, 3, 1], 2)); // 3
console.log(countPairs([-6, 2, 5, -2, -7, -1, 3], -2)); // 10
console.log(countPairs([1, 2, 3], 10)); // 3
console.log(countPairs([1, 2, 3], 1)); // 0
console.log(countPairs([0, 0, 0, 0], 1)); // 6
```

## 🔗 Related Problems

| Problem                                                                                                                            | Relationship                              |
| ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [Two Sum II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted)                                                       | Two pointers on sorted array for pair sum |
| [3Sum Smaller](https://leetcode.com/problems/3sum-smaller)                                                                         | Count triplets with sum < target          |
| [Count Number of Pairs With Absolute Difference K](https://leetcode.com/problems/count-number-of-pairs-with-absolute-difference-k) | Pair counting with condition              |
