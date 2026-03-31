---
layout: page
title: "Closest Binary Search Tree Value II"
difficulty: Hard
category: Tree-Graph
tags: [Two Pointers, Stack, Tree, Depth-First Search, Binary Search Tree]
leetcode_url: "https://leetcode.com/problems/closest-binary-search-tree-value-ii"
---

# Closest Binary Search Tree Value II / K Giá Trị Gần Nhất Trong BST

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: In-order + Two Pointers
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như tìm k người sống gần nhất một địa chỉ trên con phố thẳng — BST in-order cho một dãy đã sắp xếp, rồi dùng hai con trỏ để thu hẹp cửa sổ k phần tử gần `target` nhất.

**Pattern Recognition:**

- Signal: "BST" + "k closest values" → **In-order traversal + sliding window**
- BST in-order = sorted array → k closest values form a contiguous window
- Two-pointer shrink: always remove the endpoint farther from target

**Visual:**

```
BST:      4
         / \
        2   5
       / \
      1   3

target=3.714286, k=2
In-order: [1, 2, 3, 4, 5]
Window:   L=0, R=4

|1-3.71|=2.71 > |5-3.71|=1.29 → move L → L=1
|2-3.71|=1.71 > |5-3.71|=1.29 → move L → L=2
|3-3.71|=0.71 < |5-3.71|=1.29 → move R → R=3
R-L+1 = 3-2+1 = 2 = k ✓
Result: [3, 4]
```

## Problem Description

Given the root of a BST, a `target` float, and integer `k`, return the `k` values in the BST closest to `target`. The answer may be in any order. Guaranteed: BST is valid, k ≤ total nodes.

Example 1: `root=[4,2,5,1,3], target=3.714286, k=2` → `[4,3]`
Example 2: `root=[1], target=0.000000, k=1` → `[1]`

## 📝 Interview Tips

1. **Clarify**: "k values có thể có nhiều cách nếu khoảng cách bằng nhau không?" / Are ties possible? Yes — any valid set ok
2. **Key insight**: "BST in-order = sorted list → window problem" / In-order gives sorted array
3. **Two-pointer**: "Dùng L/R thu nhỏ window: bỏ endpoint xa hơn target" / Shrink from farther end
4. **Optimal O(log n + k)**: "Dùng 2 stacks (predecessor/successor) cho constant-space amortized" / Stack approach
5. **Edge cases**: "k = n → trả về tất cả; tree chỉ có 1 node" / k equals total nodes
6. **Complexity**: "Approach 1: O(n) time O(n) space | Approach 2: O(log n + k) time O(log n) space"

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

/** Solution 1: In-order collect + two-pointer shrink
 * Time: O(n) | Space: O(n)
 */
function closestKValuesBrute(root: TreeNode | null, target: number, k: number): number[] {
  const sorted: number[] = [];
  function inOrder(node: TreeNode | null): void {
    if (!node) return;
    inOrder(node.left);
    sorted.push(node.val);
    inOrder(node.right);
  }
  inOrder(root);

  let left = 0,
    right = sorted.length - 1;
  while (right - left + 1 > k) {
    if (Math.abs(sorted[left] - target) <= Math.abs(sorted[right] - target)) {
      right--;
    } else {
      left++;
    }
  }
  return sorted.slice(left, right + 1);
}

/** Solution 2: Two-pointer on in-order array (same complexity, cleaner)
 * Time: O(n) | Space: O(n)
 */
function closestKValues(root: TreeNode | null, target: number, k: number): number[] {
  const vals: number[] = [];
  // In-order traversal to get sorted values
  const stack: TreeNode[] = [];
  let cur: TreeNode | null = root;

  while (cur || stack.length > 0) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop()!;
    vals.push(cur.val);
    cur = cur.right;
  }

  // Sliding window: maintain window of size k
  let left = 0;
  for (let right = 0; right < vals.length; right++) {
    if (right - left + 1 > k) {
      // Remove farther endpoint
      if (Math.abs(vals[left] - target) <= Math.abs(vals[right] - target)) {
        // right end is farther — but we're adding from right, so remove left
        left++;
      }
    }
  }
  return vals.slice(left, left + k);
}

/** Solution 3: Two stacks (predecessor + successor) — O(log n + k)
 * Time: O(log n + k) | Space: O(log n)
 */
function closestKValuesOptimal(root: TreeNode | null, target: number, k: number): number[] {
  // Predecessor stack: inorder predecessors (values <= target)
  const predStack: TreeNode[] = [];
  // Successor stack: inorder successors (values > target)
  const succStack: TreeNode[] = [];

  // Initialize predecessor stack
  let cur: TreeNode | null = root;
  while (cur) {
    if (cur.val <= target) {
      predStack.push(cur);
      cur = cur.right;
    } else {
      succStack.push(cur);
      cur = cur.left;
    }
  }

  function getPrev(): number {
    const node = predStack.pop()!;
    let c: TreeNode | null = node.left;
    while (c) {
      predStack.push(c);
      c = c.right;
    }
    return node.val;
  }

  function getNext(): number {
    const node = succStack.pop()!;
    let c: TreeNode | null = node.right;
    while (c) {
      succStack.push(c);
      c = c.left;
    }
    return node.val;
  }

  const result: number[] = [];
  for (let i = 0; i < k; i++) {
    const hasPrev = predStack.length > 0;
    const hasNext = succStack.length > 0;
    if (hasPrev && hasNext) {
      const prevVal = predStack[predStack.length - 1].val;
      const nextVal = succStack[succStack.length - 1].val;
      if (target - prevVal <= nextVal - target) result.push(getPrev());
      else result.push(getNext());
    } else if (hasPrev) {
      result.push(getPrev());
    } else {
      result.push(getNext());
    }
  }
  return result;
}

// Helper builder
function buildBST(vals: (number | null)[]): TreeNode | null {
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
console.log(closestKValues(buildBST([4, 2, 5, 1, 3]), 3.714286, 2).sort()); // [3,4]
console.log(closestKValues(buildBST([1]), 0.0, 1)); // [1]
console.log(closestKValuesBrute(buildBST([4, 2, 5, 1, 3]), 3.714286, 2).sort()); // [3,4]
console.log(closestKValuesOptimal(buildBST([4, 2, 5, 1, 3]), 3.714286, 2).sort()); // [3,4]
console.log(closestKValues(buildBST([4, 2, 5, 1, 3]), 2.0, 3).sort()); // [1,2,3]
console.log(closestKValuesOptimal(buildBST([1, null, 2]), 1.5, 1)); // [1] or [2]
```

## 🔗 Related Problems

| Problem                                                                                            | Relationship              |
| -------------------------------------------------------------------------------------------------- | ------------------------- |
| [Closest Binary Search Tree Value](https://leetcode.com/problems/closest-binary-search-tree-value) | Simpler version: k=1      |
| [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst)       | BST in-order traversal    |
| [Two Sum IV - Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst)             | BST + two-pointer pattern |
