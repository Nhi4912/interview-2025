---
layout: page
title: "Minimize the Maximum of Two Arrays"
difficulty: Medium
category: Sorting-Searching
tags: [Math, Binary Search, Number Theory]
leetcode_url: "https://leetcode.com/problems/minimize-the-maximum-of-two-arrays"
---

# Minimize the Maximum of Two Arrays / Tối Thiểu Hóa Giá Trị Lớn Nhất Của Hai Mảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: ⭐ Tier 2 — Hay gặp ở Meta, Google
> **See also**: [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas) | [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn muốn chia uniqueCnt1 + uniqueCnt2 số nguyên dương vào hai nhóm — nhóm 1 không được chứa bội số của d1, nhóm 2 không được chứa bội số của d2. Minimize giá trị lớn nhất. Binary search trên câu trả lời: "Với max = m, có thể chia đủ không?" Dùng inclusion-exclusion để đếm số khả dụng cho mỗi nhóm.

**Pattern Recognition:**

- Signal: "minimize maximum" + "constraint on usable values" → **Binary Search on answer**
- Feasibility check: với max = m, count available numbers per array using inclusion-exclusion
- LCM cần dùng BigInt để tránh overflow khi d1 * d2 lớn

**Visual — divisor1=2, divisor2=7, uniqueCnt1=1, uniqueCnt2=3:**

```
Binary search on m. Check feasibility for m=4:
  onlyArr1 = floor(4/7) - floor(4/lcm(2,7)) = 0 - 0 = 0  (div by d2=7, not d1=2)
  onlyArr2 = floor(4/2) - floor(4/14)       = 2 - 0 = 2  (div by d1=2, not d2=7)
  either   = 4 - floor(4/2) - floor(4/7) + floor(4/14) = 4-2-0+0 = 2

  arr1 capacity: onlyArr1+either = 0+2 = 2 >= 1 ✓
  arr2 capacity: onlyArr2+either = 2+2 = 4 >= 3 ✓
  total: 0+2+2 = 4 >= 4 ✓  -> feasible! try smaller
Answer = 4 ✅
```

---

## Problem Description

Fill arr1 (size uniqueCnt1, no multiples of divisor1) and arr2 (size uniqueCnt2, no multiples of divisor2) with distinct positive integers. Minimize the maximum integer used.

```
Example 1: d1=2, d2=7, cnt1=1, cnt2=3  -> 4
Example 2: d1=3, d2=5, cnt1=2, cnt2=1  -> 3
Example 3: d1=2, d2=4, cnt1=8, cnt2=2  -> 14
```

---

## 📝 Interview Tips

1. **Binary search range**: [1, 2*(cnt1+cnt2)] là đủ rộng cho mọi case
2. **Inclusion-exclusion**: onlyArr1 + onlyArr2 + either = total usable
3. **BigInt cho LCM**: d1*d2 có thể tới 10^10 nên dùng BigInt
4. **3 điều kiện check**: arr1 capacity, arr2 capacity, total capacity
5. **Tại sao binary search?** Feasibility tăng đơn điệu theo m → có thể binary search
6. **Complexity**: Time O(log(2e9)), Space O(1) — rất nhanh

---

## Solutions

```typescript
/**
 * Solution 1: Binary Search on Answer + Inclusion-Exclusion
 * Time O(log(2*(cnt1+cnt2))), Space O(1)
 *
 * For a given max m, compute available slots using:
 * - onlyArr1: divisible by d2 but not d1 (must go in arr1)
 * - onlyArr2: divisible by d1 but not d2 (must go in arr2)
 * - either:   divisible by neither (can go in arr1 or arr2)
 */
function minimizeSet(
  divisor1: number,
  divisor2: number,
  uniqueCnt1: number,
  uniqueCnt2: number
): number {
  // GCD and LCM using BigInt to avoid overflow
  const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? a : gcd(b, a % b));
  const lcm = (a: number, b: number): bigint => {
    const ba = BigInt(a), bb = BigInt(b);
    return (ba * bb) / gcd(ba, bb);
  };

  const d1 = BigInt(divisor1), d2 = BigInt(divisor2);
  const L = lcm(divisor1, divisor2);

  const feasible = (m: bigint): boolean => {
    const onlyArr1 = m / d2 - m / L; // div by d2 not d1 -> must use in arr1
    const onlyArr2 = m / d1 - m / L; // div by d1 not d2 -> must use in arr2
    const either = m - m / d1 - m / d2 + m / L; // div by neither -> flexible

    if (onlyArr1 + either < BigInt(uniqueCnt1)) return false;
    if (onlyArr2 + either < BigInt(uniqueCnt2)) return false;
    if (onlyArr1 + onlyArr2 + either < BigInt(uniqueCnt1 + uniqueCnt2)) return false;
    return true;
  };

  let lo = 1n;
  let hi = BigInt(2 * (uniqueCnt1 + uniqueCnt2) + 2);

  while (lo < hi) {
    const mid = (lo + hi) / 2n;
    if (feasible(mid)) hi = mid;
    else lo = mid + 1n;
  }

  return Number(lo);
}

/**
 * Solution 2: Same with explicit BigInt math helpers
 * Time O(log N), Space O(1)
 */
function minimizeSet2(d1: number, d2: number, c1: number, c2: number): number {
  const bd1 = BigInt(d1), bd2 = BigInt(d2);
  const gcd = (a: bigint, b: bigint): bigint => b ? gcd(b, a % b) : a;
  const L = bd1 * bd2 / gcd(bd1, bd2);

  const check = (m: bigint) => {
    const a1 = m - m / bd1; // numbers not div by d1 (available for arr1)
    const a2 = m - m / bd2; // numbers not div by d2 (available for arr2)
    const both = m - m / bd1 - m / bd2 + m / L; // available for either
    return a1 >= BigInt(c1) && a2 >= BigInt(c2) && both >= BigInt(c1 + c2);
  };

  let lo = 1n, hi = BigInt(2e9 + 10);
  while (lo < hi) {
    const mid = (lo + hi) / 2n;
    check(mid) ? (hi = mid) : (lo = mid + 1n);
  }
  return Number(lo);
}

// --- Quick inline tests ---
console.log(minimizeSet(2, 7, 1, 3));   // 4
console.log(minimizeSet(3, 5, 2, 1));   // 3
console.log(minimizeSet(2, 4, 8, 2));   // 14
console.log(minimizeSet2(2, 7, 1, 3));  // 4
console.log(minimizeSet2(3, 5, 2, 1));  // 3
```

---

## 🔗 Related Problems

| Problem | Relationship |
| ------- | ------------ |
| [2513. Minimize the Maximum of Two Arrays](https://leetcode.com/problems/minimize-the-maximum-of-two-arrays/) | This problem |
| [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | Binary search on answer pattern |
| [410. Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) | Minimize maximum with binary search |
| [2226. Maximum Candies Allocated to K Children](https://leetcode.com/problems/maximum-candies-allocated-to-k-children/) | Binary search + feasibility check |
| [2300. Successful Pairs of Spells and Potions](https://leetcode.com/problems/successful-pairs-of-spells-and-potions/) | Sort + binary search |
