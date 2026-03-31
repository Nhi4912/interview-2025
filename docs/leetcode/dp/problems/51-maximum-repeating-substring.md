---
layout: page
title: "Maximum Repeating Substring"
difficulty: Easy
category: Dynamic Programming
tags: [String, Dynamic Programming, String Matching]
leetcode_url: "https://leetcode.com/problems/maximum-repeating-substring"
---

# Maximum Repeating Substring / Chuỗi Lặp Lại Tối Đa

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Dynamic Programming (Linear DP)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern) | [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Như đếm xem câu "xin chào" được lặp lại liên tiếp bao nhiêu lần trong một bài diễn văn dài. Thay vì ghép từng lần và kiểm tra, ta dùng DP: mỗi vị trí lưu số lần lặp tối đa kết thúc tại đó.

**Pattern Recognition:**

- Signal: "maximum k such that word^k is substring" → **Linear DP on string indices**
- dp[i] = số lần `word` có thể được lặp liên tiếp, kết thúc tại vị trí `i` trong `sequence`
- Key insight: nếu `sequence[i-m..i] == word` và `dp[i-m] = k` thì `dp[i] = k+1`

**Visual — sequence = "ababc", word = "ab":**

```
i:        0  1  2  3  4  5
sequence: a  b  a  b  c
dp:       0  0  1  0  2  0

i=2: seq[0..2)=="ab" && dp[0]=0 → dp[2] = 0+1 = 1
i=4: seq[2..4)=="ab" && dp[2]=1 → dp[4] = 1+1 = 2
Answer: max(dp) = 2
```

---

## Problem Description

Given strings `sequence` and `word`, return the maximum value `k` such that `word` repeated `k` times is a substring of `sequence`.

- Example 1: `sequence = "ababc"`, `word = "ab"` → `2` (`"abab"` is a substring)
- Example 2: `sequence = "ababc"`, `word = "ba"` → `1` (`"ba"` is a substring, `"baba"` is not)
- Example 3: `sequence = "ababc"`, `word = "ac"` → `0`

Constraints: `1 <= sequence.length <= 100`, `1 <= word.length <= 100`, both lowercase English letters

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "word lặp liên tiếp hay không liên tiếp?" / Must be contiguous repetitions in sequence
2. **Brute force**: Ghép `word` từng lần, kiểm tra `includes()` — O(n²/m) time
3. **DP approach**: `dp[i]` = max k với `word^k` kết thúc tại `i` → O(n·m) time, O(n) space
4. **Transition**: `dp[i] = dp[i-m] + 1` nếu `sequence[i-m..i] === word`, else `0`
5. **Space**: Chỉ cần mảng `dp` độ dài `n+1`, không cần bảng 2D
6. **Edge case**: `word.length > sequence.length` → return `0` immediately

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Grow and Check
 * Time: O(n² / m) — each includes() call is O(n), done n/m times
 * Space: O(n) — string concatenation
 */
function maximumRepeatingBrute(sequence: string, word: string): number {
  let k = 0;
  let repeated = word;
  while (sequence.includes(repeated)) {
    k++;
    repeated += word;
  }
  return k;
}

/**
 * Solution 2: Dynamic Programming (Optimal)
 * Time: O(n·m) — outer loop n, inner slice comparison O(m)
 * Space: O(n) — dp array of length n+1
 */
function maximumRepeating(sequence: string, word: string): number {
  const n = sequence.length;
  const m = word.length;
  // dp[i] = max times word repeats consecutively ending exactly at index i
  const dp = new Array(n + 1).fill(0);

  for (let i = m; i <= n; i++) {
    if (sequence.slice(i - m, i) === word) {
      dp[i] = dp[i - m] + 1;
    }
  }

  return Math.max(...dp);
}

// === Test Cases ===
console.log(maximumRepeating("ababc", "ab")); // 2
console.log(maximumRepeating("ababc", "ba")); // 1
console.log(maximumRepeating("ababc", "ac")); // 0
console.log(maximumRepeating("aaa", "a")); // 3
```

---

## 🔗 Related Problems

- [Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern) — detect if string is made of repeated pattern
- [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) — KMP substring search foundation
- [String Transformation](https://leetcode.com/problems/string-transformation) — harder string DP with KMP
- [Maximum Deletions on a String](https://leetcode.com/problems/maximum-deletions-on-a-string) — DP on string indices with matching
- [Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix) — KMP failure function pattern
