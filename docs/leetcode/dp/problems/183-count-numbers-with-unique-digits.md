---
layout: page
title: "Count Numbers with Unique Digits"
difficulty: Medium
category: Dynamic Programming
tags: [Math, Dynamic Programming, Backtracking]
leetcode_url: "https://leetcode.com/problems/count-numbers-with-unique-digits"
---

# Count Numbers with Unique Digits / Đếm Số Có Chữ Số Không Lặp

🟡 Medium | Dynamic Programming · Combinatorics

---

## 🧠 Intuition

**EN:** For exactly `d` digits (d≥2): first digit has 9 choices (1-9), second has 9 (0-9 minus first), third has 8, etc. Sum over `d` from 1 to `n`. For `n=0` answer is 1 (just the number 0). For `n=1` answer is 10 (0–9).

**VI:** Với đúng `d` chữ số (d≥2): chữ số đầu có 9 lựa chọn (1-9), chữ số hai có 9 (0-9 trừ chữ số đầu), chữ số ba có 8, v.v. Cộng tổng từ d=1 đến n. n=0 → 1 (chỉ số 0). n=1 → 10 (0–9).

```
Exactly d unique digits (d >= 2):
  count(d) = 9 * 9 * 8 * 7 * ... * (9 - d + 2)
               ^   ^   ^           ^
             1st  2nd 3rd        d-th digit

  1-digit: 9 numbers (1-9), plus 0 → handled separately
  2-digit: 9 * 9 = 81
  3-digit: 9 * 9 * 8 = 648
  ...
  10-digit: 9 * 9 * 8 * 7 * 6 * 5 * 4 * 3 * 2 * 1 = 3265920

Total for n digits = 1 (for 0) + Σ count(d) for d=1..n
```

---

## 📝 Interview Tips

- 🔑 **EN:** For d-digit numbers: first digit 9 choices (1-9), then remaining d-1 digits from remaining 9,8,7... **VI:** Số d chữ số: chữ số đầu có 9 cách (1-9), các chữ số tiếp theo từ 9,8,7... còn lại.
- 🔑 **EN:** Beyond 10 digits: `count = 0` (only 10 distinct digits, can't have 11+ unique). **VI:** Hơn 10 chữ số: count = 0 (chỉ có 10 chữ số phân biệt).
- 🔑 **EN:** Formula: `count(d) = 9 * product(9 down to 9-d+2)` for d≥2, `count(1)=9`. **VI:** Công thức: count(d) = 9 \* tích từ 9 xuống (9-d+2) với d≥2, count(1)=9.
- 🔑 **EN:** Add 1 for the number 0 itself (covered by `n≥0`). **VI:** Cộng thêm 1 cho số 0 (n≥0 thì 0 luôn được tính).
- 🔑 **EN:** Cumulative sum: answer for n = answer for n-1 + count(n). **VI:** Tổng tích lũy: kết quả n = kết quả n-1 + count(n).
- 🔑 **EN:** Digit DP also works but closed-form is O(n). **VI:** DP chữ số cũng được, nhưng công thức đóng là O(n).

---

## 💡 Solutions

```typescript
/**
 * Combinatorics: count d-digit numbers with all unique digits
 * Time: O(n)  Space: O(1)
 */
function countNumbersWithUniqueDigits(n: number): number {
  if (n === 0) return 1; // only 0

  let total = 10; // 1-digit: 0..9
  let uniqueCount = 9; // first non-trivial digit choices
  let available = 9; // remaining digit choices (after first digit)

  for (let d = 2; d <= Math.min(n, 10); d++) {
    uniqueCount *= available; // d-digit unique numbers
    total += uniqueCount;
    available--;
  }

  return total;
}

/**
 * Explicit formula version (same logic, more verbose)
 * Time: O(n)  Space: O(1)
 */
function countNumbersWithUniqueDigitsV2(n: number): number {
  if (n === 0) return 1;

  // count[d] = number of d-digit numbers with all unique digits
  // count[1] = 9 (1..9; 0 is counted separately)
  // count[2] = 9*9 = 81
  // count[d] = 9 * 9 * 8 * 7 * ... * (9-d+2)  for 2<=d<=10
  let result = 1; // for 0
  result += 9; // for 1-digit numbers 1..9

  let factor = 9 * 9; // start with 2-digit factor = 9*9
  let remaining = 8; // next multiplier for 3-digit etc.

  for (let d = 2; d <= Math.min(n, 10); d++) {
    result += factor;
    if (d < 10) {
      factor *= remaining;
      remaining--;
    }
  }

  return result;
}

/**
 * DP approach (bottom-up for illustration)
 * Time: O(n)  Space: O(n)
 */
function countNumbersWithUniqueDigitsDP(n: number): number {
  if (n === 0) return 1;

  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // just the number 0
  dp[1] = 10; // 0..9

  for (let d = 2; d <= Math.min(n, 10); d++) {
    // d-digit unique: 9 * (9 * 8 * ... * (9-d+2))
    let ways = 9; // first digit: 1-9
    let pool = 9; // remaining pool for subsequent digits
    for (let k = 1; k < d; k++) {
      ways *= pool;
      pool--;
    }
    dp[d] = dp[d - 1] + ways;
  }

  return dp[n];
}

// Tests
console.log(countNumbersWithUniqueDigits(0)); // 1
console.log(countNumbersWithUniqueDigits(1)); // 10
console.log(countNumbersWithUniqueDigits(2)); // 91
console.log(countNumbersWithUniqueDigits(3)); // 739
console.log(countNumbersWithUniqueDigitsDP(2)); // 91
```

---

## 🔗 Related Problems

| Problem                                                                                                               | Difficulty | Pattern       |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [The Number of Beautiful Subsets](https://leetcode.com/problems/the-number-of-beautiful-subsets/)                     | 🟡 Medium  | Combinatorics |
| [Permutations](https://leetcode.com/problems/permutations/)                                                           | 🟡 Medium  | Backtracking  |
| [Numbers With Same Consecutive Differences](https://leetcode.com/problems/numbers-with-same-consecutive-differences/) | 🟡 Medium  | Digit DP      |
