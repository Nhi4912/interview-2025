---
layout: page
title: "Course Schedule II"
difficulty: Medium
category: Tree/Graph
tags: [Depth-First Search, Breadth-First Search, Graph, Topological Sort]
leetcode_url: "https://leetcode.com/problems/course-schedule-ii/"
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

## 📝 Interview Tips

1. **Clarify**: Multiple valid orderings are fine — return any one / VI: "Nhiều thứ tự hợp lệ tồn tại, trả về bất kỳ cái nào đúng là được"
2. **Brute force**: DFS with 3-color cycle detection (WHITE/GRAY/BLACK) — recursive, push to result on finish / VI: DFS đánh dấu 3 trạng thái, node đang thăm (GRAY) là dấu hiệu cycle; kết quả reverse post-order
3. **Optimize**: Kahn's BFS — iterative, in-degree array, easier to trace in interview / VI: BFS với mảng in-degree trực quan hơn khi explain; queue chứa các node sẵn sàng xử lý
4. **Edge cases**: No prerequisites → return `[0,1,...,n-1]`; single course → `[0]` / VI: Không có dependency → bất kỳ thứ tự nào đều hợp lệ
5. **Follow-up**: Minimum number of semesters if parallelism is allowed? / VI: Số học kỳ tối thiểu nếu có thể học nhiều môn song song trong cùng kỳ

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
