---
layout: page
title: "Number of Islands"
difficulty: Medium
category: Tree/Graph
tags: [Graph, DFS, BFS, Grid, Flood Fill]
leetcode_url: "https://leetcode.com/problems/number-of-islands/"
---

# Number of Islands / Đếm Số Lượng Đảo

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS/DFS (Grid Flood Fill)
> **Frequency**: 🔥 Tier 1 — bài graph phổ biến nhất, hỏi ở mọi công ty lớn
> **See also**: [Clone Graph](./19-clone-graph.md) | [Word Ladder](./13-word-ladder.md) | [Course Schedule II](./15-course-schedule-ii.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang tô màu bản đồ: gặp ô đất `'1'` chưa tô thì đếm thêm 1 đảo, sau đó lan ra tô hết tất cả ô đất liền kề (flood fill). Khi không còn ô nào liền kề, đảo đó đã được đánh dấu xong — chuyển sang ô tiếp theo.

**Pattern Recognition:**

- Signal: "grid", "connected", "island/component" → **DFS/BFS flood fill, mark visited**
- Đánh dấu đã thăm bằng cách đổi `'1'` → `'0'` (hoặc dùng `visited` set)
- 4 hướng: trên, dưới, trái, phải — không tính đường chéo

**Visual — DFS flood fill trên Example 1:**

```
Before:              Gặp (0,0)='1' → count=1, flood fill:
1 1 1 1 0            0 0 0 0 0
1 1 0 1 0   →        0 0 0 0 0
1 1 0 0 0            0 0 0 0 0
0 0 0 0 0            0 0 0 0 0

Không còn '1' nào → Result: 1
```

---

## Problem Description

Given an `m x n` grid of `'1'`s (land) and `'0'`s (water), return the number of islands. An island is formed by connecting adjacent land cells horizontally or vertically; the grid is surrounded by water on all edges.

```
Example 1: grid 4×5 with one large connected island  → 1
Example 2: grid 4×5 with three separate islands      → 3
```

Constraints:

- 1 <= m, n <= 300
- `grid[i][j]` is `'0'` or `'1'`

---

## 📝 Interview Tips

1. **Clarify**: "Diagonal connections count?" / "Ô chéo có được tính là liền kề không?" (thường là không)
2. **Brute force**: DFS đệ quy — đơn giản nhất, O(m×n) time/space
3. **Optimize**: BFS tránh stack overflow với cây rất sâu; Union-Find cho bài follow-up dynamic
4. **Edge cases**: grid rỗng → 0; toàn nước → 0; toàn đất → 1
5. **Follow-up**: "Không được sửa grid?" — dùng `visited: Set<string>` thay vì mutate; "Max island size?" — đếm cell trong mỗi DFS

---

## Solutions

{% raw %}

/\*\*

- Solution 1: DFS Flood Fill (Standard)
- Time: O(m × n) — each cell visited at most once
- Space: O(m × n) — recursion stack in worst case (all land, thin snake)
  \*/
  function numIslands(grid: string[][]): number {
  if (!grid || grid.length === 0) return 0;

const m = grid.length;
const n = grid[0].length;
let count = 0;

function dfs(r: number, c: number): void {
if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === "0") return;
grid[r][c] = "0"; // mark visited
dfs(r - 1, c);
dfs(r + 1, c);
dfs(r, c - 1);
dfs(r, c + 1);
}

for (let i = 0; i < m; i++) {
for (let j = 0; j < n; j++) {
if (grid[i][j] === "1") {
count++;
dfs(i, j);
}
}
}

return count;
}

/\*\*

- Solution 2: BFS Flood Fill (Optimal for large grids — no recursion stack risk)
- Time: O(m × n) — each cell enqueued at most once
- Space: O(min(m, n)) — queue size bounded by diagonal length
  \*/
  function numIslandsBFS(grid: string[][]): number {
  if (!grid || grid.length === 0) return 0;

const m = grid.length;
const n = grid[0].length;
let count = 0;
const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

for (let i = 0; i < m; i++) {
for (let j = 0; j < n; j++) {
if (grid[i][j] === "1") {
count++;
grid[i][j] = "0"; // mark on enqueue, not dequeue (prevents duplicates)
const queue: [number, number][] = [[i, j]];

        while (queue.length > 0) {
          const [r, c] = queue.shift()!;
          for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === "1") {
              grid[nr][nc] = "0"; // mark on enqueue
              queue.push([nr, nc]);
            }
          }
        }
      }
    }

}

return count;
}

// === Test Cases ===
const grid1 = [
["1","1","1","1","0"],
["1","1","0","1","0"],
["1","1","0","0","0"],
["0","0","0","0","0"],
];
console.log(numIslands(grid1)); // 1

const grid2 = [
["1","1","0","0","0"],
["1","1","0","0","0"],
["0","0","1","0","0"],
["0","0","0","1","1"],
];
console.log(numIslandsBFS(grid2)); // 3

{% endraw %}

---

## 🔗 Related Problems

- [Clone Graph](./19-clone-graph.md) — DFS/BFS duyệt graph tổng quát
- [Word Ladder](./13-word-ladder.md) — BFS tìm đường ngắn nhất trên graph ngầm
- [Course Schedule II](./15-course-schedule-ii.md) — DFS phát hiện cycle trong directed graph
