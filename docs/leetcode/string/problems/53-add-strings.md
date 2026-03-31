---
layout: page
title: "Add Strings"
difficulty: Easy
category: String
tags: [Math, String, Simulation]
leetcode_url: "https://leetcode.com/problems/add-strings"
---

# Add Strings / Cộng Hai Chuỗi Số

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math / Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Multiply Strings](https://leetcode.com/problems/multiply-strings) | [Add Binary](https://leetcode.com/problems/add-binary)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cộng tay hai số trên giấy — bắt đầu từ hàng đơn vị (bên phải), cộng từng chữ số kèm nhớ (carry), ghi kết quả từ phải sang trái.

**Pattern Recognition:**

- Signal: "add two numbers represented as strings" → **Simulation / Two Pointers from end**
- Không được dùng BigInt hay convert sang số — phải xử lý từng ký tự
- Key insight: duyệt từ cuối về đầu, dùng carry; tiếp tục khi cả hai con trỏ hết nhưng còn carry

**Visual — Add Strings "456" + "77":**

```
  num1:  4  5  6     i=2
  num2:     7  7     j=1

step 1: 6+7=13  carry=1  result=[3]
step 2: 5+7+1=13  carry=1  result=[3,3]
step 3: 4+0+1=5   carry=0  result=[3,3,5]
step 4: reverse → "533"
```

---

## Problem Description

Given two non-negative integers `num1` and `num2` represented as strings, return the sum as a string. You must not use any built-in library or convert the inputs to integers directly.

```
Example 1: num1="11", num2="123"  → "134"
Example 2: num1="456", num2="77"  → "533"
Example 3: num1="0",   num2="0"   → "0"
```

Constraints: `1 <= num1.length, num2.length <= 10^4`, no leading zeros except "0".

---

## 📝 Interview Tips

1. **Clarify**: "Có leading zeros không? Output có cần loại bỏ leading zero không?" / Are leading zeros possible? Must we strip them?
2. **Brute force**: "Convert sang number rồi cộng" — nhưng bị overflow với 10^4 digits / Direct cast fails for huge numbers
3. **Optimize**: "Duyệt từ cuối, cộng từng char code với carry" / Iterate from end, use `charCodeAt - 48` trick
4. **Edge cases**: "Hai chuỗi độ dài khác nhau, carry còn dư sau khi hết cả hai" / Different lengths, leftover carry
5. **Follow-up**: "Multiply Strings — same technique but with nested loops" / Extension to multiplication
6. **Code signal**: `String.fromCharCode(sum % 10 + 48)` hoặc `(sum % 10).toString()` đều ổn / Both char tricks valid

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force (convert to BigInt)
 * Time: O(n) — BigInt addition
 * Space: O(n) — output string
 * Note: Only valid if BigInt allowed; interviewers often forbid it
 */
function addStringsBrute(num1: string, num2: string): string {
  return (BigInt(num1) + BigInt(num2)).toString();
}

/**
 * Solution 2: Manual Simulation (Two Pointers from end)
 * Time: O(max(n, m)) — single pass from right to left
 * Space: O(max(n, m)) — result array
 */
function addStrings(num1: string, num2: string): string {
  let i = num1.length - 1;
  let j = num2.length - 1;
  let carry = 0;
  const result: string[] = [];

  while (i >= 0 || j >= 0 || carry) {
    const d1 = i >= 0 ? num1.charCodeAt(i--) - 48 : 0;
    const d2 = j >= 0 ? num2.charCodeAt(j--) - 48 : 0;
    const sum = d1 + d2 + carry;
    carry = Math.floor(sum / 10);
    result.push((sum % 10).toString());
  }

  return result.reverse().join("");
}

// === Test Cases ===
console.log(addStrings("11", "123")); // "134"
console.log(addStrings("456", "77")); // "533"
console.log(addStrings("0", "0")); // "0"
console.log(addStrings("9999", "1")); // "10000"  — carry propagation
```

---

## 🔗 Related Problems

- [Multiply Strings](https://leetcode.com/problems/multiply-strings) — same digit-by-digit simulation, nested loops
- [Add Binary](https://leetcode.com/problems/add-binary) — identical pattern, base 2 instead of base 10
- [Add Two Numbers](https://leetcode.com/problems/add-two-numbers) — same carry logic on linked lists
- [Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers) — bitwise carry variant
