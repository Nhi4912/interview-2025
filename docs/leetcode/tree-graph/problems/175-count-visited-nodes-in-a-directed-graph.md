---
layout: page
title: "Count Visited Nodes in a Directed Graph"
difficulty: Hard
category: Tree-Graph
tags: [Dynamic Programming, Graph, Memoization]
leetcode_url: "https://leetcode.com/problems/count-visited-nodes-in-a-directed-graph"
---

# Count Visited Nodes in a Directed Graph / Đếm Nút Được Thăm Trong Đồ Thị Có Hướng

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Đây là "functional graph" — mỗi nút có đúng một cạnh ra. Từ bất kỳ nút nào, đi theo mũi tên cuối cùng sẽ vào một vòng lặp (cycle). Nút nằm trong cycle thì visited = độ dài cycle. Nút ngoài cycle thì visited = khoảng cách đến cycle + kích thước cycle.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Count Visited Nodes in a Directed Graph example:**

```
edges: [1, 2, 0, 3]  (node i → edges[i])
0→1→2→0 (cycle of length 3)   ans[0]=ans[1]=ans[2]=3
3→3       (self-loop, cycle=1) ans[3]=1

edges: [1,2,3,4,0]
0→1→2→3→4→0  (cycle length 5) all = 5
```

---

---

## Problem Description

| Problem                                                                                           | Difficulty | Key Idea                            |
| ------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------- |
| [Find Eventual Safe States 802](https://leetcode.com/problems/find-eventual-safe-states)          | Medium     | Cycle detection in functional graph |
| [Longest Cycle in a Graph 2360](https://leetcode.com/problems/longest-cycle-in-a-graph)           | Hard       | Find max cycle length               |
| [Course Schedule 207](https://leetcode.com/problems/course-schedule)                              | Medium     | Cycle detection with DFS            |
| [Largest Color Value 1857](https://leetcode.com/problems/largest-color-value-in-a-directed-graph) | Hard       | DP on DAG / cycle detection         |

---

## 📝 Interview Tips

- 🔑 **EN:** Functional graph: every node has out-degree 1 → always forms rho (ρ) shaped paths | **VI:** Mỗi nút chỉ có 1 cạnh ra → tạo dạng chữ ρ
- 🔑 **EN:** Step 1: detect cycles using visited array with 3 states: unvisited/in-path/done | **VI:** Phát hiện cycle với 3 trạng thái: chưa thăm / đang thăm / xong
- 🔑 **EN:** Step 2: all cycle nodes get ans = cycle length | **VI:** Nút trong cycle: ans = độ dài cycle
- 🔑 **EN:** Step 3: backtrack from cycle entry to assign distances | **VI:** Nút ngoài cycle: ans = dist to cycle + cycle length
- 🔑 **EN:** Track path order to compute distances from cycle entry point | **VI:** Lưu thứ tự đường đi để tính khoảng cách
- 🔑 **EN:** Time O(n) — each node visited exactly once | **VI:** Mỗi nút xét đúng 1 lần → O(n)

---

---

## Solutions

```typescript
/**
 * Functional Graph: Cycle Detection + Back-propagation
 * Time: O(n)  Space: O(n)
 */
function countVisitedNodes(edges: number[]): number[] {
  const n = edges.length;
  const ans = new Array(n).fill(0);
  const visited = new Array(n).fill(0); // 0=unvisited, 1=in-path, 2=done

  for (let start = 0; start < n; start++) {
    if (visited[start] !== 0) continue;

    // Trace the path from start until we hit a visited node or a cycle
    const path: number[] = [];
    const pathIndex = new Map<number, number>(); // node → index in path

    let cur = start;
    while (visited[cur] === 0) {
      visited[cur] = 1;
      pathIndex.set(cur, path.length);
      path.push(cur);
      cur = edges[cur];
    }

    if (visited[cur] === 1) {
      // cur is still in current path → found a new cycle
      const cycleStart = pathIndex.get(cur)!;
      const cycleLen = path.length - cycleStart;

      // All nodes in the cycle get ans = cycleLen
      for (let i = cycleStart; i < path.length; i++) {
        ans[path[i]] = cycleLen;
        visited[path[i]] = 2;
      }

      // Back-propagate for nodes before the cycle
      for (let i = cycleStart - 1; i >= 0; i--) {
        ans[path[i]] = ans[edges[path[i]]] + 1;
        visited[path[i]] = 2;
      }
    } else {
      // cur already fully processed (visited[cur] === 2)
      // Back-propagate from the tail
      for (let i = path.length - 1; i >= 0; i--) {
        ans[path[i]] = ans[edges[path[i]]] + 1;
        visited[path[i]] = 2;
      }
    }
  }

  return ans;
}

// Test cases
console.log(countVisitedNodes([1, 2, 0, 0])); // [3,3,3,4]
console.log(countVisitedNodes([1, 2, 3, 4, 0])); // [5,5,5,5,5]
console.log(countVisitedNodes([1, 2, 3, 4, 0, 5, 6])); // cycle 0-4 len=5; 5→5(self), 6→6(self)

/**
 * Iterative approach using explicit stack for cycle finding
 * Time: O(n)  Space: O(n)
 */
function countVisitedNodesV2(edges: number[]): number[] {
  const n = edges.length;
  const ans = new Array(n).fill(-1);

  const findCycleLength = (start: number, seen: Map<number, number>): number => {
    let cycleStart = -1,
      pos = 0;
    let cur = start;
    while (!seen.has(cur)) {
      seen.set(cur, pos++);
      cur = edges[cur];
    }
    cycleStart = seen.get(cur)!;
    return pos - cycleStart; // cycle length
  };

  for (let i = 0; i < n; i++) {
    if (ans[i] !== -1) continue;

    const path: number[] = [];
    const inPath = new Map<number, number>();
    let cur = i;

    while (cur !== -1 && ans[cur] === -1 && !inPath.has(cur)) {
      inPath.set(cur, path.length);
      path.push(cur);
      cur = edges[cur];
    }

    let tailVal: number;
    if (ans[cur] !== -1) {
      tailVal = ans[cur]; // already solved
    } else {
      // cur is in current path → cycle
      const cycleIdx = inPath.get(cur)!;
      const cycleLen = path.length - cycleIdx;
      for (let j = cycleIdx; j < path.length; j++) {
        ans[path[j]] = cycleLen;
      }
      // Back-fill cycle tail nodes
      for (let j = cycleIdx - 1; j >= 0; j--) {
        ans[path[j]] = ans[edges[path[j]]] + 1;
      }
      continue;
    }

    for (let j = path.length - 1; j >= 0; j--) {
      ans[path[j]] = tailVal + 1;
      tailVal = ans[path[j]];
    }
  }

  return ans;
}

console.log(countVisitedNodesV2([1, 2, 0, 0])); // [3,3,3,4]
console.log(countVisitedNodesV2([1, 2, 3, 4, 0])); // [5,5,5,5,5]
```

---

## 🔗 Related Problems

| Problem                                                                                           | Difficulty | Key Idea                            |
| ------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------- |
| [Find Eventual Safe States 802](https://leetcode.com/problems/find-eventual-safe-states)          | Medium     | Cycle detection in functional graph |
| [Longest Cycle in a Graph 2360](https://leetcode.com/problems/longest-cycle-in-a-graph)           | Hard       | Find max cycle length               |
| [Course Schedule 207](https://leetcode.com/problems/course-schedule)                              | Medium     | Cycle detection with DFS            |
| [Largest Color Value 1857](https://leetcode.com/problems/largest-color-value-in-a-directed-graph) | Hard       | DP on DAG / cycle detection         |
