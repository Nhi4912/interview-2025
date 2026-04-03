---
layout: page
title: "Parallel Courses"
difficulty: Medium
category: Tree-Graph
tags: [Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/parallel-courses"
---

# Parallel Courses / Các Khóa Học Song Song

> **Track**: Tree-Graph | **Difficulty**: 🟡 Medium | **Pattern**: Topological Sort (Kahn's BFS) — Longest Path in DAG
> **Frequency**: 📘 Tier 3 — Gặp ở Facebook, Google (variant of Course Schedule)
> **See also**: [207 Course Schedule](https://leetcode.com/problems/course-schedule) | [1136 Parallel Courses II](https://leetcode.com/problems/parallel-courses-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đang lên kế hoạch học đại học với nhiều môn có prerequisites. Mỗi học kỳ, bạn có thể học tất cả các môn mà đã hoàn thành prerequisites rồi — học song song không giới hạn số môn. Bài toán: cần tối thiểu bao nhiêu học kỳ? Đây chính là tìm đường đi dài nhất trong DAG (directed acyclic graph). Kahn's algorithm làm topological sort theo từng "lớp" (level by level BFS) — mỗi lớp là một học kỳ, và số lớp = số học kỳ cần thiết. Nếu có cycle → không thể tốt nghiệp → trả về -1.

**Pattern Recognition:**

- Signal: "DAG with dependencies, minimum time to complete all tasks in parallel" → **Topological BFS — level counting**
- Bài này thuộc dạng BFS topological sort đếm số level = longest path in DAG
- Key insight: BFS level by level; mỗi level là một batch courses học cùng lúc; số level = số semester; nếu processed < n → có cycle → return -1

**Visual — Kahn's BFS level-by-level:**

```
n=4, relations=[[1,2],[2,3],[3,4]]
(1 is prerequisite for 2, etc.)

Build graph:
  1→2→3→4
  in-degree: {1:0, 2:1, 3:1, 4:1}

Semester 1: queue=[1] (in-degree=0)
  process 1 → decrement in-degree of 2 → in-degree[2]=0
  processed=1, semesters=1
Semester 2: queue=[2]
  process 2 → decrement 3 → in-degree[3]=0
  processed=2, semesters=2
Semester 3: queue=[3] → processed=3, semesters=3
Semester 4: queue=[4] → processed=4, semesters=4

Result: 4 semesters

Another: n=3, relations=[[1,3],[2,3]]
  in-degree: {1:0, 2:0, 3:2}
  Sem 1: queue=[1,2] → process both → in-degree[3]=0, processed=2
  Sem 2: queue=[3] → processed=3
  Result: 2 semesters ✅
```

---

## Problem Description

You have `n` courses labeled 1 to n, and `relations[i] = [prevCourse, nextCourse]` meaning you must take prevCourse before nextCourse. Each semester you can take any number of courses with no remaining prerequisites simultaneously. Return the minimum number of semesters, or -1 if impossible (cycle). ([LeetCode](https://leetcode.com/problems/parallel-courses))

```
Example 1: n=3, relations=[[1,3],[2,3]] → 2  (take 1&2 in sem1, then 3 in sem2)
Example 2: n=3, relations=[[1,2],[2,3],[3,1]] → -1  (cycle)
```

Constraints: 1 ≤ n ≤ 10⁴; 0 ≤ relations.length ≤ min(n\*(n-1)/2, 5×10⁴); no duplicate pairs.

---

## 📝 Interview Tips

1. **Model as DAG: edge A→B means A is prerequisite of B** — _Mô hình DAG: cạnh A→B nghĩa là A phải học trước B_
2. **Kahn's BFS: start with all in-degree=0 nodes, process level by level** — _Kahn BFS: bắt đầu với tất cả nút có in-degree=0, xử lý từng level_
3. **Each BFS level = one semester (all can be taken simultaneously)** — _Mỗi level BFS = 1 học kỳ — học song song tất cả_
4. **Count processed nodes: if < n at end → cycle → return -1** — _Đếm số node đã xử lý: nếu < n → có cycle → trả -1_
5. **Answer = number of BFS levels (not total nodes processed)** — _Đáp án = số level BFS, không phải tổng số node_
6. **This finds the longest path in DAG = critical path** — _Bài này thực chất tìm đường dài nhất trong DAG = critical path analysis_

---

## Solutions

```typescript
/** Solution 1: Kahn's BFS topological sort with level counting
 * @complexity Time: O(V+E) | Space: O(V+E) */
function minimumSemesters(n: number, relations: number[][]): number {
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  const inDegree = new Array(n + 1).fill(0);

  for (const [pre, nxt] of relations) {
    adj[pre].push(nxt);
    inDegree[nxt]++;
  }

  // Start with courses that have no prerequisites
  let queue: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let semesters = 0,
    processed = 0;

  while (queue.length) {
    const nextQueue: number[] = [];
    semesters++;
    for (const course of queue) {
      processed++;
      for (const next of adj[course]) {
        if (--inDegree[next] === 0) nextQueue.push(next);
      }
    }
    queue = nextQueue;
  }

  return processed === n ? semesters : -1;
}

/** Solution 2: DFS longest path in DAG (memoization)
 * @complexity Time: O(V+E) | Space: O(V) */
function minimumSemesters2(n: number, relations: number[][]): number {
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [pre, nxt] of relations) adj[pre].push(nxt);

  // 0=unvisited, 1=visiting, 2=done
  const state = new Array(n + 1).fill(0);
  const memo = new Array(n + 1).fill(0);
  let hasCycle = false;

  function dfs(node: number): number {
    if (state[node] === 2) return memo[node];
    if (state[node] === 1) {
      hasCycle = true;
      return 0;
    }
    state[node] = 1;
    let maxLen = 1;
    for (const next of adj[node]) {
      maxLen = Math.max(maxLen, 1 + dfs(next));
    }
    state[node] = 2;
    memo[node] = maxLen;
    return maxLen;
  }

  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dfs(i));
  return hasCycle ? -1 : ans;
}

// === Test Cases ===
console.log(
  minimumSemesters(3, [
    [1, 3],
    [2, 3],
  ]),
); // 2
console.log(
  minimumSemesters(3, [
    [1, 2],
    [2, 3],
    [3, 1],
  ]),
); // -1 (cycle)
console.log(
  minimumSemesters(4, [
    [1, 2],
    [2, 3],
    [3, 4],
  ]),
); // 4
console.log(
  minimumSemesters2(3, [
    [1, 3],
    [2, 3],
  ]),
); // 2
console.log(minimumSemesters(1, [])); // 1
```

---

## 🔗 Related Problems

| #    | Problem              | Difficulty | Pattern                         |
| ---- | -------------------- | ---------- | ------------------------------- |
| 207  | Course Schedule      | Medium     | Topological Sort — cycle detect |
| 210  | Course Schedule II   | Medium     | Topological Sort — order        |
| 1136 | Parallel Courses II  | Hard       | Bitmask DP                      |
| 2050 | Parallel Courses III | Hard       | Topological Sort + DP           |
