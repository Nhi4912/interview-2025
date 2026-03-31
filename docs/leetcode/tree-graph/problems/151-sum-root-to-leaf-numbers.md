---
layout: page
title: "Sum Root to Leaf Numbers"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/sum-root-to-leaf-numbers"
---

# Sum Root to Leaf Numbers / Tổng Các Số Từ Gốc Đến Lá

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS with Accumulated Value
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Path Sum](https://leetcode.com/problems/path-sum) | [Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths)

---

## 🧠 Intuition / Tư Duy

**Analogy (VI):** Mỗi đường từ gốc đến lá tạo thành một số (ví dụ 1→2→3 = 123). DFS truyền xuống số hiện tại = `prev * 10 + node.val`. Khi đến lá, cộng số đó vào tổng.

**Analogy (EN):** DFS passing `currentNum = parentNum * 10 + node.val` down the tree. At each leaf, add currentNum to total. This builds the path number digit by digit.

```
Tree:       1
           / \
          2   3

DFS left:  1→2: num = 1*10+2 = 12 (leaf) → sum += 12
DFS right: 1→3: num = 1*10+3 = 13 (leaf) → sum += 13
Total = 25

Tree:         4
             / \
            9   0
           / \
          5   1
Paths: 495, 491, 40  → sum = 1026
```

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "Node values 0-9 only?" / Yes, each node is single digit 0-9
2. **Pattern / Nhận dạng**: Truyền state xuống DFS (`currentNum`) — không cần backtrack / Pass accumulated number down; no explicit backtracking needed
3. **Leaf check / Kiểm tra lá**: Leaf = node với left=null AND right=null / Both children null = leaf
4. **Null node / Node null**: Base case: null node returns 0 — không cộng gì / Return 0 for null nodes
5. **Overflow / Tràn số**: Với cây sâu > 9 tầng, số có thể lớn — dùng BigInt nếu cần / Tree depth ≤ 1000 → value fits in 32-bit safely per constraints
6. **Follow-up**: "Collect all path strings?" → same DFS, build string instead of number

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
 * Solution 1: DFS Recursive (Top-Down)
 * Time: O(N) — visit every node once
 * Space: O(H) — recursion stack, H = tree height
 *
 * Truyền currentNum = prev*10 + val xuống. Khi lá: cộng vào tổng.
 */
function sumNumbers(root: TreeNode | null): number {
  function dfs(node: TreeNode | null, cur: number): number {
    if (!node) return 0;
    cur = cur * 10 + node.val;
    if (!node.left && !node.right) return cur; // leaf
    return dfs(node.left, cur) + dfs(node.right, cur);
  }
  return dfs(root, 0);
}

/**
 * Solution 2: Iterative DFS with Stack
 * Time: O(N) — visit every node once
 * Space: O(H) — explicit stack
 *
 * Stack lưu [node, currentNum]. Pop node, nếu lá thì cộng vào sum.
 */
function sumNumbersIterative(root: TreeNode | null): number {
  if (!root) return 0;
  let sum = 0;
  const stack: [TreeNode, number][] = [[root, root.val]];

  while (stack.length > 0) {
    const [node, cur] = stack.pop()!;
    if (!node.left && !node.right) {
      sum += cur; // leaf: accumulate
    }
    if (node.right) stack.push([node.right, cur * 10 + node.right.val]);
    if (node.left) stack.push([node.left, cur * 10 + node.left.val]);
  }
  return sum;
}

/**
 * Solution 3: BFS Iterative
 * Time: O(N) — visit every node once
 * Space: O(W) — W = max width of tree
 *
 * BFS với queue lưu [node, currentNum].
 */
function sumNumbersBFS(root: TreeNode | null): number {
  if (!root) return 0;
  let sum = 0;
  const queue: [TreeNode, number][] = [[root, root.val]];

  while (queue.length > 0) {
    const [node, cur] = queue.shift()!;
    if (!node.left && !node.right) {
      sum += cur;
      continue;
    }
    if (node.left) queue.push([node.left, cur * 10 + node.left.val]);
    if (node.right) queue.push([node.right, cur * 10 + node.right.val]);
  }
  return sum;
}

// === Test Cases ===
const t1 = new TreeNode(1, new TreeNode(2), new TreeNode(3));
console.log(sumNumbers(t1)); // 25  (12 + 13)
console.log(sumNumbersIterative(t1)); // 25
console.log(sumNumbersBFS(t1)); // 25

const t2 = new TreeNode(4, new TreeNode(9, new TreeNode(5), new TreeNode(1)), new TreeNode(0));
console.log(sumNumbers(t2)); // 1026  (495 + 491 + 40)

console.log(sumNumbers(null)); // 0  (empty tree)
console.log(sumNumbers(new TreeNode(5))); // 5  (single node)
```

---

## 🔗 Related Problems

| Problem                                                                                                | Pattern       | Difficulty |
| ------------------------------------------------------------------------------------------------------ | ------------- | ---------- |
| [Path Sum](https://leetcode.com/problems/path-sum)                                                     | DFS           | 🟢 Easy    |
| [Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths)                                   | DFS           | 🟢 Easy    |
| [Path Sum II](https://leetcode.com/problems/path-sum-ii)                                               | DFS Backtrack | 🟡 Medium  |
| [Smallest String Starting From Leaf](https://leetcode.com/problems/smallest-string-starting-from-leaf) | DFS           | 🟡 Medium  |
