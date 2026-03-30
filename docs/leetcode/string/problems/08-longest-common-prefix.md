---
layout: page
title: "Longest Common Prefix"
difficulty: Easy
category: String
tags: [String, Trie]
leetcode_url: "https://leetcode.com/problems/longest-common-prefix/"
---

# Longest Common Prefix / Tiền Tố Chung Dài Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Horizontal / Vertical Scanning
> **Frequency**: 📘 Tier 3 — Warm-up classic, common in junior phone screens
> **See also**: [Table of Contents](../../../00-table-of-contents.md) | [Minimum Window Substring](15-minimum-window-substring.md)

## 🧠 Intuition / Tư Duy

- **Analogy:** Giống như khi bạn sắp xếp danh bạ điện thoại — bạn dùng cái tên đầu tiên làm "bản nháp", rồi lần lượt so sánh với mỗi tên tiếp theo. Ngay khi thấy một chữ không khớp, bạn cắt bớt bản nháp. Khi xem hết danh sách, phần còn lại chính là tiền tố chung dài nhất.

- **Pattern Recognition:**
  - Nhiều chuỗi, cần tìm phần đầu giống nhau → **Horizontal Scanning** (dùng chuỗi đầu làm pivot)
  - Muốn dừng sớm tại cột đầu tiên không khớp → **Vertical Scanning** (so sánh theo cột)
  - Prefix luôn ≤ độ dài chuỗi ngắn nhất → giới hạn vòng lặp theo `strs[0].length`

- **Visual — Horizontal Scanning with `["flower","flow","flight"]`:**

  ```
  prefix = "flower"

  vs "flow":
    indexOf("flower") = -1 → trim → "flowe"
    indexOf("flowe")  = -1 → trim → "flow"
    indexOf("flow")   = 0  ✓

  vs "flight":
    indexOf("flow")   = -1 → trim → "flo"
    indexOf("flo")    = -1 → trim → "fl"
    indexOf("fl")     = 0  ✓

  Result: "fl"
  ```

## Problem Description

Write a function to find the longest common prefix string amongst an array of strings. Return `""` if there is no common prefix.

```
Input: ["flower","flow","flight"]       → Output: "fl"
Input: ["dog","racecar","car"]          → Output: ""
Input: ["interspecies","interstellar"]  → Output: "inters"
```

## 📝 Interview Tips

1. **Edge cases first / Kiểm tra biên trước**: Empty array → `""`, single element → return it directly.
2. **Pivot on strs[0] / Dùng phần tử đầu làm mốc**: No need to sort — just shrink the prefix against each subsequent string.
3. **Vertical beats horizontal for sparse overlap / Vertical tốt hơn khi ít ký tự chung**: Stops at the first mismatch column without re-scanning already-matched characters.
4. **Mention Trie / Đề cập Trie**: For repeated prefix queries over the same set, a Trie gives O(m) lookup after O(S) build — shows depth beyond the interview question.
5. **Binary Search variant / Biến thể Binary Search**: Binary search on prefix length [0, minLen] is O(S log m) — worth mentioning to show range-of-thinking.

## Solutions

{% raw %}
/\*\*

- Longest Common Prefix
- https://leetcode.com/problems/longest-common-prefix/
  \*/

/\*\*

- Solution 1: Horizontal Scanning
- Start with strs[0] as prefix; shrink it until it matches each string's start.
- Time O(S) — S = total chars across all strings | Space O(1)
  \*/
  function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return "";
  let prefix = strs[0];

for (let i = 1; i < strs.length; i++) {
while (strs[i].indexOf(prefix) !== 0) {
prefix = prefix.substring(0, prefix.length - 1);
if (prefix === "") return "";
}
}

return prefix;
}

/\*\*

- Solution 2: Vertical Scanning (optimal early-exit)
- Compare column-by-column across all strings; return on first mismatch.
- Time O(S) | Space O(1) — exits as soon as any string diverges
  \*/
  function longestCommonPrefixVertical(strs: string[]): string {
  if (strs.length === 0) return "";
  const first = strs[0];

for (let i = 0; i < first.length; i++) {
const ch = first[i];
for (let j = 1; j < strs.length; j++) {
if (i >= strs[j].length || strs[j][i] !== ch) {
return first.substring(0, i);
}
}
}

return first;
}

// Inline tests
console.log(longestCommonPrefix(["flower", "flow", "flight"])); // "fl"
console.log(longestCommonPrefix(["dog", "racecar", "car"])); // ""
console.log(longestCommonPrefixVertical(["interspecies", "interstellar"])); // "inters"
console.log(longestCommonPrefixVertical(["a"])); // "a"
{% endraw %}

## 🔗 Related Problems

- [208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/) — Optimal structure for multi-query prefix lookups
- [1268. Search Suggestions System](https://leetcode.com/problems/search-suggestions-system/) — Prefix search with Trie or binary search
- [720. Longest Word in Dictionary](https://leetcode.com/problems/longest-word-in-dictionary/) — Extension: prefix must be a valid word at every step
- [28. Find Index of First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) — String matching fundamentals (indexOf)
