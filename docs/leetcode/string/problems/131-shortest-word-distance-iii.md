---
layout: page
title: "Shortest Word Distance III"
difficulty: Medium
category: String
tags: [Array, String]
leetcode_url: "https://leetcode.com/problems/shortest-word-distance-iii"
---

# Shortest Word Distance III / Khoảng Cách Từ Ngắn Nhất III

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Single-Pass Index Tracking
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Ví dụ thực tế:** Bạn đang tìm hai người bạn trong đám đông xếp hàng — có thể cùng tên. Bạn chỉ cần theo dõi vị trí gần nhất của mỗi người và liên tục cập nhật khoảng cách tối thiểu. Trường hợp đặc biệt: hai người cùng tên → theo dõi hai vị trí gần nhất của cùng một người.

**Pattern Recognition:**

- `word1 == word2` → cần hai occurrences của cùng word, track `prev` index
- `word1 != word2` → classic: track last seen index của cả hai, compute distance mỗi khi gặp
- One pass, update min distance on each match

**Visual:**

```
words = ["practice","makes","perfect","coding","makes"]
word1 = "makes", word2 = "coding"  (different)

i=0 "practice": skip
i=1 "makes":    idx1=1
i=2 "perfect":  skip
i=3 "coding":   idx2=3 → dist=|3-1|=2, min=2
i=4 "makes":    idx1=4 → dist=|4-3|=1, min=1
Result = 1

Same word case: word1=word2="makes"
i=1 "makes": prev=-1 → prev=1
i=4 "makes": prev=1  → dist=|4-1|=3, prev=4
Result = 3
```

## Problem Description

Given a list of words and two words `word1` and `word2` (**which may be the same**), return the **shortest distance** between them in the list. If they are the same word, find the shortest distance between two different occurrences.

Examples: `(["practice","makes","perfect","coding","makes"], "makes", "coding")` → 1 | same word `"makes"` → 3.

## 📝 Interview Tips

1. **Clarify**: word1 và word2 có thể bằng nhau không? / Yes, this is the key difference from version I
2. **Approach**: Nếu same word: track prev; nếu khác: track idx1, idx2 / Branch on equality
3. **Edge cases**: Chỉ có 2 occurrences of same word → distance between them / Always at least 2 if same
4. **Optimize**: Single pass O(n), no extra space / Already optimal with just two index vars
5. **Follow-up**: Nếu gọi nhiều lần với cùng words array? → Precompute HashMap<word, indices[]> / Precompute for repeated queries
6. **Complexity**: O(n) time, O(1) space / Linear single pass

## Solutions

```typescript
/** Solution 1: Single Pass with Conditional Logic (Optimal)
 * Time: O(n) | Space: O(1)
 */
function shortestWordDistance(wordsDict: string[], word1: string, word2: string): number {
  let min = Infinity;
  let idx1 = -1;
  let idx2 = -1;
  const same = word1 === word2;

  for (let i = 0; i < wordsDict.length; i++) {
    if (wordsDict[i] === word1) {
      if (same) {
        // When same word: idx1 becomes previous occurrence
        if (idx1 !== -1) min = Math.min(min, i - idx1);
        idx1 = i;
      } else {
        idx1 = i;
        if (idx2 !== -1) min = Math.min(min, Math.abs(idx1 - idx2));
      }
    } else if (!same && wordsDict[i] === word2) {
      idx2 = i;
      if (idx1 !== -1) min = Math.min(min, Math.abs(idx1 - idx2));
    }
  }

  return min;
}

/** Solution 2: Collect Indices then Compare (Cleaner but more space)
 * Time: O(n * m) | Space: O(n)
 */
function shortestWordDistanceIndices(wordsDict: string[], word1: string, word2: string): number {
  const pos1: number[] = [];
  const pos2: number[] = [];

  for (let i = 0; i < wordsDict.length; i++) {
    if (wordsDict[i] === word1) pos1.push(i);
    if (wordsDict[i] === word2) pos2.push(i);
  }

  let min = Infinity;
  let i = 0,
    j = 0;

  // Two-pointer on sorted index lists
  while (i < pos1.length && j < pos2.length) {
    if (pos1[i] === pos2[j]) {
      // Same word: skip comparing same occurrence
      j++;
      continue;
    }
    min = Math.min(min, Math.abs(pos1[i] - pos2[j]));
    if (pos1[i] < pos2[j]) i++;
    else j++;
  }

  return min;
}

/** Solution 3: Unified tracker (elegant)
 * Time: O(n) | Space: O(1)
 */
function shortestWordDistanceUnified(wordsDict: string[], word1: string, word2: string): number {
  let prev = -1;
  let min = Infinity;

  for (let i = 0; i < wordsDict.length; i++) {
    if (wordsDict[i] === word1 || wordsDict[i] === word2) {
      if (prev !== -1 && (word1 === word2 || wordsDict[i] !== wordsDict[prev])) {
        min = Math.min(min, i - prev);
      }
      prev = i;
    }
  }

  return min;
}

// Tests
const words = ["practice", "makes", "perfect", "coding", "makes"];
console.log(shortestWordDistance(words, "makes", "coding")); // 1
console.log(shortestWordDistance(words, "makes", "makes")); // 3
console.log(shortestWordDistance(words, "coding", "practice")); // 3
console.log(shortestWordDistanceIndices(words, "makes", "coding")); // 1
console.log(shortestWordDistanceUnified(words, "makes", "makes")); // 3
console.log(shortestWordDistanceUnified(["a", "b", "a"], "a", "a")); // 2
```

## 🔗 Related Problems

| Problem                                                                                  | Relationship                          |
| ---------------------------------------------------------------------------------------- | ------------------------------------- |
| [Shortest Word Distance](https://leetcode.com/problems/shortest-word-distance)           | Same problem without same-word case   |
| [Shortest Word Distance II](https://leetcode.com/problems/shortest-word-distance-ii)     | Precompute for multiple queries       |
| [Find Closest Number to Zero](https://leetcode.com/problems/find-closest-number-to-zero) | Tracking closest/min index difference |
