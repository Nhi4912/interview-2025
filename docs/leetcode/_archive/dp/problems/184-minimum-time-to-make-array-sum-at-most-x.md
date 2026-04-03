---
layout: page
title: "Minimum Time to Make Array Sum At Most x"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-time-to-make-array-sum-at-most-x"
---

# Minimum Time to Make Array Sum At Most x / Thời Gian Tối Thiểu Để Tổng Mảng ≤ x

🔴 Hard | DP + Sorting | LeetCode 2809

## 🧠 Intuition / Tư Duy

**Tiếng Việt:** Hãy hình dung hai băng tải hàng. Mỗi giây, hàng trên băng 1 tăng thêm tốc độ từ băng 2. Bạn có thể dừng một băng (đặt nums1[i]=0). Chìa khoá: nếu thực hiện t thao tác, thao tác j-th (thứ tự theo nums2 tăng dần) trên phần tử i giảm tổng được `nums1[i] + j × nums2[i]`.

```
nums1 = [1,2,3]  nums2 = [1,2,3]  x = 4
Sort by nums2 ascending → same order [0,1,2]

dp[j] = max sum reducible using j ops from first i elements
i=0: dp[1] = 0 + 1 + 1*1 = 2
i=1: dp[2] = dp[1] + 2 + 2*2 = 8,  dp[1] = max(2, 0+2+1*2) = 4
i=2: dp[2] = max(8, 4+3+2*3) = 13, dp[1] = max(4, 0+3+1*3) = 6

t=1: sum1+1*sum2-dp[1] = 6+6-4 = 8 > 4
t=3: sum1+3*sum2-dp[3] = 6+18-dp[3] = ...  → answer = 5
```

## Problem Description

Given two 0-indexed integer arrays `nums1` and `nums2` of length `n`, and integer `x`. Each second `nums1[i]` increases by `nums2[i]`. You can perform one operation per second: pick any index `i` and set `nums1[i] = 0`. Return the minimum time in seconds to make `sum(nums1) ≤ x`, or `-1` if impossible.

**Example 1:**

- Input: `nums1 = [1,2,3]`, `nums2 = [1,2,3]`, `x = 4`
- Output: `5`

**Example 2:**

- Input: `nums1 = [1,2,3]`, `nums2 = [3,3,3]`, `x = 4`
- Output: `2`

## 📝 Interview Tips

- 🎯 **Key insight / Chìa khoá:** Zeroing at step j (1-indexed in sorted order) saves `nums1[i] + j × nums2[i]` — sort by nums2 ascending so smaller rates get smaller j
- 📊 **Sort trick / Mẹo sắp xếp:** Optimal strategy always assigns lower-j multipliers to slower-growing elements
- 🔢 **DP state / Trạng thái DP:** `dp[j]` = max reduction achievable using exactly j operations on first i elements (iterate i outer, j inner backwards)
- ⚡ **Complexity / Độ phức tạp:** O(n² ) for DP after O(n log n) sort
- 🚫 **Edge case / Trường hợp đặc biệt:** Initial `sum(nums1) ≤ x` → return 0; max possible t = n
- 💡 **Recurrence / Công thức:** `dp[j] = max(dp[j], dp[j-1] + nums1[i] + j × nums2[i])`

## Solutions

```typescript
/**
 * Approach 1: Greedy Sorting + 1D DP
 * Time: O(n² + n log n)
 * Space: O(n)
 *
 * Key: if we do t operations, the j-th zeroing (sorted by rate asc) on element i
 * saves nums1[i] + j*nums2[i]. Sort by nums2 so optimal j assignment is in-order.
 */
function minimumTime(nums1: number[], nums2: number[], x: number): number {
  const n = nums1.length;
  const sum1 = nums1.reduce((a, b) => a + b, 0);
  const sum2 = nums2.reduce((a, b) => a + b, 0);

  if (sum1 <= x) return 0;

  // Sort indices by nums2 ascending
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => nums2[a] - nums2[b]);

  // dp[j] = max reduction achievable with exactly j ops among first i elements
  const dp = new Array(n + 1).fill(0);

  for (let i = 0; i < n; i++) {
    const idx = order[i];
    const a = nums1[idx],
      b = nums2[idx];
    // Traverse backwards to avoid reusing same element
    for (let j = i + 1; j >= 1; j--) {
      dp[j] = Math.max(dp[j], dp[j - 1] + a + j * b);
    }
  }

  // After t seconds, actual sum = sum1 + t*sum2 - (what we zeroed)
  for (let t = 1; t <= n; t++) {
    if (sum1 + t * sum2 - dp[t] <= x) return t;
  }

  return -1;
}

console.log(minimumTime([1, 2, 3], [1, 2, 3], 4)); // 5
console.log(minimumTime([1, 2, 3], [3, 3, 3], 4)); // 2
console.log(minimumTime([4], [2], 1)); // -1
console.log(minimumTime([1], [1], 5)); // 0
```

```typescript
/**
 * Approach 2: Explicit pairs + same DP (cleaner style)
 * Time: O(n²)
 * Space: O(n)
 */
function minimumTime2(nums1: number[], nums2: number[], x: number): number {
  const n = nums1.length;
  const sum1 = nums1.reduce((s, v) => s + v, 0);
  const sum2 = nums2.reduce((s, v) => s + v, 0);

  if (sum1 <= x) return 0;

  const pairs = nums1.map((v, i) => [v, nums2[i]] as [number, number]).sort((a, b) => a[1] - b[1]);

  const dp = new Array(n + 1).fill(0);

  for (let i = 0; i < n; i++) {
    const [a, b] = pairs[i];
    for (let j = i + 1; j >= 1; j--) {
      dp[j] = Math.max(dp[j], dp[j - 1] + a + j * b);
    }
  }

  for (let t = 1; t <= n; t++) {
    if (sum1 + t * sum2 - dp[t] <= x) return t;
  }

  return -1;
}

console.log(minimumTime2([1, 2, 3], [1, 2, 3], 4)); // 5
console.log(minimumTime2([1, 2, 3], [3, 3, 3], 4)); // 2
```

## 🔗 Related Problems

| Problem                                                                                                     | Difficulty | Key Concept        |
| ----------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Minimum Difficulty of a Job Schedule](https://leetcode.com/problems/minimum-difficulty-of-a-job-schedule/) | 🔴 Hard    | DP + Partition     |
| [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/)         | 🔴 Hard    | DP + Sorting       |
| [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)                             | 🔴 Hard    | Sort + LIS         |
| [Delete and Earn](https://leetcode.com/problems/delete-and-earn/)                                           | 🟡 Medium  | DP on sorted array |
