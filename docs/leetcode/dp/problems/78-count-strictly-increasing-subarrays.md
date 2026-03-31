---
layout: page
title: "Count Strictly Increasing Subarrays"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/count-strictly-increasing-subarrays"
---

# Count Strictly Increasing Subarrays / Đếm Mảng Con Tăng Nghiêm Ngặt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Predict the Winner](https://leetcode.com/problems/predict-the-winner) | [The Number of Good Subsets](https://leetcode.com/problems/the-number-of-good-subsets)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đếm "chuỗi thắng" liên tiếp trong bóng đá — nếu mỗi kết quả tiếp theo tốt hơn kết quả trước, chuỗi thắng tiếp tục dài thêm. Mỗi vị trí i trong chuỗi dài `run` đóng góp đúng `run` mảng con hợp lệ kết thúc tại i.

**Pattern Recognition:**

- Signal: "count subarrays satisfying a monotone property" → **DP với biến đếm run**
- `run[i]` = độ dài chuỗi tăng nghiêm ngặt dài nhất kết thúc tại i
- Mỗi vị trí i đóng góp `run[i]` mảng con (độ dài 1, 2, ..., run[i])

**Visual — nums = [1, 3, 5, 4, 4, 6]:**

```
i:    0   1   2   3   4   5
val:  1   3   5   4   4   6
run:  1   2   3   1   1   2

Subarrays ending at i=2: [5], [3,5], [1,3,5] → 3 = run[2]
Subarrays ending at i=5: [6], [4,6]           → 2 = run[5]
Answer = 1+2+3+1+1+2 = 10
```

---

## Problem Description

Given a 0-indexed integer array `nums`, return the number of **subarrays** of `nums` that are strictly increasing. A subarray is a contiguous part of an array. ([LeetCode 2393](https://leetcode.com/problems/count-strictly-increasing-subarrays))

**Example 1:** `[1, 3, 5, 4, 4, 6]` → `10`

**Example 2:** `[1, 2, 3, 4, 5]` → `15`

Constraints: `1 <= nums.length <= 10^5`, `1 <= nums[i] <= 10^6`

---

## 📝 Interview Tips

1. **Clarify**: "Mảng con phải liên tiếp; độ dài 1 luôn hợp lệ" / Contiguous subarrays; singletons always count
2. **Key insight**: "Số mảng con tăng kết thúc tại i = run[i]; tổng là đáp án" / Count subarrays ending at each i = run length at i
3. **Mathematical proof**: "Nếu run[i] = k thì có k subarrays kết thúc tại i: [i], [i-1..i], ..., [i-k+1..i]" / Run of length k contributes k subarrays
4. **Space optimization**: "Chỉ cần biến `run` trước — không cần mảng dp đầy đủ" / Can use a single variable for run length
5. **Brute force**: "O(n²) brute force đơn giản: với mỗi l, mở rộng r đến khi không tăng nữa" / O(n²) two-pointer also works
6. **Edge cases**: "Mảng một phần tử → 1; tất cả bằng nhau → n (chỉ singletons)" / Single element or all equal → n

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — enumerate all starting points
 * Time: O(n^2) — nested loops
 * Space: O(1)
 */
function countSubarraysBrute(nums: number[]): number {
  const n = nums.length;
  let ans = 0;
  for (let l = 0; l < n; l++) {
    ans++; // singleton [l] always valid
    for (let r = l + 1; r < n; r++) {
      if (nums[r] > nums[r - 1]) ans++;
      else break; // no longer strictly increasing
    }
  }
  return ans;
}

/**
 * Solution 2: DP — run-length tracking (space-optimized)
 * Time: O(n) — single pass
 * Space: O(1) — only track current run length
 */
function countSubarrays(nums: number[]): number {
  let ans = 0;
  let run = 1; // length of current strictly increasing run ending here

  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] > nums[i - 1]) {
      run++; // extend the current run
    } else {
      run = 1; // reset: new run of length 1
    }
    ans += run; // run subarrays of lengths 1..run all end here
  }

  return ans;
}

/**
 * Solution 3: Mathematical — sum of triangular numbers per run
 * Time: O(n) — one pass, compute run lengths then triangle sums
 * Space: O(1)
 */
function countSubarraysMath(nums: number[]): number {
  let ans = 0;
  let i = 0;
  while (i < nums.length) {
    let len = 1;
    while (i + len < nums.length && nums[i + len] > nums[i + len - 1]) len++;
    ans += (len * (len + 1)) / 2; // triangle number: 1+2+...+len
    i += len;
  }
  return ans;
}

// === Test Cases ===
console.log(countSubarrays([1, 3, 5, 4, 4, 6])); // 10
console.log(countSubarrays([1, 2, 3, 4, 5])); // 15
console.log(countSubarrays([5])); // 1
console.log(countSubarrays([3, 3, 3])); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Difficulty | Pattern        |
| ------------------------------------------------------------------------------------------------------------------ | ---------- | -------------- |
| [Arithmetic Slices](https://leetcode.com/problems/arithmetic-slices)                                               | 🟡 Medium  | DP run-length  |
| [Longest Increasing Subarray](https://leetcode.com/problems/longest-continuous-increasing-subsequence)             | 🟢 Easy    | Sliding Window |
| [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i)           | 🔴 Hard    | Prefix Sum     |
| [Find the Count of Monotonic Pairs II](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii)         | 🔴 Hard    | Prefix Sum     |
| [Number of Subarrays with Bounded Maximum](https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum) | 🟡 Medium  | Two Pointer    |
