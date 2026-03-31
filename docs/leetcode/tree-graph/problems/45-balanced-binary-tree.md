---
layout: page
title: "Balanced Binary Tree"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/balanced-binary-tree"
---

# Balanced Binary Tree / Cây Nhị Phân Cân Bằng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS Post-order
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree) | [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Kiểm tra cân bằng như kiểm tra thăng bằng trên cân — bạn cần biết trọng lượng hai bên (chiều cao). Thay vì tính chiều cao riêng rồi so sánh (O(n²)), tính chiều cao VÀ kiểm tra cân bằng trong cùng 1 lần DFS.

**Pattern Recognition:**

- Signal: "check property for all nodes in tree" + "depends on subtree result" → **DFS post-order với sentinel**
- Brute: getHeight(node) gọi đệ quy nhiều lần → O(n log n)
- Optimal: trả -1 như sentinel "không cân bằng" → O(n) một lần duyệt

**Visual — Post-order DFS với sentinel:**

```
Tree:        [3, 9, 20, null, null, 15, 7]
      3
     / \
    9  20
       / \
      15   7

dfs(9)  → height=1 (leaf)
dfs(15) → height=1 (leaf)
dfs(7)  → height=1 (leaf)
dfs(20) → |1-1|=0 ≤ 1 → height=2
dfs(3)  → |1-2|=1 ≤ 1 → height=3 ✅ balanced

Unbalanced: dfs returns -1 → propagates up immediately
```

---

## Problem Description

Cho một cây nhị phân, xác định xem nó có **height-balanced** không — tức là với MỌI node, chiều cao của cây con trái và phải chênh lệch không quá 1. ([LeetCode](https://leetcode.com/problems/balanced-binary-tree))

**Example 1:** root = [3,9,20,null,null,15,7] → `true`

**Example 2:** root = [1,2,2,3,3,null,null,4,4] → `false` (node 2 có height(left)=2, height(right)=0)

Constraints: `0 <= n <= 5000`, `-10^4 <= val <= 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Height-balanced nghĩa là mỗi node, hay chỉ root?" / Height-balanced means EVERY node, not just root
2. **Brute force**: "Tính height từng node riêng → O(n log n)" → combine → O(n) / Separate height calls vs combined DFS
3. **Sentinel**: "Dùng -1 làm tín hiệu 'already unbalanced'" / Return -1 as sentinel to short-circuit early
4. **Post-order**: "Xử lý con trước cha — post-order" / Process children before parent = post-order traversal
5. **Edge cases**: "Cây rỗng là balanced; cây 1 node là balanced" / Empty tree and single node are balanced
6. **Follow-up**: "Làm sao chuyển unbalanced tree thành balanced?" / How to rebalance? → sorted inorder → BST construction

---

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

/**
 * Solution 1: Brute Force — compute height separately per node
 * Time: O(n log n) — O(n) per node, O(log n) levels
 * Space: O(h) — recursion stack
 */
function isBalancedBrute(root: TreeNode | null): boolean {
  function height(node: TreeNode | null): number {
    if (!node) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }
  if (!root) return true;
  const lh = height(root.left),
    rh = height(root.right);
  return Math.abs(lh - rh) <= 1 && isBalancedBrute(root.left) && isBalancedBrute(root.right);
}

/**
 * Solution 2: Optimal — DFS post-order with sentinel (-1 = unbalanced)
 * Time: O(n) — each node visited once
 * Space: O(h) — recursion stack, O(log n) balanced / O(n) worst
 */
function isBalanced(root: TreeNode | null): boolean {
  // Returns height if balanced, -1 if unbalanced
  function dfs(node: TreeNode | null): number {
    if (!node) return 0;
    const left = dfs(node.left);
    if (left === -1) return -1; // early exit
    const right = dfs(node.right);
    if (right === -1) return -1; // early exit
    if (Math.abs(left - right) > 1) return -1; // current node unbalanced
    return Math.max(left, right) + 1;
  }
  return dfs(root) !== -1;
}

// === Test Cases ===
function build(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] == null) return null;
  const root = new TreeNode(vals[0]!);
  const q = [root];
  let i = 1;
  while (i < vals.length) {
    const node = q.shift()!;
    if (i < vals.length && vals[i] != null) {
      node.left = new TreeNode(vals[i]!);
      q.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] != null) {
      node.right = new TreeNode(vals[i]!);
      q.push(node.right);
    }
    i++;
  }
  return root;
}

console.log(isBalanced(build([3, 9, 20, null, null, 15, 7]))); // true
console.log(isBalanced(build([1, 2, 2, 3, 3, null, null, 4, 4]))); // false
console.log(isBalanced(null)); // true (empty tree)
console.log(isBalanced(build([1, 2, null, 3, null, 4]))); // false (left-skewed)
```

---

## 🔗 Related Problems

- [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree) — sub-problem: compute height with DFS
- [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree) — cùng pattern post-order DFS với thông tin từ subtree
- [Minimum Depth of Binary Tree](https://leetcode.com/problems/minimum-depth-of-binary-tree) — BFS/DFS tìm min depth
- [Convert Sorted Array to Binary Search Tree](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree) — build balanced BST
