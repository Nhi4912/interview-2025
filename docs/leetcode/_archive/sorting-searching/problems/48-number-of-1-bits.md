---
layout: page
title: "Number of 1 Bits"
difficulty: Easy
category: Sorting-Searching
tags: [Divide and Conquer, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/number-of-1-bits"
---

# Number of 1 Bits / Đếm Bit 1

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Reverse Bits](https://leetcode.com/problems/reverse-bits) | [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Đếm số đèn bật trong dãy công tắc 32 chiếc — có thể kiểm tra từng chiếc (brute), hoặc dùng mẹo: mỗi lần nhấn `n & (n-1)` sẽ tắt đèn cuối cùng đang bật.

**Pattern Recognition:**

- Signal: "count set bits" / "Hamming weight" → **Bit Manipulation**
- `n & (n-1)` xóa bit 1 thấp nhất của n — loop cho đến khi n = 0
- Key insight: số lần lặp = số bit 1, không phụ thuộc tổng số bit

**Visual — n = 00000000000000000000000000001011 (decimal 11):**

```
n = 1011   count=0
n & (n-1) = 1011 & 1010 = 1010,  count=1  (cleared rightmost 1)
n & (n-1) = 1010 & 1001 = 1000,  count=2  (cleared next 1)
n & (n-1) = 1000 & 0111 = 0000,  count=3  (cleared last 1)
n = 0 → stop.  Answer = 3 ✅
```

---

## Problem Description

Cho số nguyên không dấu 32-bit `n`, trả về **số lượng bit 1** trong biểu diễn nhị phân (còn gọi là Hamming weight). ([LeetCode](https://leetcode.com/problems/number-of-1-bits))

Difficulty: Easy | Acceptance: 74.5%

- `n = 00000000000000000000000000001011` → `3` (ba bit 1)
- `n = 00000000000000000000000010000000` → `1`
- `n = 11111111111111111111111111111101` → `31`

Constraints: The input must be a binary string of length 32.

---

## 📝 Interview Tips

1. **Clarify**: "n có thể âm không (signed vs unsigned)? JavaScript dùng 32-bit signed" / Unsigned 32-bit in problem
2. **Brute force**: "Dịch bit từng vị trí, check &1 — luôn 32 iterations" / Always 32 iterations
3. **Kernighan's trick**: "n & (n-1) xóa bit 1 thấp nhất — chỉ lặp #bits_set lần" / Only loops k times where k = popcount
4. **Built-in**: "Thực tế có thể dùng toString(2).split('1').length - 1 hoặc Math.clz32" / But understand the bit trick
5. **Edge cases**: "n = 0 → 0; n = 2^32 - 1 = all 1s → 32" / All zeros or all ones
6. **Follow-up**: "Counting bits cho 0..n → dynamic programming O(n)" / DP variation: Counting Bits

---

## Solutions

```typescript
/**
 * Solution 1: Check Each Bit (Naive)
 * Time: O(32) = O(1) — always checks 32 bits
 * Space: O(1)
 */
function hammingWeightNaive(n: number): number {
  let count = 0;
  for (let i = 0; i < 32; i++) {
    if ((n >>> i) & 1) count++;
  }
  return count;
}

/**
 * Solution 2: Brian Kernighan's Algorithm — n & (n-1)
 * Time: O(k) where k = number of 1-bits — fewer iterations
 * Space: O(1)
 */
function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1); // clears the lowest set bit
    count++;
  }
  return count;
}

/**
 * Solution 3: Lookup Table / toString trick (interview "clever" answer)
 * Time: O(1) — constant for 32-bit numbers
 * Space: O(1)
 */
function hammingWeightString(n: number): number {
  // Convert to unsigned 32-bit, then count '1' chars
  return (n >>> 0)
    .toString(2)
    .split("")
    .filter((c) => c === "1").length;
}

// === Test Cases ===
console.log(hammingWeight(0b00000000000000000000000000001011)); // 3
console.log(hammingWeight(0b00000000000000000000000010000000)); // 1
console.log(hammingWeight(0b11111111111111111111111111111101)); // 31
console.log(hammingWeightNaive(11)); // 3
```

---

## 🔗 Related Problems

- [Reverse Bits](https://leetcode.com/problems/reverse-bits) — bit manipulation on 32-bit integer
- [Counting Bits](https://leetcode.com/problems/counting-bits) — DP using n & (n-1): `dp[n] = dp[n & (n-1)] + 1`
- [Missing Number](https://leetcode.com/problems/missing-number) — XOR bit trick
- [Power of Two](https://leetcode.com/problems/power-of-two) — uses `n & (n-1) === 0` check
- [Number of 1 Bits — LeetCode](https://leetcode.com/problems/number-of-1-bits) — problem page
