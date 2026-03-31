---
layout: page
title: "Inorder Successor in BST"
difficulty: Medium
category: Tree/Graph
tags: [Tree, Binary Search Tree, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/inorder-successor-in-bst/"
---

# Inorder Successor in BST / Phần Tử Kế Tiếp Trong BST Theo Thứ Tự Inorder

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BST Property Search
> **Frequency**: 📘 Tier 3 — Gặp ~25% interviews, hay bị hỏi tại Microsoft/Amazon vòng mid-senior
> **See also**: [Inorder Predecessor in BST](https://leetcode.com/problems/inorder-predecessor-in-bst/) | [Kth Smallest Element in BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như tìm người đứng ngay sau bạn trong hàng xếp theo chiều cao. Có hai trường hợp: (1) Nếu bạn có "nhóm đứng sau lưng" (nhánh phải), người thấp nhất trong nhóm đó là người kế tiếp. (2) Nếu không có nhóm, người kế tiếp là người cha/bà đầu tiên mà bạn đứng về phía trái của họ.

**Pattern Recognition:**

- Signal: "BST + inorder successor/predecessor" → **BST property, không cần full traversal**
- Case 1: node có right child → successor = `leftmost node in right subtree`
- Case 2: node không có right child → đi từ root, lần theo BST, ghi lại ancestor "went left"

**Visual — Tìm successor của node 4 trong BST:**

```
        5
       / \
      3   6
     / \
    2   4
   /
  1

Inorder: [1, 2, 3, 4, 5, 6]

Successor of 4 = 5 (next in inorder)

Case analysis for node 4:
  node 4 has NO right child
  Walk from root (5):
    5 > 4 → potential successor = 5, go left
    3 < 4 → go right
    4 == p → stop
  Answer: 5 ✅

Successor of 3:
  node 3 HAS right child (4)
  leftmost of right subtree = 4 (no left child)
  Answer: 4 ✅
```

---

## Problem Description

Given the root of a BST and a node `p` in it, return the **inorder successor** of `p` (the node with the smallest key greater than `p.val`). Return `null` if no successor exists.

```
Example 1: root = [2,1,3], p = 1  → node with val 2
Example 2: root = [5,3,6,2,4], p = 6  → null  (6 is the maximum)
```

---

## 📝 Interview Tips

1. **Clarify**: "Inorder successor" = smallest value greater than p.val in BST — không phải parent hay right child trực tiếp.
2. **BST property**: Tận dụng BST để đi O(h) thay vì O(n) full traversal. Đây là điểm phân biệt giải tốt/kém.
3. **Two cases**: (1) p has right child → go leftmost in right subtree. (2) No right child → walk from root, track last "went left" ancestor.
4. **Without right subtree access**: Nếu bài cho `p` nhưng không expose `.right`, dùng iterative inorder traversal với stack.
5. **Time/Space**: BST property approach: O(h) time, O(1) space — optimal. Inorder traversal: O(n) time, O(h) space.
6. **Follow-up**: Predecessor là mirror: leftmost khi có left child, hoặc last "went right" ancestor.

---

## Solutions

```typescript
// Note: TreeNode class is provided by LeetCode environment

// Solution 1: BST Property — O(h) time, O(1) space (Optimal)
// Time: O(h) — traverse from root to target, h = tree height
// Space: O(1) — only pointer variables, no extra data structures
function inorderSuccessor(root: TreeNode | null, p: TreeNode): TreeNode | null {
let successor: TreeNode | null = null;
let curr = root;
while (curr) {
if (p.val < curr.val) {
successor = curr; // curr could be successor — go left to find closer one
curr = curr.left;
} else {
curr = curr.right; // p is in right subtree, curr cannot be successor
}
}
return successor;
}

// Solution 2: Iterative Inorder Traversal (General — works without BST assumption)
// Time: O(n) — worst case visit all nodes before finding successor
// Space: O(h) — stack holds nodes along path to leftmost
function inorderSuccessorGeneral(root: TreeNode | null, p: TreeNode): TreeNode | null {
const stack: TreeNode[] = [];
let curr: TreeNode | null = root;
let prev: TreeNode | null = null;
while (curr || stack.length > 0) {
while (curr) {
stack.push(curr);
curr = curr.left;
}
curr = stack.pop()!;
if (prev === p) return curr; // previous node was p → current is successor
prev = curr;
curr = curr.right;
}
return null;
}

// === Test Cases ===
// Build BST: [5,3,6,2,4,null,null,1]
const bst = new TreeNode(5,
new TreeNode(3, new TreeNode(2, new TreeNode(1)), new TreeNode(4)),
new TreeNode(6)
);
const p3 = bst.left!; // node with val=3
const p4 = bst.left!.right!; // node with val=4
const p6 = bst.right!; // node with val=6 (max)

console.log(inorderSuccessor(bst, p3)?.val); // 4 ✅ (leftmost in right subtree of 3)
console.log(inorderSuccessor(bst, p4)?.val); // 5 ✅ (first ancestor where we went left)
console.log(inorderSuccessor(bst, p6)); // null ✅ (no successor for max node)
```

---

## 🔗 Related Problems

- [Inorder Predecessor in BST](https://leetcode.com/problems/inorder-predecessor-in-bst/) — mirror problem: largest value less than p.val
- [Kth Smallest Element in BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) — inorder traversal stopped at k, same traversal foundation
- [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator/) — implements hasNext/next using inorder traversal lazily
- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) — uses BST property (all left < root < all right)
