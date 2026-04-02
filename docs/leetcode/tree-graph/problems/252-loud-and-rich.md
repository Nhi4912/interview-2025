---
layout: page
title: "Loud and Rich"
difficulty: Medium
category: Tree & Graph
tags: [Array, Depth-First Search, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/loud-and-rich"
---

# Loud and Rich / Ồn Ào và Giàu Có

> **Track**: Tree & Graph | **Difficulty**: 🟡 Medium | **Pattern**: DFS on DAG / Topological Sort
> **Frequency**: 📘 Tier 3 — Gặp ở Amazon
> **See also**: [All Ancestors of a Node in a DAG](https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph) | [Course Schedule](https://leetcode.com/problems/course-schedule)

---

## Vietnamese Analogy (Ví dụ thực tế)

Tưởng tượng trong giới thượng lưu, người giàu hơn thường ít nói chuyện hơn (less "loud"). Bạn được cho biết ai giàu hơn ai (quan hệ không đối xứng), và điểm "ồn ào" của mỗi người. Câu hỏi là: trong nhóm bao gồm bản thân và tất cả người giàu hơn mình, ai ít ồn ào nhất? Đây là bài toán DFS trên đồ thị có hướng: từ mỗi người, đi theo chiều "giàu hơn", tìm node có `quietness` nhỏ nhất.

## Visual (Minh họa trực quan)

```
richer = [[1,0],[2,1],[3,1],[3,7],[4,3],[5,3],[6,3]]
quiet  = [3,2,5,4,6,1,7,0]  (index = person, value = quietness)

Graph (richer[i] is richer than richer[j]):
1→0, 2→1, 3→1, 3→7, 4→3, 5→3, 6→3

DFS from 3:
  3's richer: 4,5,6
  → DFS(4): quieter candidate quiet[4]=6 vs quiet[3]=4 → keep 3
  → DFS(5): quiet[5]=1 < quiet[3]=4 → answer[3]=5
  → DFS(6): quiet[6]=7 → keep 5
  answer[3] = 5

answer = [5, 5, 2, 5, 4, 5, 6, 7]
```

## Problem (Bài toán)

Given `n` people (0 to n-1), `richer[i] = [a, b]` means person `a` is definitely richer than `b`. `quiet[i]` is the quietness value of person `i` (lower = less noise). For each person `x`, find `answer[x]` = the least quiet person among all people who are at least as rich as `x` (including `x` themselves).

**Example 1:** `richer=[[1,0],[2,1],[3,1],[3,7],[4,3],[5,3],[6,3]], quiet=[3,2,5,4,6,1,7,0]`
→ `[5,5,2,5,4,5,6,7]`

**Example 2:** `richer=[], quiet=[0]` → `[0]` (only one person)

**Constraints:** `1 ≤ n ≤ 500`, `0 ≤ richer.length ≤ n*(n-1)/2`, `0 ≤ quiet[i] < n`, all quietness values are distinct

## Tips (Mẹo phỏng vấn)

- **Build reverse graph** / Xây đồ thị ngược: `richer[a,b]` → edge `a→b` (a giàu hơn b); DFS từ b để tìm những người giàu hơn b
- **Memoize answer** / Ghi nhớ kết quả: `answer[x]` một khi tính xong không đổi — dùng để cắt nhánh DFS
- **Topological order** / Thứ tự topo: Có thể xử lý theo Kahn's algorithm — node không có ai giàu hơn xử lý trước
- **Quiet comparison** / So sánh quietness: `answer[x]` = người có `quiet` nhỏ nhất trong tập {x ∪ richer_than_x}
- **Initialized to self** / Khởi tạo bằng chính mình: `answer[i] = i` — ít nhất bản thân là ứng viên
- **DFS returns answer** / DFS trả về kết quả: Sau DFS, `answer[x]` đã được tối ưu — con trỏ không cần update lại

## Solution 1 - DFS with Memoization

```typescript
/**
 * @complexity Time: O(n + e) | Space: O(n + e)
 * For each person, DFS up the wealth graph; return the quietest reachable person
 */
function loudAndRich(richer: number[][], quiet: number[]): number[] {
  const n = quiet.length;
  // adj[b] = people richer than b (can traverse their wealth)
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of richer) adj[b].push(a);

  const answer = new Array(n).fill(-1);

  function dfs(x: number): number {
    if (answer[x] !== -1) return answer[x];
    answer[x] = x; // start with self
    for (const richer_person of adj[x]) {
      const candidate = dfs(richer_person);
      if (quiet[candidate] < quiet[answer[x]]) answer[x] = candidate;
    }
    return answer[x];
  }

  for (let i = 0; i < n; i++) dfs(i);
  return answer;
}
```

## Solution 2 - Topological Sort (BFS Kahn's)

```typescript
/**
 * @complexity Time: O(n + e) | Space: O(n + e)
 * Process in topological order (richest first); propagate quiet answer downstream
 */
function loudAndRichTopo(richer: number[][], quiet: number[]): number[] {
  const n = quiet.length;
  const adj: number[][] = Array.from({ length: n }, () => []); // a→b: a richer than b
  const indegree = new Int32Array(n);
  for (const [a, b] of richer) {
    adj[a].push(b);
    indegree[b]++;
  }

  const answer = Array.from({ length: n }, (_, i) => i);
  const queue: number[] = [];
  for (let i = 0; i < n; i++) if (indegree[i] === 0) queue.push(i);

  while (queue.length) {
    const u = queue.shift()!;
    for (const v of adj[u]) {
      // u is richer than v; check if answer[u] is quieter
      if (quiet[answer[u]] < quiet[answer[v]]) answer[v] = answer[u];
      if (--indegree[v] === 0) queue.push(v);
    }
  }

  return answer;
}
```

## Test Cases

```typescript
console.log(
  loudAndRich(
    [
      [1, 0],
      [2, 1],
      [3, 1],
      [3, 7],
      [4, 3],
      [5, 3],
      [6, 3],
    ],
    [3, 2, 5, 4, 6, 1, 7, 0],
  ),
); // → [5,5,2,5,4,5,6,7]

console.log(loudAndRich([], [0])); // → [0]

console.log(
  loudAndRichTopo(
    [
      [1, 0],
      [2, 1],
      [3, 1],
      [3, 7],
      [4, 3],
      [5, 3],
      [6, 3],
    ],
    [3, 2, 5, 4, 6, 1, 7, 0],
  ),
); // → [5,5,2,5,4,5,6,7]
```

## Related Problems

| Problem                          | Difficulty | Link                                                                                         |
| -------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| All Ancestors of a Node in a DAG | Medium     | [LC 2192](https://leetcode.com/problems/all-ancestors-of-a-node-in-a-directed-acyclic-graph) |
| Course Schedule II               | Medium     | [LC 210](https://leetcode.com/problems/course-schedule-ii)                                   |
| Find the Celebrity               | Medium     | [LC 277](https://leetcode.com/problems/find-the-celebrity)                                   |
