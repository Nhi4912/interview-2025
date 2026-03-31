---
layout: page
title: "Count Common Words With One Occurrence"
difficulty: Easy
category: String
tags: [Array, Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/count-common-words-with-one-occurrence"
---

# Count Common Words With One Occurrence / Đếm Từ Chung Xuất Hiện Đúng Một Lần

> **Difficulty**: 🟢 Easy | **Category**: String | **Pattern**: Hash Table / Counting

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như đối chiếu hai danh sách điểm danh — chỉ tính học sinh xuất hiện đúng một lần ở cả hai lớp, không tính trùng tên hay vắng mặt.

**Pattern Recognition:**

- "Exactly once in both" → two frequency maps + intersection check
- Count word only if freq1[word] === 1 AND freq2[word] === 1
- Hash map frequency counting pattern

**Visual:**

```
words1 = ["leetcode","is","amazing","as","amazing"]
words2 = ["amazing","leetcode","leetcode"]

freq1: {leetcode:1, is:1, amazing:2, as:1}
freq2: {amazing:1, leetcode:2}

Check each word with freq=1 in words1:
  leetcode → freq1=1, freq2=2 ✗
  is       → freq1=1, freq2=0 ✗
  as       → freq1=1, freq2=0 ✗

→ count = 0... wait let me re-check the example
Actually result should count "amazing" too:
  amazing → freq1=2, skip

Answer = 0
```

## Problem Description

Given two string arrays `words1` and `words2`, return the count of strings that appear **exactly once** in each of the two arrays.

**Example 1:** `words1=["leetcode","is","amazing","as","amazing"], words2=["amazing","leetcode","leetcode"]` → `0`
**Example 2:** `words1=["b","bb","bbb"], words2=["b","bb"]` → `2`

**Constraints:** `1 <= words1.length, words2.length <= 1000`, `1 <= words[i].length <= 30`

## 📝 Interview Tips

1. **Clarify**: "Common" means appears in both arrays, not just one
2. **Approach**: Build frequency maps for both arrays, count intersection with freq=1
3. **Edge cases**: Word in one array but not the other (freq = 0 ≠ 1), duplicates in one array
4. **Optimize**: Two-pass solution is already O(n+m)
5. **Follow-up**: What if exactly k occurrences? (just change === 1 to === k)
6. **Complexity**: Time O(n + m), Space O(n + m)

## Solutions

```typescript
// Solution 1: Two Frequency Maps — Time: O(n+m) | Space: O(n+m)
function countWords(words1: string[], words2: string[]): number {
  const freq1 = new Map<string, number>();
  const freq2 = new Map<string, number>();

  for (const w of words1) freq1.set(w, (freq1.get(w) ?? 0) + 1);
  for (const w of words2) freq2.set(w, (freq2.get(w) ?? 0) + 1);

  let count = 0;
  for (const [word, f1] of freq1) {
    if (f1 === 1 && freq2.get(word) === 1) count++;
  }
  return count;
}

// Solution 2: Set Intersection — Time: O(n+m) | Space: O(n+m)
function countWords2(words1: string[], words2: string[]): number {
  const once1 = new Set<string>();
  const once2 = new Set<string>();
  const multi1 = new Set<string>();
  const multi2 = new Set<string>();

  for (const w of words1) {
    if (multi1.has(w)) continue;
    if (once1.has(w)) {
      once1.delete(w);
      multi1.add(w);
    } else once1.add(w);
  }

  for (const w of words2) {
    if (multi2.has(w)) continue;
    if (once2.has(w)) {
      once2.delete(w);
      multi2.add(w);
    } else once2.add(w);
  }

  let count = 0;
  for (const w of once1) {
    if (once2.has(w)) count++;
  }
  return count;
}

// Solution 3: Object frequency (no Map) — Time: O(n+m) | Space: O(n+m)
function countWords3(words1: string[], words2: string[]): number {
  const freq1: Record<string, number> = {};
  const freq2: Record<string, number> = {};

  for (const w of words1) freq1[w] = (freq1[w] || 0) + 1;
  for (const w of words2) freq2[w] = (freq2[w] || 0) + 1;

  return Object.keys(freq1).filter((w) => freq1[w] === 1 && freq2[w] === 1).length;
}

// Tests
console.log(
  countWords(["leetcode", "is", "amazing", "as", "amazing"], ["amazing", "leetcode", "leetcode"]),
); // 0
console.log(countWords(["b", "bb", "bbb"], ["b", "bb"])); // 2
console.log(countWords(["a", "ab"], ["a", "a", "b", "ab"])); // 1
console.log(countWords(["a"], ["a"])); // 1
console.log(countWords(["a", "a"], ["a"])); // 0
```

## 🔗 Related Problems

| Problem                                                                                                                   | Relationship                        |
| ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/)                                   | Find common elements between arrays |
| [Unique Number of Occurrences](https://leetcode.com/problems/unique-number-of-occurrences/)                               | Frequency counting pattern          |
| [Find Words That Can Be Formed by Characters](https://leetcode.com/problems/find-words-that-can-be-formed-by-characters/) | Character frequency mapping         |
