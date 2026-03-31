---
layout: page
title: "Sum of Subarray Ranges"
difficulty: Medium
category: Array
tags: [Array, Stack, Monotonic Stack]
leetcode_url: "https://leetcode.com/problems/sum-of-subarray-ranges"
---

# Sum of Subarray Ranges / Tổng Phạm Vi Các Mảng Con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Monotonic Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram) | [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Mỗi mảng con `[i..j]` có **phạm vi** = max − min. Thay vì tính từng cái, dùng decomposition: **Σranges = Σmax − Σmin**. Rồi dùng Monotonic Stack để tính đóng góp của từng phần tử khi nó là max/min cho các subarray.

```
nums = [1, 2, 3]
All subarrays: [1]=0, [2]=0, [3]=0, [1,2]=1, [2,3]=1, [1,2,3]=2 → sum=4
Sum of max = 1+2+3+2+3+3 = 14
Sum of min = 1+2+3+1+2+1 = 10
Answer: 14 - 10 = 4 ✅
```

---

## Problem Description / Mô Tả Bài Toán

Cho mảng số nguyên `nums`. **Phạm vi** của mảng con = max − min. Trả về **tổng phạm vi** của tất cả các mảng con.

- **Input:** `nums = [1,2,3]` → **Output:** `4`
- **Input:** `nums = [4,-2,-3,4,1]` → **Output:** `59`

**Constraints:** `1 <= nums.length <= 1000`, `-10^9 <= nums[i] <= 10^9`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** Key decomposition: sum_ranges = sum_max - sum_min over all subarrays. **VI:** Phân tách: tổng_phạm_vi = Σmax − Σmin trên mọi subarray.
2. **EN:** Brute force O(n²) is acceptable for n≤1000; always mention it first. **VI:** O(n²) chấp nhận với n≤1000; đề cập trước.
3. **EN:** Monotonic stack computes "sum of max" and "sum of min" each in O(n). **VI:** Stack đơn điệu tính Σmax và Σmin mỗi cái O(n).
4. **EN:** For each element as max: it contributes nums[i] × (left_span) × (right_span). **VI:** Mỗi phần tử là max: đóng góp = nums[i] × (khoảng trái) × (khoảng phải).
5. **EN:** Use sentinels (+/-Infinity) as boundary guards in the monotonic stack. **VI:** Dùng sentinel (±Infinity) để xử lý biên trong stack.
6. **EN:** Time O(n) with monotonic stack, O(n²) brute force. **VI:** O(n) với stack, O(n²) brute force.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Brute Force  O(n²) time, O(1) space ─────────────────────────
function subArrayRanges(nums: number[]): number {
  const n = nums.length;
  let total = 0;

  for (let i = 0; i < n; i++) {
    let mn = nums[i],
      mx = nums[i];
    for (let j = i + 1; j < n; j++) {
      mn = Math.min(mn, nums[j]);
      mx = Math.max(mx, nums[j]);
      total += mx - mn;
    }
  }

  return total;
}

// ─── Solution 2: Monotonic Stack  O(n) time, O(n) space ──────────────────────
// sum_ranges = sum_of_max_contributions - sum_of_min_contributions
function subArrayRangesOptimal(nums: number[]): number {
  const n = nums.length;

  // Compute sum contribution of each element when it acts as min or max
  function sumContribution(findMin: boolean): number {
    // Extend with sentinels at both ends to handle boundaries automatically
    const INF = findMin ? -Infinity : Infinity;
    const ext = [INF, ...nums, INF]; // index 0 and n+1 are sentinels
    const stack: number[] = [];
    let total = 0;

    for (let i = 0; i <= n + 1; i++) {
      // Pop while current element satisfies monotonic property
      while (
        stack.length > 0 &&
        (findMin ? ext[i] < ext[stack[stack.length - 1]] : ext[i] > ext[stack[stack.length - 1]])
      ) {
        const mid = stack.pop()!;
        const left = stack[stack.length - 1]; // previous element in stack
        const right = i;
        // ext[mid] is min/max for subarrays [left+1..mid] to [mid..right-1]
        total += ext[mid] * (mid - left) * (right - mid);
      }
      stack.push(i);
    }

    return total;
  }

  return sumContribution(false) - sumContribution(true);
}

// ─── Tests ───────────────────────────────────────────────────────────────────
console.log(subArrayRanges([1, 2, 3])); // 4
console.log(subArrayRanges([1, 3, 3])); // 4
console.log(subArrayRanges([4, -2, -3, 4, 1])); // 59
console.log(subArrayRangesOptimal([1, 2, 3])); // 4
console.log(subArrayRangesOptimal([4, -2, -3, 4, 1])); // 59
```
