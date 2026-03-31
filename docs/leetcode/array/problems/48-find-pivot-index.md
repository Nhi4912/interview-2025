---
layout: page
title: "Find Pivot Index"
difficulty: Easy
category: Array
tags: [Array, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/find-pivot-index"
---

# Find Pivot Index / Tìm Chỉ Số Trục

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k) | [Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang cân bằng một chiếc bập bênh — đặt ngón tay tại vị trí nào để hai bên nặng bằng nhau? Bạn đi từ trái sang phải, tại mỗi điểm biết tổng bên trái (đã tích lũy) và tính ngay tổng bên phải bằng: `totalSum - leftSum - nums[i]`. Đây là prefix sum thực tế!

**Pattern Recognition:**

- Signal: "sum of elements to left equals sum to right" → **Prefix Sum**
- Key formula: `rightSum = totalSum - leftSum - nums[i]`
- One pass — no extra array needed, just accumulate `leftSum`

**Visual — `nums = [1, 7, 3, 6, 5, 6]`:**

```
totalSum = 28
i=0: left=0,  right=28-0-1=27   → 0≠27
i=1: left=1,  right=28-1-7=20   → 1≠20
i=2: left=8,  right=28-8-3=17   → 8≠17
i=3: left=11, right=28-11-6=11  → 11=11 ✅  return 3

leftSum accumulates: 0→1→8→11→...
```

---

## Problem Description

Given an array `nums`, return the **leftmost pivot index** — the index where the sum of all elements to the left equals the sum of all elements to the right. Return `-1` if no such index exists. Elements at the pivot index are excluded from both sums.

**Example 1:** `nums = [1,7,3,6,5,6]` → `3` (left sum = 1+7+3 = 11, right sum = 5+6 = 11)

**Example 2:** `nums = [1,2,3]` → `-1` (no valid pivot)

Constraints:

- `1 <= nums.length <= 10^4`
- `-1000 <= nums[i] <= 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Pivot không tính vào cả hai bên — xác nhận lại" / Pivot element excluded from both left and right sums
2. **Brute force**: "Tính lại tổng hai bên mỗi index — O(n²)" / Recompute sums at every index; optimize to O(n) with prefix
3. **Optimize**: "Chỉ cần tổng toàn bộ + leftSum tích lũy — O(n) 1 pass" / Total sum + running left sum avoids the prefix array
4. **Edge cases**: "Index 0 → leftSum=0; index n-1 → rightSum=0" / Boundary indices: left or right side can be empty (sum=0)
5. **Follow-up**: "Nếu cần tất cả pivot indices?" / Return all pivot indices instead of just the first
6. **Complexity**: "O(n) time, O(1) extra space — không cần mảng prefix" / Constant space; no prefix array needed

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — recompute sums at each index
 * Time: O(n²) — nested iteration to sum left and right sides
 * Space: O(1)
 */
function pivotIndexBrute(nums: number[]): number {
  for (let i = 0; i < nums.length; i++) {
    let leftSum = 0,
      rightSum = 0;
    for (let l = 0; l < i; l++) leftSum += nums[l];
    for (let r = i + 1; r < nums.length; r++) rightSum += nums[r];
    if (leftSum === rightSum) return i;
  }
  return -1;
}

/**
 * Solution 2: Optimized — single pass with running left sum
 * Key insight: rightSum = totalSum - leftSum - nums[i]
 * No prefix array needed — just accumulate leftSum as we go.
 * Time: O(n) — one pass for total sum, one pass for pivot check
 * Space: O(1) — only two variables
 */
function findPivotIndex(nums: number[]): number {
  const totalSum = nums.reduce((sum, v) => sum + v, 0);
  let leftSum = 0;

  for (let i = 0; i < nums.length; i++) {
    const rightSum = totalSum - leftSum - nums[i];
    if (leftSum === rightSum) return i;
    leftSum += nums[i];
  }
  return -1;
}

// === Test Cases ===
console.log(findPivotIndex([1, 7, 3, 6, 5, 6])); // 3
console.log(findPivotIndex([1, 2, 3])); // -1
console.log(findPivotIndex([2, 1, -1])); // 0  (leftSum=0, rightSum=0)
console.log(findPivotIndex([-1, -1, -1, -1, -1, 0])); // 2
console.log(findPivotIndex([1])); // 0  (single element)
```
