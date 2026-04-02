---
layout: page
title: "Number of Beautiful Integers in the Range"
difficulty: Hard
category: Dynamic Programming
tags: [Math, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/number-of-beautiful-integers-in-the-range"
---

# Number of Beautiful Integers in the Range / Số Nguyên Đẹp Trong Khoảng

---

## 🧠 Intuition / Tư Duy

**Analogy:** **EN:** A "beautiful" integer has `#even_digits == #odd_digits` and is divisible by `k`. Use **digit DP**: `answer = count(high) - count(low - 1)`. State = `(pos, tight, balance, rem, leadZero)`.

**VI:** Số "đẹp" có `#chữ_số_chẵn == #chữ_số_lẻ` và chia hết cho `k`. Dùng **DP chữ số**: `kết_quả = đếm(high) - đếm(low−1)`. Trạng thái gồm (vị trí, tight, cân bằng chẵn−lẻ, số dư mod k, số 0 đầu).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Number of Beautiful Integers in the Range example:**

```
State: (pos, tight, balance=even-odd, rem mod k, leadZero)

For digit d at pos:
  newBal = balance + (d%2==0 ? +1 : -1)   (only when not leadZero)
  newRem = (rem*10 + d) % k
  newTight = tight && d == digits[pos]

Valid at end: !leadZero && balance==0 && rem==0

Answer = count(high) - count(low - 1)
```

---

---

## Problem Description

| Problem                                                                                               | Difficulty | Pattern  |
| ----------------------------------------------------------------------------------------------------- | ---------- | -------- |
| [Count Digit One](https://leetcode.com/problems/number-of-digit-one/)                                 | 🔴 Hard    | Digit DP |
| [Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set/) | 🔴 Hard    | Digit DP |
| [Count Special Integers](https://leetcode.com/problems/count-special-integers/)                       | 🔴 Hard    | Digit DP |

---

## 📝 Interview Tips

- 🔑 **EN:** Digit DP template: count valid numbers ≤ limit. Use `count(high) - count(low-1)`. **VI:** Mẫu DP chữ số: đếm số hợp lệ ≤ limit. Dùng count(high) − count(low−1).
- 🔑 **EN:** `balance = even_count - odd_count`, must equal 0 at end; range is `[−D, +D]` with offset. **VI:** balance = số_chẵn − số_lẻ, phải bằng 0 ở cuối; dùng offset +D để lập chỉ mục.
- 🔑 **EN:** Only cache non-tight states; tight=true states are specific to each number. **VI:** Chỉ cache trạng thái tight=false; tight=true phụ thuộc vào số cụ thể.
- 🔑 **EN:** `leadZero` flag prevents counting leading zeros as even digits. **VI:** Cờ leadZero tránh đếm số 0 đầu là chữ số chẵn.
- 🔑 **EN:** `rem = (rem * 10 + d) % k` tracks divisibility. Valid when `rem === 0`. **VI:** rem = (rem\*10 + d) % k theo dõi tính chia hết. Hợp lệ khi rem === 0.
- 🔑 **EN:** Balance range `[-n..+n]` for n-digit number; max n=10, so balance ∈ [-10..10]. **VI:** Balance từ -10 đến +10 với số 10 chữ số; dùng offset +10.

---

---

## Solutions

```typescript
/**
 * Digit DP: count beautiful integers in [low, high]
 * Time: O(D * 2D * k)  Space: O(D * 2D * k)  where D=10 digits
 */
function numberOfBeautifulIntegers(low: number, high: number, k: number): number {
  function countUpTo(limit: number): number {
    const s = String(limit);
    const n = s.length;
    // cache[pos][balance+n][rem] for non-tight non-leadZero states
    const cache: number[][][] = Array.from({ length: n }, () =>
      Array.from({ length: 2 * n + 1 }, () => new Array(k).fill(-1)),
    );

    // Returns count of beautiful integers in [1..limit] (no leading zeros)
    function dp(pos: number, tight: boolean, bal: number, rem: number, lead: boolean): number {
      if (pos === n) {
        return !lead && bal === 0 && rem === 0 ? 1 : 0;
      }
      const cacheKey = bal + n; // offset to keep non-negative
      if (!tight && !lead && cache[pos][cacheKey][rem] !== -1) {
        return cache[pos][cacheKey][rem];
      }
      const maxD = tight ? +s[pos] : 9;
      let res = 0;
      for (let d = 0; d <= maxD; d++) {
        const newLead = lead && d === 0;
        const newBal = newLead ? 0 : bal + (d % 2 === 0 ? 1 : -1);
        const newRem = (rem * 10 + d) % k;
        res += dp(pos + 1, tight && d === maxD, newBal, newRem, newLead);
      }
      if (!tight && !lead) cache[pos][cacheKey][rem] = res;
      return res;
    }

    return dp(0, true, 0, 0, true);
  }

  return countUpTo(high) - countUpTo(low - 1);
}

/**
 * Iterative bottom-up digit DP (alternative)
 * Time: O(D * 2D * k * 10)  Space: O(2D * k)
 */
function numberOfBeautifulIntegersV2(low: number, high: number, k: number): number {
  function countUpTo(limit: number): number {
    const digits = String(limit).split("").map(Number);
    const D = digits.length;
    let result = 0;
    let prevRem = 0,
      prevBal = 0;
    // Use recursive memoization (same as above but with Map for clarity)
    const memo = new Map<string, number>();

    function go(i: number, tight: boolean, bal: number, rem: number, lead: boolean): number {
      if (i === D) return !lead && bal === 0 && rem === 0 ? 1 : 0;
      const key = `${i}|${tight ? 1 : 0}|${bal}|${rem}|${lead ? 1 : 0}`;
      if (memo.has(key)) return memo.get(key)!;
      const cap = tight ? digits[i] : 9;
      let r = 0;
      for (let d = 0; d <= cap; d++) {
        const nl = lead && d === 0;
        r += go(
          i + 1,
          tight && d === cap,
          nl ? 0 : bal + (d % 2 === 0 ? 1 : -1),
          (rem * 10 + d) % k,
          nl,
        );
      }
      memo.set(key, r);
      return r;
    }
    return go(0, true, 0, 0, true);
  }

  return countUpTo(high) - countUpTo(low - 1);
}

// Tests
console.log(numberOfBeautifulIntegers(10, 20, 3)); // 2  → [12, 18]
console.log(numberOfBeautifulIntegers(1, 10, 1)); // 1  → [10]
console.log(numberOfBeautifulIntegers(1, 1000, 2)); // 32
```

---

## 🔗 Related Problems

| Problem                                                                                               | Difficulty | Pattern  |
| ----------------------------------------------------------------------------------------------------- | ---------- | -------- |
| [Count Digit One](https://leetcode.com/problems/number-of-digit-one/)                                 | 🔴 Hard    | Digit DP |
| [Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set/) | 🔴 Hard    | Digit DP |
| [Count Special Integers](https://leetcode.com/problems/count-special-integers/)                       | 🔴 Hard    | Digit DP |
