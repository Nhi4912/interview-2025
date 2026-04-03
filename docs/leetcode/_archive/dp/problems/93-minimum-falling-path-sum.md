---
layout: page
title: "Minimum Falling Path Sum"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/minimum-falling-path-sum"
---

# Minimum Falling Path Sum / Tổng Đường Rơi Tối Thiểu

> **Difficulty**: 🟡 Medium | **Category**: Dynamic Programming | **Pattern**: Grid DP / Path DP

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Một giọt mưa rơi từ mái nhà xuống, mỗi bước chỉ được rơi thẳng hoặc chéo sang ô kề bên. Tìm con đường rơi có tổng giá trị nhỏ nhất.

**Pattern Recognition:**

- Row-by-row path → dp[i][j] = min sum reaching cell (i,j) from row 0
- Each cell comes from 3 possible cells above: left-diagonal, above, right-diagonal
- Final answer: min of last row

**Visual (matrix=[[2,1,3],[6,5,4],[7,8,9]]):**

```
Row 0:  2   1   3
Row 1:  min(2,1)+6=7  min(2,1,3)+5=6  min(1,3)+4=5
        →  8   6   5
Row 2:  min(8,6)+7=13  min(8,6,5)+8=13  min(6,5)+9=14
        → 13  13  14

Answer: min(13,13,14) = 13  (path: 1→5→4→? no: 1→4=path 1,3→path 3,4,9=wrong)
Actually 1→5→9=15? No. 2→1=row1[1]=6, 1→4=row1[2]=5... Answer = 13
```

## Problem Description

Given an `n × n` integer matrix, return the **minimum sum** of any falling path. A falling path starts at any element in the first row and chooses from the element directly below or either adjacent diagonal in each subsequent row.

**Example 1:** `matrix=[[2,1,3],[6,5,4],[7,8,9]]` → `13` (path: 1→5→7 = 13)
**Example 2:** `matrix=[[−19,57],[−40,−5]]` → `−59` (path: −19→−40)

**Constraints:** `n` is 1–100, values `−100` to `100`

## 📝 Interview Tips

1. **Clarify**: Can we start/end at any column? Yes — any element in first row, any in last row.
2. **Approach**: In-place DP on each row: for each cell, take min of valid predecessors + current.
3. **Edge cases**: n=1 → single element; edge columns only have 2 predecessors, not 3.
4. **Optimize**: Modify matrix in-place to avoid extra space (if mutation is allowed).
5. **Follow-up**: LeetCode 1289 "Minimum Falling Path Sum II" — non-adjacent columns allowed.
6. **Complexity**: O(n²) time, O(1) extra space (in-place).

## Solutions

```typescript
// Solution 1: In-place DP — Time: O(n²) | Space: O(1)
function minFallingPathSum(matrix: number[][]): number {
  const n = matrix.length;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const above = matrix[i - 1][j];
      const aboveLeft = j > 0 ? matrix[i - 1][j - 1] : Infinity;
      const aboveRight = j < n - 1 ? matrix[i - 1][j + 1] : Infinity;
      matrix[i][j] += Math.min(above, aboveLeft, aboveRight);
    }
  }

  return Math.min(...matrix[n - 1]);
}

// Solution 2: DP with copy (non-destructive) — Time: O(n²) | Space: O(n)
function minFallingPathSum2(matrix: number[][]): number {
  const n = matrix.length;
  let prev = [...matrix[0]];

  for (let i = 1; i < n; i++) {
    const curr = new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      let best = prev[j];
      if (j > 0) best = Math.min(best, prev[j - 1]);
      if (j < n - 1) best = Math.min(best, prev[j + 1]);
      curr[j] = matrix[i][j] + best;
    }
    prev = curr;
  }

  return Math.min(...prev);
}

// Solution 3: Track path (for reconstruction) — Time: O(n²) | Space: O(n²)
function minFallingPathSumWithPath(matrix: number[][]): number {
  const n = matrix.length;
  const dp = matrix.map((row) => [...row]);
  const from: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1));

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let best = dp[i - 1][j],
        bestJ = j;
      if (j > 0 && dp[i - 1][j - 1] < best) {
        best = dp[i - 1][j - 1];
        bestJ = j - 1;
      }
      if (j < n - 1 && dp[i - 1][j + 1] < best) {
        best = dp[i - 1][j + 1];
        bestJ = j + 1;
      }
      dp[i][j] += best;
      from[i][j] = bestJ;
    }
  }

  return Math.min(...dp[n - 1]);
}

// Tests
console.log(
  minFallingPathSum([
    [2, 1, 3],
    [6, 5, 4],
    [7, 8, 9],
  ]),
); // 13
console.log(
  minFallingPathSum([
    [-19, 57],
    [-40, -5],
  ]),
); // -59
console.log(minFallingPathSum([[1]])); // 1
console.log(
  minFallingPathSum([
    [1, 2],
    [3, 4],
  ]),
); // 4 (1→3)
console.log(
  minFallingPathSum([
    [100, -42, -46, -41],
    [31, 97, 10, -10],
    [-58, -51, 82, 89],
    [51, 81, 69, -51],
  ]),
); // -36
```

## 🔗 Related Problems

| Problem                                                                                   | Relationship                           |
| ----------------------------------------------------------------------------------------- | -------------------------------------- |
| [Minimum Falling Path Sum II](https://leetcode.com/problems/minimum-falling-path-sum-ii/) | No adjacent column restriction version |
| [Triangle](https://leetcode.com/problems/triangle/)                                       | Similar falling path on triangle       |
| [Dungeon Game](https://leetcode.com/problems/dungeon-game/)                               | Grid DP with path constraints          |
