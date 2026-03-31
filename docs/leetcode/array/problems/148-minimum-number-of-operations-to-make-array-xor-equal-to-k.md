---
layout: page
title: "Minimum Number of Operations to Make Array XOR Equal to K"
difficulty: Medium
category: Array
tags: [Array, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-operations-to-make-array-xor-equal-to-k"
---

# Minimum Number of Operations to Make Array XOR Equal to K / Số Phép Toán Tối Thiểu Để XOR Mảng Bằng K

**Difficulty:** Medium | **Category:** Array, Bit Manipulation | **LeetCode:** [2997](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-xor-equal-to-k)

## 🧠 Intuition

> **Phép XOR giống bảng điện với các công tắc nhị phân.**
> XOR toàn mảng cho trạng thái hiện tại. So với K, đếm số bít khác nhau — mỗi bít khác cần đúng 1 phép toán để lật.

```
nums = [2, 3, 4]   XOR total = 2^3^4 = 5  →  101
k    = 6                                  →  110
total ^ k = 3                             →  011
popcount(011) = 2   →  2 operations
```

Mỗi phép toán flip 1 bít của bất kỳ phần tử → tối thiểu `popcount(total ^ k)` bước.

## 📝 Tips

1. **XOR toàn bộ mảng** trước — do XOR associative, thứ tự không quan trọng.
2. **`total ^ k`** cho biết bít nào đang sai (bít 1 = cần thay đổi).
3. **Đếm bít 1** trong `total ^ k` = số phép toán tối thiểu.
4. Mỗi phép toán thay đổi **đúng 1 bít** của 1 phần tử — không cần biết phần tử nào.
5. **Brian Kernighan's trick:** `n &= n - 1` xoá bít thấp nhất trong O(1).
6. **String trick:** `.toString(2).split("").filter(b => b==="1").length` ngắn gọn hơn.

## 💡 Solutions

```typescript
/**
 * Approach 1: XOR fold + Brian Kernighan popcount
 * Time: O(n + log(max_val)) | Space: O(1)
 *
 * XOR all nums to get current state, then count differing bits vs k.
 */
function minOperations(nums: number[], k: number): number {
  let total = 0;
  for (const n of nums) total ^= n;

  // Count set bits in (total ^ k) — each is one needed flip
  let diff = total ^ k;
  let ops = 0;
  while (diff !== 0) {
    diff &= diff - 1; // clear lowest set bit
    ops++;
  }
  return ops;
}

console.log(minOperations([2, 3, 4], 6)); // 2  (5^6=3, bits: 011 → 2)
console.log(minOperations([2, 3, 4], 5)); // 0  (XOR=5=k, no change)
console.log(minOperations([0], 7)); // 3  (0^7=7=111 → 3 bits)
console.log(minOperations([1, 1, 1], 1)); // 0  (1^1^1=1=k)
```

```typescript
/**
 * Approach 2: Reduce + string popcount (concise)
 * Time: O(n) | Space: O(log k) for string
 */
function minOperations2(nums: number[], k: number): number {
  const total = nums.reduce((acc, n) => acc ^ n, 0);
  return (total ^ k)
    .toString(2)
    .split("")
    .filter((b) => b === "1").length;
}

console.log(minOperations2([2, 3, 4], 6)); // 2
console.log(minOperations2([0, 0, 0], 0)); // 0
console.log(minOperations2([1], 0)); // 1  (1^0=1)
```

```typescript
/**
 * Approach 3: Bit-shift loop (explicit, interview-friendly)
 * Time: O(n + 32) | Space: O(1)
 */
function minOperations3(nums: number[], k: number): number {
  let diff = nums.reduce((a, n) => a ^ n, 0) ^ k;
  let count = 0;
  while (diff > 0) {
    count += diff & 1; // inspect lowest bit
    diff >>>= 1; // unsigned right shift
  }
  return count;
}

console.log(minOperations3([2, 3, 4], 6)); // 2
console.log(minOperations3([7], 7)); // 0
console.log(minOperations3([3, 5], 6)); // 1  (3^5=6, 6^6=0 → 0... wait 3^5=6=k → 0)
```

## 🔗 Related

| Problem                                                                                                         | Difficulty | Connection               |
| --------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------ |
| [136. Single Number](https://leetcode.com/problems/single-number/)                                              | Easy       | XOR fold fundamentals    |
| [191. Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/)                                        | Easy       | popcount pattern         |
| [2220. Minimum Bit Flips to Convert Number](https://leetcode.com/problems/minimum-bit-flips-to-convert-number/) | Easy       | Same core: popcount(a^b) |
