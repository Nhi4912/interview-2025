---
layout: page
title: "Parallel Courses III"
difficulty: Hard
category: Tree-Graph
tags: [Array, Dynamic Programming, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/parallel-courses-iii"
---

# Parallel Courses III / Môn Học Song Song III

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Topological Sort + DP (Longest Path in DAG)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như dây chuyền sản xuất nhà máy — mỗi công đoạn có thời gian riêng và phải chờ các công đoạn trước hoàn thành. Bạn muốn biết thời điểm sớm nhất toàn bộ dây chuyền kết thúc. Đây là bài toán **tìm đường dài nhất trong DAG** (weighted longest path), dùng Kahn's algorithm với DP.

**Pattern Recognition:**

- Signal: "prerequisite courses" + "minimum time to finish all" → **Topological Sort + DP**
- `dp[v]` = earliest time to START course v = max(dp[u] + time[u]) for all u → v
- Key insight: Process nodes in topological order; answer = max(dp[v] + time[v]) over all v

**Visual — Kahn's Algorithm + DP:**

```
n=3, relations=[[1,3],[2,3]], time=[3,2,5]
Courses: 1(t=3), 2(t=2), 3(t=5)  Edges: 1→3, 2→3

In-degrees: 1:0, 2:0, 3:2
Queue (in-degree=0): [1, 2]

Step 1: Process 1 (dp[1]=0, finishes at 0+3=3)
        Process 2 (dp[2]=0, finishes at 0+2=2)
        For 3: dp[3] = max(dp[3], finish[1]) = max(0,3) = 3
               dp[3] = max(dp[3], finish[2]) = max(3,2) = 3
        in-degree[3] = 0 → add to queue

Step 2: Process 3 (dp[3]=3, finishes at 3+5=8)

Answer = max finish time = max(3,2,8) = 8 ✓
```

---

## Problem Description

You have `n` courses labeled `1` to `n`. Some courses have prerequisites given as `relations[i] = [prev, next]`. Each course `i` takes `time[i]` months. All prerequisite courses must finish before you can start the next. Find the **minimum number of months** to complete all courses (you can take multiple courses simultaneously).

**Example 1:**

- Input: `n=3, relations=[[1,3],[2,3]], time=[3,2,5]` → Output: `8`

**Example 2:**

- Input: `n=5, relations=[[1,5],[2,5],[3,5],[3,4],[4,5]], time=[1,2,3,4,5]` → Output: `12`

**Constraints:**

- `1 <= n <= 5 × 10^4`, `0 <= relations.length <= min(n*(n-1)/2, 5×10^4)`
- `1 <= time[i] <= 10^4`

---

## 📝 Interview Tips

1. **Clarify**: "Thời gian tính bằng tháng; các môn không có prerequisites có thể bắt đầu ngay" / Courses with no prerequisites start at time 0
2. **Model**: "Bài toán = longest path in weighted DAG — dp[v] = max start time of v" / This is a longest-path DAG problem
3. **Kahn's**: "In-degree array + queue; khi process node u, cập nhật dp[v] cho mọi neighbor v" / Use Kahn's; update dp when processing each node
4. **DFS alternative**: "DFS với memoization trên DAG cũng hoạt động" / DFS with memo also works for DAG
5. **Edge cases**: "n=1 (no prerequisites), all independent courses, linear chain" / Single course, all parallel, or sequential chain
6. **Complexity**: "O(V+E) — Kahn's algorithm processes each node and edge once" / O(V+E) for topological sort + DP

---

## Solutions

```typescript
/**
 * Solution 1: DFS with Memoization (longest path in DAG)
 * Time: O(V + E) — each node computed once
 * Space: O(V + E) for adjacency list and memo
 */
function minimumTimeDFS(n: number, relations: number[][], time: number[]): number {
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  for (const [prev, next] of relations) adj[prev].push(next);

  const memo = new Array(n + 1).fill(-1);

  // Returns: earliest FINISH time of course u
  function dfs(u: number): number {
    if (memo[u] !== -1) return memo[u];
    let maxPrereqFinish = 0;
    for (const v of adj[u]) {
      maxPrereqFinish = Math.max(maxPrereqFinish, dfs(v));
    }
    memo[u] = maxPrereqFinish + time[u - 1];
    return memo[u];
  }

  let ans = 0;
  for (let i = 1; i <= n; i++) ans = Math.max(ans, dfs(i));
  return ans;
}

/**
 * Solution 2: Kahn's Algorithm + DP (BFS Topological Sort)
 * Time: O(V + E) — each node and edge processed once
 * Space: O(V + E) for adjacency list, in-degree, and dp arrays
 *
 * dp[v] = earliest time course v can FINISH
 * When all prerequisites of v are done: dp[v] = max(dp[prereq]) + time[v]
 */
function minimumTime(n: number, relations: number[][], time: number[]): number {
  const adj: number[][] = Array.from({ length: n + 1 }, () => []);
  const inDeg = new Array(n + 1).fill(0);

  for (const [prev, next] of relations) {
    adj[prev].push(next);
    inDeg[next]++;
  }

  // dp[i] = earliest finish time of course i
  const dp = [...time, 0].slice(0, n + 1); // dp[1..n] = time[0..n-1]
  for (let i = 1; i <= n; i++) dp[i] = time[i - 1];

  const queue: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (inDeg[i] === 0) queue.push(i);
  }

  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of adj[u]) {
      // Course v can start at earliest when u finishes
      dp[v] = Math.max(dp[v], dp[u] + time[v - 1]);
      if (--inDeg[v] === 0) queue.push(v);
    }
  }

  return Math.max(...dp.slice(1));
}

// === Test Cases ===
console.log(
  minimumTime(
    3,
    [
      [1, 3],
      [2, 3],
    ],
    [3, 2, 5],
  ),
); // 8
console.log(
  minimumTime(
    5,
    [
      [1, 5],
      [2, 5],
      [3, 5],
      [3, 4],
      [4, 5],
    ],
    [1, 2, 3, 4, 5],
  ),
); // 12
console.log(minimumTime(1, [], [5])); // 5  (single course)
console.log(minimumTime(3, [], [1, 2, 3])); // 3  (all independent)
console.log(
  minimumTimeDFS(
    3,
    [
      [1, 3],
      [2, 3],
    ],
    [3, 2, 5],
  ),
); // 8
```

---

## 🔗 Related Problems

| Problem                                                                                                                      | Pattern          | Difficulty |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| [Course Schedule II](https://leetcode.com/problems/course-schedule-ii)                                                       | Topological Sort | Medium     |
| [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix)                     | DFS + Memo (DAG) | Hard       |
| [Find All Possible Recipes from Given Supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies) | Topological Sort | Medium     |
| [Minimum Time to Complete All Tasks](https://leetcode.com/problems/minimum-time-to-complete-all-tasks)                       | Greedy           | Hard       |
| [Collect Coins in a Tree](https://leetcode.com/problems/collect-coins-in-a-tree)                                             | Topological Sort | Hard       |
