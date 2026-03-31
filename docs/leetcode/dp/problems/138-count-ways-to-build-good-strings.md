---
layout: page
title: "Count Ways To Build Good Strings"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/count-ways-to-build-good-strings"
---

# Count Ways To Build Good Strings / Đếm Số Cách Xây Dựng Chuỗi Tốt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Bottom-Up DP (Unbounded Knapsack style)

## 🧠 Intuition

**VI:** Giống bài toán đếm số cách leo cầu thang — nhưng thay vì bước 1 hoặc 2, bạn có thể thêm khối 0-bit kích thước `zero` hoặc khối 1-bit kích thước `one`. Đếm tất cả độ dài chuỗi nằm trong `[low, high]`.

```
zero=1, one=2, low=3, high=4

dp[i] = number of ways to form a string of length i

dp[0] = 1  (empty string — base case)
dp[1] = dp[1-1] = dp[0] = 1   (appended zero-block of size 1)
dp[2] = dp[2-1] + dp[2-2]     (zero-block: dp[1], one-block: dp[0]) = 2
dp[3] = dp[3-1] + dp[3-2]     = dp[2] + dp[1] = 3
dp[4] = dp[4-1] + dp[4-2]     = dp[3] + dp[2] = 5

Answer = sum of dp[low..high] = dp[3] + dp[4] = 3 + 5 = 8
```

## 📝 Interview Tips

- 🔑 **EN:** `dp[i]` = number of valid strings of **exactly** length `i`; base case `dp[0] = 1` | **VI:** `dp[0] = 1` là trường hợp cơ sở (chuỗi rỗng), mọi thứ xây từ đây
- 🔑 **EN:** Transition: `dp[i] += dp[i-zero]` if `i >= zero`; `dp[i] += dp[i-one]` if `i >= one` | **VI:** Thêm 2 nguồn: khối zero và khối one
- 🔑 **EN:** Sum `dp[low..high]` — not just `dp[high]` | **VI:** Cộng dồn từ `low` đến `high`, không phải chỉ lấy `dp[high]`
- 🔑 **EN:** Use `MOD = 1e9+7` throughout (constraints: up to 1e5) | **VI:** Nhớ lấy mod sau mỗi phép cộng
- 🔑 **EN:** This is essentially unbounded knapsack counting with items of sizes `zero` and `one` | **VI:** Bản chất là đếm tổ hợp knapsack không giới hạn với 2 loại vật phẩm
- 🔑 **EN:** Time O(high), Space O(high) — very efficient | **VI:** Độ phức tạp O(high) — rất hiệu quả

## Solutions

```typescript
const MOD_138 = 1_000_000_007;

// ─── Solution 1: Top-Down Memoization ─────────────────────────────────────
function countWaysTopDown(low: number, high: number, zero: number, one: number): number {
  const memo = new Map<number, number>();

  function dp(len: number): number {
    if (len > high) return 0;
    if (memo.has(len)) return memo.get(len)!;
    // Count this length if valid
    let ways = len >= low ? 1 : 0;
    // Extend by appending a zero-block or one-block
    ways = (ways + dp(len + zero)) % MOD_138;
    ways = (ways + dp(len + one)) % MOD_138;
    memo.set(len, ways);
    return ways;
  }

  return dp(0);
}

// ─── Solution 2: Bottom-Up DP — O(high) time, O(high) space ──────────────
function countWays(low: number, high: number, zero: number, one: number): number {
  // dp[i] = number of distinct strings of exactly length i
  const dp = new Array(high + 1).fill(0);
  dp[0] = 1; // base: empty string

  for (let i = 1; i <= high; i++) {
    if (i >= zero) dp[i] = (dp[i] + dp[i - zero]) % MOD_138;
    if (i >= one) dp[i] = (dp[i] + dp[i - one]) % MOD_138;
  }

  // Sum all valid lengths in [low, high]
  let ans = 0;
  for (let i = low; i <= high; i++) {
    ans = (ans + dp[i]) % MOD_138;
  }
  return ans;
}

// ─── Tests ─────────────────────────────────────────────────────────────────
console.log(countWays(3, 3, 1, 1)); // 8  (any 3-char string of 0s and 1s)
console.log(countWays(2, 3, 1, 2)); // 5
console.log(countWays(1, 1, 1, 1)); // 2  (strings "0" and "1")
console.log(countWaysTopDown(3, 3, 1, 1)); // 8
console.log(countWaysTopDown(2, 3, 1, 2)); // 5
```

## 🔗 Related Problems

| #   | Title                    | Difficulty | Connection                                       |
| --- | ------------------------ | ---------- | ------------------------------------------------ |
| 70  | Climbing Stairs          | 🟢 Easy    | Same unbounded "sum of ways" recurrence          |
| 746 | Min Cost Climbing Stairs | 🟢 Easy    | Add cost dimension to same pattern               |
| 322 | Coin Change              | 🟡 Medium  | Unbounded knapsack — count ways with fixed items |
| 518 | Coin Change II           | 🟡 Medium  | Count combinations with unbounded items          |
