---
layout: page
title: "Sum of Remoteness of All Cells"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, Depth-First Search, Breadth-First Search, Union Find]
leetcode_url: "https://leetcode.com/problems/sum-of-remoteness-of-all-cells"
---

# Sum of Remoteness of All Cells / Tổng Độ Xa Cách Của Tất Cả Ô

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Max Area of Island](https://leetcode.com/problems/max-area-of-island) | [Making A Large Island](https://leetcode.com/problems/making-a-large-island)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống hệ thống ao làng — một số ao bị rào kín (ô -1), các ao còn lại kết nối thành từng cụm. Độ xa cách của một ao là tổng giá trị tất cả ao **không trong cùng cụm**. Như thể "ta cô lập bao nhiêu tiền từ các cụm khác?".

**Pattern Recognition:**

- Signal: "grid with blocked cells" + "connected components" + "sum of values outside group" → **DFS/BFS to find components**
- Key insight: Với mỗi component có `compSum` và `compSize`, remoteness của mỗi ô = `(totalSum - compSum)`

**Visual — Sum of Remoteness of All Cells example:**

```
Grid:  1   2  -1         totalSum = 1+2+3+4 = 10
       3  -1   4
Components: {(0,0)=1,(1,0)=3} compSum=4, size=2
            {(0,1)=2}         compSum=2, size=1
            {(1,2)=4}         compSum=4, size=1
Remoteness:
  (0,0): totalSum - 4 = 6
  (1,0): totalSum - 4 = 6
  (0,1): totalSum - 2 = 8
  (1,2): totalSum - 4 = 6
Total = 6+6+8+6 = 26
```

---

## 📝 Problem Description

Given an `n×n` grid where `-1` means a blocked cell. For each non-blocked cell, its **remoteness** is the sum of all non-blocked cells it **cannot reach** (not in the same connected component). Return the sum of all cells' remoteness values.

**Example 1:** `grid = [[-1,1,-1],[5,-1,4],[-1,3,-1]]` → `Remote sum = 11+10+12+11+10+12 = ...`
**Example 2:** `grid = [[3,4],[2,-1]]` → `3+4+2 = 9 total. Cells (0,0),(0,1),(1,0) form one component, remoteness = 0 for each. Sum = 0.`

Constraints: `1 ≤ n ≤ 300`, grid values in `[-1, 10⁶]`.

---

## 🎯 Interview Tips

1. **Key formula**: remoteness(cell) = totalSum − compSum(cell's component) / Công thức cốt lõi: remoteness = totalSum − compSum của component chứa ô đó
2. **Two-pass approach**: first compute totalSum and component sums, then calculate / 2 bước: tính compSum mỗi component, rồi tính remoteness
3. **Union Find or DFS/BFS**: both O(N²) for grid / Union Find hoặc DFS/BFS đều O(N²)
4. **Skip -1 cells**: they contribute nothing / Bỏ qua ô -1 — không tính vào component nào
5. **Large grids**: n=300 means 90k cells, O(N²) is fine / n=300 → 90k ô, O(N²) là ổn
6. **Sum overflow**: use BigInt or note that values ≤ 10⁶ × 90k < 10^11, use number carefully / Tổng có thể lớn, dùng number trong JS vẫn an toàn (< 2^53)

---

## 💡 Solutions

### Approach 1: DFS with Component Labeling — Brute Force

/\*_ @complexity Time: O(N²) | Space: O(N²) _/

```typescript
function sumOfRemotenessOfAllCellsBrute(grid: number[][]): number {
  const n = grid.length;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  const compId = Array.from({ length: n }, () => new Array(n).fill(-1));
  const compSums: number[] = [];
  let totalSum = 0, cid = 0;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) if (grid[r][c] !== -1) totalSum += grid[r][c];

  function dfs(r: number, c: number, id: number): number {
    if (r < 0 || r >= n || c < 0 || c >= n) return 0;
    if (grid[r][c] === -1 || compId[r][c] !== -1) return 0;
    compId[r][c] = id;
    let s = grid[r][c];
    for (const [dr, dc] of dirs) s += dfs(r + dr, c + dc, id);
    return s;
  }

  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      if (grid[r][c] !== -1 && compId[r][c] === -1) {
        compSums.push(dfs(r, c, cid++));
      }
    }

  let result = 0;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      if (grid[r][c] !== -1) result += totalSum - compSums[compId[r][c]];
    }
  return result;
}
```

### Approach 2: BFS Component Sum Map — Optimal

/\*_ @complexity Time: O(N²) | Space: O(N²) _/

```typescript
function sumOfRemotenessOfAllCells(grid: number[][]): number {
  const n = grid.length;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  const cellComp = new Map<number, number>();
  const visited = Array.from({ length: n }, () => new Array(n).fill(false));
  let totalSum = 0;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) if (grid[r][c] !== -1) totalSum += grid[r][c];

  function bfs(sr: number, sc: number): [number[], number] {
    const cells: number[] = [];
    let compSum = 0;
    const queue: [number, number][] = [[sr, sc]];
    visited[sr][sc] = true;
    while (queue.length) {
      const [r, c] = queue.shift()!;
      cells.push(r * n + c);
      compSum += grid[r][c];
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] !== -1) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    return [cells, compSum];
  }

  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      if (grid[r][c] !== -1 && !visited[r][c]) {
        const [cells, compSum] = bfs(r, c);
        for (const idx of cells) cellComp.set(idx, compSum);
      }
    }

  let result = 0;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      if (grid[r][c] !== -1) result += totalSum - (cellComp.get(r * n + c) ?? 0);
    }
  return result;
}
```

---

## 🧪 Test Cases

```typescript
const g1 = [[-1,1,-1],[5,-1,4],[-1,3,-1]];
const g2 = [[3,4],[2,-1]];
console.log(sumOfRemotenessOfAllCells(g1));       // → 30
console.log(sumOfRemotenessOfAllCells(g2));        // → 0
console.log(sumOfRemotenessOfAllCells([[1]]));     // → 0
console.log(sumOfRemotenessOfAllCellsBrute(g1));   // → 30
```

---

## Related Problems

| Problem                                                                      | Difficulty | Pattern    |
| ---------------------------------------------------------------------------- | ---------- | ---------- |
| [Number of Islands](https://leetcode.com/problems/number-of-islands)         | Medium     | DFS/BFS    |
| [Max Area of Island](https://leetcode.com/problems/max-area-of-island)       | Medium     | DFS/BFS    |
| [Making A Large Island](https://leetcode.com/problems/making-a-large-island) | Hard       | Union Find |
