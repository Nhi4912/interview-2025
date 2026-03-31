---
layout: page
title: "Longest Cycle in a Graph"
difficulty: Hard
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/longest-cycle-in-a-graph"
---

# Longest Cycle in a Graph / Chu Trình Dài Nhất Trong Đồ Thị

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DFS with timestamps
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như đi dạo trong thành phố một chiều — mỗi ngã tư chỉ có một đường ra. Khi đi đến ngã tư đã qua trong cùng chuyến đi, ta phát hiện vòng tròn; độ dài = thời điểm hiện tại trừ thời điểm lần ghé trước.

**Visual — DFS with visit timestamp detects cycles:**

```
edges = [3,3,4,2,3]
Nodes: 0→3, 1→3, 2→4, 3→2, 4→3

Walk from 0: 0(t=1) → 3(t=2) → 2(t=3) → 4(t=4) → 3(already visited, t=2)
  visitTime[3]=2, current time=5
  Cycle length = 5 - 2 = 3   (nodes 3,2,4)  ✓

Walk from 1: 1(t=5) → 3(already fully processed, skip)

Walk from 2,3,4: already visited, skip

Answer = 3

Key: if visitTime[node] >= startTimer → node in current walk → cycle!
     if visitTime[node] < startTimer → from previous walk → no new cycle
```

---

## Problem Description

Given `n` nodes (0-indexed) where **each node has at most one outgoing edge** (`edges[i]` = destination or −1). Find the **length of the longest cycle**, or −1 if no cycle exists. ([LeetCode 2360](https://leetcode.com/problems/longest-cycle-in-a-graph))

**Example 1:** edges=[3,3,4,2,3] → **3** (cycle: 3→2→4→3)
**Example 2:** edges=[2,-1,3,1] → **3** (cycle: 1→3→2? No: 0→2→3→1→3 → cycle 1→3→1? wait 3→1→3, length=2)

**Constraints:** n ≤ 10⁵, edges[i] ∈ [−1, n−1], edges[i] ≠ i.

---

## 📝 Interview Tips

1. **Functional graph**: Mỗi node có tối đa 1 outgoing edge → không cần adjacency list / Direct array lookup.
2. **Timestamp trick**: visitTime[v] = thời điểm thăm v trong lần duyệt hiện tại / Compare against startTimer.
3. **Cycle detection**: visitTime[v] >= startTimer → v trong current walk → cycle tìm thấy / < startTimer = old walk.
4. **Không cần reset**: Sau khi kết thúc walk, visitTime vẫn giữ giá trị cũ → tự nhiên phân biệt cũ/mới.
5. **Edge case**: edges[i] = -1 (dead end) → no cycle from i; node isolated (no edges) → no cycle.
6. **Follow-up**: "Liệt kê tất cả các cycle?" / Track nodes in current path with a stack; emit when cycle found.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — DFS from every node, full visited tracking
 * Time: O(n²) — in worst case, re-traces paths
 * Space: O(n)
 */
function longestCycleBrute(edges: number[]): number {
  const n = edges.length;
  let result = -1;

  for (let start = 0; start < n; start++) {
    const seen = new Map<number, number>(); // node → step index
    let node = start,
      step = 0;
    while (node !== -1 && !seen.has(node)) {
      seen.set(node, step++);
      node = edges[node];
    }
    if (node !== -1 && seen.has(node)) {
      result = Math.max(result, step - seen.get(node)!);
    }
  }
  return result;
}

/**
 * Solution 2: Single-pass DFS with global timestamps — O(n)
 * Each node visited at most once. Timestamps distinguish "current walk" vs "old walk".
 * If we hit a node with visitTime >= startTimer → it's in the current walk → cycle found.
 * Time: O(n) — each node processed exactly once across all walks
 * Space: O(n)
 */
function longestCycle(edges: number[]): number {
  const n = edges.length;
  const visitTime = new Array(n).fill(-1); // -1 = unvisited
  let result = -1;
  let timer = 0;

  for (let i = 0; i < n; i++) {
    if (visitTime[i] !== -1) continue;

    const startTimer = timer;
    let node = i;

    // Walk forward until dead end or revisit
    while (node !== -1 && visitTime[node] === -1) {
      visitTime[node] = timer++;
      node = edges[node];
    }

    // Check if we found a back-edge to the current walk
    if (node !== -1 && visitTime[node] >= startTimer) {
      // Cycle length = current timer − time when 'node' was first visited
      result = Math.max(result, timer - visitTime[node]);
    }
    // Nodes in this walk keep their timestamps (marks them as "processed")
  }

  return result;
}

// === Test Cases ===
console.log(longestCycle([3, 3, 4, 2, 3])); // 3
console.log(longestCycle([2, -1, 3, 1])); // 3
console.log(longestCycle([-1, -1])); // -1
console.log(longestCycle([1, 2, 0, 4, 5, 3])); // 3 (cycle 3→4→5→3)
console.log(longestCycle([1, 0])); // 2
```

---

## 🔗 Related Problems

| Problem                                                                                                                    | Pattern                     | Difficulty |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ---------- |
| [Course Schedule](https://leetcode.com/problems/course-schedule)                                                           | Cycle detection (Topo sort) | Medium     |
| [Find the Celebrity](https://leetcode.com/problems/find-the-celebrity)                                                     | Functional graph            | Medium     |
| [Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees)                                                 | Topological Sort            | Medium     |
| [Sort Items by Groups Respecting Dependencies](https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies) | Topo sort                   | Hard       |
| [Longest Cycle in a Graph — LeetCode](https://leetcode.com/problems/longest-cycle-in-a-graph)                              | —                           | Hard       |
