---
layout: page
title: "Amount of Time for Binary Tree to Be Infected"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected"
---

# Amount of Time for Binary Tree to Be Infected / Thời Gian Lây Nhiễm Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS on Graph (convert tree)
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree) | [Burn Tree](https://leetcode.com/problems/burn-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như dịch cúm lan trong gia đình — mỗi người lây sang cha/con/anh chị em của mình. Cây nhị phân chỉ có cạnh xuống (cha→con), nhưng bệnh lan cả chiều ngược. Đổi cây thành đồ thị vô hướng rồi BFS từ điểm bắt đầu.

**Pattern Recognition:**

- Signal: "infection spreads bidirectionally in tree" + "count time steps" → **Convert tree to undirected graph + BFS**
- Cây chỉ có parent→child, cần thêm child→parent để lan ngược
- Key insight: DFS build adjacency map, rồi BFS đếm levels

**Visual — Chuyển cây thành graph rồi BFS:**

```
Tree:        Adjacency (undirected):
    1          1: [2, 3]
   / \         2: [1, 4, 5]
  2   3        3: [1]
 / \            4: [2]
4   5           5: [2]

start=3: BFS levels
  t=0: {3}
  t=1: {1}       (3→1)
  t=2: {2}       (1→2)
  t=3: {4, 5}    (2→4, 2→5)
Answer = 3 minutes
```

---

## Problem Description

Cho một cây nhị phân và node `start`. Mỗi phút, node bị nhiễm lây sang tất cả các node liền kề (cha, con trái, con phải). Trả về số phút để toàn bộ cây bị nhiễm. ([LeetCode](https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected))

**Example 1:** root = [1,2,3,4,5], start = 3 → Output: `3`

**Example 2:** root = [1], start = 1 → Output: `0`

Constraints: `1 <= n <= 10^5`, node values unique, `1 <= start <= 10^5`

---

## 📝 Interview Tips

1. **Clarify**: "Node values unique không? Start node có trong cây không?" / Are values unique? Is start guaranteed in tree?
2. **Key insight**: "Cây → undirected graph, vì bệnh lan lên cả cha" / Tree must become undirected graph for parent propagation
3. **Two-pass**: "DFS build graph O(n), BFS từ start O(n)" / DFS to build graph, BFS from start to count time
4. **Alternative**: "Có thể làm 1-pass DFS trả về (subtree_size, distance_from_start)" / One-pass DFS possible returning (size, distance)
5. **Edge cases**: "Start là root, start là leaf, cây chỉ có 1 node" / Start is root, start is leaf, single node tree
6. **Follow-up**: "Nếu lây với xác suất p mỗi phút?" / What if infection spreads with probability p? → simulation

---

## Solutions

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Solution 1: Convert to graph + BFS
 * Time: O(n) — DFS build + BFS traverse
 * Space: O(n) — adjacency list + queue
 */
function amountOfTime(root: TreeNode | null, start: number): number {
  if (!root) return 0;

  // Build undirected adjacency list
  const graph = new Map<number, number[]>();
  function buildGraph(node: TreeNode | null, parent: number | null): void {
    if (!node) return;
    if (!graph.has(node.val)) graph.set(node.val, []);
    if (parent !== null) {
      graph.get(node.val)!.push(parent);
      graph.get(parent)!.push(node.val);
    }
    buildGraph(node.left, node.val);
    buildGraph(node.right, node.val);
  }
  buildGraph(root, null);

  // BFS from start
  const visited = new Set<number>([start]);
  const queue: number[] = [start];
  let minutes = -1;
  let head = 0;
  while (head < queue.length) {
    const size = queue.length - head;
    minutes++;
    for (let i = 0; i < size; i++) {
      const curr = queue[head++];
      for (const neighbor of graph.get(curr) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }
  return Math.max(0, minutes);
}

/**
 * Solution 2: Single-pass DFS — returns (subtree depth, delay to start)
 * Time: O(n) — one DFS traversal
 * Space: O(n) — recursion stack
 */
function amountOfTimeOnePass(root: TreeNode | null, start: number): number {
  let ans = 0;
  // Returns depth of subtree; if start found, returns negative (distance from start)
  function dfs(node: TreeNode | null): number {
    if (!node) return 0;
    const left = dfs(node.left);
    const right = dfs(node.right);
    if (node.val === start) {
      // Max depth of subtrees below start
      ans = Math.max(ans, Math.max(Math.abs(left), Math.abs(right)));
      return -1; // Signal: start found, distance = 1 from parent
    }
    if (left < 0 || right < 0) {
      // One subtree contains start
      const distFromStart = Math.abs(left < 0 ? left : right);
      const otherDepth = left < 0 ? right : left;
      ans = Math.max(ans, distFromStart + otherDepth);
      return -(distFromStart + 1); // Propagate distance upward
    }
    return Math.max(left, right) + 1; // Normal depth return
  }
  dfs(root);
  return ans;
}

// === Test Cases ===
function build(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] == null) return null;
  const root = new TreeNode(vals[0]!);
  const q = [root];
  let i = 1;
  while (i < vals.length) {
    const node = q.shift()!;
    if (vals[i] != null) {
      node.left = new TreeNode(vals[i]!);
      q.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] != null) {
      node.right = new TreeNode(vals[i]!);
      q.push(node.right);
    }
    i++;
  }
  return root;
}

console.log(amountOfTime(build([1, 2, 3, 4, 5]), 3)); // 3
console.log(amountOfTime(build([1]), 1)); // 0
console.log(amountOfTime(build([1, 2, null, 3, null, 4]), 4)); // 3
console.log(amountOfTimeOnePass(build([1, 2, 3, 4, 5]), 3)); // 3
```

---

## 🔗 Related Problems

- [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree) — cùng kỹ thuật convert tree→graph, find K-distant nodes
- [Time Needed to Inform All Employees](https://leetcode.com/problems/time-needed-to-inform-all-employees) — BFS/DFS trên cây tổ chức
- [Maximum Width of Binary Tree](https://leetcode.com/problems/maximum-width-of-binary-tree) — BFS level traversal counting
- [Burning Tree](https://www.geeksforgeeks.org/burn-the-binary-tree-starting-from-the-target-node/) — bài gốc cùng pattern
