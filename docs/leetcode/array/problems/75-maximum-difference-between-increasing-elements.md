---
layout: page
title: "Maximum Difference Between Increasing Elements"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/maximum-difference-between-increasing-elements"
---

# Maximum Difference Between Increasing Elements / Hiệu Số Lớn Nhất Giữa Hai Phần Tử Tăng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Prefix Minimum (Stock Profit variant)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bài toán mua bán cổ phiếu — tìm ngày mua (giá thấp) trước ngày bán (giá cao) để lãi nhiều nhất. Nhưng điều kiện là phải mua trước bán (i < j) VÀ giá mua phải thực sự thấp hơn giá bán (nums[i] < nums[j]).

**Pattern Recognition:**

- Signal: "i < j", "nums[j] - nums[i]", "nums[i] < nums[j]" → **Track running minimum**
- Duyệt từ trái sang phải, track `minSeen`. Với mỗi nums[j], diff = nums[j] - minSeen
- Key insight: nếu nums[j] <= minSeen, cập nhật minSeen; nếu không, tính diff

**Visual — nums=[7,1,5,4]:**

```
j=0: val=7, minSeen=7 (init), diff=-1 (7-7=0 but need strictly less)
j=1: val=1, 1<7 → update minSeen=1, diff=-1
j=2: val=5, 5>1 → diff=5-1=4, best=4, minSeen=1
j=3: val=4, 4>1 → diff=4-1=3, best=4, minSeen=1
Answer = 4 ✅ (indices 1→2)
```

---

## Problem Description

Given a **0-indexed** integer array `nums` of size `n`, find the **maximum difference** `nums[j] - nums[i]` where `0 <= i < j < n` and `nums[i] < nums[j]`. Return `-1` if no such pair exists.

- Example 1: `nums=[7,1,5,4]` → `4` (nums[2]-nums[1] = 5-1)
- Example 2: `nums=[9,4,3,2]` → `-1` (strictly decreasing, no valid pair)
- Example 3: `nums=[1,5,2,10]` → `9` (nums[3]-nums[0] = 10-1)

Constraints: `n == nums.length`, `2 <= n <= 1000`, `1 <= nums[i] <= 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Cần i < j nghiêm ngặt, nums[i] < nums[j] nghiêm ngặt" / Strict ordering on both index and value
2. **Brute force**: "Duyệt mọi cặp (i,j), check i<j and nums[i]<nums[j] — O(n²)" / All pairs O(n²)
3. **Optimize**: "Track minSeen khi duyệt j — O(n) một lần duyệt" / Track running min for O(n)
4. **Gotcha**: "Nếu nums[j] == minSeen → diff=0, không hợp lệ vì cần strictly less" / Equal values give diff=0, not valid
5. **Return -1**: "Chỉ return -1 nếu không bao giờ tìm được nums[j] > minSeen" / Only if no increasing pair found
6. **Similar**: "Best Time to Buy and Sell Stock là bài tương tự nhưng không cần strictly less" / Stock problem allows equal prices

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — all pairs
 * Time: O(n²) — check every (i,j) pair
 * Space: O(1)
 */
function maximumDifferenceBrute(nums: number[]): number {
  let best = -1;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] > nums[i]) {
        best = Math.max(best, nums[j] - nums[i]);
      }
    }
  }
  return best;
}

/**
 * Solution 2: Track prefix minimum — O(n)
 * Time: O(n) — single pass
 * Space: O(1) — only minSeen variable
 *
 * For each j, best diff ending at j = nums[j] - min(nums[0..j-1])
 * Only update if nums[j] > minSeen (i.e., valid pair exists)
 */
function maximumDifference(nums: number[]): number {
  let minSeen = nums[0];
  let best = -1;

  for (let j = 1; j < nums.length; j++) {
    if (nums[j] > minSeen) {
      best = Math.max(best, nums[j] - minSeen);
    } else {
      minSeen = Math.min(minSeen, nums[j]);
    }
  }
  return best;
}

// === Test Cases ===
console.log(maximumDifference([7, 1, 5, 4])); // 4
console.log(maximumDifference([9, 4, 3, 2])); // -1
console.log(maximumDifference([1, 5, 2, 10])); // 9
console.log(maximumDifference([3, 3])); // -1 (equal, not strictly less)
```

---

## 🔗 Related Problems

- [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock) — same pattern, allows equal values
- [Maximum Subarray](https://leetcode.com/problems/maximum-subarray) — Kadane's for max subarray sum
- [Minimum Value to Get Positive Step by Step Sum](https://leetcode.com/problems/minimum-value-to-get-positive-step-by-step-sum) — prefix min tracking
- [Running Sum of 1d Array](https://leetcode.com/problems/running-sum-of-1d-array) — prefix accumulation pattern
