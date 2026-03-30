---
layout: page
title: "Implement strStr()"
difficulty: Easy
category: String
tags: [String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/"
---

# Implement strStr() / Tìm Chuỗi Con Đầu Tiên

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Sliding Window → KMP
> **Frequency**: 📘 Tier 3 — Brute force suffices in interviews; KMP asked at senior/FAANG level
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Valid Anagram](./04-valid-anagram.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Hãy tưởng tượng bạn đang tìm một đoạn nhạc quen (`needle`) trong một bản thu dài (`haystack`): cách đơn giản là nghe từng đoạn có độ dài bằng `needle` — nếu khớp thì dừng. KMP thông minh hơn: khi không khớp, nó "nhớ" đã khớp được bao nhiêu để không bắt đầu lại từ đầu.
- **Pattern Recognition:**
  - Tìm chuỗi con đầu tiên → sliding window kích thước cố định
  - Naive: O(n×m) — chấp nhận được khi m nhỏ
  - KMP: O(n+m) — khi m lớn hoặc pattern có prefix lặp lại (aaab trong aaaaaab)
- **Visual — haystack="hello", needle="ll":**

```
Naive sliding window:
  i=0: hay[0..1]="he" ≠ "ll" → shift
  i=1: hay[1..2]="el" ≠ "ll" → shift
  i=2: hay[2..3]="ll" = "ll" → return 2 ✓

KMP failure function for needle="ll":
  pattern: l  l
  lps:     0  1   (prefix "l" = suffix "l" at index 1)

KMP match on "hello":
  h≠l → i++
  e≠l → i++
  l=l → i++, j++
  l=l → j===m → return i-j = 4-2 = 2 ✓
```

## Problem Description

Return the index of the **first occurrence** of `needle` in `haystack`, or `-1` if not found. Return `0` if `needle` is empty.

```
Input: haystack = "hello",   needle = "ll"  → Output: 2
Input: haystack = "aaaaa",   needle = "bba" → Output: -1
Input: haystack = "sadbutsad", needle = "sad" → Output: 0
Input: haystack = "a",       needle = ""    → Output: 0
```

## 📝 Interview Tips

1. **Clarify empty needle** / Hỏi: `needle = ""` trả về gì? Thông thường là `0` (C/Java convention).
2. **Brute force is acceptable** / Nếu `n * m ≤ 10⁷`, O(n×m) là đủ — đừng KMP ngay mà không giải thích.
3. **`indexOf` is not an answer** / Sử dụng built-in sẽ bị hỏi "bạn có thể tự implement không?"
4. **KMP failure function** / LPS (Longest Prefix Suffix) là trái tim của KMP — cần giải thích được.
5. **Rabin-Karp for large alphabets** / Nếu interview hỏi variant với Unicode/large alphabet, Rabin-Karp hashing là lựa chọn tốt.

## Solutions

{% raw %}
/\*\*

- Solution 1 — Brute: Naive Sliding Window
- Time: O(n × m) Space: O(1)
- For each position, check if needle starts there. Fast enough for most inputs.
  \*/
  function strStrBrute(haystack: string, needle: string): number {
  if (needle === "") return 0;

const n = haystack.length;
const m = needle.length;

for (let i = 0; i <= n - m; i++) {
let j = 0;
while (j < m && haystack[i + j] === needle[j]) j++;
if (j === m) return i;
}

return -1;
}

/\*\*

- Solution 2 — Optimal: KMP (Knuth-Morris-Pratt)
- Time: O(n + m) Space: O(m) — for the LPS (failure function) array
-
- Key insight: when mismatch at j, don't reset j to 0.
- Use lps[j-1] to skip already-matched prefix.
  \*/
  function strStr(haystack: string, needle: string): number {
  if (needle === "") return 0;

const n = haystack.length;
const m = needle.length;

// Build LPS (Longest Prefix Suffix) failure function
const lps = new Array(m).fill(0);
let len = 0;
let k = 1;

while (k < m) {
if (needle[k] === needle[len]) {
lps[k++] = ++len;
} else if (len !== 0) {
len = lps[len - 1]; // don't increment k
} else {
lps[k++] = 0;
}
}

// KMP search
let i = 0; // haystack pointer
let j = 0; // needle pointer

while (i < n) {
if (haystack[i] === needle[j]) {
i++;
j++;
}
if (j === m) {
return i - j; // match found
} else if (i < n && haystack[i] !== needle[j]) {
j = j !== 0 ? lps[j - 1] : (i++, 0);
}
}

return -1;
}

// Inline tests
console.assert(strStr("hello", "ll") === 2, "basic: expected 2");
console.assert(strStr("aaaaa", "bba") === -1, "no match: expected -1");
console.assert(strStr("sadbutsad", "sad") === 0, "first occurrence: expected 0");
console.assert(strStr("a", "") === 0, "empty needle: expected 0");
{% endraw %}

## 🔗 Related Problems

- [459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/) — KMP LPS table reused directly
- [686. Repeated String Match](https://leetcode.com/problems/repeated-string-match/) — strStr variant with repeated string
- [1392. Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix/) — pure KMP LPS construction
- [214. Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/) — KMP on concatenated string trick
