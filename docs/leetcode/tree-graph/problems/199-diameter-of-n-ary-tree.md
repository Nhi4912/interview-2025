---
layout: page
title: "Diameter of N-Ary Tree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/diameter-of-n-ary-tree"
---

# diameter of n ary tree

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Vietnamese analogy:** Đường kính cây = con đường dài nhất giữa 2 lá. Tại mỗi node, đường dài nhất qua node đó = 2 nhánh sâu nhất cộng lại. Track max trong suốt quá trình DFS.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
        1
      / | \
     2  3  4
    /\      \
   5  6      7
              \
               8

Deepest paths at node 1:
  top-2 depths = depth(2)=2, depth(4)=2
  diameter candidate = 2 + 2 = 4
```

---

---

## Problem Description

Given the `root` of an N-ary tree, return the **diameter** — the length of the longest path between any two nodes. The path does **not** need to pass through the root.

**Example:**

- Input: `root = [1,null,2,3,4,null,5,6]`
- Output: `3`

**Constraints:**

- `1 <= n <= 10^4` (number of nodes)
- Depth of tree ≤ `1000`

---

---

## 📝 Interview Tips

- 🔑 Diameter at any node = sum of **top-2 longest child depths**
- 🔑 DFS returns **height** (max depth from node to leaf), updates global diameter
- 🔑 For leaf nodes: height = 0 (no edges below)
- ⚠️ N-ary: collect all child heights, sort/partial-sort to get top 2
- ⚠️ If node has only one child, diameter through it = that child's height (only 1 branch)
- 💡 No need to fully sort — just track top two in one pass through children

---

---

## Solutions

```typescript
class Node {
  val: number;
  children: Node[];
  constructor(val?: number) {
    this.val = val === undefined ? 0 : val;
    this.children = [];
  }
}

function diameter(root: Node | null): number {
  let maxDiameter = 0;

  function dfs(node: Node | null): number {
    if (!node) return -1;

    let top1 = -1,
      top2 = -1; // top 2 child heights

    for (const child of node.children) {
      const h = dfs(child);
      if (h > top1) {
        top2 = top1;
        top1 = h;
      } else if (h > top2) {
        top2 = h;
      }
    }

    // Diameter through this node: (top1 + 1) + (top2 + 1) if two children exist
    const localDiam = top1 + 1 + (top2 + 1);
    maxDiameter = Math.max(maxDiameter, localDiam);

    return top1 + 1; // height of this node
  }

  dfs(root);
  return maxDiameter;
}

function diameterV2(root: Node | null): number {
  let ans = 0;

  function height(node: Node | null): number {
    if (!node) return 0;

    const childHeights = node.children.map(height);
    childHeights.sort((a, b) => b - a);

    // Longest path through this node uses top 2 branches
    const pathLen = (childHeights[0] ?? 0) + (childHeights[1] ?? 0);
    ans = Math.max(ans, pathLen);

    return (childHeights[0] ?? 0) + 1;
  }

  height(root);
  return ans;
}

function diameterIterative(root: Node | null): number {
  if (!root) return 0;

  let ans = 0;
  const heightMap = new Map<Node, number>();
  const stack: Node[] = [];
  const visited = new Set<Node>();
  stack.push(root);

  while (stack.length > 0) {
    const node = stack[stack.length - 1];
    const allChildrenDone = node.children.every((c) => heightMap.has(c));

    if (node.children.length === 0 || allChildrenDone) {
      stack.pop();
      const childHeights = node.children.map((c) => heightMap.get(c)!).sort((a, b) => b - a);
      const pathLen = (childHeights[0] ?? 0) + (childHeights[1] ?? 0);
      ans = Math.max(ans, pathLen);
      heightMap.set(node, (childHeights[0] ?? 0) + 1);
    } else if (!visited.has(node)) {
      visited.add(node);
      for (const child of node.children) stack.push(child);
    } else {
      stack.pop();
    }
  }

  return ans;
}
```

---

## 🔗 Related Problems

| #    | Problem                     | Difficulty | Tags      |
| ---- | --------------------------- | ---------- | --------- |
| 543  | Diameter of Binary Tree     | 🟢 Easy    | Tree, DFS |
| 559  | Maximum Depth of N-Ary Tree | 🟢 Easy    | Tree, DFS |
| 687  | Longest Univalue Path       | 🟡 Medium  | Tree, DFS |
| 1245 | Tree Diameter               | 🟡 Medium  | Tree, BFS |
