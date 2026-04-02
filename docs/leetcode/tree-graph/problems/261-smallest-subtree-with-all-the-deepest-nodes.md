---
layout: page
title: "Smallest Subtree with all the Deepest Nodes"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes"
---

# Smallest Subtree with all the Deepest Nodes / Cây Con Nhỏ Nhất Chứa Tất Cả Lá Sâu Nhất

> **Track**: Tree-Graph | **Difficulty**: 🟡 Medium | **Pattern**: DFS — Return (depth, LCA) pairs
> **Frequency**: 📘 Tier 3 — Gặp ở Google, Facebook (cùng đề với #1123 LCA of Deepest Leaves)
> **See also**: [236 LCA of Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | [1123 LCA of Deepest Leaves](https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một gia tộc có nhiều thế hệ. Bạn muốn tìm người tổ tiên chung gần nhất của tất cả con cháu thuộc thế hệ trẻ nhất (sâu nhất). Nếu cả nhánh trái và nhánh phải đều có con cháu đời thứ 5, thì chính ông tổ gốc là LCA. Nếu chỉ nhánh trái có đời thứ 5 (nhánh phải chỉ tới đời thứ 3), thì LCA nằm trong nhánh trái. DFS trả về cặp (độ sâu, LCA) — như điều tra viên báo cáo lên trên: "thế hệ sâu nhất trong vùng tôi quản là bao nhiêu, và LCA của chúng là ai".

**Pattern Recognition:**

- Signal: "binary tree + all deepest leaves + smallest subtree" → **DFS returning (maxDepth, node)**
- Bài này thuộc dạng DFS post-order với kết quả ghép (depth, node)
- Key insight: nếu left.depth == right.depth → root là LCA; nếu left.depth > right.depth → LCA ở left subtree; ngược lại LCA ở right subtree

**Visual — DFS (depth, node) propagation:**

```
Tree: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]
           3
          / \
         5   1
        /\   /\
       6  2 0  8
         /\
        7  4

DFS returns (maxDepth, LCA):
  node(6): leaf → (1, 6)
  node(7): leaf → (1, 7)
  node(4): leaf → (1, 4)
  node(2): left(7)=(1,7), right(4)=(1,4) → equal depth → LCA=2, return (2, 2)
  node(5): left(6)=(1,6), right(2)=(2,2) → right deeper → return (3, 2)
  node(0): leaf → (1, 0)
  node(8): leaf → (1, 8)
  node(1): left(0)=(1,0), right(8)=(1,8) → equal → return (2, 1)
  node(3): left=(3,2), right=(2,1) → left deeper → return (4, node2)

Answer: node with value 2  ✅
```

---

## Problem Description

Given the root of a binary tree, return the smallest subtree such that it contains all the deepest nodes. A node is the deepest if it has the largest depth among any node in the entire tree. ([LeetCode](https://leetcode.com/problems/smallest-subtree-with-all-the-deepest-nodes))

```
Example 1: root=[3,5,1,6,2,0,8,null,null,7,4] → node(2) (subtree rooted at 2 has deepest leaves 7,4)
Example 2: root=[1] → node(1)
Example 3: root=[0,1,3,null,2] → node(2)
```

Constraints: 1 ≤ nodes ≤ 500; 0 ≤ node.val ≤ 500; unique values.

---

## 📝 Interview Tips

1. **Return (depth, node) from DFS — depth tracks how deep the subtree reaches** — _Trả về cặp (độ sâu, nút) — depth cho biết nhánh đó đi được bao sâu_
2. **If left.depth == right.depth → current node is the LCA of all deepest** — _Hai nhánh bằng nhau về độ sâu → nút hiện tại là LCA — cả hai bên đều có lá sâu nhất_
3. **If left.depth > right.depth → propagate left's result upward** — _Nhánh trái sâu hơn → LCA phải nằm trong nhánh trái — trả kết quả của trái lên_
4. **Null nodes return depth 0** — _Null trả về depth 0 — base case tự nhiên_
5. **This is identical to LeetCode #1123 (LCA of Deepest Leaves) — same solution** — _Bài này đồng nhất với #1123 — cùng cách giải_
6. **Single-pass O(n) — no need to separately find max depth then find LCA** — _Một lần DFS là đủ — không cần hai bước tách biệt_

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

/** Solution 1: DFS returning [depth, lca] tuple
 * @complexity Time: O(n) | Space: O(h) */
function subtreeWithAllDeepest(root: TreeNode | null): TreeNode | null {
  function dfs(node: TreeNode | null): [number, TreeNode | null] {
    if (!node) return [0, null];
    const [ld, llca] = dfs(node.left);
    const [rd, rlca] = dfs(node.right);
    if (ld === rd) return [ld + 1, node]; // both subtrees equally deep → current is LCA
    if (ld > rd) return [ld + 1, llca]; // left subtree deeper → LCA lives there
    return [rd + 1, rlca]; // right subtree deeper → LCA lives there
  }
  return dfs(root)[1];
}

/** Solution 2: Two-pass — find maxDepth then find LCA explicitly
 * @complexity Time: O(n) | Space: O(h) */
function subtreeWithAllDeepest2(root: TreeNode | null): TreeNode | null {
  function maxDepth(node: TreeNode | null): number {
    if (!node) return 0;
    return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
  }
  const depth = maxDepth(root);

  function dfs(node: TreeNode | null, d: number): TreeNode | null {
    if (!node) return null;
    if (d === depth) return node; // this is a deepest leaf
    const left = dfs(node.left, d + 1);
    const right = dfs(node.right, d + 1);
    if (left && right) return node; // deepest leaves on both sides
    return left ?? right;
  }
  return dfs(root, 1);
}

// === Test Cases ===
function makeTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] == null) return null;
  const root = new TreeNode(vals[0]!);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (i < vals.length) {
    const node = queue.shift()!;
    if (vals[i] != null) {
      node.left = new TreeNode(vals[i]!);
      queue.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] != null) {
      node.right = new TreeNode(vals[i]!);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

const t1 = makeTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
console.log(subtreeWithAllDeepest(t1)?.val); // 2

const t2 = makeTree([1]);
console.log(subtreeWithAllDeepest(t2)?.val); // 1

const t3 = makeTree([0, 1, 3, null, 2]);
console.log(subtreeWithAllDeepest(t3)?.val); // 2
```

---

## 🔗 Related Problems

| #    | Problem                      | Difficulty | Pattern            |
| ---- | ---------------------------- | ---------- | ------------------ |
| 1123 | LCA of Deepest Leaves        | Medium     | DFS — same problem |
| 236  | LCA of Binary Tree           | Medium     | DFS post-order     |
| 104  | Maximum Depth of Binary Tree | Easy       | DFS                |
| 111  | Minimum Depth of Binary Tree | Easy       | BFS/DFS            |
