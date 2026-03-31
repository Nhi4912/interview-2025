---
layout: page
title: "Number of Ways to Build Sturdy Brick Wall"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/number-of-ways-to-build-sturdy-brick-wall"
---

# Number of Ways to Build Sturdy Brick Wall / Số Cách Xây Tường Gạch Vững Chắc

🟡 Medium | Row Pattern DP | LeetCode 2184

## 🧠 Intuition / Tư Duy

**Tiếng Việt:** Xây tường height × width. Mỗi hàng là một tổ hợp của các viên gạch có tổng bằng width. Hai hàng liền kề không được có vết nứt chung (trừ hai đầu). Tư duy: tạo tất cả mẫu hàng hợp lệ, sau đó DP theo từng hàng.

```
width=3, height=2, bricks=[1,2]
Valid rows: [1,1,1], [1,2], [2,1]
         crack positions (as bitmask, bit j = crack after j bricks):
[1,1,1]: cracks at 1,2 → mask = 0b110 = 6
[1,2]:   crack at 1    → mask = 0b010 = 2
[2,1]:   crack at 2    → mask = 0b100 = 4

Compatible pairs (no shared cracks):
  6 & 2 = 2 ≠ 0 → NOT compatible
  6 & 4 = 4 ≠ 0 → NOT compatible
  2 & 4 = 0 → compatible! (row [1,2] + row [2,1])
  2 & 2 = 2 → not compatible (same row pattern stacked is ok? NO, cracks align)

Wait: 2 & 4 = 0 means [1,2] can be next to [2,1]. 2 rows: 2 ways?
Actually [1,2]+[2,1] and [2,1]+[1,2] → 2 ways. Answer = 2.
```

## Problem Description

Build a wall of height `n` and width `width`. Each row is made of bricks with sizes from `bricks` array (heights all 1, can reuse). A wall is **sturdy** if no two adjacent rows share an interior crack position. Return number of sturdy walls modulo `10^9 + 7`.

**Example 1:**

- Input: `height = 2`, `width = 3`, `bricks = [1,2]`
- Output: `2`

**Example 2:**

- Input: `height = 1`, `width = 1`, `bricks = [1]`
- Output: `1`

## 📝 Interview Tips

- 🎯 **Key insight / Chìa khoá:** Enumerate valid row patterns (compositions of `width` using given brick sizes), encode as crack bitmask, then DP layer by layer
- 📊 **Crack bitmask / Bitmask vết nứt:** Bit j=1 means there's a crack after j bricks (interior only, not at endpoints)
- 🔢 **Compatibility / Tương thích:** Two rows compatible iff `mask1 & mask2 == 0` (no shared crack positions)
- ⚡ **Complexity / Độ phức tạp:** O(R² × height) where R = number of valid row patterns; R can be exponential but usually small
- 🚫 **Edge case / Trường hợp đặc biệt:** `width = 1` — only one brick of size 1, single row pattern, all rows identical → compatible with each other? Only if R=1, mask=0 (no cracks), 0&0=0 → valid!
- 💡 **Precompute compat / Tính trước tương thích:** For each pair of patterns, check compatibility once; store adjacency list for DP

## Solutions

```typescript
/**
 * Approach 1: Generate row patterns, precompute compatibility, then layer DP
 * Time: O(R² + R*height) where R = num valid patterns
 * Space: O(R²)
 */
function buildWall(height: number, width: number, bricks: number[]): number {
  const MOD = 1_000_000_007;

  // Generate all valid row patterns as crack bitmasks
  const patterns: number[] = [];

  function generate(pos: number, mask: number): void {
    if (pos === width) {
      patterns.push(mask);
      return;
    }
    for (const b of bricks) {
      if (pos + b <= width) {
        // Add crack at pos+b if it's not the right edge
        const newMask = pos + b < width ? mask | (1 << (pos + b - 1)) : mask;
        generate(pos + b, newMask);
      }
    }
  }

  generate(0, 0);

  const R = patterns.length;
  if (R === 0) return 0;

  // Precompute compatibility
  const compat: number[][] = Array.from({ length: R }, () => []);
  for (let i = 0; i < R; i++) {
    for (let j = 0; j < R; j++) {
      if ((patterns[i] & patterns[j]) === 0) {
        compat[i].push(j);
      }
    }
  }

  // DP: dp[i] = number of ways to build up to current row ending with pattern i
  let dp = new Array(R).fill(1);

  for (let row = 1; row < height; row++) {
    const ndp = new Array(R).fill(0);
    for (let j = 0; j < R; j++) {
      for (const i of compat[j]) {
        ndp[j] = (ndp[j] + dp[i]) % MOD;
      }
    }
    dp = ndp;
  }

  return dp.reduce((a, b) => (a + b) % MOD, 0);
}

console.log(buildWall(2, 3, [1, 2])); // 2
console.log(buildWall(1, 1, [1])); // 1
console.log(buildWall(2, 2, [1])); // 1 (only one row pattern [1,1])
console.log(buildWall(3, 3, [1, 2])); // some number
```

