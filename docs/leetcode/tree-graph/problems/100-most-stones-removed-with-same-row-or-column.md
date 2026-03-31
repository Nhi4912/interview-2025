---
layout: page
title: "Most Stones Removed with Same Row or Column"
difficulty: Medium
category: Tree-Graph
tags: [Hash Table, Depth-First Search, Union Find, Graph]
leetcode_url: "https://leetcode.com/problems/most-stones-removed-with-same-row-or-column"
---

# Most Stones Removed with Same Row or Column / Xóa Nhiều Đá Nhất Cùng Hàng Hoặc Cột

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Union Find
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Giống nhóm bạn trong lớp — bạn A và bạn B ở cùng hàng thì cùng nhóm, bạn B và bạn C cùng cột thì cũng cùng nhóm. Cuối cùng mỗi nhóm n người thì xóa được n-1 người. Tổng đá xóa được = tổng đá - số nhóm (components).

**Pattern Recognition:**

- "Stones share row/column" → connect them → Union Find / DFS
- Key insight: `stones_removed = total - num_components`
- Encode rows and cols as separate IDs (col + offset) to union them together

**Visual:**

```
stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]

Union (0,0)↔(0,1): same row 0  → group {(0,0),(0,1)}
Union (0,0)↔(1,0): same col 0  → group {(0,0),(0,1),(1,0)}
Union (1,0)↔(1,2): same row 1  → group {(0,0),(0,1),(1,0),(1,2)}
Union (1,2)↔(2,2): same col 2  → adds (2,2)
Union (2,1)↔(2,2): same row 2  → adds (2,1)
All 6 stones → 1 component → 6 - 1 = 5 ✅
```

## Problem Description

On a 2D plane, we place `n` stones at integer coordinate points. A stone can be removed if it shares the same row **or** column with at least one other stone. Return the maximum number of stones that can be removed.

**Example 1:** `stones = [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]]` → `5`
**Example 2:** `stones = [[0,0],[0,2],[1,1],[2,0],[2,2]]` → `3`

**Constraints:** `1 <= stones.length <= 1000`, `0 <= xi, yi <= 10^4`, all stone positions are unique.

## 📝 Interview Tips

1. **Clarify**: Hỏi rõ "xóa" có nghĩa gì? (phải còn ít nhất 1 đá cùng hàng/cột) / Confirm removal condition clearly.
2. **Approach**: Nhận ra bài này là "đếm components" — Union Find hoặc DFS đều được / Recognize connected-components pattern.
3. **Edge cases**: 1 viên đá → 0; mọi đá riêng biệt không cùng hàng/cột → 0 / Single stone or no shared rows/cols.
4. **Optimize**: Union Find với path compression gần O(n); encode col=c+10001 để tránh trùng với row index / Use offset to distinguish row vs col IDs.
5. **Test**: Kiểm tra từng nhóm riêng lẻ, đảm bảo đếm đúng số roots / Verify root count per component.
6. **Follow-up**: Nếu cần biết đá nào bị xóa theo thứ tự? / What if we need the actual removal order?

## Solutions

```typescript
/** Solution 1: Union Find (Optimal)
 * Time: O(n·α(n)) | Space: O(n)
 * Encode col c as c+10001 so row IDs and col IDs never collide
 */
function removeStones(stones: number[][]): number {
  const parent = new Map<number, number>();

  function find(x: number): number {
    if (!parent.has(x)) parent.set(x, x);
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
    return parent.get(x)!;
  }

  function union(a: number, b: number): void {
    const ra = find(a),
      rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  }

  for (const [r, c] of stones) {
    union(r, c + 10001);
  }

  // Count distinct roots among actual stone positions
  const roots = new Set<number>();
  for (const [r] of stones) {
    roots.add(find(r));
  }

  return stones.length - roots.size;
}

/** Solution 2: DFS on adjacency (brute force O(n²))
 * Time: O(n²) | Space: O(n)
 */
function removeStonesDFS(stones: number[][]): number {
  const n = stones.length;
  const visited = new Array(n).fill(false);
  let components = 0;

  function dfs(i: number): void {
    visited[i] = true;
    for (let j = 0; j < n; j++) {
      if (!visited[j] && (stones[i][0] === stones[j][0] || stones[i][1] === stones[j][1])) {
        dfs(j);
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs(i);
      components++;
    }
  }

  return n - components;
}

// Test cases
console.log(
  removeStones([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1],
    [2, 2],
  ]),
); // 5
console.log(
  removeStones([
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ]),
); // 3
console.log(removeStones([[0, 0]])); // 0

console.log(
  removeStonesDFS([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1],
    [2, 2],
  ]),
); // 5
console.log(
  removeStonesDFS([
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ]),
); // 3
```

## 🔗 Related Problems

| Problem                                                                          | Relationship                                               |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Number of Islands](https://leetcode.com/problems/number-of-islands)             | Đếm thành phần liên thông tương tự                         |
| [Minimize Malware Spread](https://leetcode.com/problems/minimize-malware-spread) | Union Find để nhóm nodes                                   |
| [Accounts Merge](https://leetcode.com/problems/accounts-merge)                   | Union Find với string keys, cùng kiểu "group by attribute" |
