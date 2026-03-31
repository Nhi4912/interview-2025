---
layout: page
title: "Perfect Squares"
difficulty: Medium
category: Tree-Graph
tags: [Math, Dynamic Programming, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/perfect-squares"
---

# Perfect Squares / Số Bình Phương Hoàn Hảo

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) | [Fibonacci Number](https://leetcode.com/problems/fibonacci-number)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như trả tiền lẻ bằng ít tờ nhất — mỗi "tờ tiền" là số bình phương hoàn hảo (1, 4, 9, 16...). DP xây từ bài nhỏ (n=1) lên bài lớn, giống Coin Change nhưng coins là perfect squares.

**Pattern Recognition:**

- Signal: "minimum count to reach n" + "fixed reusable set" → **DP (Coin Change variant)**
- `dp[i]` = min perfect squares summing to `i`; transition: try each square `j*j ≤ i`
- Key insight: `dp[i] = min over all j: dp[i - j*j] + 1`; Lagrange's theorem → answer ≤ 4

**Visual — dp for n=12:**

```
Squares available: 1, 4, 9

i:    0   1   2   3   4   5   6   7   8   9  10  11  12
dp:   0   1   2   3   1   2   3   4   2   1   2   3   3

dp[12]: try j=1 → dp[11]+1 = 4
        try j=2 → dp[8]+1  = 3  ← min!
        try j=3 → dp[3]+1  = 4
Answer: 3 via (4 + 4 + 4)
```

---

## Problem Description

Given a positive integer `n`, return the minimum number of perfect square numbers (integers that are squares of integers: 1, 4, 9, 16...) that sum to `n`.

- Example 1: `n=12` → `3` (4+4+4)
- Example 2: `n=13` → `2` (4+9)

Constraints: `1 <= n <= 10^4`.

---

## 📝 Interview Tips

1. **Clarify**: "n >= 1 nên luôn có kết quả (tệ nhất là n cái 1)" / n >= 1 guarantees an answer; worst case n ones
2. **Brute force**: "Recursion O(n^(n/2)) → thêm memo → DP" / Recursive try-all, then memoize, then convert to bottom-up
3. **State**: "dp[i] = min squares for i, transition dùng mọi square j\*j <= i" / Define state clearly, list transition formula
4. **BFS alt**: "Coi như shortest path — node=target sum, edge=adding one square" / BFS finds answer = number of levels
5. **Lagrange theorem**: "Mọi số nguyên dương biểu diễn bằng ≤ 4 bình phương" / Answer is always 1, 2, 3, or 4
6. **Edge cases**: "n là perfect square → 1; n=3 → 3 (1+1+1)" / Perfect square n → answer 1; n mod 4 == 0, divide out 4s

---

## Solutions

```typescript
/**
 * Solution 1: BFS — treat as unweighted shortest path
 * Each level adds one perfect square; first time reaching n = answer
 * Time: O(n * sqrt(n)) — n states × branching factor sqrt(n)
 * Space: O(n) — visited set
 */
function numSquaresBFS(n: number): number {
  const visited = new Set<number>([0]);
  let queue: number[] = [0];
  let steps = 0;

  while (queue.length > 0) {
    steps++;
    const next: number[] = [];
    for (const curr of queue) {
      for (let j = 1; j * j <= n; j++) {
        const val = curr + j * j;
        if (val === n) return steps;
        if (val < n && !visited.has(val)) {
          visited.add(val);
          next.push(val);
        }
      }
    }
    queue = next;
  }
  return steps;
}

/**
 * Solution 2: Dynamic Programming — bottom-up, space-efficient
 * Time: O(n * sqrt(n)) — fill n dp entries, each tries sqrt(n) squares
 * Space: O(n) — dp array only
 */
function numSquares(n: number): number {
  const dp = new Array<number>(n + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j * j <= i; j++) {
      dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
    }
  }

  return dp[n];
}

// === Test Cases ===
console.log(numSquares(12)); // 3  (4+4+4)
console.log(numSquares(13)); // 2  (4+9)
console.log(numSquares(1)); // 1  (1)
console.log(numSquares(100)); // 1  (10^2)
```

---

## 🔗 Related Problems

- [Coin Change](https://leetcode.com/problems/coin-change) — identical DP pattern: min coins to make amount
- [Fibonacci Number](https://leetcode.com/problems/fibonacci-number) — simplest DP building on prior results
- [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops) — constrained shortest path DP
- [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum) — 2D DP minimization variant
