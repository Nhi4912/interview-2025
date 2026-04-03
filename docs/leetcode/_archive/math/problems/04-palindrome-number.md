---
layout: page
title: "Palindrome Number"
difficulty: Easy
category: Math
tags: [Math]
leetcode_url: "https://leetcode.com/problems/palindrome-number"
---

# Palindrome Number / Số Đối Xứng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Reverse Half Number
> **Frequency**: ⭐ Tier 2 — Gặp ở 32+ companies
> **See also**: [Valid Palindrome](https://leetcode.com/problems/valid-palindrome) | [Reverse Integer](https://leetcode.com/problems/reverse-integer)

---

## 🧠 Intuition / Tư Duy

- **Analogy:** Số đối xứng giống như tên "ANNA" — đọc xuôi hay ngược đều như nhau. Thay vì chuyển hết thành chuỗi, hãy chỉ đảo ngược **nửa sau** của số rồi so với **nửa trước** — tiết kiệm hơn và tránh overflow.

- **Pattern Recognition:**
  - Signal: "palindrome" + "number" → **Reverse half, compare**
  - Âm → không palindrome; kết thúc bằng 0 (trừ 0 chính nó) → không palindrome
  - Dừng khi `reversed >= x` (đã qua nửa)
  - Odd-length: `x === Math.floor(reversed / 10)` (bỏ chữ số giữa)

- **Visual — x = 1221:**

```
x=1221, rev=0
  Step 1: rev = 0*10 + 1221%10 = 1,  x = 121  (x=121 > rev=1, continue)
  Step 2: rev = 1*10 + 121%10  = 12, x = 12   (x=12 <= rev=12, stop)

  x === rev  →  12 === 12  →  true ✓

x=12321, rev=0
  Step 1: rev=1,   x=1232
  Step 2: rev=12,  x=123
  Step 3: rev=123, x=12  (x=12 < rev=123, stop)

  x === Math.floor(rev/10)  →  12 === 12  →  true ✓ (odd digits: ignore middle)

x=-121  →  negative → false ✓
x=10    →  ends in 0, not 0 itself → false ✓
```

---

## Problem Description

Given an integer `x`, return `true` if `x` is a **palindrome** (reads the same forward and backward).

```
Input:  121   → true   (reads 121 both ways)
Input:  -121  → false  (reads -121 forward, 121- backward)
Input:  10    → false  (reads 01 backward)
```

Constraints: `-2^31 ≤ x ≤ 2^31 - 1`.

---

## 📝 Interview Tips

1. **Âm số**: Luôn trả về false — dấu `-` phá palindrome / **Negatives**: always false — the minus sign breaks symmetry
2. **Kết thúc bằng 0**: Trừ `x=0`, mọi số kết thúc 0 đều không palindrome (bắt đầu không thể là 0) / **Trailing zero**: except 0 itself, always false
3. **Chỉ đảo nửa sau**: Tránh overflow từ đảo cả số / **Reverse only half** to avoid integer overflow
4. **Điều kiện dừng**: `reversed >= x` (đã qua nửa số) / **Stop condition**: when reversed half ≥ remaining
5. **Odd vs Even digits**: Odd-length → so `x === Math.floor(reversed/10)` / **Handle middle digit**: discard middle for odd-length
6. **Brute (string)**: Chuyển sang string, so `s === s.reverse()` — đơn giản nhưng cần xử lý chuỗi / **String approach**: simpler but involves string conversion

---

## Solutions

```typescript
/**
 * Solution 1: String Conversion (Brute Force)
 * Time: O(log x) | Space: O(log x)
 */
function isPalindromeBrute(x: number): boolean {
  if (x < 0) return false;
  const s = x.toString();
  return s === s.split("").reverse().join("");
}

/**
 * Solution 2: Reverse Half Number (Optimal — no string conversion)
 * Time: O(log x) | Space: O(1)
 */
function isPalindrome(x: number): boolean {
  // Negatives and numbers ending in 0 (except 0 itself) can't be palindromes
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;

  let reversed = 0;
  while (x > reversed) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }

  // Even length: x === reversed
  // Odd length: x === Math.floor(reversed / 10)  (discard middle digit)
  return x === reversed || x === Math.floor(reversed / 10);
}

// === Test Cases ===
console.log(isPalindrome(121)); // true
console.log(isPalindrome(-121)); // false
console.log(isPalindrome(10)); // false
console.log(isPalindrome(0)); // true
console.log(isPalindrome(1221)); // true
console.log(isPalindrome(12321)); // true
console.log(isPalindrome(12345)); // false
```

---

## 🔗 Related Problems

| Problem                                                                        | Relationship                                              |
| ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| [Reverse Integer](https://leetcode.com/problems/reverse-integer)               | Core building block: reversing digits of an integer       |
| [Valid Palindrome](https://leetcode.com/problems/valid-palindrome)             | Same concept extended to strings with alphanumeric filter |
| [Happy Number](https://leetcode.com/problems/happy-number)                     | Digit manipulation math problem                           |
| [Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list) | Palindrome check on different data structure              |
