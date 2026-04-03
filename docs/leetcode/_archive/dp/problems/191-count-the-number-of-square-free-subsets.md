---
layout: page
title: "Count the Number of Square-Free Subsets"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/count-the-number-of-square-free-subsets"
---

# Count the Number of Square-Free Subsets / Đếm Số Tập Con Không Có Thừa Số Chính Phương

🟡 Medium | Bitmask DP on Prime Factors | LeetCode 2572

## 🧠 Intuition / Tư Duy

**Tiếng Việt:** Một tập con "square-free" có tích không chia hết cho bình phương nguyên tố nào. Vì phần tử ≤ 30, chỉ có 10 số nguyên tố (2,3,5,7,11,13,17,19,23,29). Dùng bitmask đại diện cho các thừa số nguyên tố. Mỗi phần tử phải đóng góp mỗi thừa số đúng một lần (bit).

```
Primes ≤ 30: [2,3,5,7,11,13,17,19,23,29] → 10 bits, 1024 states

nums = [3,4,4,5]
3 → primes {3} → mask = 0b0000000010 = 2
4 = 2² → has square factor → SKIP
5 → primes {5} → mask = 0b0000000100 = 4

dp[0] = 1 (empty subset)
Process 3 (mask=2): dp[2|0] += dp[0] → dp[2] = 1
Process 4: skip (square factor)
Process 4: skip
Process 5 (mask=4): dp[4|0] += dp[0] → dp[4] = 1
                    dp[4|2] += dp[2] → dp[6] = 1

Answer = sum(dp[1..1023]) = 3 (subsets: {3},{5},{3,5})
```

## Problem Description

Given integer array `nums`, return the number of **non-empty** subsets where the product is **square-free** (not divisible by any perfect square other than 1). Answer modulo `10^9 + 7`.

**Example 1:**

- Input: `nums = [3,4,4,5]`
- Output: `3` — Subsets: `{3}`, `{5}`, `{3,5}`

**Example 2:**

- Input: `nums = [1]`
- Output: `1` — Only subset `{1}` (1 is square-free)

## 📝 Interview Tips

- 🎯 **Key insight / Chìa khoá:** Only 10 primes ≤ 30, so only 1024 possible prime-factor bitmasks; skip numbers with repeated prime factors
- 📊 **Square check / Kiểm tra bình phương:** A number is NOT square-free if it has any prime factor with exponent ≥ 2
- 🔢 **Transition / Công thức:** `dp[mask | primeMask[x]] += dp[mask]` for each x whose primeMask doesn't overlap mask
- ⚡ **Complexity / Độ phức tạp:** O(n × 2^10) = O(1024n)
- 🚫 **1 is special / Số 1 đặc biệt:** 1 has empty prime mask (0); contributes to all existing subsets by doubling them
- 💡 **Duplicates / Trùng lặp:** Handle frequency count — same value can appear multiple times

## Solutions

```typescript
/**
 * Approach 1: Bitmask DP on prime factors
 * Time: O(n * 2^10) = O(1024n)
 * Space: O(2^10) = O(1024)
 *
 * dp[mask] = number of subsets whose product has prime factor bitmask = mask
 */
function squareFreeSubsets(nums: number[]): number {
  const MOD = 1_000_000_007n;
  const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

  // Precompute prime bitmask for each number 1..30
  // Returns -1 if number has a squared prime factor
  function getPrimeMask(n: number): number {
    let mask = 0;
    for (let i = 0; i < PRIMES.length; i++) {
      const p = PRIMES[i];
      if (n % p === 0) {
        n /= p;
        if (n % p === 0) return -1; // p² divides n
        mask |= 1 << i;
      }
    }
    return mask;
  }

  const STATES = 1 << PRIMES.length; // 1024
  const dp = new Array<bigint>(STATES).fill(0n);
  dp[0] = 1n; // empty subset

  for (const x of nums) {
    const xMask = getPrimeMask(x);
    if (xMask === -1) continue; // skip square numbers

    // Iterate masks in reverse to avoid reusing element
    for (let mask = STATES - 1; mask >= 0; mask--) {
      if ((mask & xMask) !== 0) continue; // overlap: would double a prime factor
      dp[mask | xMask] = (dp[mask | xMask] + dp[mask]) % MOD;
    }
  }

  // Sum all non-empty subsets
  let ans = 0n;
  for (let mask = 1; mask < STATES; mask++) {
    ans = (ans + dp[mask]) % MOD;
  }
  return Number(ans);
}

console.log(squareFreeSubsets([3, 4, 4, 5])); // 3
console.log(squareFreeSubsets([1])); // 1
console.log(squareFreeSubsets([1, 2, 3, 6])); // 10 (various subsets)
```

```typescript
/**
 * Approach 2: Frequency map optimization
 * Time: O(30 * 2^10) independent of n (since values ≤ 30)
 * Space: O(2^10)
 *
 * Count frequency of each value first, then process each unique value
 * Special case: 1's can be placed freely (multiply all answers by 2^count1)
 */
function squareFreeSubsets2(nums: number[]): number {
  const MOD = 1_000_000_007n;
  const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
  const STATES = 1 << PRIMES.length;

  // Frequency of each number
  const freq = new Array(31).fill(0);
  for (const x of nums) freq[x]++;

  function getPrimeMask(n: number): number {
    let mask = 0;
    for (let i = 0; i < PRIMES.length; i++) {
      const p = PRIMES[i];
      if (n % p === 0) {
        n /= p;
        if (n % p === 0) return -1;
        mask |= 1 << i;
      }
    }
    return mask;
  }

  const dp = new Array<bigint>(STATES).fill(0n);
  dp[0] = 1n;

  for (let v = 2; v <= 30; v++) {
    if (freq[v] === 0) continue;
    const vMask = getPrimeMask(v);
    if (vMask === -1) continue;

    // We can include this value up to freq[v] times (but all with same mask)
    // Each inclusion requires no overlap with existing mask
    for (let mask = STATES - 1; mask >= 0; mask--) {
      if ((mask & vMask) !== 0) continue;
      // Include exactly one copy of v (each copy is a separate element)
      // For freq[v] copies, the number of ways to choose ≥1 copy is freq[v]
      dp[mask | vMask] = (dp[mask | vMask] + dp[mask] * BigInt(freq[v])) % MOD;
    }
  }

  let ans = 0n;
  for (let mask = 1; mask < STATES; mask++) {
    ans = (ans + dp[mask]) % MOD;
  }

  // Multiply by 2^count(1): each 1 can be included or not in any subset
  const ones = freq[1];
  let multiplier = 1n;
  for (let i = 0; i < ones; i++) multiplier = (multiplier * 2n) % MOD;
  ans = (ans * multiplier) % MOD;

  return Number(ans);
}

console.log(squareFreeSubsets2([3, 4, 4, 5])); // 3
console.log(squareFreeSubsets2([1])); // 1
```

## 🔗 Related Problems

| Problem                                                                                                           | Difficulty | Key Concept          |
| ----------------------------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| [Count Ways to Build Good String](https://leetcode.com/problems/count-ways-to-build-good-string/)                 | 🟡 Medium  | DP counting          |
| [Subsets](https://leetcode.com/problems/subsets/)                                                                 | 🟡 Medium  | Subset enumeration   |
| [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)                       | 🟡 Medium  | Prime factorization  |
| [Largest Component Size by Common Factor](https://leetcode.com/problems/largest-component-size-by-common-factor/) | 🔴 Hard    | Union-Find + Factors |
