---
layout: page
title: "Number of Distinct Roll Sequences"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming, Memoization]
leetcode_url: "https://leetcode.com/problems/number-of-distinct-roll-sequences"
---

# Number of Distinct Roll Sequences / Number of Distinct Roll Sequences

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Fibonacci Number](https://leetcode.com/problems/fibonacci-number) | [Word Break II](https://leetcode.com/problems/word-break-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tung xúc xắc n lần với luật: xúc xắc kế tiếp không được là ước/bội của lần trước, và không được giống lần trước đó hai bước. State DP chỉ cần hai lần lăn gần nhất — như nhớ bước chân cuối cùng khi đi theo quy tắc.

**Visual — n=2 (dice 1-6):**

```
Rules:
  - Consecutive rolls: gcd(prev, curr) == 1 (they must be coprime? No)
  - Actually: curr != prev AND gcd(curr, prev) == 1? No.
  - Actual rule: curr != prev2 (two steps back) AND gcd(curr, prev) == 1

Valid transitions from prev=2:
  gcd(2,1)=1 ✓, gcd(2,2)=2 ✗, gcd(2,3)=1 ✓, gcd(2,4)=2 ✗, gcd(2,5)=1 ✓, gcd(2,6)=2 ✗
  Valid: 1, 3, 5

State: dp[step][last][secondLast] = count of valid sequences of length step
       ending with (secondLast, last)
Only 6×6 = 36 states per step → very efficient
```

---

## Problem Description

You roll a standard 6-sided die `n` times. A sequence is **valid** if:

1. No two **consecutive** rolls have a **common factor** > 1 (they must be coprime)
2. No **equal** values appear in two consecutive positions

Return the number of **distinct valid sequences** of length `n`, modulo `10^9 + 7`. ([LeetCode](https://leetcode.com/problems/number-of-distinct-roll-sequences))

Difficulty: Hard | Acceptance: 57.3%

**Example 1:**

```
Input: n = 4
Output: 184
```

**Example 2:**

```
Input: n = 2
Output: 22
Explanation: Pairs where gcd > 1 excluded: (2,2),(2,4),(2,6),(4,2),(4,4),(4,6),(6,2),(6,4),(6,6),(3,3),(3,6),(6,3) = 12 pairs excluded. 36-12-2(same)=22
```

Constraints:

- `1 <= n <= 10^4`

---

## 📝 Interview Tips

1. **State**: "dp[last][secondLast] = số sequence hợp lệ kết thúc bằng cặp (secondLast, last)" / Two-value state is sufficient — O(36) states.
2. **Transition rules**: "Từ (prev2, prev1) sang curr: gcd(prev1, curr)==1 AND curr != prev2" / Two constraints per transition.
3. **GCD precompute**: "Tính gcd cho tất cả cặp (1..6)×(1..6) trước — 36 cặp" / Precompute gcd table for O(1) lookup.
4. **Optimization**: "State chỉ phụ thuộc 2 lần trước → rolling 36-cell array thay vì n×36" / Space O(36) with rolling.
5. **Base cases**: "n=1: mọi giá trị 1-6 đều hợp lệ → 6. n=2: đếm các cặp có gcd=1" / Small cases to verify.
6. **Modular**: "Cộng dồn mod 10^9+7 ở mỗi bước" / Apply modulo throughout.

---

## Solutions

```typescript
/**
 * Solution 1: DP with 2D rolling state
 * Time: O(n · 36 · 6) = O(216n) — n steps, 36 states, 6 transitions each
 * Space: O(36) — only current and previous states
 */
function distinctSequences(n: number): number {
  const MOD = 1_000_000_007;

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  // Precompute GCD table for 1..6 × 1..6
  const gcds: number[][] = Array.from({ length: 7 }, (_, i) =>
    Array.from({ length: 7 }, (_, j) => gcd(i, j)),
  );

  // dp[last][secondLast] = count of valid sequences ending with (..., secondLast, last)
  // For n=1, secondLast=0 means "no previous"
  let dp: number[][] = Array.from({ length: 7 }, () => new Array(7).fill(0));

  // Initialize: sequences of length 1
  for (let v = 1; v <= 6; v++) dp[v][0] = 1;

  if (n === 1) {
    return 6;
  }

  // Build sequences of length 2
  let ndp: number[][] = Array.from({ length: 7 }, () => new Array(7).fill(0));
  for (let last = 1; last <= 6; last++) {
    for (let curr = 1; curr <= 6; curr++) {
      if (curr === last) continue; // no consecutive equal
      if (gcds[last][curr] !== 1) continue; // must be coprime
      ndp[curr][last] = (ndp[curr][last] + dp[last][0]) % MOD;
    }
  }
  dp = ndp;

  // Build sequences of length 3..n
  for (let step = 3; step <= n; step++) {
    ndp = Array.from({ length: 7 }, () => new Array(7).fill(0));
    for (let last = 1; last <= 6; last++) {
      for (let prev2 = 1; prev2 <= 6; prev2++) {
        if (dp[last][prev2] === 0) continue;
        for (let curr = 1; curr <= 6; curr++) {
          if (curr === last) continue; // no consecutive equal
          if (gcds[last][curr] !== 1) continue; // coprime
          if (curr === prev2) continue; // no repeat with two steps back
          ndp[curr][last] = (ndp[curr][last] + dp[last][prev2]) % MOD;
        }
      }
    }
    dp = ndp;
  }

  let ans = 0;
  for (let last = 1; last <= 6; last++)
    for (let prev2 = 0; prev2 <= 6; prev2++) ans = (ans + dp[last][prev2]) % MOD;

  return ans;
}

// === Test Cases ===
console.log(distinctSequences(1)); // 6
console.log(distinctSequences(2)); // 22
console.log(distinctSequences(4)); // 184
console.log(distinctSequences(10)); // should be a valid large number
```
