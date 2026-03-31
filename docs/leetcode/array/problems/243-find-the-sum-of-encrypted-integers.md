---
layout: page
title: "Find the Sum of Encrypted Integers"
difficulty: Easy
category: Array
tags: [Array, Math]
leetcode_url: "https://leetcode.com/problems/find-the-sum-of-encrypted-integers"
---

# Find the Sum of Encrypted Integers / Tổng Các Số Nguyên Đã Mã Hóa

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math (Digit Manipulation)
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Sum of Digits in Base K](https://leetcode.com/problems/sum-of-digits-in-base-k) | [Count of Interesting Subarrays](https://leetcode.com/problems/count-of-interesting-subarrays)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như thợ in con dấu — tìm chữ số to nhất trong tên, rồi in toàn bộ bằng chữ số đó. Số 521 → tìm max=5 → in "555". Sau đó cộng tất cả con dấu lại.

**Pattern Recognition:**

- `encrypt(x)`: find max digit `d` in x; result = `d` repeated `len(x)` times
- Build repeated digit number: d × 111...1 (k ones) = d × (10^k - 1) / 9
- Sum encrypt(x) for all x in nums

**Visual — encrypt step-by-step:**

```
encrypt(521):
  digits: [5,2,1] → maxDigit = 5, len = 3
  result: 555 = 5 × 111 = 5 × (10³-1)/9

encrypt(37):
  digits: [3,7] → maxDigit = 7, len = 2
  result: 77 = 7 × 11

encrypt(9):
  digits: [9] → maxDigit = 9, len = 1
  result: 9

nums=[1,2,3] → encrypt each: 1,2,3 → sum=6
nums=[10,21,31] → encrypt: 11,22,33 → sum=66
```

---

## Problem Description

The **encrypt** function replaces every digit of a positive integer with the **maximum digit** in the number. Return the **sum** of `encrypt(nums[i])` for all elements. ([LeetCode 3079](https://leetcode.com/problems/find-the-sum-of-encrypted-integers))

Difficulty: Easy | Acceptance: 73.7%

```
Example 1: nums=[1,2,3]    → 6   (encrypt(1)=1, encrypt(2)=2, encrypt(3)=3)
Example 2: nums=[10,21,31] → 66  (encrypt(10)=11, encrypt(21)=22, encrypt(31)=33)
```

Constraints:

- `1 <= nums.length <= 50`
- `1 <= nums[i] <= 1000`

---

## 📝 Interview Tips

1. **Clarify**: "encrypt thay toàn bộ chữ số bằng max digit, không phải chỉ max" / All digits replaced, not just the max one
2. **Build result**: "d lặp k lần = d × repunit(k), repunit = (10^k-1)/9" / d repeated k times = d × (10^k-1)/9
3. **String approach**: "Dùng string để đếm số chữ số dễ hơn" / String conversion makes digit counting trivial
4. **Edge case**: "Số 1 chữ số → encrypt giữ nguyên" / Single digit numbers encrypt to themselves
5. **Follow-up**: "Nếu x rất lớn (BigInt)? Dùng BigInt hoặc string math" / Very large x → use BigInt or string-based arithmetic
6. **Math shortcut**: "repunit(k) = 111...1 (k digits)" / Build it as string "1".repeat(k) then parseInt

---

## Solutions

```typescript
/**
 * Helper: encrypt a single integer
 * Replace every digit with the max digit in the number
 */
function encrypt(x: number): number {
  const s = x.toString();
  const maxDigit = Math.max(...s.split("").map(Number));
  // Build number with maxDigit repeated len(s) times
  return parseInt(String(maxDigit).repeat(s.length), 10);
}

/**
 * Solution 1: Brute Force (also optimal for this easy problem)
 * Time: O(n · d) — d = number of digits in each element (max ~4 for nums[i]≤1000)
 * Space: O(d) — string conversion
 */
function findTheSumOfEncryptedIntegersBrute(nums: number[]): number {
  let total = 0;
  for (const num of nums) {
    const s = num.toString();
    let maxD = 0;
    for (const ch of s) maxD = Math.max(maxD, parseInt(ch));
    // Append maxD repeated s.length times
    let encrypted = 0;
    for (let i = 0; i < s.length; i++) encrypted = encrypted * 10 + maxD;
    total += encrypted;
  }
  return total;
}

/**
 * Solution 2: Math with repunit formula
 * Time: O(n · d) | Space: O(1)
 * repunit(k) = (10^k - 1) / 9 = 1, 11, 111, 1111, ...
 */
function findTheSumOfEncryptedIntegers(nums: number[]): number {
  function encryptNum(x: number): number {
    let maxD = 0;
    let digits = 0;
    let tmp = x;
    while (tmp > 0) {
      maxD = Math.max(maxD, tmp % 10);
      digits++;
      tmp = Math.floor(tmp / 10);
    }
    // repunit(digits) = (10^digits - 1) / 9
    const repunit = (Math.pow(10, digits) - 1) / 9;
    return maxD * repunit;
  }

  return nums.reduce((sum, n) => sum + encryptNum(n), 0);
}

// === Test Cases ===
console.log(findTheSumOfEncryptedIntegers([1, 2, 3])); // 6
console.log(findTheSumOfEncryptedIntegers([10, 21, 31])); // 66
console.log(findTheSumOfEncryptedIntegers([521, 37, 9])); // 555+77+9 = 641
console.log(findTheSumOfEncryptedIntegers([1000])); // 1111 (max digit=1, 4 digits)
```

---

## 🔗 Related Problems

- [Sum of Digits in Base K](https://leetcode.com/problems/sum-of-digits-in-base-k) — digit manipulation
- [Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line) — Math pattern
- [Count Digits That Divide a Number](https://leetcode.com/problems/count-digits-that-divide-a-number) — digit iteration
- [Find the Sum of Encrypted Integers — LeetCode](https://leetcode.com/problems/find-the-sum-of-encrypted-integers) — problem page
