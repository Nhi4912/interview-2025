---
layout: page
title: "The Number of Good Subsets"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/the-number-of-good-subsets"
---

# The Number of Good Subsets / Số Tập Con Tốt

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Bitmask DP + Number Theory
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Như chọn nguyên liệu nấu ăn — mỗi nguyên liệu chỉ dùng một loại gia vị (prime factor), và không dùng cùng gia vị hai lần. Số 1 là nguyên liệu "trung tính" có thể thêm vào bất kỳ công thức nào.

**Pattern Recognition:**

- Signal: "product = product of distinct primes, nums[i] ≤ 30" → Bitmask DP over 10 primes ≤ 30
- Square-free numbers only (no factor p²); map to prime bitmask
- Each `1` in the array is a wildcard that multiplies result by 2

**Visual:**

```
Primes ≤ 30: [2,3,5,7,11,13,17,19,23,29]  (10 primes → 1024 masks)
nums = [1,2,3,4]
4 = 2² → NOT square-free, skip
2 → mask=0001, 3 → mask=0010
Subsets: {2}→mask 0001, {3}→mask 0010, {2,3}→mask 0011
Count[1]=1 → multiply by 2^1=2: answer = 3*2 = 6
```

## Problem Description

A subset is **good** if its product equals a product of **distinct primes**. Given `nums` (1 ≤ nums[i] ≤ 30), return count of good **non-empty** subsets mod `10^9 + 7`.

- Example 1: `nums = [1,2,3,4]` → `6`
- Example 2: `nums = [4,2,3,15]` → `5`
- Constraints: `1 ≤ nums.length ≤ 10^5`, `1 ≤ nums[i] ≤ 30`

## 📝 Interview Tips

1. **Clarify**: "Good" = product is squarefree AND product = product of distinct primes? / Yes — same condition
2. **Approach**: Bitmask DP trên 10 số nguyên tố ≤ 30 / DP over prime factor bitmasks
3. **Edge cases**: Only 1s → no good subset (empty product); elements with square factors → skip
4. **Optimize**: Precompute prime mask for 2..30; iterate DP in reverse to avoid double-counting
5. **Test**: [1,2,3] → answer 4: {2},{3},{2,3} × 2 (for the 1)
6. **Follow-up**: What if nums[i] ≤ 1000?

## Solutions

```typescript
/** Solution 1: Bitmask DP over prime factors
 * Time: O(n + 30 * 1024) | Space: O(1024)
 */
function numberOfGoodSubsets(nums: number[]): number {
  const MOD = 1_000_000_007n;
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

  // Frequency count for numbers 1..30
  const cnt = new Array(31).fill(0);
  for (const x of nums) cnt[x]++;

  // Get prime bitmask for x; return -1 if x has a squared prime factor
  function getPrimeMask(x: number): number {
    let mask = 0;
    for (let i = 0; i < primes.length; i++) {
      const p = primes[i];
      if (x % p === 0) {
        if (x % (p * p) === 0) return -1; // square factor
        mask |= 1 << i;
      }
    }
    return mask;
  }

  // dp[mask] = number of ways to build a subset with exactly this prime product mask
  const dp = new Array(1 << 10).fill(0n);
  dp[0] = 1n; // empty subset baseline

  for (let x = 2; x <= 30; x++) {
    if (cnt[x] === 0) continue;
    const pm = getPrimeMask(x);
    if (pm === -1) continue; // not square-free

    // Iterate in reverse to treat each value at most once per subset
    for (let mask = (1 << 10) - 1; mask >= 0; mask--) {
      if ((mask & pm) !== 0) continue; // would repeat a prime factor
      if (dp[mask] === 0n) continue;
      dp[mask | pm] = (dp[mask | pm] + dp[mask] * BigInt(cnt[x])) % MOD;
    }
  }

  // Sum all non-empty subsets
  let result = 0n;
  for (let mask = 1; mask < 1 << 10; mask++) {
    result = (result + dp[mask]) % MOD;
  }

  // Multiply by 2^count[1]: each '1' can optionally join any good subset
  let pow2 = 1n;
  for (let i = 0; i < cnt[1]; i++) pow2 = (pow2 * 2n) % MOD;

  return Number((result * pow2) % MOD);
}

/** Solution 2: Explicit enumeration with prime factorization check
 * Time: O(2^30 * 30) — conceptually correct but use only for small inputs
 * Shown here as a verification approach for n ≤ 20
 */
function numberOfGoodSubsetsVerify(nums: number[]): number {
  const MOD = 1_000_000_007;
  const n = nums.length;
  if (n > 20) return -1; // too large

  function isGood(subset: number[]): boolean {
    const primeCount = new Map<number, number>();
    for (const x of subset) {
      for (let d = 2; d <= x; d++) {
        if (x % d === 0) {
          primeCount.set(d, (primeCount.get(d) ?? 0) + 1);
          if (primeCount.get(d)! > 1) return false;
          let rem = x / d;
          while (rem % d === 0) {
            primeCount.set(d, (primeCount.get(d) ?? 0) + 1);
            if (primeCount.get(d)! > 1) return false;
            rem /= d;
          }
        }
      }
    }
    return true;
  }

  let count = 0;
  for (let mask = 1; mask < 1 << n; mask++) {
    const subset: number[] = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) subset.push(nums[i]);
    if (isGood(subset)) count = (count + 1) % MOD;
  }
  return count;
}

// Tests
console.log(numberOfGoodSubsets([1, 2, 3, 4])); // 6
console.log(numberOfGoodSubsets([4, 2, 3, 15])); // 5
console.log(numberOfGoodSubsets([1, 1, 1, 2])); // 8 (3 × 2^{count1=3}... wait: {2}×2^3=8 → but also check: good subsets from 2..30: {2}=1, ×2^3=8)
```

## 🔗 Related Problems

| Problem                                                                                                          | Relationship           |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------- |
| [Count the Number of Square-Free Subsets](https://leetcode.com/problems/count-the-number-of-square-free-subsets) | Direct generalization  |
| [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets)               | Subset DP with bitmask |
| [Maximum AND Sum of Array](https://leetcode.com/problems/maximum-and-sum-of-array)                               | Bitmask assignment DP  |
