---
layout: page
title: "Maximum Number of Balls in a Box"
difficulty: Easy
category: Math
tags: [Hash Table, Math, Counting]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-balls-in-a-box"
---

# Maximum Number of Balls in a Box / Số Bóng Nhiều Nhất Trong Một Hộp

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math — Digit Sum + Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Count Nice Pairs in an Array](https://leetcode.com/problems/count-nice-pairs-in-an-array) | [Sum of Digits in Base K](https://leetcode.com/problems/sum-of-digits-in-base-k)

---

## 🧠 Intuition / Tư Duy

**Analogy (🇻🇳):** Mỗi quả bóng được đánh số từ `lowLimit` đến `highLimit`. Quả bóng số `n` được bỏ vào hộp có số hiệu bằng **tổng các chữ số** của n (ví dụ: bóng 24 → hộp 2+4=6, bóng 99 → hộp 9+9=18). Đếm có bao nhiêu bóng vào mỗi hộp, rồi trả về số bóng tối đa.

**Pattern Recognition:**

- Signal: "digit sum" + "count per bucket" → **hash map** đếm theo khóa là digit sum
- Duyệt từng số, tính digit sum bằng cách chia liên tiếp cho 10
- Range nhỏ (lowLimit, highLimit ≤ 10^5) → digit sum tối đa = 9+9+9+9+9 = 45
- Có thể dùng array kích thước 46 thay vì Map để tối ưu bộ nhớ

**Visual — lowLimit=1, highLimit=10:**

```
Ball  Digit Sum   Box
 1      1          1: [1]
 2      2          2: [2]
...
 9      9          9: [9]
10    1+0=1        1: [1, 10]   ← two balls in box 1

box counts: {1:2, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1}
max = 2  (box #1)
```

---

## Problem Description

Balls are numbered `lowLimit` to `highLimit`. A ball numbered `i` goes into box number equal to the **digit sum** of `i`. Return the maximum number of balls in any one box. ([LeetCode 1742](https://leetcode.com/problems/maximum-number-of-balls-in-a-box))

Difficulty: Easy | Acceptance: 74.3%

- **Example 1**: lowLimit=1, highLimit=10 → `2` (box 1 has balls 1 and 10)
- **Example 2**: lowLimit=5, highLimit=15 → `2` (box 6 has balls 6 and 15)
- **Example 3**: lowLimit=19, highLimit=28 → `2`

Constraints: `1 ≤ lowLimit ≤ highLimit ≤ 10^5`

---

## 📝 Interview Tips

1. **Clarify**: "Hộp số hiệu là tổng chữ số, không phải chính số đó" / Box label is digit sum, not the ball number
2. **Digit sum**: "Tính digit sum: while (n > 0) { sum += n % 10; n = floor(n/10) }" / Standard digit extraction loop
3. **Data structure**: "Dùng Map hoặc array[46] để đếm — digit sum max = 45 cho số ≤ 99999" / Array is faster than Map for small key range
4. **Edge case**: "lowLimit == highLimit → chỉ có 1 bóng, max = 1" / Single ball always returns 1
5. **Optimize**: "Tính digit sum tăng dần: khi số tăng 1, digit sum thường tăng 1 (trừ khi có carry)" / Incremental digit sum is possible but complex
6. **Follow-up**: "Range 10^9 → vẫn O(n × log n) nhưng n lớn hơn" / Larger range doesn't change algorithm, just runs longer

---

## Solutions

```typescript
/**
 * Helper: compute digit sum of a positive integer
 */
function digitSum(n: number): number {
  let sum = 0;
  while (n > 0) {
    sum += n % 10;
    n = Math.floor(n / 10);
  }
  return sum;
}

/**
 * Solution 1: Hash Map — count balls per box
 * Time: O((highLimit - lowLimit + 1) * log(highLimit)) — log factor for digit sum
 * Space: O(max_digit_sum) = O(45) = O(1) effectively
 */
function countBallsMap(lowLimit: number, highLimit: number): number {
  const boxCount = new Map<number, number>();
  let maxBalls = 0;

  for (let i = lowLimit; i <= highLimit; i++) {
    const box = digitSum(i);
    const count = (boxCount.get(box) ?? 0) + 1;
    boxCount.set(box, count);
    maxBalls = Math.max(maxBalls, count);
  }

  return maxBalls;
}

/**
 * Solution 2: Fixed Array (slightly faster — digit sum ≤ 45 for numbers ≤ 99999)
 * Time: O((highLimit - lowLimit + 1) * digits)
 * Space: O(46) = O(1)
 */
function countBalls(lowLimit: number, highLimit: number): number {
  const boxes = new Array(46).fill(0); // max digit sum for 5-digit number = 9*5 = 45
  let maxBalls = 0;

  for (let i = lowLimit; i <= highLimit; i++) {
    const box = digitSum(i);
    boxes[box]++;
    if (boxes[box] > maxBalls) maxBalls = boxes[box];
  }

  return maxBalls;
}

// === Test Cases ===
console.log(countBalls(1, 10)); // 2  (box 1: balls 1, 10)
console.log(countBalls(5, 15)); // 2  (box 6: balls 6, 15)
console.log(countBalls(19, 28)); // 2
console.log(countBalls(1, 1)); // 1  (single ball)
console.log(countBalls(99990, 100000)); // check high end
```

---

## 🔗 Related Problems

- [Count Nice Pairs in an Array](https://leetcode.com/problems/count-nice-pairs-in-an-array) — digit reverse + frequency counting
- [Sum of Digits in Base K](https://leetcode.com/problems/sum-of-digits-in-base-k) — digit sum in arbitrary base
- [Add Digits](https://leetcode.com/problems/add-digits) — repeated digit sum until single digit (digital root)
- [Count Integers With Even Digit Sum](https://leetcode.com/problems/count-integers-with-even-digit-sum) — filter by digit sum parity
- [Maximum Number of Balls in a Box — LeetCode](https://leetcode.com/problems/maximum-number-of-balls-in-a-box) — problem page
