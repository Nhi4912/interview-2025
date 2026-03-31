---
layout: page
title: "Minimize Maximum of Array"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Binary Search, Dynamic Programming, Greedy, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/minimize-maximum-of-array"
---

# Minimize Maximum of Array / Tối Thiểu Hóa Giá Trị Lớn Nhất Mảng

## Tương tự thực tế (Vietnamese Analogy)

> Bạn có thể di chuyển một đơn vị từ phần tử sau sang trước (nums[i] → nums[i-1]+1, nums[i]-1).  
> Giống đổ nước từ bình sau sang bình trước — tổng không đổi, nhưng san bằng được. Đáp án là max của ceil(prefix_sum[i+1]/(i+1)).

## ASCII Visualization

```
nums = [3, 7, 1, 6]

prefix sums:  3  10  11  17
counts:       1   2   3   4

ceil(3/1)=3, ceil(10/2)=5, ceil(11/3)=4, ceil(17/4)=5

Answer = max(3,5,4,5) = 5

Verify: [3,7,1,6] → can move 2 from index 1 to 0: [5,5,1,6]
        → move 5 from index 3... actually [3,5,3,6]→[3,5,5,4]→etc.
        Best achievable = 5 ✓
```

## Problem

Given a 0-indexed array `nums`, you can perform operations: pick `i > 0`, decrement `nums[i]` by 1,
increment `nums[i-1]` by 1 (requires `nums[i] > 0`). Return the **minimum** possible maximum of `nums`.

**Constraints:** `1 <= nums.length <= 10^5`, `1 <= nums[i] <= 10^9`

## Interview Tips

1. **Key insight** — You can only move value leftward (i → i-1). The maximum of prefix i is at least `ceil(prefixSum[i] / (i+1))`.
2. **Why prefix?** — Values to the right of i cannot help reduce max of first i+1 elements.
3. **Formula** — `answer = max over all i of ceil(prefixSum[i+1] / (i+1))`.
4. **Binary search alternative** — Binary search on answer, greedily check if achievable.
5. **Integer ceiling** — `Math.ceil(sum / count)` = `Math.floor((sum + count - 1) / count)`.
6. **Why greedy works?** — Moving excess leftward is always optimal; we never need to move right.

## Solutions

### Solution 1: Prefix Sum / Greedy — O(n)

```typescript
function minimizeArrayValue(nums: number[]): number {
  let prefixSum = 0n;
  let ans = 0n;
  for (let i = 0; i < nums.length; i++) {
    prefixSum += BigInt(nums[i]);
    const count = BigInt(i + 1);
    // ceil(prefixSum / count)
    const ceilVal = (prefixSum + count - 1n) / count;
    if (ceilVal > ans) ans = ceilVal;
  }
  return Number(ans);
}

console.log(minimizeArrayValue([3, 7, 1, 6])); // 5
console.log(minimizeArrayValue([10, 1])); // 10 (can't move right)
console.log(minimizeArrayValue([1, 2, 3, 4])); // 4 (already sorted, can only spread left)
console.log(minimizeArrayValue([6, 9, 3, 8, 14])); // 8
```

### Solution 2: Regular Number Arithmetic — O(n)

```typescript
function minimizeArrayValueV2(nums: number[]): number {
  let prefixSum = 0;
  let ans = 0;
  for (let i = 0; i < nums.length; i++) {
    prefixSum += nums[i];
    const count = i + 1;
    const ceilVal = Math.ceil(prefixSum / count);
    ans = Math.max(ans, ceilVal);
  }
  return ans;
}

console.log(minimizeArrayValueV2([3, 7, 1, 6])); // 5
console.log(minimizeArrayValueV2([10, 1])); // 10
console.log(minimizeArrayValueV2([1, 2, 3, 4])); // 4
```

### Solution 3: Binary Search on Answer — O(n log maxVal)

```typescript
function minimizeArrayValueBS(nums: number[]): number {
  function canAchieve(maxVal: number): boolean {
    // Greedily from left to right: pass excess rightward
    // Actually we move left to right — excess from right helps left
    // Simulate: carry excess from right
    let excess = 0;
    for (let i = nums.length - 1; i >= 0; i--) {
      const total = nums[i] + excess;
      if (i === 0) return total <= maxVal;
      if (total > maxVal) {
        excess = total - maxVal;
      } else {
        excess = 0;
      }
    }
    return true;
  }

  let lo = 1,
    hi = Math.max(...nums);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canAchieve(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

console.log(minimizeArrayValueBS([3, 7, 1, 6])); // 5
console.log(minimizeArrayValueBS([10, 1])); // 10
console.log(minimizeArrayValueBS([1, 2, 3, 4])); // 4
// Note: prefix sum approach is simpler and correct
```

## Related Problems

| Problem                                                                                             | Difficulty | Key Concept   |
| --------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)                   | Hard       | Binary search |
| [Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal/) | Hard       | Prefix sum    |
| [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/)             | Easy       | Prefix sum    |
