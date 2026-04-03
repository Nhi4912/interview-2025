---
layout: page
title: "Triangle"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/triangle"
---

# Triangle / Tam Giác

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming (Interval → Bottom-up)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum) | [Maximal Square](https://leetcode.com/problems/maximal-square)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Như chọn đường đi xuống cầu thang tam giác — mỗi bậc chỉ được bước sang ô liền kề phía dưới. Thay vì thử mọi đường từ trên xuống, ta **leo ngược từ dưới lên**: mỗi ô giữ tổng nhỏ nhất có thể đạt được từ nó xuống đáy.

**Pattern Recognition:**

- Signal: "minimum path" + "adjacent moves" + "triangle shape" → **Bottom-up DP on triangle**
- Giải từ dưới lên (bottom-up) — tránh handle boundary conditions phức tạp
- Key insight: dp[col] = triangle[row][col] + min(dp[col], dp[col+1]) — in-place rolling array

**Visual — Bottom-up DP trên triangle [2],[3,4],[6,5,7],[4,1,8,3]:**

```
Row 3 (base):  [4, 1, 8, 3]   ← start here
Row 2:  6+min(4,1)  5+min(1,8)  7+min(8,3)
     =  [7,        6,           10]
Row 1:  3+min(7,6)  4+min(6,10)
     =  [9,         10]
Row 0:  2+min(9,10) = [11]      ← answer
```

---

## Problem Description

Given a triangle array, return the minimum path sum from top to bottom. At each step you may move to an adjacent number in the row directly below (index `i` or `i+1`).

- Example 1: `triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]` → `11` (path: 2→3→5→1)
- Example 2: `triangle = [[-10]]` → `-10`

Constraints: `1 <= triangle.length <= 200`, `-10^4 <= triangle[i][j] <= 10^4`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Bottom-up hay top-down đều được, nhưng bottom-up tránh OOB checks" / Both directions work, bottom-up is cleaner
2. **Brute force**: DFS O(2^n) → memoization O(n²) → bottom-up O(n²) rolling array
3. **State**: `dp[col]` = min path sum from `(row, col)` to bottom — overwritten in-place each row
4. **Transition**: `dp[col] = triangle[row][col] + min(dp[col], dp[col+1])` — process left to right
5. **Space optimize**: Reuse last row as dp array → O(n) space, no extra allocation needed
6. **Edge case**: `triangle.length === 1` → return `triangle[0][0]` immediately

---

## Solutions

```typescript
/**
 * Solution 1: Top-down Memoization
 * Time: O(n²) — each (row, col) computed once
 * Space: O(n²) — memo + recursion stack
 */
function minimumTotalMemo(triangle: number[][]): number {
  const n = triangle.length;
  const memo: Map<string, number> = new Map();

  function dfs(row: number, col: number): number {
    if (row === n) return 0;
    const key = `${row},${col}`;
    if (memo.has(key)) return memo.get(key)!;
    const val = triangle[row][col] + Math.min(dfs(row + 1, col), dfs(row + 1, col + 1));
    memo.set(key, val);
    return val;
  }

  return dfs(0, 0);
}

/**
 * Solution 2: Bottom-up DP — Rolling Array (Optimal)
 * Time: O(n²) — two nested loops over triangle
 * Space: O(n) — single dp array reused each row
 */
function minimumTotal(triangle: number[][]): number {
  const n = triangle.length;
  // Start with a copy of the last row
  const dp = [...triangle[n - 1]];

  // Walk up from second-to-last row
  for (let row = n - 2; row >= 0; row--) {
    for (let col = 0; col <= row; col++) {
      dp[col] = triangle[row][col] + Math.min(dp[col], dp[col + 1]);
    }
  }

  return dp[0];
}

// === Test Cases ===
console.log(minimumTotal([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]])); // 11
console.log(minimumTotal([[-10]])); // -10
console.log(minimumTotal([[1], [2, 3]])); // 3
console.log(minimumTotal([[-1], [2, 3], [1, -1, -3]])); // -1
```

---

## 🔗 Related Problems

- [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum) — same bottom-up DP on 2D grid
- [Maximal Square](https://leetcode.com/problems/maximal-square) — 2D DP with state at each cell
- [Unique Paths II](https://leetcode.com/problems/unique-paths-ii) — grid DP with obstacles
- [Dungeon Game](https://leetcode.com/problems/dungeon-game) — also solved bottom-up on a grid
- [Pascal's Triangle](https://leetcode.com/problems/pascals-triangle) — triangle structure familiarity
