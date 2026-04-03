---
layout: page
title: "Largest Color Value in a Directed Graph"
difficulty: Hard
category: Tree-Graph
tags: [Hash Table, Dynamic Programming, Graph, Topological Sort, Memoization]
leetcode_url: "https://leetcode.com/problems/largest-color-value-in-a-directed-graph"
---

# Largest Color Value in a Directed Graph / Giá Trị Màu Lớn Nhất Trong Đồ Thị Có Hướng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Topological Sort + DP
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) | [Parallel Courses III](https://leetcode.com/problems/parallel-courses-iii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chuỗi ô tô lắp ráp — các xe đi theo dây chuyền (DAG). Mỗi xe được sơn một màu. Tìm dây chuyền nào có nhiều xe cùng màu nhất. Nếu dây chuyền có vòng tròn → hệ thống bị kẹt → trả -1.

**Visual — Topological Sort + DP for color counts:**

```
colors = "abaca", edges = [[0,1],[0,2],[2,3],[3,4]]
  0(a)→1(b)
  0(a)→2(a)→3(c)→4(a)

dp[v][c] = max count of color c on any path ending at v

Init:  dp[v][color(v)] = 1
Process in topo order: 0,1,2,3,4

node 0: dp[0] = [1,0,0,...] (color 'a')
node 1: from 0 → dp[1]['a'] = max(0, dp[0]['a']+0) = 1
                  dp[1]['b'] = max(1, dp[0]['b']+1) = 1  ← color 'b' count = 1+1=... wait
                  dp[1]['b'] = 1 initially (own color)
                  from 0: dp[1]['b'] = max(1, dp[0]['b']+1) = max(1,0+1)=1
                          dp[1]['a'] = max(0, dp[0]['a']+0) = 1
node 2: dp[2]['a']=1 init; from 0: dp[2]['a'] = max(1,1+1)=2
node 3: from 2: dp[3]['c']=max(1,0+1)=1, dp[3]['a']=max(0,2)=2
node 4: from 3: dp[4]['a']=max(1,2+1)=3 ← longest path with color 'a' = 3

Answer = 3 (path 0→2→3→4 has 3 'a' nodes)
```

---

## Problem Description

Given string `colors` (lowercase 'a'–'z') and directed `edges`. Each node `i` has color `colors[i]`. Find the **maximum number of nodes with the same color** on any valid path. Return −1 if the graph has a **cycle**. ([LeetCode 1857](https://leetcode.com/problems/largest-color-value-in-a-directed-graph))

**Example 1:** colors="abaca", edges=[[0,1],[0,2],[2,3],[3,4]] → **3**
**Example 2:** colors="a", edges=[[0,0]] → **-1** (self-loop = cycle)

**Constraints:** n ≤ 10⁵, edges ≤ 10⁵, colors.length = n.

---

## 📝 Interview Tips

1. **Cycle → -1**: Nếu topological sort không xử lý hết n nodes → có cycle → return -1 / Kahn's algorithm.
2. **DP state**: dp[v][c] = max count of color c trên path kết thúc tại v / 26-element array per node.
3. **Init**: dp[v][color(v)] = 1 (path của chỉ mình v) / Start with node's own color.
4. **Transition**: Với edge u→v: dp[v][c] = max(dp[v][c], dp[u][c] + (colors[v]=='c'?1:0)) / Propagate at each edge.
5. **Space optimization**: Chỉ cần dp arrays của nodes trong current level / Process level by level in topo order.
6. **Follow-up**: "Tìm path cụ thể có giá trị màu lớn nhất?" / Backtrack through dp transitions.

---

## Solutions

```typescript
/**
 * Solution 1: DFS + Memoization (marks cycles with color "gray")
 * Time: O(26·n + m) — O(26) per node for dp update
 * Space: O(26·n)
 */
function largestPathValueDFS(colors: string, edges: number[][]): number {
  const n = colors.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);

  // dp[v][c] = max count of color c on path ending at v; -1 = not computed; -2 = in progress (cycle)
  const dp: number[][] = Array.from({ length: n }, () => new Array(26).fill(-1));

  const dfs = (v: number): boolean => {
    if (dp[v][0] === -2) return false; // cycle detected
    if (dp[v][0] >= 0) return true; // already computed

    // Mark as in-progress
    dp[v].fill(-2);
    dp[v][colors.charCodeAt(v) - 97] = 1; // own color

    for (const u of adj[v]) {
      if (!dfs(u)) return false;
      // Propagate dp[u] → dp[v]
      for (let c = 0; c < 26; c++) {
        const newVal = dp[u][c] + (c === colors.charCodeAt(v) - 97 ? 1 : 0);
        dp[v][c] = Math.max(dp[v][c], newVal);
      }
    }
    return true;
  };

  let result = 0;
  for (let i = 0; i < n; i++) {
    if (!dfs(i)) return -1;
    result = Math.max(result, Math.max(...dp[i]));
  }
  return result;
}

/**
 * Solution 2: Kahn's Topological Sort + DP (iterative, preferred in interviews)
 * Process nodes in topological order; propagate color counts forward.
 * If not all nodes processed → cycle detected → return -1.
 * Time: O(26·(n + m)) — 26-color DP update per edge
 * Space: O(26·n + m)
 */
function largestPathValue(colors: string, edges: number[][]): number {
  const n = colors.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const inDegree = new Array(n).fill(0);

  for (const [u, v] of edges) {
    adj[u].push(v);
    inDegree[v]++;
  }

  // dp[v][c] = max count of color c on any path ending at v
  const dp: number[][] = Array.from({ length: n }, (_, v) => {
    const arr = new Array(26).fill(0);
    arr[colors.charCodeAt(v) - 97] = 1; // node v contributes its own color
    return arr;
  });

  // Kahn's: start with nodes that have no incoming edges
  const queue: number[] = [];
  for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);

  let processed = 0;
  let result = 0;
  let head = 0;

  while (head < queue.length) {
    const u = queue[head++];
    processed++;
    result = Math.max(result, Math.max(...dp[u]));

    for (const v of adj[u]) {
      const colorV = colors.charCodeAt(v) - 97;
      // Propagate dp[u] to dp[v]
      for (let c = 0; c < 26; c++) {
        const candidate = dp[u][c] + (c === colorV ? 1 : 0);
        if (candidate > dp[v][c]) dp[v][c] = candidate;
      }
      if (--inDegree[v] === 0) queue.push(v);
    }
  }

  // If not all nodes processed, there's a cycle
  return processed < n ? -1 : result;
}

// === Test Cases ===
console.log(
  largestPathValue("abaca", [
    [0, 1],
    [0, 2],
    [2, 3],
    [3, 4],
  ]),
); // 3
console.log(largestPathValue("a", [[0, 0]])); // -1 (self-loop)
console.log(
  largestPathValue("hhqhuqhqff", [
    [0, 1],
    [0, 2],
    [2, 3],
    [3, 4],
    [3, 5],
    [5, 6],
    [2, 7],
    [6, 7],
    [7, 8],
    [3, 8],
    [5, 8],
    [8, 9],
    [7, 9],
    [4, 9],
  ]),
); // 3
console.log(largestPathValue("g", [])); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                                     | Pattern          | Difficulty |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix)                    | Topo sort + DP   | Hard       |
| [Parallel Courses III](https://leetcode.com/problems/parallel-courses-iii)                                                  | Topo sort + DP   | Hard       |
| [Course Schedule II](https://leetcode.com/problems/course-schedule-ii)                                                      | Kahn's algorithm | Medium     |
| [Design Excel Sum Formula](https://leetcode.com/problems/design-excel-sum-formula)                                          | Topological Sort | Hard       |
| [Largest Color Value in a Directed Graph — LeetCode](https://leetcode.com/problems/largest-color-value-in-a-directed-graph) | —                | Hard       |
