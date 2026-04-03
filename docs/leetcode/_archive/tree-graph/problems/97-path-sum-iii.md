---
layout: page
title: "Path Sum III"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/path-sum-iii"
---

# Path Sum III / Tổng Đường Đi III

> **Difficulty**: 🟡 Medium | **Category**: Tree-Graph | **Pattern**: DFS + Prefix Sum HashMap

## 🧠 Intuition / Tư Duy

**Như tìm các đoạn đường trong thành phố có tổng chi phí đúng bằng ngân sách** — không nhất thiết từ đầu đến cuối thành phố, bất kỳ đoạn liên tục nào cũng được. Dùng tổng tiền lũy từ gốc đến mỗi nút, nếu `prefixSum[v] - target` đã xuất hiện trước đó → có đường đi thỏa điều kiện.

**Pattern Recognition:**

- Đếm đường đi (không nhất thiết root-to-leaf) có tổng = target → Prefix Sum
- `currentSum - target = previousSum` → HashMap lưu số lần xuất hiện
- DFS + HashMap: thêm khi đi xuống, xóa khi backtrack (avoid cross-branch contamination)

**Visual:**

```
Tree: 10→5→3→3, target=8
Prefix sums along path: 10, 15, 18, 21
At node 3 (val=3, sum=18): 18-8=10, map has {0:1,10:1,15:1} → found 1 path (10→5→3)
Also: 5→3=8, found at sum=18, prev=10 ✓
```

## Problem Description

Given the root of a binary tree and an integer `targetSum`, return the number of paths where the sum of values equals `targetSum`. The path does not need to start or end at the root/leaf, but must go downward (parent to child direction).

**Example:** Tree `[10,5,-3,3,2,null,11,3,-2,null,1]`, targetSum=8 → `3`

**Constraints:** 0 ≤ n ≤ 1000, -10^9 ≤ node.val ≤ 10^9, -1000 ≤ targetSum ≤ 1000

## 📝 Interview Tips

1. **Clarify**: Path must go downward (parent→child only). Can the path be a single node? Yes if val==target.
2. **Approach**: DFS with prefix sum HashMap. At each node, check if `currentSum - target` exists in map.
3. **Edge cases**: Negative values (prefix sum can decrease). targetSum=0 with node.val=0. Integer overflow (use Map<number,number>).
4. **Optimize**: Brute force O(n²) — for each node run DFS to find paths starting there. Optimal O(n) with prefix sum.
5. **Follow-up**: If path can go up/down (any direction)? Need to root the tree at each node or use different technique.
6. **Complexity**: O(n) time, O(n) space for prefix sum map (max = tree height for balanced, n for skewed).

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

// Solution 1: DFS + Prefix Sum HashMap (Optimal)
// Time: O(n) | Space: O(n)
function pathSum(root: TreeNode | null, targetSum: number): number {
  const prefixCount = new Map<number, number>();
  prefixCount.set(0, 1); // Empty path has sum 0
  let count = 0;

  function dfs(node: TreeNode | null, currentSum: number): void {
    if (!node) return;
    currentSum += node.val;
    // Check if there's a path ending here with sum = targetSum
    count += prefixCount.get(currentSum - targetSum) ?? 0;
    // Add current prefix sum to map
    prefixCount.set(currentSum, (prefixCount.get(currentSum) ?? 0) + 1);
    dfs(node.left, currentSum);
    dfs(node.right, currentSum);
    // Backtrack: remove current prefix sum
    prefixCount.set(currentSum, (prefixCount.get(currentSum) ?? 0) - 1);
  }

  dfs(root, 0);
  return count;
}

// Solution 2: Brute Force — DFS from every node
// Time: O(n^2) | Space: O(n)
function pathSum2(root: TreeNode | null, targetSum: number): number {
  if (!root) return 0;

  function pathsFrom(node: TreeNode | null, remaining: number): number {
    if (!node) return 0;
    const found = node.val === remaining ? 1 : 0;
    return (
      found +
      pathsFrom(node.left, remaining - node.val) +
      pathsFrom(node.right, remaining - node.val)
    );
  }

  return (
    pathsFrom(root, targetSum) + pathSum2(root.left, targetSum) + pathSum2(root.right, targetSum)
  );
}

// Helper
function buildTree(vals: (number | null)[]): TreeNode | null {
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

// Tests
console.log(pathSum(buildTree([10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]), 8)); // 3
console.log(pathSum(buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]), 22)); // 3
console.log(pathSum2(buildTree([1, null, 2, null, 3]), 3)); // 2
console.log(pathSum(buildTree([1, -2, -3, 1, 3, -2, null, -1]), -1)); // 4
console.log(pathSum(buildTree([0, 1, 1]), 1)); // 4
```

## 🔗 Related Problems

| Problem                                                                       | Relationship                       |
| ----------------------------------------------------------------------------- | ---------------------------------- |
| [Path Sum](https://leetcode.com/problems/path-sum/)                           | Simpler version: root-to-leaf only |
| [Path Sum II](https://leetcode.com/problems/path-sum-ii/)                     | Return all root-to-leaf paths      |
| [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) | Same prefix sum trick on array     |
