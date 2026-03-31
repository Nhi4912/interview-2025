---
layout: page
title: "Number of Good Leaf Nodes Pairs"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/number-of-good-leaf-nodes-pairs"
---

# Number of Good Leaf Nodes Pairs / Số Cặp Node Lá Tốt

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS Post-order (Return leaf distances)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng mỗi node là một ngã tư. Khi DFS leo lên từ lá, mỗi node "gom" danh sách khoảng cách đến tất cả lá trong subtree của nó. Khi merge left + right tại một node cha, đếm các cặp (lá trái, lá phải) mà tổng khoảng cách ≤ distance. Đây là dạng "post-order merge" — tương tự cách tính Diameter of Binary Tree.

**Pattern Recognition:**

- Signal: "count pairs of leaves in binary tree with path distance ≤ d" → **DFS post-order**
- DFS trả về mảng distances từ node hiện tại đến tất cả lá trong subtree
- Tại mỗi node: cross-count giữa left distances và right distances

**Visual — DFS Leaf Distance Merging:**

```
distance = 3
        1
       / \
      2   3
     / \
    4   5   (4 and 5 are leaves)

DFS(4): leaf → return [1]  (dist=1 from itself, +1 when passed up)
DFS(5): leaf → return [1]
DFS(2): left=[1], right=[1]
  Check pairs: 1+1=2 ≤ 3 → count += 1
  Return [2, 2]  (increment each by 1: [1+1, 1+1])

DFS(3): leaf → return [1]
DFS(1): left=[2,2], right=[1]
  Check pairs: 2+1=3 ≤ 3 ✓, 2+1=3 ≤ 3 ✓ → count += 2
  Return [3,3,2]  (but 3 > distance, can prune: [2])

Total count = 1 + 2 = 3 ✓
```

---

## Problem Description

Given a binary tree root and integer `distance`. A pair of **leaf nodes** is "good" if the **length of the shortest path between them is ≤ distance**. Return the number of good leaf node pairs.

- `1 ≤ n ≤ 1024`, `1 ≤ distance ≤ 10`
- Path between two leaves passes through their LCA

```
Example 1: root=[1,2,3,null,4], distance=3 → 1
  Leaves: 4 (depth 3), 3 (depth 2). Path 4→2→1→3, length=3 ≤ 3 ✓

Example 2: root=[1,2,3,4,5,6,7], distance=3 → 2
  Pairs: (4,5) path=2 ✓, (6,7) path=2 ✓, others > 3

Example 3: root=[7,1,4,6,null,5,3,null,null,null,null,null,2], distance=3 → 1
```

---

## 📝 Interview Tips

1. **Post-order pattern** — DFS trả về thông tin từ subtree lên cha; giống Diameter of Binary Tree / _Post-order returns subtree info upward — same pattern as Diameter of BT_
2. **Distance array** — Mỗi node trả về `number[]` = khoảng cách đến mọi lá trong subtree / _Each node returns array of distances to all leaves in its subtree_
3. **Cross-count** — Tại mỗi node, count pairs từ left × right; tránh đếm pairs trong cùng subtree / _Count cross-pairs at each LCA node — avoids double-counting_
4. **Prune early** — Loại bỏ distances > `distance` trước khi trả lên: giảm overhead / _Filter out distances exceeding limit before propagating upward_
5. **Leaf base case** — Lá trả về `[1]` (khoảng cách 1 từ parent, không phải 0 từ chính nó) / _Leaf returns [1] — distance 1 from parent, not 0 from itself_
6. **Complexity** — O(n × distance²) trong thực tế vì mảng được prune; worst O(n²) / _O(n × d²) in practice with pruning; O(n²) worst case without_

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
 * Solution 1: DFS Collecting All Leaf Paths (simpler but O(n²))
 * Collect all leaf nodes, compute pairwise distances via LCA.
 * Time: O(n²) — all pairs
 * Space: O(n)
 */
function countPairsBruteForce(root: TreeNode | null, distance: number): number {
  const leaves: TreeNode[] = [];
  const parentMap = new Map<TreeNode, TreeNode | null>();

  // Collect leaves and build parent map
  function dfs(node: TreeNode | null, parent: TreeNode | null): void {
    if (!node) return;
    parentMap.set(node, parent);
    if (!node.left && !node.right) {
      leaves.push(node);
      return;
    }
    dfs(node.left, node);
    dfs(node.right, node);
  }
  dfs(root, null);

  function pathLen(a: TreeNode, b: TreeNode): number {
    const distA = new Map<TreeNode, number>();
    let cur: TreeNode | null = a,
      d = 0;
    while (cur) {
      distA.set(cur, d++);
      cur = parentMap.get(cur) ?? null;
    }
    cur = b;
    d = 0;
    while (cur) {
      if (distA.has(cur)) return distA.get(cur)! + d;
      d++;
      cur = parentMap.get(cur) ?? null;
    }
    return Infinity;
  }

  let count = 0;
  for (let i = 0; i < leaves.length; i++)
    for (let j = i + 1; j < leaves.length; j++)
      if (pathLen(leaves[i], leaves[j]) <= distance) count++;
  return count;
}

/**
 * Solution 2: DFS Post-order — Return Distances Array
 * Time: O(n × distance²) — pruned distances per node, cross-product at each LCA
 * Space: O(n × distance) — distances arrays on call stack
 * Each node returns array of distances to leaves in its subtree (pruned > distance).
 * At each internal node, count cross-pairs (left × right) within distance.
 */
function countPairs(root: TreeNode | null, distance: number): number {
  let result = 0;

  function dfs(node: TreeNode | null): number[] {
    if (!node) return [];
    if (!node.left && !node.right) return [1]; // leaf: distance 1 to parent

    const left = dfs(node.left);
    const right = dfs(node.right);

    // Count good pairs: one leaf from left subtree, one from right
    for (const l of left) {
      for (const r of right) {
        if (l + r <= distance) result++;
      }
    }

    // Propagate distances upward, incremented by 1, pruned at > distance
    const merged: number[] = [];
    for (const d of left) if (d + 1 <= distance) merged.push(d + 1);
    for (const d of right) if (d + 1 <= distance) merged.push(d + 1);
    return merged;
  }

  dfs(root);
  return result;
}

// === Test Cases ===
function makeTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0]!);
  const queue = [root];
  let i = 1;
  while (queue.length && i < vals.length) {
    const node = queue.shift()!;
    if (i < vals.length && vals[i] !== null) {
      node.left = new TreeNode(vals[i]!);
      queue.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = new TreeNode(vals[i]!);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

console.log(countPairs(makeTree([1, 2, 3, null, 4]), 3)); // 1
console.log(countPairs(makeTree([1, 2, 3, 4, 5, 6, 7]), 3)); // 2
console.log(countPairs(makeTree([1, 2, null, 3, 4]), 3)); // 1  (leaves 3,4: path=2 ≤ 3)

console.log(countPairsBruteForce(makeTree([1, 2, 3, null, 4]), 3)); // 1
console.log(countPairsBruteForce(makeTree([1, 2, 3, 4, 5, 6, 7]), 3)); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                          | Pattern        | Difficulty |
| ---------------------------------------------------------------------------------------------------------------- | -------------- | ---------- |
| [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree)                                 | DFS post-order | Easy       |
| [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | DFS            | Medium     |
| [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum)                       | DFS post-order | Hard       |
| [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree)         | BFS from node  | Medium     |
