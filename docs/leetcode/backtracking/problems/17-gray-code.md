---
layout: page
title: "Gray Code"
difficulty: Medium
category: Backtracking
tags: [Math, Backtracking, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/gray-code"
---

# Gray Code / Mã Gray

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Single Number](https://leetcode.com/problems/single-number) | [Minimum Number of Lines to Cover Points](https://leetcode.com/problems/minimum-number-of-lines-to-cover-points)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đồng hồ số — khi chuyển từ 3→4, thay vì thay đổi nhiều bit cùng lúc (011→100), mã Gray chỉ đổi đúng 1 bit. Công thức ma thuật: `gray(i) = i XOR (i >> 1)`.

**Pattern Recognition:**

- Công thức bit đẹp: số thứ `i` trong Gray code = `i ^ (i >> 1)`
- Phản chiếu (reflected): `[0] → [0,1] → [00,01,11,10] → ...` — mỗi cấp mirror + thêm bit `1` phía trước

```
n=2: i  binary  gray(i^(i>>1))
     0    00       00 = 0
     1    01       01 = 1
     2    10       11 = 3
     3    11       10 = 2
Result: [0,1,3,2] — adjacent numbers differ by exactly 1 bit ✓
```

---

## Problem Description

An **n-bit Gray code sequence** is a sequence of `2^n` integers where every adjacent pair differs in exactly one bit, and the sequence wraps around (first and last also differ in one bit).

**Example 1:**

```
Input: n=2
Output: [0,1,3,2]  (or other valid sequences like [0,2,3,1])
```

**Example 2:**

```
Input: n=1
Output: [0,1]
```

**Constraints:** `1 ≤ n ≤ 16`

---

## 📝 Interview Tips

- 🇻🇳 **Công thức O(1)**: `gray(i) = i ^ (i >> 1)` — không cần backtracking
- 🇬🇧 Direct formula: the i-th Gray code = `i XOR (i >> 1)` — generate all 2^n values in O(n)
- 🇻🇳 **Reflected construction**: Gray code = mirror prefix + flip the new bit on mirrored half
- 🇬🇧 Reflected approach: double the sequence, prepend `0` to first half, `1` to second half
- 🇻🇳 Verify: `result[i] XOR result[i+1]` phải là lũy thừa của 2 (chỉ 1 bit khác)
- 🇬🇧 Validate: `(a ^ b) && !(a ^ b & (a ^ b - 1))` — true iff exactly one bit differs

---

## Solutions

### Solution 1: Formula — O(2^n)

```typescript
/**
 * Generate n-bit Gray code using the i ^ (i>>1) formula
 * @param {number} n - number of bits
 * @returns {number[]} Gray code sequence of length 2^n
 * Time: O(2^n) — iterate over all 2^n integers
 * Space: O(2^n) — output array
 */
function grayCode(n: number): number[] {
  const size = 1 << n; // 2^n
  const result: number[] = new Array(size);
  for (let i = 0; i < size; i++) {
    result[i] = i ^ (i >> 1);
  }
  return result;
}

console.log(grayCode(1)); // [0, 1]
console.log(grayCode(2)); // [0, 1, 3, 2]
console.log(grayCode(3)); // [0, 1, 3, 2, 6, 7, 5, 4]
```

### Solution 2: Reflected Construction (Backtracking-style)

```typescript
/**
 * Build Gray code by reflection: start with [0], then for each bit
 * mirror the array and add the new bit to mirrored elements
 * Time: O(2^n)
 * Space: O(2^n)
 */
function grayCodeReflected(n: number): number[] {
  let result = [0];
  for (let i = 0; i < n; i++) {
    const newBit = 1 << i;
    // Mirror current result and add newBit to each mirrored value
    const mirrored = result
      .slice()
      .reverse()
      .map((v) => v | newBit);
    result = result.concat(mirrored);
  }
  return result;
}

console.log(grayCodeReflected(2)); // [0, 1, 3, 2]
console.log(grayCodeReflected(3)); // [0,1,3,2,6,7,5,4]
// Verify adjacency
const seq = grayCodeReflected(3);
const valid = seq.every((v, i) => {
  const next = seq[(i + 1) % seq.length];
  const diff = v ^ next;
  return diff > 0 && (diff & (diff - 1)) === 0; // exactly one bit
});
console.log("All adjacent differ by 1 bit:", valid); // true
```

---

## 🔗 Related Problems

- [89. Gray Code](https://leetcode.com/problems/gray-code) ← this
- [136. Single Number](https://leetcode.com/problems/single-number) — XOR trick
- [190. Reverse Bits](https://leetcode.com/problems/reverse-bits) — bit manipulation
- [67. Add Binary](https://leetcode.com/problems/add-binary) — binary representation
- [78. Subsets](https://leetcode.com/problems/subsets) — bitmask enumeration
