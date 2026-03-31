---
layout: page
title: "Binary Tree Paths"
difficulty: Easy
category: Tree-Graph
tags: [String, Backtracking, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-tree-paths"
---

# Binary Tree Paths / Tất Cả Đường Đi Từ Gốc Đến Lá

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS / Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Path Sum II](https://leetcode.com/problems/path-sum-ii) | [Smallest String Starting From Leaf](https://leetcode.com/problems/smallest-string-starting-from-leaf)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như vẽ bản đồ tất cả con đường từ cửa hàng đến các điểm cuối — bắt đầu từ gốc, đi xuống từng nhánh, ghi lại toàn bộ đường khi đến lá. Đây là bài DFS cơ bản nhất trên cây.

**Pattern Recognition:**

- Signal: "all root-to-leaf paths" → **DFS với path accumulation**
- Tại mỗi node: thêm val vào path; nếu là lá → ghi kết quả; nếu không → tiếp tục đệ quy
- Key insight: string immutable nên truyền bằng value giúp tự động backtrack

**Visual — DFS path collection:**

```
        1
       / \
      2   3
       \
        5

DFS trace:
→ visit 1: path="1"
  → visit 2: path="1->2"
    → visit 5 (leaf): path="1->2->5" ✅ add
  → visit 3 (leaf): path="1->3" ✅ add

Result: ["1->2->5", "1->3"]
```

---

## Problem Description

Given the `root` of a binary tree, return all root-to-leaf paths in any order. ([LeetCode #257](https://leetcode.com/problems/binary-tree-paths))

A leaf is a node with no children. Each path should be represented as `"node1->node2->...->leafNode"`.

**Example 1:** `root = [1,2,3,null,5]` → `["1->2->5","1->3"]`
**Example 2:** `root = [1]` → `["1"]`

---

## 📝 Interview Tips

1. **Clarify**: "Leaf = node không có con nào; cây có thể rỗng không?" / Leaf has no children; can tree be null?
2. **Recursive DFS**: "Truyền current path string xuống, khi là lá thì push vào result" / Pass path string down, push at leaves
3. **Iterative**: "Dùng stack với [node, pathString] — tránh stack overflow với cây sâu" / Iterative with explicit stack
4. **Backtracking**: "String immutable → `path + "->" + node.val` tự tạo copy mới, không cần undo" / Strings auto-backtrack
5. **Edge cases**: "Root null → `[]`; single node → `[root.val.toString()]`" / Null root, single node
6. **Follow-up**: "Path Sum II: tìm paths có tổng = target — tương tự nhưng check sum ở leaf" / Path Sum II variant

---

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

/**
 * Solution 1: DFS Recursive (clean string passing)
 * Time: O(N * H) — N nodes, each path copy costs O(H)
 * Space: O(H) — recursion stack height H
 */
function binaryTreePathsRecursive(root: TreeNode | null): string[] {
  const result: string[] = [];

  function dfs(node: TreeNode | null, path: string): void {
    if (!node) return;
    const curr = path ? `${path}->${node.val}` : `${node.val}`;
    if (!node.left && !node.right) {
      result.push(curr);
      return;
    }
    dfs(node.left, curr);
    dfs(node.right, curr);
  }

  dfs(root, "");
  return result;
}

/**
 * Solution 2: Iterative DFS with explicit stack
 * Time: O(N * H)
 * Space: O(N) — stack holds all nodes in worst case (skewed tree)
 */
function binaryTreePaths(root: TreeNode | null): string[] {
  if (!root) return [];
  const result: string[] = [];
  const stack: [TreeNode, string][] = [[root, `${root.val}`]];

  while (stack.length > 0) {
    const [node, path] = stack.pop()!;
    if (!node.left && !node.right) {
      result.push(path);
      continue;
    }
    if (node.right) stack.push([node.right, `${path}->${node.right.val}`]);
    if (node.left) stack.push([node.left, `${path}->${node.left.val}`]);
  }
  return result;
}

/**
 * Solution 3: Backtracking with array (optimal for large trees)
 * Time: O(N * H)
 * Space: O(H) — path array depth H
 */
function binaryTreePathsBacktrack(root: TreeNode | null): string[] {
  const result: string[] = [];
  const path: number[] = [];

  function dfs(node: TreeNode | null): void {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right) result.push(path.join("->"));
    else {
      dfs(node.left);
      dfs(node.right);
    }
    path.pop(); // backtrack
  }

  dfs(root);
  return result;
}

// === Test Cases ===
const root1 = new TreeNode(1);
root1.left = new TreeNode(2);
root1.right = new TreeNode(3);
root1.left.right = new TreeNode(5);
console.log(binaryTreePaths(root1)); // ["1->2->5","1->3"]
console.log(binaryTreePathsRecursive(root1)); // ["1->2->5","1->3"]
console.log(binaryTreePathsBacktrack(root1)); // ["1->2->5","1->3"]
console.log(binaryTreePaths(new TreeNode(1))); // ["1"]
console.log(binaryTreePaths(null)); // []
```

---

## 🔗 Related Problems

| Problem                                                                                                | Difficulty | Pattern          |
| ------------------------------------------------------------------------------------------------------ | ---------- | ---------------- |
| [Path Sum](https://leetcode.com/problems/path-sum)                                                     | 🟢 Easy    | DFS root-to-leaf |
| [Path Sum II](https://leetcode.com/problems/path-sum-ii)                                               | 🟡 Medium  | DFS + backtrack  |
| [Sum Root to Leaf Numbers](https://leetcode.com/problems/sum-root-to-leaf-numbers)                     | 🟡 Medium  | DFS accumulate   |
| [Smallest String Starting From Leaf](https://leetcode.com/problems/smallest-string-starting-from-leaf) | 🟡 Medium  | DFS + compare    |
