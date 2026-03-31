---
layout: page
title: "Maximal Network Rank"
difficulty: Medium
category: Tree-Graph
tags: [Graph]
leetcode_url: "https://leetcode.com/problems/maximal-network-rank"
---

# Maximal Network Rank / Thứ Hạng Mạng Lưới Lớn Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Graph Degree Counting
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Find the Town Judge](https://leetcode.com/problems/find-the-town-judge)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Mỗi thành phố có số đường nối = **degree**. "Network rank" của hai thành phố = tổng degree của chúng, trừ 1 nếu chúng nối trực tiếp (để không đếm đường đó hai lần). Ta cần tìm cặp thành phố cho giá trị lớn nhất. Brute force O(n²) là đủ vì n ≤ 100.

**Pattern Recognition:**

- Signal: "find best pair of nodes based on degree" → **Degree counting + O(n²) pair check**
- Tính degree mỗi thành phố, dùng Set để kiểm tra nhanh kết nối trực tiếp
- Key formula: `rank(i,j) = degree[i] + degree[j] - (1 if connected else 0)`

**Visual — Network Rank Calculation:**

```
n=4, roads=[[0,1],[0,3],[1,2],[1,3]]

degree: [2, 3, 1, 2]   (city 1 connects to 0,2,3)
connected: {(0,1), (0,3), (1,2), (1,3)}

Check all pairs (i,j) i<j:
  (0,1): 2+3 - 1 (connected) = 4
  (0,2): 2+1 - 0 = 3
  (0,3): 2+2 - 1 = 3
  (1,2): 3+1 - 1 = 3
  (1,3): 3+2 - 1 = 4
  (2,3): 1+2 - 0 = 3

Max = 4 ✓  (pairs (0,1) and (1,3) both give rank=4)
```

---

## Problem Description

`n` cities (0-indexed) and `roads[i]=[a_i,b_i]` (bidirectional road). The **network rank** of two cities = total number of directly connected roads to either city. If road connects both, count it only once. Return the **maximal network rank** of any two different cities.

- `2 ≤ n ≤ 100`, `0 ≤ roads.length ≤ n*(n-1)/2`

```
Example 1: n=4, roads=[[0,1],[0,3],[1,2],[1,3]] → 4
  Cities 0 and 1: degree[0]=2, degree[1]=3, connected → rank=2+3-1=4

Example 2: n=5, roads=[[0,1],[0,3],[1,2],[1,3],[2,3],[2,4]] → 5
  Cities 1 and 2: degree[1]=3, degree[2]=3, NOT connected → rank=3+3=6?
  Wait: roads between 1 and 2 exists → 3+3-1=5

Example 3: n=8, roads=[[0,1],[1,2],[2,3],[2,4],[5,6],[5,7]] → 4
```

---

## 📝 Interview Tips

1. **Simple formula** — `rank = degree[i] + degree[j] - (isConnected ? 1 : 0)` / _The formula is clean — just subtract 1 if the pair shares a direct road_
2. **O(n²) is fine** — n ≤ 100, nên n² = 10,000 operations là trivial / _n ≤ 100 means O(n²) = 10k ops — no optimization needed_
3. **Adjacency set** — Dùng `Set<string>` với key `"min,max"` để check connected trong O(1) / _Use Set with canonical key "min_i,max_j" for O(1) connectivity check_
4. **Adjacency matrix** — Với n ≤ 100, dùng boolean matrix `adj[n][n]` cũng tốt / _Boolean adjacency matrix adj[n][n] also works and is even simpler_
5. **Two cities with max degree** — Tối ưu hóa: thành phố max degree là ứng viên tốt; nhưng brute force đủ / _Top-degree cities are candidates but brute force is cleaner and correct_
6. **Follow-up** — Nếu n lớn (10^5+), cần chỉ xét ứng viên top-degree / _For large n, consider only top-degree candidates as optimization_

---

## Solutions

```typescript
/**
 * Solution 1: Degree Array + Adjacency Matrix, O(n²) pair check
 * Time: O(n + E + n²) = O(n²) — pair enumeration dominates
 * Space: O(n²) — adjacency matrix
 */
function maximalNetworkRankMatrix(n: number, roads: number[][]): number {
  const degree = new Array(n).fill(0);
  const adj = Array.from({ length: n }, () => new Array(n).fill(false));

  for (const [u, v] of roads) {
    degree[u]++;
    degree[v]++;
    adj[u][v] = true;
    adj[v][u] = true;
  }

  let maxRank = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const rank = degree[i] + degree[j] - (adj[i][j] ? 1 : 0);
      maxRank = Math.max(maxRank, rank);
    }
  }
  return maxRank;
}

/**
 * Solution 2: Degree Array + HashSet for connectivity, O(n²)
 * Time: O(n²), Space: O(E) — set instead of n² matrix
 * Slightly more memory-efficient for sparse graphs.
 */
function maximalNetworkRank(n: number, roads: number[][]): number {
  const degree = new Array(n).fill(0);
  const connected = new Set<string>();

  for (const [u, v] of roads) {
    degree[u]++;
    degree[v]++;
    // Canonical key: smaller index first to avoid (0,1) vs (1,0) duplicates
    const key = `${Math.min(u, v)},${Math.max(u, v)}`;
    connected.add(key);
  }

  let maxRank = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const key = `${i},${j}`;
      const rank = degree[i] + degree[j] - (connected.has(key) ? 1 : 0);
      maxRank = Math.max(maxRank, rank);
    }
  }
  return maxRank;
}

// === Test Cases ===
console.log(
  maximalNetworkRank(4, [
    [0, 1],
    [0, 3],
    [1, 2],
    [1, 3],
  ]),
); // 4
console.log(
  maximalNetworkRank(5, [
    [0, 1],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
    [2, 4],
  ]),
); // 5
console.log(
  maximalNetworkRank(8, [
    [0, 1],
    [1, 2],
    [2, 3],
    [2, 4],
    [5, 6],
    [5, 7],
  ]),
); // 4
console.log(maximalNetworkRank(2, [])); // 0  (no roads)
console.log(maximalNetworkRank(2, [[0, 1]])); // 1

console.log(
  maximalNetworkRankMatrix(4, [
    [0, 1],
    [0, 3],
    [1, 2],
    [1, 3],
  ]),
); // 4
```

---

## 🔗 Related Problems

| Problem                                                                                                                                          | Pattern                | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | ---------- |
| [Find the Town Judge](https://leetcode.com/problems/find-the-town-judge)                                                                         | In-degree / out-degree | Easy       |
| [Number of Provinces](https://leetcode.com/problems/number-of-provinces)                                                                         | Graph connectivity     | Medium     |
| [Minimum Number of Vertices to Reach All Nodes](https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes)                     | In-degree analysis     | Medium     |
| [Count Unreachable Pairs of Nodes in an Undirected Graph](https://leetcode.com/problems/count-unreachable-pairs-of-nodes-in-an-undirected-graph) | Graph + Union Find     | Medium     |
