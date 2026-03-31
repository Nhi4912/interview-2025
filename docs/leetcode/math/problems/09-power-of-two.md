---
layout: page
title: "Power of Two"
difficulty: Easy
category: Math
tags: [Math, Bit Manipulation, Recursion]
leetcode_url: "https://leetcode.com/problems/power-of-two"
---

# Power of Two / Lũy Thừa Của Hai

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Power of Four](https://leetcode.com/problems/power-of-four) | [Power of Three](https://leetcode.com/problems/power-of-three)

---

## 🧠 Intuition / Tư Duy

**Analogy (🇻🇳):** Số lũy thừa của 2 trong nhị phân chỉ có đúng **một bit là 1** — như tờ tiền mệnh giá 1, 2, 4, 8, 16... luôn là một đồng đơn lẻ. Mẹo bit: `n & (n-1)` xóa bit thấp nhất. Nếu kết quả là 0, chứng tỏ ban đầu chỉ có một bit — là lũy thừa của 2.

**Pattern Recognition:**

- Signal: "power of 2" + "binary" → **bit trick**: `n > 0 && (n & (n-1)) === 0`
- Powers of 2: `1, 10, 100, 1000, ...` — exactly one `1` bit in binary
- `n & (n-1)` xóa bit thấp nhất; nếu kết quả là 0, ban đầu chỉ có một bit
- Phải kiểm tra `n > 0`: 0 và số âm không phải lũy thừa của 2

**Visual — bit patterns:**

```
n =  1  →  0001   n-1 = 0000   n & (n-1) = 0  → ✓ power of 2
n =  2  →  0010   n-1 = 0001   n & (n-1) = 0  → ✓ power of 2
n =  4  →  0100   n-1 = 0011   n & (n-1) = 0  → ✓ power of 2
n =  6  →  0110   n-1 = 0101   n & (n-1) = 4  → ✗ not power of 2
n =  3  →  0011   n-1 = 0010   n & (n-1) = 2  → ✗ not power of 2
```

---

## Problem Description

Given an integer `n`, return `true` if it is a power of two, otherwise `false`. There exists an integer `x` such that `n == 2^x`. ([LeetCode 231](https://leetcode.com/problems/power-of-two))

Difficulty: Easy | Acceptance: 48.4%

- **Example 1**: n=1 → `true` (2^0 = 1)
- **Example 2**: n=16 → `true` (2^4 = 16)
- **Example 3**: n=3 → `false`

Constraints: `-2^31 ≤ n ≤ 2^31 - 1`

---

## 📝 Interview Tips

1. **Clarify**: "n có thể âm hoặc bằng 0 không?" / Can n be negative or zero? (both always return false)
2. **Loop approach**: "Chia đôi liên tục cho đến khi bằng 1 hoặc lẻ — O(log n)" / Divide by 2 repeatedly
3. **Bit trick**: "`n & (n-1) == 0` kiểm tra đúng một bit — O(1), cần nhớ" / Single-bit check, O(1), worth memorizing
4. **Edge cases**: "n=0 → false; n=1 → true (2^0); n âm → false vì bit cao nhất là 1" / Zero and negatives are never powers of 2
5. **Float trap**: "`Math.log2(n) % 1 === 0` có floating-point error với n lớn" / Avoid log2 — imprecise for large n
6. **Follow-up**: "Power of 3 không có bit trick tương tự — dùng max power mod" / Power of 3 uses modulo with 3^19

---

## Solutions

```typescript
/**
 * Solution 1: Loop — Divide by 2
 * Time: O(log n)
 * Space: O(1)
 */
function isPowerOfTwoLoop(n: number): boolean {
  if (n <= 0) return false;
  while (n > 1) {
    if (n % 2 !== 0) return false;
    n = Math.floor(n / 2);
  }
  return true;
}

/**
 * Solution 2: Bit Manipulation — O(1)
 * Time: O(1)
 * Space: O(1)
 *
 * Powers of 2 have exactly one bit set in binary.
 * n & (n-1) clears the lowest set bit — if result is 0, only one bit existed.
 */
function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

/**
 * Solution 3: Recursive
 * Time: O(log n)
 * Space: O(log n) — call stack depth
 */
function isPowerOfTwoRecursive(n: number): boolean {
  if (n <= 0) return false;
  if (n === 1) return true;
  if (n % 2 !== 0) return false;
  return isPowerOfTwoRecursive(n / 2);
}

// === Test Cases ===
console.log(isPowerOfTwo(1)); // true  (2^0)
console.log(isPowerOfTwo(16)); // true  (2^4)
console.log(isPowerOfTwo(3)); // false
console.log(isPowerOfTwo(0)); // false
console.log(isPowerOfTwo(-4)); // false
console.log(isPowerOfTwo(1024)); // true  (2^10)
```

---

## 🔗 Related Problems

- [Power of Four](https://leetcode.com/problems/power-of-four) — extends bit trick: single bit at even position
- [Power of Three](https://leetcode.com/problems/power-of-three) — no bit trick; use modulo with max power of 3
- [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits) — count set bits (Hamming weight)
- [Reverse Bits](https://leetcode.com/problems/reverse-bits) — bit manipulation fundamentals
- [Power of Two — LeetCode](https://leetcode.com/problems/power-of-two) — problem page
