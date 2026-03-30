---
layout: page
title: "Reverse Integer"
difficulty: Medium
category: String
tags: [Math]
leetcode_url: "https://leetcode.com/problems/reverse-integer/"
---

# Reverse Integer / Đảo Ngược Số Nguyên

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math / Digit Extraction
> **Frequency**: 📘 Tier 2 — Overflow handling is the real test, not the reversal itself
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [String to Integer (atoi)](./06-string-to-integer-atoi.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng đọc số điện thoại từ phải sang trái và ghi lại: lấy từng chữ số cuối bằng `% 10`, xóa nó đi bằng `/ 10`, rồi xây dựng số mới. Điểm khó không phải là đảo ngược — mà là biết lúc nào số mới sẽ vỡ ngưỡng 32-bit trước khi quá muộn.
- **Pattern Recognition:**
  - Cần xử lý từng chữ số → `digit = n % 10`, `n = Math.floor(n / 10)`
  - Overflow check bắt buộc → so sánh `result > INT_MAX / 10` TRƯỚC khi nhân 10
  - Số âm → xử lý dấu riêng, làm việc với `Math.abs(x)`
- **Visual — Reverse `x = 1 2 3`:**

```
num=123, result=0
  digit = 123 % 10 = 3  →  result = 0 * 10 + 3 = 3,   num = 12
  digit =  12 % 10 = 2  →  result = 3 * 10 + 2 = 32,  num = 1
  digit =   1 % 10 = 1  →  result = 32 * 10 + 1 = 321, num = 0
  num = 0 → stop

Overflow guard (x = 1 5 3 4 2 3 6 4 6 9):
  result = 964 632 431, next digit = 5
  964 632 431 > floor(2 147 483 647 / 10) = 214 748 364 → return 0 ✓
```

## Problem Description

Given a signed 32-bit integer `x`, return `x` with its digits reversed. Return `0` if the result overflows `[-2³¹, 2³¹ - 1]`.

```
Input: x = 123    → Output: 321
Input: x = -123   → Output: -321
Input: x = 120    → Output: 21      (leading zero dropped)
Input: x = 1534236469 → Output: 0  (overflow)
```

## 📝 Interview Tips

1. **Check overflow BEFORE multiplying** / Kiểm tra overflow TRƯỚC `result * 10` — không phải sau.
2. **Handle sign separately** / Tách dấu âm ra, làm việc với `Math.abs(x)`, rồi nhân lại cuối.
3. **String approach is simpler but O(log n) space** / Dùng string dễ viết nhưng không tối ưu space.
4. **INT32 bounds: ±2,147,483,647** / Nhớ ngưỡng: max = 2³¹−1, min = −2³¹.
5. **Trailing zeros disappear naturally** / `120` → `021` → parseInt drops leading zero → `21`.
6. **`Math.floor` is required** / JavaScript `/` không tự floor — luôn dùng `Math.floor(n / 10)`.

## Solutions

{% raw %}
/\*\*

- Solution 1 — Brute: String Conversion
- Time: O(log n) Space: O(log n) — extra string allocation
- Simple to code but uses O(log n) extra space.
  _/
  function reverseString(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const reversed = Math.abs(x).toString().split("").reverse().join("");
  const result = sign _ parseInt(reversed);
  if (result > 2147483647 || result < -2147483648) return 0;
  return result;
  }

/\*\*

- Solution 2 — Optimal: Math / Digit Extraction
- Time: O(log n) Space: O(1)
- Extract digit by digit with overflow check before each multiply.
  \*/
  function reverse(x: number): number {
  const sign = x < 0 ? -1 : 1;
  let num = Math.abs(x);
  let result = 0;
  const INT_MAX = 2147483647;

while (num > 0) {
const digit = num % 10;

    // Guard: if result * 10 + digit would overflow, return 0
    if (result > Math.floor(INT_MAX / 10)) return 0;
    if (result === Math.floor(INT_MAX / 10) && digit > 7) return 0;

    result = result * 10 + digit;
    num = Math.floor(num / 10);

}

return sign \* result;
}

// Inline tests
console.assert(reverse(123) === 321, "positive: expected 321");
console.assert(reverse(-123) === -321, "negative: expected -321");
console.assert(reverse(120) === 21, "trailing zero: expected 21");
console.assert(reverse(1534236469) === 0, "overflow: expected 0");
{% endraw %}

## 🔗 Related Problems

- [8. String to Integer (atoi)](./06-string-to-integer-atoi.md) — inverse problem, same overflow logic
- [9. Palindrome Number](https://leetcode.com/problems/palindrome-number/) — similar digit manipulation
- [190. Reverse Bits](https://leetcode.com/problems/reverse-bits/) — bit-level reversal analogy
- [7. Reverse Integer](https://leetcode.com/problems/reverse-integer/) — this problem
