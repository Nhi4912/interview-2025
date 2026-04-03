---
layout: page
title: "Number of Islands"
difficulty: Medium
category: Tree/Graph
tags: [Graph, DFS, BFS, Grid, Flood Fill]
leetcode_url: "https://leetcode.com/problems/number-of-islands/"
leetcode_number: 200
pattern: "BFS/DFS Grid"
frequency_tier: 1
companies: [Amazon, Meta, Google, Microsoft]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Number of Islands / Đếm Số Lượng Đảo

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS/DFS (Grid Flood Fill)
> **Frequency**: 🔥 Tier 1 — bài graph phổ biến nhất, hỏi ở mọi công ty lớn
> **Target**: ⏱️ 20 min | **Companies**: Amazon, Meta, Google, Microsoft
> **See also**: [Clone Graph](./19-clone-graph.md) | [Word Ladder](./13-word-ladder.md) | [Course Schedule II](./15-course-schedule-ii.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tô màu bản đồ: gặp ô đất `'1'` chưa tô thì đếm thêm 1 đảo, sau đó lan ra tô hết tất cả ô đất liền kề (flood fill). Khi không còn ô liền kề, đảo đó xong — chuyển sang ô tiếp theo.

**Pattern Recognition:**

- Signal: "grid", "connected", "island/component" → **DFS/BFS flood fill, mark visited**
- Đánh dấu đã thăm: đổi `'1'` → `'0'` (hoặc dùng `visited` set)
- 4 hướng: trên, dưới, trái, phải — không tính đường chéo

**Visual — DFS flood fill:**

```
Before:              Gặp (0,0)='1' → count=1, flood fill:
1 1 0 0 0            0 0 0 0 0
1 1 0 0 0   →        0 0 0 0 0
0 0 1 0 0            0 0 1 0 0   ← chưa tô
0 0 0 1 1            0 0 0 1 1   ← chưa tô

Tiếp tục: (2,2)='1' → count=2; (3,3)='1' → count=3
Result: 3
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                |
| ---------------- | ------------------------------------------------------- |
| **When you see** | "grid", "connected components", "islands", "flood fill" |
| **Think**        | DFS/BFS flood fill — mỗi component chưa thăm = +1 count |
| **Template**     | `if (grid[r][c]==='1') { count++; dfs(r,c); }`          |
| **Time target**  | ⏱️ 20 min (Medium)                                      |

> 💡 **Memory hook / Móc nhớ:** "Gặp đất mới → đếm đảo → tô hết — không quay lại!"

---

## Problem Description

Given an `m x n` grid of `'1'`s (land) and `'0'`s (water), return the number of islands. An island is formed by connecting adjacent land cells horizontally or vertically.

```
Example 1: grid 4×5, one large connected island  → 1
Example 2: grid 4×5, three separate islands       → 3
```

Constraints:

- 1 <= m, n <= 300
- `grid[i][j]` is `'0'` or `'1'`

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We have a 2D grid of '1's and '0's. We need to count connected components of '1's where adjacency is 4-directional (no diagonals). Grid is surrounded by water."

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "This is a connected components problem on a grid. I'll iterate every cell — when I find an unvisited '1', increment count and flood-fill (DFS or BFS) to mark all connected land. O(m×n) time, O(m×n) space worst case for DFS stack."

### Step 3 — Implement / Viết Code (5-7 min)

> "Nested loop over grid. When grid[i][j]==='1': count++, call dfs(i,j). DFS: check bounds and value, mark '0', recurse in 4 directions."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace Example 2: (0,0)='1'→count=1, flood fills top-left block. (2,2)='1'→count=2. (3,3)='1'→count=3. Result 3. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(m×n) — each cell visited once. Space: O(m×n) worst case for recursion stack (snake-shaped land). BFS alternative limits queue to O(min(m,n)). Edge cases: all water → 0; all land → 1."

---

## 📝 Interview Tips

1. **Clarify**: "Diagonal connections count?" / "Ô chéo có được tính không?" (thường là không)
2. **Brute force**: DFS recursive — simplest, O(m×n) / DFS đệ quy, đơn giản nhất
3. **Optimize**: BFS avoids stack overflow for large grids; Union-Find for dynamic follow-up
4. **Edge cases**: All water → 0; all land → 1; grid rỗng → 0
5. **Follow-up**: "Don't modify grid?" → use visited Set; "Max island size?" → count cells in each DFS

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                                  | Why Wrong / Tại sao sai                                     | Fix / Cách sửa                                        |
| --- | -------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| 1   | Not marking cells as visited before recursing      | Causes infinite loops — cell gets re-visited from neighbors | Mark `grid[r][c] = '0'` immediately when entering DFS |
| 2   | Including diagonal neighbors                       | Problem specifies 4-directional only                        | Use only [up, down, left, right] directions           |
| 3   | BFS: marking visited on dequeue instead of enqueue | Same cell enqueued multiple times → TLE                     | Mark `'0'` when enqueuing, not when dequeuing         |

---

## Solutions

```typescript
/**
 * Solution 1: DFS Flood Fill (Standard)
 * Time: O(m × n) — each cell visited at most once
 * Space: O(m × n) — recursion stack worst case
 */
function numIslands(grid: string[][]): number {
  if (!grid || grid.length === 0) return 0;

  const m = grid.length;
  const n = grid[0].length;
  let count = 0;

  function dfs(r: number, c: number): void {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === "0") return;
    grid[r][c] = "0";
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

/**
 * Solution 2: BFS Flood Fill (Optimal for large grids)
 * Time: O(m × n) — each cell enqueued at most once
 * Space: O(min(m, n)) — queue bounded by diagonal length
 */
function numIslandsBFS(grid: string[][]): number {
  if (!grid || grid.length === 0) return 0;

  const m = grid.length;
  const n = grid[0].length;
  let count = 0;
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "1") {
        count++;
        grid[i][j] = "0";
        const queue: [number, number][] = [[i, j]];

        while (queue.length > 0) {
          const [r, c] = queue.shift()!;
          for (const [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === "1") {
              grid[nr][nc] = "0";
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
console.log(
  numIslands([
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"],
  ]),
); // 3
```

---

## 🔗 Related Problems

- [Clone Graph](./19-clone-graph.md) — DFS/BFS duyệt graph tổng quát
- [Word Ladder](./13-word-ladder.md) — BFS tìm đường ngắn nhất trên graph ngầm
- [Course Schedule II](./15-course-schedule-ii.md) — DFS cycle detection trong directed graph
- [Max Area of Island](https://leetcode.com/problems/max-area-of-island/) — same pattern, count cells per island

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 20 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
