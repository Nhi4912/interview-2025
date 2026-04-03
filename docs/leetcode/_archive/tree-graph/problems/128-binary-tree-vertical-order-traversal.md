---
layout: page
title: "Binary Tree Vertical Order Traversal"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Tree, Depth-First Search, Breadth-First Search, Sorting]
leetcode_url: "https://leetcode.com/problems/binary-tree-vertical-order-traversal"
---

# Binary Tree Vertical Order Traversal / Duyệt Cây Nhị Phân Theo Chiều Dọc

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS + HashMap
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như chụp ảnh từ trên xuống một cây xanh — mỗi cột dọc thu lại các nhánh cùng "kinh độ". BFS đảm bảo trong cùng cột, các nút được sắp xếp từ trên xuống (theo tầng), trái sang phải (theo thứ tự BFS).

**Pattern Recognition:**

- Signal: "vertical columns" + "top-to-bottom order within column" → **BFS with column tracking**
- BFS (not DFS) guarantees top-to-bottom ordering automatically — no sort needed within a column
- Root = column 0; left child = col-1; right child = col+1

**Visual:**

```
Tree: [3, 9, 20, null, null, 15, 7]

        3      col=0
       / \
      9   20   col=-1, col=1
         / \
        15   7  col=0, col=2

BFS visits with columns: (3,0),(9,-1),(20,1),(15,0),(7,2)
colMap: {-1:[9], 0:[3,15], 1:[20], 2:[7]}
Result: [[9], [3,15], [20], [7]]
```

## Problem Description

Given the root of a binary tree, return its **vertical order traversal** as a list of lists. Each list contains the values of nodes in that vertical column from top to bottom. If two nodes are in the same row and column, they appear left to right in BFS order.

Example 1: `root=[3,9,20,null,null,15,7]` → `[[9],[3,15],[20],[7]]`
Example 2: `root=[3,9,8,4,0,1,7]` → `[[4],[9],[3,0,1],[8],[7]]`

## 📝 Interview Tips

1. **Clarify**: "Khi 2 nodes cùng hàng, cùng cột — ai trước?" / Same row+col: left before right (BFS handles this)
2. **BFS vs DFS**: "Dùng BFS không cần sort vì BFS tự nhiên từ trên xuống" / BFS gives top-down order for free
3. **Column tracking**: "Root=0, trái=-1, phải=+1 — theo dõi minCol, maxCol" / Track min/max columns
4. **DFS approach**: "DFS cần thêm row để sort (row, col) → dùng BFS đơn giản hơn" / DFS needs row info
5. **Edge cases**: "Empty tree → []" / Null root returns empty array
6. **Complexity**: "Time O(n) | Space O(n) for queue and hashmap"

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** Solution 1: DFS + sort by (col, row) — requires tracking row
 * Time: O(n log n) | Space: O(n)
 */
function verticalOrderDFS(root: TreeNode | null): number[][] {
  if (!root) return [];
  const nodes: [number, number, number][] = []; // [col, row, val]

  function dfs(node: TreeNode | null, col: number, row: number): void {
    if (!node) return;
    nodes.push([col, row, node.val]);
    dfs(node.left, col - 1, row + 1);
    dfs(node.right, col + 1, row + 1);
  }

  dfs(root, 0, 0);
  nodes.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] !== b[1] ? a[1] - b[1] : 0));

  const result: number[][] = [];
  let prevCol = nodes[0][0] - 1;
  for (const [col, , val] of nodes) {
    if (col !== prevCol) {
      result.push([]);
      prevCol = col;
    }
    result[result.length - 1].push(val);
  }
  return result;
}

/** Solution 2: BFS with column map — optimal, no sort needed
 * Time: O(n) | Space: O(n)
 */
function verticalOrder(root: TreeNode | null): number[][] {
  if (!root) return [];

  const colMap = new Map<number, number[]>();
  const queue: [TreeNode, number][] = [[root, 0]];
  let minCol = 0,
    maxCol = 0;

  while (queue.length > 0) {
    const [node, col] = queue.shift()!;
    if (!colMap.has(col)) colMap.set(col, []);
    colMap.get(col)!.push(node.val);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    if (node.left) queue.push([node.left, col - 1]);
    if (node.right) queue.push([node.right, col + 1]);
  }

  const result: number[][] = [];
  for (let col = minCol; col <= maxCol; col++) {
    result.push(colMap.get(col)!);
  }
  return result;
}

/** Solution 3: BFS with deque simulation (explicit min/max tracking)
 * Time: O(n) | Space: O(n)
 */
function verticalOrderV3(root: TreeNode | null): number[][] {
  if (!root) return [];

  const columns: Map<number, number[]> = new Map();
  // Use array as queue with head pointer for efficiency
  const q: [TreeNode, number][] = [[root, 0]];
  let head = 0,
    minC = 0,
    maxC = 0;

  while (head < q.length) {
    const [node, col] = q[head++];
    const col_arr = columns.get(col) ?? [];
    col_arr.push(node.val);
    columns.set(col, col_arr);
    if (col < minC) minC = col;
    if (col > maxC) maxC = col;
    if (node.left) q.push([node.left, col - 1]);
    if (node.right) q.push([node.right, col + 1]);
  }

  const res: number[][] = [];
  for (let c = minC; c <= maxC; c++) res.push(columns.get(c) ?? []);
  return res;
}

// Helper builder
function buildTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0]!);
  const q = [root];
  let i = 1;
  while (i < vals.length) {
    const node = q.shift()!;
    if (vals[i] !== null) {
      node.left = new TreeNode(vals[i]!);
      q.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = new TreeNode(vals[i]!);
      q.push(node.right);
    }
    i++;
  }
  return root;
}

// Tests
console.log(JSON.stringify(verticalOrder(buildTree([3, 9, 20, null, null, 15, 7])))); // [[9],[3,15],[20],[7]]
console.log(JSON.stringify(verticalOrder(buildTree([3, 9, 8, 4, 0, 1, 7])))); // [[4],[9],[3,0,1],[8],[7]]
console.log(JSON.stringify(verticalOrderDFS(buildTree([3, 9, 20, null, null, 15, 7])))); // [[9],[3,15],[20],[7]]
console.log(
  JSON.stringify(
    verticalOrderV3(
      buildTree([1, 2, 3, 4, 10, 9, 11, null, 5, null, null, null, null, null, null]),
    ),
  ),
); // varies
console.log(JSON.stringify(verticalOrder(null))); // []
console.log(JSON.stringify(verticalOrder(buildTree([1])))); // [[1]]
```

## 🔗 Related Problems

| Problem                                                                                                              | Relationship                                 |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [Vertical Order Traversal of a Binary Tree](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree) | Harder version: same col+row → sort by value |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal)                 | BFS with level grouping                      |
| [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view)                             | BFS with row tracking                        |
