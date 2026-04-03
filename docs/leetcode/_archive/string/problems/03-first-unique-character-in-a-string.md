---
layout: page
title: "First Unique Character in a String"
difficulty: Easy
category: String
tags: [String, Hash Table]
leetcode_url: "https://leetcode.com/problems/first-unique-character-in-a-string/"
---

# First Unique Character in a String / Ký Tự Duy Nhất Đầu Tiên

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map / Frequency Count
> **Frequency**: 📘 Tier 2 — Classic two-pass hash map; tests understanding of frequency tables
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Valid Anagram](./04-valid-anagram.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng một hàng người đăng ký, mỗi người viết tên lên bảng đếm. Sau khi tất cả đã đăng ký, bạn đi từ đầu hàng và tìm người đầu tiên có đúng 1 lần xuất hiện trên bảng. Bảng đếm = pass 1, duyệt lại từ đầu = pass 2.
- **Pattern Recognition:**
  - Cần tìm "lần đầu tiên" theo thứ tự → duyệt lần 2 theo index gốc, không phải theo map
  - Câu hỏi về tần suất ký tự → Hash Map (hoặc array[26] cho lowercase ASCII)
  - O(1) space là có thể vì bảng chữ cái giới hạn (26 chữ cái)
- **Visual — `s = "l e e t c o d e"`:**

```
Pass 1 — Build frequency map:
  l→1  e→3  t→1  c→1  o→1  d→1

Pass 2 — Scan original order:
  index 0: 'l' → freq=1 → UNIQUE ✓ → return 0

(If s = "loveleetcode"):
  l→1 o→2 v→1 e→4 t→1 c→1 d→1
  index 0: 'l'→1 ✓ ? No wait: 'l'=1 but let's trace...
  index 0: 'l'→1 ✓ → return 0? No, "loveleetcode" → l=1,o=2,v=1,e=4,t=1,c=1,d=1
  index 0: 'l'→1 → return 0 ✗ (expected 2)
  Actually: l=1, but answer is 2 ('v') — wait, let me recount
  l-o-v-e-l-e-e-t-c-o-d-e → l:2, o:2, v:1, e:4, t:1, c:1, d:1
  index 0:'l'→2 skip | index 1:'o'→2 skip | index 2:'v'→1 → return 2 ✓
```

## Problem Description

Given string `s`, return the index of the **first non-repeating character**. Return `-1` if none exists.

```
Input: s = "leetcode"     → Output: 0   ('l' appears once)
Input: s = "loveleetcode" → Output: 2   ('v' appears once)
Input: s = "aabb"         → Output: -1  (all repeated)
```

## 📝 Interview Tips

1. **Two-pass is intentional** / Pass 1: đếm, Pass 2: tìm — không nên gộp thành một pass.
2. **Array[26] faster than Map** / Với lowercase-only input, `array[charCode - 97]` nhanh hơn Map.
3. **indexOf/lastIndexOf is O(n²)** / Giải pháp đơn giản nhất (`indexOf === lastIndexOf`) sẽ TLE với input lớn.
4. **Return index, not character** / Lỗi phổ biến: trả về ký tự thay vì chỉ số.
5. **Frequency = 1 means unique** / Chỉ cần kiểm tra `=== 1`, không cần `<= 1`.

## Solutions

```typescript
/**

- Solution 1 — Brute: indexOf + lastIndexOf
- Time: O(n²) Space: O(1)
- Simple but slow — scans entire string for each character.
  */
  function firstUniqCharBrute(s: string): number {
  for (let i = 0; i < s.length; i++) {
  if (s.indexOf(s[i]) === s.lastIndexOf(s[i])) return i;
  }
  return -1;
  }

/**

- Solution 2 — Optimal: Frequency Array (two-pass)
- Time: O(n) Space: O(1) — fixed 26-element array
- Pass 1: count all chars. Pass 2: find first with count = 1.
  */
  function firstUniqChar(s: string): number {
  const freq = new Array(26).fill(0);
  const a = "a".charCodeAt(0);

// Pass 1: build frequency table
for (const ch of s) {
freq[ch.charCodeAt(0) - a]++;
}

// Pass 2: first char with frequency 1
for (let i = 0; i < s.length; i++) {
if (freq[s[i].charCodeAt(0) - a] === 1) return i;
}

return -1;
}

// Inline tests
console.assert(firstUniqChar("leetcode") === 0, "leetcode: expected 0");
console.assert(firstUniqChar("loveleetcode") === 2, "loveleetcode: expected 2");
console.assert(firstUniqChar("aabb") === -1, "all repeated: expected -1");
console.assert(firstUniqChar("z") === 0, "single char: expected 0");
```

## 🔗 Related Problems

- [242. Valid Anagram](./04-valid-anagram.md) — same frequency-count pattern, different goal
- [451. Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/) — frequency map + sort
- [904. Fruit Into Baskets](https://leetcode.com/problems/fruit-into-baskets/) — sliding window + frequency map
- [169. Majority Element](https://leetcode.com/problems/majority-element/) — frequency-based element finding
