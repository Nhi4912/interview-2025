---
layout: page
title: "Maximum Star Sum of a Graph"
difficulty: Medium
category: Tree-Graph
tags: [Array, Greedy, Graph, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/maximum-star-sum-of-a-graph"
---

# Maximum Star Sum of a Graph / Tổng sao cực đại của đồ thị

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Một "ngôi sao" là một đỉnh trung tâm và tối đa k hàng xóm của nó. Để tối đa hóa tổng, với mỗi đỉnh: chỉ lấy k hàng xóm có giá trị **dương lớn nhất** (hàng xóm âm không nên chọn).

**English:** A star graph has a center node and up to k neighbors. For each center, greedily pick the top-k **positive** neighbor values. The answer is the maximum over all possible centers.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Maximum Star Sum of a Graph example:**

```
vals=[1,2,3,4,10,-10,-20], edges=[[0,1],[1,2],[1,3],[3,4],[3,5],[3,6]], k=2

Center 3 (val=4):
  neighbors: 1(val=2), 4(val=10), 5(val=-10), 6(val=-20)
  top-2 positive: 10, 2  → star sum = 4 + 10 + 2 = 16  ✅
```

---

---

## Problem Description

| #    | Problem                         | Difficulty | Pattern            |
| ---- | ------------------------------- | ---------- | ------------------ |
| 2497 | Maximum Star Sum (this)         | Medium     | Greedy + Sort      |
| 1962 | Remove Stones to Minimize Total | Medium     | Heap               |
| 215  | Kth Largest Element in Array    | Medium     | Heap / Quickselect |

---

## 📝 Interview Tips

- 🔑 **Key insight / Nhận xét chính:** Only include positive neighbor values — a negative neighbor always decreases the sum.
- 📊 **Sort neighbors / Sắp xếp hàng xóm:** Sort each adjacency list descending, take first min(k, count) positive entries.
- ⚡ **Consider isolated nodes / Đỉnh cô lập:** A node with no neighbors or all-negative neighbors has star sum = vals[node].
- 🎯 **k=0 edge case / k=0:** No neighbors allowed; answer is the maximum node value.
- 🧩 **Negative vals[i] / Giá trị âm:** Even the center can be negative — but we still consider it (it's the max over ALL centers).
- 📏 **Complexity / Độ phức tạp:** O(E log E) for sorting adjacency lists, O(n + E) space.

---

---

## Solutions

```typescript
/**
 * For each node, collect neighbor values, sort descending,
 * add the top-k positive ones to the node's own value.
 * Return the global maximum star sum.
 *
 * Time:  O(E log E + n)
 * Space: O(n + E)
 */
function maxStarSum(vals: number[], edges: number[][], k: number): number {
  const n = vals.length;
  const adj: number[][] = Array.from({ length: n }, () => []);

  for (const [u, v] of edges) {
    adj[u].push(vals[v]);
    adj[v].push(vals[u]);
  }

  let ans = -Infinity;
  for (let i = 0; i < n; i++) {
    adj[i].sort((a, b) => b - a);
    let sum = vals[i];
    for (let j = 0; j < Math.min(k, adj[i].length); j++) {
      if (adj[i][j] <= 0) break; // no benefit from non-positive neighbors
      sum += adj[i][j];
    }
    ans = Math.max(ans, sum);
  }
  return ans;
}

console.log(
  maxStarSum(
    [1, 2, 3, 4, 10, -10, -20],
    [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
      [3, 5],
      [3, 6],
    ],
    2,
  ),
); // 16
console.log(maxStarSum([-5], [], 0)); // -5
console.log(
  maxStarSum(
    [10, 10, 10],
    [
      [0, 1],
      [1, 2],
    ],
    1,
  ),
); // 20

/**
 * Same logic expressed with reduce.
 *
 * Time:  O(E log E + n)
 * Space: O(n + E)
 */
function maxStarSum2(vals: number[], edges: number[][], k: number): number {
  const adj: number[][] = Array.from({ length: vals.length }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(vals[v]);
    adj[v].push(vals[u]);
  }
  return vals.reduce((best, val, i) => {
    adj[i].sort((a, b) => b - a);
    const sum =
      val +
      adj[i]
        .slice(0, k)
        .filter((x) => x > 0)
        .reduce((s, x) => s + x, 0);
    return Math.max(best, sum);
  }, -Infinity);
}

console.log(
  maxStarSum2(
    [1, 2, 3, 4, 10, -10, -20],
    [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
      [3, 5],
      [3, 6],
    ],
    2,
  ),
); // 16
```

---

## 🔗 Related Problems

| #    | Problem                         | Difficulty | Pattern            |
| ---- | ------------------------------- | ---------- | ------------------ |
| 2497 | Maximum Star Sum (this)         | Medium     | Greedy + Sort      |
| 1962 | Remove Stones to Minimize Total | Medium     | Heap               |
| 215  | Kth Largest Element in Array    | Medium     | Heap / Quickselect |
