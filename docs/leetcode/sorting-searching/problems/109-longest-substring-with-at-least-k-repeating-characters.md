---
layout: page
title: "Longest Substring with At Least K Repeating Characters"
difficulty: Medium
category: Sorting-Searching
tags: [Hash Table, String, Divide and Conquer, Sliding Window]
leetcode_url: "https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters"
---

# Longest Substring with At Least K Repeating Characters / Chuỗi Con Dài Nhất Với Mỗi Ký Tự Xuất Hiện Ít Nhất K Lần

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Divide & Conquer / Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống chia đất để trị — nếu có một ký tự xuất hiện **dưới k lần** trong chuỗi hiện tại, nó **không thể** nằm trong substring hợp lệ. Dùng nó làm "vách ngăn" chia đôi bài toán! Mỗi vách chia chuỗi thành các đoạn nhỏ hơn, giải đệ quy.

**Pattern Recognition:**

- Characters with count < k CANNOT be in any valid substring → use them as split points
- Divide & Conquer: split at invalid chars, recurse on each segment
- Alternative: Sliding Window with fixed number of unique chars (enumerate 1..26 unique chars)

**Visual:**

```
s = "aaabbb", k = 3
freq: a→3, b→3  → all valid → return length 6 ✅

s = "aaabbbcc", k = 3
freq: a→3, b→3, c→2  → 'c' is invalid split point
  Split at 'c': ["aaabbb", ""] (positions of c)
  recurse("aaabbb", 3) = 6 ✅
  Answer: 6
```

## Problem Description

Given string `s` and integer `k`, return the length of the **longest substring** where every character appears at least `k` times. `1 ≤ s.length ≤ 10^4`, `1 ≤ k ≤ 10^5`, `s` contains only lowercase letters.

**Example 1:** `s = "aaabb"`, `k = 3` → `3` (substring "aaa")
**Example 2:** `s = "ababbc"`, `k = 2` → `5` (substring "ababb")

## 📝 Interview Tips

1. **Clarify**: k > s.length → return 0; k=1 → entire string / Handle k > length edge case
2. **Approach**: Divide & Conquer on invalid split chars; alternative: sliding window with fixed unique count / Two approaches, D&C is cleaner
3. **Edge cases**: All same char → return n if n≥k else 0; k=1 → n; k>n → 0 / Homogeneous string
4. **Optimize**: D&C is O(n·26) = O(n); Sliding window O(26n) same complexity / Both are O(n) effectively
5. **Test**: `"aaabb"`, k=3 → 3; `"ababbc"`, k=2 → 5; `"a"`, k=1 → 1 / Test boundaries
6. **Follow-up**: If k changes per query? → preprocess / Multiple queries with different k values?

## Solutions

```typescript
/** Solution 1: Divide & Conquer — split at chars with count < k
 * Time: O(n · 26) = O(n) | Space: O(n) recursion stack
 */
function longestSubstring1(s: string, k: number): number {
  if (s.length === 0) return 0;
  if (s.length < k) return 0;

  // Count frequencies
  const freq = new Map<string, number>();
  for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);

  // If all chars have freq >= k, entire string is valid
  let allValid = true;
  for (const [, cnt] of freq) {
    if (cnt < k) {
      allValid = false;
      break;
    }
  }
  if (allValid) return s.length;

  // Split at invalid characters (freq < k)
  let best = 0;
  let start = 0;
  for (let i = 0; i <= s.length; i++) {
    if (i === s.length || freq.get(s[i])! < k) {
      if (i > start) {
        best = Math.max(best, longestSubstring1(s.slice(start, i), k));
      }
      start = i + 1;
    }
  }
  return best;
}

/** Solution 2: Sliding Window — enumerate number of unique chars (1 to 26)
 * For each target unique count, find longest window with exactly that many unique chars
 * where all have freq >= k
 * Time: O(26 · n) = O(n) | Space: O(1)
 */
function longestSubstring2(s: string, k: number): number {
  let best = 0;
  const n = s.length;

  for (let targetUnique = 1; targetUnique <= 26; targetUnique++) {
    const freq = new Array(26).fill(0);
    let uniqueCount = 0;
    let atLeastK = 0; // chars with freq >= k
    let lo = 0;

    for (let hi = 0; hi < n; hi++) {
      const ri = s.charCodeAt(hi) - 97;
      if (freq[ri] === 0) uniqueCount++;
      freq[ri]++;
      if (freq[ri] === k) atLeastK++;

      // Shrink window if too many unique chars
      while (uniqueCount > targetUnique) {
        const li = s.charCodeAt(lo) - 97;
        if (freq[li] === k) atLeastK--;
        freq[li]--;
        if (freq[li] === 0) uniqueCount--;
        lo++;
      }

      if (uniqueCount === targetUnique && uniqueCount === atLeastK) {
        best = Math.max(best, hi - lo + 1);
      }
    }
  }

  return best;
}

// Test cases
console.log(longestSubstring1("aaabb", 3)); // 3
console.log(longestSubstring1("ababbc", 2)); // 5
console.log(longestSubstring2("aaabb", 3)); // 3
console.log(longestSubstring2("ababbc", 2)); // 5
console.log(longestSubstring1("a", 1)); // 1
console.log(longestSubstring2("aaaaaa", 3)); // 6
```

## 🔗 Related Problems

| Problem                                                                                                          | Relationship                                       |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement) | Sliding window on character counts with constraint |
| [Subarrays with K Different Integers](https://leetcode.com/problems/subarrays-with-k-different-integers)         | Enumerate unique counts in sliding window          |
| [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string)                     | Fixed-size sliding window with frequency tracking  |
