---
layout: page
title: "Most Common Word"
difficulty: Easy
category: String
tags: [Array, Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/most-common-word"
---

# Most Common Word / Từ Xuất Hiện Nhiều Nhất

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài toán giống như **đếm phiếu bầu**: loại trừ ứng viên bị cấm, ai nhiều phiếu nhất thắng.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Most Common Word example:**

```
paragraph = "Bob hit a ball, the hit BALL flew far after it was hit."
banned    = ["hit"]

Step 1 – Normalize:   "bob hit a ball  the hit ball flew far after it was hit"
Step 2 – Filter ban:  hit(×) hit(×) hit(×)
Step 3 – Count:       bob(1) a(1) ball(2★) the(1) flew(1) far(1) after(1) it(2)
Step 4 – Max count:   "ball" → 2  ← answer
```

**Key steps:**

1. `toLowerCase()` + replace non-alpha with spaces (`[^a-z]` → `' '`)
2. Split on whitespace, filter empty tokens
3. Build frequency map, skip banned words (use a `Set` for O(1) lookup)
4. Return word with maximum count

---

---

## Problem Description

| Problem                                                                                                 | Difficulty | Pattern        |
| ------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words/)                             | 🟡 Medium  | HashMap + heap |
| [First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string/) | 🟢 Easy    | Frequency map  |
| [Word Frequency](https://leetcode.com/problems/word-frequency/)                                         | 🟡 Medium  | Shell counting |

---

## 📝 Interview Tips

- 🇻🇳 **Chuẩn hoá trước**: lowercase + xóa dấu câu là bước hay bị bỏ quên nhất
- 🇺🇸 **Normalize first**: lowercasing + stripping punctuation is the #1 missed step
- 🇻🇳 **Banned dùng Set**: tra cứu O(1) thay vì O(m) như Array
- 🇺🇸 **Banned as Set**: O(1) lookup instead of O(m) linear scan
- 🇻🇳 **Regex gọn**: `paragraph.replace(/[^a-z]/gi, ' ')` xử lý mọi dấu câu
- 🇺🇸 **Clean regex**: `/[^a-z]/gi` handles all punctuation in one pass
- 🇻🇳 **split + filter**: `split(/\s+/).filter(Boolean)` loại chuỗi rỗng đầu/cuối
- 🇺🇸 **split + filter**: `split(/\s+/).filter(Boolean)` removes empty tokens
- 🇻🇳 **Edge case**: paragraph chứa toàn ký tự đặc biệt → từ là chuỗi rỗng sau split
- 🇺🇸 **Edge case**: leading/trailing spaces after replace can produce empty tokens — always filter
- 🇻🇳 **Độ phức tạp**: O(n + m) với n = độ dài paragraph, m = số từ banned
- 🇺🇸 **Complexity**: O(n + m) where n = paragraph length, m = banned count

---

---

## Solutions

```typescript
/**
 * Normalize, split, count, exclude banned.
 * Time: O(n + m)  Space: O(n + m)
 */
function mostCommonWord(paragraph: string, banned: string[]): string {
  const bannedSet = new Set(banned.map((w) => w.toLowerCase()));
  const words = paragraph
    .toLowerCase()
    .replace(/[^a-z]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const freq = new Map<string, number>();
  for (const word of words) {
    if (!bannedSet.has(word)) {
      freq.set(word, (freq.get(word) ?? 0) + 1);
    }
  }

  let best = "";
  let maxCount = 0;
  for (const [word, count] of freq) {
    if (count > maxCount) {
      maxCount = count;
      best = word;
    }
  }
  return best;
}

console.log(mostCommonWord("Bob hit a ball, the hit BALL flew far after it was hit.", ["hit"])); // "ball"
console.log(mostCommonWord("a.", [])); // "a"
console.log(mostCommonWord("Bob. hIt, baLl", ["bob", "hit"])); // "ball"

/**
 * Reduce-based pipeline.
 * Time: O(n + m)  Space: O(n)
 */
function mostCommonWord2(paragraph: string, banned: string[]): string {
  const ban = new Set(banned.map((w) => w.toLowerCase()));
  const freq = paragraph
    .toLowerCase()
    .replace(/[^a-z]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !ban.has(w))
    .reduce((map, w) => map.set(w, (map.get(w) ?? 0) + 1), new Map<string, number>());

  return [...freq.entries()].reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

console.log(mostCommonWord2("Bob hit a ball, the hit BALL flew far after it was hit.", ["hit"])); // "ball"

/**
 * Manual parsing without regex for environments that restrict it.
 * Time: O(n + m)  Space: O(n)
 */
function mostCommonWord3(paragraph: string, banned: string[]): string {
  const ban = new Set(banned.map((w) => w.toLowerCase()));
  const freq = new Map<string, number>();
  let word = "";

  for (let i = 0; i <= paragraph.length; i++) {
    const ch = i < paragraph.length ? paragraph[i].toLowerCase() : "";
    if (ch >= "a" && ch <= "z") {
      word += ch;
    } else if (word.length > 0) {
      if (!ban.has(word)) freq.set(word, (freq.get(word) ?? 0) + 1);
      word = "";
    }
  }

  let best = "";
  let max = 0;
  for (const [w, c] of freq)
    if (c > max) {
      max = c;
      best = w;
    }
  return best;
}

console.log(mostCommonWord3("Bob hit a ball, the hit BALL flew far after it was hit.", ["hit"])); // "ball"
```

---

## 🔗 Related Problems

| Problem                                                                                                 | Difficulty | Pattern        |
| ------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words/)                             | 🟡 Medium  | HashMap + heap |
| [First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string/) | 🟢 Easy    | Frequency map  |
| [Word Frequency](https://leetcode.com/problems/word-frequency/)                                         | 🟡 Medium  | Shell counting |
