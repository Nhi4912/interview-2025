---
layout: page
title: "Number of Digit One"
difficulty: Hard
category: Dynamic Programming
tags: [Math, Dynamic Programming, Recursion]
leetcode_url: "https://leetcode.com/problems/number-of-digit-one"
---

# Number of Digit One / Đếm Chữ Số 1

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Fibonacci Number](https://leetcode.com/problems/fibonacci-number) | [Predict the Winner](https://leetcode.com/problems/predict-the-winner)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đếm số lần một chữ số xuất hiện ở mỗi "vị trí" trên đồng hồ số — hàng đơn vị, hàng chục, hàng trăm... Mỗi vị trí có chu kỳ lặp lại độc lập với nhau, có thể tính riêng cho từng hàng.

**Pattern Recognition:**

- Signal: "count occurrences of digit across all numbers in [1..n]" → **Digit-by-digit Math**
- Key insight: với mỗi hàng (factor = 1, 10, 100, ...) đếm riêng số lần chữ số 1 xuất hiện
- `higher`, `current`, `lower` — phân tích 3 phần của n tại mỗi hàng

**Visual — counting 1s at tens position for n = 125:**

```
n = 125, factor = 10:
  higher  = 125 / 100 = 1
  current = (125 / 10) % 10 = 2
  lower   = 125 % 10 = 5

current = 2 (≥ 2) → count = (1+1) * 10 = 20
Meaning: 10-19, 110-119 → 20 occurrences of '1' in tens place ✓
```

---

## Problem Description

Given an integer `n`, count the total number of digit `1` appearing in all non-negative integers less than or equal to `n`. ([LeetCode 233](https://leetcode.com/problems/number-of-digit-one))

**Example 1:** `n = 13` → `6` (1, 10, 11, 12, 13 → digits: 1,1,1,1,1,1)

**Example 2:** `n = 0` → `0`

Constraints: `0 <= n <= 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Brute force O(n log n) sẽ TLE với n=10^9 — cần cách toán học" / O(n log n) brute force too slow; need math
2. **Per-digit analysis**: "Tách n thành higher/current/lower cho mỗi hàng factor" / Split n into three parts per digit position
3. **Three cases**: "current=0: higher*factor; current=1: higher*factor+lower+1; current≥2: (higher+1)\*factor" / Three formulas based on current digit
4. **Why it works**: "Đây là đếm số chu kỳ hoàn chỉnh + phần còn lại tại hàng hiện tại" / Complete cycles plus partial at current digit
5. **Time complexity**: "O(log n) — chỉ lặp qua log₁₀(n) hàng số" / Only O(log n) digit positions
6. **Edge cases**: "n=0 → 0; n=1 → 1; tràn số khi factor\*10 overflow → dùng số thực hoặc BigInt" / Watch for overflow at large factors

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — count 1s digit by digit for each number
 * Time: O(n log n) — too slow for large n, good for understanding
 * Space: O(1)
 */
function countDigitOneBrute(n: number): number {
  let count = 0;
  for (let i = 1; i <= n; i++) {
    let x = i;
    while (x > 0) {
      if (x % 10 === 1) count++;
      x = Math.floor(x / 10);
    }
  }
  return count;
}

/**
 * Solution 2: Math — per-digit-position counting
 * Time: O(log n) — iterate over each digit position
 * Space: O(1)
 */
function countDigitOne(n: number): number {
  let count = 0;

  for (let factor = 1; factor <= n; factor *= 10) {
    const higher = Math.floor(n / (factor * 10)); // digits left of current position
    const current = Math.floor(n / factor) % 10; // digit at current position
    const lower = n % factor; // digits right of current position

    if (current === 0) {
      // e.g. n=209, tens: 0-9 completes 2 cycles → 2*10
      count += higher * factor;
    } else if (current === 1) {
      // e.g. n=215, tens: 0-9 completes 2 cycles + partial 10..15 → 2*10 + 5+1
      count += higher * factor + lower + 1;
    } else {
      // e.g. n=225, tens: current≥2, full (2+1) cycles of tens digit = 1
      count += (higher + 1) * factor;
    }
  }

  return count;
}

// === Test Cases ===
console.log(countDigitOne(13)); // 6
console.log(countDigitOne(0)); // 0
console.log(countDigitOne(1000000000)); // 1000000000
console.log(countDigitOne(100)); // 21
```

---

## 🔗 Related Problems

| Problem                                                                                              | Difficulty | Pattern        |
| ---------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Count Numbers with Unique Digits](https://leetcode.com/problems/count-numbers-with-unique-digits)   | 🟡 Medium  | Digit DP       |
| [Digit Count in Range](https://leetcode.com/problems/digit-count-in-range)                           | 🔴 Hard    | Digit Math     |
| [Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set) | 🔴 Hard    | Digit DP       |
| [Pow(x, n)](https://leetcode.com/problems/powx-n)                                                    | 🟡 Medium  | Math           |
| [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses) | 🟡 Medium  | Recursion / DP |
