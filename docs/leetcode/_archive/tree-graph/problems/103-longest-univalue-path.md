---
layout: page
title: "Longest Univalue Path"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/longest-univalue-path"
---

# Longest Univalue Path / Đường Dài Nhất Có Cùng Giá Trị

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Như đếm chuỗi bạch tuộc liên tiếp trong hàng — bạn đếm từng nhánh, nhánh nào màu giống nhau thì cộng chiều dài. Mỗi node là giao điểm — nó có thể là điểm "kết nối" trái+phải (cập nhật global max) hoặc chỉ trả về arm dài nhất về cho cha.

**Pattern Recognition:**

- "Longest path in tree" → post-order DFS (left, right, then current)
- Each DFS call returns: max single-arm length upward to parent
- At each node: update global max with left_arm + right_arm

**Visual:**

```
        5
       / \
      4   5
     / \   \
    1   1   5

DFS at leaf 1 (left-left): return 0 (no children)
DFS at leaf 1 (left-right): return 0
DFS at node 4: left_arm=0(val≠4), right_arm=0(val≠4) → max stays 0, return 0
DFS at leaf 5 (right-right): return 0
DFS at node 5(right): right child val=5 matches! arm=0+1=1 → return 1
DFS at root 5: left_arm=0(val4≠5), right_arm=1(val5=5) → max=1, return 1
Answer: 2  (path: 5→5→5 on right side)

Wait, correct tree:
        5
       / \
      4   5
     / \   \
    4   4   5

DFS node 4(left-left): return 0; DFS node 4(left-right): return 0
DFS node 4: both arms are 4=4 → left+right arm = 1+1=2 → max=2, return 1
DFS node 5(right-right): return 0
DFS node 5(right): right=5=5 → arm=1, max=max(2,1)=2, return 1
DFS root 5: right=1 → return 1. Final max = 2 ✅
```

## Problem Description

Given the root of a binary tree, return the length of the longest path where each pair of adjacent nodes in the path has the same node value. The path does **not** need to pass through the root, and length is measured in edges (not nodes).

**Example 1:** Tree `[5,4,5,1,1,null,5]` → `2`
**Example 2:** Tree `[1,4,5,4,4,null,5]` → `2`

**Constraints:** Number of nodes `[0, 10^4]`, `-1000 <= Node.val <= 1000`, tree depth won't exceed `1000`.

## 📝 Interview Tips

1. **Clarify**: Length = edges (not nodes). Path can go left-child + right-child through a node / Path length = edges, not nodes.
2. **Approach**: Post-order DFS — process children first, return "arm length" to parent / Post-order: bottom-up propagation.
3. **Edge cases**: Null root → 0; single node → 0; all same values → n-1 / Null tree or single node.
4. **Optimize**: One DFS pass O(n) — standard DFS tree traversal / Single O(n) pass is optimal.
5. **Test**: Try a path that goes through multiple nodes of same value on both sides / Test pass-through at root case.
6. **Follow-up**: What if we want longest path of any values (diameter)? → Same approach, remove value check / Binary Tree Diameter variant.

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

/** Solution 1: DFS post-order with global max
 * Time: O(n) | Space: O(h) where h = tree height
 */
function longestUnivaluePath(root: TreeNode | null): number {
  let maxLen = 0;

  function dfs(node: TreeNode | null, parentVal: number): number {
    if (!node) return 0;
    const leftArm = dfs(node.left, node.val);
    const rightArm = dfs(node.right, node.val);
    // Update global: path can go left-through-node-right
    maxLen = Math.max(maxLen, leftArm + rightArm);
    // Return single arm to parent (only if matching)
    return node.val === parentVal ? Math.max(leftArm, rightArm) + 1 : 0;
  }

  dfs(root, root?.val ?? 0);
  return maxLen;
}

/** Solution 2: DFS returning arm length, cleaner API
 * Time: O(n) | Space: O(h)
 */
function longestUnivaluePath2(root: TreeNode | null): number {
  let result = 0;

  function helper(node: TreeNode | null): number {
    if (!node) return 0;
    let left = helper(node.left);
    let right = helper(node.right);
    // Keep arm only if child has same value
    if (node.left?.val !== node.val) left = 0;
    if (node.right?.val !== node.val) right = 0;
    result = Math.max(result, left + right);
    return Math.max(left, right) + 1;
  }

  helper(root);
  return result;
}

// Helper to build tree from array
function buildTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] == null) return null;
  const root = new TreeNode(vals[0]);
  const queue = [root];
  let i = 1;
  while (queue.length && i < vals.length) {
    const node = queue.shift()!;
    if (vals[i] != null) {
      node.left = new TreeNode(vals[i]!);
      queue.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] != null) {
      node.right = new TreeNode(vals[i]!);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// Test cases
console.log(longestUnivaluePath(buildTree([5, 4, 5, 1, 1, null, 5]))); // 2
console.log(longestUnivaluePath(buildTree([1, 4, 5, 4, 4, null, 5]))); // 2
console.log(longestUnivaluePath(null)); // 0

console.log(longestUnivaluePath2(buildTree([5, 4, 5, 1, 1, null, 5]))); // 2
console.log(longestUnivaluePath2(buildTree([1, 4, 5, 4, 4, null, 5]))); // 2
```

## 🔗 Related Problems

| Problem                                                                                                                          | Relationship                                                 |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Binary Tree Diameter](https://leetcode.com/problems/diameter-of-binary-tree)                                                    | Same pattern — longest path in tree without value constraint |
| [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters) | Same DFS arm technique on N-ary tree                         |
| [Path Sum III](https://leetcode.com/problems/path-sum-iii)                                                                       | Tree path problems — DFS with running state                  |
