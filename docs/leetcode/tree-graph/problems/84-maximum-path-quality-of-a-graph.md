---
layout: page
title: "Maximum Path Quality of a Graph"
difficulty: Hard
category: Tree-Graph
tags: [Array, Backtracking, Graph]
leetcode_url: "https://leetcode.com/problems/maximum-path-quality-of-a-graph"
---

# Maximum Path Quality of a Graph / Chất Lượng Đường Đi Tối Đa Trên Đồ Thị

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Backtracking on Graph
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Combination Sum](https://leetcode.com/problems/combination-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như du lịch với ngân sách thời gian — bạn xuất phát từ nhà (node 0), thăm các địa điểm, và phải về nhà đúng giờ. Mỗi địa điểm chỉ tính điểm lần đầu đến. Tìm hành trình có tổng điểm cao nhất.

**Pattern Recognition:**

- Signal: "maximize unique-node sum" + "time constraint" + "must return to 0" → **Backtracking với pruning**
- Đi DFS từ node 0, track thời gian còn lại và visited nodes
- Key insight: có thể revisit node nhưng chỉ cộng điểm lần đầu; phải quay về node 0

**Visual — Backtracking with time budget:**

```
values=[0,32,10,43], maxTime=10
edges: 0-1(2), 1-2(4), 0-3(4), 3(from 0)

Path 0→1→2→1→0: time=2+4+4+2=12 > 10, prune
Path 0→1→0→1→0: time=2+2+2+2=8 ≤ 10, quality=0+32=32
Path 0→3→0: time=4+4=8 ≤ 10, quality=0+43=43 ← best
Path 0→1→0→3: doesn't return to 0 in time
```

---

## Problem Description

There is an undirected graph with `n` nodes numbered `0` to `n-1`. Each node has a value `values[i]`. Edges have travel times. Starting at node `0` with time budget `maxTime`, find a path that starts and ends at node `0`, maximizing the sum of **unique** node values visited. ([LeetCode #2065](https://leetcode.com/problems/maximum-path-quality-of-a-graph))

**Example 1:** `values=[0,32,10,43]`, `edges=[[0,1,2],[1,2,4],[0,3,4]]`, `maxTime=10` → `75`
**Example 2:** `values=[5,10,15,20]`, `edges=[[0,1,1],[1,2,1],[0,3,3]]`, `maxTime=5` → `25`

---

## 📝 Interview Tips

1. **Clarify**: "Node có thể được thăm nhiều lần không? (Có) Chỉ tính điểm lần đầu" / Can revisit nodes, score only once
2. **Pruning**: "Nếu time còn lại < edge weight → prune ngay" / Prune when time budget exhausted
3. **Count array**: "Dùng `count[node]++` khi vào, `count[node]--` khi backtrack" / Track visit count to score first visit
4. **Record answer**: "Chỉ record answer khi ở node 0 (bắt buộc return về 0)" / Only update answer at node 0
5. **MaxTime constraint**: "maxTime ≤ 100, edges ≤ 1000 — backtracking feasible do time constraint prune mạnh" / Time bound makes backtracking practical
6. **Graph build**: "Build adjacency list để DFS hiệu quả" / Adjacency list for DFS

---

## Solutions

```typescript
/**
 * Solution: DFS Backtracking with time pruning
 * Time: O(4^(maxTime/minEdge)) — pruned heavily by time constraint
 * Space: O(N + E) — graph + recursion stack
 */
function maximalPathQuality(values: number[], edges: number[][], maxTime: number): number {
  const n = values.length;
  // Build adjacency list: [neighbor, time]
  const graph: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, t] of edges) {
    graph[u].push([v, t]);
    graph[v].push([u, t]);
  }

  const visitCount = new Array(n).fill(0);
  visitCount[0] = 1;
  let ans = 0;

  function dfs(node: number, timeLeft: number, quality: number): void {
    // Only record answer when back at node 0
    if (node === 0) ans = Math.max(ans, quality);

    for (const [next, cost] of graph[node]) {
      if (timeLeft < cost) continue; // prune: not enough time
      const bonus = visitCount[next] === 0 ? values[next] : 0;
      visitCount[next]++;
      dfs(next, timeLeft - cost, quality + bonus);
      visitCount[next]--;
    }
  }

  dfs(0, maxTime, values[0]);
  return ans;
}

/**
 * Solution 2: Same approach with explicit path tracking (for debugging)
 * Time: O(4^(maxTime/minEdge)) — same complexity
 * Space: O(N)
 */
function maximalPathQualityV2(values: number[], edges: number[][], maxTime: number): number {
  const n = values.length;
  const adj: [number, number][][] = Array.from({ length: n }, () => []);
  for (const [u, v, t] of edges) {
    adj[u].push([v, t]);
    adj[v].push([u, t]);
  }

  let best = 0;
  const visited = new Set<number>([0]);

  function dfs(node: number, remaining: number, score: number): void {
    if (node === 0) best = Math.max(best, score);
    for (const [nb, w] of adj[node]) {
      if (remaining < w) continue;
      const added = !visited.has(nb);
      if (added) visited.add(nb);
      dfs(nb, remaining - w, score + (added ? values[nb] : 0));
      if (added) visited.delete(nb);
    }
  }

  dfs(0, maxTime, values[0]);
  return best;
}

// === Test Cases ===
console.log(
  maximalPathQuality(
    [0, 32, 10, 43],
    [
      [0, 1, 2],
      [1, 2, 4],
      [0, 3, 4],
    ],
    10,
  ),
); // 75
console.log(
  maximalPathQuality(
    [5, 10, 15, 20],
    [
      [0, 1, 1],
      [1, 2, 1],
      [0, 3, 3],
    ],
    5,
  ),
); // 25
console.log(
  maximalPathQualityV2(
    [0, 32, 10, 43],
    [
      [0, 1, 2],
      [1, 2, 4],
      [0, 3, 4],
    ],
    10,
  ),
); // 75
```

---

## 🔗 Related Problems

| Problem                                                                                                    | Difficulty | Pattern       |
| ---------------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [Combination Sum](https://leetcode.com/problems/combination-sum)                                           | 🟡 Medium  | Backtracking  |
| [Evaluate Division](https://leetcode.com/problems/evaluate-division)                                       | 🟡 Medium  | DFS on graph  |
| [Find All Paths From Source to Target](https://leetcode.com/problems/find-all-paths-from-source-to-target) | 🟡 Medium  | DFS all paths |
| [Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes)         | 🔴 Hard    | BFS + bitmask |
