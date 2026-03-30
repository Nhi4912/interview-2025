---
layout: page
title: "Find All Anagrams in a String"
difficulty: Medium
category: String
tags: [String, Hash Table, Sliding Window]
leetcode_url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/"
---

# Find All Anagrams in a String / Tìm Tất Cả Anagram Trong Chuỗi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Fixed-size Sliding Window
> **Frequency**: ⭐ Tier 2 — Rất phổ biến trong phone screens, pair hoàn hảo với LC 567
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [567. Permutation in String](https://leetcode.com/problems/permutation-in-string/)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng bạn có một khuôn con dấu (pattern `p`) gồm nhiều chữ cái, và bạn trượt nó dọc theo tờ giấy dài (chuỗi `s`). Mỗi khi khuôn dừng lại, bạn kiểm tra xem vùng chữ bên dưới có dùng đúng tập chữ cái trong khuôn không — dù thứ tự khác nhau. Thay vì đếm lại từ đầu mỗi bước, bạn chỉ cần cộng một chữ mới bên phải và trừ một chữ cũ bên trái.

- **Pattern Recognition:**
  - "All positions where window of size |p| is an anagram" → **Fixed-size Sliding Window** + freq comparison
  - Anagram = same characters with same frequencies → compare `int[26]` arrays in O(26) = O(1)
  - Maintain `matched` counter: number of char indices where `sCount[i] === pCount[i]`

- **Visual — s="abab", p="ab":**

```
pCount: a=1, b=1   windowSize = 2

i=0: window="a"   sCount={a:1}          (not full yet)
i=1: window="ab"  sCount={a:1,b:1} == pCount ✓ → result=[0]
     slide: remove s[0]='a', add s[2]='a'
i=2: window="ba"  sCount={b:1,a:1} == pCount ✓ → result=[0,1]
     slide: remove s[1]='b', add s[3]='b'
i=3: window="ab"  sCount={a:1,b:1} == pCount ✓ → result=[0,1,2]

result = [0, 1, 2] ✓
```

## Problem Description

Given strings `s` and `p`, return start indices of all windows in `s` that are anagrams of `p`. An anagram uses the same characters with the same frequencies (order irrelevant).

```
Input: s="abab",       p="ab"  → Output: [0,1,2]
Input: s="cbaebabacd", p="abc" → Output: [0,6]
Input: s="baa",        p="aa"  → Output: [1]
```

## 📝 Interview Tips

1. **Fixed window size** / **Cửa sổ cố định**: kích thước luôn là `p.length` — không cần shrink, chỉ slide.
2. **Array beats HashMap** / **Array nhanh hơn HashMap**: dùng `int[26]` cho alphabet cố định; so sánh hai mảng O(26) = O(1).
3. **Match counter trick** / **Đếm match**: duy trì `matched` = số index `i` mà `sCount[i] === pCount[i]`; khi `matched === 26` là anagram — tránh loop O(26) mỗi bước.
4. **Add before remove** / **Thêm trước xóa**: khi slide, thêm `s[right]` trước, xóa `s[right - windowSize]` sau.
5. **Edge: |p| > |s|** / **|p| lớn hơn |s|**: trả về `[]` ngay lập tức.
6. **Pair with LC 567** / **Kết hợp LC 567**: "Permutation in String" là bài twin — hỏi "có tồn tại ít nhất một?" thay vì "tìm tất cả".

## Solutions

{% raw %}
/\*\*

- 438.  Find All Anagrams in a String
- Brute: sort each window and compare. Simple but slow.
- Time O(n·|p|·log|p|), Space O(|p|)
  \*/
  function findAnagramsBrute(s: string, p: string): number[] {
  if (s.length < p.length) return [];
  const result: number[] = [];
  const sortedP = p.split("").sort().join("");
  for (let i = 0; i <= s.length - p.length; i++) {
  if (s.slice(i, i + p.length).split("").sort().join("") === sortedP) {
  result.push(i);
  }
  }
  return result;
  }

/\*\*

- Fixed-size Sliding Window with match counter — optimal.
- Tracks how many of the 26 char frequencies are currently satisfied.
- When matched === 26, the window is an anagram.
- Time O(|s| + |p|), Space O(1)
  \*/
  function findAnagrams(s: string, p: string): number[] {
  if (s.length < p.length) return [];

      const result: number[] = [];
      const pCount = new Array(26).fill(0);
      const sCount = new Array(26).fill(0);
      const a = "a".charCodeAt(0);

      for (const c of p) pCount[c.charCodeAt(0) - a]++;

      let matched = 0;
      // Count initial "matches" on empty window (all pCount[i]===0 positions)
      for (let i = 0; i < 26; i++) if (pCount[i] === 0) matched++;

      for (let i = 0; i < s.length; i++) {
          // Add s[i] to window
          const ri = s.charCodeAt(i) - a;
          if (sCount[ri] === pCount[ri]) matched--;       // about to break a match
          sCount[ri]++;
          if (sCount[ri] === pCount[ri]) matched++;       // restored or new match

          // Remove s[i - windowSize] from window once window is full
          if (i >= p.length) {
              const li = s.charCodeAt(i - p.length) - a;
              if (sCount[li] === pCount[li]) matched--;
              sCount[li]--;
              if (sCount[li] === pCount[li]) matched++;
          }

          // Record start index when all 26 frequencies match
          if (matched === 26) result.push(i - p.length + 1);
      }

      return result;

  }

// Inline checks
console.log(JSON.stringify(findAnagrams("abab", "ab"))); // [0,1,2]
console.log(JSON.stringify(findAnagrams("cbaebabacd", "abc"))); // [0,6]
console.log(JSON.stringify(findAnagrams("baa", "aa"))); // [1]
console.log(JSON.stringify(findAnagramsBrute("a", "ab"))); // []
{% endraw %}

## 🔗 Related Problems

- [567. Permutation in String](https://leetcode.com/problems/permutation-in-string/) — identical logic, returns boolean instead of all indices
- [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) — variable-size window; find smallest window containing all chars
- [242. Valid Anagram](https://leetcode.com/problems/valid-anagram/) — single-window anagram check (no sliding)
- [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) — variable window, different constraint
- [49. Group Anagrams](https://leetcode.com/problems/group-anagrams/) — anagram detection across a list using frequency as key
