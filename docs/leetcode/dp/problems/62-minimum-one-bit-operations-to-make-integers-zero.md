---
layout: page
title: "Minimum One Bit Operations to Make Integers Zero"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming, Bit Manipulation, Memoization]
leetcode_url: "https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero"
---

# Minimum One Bit Operations to Make Integers Zero / Số Bước Tối Thiểu Để Đưa Số Nguyên Về 0

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Bit Manipulation / Gray Code
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Integer Replacement](https://leetcode.com/problems/integer-replacement) | [Minimum One Bit Operations to Make Integers Zero](https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ đến mã Gray — một chuỗi nhị phân mà mỗi bước chỉ thay đổi đúng 1 bit. Để đến từ số n về 0, bạn cần đi ngược lại chuỗi Gray, và số bước chính là **thứ tự (index) của n trong chuỗi Gray**.

**Pattern Recognition:**

- Mỗi phép toán cho phép: (1) flip bit 0, hoặc (2) flip bit i nếu bit i-1=1 và tất cả bit dưới i-1=0
- Đây chính xác là cách di chuyển trong chuỗi Gray Code!
- Key insight: `minimumOps(n)` = vị trí của n trong chuỗi Gray = **Inverse Gray Code** của n

**Visual — Gray Code Sequence:**

```
index: 0  1  2  3  4  5  6  7
Gray:  0  1  3  2  6  7  5  4

n=6 → Gray code position = 4 (cần 4 bước để về 0)

inverseGray(6 = 110):
  mask = 011 → n = 110 ^ 011 = 101
  mask = 001 → n = 101 ^ 001 = 100 = 4 ✓
```

---

## Problem Description

Given an integer `n`, you must transform it to `0` using the minimum number of operations. Two operations are allowed: (1) flip bit 0, or (2) flip bit `i` if bit `i-1` is 1 and all bits below `i-1` are 0. ([LeetCode #1611](https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero))

**Example 1:** `n = 3` → `2` (3→2→0)
**Example 2:** `n = 6` → `4` (6→2→3→1→0, encoded as Gray code position 4)

Constraints: `0 <= n <= 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Có giới hạn gì về n không? n=0 phải trả về 0" / Confirm n=0 returns 0 immediately
2. **Key recognition**: "Nhận ra đây là bài Gray Code đảo ngược / Recognize inverse Gray code pattern"
3. **Brute force**: "BFS từ n → 0 với 2 phép toán, O(n) states / BFS works but O(n) memory"
4. **Optimal**: "Inverse Gray = XOR liên tiếp n >> 1, n >> 2, ... / Keep XOR-shifting mask right"
5. **Recursive alt**: "f(n) = 2^k - 1 - f(n ^ (1<<(k-1))) với k=MSB position / Recursive Gray inversion"
6. **Edge cases**: "n=0 → 0, n=1 → 1, n=2 → 3 (vì 2 ở vị trí 3 trong Gray code) / Verify small values"

---

## Solutions

```typescript
/**
 * Solution 1: Recursive (Gray Code inverse via recursion)
 * Time: O(log n) — number of bits
 * Space: O(log n) — recursion stack depth
 */
function minimumOneBitOperationsRecursive(n: number): number {
  if (n === 0) return 0;
  // Find position of highest set bit
  let k = 0;
  while (1 << (k + 1) <= n) k++;
  // f(n) = 2^k - 1 - f(n XOR (1<<(k-1)))
  return (1 << k) - 1 - minimumOneBitOperationsRecursive(n ^ (1 << (k - 1)));
}

/**
 * Solution 2: Iterative Inverse Gray Code (Optimal)
 * Time: O(log n) — iterate over bits
 * Space: O(1) — constant extra space
 *
 * Insight: The answer equals inverseGray(n).
 * inverseGray(g): XOR g with g>>1, g>>2, ... until mask = 0
 */
function minimumOneBitOperations(n: number): number {
  let mask = n >> 1;
  while (mask > 0) {
    n ^= mask;
    mask >>= 1;
  }
  return n;
}

// === Test Cases ===
console.log(minimumOneBitOperations(0)); // 0
console.log(minimumOneBitOperations(1)); // 1
console.log(minimumOneBitOperations(2)); // 3  (Gray position: 0,1,3,2 → 2 is at index 3)
console.log(minimumOneBitOperations(3)); // 2
console.log(minimumOneBitOperations(6)); // 4  (LeetCode example)
```

---

## 🔗 Related Problems

| Problem                                                                                                                                              | Pattern          | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| [Integer Replacement](https://leetcode.com/problems/integer-replacement)                                                                             | BFS / Math       | Medium     |
| [Decode XORed Array](https://leetcode.com/problems/decode-xored-array)                                                                               | Bit Manipulation | Easy       |
| [Minimum Number of Operations to Make Array XOR Equal to K](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-xor-equal-to-k) | Bit Manipulation | Medium     |
| [Total Hamming Distance](https://leetcode.com/problems/total-hamming-distance)                                                                       | Bit Manipulation | Medium     |
