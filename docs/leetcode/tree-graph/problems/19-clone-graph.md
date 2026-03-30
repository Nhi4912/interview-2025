---
layout: page
title: "Clone Graph"
difficulty: Medium
category: Graph
tags: [Graph, BFS, DFS, Hash Table]
leetcode_url: "https://leetcode.com/problems/clone-graph/"
---

# Clone Graph / Sao Chép Đồ Thị

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS/DFS + HashMap
> **Frequency**: ⭐ Tier 2 — Classic graph traversal + copying
> **See also**: [Number of Islands](./12-number-of-islands.md) | [Course Schedule II](./15-course-schedule-ii.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Photocopy mạng lưới bạn bè trên Facebook. Mỗi người có danh sách bạn bè. Khi copy người A → phải copy luôn bạn bè của A. Nhưng nếu B đã được copy rồi (vì B cũng là bạn của C) → không copy lại, chỉ trỏ đến bản copy đã có. HashMap `{original → clone}` là "danh sách đã copy".

**Pattern Recognition:**
- Graph traversal (BFS or DFS) + HashMap to track visited/cloned nodes
- HashMap serves double purpose: (1) mark visited, (2) store cloned node reference
- Must handle cycles — HashMap prevents infinite loop

**Visual:**
```
Original Graph:
  1 -- 2
  |    |
  4 -- 3

Clone process (BFS from node 1):
  visited = {}
  Queue: [1]

  Process 1: clone(1), visited={1→clone1}
    Neighbors: 2, 4 → add to queue
    Queue: [2, 4]

  Process 2: clone(2), visited={1→c1, 2→c2}
    c1.neighbors.push(c2) ← link 1→2 in clone
    Neighbors: 1(visited), 3 → add 3
    Queue: [4, 3]

  Process 4: clone(4), visited={..., 4→c4}
    c1.neighbors.push(c4) ← link 1→4 in clone
    ...continue until all cloned
```

---

## Problem Description

Given a reference to a node in a connected undirected graph, return a deep copy. Each node has `val: number` and `neighbors: Node[]`.

```
Example: adjList = [[2,4],[1,3],[2,4],[1,3]]
  Node 1 neighbors: [2,4]
  Node 2 neighbors: [1,3]
  Node 3 neighbors: [2,4]
  Node 4 neighbors: [1,3]
  → deep copy of the same structure
```

---

## 📝 Interview Tips

1. **Key insight**: HashMap `{original → clone}` solves both visited-tracking AND clone-lookup
2. **BFS vs DFS**: both O(V+E), BFS iterative avoids stack overflow on large graphs
3. **Cycle handling**: check `visited.has(neighbor)` BEFORE cloning
4. **Edge case**: `null` input → return `null`

---

## Solutions

{% raw %}

class GraphNode {
  val: number;
  neighbors: GraphNode[];
  constructor(val = 0, neighbors: GraphNode[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

/**
 * Solution 1: BFS with HashMap
 *
 * Time: O(V + E), Space: O(V)
 */
function cloneGraph_bfs(node: GraphNode | null): GraphNode | null {
  if (!node) return null;

  const visited = new Map<GraphNode, GraphNode>();
  const queue: GraphNode[] = [node];
  visited.set(node, new GraphNode(node.val));

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const clone = visited.get(curr)!;

    for (const neighbor of curr.neighbors) {
      if (!visited.has(neighbor)) {
        visited.set(neighbor, new GraphNode(neighbor.val));
        queue.push(neighbor);
      }
      clone.neighbors.push(visited.get(neighbor)!);
    }
  }

  return visited.get(node)!;
}

/**
 * Solution 2: DFS Recursive with HashMap (Cleanest code)
 *
 * Time: O(V + E), Space: O(V) for map + O(V) call stack
 */
function cloneGraph(node: GraphNode | null): GraphNode | null {
  const visited = new Map<GraphNode, GraphNode>();

  function dfs(n: GraphNode): GraphNode {
    if (visited.has(n)) return visited.get(n)!;

    const clone = new GraphNode(n.val);
    visited.set(n, clone); // Mark BEFORE processing neighbors (prevents cycles)

    for (const neighbor of n.neighbors) {
      clone.neighbors.push(dfs(neighbor));
    }
    return clone;
  }

  return node ? dfs(node) : null;
}

{% endraw %}

---

## 🔗 Related Problems

- [Number of Islands](./12-number-of-islands.md) — grid graph BFS/DFS
- [Course Schedule II](./15-course-schedule-ii.md) — directed graph, topological sort
- [Word Ladder](./13-word-ladder.md) — BFS on implicit graph
