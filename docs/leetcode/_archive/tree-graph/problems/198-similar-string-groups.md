---
layout: page
title: "Similar String Groups"
difficulty: Hard
category: Tree-Graph
tags: [Array, Hash Table, String, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/similar-string-groups"
---

# similar string groups

---

## 🧠 Intuition / Tư Duy

**Analogy:** > **Vietnamese analogy:** Các từ như những người bạn — hai người "quen" nhau nếu chỉ khác nhau đúng 2 chữ cái (hoán đổi). Bài toán hỏi có bao nhiêu nhóm bạn bè (components)?

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
strs = ["tars","rats","arts","star"]

tars ↔ rats (swap t↔r at pos 0,2)
tars ↔ arts (swap t↔a at pos 0,1)
rats ↔ arts (swap r↔a)
star: similar to tars? t-a-r-s vs s-t-a-r → 4 diffs → NO

Groups: {tars, rats, arts}, {star} → 2 groups
```

---

---

## Problem Description

Two strings are **similar** if we can swap exactly two letters (in different positions) of one string to equal the other, or if they're identical. Given a list of strings `strs` (all anagrams of each other), return the number of groups of similar strings.

**Example:**

- Input: `strs = ["tars","rats","arts","star"]`
- Output: `2`

**Constraints:**

- `1 <= strs.length <= 300`
- `1 <= strs[i].length <= 300`
- All strings are anagrams of each other

---

---

## 📝 Interview Tips

- 🔑 Two strings are similar if they differ in exactly 0 or 2 positions
- 🔑 Use **Union-Find** for O(n²·L) — connect similar pairs then count components
- 🔑 Since all strings are anagrams, differing in exactly 2 positions guarantees it's a valid swap
- ⚠️ Difference count > 2 → not similar; count == 1 → impossible for anagrams
- ⚠️ Duplicate strings ARE similar to themselves (0 diffs)
- 💡 DFS/BFS also works: build adjacency list then count connected components

---

---

## Solutions

```typescript
function numSimilarGroups(strs: string[]): number {
  const n = strs.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x: number, y: number): void {
    const px = find(x),
      py = find(y);
    if (px === py) return;
    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else {
      parent[py] = px;
      rank[px]++;
    }
  }

  function isSimilar(a: string, b: string): boolean {
    let diffs = 0;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) diffs++;
      if (diffs > 2) return false;
    }
    return diffs === 0 || diffs === 2;
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isSimilar(strs[i], strs[j])) {
        union(i, j);
      }
    }
  }

  const roots = new Set<number>();
  for (let i = 0; i < n; i++) roots.add(find(i));
  return roots.size;
}

function numSimilarGroupsDFS(strs: string[]): number {
  const n = strs.length;
  const visited = new Array(n).fill(false);
  let groups = 0;

  function isSimilar(a: string, b: string): boolean {
    let diffs = 0;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i] && ++diffs > 2) return false;
    }
    return diffs === 0 || diffs === 2;
  }

  function dfs(i: number): void {
    visited[i] = true;
    for (let j = 0; j < n; j++) {
      if (!visited[j] && isSimilar(strs[i], strs[j])) {
        dfs(j);
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs(i);
      groups++;
    }
  }

  return groups;
}
```

---

## 🔗 Related Problems

| #   | Problem                 | Difficulty | Tags            |
| --- | ----------------------- | ---------- | --------------- |
| 684 | Redundant Connection    | 🟡 Medium  | Union Find      |
| 721 | Accounts Merge          | 🟡 Medium  | Union Find, DFS |
| 547 | Number of Provinces     | 🟡 Medium  | DFS, Union Find |
| 924 | Minimize Malware Spread | 🔴 Hard    | Union Find      |
