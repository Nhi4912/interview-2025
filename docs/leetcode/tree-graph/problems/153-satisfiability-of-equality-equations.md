---
layout: page
title: "Satisfiability of Equality Equations"
difficulty: Medium
category: Tree-Graph
tags: [Array, String, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/satisfiability-of-equality-equations"
---

# Satisfiability of Equality Equations / Thỏa Mãn Phương Trình Đẳng Thức

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find (Two-Pass)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Evaluate Division](https://leetcode.com/problems/evaluate-division) | [Accounts Merge](https://leetcode.com/problems/accounts-merge)

---

## 🧠 Intuition / Tư Duy

**Analogy (VI):** Như nhóm bạn bè — "a==b" nghĩa là a và b cùng nhóm. "a!=b" nghĩa là a và b phải khác nhóm. **Pass 1**: Union tất cả "==" pairs. **Pass 2**: Kiểm tra "!=" pairs — nếu cùng set → false.

**Analogy (EN):** Two-pass Union Find: first union all `==` equations (group equals together), then verify all `!=` equations (if find(a) == find(b) → contradiction → false).

```
equations: ["a==b","b!=c","b==c"]

Pass 1 (==): union(a,b), union(b,c)  → {a,b,c} same group
Pass 2 (!=): b!=c but find(b)==find(c) → CONFLICT → return false

equations: ["a==b","b!=c","c==d"]
Pass 1: union(a,b), union(c,d)  → {a,b}, {c,d}
Pass 2: b!=c → find(b)≠find(c) → OK → return true
```

---

## 📝 Interview Tips

1. **Two-pass key / Hai lượt**: MUST process all "==" before checking "!=" / Process all equalities first, then check inequalities
2. **Index mapping / Ánh xạ index**: 'a'→0, 'b'→1, … 'z'→25 — chỉ có 26 ký tự / Only lowercase letters: map char to index 0-25
3. **Union Find / Cấu trúc dữ liệu**: Union-Find với path compression — O(α(26)) ≈ O(1) / With path compression, nearly O(1) per operation
4. **Self-contradiction / Mâu thuẫn**: "a!=a" → find(a)==find(a) → return false / A variable can't be unequal to itself
5. **Follow-up / Mở rộng**: Nếu có >, <, >= ? → khác bài toán, cần approach khác / Inequality handling needs different technique
6. **Edge case / Biên**: Single equation "a==a" → true; "a!=a" → false

---

## Solutions

```typescript
/**
 * Solution 1: Union Find (Two-Pass)
 * Time: O(N · α(26)) ≈ O(N) — N equations, near-constant UF ops
 * Space: O(1) — fixed 26-element arrays (only lowercase letters)
 *
 * Pass 1: union "==" pairs. Pass 2: verify "!=" pairs not in same set.
 */
function equationsPossible(equations: string[]): boolean {
  const parent = Array.from({ length: 26 }, (_, i) => i);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]); // path compression
    return parent[x];
  }
  function union(a: number, b: number): void {
    parent[find(a)] = find(b);
  }

  const base = "a".charCodeAt(0);

  // Pass 1: union all "==" equations
  for (const eq of equations) {
    if (eq[1] === "=") {
      // "a==b" → eq[1]=eq[2]='='
      union(eq.charCodeAt(0) - base, eq.charCodeAt(3) - base);
    }
  }

  // Pass 2: check all "!=" equations
  for (const eq of equations) {
    if (eq[1] === "!") {
      // "a!=b"
      if (find(eq.charCodeAt(0) - base) === find(eq.charCodeAt(3) - base)) {
        return false; // same set but supposed to be unequal
      }
    }
  }
  return true;
}

/**
 * Solution 2: Graph BFS/DFS
 * Time: O(N + 26²) — build graph, then BFS for each pair
 * Space: O(26²) — adjacency list for 26 nodes
 *
 * Build undirected graph from "==" edges. Use BFS to find connected components.
 * Then check "!=" pairs: if connected → false.
 */
function equationsPossibleBFS(equations: string[]): boolean {
  const base = "a".charCodeAt(0);
  const adj: number[][] = Array.from({ length: 26 }, () => []);

  for (const eq of equations) {
    if (eq[1] === "=") {
      const u = eq.charCodeAt(0) - base,
        v = eq.charCodeAt(3) - base;
      adj[u].push(v);
      adj[v].push(u);
    }
  }

  // BFS to assign component IDs
  const comp = new Array(26).fill(-1);
  let id = 0;
  for (let i = 0; i < 26; i++) {
    if (comp[i] !== -1) continue;
    const queue = [i];
    comp[i] = id;
    while (queue.length > 0) {
      const node = queue.shift()!;
      for (const nb of adj[node]) {
        if (comp[nb] === -1) {
          comp[nb] = id;
          queue.push(nb);
        }
      }
    }
    id++;
  }

  // Check "!=" pairs
  for (const eq of equations) {
    if (eq[1] === "!") {
      if (comp[eq.charCodeAt(0) - base] === comp[eq.charCodeAt(3) - base]) return false;
    }
  }
  return true;
}

// === Test Cases ===
console.log(equationsPossible(["a==b", "b!=c", "b==c"])); // false
console.log(equationsPossible(["b==a", "a==b"])); // true
console.log(equationsPossible(["a==b", "b!=c", "c==d"])); // true
console.log(equationsPossible(["a!=a"])); // false
console.log(equationsPossibleBFS(["a==b", "b!=c", "b==c"])); // false
console.log(equationsPossibleBFS(["a!=b", "b!=c", "a==c"])); // false? no → true (a!=b, b!=c, a==c is consistent)
```

---

## 🔗 Related Problems

| Problem                                                                    | Pattern        | Difficulty |
| -------------------------------------------------------------------------- | -------------- | ---------- |
| [Accounts Merge](https://leetcode.com/problems/accounts-merge)             | Union Find     | 🟡 Medium  |
| [Evaluate Division](https://leetcode.com/problems/evaluate-division)       | Weighted Graph | 🟡 Medium  |
| [Redundant Connection](https://leetcode.com/problems/redundant-connection) | Union Find     | 🟡 Medium  |
| [Is Graph Bipartite?](https://leetcode.com/problems/is-graph-bipartite)    | Graph Coloring | 🟡 Medium  |
