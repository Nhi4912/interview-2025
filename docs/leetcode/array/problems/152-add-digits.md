---
layout: page
title: "Add Digits"
difficulty: Easy
category: Array
tags: [Math, Simulation, Number Theory]
leetcode_url: "https://leetcode.com/problems/add-digits"
---

# Add Digits / Cộng Các Chữ Số

**Difficulty:** Easy | **Category:** Math, Number Theory | **LeetCode:** [258](https://leetcode.com/problems/add-digits)

## 🧠 Intuition

> **Như đếm hạt cườm theo vòng 9 — số cuối cùng là vị trí trên vòng tròn đó.**
> Tổng các chữ số lặp lại là "digital root" — có công thức O(1) từ số học modulo 9.

```
num = 38
3 + 8 = 11  →  1 + 1 = 2

Công thức: 1 + (num - 1) % 9
= 1 + (38 - 1) % 9
= 1 + 37 % 9
= 1 + 1 = 2  ✓

Tại sao? 10 ≡ 1 (mod 9), nên mọi chữ số có trọng số 1 → sum_digits ≡ num (mod 9)
Nhưng ta muốn [1..9], không phải [0..8] → dịch thành 1 + (num-1) % 9
num = 0 → đặc biệt trả 0
```

## 📝 Tips

1. **Digital root = 0** khi num = 0. Xử lý đặc biệt trước.
2. **Công thức O(1):** `1 + (num - 1) % 9` cho num > 0.
3. **Tại sao mod 9?** Vì `10 ≡ 1 (mod 9)` → mọi chữ số đóng góp như nhau.
4. **Vòng lặp simulation:** hữu ích khi interviewer yêu cầu không dùng công thức.
5. **Số lần lặp tối đa:** rất ít (log10(num) lần) — với num ≤ 2³¹ chỉ cần ~10 lần.
6. **Follow-up không dùng loop/recursion** → dùng công thức `1 + (num-1) % 9`.

## 💡 Solutions

```typescript
/**
 * Approach 1: Digital root formula — O(1)
 * Time: O(1) | Space: O(1)
 *
 * Digital root: the value obtained by repeatedly adding digits until single digit.
 * Formula from number theory: dr(n) = 1 + (n - 1) % 9  for n > 0, else 0.
 */
function addDigits(num: number): number {
  if (num === 0) return 0;
  return 1 + ((num - 1) % 9);
}

console.log(addDigits(38)); // 2   (3+8=11 → 1+1=2)
console.log(addDigits(0)); // 0   (edge case)
console.log(addDigits(9)); // 9   (single digit)
console.log(addDigits(10)); // 1   (1+0=1)
console.log(addDigits(99)); // 9   (9+9=18 → 1+8=9)
```

```typescript
/**
 * Approach 2: Iterative digit summation (simulation)
 * Time: O(log num * digits) | Space: O(1)
 *
 * Keep summing digits until result is a single digit (< 10).
 */
function addDigits2(num: number): number {
  while (num >= 10) {
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    num = sum;
  }
  return num;
}

console.log(addDigits2(38)); // 2
console.log(addDigits2(0)); // 0
console.log(addDigits2(1)); // 1
console.log(addDigits2(1234)); // 1  (1+2+3+4=10 → 1+0=1)
```

```typescript
/**
 * Approach 3: Recursive (concise, shows recursion thinking)
 * Time: O(log num) | Space: O(log num) call stack
 */
function addDigits3(num: number): number {
  if (num < 10) return num;
  const digitSum = String(num)
    .split("")
    .reduce((a, d) => a + Number(d), 0);
  return addDigits3(digitSum);
}

console.log(addDigits3(38)); // 2
console.log(addDigits3(0)); // 0
console.log(addDigits3(9999)); // 9  (9+9+9+9=36 → 3+6=9)
console.log(addDigits3(100)); // 1  (1+0+0=1)
```

## 🔗 Related

| Problem                                                                                                         | Difficulty | Connection                                     |
| --------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------- |
| [202. Happy Number](https://leetcode.com/problems/happy-number/)                                                | Easy       | Repeated digit operations with cycle detection |
| [1085. Sum of Digits in the Minimum Number](https://leetcode.com/problems/sum-of-digits-in-the-minimum-number/) | Easy       | Sum of digits variant                          |
| [1688. Count of Matches in Tournament](https://leetcode.com/problems/count-of-matches-in-tournament/)           | Easy       | Mathematical shortcut pattern                  |
