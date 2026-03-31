---
layout: page
title: "Is Subsequence"
difficulty: Easy
category: Dynamic Programming
tags: [Two Pointers, String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/is-subsequence"
---

# Is Subsequence / Kiểm Tra Chuỗi Con Theo Thứ Tự

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Two Pointers / DP
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence) | [Longest String Chain](https://leetcode.com/problems/longest-string-chain)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn cầm hai bản nhạc — bản ngắn `s` và bản dài `t`. Dùng tay trái dò từng nốt trong `s`, tay phải quét qua `t`. Mỗi khi khớp nốt, tiến cả hai tay. Kết thúc khi tay trái hết nốt (thành công) hoặc tay phải hết trước (thất bại).

**Pattern:** Two pointers — O(n+m). Follow-up với nhiều chuỗi `s`: dùng DP + binary search trên từng ký tự.

```
s = "ace",  t = "abcde"
si=0        ti=0
 a  ↔  a  ✅ → si++, ti++
 c  ↔  b  ❌ → ti++ only
 c  ↔  c  ✅ → si++, ti++
 e  ↔  d  ❌ → ti++ only
 e  ↔  e  ✅ → si++ → si == s.length → return true ✅
```

---

Cho chuỗi `s` và `t`, trả về `true` nếu `s` là **subsequence** của `t`. Subsequence là dãy ký tự xuất hiện theo **thứ tự** trong chuỗi gốc nhưng không nhất thiết liên tiếp.

- `s = "ace", t = "abcde"` → `true` (khớp a→a, c→c, e→e)
- `s = "aec", t = "abcde"` → `false` (sau c không còn e theo thứ tự)

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Two pointers là đủ** cho bài cơ bản — O(n+m), không cần DP
- 🇺🇸 **Key insight**: only advance `si` when characters match; always advance `ti`
- 🇻🇳 **Follow-up (nhiều s)**: precompute cho mỗi vị trí trong t — vị trí tiếp theo của từng ký tự là đâu
- 🇺🇸 **DP follow-up**: `positions[c]` = sorted list of indices where char `c` appears in t → binary search
- 🇻🇳 **Edge cases**: `s` rỗng → luôn `true`; `t` rỗng và `s` không rỗng → `false`
- 🇺🇸 **Early exit**: if `s.length > t.length`, immediately return false

---

## Solutions

### Solution 1: Two Pointers — O(n+m) time, O(1) space ✅ Optimal

```typescript
/**
 * Scan t with two pointers: advance si only when characters match
 * Time: O(n + m) | Space: O(1)
 */
function isSubsequence(s: string, t: string): boolean {
  if (s.length === 0) return true;
  if (s.length > t.length) return false;

  let si = 0;

  for (let ti = 0; ti < t.length; ti++) {
    if (t[ti] === s[si]) {
      si++;
      if (si === s.length) return true; // all of s matched
    }
  }

  return false; // exhausted t without matching all of s
}

// Tests
console.log(isSubsequence("ace", "abcde")); // true
console.log(isSubsequence("aec", "abcde")); // false
console.log(isSubsequence("", "ahbgdc")); // true
console.log(isSubsequence("b", "abc")); // true
console.log(isSubsequence("axc", "ahbgdc")); // false
```

### Solution 2: DP Follow-up — O(26·m) build, O(n·log m) per query

```typescript
/**
 * Follow-up: precompute next occurrence of each char in t for fast multi-query
 * For each char, store sorted indices in t → binary search to find next position
 * Time build: O(m) | Space: O(26 * m) | Query: O(n * log m)
 */
function buildCharIndex(t: string): Map<string, number[]> {
  const positions = new Map<string, number[]>();
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (!positions.has(c)) positions.set(c, []);
    positions.get(c)!.push(i);
  }
  return positions;
}

function isSubsequenceDP(s: string, positions: Map<string, number[]>): boolean {
  let pos = 0; // must find next match at index >= pos in t

  for (const c of s) {
    const indices = positions.get(c);
    if (!indices) return false;

    // Binary search: first index in indices that is >= pos
    let lo = 0,
      hi = indices.length - 1,
      found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (indices[mid] >= pos) {
        found = indices[mid];
        hi = mid - 1;
      } else lo = mid + 1;
    }

    if (found === -1) return false;
    pos = found + 1; // next match must come strictly after this position
  }

  return true;
}

// Build index once, reuse for many s strings
const t = "abcde";
const idx = buildCharIndex(t);
console.log(isSubsequenceDP("ace", idx)); // true
console.log(isSubsequenceDP("aec", idx)); // false
console.log(isSubsequenceDP("", idx)); // true
console.log(isSubsequenceDP("b", idx)); // true
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                          | Difficulty | Pattern           |
| ------------------------------------------------------------------------------------------------ | ---------- | ----------------- |
| [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence)           | 🟡 Medium  | 2D DP             |
| [Longest String Chain](https://leetcode.com/problems/longest-string-chain)                       | 🟡 Medium  | DP + Sort         |
| [Number of Matching Subsequences](https://leetcode.com/problems/number-of-matching-subsequences) | 🟡 Medium  | Follow-up pattern |
