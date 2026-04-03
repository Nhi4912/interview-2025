---
layout: page
title: "Longest Substring with At Most K Distinct Characters"
difficulty: Medium
category: String
tags: [Hash Table, String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters"
---

# Longest Substring with At Most K Distinct Characters / Chuỗi Con Dài Nhất Với Tối Đa K Ký Tự Khác Nhau

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters) | [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống một khung cửa sổ trượt dọc theo chuỗi. Mở rộng cửa sổ sang phải khi còn đủ chỗ (≤ k loại ký tự); thu hẹp từ trái khi vượt quá, xóa ký tự nếu đếm về 0.

**Pattern Recognition:**

- Signal: "longest substring" + "constraint on distinct chars" → **Sliding Window + HashMap**
- Khi `map.size > k` → shrink từ trái cho đến khi thỏa mãn
- Key insight: Map lưu tần suất ký tự; xóa khỏi map khi count = 0

**Visual — s="eceba", k=2:**

```
 e c e b a      map={e:1}          len=1
 e c e b a      map={e:1,c:1}      len=2
 e c e b a      map={e:2,c:1}      len=3  ✅ max=3
 e c e b a      map={e:2,c:1,b:1}  size=3 > k=2
   → shrink: remove 'e'(0→del) map={c:1,b:1}  L=1
 e c e b a      map={e:1,c:1,b:1}  size=3 > k=2
   → shrink: remove 'c'(del)   map={e:1,b:1}  L=2
 [e b a]        map={e:1,b:1,a:1}  size>2 → shrink
```

---

## Problem Description

Given string `s` and integer `k`, return the length of the longest substring that contains at most `k` distinct characters.

```
Example 1: s="eceba", k=2  → 3  ("ece")
Example 2: s="aa", k=1     → 2  ("aa")
Example 3: s="aabbcc", k=1 → 2  ("aa" or "bb" or "cc")
```

Constraints: `1 <= s.length <= 5×10^4`, `0 <= k <= 50`.

---

## 📝 Interview Tips

1. **Clarify**: "k=0 trả về gì? Tất cả unique thì sao?" / What if k=0 or k >= unique count?
2. **Brute force**: "Thử mọi substring O(n²) rồi count distinct" → O(n³) tổng / Check all pairs then count
3. **Optimize**: "Sliding window — expand right, shrink left when map.size > k" / Classic expand-shrink pattern
4. **Edge cases**: "k=0 → 0, k >= all distinct → full length, empty string" / Zero k, k larger than alphabet
5. **Follow-up**: "Exactly k distinct? → atMostK(k) - atMostK(k-1)" / Exactly-k trick using difference
6. **Complexity**: "O(n) time — mỗi ký tự chỉ vào/ra window một lần" / Each char enters/exits once

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — all substrings
 * Time: O(n^2) — all starting points, linear inner scan
 * Space: O(k) — frequency set
 */
function longestKDistinctBrute(s: string, k: number): number {
  if (k === 0) return 0;
  let max = 0;
  for (let i = 0; i < s.length; i++) {
    const freq = new Map<string, number>();
    for (let j = i; j < s.length; j++) {
      freq.set(s[j], (freq.get(s[j]) ?? 0) + 1);
      if (freq.size > k) break;
      max = Math.max(max, j - i + 1);
    }
  }
  return max;
}

/**
 * Solution 2: Sliding Window with HashMap
 * Time: O(n) — each char enters and exits the window at most once
 * Space: O(k) — map holds at most k+1 entries
 */
function lengthOfLongestSubstringKDistinct(s: string, k: number): number {
  if (k === 0) return 0;
  const freq = new Map<string, number>();
  let left = 0;
  let max = 0;

  for (let right = 0; right < s.length; right++) {
    // Expand: add right character
    freq.set(s[right], (freq.get(s[right]) ?? 0) + 1);

    // Shrink: while constraint violated, move left
    while (freq.size > k) {
      const lc = s[left++];
      freq.set(lc, freq.get(lc)! - 1);
      if (freq.get(lc) === 0) freq.delete(lc);
    }

    max = Math.max(max, right - left + 1);
  }

  return max;
}

// === Test Cases ===
console.log(lengthOfLongestSubstringKDistinct("eceba", 2)); // 3
console.log(lengthOfLongestSubstringKDistinct("aa", 1)); // 2
console.log(lengthOfLongestSubstringKDistinct("aabbcc", 1)); // 2
console.log(lengthOfLongestSubstringKDistinct("abcdef", 0)); // 0
```

---

## 🔗 Related Problems

- [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters) — k=all unique, same sliding window
- [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement) — sliding window with different constraint
- [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string) — fixed-size sliding window
- [Subarrays with K Different Integers](https://leetcode.com/problems/subarrays-with-k-different-integers) — exactly-k via atMost trick
