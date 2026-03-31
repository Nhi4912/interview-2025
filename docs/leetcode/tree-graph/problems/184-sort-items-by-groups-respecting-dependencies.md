---
layout: page
title: "Sort Items by Groups Respecting Dependencies"
difficulty: Hard
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies"
---

# Sort Items by Groups Respecting Dependencies / Sắp Xếp Phần Tử Theo Nhóm Tôn Trọng Phụ Thuộc

🔴 Hard | Graph | Topological Sort

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Giống như lập lịch thi công dự án — trước tiên sắp xếp thứ tự các **phòng ban** (nhóm), rồi trong mỗi phòng ban sắp xếp thứ tự **nhân viên** (phần tử). Hai lần topological sort lồng nhau.

```
Items: 0→1→2   Groups: A→B
        ↓               ↓
[group A: 0,1] → [group B: 2]
 toposort inside    toposort between
```

**Key insight:** Assign each ungrouped item its own unique group. Then do two topological sorts: one for groups (inter-group deps), one for items within each group (intra-group deps).

## Problem Description

You have `n` items divided into `m` groups. Item `i` belongs to `group[i]` (or `-1` for no group). `beforeItems[i]` lists items that must come before item `i`. Return an ordering of all items satisfying all dependencies, or `[]` if impossible.

**Example 1:**

- `n=8, m=2, group=[-1,-1,1,0,0,1,0,-1], beforeItems=[[],[6],[5],[6],[3,6],[],[],[]]`
- Output: `[6,3,4,1,5,2,0,7]`

**Example 2:**

- `n=8, m=2, group=[-1,-1,1,0,0,1,0,-1], beforeItems=[[],[6],[5],[6],[3],[],[4],[]]`
- Output: `[]` (cycle detected)

## 📝 Interview Tips

- **Q: Why two topological sorts? / Tại sao cần hai lần toposort?**
  - A: One for ordering groups, one for ordering items within each group / Một cho thứ tự nhóm, một cho thứ tự phần tử trong nhóm.
- **Q: How handle ungrouped items? / Xử lý phần tử không có nhóm?**
  - A: Assign each a unique virtual group id `m, m+1, ...` / Gán mỗi phần tử một nhóm ảo riêng biệt.
- **Q: When is result impossible? / Khi nào không có kết quả?**
  - A: When either topological sort detects a cycle / Khi một trong hai toposort phát hiện chu trình.
- **Q: Time complexity? / Độ phức tạp?**
  - A: O(n + m + E) where E is total edges / O(n + m + E) với E là tổng số cạnh.
- **Q: Edge case? / Trường hợp biên?**
  - A: Dependencies that cross groups also create group-level edges / Phụ thuộc xuyên nhóm tạo cạnh cấp nhóm.
- **Q: Can items in the same group have inter-group deps? / Phần tử cùng nhóm có thể tạo phụ thuộc nhóm khác không?**
  - A: No — same group deps are intra-group only / Không — phụ thuộc cùng nhóm chỉ là nội bộ.

## Solutions

### Solution 1: Double Topological Sort (Kahn's BFS)

```typescript
/**
 * Sort items respecting group and item dependencies.
 * @param n - number of items
 * @param m - number of groups
 * @param group - group[i] = group of item i, -1 if ungrouped
 * @param beforeItems - beforeItems[i] = list of items before i
 * @returns valid order or [] if impossible
 * Time: O(n + m + E)  Space: O(n + m + E)
 */
function sortItems(n: number, m: number, group: number[], beforeItems: number[][]): number[] {
  // Assign each ungrouped item a unique group
  let groupId = m;
  for (let i = 0; i < n; i++) {
    if (group[i] === -1) group[i] = groupId++;
  }
  const totalGroups = groupId;

  // Build adjacency lists and in-degree counts
  const itemGraph: number[][] = Array.from({ length: n }, () => []);
  const groupGraph: number[][] = Array.from({ length: totalGroups }, () => []);
  const itemIndegree = new Array(n).fill(0);
  const groupIndegree = new Array(totalGroups).fill(0);
  const groupEdges = new Set<string>();

  for (let i = 0; i < n; i++) {
    for (const pre of beforeItems[i]) {
      itemGraph[pre].push(i);
      itemIndegree[i]++;
      // Add group edge if different groups
      if (group[pre] !== group[i]) {
        const key = `${group[pre]},${group[i]}`;
        if (!groupEdges.has(key)) {
          groupEdges.add(key);
          groupGraph[group[pre]].push(group[i]);
          groupIndegree[group[i]]++;
        }
      }
    }
  }

  // Kahn's topological sort
  function topoSort<T>(
    nodes: T[],
    indegree: number[],
    graph: number[][],
    getId: (x: T) => number,
  ): T[] | null {
    const queue: T[] = nodes.filter((x) => indegree[getId(x)] === 0);
    const result: T[] = [];
    while (queue.length) {
      const cur = queue.shift()!;
      result.push(cur);
      for (const next of graph[getId(cur)]) {
        if (--indegree[next] === 0) queue.push(next as T);
      }
    }
    return result.length === nodes.length ? result : null;
  }

  // Sort groups
  const groupOrder = topoSort(
    Array.from({ length: totalGroups }, (_, i) => i),
    groupIndegree,
    groupGraph,
    (x) => x,
  );
  if (!groupOrder) return [];

  // Sort items within each group
  const itemsByGroup: Map<number, number[]> = new Map();
  for (let i = 0; i < n; i++) {
    if (!itemsByGroup.has(group[i])) itemsByGroup.set(group[i], []);
    itemsByGroup.get(group[i])!.push(i);
  }

  const result: number[] = [];
  for (const g of groupOrder) {
    const items = itemsByGroup.get(g) || [];
    const sortedItems = topoSort(items, itemIndegree, itemGraph, (x) => x);
    if (!sortedItems) return [];
    result.push(...sortedItems);
  }
  return result;
}

// Tests
console.log(sortItems(8, 2, [-1, -1, 1, 0, 0, 1, 0, -1], [[], [6], [5], [6], [3, 6], [], [], []]));
// → [6,3,4,1,5,2,0,7] or another valid order
console.log(sortItems(8, 2, [-1, -1, 1, 0, 0, 1, 0, -1], [[], [6], [5], [6], [3], [], [4], []]));
// → []
console.log(sortItems(1, 1, [0], [[]]));
// → [0]
```

## 🔗 Related Problems

| #    | Problem              | Difficulty | Key Concept      |
| ---- | -------------------- | ---------- | ---------------- |
| 207  | Course Schedule      | Medium     | Topological Sort |
| 210  | Course Schedule II   | Medium     | Kahn's BFS       |
| 269  | Alien Dictionary     | Hard       | Topological Sort |
| 1203 | Sort Items by Groups | Hard       | Double Toposort  |
