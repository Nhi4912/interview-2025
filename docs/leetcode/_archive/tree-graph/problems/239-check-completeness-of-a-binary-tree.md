---
layout: page
title: "Check Completeness of a Binary Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/check-completeness-of-a-binary-tree"
---

# Check Completeness of a Binary Tree / Kiểm Tra Cây Nhị Phân Đầy Đủ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Same Tree](https://leetcode.com/problems/same-tree) | [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống xếp hàng ở siêu thị — khách đứng từ trái sang phải, không được có chỗ trống ở giữa. Nếu có người đứng sau chỗ trống, hàng đó "không hoàn chỉnh". BFS duyệt từng tầng, hễ thấy `null` thì đặt cờ; nếu sau đó còn gặp node thực, là không hợp lệ.

**Pattern Recognition:**

- Signal: "complete binary tree validation" → **BFS with null-sentinel flag**
- Key insight: trong BFS level-order, khi gặp `null` lần đầu, tất cả phần tử tiếp theo phải là `null`

**Visual — Check Completeness of a Binary Tree example:**

```
Valid (complete):       Invalid (incomplete):
      1                       1
     / \                     / \
    2   3                   2   3
   / \  /                  / \    \
  4  5 6                  4   5    7
                                  ↑ gap here!
BFS queue for invalid:
  [1] → [2,3] → [4,5,null,7]
  After seeing null(3's left), next node is 7 → NOT complete!
```

---

## 📝 Problem Description

Given the root of a binary tree, determine if it is a **complete binary tree** — all levels are fully filled except possibly the last, and the last level has all nodes as **far left** as possible.

**Example 1:** Tree `[1,2,3,4,5,6]` → `true`
**Example 2:** Tree `[1,2,3,4,5,null,7]` → `false` (gap at position 6)

Constraints: `1 ≤ nodes ≤ 100`, `1 ≤ Node.val ≤ 1000`.

---

## 🎯 Interview Tips

1. **BFS null-flag approach**: the cleanest O(N) method / Dùng cờ sau khi gặp null là cách sạch nhất
2. **Index approach**: complete tree if no node has index > n / Cách dùng index: node index <= n nghĩa là complete
3. **Enqueue nulls**: unlike typical BFS, enqueue null children too / Cho null vào queue để phát hiện lỗ hổng
4. **seenNull flag**: once true, any non-null node means incomplete / Một khi seenNull=true, nếu gặp node thật là sai
5. **Edge cases**: single node is always complete / Cây 1 node luôn là complete
6. **Alternative**: count nodes n, then check max index ≤ n via DFS / Đếm nodes, kiểm tra max_index <= n bằng DFS

---

## 💡 Solutions

### Approach 1: BFS with Index Validation

/\*_ @complexity Time: O(N) | Space: O(N) _/

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function isCompleteTreeIndex(root: TreeNode | null): boolean {
  if (!root) return true;
  // Count total nodes
  function countNodes(node: TreeNode | null): number {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  }
  const n = countNodes(root);
  // BFS with 1-based index; if index > n, not complete
  const queue: [TreeNode, number][] = [[root, 1]];
  while (queue.length) {
    const [node, idx] = queue.shift()!;
    if (idx > n) return false;
    if (node.left) queue.push([node.left, 2 * idx]);
    if (node.right) queue.push([node.right, 2 * idx + 1]);
  }
  return true;
}
```

### Approach 2: BFS Null-Sentinel Flag — Optimal

/\*_ @complexity Time: O(N) | Space: O(N) _/

```typescript
function isCompleteTree(root: TreeNode | null): boolean {
  if (!root) return true;
  const queue: (TreeNode | null)[] = [root];
  let seenNull = false;

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === null) {
      seenNull = true;
    } else {
      // After seeing a null, any real node means incomplete
      if (seenNull) return false;
      queue.push(node.left); // enqueue even if null
      queue.push(node.right);
    }
  }
  return true;
}
```

---

## 🧪 Test Cases

```typescript
function build(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] == null) return null;
  const root = new TreeNode(vals[0]);
  const q = [root];
  let i = 1;
  while (q.length && i < vals.length) {
    const n = q.shift()!;
    if (vals[i] != null) {
      n.left = new TreeNode(vals[i]!);
      q.push(n.left);
    }
    i++;
    if (i < vals.length && vals[i] != null) {
      n.right = new TreeNode(vals[i]!);
      q.push(n.right);
    }
    i++;
  }
  return root;
}
console.log(isCompleteTree(build([1, 2, 3, 4, 5, 6]))); // → true
console.log(isCompleteTree(build([1, 2, 3, 4, 5, null, 7]))); // → false
console.log(isCompleteTree(build([1]))); // → true
console.log(isCompleteTree(build([1, 2, 3, 4, 5, 6, 7]))); // → true (full level)
console.log(isCompleteTreeIndex(build([1, 2, 3, 4, 5, 6]))); // → true
```

---

## Related Problems

| Problem                                                                                              | Difficulty | Pattern       |
| ---------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [Count Complete Tree Nodes](https://leetcode.com/problems/count-complete-tree-nodes)                 | Easy       | Binary Search |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal) | Medium     | BFS           |
| [Maximum Width of Binary Tree](https://leetcode.com/problems/maximum-width-of-binary-tree)           | Medium     | BFS           |
