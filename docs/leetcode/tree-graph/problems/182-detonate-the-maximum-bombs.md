---
layout: page
title: "Detonate the Maximum Bombs"
difficulty: Medium
category: Tree-Graph
tags: [Array, Math, Depth-First Search, Breadth-First Search, Graph]
leetcode_url: "https://leetcode.com/problems/detonate-the-maximum-bombs"
---

# Detonate the Maximum Bombs / Kích Nổ Tối Đa Bom

🟡 Medium | DFS/BFS on Directed Graph of Bomb Chain Reactions | [LeetCode 2101](https://leetcode.com/problems/detonate-the-maximum-bombs)

---

## 🧠 Intuition / Trực giác

**Vietnamese:** Xây đồ thị có hướng: bom i → bom j nếu bán kính của bom i đủ để kích nổ bom j (khoảng cách tâm ≤ bán kính i). Với mỗi bom làm điểm xuất phát, BFS/DFS để đếm bao nhiêu bom bị kích nổ. Trả về max.

```
bombs=[[2,1,3],[6,1,4]]
  dist(bomb0,bomb1) = sqrt((6-2)²+(1-1)²) = 4 ≤ r0=3? NO (4>3)
  dist(bomb1,bomb0) = 4 ≤ r1=4? YES → edge: 1→0
  Start bomb0: detonates {0}      → count=1
  Start bomb1: detonates {1,0}    → count=2  ← answer

Key check: (x2-x1)²+(y2-y1)² ≤ r1²  (use squares to avoid float)
```

---

## 📝 Interview Tips / Gợi ý phỏng vấn

- 🔑 **EN:** Build directed graph edge i→j if dist(i,j)² ≤ r[i]² | **VI:** Cạnh i→j khi khoảng cách² ≤ bán kính²
- 🔑 **EN:** Use squared distances to avoid floating point errors | **VI:** Dùng bình phương để tránh sai số float
- 🔑 **EN:** For each bomb as source, BFS/DFS and count reachable bombs | **VI:** BFS/DFS từ mỗi bom, đếm số bom kích nổ được
- 🔑 **EN:** O(n²) to build graph + O(n²) for n BFS runs = O(n²) total | **VI:** O(n²) xây đồ thị + O(n²) cho n lần BFS
- 🔑 **EN:** n ≤ 100 → O(n³) is also fine | **VI:** n ≤ 100 → O(n³) cũng ổn
- 🔑 **EN:** Greedy won't work — chain reaction is directional, not symmetric | **VI:** Tham lam không được — phản ứng dây chuyền có hướng

---

## 💡 Solutions / Giải pháp

```typescript
/**
 * Build directed graph + BFS from each node
 * Time: O(n²) build + O(n × (n+E)) BFS = O(n³) worst case
 * Space: O(n²) adjacency list
 */
function maximumDetonation(bombs: number[][]): number {
  const n = bombs.length;

  // Build adjacency list: i can trigger j
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    const [x1, y1, r1] = bombs[i];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const [x2, y2] = bombs[j];
      const dx = x2 - x1,
        dy = y2 - y1;
      // Use squared distance to avoid floating point
      if (dx * dx + dy * dy <= r1 * r1) graph[i].push(j);
    }
  }

  // BFS from each bomb, count reachable
  const bfs = (start: number): number => {
    const visited = new Set<number>([start]);
    const queue: number[] = [start];
    while (queue.length) {
      const cur = queue.shift()!;
      for (const nb of graph[cur]) {
        if (!visited.has(nb)) {
          visited.add(nb);
          queue.push(nb);
        }
      }
    }
    return visited.size;
  };

  let ans = 0;
  for (let i = 0; i < n; i++) ans = Math.max(ans, bfs(i));
  return ans;
}

// Test cases
console.log(
  maximumDetonation([
    [2, 1, 3],
    [6, 1, 4],
  ]),
); // 2
console.log(
  maximumDetonation([
    [1, 1, 5],
    [10, 10, 5],
  ]),
); // 1
console.log(
  maximumDetonation([
    [1, 2, 3],
    [2, 3, 1],
    [3, 4, 2],
    [4, 5, 3],
    [5, 6, 4],
  ]),
); // 5
```

```typescript
/**
 * DFS variant — same complexity, iterative to avoid call stack issues
 * Time: O(n³)  Space: O(n²)
 */
function maximumDetonationDFS(bombs: number[][]): number {
  const n = bombs.length;
  const adj: number[][] = Array.from({ length: n }, () => []);

  for (let i = 0; i < n; i++) {
    const [x1, y1, r1] = bombs[i];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const dx = bombs[j][0] - x1,
        dy = bombs[j][1] - y1;
      if (dx * dx + dy * dy <= r1 * r1) adj[i].push(j);
    }
  }

  const dfs = (start: number): number => {
    const stack = [start];
    const seen = new Set<number>([start]);
    while (stack.length) {
      const cur = stack.pop()!;
      for (const nb of adj[cur]) {
        if (!seen.has(nb)) {
          seen.add(nb);
          stack.push(nb);
        }
      }
    }
    return seen.size;
  };

  let ans = 1;
  for (let i = 0; i < n; i++) ans = Math.max(ans, dfs(i));
  return ans;
}

console.log(
  maximumDetonationDFS([
    [2, 1, 3],
    [6, 1, 4],
  ]),
); // 2
console.log(
  maximumDetonationDFS([
    [1, 1, 5],
    [10, 10, 5],
  ]),
); // 1
```

---

## 🔗 Related Problems / Bài liên quan

| Problem                                                                             | Difficulty | Key Idea                       |
| ----------------------------------------------------------------------------------- | ---------- | ------------------------------ |
| [Number of Provinces 547](https://leetcode.com/problems/number-of-provinces)        | Medium     | BFS/DFS connected components   |
| [Evaluate Division 399](https://leetcode.com/problems/evaluate-division)            | Medium     | Directed graph BFS             |
| [Course Schedule 207](https://leetcode.com/problems/course-schedule)                | Medium     | Directed graph cycle detection |
| [Minimum Malware Spread 924](https://leetcode.com/problems/minimize-malware-spread) | Hard       | Union-Find + reachability      |
