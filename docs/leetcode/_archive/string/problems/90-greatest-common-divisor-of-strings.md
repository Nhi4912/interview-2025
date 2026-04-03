---
layout: page
title: "Greatest Common Divisor of Strings"
difficulty: Easy
category: String
tags: [Math, String]
leetcode_url: "https://leetcode.com/problems/greatest-common-divisor-of-strings"
---

# Greatest Common Divisor of Strings / Ước Số Chung Lớn Nhất Của Chuỗi

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Math
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii) | [Integer to English Words](https://leetcode.com/problems/integer-to-english-words)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống GCD số nguyên — "ABCABC" và "ABC" đều là bội của "ABC". Nếu str1 + str2 == str2 + str1 thì chúng chia sẻ cùng đơn vị cơ bản, và đơn vị đó có độ dài bằng gcd(len1, len2).

```
str1 = "ABCABC"   (len=6)
str2 = "ABC"      (len=3)

str1+str2 = "ABCABCABC"
str2+str1 = "ABCABCABC"  ✅ equal → GCD string exists

gcd(6, 3) = 3
answer = str1.substring(0, 3) = "ABC"
```

---

## Problem Description

Given two strings `str1` and `str2`, return the largest string `t` such that `t` divides both `str1` and `str2` (i.e., both strings are formed by repeating `t` some number of times). Return `""` if no such string exists.

**Example 1:** `str1="ABCABC", str2="ABC"` → `"ABC"`
**Example 2:** `str1="ABABAB", str2="ABAB"` → `"AB"`

Constraints: `1 ≤ str1.length, str2.length ≤ 1000`, strings contain only uppercase English letters.

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Chuỗi kết quả phải là prefix của cả hai không?" / Must result be prefix? Yes.
2. **Brute force / Vét cạn**: Try all prefixes of shorter string → O(min(m,n) \* (m+n))
3. **Key insight / Ý tưởng**: str1+str2 == str2+str1 là điều kiện cần và đủ để tồn tại GCD
4. **Optimize / Tối ưu**: dùng gcd(len1, len2) → O(log(min(m,n)))
5. **Edge cases / Trường hợp đặc biệt**: str1 == str2 → trả về chính nó; không chia hết → ""
6. **Follow-up / Hỏi thêm**: "Nếu có nhiều chuỗi?" / Apply pairwise GCD iteratively

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try all prefix lengths of shorter string
 * Time: O(min(m,n) * (m+n)) — check divisibility for each length
 * Space: O(m+n)
 */
function gcdOfStringsBrute(str1: string, str2: string): string {
  const minLen = Math.min(str1.length, str2.length);
  let result = "";
  for (let len = 1; len <= minLen; len++) {
    const candidate = str1.substring(0, len);
    const repeat = (s: string, t: string) =>
      t.length % s.length === 0 && t === s.repeat(t.length / s.length);
    if (repeat(candidate, str1) && repeat(candidate, str2)) {
      result = candidate;
    }
  }
  return result;
}
console.log(gcdOfStringsBrute("ABCABC", "ABC")); // "ABC"
console.log(gcdOfStringsBrute("ABABAB", "ABAB")); // "AB"

/**
 * Solution 2: GCD of lengths (Optimal)
 * Key: if str1+str2 == str2+str1 then a GCD string exists, with length = gcd(len1, len2)
 * Time: O(m+n) — concatenation check + O(log min(m,n)) for gcd
 * Space: O(m+n) — for concatenation strings
 */
function gcdOfStrings(str1: string, str2: string): string {
  // Necessary & sufficient condition: concatenation is commutative
  if (str1 + str2 !== str2 + str1) return "";

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  const len = gcd(str1.length, str2.length);
  return str1.substring(0, len);
}

console.log(gcdOfStrings("ABCABC", "ABC")); // "ABC"
console.log(gcdOfStrings("ABABAB", "ABAB")); // "AB"
console.log(gcdOfStrings("LEET", "CODE")); // ""
console.log(gcdOfStrings("TAUXXTAUXXTAUXX", "TAUXXTAUXXTAUXXTAUXXTAUXX")); // "TAUXX"
```

---

## 🔗 Related Problems

| Problem                                                                                                                                | Pattern      | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| [Multiply Strings](https://leetcode.com/problems/multiply-strings)                                                                     | Math         | Medium     |
| [Add Binary](https://leetcode.com/problems/add-binary)                                                                                 | Math         | Easy       |
| [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | Two Pointers | Easy       |
| [Repeated String Match](https://leetcode.com/problems/repeated-string-match)                                                           | Math         | Medium     |

---

## ⏱️ Complexity Summary

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute force (all prefixes) | O(min(m,n)·(m+n)) | O(m+n) | Correct but slow |
| GCD of lengths | O(m+n) | O(m+n) | Optimal — concat check + gcd |

**Key insight:** Both strings share a repeated unit iff their concatenations commute.
