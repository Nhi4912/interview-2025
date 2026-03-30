---
layout: page
title: "Count Primes"
difficulty: Medium
category: Math
tags: [Math, Array, Enumeration, Number Theory]
leetcode_url: "https://leetcode.com/problems/count-primes/"
---

# Count Primes / Đếm Số Nguyên Tố

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sieve of Eratosthenes
> **Frequency**: ⭐ Tier 2 — Sieve pattern kinh điển, thường dùng trong precomputation
> **See also**: [Fizz Buzz](./01-fizz-buzz.md) | [Power of Three](./03-power-of-three.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng sàng lọc gạo: bắt đầu với tất cả hạt là "nguyên tố" (tốt). Chọn hạt 2 — đánh dấu tất cả bội số của 2 là xấu. Chọn hạt 3 tiếp theo còn tốt — đánh dấu bội của 3. Cứ tiếp tục đến √n. Những hạt còn tốt cuối cùng chính là số nguyên tố.

**Pattern Recognition:**

- Signal: count/find all primes up to n → **Sieve of Eratosthenes** O(n log log n)
- Chỉ cần sàng đến `√n` vì: nếu `n = a × b`, một trong hai nhân tử ≤ √n
- Bắt đầu đánh dấu từ `i*i` (không phải `2*i`) vì `i*k` với `k < i` đã bị đánh dấu trước
- Dùng `Uint8Array` hoặc `Array(n).fill(true)` — memory-friendly

**Visual — n=20, Sieve of Eratosthenes:**

```
Initial: [F,F,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T]  (idx 0..19)
                                                         (0,1 = false)
i=2: mark 4,6,8,10,12,14,16,18 → X
i=3: mark 9,15                 → X   (6 already marked)
i=4: isPrime[4]=false, skip
√20≈4.4 → done sieving

Primes: 2,3,5,7,11,13,17,19 → count = 8 ✅
```

---

## Problem Description

Given integer `n`, return the count of prime numbers **strictly less than** `n`.

```
Example 1: n=10  → 4    (primes: 2, 3, 5, 7)
Example 2: n=0   → 0
Example 3: n=1   → 0
```

Constraints: `0 <= n <= 5 × 10^6`

---

## 📝 Interview Tips

1. **Brute force O(n√n)**: check each number by trial division — mention first, then optimize
2. **Tại sao bắt đầu từ `i*i`?** Tất cả `i*k` với `k < i` đã bị đánh dấu bởi `k` trong vòng trước
3. **Tại sao sàng đến `√n`?** Nếu số p chưa bị đánh dấu khi ta đến √n, thì p là nguyên tố
4. **Memory cho n lớn**: với n = 5×10^6, dùng `Uint8Array` thay `boolean[]` tiết kiệm 8x memory
5. **Không bao gồm n**: đề hỏi "strictly less than n" — loop `i < n`, không phải `i <= n`
6. **Follow-up**: Segmented sieve cho n cực lớn (> 10^8) khi không đủ RAM

---

## Solutions

{% raw %}
/\*\*

- Solution 1: Trial Division (Brute Force)
- Time O(n √n), Space O(1) — too slow for n=5×10^6
  _/
  function countPrimesBrute(n: number): number {
  function isPrime(x: number): boolean {
  if (x < 2) return false;
  for (let i = 2; i _ i <= x; i++) {
  if (x % i === 0) return false;
  }
  return true;
  }
  let count = 0;
  for (let i = 2; i < n; i++) if (isPrime(i)) count++;
  return count;
  }

/\*\*

- Solution 2: Sieve of Eratosthenes (Optimal)
- Time O(n log log n), Space O(n)
-
- Mark composites by iterating multiples of each prime.
- Only need to sieve up to √n; start marking from i*i.
  */
  function countPrimes(n: number): number {
  if (n <= 2) return 0;

const isPrime = new Uint8Array(n).fill(1); // 1 = prime, 0 = composite
isPrime[0] = 0;
isPrime[1] = 0;

for (let i = 2; i * i < n; i++) {
if (isPrime[i]) {
// Mark multiples of i starting from i*i
// (smaller multiples were already marked by earlier primes)
for (let j = i \* i; j < n; j += i) {
isPrime[j] = 0;
}
}
}

let count = 0;
for (let i = 2; i < n; i++) if (isPrime[i]) count++;
return count;
}

// --- Quick inline tests ---
console.log(countPrimes(10) === 4); // true (2,3,5,7)
console.log(countPrimes(0) === 0); // true
console.log(countPrimes(1) === 0); // true
console.log(countPrimes(20) === 8); // true (2,3,5,7,11,13,17,19)
{% endraw %}

---

## 🔗 Related Problems

| Problem                                                                       | Relationship                   |
| ----------------------------------------------------------------------------- | ------------------------------ |
| [204. Count Primes](https://leetcode.com/problems/count-primes/)              | This problem                   |
| [263. Ugly Number](https://leetcode.com/problems/ugly-number/)                | Prime factorization check      |
| [264. Ugly Number II](https://leetcode.com/problems/ugly-number-ii/)          | DP using prime multiples       |
| [279. Perfect Squares](https://leetcode.com/problems/perfect-squares/)        | Precomputation / sieve-like DP |
| [1175. Prime Arrangements](https://leetcode.com/problems/prime-arrangements/) | Count primes then permutation  |
