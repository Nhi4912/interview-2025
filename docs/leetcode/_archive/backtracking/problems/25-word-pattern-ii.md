---
layout: page
title: "Word Pattern II"
difficulty: Medium
category: Backtracking
tags: [Hash Table, String, Backtracking]
leetcode_url: "https://leetcode.com/problems/word-pattern-ii"
---

# Word Pattern II / Mẫu Từ II

> **Track**: Shared | **Difficulty**: 🟡 Medium (Hard in interviews) | **Pattern**: Backtracking + Bijective Mapping
> **Frequency**: 📘 Tier 3 — Gặp ở 1 company
> **See also**: [Word Pattern](https://leetcode.com/problems/word-pattern) | [Word Break II](https://leetcode.com/problems/word-break-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống giải mã mật mã — mỗi chữ cái trong pattern ánh xạ 1-1 đến một "từ" trong chuỗi s. Thử gán từng substring của s cho chữ cái hiện tại, kiểm tra tính nhất quán (bijection).

**Pattern Recognition:**

- Signal: "match pattern to string without spaces, bijective mapping" → **Backtracking**
- Cần kiểm tra cả hai chiều: `char → word` VÀ `word → char` (bijection)
- Key insight: try every possible word length for current pattern char

**Visual — Pattern "aab", string "catcatdog":**

```
pattern[0]='a', try s[0..2]="cat" → map a→"cat"
  pattern[1]='a', must match "cat" → s[3..5]="cat" ✓
    pattern[2]='b', try s[6..8]="dog" → map b→"dog"
      Done! full match ✓ return true

Bijection check:
  charToWord: {a: "cat", b: "dog"}
  wordToChar: {"cat": 'a', "dog": 'b'}
```

---

## Problem Description

Given a `pattern` string and a string `s` (no spaces), return `true` if `s` follows the same **bijective** mapping as `pattern`. Each character maps to a non-empty substring; no two characters map to the same substring. ([LeetCode 291](https://leetcode.com/problems/word-pattern-ii))

**Example 1:** `pattern = "aab"`, `s = "catcatdog"` → `true`
**Example 2:** `pattern = "aab"`, `s = "catcatcat"` → `false` (b must differ from a)

Constraints: `1 <= pattern.length <= 20`, `1 <= s.length <= 50`

---

## 📝 Interview Tips

1. **Clarify**: "Mapping phải bijective không? Hai char có thể map cùng word không?" / Must be bijective — one-to-one
2. **Two maps**: "Cần cả charToWord lẫn wordToChar để tránh 'a'→'cat', 'b'→'cat'" / Track both directions
3. **Substring loop**: "Thử s[si..si+len] cho mọi len từ 1 đến remaining" / Try all valid lengths
4. **Pruning**: "Nếu remaining chars > remaining string → prune" / Characters left > string left → impossible
5. **Complexity**: "O(n^m) worst case, m = pattern length, n = string length" / Exponential but small input

---

## Solutions

```typescript
/**
 * Solution 1: Backtracking with bijective map
 * Time: O(n^m) — n=s.length, m=pattern.length; pruning helps greatly
 * Space: O(m + k) — k distinct chars, recursion depth = m
 */
function wordPatternMatch(pattern: string, s: string): boolean {
  const charToWord = new Map<string, string>();
  const wordToChar = new Map<string, string>();

  function backtrack(pi: number, si: number): boolean {
    if (pi === pattern.length && si === s.length) return true;
    if (pi === pattern.length || si === s.length) return false;

    const ch = pattern[pi];
    const remaining = pattern.length - pi; // at least 'remaining' chars needed

    if (charToWord.has(ch)) {
      // Already mapped — must match exactly
      const word = charToWord.get(ch)!;
      if (!s.startsWith(word, si)) return false;
      return backtrack(pi + 1, si + word.length);
    }

    // Try every possible word length for ch
    for (let len = 1; len <= s.length - si - (remaining - 1); len++) {
      const word = s.slice(si, si + len);
      if (wordToChar.has(word)) continue; // word already taken by another char

      charToWord.set(ch, word);
      wordToChar.set(word, ch);
      if (backtrack(pi + 1, si + len)) return true;
      charToWord.delete(ch);
      wordToChar.delete(word);
    }

    return false;
  }

  return backtrack(0, 0);
}

/**
 * Solution 2: Same approach, slightly different iteration structure
 * Time: O(n^m) — identical complexity
 * Space: O(m) — recursion depth bounded by pattern length
 */
function wordPatternMatchV2(pattern: string, s: string): boolean {
  const p2w: Record<string, string> = {};
  const w2p: Record<string, string> = {};

  function dfs(pi: number, si: number): boolean {
    if (pi === pattern.length) return si === s.length;
    const ch = pattern[pi];
    const charsLeft = pattern.length - pi;

    if (p2w[ch]) {
      const w = p2w[ch];
      return s.substr(si, w.length) === w && dfs(pi + 1, si + w.length);
    }

    for (let end = si + 1; end <= s.length - charsLeft + 1; end++) {
      const w = s.slice(si, end);
      if (w2p[w] && w2p[w] !== ch) continue;

      p2w[ch] = w;
      w2p[w] = ch;
      if (dfs(pi + 1, end)) return true;
      delete p2w[ch];
      delete w2p[w];
    }
    return false;
  }

  return dfs(0, 0);
}

// === Test Cases ===
console.log(wordPatternMatch("aab", "catcatdog")); // true
console.log(wordPatternMatch("aab", "catcatcat")); // false
console.log(wordPatternMatch("ab", "aa")); // false (bijection: both can't map to "a")
console.log(wordPatternMatch("aba", "catdogcat")); // true
console.log(wordPatternMatchV2("aab", "catcatdog")); // true
```

---

## 🔗 Related Problems

- [Word Pattern](https://leetcode.com/problems/word-pattern) — easier version (words pre-split)
- [Word Break II](https://leetcode.com/problems/word-break-ii) — backtracking on string segmentation
- [Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching) — pattern matching DP
- [Isomorphic Strings](https://leetcode.com/problems/isomorphic-strings) — bijective char mapping (simpler)
- [Word Pattern II — LeetCode](https://leetcode.com/problems/word-pattern-ii) — problem page
