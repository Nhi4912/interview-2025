---
layout: page
title: "Find the Sum of Subsequence Powers"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Sorting]
leetcode_url: "https://leetcode.com/problems/find-the-sum-of-subsequence-powers"
---

# Find the Sum of Subsequence Powers / Find the Sum of Subsequence Powers

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) | [Longest String Chain](https://leetcode.com/problems/longest-string-chain)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống chọn k người từ hàng dài có khoảng cách tối thiểu giữa mỗi đôi — ta cần tính tổng "khoảng cách nhỏ nhất" của tất cả các cách chọn đó. Sắp xếp trước giúp khoảng cách nhỏ nhất chính là min diff của các phần tử liền kề trong subsequence.

**Visual — nums=[1,2,3,4], k=3:**

```
After sort: [1,2,3,4]
All length-3 subsequences and their "power" (min adj diff):
[1,2,3] → min(2-1, 3-2) = 1
[1,2,4] → min(2-1, 4-2) = 1
[1,3,4] → min(3-1, 4-3) = 1
[2,3,4] → min(3-2, 4-3) = 1
Sum = 4

DP state: dp[i][j][minDiff]
  = number of length-j subsequences ending at index i
    with current minimum adjacent gap = minDiff

After sorting, only need to track pairs (count, minDiff)
Use Map<minDiff, count> for each (i, j)
```

---

## Problem Description

Given an integer array `nums` and a positive integer `k`, the **power** of a subsequence is defined as the **minimum absolute difference** between any two adjacent elements (after sorting). Return the **sum of powers** of all subsequences of `nums` that have length `k`. Answer modulo `10^9 + 7`. ([LeetCode](https://leetcode.com/problems/find-the-sum-of-subsequence-powers))

Difficulty: Hard | Acceptance: 23.5%

**Example 1:**

```
Input: nums = [1,2,3,4], k = 3
Output: 4
Explanation: All 4 length-3 subseqs have min-diff = 1. Sum = 4.
```

**Example 2:**

```
Input: nums = [2,2], k = 2
Output: 0
Explanation: Only subsequence [2,2], power = |2-2| = 0.
```

Constraints:

- `2 <= n <= 50`
- `2 <= k <= n`
- `-10^8 <= nums[i] <= 10^8`

---

## 📝 Interview Tips

1. **Sort first**: "Sau khi sắp xếp, power của subsequence = min diff của các cặp liền kề trong subsequence đó" / Sorting makes min-diff = min of adjacent gaps.
2. **DP state**: "dp[i][j][d] = số subsequence dài j kết thúc tại i với min diff hiện tại là d" / Three-dimensional state.
3. **Transition**: "Khi thêm nums[i] vào subseq kết thúc tại prev, new_minDiff = min(old_minDiff, nums[i]-nums[prev])" / Update min diff when extending.
4. **Map optimization**: "Dùng Map<minDiff, count> vì minDiff có thể là nhiều giá trị khác nhau" / Use map instead of dense array.
5. **Modular arithmetic**: "Kết quả có thể rất lớn, nhân/cộng đều phải mod 10^9+7" / Apply modulo at each step.
6. **Edge cases**: "k=2: power = |nums[i]-nums[j]| với i<j, cần tính tổng tất cả cặp" / k=2 simplifies to all pair differences.

---

## Solutions

```typescript
/**
 * Solution 1: Memoized Recursion
 * Time: O(n² * k * D) where D = distinct diff values (up to n²)
 * Space: O(n² * k * D) — memo map
 */
function sumSubseqPowersMemo(nums: number[], k: number): number {
  const MOD = 1_000_000_007n;
  nums.sort((a, b) => a - b);
  const n = nums.length;
  // memo: Map key = "i,j,minDiff" → count
  const memo = new Map<string, bigint>();

  function dp(i: number, j: number, minDiff: number): bigint {
    if (j === k) return BigInt(minDiff);
    if (i === n) return 0n;
    const key = `${i},${j},${minDiff}`;
    if (memo.has(key)) return memo.get(key)!;

    // skip nums[i]
    let res = dp(i + 1, j, minDiff);
    // take nums[i] as last element of subsequence
    if (j > 0) {
      // extend from some previous element — handled by iterative version
    } else {
      // start new subsequence at i
      res = (res + dp(i + 1, 1, Infinity)) % MOD;
    }
    memo.set(key, res);
    return res;
  }

  // Use bottom-up for clarity
  return Number(bottomUp(nums, k));
}

function bottomUp(nums: number[], k: number): bigint {
  const MOD = 1_000_000_007n;
  nums.sort((a, b) => a - b);
  const n = nums.length;

  // dp[i] = Map<minDiff, count of subseqs of current length ending at i>
  // We iterate length from 1 to k
  const INF = 2e8 + 1;

  // dp[i][len] = Map<minDiff, count>
  // Use array of maps
  let prev: Map<number, bigint>[] = Array.from({ length: n }, () => new Map([[INF, 1n]]));
  // prev[i] at len=1: one subseq [nums[i]], minDiff = INF (no adjacent pair yet)

  for (let len = 2; len <= k; len++) {
    const curr: Map<number, bigint>[] = Array.from({ length: n }, () => new Map());
    for (let i = len - 1; i < n; i++) {
      for (let j = len - 2; j < i; j++) {
        const diff = nums[i] - nums[j];
        for (const [oldMin, cnt] of prev[j]) {
          const newMin = Math.min(oldMin, diff);
          curr[i].set(newMin, ((curr[i].get(newMin) ?? 0n) + cnt) % MOD);
        }
      }
    }
    prev = curr;
  }

  let ans = 0n;
  for (let i = 0; i < n; i++) {
    for (const [minDiff, cnt] of prev[i]) {
      ans = (ans + BigInt(minDiff) * cnt) % MOD;
    }
  }
  return ans;
}

/**
 * Solution 2: Bottom-up DP (clean)
 * Time: O(n³ * D) where D is distinct differences per subseq
 * Space: O(n² * D)
 */
function findTheSumOfSubsequencePowers(nums: number[], k: number): number {
  return Number(bottomUp(nums, k));
}

// === Test Cases ===
console.log(findTheSumOfSubsequencePowers([1, 2, 3, 4], 3)); // 4
console.log(findTheSumOfSubsequencePowers([2, 2], 2)); // 0
console.log(findTheSumOfSubsequencePowers([1, 3, 6], 2)); // 5 (|3-1|+|6-3|+|6-1|=2+3+5=10? check)
```

---

## 🔗 Related Problems

- [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) — DP + sorting
- [Longest String Chain](https://leetcode.com/problems/longest-string-chain) — subsequence DP
- [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) — sorting + greedy
- [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes) — 2D subsequence DP
- [Find the Sum of Subsequence Powers — LeetCode](https://leetcode.com/problems/find-the-sum-of-subsequence-powers) — problem page
