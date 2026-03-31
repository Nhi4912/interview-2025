---
layout: page
title: "Course Schedule"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/course-schedule"
---

# Course Schedule / Lịch Học Môn

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Cycle Detection / Topological Sort (BFS + DFS)
> **Frequency**: ⭐ Tier 2 — Gặp ở 28+ companies
> **See also**: [Course Schedule II](https://leetcode.com/problems/course-schedule-ii) | [Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees)

---

## 🧠 Intuition / Tư Duy

- **Analogy:** Bạn muốn học n môn, mỗi môn có thể có môn tiên quyết. Bạn có thể hoàn thành tất cả không? Đây chính là câu hỏi "có tồn tại chu trình trong đồ thị phụ thuộc không?". Nếu môn A cần B và B cần A — vòng lặp vĩnh cửu, không học được.

- **Pattern Recognition:**
  - Signal: "prerequisites" + "can complete all" → **Cycle detection in directed graph**
  - BFS (Kahn's): Theo dõi in-degree; xử lý node có in-degree 0 trước; nếu processed = n → no cycle
  - DFS: 3 trạng thái (unvisited=0, visiting=1, done=2); back edge → cycle

- **Visual — numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]:**

```
Graph (a→b means "must take a before b"):
  0 → 1 → 3
  0 → 2 → 3

BFS (Kahn's Algorithm):
  in-degrees: [0, 1, 1, 2]
  queue: [0]  (nodes with in-degree 0)

  Process 0: reduce neighbors 1,2  → in-degrees=[0,0,0,2]  queue=[1,2]
  Process 1: reduce neighbor 3     → in-degrees=[0,0,0,1]  queue=[2]
  Process 2: reduce neighbor 3     → in-degrees=[0,0,0,0]  queue=[3]
  Process 3: no neighbors          → processed=4 = numCourses → true ✓
```

---

## Problem Description

There are `numCourses` labeled `0` to `numCourses-1`. Given `prerequisites[i] = [a, b]` meaning course `b` must be taken before `a`.
Return `true` if you can finish all courses, `false` if there is a cycle making it impossible.

```
Input:  numCourses=2, prerequisites=[[1,0]]        → true   (0→1, no cycle)
Input:  numCourses=2, prerequisites=[[1,0],[0,1]]  → false  (0→1→0, cycle!)
Input:  numCourses=1, prerequisites=[]             → true
```

Constraints: `1 ≤ numCourses ≤ 2000`, `0 ≤ prerequisites.length ≤ 5000`.

---

## 📝 Interview Tips

1. **Cycle detection = topological sort feasibility**: Nếu topo sort xử lý hết n nodes → không có cycle / **Topo feasibility**: if BFS processes all n nodes, no cycle exists
2. **BFS dễ implement hơn trong interview**: in-degree array + queue / **BFS preferred**: in-degree + queue is clean and verifiable
3. **DFS cần 3 màu**: 0=unvisited, 1=visiting(gray), 2=done(black). Back edge (→gray) = cycle / **DFS 3-state**: white/gray/black; gray→gray = back edge = cycle
4. **Build adjacency list trước**: `graph[b].push(a)` cho `[a,b]` (b trước a) / **Build adj list**: from prerequisite pairs to directed edges
5. **No prerequisite case**: numCourses bất kỳ, prerequisites rỗng → always true / **Empty prerequisites**: trivially true

---

## Solutions

```typescript
/**
 * Solution 1: BFS — Kahn's Algorithm (Topological Sort)
 * Time: O(V + E) | Space: O(V + E)
 */
function canFinishBFS(numCourses: number, prerequisites: number[][]): boolean {
  const inDegree = new Array(numCourses).fill(0);
  const graph: number[][] = Array.from({ length: numCourses }, () => []);

  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);
    inDegree[course]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let processed = 0;
  while (queue.length) {
    const node = queue.shift()!;
    processed++;
    for (const neighbor of graph[node]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  return processed === numCourses;
}

/**
 * Solution 2: DFS — Cycle Detection with 3-state coloring
 * Time: O(V + E) | Space: O(V + E)
 */
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) graph[pre].push(course);

  // 0 = unvisited, 1 = visiting (in current path), 2 = done
  const state = new Array(numCourses).fill(0);

  function hasCycle(node: number): boolean {
    if (state[node] === 1) return true; // back edge → cycle
    if (state[node] === 2) return false; // already fully explored
    state[node] = 1; // mark as visiting
    for (const neighbor of graph[node]) {
      if (hasCycle(neighbor)) return true;
    }
    state[node] = 2; // mark as done
    return false;
  }

  for (let i = 0; i < numCourses; i++) {
    if (hasCycle(i)) return false;
  }
  return true;
}

// === Test Cases ===
console.log(canFinish(2, [[1, 0]])); // true
console.log(
  canFinish(2, [
    [1, 0],
    [0, 1],
  ]),
); // false
console.log(canFinish(1, [])); // true
console.log(
  canFinish(4, [
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2],
  ]),
); // true
console.log(
  canFinish(3, [
    [1, 0],
    [2, 1],
    [0, 2],
  ]),
); // false (0→1→2→0)
```

---

## 🔗 Related Problems

| Problem                                                                                                  | Relationship                                           |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [Course Schedule II](https://leetcode.com/problems/course-schedule-ii)                                   | Return actual topological order (not just feasibility) |
| [Alien Dictionary](https://leetcode.com/problems/alien-dictionary)                                       | Build constraint graph from word order, then topo sort |
| [Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees)                               | Peel leaf nodes iteratively (BFS topo-style)           |
| [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix) | DFS with memoization on implicit DAG                   |
