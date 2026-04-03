---
layout: page
title: "Length of Last Word"
difficulty: Easy
category: String
tags: [String]
leetcode_url: "https://leetcode.com/problems/length-of-last-word"
---

# Length of Last Word / Độ Dài Từ Cuối Cùng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: String Processing
> **Frequency**: 📘 Tier 3 — Gặp ở 10 companies
> **See also**: [Text Justification](https://leetcode.com/problems/text-justification) | [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string)

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống đọc một tờ giấy từ cuối lên — bỏ qua khoảng trắng cuối, rồi đếm ký tự cho đến khi gặp khoảng trắng tiếp theo. Scan từ phải sang trái rất tự nhiên cho bài này.

**Pattern Recognition:** "Last word" → skip trailing spaces, count backwards until space or start.

```
s = "   fly me   to   the moon   "
                               ↑
Scan right-to-left:
1. Skip trailing spaces: "   "
2. Count non-space: "moon" → 4
Stop at space → return 4

Alternative: trim().split(/\s+/).at(-1).length
```

---

## 📋 Problem / Bài Toán

Given a string `s` consisting of words and spaces, return the **length of the last word**. A word is a maximal substring with no spaces.

- `s = "Hello World"` → `5`
- `s = "   fly me   to   the moon  "` → `4`
- `s = "luffy is still joyboy"` → `6`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Trailing spaces trap**: `"hello   "` — không trim → đếm sai. Luôn skip trailing spaces trước.
- 🔑 **Nhận biết**: Bài đơn giản nhưng dễ sai nếu không xử lý trailing/multiple spaces.
- ⚡ **Built-in O(n)**: `s.trim().split(/\s+/).at(-1)!.length` — ngắn nhất, phù hợp interview nhanh.
- ⚡ **Reverse scan O(n)**: Không tạo mảng tạm — tiết kiệm space, tốt khi chuỗi rất dài.
- 🚨 **Guaranteed valid**: LeetCode đảm bảo có ít nhất 1 từ, nhưng nên hỏi interviewer về edge case chuỗi rỗng.
- 💡 **Follow-up**: "Nếu cần nth-from-last word?" → cùng pattern, thêm counter cho số từ.

---

## Solutions

### Solution 1 — Trim + Split · O(n) time · O(n) space

```typescript
/**
 * Trim trailing/leading spaces, split by whitespace, take last element.
 * Clean and readable — good for rapid interview communication.
 * Time: O(n) | Space: O(n) for split array
 */
function lengthOfLastWord_split(s: string): number {
  const words = s.trim().split(/\s+/);
  return words[words.length - 1].length;
}

console.log(lengthOfLastWord_split("Hello World")); // 5
console.log(lengthOfLastWord_split("   fly me   to   the moon  ")); // 4
console.log(lengthOfLastWord_split("luffy is still joyboy")); // 6
console.log(lengthOfLastWord_split("a")); // 1
```

### Solution 2 — Reverse Scan · O(n) time · O(1) space

```typescript
/**
 * Scan from right: skip trailing spaces, then count characters until
 * next space or string start. No extra memory needed.
 * Time: O(n) | Space: O(1)
 */
function lengthOfLastWord(s: string): number {
  let i = s.length - 1;
  // skip trailing spaces
  while (i >= 0 && s[i] === " ") i--;
  // count last word
  let len = 0;
  while (i >= 0 && s[i] !== " ") {
    len++;
    i--;
  }
  return len;
}

console.log(lengthOfLastWord("Hello World")); // 5
console.log(lengthOfLastWord("   fly me   to   the moon  ")); // 4
console.log(lengthOfLastWord("luffy is still joyboy")); // 6
console.log(lengthOfLastWord("a ")); // 1
console.log(lengthOfLastWord("day")); // 3
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                      | Difficulty | Pattern           |
| -------------------------------------------------------------------------------------------- | ---------- | ----------------- |
| [Reverse Words in a String](https://leetcode.com/problems/reverse-words-in-a-string)         | 🟡 Medium  | String Processing |
| [Reverse Words in a String III](https://leetcode.com/problems/reverse-words-in-a-string-iii) | 🟢 Easy    | String Processing |
| [Text Justification](https://leetcode.com/problems/text-justification)                       | 🔴 Hard    | String Simulation |
| [Valid Word](https://leetcode.com/problems/valid-word)                                       | 🟢 Easy    | String Parsing    |
