---
layout: page
title: "Find Words Containing Character"
difficulty: Easy
category: String
tags: [Array, String]
leetcode_url: "https://leetcode.com/problems/find-words-containing-character"
---

# Find Words Containing Character / Tìm Từ Chứa Ký Tự

**Difficulty:** 🟢 Easy | **Tags:** Array, String

---

## 🧠 Intuition / Trực Giác

Bài toán đơn giản như **lọc danh sách**: giữ lại những từ có chứa ký tự `x`.

```
words = ["leet","code","leetcode"]   x = 'e'

Index  Word        Contains 'e'?
  0    "leet"      l-[e]-[e]-t  →  ✓ include
  1    "code"      c-o-d-[e]    →  ✓ include
  2    "leetcode"  has 'e'      →  ✓ include

Output: [0, 1, 2]

words = ["abc","bcd","aaaa"]  x = 'z'
All words → no 'z' found     Output: []
```

**Single insight:** `word.includes(x)` — collect indices where this is `true`.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Trả về index, không phải từ**: đề hỏi indices, đừng nhầm trả về words
- 🇺🇸 **Return indices, not words**: the question asks for position numbers
- 🇻🇳 **`includes` vs `indexOf`**: cả hai hoạt động; `includes` rõ nghĩa hơn
- 🇺🇸 **`includes` vs `indexOf`**: both work; `includes` expresses intent clearly
- 🇻🇳 **`x` là ký tự đơn**: không cần lo về multi-char search
- 🇺🇸 **`x` is a single char**: no need to worry about multi-character search
- 🇻🇳 **filter + map hoặc reduce**: một lần duyệt là đủ
- 🇺🇸 **filter + map or reduce**: one pass through words is sufficient
- 🇻🇳 **Case-sensitive**: 'e' ≠ 'E', không cần chuẩn hoá
- 🇺🇸 **Case-sensitive**: the match is exact, no normalization needed
- 🇻🇳 **Độ phức tạp**: O(n × L) với n = số từ, L = độ dài từ trung bình
- 🇺🇸 **Complexity**: O(n × L) where n = word count, L = average word length

---

## 💻 Solutions

### Solution 1 — Filter + indexOf (Recommended)

```typescript
/**
 * Collect indices of words that contain character x.
 * Time: O(n × L)  Space: O(k) where k = result size
 */
function findWordsContaining(words: string[], x: string): number[] {
  const result: number[] = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i].includes(x)) result.push(i);
  }
  return result;
}

console.log(findWordsContaining(["leet", "code", "leetcode"], "e")); // [0, 1, 2]
console.log(findWordsContaining(["abc", "bcd", "aaaa", "cbc"], "z")); // []
console.log(findWordsContaining(["abc", "bcd", "aaaa", "cbc"], "a")); // [0, 2]
```

### Solution 2 — Functional reduce

```typescript
/**
 * Accumulate matching indices with reduce.
 * Time: O(n × L)  Space: O(k)
 */
function findWordsContaining2(words: string[], x: string): number[] {
  return words.reduce<number[]>((acc, word, i) => {
    if (word.includes(x)) acc.push(i);
    return acc;
  }, []);
}

console.log(findWordsContaining2(["leet", "code", "leetcode"], "e")); // [0, 1, 2]
```

### Solution 3 — flatMap one-liner

```typescript
/**
 * flatMap trick: return [i] or [] per element.
 * Time: O(n × L)  Space: O(k)
 */
function findWordsContaining3(words: string[], x: string): number[] {
  return words.flatMap((word, i) => (word.includes(x) ? [i] : []));
}

console.log(findWordsContaining3(["abc", "bcd", "aaaa", "cbc"], "a")); // [0, 2]
console.log(findWordsContaining3(["abc", "bcd", "aaaa", "cbc"], "b")); // [0, 1, 3]
```

---

## 🔗 Related Problems

| Problem                                                                                                                                 | Difficulty | Pattern            |
| --------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) | 🟢 Easy    | String search      |
| [Check if the Sentence Is Pangram](https://leetcode.com/problems/check-if-the-sentence-is-pangram/)                                     | 🟢 Easy    | Character presence |
| [Counting Words With a Given Prefix](https://leetcode.com/problems/counting-words-with-a-given-prefix/)                                 | 🟢 Easy    | startsWith filter  |
