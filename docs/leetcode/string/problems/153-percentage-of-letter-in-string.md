---
layout: page
title: "Percentage of Letter in String"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/percentage-of-letter-in-string"
---

# Percentage of Letter in String / Phần trăm chữ cái trong chuỗi

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Text Justification](https://leetcode.com/problems/text-justification) | [Decode String](https://leetcode.com/problems/decode-string)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tính tỉ lệ khi khảo sát — đếm số người trả lời "có", chia tổng, lấy phần nguyên. Đây là bài toán một dòng: đếm, chia, floor.

```
s = "foobar", letter = 'o'
Count 'o': 2 occurrences out of 6 total
Percentage: floor(2 * 100 / 6) = floor(33.33) = 33

s = "jjjj", letter = 'k'
Count 'k': 0
Percentage: floor(0 * 100 / 4) = 0

s = "aaa", letter = 'a'
Count 'a': 3 out of 3
Percentage: floor(3 * 100 / 3) = 100
```

---

## 📝 Interview Tips / Ghi Nhớ Khi Phỏng Vấn

- 🔑 **Integer division / Phép chia nguyên**: Dùng `Math.floor(count * 100 / s.length)`
- 🔑 **Multiply before divide / Nhân trước chia**: `count * 100 / n` tránh mất độ chính xác
- 🔑 **Zero case / Trường hợp 0**: Khi count=0 vẫn trả về 0, không lỗi
- 🔑 **No float needed / Không cần float**: `Math.floor` hoặc `~~` (bitwise truncate)
- 🔑 **filter vs reduce / filter vs reduce**: Cả hai đều O(n), filter dễ đọc hơn
- 🔑 **Regex count / Đếm bằng regex**: `(s.match(new RegExp(letter, 'g')) || []).length`

---

## Solutions

### Solution 1: Count + Floor Division (Cleanest)

```typescript
/**
 * Count occurrences of letter in s, return floor(count * 100 / s.length).
 *
 * Time:  O(n) — single pass
 * Space: O(1)
 */
function percentageLetter(s: string, letter: string): number {
  let count = 0;
  for (const c of s) {
    if (c === letter) count++;
  }
  return Math.floor((count * 100) / s.length);
}

console.log(percentageLetter("foobar", "o")); // 33
console.log(percentageLetter("jjjj", "k")); // 0
console.log(percentageLetter("aaa", "a")); // 100
console.log(percentageLetter("a", "b")); // 0
```

### Solution 2: filter + length (Functional)

```typescript
/**
 * Use Array filter to count matching chars.
 * Time:  O(n)
 * Space: O(n) — filter creates intermediate array
 */
function percentageLetter2(s: string, letter: string): number {
  const count = [...s].filter((c) => c === letter).length;
  return Math.floor((count * 100) / s.length);
}

console.log(percentageLetter2("foobar", "o")); // 33
console.log(percentageLetter2("jjjj", "k")); // 0
```

### Solution 3: reduce (Most Compact)

```typescript
/**
 * Single reduce accumulates count directly.
 * Time:  O(n)
 * Space: O(1) extra
 */
function percentageLetter3(s: string, letter: string): number {
  const count = [...s].reduce((acc, c) => acc + (c === letter ? 1 : 0), 0);
  return Math.floor((count * 100) / s.length);
}

console.log(percentageLetter3("foobar", "o")); // 33
console.log(percentageLetter3("aaa", "a")); // 100
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                                                            | Difficulty | Pattern  |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- |
| 383  | [Ransom Note](https://leetcode.com/problems/ransom-note)                                                                                           | 🟢 Easy    | Counting |
| 387  | [First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string)                                             | 🟢 Easy    | Counting |
| 242  | [Valid Anagram](https://leetcode.com/problems/valid-anagram)                                                                                       | 🟢 Easy    | Counting |
| 1941 | [Check if All Characters Have Equal Number of Occurrences](https://leetcode.com/problems/check-if-all-characters-have-equal-number-of-occurrences) | 🟢 Easy    | Counting |
