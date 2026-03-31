---
layout: page
title: "Valid Arrangement of Pairs"
difficulty: Hard
category: Tree-Graph
tags: [Depth-First Search, Graph, Eulerian Circuit]
leetcode_url: "https://leetcode.com/problems/valid-arrangement-of-pairs"
---

# Valid Arrangement of Pairs / Sắp Xếp Hợp Lệ Các Cặp

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Eulerian Path (Hierholzer)
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Như đố vẽ hình không nhấc bút — bạn cần đi qua mọi cạnh đúng một lần. Đây là bài toán "Đường đi Euler" cổ điển. Nút xuất phát có out-degree cao hơn in-degree; thuật toán Hierholzer tìm đường này bằng cách "lùi từ ngõ cụt".

**Pattern Recognition:**

- Signal: `pairs[i][1] == pairs[i+1][0]` → **Eulerian Path** (traverse each edge exactly once)
- Start node: `outDegree - inDegree = 1`, else any node with outDegree > 0
- Hierholzer's algorithm: iterative DFS, append to result when backtracking

**Visual:**

```
pairs = [[5,1],[4,5],[11,9],[9,4]]

Graph edges: 5→1, 4→5, 11→9, 9→4
outDeg: {5:1, 4:1, 11:1, 9:1}
inDeg:  {1:1, 5:1, 9:1, 4:1}

Euler start: 11 (out-in = 1-0 = 1)
Hierholzer: stack=[11] → push 9 → push 4 → push 5 → push 1
             1 has no neighbors → pop → result=[1], stack top=5 → push...
Path: 11→9→4→5→1
Result: [[11,9],[9,4],[4,5],[5,1]]
```

## Problem Description

Given `pairs[i] = [start_i, end_i]`, rearrange them such that `pairs[i][1] == pairs[i+1][0]` for all consecutive pairs. A valid arrangement always exists. Return the rearranged array.

Example 1: `pairs=[[5,1],[4,5],[11,9],[9,4]]` → `[[11,9],[9,4],[4,5],[5,1]]`
Example 2: `pairs=[[1,3],[3,2],[2,1]]` → `[[1,3],[3,2],[2,1]]`

## 📝 Interview Tips

1. **Recognize pattern**: "pairs[i][1] == pairs[i+1][0] → đây là bài Eulerian Path kinh điển" / Euler path recognition
2. **Start node**: "out - in = 1 → start; all balanced (Euler circuit) → start = any" / Find correct start
3. **Hierholzer**: "Iterative: đẩy node vào stack, khi hết neighbor thì pop và lưu vào result" / Iterative Hierholzer
4. **Edge cases**: "Chỉ có 1 pair → trả về luôn" / Single pair: return as-is
5. **Node types**: "Nodes có thể là bất kỳ số nguyên → dùng Map thay vì array" / Use Map for arbitrary values
6. **Complexity**: "Time O(E) | Space O(E) where E = number of pairs"

## Solutions

