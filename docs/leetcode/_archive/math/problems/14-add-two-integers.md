---
layout: page
title: "Add Two Integers"
difficulty: Easy
category: Math
tags: [Math]
leetcode_url: "https://leetcode.com/problems/add-two-integers"
---

# Add Two Integers / Cộng Hai Số Nguyên

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math — Arithmetic
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers) | [Add Binary](https://leetcode.com/problems/add-binary)

---

## 🧠 Intuition / Tư Duy

**Analogy (🇻🇳):** Đây là bài cơ bản nhất — chỉ cần trả về `num1 + num2`. Tuy nhiên, phiên bản nâng cao "Sum of Two Integers" yêu cầu cộng **không dùng toán tử `+`**, dùng bit manipulation: XOR cho tổng không nhớ, AND shift trái cho số nhớ, lặp cho đến khi hết số nhớ.

**Pattern Recognition:**

- Bài này: trực tiếp `return num1 + num2` — kiểm tra tư duy cơ bản
- Phiên bản nâng cao (LeetCode 371): dùng XOR và AND với carry
- `a XOR b` = tổng các bit không có carry
- `(a AND b) << 1` = carry
- Lặp cho đến khi carry = 0

**Visual — Bit addition (num1=5=101, num2=3=011):**

```
Standard:   5 + 3 = 8

Bit method:
Round 1:  sum  = 101 XOR 011 = 110 (6)
          carry= (101 AND 011) << 1 = 001 << 1 = 010 (2)

Round 2:  sum  = 110 XOR 010 = 100 (4)
          carry= (110 AND 010) << 1 = 010 << 1 = 100 (4)

Round 3:  sum  = 100 XOR 100 = 000 (0)
          carry= (100 AND 100) << 1 = 100 << 1 = 1000 (8)

Round 4:  sum  = 000 XOR 1000 = 1000 (8)
          carry= 0  → done! Result = 8 ✓
```

---

## Problem Description

Given two integers `num1` and `num2`, return the **sum** of the two integers. ([LeetCode 2235](https://leetcode.com/problems/add-two-integers))

Difficulty: Easy | Acceptance: 88.1%

- **Example 1**: num1=12, num2=5 → `17`
- **Example 2**: num1=-10, num2=4 → `-6`
- **Example 3**: num1=0, num2=0 → `0`

Constraints: `-100 ≤ num1, num2 ≤ 100`

---

## 📝 Interview Tips

1. **Clarify**: "Có được dùng toán tử `+` không?" / Confirm if the `+` operator is allowed (it is here)
2. **Trivial answer**: "Bài này chỉ cần `return num1 + num2`" / This problem is intentionally trivial — one line
3. **Upgraded version**: "Nếu không dùng `+`: dùng XOR cho sum, AND+shift cho carry" / LeetCode 371 is the real challenge
4. **Negative numbers**: "Trong JS, XOR của số âm vẫn hoạt động nhờ two's complement" / Bitwise works with negative numbers in JS via 32-bit int
5. **Edge cases**: "num1=0, num2=0 → 0; âm + dương → kiểm tra dấu" / Both zeros and mixed signs work naturally
6. **Follow-up**: "Cộng không dùng +/-? Dùng bit XOR + carry loop" / Bit-manipulation addition is the interesting variant

---

## Solutions

```typescript
/**
 * Solution 1: Direct Addition (correct and sufficient for this problem)
 * Time: O(1)
 * Space: O(1)
 */
function sum(num1: number, num2: number): number {
  return num1 + num2;
}

/**
 * Solution 2: Bit Manipulation — No '+' Operator (bonus: LeetCode 371 style)
 * Time: O(1) — at most 32 iterations for 32-bit integers
 * Space: O(1)
 *
 * XOR gives sum without carry.
 * (a & b) << 1 gives the carry.
 * Repeat until no carry remains.
 */
function sumBitwise(num1: number, num2: number): number {
  let a = num1;
  let b = num2;
  while (b !== 0) {
    const carry = (a & b) << 1; // carry bits shifted left
    a = a ^ b; // sum without carry
    b = carry;
  }
  return a;
}

/**
 * Solution 3: Recursive Bit Addition
 * Time: O(1)
 * Space: O(1) — bounded recursion depth
 */
function sumRecursive(num1: number, num2: number): number {
  if (num2 === 0) return num1;
  return sumRecursive(num1 ^ num2, (num1 & num2) << 1);
}

// === Test Cases ===
console.log(sum(12, 5)); // 17
console.log(sum(-10, 4)); // -6
console.log(sum(0, 0)); // 0
console.log(sumBitwise(12, 5)); // 17 (bit manipulation)
console.log(sumBitwise(-10, 4)); // -6 (works with negatives via two's complement)
```

---

## 🔗 Related Problems

- [Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers) — same idea but explicitly forbids using `+` or `-`
- [Add Binary](https://leetcode.com/problems/add-binary) — string-based binary addition with carry
- [Add Strings](https://leetcode.com/problems/add-strings) — digit-by-digit string addition
- [Plus One](https://leetcode.com/problems/plus-one) — array-based increment with carry propagation
- [Add Two Integers — LeetCode](https://leetcode.com/problems/add-two-integers) — problem page
