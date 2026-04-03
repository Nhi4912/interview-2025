---
layout: page
title: "Reverse Substrings Between Each Pair of Parentheses"
difficulty: Medium
category: String
tags: [String, Stack]
leetcode_url: "https://leetcode.com/problems/reverse-substrings-between-each-pair-of-parentheses"
---

# Reverse Substrings Between Each Pair of Parentheses / Đảo ngược chuỗi con giữa các cặp ngoặc đơn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Decode String](https://leetcode.com/problems/decode-string) | [Simplify Path](https://leetcode.com/problems/simplify-path)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống cuộn băng cassette — khi gặp `(` đặt điểm đánh dấu, khi gặp `)` tua ngược từ điểm đó. Stack lưu chuỗi chờ ở mỗi lớp ngoặc.

```
s = "(abcd)"
Stack: [""]
'(' → push ""  stack: ["", ""]
'a','b','c','d' → stack: ["", "abcd"]
')' → pop "abcd", reverse → "dcba", append to top
     stack: ["dcba"]
Output: "dcba"

s = "(u(love)i)"
'(' → ["", ""]
u   → ["", "u"]
'(' → ["", "u", ""]
l,o,v,e → ["", "u", "love"]
')' → pop, rev="evol", top+="evol" → ["", "uevol"]
i   → ["", "uevoli"]
')' → pop, rev="iloveu" → ["iloveu"]
Output: "iloveu"
```

---

## 📝 Interview Tips / Ghi Nhớ Khi Phỏng Vấn

- 🔑 **Stack of strings / Stack chuỗi**: Mỗi frame là chuỗi đang xây ở độ sâu hiện tại
- 🔑 **On '(' push empty / Khi '(' push rỗng**: Mở lớp mới với chuỗi trống
- 🔑 **On ')' pop+reverse / Khi ')' pop+đảo**: Pop, đảo, nối vào top
- 🔑 **O(n²) naive / O(n) advanced**: Trick wormhole dùng pre-matched pairs + direction
- 🔑 **No extra chars / Không thêm ký tự**: Ngoặc không xuất hiện trong kết quả
- 🔑 **Start with one frame / Bắt đầu với một frame**: Init stack = `[""]` để tránh kiểm tra rỗng

---

## Solutions

### Solution 1: Stack of Strings — O(n²)

```typescript
/**
 * Use a stack where each entry is the string being built at that nesting depth.
 * On '(' push empty string. On ')' pop, reverse, append to new top.
 *
 * Time:  O(n²) — reversing can be O(n) per closing paren
 * Space: O(n)  — stack depth × content
 */
function reverseParentheses(s: string): string {
  const stack: string[] = [""];

  for (const ch of s) {
    if (ch === "(") {
      stack.push("");
    } else if (ch === ")") {
      const top = stack.pop()!.split("").reverse().join("");
      stack[stack.length - 1] += top;
    } else {
      stack[stack.length - 1] += ch;
    }
  }

  return stack[0];
}

console.log(reverseParentheses("(abcd)")); // "dcba"
console.log(reverseParentheses("(u(love)i)")); // "iloveu"
console.log(reverseParentheses("(ed(et(oc))el)")); // "leetcode"
console.log(reverseParentheses("a(bcdefghijkl(mno)p)q")); // "apmnolkjihgfedcbq"
```

### Solution 2: Wormhole Teleportation — O(n)

```typescript
/**
 * Pre-compute matching parenthesis pairs. Then walk with direction toggling:
 * when hitting a paren, jump to its match and flip direction.
 * Characters are only output when direction is forward and char is not a paren.
 *
 * Time:  O(n) — single pass build + single pass output
 * Space: O(n) — pair table
 */
function reverseParentheses2(s: string): string {
  const n = s.length;
  const pair = new Int32Array(n);
  const opens: number[] = [];

  // Build paren pair map
  for (let i = 0; i < n; i++) {
    if (s[i] === "(") {
      opens.push(i);
    } else if (s[i] === ")") {
      const j = opens.pop()!;
      pair[i] = j;
      pair[j] = i;
    }
  }

  let res = "";
  let dir = 1; // +1 forward, -1 backward
  let i = 0;

  while (i >= 0 && i < n) {
    if (s[i] === "(" || s[i] === ")") {
      i = pair[i];
      dir = -dir;
    } else {
      res += s[i];
    }
    i += dir;
  }

  return res;
}

console.log(reverseParentheses2("(abcd)")); // "dcba"
console.log(reverseParentheses2("(u(love)i)")); // "iloveu"
console.log(reverseParentheses2("(ed(et(oc))el)")); // "leetcode"
```

---

## 🔗 Related Problems / Bài Liên Quan

| #   | Problem                                                                    | Difficulty | Pattern |
| --- | -------------------------------------------------------------------------- | ---------- | ------- |
| 394 | [Decode String](https://leetcode.com/problems/decode-string)               | 🟡 Medium  | Stack   |
| 71  | [Simplify Path](https://leetcode.com/problems/simplify-path)               | 🟡 Medium  | Stack   |
| 856 | [Score of Parentheses](https://leetcode.com/problems/score-of-parentheses) | 🟡 Medium  | Stack   |
| 20  | [Valid Parentheses](https://leetcode.com/problems/valid-parentheses)       | 🟢 Easy    | Stack   |
