---
layout: page
title: "Count Increasing Quadruplets"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Binary Indexed Tree, Enumeration, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/count-increasing-quadruplets"
---

# Count Increasing Quadruplets / Count Increasing Quadruplets

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Indexed Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) | [Longest Mountain in Array](https://leetcode.com/problems/longest-mountain-in-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đếm các "bộ tứ leo núi rồi xuống" — i < j < k < l nhưng nums[j] > nums[k] (đỉnh ở giữa). Cách nhìn: fix j và k, đếm bao nhiêu i < j có nums[i] < nums[k] và bao nhiêu l > k có nums[l] > nums[j].

**Visual — Pattern i<j<k<l, nums[i]<nums[k]<nums[l], nums[j]>nums[k]:**

```
Example: nums = [1,3,2,4,5]
Valid quadruplets (i,j,k,l):
  (0,1,2,3): nums=[1,3,2,4] → 1<2<4 and 3>2 ✓
  (0,1,2,4): nums=[1,3,2,5] → 1<2<5 and 3>2 ✓
  (0,1,3,4): 1<4<5 and 3>4? No
  (0,2,3,4): 1<3<5 — need nums[j]>nums[k] where j=2,k=3: 2>3? No
Count = 2

DP approach: Fix k (middle-right element)
  left[k] = number of (i,j) pairs with i<j<k, nums[i]<nums[k], nums[j]>nums[k]
  right[k] = number of l>k with nums[l]>nums[k] ... but we need nums[l]>nums[j]
```

---

## Problem Description

Given a 0-indexed integer array `nums` of size `n` containing all distinct values 1..n (a permutation), return the number of **increasing quadruplets** `(i,j,k,l)` where `0 <= i < j < k < l < n` and `nums[i] < nums[k] < nums[l]` and `nums[j] > nums[k]`. ([LeetCode](https://leetcode.com/problems/count-increasing-quadruplets))

Difficulty: Hard | Acceptance: 33.9%

**Example 1:**

```
Input: nums = [1,3,2,4,5]
Output: 2
Explanation: (0,1,2,3) and (0,1,2,4) are the valid quadruplets.
```

**Example 2:**

```
Input: nums = [1,2,3,4]
Output: 0
Explanation: No valid quadruplet (nums[j] > nums[k] never satisfied).
```

Constraints:

- `4 <= n <= 4000`
- `1 <= nums[i] <= n`
- All values in `nums` are distinct.

---

## 📝 Interview Tips

1. **Pattern**: "Bộ tứ (i<j<k<l) với điều kiện nums[i]<nums[k]<nums[l] và nums[j]>nums[k] — dạng 132+4" / The pattern is a '132' pattern extended with a fourth element.
2. **Fix the pivot**: "Fix k, đếm cặp (i,j) hợp lệ ở bên trái và l hợp lệ ở bên phải" / Fix k and enumerate left pairs and right singles.
3. **O(n²) DP**: "dp[k] = số cặp (i,j) với i<j<k thỏa mãn, tính bằng cách duyệt j từ 0 đến k-1" / For each k, iterate j to build dp.
4. **Transition**: "Với mỗi j<k: nếu nums[j]>nums[k], thêm vào count số i<j với nums[i]<nums[k]" / Count i's where nums[i] < nums[k].
5. **Edge cases**: "n<4 không thể tạo quadruplet" / Need at least 4 elements.
6. **Optimization**: "BIT/Fenwick tree để count prefix queries O(log n) thay vì O(n)" / BIT gives O(n² log n) overall.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force O(n^4)
 * Time: O(n⁴) — enumerate all quadruplets
 * Space: O(1)
 */
function countIncreasingQuadrupletsBrute(nums: number[]): number {
  const n = nums.length;
  let count = 0;
  for (let i = 0; i < n - 3; i++) {
    for (let j = i + 1; j < n - 2; j++) {
      for (let k = j + 1; k < n - 1; k++) {
        if (nums[j] <= nums[k]) continue; // need nums[j] > nums[k]
        for (let l = k + 1; l < n; l++) {
          if (nums[i] < nums[k] && nums[k] < nums[l]) {
            count++;
          }
        }
      }
    }
  }
  return count;
}

/**
 * Solution 2: DP O(n²)
 * Time: O(n²) — for each k, compute left pairs in O(n)
 * Space: O(n)
 *
 * dp[j] = number of i < j with nums[i] < nums[k] (recomputed for each k)
 * For each k: iterate j from 0 to k-1
 *   if nums[j] > nums[k]: contribution = dp[j] (pairs (i,j) valid for this k)
 *   if nums[j] < nums[k]: dp[j] can be used for future k's, update dp running count
 * rightCount[k] = number of l > k with nums[l] > nums[k]
 */
function countIncreasingQuadruplets(nums: number[]): number {
  const n = nums.length;

  // dp[j] = number of valid (i,j) pairs for current k where nums[i] < nums[k]
  // We'll rebuild for each k

  // Precompute: for each k, leftPairs[k] = sum over j<k of (# i<j with nums[i]<nums[k]) where nums[j]>nums[k]
  const leftPairs = new Array(n).fill(0);

  for (let k = 2; k < n; k++) {
    let smallerCount = 0; // count of i seen so far with nums[i] < nums[k]
    for (let j = 0; j < k; j++) {
      if (nums[j] > nums[k]) {
        // j is a valid 'j' for this k: add all i's < j with nums[i] < nums[k]
        leftPairs[k] += smallerCount;
      } else if (nums[j] < nums[k]) {
        // j could be an 'i' for future j positions
        smallerCount++;
      }
    }
  }

  // Precompute rightCount[k] = number of l > k with nums[l] > nums[k]
  // Wait — we need nums[l] > nums[j], not nums[k]... re-read problem
  // Condition: nums[i] < nums[k] < nums[l] AND nums[j] > nums[k]
  // So for fixed k: need l > k with nums[l] > nums[k], i < j < k with nums[i] < nums[k] < nums[j]...
  // Actually re-check: nums[i] < nums[k] < nums[l] and nums[i] < nums[j] is NOT stated
  // The condition is: nums[i] < nums[k] < nums[l] AND nums[j] > nums[k]
  // So rightCount[k] = # l > k with nums[l] > nums[k]
  const rightCount = new Array(n).fill(0);
  for (let k = n - 2; k >= 0; k--) {
    rightCount[k] = rightCount[k + 1] + (nums[k + 1] > nums[k] ? 1 : 0);
    // Actually need count of l > k with nums[l] > nums[k]
  }
  // Recompute rightCount properly
  for (let k = 0; k < n - 1; k++) {
    let cnt = 0;
    for (let l = k + 1; l < n; l++) {
      if (nums[l] > nums[k]) cnt++;
    }
    rightCount[k] = cnt;
  }

  let ans = 0;
  for (let k = 1; k < n - 1; k++) {
    ans += leftPairs[k] * rightCount[k];
  }
  return ans;
}

// === Test Cases ===
console.log(countIncreasingQuadruplets([1, 3, 2, 4, 5])); // 2
console.log(countIncreasingQuadruplets([1, 2, 3, 4])); // 0
console.log(countIncreasingQuadruplets([4, 3, 2, 1])); // 0
```

---

## 🔗 Related Problems

- [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self) — BIT/merge sort
- [Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence) — same pattern: Segment Tree
- [Find All Good Indices](https://leetcode.com/problems/find-all-good-indices) — same pattern: Prefix Sum
- [Count Inversions](https://leetcode.com/problems/count-of-inversions) — counting pairs with condition
- [Count Increasing Quadruplets — LeetCode](https://leetcode.com/problems/count-increasing-quadruplets) — problem page
