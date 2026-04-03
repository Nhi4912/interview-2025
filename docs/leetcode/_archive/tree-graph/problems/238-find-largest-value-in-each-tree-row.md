---
layout: page
title: "Find Largest Value in Each Tree Row"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/find-largest-value-in-each-tree-row"
---

# Find Largest Value in Each Tree Row / Tìm Giá Trị Lớn Nhất Mỗi Hàng Cây

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Same Tree](https://leetcode.com/problems/same-tree) | [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống cuộc thi cao nhất ở từng lớp trường — mỗi lớp (tầng cây) chỉ chọn ra một người cao nhất. Đi từng lớp, chọn max của lớp đó rồi ghi lại, rất đơn giản.

**Pattern Recognition:**

- Signal: "find max per level" + "binary tree" → **BFS level-order** hoặc **DFS tracking depth**
- Key insight: BFS tự nhiên phân tầng; DFS dùng `maxByLevel[depth]` cũng hiệu quả

**Visual — Find Largest Value in Each Tree Row example:**

```
Input:       1
            / \
           3   2
          / \   \
         5   3   9

BFS level by level:
  Level 0: [1]      → max = 1
  Level 1: [3, 2]   → max = 3
  Level 2: [5,3,9]  → max = 9
Output: [1, 3, 9]
```

---

## 📝 Problem Description

Given the root of a binary tree, return an array of the **largest value in each row** of the tree (0-indexed rows from top to bottom).

**Example 1:** Tree `[1,3,2,5,3,null,9]` → `[1,3,9]`
**Example 2:** Tree `[1,2,3]` → `[1,3]`

Constraints: `0 ≤ nodes ≤ 10⁴`, `-2³¹ ≤ Node.val ≤ 2³¹ - 1`.

---

## 🎯 Interview Tips

1. **BFS is most intuitive** for level-by-level problems / BFS tự nhiên nhất cho bài theo tầng
2. **DFS alternative**: pass depth, update maxByLevel[depth] / DFS cũng được: truyền depth, cập nhật mảng max
3. **Initialize max correctly**: use `-Infinity` not 0 / Khởi tạo max = -Infinity vì giá trị có thể âm
4. **Empty tree** returns empty array / Cây rỗng trả mảng rỗng
5. **Level size tracking in BFS**: snapshot queue.length at start of each level / Trong BFS ghi lại queue.length trước khi xử lý từng tầng
6. **Follow-up**: find minimum per row? Same approach / Tìm min từng hàng? Cách tương tự

---

## 💡 Solutions

### Approach 1: DFS with Depth Tracking

/\*_ @complexity Time: O(N) | Space: O(H) _/

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

function largestValuesDFS(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null, depth: number): void {
    if (!node) return;
    if (result.length === depth) result.push(-Infinity);
    result[depth] = Math.max(result[depth], node.val);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }
  dfs(root, 0);
  return result;
}
```

### Approach 2: BFS Level-Order — Optimal

/\*_ @complexity Time: O(N) | Space: O(W) where W = max width _/

```typescript
function largestValues(root: TreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  let queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    let levelMax = -Infinity;
    const next: TreeNode[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue[i];
      levelMax = Math.max(levelMax, node.val);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    result.push(levelMax);
    queue = next;
  }
  return result;
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
console.log(largestValues(build([1, 3, 2, 5, 3, null, 9]))); // → [1,3,9]
console.log(largestValues(build([1, 2, 3]))); // → [1,3]
console.log(largestValues(build([]))); // → []
console.log(largestValues(build([-1, -2, -3]))); // → [-1,-2] (negative values)
console.log(largestValuesDFS(build([1, 3, 2, 5, 3, null, 9]))); // → [1,3,9]
```

---

## Related Problems

| Problem                                                                                              | Difficulty | Pattern |
| ---------------------------------------------------------------------------------------------------- | ---------- | ------- |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal) | Medium     | BFS     |
| [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view)             | Medium     | BFS     |
| [Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree)   | Easy       | BFS     |
