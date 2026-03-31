---
layout: page
title: "Number of Valid Words for Each Puzzle"
difficulty: Hard
category: String
tags: [Array, Hash Table, String, Bit Manipulation, Trie]
leetcode_url: "https://leetcode.com/problems/number-of-valid-words-for-each-puzzle"
---

# Number of Valid Words for Each Puzzle / Số Từ Hợp Lệ Cho Mỗi Câu Đố

**Difficulty:** 🔴 Hard | **Tags:** Array, Hash Table, String, Bit Manipulation, Trie

---

## 🧠 Intuition / Trực Giác

Một từ **hợp lệ** cho puzzle nếu: (1) chứa ký tự đầu của puzzle, (2) mọi ký tự của từ đều có trong puzzle.

```
words   = ["aaaa","asas","able","ability","actt","actor","access"]
puzzles = ["aboveyz","abrodyz","abslute","bezpqrxy","cfxzpgsl","f"]

Bitmask encode:
  word "aaaa"  → 000...0001  (only 'a')
  word "actt"  → 000...10101 ('a','c','t')
  puzzle "aboveyz" → first='a', mask=...

Word is valid for puzzle iff:
  (wordMask & puzzleMask) == wordMask   ← all word chars in puzzle
  AND wordMask & firstBit != 0          ← first letter present

Key: only words with ≤ 7 unique letters can be valid (puzzle has 7 chars)
→ enumerate all 2^6 = 64 subsets of puzzle that include first letter
```

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Bitmask word trước**: hash 100k+ words → Map<mask, count> — O(words × L)
- 🇺🇸 **Pre-hash words**: reduce words to Map<mask, count> once upfront
- 🇻🇳 **Duyệt subset của puzzle**: 2^6 = 64 subset có chứa first letter → rất nhanh
- 🇺🇸 **Enumerate puzzle subsets**: 2^6 = 64 subsets including first letter — very fast
- 🇻🇳 **Tại sao 64 không phải 128?**: buộc first letter phải có mặt → giảm một nửa
- 🇺🇸 **Why 64 not 128**: first letter is mandatory → halves the subset space
- 🇻🇳 **Subset enumeration**: `sub = (sub - 1) & puzzleMask` duyệt mọi subset
- 🇺🇸 **Subset trick**: `sub = (sub - 1) & puzzleMask` enumerates all subsets efficiently
- 🇻🇳 **Không cần Trie**: bitmask hiệu quả hơn cho bài này
- 🇺🇸 **Trie not needed**: bitmask + subset enumeration beats trie here
- 🇻🇳 **Complexity**: O(words×L + puzzles×2^7) — tuyến tính thực tế
- 🇺🇸 **Complexity**: O(words×L + puzzles×128) — effectively linear

---

## 💻 Solutions

### Solution 1 — Bitmask + Subset Enumeration (Recommended)

```typescript
/**
 * Hash word masks, then enumerate each puzzle's subsets.
 * Time: O(W×L + P×2^7)  Space: O(W)
 */
function findNumOfValidWords(words: string[], puzzles: string[]): number[] {
  // Build frequency map of word bitmasks
  const freq = new Map<number, number>();
  for (const word of words) {
    let mask = 0;
    for (const c of word) mask |= 1 << (c.charCodeAt(0) - 97);
    freq.set(mask, (freq.get(mask) ?? 0) + 1);
  }

  const result: number[] = [];

  for (const puzzle of puzzles) {
    let puzzleMask = 0;
    for (const c of puzzle) puzzleMask |= 1 << (c.charCodeAt(0) - 97);
    const firstBit = 1 << (puzzle.charCodeAt(0) - 97);

    let count = 0;
    // Enumerate all subsets of puzzleMask
    let sub = puzzleMask;
    while (sub > 0) {
      if (sub & firstBit) {
        // must contain first letter
        count += freq.get(sub) ?? 0;
      }
      sub = (sub - 1) & puzzleMask; // next subset
    }

    result.push(count);
  }

  return result;
}

const words = ["aaaa", "asas", "able", "ability", "actt", "actor", "access"];
const puzzles = ["aboveyz", "abrodyz", "abslute", "bezpqrxy", "cfxzpgsl", "f"];
console.log(findNumOfValidWords(words, puzzles)); // [1,1,3,2,4,0]
```

