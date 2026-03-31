---
layout: page
title: "Lexicographically Smallest Equivalent String"
difficulty: Medium
category: String
tags: [String, Union Find]
leetcode_url: "https://leetcode.com/problems/lexicographically-smallest-equivalent-string"
---

# Lexicographically Smallest Equivalent String / Chuỗi Tương Đương Nhỏ Nhất Theo Thứ Tự Từ Điển

🟡 Medium | 🏷️ String, Union Find

## 🧠 Intuition

**VI:** `s1[i]` và `s2[i]` là "tương đương nhau". Quan hệ tương đương là bắc cầu — nếu `a~b` và `b~c` thì `a~c`. Dùng **Union-Find** để gom nhóm các ký tự tương đương. Khi tìm representative của một nhóm, luôn chọn ký tự **nhỏ nhất** (thay vì random). Áp dụng cho `baseStr`.

**EN:** Equivalences from `s1[i]↔s2[i]` are transitive. Use Union-Find where each group's representative is the smallest character. Then map each char in `baseStr` to its group's minimum.

```
s1="parker", s2="morris"
p~m, a~o, r~r, k~r, e~i, r~s
Groups after union: {m,p}, {a,o}, {i,e}, {r,k,s}
                    rep=m    rep=a    rep=e    rep=k? No, rep=k

baseStr = "parser"
p→m, a→a, r→k, s→k, e→e, r→k
Result: "makkek"
```

## 📝 Interview Tips

- 🇻🇳 **Union-Find với min:** khi `union(a,b)`, root phải là ký tự nhỏ hơn
- 🇬🇧 **Min-root Union-Find:** during union, always attach larger root to smaller root
- 🇻🇳 **Path compression:** `find` với nén đường dẫn giúp O(α) amortized
- 🇬🇧 **26 nodes only:** char space is fixed at 26 — all operations are O(1) amortized
- 🇻🇳 **Áp dụng cho baseStr:** với mỗi ký tự, tìm `find(c)` để lấy representative
- 🇬🇧 **Result building:** `Array.from(baseStr).map(c => String.fromCharCode(find(code) + 97))`

## Solutions

### Solution 1: Union-Find with min-root

```typescript
/**
 * Union-Find where each group representative is the lex-smallest char.
 * Time: O((n + m) * α(26)) ≈ O(n + m) | Space: O(26) = O(1)
 */
function smallestEquivalentString(s1: string, s2: string, baseStr: string): string {
  const parent = Array.from({ length: 26 }, (_, i) => i);

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a: number, b: number): void {
    const ra = find(a),
      rb = find(b);
    if (ra === rb) return;
    // Attach larger root to smaller root (lex min becomes representative)
    if (ra < rb) parent[rb] = ra;
    else parent[ra] = rb;
  }

  for (let i = 0; i < s1.length; i++) {
    union(s1.charCodeAt(i) - 97, s2.charCodeAt(i) - 97);
  }

  return Array.from(baseStr)
    .map((c) => String.fromCharCode(find(c.charCodeAt(0) - 97) + 97))
    .join("");
}

console.log(smallestEquivalentString("parker", "morris", "parser")); // "makkek"
console.log(smallestEquivalentString("hello", "world", "hold")); // "hdld"
console.log(smallestEquivalentString("leetcode", "programs", "sourcecode")); // "aauaaaaada"
```

### Solution 2: DFS/BFS with adjacency list

```typescript
/**
 * Build adjacency list of equivalences, then BFS to find min in each component.
 * Time: O(n + 26^2) | Space: O(26^2)
 */
function smallestEquivalentString2(s1: string, s2: string, baseStr: string): string {
  const adj: Set<number>[] = Array.from({ length: 26 }, () => new Set<number>());

  for (let i = 0; i < s1.length; i++) {
    const a = s1.charCodeAt(i) - 97,
      b = s2.charCodeAt(i) - 97;
    adj[a].add(b);
    adj[b].add(a);
  }

  const minChar = new Array(26).fill(-1);

  function bfs(start: number): number {
    const visited = new Set<number>();
    const queue = [start];
    let min = start;
    visited.add(start);
    while (queue.length) {
      const cur = queue.shift()!;
      if (cur < min) min = cur;
      for (const nb of adj[cur]) {
        if (!visited.has(nb)) {
          visited.add(nb);
          queue.push(nb);
        }
      }
    }
    // Mark all in component
    const stack = [start];
    const seen = new Set([start]);
    while (stack.length) {
      const c = stack.pop()!;
      minChar[c] = min;
      for (const nb of adj[c])
        if (!seen.has(nb)) {
          seen.add(nb);
          stack.push(nb);
        }
    }
    return min;
  }

  for (let i = 0; i < 26; i++) if (minChar[i] === -1) bfs(i);

  return Array.from(baseStr)
    .map((c) => String.fromCharCode(minChar[c.charCodeAt(0) - 97] + 97))
    .join("");
}

console.log(smallestEquivalentString2("parker", "morris", "parser")); // "makkek"
```

## 🔗 Related Problems

| #   | Problem                              | Difficulty | Key Idea                        |
| --- | ------------------------------------ | ---------- | ------------------------------- |
| 990 | Satisfiability of Equality Equations | 🟡 Medium  | Union-Find on chars             |
| 721 | Accounts Merge                       | 🟡 Medium  | Union-Find with grouping        |
| 547 | Number of Provinces                  | 🟡 Medium  | Union-Find connected components |
