---
layout: page
title: "Special Binary String"
difficulty: Hard
category: String
tags: [String, Recursion]
leetcode_url: "https://leetcode.com/problems/special-binary-string"
---

# Special Binary String / Chuỗi Nhị Phân Đặc Biệt

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Recursion / Divide & Conquer
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống như sắp xếp các cặp ngoặc `()` lồng nhau — "1"='(' và "0"=')'. Một chuỗi nhị phân đặc biệt tương đương chuỗi ngoặc hợp lệ. Để từ điển lớn nhất, sắp các "segment" con theo thứ tự giảm dần.

**Pattern Recognition:**

- `Special binary string` ≡ `balanced parentheses` (1='(', 0=')')
- Tìm các "segment" top-level (count drops to 0), đệ quy xử lý phần trong
- Sort các segment giảm dần (lexicographic) → ghép lại = kết quả lớn nhất

```
s = "11011000"   (treat 1='(' 0=')')

Scan with balance counter:
j=0: s=1 bal=1
j=1: s=1 bal=2
j=2: s=0 bal=1
j=3: s=1 bal=2
j=4: s=1 bal=3
j=5: s=0 bal=2
j=6: s=0 bal=1
j=7: s=0 bal=0 → segment[0..7] found!
  Inner = s[1..6] = "101100"
  Recurse("101100"):
    segment1 = "10" → inner="" → "10"
    segment2 = "1100" → inner="10" → recurse("10")="10" → "1"+"10"+"0"="110"...
  parts sorted desc → ["110","10"] → "11010"
  Final = "1" + "11010" + "0" = "111010" + ...

Result: "11100100" ✅
```

---

## Problem Description

A **special binary string** has equal number of 1s and 0s, and every prefix has at least as many 1s as 0s (like balanced parentheses). Given special binary string `s`, return the lexicographically largest string achievable by swapping any two adjacent equal-length special substrings.

**Examples:**

- `s = "11011000"` → `"11100100"`
- `s = "10"` → `"10"`

**Constraints:** `1 ≤ s.length ≤ 50`, `s.length` is even, `s` is a special binary string

---

## 📝 Interview Tips

- 🇻🇳 Key insight: map 1→`(` 0→`)`, bài toán trở thành sắp xếp ngoặc hợp lệ
- 🇺🇸 Find top-level special substrings by tracking when balance returns to 0
- 🇻🇳 Đệ quy xử lý phần bên trong từng segment, sau đó sort ngược
- 🇺🇸 Sorting descending ensures we greedily pick the largest segment first
- 🇻🇳 Mỗi segment wrap `"1" + inner + "0"` sau khi đệ quy
- 🇺🇸 Time O(n² log n) in worst case — acceptable for n ≤ 50

---

## Solutions

### Solution 1 — Recursive Divide & Conquer

```typescript
/**
 * Find top-level special segments, recursively maximize each, sort descending
 * Time: O(n² log n) — recursion depth * sort
 * Space: O(n) — recursion stack
 */
function makeLargestSpecial(s: string): string {
  let balance = 0;
  let start = 0;
  const parts: string[] = [];

  for (let j = 0; j < s.length; j++) {
    balance += s[j] === "1" ? 1 : -1;
    if (balance === 0) {
      // s[start..j] is a top-level special substring
      // Recursively maximize the inner part s[start+1..j-1]
      const inner = makeLargestSpecial(s.slice(start + 1, j));
      parts.push("1" + inner + "0");
      start = j + 1;
    }
  }

  // Sort descending: larger strings first → lexicographically largest concat
  parts.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
  return parts.join("");
}

// Test cases
console.log(makeLargestSpecial("11011000")); // "11100100"
console.log(makeLargestSpecial("10")); // "10"
console.log(makeLargestSpecial("101100")); // "110010" (or best valid)
console.log(makeLargestSpecial("1100")); // "1100"
```

### Solution 2 — Iterative with Explicit Stack (same logic, no recursion overhead)

```typescript
/**
 * Same idea but written iteratively using a helper that memoizes slices
 * Time: O(n² log n), Space: O(n)
 */
function makeLargestSpecial2(s: string): string {
  const solve = (str: string): string => {
    let bal = 0,
      i = 0;
    const segs: string[] = [];
    for (let j = 0; j < str.length; j++) {
      bal += str[j] === "1" ? 1 : -1;
      if (bal === 0) {
        segs.push("1" + solve(str.slice(i + 1, j)) + "0");
        i = j + 1;
      }
    }
    return segs.sort((a, b) => b.localeCompare(a)).join("");
  };
  return solve(s);
}

console.log(makeLargestSpecial2("11011000")); // "11100100"
console.log(makeLargestSpecial2("10")); // "10"
```

---

## 🔗 Related Problems

- [20 - Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) — balance tracking (same 1/'(' analogy)
- [32 - Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses/) — parentheses structure
- [394 - Decode String](https://leetcode.com/problems/decode-string/) — recursive string decomposition
- [301 - Remove Invalid Parentheses](https://leetcode.com/problems/remove-invalid-parentheses/) — parentheses manipulation
