---
layout: page
title: "Number of Provinces"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/number-of-provinces"
---

# Number of Provinces / Số Lượng Tỉnh Thành

> **Difficulty**: 🟡 Medium | **Category**: Tree-Graph | **Pattern**: Connected Components (DFS/Union-Find)

## 🧠 Intuition / Tư Duy

**Như đếm số cụm bạn bè trong lớp học** — nếu A quen B và B quen C thì A, B, C thuộc cùng một nhóm bạn bè (tỉnh). Hỏi có bao nhiêu nhóm độc lập? Đây là bài toán tìm số thành phần liên thông cổ điển.

**Pattern Recognition:**

- Ma trận kề n×n → đồ thị có n đỉnh
- Đếm số nhóm → connected components → DFS/BFS hoặc Union-Find
- `isConnected[i][j]=1` ↔ i và j trực tiếp kết nối

**Visual:**

```
isConnected = [[1,1,0],    Graph: 0—1   2
               [1,1,0],
               [0,0,1]]
DFS from 0 → visits {0,1}, DFS from 2 → visits {2}
Provinces = 2
```

## Problem Description

There are `n` cities. Given an `n x n` matrix `isConnected` where `isConnected[i][j]=1` means city i and city j are directly connected. A province is a group of directly or indirectly connected cities. Return the total number of provinces.

**Example:** `isConnected=[[1,1,0],[1,1,0],[0,0,1]]` → `2`

**Constraints:** 1 ≤ n ≤ 200, isConnected[i][i]=1, matrix is symmetric

## 📝 Interview Tips

1. **Clarify**: Is the connection bidirectional? Yes (symmetric matrix). Can there be self-loops? Yes (diagonal=1, ignore).
2. **Approach**: DFS/BFS from each unvisited node. OR Union-Find for elegant O(n²·α) solution.
3. **Edge cases**: n=1 → always 1 province. All disconnected (identity matrix) → n provinces.
4. **Optimize**: Union-Find with path compression is clean and O(n²·α). DFS is simpler to code.
5. **Follow-up**: If given edge list instead of matrix? Same algorithms, just different input parsing.
6. **Complexity**: DFS O(n²) time, O(n) space. Union-Find O(n²·α) time, O(n) space.

## Solutions

```typescript
// Solution 1: DFS on adjacency matrix
// Time: O(n^2) | Space: O(n)
function findCircleNum(isConnected: number[][]): number {
  const n = isConnected.length;
  const visited = new Array(n).fill(false);

  function dfs(city: number): void {
    visited[city] = true;
    for (let neighbor = 0; neighbor < n; neighbor++) {
      if (isConnected[city][neighbor] === 1 && !visited[neighbor]) {
        dfs(neighbor);
      }
    }
  }

  let provinces = 0;
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs(i);
      provinces++;
    }
  }
  return provinces;
}

// Solution 2: Union-Find with path compression + union by rank
// Time: O(n^2 * α(n)) | Space: O(n)
function findCircleNum2(isConnected: number[][]): number {
  const n = isConnected.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);
  let components = n;

  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]); // Path compression
    return parent[x];
  }

  function union(x: number, y: number): void {
    const px = find(x),
      py = find(y);
    if (px === py) return;
    components--;
    if (rank[px] < rank[py]) {
      parent[px] = py;
    } else if (rank[px] > rank[py]) {
      parent[py] = px;
    } else {
      parent[py] = px;
      rank[px]++;
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (isConnected[i][j] === 1) union(i, j);
    }
  }
  return components;
}

// Solution 3: BFS
// Time: O(n^2) | Space: O(n)
function findCircleNum3(isConnected: number[][]): number {
  const n = isConnected.length;
  const visited = new Array(n).fill(false);
  let provinces = 0;

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      provinces++;
      const queue = [i];
      visited[i] = true;
      while (queue.length) {
        const city = queue.shift()!;
        for (let j = 0; j < n; j++) {
          if (isConnected[city][j] === 1 && !visited[j]) {
            visited[j] = true;
            queue.push(j);
          }
        }
      }
    }
  }
  return provinces;
}

// Tests
console.log(
  findCircleNum([
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
  ]),
); // 2
console.log(
  findCircleNum([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]),
); // 3
console.log(
  findCircleNum2([
    [1, 1, 0],
    [1, 1, 1],
    [0, 1, 1],
  ]),
); // 1
console.log(
  findCircleNum3([
    [1, 0, 0, 1],
    [0, 1, 1, 0],
    [0, 1, 1, 1],
    [1, 0, 1, 1],
  ]),
); // 1
```

## 🔗 Related Problems

| Problem                                                                                                                                    | Relationship                    |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| [Number of Connected Components in Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | Same problem, edge list input   |
| [Friend Circles](https://leetcode.com/problems/friend-circles/)                                                                            | Alternate name for same problem |
| [Accounts Merge](https://leetcode.com/problems/accounts-merge/)                                                                            | Union-Find on strings           |
