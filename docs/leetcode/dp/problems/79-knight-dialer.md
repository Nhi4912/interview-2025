---
layout: page
title: "Knight Dialer"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/knight-dialer"
---

# Knight Dialer / Quân Mã Quay Số

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Maximal Square](https://leetcode.com/problems/maximal-square)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như quân mã nhảy trên bàn phím điện thoại — từ mỗi phím, quân mã chỉ có thể nhảy đến một số phím cố định. Đếm số chuỗi điện thoại dài n khác nhau bằng cách tích lũy qua từng bước nhảy.

**Pattern Recognition:**

- Signal: "count paths of length n on a fixed graph" → **DP trên trạng thái vị trí**
- `dp[step][digit]` = số chuỗi độ dài step kết thúc tại chữ số digit
- Transition: `dp[step][next] += dp[step-1][curr]` với mỗi cạnh curr→next

**Visual — Knight moves on phone keypad:**

```
Phone keypad:   Knight adjacency:
1  2  3         0 → [4, 6]     6 → [0, 1, 7]
4  5  6         1 → [6, 8]     7 → [2, 6]
7  8  9         2 → [7, 9]     8 → [1, 3]
   0            3 → [4, 8]     9 → [2, 4]
                4 → [0, 3, 9]  5 → []
```

---

## Problem Description

A knight starts at any digit on a phone keypad and makes exactly `n-1` knight moves. Count how many distinct phone numbers of length `n` can be dialed. Return the answer modulo 10^9+7. ([LeetCode 935](https://leetcode.com/problems/knight-dialer))

**Example 1:** `n = 1` → `10` (each single digit is valid)

**Example 2:** `n = 2` → `20` (each digit has some reachable neighbors)

**Example 3:** `n = 3131` → `136006598`

Constraints: `1 <= n <= 5000`

---

## 📝 Interview Tips

1. **Clarify**: "Quân mã bắt đầu ở bất kỳ phím nào; chữ số 5 không có nước đi hợp lệ" / Knight can start anywhere; digit 5 has no valid moves
2. **Precompute moves**: "Hardcode adjacency cho 10 số — tránh tính lại mỗi lần" / Pre-define the 10-digit adjacency list
3. **DP direction**: "Tính forward: dp[step] từ dp[step-1] bằng cách phân phối forward" / Forward propagation from source digits
4. **Space optimize**: "Chỉ cần dp hiện tại và dp trước — hai mảng 10 phần tử" / Two arrays of size 10 suffice; no 2D table needed
5. **Modular arithmetic**: "Cộng modulo 10^9+7 ở mỗi bước để tránh overflow" / Apply MOD at each addition step
6. **Edge case**: "n=1 → 10 (mọi digit đều hợp lệ); kiểm tra với n nhỏ trước" / n=1 gives 10; verify dp[0]=1 for all digits

---

## Solutions

```typescript
/**
 * Solution 1: DP with full 2D table (explicit, for clarity)
 * Time: O(n * 10) = O(n) — n steps, 10 digits each
 * Space: O(n * 10) = O(n)
 */
function knightDialerDP2D(n: number): number {
  const MOD = 1_000_000_007;
  const moves = [[4, 6], [6, 8], [7, 9], [4, 8], [0, 3, 9], [], [0, 1, 7], [2, 6], [1, 3], [2, 4]];
  const dp: number[][] = Array.from({ length: n }, () => new Array(10).fill(0));
  dp[0].fill(1); // Step 1: start at any digit

  for (let step = 1; step < n; step++) {
    for (let curr = 0; curr < 10; curr++) {
      for (const next of moves[curr]) {
        dp[step][next] = (dp[step][next] + dp[step - 1][curr]) % MOD;
      }
    }
  }

  return dp[n - 1].reduce((s, v) => (s + v) % MOD, 0);
}

/**
 * Solution 2: DP with rolling arrays — space optimized
 * Time: O(n) — n iterations over 10 digits
 * Space: O(1) — two arrays of constant size 10
 */
function knightDialer(n: number): number {
  const MOD = 1_000_000_007;
  const moves = [[4, 6], [6, 8], [7, 9], [4, 8], [0, 3, 9], [], [0, 1, 7], [2, 6], [1, 3], [2, 4]];

  let dp = new Array(10).fill(1); // length-1 sequences: one per digit

  for (let step = 1; step < n; step++) {
    const next = new Array(10).fill(0);
    for (let curr = 0; curr < 10; curr++) {
      for (const neighbor of moves[curr]) {
        next[neighbor] = (next[neighbor] + dp[curr]) % MOD;
      }
    }
    dp = next;
  }

  return dp.reduce((s, v) => (s + v) % MOD, 0);
}

// === Test Cases ===
console.log(knightDialer(1)); // 10
console.log(knightDialer(2)); // 20
console.log(knightDialer(3)); // 46
console.log(knightDialer(3131)); // 136006598
```

---

## 🔗 Related Problems

| Problem                                                                                                                                              | Difficulty | Pattern             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| [Unique Paths](https://leetcode.com/problems/unique-paths)                                                                                           | 🟡 Medium  | DP on grid          |
| [Number of Ways to Stay in the Same Place After Some Steps](https://leetcode.com/problems/number-of-ways-to-stay-in-the-same-place-after-some-steps) | 🔴 Hard    | DP state transition |
| [Jump Game IV](https://leetcode.com/problems/jump-game-iv)                                                                                           | 🔴 Hard    | BFS on graph        |
| [Maximal Square](https://leetcode.com/problems/maximal-square)                                                                                       | 🟡 Medium  | DP                  |
| [Count Vowels Permutation](https://leetcode.com/problems/count-vowels-permutation)                                                                   | 🔴 Hard    | DP finite automaton |
