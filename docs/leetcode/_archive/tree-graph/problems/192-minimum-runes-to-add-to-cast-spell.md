---
layout: page
title: "Minimum Runes to Add to Cast Spell"
difficulty: Hard
category: Tree-Graph
tags: [Array, Depth-First Search, Breadth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/minimum-runes-to-add-to-cast-spell"
---

# Minimum Runes to Add to Cast Spell / Số Rune Tối Thiểu Cần Thêm Để Thi Triển Phép Thuật

🔴 Hard | Strongly Connected Components | Kosaraju / Tarjan

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Mỗi rune là một mắt xích trong chuỗi phép thuật — một số rune có thể kích hoạt rune khác. Bài toán hỏi: bao nhiêu rune cần được kích hoạt **thủ công** để toàn bộ chuỗi được kích hoạt? Đây là bài toán đếm **số SCC (Strongly Connected Components) không có cạnh vào** trong đồ thị DAG thu gọn.

```
Graph: 0→1→2←3→4
              ↑
              5

SCC DAG: {0}→{1}→{2,3,5}→{4}
No incoming: {0} → need 1 manual activation
```

**Key insight:** Condense the graph into a DAG of SCCs. Count SCCs with in-degree 0 in the DAG. Each such SCC needs one manual activation (one rune added).

## Problem Description

You have `n` runes and a list of `edges` where `edges[i] = [a, b]` means activating rune `a` activates rune `b`. Return the minimum number of runes you need to manually activate to eventually activate all runes.

**Example 1:**

- Input: `n=3, edges=[[0,1],[1,2]]`
- Output: `1` (activate 0, triggers 1, triggers 2)

**Example 2:**

- Input: `n=6, edges=[[0,1],[0,2],[1,3],[2,3],[3,4],[4,2]]`
- Output: `2`

## 📝 Interview Tips

- **Q: Why find SCCs? / Tại sao tìm SCC?**
  - A: Nodes in same SCC can all be activated from any one of them / Các node trong cùng SCC kích hoạt lẫn nhau.
- **Q: After condensation, what do we count? / Sau thu gọn, ta đếm gì?**
  - A: SCC nodes with in-degree 0 in the DAG — they have no trigger / SCC có bậc vào = 0 — không ai kích hoạt chúng.
- **Q: Which SCC algorithm? / Thuật toán SCC nào?**
  - A: Kosaraju (2 DFS passes) or Tarjan (1 DFS pass) / Kosaraju (2 lần DFS) hoặc Tarjan (1 lần DFS).
- **Q: Time complexity? / Độ phức tạp?**
  - A: O(n + E) for SCC detection / O(n + E) để phát hiện SCC.
- **Q: Edge case — isolated node? / Trường hợp biên — node cô lập?**
  - A: Each isolated node is its own SCC with in-degree 0 / Mỗi node cô lập là SCC riêng với bậc vào = 0.
- **Q: Answer if all nodes form one SCC? / Kết quả nếu tất cả tạo một SCC?**
  - A: 1 — activate any one node / 1 — kích hoạt một node bất kỳ.

## Solutions

### Solution 1: Kosaraju's Algorithm (2-pass DFS)

```typescript
/**
 * Minimum runes to add using Kosaraju SCC.
 * Time: O(n + E)  Space: O(n + E)
 */
function minimumRunes(n: number, edges: number[][]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  const radj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    radj[v].push(u);
  }

  // Pass 1: DFS on original graph, record finish order
  const visited = new Array(n).fill(false);
  const order: number[] = [];
  function dfs1(u: number): void {
    visited[u] = true;
    for (const v of adj[u]) if (!visited[v]) dfs1(v);
    order.push(u);
  }
  for (let i = 0; i < n; i++) if (!visited[i]) dfs1(i);

  // Pass 2: DFS on reversed graph in reverse finish order
  const comp = new Array(n).fill(-1);
  let numSCC = 0;
  function dfs2(u: number, c: number): void {
    comp[u] = c;
    for (const v of radj[u]) if (comp[v] === -1) dfs2(v, c);
  }
  for (let i = order.length - 1; i >= 0; i--) {
    if (comp[order[i]] === -1) {
      dfs2(order[i], numSCC);
      numSCC++;
    }
  }

  // Count SCCs with no incoming edges in condensed DAG
  const hasIncoming = new Array(numSCC).fill(false);
  for (const [u, v] of edges) {
    const cu = comp[u],
      cv = comp[v];
    if (cu !== cv) hasIncoming[cv] = true;
  }
  return hasIncoming.filter((x) => !x).length;
}

// Tests
console.log(
  minimumRunes(3, [
    [0, 1],
    [1, 2],
  ]),
); // 1
console.log(
  minimumRunes(6, [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [4, 2],
  ]),
); // 2
console.log(minimumRunes(4, [])); // 4
```

### Solution 2: Tarjan's Algorithm (1-pass DFS)

```typescript
/**
 * Minimum runes using Tarjan's SCC.
 * Time: O(n + E)  Space: O(n)
 */
function minimumRunesTarjan(n: number, edges: number[][]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);

  const index = new Array(n).fill(-1);
  const lowlink = new Array(n).fill(0);
  const onStack = new Array(n).fill(false);
  const comp = new Array(n).fill(-1);
  const stack: number[] = [];
  let idx = 0,
    sccCount = 0;

  function strongConnect(v: number): void {
    index[v] = lowlink[v] = idx++;
    stack.push(v);
    onStack[v] = true;
    for (const w of adj[v]) {
      if (index[w] === -1) {
        strongConnect(w);
        lowlink[v] = Math.min(lowlink[v], lowlink[w]);
      } else if (onStack[w]) lowlink[v] = Math.min(lowlink[v], index[w]);
    }
    if (lowlink[v] === index[v]) {
      let w: number;
      do {
        w = stack.pop()!;
        onStack[w] = false;
        comp[w] = sccCount;
      } while (w !== v);
      sccCount++;
    }
  }
  for (let i = 0; i < n; i++) if (index[i] === -1) strongConnect(i);

  const hasIncoming = new Array(sccCount).fill(false);
  for (const [u, v] of edges) {
    if (comp[u] !== comp[v]) hasIncoming[comp[v]] = true;
  }
  return hasIncoming.filter((x) => !x).length;
}

// Tests
console.log(
  minimumRunesTarjan(3, [
    [0, 1],
    [1, 2],
  ]),
); // 1
console.log(
  minimumRunesTarjan(6, [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [4, 2],
  ]),
); // 2
```

## 🔗 Related Problems

| #    | Problem                                       | Difficulty | Key Concept      |
| ---- | --------------------------------------------- | ---------- | ---------------- |
| 207  | Course Schedule                               | Medium     | Cycle Detection  |
| 210  | Course Schedule II                            | Medium     | Topological Sort |
| 1557 | Minimum Number of Vertices to Reach All Nodes | Medium     | In-degree Count  |
| 1192 | Critical Connections in a Network             | Hard       | Tarjan's Bridge  |
