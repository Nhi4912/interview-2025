---
layout: page
title: "Count Pairs Of Similar Strings"
difficulty: Easy
category: String
tags: [Array, Hash Table, String, Bit Manipulation, Counting]
leetcode_url: "https://leetcode.com/problems/count-pairs-of-similar-strings"
---

# Count Pairs Of Similar Strings / Đếm Cặp Chuỗi Tương Tự

🟢 Easy

## 🧠 Intuition

> **Phép so sánh:** Giống nhận dạng khuôn mặt — hai người có cùng bộ tính năng (feature set) thì là một cặp. Mỗi chuỗi "tương tự" nếu có cùng tập ký tự (không kể thứ tự/số lần).

```
words = ["aba","aabb","abcd","bac","bbe"]
Signatures:
 "aba"  → {a,b}     → bitmask: 011 = 3
 "aabb" → {a,b}     → bitmask: 011 = 3  ← pair with "aba"
 "abcd" → {a,b,c,d} → bitmask: 1111
 "bac"  → {a,b,c}   → bitmask: 0111
 "bbe"  → {b,e}     → bitmask: 10010

Count: sig=3 appears 2 times → C(2,2)=1 pair → answer=1
```

## Problem Description

Given an array `words`, two strings are **similar** if they have the same set of characters (regardless of order or frequency). Return the number of pairs `(i, j)` where `i < j` and `words[i]` is similar to `words[j]`.

**Example 1:** `["aba","aabb","abcd","bac","bbe"]` → `2`

**Example 2:** `["aabb","ab","ba"]` → `3`

**Constraints:** `1 <= words.length <= 100`, `1 <= words[i].length <= 100`

## 📝 Interview Tips

- **Signature approach:** Encode each word as a canonical form (sorted unique chars or bitmask)
- **Bitmask trick:** 26-bit integer — bit `i` set if char `'a'+i` present — O(1) comparison
- **Count pairs:** If signature appears `k` times, it contributes `k*(k-1)/2` pairs
- **Hash map:** Map from signature → count; for each word increment and add current count before incrementing
- **Complexity:** O(n·m) time where m = word length, O(n) space for hash map
- **Interview insight:** Bitmask eliminates sorting cost — constant time signature computation

## Solutions

### Solution 1: Bitmask + Hash Map — O(n·m) time, O(n) space

```typescript
function similarPairs(words: string[]): number {
  const sigCount = new Map<number, number>();
  let pairs = 0;

  for (const word of words) {
    let mask = 0;
    for (const ch of word) {
      mask |= 1 << (ch.charCodeAt(0) - 97);
    }
    const prev = sigCount.get(mask) ?? 0;
    pairs += prev; // each existing same-sig word forms a new pair
    sigCount.set(mask, prev + 1);
  }

  return pairs;
}
```

### Solution 2: Sorted unique chars as key — O(n·m·log m) time, O(n) space

```typescript
function similarPairs(words: string[]): number {
  const sigCount = new Map<string, number>();
  let pairs = 0;

  for (const word of words) {
    const sig = [...new Set(word)].sort().join("");
    const prev = sigCount.get(sig) ?? 0;
    pairs += prev;
    sigCount.set(sig, prev + 1);
  }

  return pairs;
}
```

### Solution 3: Brute force O(n²·m) — for small n

```typescript
function similarPairs(words: string[]): number {
  function getSet(w: string): Set<string> {
    return new Set(w.split(""));
  }
  function setsEqual(a: Set<string>, b: Set<string>): boolean {
    if (a.size !== b.size) return false;
    for (const c of a) if (!b.has(c)) return false;
    return true;
  }

  let count = 0;
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      if (setsEqual(getSet(words[i]), getSet(words[j]))) count++;
    }
  }
  return count;
}
```

## 🔗 Related Problems

| #    | Problem                                  | Difficulty | Tags                |
| ---- | ---------------------------------------- | ---------- | ------------------- |
| 1684 | Count the Number of Consistent Strings   | Easy       | Bit Manipulation    |
| 49   | Group Anagrams                           | Medium     | Hash Table, Sorting |
| 242  | Valid Anagram                            | Easy       | Hash Table, String  |
| 2531 | Make Number of Distinct Characters Equal | Medium     | Greedy              |
