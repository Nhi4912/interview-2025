---
layout: page
title: "Length of Longest V-Shaped Diagonal Segment"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Memoization, Matrix]
leetcode_url: "https://leetcode.com/problems/length-of-longest-v-shaped-diagonal-segment"
---

# length of longest v shaped diagonal segment

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống **người leo núi trên bàn cờ số**: xuất phát từ ô **giá trị 1**, bước theo đường chéo xen kẽ 1→2→1→2→…, được phép **rẽ một lần** (phản xạ gương) tạo hình chữ V. Trạng thái DP: `(hàng, cột, hướng, đã_rẽ)` — 8 trạng thái mỗi ô.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
Grid 3×5                        V-shape dài nhất = 5
┌───┬───┬───┬───┬───┐           ┌───┬───┬───┬───┬───┐
│ 1 │ 0 │ 0 │ 0 │ 1 │           │[1]│   │   │   │[1]│
├───┼───┼───┼───┼───┤    =>     ├───┼───┼───┼───┼───┤
│ 0 │ 2 │ 0 │ 2 │ 0 │           │   │[2]│   │[2]│   │
├───┼───┼───┼───┼───┤           ├───┼───┼───┼───┼───┤
│ 0 │ 0 │ 1 │ 0 │ 0 │           │   │   │[1]│   │   │
└───┴───┴───┴───┴───┘           └───┴───┴───┴───┴───┘
(0,0)→(1,1)→(2,2) ↘ rẽ ↗ →(1,3)→(0,4)  [1,2,1,2,1] = 5

4 hướng chéo & phản xạ:
  dir0 ↘(+1,+1) ──flip-col──► dir1 ↙(+1,−1)
               └──flip-row──► dir2 ↗(−1,+1)
  dir3 ↖(−1,−1) ──flip-col──► dir2, flip-row──► dir1
```

---

## Problem Description

| Problem                                                                                                               | Difficulty | Key Similarity               |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------- |
| [Longest Line of Consecutive One in Matrix](https://leetcode.com/problems/longest-line-of-consecutive-one-in-matrix/) | Medium     | Direction-encoded DP on grid |
| [Longest Increasing Path in Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/)               | Hard       | DFS + memoization on 2D grid |
| [Knight Dialer](https://leetcode.com/problems/knight-dialer/)                                                         | Medium     | Direction-based state DP     |

---

## 📝 Interview Tips

1. **State = (r,c,dir,turned)** — 4 dirs × 2 turn states = 8 per cell / 8 trạng thái mỗi ô.
2. **Next value = 3 − current** — no parity counter needed / Không cần đếm chẵn lẻ.
3. **2 turn types per direction** — flip-row or flip-col; never both / 2 kiểu rẽ, lật cả hai là đi ngược.
4. **Two-phase DP** — compute turned=1 first; turned=0 depends on it / Tính đã_rẽ trước.
5. **Process in reverse** — for ↘, iterate from bottom-right / Lặp ngược chiều di chuyển.
6. **Answer at value-1 cells only** — "starts at 1" enforced at collection / Chỉ thu kết quả tại ô = 1.

---

## Solutions

```typescript
/** @complexity Time: O(m·n·8) | Space: O(m·n·8) */
function lenLongestVDiagonalSegment(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const dirs: [number, number][] = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  const turnDirs: [number, number][] = [
    [1, 2],
    [0, 3],
    [3, 0],
    [2, 1],
  ];
  const memo = new Int32Array(m * n * 8).fill(-1);
  function dfs(r: number, c: number, d: number, t: number): number {
    if (grid[r][c] === 0) return 0;
    const key = (r * n + c) * 8 + d * 2 + t;
    if (memo[key] !== -1) return memo[key];
    const [dr, dc] = dirs[d];
    const nv = 3 - grid[r][c];
    let best = 1;
    const nr = r + dr,
      nc = c + dc;
    if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === nv)
      best = Math.max(best, 1 + dfs(nr, nc, d, t));
    if (t === 0) {
      for (const td of turnDirs[d]) {
        const [tdr, tdc] = dirs[td];
        const tr = r + tdr,
          tc = c + tdc;
        if (tr >= 0 && tr < m && tc >= 0 && tc < n && grid[tr][tc] === nv)
          best = Math.max(best, 1 + dfs(tr, tc, td, 1));
      }
    }
    return (memo[key] = best);
  }
  let ans = 0;
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (grid[r][c] === 1) for (let d = 0; d < 4; d++) ans = Math.max(ans, dfs(r, c, d, 0));
  return ans;
}

