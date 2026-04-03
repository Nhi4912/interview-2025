---
layout: page
title: "Single Number II"
difficulty: Medium
category: Array
tags: [Array, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/single-number-ii"
---

# Single Number II / Số Đơn Lẻ II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bit Manipulation
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Single Number](https://leetcode.com/problems/single-number) | [Single Number III](https://leetcode.com/problems/single-number-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bộ đếm modulo-3 — mỗi bit xuất hiện 3 lần thì "reset về 0", bit xuất hiện 1 lần còn lại là bit của số đơn lẻ. Dùng hai biến `ones` và `twos` như flip-flops để mô phỏng bộ đếm 3 trạng thái.

```
nums = [2, 2, 3, 2]   binary: 010, 010, 011, 010

Bit position 1 (value=2): appears 3 times → count%3 = 0 → bit=0 in answer
Bit position 0 (value=1): appears 1 time  → count%3 = 1 → bit=1 in answer
→ answer = 011₂ = 3

State machine per-bit (ones, twos):
  start:     (0,0)
  see bit=1: (1,0)  ← ones gets it
  see bit=1: (0,1)  ← ones clears, twos gets it
  see bit=1: (0,0)  ← twos clears (appeared 3 times, reset)
```

---

## Problem Description

Given an integer array `nums` where every element appears **exactly three times** except for one which appears **exactly once**, find and return the single element. Must solve with `O(1)` extra space.

- Example 1: `nums = [2,2,3,2]` → `3`
- Example 2: `nums = [0,1,0,1,0,1,99]` → `99`

Constraints: `1 <= nums.length <= 3*10^4`, `-2^31 <= nums[i] <= 2^31-1`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Tất cả số xuất hiện đúng 3 lần trừ một số duy nhất xuất hiện 1 lần?" / Confirm the problem guarantees exactly one outlier.
2. **Brute force / Brute force**: "HashMap đếm tần số O(n) time O(n) space — nhưng yêu cầu O(1) space" / HashMap works but violates the space constraint; mention it as a stepping stone.
3. **Bit trick / Mẹo bit**: "`ones` lưu bit xuất hiện 1 lần, `twos` lưu bit 2 lần; khi bit lên 3 lần → xóa cả hai" / Two-variable finite state machine tracks count mod 3 per bit.
4. **Count mod k / Đếm mod k**: "Mỗi bit của đáp án có số lần xuất hiện ≡ 1 (mod 3)" / Any bit set in answer appears 3m+1 times; all others appear 3m times.
5. **Complexity / Độ phức tạp**: "O(n) time, O(1) space — duyệt một lần qua mảng" / Single linear scan, two integer variables regardless of input size.
6. **Generalize / Tổng quát hóa**: "Nếu mọi số xuất hiện k lần thì cần ⌈log₂(k)⌉ biến bit-counter" / For k repeats, use ⌈log₂(k)⌉ variables — general FSM design.

---

## Solutions

```typescript
/**
 * Solution 1: Bit count per position (most intuitive)
 * Time: O(32n) = O(n) — 32 bit positions × n numbers
 * Space: O(1) — no extra data structure
 */
function singleNumber(nums: number[]): number {
  let result = 0;
  for (let bit = 0; bit < 32; bit++) {
    let count = 0;
    for (const n of nums) {
      count += (n >> bit) & 1;
    }
    if (count % 3 !== 0) {
      result |= 1 << bit;
    }
  }
  return result | 0; // convert to signed 32-bit int
}

/**
 * Solution 2: ones/twos state machine (optimal, interview-impressive)
 * Time: O(n) — single pass through array
 * Space: O(1) — exactly two integer variables
 *
 * ones: bits seen 1 time mod 3
 * twos: bits seen 2 times mod 3
 * When a bit hits 3, clear it from both ones and twos
 */
function singleNumberFSM(nums: number[]): number {
  let ones = 0,
    twos = 0;
  for (const n of nums) {
    ones = (ones ^ n) & ~twos;
    twos = (twos ^ n) & ~ones;
  }
  return ones;
}

// === Test Cases ===
console.log(singleNumber([2, 2, 3, 2])); // 3
console.log(singleNumber([0, 1, 0, 1, 0, 1, 99])); // 99
console.log(singleNumber([7, 7, 7, 42])); // 42
console.log(singleNumberFSM([2, 2, 3, 2])); // 3
console.log(singleNumberFSM([0, 1, 0, 1, 0, 1, 99])); // 99
console.log(singleNumberFSM([-2, -2, 1, 1, -3, 1, -3, -3, -2])); // 1

// Both methods should agree
const testNums = [5, 5, 5, 100, 100, 100, 7];
console.log(singleNumber(testNums) === singleNumberFSM(testNums)); // true (both → 7)
```

---

## 🔗 Related Problems

| Problem                                                                              | Pattern                       | Difficulty |
| ------------------------------------------------------------------------------------ | ----------------------------- | ---------- |
| [Single Number](https://leetcode.com/problems/single-number)                         | XOR cancellation (appears 2×) | 🟢 Easy    |
| [Single Number III](https://leetcode.com/problems/single-number-iii)                 | XOR + partition by bit        | 🟡 Medium  |
| [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number) | Bit / Floyd cycle detection   | 🟡 Medium  |
| [Missing Number](https://leetcode.com/problems/missing-number)                       | XOR with expected index       | 🟢 Easy    |
