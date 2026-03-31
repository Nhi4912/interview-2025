---
layout: page
title: "Binary Search Tree to Greater Sum Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-search-tree-to-greater-sum-tree"
---

# Binary Search Tree to Greater Sum Tree / Chuyển BST Thành Cây Tổng Lớn Hơn

> **Difficulty**: 🟡 Medium | **Category**: Tree-Graph | **Pattern**: Reverse In-order DFS

## 🧠 Intuition / Tư Duy

**Như tích lũy điểm từ cao xuống thấp trong một bảng xếp hạng** — mỗi người nhận thêm điểm của tất cả người xếp hạng cao hơn mình. Trong BST, "lớn hơn" có nghĩa là nút bên phải → duyệt ngược in-order (phải → gốc → trái).

**Pattern Recognition:**

- BST + "tổng tất cả node lớn hơn" → Reverse in-order traversal (Right→Root→Left)
- Duy trì biến `runningSum` tích lũy từ node lớn nhất xuống
- Thay đổi từng node tại chỗ → không cần bộ nhớ phụ

**Visual:**

```
BST:       4              After (reverse in-order sum):
          / \              runningSum: 0→7→11→15→19→24→30→36
         1   6     →            30
        / \ / \               /    \
       0  2 5  7             36    21
            \                / \  / \
             3              36 35 26 15
running: 7+6=13→13+5=18... each node val += all greater
```

## Problem Description

Given the root of a Binary Search Tree, convert it to a Greater Sum Tree where each node's value is replaced by the sum of all values **greater than or equal to** the node's original value in the BST.

**Example:** BST `[4,1,6,0,2,5,7,null,null,null,3]` → `[30,36,21,36,35,26,15,null,null,null,33]`

**Constraints:** 1 ≤ n ≤ 100, 0 ≤ node.val ≤ 100, all values unique

## 📝 Interview Tips

1. **Clarify**: Greater Sum Tree = node value becomes sum of all nodes ≥ original value.
2. **Approach**: Reverse in-order (right→root→left) with a running total accumulator.
3. **Edge cases**: Single node → value unchanged (sum of itself). All same values? Problem guarantees unique.
4. **Optimize**: O(n) single pass, O(h) space for call stack. Can also do iterative with explicit stack.
5. **Follow-up**: Same problem for a sorted array? Just prefix sum from right end.
6. **Complexity**: O(n) time, O(h) space where h is tree height.

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

// Solution 1: Recursive reverse in-order with closure
// Time: O(n) | Space: O(h)
function bstToGst(root: TreeNode | null): TreeNode | null {
  let runningSum = 0;

  function reverseInOrder(node: TreeNode | null): void {
    if (!node) return;
    reverseInOrder(node.right); // Visit larger values first
    runningSum += node.val; // Accumulate
    node.val = runningSum; // Update node
    reverseInOrder(node.left); // Visit smaller values
  }

  reverseInOrder(root);
  return root;
}

// Solution 2: Iterative with explicit stack
// Time: O(n) | Space: O(h)
function bstToGst2(root: TreeNode | null): TreeNode | null {
  const stack: TreeNode[] = [];
  let current: TreeNode | null = root;
  let runningSum = 0;

  while (current !== null || stack.length > 0) {
    // Go to rightmost node first
    while (current !== null) {
      stack.push(current);
      current = current.right;
    }
    current = stack.pop()!;
    runningSum += current.val;
    current.val = runningSum;
    current = current.left; // Move to left subtree (smaller values)
  }

  return root;
}

// Solution 3: Morris traversal (O(1) space)
// Time: O(n) | Space: O(1)
function bstToGst3(root: TreeNode | null): TreeNode | null {
  let current: TreeNode | null = root;
  let runningSum = 0;

  while (current !== null) {
    if (current.right === null) {
      runningSum += current.val;
      current.val = runningSum;
      current = current.left;
    } else {
      // Find inorder successor (leftmost of right subtree)
      let successor = current.right;
      while (successor.left !== null && successor.left !== current) {
        successor = successor.left;
      }
      if (successor.left === null) {
        successor.left = current; // Create thread
        current = current.right;
      } else {
        successor.left = null; // Remove thread
        runningSum += current.val;
        current.val = runningSum;
        current = current.left;
      }
    }
  }
  return root;
}

// Helper
function buildBST(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0] as number);
  const queue = [root];
  let i = 1;
  while (i < vals.length) {
    const node = queue.shift()!;
    if (i < vals.length && vals[i] !== null) {
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

function treeToArray(root: TreeNode | null): (number | null)[] {
  if (!root) return [];
  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length) {
    const node = queue.shift()!;
    if (!node) {
      result.push(null);
      continue;
    }
    result.push(node.val);
    queue.push(node.left);
    queue.push(node.right);
  }
  while (result[result.length - 1] === null) result.pop();
  return result;
}

// Tests
const t1 = buildBST([4, 1, 6, 0, 2, 5, 7, null, null, null, 3]);
console.log(treeToArray(bstToGst(t1))); // [30,36,21,36,35,26,15,...,33]

const t2 = buildBST([0, null, 1]);
console.log(treeToArray(bstToGst2(t2))); // [1,null,1]

const t3 = buildBST([1]);
console.log(treeToArray(bstToGst3(t3))); // [1]
```

## 🔗 Related Problems

| Problem                                                                                     | Relationship               |
| ------------------------------------------------------------------------------------------- | -------------------------- |
| [Convert BST to Greater Tree](https://leetcode.com/problems/convert-bst-to-greater-tree/)   | Identical problem (538)    |
| [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)   | BST property understanding |
| [Increasing Order Search Tree](https://leetcode.com/problems/increasing-order-search-tree/) | In-order traversal of BST  |
