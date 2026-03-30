---
layout: page
title: "Valid Anagram"
difficulty: Easy
category: String
tags: [String, Hash Table, Sorting]
leetcode_url: "https://leetcode.com/problems/valid-anagram/"
---

# Valid Anagram / Kiểm Tra Hoán Vị Chữ Cái

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map / Frequency Count
> **Frequency**: 📘 Tier 1 — Near-guaranteed warm-up; foundation for Group Anagrams (hard variant)
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [First Unique Character](./03-first-unique-character-in-a-string.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng hai túi đựng chữ cái: đổ hết túi đầu tiên ra đếm từng loại, rồi dùng chữ từ túi thứ hai để "trả lại" — nếu trả đúng hết không thừa không thiếu thì đó là anagram. Không cần biết thứ tự — chỉ cần đếm số lượng khớp nhau.
- **Pattern Recognition:**
  - Hai chuỗi cùng độ dài + cùng ký tự → frequency count, không phải sorting
  - Nếu `s.length !== t.length` → `false` ngay lập tức (early exit)
  - Có thể dùng một mảng duy nhất: `+1` cho `s`, `-1` cho `t`, kiểm tra toàn bộ `=== 0`
- **Visual — `s="anagram"`, `t="nagaram"`:**

```
Build freq from s (+1), drain with t (-1):

char:  a  n  a  g  r  a  m
freq: [3, 1, 0, 1, 1, 0, 1]  (a=3, n=1, g=1, r=1, m=1)
       ↑ indices for a,n,g,r,m

Drain with t = "nagaram":
  n→-1  a→-1  g→-1  a→-1  r→-1  a→-1  m→-1
freq: [0, 0, 0, 0, 0, 0, 0]  → all zero → true ✓

Counter-example: s="rat", t="car"
  freq after s:  r=1, a=1, t=1
  drain with t:  c not found (freq[c]=0) → return false ✓
```

## Problem Description

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s` (same characters, same counts, any order).

```
Input: s = "anagram", t = "nagaram" → Output: true
Input: s = "rat",     t = "car"     → Output: false
Input: s = "silent",  t = "listen"  → Output: true
```

## 📝 Interview Tips

1. **Length check first** / Nếu `s.length !== t.length` → trả về `false` ngay — tránh loop không cần thiết.
2. **Array[26] > Map for lowercase** / `charCode - 97` nhanh hơn `Map.get()` với lowercase ASCII.
3. **One array, two passes** / Tăng cho `s`, giảm cho `t`, kiểm tra tất cả bằng 0 — chỉ cần 1 mảng.
4. **Sort approach is O(n log n)** / Sắp xếp rồi so sánh dễ viết nhưng không tối ưu; interviewer muốn O(n).
5. **Unicode extension** / Nếu input có Unicode (emoji, tiếng Nhật...) → dùng `Map<string, number>` thay array[26].

## Solutions

{% raw %}
/\*\*

- Solution 1 — Brute: Sort and Compare
- Time: O(n log n) Space: O(n)
- Sort both strings and compare. Simple but suboptimal.
  \*/
  function isAnagramSort(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  return s.split("").sort().join("") === t.split("").sort().join("");
  }

/\*\*

- Solution 2 — Optimal: Frequency Array
- Time: O(n) Space: O(1) — fixed 26-element array
- Increment for s, decrement for t. Any non-zero means mismatch.
  \*/
  function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

const freq = new Array(26).fill(0);
const a = "a".charCodeAt(0);

for (let i = 0; i < s.length; i++) {
freq[s[i].charCodeAt(0) - a]++;
freq[t[i].charCodeAt(0) - a]--;
}

return freq.every((count) => count === 0);
}

// Inline tests
console.assert(isAnagram("anagram", "nagaram") === true, "anagram: expected true");
console.assert(isAnagram("rat", "car") === false, "rat/car: expected false");
console.assert(isAnagram("silent", "listen") === true, "silent/listen: expected true");
console.assert(isAnagram("ab", "a") === false, "different lengths: expected false");
{% endraw %}

## 🔗 Related Problems

- [49. Group Anagrams](https://leetcode.com/problems/group-anagrams/) — harder: group all anagram strings together
- [438. Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) — sliding window + anagram check
- [387. First Unique Character](./03-first-unique-character-in-a-string.md) — same frequency-count foundation
- [567. Permutation in String](https://leetcode.com/problems/permutation-in-string/) — anagram check inside sliding window
