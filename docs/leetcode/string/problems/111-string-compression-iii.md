---
layout: page
title: "String Compression III"
difficulty: Medium
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/string-compression-iii"
---

# String Compression III / Nén Chuỗi Phiên Bản III

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Processing (Run-Length Encoding)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> Giống như đọc nhanh danh sách điểm danh — thay vì gọi tên từng người trong nhóm giống nhau, bạn nói "5 người tên An" rồi chuyển sang nhóm tiếp theo. Điểm đặc biệt ở đây là mỗi lần chỉ ghi tối đa 9 người một lần.

**Pattern Recognition:**

- Signal: "count consecutive identical characters, max 9 per group" → **Run-Length Encoding**
- Duyệt từng ký tự, đếm run hiện tại, khi đổi ký tự hoặc count = 9 thì flush
- Output: `count + char` cho mỗi chunk

**Visual:**

```
word = "aaabccdddd"
  'a','a','a' → run('a', 3) → flush "3a"
  'b'         → run('b', 1) → new char found
  'c','c'     → flush "1b", run('c', 2)
  'd','d','d','d' → flush "2c", run('d', 4)
  end         → flush "4d"
result = "3a1b2c4d"

word = "aaaaaaaaaaaa" (12 a's)
  count reaches 9 → flush "9a", reset
  3 more 'a' → flush "3a"
result = "9a3a"
```

## Problem Description

Given a string `word`, compress it using the following algorithm: choose a prefix with all same characters of length at most 9, append the length then the character to `comp`, and delete the prefix. Repeat until empty. Return the resulting compressed string `comp`.

- **Example 1**: `word = "abcde"` → `"1a1b1c1d1e"`
- **Example 2**: `word = "aaaaaaaaaaaaaabb"` → `"9a5a2b"`

**Constraints**: `1 <= word.length <= 2 * 10^5`, `word` consists of lowercase English letters.

## 📝 Interview Tips

1. **Clarify**: "Mỗi chunk tối đa 9 ký tự — không phải toàn bộ run?" / Max 9 per chunk, not the whole run
2. **Approach**: "Duyệt từng ký tự, đếm run, flush khi đổi char hoặc count=9" / Scan + flush on change or count=9
3. **Edge cases**: "Chuỗi một ký tự → `'1' + char`; run dài 10 → `'9' + char + '1' + char`"
4. **Optimize**: "O(n) time O(n) space — không thể tốt hơn vì phải tạo output" / Linear is optimal
5. **Test**: `"aaaaaaaaa"` (9) → `"9a"`; `"aaaaaaaaaa"` (10) → `"9a1a"`
6. **Follow-up**: "Nếu muốn nén tối đa (không giới hạn 9)?" / Classic run-length encoding without the cap

## Solutions

```typescript
/** Solution 1: Brute Force — build runs first, then chunk
 * Time: O(n) | Space: O(n)
 */
function compressStringBrute(word: string): string {
  // Build run-length pairs first
  const runs: [string, number][] = [];
  let i = 0;
  while (i < word.length) {
    let j = i;
    while (j < word.length && word[j] === word[i]) j++;
    runs.push([word[i], j - i]);
    i = j;
  }
  // Then chunk each run into pieces of max 9
  let result = "";
  for (const [char, count] of runs) {
    let remaining = count;
    while (remaining > 0) {
      const chunk = Math.min(9, remaining);
      result += chunk + char;
      remaining -= chunk;
    }
  }
  return result;
}

/** Solution 2: Single Pass — flush on change or count==9
 * Time: O(n) | Space: O(n)
 */
function compressString(word: string): string {
  let result = "";
  let i = 0;
  while (i < word.length) {
    const ch = word[i];
    let count = 0;
    while (i < word.length && word[i] === ch && count < 9) {
      count++;
      i++;
    }
    result += count + ch;
  }
  return result;
}

/** Solution 3: Array join — avoid string concatenation
 * Time: O(n) | Space: O(n)
 */
function compressStringArray(word: string): string {
  const parts: string[] = [];
  let i = 0;
  while (i < word.length) {
    const ch = word[i];
    let count = 0;
    while (i < word.length && word[i] === ch && count < 9) {
      count++;
      i++;
    }
    parts.push(String(count), ch);
  }
  return parts.join("");
}

// Test cases
console.log(compressString("abcde")); // "1a1b1c1d1e"
console.log(compressString("aaaaaaaaaaaaaabb")); // "9a5a2b"
console.log(compressString("aaaaaaaaaa")); // "9a1a" (10 a's)
console.log(compressString("a")); // "1a"
console.log(compressString("aaaaaaaaa")); // "9a" (exactly 9)
```

## 🔗 Related Problems

| Problem                                                                | Relationship                              |
| ---------------------------------------------------------------------- | ----------------------------------------- |
| [String Compression](https://leetcode.com/problems/string-compression) | Same concept without the 9-cap constraint |
| [Decode String](https://leetcode.com/problems/decode-string)           | Reverse: decompress encoded string        |
| [Count and Say](https://leetcode.com/problems/count-and-say)           | Run-length encoding applied iteratively   |
