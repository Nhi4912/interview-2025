---
layout: page
title: "Minimum Total Distance Traveled"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-total-distance-traveled"
---

# Minimum Total Distance Traveled / Tổng Khoảng Cách Di Chuyển Tối Thiểu

---

## 🧠 Intuition / Tư Duy

**Analogy:** **EN:** Sort robots and flatten factories by position. In any optimal assignment, robots go to factories in order (no crossing). `dp[i][j]` = min total distance to assign first `i` robots using first `j` flattened factory slots.

**VI:** Sắp xếp robot và trải phẳng nhà máy theo vị trí. Trong nghiệm tối ưu, phép gán không bao giờ chéo nhau (robot trái → nhà máy trái). `dp[i][j]` = khoảng cách tối thiểu gán `i` robot đầu dùng `j` vị trí nhà máy đầu.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Total Distance Traveled example:**

```
Robots sorted: [-1, 0, 2]
Factories flattened: [-3, -3, 2, 2]  (capacity 2 each)

dp[i][j] = min(
  dp[i-1][j-1] + |robot[i-1] - fact[j-1]|,  ← assign robot i to slot j
  dp[i][j-1]                                  ← skip slot j
)

Base: dp[0][j] = 0 (no robots)
      dp[i][0] = INF (no slots left)
```

---

---

## Problem Description

| Problem                                                                                             | Difficulty | Pattern      |
| --------------------------------------------------------------------------------------------------- | ---------- | ------------ |
| [Two City Scheduling](https://leetcode.com/problems/two-city-scheduling/)                           | 🟡 Medium  | Sort + DP    |
| [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/) | 🔴 Hard    | DP + Sorting |
| [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)                     | 🔴 Hard    | Sort + DP    |

---

## 📝 Interview Tips

- 🔑 **EN:** Flatten factories: `[pos, limit]` → `limit` copies of `pos`. Sort both arrays ascending. **VI:** Trải phẳng: [pos, limit] → limit bản sao của pos. Sắp xếp cả hai tăng dần.
- 🔑 **EN:** No-crossing property: if robot A < robot B optimally go to factory X < Y, never swap. **VI:** Tính không chéo: robot A < B luôn đến nhà máy X ≤ Y trong nghiệm tối ưu.
- 🔑 **EN:** Transition: assign robot i to slot j OR skip slot j (use earlier slots). **VI:** Chuyển tiếp: gán robot i cho vị trí j, hoặc bỏ qua vị trí j.
- 🔑 **EN:** `dp[i][j-1]` = robot i still unassigned, will use slot j-1 or earlier. **VI:** dp[i][j-1] = robot i chưa gán, sẽ dùng vị trí trước j.
- 🔑 **EN:** Space optimize: process robots one at a time with 1D dp array. **VI:** Tối ưu không gian: xử lý từng robot với mảng dp 1 chiều.
- 🔑 **EN:** Final answer = `dp[m][F]` where m=robots count, F=total factory slots. **VI:** Kết quả = dp[m][F].

---

---

## Solutions

```typescript
/**
 * 2D DP: assign sorted robots to sorted factory slots
 * Time: O(m * F)  Space: O(m * F)  where F = sum of capacities
 */
function minimumTotalDistance(robot: number[], factory: [number, number][]): number {
  robot.sort((a, b) => a - b);
  factory.sort((a, b) => a[0] - b[0]);

  // Flatten factories into individual slots
  const facts: number[] = [];
  for (const [pos, limit] of factory) {
    for (let i = 0; i < limit; i++) facts.push(pos);
  }

  const m = robot.length;
  const F = facts.length;
  const INF = Number.MAX_SAFE_INTEGER / 2;

  // dp[i][j]: min distance, first i robots assigned to first j slots
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(F + 1).fill(INF));
  for (let j = 0; j <= F; j++) dp[0][j] = 0; // 0 robots → 0 cost

  for (let i = 1; i <= m; i++) {
    for (let j = i; j <= F; j++) {
      // Assign robot i-1 to slot j-1
      const assign = dp[i - 1][j - 1] + Math.abs(robot[i - 1] - facts[j - 1]);
      // Skip slot j-1 (robot i-1 assigned to an earlier slot)
      const skip = dp[i][j - 1];
      dp[i][j] = Math.min(assign, skip);
    }
  }

  return dp[m][F];
}

/**
 * Space-optimized 1D DP
 * Time: O(m * F)  Space: O(F)
 */
function minimumTotalDistanceOpt(robot: number[], factory: [number, number][]): number {
  robot.sort((a, b) => a - b);
  factory.sort((a, b) => a[0] - b[0]);

  const facts: number[] = [];
  for (const [pos, limit] of factory) {
    for (let i = 0; i < limit; i++) facts.push(pos);
  }

  const m = robot.length;
  const F = facts.length;
  const INF = Number.MAX_SAFE_INTEGER / 2;

  let dp = new Array(F + 1).fill(0); // dp[j] = cost for 0 robots

  for (let i = 1; i <= m; i++) {
    const ndp = new Array(F + 1).fill(INF);
    for (let j = i; j <= F; j++) {
      const assign = dp[j - 1] === INF ? INF : dp[j - 1] + Math.abs(robot[i - 1] - facts[j - 1]);
      const skip = ndp[j - 1]; // same row, already computed
      ndp[j] = Math.min(assign, skip);
    }
    dp = ndp;
  }

  return dp[F];
}

// Tests
console.log(
  minimumTotalDistance(
    [-1, 0, 2],
    [
      [-3, 2],
      [2, 2],
    ],
  ),
); // 4
console.log(
  minimumTotalDistanceOpt(
    [-1, 0, 2],
    [
      [-3, 2],
      [2, 2],
    ],
  ),
); // 4
console.log(
  minimumTotalDistance(
    [1, -1],
    [
      [-2, 1],
      [2, 1],
    ],
  ),
); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                             | Difficulty | Pattern      |
| --------------------------------------------------------------------------------------------------- | ---------- | ------------ |
| [Two City Scheduling](https://leetcode.com/problems/two-city-scheduling/)                           | 🟡 Medium  | Sort + DP    |
| [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/) | 🔴 Hard    | DP + Sorting |
| [Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/)                     | 🔴 Hard    | Sort + DP    |
