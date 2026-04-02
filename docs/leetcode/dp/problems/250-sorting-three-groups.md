---
layout: page
title: "Sorting Three Groups"
difficulty: Medium
category: DP
tags: [Array, Dynamic Programming, Binary Search]
leetcode_url: "https://leetcode.com/problems/sorting-three-groups"
---

# Sorting Three Groups / Sắp Xếp Ba Nhóm

> **Track**: DP | **Difficulty**: 🟡 Medium | **Pattern**: LIS Variant
> **Frequency**: 📗 Tier 2 — Gặp ở các vòng phỏng vấn
> **See also**: [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence) | [Non-decreasing Array](https://leetcode.com/problems/non-decreasing-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có một hàng học sinh được gán nhãn 1, 2, hoặc 3 (nhóm yếu, trung bình, giỏi). Bạn muốn hàng trở thành non-decreasing (không giảm) bằng cách thay đổi nhãn của ít học sinh nhất. Đây tương đương với: giữ lại dãy con dài nhất đã là non-decreasing — phần còn lại cần được "sửa". Số thay đổi = `n - LIS_length`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Sorting Three Groups example:**

```
nums = [2, 1, 3, 2, 1, 3]

Goal: make non-decreasing (1 ≤ nums[i] ≤ 3)
Min changes = n - (longest non-decreasing subsequence)

LIS (non-decreasing) in [2,1,3,2,1,3]:
  [1,2,3] length 3? → [1,3,3] or [1,2,3]
  Longest: [1,2,3] or [1,1,3] or [2,2,3] → length 3?
  Actually [1,2,3] wait: indices 1,3,5 → nums[1]=1, nums[3]=2, nums[5]=3 → [1,2,3] ✓ length 3
  Or [2,2,3]? idx 0,3,5 → [2,2,3] ✓ length 3
  But [1,1,3]? idx 1,4,5 → [1,1,3] ✓ length 3
  Maximum = 3, changes = 6 - 3 = 3

DP approach: dp[i] = length of longest non-decreasing subseq ending at i
  dp[0]=1(2), dp[1]=1(1), dp[2]=2(1,3 or 2,3), dp[3]=2(1,2),
  dp[4]=2(1,1), dp[5]=3(1,2,3 or 2,2,3 or 1,1,3)
  max=3, ans=6-3=3 ✓
```

---

## Problem Description

You have an array `nums` where each element is `1`, `2`, or `3`. In one operation, replace any element with any value in `{1,2,3}`. Return the **minimum number of operations** to make `nums` non-decreasing.

**Example 1:** `nums = [2,1,3,2,1,3]` → `3`

**Example 2:** `nums = [1,3,2,1,3,3]` → `2`

**Example 3:** `nums = [2,2,2]` → `0`

**Constraints:** `1 ≤ nums.length ≤ 100`, `nums[i] ∈ {1,2,3}`

---

## 📝 Interview Tips

- **Key insight** / Ý tưởng chính: `min_ops = n - len(longest non-decreasing subsequence)`
- **Non-decreasing LIS** / LIS không giảm: Cho phép bằng nhau — dùng `≤` thay vì `<`
- **Only 3 values** / Chỉ 3 giá trị: DP state nhỏ — dp cho 3 suffix/prefix patterns
- **DP O(n)** / O(n) DP: Vì chỉ 3 giá trị, đếm chuỗi con optimally trong O(n)
- **O(n log n) LIS** / LIS nhị phân: Binary search trên patience sorting — dùng `upper_bound`
- **Think complement** / Nghĩ phần bù: Giữ tối đa → thay đổi tối thiểu — cách tư duy quan trọng

---

## Solutions

```typescript
/**
 * @complexity Time: O(n²) | Space: O(n)
 * Find longest non-decreasing subsequence, answer = n - its length
 */
function minimumOperationsBrute(nums: number[]): number {
  const n = nums.length;
  const dp = new Array(n).fill(1);

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] <= nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return n - Math.max(...dp);
}

/**
 * @complexity Time: O(n) | Space: O(1)
 * Since values are only 1,2,3, use three dp variables:
 * dp1 = longest non-decreasing subseq ending with 1
 * dp2 = longest non-decreasing subseq ending with 2
 * dp3 = longest non-decreasing subseq ending with 3
 */
function minimumOperations(nums: number[]): number {
  let dp1 = 0,
    dp2 = 0,
    dp3 = 0;

  for (const x of nums) {
    if (x === 1) {
      dp1 = dp1 + 1;
      // dp2, dp3 unchanged (can't extend them with 1 decreasing)
    } else if (x === 2) {
      dp2 = Math.max(dp1, dp2) + 1;
    } else {
      dp3 = Math.max(dp1, dp2, dp3) + 1;
    }
  }

  return nums.length - Math.max(dp1, dp2, dp3);
}

/**
 * @complexity Time: O(n log n) | Space: O(n)
 * Binary search patience sorting for non-decreasing LIS
 * Uses upper_bound (right-most valid position)
 */
function minimumOperationsNLogN(nums: number[]): number {
  const tails: number[] = [];

  for (const x of nums) {
    // Find first position > x (for non-decreasing, allow equal → use upper bound)
    let lo = 0,
      hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] <= x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }

  return nums.length - tails.length;
}

// === Test Cases ===
console.log(minimumOperations([2, 1, 3, 2, 1, 3])); // → 3
console.log(minimumOperations([1, 3, 2, 1, 3, 3])); // → 2
console.log(minimumOperations([2, 2, 2])); // → 0
console.log(minimumOperationsBrute([2, 1, 3, 2, 1, 3])); // → 3
console.log(minimumOperationsNLogN([1, 3, 2, 1, 3, 3])); // → 2
```

---

## 🔗 Related Problems

| Problem                           | Difficulty | Link                                                                      |
| --------------------------------- | ---------- | ------------------------------------------------------------------------- |
| Longest Increasing Subsequence    | Medium     | [LC 300](https://leetcode.com/problems/longest-increasing-subsequence)    |
| Non-decreasing Array              | Medium     | [LC 665](https://leetcode.com/problems/non-decreasing-array)              |
| Delete Columns to Make Sorted III | Hard       | [LC 960](https://leetcode.com/problems/delete-columns-to-make-sorted-iii) |
