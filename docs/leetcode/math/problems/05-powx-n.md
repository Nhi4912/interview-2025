---
layout: page
title: "Pow(x, n)"
difficulty: Medium
category: Math
tags: [Math, Recursion]
leetcode_url: "https://leetcode.com/problems/powx-n"
---

# Pow(x, n) / Lũy Thừa x Mũ n

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Exponentiation
> **Frequency**: ⭐ Tier 2 — Gặp ở Google, Amazon, Bloomberg
> **See also**: [Sqrt(x)](https://leetcode.com/problems/sqrtx) | [Super Pow](https://leetcode.com/problems/super-pow)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tính 2^10. Thay vì nhân 2 mười lần, dùng "bình phương liên tiếp": 2^10 = (2^5)^2, 2^5 = 2×(2^2)^2. Mỗi bước giảm n một nửa → từ O(n) xuống O(log n). Đây là kỹ thuật **Binary Exponentiation** (Fast Power).

**Pattern Recognition:**

- Signal: tính x^n với n lớn, yêu cầu hiệu quả → **Binary Exponentiation**
- n chẵn: x^n = (x²)^(n/2); n lẻ: x^n = x × x^(n-1)
- Xử lý n âm: x^(-n) = (1/x)^n

**Visual — myPow(2, 10), n=10 = 0b1010:**

```
Iterative bit-by-bit (n=10 = binary 1010):
  i=0: bit=0 → skip,    x=2→4,   n=10→5
  i=1: bit=1 → res*=4,  x=4→16,  n=5→2
  i=2: bit=0 → skip,    x=16→256,n=2→1
  i=3: bit=1 → res*=256 → res = 4×256 = 1024 ✅

Recursive tree:
  pow(2,10) = pow(2,5)²
    pow(2,5) = 2 × pow(2,4)
      pow(2,4) = pow(2,2)² = ((2²)²) = 16
```

---

## Problem Description

Implement `pow(x, n)` which calculates `x` raised to the power `n`. Handle negative exponents and the full 32-bit integer range for `n`. Do not use built-in `Math.pow`.

```
Example 1: x=2.00000, n=10    → 1024.00000
Example 2: x=2.10000, n=3     → 9.26100
Example 3: x=2.00000, n=-2    → 0.25000  (= 1/2² = 1/4)
```

Constraints: `-100.0 < x < 100.0`, `-2^31 <= n <= 2^31-1`, answer fits 64-bit float.

---

## 📝 Interview Tips

1. **Clarify**: "n có thể âm và bằng 0 không?" / Confirm n=0 → 1, n<0 → 1/x^|n|.
2. **Brute force**: Loop n lần nhân — O(n), TLE với n = 2^31; dùng để explain thinking.
3. **Key insight**: x^n = (x²)^(n/2) — mỗi bước giảm n một nửa → O(log n).
4. **Overflow trap**: n = -2^31 thì `-n` overflow int32; trong JS `Math.abs(n)` hoặc `-n` an toàn do float.
5. **Iterative vs Recursive**: Iterative tránh stack overflow với n rất lớn.
6. **Edge cases**: x=0 (n>0 → 0), x=1 (→1), x=-1 (→±1 tùy chẵn/lẻ).

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — repeat multiplication
 * Time: O(|n|) — one multiply per step
 * Space: O(1)
 * ⚠️ TLE on LeetCode for large n; used for comparison only
 */
function myPow1(x: number, n: number): number {
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }
  let result = 1;
  for (let i = 0; i < n; i++) result *= x;
  return result;
}

/**
 * Solution 2: Fast Exponentiation — Recursive
 * Time: O(log n) — problem halves each recursive call
 * Space: O(log n) — recursion call stack depth
 *
 * Recurrence:
 *   pow(x, 0) = 1
 *   pow(x, n) = pow(x², n/2)      if n is even
 *   pow(x, n) = x × pow(x, n-1)   if n is odd
 */
function myPow2(x: number, n: number): number {
  if (n === 0) return 1;
  if (n < 0) return myPow2(1 / x, -n);
  if (n % 2 === 0) {
    const half = myPow2(x, n / 2);
    return half * half; // compute once, square — don't call twice!
  }
  return x * myPow2(x, n - 1);
}

/**
 * Solution 3: Iterative Binary Exponentiation (optimal)
 * Time: O(log n) — process each bit of n
 * Space: O(1) — no recursion stack
 *
 * Idea: n in binary tells which powers of x to multiply.
 *   x^13 = x^(1101₂) = x^8 × x^4 × x^1
 *   → accumulate x² at each step; multiply into result when bit=1
 */
function myPow(x: number, n: number): number {
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }
  let result = 1;
  while (n > 0) {
    if (n & 1) result *= x; // current LSB set → multiply base into result
    x *= x; // square base for the next bit position
    n >>= 1; // shift n right (process next bit)
  }
  return result;
}

// === Test Cases ===
console.log(myPow(2.0, 10)); // 1024
console.log(myPow(2.1, 3)); // 9.261000000000001
console.log(myPow(2.0, -2)); // 0.25
console.log(myPow(1.0, 2147483647)); // 1
console.log(myPow(-1.0, -2147483648)); // 1  (even power of -1)
console.log(myPow(0.0, 5)); // 0
console.log(myPow2(2.0, 10)); // 1024
console.log(myPow1(2.0, 5)); // 32
```

---

## 🔗 Related Problems

| Problem                                                                       | Relationship                                     |
| ----------------------------------------------------------------------------- | ------------------------------------------------ |
| [50. Pow(x, n)](https://leetcode.com/problems/powx-n/)                        | This problem                                     |
| [69. Sqrt(x)](https://leetcode.com/problems/sqrtx/)                           | Binary search / Newton — similar O(log n)        |
| [372. Super Pow](https://leetcode.com/problems/super-pow/)                    | Modular exponentiation — same binary exp pattern |
| [1922. Count Good Numbers](https://leetcode.com/problems/count-good-numbers/) | Fast modular pow required                        |
| [231. Power of Two](https://leetcode.com/problems/power-of-two/)              | Bit manipulation — related power concept         |
