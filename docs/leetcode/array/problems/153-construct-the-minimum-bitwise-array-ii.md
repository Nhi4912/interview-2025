---
layout: page
title: "Construct the Minimum Bitwise Array II"
difficulty: Medium
category: Array
tags: [Array, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/construct-the-minimum-bitwise-array-ii"
---

# Construct the Minimum Bitwise Array II / Xây Dựng Mảng Bitwise Tối Thiểu II

**Difficulty:** Medium | **Category:** Array, Bit Manipulation | **LeetCode:** [3085](https://leetcode.com/problems/construct-the-minimum-bitwise-array-ii)

## 🧠 Intuition

> **Với mỗi số nguyên tố p, tìm x nhỏ nhất sao cho x OR (x+1) = p.**
> `x OR (x+1)` luôn lật bít thấp nhất đang là 0 của x và tất cả bít dưới nó.

```
p = 5  =  101
x OR (x+1) = p?

x = 4 = 100 → 100 OR 101 = 101 = 5 ✓  (nhỏ nhất!)
x = 2 = 010 → 010 OR 011 = 011 = 3 ≠ 5

Key: x OR (x+1) bật bít thấp nhất của x+1.
  Nếu p+1 = 110, lowest bit = 010 (t = 2)
  x = p - t/2 = 5 - 1 = 4 ✓

p = 7  =  111 → p+1 = 1000, t = 1000, t/2 = 100
x = 7 - 4 = 3 = 011 → 011 OR 100 = 111 = 7 ✓

p = 2: không có x vì x OR (x+1) ≥ 3 với x≥2, hoặc =1,3 với x=0,1.
```

## 📝 Tips

1. **p = 2 luôn trả -1** — `x OR (x+1)` không thể bằng 2 (kết quả lẻ hoặc ≥ 3).
2. **Lowest set bit của (p+1):** `t = (p+1) & -(p+1)` — trích bit thấp nhất.
3. **Công thức:** `ans[i] = p - t/2` với `t = (p+1) & -(p+1)`.
4. **Tại sao?** `x OR (x+1) = p` khi x = p xoá bít thấp nhất của p, bật các bít dưới.
5. **Verify:** `x | (x+1) === p` — luôn check sau khi tính.
6. Đề đảm bảo `nums` là mảng số nguyên tố → không cần kiểm tra tính nguyên tố.

## 💡 Solutions

```typescript
/**
 * Approach 1: Formula — lowest bit of (p+1)
 * Time: O(n) | Space: O(n)
 *
 * For prime p: find t = lowest set bit of (p+1).
 * Then ans = p - t/2. Special case: p=2 → -1 (impossible).
 */
function minBitwiseArray(nums: number[]): number[] {
  return nums.map((p) => {
    if (p === 2) return -1;
    // t = lowest set bit of (p+1)
    const t = (p + 1) & -(p + 1);
    return p - (t >> 1); // p - t/2
  });
}

console.log(minBitwiseArray([2, 3, 5, 7])); // [-1, 1, 4, 3]
console.log(minBitwiseArray([11, 13])); // [9, 12]
console.log(minBitwiseArray([2])); // [-1]
console.log(minBitwiseArray([3])); // [1]  (1|2=3 ✓)
```

```typescript
/**
 * Approach 2: Brute-force search per prime (verifiable, slower)
 * Time: O(n * p_max) | Space: O(n)
 *
 * For each prime p, scan x from 0 to p-1 to find smallest x | (x+1) == p.
 * Good for verifying Approach 1 on small inputs.
 */
function minBitwiseArray2(nums: number[]): number[] {
  return nums.map((p) => {
    for (let x = 0; x < p; x++) {
      if ((x | (x + 1)) === p) return x;
    }
    return -1; // only happens for p=2
  });
}

console.log(minBitwiseArray2([2, 3, 5, 7])); // [-1, 1, 4, 3]
console.log(minBitwiseArray2([11, 13])); // [9, 12]
// Verify: 9|10 = 1001|1010 = 1011 = 11 ✓; 12|13 = 1100|1101 = 1101 = 13 ✓
```

```typescript
/**
 * Approach 3: Bit scan — find lowest 0-bit position in p, then derive x
 * Time: O(n * log p) | Space: O(n)
 *
 * Equivalent approach: find position of lowest 0-bit in p.
 * x = p with that bit-group cleared = p - (1 << pos)/2.
 */
function minBitwiseArray3(nums: number[]): number[] {
  return nums.map((p) => {
    if (p === 2) return -1;
    // Find lowest 0-bit position in p
    let pos = 0;
    while ((p >> pos) & 1) pos++; // scan until we find a 0-bit
    // The answer: clear bits [0..pos-1] which means subtract (1 << pos) - 1 ...
    // Equivalently: p - (1 << (pos - 1))
    return p - (1 << (pos - 1));
  });
}

console.log(minBitwiseArray3([2, 3, 5, 7, 11, 13]));
// [-1, 1, 4, 3, 9, 12]
// 3=011 lowest-0 at pos=2, ans=3-2=1 ✓
// 5=101 lowest-0 at pos=1, ans=5-1=4 ✓
// 7=111 lowest-0 at pos=3, ans=7-4=3 ✓
```

## 🔗 Related

| Problem                                                                                                                                           | Difficulty | Connection                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------- |
| [3083. Existence of a Substring in a String and Its Reverse](https://leetcode.com/problems/existence-of-a-substring-in-a-string-and-its-reverse/) | Easy       | Same contest (Weekly 389)     |
| [190. Reverse Bits](https://leetcode.com/problems/reverse-bits/)                                                                                  | Easy       | Bit manipulation fundamentals |
| [2401. Longest Nice Subarray](https://leetcode.com/problems/longest-nice-subarray/)                                                               | Medium     | Bitwise AND/OR properties     |
