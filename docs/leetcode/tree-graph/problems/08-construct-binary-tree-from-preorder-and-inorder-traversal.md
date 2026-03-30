---
layout: page
title: "Construct Binary Tree from Preorder and Inorder Traversal"
difficulty: Medium
category: Tree/Graph
tags: [Tree, Array, Hash Table, Divide and Conquer]
leetcode_url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/"
---

# Construct Binary Tree from Preorder and Inorder Traversal / Tái Tạo Cây Nhị Phân từ Preorder và Inorder

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Divide and Conquer + HashMap
> **Frequency**: 📘 Tier 2 — Câu hỏi yêu thích của Amazon/Google/Meta, thường xuất hiện sau bài traversal
> **See also**: [Construct BT from Inorder and Postorder](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/) | [Serialize and Deserialize BT](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như tái tạo bản đồ kho báu từ hai manh mối: preorder nói "X là điểm xuất phát" (root), inorder nói "X chia hành trình thành nhánh trái và nhánh phải". Lấy root từ preorder → dùng hashmap tìm vị trí trong inorder → kích thước nhánh trái = số phần tử bên trái X trong inorder.

**Pattern Recognition:**

- Signal: preorder + inorder given → **reconstruct tree uniquely**
- `preorder[0]` luôn là root; tìm root trong inorder → biết kích thước subtree trái/phải
- Dùng HashMap: `val → index in inorder` để tìm O(1) thay vì O(n) với `indexOf`

**Visual — Tái tạo từ preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]:**

```
preorder: [3, 9, 20, 15, 7]   ← first element = root
inorder:  [9, 3, 15, 20, 7]   ← root splits array

Step 1: root = 3 (preorder[0])
  inorder: [9 | 3 | 15,20,7] → left size=1, right size=3

Step 2L: root = 9 (preorder[1]), no children → leaf
Step 2R: root = 20 (preorder[2])
  inorder: [15 | 20 | 7] → left size=1, right size=1

Step 3:   root=15, root=7 → leaves

Result:
        3
       / \
      9   20
         /  \
        15    7
```

---

## Problem Description

Given `preorder` and `inorder` traversal arrays of the same binary tree (all values unique), reconstruct and return the binary tree.

```
Example 1: preorder=[3,9,20,15,7], inorder=[9,3,15,20,7] → [3,9,20,null,null,15,7]
Example 2: preorder=[−1], inorder=[−1]                    → [−1]
```

---

## 📝 Interview Tips

1. **Key insight**: `preorder[0]` = root; root's index in inorder splits left/right subtrees — explain this before coding.
2. **HashMap optimization**: Without hashmap, `indexOf` per call = O(n²) total. HashMap → O(n) overall. Mention upfront.
3. **Index tracking**: Use a `preorderIdx` pointer (not slice) to avoid O(n) array copy overhead.
4. **Constraints check**: "All values unique" — critical for this approach to work. If duplicates allowed, approach changes.
5. **Edge cases**: Single node — preorder=[x], inorder=[x]; right-skewed tree — inorder index always at position 0.
6. **Iterative version**: Stack-based iterative exists but harder to explain; recursive is preferred in interviews.

---

## Solutions

{% raw %}
// Note: TreeNode class is provided by LeetCode environment

// Solution 1: HashMap + Index-based Recursion (Optimal — O(n))
// Time: O(n) — each node created once, O(1) lookup via map
// Space: O(n) — hashmap + recursion stack (O(h) stack, O(n) map)
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
const inorderMap = new Map<number, number>();
for (let i = 0; i < inorder.length; i++) {
inorderMap.set(inorder[i], i);
}
let preIdx = 0;
function build(left: number, right: number): TreeNode | null {
if (left > right) return null;
const rootVal = preorder[preIdx++];
const root = new TreeNode(rootVal);
const mid = inorderMap.get(rootVal)!; // O(1) lookup
root.left = build(left, mid - 1); // build left subtree first (preorder order!)
root.right = build(mid + 1, right);
return root;
}
return build(0, inorder.length - 1);
}

// Solution 2: Array Slice (Brute Force — O(n²), easier to understand)
// Time: O(n²) — indexOf + slice inside each call = O(n) per level
// Space: O(n²) — new arrays created at each level (interview: mention as suboptimal)
function buildTreeSlice(preorder: number[], inorder: number[]): TreeNode | null {
if (!preorder.length || !inorder.length) return null;
const rootVal = preorder[0];
const root = new TreeNode(rootVal);
const mid = inorder.indexOf(rootVal); // O(n) scan — bottleneck
root.left = buildTreeSlice(preorder.slice(1, mid + 1), inorder.slice(0, mid));
root.right = buildTreeSlice(preorder.slice(mid + 1), inorder.slice(mid + 1));
return root;
}

// === Test Cases ===
const tree1 = buildTree([3,9,20,15,7], [9,3,15,20,7]);
console.log(tree1?.val); // 3 ✅ (root)
console.log(tree1?.right?.val); // 20 ✅
console.log(buildTree([-1], [-1])?.val); // -1 ✅
console.log(buildTree([], [])); // null ✅
{% endraw %}

---

## 🔗 Related Problems

- [Construct BT from Inorder and Postorder](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/) — same pattern, postorder gives root at end instead of start
- [Verify Preorder Serialization of BT](https://leetcode.com/problems/verify-preorder-serialization-of-a-binary-tree/) — validates traversal without reconstruction
- [Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/) — understanding inorder is prerequisite
- [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) — generalization: any tree → string → tree
