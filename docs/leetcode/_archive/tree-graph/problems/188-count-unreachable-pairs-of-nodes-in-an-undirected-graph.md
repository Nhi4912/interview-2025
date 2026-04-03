---
layout: page
title: "Count Unreachable Pairs of Nodes in an Undirected Graph"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/count-unreachable-pairs-of-nodes-in-an-undirected-graph"
---

# Count Unreachable Pairs of Nodes in an Undirected Graph / Đếm Các Cặp Node Không Thể Đến Nhau Trong Đồ Thị Vô Hướng

🟡 Medium | Union Find | Connected Components

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Hãy tưởng tượng các hòn đảo — mỗi **thành phần liên thông** là một hòn đảo. Hai người trên **các đảo khác nhau** không thể gặp nhau. Số cặp không thể đến nhau = tổng `size(island_i) × size(island_j)` với mọi cặp đảo khác nhau.

```
Components: [0,1,2] size=3   [3,4] size=2   [5] size=1
Unreachable pairs:
  3×2 + 3×1 + 2×1 = 6+3+2 = 11
Formula: for each component, pairs = size × (total_remaining_nodes)
```

**Key insight:** Find all connected components and their sizes. Count unreachable pairs as: for each component of size `s`, add `s × (n - accumulated_count)`, building up from left.

## Problem Description

Given `n` nodes (0 to n-1) and an edge list, return the number of pairs `(i, j)` where `i < j` and there is no path connecting node `i` and node `j`.

**Example 1:**

- Input: `n=3, edges=[[0,1],[0,2],[1,2]]`
- Output: `0` (all nodes connected)

**Example 2:**

- Input: `n=7, edges=[[0,2],[0,5],[2,4],[1,6],[5,4]]`
- Output: `14`

## 📝 Interview Tips

- **Q: How count pairs efficiently? / Đếm cặp hiệu quả thế nào?**
  - A: For sizes [s1, s2, ...], unreachable = s1*(s2+s3+...) + s2*(s3+...) + ... / Dùng tổng lũy kế.
- **Q: Union Find vs DFS? / Union Find hay DFS?**
  - A: Both work; Union Find is typically faster in practice / Cả hai đều được; Union Find thường nhanh hơn.
- **Q: Time complexity? / Độ phức tạp?**
  - A: O(n + E _ α(n)) with Union Find / O(n + E _ α(n)) với Union Find.
- **Q: Risk of integer overflow? / Có lo tràn số nguyên không?**
  - A: Yes — n up to 10^5 so pairs up to ~10^10; use BigInt or number carefully / Có — dùng number hoặc BigInt cẩn thận.
- **Q: What if no edges? / Nếu không có cạnh?**
  - A: n*(n-1)/2 unreachable pairs (all isolated nodes) / n*(n-1)/2 cặp.
- **Q: Can the graph be disconnected? / Đồ thị có thể ngắt kết nối không?**
  - A: Yes — that's exactly the interesting case / Có — đó chính là trường hợp thú vị.

## Solutions

### Solution 1: Union Find

```typescript
/**
 * Count unreachable pairs using Union Find.
 * Time: O(n + E*α(n))  Space: O(n)
 */
function countPairs(n: number, edges: number[][]): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const size = new Array(n).fill(1);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a: number, b: number): void {
    const pa = find(a),
      pb = find(b);
    if (pa === pb) return;
    if (size[pa] < size[pb]) {
      parent[pa] = pb;
      size[pb] += size[pa];
    } else {
      parent[pb] = pa;
      size[pa] += size[pb];
    }
  }

  for (const [u, v] of edges) union(u, v);

  // Count unreachable pairs: for each component size s,
  // pairs with all remaining nodes not yet processed
  const compSizes: number[] = [];
  for (let i = 0; i < n; i++) {
    if (find(i) === i) compSizes.push(size[i]);
  }

  let result = 0;
  let remaining = n;
  for (const s of compSizes) {
    remaining -= s;
    result += s * remaining;
  }
  return result;
}

// Tests
console.log(
  countPairs(3, [
    [0, 1],
    [0, 2],
    [1, 2],
  ]),
); // 0
console.log(
  countPairs(7, [
    [0, 2],
    [0, 5],
    [2, 4],
    [1, 6],
    [5, 4],
  ]),
); // 14
console.log(countPairs(5, [])); // 10
```

### Solution 2: DFS / BFS to Find Components

```typescript
/**
 * Count unreachable pairs using DFS.
 * Time: O(n + E)  Space: O(n + E)
 */
function countPairsDFS(n: number, edges: number[][]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const visited = new Array(n).fill(false);
  const compSizes: number[] = [];

  for (let i = 0; i < n; i++) {
    if (visited[i]) continue;
    // BFS to find component size
    const queue = [i];
    visited[i] = true;
    let cnt = 0;
    while (queue.length) {
      const cur = queue.pop()!;
      cnt++;
      for (const nb of adj[cur]) {
        if (!visited[nb]) {
          visited[nb] = true;
          queue.push(nb);
        }
      }
    }
    compSizes.push(cnt);
  }

  let result = 0,
    remaining = n;
  for (const s of compSizes) {
    remaining -= s;
    result += s * remaining;
  }
  return result;
}

// Tests
console.log(
  countPairsDFS(3, [
    [0, 1],
    [0, 2],
    [1, 2],
  ]),
); // 0
console.log(
  countPairsDFS(7, [
    [0, 2],
    [0, 5],
    [2, 4],
    [1, 6],
    [5, 4],
  ]),
); // 14
```

## 🔗 Related Problems

| #    | Problem                                | Difficulty | Key Concept |
| ---- | -------------------------------------- | ---------- | ----------- |
| 547  | Number of Provinces                    | Medium     | Union Find  |
| 684  | Redundant Connection                   | Medium     | Union Find  |
| 1319 | Number of Operations to Make Connected | Medium     | Union Find  |
| 2316 | Count Unreachable Pairs                | Medium     | Union Find  |
