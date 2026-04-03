---
layout: page
title: "Course Schedule II"
difficulty: Medium
category: Tree/Graph
tags: [Depth-First Search, Breadth-First Search, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/course-schedule-ii/"
leetcode_number: 210
pattern: "Topological Sort (DFS Cycle Detection)"
frequency_tier: 2
companies: [Amazon, Google, Facebook, Airbnb]
target_time_minutes: 25
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Course Schedule II / Thứ Tự Hoàn Thành Các Khóa Học

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Topological Sort (Kahn's BFS / DFS)
> **Frequency**: ⭐ Tier 2 — Gặp >40% interviews
> **See also**: [Course Schedule I](https://leetcode.com/problems/course-schedule/) | [Lowest Common Ancestor](./16-lowest-common-ancestor-binary-tree.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như bạn đang lên kế hoạch học lái xe: phải học luật giao thông trước, rồi mới học thực hành, rồi mới thi bằng. Mỗi bước phụ thuộc vào bước trước. Nếu có vòng lặp (A cần B, B lại cần A), thì không thể hoàn thành — đó là cycle trong đồ thị có hướng, và cần Topological Sort để phát hiện và sắp xếp thứ tự.

**Pattern Recognition:**

- Signal: "ordering with dependencies, detect if possible" → **Topological Sort on directed graph**
- Kahn's (BFS): Bắt đầu từ các node không có prerequisite (in-degree = 0), lần lượt xử lý và giảm in-degree của các node kế tiếp
- Cycle detection: `result.length < numCourses` → có cycle → trả về `[]`

**Visual — Kahn's BFS: numCourses=4, prereqs=[[1,0],[2,0],[3,1],[3,2]]:**

```
Graph: 0→1, 0→2, 1→3, 2→3
inDegree: [0, 1, 1, 2]

Init queue: [0]  (only course 0 has inDegree=0)

Step 1: pop 0, result=[0]
  → course 1: inDegree 1→0 → enqueue
  → course 2: inDegree 1→0 → enqueue
  Queue: [1, 2]

Step 2: pop 1, result=[0,1]
  → course 3: inDegree 2→1
  Queue: [2]

Step 3: pop 2, result=[0,1,2]
  → course 3: inDegree 1→0 → enqueue
  Queue: [3]

Step 4: pop 3, result=[0,1,2,3]
result.length=4 === numCourses=4 → return [0,1,2,3] ✅
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Khi thấy | Nghĩ đến |
|---|---|
| **When you see** | Dependency ordering, prerequisites, "can you finish all tasks" |
| **Think** | Topological Sort — DFS with 3-color marking (white/gray/black) or Kahn's BFS with in-degree |
| **Template** | `dfs(node): mark GRAY; visit neighbors; if GRAY neighbor → cycle; mark BLACK; push to result` |
| **Time target** | ≤ 25 min — build graph ~5 min, Kahn's BFS ~10 min, test + explain ~10 min |

**Memory hook:** "Topo sort = DFS ngược — xong rồi mới push vào kết quả"

---

## Problem Description

Given `numCourses` (labeled 0 to numCourses-1) and `prerequisites[i] = [a, b]` meaning "take b before a", return a valid ordering to finish all courses. If impossible (cycle exists), return `[]`.

```
Example 1: numCourses=2, prerequisites=[[1,0]]         → [0,1]
Example 2: numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]] → [0,2,1,3]
Example 3: numCourses=2, prerequisites=[[1,0],[0,1]]   → [] (cycle)
```

Constraints:

- 1 <= numCourses <= 2000
- 0 <= prerequisites.length <= numCourses \* (numCourses - 1)
- All prerequisite pairs are distinct

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

> **U — Understand:** "I need to return a valid ordering of all courses such that every prerequisite is taken first. If a cycle exists — meaning two courses depend on each other — I should return an empty array. Multiple valid orderings are acceptable, right?"

> **M — Match:** "This is Topological Sort on a directed graph. The prerequisite pairs define directed edges. I can either use Kahn's BFS with an in-degree array, or DFS with 3-color cycle detection. Kahn's is easier to trace through in an interview."

> **P — Plan:** "Build adjacency list and in-degree array from prereqs. Initialize queue with all nodes that have in-degree 0. Pop from queue, add to result, decrement in-degree of neighbors — enqueue any neighbor that reaches 0. At the end, if result.length < numCourses, there's a cycle."

> **I — Implement:** "Build graph: `for [a,b] of prereqs: graph[b].push(a); inDegree[a]++`. Queue all zero in-degree nodes. BFS loop: pop course, push to result, reduce neighbors' in-degree, enqueue zeros. Return `result.length === numCourses ? result : []`."

> **R/E — Review & Evaluate:** "Time O(V+E) — each vertex and edge processed once. Space O(V+E) — adjacency list. Edge case: no prerequisites → all in-degrees are 0, entire range is enqueued immediately, any ordering works. Cycle case: result shorter than numCourses because stuck nodes never reach in-degree 0."

---

## 📝 Interview Tips

1. **Clarify**: Multiple valid orderings are fine — return any one / VI: "Nhiều thứ tự hợp lệ tồn tại, trả về bất kỳ cái nào đúng là được"
2. **Brute force**: DFS with 3-color cycle detection (WHITE/GRAY/BLACK) — recursive, push to result on finish / VI: DFS đánh dấu 3 trạng thái, node đang thăm (GRAY) là dấu hiệu cycle; kết quả reverse post-order
3. **Optimize**: Kahn's BFS — iterative, in-degree array, easier to trace in interview / VI: BFS với mảng in-degree trực quan hơn khi explain; queue chứa các node sẵn sàng xử lý
4. **Edge cases**: No prerequisites → return `[0,1,...,n-1]`; single course → `[0]` / VI: Không có dependency → bất kỳ thứ tự nào đều hợp lệ
5. **Follow-up**: Minimum number of semesters if parallelism is allowed? / VI: Số học kỳ tối thiểu nếu có thể học nhiều môn song song trong cùng kỳ

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| Mistake | Why It Fails | Fix |
|---|---|---|
| Not detecting cycles at all | Infinite loop or silently returns incorrect result when a cycle exists | Use 3-color marking (DFS) or check `result.length < numCourses` at end (Kahn's) |
| Forgetting to reverse the DFS result | Post-order DFS builds reversed topological order — returned as-is gives wrong dependency sequence | After all DFS calls complete, call `result.reverse()` before returning |
| Using a single boolean `visited` array | Cannot distinguish "currently being explored" (in-progress) from "fully processed" — misses back edges that indicate cycles | Use 3 states: unvisited (0) / in-progress (1) / done (2) |

---

## Solutions

```typescript

/**

- Solution 1: DFS with 3-Color Cycle Detection (Brute Force)
- Time: O(V + E) — visit each node and edge once
- Space: O(V + E) — adjacency list + recursion stack
  */
  function findOrderDFS(numCourses: number, prerequisites: number[][]): number[] {
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) graph[b].push(a);

const WHITE = 0, GRAY = 1, BLACK = 2;
const color = new Array(numCourses).fill(WHITE);
const result: number[] = [];

function dfs(node: number): boolean {
if (color[node] === GRAY) return false; // back edge → cycle
if (color[node] === BLACK) return true; // already fully processed
color[node] = GRAY;
for (const next of graph[node]) {
if (!dfs(next)) return false;
}
color[node] = BLACK;
result.push(node); // post-order push
return true;
}

for (let i = 0; i < numCourses; i++) {
if (color[i] === WHITE && !dfs(i)) return [];
}
return result.reverse(); // post-order is reverse topological
}

