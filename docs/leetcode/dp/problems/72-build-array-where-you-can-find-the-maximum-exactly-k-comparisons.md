---
layout: page
title: "Build Array Where You Can Find The Maximum Exactly K Comparisons"
difficulty: Hard
category: Dynamic Programming
tags: [Dynamic Programming, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/build-array-where-you-can-find-the-maximum-exactly-k-comparisons"
---

# Build Array Where You Can Find The Maximum Exactly K Comparisons / Xây Dựng Mảng Với Đúng K Lần So Sánh Để Tìm Maximum

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: 3D DP + Prefix Sum
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum) | [Strange Printer](https://leetcode.com/problems/strange-printer)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Xây dựng mảng từng phần tử một, theo dõi 3 thứ: (1) đã điền bao nhiêu phần tử, (2) giá trị lớn nhất hiện tại, (3) đã cập nhật max bao nhiêu lần. Đây là bài 3D DP kinh điển.

**Pattern Recognition:**

- `dp[i][j][m]` = số mảng độ dài `i`, phần tử cuối có max = `j`, đã search_cost = `m`
- Transition: thêm phần tử tiếp theo ≤ j (không tăng cost) hoặc > j (tăng cost, cập nhật max)
- Dùng prefix sum để tối ưu từ O(n*m^2*k) xuống O(n*m*k)

**Visual — 3D DP:**

```
n=2, m=3, k=2 → count arrays [a,b] with length=2, max value in 1..3,
                 search_cost = exactly 2

dp[1][j][1] = 1 for each j in 1..3  (single element, cost=1 always)

dp[2][j][m]:
  - Prev was also j (≤j): sum dp[1][1..j][m] * j ... (using prefix sum)
  - Prev was < j (new max j): sum dp[1][1..j-1][m-1]

Answer: sum dp[n][j][k] for j in 1..m
```

---

## Problem Description

Given three integers `n`, `m`, and `k`, count arrays of length `n` where each element is in `[1, m]` and the **search cost** equals exactly `k`. The search cost is the number of times a new maximum is seen when scanning left to right. Return the count modulo `10^9 + 7`. ([LeetCode #1420](https://leetcode.com/problems/build-array-where-you-can-find-the-maximum-exactly-k-comparisons))

**Example 1:** `n=2, m=3, k=1` → `6` (arrays where max appears once: [3,3],[3,2],[3,1],[2,2],[2,1],[1,1])
**Example 2:** `n=5, m=2, k=3` → `0` (k > m is impossible)

Constraints: `1 <= n <= 50`, `1 <= m <= 100`, `0 <= k <= n`

---

## 📝 Interview Tips

1. **Clarify**: "search_cost = số lần giá trị mới là maximum mới khi quét từ trái / Count new maxima seen"
2. **3D state**: "dp[i][j][c] = số mảng dài i, max hiện tại là j, đã gặp c lần maximum mới / Three-state DP"
3. **Transition**: "Thêm phần tử ≤ j → không tăng c. Thêm phần tử j' > j → tăng c, max=j' / Split by whether new element is new max"
4. **Prefix sum**: "Tính trước prefix dp[i-1][1..j][c] để tối ưu O(m) → O(1) lookup / Prefix sum on max dimension"
5. **Base case**: "dp[1][j][1] = 1 cho mọi j (1 phần tử đầu tiên luôn là max mới) / First element always creates 1 cost"
6. **Edge cases**: "k=0 → 0 (không thể, luôn có ít nhất 1 max mới), k > m → 0 / k=0 impossible, k>m impossible"

---

## Solutions

```typescript
/**
 * Solution 1: 3D DP with Prefix Sum Optimization
 * Time: O(n * m * k) — with prefix sum eliminating inner loop
 * Space: O(n * m * k) — dp table (can be reduced to O(m*k))
 */
function numOfArrays(n: number, m: number, k: number): number {
  const MOD = 1_000_000_007;

  // dp[i][j][c] = # arrays of length i, current max = j, search_cost = c
  // Use rolling: only need prev layer (i-1)
  let dp: number[][][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: k + 1 }, () => 0),
  );
  // Base: length 1 → dp[j][1] = 1 for j in 1..m
  for (let j = 1; j <= m; j++) dp[j][1] = 1;

  for (let i = 2; i <= n; i++) {
    // prefix[j][c] = sum of dp[1..j][c] (prefix sum over max values)
    const prefix: number[][] = Array.from({ length: m + 2 }, () => new Array(k + 1).fill(0));
    for (let j = 1; j <= m; j++) {
      for (let c = 0; c <= k; c++) {
        prefix[j][c] = (prefix[j - 1][c] + dp[j][c]) % MOD;
      }
    }

    const newDp: number[][] = Array.from({ length: m + 1 }, () => new Array(k + 1).fill(0));
    for (let j = 1; j <= m; j++) {
      for (let c = 1; c <= k; c++) {
        // Case 1: new element <= j (don't increase max, cost unchanged)
        newDp[j][c] = (newDp[j][c] + dp[j][c] * j) % MOD;
        // Case 2: new element = j, previous max was < j (new max, cost+1)
        // sum of dp[prev_max in 1..j-1][c-1]
        newDp[j][c] = (newDp[j][c] + prefix[j - 1][c - 1]) % MOD;
      }
    }
    dp = newDp;
  }

  let ans = 0;
  for (let j = 1; j <= m; j++) ans = (ans + dp[j][k]) % MOD;
  return ans;
}

/**
 * Solution 2: Top-Down Memoization (readable)
 * Time: O(n * m * k)
 * Space: O(n * m * k)
 */
function numOfArraysMemo(n: number, m: number, k: number): number {
  const MOD = 1_000_000_007;
  const memo = new Map<string, number>();

  function dp(pos: number, maxSoFar: number, cost: number): number {
    if (pos === n) return cost === k ? 1 : 0;
    if (cost > k) return 0;
    const key = `${pos},${maxSoFar},${cost}`;
    if (memo.has(key)) return memo.get(key)!;

    let res = 0;
    for (let v = 1; v <= m; v++) {
      if (v <= maxSoFar) {
        res = (res + dp(pos + 1, maxSoFar, cost)) % MOD;
      } else {
        res = (res + dp(pos + 1, v, cost + 1)) % MOD;
      }
    }
    memo.set(key, res);
    return res;
  }

  return dp(0, 0, 0);
}

// === Test Cases ===
console.log(numOfArrays(2, 3, 1)); // 6
console.log(numOfArrays(5, 2, 3)); // 0
console.log(numOfArrays(9, 1, 1)); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                    | Pattern            | Difficulty |
| ---------------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum)                           | DP + Binary Search | Hard       |
| [Strange Printer](https://leetcode.com/problems/strange-printer)                                           | Interval DP        | Hard       |
| [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i)   | DP + Prefix Sum    | Hard       |
| [Find the Count of Monotonic Pairs II](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii) | DP + Prefix Sum    | Hard       |
