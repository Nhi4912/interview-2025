---
layout: page
title: "Rearrange Words in a Sentence"
difficulty: Medium
category: Sorting-Searching
tags: [String, Sorting]
leetcode_url: "https://leetcode.com/problems/rearrange-words-in-a-sentence"
---

# Rearrange Words in a Sentence / Sắp Xếp Lại Các Từ Trong Câu

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Hình ảnh:** Bạn có một câu tiếng Anh. Muốn sắp xếp các từ theo **độ dài tăng dần** (từ ngắn trước, dài sau). Chữ đầu câu được viết hoa. Cần giữ **thứ tự ổn định** (stable sort) cho các từ cùng độ dài.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Rearrange Words in a Sentence example:**

```
text = "Leetcode is cool"
       ↓ lowercase all, then split
words = ["leetcode", "is", "cool"]
lengths = [8, 2, 4]

Stable sort by length:
  "is"(2)  < "cool"(4)  < "leetcode"(8)

Capitalize first word → "Is cool leetcode"
```

**Chiến lược:** Lowercase all → split → stable sort by word length → capitalize first word → join.

---

## Problem Description

Given sentence `text` (first word capitalized). Rearrange words in non-decreasing order of their lengths. Maintain original relative order for words of equal length. Return the rearranged sentence with first word capitalized.

**Example 1:** `text="Leetcode is cool"` → `"Is cool Leetcode"`
**Example 2:** `text="Keep calm and code on"` → `"On and keep calm code"`
**Example 3:** `text="To be or not to be"` → `"To be or be to not"`

**Constraints:** `1 ≤ text.length ≤ 10^5`, `text` contains only letters and spaces, exactly one space between words, `text[0]` is capital letter

---

## 📝 Interview Tips

- **Stable sort:** JavaScript's `Array.prototype.sort` is guaranteed stable (ES2019+)
- **Case handling:** Lowercase everything first, sort, then capitalize first word only
- **Capitalize:** `word[0].toUpperCase() + word.slice(1)`
- **Split/join:** `text.split(' ')` and `words.join(' ')` handle spacing
- **Edge cases:** Single word → return as-is (capitalize); all same length → original order preserved
- **Follow-up:** What if you need to sort descending? Reverse the comparator

---

## Solutions

```typescript
function arrangeWords(text: string): string {
  // Lowercase entire sentence, split into words
  const words = text.toLowerCase().split(" ");

  // Stable sort by word length (ascending)
  words.sort((a, b) => a.length - b.length);

  // Capitalize the first word of the result
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);

  return words.join(" ");
}

function arrangeWordsStable(text: string): string {
  // Lowercase and split
  const words = text.toLowerCase().split(" ");
  const n = words.length;

  // Attach original index to preserve stability manually
  const indexed = words.map((w, i) => ({ w, i }));
  indexed.sort(
    (a, b) => (a.w.length !== b.w.length ? a.w.length - b.w.length : a.i - b.i), // secondary: original order
  );

  const sorted = indexed.map(({ w }) => w);
  sorted[0] = sorted[0][0].toUpperCase() + sorted[0].slice(1);

  return sorted.join(" ");
}

function arrangeWordsFunctional(text: string): string {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const [first, ...rest] = text
    .toLowerCase()
    .split(" ")
    .sort((a, b) => a.length - b.length);

  return [capitalize(first), ...rest].join(" ");
}
```

---

## 🔗 Related Problems

| Problem                                                                                     | Similarity                          |
| ------------------------------------------------------------------------------------------- | ----------------------------------- |
| [Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/) | Sort elements by a derived property |
| [Largest Number](https://leetcode.com/problems/largest-number/)                             | Custom sort comparator on strings   |
| [Reorder Data in Log Files](https://leetcode.com/problems/reorder-data-in-log-files/)       | Stable sort with custom comparator  |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words/)                 | Sort words with stable tie-breaking |
