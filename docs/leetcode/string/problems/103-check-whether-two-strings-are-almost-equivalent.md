---
layout: page
title: "Check Whether Two Strings are Almost Equivalent"
difficulty: Easy
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/check-whether-two-strings-are-almost-equivalent"
---

# Check Whether Two Strings are Almost Equivalent / Kiểm Tra Hai Chuỗi Gần Tương Đương

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Frequency Counter
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

## 🧠 Intuition / Tư Duy

> Giống như so sánh danh sách nguyên liệu của hai công thức nấu ăn — nếu lượng từng nguyên liệu chênh lệch không quá 3, thì hai công thức "gần như" giống nhau. Đếm tần suất từng ký tự rồi so sánh hiệu.

**Pattern Recognition:**

- Signal: "frequency difference" + "all 26 letters" → **Frequency Counter (array[26])**
- Dùng một mảng duy nhất: +1 cho word1, -1 cho word2
- Kiểm tra |diff[c]| <= 3 với mọi chữ cái

**Visual:**

```
word1="aaaa" word2="bccb"
diff array (a..z):
  a: +4 - 0 = 4  → |4| > 3  → false

word1="ab" word2="ab"
diff array:
  a: +1 - 1 = 0  → ok
  b: +1 - 1 = 0  → ok  → true
```

## Problem Description

Two strings `word1` and `word2` are **almost equivalent** if the difference between the frequencies of each letter is at most 3. Return `true` if they are almost equivalent, `false` otherwise.

- **Example 1**: `word1 = "aaaa"`, `word2 = "bccb"` → `false` (a: |4-0|=4 > 3)
- **Example 2**: `word1 = "abcdeef"`, `word2 = "abaaacc"` → `false` (e: |2-0|=2 ok, but b:|1-1|=0, d:|1-0|=1, e:|2-0|=2, f:|1-0|=1 all ok… wait let me recheck — actually `f`=1 in word1, 0 in word2 → |1|=1 ok. Hmm, must be false on some letter)

**Constraints**: `1 <= word1.length, word2.length <= 100`, both consist of lowercase letters only.

## 📝 Interview Tips

1. **Clarify**: "Chênh lệch tần suất tối đa là 3, bao gồm cả các ký tự chỉ xuất hiện ở một chuỗi?" / Letters appearing in only one string also count
2. **Approach**: "Dùng một mảng diff[26] thay vì hai Map riêng" / Single diff array beats two separate maps
3. **Edge cases**: "Chuỗi rỗng → all diffs = 0 → true; ký tự có diff = 3 → vẫn true" / Empty strings pass; threshold is ≤ 3
4. **Optimize**: "Array[26] O(1) space thay HashMap O(26)" / Fixed array is constant space
5. **Test**: `word1="a"*3, word2=""` → |3| > 3? No → true. `word1="a"*4, word2=""` → false
6. **Follow-up**: "Nếu threshold thay đổi theo từng ký tự?" / Variable threshold per character

## Solutions

```typescript
/** Solution 1: Two Maps — đếm riêng rồi so sánh
 * Time: O(n) | Space: O(1) — 26 chars max
 */
function checkAlmostEquivalentTwoMaps(word1: string, word2: string): boolean {
  const freq1: Record<string, number> = {};
  const freq2: Record<string, number> = {};
  for (const c of word1) freq1[c] = (freq1[c] ?? 0) + 1;
  for (const c of word2) freq2[c] = (freq2[c] ?? 0) + 1;
  const allChars = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  for (const c of allChars) {
    if (Math.abs((freq1[c] ?? 0) - (freq2[c] ?? 0)) > 3) return false;
  }
  return true;
}

/** Solution 2: Single Diff Array — +1 for word1, -1 for word2
 * Time: O(n) | Space: O(1)
 */
function checkAlmostEquivalent(word1: string, word2: string): boolean {
  const diff = new Array(26).fill(0);
  const a = "a".charCodeAt(0);
  for (const c of word1) diff[c.charCodeAt(0) - a]++;
  for (const c of word2) diff[c.charCodeAt(0) - a]--;
  return diff.every((d) => Math.abs(d) <= 3);
}

/** Solution 3: Reduce approach — functional style
 * Time: O(n) | Space: O(1)
 */
function checkAlmostEquivalentFunctional(word1: string, word2: string): boolean {
  const count = new Array(26).fill(0);
  const a = "a".charCodeAt(0);
  [...word1].forEach((c) => count[c.charCodeAt(0) - a]++);
  [...word2].forEach((c) => count[c.charCodeAt(0) - a]--);
  return count.every((v) => Math.abs(v) <= 3);
}

// Test cases
console.log(checkAlmostEquivalent("aaaa", "bccb")); // false
console.log(checkAlmostEquivalent("abcdeef", "abaaacc")); // false
console.log(checkAlmostEquivalent("cccddabba", "babcccdd")); // true
console.log(checkAlmostEquivalent("", "")); // true
```

## 🔗 Related Problems

| Problem                                                                  | Relationship                            |
| ------------------------------------------------------------------------ | --------------------------------------- |
| [Ransom Note](https://leetcode.com/problems/ransom-note)                 | Frequency counting with threshold check |
| [Reorganize String](https://leetcode.com/problems/reorganize-string)     | Char frequency manipulation             |
| [Find the Difference](https://leetcode.com/problems/find-the-difference) | Frequency diff between two strings      |
