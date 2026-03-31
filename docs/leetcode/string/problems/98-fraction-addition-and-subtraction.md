---
layout: page
title: "Fraction Addition and Subtraction"
difficulty: Medium
category: String
tags: [Math, String, Simulation]
leetcode_url: "https://leetcode.com/problems/fraction-addition-and-subtraction"
---

# Fraction Addition and Subtraction / Cộng và Trừ Phân Số

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Multiply Strings](https://leetcode.com/problems/multiply-strings) | [Add Binary](https://leetcode.com/problems/add-binary)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Như học cộng phân số tiểu học — tìm mẫu số chung, quy đồng, cộng tử số, rút gọn. Chỉ cần parse chuỗi cẩn thận để lấy từng phân số (kể cả dấu âm), rồi tính lũy tiến.

```
expression = "-1/2+1/3"
Parse → [(-1,2), (1,3)]

Step 1: -1/2 + 1/3
  num = -1*3 + 1*2 = -3 + 2 = -1
  den = 2*3 = 6
  gcd(1,6) = 1 → -1/6

Result: "-1/6"

expression = "1/3-1/2"
  num = 1*2 + (-1)*3 = 2-3 = -1, den = 6 → "-1/6"
```

---

## Problem Description

Given a string `expression` representing fractions combined with `+` and `-`, return the result as an **irreducible fraction** (or `"0/1"` if zero).

**Example 1:** `"-1/2+1/3"` → `"-1/6"`
**Example 2:** `"1/3-1/2"` → `"-1/6"`
**Example 3:** `"5/3+1/3"` → `"2/1"`

Constraints: input is a valid fraction expression, denominators between 1 and 10.

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Kết quả luôn cần rút gọn?" / Always reduce to lowest terms? Yes.
2. **Parsing / Phân tích**: Dùng regex để tách các phân số có dấu / Use regex to extract signed fractions
3. **Key math / Toán học**: a/b + c/d = (a*d + c*b) / (b\*d), then divide by gcd(|num|, den)
4. **Edge cases / Trường hợp đặc biệt**: Kết quả là 0 → return "0/1"; âm/dương đúng dấu
5. **Overflow / Tràn số**: Den ≤ 10 per fraction, ≤ 10 fractions → max den = 10^10, use Number safely
6. **Follow-up / Hỏi thêm**: "Nhân và chia phân số thì sao?" / Add multiply/divide operators

---

## Solutions

```typescript
/**
 * Solution: Parse fractions with regex, accumulate iteratively
 * Time: O(n) where n = number of fractions in expression
 * Space: O(n)
 */
function fractionAddition(expression: string): string {
  function gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    return b === 0 ? a : gcd(b, a % b);
  }

  // Match signed fractions like -1/2, +3/4, 1/3
  const fractions = expression.match(/[+-]?\d+\/\d+/g) ?? [];

  let numAcc = 0;
  let denAcc = 1;

  for (const frac of fractions) {
    const slashIdx = frac.indexOf("/");
    const num = parseInt(frac.substring(0, slashIdx), 10);
    const den = parseInt(frac.substring(slashIdx + 1), 10);

    // numAcc/denAcc + num/den = (numAcc*den + num*denAcc) / (denAcc*den)
    numAcc = numAcc * den + num * denAcc;
    denAcc = denAcc * den;

    // Reduce
    const g = gcd(Math.abs(numAcc), denAcc);
    numAcc /= g;
    denAcc /= g;
  }

  return `${numAcc}/${denAcc}`;
}

console.log(fractionAddition("-1/2+1/3")); // "-1/6"
console.log(fractionAddition("1/3-1/2")); // "-1/6"
console.log(fractionAddition("5/3+1/3")); // "2/1"
console.log(fractionAddition("1/4-5/4")); // "-1/1"
console.log(fractionAddition("-1/2+1/2")); // "0/1"

/**
 * Solution 2: Same algorithm, slightly different parsing (split on +/-)
 * Time: O(n)
 * Space: O(1) extra
 */
function fractionAdditionV2(expression: string): string {
  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  // Ensure expression starts with explicit sign for uniform parsing
  const expr = expression.startsWith("-") ? expression : "+" + expression;
  const tokens = expr.match(/[+-]\d+\/\d+/g) ?? [];

  let rNum = 0,
    rDen = 1;
  for (const t of tokens) {
    const [n, d] = t.split("/").map(Number);
    rNum = rNum * d + n * rDen;
    rDen = rDen * d;
    const g = gcd(Math.abs(rNum), Math.abs(rDen));
    rNum /= g;
    rDen /= g;
  }
  return `${rNum}/${rDen}`;
}

console.log(fractionAdditionV2("-1/2+1/3")); // "-1/6"
console.log(fractionAdditionV2("5/3+1/3")); // "2/1"
```

---

## 🔗 Related Problems

| Problem                                                            | Pattern          | Difficulty |
| ------------------------------------------------------------------ | ---------------- | ---------- |
| [Multiply Strings](https://leetcode.com/problems/multiply-strings) | Math             | Medium     |
| [Add Strings](https://leetcode.com/problems/add-strings)           | Math             | Easy       |
| [Add Binary](https://leetcode.com/problems/add-binary)             | Bit Manipulation | Easy       |
| [Basic Calculator](https://leetcode.com/problems/basic-calculator) | Stack            | Hard       |
