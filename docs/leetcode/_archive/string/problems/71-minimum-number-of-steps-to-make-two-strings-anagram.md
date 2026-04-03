---
layout: page
title: "Minimum Number of Steps to Make Two Strings Anagram"
difficulty: Medium
category: String
tags: [Hash Table, String, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram"
---

# Minimum Number of Steps to Make Two Strings Anagram / Số Bước Tối Thiểu Để Tạo Anagram

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Hash Map
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Giống cân bằng kho — `s` và `t` có cùng độ dài, nhưng số lượng từng ký tự khác nhau. Mỗi "bước" thay một ký tự trong `t`. Số bước = tổng số ký tự `t` dư thừa so với `s`.

**Pattern Recognition:**

- Đếm freq của cả hai → tính sự chênh lệch → sum của phần dư
- `steps = Σ max(0, freq_t[c] - freq_s[c])` cho mọi ký tự c
- Equivalently: `steps = Σ |freq_s[c] - freq_t[c]| / 2` (mỗi swap giải quyết 2 chênh lệch)

```
s = "bab"   t = "aba"

freq_s: a→1, b→2
freq_t: a→2, b→1

diff per char:
  a: t has 2, s has 1 → t surplus = 1 → need to replace 1 'a' in t
  b: t has 1, s has 2 → t deficit = 1 (will be replaced by 'b')

steps = 1 ✅

Alternative: Σ|diff|/2 = (1+1)/2 = 1 ✅
```

---

## Problem Description

Given two strings `s` and `t` of equal length, in one step you can choose any character in `t` and replace it with any other character. Return the minimum number of steps to make `t` an anagram of `s`.

**Examples:**

- `s = "bab", t = "aba"` → `1`
- `s = "leetcode", t = "practice"` → `5`
- `s = "anagram", t = "mangaar"` → `0` (already anagram)

**Constraints:** `1 ≤ s.length ≤ 5 × 10^4`, `s.length == t.length`, lowercase letters only

---

## 📝 Interview Tips

- 🇻🇳 `t` cần có thêm những ký tự nào so với `s`? → đếm phần dư của `t`
- 🇺🇸 Count `freq_s - freq_t`: negative = t needs more of that char (swap target)
- 🇻🇳 `steps = Σ max(0, freq_t[c] - freq_s[c])` = số ký tự thừa trong t
- 🇺🇸 Symmetry: sum of surpluses == sum of deficits (both equal the answer)
- 🇻🇳 Có thể dùng single array[26] thay vì 2 maps để tiết kiệm space
- 🇺🇸 Follow-up: minimum swaps (not replacements) — different problem entirely

---

## Solutions

### Solution 1 — Two Frequency Maps

```typescript
/**
 * Count freq of s and t separately, compute surplus in t
 * Time: O(n) — two passes
 * Space: O(1) — at most 26 keys
 */
function minStepsTwoMaps(s: string, t: string): number {
  const freqS = new Map<string, number>();
  const freqT = new Map<string, number>();

  for (const c of s) freqS.set(c, (freqS.get(c) ?? 0) + 1);
  for (const c of t) freqT.set(c, (freqT.get(c) ?? 0) + 1);

  let steps = 0;
  for (const [c, cnt] of freqT) {
    const need = freqS.get(c) ?? 0;
    steps += Math.max(0, cnt - need); // t has more of c than s needs
  }
  return steps;
}
```

### Solution 2 — Single Difference Array (Optimal)

```typescript
/**
 * Single array: +1 for s, -1 for t. Sum of positives = steps.
 * Time: O(n), Space: O(1) — array of 26
 */
function minSteps(s: string, t: string): number {
  const diff = new Array(26).fill(0);
  const a = "a".charCodeAt(0);

  for (const c of s) diff[c.charCodeAt(0) - a]++;
  for (const c of t) diff[c.charCodeAt(0) - a]--;

  // Positive values = chars s has more than t → t needs replacements
  let steps = 0;
  for (const d of diff) {
    if (d > 0) steps += d;
  }
  return steps;
}

// Test cases
console.log(minSteps("bab", "aba")); // 1
console.log(minSteps("leetcode", "practice")); // 5
console.log(minSteps("anagram", "mangaar")); // 0
console.log(minSteps("friend", "family")); // 4
```

---

## 🔗 Related Problems

- [242 - Valid Anagram](https://leetcode.com/problems/valid-anagram/) — check if freq maps equal
- [383 - Ransom Note](https://leetcode.com/problems/ransom-note/) — check if one covers another
- [49 - Group Anagrams](https://leetcode.com/problems/group-anagrams/) — group by sorted key
- [2186 - Minimum Number of Steps to Make Two Strings Anagram II](https://leetcode.com/problems/minimum-number-of-steps-to-make-two-strings-anagram-ii/) — unequal lengths variant
