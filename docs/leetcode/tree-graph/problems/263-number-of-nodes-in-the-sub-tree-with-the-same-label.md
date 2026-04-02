---
layout: page
title: "Number of Nodes in the Sub-Tree With the Same Label"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Tree, Depth-First Search, Breadth-First Search, Counting]
leetcode_url: "https://leetcode.com/problems/number-of-nodes-in-the-sub-tree-with-the-same-label"
---

# Number of Nodes in the Sub-Tree With the Same Label / Số Nút Trong Cây Con Có Cùng Nhãn

> **Track**: Tree-Graph | **Difficulty**: 🟡 Medium | **Pattern**: DFS Post-Order — Frequency Merge
> **Frequency**: 📘 Tier 3 — Gặp ở Amazon, Google
> **See also**: [337 House Robber III](https://leetcode.com/problems/house-robber-iii) | [508 Most Frequent Subtree Sum](https://leetcode.com/problems/most-frequent-subtree-sum)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng một tập đoàn có nhiều chi nhánh phân cấp. Mỗi nhân viên mang một "màu áo" (nhãn a-z). Quản lý của chi nhánh muốn biết trong toàn bộ phòng ban của mình (bao gồm mọi cấp dưới), có bao nhiêu người mặc áo cùng màu với mình. Giải pháp: mỗi chi nhánh tổng hợp báo cáo từ các phòng ban con trước (post-order), rồi cộng thêm chính mình, và đọc số đếm ứng với nhãn của mình để trả kết quả lên trên.

**Pattern Recognition:**

- Signal: "tree with labels, count occurrences of node's label in its subtree" → **DFS post-order with freq arrays**
- Bài này thuộc dạng DFS hậu thứ tự (post-order) gộp mảng tần số từ con lên cha
- Key insight: mỗi DFS call trả về mảng 26 phần tử đếm tần số từng nhãn trong subtree; `ans[node] = freq[label_of_node]` sau khi merge

**Visual — Post-order frequency merge:**

```
Tree: n=7, edges=[[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]]
labels="abaedcd"
      0(a)
     / \
   1(b) 2(a)
   /\   /\
4(e)5(d)3(c)6(d)

DFS post-order:
  node4(e): freq=[0,..,1(e),..]     ans[4]=1
  node5(d): freq=[0,..,1(d),..]     ans[5]=1
  node1(b): merge children + self(b) → freq=[0,1(b),..,1(d),1(e),..]  ans[1]=1
  node3(c): freq=[0,..,1(c),..]     ans[3]=1
  node6(d): freq=[0,..,1(d),..]     ans[6]=1
  node2(a): merge + self(a) → freq=[1(a),0,..,1(c),1(d),..]  ans[2]=1 (only 1 'a' in subtree)
  node0(a): merge left+right+self → freq=[2(a),1(b),..]   ans[0]=2 ← both 0 and 2 are 'a'

Result: [2,1,1,1,1,1,1]
```

---

## Problem Description

Given a tree of n nodes (0-indexed), edges list, and a string `labels` where `labels[i]` is the label of node i. For each node, return the count of nodes in its subtree (including itself) that have the same label as node i. ([LeetCode](https://leetcode.com/problems/number-of-nodes-in-the-sub-tree-with-the-same-label))

```
Example 1: n=7, edges=[[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]], labels="abaedcd" → [2,1,1,1,1,1,1]
Example 2: n=4, edges=[[0,1],[1,2],[0,3]], labels="bbbb" → [4,2,1,1]
```

Constraints: 1 ≤ n ≤ 10⁵; labels is lowercase English, length n; tree with n-1 edges.

---

## 📝 Interview Tips

1. **Build adjacency list — tree is undirected in input, use parent tracking to avoid revisit** — _Xây danh sách kề, dùng parent để không đi ngược lên_
2. **DFS returns int[26] — frequency of each label in the subtree** — _DFS trả về mảng 26 phần tử đếm nhãn trong cây con_
3. **Post-order: collect children's arrays first, merge by addition** — _Hậu thứ tự: gộp mảng của con trước, rồi cộng nhãn của node hiện tại_
4. **ans[node] = merged_freq[labels[node].charCodeAt(0) - 97]** — _Đáp án cho node = số đếm nhãn của nó trong mảng gộp_
5. **Merge cost: O(26) per node = O(26n) total — acceptable** — _Chi phí gộp: O(26) mỗi node, tổng O(26n) — chấp nhận được_
6. **Watch out for O(n²) if you create new arrays per node — reuse or copy smartly** — _Tránh tạo array mới mỗi node nếu n lớn — copy có chọn lọc_

---

## Solutions

```typescript
/** Solution 1: DFS post-order returning freq array[26]
 * @complexity Time: O(26n) | Space: O(26n) */
function countSubTrees(n: number, edges: number[][], labels: string): number[] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const ans = new Array(n).fill(0);

  function dfs(node: number, parent: number): number[] {
    const freq = new Array(26).fill(0);
    freq[labels.charCodeAt(node) - 97]++;

    for (const next of adj[node]) {
      if (next === parent) continue;
      const childFreq = dfs(next, node);
      for (let i = 0; i < 26; i++) freq[i] += childFreq[i];
    }

    ans[node] = freq[labels.charCodeAt(node) - 97];
    return freq;
  }

  dfs(0, -1);
  return ans;
}

/** Solution 2: Iterative DFS with explicit stack (avoids stack overflow for large n)
 * @complexity Time: O(26n) | Space: O(26n) */
function countSubTrees2(n: number, edges: number[][], labels: string): number[] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const ans = new Array(n).fill(0);
  const freq: number[][] = Array.from({ length: n }, () => new Array(26).fill(0));
  for (let i = 0; i < n; i++) freq[i][labels.charCodeAt(i) - 97] = 1;

  // Post-order via two-stack trick
  const order: number[] = [];
  const parent = new Array(n).fill(-1);
  const visited = new Array(n).fill(false);
  const stack = [0];
  visited[0] = true;

  while (stack.length) {
    const node = stack.pop()!;
    order.push(node);
    for (const next of adj[node]) {
      if (!visited[next]) {
        visited[next] = true;
        parent[next] = node;
        stack.push(next);
      }
    }
  }

  // Process in reverse order (post-order)
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    ans[node] = freq[node][labels.charCodeAt(node) - 97];
    if (parent[node] !== -1) {
      for (let j = 0; j < 26; j++) freq[parent[node]][j] += freq[node][j];
    }
  }

  return ans;
}

// === Test Cases ===
console.log(
  countSubTrees(
    7,
    [
      [0, 1],
      [0, 2],
      [1, 4],
      [1, 5],
      [2, 3],
      [2, 6],
    ],
    "abaedcd",
  ),
); // [2,1,1,1,1,1,1]
console.log(
  countSubTrees(
    4,
    [
      [0, 1],
      [1, 2],
      [0, 3],
    ],
    "bbbb",
  ),
); // [4,2,1,1]
console.log(
  countSubTrees2(
    7,
    [
      [0, 1],
      [0, 2],
      [1, 4],
      [1, 5],
      [2, 3],
      [2, 6],
    ],
    "abaedcd",
  ),
); // [2,1,1,1,1,1,1]
```

---

## 🔗 Related Problems

| #    | Problem                    | Difficulty | Pattern        |
| ---- | -------------------------- | ---------- | -------------- |
| 508  | Most Frequent Subtree Sum  | Medium     | DFS post-order |
| 337  | House Robber III           | Medium     | DFS on tree    |
| 968  | Binary Tree Cameras        | Hard       | DFS post-order |
| 1367 | Linked List in Binary Tree | Medium     | DFS            |
