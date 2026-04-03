---
layout: page
title: "Maximum Points Tourist Can Earn"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/maximum-points-tourist-can-earn"
---

# Maximum Points Tourist Can Earn / Điểm Tối Đa Du Khách Có Thể Kiếm

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: 2D DP (days × cities)

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Mỗi ngày du khách ở một thành phố và nhận điểm từ bảng điểm. Họ có thể ở lại hoặc di chuyển sang thành phố khác (trả chi phí từ `travel` matrix). Tìm điểm tối đa sau `k` ngày.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Points Tourist Can Earn example:**

```
k=1, n=2, stay=[[2,3],[1,2]], travel=[[0,2],[1,0]]
      City 0  City 1
Day 0:  2      3      ← stay scores on day 0
travel: 0→1=2, 1→0=1

dp[d][c] = max points after d days, currently in city c

dp[0][0] = 2 (stay in city 0, day 0)
dp[0][1] = 3 (stay in city 1, day 0)

dp[1][0] = max(dp[0][0]+stay[1][0], dp[0][1]+travel[1][0]+stay[1][0])
         = max(2+1,                  3+1+1)               = max(3,5) = 5
dp[1][1] = max(dp[0][1]+stay[1][1], dp[0][0]+travel[0][1]+stay[1][1])
         = max(3+2,                  2+2+2)               = max(5,6) = 6

Answer: max(dp[k-1]) = max(5,6) = 6
```

---

## Problem Description

| #    | Title                             | Difficulty | Connection                       |
| ---- | --------------------------------- | ---------- | -------------------------------- |
| 787  | Cheapest Flights Within K Stops   | 🟡 Medium  | dp[stops][city] — same structure |
| 1235 | Maximum Profit in Job Scheduling  | 🔴 Hard    | Days/intervals DP                |
| 62   | Unique Paths                      | 🟡 Medium  | Grid DP traversal                |
| 329  | Longest Increasing Path in Matrix | 🔴 Hard    | Matrix DP with movement          |

---

## 📝 Interview Tips

- 🔑 **EN:** `dp[d][c]` = max points after visiting `d+1` days (0-indexed) ending in city `c` | **VI:** `dp[d][c]` = điểm tối đa sau d+1 ngày, đang ở thành phố c
- 🔑 **EN:** Two choices each step: stay (`dp[d-1][c] + stay[d][c]`) or travel from some city `p` | **VI:** 2 lựa chọn: ở lại hoặc di chuyển từ thành phố khác
- 🔑 **EN:** Optimise travel: precompute `maxPrev = max(dp[d-1][p] + travel[p][c])` over all p | **VI:** Tối ưu: tính sẵn `maxPrev` trước vòng lặp nội để tránh O(n²) lồng nhau
- 🔑 **EN:** Space: only need previous day's row → O(n) space | **VI:** Chỉ cần hàng ngày trước → O(n) không gian
- 🔑 **EN:** Time: O(k·n²) — need to check all source cities for each destination | **VI:** O(k·n²) — vì phải xét tất cả thành phố nguồn cho mỗi đích đến
- 🔑 **EN:** Answer = max over all cities of `dp[k-1][c]` | **VI:** Đáp án = max của hàng cuối cùng trong dp

---

## Solutions

```typescript
// ─── Solution 1: Full 2D DP — O(k·n²) time, O(k·n) space ─────────────────
function maxVacationPoints2D(flights: number[][], days: number[][]): number {
  const n = flights.length;
  const k = days[0].length;
  const NEG_INF = -Infinity;

  // dp[d][c] = max points after d+1 days ending at city c
  const dp: number[][] = Array.from({ length: k }, () => new Array(n).fill(NEG_INF));

  // Day 0: can only be in city 0 (start) or cities reachable by one flight
  for (let c = 0; c < n; c++) {
    if (c === 0 || flights[0][c] === 1) {
      dp[0][c] = days[c][0];
    }
  }

  for (let d = 1; d < k; d++) {
    for (let c = 0; c < n; c++) {
      // Stay in same city
      if (dp[d - 1][c] !== NEG_INF) {
        dp[d][c] = Math.max(dp[d][c], dp[d - 1][c] + days[c][d]);
      }
      // Fly from some other city p
      for (let p = 0; p < n; p++) {
        if (flights[p][c] === 1 && dp[d - 1][p] !== NEG_INF) {
          dp[d][c] = Math.max(dp[d][c], dp[d - 1][p] + days[c][d]);
        }
      }
    }
  }

  return Math.max(...dp[k - 1].filter((v) => v !== NEG_INF), 0);
}

// ─── Solution 2: Space-Optimised — O(k·n²) time, O(n) space ──────────────
function maxVacationPoints(flights: number[][], days: number[][]): number {
  const n = flights.length;
  const k = days[0].length;
  const NEG_INF = -Infinity;

  let prev = new Array(n).fill(NEG_INF);
  // Start at city 0
  prev[0] = days[0][0];
  for (let c = 1; c < n; c++) {
    if (flights[0][c] === 1) prev[c] = days[c][0];
  }

  for (let d = 1; d < k; d++) {
    const curr = new Array(n).fill(NEG_INF);
    for (let c = 0; c < n; c++) {
      // Stay
      if (prev[c] !== NEG_INF) {
        curr[c] = Math.max(curr[c], prev[c] + days[c][d]);
      }
      // Fly from p
      for (let p = 0; p < n; p++) {
        if (flights[p][c] === 1 && prev[p] !== NEG_INF) {
          curr[c] = Math.max(curr[c], prev[p] + days[c][d]);
        }
      }
    }
    prev = curr;
  }

  return Math.max(...prev.filter((v) => v !== NEG_INF), 0);
}

// ─── Tests ─────────────────────────────────────────────────────────────────
// flights=[[0,1,1],[1,0,1],[1,1,0]], days=[[1,3,1],[6,0,6],[3,3,3]], k=3
console.log(
  maxVacationPoints(
    [
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
    ],
    [
      [1, 3, 1],
      [6, 0, 6],
      [3, 3, 3],
    ],
  ),
); // 12

console.log(
  maxVacationPoints(
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
); // 3  (stuck in city 0)

console.log(
  maxVacationPoints(
    [
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
    ],
    [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
  ),
); // 3
```

---

## 🔗 Related Problems

| #    | Title                             | Difficulty | Connection                       |
| ---- | --------------------------------- | ---------- | -------------------------------- |
| 787  | Cheapest Flights Within K Stops   | 🟡 Medium  | dp[stops][city] — same structure |
| 1235 | Maximum Profit in Job Scheduling  | 🔴 Hard    | Days/intervals DP                |
| 62   | Unique Paths                      | 🟡 Medium  | Grid DP traversal                |
| 329  | Longest Increasing Path in Matrix | 🔴 Hard    | Matrix DP with movement          |
