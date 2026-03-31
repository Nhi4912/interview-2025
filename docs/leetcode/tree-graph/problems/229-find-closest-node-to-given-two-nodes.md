---
layout: page
title: "Find Closest Node to Given Two Nodes"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/find-closest-node-to-given-two-nodes"
---

# Find Closest Node to Given Two Nodes / Tìm Nút Gần Nhất Từ Hai Nút

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS / Graph traversal
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Evaluate Division](https://leetcode.com/problems/evaluate-division)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như hai người xuất phát từ hai thành phố khác nhau trên mạng đường một chiều — tìm thành phố mà cả hai đều có thể đến, và chặng đường dài nhất trong hai người là ngắn nhất. Chạy BFS/DFS từ mỗi điểm xuất phát để ghi khoảng cách.

**Visual — distance arrays from both nodes:**

```
edges = [2,2,3,-1,3]
Nodes: 0→2, 1→2, 2→3, 3→-1, 4→3

From node1=0: 0(d=0)→2(d=1)→3(d=2)→-1 stop
  dist1 = [0,-1,1,2,-1]

From node2=1: 1(d=0)→2(d=1)→3(d=2)
  dist2 = [-1,0,1,2,-1]

For each node i, if both reachable:
  max(dist1[i], dist2[i]):
  i=2: max(1,1)=1 → candidate
  i=3: max(2,2)=2

Best: i=2 with max_dist=1 → answer=2
```

---

## Problem Description

Given `n` nodes where each has **at most one outgoing edge** (`edges[i]` = destination or −1). Given `node1` and `node2`, find a node `x` reachable from **both** such that `max(dist(node1, x), dist(node2, x))` is **minimized**. Return smallest index `x` if tie, −1 if no such node. ([LeetCode 2359](https://leetcode.com/problems/find-closest-node-to-given-two-nodes))

**Example 1:** edges=[2,2,3,-1,3], node1=0, node2=1 → **2**
**Example 2:** edges=[1,2,-1], node1=0, node2=2 → **2**

**Constraints:** n ≤ 10⁵, edges[i] ∈ [−1, n−1], node1 ≠ node2.

---

## 📝 Interview Tips

1. **Functional graph**: Mỗi node có ≤1 outgoing edge → path từ mỗi node là một dãy đơn giản / Simple chain until cycle or dead end.
2. **Two-pass approach**: Chạy getDist() từ node1 và node2 độc lập, rồi combine / O(n) each pass.
3. **Cycle handling**: Dùng visited set để tránh vòng lặp vô hạn / Stop when revisiting.
4. **Tie-breaking**: Duyệt i từ 0 đến n-1, lấy node đầu tiên có max_dist tối thiểu / Ascending index handles ties.
5. **Edge case**: node1 = node2 không xảy ra per constraints; nếu node không reachable từ cả hai → skip.
6. **Follow-up**: "Nếu mỗi node có nhiều outgoing edges?" / BFS/Dijkstra instead of simple chain traversal.

---

## Solutions

```typescript
/**
 * Helper: compute distances from 'start' to all reachable nodes
 * Functional graph: each node has ≤1 outgoing edge → simple walk
 * Time: O(n), Space: O(n)
 */
function getDistances(edges: number[], start: number): number[] {
  const n = edges.length;
  const dist = new Array(n).fill(-1);
  let cur = start,
    d = 0;

  while (cur !== -1 && dist[cur] === -1) {
    dist[cur] = d++;
    cur = edges[cur];
  }
  return dist;
}

/**
 * Solution 1: Two independent walks + combine
 * Time: O(n) — two O(n) walks + O(n) scan
 * Space: O(n)
 */
function closestMeetingNode(edges: number[], node1: number, node2: number): number {
  const dist1 = getDistances(edges, node1);
  const dist2 = getDistances(edges, node2);

  let result = -1;
  let minMaxDist = Infinity;

  for (let i = 0; i < edges.length; i++) {
    if (dist1[i] === -1 || dist2[i] === -1) continue;
    const maxDist = Math.max(dist1[i], dist2[i]);
    if (maxDist < minMaxDist) {
      minMaxDist = maxDist;
      result = i; // smallest index wins ties (ascending scan)
    }
  }

  return result;
}

/**
 * Solution 2: Simultaneous BFS from both nodes (same complexity, illustrative)
 * Expand both frontiers step by step; first node reached by both is not necessarily optimal.
 * The two-walk approach above is cleaner; this shows the BFS framing.
 * Time: O(n), Space: O(n)
 */
function closestMeetingNodeBFS(edges: number[], node1: number, node2: number): number {
  const n = edges.length;
  const dist1 = new Array(n).fill(Infinity);
  const dist2 = new Array(n).fill(Infinity);

  // Walk from node1
  let cur = node1,
    d = 0;
  while (cur !== -1 && dist1[cur] === Infinity) {
    dist1[cur] = d++;
    cur = edges[cur];
  }

  // Walk from node2
  cur = node2;
  d = 0;
  while (cur !== -1 && dist2[cur] === Infinity) {
    dist2[cur] = d++;
    cur = edges[cur];
  }

  let result = -1,
    best = Infinity;
  for (let i = 0; i < n; i++) {
    if (dist1[i] === Infinity || dist2[i] === Infinity) continue;
    const mx = Math.max(dist1[i], dist2[i]);
    if (mx < best) {
      best = mx;
      result = i;
    }
  }
  return result;
}

// === Test Cases ===
console.log(closestMeetingNode([2, 2, 3, -1, 3], 0, 1)); // 2
console.log(closestMeetingNode([1, 2, -1], 0, 2)); // 2
console.log(closestMeetingNode([-1, -1], 0, 1)); // -1
console.log(closestMeetingNode([1, 0], 0, 1)); // 0 or 1 (both reachable, dist 0+1=1)
```

---

## 🔗 Related Problems

| Problem                                                                                                               | Pattern              | Difficulty |
| --------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------- |
| [Longest Cycle in a Graph](https://leetcode.com/problems/longest-cycle-in-a-graph)                                    | Functional graph DFS | Hard       |
| [Reconstruct Itinerary](https://leetcode.com/problems/reconstruct-itinerary)                                          | Eulerian path        | Hard       |
| [Course Schedule](https://leetcode.com/problems/course-schedule)                                                      | Cycle detection      | Medium     |
| [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops)                      | Shortest path        | Medium     |
| [Find Closest Node to Given Two Nodes — LeetCode](https://leetcode.com/problems/find-closest-node-to-given-two-nodes) | —                    | Medium     |
