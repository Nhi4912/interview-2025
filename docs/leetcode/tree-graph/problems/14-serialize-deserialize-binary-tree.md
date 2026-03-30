---
layout: page
title: "Serialize and Deserialize Binary Tree"
difficulty: Hard
category: Tree/Graph
tags: [String, Tree, DFS, BFS, Design, Binary Tree]
leetcode_url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"
---

# Serialize and Deserialize Binary Tree / Tuần Tự Hóa Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Preorder DFS / BFS
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Word Ladder](./13-word-ladder.md) | [Binary Tree Maximum Path Sum](./17-binary-tree-maximum-path-sum.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như đóng gói nội thất khi chuyển nhà — bạn phải ghi lại đúng thứ tự và cấu trúc (cái gì nằm trên cái gì, vị trí nào trống) để người nhận có thể lắp ráp lại y hệt. Preorder DFS tự nhiên encode cấu trúc cây vì node cha luôn xuất hiện trước con — khi deserialize, đọc theo đúng thứ tự đó là tái tạo lại được toàn bộ cây.

**Pattern Recognition:**

- Signal: "convert tree ↔ string", "preserve tree structure" → **Preorder DFS with null markers**
- Preorder (root→left→right) self-describes structure; null markers preserve shape exactly
- BFS (level-order) matches LeetCode's format but requires careful null-child handling

**Visual — serialize tree [1,2,3,null,null,4,5]:**

```
        1
       / \
      2   3
         / \
        4   5

  Preorder DFS: visit root, recurse left, recurse right
  1 → 2 → null → null → 3 → 4 → null → null → 5 → null → null

  String: "1,2,null,null,3,4,null,null,5,null,null"

  Deserialize (index pointer i=0):
  read "1"    → node(1), i=1
    read "2"  → node(2), i=2
      read "null" → null, i=3  (left of 2)
      read "null" → null, i=4  (right of 2)
    read "3"  → node(3), i=5
      read "4" → node(4)... read "5" → node(5) ✅
```

---

## Problem Description

Design an algorithm to serialize (tree → string) and deserialize (string → tree) a binary tree. Format choice is yours — just ensure round-trip fidelity: `deserialize(serialize(root))` produces the original tree.

```
Example 1: root=[1,2,3,null,null,4,5]
  serialize  → "1,2,null,null,3,4,null,null,5,null,null"
  deserialize → original tree ✅

Example 2: root=[] → ""
```

Constraints:

- 0 ≤ n ≤ 10⁴ nodes
- -1000 ≤ Node.val ≤ 1000

---

## 📝 Interview Tips

1. **Clarify**: Must match LeetCode's exact format? (No, any format works) / Có thể dùng bất kỳ format nào miễn round-trip đúng.
2. **Approach**: Preorder DFS is simplest — null markers fully preserve tree shape / Preorder với null markers là dễ implement nhất.
3. **BFS vs DFS**: BFS matches LeetCode's format but deserializing nulls is trickier / BFS khó deserialize hơn DFS.
4. **Edge cases**: Empty tree, single node, negative values, skewed trees / Cây rỗng, 1 node, giá trị âm, cây lệch.
5. **Complexity**: O(n) time both ways; O(n) space for serialized string + O(h) recursion stack / Cả hai chiều đều O(n).
6. **Follow-up**: Serialize N-ary tree / BST with more compact format / Tuần tự hóa cây N-nhánh hoặc BST compact hơn.

---

## Solutions

{% raw %}

interface TreeNode {
val: number;
left: TreeNode | null;
right: TreeNode | null;
}
const newNode = (val: number): TreeNode => ({ val, left: null, right: null });

/\*\*

- Solution 1: Preorder DFS (Classic — simplest to implement)
- Time: O(n) — visit each node once each direction
- Space: O(n) — serialized array + O(h) recursion stack
  \*/
  function serialize(root: TreeNode | null): string {
  const parts: string[] = [];
  function dfs(node: TreeNode | null): void {
  if (!node) { parts.push("null"); return; }
  parts.push(node.val.toString());
  dfs(node.left);
  dfs(node.right);
  }
  dfs(root);
  return parts.join(",");
  }

function deserialize(data: string): TreeNode | null {
const vals = data.split(",");
let i = 0;
function build(): TreeNode | null {
if (vals[i] === "null") { i++; return null; }
const node = newNode(parseInt(vals[i++]));
node.left = build();
node.right = build();
return node;
}
return build();
}

/\*\*

- Solution 2: BFS Level-Order (Matches LeetCode's array format)
- Time: O(n) — single BFS pass each direction
- Space: O(n) — queue + serialized output
  \*/
  function serializeBFS(root: TreeNode | null): string {
  if (!root) return "";
  const parts: string[] = [];
  const queue: (TreeNode | null)[] = [root];
  while (queue.length > 0) {
  const node = queue.shift()!;
  if (!node) { parts.push("null"); continue; }
  parts.push(node.val.toString());
  queue.push(node.left, node.right);
  }
  return parts.join(",");
  }

function deserializeBFS(data: string): TreeNode | null {
if (!data) return null;
const vals = data.split(",");
const root = newNode(parseInt(vals[0]));
const queue: TreeNode[] = [root];
let i = 1;
while (queue.length > 0 && i < vals.length) {
const node = queue.shift()!;
if (vals[i] !== "null") { node.left = newNode(parseInt(vals[i])); queue.push(node.left); }
i++;
if (i < vals.length && vals[i] !== "null") { node.right = newNode(parseInt(vals[i])); queue.push(node.right); }
i++;
}
return root;
}

// === Test Cases ===
const t1 = newNode(1);
t1.left = newNode(2); t1.right = newNode(3);
t1.right!.left = newNode(4); t1.right!.right = newNode(5);

console.log(serialize(t1)); // "1,2,null,null,3,4,null,null,5,null,null"
console.log(serialize(null)); // "null"
console.log(serializeBFS(t1)); // "1,2,3,null,null,4,5"
// Round-trip: deserialize(serialize(t1)) should reconstruct t1 exactly

{% endraw %}

---

## 🔗 Related Problems

- [Serialize and Deserialize BST](https://leetcode.com/problems/serialize-and-deserialize-bst/) — easier: BST property allows more compact format without null markers
- [Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/) — similar round-trip design for string arrays
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) — prerequisite BFS traversal pattern
- [Word Ladder](./13-word-ladder.md) — contrast: BFS for shortest path in graph vs DFS for tree serialization
