---
layout: page
title: "Minimum Cost to Convert String I"
difficulty: Medium
category: Tree-Graph
tags: [Array, String, Graph, Shortest Path]
leetcode_url: "https://leetcode.com/problems/minimum-cost-to-convert-string-i"
---

# Minimum Cost to Convert String I / Chi phí tối thiểu để chuyển đổi chuỗi I

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Mỗi chữ cái là 1 nút trong đồ thị 26 nút. Mỗi phép biến đổi `original[i] → changed[i]` với chi phí `cost[i]` là 1 cạnh có trọng số. Dùng Floyd-Warshall để tính khoảng cách ngắn nhất giữa tất cả cặp chữ cái. Sau đó với mỗi vị trí trong `source`, tra bảng để tính tổng chi phí.

**English:** Model 26 letters as nodes in a weighted directed graph. Run **Floyd-Warshall** to precompute all-pairs shortest paths. Then for each position, look up `cost[source[i]][target[i]]` — if unreachable, return -1.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Minimum Cost to Convert String I example:**

```
original=['a','b','c'], changed=['b','c','a'], cost=[1,2,5]
Graph: a→b(1), b→c(2), c→a(5)
Floyd: dist[a][c] = dist[a][b]+dist[b][c] = 1+2 = 3  (cheaper than c→a which goes backward)

source="abcd", target="bcda"
  a→b: 1, b→c: 2, c→d: INF → return -1 (no path c→d)
```

---

---

## Problem Description

| #    | Problem                          | Difficulty | Pattern        |
| ---- | -------------------------------- | ---------- | -------------- |
| 2976 | Min Cost Convert String I (this) | Medium     | Floyd-Warshall |
| 2977 | Min Cost Convert String II       | Hard       | Trie + DP      |
| 743  | Network Delay Time               | Medium     | Dijkstra       |

---

## 📝 Interview Tips

- 🔑 **Key insight / Nhận xét chính:** Only 26 possible letters → Floyd-Warshall on 26×26 matrix is O(26³) = O(1) effectively.
- 📊 **Same char shortcut / Phím tắt cùng ký tự:** If `source[i] == target[i]`, cost is 0 — skip.
- ⚡ **INF handling / Xử lý vô cực:** Use a large finite value (e.g., 1e15) to avoid overflow in addition.
- 🎯 **Multiple edges / Nhiều cạnh:** Keep the minimum cost edge between two letters (may appear multiple times in input).
- 🧩 **Unreachable check / Kiểm tra không đến được:** If `dist[s][t] === Infinity`, return -1 immediately.
- 📏 **Complexity / Độ phức tạp:** O(26³ + n) time — Floyd-Warshall dominates for small alphabets.

---

---

## Solutions

```typescript
/**
 * Build 26-node graph from transformation rules.
 * Run Floyd-Warshall to get all-pairs shortest paths.
 * Sum up costs for each position in source → target.
 *
 * Time:  O(26^3 + E + n)
 * Space: O(26^2)
 */
function minimumCost(
  source: string,
  target: string,
  original: string[],
  changed: string[],
  cost: number[],
): number {
  const INF = 1e15;
  const dist: number[][] = Array.from({ length: 26 }, (_, i) =>
    Array.from({ length: 26 }, (__, j) => (i === j ? 0 : INF)),
  );

  // Build graph: keep minimum cost between same pair
  for (let i = 0; i < original.length; i++) {
    const u = original[i].charCodeAt(0) - 97;
    const v = changed[i].charCodeAt(0) - 97;
    dist[u][v] = Math.min(dist[u][v], cost[i]);
  }

  // Floyd-Warshall
  for (let k = 0; k < 26; k++)
    for (let i = 0; i < 26; i++)
      for (let j = 0; j < 26; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];

  // Compute total cost
  let total = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] === target[i]) continue;
    const s = source.charCodeAt(i) - 97;
    const t = target.charCodeAt(i) - 97;
    if (dist[s][t] === INF) return -1;
    total += dist[s][t];
  }
  return total;
}

console.log(
  minimumCost(
    "abcd",
    "acbe",
    ["a", "b", "c", "c", "e", "d"],
    ["b", "c", "b", "e", "b", "e"],
    [2, 5, 5, 1, 2, 20],
  ),
); // 28
console.log(minimumCost("aaaa", "bbbb", ["a", "c"], ["c", "b"], [1, 2])); // 12
console.log(minimumCost("abcd", "abce", ["a"], ["e"], [10000])); // -1 (d→e unreachable)
```

---

## 🔗 Related Problems

| #    | Problem                          | Difficulty | Pattern        |
| ---- | -------------------------------- | ---------- | -------------- |
| 2976 | Min Cost Convert String I (this) | Medium     | Floyd-Warshall |
| 2977 | Min Cost Convert String II       | Hard       | Trie + DP      |
| 743  | Network Delay Time               | Medium     | Dijkstra       |
