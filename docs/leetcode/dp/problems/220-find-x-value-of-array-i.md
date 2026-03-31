---
layout: page
title: "Find X Value of Array I"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/find-x-value-of-array-i"
---

# Find X Value of Array I / Find X Value of Array I

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Predict the Winner](https://leetcode.com/problems/predict-the-winner) | [Count Strictly Increasing Subarrays](https://leetcode.com/problems/count-strictly-increasing-subarrays)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đếm số cách chia đội trong một dãy người — với mỗi vị trí chia, ta cần biết tích phần trước mod k và tích phần sau mod k, ghép lại để check điều kiện.

**Visual — nums=[1,2,3,4,5], k=3, x=1:**

```
Count subarrays [l..r] where product % k == x

Prefix products mod k:
idx:  0  1  2  3  4
val:  1  2  3  4  5
prod: 1  2  6  24 120
mod3: 1  2  0  0  0

For each r, count l where prod[l-1]^{-1} * prod[r] ≡ x (mod k)
i.e., we need prefix[l] such that prefix[r] / prefix[l-1] ≡ x (mod k)

dp[r][rem] = number of subarrays ending at r with product ≡ rem (mod k)
dp[r][rem] = dp[r-1][rem * nums[r] % k] ... (track backwards)

Answer: sum of dp[r][x] for all r
```

---

## Problem Description

You are given an integer array `nums` and two positive integers `k` and `x`. Return the number of subarrays of `nums` where the **product of all elements** is **divisible by k with remainder x** (i.e., `product % k == x`). ([LeetCode](https://leetcode.com/problems/find-x-value-of-array-i))

Difficulty: Medium | Acceptance: 33.2%

**Example 1:**

```
Input: nums = [1,2,3,4,5], k = 3, x = 0
Output: 6
Explanation: Subarrays with product divisible by 3:
[3],[1,2,3],[2,3],[3,4],[2,3,4],[1,2,3,4] → 6 subarrays
```

**Example 2:**

```
Input: nums = [1,2,4,8], k = 4, x = 0
Output: 3
Explanation: [4],[2,4],[1,2,4] have products divisible by 4.
```

Constraints:

- `1 <= nums.length <= 1000`
- `1 <= nums[i] <= 1000`
- `1 <= k <= 31`
- `0 <= x < k`

---

## 📝 Interview Tips

1. **Clarify**: "x có thể là 0 không (chia hết)? k có thể lớn không?" / Confirm x range [0, k-1] and constraints on k.
2. **Brute force**: "O(n²): duyệt mọi cặp (l,r), nhân tích và mod k" / All O(n²) pairs with running product.
3. **DP insight**: "dp[rem] = số subarray kết thúc tại vị trí hiện tại có product ≡ rem (mod k)" / Track counts by remainder.
4. **Transition**: "Khi thêm nums[i]: dp_new[rem] = dp_old[(rem \* modinv(nums[i])) % k]... hoặc đơn giản rebuild" / Multiply all remainders by nums[i] mod k.
5. **Edge cases**: "nums[i] có thể chia hết k → product reset về 0 mod k" / Large products mod k behave correctly.
6. **Follow-up**: "Array II có n lên đến 10^5 — cần segment tree / sparse table" / Part II requires more efficient structure.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force O(n²)
 * Time: O(n²) — enumerate all subarrays
 * Space: O(1) — no extra space
 */
function findXValueBrute(nums: number[], k: number, x: number): number {
  const n = nums.length;
  let count = 0;
  for (let l = 0; l < n; l++) {
    let product = 1;
    for (let r = l; r < n; r++) {
      product = (product * nums[r]) % k;
      if (product === x) count++;
    }
  }
  return count;
}

/**
 * Solution 2: DP with remainder tracking O(n·k)
 * Time: O(n·k) — for each element, update k remainder buckets
 * Space: O(k) — dp array of size k
 *
 * dp[rem] = count of subarrays ending at current index with product ≡ rem (mod k)
 */
function findXValueOfArrayI(nums: number[], k: number, x: number): number {
  // dp[rem] = number of subarrays ending here with product % k == rem
  let dp = new Array(k).fill(0);
  let result = 0;

  for (const num of nums) {
    const ndp = new Array(k).fill(0);
    // Each existing subarray extended by num
    for (let rem = 0; rem < k; rem++) {
      if (dp[rem] > 0) {
        const newRem = (rem * num) % k;
        ndp[newRem] += dp[rem];
      }
    }
    // New subarray starting at this element
    ndp[num % k] += 1;
    dp = ndp;
    result += dp[x];
  }

  return result;
}

// === Test Cases ===
console.log(findXValueOfArrayI([1, 2, 3, 4, 5], 3, 0)); // 6
console.log(findXValueOfArrayI([1, 2, 4, 8], 4, 0)); // 3
console.log(findXValueOfArrayI([1, 2, 3], 1, 0)); // 6 (everything mod 1 == 0)
console.log(findXValueOfArrayI([5], 3, 2)); // 1 (5%3==2)
```

---

## 🔗 Related Problems

- [Predict the Winner](https://leetcode.com/problems/predict-the-winner) — same pattern: Dynamic Programming
- [Count Strictly Increasing Subarrays](https://leetcode.com/problems/count-strictly-increasing-subarrays) — same pattern: Dynamic Programming
- [The Number of Good Subsets](https://leetcode.com/problems/the-number-of-good-subsets) — DP with bitmask
- [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i) — same pattern: Prefix Sum
- [Find X Value of Array I — LeetCode](https://leetcode.com/problems/find-x-value-of-array-i) — problem page
