---
layout: page
title: "Serialize and Deserialize Binary Tree"
difficulty: Hard
category: Tree/Graph
tags: [String, Tree, DFS, BFS, Design, Binary Tree]
leetcode_url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"
leetcode_number: 297
pattern: "BFS or DFS Serialization"
frequency_tier: 2
companies: [Amazon, Google, Microsoft, Facebook]
target_time_minutes: 35
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
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

## 🎯 Pattern Trigger / Nhận Dạng

| When you see... | Think... | Template | Complexity |
|---|---|---|---|
| "Encode/decode tree to/from string" | Preorder DFS with null markers — simplest correct approach | `serialize: DFS, append val or 'null'; deserialize: split string, advance pointer, build recursively` | O(n) both ways |
| Why preorder and not inorder/postorder? | Preorder places root first — deserialization can immediately create root then recurse into children | With inorder you'd need to know root position first | — |
| BFS serialization (LeetCode format) | Level-order traversal, enqueue children including nulls | `queue with (TreeNode\|null); skip null nodes when enqueueing` | O(n) both ways |
| Compact format for BST only | BST property: no null markers needed (structure deducible from values) | Only works for BST, not general binary tree | O(n) smaller output |

**Memory hook:** "Serialize = flatten với dấu 'null' đánh dấu khoảng trống"

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

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

> "So we need to convert a binary tree to a string and back, and the only requirement is that the round-trip works — the format itself is our choice? Great, I'll use preorder DFS with null markers since it's the simplest to implement correctly."

> "For serialize: DFS the tree in preorder (root, left, right). When we hit a real node, append its value. When we hit null, append the string 'null'. Join with commas."

> "For deserialize: split by comma into an array. Use a shared index pointer. At each recursive call, read the current token — if it's 'null', advance index and return null. Otherwise, create a node with that value, advance index, then recursively build left and right subtrees."

> "The key insight is that preorder gives us the root first, so during deserialization we always know what to create before recursing into children. The null markers tell us exactly where subtrees end."

> "Both directions are O(n) time and space. For a follow-up, I could use BFS to match LeetCode's format, but the deserialization is slightly more involved since we have to handle null children when rebuilding."

---

## 📝 Interview Tips

1. **Clarify**: Must match LeetCode's exact format? (No, any format works) / Có thể dùng bất kỳ format nào miễn round-trip đúng.
2. **Approach**: Preorder DFS is simplest — null markers fully preserve tree shape / Preorder với null markers là dễ implement nhất.
3. **BFS vs DFS**: BFS matches LeetCode's format but deserializing nulls is trickier / BFS khó deserialize hơn DFS.
4. **Edge cases**: Empty tree, single node, negative values, skewed trees / Cây rỗng, 1 node, giá trị âm, cây lệch.
5. **Complexity**: O(n) time both ways; O(n) space for serialized string + O(h) recursion stack / Cả hai chiều đều O(n).
6. **Follow-up**: Serialize N-ary tree / BST with more compact format / Tuần tự hóa cây N-nhánh hoặc BST compact hơn.

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

1. **Not including null markers in the serialized output** — without null markers for empty children, the structure is ambiguous. For example "1,2,3" could be a root-1 with children 2,3, or a left-skewed chain 1→2→3. Null markers are mandatory for general binary trees (unlike BST where structure can be inferred from values).

2. **Inconsistent delimiter between serialize and deserialize** — picking space as delimiter in serialize but splitting by comma in deserialize (or vice versa) causes parse errors. Choose one delimiter and use it consistently in both methods. Comma is the conventional choice.

3. **Applying BST-only compact formats to general binary trees** — a BST's structure can be reconstructed from preorder values alone (no null markers needed) because the BST property constrains where each value goes. This optimization is invalid for a general binary tree where any structure is possible. Always use explicit null markers for the general case.

---

## Solutions

```typescript

interface TreeNode {
val: number;
left: TreeNode | null;
right: TreeNode | null;
}
const newNode = (val: number): TreeNode => ({ val, left: null, right: null });

/**

- Solution 1: Preorder DFS (Classic — simplest to implement)
- Time: O(n) — visit each node once each direction
- Space: O(n) — serialized array + O(h) recursion stack
  */
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

/**

- Solution 2: BFS Level-Order (Matches LeetCode's array format)
- Time: O(n) — single BFS pass each direction
- Space: O(n) — queue + serialized output
  */
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

```

---

## 🔗 Related Problems

- [Serialize and Deserialize BST](https://leetcode.com/problems/serialize-and-deserialize-bst/) — easier: BST property allows more compact format without null markers
- [Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/) — similar round-trip design for string arrays
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) — prerequisite BFS traversal pattern
- [Word Ladder](./13-word-ladder.md) — contrast: BFS for shortest path in graph vs DFS for tree serialization

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric | Target | Actual |
|---|---|---|
| Time to solve | 35 min | __ min |
| Solution correctness | Round-trip fidelity verified | ✅ / ❌ |
| Null markers included | Both serialize and deserialize | ✅ / ❌ |
| Delimiter consistency | Same in both methods | ✅ / ❌ |

**SRS Schedule:** Day 1 → Day 3 → Day 7 → Day 14 → Day 30

| Date | Solve Time | Confidence (1-5) | Notes |
|---|---|---|---|
| | | | |
