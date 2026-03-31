---
layout: page
title: "Reverse Only Letters"
difficulty: Easy
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/reverse-only-letters"
---

# Reverse Only Letters / Đảo Ngược Chỉ Các Chữ Cái

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

## 🧠 Intuition / Tư Duy

> Giống như đảo ngược một hàng người trong đó một số người đứng im (người mặc đồng phục đặc biệt). Bạn chỉ hoán đổi vị trí của những người bình thường, những người đặc biệt vẫn đứng nguyên chỗ cũ.

**Pattern Recognition:**

- Signal: "reverse elements matching condition" + "keep others in place" → **Two Pointers skip non-target**
- Con trỏ L từ trái, R từ phải, skip khi gặp non-letter
- Swap khi cả hai đều là letter, tiến vào trong

**Visual:**

```
s = "a-bC-dEf-ghIj"
chars: ['a','-','b','C','-','d','E','f','-','g','h','I','j']
  L=0(a) R=12(j) → both letters → swap → j...a
  L=1(-) → skip → L=2
  R=11(I) → both letters (L=2=b, R=11=I) → swap
  ...
result: "j-Ih-dEf-ghCa"  ← only letters reversed
```

## Problem Description

Given string `s`, reverse the order of characters in `s` while keeping all non-letter characters in their original positions. Return the resulting string.

- **Example 1**: `s = "ab-cd"` → `"dc-ba"`
- **Example 2**: `s = "a-bC-dEf-ghIj"` → `"j-Ih-dEf-ghCa"`

**Constraints**: `1 <= s.length <= 100`, `s` consists of letters and `'-'`.

## 📝 Interview Tips

1. **Clarify**: "Non-letter là ký tự gì? Chỉ '-' hay bao gồm số, khoảng trắng?" / Clarify what counts as non-letter
2. **Approach**: "Two pointers: skip non-letters, swap letters, move inward" / Classic two-pointer reverse variant
3. **Edge cases**: "Chuỗi không có chữ cái? Chuỗi toàn chữ cái?" / No letters = unchanged, all letters = full reverse
4. **Optimize**: "O(n) time O(n) space cho char array — không thể in-place với string" / JS strings immutable, need array
5. **Test**: `"-"` → `"-"`, `"Test1ng-Leet=code-Q!"` → `"Qedo1ct-eeLg=ntse-T!"`
6. **Follow-up**: "Nếu cần giữ nguyên digits thay vì non-letters?" / Generalize: keep specific char class

## Solutions

```typescript
/** Solution 1: Extract + Reverse + Reinsert
 * Time: O(n) | Space: O(n)
 */
function reverseOnlyLettersBrute(s: string): string {
  const letters = s
    .split("")
    .filter((c) => /[a-zA-Z]/.test(c))
    .reverse();
  let li = 0;
  return s
    .split("")
    .map((c) => (/[a-zA-Z]/.test(c) ? letters[li++] : c))
    .join("");
}

/** Solution 2: Two Pointers in char array — single pass
 * Time: O(n) | Space: O(n)
 */
function reverseOnlyLetters(s: string): string {
  const chars = s.split("");
  const isLetter = (c: string) => (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
  let l = 0,
    r = chars.length - 1;
  while (l < r) {
    while (l < r && !isLetter(chars[l])) l++;
    while (l < r && !isLetter(chars[r])) r--;
    if (l < r) {
      [chars[l], chars[r]] = [chars[r], chars[l]];
      l++;
      r--;
    }
  }
  return chars.join("");
}

/** Solution 3: Stack — push all letters, then rebuild
 * Time: O(n) | Space: O(n)
 */
function reverseOnlyLettersStack(s: string): string {
  const isLetter = (c: string) => (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
  const stack = s.split("").filter(isLetter);
  return s
    .split("")
    .map((c) => (isLetter(c) ? stack.pop()! : c))
    .join("");
}

// Test cases
console.log(reverseOnlyLetters("ab-cd")); // "dc-ba"
console.log(reverseOnlyLetters("a-bC-dEf-ghIj")); // "j-Ih-dEf-ghCa"
console.log(reverseOnlyLetters("Test1ng-Leet=code-Q!")); // "Qedo1ct-eeLg=ntse-T!"
console.log(reverseOnlyLetters("-")); // "-"
```

## 🔗 Related Problems

| Problem                                                                                                            | Relationship                     |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| [Reverse String](https://leetcode.com/problems/reverse-string)                                                     | Full reverse — simpler base case |
| [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string)                               | Reverse at word level            |
| [Remove All Adjacent Duplicates in String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string) | Stack-based string manipulation  |