```typescript
/** Solution 1: Brute Force — try all permutations (only feasible for tiny inputs)
 * Time: O(n! * n) | Space: O(n)
 */
function validArrangementBrute(pairs: number[][]): number[][] {
  const n = pairs.length;
  const used = new Array(n).fill(false);
  let result: number[][] = [];

  function backtrack(last: number, current: number[][]): boolean {
    if (current.length === n) {
      result = current;
      return true;
    }
    for (let i = 0; i < n; i++) {
      if (!used[i] && (current.length === 0 || pairs[i][0] === last)) {
        used[i] = true;
        if (backtrack(pairs[i][1], [...current, pairs[i]])) return true;
        used[i] = false;
      }
    }
    return false;
  }

  backtrack(-1, []);
  return result;
}

/** Solution 2: Hierholzer's Algorithm — iterative Eulerian path
 * Time: O(E) | Space: O(E)
 */
function validArrangement(pairs: number[][]): number[][] {
  const graph = new Map<number, number[]>();
  const inDeg = new Map<number, number>();
  const outDeg = new Map<number, number>();

  for (const [u, v] of pairs) {
    if (!graph.has(u)) graph.set(u, []);
    graph.get(u)!.push(v);
    outDeg.set(u, (outDeg.get(u) ?? 0) + 1);
    inDeg.set(v, (inDeg.get(v) ?? 0) + 1);
    if (!inDeg.has(u)) inDeg.set(u, 0);
    if (!outDeg.has(v)) outDeg.set(v, 0);
  }

  // Find starting node: out - in = 1, else any node with outDeg > 0
  let start = pairs[0][0];
  for (const [node, out] of outDeg) {
    const inD = inDeg.get(node) ?? 0;
    if (out - inD === 1) {
      start = node;
      break;
    }
  }

  // Hierholzer: build Euler path as sequence of nodes
  const nodePath: number[] = [];
  const stack: number[] = [start];

  while (stack.length > 0) {
    const u = stack[stack.length - 1];
    const adj = graph.get(u);
    if (adj && adj.length > 0) {
      stack.push(adj.pop()!); // follow next edge
    } else {
      nodePath.push(stack.pop()!); // backtrack
    }
  }

  nodePath.reverse();

  // Convert node sequence to pairs
  const result: number[][] = [];
  for (let i = 0; i < nodePath.length - 1; i++) {
    result.push([nodePath[i], nodePath[i + 1]]);
  }
  return result;
}

/** Solution 3: Recursive Hierholzer — cleaner but risks stack overflow
 * Time: O(E) | Space: O(E)
 */
function validArrangementRecursive(pairs: number[][]): number[][] {
  const graph = new Map<number, number[]>();
  const inDeg = new Map<number, number>();
  const outDeg = new Map<number, number>();

  for (const [u, v] of pairs) {
    if (!graph.has(u)) graph.set(u, []);
    graph.get(u)!.push(v);
    outDeg.set(u, (outDeg.get(u) ?? 0) + 1);
    inDeg.set(v, (inDeg.get(v) ?? 0) + 1);
  }

  let start = pairs[0][0];
  for (const [node] of outDeg) {
    if ((outDeg.get(node) ?? 0) - (inDeg.get(node) ?? 0) === 1) {
      start = node;
      break;
    }
  }

  const result: number[][] = [];

  function dfs(u: number): void {
    const adj = graph.get(u) ?? [];
    while (adj.length > 0) {
      const v = adj.pop()!;
      dfs(v);
      result.push([u, v]);
    }
  }

  dfs(start);
  result.reverse();
  return result;
}

// Tests
console.log(
  JSON.stringify(
    validArrangement([
      [5, 1],
      [4, 5],
      [11, 9],
      [9, 4],
    ]),
  ),
); // [[11,9],[9,4],[4,5],[5,1]]
console.log(
  JSON.stringify(
    validArrangement([
      [1, 3],
      [3, 2],
      [2, 1],
    ]),
  ),
); // [[1,3],[3,2],[2,1]] or valid rotation
console.log(
  JSON.stringify(
    validArrangementRecursive([
      [5, 1],
      [4, 5],
      [11, 9],
      [9, 4],
    ]),
  ),
); // same
console.log(
  JSON.stringify(
    validArrangement([
      [1, 2],
      [2, 3],
    ]),
  ),
); // [[1,2],[2,3]]
console.log(JSON.stringify(validArrangement([[1, 2]]))); // [[1,2]]
// Verify arrangement validity
const res = validArrangement([
  [5, 1],
  [4, 5],
  [11, 9],
  [9, 4],
]);
console.log(res.every((p, i) => i === 0 || res[i - 1][1] === p[0])); // true
```

## 🔗 Related Problems

| Problem                                                                      | Relationship                                 |
| ---------------------------------------------------------------------------- | -------------------------------------------- |
| [Reconstruct Itinerary](https://leetcode.com/problems/reconstruct-itinerary) | Exact same algorithm, lexicographic ordering |
| [Eulerian Circuit](https://en.wikipedia.org/wiki/Eulerian_path)              | Classic algorithmic foundation               |
| [Course Schedule II](https://leetcode.com/problems/course-schedule-ii)       | Topological ordering of directed graph       |
