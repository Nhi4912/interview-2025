---
layout: page
title: "Decode Ways II"
difficulty: Hard
category: Dynamic Programming
tags: [String, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/decode-ways-ii"
---

# Decode Ways II / Giải Mã Thông Điệp II

---

## 🧠 Intuition / Tư Duy

**Analogy:** > Dãy số được mã hóa thành chữ cái (1→A ... 26→Z). Ký tự `*` có thể là bất kỳ chữ số 1-9.  
> Giống giải mã điện tín bị mờ: mỗi dấu `*` tạo nhiều nhánh giải mã khác nhau.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Decode Ways II example:**

```
s = "1*"

dp[0] = 1 (empty)
dp[1] = ways("1") = 1
dp[2]:
  single "1*": * can be 1-9 → 9 ways
  double "1*": 11-19 → 9 ways
  total = 9 + 9 = 18

s = "*"
  single "*": 1-9 → 9 ways
  dp[1] = 9
```

---

## Problem Description

A message is encoded: `'A'→1, 'B'→2, ..., 'Z'→26`. The string may contain `'*'` which can represent
any digit `'1'` to `'9'`. Return the **number of ways** to decode string `s`, modulo `10^9 + 7`.

**Constraints:** `1 <= s.length <= 10^5`, `s[i]` is `'0'-'9'` or `'*'`

---

## 📝 Interview Tips

1. **Build on Decode Ways I** — same DP, but `'*'` multiplies options.
2. **Single char** — `'*'` → 9 ways, `'1'-'9'` → 1 way, `'0'` → 0 ways.
3. **Two chars** — handling all `(prev, curr)` combinations with `'*'` carefully.
4. **Two-char cases** — `**`: 15 ways (11-19 + 21-26), `1*`: 9 ways (11-19), `2*`: 6 ways (21-26), `*d`: depends on d.
5. **Space optimize** — only need `dp[i-1]` and `dp[i-2]` at each step.
6. **Modular arithmetic** — use BigInt or keep numbers in safe range with % MOD after each op.

---

## Solutions

```typescript
function numDecodings(s: string): number {
  const MOD = 1_000_000_007n;
  const n = s.length;

  // dp2 = dp[i-2], dp1 = dp[i-1] (ways to decode s[0..i-1])
  let dp2 = 1n; // dp[0]: empty string = 1 way
  let dp1 = s[0] === "*" ? 9n : s[0] === "0" ? 0n : 1n; // dp[1]

  for (let i = 1; i < n; i++) {
    const curr = s[i];
    const prev = s[i - 1];
    let dp = 0n;

    // Single character decode
    if (curr === "*") {
      dp = (dp1 * 9n) % MOD; // '*' can be 1-9
    } else if (curr !== "0") {
      dp = dp1; // any non-zero digit
    }
    // curr === '0': dp += 0 (must be combined with prev)

    // Two character decode (prev + curr)
    if (prev === "*" && curr === "*") {
      // 11-19 (9) + 21-26 (6) = 15
      dp = (dp + dp2 * 15n) % MOD;
    } else if (prev === "*") {
      const d = parseInt(curr);
      // '1' + d (d=0..9): 9 options → 1 way each
      // '2' + d (d=0..6): 1 way
      let twoWays = 0n;
      if (d <= 9) twoWays += 1n; // 1d always valid (10-19)
      if (d <= 6) twoWays += 1n; // 2d valid for d in 0..6
      dp = (dp + dp2 * twoWays) % MOD;
    } else if (curr === "*") {
      const p = parseInt(prev);
      if (p === 1) {
        dp = (dp + dp2 * 9n) % MOD; // 11-19
      } else if (p === 2) {
        dp = (dp + dp2 * 6n) % MOD; // 21-26
      }
      // p === 0 or p >= 3: no valid two-char combo
    } else {
      const twoDigit = parseInt(prev + curr);
      if (twoDigit >= 10 && twoDigit <= 26) {
        dp = (dp + dp2) % MOD;
      }
    }

    dp2 = dp1;
    dp1 = dp;
  }

  return Number(dp1);
}

console.log(numDecodings("*")); // 9
console.log(numDecodings("1*")); // 18
console.log(numDecodings("**")); // 96
console.log(numDecodings("*0")); // 2
console.log(numDecodings("0")); // 0
console.log(numDecodings("1")); // 1

function numDecodingsDP(s: string): number {
  const MOD = 1_000_000_007;
  const n = s.length;
  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = s[0] === "*" ? 9 : s[0] === "0" ? 0 : 1;

  for (let i = 2; i <= n; i++) {
    const c = s[i - 1],
      p = s[i - 2];

    // Single-char decode of c
    if (c === "*") dp[i] = (dp[i] + dp[i - 1] * 9) % MOD;
    else if (c !== "0") dp[i] = (dp[i] + dp[i - 1]) % MOD;

    // Two-char decode of p+c
    if (p === "*" && c === "*") {
      dp[i] = (dp[i] + dp[i - 2] * 15) % MOD;
    } else if (p === "*") {
      const d = parseInt(c);
      dp[i] = (dp[i] + dp[i - 2] * (d <= 9 ? 1 : 0)) % MOD; // 1d
      dp[i] = (dp[i] + dp[i - 2] * (d <= 6 ? 1 : 0)) % MOD; // 2d
    } else if (c === "*") {
      const pv = parseInt(p);
      if (pv === 1) dp[i] = (dp[i] + dp[i - 2] * 9) % MOD;
      else if (pv === 2) dp[i] = (dp[i] + dp[i - 2] * 6) % MOD;
    } else {
      const two = parseInt(p + c);
      if (two >= 10 && two <= 26) dp[i] = (dp[i] + dp[i - 2]) % MOD;
    }
  }

  return dp[n];
}

console.log(numDecodingsDP("*")); // 9
console.log(numDecodingsDP("1*")); // 18
console.log(numDecodingsDP("**")); // 96
console.log(numDecodingsDP("*0")); // 2
```

---

## 🔗 Related Problems

| Problem                                                             | Difficulty | Key Concept         |
| ------------------------------------------------------------------- | ---------- | ------------------- |
| [Decode Ways](https://leetcode.com/problems/decode-ways/)           | Medium     | DP without wildcard |
| [Fibonacci Number](https://leetcode.com/problems/fibonacci-number/) | Easy       | Base DP pattern     |
| [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/)   | Easy       | 1D DP               |
