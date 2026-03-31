---
layout: page
title: "Minimum Substring Partition of Equal Character Frequency"
difficulty: Medium
category: Dynamic Programming
tags: [Hash Table, String, Dynamic Programming, Counting]
leetcode_url: "https://leetcode.com/problems/minimum-substring-partition-of-equal-character-frequency"
---

## ✂️ 3144. Minimum Substring Partition of Equal Character Frequency / Số Phân Vùng Tối Thiểu Có Tần Suất Ký Tự Bằng Nhau

**Difficulty:** 🟡 Medium

---

## 🧠 Intuition

**Analogy (Vietnamese):** Tưởng tượng bạn phải cắt một sợi dây thành nhiều đoạn nhỏ nhất có thể, sao cho **mỗi đoạn** chứa tất cả các ký tự xuất hiện đúng **cùng số lần**. Giống như chia kẹo: mỗi túi kẹo phải có số lượng bằng nhau cho mỗi loại kẹo trong túi đó.

```
s = "fabccddg"
 f a b c c d d g
 └─────┘         → "fabcc"? No: f=1,a=1,b=1,c=2 ≠
 └───┘           → "fab"?  No: f=1,a=1,b=1 ✓
     └───────┘   → "cddg"? c=1,d=2,g=1 ≠
     └─────┘     → "cdd"?  c=1,d=2 ≠
         └───┘   → "g"?    g=1 ✓ ... explore all cuts
```

**Key insight:** `dp[i]` = min partitions for `s[0..i-1]`. For each end `i`, check all substrings `s[j..i-1]` — is it "balanced"? A substring is balanced if all character frequencies are equal.

---

## 📋 Problem Description

Given string `s`, partition it into minimum number of substrings such that in each substring, **every character appears the same number of times**.

- Example: `s = "fabccddg"` → **3** (`"fab"`, `"cc"`, `"ddg"`)
- Example: `s = "abababaccddb"` → **2** (`"abab"`, `"abaccddb"`)

---

## 📝 Interview Tips

- 🎯 **Check balanced**: a substring is balanced when `maxFreq == minFreq` for all present chars
- 🎯 **DP state**: `dp[i]` = min cuts for `s[0..i-1]`; answer is `dp[n]`
- 🎯 **Transition**: for each `j < i`, if `s[j..i-1]` is balanced, `dp[i] = min(dp[i], dp[j] + 1)`
- 🎯 **Extend incrementally**: maintain freq map as you extend substring left→right
- 🎯 **Balanced check**: track `distinct` count, `maxFreq`, and use `maxFreq * distinct == (i-j)` length
- 🎯 **Complexity**: O(n^2 × 26) time, O(n) space

---

## 💡 Solutions

### Solution 1: DP + Incremental Frequency Check

```typescript
function minimumSubstringPartition(s: string): number {
  const n = s.length;
  // dp[i] = min partitions for s[0..i-1]
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    const freq = new Array(26).fill(0);
    let maxFreq = 0;
    let distinct = 0;

    // Check all substrings ending at i-1
    for (let j = i - 1; j >= 0; j--) {
      const c = s.charCodeAt(j) - 97;
      freq[c]++;
      if (freq[c] === 1) distinct++;
      if (freq[c] > maxFreq) maxFreq = freq[c];

      // Balanced: all present chars have same freq
      const len = i - j;
      if (maxFreq * distinct === len && dp[j] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[j] + 1);
      }
    }
  }

  return dp[n];
}
```

### Solution 2: DP with Set-based Balanced Check

```typescript
function minimumSubstringPartition2(s: string): number {
  const n = s.length;
  const dp = new Array(n + 1).fill(n + 1);
  dp[0] = 0;

  function isBalanced(start: number, end: number): boolean {
    const freq = new Map<string, number>();
    for (let k = start; k < end; k++) {
      freq.set(s[k], (freq.get(s[k]) ?? 0) + 1);
    }
    const vals = [...freq.values()];
    const target = vals[0];
    return vals.every((v) => v === target);
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] < n && isBalanced(j, i)) {
        dp[i] = Math.min(dp[i], dp[j] + 1);
      }
    }
  }

  return dp[n];
}
```

### Solution 3: Optimized with minFreq tracking

```typescript
function minimumSubstringPartitionOpt(s: string): number {
  const n = s.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    const freq = new Array(26).fill(0);
    let maxFreq = 0,
      distinct = 0;

    for (let j = i - 1; j >= 0; j--) {
      const c = s.charCodeAt(j) - 97;
      if (++freq[c] === 1) distinct++;
      maxFreq = Math.max(maxFreq, freq[c]);

      if (maxFreq * distinct === i - j && dp[j] < Infinity) {
        dp[i] = Math.min(dp[i], dp[j] + 1);
      }
    }
  }

  return dp[n];
}
```

---

## 🔗 Related Problems

| Problem                                                                                                                                                 | Difficulty | Key Technique |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [139. Word Break](https://leetcode.com/problems/word-break/)                                                                                            | Medium     | DP + Hash Set |
| [132. Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/)                                                            | Hard       | DP            |
| [1593. Split a String Into the Max Number of Unique Substrings](https://leetcode.com/problems/split-a-string-into-the-max-number-of-unique-substrings/) | Medium     | Backtracking  |
| [3163. String Compression III](https://leetcode.com/problems/string-compression-iii/)                                                                   | Medium     | Greedy        |
