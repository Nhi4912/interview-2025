---
layout: page
title: "Smallest String With Swaps"
difficulty: Medium
category: Tree & Graph
tags: [Hash Table, String, Depth-First Search, Breadth-First Search, Union Find, Sorting]
leetcode_url: "https://leetcode.com/problems/smallest-string-with-swaps"
---

# Smallest String With Swaps / Chuỗi Nhỏ Nhất Sau Hoán Đổi

> **Track**: Tree & Graph | **Difficulty**: 🟡 Medium | **Pattern**: Union Find + Sort
> **Frequency**: 📗 Tier 2 — Gặp ở Amazon, Google
> **See also**: [Lexicographically Smallest Equivalent String](https://leetcode.com/problems/lexicographically-smallest-equivalent-string) | [Rank Transform of a Matrix](https://leetcode.com/problems/rank-transform-of-a-matrix)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng bạn có một bộ thẻ chữ cái được đánh số. Bạn được phép hoán đổi vị trí của hai thẻ bất kỳ thuộc cùng một "nhóm bạn bè". Trong một nhóm, bạn có thể hoán đổi tùy ý — tức là sắp xếp lại theo bất kỳ thứ tự nào. Bí quyết: các chỉ số có thể hoán đổi trực tiếp hoặc gián tiếp hình thành một thành phần liên thông. Trong mỗi thành phần, sắp xếp các ký tự theo thứ tự bảng chữ cái và gán vào vị trí nhỏ nhất trước.

## Visual (Minh họa trực quan)

```
s = "dcab", pairs = [[0,3],[1,2],[0,2]]

Union Find:
  union(0,3): group {0,3}
  union(1,2): group {1,2}
  union(0,2): group {0,1,2,3} ← all connected!

One component: indices [0,1,2,3]
  chars at these indices: d,c,a,b
  sort chars: a,b,c,d
  sort indices: 0,1,2,3
  assign: s[0]=a, s[1]=b, s[2]=c, s[3]=d
Result: "abcd" ✓

s = "cba", pairs = [[0,1],[1,2]]
Components: {0,1,2}
  chars: c,b,a → sorted: a,b,c
  indices: 0,1,2
Result: "abc" ✓
```

## Problem (Bài toán)

Given a string `s` and a list of `pairs` where `pairs[i] = [a, b]` means you can swap `s[a]` and `s[b]` any number of times. Return the **lexicographically smallest** string achievable by any number of swaps.

**Example 1:** `s="dcab", pairs=[[0,3],[1,2]]` → `"bacd"`
**Example 2:** `s="dcab", pairs=[[0,3],[1,2],[0,2]]` → `"abcd"`
**Example 3:** `s="cba", pairs=[[0,1],[1,2]]` → `"abc"`

**Constraints:** `1 ≤ s.length ≤ 10⁵`, `0 ≤ pairs.length ≤ 10⁵`, `pairs[i].length == 2`, valid indices

## Tips (Mẹo phỏng vấn)

- **Union Find key insight** / Insight Union Find: Các swap có thể dây chuyền — nếu (0,1) và (1,2) thì (0,2) cũng hoán đổi được
- **Sort within component** / Sắp xếp trong thành phần: Trong mỗi connected component, có thể sắp xếp tự do → đặt char nhỏ nhất vào index nhỏ nhất
- **Group by root** / Nhóm theo root: Dùng Map<root, {indices[], chars[]}> để gom các index cùng component
- **Sort both arrays** / Sắp xếp cả hai mảng: Sort indices tăng dần + sort chars theo alphabet → gán 1-1
- **DFS/BFS alternative** / Dùng DFS/BFS thay thế: Xây adjacency list + BFS tìm components — cùng kết quả
- **Path compression** / Nén đường đi: Dùng path compression trong Union Find để đảm bảo O(α(n)) per operation

## Solution 1 - Union Find

```typescript
/**
 * @complexity Time: O((n+p)*α(n) + n log n) | Space: O(n)
 * Union Find to identify components; sort chars within each component
 */
function smallestStringWithSwaps(s: string, pairs: number[][]): string {
  const n = s.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Int32Array(n);

  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }
  function union(a: number, b: number): void {
    const ra = find(a),
      rb = find(b);
    if (ra === rb) return;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else {
      parent[rb] = ra;
      rank[ra]++;
    }
  }

  for (const [a, b] of pairs) union(a, b);

  const groups = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(i);
  }

  const result = s.split("");
  for (const indices of groups.values()) {
    const chars = indices.map((i) => s[i]).sort();
    indices.sort((a, b) => a - b);
    for (let k = 0; k < indices.length; k++) result[indices[k]] = chars[k];
  }

  return result.join("");
}
```

## Solution 2 - DFS with Adjacency List

```typescript
/**
 * @complexity Time: O((n+p) + n log n) | Space: O(n+p)
 * Build adjacency list; DFS to collect each component, then sort and assign
 */
function smallestStringWithSwapsDFS(s: string, pairs: number[][]): string {
  const n = s.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of pairs) {
    adj[a].push(b);
    adj[b].push(a);
  }

  const visited = new Uint8Array(n);
  const result = s.split("");

  function dfs(node: number, indices: number[]): void {
    visited[node] = 1;
    indices.push(node);
    for (const nb of adj[node]) if (!visited[nb]) dfs(nb, indices);
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      const indices: number[] = [];
      dfs(i, indices);
      const chars = indices.map((idx) => s[idx]).sort();
      indices.sort((a, b) => a - b);
      for (let k = 0; k < indices.length; k++) result[indices[k]] = chars[k];
    }
  }

  return result.join("");
}
```

## Test Cases

```typescript
console.log(
  smallestStringWithSwaps("dcab", [
    [0, 3],
    [1, 2],
  ]),
); // → "bacd"
console.log(
  smallestStringWithSwaps("cba", [
    [0, 1],
    [1, 2],
  ]),
); // → "abc"
console.log(smallestStringWithSwaps("a", [])); // → "a"
```

## Related Problems

| Problem                                      | Difficulty | Link                                                                                  |
| -------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| Lexicographically Smallest Equivalent String | Medium     | [LC 1061](https://leetcode.com/problems/lexicographically-smallest-equivalent-string) |
| Rank Transform of a Matrix                   | Hard       | [LC 1632](https://leetcode.com/problems/rank-transform-of-a-matrix)                   |
| Accounts Merge                               | Medium     | [LC 721](https://leetcode.com/problems/accounts-merge)                                |
