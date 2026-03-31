---
layout: page
title: "Split Array Largest Sum"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Binary Search, Dynamic Programming, Greedy, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/split-array-largest-sum"
---

# Split Array Largest Sum / Chia Mảng Tổng Lớn Nhất

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search on Answer / DP
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Minimize Maximum of Array](https://leetcode.com/problems/minimize-maximum-of-array) | [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn cần chia một hàng sách dày mỏng khác nhau lên `k` kệ sao cho kệ nặng nhất là nhẹ nhất có thể. Thay vì thử mọi cách chia, bạn "đoán" tổng tối đa cho phép rồi kiểm tra: với giới hạn đó, có thể chia được vào k kệ không? Đây là binary search trên câu trả lời.

**Pattern Recognition:**

- Signal: "split into k subarrays" + "minimize the maximum subarray sum" → **Binary Search on Answer**
- Left boundary: max(nums), Right boundary: sum(nums)
- Key insight: nếu giới hạn `mid` cho phép chia, thử giảm → ngược lại tăng

**Visual — nums = [7,2,5,10,8], k = 2:**

```
Binary Search range: [10, 32]
mid = 21 → greedy check: [7,2,5] | [10,8] → 2 parts ≤ k=2 ✅ → r = 21
mid = 15 → greedy check: [7,2,5] | [10] | [8] → 3 parts > k=2 ❌ → l = 16
mid = 18 → greedy check: [7,2,5] | [10,8] → 2 parts ≤ k=2 ✅ → r = 18
mid = 17 → greedy check: [7,2,5] | [10] | [8] → 3 parts > k=2 ❌ → l = 18
Answer: 18
```

---

## Problem Description

Given an integer array `nums` and an integer `k`, split `nums` into `k` non-empty subarrays such that the largest sum of any subarray is minimized. Return the minimized largest sum. ([LeetCode 410](https://leetcode.com/problems/split-array-largest-sum))

Difficulty: Hard | Acceptance: 58.1%

- **Example 1**: nums = [7,2,5,10,8], k = 2 → **18** (split [7,2,5,10] | [8] or [7,2,5] | [10,8])
- **Example 2**: nums = [1,2,3,4,5], k = 2 → **9** (split [1,2,3,4] | [5])

Constraints:

- `1 <= nums.length <= 1000`
- `0 <= nums[i] <= 10^6`
- `1 <= k <= min(50, nums.length)`

---

## 📝 Interview Tips

1. **Clarify**: "k có thể bằng n không? nums có phần tử âm không?" / Can k equal n? Are negatives possible?
2. **Brute force**: "DP O(n²k) — dp[i][j] = min largest sum cho i parts trong j elements" / DP with prefix sums
3. **Key insight**: "Binary search on answer — guess the max, verify with greedy" / Feasibility check is O(n)
4. **Greedy check**: "Dùng greedy: tạo subarray mới khi tổng vượt limit" / Greedily extend subarrays
5. **Bounds**: "lo = max(nums) đảm bảo mỗi phần tử fit; hi = sum(nums) = 1 subarray" / Tight binary search bounds
6. **Edge cases**: "k = 1 → return sum; k = n → return max element" / Boundary cases

---

## Solutions

```typescript
/**
 * Solution 1: DP with Prefix Sums
 * Time: O(n² × k) — fill dp table
 * Space: O(n × k) — dp table
 */
function splitArrayDP(nums: number[], k: number): number {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  // dp[i][j] = min possible largest sum splitting nums[0..j-1] into i parts
  const dp: number[][] = Array.from({ length: k + 1 }, () => new Array(n + 1).fill(Infinity));
  dp[0][0] = 0;

  for (let parts = 1; parts <= k; parts++) {
    for (let j = parts; j <= n; j++) {
      for (let m = parts - 1; m < j; m++) {
        const lastSum = prefix[j] - prefix[m];
        dp[parts][j] = Math.min(dp[parts][j], Math.max(dp[parts - 1][m], lastSum));
      }
    }
  }
  return dp[k][n];
}

/**
 * Solution 2: Binary Search on Answer (Optimal)
 * Time: O(n × log(sum)) — binary search × greedy check
 * Space: O(1) — constant extra space
 */
function splitArray(nums: number[], k: number): number {
  // canSplit: check if we can split into ≤ k parts with max sum ≤ limit
  function canSplit(limit: number): boolean {
    let parts = 1;
    let current = 0;
    for (const num of nums) {
      if (current + num > limit) {
        parts++;
        current = num;
        if (parts > k) return false;
      } else {
        current += num;
      }
    }
    return true;
  }

  let lo = Math.max(...nums); // every element must fit in one part
  let hi = nums.reduce((a, b) => a + b, 0); // all in one part

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (canSplit(mid)) {
      hi = mid; // try smaller limit
    } else {
      lo = mid + 1; // need larger limit
    }
  }
  return lo;
}

// === Test Cases ===
console.log(splitArray([7, 2, 5, 10, 8], 2)); // 18
console.log(splitArray([1, 2, 3, 4, 5], 2)); // 9
console.log(splitArray([1, 4, 4], 3)); // 4
console.log(splitArray([2, 3, 1, 2, 4, 3], 5)); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Difficulty | Pattern                 |
| ------------------------------------------------------------------------------------------------------------------ | ---------- | ----------------------- |
| [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days)   | 🟡 Medium  | Binary Search on Answer |
| [Minimize Maximum of Array](https://leetcode.com/problems/minimize-maximum-of-array)                               | 🟡 Medium  | Binary Search           |
| [Minimum Cost to Hire K Workers](https://leetcode.com/problems/minimum-cost-to-hire-k-workers)                     | 🔴 Hard    | Greedy                  |
| [House Robber IV](https://leetcode.com/problems/house-robber-iv)                                                   | 🟡 Medium  | Binary Search + DP      |
| [Painter's Partition Problem](https://leetcode.com/problems/find-the-largest-area-of-square-inside-two-rectangles) | 🔴 Hard    | Binary Search on Answer |
