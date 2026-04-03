---
layout: page
title: "Remove Boxes"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Memoization]
leetcode_url: "https://leetcode.com/problems/remove-boxes"
---

# Remove Boxes / Xóa Hộp

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming (3D Interval DP)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Strange Printer](https://leetcode.com/problems/strange-printer) | [Zuma Game](https://leetcode.com/problems/zuma-game)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Như trò chơi phá gạch — bạn có thể gom nhiều gạch cùng màu lại rồi xóa cùng lúc để được điểm bình phương. Trick: khi gặp nhóm k hộp giống ở đầu, bạn có thể "chờ" gom thêm các hộp cùng màu ở phía sau vào cùng nhóm trước khi xóa.

**Pattern Recognition:**

- Signal: "remove groups, score = size²" + "can reorder removes" → **3D DP dp[l][r][k]**
- State `dp[l][r][k]`: điểm tối đa từ boxes[l..r] khi có thêm k hộp màu boxes[l] gắn vào trái
- Key insight: k = số hộp cùng màu boxes[l] đã gom từ trước chưa xóa

**Visual — boxes = [1,3,2,2,2,3,4,3,1]:**

```
dp[l][r][k]: k hộp màu boxes[l] đã có sẵn bên trái

Option A: xóa cả nhóm boxes[l] luôn (k+1 hộp)
  score = (k+1)² + dp[l+1][r][0]

Option B: tìm m trong (l,r] có boxes[m]==boxes[l]
  gộp: dp[l+1][m-1][0] + dp[m][r][k+1]
       (xóa giữa, rồi xử lý phần còn lại với k+1 hộp màu boxes[l])
```

---

## Problem Description

Given boxes of different colors, each removal of k consecutive same-colored boxes earns `k*k` points. Return the maximum points achievable by removing all boxes optimally.

- Example 1: `boxes = [1,3,2,2,2,3,4,3,1]` → `23`
- Example 2: `boxes = [1,1,1]` → `9` (remove all 3 at once: 3²=9)
- Example 3: `boxes = [1]` → `1`

Constraints: `1 <= boxes.length <= 100`, `1 <= boxes[i] <= 100`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "k consecutive same-colored = score k²" / Consecutive, not arbitrary same-color
2. **Why 3D?** 2D dp[l][r] không đủ — cần biết có bao nhiêu hộp màu boxes[l] đã gom ở ngoài dải
3. **State**: dp[l][r][k] = max score từ boxes[l..r] với k hộp màu boxes[l] sẵn có bên trái
4. **Transition 2 cases**: Xóa nhóm trái ngay, hoặc tìm hộp cùng màu ở phía sau để gộp
5. **Memoization**: Dùng 3D array — n=100 → 100³=10^6 states, hoàn toàn chấp nhận được
6. **Optimization**: Gom consecutive same-color tại đầu ngay vào k trước khi recurse

---

## Solutions

```typescript
/**
 * Solution 1: Naive Recursion (without memoization)
 * Time: O(n^4) — exponential states without memo
 * Space: O(n³) — recursion depth
 */
function removeBoxesNaive(boxes: number[]): number {
  function solve(l: number, r: number, k: number): number {
    if (l > r) return 0;
    // Collect consecutive same-color at start
    while (l < r && boxes[l + 1] === boxes[l]) {
      l++;
      k++;
    }
    // Option A: remove left group immediately
    let res = (k + 1) * (k + 1) + solve(l + 1, r, 0);
    // Option B: find matching color later
    for (let m = l + 1; m <= r; m++) {
      if (boxes[m] === boxes[l]) {
        res = Math.max(res, solve(l + 1, m - 1, 0) + solve(m, r, k + 1));
      }
    }
    return res;
  }
  return solve(0, boxes.length - 1, 0);
}

/**
 * Solution 2: 3D DP with Memoization (Optimal)
 * Time: O(n^4) — n³ states, each O(n) transition
 * Space: O(n³) — 3D memo table
 */
function removeBoxes(boxes: number[]): number {
  const n = boxes.length;
  // dp[l][r][k]: max score from boxes[l..r] with k extra same-color boxes as boxes[l] on left
  const dp: number[][][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => new Array(n).fill(-1)),
  );

  function solve(l: number, r: number, k: number): number {
    if (l > r) return 0;
    if (dp[l][r][k] !== -1) return dp[l][r][k];

    // Optimization: merge consecutive same-color boxes at the left end into k
    let ll = l,
      kk = k;
    while (ll + 1 <= r && boxes[ll + 1] === boxes[ll]) {
      ll++;
      kk++;
    }

    // Option A: remove the merged left group (kk+1 boxes) immediately
    let res = (kk + 1) * (kk + 1) + solve(ll + 1, r, 0);

    // Option B: find a box m in (ll, r] with same color as boxes[l], attach it
    for (let m = ll + 1; m <= r; m++) {
      if (boxes[m] === boxes[l]) {
        // Clear boxes between ll and m, then handle m..r with one more matching box
        res = Math.max(res, solve(ll + 1, m - 1, 0) + solve(m, r, kk + 1));
      }
    }

    dp[l][r][k] = res;
    return res;
  }

  return solve(0, n - 1, 0);
}

// === Test Cases ===
console.log(removeBoxes([1, 3, 2, 2, 2, 3, 4, 3, 1])); // 23
console.log(removeBoxes([1, 1, 1])); // 9
console.log(removeBoxes([1])); // 1
console.log(removeBoxes([1, 2, 1])); // 5 (remove 2→1pt, then 1,1→4pt = 5)
```

---

## 🔗 Related Problems

- [Strange Printer](https://leetcode.com/problems/strange-printer) — interval DP with similar grouping intuition
- [Zuma Game](https://leetcode.com/problems/zuma-game) — same "group and burst" interval DP idea
- [Burst Balloons](https://leetcode.com/problems/burst-balloons) — classic interval DP with score on last element
- [Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones) — interval DP with grouping
- [Stone Game](https://leetcode.com/problems/stone-game) — simpler game DP on intervals
