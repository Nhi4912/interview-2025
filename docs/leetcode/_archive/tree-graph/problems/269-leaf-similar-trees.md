---
layout: page
title: "Leaf-Similar Trees"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/leaf-similar-trees"
---

# Leaf-Similar Trees / Cây Tương Đồng Về Lá

> **Track**: Tree-Graph | **Difficulty**: 🟢 Easy | **Pattern**: DFS — Leaf Sequence Collection
> **Frequency**: 📘 Tier 3 — Gặp ở Facebook, Google (warm-up tree problem)
> **See also**: [100 Same Tree](https://leetcode.com/problems/same-tree) | [101 Symmetric Tree](https://leetcode.com/problems/symmetric-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng hai cây chuối trong vườn — hình dáng (thân nhánh) khác nhau, nhưng nếu hái trái từ trái sang phải của cả hai cây và xếp thành hàng thì hai hàng trái giống hệt nhau — đó là "leaf-similar". DFS theo thứ tự preorder (trái-phải) tự nhiên thu hoạch lá từ trái sang phải; nếu một node không có con nào thì đó là lá — "quả chín".

**Pattern Recognition:**

- Signal: "binary tree, compare leaf sequences" → **DFS collect leaves + compare arrays**
- Bài này thuộc dạng DFS đơn giản: thu thập lá theo thứ tự, so sánh hai mảng
- Key insight: DFS với điều kiện dừng là leaf (không có con); thứ tự DFS trái→phải cho ra thứ tự lá từ trái sang phải tự nhiên

**Visual — DFS leaf collection:**

```
Tree 1:          Tree 2:
      3                 3
     / \               / \
    5   1             5   1
   /\   /\           /\   /\
  6  2 9  8         6  7 4  2
    /\                      /\
   7  4                    9  8

DFS Tree1 (L→R, leaf = no children):
  3→5→6(leaf!)→2→7(leaf!)→4(leaf!)→1→9(leaf!)→8(leaf!)
  Leaves: [6,7,4,9,8]

DFS Tree2:
  3→5→6(leaf!)→7(leaf!)→1→4(leaf!)→2→9(leaf!)→8(leaf!)
  Leaves: [6,7,4,9,8]

Arrays equal → true ✅
```

---

## Problem Description

Two binary trees are leaf-similar if their leaf value sequence (left-to-right) is the same. Given roots of two binary trees, return true if they are leaf-similar. ([LeetCode](https://leetcode.com/problems/leaf-similar-trees))

```
Example 1: root1=[3,5,1,6,2,9,8,null,null,7,4], root2=[3,5,1,6,7,4,2,null,null,null,null,null,null,9,8] → true
Example 2: root1=[1,2,3], root2=[1,3,2] → false
```

Constraints: 1–200 nodes per tree; 0 ≤ node.val ≤ 200.

---

## 📝 Interview Tips

1. **DFS collect all leaves from each tree, compare arrays** — _DFS thu thập lá mỗi cây vào mảng, so sánh hai mảng — đơn giản và hiệu quả_
2. **Leaf = node with no left and no right child** — _Lá = node không có con trái, không có con phải_
3. **DFS traversal order (left before right) ensures left-to-right leaf order** — _DFS đi trái trước phải → thứ tự lá tự nhiên từ trái sang phải_
4. **No need for in-order vs pre-order distinction — any DFS left-first gives correct leaf order** — _Bất kỳ DFS nào đi trái trước đều cho thứ tự lá đúng_
5. **Compare using array join or element-by-element** — _So sánh mảng bằng join('') hoặc element-by-element đều được_
6. **Follow-up: use generator/iterator for O(1) space comparison without storing full arrays** — _Nâng cao: dùng generator so sánh từng lá một, không cần lưu toàn bộ mảng_

---

## Solutions

```typescript
interface BTreeNode {
  val: number;
  left: BTreeNode | null;
  right: BTreeNode | null;
}

/** Solution 1: DFS collect leaves + compare
 * @complexity Time: O(n1 + n2) | Space: O(h1 + h2 + leaves) */
function leafSimilar(root1: BTreeNode | null, root2: BTreeNode | null): boolean {
  function getLeaves(node: BTreeNode | null, leaves: number[]): void {
    if (!node) return;
    if (!node.left && !node.right) {
      leaves.push(node.val);
      return;
    }
    getLeaves(node.left, leaves);
    getLeaves(node.right, leaves);
  }

  const leaves1: number[] = [],
    leaves2: number[] = [];
  getLeaves(root1, leaves1);
  getLeaves(root2, leaves2);

  if (leaves1.length !== leaves2.length) return false;
  return leaves1.every((v, i) => v === leaves2[i]);
}

/** Solution 2: Generator-based — O(1) extra space for leaf sequence comparison
 * @complexity Time: O(n1 + n2) | Space: O(h1 + h2) */
function leafSimilar2(root1: BTreeNode | null, root2: BTreeNode | null): boolean {
  function* leaves(node: BTreeNode | null): Generator<number> {
    if (!node) return;
    if (!node.left && !node.right) {
      yield node.val;
      return;
    }
    yield* leaves(node.left);
    yield* leaves(node.right);
  }

  const gen1 = leaves(root1);
  const gen2 = leaves(root2);

  while (true) {
    const a = gen1.next();
    const b = gen2.next();
    if (a.done && b.done) return true;
    if (a.done || b.done) return false;
    if (a.value !== b.value) return false;
  }
}

/** Solution 3: String comparison (concise)
 * @complexity Time: O(n1 + n2) | Space: O(leaves) */
function leafSimilar3(root1: BTreeNode | null, root2: BTreeNode | null): boolean {
  const getLeafStr = (node: BTreeNode | null): string => {
    if (!node) return "";
    if (!node.left && !node.right) return `${node.val},`;
    return getLeafStr(node.left) + getLeafStr(node.right);
  };
  return getLeafStr(root1) === getLeafStr(root2);
}

function mkBNode(val: number, l: BTreeNode | null = null, r: BTreeNode | null = null): BTreeNode {
  return { val, left: l, right: r };
}

// === Test Cases ===
const r1 = mkBNode(
  3,
  mkBNode(5, mkBNode(6), mkBNode(2, mkBNode(7), mkBNode(4))),
  mkBNode(1, mkBNode(9), mkBNode(8)),
);
const r2 = mkBNode(
  3,
  mkBNode(5, mkBNode(6), mkBNode(7)),
  mkBNode(1, mkBNode(4), mkBNode(2, mkBNode(9), mkBNode(8))),
);
console.log(leafSimilar(r1, r2)); // true
console.log(leafSimilar2(r1, r2)); // true
console.log(leafSimilar(mkBNode(1, mkBNode(2), mkBNode(3)), mkBNode(1, mkBNode(3), mkBNode(2)))); // false
console.log(leafSimilar3(r1, r2)); // true
```

---

## 🔗 Related Problems

| #   | Problem                   | Difficulty | Pattern             |
| --- | ------------------------- | ---------- | ------------------- |
| 100 | Same Tree                 | Easy       | DFS comparison      |
| 101 | Symmetric Tree            | Easy       | DFS mirroring       |
| 257 | Binary Tree Paths         | Easy       | DFS path collection |
| 872 | Leaf-Similar Trees (this) | Easy       | DFS leaf sequence   |
