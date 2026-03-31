---
layout: page
title: "Maximum Number of Occurrences of a Substring"
difficulty: Medium
category: String
tags: [Hash Table, String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/maximum-number-of-occurrences-of-a-substring"
---

# Maximum Number of Occurrences of a Substring / Số Lần Xuất Hiện Nhiều Nhất Của Chuỗi Con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window + Key Insight
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement) | [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như đếm biển quảng cáo ngắn nhất trên đường — quảng cáo ngắn hơn luôn xuất hiện ít nhất bằng quảng cáo dài hơn (vì mỗi substring dài đều chứa một substring ngắn hơn). Nên chỉ cần xét `minSize`.

**Pattern Recognition:**

- Signal: "max occurrences of substring with char/length constraints" → **Key insight: only check minSize**
- Key insight: nếu substring dài `k` xuất hiện `f` lần, thì substring dài `k-1` (prefix của nó) xuất hiện ≥ `f` lần → chỉ cần check `minSize`

**Visual — Why minSize is enough:**

```
s = "aababab", maxLetters=2, minSize=3, maxSize=4

Any len-4 match "abab" → its prefix "aba" (len-3) appears at least as often
→ Just count all substrings of length minSize=3 with ≤ maxLetters distinct chars

Sliding window of size 3:
"aab" → 2 distinct (a,b) ≤ 2 → count["aab"]=1
"aba" → 2 distinct          → count["aba"]=2
"bab" → 2 distinct          → count["bab"]=1
"aba" → count["aba"]=2  ✅

max = 2
```

---

## Problem Description

Given a string `s` and integers `maxLetters`, `minSize`, `maxSize`, return the **maximum number of occurrences** of any substring that has at most `maxLetters` distinct characters and length between `minSize` and `maxSize`. ([LeetCode 1297](https://leetcode.com/problems/maximum-number-of-occurrences-of-a-substring))

**Example 1:** `s="aababab", maxLetters=2, minSize=3, maxSize=4` → `2`
**Example 2:** `s="aaaa", maxLetters=1, minSize=3, maxSize=3` → `2`

Constraints: `1 <= s.length <= 10^5`, letters are lowercase English

---

## 📝 Interview Tips

1. **Key insight first**: "Chỉ cần xét minSize — vì substring ngắn hơn luôn xuất hiện không ít hơn" / Only check minSize substrings
2. **Clarify**: "Xác nhận minSize ≤ maxSize và cả hai ≤ s.length" / Validate constraint relationship before coding
3. **Brute force**: "Thử mọi substring từ minSize đến maxSize → O(n²)" / Too slow for n=10^5
4. **Optimize**: "Fixed sliding window kích thước minSize → O(n)" / Fixed-size window is O(n)
5. **Edge cases**: "Không có substring hợp lệ → return 0; s toàn ký tự giống nhau" / No valid → 0
6. **Complexity**: "O(n · minSize) time — mỗi bước tạo substring O(minSize) để làm key" / Can optimize with rolling hash

---

## Solutions

```typescript
/**
 * Solution 1: Fixed sliding window of size minSize (key insight)
 * Time: O(n · minSize) — create substring key each step
 * Space: O(n · minSize) — store all unique substrings
 */
function maxFreq(s: string, maxLetters: number, minSize: number, _maxSize: number): number {
  const count = new Map<string, number>();
  let maxOcc = 0;

  // Fixed window of size minSize
  for (let i = 0; i <= s.length - minSize; i++) {
    const sub = s.slice(i, i + minSize);
    const distinct = new Set(sub).size;

    if (distinct <= maxLetters) {
      const freq = (count.get(sub) ?? 0) + 1;
      count.set(sub, freq);
      maxOcc = Math.max(maxOcc, freq);
    }
  }

  return maxOcc;
}

/**
 * Solution 2: Sliding window with explicit distinct tracking (O(n · minSize) but cleaner)
 * Time: O(n · minSize)
 * Space: O(n · minSize)
 */
function maxFreqOptimized(s: string, maxLetters: number, minSize: number, maxSize: number): number {
  const occurrences = new Map<string, number>();
  const charFreq = new Map<string, number>();
  let result = 0;

  // Sliding window: add right, remove left
  for (let right = 0; right < s.length; right++) {
    const rc = s[right];
    charFreq.set(rc, (charFreq.get(rc) ?? 0) + 1);

    const left = right - minSize + 1;
    if (right >= minSize - 1) {
      if (charFreq.size <= maxLetters) {
        const sub = s.slice(left, right + 1);
        const freq = (occurrences.get(sub) ?? 0) + 1;
        occurrences.set(sub, freq);
        result = Math.max(result, freq);
      }
      // Remove left char
      const lc = s[left];
      const cnt = charFreq.get(lc)! - 1;
      if (cnt === 0) charFreq.delete(lc);
      else charFreq.set(lc, cnt);
    }
  }

  return result;
}

// === Test Cases ===
console.log(maxFreq("aababab", 2, 3, 4)); // → 2
console.log(maxFreq("aaaa", 1, 3, 3)); // → 2
console.log(maxFreq("abcde", 2, 2, 3)); // → 1
```
