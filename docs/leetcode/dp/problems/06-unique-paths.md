---
layout: page
title: "Unique Paths"
difficulty: Medium
category: Dynamic Programming
tags: [Math, Dynamic Programming, Combinatorics]
leetcode_url: "https://leetcode.com/problems/unique-paths/"
leetcode_number: 62
pattern: "2D DP Grid"
frequency_tier: 2
companies: [Amazon, Google, Microsoft, Bloomberg]
target_time_minutes: 15
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Unique Paths / Đường Đi Duy Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: 2D Dynamic Programming
> **Frequency**: ⭐ Tier 2 — Gặp ~45% interviews
> **See also**: [Climbing Stairs](./01-climbing-stairs.md) | [Coin Change](./07-coin-change.md) | [Edit Distance](./10-edit-distance.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đang lái taxi trên lưới đường ô thành phố, từ góc trên-trái đến góc dưới-phải, chỉ được rẽ phải hoặc đi xuống. Số cách đến mỗi ngã tư = số cách từ ngã tư bên trái + số cách từ ngã tư phía trên. Đây là tư duy DP cổ điển: kết quả ô (i,j) phụ thuộc đúng 2 ô trước, không cần tính lại từ đầu.

**Pattern Recognition:**

- Signal: "grid", "only right or down", "count unique paths" → **2D DP**: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`
- Optimal substructure: reaching (i,j) requires passing through (i-1,j) or (i,j-1)
- Space-optimize to O(n): overwrite single row in-place since we only need the row above

**Visual — m=3, n=3 grid:**

```
Step 1 — initialize borders (only 1 way to reach any edge cell):
  dp = [1, 1, 1]   ← top row

Step 2 — fill each row, left to right (dp[j] += dp[j-1]):
  Row 1: dp[1] = 1+1 = 2,  dp[2] = 1+2 = 3   →  dp = [1, 2, 3]
  Row 2: dp[1] = 2+1 = 3,  dp[2] = 3+3 = 6   →  dp = [1, 3, 6]
                                                          ↑
                                                     answer = 6 ✅

dp[j] at each step means:
  "from top" = old dp[j], "from left" = dp[j-1] just updated
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| When you see... | Think... | Template | Time target |
|---|---|---|---|
| Count paths in grid, only right/down moves | 2D DP where each cell = sum of cell above + cell left | `dp[i][j] = dp[i-1][j] + dp[i][j-1]` | < 5 min to recognize |
| "Unique paths", "grid traversal", "how many ways" | Bottom-up DP, init borders to 1, fill row by row | Initialize row 0 and col 0 to 1s, then double loop | < 10 min to code |
| Follow-up: "with obstacles" | Set dp at obstacle cells to 0, rest same recurrence | Same template, `dp[i][j] = 0` if grid[i][j] == 1 | < 15 min total |

**Memory hook:** "Paths đến một ô = từ trên xuống + từ trái sang" — chỉ 2 nguồn, không bao giờ từ dưới hay từ phải.

---

## Problem Description

A robot on an `m × n` grid starts at top-left `(0,0)` and must reach bottom-right `(m-1, n-1)`. It can only move **right** or **down**. Return the number of unique paths.

```
Example 1: m=3, n=7  → 28
Example 2: m=3, n=2  → 3   (R→D→D, D→R→D, D→D→R)
Example 3: m=1, n=1  → 1
```

Constraints:

- 1 <= m, n <= 100

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

> **U — Understand:** "So we have an m×n grid, robot starts top-left, ends bottom-right, only right or down moves. We need to count distinct paths. Let me confirm: m=3 means 3 rows, n=7 means 7 columns? And there are no obstacles in this version?"

> **M — Match:** "This is a classic 2D grid counting problem. Whenever I see 'count paths with restricted moves in a grid', I reach for 2D DP. The subproblem is clean: number of ways to reach (i,j) = ways from above + ways from left. I'll use a 1D rolling array to keep space at O(n) instead of O(m×n)."

> **P — Plan:** "Initialize a 1D dp array of size n, all ones — representing the top row. Then for each row from 1 to m-1, iterate columns left to right and do dp[j] += dp[j-1]. The old dp[j] carries the 'from above' value, dp[j-1] carries the 'from left' value already updated this row. Return dp[n-1]."

> **I — Implement:** "Let me code that up... `const dp = new Array(n).fill(1); for i from 1 to m-1: for j from 1 to n-1: dp[j] += dp[j-1]; return dp[n-1];`. The double loop is O(m×n) time, single array is O(n) space. Edge case: if m=1 or n=1, the inner loop never runs and we correctly return 1."

> **R — Review & E — Evaluate:** "Let me trace m=3, n=3: start [1,1,1]. Row 1: dp[1]=1+1=2, dp[2]=1+2=3 → [1,2,3]. Row 2: dp[1]=2+1=3, dp[2]=3+3=6 → [1,3,6]. Return 6. Correct. Time O(m×n), space O(n). Follow-up: Unique Paths II adds obstacle cells — just set dp[j]=0 wherever grid[i][j] has an obstacle."

---

## 📝 Interview Tips

1. **Clarify**: Can the robot move left or up? Is the grid always valid (m,n ≥ 1)? / Robot chỉ đi phải và xuống? Grid có đảm bảo m,n ≥ 1?
2. **Brute force**: Recursion `f(m,n) = f(m-1,n) + f(m,n-1)` — exponential without memoization / Đệ quy thuần tốn O(2^(m+n)), cần thêm memo.
3. **Optimize**: Bottom-up 1D DP — reuse a single row array, `dp[j] += dp[j-1]` for each row / DP 1D rolling: O(m×n) time, O(n) space.
4. **Edge cases**: m=1 or n=1 → exactly 1 path (straight line only) / Một hàng hoặc một cột → chỉ 1 đường đi.
5. **Follow-up**: Unique Paths II adds obstacles → set `dp[i][j]=0` at obstacle cells / Bài nâng cao có ô chướng ngại vật.

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| Mistake | Why it's wrong | Fix |
|---|---|---|
| Using recursion without memoization | Exponential time O(2^(m+n)) — recomputes same subproblems repeatedly | Use bottom-up DP or add a memo map; each (i,j) computed exactly once |
| Not initializing first row/column to 1 | Incorrect base case — cells along edges have only one path to them | Fill dp with 1s initially; for 2D table explicitly set row 0 and col 0 to 1 |
| Allocating full m×n DP table when 1D suffices | Unnecessary O(m×n) space — we only ever read from the previous row | Reuse 1D array with rolling `dp[j] += dp[j-1]`; reduces space to O(n) |

---

## Solutions

```typescript

/**

- Solution 1: Recursion with Memoization (Top-Down DP)
- Time: O(m * n) — each (row, col) cell computed exactly once
- Space: O(m _ n) — memo map + O(m+n) recursion stack
  _/
  function uniquePathsMemo(m: number, n: number): number {
  const memo = new Map<string, number>();

function dp(row: number, col: number): number {
if (row === 0 || col === 0) return 1; // border cells: only 1 way
const key = `${row},${col}`;
if (memo.has(key)) return memo.get(key)!;
const result = dp(row - 1, col) + dp(row, col - 1);
memo.set(key, result);
return result;
}

return dp(m - 1, n - 1);
}

/**

- Solution 2: 1D Rolling DP (Optimal)
- Time: O(m * n) — two nested loops, each cell processed once
- Space: O(n) — single array reused across all rows
  */
  function uniquePaths(m: number, n: number): number {
  const dp = new Array(n).fill(1); // top row: all 1s (only 1 way to reach each)

for (let i = 1; i < m; i++) {
for (let j = 1; j < n; j++) {
dp[j] += dp[j - 1]; // from above (old dp[j]) + from left (dp[j-1])
}
}

return dp[n - 1];
}

// === Test Cases ===
console.log(uniquePaths(3, 7)); // 28
console.log(uniquePaths(3, 2)); // 3
console.log(uniquePaths(1, 1)); // 1
console.log(uniquePaths(1, 5)); // 1

```

---

## 🔗 Related Problems

- [Climbing Stairs](./01-climbing-stairs.md) — same 1D recurrence: dp[i] = dp[i-1] + dp[i-2]
- [Unique Paths II](https://leetcode.com/problems/unique-paths-ii/) — harder variant with obstacle cells in the grid
- [Coin Change](./07-coin-change.md) — similar "count ways" bottom-up DP structure
- [Edit Distance](./10-edit-distance.md) — same 2D DP table-filling pattern

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric | Target | My result |
|---|---|---|
| Time to solve | ≤ 15 min | \_\_\_ min |
| Recognized pattern | ≤ 2 min | \_\_\_ min |
| Coded optimal solution | 1D rolling DP | [ ] Yes [ ] No |
| Handled edge cases | m=1 or n=1 | [ ] Yes [ ] No |
| Space complexity | O(n) | \_\_\_ |

**SRS Schedule:**

- First solve → review in 1 day
- Correct (shaky) → review in 3 days
- Correct (confident) → review in 7 days
- Mastered → review in 14 days

**Review Log:**

| Date | Result | Notes |
|---|---|---|
| \_\_\_\_ | ⬜ unsolved / 🟡 hint needed / 🟢 solved | |
