---
layout: page
title: "The Earliest Moment When Everyone Become Friends"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Union Find, Sorting]
leetcode_url: "https://leetcode.com/problems/the-earliest-moment-when-everyone-become-friends"
---

# The Earliest Moment When Everyone Become Friends / Thời Điểm Sớm Nhất Tất Cả Trở Thành Bạn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Accounts Merge](https://leetcode.com/problems/accounts-merge) | [Make Lexicographically Smallest Array by Swapping Elements](https://leetcode.com/problems/make-lexicographically-smallest-array-by-swapping-elements)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ đến các nhóm bạn học — ban đầu mỗi người là một nhóm riêng. Mỗi lần hai người kết bạn, nhóm của họ hợp nhất. Union Find theo dõi các nhóm này hiệu quả với path compression. Bài toán hỏi: "Khi nào chỉ còn 1 nhóm?" → Sort events theo timestamp, union từng cặp, dừng khi `components == 1`.

**Pattern Recognition:**

- Signal: "earliest time all connected" + "merge pairs" → **Sort events + Union Find**
- Sort logs theo timestamp trước — không được xử lý theo thứ tự input
- Đếm `components`: bắt đầu = n, mỗi union thành công giảm 1, dừng khi = 1

**Visual — n=4, logs=[[20,0,1],[10,1,2],[30,0,2],[40,1,3]]:**

```
Sort by time: [[10,1,2],[20,0,1],[30,0,2],[40,1,3]]
components = 4

t=10: union(1,2) → components=3   groups: {0} {1,2} {3}
t=20: union(0,1) → components=2   groups: {0,1,2} {3}
t=30: union(0,2) → same group, skip
t=40: union(1,3) → components=1 ✅ → return 40
```

---

## Problem Description

Given `n` people (0 to n-1) and `logs[i] = [timestamp, x, y]` meaning x and y became friends at `timestamp`. Return the **earliest** time when everyone is connected (directly or transitively), or `-1` if impossible.

```
Example 1: n=4, logs=[[20,0,1],[10,1,2],[30,0,2],[40,1,3]] → 40
Example 2: n=6, logs=[[0,2,4],[1,3,5],[2,4,5],[3,0,5],[4,1,2],[5,2,3]] → 5
Example 3: n=4, logs=[[0,0,1],[1,0,2]] → -1  (person 3 never connected)
```

---

## 📝 Interview Tips

1. **Sort trước**: Logs không theo thứ tự — bắt buộc sort theo timestamp
2. **Union Find với rank**: Path compression O(α) per operation, gần O(1)
3. **Đếm components**: Bắt đầu n components, thành công union giảm 1, target = 1
4. **Trả -1 khi nào?** Sau khi xử lý hết logs mà components > 1
5. **Union by rank**: Tránh cây degeneracy — nối rank nhỏ vào rank lớn
6. **Complexity**: O(m log m + m·α(n)) với m = số logs, α(n) ≈ hằng số thực tế

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — BFS after each event
 * Time O(m log m + m * (n + m)), Space O(n + m)
 *
 * For each timestamp, rebuild adjacency and check connectivity with BFS.
 */
function earliestAcqBrute(logs: number[][], n: number): number {
  logs.sort((a, b) => a[0] - b[0]);
  const adj: Set<number>[] = Array.from({ length: n }, () => new Set());

  const allConnected = (): boolean => {
    const visited = new Set<number>([0]);
    const queue = [0];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const nb of adj[cur]) {
        if (!visited.has(nb)) {
          visited.add(nb);
          queue.push(nb);
        }
      }
    }
    return visited.size === n;
  };

  for (const [time, x, y] of logs) {
    adj[x].add(y);
    adj[y].add(x);
    if (allConnected()) return time;
  }
  return -1;
}

/**
 * Solution 2: Union Find with Path Compression + Union by Rank (Optimal)
 * Time O(m log m + m·α(n)), Space O(n)
 *
 * Sort logs by timestamp, union each pair, return timestamp when
 * component count reaches 1.
 */
function earliestAcq(logs: number[][], n: number): number {
  logs.sort((a, b) => a[0] - b[0]);

  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);
  let components = n;

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]); // path compression
    return parent[x];
  }

  function union(x: number, y: number): boolean {
    const px = find(x),
      py = find(y);
    if (px === py) return false; // already same group
    if (rank[px] < rank[py]) parent[px] = py;
    else if (rank[px] > rank[py]) parent[py] = px;
    else {
      parent[py] = px;
      rank[px]++;
    }
    return true;
  }

  for (const [time, x, y] of logs) {
    if (union(x, y)) {
      components--;
      if (components === 1) return time;
    }
  }
  return -1; // not all connected
}

// --- Quick inline tests ---
console.log(
  earliestAcq(
    [
      [20, 0, 1],
      [10, 1, 2],
      [30, 0, 2],
      [40, 1, 3],
    ],
    4,
  ),
); // 40
console.log(
  earliestAcq(
    [
      [0, 2, 4],
      [1, 3, 5],
      [2, 4, 5],
      [3, 0, 5],
      [4, 1, 2],
      [5, 2, 3],
    ],
    6,
  ),
); // 5
console.log(
  earliestAcq(
    [
      [0, 0, 1],
      [1, 0, 2],
    ],
    4,
  ),
); // -1
console.log(
  earliestAcqBrute(
    [
      [20, 0, 1],
      [10, 1, 2],
      [30, 0, 2],
      [40, 1, 3],
    ],
    4,
  ),
); // 40
```

---

## 🔗 Related Problems

| Problem                                                                                                                                   | Relationship                     |
| ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| [1101. The Earliest Moment When Everyone Become Friends](https://leetcode.com/problems/the-earliest-moment-when-everyone-become-friends/) | This problem                     |
| [721. Accounts Merge](https://leetcode.com/problems/accounts-merge/)                                                                      | Union Find for group merging     |
| [684. Redundant Connection](https://leetcode.com/problems/redundant-connection/)                                                          | Union Find cycle detection       |
| [1061. Lexicographically Smallest Equivalent String](https://leetcode.com/problems/lexicographically-smallest-equivalent-string/)         | Union Find on chars              |
| [839. Similar String Groups](https://leetcode.com/problems/similar-string-groups/)                                                        | Count components with Union Find |
