---
layout: page
title: "Second Minimum Node In a Binary Tree"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/second-minimum-node-in-a-binary-tree"
---

# Second Minimum Node In a Binary Tree / Giá Trị Nhỏ Thứ Hai Trong Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | [Same Tree](https://leetcode.com/problems/same-tree)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống thi đấu giải nhì vòng loại — người về nhì toàn giải chắc chắn đã thua người về nhất. Trong cây đặc biệt này, root luôn là nhỏ nhất; giá trị nhỏ thứ hai **phải tồn tại ở nhánh nào đó** và nhỏ hơn tất cả anh chị em cùng nhánh.

**Pattern Recognition:**

- Signal: "special binary tree" + "each node has 0 or 2 children" + "parent ≤ children" → **DFS early termination**
- Key insight: root = min value; khi DFS nếu gặp node.val > root.val thì node đó **là ứng cử viên** (không cần đi sâu hơn ở nhánh đó)

**Visual — Second Minimum Node In a Binary Tree example:**

```
Input:    2
         / \
        2   5
           / \
          5   7

root.val = 2 (minimum)
DFS: skip nodes equal to 2 (they can't be 2nd min)
     when val > 2: candidate = min(candidate, val)
     node 5 → candidate=5, go deeper? 5>2 so record 5, stop
     node 7 → record 7, already have 5<7
Answer: 5
```

---

## 📝 Problem Description

Given a non-empty special binary tree where every node has exactly 0 or 2 children, and the value of each node is ≤ both its children, find the second minimum value. Return -1 if no such value exists.

**Example 1:** Tree `[2,2,5,null,null,5,7]` → `5`
**Example 2:** Tree `[2,2,2]` → `-1` (all same value)

Constraints: `1 ≤ nodes ≤ 25`, `1 ≤ Node.val ≤ 2³¹ - 1`.

---

## 🎯 Interview Tips

1. **Root is always minimum** / Root luôn là giá trị nhỏ nhất — đây là điều kiện đặc biệt của cây này
2. **Early termination**: if node.val > rootVal, no need to recurse / Nếu node.val > rootVal thì đây là ứng cử viên, không cần đi sâu hơn
3. **All-same-value edge case** returns -1 / Tất cả giá trị bằng nhau → trả -1
4. **Use Set approach** only as fallback / Cách dùng Set + sort chạy được nhưng không tối ưu như DFS cắt tỉa
5. **Overflow concern**: values can reach 2³¹-1, use BigInt or number carefully / Giá trị có thể lên đến 2^31-1
6. **Minimum vs second minimum**: answer is strictly greater than root.val / Giá trị nhỏ thứ hai phải **lớn hơn** root.val

---

## 💡 Solutions

### Approach 1: Collect All Values — Brute Force

/\*_ @complexity Time: O(N log N) | Space: O(N) _/

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

function findSecondMinimumValueBrute(root: TreeNode | null): number {
  const vals = new Set<number>();
  function dfs(node: TreeNode | null) {
    if (!node) return;
    vals.add(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  const sorted = [...vals].sort((a, b) => a - b);
  return sorted.length >= 2 ? sorted[1] : -1;
}
```

### Approach 2: DFS with Early Termination — Optimal

/\*_ @complexity Time: O(N) | Space: O(H) where H = tree height _/

```typescript
function findSecondMinimumValue(root: TreeNode | null): number {
  if (!root) return -1;
  const rootVal = root.val;
  let secondMin = Infinity;

  function dfs(node: TreeNode | null): void {
    if (!node) return;
    // If this node's value is already >= secondMin candidate, prune
    if (node.val >= secondMin) return;
    // If value > rootVal, it's a valid candidate for second minimum
    if (node.val > rootVal) {
      secondMin = node.val;
      return; // no need to go deeper; children will be >= this value
    }
    // value == rootVal: must explore children
    dfs(node.left);
    dfs(node.right);
  }

  dfs(root);
  return secondMin === Infinity ? -1 : secondMin;
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
console.log(findSecondMinimumValue(build([2, 2, 5, null, null, 5, 7]))); // → 5
console.log(findSecondMinimumValue(build([2, 2, 2]))); // → -1
console.log(
  findSecondMinimumValue(build([1, 1, 3, 1, 1, 3, 4, 3, 1, 1, 1, 3, 8, 4, 8, 3, 3, 1, 6, 2, 1])),
); // → 2
console.log(findSecondMinimumValueBrute(build([2, 2, 5, null, null, 5, 7]))); // → 5
```

---

## Related Problems

| Problem                                                                                                    | Difficulty | Pattern       |
| ---------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst)               | Medium     | DFS/Inorder   |
| [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array) | Medium     | Binary Search |
| [Minimum Depth of Binary Tree](https://leetcode.com/problems/minimum-depth-of-binary-tree)                 | Easy       | BFS/DFS       |
