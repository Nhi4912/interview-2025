---
layout: page
title: "Binary Tree Zigzag Level Order Traversal"
difficulty: Medium
category: Tree/Graph
tags: [Tree, Breadth-First Search, Queue]
leetcode_url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/"
---

# Binary Tree Zigzag Level Order Traversal / Duyệt Cây Theo Tầng Zigzag

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS Level Order + Direction Toggle
> **Frequency**: 📘 Tier 2 — Gặp ~45% interviews mid-level, biến thể phổ biến của BFS
> **See also**: [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) | [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như đọc các hàng chữ trong cuốn sách xen kẽ chiều: hàng 1 đọc trái→phải, hàng 2 đọc phải→trái, cứ thế luân phiên. Mỗi tầng cây là một hàng, BFS xử lý từng tầng, sau đó đảo chiều các tầng lẻ để tạo zigzag.

**Pattern Recognition:**

- Signal: "zigzag", "alternate direction per level" → **BFS + reverse odd-indexed levels**
- BFS thu thập từng level bình thường → đảo reverse các tầng lẻ (index 1, 3, 5...)
- Hoặc: dùng deque/two-stack để thêm vào đầu/cuối tùy chiều — tránh reverse nhưng phức tạp hơn

**Visual — Zigzag trên [3,9,20,null,null,15,7]:**

```
        3
       / \
      9   20
         /  \
        15    7

Level 0 (L→R): [3]          → [3]
Level 1 (R→L): [9, 20]      → reverse → [20, 9]
Level 2 (L→R): [15, 7]      → [15, 7]

Output: [[3], [20,9], [15,7]]
```

---

## Problem Description

Given the root of a binary tree, return the **zigzag level order traversal**: left-to-right for level 0, right-to-left for level 1, alternating each level.

```
Example 1: root = [3,9,20,null,null,15,7] → [[3],[20,9],[15,7]]
Example 2: root = [1]                      → [[1]]
Example 3: root = []                       → []
```

---

## 📝 Interview Tips

1. **Clarify**: Level 0 (root) goes left-to-right — confirm direction convention with interviewer.
2. **Simplest approach**: Standard BFS → collect each level → `if (level % 2 === 1) level.reverse()` — clean and correct.
3. **In-place variant**: Use `unshift` instead of `push` on odd levels to avoid post-reversal — same complexity but different code.
4. **Two-stack approach**: Use two stacks alternating child push order — avoids reversal but harder to implement correctly.
5. **Edge cases**: Single node → [[node]]; all nodes on one side (skewed tree) → alternating single-element arrays.
6. **Time/Space**: O(n) time — each node processed once; O(n) space — result + BFS queue.

---

## Solutions

{% raw %}
// Note: TreeNode class is provided by LeetCode environment

// Solution 1: BFS + Post-level Reverse (Cleanest — interview standard)
// Time: O(n) — each node enqueued and dequeued once
// Space: O(n) — queue holds at most one full level (max n/2 nodes)
function zigzagLevelOrder(root: TreeNode | null): number[][] {
if (!root) return [];
const result: number[][] = [];
const queue: TreeNode[] = [root];
let level = 0;
while (queue.length > 0) {
const size = queue.length;
const row: number[] = [];
for (let i = 0; i < size; i++) {
const node = queue.shift()!;
row.push(node.val);
if (node.left) queue.push(node.left);
if (node.right) queue.push(node.right);
}
result.push(level % 2 === 1 ? row.reverse() : row);
level++;
}
return result;
}

// Solution 2: BFS with Direction-aware Insertion (No reverse needed)
// Time: O(n) — each node processed once
// Space: O(n) — queue + row arrays
function zigzagLevelOrderDeque(root: TreeNode | null): number[][] {
if (!root) return [];
const result: number[][] = [];
const queue: TreeNode[] = [root];
let leftToRight = true;
while (queue.length > 0) {
const size = queue.length;
const row: number[] = new Array(size);
for (let i = 0; i < size; i++) {
const node = queue.shift()!;
// Fill from front or back based on direction
const idx = leftToRight ? i : size - 1 - i;
row[idx] = node.val;
if (node.left) queue.push(node.left);
if (node.right) queue.push(node.right);
}
result.push(row);
leftToRight = !leftToRight;
}
return result;
}

// === Test Cases ===
const t1 = new TreeNode(3,
new TreeNode(9),
new TreeNode(20, new TreeNode(15), new TreeNode(7))
);
console.log(JSON.stringify(zigzagLevelOrder(t1))); // [[3],[20,9],[15,7]] ✅
console.log(JSON.stringify(zigzagLevelOrderDeque(t1))); // [[3],[20,9],[15,7]] ✅
console.log(JSON.stringify(zigzagLevelOrder(null))); // [] ✅
console.log(JSON.stringify(zigzagLevelOrder(new TreeNode(1)))); // [[1]] ✅
{% endraw %}

---

## 🔗 Related Problems

- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) — simpler BFS without direction toggle, prerequisite
- [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/) — BFS, keep only last element per level
- [Binary Tree Level Order Traversal II](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/) — BFS bottom-up, reverse final result
- [Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree/) — same BFS structure, different aggregation
