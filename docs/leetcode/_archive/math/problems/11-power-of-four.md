---
layout: page
title: "Power of Four"
difficulty: Easy
category: Math
tags: [Math, Bit Manipulation, Recursion]
leetcode_url: "https://leetcode.com/problems/power-of-four"
---

# Power of Four / Lũy Thừa Của Bốn

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Power of Two](https://leetcode.com/problems/power-of-two) | [Power of Three](https://leetcode.com/problems/power-of-three)

---

## 🧠 Intuition / Tư Duy

**Analogy (🇻🇳):** Số lũy thừa của 4 (1, 4, 16, 64...) trong nhị phân chỉ có **một bit là 1**, và bit đó **luôn ở vị trí chẵn** (0, 2, 4...). Giống như viên đá trên bàn cờ: chỉ có một viên, và viên đó luôn ở ô trắng (chẵn). Mặt nạ `0x55555555` = `0101...01` chọn đúng các bit ở vị trí chẵn.

**Pattern Recognition:**

- Signal: "power of 4" → hai điều kiện: **power of 2** + **bit ở vị trí chẵn**
- Bước 1: `n > 0 && (n & (n-1)) === 0` — chỉ có một bit (power of 2)
- Bước 2: `n & 0x55555555 !== 0` — bit đó ở vị trí chẵn (0, 2, 4, ...)
- Cách khác: `(n-1) % 3 === 0` vì `4^k ≡ 1 (mod 3)` với mọi k ≥ 0

**Visual — bit position check:**

```
          bit: ...8  6  4  2  0
mask 0x55:          01 01 01 01  (even positions)

n =  1 → 00001  pos 0 even ✓   1 & 0x55 = 1  ≠ 0 ✓
n =  4 → 00100  pos 2 even ✓   4 & 0x55 = 4  ≠ 0 ✓
n = 16 → 10000  pos 4 even ✓  16 & 0x55 = 16 ≠ 0 ✓
n =  2 → 00010  pos 1 odd  ✗   2 & 0x55 = 0  = 0 ✗
n =  8 → 01000  pos 3 odd  ✗   8 & 0x55 = 0  = 0 ✗
```

---

## Problem Description

Given an integer `n`, return `true` if it is a power of four, otherwise `false`. There exists an integer `x` such that `n == 4^x`. ([LeetCode 342](https://leetcode.com/problems/power-of-four))

Difficulty: Easy | Acceptance: 49.5%

- **Example 1**: n=16 → `true` (4^2 = 16)
- **Example 2**: n=5 → `false`
- **Example 3**: n=1 → `true` (4^0 = 1)

Constraints: `-2^31 ≤ n ≤ 2^31 - 1`

---

## 📝 Interview Tips

1. **Clarify**: "n có thể âm không? 0 là lũy thừa của 4 không?" / n ≤ 0 always returns false
2. **Two-step bit check**: "Bước 1: power of 2; Bước 2: bit ở vị trí chẵn" / Two separate conditions combined with AND
3. **Mask 0x55555555**: "= 01010101...01 — chọn các bit vị trí chẵn" / Alternating mask selects even-index bits
4. **Mod 3 trick**: "`4^k mod 3 = 1` → `(n-1) % 3 == 0` là điều kiện bổ sung cho power of 2" / Mathematical shortcut
5. **Edge cases**: "n=0 → false; n=1 → true (4^0); n=2,8 → false (powers of 2 but not 4)" / 2 and 8 are tricky
6. **Follow-up**: "Dùng loop chia 4 liên tiếp — dễ hiểu hơn nhưng O(log n)" / Loop approach is clearer for interviews

---

## Solutions

```typescript
/**
 * Solution 1: Loop — Divide by 4
 * Time: O(log n)
 * Space: O(1)
 */
function isPowerOfFourLoop(n: number): boolean {
  if (n <= 0) return false;
  while (n > 1) {
    if (n % 4 !== 0) return false;
    n = Math.floor(n / 4);
  }
  return true;
}

/**
 * Solution 2: Bit Manipulation — O(1)
 * Time: O(1)
 * Space: O(1)
 *
 * Condition 1: n > 0
 * Condition 2: n & (n-1) === 0  →  exactly one set bit (is a power of 2)
 * Condition 3: n & 0x55555555 !== 0  →  the set bit is at an even position
 */
function isPowerOfFour(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0 && (n & 0x55555555) !== 0;
}

/**
 * Solution 3: Math — Modulo 3
 * Time: O(1)
 * Space: O(1)
 *
 * 4^k = (3+1)^k ≡ 1^k = 1 (mod 3)
 * So 4^k - 1 is divisible by 3.
 */
function isPowerOfFourMath(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0 && (n - 1) % 3 === 0;
}

// === Test Cases ===
console.log(isPowerOfFour(16)); // true  (4^2)
console.log(isPowerOfFour(5)); // false
console.log(isPowerOfFour(1)); // true  (4^0)
console.log(isPowerOfFour(0)); // false
console.log(isPowerOfFour(8)); // false (2^3 but not power of 4)
console.log(isPowerOfFour(64)); // true  (4^3)
```

---

## 🔗 Related Problems

- [Power of Two](https://leetcode.com/problems/power-of-two) — simpler prerequisite: single set bit check
- [Power of Three](https://leetcode.com/problems/power-of-three) — no bit trick; use 3^19 = 1162261467 modulo
- [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits) — count all set bits (Hamming weight)
- [Counting Bits](https://leetcode.com/problems/counting-bits) — DP + bit patterns for range [0..n]
- [Power of Four — LeetCode](https://leetcode.com/problems/power-of-four) — problem page
