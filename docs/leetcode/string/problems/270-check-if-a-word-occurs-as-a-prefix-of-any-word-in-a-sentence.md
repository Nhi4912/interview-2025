---
layout: page
title: "Check If a Word Occurs As a Prefix of Any Word in a Sentence"
difficulty: Easy
category: String
tags: [Two Pointers, String, String Matching]
leetcode_url: "https://leetcode.com/problems/check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence"
---

# Check If a Word Occurs As a Prefix of Any Word in a Sentence / Kiểm Tra Tiền Tố Trong Câu

> **Track**: String | **Difficulty**: 🟢 Easy | **Pattern**: String Matching
> **Frequency**: Low — bài khởi động tốt về thao tác chuỗi và tách từ
> **See also**: [Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix) | [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang lật từng trang trong danh bạ điện thoại để tìm người đầu tiên có họ bắt đầu bằng "Nguy" — bạn không cần đọc hết toàn bộ tên, chỉ cần kiểm tra phần đầu mỗi họ từ trái sang phải. Khi thấy họ nào bắt đầu bằng "Nguy" thì trả về vị trí trang đó (đánh số từ 1). Nếu lật hết danh bạ mà không tìm thấy, trả về -1.

**Pattern Recognition:**

- Signal: "find first word that starts with..." → **Linear Scan + String.startsWith**
- Bài này thuộc dạng tách câu thành danh sách từ rồi duyệt tuần tự tìm tiền tố khớp
- Key insight: dùng `split(' ')` tách từ, `startsWith` kiểm tra tiền tố — nhớ trả về `i+1` (1-indexed)

**Visual — sentence scan example:**

```
sentence = "i love eating burger"   searchWord = "burg"

Split by ' ': ["i", "love", "eating", "burger"]
               idx=0  idx=1   idx=2    idx=3

Check each word for prefix "burg":
  idx=0: "i"       → startsWith("burg")? NO  ✗
  idx=1: "love"    → startsWith("burg")? NO  ✗
  idx=2: "eating"  → startsWith("burg")? NO  ✗
  idx=3: "burger"  → startsWith("burg")? YES ✓
         → return idx + 1 = 4

Answer: 4
```

---

## Problem Description

Given a `sentence` (words separated by single spaces) and a `searchWord`, return the **1-indexed** position of the first word that has `searchWord` as a prefix. Return `-1` if no such word exists. ([LeetCode](https://leetcode.com/problems/check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence))

```
Example 1: sentence = "i love eating burger",            searchWord = "burg" → 4
Example 2: sentence = "this problem is an easy problem", searchWord = "pro"  → 2
Example 3: sentence = "i am tired",                      searchWord = "you"  → -1
```

Constraints: `1 <= sentence.length <= 100`, `1 <= searchWord.length <= 10`, all lowercase letters and spaces.

---

## 📝 Interview Tips

1. **"Split by single space, not regex"** — _Đề bài đảm bảo từ cách nhau đúng 1 space, nên `split(' ')` là đủ — không cần `split(/\s+/)` hay regex._
2. **"Return 1-indexed, not 0-indexed"** — _Hay nhầm: phải trả về `i + 1`, không phải `i`._
3. **"startsWith vs includes"** — _Đây là tiền tố (prefix), không phải substring — dùng `startsWith`, không dùng `includes`._
4. **"Return on first match immediately"** — _Trả về ngay khi tìm thấy từ đầu tiên khớp — không cần duyệt tiếp._
5. **"Full word match counts as prefix"** — _"burger" bắt đầu bằng "burger" → hợp lệ; tiền tố bao gồm cả từ nguyên vẹn._
6. **"Follow-up: find all positions"** — _Nếu yêu cầu tất cả vị trí, dùng `reduce` để thu thập mọi index khớp thay vì `findIndex`._

---

## Solutions

```typescript
/** Solution 1: Split + startsWith scan  @complexity Time: O(n) | Space: O(n) */
function isPrefixOfWord(sentence: string, searchWord: string): number {
  const words = sentence.split(" ");
  for (let i = 0; i < words.length; i++) {
    if (words[i].startsWith(searchWord)) return i + 1;
  }
  return -1;
}

/** Solution 2: Walk sentence without allocating word array  @complexity Time: O(n) | Space: O(1) */
function isPrefixOfWord2(sentence: string, searchWord: string): number {
  let wordIdx = 1;
  let i = 0;
  while (i <= sentence.length) {
    // Check searchWord as prefix starting at current word boundary
    if (sentence.startsWith(searchWord, i)) {
      // Confirm it's at a word start (beginning or after space)
      if (i === 0 || sentence[i - 1] === " ") return wordIdx;
    }
    // Advance to next word
    const next = sentence.indexOf(" ", i);
    if (next === -1) break;
    i = next + 1;
    wordIdx++;
  }
  return -1;
}

/** Solution 3: One-liner using findIndex  @complexity Time: O(n) | Space: O(n) */
function isPrefixOfWord3(sentence: string, searchWord: string): number {
  const idx = sentence.split(" ").findIndex((w) => w.startsWith(searchWord));
  return idx === -1 ? -1 : idx + 1;
}

// === Test Cases ===
console.log(isPrefixOfWord("i love eating burger", "burg")); // 4
console.log(isPrefixOfWord("this problem is an easy problem", "pro")); // 2
console.log(isPrefixOfWord("i am tired", "you")); // -1
console.log(isPrefixOfWord("hello from the other side", "other")); // 4
console.log(isPrefixOfWord3("a", "a")); // 1
console.log(isPrefixOfWord2("i love eating burger", "burg")); // 4
```

---

## 🔗 Related Problems

| #   | Problem                                            | Difficulty | Pattern            |
| --- | -------------------------------------------------- | ---------- | ------------------ |
| 14  | Longest Common Prefix                              | Easy       | String Matching    |
| 28  | Find the Index of the First Occurrence in a String | Easy       | Two Pointers / KMP |
| 58  | Length of Last Word                                | Easy       | String Scan        |
| 208 | Implement Trie (Prefix Tree)                       | Medium     | Trie               |
