---
layout: page
title: "Perfect Number"
difficulty: Easy
category: Math
tags: [Math]
leetcode_url: "https://leetcode.com/problems/perfect-number"
---

# Perfect Number / Số Hoàn Hảo

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math — Divisor Enumeration
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Happy Number](https://leetcode.com/problems/happy-number) | [Ugly Number](https://leetcode.com/problems/ugly-number)

---

## 🧠 Intuition / Tư Duy

**Analogy (🇻🇳):** Số hoàn hảo là số mà tổng tất cả ước số **thực sự** (không kể chính nó) bằng chính nó. Ví dụ: 28 = 1+2+4+7+14. Để tìm ước hiệu quả, chỉ cần duyệt từ 2 đến `sqrt(n)` — mỗi ước `i` đi kèm ước `n/i`.

**Pattern Recognition:**

- Signal: "sum of divisors" → duyệt đến `sqrt(n)`, thêm cả cặp `(i, n/i)`
- Luôn thêm 1 là ước (ngoại trừ n=1: không có ước thực sự nào ngoài 1... nhưng 1 không thỏa mãn)
- Tránh đếm `sqrt(n)` hai lần nếu n là số chính phương
- 5 số hoàn hảo đã biết trong range: 6, 28, 496, 8128, 33550336

**Visual — n=28:**

```
Tìm ước từ 2 đến sqrt(28) ≈ 5.3:

i=2: 28%2=0 → thêm 2 và 28/2=14   sum = 1+2+14 = 17
i=3: 28%3≠0 → bỏ qua
i=4: 28%4=0 → thêm 4 và 28/4=7    sum = 17+4+7 = 28
i=5: 28%5≠0 → bỏ qua

sum(28) = 1+2+4+7+14 = 28 = n  → ✓ Perfect Number
```

---

## Problem Description

A **perfect number** is a positive integer that is equal to the sum of its positive divisors, excluding the number itself. Given an integer `num`, return `true` if it is a perfect number, otherwise return `false`. ([LeetCode 507](https://leetcode.com/problems/perfect-number))

Difficulty: Easy | Acceptance: 44.9%

- **Example 1**: num=28 → `true` (1+2+4+7+14 = 28)
- **Example 2**: num=7 → `false` (1 ≠ 7)
- **Example 3**: num=6 → `true` (1+2+3 = 6)

Constraints: `1 ≤ num ≤ 10^8`

---

## 📝 Interview Tips

1. **Clarify**: "Ước số thực sự bao gồm 1 nhưng không bao gồm chính num" / Proper divisors include 1 but exclude num itself
2. **Brute force**: "Duyệt từ 1 đến num-1 — O(n)" / Linear scan of all proper divisors
3. **Optimal**: "Duyệt đến sqrt(n), thêm cả cặp `(i, n/i)` — O(sqrt(n))" / Enumerate divisor pairs up to sqrt
4. **Edge case**: "num=1 → false (không có ước thực sự dương nào)" / 1 has no proper divisors; sum = 0 ≠ 1
5. **Perfect square**: "Nếu i×i = n, chỉ thêm i một lần, không thêm n/i = i lần nữa" / Avoid double-counting sqrt
6. **Follow-up**: "Có thể hardcode 5 số hoàn hảo đã biết nếu trong range 10^8" / Only 4 perfect numbers ≤ 10^8: 6, 28, 496, 8128

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Linear Scan
 * Time: O(n)
 * Space: O(1)
 */
function checkPerfectNumberBrute(num: number): boolean {
  if (num <= 1) return false;
  let sum = 1; // 1 is always a proper divisor for num > 1
  for (let i = 2; i < num; i++) {
    if (num % i === 0) sum += i;
  }
  return sum === num;
}

/**
 * Solution 2: Optimal — Square Root Enumeration
 * Time: O(sqrt(n))
 * Space: O(1)
 *
 * For each divisor i ≤ sqrt(n), n/i is also a divisor.
 * Always include 1 as a proper divisor. Avoid adding sqrt(n) twice.
 */
function checkPerfectNumber(num: number): boolean {
  if (num <= 1) return false;

  let sum = 1; // 1 is always a proper divisor
  const sqrtN = Math.sqrt(num);

  for (let i = 2; i <= sqrtN; i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i; // avoid double-counting perfect squares
    }
  }

  return sum === num;
}

/**
 * Solution 3: Hardcoded Set (constant time — valid for given constraints)
 * Time: O(1)
 * Space: O(1)
 *
 * Only 4 perfect numbers exist below 10^8: 6, 28, 496, 8128.
 */
function checkPerfectNumberHardcoded(num: number): boolean {
  return [6, 28, 496, 8128, 33550336].includes(num);
}

// === Test Cases ===
console.log(checkPerfectNumber(28)); // true  (1+2+4+7+14 = 28)
console.log(checkPerfectNumber(6)); // true  (1+2+3 = 6)
console.log(checkPerfectNumber(7)); // false
console.log(checkPerfectNumber(1)); // false
console.log(checkPerfectNumber(496)); // true  (1+2+4+8+16+31+62+124+248 = 496)
```

---

## 🔗 Related Problems

- [Happy Number](https://leetcode.com/problems/happy-number) — repeated digit-sum transformation to detect cycle
- [Ugly Number](https://leetcode.com/problems/ugly-number) — check divisibility by specific prime factors
- [Count Primes](https://leetcode.com/problems/count-primes) — sieve for divisor-based enumeration
- [Sum of Digits of String After Convert](https://leetcode.com/problems/sum-of-digits-of-string-after-convert) — digit/divisor sum manipulation
- [Perfect Number — LeetCode](https://leetcode.com/problems/perfect-number) — problem page
