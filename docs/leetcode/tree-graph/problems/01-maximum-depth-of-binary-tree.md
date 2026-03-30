---
layout: page
title: "Maximum Depth of Binary Tree"
difficulty: Easy
category: Tree/Graph
tags: [Tree, DFS, BFS, Recursion]
leetcode_url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/"
---

# Maximum Depth of Binary Tree / Độ Sâu Tối Đa Của Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS (Recursion)
> **Frequency**: 🔥 Tier 1 — xuất hiện thường xuyên trong vòng phone screen
> **See also**: [Symmetric Tree](./04-symmetric-tree.md) | [Validate BST](./02-validate-binary-search-tree.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đứng trước tòa nhà và đếm số tầng cao nhất. Bạn không cần đếm hết mọi phòng — chỉ cần đi theo nhánh cao nhất từ tầng trệt lên mái. Cây nhị phân cũng vậy: độ sâu = số bước từ gốc đến lá xa nhất.

**Pattern Recognition:**

- Signal: "độ sâu / chiều cao cây" → **DFS đệ quy, trả về 1 + max(trái, phải)**
- Bài toán chia nhỏ tự nhiên: depth(node) = 1 + max(depth(left), depth(right))
- Base case: node null → trả 0

**Visual — DFS trên cây [3,9,20,null,null,15,7]:**

```
        3          ← depth 1
       / \
      9  20        ← depth 2
        /  \
       15   7      ← depth 3  ✓ max = 3

maxDepth(3) = 1 + max(maxDepth(9), maxDepth(20))
            = 1 + max(1, 2)
            = 3
```

---

## Problem Description

Given the root of a binary tree, return its maximum depth — the number of nodes along the longest path from root to the farthest leaf.

```
Example 1: root = [3,9,20,null,null,15,7] → 3
Example 2: root = [1,null,2]             → 2
```

Constraints:

- 0 <= number of nodes <= 10⁴
- -100 <= Node.val <= 100

---

## 📝 Interview Tips

1. **Clarify**: "Depth = number of nodes or edges?" / "Độ sâu tính theo số node hay cạnh?"
2. **Brute force**: BFS đếm từng level — O(n) time, O(w) space (w = width)
3. **Optimize**: DFS đệ quy — cùng O(n) nhưng code gọn hơn, O(h) stack space
4. **Edge cases**: empty tree → 0; single node → 1 / cây rỗng hoặc chỉ có root
5. **Follow-up**: "Min depth?" thì khác — không thể dùng max, phải xử lý nhánh null

---

## Solutions

{% raw %}

interface TreeNode {
val: number;
left: TreeNode | null;
right: TreeNode | null;
}

/\*\*

- Solution 1: BFS Level Count (Iterative)
- Time: O(n) — visit every node once
- Space: O(w) — queue holds at most one full level (width w)
  \*/
  function maxDepthBFS(root: TreeNode | null): number {
  if (!root) return 0;

const queue: TreeNode[] = [root];
let depth = 0;

while (queue.length > 0) {
const levelSize = queue.length;
depth++;

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

}

return depth;
}

/\*\*

- Solution 2: DFS Recursive (Optimal)
- Time: O(n) — visit every node once
- Space: O(h) — recursion stack = tree height (O(log n) balanced, O(n) skewed)
  \*/
  function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
  }

// === Test Cases ===
// Assume helper builds tree from level-order array
// maxDepth([3,9,20,null,null,15,7]) → 3
// maxDepth([1,null,2]) → 2
// maxDepth([]) → 0
console.log(maxDepth(null)); // 0
// Build tree manually: root=3, left=9, right=20, right.left=15, right.right=7
const root: TreeNode = {
val: 3,
left: { val: 9, left: null, right: null },
right: {
val: 20,
left: { val: 15, left: null, right: null },
right: { val: 7, left: null, right: null },
},
};
console.log(maxDepth(root)); // 3

{% endraw %}

---

## 🔗 Related Problems

- [Symmetric Tree](./04-symmetric-tree.md) — cùng dùng DFS đệ quy trên cây
- [Binary Tree Level Order Traversal](./03-binary-tree-level-order-traversal.md) — BFS theo từng level
- [Validate BST](./02-validate-binary-search-tree.md) — DFS với điều kiện thêm
