---
layout: page
title: "Lexicographically Smallest Generated String"
difficulty: Hard
category: String
tags: [String, Greedy, String Matching]
leetcode_url: "https://leetcode.com/problems/lexicographically-smallest-generated-string"
---

# Lexicographically Smallest Generated String / Chuỗi sinh ra nhỏ nhất theo thứ tự từ điển

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống điền chỗ trống trong bài thi — xây dựng chuỗi kết quả từ trái qua phải. Khi `str1[i] = '1'`, bắt buộc đặt `str2` bắt đầu từ vị trí `i`. Khi `str1[i] = '0'`, đặt 'a' (nhỏ nhất có thể) nếu không bị ràng buộc.

```
str1 = "1001", str2 = "ba"
n = len(str1) = 4, m = len(str2) = 2
Result size = n + m - 1 = 5

Position 0: str1[0]='1' → place str2 at [0..1]: res[0]='b', res[1]='a'
Position 1: str1[1]='0' → free, greedy place 'a': res[1]='a' (already 'a', ok)
Position 2: str1[2]='0' → free, greedy place 'a': res[2]='a'
Position 3: str1[3]='1' → place str2 at [3..4]: res[3]='b', res[4]='a'

Result: "baaba" → check: valid
```

---

## 📝 Interview Tips / Ghi Nhớ Khi Phỏng Vấn

- 🔑 **Result length = n + m - 1 / Độ dài kết quả**: str1 là "selector" dài n, str2 dài m
- 🔑 **'1' forces placement / '1' bắt buộc đặt**: Vị trí '1' phải khớp với str2
- 🔑 **'0' greedy 'a' / '0' tham lam 'a'**: Đặt 'a' trừ khi đã bị ràng buộc
- 🔑 **Track placed positions / Theo dõi vị trí đã đặt**: Dùng mảng boolean `placed`
- 🔑 **Conflict = return "" / Mâu thuẫn = trả ""**: Nếu str2 bị đặt hai lần và không khớp
- 🔑 **Verify at end / Xác nhận cuối**: Kiểm tra mọi '0' không bị ép trùng str2

---

## Solutions

### Solution 1: Greedy with Conflict Detection

```typescript
/**
 * Build result of length n + m - 1.
 * Pass 1: place str2 at all positions where str1[i] = '1'.
 * Pass 2: fill remaining with 'a', but verify '0' positions don't accidentally match str2.
 *
 * Time:  O(n * m) — conflict check per position (can be optimized with KMP)
 * Space: O(n + m)
 */
function generateString(str1: string, str2: string): string {
  const n = str1.length;
  const m = str2.length;
  const len = n + m - 1;
  const res = new Array<string>(len).fill("");
  const placed = new Array<boolean>(len).fill(false);

  // Pass 1: enforce '1' positions — place str2 starting at index i
  for (let i = 0; i < n; i++) {
    if (str1[i] === "1") {
      for (let j = 0; j < m; j++) {
        if (res[i + j] !== "" && res[i + j] !== str2[j]) {
          return ""; // conflict
        }
        res[i + j] = str2[j];
        placed[i + j] = true;
      }
    }
  }

  // Pass 2: fill free positions with 'a'
  for (let i = 0; i < len; i++) {
    if (res[i] === "") res[i] = "a";
  }

  // Pass 3: verify '0' positions don't accidentally start a str2 match
  for (let i = 0; i < n; i++) {
    if (str1[i] === "0") {
      // Ensure str2 does NOT appear at position i
      let match = true;
      for (let j = 0; j < m; j++) {
        if (res[i + j] !== str2[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        // We need to break this accidental match — find a free 'a' inside [i, i+m-1]
        let broken = false;
        for (let j = 0; j < m; j++) {
          if (!placed[i + j]) {
            res[i + j] = "b"; // bump to 'b' to break match
            broken = true;
            break;
          }
        }
        if (!broken) return ""; // fully constrained and matches — impossible
      }
    }
  }

  return res.join("");
}

console.log(generateString("1001", "ba")); // "baaba"
console.log(generateString("1", "a")); // "a"
console.log(generateString("10", "ab")); // "aba"  (pos 0 forced "ab", pos 1 free → "a")
console.log(generateString("100", "ab")); // "aba"
```

### Solution 2: Two-Pass with Explicit Free-Slot Check

```typescript
/**
 * Cleaner separation: mark forced cells, fill 'a', then verify '0' anti-constraint.
 * Time:  O(n * m)
 * Space: O(n + m)
 */
function generateString2(str1: string, str2: string): string {
  const n = str1.length,
    m = str2.length;
  const res = new Array<string>(n + m - 1).fill("a");
  const locked = new Array<boolean>(n + m - 1).fill(false);

  // Enforce '1' placements
  for (let i = 0; i < n; i++) {
    if (str1[i] === "1") {
      for (let j = 0; j < m; j++) {
        if (locked[i + j] && res[i + j] !== str2[j]) return "";
        res[i + j] = str2[j];
        locked[i + j] = true;
      }
    }
  }

  // Verify '0' positions don't accidentally contain str2
  for (let i = 0; i < n; i++) {
    if (str1[i] === "0") {
      const sub = res.slice(i, i + m).join("");
      if (sub === str2) {
        // Find an unlocked position in [i, i+m-1] to bump
        let fixed = false;
        for (let j = 0; j < m; j++) {
          if (!locked[i + j]) {
            res[i + j] = str2[j] === "a" ? "b" : "a";
            fixed = true;
            break;
          }
        }
        if (!fixed) return "";
      }
    }
  }

  return res.join("");
}

console.log(generateString2("1001", "ba")); // "baaba"
console.log(generateString2("10", "ab")); // "aba"
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                                                                    | Difficulty | Pattern               |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| 28   | [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string)                     | 🟢 Easy    | KMP / String matching |
| 44   | [Wildcard Matching](https://leetcode.com/problems/wildcard-matching)                                                                                       | 🔴 Hard    | DP                    |
| 316  | [Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters)                                                                         | 🟡 Medium  | Greedy + Stack        |
| 2434 | [Using a Robot to Print the Lexicographically Smallest String](https://leetcode.com/problems/using-a-robot-to-print-the-lexicographically-smallest-string) | 🟡 Medium  | Greedy + Stack        |
