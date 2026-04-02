---
layout: page
title: "Minimum Time to Collect All Apples in a Tree"
difficulty: Medium
category: Tree & Graph
tags: [Tree, DFS, BFS, Hash Table]
leetcode_url: "https://leetcode.com/problems/minimum-time-to-collect-all-apples-in-a-tree"
---

# Minimum Time to Collect All Apples in a Tree / Thời Gian Tối Thiểu Hái Táo

> **Track**: Tree & Graph | **Difficulty**: 🟡 Medium | **Pattern**: DFS Post-Order
> **Frequency**: 📗 Tier 2 — Gặp ở nhiều vòng phỏng vấn
> **See also**: [Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree) | [Time Needed to Inform All Employees](https://leetcode.com/problems/time-needed-to-inform-all-employees)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng bạn đang đi hái táo trong một khu vườn hình cây — mỗi nhánh cây là một con đường, mỗi điểm nối là một ngã rẽ. Bạn bắt đầu từ gốc cây (node 0) và muốn hái hết tất cả táo rồi quay về. Mỗi cạnh tốn 1 giây đi và 1 giây về. Bí quyết: chỉ cần đi vào một nhánh nếu nhánh đó có táo — hoặc cây con của nó có táo. Dùng DFS từ lá lên gốc, cộng thêm 2 giây cho mỗi cạnh dẫn đến cây con có táo.

## Visual (Minh họa trực quan)

```
n=7, edges=[[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]]
apples=[false,false,true,false,true,true,false]

Tree:         DFS cost from leaves up:
    0           node 4 has apple → cost 2
   / \          node 5 has apple → cost 2
  1   2         node 1: children cost = 4 > 0 → +2 = 6
 /\ /\          node 3 no apple → cost 0
4 5 3 6         node 6 no apple → cost 0
                node 2: child cost = 0 → skip = 0
                node 0: child 1 cost=6>0 → +2=8, child 2 cost=0 → skip
Total = 8 ✓
```

## Problem (Bài toán)

Given an undirected tree with `n` nodes (0-indexed), a list of `edges`, and boolean array `hasApple` where `hasApple[i]` indicates if node `i` has an apple. Starting and ending at node 0, find the **minimum time** (in seconds) to collect all apples. Each edge takes 1 second to traverse in each direction.

**Example 1:** `n=7, edges=[[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]], hasApple=[false,false,true,false,true,true,false]` → `8`
**Example 2:** `n=7, edges=[[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]], hasApple=[false,false,true,false,false,true,false]` → `6`
**Example 3:** `n=7, edges=[[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]], hasApple=[false,false,false,false,false,false,false]` → `0`

**Constraints:** `1 ≤ n ≤ 10⁵`, `0 ≤ edges.length ≤ n-1`, `hasApple.length === n`

## Tips (Mẹo phỏng vấn)

- **DFS post-order** / DFS hậu thứ tự: Tính cost từ lá lên gốc — con nào có cost > 0 hoặc có táo thì cha cộng thêm 2
- **Build adjacency list** / Danh sách kề: Dùng `Map<number, number[]>` thay vì matrix để tiết kiệm bộ nhớ với n lớn
- **Avoid parent revisit** / Tránh đi ngược: Truyền `parent` vào DFS để không quay lại node cha
- **Return value meaning** / Ý nghĩa giá trị trả về: `dfs(node)` trả về tổng thời gian đi/về trong cây con của node đó
- **Edge cost = 2** / Mỗi cạnh tốn 2: Đi xuống 1 giây + về 1 giây — chỉ tính khi cây con thực sự có táo
- **Empty tree edge case** / Cây rỗng táo: Nếu không có táo nào → trả 0 ngay

## Solution 1 - DFS Recursive (Clear)

```typescript
/**
 * @complexity Time: O(n) | Space: O(n) recursion stack + adjacency list
 * Build adjacency list then DFS from root; add 2 for each edge with apples below
 */
function minTime(n: number, edges: number[][], hasApple: boolean[]): number {
  const adj = new Map<number, number[]>();
  for (let i = 0; i < n; i++) adj.set(i, []);
  for (const [u, v] of edges) {
    adj.get(u)!.push(v);
    adj.get(v)!.push(u);
  }

  function dfs(node: number, parent: number): number {
    let totalCost = 0;
    for (const child of adj.get(node)!) {
      if (child === parent) continue;
      const childCost = dfs(child, node);
      if (childCost > 0 || hasApple[child]) {
        totalCost += childCost + 2;
      }
    }
    return totalCost;
  }

  return dfs(0, -1);
}
```

## Solution 2 - DFS Iterative with Stack (Optimal for large n)

```typescript
/**
 * @complexity Time: O(n) | Space: O(n)
 * Iterative post-order DFS to avoid recursion stack overflow for n=10^5
 */
function minTimeIterative(n: number, edges: number[][], hasApple: boolean[]): number {
  if (n === 1) return 0;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const parent = new Int32Array(n).fill(-1);
  const order: number[] = [];
  const stack = [0];
  const visited = new Uint8Array(n);
  visited[0] = 1;

  while (stack.length) {
    const node = stack.pop()!;
    order.push(node);
    for (const nb of adj[node]) {
      if (!visited[nb]) {
        visited[nb] = 1;
        parent[nb] = node;
        stack.push(nb);
      }
    }
  }

  const cost = new Int32Array(n);
  for (let i = order.length - 1; i >= 1; i--) {
    const node = order[i];
    const p = parent[node];
    if (cost[node] > 0 || hasApple[node]) {
      cost[p] += cost[node] + 2;
    }
  }

  return cost[0];
}
```

## Test Cases

```typescript
const e = [[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]];
console.log(minTime(7, e, [false,false,true,false,true,true,false]));  // → 8
console.log(minTime(7, e, [false,false,true,false,false,true,false])); // → 6
console.log(minTime(7, e, [false,false,false,false,false,false,false]))); // → 0
console.log(minTimeIterative(7, e, [false,false,true,false,true,true,false])); // → 8
console.log(minTime(1, [], [false])); // → 0
```

## Related Problems

| Problem                             | Difficulty | Link                                                                         |
| ----------------------------------- | ---------- | ---------------------------------------------------------------------------- |
| Sum of Distances in Tree            | Hard       | [LC 834](https://leetcode.com/problems/sum-of-distances-in-tree)             |
| Time Needed to Inform All Employees | Medium     | [LC 1376](https://leetcode.com/problems/time-needed-to-inform-all-employees) |
| Distribute Coins in Binary Tree     | Medium     | [LC 979](https://leetcode.com/problems/distribute-coins-in-binary-tree)      |
