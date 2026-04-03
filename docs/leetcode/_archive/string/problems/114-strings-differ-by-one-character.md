---
layout: page
title: "Strings Differ by One Character"
difficulty: Medium
category: String
tags: [Hash Table, String, Rolling Hash, Hash Function]
leetcode_url: "https://leetcode.com/problems/strings-differ-by-one-character"
---

# Strings Differ by One Character / Chuỗi Khác Nhau Một Ký Tự

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: String Matching
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences) | [Unique Substrings With Equal Digit Frequency](https://leetcode.com/problems/unique-substrings-with-equal-digit-frequency)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống so sánh dấu vân tay — thay vì so sánh từng đường nét, tạo một "hash" tổng quát bỏ đi một chi tiết. Nếu hai người có cùng hash khi bỏ ngón thứ k, họ chỉ khác ở ngón đó.

**Pattern Recognition:**

- Signal: "differ by exactly one position" + "large dictionary" → **Rolling Hash**
- Key insight: Với mỗi vị trí `j`, tạo hash của từng chuỗi sau khi "xóa" ký tự thứ j. Nếu hai chuỗi có cùng hash ở cùng vị trí j → chúng chỉ khác ở j.
- Tránh collision: dùng random polynomial hash với large prime.

**Visual:**

```
dict = ["abcd","acbd","aacd"]
       len=4, check position j=1:
  "abcd" → hash("a_cd") = hash("a") + hash("cd")
  "acbd" → hash("a_bd")
  "aacd" → hash("a_cd")  ← same as "abcd" at j=1!
  → "abcd" and "aacd" differ only at position 1 → TRUE
```

---

## Problem Description

Given a list of equal-length strings `dict`, determine if there exist two strings that differ by **exactly one character** at the **same position**. ([LeetCode](https://leetcode.com/problems/strings-differ-by-one-character))

Difficulty: Medium | Acceptance: ~58%

```
Example 1: dict = ["abcd","acbd","aacd"] → true
  "abcd" and "aacd" differ only at index 1 ('b' vs 'a')

Example 2: dict = ["ab","cd","yz"] → false
  No two strings differ at exactly one position

Example 3: dict = ["abcd","cccc","abyd","abct"] → true
  "abcd" and "abct" differ only at index 3
```

Constraints:

- `2 <= dict.length <= 100`
- `1 <= dict[i].length <= 100`
- All strings have equal length
- All strings consist of lowercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "Tất cả chuỗi cùng độ dài? Chỉ khác đúng 1 vị trí?" / All same length, exactly 1 position different?
2. **Brute force**: "So sánh từng cặp O(n²·L) — đúng, đủ nhanh với constraints nhỏ" / O(n²·L) brute force fine for n,L ≤ 100.
3. **Optimize**: "Rolling hash: với mỗi j, hash toàn bộ chuỗi ngoại trừ vị trí j" / Hash strings omitting position j → O(n·L).
4. **Collision**: "Dùng nhiều hash values hoặc random base để giảm collision" / Use random base to minimize false positives.
5. **Edge cases**: "dict = ['a','b'] → true; dict = ['aa','aa'] → false (same string, differ by 0)" / Check ≥1 diff.
6. **Follow-up**: "Differ by ≤ k characters? → dùng edit distance hoặc generalized hash" / Generalize with edit distance.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Compare all pairs
 * Time: O(n² · L) — n²/2 pairs × L comparison
 * Space: O(1)
 */
function differByOneCharacterBrute(dict: string[]): boolean {
  const n = dict.length;
  const L = dict[0].length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let diffs = 0;
      for (let k = 0; k < L; k++) {
        if (dict[i][k] !== dict[j][k]) diffs++;
        if (diffs > 1) break;
      }
      if (diffs === 1) return true;
    }
  }
  return false;
}

/**
 * Solution 2: Rolling Hash — O(n·L)
 * Time: O(n · L) — for each of L positions, hash all n strings
 * Space: O(n) — hash set per column
 *
 * For each position j (0..L-1):
 *   Compute hash of each string with position j "masked out".
 *   If two strings share the same masked hash → they differ at j only.
 */
function differByOneCharacter(dict: string[]): boolean {
  const n = dict.length;
  const L = dict[0].length;

  // Randomized polynomial hash to reduce collision probability
  const BASE = 31n;
  const MOD = 1_000_000_007n;

  // Precompute char codes → BigInt for hashing
  const codes: bigint[][] = dict.map((s) => s.split("").map((c) => BigInt(c.charCodeAt(0) - 96)));

  // Precompute powers: BASE^0, BASE^1, ..., BASE^(L-1)
  const pow: bigint[] = [1n];
  for (let i = 1; i < L; i++) {
    pow.push((pow[i - 1] * BASE) % MOD);
  }

  // Compute full hash for each string
  const fullHash: bigint[] = dict.map((_, i) =>
    codes[i].reduce((acc, c, k) => (acc + c * pow[k]) % MOD, 0n),
  );

  // For each column j, mask out position j and check for duplicates
  for (let j = 0; j < L; j++) {
    const seen = new Set<bigint>();
    for (let i = 0; i < n; i++) {
      // Remove contribution of position j
      const masked = (fullHash[i] - ((codes[i][j] * pow[j]) % MOD) + MOD) % MOD;
      if (seen.has(masked)) return true;
      seen.add(masked);
    }
  }
  return false;
}

/**
 * Solution 3: Set with wildcard strings
 * Time: O(n · L²) — build L wildcard variants per string
 * Space: O(n · L) — wildcard set
 */
function differByOneCharacterWildcard(dict: string[]): boolean {
  const seen = new Set<string>();
  for (const word of dict) {
    for (let j = 0; j < word.length; j++) {
      const masked = word.slice(0, j) + "*" + word.slice(j + 1);
      if (seen.has(masked)) return true;
      seen.add(masked);
    }
  }
  return false;
}

// === Test Cases ===
console.log(differByOneCharacter(["abcd", "acbd", "aacd"])); // true
console.log(differByOneCharacter(["ab", "cd", "yz"])); // false
console.log(differByOneCharacter(["abcd", "cccc", "abyd", "abct"])); // true
console.log(differByOneCharacter(["aa", "bb"])); // false

console.log(differByOneCharacterWildcard(["abcd", "acbd", "aacd"])); // true
console.log(differByOneCharacterBrute(["ab", "cd", "yz"])); // false
```

---

## 🔗 Related Problems

| Problem                                                                                                                    | Pattern                      | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------- |
| [Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences)                                             | Rolling Hash                 | Medium     |
| [Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring)                                   | Rolling Hash + Binary Search | Hard       |
| [Word Ladder](https://leetcode.com/problems/word-ladder)                                                                   | BFS + Wildcard matching      | Hard       |
| [Find Resultant Array After Removing Anagrams](https://leetcode.com/problems/find-resultant-array-after-removing-anagrams) | Hash                         | Easy       |
