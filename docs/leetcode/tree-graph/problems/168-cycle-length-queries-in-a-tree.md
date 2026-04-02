---
layout: page
title: "Cycle Length Queries in a Tree"
difficulty: Hard
category: Tree-Graph
tags: [Array, Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/cycle-length-queries-in-a-tree"
---

# Cycle Length Queries in a Tree / Truy vấn độ dài chu trình trong cây

---

## 🧠 Intuition / Tư Duy

**Analogy:** **Vietnamese:** Trong cây nhị phân hoàn chỉnh (đánh số 1..2^n-1), cha của nút `x` luôn là `x >> 1`. Để tìm LCA của hai nút, chia đôi nút lớn hơn cho đến khi chúng bằng nhau. Độ dài chu trình = (khoảng cách từ a đến LCA) + (khoảng cách từ b đến LCA) + 1.

**English:** In a 1-indexed complete binary tree, `parent(x) = x >> 1`. To find LCA of (a,b): repeatedly halve the larger node until a == b. The cycle length = steps taken to reach LCA from both sides + 1 (for the added edge).

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Cycle Length Queries in a Tree example:**

```
n=3 tree (7 nodes): 1-indexed
        1
      /   \
     2     3
    / \   / \
   4   5 6   7

Query (4, 7):
  a=4, b=7:  b>a → b=7>>1=3
  a=4, b=3:  a>b → a=4>>1=2, steps=2
  a=2, b=3:  b>a → b=3>>1=1, steps=3
  a=2, b=1:  a>b → a=2>>1=1, steps=4
  a=1==b=1   LCA found in 4 steps → cycle length = 4+1 = 5
```

---

---

## Problem Description

| #    | Problem                                  | Difficulty | Pattern            |
| ---- | ---------------------------------------- | ---------- | ------------------ |
| 236  | Lowest Common Ancestor of Binary Tree    | Medium     | DFS / LCA          |
| 1123 | Lowest Common Ancestor of Deepest Leaves | Medium     | LCA                |
| 2509 | Cycle Length Queries (this)              | Hard       | LCA in Complete BT |

---

## 📝 Interview Tips

- 🔑 **Key insight / Nhận xét chính:** `parent(x) = x >> 1` in a complete binary tree. LCA is found when both nodes are equal.
- 📊 **Count steps / Đếm bước:** Each halving = moving up one level. Total steps across both nodes = path length; add 1 for the virtual edge.
- ⚡ **No extra space / Không cần thêm bộ nhớ:** Process each query in O(log n) with just two pointers.
- 🎯 **Cycle length formula / Công thức:** `distance(a, LCA) + distance(b, LCA) + 1`.
- 🧩 **a == b edge case / a = b:** LCA is the node itself; cycle length = 1 (self-loop by adding edge a-b).
- 📏 **Complexity / Độ phức tạp:** O(q × n) time where n is tree height (O(log(2^n))=n), O(1) extra space per query.

---

---

## Solutions

```typescript
/**
 * For each query [a,b], find LCA by repeatedly halving the larger node.
 * Cycle length = total steps to reach LCA from both + 1.
 *
 * Time:  O(q * n)  where n is number of levels
 * Space: O(q) for output
 */
function cycleLengthQueries(n: number, queries: number[][]): number[] {
  return queries.map(([a, b]) => {
    let steps = 1; // +1 for the added edge a-b
    while (a !== b) {
      if (a > b) a >>= 1;
      else b >>= 1;
      steps++;
    }
    return steps;
  });
}

console.log(
  cycleLengthQueries(3, [
    [5, 3],
    [4, 7],
    [2, 3],
  ]),
);
// [4, 5, 3]
console.log(cycleLengthQueries(2, [[1, 2]]));
// [2]  (1 → 2, add edge → cycle length 2)
console.log(cycleLengthQueries(4, [[7, 11]]));
// [5]

/**
 * Collect ancestors of a into a Set, then walk b up until hitting a known ancestor.
 * More explicit but uses O(n) space per query.
 *
 * Time:  O(q * n)
 * Space: O(n) per query
 */
function cycleLengthQueries2(n: number, queries: number[][]): number[] {
  return queries.map(([a, b]) => {
    const ancestorsA = new Set<number>();
    let x = a;
    while (x >= 1) {
      ancestorsA.add(x);
      x >>= 1;
    }

    let steps = 0;
    let depthB = 0;
    let y = b;
    while (!ancestorsA.has(y)) {
      y >>= 1;
      depthB++;
    }
    // depthB = distance from b to LCA
    // now compute distance from a to LCA
    let depthA = 0;
    let z = a;
    while (z !== y) {
      z >>= 1;
      depthA++;
    }
    return depthA + depthB + 1;
  });
}

console.log(
  cycleLengthQueries2(3, [
    [5, 3],
    [4, 7],
    [2, 3],
  ]),
); // [4, 5, 3]
```

---

## 🔗 Related Problems

| #    | Problem                                  | Difficulty | Pattern            |
| ---- | ---------------------------------------- | ---------- | ------------------ |
| 236  | Lowest Common Ancestor of Binary Tree    | Medium     | DFS / LCA          |
| 1123 | Lowest Common Ancestor of Deepest Leaves | Medium     | LCA                |
| 2509 | Cycle Length Queries (this)              | Hard       | LCA in Complete BT |
