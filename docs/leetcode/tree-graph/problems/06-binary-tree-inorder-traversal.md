---
layout: page
title: "Binary Tree Inorder Traversal"
difficulty: Easy
category: Tree/Graph
tags: [Tree, Depth-First Search, Stack]
leetcode_url: "https://leetcode.com/problems/binary-tree-inorder-traversal/"
---

# Binary Tree Inorder Traversal / Duyệt Cây Nhị Phân Theo Thứ Tự Giữa

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS Inorder / Stack Simulation
> **Frequency**: 📘 Tier 1 — Nền tảng bắt buộc, hầu như mọi vòng phỏng vấn tree đều hỏi
> **See also**: [Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/) | [Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như đọc sách theo thứ tự từ điển — đi hết sang trái, ghi lại vị trí đang đứng, rồi sang phải. Điều đặc biệt: inorder traversal của một BST luôn cho ra mảng đã sắp xếp tăng dần. Đây là thuộc tính cốt lõi của BST.

**Pattern Recognition:**

- Signal: "inorder traversal" → **Left → Root → Right**, duyệt theo thứ tự tăng dần với BST
- Iterative version: push hết các nút trái vào stack, pop xử lý, rồi chuyển sang phải
- Morris traversal: không dùng stack, tạo link tạm sang predecessor để quay lại

**Visual — Inorder trên cây [1,null,2,3]:**

```
    1
     \
      2
     /
    3

Recursive trace:
  inorder(1) → inorder(null) + visit(1) + inorder(2)
  inorder(2) → inorder(3) + visit(2) + inorder(null)
  inorder(3) → visit(3)

Output: [1, 3, 2]   (Left → Root → Right at each node)

Iterative trace (stack):
  push 1 → push nothing (no left) → pop 1 → result=[1] → move to 1.right=2
  push 2 → push 3 (2's left) → pop 3 → result=[1,3] → move to 3.right=null
  pop 2 → result=[1,3,2] → done ✅
```

---

## Problem Description

Given the root of a binary tree, return the **inorder traversal** (left → root → right) of its nodes' values.

```
Example 1: root = [1,null,2,3]  → [1,3,2]
Example 2: root = []             → []
Example 3: root = [1]            → [1]
```

---

## 📝 Interview Tips

1. **Clarify**: Regular binary tree hay BST? Inorder của BST cho mảng sorted — có thể là bẫy / BST inorder = sorted array.
2. **Recursive first**: Viết recursive trước để confirm logic, sau đó convert sang iterative nếu interviewer yêu cầu.
3. **Iterative pattern**: "Push all lefts → pop and record → move right" — đây là template cho stack-based inorder.
4. **Morris traversal**: O(1) space bằng cách tạo link từ predecessor về current; xóa link sau khi visit — tricky nhưng impressive.
5. **Edge cases**: null root → []; single node → [node.val]; right-skewed tree → stack chỉ có 1 phần tử mỗi lần.
6. **Complexity**: Recursive: O(n) time, O(h) space; Iterative: O(n) time, O(n) space; Morris: O(n) time, O(1) space.

---

## Solutions

{% raw %}
// Note: TreeNode class is provided by LeetCode environment

// Solution 1: Recursive DFS (Most readable — establish logic first)
// Time: O(n) — visit every node once
// Space: O(h) — call stack depth equals tree height; O(n) worst case skewed tree
function inorderTraversal(root: TreeNode | null): number[] {
const result: number[] = [];
function dfs(node: TreeNode | null): void {
if (!node) return;
dfs(node.left);
result.push(node.val);
dfs(node.right);
}
dfs(root);
return result;
}

// Solution 2: Iterative with Stack (Interview standard — avoids recursion)
// Time: O(n) — visit every node once
// Space: O(n) — stack holds at most h nodes at a time (h = tree height)
function inorderTraversalIterative(root: TreeNode | null): number[] {
const result: number[] = [];
const stack: TreeNode[] = [];
let curr: TreeNode | null = root;
while (curr || stack.length > 0) {
while (curr) { // push all left nodes
stack.push(curr);
curr = curr.left;
}
curr = stack.pop()!; // process node
result.push(curr.val);
curr = curr.right; // move to right subtree
}
return result;
}

// Solution 3: Morris Traversal (Advanced — O(1) space, no stack/recursion)
// Time: O(n) — each edge traversed at most 3 times
// Space: O(1) — modifies tree temporarily, restores on exit
function inorderTraversalMorris(root: TreeNode | null): number[] {
const result: number[] = [];
let curr: TreeNode | null = root;
while (curr) {
if (!curr.left) {
result.push(curr.val); // no left child → visit and move right
curr = curr.right;
} else {
let pred = curr.left;
while (pred.right && pred.right !== curr) pred = pred.right; // find inorder predecessor
if (!pred.right) {
pred.right = curr; // create temporary thread back
curr = curr.left;
} else {
pred.right = null; // restore tree structure
result.push(curr.val);
curr = curr.right;
}
}
}
return result;
}

// === Test Cases ===
// Build [1,null,2,3] manually for testing
const t1 = new TreeNode(1, null, new TreeNode(2, new TreeNode(3)));
console.log(inorderTraversal(t1)); // [1,3,2] ✅
console.log(inorderTraversalIterative(t1));// [1,3,2] ✅
console.log(inorderTraversalMorris(new TreeNode(1, null, new TreeNode(2, new TreeNode(3))))); // [1,3,2] ✅
console.log(inorderTraversal(null)); // [] ✅
{% endraw %}

---

## 🔗 Related Problems

- [Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/) — same stack pattern, visit root before left
- [Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/) — visit after both children
- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) — uses inorder property (sorted) to validate BST
- [Kth Smallest Element in BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) — inorder traversal stopped early at k-th element
