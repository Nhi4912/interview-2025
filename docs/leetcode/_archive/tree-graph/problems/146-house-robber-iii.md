---
layout: page
title: "House Robber III"
difficulty: Medium
category: Tree-Graph
tags: [Dynamic Programming, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/house-robber-iii"
---

# House Robber III / Kẻ Cướp Nhà III — Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Tree DP (Post-order DFS)

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI**: Không thể cướp cả cha lẫn con. Mỗi nút có 2 lựa chọn: cướp nó (không cướp con) hoặc không cướp (con tự quyết). DFS hậu thứ tự trả về `[rob, skip]` — giá trị tối đa khi cướp/không cướp nút này. Combine từ dưới lên.

**EN**: Classic tree DP. Each node returns `[rob_this, skip_this]`. If we rob this node, we can't rob direct children. If we skip, children can independently choose to rob or skip.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — House Robber III example:**

```
       3           rob_this = 3 + skip_left + skip_right
      / \          skip_this = max(rob_l,skip_l) + max(rob_r,skip_r)
     2   3
      \   \     Node 4: [4,0]   Node 5: [5,0]   Node 1: [1,0]
       3   1    Node 2: [2+0, max(0,3)] = [2,3]
               Node 3: [3+0, max(0,1)] = [3,1]
               Root 3: [3+3+1, max(2,3)+max(3,1)] = [7, 3+3=6] → max=7
```

---

## Problem Description

| #    | Title                                | Difficulty | Pattern        |
| ---- | ------------------------------------ | ---------- | -------------- |
| 198  | House Robber                         | 🟡 Medium  | Linear DP      |
| 213  | House Robber II                      | 🟡 Medium  | Circular DP    |
| 968  | Binary Tree Cameras                  | 🔴 Hard    | Tree Greedy/DP |
| 1372 | Longest ZigZag Path in a Binary Tree | 🟡 Medium  | Tree DP        |

---

## 📝 Interview Tips

- 🇻🇳 Trả về `[rob, skip]` từ mỗi DFS — tránh memoization phức tạp với Map<node, value>.
- 🇬🇧 Return `[rob, skip]` pair from each DFS call — cleaner than HashMap memoization.
- 🇻🇳 `rob_this = node.val + skip_left + skip_right` (bắt buộc con phải skip).
- 🇬🇧 `rob_this = node.val + skip_left + skip_right` (force children to be skipped).
- 🇻🇳 `skip_this = max(rob_l, skip_l) + max(rob_r, skip_r)` (con tự quyết tối ưu).
- 🇬🇧 `skip_this = max(rob_l, skip_l) + max(rob_r, skip_r)` (children choose optimally).

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

// ─── Solution 1: Tree DP returning [rob, skip] pair ───
// Time: O(n)  Space: O(h)
function rob(root: TreeNode | null): number {
  function dfs(node: TreeNode | null): [number, number] {
    if (!node) return [0, 0];
    const [robL, skipL] = dfs(node.left);
    const [robR, skipR] = dfs(node.right);
    // Rob this node → must skip direct children
    const robThis = node.val + skipL + skipR;
    // Skip this node → children choose optimally
    const skipThis = Math.max(robL, skipL) + Math.max(robR, skipR);
    return [robThis, skipThis];
  }

  const [robRoot, skipRoot] = dfs(root);
  return Math.max(robRoot, skipRoot);
}

// ─── Solution 2: Memoized recursion (Map<TreeNode, number>) ───
// Time: O(n)  Space: O(n)
function rob2(root: TreeNode | null): number {
  const memo = new Map<TreeNode, number>();

  function robFrom(node: TreeNode | null): number {
    if (!node) return 0;
    if (memo.has(node)) return memo.get(node)!;

    // Option 1: rob this node — skip grandchildren, come back to children's children
    let gain = node.val;
    if (node.left) gain += robFrom(node.left.left) + robFrom(node.left.right);
    if (node.right) gain += robFrom(node.right.left) + robFrom(node.right.right);

    // Option 2: skip this node — rob children
    const skip = robFrom(node.left) + robFrom(node.right);

    const best = Math.max(gain, skip);
    memo.set(node, best);
    return best;
  }

  return robFrom(root);
}

// ─── Solution 3: Iterative post-order with explicit stack ───
// Time: O(n)  Space: O(n)
function rob3(root: TreeNode | null): number {
  if (!root) return 0;
  const robMap = new Map<TreeNode | null, number>();
  const skipMap = new Map<TreeNode | null, number>();
  robMap.set(null, 0);
  skipMap.set(null, 0);

  const stack: TreeNode[] = [];
  const order: TreeNode[] = [];
  let curr: TreeNode | null = root;
  let lastVisited: TreeNode | null = null;

  while (curr || stack.length) {
    if (curr) {
      stack.push(curr);
      curr = curr.left;
    } else {
      const peek = stack[stack.length - 1];
      if (peek.right && lastVisited !== peek.right) curr = peek.right;
      else {
        order.push(stack.pop()!);
        lastVisited = order[order.length - 1];
      }
    }
  }

  for (const node of order) {
    const robThis = node.val + (skipMap.get(node.left) ?? 0) + (skipMap.get(node.right) ?? 0);
    const skipThis =
      Math.max(robMap.get(node.left) ?? 0, skipMap.get(node.left) ?? 0) +
      Math.max(robMap.get(node.right) ?? 0, skipMap.get(node.right) ?? 0);
    robMap.set(node, robThis);
    skipMap.set(node, skipThis);
  }

  return Math.max(robMap.get(root) ?? 0, skipMap.get(root) ?? 0);
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

console.log(rob(makeTree([3, 2, 3, null, 3, null, 1]))); // 7
console.log(rob(makeTree([3, 4, 5, 1, 3, null, 1]))); // 9
console.log(rob2(makeTree([3, 2, 3, null, 3, null, 1]))); // 7
console.log(rob3(makeTree([3, 4, 5, 1, 3, null, 1]))); // 9
```

---

## 🔗 Related Problems

| #    | Title                                | Difficulty | Pattern        |
| ---- | ------------------------------------ | ---------- | -------------- |
| 198  | House Robber                         | 🟡 Medium  | Linear DP      |
| 213  | House Robber II                      | 🟡 Medium  | Circular DP    |
| 968  | Binary Tree Cameras                  | 🔴 Hard    | Tree Greedy/DP |
| 1372 | Longest ZigZag Path in a Binary Tree | 🟡 Medium  | Tree DP        |
