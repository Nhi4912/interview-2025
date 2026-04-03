---
layout: page
title: "Number of Ways to Wear Different Hats to Each Other"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/number-of-ways-to-wear-different-hats-to-each-other"
---

# number of ways to wear different hats to each other

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Có 40 chiếc mũ và tối đa 10 người. Thay vì "người nào đội mũ gì", ta lật chiều: **duyệt từng chiếc mũ** và quyết định ai được đội nó. Bitmask theo **người** (tối đa 10 người = 2^10 = 1024 trạng thái) — rất nhỏ!

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
Hats processed: 1 → 2 → 3 → ... → 40
                ↓
Mask: 000 (nobody) → 001 (person 0) → 011 (p0,p1) → 111 (all 3)

Key: iterate hats (outer loop), not people → prevents assigning 2 hats to 1 person
```

**Key insight:** n ≤ 10 → bitmask over **people**. 40 hats is the outer dimension. `dp[mask]` = ways to assign hats 1..h such that people-in-mask have exactly one hat each.

---

---

## Problem Description

Given `n` people (≤10) and hats 1–40. Each person has a preferred hat list. Count assignments where every person wears a **different** hat (from their list). Return result mod 10^9+7.

- Example: `hats = [[3,4],[4,5],[5]]` → **1** (person 0 wears hat 3, person 1 wears hat 4, person 2 wears hat 5)
- Example: `hats = [[3,5,1],[3,5]]` → **4**

---

---

## 📝 Interview Tips

- 🎯 **Flip dimensions**: iterate hats (40) not people (10); prevents double hat assignment naturally
- 🎯 **Bitmask DP**: `dp[mask]` = ways to have assigned one hat to each person in the mask
- 🎯 **Transition**: for hat h, option A: skip it; option B: give it to some person p who likes h (p not in mask)
- 🎯 **Target state**: `full = (1<<n) - 1` — all people have a hat
- 🎯 **Copy array**: `next = [...dp]` before processing each hat (skip option)
- 🎯 **Complexity**: O(40 × 2^n × n) time, O(2^n) space — well within limits

---

---

## Solutions

```typescript
function numberWays(hats: number[][]): number {
  const MOD = 1_000_000_007n;
  const n = hats.length;
  const full = (1 << n) - 1;

  // Build reverse map: hat → list of people who like it
  const hatToPeople: number[][] = Array.from({ length: 41 }, () => []);
  for (let p = 0; p < n; p++) {
    for (const h of hats[p]) hatToPeople[h].push(p);
  }

  // dp[mask] = number of ways to have people-in-mask assigned unique hats from hats 1..h
  const dp = new Array<bigint>(full + 1).fill(0n);
  dp[0] = 1n; // base: 0 hats assigned, nobody has a hat

  for (let h = 1; h <= 40; h++) {
    // process in reverse to avoid using hat h twice in same step
    const next = [...dp]; // "skip hat h" option
    for (const p of hatToPeople[h]) {
      for (let mask = 0; mask <= full; mask++) {
        if ((mask >> p) & 1) continue; // person p already has a hat
        const newMask = mask | (1 << p);
        next[newMask] = (next[newMask] + dp[mask]) % MOD;
      }
    }
    // replace dp with next
    for (let mask = 0; mask <= full; mask++) dp[mask] = next[mask];
  }

  return Number(dp[full]);
}

function numberWaysMemo(hats: number[][]): number {
  const MOD = 1_000_000_007;
  const n = hats.length;
  const full = (1 << n) - 1;

  const hatToPeople: number[][] = Array.from({ length: 41 }, () => []);
  for (let p = 0; p < n; p++) {
    for (const h of hats[p]) hatToPeople[h].push(p);
  }

  const memo = new Map<number, number>();

  function solve(hat: number, mask: number): number {
    if (mask === full) return 1;
    if (hat > 40) return 0;
    const key = hat * 1024 + mask;
    if (memo.has(key)) return memo.get(key)!;

    let ways = solve(hat + 1, mask); // skip hat
    for (const p of hatToPeople[hat]) {
      if (!((mask >> p) & 1)) {
        ways = (ways + solve(hat + 1, mask | (1 << p))) % MOD;
      }
    }
    memo.set(key, ways);
    return ways;
  }

  return solve(1, 0);
}

function numberWaysCompact(hats: number[][]): number {
  const MOD = 1_000_000_007;
  const n = hats.length;
  const full = (1 << n) - 1;
  const hatToPeople: number[][] = Array.from({ length: 41 }, () => []);
  for (let p = 0; p < n; p++) for (const h of hats[p]) hatToPeople[h].push(p);

  let dp = new Array(full + 1).fill(0);
  dp[0] = 1;

  for (let h = 1; h <= 40; h++) {
    const nx = [...dp];
    for (const p of hatToPeople[h]) {
      for (let m = full; m >= 0; m--) {
        if (dp[m] && !((m >> p) & 1)) {
          nx[m | (1 << p)] = (nx[m | (1 << p)] + dp[m]) % MOD;
        }
      }
    }
    dp = nx;
  }
  return dp[full];
}
```

---

## 🔗 Related Problems

| Problem                                                                                            | Difficulty | Key Technique |
| -------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [1494. Parallel Courses II](https://leetcode.com/problems/parallel-courses-ii/)                    | Hard       | Bitmask DP    |
| [691. Stickers to Spell Word](https://leetcode.com/problems/stickers-to-spell-word/)               | Hard       | Bitmask DP    |
| [526. Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement/)                 | Medium     | Bitmask DP    |
| [943. Find the Shortest Superstring](https://leetcode.com/problems/find-the-shortest-superstring/) | Hard       | Bitmask DP    |
