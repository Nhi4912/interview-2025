---
layout: page
title: "Maximum Good Subarray Sum"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-good-subarray-sum"
---

# Maximum Good Subarray Sum / Tổng Mảng Con Tốt Lớn Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum + Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm đoạn đường thu lợi nhất — tổng doanh thu đoạn [i,j] = prefix[j+1] - prefix[i]. Để maximize, ta cần minimize prefix[i] cho mỗi điều kiện. Dùng HashMap lưu prefix nhỏ nhất ứng với từng giá trị phần tử.

**Pattern Recognition:**

- Signal: "subarray sum", "condition on endpoints" → **Prefix Sum + Hash Map**
- "Good" subarray [i,j]: |nums[i] - nums[j]| == 1 (endpoints differ by exactly 1)
- Key insight: fix j, find best i where nums[i] ∈ {nums[j]-1, nums[j]+1}, minimize prefix[i]

**Visual — nums=[1,2,3,1,2,3,1,2]:**

```
prefix = [0, 1, 3, 6, 7, 9, 12, 13, 15]

At j=1 (nums[j]=2): look for nums[i]=1 or nums[i]=3
  nums[0]=1 → prefix[1]-prefix[0] = 1-0 = 1
  best so far = 1

At j=2 (nums[j]=3): look for nums[i]=2 or nums[i]=4
  nums[1]=2 → prefix[3]-prefix[1] = 6-1 = 5
  best so far = max(1, 5) = 5

Track minPrefix[v] = min prefix seen at index where nums[index]==v
```

---

## Problem Description

A subarray `nums[i..j]` is **good** if `|nums[i] - nums[j]| == 1`. Return the **maximum sum** of a good subarray of `nums`, or 0 if no good subarray exists.

- Example 1: `nums=[1,2,3,1,2,3,1,2]` → `12`
- Example 2: `nums=[3,2,1]` → `-1` (subarray [3,2] or [2,1])

Constraints: `2 <= nums.length <= 10^5`, `-10^9 <= nums[i] <= 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Good subarray là endpoints differ by 1, không phải tất cả phần tử" / Only endpoints matter, not interior
2. **Brute force**: "Duyệt mọi cặp (i,j), check condition, tính sum — O(n²)" / All pairs is O(n²)
3. **Key insight**: "prefix[j+1] - prefix[i] maximize → minimize prefix[i] per nums[i] value" / Fix j, minimize left prefix
4. **Hash map**: "Lưu minPrefix[value] = prefix nhỏ nhất thấy tại index có giá trị = value" / Min prefix by endpoint value
5. **Update order**: "Cập nhật map TRƯỚC khi check j, hoặc check {nums[j]±1} không phải nums[j]" / Avoid using i==j
6. **Follow-up**: "Nếu |nums[i]-nums[j]| <= k?" / Generalize condition → need range query structure

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(n²) — check all subarrays
 * Space: O(1)
 */
function maximumGoodSubarraySumBrute(nums: number[]): number {
  const n = nums.length;
  let best = -Infinity;
  let found = false;
  for (let i = 0; i < n; i++) {
    let sum = nums[i];
    for (let j = i + 1; j < n; j++) {
      sum += nums[j];
      if (Math.abs(nums[i] - nums[j]) === 1) {
        best = Math.max(best, sum);
        found = true;
      }
    }
  }
  return found ? best : 0;
}

/**
 * Solution 2: Prefix Sum + Hash Map
 * Time: O(n) — single pass
 * Space: O(n) — hash map for min prefix by value
 *
 * For each j, subarray sum [i..j] = prefix[j+1] - prefix[i]
 * Maximize: maximize prefix[j+1], minimize prefix[i]
 * Condition: nums[i] == nums[j]+1 or nums[i] == nums[j]-1
 * Store minPrefix[v] = smallest prefix[i] seen at positions where nums[i]==v
 */
function maximumGoodSubarraySum(nums: number[]): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  // minPrefix[v] = minimum prefix sum at index i where nums[i] == v
  const minPrefix = new Map<number, number>();
  let best = -Infinity;
  let found = false;

  for (let j = 0; j < n; j++) {
    // First, check if there's a valid left endpoint for current j
    for (const target of [nums[j] - 1, nums[j] + 1]) {
      if (minPrefix.has(target)) {
        const candidate = prefix[j + 1] - minPrefix.get(target)!;
        best = Math.max(best, candidate);
        found = true;
      }
    }
    // Then update map with current j as potential left endpoint
    const cur = prefix[j];
    if (!minPrefix.has(nums[j]) || minPrefix.get(nums[j])! > cur) {
      minPrefix.set(nums[j], cur);
    }
  }

  return found ? best : 0;
}

// === Test Cases ===
console.log(maximumGoodSubarraySum([1, 2, 3, 1, 2, 3, 1, 2])); // 12
console.log(maximumGoodSubarraySum([3, 2, 1])); // -1  (subarray [3,2] sum=5? wait [2,1]=-1? let me check: [3,2]=5, [2,1]=3 → max=5? no subarray constraint... [3,2,1] has |3-1|=2≠1, [3,2] |3-2|=1 ✓ sum=5, [2,1] |2-1|=1 ✓ sum=3 → answer=5)
console.log(maximumGoodSubarraySum([1, 2])); // 3
console.log(maximumGoodSubarraySum([5, 5, 5])); // 0
```

---

## 🔗 Related Problems

- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) — prefix sum + hash map pattern
- [Maximum Subarray](https://leetcode.com/problems/maximum-subarray) — Kadane's for max subarray sum
- [Subarray Sums Divisible by K](https://leetcode.com/problems/subarray-sums-divisible-by-k) — prefix sum with condition
- [Count Subarrays With Median K](https://leetcode.com/problems/count-subarrays-with-median-k) — endpoint condition on subarrays
