---
layout: page
title: "Difference Between Maximum and Minimum Price Sum"
difficulty: Hard
category: Tree-Graph
tags: [Array, Dynamic Programming, Tree, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/difference-between-maximum-and-minimum-price-sum"
---

# Difference Between Maximum and Minimum Price Sum / Hiệu Tổng Giá Lớn Nhất và Nhỏ Nhất

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Tree DP
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như tìm con đường đắt nhất và rẻ nhất trong thành phố — đường rẻ nhất chỉ cần đi qua một điểm (nút rẻ nhất), còn đường đắt nhất đi qua nhiều nút tích lũy. Hiệu giữa chúng là bài toán cần giải.

**Pattern Recognition:**

- Signal: "tree path" + "max/min sum" → **Tree DP (path through node)**
- Min path = single cheapest node (all prices > 0)
- Max path = tree diameter variant — combine top-2 subtree values at each node

**Visual:**

```
prices = [1, 5, 3, 6, 2]   tree: 0-1, 0-2, 1-3, 1-4

        0(1)
       / \
     1(5) 2(3)
    / \
  3(6) 4(2)

dfs(3) = 6, dfs(4) = 2
dfs(1): best1=6, best2=2 → path_through_1 = 5+6+2=13, returns 5+6=11
dfs(2) = 3
dfs(0): best1=11, best2=3 → path_through_0 = 1+11+3=15
maxPathSum = 15, minPrice = 1 → answer = 15 - 1 = 14
```

## Problem Description

Given an undirected connected tree with n nodes (0-indexed), an edge list, and a price array, find the maximum difference between any two path price sums. A path's price sum is the sum of all node prices along it. Since all prices are positive, the minimum path sum is always `min(price)` (single node), so we need to maximize `maxPathSum - min(price)`.

Example 1: `n=4, edges=[[0,1],[1,2],[1,3]], price=[1,1,1,1]` → `1` (max path=2, min=1)
Example 2: `n=5, edges=[[0,1],[0,2],[1,3],[1,4]], price=[1,5,3,6,2]` → `14`

## 📝 Interview Tips

1. **Clarify**: "Giá có thể âm không?" / Are prices always positive? (Affects min path logic)
2. **Approach**: "Min path = single node vì prices > 0" / With all-positive prices, min = min(price[i])
3. **Max path**: "Dùng tree DP giống diameter — kết hợp top-2 nhánh tại mỗi node" / Tree diameter DP
4. **Edge cases**: "n=1: answer = 0; n=2: answer = max(p0,p1) - min(p0,p1)"
5. **Optimize**: "O(n) DFS — mỗi node xử lý một lần" / Single-pass O(n) DFS
6. **Complexity**: "Time O(n) | Space O(n) cho call stack / adjacency list"

## Solutions

```typescript
class TreeNode2 {
  val: number;
  left: TreeNode2 | null = null;
  right: TreeNode2 | null = null;
  constructor(val = 0) {
    this.val = val;
  }
}

/** Solution 1: Brute Force — DFS from every node
 * Time: O(n²) | Space: O(n)
 */
function maxMinPriceSumBrute(n: number, edges: number[][], price: number[]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const minPrice = Math.min(...price);
  let maxPath = 0;

  function dfs(node: number, parent: number, sum: number): void {
    sum += price[node];
    maxPath = Math.max(maxPath, sum);
    for (const next of adj[node]) {
      if (next !== parent) dfs(next, node, sum);
    }
  }

  for (let i = 0; i < n; i++) dfs(i, -1, 0);
  return maxPath - minPrice;
}

/** Solution 2: Tree DP — combine top-2 branches at each node
 * Time: O(n) | Space: O(n)
 */
function maxMinPriceSum(n: number, edges: number[][], price: number[]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const minPrice = Math.min(...price);
  let maxPathSum = 0;

  // Returns max path sum starting at node going downward
  function dfs(node: number, parent: number): number {
    let best1 = 0,
      best2 = 0;
    for (const child of adj[node]) {
      if (child === parent) continue;
      const childVal = dfs(child, node);
      if (childVal >= best1) {
        best2 = best1;
        best1 = childVal;
      } else if (childVal > best2) {
        best2 = childVal;
      }
    }
    // Path through this node uses top-2 branches
    maxPathSum = Math.max(maxPathSum, price[node] + best1 + best2);
    return price[node] + best1;
  }

  dfs(0, -1);
  return maxPathSum - minPrice;
}

/** Solution 3: Iterative DFS with explicit stack
 * Time: O(n) | Space: O(n)
 */
function maxMinPriceSumIterative(n: number, edges: number[][], price: number[]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const minPrice = Math.min(...price);
  const order: number[] = [];
  const parentArr = new Array(n).fill(-1);
  const visited = new Array(n).fill(false);
  const stack = [0];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited[node]) continue;
    visited[node] = true;
    order.push(node);
    for (const child of adj[node]) {
      if (!visited[child]) {
        parentArr[child] = node;
        stack.push(child);
      }
    }
  }

  const dp = new Array(n).fill(0); // max path going down from node
  let maxPathSum = 0;

  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    let best1 = 0,
      best2 = 0;
    for (const child of adj[node]) {
      if (child === parentArr[node]) continue;
      const val = dp[child];
      if (val >= best1) {
        best2 = best1;
        best1 = val;
      } else if (val > best2) {
        best2 = val;
      }
    }
    maxPathSum = Math.max(maxPathSum, price[node] + best1 + best2);
    dp[node] = price[node] + best1;
  }

  return maxPathSum - minPrice;
}

// Tests
console.log(
  maxMinPriceSum(
    4,
    [
      [0, 1],
      [1, 2],
      [1, 3],
    ],
    [1, 1, 1, 1],
  ),
); // 1
console.log(
  maxMinPriceSum(
    5,
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
    ],
    [1, 5, 3, 6, 2],
  ),
); // 14
console.log(
  maxMinPriceSumBrute(
    5,
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
    ],
    [1, 5, 3, 6, 2],
  ),
); // 14
console.log(
  maxMinPriceSumIterative(
    5,
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
    ],
    [1, 5, 3, 6, 2],
  ),
); // 14
console.log(maxMinPriceSum(2, [[0, 1]], [3, 7])); // 7 (path 0-1 sum=10, min=3, diff=7)
console.log(maxMinPriceSum(1, [], [5])); // 0
```

## 🔗 Related Problems

| Problem                                                                                                                     | Relationship                     |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum)                                  | Same tree DP with top-2 branches |
| [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree)                                            | Same structure, unweighted       |
| [Maximum Points After Collecting Coins](https://leetcode.com/problems/maximum-points-after-collecting-coins-from-all-nodes) | Tree DP variant                  |
