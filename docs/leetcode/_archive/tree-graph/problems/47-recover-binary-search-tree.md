---
layout: page
title: "Recover Binary Search Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/recover-binary-search-tree"
---

# Recover Binary Search Tree / Khôi Phục Cây Tìm Kiếm Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Inorder DFS + Find Violations
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree) | [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst)

---

## 🧠 Intuition / Tư Duy

**Analogy:** BST inorder traversal cho dãy tăng dần. Khi 2 node bị hoán đổi, dãy này có 1 hoặc 2 "violation" (chỗ prev > curr). Tìm chúng rồi swap lại — như tìm 2 con bài lộn chỗ trong bộ bài đã sắp xếp.

**Pattern Recognition:**

- Signal: "exactly two nodes swapped in BST" → **Inorder + find violations**
- Adjacent swap: 1 violation → swap prev và curr
- Non-adjacent swap: 2 violations → swap first violation's prev và last violation's curr

**Visual — Tìm violations trong inorder:**

```
BST với 3 và 7 bị hoán đổi:
      3(7)
     /    \
  1(1)    7(3)   ← 7 and 3 swapped

Inorder: [1, 7, 3]  ← dãy đúng phải là [1, 3, 7]
              ^  ^
         prev=7 > curr=3 → violation!

first  = node(7)  (prev at violation)
second = node(3)  (curr at violation)
→ swap values: 7↔3 → BST recovered ✅
```

---

## Problem Description

Cho một BST trong đó đúng **2 node** bị hoán đổi giá trị nhầm. Khôi phục cây về BST đúng mà không thay đổi cấu trúc cây. ([LeetCode](https://leetcode.com/problems/recover-binary-search-tree))

**Example 1:** root = [1,3,null,null,2] → recovered = [3,1,null,null,2]

**Example 2:** root = [3,1,4,null,null,2] → recovered = [2,1,4,null,null,3]

Constraints: `2 <= n <= 1000`, `-2^31 <= val <= 2^31-1`, exactly two nodes swapped

---

## 📝 Interview Tips

1. **Clarify**: "Chỉ swap values không, không đổi cấu trúc?" / Only swap values, not restructure the tree?
2. **Key insight**: "Inorder BST = sorted. Tìm chỗ không sorted" / Inorder of valid BST is always sorted
3. **Two cases**: "Nếu adjacent: 1 violation; nếu non-adjacent: 2 violations" / One or two violations depending on distance
4. **Morris traversal**: "O(1) space với Morris inorder — follow-up" / O(1) space with Morris traversal
5. **Edge cases**: "Cây chỉ 2 nodes, swap của root với leaf" / Two-node tree, root swapped with distant leaf
6. **Follow-up**: "Làm với O(1) space?" / Can you do O(1) space? → Morris inorder traversal

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
 * Solution 1: Inorder to array, find and swap
 * Time: O(n) — traverse all nodes
 * Space: O(n) — store inorder array + node references
 */
function recoverTreeNaive(root: TreeNode | null): void {
  const nodes: TreeNode[] = [];
  function inorder(node: TreeNode | null): void {
    if (!node) return;
    inorder(node.left);
    nodes.push(node);
    inorder(node.right);
  }
  inorder(root);
  // Find the two nodes: find from left and right
  let first = -1,
    second = -1;
  for (let i = 0; i < nodes.length - 1; i++)
    if (nodes[i].val > nodes[i + 1].val) {
      if (first === -1) first = i;
      second = i + 1;
    }
  if (first !== -1) {
    const tmp = nodes[first].val;
    nodes[first].val = nodes[second].val;
    nodes[second].val = tmp;
  }
}

/**
 * Solution 2: Inorder DFS tracking prev, first, second pointers
 * Time: O(n) — single inorder traversal
 * Space: O(h) — recursion stack
 */
function recoverTree(root: TreeNode | null): void {
  let prev: TreeNode | null = null;
  let first: TreeNode | null = null; // first violation's prev
  let second: TreeNode | null = null; // most recent violation's curr

  function inorder(node: TreeNode | null): void {
    if (!node) return;
    inorder(node.left);
    // Check violation
    if (prev !== null && prev.val > node.val) {
      if (!first) first = prev; // first time: save prev
      second = node; // always update second to current
    }
    prev = node;
    inorder(node.right);
  }

  inorder(root);
  // Swap values of the two misplaced nodes
  if (first && second) {
    const tmp = first.val;
    first.val = second.val;
    second.val = tmp;
  }
}

// === Test Cases ===
function inorderVals(root: TreeNode | null): number[] {
  const res: number[] = [];
  function dfs(n: TreeNode | null) {
    if (!n) return;
    dfs(n.left);
    res.push(n.val);
    dfs(n.right);
  }
  dfs(root);
  return res;
}
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

const t1 = build([1, 3, null, null, 2]);
recoverTree(t1);
console.log(inorderVals(t1)); // [1, 2, 3]

const t2 = build([3, 1, 4, null, null, 2]);
recoverTree(t2);
console.log(inorderVals(t2)); // [1, 2, 3, 4]

const t3 = build([2, 3, 1]);
recoverTree(t3);
console.log(inorderVals(t3)); // [1, 2, 3]

const t4 = build([5, 3, 8, 2, 4, 6, 9, 1, null, null, null, null, 7]);
recoverTree(t4);
console.log(inorderVals(t4).join(",")); // 1,2,3,4,5,6,7,8,9
```

---

## 🔗 Related Problems

- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree) — cùng inorder property của BST
- [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst) — inorder traversal để access sorted order
- [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator) — inorder BST traversal với next/hasNext
- [Convert BST to Greater Tree](https://leetcode.com/problems/convert-bst-to-greater-tree) — reverse inorder BST traversal
