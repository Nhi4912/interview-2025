---
layout: page
title: "Find Duplicate Subtrees"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/find-duplicate-subtrees"
---

# Find Duplicate Subtrees / Tìm Các Cây Con Trùng Lặp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS + Serialization + HashMap

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI**: Hai cây con "giống nhau" khi chúng có cùng cấu trúc và giá trị. Cách nhận diện: serialize mỗi cây con thành chuỗi duy nhất (tương tự serialize/deserialize cây). Dùng HashMap đếm số lần xuất hiện — khi count === 2, thêm root nút đó vào kết quả (chỉ lần đầu để tránh trùng).

**EN**: Serialize each subtree with post-order DFS: `"left_serial,right_serial,val"`. Use a HashMap counting occurrences. When a serialization appears for the 2nd time, add that node's root to results.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Find Duplicate Subtrees example:**

```
Tree:         Serialization (post-order):
      1         node 4: "#,#,4"
     / \        node 2: "#,#,4,#,4,2" → wait, use delimiter
    2   3        Simpler: "4,#,#" for leaf 4
   / \ /         "2,4,#,#,#,4,#,#" for node 2's subtree
  4  4 2         "4,#,#" → seen TWICE → add node
      /
      4

Result: [node with val 2, node with val 4] (one representative each)
```

---

## Problem Description

| #    | Title                                 | Difficulty | Pattern              |
| ---- | ------------------------------------- | ---------- | -------------------- |
| 297  | Serialize and Deserialize Binary Tree | 🔴 Hard    | DFS Serialization    |
| 572  | Subtree of Another Tree               | 🟢 Easy    | DFS + Hashing        |
| 652  | Find Duplicate Subtrees               | 🟡 Medium  | This problem         |
| 1948 | Delete Duplicate Folders in System    | 🔴 Hard    | Trie + Serialization |

---

## 📝 Interview Tips

- 🇻🇳 Serialize post-order: `serialize(left) + "," + serialize(right) + "," + val`.
- 🇬🇧 Post-order serialization: left_str + delimiter + right_str + delimiter + val.
- 🇻🇳 Dùng `"#"` cho null node để phân biệt cấu trúc khác nhau có cùng giá trị.
- 🇬🇧 Use `"#"` for null nodes — distinguishes `[1,null,2]` from `[1,2,null]`.
- 🇻🇳 Chỉ thêm vào result khi count === 2 (lần thứ hai thấy), không thêm lần 3 trở đi.
- 🇬🇧 Add to result only when count becomes exactly 2 — prevents duplicate root entries.

---

## Solutions

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

// ─── Solution 1: Post-order DFS serialization + HashMap ───
// Time: O(n²) worst case (string concat)  Space: O(n²)
function findDuplicateSubtrees(root: TreeNode | null): Array<TreeNode | null> {
  const count = new Map<string, number>();
  const result: TreeNode[] = [];

  function serialize(node: TreeNode | null): string {
    if (!node) return "#";
    const left = serialize(node.left);
    const right = serialize(node.right);
    const key = `${left},${right},${node.val}`;
    const c = (count.get(key) ?? 0) + 1;
    count.set(key, c);
    if (c === 2) result.push(node); // first duplicate found
    return key;
  }

  serialize(root);
  return result;
}

// ─── Solution 2: Integer ID encoding (avoids long string keys) ───
// Time: O(n)  Space: O(n) — assigns integer ID to each unique subtree structure
function findDuplicateSubtrees2(root: TreeNode | null): Array<TreeNode | null> {
  const tripletToId = new Map<string, number>();
  const count = new Map<number, number>();
  const result: TreeNode[] = [];
  let nextId = 1;

  function dfs(node: TreeNode | null): number {
    if (!node) return 0; // ID 0 = null
    const left = dfs(node.left);
    const right = dfs(node.right);
    const key = `${left},${right},${node.val}`;
    let id = tripletToId.get(key);
    if (id === undefined) {
      id = nextId++;
      tripletToId.set(key, id);
    }
    const c = (count.get(id) ?? 0) + 1;
    count.set(id, c);
    if (c === 2) result.push(node);
    return id;
  }

  dfs(root);
  return result;
}

// ─── Solution 3: Path-based serialization with array join ───
// Alternative string building using array accumulation
function findDuplicateSubtrees3(root: TreeNode | null): Array<TreeNode | null> {
  const seen = new Map<string, number>();
  const result: TreeNode[] = [];

  function dfs(node: TreeNode | null): string {
    if (!node) return "N";
    const s = `(${dfs(node.left)})(${dfs(node.right)})${node.val}`;
    const cnt = (seen.get(s) ?? 0) + 1;
    seen.set(s, cnt);
    if (cnt === 2) result.push(node);
    return s;
  }

  dfs(root);
  return result;
}

// ─── Tests ───
function makeTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length) return null;
  const root = new TreeNode(vals[0] as number);
  const q: TreeNode[] = [root];
  let i = 1;
  while (i < vals.length) {
    const node = q.shift()!;
    if (vals[i] !== null) {
      node.left = new TreeNode(vals[i] as number);
      q.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = new TreeNode(vals[i] as number);
      q.push(node.right);
    }
    i++;
  }
  return root;
}

const t1 = makeTree([1, 2, 3, 4, null, 2, 4, null, null, 4]);
const r1 = findDuplicateSubtrees(t1);
console.log(r1.map((n) => n?.val)); // [4, 2] (order may vary)

const t2 = makeTree([2, 1, 1]);
const r2 = findDuplicateSubtrees2(t2);
console.log(r2.map((n) => n?.val)); // [1]

const t3 = makeTree([2, 2, 2, 3, null, 3, null]);
const r3 = findDuplicateSubtrees3(t3);
console.log(r3.map((n) => n?.val)); // [3, 2] (inner subtrees first)
```

---

## 🔗 Related Problems

| #    | Title                                 | Difficulty | Pattern              |
| ---- | ------------------------------------- | ---------- | -------------------- |
| 297  | Serialize and Deserialize Binary Tree | 🔴 Hard    | DFS Serialization    |
| 572  | Subtree of Another Tree               | 🟢 Easy    | DFS + Hashing        |
| 652  | Find Duplicate Subtrees               | 🟡 Medium  | This problem         |
| 1948 | Delete Duplicate Folders in System    | 🔴 Hard    | Trie + Serialization |
