---
layout: page
title: "Smallest Value of the Rearranged Number"
difficulty: Medium
category: Sorting-Searching
tags: [Math, Sorting]
leetcode_url: "https://leetcode.com/problems/smallest-value-of-the-rearranged-number"
---

# Smallest Value of the Rearranged Number / Giá Trị Nhỏ Nhất Của Số Sắp Xếp Lại

---

## 🧠 Intuition / Tư Duy

**Analogy:** **EN:** For **negative** numbers: to get the smallest (most negative) value, we want the largest absolute value → sort digits **descending** and negate. For **positive** numbers: sort digits **ascending** but move the smallest non-zero digit to the front to avoid a leading zero.

**VI:** Với số **âm**: muốn số nhỏ nhất (âm nhất) → giá trị tuyệt đối lớn nhất → sắp xếp chữ số **giảm dần** rồi phủ định. Với số **dương**: sắp xếp **tăng dần** nhưng chuyển chữ số khác 0 nhỏ nhất lên đầu để tránh số 0 đứng đầu.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Smallest Value of the Rearranged Number example:**

```
num = -7605  →  digits: [7,6,0,5]
  negative → sort descending: [7,6,5,0] → -7650  ✓ smallest negative

num = 310    →  digits: [3,1,0]
  positive → sort ascending: [0,1,3] → has leading zero!
  swap first non-zero (1) to front: [1,0,3] → 103  ✓

num = -1      →  digits: [1]
  negative → -1  ✓

num = 0       →  return 0
```

---

---

## Problem Description

| #   | Problem                         | Difficulty | Pattern             |
| --- | ------------------------------- | ---------- | ------------------- |
| 1   | Largest Number                  | 🟡 Medium  | custom digit sort   |
| 2   | Next Permutation                | 🟡 Medium  | digit rearrangement |
| 3   | Smallest Number in Infinite Set | 🟡 Medium  | greedy construction |

---

## 📝 Interview Tips

- ➕➖ **EN:** Three cases: zero, negative, positive. Handle `num === 0` separately. **VI:** Ba trường hợp: không, âm, dương. Xử lý `num === 0` riêng.
- 🔢 **EN:** For negative: sort absolute value digits descending → largest abs value → most negative. **VI:** Số âm: sắp giảm dần → giá trị tuyệt đối lớn nhất → số âm nhỏ nhất.
- 🔢 **EN:** For positive: sort ascending first, then swap first `'0'` position with first non-zero digit. **VI:** Số dương: sắp tăng dần, rồi hoán đổi '0' đầu tiên với chữ số khác 0 nhỏ nhất.
- 🚫 **EN:** `Math.abs(num).toString()` extracts digits cleanly; `split('')` + `sort()` handles multi-digit. **VI:** Dùng `Math.abs(num).toString()` để lấy chữ số sạch.
- ⚠️ **EN:** Edge case: num = 0 → return 0 without sorting. Also num with all zeros except one digit. **VI:** Trường hợp đặc biệt: num = 0. Số chỉ có một chữ số khác 0 cùng nhiều số 0.
- 🧪 **EN:** Verify: for num = -10, result should be -10 (digits [1,0] → sort desc [1,0] → -10). **VI:** Kiểm tra: num = -10 → kết quả là -10.

---

---

## Solutions

```typescript
/**
 * Sort digits of abs(num) in order per sign, handle leading zero for positive
 * Time: O(d log d) where d = number of digits  Space: O(d)
 */
function smallestNumber(num: number): number {
  if (num === 0) return 0;

  const digits = Math.abs(num).toString().split("");

  if (num < 0) {
    // Largest absolute value = smallest negative → sort descending
    digits.sort((a, b) => Number(b) - Number(a));
    return -Number(digits.join(""));
  } else {
    // Smallest positive value → sort ascending, fix leading zero
    digits.sort((a, b) => Number(a) - Number(b));
    // Find first non-zero digit and move it to front
    const firstNonZero = digits.findIndex((d) => d !== "0");
    if (firstNonZero > 0) {
      [digits[0], digits[firstNonZero]] = [digits[firstNonZero], digits[0]];
    }
    return Number(digits.join(""));
  }
}

// Tests
console.log(smallestNumber(310)); // 103
console.log(smallestNumber(-7605)); // -7650
console.log(smallestNumber(0)); // 0
console.log(smallestNumber(-1)); // -1
console.log(smallestNumber(100200)); // 100002
console.log(smallestNumber(-100)); // -100 (sort desc [1,0,0] → "100" → -100)

/**
 * Count digit frequencies; build result by reading freq array in order.
 * Effectively counting sort — O(d) time for digit processing.
 * Time: O(d)  Space: O(10) = O(1)
 */
function smallestNumber2(num: number): number {
  if (num === 0) return 0;

  const freq = new Array(10).fill(0);
  let n = Math.abs(num);
  while (n > 0) {
    freq[n % 10]++;
    n = Math.floor(n / 10);
  }

  let result = "";
  if (num > 0) {
    // Ascending: find smallest non-zero digit first, then all digits asc
    for (let d = 1; d <= 9; d++) {
      if (freq[d] > 0) {
        result += d.toString();
        freq[d]--;
        break; // place one non-zero digit at front
      }
    }
    // Fill remaining: 0-9 in order
    for (let d = 0; d <= 9; d++) {
      result += d.toString().repeat(freq[d]);
    }
    return Number(result);
  } else {
    // Descending: 9 → 0
    for (let d = 9; d >= 0; d--) {
      result += d.toString().repeat(freq[d]);
    }
    return -Number(result);
  }
}

// Tests
console.log(smallestNumber2(310)); // 103
console.log(smallestNumber2(-7605)); // -7650
console.log(smallestNumber2(100200)); // 100002

/**
 * Functional style using spread + sort with sign correction
 * Time: O(d log d)  Space: O(d)
 */
function smallestNumber3(num: number): number {
  if (num === 0) return 0;
  const sign = num < 0 ? -1 : 1;
  const digits = Math.abs(num).toString().split("").sort();
  if (sign === 1 && digits[0] === "0") {
    const nz = digits.findIndex((d) => d !== "0");
    [digits[0], digits[nz]] = [digits[nz], digits[0]];
    return Number(digits.join(""));
  }
  return sign * Number(sign === -1 ? digits.reverse().join("") : digits.join(""));
}

console.log(smallestNumber3(-7605)); // -7650
console.log(smallestNumber3(310)); // 103
```

---

## 🔗 Related Problems

| #   | Problem                         | Difficulty | Pattern             |
| --- | ------------------------------- | ---------- | ------------------- |
| 1   | Largest Number                  | 🟡 Medium  | custom digit sort   |
| 2   | Next Permutation                | 🟡 Medium  | digit rearrangement |
| 3   | Smallest Number in Infinite Set | 🟡 Medium  | greedy construction |
