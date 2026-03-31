---
layout: page
title: "Longest Subarray of 1's After Deleting One Element"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Sliding Window]
leetcode_url: "https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element"
---

# Longest Subarray of 1's After Deleting One Element / Subarray 1s Dài Nhất Sau Khi Xóa Một Phần Tử

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii) | [Longest Subarray With at Most K Zeros](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nhìn qua cửa sổ trượt — bạn được phép có tối đa **1 số 0** trong cửa sổ (là phần tử bị xóa). Mỗi khi cửa sổ có hơn 1 số 0, thu hẹp từ bên trái. Đáp án là kích thước cửa sổ lớn nhất **trừ 1** (vì phải xóa đúng 1 phần tử).

**Pattern Recognition:**

- Sliding window với constraint: `zeros ≤ 1`
- Tương đương với bài "Max Consecutive Ones III" với `k=1`
- Key insight: **bắt buộc xóa 1 phần tử** nên kết quả là `window_size - 1`

**Visual — Sliding Window:**

```
nums = [1,1,0,1]
        L       R

R=0: [1]        zeros=0, window=1
R=1: [1,1]      zeros=0, window=2
R=2: [1,1,0]    zeros=1, window=3
R=3: [1,1,0,1]  zeros=1, window=4 → ans = 4-1 = 3 ✓

nums = [0,1,1,1,0,1,1,0,1]
When zeros>1: move L until zeros<=1
Max window = 6 (indices 1..6) → ans = 5
```

---

## Problem Description

Given a binary array `nums`, delete **exactly one** element from it, then return the size of the longest non-empty subarray containing only 1s. If no such subarray exists, return 0. ([LeetCode #1493](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element))

**Example 1:** `nums = [1,1,0,1]` → `3` (delete the 0, get [1,1,1])
**Example 2:** `nums = [0,1,1,1,0,1,1,0,1]` → `5`

Constraints: `1 <= nums.length <= 10^5`, `nums[i]` is 0 or 1

---

## 📝 Interview Tips

1. **Clarify**: "Xóa đúng 1 phần tử, không phải tối đa 1 / Must delete EXACTLY one element, not at most one"
2. **Reframe**: "Cho phép tối đa 1 số 0 trong window → Max Consecutive Ones III với k=1 / Same as k=1 flip"
3. **Window size**: "Kết quả = max_window_size - 1 (trừ phần tử bị xóa) / Subtract 1 for the deletion"
4. **Edge cases**: "Toàn 1s → phải xóa 1 phần tử → ans = n-1 / All 1s means answer is n-1"
5. **DP alt**: "dp0[i] = ones ending at i with 0 deletions, dp1[i] = ones with 1 deletion / Two-state DP"
6. **Space**: "Sliding window O(1) extra space vs DP O(n) / Sliding window is optimal"

---

## Solutions

```typescript
/**
 * Solution 1: Sliding Window (Optimal)
 * Time: O(n) — single pass
 * Space: O(1) — two pointers + counter
 *
 * Allow at most 1 zero in the window. Answer = max_window - 1.
 */
function longestSubarray(nums: number[]): number {
  let left = 0;
  let zeros = 0;
  let ans = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;

    while (zeros > 1) {
      if (nums[left] === 0) zeros--;
      left++;
    }
    // Window size - 1 because we must delete exactly one element
    ans = Math.max(ans, right - left); // right - left + 1 - 1 = right - left
  }
  return ans;
}

/**
 * Solution 2: DP with Two States
 * Time: O(n)
 * Space: O(1) — rolling variables
 *
 * dp0 = length of current run of 1s ending here (no deletion used)
 * dp1 = length of current run ending here with exactly one deletion used
 */
function longestSubarrayDP(nums: number[]): number {
  let dp0 = 0; // consecutive 1s without any deletion
  let dp1 = 0; // consecutive 1s using exactly one deletion
  let ans = 0;

  for (const num of nums) {
    if (num === 1) {
      dp1 = dp1 + 1;
      dp0 = dp0 + 1;
    } else {
      // num === 0: the "deleted" element is this zero
      dp1 = dp0; // extend prev run of 1s by "deleting" this zero
      dp0 = 0; // reset no-deletion streak
    }
    ans = Math.max(ans, dp1);
  }
  // If we never used a deletion, we still must delete one element
  return ans === nums.length ? ans - 1 : ans;
}

// === Test Cases ===
console.log(longestSubarray([1, 1, 0, 1])); // 3
console.log(longestSubarray([0, 1, 1, 1, 0, 1, 1, 0, 1])); // 5
console.log(longestSubarray([1, 1, 1])); // 2 (must delete one)
console.log(longestSubarray([0, 0, 0])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                  | Pattern         | Difficulty |
| -------------------------------------------------------------------------------------------------------- | --------------- | ---------- |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii)                       | Sliding Window  | Medium     |
| [Arithmetic Slices](https://leetcode.com/problems/arithmetic-slices)                                     | Sliding Window  | Medium     |
| [Maximum Length of Repeated Subarray](https://leetcode.com/problems/maximum-length-of-repeated-subarray) | DP              | Medium     |
| [Max Consecutive Ones II](https://leetcode.com/problems/max-consecutive-ones-ii)                         | Sliding Window  | Medium     |
| [Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum)                 | Monotonic Queue | Hard       |
