---
layout: page
title: "Minimum Length of Anagram Concatenation"
difficulty: Medium
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-length-of-anagram-concatenation"
---

# Minimum Length of Anagram Concatenation / Độ Dài Tối Thiểu Của Phép Ghép Hoán Vị

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Divisor Enumeration

## 🧠 Intuition / Trực Giác

**Vietnamese analogy**: Tìm chuỗi `t` ngắn nhất sao cho `s` là ghép nối các hoán vị của `t`. Nghĩa là `len(t)` phải là ước của `len(s)`, và mỗi đoạn `s[i..i+len(t)-1]` phải là hoán vị của `t`.

```
s = "abab"   len=4
Divisors of 4: 1, 2, 4

Try len=1: t="a"? → chunks "a","b","a","b" — "b" is not anagram of "a" ✗
Try len=2: t="ab"? → chunks "ab","ab" — both anagram of "ab" ✓ → answer=2
```

**Key insight**: `t.length` must divide `s.length`. For each divisor `d`, check if every chunk of size `d` has the same character frequency as the first chunk.

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **EN**: Enumerate divisors of `s.length` from smallest to largest; return first valid
  **VI**: Duyệt ước của `s.length` từ nhỏ đến lớn; trả về ước hợp lệ đầu tiên
- 🔑 **EN**: Two chunks are anagrams iff their sorted forms are equal (or freq maps match)
  **VI**: Hai đoạn là hoán vị nhau khi và chỉ khi dạng sắp xếp bằng nhau (hoặc freq map khớp)
- 🔑 **EN**: Use the first chunk as the "template"; all others must match it
  **VI**: Dùng đoạn đầu tiên làm "mẫu"; tất cả các đoạn còn lại phải khớp
- 🔑 **EN**: Freq comparison via sorted string: O(d log d) per chunk; total O(n log n)
  **VI**: So sánh freq qua chuỗi đã sắp xếp: O(d log d) mỗi đoạn; tổng O(n log n)
- 🔑 **EN**: Divisors of n ≤ 10⁵ are at most ~128 — enumeration is fast
  **VI**: Số ước của n ≤ 10⁵ tối đa ~128 — duyệt rất nhanh
- 🔑 **EN**: Edge case: `d = s.length` is always valid (whole string is one anagram of itself)
  **VI**: Trường hợp đặc biệt: `d = s.length` luôn hợp lệ

---

```typescript
// ─── Helper: get all divisors of n in ascending order ────────────────────────
function getDivisors(n: number): number[] {
  const divs: number[] = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      divs.push(i);
      if (i !== n / i) divs.push(n / i);
    }
  }
  return divs.sort((a, b) => a - b);
}

// ─── Solution 1: Sorted Chunk Comparison — O(n log n) overall ────────────────
function minAnagramLength(s: string): number {
  const n = s.length;
  const divisors = getDivisors(n);

  for (const d of divisors) {
    const template = s.slice(0, d).split("").sort().join("");
    let valid = true;

    for (let i = d; i < n; i += d) {
      const chunk = s
        .slice(i, i + d)
        .split("")
        .sort()
        .join("");
      if (chunk !== template) {
        valid = false;
        break;
      }
    }

    if (valid) return d;
  }

  return n; // fallback (always valid at full length)
}

// Tests
console.log(minAnagramLength("abab")); // 2
console.log(minAnagramLength("abcabc")); // 3
console.log(minAnagramLength("aababab")); // 7 (no shorter valid t)
console.log(minAnagramLength("aaaa")); // 1
```

```typescript
// ─── Solution 2: Freq Map Comparison — O(n·26) overall ───────────────────────
function minAnagramLength2(s: string): number {
  const n = s.length;

  const freqOf = (str: string, start: number, len: number): number[] => {
    const f = new Array(26).fill(0);
    for (let i = start; i < start + len; i++) f[s.charCodeAt(i) - 97]++;
    return f;
  };

  const freqEq = (a: number[], b: number[]): boolean => a.every((v, i) => v === b[i]);

  for (let d = 1; d <= n; d++) {
    if (n % d !== 0) continue;
    const template = freqOf(s, 0, d);
    let valid = true;

    for (let i = d; i < n; i += d) {
      if (!freqEq(template, freqOf(s, i, d))) {
        valid = false;
        break;
      }
    }

    if (valid) return d;
  }

  return n;
}

// Tests
console.log(minAnagramLength2("abab")); // 2
console.log(minAnagramLength2("abcabc")); // 3
console.log(minAnagramLength2("aaaa")); // 1
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                            | Difficulty | Pattern           |
| ---- | ---------------------------------- | ---------- | ----------------- |
| 49   | Group Anagrams                     | 🟡 Medium  | Hash Map          |
| 242  | Valid Anagram                      | 🟢 Easy    | Hash Map          |
| 1071 | Greatest Common Divisor of Strings | 🟢 Easy    | GCD / Divisor     |
| 686  | Repeated String Match              | 🟡 Medium  | String Repetition |
