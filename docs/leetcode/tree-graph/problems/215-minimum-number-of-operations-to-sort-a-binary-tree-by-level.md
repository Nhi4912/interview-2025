---
layout: page
title: "Minimum Number of Operations to Sort a Binary Tree by Level"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-operations-to-sort-a-binary-tree-by-level"
---

# Minimum Number of Operations to Sort a Binary Tree by Level / Số Thao Tác Tối Thiểu Để Sắp Xếp Cây Nhị Phân Theo Cấp

---

## 🧠 Intuition / Tư Duy

**Analogy:** > Mỗi tầng của tòa nhà (level của cây) có các căn phòng đánh số lộn xộn. Bạn muốn sắp xếp số phòng tăng dần từ trái sang phải. Mỗi thao tác là **hoán vị 2 phòng bất kỳ** trong cùng tầng. Tìm số hoán vị tối thiểu.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Number of Operations to Sort a Binary Tree by Level example:**

```
Level 1:  [1]          (sorted, 0 swaps)
Level 2:  [3, 2]       → [2, 3]: 1 swap
Level 3:  [7, 6, 5, 4] → [4, 5, 6, 7]: 2 swaps
           7↔4 → [4,6,5,7], 6↔5 → [4,5,6,7]
Total = 0 + 1 + 2 = 3 swaps
```

---

## Problem Description

Given the `root` of a binary tree with **unique** values. In one operation, you can swap any two children of the same parent. Return the minimum number of operations needed to make values at each level sorted in strictly increasing order from left to right.

---

## 📝 Interview Tips

1. **BFS for levels** — collect each level's values, compute swaps independently
2. **Minimum swaps to sort** — classic problem: find cycles in permutation, answer = n - numCycles
3. **Coordinate compression** — map values to indices [0..n-1] using sorted rank
4. **Cycle detection** — follow permutation cycles; each cycle of length k needs k-1 swaps
5. **Unique values** — guaranteed, so no duplicates to handle
6. **Total ops** — sum minimum swaps across all levels

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

function minimumOperations(root: TreeNode | null): number {
  if (!root) return 0;

  // Minimum swaps to sort array using cycle decomposition
  function minSwapsToSort(arr: number[]): number {
    const sorted = [...arr].sort((a, b) => a - b);
    // Map value → its target index
    const indexMap = new Map<number, number>();
    sorted.forEach((val, i) => indexMap.set(val, i));

    const n = arr.length;
    const visited = new Array(n).fill(false);
    let swaps = 0;

    for (let i = 0; i < n; i++) {
      if (visited[i] || indexMap.get(arr[i]) === i) continue;
      // Follow this cycle
      let cycleLen = 0;
      let j = i;
      while (!visited[j]) {
        visited[j] = true;
        j = indexMap.get(arr[j])!;
        cycleLen++;
      }
      swaps += cycleLen - 1;
    }
    return swaps;
  }

  let total = 0;
  const queue: TreeNode[] = [root];

  while (queue.length) {
    const levelSize = queue.length;
    const levelVals: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      levelVals.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    total += minSwapsToSort(levelVals);
  }

  return total;
}

// Build tree: [1,4,3,7,6,8,5,null,null,null,null,9,null,10]
const root1 = new TreeNode(
  1,
  new TreeNode(4, new TreeNode(7), new TreeNode(6)),
  new TreeNode(3, new TreeNode(8), new TreeNode(5)),
);
console.log(minimumOperations(root1)); // 3

function minimumOperationsV2(root: TreeNode | null): number {
  if (!root) return 0;

  function countSwaps(arr: number[]): number {
    const n = arr.length;
    const pos = new Map(arr.map((v, i) => [v, i]));
    const sorted = [...arr].sort((a, b) => a - b);
    let swaps = 0;

    for (let i = 0; i < n; i++) {
      if (arr[i] !== sorted[i]) {
        swaps++;
        const j = pos.get(sorted[i])!;
        pos.set(arr[i], j);
        pos.set(sorted[i], i);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    return swaps;
  }

  let total = 0;
  const queue: TreeNode[] = [root];
  while (queue.length) {
    const size = queue.length;
    const vals: number[] = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      vals.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    total += countSwaps(vals);
  }
  return total;
}

console.log(minimumOperationsV2(root1)); // 3
const root2 = new TreeNode(1, new TreeNode(3, new TreeNode(7), new TreeNode(6)), new TreeNode(2));
console.log(minimumOperationsV2(root2)); // 3
```

---

## 🔗 Related Problems

| #    | Problem                                     | Difficulty | Tags         |
| ---- | ------------------------------------------- | ---------- | ------------ |
| 2471 | Minimum Number of Operations to Sort (this) | Medium     | BFS, Sorting |
| 102  | Binary Tree Level Order Traversal           | Medium     | BFS          |
| 1769 | Minimum Number of Operations to Move...     | Medium     | Array        |
| 268  | Minimum Swaps to Sort (cycle method)        | Classic    | Array        |
