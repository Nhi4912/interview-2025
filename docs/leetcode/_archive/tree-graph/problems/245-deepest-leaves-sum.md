---
layout: page
title: "Deepest Leaves Sum"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/deepest-leaves-sum"
---

# Deepest Leaves Sum / Tổng Các Lá Sâu Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Same Tree](https://leetcode.com/problems/same-tree) | [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống hái trái cây ở đáy giếng — chỉ những trái ở tầng sâu nhất mới được tính. BFS tự nhiên duyệt từng tầng; khi xử lý xong tầng cuối cùng, tổng của tầng đó chính là đáp án. DFS thì theo dõi depth và reset khi tìm thấy tầng sâu hơn.

**Pattern Recognition:**

- Signal: "sum of deepest leaves" + "binary tree" → **BFS (last level sum)** hoặc **DFS track maxDepth**
- Key insight: BFS: mỗi vòng lặp ghi lại levelSum, lần cuối cùng chính là đáp án

**Visual — Deepest Leaves Sum example:**

```
Input:         1
             /   \
            2     3
           / \     \
          4   5     6
         /           \
        7              8

BFS levels:
  L0: [1]       levelSum=1
  L1: [2,3]     levelSum=5
  L2: [4,5,6]   levelSum=15
  L3: [7,8]     levelSum=15  ← last level

Output: 15
```

---

## 📝 Problem Description

Given the root of a binary tree, return the sum of values of its **deepest leaves**. The deepest leaves are all leaf nodes at the maximum depth of the tree.

**Example 1:** Tree `[1,2,3,4,5,null,6,7,null,null,null,null,8]` → `15`
**Example 2:** Tree `[6,7,8,2,7,1,3,9,null,1,4,null,null,null,5]` → `19`

Constraints: `1 ≤ nodes ≤ 10⁴`, `1 ≤ Node.val ≤ 100`.

---

## 🎯 Interview Tips

1. **BFS natural fit**: last level sum = answer / BFS rất tự nhiên — tổng của tầng cuối là đáp án
2. **DFS alternative**: track maxDepth, reset sum when deeper level found / DFS: theo dõi maxDepth, reset sum khi tìm tầng sâu hơn
3. **All leaves at max depth** — may have multiple / Có thể có nhiều lá ở tầng sâu nhất
4. **Single node tree**: the root itself is the deepest leaf / Cây 1 node: root là lá sâu nhất
5. **No need to store all nodes**: BFS just needs levelSum per iteration / Không cần lưu tất cả node, chỉ cần levelSum mỗi vòng
6. **Follow-up**: what if you need coordinates of deepest leaves? / Nếu cần tọa độ của deepest leaves thì sao?

---

## 💡 Solutions

### Approach 1: DFS with maxDepth Tracking

/\*_ @complexity Time: O(N) | Space: O(H) _/

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

function deepestLeavesSumDFS(root: TreeNode | null): number {
  let maxDepth = 0;
  let sum = 0;

  function dfs(node: TreeNode | null, depth: number): void {
    if (!node) return;
    if (depth > maxDepth) {
      maxDepth = depth;
      sum = node.val; // new deepest level found, reset sum
    } else if (depth === maxDepth) {
      sum += node.val; // same deepest level, accumulate
    }
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }
  dfs(root, 1);
  return sum;
}
```

### Approach 2: BFS Last Level Sum — Optimal

/\*_ @complexity Time: O(N) | Space: O(W) where W = max width _/

```typescript
function deepestLeavesSum(root: TreeNode | null): number {
  if (!root) return 0;
  let queue: TreeNode[] = [root];
  let levelSum = 0;

  while (queue.length > 0) {
    levelSum = 0;
    const next: TreeNode[] = [];
    for (const node of queue) {
      levelSum += node.val;
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
  }
  // When queue becomes empty, levelSum holds the last level's sum
  return levelSum;
}
```

### Approach 3: Single-Pass DFS with Pair Return

/\*_ @complexity Time: O(N) | Space: O(H) _/

```typescript
function deepestLeavesSumV3(root: TreeNode | null): number {
  // Returns [depth, sumAtDepth]
  function dfs(node: TreeNode | null): [number, number] {
    if (!node) return [0, 0];
    const [ld, ls] = dfs(node.left);
    const [rd, rs] = dfs(node.right);
    if (ld === 0 && rd === 0) return [1, node.val]; // leaf
    if (ld > rd) return [ld + 1, ls];
    if (rd > ld) return [rd + 1, rs];
    return [ld + 1, ls + rs]; // equal depth: sum both sides
  }
  return dfs(root)[1];
}
```

---

## 🧪 Test Cases

```typescript
// Simple manual tree: 1 → (2 → (4→7), 3 → 6→8)
const n7 = new TreeNode(7), n8 = new TreeNode(8);
const n4 = new TreeNode(4, n7), n5 = new TreeNode(5);
const n6 = new TreeNode(6, null, n8);
const root1 = new TreeNode(1, new TreeNode(2, n4, n5), new TreeNode(3, null, n6));
console.log(deepestLeavesSum(root1));     // → 15  (7+8)
console.log(deepestLeavesSum(new TreeNode(1)));  // → 1
console.log(deepestLeavesSumDFS(root1)); // → 15
console.log(deepestLeavesSumV3(root1));  // → 15
```

---

## Related Problems

| Problem                                                                                                  | Difficulty | Pattern |
| -------------------------------------------------------------------------------------------------------- | ---------- | ------- |
| [Find Largest Value in Each Tree Row](https://leetcode.com/problems/find-largest-value-in-each-tree-row) | Medium     | BFS     |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal)     | Medium     | BFS     |
| [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree)               | Easy       | DFS/BFS |
