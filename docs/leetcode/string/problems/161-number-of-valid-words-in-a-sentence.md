---
layout: page
title: "Number of Valid Words in a Sentence"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/number-of-valid-words-in-a-sentence"
---

# Number of Valid Words in a Sentence / Số Từ Hợp Lệ Trong Câu

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Câu có các "token" phân cách bởi khoảng trắng. Một token hợp lệ nếu: chỉ gồm chữ thường/dấu gạch ngang/dấu câu, tối đa một dấu gạch ngang (kẹp giữa 2 chữ cái), tối đa một dấu câu (phải ở cuối). Không được có số!

**EN:** Split by whitespace, then validate each token against three rules using regex or manual scanning.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Number of Valid Words in a Sentence example:**

```
"cat and  in-2"
 ✅  ✅   ❌ (digit found)

Valid token rules:
 [a-z]* optional-hyphen [a-z]* optional-punct-at-end
 No digits anywhere!
```

---

## Problem Description

| #    | Problem                                  | Difficulty | Key Idea                 |
| ---- | ---------------------------------------- | ---------- | ------------------------ |
| 58   | Length of Last Word                      | 🟢 Easy    | String split/trim        |
| 520  | Detect Capital                           | 🟢 Easy    | Character classification |
| 1805 | Number of Different Integers in a String | 🟢 Easy    | Token extraction         |

---

## 📝 Interview Tips

- 🇻🇳 **Tách token:** `sentence.split(' ')` — có thể có nhiều khoảng trắng, lọc token rỗng
- 🇬🇧 **Empty tokens:** `split(' ')` on multiple spaces creates empty strings — filter them out
- 🇻🇳 **Dấu gạch ngang hợp lệ:** phải có chữ cái ở cả hai bên, ví dụ `"a-b"` ✅ `"-a"` ❌
- 🇬🇧 **Hyphen rule:** exactly one, and both neighbors must be `[a-z]`
- 🇻🇳 **Dấu câu** `! . ,` chỉ được xuất hiện ở vị trí cuối cùng của token
- 🇬🇧 **Regex approach:** `/^[a-z]*([a-z]-[a-z])?[a-z]*[!.,]?$/` cleanly captures all rules

---

## Solutions

```typescript
/**
 * Split by whitespace, validate each token with regex.
 * Time: O(n) | Space: O(n) — split creates token array
 */
function countValidWords(sentence: string): number {
  const tokens = sentence.split(" ").filter((t) => t.length > 0);
  // Valid: lowercase letters, at most one hyphen (flanked by letters), at most one punct at end, no digits
  const valid = /^[a-z]*([a-z]-[a-z])?[a-z]*[!.,]?$/;
  return tokens.filter((t) => valid.test(t)).length;
}

console.log(countValidWords("cat and  in-2")); // 2
console.log(countValidWords("!this  1-s b!d")); // 0
console.log(countValidWords("alice and  bob are playing stone-game10")); // 5

/**
 * Manually validate each token — no regex, explicit state machine.
 * Time: O(n) | Space: O(1) extra per token
 */
function countValidWords2(sentence: string): number {
  function isValid(token: string): boolean {
    if (token.length === 0) return false;
    let hyphenCount = 0;
    for (let i = 0; i < token.length; i++) {
      const c = token[i];
      if (c >= "0" && c <= "9") return false; // no digits
      if (c === "-") {
        if (++hyphenCount > 1) return false; // at most one hyphen
        if (i === 0 || i === token.length - 1) return false; // not at edges
        if (!/[a-z]/.test(token[i - 1]) || !/[a-z]/.test(token[i + 1])) return false;
      }
      if ("!.,".includes(c) && i !== token.length - 1) return false; // punct only at end
    }
    return true;
  }

  return sentence.split(" ").filter((t) => t.length > 0 && isValid(t)).length;
}

console.log(countValidWords2("cat and  in-2")); // 2
console.log(countValidWords2("he bought 2 pencils, 3 erasers, and 1  pencil-sharpener.")); // 6

/**
 * Use \s+ split to avoid empty token filtering.
 * Time: O(n) | Space: O(n)
 */
function countValidWords3(sentence: string): number {
  const tokens = sentence.trim().split(/\s+/);
  const valid = /^[a-z]*([a-z]-[a-z])?[a-z]*[!.,]?$/;
  return tokens.filter((t) => t.length > 0 && valid.test(t)).length;
}

console.log(countValidWords3("  leading spaces  ")); // 0
console.log(countValidWords3("a-b. ok! no2")); // 2
```

---

## 🔗 Related Problems

| #    | Problem                                  | Difficulty | Key Idea                 |
| ---- | ---------------------------------------- | ---------- | ------------------------ |
| 58   | Length of Last Word                      | 🟢 Easy    | String split/trim        |
| 520  | Detect Capital                           | 🟢 Easy    | Character classification |
| 1805 | Number of Different Integers in a String | 🟢 Easy    | Token extraction         |
