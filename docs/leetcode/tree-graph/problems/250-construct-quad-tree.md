---
layout: page
title: "Construct Quad Tree"
difficulty: Medium
category: Tree & Graph
tags: [Array, Divide and Conquer, Tree, Matrix]
leetcode_url: "https://leetcode.com/problems/construct-quad-tree"
---

# Construct Quad Tree / Xây Dựng Quad Tree

> **Track**: Tree & Graph | **Difficulty**: 🟡 Medium | **Pattern**: Divide & Conquer
> **Frequency**: 📘 Tier 3 — Gặp ở Google, Amazon
> **See also**: [Image Overlap](https://leetcode.com/problems/image-overlap) | [Regions Cut by Slashes](https://leetcode.com/problems/regions-cut-by-slashes)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng bạn đang phân tích ảnh vệ tinh: nếu một vùng toàn là đất hoặc toàn là biển, bạn đánh dấu nó ngay mà không cần chia nhỏ thêm. Nhưng nếu vùng đó vừa có đất vừa có biển, bạn chia thành 4 góc vuông bằng nhau và kiểm tra lại từng góc. Đây chính là Quad Tree — một cấu trúc dữ liệu nén ảnh thông minh: chia đôi theo cả hai chiều cho đến khi mỗi vùng con đồng nhất. Số node ít hơn nhiều so với lưu từng pixel.

## Visual (Minh họa trực quan)

```
grid = [[0,1],[1,0]]

                build(0,0,2)
               /    not uniform → split into 4
    ┌──────────┬──────────┐
    │build(0,0,1)│build(0,1,1)│
    │  val=0    │  val=1    │
    │  leaf=T   │  leaf=T   │
    ├──────────┼──────────┤
    │build(1,0,1)│build(1,1,1)│
    │  val=1    │  val=0    │
    │  leaf=T   │  leaf=T   │
    └──────────┴──────────┘
Root: isLeaf=false, val=1(arbitrary), 4 children

grid = [[1,1],[1,1]] → single leaf node: {isLeaf:T, val:T}
```

## Problem (Bài toán)

Given an `n x n` binary matrix `grid`, construct its **Quad Tree**. A Quad Tree node has `val` (true/false), `isLeaf` (boolean), and four children (`topLeft`, `topRight`, `bottomLeft`, `bottomRight`). If a region is uniform, make it a leaf. Otherwise, split into 4 equal quadrants recursively.

**Example 1:** `grid=[[0,1],[1,0]]` → non-leaf root with 4 leaf children
**Example 2:** `grid=[[1,1,1,1,0,0,0,0],[...]]` (8x8 mixed grid) → nested structure
**Example 3:** `grid=[[1,1],[1,1]]` → `[[1,1]]` (single leaf, val=true)

**Constraints:** `n == grid.length == grid[i].length`, `n` is a power of 2, `1 ≤ n ≤ 64`, `0 ≤ grid[i][j] ≤ 1`

## Tips (Mẹo phỏng vấn)

- **Check uniform first** / Kiểm tra đồng nhất trước: Dùng prefix sum 2D để kiểm tra tổng một vùng bằng 0 hoặc n² trong O(1)
- **Divide by 2** / Chia đôi kích thước: Mỗi lần chia, bán kính giảm một nửa — tổng depth là log₂(n)
- **Leaf node val** / Giá trị của lá: Với leaf, `val = grid[row][col]` (true/false) — với non-leaf val thường để `true` nhưng không quan trọng
- **Prefix sum 2D** / Tổng tiền tố 2D: `sum[r+1][c+1] = grid[r][c] + sum[r][c+1] + sum[r+1][c] - sum[r][c]` để query O(1)
- **Recursion structure** / Cấu trúc đệ quy: `build(row, col, size)` — khi `size=1` luôn là leaf
- **Merge condition** / Điều kiện gộp: Nếu cả 4 con đều là leaf và cùng val → có thể tối ưu gộp lại (bài này không yêu cầu)

## Solution 1 - Naive Recursive (Check each cell)

```typescript
/**
 * @complexity Time: O(n² log n) | Space: O(log n) call stack
 * At each level check all cells in region; split if not uniform
 */
class QuadNode {
  val: boolean;
  isLeaf: boolean;
  topLeft: QuadNode | null;
  topRight: QuadNode | null;
  bottomLeft: QuadNode | null;
  bottomRight: QuadNode | null;
  constructor(val: boolean, isLeaf: boolean) {
    this.val = val;
    this.isLeaf = isLeaf;
    this.topLeft = this.topRight = this.bottomLeft = this.bottomRight = null;
  }
}

function construct(grid: number[][]): QuadNode | null {
  const n = grid.length;

  function build(r: number, c: number, size: number): QuadNode {
    const first = grid[r][c];
    let uniform = true;
    outer: for (let i = r; i < r + size; i++)
      for (let j = c; j < c + size; j++)
        if (grid[i][j] !== first) {
          uniform = false;
          break outer;
        }

    if (uniform) return new QuadNode(first === 1, true);
    const half = size >> 1;
    const node = new QuadNode(true, false);
    node.topLeft = build(r, c, half);
    node.topRight = build(r, c + half, half);
    node.bottomLeft = build(r + half, c, half);
    node.bottomRight = build(r + half, c + half, half);
    return node;
  }

  return build(0, 0, n);
}
```

## Solution 2 - Prefix Sum 2D (Optimal O(n²))

```typescript
/**
 * @complexity Time: O(n²) | Space: O(n²) prefix + O(log n) stack
 * Precompute 2D prefix sum; check region uniformity in O(1)
 */
function constructOptimal(grid: number[][]): QuadNode | null {
  const n = grid.length;
  const pre = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      pre[r + 1][c + 1] = grid[r][c] + pre[r][c + 1] + pre[r + 1][c] - pre[r][c];

  function regionSum(r: number, c: number, size: number): number {
    return pre[r + size][c + size] - pre[r][c + size] - pre[r + size][c] + pre[r][c];
  }

  function build(r: number, c: number, size: number): QuadNode {
    const s = regionSum(r, c, size);
    if (s === 0) return new QuadNode(false, true);
    if (s === size * size) return new QuadNode(true, true);
    const half = size >> 1;
    const node = new QuadNode(true, false);
    node.topLeft = build(r, c, half);
    node.topRight = build(r, c + half, half);
    node.bottomLeft = build(r + half, c, half);
    node.bottomRight = build(r + half, c + half, half);
    return node;
  }

  return build(0, 0, n);
}
```

## Test Cases

```typescript
const g1 = [
  [0, 1],
  [1, 0],
];
const r1 = construct(g1);
console.log(r1?.isLeaf); // → false
console.log(r1?.topLeft?.val); // → false (0)

const g2 = [
  [1, 1],
  [1, 1],
];
const r2 = constructOptimal(g2);
console.log(r2?.isLeaf); // → true
console.log(r2?.val); // → true

const g3 = [[0]];
const r3 = construct(g3);
console.log(r3?.isLeaf); // → true
console.log(r3?.val); // → false
```

## Related Problems

| Problem                        | Difficulty | Link                                                              |
| ------------------------------ | ---------- | ----------------------------------------------------------------- |
| Image Overlap                  | Medium     | [LC 835](https://leetcode.com/problems/image-overlap)             |
| Segment Tree (Range Sum Query) | Medium     | [LC 307](https://leetcode.com/problems/range-sum-query-mutable)   |
| Count Complete Tree Nodes      | Easy       | [LC 222](https://leetcode.com/problems/count-complete-tree-nodes) |
