---
layout: page
title: "Fraction to Recurring Decimal"
difficulty: Medium
category: String
tags: [Hash Table, Math, String]
leetcode_url: "https://leetcode.com/problems/fraction-to-recurring-decimal"
---

# Fraction to Recurring Decimal / Phân Số Sang Số Thập Phân Tuần Hoàn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Count the Number of Good Subsequences](https://leetcode.com/problems/count-the-number-of-good-subsequences) | [Reconstruct Original Digits from English](https://leetcode.com/problems/reconstruct-original-digits-from-english)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như học sinh làm phép chia dài trên giấy — mỗi bước nhân phần dư với 10 rồi chia. Nếu phần dư bắt đầu lặp lại, nghĩa là chữ số sẽ bắt đầu tuần hoàn. Ta dùng bản đồ ghi nhớ vị trí của mỗi phần dư để phát hiện điểm bắt đầu vòng lặp.

**Pattern Recognition:**

- Signal: "simulate long division" + "detect cycle" → **Hash Map tracking remainders**
- Mô phỏng phép chia dài, lưu `remainder → position` trong HashMap
- Key insight: Khi phần dư lặp lại, chèn `(` tại vị trí đã lưu và `)` ở cuối

**Visual — Long Division 1/6 = 0.1(6):**

```
numerator=1, denominator=6
  integer part: 1/6 = 0  remainder=1
  decimal:
    step 1: 1*10=10  10/6=1  remainder=4   → digit '1', map{1:0, 4:1}
    step 2: 4*10=40  40/6=6  remainder=4   → digit '6', map sees 4 at pos 1!
                                              → insert '(' at pos 1, add ')'
  result: "0.1(6)"

4/333:
  int=0, decimal remainder=4,then 40→0,400→1,remainder=400%333=67...
  eventually remainder repeats → "0.(012)"
```

---

## Problem Description

Given two integers representing the `numerator` and `denominator` of a fraction, return the fraction in string format. If the decimal part is repeating, enclose the repeating part in parentheses. If multiple answers are possible, return any of them.

**Example 1:** `numerator = 1`, `denominator = 2` → `"0.5"`
**Example 2:** `numerator = 2`, `denominator = 1` → `"2"`
**Example 3:** `numerator = 4`, `denominator = 333` → `"0.(012)"`
**Example 4:** `numerator = 1`, `denominator = 6` → `"0.1(6)"`

Constraints:

- `-2^31 <= numerator, denominator <= 2^31 - 1`
- `denominator != 0`

---

## 📝 Interview Tips

1. **Clarify (VN)**: "Kết quả âm khi nào? Một trong hai số âm thì kết quả âm" / **EN**: Result is negative if exactly one of numerator/denominator is negative
2. **Overflow trap (VN)**: "INT_MIN / -1 overflow — ép sang BigInt hoặc number trong JS" / **EN**: In languages with 32-bit ints, `-2^31 / -1` overflows — use BigInt
3. **Brute force (VN)**: "Không có brute force thực sự — mô phỏng phép chia dài là optimal" / **EN**: Long division simulation is inherently O(denominator) — already optimal
4. **HashSet vs HashMap (VN)**: "Cần HashMap (remainder → vị trí) để biết chèn `(` ở đâu" / **EN**: Must map remainder to its _position_ in result to insert `(` correctly
5. **Edge cases (VN)**: "`0/anything = '0'`, negative numerator/denominator, numerator=0" / **EN**: Zero numerator, negative sign handling, terminating decimals
6. **Follow-up (VN)**: "Nếu cần convert ngược `'0.(3)'` → phân số?" / **EN**: Can you implement the reverse — parse repeating decimal back to fraction?

---

## Solutions

```typescript
/**
 * Solution: Long Division Simulation with HashMap
 * Time: O(d) — at most d unique remainders before cycle, d = denominator
 * Space: O(d) — hashmap stores remainder positions
 */
function fractionToDecimal(numerator: number, denominator: number): string {
  if (numerator === 0) return "0";

  const result: string[] = [];

  // Handle sign
  if (numerator < 0 !== denominator < 0) result.push("-");

  // Work with absolute values (use BigInt to avoid overflow)
  let num = BigInt(Math.abs(numerator));
  let den = BigInt(Math.abs(denominator));

  // Integer part
  result.push(String(num / den));
  let remainder = num % den;

  if (remainder === 0n) return result.join("");

  result.push(".");

  // Decimal part — simulate long division
  const remainderMap = new Map<bigint, number>(); // remainder → index in result

  while (remainder !== 0n) {
    if (remainderMap.has(remainder)) {
      // Found cycle — insert '(' at stored position
      const cycleStart = remainderMap.get(remainder)!;
      result.splice(cycleStart, 0, "(");
      result.push(")");
      break;
    }
    remainderMap.set(remainder, result.length);
    remainder *= 10n;
    result.push(String(remainder / den));
    remainder = remainder % den;
  }

  return result.join("");
}

// === Test Cases ===
console.log(fractionToDecimal(1, 2)); // "0.5"
console.log(fractionToDecimal(2, 1)); // "2"
console.log(fractionToDecimal(4, 333)); // "0.(012)"
console.log(fractionToDecimal(1, 6)); // "0.1(6)"
console.log(fractionToDecimal(-1, -2)); // "0.5"
console.log(fractionToDecimal(1, -2)); // "-0.5"
console.log(fractionToDecimal(0, 3)); // "0"
console.log(fractionToDecimal(1, 3)); // "0.(3)"
console.log(fractionToDecimal(7, 12)); // "0.58(3)"
```

---

## 🔗 Related Problems

| Problem                                                                                                            | Pattern       | Difficulty |
| ------------------------------------------------------------------------------------------------------------------ | ------------- | ---------- |
| [Divide Two Integers](https://leetcode.com/problems/divide-two-integers)                                           | Math          | 🟡 Medium  |
| [Multiply Strings](https://leetcode.com/problems/multiply-strings)                                                 | Math / String | 🟡 Medium  |
| [Reconstruct Original Digits from English](https://leetcode.com/problems/reconstruct-original-digits-from-english) | Math          | 🟡 Medium  |
| [Number of Substrings With Fixed Ratio](https://leetcode.com/problems/number-of-substrings-with-fixed-ratio)       | Prefix Sum    | 🟡 Medium  |
| [Fraction to Recurring Decimal — LeetCode](https://leetcode.com/problems/fraction-to-recurring-decimal)            | Math          | 🟡 Medium  |
