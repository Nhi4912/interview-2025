---
layout: page
title: "Count Pairs of Connectable Servers in a Weighted Tree Network"
difficulty: Medium
category: Tree-Graph
tags: [Array, Tree, Depth-First Search]
leetcode_url: "https://leetcode.com/problems/count-pairs-of-connectable-servers-in-a-weighted-tree-network"
---

# Count Pairs of Connectable Servers in a Weighted Tree Network / Đếm Cặp Server Kết Nối Được

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS per Root Node
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Count Nodes With the Highest Score](https://leetcode.com/problems/count-nodes-with-the-highest-score) | [Most Profitable Path in a Tree](https://leetcode.com/problems/most-profitable-path-in-a-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy (VI):** Với mỗi node làm "relay server", đếm bao nhiêu node trong mỗi subtree có tổng khoảng cách chia hết cho `signalSpeed`. Số cặp = tích chéo các số đếm từ các subtree khác nhau.

**Analogy (EN):** For each node `u` as the relay, DFS each of its subtrees counting nodes reachable with path-sum divisible by `signalSpeed`. Pairs across different subtrees multiply: `sum_so_far × count_in_new_subtree`.

```
edges: [0-1 w=3, 1-2 w=3, 2-3 w=3], signalSpeed=3
For node 1 as relay:
  Subtree via edge 0: DFS finds node 0, dist=3 (divisible) → count=1
  Subtree via edge 2: DFS finds nodes 2,3, dist=3,6 → count=2
  Pairs at node 1 = 1×2 = 2

For each node, pairs = prefix_sum × new_count, then add new_count to prefix_sum.
```

---

## 📝 Interview Tips

1. **Key insight / Mấu chốt**: Với mỗi node làm relay, đếm nodes trong từng subtree có dist % speed == 0, rồi nhân chéo / For each relay node, cross-multiply counts from different subtrees
2. **DFS from each edge / DFS từng nhánh**: DFS từng neighbor của node hiện tại (không qua node cha) để tính count per subtree
3. **Prefix product trick / Nhân prefix**: `ans += prev_total × cur_count` rồi `prev_total += cur_count` — tránh nhân đôi / Multiply running total × new count to avoid double counting
4. **Edge weight matters / Trọng số cạnh**: Track cumulative dist — thêm edge weight khi DFS xuống / Accumulate edge weights during DFS
5. **Time complexity / Độ phức tạp**: O(N²) — với mỗi trong N nodes, DFS O(N) / O(N²) — acceptable for N ≤ 1000
6. **Follow-up**: "Nếu N rất lớn?" → cần centroid decomposition, O(N log N)

---

## Solutions

```typescript
/**
 * Solution 1: DFS per Node (O(N²))
 * Time: O(N²) — for each of N nodes, DFS visits up to N nodes
 * Space: O(N) — adjacency list + recursion stack
 *
 * Với mỗi node làm relay: DFS qua từng subtree, đếm nodes có dist%speed==0.
 * Pairs = cross-product of counts across subtrees.
 */
function countPairsOfConnectableServers(edges: number[][], signalSpeed: number): number[] {
  const n = edges.length + 1;
  const adj: [number, number][][] = Array.from({ length: n }, () => []); // [neighbor, weight]

  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }

  // DFS from `start` avoiding `blocked` node, count nodes with dist%speed==0
  function dfs(node: number, blocked: number, dist: number): number {
    let count = dist % signalSpeed === 0 ? 1 : 0;
    for (const [nb, w] of adj[node]) {
      if (nb !== blocked) {
        count += dfs(nb, node, dist + w);
      }
    }
    return count;
  }

  const result: number[] = new Array(n).fill(0);

  for (let u = 0; u < n; u++) {
    let prevTotal = 0; // count of valid nodes in already-processed subtrees
    for (const [nb, w] of adj[u]) {
      // Count nodes reachable from nb (not going back through u) with dist starting at w
      const cnt = dfs(nb, u, w);
      result[u] += prevTotal * cnt; // pair with all previously counted nodes
      prevTotal += cnt;
    }
  }

  return result;
}

/**
 * Solution 2: Same approach — cleaner with helper
 * Time: O(N²) — same complexity
 * Space: O(N)
 */
function countPairsV2(edges: number[][], signalSpeed: number): number[] {
  const n = edges.length + 1;
  const adj: Map<number, [number, number][]> = new Map();
  for (let i = 0; i < n; i++) adj.set(i, []);
  for (const [u, v, w] of edges) {
    adj.get(u)!.push([v, w]);
    adj.get(v)!.push([u, w]);
  }

  function countReachable(node: number, parent: number, dist: number): number {
    let cnt = dist % signalSpeed === 0 ? 1 : 0;
    for (const [nb, w] of adj.get(node)!) {
      if (nb !== parent) cnt += countReachable(nb, node, dist + w);
    }
    return cnt;
  }

  return Array.from({ length: n }, (_, u) => {
    let ans = 0,
      prev = 0;
    for (const [nb, w] of adj.get(u)!) {
      const cnt = countReachable(nb, u, w);
      ans += prev * cnt;
      prev += cnt;
    }
    return ans;
  });
}

// === Test Cases ===
console.log(
  countPairsOfConnectableServers(
    [
      [0, 1, 1],
      [1, 2, 5],
      [2, 3, 13],
      [3, 4, 9],
      [4, 5, 2],
    ],
    1,
  ),
);
// [0,4,6,6,4,0]

console.log(
  countPairsOfConnectableServers(
    [
      [0, 6, 3],
      [6, 5, 3],
      [0, 3, 1],
      [3, 2, 7],
      [3, 1, 6],
      [3, 4, 2],
    ],
    3,
  ),
);
// [2,0,0,0,0,0,2]

console.log(
  countPairsV2(
    [
      [0, 1, 1],
      [1, 2, 5],
      [2, 3, 13],
      [3, 4, 9],
      [4, 5, 2],
    ],
    1,
  ),
);
// [0,4,6,6,4,0]
```

---

## 🔗 Related Problems

| Problem                                                                                                                            | Pattern         | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- |
| [Count Nodes With the Highest Score](https://leetcode.com/problems/count-nodes-with-the-highest-score)                             | DFS             | 🟡 Medium  |
| [Most Profitable Path in a Tree](https://leetcode.com/problems/most-profitable-path-in-a-tree)                                     | BFS/DFS on Tree | 🟡 Medium  |
| [Longest Path With Different Adjacent Characters](https://leetcode.com/problems/longest-path-with-different-adjacent-characters)   | DFS             | 🔴 Hard    |
| [Difference Between Maximum and Minimum Price Sum](https://leetcode.com/problems/difference-between-maximum-and-minimum-price-sum) | DFS             | 🔴 Hard    |
