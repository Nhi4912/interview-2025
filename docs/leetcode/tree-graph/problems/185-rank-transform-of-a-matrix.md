---
layout: page
title: "Rank Transform of a Matrix"
difficulty: Hard
category: Tree-Graph
tags: [Array, Union Find, Graph, Topological Sort, Sorting]
leetcode_url: "https://leetcode.com/problems/rank-transform-of-a-matrix"
---

# Rank Transform of a Matrix / Biến Đổi Thứ Hạng Ma Trận

🔴 Hard | Union Find | Topological Sort

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Giống như xếp hạng học sinh: nếu hai học sinh cùng lớp hoặc cùng trường có điểm bằng nhau, họ phải có cùng thứ hạng. Dùng Union-Find để nhóm các ô bằng nhau trong cùng hàng/cột, sau đó gán thứ hạng theo thứ tự tăng dần của giá trị.

```
Matrix:       After ranking:
[1, 2]        [1, 2]
[3, 4]        [2, 3]

Same value in row/col → same rank group → rank = max(row_rank, col_rank) + 1
```

**Key insight:** Process cells sorted by value. For equal values in the same row/col, they must get the same rank. Union-Find groups them, then assign `max rank in group + 1`.

## Problem Description

Given an `m x n` integer matrix, return a rank matrix where `answer[i][j]` is the rank of `matrix[i][j]`. The rank is an integer from 1 to `maxVal`. Ranks in the same row/column must reflect the relative order of values.

**Example 1:**

- Input: `[[1,2],[3,4]]`
- Output: `[[1,2],[2,3]]`

**Example 2:**

- Input: `[[7,7],[7,7]]`
- Output: `[[1,1],[1,1]]`

## 📝 Interview Tips

- **Q: Why Union-Find? / Tại sao dùng Union-Find?**
  - A: Equal values in same row/col must share rank — UF groups them / Giá trị bằng nhau cùng hàng/cột phải có cùng hạng.
- **Q: How assign rank after grouping? / Gán hạng sau khi nhóm như thế nào?**
  - A: rank = max existing rank in the group's rows and cols + 1 / Hạng = max hạng hiện tại trong hàng và cột của nhóm + 1.
- **Q: Why sort by value first? / Tại sao sắp xếp theo giá trị trước?**
  - A: Process smaller values first to ensure rank constraint / Xử lý giá trị nhỏ trước để đảm bảo ràng buộc thứ hạng.
- **Q: Time complexity? / Độ phức tạp?**
  - A: O(m*n*log(m*n)) for sorting / O(m*n*log(m*n)) cho việc sắp xếp.
- **Q: Can ranks repeat? / Thứ hạng có thể lặp không?**
  - A: Yes, if two equal-value cells are not in same row/col they may get different ranks / Có, nếu không cùng hàng/cột.
- **Q: Edge case? / Trường hợp biên?**
  - A: All equal values — all get rank 1 / Tất cả bằng nhau — tất cả hạng 1.

## Solutions

### Solution 1: Union-Find + Sort by Value

```typescript
/**
 * Compute rank transform of matrix.
 * Time: O(m*n*log(m*n))  Space: O(m*n)
 */
function matrixRankTransform(matrix: number[][]): number[][] {
  const m = matrix.length,
    n = matrix[0].length;
  const parent = Array.from({ length: m * n }, (_, i) => i);
  const rank = new Array(m * n).fill(0);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a: number, b: number): void {
    const pa = find(a),
      pb = find(b);
    if (pa !== pb) {
      parent[pa] = pb;
      rank[pb] = Math.max(rank[pa], rank[pb]);
    }
  }

  // rowRank[i] = current max rank used in row i
  const rowRank = new Array(m).fill(0);
  const colRank = new Array(n).fill(0);

  // Group cells by value, sorted ascending
  const valueMap = new Map<number, [number, number][]>();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const v = matrix[i][j];
      if (!valueMap.has(v)) valueMap.set(v, []);
      valueMap.get(v)!.push([i, j]);
    }
  }
  const sortedVals = [...valueMap.keys()].sort((a, b) => a - b);

  const result: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));

  for (const val of sortedVals) {
    const cells = valueMap.get(val)!;
    // Reset union-find for this batch
    const localParent = new Map<number, number>();
    function lFind(x: number): number {
      if (!localParent.has(x)) localParent.set(x, x);
      if (localParent.get(x) !== x) localParent.set(x, lFind(localParent.get(x)!));
      return localParent.get(x)!;
    }
    function lUnion(a: number, b: number): void {
      const pa = lFind(a),
        pb = lFind(b);
      if (pa !== pb) localParent.set(pa, pb);
    }

    for (const [i, j] of cells) {
      const id = i * n + j;
      localParent.set(id, id);
    }
    for (const [i, j] of cells) {
      // Union with other cells in same row/col with same value
      for (const [i2, j2] of cells) {
        if (i === i2 || j === j2) lUnion(i * n + j, i2 * n + j2);
      }
    }

    // For each group, determine rank = max(rowRank, colRank) + 1
    const groupRank = new Map<number, number>();
    for (const [i, j] of cells) {
      const root = lFind(i * n + j);
      const cur = groupRank.get(root) ?? 0;
      groupRank.set(root, Math.max(cur, rowRank[i], colRank[j]));
    }
    for (const [root, baseRank] of groupRank) {
      groupRank.set(root, baseRank + 1);
    }

    // Assign ranks and update rowRank/colRank
    for (const [i, j] of cells) {
      const r = groupRank.get(lFind(i * n + j))!;
      result[i][j] = r;
      rowRank[i] = Math.max(rowRank[i], r);
      colRank[j] = Math.max(colRank[j], r);
    }
  }

  return result;
}

// Tests
console.log(
  JSON.stringify(
    matrixRankTransform([
      [1, 2],
      [3, 4],
    ]),
  ),
); // [[1,2],[2,3]]
console.log(
  JSON.stringify(
    matrixRankTransform([
      [7, 7],
      [7, 7],
    ]),
  ),
); // [[1,1],[1,1]]
console.log(
  JSON.stringify(
    matrixRankTransform([
      [20, -21],
      [14, -99],
    ]),
  ),
);
// [[4,2],[3,1]]
```

## 🔗 Related Problems

| #    | Problem                                 | Difficulty | Key Concept |
| ---- | --------------------------------------- | ---------- | ----------- |
| 128  | Longest Consecutive Sequence            | Medium     | Union Find  |
| 1061 | Lexicographically Smallest Equiv String | Medium     | Union Find  |
| 1632 | Rank Transform of an Array              | Easy       | Sorting     |
| 1202 | Smallest String With Swaps              | Medium     | Union Find  |
