---
layout: page
title: "Minimum Costs Using the Train Line"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/minimum-costs-using-the-train-line"
---

# Minimum Costs Using the Train Line / Chi Phí Nhỏ Nhất Dùng Tuyến Tàu

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: State-Machine DP

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Hãy tưởng tượng bạn di chuyển giữa hai đường ray song song. Tại mỗi trạm bạn có thể ở lại đường ray hiện tại (miễn phí) hoặc chuyển sang đường ray kia (tốn phí). Bài toán tìm tổng chi phí nhỏ nhất để đến hết mọi trạm.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Costs Using the Train Line example:**

```
Stations:  1    2    3    4
Line 0:   [r0]--[r0]--[r0]--[r0]   (running costs line 0)
                 ↕    ↕    ↕        (changeCost at each station)
Line 1:   [r1]--[r1]--[r1]--[r1]   (running costs line 1)

dp[i][0] = min cost to reach station i on line 0
dp[i][1] = min cost to reach station i on line 1

Transition:
  dp[i][0] = min(dp[i-1][0] + r0[i],          // stay on line 0
                 dp[i-1][1] + r1[i] + c[i-1])  // switch from line 1, pay changeCost
  dp[i][1] = min(dp[i-1][1] + r1[i],
                 dp[i-1][0] + r0[i] + c[i-1])
```

---

## Problem Description

| #   | Title                              | Difficulty | Connection                      |
| --- | ---------------------------------- | ---------- | ------------------------------- |
| 256 | Paint House                        | 🟡 Medium  | Same 2-state machine DP pattern |
| 265 | Paint House II                     | 🔴 Hard    | Generalised k-state machine     |
| 714 | Best Time to Buy/Sell Stock w/ Fee | 🟡 Medium  | 2-state (hold/cash) DP          |
| 188 | Best Time to Buy/Sell Stock IV     | 🔴 Hard    | Multi-state transaction DP      |

---

## 📝 Interview Tips

- 🔑 **EN:** State = (station, current_line); two states per station is classic state-machine DP | **VI:** 2 trạng thái tại mỗi trạm → state machine DP điển hình
- 🔑 **EN:** Switching cost is charged at the **destination** station (read problem constraints carefully) | **VI:** Đọc kỹ: phí đổi ray tính tại trạm đến hay trạm đi?
- 🔑 **EN:** Space-optimise to O(1): only need previous station's two values | **VI:** Chỉ cần lưu `prev0` và `prev1` từ trạm trước
- 🔑 **EN:** Base case: `dp[0][0] = r0[0]`, `dp[0][1] = r1[0]` (no switch cost at first station) | **VI:** Trạm đầu tiên không có phí đổi ray
- 🔑 **EN:** Answer is `min(dp[n-1][0], dp[n-1][1])` | **VI:** Đáp án là min của hai trạng thái tại trạm cuối
- 🔑 **EN:** Similar to "Paint House" DP but with only 2 colors | **VI:** Giống bài Paint House nhưng chỉ 2 màu

---

## Solutions

```typescript
// ─── Solution 1: 2D DP — O(n) time, O(n) space ────────────────────────────
function minimumCosts2D(regular: number[], express: number[], expressCost: number): number[] {
  const n = regular.length;
  // dp[i][0] = min cost reaching station i on regular line
  // dp[i][1] = min cost reaching station i on express line
  const dp: number[][] = Array.from({ length: n }, () => [0, 0]);
  dp[0][0] = regular[0];
  dp[0][1] = expressCost + express[0]; // must pay entry fee to board express

  for (let i = 1; i < n; i++) {
    dp[i][0] = Math.min(
      dp[i - 1][0] + regular[i], // stay on regular
      dp[i - 1][1] + regular[i], // switch from express (no extra fee to exit)
    );
    dp[i][1] = Math.min(
      dp[i - 1][1] + express[i], // stay on express
      dp[i - 1][0] + expressCost + express[i], // switch to express (pay entry fee)
    );
  }
  // Answer at each station is the minimum of both lines
  return dp.map((row) => Math.min(row[0], row[1]));
}

// ─── Solution 2: Space-Optimised — O(n) time, O(1) space ──────────────────
function minimumCosts(regular: number[], express: number[], expressCost: number): number[] {
  const n = regular.length;
  const result: number[] = [];

  let prevReg = regular[0];
  let prevExp = expressCost + express[0];
  result.push(Math.min(prevReg, prevExp));

  for (let i = 1; i < n; i++) {
    const curReg = Math.min(
      prevReg + regular[i],
      prevExp + regular[i], // exit express → regular (free)
    );
    const curExp = Math.min(
      prevExp + express[i],
      prevReg + expressCost + express[i], // board express (pay expressCost)
    );
    prevReg = curReg;
    prevExp = curExp;
    result.push(Math.min(curReg, curExp));
  }
  return result;
}

// ─── Tests ─────────────────────────────────────────────────────────────────
// regular=[1,6,9,5], express=[5,2,3,10], expressCost=8
// Expected: [1,7,14,19]  (we only switch when express line saves enough)
console.log(minimumCosts([1, 6, 9, 5], [5, 2, 3, 10], 8)); // [1, 7, 14, 19]
console.log(minimumCosts([11, 5, 13], [7, 10, 13], 20)); // [11, 16, 29]
console.log(minimumCosts2D([1, 6, 9, 5], [5, 2, 3, 10], 8)); // [1, 7, 14, 19]
```

---

## 🔗 Related Problems

| #   | Title                              | Difficulty | Connection                      |
| --- | ---------------------------------- | ---------- | ------------------------------- |
| 256 | Paint House                        | 🟡 Medium  | Same 2-state machine DP pattern |
| 265 | Paint House II                     | 🔴 Hard    | Generalised k-state machine     |
| 714 | Best Time to Buy/Sell Stock w/ Fee | 🟡 Medium  | 2-state (hold/cash) DP          |
| 188 | Best Time to Buy/Sell Stock IV     | 🔴 Hard    | Multi-state transaction DP      |
