---
layout: page
title: "Maximum Difference Score in a Grid"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Matrix]
leetcode_url: "https://leetcode.com/problems/maximum-difference-score-in-a-grid"
---

# Maximum Difference Score in a Grid / Điểm Chênh Lệch Tối Đa Trong Lưới

🟡 Medium | Dynamic Programming · Matrix

---

## 🧠 Intuition

**EN:** You can move right or down. The score of a path from cell A to cell B is `grid[B] - grid[A]`. Maximize over all valid paths. Key insight: for each cell (i,j), find the **minimum value** in any cell you could have come from (i.e., any cell (r,c) where r≤i, c≤j, not equal to (i,j)). Track this with `minDP[i][j]`.

**VI:** Di chuyển phải hoặc xuống. Điểm từ A đến B là `grid[B] - grid[A]`. Tối đa hóa qua mọi đường đi hợp lệ. Chìa khóa: với mỗi ô (i,j), tìm giá trị **tối thiểu** trong mọi ô có thể đến từ đó (r≤i, c≤j, khác (i,j)). Theo dõi bằng `minDP[i][j]`.

```
Grid:     minDP (min value reachable to reach this cell):
9 5 7 3    ∞  ∞  ∞  ∞
8 9 6 1    9  5  5  3  ← min(9,5,7) etc.
6 7 5 2    6  5  5  1
5 3 2 4    5  3  2  1

For cell (i,j): best score = grid[i][j] - minDP[i][j]
minDP[i][j] = min(grid[i][j-1], minDP[i][j-1],
                  grid[i-1][j], minDP[i-1][j])
```

---

## 📝 Interview Tips

- 🔑 **EN:** Score of a single move from (r,c)→(i,j) = `grid[i][j] - grid[r][c]`. Best = maximize `grid[i][j] - min_value_in_upper_left`. **VI:** Điểm di chuyển = grid[i][j] - grid[r][c]. Tối đa = grid[i][j] - giá trị_nhỏ_nhất_trên_trái.
- 🔑 **EN:** `minDP[i][j]` = minimum `grid` value in rectangle `[0..i-1][0..j] ∪ [0..i][0..j-1]` (all reachable predecessors). **VI:** minDP[i][j] = giá trị nhỏ nhất trong hình chữ nhật bên trên-bên trái (không bao gồm (i,j)).
- 🔑 **EN:** Transition: `minDP[i][j] = min(minDP[i-1][j], minDP[i][j-1], grid[i-1][j], grid[i][j-1])`. **VI:** Chuyển tiếp: lấy min của các ô liền kề từ trên/trái cùng minDP của chúng.
- 🔑 **EN:** Answer = max over all (i,j) of `grid[i][j] - minDP[i][j]`. **VI:** Kết quả = max qua mọi (i,j) của grid[i][j] - minDP[i][j].
- 🔑 **EN:** Can collapse minDP into the grid itself if mutation is allowed. **VI:** Có thể gộp minDP vào grid nếu được phép sửa đổi.
- 🔑 **EN:** Edge: first row/col — predecessor only from left or top, handle separately. **VI:** Biên: hàng/cột đầu — chỉ có một phía, xử lý riêng.

---

## 💡 Solutions

```typescript
/**
 * DP: track minimum value in upper-left region for each cell
 * Time: O(m * n)  Space: O(m * n)
 */
function maxScore(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const INF = Infinity;

  // minDP[i][j] = min grid value among all valid predecessors of (i,j)
  const minDP: number[][] = Array.from({ length: m }, () => new Array(n).fill(INF));
  let ans = -INF;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Gather min predecessor values
      const fromTop = i > 0 ? Math.min(grid[i - 1][j], minDP[i - 1][j]) : INF;
      const fromLeft = j > 0 ? Math.min(grid[i][j - 1], minDP[i][j - 1]) : INF;
      minDP[i][j] = Math.min(fromTop, fromLeft);

      // Score at this cell: current - best predecessor min
      if (minDP[i][j] !== INF) {
        ans = Math.max(ans, grid[i][j] - minDP[i][j]);
      }
    }
  }

  return ans;
}

/**
 * Space-optimized version using a single prev-row array
 * Time: O(m * n)  Space: O(n)
 */
function maxScoreOpt(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0].length;
  const INF = Infinity;
  let ans = -INF;

  // minPrev[j] = minDP value of previous row at column j
  let minPrev = new Array(n).fill(INF);

  for (let i = 0; i < m; i++) {
    const minCur = new Array(n).fill(INF);
    let rowMin = INF; // running min from left within this row

    for (let j = 0; j < n; j++) {
      // Best predecessor: from top (minPrev[j] or grid[i-1][j])
      // or from left (rowMin tracking grid[i][j-1] and minCur[j-1])
      const fromTop = i > 0 ? Math.min(grid[i - 1][j], minPrev[j]) : INF;
      const best = Math.min(fromTop, rowMin);
      minCur[j] = best;

      if (best !== INF) ans = Math.max(ans, grid[i][j] - best);

      // Update rowMin for next column in this row
      rowMin = Math.min(rowMin, grid[i][j], minPrev[j] === INF ? INF : minPrev[j]);
    }

    minPrev = minCur;
  }

  return ans;
}

// Tests
console.log(
  maxScore([
    [9, 5, 7, 3],
    [8, 9, 6, 1],
    [6, 7, 5, 2],
    [5, 3, 2, 4],
  ]),
); // 9
console.log(
  maxScore([
    [4, 3],
    [2, 1],
  ]),
); // -1 (all moves decrease)
console.log(
  maxScoreOpt([
    [9, 5, 7, 3],
    [8, 9, 6, 1],
    [6, 7, 5, 2],
    [5, 3, 2, 4],
  ]),
); // 9
```

---

## 🔗 Related Problems

| Problem                                                                                           | Difficulty | Pattern              |
| ------------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| [Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/)                               | 🟡 Medium  | Grid DP              |
| [Maximal Square](https://leetcode.com/problems/maximal-square/)                                   | 🟡 Medium  | Grid DP              |
| [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | 🟢 Easy    | Track Min + Max Diff |
