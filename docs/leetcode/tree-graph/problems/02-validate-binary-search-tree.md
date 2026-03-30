---
layout: page
title: "Validate Binary Search Tree"
difficulty: Medium
category: Tree/Graph
tags: [Tree, DFS, BST, Inorder]
leetcode_url: "https://leetcode.com/problems/validate-binary-search-tree/"
---

# Validate Binary Search Tree / Kiểm Tra Cây Tìm Kiếm Nhị Phân Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS (In-order)
> **Frequency**: 🔥 Tier 1 — câu hỏi kinh điển về BST trong mọi vòng phỏng vấn
> **See also**: [Max Depth](./01-maximum-depth-of-binary-tree.md) | [Kth Smallest in BST](./10-kth-smallest-element-in-a-bst.md) | [Inorder Successor](./11-inorder-successor-in-bst.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ đến việc kiểm tra danh sách điện thoại: nếu đọc từ trái sang phải, tên phải luôn tăng dần theo thứ tự ABC. BST hợp lệ cũng vậy — duyệt in-order (trái → gốc → phải) phải cho ra dãy số tăng dần. Nếu thấy số nào không lớn hơn số trước, cây không hợp lệ.

**Pattern Recognition:**

- Signal: "BST hợp lệ?" → **DFS in-order, theo dõi giá trị trước (prev)**
- Sai lầm phổ biến: chỉ so sánh con trực tiếp với cha. Node [5,4,6,null,null,3,7] — node 3 bé hơn 5 nhưng nằm bên phải 5.
- Cần truyền range [min, max] xuống từng node → solution 1 (range) hoặc dùng in-order + prev → solution 2

**Visual — In-order trên cây [5,1,4,null,null,3,6] (invalid):**

```
       5
      / \
     1   4      ← 4 < 5 nhưng ở nhánh phải → sai!
        / \
       3   6

In-order: 1 → 5 → 3 → 6
                  ↑
              3 < 5 = prev → return false ✓
```

---

## Problem Description

Given the root of a binary tree, determine if it is a valid BST. A valid BST requires: left subtree nodes < node < right subtree nodes (all nodes, not just direct children), and both subtrees are also valid BSTs.

```
Example 1: root = [2,1,3]                   → true
Example 2: root = [5,1,4,null,null,3,6]     → false  (4 is in right but 4 < 5)
```

Constraints:

- 0 <= number of nodes <= 10⁴
- -2³¹ <= Node.val <= 2³¹ - 1

---

## 📝 Interview Tips

1. **Clarify**: "Duplicates allowed?" / "BST có cho phép giá trị bằng nhau không?" (thường là không)
2. **Brute force**: Thu thập tất cả giá trị in-order vào array, rồi kiểm tra tăng dần — O(n) time, O(n) space
3. **Optimize**: Duyệt in-order và theo dõi `prev` — O(n) time, O(h) space, không cần array
4. **Edge cases**: Node với `val = INT_MIN` hay `INT_MAX` / dùng `null` thay số để tránh overflow
5. **Follow-up**: "Nếu cần tìm node sai thì sao?" — trả về node đó thay vì boolean

---

## Solutions

{% raw %}

interface TreeNode {
val: number;
left: TreeNode | null;
right: TreeNode | null;
}

/\*\*

- Solution 1: Recursive with Range (Brute Force style)
- Time: O(n) — visit every node once
- Space: O(h) — recursion stack depth = tree height
- Intuition: pass valid range [min, max] to each node
  \*/
  function isValidBSTRange(root: TreeNode | null): boolean {
  function validate(node: TreeNode | null, min: number | null, max: number | null): boolean {
  if (!node) return true;
  if (min !== null && node.val <= min) return false;
  if (max !== null && node.val >= max) return false;
  return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, null, null);
  }

/\*\*

- Solution 2: In-order with prev pointer (Optimal)
- Time: O(n) — visit every node once
- Space: O(h) — recursion stack; no extra array needed
- Intuition: valid BST ↔ in-order yields strictly increasing sequence
  \*/
  function isValidBST(root: TreeNode | null): boolean {
  let prev: number | null = null;

function inorder(node: TreeNode | null): boolean {
if (!node) return true;
if (!inorder(node.left)) return false; // check left subtree
if (prev !== null && node.val <= prev) return false; // check order
prev = node.val;
return inorder(node.right); // check right subtree
}

return inorder(root);
}

// === Test Cases ===
// [2,1,3] → true
const t1: TreeNode = {
val: 2,
left: { val: 1, left: null, right: null },
right: { val: 3, left: null, right: null },
};
console.log(isValidBST(t1)); // true

// [5,1,4,null,null,3,6] → false
const t2: TreeNode = {
val: 5,
left: { val: 1, left: null, right: null },
right: {
val: 4,
left: { val: 3, left: null, right: null },
right: { val: 6, left: null, right: null },
},
};
console.log(isValidBST(t2)); // false

{% endraw %}

---

## 🔗 Related Problems

- [Maximum Depth of Binary Tree](./01-maximum-depth-of-binary-tree.md) — DFS cơ bản trên cây
- [Kth Smallest Element in BST](./10-kth-smallest-element-in-a-bst.md) — in-order traversal tương tự
- [Inorder Successor in BST](./11-inorder-successor-in-bst.md) — cùng khai thác tính chất in-order BST
