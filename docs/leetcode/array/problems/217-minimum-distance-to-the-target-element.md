---
layout: page
title: "Minimum Distance to the Target Element"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/minimum-distance-to-the-target-element"
---

# Minimum Distance to the Target Element / Khoảng Cách Nhỏ Nhất Đến Phần Tử Mục Tiêu

> **Difficulty**: 🟢 Easy | **Category**: Array | **Pattern**: Linear Scan / Min Tracking

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như tìm người bạn gần nhất trong hàng ngang — bạn biết vị trí của mình (start), và tìm người đó (target) gần bạn nhất theo khoảng cách ghế ngồi.

**Pattern Recognition:**

- Single linear scan to find all indices where `nums[i] == target`
- Track minimum `|i - start|` across all matching positions
- No sorting needed — just iterate once

**Visual:**

```
nums  = [1, 2, 3, 4, 5], target = 5, start = 3
       idx: 0  1  2  3  4

Find all i where nums[i] == 5 → i=4
|4 - 3| = 1

nums  = [1, 2, 3, 4, 5, 2, 3], target = 2, start = 4
i=1: |1-4|=3
i=5: |5-4|=1  ← minimum
Answer: 1
```

## Problem Description

Given array `nums`, integer `start`, and integer `target`, find the minimum absolute distance `|i - start|` for all `i` where `nums[i] == target`. It's guaranteed that `target` exists in `nums`.

**Example 1:** `nums=[1,2,3,4,5], target=5, start=3` → `1`
**Example 2:** `nums=[1,2,3,4,5,2,3], target=2, start=4` → `1`

**Constraints:** `1 ≤ nums.length ≤ 1000`, target guaranteed to exist

## 📝 Interview Tips

1. **Clarify**: Is `start` always a valid index? (Yes, per constraints)
2. **Approach**: Linear scan — O(n) one pass, track min distance
3. **Edge cases**: target appears once, target equals `nums[start]` (distance=0)
4. **Optimize**: Could break early if distance = 0 found
5. **Follow-up**: What if multiple queries? (preprocess indices with a map)
6. **Complexity**: Time O(n), Space O(1)

## Solutions

```typescript
// Solution 1: Single linear scan — Time: O(n) | Space: O(1)
function getMinDistance(nums: number[], target: number, start: number): number {
  let minDist = Infinity;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      minDist = Math.min(minDist, Math.abs(i - start));
      if (minDist === 0) return 0; // can't do better
    }
  }

  return minDist;
}

// Solution 2: Reduce approach — Time: O(n) | Space: O(1)
function getMinDistance2(nums: number[], target: number, start: number): number {
  return nums.reduce(
    (min, val, idx) => (val === target ? Math.min(min, Math.abs(idx - start)) : min),
    Infinity,
  );
}

// Solution 3: Collect indices then find min — Time: O(n) | Space: O(k)
function getMinDistance3(nums: number[], target: number, start: number): number {
  const indices = nums.map((v, i) => (v === target ? i : -1)).filter((i) => i !== -1);

  return Math.min(...indices.map((i) => Math.abs(i - start)));
}

// Tests
console.log(getMinDistance([1, 2, 3, 4, 5], 5, 3)); // 1
console.log(getMinDistance([1, 2, 3, 4, 5, 2, 3], 2, 4)); // 1
console.log(getMinDistance([1], 1, 0)); // 0
console.log(getMinDistance2([1, 2, 3, 4, 5], 5, 3)); // 1
console.log(getMinDistance3([5, 3, 6, 5, 2], 5, 0)); // 0
```

## 🔗 Related Problems

| Problem                                                                                                                     | Relationship                       |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | --- | ---------------- |
| [Find Nearest Point (LeetCode 1779)](https://leetcode.com/problems/find-nearest-point-that-has-the-same-x-or-y-coordinate/) | Minimum distance in 2D coordinates |
| [Minimum Absolute Difference (LeetCode 1200)](https://leetcode.com/problems/minimum-absolute-difference/)                   | Minimum                            | a-b | between elements |
| [K Closest Points to Origin (LeetCode 973)](https://leetcode.com/problems/k-closest-points-to-origin/)                      | Distance-based element selection   |
