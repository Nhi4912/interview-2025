---
layout: page
title: "Number of Paths with Max Score"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/number-of-paths-with-max-score"
---

# Number of Paths with Max Score / Number of Paths with Max Score

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximal Square](https://leetcode.com/problems/maximal-square) | [Unique Paths II](https://leetcode.com/problems/unique-paths-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống tìm đường đi từ góc phải dưới lên góc trái trên của mê cung — vừa muốn tổng điểm cao nhất vừa muốn đếm số đường đi đạt điểm đó. Cần theo dõi cả (maxScore, count) song song.

**Visual — board = ["E23","2X2","12S"]:**

```
Grid (bottom-right = 'S' = start, top-left = 'E' = end):
E  2  3      row 0: E=end, 2, 3
2  X  2      row 1: 2, X=blocked, 2
1  2  S      row 2: 1, 2, S=start(0)

Move: from (i,j) can go UP(i-1,j), LEFT(i,j-1), DIAG(i-1,j-1)
Start at bottom-right (2,2)=S with score 0
End at top-left (0,0)=E

dp[i][j] = [maxScore, pathCount] reaching (i,j) from S
dp[2][2] = [0, 1]  (start)
dp[2][1] = [2, 1]  (from S, score 2)
dp[2][0] = [1+2, 1] = [3, 1]...
...work backwards to (0,0)
```

---

## Problem Description

You are given a square array of characters `board` where `'S'` is the starting position (bottom-right), `'E'` is the ending position (top-left), `'X'` blocks the path, and digits `'1'-'9'` give scores. Move only **up, left, or diagonally up-left**. Return `[maxScore, numberOfPaths]` where `numberOfPaths` is the count of paths achieving `maxScore`, modulo `10^9 + 7`. If no path exists, return `[0, 0]`. ([LeetCode](https://leetcode.com/problems/number-of-paths-with-max-score))

Difficulty: Hard | Acceptance: 41.0%

**Example 1:**

```
Input: board = ["E23","2X2","12S"]
Output: [7, 1]
```

**Example 2:**

```
Input: board = ["E12","1X1","21S"]
Output: [4, 2]
```

Constraints:

- `2 <= n <= 100`
- `board[i].length == n`
- `board[i][j]` is a digit, `'S'`, `'E'`, or `'X'`

---

## 📝 Interview Tips

1. **Direction**: "Đi từ S (bottom-right) đến E (top-left) — chỉ đi lên, trái, chéo trên-trái" / Movement is restricted to 3 directions.
2. **State**: "dp[i][j] = [maxScore, count] — theo dõi cả điểm và số đường" / Track both score and count simultaneously.
3. **Transition**: "Với mỗi ô (i,j): lấy max từ 3 ô liền kề (i+1,j), (i,j+1), (i+1,j+1)" / Source cells are down, right, diagonal-down-right.
4. **Count update**: "Nếu new score > current max: cập nhật max và reset count. Nếu bằng nhau: cộng thêm count" / Two cases for count aggregation.
5. **Blocked**: "X là blocked, dp[i][j]=(−∞, 0)" / Mark blocked cells as unreachable.
6. **Modular**: "Count phải mod 10^9+7 tại mỗi bước cộng" / Apply modulo to count at each step.

---

## Solutions

```typescript
/**
 * Solution: DP from bottom-right to top-left
 * Time: O(n²) — each cell processed once
 * Space: O(n²) — dp table
 */
function pathsWithMaxScore(board: string[]): number[] {
  const MOD = 1_000_000_007;
  const n = board.length;
  const NEG_INF = -Infinity;

  // dp[i][j] = [maxScore, pathCount] reaching (i,j) from S
  const score: number[][] = Array.from({ length: n }, () => new Array(n).fill(NEG_INF));
  const count: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  // Start: bottom-right corner 'S'
  score[n - 1][n - 1] = 0;
  count[n - 1][n - 1] = 1;

  function update(i: number, j: number, fromI: number, fromJ: number): void {
    if (fromI < 0 || fromJ < 0 || fromI >= n || fromJ >= n) return;
    if (count[fromI][fromJ] === 0) return; // unreachable source
    const cellVal =
      board[i][j] === "E" || board[i][j] === "X"
        ? 0
        : board[i][j] === "S"
          ? 0
          : parseInt(board[i][j]);
    const newScore = score[fromI][fromJ] + cellVal;
    if (newScore > score[i][j]) {
      score[i][j] = newScore;
      count[i][j] = count[fromI][fromJ];
    } else if (newScore === score[i][j]) {
      count[i][j] = (count[i][j] + count[fromI][fromJ]) % MOD;
    }
  }

  // Process cells from bottom-right to top-left
  for (let i = n - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (board[i][j] === "X") continue;
      if (i === n - 1 && j === n - 1) continue; // already initialized

      // Can come from: down (i+1,j), right (i,j+1), diagonal (i+1,j+1)
      update(i, j, i + 1, j);
      update(i, j, i, j + 1);
      update(i, j, i + 1, j + 1);
    }
  }

  if (count[0][0] === 0) return [0, 0];
  return [score[0][0], count[0][0]];
}

// === Test Cases ===
console.log(pathsWithMaxScore(["E23", "2X2", "12S"])); // [7, 1]
console.log(pathsWithMaxScore(["E12", "1X1", "21S"])); // [4, 2]
console.log(pathsWithMaxScore(["EX", "XS"])); // [0, 0]
console.log(pathsWithMaxScore(["ES"])); // [0, 1]
```
