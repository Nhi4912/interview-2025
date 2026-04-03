---
layout: page
title: "Nested List Weight Sum"
difficulty: Medium
category: Tree-Graph
tags: [Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/nested-list-weight-sum"
---

# Nested List Weight Sum / Tổng Có Trọng Số Của Danh Sách Lồng Nhau

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS / BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 4 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Nested List Weight Sum II](https://leetcode.com/problems/nested-list-weight-sum-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như tính giá trị phần thưởng theo tầng lớp — phần thưởng ở tầng sâu hơn có giá trị nhân nhiều hơn. Mỗi integer nhân với độ sâu (depth) của nó.

**Pattern Recognition:**

- Signal: "nested structure" + "depth-weighted sum" → **DFS/BFS theo tầng**
- DFS: truyền depth vào đệ quy, cộng `val * depth` khi gặp integer
- BFS: mỗi level là một depth, nhân tổng values ở level đó với depth tương ứng

**Visual — Nested List Weight Sum:**

```
[[1,1],2,[1,1]]  depths:
  1,1 → depth 2     1*2 + 1*2 = 4
  2   → depth 1     2*1       = 2
  1,1 → depth 2     1*2 + 1*2 = 4
                   Total = 10

[1,[4,[6]]]
  1       → depth 1 = 1
  4       → depth 2 = 8
  6       → depth 3 = 18
           Total = 27
```

---

## Problem Description

Given a nested list of integers, return the sum of all integers weighted by their depth. ([LeetCode #339](https://leetcode.com/problems/nested-list-weight-sum))

Each element is either an integer or a list whose elements may also be integers or other lists. The depth of an integer is the number of lists it is inside.

**Example 1:** `[[1,1],2,[1,1]]` → `10` (four 1s at depth 2, one 2 at depth 1)
**Example 2:** `[1,[4,[6]]]` → `27` (1×1 + 4×2 + 6×3)

---

## 📝 Interview Tips

1. **Clarify**: "Depth bắt đầu từ 1 hay 0? List rỗng trả về 0 không?" / Does depth start at 1? Empty list returns 0?
2. **DFS approach**: "Đệ quy với tham số depth, tăng depth mỗi khi vào list con" / Recurse with depth param, increment for nested lists
3. **BFS approach**: "Dùng queue với level-order, depth = current level number" / BFS level = depth
4. **Interface**: "NestedInteger có isInteger(), getInteger(), getList()" / Use the provided NestedInteger interface
5. **Edge cases**: "List rỗng `[]`, chỉ có integers, lồng sâu nhiều tầng" / Empty list, all integers, deeply nested
6. **Follow-up**: "Nested List Weight Sum II — reverse weighting (sâu hơn = nhẹ hơn)" / Reverse depth weighting variant

---

## Solutions

```typescript
// NestedInteger interface (provided by LeetCode)
interface NestedInteger {
  isInteger(): boolean;
  getInteger(): number | null;
  getList(): NestedInteger[];
}

/**
 * Solution 1: DFS Recursive
 * Time: O(N) — visit every integer once
 * Space: O(D) — recursion depth D = max nesting depth
 */
function depthSumDFS(nestedList: NestedInteger[]): number {
  function dfs(list: NestedInteger[], depth: number): number {
    let total = 0;
    for (const item of list) {
      if (item.isInteger()) {
        total += (item.getInteger() ?? 0) * depth;
      } else {
        total += dfs(item.getList(), depth + 1);
      }
    }
    return total;
  }
  return dfs(nestedList, 1);
}

/**
 * Solution 2: BFS Level-by-Level
 * Time: O(N) — process each element once
 * Space: O(W) — W = max width of any level
 */
function depthSum(nestedList: NestedInteger[]): number {
  let queue: NestedInteger[] = [...nestedList];
  let depth = 1;
  let total = 0;

  while (queue.length > 0) {
    const next: NestedInteger[] = [];
    for (const item of queue) {
      if (item.isInteger()) {
        total += (item.getInteger() ?? 0) * depth;
      } else {
        next.push(...item.getList());
      }
    }
    queue = next;
    depth++;
  }

  return total;
}

// === Minimal test harness ===
function makeInt(n: number): NestedInteger {
  return { isInteger: () => true, getInteger: () => n, getList: () => [] };
}
function makeList(items: NestedInteger[]): NestedInteger {
  return { isInteger: () => false, getInteger: () => null, getList: () => items };
}

// [[1,1],2,[1,1]] → 10
const list1 = [makeList([makeInt(1), makeInt(1)]), makeInt(2), makeList([makeInt(1), makeInt(1)])];
console.log(depthSum(list1)); // 10
console.log(depthSumDFS(list1)); // 10

// [1,[4,[6]]] → 27
const list2 = [makeInt(1), makeList([makeInt(4), makeList([makeInt(6)])])];
console.log(depthSum(list2)); // 27
console.log(depthSumDFS(list2)); // 27
```

---

## 🔗 Related Problems

| Problem                                                                                                | Difficulty | Pattern           |
| ------------------------------------------------------------------------------------------------------ | ---------- | ----------------- |
| [Nested List Weight Sum II](https://leetcode.com/problems/nested-list-weight-sum-ii)                   | 🟡 Medium  | DFS reverse depth |
| [Flatten Nested List Iterator](https://leetcode.com/problems/flatten-nested-list-iterator)             | 🟡 Medium  | Stack/DFS         |
| [Mini Parser](https://leetcode.com/problems/mini-parser)                                               | 🟡 Medium  | Stack parsing     |
| [Depth of BST Given Insertion Order](https://leetcode.com/problems/depth-of-bst-given-insertion-order) | 🟡 Medium  | BST depth         |
