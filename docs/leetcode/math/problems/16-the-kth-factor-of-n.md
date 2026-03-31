---
layout: page
title: "The kth Factor of n"
difficulty: Medium
category: Math
tags: [Math, Number Theory]
leetcode_url: "https://leetcode.com/problems/the-kth-factor-of-n"
---

# The kth Factor of n / Ước Số Thứ K Của n

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math — Divisor Enumeration
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Count Primes](https://leetcode.com/problems/count-primes) | [Perfect Number](https://leetcode.com/problems/perfect-number)

---

## 🧠 Intuition / Tư Duy

**Analogy (🇻🇳):** Tìm ước số thứ k của n theo thứ tự tăng dần. Cách 1: duyệt từ 1 đến n — đơn giản O(n). Cách 2: duyệt đến `sqrt(n)` rồi thu thập ước số thành hai danh sách (nhỏ và lớn), kết hợp để có thứ tự — O(√n). Giống như khi tìm ước: 12 có ước `[1,2,3,4,6,12]` — với `sqrt(12)≈3.46`, duyệt đến 3 là đủ.

**Pattern Recognition:**

- Signal: "kth factor in sorted order" → duyệt đến `sqrt(n)`, lưu ước nhỏ và ước lớn tương ứng
- Ước nhỏ `i ≤ sqrt(n)`: thu thập theo thứ tự tăng dần
- Ước lớn `n/i`: thu thập theo thứ tự ngược (từ lớn đến nhỏ theo i)
- Kết hợp: `small_factors + reverse(large_factors)` = toàn bộ ước theo thứ tự tăng dần

**Visual — n=12, k=3:**

```
Duyệt i=1..sqrt(12)≈3.46:
  i=1: 12%1=0 → small=[1],       large=[12]
  i=2: 12%2=0 → small=[1,2],     large=[12,6]
  i=3: 12%3=0 → small=[1,2,3],   large=[12,6,4]

All factors sorted = [1, 2, 3, 4, 6, 12]
                      ↑  ↑  ↑
                      1  2  3  ← k=3 → answer = 3

Brute force: duyệt 1..12, đếm ước, lấy thứ k
```

---

## Problem Description

You are given two positive integers `n` and `k`. Return the `k`th smallest factor of `n`, or `-1` if n has fewer than `k` factors. A factor of `n` is a divisor of `n` including 1 and n itself. ([LeetCode 1492](https://leetcode.com/problems/the-kth-factor-of-n))

Difficulty: Medium | Acceptance: 69.6%

- **Example 1**: n=12, k=3 → `3` (factors: 1,2,3,4,6,12 — 3rd is 3)
- **Example 2**: n=7, k=2 → `7` (factors: 1,7 — 2nd is 7)
- **Example 3**: n=4, k=4 → `-1` (factors: 1,2,4 — only 3 factors)

Constraints: `1 ≤ k ≤ n ≤ 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Factor bao gồm cả 1 và n? k có thể lớn hơn số ước không?" / Factors include 1 and n; return -1 if fewer than k factors
2. **Brute force**: "Duyệt i=1 đến n, đếm ước — O(n), đơn giản và đủ nhanh với n≤1000" / O(n) linear scan is acceptable given constraints
3. **Optimal**: "Duyệt đến sqrt(n), chia ước thành hai danh sách — O(sqrt(n))" / Square root enumeration with two lists
4. **Sorted order**: "Ước nhỏ tăng dần, ước lớn giảm dần (vì i tăng, n/i giảm) — cần đảo ngược" / Large factors are in reverse order and need to be flipped
5. **Perfect square edge**: "Nếu n là số chính phương (i\*i=n), không thêm n/i hai lần" / Avoid double-counting sqrt(n)
6. **Follow-up**: "n rất lớn? Vẫn O(sqrt(n)) — với n=10^9 là ~31623 bước" / Algorithm scales well to large n

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan — O(n)
 * Time: O(n)
 * Space: O(1)
 *
 * Simply iterate from 1 to n. Decrement k for each factor found.
 * Return when k reaches 0; otherwise return -1.
 */
function kthFactorLinear(n: number, k: number): number {
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
      k--;
      if (k === 0) return i;
    }
  }
  return -1;
}

/**
 * Solution 2: Square Root Enumeration — O(sqrt(n))
 * Time: O(sqrt(n))
 * Space: O(sqrt(n)) — stores small factors
 *
 * Collect small factors (i ≤ sqrt(n)) in increasing order.
 * Collect large factors (n/i) — they appear in decreasing order as i increases.
 * Check small factors first; if k still remains, check large factors in reverse.
 */
function kthFactor(n: number, k: number): number {
  const smallFactors: number[] = [];

  // Collect small factors up to sqrt(n)
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      smallFactors.push(i);
    }
  }

  // Check small factors (sorted ascending)
  if (k <= smallFactors.length) {
    return smallFactors[k - 1];
  }

  // Remaining k falls in large factors (n/i, sorted descending as i ascended)
  // We need to reverse: large factors in ascending order = smallFactors reversed mapped to n/i
  k -= smallFactors.length;

  // Walk small factors in reverse to get large factors in ascending order
  for (let j = smallFactors.length - 1; j >= 0; j--) {
    const largeFactor = n / smallFactors[j];
    // Skip if largeFactor equals the small factor (perfect square case)
    if (largeFactor !== smallFactors[j]) {
      k--;
      if (k === 0) return largeFactor;
    }
  }

  return -1;
}

// === Test Cases ===
console.log(kthFactor(12, 3)); // 3   (factors: 1,2,3,4,6,12)
console.log(kthFactor(7, 2)); // 7   (factors: 1,7)
console.log(kthFactor(4, 4)); // -1  (factors: 1,2,4 — only 3)
console.log(kthFactor(1, 1)); // 1   (only factor of 1 is 1)
console.log(kthFactor(12, 6)); // 12  (6th and last factor)
```

---

## 🔗 Related Problems

- [Perfect Number](https://leetcode.com/problems/perfect-number) — sum all proper divisors using sqrt enumeration
- [Count Primes](https://leetcode.com/problems/count-primes) — Sieve of Eratosthenes for divisibility
- [Smallest Value of the Rearranged Number](https://leetcode.com/problems/smallest-value-of-the-rearranged-number) — number theory / digit manipulation
- [Add Digits](https://leetcode.com/problems/add-digits) — digital root using number theory
- [The kth Factor of n — LeetCode](https://leetcode.com/problems/the-kth-factor-of-n) — problem page
