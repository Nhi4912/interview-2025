---
layout: page
title: "Minimum Equal Sum of Two Arrays After Replacing Zeros"
difficulty: Medium
category: Array
tags: [Array, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-equal-sum-of-two-arrays-after-replacing-zeros"
---

# Minimum Equal Sum of Two Arrays After Replacing Zeros / Tổng Bằng Nhau Nhỏ Nhất Sau Khi Thay Số 0

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy (Minimum feasible target)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống nâng hai chiếc cân về cùng một mức — mỗi số 0 là quả cân có thể điều chỉnh (tối thiểu +1). Nếu một cái cân không có số 0 và đang nặng hơn, ta không thể giảm nó xuống → trả về -1.

**Pattern Recognition:**

- Signal: "replace zeros with positive integers", "make sums equal" → **Greedy: compute minimum achievable sum**
- minSum = sum + count_zeros (mỗi 0 ít nhất là 1)
- target = max(minSum1, minSum2); nếu array không có zero mà sum < target → impossible

**Visual — nums1=[3,2,0,1,0], nums2=[6,5,0]:**

```
nums1: sum=6, zeros=2 → minSum1 = 6+2 = 8
nums2: sum=11, zeros=1 → minSum2 = 11+1 = 12

target = max(8, 12) = 12
nums1 has zeros (can be inflated to reach 12) ✅
nums2 has zeros (can be inflated too) ✅
Answer = 12
```

---

## Problem Description

Replace each `0` in `nums1` and `nums2` with a **positive integer** (at least 1). Make the sum of `nums1` equal to the sum of `nums2`. Return the **minimum equal sum**, or `-1` if it's impossible.

- Example 1: `nums1=[3,2,0,1,0], nums2=[6,5,0]` → `12`
- Example 2: `nums1=[2,0,2,0], nums2=[1,4]` → `-1`

Constraints: `1 <= nums1.length, nums2.length <= 10^5`, `0 <= nums1[i], nums2[i] <= 10^6`

---

## 📝 Interview Tips

1. **Clarify**: "Số 0 phải được thay bằng số dương (≥1), không thể để lại 0" / Zeros must become ≥ 1
2. **Key insight**: "Tổng tối thiểu = sum + count_zeros — đây là sàn không thể đi thấp hơn" / Minimum sum is the floor
3. **Infeasible**: "Nếu array không có zero mà minSum < target → return -1 vì không tăng được" / No zeros = can't increase
4. **Target**: "target = max(minSum1, minSum2) — luôn lấy max" / Target must satisfy both minimums
5. **Both no zeros**: "Nếu cả hai không có zero → chỉ hợp lệ khi sum1 == sum2" / Fixed sums must be equal
6. **Follow-up**: "Nếu cần equal sum với chi phí minimize?" / Add cost function → DP or flow

---

## Solutions

```typescript
/**
 * Solution: Greedy — compute minimum achievable sums
 * Time: O(n + m) — single pass each array
 * Space: O(1) — only sum/count variables
 *
 * minSum[i] = sum(nums) + count_zeros (each 0 contributes at least 1)
 * target = max(minSum1, minSum2)
 * Infeasible if: array has no zeros AND its sum < target (can't inflate it)
 */
function minSum(nums1: number[], nums2: number[]): number {
  let sum1 = 0,
    zeros1 = 0;
  for (const x of nums1) {
    sum1 += x;
    if (x === 0) zeros1++;
  }

  let sum2 = 0,
    zeros2 = 0;
  for (const x of nums2) {
    sum2 += x;
    if (x === 0) zeros2++;
  }

  const minSum1 = sum1 + zeros1;
  const minSum2 = sum2 + zeros2;
  const target = Math.max(minSum1, minSum2);

  // Can array reach target?
  // - If it has zeros, we can inflate them: always possible if target >= minSum
  // - If it has no zeros, sum is fixed: only possible if sum == target
  if (zeros1 === 0 && minSum1 < target) return -1;
  if (zeros2 === 0 && minSum2 < target) return -1;

  return target;
}

// === Test Cases ===
console.log(minSum([3, 2, 0, 1, 0], [6, 5, 0])); // 12
console.log(minSum([2, 0, 2, 0], [1, 4])); // -1
console.log(minSum([0], [0])); // 1
console.log(minSum([1, 2, 3], [1, 2, 3])); // 6 (both fixed, equal)
console.log(minSum([1, 2, 3], [4, 5, 6])); // -1 (both fixed, not equal)
```

---

## 🔗 Related Problems

- [Jump Game II](https://leetcode.com/problems/jump-game-ii) — greedy minimum steps
- [Gas Station](https://leetcode.com/problems/gas-station) — greedy feasibility check
- [Candy](https://leetcode.com/problems/candy) — greedy minimum sum with constraints
- [Largest Number](https://leetcode.com/problems/largest-number) — greedy ordering for optimal result
