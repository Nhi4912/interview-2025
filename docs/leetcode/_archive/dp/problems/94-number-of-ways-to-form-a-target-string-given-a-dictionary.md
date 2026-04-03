---
layout: page
title: "Number of Ways to Form a Target String Given a Dictionary"
difficulty: Hard
category: Dynamic Programming
tags: [Array, String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary"
---

# Number of Ways to Form a Target String Given a Dictionary / Số Cách Tạo Chuỗi Mục Tiêu Từ Từ Điển

> **Difficulty**: 🔴 Hard | **Category**: Dynamic Programming | **Pattern**: 2D DP / Column Frequency Count

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Bạn có một bảng chữ cái nhiều cột (các từ trong từ điển). Để ghép từ mục tiêu, mỗi ký tự phải lấy từ cột phía sau cột đã chọn trước đó — giống dệt vải, mỗi sợi ngang phải cắm vào cột tiếp theo.

**Pattern Recognition:**

- Build target character by character, each from a later column than the previous
- Precompute `freq[col][c]` = how many words have character `c` at column `col`
- dp[i][j] = ways to form target[0..i-1] using columns[0..j-1]

**Visual (words=["acca","bbbb","caca"], target="aba"):**

```
freq[col][c]: col0={a:2,b:1,c:0} col1={c:1,b:2,a:0} col2={c:2,b:1,a:0} col3={a:2,b:1,c:0}

dp[0][*] = 1 (empty target formed 1 way)
target[0]='a': dp[1][1]=freq[0][a]*dp[0][0]=2, dp[1][2]=freq[1][a]*dp[0][1]+dp[1][1]=0+2=2...
target[1]='b': dp[2][2]=freq[1][b]*dp[1][1]=2*2=4...
target[2]='a': dp[3][4]=freq[3][a]*dp[2][3]=2*6=... → answer=6
```

## Problem Description

Given an array of equal-length `words` and a `target` string, return the number of ways to form `target` where each character `target[i]` must be chosen from some column `j` (with `j` strictly increasing), using any word's character at that column. Answer modulo `10^9+7`.

**Example 1:** `words=["acca","bbbb","caca"]`, `target="aba"` → `6`
**Example 2:** `words=["abba","baab"]`, `target="bab"` → `4`

**Constraints:** `1 <= words.length <= 1000`, words all same length ≤ 1000, `1 <= target.length <= 1000`

## 📝 Interview Tips

1. **Clarify**: Must use strictly increasing column indices? Yes — left to right, no reuse.
2. **Approach**: Precompute column character frequencies → 2D DP: dp[ti][ci] = ways.
3. **Edge cases**: target length > words[0].length → impossible (return 0).
4. **Optimize**: 1D DP rolling array; process column by column.
5. **Follow-up**: What if column reuse is allowed? → simpler DP without strict ordering.
6. **Complexity**: O(k×n + k×m) where k=word length, n=words count, m=target length.

## Solutions

```typescript
// Solution 1: 2D DP (target length × word length) — Time: O(k×m) | Space: O(k×m)
function numWays(words: string[], target: string): number {
  const MOD = 1_000_000_007n;
  const k = words[0].length;
  const m = target.length;
  if (m > k) return 0;

  // freq[col][charCode - 97] = count of words having that char at col
  const freq: number[][] = Array.from({ length: k }, () => new Array(26).fill(0));
  for (const w of words) {
    for (let col = 0; col < k; col++) {
      freq[col][w.charCodeAt(col) - 97]++;
    }
  }

  // dp[i][j] = ways to form target[0..i-1] using first j columns
  const dp: bigint[][] = Array.from({ length: m + 1 }, () => new Array(k + 1).fill(0n));
  for (let j = 0; j <= k; j++) dp[0][j] = 1n; // empty prefix: 1 way

  for (let i = 1; i <= m; i++) {
    const ci = target.charCodeAt(i - 1) - 97;
    for (let j = i; j <= k; j++) {
      // need at least i columns
      // Don't use column j-1 for target[i-1]:
      dp[i][j] = dp[i][j - 1];
      // Use column j-1 for target[i-1]:
      dp[i][j] = (dp[i][j] + dp[i - 1][j - 1] * BigInt(freq[j - 1][ci])) % MOD;
    }
  }

  return Number(dp[m][k]);
}

// Solution 2: Space-optimized 1D DP — Time: O(k×m) | Space: O(m)
function numWays2(words: string[], target: string): number {
  const MOD = 1_000_000_007n;
  const k = words[0].length;
  const m = target.length;
  if (m > k) return 0;

  const freq: number[][] = Array.from({ length: k }, () => new Array(26).fill(0));
  for (const w of words) {
    for (let col = 0; col < k; col++) {
      freq[col][w.charCodeAt(col) - 97]++;
    }
  }

  // dp[i] = ways to form target[0..i-1] so far
  let dp = new Array<bigint>(m + 1).fill(0n);
  dp[0] = 1n;

  for (let col = 0; col < k; col++) {
    // Traverse target backwards to avoid using same column twice
    for (let i = Math.min(col + 1, m); i >= 1; i--) {
      const ci = target.charCodeAt(i - 1) - 97;
      dp[i] = (dp[i] + dp[i - 1] * BigInt(freq[col][ci])) % MOD;
    }
  }

  return Number(dp[m]);
}

// Tests
console.log(numWays(["acca", "bbbb", "caca"], "aba")); // 6
console.log(numWays(["abba", "baab"], "bab")); // 4
console.log(numWays(["a"], "a")); // 1
console.log(numWays(["aa", "bb"], "a")); // 2
console.log(numWays(["abc", "abc"], "abc")); // 8
```

## 🔗 Related Problems

| Problem                                                                                                                   | Relationship                             |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)                                   | 2D DP on two sequences                   |
| [Distinct Subsequences](https://leetcode.com/problems/distinct-subsequences/)                                             | Count ways to form string as subsequence |
| [Count All Valid Pickup and Delivery Options](https://leetcode.com/problems/count-all-valid-pickup-and-delivery-options/) | Modular counting DP                      |
