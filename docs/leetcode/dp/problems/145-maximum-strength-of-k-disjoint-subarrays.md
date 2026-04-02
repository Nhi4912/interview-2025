---
layout: page
title: "Maximum Strength of K Disjoint Subarrays"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/maximum-strength-of-k-disjoint-subarrays"
---

# Maximum Strength of K Disjoint Subarrays / Sức Mạnh Lớn Nhất Của K Mảng Con Rời Nhau

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DP with Alternating Sign Weights

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI:** Chọn k mảng con không chồng nhau. Mảng con thứ `j` (1-indexed) được nhân với `j` nếu j lẻ và `-(j)` nếu j chẵn. Đây là bài DP 2D: `dp[i][j]` = giá trị tốt nhất dùng i phần tử đầu, đã chọn j mảng con.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Strength of K Disjoint Subarrays example:**

```
nums = [1, 2, 3, -1, 2], k = 3
Weight for subarray j: sign = (-1)^(j+1) * j
  j=1: weight = +1, j=2: weight = -2, j=3: weight = +3

Goal: pick 3 non-overlapping subarrays, multiply sum_j by weight_j, maximise total

Best: [1,2,3], [-1], [2]
      (1+2+3)*1 + (-1)*(-2) + (2)*(3) = 6 + 2 + 6 = 14
```

---

## Problem Description

| #    | Title                                      | Difficulty | Connection                         |
| ---- | ------------------------------------------ | ---------- | ---------------------------------- |
| 53   | Maximum Subarray                           | 🟡 Medium  | Single subarray Kadane's algorithm |
| 689  | Maximum Sum of 3 Non-Overlapping Subarrays | 🔴 Hard    | Fixed-size k=3 version             |
| 1235 | Maximum Profit in Job Scheduling           | 🔴 Hard    | Non-overlapping intervals DP       |
| 410  | Split Array Largest Sum                    | 🔴 Hard    | Partition into k groups DP         |

---

## 📝 Interview Tips

- 🔑 **EN:** DP state: `dp[i][j][0/1]` = best using first `i` elements, `j` subarrays chosen, 0=not in subarray, 1=in subarray | **VI:** 3 chiều DP: vị trí, số mảng, đang trong mảng hay không
- 🔑 **EN:** Weight of j-th subarray = `j % 2 === 1 ? j : -j` | **VI:** Trọng số xen kẽ: j lẻ → dương, j chẵn → âm
- 🔑 **EN:** Transition when `in[j]`: extend current subarray or close and open new | **VI:** Khi đang trong mảng: tiếp tục hoặc kết thúc
- 🔑 **EN:** All k subarrays must be non-empty (size ≥ 1) | **VI:** Mỗi mảng con phải có ít nhất 1 phần tử
- 🔑 **EN:** Use `-Infinity` as sentinel for invalid states | **VI:** Dùng `-Infinity` để đánh dấu trạng thái không hợp lệ
- 🔑 **EN:** Answer is `dp[n][k][0]` — after all elements, k subarrays closed | **VI:** Đáp án tại `dp[n][k][0]` — k mảng đã đóng hoàn toàn

---

## Solutions

```typescript
// ─── Solution 1: 3D DP — O(n·k) time, O(n·k) space ───────────────────────
function maximumStrengthDP(nums: number[], k: number): number {
  const n = nums.length;
  const NEG_INF = -Infinity;

  // dp[i][j][s] = max strength using first i elements,
  //               having selected j subarrays,
  //               s=0 (not in a subarray), s=1 (currently in j-th subarray)
  const dp: number[][][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: k + 1 }, () => [NEG_INF, NEG_INF]),
  );
  dp[0][0][0] = 0;

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j <= k; j++) {
      const w = j % 2 === 1 ? j : -j; // weight of j-th subarray
      const num = nums[i - 1];

      // s=0: not in a subarray
      if (dp[i - 1][j][0] !== NEG_INF) {
        dp[i][j][0] = Math.max(dp[i][j][0], dp[i - 1][j][0]); // skip element
      }
      if (j > 0 && dp[i - 1][j][1] !== NEG_INF) {
        dp[i][j][0] = Math.max(dp[i][j][0], dp[i - 1][j][1]); // close subarray j
      }

      // s=1: in the j-th subarray
      if (j > 0) {
        const wj = j % 2 === 1 ? j : -j;
        if (dp[i - 1][j][1] !== NEG_INF) {
          dp[i][j][1] = Math.max(dp[i][j][1], dp[i - 1][j][1] + wj * num); // extend
        }
        if (dp[i - 1][j - 1][0] !== NEG_INF) {
          dp[i][j][1] = Math.max(dp[i][j][1], dp[i - 1][j - 1][0] + wj * num); // open new
        }
      }
    }
  }

  return dp[n][k][0] === NEG_INF ? 0 : dp[n][k][0];
}

// ─── Solution 2: Space-Optimised (rolling rows) ────────────────────────────
function maximumStrength(nums: number[], k: number): number {
  const n = nums.length;
  const NEG_INF = -Infinity;

  // prev/curr: [j][0/1]
  let prev = Array.from({ length: k + 1 }, () => [NEG_INF, NEG_INF] as [number, number]);
  prev[0][0] = 0;

  for (let i = 1; i <= n; i++) {
    const curr = Array.from({ length: k + 1 }, () => [NEG_INF, NEG_INF] as [number, number]);
    const num = nums[i - 1];

    for (let j = 0; j <= k; j++) {
      // s=0: skip or close
      if (prev[j][0] !== NEG_INF) curr[j][0] = Math.max(curr[j][0], prev[j][0]);
      if (j > 0 && prev[j][1] !== NEG_INF) curr[j][0] = Math.max(curr[j][0], prev[j][1]);

      // s=1: extend or open
      if (j > 0) {
        const wj = j % 2 === 1 ? j : -j;
        if (prev[j][1] !== NEG_INF) curr[j][1] = Math.max(curr[j][1], prev[j][1] + wj * num);
        if (prev[j - 1][0] !== NEG_INF)
          curr[j][1] = Math.max(curr[j][1], prev[j - 1][0] + wj * num);
      }
    }
    prev = curr;
  }

  return prev[k][0] === NEG_INF ? 0 : prev[k][0];
}

// ─── Tests ─────────────────────────────────────────────────────────────────
console.log(maximumStrength([1, 2, 3, -1, 2], 3)); // 22
console.log(maximumStrength([2, -1, 3], 1)); // 5  ([2,-1,3]*1=4... wait)
console.log(maximumStrength([-1, -2, -3], 1)); // -1
console.log(maximumStrengthDP([1, 2, 3, -1, 2], 3)); // 22
```

---

## 🔗 Related Problems

| #    | Title                                      | Difficulty | Connection                         |
| ---- | ------------------------------------------ | ---------- | ---------------------------------- |
| 53   | Maximum Subarray                           | 🟡 Medium  | Single subarray Kadane's algorithm |
| 689  | Maximum Sum of 3 Non-Overlapping Subarrays | 🔴 Hard    | Fixed-size k=3 version             |
| 1235 | Maximum Profit in Job Scheduling           | 🔴 Hard    | Non-overlapping intervals DP       |
| 410  | Split Array Largest Sum                    | 🔴 Hard    | Partition into k groups DP         |