### Solution 2 — Naive O(W×P) for small inputs

```typescript
/**
 * Direct check: word mask subset of puzzle mask + has first letter.
 * Time: O(W×P×L)  Space: O(W)
 * Only feasible for small W×P — good for understanding correctness.
 */
function findNumOfValidWords2(words: string[], puzzles: string[]): number[] {
  const wordMasks = words.map((w) => {
    let m = 0;
    for (const c of w) m |= 1 << (c.charCodeAt(0) - 97);
    return m;
  });

  return puzzles.map((puzzle) => {
    let puzzleMask = 0;
    for (const c of puzzle) puzzleMask |= 1 << (c.charCodeAt(0) - 97);
    const firstBit = 1 << (puzzle.charCodeAt(0) - 97);

    return wordMasks.filter(
      (wm) =>
        (wm & firstBit) !== 0 && // contains first letter
        (wm & puzzleMask) === wm, // all chars in puzzle
    ).length;
  });
}

console.log(findNumOfValidWords2(words, puzzles)); // [1,1,3,2,4,0]
```

### Solution 3 — Trie-based (conceptual, for interview discussion)

```typescript
/**
 * Build a Trie over words' sorted unique char sets; query each puzzle.
 * Shown for completeness; bitmask approach is faster in practice.
 * Time: O(W×L + P×7×2^7)  Space: O(W×L)
 */
function findNumOfValidWords3(words: string[], puzzles: string[]): number[] {
  // Build trie where each node stores count of words ending here
  type Trie = { children: Map<number, Trie>; count: number };
  const mkNode = (): Trie => ({ children: new Map(), count: 0 });
  const root = mkNode();

  for (const word of words) {
    // Insert sorted unique bits as path
    const bits: number[] = [];
    let mask = 0;
    for (const c of word) mask |= 1 << (c.charCodeAt(0) - 97);
    for (let b = 0; b < 26; b++) if (mask & (1 << b)) bits.push(b);

    let node = root;
    for (const b of bits) {
      if (!node.children.has(b)) node.children.set(b, mkNode());
      node = node.children.get(b)!;
    }
    node.count++;
  }

  // DFS to enumerate subsets of puzzle bits that include firstBit
  function dfs(
    node: Trie,
    bits: number[],
    idx: number,
    firstBit: number,
    hasFirst: boolean,
  ): number {
    if (hasFirst && idx === bits.length) return node.count;
    if (idx === bits.length) return 0;
    let total = 0;
    // Skip current bit
    total += dfs(node, bits, idx + 1, firstBit, hasFirst);
    // Take current bit
    if (node.children.has(bits[idx])) {
      total += dfs(
        node.children.get(bits[idx])!,
        bits,
        idx + 1,
        firstBit,
        hasFirst || bits[idx] === firstBit,
      );
    }
    return total;
  }

  return puzzles.map((puzzle) => {
    const firstBit = puzzle.charCodeAt(0) - 97;
    const bits: number[] = [];
    let mask = 0;
    for (const c of puzzle) mask |= 1 << (c.charCodeAt(0) - 97);
    for (let b = 0; b < 26; b++) if (mask & (1 << b)) bits.push(b);
    return dfs(root, bits, 0, firstBit, false);
  });
}

console.log(findNumOfValidWords3(words, puzzles)); // [1,1,3,2,4,0]
```

---

## 🔗 Related Problems

| Problem                                                                                                         | Difficulty | Pattern            |
| --------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Word Filter](https://leetcode.com/problems/prefix-and-suffix-search/)                                          | 🔴 Hard    | Trie               |
| [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) | 🟡 Medium  | Bitmask / Trie     |
| [Subsets](https://leetcode.com/problems/subsets/)                                                               | 🟡 Medium  | Subset enumeration |
