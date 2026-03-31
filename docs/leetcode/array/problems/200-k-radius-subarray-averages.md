---
layout: page
title: "K Radius Subarray Averages"
difficulty: Medium
category: Array
tags: [Array, Sliding Window]
leetcode_url: "https://leetcode.com/problems/k-radius-subarray-averages"
---

# K Radius Subarray Averages / Trung Bình Mảng Con Bán Kính K

🟡 Medium | Array · Sliding Window | LeetCode #2090

## 🧠 Intuition / Tư Duy

**Vietnamese:** Như cửa sổ trượt có độ rộng cố định 2k+1. Mỗi lần dịch sang phải, ta chỉ cộng thêm phần tử mới và trừ phần tử cũ — không cần tính lại tổng từ đầu. Dùng prefix sum để tính nhanh tổng bất kỳ đoạn nào.

```
nums = [7,4,3,9,1,8,5,2,6], k=3
Window size = 2k+1 = 7

Index:  0  1  2  3  4  5  6  7  8
        7  4  3  9  1  8  5  2  6

i<3: not enough left  → -1
i=3: sum(0..6)=37/7=5 → 5
i=4: sum(1..7)=32/7=4 → 4
i=5: sum(2..8)=34/7=4 → 4
i>5: not enough right → -1

Result: [-1,-1,-1,5,4,4,-1,-1,-1]
```

## Problem Description

Given a 0-indexed array `nums` and integer `k`, return an array `avgs` of the same length where `avgs[i]` is the **average** of the subarray `nums[i-k..i+k]` (floor division). If there aren't `2k+1` elements (i.e., `i-k < 0` or `i+k >= n`), set `avgs[i] = -1`.

**Example 1:**

```
nums=[7,4,3,9,1,8,5,2,6], k=3
Output: [-1,-1,-1,5,4,4,-1,-1,-1]
```

**Example 2:**

```
nums=[100000], k=0
Output: [100000]
```

## 📝 Interview Tips

- **🔍 Fixed window / Cửa sổ cố định:** Window size is always `2k+1` — use sliding window, not variable window
- **📊 Prefix sum / Tổng tiền tố:** Build prefix sum array once; range sum `[i-k, i+k] = prefix[i+k+1] - prefix[i-k]` in O(1)
- **⚠️ Integer overflow / Tràn số:** Values up to 10^5, array up to 10^5 → max sum ~10^10, use `BigInt` or ensure JS handles safely (Number is safe up to 2^53)
- **🎯 Boundary check / Kiểm tra biên:** Only compute when `i >= k && i + k < n`; otherwise fill -1
- **🔄 Sliding window alternative / Cách trượt cửa sổ:** Maintain running sum: add `nums[i+k]`, remove `nums[i-k-1]` as window slides
- **📈 Complexity / Độ phức tạp:** O(n) time, O(n) space — prefix sum is cleaner; sliding sum saves a tiny constant

## Solutions

```typescript
/**
 * Approach 1: Prefix Sum — clean and easy to reason about
 * Time: O(n)
 * Space: O(n)
 */
function getAverages(nums: number[], k: number): number[] {
  const n = nums.length;
  const avgs = new Array(n).fill(-1);

  if (k === 0) return [...nums];

  // Build prefix sum
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  const windowSize = 2 * k + 1;
  for (let i = k; i + k < n; i++) {
    const sum = prefix[i + k + 1] - prefix[i - k];
    avgs[i] = Math.floor(sum / windowSize);
  }

  return avgs;
}

console.log(getAverages([7, 4, 3, 9, 1, 8, 5, 2, 6], 3)); // [-1,-1,-1,5,4,4,-1,-1,-1]
console.log(getAverages([100000], 0)); // [100000]
console.log(getAverages([8], 100000)); // [-1]
```

```typescript
/**
 * Approach 2: Sliding Window Sum — O(1) extra beyond output
 * Time: O(n)
 * Space: O(n) output only, O(1) extra
 */
function getAveragesSliding(nums: number[], k: number): number[] {
  const n = nums.length;
  const avgs = new Array(n).fill(-1);
  const windowSize = 2 * k + 1;

  if (windowSize > n) return avgs;

  // Initialize first window sum [0..2k]
  let windowSum = 0;
  for (let i = 0; i < windowSize; i++) windowSum += nums[i];

  avgs[k] = Math.floor(windowSum / windowSize);

  // Slide window
  for (let i = k + 1; i + k < n; i++) {
    windowSum += nums[i + k];
    windowSum -= nums[i - k - 1];
    avgs[i] = Math.floor(windowSum / windowSize);
  }

  return avgs;
}

console.log(getAveragesSliding([7, 4, 3, 9, 1, 8, 5, 2, 6], 3)); // [-1,-1,-1,5,4,4,-1,-1,-1]
console.log(getAveragesSliding([100000], 0)); // [100000]
```

## 🔗 Related Problems

| Problem                                                                                 | Difficulty | Pattern        |
| --------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/)   | 🟡 Medium  | Sliding Window |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)           | 🟡 Medium  | Prefix Sum     |
| [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) | 🟢 Easy    | Sliding Window |
| [Running Sum of 1d Array](https://leetcode.com/problems/running-sum-of-1d-array/)       | 🟢 Easy    | Prefix Sum     |
