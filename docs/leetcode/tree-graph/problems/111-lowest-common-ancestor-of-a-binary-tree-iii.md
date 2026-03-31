---
layout: page
title: "Lowest Common Ancestor of a Binary Tree III"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Two Pointers, Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii"
---

# Lowest Common Ancestor of a Binary Tree III / Tổ Tiên Chung Thấp Nhất (Có Con Trỏ Cha)

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Two Pointers
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống bài toán "gặp nhau tại ngã tư" của hai người đi bộ — người A và B cùng bước lên phía cha. Khi A đến gốc, họ chuyển sang đường của B. Khi B đến gốc, họ chuyển sang đường của A. Họ sẽ gặp nhau tại LCA sau đúng `depth(A) + depth(B) - 2*depth(LCA)` bước — giống bài Intersection of Two Linked Lists!

**Pattern Recognition:**

- Nodes have parent pointers → problem reduces to "Intersection of Two Linked Lists"
- Two pointer approach: when pointer reaches root (null), redirect to other node
- They meet at LCA after traversing equal total depth

**Visual:**

```
Tree:        3
           /   \
          5     1
         / \   / \
        6   2 0   8
           / \
          7   4

LCA(p=5, q=1):
Pointer A: 5 → 3 → null → redirected to 1
Pointer B: 1 → 3 → (meet at 3!) ✅

LCA(p=7, q=0):
A: 7→2→5→3→null→0→8→1→3  (9 steps before meet)
B: 0→1→3→null→7→2→5→3    (8 steps before meet)
Both arrive at 3 simultaneously ✅
```

## Problem Description

Each tree node has `val`, `left`, `right`, AND a `parent` pointer. Given references to two nodes `p` and `q`, return their Lowest Common Ancestor (the deepest node that is an ancestor of both). All values are unique.

**Example 1:** Tree `[3,5,1,6,2,0,8,null,null,7,4]`, `p=5, q=1` → node `3`
**Example 2:** Same tree, `p=5, q=4` → node `5`

**Constraints:** `2 <= n <= 10^5`, `p != q`, both nodes guaranteed to exist.

## 📝 Interview Tips

1. **Clarify**: Nodes có parent pointer không? (Có, đây là LCA III) / Confirm parent pointers exist — that's what makes this different from LCA I/II.
2. **Approach**: Giống bài "Intersection of Two Linked Lists" — hai pointer cùng bước lên cha, đổi đường khi về null / Like linked list intersection: two pointers, swap start when reaching null.
3. **Edge cases**: p là tổ tiên của q → họ sẽ gặp nhau tại p / If p is ancestor of q, they meet at p.
4. **Optimize**: HashSet O(h) space vs Two Pointers O(1) extra space / HashSet is simpler; two-pointer saves space.
5. **Test**: Thử p và q ở cùng subtree; thử p là root / Test same subtree; test p is root.
6. **Follow-up**: Nếu không có parent pointer? → Bài LCA I (dùng recursion trên root) / Without parent pointers → standard LCA I approach.

## Solutions

```typescript
class NodeWithParent {
  val: number;
  left: NodeWithParent | null;
  right: NodeWithParent | null;
  parent: NodeWithParent | null;
  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

/** Solution 1: Two Pointers (Intersection of Two Linked Lists trick)
 * Time: O(h) | Space: O(1)
 * pPtr and qPtr walk up to root, then switch to the other's start
 */
function lowestCommonAncestorIII(p: NodeWithParent, q: NodeWithParent): NodeWithParent {
  let a: NodeWithParent | null = p;
  let b: NodeWithParent | null = q;

  while (a !== b) {
    // Move up; when reaching null (root's parent), redirect to other node
    a = a === null ? q : a.parent;
    b = b === null ? p : b.parent;
  }

  return a!;
}

/** Solution 2: HashSet — collect ancestors of p, then walk q upward
 * Time: O(h) | Space: O(h)
 */
function lowestCommonAncestorIIIHash(p: NodeWithParent, q: NodeWithParent): NodeWithParent {
  const ancestors = new Set<NodeWithParent>();

  // Collect all ancestors of p (including p itself)
  let curr: NodeWithParent | null = p;
  while (curr !== null) {
    ancestors.add(curr);
    curr = curr.parent;
  }

  // Walk q upward until we hit an ancestor of p
  let node: NodeWithParent | null = q;
  while (node !== null) {
    if (ancestors.has(node)) return node;
    node = node.parent;
  }

  // Should never reach here if both nodes are in the tree
  return p;
}

/** Solution 3: Depth alignment — bring both to same depth then walk together
 * Time: O(h) | Space: O(1)
 */
function lowestCommonAncestorIIIDepth(p: NodeWithParent, q: NodeWithParent): NodeWithParent {
  function getDepth(node: NodeWithParent): number {
    let d = 0;
    let curr: NodeWithParent | null = node;
    while (curr !== null) {
      d++;
      curr = curr.parent;
    }
    return d;
  }

  let depthP = getDepth(p);
  let depthQ = getDepth(q);
  let a: NodeWithParent | null = p;
  let b: NodeWithParent | null = q;

  // Bring deeper node to same depth
  while (depthP > depthQ) {
    a = a!.parent;
    depthP--;
  }
  while (depthQ > depthP) {
    b = b!.parent;
    depthQ--;
  }

  // Walk up together
  while (a !== b) {
    a = a!.parent;
    b = b!.parent;
  }
  return a!;
}

// Helper to build test tree with parent pointers
function buildWithParents(): { nodes: Map<number, NodeWithParent> } {
  const vals = [3, 5, 1, 6, 2, 0, 8, 7, 4];
  const nodes = new Map(vals.map((v) => [v, new NodeWithParent(v)]));
  const [n3, n5, n1, n6, n2, n0, n8, n7, n4] = vals.map((v) => nodes.get(v)!);
  n3.left = n5;
  n3.right = n1;
  n5.left = n6;
  n5.right = n2;
  n5.parent = n3;
  n1.left = n0;
  n1.right = n8;
  n1.parent = n3;
  n6.parent = n5;
  n2.left = n7;
  n2.right = n4;
  n2.parent = n5;
  n0.parent = n1;
  n8.parent = n1;
  n7.parent = n2;
  n4.parent = n2;
  return { nodes };
}

const { nodes } = buildWithParents();
console.log(lowestCommonAncestorIII(nodes.get(5)!, nodes.get(1)!).val); // 3
console.log(lowestCommonAncestorIII(nodes.get(5)!, nodes.get(4)!).val); // 5
console.log(lowestCommonAncestorIIIHash(nodes.get(5)!, nodes.get(1)!).val); // 3
console.log(lowestCommonAncestorIIIDepth(nodes.get(7)!, nodes.get(0)!).val); // 3
```

## 🔗 Related Problems

| Problem                                                                                                          | Relationship                                 |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [Intersection of Two Linked Lists](https://leetcode.com/problems/intersection-of-two-linked-lists)               | Exact same two-pointer trick                 |
| [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | LCA I — no parent pointer, use DFS from root |
| [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree)         | Uses LCA + BFS with parent pointers          |
