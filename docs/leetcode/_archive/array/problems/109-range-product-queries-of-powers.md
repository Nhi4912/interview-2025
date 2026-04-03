---
layout: page
title: "Range Product Queries of Powers"
difficulty: Medium
category: Array
tags: [Array, Bit Manipulation, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/range-product-queries-of-powers"
---

# Range Product Queries of Powers / Truy Vấn Tích Trong Khoảng Các Lũy Thừa

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Decomposition + Range Query
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Tưởng tượng bạn viết số n dưới dạng nhị phân — mỗi bit 1 là một "thành phần lũy thừa của 2". Ví dụ 13 = 1101₂ = 8 + 4 + 1. Gom tất cả thành phần đó vào mảng `powers`. Sau đó với mỗi query `[left, right]`, nhân tất cả `powers[left..right]` lại — vì chúng đều là lũy thừa 2, kết quả cũng là lũy thừa 2.

**Pattern Recognition:**

- Tách n thành các bit lũy thừa 2: dùng `n & (-n)` để lấy lowest set bit, rồi XOR/shift
- Với range product queries trên powers-of-2: tích = 2^(sum of exponents)
- Dùng prefix XOR product (mod 10^9+7) hoặc trực tiếp nhân

**Visual:**

```
n = 15, queries = [[0,1],[2,2],[0,3]]

15 = 1111₂ → powers = [1, 2, 4, 8]  (extract each set bit, ascending)

Query [0,1]: powers[0]*powers[1] = 1*2 = 2
Query [2,2]: powers[2]           = 4
Query [0,3]: 1*2*4*8             = 64

Output: [2, 4, 64]
```

## Problem Description

Given a positive integer `n` and a 2D array `queries` where `queries[i] = [left, right]`. Let `powers` be the array of powers of 2 that sum to `n` (sorted ascending). For each query, return the product of `powers[left..right]` modulo `10^9 + 7`.

**Example 1:** `n=15, queries=[[0,1],[2,2],[0,3]]` → `[2,4,64]`

**Example 2:** `n=2, queries=[[0,0]]` → `[2]`

**Constraints:** `1 <= n <= 10^9`, `1 <= queries.length <= 10^5`, `0 <= queries[i][0] <= queries[i][1] < powers.length`.

## 📝 Interview Tips

1. **Clarify**: Powers sorted ascending or by bit position? — Ascending order (smallest power first).
2. **Approach**: Tách bits của n → build powers array; then for each query multiply range.
3. **Edge cases**: n=1 → powers=[1]; query range = single element → return that element.
4. **Optimize**: Brute range multiply is O(n per query) = O(q\*log n). Prefix product array → O(1) per query but division mod prime needed (use modular inverse).
5. **Test**: `n=7 = 1+2+4`, powers=[1,2,4]; query[0,2]=1*2*4=8.
6. **Follow-up**: Range product queries with modular inverse → O(1) using prefix products.

## Solutions

```typescript
const MOD = 1_000_000_007n;

/** Solution 1: Extract bits + brute range multiply
 * Time: O(log n + q * log n) | Space: O(log n)
 */
function productQueries1(n: number, queries: number[][]): number[] {
  // Extract powers of 2 from n
  const powers: bigint[] = [];
  let num = n;
  while (num > 0) {
    const lsb = num & -num;
    powers.push(BigInt(lsb));
    num ^= lsb;
  }

  return queries.map(([l, r]) => {
    let product = 1n;
    for (let i = l; i <= r; i++) product = (product * powers[i]) % MOD;
    return Number(product);
  });
}

/** Solution 2: Prefix Products with Modular Inverse — O(1) per query
 * Time: O(log n + q) | Space: O(log n)
 */
function productQueries(n: number, queries: number[][]): number[] {
  // Extract powers of 2 (ascending)
  const powers: bigint[] = [];
  let num = n;
  while (num > 0) {
    const lsb = num & -num;
    powers.push(BigInt(lsb));
    num ^= lsb;
  }

  // Build prefix products mod MOD
  const prefix = new Array<bigint>(powers.length + 1).fill(1n);
  for (let i = 0; i < powers.length; i++) {
    prefix[i + 1] = (prefix[i] * powers[i]) % MOD;
  }

  // Modular inverse using Fermat's little theorem: a^(MOD-2) mod MOD
  const modPow = (base: bigint, exp: bigint, mod: bigint): bigint => {
    let result = 1n;
    base %= mod;
    while (exp > 0n) {
      if (exp % 2n === 1n) result = (result * base) % mod;
      exp /= 2n;
      base = (base * base) % mod;
    }
    return result;
  };

  return queries.map(([l, r]) => {
    // product[l..r] = prefix[r+1] / prefix[l] = prefix[r+1] * inv(prefix[l])
    const inv = modPow(prefix[l], MOD - 2n, MOD);
    return Number((prefix[r + 1] * inv) % MOD);
  });
}

/** Solution 3: Bit shift approach — powers are 2^k, product is 2^(sum of k)
 * Time: O(log n + q * log n) | Space: O(log n)
 */
function productQueries3(n: number, queries: number[][]): number[] {
  const exponents: number[] = [];
  for (let bit = 0; bit < 30; bit++) {
    if (n & (1 << bit)) exponents.push(bit);
  }

  const modPow = (base: bigint, exp: bigint, mod: bigint): bigint => {
    let r = 1n;
    base %= mod;
    while (exp > 0n) {
      if (exp & 1n) r = (r * base) % mod;
      exp >>= 1n;
      base = (base * base) % mod;
    }
    return r;
  };

  return queries.map(([l, r]) => {
    let expSum = 0;
    for (let i = l; i <= r; i++) expSum += exponents[i];
    return Number(modPow(2n, BigInt(expSum), MOD));
  });
}

// Test cases
console.log(
  productQueries(15, [
    [0, 1],
    [2, 2],
    [0, 3],
  ]),
); // [2, 4, 64]
console.log(productQueries(2, [[0, 0]])); // [2]
console.log(
  productQueries(7, [
    [0, 2],
    [0, 1],
  ]),
); // [8, 2]
console.log(
  productQueries1(15, [
    [0, 1],
    [2, 2],
    [0, 3],
  ]),
); // [2, 4, 64]
console.log(
  productQueries3(15, [
    [0, 1],
    [2, 2],
    [0, 3],
  ]),
); // [2, 4, 64]
```

## 🔗 Related Problems

| Problem                                                                                    | Relationship                                           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| [XOR Queries of a Subarray](https://leetcode.com/problems/xor-queries-of-a-subarray)       | Range queries with prefix XOR instead of product       |
| [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k) | Sliding window for range product condition             |
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits)                         | Bit extraction technique used in building powers array |
