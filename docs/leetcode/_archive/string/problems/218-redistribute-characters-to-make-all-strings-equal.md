---
layout: page
title: "Redistribute Characters to Make All Strings Equal"
difficulty: Easy
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/redistribute-characters-to-make-all-strings-equal"
---

# Redistribute Characters to Make All Strings Equal / Phân Phối Ký Tự Để Tất Cả Chuỗi Bằng Nhau

> **Difficulty**: 🟢 Easy | **Category**: String | **Pattern**: Frequency Count / Divisibility

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như chia kẹo đều cho các em nhỏ — gom tất cả kẹo lại, đếm từng loại, nếu mỗi loại chia đều cho số em thì được, ngược lại thì không.

**Pattern Recognition:**

- Pool all characters → check divisibility by `n` (number of strings)
- If every char count divisible by n → can give each string equal share
- Frequency counting + modulo check

**Visual:**

```
words = ["abc", "aabc", "bc"]
n = 3

Total freq: a:3, b:3, c:3
3%3=0, 3%3=0, 3%3=0 → all divisible → true ✓

words = ["ab", "a"]
n = 2

Total freq: a:2, b:1
a: 2%2=0 ✓
b: 1%2=1 ✗ → false
```

## Problem Description

You are given an array of strings. You may take any character from any string and move it to any position in any string. Return `true` if it is possible to make all strings in the array **equal**.

**Example 1:** `words = ["abc","aabc","bc"]` → `true` (redistribute to make each `"abc"`)
**Example 2:** `words = ["ab","a"]` → `false` (b count = 1, can't split evenly)

**Constraints:** `1 <= words.length <= 100`, `1 <= words[i].length <= 100`, lowercase letters only

## 📝 Interview Tips

1. **Clarify**: All strings must end up identical — same characters in same or different order? Actually they just need to be equal strings
2. **Approach**: Sum all char frequencies; each must be divisible by `n`
3. **Edge cases**: Single string (always true); strings already equal
4. **Optimize**: O(total_chars) with a 26-element array
5. **Follow-up**: What if strings must be identical (not just same multiset)? (same answer — rearrange freely)
6. **Complexity**: Time O(Σ|words[i]|), Space O(26) = O(1)

## Solutions

```typescript
// Solution 1: Global Frequency Divisibility — Time: O(n*m) | Space: O(1)
function makeEqual(words: string[]): boolean {
  const freq = new Array(26).fill(0);
  const n = words.length;

  for (const word of words) {
    for (const c of word) {
      freq[c.charCodeAt(0) - 97]++;
    }
  }

  return freq.every((f) => f % n === 0);
}

// Solution 2: HashMap approach — Time: O(n*m) | Space: O(26)
function makeEqual2(words: string[]): boolean {
  const freq = new Map<string, number>();
  const n = words.length;

  for (const word of words) {
    for (const c of word) {
      freq.set(c, (freq.get(c) ?? 0) + 1);
    }
  }

  for (const count of freq.values()) {
    if (count % n !== 0) return false;
  }
  return true;
}

// Solution 3: Reduce to flat frequency — Time: O(n*m) | Space: O(26)
function makeEqual3(words: string[]): boolean {
  const n = words.length;
  const total = words.join("");
  const freq: Record<string, number> = {};

  for (const c of total) freq[c] = (freq[c] || 0) + 1;

  return Object.values(freq).every((f) => f % n === 0);
}

// Tests
console.log(makeEqual(["abc", "aabc", "bc"])); // true
console.log(makeEqual(["ab", "a"])); // false
console.log(makeEqual(["a", "a", "a"])); // true
console.log(makeEqual(["aab", "bbb"])); // false (a:2%2=0, b:4%2=0 → actually true!)
console.log(makeEqual(["a", "b"])); // false (a:1%2≠0)
```

## 🔗 Related Problems

| Problem                                                                                                                                             | Relationship                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| [Check if All Characters Have Equal Number of Occurrences](https://leetcode.com/problems/check-if-all-characters-have-equal-number-of-occurrences/) | Frequency uniformity check       |
| [Count Common Words With One Occurrence](https://leetcode.com/problems/count-common-words-with-one-occurrence/)                                     | Frequency counting across arrays |
| [Minimum Deletions to Make Character Frequencies Unique](https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique/)     | Frequency manipulation           |
