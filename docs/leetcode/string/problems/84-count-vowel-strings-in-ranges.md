---
layout: page
title: "Count Vowel Strings in Ranges"
difficulty: Medium
category: String
tags: [Array, String, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/count-vowel-strings-in-ranges"
---

# Count Vowel Strings in Ranges / Đếm Chuỗi Nguyên Âm Trong Khoảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring) | [Number of Same-End Substrings](https://leetcode.com/problems/number-of-same-end-substrings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tra cứu điểm thi — thay vì cộng lại từng điểm mỗi lần, giáo viên tính sẵn tổng tích lũy. Truy vấn tổng đoạn [l, r] = prefix[r+1] - prefix[l] trong O(1).

**Pattern Recognition:**

- Signal: "multiple range queries on array" → **Prefix Sum**
- Key insight: precompute prefix sum of "is vowel string" booleans; each query is O(1)

**Visual — Prefix Sum:**

```
words   = ["aba","bcb","ece","aa","e"]
isVowel = [  1,    0,    1,   1,  1]   (starts AND ends with vowel)
prefix  = [  0,    1,    1,   2,  3,  4]
           (prefix[i] = count of vowel strings in words[0..i-1])

Query [1,4]: prefix[5] - prefix[1] = 4 - 1 = 3 ✅
Query [0,2]: prefix[3] - prefix[0] = 2 - 0 = 2 ✅
```

---

## Problem Description

Given an array of strings `words` and a 2D array `queries`, for each query `[l, r]` count the strings in `words[l..r]` that **start and end with a vowel** ('a','e','i','o','u'). ([LeetCode 2559](https://leetcode.com/problems/count-vowel-strings-in-ranges))

**Example 1:** `words=["aba","bcb","ece","aa","e"], queries=[[0,2],[1,4],[1,3]]` → `[2,3,2]`
**Example 2:** `words=["a","e","i"], queries=[[0,2],[0,1],[2,2]]` → `[3,2,1]`

Constraints: `1 <= words.length, queries.length <= 10^5`

---

## 📝 Interview Tips

1. **Clarify**: "Cần start AND end với nguyên âm, hay start OR end?" / Both start AND end — single-char words count if it's a vowel
2. **Brute force**: "Với mỗi query duyệt O(r-l+1) → tổng O(n·q) = 10^10 → TLE" / O(n·q) is too slow
3. **Optimize**: "Prefix sum → build O(n), query O(1), tổng O(n+q)" / Precompute prefix sum
4. **Edge cases**: "Single char vowel word → valid (start=end=vowel); query l=r → single word" / Edge cases handled naturally
5. **Follow-up**: "Nếu words thay đổi (updates)?" → dùng Binary Indexed Tree (Fenwick) / BIT for dynamic updates
6. **Complexity**: "O(n + q) time total, O(n) space for prefix array" / Linear preprocessing, O(1) per query

---

## Solutions

```typescript
const VOWELS = new Set(["a", "e", "i", "o", "u"]);

function isVowelString(w: string): boolean {
  return VOWELS.has(w[0]) && VOWELS.has(w[w.length - 1]);
}

/**
 * Solution 1: Prefix Sum (optimal)
 * Time: O(n + q) — build prefix O(n), each query O(1)
 * Space: O(n) — prefix array
 */
function vowelStrings(words: string[], queries: number[][]): number[] {
  const n = words.length;
  // prefix[i] = number of vowel strings in words[0..i-1]
  const prefix = new Array(n + 1).fill(0);

  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + (isVowelString(words[i]) ? 1 : 0);
  }

  return queries.map(([l, r]) => prefix[r + 1] - prefix[l]);
}

/**
 * Solution 2: Brute force (for comparison — TLE on large input)
 * Time: O(n · q)
 * Space: O(1) extra
 */
function vowelStringsBrute(words: string[], queries: number[][]): number[] {
  return queries.map(([l, r]) => {
    let count = 0;
    for (let i = l; i <= r; i++) {
      if (isVowelString(words[i])) count++;
    }
    return count;
  });
}

// === Test Cases ===
console.log(
  vowelStrings(
    ["aba", "bcb", "ece", "aa", "e"],
    [
      [0, 2],
      [1, 4],
      [1, 3],
    ],
  ),
);
// → [2, 3, 2]
console.log(
  vowelStrings(
    ["a", "e", "i"],
    [
      [0, 2],
      [0, 1],
      [2, 2],
    ],
  ),
);
// → [3, 2, 1]
console.log(vowelStrings(["xyz", "abc"], [[0, 1]]));
// → [0]
```
