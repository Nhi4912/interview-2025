---
layout: page
title: "Reverse Bits"
difficulty: Easy
category: Sorting-Searching
tags: [Divide and Conquer, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/reverse-bits"
---

# Reverse Bits / Đảo Ngược Bit

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits) | [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Tưởng tượng bạn đọc số nhị phân từ phải sang trái rồi ghi lại từ trái sang phải — giống như đọc một cuốn sách gương. Mỗi bước: lấy bit cuối cùng của `n`, dịch nó vào vị trí đúng trong kết quả, rồi dịch `n` sang phải.

```
n    = 00000010100101000001111010011100 (43261596)
          ↓  read right-to-left, write left-to-right
result = 00111001011110000010100101000000 (964176192)

Approach:
  step i: result |= (n & 1) << (31 - i)
          n >>>= 1
```

---

## Problem Description

Reverse the bits of a given 32-bit unsigned integer and return the result as a number.

- **Example 1:** `n = 43261596` (binary: `00000010100101000001111010011100`) → `964176192` (`00111001011110000010100101000000`)
- **Example 2:** `n = 4294967293` (binary: `11111111111111111111111111111101`) → `3221225471` (`10111111111111111111111111111111`)

---

## 📝 Interview Tips

- 🔄 **Idea cốt lõi / Core idea:** Extract LSB of `n` each iteration, place it at position `31-i` in result
- ⚠️ **JS gotcha:** JS numbers are 64-bit float — use `>>> 0` to force unsigned 32-bit interpretation
- 🪞 **Swap approach:** Swap pairs of bits (divide and conquer), đây là cách O(1) với bitmask constants
- 📊 **Complexity:** O(32) = O(1) — always exactly 32 iterations
- 🗂️ **Follow-up (repeated calls):** Cache result by byte (4 × 8-bit lookups) — reduces to O(1) per call
- 💡 **Interview:** Luôn hỏi "unsigned hay signed?" — ảnh hưởng cách xử lý MSB

---

## Solutions

### Solution 1: Bit-by-bit extraction (most intuitive)

```typescript
/**
 * Extract each bit from right, place at mirrored position
 * Time: O(32) = O(1)  Space: O(1)
 */
function reverseBits(n: number): number {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result * 2 + (n & 1)) >>> 0;
    n >>>= 1;
  }
  return result >>> 0;
}

console.log(reverseBits(43261596)); // 964176192
console.log(reverseBits(0)); // 0
console.log(reverseBits(1)); // 2147483648
```

### Solution 2: Divide and conquer with bit masks

```typescript
/**
 * Swap pairs of bits using masks — classic D&C approach
 * Time: O(1)  Space: O(1)
 */
function reverseBitsDC(n: number): number {
  // Swap 16-bit halves
  n = ((n & 0xffff0000) >>> 16) | ((n & 0x0000ffff) << 16);
  // Swap 8-bit groups
  n = ((n & 0xff00ff00) >>> 8) | ((n & 0x00ff00ff) << 8);
  // Swap 4-bit groups
  n = ((n & 0xf0f0f0f0) >>> 4) | ((n & 0x0f0f0f0f) << 4);
  // Swap 2-bit groups
  n = ((n & 0xcccccccc) >>> 2) | ((n & 0x33333333) << 2);
  // Swap adjacent bits
  n = ((n & 0xaaaaaaaa) >>> 1) | ((n & 0x55555555) << 1);
  return n >>> 0;
}

console.log(reverseBitsDC(43261596)); // 964176192
console.log(reverseBitsDC(4294967293)); // 3221225471
```

### Solution 3: String-based (for interviews when you forget masks)

```typescript
/**
 * Convert to binary string, pad to 32 bits, reverse, parse back
 * Time: O(32) = O(1)  Space: O(32) = O(1)
 */
function reverseBitsString(n: number): number {
  const binary = (n >>> 0).toString(2).padStart(32, "0");
  return parseInt(binary.split("").reverse().join(""), 2);
}

console.log(reverseBitsString(43261596)); // 964176192
console.log(reverseBitsString(0)); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                   | Difficulty | Connection                  |
| --------------------------------------------------------------------------------------------------------- | ---------- | --------------------------- |
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/)                                       | 🟢 Easy    | Same bit extraction pattern |
| [Sort Integers by Number of 1 Bits](https://leetcode.com/problems/sort-integers-by-the-number-of-1-bits/) | 🟢 Easy    | Bit counting sibling        |
| [Single Number](https://leetcode.com/problems/single-number/)                                             | 🟢 Easy    | Bit manipulation (XOR)      |
| [Bitwise AND of Numbers Range](https://leetcode.com/problems/bitwise-and-of-numbers-range/)               | 🟡 Medium  | Bit masking techniques      |
| [Counting Bits](https://leetcode.com/problems/counting-bits/)                                             | 🟢 Easy    | DP + bit manipulation       |
