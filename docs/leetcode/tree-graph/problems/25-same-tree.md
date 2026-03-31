---
layout: page
title: "Same Tree"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/same-tree"
---

# Same Tree / Hai Cây Giống Nhau

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS / BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 11 companies
> **See also**: [Symmetric Tree](https://leetcode.com/problems/symmetric-tree) | [Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** So sánh hai bản cây gia phả song song — bắt đầu từ gốc, kiểm tra từng thế hệ. Nếu cả hai trống thì giống nhau. Nếu một cái trống còn cái kia không — khác nhau. Nếu giá trị khác nhau — khác nhau. Còn lại: đệ quy kiểm tra cháu tiếp theo.

**Pattern:** Recursive DFS — cùng một lúc duyệt hai cây song song; BFS dùng queue để duyệt theo tầng.

```
Tree p:       Tree q:
    1             1
   / \           / \
  2   3         2   3

DFS check:
  p(1) == q(1) ✅ → recurse left, recurse right
  p(2) == q(2) ✅ → recurse left (null==null✅), right (null==null✅)
  p(3) == q(3) ✅ → same
  → return true ✅
```

---

Cho hai cây nhị phân `p` và `q`, kiểm tra xem chúng có **giống nhau về cấu trúc lẫn giá trị** hay không.

- `p = [1,2,3], q = [1,2,3]` → `true`
- `p = [1,2], q = [1,null,2]` → `false` (cấu trúc khác)
- `p = [1,2,1], q = [1,1,2]` → `false` (giá trị khác)

---

## 📝 Interview Tips / Mẹo Phỏng Vấn

- 🇻🇳 **Ba base cases**: cả hai null (true), một null (false), giá trị khác nhau (false)
- 🇺🇸 **Recursive DFS**: most concise; T = O(n), S = O(h) where h = tree height
- 🇻🇳 **BFS với queue**: hữu ích khi interviewer hỏi iterative solution; process node pairs mỗi step
- 🇺🇸 **Enqueue both trees in sync**: push `[pNode, qNode]` pairs; null nodes are valid entries
- 🇻🇳 **Edge case**: cả hai null → true; một null → false — phải check trước khi truy cập `.val`
- 🇺🇸 **Worst case O(n)**: must visit every node to confirm equality; no early partial match

---

## Solutions

### Solution 1: Recursive DFS — O(n) time, O(h) space

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

/**
 * Recursively compare nodes pair by pair in DFS order
 * Time: O(n) | Space: O(h) call stack where h = tree height
 */
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (p === null && q === null) return true; // both empty → same
  if (p === null || q === null) return false; // one empty, one not → different
  if (p.val !== q.val) return false; // values differ → different

  // Recurse on both children simultaneously
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

// Build helper
const node = (v: number, l: TreeNode | null = null, r: TreeNode | null = null) =>
  new TreeNode(v, l, r);

// Tests
const p1 = node(1, node(2), node(3));
const q1 = node(1, node(2), node(3));
console.log(isSameTree(p1, q1)); // true

const p2 = node(1, node(2));
const q2 = node(1, null, node(2));
console.log(isSameTree(p2, q2)); // false

console.log(isSameTree(null, null)); // true
console.log(isSameTree(node(1), null)); // false
```

### Solution 2: Iterative BFS with Queue — O(n) time, O(n) space

```typescript
/**
 * Use a queue of node-pairs; process level by level, comparing each pair
 * Time: O(n) | Space: O(n) for queue (worst: full last level)
 */
function isSameTreeBFS(p: TreeNode | null, q: TreeNode | null): boolean {
  const queue: Array<[TreeNode | null, TreeNode | null]> = [[p, q]];

  while (queue.length > 0) {
    const [nodeP, nodeQ] = queue.shift()!;

    if (nodeP === null && nodeQ === null) continue; // both null → ok, skip
    if (nodeP === null || nodeQ === null) return false;
    if (nodeP.val !== nodeQ.val) return false;

    // Enqueue children pairs in sync
    queue.push([nodeP.left, nodeQ.left]);
    queue.push([nodeP.right, nodeQ.right]);
  }

  return true;
}

const p3 = node(1, node(2), node(3));
const q3 = node(1, node(2), node(3));
console.log(isSameTreeBFS(p3, q3)); // true

const p4 = node(1, node(2), node(1));
const q4 = node(1, node(1), node(2));
console.log(isSameTreeBFS(p4, q4)); // false
```

---

## 🔗 Related Problems / Bài Liên Quan

| Problem                                                                                                      | Difficulty | Pattern                  |
| ------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------ |
| [Symmetric Tree](https://leetcode.com/problems/symmetric-tree)                                               | 🟢 Easy    | Mirror comparison DFS    |
| [Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree)                             | 🟢 Easy    | isSameTree as subroutine |
| [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) | 🔴 Hard    | BFS level-order          |
