---
layout: page
title: "Number of Nodes With Value One"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/number-of-nodes-with-value-one"
---

# Number of Nodes With Value One / Đếm Nút Có Giá Trị Một

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS / Tree Simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Same Tree](https://leetcode.com/problems/same-tree) | [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như bóng đèn dây chuyền — mỗi lần bật công tắc (query), tất cả đèn từ nút đó lên đến gốc đều thay đổi trạng thái. Đếm bao nhiêu đèn đang sáng sau tất cả thao tác.

**Visual — toggle ancestors in 1-indexed complete binary tree:**

```
n=7 (perfect binary tree):
         1
       /   \
      2     3
     / \   / \
    4   5 6   7

Query 4: toggle path [4→2→1] → nodes 1,2,4 flip
Query 5: toggle path [5→2→1] → nodes 1,2,5 flip

After both queries:
  node 1: toggled 2× → 0 (even)
  node 2: toggled 2× → 0 (even)
  node 4: toggled 1× → 1 (odd)  ← value=1
  node 5: toggled 1× → 1 (odd)  ← value=1
Answer = 2

Optimal insight: count[v] = #queries in subtree of v
value[v] = count[v] % 2
Process bottom-up: count[v] += count[2v] + count[2v+1]
```

---

## Problem Description

Given `n` nodes in a 1-indexed complete binary tree (all values start at 0) and `q` queries. Each query `queries[i]` **toggles** the value of node `queries[i]` and **all its ancestors** (the path to root 1). Return the count of nodes with value 1 after all queries. ([LeetCode 2792](https://leetcode.com/problems/number-of-nodes-with-value-one))

**Example 1:** n=5, queries=[1,2,5] → node 5 path=[5,2,1]; query 2 path=[2,1]; query 1 path=[1]. Count=1.
**Example 2:** n=3, queries=[2,3,3] → 1

**Constraints:** 1 ≤ n ≤ 10⁵, 1 ≤ queries[i] ≤ n, 1 ≤ q ≤ 10⁵.

---

## 📝 Interview Tips

1. **Clarify**: "Toggle là XOR đúng không?" / Each toggle flips 0↔1; even toggles → stays same.
2. **Reframe**: Node v bị toggle bởi query x ↔ x nằm trong subtree của v / Ancestor relationship is symmetric!
3. **Key insight**: count[v] = số queries x mà v là tổ tiên của x = số queries trong subtree(v).
4. **Bottom-up**: Xử lý từ lá lên gốc: count[v] += count[2v] + count[2v+1] / O(n) time.
5. **Edge case**: query targeting root → toggles only root; query q > n → per constraints, won't happen.
6. **Follow-up**: "Nếu queries đến dần (online)?" / Need different structure — BIT on Euler tour.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — trace each query's path to root
 * Time: O(q·log n) — each query traverses O(log n) ancestors
 * Space: O(n)
 */
function numberOfNodesWithValueOneBrute(n: number, queries: number[]): number {
  const value = new Array(n + 1).fill(0);

  for (const q of queries) {
    let node = q;
    while (node >= 1) {
      value[node] ^= 1; // toggle
      node = node >> 1; // go to parent (0-indexed parent of v is v>>1)
    }
  }

  let count = 0;
  for (let i = 1; i <= n; i++) count += value[i];
  return count;
}

/**
 * Solution 2: Optimal — frequency count + bottom-up subtree aggregation
 * Insight: node v is toggled by query x iff x is in subtree of v.
 * So count[v] = number of queries in subtree of v (process bottom-up).
 * Time: O(n + q) — one pass over queries, one bottom-up sweep over n nodes
 * Space: O(n)
 */
function numberOfNodesWithValueOne(n: number, queries: number[]): number {
  const count = new Array(n + 1).fill(0);

  // Tally direct query hits
  for (const q of queries) {
    if (q >= 1 && q <= n) count[q]++;
  }

  // Bottom-up: each node accumulates query count from its subtree
  for (let v = n; v >= 1; v--) {
    if (2 * v <= n) count[v] += count[2 * v];
    if (2 * v + 1 <= n) count[v] += count[2 * v + 1];
  }

  // Count nodes with odd number of toggles
  let result = 0;
  for (let v = 1; v <= n; v++) {
    if (count[v] % 2 === 1) result++;
  }
  return result;
}

// === Test Cases ===
console.log(numberOfNodesWithValueOne(5, [1, 2, 5])); // 1
console.log(numberOfNodesWithValueOne(3, [2, 3, 3])); // 1
console.log(numberOfNodesWithValueOne(7, [4, 5])); // 2
console.log(numberOfNodesWithValueOne(1, [1, 1])); // 0 (toggled twice)
console.log(numberOfNodesWithValueOne(7, [1, 2, 3, 4, 5])); // check manually
```

---

## 🔗 Related Problems

| Problem                                                                                                   | Pattern | Difficulty |
| --------------------------------------------------------------------------------------------------------- | ------- | ---------- |
| [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree)                        | Tree DP | Hard       |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal)      | BFS     | Medium     |
| [Path Sum](https://leetcode.com/problems/path-sum)                                                        | DFS     | Easy       |
| [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree)  | BFS     | Medium     |
| [Number of Nodes With Value One — LeetCode](https://leetcode.com/problems/number-of-nodes-with-value-one) | —       | Medium     |
