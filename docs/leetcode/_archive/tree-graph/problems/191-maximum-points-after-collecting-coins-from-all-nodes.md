---
layout: page
title: "Maximum Points After Collecting Coins From All Nodes"
difficulty: Hard
category: Tree-Graph
tags: [Array, Dynamic Programming, Bit Manipulation, Tree, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/maximum-points-after-collecting-coins-from-all-nodes"
---

# Maximum Points After Collecting Coins From All Nodes / Điểm Tối Đa Sau Khi Thu Thập Xu Từ Tất Cả Các Node

🔴 Hard | Tree DP | Bit Manipulation

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Mỗi node là một kho xu. Bạn có hai lựa chọn: lấy **nửa** (floor(coins/2)) và trừ k, hoặc lấy **tất cả** (coins) và giảm coins trẻ em đi 2^depth (dịch bit phải). Sau log2(max_coins) ≈ 14 lần, mọi node đều có 0 xu — không cần đi sâu hơn.

```
Node: coins=10, k=1
Option A: take 10, pass 10>>0=10 to children
Option B: take floor(10/2)-k=4, pass 10>>1=5 to children

DFS state: (node, shift) where shift = number of halvings so far
```

**Key insight:** Use DFS with `(node, shift)` state. `shift` represents how many times the subtree has been halved. Since `coins[i] <= 10^4 < 2^14`, after 14 halvings all values are 0. Memoize with `dp[node][shift]`.

## Problem Description

Given a tree with `n` nodes (0-rooted), coins at each node, and constant `k`. At each node you must choose: (A) take `coins[node] - k` points and halve all coins in the subtree for next level, or (B) take `floor(coins[node] / 2)` points. Return max total points.

**Example 1:**

- Input: `edges=[[0,1],[1,2],[2,3]], coins=[10,10,3,3], k=5`
- Output: `11`

**Example 2:**

- Input: `edges=[[0,1],[0,2]], coins=[1,2,3], k=1`
- Output: `6`

## 📝 Interview Tips

- **Q: Why limit shift to ~14? / Tại sao giới hạn shift ở ~14?**
  - A: Max coins = 10^4 < 2^14, so after 14 halvings all values = 0 / Sau 14 lần, mọi giá trị = 0.
- **Q: What does shift represent? / Shift biểu thị gì?**
  - A: Number of halving operations applied to ancestors choosing option A / Số lần chia đôi từ tổ tiên chọn phương án A.
- **Q: Time complexity? / Độ phức tạp?**
  - A: O(n _ 14) = O(n) since max meaningful shift is 14 / O(n _ 14) = O(n).
- **Q: How build the tree? / Xây dựng cây thế nào?**
  - A: Build adjacency list, root at 0, DFS with parent tracking / Dùng danh sách kề, gốc là 0, DFS theo dõi cha.
- **Q: Can we use memoization? / Có thể dùng ghi nhớ không?**
  - A: Yes — dp[node][shift] since same node with same shift always gives same answer / Có — dp[node][shift].
- **Q: Option A vs Option B? / Phương án A vs B?**
  - A: A: take `(coins >> shift) - k` + recurse with shift. B: take `(coins >> (shift+1))` + recurse with shift+1 / Mô tả hai lựa chọn.

## Solutions

### Solution 1: DFS + Memoization with Shift

```typescript
/**
 * Maximum points from tree coin collection.
 * Time: O(n * log(maxCoin))  Space: O(n * log(maxCoin))
 */
function maximumPoints(edges: number[][], coins: number[], k: number): number {
  const n = coins.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const MAX_SHIFT = 14;
  // dp[node][shift] = max points from subtree rooted at node with shift halvings
  const dp: number[][] = Array.from({ length: n }, () => new Array(MAX_SHIFT).fill(-1));

  function dfs(node: number, parent: number, shift: number): number {
    if (shift >= MAX_SHIFT) return 0;
    if (dp[node][shift] !== -1) return dp[node][shift];

    const coin = coins[node] >> shift;

    // Option A: take (coin - k), recurse children with same shift
    let optionA = coin - k;
    for (const child of adj[node]) {
      if (child === parent) continue;
      optionA += dfs(child, node, shift);
    }

    // Option B: take floor(coin/2), recurse children with shift+1
    let optionB = coin >> 1;
    for (const child of adj[node]) {
      if (child === parent) continue;
      optionB += dfs(child, node, shift + 1);
    }

    dp[node][shift] = Math.max(optionA, optionB);
    return dp[node][shift];
  }

  return dfs(0, -1, 0);
}

// Tests
console.log(
  maximumPoints(
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    [10, 10, 3, 3],
    5,
  ),
); // 11
console.log(
  maximumPoints(
    [
      [0, 1],
      [0, 2],
    ],
    [1, 2, 3],
    1,
  ),
); // 6
console.log(maximumPoints([[0, 1]], [10000, 10000], 1)); // 19998
```

### Solution 2: Iterative DFS with Explicit Stack

```typescript
/**
 * Maximum points using iterative post-order DFS.
 * Time: O(n * 14)  Space: O(n * 14)
 */
function maximumPointsIter(edges: number[][], coins: number[], k: number): number {
  const n = coins.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const MAX_SHIFT = 14;
  const dp: number[][] = Array.from({ length: n }, () => new Array(MAX_SHIFT).fill(-1));
  const parent = new Array(n).fill(-1);

  // Compute post-order
  const order: number[] = [];
  const visited = new Array(n).fill(false);
  const stack = [0];
  visited[0] = true;
  while (stack.length) {
    const u = stack.pop()!;
    order.push(u);
    for (const v of adj[u]) {
      if (!visited[v]) {
        visited[v] = true;
        parent[v] = u;
        stack.push(v);
      }
    }
  }
  order.reverse(); // leaves first

  for (const node of order) {
    const par = parent[node];
    for (let shift = MAX_SHIFT - 1; shift >= 0; shift--) {
      const coin = coins[node] >> shift;
      let optA = coin - k;
      let optB = coin >> 1;
      for (const child of adj[node]) {
        if (child === par) continue;
        optA += shift < MAX_SHIFT - 1 ? (dp[child][shift] ?? 0) : 0;
        optB += shift + 1 < MAX_SHIFT ? (dp[child][shift + 1] ?? 0) : 0;
      }
      dp[node][shift] = Math.max(optA, optB);
    }
  }

  return dp[0][0];
}

// Tests
console.log(
  maximumPointsIter(
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    [10, 10, 3, 3],
    5,
  ),
); // 11
console.log(
  maximumPointsIter(
    [
      [0, 1],
      [0, 2],
    ],
    [1, 2, 3],
    1,
  ),
); // 6
```

## 🔗 Related Problems

| #    | Problem                                          | Difficulty | Key Concept    |
| ---- | ------------------------------------------------ | ---------- | -------------- |
| 337  | House Robber III                                 | Medium     | Tree DP        |
| 968  | Binary Tree Cameras                              | Hard       | Tree DP/Greedy |
| 979  | Distribute Coins in Binary Tree                  | Medium     | Tree DFS       |
| 2538 | Difference Between Maximum and Minimum Price Sum | Hard       | Tree DP        |
