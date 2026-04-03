---
layout: page
title: "Number of Possible Sets of Closing Branches"
difficulty: Hard
category: Tree-Graph
tags: [Bit Manipulation, Graph, Heap (Priority Queue), Enumeration, Shortest Path]
leetcode_url: "https://leetcode.com/problems/number-of-possible-sets-of-closing-branches"
---

# Number of Possible Sets of Closing Branches / Số Tập Hợp Nhánh Đóng Có Thể

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Bài toán như chọn chi nhánh ngân hàng để giữ lại. Với mỗi tập con nhánh (bitmask), kiểm tra xem khoảng cách tối đa giữa bất kỳ hai nhánh nào ≤ maxDistance không. Vì n ≤ 10, ta chỉ có 2^10 = 1024 tập con — brute force hoàn toàn ổn.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Number of Possible Sets of Closing Branches example:**

```
Nodes: 0,1,2   edges: 0-1(w=2), 1-2(w=10)   maxDistance=5
mask=111 (all):  dist[0][2]=12 > 5 → INVALID
mask=011 (0,1):  dist[0][1]=2  ≤ 5 → VALID
mask=110 (1,2):  dist[1][2]=10 > 5 → INVALID
mask=001 (0):    trivially valid  → VALID
mask=010 (1):    trivially valid  → VALID
mask=100 (2):    trivially valid  → VALID
mask=101 (0,2):  not connected   → INVALID
Answer: count valid subsets
```

---

---

## Problem Description

| Problem                                                                                                                    | Difficulty | Key Idea                  |
| -------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------- |
| [Network Delay Time 743](https://leetcode.com/problems/network-delay-time)                                                 | Medium     | Floyd-Warshall / Dijkstra |
| [Subsets 78](https://leetcode.com/problems/subsets)                                                                        | Medium     | Bitmask enumeration       |
| [Find Critical Edges 1489](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree) | Hard       | Graph + bitmask           |
| [Shortest Path Visiting All Nodes 847](https://leetcode.com/problems/shortest-path-visiting-all-nodes)                     | Hard       | BFS + bitmask state       |

---

## 📝 Interview Tips

- 🔑 **EN:** n ≤ 10 → only 1024 subsets, bitmask brute force is feasible | **VI:** n nhỏ → 2^n tập con, duyệt brute force OK
- 🔑 **EN:** Floyd-Warshall O(n³) per subset → total O(2^n × n³) ≈ 10^6 | **VI:** Floyd-Warshall O(n³) mỗi tập
- 🔑 **EN:** Only include edges where BOTH endpoints are in the current mask | **VI:** Chỉ thêm cạnh khi cả hai đầu thuộc tập con
- 🔑 **EN:** If dist[i][j] = ∞ for any pair in subset → skip immediately | **VI:** Không kết nối → loại ngay
- 🔑 **EN:** Count subsets of size ≥ 1 (size 0 = empty, skip) | **VI:** Đếm tập con có ít nhất 1 phần tử
- 🔑 **EN:** Mention Floyd-Warshall by name — interviewers love algorithm recognition | **VI:** Nhớ nêu tên Floyd-Warshall

---

---

## Solutions

```typescript
/**
 * Bitmask Enumeration + Floyd-Warshall
 * Time: O(2^n × n³) — n≤10 → ~1M operations, fast enough
 * Space: O(n²) for distance matrix
 */
function numberOfSets(n: number, maxDistance: number, roads: number[][]): number {
  let count = 0;

  for (let mask = 1; mask < 1 << n; mask++) {
    // Init distance matrix for this subset
    const dist: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (__, j) => (i === j ? 0 : Infinity)),
    );

    // Only add edges where BOTH endpoints are in the mask
    for (const [u, v, w] of roads) {
      if ((mask >> u) & 1 && (mask >> v) & 1) {
        if (w < dist[u][v]) {
          dist[u][v] = w;
          dist[v][u] = w;
        }
      }
    }

    // Floyd-Warshall: only iterate over nodes in mask
    for (let k = 0; k < n; k++) {
      if (!((mask >> k) & 1)) continue;
      for (let i = 0; i < n; i++) {
        if (!((mask >> i) & 1) || dist[i][k] === Infinity) continue;
        for (let j = 0; j < n; j++) {
          if (!((mask >> j) & 1)) continue;
          if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }

    // Validate: check all pairs in subset
    let valid = true;
    outer: for (let i = 0; i < n; i++) {
      if (!((mask >> i) & 1)) continue;
      for (let j = i + 1; j < n; j++) {
        if (!((mask >> j) & 1)) continue;
        if (dist[i][j] > maxDistance) {
          valid = false;
          break outer;
        }
      }
    }

    if (valid) count++;
  }

  return count;
}

// Test cases
console.log(
  numberOfSets(3, 5, [
    [0, 1, 2],
    [1, 2, 10],
    [0, 2, 10],
  ]),
); // 7
console.log(numberOfSets(1, 10, [])); // 1
console.log(
  numberOfSets(4, 4, [
    [0, 1, 3],
    [2, 3, 1],
  ]),
); // 8

/**
 * Same approach — helper extracts nodes list for clarity
 * Time: O(2^n × n³)  Space: O(n²)
 */
function numberOfSetsV2(n: number, maxDistance: number, roads: number[][]): number {
  let count = 0;
  const INF = 1e9;

  for (let mask = 1; mask < 1 << n; mask++) {
    const nodes: number[] = [];
    for (let i = 0; i < n; i++) if ((mask >> i) & 1) nodes.push(i);

    const dist = new Array(n)
      .fill(0)
      .map((_, i) => new Array(n).fill(0).map((__, j) => (i === j ? 0 : INF)));

    for (const [u, v, w] of roads) {
      if ((mask >> u) & 1 && (mask >> v) & 1) {
        dist[u][v] = Math.min(dist[u][v], w);
        dist[v][u] = Math.min(dist[v][u], w);
      }
    }

    for (const k of nodes)
      for (const i of nodes)
        for (const j of nodes)
          if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];

    const valid = nodes.every((i, ii) =>
      nodes.slice(ii + 1).every((j) => dist[i][j] <= maxDistance),
    );

    if (valid) count++;
  }

  return count;
}

console.log(
  numberOfSetsV2(3, 5, [
    [0, 1, 2],
    [1, 2, 10],
    [0, 2, 10],
  ]),
); // 7
```

---

## 🔗 Related Problems

| Problem                                                                                                                    | Difficulty | Key Idea                  |
| -------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------- |
| [Network Delay Time 743](https://leetcode.com/problems/network-delay-time)                                                 | Medium     | Floyd-Warshall / Dijkstra |
| [Subsets 78](https://leetcode.com/problems/subsets)                                                                        | Medium     | Bitmask enumeration       |
| [Find Critical Edges 1489](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree) | Hard       | Graph + bitmask           |
| [Shortest Path Visiting All Nodes 847](https://leetcode.com/problems/shortest-path-visiting-all-nodes)                     | Hard       | BFS + bitmask state       |
