---
layout: page
title: "Number of Good Binary Strings"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/number-of-good-binary-strings"
---

# Number of Good Binary Strings / Số Chuỗi Nhị Phân Tốt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Maximal Square](https://leetcode.com/problems/maximal-square)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như xây tường bằng hai loại gạch — gạch loại A dài `zero` đơn vị, gạch loại B dài `one` đơn vị. Đếm số cách xây tường có tổng chiều dài trong `[minLength, maxLength]`. Đây là bài toán "coin change counting" biến thể.

**Pattern Recognition:**

- Signal: "count ways to build length L using blocks of size `zero` or `one`" → **DP unbounded knapsack style**
- `dp[i]` = số chuỗi nhị phân hợp lệ có độ dài đúng bằng i
- Transition: `dp[i] += dp[i - zero]` (thêm khối zero 0s) + `dp[i - one]` (thêm khối one 1s)

**Visual — zero=1, one=2, minLen=2, maxLen=3:**

```
dp[0] = 1  (empty string, base case)
dp[1] = dp[1-1] + 0 = dp[0] = 1    (appended "0")
dp[2] = dp[2-1] + dp[2-2] = 1+1=2  (appended "0" or appended "11")
dp[3] = dp[3-1] + dp[3-2] = 2+1=3  (..."000","011","110")

Answer = dp[2] + dp[3] = 2+3 = 5
```

---

## Problem Description

A binary string is **good** if it can be built by repeatedly appending `zero` zeros or `one` ones. Return the count of good strings with length in `[minLength, maxLength]`, modulo 10^9+7. ([LeetCode 2466](https://leetcode.com/problems/number-of-good-binary-strings))

**Example 1:** `minLength=2, maxLength=3, zero=1, one=2` → `5`

**Example 2:** `minLength=2, maxLength=3, zero=2, one=3` → `1` (only "00")

Constraints: `1 <= minLength <= maxLength <= 10^5`, `1 <= zero, one <= maxLength`

---

## 📝 Interview Tips

1. **Analogy to coin change**: "Đây là 'coin change – count ways' với coin sizes = {zero, one}" / Equivalent to counting ways to make value L from coins {zero, one}
2. **Base case**: "dp[0] = 1 (chuỗi rỗng — điểm khởi đầu duy nhất)" / Empty string is the only base; dp[0] must be 1
3. **Transition**: "dp[i] += dp[i-zero] (nếu i≥zero) và dp[i] += dp[i-one] (nếu i≥one)" / Add both block sizes independently
4. **Answer accumulation**: "Cộng dp[i] cho mọi i ∈ [minLength, maxLength] — không phải chỉ maxLength" / Sum dp[i] over the valid range, not just the endpoint
5. **Modular arithmetic**: "Lấy mod ở mỗi bước dp và khi cộng vào answer" / Apply MOD at every addition
6. **Edge cases**: "zero == one → chỉ multiples của zero hợp lệ; minLength > maxLength → 0" / When zero==one only multiples are reachable

---

## Solutions

```typescript
/**
 * Solution 1: Top-Down DP (Memoization)
 * Time: O(maxLength) — each length computed once
 * Space: O(maxLength) — memo array
 */
function countGoodStringsMemo(
  minLength: number,
  maxLength: number,
  zero: number,
  one: number,
): number {
  const MOD = 1_000_000_007;
  const memo = new Array(maxLength + 1).fill(-1);

  function dp(len: number): number {
    if (len > maxLength) return 0;
    if (memo[len] !== -1) return memo[len];
    let ways = 0;
    if (len >= zero) ways = (ways + dp(len - zero)) % MOD;
    if (len >= one) ways = (ways + dp(len - one)) % MOD;
    // Note: dp(0) = 1 is the base seed, not computed by recursion — set it directly
    return (memo[len] = ways);
  }

  memo[0] = 1; // base: empty string

  let ans = 0;
  for (let l = minLength; l <= maxLength; l++) {
    ans = (ans + dp(l)) % MOD;
  }
  return ans;
}

/**
 * Solution 2: Bottom-Up DP — clean iterative version
 * Time: O(maxLength) — single forward pass
 * Space: O(maxLength) — dp array
 */
function countGoodStrings(minLength: number, maxLength: number, zero: number, one: number): number {
  const MOD = 1_000_000_007;
  const dp = new Array(maxLength + 1).fill(0);
  dp[0] = 1; // base: empty string has exactly 1 way to build (don't append anything)

  for (let i = 1; i <= maxLength; i++) {
    if (i >= zero) dp[i] = (dp[i] + dp[i - zero]) % MOD; // append block of `zero` 0s
    if (i >= one) dp[i] = (dp[i] + dp[i - one]) % MOD; // append block of `one` 1s
  }

  // Sum all valid lengths
  let ans = 0;
  for (let i = minLength; i <= maxLength; i++) {
    ans = (ans + dp[i]) % MOD;
  }
  return ans;
}

/**
 * Solution 3: Prefix sum optimization for large ranges
 * Time: O(maxLength) — same, but avoids second loop via running sum
 * Space: O(maxLength)
 */
function countGoodStringsOpt(
  minLength: number,
  maxLength: number,
  zero: number,
  one: number,
): number {
  const MOD = 1_000_000_007;
  const dp = new Array(maxLength + 1).fill(0);
  dp[0] = 1;

  let ans = 0;
  for (let i = 1; i <= maxLength; i++) {
    if (i >= zero) dp[i] = (dp[i] + dp[i - zero]) % MOD;
    if (i >= one) dp[i] = (dp[i] + dp[i - one]) % MOD;
    if (i >= minLength) ans = (ans + dp[i]) % MOD;
  }
  return ans;
}

// === Test Cases ===
console.log(countGoodStrings(2, 3, 1, 2)); // 5
console.log(countGoodStrings(2, 3, 2, 3)); // 1
console.log(countGoodStrings(1, 1, 1, 1)); // 2 ("0" or "1")
console.log(countGoodStrings(5, 5, 2, 3)); // 2 ("00111" or "11100" style)
```
