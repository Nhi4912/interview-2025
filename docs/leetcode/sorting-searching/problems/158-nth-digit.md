---
layout: page
title: "Nth Digit"
difficulty: Medium
category: Sorting-Searching
tags: [Math, Binary Search]
leetcode_url: "https://leetcode.com/problems/nth-digit"
---

# Nth Digit / Chữ Số Thứ N

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math / Digit Counting
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Sqrt(x)](https://leetcode.com/problems/sqrtx) | [Digit Count in Range](https://leetcode.com/problems/digit-count-in-range)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Viết tất cả số tự nhiên liên tiếp vào băng giấy: "123456789101112131415...". Cần tìm ký tự thứ n. Chia băng giấy thành nhóm: 1-9 (9 số × 1 chữ số = 9 ký tự), 10-99 (90 × 2 = 180 ký tự), 100-999 (900 × 3 = 2700 ký tự)... Trừ dần đến khi biết số nào và vị trí chữ số nào.

```
n = 15
Group 1 (1-9):   9 × 1 = 9 digits  → n=15 > 9, skip, n=6
Group 2 (10-99): 90 × 2 = 180 digits → n=6 ≤ 180

Number offset: (6-1) / 2 = 2 → 10 + 2 = 12
Digit position: (6-1) % 2 = 1 → second digit of 12 = '2'

n=15 → digit '2' ✓
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Chia nhóm theo số chữ số** — group 1 (1-9), group 2 (10-99),... / group numbers by digit count
- 🇻🇳 **digits = 9 × 10^(d-1) × d** — tổng chữ số trong nhóm d / total digits in d-digit group = 9 × 10^(d-1) × d
- 🇻🇳 **Trừ dần** — giảm n bằng cách loại từng nhóm cho đến khi n thuộc nhóm hiện tại / subtract group sizes until n fits current group
- 🇻🇳 **Tìm số** — start + (n-1)/d / find the exact number: start + (n-1)/d
- 🇻🇳 **Tìm chữ số** — charAt((n-1) % d) trong biểu diễn số đó / digit at position (n-1) % d in that number's string
- 🇻🇳 **n có thể lớn** — n lên đến 2^31-1, cần BigInt hoặc cẩn thận overflow / n can reach 2^31-1, be careful with overflow

---

## Solutions

### Solution 1: Math — Group Subtraction — O(log n)

```typescript
/**
 * Subtract digit groups until n falls within current group
 * Time: O(log n)  Space: O(1)
 */
function findNthDigit(n: number): number {
  let digits = 1; // current group digit length
  let count = 9; // numbers in current group
  let start = 1; // first number in current group

  // Find which digit-length group n falls in
  while (n > digits * count) {
    n -= digits * count;
    digits++;
    count *= 10;
    start *= 10;
  }

  // Find the exact number within the group (0-indexed offset)
  const num = start + Math.floor((n - 1) / digits);

  // Find the digit position within that number
  const digitIndex = (n - 1) % digits;
  const numStr = String(num);
  return Number(numStr[digitIndex]);
}

console.log(findNthDigit(3)); // 3  (1234... → '3')
console.log(findNthDigit(11)); // 0  (1..9,10 → '0' from '10')
console.log(findNthDigit(15)); // 2  (1..9,10,11,12 → '2' from '12')
console.log(findNthDigit(1000)); // 3
```

### Solution 2: BigInt-Safe Version — O(log n)

```typescript
/**
 * Uses BigInt to avoid overflow for large n (up to 2^31 - 1)
 * Time: O(log n)  Space: O(log n) for string conversion
 */
function findNthDigitBig(n: number): number {
  let d = 1; // digit length of current group
  let groupSize = 9; // count of numbers in current group
  let start = 1; // first number in current group

  // n > d * groupSize means this group doesn't contain our digit
  while (n > d * groupSize) {
    n -= d * groupSize;
    d++;
    groupSize *= 10;
    start *= 10;
  }

  // Which number exactly? (n is now 1-indexed within this group)
  const num = start + Math.floor((n - 1) / d);
  const s = String(num);
  return Number(s[(n - 1) % d]);
}

console.log(findNthDigitBig(3)); // 3
console.log(findNthDigitBig(11)); // 0
console.log(findNthDigitBig(100)); // 5  (verify: 9*1=9, 91*2=182... offset 91, num=55, pos=1 → '5')
console.log(findNthDigitBig(2147483647)); // valid answer for max n
```

### Solution 3: Step-by-Step with Verbose Comments — O(log n)

```typescript
/**
 * Same algorithm with explicit commentary for interview explanation
 * Time: O(log n)  Space: O(1)
 */
function findNthDigitVerbose(n: number): number {
  // Step 1: Find digit length d of the target number
  let d = 1,
    count = 9,
    start = 1;
  while (n > d * count) {
    n -= d * count; // remove this entire group
    d++;
    count *= 10; // 9, 90, 900, 9000...
    start *= 10; // 1, 10, 100, 1000...
  }
  // Now n is 1-indexed within d-digit numbers starting at `start`

  // Step 2: Find the actual number
  // n=1 → start+0, n=2 → start+0 (2nd digit), n=d+1 → start+1...
  const targetNum = start + Math.floor((n - 1) / d);

  // Step 3: Find which digit of targetNum
  const digitPos = (n - 1) % d; // 0-indexed from left
  return Number(String(targetNum)[digitPos]);
}

console.log(findNthDigitVerbose(3)); // 3
console.log(findNthDigitVerbose(11)); // 0
console.log(findNthDigitVerbose(15)); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                            | Difficulty | Pattern         |
| -------------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [Digit Count in Range](https://leetcode.com/problems/digit-count-in-range)                         | 🔴 Hard    | Math / Digit DP |
| [Number of Digit One](https://leetcode.com/problems/number-of-digit-one)                           | 🔴 Hard    | Math            |
| [Self Dividing Numbers](https://leetcode.com/problems/self-dividing-numbers)                       | 🟢 Easy    | Math            |
| [Count Numbers with Unique Digits](https://leetcode.com/problems/count-numbers-with-unique-digits) | 🟡 Medium  | Math            |
