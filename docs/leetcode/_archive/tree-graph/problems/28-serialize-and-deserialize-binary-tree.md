---
layout: page
title: "Serialize and Deserialize Binary Tree"
difficulty: Hard
category: Tree-Graph
tags: [String, Tree, Depth-First Search, Breadth-First Search, Design]
leetcode_url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree"
---

# Serialize and Deserialize Binary Tree / Tuần Tự Hóa Và Giải Tuần Tự Hóa Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: BFS / DFS Design
> **Frequency**: 📗 Tier 2 — Gặp ở 30+ companies (Amazon, Google, Facebook)
> **See also**: [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view) | [Serialize and Deserialize BST](https://leetcode.com/problems/serialize-and-deserialize-bst)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Serialize giống chụp ảnh cây (lưu cấu trúc), Deserialize giống in ảnh đó lại (phục hồi cây). Cần lưu đủ thông tin để phân biệt trái/phải và vị trí null.

**Pattern Recognition:**

- Signal: "convert tree ↔ string" → **BFS level-order** hoặc **DFS preorder**
- BFS: lưu theo tầng, trực quan nhưng cần queue
- DFS: lưu preorder với `null` marker — nhỏ gọn, recursive

**Visual — BFS serialize `[1,2,3,null,null,4,5]`:**

```
        1
       / \
      2   3
         / \
        4   5

BFS string: "1,2,3,#,#,4,5"
Level 0: [1]
Level 1: [2, 3]       (children of 1)
Level 2: [#,#, 4, 5]  (children of 2=null,null; 3=4,5)

DFS preorder: "1,2,#,#,3,4,#,#,5,#,#"
```

---

## Problem Description

Design an algorithm to serialize a binary tree to a string and deserialize that string back to the original tree. The format is your choice as long as `deserialize(serialize(root))` returns an identical tree. ([LeetCode 297](https://leetcode.com/problems/serialize-and-deserialize-binary-tree))

**Example 1:** `root = [1,2,3,null,null,4,5]` → serialize → some string → deserialize → same tree
**Example 2:** `root = []` → `"#"` → `null`

**Constraints:** `0 ≤ nodes ≤ 10⁴`, `-1000 ≤ Node.val ≤ 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Format của string có cần tương thích với format nào không?" / Any required format for the string output?
2. **BFS vs DFS**: "BFS trực quan; DFS preorder recursive — cả hai đều valid" / Both approaches are correct; BFS is intuitive, DFS is concise
3. **Null marker**: "Phải lưu dấu null (dùng '#') để phân biệt cây có shape khác nhau" / Null markers are essential — without them can't distinguish different shapes
4. **Edge cases**: "Cây rỗng, cây chỉ một node, cây lệch hoàn toàn" / Empty tree, single node, completely skewed tree
5. **Deserialize trick**: "Dùng index pointer hoặc queue of tokens để parse lần lượt" / Use a pointer or queue to consume tokens sequentially
6. **Follow-up**: "BST có thể serialize nhỏ hơn vì không cần lưu null" / BST can omit null markers; plain binary tree cannot

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

const NULL = "#";
const SEP = ",";

/**
 * Solution 1: BFS Level-Order (intuitive)
 * Serialize: queue-based level order, push '#' for null children.
 * Deserialize: rebuild level by level, assign children from queue.
 * Time: O(n) serialize + O(n) deserialize
 * Space: O(n) — queue holds up to one level at a time
 */
function serialize(root: TreeNode | null): string {
  if (!root) return NULL;
  const res: string[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length) {
    const node = queue.shift()!;
    if (node === null) {
      res.push(NULL);
      continue;
    }
    res.push(String(node.val));
    queue.push(node.left);
    queue.push(node.right);
  }
  return res.join(SEP);
}

function deserialize(data: string): TreeNode | null {
  if (data === NULL) return null;
  const tokens = data.split(SEP);
  const root = new TreeNode(Number(tokens[0]));
  const queue: TreeNode[] = [root];
  let i = 1;
  while (queue.length && i < tokens.length) {
    const node = queue.shift()!;
    if (tokens[i] !== NULL) {
      node.left = new TreeNode(Number(tokens[i]));
      queue.push(node.left);
    }
    i++;
    if (i < tokens.length && tokens[i] !== NULL) {
      node.right = new TreeNode(Number(tokens[i]));
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

/**
 * Solution 2: DFS Preorder (recursive, compact)
 * Serialize: preorder (root, left, right) with '#' for null leaves.
 * Deserialize: consume tokens left-to-right recursively.
 * Time: O(n) both directions
 * Space: O(h) call stack where h = tree height; O(n) for string
 */
function serializeDFS(root: TreeNode | null): string {
  if (!root) return NULL;
  return `${root.val}${SEP}${serializeDFS(root.left)}${SEP}${serializeDFS(root.right)}`;
}

function deserializeDFS(data: string): TreeNode | null {
  const tokens = data.split(SEP);
  let idx = 0;
  const build = (): TreeNode | null => {
    if (tokens[idx] === NULL) {
      idx++;
      return null;
    }
    const node = new TreeNode(Number(tokens[idx++]));
    node.left = build();
    node.right = build();
    return node;
  };
  return build();
}

// === Test Cases ===
// Build tree: 1 -> left=2, right=3 -> 3.left=4, 3.right=5
const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.right.left = new TreeNode(4);
root.right.right = new TreeNode(5);

const s1 = serialize(root);
console.log(s1); // "1,2,3,#,#,4,5"
const r1 = deserialize(s1);
console.log(serialize(r1)); // "1,2,3,#,#,4,5" (round-trip)

const s2 = serializeDFS(root);
console.log(s2); // "1,2,#,#,3,4,#,#,5,#,#"
const r2 = deserializeDFS(s2);
console.log(serializeDFS(r2)); // "1,2,#,#,3,4,#,#,5,#,#"

console.log(serialize(null)); // "#"
console.log(deserialize("#")); // null
```

---

## 🔗 Related Problems

| Problem                                                                                            | Pattern            | Difficulty |
| -------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Serialize and Deserialize BST](https://leetcode.com/problems/serialize-and-deserialize-bst)       | DFS without nulls  | 🟡 Medium  |
| [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view)           | BFS level order    | 🟡 Medium  |
| [Encode N-ary Tree to Binary Tree](https://leetcode.com/problems/encode-n-ary-tree-to-binary-tree) | Tree encoding      | 🔴 Hard    |
| [Find Duplicate Subtrees](https://leetcode.com/problems/find-duplicate-subtrees)                   | Tree serialization | 🟡 Medium  |
