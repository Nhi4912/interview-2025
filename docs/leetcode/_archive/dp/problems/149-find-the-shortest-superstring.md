---
layout: page
title: "Find the Shortest Superstring"
difficulty: Hard
category: Dynamic Programming
tags: [Array, String, Dynamic Programming, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/find-the-shortest-superstring"
---

# Find the Shortest Superstring / Tìm Chuỗi Siêu Ngắn Nhất

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word) | [Maximum Score Words Formed by Letters](https://leetcode.com/problems/maximum-score-words-formed-by-letters)

---

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như bài toán người du lịch (TSP) — bạn cần thăm mọi thành phố (chuỗi) đúng 1 lần với chi phí di chuyển nhỏ nhất. Chi phí = phần không chồng lấp khi nối 2 chuỗi.

```
words = ["alex","loves","leetcode"]
overlap("alex","loves")    = 0  → cost = len("loves") = 5
overlap("loves","leetcode")= 0  → cost = len("leetcode") = 8
overlap("alex","leetcode") = 0

dp[mask][i] = max overlap achieved using words in mask, ending at word i
mask=0b111, best ending → reconstruct path → "alexlovesleetcode"
```

**Key insight:** Precompute `overlap[i][j]` = chars of `words[j]` saved when appended after `words[i]`. Then TSP bitmask DP: `dp[mask][j] = max(dp[mask ^ (1<<j)][i] + overlap[i][j])`.

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Overlap[i][j]**: Length of longest suffix of `words[i]` that is prefix of `words[j]` / hậu tố của i trùng tiền tố của j
- 🔑 **State**: `dp[mask][i]` = max total overlap using exactly the words in `mask`, last word is `i` / tổng chồng lấp tối đa
- 🔑 **Transition**: `dp[mask][j] = max over i: dp[mask^(1<<j)][i] + overlap[i][j]` / chuyển từ trạng thái trước
- 🔑 **Parent array**: Track `parent[mask][j]` to reconstruct the actual string order / lưu vết để khôi phục
- 🔑 **n ≤ 12**: 2^12 × 12 × 12 = ~590K states — feasible / ràng buộc nhỏ cho phép bitmask
- 🔑 **Build result**: Follow parent chain, then append non-overlapping suffix of each word / xây chuỗi từ path

---

## Solutions / Giải Pháp

### Solution 1: TSP Bitmask DP (O(n² × 2ⁿ) time, O(n × 2ⁿ) space)

```typescript
/**
 * Find the Shortest Superstring — TSP Bitmask DP
 *
 * 1. Precompute overlap[i][j] = suffix of words[i] matching prefix of words[j].
 * 2. dp[mask][i] = max overlap when using words in mask, ending at i.
 * 3. Reconstruct path via parent array, then build superstring.
 *
 * Time:  O(n² × 2ⁿ)  — n=12 words max
 * Space: O(n × 2ⁿ)   — dp and parent tables
 */
function shortestSuperstring(words: string[]): string {
  const n = words.length;

  // Precompute overlaps
  const overlap = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const maxLen = Math.min(words[i].length, words[j].length);
      for (let k = maxLen; k >= 1; k--) {
        if (words[i].endsWith(words[j].slice(0, k))) {
          overlap[i][j] = k;
          break;
        }
      }
    }
  }

  const full = 1 << n;
  // dp[mask][i] = max overlap achievable
  const dp: number[][] = Array.from({ length: full }, () => new Array(n).fill(0));
  const parent: number[][] = Array.from({ length: full }, () => new Array(n).fill(-1));

  for (let mask = 1; mask < full; mask++) {
    for (let last = 0; last < n; last++) {
      if (!(mask & (1 << last))) continue;
      const prev = mask ^ (1 << last);
      if (prev === 0) continue;
      for (let i = 0; i < n; i++) {
        if (!(prev & (1 << i))) continue;
        const candidate = dp[prev][i] + overlap[i][last];
        if (candidate > dp[mask][last]) {
          dp[mask][last] = candidate;
          parent[mask][last] = i;
        }
      }
    }
  }

  // Find the last word with maximum overlap
  let last = 0;
  for (let i = 1; i < n; i++) {
    if (dp[full - 1][i] > dp[full - 1][last]) last = i;
  }

  // Reconstruct path
  const path: number[] = [];
  let mask = full - 1;
  while (last !== -1) {
    path.push(last);
    const prev = parent[mask][last];
    mask ^= 1 << last;
    last = prev;
  }
  path.reverse();

  // Build superstring
  let result = words[path[0]];
  for (let k = 1; k < path.length; k++) {
    const ov = overlap[path[k - 1]][path[k]];
    result += words[path[k]].slice(ov);
  }
  return result;
}

console.log(shortestSuperstring(["alex", "loves", "leetcode"])); // "alexlovesleetcode"
console.log(shortestSuperstring(["catg", "ctaagt", "gcta", "ttca", "atgcatc"])); // "gctaagttcatgcatc"
console.log(shortestSuperstring(["ab", "ba"])); // "aba" or "bab"
```

### Solution 2: Memoized Top-Down TSP

```typescript
/**
 * Find the Shortest Superstring — Top-down Memoization
 *
 * Same TSP logic but using recursion + memoization.
 * Returns minimum total length (for verification).
 *
 * Time:  O(n² × 2ⁿ)
 * Space: O(n × 2ⁿ)
 */
function shortestSuperstringLen(words: string[]): number {
  const n = words.length;
  const overlap = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const maxOv = Math.min(words[i].length, words[j].length);
      for (let k = maxOv; k >= 1; k--) {
        if (words[i].endsWith(words[j].slice(0, k))) {
          overlap[i][j] = k;
          break;
        }
      }
    }
  }

  const totalLen = words.reduce((s, w) => s + w.length, 0);
  const full = (1 << n) - 1;
  const memo = new Map<string, number>();

  function dfs(mask: number, last: number): number {
    if (mask === full) return 0;
    const key = `${mask},${last}`;
    if (memo.has(key)) return memo.get(key)!;
    let best = Infinity;
    for (let next = 0; next < n; next++) {
      if (mask & (1 << next)) continue;
      const cost = words[next].length - overlap[last][next] + dfs(mask | (1 << next), next);
      best = Math.min(best, cost);
    }
    memo.set(key, best);
    return best;
  }

  let ans = Infinity;
  for (let start = 0; start < n; start++) {
    ans = Math.min(ans, words[start].length + dfs(1 << start, start));
  }
  return ans;
}

console.log(shortestSuperstringLen(["alex", "loves", "leetcode"])); // 16
console.log(shortestSuperstringLen(["ab", "ba"])); // 3
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                        | Difficulty | Pattern        |
| ---------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Travelling Salesman (classic)](https://leetcode.com/problems/find-the-shortest-superstring)   | 🔴 Hard    | TSP Bitmask DP |
| [Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word)                 | 🔴 Hard    | Bitmask DP     |
| [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement)                   | 🟡 Medium  | Bitmask DP     |
| [Minimum Cost to Connect Sticks](https://leetcode.com/problems/minimum-cost-to-connect-sticks) | 🟡 Medium  | Greedy / Heap  |
