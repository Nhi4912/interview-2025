---
layout: page
title: "Valid Word"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/valid-word"
---

# Valid Word / Từ Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Text Justification](https://leetcode.com/problems/text-justification) | [Decode String](https://leetcode.com/problems/decode-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống kiểm tra hồ sơ xin việc — phải đủ độ dài, không có ký tự lạ, phải có ít nhất một nguyên âm và một phụ âm. Tất cả điều kiện phải thỏa mãn cùng lúc.

**Pattern Recognition:**

- Signal: "validate string against multiple rules" → **Simple String Iteration**
- Key insight: Check 4 conditions: length ≥ 3, only alphanumeric, ≥1 vowel, ≥1 consonant (letter that's not a vowel).
- Consonant = letter AND not vowel (digits don't count as vowel or consonant for the vowel/consonant check).

**Visual:**

```
"234Adas"  → len=7 ✓, all alphanumeric ✓, has 'A','a' (vowels) ✓, has 'd','s' (consonants) ✓  → true
"b3"       → len=2 < 3 → false
"a3$e"     → '$' not alphanumeric → false
"III"      → no vowels, no consonants (all digits?? no wait 'I' not alphanumeric... )
             wait: 'I' IS a letter. Is 'I' a vowel? Only a,e,i,o,u (lowercase) checked.
             'I' is uppercase letter, not in vowel set if case-sensitive... Let's check problem.
             The problem says vowels = {a,e,i,o,u} case-insensitive.
"aei"      → len=3 ✓, all alpha ✓, has vowels ✓, NO consonants → false
```

---

## Problem Description

A word is valid if:

1. Length ≥ 3
2. Only contains digits and English letters (no special chars)
3. Contains **at least one** vowel (a, e, i, o, u — case insensitive)
4. Contains **at least one** consonant (a letter that is NOT a vowel)

Return `true` if `word` is valid. ([LeetCode](https://leetcode.com/problems/valid-word))

Difficulty: Easy | Acceptance: ~37%

```
Example 1: word = "234Adas" → true
  All alphanumeric, len=7, has 'A','a' (vowels), has 'd','s' (consonants)

Example 2: word = "b3"  → false  (length < 3)
Example 3: word = "a3$e" → false (contains '$')
Example 4: word = "aeiou" → false (no consonants)
```

Constraints:

- `1 <= word.length <= 20`
- `word` consists of English letters, digits, and special characters

---

## 📝 Interview Tips

1. **Clarify**: "Consonant = chữ cái không phải nguyên âm? Số không tính là consonant?" / Consonant = letter that's not a vowel; digits don't contribute to vowel/consonant count.
2. **Order of checks**: "Kiểm tra từ dễ nhất trước: length, rồi alphanumeric, rồi vowel/consonant" / Short-circuit: check length first.
3. **Case sensitivity**: "Vowel check case-insensitive: 'A','E','I','O','U' đều là nguyên âm" / Uppercase vowels count too.
4. **Special chars**: "Chỉ cần một ký tự không phải letter/digit là invalid" / Any special char → invalid.
5. **Edge cases**: "word = '3' → len<3 false; word = 'aei' → no consonant false" / Length check + consonant check are common gotchas.
6. **Follow-up**: "Unicode support? → cần regex \p{L} cho letters" / For Unicode, use regex with Unicode property escapes.

---

## Solutions

```typescript
/**
 * Solution 1: Explicit iteration — most readable
 * Time: O(n) — single pass
 * Space: O(1)
 */
function isValid(word: string): boolean {
  if (word.length < 3) return false;

  const vowels = new Set(["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]);
  let hasVowel = false;
  let hasConsonant = false;

  for (const c of word) {
    const code = c.charCodeAt(0);
    const isLetter = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    const isDigit = code >= 48 && code <= 57;

    if (!isLetter && !isDigit) return false; // special char

    if (isLetter) {
      if (vowels.has(c)) hasVowel = true;
      else hasConsonant = true;
    }
  }

  return hasVowel && hasConsonant;
}

/**
 * Solution 2: Regex-based
 * Time: O(n), Space: O(1)
 */
function isValidRegex(word: string): boolean {
  if (word.length < 3) return false;

  // Check only alphanumeric
  if (!/^[a-zA-Z0-9]+$/.test(word)) return false;

  // Check at least one vowel
  if (!/[aeiouAEIOU]/.test(word)) return false;

  // Check at least one consonant (letter that is not a vowel)
  if (!/[b-df-hj-np-tv-zB-DF-HJ-NP-TV-Z]/.test(word)) return false;

  return true;
}

/**
 * Solution 3: Functional one-liner style
 * Time: O(n), Space: O(1)
 */
function isValidFunctional(word: string): boolean {
  const vowelSet = "aeiouAEIOU";
  const isAlphanumeric = (c: string) => /[a-zA-Z0-9]/.test(c);
  const isLetter = (c: string) => /[a-zA-Z]/.test(c);
  const isVowel = (c: string) => vowelSet.includes(c);

  return (
    word.length >= 3 &&
    [...word].every(isAlphanumeric) &&
    [...word].some((c) => isLetter(c) && isVowel(c)) &&
    [...word].some((c) => isLetter(c) && !isVowel(c))
  );
}

// === Test Cases ===
console.log(isValid("234Adas")); // true
console.log(isValid("b3")); // false  (length < 3)
console.log(isValid("a3$e")); // false  (special char)
console.log(isValid("aeiou")); // false  (no consonant)
console.log(isValid("abc")); // true
console.log(isValid("III")); // false  (no vowel — I is consonant? wait: I is a vowel!)
// "III" → has vowels(I), no consonants → false
console.log(isValid("Iamvalid")); // true

console.log(isValidRegex("234Adas")); // true
console.log(isValidFunctional("aeiou")); // false
```

---

## 🔗 Related Problems

| Problem                                                                                                    | Pattern           | Difficulty |
| ---------------------------------------------------------------------------------------------------------- | ----------------- | ---------- |
| [Check if String Is a Prefix of Array](https://leetcode.com/problems/check-if-string-is-a-prefix-of-array) | String Processing | Easy       |
| [Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings)                                     | String + Hash Map | Easy       |
| [Decode String](https://leetcode.com/problems/decode-string)                                               | Stack + String    | Medium     |
| [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string)                       | String Processing | Medium     |
