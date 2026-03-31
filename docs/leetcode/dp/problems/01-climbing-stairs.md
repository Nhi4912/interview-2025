---
layout: page
title: "Climbing Stairs"
difficulty: Easy
category: Dynamic Programming
tags: [Dynamic Programming, Math, Memoization]
leetcode_url: "https://leetcode.com/problems/climbing-stairs/"
---

# Climbing Stairs / Leo Cầu Thang

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DP (Fibonacci)
> **Frequency**: 🔥 Tier 1 — Xuất hiện rất thường xuyên trong vòng phone screen
> **See also**: [House Robber](./04-house-robber.md) | [Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như đếm số cách trang trí đường đi bằng gạch 1 ô hoặc 2 ô: để lát xong n ô, bạn có thể đặt viên gạch 1-ô cuối cùng (còn lại n-1 ô) hoặc viên 2-ô (còn lại n-2 ô). Số cách lát n ô = số cách lát (n-1) ô + số cách lát (n-2) ô — đây chính là dãy Fibonacci ẩn.

**Pattern Recognition:**

- Signal: "distinct ways", "can take 1 or 2 steps" → **DP (Fibonacci)**
- Subproblem chồng chéo: `dp[n] = dp[n-1] + dp[n-2]` — optimal substructure rõ ràng
- Chỉ cần 2 giá trị trước → có thể tối ưu space từ O(n) xuống O(1)

**Visual — n = 5:**

```
Step:   1    2    3    4    5
        ↓    ↓    ↓    ↓    ↓
Ways:   1    2    3    5    8

dp[1] = 1
dp[2] = 2
dp[3] = dp[2] + dp[1] = 2 + 1 = 3
dp[4] = dp[3] + dp[2] = 3 + 2 = 5
dp[5] = dp[4] + dp[3] = 5 + 3 = 8  ✓
```

---

## Problem Description

You are climbing a staircase that takes `n` steps to reach the top. Each time you can climb either **1 or 2 steps**. Return the number of distinct ways to climb to the top.

```
Example 1: n = 2 → 2    ([1,1], [2])
Example 2: n = 3 → 3    ([1,1,1], [1,2], [2,1])
Example 3: n = 5 → 8
```

Constraints:

- `1 <= n <= 45`

---

## 📝 Interview Tips

1. **Clarify**: Does n = 0 count as 1 way? / n = 0 có cần xử lý không? (LeetCode guarantees n ≥ 1)
2. **Brute force**: Recursion O(2^n) — đệ quy thuần túy, tính lại subproblem nhiều lần
3. **Optimize**: Add memoization → O(n) time & space → then space-optimize to O(1) with 2 vars
4. **Edge cases**: n = 1 → 1, n = 2 → 2 / Kiểm tra base case trước khi loop
5. **Follow-up**: What if you can take up to k steps? / Nếu bước được tối đa k bậc thì dp[i] = sum(dp[i-1..i-k])

---

## Solutions

```typescript

/**

- Solution 1: Brute Force Recursion
- Time: O(2^n) — recomputes overlapping subproblems exponentially
- Space: O(n) — recursion call stack depth
  */
  function climbStairsBrute(n: number): number {
  if (n <= 1) return 1;
  return climbStairsBrute(n - 1) + climbStairsBrute(n - 2);
  }

/**

- Solution 2: Space-Optimized DP (Optimal)
- Time: O(n) — single pass through n steps
- Space: O(1) — only two rolling variables needed
  */
  function climbStairs(n: number): number {
  if (n <= 1) return 1;

let prev = 1; // dp[i-2]: ways to reach 2 steps ago
let curr = 1; // dp[i-1]: ways to reach 1 step ago

for (let i = 2; i <= n; i++) {
const next = prev + curr;
prev = curr;
curr = next;
}

return curr;
}

// === Test Cases ===
console.log(climbStairs(1)); // 1
console.log(climbStairs(2)); // 2
console.log(climbStairs(5)); // 8
console.log(climbStairs(0)); // 1 (edge)

```

---

## 🔗 Related Problems

- [House Robber](./04-house-robber.md) — cùng mẫu DP linear, dp[i] phụ thuộc 2 state trước
- [Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/) — biến thể thêm cost tại mỗi bước
- [Fibonacci Number](https://leetcode.com/problems/fibonacci-number/) — bản chất toán học của bài này