/** @complexity Time: O(m·n·8) | Space: O(m·n·8) */
function lenLongestVDiagonalDP(grid: number[][]): number {
  const m = grid.length,
    n = grid[0].length;
  const dirs: [number, number][] = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  const turnDirs: [number, number][] = [
    [1, 2],
    [0, 3],
    [3, 0],
    [2, 1],
  ];
  const dp = new Int32Array(m * n * 8);
  // Phase 1: turned=1 states (no more turns, just extend)
  for (let d = 0; d < 4; d++) {
    const [dr, dc] = dirs[d];
    const rS = dr > 0 ? m - 1 : 0,
      rE = dr > 0 ? -1 : m,
      rD = dr > 0 ? -1 : 1;
    const cS = dc > 0 ? n - 1 : 0,
      cE = dc > 0 ? -1 : n,
      cD = dc > 0 ? -1 : 1;
    for (let r = rS; r !== rE; r += rD)
      for (let c = cS; c !== cE; c += cD) {
        const k = (r * n + c) * 8 + d * 2 + 1;
        if (grid[r][c] === 0) {
          dp[k] = 0;
          continue;
        }
        dp[k] = 1;
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 3 - grid[r][c])
          dp[k] = 1 + dp[(nr * n + nc) * 8 + d * 2 + 1];
      }
  }
  // Phase 2: turned=0 states (can turn or continue)
  let ans = 0;
  for (let d = 0; d < 4; d++) {
    const [dr, dc] = dirs[d];
    const rS = dr > 0 ? m - 1 : 0,
      rE = dr > 0 ? -1 : m,
      rD = dr > 0 ? -1 : 1;
    const cS = dc > 0 ? n - 1 : 0,
      cE = dc > 0 ? -1 : n,
      cD = dc > 0 ? -1 : 1;
    for (let r = rS; r !== rE; r += rD)
      for (let c = cS; c !== cE; c += cD) {
        const k = (r * n + c) * 8 + d * 2;
        if (grid[r][c] === 0) {
          dp[k] = 0;
          continue;
        }
        const nv = 3 - grid[r][c];
        dp[k] = 1;
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === nv)
          dp[k] = Math.max(dp[k], 1 + dp[(nr * n + nc) * 8 + d * 2]);
        for (const td of turnDirs[d]) {
          const [tdr, tdc] = dirs[td];
          const tr = r + tdr,
            tc = c + tdc;
          if (tr >= 0 && tr < m && tc >= 0 && tc < n && grid[tr][tc] === nv)
            dp[k] = Math.max(dp[k], 1 + dp[(tr * n + tc) * 8 + td * 2 + 1]);
        }
        if (grid[r][c] === 1) ans = Math.max(ans, dp[k]);
      }
  }
  return ans;
}

// === Test Cases ===
console.log(
  lenLongestVDiagonalSegment([
    [1, 0, 0, 0, 1],
    [0, 2, 0, 2, 0],
    [0, 0, 1, 0, 0],
  ]),
); // 5
console.log(
  lenLongestVDiagonalSegment([
    [1, 0, 0],
    [0, 2, 0],
    [0, 0, 1],
  ]),
); // 3
console.log(lenLongestVDiagonalSegment([[1]])); // 1
console.log(
  lenLongestVDiagonalSegment([
    [2, 2],
    [2, 2],
  ]),
); // 0
console.log(
  lenLongestVDiagonalDP([
    [1, 0, 0, 0, 1],
    [0, 2, 0, 2, 0],
    [0, 0, 1, 0, 0],
  ]),
); // 5
```

---

## 🔗 Related Problems

| Problem                                                                                                               | Difficulty | Key Similarity               |
| --------------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------- |
| [Longest Line of Consecutive One in Matrix](https://leetcode.com/problems/longest-line-of-consecutive-one-in-matrix/) | Medium     | Direction-encoded DP on grid |
| [Longest Increasing Path in Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/)               | Hard       | DFS + memoization on 2D grid |
| [Knight Dialer](https://leetcode.com/problems/knight-dialer/)                                                         | Medium     | Direction-based state DP     |
