---
layout: page
title: "Power of Three"
difficulty: Easy
category: Math
tags: [Math, Recursion]
leetcode_url: "https://leetcode.com/problems/power-of-three/"
---

# Power of Three / Lũy Thừa Của Ba

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Iterative Division / Math trick
> **Frequency**: 📗 Tier 3 — Câu hỏi toán nhẹ, thường check tư duy O(1) approach
> **See also**: [Pow(x,n)](./02-pow-x-n.md) | [Sqrt(x)](./03-sqrt-x.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có một sợi dây 27cm và muốn kiểm tra nó có phải là bội lũy thừa của 3 không. Cách đơn giản: cắt đều thành 3 phần, rồi lấy một phần cắt tiếp thành 3... Nếu sau mỗi lần cắt vẫn chia đều được và cuối còn đúng 1cm — đó là lũy thừa của 3. Nếu một lần nào không chia được đều, thì không phải.

**Pattern Recognition:**

- Signal: check if n is a power of k → **iterative division** `while (n % k === 0) n /= k; return n === 1`
- O(1) trick: max power of 3 trong 32-bit = `3^19 = 1162261467`. Nếu n chia hết 1162261467 → là lũy thừa 3
- Không dùng logarithm: `Math.log(n)/Math.log(3)` có floating point error với n lớn

**Visual — n=27:**

```
27 % 3 === 0 → n = 9
 9 % 3 === 0 → n = 3
 3 % 3 === 0 → n = 1
 n === 1 → true ✅

n=6:
 6 % 3 === 0 → n = 2
 2 % 3 !== 0 → stop
 n === 2 ≠ 1 → false ✅
```

---

## Problem Description

Given integer `n`, return `true` if it is a power of three. An integer is a power of three if there exists integer `x` such that `n == 3^x`.

```
Example 1: n=27   → true   (27 = 3³)
Example 2: n=0    → false  (no x where 3^x = 0)
Example 3: n=-1   → false  (no x where 3^x = -1)
Example 4: n=9    → true   (9 = 3²)
```

Constraints: `-2^31 <= n <= 2^31 - 1`

---

## 📝 Interview Tips

1. **n ≤ 0 là false ngay**: lũy thừa của 3 luôn dương — check đầu tiên
2. **Không dùng logarithm**: `Math.log(243)/Math.log(3)` = `4.999999...` → `Math.round` có thể sai — floating point trap!
3. **O(1) math trick**: max 3^x fit 32-bit là 3^19 = 1162261467. Nếu `1162261467 % n === 0` và `n > 0` → true
4. **Trick này chỉ work với prime base**: 3 là số nguyên tố nên mọi ước của 3^19 đều là lũy thừa của 3
5. **Follow-up**: "power of 4 không dùng loop?" → `n > 0 && (n & (n-1)) === 0 && n % 3 !== 0`
6. **Pattern tổng quát**: isPowerOf(n, base) — iterative division work với mọi base

---

## Solutions

```typescript
/**

- Solution 1: Iterative Division
- Time O(log n), Space O(1)
- Keep dividing by 3 while divisible; result must be 1.
  */
  function isPowerOfThreeIter(n: number): boolean {
  if (n <= 0) return false;
  while (n % 3 === 0) n = Math.floor(n / 3);
  return n === 1;
  }

/**

- Solution 2: Math Trick — O(1) using max power of 3
- Time O(1), Space O(1)
-
- 3^19 = 1162261467 is the largest power of 3 within 32-bit int.
- Because 3 is prime, all its divisors are also powers of 3.
- So: n is a power of 3 iff 3^19 % n === 0 (and n > 0).
  */
  function isPowerOfThree(n: number): boolean {
  // 3^19 = 1162261467 (largest power of 3 in 32-bit signed int)
  return n > 0 && 1162261467 % n === 0;
  }

// --- Quick inline tests ---
console.log(isPowerOfThree(27) === true); // true
console.log(isPowerOfThree(0) === false); // true
console.log(isPowerOfThree(-1) === false); // true
console.log(isPowerOfThree(9) === true); // true
console.log(isPowerOfThree(45) === false); // true (45 = 9×5)
```

---

## 🔗 Related Problems

| Problem                                                                       | Relationship                               |
| ----------------------------------------------------------------------------- | ------------------------------------------ |
| [326. Power of Three](https://leetcode.com/problems/power-of-three/)          | This problem                               |
| [231. Power of Two](https://leetcode.com/problems/power-of-two/)              | Same pattern: `n > 0 && (n & (n-1)) === 0` |
| [342. Power of Four](https://leetcode.com/problems/power-of-four/)            | Power of 2 + extra condition               |
| [50. Pow(x, n)](https://leetcode.com/problems/powx-n/)                        | Compute power, this problem checks it      |
| [1922. Count Good Numbers](https://leetcode.com/problems/count-good-numbers/) | Modular exponentiation follow-up           |
