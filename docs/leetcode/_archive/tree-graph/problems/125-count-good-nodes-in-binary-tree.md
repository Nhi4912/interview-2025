---
layout: page
title: "Count Good Nodes in Binary Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/count-good-nodes-in-binary-tree"
---

# Count Good Nodes in Binary Tree / Đếm Nút Tốt Trong Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như leo núi và ghi nhận "đỉnh cá nhân" — bạn chỉ đánh dấu một điểm là "tốt" khi nó cao hơn hoặc bằng mọi điểm đã qua trên đường lên. Mỗi lần leo thêm một bậc, bạn cập nhật kỷ lục cao nhất đã thấy.

**Pattern Recognition:**

- Signal: "path from root" + "max so far" → **DFS tracking state along path**
- A node X is "good" if no ancestor has a value strictly greater than X
- Pass `maxOnPath` down the recursion; increment count when `node.val >= maxOnPath`

**Visual:**

```
Tree: [3, 1, 4, 3, null, 1, 5]

        3  ← good (no ancestors, max=3)
       / \
      1   4  ← 1 < 3 NOT good | 4 >= 3 GOOD (max=4)
     /   / \
    3   1   5  ← 3>=3 GOOD | 1<4 NOT | 5>=4 GOOD
   max=3  max=4

Good nodes: [3, 4, 3, 5] → count = 4
```

## Problem Description

Given the root of a binary tree, a node X is **good** if in the path from the root to X there are no nodes with values greater than X's value. Return the number of good nodes. The root is always good.

Example 1: `root=[3,1,4,3,null,1,5]` → `4`
Example 2: `root=[3,3,null,4,2]` → `3`
Example 3: `root=[1]` → `1`

## 📝 Interview Tips

1. **Clarify**: "Node tốt là node không có ancestor nào lớn hơn nó" / Good = no strictly-greater ancestor
2. **Approach**: "DFS truyền maxSoFar xuống — nếu node.val >= max thì đếm và cập nhật max" / Pass max down DFS
3. **Edge cases**: "Root luôn là good (không có ancestor)" / Root is always good
4. **BFS alt**: "BFS cũng được nhưng DFS tự nhiên hơn vì cần track path" / DFS more natural for path tracking
5. **Follow-up**: "Nếu cần tìm các good nodes thay vì đếm? → Thêm danh sách kết quả" / Collect nodes instead
6. **Complexity**: "Time O(n) | Space O(h) call stack, O(n) worst case skewed tree"

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

/** Solution 1: Recursive DFS — pass max value along path
 * Time: O(n) | Space: O(h)
 */
function goodNodes(root: TreeNode | null): number {
  function dfs(node: TreeNode | null, maxVal: number): number {
    if (!node) return 0;
    const isGood = node.val >= maxVal ? 1 : 0;
    const newMax = Math.max(maxVal, node.val);
    return isGood + dfs(node.left, newMax) + dfs(node.right, newMax);
  }
  return dfs(root, -Infinity);
}

/** Solution 2: Iterative DFS with explicit stack
 * Time: O(n) | Space: O(h)
 */
function goodNodesIterative(root: TreeNode | null): number {
  if (!root) return 0;
  let count = 0;
  // Stack stores [node, maxOnPathSoFar]
  const stack: [TreeNode, number][] = [[root, -Infinity]];

  while (stack.length > 0) {
    const [node, maxVal] = stack.pop()!;
    if (node.val >= maxVal) count++;
    const newMax = Math.max(maxVal, node.val);
    if (node.left) stack.push([node.left, newMax]);
    if (node.right) stack.push([node.right, newMax]);
  }

  return count;
}

/** Solution 3: BFS with queue — level-order with max tracking
 * Time: O(n) | Space: O(n)
 */
function goodNodesBFS(root: TreeNode | null): number {
  if (!root) return 0;
  let count = 0;
  const queue: [TreeNode, number][] = [[root, -Infinity]];

  while (queue.length > 0) {
    const [node, maxVal] = queue.shift()!;
    if (node.val >= maxVal) count++;
    const newMax = Math.max(maxVal, node.val);
    if (node.left) queue.push([node.left, newMax]);
    if (node.right) queue.push([node.right, newMax]);
  }

  return count;
}

// Helper to build tree from array
function buildTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0]!);
  const queue = [root];
  let i = 1;
  while (i < vals.length) {
    const node = queue.shift()!;
    if (vals[i] !== null) {
      node.left = new TreeNode(vals[i]!);
      queue.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = new TreeNode(vals[i]!);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// Tests
console.log(goodNodes(buildTree([3, 1, 4, 3, null, 1, 5]))); // 4
console.log(goodNodes(buildTree([3, 3, null, 4, 2]))); // 3
console.log(goodNodes(buildTree([1]))); // 1
console.log(goodNodesIterative(buildTree([3, 1, 4, 3, null, 1, 5]))); // 4
console.log(goodNodesBFS(buildTree([3, 3, null, 4, 2]))); // 3
console.log(goodNodes(buildTree([2, null, 4, 10, 8, null, null, 4]))); // 4
```

## 🔗 Related Problems

| Problem                                                                                    | Relationship                              |
| ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| [Path Sum](https://leetcode.com/problems/path-sum)                                         | DFS tracking accumulated value along path |
| [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum) | Max tracking in tree paths                |
| [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree)   | DFS with bounds propagation               |
