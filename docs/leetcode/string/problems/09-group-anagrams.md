---
layout: page
title: "Group Anagrams"
difficulty: Medium
category: String
tags: [String, Hash Table, Sorting]
leetcode_url: "https://leetcode.com/problems/group-anagrams/"
---

# Group Anagrams / Nhóm Từ Đảo Chữ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 🔥 Tier 1 — Top 10 most asked
> **See also**: [Valid Anagram](./04-valid-anagram.md) | [Find All Anagrams](./19-find-all-anagrams-in-string.md) | [Minimum Window Substring](./14-minimum-window-substring.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có 100 thẻ từ, cần nhóm các từ "cùng bộ chữ cái" — "eat", "tea", "ate" đều dùng {a,e,t}. Sort chữ cái mỗi từ → cùng key = cùng nhóm.

**Pattern:** group by equivalence → HashMap với canonical key

- Sort approach: `"eat" → "aet"` — simple, O(k log k) per word
- Count approach: `"eat" → [1,0,0,0,1,0,...,1,...]` — faster for long words, O(k) per word

**Visual:**

```
Input: ["eat","tea","tan","ate","nat","bat"]

Sort each word → canonical key:
  "eat"→"aet"  "tea"→"aet"  "tan"→"ant"
  "ate"→"aet"  "nat"→"ant"  "bat"→"abt"

HashMap:
  "aet" → ["eat","tea","ate"]
  "ant" → ["tan","nat"]
  "abt" → ["bat"]
```

---

## Problem Description

**LeetCode #49.** Given an array of strings `strs`, group the anagrams together. Return in any order.

```
Example 1: strs = ["eat","tea","tan","ate","nat","bat"]
           → [["bat"],["nat","tan"],["ate","eat","tea"]]
Example 2: strs = [""]  → [[""]]
Example 3: strs = ["a"] → [["a"]]
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **Canonical key là core insight** — anagram = same sorted chars = same key; nêu điều này trước khi code
2. **Sort vs count key** — sort O(k log k) đủ tốt; count key O(k) tốt hơn khi k lớn và alphabet nhỏ
3. **Key format cho count** — dùng separator `"#"` giữa counts để tránh collision: `"1#2#0"` không bị nhầm với `"12#0"`
4. **Output order không quan trọng** — đề bài nói "return in any order" → không cần sort groups
5. **Edge cases** — empty string `""` sorted là `""` → valid key; single chars → nhóm riêng
6. **Follow-up** — Find All Anagrams in String (#438): sliding window + char count comparison

---

## Solutions

{% raw %}
// Solution 1: Sort Key — O(n _ k log k) time, O(n _ k) space ← SIMPLEST, use this
function groupAnagrams(strs: string[]): string[][] {
const groups = new Map<string, string[]>();

for (const str of strs) {
const key = str.split("").sort().join(""); // canonical form
if (!groups.has(key)) groups.set(key, []);
groups.get(key)!.push(str);
}

return Array.from(groups.values());
}

// Solution 2: Char-Count Key — O(n _ k) time, O(n _ k) space ← faster for long strings
// Uses "#"-separated counts to avoid key collisions (e.g. "12#0" vs "1#20")
function groupAnagramsCount(strs: string[]): string[][] {
const groups = new Map<string, string[]>();

for (const str of strs) {
const count = new Array(26).fill(0);
for (const ch of str) count[ch.charCodeAt(0) - 97]++;
const key = count.join("#"); // e.g. "1#0#0#0#1#0#...#1#..."

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(str);

}

return Array.from(groups.values());
}
{% endraw %}

---

## 🔗 Related Problems

| #   | Problem                                                                                       | Difficulty | Pattern        |
| --- | --------------------------------------------------------------------------------------------- | ---------- | -------------- |
| 242 | [Valid Anagram](https://leetcode.com/problems/valid-anagram/)                                 | 🟢 Easy    | Char Count     |
| 438 | [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) | 🟡 Medium  | Sliding Window |
| 76  | [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)           | 🔴 Hard    | Sliding Window |
| 567 | [Permutation in String](https://leetcode.com/problems/permutation-in-string/)                 | 🟡 Medium  | Sliding Window |
