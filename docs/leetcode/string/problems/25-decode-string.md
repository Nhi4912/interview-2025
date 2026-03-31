---
layout: page
title: "Decode String"
difficulty: Medium
category: String
tags: [String, Stack, Recursion]
leetcode_url: "https://leetcode.com/problems/decode-string"
---

# Decode String / Giải Mã Chuỗi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Stack-based Nested Parsing
> **Frequency**: ⭐ Tier 2 — Gặp ở 29+ companies
> **See also**: [Basic Calculator](https://leetcode.com/problems/basic-calculator) | [Mini Parser](https://leetcode.com/problems/mini-parser)

---

## 🧠 Intuition / Tư Duy

- **Analogy:** Tưởng tượng bạn đang mở các hộp quà lồng nhau. Khi gặp `[`, bạn cất hộp hiện tại vào ngăn kéo (stack), bắt đầu hộp mới. Khi gặp `]`, bạn lấy hộp từ ngăn kéo ra, nhân nội dung hộp mới `k` lần, rồi nối vào hộp cũ. Stack quản lý trạng thái các lớp lồng nhau.

- **Pattern Recognition:**
  - Signal: "nested brackets" + "decode/expand" → **Stack for context saving**
  - Gặp `[`: push (currentStr, count) vào stack, reset cả hai
  - Gặp `]`: pop (prevStr, k), `currentStr = prevStr + currentStr.repeat(k)`
  - Số có thể nhiều chữ số (e.g., `100[a]`) — parse từng digit

- **Visual — s = "3[a2[c]]":**

```
stack=[], curr="", k=0

'3': k=3
'[': push("", 3) → stack=[("",3)], curr="", k=0
'a': curr="a"
'2': k=2
'[': push("a", 2) → stack=[("",3),("a",2)], curr="", k=0
'c': curr="c"
']': pop ("a",2) → curr = "a" + "c".repeat(2) = "acc"
']': pop ("",3)  → curr = "" + "acc".repeat(3) = "accaccacc"

Result: "accaccacc" ✓
```

---

## Problem Description

Given an encoded string `s`, return its decoded string.
The encoding rule: `k[encoded_string]` means `encoded_string` repeated exactly `k` times.
Input is always valid; numbers `k` are positive integers; brackets may be nested.

```
Input:  "3[a]2[bc]"        → "aaabcbc"
Input:  "3[a2[c]]"         → "accaccacc"
Input:  "2[abc]3[cd]ef"    → "abcabccdcdcdef"
Input:  "100[leetcode]"    → "leetcode" × 100
```

Constraints: `1 ≤ s.length ≤ 30`, `s` contains digits, letters, and `[]`.

---

## 📝 Interview Tips

1. **Stack lưu 2 thứ**: Chuỗi trước đó và số nhân k / **Stack stores pair**: (previousString, repeatCount)
2. **Parse multi-digit numbers**: `k = k * 10 + digit` khi gặp liên tiếp nhiều chữ số / **Multi-digit k**: accumulate digits before `[`
3. **Reset sau khi push**: Sau khi push vào stack, reset `curr = ""` và `k = 0` / **Reset on push**: start fresh for inner expression
4. **Không dùng eval**: Giải theo từng ký tự, không eval string / **No eval**: manual character-by-character parsing
5. **Đệ quy cũng hợp lệ**: Dùng index pointer, mỗi lần gặp `[` gọi đệ quy / **Recursion variant**: use index pointer, return when `]` seen
6. **Edge**: Chuỗi không có bracket → trả nguyên / **No brackets**: simple string passthrough

---

## Solutions

```typescript
/**
 * Solution 1: Recursive (clean, intuitive)
 * Time: O(maxK^depth * n) | Space: O(depth)
 */
function decodeStringRecursive(s: string): string {
  let i = 0;

  function decode(): string {
    let result = "";
    while (i < s.length && s[i] !== "]") {
      if (s[i] >= "0" && s[i] <= "9") {
        let k = 0;
        while (s[i] >= "0" && s[i] <= "9") k = k * 10 + Number(s[i++]);
        i++; // skip '['
        const inner = decode();
        i++; // skip ']'
        result += inner.repeat(k);
      } else {
        result += s[i++];
      }
    }
    return result;
  }

  return decode();
}

/**
 * Solution 2: Stack (iterative — preferred in interviews)
 * Time: O(maxK^depth * n) | Space: O(depth)
 */
function decodeString(s: string): string {
  const stack: [string, number][] = []; // [prevStr, repeatCount]
  let curr = "";
  let k = 0;

  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      k = k * 10 + Number(ch);
    } else if (ch === "[") {
      stack.push([curr, k]);
      curr = "";
      k = 0;
    } else if (ch === "]") {
      const [prevStr, count] = stack.pop()!;
      curr = prevStr + curr.repeat(count);
    } else {
      curr += ch;
    }
  }
  return curr;
}

// === Test Cases ===
console.log(decodeString("3[a]2[bc]")); // "aaabcbc"
console.log(decodeString("3[a2[c]]")); // "accaccacc"
console.log(decodeString("2[abc]3[cd]ef")); // "abcabccdcdcdef"
console.log(decodeString("abc")); // "abc"
console.log(decodeString("10[a]")); // "aaaaaaaaaa"
```

---

## 🔗 Related Problems

| Problem                                                                                    | Relationship                                         |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| [Basic Calculator](https://leetcode.com/problems/basic-calculator)                         | Stack for expression parsing with nested parentheses |
| [Mini Parser](https://leetcode.com/problems/mini-parser)                                   | Stack-based nested structure parsing                 |
| [Flatten Nested List Iterator](https://leetcode.com/problems/flatten-nested-list-iterator) | Iterative traversal of nested structure using stack  |
| [Number of Atoms](https://leetcode.com/problems/number-of-atoms)                           | Stack + map for nested chemical formula parsing      |
