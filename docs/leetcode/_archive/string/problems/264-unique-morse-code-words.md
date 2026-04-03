---
layout: page
title: "Unique Morse Code Words"
difficulty: Easy
category: String
tags: [Array, Hash Table, String]
leetcode_url: "https://leetcode.com/problems/unique-morse-code-words"
---

# Unique Morse Code Words / Số Từ Mã Morse Duy Nhất

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Hash Set / String Transform
> **Frequency**: 📘 Tier 2 — Gặp ở 3 companies
> **See also**: [Jewels and Stones](https://leetcode.com/problems/jewels-and-stones) | [Ransom Note](https://leetcode.com/problems/ransom-note)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Trong điện tín xưa, mỗi chữ cái có một tín hiệu Morse riêng. Bạn cần đếm xem bao nhiêu từ trong danh sách có tín hiệu Morse khác nhau khi ghép lại. Ví dụ "gin" và "zen" đều mã hóa thành `"--...-."`— chúng "nghe giống nhau" qua điện tín! Bài toán đơn giản: chuyển mỗi từ thành chuỗi Morse, bỏ vào Set để loại trùng, trả về kích thước Set. Đây là bài toán cổ điển "map + set" — thường xuất hiện trong vòng đầu phỏng vấn để kiểm tra tư duy tạo hàm hash.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Unique Morse Code Words example:**

```
MORSE = [".-","-...","-.-.","-..",".","..-.","--.","....",
         "..",".---","-.-",".-..","--","-.","---",".--.","--.-",
         ".-.","...","-","..-","...-",".--","-..-","-.--","--.."]

words = ["gin","zen","gig","msg"]

"gin": g=--. i=.. n=-. → "--...-.""zen": z=--.. e=. n=-. → "--...-.""gig": g=--. i=.. g=--. → "--..--.""msg": m=-- s=... g=--. → "--...--.

Set = {"--...-.", "--..--."}  → size = 2
```

---

## Problem Description

Given an array of strings `words`, return the number of **different** Morse code transformations. Each letter maps to its international Morse code (a→".-", b→"-...", ..., z→"--..").

**Example 1:** `words = ["gin","zen","gig","msg"]` → `2` ("gin" and "zen" share "--...-."; "gig" and "msg" share "--..--.")
**Example 2:** `words = ["a"]` → `1`
**Example 3:** `words = ["the","ebt"]` → `1` (both map to same code)

**Constraints:** `1 ≤ words.length ≤ 100`, `1 ≤ words[i].length ≤ 12`, `words[i]` consists of lowercase English letters

---

## 📝 Interview Tips

- **Lookup table** / Bảng tra cứu: Mảng 26 phần tử indexed by `charCode - 97` nhanh hơn object/Map cho bảng cố định
- **String concatenation** / Nối chuỗi: Cộng Morse code từng ký tự là O(k) per word — tổng O(sum of lengths) = O(26k) max
- **Set for uniqueness** / Set để loại trùng: `new Set<string>()` tự động loại các mã trùng
- **Không cần decode** / No decode needed: Chỉ cần encode một chiều, không cần giải mã
- **Môi trường phỏng vấn** / Interview env: Thường được phép nhìn bảng Morse — không cần ghi nhớ thuộc lòng
- **Biến thể** / Variations: Có thể bị hỏi "tìm các từ cùng mã Morse" — group by Morse code dùng Map<string, string[]>

---

## Solutions

```typescript
/**
 * @complexity Time: O(n·k) | Space: O(n·k)
 * Encode each word to Morse, add to Set, return Set size.
 * MORSE[i] = code for letter (i + 'a'.charCodeAt(0))
 */
const MORSE_TABLE = [
  ".-",
  "-...",
  "-.-.",
  "-..",
  ".",
  "..-.",
  "--.",
  "....",
  "..",
  ".---",
  "-.-",
  ".-..",
  "--",
  "-.",
  "---",
  ".--.",
  "--.-",
  ".-.",
  "...",
  "-",
  "..-",
  "...-",
  ".--",
  "-..-",
  "-.--",
  "--..",
];

function uniqueMorseRepresentations(words: string[]): number {
  const codes = new Set<string>();
  for (const word of words) {
    let code = "";
    for (const c of word) code += MORSE_TABLE[c.charCodeAt(0) - 97];
    codes.add(code);
  }
  return codes.size;
}

/**
 * @complexity Time: O(n·k) | Space: O(n·k)
 * Uses the shared MORSE_TABLE; functional map+join pipeline
 */
function uniqueMorseRepresentationsFP(words: string[]): number {
  const toMorse = (w: string) => [...w].map((c) => MORSE_TABLE[c.charCodeAt(0) - 97]).join("");
  return new Set(words.map(toMorse)).size;
}

/**
 * @complexity Time: O(n·k) | Space: O(n·k)
 * Returns groups of words sharing the same Morse representation.
 * Useful when you need to list which words are "identical" over wire.
 */
function groupByMorse(words: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const word of words) {
    const code = [...word].map((c) => MORSE_TABLE[c.charCodeAt(0) - 97]).join("");
    const bucket = groups.get(code) ?? [];
    bucket.push(word);
    groups.set(code, bucket);
  }
  return groups;
}

// === Test Cases ===
console.log(uniqueMorseRepresentations(["gin", "zen", "gig", "msg"])); // → 2
console.log(uniqueMorseRepresentationsFP(["gin", "zen", "gig", "msg"])); // → 2
console.log(uniqueMorseRepresentations(["a"])); // → 1
console.log(uniqueMorseRepresentations(["the", "ebt"])); // → 1
const groups = groupByMorse(["gin", "zen", "gig", "msg"]);
console.log([...groups.entries()].map(([k, v]) => `${k}: ${v}`));
// → ["--...-.": gin,zen", "--..--.": gig,msg"]
```

---

## 🔗 Related Problems

| Problem                  | Difficulty | Link                                                             |
| ------------------------ | ---------- | ---------------------------------------------------------------- |
| Jewels and Stones        | Easy       | [LC 771](https://leetcode.com/problems/jewels-and-stones)        |
| Group Anagrams           | Medium     | [LC 49](https://leetcode.com/problems/group-anagrams)            |
| Find and Replace Pattern | Medium     | [LC 890](https://leetcode.com/problems/find-and-replace-pattern) |
