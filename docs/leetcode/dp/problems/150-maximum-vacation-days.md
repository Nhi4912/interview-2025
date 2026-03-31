---
layout: page
title: "Maximum Vacation Days"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/maximum-vacation-days"
---

# Maximum Vacation Days / Số Ngày Nghỉ Tối Đa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximal Square](https://leetcode.com/problems/maximal-square) | [Unique Paths II](https://leetcode.com/problems/unique-paths-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Như lập lịch chuyến du lịch — mỗi tuần bạn có thể bay đến thành phố khác hoặc ở lại. Bạn muốn tối đa hoá tổng số ngày nghỉ trong K tuần.

```
flights (n=3 cities):        days (vacation/week):
  0→1, 0→2, 1→2              city:  0  1  2
                               wk0: [1, 3, 1]
                               wk1: [6, 0, 3]
                               wk2: [3, 3, 3]

dp[w][city] = max vacation days through week w ending in city
dp[0][0] = days[0][0] = 1 (start at city 0)
dp[0][1] = days[1][0] = 3 (fly 0→1 at week 0)
dp[1][2] = max(dp[0][1] + days[2][1]) = 3+3 = 6
```

**Key insight:** `dp[w][j]` = max days through week `w` ending at city `j`. Transition: iterate all cities `i` where `i==j` (stay) or `flights[i][j]==1` (fly).

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🔑 **Start at city 0**: Initial week transitions only from city 0 / tuần đầu chỉ xuất phát từ thành phố 0
- 🔑 **State**: `dp[week][city]` = max vacation days accumulated ending at `city` after `week` / tổng ngày nghỉ tối đa
- 🔑 **Transition**: `dp[w][j] = max over i: (flights[i][j]==1 or i==j) ? dp[w-1][i] + days[j][w]` / duyệt nguồn
- 🔑 **Init to -Infinity**: Unreachable cities stay at `-Infinity`; only update reachable ones / thành phố không thể đến = -∞
- 🔑 **Space optimization**: Only need previous week's dp → use two 1D arrays / chỉ cần tuần trước
- 🔑 **Answer**: `max(dp[K-1][0..n-1])` / lấy max qua tất cả thành phố ở tuần cuối

---

## Solutions / Giải Pháp

### Solution 1: DP with 2D Table (O(K × n²) time, O(K × n) space)

```typescript
/**
 * Maximum Vacation Days — 2D DP
 *
 * dp[w][j] = max vacation days through week w, currently in city j.
 * You start at city 0. Each week, you can fly (if flights[i][j]=1) or stay.
 *
 * Time:  O(K × n²) — K weeks, n² transitions
 * Space: O(K × n)  — full dp table
 */
function maxVacationDays(flights: number[][], days: number[][]): number {
  const n = flights.length;
  const K = days[0].length;
  const NEG_INF = -Infinity;

  // dp[w][city]: max days accumulated ending at city after week w
  const dp: number[][] = Array.from({ length: K }, () => new Array(n).fill(NEG_INF));

  // Week 0: can reach city j from city 0 if flights[0][j]=1 or stay at 0
  for (let j = 0; j < n; j++) {
    if (j === 0 || flights[0][j] === 1) {
      dp[0][j] = days[j][0];
    }
  }

  for (let w = 1; w < K; w++) {
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        if (dp[w - 1][i] === NEG_INF) continue;
        if (i === j || flights[i][j] === 1) {
          dp[w][j] = Math.max(dp[w][j], dp[w - 1][i] + days[j][w]);
        }
      }
    }
  }

  return Math.max(...dp[K - 1].filter((v) => v !== NEG_INF), 0);
}

console.log(
  maxVacationDays(
    [
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
    ],
    [
      [1, 3, 1],
      [6, 0, 3],
      [3, 3, 3],
    ],
  ),
); // 12
console.log(
  maxVacationDays(
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    [
      [1, 1, 1],
      [7, 7, 7],
      [7, 7, 7],
    ],
  ),
); // 3
console.log(
  maxVacationDays(
    [
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
    ],
    [
      [7, 0, 0],
      [0, 7, 0],
      [0, 0, 7],
    ],
  ),
); // 21
```

### Solution 2: Space-Optimized DP (O(K × n²) time, O(n) space)

```typescript
/**
 * Maximum Vacation Days — Rolling Array DP
 *
 * Only keep current and previous week's dp arrays.
 * Reduces space from O(K×n) to O(n).
 *
 * Time:  O(K × n²)
 * Space: O(n)
 */
function maxVacationDaysOpt(flights: number[][], days: number[][]): number {
  const n = flights.length;
  const K = days[0].length;
  const NEG_INF = -Infinity;

  let prev = new Array(n).fill(NEG_INF);
  // Week 0 initialization
  for (let j = 0; j < n; j++) {
    if (j === 0 || flights[0][j] === 1) prev[j] = days[j][0];
  }

  for (let w = 1; w < K; w++) {
    const curr = new Array(n).fill(NEG_INF);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        if (prev[i] === NEG_INF) continue;
        if (i === j || flights[i][j] === 1) {
          curr[j] = Math.max(curr[j], prev[i] + days[j][w]);
        }
      }
    }
    prev = curr;
  }

  return Math.max(...prev.filter((v) => v !== NEG_INF), 0);
}

console.log(
  maxVacationDaysOpt(
    [
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
    ],
    [
      [1, 3, 1],
      [6, 0, 3],
      [3, 3, 3],
    ],
  ),
); // 12
console.log(
  maxVacationDaysOpt(
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    [
      [1, 1, 1],
      [7, 7, 7],
      [7, 7, 7],
    ],
  ),
); // 3
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                | Difficulty | Pattern      |
| ------------------------------------------------------------------------------------------------------ | ---------- | ------------ |
| [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum)                                     | 🟡 Medium  | Grid DP      |
| [Unique Paths II](https://leetcode.com/problems/unique-paths-ii)                                       | 🟡 Medium  | Grid DP      |
| [Best Time to Buy and Sell Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv) | 🔴 Hard    | State DP     |
| [Paint House II](https://leetcode.com/problems/paint-house-ii)                                         | 🔴 Hard    | DP on States |
