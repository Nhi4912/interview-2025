---
layout: page
title: "Last Substring in Lexicographical Order"
difficulty: Hard
category: String
tags: [Two Pointers, String]
leetcode_url: "https://leetcode.com/problems/last-substring-in-lexicographical-order"
---

# Last Substring in Lexicographical Order / Substring Lớn Nhất Theo Thứ Tự Từ Điển

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Find the Index of the First Occurrence in a String](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string) | [String Compression](https://leetcode.com/problems/string-compression)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống thi đua xem ai chạy đến đích nhanh hơn — hai người xuất phát từ hai vị trí khác nhau trong chuỗi, so sánh từng bước. Người nào "thắng" ở bước hiện tại sẽ là ứng viên cho suffix lớn nhất.

**Pattern Recognition:**

- Signal: "lexicographically largest suffix" + "two candidates" → **Two Pointers**
- Key insight: Maintain two pointers `i`, `j` (candidates) and offset `k`. Compare `s[i+k]` vs `s[j+k]`:
  - If equal: advance `k`
  - If `s[j+k] > s[i+k]`: update `i = max(i+k+1, j+1)`, reset `k=0`
  - If `s[i+k] > s[j+k]`: update `j = j+k+1`, reset `k=0`
- Answer is always `s.substring(min(i,j))`.

**Visual:**

```
s = "abab"
    0123

i=0, j=1, k=0: s[0]='a' == s[1]='b'? No, 'b'>'a' → j wins
  i = max(0+0+1, 1+1) = max(1,2) = 2, k=0

i=2, j=? (j=1 < i=2, done)

Actually j must always > i. Let's redo:
i=0, j=1:
  k=0: s[0]='a' vs s[1]='b' → 'b'>'a' → i=max(1,2)=2, k=0
i=2, j must be > i, j=2? No j starts fresh:
Actually algorithm: j goes from i+1 forward. Once i≥j, stop.

Simpler trace for "cacacb":
i=0, j=1, k=0: 'c' vs 'a' → i wins, j=j+0+1=1? No: j=1+0+1=2
i=0, j=2, k=0: 'c' vs 'c' → equal, k=1
  k=1: 'a' vs 'a' → equal, k=2
  k=2: 'c' vs 'c' → equal, k=3
  k=3: 'a' vs 'b' → 'b'>'a' → i=max(0+3+1,2+1)=max(4,3)=4, k=0
i=4, j=5, k=0: 'c' vs 'b' → i wins, j=5+0+1=6≥n → stop
Answer: s[4..] = "cb" ✓
```

---

## Problem Description

Given a string `s`, return the **last** substring of `s` in lexicographical order. This is equivalent to finding the suffix of `s` that is lexicographically largest. ([LeetCode](https://leetcode.com/problems/last-substring-in-lexicographical-order))

Difficulty: Hard | Acceptance: ~37%

```
Example 1: s = "abab" → "bab"
  Suffixes: "abab","bab","ab","b" → largest = "bab"

Example 2: s = "leetcode" → "tcode"
  Suffixes sorted: "code" < "de" < "e" < "ecode" < "leetcode" < "tcode" < ...
  Largest = "tcode"
```

Constraints:

- `1 <= s.length <= 4 * 10^5`
- `s` consists of lowercase English letters

---

## 📝 Interview Tips

1. **Clarify**: "Substring vs Subsequence? Đây là substring liên tiếp" / Consecutive substring (suffix), not subsequence.
2. **Naive approach**: "Sort all O(n²) suffixes — TLE cho n=4×10^5" / Sorting suffixes is O(n² log n) due to string comparison.
3. **Two pointers**: "Duy trì 2 ứng viên i,j và offset k — O(n) amortized" / Two pointers with offset is O(n).
4. **Key rule**: "Khi s[i+k] < s[j+k]: i không thể thắng với bất kỳ extension nào → skip forward" / When j wins, advance i past i+k.
5. **Termination**: "Loop kết thúc khi j ≥ n" / Loop ends when j reaches end of string.
6. **Answer**: "Kết quả luôn là suffix bắt đầu từ i (hoặc j nếu j<i)" / Return s.substring(i) (i ≤ j always at end).

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Sort all suffixes
 * Time: O(n² log n) — sorting with O(n) string comparisons
 * Space: O(n) — store suffixes
 * TLE for n=4×10^5 but good to start
 */
function lastSubstringBrute(s: string): string {
  const n = s.length;
  let best = "";
  for (let i = 0; i < n; i++) {
    const suffix = s.substring(i);
    if (suffix > best) best = suffix;
  }
  return best;
}

/**
 * Solution 2: Two Pointers — O(n)
 * Time: O(n) — each position advanced at most O(n) total across all iterations
 * Space: O(1)
 *
 * Maintain:
 *   i = current best candidate suffix start
 *   j = challenger suffix start (always j > i)
 *   k = current comparison offset (how far ahead we've matched)
 *
 * Compare s[i+k] vs s[j+k]:
 *   Equal → k++ (extend comparison)
 *   s[i+k] < s[j+k] → j wins; advance i to max(i+k+1, j+1), reset k=0
 *   s[i+k] > s[j+k] → i wins; advance j to j+k+1, reset k=0
 */
function lastSubstring(s: string): string {
  const n = s.length;
  let i = 0; // best candidate
  let j = 1; // challenger
  let k = 0; // current offset

  while (j + k < n) {
    if (s[i + k] === s[j + k]) {
      k++;
    } else if (s[i + k] < s[j + k]) {
      // j+k wins: advance i past i+k
      i = Math.max(i + k + 1, j + 1);
      k = 0;
    } else {
      // i+k wins: advance j past j+k
      j = j + k + 1;
      k = 0;
    }

    // Ensure j > i
    if (j <= i) {
      j = i + 1;
      k = 0;
    }
  }

  return s.substring(i);
}

/**
 * Solution 3: Two pointers (cleaner variant)
 * Time: O(n), Space: O(1)
 */
function lastSubstringV2(s: string): string {
  const n = s.length;
  let i = 0,
    j = 1,
    k = 0;

  while (j < n) {
    // Compare character at offset k
    const ci = i + k < n ? s[i + k] : "";
    const cj = j + k < n ? s[j + k] : "";

    if (ci === cj) {
      k++;
    } else if (ci < cj) {
      i = i + k + 1;
      if (i >= j) i = j++; // ensure i < j
      k = 0;
    } else {
      j = j + k + 1;
      k = 0;
    }
  }

  return s.substring(i);
}

// === Test Cases ===
console.log(lastSubstring("abab")); // "bab"
console.log(lastSubstring("leetcode")); // "tcode"
console.log(lastSubstring("a")); // "a"
console.log(lastSubstring("zz")); // "zz"
console.log(lastSubstring("cacacb")); // "cb"
console.log(lastSubstring("aabaa")); // "baa"? No: suffixes "aabaa","abaa","baa","aa","a" → "baa" ✓

console.log(lastSubstringBrute("abab")); // "bab"
console.log(lastSubstringBrute("leetcode")); // "tcode"
console.log(lastSubstringV2("abab")); // "bab"
```

---

## 🔗 Related Problems

| Problem                                                                            | Pattern                     | Difficulty |
| ---------------------------------------------------------------------------------- | --------------------------- | ---------- |
| [Largest Number](https://leetcode.com/problems/largest-number)                     | Greedy + Custom Sort        | Medium     |
| [Lexicographically Smallest Rotation](https://leetcode.com/problems/orderly-queue) | Two Pointers / Suffix Array | Hard       |
| [String Compression](https://leetcode.com/problems/string-compression)             | Two Pointers                | Medium     |
| [Compare Version Numbers](https://leetcode.com/problems/compare-version-numbers)   | String Comparison           | Medium     |
