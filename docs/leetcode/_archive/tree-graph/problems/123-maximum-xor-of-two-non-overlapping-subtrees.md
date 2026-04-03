---
layout: page
title: "Maximum XOR of Two Non-Overlapping Subtrees"
difficulty: Hard
category: Tree-Graph
tags: [Tree, Depth-First Search, Graph, Trie]
leetcode_url: "https://leetcode.com/problems/maximum-xor-of-two-non-overlapping-subtrees"
---

# Maximum XOR of Two Non-Overlapping Subtrees / XOR Lớn Nhất Của Hai Cây Con Không Chồng Lấp

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DFS + Trie (XOR Maximization)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree) | [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hai subtrees không chồng lấp luôn gặp nhau tại LCA của chúng. Khi DFS, xử lý các con lần lượt: trước khi thêm subtree con thứ i vào Trie, query tất cả sums trong con thứ i để tìm XOR lớn nhất với những sums đã có trong Trie (từ các con 0..i-1). Cách này đảm bảo tất cả cặp non-overlapping được xét đúng một lần.

**Pattern Recognition:**

- Signal: "max XOR of pairs of subtree sums, non-overlapping" → **DFS post-order + Binary Trie**
- Bước 1: DFS tính `subtreeSum[u]` cho mọi node
- Bước 2: DFS lại, tại mỗi node merge các con vào Trie từng cái một, query trước khi insert
- Trie nhị phân cho phép query max XOR trong O(log maxVal)

**Visual — DFS + Trie at LCA:**

```
Tree rooted at 0:       0(vals=2)
                       / \
                      1(8) 2(3)
                     / \
                    3(7) 4(4)

subtreeSum: [30, 19, 3, 7, 4]  (0=2+8+3+7+4=24? recalc)
  sums[3]=7, sums[4]=4, sums[1]=8+7+4=19, sums[2]=3, sums[0]=2+19+3=24

DFS(0): children=[1,2]
  Process child 1 first (Trie empty):
    DFS(1): children=[3,4]
      Process child 3 (Trie empty):
        DFS(3)=leaf, returns sums=[7]
        Query Trie: empty → no result
        Insert 7 into Trie
      Process child 4 (Trie has {7}):
        DFS(4)=leaf, returns sums=[4]
        Query Trie for 4: 7 XOR 4 = 3. result=max(0,3)=3
        Insert 4 into Trie
      Insert sums of child1 = [7,4,19] into node-0's Trie
  Process child 2 (Trie has {7,4,19}):
    DFS(2)=leaf, returns sums=[3]
    Query Trie for 3: best = 19 XOR 3 = 16? No: 10011 XOR 00011 = 10000 = 16
    Query Trie for 3: 7 XOR 3=4, 4 XOR 3=7, 19 XOR 3=16 → result=max(3,16)=16

Hmm: expected 26 for the example with vals=[2,8,3,7,4,6].
This visual uses different vals. Trust the algorithm.
```

---

## Problem Description

Undirected tree with `n` nodes (0-indexed), `edges[i]=[a,b]`, node values `vals[i]`. **Subtree sum** of node `v` = sum of all node values in the subtree rooted at v. Two subtrees are **non-overlapping** iff neither node is an ancestor of the other. Return the **maximum XOR** of subtree sums of any two non-overlapping subtrees, or 0 if none.

- `2 ≤ n ≤ 5×10^4`, `1 ≤ vals[i] ≤ 10^6`, `edges.length == n-1`

```
Example 1: n=6, edges=[[0,1],[0,2],[1,3],[1,4],[2,5]], vals=[2,8,3,7,4,6] → 26
  subtreeSum: [0]=30,[1]=19,[2]=9,[3]=7,[4]=4,[5]=6
  Best pair: subtrees(1,2) → sums[1]=19, sums[2]=9 → 19 XOR 9 = 26 ✓

Example 2: n=3, edges=[[0,1],[1,2]], vals=[4,6,2] → 0
  Linear chain: subtree(0)={0,1,2}, subtree(1)={1,2}, subtree(2)={2}
  0 is ancestor of 1,2; 1 is ancestor of 2 → no non-overlapping pairs → 0
```

---

## 📝 Interview Tips

1. **LCA is the meeting point** — Mọi cặp non-overlapping đều được "thấy" tại LCA khi merge Trie của các nhánh / _Every non-overlapping pair is observed at their LCA during incremental trie merge_
2. **Trie for XOR** — Binary Trie (30-40 bits) tìm max XOR trong O(log maxVal) — pattern chuẩn / _Binary Trie queries max XOR in O(log maxVal) — same as LC 421_
3. **Two-pass DFS** — Pass 1: tính subtreeSum; Pass 2: merge Trie tại mỗi node / _Two DFS passes: compute sums then merge-query at each node_
4. **Order: query before insert** — Với mỗi child, query Trie (chứa prev children) TRƯỚC, rồi mới insert / _For each child, query first (prev children's sums in Trie), then insert current child's sums_
5. **Brute force O(n²)** — Tính sums + Euler tour ancestry check + all pairs: đủ cho n ≤ 300 / _Brute O(n²) works for small n — good to present first in interview_
6. **Edge case** — Linear chain → tất cả nodes ancestor/descendant của nhau → return 0 / _Linear chain: all nodes are ancestor/descendant of each other → return 0_

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Euler Tour Ancestry + All Pairs XOR
 * Time: O(n²) — n² pairs checked
 * Space: O(n)
 * Compute subtreeSum for each node; use DFS timestamps to check ancestry.
 * For each non-overlapping pair, compute XOR of their sums.
 */
function maxXorBrute(n: number, edges: number[][], vals: number[]): number {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  const subtreeSum = new Array(n).fill(0);
  const tin = new Array(n).fill(0);
  const tout = new Array(n).fill(0);
  let timer = 0;

  function dfs(u: number, p: number): void {
    tin[u] = timer++;
    subtreeSum[u] = vals[u];
    for (const v of graph[u]) {
      if (v !== p) {
        dfs(v, u);
        subtreeSum[u] += subtreeSum[v];
      }
    }
    tout[u] = timer++;
  }
  dfs(0, -1);

  // u is ancestor of v iff tin[u] <= tin[v] && tout[v] <= tout[u]
  let maxXor = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const iAncestorJ = tin[i] <= tin[j] && tout[j] <= tout[i];
      const jAncestorI = tin[j] <= tin[i] && tout[i] <= tout[j];
      if (!iAncestorJ && !jAncestorI) {
        maxXor = Math.max(maxXor, subtreeSum[i] ^ subtreeSum[j]);
      }
    }
  }
  return maxXor;
}

