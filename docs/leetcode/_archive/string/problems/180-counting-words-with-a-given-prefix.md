---
layout: page
title: "Counting Words With a Given Prefix"
difficulty: Easy
category: String
tags: [Array, String, String Matching]
leetcode_url: "https://leetcode.com/problems/counting-words-with-a-given-prefix"
---

# Counting Words With a Given Prefix / Đếm Từ Có Tiền Tố Cho Trước

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài toán đơn giản: **lọc và đếm** những từ bắt đầu bằng `pref`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Counting Words With a Given Prefix example:**

```
words = ["pay","attention","practice","attend"]   pref = "at"

Scan each word:
  "pay"       → starts with "at"? No
  "attention" → starts with "at"? Yes ✓
  "practice"  → starts with "at"? No
  "attend"    → starts with "at"? Yes ✓

Count = 2
```

**Three equivalent approaches:**

- `word.startsWith(pref)` — built-in, clearest
- `word.slice(0, pref.length) === pref` — explicit slice
- `word.indexOf(pref) === 0` — position check

---

---

## Problem Description

| Problem                                                                                                 | Difficulty | Pattern         |
| ------------------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [Find Words Containing Character](https://leetcode.com/problems/find-words-containing-character/)       | 🟢 Easy    | String filter   |
| [Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/)                           | 🟢 Easy    | Prefix matching |
| [Implement strStr()](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) | 🟢 Easy    | String search   |

---

## 📝 Interview Tips

- 🇻🇳 **`startsWith` là cách đọc rõ nhất**: ưu tiên dùng trong phỏng vấn
- 🇺🇸 **`startsWith` is most readable**: prefer it in interview for clarity
- 🇻🇳 **Edge case: pref dài hơn word**: `startsWith` xử lý đúng, trả về false
- 🇺🇸 **Edge case: pref longer than word**: `startsWith` handles correctly, returns false
- 🇻🇳 **`slice` vs `substring`**: cả hai đều hoạt động, `slice` thông dụng hơn
- 🇺🇸 **`slice` vs `substring`**: both work; `slice` is more commonly used
- 🇻🇳 **Tránh `indexOf`**: `indexOf(pref) === 0` đúng nhưng không rõ bằng `startsWith`
- 🇺🇸 **Avoid `indexOf`**: correct but less obvious than `startsWith` for this intent
- 🇻🇳 **Regex cũng được**: `new RegExp('^' + pref).test(word)` nhưng chậm hơn
- 🇺🇸 **Regex works too**: `new RegExp('^' + pref).test(word)` but slower + escape issues
- 🇻🇳 **Độ phức tạp**: O(n × L) với n = số từ, L = độ dài tiền tố
- 🇺🇸 **Complexity**: O(n × L) where n = word count, L = prefix length

---

---

## Solutions

```typescript
/**
 * Count words that start with the given prefix.
 * Time: O(n × |pref|)  Space: O(1)
 */
function prefixCount(words: string[], pref: string): number {
  return words.filter((w) => w.startsWith(pref)).length;
}

console.log(prefixCount(["pay", "attention", "practice", "attend"], "at")); // 2
console.log(prefixCount(["leetcode", "win", "loops", "success"], "code")); // 0
console.log(prefixCount(["a", "b", "c", "ab", "bc", "abc"], "a")); // 3

/**
 * Single for-loop with explicit counter.
 * Time: O(n × |pref|)  Space: O(1)
 */
function prefixCount2(words: string[], pref: string): number {
  let count = 0;
  for (const word of words) {
    if (word.startsWith(pref)) count++;
  }
  return count;
}

console.log(prefixCount2(["pay", "attention", "practice", "attend"], "at")); // 2
console.log(prefixCount2(["leetcode", "win", "loops", "success"], "code")); // 0

/**
 * Manually compare prefix chars — useful in constrained environments.
 * Time: O(n × |pref|)  Space: O(1)
 */
function prefixCount3(words: string[], pref: string): number {
  let count = 0;
  const pl = pref.length;

  for (const word of words) {
    if (word.length < pl) continue;
    let match = true;
    for (let i = 0; i < pl; i++) {
      if (word[i] !== pref[i]) {
        match = false;
        break;
      }
    }
    if (match) count++;
  }
  return count;
}

console.log(prefixCount3(["pay", "attention", "practice", "attend"], "at")); // 2
console.log(prefixCount3(["a", "b", "c", "ab", "bc", "abc"], "a")); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                 | Difficulty | Pattern         |
| ------------------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [Find Words Containing Character](https://leetcode.com/problems/find-words-containing-character/)       | 🟢 Easy    | String filter   |
| [Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/)                           | 🟢 Easy    | Prefix matching |
| [Implement strStr()](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) | 🟢 Easy    | String search   |
