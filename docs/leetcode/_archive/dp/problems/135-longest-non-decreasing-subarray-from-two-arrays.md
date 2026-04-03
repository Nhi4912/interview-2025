---
layout: page
title: "Longest Non-decreasing Subarray From Two Arrays"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/longest-non-decreasing-subarray-from-two-arrays"
---

# Longest Non-decreasing Subarray From Two Arrays / Mảng Con Không Giảm Dài Nhất Từ Hai Mảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 | **Company tags**: Google

## 🧠 Intuition / Tư Duy

**Analogy:** Như chọn quần áo từ hai tủ — mỗi ngày chọn từ tủ A hoặc tủ B, sao cho số nhãn giá không giảm so với hôm trước. Bạn muốn tìm chuỗi ngày liên tiếp dài nhất thỏa điều kiện này.

**Pattern Recognition:**

- "Pick from 2 arrays at each index to maximize non-decreasing run length" → DP on position
- dp1[i] = longest run ending at i picking nums1[i]; dp2[i] = longest run ending at i picking nums2[i]
- Each can extend from dp1[i-1] or dp2[i-1] if the chosen value is ≥ previous chosen value

**Visual:**

```
nums1 = [2, 3, 1, 1]
nums2 = [2, 2, 3, 4]

i=0: dp1=1, dp2=1
i=1: nums1[1]=3>=nums1[0]=2 → dp1=2; 3>=nums2[0]=2 → dp1=max(2,2)=2
     nums2[1]=2>=nums1[0]=2 → dp2=2; 2>=nums2[0]=2 → dp2=max(2,2)=2
i=2: nums1[2]=1<2 → dp1=1; nums2[2]=3>=2 → dp2=3
i=3: nums1[3]=1<3 → dp1=1; nums2[3]=4>=3 → dp2=4  ← answer=4
```

## Problem Description

Given two 0-indexed arrays `nums1` and `nums2` of the same length `n`, build an array by choosing either `nums1[i]` or `nums2[i]` at each index. Return the length of the longest non-decreasing contiguous subarray in the result.

Examples: nums1=[2,3,1,1], nums2=[2,2,3,4] → 4; nums1=[1,3,2,1], nums2=[2,2,3,2] → 2.

## 📝 Interview Tips

1. **Clarify**: Subarray = liên tiếp, không phải subsequence / confirm contiguous subarray.
2. **Approach**: Theo dõi dp1[i] và dp2[i] song song; mỗi cái có thể extend từ dp1[i-1] hoặc dp2[i-1] tùy giá trị.
3. **Edge cases**: n=1 → luôn trả về 1; khi tất cả giá trị giảm dần → trả về 1.
4. **Optimize**: Chỉ cần 2 biến len1, len2 (giá trị dp của vị trí trước) — O(1) space.
5. **Follow-up**: Nếu có k mảng → theo dõi [minVal, maxVal] ở mỗi vị trí thay vì 2 biến riêng biệt.
6. **Complexity**: Time O(n), Space O(1).

## Solutions

```typescript
/** Solution 1: Two parallel DP arrays
 * Time: O(n) | Space: O(n)
 */
function maxNonDecreasing(nums1: number[], nums2: number[]): number {
  const n = nums1.length;
  const dp1 = new Array<number>(n).fill(1);
  const dp2 = new Array<number>(n).fill(1);
  let ans = 1;

  for (let i = 1; i < n; i++) {
    // dp1[i]: pick nums1[i], can extend from prev picking nums1[i-1] or nums2[i-1]
    if (nums1[i] >= nums1[i - 1]) dp1[i] = Math.max(dp1[i], dp1[i - 1] + 1);
    if (nums1[i] >= nums2[i - 1]) dp1[i] = Math.max(dp1[i], dp2[i - 1] + 1);
    // dp2[i]: pick nums2[i], same logic
    if (nums2[i] >= nums1[i - 1]) dp2[i] = Math.max(dp2[i], dp1[i - 1] + 1);
    if (nums2[i] >= nums2[i - 1]) dp2[i] = Math.max(dp2[i], dp2[i - 1] + 1);
    ans = Math.max(ans, dp1[i], dp2[i]);
  }
  return ans;
}

/** Solution 2: O(1) space — rolling two variables
 * Time: O(n) | Space: O(1)
 */
function maxNonDecreasing2(nums1: number[], nums2: number[]): number {
  const n = nums1.length;
  let len1 = 1,
    len2 = 1,
    ans = 1;
  for (let i = 1; i < n; i++) {
    const nl1 = Math.max(
      nums1[i] >= nums1[i - 1] ? len1 + 1 : 1,
      nums1[i] >= nums2[i - 1] ? len2 + 1 : 1,
    );
    const nl2 = Math.max(
      nums2[i] >= nums1[i - 1] ? len1 + 1 : 1,
      nums2[i] >= nums2[i - 1] ? len2 + 1 : 1,
    );
    len1 = nl1;
    len2 = nl2;
    ans = Math.max(ans, len1, len2);
  }
  return ans;
}

/** Solution 3: Track [minVal, maxVal] range at previous position
 * A subarray can extend if current value ≥ minVal of previous position
 * Time: O(n) | Space: O(1)
 */
function maxNonDecreasing3(nums1: number[], nums2: number[]): number {
  const n = nums1.length;
  let prevMin = Math.min(nums1[0], nums2[0]);
  let prevMax = Math.max(nums1[0], nums2[0]);
  let cur = 1,
    ans = 1;

  for (let i = 1; i < n; i++) {
    const curMin = Math.min(nums1[i], nums2[i]);
    const curMax = Math.max(nums1[i], nums2[i]);
    if (curMax >= prevMin) {
      // At least one choice extends the run
      cur++;
      // Narrow the range: only values >= prevMin can actually extend
      prevMin = Math.max(curMin, prevMin);
      prevMax = curMax;
    } else {
      cur = 1;
      prevMin = curMin;
      prevMax = curMax;
    }
    ans = Math.max(ans, cur);
  }
  return ans;
}

// Tests
console.log(maxNonDecreasing([2, 3, 1, 1], [2, 2, 3, 4])); // 4
console.log(maxNonDecreasing([1, 3, 2, 1], [2, 2, 3, 2])); // 2
console.log(maxNonDecreasing2([2, 3, 1, 1], [2, 2, 3, 4])); // 4
console.log(maxNonDecreasing3([2, 3, 1, 1], [2, 2, 3, 4])); // 4
console.log(maxNonDecreasing([1], [1])); // 1
console.log(maxNonDecreasing([1, 2], [2, 1])); // 2
```

## 🔗 Related Problems

| Problem                                                                                                            | Relationship                                   |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence)                     | Find longest run, but subsequence not subarray |
| [Maximum Non-Negative Product in a Matrix](https://leetcode.com/problems/maximum-non-negative-product-in-a-matrix) | DP choosing from multiple options per cell     |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii)                                                         | DP on array positions with extend/reset logic  |
