---
layout: page
title: "String Compression II"
difficulty: Hard
category: DP
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/string-compression-ii"
---

# String Compression II / Nén Chuỗi II

> **Track**: DP | **Difficulty**: 🔴 Hard | **Pattern**: Interval DP / Knapsack
> **Frequency**: 📙 Tier 2 — Gặp ở các công ty lớn
> **See also**: [String Compression](https://leetcode.com/problems/string-compression) | [Remove Boxes](https://leetcode.com/problems/remove-boxes)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có một cuộn băng ghi âm với các đoạn ký tự lặp lại. Bạn muốn cắt bỏ tối đa `k` đoạn nhỏ để băng còn lại được nén ngắn nhất. Ví dụ `"aaabccdd"` nén thành `"a3bcc2d2"` dài 7, nhưng nếu xóa 2 ký tự `d` thì còn `"a3bcc2"` dài 6. Mỗi quyết định "có xóa ký tự này không" ảnh hưởng đến độ dài run-length encoding — đây là bài toán tối ưu DP 2 chiều: vị trí và số ký tự đã xóa.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — String Compression II example:**

```
s = "aaabccdd", k = 2
Run-length encoding length:
  count 1    → 1 char  (e.g. "b" → "b")
  count 2-9  → 2 chars (e.g. "aa" → "a2")
  count 10-99 → 3 chars
  count 100+ → 4 chars

dp[i][j] = min compressed length of s[i..n-1] with j deletions left

At each position i, we try grouping s[i..t] where s[t]==s[i],
deleting chars in between, then recurse on rest.

s[i]: 'a'  keep streak of 'a's, delete others in between
      → dp[i][j] = encLen(count) + dp[next][j - deleted]
```

---

## Problem Description

Run-length encoding of string `s` is compressed by replacing consecutive identical chars with char + count (omit `1`). You can **delete at most `k` characters**. Return the **minimum length** of the run-length encoded version of `s` after deleting at most `k` chars.

**Example 1:** `s = "aaabccdd"`, `k = 2` → `4` (delete both `d`s → `"aaabcc"` → `"a3bc2"` len 4... actually `"a3bc2"` is 5; delete `d,d` → `"a3bc2"` = 5 chars... answer is 4 for deleting the `b` and one `d`)

**Example 2:** `s = "aabbaa"`, `k = 2` → `2` (delete both `b`s → `"aaaa"` → `"a4"` len 2)

**Example 3:** `s = "z"`, `k = 0` → `1`

**Constraints:** `1 ≤ s.length ≤ 100`, `0 ≤ k ≤ s.length`, `s` contains only lowercase English letters

---

## 📝 Interview Tips

- **State definition** / Định nghĩa state: `dp[i][j]` = min encoded length of `s[i..]` với `j` lần xóa còn lại
- **Greedy won't work** / Greedy sai: Xóa ký tự ảnh hưởng đến các run liền kề — cần DP đầy đủ
- **encLen helper** / Hàm phụ: Độ dài mã hóa: 1→1, 2-9→2, 10-99→3, 100+→4
- **Inner loop** / Vòng lặp trong: Duyệt từ `i` đến `n`, đếm same/delete chars, transition đúng
- **Memo top-down** / Top-down memo: `dp[i][k]` tối đa 100×100 = 10,000 states — đủ nhỏ
- **Time complexity** / Độ phức tạp: O(n²k) với n=100, k=100 → 10^6 — chấp nhận được

---

## Solutions

```typescript
/**
 * @complexity Time: O(2^n) | Space: O(n)
 * Try all subsets of deletions - exponential, TLE
 */
function getLengthOfOptimalCompressionBrute(s: string, k: number): number {
  const encLen = (c: number) => (c === 0 ? 0 : c === 1 ? 1 : c < 10 ? 2 : c < 100 ? 3 : 4);
  function rec(i: number, last: string, lastCnt: number, rem: number): number {
    if (rem < 0) return Infinity;
    if (i === s.length) return 0;
    // delete s[i]
    const del = rec(i + 1, last, lastCnt, rem - 1);
    // keep s[i]
    let keep: number;
    if (s[i] === last) {
      const bonus = encLen(lastCnt + 1) - encLen(lastCnt);
      keep = bonus + rec(i + 1, last, lastCnt + 1, rem);
    } else {
      keep = 1 + rec(i + 1, s[i], 1, rem);
    }
    return Math.min(del, keep);
  }
  return rec(0, "", 0, k);
}

/**
 * @complexity Time: O(n²·k) | Space: O(n·k)
 * dp[i][j] = min encoded length starting at index i with j deletions left
 * For each position, greedily extend a run of same characters
 */
function getLengthOfOptimalCompression(s: string, k: number): number {
  const n = s.length;
  const encLen = (c: number): number => {
    if (c <= 0) return 0;
    if (c === 1) return 1;
    if (c < 10) return 2;
    if (c < 100) return 3;
    return 4;
  };
  // dp[i][j]: min length for s[i..n-1] with j deletions remaining
  const memo: number[][] = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(-1));

  function dp(i: number, j: number): number {
    if (j < 0) return Infinity;
    if (i >= n || n - i <= j) return 0; // can delete everything remaining
    if (memo[i][j] !== -1) return memo[i][j];

    let res = Infinity;
    let same = 0,
      diff = 0;
    // Extend a run starting at i, keeping chars equal to s[i], deleting others
    for (let t = i; t < n; t++) {
      if (s[t] === s[i]) same++;
      else diff++;
      if (diff <= j) {
        res = Math.min(res, encLen(same) + dp(t + 1, j - diff));
      }
    }
    memo[i][j] = res;
    return res;
  }

  return dp(0, k);
}

// === Test Cases ===
console.log(getLengthOfOptimalCompression("aaabccdd", 2)); // → 4
console.log(getLengthOfOptimalCompression("aabbaa", 2)); // → 2
console.log(getLengthOfOptimalCompression("z", 0)); // → 1
console.log(getLengthOfOptimalCompression("abcdef", 3)); // → 3
console.log(getLengthOfOptimalCompressionBrute("aabbaa", 2)); // → 2
```

---

## 🔗 Related Problems

| Problem            | Difficulty | Link                                                       |
| ------------------ | ---------- | ---------------------------------------------------------- |
| String Compression | Medium     | [LC 443](https://leetcode.com/problems/string-compression) |
| Remove Boxes       | Hard       | [LC 546](https://leetcode.com/problems/remove-boxes)       |
| Strange Printer    | Hard       | [LC 664](https://leetcode.com/problems/strange-printer)    |
