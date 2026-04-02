---
layout: page
title: "Maximum Depth of N-ary Tree"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/maximum-depth-of-n-ary-tree"
---

# maximum depth of n ary tree

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Vietnamese analogy:** Giống như đo chiều cao của cây phả hệ — bạn hỏi mỗi nhánh "mày sâu bao nhiêu?" rồi lấy cái sâu nhất cộng thêm 1 (cho tầng hiện tại).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
        1
      / | \
     3  2  4
    / \
   5   6

DFS returns: max(2, 1, 1) + 1 = 3
```

---

---

## Problem Description

Given the `root` of an N-ary tree, return its **maximum depth** — the number of nodes along the longest path from the root down to the farthest leaf node.

**Example:**

- Input: `root = [1,null,3,2,4,null,5,6]`
- Output: `3`

**Constraints:**

- Total nodes in `[0, 10^4]`
- Depth of tree ≤ `1000`

---

---

## 📝 Interview Tips

- 🔑 **Base case:** empty tree → depth 0; leaf node → depth 1
- 🔑 **DFS approach:** recurse all children, take max + 1
- 🔑 **BFS approach:** count levels as you traverse; level count = depth
- ⚠️ N-ary means `node.children` is an array (could be empty), not just `.left`/`.right`
- ⚠️ Children array may be empty but never null — guard against empty root
- 💡 BFS is sometimes easier to reason about for "depth = level count"

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

function maxDepth(root: Node | null): number {
  if (!root) return 0;
  if (root.children.length === 0) return 1;

  let maxChildDepth = 0;
  for (const child of root.children) {
    maxChildDepth = Math.max(maxChildDepth, maxDepth(child));
  }
  return maxChildDepth + 1;
}

function maxDepthBFS(root: Node | null): number {
  if (!root) return 0;

  const queue: Node[] = [root];
  let depth = 0;

  while (queue.length > 0) {
    depth++;
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      for (const child of node.children) {
        queue.push(child);
      }
    }
  }

  return depth;
}

function maxDepthIterativeDFS(root: Node | null): number {
  if (!root) return 0;

  const stack: [Node, number][] = [[root, 1]];
  let result = 0;

  while (stack.length > 0) {
    const [node, depth] = stack.pop()!;
    result = Math.max(result, depth);
    for (const child of node.children) {
      stack.push([child, depth + 1]);
    }
  }

  return result;
}
```

---

## 🔗 Related Problems

| #    | Problem                      | Difficulty | Tags      |
| ---- | ---------------------------- | ---------- | --------- |
| 104  | Maximum Depth of Binary Tree | 🟢 Easy    | Tree, DFS |
| 111  | Minimum Depth of Binary Tree | 🟢 Easy    | Tree, BFS |
| 559  | Maximum Depth of N-ary Tree  | 🟢 Easy    | Tree, DFS |
| 1302 | Deepest Leaves Sum           | 🟡 Medium  | Tree, DFS |
