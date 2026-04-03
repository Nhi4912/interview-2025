---
layout: page
title: "Find the Index of the First Occurrence in a String"
difficulty: Easy
category: String
tags: [Two Pointers, String, String Matching]
leetcode_url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string"
---

# Find the Index of the First Occurrence in a String / Tìm Vị Trí Xuất Hiện Đầu Tiên Trong Chuỗi

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Matching / KMP
> **Frequency**: 📘 Tier 3 — Gặp ở 19 companies
> **See also**: [Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern) | [Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tìm từ trong văn bản như tìm chìa khóa vừa ổ khóa — sliding window dịch từng vị trí, KMP tận dụng cấu trúc pattern đã biết để không bao giờ quay lui trong haystack.

**Pattern Recognition:**

- Signal: "tìm needle trong haystack", "first occurrence" → **Sliding Window** hoặc **KMP**
- Sliding window: so sánh từng substring O(n·m) — dễ hiểu, OK cho phỏng vấn
- KMP: xây dựng failure function (LPS) → tránh quay lui → O(n+m)

**Visual — KMP với haystack="aabxaab", needle="aab":**

```
LPS table cho "aab": [0, 1, 0]
  'a'→lps[0]=0, 'a'→lps[1]=1 (prefix "a" = suffix "a"), 'b'→lps[2]=0

Search trace:
  i=0,j=0: 'a'=='a' → j=1
  i=1,j=1: 'a'=='a' → j=2
  i=2,j=2: 'b'=='b' → j=3 == m → FOUND at index 0 ✅

When mismatch at j>0: j=lps[j-1] (don't move i back!)
```

---

## Problem Description

Given strings `haystack` and `needle`, return the index of the first occurrence of `needle` in `haystack`, or `-1` if not found. An empty `needle` returns 0.

```
Example 1: haystack="sadbutsad", needle="sad"    → 0
Example 2: haystack="leetcode",  needle="leeto"  → -1
Example 3: haystack="hello",     needle="ll"     → 2
```

Constraints: `1 <= haystack.length, needle.length <= 10^4`, lowercase English letters only.

---

## 📝 Interview Tips

1. **Clarify**: "needle rỗng trả về 0?" / Confirm empty needle convention (LeetCode → 0).
2. **Built-in**: `indexOf` OK nếu interviewer cho phép; thường cần tự implement.
3. **Sliding window**: O(n·m) — dễ implement, đủ tốt cho Easy; đề cập KMP như improvement.
4. **KMP**: O(n+m) — mô tả LPS trước khi code; thể hiện bạn biết classic algorithm.
5. **Edge cases**: needle dài hơn haystack → return -1, needle == haystack → return 0.
6. **Follow-up**: "Rabin-Karp dùng rolling hash O(n+m) average — tốt cho large alphabet."

---

## Solutions

```typescript
/**
 * Solution 1: Built-in indexOf
 * Time: O(n·m) — V8 engine uses Boyer-Moore-Horspool internally
 * Space: O(1)
 */
function strStr1(haystack: string, needle: string): number {
  return haystack.indexOf(needle);
}

/**
 * Solution 2: Sliding Window — explicit character-by-character comparison
 * Time: O(n·m) — up to (n-m+1) start positions, each up to m comparisons
 * Space: O(1) — no extra allocation
 */
function strStr2(haystack: string, needle: string): number {
  const n = haystack.length,
    m = needle.length;
  if (m === 0) return 0;
  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m && haystack[i + j] === needle[j]) j++;
    if (j === m) return i;
  }
  return -1;
}

/**
 * Solution 3: KMP — Knuth-Morris-Pratt
 * Time: O(n + m) — O(m) build LPS + O(n) single-pass search (no backtracking)
 * Space: O(m) — LPS failure function array
 *
 * lps[i] = length of longest proper prefix of needle[0..i] that is also a suffix.
 * On mismatch at j>0: jump j=lps[j-1] instead of resetting j=0.
 */
function buildLPS(pat: string): number[] {
  const lps = new Array(pat.length).fill(0);
  let len = 0,
    i = 1;
  while (i < pat.length) {
    if (pat[i] === pat[len]) {
      lps[i++] = ++len;
    } else if (len > 0) {
      len = lps[len - 1]; // fall back — do NOT increment i
    } else {
      lps[i++] = 0;
    }
  }
  return lps;
}

function strStr(haystack: string, needle: string): number {
  const n = haystack.length,
    m = needle.length;
  if (m === 0) return 0;
  if (m > n) return -1;

  const lps = buildLPS(needle);
  let j = 0; // index into needle
  for (let i = 0; i < n; i++) {
    while (j > 0 && haystack[i] !== needle[j]) j = lps[j - 1]; // KMP fallback
    if (haystack[i] === needle[j]) j++;
    if (j === m) return i - m + 1; // full match at this position
  }
  return -1;
}

// === Test Cases ===
console.log(strStr("sadbutsad", "sad")); // 0
console.log(strStr("leetcode", "leeto")); // -1
console.log(strStr("hello", "ll")); // 2
console.log(strStr("aabxaab", "aab")); // 0
console.log(strStr("a", "a")); // 0
console.log(strStr("mississippi", "issip")); // 4
console.log(strStr2("hello", "ll")); // 2
console.log(strStr1("sadbutsad", "sad")); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                                     | Relationship                        |
| --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| [28. Find the Index of First Occurrence](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) | This problem                        |
| [459. Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/)                                | KMP failure function same idea      |
| [686. Repeated String Match](https://leetcode.com/problems/repeated-string-match/)                                          | strStr variant on repeated string   |
| [1392. Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix/)                                           | Directly computes KMP LPS           |
| [214. Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/)                                              | KMP on concatenated reversed string |
