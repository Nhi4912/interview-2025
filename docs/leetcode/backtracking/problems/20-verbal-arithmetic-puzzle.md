---
layout: page
title: "Verbal Arithmetic Puzzle"
difficulty: Hard
category: Backtracking
tags: [Array, Math, String, Backtracking]
leetcode_url: "https://leetcode.com/problems/verbal-arithmetic-puzzle"
---

# Verbal Arithmetic Puzzle / Câu Đố Số Học Bằng Chữ

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Sudoku Solver](https://leetcode.com/problems/sudoku-solver) | [Cryptarithmetic](https://en.wikipedia.org/wiki/Verbal_arithmetic)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống SEND + MORE = MONEY — mỗi chữ cái là một chữ số (0-9, không trùng nhau). Thay vì brute-force 10! hoán vị, dùng **column-wise backtracking**: xét từng cột (từ phải sang trái) và kiểm tra carry ngay lập tức để prune sớm.

**Pattern Recognition:**

- Assign digits to letters → backtracking on unique letters
- Key pruning: check column constraint incrementally using carry

```
  SEND          S=9,E=5,N=6,D=7
+ MORE    →   + M=1,O=0,R=8
------          ------
 MONEY          M=1,O=0,N=6,E=5,Y=2

Column by column (right to left):
col0: D+E = Y + 10*carry1  →  7+5=12, Y=2, carry=1
col1: N+R+1 = E + 10*carry2 → 6+8+1=15, E=5, carry=1
...
```

---

## Problem Description

Given `words` (list of strings) and `result` (string), determine if you can assign each letter a unique digit (0–9) such that `words[0] + words[1] + ... = result`. Leading zeros are **not** allowed (first letter of multi-char words ≠ 0).

**Example 1:**

```
Input: words=["SEND","MORE"], result="MONEY"
Output: true  (S=9,E=5,N=6,D=7,M=1,O=0,R=8,Y=2)
```

**Example 2:**

```
Input: words=["SIX","SEVEN","SEVEN"], result="TWENTY"
Output: true
```

**Constraints:** `2 ≤ words.length ≤ 5`, `1 ≤ words[i].length, result.length ≤ 7`, all capital letters

---

## 📝 Interview Tips

- 🇻🇳 **Column-wise** (không phải letter-wise): xét cột giúp prune sớm bằng carry
- 🇬🇧 Process **column by column** (right to left with carry) — column constraint prunes invalid assignments early
- 🇻🇳 **No leading zeros**: letters ở đầu từ nhiều ký tự không được nhận digit 0
- 🇬🇧 Mark first letters of words with length > 1 as "cannot be 0" before backtracking
- 🇻🇳 Thu thập tất cả unique letters, dùng index để backtrack digit-by-digit
- 🇬🇧 Collect unique letters, assign digits one at a time — check validity per column

---

## Solutions

### Solution 1: Column-wise Backtracking with Carry

```typescript
/**
 * Check if verbal arithmetic equation has a valid digit assignment
 * @param {string[]} words - addend words
 * @param {string} result - sum word
 * @returns {boolean}
 * Time: O(10! / (10-L)!) L = unique letters, with heavy pruning
 * Space: O(L) recursion depth
 */
function isSolvable(words: string[], result: string): boolean {
  const allWords = [...words, result];
  // Collect unique letters
  const lettersSet = new Set<string>();
  for (const w of allWords) for (const c of w) lettersSet.add(c);
  const letters = [...lettersSet];

  const charToDigit = new Map<string, number>();
  const digitUsed = new Array(10).fill(false);

  // Leading-zero forbidden set
  const noZero = new Set<string>();
  for (const w of allWords) if (w.length > 1) noZero.add(w[0]);

  // Build column coefficient: coeff[letter] = sum of place values (words positive, result negative)
  const coeff = new Map<string, number>();
  for (const letter of letters) coeff.set(letter, 0);
  for (const word of words) {
    let place = 1;
    for (let i = word.length - 1; i >= 0; i--, place *= 10)
      coeff.set(word[i], coeff.get(word[i])! + place);
  }
  let place = 1;
  for (let i = result.length - 1; i >= 0; i--, place *= 10)
    coeff.set(result[i], coeff.get(result[i])! - place);

  // Backtrack: assign digits to letters one by one, check sum = 0 at end
  function backtrack(idx: number, sum: number): boolean {
    if (idx === letters.length) return sum === 0;
    const ch = letters[idx];
    for (let d = 0; d <= 9; d++) {
      if (digitUsed[d]) continue;
      if (d === 0 && noZero.has(ch)) continue;
      digitUsed[d] = true;
      charToDigit.set(ch, d);
      if (backtrack(idx + 1, sum + coeff.get(ch)! * d)) return true;
      digitUsed[d] = false;
    }
    return false;
  }

  return backtrack(0, 0);
}

console.log(isSolvable(["SEND", "MORE"], "MONEY")); // true
console.log(isSolvable(["SIX", "SEVEN", "SEVEN"], "TWENTY")); // true
console.log(isSolvable(["THIS", "IS", "TOO"], "FUNNY")); // true
console.log(isSolvable(["LEET", "CODE"], "POINT")); // false
```

---

## 🔗 Related Problems

- [1307. Verbal Arithmetic Puzzle](https://leetcode.com/problems/verbal-arithmetic-puzzle) ← this
- [37. Sudoku Solver](https://leetcode.com/problems/sudoku-solver) — constraint satisfaction backtracking
- [17. Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number) — digit-to-letter mapping
- [1258. Synonymous Sentences](https://leetcode.com/problems/synonymous-sentences) — letter substitution
- [679. 24 Game](https://leetcode.com/problems/24-game) — exhaustive arithmetic search
