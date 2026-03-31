---
layout: page
title: "Find Products of Elements of Big Array"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/find-products-of-elements-of-big-array"
---

# Find Products of Elements of Big Array / Tích Các Phần Tử Của Mảng Lớn

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Missing Number](https://leetcode.com/problems/missing-number) | [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một cuốn sách số học khổng lồ ghi tất cả các bit 1 của mọi số nguyên dương — ta cần tích một đoạn trang sách đó. Binary search tìm vị trí bắt đầu/kết thúc, bit counting tính tổng số mũ của mỗi số nguyên tố 2.

**Pattern Recognition:**

- Signal: "big array của tất cả bit 1 trong powerful numbers" + "product of subarray" → binary search + bit arithmetic
- Key insight: powerful number = số chỉ có bit-1 (2^0, 2^1, 2^2, ...). Mảng big = concat all bit-1 positions sorted.

**Visual — Find Products example:**

```
Powerful numbers (numbers that are powers of 2 or products of distinct powers of 2):
Actually: nums where every set bit contributes to the "big array"

big = [1,2,1,2,4,1,2,4,...]  (bit positions of 1,2,3,4,5,6,7,...)

   1 → bits: [1]          → big = [1]
   2 → bits: [2]          → big = [1,2]
   3 → bits: [1,2]        → big = [1,2,1,2]
   4 → bits: [4]          → big = [1,2,1,2,4]
   5 → bits: [1,4]        → big = [1,2,1,2,4,1,4]
   ...

Query: product of big[from..to] mod mod
= 2^(sum of log2 of each element) mod mod
```

---

## Problem Description

A **powerful** integer is any positive integer `x` such that every bit in its binary representation is a 1. The **big array** is formed by concatenating the bit-values (powers of 2) of every powerful integer in sorted order. Given queries `[from_i, to_i, mod_i]`, return the product of `big[from_i..to_i]` modulo `mod_i`.

Difficulty: Hard | Acceptance: 21.8%

```
Example 1:
  Input:  queries = [[1,3,7]]
  Output: [4]
  Explanation: big = [1,2,1,2,4,...], product of big[1..3] = 2*1*2 = 4, 4 mod 7 = 4

Example 2:
  Input:  queries = [[2,5,3],[7,7,4]]
  Output: [2, 2]
```

Constraints:

- `1 <= queries.length <= 500`
- `queries[i].length == 3`
- `0 <= from_i <= to_i <= 10^15`
- `1 <= mod_i <= 10^9 + 7`

---

## 📝 Interview Tips

1. **Clarify**: "Powerful number nghĩa là gì? Chỉ các power-of-2 hay tất cả số có tất cả bit=1?" / Clarify definition: every set bit contributes one entry.
2. **Count function**: "Cần hàm count(x) = số phần tử trong big[0..x-1] — là tổng popcount(1..n) cho một n nào đó" / Need a counting function for total elements up to number n.
3. **Binary search**: "Binary search để tìm số n sao cho count(n) = position" / Binary search to map position → which number n.
4. **Bit sum**: "Tích = 2^(sum of exponents); cần sum of bit-positions in range" / Product = 2^(sum of exponent values); compute modular exponent.
5. **BigInt arithmetic**: "Các index lên đến 10^15, cần BigInt hoặc careful int64 arithmetic" / Indices up to 10^15, need BigInt.
6. **Follow-up**: "Nếu thay vì product là sum? Tương tự nhưng không cần modPow" / For sum instead of product, no modPow needed.

---

## Solutions

```typescript
/**
 * Count total number of set bits in all numbers [1..n]
 * Time: O(log^2 n)
 */
function countBits(n: bigint): bigint {
  // Sum of popcount(1) + popcount(2) + ... + popcount(n)
  // Bit k contributes floor((n+1)/2^(k+1))*2^k + max(0, (n+1) mod 2^(k+1) - 2^k) ones
  let total = 0n;
  let bit = 1n;
  while (bit <= n) {
    const cycle = bit * 2n;
    total += (n + 1n) / cycle * bit;
    const rem = (n + 1n) % cycle;
    if (rem > bit) total += rem - bit;
    bit <<= 1n;
  }
  return total;
}

/**
 * Sum of exponents (bit positions, 0-indexed) in big[0..pos-1]
 * i.e., for each number 1..n, sum all bit indices where bit=1
 * bitPos k contributes k * (count of numbers in [1..n] having bit k set)
 */
function sumBitPositions(n: bigint): bigint {
  let total = 0n;
  for (let k = 0n; (1n << k) <= n; k++) {
    const bit = 1n << k;
    const cycle = bit * 2n;
    const full = (n + 1n) / cycle;
    const rem = (n + 1n) % cycle;
    const cnt = full * bit + (rem > bit ? rem - bit : 0n);
    total += k * cnt;
  }
  return total;
}

function modPowBig(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp & 1n) result = result * base % mod;
    base = base * base % mod;
    exp >>= 1n;
  }
  return result;
}

/**
 * Find number n such that countBits(n) == target (first n with cumulative count >= target)
 */
function findNth(target: bigint): bigint {
  let lo = 1n, hi = 2n ** 50n;
  while (lo < hi) {
    const mid = (lo + hi) / 2n;
    if (countBits(mid) >= target) hi = mid;
    else lo = mid + 1n;
  }
  return lo;
}

/**
 * Solution: Binary Search + Bit Arithmetic
 * Time: O(Q * log^2(maxVal)) where maxVal ~ 10^15
 * Space: O(1) per query
 */
function findProductsOfElements(queries: number[][]): number[] {
  const result: number[] = [];

  for (const [fromNum, toNum, mod] of queries) {
    const from = BigInt(fromNum);
    const to = BigInt(toNum);
    const modB = BigInt(mod);

    // We want product of big[from..to] = 2^(sum of exponents in that range)
    // Compute prefix sum of exponents up to position `to` and `from-1`
    // Then exponent sum in [from..to] = prefixExp(to) - prefixExp(from-1)

    // sumExp(pos): sum of bit-indices in big[0..pos-1]
    // = for all numbers n contributing to position pos, sum their bit indices
    const sumExp = (pos: bigint): bigint => {
      if (pos <= 0n) return 0n;
      // Find n = the number whose bits end at exactly position pos
      const n = findNth(pos);
      // Exponents from all complete numbers 1..n-1
      let total = sumBitPositions(n - 1n);
      // Plus the first (pos - countBits(n-1)) bit-indices of n
      const rem = pos - countBits(n - 1n);
      let cnt = 0n;
      for (let k = 0n; (1n << k) <= n; k++) {
        if (n & (1n << k)) {
          cnt++;
          if (cnt <= rem) total += k;
        }
      }
      return total;
    };

    const expSum = sumExp(to + 1n) - sumExp(from);
    result.push(Number(modPowBig(2n, expSum, modB)));
  }

  return result;
}

// === Test Cases ===
console.log(findProductsOfElements([[1,3,7]]);    // [4]
console.log(findProductsOfElements([[2,5,3],[7,7,4]])); // [2,2]
```

---

## 🔗 Related Problems

- [Missing Number](https://leetcode.com/problems/missing-number) — binary search / bit trick
- [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number) — binary search on value
- [Count Integers With Even Digit Sum](https://leetcode.com/problems/count-integers-with-even-digit-sum) — counting with binary search
- [K-th Symbol in Grammar](https://leetcode.com/problems/k-th-symbol-in-grammar) — bit-level position mapping
- [Find Products of Elements of Big Array — LeetCode](https://leetcode.com/problems/find-products-of-elements-of-big-array) — problem page
