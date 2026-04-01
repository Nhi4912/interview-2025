---
layout: page
title: "Reachable Nodes With Restrictions"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, Tree, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/reachable-nodes-with-restrictions"
---

# Reachable Nodes With Restrictions / Các Nút Có Thể Đến Được Với Hạn Chế

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) | [Minimize Malware Spread II](https://leetcode.com/problems/minimize-malware-spread-ii)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống hệ thống đường làng bị chặn bởi chốt kiểm soát — bạn xuất phát từ làng 0, muốn đi qua các làng khác nhưng một số làng bị phong toả. Hễ gặp làng bị phong toả thì dừng lại, không đi qua đó được. Đếm tất cả làng bạn ghé được (kể cả làng 0).

**Pattern Recognition:**

- Signal: "tree traversal" + "blocked nodes" + "count reachable from node 0" → **DFS/BFS with restricted set**
- Key insight: đây là tree (không phải graph), nên không cần visited array — chỉ cần tránh restricted set

**Visual — Reachable Nodes With Restrictions example:**

```
n=7, edges=[[0,1],[1,2],[3,1],[4,0],[0,5],[5,6]]
restricted=[4,5]

Adjacency:
  0: [1,4,5]   4: [0]*blocked
  1: [0,2,3]   5: [0,6]*blocked
  2: [1]        6: [5]
  3: [1]

DFS from 0, skip restricted:
  visit 0 → explore 1 (not restricted)
    visit 1 → explore 2, 3
      visit 2 → leaf
      visit 3 → leaf
  explore 4 → BLOCKED
  explore 5 → BLOCKED
Reachable: {0,1,2,3} → count = 4
```

---

## 📝 Problem Description

Given an undirected tree with `n` nodes (0 to n-1), edges list, and a `restricted` list of blocked nodes. Starting from node `0`, return the **maximum number of nodes** reachable without visiting any restricted node.

**Example 1:** `n=7`, edges `[[0,1],[1,2],[3,1],[4,0],[0,5],[5,6]]`, restricted `[4,5]` → `4`
**Example 2:** `n=7`, edges `[[0,1],[0,2],[0,5],[0,4],[3,2],[6,5]]`, restricted `[4,2,1]` → `3`

Constraints: `2 ≤ n ≤ 10⁵`, `restricted.length < n/2`.

---

## 🎯 Interview Tips

1. **Build adjacency list** first from edges / Xây adjacency list trước từ edges array
2. **Use Set for restricted** for O(1) lookup / Dùng Set cho restricted để lookup O(1)
3. **No visited needed?** False — tree has no cycles but still need to avoid going back / Tree không có cycle nhưng vẫn cần visited để không đi ngược
4. **Start DFS from 0**, skip if in restricted / DFS từ node 0, bỏ qua nếu trong restricted
5. **Count includes starting node 0** (assuming 0 not restricted) / Đếm kể cả node 0
6. **Iterative DFS vs recursive**: for large n (10⁵) iterative avoids stack overflow / Với n lớn dùng iterative tránh tràn stack

---

## 💡 Solutions

### Approach 1: BFS with Restricted Set

/\*_ @complexity Time: O(N) | Space: O(N) _/

```typescript
function reachableNodesBFS(n: number, edges: number[][], restricted: number[]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const blocked = new Set(restricted);
  const visited = new Set<number>();
  const queue = [0];
  visited.add(0);
  while (queue.length) {
    const node = queue.shift()!;
    for (const nb of adj[node]) {
      if (!visited.has(nb) && !blocked.has(nb)) {
        visited.add(nb);
        queue.push(nb);
      }
    }
  }
  return visited.size;
}
```

### Approach 2: Iterative DFS — Optimal

/\*_ @complexity Time: O(N) | Space: O(N) _/

```typescript
function reachableNodes(n: number, edges: number[][], restricted: number[]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const blocked = new Set(restricted);
  const visited = new Set<number>([0]);
  const stack = [0];
  let count = 0;

  while (stack.length) {
    const node = stack.pop()!;
    count++;
    for (const nb of adj[node]) {
      if (!visited.has(nb) && !blocked.has(nb)) {
        visited.add(nb);
        stack.push(nb);
      }
    }
  }
  return count;
}
```

---

## 🧪 Test Cases

```typescript
const e1 = [[0,1],[1,2],[3,1],[4,0],[0,5],[5,6]];
const e2 = [[0,1],[0,2],[0,5],[0,4],[3,2],[6,5]];
console.log(reachableNodes(7, e1, [4,5]));     // → 4
console.log(reachableNodes(7, e2, [4,2,1]));   // → 3
console.log(reachableNodes(2, [[0,1]], []));    // → 2
console.log(reachableNodes(3, [[0,1],[1,2]], [2]));  // → 2
console.log(reachableNodesBFS(7, e1, [4,5]));  // → 4
```

---

## Related Problems

| Problem                                                                                                                                      | Difficulty | Pattern        |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------- |
| [Number of Connected Components in an Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph) | Medium     | Union Find/DFS |
| [Minimum Number of Vertices to Reach All Nodes](https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes)                 | Medium     | Graph          |
| [Accounts Merge](https://leetcode.com/problems/accounts-merge)                                                                               | Medium     | Union Find     |
