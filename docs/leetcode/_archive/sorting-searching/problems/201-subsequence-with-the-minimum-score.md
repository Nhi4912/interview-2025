---
layout: page
title: "Subsequence With the Minimum Score"
difficulty: Hard
category: Sorting-Searching
tags: [Two Pointers, String, Binary Search]
leetcode_url: "https://leetcode.com/problems/subsequence-with-the-minimum-score"
---

# Subsequence With the Minimum Score / Dãy Con Với Điểm Tối Thiểu

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Hình ảnh:** String `t` cần trở thành subsequence của `s`. Bạn có thể **xóa một đoạn liên tiếp** `t[i..j]` (score = j-i+1). Muốn xóa ít nhất. Trick: Tính prefix match từ trái và suffix match từ phải, rồi binary search vào giữa.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Subsequence With the Minimum Score example:**

```
s = "abacaba",  t = "bzb"

prefix[i] = how many chars of t matched from LEFT using s[0..i]
suffix[i] = how many chars of t matched from RIGHT using s[i..n-1]

prefix: [0,0,1,1,1,1,2,2]  (after each char of s)
suffix: [2,2,2,1,1,1,0,0]

For cut [l..r] in t: score = r - l + 1
Need: prefix[i-1] >= l  AND  suffix[i] >= len(t)-1-r
Binary search: for each left boundary l, find smallest r such that
  suffix at some position covers t[r+1..]
```

**Chiến lược:** Precompute prefix/suffix match arrays → binary search on cut size.

---

## Problem Description

Given strings `s` and `t`, find minimum **score** of a subsequence of `t` that is a subsequence of `s`. Score = length of contiguous deletion from `t`. (After deletion, remaining chars of `t` must appear as subsequence in `s`.)

**Example 1:** `s="babd"`, `t="abab"` → `1`
**Example 2:** `s="dcbacba"`, `t="abcd"` → `1`

**Constraints:** `1 ≤ s.length, t.length ≤ 10^5`, strings are lowercase English letters

---

## 📝 Interview Tips

- **Key insight:** We delete a contiguous segment from `t`; remaining = prefix + suffix of `t`
- **Precompute:** `pre[i]` = number of t-chars matchable using s[0..i] from left; `suf[i]` = from right
- **Binary search:** For each possible split in `s`, find minimum deletion window in `t`
- **Monotonicity:** If we can keep `k` chars of `t` (deleting `len-k`), we can also delete `len-k+1` → binary search on answer
- **Two pointers check:** Given score bound `x`, verify if any deletion of size `x` yields valid subsequence
- **Edge cases:** Empty t after deletion → score = len(t); t already subsequence of s → score = 0

---

## Solutions

```typescript
function minimumScore(s: string, t: string): number {
  const n = s.length,
    m = t.length;

  // pre[i]: after scanning s[0..i], how many t-chars matched from left (greedy)
  const pre = new Array(n).fill(0);
  let j = 0;
  for (let i = 0; i < n; i++) {
    if (j < m && s[i] === t[j]) j++;
    pre[i] = j;
  }

  // suf[i]: after scanning s[i..n-1] from right, how many t-chars matched from right
  const suf = new Array(n).fill(0);
  j = m - 1;
  for (let i = n - 1; i >= 0; i--) {
    if (j >= 0 && s[i] === t[j]) j--;
    suf[i] = m - 1 - j; // number of suffix chars matched
  }

  // Case 1: delete entire t → score = m
  let ans = m;

  // Case 2: delete only suffix → use only prefix match
  // pre[n-1] = how many from left; remaining score = m - pre[n-1]
  ans = Math.min(ans, m - pre[n - 1]);

  // Case 3: delete only prefix → use only suffix match
  // suf[0] = how many from right; remaining score = m - suf[0]
  ans = Math.min(ans, m - suf[0]);

  // Case 4: keep prefix t[0..l-1] and suffix t[r+1..m-1]
  // For each split position in s: use pre[i] chars from left, suf[i+1] chars from right
  // Score = m - pre[i] - suf[i+1], but must be >= 0
  for (let i = 0; i < n - 1; i++) {
    const kept = pre[i] + suf[i + 1];
    const score = Math.max(0, m - kept);
    ans = Math.min(ans, score);
  }

  return ans;
}

function minimumScoreBinarySearch(s: string, t: string): number {
  const n = s.length,
    m = t.length;

  // Check if deleting t[l..r] (score = r-l+1) gives valid subsequence
  const check = (score: number): boolean => {
    // Try all windows of size `score` in t
    // After deleting t[l..l+score-1], need t[0..l-1] + t[l+score..m-1] as subseq of s
    // Use two pointers: pre-match from left, then try to match rest from current position
    for (let l = 0; l <= m - score; l++) {
      const r = l + score - 1; // deleted segment [l..r]
      // Match t[0..l-1] from left in s
      let si = 0,
        ti = 0;
      while (si < n && ti < l) {
        if (s[si] === t[ti]) ti++;
        si++;
      }
      if (ti < l) continue; // can't match prefix
      // Match t[r+1..m-1] from si onwards
      ti = r + 1;
      while (si < n && ti < m) {
        if (s[si] === t[ti]) ti++;
        si++;
      }
      if (ti === m) return true;
    }
    return false;
  };

  let lo = 0,
    hi = m;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    check(mid) ? (hi = mid) : (lo = mid + 1);
  }
  return lo;
}

function minimumScoreOptimal(s: string, t: string): number {
  const n = s.length,
    m = t.length;

  // prefix[i] = how many t characters matched using s[0..i-1]
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0, j = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + (j < m && s[i] === t[j] ? (j++, 1) : 0);
  }

  // suffix[i] = how many t characters matched using s[i..n-1] from right end of t
  const suffix = new Array(n + 1).fill(0);
  for (let i = n - 1, j = m - 1; i >= 0; i--) {
    suffix[i] = suffix[i + 1] + (j >= 0 && s[i] === t[j] ? (j--, 1) : 0);
  }

  let ans = m - prefix[n]; // delete entire unmatched suffix of t

  // Sweep: for each dividing point in s, find minimum window to delete from t
  for (let i = 0; i <= n; i++) {
    const leftKept = prefix[i]; // t[0..leftKept-1] matched
    const rightKept = suffix[i]; // t[m-rightKept..m-1] matched
    const totalKept = leftKept + rightKept;
    if (totalKept <= m) {
      ans = Math.min(ans, m - totalKept);
    }
  }

  return ans;
}
```

---

## 🔗 Related Problems

| Problem                                                                                                         | Similarity                        |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| [Maximum Number of Removable Characters](https://leetcode.com/problems/maximum-number-of-removable-characters/) | Binary search + subsequence check |
| [Is Subsequence](https://leetcode.com/problems/is-subsequence/)                                                 | Basic subsequence two-pointer     |
| [Shortest Way to Form String](https://leetcode.com/problems/shortest-way-to-form-string/)                       | Subsequence greedy                |
| [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)                         | Subsequence DP                    |
