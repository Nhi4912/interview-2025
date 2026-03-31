---
layout: page
title: "Count Nodes With the Highest Score"
difficulty: Medium
category: Tree-Graph
tags: [Array, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/count-nodes-with-the-highest-score"
---

# Count Nodes With the Highest Score / Đếm Nút Có Điểm Cao Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như chia đất làng khi xóa một căn nhà — căn nhà bị xóa chia đất thành tối đa 3 mảnh (vùng con trái, vùng con phải, phần còn lại). Điểm của mỗi nhà là tích diện tích 3 mảnh đó. Nhà nào cho tích lớn nhất thì thắng.

**Pattern Recognition:**

- Signal: "delete node" + "product of component sizes" → **Tree DP (subtree sizes)**
- When deleting node i: left subtree + right subtree + (n-1-leftSize-rightSize) are 3 components
- Precompute subtree sizes via DFS, then score each node in O(1)

**Visual:**

```
parents = [-1, 0, 0, 1, 1]  → n=5
Tree:         0
             / \
            1   2
           / \
          3   4

subtreeSize: [5, 3, 1, 1, 1]

Delete node 1: components = [left=1(size 1), right=1(size 1), parent_part=n-1-1-1=2]
score(1) = 1 * 1 * 2 = 2 (via BigInt to handle overflow)
Delete node 0: components = [left=3, right=1, 0 ignored]
score(0) = 3 * 1 = 3  ← maximum
```

## Problem Description

Given a binary tree with n nodes (0 to n-1) represented as `parents[]` where `parents[0]=-1`, deleting a node splits the tree into up to 3 components. The **score** of node i = product of the sizes of non-empty components. Return the count of nodes having the maximum score. Use BigInt to avoid overflow for large n.

Example 1: `parents=[-1,2,0,2,0]` → `3`
Example 2: `parents=[-1,0]` → `2`

## 📝 Interview Tips

1. **Clarify**: "n có thể lên đến 10^5 — tích 3 thành phần có thể overflow number" / Use BigInt for product
2. **Approach**: "DFS tính subtreeSize trước, rồi tính score từng node trong O(1)" / Precompute then score
3. **Components**: "Khi xóa node i: left child subtree + right child subtree + phần còn lại (n-1-L-R)" / 3 parts
4. **Edge cases**: "n=2: xóa root còn 1 node, điểm=1; xóa leaf còn root+sibling" / Small trees
5. **Follow-up**: "Tìm node thực sự thay vì đếm?" / Return the actual node with max score
6. **Complexity**: "Time O(n) | Space O(n) subtree array + O(n) children adjacency"

## Solutions

```typescript
/** Solution 1: Brute Force — recompute subtree size for each deletion
 * Time: O(n²) | Space: O(n)
 */
function countHighestScoreNodesBrute(parents: number[]): number {
  const n = parents.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) children[parents[i]].push(i);

  function subtreeSize(root: number, exclude: number): number {
    if (root === exclude) return 0;
    let size = 1;
    for (const c of children[root]) size += subtreeSize(c, exclude);
    return size;
  }

  let maxScore = 0n,
    count = 0;
  for (let i = 0; i < n; i++) {
    let score = 1n;
    let remaining = n - 1;
    for (const c of children[i]) {
      const s = subtreeSize(c, i);
      if (s > 0) {
        score *= BigInt(s);
        remaining -= s;
      }
    }
    if (remaining > 0) score *= BigInt(remaining);
    if (score > maxScore) {
      maxScore = score;
      count = 1;
    } else if (score === maxScore) count++;
  }
  return count;
}

/** Solution 2: DFS subtree sizes + single-pass scoring
 * Time: O(n) | Space: O(n)
 */
function countHighestScoreNodes(parents: number[]): number {
  const n = parents.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) children[parents[i]].push(i);

  const sz = new Array(n).fill(1);

  // Compute subtree sizes bottom-up using topological order
  const inDeg = new Array(n).fill(0);
  for (let i = 1; i < n; i++) inDeg[parents[i]]++;

  // Process leaves first (Kahn's-style for trees)
  function dfsSize(node: number): void {
    for (const child of children[node]) {
      dfsSize(child);
      sz[node] += sz[child];
    }
  }
  dfsSize(0);

  let maxScore = 0n,
    count = 0;

  for (let i = 0; i < n; i++) {
    let score = 1n;
    let remaining = n - 1;

    // Left child component
    if (children[i][0] !== undefined) {
      score *= BigInt(sz[children[i][0]]);
      remaining -= sz[children[i][0]];
    }
    // Right child component
    if (children[i][1] !== undefined) {
      score *= BigInt(sz[children[i][1]]);
      remaining -= sz[children[i][1]];
    }
    // Parent-side component
    if (remaining > 0) score *= BigInt(remaining);

    if (score > maxScore) {
      maxScore = score;
      count = 1;
    } else if (score === maxScore) count++;
  }

  return count;
}

/** Solution 3: Iterative bottom-up with explicit stack
 * Time: O(n) | Space: O(n)
 */
function countHighestScoreNodesIter(parents: number[]): number {
  const n = parents.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) children[parents[i]].push(i);

  // Build processing order (leaves → root)
  const order: number[] = [];
  const stack = [0];
  while (stack.length > 0) {
    const node = stack.pop()!;
    order.push(node);
    for (const c of children[node]) stack.push(c);
  }

  const sz = new Array(n).fill(1);
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    for (const c of children[node]) sz[node] += sz[c];
  }

  let maxScore = 0n,
    count = 0;
  for (let i = 0; i < n; i++) {
    let score = 1n,
      remaining = n - 1;
    for (const c of children[i]) {
      score *= BigInt(sz[c]);
      remaining -= sz[c];
    }
    if (remaining > 0) score *= BigInt(remaining);
    if (score > maxScore) {
      maxScore = score;
      count = 1;
    } else if (score === maxScore) count++;
  }
  return count;
}

// Tests
console.log(countHighestScoreNodes([-1, 2, 0, 2, 0])); // 3
console.log(countHighestScoreNodes([-1, 0])); // 2
console.log(countHighestScoreNodesBrute([-1, 2, 0, 2, 0])); // 3
console.log(countHighestScoreNodesIter([-1, 0])); // 2
console.log(countHighestScoreNodes([-1, 0, 0, 1, 1])); // 1
console.log(countHighestScoreNodes([-1, 0, 1, 2])); // 1
```

## 🔗 Related Problems

| Problem                                                                                                          | Relationship                     |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| [Sum of Subtree Widths](https://leetcode.com/problems/sum-of-subtree-widths)                                     | Subtree size computation pattern |
| [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | Tree DFS path tracking           |
| [Find Largest Value in Each Tree Row](https://leetcode.com/problems/find-largest-value-in-each-tree-row)         | Tree traversal                   |
