---
layout: page
title: "Step-By-Step Directions From a Binary Tree Node to Another"
difficulty: Medium
category: Tree-Graph
tags: [String, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another"
---

# Step-By-Step Directions From a Binary Tree Node to Another / Hướng Dẫn Từng Bước Trong Cây Nhị Phân

> **Difficulty**: 🟡 Medium | **Category**: Tree-Graph | **Pattern**: LCA + Path Finding

## 🧠 Intuition / Tư Duy

**Như hỏi đường trong một tòa nhà** — bạn không thể đi thẳng từ phòng A sang phòng B mà phải lên tầng chung (cha chung) rồi xuống đến phòng B. Số tầng lên = độ sâu từ LCA đến A, đường xuống = path từ LCA đến B.

**Pattern Recognition:**

- Tìm đường từ node này sang node kia trong cây → LCA (Lowest Common Ancestor)
- Từ start đến LCA: toàn "U" (up), từ LCA đến end: path thực tế
- Tìm path từ root → node bằng DFS, ghép lại qua LCA

**Visual:**

```
        5
       / \
      1   2
     / \ / \
    3  4 6  7
start=3, end=6
root→3: "LL", root→6: "RL"
LCA=5 (root), path = "UU" + "RL" = "UURL"
```

## Problem Description

Given the root of a binary tree and two node values `startValue` and `destValue`, return the shortest path directions as a string of `'L'`, `'R'`, `'U'`. `'U'` means move to parent, `'L'`/`'R'` means move to left/right child.

**Example:** Tree `[5,1,2,3,4,6,7]`, start=3, dest=6 → `"UURL"`

**Constraints:** 2 ≤ n ≤ 10^5, all values unique, start ≠ dest

## 📝 Interview Tips

1. **Clarify**: Are all node values unique? Yes. Can start/dest be root? Yes.
2. **Approach**: Find path from root to start and root to dest via DFS, strip common prefix (that's the LCA path), replace start path with 'U's.
3. **Edge cases**: Start is LCA (only go down). Dest is LCA (only go up). Direct parent-child.
4. **Optimize**: One DFS to find both paths simultaneously; avoid recomputing.
5. **Follow-up**: What if tree is a graph (has cycles)? Use standard BFS.
6. **Complexity**: O(n) time, O(n) space for path storage.

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// Solution 1: Find root→start and root→dest paths, strip LCA prefix
// Time: O(n) | Space: O(n)
function getDirections(root: TreeNode | null, startValue: number, destValue: number): string {
  function findPath(node: TreeNode | null, target: number, path: string[]): boolean {
    if (!node) return false;
    if (node.val === target) return true;
    path.push("L");
    if (findPath(node.left, target, path)) return true;
    path.pop();
    path.push("R");
    if (findPath(node.right, target, path)) return true;
    path.pop();
    return false;
  }

  const pathToStart: string[] = [];
  const pathToDest: string[] = [];
  findPath(root, startValue, pathToStart);
  findPath(root, destValue, pathToDest);

  // Strip common prefix (path through LCA)
  let i = 0;
  while (i < pathToStart.length && i < pathToDest.length && pathToStart[i] === pathToDest[i]) {
    i++;
  }

  // From start: go up for each remaining step
  const ups = "U".repeat(pathToStart.length - i);
  const downs = pathToDest.slice(i).join("");
  return ups + downs;
}

// Solution 2: Single DFS finding both paths simultaneously
// Time: O(n) | Space: O(n)
function getDirections2(root: TreeNode | null, startValue: number, destValue: number): string {
  let startPath = "";
  let destPath = "";

  function dfs(node: TreeNode | null, path: string): void {
    if (!node) return;
    if (node.val === startValue) startPath = path;
    if (node.val === destValue) destPath = path;
    dfs(node.left, path + "L");
    dfs(node.right, path + "R");
  }

  dfs(root, "");

  // Strip common prefix (LCA)
  let i = 0;
  while (i < startPath.length && i < destPath.length && startPath[i] === destPath[i]) i++;

  const ups = "U".repeat(startPath.length - i);
  const downs = destPath.slice(i);
  return ups + downs;
}

// Helper to build tree
function buildTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0] as number);
  const queue = [root];
  let i = 1;
  while (i < vals.length) {
    const node = queue.shift()!;
    if (vals[i] !== null) {
      node.left = new TreeNode(vals[i] as number);
      queue.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = new TreeNode(vals[i] as number);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// Tests
const t1 = buildTree([5, 1, 2, 3, 4, 6, 7]);
console.log(getDirections(t1, 3, 6)); // "UURL"
console.log(getDirections2(t1, 3, 6)); // "UURL"

const t2 = buildTree([2, 1]);
console.log(getDirections(t2, 2, 1)); // "L"

const t3 = buildTree([1, 2, 3, 4, null, null, null]);
console.log(getDirections(t3, 4, 3)); // "UUR"
```

## 🔗 Related Problems

| Problem                                                                                                           | Relationship                  |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) | Core subroutine — finding LCA |
| [Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths/)                                             | Finding root-to-leaf paths    |
| [Path Sum II](https://leetcode.com/problems/path-sum-ii/)                                                         | DFS path enumeration pattern  |
