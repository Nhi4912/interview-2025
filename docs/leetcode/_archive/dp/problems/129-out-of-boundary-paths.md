---
layout: page
title: "Out of Boundary Paths"
difficulty: Medium
category: Dynamic Programming
tags: [Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/out-of-boundary-paths"
---

# Out of Boundary Paths / Đường Ra Ngoài Biên

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 | **Company tags**: Amazon, Apple

## 🧠 Intuition / Tư Duy

**Analogy:** Như con kiến đi ngẫu nhiên trong ô vuông — mỗi bước có thể lên/xuống/trái/phải. Đếm số cách thoát ra hàng rào trong tối đa maxMove bước, dùng DP theo từng lớp bước để lan truyền số lượng đường đi.

**Pattern Recognition:**

- "Count paths from a grid cell that exit within k moves" → DP on (moves, row, col)
- At each step: spread each cell's count to 4 neighbors; out-of-bounds → add to answer
- Two-layer DP (current/previous move) reduces space to O(m × n)

**Visual:**

```
m=2, n=2, maxMove=2, start=(0,0)
Move 0:  grid[0][0]=1  (all others 0)
Move 1:  spread (0,0)→ (-1,0)out(+1), (0,-1)out(+1), (1,0)=1, (0,1)=1
         ans += 2
Move 2:  from (1,0): (2,0)out(+1),(0,0)+1,(1,1)+1,(1,-1)out(+1)
         from (0,1): (-1,1)out(+1),(1,1)+1,(0,2)out(+1),(0,0)+1
         ans += 4    total ans = 6
```

## Problem Description

Given an `m × n` grid with a ball at `(startRow, startCol)`, return the number of paths of at most `maxMove` moves that take the ball out of bounds. Each move goes up/down/left/right. Return modulo 10⁹+7.

Examples: m=2, n=2, maxMove=2, (0,0) → 6; m=1, n=3, maxMove=3, (0,1) → 12.

## 📝 Interview Tips

1. **Clarify**: Mỗi lần ra biên là một đường đi riêng biệt, kể cả khi ra sớm / each out-of-bounds exit counts separately, even after using only 1 of maxMove steps.
2. **Approach**: dp[r][c] = số cách đến (r,c) sau `move` bước; mỗi bước lan ra 4 hướng, cộng vào ans nếu ra biên.
3. **Edge cases**: maxMove=0 → không bước nào → answer=0; ô ở góc có nhiều biên hơn.
4. **Optimize**: Chỉ giữ 2 lớp DP (prev và next) → O(m×n) space thay vì O(maxMove×m×n).
5. **Follow-up**: Nếu hỏi xác suất thay vì đếm → Knight Probability in Chessboard (LC 688).
6. **Complexity**: Time O(maxMove × m × n), Space O(m × n).

## Solutions

```typescript
/** Solution 1: Bottom-up DP (layer by layer)
 * Time: O(maxMove * m * n) | Space: O(m * n)
 */
function findPaths(
  m: number,
  n: number,
  maxMove: number,
  startRow: number,
  startCol: number,
): number {
  const MOD = 1_000_000_007;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  let dp = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  dp[startRow][startCol] = 1;
  let ans = 0;

  for (let move = 0; move < maxMove; move++) {
    const next = Array.from({ length: m }, () => new Array<number>(n).fill(0));
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (dp[r][c] === 0) continue;
        for (const [dr, dc] of dirs) {
          const nr = r + dr,
            nc = c + dc;
          if (nr < 0 || nr >= m || nc < 0 || nc >= n) {
            ans = (ans + dp[r][c]) % MOD;
          } else {
            next[nr][nc] = (next[nr][nc] + dp[r][c]) % MOD;
          }
        }
      }
    }
    dp = next;
  }
  return ans;
}

/** Solution 2: Memoized DFS (top-down)
 * Time: O(maxMove * m * n) | Space: O(maxMove * m * n)
 */
function findPaths2(
  m: number,
  n: number,
  maxMove: number,
  startRow: number,
  startCol: number,
): number {
  const MOD = 1_000_000_007;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const memo = new Map<string, number>();

  function dfs(r: number, c: number, moves: number): number {
    if (r < 0 || r >= m || c < 0 || c >= n) return 1;
    if (moves === 0) return 0;
    const key = `${r},${c},${moves}`;
    if (memo.has(key)) return memo.get(key)!;
    let res = 0;
    for (const [dr, dc] of dirs) res = (res + dfs(r + dr, c + dc, moves - 1)) % MOD;
    memo.set(key, res);
    return res;
  }
  return dfs(startRow, startCol, maxMove);
}

// Tests
console.log(findPaths(2, 2, 2, 0, 0)); // 6
console.log(findPaths(1, 3, 3, 0, 1)); // 12
console.log(findPaths2(2, 2, 2, 0, 0)); // 6
console.log(findPaths2(1, 3, 3, 0, 1)); // 12
console.log(findPaths(1, 1, 1, 0, 0)); // 4
console.log(findPaths(2, 2, 0, 0, 0)); // 0
```

## 🔗 Related Problems

| Problem                                                                                            | Relationship                                      |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [Knight Probability in Chessboard](https://leetcode.com/problems/knight-probability-in-chessboard) | Probability of staying in grid — same DP template |
| [Unique Paths II](https://leetcode.com/problems/unique-paths-ii)                                   | Grid path counting without move limit             |
| [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum)                                 | Grid DP optimizing path value                     |
