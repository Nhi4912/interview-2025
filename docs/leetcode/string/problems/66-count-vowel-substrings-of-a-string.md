---
layout: page
title: "Count Vowel Substrings of a String"
difficulty: Easy
category: String
tags: [Hash Table, String]
leetcode_url: "https://leetcode.com/problems/count-vowel-substrings-of-a-string"
---

# Count Vowel Substrings of a String / Đếm Chuỗi Con Gồm Toàn Nguyên Âm

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống kiểm tra kho hàng — mỗi chuỗi con phải chứa đủ 5 loại hàng (a,e,i,o,u) và không có hàng lạ (phụ âm). Dùng map đếm từng ký tự trong cửa sổ.

**Pattern Recognition:**

- Tìm chuỗi con chỉ gồm nguyên âm + chứa đủ 5 nguyên âm → Hash Map + nested loop
- Gặp phụ âm → dừng vòng lặp trong (break)
- Khi map.size == 5 → đây là chuỗi con hợp lệ

```
word = "aeiouu"

i=0 (a): seen={a:1}      → size=1
  i=0, j=1 (e): seen={a,e}    → size=2
  i=0, j=2 (i): seen={a,e,i}  → size=3
  i=0, j=3 (o): seen={a,e,i,o}→ size=4
  i=0, j=4 (u): seen={a,e,i,o,u}→ size=5 ✅ count=1
  i=0, j=5 (u): seen={...,u:2} → size=5 ✅ count=2

i=1 (e): seen={e:1}
  ...continue...

Answer: 2  ✅
```

---

## Problem Description

A vowel substring of a word consists **only** of vowels (`a, e, i, o, u`) and contains **all five** vowels at least once. Given string `word`, return the number of vowel substrings.

**Examples:**

- `word = "aeiouu"` → `2` (`"aeiou"` and `"aeiouu"`)
- `word = "unicornarihan"` → `0` (no substring with all 5 vowels, only vowels)
- `word = "cuaieuouac"` → `7`

**Constraints:** `1 ≤ word.length ≤ 100`, `word` consists of lowercase English letters

---

## 📝 Interview Tips

- 🇻🇳 Gặp phụ âm → `break` ngay vòng lặp trong — không cần check thêm
- 🇺🇸 Track `Map<char, count>` not just a Set — need to know all 5 are present
- 🇻🇳 Check `seen.size === 5` để xác nhận đủ cả 5 nguyên âm
- 🇺🇸 O(n²) is expected and accepted for n ≤ 100; no need to over-optimize
- 🇻🇳 Follow-up: dùng "at most k distinct" trick → đếm chính xác 5 trong O(n)
- 🇺🇸 Advanced: `f(atMost5) - f(atMost4)` gives exactly-5-distinct count

---

## Solutions

### Solution 1 — Brute Force O(n²)

```typescript
/**
 * Try all substrings starting at each vowel position
 * Time: O(n²) — nested loops, break on consonant
 * Space: O(1) — at most 5 vowel keys in map
 */
function countVowelSubstrings(word: string): number {
  const VOWELS = new Set(["a", "e", "i", "o", "u"]);
  let count = 0;

  for (let i = 0; i < word.length; i++) {
    if (!VOWELS.has(word[i])) continue; // must start with a vowel
    const seen = new Map<string, number>();
    for (let j = i; j < word.length; j++) {
      const ch = word[j];
      if (!VOWELS.has(ch)) break; // consonant terminates the window
      seen.set(ch, (seen.get(ch) ?? 0) + 1);
      if (seen.size === 5) count++; // all 5 vowels present
    }
  }
  return count;
}
```

### Solution 2 — Sliding Window "Exactly K" Trick (Optimal O(n))

```typescript
/**
 * count(exactly 5 distinct vowels, all-vowel substrings)
 *   = atMost(5) - atMost(4)
 * Time: O(n) — two passes with sliding window
 * Space: O(1)
 */
function countVowelSubstringsOptimal(word: string): number {
  const VOWELS = new Set(["a", "e", "i", "o", "u"]);

  // Count all-vowel substrings with at most k distinct vowels
  function atMost(k: number): number {
    let res = 0,
      left = 0;
    const freq = new Map<string, number>();

    for (let right = 0; right < word.length; right++) {
      const ch = word[right];
      if (!VOWELS.has(ch)) {
        // Consonant: reset window
        freq.clear();
        left = right + 1;
        continue;
      }
      freq.set(ch, (freq.get(ch) ?? 0) + 1);
      // Shrink from left while distinct count exceeds k
      while (freq.size > k) {
        const lch = word[left];
        freq.set(lch, freq.get(lch)! - 1);
        if (freq.get(lch) === 0) freq.delete(lch);
        left++;
      }
      res += right - left + 1; // all windows ending at right with <= k distinct
    }
    return res;
  }

  return atMost(5) - atMost(4);
}

// Test cases
console.log(countVowelSubstrings("aeiouu")); // 2
console.log(countVowelSubstrings("unicornarihan")); // 0
console.log(countVowelSubstrings("cuaieuouac")); // 7
console.log(countVowelSubstringsOptimal("cuaieuouac")); // 7
```

---

## 🔗 Related Problems

- [904 - Fruit Into Baskets](https://leetcode.com/problems/fruit-into-baskets/) — at most 2 distinct, sliding window
- [992 - Subarrays with K Different Integers](https://leetcode.com/problems/subarrays-with-k-different-integers/) — exactly K = atMost(K) - atMost(K-1)
- [3 - Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) — sliding window distinct chars
- [76 - Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) — window with all required chars
