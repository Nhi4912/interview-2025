---
layout: page
title: "Binary Tree Maximum Path Sum"
difficulty: Hard
category: Tree/Graph
tags: [Dynamic Programming, Tree, DFS, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/"
---

# Binary Tree Maximum Path Sum / Tổng Đường Đi Lớn Nhất Trong Cây

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Tree DFS (Post-order)
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Word Ladder](./13-word-ladder.md) | [Serialize and Deserialize Binary Tree](./14-serialize-deserialize-binary-tree.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như leo núi qua rừng cây: từ bất kỳ đỉnh núi nào, bạn có thể đi xuống trái hoặc phải để thu thập điểm. Tại mỗi đỉnh, bạn phải quyết định — dùng nó làm điểm ngoặt (kết hợp cả hai nhánh) hay chỉ là trạm trung chuyển (chọn một nhánh để tiếp tục lên cha). Mỗi node vừa báo cáo max path kéo dài lên cha, vừa cập nhật global max khi đóng vai điểm ngoặt.

**Pattern Recognition:**

- Signal: "max path sum", "path in tree", "path need not pass through root" → **Post-order DFS + global max**
- Key split: extending path (1 branch, propagates up) vs through-node path (both branches, updates global)
- Math.max(0, child) to ignore negative subtrees

**Visual — tree [-10, 9, 20, null, null, 15, 7]:**

```
        -10
       /    \
      9      20
            /  \
           15    7

  Post-order DFS (children before parent):
  node=9:  leftGain=0, rightGain=0 → pathThrough=9,       maxSum=9
  node=15: leftGain=0, rightGain=0 → pathThrough=15,      maxSum=15
  node=7:  leftGain=0, rightGain=0 → pathThrough=7,       maxSum=15
  node=20: leftGain=15,rightGain=7 → pathThrough=42 ✅    maxSum=42
                                      return 20+max(15,7)=35
  node=-10: left=9,right=35 → pathThrough=-10+9+35=34 (<42)
  Answer: 42
```

---

## Problem Description

Given the root of a binary tree, return the maximum path sum of any non-empty path. A path is a sequence of nodes connected by edges where each node appears at most once. The path does not need to pass through the root.

```
Example 1: root=[1,2,3]                    → 6   (2→1→3)
Example 2: root=[-10,9,20,null,null,15,7]  → 42  (15→20→7)
Example 3: root=[-3]                       → -3  (must include at least 1 node)
```

Constraints:

- 1 ≤ n ≤ 3×10⁴ nodes
- -1000 ≤ Node.val ≤ 1000

---

## 📝 Interview Tips

1. **Clarify**: Must the path include the root? (No) / Đường đi có phải qua root không? (Không).
2. **Key insight**: Two path roles — extending upward (one branch) vs bend point (both branches). Only extending paths propagate to parent / Phân biệt path kéo dài lên cha vs path qua node như điểm ngoặt.
3. **Negative values**: Use Math.max(0, childGain) to drop negative subtrees / Dùng max(0, ...) để bỏ qua nhánh âm.
4. **Edge cases**: All-negative tree → answer is the single least-negative node / Tất cả âm thì chọn node lớn nhất.
5. **Complexity**: O(n) time — each node visited once; O(h) space — recursion depth / Mỗi node thăm đúng 1 lần.
6. **Follow-up**: Return the actual path nodes, not just the sum / Trả về danh sách node thực tế trên đường đi.

---

## Solutions

{% raw %}

interface TreeNode {
val: number;
left: TreeNode | null;
right: TreeNode | null;
}

/\*\*

- Solution 1: Recursive DFS with Global Max (Classic)
- Time: O(n) — visit each node exactly once
- Space: O(h) — recursion stack where h = tree height
  \*/
  function maxPathSum(root: TreeNode | null): number {
  let maxSum = -Infinity;

function dfs(node: TreeNode | null): number {
if (!node) return 0;

    // Clamp to 0: ignore negative contributions from subtrees
    const leftGain  = Math.max(0, dfs(node.left));
    const rightGain = Math.max(0, dfs(node.right));

    // This node as bend point: update global max
    maxSum = Math.max(maxSum, node.val + leftGain + rightGain);

    // Return max extending path upward (can only pick one branch)
    return node.val + Math.max(leftGain, rightGain);

}

dfs(root);
return maxSum;
}

/\*\*

- Solution 2: Iterative Post-order (Avoids deep recursion stack)
- Time: O(n) — same logic, no recursion
- Space: O(n) — explicit stack + gain map
  \*/
  function maxPathSumIterative(root: TreeNode | null): number {
  if (!root) return -Infinity;

let maxSum = -Infinity;
const stack: TreeNode[] = [root];
const postOrder: TreeNode[] = [];

// Reverse preorder trick to get post-order
while (stack.length > 0) {
const node = stack.pop()!;
postOrder.push(node);
if (node.left) stack.push(node.left);
if (node.right) stack.push(node.right);
}
postOrder.reverse(); // leaves come first now

const gain = new Map<TreeNode, number>();
for (const node of postOrder) {
const l = Math.max(0, gain.get(node.left!) ?? 0);
const r = Math.max(0, gain.get(node.right!) ?? 0);
maxSum = Math.max(maxSum, node.val + l + r);
gain.set(node, node.val + Math.max(l, r));
}
return maxSum;
}

// === Test Cases ===
// Helper to build a tree node
const n = (v: number, l: TreeNode | null = null, r: TreeNode | null = null): TreeNode =>
({ val: v, left: l, right: r });

console.log(maxPathSum(n(1, n(2), n(3)))); // 6
console.log(maxPathSum(n(-10, n(9), n(20, n(15), n(7))))); // 42
console.log(maxPathSum(n(-3))); // -3
console.log(maxPathSumIterative(n(1, n(-2), n(3)))); // 4

{% endraw %}

---

## 🔗 Related Problems

- [Path Sum](https://leetcode.com/problems/path-sum/) — prerequisite: check if root-to-leaf sum equals target
- [Path Sum II](https://leetcode.com/problems/path-sum-ii/) — return all root-to-leaf paths matching target
- [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/) — same post-order DFS, maximize path length not sum
- [Word Ladder](./13-word-ladder.md) — contrast: BFS for shortest path in graph vs DFS for max in tree
