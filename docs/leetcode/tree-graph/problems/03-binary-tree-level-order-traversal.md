---
layout: page
title: "Binary Tree Level Order Traversal"
difficulty: Medium
category: Tree/Graph
tags: [Tree, BFS, Queue]
leetcode_url: "https://leetcode.com/problems/binary-tree-level-order-traversal/"
---

# Binary Tree Level Order Traversal / Duyệt Cây Nhị Phân Theo Từng Tầng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS (Queue)
> **Frequency**: 🔥 Tier 1 — nền tảng cho mọi bài BFS cây, hỏi rất thường xuyên
> **See also**: [Zigzag Level Order](./07-binary-tree-zigzag-level-order-traversal.md) | [Max Depth](./01-maximum-depth-of-binary-tree.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như điểm danh học sinh từng hàng ghế trong lớp — điểm xong hàng đầu mới sang hàng sau, từ trái qua phải. Ta dùng queue (hàng đợi) để luôn xử lý hết một tầng trước khi sang tầng tiếp theo.

**Pattern Recognition:**

- Signal: "level by level", "theo từng tầng" → **BFS với queue, snapshot levelSize**
- Chìa khóa: chụp `levelSize = queue.length` _trước vòng lặp_ để phân biệt từng tầng
- Mọi biến thể (zigzag, right view, average...) đều dùng cùng skeleton BFS này

**Visual — BFS trên cây [3,9,20,null,null,15,7]:**

```
Queue:   [3]
Level 1: dequeue 3 → enqueue 9, 20       → level = [3]
Queue:   [9, 20]
Level 2: dequeue 9 (no children),
         dequeue 20 → enqueue 15, 7      → level = [9, 20]
Queue:   [15, 7]
Level 3: dequeue 15, dequeue 7           → level = [15, 7]

Result: [[3], [9,20], [15,7]]
```

---

## Problem Description

Given the root of a binary tree, return the level-order traversal of its nodes' values — left to right, level by level.

```
Example 1: root = [3,9,20,null,null,15,7] → [[3],[9,20],[15,7]]
Example 2: root = [1]                     → [[1]]
Example 3: root = []                      → []
```

Constraints:

- 0 <= number of nodes <= 2000
- -1000 <= Node.val <= 1000

---

## 📝 Interview Tips

1. **Clarify**: "Kết quả là mảng các mảng theo từng tầng?" / "Output as array-of-arrays per level?"
2. **Brute force**: DFS với tham số `level` — ghi giá trị vào `result[level]`, O(n) time/space
3. **Optimize**: BFS với queue — trực quan hơn cho bài level-order, snapshot `levelSize` để tách tầng
4. **Edge cases**: cây rỗng → `[]`; cây chỉ có gốc → `[[root.val]]`
5. **Follow-up**: "Zigzag?" — thêm flag `leftToRight`, đảo chiều mỗi tầng; "Right side view?" — chỉ lấy phần tử cuối mỗi tầng

---

## Solutions

{% raw %}

interface TreeNode {
val: number;
left: TreeNode | null;
right: TreeNode | null;
}

/\*\*

- Solution 1: DFS with level index (Brute Force)
- Time: O(n) — visit every node once
- Space: O(n) — result array + O(h) recursion stack
  \*/
  function levelOrderDFS(root: TreeNode | null): number[][] {
  const result: number[][] = [];

function dfs(node: TreeNode | null, level: number): void {
if (!node) return;
if (level === result.length) result.push([]); // new level
result[level].push(node.val);
dfs(node.left, level + 1);
dfs(node.right, level + 1);
}

dfs(root, 0);
return result;
}

/\*\*

- Solution 2: BFS with Queue (Optimal)
- Time: O(n) — each node enqueued/dequeued once
- Space: O(w) — queue holds at most one full level (max width w)
  \*/
  function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];

const result: number[][] = [];
const queue: TreeNode[] = [root];

while (queue.length > 0) {
const levelSize = queue.length; // snapshot current level count
const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);

}

return result;
}

// === Test Cases ===
const root: TreeNode = {
val: 3,
left: { val: 9, left: null, right: null },
right: {
val: 20,
left: { val: 15, left: null, right: null },
right: { val: 7, left: null, right: null },
},
};
console.log(JSON.stringify(levelOrder(root))); // [[3],[9,20],[15,7]]
console.log(JSON.stringify(levelOrder(null))); // []

{% endraw %}

---

## 🔗 Related Problems

- [Binary Tree Zigzag Level Order Traversal](./07-binary-tree-zigzag-level-order-traversal.md) — BFS skeleton giống hệt, thêm direction flag
- [Maximum Depth of Binary Tree](./01-maximum-depth-of-binary-tree.md) — BFS đếm số tầng = max depth
