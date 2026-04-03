---
layout: page
title: "Maximum Genetic Difference Query"
difficulty: Hard
category: Tree-Graph
tags: [Array, Hash Table, Bit Manipulation, Depth-First Search, Trie]
leetcode_url: "https://leetcode.com/problems/maximum-genetic-difference-query"
---

# Maximum Genetic Difference Query / Truy Vấn Sự Khác Biệt Di Truyền Tối Đa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Trie
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Number of Valid Words for Each Puzzle](https://leetcode.com/problems/number-of-valid-words-for-each-puzzle) | [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống cây gia phả — mỗi người có mã gen. Khi bạn ở một vị trí trong cây, bạn chỉ "nhìn thấy" tổ tiên của mình (đường từ gốc đến bạn). Với mỗi truy vấn `(node, val)`, tìm tổ tiên nào có XOR với `val` lớn nhất — như tìm người trong gia tộc có gen tương phản nhất với bạn.

**Pattern Recognition:**

- Signal: "max XOR with ancestors on path from root" + "online queries per node" → **DFS + Binary Trie**
- Key insight: DFS cây, dùng Binary Trie để lưu các ancestors; khi vào node thêm vào Trie, khi ra khỏi node xóa khỏi Trie (online approach)

**Visual — Maximum Genetic Difference Query example:**

```
parents=[-1,0,1,1], queries=[[0,2],[3,2],[2,5]]
Tree:  0 → 1 → 2
           ↓
           3
Trie at node 2 (path 0→1→2):
  Contains: 0 (binary:00), 1 (binary:01), 2 (binary:10)
  Query val=5 (binary:101): XOR with 2(10)=111=7, max=7

DFS order: enter 0(add 0), enter 1(add 1), enter 2(add 2)
  query[0]=(0,2): max XOR(2, {0}) = 2
  query[1]=(3,2): at node 3 → path {0,1,3}, XOR(2,1)=3
  query[2]=(2,5): at node 2 → path {0,1,2}, XOR(5,2)=7
```

---

## 📝 Problem Description

Given a rooted tree with `n` nodes (root index from `parents` where `parents[root]=-1`) and queries `[nodei, vali]`, for each query find the **maximum XOR** of `vali` with any node value on the path from root to `nodei`. Return results array.

**Example 1:** `parents=[-1,0,1,1]`, `queries=[[0,2],[3,2],[2,5]]` → `[2,3,7]`
**Example 2:** `parents=[-1,0,0,2]`, `queries=[[0,4],[3,6],[1,1]]` → `[4,6,5]`

Constraints: `2 ≤ n ≤ 10⁵`, `0 ≤ queries[i][0] < n`, `0 ≤ queries[i][1] ≤ 2×10⁵`.

---

## 🎯 Interview Tips

1. **Group queries by node**: for each node, store which queries to answer / Nhóm queries theo node để trả lời khi DFS đến node đó
2. **Binary Trie for max XOR**: standard pattern for max XOR queries / Binary Trie là pattern chuẩn cho max XOR
3. **Add/Remove from Trie**: as you enter/exit nodes in DFS / Thêm khi vào node, xóa khi ra khỏi node trong DFS
4. **Bit depth**: values up to 2×10⁵ < 2^18, use 18 bits / Giá trị ≤ 2×10⁵ < 2^18, dùng 18 bit
5. **Use count in Trie nodes** to handle add/remove safely / Dùng count trong Trie node để add/remove an toàn
6. **Offline processing** via DFS avoids repeated traversal / Xử lý offline qua DFS tránh duyệt lại nhiều lần

---

## 💡 Solutions

### Approach 1: Brute Force — O(N × Q × 18)

/\*_ @complexity Time: O(N×Q) | Space: O(N) _/

```typescript
function maxGeneticDifferenceBrute(parents: number[], queries: number[][]): number[] {
  const n = parents.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  let root = 0;
  for (let i = 0; i < n; i++) {
    if (parents[i] === -1) root = i;
    else children[parents[i]].push(i);
  }
  const path: number[] = [];
  const ans = new Array(queries.length).fill(0);
  function dfs(node: number): void {
    path.push(node);
    for (let qi = 0; qi < queries.length; qi++) {
      if (queries[qi][0] === node) {
        const val = queries[qi][1];
        ans[qi] = Math.max(...path.map((p) => p ^ val));
      }
    }
    for (const c of children[node]) dfs(c);
    path.pop();
  }
  dfs(root);
  return ans;
}
```

### Approach 2: DFS + Binary Trie (Online) — Optimal

/\*_ @complexity Time: O((N + Q) × 18) | Space: O(N × 18) _/

```typescript
function maxGeneticDifference(parents: number[], queries: number[][]): number[] {
  const BITS = 18;
  const n = parents.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  let root = 0;
  for (let i = 0; i < n; i++) {
    if (parents[i] === -1) root = i;
    else children[parents[i]].push(i);
  }

  // Group queries by node
  const nodeQueries: [number, number][][] = Array.from({ length: n }, () => []);
  for (let qi = 0; qi < queries.length; qi++) {
    nodeQueries[queries[qi][0]].push([queries[qi][1], qi]);
  }

  // Binary Trie with count for add/remove
  const trie: number[][] = [[0, 0, 0]]; // [left(0), right(1), count]
  function trieUpdate(num: number, delta: 1 | -1): void {
    let node = 0;
    for (let b = BITS; b >= 0; b--) {
      const bit = (num >> b) & 1;
      if (!trie[node][bit]) {
        trie.push([0, 0, 0]);
        trie[node][bit] = trie.length - 1;
      }
      node = trie[node][bit];
      trie[node][2] += delta;
    }
  }
  function trieQuery(val: number): number {
    let node = 0, xor = 0;
    for (let b = BITS; b >= 0; b--) {
      const bit = (val >> b) & 1;
      const want = 1 - bit;
      const child = trie[node][want];
      if (child && trie[child][2] > 0) { xor |= 1 << b; node = child; }
      else { node = trie[node][bit] || 0; }
    }
    return xor;
  }

  const ans = new Array(queries.length).fill(0);
  function dfs(node: number): void {
    trieUpdate(node, 1);
    for (const [val, qi] of nodeQueries[node]) ans[qi] = trieQuery(val);
    for (const c of children[node]) dfs(c);
    trieUpdate(node, -1);
  }
  dfs(root);
  return ans;
}
```

---

## 🧪 Test Cases

```typescript
const p1 = [-1, 0, 1, 1];
const q1 = [[0,2],[3,2],[2,5]];
console.log(maxGeneticDifference(p1, q1));            // → [2,3,7]
console.log(maxGeneticDifference([-1,0,0,2], [[0,4],[3,6],[1,1]])); // → [4,6,5]
console.log(maxGeneticDifferenceBrute(p1, q1));       // → [2,3,7]
```

---

## Related Problems

| Problem                                                                                                        | Difficulty | Pattern     |
| -------------------------------------------------------------------------------------------------------------- | ---------- | ----------- |
| [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array) | Medium     | Binary Trie |
| [Maximum XOR With an Element From Array](https://leetcode.com/problems/maximum-xor-with-an-element-from-array) | Hard       | Trie        |
| [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree)                             | Hard       | Tree DP     |
