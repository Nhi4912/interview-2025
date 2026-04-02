---
layout: page
title: "Minimum Number of Vertices to Reach All Nodes"
difficulty: Medium
category: Tree-Graph
tags: [Graph]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes"
---

# Minimum Number of Vertices to Reach All Nodes / Số đỉnh tối thiểu để đến tất cả các nút

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Giống một nhà máy với nhiều phòng — nếu phòng nào có cửa từ phòng khác dẫn vào, bạn không cần xuất phát từ đó. Chỉ xuất phát từ những phòng **không ai dẫn đến** (in-degree = 0).

**English:** In a DAG, any node with an incoming edge is reachable from another. Only nodes with **in-degree 0** must be explicit starting points — they can never be reached otherwise.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Number of Vertices to Reach All Nodes example:**

```
Graph: 0 → 1 → 3
       0 → 2 → 3   in-degree: [0]=0, [1]=1, [2]=1, [3]=2
       3 → 4       in-degree: [4]=1

Answer: [0]  ← only node 0 has no parent
```

---

---

## Problem Description

| #   | Problem              | Difficulty | Pattern                      |
| --- | -------------------- | ---------- | ---------------------------- |
| 207 | Course Schedule      | Medium     | Topological Sort             |
| 210 | Course Schedule II   | Medium     | Topological Sort / In-degree |
| 310 | Minimum Height Trees | Medium     | Topological Trim             |

---

## 📝 Interview Tips

- 🔑 **Key insight / Nhận xét chính:** Nodes with in-degree 0 have no parent — they can ONLY be reached if chosen as starting points.
- 📊 **Why set / Tại sao dùng Set:** Collect all "destination" nodes from edges in O(E); anything not in that set is an answer.
- ⚡ **One-pass trick / Mẹo 1 vòng:** Iterate edges once to build the set, then iterate 0..n-1 to filter.
- 🎯 **No graph traversal needed / Không cần duyệt đồ thị:** The structural property is enough — no BFS/DFS required.
- 🧩 **Edge case / Trường hợp đặc biệt:** If edges is empty, every node has in-degree 0 → return all nodes.
- 📏 **Complexity / Độ phức tạp:** O(E + n) time, O(n) space — optimal for this problem.

---

---

## Solutions

```typescript
/**
 * Collect all nodes that appear as a destination (in-degree >= 1).
 * Return all nodes NOT in that set — they have in-degree 0.
 *
 * Time:  O(E + n)
 * Space: O(n)
 */
function findSmallestSetOfVertices(n: number, edges: number[][]): number[] {
  const hasIncoming = new Set<number>();
  for (const [, dst] of edges) {
    hasIncoming.add(dst);
  }
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    if (!hasIncoming.has(i)) result.push(i);
  }
  return result;
}

console.log(
  findSmallestSetOfVertices(6, [
    [0, 1],
    [0, 2],
    [2, 5],
    [3, 4],
    [4, 2],
  ]),
); // [0,3]
console.log(
  findSmallestSetOfVertices(5, [
    [0, 1],
    [2, 1],
    [3, 1],
    [1, 4],
    [2, 4],
  ]),
); // [0,2,3]
console.log(findSmallestSetOfVertices(3, [])); // [0,1,2]

/**
 * Explicitly count in-degree per node; collect all nodes with degree 0.
 *
 * Time:  O(E + n)
 * Space: O(n)
 */
function findSmallestSetOfVertices2(n: number, edges: number[][]): number[] {
  const inDeg = new Array<number>(n).fill(0);
  for (const [, dst] of edges) inDeg[dst]++;
  return inDeg.reduce<number[]>((acc, d, i) => {
    if (d === 0) acc.push(i);
    return acc;
  }, []);
}

console.log(
  findSmallestSetOfVertices2(6, [
    [0, 1],
    [0, 2],
    [2, 5],
    [3, 4],
    [4, 2],
  ]),
); // [0,3]
console.log(
  findSmallestSetOfVertices2(5, [
    [0, 1],
    [2, 1],
    [3, 1],
    [1, 4],
    [2, 4],
  ]),
); // [0,2,3]
```

---

## 🔗 Related Problems

| #   | Problem              | Difficulty | Pattern                      |
| --- | -------------------- | ---------- | ---------------------------- |
| 207 | Course Schedule      | Medium     | Topological Sort             |
| 210 | Course Schedule II   | Medium     | Topological Sort / In-degree |
| 310 | Minimum Height Trees | Medium     | Topological Trim             |
