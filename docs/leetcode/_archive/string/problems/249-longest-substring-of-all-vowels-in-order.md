---
layout: page
title: "Longest Substring Of All Vowels in Order"
difficulty: Medium
category: String
tags: [String, Sliding Window]
leetcode_url: "https://leetcode.com/problems/longest-substring-of-all-vowels-in-order"
---

# Longest Substring Of All Vowels in Order / Chuỗi Con Dài Nhất Chứa Đủ Nguyên Âm Theo Thứ Tự

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sliding Window
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) | [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Hãy nghĩ đến thang nhạc Do-Re-Mi: bạn chỉ được hát từng bậc một, mỗi bước lên cao hơn hoặc giữ nguyên bậc hiện tại. Khi nào hát thụt xuống thấp hơn (ví dụ từ 'i' về 'e'), đó là lúc chuỗi âm nhạc bị phá vỡ — bắt đầu chuỗi mới. Chuỗi "đẹp" phải có đủ 5 nốt a-e-i-o-u và các nốt đi theo chiều tăng dần.

**Pattern Recognition:**

- Signal: "contiguous substring" + "non-decreasing order of specific chars" + "all 5 vowels present" → **Linear Scan / Expand Window**
- Key insight: Mở rộng chuỗi hiện tại khi ký tự mới ≥ ký tự cuối cùng trong thứ tự nguyên âm. Reset khi nhỏ hơn hoặc không phải nguyên âm. Kiểm tra đủ 5 nguyên âm qua bộ đếm.

**Visual — word = "aeiaaioaaaaeiiiiouuuooaauuaeiu":**

```
Vowel order: a(0) < e(1) < i(2) < o(3) < u(4)

Scan:
a→[a] e→[a,e] i→[a,e,i] a→a<i RESET→[a]
a→[a,a] i→[a,a,i] o→[a,a,i,o] ...
...eventually find longest valid window

Window "aaaeiiiiouuu": has a,e,i,o,u → length=12? check...
Actual answer for this input = 5 (shortest valid "aeiou" exists)
```

---

## 📝 Problem Description

A string is "beautiful" if it consists only of vowels `{a,e,i,o,u}`, contains all 5, and each character is ≥ the previous in the order a<e<i<o<u. Return the length of the longest beautiful substring, or 0 if none exists.

- **Example 1:** word="aeiaaioaaaaeiiiiouuuooaauuaeiu" → `13`
- **Example 2:** word="aeeeiioooauuuaeiou" → `5`

Constraints: `1 ≤ n ≤ 5×10^4`, lowercase English letters.

---

## 🎯 Interview Tips

1. **Define "beautiful"** / Định nghĩa "đẹp": Only vowels, non-decreasing in a<e<i<o<u order, all 5 present.
2. **Reset condition** / Điều kiện reset: Non-vowel char, or new char < previous vowel in order → start fresh.
3. **Track distinct count** / Đếm nguyên âm phân biệt: Increment distinct count when char > previous (new vowel level).
4. **Valid when distinct==5** / Hợp lệ khi đủ 5: Update max only when all 5 vowels have appeared.
5. **Continue on equal** / Tiếp tục khi bằng: Same vowel repeated is fine — extends current window.
6. **Single pass** / Một lần quét: O(n) — no need for two pointers, just track window length and distinct count.

---

## 💡 Solutions

### Approach 1: Brute Force — Check All Substrings

/\*_ @complexity Time: O(n²) | Space: O(1) _/

```typescript
function longestBeautifulSubstringBrute(word: string): number {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  const order: Record<string, number> = { a: 0, e: 1, i: 2, o: 3, u: 4 };
  let best = 0;
  for (let i = 0; i < word.length; i++) {
    if (!vowels.has(word[i])) continue;
    const seen = new Set<string>();
    for (let j = i; j < word.length; j++) {
      if (!vowels.has(word[j])) break;
      if (j > i && order[word[j]] < order[word[j - 1]]) break;
      seen.add(word[j]);
      if (seen.size === 5) best = Math.max(best, j - i + 1);
    }
  }
  return best;
}
```

### Approach 2: Linear Scan — Expand Current Window (Optimal)

/\*_ @complexity Time: O(n) | Space: O(1) _/

```typescript
function longestBeautifulSubstring(word: string): number {
  const order: Record<string, number> = { a: 0, e: 1, i: 2, o: 3, u: 4 };
  const vowelSet = new Set(["a", "e", "i", "o", "u"]);
  let best = 0;
  let windowLen = 0;
  let distinct = 0;

  for (let i = 0; i < word.length; i++) {
    const c = word[i];
    if (!vowelSet.has(c)) {
      // Non-vowel: reset window
      windowLen = 0;
      distinct = 0;
    } else if (windowLen === 0) {
      // Start new window
      windowLen = 1;
      distinct = 1;
    } else {
      const prev = word[i - 1];
      if (!vowelSet.has(prev) || order[c] < order[prev]) {
        // Decreasing: reset
        windowLen = 1;
        distinct = 1;
      } else {
        windowLen++;
        if (order[c] > order[prev]) distinct++; // new vowel level
        if (distinct === 5) best = Math.max(best, windowLen);
      }
    }
    // Check if current single char completes (only if distinct just became 5 for length 5)
    if (distinct === 5) best = Math.max(best, windowLen);
  }
  return best;
}
```

---

## 🧪 Test Cases

```typescript
console.log(longestBeautifulSubstring("aeiaaioaaaaeiiiiouuuooaauuaeiu")); // → 13
console.log(longestBeautifulSubstring("aeeeiioooauuuaeiou")); // → 5
console.log(longestBeautifulSubstring("a")); // → 0
console.log(longestBeautifulSubstring("aeiou")); // → 5
console.log(longestBeautifulSubstring("aaeeiioouuaeiou")); // → 5
```

---

## 🔗 Related Problems

| Problem                                                                                                              | Difficulty | Pattern        |
| -------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Substring with Concatenation of All Words](https://leetcode.com/problems/substring-with-concatenation-of-all-words) | Hard       | Sliding Window |
| [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement)     | Medium     | Sliding Window |
| [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string)                         | Medium     | Sliding Window |
| [Permutation in String](https://leetcode.com/problems/permutation-in-string)                                         | Medium     | Sliding Window |
