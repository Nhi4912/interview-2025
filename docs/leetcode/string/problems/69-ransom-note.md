---
layout: page
title: "Ransom Note"
difficulty: Easy
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/ransom-note"
---

# Ransom Note / Thư Tống Tiền

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống cắt chữ từ báo để dán vào thư — mỗi chữ cái trong thư tống tiền phải có đủ số lượng trong tờ báo. Đếm tồn kho báo, rồi kiểm tra từng ký tự thư.

**Pattern Recognition:**

- Bài toán "có đủ nguyên liệu không?" → đếm freq rồi so sánh
- Count magazine chars → subtract ransomNote chars → nếu âm → return false
- Chỉ 26 chữ cái → có thể dùng array[26] thay Map

```
ransomNote = "aa"  magazine = "aab"

magazine freq:  a→2, b→1
ransomNote:
  'a': need 1, have 2 → OK, mag a→1
  'a': need 1, have 1 → OK, mag a→0
  Result: true ✅

ransomNote = "aa"  magazine = "ab"
  'a': need 1, have 1 → OK, mag a→0
  'a': need 1, have 0 → FAIL ✗
  Result: false ✅
```

---

## Problem Description

Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed using letters from `magazine` (each letter used at most once).

**Examples:**

- `ransomNote = "a", magazine = "b"` → `false`
- `ransomNote = "aa", magazine = "ab"` → `false`
- `ransomNote = "aa", magazine = "aab"` → `true`

**Constraints:** `1 ≤ ransomNote.length, magazine.length ≤ 10^5`, lowercase English letters only

---

## 📝 Interview Tips

- 🇻🇳 Đếm freq magazine trước, rồi trừ từng ký tự trong ransomNote — O(m+n)
- 🇺🇸 Use `number[26]` array (26 lowercase letters) for O(1) space vs Map
- 🇻🇳 Nếu bất kỳ `count < 0` → không đủ ký tự → return false ngay
- 🇺🇸 Alternatively: count ransom, then verify each count ≤ magazine count
- 🇻🇳 Follow-up: Unicode chars? → dùng Map thay vì array
- 🇺🇸 Classic char-counting pattern — also used in "Valid Anagram", "Anagram Groups"

---

## Solutions

### Solution 1 — Brute Force (indexOf + slice)

```typescript
/**
 * For each char in ransomNote, find and remove it from magazine string
 * Time: O(m * n) — indexOf is O(n) per character
 * Space: O(n) — magazine copy as array
 */
function canConstructBrute(ransomNote: string, magazine: string): boolean {
  let mag = magazine.split("");
  for (const ch of ransomNote) {
    const idx = mag.indexOf(ch);
    if (idx === -1) return false;
    mag.splice(idx, 1);
  }
  return true;
}
```

### Solution 2 — Hash Map / Array Counting (Optimal)

```typescript
/**
 * Count magazine freq, subtract ransomNote — O(m+n) single pass each
 * Time: O(m + n) — m = magazine.length, n = ransomNote.length
 * Space: O(1) — fixed 26-char frequency array
 */
function canConstruct(ransomNote: string, magazine: string): boolean {
  const count = new Array(26).fill(0);
  const a = "a".charCodeAt(0);

  // Count available letters in magazine
  for (const ch of magazine) {
    count[ch.charCodeAt(0) - a]++;
  }

  // Check if ransomNote can be satisfied
  for (const ch of ransomNote) {
    const idx = ch.charCodeAt(0) - a;
    count[idx]--;
    if (count[idx] < 0) return false; // not enough of this letter
  }

  return true;
}

// Test cases
console.log(canConstruct("a", "b")); // false
console.log(canConstruct("aa", "ab")); // false
console.log(canConstruct("aa", "aab")); // true
console.log(canConstruct("bg", "efjbdfbdgfjhhaiigfhbaejahgfbbgbjagbddfgdiaigdadhcb")); // true
```

---

## 🔗 Related Problems

- [242 - Valid Anagram](https://leetcode.com/problems/valid-anagram/) — same char-counting pattern
- [49 - Group Anagrams](https://leetcode.com/problems/group-anagrams/) — freq map as key
- [1347 - Minimum Steps to Make Two Strings Anagram](https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram/) — count difference
- [451 - Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/) — freq map + sort
