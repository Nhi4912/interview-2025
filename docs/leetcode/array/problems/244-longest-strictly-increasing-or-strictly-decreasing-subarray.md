---
layout: page
title: "Longest Strictly Increasing or Strictly Decreasing Subarray"
difficulty: Easy
category: Array
tags: [Array]
leetcode_url: "https://leetcode.com/problems/longest-strictly-increasing-or-strictly-decreasing-subarray"
---

# Longest Strictly Increasing or Strictly Decreasing Subarray / Mảng Con Tăng/Giảm Nghiêm Ngặt Dài Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Array (Linear Scan)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest Turbulent Subarray](https://leetcode.com/problems/longest-turbulent-subarray) | [Increasing Triplet Subsequence](https://leetcode.com/problems/increasing-triplet-subsequence)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đếm bậc thang liên tiếp — một tay đếm bậc lên (tăng), tay kia đếm bậc xuống (giảm). Khi bậc phá vỡ xu hướng, reset về 1. Đáp án là bậc thang dài nhất của cả hai tay.

**Pattern Recognition:**

- Maintain two running counters: `incLen` (current strictly increasing run) and `decLen` (current strictly decreasing run)
- Reset to 1 when direction breaks; update global answer each step

**Visual — Two counters approach:**

```
nums = [1,4,3,3,2]

i=0: incLen=1, decLen=1, ans=1
i=1: 4>1 → incLen=2, decLen=1, ans=2
i=2: 3<4 → incLen=1, decLen=2, ans=2
i=3: 3==3 → incLen=1, decLen=1, ans=2  (equal: both reset!)
i=4: 2<3 → incLen=1, decLen=2, ans=2

Answer = 2 ✅

nums = [3,3,3,3]
All equal → both counters stay at 1 → ans=1

nums = [1,2,3,4,5]
Strictly increasing → incLen grows to 5 → ans=5
```

---

## Problem Description

Given an integer array `nums`, return the length of the **longest subarray** that is either **strictly increasing** or **strictly decreasing**. A single element is trivially both, so the minimum answer is 1. ([LeetCode 3105](https://leetcode.com/problems/longest-strictly-increasing-or-strictly-decreasing-subarray))

Difficulty: Easy | Acceptance: 65.0%

```
Example 1: nums=[1,4,3,3,2] → 2  (e.g., [1,4] or [4,3])
Example 2: nums=[3,3,3,3]   → 1  (all equal → no strict run)
Example 3: nums=[3,2,1]     → 3  (strictly decreasing)
```

Constraints:

- `1 <= nums.length <= 50`
- `1 <= nums[i] <= 50`

---

## 📝 Interview Tips

1. **Strict vs non-strict**: "Strict nghĩa là không cho phép bằng nhau" / Strictly means no equal consecutive elements — reset on equal!
2. **Two counters**: "Duy trì incLen và decLen song song, không cần làm riêng hai lần" / Track both in one pass — no need for two separate loops
3. **Reset rule**: "incLen reset khi nums[i] <= nums[i-1]" / Reset inc when current ≤ prev; reset dec when current ≥ prev
4. **Answer each step**: "Cập nhật ans sau mỗi bước" / Update global max after each comparison
5. **Brute force**: "O(n²) check mỗi subarray — OK với n≤50" / O(n²) works with n≤50 but O(n) is cleaner
6. **Follow-up**: "Nếu không strictly? Monotone subarray → vẫn tương tự nhưng dùng <= và >=" / Non-strict version: same logic with ≤/≥

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check every subarray
 * Time: O(n²) — all starting points × all ending points
 * Space: O(1)
 */
function longestMonotoneBrute(nums: number[]): number {
  const n = nums.length;
  let ans = 1;
  for (let i = 0; i < n; i++) {
    let incLen = 1;
    let decLen = 1;
    for (let j = i + 1; j < n; j++) {
      if (nums[j] > nums[j - 1]) incLen++;
      else {
        ans = Math.max(ans, incLen);
        break;
      }
    }
    for (let j = i + 1; j < n; j++) {
      if (nums[j] < nums[j - 1]) decLen++;
      else {
        ans = Math.max(ans, decLen);
        break;
      }
    }
    ans = Math.max(ans, incLen, decLen);
  }
  return ans;
}

/**
 * Solution 2: Two-counter linear scan (optimal)
 * Time: O(n) — single pass
 * Space: O(1) — two integer counters
 */
function longestStrictlyIncreasingOrStrictlyDecreasingSubarray(nums: number[]): number {
  let ans = 1;
  let incLen = 1; // length of current strictly increasing run
  let decLen = 1; // length of current strictly decreasing run

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      incLen++;
      decLen = 1; // can't be continuing a decrease
    } else if (nums[i] < nums[i - 1]) {
      decLen++;
      incLen = 1; // can't be continuing an increase
    } else {
      // equal: breaks both strict runs
      incLen = 1;
      decLen = 1;
    }
    ans = Math.max(ans, incLen, decLen);
  }

  return ans;
}

// === Test Cases ===
console.log(longestStrictlyIncreasingOrStrictlyDecreasingSubarray([1, 4, 3, 3, 2])); // 2
console.log(longestStrictlyIncreasingOrStrictlyDecreasingSubarray([3, 3, 3, 3])); // 1
console.log(longestStrictlyIncreasingOrStrictlyDecreasingSubarray([3, 2, 1])); // 3
console.log(longestStrictlyIncreasingOrStrictlyDecreasingSubarray([1, 2, 3, 4, 5])); // 5
console.log(longestStrictlyIncreasingOrStrictlyDecreasingSubarray([1])); // 1
```

---

## 🔗 Related Problems

- [Longest Turbulent Subarray](https://leetcode.com/problems/longest-turbulent-subarray) — same pattern: alternating direction runs
- [Increasing Triplet Subsequence](https://leetcode.com/problems/increasing-triplet-subsequence) — monotone subsequence with 3 elements
- [Longest Continuous Increasing Subsequence](https://leetcode.com/problems/longest-continuous-increasing-subsequence) — strictly increasing only
- [Longest Strictly Increasing or Decreasing Subarray — LeetCode](https://leetcode.com/problems/longest-strictly-increasing-or-strictly-decreasing-subarray) — problem page
