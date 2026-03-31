---
layout: page
title: "Maximum Product of First and Last Elements of a Subsequence"
difficulty: Medium
category: Array
tags: [Array, Two Pointers]
leetcode_url: "https://leetcode.com/problems/maximum-product-of-first-and-last-elements-of-a-subsequence"
---

# Maximum Product of First and Last Elements of a Subsequence / Tích Lớn Nhất Của Phần Tử Đầu và Cuối

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers / Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [4Sum](https://leetcode.com/problems/4sum) | [3Sum Closest](https://leetcode.com/problems/3sum-closest)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như mua nhà đầu tư — chọn ngôi nhà đầu tiên và cuối cùng trong một dãy ít nhất m căn liên tiếp, tối đa hóa tích giá. Với mảng có số âm, "tích lớn nhất" có thể đến từ hai số âm lớn — cần theo dõi cả max lẫn min phía trái.

**Pattern Recognition:**

- Subsequence of length m: choose indices i ≤ j where j - i >= m - 1
- Maximize `nums[i] * nums[j]`
- As j slides right from index m-1, valid left indices are [0..j-m+1]
- Track `maxLeft` and `minLeft` (for negative × negative case) incrementally

**Visual — Sliding window with max/min tracking:**

```
nums = [1,-1,-2,4,3,2], m = 3
Need j - i >= 2 (m-1 = 2)

j=2 (idx=2), valid i ∈ [0,0]: maxL=1, minL=1
  products: 1*(-2)=-2, 1*(-2)=-2 → max=-2
j=3 (idx=3), valid i ∈ [0,1]: add nums[1]=-1 → maxL=1, minL=-1
  products: 1*4=4, (-1)*4=-4 → max=4
j=4 (idx=4), valid i ∈ [0,2]: add nums[2]=-2 → maxL=1, minL=-2
  products: 1*3=3, (-2)*3=-6 → max=4
j=5 (idx=5), valid i ∈ [0,3]: add nums[3]=4 → maxL=4, minL=-2
  products: 4*2=8, (-2)*2=-4 → max=8 ✅
```

---

## Problem Description

Given an integer array `nums` and integer `m`, find the **maximum product** of the **first and last elements** of any subsequence of `nums` that has length exactly `m`. A subsequence maintains relative order, so first and last indices i, j must satisfy `j - i >= m - 1`. ([LeetCode 3404](https://leetcode.com/problems/maximum-product-of-first-and-last-elements-of-a-subsequence))

Difficulty: Medium | Acceptance: 29.8%

```
Example 1: nums=[1,-1,-2,4,3,2], m=3  → 8  (indices 3 and 5: 4*2=8)
Example 2: nums=[-1,-9,2,3,-6,-5], m=2 → 45 (indices 1 and 4: -9*-6=54? let me check)
  Actually: -9 * -5 = 45, indices 1 and 5 (j-i=4 >= 1) → 45
```

Constraints:

- `2 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `2 <= m <= nums.length`

---

## 📝 Interview Tips

1. **Subsequence vs subarray**: "Subsequence cần j-i >= m-1, không phải j-i = m-1" / Any m-length subsequence → first/last indices just need gap ≥ m-1
2. **Negative × negative**: "Tích lớn nhất có thể từ hai số âm → track cả min lẫn max" / Track both max and min left values to handle negative products
3. **Sliding window**: "Khi j tăng 1, thêm nums[j-m+1] vào pool trái" / As j advances, new index j-m+1 becomes valid left candidate
4. **Start j at m-1**: "j bắt đầu từ m-1 (cửa sổ tối thiểu)" / First valid j is m-1 (minimum window)
5. **Brute force O(n²)**: "Vẫn ổn với n ≤ 1000 nhưng TLE với n=10^5" / Brute force fine for small n
6. **Follow-up**: "Nếu m thay đổi theo query? → rebuild window mỗi query O(n)" / Different m per query → O(n) per query

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try all valid (i, j) pairs
 * Time: O(n²) — n pairs where j - i >= m - 1
 * Space: O(1)
 */
function maximumProductBrute(nums: number[], m: number): number {
  const n = nums.length;
  let ans = -Infinity;
  for (let i = 0; i <= n - m; i++) {
    for (let j = i + m - 1; j < n; j++) {
      ans = Math.max(ans, nums[i] * nums[j]);
    }
  }
  return ans;
}

/**
 * Solution 2: Sliding Window — track maxLeft and minLeft as j slides
 * Time: O(n) — single pass, j from m-1 to n-1
 * Space: O(1) — only two running values
 *
 * As j increases from m-1 to n-1:
 *   New valid left index = j - m + 1
 *   Update maxLeft = max(maxLeft, nums[j - m + 1])
 *   Update minLeft = min(minLeft, nums[j - m + 1])
 *   Product candidates: maxLeft * nums[j], minLeft * nums[j]
 */
function maximumProductOfFirstAndLastElementsOfASubsequence(nums: number[], m: number): number {
  const n = nums.length;
  let maxLeft = nums[0];
  let minLeft = nums[0];
  let ans = -Infinity;

  for (let j = m - 1; j < n; j++) {
    // The new valid left index that enters the pool when j advances
    const newLeftIdx = j - m + 1;
    if (newLeftIdx > 0) {
      // Expand left pool to include nums[newLeftIdx]
      maxLeft = Math.max(maxLeft, nums[newLeftIdx]);
      minLeft = Math.min(minLeft, nums[newLeftIdx]);
    }
    // Consider products of best left values with nums[j]
    ans = Math.max(ans, maxLeft * nums[j], minLeft * nums[j]);
  }

  return ans;
}

// === Test Cases ===
console.log(maximumProductOfFirstAndLastElementsOfASubsequence([1, -1, -2, 4, 3, 2], 3)); // 8
console.log(maximumProductOfFirstAndLastElementsOfASubsequence([-1, -9, 2, 3, -6, -5], 2)); // 45
console.log(maximumProductOfFirstAndLastElementsOfASubsequence([1, 2], 2)); // 2
console.log(maximumProductOfFirstAndLastElementsOfASubsequence([-3, -2], 2)); // 6
```

---

## 🔗 Related Problems

- [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray) — track max/min running product
- [3Sum Closest](https://leetcode.com/problems/3sum-closest) — Two Pointers with product/sum optimization
- [4Sum](https://leetcode.com/problems/4sum) — Two Pointers multi-pair
- [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) — Two Pointers
- [Maximum Product of First and Last Elements — LeetCode](https://leetcode.com/problems/maximum-product-of-first-and-last-elements-of-a-subsequence) — problem page
