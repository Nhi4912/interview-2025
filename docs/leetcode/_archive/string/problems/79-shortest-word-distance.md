---
layout: page
title: "Shortest Word Distance"
difficulty: Easy
category: String
tags: [Array, String]
leetcode_url: "https://leetcode.com/problems/shortest-word-distance"
---

# Shortest Word Distance / Khoảng Cách Nhỏ Nhất Giữa Hai Từ

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Single-Pass Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Shortest Word Distance II](https://leetcode.com/problems/shortest-word-distance-ii) | [Shortest Word Distance III](https://leetcode.com/problems/shortest-word-distance-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm hai người bạn gần nhau nhất trên một dãy ghế ngồi — bạn đi từ đầu đến cuối, mỗi khi gặp một trong hai người thì cập nhật vị trí và kiểm tra khoảng cách với người kia.

**Pattern Recognition:**

- Signal: "find minimum gap between two values in array" → **Single-pass tracking**
- Key insight: không cần lưu hết vị trí — chỉ cần vị trí gần nhất của mỗi từ

**Visual — Single-pass tracking:**

```
wordsDict = ["practice","makes","perfect","coding","makes"]
word1="coding", word2="practice"

i=0: "practice" → pos1=0,  pos2=-1 → skip dist check
i=1: "makes"    → skip
i=2: "perfect"  → skip
i=3: "coding"   → pos2=3,  pos1=0  → dist = |3-0| = 3
i=4: "makes"    → skip

min = 3 ✅
```

---

## Problem Description

Given an array of strings `wordsDict` and two different strings `word1` and `word2`, return the **shortest distance** (by index) between `word1` and `word2` in the array. ([LeetCode 243](https://leetcode.com/problems/shortest-word-distance))

**Example 1:** `wordsDict = ["practice","makes","perfect","coding","makes"], word1="coding", word2="practice"` → `3`
**Example 2:** `wordsDict = ["a","c","b","b","a"], word1="a", word2="b"` → `1`

Constraints: Both words are guaranteed to exist in the array; `word1 ≠ word2`

---

## 📝 Interview Tips

1. **Clarify**: "word1 và word2 có bao giờ bằng nhau không?" / Can word1 equal word2? (No in this problem; yes in variant III)
2. **Brute force**: "Lưu tất cả vị trí của mỗi từ → duyệt hai danh sách → O(n + p·q)" / Two lists then cross-compare
3. **Optimize**: "Single-pass: chỉ cần lưu index gần nhất của mỗi từ → O(n), O(1)" / Track last seen index of each
4. **Edge cases**: "Hai từ ở cạnh nhau → return 1; một từ ở đầu, một ở cuối → n-1" / Adjacent → 1, ends → n-1
5. **Follow-up**: "Nếu gọi nhiều lần (Shortest Word Distance II)? → preprocess index lists" / Precompute indices for repeated queries
6. **Complexity**: "O(n) time, O(1) space — chỉ lưu hai biến lastPos1, lastPos2" / Two variables, linear scan

---

## Solutions

```typescript
/**
 * Solution 1: Single-pass O(1) space
 * Time: O(n) — one scan through the array
 * Space: O(1) — two pointer variables only
 */
function shortestWordDistance(wordsDict: string[], word1: string, word2: string): number {
  let pos1 = -1,
    pos2 = -1;
  let minDist = Infinity;

  for (let i = 0; i < wordsDict.length; i++) {
    if (wordsDict[i] === word1) pos1 = i;
    else if (wordsDict[i] === word2) pos2 = i;

    if (pos1 !== -1 && pos2 !== -1) {
      minDist = Math.min(minDist, Math.abs(pos1 - pos2));
    }
  }

  return minDist;
}

/**
 * Solution 2: Precomputed index lists (useful for repeated queries)
 * Time: O(n + p*q) worst case, but typical O(n) with sorted merge
 * Space: O(n) — store index lists
 */
function shortestWordDistanceIndexLists(wordsDict: string[], word1: string, word2: string): number {
  const idx1: number[] = [],
    idx2: number[] = [];
  for (let i = 0; i < wordsDict.length; i++) {
    if (wordsDict[i] === word1) idx1.push(i);
    else if (wordsDict[i] === word2) idx2.push(i);
  }

  let i = 0,
    j = 0,
    minDist = Infinity;
  while (i < idx1.length && j < idx2.length) {
    minDist = Math.min(minDist, Math.abs(idx1[i] - idx2[j]));
    if (idx1[i] < idx2[j]) i++;
    else j++;
  }

  return minDist;
}

// === Test Cases ===
console.log(
  shortestWordDistance(["practice", "makes", "perfect", "coding", "makes"], "coding", "practice"),
); // → 3
console.log(shortestWordDistance(["a", "c", "b", "b", "a"], "a", "b")); // → 1
console.log(shortestWordDistance(["a", "b"], "a", "b")); // → 1
```

---

## 🔗 Related Problems

| Problem                                                                                  | Difficulty | Pattern                         |
| ---------------------------------------------------------------------------------------- | ---------- | ------------------------------- |
| [Shortest Word Distance II](https://leetcode.com/problems/shortest-word-distance-ii)     | 🟡 Medium  | Hash Map + Binary Search        |
| [Shortest Word Distance III](https://leetcode.com/problems/shortest-word-distance-iii)   | 🟡 Medium  | Single-pass (same word allowed) |
| [Find Closest Number to Zero](https://leetcode.com/problems/find-closest-number-to-zero) | 🟢 Easy    | Linear Scan                     |
| [Minimum Absolute Difference](https://leetcode.com/problems/minimum-absolute-difference) | 🟢 Easy    | Sort + Adjacent                 |
| [Search Suggestions System](https://leetcode.com/problems/search-suggestions-system)     | 🟡 Medium  | Trie / Sort                     |
