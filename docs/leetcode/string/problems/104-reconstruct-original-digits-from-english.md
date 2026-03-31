---
layout: page
title: "Reconstruct Original Digits from English"
difficulty: Medium
category: String
tags: [Hash Table, Math, String]
leetcode_url: "https://leetcode.com/problems/reconstruct-original-digits-from-english"
---

# Reconstruct Original Digits from English / Khôi Phục Chữ Số Từ Tiếng Anh

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Math + Frequency Counting
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

## 🧠 Intuition / Tư Duy

> Giống như giải mã một bức điện mật — bạn tìm ra những ký tự "độc nhất" trước (chữ nào chỉ xuất hiện trong một từ duy nhất), rồi dùng kết quả đó để suy ra các chữ số còn lại. Đây là bài toán hệ phương trình tần suất!

**Pattern Recognition:**

- Signal: "letters scrambled from digit words" → **Unique Character Identification**
- Mỗi chữ số có ít nhất một chữ cái đặc trưng chỉ xuất hiện trong từ đó
- Giải theo thứ tự: z→0, w→2, u→4, x→6, g→8, o→1, h→3, f→5, s→7, i→9

**Visual:**

```
"owoztneoer" → count: o=2,w=1,z=1,t=1,n=1,e=2,r=1

z(unique in zero): cnt['z']=1 → one(0)
w(unique in two):  cnt['w']=1 → one(2)
u(unique in four): cnt['u']=0 → zero(4)
x(unique in six):  cnt['x']=0 → zero(6)
g(unique in eight):cnt['g']=0 → zero(8)
o(in one,after 0,2,4): cnt['o']-0-1-0=2-1=1 → one(1)
...
result = sorted → "012"
```

## Problem Description

Given a string `s` containing scrambled letters from English words for digits 0–9, reconstruct the original digits and return them sorted in ascending order.

- **Example 1**: `s = "owoztneoer"` → `"012"`
- **Example 2**: `s = "fviefuro"` → `"45"`

**Constraints**: `1 <= s.length <= 10^5`, `s[i]` is a lowercase letter, input is guaranteed valid.

## 📝 Interview Tips

1. **Clarify**: "Input đảm bảo valid (có thể tái tạo thành công)?" / Input guaranteed to be reconstructible
2. **Approach**: "Tìm ký tự đặc trưng của từng chữ số, giải theo thứ tự phụ thuộc" / Find unique markers, solve in dependency order
3. **Edge cases**: "Chỉ có một loại chữ số, toàn bộ cùng loại" / Single digit type repeated many times
4. **Optimize**: "Frequency array O(26) là đủ — không cần HashMap" / Fixed 26-char array is optimal
5. **Test**: `"zerozero"` → `"00"`, `"eight"` → `"8"`
6. **Follow-up**: "Nếu từ ngôn ngữ khác?" / Generalize to another language's digit words

## Solutions

```typescript
/** Solution 1: Brute Force — thử tất cả combination (TLE cho large input)
 * Time: O(n!) | Space: O(n)
 * Chỉ minh họa ý tưởng — không thực tế
 */
function reconstructDigitsBrute(s: string): string {
  const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const freq: number[] = new Array(26).fill(0);
  const a = "a".charCodeAt(0);
  for (const c of s) freq[c.charCodeAt(0) - a]++;
  // greedy: try removing each word's letters
  const counts = new Array(10).fill(0);
  for (let digit = 0; digit <= 9; digit++) {
    const word = words[digit];
    const wFreq: number[] = new Array(26).fill(0);
    for (const c of word) wFreq[c.charCodeAt(0) - a]++;
    const maxTimes = Math.min(...wFreq.map((f, i) => (f > 0 ? Math.floor(freq[i] / f) : Infinity)));
    counts[digit] = maxTimes;
    for (let i = 0; i < 26; i++) freq[i] -= wFreq[i] * maxTimes;
  }
  return counts.map((c, d) => String(d).repeat(c)).join("");
}

/** Solution 2: Unique Character Identification — O(n), giải theo thứ tự cố định
 * Time: O(n) | Space: O(1)
 */
function reconstructOriginalDigitsFromEnglish(s: string): string {
  const cnt: number[] = new Array(26).fill(0);
  const a = "a".charCodeAt(0);
  for (const c of s) cnt[c.charCodeAt(0) - a]++;

  const digits = new Array(10).fill(0);
  // Unique identifiers:
  digits[0] = cnt["z".charCodeAt(0) - a]; // zero: only digit with 'z'
  digits[2] = cnt["w".charCodeAt(0) - a]; // two:  only digit with 'w'
  digits[4] = cnt["u".charCodeAt(0) - a]; // four: only digit with 'u'
  digits[6] = cnt["x".charCodeAt(0) - a]; // six:  only digit with 'x'
  digits[8] = cnt["g".charCodeAt(0) - a]; // eight:only digit with 'g'

  // Derived:
  digits[1] = cnt["o".charCodeAt(0) - a] - digits[0] - digits[2] - digits[4]; // one: o - zero - two - four
  digits[3] = cnt["h".charCodeAt(0) - a] - digits[8]; // three: h - eight
  digits[5] = cnt["f".charCodeAt(0) - a] - digits[4]; // five: f - four
  digits[7] = cnt["s".charCodeAt(0) - a] - digits[6]; // seven: s - six
  digits[9] = cnt["i".charCodeAt(0) - a] - digits[5] - digits[6] - digits[8]; // nine: i - five - six - eight

  return digits.map((count, digit) => String(digit).repeat(count)).join("");
}

// Test cases
console.log(reconstructOriginalDigitsFromEnglish("owoztneoer")); // "012"
console.log(reconstructOriginalDigitsFromEnglish("fviefuro")); // "45"
console.log(reconstructOriginalDigitsFromEnglish("eight")); // "8"
console.log(reconstructOriginalDigitsFromEnglish("zerozero")); // "00"
```

## 🔗 Related Problems

| Problem                                                                                                                                      | Relationship                     |
| -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| [Integer to English Words](https://leetcode.com/problems/integer-to-english-words)                                                           | Reverse: number → English words  |
| [Fraction to Recurring Decimal](https://leetcode.com/problems/fraction-to-recurring-decimal)                                                 | Math-based string reconstruction |
| [Number of Rectangles That Can Form The Largest Square](https://leetcode.com/problems/number-of-rectangles-that-can-form-the-largest-square) | Frequency-based counting         |