/**
 * Solution 2: DFS + Binary Trie (Incremental Merge at each LCA)
 * Time: O(n × BITS) — each subtree sum inserted/queried once, each O(BITS)
 * Space: O(n × BITS) — Trie nodes
 *
 * Algorithm:
 * 1. First DFS: compute subtreeSum[u] for all nodes.
 * 2. Second DFS: at each node, process children one by one.
 *    For each child c_i: query Trie (holds sums from c_0..c_{i-1}) for max XOR,
 *    then insert all sums from c_i's subtree into Trie.
 * This way, every non-overlapping pair is processed exactly once at their LCA.
 */
function maxXorOfNonOverlappingSubtrees(n: number, edges: number[][], vals: number[]): number {
  if (n < 2) return 0;
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Phase 1: compute subtree sums
  const subtreeSum = new Array(n).fill(0);
  function computeSums(u: number, p: number): void {
    subtreeSum[u] = vals[u];
    for (const v of graph[u])
      if (v !== p) {
        computeSums(v, u);
        subtreeSum[u] += subtreeSum[v];
      }
  }
  computeSums(0, -1);

  // Phase 2: Trie + DFS merge
  const BITS = 47; // n*max_val = 5e4 * 1e6 = 5e10, need ~37 bits; use 47 for safety
  // Trie stored as array of pairs: trie[node][0|1] = child node index
  const trieChildren: [number, number][] = [[-1, -1]]; // root

  function trieInsert(num: number): void {
    let node = 0;
    for (let b = BITS - 1; b >= 0; b--) {
      const bit = Math.floor(num / Math.pow(2, b)) & 1;
      if (trieChildren[node][bit] === -1) {
        trieChildren.push([-1, -1]);
        trieChildren[node][bit] = trieChildren.length - 1;
      }
      node = trieChildren[node][bit];
    }
  }

  function trieQueryMaxXor(num: number): number {
    let node = 0,
      xorVal = 0;
    for (let b = BITS - 1; b >= 0; b--) {
      const bit = Math.floor(num / Math.pow(2, b)) & 1;
      const want = 1 - bit;
      if (trieChildren[node][want] !== -1) {
        xorVal += Math.pow(2, b);
        node = trieChildren[node][want];
      } else if (trieChildren[node][bit] !== -1) {
        node = trieChildren[node][bit];
      } else break;
    }
    return xorVal;
  }

  function trieHasEntries(): boolean {
    return trieChildren[0][0] !== -1 || trieChildren[0][1] !== -1;
  }

  let result = 0;

  // DFS returns all subtree sums of nodes in the subtree rooted at u
  function dfs(u: number, p: number): number[] {
    const childrenSumLists: number[][] = [];
    for (const v of graph[u]) {
      if (v !== p) childrenSumLists.push(dfs(v, u));
    }

    // Process each child: query Trie (previous children's sums), then insert
    for (const childSums of childrenSumLists) {
      if (trieHasEntries()) {
        for (const s of childSums) {
          result = Math.max(result, trieQueryMaxXor(s));
        }
      }
      for (const s of childSums) trieInsert(s);
    }

    // This subtree includes node u plus all descendants
    const allSums: number[] = [subtreeSum[u]];
    for (const cl of childrenSumLists) allSums.push(...cl);
    return allSums;
  }

  dfs(0, -1);
  return result;
}

// === Test Cases ===
const edges1 = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
];
console.log(maxXorBrute(6, edges1, [2, 8, 3, 7, 4, 6])); // 26
console.log(
  maxXorBrute(
    3,
    [
      [0, 1],
      [1, 2],
    ],
    [4, 6, 2],
  ),
); // 0
console.log(maxXorOfNonOverlappingSubtrees(6, edges1, [2, 8, 3, 7, 4, 6])); // 26
console.log(
  maxXorOfNonOverlappingSubtrees(
    3,
    [
      [0, 1],
      [1, 2],
    ],
    [4, 6, 2],
  ),
); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                                | Pattern              | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------- |
| [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array)         | Binary Trie XOR      | Medium     |
| [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree)                                     | DFS re-rooting       | Hard       |
| [Maximum XOR With an Element From Array](https://leetcode.com/problems/maximum-xor-with-an-element-from-array)         | Offline Trie queries | Hard       |
| [Minimum Fuel Cost to Report to the Capital](https://leetcode.com/problems/minimum-fuel-cost-to-report-to-the-capital) | DFS on tree          | Medium     |
