---
layout: page
title: "Four Divisors"
difficulty: Medium
category: Array
tags: [Array, Math]
leetcode_url: "https://leetcode.com/problems/four-divisors"
---

# Four Divisors / Bốn Ước Số

🟡 Medium | 🏷️ Array, Math | 🔗 [LeetCode](https://leetcode.com/problems/four-divisors)

## 🧠 Intuition / Trực Giác

**Tiếng Việt:** Với mỗi số n, tìm tất cả ước số bằng cách thử từ 1 đến sqrt(n). Mỗi ước số d < sqrt(n) sẽ cho cặp (d, n/d). Nếu đếm được đúng 4 ước số, thêm tổng của chúng vào kết quả.

**English:** For each n, iterate d from 1 to sqrt(n). Each divisor d < sqrt(n) gives pair (d, n/d). If d == sqrt(n), it's a single divisor. Stop early if count exceeds 4. Sum divisors only when exactly 4.

```
nums = [21, 4]

21: d=1→(1,21), d=2→no, d=3→(3,7), d=4>√21 stop
    divisors=[1,21,3,7] → count=4 ✓ sum=32

4:  d=1→(1,4), d=2→(2) single, d=3>√4 stop
    divisors=[1,4,2] → count=3 ✗

Answer: 32
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN:** Iterate d from 1 to sqrt(n) — each d gives at most 2 divisors | **VI:** Duyệt d từ 1 đến sqrt(n) — mỗi d cho tối đa 2 ước số
- 🔑 **EN:** Perfect square d*d == n contributes only ONE divisor (d), not two | **VI:** Số chính phương d*d == n chỉ đóng góp MỘT ước số (d), không phải hai
- 🔑 **EN:** Early exit when divisor count > 4 — no need to continue | **VI:** Thoát sớm khi số ước > 4 — không cần tiếp tục
- 🔑 **EN:** Result can be large — use regular number (fits in JS 53-bit safe integer) | **VI:** Kết quả có thể lớn — số thông thường đủ chứa trong JS
- 🔑 **EN:** Numbers with exactly 4 divisors have form p³ or p*q (p,q distinct primes) | **VI:** Số có đúng 4 ước có dạng p³ hoặc p*q (p,q là số nguyên tố khác nhau)
- 🔑 **EN:** O(n _ sqrt(maxVal)) total time | **VI:** Tổng thời gian O(n _ sqrt(maxVal))

## Solutions

### Solution 1: Trial Division with Early Exit (Optimal)

```typescript
/**
 * Four Divisors — find numbers with exactly 4 divisors
 * Time: O(n * sqrt(max_val)) — trial division per element
 * Space: O(1) extra per number (O(4) divisors max)
 */
function sumFourDivisors(nums: number[]): number {
  let total = 0;

  for (const n of nums) {
    const divs: number[] = [];
    let tooMany = false;

    for (let d = 1; d * d <= n && !tooMany; d++) {
      if (n % d === 0) {
        divs.push(d);
        if (d !== n / d) divs.push(n / d);
        if (divs.length > 4) tooMany = true;
      }
    }

    if (!tooMany && divs.length === 4) {
      total += divs.reduce((a, b) => a + b, 0);
    }
  }

  return total;
}

console.log(sumFourDivisors([21, 4])); // 32
console.log(sumFourDivisors([21, 4, 7])); // 32 (7 has only 2 divisors: 1,7)
console.log(sumFourDivisors([1, 2, 3, 4, 5])); // 0
console.log(sumFourDivisors([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])); // 20+? let's test
```

### Solution 2: Helper Function Style

```typescript
/**
 * Extract divisor logic into a helper
 * Time: O(n * sqrt(max)) | Space: O(1)
 */
function sumFourDivisors2(nums: number[]): number {
  const getFourDivSum = (n: number): number => {
    const divs: number[] = [];
    for (let d = 1; d * d <= n; d++) {
      if (n % d === 0) {
        divs.push(d);
        if (d !== n / d) divs.push(n / d);
        if (divs.length > 4) return 0; // too many divisors
      }
    }
    return divs.length === 4 ? divs.reduce((a, b) => a + b, 0) : 0;
  };

  return nums.reduce((sum, n) => sum + getFourDivSum(n), 0);
}

console.log(sumFourDivisors2([21, 4])); // 32
console.log(sumFourDivisors2([1, 2, 3, 4, 5])); // 0
console.log(sumFourDivisors2([36])); // 0 (9 divisors: 1,2,3,4,6,9,12,18,36)
```

### Solution 3: Math Insight — Forms p³ and p\*q

```typescript
/**
 * A number has exactly 4 divisors iff it is of the form:
 *   - p^3: divisors are 1, p, p^2, p^3
 *   - p*q (p≠q primes): divisors are 1, p, q, p*q
 * We check both forms using trial division efficiently.
 * Time: O(n * sqrt(max)) | Space: O(1)
 */
function sumFourDivisors3(nums: number[]): number {
  let total = 0;

  for (const n of nums) {
    // Find smallest prime factor
    let p = 0;
    for (let d = 2; d * d <= n; d++) {
      if (n % d === 0) {
        p = d;
        break;
      }
    }

    if (p === 0) continue; // n is prime → only 2 divisors

    const q = n / p;

    if (q === p * p) {
      // n = p^3: divisors 1, p, p^2, p^3
      total += 1 + p + p * p + n;
    } else if (q % p !== 0) {
      // q has no factor of p, so n = p * q where gcd(p,q)=1
      // Check if q is prime (or 1)
      let isPrimeQ = q > 1;
      for (let d = 2; d * d <= q; d++) {
        if (q % d === 0) {
          isPrimeQ = false;
          break;
        }
      }
      if (isPrimeQ) total += 1 + p + q + n; // exactly 4 divisors
    }
    // else: more than 4 divisors, skip
  }

  return total;
}

console.log(sumFourDivisors3([21, 4])); // 32
console.log(sumFourDivisors3([8])); // 1+2+4+8=15 (8=2^3)
console.log(sumFourDivisors3([1, 2, 3, 4, 5])); // 0
```

## 🔗 Related Problems

| Problem                                                                | Difficulty | Pattern               |
| ---------------------------------------------------------------------- | ---------- | --------------------- |
| [Count Primes](https://leetcode.com/problems/count-primes/)            | 🟡 Medium  | Sieve of Eratosthenes |
| [Ugly Number II](https://leetcode.com/problems/ugly-number-ii/)        | 🟡 Medium  | Math                  |
| [Sum of All Divisors](https://www.geeksforgeeks.org/sum-divisors-1-n/) | —          | Number Theory         |
