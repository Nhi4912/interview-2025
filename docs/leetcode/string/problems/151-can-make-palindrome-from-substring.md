---
layout: page
title: "Can Make Palindrome from Substring"
difficulty: Medium
category: String
tags: [Array, Hash Table, String, Bit Manipulation, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/can-make-palindrome-from-substring"
---

# Can Make Palindrome from Substring / Có thể tạo palindrome từ chuỗi con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Number of Valid Words for Each Puzzle](https://leetcode.com/problems/number-of-valid-words-for-each-puzzle) | [Count Pairs Of Similar Strings](https://leetcode.com/problems/count-pairs-of-similar-strings)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Mỗi ký tự là một đèn bật/tắt — XOR prefix tích lũy bit-mask tần số. Ký tự có tần số lẻ là "đèn đang bật". Palindrome cần ≤ 1 đèn bật (ký tự ở giữa), hoặc có thể hoán vị → dùng k lần đổi để tắt bớt đèn.

```
s = "abcda", query [1,3,1] (l=1,r=3,k=1)
Substring: s[1..3] = "bcd"
Char counts: b=1, c=1, d=1  → 3 odd-frequency chars

Prefix XOR masks (bit i = parity of char i):
prefix[0] = 0
prefix[1] = 001 (a)
prefix[2] = 011 (a,b)
prefix[3] = 111 (a,b,c)
prefix[4] = 1111 ← wait, only 26 bits

Range s[1..3]: mask = prefix[4] ^ prefix[1] = ...
oddCount = popcount(mask)
Can make palindrome if floor(oddCount/2) <= k
```

---

## 📝 Interview Tips / Ghi Nhớ Khi Phỏng Vấn

- 🔑 **XOR prefix / XOR tiền tố**: `prefix[i] ^ prefix[j]` cho biết parity tần số đoạn [i,j-1]
- 🔑 **Bit = parity / Bit = tính chẵn lẻ**: Bit thứ i bật → ký tự 'a'+i xuất hiện số lẻ lần
- 🔑 **Palindrome condition / Điều kiện palindrome**: Số ký tự tần số lẻ ≤ 1 (có thể đặt ở giữa)
- 🔑 **k swaps fix pairs / k lần đổi sửa cặp**: Mỗi swap có thể sửa 2 ký tự lẻ → cần `ceil(oddCount/2)` ≤ k, tức `floor(oddCount/2) ≤ k`
- 🔑 **popcount / đếm bit**: Dùng loop bit hay built-in để đếm số bit 1 trong mask
- 🔑 **prefix size n+1 / kích thước n+1**: prefix[0]=0, prefix[i] là mask cho s[0..i-1]

---

## Solutions

### Solution 1: Prefix XOR Bitmask (Optimal)

```typescript
/**
 * Build prefix XOR bitmask (bit i = parity of char 'a'+i count).
 * For query [l, r, k]: range mask = prefix[r+1] ^ prefix[l].
 * Odd chars = popcount(mask). Can palindrome if floor(oddCount/2) <= k.
 *
 * Time:  O(n + q) — O(n) build, O(1) per query
 * Space: O(n)     — prefix array
 */
function canMakePaliQueries(s: string, queries: number[][]): boolean[] {
  const n = s.length;
  const prefix = new Int32Array(n + 1);

  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] ^ (1 << (s.charCodeAt(i) - 97));
  }

  return queries.map(([l, r, k]) => {
    const mask = prefix[r + 1] ^ prefix[l];
    const oddCount = popcount(mask);
    return Math.floor(oddCount / 2) <= k;
  });
}

function popcount(x: number): number {
  let count = 0;
  while (x) {
    count += x & 1;
    x >>= 1;
  }
  return count;
}

console.log(
  canMakePaliQueries("abcda", [
    [3, 3, 0],
    [1, 2, 0],
    [0, 3, 1],
    [0, 3, 2],
  ]),
);
// [true, false, false, true]
console.log(
  canMakePaliQueries("lyb", [
    [0, 1, 0],
    [2, 2, 1],
  ]),
);
// [false, true]
```

### Solution 2: Bit Trick popcount (Kernighan)

```typescript
/**
 * Same prefix XOR approach, but uses Kernighan's bit-count trick.
 * Time:  O(n + q * 26) = O(n + q)
 * Space: O(n)
 */
function canMakePaliQueries2(s: string, queries: number[][]): boolean[] {
  const n = s.length;
  const prefix = new Int32Array(n + 1);

  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] ^ (1 << (s.charCodeAt(i) - 97));
  }

  const kernighan = (x: number): number => {
    let c = 0;
    while (x) {
      x &= x - 1;
      c++;
    }
    return c;
  };

  return queries.map(([l, r, k]) => {
    const odd = kernighan(prefix[r + 1] ^ prefix[l]);
    return odd >> 1 <= k; // floor(odd/2) <= k
  });
}

console.log(
  canMakePaliQueries2("abcda", [
    [3, 3, 0],
    [1, 2, 0],
    [0, 3, 1],
    [0, 3, 2],
  ]),
);
// [true, false, false, true]
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                                                                                            | Difficulty | Pattern     |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| 1177 | [Can Make Palindrome from Substring](https://leetcode.com/problems/can-make-palindrome-from-substring)                                             | 🟡 Medium  | Prefix XOR  |
| 1371 | [Find the Longest Substring with Vowels in Even Counts](https://leetcode.com/problems/find-the-longest-substring-containing-vowels-in-even-counts) | 🟡 Medium  | Prefix XOR  |
| 1915 | [Number of Wonderful Substrings](https://leetcode.com/problems/number-of-wonderful-substrings)                                                     | 🟡 Medium  | Prefix XOR  |
| 5    | [Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring)                                                       | 🟡 Medium  | DP / Expand |
