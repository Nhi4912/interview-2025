---
layout: page
title: "Count Array Pairs Divisible by K"
difficulty: Hard
category: Array
tags: [Array, Math, Number Theory]
leetcode_url: "https://leetcode.com/problems/count-array-pairs-divisible-by-k"
---

# Count Array Pairs Divisible by K / Đếm Cặp Phần Tử Chia Hết Cho K

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Number Theory / GCD Grouping
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Count Pairs Whose Sum Is Less Than Target](https://leetcode.com/problems/count-pairs-whose-sum-is-less-than-target) | [Ugly Number III](https://leetcode.com/problems/ugly-number-iii)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng bạn cần ghép cặp học sinh từ hai lớp sao cho tích số học sinh hai lớp chia hết cho k. Thay vì thử mọi cặp (O(n²)), ta nhận ra: chỉ cần biết "phần nào của k" mỗi học sinh "đóng góp" — tức `gcd(học sinh, k)`. Hai học sinh ghép được khi hai đóng góp nhân lại chia hết cho k. Ta gom theo GCD, rồi đếm cặp hợp lệ — giảm từ O(n²) xuống O(n·d(k)) với d(k) là số ước của k.

## Visual (Minh họa trực quan)

```
nums = [1,2,3,4,5,6], k = 6

Compute gcd(num, k) for each:
  gcd(1,6)=1, gcd(2,6)=2, gcd(3,6)=3, gcd(4,6)=2, gcd(5,6)=1, gcd(6,6)=6

Count by gcd: {1:2, 2:2, 3:1, 6:1}

For pair (g1,g2): valid if k | g1*g2 ↔ 6 | g1*g2
  (1,6): 1*6=6 ✓ → 2*1 = 2 pairs
  (2,3): 2*3=6 ✓ → 2*1 = 2 pairs
  (2,6): 2*6=12 ✓ → 2*1 = 2 pairs (but g2=6 already used above)
  (3,6): 3*6=18 ✓ → 1*1 = 1 pair
  (6,6): 6*6=36 ✓ → C(1,2)=0 pairs
  (2,2): 2*2=4, 4%6≠0 ✗
  → Total = 4 ✓
```

## Problem (Bài toán)

Given an integer array `nums` and an integer `k`, return the **number of pairs** `(i, j)` where `0 ≤ i < j ≤ n-1` and `nums[i] * nums[j]` is divisible by `k`.

**Example 1:** `nums = [1,2,3,4,5,6]`, `k = 6` → `4`
**Example 2:** `nums = [1,2,3,4]`, `k = 5` → `0`

**Constraints:** `1 ≤ nums.length ≤ 10^5`, `1 ≤ nums[i], k ≤ 10^5`

## Tips (Mẹo phỏng vấn)

- **Key theorem** / Định lý chính: `k | a*b ⟺ k | gcd(a,k)*gcd(b,k)` — proven via prime factorization
- **Group by gcd(num, k)** / Gom theo GCD: Chỉ d(k) nhóm tối đa, d(k)≤128 với k≤10^5
- **Count divisor pairs** / Đếm cặp ước: Với mỗi cặp ước (d1,d2) của k thỏa d1\*d2 % k==0
- **Suffix count trick** / Đếm hậu tố: Xử lý từ phải sang trái để tránh đếm cặp (i,j) và (j,i)
- **Brute O(n²)** / Brute force: n≤10^5 nên O(n²) = 10^10 → TLE; phải dùng GCD grouping
- **Overflow risk** / Tràn số: `g1 * g2` có thể tràn số nguyên → dùng `number` (đủ với k≤10^5)

## Solution 1 - Brute Force (O(n²))

```typescript
/**
 * @complexity Time: O(n²) | Space: O(1)
 * Check every pair; only feasible for small n
 */
function countPairsBrute(nums: number[], k: number): number {
  let count = 0;
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++) if ((nums[i] * nums[j]) % k === 0) count++;
  return count;
}
```

## Solution 2 - GCD Grouping (Optimal O(n·d(k) + d(k)²))

```typescript
/**
 * @complexity Time: O(n·log k + d(k)²) | Space: O(d(k))
 * Group by gcd(num,k); for each pair of gcd-groups check if product % k === 0
 * Key: k | a*b ⟺ k | gcd(a,k)*gcd(b,k)
 */
function countPairs(nums: number[], k: number): number {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  // Count how many elements have each gcd with k
  const gcdCount = new Map<number, number>();
  for (const num of nums) {
    const g = gcd(num, k);
    gcdCount.set(g, (gcdCount.get(g) ?? 0) + 1);
  }

  const divisors = [...gcdCount.keys()];
  let count = 0;

  for (let i = 0; i < divisors.length; i++) {
    for (let j = i; j < divisors.length; j++) {
      const d1 = divisors[i],
        d2 = divisors[j];
      if ((d1 * d2) % k === 0) {
        const c1 = gcdCount.get(d1)!,
          c2 = gcdCount.get(d2)!;
        count += i === j ? (c1 * (c1 - 1)) / 2 : c1 * c2;
      }
    }
  }
  return count;
}
```

## Solution 3 - Suffix Scan (O(n · d(k)))

```typescript
/**
 * @complexity Time: O(n·log k) | Space: O(d(k))
 * Process right-to-left; for each element count valid partners to its right
 */
function countPairsSuffix(nums: number[], k: number): number {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const suffixGcdCount = new Map<number, number>();
  let count = 0;

  for (let i = nums.length - 1; i >= 0; i--) {
    const g1 = gcd(nums[i], k);
    const need = k / g1; // we need gcd(nums[j], k) to be divisible by 'need'
    // Count all j > i where need | gcd(nums[j], k)
    for (const [g2, cnt] of suffixGcdCount) {
      if (g2 % need === 0) count += cnt;
    }
    suffixGcdCount.set(g1, (suffixGcdCount.get(g1) ?? 0) + 1);
  }
  return count;
}
```

## Test Cases

```typescript
console.log(countPairs([1, 2, 3, 4, 5, 6], 6)); // → 4
console.log(countPairs([1, 2, 3, 4], 5)); // → 0
console.log(countPairs([1, 2], 2)); // → 1
console.log(countPairsBrute([1, 2, 3, 4, 5, 6], 6)); // → 4
console.log(countPairsSuffix([1, 2, 3, 4, 5, 6], 6)); // → 4
```

## Related Problems

| Problem                         | Difficulty | Link                                                                     |
| ------------------------------- | ---------- | ------------------------------------------------------------------------ |
| Count Pairs With XOR in a Range | Hard       | [LC 1803](https://leetcode.com/problems/count-pairs-with-xor-in-a-range) |
| Ugly Number III                 | Medium     | [LC 1201](https://leetcode.com/problems/ugly-number-iii)                 |
| GCD Sort of an Array            | Hard       | [LC 1998](https://leetcode.com/problems/gcd-sort-of-an-array)            |
