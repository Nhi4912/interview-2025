---
layout: page
title: "Kth Smallest Element in a BST"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Binary Search Tree, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/"
---

# Kth Smallest Element in a BST / Phần Tử Nhỏ Thứ K trong BST

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: In-order Traversal
> **Frequency**: ⭐ Tier 2 — Gặp ~50% interviews
> **See also**: [Binary Tree Inorder Traversal](./06-binary-tree-inorder-traversal.md) | [Validate BST](./02-validate-binary-search-tree.md) | [Inorder Successor in BST](./11-inorder-successor-in-bst.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng BST như một cuốn từ điển đã sắp xếp sẵn theo alphabet. Duyệt inorder (trái → gốc → phải) giống đọc từ điển từ trang đầu — tự nhiên ra dãy tăng dần. Tìm "phần tử nhỏ thứ k" chỉ là đọc đến từ thứ k rồi dừng — không cần lật hết cuốn sách.

**Pattern Recognition:**

- Signal: "BST" + "kth smallest" → **In-order Traversal** (BST inorder = sorted order automatically)
- In-order traversal of any BST always yields ascending sequence — no extra sort needed
- Stop early at count=k → saves visiting O(n-k) unnecessary nodes

**Visual — tree=[5,3,6,2,4,null,null,1], k=3:**

```
        5
       / \
      3   6
     / \
    2   4
   /
  1

Inorder: 1 → 2 → 3 → 4 → 5 → 6
count:   1   2   3
                 ↑
            return 3 ✅  (stop early, skip 4, 5, 6)

Stack trace (iterative):
  push 5→3→2→1,  pop 1, count=1
  pop 2,          count=2
  pop 3,          count=3 = k → return 3 ✅
```

---

## Problem Description

Given the root of a binary search tree and integer `k`, return the **kth smallest value** (1-indexed) among all node values.

```
Example 1: root=[3,1,4,null,2], k=1                    → 1
Example 2: root=[5,3,6,2,4,null,null,1], k=3           → 3
Example 3: root=[1], k=1                               → 1
```

Constraints:

- 1 <= k <= n <= 10^4 (n = number of nodes)
- 0 <= Node.val <= 10^4

---

## 📝 Interview Tips

1. **Clarify**: Is k always valid (1 ≤ k ≤ n)? Are node values unique? / k có đảm bảo hợp lệ? Giá trị node có unique không?
2. **Brute force**: Inorder traversal → collect all values into array → return `arr[k-1]`. O(n) time + space / Thu vào mảng rồi trả index k-1.
3. **Optimize**: Iterative inorder with early exit when count reaches k. O(h+k) time, O(h) space / Stack + dừng khi đếm đủ k.
4. **Edge cases**: k=1 (leftmost node), k=n (rightmost), left-skewed tree (h=n) / k bằng 1, bằng n, cây lệch hoàn toàn.
5. **Follow-up**: If BST is modified often, augment nodes with subtree count for O(h) per query / Nếu BST thay đổi thường xuyên, thêm `count` vào mỗi node.

---

## Solutions

```typescript

class TreeNode {
constructor(
public val: number = 0,
public left: TreeNode | null = null,
public right: TreeNode | null = null
) {}
}

/**

- Solution 1: Recursive Inorder → Array (Brute Force)
- Time: O(n) — visits all nodes regardless of k
- Space: O(n) — stores all values in array
  */
  function kthSmallestBrute(root: TreeNode | null, k: number): number {
  const vals: number[] = [];

function inorder(node: TreeNode | null): void {
if (!node) return;
inorder(node.left);
vals.push(node.val);
inorder(node.right);
}

inorder(root);
return vals[k - 1];
}

/**

- Solution 2: Iterative Inorder with Early Stop (Optimal)
- Time: O(h + k) — h = tree height; stops exactly at kth element
- Space: O(h) — stack holds at most h nodes (not all n)
  */
  function kthSmallest(root: TreeNode | null, k: number): number {
  const stack: TreeNode[] = [];
  let curr = root;
  let count = 0;

while (curr || stack.length > 0) {
while (curr) { // push all left nodes to stack
stack.push(curr);
curr = curr.left;
}
curr = stack.pop()!; // process smallest remaining node
if (++count === k) return curr.val;
curr = curr.right; // explore right subtree next
}

return -1;
}

// === Test Cases ===
const root = new TreeNode(5,
new TreeNode(3, new TreeNode(2, new TreeNode(1)), new TreeNode(4)),
new TreeNode(6)
);
console.log(kthSmallest(root, 3)); // 3
console.log(kthSmallest(root, 1)); // 1
console.log(kthSmallest(new TreeNode(1), 1)); // 1
console.log(kthSmallest(new TreeNode(3, new TreeNode(1), new TreeNode(4)), 2)); // 3

```

---

## 🔗 Related Problems

- [Binary Tree Inorder Traversal](./06-binary-tree-inorder-traversal.md) — prerequisite: the exact traversal used here
- [Validate Binary Search Tree](./02-validate-binary-search-tree.md) — same BST in-order property exploited
- [Inorder Successor in BST](./11-inorder-successor-in-bst.md) — same in-order navigation pattern
- [Kth Largest Element in Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) — same "kth element" concept, different data structure
