---
layout: page
title: "Construct Binary Tree from Inorder and Postorder Traversal"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, Divide and Conquer, Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal"
---

# Construct Binary Tree from Inorder and Postorder Traversal / Xây Dựng Cây Nhị Phân Từ Duyệt Trung Và Hậu Tự

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Divide & Conquer with Index Map
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Construct Binary Tree from Preorder and Inorder](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal) | [Verify Preorder Sequence in BST](https://leetcode.com/problems/verify-preorder-sequence-in-binary-search-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy (VI):** Phần tử cuối của postorder là **root**. Tìm root trong inorder → chia left/right subtrees. Số phần tử bên trái inorder = kích thước left subtree → chia postorder tương ứng.

**Analogy (EN):** Last element of `postorder` = root. Find root index `k` in `inorder` → left subtree has `k` nodes. Recurse: left subtree uses `inorder[0..k-1]` and `postorder[0..k-1]`; right uses the rest.

```
inorder:   [9, 3, 15, 20, 7]
postorder: [9, 15, 7, 20, 3]

postorder.last = 3 → root = 3
inorder: k=1 (index of 3)
  left  inorder=[9],        postorder=[9]       → node(9)
  right inorder=[15,20,7],  postorder=[15,7,20] → recurse
    postorder.last=20 → root=20
    left=[15], right=[7]

Result:
    3
   / \
  9   20
     /  \
    15    7
```

---

## 📝 Interview Tips

1. **Postorder last = root**: Luôn nhớ phần tử cuối postorder là root / Last of postorder is always the current subtree root
2. **HashMap for O(1) lookup**: Xây map `value→index` trong inorder để tìm root nhanh / Build inorder index map upfront for O(1) root lookup
3. **Split sizes**: `leftSize = k` → left postorder = `[pStart, pStart+k-1]`; right = `[pStart+k, pEnd-1]` / Track boundary indices carefully
4. **Naive vs optimized**: Naive O(N²) dùng indexOf; optimal O(N) dùng HashMap / Use HashMap to avoid O(N) indexOf per call
5. **Edge case / Biên**: Empty arrays → return null; single element → leaf node
6. **Sister problem**: Preorder + Inorder is similar — first of preorder is root / Same pattern, just use first element of preorder

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
 * Solution 1: Recursive with HashMap (Optimal)
 * Time: O(N) — each node processed once; O(1) root lookup via map
 * Space: O(N) — hashmap + recursion stack O(H)
 *
 * Build inorder index map. Slice postorder by subtree size.
 */
function buildTree(inorder: number[], postorder: number[]): TreeNode | null {
  const indexMap = new Map<number, number>();
  inorder.forEach((val, i) => indexMap.set(val, i));

  function build(
    inLeft: number,
    inRight: number,
    postLeft: number,
    postRight: number,
  ): TreeNode | null {
    if (inLeft > inRight) return null;

    const rootVal = postorder[postRight];
    const root = new TreeNode(rootVal);
    const k = indexMap.get(rootVal)! - inLeft; // size of left subtree

    root.left = build(inLeft, inLeft + k - 1, postLeft, postLeft + k - 1);
    root.right = build(inLeft + k + 1, inRight, postLeft + k, postRight - 1);
    return root;
  }

  return build(0, inorder.length - 1, 0, postorder.length - 1);
}

/**
 * Solution 2: Recursive with Array Slicing (Simpler, O(N²))
 * Time: O(N²) — indexOf is O(N) per call
 * Space: O(N²) — creating subarrays at each level
 *
 * Simpler to reason about — good for explaining in interview before optimizing.
 */
function buildTreeNaive(inorder: number[], postorder: number[]): TreeNode | null {
  if (postorder.length === 0) return null;

  const rootVal = postorder[postorder.length - 1];
  const root = new TreeNode(rootVal);
  const mid = inorder.indexOf(rootVal);

  root.left = buildTreeNaive(inorder.slice(0, mid), postorder.slice(0, mid));
  root.right = buildTreeNaive(inorder.slice(mid + 1), postorder.slice(mid, postorder.length - 1));
  return root;
}

// Helper to serialize tree for testing
function serialize(root: TreeNode | null): string {
  if (!root) return "null";
  return `${root.val}(${serialize(root.left)},${serialize(root.right)})`;
}

// === Test Cases ===
const t1 = buildTree([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]);
console.log(serialize(t1)); // 3(9(null,null),20(15(null,null),7(null,null)))

const t2 = buildTree([-1], [-1]);
console.log(serialize(t2)); // -1(null,null)

const t3 = buildTreeNaive([9, 3, 15, 20, 7], [9, 15, 7, 20, 3]);
console.log(serialize(t3)); // same as t1
```

---

## 🔗 Related Problems

| Problem                                                                                                                                    | Pattern           | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- | ---------- |
| [Construct Binary Tree from Preorder and Inorder](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal) | Divide & Conquer  | 🟡 Medium  |
| [Create Binary Tree From Descriptions](https://leetcode.com/problems/create-binary-tree-from-descriptions)                                 | Tree Construction | 🟡 Medium  |
| [Maximum Binary Tree](https://leetcode.com/problems/maximum-binary-tree)                                                                   | Divide & Conquer  | 🟡 Medium  |
| [Recover a Tree From Preorder Traversal](https://leetcode.com/problems/recover-a-tree-from-preorder-traversal)                             | DFS Parse         | 🔴 Hard    |
