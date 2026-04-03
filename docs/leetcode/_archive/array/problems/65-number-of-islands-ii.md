---
layout: page
title: "Number of Islands II"
difficulty: Hard
category: Array
tags: [Array, Hash Table, Union Find]
leetcode_url: "https://leetcode.com/problems/number-of-islands-ii"
---

# Number of Islands II / Số Đảo II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Union Find (Dynamic Connectivity)
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống kết nối mạng — ban đầu không có máy tính nào, thêm từng máy một. Mỗi lần thêm máy mới, kiểm tra xem nó có kết nối với máy lân cận không và gộp nhóm lại. Union-Find (DSU) giúp theo dõi số thành phần liên thông hiệu quả.

**Pattern Recognition:**

- Signal: "add cells dynamically, track connected components" → **Union Find** with `parent[]`
- Mỗi lần thêm cell: `islands++`, merge với 4 hướng nếu đã là đảo, `islands--` mỗi lần merge thành công
- Key insight: dùng Hash Map thay vì mảng vì m,n có thể rất lớn

**Visual — Union Find Steps:**

```
m=3, n=3, positions=[[0,0],[0,1],[1,2],[2,1],[1,1]]

Add (0,0): islands=1  components: {(0,0)}        → [1]
Add (0,1): islands=2, merge(0,0)-(0,1) → 1       → [1]
Add (1,2): islands=2                              → [2]
Add (2,1): islands=3                              → [3]
Add (1,1): islands=4, merge with (0,1),(1,2),(2,1)→ 4-3=1 → [1]
```

---

## Problem Description

Given an `m×n` grid (all water), and a list of `positions` where land is added one by one, return an array where `result[i]` = number of islands after the `i`-th addition. ([LeetCode](https://leetcode.com/problems/number-of-islands-ii))

Difficulty: Hard | Acceptance: 40.1%

- Example 1: `m=3, n=3, positions=[[0,0],[0,1],[1,2],[2,1]]` → `[1,1,2,3]`
- Example 2: `m=1, n=1, positions=[[0,0]]` → `[1]`

Constraints: `1 ≤ m, n ≤ 10^4`, `1 ≤ positions.length ≤ 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Vị trí có thể trùng lặp không? Nếu trùng, không đổi số đảo" / Positions may duplicate — adding existing land is a no-op
2. **Data structure**: "m,n lớn → không cần mảng m×n, dùng HashMap cho parent và rank" / Use HashMap since grid can be up to 10^4×10^4
3. **Algorithm**: "Mỗi lần thêm: islands++, union 4 hướng, islands-- mỗi lần union thành công" / Per addition: increment then decrement on each successful merge
4. **Path compression**: "find() với path compression → gần O(1) amortized" / Path compression + union by rank = near O(1) per operation
5. **Key**: "Encode (r,c) → r\*n+c để làm key" / Encode grid position as single integer
6. **Follow-up**: "Nếu xóa đảo thay vì thêm? → bài toán khó hơn, xử lý offline ngược" / Deletion is harder — process offline in reverse

---

## Solutions

```typescript
/**
 * Solution 1: BFS/DFS after each addition (Brute Force)
 * Time: O(k·m·n) — k additions, each BFS is O(m·n)
 * Space: O(m·n) — visited grid
 */
function numIslands2Brute(m: number, n: number, positions: number[][]): number[] {
  const grid = new Set<number>();
  const result: number[] = [];
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (const [r, c] of positions) {
    grid.add(r * n + c);
    // BFS to count islands
    let islands = 0;
    const visited = new Set<number>();
    for (const key of grid) {
      if (visited.has(key)) continue;
      islands++;
      const queue = [key];
      visited.add(key);
      while (queue.length) {
        const cur = queue.shift()!;
        const cr = Math.floor(cur / n),
          cc = cur % n;
        for (const [dr, dc] of dirs) {
          const nk = (cr + dr) * n + (cc + dc);
          if (grid.has(nk) && !visited.has(nk)) {
            visited.add(nk);
            queue.push(nk);
          }
        }
      }
    }
    result.push(islands);
  }
  return result;
}

/**
 * Solution 2: Union-Find with Path Compression + Union by Rank
 * Time: O(k·α(k)) — k additions, α is inverse Ackermann (near O(1))
 * Space: O(k) — HashMap for parent and rank of at most k land cells
 */
function numIslands2(m: number, n: number, positions: number[][]): number[] {
  const parent = new Map<number, number>();
  const rank = new Map<number, number>();
  let islands = 0;
  const result: number[] = [];
  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  function find(x: number): number {
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
    return parent.get(x)!;
  }

  function union(x: number, y: number): boolean {
    const px = find(x),
      py = find(y);
    if (px === py) return false;
    if ((rank.get(px) ?? 0) < (rank.get(py) ?? 0)) parent.set(px, py);
    else if ((rank.get(px) ?? 0) > (rank.get(py) ?? 0)) parent.set(py, px);
    else {
      parent.set(py, px);
      rank.set(px, (rank.get(px) ?? 0) + 1);
    }
    return true;
  }

  for (const [r, c] of positions) {
    const key = r * n + c;
    if (!parent.has(key)) {
      parent.set(key, key);
      rank.set(key, 0);
      islands++;

      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        const nkey = nr * n + nc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && parent.has(nkey)) {
          if (union(key, nkey)) islands--;
        }
      }
    }
    result.push(islands);
  }

  return result;
}

// === Test Cases ===
console.log(
  numIslands2(3, 3, [
    [0, 0],
    [0, 1],
    [1, 2],
    [2, 1],
  ]),
); // [1,1,2,3]
console.log(numIslands2(1, 1, [[0, 0]])); // [1]
console.log(
  numIslands2(3, 3, [
    [0, 0],
    [0, 1],
    [1, 2],
    [2, 1],
    [1, 1],
  ]),
); // [1,1,2,3,1]
console.log(
  numIslands2(2, 2, [
    [0, 0],
    [1, 1],
    [0, 1],
  ]),
); // [1,2,2]
```

---

## 🔗 Related Problems

- [Number of Islands](https://leetcode.com/problems/number-of-islands) — static BFS/DFS version
- [Accounts Merge](https://leetcode.com/problems/accounts-merge) — Union-Find for grouping elements
- [Surrounded Regions](https://leetcode.com/problems/surrounded-regions) — region connectivity with Union-Find or DFS
- [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence) — Union-Find for sequence merging
- [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) — Union-Find component analysis