/**

- Solution 2: Kahn's Algorithm — BFS Topological Sort (Optimal)
- Time: O(V + E) — each vertex and edge processed exactly once
- Space: O(V + E) — adjacency list + in-degree array + queue
  */
  function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array(numCourses).fill(0);

for (const [a, b] of prerequisites) {
graph[b].push(a);
inDegree[a]++;
}

const queue: number[] = [];
for (let i = 0; i < numCourses; i++) {
if (inDegree[i] === 0) queue.push(i); // courses with no prerequisites
}

const result: number[] = [];
while (queue.length > 0) {
const course = queue.shift()!;
result.push(course);
for (const next of graph[course]) {
inDegree[next]--;
if (inDegree[next] === 0) queue.push(next); // ready to take now
}
}

return result.length === numCourses ? result : []; // incomplete → cycle
}

// === Test Cases ===
console.log(findOrder(2, [[1, 0]])); // [0,1]
console.log(findOrder(4, [[1,0],[2,0],[3,1],[3,2]])); // [0,1,2,3] (or any valid)
console.log(findOrder(2, [[1, 0],[0, 1]])); // [] (cycle)
console.log(findOrder(1, [])); // [0]

```

---

## 🔗 Related Problems

- [Course Schedule I](https://leetcode.com/problems/course-schedule/) — same problem, return bool instead of ordering
- [Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) — topological sort on character dependency
- [Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/) — similar in-degree peeling technique
- [Lowest Common Ancestor](./16-lowest-common-ancestor-binary-tree.md) — tree DFS with state propagation

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric | Target | Your Result |
|---|---|---|
| Time to solve | ≤ 25 min | _____ min |
| Got optimal on first try | Yes | ☐ Yes ☐ No |
| Explained clearly | Yes | ☐ Yes ☐ No |
| Handled all edge cases | Yes | ☐ Yes ☐ No |

**SRS Schedule:** After solving — review in 1 day → 3 days → 7 days → 14 days → 30 days.

### Review Log

| Date | Time Taken | Notes |
|---|---|---|
| | | |
