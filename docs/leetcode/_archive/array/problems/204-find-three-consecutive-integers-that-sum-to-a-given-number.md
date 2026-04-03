---
layout: page
title: "Find Three Consecutive Integers That Sum to a Given Number"
difficulty: Medium
category: Array
tags: [Math, Simulation]
leetcode_url: "https://leetcode.com/problems/find-three-consecutive-integers-that-sum-to-a-given-number"
---

# Find Three Consecutive Integers That Sum to a Given Number / Tìm Ba Số Nguyên Liên Tiếp Có Tổng Cho Trước

🟡 Medium | Math · Simulation | LeetCode #2177

## 🧠 Intuition / Tư Duy

**Vietnamese:** Ba số nguyên liên tiếp có dạng `(m-1, m, m+1)`, tổng = `3m`. Vậy `m = num / 3`. Nếu `num` chia hết cho 3, tồn tại đáp án; ngược lại không có.

```
num = 33
m = 33 / 3 = 11
Answer: [10, 11, 12]  → 10+11+12 = 33 ✓

num = 4
4 / 3 = 1.33... (not integer)
Answer: []  → no solution

num = 0
0 / 3 = 0
Answer: [-1, 0, 1]  → -1+0+1 = 0 ✓
```

## Problem Description

Given integer `num`, return **three consecutive integers** (as an array) that sum to `num`, or an **empty array** if no such integers exist. Consecutive means each differs by 1 (can be negative).

The math is elegant: if three consecutive integers are `(n-1, n, n+1)`, their sum = `3n`, so `n = num/3` must be an integer.

**Example 1:**

```
num=33
Output: [10,11,12]
```

**Example 2:**

```
num=4
Output: []  // 4 % 3 != 0
```

## 📝 Interview Tips

- **🔑 Math shortcut / Công thức toán:** `(n-1)+n+(n+1) = 3n` — answer exists iff `num % 3 === 0`
- **🎯 Middle element / Phần tử giữa:** `middle = num / 3`; return `[middle-1, middle, middle+1]`
- **⚠️ Negative numbers / Số âm:** Works fine — e.g., `num=0` → `[-1,0,1]`; `num=-3` → `[-2,-1,0]`
- **📦 Return type / Kiểu trả về:** Return `number[]` (not `bigint[]` even though `num` can be large 10^15 — use BigInt for large inputs)
- **🔄 BigInt for large inputs / BigInt cho input lớn:** `num` up to 10^15 — JavaScript Number is safe up to 2^53, so regular numbers work
- **💡 Generalize / Tổng quát hoá:** For k consecutive: sum = k\*(2m+k-1)/2 — k odd means middle = num/k

## Solutions

```typescript
/**
 * Approach 1: Direct math — check divisibility by 3
 * Time: O(1)
 * Space: O(1)
 */
function sumOfThree(num: number): number[] {
  if (num % 3 !== 0) return [];
  const mid = num / 3;
  return [mid - 1, mid, mid + 1];
}

console.log(sumOfThree(33)); // [10, 11, 12]
console.log(sumOfThree(4)); // []
console.log(sumOfThree(0)); // [-1, 0, 1]
console.log(sumOfThree(-3)); // [-2, -1, 0]
```

```typescript
/**
 * Approach 2: BigInt-safe version for very large numbers
 * Time: O(1)
 * Space: O(1)
 */
function sumOfThreeBig(num: number): number[] {
  // Use BigInt to handle up to 10^15 safely (though Number is fine here)
  const n = BigInt(num);
  if (n % 3n !== 0n) return [];
  const mid = Number(n / 3n);
  return [mid - 1, mid, mid + 1];
}

console.log(sumOfThreeBig(33)); // [10, 11, 12]
console.log(sumOfThreeBig(4)); // []
console.log(sumOfThreeBig(999999999999)); // [333333333332, 333333333333, 333333333334]
```

```typescript
/**
 * Approach 3: Brute force scan (educational — shows pattern generalizes)
 * Try middle values around num/3
 * Time: O(1) effectively (bounded search)
 * Space: O(1)
 */
function sumOfThreeBrute(num: number): number[] {
  // Only need to check one candidate
  const mid = Math.floor(num / 3);
  for (let m = mid - 1; m <= mid + 1; m++) {
    if (m - 1 + m + (m + 1) === num) return [m - 1, m, m + 1];
  }
  return [];
}

console.log(sumOfThreeBrute(33)); // [10, 11, 12]
console.log(sumOfThreeBrute(4)); // []
```

## 🔗 Related Problems

| Problem                                                                                                | Difficulty | Pattern      |
| ------------------------------------------------------------------------------------------------------ | ---------- | ------------ |
| [Check if Array Is Consecutive](https://leetcode.com/problems/check-if-array-is-consecutive/)          | 🟢 Easy    | Math         |
| [Find Three Consecutive Integers II](https://leetcode.com/problems/find-the-integer-added-to-array-i/) | 🟢 Easy    | Math         |
| [Closest Divisors](https://leetcode.com/problems/closest-divisors/)                                    | 🟡 Medium  | Math         |
| [Three Sum](https://leetcode.com/problems/3sum/)                                                       | 🟡 Medium  | Two Pointers |
