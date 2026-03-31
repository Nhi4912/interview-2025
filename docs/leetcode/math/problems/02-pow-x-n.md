---
layout: page
title: "Pow(x, n)"
difficulty: Medium
category: Math
tags: [Math, Recursion, Binary Exponentiation]
leetcode_url: "https://leetcode.com/problems/powx-n/"
---

# Pow(x, n) / Lũy Thừa x Mũ n

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Fast Exponentiation (Divide & Conquer)
> **Frequency**: ⭐ Tier 2 — Pattern Binary Exponentiation xuất hiện trong nhiều bài toán crypto, matrix
> **See also**: [Sqrt(x)](./03-sqrt-x.md) | [Power of Three](./03-power-of-three.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Thay vì nhân x với chính nó n lần (mất O(n) bước), hãy nghĩ như khi tính 2^8: thay vì 2×2×2×2×2×2×2×2, bạn tính 2^8 = (2^4)^2 = ((2^2)^2)^2 — chỉ 3 phép nhân. Mỗi lần "gấp đôi số mũ", số bước giảm một nửa, tổng chỉ cần O(log n) bước.

**Pattern Recognition:**

- Signal: compute `x^n` efficiently → **Binary Exponentiation** (squaring)
- Xem n ở dạng nhị phân: `x^13 = x^(1101₂) = x^8 × x^4 × x^1` — tích theo các bit 1
- Negative n: `x^(-n) = 1 / x^n` — tính phần dương trước, đảo cuối
- n lẻ: nhân thêm x một lần trước khi giảm n về chẵn

**Visual — myPow(2, 13), n=13=1101₂:**

```
bit-by-bit (iterate on bits of n):

base=2, result=1, n=13 (binary: 1101)

n=13 (odd):  result *= 2    → result=2,    base=4,  n=6
n=6  (even): result unchanged→ result=2,   base=16, n=3
n=3  (odd):  result *= 16   → result=32,   base=256,n=1
n=1  (odd):  result *= 256  → result=8192, base=...,n=0

2^13 = 8192 ✅
```

---

## Problem Description

Implement `pow(x, n)` — calculate x raised to power n (`x^n`). No built-in `Math.pow`.

```
Example 1: x=2.0,  n=10  → 1024.0
Example 2: x=2.1,  n=3   → 9.261
Example 3: x=2.0,  n=-2  → 0.25   (= 1/4)
```

Constraints: `-100.0 < x < 100.0`, `-2^31 <= n <= 2^31-1`

---

## 📝 Interview Tips

1. **Brute force O(n) trả lời trước**: nhân x lặp n lần — sau đó giải thích optimize
2. **n có thể âm**: `x^(-n) = 1/x^n` — đừng quên xử lý trước khi loop
3. **Bit trick**: `if (n & 1)` check lẻ/chẵn nhanh hơn `n % 2` — optional nhưng đẹp
4. **Integer overflow**: n có thể là -2^31 → `Math.abs(-2^31)` overflow trong số nguyên 32-bit (JS dùng float64 nên OK, nhưng cần mention)
5. **Khi x=0**: trả về 0 (nếu n>0); undefined/error nếu n<0 (chia 0)
6. **Pattern xuất hiện trong**: matrix exponentiation cho Fibonacci, RSA modular pow

---

## Solutions

```typescript
/**

- Solution 1: Naive Loop (Brute Force)
- Time O(n), Space O(1) — TLE for large n
  _/
  function myPowBrute(x: number, n: number): number {
  if (n === 0) return 1;
  let result = 1;
  const absN = Math.abs(n);
  for (let i = 0; i < absN; i++) result _= x;
  return n < 0 ? 1 / result : result;
  }

/**

- Solution 2: Fast Exponentiation — Iterative (Optimal)
- Time O(log n), Space O(1)
-
- Process each bit of n. When the bit is 1, multiply result
- by current base. Always square the base for next bit.
  */
  function myPow(x: number, n: number): number {
  if (n === 0) return 1;

let absN = Math.abs(n);
let result = 1;
let base = x;

while (absN > 0) {
if (absN & 1) result _= base; // bit is 1 → include this power
base _= base; // square base for next bit position
absN >>= 1; // shift to next bit
}

return n < 0 ? 1 / result : result;
}

// --- Quick inline tests ---
console.log(Math.abs(myPow(2.0, 10) - 1024.0) < 1e-5); // true
console.log(Math.abs(myPow(2.1, 3) - 9.261) < 1e-3); // true
console.log(Math.abs(myPow(2.0, -2) - 0.25) < 1e-5); // true
console.log(myPow(1.0, 2147483647) === 1.0); // true
```

---

## 🔗 Related Problems

| Problem                                                              | Relationship                           |
| -------------------------------------------------------------------- | -------------------------------------- |
| [50. Pow(x, n)](https://leetcode.com/problems/powx-n/)               | This problem                           |
| [69. Sqrt(x)](https://leetcode.com/problems/sqrtx/)                  | Same binary-search-on-answer idea      |
| [231. Power of Two](https://leetcode.com/problems/power-of-two/)     | Special case: check if n is power of 2 |
| [326. Power of Three](https://leetcode.com/problems/power-of-three/) | Check power without division           |
| [372. Super Pow](https://leetcode.com/problems/super-pow/)           | Modular exponentiation extension       |
