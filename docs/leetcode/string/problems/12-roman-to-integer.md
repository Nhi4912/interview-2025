---
layout: page
title: "Roman to Integer"
difficulty: Easy
category: String
tags: [String, Hash Table, Math]
leetcode_url: "https://leetcode.com/problems/roman-to-integer/"
---

# Roman to Integer / Số La Mã sang Số Nguyên

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map + Left-to-Right Scan
> **Frequency**: 📗 Tier 2 — Google, Meta phone screens; tests rule-encoding and careful reading
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Integer to Roman](13-integer-to-roman.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Giống như đổi tiền tệ với quy tắc đặc biệt — bình thường bạn cộng từng mệnh giá từ trái sang phải, nhưng nếu thấy tờ nhỏ hơn đứng _trước_ tờ lớn hơn (như tờ 1 đứng trước tờ 5), bạn phải _trừ_ tờ nhỏ đó thay vì cộng. Chỉ cần nhớ quy tắc này là xong.

- **Pattern Recognition:**
  - Bảng tra cứu cố định 7 ký tự → **Hash Map** O(1) lookup
  - Quy tắc trừ xảy ra khi `current > prev` → phát hiện bằng cách **so sánh với ký tự liền trước**
  - Cách từ phải sang trái tránh cần nhìn về phía trước → **Right-to-Left** sạch hơn

- **Visual — Left-to-Right scan of "MCMXCIV":**

  ```
  Char:  M    C    M    X    C    I    V
  Val: 1000  100 1000   10  100    1    5
  Prev:   0 1000  100 1000   10  100    1

  M: cur(1000) > prev(0)    → +1000          total = 1000
  C: cur(100)  < prev(1000) → +100           total = 1100
  M: cur(1000) > prev(100)  → +1000−2×100   total = 1900
  X: cur(10)   < prev(1000) → +10            total = 1910
  C: cur(100)  > prev(10)   → +100−2×10     total = 1990
  I: cur(1)    < prev(100)  → +1             total = 1991
  V: cur(5)    > prev(1)    → +5−2×1        total = 1994
  ```

## Problem Description

Roman numerals use 7 symbols: `I=1, V=5, X=10, L=50, C=100, D=500, M=1000`. When a smaller symbol precedes a larger one, subtract it (e.g. IV=4, IX=9, XL=40, XC=90, CD=400, CM=900).

```
Input: "III"      → Output: 3
Input: "LVIII"    → Output: 58   (L=50, V=5, III=3)
Input: "MCMXCIV"  → Output: 1994 (M=1000, CM=900, XC=90, IV=4)
```

## 📝 Interview Tips

1. **State the 6 subtraction cases / Nêu 6 trường hợp trừ**: IV, IX, XL, XC, CD, CM — mention these explicitly before coding to show you read the problem carefully.
2. **Left-to-right: track prev value / Trái-sang-phải: lưu giá trị trước**: When `current > prev`, undo the previous addition and add `current - prev` instead.
3. **Right-to-left is cleaner / Phải-sang-trái gọn hơn**: No undo needed — just add if `current >= max`, subtract otherwise. Max updates as you go.
4. **Constraints are small / Ràng buộc nhỏ**: String length ≤ 15, values 1–3999. No integer overflow concerns.
5. **Avoid hardcoding pairs / Tránh hardcode cặp**: Prefer the `current > prev → subtract` pattern over mapping all 6 special cases — more maintainable.

## Solutions

{% raw %}
/\*\*

- Roman to Integer
- https://leetcode.com/problems/roman-to-integer/
  \*/

/\*\*

- Solution 1: Left-to-Right with Previous Value Check
- When current symbol value exceeds the previous, undo and recompute.
- Time O(n) | Space O(1)
  \*/
  function romanToInt(s: string): number {
  const val: Record<string, number> = {
  I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
  };

let result = 0;
let prev = 0;

for (let i = 0; i < s.length; i++) {
const cur = val[s[i]];
if (cur > prev) {
// Undo prev (was added), now apply subtraction pair
result += cur - 2 \* prev;
} else {
result += cur;
}
prev = cur;
}

return result;
}

/\*\*

- Solution 2: Right-to-Left (cleaner, no undo needed)
- Track running max; add if current >= max, subtract if smaller.
- Time O(n) | Space O(1)
  \*/
  function romanToIntRTL(s: string): number {
  const val: Record<string, number> = {
  I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
  };

let result = 0;
let max = 0;

for (let i = s.length - 1; i >= 0; i--) {
const cur = val[s[i]];
if (cur >= max) {
result += cur;
max = cur;
} else {
result -= cur;
}
}

return result;
}

// Inline tests
console.log(romanToInt("III")); // 3
console.log(romanToInt("LVIII")); // 58
console.log(romanToIntRTL("MCMXCIV")); // 1994
console.log(romanToIntRTL("IV")); // 4
{% endraw %}

## 🔗 Related Problems

- [13. Integer to Roman](13-integer-to-roman.md) — Inverse problem; greedy approach
- [273. Integer to English Words](https://leetcode.com/problems/integer-to-english-words/) — Same "table lookup" pattern at a larger scale
- [12. Integer to Roman](https://leetcode.com/problems/integer-to-roman/) — Pair problem (same number system, opposite direction)
- [168. Excel Sheet Column Title](https://leetcode.com/problems/excel-sheet-column-title/) — Similar encoding/decoding with custom base
