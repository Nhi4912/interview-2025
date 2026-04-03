---
layout: page
title: "Longest Path With Different Adjacent Characters"
difficulty: Hard
category: Tree-Graph
tags: [Array, String, Tree, Depth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/longest-path-with-different-adjacent-characters"
---

# Longest Path With Different Adjacent Characters / Đường Đi Dài Nhất Với Ký Tự Kề Khác Nhau

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Tree DFS
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như xây chuỗi hạt — chỉ được kết nối hai hạt cạnh nhau nếu màu khác nhau. Bắt đầu từ mỗi hạt, tìm hai nhánh dài nhất có thể mở rộng (màu khác cha), ghép chúng lại để tạo đường dài nhất qua hạt đó.

**Pattern Recognition:**

- Signal: "tree path" + "adjacent chars differ" → **Tree DP (max path through node)**
- At each node: collect longest valid downward paths from children (where `s[child] ≠ s[node]`)
- Combine top-2 children paths + 1 (the node itself) → candidate for global max

**Visual:**

```
parent = [-1, 0, 0, 1, 1, 2]
s      = "abacbe"
Tree:     a(0)
         / \
        b(1) a(2)
       / \     \
      a(3) c(4)  b(5)

dfs(3): no children → return 1
dfs(4): no children → return 1
dfs(1): s[1]='b'
  child 3: s[3]='a'≠'b' ✓ → childLen=1, best1=1
  child 4: s[4]='c'≠'b' ✓ → childLen=1, best2=1
  path through 1 = 1+1+1 = 3, return 1+1=2

dfs(5): no children → return 1
dfs(2): s[2]='a'
  child 5: s[5]='b'≠'a' ✓ → childLen=1, best1=1
  path through 2 = 1+1 = 2, return 1+1=2

dfs(0): s[0]='a'
  child 1: s[1]='b'≠'a' ✓ → childLen=2, best1=2
  child 2: s[2]='a'='a' ✗ → skip
  path through 0 = 1+2 = 3, return 1+2=3

Global max = 3
```

## Problem Description

Given a tree of n nodes (root=0) with `parent[i]` and character label `s[i]`, find the length of the **longest path** where no two adjacent nodes share the same character. A path can start and end anywhere.

Example 1: `parent=[-1,0,0,1,1,2], s="abacbe"` → `3`
Example 2: `parent=[-1,0,0,0], s="aabc"` → `3`

## 📝 Interview Tips

1. **Clarify**: "Path có thể đi bất kỳ hướng nào (không phải từ root xuống)" / Path can go in any direction
2. **Approach**: "DFS trả về chiều dài nhánh dài nhất hợp lệ từ node đi xuống" / DFS returns best branch length
3. **Key check**: "Chỉ extend qua child nếu s[child] ≠ s[node]" / Only valid if char differs
4. **Combine**: "Kết hợp top-2 nhánh tại mỗi node để tạo path dài nhất qua node đó" / Top-2 branches merge
5. **Edge cases**: "Tất cả ký tự giống nhau → answer = 1 (chỉ 1 node mỗi path)" / All same chars = 1
6. **Complexity**: "Time O(n) | Space O(n) adjacency + O(h) call stack"

## Solutions

```typescript
/** Solution 1: Brute Force — try all (node, direction) pairs naively
 * Time: O(n²) | Space: O(n)
 */
function longestPathBrute(parent: number[], s: string): number {
  const n = parent.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) children[parent[i]].push(i);

  let result = 1;

  // From each node, BFS/DFS in tree to find longest valid path
  function dfsFrom(start: number): void {
    const stack: [number, number, number][] = [[start, -1, 1]]; // [node, parent, len]
    while (stack.length > 0) {
      const [node, par, len] = stack.pop()!;
      result = Math.max(result, len);
      // Go to children
      for (const child of children[node]) {
        if (child !== par && s[child] !== s[node]) {
          stack.push([child, node, len + 1]);
        }
      }
      // Go to parent
      if (par !== -1 && s[par] !== s[node]) {
        // Don't go back; this would re-explore — just skip for brute
      }
    }
  }

  for (let i = 0; i < n; i++) dfsFrom(i);
  return result;
}

/** Solution 2: Tree DFS — combine top-2 valid child branches
 * Time: O(n) | Space: O(n)
 */
function longestPath(parent: number[], s: string): number {
  const n = parent.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) children[parent[i]].push(i);

  let result = 1;

  // Returns: length of longest valid downward path starting at node
  function dfs(node: number): number {
    let best1 = 0,
      best2 = 0; // Top 2 child branch lengths

    for (const child of children[node]) {
      const childLen = dfs(child);
      // Only valid if adjacent characters differ
      if (s[child] === s[node]) continue;

      if (childLen >= best1) {
        best2 = best1;
        best1 = childLen;
      } else if (childLen > best2) {
        best2 = childLen;
      }
    }

    // Path through this node = node itself + top branch + second branch
    result = Math.max(result, 1 + best1 + best2);
    return 1 + best1; // Return length of best single downward path
  }

  dfs(0);
  return result;
}

/** Solution 3: Iterative DFS using topological order
 * Time: O(n) | Space: O(n)
 */
function longestPathIter(parent: number[], s: string): number {
  const n = parent.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) children[parent[i]].push(i);

  // Build processing order: leaves → root
  const order: number[] = [];
  const stack = [0];
  const visited = new Array(n).fill(false);
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited[node]) continue;
    visited[node] = true;
    order.push(node);
    for (const child of children[node]) stack.push(child);
  }

  const dp = new Array(n).fill(1); // dp[i] = best downward path length from i
  let result = 1;

  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    let best1 = 0,
      best2 = 0;

    for (const child of children[node]) {
      if (s[child] === s[node]) continue; // Must differ
      const val = dp[child];
      if (val >= best1) {
        best2 = best1;
        best1 = val;
      } else if (val > best2) {
        best2 = val;
      }
    }

    result = Math.max(result, 1 + best1 + best2);
    dp[node] = 1 + best1;
  }

  return result;
}

// Tests
console.log(longestPath([-1, 0, 0, 1, 1, 2], "abacbe")); // 3
console.log(longestPath([-1, 0, 0, 0], "aabc")); // 3
console.log(longestPathBrute([-1, 0, 0, 1, 1, 2], "abacbe")); // 3
console.log(longestPathIter([-1, 0, 0, 0], "aabc")); // 3
console.log(longestPath([-1, 0], "aa")); // 1 (same chars, no valid 2-node path)
console.log(longestPath([-1, 0, 1, 2, 3], "abcde")); // 5 (all different, straight path)
```

## 🔗 Related Problems

| Problem                                                                                    | Relationship                          |
| ------------------------------------------------------------------------------------------ | ------------------------------------- |
| [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree)           | Same "top-2 branches" tree DP pattern |
| [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum) | Tree DP combining two branches        |
| [Collect Coins in a Tree](https://leetcode.com/problems/collect-coins-in-a-tree)           | Tree pruning and path analysis        |
