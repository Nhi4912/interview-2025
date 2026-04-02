---
layout: page
title: "Camelcase Matching"
difficulty: Medium
category: String
tags: [Array, Two Pointers, String, Trie, String Matching]
leetcode_url: "https://leetcode.com/problems/camelcase-matching"
---

# Camelcase Matching / Khớp Chữ Hoa Lạc Đà

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Pattern là "khung" của query — các chữ thường trong pattern **phải** xuất hiện theo thứ tự trong query, còn chữ hoa trong query là "tùy chọn bổ sung". Nếu query có chữ hoa mà không khớp với pattern hiện tại → sai. Dùng **two-pointer**: con trỏ pattern tiến khi ký tự khớp; nếu query có uppercase không khớp → false.

**EN:** Walk through the query char by char. If it matches the current pattern char, advance both pointers. If it's uppercase and doesn't match the current pattern char, return false. At the end, the pattern must be fully consumed.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Camelcase Matching example:**

```
query = "FooBar", pattern = "FB"
F matches F → advance both. o: lowercase, not F → skip
o: lowercase → skip. B matches B → advance both.
a,r: lowercase → skip. Pattern fully consumed ✅

query = "FooBar", pattern = "FoBr"
F✅ o✅ o:lowercase,next pattern=B → skip. B✅ a:lower→skip. r✅ ✅
```

---

## Problem Description

| #   | Problem                         | Difficulty | Key Idea                           |
| --- | ------------------------------- | ---------- | ---------------------------------- |
| 522 | Longest Uncommon Subsequence II | 🟡 Medium  | Subsequence matching               |
| 792 | Number of Matching Subsequences | 🟡 Medium  | Subsequence with multiple patterns |
| 408 | Valid Word Abbreviation         | 🟢 Easy    | Two-pointer string matching        |

---

## 📝 Interview Tips

- 🇻🇳 **Quy tắc chính:** uppercase trong query mà không match pattern → ngay lập tức false
- 🇬🇧 **Uppercase gate:** an uppercase query char MUST match the current pattern pointer — no skipping
- 🇻🇳 **Lowercase trong query:** có thể bỏ qua nếu không match pattern
- 🇬🇧 **Lowercase in query:** safe to skip if it doesn't match; it's "extra filler"
- 🇻🇳 **Pattern phải dùng hết:** sau khi duyệt query, `j === pattern.length` mới hợp lệ
- 🇬🇧 **Pattern exhausted:** if `j < pattern.length` at end, not all pattern chars were matched

---

## Solutions

```typescript
/**
 * For each query, use two pointers to match against pattern.
 * Time: O(m * n) where m = queries.length, n = avg query length
 * Space: O(1) per query
 */
function camelMatch(queries: string[], pattern: string): boolean[] {
  function matches(query: string): boolean {
    let j = 0; // pattern pointer
    for (let i = 0; i < query.length; i++) {
      const c = query[i];
      if (j < pattern.length && c === pattern[j]) {
        j++; // matched current pattern char
      } else if (c >= "A" && c <= "Z") {
        return false; // uppercase mismatch — cannot skip
      }
      // lowercase non-match: skip (do nothing)
    }
    return j === pattern.length;
  }

  return queries.map(matches);
}

console.log(camelMatch(["FooBar", "FooBarTest", "FootBall", "FrameBuffer", "ForceFeedBack"], "FB"));
// [true, false, true, true, false]
console.log(
  camelMatch(["FooBar", "FooBarTest", "FootBall", "FrameBuffer", "ForceFeedBack"], "FoBa"),
);
// [true, false, false, false, false]
console.log(
  camelMatch(["FooBar", "FooBarTest", "FootBall", "FrameBuffer", "ForceFeedBack"], "FoBaT"),
);
// [false, true, false, false, false]

/**
 * Build regex: each pattern char must appear; between them only lowercase allowed.
 * Time: O(m * n) | Space: O(p) for regex
 */
function camelMatch2(queries: string[], pattern: string): boolean[] {
  // Pattern "FB" → /^[a-z]*F[a-z]*B[a-z]*$/
  const regexStr = "^[a-z]*" + Array.from(pattern).join("[a-z]*") + "[a-z]*$";
  const re = new RegExp(regexStr);
  return queries.map((q) => re.test(q));
}

console.log(
  camelMatch2(["FooBar", "FooBarTest", "FootBall", "FrameBuffer", "ForceFeedBack"], "FB"),
);
// [true, false, true, true, false]
console.log(
  camelMatch2(["FooBar", "FooBarTest", "FootBall", "FrameBuffer", "ForceFeedBack"], "FoBa"),
);
// [true, false, false, false, false]

/**
 * Reuse two-pointer logic but early-return for efficiency.
 * Time: O(m * n) | Space: O(1)
 */
function camelMatch3(queries: string[], pattern: string): boolean[] {
  return queries.map((query) => {
    let pi = 0;
    for (const ch of query) {
      if (pi < pattern.length && ch === pattern[pi]) pi++;
      else if (ch < "a") return false; // uppercase not matching
    }
    return pi === pattern.length;
  });
}

console.log(camelMatch3(["aa", "aA"], "a")); // [true, false]
```

---

## 🔗 Related Problems

| #   | Problem                         | Difficulty | Key Idea                           |
| --- | ------------------------------- | ---------- | ---------------------------------- |
| 522 | Longest Uncommon Subsequence II | 🟡 Medium  | Subsequence matching               |
| 792 | Number of Matching Subsequences | 🟡 Medium  | Subsequence with multiple patterns |
| 408 | Valid Word Abbreviation         | 🟢 Easy    | Two-pointer string matching        |
