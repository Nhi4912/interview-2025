---
layout: page
title: "Next Greater Element III"
difficulty: Medium
category: String
tags: [Math, Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/next-greater-element-iii"
---

# Next Greater Element III / Phần Tử Lớn Hơn Tiếp Theo III

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii) | [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Như sắp xếp lại bộ bài để ra số lớn hơn nhỏ nhất — đây là thuật toán **next permutation**. Tìm từ phải sang: chỗ đầu tiên tăng, đổi với số nhỏ nhất bên phải lớn hơn nó, rồi đảo ngược phần còn lại.

```
n = 12443322 → digits = [1,2,4,4,3,3,2,2]

Step 1: Find rightmost i where d[i] < d[i+1]
        i=1 (d[1]=2 < d[2]=4)

Step 2: Find rightmost j > i where d[j] > d[i]
        j=2 (d[2]=4 > d[1]=2)  — actually j=5? no, d[5]=3>2 too, pick rightmost

Step 3: Swap d[i] and d[j] → [1,3,4,4,3,2,2,2]
Step 4: Reverse d[i+1:]    → [1,3,2,2,3,4,4,4]? Wait, reverse suffix after i
        → [1,3,2,2,2,3,4,4] = 13222344

Result: 13222344
```

---

## Problem Description

Given a positive integer `n`, find the **smallest integer** that has the same digits as `n` and is strictly greater than `n`. If no such number exists or it overflows 32-bit int, return `-1`.

**Example 1:** `n=12` → `21`
**Example 2:** `n=21` → `-1` (no larger permutation)

Constraints: `1 ≤ n ≤ 2^31 - 1`

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Kết quả có thể tràn số 32-bit không?" / Can result overflow 32-bit int? Yes → return -1
2. **Key insight / Ý tưởng**: Đây là bài **Next Permutation** áp dụng trên chữ số / Next Permutation on digit array
3. **Brute force / Vét cạn**: Generate all permutations, find next greater — too slow
4. **Algorithm steps / Các bước**: Find pivot i (d[i]<d[i+1] from right), find successor j, swap, reverse suffix
5. **Edge cases / Trường hợp đặc biệt**: Digits in descending order → no next permutation → -1
6. **Overflow check / Tràn số**: Result > 2^31-1 → return -1 (use Number or BigInt comparison)

---

## Solutions

```typescript
/**
 * Solution 1: Next Permutation on digit array
 * Time: O(d) — d = number of digits ≤ 10
 * Space: O(d)
 */
function nextGreaterElement(n: number): number {
  const digits = n.toString().split("").map(Number);
  const len = digits.length;

  // Step 1: find rightmost i where digits[i] < digits[i+1]
  let i = len - 2;
  while (i >= 0 && digits[i] >= digits[i + 1]) i--;

  if (i < 0) return -1; // already largest permutation

  // Step 2: find rightmost j > i where digits[j] > digits[i]
  let j = len - 1;
  while (digits[j] <= digits[i]) j--;

  // Step 3: swap
  [digits[i], digits[j]] = [digits[j], digits[i]];

  // Step 4: reverse suffix from i+1
  let left = i + 1,
    right = len - 1;
  while (left < right) {
    [digits[left], digits[right]] = [digits[right], digits[left]];
    left++;
    right--;
  }

  const result = parseInt(digits.join(""), 10);
  // Check 32-bit signed integer overflow
  return result > 2147483647 ? -1 : result;
}

console.log(nextGreaterElement(12)); // 21
console.log(nextGreaterElement(21)); // -1
console.log(nextGreaterElement(230241)); // 230412
console.log(nextGreaterElement(12443322)); // 13222344
console.log(nextGreaterElement(2147483647)); // -1
```

---

## 🔗 Related Problems

| Problem                                                                          | Pattern         | Difficulty |
| -------------------------------------------------------------------------------- | --------------- | ---------- |
| [Next Permutation](https://leetcode.com/problems/next-permutation)               | Two Pointers    | Medium     |
| [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i)   | Stack           | Easy       |
| [Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii) | Monotonic Stack | Medium     |
| [Permutation Sequence](https://leetcode.com/problems/permutation-sequence)       | Math            | Hard       |

---

## 🔑 Next Permutation — 4 Steps

1. Find rightmost pivot `i` where `d[i] < d[i+1]`
2. Find rightmost `j > i` where `d[j] > d[i]`
3. Swap `d[i]` and `d[j]`
4. Reverse suffix `d[i+1..]` to get smallest arrangement

**Overflow:** If result > 2^31-1, return -1.

## ⏱️ Complexity Summary

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Next Permutation on digits | O(d) | O(d) | d ≤ 10, practically O(1) |
