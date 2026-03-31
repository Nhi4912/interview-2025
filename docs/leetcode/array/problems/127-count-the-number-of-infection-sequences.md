---
layout: page
title: "Count the Number of Infection Sequences"
difficulty: Hard
category: Array
tags: [Array, Math, Combinatorics]
leetcode_url: "https://leetcode.com/problems/count-the-number-of-infection-sequences"
---

# Count the Number of Infection Sequences / Đếm Số Chuỗi Lây Nhiễm

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Math / Combinatorics
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một dãy nhà, một số nhà đã bị lửa (sick). Lửa lan ra theo cả hai phía từ mỗi nhóm nhà lửa. Câu hỏi là: có bao nhiêu cách để mô tả "lịch sử" ngôi nhà nào bị cháy trước? Đây là bài toán đếm hoán vị có trọng số: phân phối thứ tự lây cho từng "cụm" người khỏe, nhân với số cách lây trong mỗi cụm.

**Pattern Recognition:**

- "Count orderings of independent groups" → Multinomial coefficient
- "Interior group can spread from either end" → multiply by 2^(g-1) per interior group
- Large n → precompute factorials + modular inverse (Fermat's little theorem)

**Visual:**

```
n=5, sick=[0,4]
healthy gaps: none on left boundary, [1,2,3] interior, none on right boundary
gap size g=3 (interior) → 2^(3-1) = 4 ways to infect within group
multinomial = 3!/(3!) = 1
answer = 1 * 4 = 4

n=4, sick=[1]
gaps: [0] (left boundary, size=1), [2,3] (right boundary, size=2)
boundary groups → 1 way each
multinomial(3; 1,2) = 3!/(1!*2!) = 3
answer = 3 * 1 * 1 = 3
```

## Problem Description

`n` children stand in a line (0-indexed). `sick[]` are already infected (sorted). Each second, each infected child can infect one adjacent healthy child. An **infection sequence** is the order in which all healthy children get infected. Return count mod `10^9+7`.

- `n=5, sick=[0,4]` → `4`
- `n=4, sick=[1]` → `3`

## 📝 Interview Tips

1. **Clarify**: Infection can spread to either adjacent child per step / mỗi giây một đứa bị nhiễm có thể lây 1 đứa kề
2. **Approach**: Identify healthy groups between sick children; multinomial \* product of 2^(g-1) for interior groups
3. **Edge cases**: Boundary groups (touching position 0 or n-1) can only spread one way / nhóm biên chỉ lây một chiều
4. **Optimize**: Precompute factorial and modular inverse up to n / tính trước giai thừa và nghịch đảo mod
5. **Follow-up**: What if infection can skip? → different combinatorics model entirely / nếu lây qua nhiều bước
6. **Complexity**: Time O(n), Space O(n) for factorial table / thời gian O(n), không gian O(n)

## Solutions

```typescript
/** Solution 1: Combinatorics with precomputed factorials
 * Time: O(n) | Space: O(n)
 * Key: multinomial(total; g1,...,gk) * product(2^(gi-1)) for interior groups
 */
function numberOfSequence(n: number, sick: number[]): number {
  const MOD = 1_000_000_007n;
  const N = n + 1;

  // Precompute factorials and modular inverses
  const fact = new Array<bigint>(N);
  const inv = new Array<bigint>(N);
  fact[0] = 1n;
  for (let i = 1; i < N; i++) fact[i] = (fact[i - 1] * BigInt(i)) % MOD;
  inv[N - 1] = modpow(fact[N - 1], MOD - 2n, MOD);
  for (let i = N - 2; i >= 0; i--) inv[i] = (inv[i + 1] * BigInt(i + 1)) % MOD;

  // Build healthy group sizes
  const groups: number[] = [];
  // Left boundary group: [0, sick[0]-1]
  if (sick[0] > 0) groups.push({ size: sick[0], boundary: true } as any);
  // Interior groups between consecutive sick children
  for (let i = 1; i < sick.length; i++) {
    const gap = sick[i] - sick[i - 1] - 1;
    if (gap > 0) groups.push({ size: gap, boundary: false } as any);
  }
  // Right boundary group: [sick[last]+1, n-1]
  if (sick[sick.length - 1] < n - 1) {
    groups.push({ size: n - 1 - sick[sick.length - 1], boundary: true } as any);
  }

  const totalHealthy = n - sick.length;
  let ans = fact[totalHealthy]; // multinomial numerator = totalHealthy!

  for (const g of groups as any[]) {
    ans = (ans * inv[g.size]) % MOD; // divide by g.size! in multinomial
    if (!g.boundary && g.size > 1) {
      ans = (ans * modpow(2n, BigInt(g.size - 1), MOD)) % MOD;
    }
  }
  return Number(ans);
}

function modpow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result;
}

/** Solution 2: Cleaner version separating group extraction from calculation
 * Time: O(n) | Space: O(n)
 */
function numberOfSequenceV2(n: number, sick: number[]): number {
  const MOD = 1_000_000_007n;
  const fact: bigint[] = [1n];
  for (let i = 1; i <= n; i++) fact.push((fact[i - 1] * BigInt(i)) % MOD);
  const invFact: bigint[] = new Array(n + 1);
  invFact[n] = modpow(fact[n], MOD - 2n, MOD);
  for (let i = n - 1; i >= 0; i--) invFact[i] = (invFact[i + 1] * BigInt(i + 1)) % MOD;

  const m = sick.length;
  const gaps: Array<[number, boolean]> = []; // [size, isBoundary]

  if (sick[0] > 0) gaps.push([sick[0], true]);
  for (let i = 1; i < m; i++) {
    const g = sick[i] - sick[i - 1] - 1;
    if (g > 0) gaps.push([g, false]);
  }
  if (sick[m - 1] < n - 1) gaps.push([n - 1 - sick[m - 1], true]);

  const total = n - m;
  let ans = fact[total];
  for (const [g, isBoundary] of gaps) {
    ans = (ans * invFact[g]) % MOD;
    if (!isBoundary && g >= 2) ans = (ans * modpow(2n, BigInt(g - 1), MOD)) % MOD;
  }
  return Number(ans);
}

// Test cases
console.log(numberOfSequence(5, [0, 4])); // 4
console.log(numberOfSequence(4, [1])); // 3
console.log(numberOfSequence(3, [0, 2])); // 2
console.log(numberOfSequenceV2(5, [0, 4])); // 4
console.log(numberOfSequenceV2(4, [1])); // 3
console.log(numberOfSequence(6, [2])); // 10
```

## 🔗 Related Problems

| Problem                                                                                          | Relationship                       |
| ------------------------------------------------------------------------------------------------ | ---------------------------------- |
| [Find Triangular Sum of an Array](https://leetcode.com/problems/find-triangular-sum-of-an-array) | Combinatorics + modular arithmetic |
| [Count Anagrams](https://leetcode.com/problems/count-anagrams)                                   | Multinomial coefficient pattern    |
| [Unique Paths](https://leetcode.com/problems/unique-paths)                                       | Combinatorics counting paths       |
