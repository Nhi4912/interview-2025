---
layout: page
title: "Frequencies of Shortest Supersequences"
difficulty: Hard
category: Tree-Graph
tags: [Array, String, Bit Manipulation, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/frequencies-of-shortest-supersequences"
---

# frequencies of shortest supersequences

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như **xếp lịch dạy học** — mỗi từ 2 chữ "ab" nghĩa là chữ `a` phải xuất hiện trước `b`. Bạn cần tìm chuỗi ngắn nhất chứa tất cả từ như subsequence. Nếu có cycle (a→b→a), phải dùng ký tự 2 lần. Thử tất cả cách "nhân đôi" ký tự, kiểm tra topo sort hợp lệ.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
words = ["ab","ba"]  →  Graph: a→b, b→a (CYCLE!)
                         Must duplicate one char.

Try double = {a}: a₁→b→a₂  →  topo OK  →  freq: a=2, b=1  →  len=3
Try double = {b}: a→b₁→a?  →  NO: still cycle a→b₂ unsatisfied
Try double = {a,b}: a₁→b₁, b₂→a₂  →  topo OK  →  freq: a=2, b=2  →  len=4

Shortest len = 3  →  Answer: [[2,1,0,...,0]]

words = ["aa","cd"]  →  Graph: a→a (self-loop), c→d
  Self-loop → a must appear ≥2 times
  Chars: {a,c,d}  →  double={a}: freq a=2,c=1,d=1 → len=4
  Answer: [[2,0,1,1,0,...,0]]
```

---

## Problem Description

| Problem                                                                          | Pattern              | Difficulty |
| -------------------------------------------------------------------------------- | -------------------- | ---------- |
| [Shortest Superstring](https://leetcode.com/problems/shortest-superstring)       | Bitmask DP + TSP     | Hard       |
| [Course Schedule](https://leetcode.com/problems/course-schedule)                 | Topological Sort     | Medium     |
| [Alien Dictionary](https://leetcode.com/problems/alien-dictionary)               | Topo Sort on chars   | Hard       |
| [Sequence Reconstruction](https://leetcode.com/problems/sequence-reconstruction) | Topo Sort uniqueness | Medium     |

---

## 📝 Interview Tips

1. **Model as graph** — Each word "ab" = edge a→b. Self-loop "aa" = char needs ≥2 copies / Mỗi từ là 1 cạnh trong đồ thị ký tự.
2. **Cycle breaking** — Cycles require duplicating chars. Enumerate which chars to double / Chu trình buộc nhân đôi ký tự, duyệt bitmask.
3. **Bitmask over chars** — At most 26 distinct chars, usually ≤10. Try 2^k subsets / Bitmask trên tập ký tự (thường ≤10 chars).
4. **Topo sort validation** — After splitting doubled chars, check DAG has valid topo order / Sau khi tách, kiểm tra topo sort hợp lệ.
5. **Prune early** — Skip supersets of valid solutions / Cắt nhánh sớm khi tìm được subset nhỏ hơn.
6. **Frequency array** — Result is count per letter, not the string itself / Kết quả là mảng đếm, không phải chuỗi.

---

## Solutions

```typescript
/** @complexity Time: O(2^k · k²) where k = distinct chars | Space: O(k²) */
function supersequences(words: string[]): number[][] {
  const chars = new Set<number>();
  const edges = new Set<string>();
  const selfLoop = new Set<number>();
  for (const w of words) {
    const a = w.charCodeAt(0) - 97,
      b = w.charCodeAt(1) - 97;
    chars.add(a);
    chars.add(b);
    if (a === b) selfLoop.add(a);
    else edges.add(`${a},${b}`);
  }
  const charList = [...chars].sort((a, b) => a - b);
  const k = charList.length;
  const idx = new Map<number, number>();
  charList.forEach((c, i) => idx.set(c, i));
  let minLen = Infinity;
  const results: number[][] = [];
  for (let mask = 0; mask < 1 << k; mask++) {
    // doubled chars must include all self-loops
    let valid = true;
    for (const c of selfLoop) {
      if (!(mask & (1 << idx.get(c)!))) {
        valid = false;
        break;
      }
    }
    if (!valid) continue;
    const totalLen = k + popcount(mask);
    if (totalLen > minLen) continue;
    // Build graph: for doubled char c, split into c_in (idx) and c_out (idx+k)
    // For non-doubled chars, node = idx
    const n = k + popcount(mask);
    const adj: number[][] = Array.from({ length: n }, () => []);
    const indeg = new Array(n).fill(0);
    // Map char to its "out" node
    let extraIdx = k;
    const outNode = new Array(k).fill(0);
    const inNode = new Array(k).fill(0);
    for (let i = 0; i < k; i++) {
      if (mask & (1 << i)) {
        inNode[i] = i;
        outNode[i] = extraIdx;
        adj[i].push(extraIdx);
        indeg[extraIdx]++;
        extraIdx++;
      } else {
        inNode[i] = i;
        outNode[i] = i;
      }
    }
    // Add edges
    let hasCycle = false;
    for (const e of edges) {
      const [a, b] = e.split(",").map(Number);
      const from = outNode[idx.get(a)!],
        to = inNode[idx.get(b)!];
      adj[from].push(to);
      indeg[to]++;
    }
    // Kahn's topo sort
    const q: number[] = [];
    for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
    let visited = 0;
    while (q.length) {
      const u = q.shift()!;
      visited++;
      for (const v of adj[u]) {
        if (--indeg[v] === 0) q.push(v);
      }
    }
    if (visited < n) continue; // cycle remains
    if (totalLen < minLen) {
      minLen = totalLen;
      results.length = 0;
    }
    const freq = new Array(26).fill(0);
    for (let i = 0; i < k; i++) {
      freq[charList[i]] = mask & (1 << i) ? 2 : 1;
    }
    results.push(freq);
  }
  results.sort((a, b) => {
    for (let i = 0; i < 26; i++) {
      if (a[i] !== b[i]) return a[i] - b[i];
    }
    return 0;
  });
  return results;
}
function popcount(n: number): number {
  let c = 0;
  while (n) {
    c += n & 1;
    n >>= 1;
  }
  return c;
}

/** @complexity Time: O(2^k · k · |edges|) | Space: O(k) */
function supersequencesBrute(words: string[]): number[][] {
  const chars = [...new Set(words.join("").split(""))].sort();
  const k = chars.length;
  const ci = new Map<string, number>();
  chars.forEach((c, i) => ci.set(c, i));
  const edgeSet = new Set(words.map((w) => `${ci.get(w[0])},${ci.get(w[1])}`));
  const selfLoops = new Set<number>();
  for (const w of words) if (w[0] === w[1]) selfLoops.add(ci.get(w[0])!);
  let best = Infinity;
  const res: number[][] = [];
  for (let mask = 0; mask < 1 << k; mask++) {
    let ok = true;
    for (const s of selfLoops)
      if (!(mask & (1 << s))) {
        ok = false;
        break;
      }
    if (!ok) continue;
    const len = k + popcount(mask);
    if (len > best) continue;
    // Check topo: build adj on expanded nodes
    const n = len;
    const deg = new Array(n).fill(0);
    const g: number[][] = Array.from({ length: n }, () => []);
    let ex = k;
    const out = new Array(k)
      .fill(0)
      .map((_, i) => (mask & (1 << i) ? (g[i].push(ex), deg[ex]++, ex++) && ex - 1 : i));
    const inn = new Array(k).fill(0).map((_, i) => i);
    for (const e of edgeSet) {
      const [a, b] = e.split(",").map(Number);
      g[out[a]].push(inn[b]);
      deg[inn[b]]++;
    }
    const q: number[] = [];
    for (let i = 0; i < n; i++) if (!deg[i]) q.push(i);
    let v = 0;
    while (q.length) {
      const u = q.shift()!;
      v++;
      for (const w of g[u]) if (!--deg[w]) q.push(w);
    }
    if (v < n) continue;
    if (len < best) {
      best = len;
      res.length = 0;
    }
    const freq = new Array(26).fill(0);
    for (let i = 0; i < k; i++) freq[chars[i].charCodeAt(0) - 97] = mask & (1 << i) ? 2 : 1;
    res.push(freq);
  }
  res.sort((a, b) => {
    for (let i = 0; i < 26; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return 0;
  });
  return res;
}

// === Test Cases ===
const fmt = (r: number[][]) => r.map((a) => a.filter((x) => x > 0).join(",")).join(" | ");
console.log(fmt(supersequences(["ab", "ba"]))); // 2,1 → "aba"
console.log(fmt(supersequences(["aa", "cd"]))); // 2,1,1
console.log(fmt(supersequences(["ab"]))); // 1,1
console.log(fmt(supersequences(["ab", "bc", "ca"]))); // cycle a→b→c→a, need double 1 char
```

---

## 🔗 Related Problems

| Problem                                                                          | Pattern              | Difficulty |
| -------------------------------------------------------------------------------- | -------------------- | ---------- |
| [Shortest Superstring](https://leetcode.com/problems/shortest-superstring)       | Bitmask DP + TSP     | Hard       |
| [Course Schedule](https://leetcode.com/problems/course-schedule)                 | Topological Sort     | Medium     |
| [Alien Dictionary](https://leetcode.com/problems/alien-dictionary)               | Topo Sort on chars   | Hard       |
| [Sequence Reconstruction](https://leetcode.com/problems/sequence-reconstruction) | Topo Sort uniqueness | Medium     |
