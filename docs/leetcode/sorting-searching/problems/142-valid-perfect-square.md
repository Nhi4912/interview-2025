---
layout: page
title: "Valid Perfect Square"
difficulty: Easy
category: Sorting-Searching
tags: [Math, Binary Search]
leetcode_url: "https://leetcode.com/problems/valid-perfect-square"
---

# Valid Perfect Square / Số Chính Phương Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Binary Search / Math

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Cho số `num`, kiểm tra có tồn tại số nguyên `x` sao cho `x * x = num` không — **không dùng sqrt()**. Tìm nhị phân trên đoạn `[1, num]`: nếu `mid²` = num → true, < num → tìm nửa phải, > num → tìm nửa trái.

```
num = 16
lo=1, hi=16
  mid=8:  8*8=64 > 16 → hi=7
  mid=4:  4*4=16 = 16 → return true ✅

num = 14
lo=1, hi=14
  mid=7:  7*7=49 > 14 → hi=6
  mid=3:  3*3=9  < 14 → lo=4
  mid=5:  5*5=25 > 14 → hi=4
  mid=4:  4*4=16 > 14 → hi=3
  lo>hi → return false ✅
```

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **No Math.sqrt** / Đề cấm dùng sqrt — phải binary search hoặc Newton's method
- 🔑 **Search range** / Tìm trong [1, num] — giới hạn trên có thể là num/2+1 nếu num > 1
- 🔑 **Overflow** / `mid * mid` có thể overflow 32-bit — dùng BigInt hoặc chú ý giới hạn số
- 🔑 **Newton's method** / `x = (x + num/x) / 2` hội tụ nhanh — O(log log n)
- 🔑 **Edge cases** / num = 1 → true (1² = 1); num = 2 → false
- 🔑 **Odd square pattern** / 1=1, 4=1+3, 9=1+3+5 — cộng liên tiếp các số lẻ là O(√n)

## Solutions

```typescript
// ─── Solution 1: Linear — O(√n) ───
function isPerfectSquareBrute(num: number): boolean {
  for (let i = 1; i * i <= num; i++) {
    if (i * i === num) return true;
  }
  return false;
}

console.log(isPerfectSquareBrute(16)); // true
console.log(isPerfectSquareBrute(14)); // false

// ─── Solution 2: Binary Search — O(log n) ───
function isPerfectSquare(num: number): boolean {
  if (num < 1) return false;
  let lo = 1,
    hi = num;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const sq = mid * mid;
    if (sq === num) return true;
    if (sq < num) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}

console.log(isPerfectSquare(1)); // true
console.log(isPerfectSquare(16)); // true
console.log(isPerfectSquare(14)); // false
console.log(isPerfectSquare(2)); // false
console.log(isPerfectSquare(4)); // true

// ─── Solution 3: Newton's Method — O(log log n) ───
function isPerfectSquareNewton(num: number): boolean {
  let x = num;
  // Newton's iteration: x_{n+1} = (x_n + num/x_n) / 2
  while (x * x > num) {
    x = Math.floor((x + Math.floor(num / x)) / 2);
  }
  return x * x === num;
}

console.log(isPerfectSquareNewton(16)); // true
console.log(isPerfectSquareNewton(14)); // false
console.log(isPerfectSquareNewton(2147483647)); // false (max int)

// ─── Solution 4: Odd numbers sum trick — O(√n) ───
function isPerfectSquareMath(num: number): boolean {
  // A perfect square is sum of consecutive odd numbers: 1, 1+3, 1+3+5, ...
  let odd = 1;
  while (num > 0) {
    num -= odd;
    odd += 2;
  }
  return num === 0;
}

console.log(isPerfectSquareMath(9)); // true
console.log(isPerfectSquareMath(14)); // false
```

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem               | Pattern       |
| --- | --------------------- | ------------- |
| 367 | Valid Perfect Square  | This problem  |
| 69  | Sqrt(x)               | Binary Search |
| 633 | Sum of Square Numbers | Two Pointers  |
| 268 | Missing Number        | Math          |
