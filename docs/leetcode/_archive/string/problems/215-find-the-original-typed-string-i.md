---
layout: page
title: "Find the Original Typed String I"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/find-the-original-typed-string-i"
---

# Find the Original Typed String I / Tìm Chuỗi Gốc Đã Gõ I

> **Difficulty**: 🟢 Easy | **Category**: String | **Pattern**: String Scanning / Run-Length

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như khi gõ bàn phím mà giữ phím quá lâu — chữ bị lặp lại. Mỗi nhóm ký tự giống nhau liên tiếp là nơi có thể đã xảy ra giữ phím, nên mỗi nhóm như vậy cho ta thêm 1 khả năng (đã gõ nhầm ở đây).

**Pattern Recognition:**

- Count groups of consecutive identical characters
- Each group of length ≥ 2 could have had exactly one extra keystroke
- Total possible originals = 1 + number of groups with length ≥ 2

**Visual:**

```
word = "a a b c c c"
           ^       ^
Groups: [a,a], [b], [c,c,c]
- "aabccc": original could be "aabccc" itself (no extra press)
- OR press 'a' once: "abccc"
- OR press 'c' once: "aabcc"
- OR press 'c' twice: "aabcc" — wait only ONE key can be held

Groups with length≥2: {aa}→1, {ccc}→1
Answer = 1 + 2 = 3
```

## Problem Description

Alice typed a string on her keyboard. She may have accidentally held down exactly **one** key for too long, causing **one consecutive run** to have one extra character. Given the resulting string `word`, return the number of possible original strings she could have typed.

**Example 1:** `word = "abbcccc"` → `5` (groups: a, bb, cccc → 1 + 1 + 3 = 5)
**Example 2:** `word = "abcd"` → `1` (no consecutive duplicates)

**Constraints:** `1 <= word.length <= 100`, lowercase letters only

## 📝 Interview Tips

1. **Clarify**: Exactly one key held (at most one extra press) → at most one group shrinks by 1
2. **Approach**: Count consecutive-same-char groups; answer = 1 + sum of (group_length - 1)
3. **Edge cases**: All unique chars → return 1; single char → return 1
4. **Optimize**: O(n) single scan, no extra space beyond counters
5. **Follow-up**: Part II — what if any number of keys could be held? (exponential combinations)
6. **Complexity**: Time O(n), Space O(1)

## Solutions

```typescript
// Solution 1: Count Run Extras — Time: O(n) | Space: O(1)
function possibleStringCount(word: string): number {
  if (word.length === 0) return 1;

  let result = 1; // The word itself is always a candidate
  let i = 1;

  while (i < word.length) {
    if (word[i] === word[i - 1]) {
      // Part of a consecutive run → each extra char is one possible "held" position
      result++;
      while (i < word.length && word[i] === word[i - 1]) i++;
    } else {
      i++;
    }
  }

  return result;
}

// Solution 2: Group by Run-Length Encoding — Time: O(n) | Space: O(n)
function possibleStringCount2(word: string): number {
  // Build run-length encoding
  const runs: number[] = [];
  let i = 0;
  while (i < word.length) {
    let len = 1;
    while (i + len < word.length && word[i + len] === word[i]) len++;
    runs.push(len);
    i += len;
  }

  // For each run of length L, there are L-1 "extra" chars that could be removed
  return runs.reduce((sum, len) => sum + len, 0) - runs.length + 1;
  // = total_chars - num_runs + 1
  // = sum of (len-1) + 1
}

// Solution 3: Explicit enumeration (for small inputs) — Time: O(n) | Space: O(1)
function possibleStringCount3(word: string): number {
  let count = 1;
  for (let i = 1; i < word.length; i++) {
    if (word[i] === word[i - 1]) count++;
  }
  return count;
}

// Tests
console.log(possibleStringCount("abbcccc")); // 5
console.log(possibleStringCount("abcd")); // 1
console.log(possibleStringCount("aaaa")); // 4
console.log(possibleStringCount("a")); // 1
console.log(possibleStringCount("aab")); // 2
```

## 🔗 Related Problems

| Problem                                                                                                                       | Relationship                   |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| [String Compression](https://leetcode.com/problems/string-compression/)                                                       | Run-length encoding of strings |
| [Count Substrings That Differ by One Character](https://leetcode.com/problems/count-substrings-that-differ-by-one-character/) | Counting string variations     |
| [Decode String](https://leetcode.com/problems/decode-string/)                                                                 | String run-length decoding     |
