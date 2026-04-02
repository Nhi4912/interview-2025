---
layout: page
title: "Reverse Degree of a String"
difficulty: Easy
category: String
tags: [String, Simulation]
leetcode_url: "https://leetcode.com/problems/reverse-degree-of-a-string"
---

# Reverse Degree of a String / Bậc Đảo Ngược Của Chuỗi

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Tưởng tượng bảng chữ cái được đánh số ngược: `z=1, y=2, ..., a=26`. "Bậc đảo" của một chuỗi là tổng giá trị ngược này cho mỗi ký tự. Giống như bài kiểm tra ngược — đứng cuối lớp mà được điểm cao nhất!

**EN:** Assign reverse alphabet positions (`a=26`, `z=1`), then sum them all. The "reverse" in the name refers to counting from the end of the alphabet.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Reverse Degree of a String example:**

```
String:  "abc"
Degrees: a=26, b=25, c=24
Sum:     26 + 25 + 24 = 75

Alphabet position mapping:
a  b  c  d ... y  z
26 25 24 23... 2  1
```

---

## Problem Description

| #   | Problem                 | Difficulty | Key Idea                     |
| --- | ----------------------- | ---------- | ---------------------------- |
| 1   | Richest Customer Wealth | 🟢 Easy    | Sum of sums pattern          |
| 242 | Valid Anagram           | 🟢 Easy    | Character frequency counting |
| 389 | Find the Difference     | 🟢 Easy    | Character value arithmetic   |

---

## 📝 Interview Tips

- 🇻🇳 **Công thức:** `degree(c) = 26 - (c.charCodeAt(0) - 97)` — đơn giản và trực tiếp
- 🇬🇧 **Formula:** `26 - (charCode - 'a'.charCode)` gives reverse alphabetical rank
- 🇻🇳 **'a' = 26, 'z' = 1** — hoàn toàn ngược với vị trí thông thường
- 🇬🇧 **Reduce trick:** `Array.from(s).reduce((sum, c) => sum + 26 - (c.charCodeAt(0) - 97), 0)`
- 🇻🇳 **Edge case:** chuỗi rỗng trả về 0 — `reduce` xử lý tự nhiên với initial value
- 🇬🇧 **Single pass O(n):** no sorting or extra data structures needed

---

## Solutions

```typescript
/**
 * Computes the reverse degree: sum of (26 - alphabetical_position) for each char.
 * Time: O(n) | Space: O(1)
 */
function reverseDegree(s: string): number {
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    sum += 26 - (s.charCodeAt(i) - 97);
  }
  return sum;
}

console.log(reverseDegree("abc")); // 75 (26+25+24)
console.log(reverseDegree("z")); // 1
console.log(reverseDegree("a")); // 26
console.log(reverseDegree("az")); // 27

/**
 * Same logic using Array.from + reduce for functional style.
 * Time: O(n) | Space: O(n) — creates char array
 */
function reverseDegree2(s: string): number {
  return Array.from(s).reduce((sum, c) => sum + 26 - (c.charCodeAt(0) - 97), 0);
}

console.log(reverseDegree2("leetcode")); // l=15,e=22,e=22,t=7,c=24,o=12,d=23,e=22 = 147
console.log(reverseDegree2("")); // 0

/**
 * Build a lookup table for max performance on repeated calls.
 * Time: O(n) | Space: O(1) — fixed 26-entry table
 */
function reverseDegree3(s: string): number {
  const degree: number[] = Array.from({ length: 26 }, (_, i) => 26 - i);
  let sum = 0;
  for (const c of s) {
    sum += degree[c.charCodeAt(0) - 97];
  }
  return sum;
}

console.log(reverseDegree3("abc")); // 75
console.log(reverseDegree3("zzz")); // 3
console.log(reverseDegree3("aaa")); // 78
```

---

## 🔗 Related Problems

| #   | Problem                 | Difficulty | Key Idea                     |
| --- | ----------------------- | ---------- | ---------------------------- |
| 1   | Richest Customer Wealth | 🟢 Easy    | Sum of sums pattern          |
| 242 | Valid Anagram           | 🟢 Easy    | Character frequency counting |
| 389 | Find the Difference     | 🟢 Easy    | Character value arithmetic   |
