---
layout: page
title: "Integer to Roman"
difficulty: Medium
category: String
tags: [String, Hash Table, Math, Greedy]
leetcode_url: "https://leetcode.com/problems/integer-to-roman/"
---

# Integer to Roman / Số Nguyên sang Số La Mã

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy (Largest-First)
> **Frequency**: 📗 Tier 2 — FAANG mid-level screens; pairs naturally with Roman to Integer
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Roman to Integer](12-roman-to-integer.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Giống như khi bạn trả tiền lẻ — bạn luôn dùng tờ tiền _lớn nhất có thể_ trước, rồi mới dùng tờ nhỏ hơn cho phần còn lại. Ví dụ: trả 1994 đồng → tờ 1000 trước (còn 994), rồi tờ 900 "CM" (còn 94), rồi tờ 90 "XC" (còn 4), rồi tờ 4 "IV". Xong!

- **Pattern Recognition:**
  - Luôn chọn giá trị lớn nhất ≤ `remaining` → **Greedy** với bảng giá trị giảm dần
  - Bảng 13 cặp (value, symbol) cố định → **O(1) time, O(1) space**
  - 6 trường hợp trừ (IV, IX, XL, XC, CD, CM) đã được nhúng sẵn vào bảng

- **Visual — Greedy breakdown of 1994:**

  ```
  values:  [1000, 900, 500, 400, 100,  90,  50,  40,  10,   9,  5,  4,  1]
  symbols: [ "M","CM", "D","CD", "C","XC", "L","XL", "X","IX","V","IV","I"]

  1994 ≥ 1000 → append "M",  remaining = 994
   994 ≥  900 → append "CM", remaining = 94
    94 ≥   90 → append "XC", remaining = 4
     4 ≥    4 → append "IV", remaining = 0

  Result: "MCMXCIV"
  ```

## Problem Description

Convert an integer `num` (1 ≤ num ≤ 3999) to its Roman numeral representation. Six subtraction forms exist: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.

```
Input: 3     → Output: "III"
Input: 58    → Output: "LVIII"
Input: 1994  → Output: "MCMXCIV"
```

## 📝 Interview Tips

1. **Pre-build the 13-entry table / Xây bảng 13 cặp trước**: Include all 6 subtraction forms — don't handle them as special cases in code, embed them in the lookup table.
2. **Greedy correctness / Tại sao greedy đúng**: Because each subtraction form (like CM=900) is always better than any combination using smaller values — the system is designed that way.
3. **O(1) time — explain why / Giải thích O(1)**: Input is bounded [1, 3999]; max symbols in output is bounded (≤ 15 chars for MMMCMXCIX). The loop runs at most 13 × constant times.
4. **Functional reduce alternative / Cách dùng reduce**: `pairs.reduce((res, [v, sym]) => { while... }, "")` — shows functional fluency, same complexity.
5. **Don't forget `while` not `if` / Nhớ dùng `while` không phải `if`**: The same symbol can repeat (e.g. MMM for 3000). A common bug is using `if` and only appending once.

## Solutions

```typescript
/**

- Integer to Roman
- https://leetcode.com/problems/integer-to-roman/
  */

/**

- Solution 1: Greedy with Parallel Arrays (Optimal)
- Iterate values descending; greedily subtract and append symbol.
- Time O(1) — bounded input [1,3999] | Space O(1)
  */
  function intToRoman(num: number): string {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];

let result = "";
let rem = num;

for (let i = 0; i < values.length && rem > 0; i++) {
while (rem >= values[i]) {
result += symbols[i];
rem -= values[i];
}
}

return result;
}

/**

- Solution 2: Functional Reduce (compact alternative)
- Same greedy logic expressed as a single reduce call.
- Time O(1) | Space O(1)
  */
  function intToRomanReduce(num: number): string {
  const pairs: [number, string][] = [
  [1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],
  [100,"C"],[90,"XC"],[50,"L"],[40,"XL"],
  [10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"],
  ];

return pairs.reduce((result, [value, symbol]) => {
while (num >= value) {
result += symbol;
num -= value;
}
return result;
}, "");
}

// Inline tests
console.log(intToRoman(3)); // "III"
console.log(intToRoman(1994)); // "MCMXCIV"
console.log(intToRomanReduce(58)); // "LVIII"
console.log(intToRomanReduce(3999)); // "MMMCMXCIX"
```

## 🔗 Related Problems

- [12. Roman to Integer](12-roman-to-integer.md) — Inverse problem; same table, scan direction reversed
- [273. Integer to English Words](https://leetcode.com/problems/integer-to-english-words/) — Harder encoding problem with similar greedy table structure
- [168. Excel Sheet Column Title](https://leetcode.com/problems/excel-sheet-column-title/) — Another custom base-encoding problem
- [670. Maximum Swap](https://leetcode.com/problems/maximum-swap/) — Greedy on digits, similar "pick the best at each step" intuition