```typescript
/**
 * Approach 2: Map-based deduplication of patterns
 * Time: O(R * height)
 * Space: O(R)
 *
 * If bricks have duplicates or many options, some patterns may appear
 * multiple times via different brick combinations — deduplicate.
 */
function buildWall2(height: number, width: number, bricks: number[]): number {
  const MOD = 1_000_000_007;
  const brickSet = [...new Set(bricks)].sort((a, b) => a - b);

  const patternSet = new Set<number>();

  function gen(pos: number, mask: number): void {
    if (pos === width) {
      patternSet.add(mask);
      return;
    }
    for (const b of brickSet) {
      if (pos + b > width) break;
      const crackMask = pos + b < width ? mask | (1 << (pos + b - 1)) : mask;
      gen(pos + b, crackMask);
    }
  }

  gen(0, 0);

  const patterns = [...patternSet];
  const R = patterns.length;

  // Precompute adjacency
  const adj: number[][] = Array.from({ length: R }, () => []);
  for (let i = 0; i < R; i++) {
    for (let j = 0; j < R; j++) {
      if ((patterns[i] & patterns[j]) === 0) adj[i].push(j);
    }
  }

  let dp = new Array(R).fill(1);
  for (let h = 1; h < height; h++) {
    const ndp = new Array(R).fill(0);
    for (let j = 0; j < R; j++) {
      for (const i of adj[j]) {
        ndp[j] = (ndp[j] + dp[i]) % MOD;
      }
    }
    dp = ndp;
  }

  return dp.reduce((s, v) => (s + v) % MOD, 0);
}

console.log(buildWall2(2, 3, [1, 2])); // 2
console.log(buildWall2(1, 1, [1])); // 1
```

```typescript
/**
 * Approach 3: Verify by brute-force for small inputs
 * Time: O(R^height) — only for testing
 */
function buildWallBrute(height: number, width: number, bricks: number[]): number {
  const MOD = 1_000_000_007;
  const patterns: number[] = [];

  const gen = (pos: number, mask: number): void => {
    if (pos === width) {
      patterns.push(mask);
      return;
    }
    for (const b of bricks) {
      if (pos + b <= width) {
        const m = pos + b < width ? mask | (1 << (pos + b - 1)) : mask;
        gen(pos + b, m);
      }
    }
  };
  gen(0, 0);

  let count = 0;
  const R = patterns.length;

  const dfs = (row: number, prevMask: number): void => {
    if (row === height) {
      count = (count + 1) % MOD;
      return;
    }
    for (const m of patterns) {
      if ((m & prevMask) === 0) dfs(row + 1, m);
    }
  };

  // Start from row 0 with "no previous constraints"
  for (const m of patterns) dfs(1, m);
  return count;
}

console.log(buildWallBrute(2, 3, [1, 2])); // 2
console.log(buildWallBrute(1, 1, [1])); // 1
```

## 🔗 Related Problems

| Problem                                                                                                                 | Difficulty | Key Concept        |
| ----------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Tiling a Rectangle with the Fewest Squares](https://leetcode.com/problems/tiling-a-rectangle-with-the-fewest-squares/) | 🔴 Hard    | Bitmask DP on rows |
| [Domino and Tromino Tiling](https://leetcode.com/problems/domino-and-tromino-tiling/)                                   | 🟡 Medium  | Row DP             |
| [Count Vowels Permutation](https://leetcode.com/problems/count-vowels-permutation/)                                     | 🟡 Medium  | State machine DP   |
| [Student Attendance Record II](https://leetcode.com/problems/student-attendance-record-ii/)                             | 🔴 Hard    | State machine DP   |
