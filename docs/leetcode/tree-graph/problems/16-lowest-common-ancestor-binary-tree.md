---
layout: page
title: "Lowest Common Ancestor of a Binary Tree"
difficulty: Medium
category: Tree/Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/"
---

# Lowest Common Ancestor of a Binary Tree / Tổ Tiên Chung Thấp Nhất của Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Post-order DFS (bottom-up)
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Course Schedule II](./15-course-schedule-ii.md) | [LCA of BST](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đang tìm ông tổ chung của hai người trong gia phả. Bạn theo dõi dòng dõi từ mỗi người lên đến tổ tiên — người đầu tiên xuất hiện trong cả hai dòng dõi chính là ông tổ chung gần nhất. Trong cây nhị phân, ta "báo cáo lên" từ lá: nếu nhánh trái tìm thấy p và nhánh phải tìm thấy q, thì node hiện tại chính là LCA.

**Pattern Recognition:**

- Signal: "find deepest node that has both p and q as descendants" → **Post-order DFS**
- Post-order vì ta cần kết quả từ hai con trước khi quyết định tại cha
- If `left && right` both non-null → current node is the LCA (p and q split here)

**Visual — LCA(5, 4) in tree [3,5,1,6,2,0,8,null,null,7,4]:**

```
         3
        / \
       5   1
      / \ / \
     6  2 0  8
       / \
      7   4

dfs(3) → calls dfs(5) then dfs(1)
  dfs(5): found node(5)=p → returns node(5) immediately ← p found here
    dfs(2): calls dfs(7)→null, dfs(4)→node(4)=q ✅
  dfs(5): left=null, right=node(4), but node(5)===p → returns node(5)
  dfs(1): neither p nor q in subtree → returns null
dfs(3): left=node(5), right=null → returns node(5) ✅ LCA
```

---

## Problem Description

Given a binary tree, find the lowest common ancestor (LCA) of two nodes p and q. The LCA is the deepest node that has both p and q as descendants (a node can be a descendant of itself).

```
Example 1: root=[3,5,1,6,2,0,8,null,null,7,4], p=5, q=1 → 3
Example 2: root=[3,5,1,6,2,0,8,null,null,7,4], p=5, q=4 → 5
Example 3: root=[1,2], p=1, q=2 → 1
```

Constraints:

- 2 <= number of nodes <= 10^5
- All Node.val are unique; p != q
- Both p and q are guaranteed to exist in the tree

---

## 📝 Interview Tips

1. **Clarify**: Are p and q guaranteed to exist? / VI: "Cả hai node có chắc chắn tồn tại trong cây không? Node có thể là tổ tiên của chính nó không?"
2. **Brute force**: Path tracking — find root→p and root→q paths, return last common node / VI: Tìm đường từ root đến p và q, so sánh từng bước để tìm điểm rẽ
3. **Optimize**: Single-pass post-order DFS — return node when found, if both children return non-null → LCA / VI: Một lần DFS: trả về non-null khi gặp p hoặc q; nếu cả hai con đều non-null thì node hiện tại là LCA
4. **Edge cases**: One node is ancestor of the other (p=5, q=4 → LCA=5 because we return p immediately) / VI: Khi gặp p thì trả về ngay, không cần tìm tiếp vì q chắc chắn ở trong subtree của p
5. **Follow-up**: What if it's a BST? / VI: Nếu là BST có thể dùng ordering property để đạt O(log n)

---

## Solutions

{% raw %}

class TreeNode {
val: number;
left: TreeNode | null;
right: TreeNode | null;
constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
this.val = val; this.left = left; this.right = right;
}
}

/\*\*

- Solution 1: Path Tracking (Brute Force)
- Time: O(n) — two full traversals to find paths
- Space: O(h) — path arrays, h = tree height
  \*/
  function lowestCommonAncestorBrute(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  function findPath(node: TreeNode | null, target: TreeNode, path: TreeNode[]): boolean {
  if (!node) return false;
  path.push(node);
  if (node === target) return true;
  if (findPath(node.left, target, path) || findPath(node.right, target, path)) return true;
  path.pop();
  return false;
  }

const pathP: TreeNode[] = [], pathQ: TreeNode[] = [];
findPath(root, p, pathP);
findPath(root, q, pathQ);

let lca: TreeNode | null = null;
for (let i = 0; i < Math.min(pathP.length, pathQ.length); i++) {
if (pathP[i] === pathQ[i]) lca = pathP[i];
else break;
}
return lca;
}

/\*\*

- Solution 2: Recursive Post-order DFS (Optimal)
- Time: O(n) — single traversal, each node visited once
- Space: O(h) — recursion stack depth equals tree height
  \*/
  function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
  if (!root) return null;
  if (root === p || root === q) return root; // found one target — return it up

const left = lowestCommonAncestor(root.left, p, q);
const right = lowestCommonAncestor(root.right, p, q);

if (left && right) return root; // p in left subtree, q in right → root is LCA
return left || right; // pass up whichever side found something
}

// === Test Cases ===
// Tree: [3,5,1,6,2,0,8,null,null,7,4]
// lowestCommonAncestor(root, node(5), node(1)) → node(3)
// lowestCommonAncestor(root, node(5), node(4)) → node(5)
// lowestCommonAncestor(root, node(6), node(4)) → node(5)
// lowestCommonAncestor(root, node(0), node(8)) → node(1)

{% endraw %}

---

## 🔗 Related Problems

- [LCA of a BST](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) — same problem with BST ordering, O(log n) possible
- [Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths/) — path tracking in tree, same DFS pattern
- [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) — post-order DFS returning info upward
- [Course Schedule II](./15-course-schedule-ii.md) — graph DFS with state tracking
