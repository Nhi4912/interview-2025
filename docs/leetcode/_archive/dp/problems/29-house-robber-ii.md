---
layout: page
title: "House Robber II"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/house-robber-ii"
---

# House Robber II / Tên Trộm II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming (Circular)
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [House Robber](https://leetcode.com/problems/house-robber) | [House Robber III](https://leetcode.com/problems/house-robber-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng những ngôi nhà xếp thành vòng tròn trên một con đường hẻm. Tên trộm không thể cướp nhà đầu tiên và nhà cuối cùng cùng lúc (vì chúng kề nhau). Giải pháp khéo léo: chạy thuật toán House Robber I hai lần — một lần bỏ qua nhà đầu, một lần bỏ qua nhà cuối, rồi lấy kết quả lớn hơn.

**Pattern Recognition:**

- Signal: "circular array" + "cannot rob adjacent" → **run linear DP twice**
- Break circular constraint: exclude first OR exclude last element
- Key insight: tránh trùng hợp bằng cách chia thành 2 bài toán tuyến tính

**Visual — nums = [2,3,2]:**

```
Houses: [2, 3, 2]  ← house 0 and house 2 are adjacent (circular)

Run 1: exclude last  → [2, 3]
  dp: prev2=0, prev1=2 → curr=max(3, 2+0)=3 → result1=3

Run 2: exclude first → [3, 2]
  dp: prev2=0, prev1=3 → curr=max(2, 3+0)=3 → result2=3

Answer: max(3, 3) = 3
```

---

## Problem Description

All houses are arranged in a circle (first and last house are adjacent). Given `nums[i]` as the money in house `i`, find the maximum amount you can rob without robbing two adjacent houses. ([LeetCode 213](https://leetcode.com/problems/house-robber-ii))

Difficulty: Medium | Acceptance: 43.6%

- **Example 1**: nums = [2,3,2] → **3** (rob house 1 with $3)
- **Example 2**: nums = [1,2,3,1] → **4** (rob house 0 + house 2 = 1+3)

Constraints:

- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Nhà đầu và cuối có kề nhau không?" / Confirm first and last are adjacent in circle
2. **Key reduction**: "Chia vòng tròn thành 2 bài tuyến tính" / Break circular into 2 linear problems
3. **Brute force**: "Thử mọi subset O(2^n)" → DP O(n) / Exponential brute force → linear DP
4. **State**: "prev2, prev1 đủ rồi — không cần mảng" / Two variables replace full dp array
5. **Edge cases**: "1 nhà → return nums[0]; 2 nhà → return max(nums)" / Handle small inputs
6. **Follow-up**: "House Robber III — cây nhị phân? Dùng postorder DFS" / Tree variant uses DFS

---

## Solutions

```typescript
/**
 * Helper: Linear House Robber on nums[start..end]
 * Time: O(n), Space: O(1)
 */
function robLinear(nums: number[], start: number, end: number): number {
  let prev2 = 0;
  let prev1 = 0;
  for (let i = start; i <= end; i++) {
    const curr = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

/**
 * Solution 1: Two-pass linear DP
 * Time: O(n) — two linear passes
 * Space: O(1) — constant extra space
 */
function robII(nums: number[]): number {
  const n = nums.length;
  if (n === 1) return nums[0];
  if (n === 2) return Math.max(nums[0], nums[1]);

  // Case 1: exclude last house (rob houses 0..n-2)
  const case1 = robLinear(nums, 0, n - 2);
  // Case 2: exclude first house (rob houses 1..n-1)
  const case2 = robLinear(nums, 1, n - 1);

  return Math.max(case1, case2);
}

/**
 * Solution 2: Explicit DP arrays (easier to understand)
 * Time: O(n), Space: O(n)
 */
function robIIVerbose(nums: number[]): number {
  const n = nums.length;
  if (n === 1) return nums[0];
  if (n === 2) return Math.max(nums[0], nums[1]);

  // dp1[i] = max rob in nums[0..i] (exclude last house)
  const dp1 = new Array(n - 1).fill(0);
  dp1[0] = nums[0];
  if (n > 2) dp1[1] = Math.max(nums[0], nums[1]);
  for (let i = 2; i < n - 1; i++) {
    dp1[i] = Math.max(dp1[i - 1], dp1[i - 2] + nums[i]);
  }

  // dp2[i] = max rob in nums[1..n-1] (exclude first house)
  const dp2 = new Array(n - 1).fill(0);
  dp2[0] = nums[1];
  if (n > 2) dp2[1] = Math.max(nums[1], nums[2]);
  for (let i = 2; i < n - 1; i++) {
    dp2[i] = Math.max(dp2[i - 1], dp2[i - 2] + nums[i + 1]);
  }

  return Math.max(dp1[n - 2], dp2[n - 2]);
}

// === Test Cases ===
console.log(robII([2, 3, 2])); // 3
console.log(robII([1, 2, 3, 1])); // 4
console.log(robII([1, 2, 3])); // 3
console.log(robII([1])); // 1
console.log(robII([200, 3, 140, 20, 10])); // 340
```

---

## 🔗 Related Problems

| Problem                                                                            | Difficulty | Pattern                     |
| ---------------------------------------------------------------------------------- | ---------- | --------------------------- |
| [House Robber](https://leetcode.com/problems/house-robber)                         | 🟢 Easy    | Linear DP                   |
| [House Robber III](https://leetcode.com/problems/house-robber-iii)                 | 🟡 Medium  | Tree DP (DFS)               |
| [Delete and Earn](https://leetcode.com/problems/delete-and-earn)                   | 🟡 Medium  | DP (reduce to House Robber) |
| [Maximum Sum of Non-adjacent Elements](https://leetcode.com/problems/house-robber) | 🟢 Easy    | Linear DP                   |
| [Jump Game VI](https://leetcode.com/problems/jump-game-vi)                         | 🟡 Medium  | DP + sliding window         |
