---
layout: page
title: "Restore the Array From Adjacent Pairs"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/restore-the-array-from-adjacent-pairs"
---

# Restore the Array From Adjacent Pairs / Khôi Phục Mảng Từ Các Cặp Kề Nhau

> **Track**: Tree-Graph | **Difficulty**: 🟡 Medium | **Pattern**: Graph DFS — Linear Chain Traversal
> **Frequency**: 📘 Tier 3 — Gặp ở Amazon, Bloomberg
> **See also**: [1557 Minimum Number of Vertices to Reach All Nodes](https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes) | [207 Course Schedule](https://leetcode.com/problems/course-schedule)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn nhận được một xâu chuỗi hạt bị tháo rời, và người ta cho bạn biết từng cặp hạt nằm cạnh nhau. Để lắp lại xâu, bạn tìm hạt ở hai đầu (chỉ có một hàng xóm duy nhất), rồi từ đó đi dọc theo chuỗi như đi trên một đường ray — mỗi bước chỉ có đúng một hướng tiếp tục (hàng xóm chưa thăm). Đồ thị ở đây chính là một "đường thẳng" (path graph), không phải cây hay lưới.

**Pattern Recognition:**

- Signal: "n-1 pairs each adjacent, reconstruct original array" → **Graph DFS — Linear Chain**
- Bài này thuộc dạng dựng đồ thị rồi tìm endpoint (degree 1) và duyệt thẳng
- Key insight: trong một path graph, chính xác 2 đỉnh có degree 1 (hai đầu mảng); bắt đầu từ một trong hai đầu đó, luôn đi tới neighbor chưa thăm

**Visual — Chain traversal:**

```
adjacentPairs = [[2,1],[3,4],[3,2]]

Adjacency list:
  1 → [2]
  2 → [1, 3]
  3 → [2, 4]
  4 → [3]

Degree-1 nodes: 1 (degree=1), 4 (degree=1)  ← endpoints

Start at 1:
  result = [1]
  prev=null, cur=1 → next neighbor ≠ prev → go to 2
  result = [1, 2]
  prev=1, cur=2 → neighbors [1,3], skip prev=1 → go to 3
  result = [1, 2, 3]
  prev=2, cur=3 → neighbors [2,4], skip prev=2 → go to 4
  result = [1, 2, 3, 4]  ✅
```

---

## Problem Description

You are given a 2D integer array `adjacentPairs` of size n-1, where each `[u, v]` means u and v are adjacent in the original array. Reconstruct and return the original array. It is guaranteed a unique answer exists. ([LeetCode](https://leetcode.com/problems/restore-the-array-from-adjacent-pairs))

```
Example 1: adjacentPairs=[[2,1],[3,4],[3,2]] → [1,2,3,4] (or [4,3,2,1])
Example 2: adjacentPairs=[[4,-2],[1,4],[-3,1]] → [-2,4,1,-3]
```

Constraints: 2 ≤ n ≤ 10⁵; all integers distinct; valid unique reconstruction guaranteed.

---

## 📝 Interview Tips

1. **Model as graph: node = value, edge = adjacency** — _Mô hình hóa thành đồ thị: giá trị = đỉnh, cặp kề = cạnh_
2. **Find degree-1 node first — that's one endpoint of the array** — _Tìm đỉnh có degree=1 trước — đó là đầu mảng_
3. **Traverse chain: always move to the neighbor that is not the previous node** — _Đi theo chuỗi: luôn chọn hàng xóm khác prev — như đi đường ray một chiều_
4. **No need for visited set — just track prev** — _Không cần set visited — chỉ cần biết "đến từ đâu" là đủ tránh quay lại_
5. **Two valid answers (forward/backward) — return either** — _Có hai đáp án hợp lệ (thuận/ngược chiều) — trả về bất kỳ_
6. **Edge case: n=2 — adjacentPairs has exactly 1 pair, result is that pair** — _n=2: chỉ 1 cặp, cả hai đỉnh đều có degree 1 — lấy cặp đó trực tiếp_

---

## Solutions

```typescript
/** Solution 1: Build graph + find endpoint + traverse chain
 * @complexity Time: O(n) | Space: O(n) */
function restoreArray(adjacentPairs: number[][]): number[] {
  const graph = new Map<number, number[]>();
  for (const [u, v] of adjacentPairs) {
    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }

  // Find degree-1 node (endpoint)
  let start = 0;
  for (const [node, neighbors] of graph) {
    if (neighbors.length === 1) {
      start = node;
      break;
    }
  }

  // Traverse the chain
  const n = adjacentPairs.length + 1;
  const result: number[] = new Array(n);
  result[0] = start;
  result[1] = graph.get(start)![0];

  for (let i = 2; i < n; i++) {
    const neighbors = graph.get(result[i - 1])!;
    result[i] = neighbors[0] === result[i - 2] ? neighbors[1] : neighbors[0];
  }
  return result;
}

/** Solution 2: Same logic, iterative with explicit prev/cur tracking
 * @complexity Time: O(n) | Space: O(n) */
function restoreArray2(adjacentPairs: number[][]): number[] {
  const adj = new Map<number, number[]>();
  for (const [u, v] of adjacentPairs) {
    if (!adj.has(u)) adj.set(u, []);
    if (!adj.has(v)) adj.set(v, []);
    adj.get(u)!.push(v);
    adj.get(v)!.push(u);
  }

  let head = 0;
  for (const [k, v] of adj) {
    if (v.length === 1) {
      head = k;
      break;
    }
  }

  const res: number[] = [head];
  let prev = -Infinity,
    cur = head;
  while (res.length < adjacentPairs.length + 1) {
    const next = adj.get(cur)!.find((n) => n !== prev)!;
    res.push(next);
    prev = cur;
    cur = next;
  }
  return res;
}

// === Test Cases ===
console.log(
  restoreArray([
    [2, 1],
    [3, 4],
    [3, 2],
  ]),
); // [1,2,3,4]
console.log(
  restoreArray([
    [4, -2],
    [1, 4],
    [-3, 1],
  ]),
); // [-2,4,1,-3]
console.log(restoreArray2([[100000, -100000]])); // [100000,-100000]
```

---

## 🔗 Related Problems

| #    | Problem                         | Difficulty | Pattern               |
| ---- | ------------------------------- | ---------- | --------------------- |
| 1557 | Min Vertices to Reach All Nodes | Medium     | Graph Degree          |
| 841  | Keys and Rooms                  | Medium     | DFS/BFS               |
| 207  | Course Schedule                 | Medium     | Topological Sort      |
| 310  | Minimum Height Trees            | Medium     | Graph — Leaf Trimming |
