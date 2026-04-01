---
layout: page
title: "Find Leaves of Binary Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/find-leaves-of-binary-tree"
---

# Find Leaves of Binary Tree / Tìm Lá Của Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | [Same Tree](https://leetcode.com/problems/same-tree)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống hái quả chín trên cây — bạn chỉ hái được quả ở đầu cành (lá). Sau khi hái xong, cành đó trở thành cành mới, lại có quả mới lộ ra. Cứ thế hái từng đợt cho đến khi cây trống rỗng.

**Pattern Recognition:**

- Signal: "collect leaves repeatedly" + "group by removal order" → **DFS với height**
- Key insight: node thuộc nhóm thứ `h` nếu **chiều cao** của nó là `h` (lá = 0, cha của lá = 1, ...)

**Visual — Find Leaves of Binary Tree example:**

```
Input:       1
            / \
           2   3
          / \
         4   5

Height map:  4→0, 5→0, 2→1, 3→0, 1→2
Group by height:
  [0]: [4, 5, 3]   ← first removal (all leaves)
  [1]: [2]          ← second removal
  [2]: [1]          ← last removal (root)
Output: [[4,5,3],[2],[1]]
```

---

## 📝 Problem Description

Given a binary tree, collect and remove all leaves, then repeat until the tree is empty. Return a list of lists where each sub-list contains the values removed at each step.

**Example 1:** Tree `[1,2,3,4,5]` → `[[4,5,3],[2],[1]]`
**Example 2:** Tree `[1]` → `[[1]]`

Constraints: `1 ≤ nodes ≤ 100`, `-100 ≤ Node.val ≤ 100`.

---

## 🎯 Interview Tips

1. **Height = removal order** / Chiều cao của node = thứ tự nó bị loại bỏ — đây là insight chủ chốt
2. **Height(leaf) = 0** not 1 / Lá có height 0, root có height lớn nhất
3. **Single DFS pass** suffices — no need to repeatedly modify the tree / Một lần DFS là đủ, không cần sửa cây nhiều lần
4. **Result array indexed by height** / Dùng mảng result[h] để nhóm theo height
5. **Edge cases**: single-node tree, skewed tree / Cây 1 node, cây xiên
6. **Iterative alternative**: repeatedly find nodes with no children in adjacency list / Cách khác: tìm lá lặp đi lặp lại bằng adjacency list

---

## 💡 Solutions

### Approach 1: Iterative Leaf Collection — Brute Force O(N²)

/\*_ @complexity Time: O(N²) | Space: O(N) _/

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

function findLeavesBrute(root: TreeNode | null): number[][] {
  const result: number[][] = [];
  while (root !== null) {
    const leaves: number[] = [];
    // collect leaves and prune them
    function prune(node: TreeNode | null): TreeNode | null {
      if (!node) return null;
      if (!node.left && !node.right) {
        leaves.push(node.val);
        return null;
      }
      node.left = prune(node.left);
      node.right = prune(node.right);
      return node;
    }
    root = prune(root);
    result.push(leaves);
  }
  return result;
}
```

### Approach 2: DFS Height Grouping — Optimal O(N)

/\*_ @complexity Time: O(N) | Space: O(N) _/

```typescript
function findLeaves(root: TreeNode | null): number[][] {
  const result: number[][] = [];

  function height(node: TreeNode | null): number {
    if (!node) return -1;
    const h = 1 + Math.max(height(node.left), height(node.right));
    // h = 0 for leaves, 1 for parents of leaves, etc.
    if (result.length <= h) result.push([]);
    result[h].push(node.val);
    return h;
  }

  height(root);
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
console.log(JSON.stringify(findLeaves(build([1, 2, 3, 4, 5])))); // → [[4,5,3],[2],[1]]
console.log(JSON.stringify(findLeaves(build([1])))); // → [[1]]
console.log(JSON.stringify(findLeaves(build([1, 2, null, 3])))); // → [[3],[2],[1]]
console.log(JSON.stringify(findLeavesBrute(build([1, 2, 3, 4, 5])))); // → [[4,5,3],[2],[1]]
```

---

## Related Problems

| Problem                                                                                                          | Difficulty | Pattern          |
| ---------------------------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal)             | Medium     | BFS              |
| [Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees)                                       | Medium     | Topological Sort |
| [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | Medium     | DFS              |
