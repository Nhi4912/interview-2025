---
layout: page
title: "Decode the Message"
difficulty: Easy
category: String
tags: [Hash Table, String]
leetcode_url: "https://leetcode.com/problems/decode-the-message"
---

# Decode the Message / Giải Mã Thông Điệp

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store) | [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống giải mã mật thư Caesar — key cho biết bảng mã hoá (char → decoded_char). Quét qua key, mỗi chữ cái chưa gặp thì gán cho chữ cái tiếp theo trong alphabet a-z.

**Pattern Recognition:**

- Signal: "substitution cipher" + "first occurrence order" → **Hash Map**
- Key insight: Scan key left-to-right, skip spaces. First occurrence of each letter maps to 'a', 'b', 'c', ... in order.
- Then decode message using this mapping (spaces stay spaces).

**Visual:**

```
key     = "the quick brown fox jumps over the lazy dog"
mapping:
  't'→'a', 'h'→'b', 'e'→'c', ' '→skip,
  'q'→'d', 'u'→'e', 'i'→'f', 'c'→'g', 'k'→'h',
  'b'→'i', 'r'→'j', 'o'→'k', 'w'→'l', 'n'→'m',
  ... (first 26 unique chars → a-z)

message = "vkbs bs t suepusuyd"
  v→? not in key yet... wait, 'v' doesn't appear → hmm
  Actually: decode each char using built map.
```

---

## Problem Description

You are given a string `key` (contains all 26 letters with possible spaces/repeats) and a string `message`. Decode `message` using the substitution cipher defined by `key` (first occurrence of each letter in key maps to 'a', 'b', 'c', ...). Spaces decode to spaces. ([LeetCode](https://leetcode.com/problems/decode-the-message))

Difficulty: Easy | Acceptance: ~85%

```
Example 1:
  key = "the quick brown fox jumps over the lazy dog"
  message = "vkbs bs t suepusuyd"
  → "this is a secret"

Example 2:
  key = "eljuxhpwnyrdgtqkviszcfmabo"
  message = "zwx hnfx lqantp mnoeius ycgk vcnjrdb"
  → "the five boxing wizards jump quickly"
```

Constraints:

- `26 <= key.length <= 2000`
- `key` contains all 26 lowercase letters + spaces
- `1 <= message.length <= 2000`
- `message` contains lowercase letters and spaces

---

## 📝 Interview Tips

1. **Clarify**: "Key có thể chứa spaces và ký tự lặp lại — chỉ lần đầu mỗi chữ cái tính" / Spaces and repeated chars in key are ignored — only first occurrence matters.
2. **Brute force = optimal**: "Đây là O(n+m) single-pass, không có cách nào tốt hơn" / O(n+m) is already optimal.
3. **Data structure**: "HashMap char→char hoặc int array[26]" / Array of 26 is faster than Map.
4. **Order matters**: "Thứ tự lần đầu trong key → a, b, c, ..." / First occurrence order is critical.
5. **Edge cases**: "Space trong message → giữ nguyên space" / Spaces in message are preserved as-is.
6. **Follow-up**: "Làm sao encode ngược lại? → Build inverse map" / Reverse map for encoding.

---

## Solutions

```typescript
/**
 * Solution 1: HashMap approach
 * Time: O(K + M) — K = key length, M = message length
 * Space: O(26) = O(1) — at most 26 char mappings
 */
function decodeMessage(key: string, message: string): string {
  const cipher = new Map<string, string>();
  let nextChar = 0; // 0='a', 1='b', ...

  // Build cipher from key (first occurrence of each letter)
  for (const c of key) {
    if (c !== " " && !cipher.has(c)) {
      cipher.set(c, String.fromCharCode(97 + nextChar));
      nextChar++;
    }
  }

  // Decode message
  const result: string[] = [];
  for (const c of message) {
    result.push(c === " " ? " " : (cipher.get(c) ?? c));
  }

  return result.join("");
}

/**
 * Solution 2: Array-based (faster, avoids Map overhead)
 * Time: O(K + M), Space: O(26) = O(1)
 */
function decodeMessageArray(key: string, message: string): string {
  const cipher = new Array(26).fill(""); // cipher[i] = decoded char for (i+'a')
  let nextCode = 97; // ASCII 'a'

  for (const c of key) {
    if (c === " ") continue;
    const idx = c.charCodeAt(0) - 97;
    if (cipher[idx] === "") {
      cipher[idx] = String.fromCharCode(nextCode++);
    }
  }

  const result: string[] = [];
  for (const c of message) {
    if (c === " ") {
      result.push(" ");
    } else {
      result.push(cipher[c.charCodeAt(0) - 97]);
    }
  }
  return result.join("");
}

/**
 * Solution 3: One-liner style (functional)
 * Time: O(K + M), Space: O(26)
 */
function decodeMessageFunctional(key: string, message: string): string {
  let idx = 0;
  const map: Record<string, string> = {};

  for (const c of key) {
    if (c !== " " && !(c in map)) {
      map[c] = String.fromCharCode(97 + idx++);
    }
  }

  return [...message].map((c) => (c === " " ? " " : map[c])).join("");
}

// === Test Cases ===
const key1 = "the quick brown fox jumps over the lazy dog";
console.log(decodeMessage(key1, "vkbs bs t suepusuyd")); // "this is a secret"
console.log(decodeMessage("eljuxhpwnyrdgtqkviszcfmabo", "zwx hnfx lqantp mnoeius ycgk vcnjrdb")); // "the five boxing wizards jump quickly"

console.log(decodeMessageArray(key1, "vkbs bs t suepusuyd")); // "this is a secret"
console.log(decodeMessageFunctional(key1, "vkbs bs t suepusuyd")); // "this is a secret"
```

---

## 🔗 Related Problems

| Problem                                                                                  | Pattern         | Difficulty |
| ---------------------------------------------------------------------------------------- | --------------- | ---------- |
| [Caesar Cipher Encryptor](https://leetcode.com/problems/encrypt-and-decrypt-strings)     | Hash Map        | Easy       |
| [Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings)                   | Hash Map        | Easy       |
| [Word Pattern](https://leetcode.com/problems/word-pattern)                               | Hash Map        | Easy       |
| [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree) | Trie / Hash Map | Medium     |
