---
layout: page
title: "Symmetric Tree"
difficulty: Easy
category: Tree/Graph
tags: [Tree, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/symmetric-tree/"
---

# Symmetric Tree / Cây Đối Xứng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS / Mirror Comparison
> **Frequency**: ⭐ Tier 2 — Gặp ~50% interviews vòng junior/mid
> **See also**: [Same Tree](https://leetcode.com/problems/same-tree/) | [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đứng trước gương — tay trái của bạn là tay phải của bản phản chiếu. Kiểm tra cây đối xứng cũng vậy: không so sánh `left.left` với `right.left`, mà phải so sánh **chéo** `left.left ↔ right.right` và `left.right ↔ right.left`.

**Pattern Recognition:**

- Signal: "mirror of itself", "symmetric around its center" → **DFS với cặp nodes đối xứng**
- So sánh chéo (cross-comparison): nhánh trái-trái ↔ nhánh phải-phải
- Base case: cả hai null → true; chỉ một null → false; giá trị khác nhau → false

**Visual — DFS Mirror Check:**

```
Input: [1, 2, 2, 3, 4, 4, 3]
        1
      /   \
     2     2
    / \   / \
   3   4 4   3

isMirror(L=2, R=2): 2==2 ✓
  isMirror(L.left=3, R.right=3): 3==3 ✓ → true
  isMirror(L.right=4, R.left=4): 4==4 ✓ → true
→ true ✅

Input: [1, 2, 2, null, 3, null, 3]
        1
      /   \
     2     2
      \     \
       3     3

isMirror(L=2, R=2): 2==2 ✓
  isMirror(L.left=null, R.right=null): → true
  isMirror(L.right=3,   R.left=null):  → false ❌
```

---

## Problem Description

Given the root of a binary tree, check whether it is a mirror of itself (symmetric around its center).

```
Example 1: root = [1,2,2,3,4,4,3]        → true
Example 2: root = [1,2,2,null,3,null,3]   → false
Example 3: root = [1]                      → true
```

Constraints:

- Number of nodes: [1, 1000]
- -100 <= Node.val <= 100

---

## 📝 Interview Tips

1. **Clarify**: Does a single-node tree count as symmetric? (Yes.) What about null root? / Cây 1 node có đối xứng không? (Có.)
2. **Approach**: "I'll compare the left and right subtrees as mirrors using cross-comparison — left.left vs right.right, left.right vs right.left" / So sánh chéo, không phải thẳng
3. **Brute force**: Serialize entire tree to an array and check palindrome — but handling nulls is tricky / Serialize rồi check palindrome, khó xử lý null
4. **Optimize**: Recursive DFS is already O(n) — key insight is the cross-comparison, not sequential / Đệ quy đã O(n), insight chính là so sánh chéo
5. **Edge cases**: Two nodes with same value but one is left-child, one is right-child are NOT symmetric / Cùng giá trị nhưng vị trí khác nhau = không đối xứng

---

## Solutions

```typescript

// Note: TreeNode class is provided by LeetCode environment

/**

- Solution 1: Recursive DFS (Optimal — interview standard)
- Time: O(n) — visit each node once
- Space: O(h) — recursion stack depth equals tree height
  */
  function isSymmetric(root: TreeNode | null): boolean {
  function isMirror(left: TreeNode | null, right: TreeNode | null): boolean {
  if (!left && !right) return true;
  if (!left || !right) return false;
  return (
  left.val === right.val &&
  isMirror(left.left, right.right) && // cross-comparison
  isMirror(left.right, right.left)
  );
  }
  return isMirror(root?.left ?? null, root?.right ?? null);
  }

/**

- Solution 2: Iterative BFS with Queue (Non-recursive alternative)
- Time: O(n) — visit each node once
- Space: O(n) — queue holds up to n/2 node pairs at peak
  */
  function isSymmetricIterative(root: TreeNode | null): boolean {
  if (!root) return true;
  const queue: [TreeNode | null, TreeNode | null][] = [[root.left, root.right]];
  while (queue.length > 0) {
  const [left, right] = queue.shift()!;
  if (!left && !right) continue;
  if (!left || !right || left.val !== right.val) return false;
  queue.push([left.left, right.right]);
  queue.push([left.right, right.left]);
  }
  return true;
  }

// === Test Cases ===
const sym = new TreeNode(1,
new TreeNode(2, new TreeNode(3), new TreeNode(4)),
new TreeNode(2, new TreeNode(4), new TreeNode(3))
);
console.log(isSymmetric(sym)); // true ✅
console.log(isSymmetric(null)); // true ✅
console.log(isSymmetric(new TreeNode(1))); // true ✅

const asym = new TreeNode(1,
new TreeNode(2, null, new TreeNode(3)),
new TreeNode(2, null, new TreeNode(3))
);
console.log(isSymmetricIterative(asym)); // false ✅

```

---

## 🔗 Related Problems

- [Same Tree](https://leetcode.com/problems/same-tree/) — identical cross-comparison DFS logic, simpler variant
- [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/) — mirror tree manipulation
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) — BFS on trees prerequisite
- [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) — basic DFS tree traversal
