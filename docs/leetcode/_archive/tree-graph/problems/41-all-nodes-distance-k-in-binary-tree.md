---
layout: page
title: "All Nodes Distance K in Binary Tree"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree"
---

# All Nodes Distance K in Binary Tree / Tất Cả Các Nút Cách K Trong Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS + Parent Map
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Amount of Time for Binary Tree to Be Infected](https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected) | [Vertical Order Traversal of a Binary Tree](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống lan truyền dịch bệnh trong khu phố — từ một ngôi nhà (target), bệnh lan ra tất cả nhà hàng xóm (trái, phải, và nhà bố mẹ). Sau k ngày, tất cả nhà bị nhiễm ở đúng khoảng cách k. Khó khăn: trong cây nhị phân, bạn chỉ đi được xuống (con), không đi được lên (cha) — nên cần build "parent pointer" trước.

**Pattern Recognition:**

- Signal: "khoảng cách k trong cây" + "cần đi cả lên lẫn xuống" → **BFS sau khi build parent map**
- Step 1: DFS để ghi nhớ parent của mỗi node
- Step 2: BFS từ target, treat tree như undirected graph (left, right, parent đều là neighbors)
- Key insight: sau khi có parent map, tree trở thành graph vô hướng → BFS chuẩn

**Visual — tree = [3,5,1,6,2,0,8], target=5, k=2:**

```
         3
        / \
       5   1
      / \ / \
     6  2 0  8
       / \
      7   4

Target = 5, k = 2
BFS from 5:
  dist=0: {5}
  dist=1: {6, 2, 3}     ← 6(left), 2(right), 3(parent)
  dist=2: {7, 4, 1}     ← 7,4(children of 2), 1(child of 3)
                          6 has no children, 3's parent=null

Result: [7, 4, 1] ✅
```

---

## Problem Description

Given the `root` of a binary tree, a `target` node, and an integer `k`, return **all nodes at distance k** from the target node. The answer can be in any order.

**Example 1:**

```
Input:  root=[3,5,1,6,2,0,8,null,null,7,4], target=5, k=2
Output: [7,4,1]
Explanation: Nodes at dist 2 from node 5: 7 and 4 (via node 2), and 1 (via node 3).
```

**Example 2:**

```
Input:  root=[1], target=1, k=3
Output: []
```

**Constraints:** `1 ≤ tree nodes ≤ 500`, `0 ≤ node.val ≤ 500`, all node values are unique, `0 ≤ k ≤ 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Tất cả node values unique không? → có thể dùng val làm key cho Map" / Unique values → use val as Map key safely
2. **Key observation**: "BFS cần đi ngược lên cây → cần parent pointers" / Need parent pointers to traverse upward
3. **DFS first**: "DFS/preorder để build parent map trước, sau đó BFS từ target" / DFS to build parents, then BFS from target
4. **Visited set**: "Cần visited set để không quay lại node đã thăm (nhất là node cha)" / Track visited to avoid revisiting parent
5. **Edge case**: "k=0 → trả về [target.val]; target là root → không có parent" / k=0 returns just target; root has no parent
6. **Follow-up**: "Nếu thêm node / xóa node dynamically?" / For dynamic trees, maintain parent map incrementally

---

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

/**
 * Solution 1: DFS Recursive (no parent map)
 * Time: O(n) — DFS through tree
 * Space: O(n) — recursion stack
 *
 * distDown(node, dist): collect nodes dist steps below node
 * distUp(node, target, k): find target, collect nodes from ancestors
 */
function distanceKDFS(root: TreeNode | null, target: TreeNode | null, k: number): number[] {
  const result: number[] = [];

  function distDown(node: TreeNode | null, dist: number): void {
    if (!node) return;
    if (dist === 0) {
      result.push(node.val);
      return;
    }
    distDown(node.left, dist - 1);
    distDown(node.right, dist - 1);
  }

  // Returns distance from current node to target (-1 if not found)
  function dfs(node: TreeNode | null): number {
    if (!node) return -1;
    if (node === target) {
      distDown(node, k);
      return 0;
    }
    const leftDist = dfs(node.left);
    if (leftDist >= 0) {
      distDown(node.right, k - leftDist - 2); // from right subtree
      if (k - leftDist - 1 === 0) result.push(node.val);
      return leftDist + 1;
    }
    const rightDist = dfs(node.right);
    if (rightDist >= 0) {
      distDown(node.left, k - rightDist - 2); // from left subtree
      if (k - rightDist - 1 === 0) result.push(node.val);
      return rightDist + 1;
    }
    return -1;
  }

  dfs(root);
  return result;
}

/**
 * Solution 2: Parent Map + BFS (Cleaner and More Intuitive)
 * Time: O(n) — DFS O(n) to build parents + BFS O(n) at most
 * Space: O(n) — parent map + BFS queue
 *
 * Algorithm:
 * 1. DFS to record each node's parent
 * 2. BFS from target treating tree as undirected graph
 * 3. Stop after k levels — collect all nodes at that level
 */
function distanceK(root: TreeNode | null, target: TreeNode | null, k: number): number[] {
  if (!root || !target) return [];

  // Step 1: Build parent map via DFS
  const parent = new Map<number, TreeNode | null>();
  function buildParents(node: TreeNode | null, par: TreeNode | null): void {
    if (!node) return;
    parent.set(node.val, par);
    buildParents(node.left, node);
    buildParents(node.right, node);
  }
  buildParents(root, null);

  // Step 2: BFS from target (undirected — left, right, parent)
  const visited = new Set<number>([target.val]);
  let queue: TreeNode[] = [target];
  let dist = 0;

  while (queue.length > 0) {
    if (dist === k) return queue.map((n) => n.val);
    const next: TreeNode[] = [];
    for (const node of queue) {
      const neighbors = [node.left, node.right, parent.get(node.val) ?? null];
      for (const nb of neighbors) {
        if (nb && !visited.has(nb.val)) {
          visited.add(nb.val);
          next.push(nb);
        }
      }
    }
    queue = next;
    dist++;
  }
  return [];
}

// === Test Cases ===
// Build tree [3,5,1,6,2,0,8,null,null,7,4]
const n7 = new TreeNode(7),
  n4 = new TreeNode(4);
const n2 = new TreeNode(2, n7, n4);
const n6 = new TreeNode(6),
  n0 = new TreeNode(0),
  n8 = new TreeNode(8);
const n5 = new TreeNode(5, n6, n2);
const n1 = new TreeNode(1, n0, n8);
const root = new TreeNode(3, n5, n1);

console.log(distanceK(root, n5, 2).sort((a, b) => a - b)); // [1,4,7]
console.log(distanceK(root, n5, 0)); // [5]
console.log(distanceK(new TreeNode(1), new TreeNode(1), 3)); // []
```

---

## 🔗 Related Problems

| Problem                                                                                                                      | Pattern              | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------- |
| [Amount of Time for Binary Tree to Be Infected](https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected) | BFS + Parent Map     | Medium     |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal)                         | BFS                  | Medium     |
| [Path Sum III](https://leetcode.com/problems/path-sum-iii)                                                                   | DFS + Prefix Sum     | Medium     |
| [Cousins in Binary Tree](https://leetcode.com/problems/cousins-in-binary-tree)                                               | BFS / DFS            | Easy       |
| [Vertical Order Traversal of a Binary Tree](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree)         | BFS with Coordinates | Hard       |
