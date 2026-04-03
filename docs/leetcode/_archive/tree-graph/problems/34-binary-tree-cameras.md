---
layout: page
title: "Binary Tree Cameras"
difficulty: Hard
category: Tree-Graph
tags: [Dynamic Programming, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/binary-tree-cameras"
---

# Binary Tree Cameras / Camera Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy DFS (3-State Post-order)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như lắp đèn đường để chiếu sáng mọi ngôi nhà với số đèn ít nhất — mỗi đèn chiếu sáng chính nó và các nhà kế bên. Chiến lược tham lam: **đặt camera ở cha của node lá** thay vì ở lá, vì camera ở cha "bao phủ" cả cha, hai con, và cha của cha. Post-order DFS (xử lý con trước cha) là chìa khóa.

**Pattern Recognition:**

- Signal: "minimum cameras" + "cover all nodes" + "tree structure" → **Greedy post-order DFS**
- 3 states per node: `0` = not covered, `1` = has camera, `2` = covered (by child)
- Key insight: Never place camera at leaves — always place at parent of uncovered nodes

**Visual — 3-state greedy DFS:**

```
Tree:     0           States: 0=uncovered, 1=has-camera, 2=covered
         / \
        0   0         Post-order DFS (leaves first):
       /               Leaf node → return 0 (not covered, no camera)
      0                Parent of leaf: child=0 → place camera here → return 1
                       Parent of camera: child=1 → covered → return 2

Example: [0,0,null,0,0]
          1           ← not covered by children → +1 camera at root
         /
        2             ← covered by child camera
       / \
    cam   cam         ← children uncovered → place cameras here (+2)
     |     |
    leaf  leaf        ← return 0 (uncovered)

Total cameras = 1 (root may not need it — check carefully)
Answer: 1 camera for [0,0,null,0,null,0,null,null,0] = 2
```

---

## Problem Description

Given a binary tree, place cameras on nodes such that **every node is monitored**. A camera at a node monitors its parent, itself, and its children. Return the **minimum number of cameras** needed.

**Example 1:**

- Input: `root = [0,0,null,0,0]` → Output: `1`

**Example 2:**

- Input: `root = [0,0,null,0,null,0,null,null,0]` → Output: `2`

**Constraints:**

- Number of nodes: `[1, 1000]`
- `Node.val == 0`

---

## 📝 Interview Tips

1. **Clarify**: "Camera phủ những node nào? Chỉ cha-con trực tiếp hay cả cháu?" / Does camera cover only direct parent/children, or grandchildren too?
2. **Greedy insight**: "Không bao giờ đặt camera ở lá — luôn đặt ở cha của node chưa được phủ" / Leaves should never hold cameras; their parents always give better coverage
3. **3 states**: "0=chưa phủ, 1=có camera, 2=đã phủ — xử lý null node trả về 2 (covered by default)" / Null nodes return 2 to avoid spurious camera placement
4. **Root edge case**: "Sau DFS, nếu root trả về 0 (chưa phủ) thì phải thêm 1 camera ở root" / After DFS, if root returns 0, add one camera at root
5. **DP alternative**: "Có thể dùng DP tree với 3 states mỗi node — nhưng greedy đơn giản hơn" / Tree DP with 3 states works but greedy is simpler
6. **Complexity**: "O(n) time, O(h) space — h là chiều cao cây" / O(n) time, O(h) call stack space

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

/**
 * Solution 1: Tree DP (3 states per node)
 * Time: O(n) — each node processed once
 * Space: O(h) — recursion depth equals tree height
 *
 * dp(node) returns [minCams_with_camera, minCams_covered, minCams_not_covered]
 */
function minCamerasCoverDP(root: TreeNode | null): number {
  // Returns [cost if has camera, cost if covered by child, cost if not covered]
  function dp(node: TreeNode | null): [number, number, number] {
    if (!node) return [Infinity, 0, 0]; // null: no camera needed, already "covered"
    const [lc, lv, ln] = dp(node.left);
    const [rc, rv, rn] = dp(node.right);
    // Place camera here: both children are covered (take min of their states)
    const withCamera = 1 + Math.min(lc, lv, ln) + Math.min(rc, rv, rn);
    // Covered by at least one child camera
    const covered = Math.min(
      lc + Math.min(rc, rv), // left has camera
      rv + Math.min(lc, lv), // right has camera
      lc + rc, // both have cameras
    );
    // Not covered (parent must place camera): use min of children states
    const notCovered = Math.min(lc, lv) + Math.min(rc, rv);
    return [withCamera, covered, notCovered];
  }
  const [withCam, covered] = dp(root);
  return Math.min(withCam, covered);
}

/**
 * Solution 2: Greedy Post-order DFS (optimal & simpler)
 * Time: O(n) — single post-order traversal
 * Space: O(h) — recursion stack
 *
 * States: 0 = not covered, 1 = has camera, 2 = covered (no camera needed)
 * Rules:
 *   - If any child is NOT covered (0) → place camera here, return 1
 *   - If any child HAS camera (1) → this node is covered, return 2
 *   - Otherwise (all children covered) → return 0 (not covered, ask parent)
 */
function minCameraCover(root: TreeNode | null): number {
  let cameras = 0;

  // Returns: 0=not covered, 1=has camera, 2=covered by child
  function dfs(node: TreeNode | null): number {
    if (!node) return 2; // null nodes are considered "covered"
    const left = dfs(node.left);
    const right = dfs(node.right);

    if (left === 0 || right === 0) {
      // At least one child uncovered → must place camera here
      cameras++;
      return 1;
    }
    if (left === 1 || right === 1) {
      // At least one child has camera → this node is covered
      return 2;
    }
    // Both children covered but no camera → this node is NOT covered
    return 0;
  }

  // If root itself ends up uncovered, add one camera at root
  if (dfs(root) === 0) cameras++;
  return cameras;
}

// === Test Cases ===
function build(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0]!);
  const q = [root];
  let i = 1;
  while (i < vals.length) {
    const n = q.shift()!;
    if (vals[i] !== null) {
      n.left = new TreeNode(vals[i]!);
      q.push(n.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      n.right = new TreeNode(vals[i]!);
      q.push(n.right);
    }
    i++;
  }
  return root;
}

console.log(minCameraCover(build([0, 0, null, 0, 0]))); // 1
console.log(minCameraCover(build([0, 0, null, 0, null, 0, null, null, 0]))); // 2
console.log(minCameraCover(build([0]))); // 1
console.log(minCamerasCoverDP(build([0, 0, null, 0, 0]))); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                        | Pattern        | Difficulty |
| -------------------------------------------------------------------------------------------------------------- | -------------- | ---------- |
| [House Robber III](https://leetcode.com/problems/house-robber-iii)                                             | Tree DP        | Medium     |
| [Distribute Coins in Binary Tree](https://leetcode.com/problems/distribute-coins-in-binary-tree)               | DFS post-order | Medium     |
| [Lowest Common Ancestor of Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) | DFS            | Medium     |
| [Maximum Sum BST in Binary Tree](https://leetcode.com/problems/maximum-sum-bst-in-binary-tree)                 | Tree DP        | Hard       |
| [Longest ZigZag Path in a Binary Tree](https://leetcode.com/problems/longest-zigzag-path-in-a-binary-tree)     | Tree DP / DFS  | Medium     |
