---
layout: page
title: "3Sum Smaller"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/3sum-smaller"
---

# 3Sum Smaller / Tổng Ba Số Nhỏ Hơn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sort + Two Pointers
> **Frequency**: 📘 Tier 3 | **Company tags**: Google

## 🧠 Intuition / Tư Duy

**Giống đặt 3 người vào thang máy có trọng tải giới hạn:** sort rồi fix người nặng nhất, dùng hai con trỏ để đếm bao nhiêu combo 3 người có tổng < target — khi L+R < target thì mọi pair (L, L+1..R) đều hợp lệ.

**Pattern Recognition:**

- Signal: "count triplets with sum < target + unsorted array" → **Sort + Fix One + Two Pointers**
- Sort → nums[i]≤nums[j]≤nums[k]: chỉ cần check nums[i]+nums[j]+nums[k] < target
- Khi nums[i]+nums[j]+nums[k] < target: mọi k' < k cũng hợp lệ → count += k-j, j++

**Visual:**

```
nums=[-2,0,1,3], target=2 → sorted: [-2,0,1,3]

Fix i=0 (-2): j=1(0), k=3(3)
  -2+0+3=1 < 2 → count += k-j = 2, pairs:(j=1,k=2),(j=1,k=3)... j++
  j=2(1), k=3(3): -2+1+3=2 not < 2 → k--
  j=2==k=2: inner loop ends. i=0 count=2

Fix i=1 (0): j=2(1), k=3(3)
  0+1+3=4 ≥ 2 → k--
  k=2==j=2: inner loop ends. count still 2

Fix i=2: j=3, loop doesn't run.
Total: 2 ✅
```

## Problem Description

Given an array `nums` of `n` integers and `target`, find the count of triplets `(i,j,k)` with `i < j < k` and `nums[i] + nums[j] + nums[k] < target`.

- Example 1: `nums=[-2,0,1,3], target=2` → `2`
- Example 2: `nums=[], target=0` → `0`
- Example 3: `nums=[0], target=0` → `0`

## 📝 Interview Tips

1. **Clarify**: Triplets có thể duplicate không? / Can triplets have duplicate values? Yes (different indices)
2. **Approach**: Sort + fix i + two pointers / When sum < target, count += right-left (all left..right-1 pairs work)
3. **Edge cases**: n < 3 → 0 / Array smaller than 3 elements returns 0
4. **Optimize**: O(n³) brute → O(n²) with two pointers / key insight: when sum < target, multiple pairs valid at once
5. **Follow-up**: 3Sum Closest? 3Sum Larger? / Variants use same framework
6. **Complexity**: Time O(n²), Space O(log n) for sort / O(n²) optimal

## Solutions

```typescript
/** Solution 1: Brute Force – Check All Triplets
 * Time: O(n³) | Space: O(1)
 */
function threeSumSmallerBrute(nums: number[], target: number): number {
  let count = 0;
  const n = nums.length;
  for (let i = 0; i < n - 2; i++)
    for (let j = i + 1; j < n - 1; j++)
      for (let k = j + 1; k < n; k++) if (nums[i] + nums[j] + nums[k] < target) count++;
  return count;
}

/** Solution 2: Sort + Binary Search for Each Pair
 * Time: O(n² log n) | Space: O(log n)
 */
function threeSumSmallerBS(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let count = 0;

  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      const remain = target - nums[i] - nums[j] - 1; // largest k can be
      // Binary search for rightmost nums[k] <= remain
      let lo = j + 1,
        hi = n - 1,
        pos = j;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] <= remain) {
          pos = mid;
          lo = mid + 1;
        } else hi = mid - 1;
      }
      count += pos - j;
    }
  }
  return count;
}

/** Solution 3: Sort + Two Pointers (Optimal)
 * Time: O(n²) | Space: O(log n)
 */
function threeSumSmaller(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  let count = 0;

  for (let i = 0; i < n - 2; i++) {
    let j = i + 1,
      k = n - 1;
    while (j < k) {
      if (nums[i] + nums[j] + nums[k] < target) {
        // All triplets (i, j, j+1..k) are valid
        count += k - j;
        j++;
      } else {
        k--;
      }
    }
  }
  return count;
}

// Tests
console.log(threeSumSmaller([-2, 0, 1, 3], 2)); // 2
console.log(threeSumSmaller([], 0)); // 0
console.log(threeSumSmaller([0, 0, 0], 1)); // 1
console.log(threeSumSmaller([-1, 1, -1, -1], -1)); // 1
console.log(threeSumSmallerBrute([-2, 0, 1, 3], 2)); // 2
console.log(threeSumSmallerBS([-2, 0, 1, 3], 2)); // 2
```

## 🔗 Related Problems

| Problem                                                                      | Relationship                      |
| ---------------------------------------------------------------------------- | --------------------------------- |
| [3Sum](https://leetcode.com/problems/3sum)                                   | Same sort + two-pointer framework |
| [Valid Triangle Number](https://leetcode.com/problems/valid-triangle-number) | Count triplets with a+b>c         |
| [Two Sum Less Than K](https://leetcode.com/problems/two-sum-less-than-k)     | Same idea, two elements           |
