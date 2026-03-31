---
layout: page
title: "Missing Number"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Math, Binary Search, Bit Manipulation]
leetcode_url: "https://leetcode.com/problems/missing-number"
---

# Missing Number / Tìm Số Còn Thiếu

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math Sum / XOR / Sort
> **Frequency**: 📘 Tier 2 — Gặp ở hầu hết công ty; bài test nhiều cách tiếp cận trong phỏng vấn
> **See also**: [Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number) | [First Missing Positive](https://leetcode.com/problems/first-missing-positive)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng bạn có dây chuyền 0..n và thiếu một hạt. Cách nhanh nhất: biết tổng dây chuyền đầy đủ là `n*(n+1)/2`, trừ đi tổng thực tế → ra số thiếu. Cách điệu hơn: XOR mọi số từ 0..n với mọi phần tử trong mảng → các số xuất hiện 2 lần sẽ triệt tiêu, còn lại là số thiếu.

- **Pattern Recognition:**
  - Mảng chứa n phần tử phân biệt từ `[0..n]` → đúng 1 số bị thiếu
  - **Math**: `expected_sum - actual_sum = missing`
  - **XOR**: `0^1^..^n ^ nums[0]^..^nums[n-1]` = missing (số xuất hiện chẵn lần = 0)
  - **Sort**: sắp xếp, tìm vị trí đầu tiên `nums[i] != i`

- **Visual — Math approach với `[3,0,1]`:**

  ```
  n = 3,  expected = 0+1+2+3 = 6
  actual  = 3+0+1         = 4
  missing = 6 - 4         = 2 ✅

  XOR approach:
  0^1^2^3 ^ 3^0^1  = (0^0)^(1^1)^(3^3)^2 = 2 ✅
  ```

## Problem Description

Cho mảng `nums` chứa `n` số phân biệt trong khoảng `[0, n]`, trả về số duy nhất trong khoảng đó không xuất hiện trong mảng.

| Input                 | Output | Giải thích            |
| --------------------- | ------ | --------------------- |
| `[3, 0, 1]`           | `2`    | 2 không có trong mảng |
| `[0, 1]`              | `2`    | n=2, thiếu 2          |
| `[9,6,4,2,3,5,7,0,1]` | `8`    | 8 không xuất hiện     |

## 📝 Interview Tips

- 🇻🇳 Đây là bài "showcase 3 cách": Sort O(n log n), Math O(n), XOR O(n) — interviewer thường muốn nghe cả ba / 🇬🇧 _Showcase three approaches: Sort, Math sum, XOR — mention all, then code the best_
- 🇻🇳 Math sum có thể overflow với n lớn (dùng BigInt hoặc tính từng bước); XOR không overflow / 🇬🇧 _Math sum can overflow for large n — XOR is safer and equally O(n) O(1) space_
- 🇻🇳 XOR trick: `a ^ a = 0` và `a ^ 0 = a` → XOR hết `0..n` với hết `nums` → còn lại số thiếu / 🇬🇧 _XOR trick: a^a=0, a^0=a — XOR all expected + all actual, leftovers = missing_
- 🇻🇳 Sort + scan: tìm `i` đầu tiên mà `nums[i] != i` sau sort; nếu không tìm được → thiếu `n` / 🇬🇧 _Sort approach: after sorting, first index where nums[i]≠i gives the missing number_

## Solutions

```typescript
/**
 * Solution 1: Sort + Linear Scan
 * Sắp xếp mảng rồi tìm vị trí đầu tiên mà nums[i] != i.
 * Nếu mọi vị trí đều match → số thiếu là n.
 *
 * @time O(n log n) — dominated by sort
 * @space O(1) — in-place sort (không kể stack)
 */
function missingNumberSort(nums: number[]): number {
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i) return i;
  }
  return nums.length; // số n bị thiếu
}

console.log(missingNumberSort([3, 0, 1])); // 2
console.log(missingNumberSort([0, 1])); // 2
console.log(missingNumberSort([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8

/**
 * Solution 2: Math Sum Formula — O(n) O(1)
 * Tổng lý thuyết: n*(n+1)/2. Trừ đi tổng thực tế → số thiếu.
 *
 * @time O(n) — một lần duyệt để tính sum
 * @space O(1) — chỉ dùng biến số học
 */
function missingNumberMath(nums: number[]): number {
  const n = nums.length;
  const expected = (n * (n + 1)) / 2;
  const actual = nums.reduce((acc, x) => acc + x, 0);
  return expected - actual;
}

console.log(missingNumberMath([3, 0, 1])); // 2
console.log(missingNumberMath([0, 1])); // 2
console.log(missingNumberMath([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8

/**
 * Solution 3: XOR Bit Manipulation — O(n) O(1), overflow-safe
 * XOR tất cả giá trị từ 0..n với tất cả phần tử nums.
 * Số xuất hiện đúng 2 lần sẽ triệt tiêu (a^a=0).
 * Số xuất hiện 1 lần (số thiếu) là kết quả.
 *
 * @time O(n) — một lần duyệt
 * @space O(1) — không cần bộ nhớ phụ
 */
function missingNumber(nums: number[]): number {
  let xor = nums.length; // bắt đầu với n
  for (let i = 0; i < nums.length; i++) {
    xor ^= i ^ nums[i]; // XOR cả index i (0..n-1) lẫn nums[i]
  }
  return xor;
}

console.log(missingNumber([3, 0, 1])); // 2
console.log(missingNumber([0, 1])); // 2
console.log(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8
console.log(missingNumber([0])); // 1
```

## 🔗 Related Problems

| Problem                                                                                               | Pattern             | Difficulty |
| ----------------------------------------------------------------------------------------------------- | ------------------- | ---------- |
| [287. Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number)             | Floyd's Cycle / XOR | 🟡 Medium  |
| [41. First Missing Positive](https://leetcode.com/problems/first-missing-positive)                    | Index as Hash       | 🔴 Hard    |
| [136. Single Number](https://leetcode.com/problems/single-number)                                     | XOR                 | 🟢 Easy    |
| [442. Find All Duplicates in an Array](https://leetcode.com/problems/find-all-duplicates-in-an-array) | Index marking       | 🟡 Medium  |
