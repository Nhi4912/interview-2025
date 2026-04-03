---
layout: page
title: "Divide Two Integers"
difficulty: Medium
category: Math
tags: [Math, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/divide-two-integers"
---

# Divide Two Integers / Chia Hai Số Nguyên Không Dùng Phép Chia

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation / Exponential Growth
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Add Binary](https://leetcode.com/problems/add-binary)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn không được dùng `/` nhưng được dùng `-` và dịch bit. Thay vì trừ từng 1 một (chậm như đếm từng tờ tiền), bạn tăng gấp đôi số trừ mỗi bước — như đếm theo xấp 2, 4, 8, 16... rồi trừ cục lớn nhất vừa vặn.

**Pattern:** Exponential doubling — tìm `divisor * 2^k` lớn nhất ≤ dividend, tích lũy quotient, lặp lại với phần dư → O(log²n).

```
dividend=10, divisor=3  (both converted to negative for safety)

Round 1: try doubling 3 → 6 ≤ 10 ✅ → 12 > 10 ❌
  Subtract 6, quotient += 2, remainder = 4

Round 2: try doubling 3 → 6 > 4 ❌
  Subtract 3, quotient += 1, remainder = 1

1 < 3 → stop.  Total = 3 ✅
```

---

Chia `dividend` cho `divisor` **không dùng `*`, `/`, `%`**. Kết quả làm tròn về phía 0. Nếu vượt phạm vi 32-bit signed `[-2³¹, 2³¹-1]`, trả về `2³¹-1`.

- `dividend = 10, divisor = 3` → `3`
- `dividend = 7, divisor = -3` → `-2`
- `dividend = -2147483648, divisor = -1` → `2147483647` (overflow clamp)

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Overflow case quan trọng nhất**: `-2^31 / -1 = 2^31 > INT_MAX` → phải clamp về `INT_MAX`
- 🇺🇸 **Work in negatives**: converting both to negative avoids `Math.abs(INT_MIN)` overflow
- 🇻🇳 **Dịch bit `+= tempB`**: tương đương `*= 2` mà không dùng phép nhân
- 🇺🇸 **Sign**: negative result only when exactly one operand is negative (XOR of signs)
- 🇻🇳 **Naive solution TLE**: O(n/m) — chỉ dùng để giải thích brute force, không submit
- 🇺🇸 **Guard underflow**: check `tempB >= INT_MIN - tempB` before doubling to avoid wrap

---

## Solutions

### Solution 1: Repeated Subtraction — O(dividend/divisor) time, O(1) space

```typescript
/**
 * Naive: subtract divisor one at a time (TLE on large input, shows concept)
 * Time: O(dividend/divisor) | Space: O(1)
 */
function divideNaive(dividend: number, divisor: number): number {
  const INT_MAX = 2147483647;
  if (dividend === -2147483648 && divisor === -1) return INT_MAX;

  const negative = dividend < 0 !== divisor < 0;
  let a = Math.abs(dividend),
    b = Math.abs(divisor);
  let quotient = 0;

  while (a >= b) {
    a -= b;
    quotient++;
  }

  return negative ? -quotient : quotient;
}

// Tests (small inputs only)
console.log(divideNaive(10, 3)); // 3
console.log(divideNaive(7, -3)); // -2
console.log(divideNaive(-2147483648, -1)); // 2147483647
```

### Solution 2: Exponential Growth Subtraction — O(log²n) time, O(1) space ✅ Optimal

```typescript
/**
 * Double the subtraction chunk each step; work in negatives to handle MIN_INT
 * Time: O(log²n) | Space: O(1)
 */
function divide(dividend: number, divisor: number): number {
  const INT_MAX = 2147483647,
    INT_MIN = -2147483648;

  // Only overflow case: -2^31 / -1 = 2^31 which exceeds INT_MAX
  if (dividend === INT_MIN && divisor === -1) return INT_MAX;

  const negative = dividend < 0 !== divisor < 0;

  // Convert to negative so -2^31 stays representable (Math.abs(-2^31) overflows)
  let a = dividend > 0 ? -dividend : dividend;
  let b = divisor > 0 ? -divisor : divisor;
  let quotient = 0;

  // Both a and b are negative; a <= b means |a| >= |b|
  while (a <= b) {
    let tempB = b,
      multiple = 1;

    // Double tempB while it stays within range and still fits into a
    while (tempB >= INT_MIN - tempB && tempB + tempB >= a) {
      tempB += tempB;
      multiple += multiple;
    }

    a -= tempB; // subtract largest valid chunk
    quotient += multiple;
  }

  return negative ? -quotient : quotient;
}

// Tests
console.log(divide(10, 3)); // 3
console.log(divide(7, -3)); // -2
console.log(divide(-2147483648, -1)); // 2147483647
console.log(divide(-2147483648, 1)); // -2147483648
console.log(divide(1, 1)); // 1
console.log(divide(0, 5)); // 0
console.log(divide(100, 10)); // 10
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                        | Difficulty | Pattern              |
| -------------------------------------------------------------- | ---------- | -------------------- |
| [Add Binary](https://leetcode.com/problems/add-binary)         | 🟢 Easy    | Bit manipulation     |
| [Pow(x, n)](https://leetcode.com/problems/powx-n)              | 🟡 Medium  | Exponential doubling |
| [Missing Number](https://leetcode.com/problems/missing-number) | 🟢 Easy    | XOR / Math           |
