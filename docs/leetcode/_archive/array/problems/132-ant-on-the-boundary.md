---
layout: page
title: "Ant on the Boundary"
difficulty: Easy
category: Array
tags: [Array, Simulation, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/ant-on-the-boundary"
---

# Ant on the Boundary / Con Kiến Trên Biên

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Prefix Sum / Simulation
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Analogy:** Một con kiến đứng tại vị trí 0. Mỗi lần nó nhận lệnh `nums[i]`: dương thì đi phải, âm thì đi trái. Sau mỗi lệnh, nếu nó về đúng vị trí 0 thì đó là một lần "chạm biên". Đây chính là đếm số lần prefix sum bằng 0 — không cần mảng phụ, chỉ cần biến đếm chạy.

**Pattern Recognition:**

- "Ant returns to origin" → count prefix sums equal to 0
- Running sum = ant position after each step
- No need to store all prefix sums — just check `cur === 0` each step

**Visual:**

```
nums = [2, 3, -5]
Step 1: pos = 0+2 = 2   → not 0
Step 2: pos = 2+3 = 5   → not 0
Step 3: pos = 5-5 = 0   → AT BOUNDARY ✓ count=1
→ return 1

nums = [-1, 4, -3, 2]
Step 1: -1  → not 0
Step 2:  3  → not 0
Step 3:  0  → ✓ count=1
Step 4:  2  → not 0
→ return 1
```

## Problem Description

An ant starts at position 0. Given `nums`, the ant moves `nums[i]` steps at round `i`. Return the number of times the ant **returns to the boundary (position 0)** after each round.

- `[2,3,-5]` → `1`
- `[-1,4,-3,2]` → `1`
- `[1,-1,1,-1]` → `2`

## 📝 Interview Tips

1. **Clarify**: Count only boundary touches after moving (not counting initial position) / chỉ đếm sau khi di chuyển
2. **Approach**: Track running sum, count zeros — O(n) / theo dõi tổng chạy, đếm lần bằng 0
3. **Edge cases**: First move lands on 0 → count 1 / bước đầu về 0 vẫn tính
4. **Optimize**: No extra space needed — running sum only / không cần mảng prefix
5. **Follow-up**: Count times crossing 0 (not just landing) → different: count sign changes
6. **Complexity**: Time O(n), Space O(1) / thời gian O(n), không gian O(1)

## Solutions

```typescript
/** Solution 1: Simulation — directly simulate ant movement
 * Time: O(n) | Space: O(1)
 */
function returnToBoundaryCountSimulate(nums: number[]): number {
  let pos = 0,
    count = 0;
  for (const step of nums) {
    pos += step;
    if (pos === 0) count++;
  }
  return count;
}

/** Solution 2: Prefix Sum array — build all prefix sums then count zeros
 * Time: O(n) | Space: O(n)
 */
function returnToBoundaryCountPrefix(nums: number[]): number {
  let sum = 0;
  const prefix: number[] = [];
  for (const x of nums) {
    sum += x;
    prefix.push(sum);
  }
  return prefix.filter((v) => v === 0).length;
}

/** Solution 3: Functional style
 * Time: O(n) | Space: O(n)
 */
function returnToBoundaryCount(nums: number[]): number {
  let pos = 0;
  return nums.reduce((count, step) => {
    pos += step;
    return count + (pos === 0 ? 1 : 0);
  }, 0);
}

// Test cases
console.log(returnToBoundaryCount([2, 3, -5])); // 1
console.log(returnToBoundaryCount([-1, 4, -3, 2])); // 1
console.log(returnToBoundaryCount([1, -1, 1, -1])); // 2
console.log(returnToBoundaryCountSimulate([2, 3, -5])); // 1
console.log(returnToBoundaryCountPrefix([1, -1, 1, -1])); // 2
console.log(returnToBoundaryCount([-3, 3, -3, 3])); // 2
```

## 🔗 Related Problems

| Problem                                                                      | Relationship                          |
| ---------------------------------------------------------------------------- | ------------------------------------- |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) | Count prefix sums equal to target     |
| [Random Walk Return Probability](https://en.wikipedia.org/wiki/Random_walk)  | Conceptual connection to random walks |
| [Car Pooling](https://leetcode.com/problems/car-pooling)                     | Running sum simulation on timeline    |
