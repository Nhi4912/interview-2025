---
layout: page
title: "Distribute Coins in Binary Tree"
difficulty: Medium
category: Tree & Graph
tags: [Tree, DFS, Binary Tree]
leetcode_url: "https://leetcode.com/problems/distribute-coins-in-binary-tree"
---

# Distribute Coins in Binary Tree / Phân Phối Xu Trong Cây Nhị Phân

> **Track**: Tree & Graph | **Difficulty**: 🟡 Medium | **Pattern**: DFS Post-Order
> **Frequency**: 📗 Tier 2 — Gặp ở Amazon, Google, Facebook
> **See also**: [Minimum Time to Collect All Apples in a Tree](https://leetcode.com/problems/minimum-time-to-collect-all-apples-in-a-tree) | [Binary Tree Cameras](https://leetcode.com/problems/binary-tree-cameras)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một gia đình lớn có nhiều thế hệ. Mỗi thành viên có một số tiền xu, nhưng quy tắc là cuối cùng mỗi người phải có đúng 1 xu. Tiền xu chỉ được chuyển qua "quan hệ cha-con" — tức là theo cạnh của cây gia phả. Mỗi lần chuyển qua một cạnh tốn 1 bước. Bí quyết: mỗi node cần xuất khẩu `(tổng xu trong cây con) - (số node trong cây con)` xu sang cha — giá trị này có thể âm (cần nhập thêm) hoặc dương (có dư).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Distribute Coins in Binary Tree example:**

```
Tree: [3,0,0]       Tree: [0,3,0]
    3                   0
   / \                 /
  0   0               3

DFS post-order:         DFS post-order:
  left(0): excess=-1      left(3): excess=+2
  right(0): excess=-1     node 0: excess = 0+2+1-1 = 2
  node(3): |−1|+|−1| =2   moves = |2| = 2 ✓
  total moves=2 ✓

General formula at each node:
  excess = node.val + leftExcess + rightExcess - 1
  moves += |leftExcess| + |rightExcess|
  return excess  (to parent)
```

---

## Problem Description

Given a binary tree with `n` nodes where each node has `node.val` coins, and there are exactly `n` coins total. In one move, you can transfer a coin between two **adjacent** nodes. Return the **minimum number of moves** to give every node exactly 1 coin.

**Example 1:** `root=[3,0,0]` → `2` (move 2 coins from root to children)
**Example 2:** `root=[0,3,0]` → `3` (left child has 3 coins, needs to distribute)
**Example 3:** `root=[1,0,2]` → `2`
**Example 4:** `root=[1,0,0,null,3]` → `4`

**Constraints:** `1 ≤ n ≤ 100`, `0 ≤ Node.val ≤ n`, sum of all vals equals `n`

---

## 📝 Interview Tips

- **Excess = flow through edge** / Thặng dư = dòng chảy qua cạnh: |excess| qua mỗi cạnh chính xác là số lần coin đi qua cạnh đó
- **Post-order DFS** / DFS hậu thứ tự: Phải biết excess của con trước khi tính của cha — do đó dùng post-order
- **Excess formula** / Công thức thặng dư: `excess(node) = node.val + excess(left) + excess(right) - 1`
- **Negative excess = deficit** / Thặng dư âm = thiếu hụt: Con cần nhận coin từ cha → cũng tốn |excess| moves
- **Absolute value** / Giá trị tuyệt đối: Không quan tâm hướng di chuyển — `|excess|` là số moves qua cạnh đó
- **Base case null = 0** / Trường hợp cơ sở null = 0: `excess(null) = 0` — lá ảo không đóng góp

---

## Solutions

```typescript
/**
 * @complexity Time: O(n) | Space: O(h) where h = tree height
 * Post-order DFS; each node returns excess coins; moves += abs(excess) per edge
 */
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

function distributeCoins(root: TreeNode | null): number {
  let moves = 0;

  function dfs(node: TreeNode | null): number {
    if (!node) return 0;
    const leftExcess = dfs(node.left);
    const rightExcess = dfs(node.right);
    moves += Math.abs(leftExcess) + Math.abs(rightExcess);
    return node.val + leftExcess + rightExcess - 1;
  }

  dfs(root);
  return moves;
}

/**
 * @complexity Time: O(n) | Space: O(n)
 * Iterative post-order using explicit stack; avoids recursion depth issues
 */
function distributeCoinsIterative(root: TreeNode | null): number {
  if (!root) return 0;
  const excess = new Map<TreeNode, number>();
  let moves = 0;
  const stack: TreeNode[] = [];
  const visited = new Set<TreeNode>();
  stack.push(root);

  while (stack.length) {
    const node = stack[stack.length - 1];
    const leftDone = !node.left || visited.has(node.left);
    const rightDone = !node.right || visited.has(node.right);

    if (leftDone && rightDone) {
      stack.pop();
      visited.add(node);
      const le = node.left ? excess.get(node.left)! : 0;
      const re = node.right ? excess.get(node.right)! : 0;
      moves += Math.abs(le) + Math.abs(re);
      excess.set(node, node.val + le + re - 1);
    } else {
      if (!leftDone && node.left) stack.push(node.left);
      else if (!rightDone && node.right) stack.push(node.right);
    }
  }

  return moves;
}

// === Test Cases ===
const build = (vals: (number | null)[]): TreeNode | null => {
  if (!vals.length || vals[0] == null) return null;
  const root = new TreeNode(vals[0]!);
  const q: TreeNode[] = [root];
  let i = 1;
  while (q.length && i < vals.length) {
    const n = q.shift()!;
    if (vals[i] != null) {
      n.left = new TreeNode(vals[i]!);
      q.push(n.left);
    }
    i++;
    if (i < vals.length && vals[i] != null) {
      n.right = new TreeNode(vals[i]!);
      q.push(n.right);
    }
    i++;
  }
  return root;
};

console.log(distributeCoins(build([3, 0, 0]))); // → 2
console.log(distributeCoins(build([0, 3, 0]))); // → 3
console.log(distributeCoins(build([1, 0, 2]))); // → 2
console.log(distributeCoins(build([1, 0, 0, null, 3]))); // → 4
console.log(distributeCoinsIterative(build([3, 0, 0]))); // → 2
```

---

## 🔗 Related Problems

| Problem                                      | Difficulty | Link                                                                                  |
| -------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| Minimum Time to Collect All Apples in a Tree | Medium     | [LC 1443](https://leetcode.com/problems/minimum-time-to-collect-all-apples-in-a-tree) |
| Binary Tree Cameras                          | Hard       | [LC 968](https://leetcode.com/problems/binary-tree-cameras)                           |
| Path Sum III                                 | Medium     | [LC 437](https://leetcode.com/problems/path-sum-iii)                                  |
