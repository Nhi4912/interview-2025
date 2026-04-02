---
layout: page
title: "Flip Equivalent Binary Trees"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/flip-equivalent-binary-trees"
---

# Flip Equivalent Binary Trees / Cây nhị phân tương đương khi lật

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Hai cây "tương đương khi lật" nếu bạn có thể lật (hoán đổi trái-phải) bất kỳ số nút nào để chúng giống hệt nhau. Đệ quy: tại mỗi nút, thử cả hai khả năng — **không lật** (so sánh left↔left, right↔right) và **có lật** (so sánh left↔right, right↔left).

**English:** Two trees are flip-equivalent if you can flip (swap left/right children) at any nodes to make them identical. At each node recursively check: "no-flip" match (left↔left, right↔right) **OR** "flip" match (left↔right, right↔left).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Flip Equivalent Binary Trees example:**

```
Tree1:     1          Tree2:     1
          / \                   / \
         2   3                 3   2
        /                           \
       4                             4

At node 1: flip → children become (3,2) ↔ (3,2) ✅
At node 2: flip → (null,4) ↔ (4,null) ✅  → flip equivalent = true
```

---

---

## Problem Description

| #   | Problem                             | Difficulty | Pattern |
| --- | ----------------------------------- | ---------- | ------- |
| 100 | Same Tree                           | Easy       | DFS     |
| 226 | Invert Binary Tree                  | Easy       | DFS     |
| 951 | Flip Equivalent Binary Trees (this) | Medium     | DFS     |

---

## 📝 Interview Tips

- 🔑 **Key insight / Nhận xét chính:** Both null → true; one null → false; values differ → false; then check 2 child arrangements.
- 📊 **Two recursive cases / Hai trường hợp đệ quy:** `noFlip = eq(r1.left,r2.left) && eq(r1.right,r2.right)` OR `flip = eq(r1.left,r2.right) && eq(r1.right,r2.left)`.
- ⚡ **Short-circuit / Ngắn mạch:** Use `||` between the two cases — if noFlip is already true, skip the flip check.
- 🎯 **Value uniqueness / Tính duy nhất:** Node values are unique per tree — this simplifies matching (no ambiguity).
- 🧩 **Edge case / Trường hợp đặc biệt:** Both trees empty → `true`; one empty one not → `false`.
- 📏 **Complexity / Độ phức tạp:** O(n) time where n = min(n1, n2) — stops as soon as a mismatch is found.

---

---

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(v: number, l: TreeNode | null = null, r: TreeNode | null = null) {
    this.val = v;
    this.left = l;
    this.right = r;
  }
}

/**
 * At each node, try matching children in original order OR swapped order.
 *
 * Time:  O(n)  where n = min(size(root1), size(root2))
 * Space: O(h)  recursion depth
 */
function flipEquiv(root1: TreeNode | null, root2: TreeNode | null): boolean {
  if (!root1 && !root2) return true;
  if (!root1 || !root2) return false;
  if (root1.val !== root2.val) return false;

  // No-flip: left matches left, right matches right
  const noFlip = flipEquiv(root1.left, root2.left) && flipEquiv(root1.right, root2.right);
  if (noFlip) return true;

  // Flip: left matches right, right matches left
  return flipEquiv(root1.left, root2.right) && flipEquiv(root1.right, root2.left);
}

// Test
const t1 = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5, new TreeNode(7), null)),
  new TreeNode(3, new TreeNode(6), null),
);
const t2 = new TreeNode(
  1,
  new TreeNode(3, null, new TreeNode(6)),
  new TreeNode(2, new TreeNode(4), new TreeNode(5, null, new TreeNode(7))),
);

console.log(flipEquiv(t1, t2)); // true
console.log(flipEquiv(null, null)); // true
console.log(flipEquiv(new TreeNode(1), new TreeNode(2))); // false

/**
 * Normalize each tree by sorting children at every node by their smaller subtree value.
 * Two trees are flip-equivalent iff their canonical forms are identical.
 *
 * Time:  O(n log n)
 * Space: O(n)
 */
function flipEquiv2(root1: TreeNode | null, root2: TreeNode | null): boolean {
  function canonical(node: TreeNode | null): string {
    if (!node) return "#";
    const l = canonical(node.left);
    const r = canonical(node.right);
    const [a, b] = l <= r ? [l, r] : [r, l]; // sort children
    return `(${node.val},${a},${b})`;
  }
  return canonical(root1) === canonical(root2);
}

console.log(
  flipEquiv2(
    new TreeNode(1, new TreeNode(2), new TreeNode(3)),
    new TreeNode(1, new TreeNode(3), new TreeNode(2)),
  ),
); // true
```

---

## 🔗 Related Problems

| #   | Problem                             | Difficulty | Pattern |
| --- | ----------------------------------- | ---------- | ------- |
| 100 | Same Tree                           | Easy       | DFS     |
| 226 | Invert Binary Tree                  | Easy       | DFS     |
| 951 | Flip Equivalent Binary Trees (this) | Medium     | DFS     |
