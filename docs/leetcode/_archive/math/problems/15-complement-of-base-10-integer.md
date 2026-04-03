---
layout: page
title: "Complement of Base 10 Integer"
difficulty: Easy
category: Math
tags: [Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/complement-of-base-10-integer"
---

# Complement of Base 10 Integer / Bù Của Số Nguyên Cơ Số 10

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Number Complement](https://leetcode.com/problems/number-complement) | [Missing Number](https://leetcode.com/problems/missing-number)

---

## 🧠 Intuition / Tư Duy

**Analogy (🇻🇳):** "Bù" (complement) của một số trong nhị phân là đảo tất cả các bit — 0 thành 1, 1 thành 0. Nhưng chúng ta chỉ đảo **các bit có nghĩa** (từ bit cao nhất đến bit 0), không phải tất cả 32 bit. Giống như gương soi: `5 = 101` → bù = `010` = 2. Mặt nạ `mask = (1 << bit_length) - 1` chọn đúng các bit cần đảo, rồi XOR với mask.

**Pattern Recognition:**

- Signal: "flip all bits" + "only significant bits" → tạo mặt nạ = `(1 << bitLength) - 1`, rồi `n XOR mask`
- Số bit cần thiết: `Math.floor(Math.log2(n)) + 1` hoặc duyệt shift
- XOR với mask đảo chính xác những bit cần thiết
- Edge case đặc biệt: `n = 0` → không có bit nào → trả về 1 (theo định nghĩa)

**Visual — n=5 (101):**

```
n      =  5  =  101
bitLen =  3
mask   = (1 << 3) - 1 = 111

complement = n XOR mask
           = 101
           XOR
             111
           -----
             010  = 2

n=6 (110): mask = 111, 110 XOR 111 = 001 = 1
n=1 (1):   mask = 001, 001 XOR 001 = 000 = 0
n=0:       special case → return 1
```

---

## Problem Description

The **complement** of an integer is obtained by flipping all bits in its binary representation. Given a non-negative integer `n`, return its complement. ([LeetCode 1009](https://leetcode.com/problems/complement-of-base-10-integer))

Difficulty: Easy | Acceptance: 60.7%

- **Example 1**: n=5 → `2` (5 = `101` → complement = `010` = 2)
- **Example 2**: n=7 → `0` (7 = `111` → complement = `000` = 0)
- **Example 3**: n=10 → `5` (10 = `1010` → complement = `0101` = 5)

Constraints: `0 ≤ n < 2^31`

---

## 📝 Interview Tips

1. **Clarify**: "n=0 thì sao? (định nghĩa: complement là 1)" / n=0 is the edge case — return 1 by convention
2. **Mask approach**: "Tạo mask = tất cả bit 1 cùng độ dài với n, rồi XOR" / Create all-ones mask of same length, XOR with n
3. **Bit length**: "`Math.floor(Math.log2(n)) + 1` hoặc loop shift để đếm số bit" / Two ways to compute bit length
4. **XOR property**: "`a XOR 1 = ~a` (flip bit); `a XOR 0 = a` (keep bit)" / XOR with 1 flips, XOR with 0 preserves
5. **Edge case n=0**: "log2(0) = -Infinity, nên cần xử lý riêng" / Math.log2(0) breaks — always special-case n=0
6. **Follow-up**: "Bài Number Complement (LeetCode 476) là bài giống hệt" / LC 476 is identical — same solution works

---

## Solutions

```typescript
/**
 * Solution 1: Bit Shift — Build Mask
 * Time: O(log n) — count bits via shifting
 * Space: O(1)
 */
function bitwiseComplementShift(n: number): number {
  if (n === 0) return 1;

  let mask = 0;
  let temp = n;
  while (temp > 0) {
    mask = (mask << 1) | 1; // append a 1-bit to mask
    temp >>= 1;
  }

  return n ^ mask;
}

/**
 * Solution 2: Log2 — Compute Bit Length Directly
 * Time: O(1)
 * Space: O(1)
 *
 * bitLength = floor(log2(n)) + 1
 * mask = (1 << bitLength) - 1  =  all 1s of that length
 * complement = n XOR mask
 */
function bitwiseComplement(n: number): number {
  if (n === 0) return 1;

  const bitLength = Math.floor(Math.log2(n)) + 1;
  const mask = (1 << bitLength) - 1; // all 1s with same bit length as n

  return n ^ mask;
}

/**
 * Solution 3: Highest Bit Scan
 * Time: O(log n)
 * Space: O(1)
 *
 * Find the highest set bit, build a mask of that many 1s.
 */
function bitwiseComplementScan(n: number): number {
  if (n === 0) return 1;

  let highBit = 1;
  while (highBit <= n) highBit <<= 1; // highBit is the first power of 2 > n
  const mask = highBit - 1; // all 1s up to bit length of n

  return n ^ mask;
}

// === Test Cases ===
console.log(bitwiseComplement(5)); // 2  (101 → 010)
console.log(bitwiseComplement(7)); // 0  (111 → 000)
console.log(bitwiseComplement(10)); // 5  (1010 → 0101)
console.log(bitwiseComplement(0)); // 1  (special case)
console.log(bitwiseComplement(1)); // 0  (1 → 0)
```

---

## 🔗 Related Problems

- [Number Complement](https://leetcode.com/problems/number-complement) — identical problem (LeetCode 476)
- [Missing Number](https://leetcode.com/problems/missing-number) — XOR trick to find the missing element
- [Single Number](https://leetcode.com/problems/single-number) — XOR to cancel pairs and find unique element
- [Reverse Bits](https://leetcode.com/problems/reverse-bits) — bit manipulation on 32-bit integer
- [Complement of Base 10 Integer — LeetCode](https://leetcode.com/problems/complement-of-base-10-integer) — problem page
