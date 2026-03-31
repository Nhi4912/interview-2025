---
layout: page
title: "Maximum Difference Between Node and Ancestor"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/maximum-difference-between-node-and-ancestor"
---

# Maximum Difference Between Node and Ancestor / Hiệu Tuyệt Đối Lớn Nhất Giữa Nút Và Tổ Tiên

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như ghi nhiệt độ trên đường leo núi — bạn chỉ cần ghi nhớ nhiệt độ cao nhất và thấp nhất từ chân núi đến vị trí hiện tại. Chênh lệch lớn nhất tại mỗi điểm chính là max(|hiện tại - cao nhất|, |hiện tại - thấp nhất|).

**Pattern Recognition:**

- Signal: "ancestor-descendant difference" + "max" → **DFS passing min/max downward**
- Key insight: For any (ancestor, node) pair, the max difference = max(|node - min_ancestor|, |node - max_ancestor|)
- Pass `(currentMin, currentMax)` down the path from root — no need to store full path

**Visual:**

```
Tree: [8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13]

       8        min=8,  max=8
      / \
     3   10     min=3,  max=8 | min=8, max=10
    / \    \
   1   6   14   min=1,max=8→diff=7 | min=3,max=8→diff=5 | min=8,max=14→diff=6
      / \    \
     4   7   13  at node 4: |4-3|=1, |4-8|=4 → local diff=4
                 Best overall: |3-8|=5, |1-8|=7 ← ANSWER = 7
```

## Problem Description

Given the root of a binary tree, find the maximum value of `|node.val - ancestor.val|` over all pairs (ancestor, node) where ancestor is on the path from root to node. Return this maximum absolute difference.

Example 1: `root=[8,3,10,1,6,null,14,null,null,4,7,null,null,13]` → `7`
Example 2: `root=[1,null,2,null,0,3]` → `3`

## 📝 Interview Tips

1. **Clarify**: "Ancestor là bất kỳ node nào trên đường từ root đến node đó" / Any node on root-to-node path
2. **Key insight**: "Không cần lưu toàn bộ path — chỉ cần min và max trên path là đủ" / Track min+max only
3. **Why min+max**: "max_diff = max(|node-pathMin|, |node-pathMax|) — hai chiều lệch" / Both extremes matter
4. **Brute force**: "O(n²) — mỗi node so sánh với tất cả ancestors của nó" / Check each ancestor
5. **Edge cases**: "Tree chỉ có root → answer = 0 (không có cặp ancestor-descendant)" / Single node = 0
6. **Complexity**: "Time O(n) | Space O(h) for recursion stack"

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

/** Solution 1: Brute Force — for each node, walk up to all ancestors
 * Time: O(n²) | Space: O(n)
 */
function maxAncestorDiffBrute(root: TreeNode | null): number {
  if (!root) return 0;
  let result = 0;
  const ancestors: number[] = [];

  function dfs(node: TreeNode | null): void {
    if (!node) return;
    for (const anc of ancestors) {
      result = Math.max(result, Math.abs(node.val - anc));
    }
    ancestors.push(node.val);
    dfs(node.left);
    dfs(node.right);
    ancestors.pop();
  }

  dfs(root);
  return result;
}

/** Solution 2: DFS with min/max tracking — optimal
 * Time: O(n) | Space: O(h)
 */
function maxAncestorDiff(root: TreeNode | null): number {
  function dfs(node: TreeNode | null, minVal: number, maxVal: number): number {
    if (!node) return maxVal - minVal;
    const newMin = Math.min(minVal, node.val);
    const newMax = Math.max(maxVal, node.val);
    return Math.max(dfs(node.left, newMin, newMax), dfs(node.right, newMin, newMax));
  }
  return root ? dfs(root, root.val, root.val) : 0;
}

/** Solution 3: Iterative DFS with explicit stack
 * Time: O(n) | Space: O(h)
 */
function maxAncestorDiffIter(root: TreeNode | null): number {
  if (!root) return 0;
  let result = 0;
  // Stack stores [node, minOnPath, maxOnPath]
  const stack: [TreeNode, number, number][] = [[root, root.val, root.val]];

  while (stack.length > 0) {
    const [node, minVal, maxVal] = stack.pop()!;
    result = Math.max(result, maxVal - minVal);
    const newMin = Math.min(minVal, node.val);
    const newMax = Math.max(maxVal, node.val);
    if (node.left) stack.push([node.left, newMin, newMax]);
    if (node.right) stack.push([node.right, newMin, newMax]);
  }

  return result;
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
console.log(
  maxAncestorDiff(buildTree([8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13])),
); // 7
console.log(maxAncestorDiff(buildTree([1, null, 2, null, 0, 3]))); // 3
console.log(
  maxAncestorDiffBrute(buildTree([8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13])),
); // 7
console.log(maxAncestorDiffIter(buildTree([1, null, 2, null, 0, 3]))); // 3
console.log(maxAncestorDiff(buildTree([1]))); // 0
console.log(maxAncestorDiff(buildTree([2, 1]))); // 1
```

## 🔗 Related Problems

| Problem                                                                                                          | Relationship                    |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | DFS tracking path state         |
| [Path Sum](https://leetcode.com/problems/path-sum)                                                               | DFS with accumulated path value |
| [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum)                       | Max value across tree paths     |
