---
layout: page
title: "Path Sum II"
difficulty: Medium
category: Tree-Graph
tags: [Backtracking, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/path-sum-ii"
---

# Path Sum II / Tổng Đường Đi II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Path Sum](https://leetcode.com/problems/path-sum) | [Path Sum III](https://leetcode.com/problems/path-sum-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như leo núi tìm tất cả đường lên đỉnh — mỗi khi đến nút lá, kiểm tra xem tổng đường đi có bằng target không. Nếu không, quay lại và thử đường khác (backtrack).

**Pattern Recognition:**

- Signal: "find ALL root-to-leaf paths" + "DFS tree" → **DFS backtracking**
- Cộng dồn sum xuống, trừ dần targetSum. Tại leaf: check `remaining === 0`
- Key insight: push node vào path, đệ quy, pop khi quay về (backtrack)

**Visual — DFS backtrack collecting paths:**

```
Tree: [5,4,8,11,null,13,4,7,2,null,null,null,null,5,1]
Target: 22

       5
      / \
     4   8
    /   / \
   11  13   4
  /  \     / \
 7    2   5   1

DFS path explore:
5→4→11→7  sum=27 ✗ backtrack
5→4→11→2  sum=22 ✓ add [5,4,11,2]
5→8→13    sum=26 ✗ backtrack
5→8→4→5   sum=22 ✓ add [5,8,4,5]
5→8→4→1   sum=18 ✗

Result: [[5,4,11,2], [5,8,4,5]]
```

---

## Problem Description

Cho cây nhị phân và số nguyên `targetSum`. Tìm tất cả đường từ **root đến leaf** mà tổng các node bằng `targetSum`. ([LeetCode](https://leetcode.com/problems/path-sum-ii))

**Example 1:** root=[5,4,8,11,null,13,4,7,2,null,null,null,null,5,1], target=22 → `[[5,4,11,2],[5,8,4,5]]`

**Example 2:** root=[1,2,3], target=5 → `[]`

Constraints: `0 <= n <= 5000`, `-1000 <= val <= 1000`, `-1000 <= targetSum <= 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Path phải từ root đến LEAF, không phải bất kỳ node nào" / Path must go root-to-LEAF, not any path
2. **Backtracking**: "Push → recurse → pop — đừng tạo copy array ở mỗi call" / Use push/pop instead of creating copies each time
3. **When to add**: "Chỉ add khi node là leaf (không có con) VÀ remaining=0" / Add only at leaf nodes, not internal nodes
4. **Deep copy**: "Khi add vào result cần spread [...path] để copy" / Must snapshot path with [...path] when adding to results
5. **Edge cases**: "Root là leaf, target âm, tất cả giá trị âm" / Root is leaf, negative target, all negative values
6. **Follow-up**: "Path Sum III: đường không cần bắt đầu từ root?" / Path Sum III: paths not required to start at root → prefix sum

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
 * Solution 1: DFS with path copy at each level
 * Time: O(n²) — copying path at each leaf O(n paths * O(n) each)
 * Space: O(n²) — storing all paths
 */
function pathSumCopy(root: TreeNode | null, targetSum: number): number[][] {
  const result: number[][] = [];
  function dfs(node: TreeNode | null, remaining: number, path: number[]): void {
    if (!node) return;
    const newPath = [...path, node.val];
    if (!node.left && !node.right && remaining === node.val) {
      result.push(newPath);
      return;
    }
    dfs(node.left, remaining - node.val, newPath);
    dfs(node.right, remaining - node.val, newPath);
  }
  dfs(root, targetSum, []);
  return result;
}

/**
 * Solution 2: DFS Backtracking — push/pop in-place (optimal)
 * Time: O(n²) — O(n) nodes, O(n) copy at each found path
 * Space: O(h) — path stack = tree height, O(h * paths) for results
 */
function pathSum(root: TreeNode | null, targetSum: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function dfs(node: TreeNode | null, remaining: number): void {
    if (!node) return;
    path.push(node.val);
    remaining -= node.val;

    // Leaf node and sum matches
    if (!node.left && !node.right && remaining === 0) {
      result.push([...path]); // snapshot current path
    } else {
      dfs(node.left, remaining);
      dfs(node.right, remaining);
    }

    path.pop(); // backtrack
  }

  dfs(root, targetSum);
  return result;
}

// === Test Cases ===
function build(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] == null) return null;
  const root = new TreeNode(vals[0]!);
  const q = [root];
  let i = 1;
  while (i < vals.length) {
    const node = q.shift()!;
    if (i < vals.length && vals[i] != null) {
      node.left = new TreeNode(vals[i]!);
      q.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] != null) {
      node.right = new TreeNode(vals[i]!);
      q.push(node.right);
    }
    i++;
  }
  return root;
}

console.log(pathSum(build([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, null, 5, 1]), 22));
// [[5,4,11,2],[5,8,4,5]]

console.log(pathSum(build([1, 2, 3]), 5)); // []

console.log(pathSum(build([1, 2]), 1)); // [] (1 is not a leaf)

console.log(pathSum(build([-2, null, -3]), -5)); // [[-2,-3]]
```

---

## 🔗 Related Problems

- [Path Sum](https://leetcode.com/problems/path-sum) — bài cơ bản: chỉ check EXISTS, không cần collect paths
- [Path Sum III](https://leetcode.com/problems/path-sum-iii) — đường không cần bắt đầu từ root → prefix sum map
- [Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths) — collect all root-to-leaf paths as strings
- [Sum Root to Leaf Numbers](https://leetcode.com/problems/sum-root-to-leaf-numbers) — treat path as number, sum all leaf paths
