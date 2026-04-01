---
layout: page
title: "Count Integers With Even Digit Sum"
difficulty: Easy
category: Array
tags: [Math, Simulation]
leetcode_url: "https://leetcode.com/problems/count-integers-with-even-digit-sum"
---

# Count Integers With Even Digit Sum / Đếm Số Nguyên Có Tổng Chữ Số Chẵn

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Multiply Strings](https://leetcode.com/problems/multiply-strings) | [Add Binary](https://leetcode.com/problems/add-binary)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Đếm số học sinh trong lớp có tổng điểm thi chẵn. Lớp có tối đa 1000 bạn → duyệt từng người từ 1 đến num, tính tổng chữ số, kiểm tra chẵn lẻ. Đơn giản vì num ≤ 1000 (constraints nhỏ)!

**Pattern Recognition:**

- Signal: "count integers in [1, num]", small constraint (≤1000), digit property → **Simulation / Math**
- Key insight: với num ≤ 1000 → O(num × log(num)) là đủ; có công thức O(1) nhưng không cần thiết

**Visual — num=4:**

```
n=1: digits=[1], sum=1 (odd)  → ✗
n=2: digits=[2], sum=2 (even) → ✓
n=3: digits=[3], sum=3 (odd)  → ✗
n=4: digits=[4], sum=4 (even) → ✓

Count = 2
```

---

## 📝 Problem Description

Given a positive integer `num`. Return the count of positive integers in range `[1, num]` whose digit sum is even.

**Example 1:** `num=4` → `2` (numbers 2 and 4)
**Example 2:** `num=30` → `14`

**Constraints:** `1 ≤ num ≤ 1000`

---

## 🎯 Interview Tips

1. **Helper function** / Hàm phụ: viết `digitSum(n)` riêng cho code rõ ràng
2. **Digit sum helper** / Tính tổng chữ số: `while n > 0: sum += n%10; n = floor(n/10)`
3. **Even check** / Kiểm tra chẵn: `sum % 2 === 0`
4. **Pattern observation** / Quan sát pattern: cứ 2 số liên tiếp thì 1 số có tổng chẵn → kết quả ≈ num/2
5. **Math formula** / Công thức toán: số có tổng chữ số chẵn trong [1,n] ≈ `floor(n/2)` → nhưng verify cẩn thận edge
6. **Edge case** / Trường hợp đặc biệt: `num=1` → chỉ có 1 số (digit sum=1, lẻ) → trả về 0

---

## 💡 Solutions

### Approach 1: Brute Force Simulation

/\*_ @complexity Time: O(num × log(num)) | Space: O(1) _/

```typescript
function countEvenBrute(num: number): number {
  let count = 0;
  for (let n = 1; n <= num; n++) {
    let s = n,
      sum = 0;
    while (s > 0) {
      sum += s % 10;
      s = Math.floor(s / 10);
    }
    if (sum % 2 === 0) count++;
  }
  return count;
}
```

### Approach 2: Clean with Helper Function

/\*_ @complexity Time: O(num × log(num)) | Space: O(1) _/

```typescript
function countEven(num: number): number {
  const digitSum = (n: number): number => {
    let s = 0;
    while (n > 0) {
      s += n % 10;
      n = Math.floor(n / 10);
    }
    return s;
  };

  let count = 0;
  for (let n = 1; n <= num; n++) {
    if (digitSum(n) % 2 === 0) count++;
  }
  return count;
}
```

### Approach 3: Math Formula — O(1)

/\*_ @complexity Time: O(log(num)) | Space: O(1) _/

```typescript
function countEvenMath(num: number): number {
  // Key insight: digit sum parity flips every integer except at 10^k boundaries
  // For most ranges: exactly floor(num/2) integers have even digit sum
  // Adjust based on whether num itself has even digit sum and digit sum of num
  const digitSum = (n: number): number => {
    let s = 0;
    while (n > 0) {
      s += n % 10;
      n = Math.floor(n / 10);
    }
    return s;
  };
  // Count: (num - 1) / 2 rounded based on starting digit sum of 1
  // 1 has odd sum, so even-sum numbers start from 2: 2,4,6,8,10(odd!),...
  return digitSum(num) % 2 === 0 ? Math.floor(num / 2) : Math.floor((num - 1) / 2);
}
```

---

## 🧪 Test Cases

```typescript
console.log(countEven(4)); // → 2 (2, 4)
console.log(countEven(30)); // → 14
console.log(countEven(1)); // → 0 (digit sum of 1 is odd)
console.log(countEven(100)); // → 49
console.log(countEvenMath(30)); // → 14
console.log(countEvenBrute(30)); // → 14
```

---

## Related Problems

| Problem                                                                                                   | Difficulty | Pattern           |
| --------------------------------------------------------------------------------------------------------- | ---------- | ----------------- |
| [Add Digits](https://leetcode.com/problems/add-digits)                                                    | Easy       | Math/Digital Root |
| [Sum of Digits in Base K](https://leetcode.com/problems/sum-of-digits-in-base-k)                          | Easy       | Math              |
| [Count Integers With Even Digit Sum II](https://leetcode.com/problems/count-integers-with-even-digit-sum) | -          | Math/DP           |
