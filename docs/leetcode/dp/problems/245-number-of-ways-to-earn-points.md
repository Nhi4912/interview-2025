---
layout: page
title: "Number of Ways to Earn Points"
difficulty: Hard
category: DP
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/number-of-ways-to-earn-points"
---

# Number of Ways to Earn Points / Số Cách Đạt Điểm Mục Tiêu

> **Track**: DP | **Difficulty**: 🔴 Hard | **Pattern**: Bounded Knapsack
> **Frequency**: 📙 Tier 2 — Gặp ở Google, Meta
> **See also**: [Coin Change II](https://leetcode.com/problems/coin-change-ii) | [Target Sum](https://leetcode.com/problems/target-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Kỳ thi có nhiều loại câu hỏi: loại 1 có 3 câu (1 điểm/câu), loại 2 có 2 câu (2 điểm/câu). Bạn muốn đạt đúng 4 điểm — hỏi có bao nhiêu cách chọn số câu mỗi loại? Đây là bài toán "bounded knapsack đếm số cách": với mỗi loại câu hỏi `(count, marks)`, bạn chọn từ 0 đến `count` câu để tổng điểm đạt đúng `target`. DP 1D với vòng lặp ngược giống Coin Change nhưng có giới hạn trên cho mỗi mệnh giá.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Number of Ways to Earn Points example:**

```
types = [[1,1],[2,2],[3,3]], target = 4
       count  marks

dp[j] = number of ways to reach exactly j points

Initial: dp[0]=1, dp[1..4]=0

Process type (count=1, marks=1): for j=4..1, dp[j] += dp[j-1]
  dp: [1,1,0,0,0]

Process type (count=2, marks=2): for j=4..2, dp[j] += dp[j-2] + dp[j-4]
  j=4: dp[4] += dp[2]+dp[0] = 0+1 = 1
  j=3: dp[3] += dp[1]       = 1
  j=2: dp[2] += dp[0]       = 1
  dp: [1,1,1,1,1]

Process type (count=3, marks=3): for j=4..3, dp[j] += dp[j-3]..dp[j-9]
  j=4: dp[4] += dp[1] = 1+1 = 2
  j=3: dp[3] += dp[0] = 1+1 = 2
  dp[4] = 2 ✓ (answer)
```

---

## Problem Description

There are `n` types of questions in an exam. The `i`-th type has `types[i] = [count_i, marks_i]`: you can solve **0 to count_i** questions of this type, each worth `marks_i` points. Return the **number of ways** to earn exactly `target` points. Answer modulo `10^9 + 7`.

**Example 1:** `types = [[1,1],[2,2],[3,3]]`, `target = 4` → `2`

**Example 2:** `types = [[4,1],[2,2],[3,3]]`, `target = 4` → `4`

**Constraints:** `1 ≤ types.length ≤ 50`, `1 ≤ count_i, marks_i ≤ 50`, `1 ≤ target ≤ 1000`

---

## 📝 Interview Tips

- **Bounded knapsack** / Knapsack có giới hạn: Mỗi item dùng tối đa `count` lần — khác unbounded
- **Prefix sum trick** / Trick prefix sum: Tối ưu O(n·target) thay vì O(n·target·count) với sliding window
- **Reverse iteration** / Duyệt ngược: Duyệt `j` từ `target` xuống 0 để tránh dùng item nhiều lần
- **Mod carefully** / Mod cẩn thận: Nhớ `% MOD` ở mọi phép cộng để tránh overflow
- **Init dp[0]=1** / Khởi tạo: `dp[0] = 1` là trường hợp cơ sở (không chọn câu nào)
- **Sliding window** / Cửa sổ trượt: Với bounded knapsack lớn, dùng deque để tối ưu thêm

---

## Solutions

```typescript
/**
 * @complexity Time: O(n·target·maxCount) | Space: O(target)
 * For each type, iterate count from 0 to count_i
 */
function waysToReachTargetBrute(target: number, types: number[][]): number {
  const MOD = 1_000_000_007n;
  let dp = new Array(target + 1).fill(0n);
  dp[0] = 1n;

  for (const [cnt, marks] of types) {
    const newDp = new Array(target + 1).fill(0n);
    for (let j = 0; j <= target; j++) {
      if (dp[j] === 0n) continue;
      for (let k = 0; k <= cnt && j + k * marks <= target; k++) {
        newDp[j + k * marks] = (newDp[j + k * marks] + dp[j]) % MOD;
      }
    }
    dp = newDp;
  }
  return Number(dp[target]);
}

/**
 * @complexity Time: O(n·target) | Space: O(target)
 * Use prefix sum to compute bounded knapsack in O(target) per item
 * prefix[j] = sum of dp[j], dp[j-marks], dp[j-2*marks], ...
 */
function waysToReachTarget(target: number, types: number[][]): number {
  const MOD = 1_000_000_007;
  let dp = new Array(target + 1).fill(0);
  dp[0] = 1;

  for (const [cnt, marks] of types) {
    const newDp = new Array(target + 1).fill(0);
    // prefix[j] = sum of dp values at positions j, j-marks, j-2*marks...
    const prefix = new Array(target + 1).fill(0);
    for (let j = 0; j <= target; j++) {
      const prevIdx = j - marks;
      prefix[j] = (dp[j] + (prevIdx >= 0 ? prefix[prevIdx] : 0)) % MOD;
      // window of size cnt+1: subtract contribution that's too far back
      const outIdx = j - (cnt + 1) * marks;
      let sub = 0;
      if (outIdx >= 0)
        sub = (dp[outIdx] + (outIdx - marks >= 0 ? prefix[outIdx - marks] : 0)) % MOD;
      newDp[j] = (prefix[j] - sub + MOD) % MOD;
    }
    dp = newDp;
  }
  return dp[target];
}

// === Test Cases ===
console.log(
  waysToReachTarget(4, [
    [1, 1],
    [2, 2],
    [3, 3],
  ]),
); // → 2
console.log(
  waysToReachTarget(4, [
    [4, 1],
    [2, 2],
    [3, 3],
  ]),
); // → 4
console.log(waysToReachTarget(5, [[5, 1]])); // → 1
console.log(
  waysToReachTarget(1, [
    [1, 1],
    [1, 2],
  ]),
); // → 1
console.log(
  waysToReachTargetBrute(4, [
    [1, 1],
    [2, 2],
    [3, 3],
  ]),
); // → 2
```

---

## 🔗 Related Problems

| Problem          | Difficulty | Link                                                               |
| ---------------- | ---------- | ------------------------------------------------------------------ |
| Coin Change II   | Medium     | [LC 518](https://leetcode.com/problems/coin-change-ii)             |
| Target Sum       | Medium     | [LC 494](https://leetcode.com/problems/target-sum)                 |
| Knapsack Problem | Medium     | [LC 416](https://leetcode.com/problems/partition-equal-subset-sum) |
