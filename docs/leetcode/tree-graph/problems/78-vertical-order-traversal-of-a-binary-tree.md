---
layout: page
title: "Vertical Order Traversal of a Binary Tree"
difficulty: Hard
category: Tree-Graph
tags: [Hash Table, Tree, Depth-First Search, Breadth-First Search, Sorting]
leetcode_url: "https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree"
---

# Vertical Order Traversal of a Binary Tree / Duyệt Cây Nhị Phân Theo Thứ Tự Dọc

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DFS + Sorting
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Binary Tree Vertical Order Traversal](https://leetcode.com/problems/binary-tree-vertical-order-traversal) | [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chụp ảnh cây từ trên xuống bằng lưới ô vuông — mỗi cột dọc chứa các nodes cùng tọa độ x. Nếu hai node cùng (col, row) thì sắp xếp theo giá trị.

**Pattern Recognition:**

- Signal: "vertical columns" + "sorted nodes at same position" → **DFS gán tọa độ (col, row) + sort**
- Thu thập tất cả (col, row, val) bằng DFS, sau đó sort và nhóm theo col
- Key insight: con trái → col-1, con phải → col+1; row tăng dần xuống

**Visual — Vertical Order Traversal:**

```
        3          col: -1  0  1
       / \         row:
      9  20              row0: [3]
         / \             row1: [9, 20]
        15   7           row2: [15, 7]

(col=-1,row=1,9), (col=0,row=0,3), (col=0,row=2,15)
(col=1,row=1,20), (col=2,row=2,7)
Result: [[9],[3,15],[20],[7]]
```

---

## Problem Description

Given the root of a binary tree, return the vertical order traversal of its nodes' values. ([LeetCode #987](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree))

For each node at position `(row, col)`, its left child is at `(row+1, col-1)` and right child at `(row+1, col+1)`. Multiple nodes at same `(row, col)` are sorted by value. Columns are returned left to right.

**Example 1:** `root = [3,9,20,null,null,15,7]` → `[[9],[3,15],[20],[7]]`
**Example 2:** `root = [1,2,3,4,5,6,7]` → `[[4],[2],[1,5,6],[3],[7]]`

---

## 📝 Interview Tips

1. **Clarify**: "Node có thể có giá trị trùng không? Cây có thể lệch hoàn toàn không?" / Can values duplicate? Can tree be fully skewed?
2. **Brute force**: "DFS thu thập (col, row, val) → sort toàn bộ → nhóm theo col" / Collect all coords, sort, group
3. **Optimize**: "Dùng Map<col, entries[]> để nhóm nhanh hơn" / Use Map keyed by column
4. **Edge cases**: "Cây chỉ có root, cây lệch trái/phải hoàn toàn" / Single node, fully skewed tree
5. **Complexity**: "O(N log N) vì sort; O(N) space" / Sorting dominates time
6. **Follow-up**: "Nếu cây rất sâu (skewed), stack overflow với recursion?" / Consider iterative DFS for deep trees

---

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

/**
 * Solution 1: DFS + Global Sort
 * Time: O(N log N) — sorting all nodes
 * Space: O(N) — storing all (col, row, val) tuples
 */
function verticalTraversalDFS(root: TreeNode | null): number[][] {
  const entries: [number, number, number][] = []; // [col, row, val]

  function dfs(node: TreeNode | null, col: number, row: number): void {
    if (!node) return;
    entries.push([col, row, node.val]);
    dfs(node.left, col - 1, row + 1);
    dfs(node.right, col + 1, row + 1);
  }

  dfs(root, 0, 0);
  entries.sort(([c1, r1, v1], [c2, r2, v2]) =>
    c1 !== c2 ? c1 - c2 : r1 !== r2 ? r1 - r2 : v1 - v2,
  );

  const result: number[][] = [];
  let prevCol = Infinity;
  for (const [col, , val] of entries) {
    if (col !== prevCol) {
      result.push([]);
      prevCol = col;
    }
    result[result.length - 1].push(val);
  }
  return result;
}

/**
 * Solution 2: DFS + Map grouping (cleaner)
 * Time: O(N log N) — sorting per column
 * Space: O(N)
 */
function verticalTraversal(root: TreeNode | null): number[][] {
  const colMap = new Map<number, [number, number][]>(); // col → [row, val][]

  function dfs(node: TreeNode | null, col: number, row: number): void {
    if (!node) return;
    if (!colMap.has(col)) colMap.set(col, []);
    colMap.get(col)!.push([row, node.val]);
    dfs(node.left, col - 1, row + 1);
    dfs(node.right, col + 1, row + 1);
  }

  dfs(root, 0, 0);

  return [...colMap.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, entries]) =>
      entries.sort(([r1, v1], [r2, v2]) => (r1 !== r2 ? r1 - r2 : v1 - v2)).map(([, v]) => v),
    );
}

// === Test Cases ===
const t1 = new TreeNode(3);
t1.left = new TreeNode(9);
t1.right = new TreeNode(20);
t1.right.left = new TreeNode(15);
t1.right.right = new TreeNode(7);
console.log(JSON.stringify(verticalTraversal(t1))); // [[9],[3,15],[20],[7]]
console.log(JSON.stringify(verticalTraversalDFS(t1))); // [[9],[3,15],[20],[7]]
console.log(JSON.stringify(verticalTraversal(null))); // []
```

---

## 🔗 Related Problems

| Problem                                                                                                    | Difficulty | Pattern               |
| ---------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| [Binary Tree Vertical Order Traversal](https://leetcode.com/problems/binary-tree-vertical-order-traversal) | 🟡 Medium  | BFS + column grouping |
| [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree)   | 🟡 Medium  | DFS + graph           |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal)       | 🟡 Medium  | BFS                   |
| [Find Leaves of Binary Tree](https://leetcode.com/problems/find-leaves-of-binary-tree)                     | 🟡 Medium  | DFS + depth grouping  |
