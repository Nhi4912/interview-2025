---
layout: page
title: "Remove Letter To Equalize Frequency"
difficulty: Easy
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/remove-letter-to-equalize-frequency"
---

# Remove Letter To Equalize Frequency / Xóa Một Ký Tự Để Cân Bằng Tần Số

> **Track**: String | **Difficulty**: 🟢 Easy | **Pattern**: Frequency Counting
> **Frequency**: Low — bài đơn giản về đếm tần số nhưng có nhiều edge case tinh tế
> **See also**: [Minimum Deletions to Make Character Frequencies Unique](https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique) | [Check if All Characters Have Equal Number of Occurrences](https://leetcode.com/problems/check-if-all-characters-have-equal-number-of-occurrences)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn có một túi bi đủ màu. Muốn mỗi màu có số lượng bi bằng nhau. Bạn được phép lấy ra đúng **một viên bi bất kỳ**. Cách kiểm tra: thử lấy từng màu ra một viên, rồi kiểm tra xem còn lại có đều không. Vì số màu (unique chars) tối đa là 26, bạn chỉ cần thử tối đa 26 lần — mỗi lần chỉ mất O(1) kiểm tra.

**Pattern Recognition:**

- Signal: "remove exactly one letter, check if all frequencies equal" → **Try each unique char, verify in O(1)**
- Bài này thuộc dạng brute-force thông minh — thử xóa từng loại ký tự và kiểm tra
- Key insight: chỉ cần thử xóa từng ký tự duy nhất (tối đa 26), không cần thử từng vị trí trong chuỗi

**Visual — word = "abcc" example:**

```
freq: { a:1, b:1, c:2 }

Try remove one 'a' (freq→0, delete key):
  remaining: { b:1, c:2 }  → unique freqs = {1,2} → size=2 ✗

Try remove one 'b' (freq→0, delete key):
  remaining: { a:1, c:2 }  → unique freqs = {1,2} → size=2 ✗

Try remove one 'c' (freq 2→1):
  remaining: { a:1, b:1, c:1 } → unique freqs = {1} → size=1 ✓ → return true

Answer: true (remove one 'c')
```

---

## Problem Description

Given a string `word`, return `true` if you can choose exactly one character and remove one occurrence of it so that every character in the remaining string has the same frequency. ([LeetCode](https://leetcode.com/problems/remove-letter-to-equalize-frequency))

```
Example 1: word = "abcc"  → true   (remove one 'c': "abc" → all freq=1)
Example 2: word = "aazz"  → false  (no single removal equalizes freqs)
Example 3: word = "zz"    → true   (remove one 'z': "z" → freq=1)
Example 4: word = "aaaa"  → true   (remove one 'a': "aaa" → all same)
```

Constraints: `2 <= word.length <= 100`, `word` consists of lowercase English letters.

---

## 📝 Interview Tips

1. **"Try only unique chars — at most 26 iterations"** — _Không cần thử từng vị trí O(n), chỉ thử 26 loại ký tự là đủ._
2. **"After removing one, check Set of frequency values has size 1"** — _Tất cả freq bằng nhau ⟺ `new Set(freqs).size === 1`._
3. **"Handle freq going to 0: remove key from map"** — _Nếu freq-1=0 thì xóa key khỏi map — không để freq=0 trong map._
4. **"Edge: single unique char left after removal → always equal"** — _Map.size=0 (empty) hoặc =1 sau khi xóa → true._
5. **"Don't mutate the original map"** — _Restore map sau mỗi lần thử, hoặc tạo shallow copy để kiểm tra._
6. **"Tricky edge: word='aaab' → remove 1 'b' → 'aaa' all same → true"** — _Khi freq(b)=1 và sau khi xóa map không có 'b', chỉ còn {a:3} → true._

---

## Solutions

```typescript
/** Solution 1: Try each unique char, restore after check  @complexity Time: O(26×26) = O(1) | Space: O(26) */
function equalFrequency(word: string): boolean {
  // Build frequency map
  const freq = new Map<string, number>();
  for (const c of word) freq.set(c, (freq.get(c) ?? 0) + 1);

  for (const [c, cnt] of freq) {
    // Temporarily remove one occurrence of c
    if (cnt === 1) {
      freq.delete(c);
    } else {
      freq.set(c, cnt - 1);
    }

    // Check if all remaining frequencies are equal
    const values = [...freq.values()];
    if (values.length === 0 || new Set(values).size === 1) {
      return true; // no need to restore — return immediately
    }

    // Restore
    freq.set(c, cnt);
  }

  return false;
}

/** Solution 2: Array-based frequency count  @complexity Time: O(n) | Space: O(26) */
function equalFrequency2(word: string): boolean {
  const cnt = new Array(26).fill(0);
  for (const c of word) cnt[c.charCodeAt(0) - 97]++;

  // Try removing one of each present char
  for (let i = 0; i < 26; i++) {
    if (cnt[i] === 0) continue;
    cnt[i]--;

    // Collect non-zero freqs and check all equal
    const nonZero = cnt.filter((v) => v > 0);
    if (nonZero.length === 0 || new Set(nonZero).size === 1) {
      return true;
    }

    cnt[i]++; // restore
  }

  return false;
}

// === Test Cases ===
console.log(equalFrequency("abcc")); // true  (remove one 'c')
console.log(equalFrequency("aazz")); // false
console.log(equalFrequency("zz")); // true  (remove one 'z')
console.log(equalFrequency("aaaa")); // true  (remove one 'a')
console.log(equalFrequency("aaab")); // true  (remove 'b': "aaa")
console.log(equalFrequency2("abcc")); // true
console.log(equalFrequency2("aabb")); // false
console.log(equalFrequency("a")); // n/a (constraint: len>=2)
```

---

## 🔗 Related Problems

| #    | Problem                                    | Difficulty | Pattern            |
| ---- | ------------------------------------------ | ---------- | ------------------ |
| 1647 | Minimum Deletions to Make Char Freq Unique | Medium     | Frequency Counting |
| 1941 | Check if All Chars Have Equal Occurrences  | Easy       | Frequency Counting |
| 242  | Valid Anagram                              | Easy       | Hash Map           |
| 383  | Ransom Note                                | Easy       | Hash Map           |
