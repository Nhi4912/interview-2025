---
layout: page
title: "Numbers With Repeated Digits"
difficulty: Hard
category: Dynamic Programming
tags: [Math, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/numbers-with-repeated-digits"
---

# Numbers With Repeated Digits / Số Có Chữ Số Lặp Lại

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Digit DP / Combinatorics
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Như đếm biển số xe không có chữ số trùng — thay vì đếm trực tiếp, ta đếm ngược: tổng số biển trừ đi số biển không trùng.

**Pattern Recognition:**

- Signal: "count numbers up to N with property" → Digit DP or complementary counting
- Count `answer = N − count(distinct-digit numbers from 1 to N)`
- Use permutations P(n, r) to count distinct-digit numbers efficiently

**Visual:**

```
N = 20, count repeated: {11} = 1
Count distinct [1..20]: 1..9 (all distinct=9), 10,12..19,20 (distinct, no 11)
= 9 + 9 (10-digit except 11) = 18 distinct → repeated = 20 - 18 = 2 ✗
Actually: {11} and ... let's count: only 11. answer=1 for n=20
```

## Problem Description

Given integer `n`, return the count of numbers in `[1, n]` that have **at least one repeated digit**.

- Example 1: `n = 20` → `1` (only `11`)
- Example 2: `n = 100` → `10` (`11,22,...,99,100` → but 100 has repeated? no. {11,22,33,44,55,66,77,88,99} = 9... actually just 9)
- Constraints: `1 ≤ n ≤ 10^9`

## 📝 Interview Tips

1. **Clarify**: "Repeated digit" means at least two identical digits in the number? / Có ít nhất 2 chữ số giống nhau?
2. **Approach**: Đếm bù — count(repeated) = n − count(all-distinct) / complement counting
3. **Edge cases**: Single digit numbers (1-9) are always distinct; n=1 → 0
4. **Optimize**: P(9, d-1) for d-digit numbers; handle boundary digits carefully
5. **Test**: n=100 → 10; n=1000 → 262
6. **Follow-up**: Count distinct-digit numbers in range [a,b]?

## Solutions

```typescript
/** Solution 1: Combinatorics (Complement Counting)
 * Time: O(log n) | Space: O(log n)
 * Count distinct-digit numbers 1..n, subtract from n
 */
function numDupDigitsAtMostN(n: number): number {
  const digits = String(n).split("").map(Number);
  const len = digits.length;

  // P(a, b) = a * (a-1) * ... * (a-b+1)
  function perm(a: number, b: number): number {
    let res = 1;
    for (let i = 0; i < b; i++) res *= a - i;
    return res;
  }

  let count = 0;

  // Count all distinct-digit numbers with fewer digits than n
  // d-digit numbers: first digit 1-9, rest choose from remaining 9 digits
  for (let d = 1; d < len; d++) {
    count += 9 * perm(9, d - 1);
  }

  // Count distinct-digit numbers with same length as n, up to n
  const used = new Set<number>();
  for (let i = 0; i < len; i++) {
    const lo = i === 0 ? 1 : 0; // no leading zero
    for (let x = lo; x < digits[i]; x++) {
      if (!used.has(x)) {
        // Fix this digit as x, fill remaining (len-i-1) positions with distinct digits
        count += perm(9 - i, len - i - 1);
      }
    }
    if (used.has(digits[i])) break; // digit already seen — n itself has repeated digit, stop
    used.add(digits[i]);
    if (i === len - 1) count++; // n itself has all distinct digits
  }

  return n - count;
}

/** Solution 2: Digit DP with bitmask of used digits
 * Time: O(10 * 2^10 * log n) | Space: O(10 * 2^10)
 * Explicit DP: dp[tight][started][usedMask]
 */
function numDupDigitsAtMostN2(n: number): number {
  const digits = String(n).split("").map(Number);
  const len = digits.length;
  // memo[tight][started][usedMask]
  const memo = new Map<string, number>();

  function dp(pos: number, tight: boolean, started: boolean, mask: number): number {
    if (pos === len) return started ? 1 : 0;
    const key = `${pos},${tight ? 1 : 0},${started ? 1 : 0},${mask}`;
    if (memo.has(key)) return memo.get(key)!;

    const limit = tight ? digits[pos] : 9;
    let res = 0;

    for (let d = 0; d <= limit; d++) {
      if (d === 0 && !started) {
        // leading zero, stay unstarted
        res += dp(pos + 1, tight && d === limit, false, mask);
      } else {
        if (mask & (1 << d)) continue; // repeated digit — skip
        res += dp(pos + 1, tight && d === limit, true, mask | (1 << d));
      }
    }

    memo.set(key, res);
    return res;
  }

  const distinctCount = dp(0, true, false, 0);
  return n - distinctCount;
}

// Tests
console.log(numDupDigitsAtMostN(20)); // 1
console.log(numDupDigitsAtMostN(100)); // 10
console.log(numDupDigitsAtMostN(1000)); // 262
console.log(numDupDigitsAtMostN2(20)); // 1
console.log(numDupDigitsAtMostN2(100)); // 10
```

## 🔗 Related Problems

| Problem                                                                                | Relationship              |
| -------------------------------------------------------------------------------------- | ------------------------- |
| [Count Special Integers](https://leetcode.com/problems/count-special-integers)         | Same digit-DP pattern     |
| [Non-decreasing Digits](https://leetcode.com/problems/non-decreasing-digits)           | Digit constraint counting |
| [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) | Combinatorial DP          |
