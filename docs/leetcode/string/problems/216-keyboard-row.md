---
layout: page
title: "Keyboard Row"
difficulty: Easy
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/keyboard-row"
---

# Keyboard Row / Hàng Bàn Phím

> **Difficulty**: 🟢 Easy | **Category**: String | **Pattern**: Set Membership Check

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như kiểm tra xem tên người đó chỉ dùng các chữ ở một tầng bàn phím — giống kiểm tra học sinh chỉ học trong một khối lớp nhất định không học ở khối khác.

**Pattern Recognition:**

- Pre-define 3 sets for keyboard rows
- For each word, check if ALL characters belong to the same row
- Use Set intersection: if all chars ∈ row_i → include word

**Visual:**

```
QWERTY keyboard rows:
Row 1: q w e r t y u i o p
Row 2: a s d f g h j k l
Row 3: z x c v b n m

word = "Hello"
→ lowercase: "hello"
h → row2, e → row1 → mixed rows → SKIP

word = "Alaska"
→ lowercase: "alaska"
a→r2, l→r2, a→r2, s→r2, k→r2, a→r2 → all row2 ✓
```

## Problem Description

Given a list of strings, return all strings that can be typed using **letters from only one row** of an American QWERTY keyboard.

**Example 1:** `["Hello","Alaska","Dad","Peace"]` → `["Alaska","Dad"]`
**Example 2:** `["omk"]` → `[]`

**Constraints:** `1 <= words.length <= 20`, `1 <= words[i].length <= 100`, only letters (upper/lowercase)

## 📝 Interview Tips

1. **Clarify**: Case-insensitive! 'A' and 'a' are the same key
2. **Approach**: Map each char to row number; word passes if all chars map to same row
3. **Edge cases**: Single-char words (always valid), mixed case input
4. **Optimize**: Pre-build char→row map; O(n\*m) where m = avg word length
5. **Follow-up**: What if keyboard layout is different (given as input)?
6. **Complexity**: Time O(n × m), Space O(1) for fixed 26-char row map

## Solutions

```typescript
// Solution 1: Char-to-Row Map — Time: O(n*m) | Space: O(1)
function findWords(words: string[]): string[] {
  const row1 = new Set("qwertyuiop");
  const row2 = new Set("asdfghjkl");
  const row3 = new Set("zxcvbnm");
  const rows = [row1, row2, row3];

  return words.filter((word) => {
    const lower = word.toLowerCase();
    return rows.some((row) => [...lower].every((c) => row.has(c)));
  });
}

// Solution 2: Precomputed char→row array — Time: O(n*m) | Space: O(1)
function findWords2(words: string[]): string[] {
  const rowMap: Record<string, number> = {};
  const keyboard = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

  keyboard.forEach((row, idx) => {
    for (const c of row) rowMap[c] = idx;
  });

  return words.filter((word) => {
    const lower = word.toLowerCase();
    const firstRow = rowMap[lower[0]];
    return [...lower].every((c) => rowMap[c] === firstRow);
  });
}

// Solution 3: Bitmask approach — Time: O(n*m) | Space: O(1)
function findWords3(words: string[]): string[] {
  // Assign each char a bitmask corresponding to its row (1, 2, or 4)
  const rowBit: number[] = new Array(26).fill(0);
  const r1 = "qwertyuiop",
    r2 = "asdfghjkl",
    r3 = "zxcvbnm";
  for (const c of r1) rowBit[c.charCodeAt(0) - 97] = 1;
  for (const c of r2) rowBit[c.charCodeAt(0) - 97] = 2;
  for (const c of r3) rowBit[c.charCodeAt(0) - 97] = 4;

  return words.filter((word) => {
    const lower = word.toLowerCase();
    let mask = 0;
    for (const c of lower) mask |= rowBit[c.charCodeAt(0) - 97];
    // Valid if exactly one bit set (only one row used)
    return (mask & (mask - 1)) === 0;
  });
}

// Tests
console.log(findWords(["Hello", "Alaska", "Dad", "Peace"])); // ["Alaska","Dad"]
console.log(findWords(["omk"])); // []
console.log(findWords(["adsdf", "sfd"])); // ["adsdf","sfd"]
console.log(findWords(["a"])); // ["a"]
console.log(findWords(["Aab"])); // []
```

## 🔗 Related Problems

| Problem                                                                                                                   | Relationship                   |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| [Find Words That Can Be Formed by Characters](https://leetcode.com/problems/find-words-that-can-be-formed-by-characters/) | Set membership filtering       |
| [Unique Morse Code Words](https://leetcode.com/problems/unique-morse-code-words/)                                         | Word encoding and grouping     |
| [Check if the Sentence Is Pangram](https://leetcode.com/problems/check-if-the-sentence-is-pangram/)                       | Character set membership check |
