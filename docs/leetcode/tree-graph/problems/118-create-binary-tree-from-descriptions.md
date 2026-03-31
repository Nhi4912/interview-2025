---
layout: page
title: "Create Binary Tree From Descriptions"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/create-binary-tree-from-descriptions"
---

# Create Binary Tree From Descriptions / Tạo Cây Nhị Phân Từ Mô Tả

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: HashMap Node Builder
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Construct Binary Tree from Inorder and Postorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal) | [Path Sum IV](https://leetcode.com/problems/path-sum-iv)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ như đang điền vào cây gia phả: có một danh sách mô tả "A là cha của B, B là con trái/phải". Dùng HashMap để tạo/lấy node theo value (tránh tạo trùng), dùng Set để theo dõi node nào đã là "con" — node không phải con chính là root.

**Pattern Recognition:**

- Signal: "build tree from parent-child-side descriptions" → **HashMap node builder**
- Bước 1: tạo nodes qua HashMap, gắn con vào cha
- Bước 2: root = node duy nhất không xuất hiện là child

**Visual — HashMap Build Process:**

```
descriptions = [[20,15,1],[20,17,0],[50,20,1],[50,80,0],[80,19,1]]
  [parent, child, isLeft]

Step 1: Build nodes:
  50 → left=20, right=80
  20 → left=15, right=17
  80 → left=19

HashMap: {20:Node(20), 15:Node(15), 17:Node(17), 50:Node(50), 80:Node(80), 19:Node(19)}
Children set: {15, 17, 20, 80, 19}  (appeared as child)

Step 2: Root = node NOT in children set
  50 is NOT in {15,17,20,80,19} → root = Node(50) ✓

Tree:        50
            /  \
           20   80
          / \   /
         15 17 19
```

---

## Problem Description

`descriptions[i] = [parent_i, child_i, isLeft_i]` describes one parent-child relationship where `isLeft_i=1` means child is left child, `0` means right. Build and return the **root** of the resulting binary tree. All values are distinct.

- `1 ≤ descriptions.length ≤ 10^4`, `1 ≤ values ≤ 10^5`

```
Example 1: [[20,15,1],[20,17,0],[50,20,1],[50,80,0],[80,19,1]] → root=50
  Tree: 50(left=20, right=80), 20(left=15, right=17), 80(left=19)

Example 2: [[1,2,1],[2,3,0],[3,4,1]] → root=1
  Tree: 1→left→2→right→3→left→4 (chain)
```

---

## 📝 Interview Tips

1. **HashMap lazy creation** — `getOrCreate(val)`: nếu chưa có thì tạo mới, tránh duplicate nodes / _Use HashMap to lazily create nodes — same value always maps to same node object_
2. **Children set cho root** — Root là node không bao giờ xuất hiện là child trong descriptions / _Root is the unique node never appearing as a child — track with Set_
3. **Order independence** — Mô tả có thể đến theo bất kỳ thứ tự nào; HashMap giải quyết / _Descriptions can come in any order — HashMap handles forward references_
4. **Không cần sort** — Một pass qua descriptions là đủ: O(n) / _Single pass suffices — no sorting needed, O(n)_
5. **Distinct values** — Đề đảm bảo values distinct, nên HashMap 1-to-1 / _Values are distinct, so HashMap is 1-to-1 mapping — no collision handling needed_
6. **Edge case** — Single description → tree with just parent and one child / _Single description creates a 2-node tree; root is the parent_

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
 * Solution 1: HashMap Node Builder + Children Set
 * Time: O(n) — single pass through descriptions
 * Space: O(n) — node map + children set
 * Build nodes on demand via HashMap; root = node not in children set.
 */
function createBinaryTree(descriptions: number[][]): TreeNode | null {
  const nodeMap = new Map<number, TreeNode>();
  const childSet = new Set<number>();

  function getNode(val: number): TreeNode {
    if (!nodeMap.has(val)) nodeMap.set(val, new TreeNode(val));
    return nodeMap.get(val)!;
  }

  for (const [parent, child, isLeft] of descriptions) {
    const parentNode = getNode(parent);
    const childNode = getNode(child);
    childSet.add(child); // child can't be root
    if (isLeft === 1) parentNode.left = childNode;
    else parentNode.right = childNode;
  }

  // Root is the node that never appeared as a child
  for (const [parent] of descriptions) {
    if (!childSet.has(parent)) return getNode(parent);
  }
  return null;
}

/**
 * Solution 2: Two-pass — first build all nodes, then find root
 * Time: O(n), Space: O(n)
 * Equivalent approach, slightly more explicit.
 */
function createBinaryTree2(descriptions: number[][]): TreeNode | null {
  const nodes = new Map<number, TreeNode>();
  const hasParent = new Set<number>();

  // Pass 1: create all nodes and link parent→child
  for (const [parent, child, isLeft] of descriptions) {
    if (!nodes.has(parent)) nodes.set(parent, new TreeNode(parent));
    if (!nodes.has(child)) nodes.set(child, new TreeNode(child));

    const p = nodes.get(parent)!,
      c = nodes.get(child)!;
    if (isLeft) p.left = c;
    else p.right = c;
    hasParent.add(child);
  }

  // Pass 2: find root (has no parent)
  for (const [val, node] of nodes) {
    if (!hasParent.has(val)) return node;
  }
  return null;
}

// === Test Cases ===
function treeToArray(root: TreeNode | null): (number | null)[] {
  if (!root) return [];
  const res: (number | null)[] = [];
  const q: (TreeNode | null)[] = [root];
  while (q.length) {
    const n = q.shift()!;
    if (!n) {
      res.push(null);
      continue;
    }
    res.push(n.val);
    q.push(n.left);
    q.push(n.right);
  }
  while (res[res.length - 1] === null) res.pop();
  return res;
}

const r1 = createBinaryTree([
  [20, 15, 1],
  [20, 17, 0],
  [50, 20, 1],
  [50, 80, 0],
  [80, 19, 1],
]);
console.log(r1?.val); // 50 (root)
console.log(JSON.stringify(treeToArray(r1)));
// [50,20,80,15,17,19] roughly

const r2 = createBinaryTree([
  [1, 2, 1],
  [2, 3, 0],
  [3, 4, 1],
]);
console.log(r2?.val); // 1 (root)
console.log(r2?.left?.val); // 2
console.log(r2?.left?.right?.val); // 3

const r3 = createBinaryTree2([
  [20, 15, 1],
  [20, 17, 0],
  [50, 20, 1],
  [50, 80, 0],
  [80, 19, 1],
]);
console.log(r3?.val); // 50
```

---

## 🔗 Related Problems

| Problem                                                                                                                                    | Pattern                 | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | ---------- |
| [Construct Binary Tree from Preorder and Inorder](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal) | HashMap + Recursion     | Medium     |
| [Find Duplicate Subtrees](https://leetcode.com/problems/find-duplicate-subtrees)                                                           | HashMap + Serialization | Medium     |
| [Path Sum IV](https://leetcode.com/problems/path-sum-iv)                                                                                   | HashMap node builder    | Medium     |
| [Recover a Tree From Preorder Traversal](https://leetcode.com/problems/recover-a-tree-from-preorder-traversal)                             | Tree construction       | Hard       |
