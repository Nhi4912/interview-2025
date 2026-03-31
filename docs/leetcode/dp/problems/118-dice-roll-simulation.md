---
layout: page
title: "Dice Roll Simulation"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/dice-roll-simulation"
---

# Dice Roll Simulation / Mô Phỏng Xúc Xắc — Đếm Dãy Hợp Lệ

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DP with Consecutive Constraint
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Maximal Square](https://leetcode.com/problems/maximal-square)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như tung xúc xắc với quy tắc — không được ra cùng một mặt quá `rollMax[i]` lần liên tiếp. Đếm tất cả dãy n lần tung hợp lệ theo mod 10⁹+7.

**Pattern Recognition:**

- State: `dp[face][consec]` = số dãy hợp lệ kết thúc bằng `face` xuất hiện `consec` lần liên tiếp
- Transition: lăn mặt `f` tiếp theo:
  - Nếu `f == lastFace` và `consec+1 ≤ rollMax[f]`: extend
  - Nếu `f != lastFace`: bắt đầu lại với consec=1

```
n=2, rollMax=[1,1,2,2,2,3] (faces 1-6 max 1,1,2,2,2,3 lần liên tiếp)

Sau lần 1: dp[f][1]=1 cho mỗi f. Tổng=6
Lần 2:
  face f=1(rollMax=1): không thể extend (max=1), chỉ đến từ các face≠1 → 5
  face f=3(rollMax=2): từ f≠3 (5 cách) + extend f=3 từ dp[3][1]=1 → 5+1=6
Tổng lần 2 = 5+5+6+6+6+6 = 34
```

---

## Problem Description / Mô Tả Bài Toán

Tung xúc xắc 6 mặt `n` lần. Mảng `rollMax` cho biết mỗi mặt `i` có thể xuất hiện tối đa `rollMax[i]` lần liên tiếp. Đếm số dãy kết quả phân biệt, trả về modulo 10⁹+7.

**Example 1:** `n=2`, `rollMax=[1,1,2,2,2,3]` → `34`
**Example 2:** `n=2`, `rollMax=[1,1,1,1,1,1]` → `30`

**Constraints:** `1 ≤ n ≤ 5000`, `rollMax.length=6`, `1 ≤ rollMax[i] ≤ 15`

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

1. **EN:** State: (current roll, last face, consecutive count). Transition: roll same face (if allowed) or different face.
   **VI:** State: (lần tung, mặt cuối, số lần liên tiếp). Transition: tiếp tục mặt cũ hoặc đổi mặt.

2. **EN:** Optimization: precompute total sum per step and per-face sum. "Roll different face" = total - faceSum.
   **VI:** Tối ưu: tính tổng toàn cục và tổng theo mặt. "Đổi mặt" = tổng - sum của mặt đó.

3. **EN:** The state space is n × 6 × 15 = 5000×6×15 = 450000 — manageable.
   **VI:** State space là n × 6 × 15 = 450000 — chấp nhận được.

4. **EN:** Modulo every addition. Don't forget `(a - b + MOD) % MOD` for subtraction.
   **VI:** Mod từng phép cộng. Đừng quên `(a - b + MOD) % MOD` khi trừ.

5. **EN:** Base case: after roll 1, dp[f][1]=1 for each face f (one way to show each face once).
   **VI:** Base: sau lần 1, dp[f][1]=1 cho mỗi mặt f.

6. **EN:** Edge: n=1 → answer=6 (any face). rollMax all 1 → no same-face streak allowed.
   **VI:** Edge: n=1 → 6. rollMax toàn 1 → không có streak nào được phép.

---

## Solutions / Giải Pháp

```typescript
// ─── Solution 1: Full DP — O(n × 6 × maxConsec) ──────────────────────────────
// dp[face][consec] = ways to have sequence ending with face used consec times consecutively
function dieSimulator(n: number, rollMax: number[]): number {
  const MOD = 1_000_000_007;
  const FACES = 6;

  // dp[f][k] = ways to end with face f used k consecutive times
  let dp: number[][] = Array.from({ length: FACES }, () => new Array(16).fill(0));
  for (let f = 0; f < FACES; f++) dp[f][1] = 1;

  for (let roll = 2; roll <= n; roll++) {
    const ndp: number[][] = Array.from({ length: FACES }, () => new Array(16).fill(0));

    // Precompute total and per-face sums from previous step
    let total = 0;
    const faceSum = new Array(FACES).fill(0);
    for (let f = 0; f < FACES; f++) {
      for (let k = 1; k <= rollMax[f]; k++) {
        faceSum[f] = (faceSum[f] + dp[f][k]) % MOD;
      }
      total = (total + faceSum[f]) % MOD;
    }

    for (let f = 0; f < FACES; f++) {
      // Roll a different face → comes from (total - sum of all same-face sequences)
      ndp[f][1] = (total - faceSum[f] + MOD) % MOD;

      // Extend same face (consec k+1), only if k < rollMax[f]
      for (let k = 1; k < rollMax[f]; k++) {
        ndp[f][k + 1] = (ndp[f][k + 1] + dp[f][k]) % MOD;
      }
    }

    dp = ndp;
  }

  // Sum all valid endings
  let ans = 0;
  for (let f = 0; f < FACES; f++) {
    for (let k = 1; k <= rollMax[f]; k++) {
      ans = (ans + dp[f][k]) % MOD;
    }
  }
  return ans;
}

// ─── Solution 2: Memoization (Top-Down) ──────────────────────────────────────
function dieSimulator_memo(n: number, rollMax: number[]): number {
  const MOD = 1_000_000_007;
  const memo = new Map<string, number>();

  // Count sequences from `roll` to `n`, last face was `face` with `consec` streak
  function dp(roll: number, lastFace: number, consec: number): number {
    if (roll > n) return 1;
    const key = `${roll},${lastFace},${consec}`;
    if (memo.has(key)) return memo.get(key)!;

    let ways = 0;
    for (let f = 0; f < 6; f++) {
      if (f === lastFace) {
        if (consec + 1 <= rollMax[f]) ways = (ways + dp(roll + 1, f, consec + 1)) % MOD;
      } else {
        ways = (ways + dp(roll + 1, f, 1)) % MOD;
      }
    }
    memo.set(key, ways);
    return ways;
  }

  // Start: roll 1 with no previous face (-1 means fresh start)
  let ans = 0;
  for (let f = 0; f < 6; f++) {
    ans = (ans + dp(2, f, 1)) % MOD;
  }
  return ans;
}

// ─── Tests ────────────────────────────────────────────────────────────────────
console.log(dieSimulator(2, [1, 1, 2, 2, 2, 3])); // 34
console.log(dieSimulator(2, [1, 1, 1, 1, 1, 1])); // 30
console.log(dieSimulator(1, [1, 1, 2, 2, 2, 3])); // 6
console.log(dieSimulator(3, [1, 1, 1, 2, 2, 3])); // 181
console.log(dieSimulator_memo(2, [1, 1, 2, 2, 2, 3])); // 34
```

---

## 🔗 Related Problems / Bài Liên Quan

| #    | Problem                                                                           | Difficulty | Pattern |
| ---- | --------------------------------------------------------------------------------- | ---------- | ------- |
| 935  | [Knight Dialer](https://leetcode.com/problems/knight-dialer)                      | 🟡 Medium  | DP      |
| 2266 | [Count Number of Texts](https://leetcode.com/problems/count-number-of-texts)      | 🟡 Medium  | DP      |
| 1223 | [Dice Roll Simulation (same)](https://leetcode.com/problems/dice-roll-simulation) | 🔴 Hard    | DP      |
