---
layout: page
title: "Matchsticks to Square"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/matchsticks-to-square"
---

# Matchsticks to Square / Que Diêm Tạo Hình Vuông

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Backtracking / Bitmask DP
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Như chia 4 nhóm học sinh có điểm bằng nhau — thử từng cách phân nhóm. Sắp xếp giảm dần để sớm phát hiện nếu không hợp lệ (pruning quan trọng cho tốc độ).

**Pattern Recognition:**

- Signal: "partition array into 4 equal-sum subsets" → Backtracking with pruning OR bitmask DP
- Sort descending for pruning: reject early if matchstick > side length
- Bitmask DP: `dp[mask]` = current accumulated sum mod side — if dp[fullMask]=0, success

**Visual:**

```
matchsticks = [1,1,2,2,2], side = 2
Backtracking: assign each stick to one of 4 sides (0..3)
sides=[0,0,0,0]: try 2→side0=[2], try 2→side1=[2], try 2→side2=[2], try 1→side3=[1], try 1→side3=[2] ✓
Bitmask: dp[11111] = (1+1+2+2+2) % 2 = 0 ✓ if no step exceeded 2
```

## Problem Description

Given `matchsticks` (each used exactly once), can we form a square where each side uses some matchsticks?

- Example 1: `matchsticks = [1,1,2,2,2]` → `true`
- Example 2: `matchsticks = [3,3,3,3,4]` → `false`
- Constraints: `1 ≤ matchsticks.length ≤ 15`, `1 ≤ matchsticks[i] ≤ 10^8`

## 📝 Interview Tips

1. **Clarify**: Mỗi que chỉ dùng 1 lần, không bẻ gãy / Each stick used exactly once, cannot be broken
2. **Approach**: Backtracking với pruning (sort giảm, skip duplicate sides) / Backtracking + bitmask DP
3. **Edge cases**: Sum not divisible by 4 → false; any stick > side → false; n=4 all equal → true
4. **Optimize**: Bitmask DP O(n \* 2^n) is deterministic; backtracking faster with good pruning
5. **Test**: [1,1,2,2,2]→true; [3,3,3,3,4]→false; [1,1,1,1]→true
6. **Follow-up**: Partition into k equal subsets (generalization)?

## Solutions

```typescript
/** Solution 1: Backtracking with pruning
 * Time: O(4^n) worst case, much better with pruning | Space: O(n)
 */
function makesquare(matchsticks: number[]): boolean {
  const total = matchsticks.reduce((a, b) => a + b, 0);
  if (total % 4 !== 0) return false;
  const side = total / 4;

  // Sort descending: bigger sticks first for early pruning
  matchsticks.sort((a, b) => b - a);
  if (matchsticks[0] > side) return false;

  const sides = [0, 0, 0, 0];

  function bt(idx: number): boolean {
    if (idx === matchsticks.length) {
      return sides[0] === side && sides[1] === side && sides[2] === side;
    }

    const seen = new Set<number>();
    for (let i = 0; i < 4; i++) {
      if (seen.has(sides[i])) continue; // avoid duplicate branches
      if (sides[i] + matchsticks[idx] > side) continue; // overflow prune
      seen.add(sides[i]);
      sides[i] += matchsticks[idx];
      if (bt(idx + 1)) return true;
      sides[i] -= matchsticks[idx];
    }
    return false;
  }

  return bt(0);
}

/** Solution 2: Bitmask DP
 * Time: O(n * 2^n) | Space: O(2^n)
 * dp[mask] = accumulated sum mod side for current side being filled
 * -1 means this mask is unreachable
 */
function makesquare2(matchsticks: number[]): boolean {
  const n = matchsticks.length;
  const total = matchsticks.reduce((a, b) => a + b, 0);
  if (total % 4 !== 0) return false;
  const side = total / 4;

  const dp = new Array(1 << n).fill(-1);
  dp[0] = 0;

  for (let mask = 0; mask < 1 << n; mask++) {
    if (dp[mask] === -1) continue;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue; // already used
      const newSum = dp[mask] + matchsticks[i];
      if (newSum <= side) {
        const newMask = mask | (1 << i);
        dp[newMask] = newSum % side; // % side = reset to 0 when side completes
      }
    }
  }

  return dp[(1 << n) - 1] === 0;
}

/** Solution 3: Bitmask DP with precomputed subset sums (cleaner)
 * Time: O(n * 2^n) | Space: O(2^n)
 */
function makesquare3(matchsticks: number[]): boolean {
  const n = matchsticks.length;
  const total = matchsticks.reduce((a, b) => a + b, 0);
  if (total % 4 !== 0) return false;
  const side = total / 4;

  // Precompute sum of each mask
  const sums = new Array(1 << n).fill(0);
  for (let mask = 1; mask < 1 << n; mask++) {
    const lsb = mask & -mask;
    const idx = Math.log2(lsb);
    sums[mask] = sums[mask ^ lsb] + matchsticks[idx];
  }

  // A mask is "valid for one side" if its sum === side
  // We need to partition all n elements into 4 groups each summing to side
  const dp = new Array(1 << n).fill(false);
  dp[0] = true;

  for (let mask = 1; mask < 1 << n; mask++) {
    // Try all submasks of mask that sum to side
    for (let sub = mask; sub > 0; sub = (sub - 1) & mask) {
      if (sums[sub] === side && dp[mask ^ sub]) {
        dp[mask] = true;
        break;
      }
    }
  }

  return dp[(1 << n) - 1];
}

// Tests
console.log(makesquare([1, 1, 2, 2, 2])); // true
console.log(makesquare([3, 3, 3, 3, 4])); // false
console.log(makesquare([1, 1, 1, 1])); // true
console.log(makesquare2([1, 1, 2, 2, 2])); // true
console.log(makesquare2([3, 3, 3, 3, 4])); // false
console.log(makesquare3([1, 1, 2, 2, 2])); // true
```

## 🔗 Related Problems

| Problem                                                                                            | Relationship                    |
| -------------------------------------------------------------------------------------------------- | ------------------------------- |
| [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets) | Direct generalization (k sides) |
| [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement)                       | Backtracking with bitmask       |
| [Optimal Account Balancing](https://leetcode.com/problems/optimal-account-balancing)               | Partition DP on subsets         |
