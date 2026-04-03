---
layout: page
title: "Nested List Weight Sum II"
difficulty: Medium
category: Tree-Graph
tags: [Stack, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/nested-list-weight-sum-ii"
---

# Nested List Weight Sum II / Tổng Có Trọng Số Danh Sách Lồng Nhau II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Course Schedule](https://leetcode.com/problems/course-schedule) | [Evaluate Division](https://leetcode.com/problems/evaluate-division)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống như tầng hầm của toà nhà — tầng nào càng sâu thì càng xa mặt đất, nhưng ở bài này trọng số lại **tính từ dưới lên**: tầng sâu nhất được trọng số 1, tầng trên cùng có trọng số lớn nhất. Như tiền lương: nhân viên cấp thấp (lá) lại được thưởng nhiều hơn sếp (gốc).

**Pattern Recognition:**

- Signal: "nested list" + "depth-based weight reversed" → **BFS level tracking** hoặc **two-pass DFS**
- Key insight: weight = (maxDepth − depth + 1), nên cần biết maxDepth trước hoặc dùng trick tích lũy BFS

**Visual — Nested List Weight Sum II example:**

```
Input: [[1,1],2,[1,1]]   maxDepth=2

Depth 1: 2         → weight = 2-1+1 = 2  → 2×2 = 4
Depth 2: 1,1,1,1   → weight = 2-2+1 = 1  → 4×1 = 4
Total = 8

BFS trick: accumulate unweightedSum each level
level 1: sum=2,   runSum=2
level 2: sum=4,   runSum=2+4=6 (but already counted 2)
result = 2 + 4 = 6? No → use running trick:
  ans += levelSum each round; at end ans = sum*(maxDepth+1) - weighted
```

---

## 📝 Problem Description

Given a nested list of integers where each element is either an integer or a list of integers (possibly nested), return the **inverse depth sum**: integers at deeper depth have **lower** weight. Weight = `maxDepth − depth + 1`.

**Example 1:** `[[1,1],2,[1,1]]` → `8` (depth-1 items ×2, depth-2 items ×1)
**Example 2:** `[1,[4,[6]]]` → `17` (1×3 + 4×2 + 6×1 = 17)

Constraints: `1 ≤ nestedList.length ≤ 50`, values in `[-100, 100]`, nesting depth ≤ 50.

---

## 🎯 Interview Tips

1. **Clarify weight direction** / Xác nhận trọng số tính từ trên hay dưới — đây là **ngược** với bài I
2. **BFS trick** — accumulate runningSum each level avoids needing maxDepth up front / Trick BFS tránh cần tìm maxDepth trước
3. **Two-pass DFS** is also valid / DFS 2 lần: lần 1 tìm maxDepth, lần 2 tính tổng
4. **Edge cases**: single integer at top level, all same depth / List chỉ có 1 phần tử số nguyên
5. **Negative values** are valid and must be handled correctly / Giá trị âm hợp lệ, cẩn thận khi so sánh
6. **Space**: BFS uses O(N) queue; DFS uses O(depth) stack / BFS dùng O(N) queue; DFS dùng O(depth) stack

---

## 💡 Solutions

### Approach 1: Two-Pass DFS — Find maxDepth then compute

/\*_ @complexity Time: O(N) | Space: O(D) where D = max depth _/

```typescript
interface NestedInteger {
  isInteger(): boolean;
  getInteger(): number | null;
  getList(): NestedInteger[];
}

function depthSumInverse1(nestedList: NestedInteger[]): number {
  function maxDepth(list: NestedInteger[], depth: number): number {
    let max = depth;
    for (const item of list)
      if (!item.isInteger()) max = Math.max(max, maxDepth(item.getList(), depth + 1));
    return max;
  }
  const md = maxDepth(nestedList, 1);
  function dfs(list: NestedInteger[], depth: number): number {
    let sum = 0;
    for (const item of list)
      sum += item.isInteger() ? (item.getInteger() ?? 0) * (md - depth + 1) : dfs(item.getList(), depth + 1);
    return sum;
  }
  return dfs(nestedList, 1);
}
```

### Approach 2: BFS Running Sum — Optimal single pass

/\*_ @complexity Time: O(N) | Space: O(N) _/

```typescript
function depthSumInverse(nestedList: NestedInteger[]): number {
  // Each level: add levelSum to runningSum, then add runningSum to ans.
  // Result: depth-1 integers counted maxDepth times, depth-2 counted (maxDepth-1) times, etc.
  let ans = 0,
    runningSum = 0;
  let queue: NestedInteger[] = [...nestedList];
  while (queue.length > 0) {
    const next: NestedInteger[] = [];
    let levelSum = 0;
    for (const item of queue) {
      if (item.isInteger()) levelSum += item.getInteger() ?? 0;
      else next.push(...item.getList());
    }
    runningSum += levelSum;
    ans += runningSum;
    queue = next;
  }
  return ans;
}
```

---

## 🧪 Test Cases

```typescript
// Mock NestedInteger for testing
class NI implements NestedInteger {
  private v: number | null;
  private l: NestedInteger[] = [];
  constructor(v?: number) {
    this.v = v ?? null;
  }
  isInteger() {
    return this.v !== null;
  }
  getInteger() {
    return this.v;
  }
  getList() {
    return this.l;
  }
  add(ni: NestedInteger) {
    this.l.push(ni);
    return this;
  }
}
// [[1,1],2,[1,1]] → 8
const t1 = [
  new NI().add(new NI(1)).add(new NI(1)),
  new NI(2),
  new NI().add(new NI(1)).add(new NI(1)),
];
console.log(depthSumInverse(t1)); // → 8
// [1,[4,[6]]] → 17
const t2 = [new NI(1), new NI().add(new NI(4)).add(new NI().add(new NI(6)))];
console.log(depthSumInverse(t2)); // → 17
console.log(depthSumInverse([new NI(5)])); // → 5 (single element)
```

---

## Related Problems

| Problem                                                                                              | Difficulty | Pattern   |
| ---------------------------------------------------------------------------------------------------- | ---------- | --------- |
| [Nested List Weight Sum](https://leetcode.com/problems/nested-list-weight-sum)                       | Easy       | DFS       |
| [Flatten Nested List Iterator](https://leetcode.com/problems/flatten-nested-list-iterator)           | Medium     | Stack/DFS |
| [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal) | Medium     | BFS       |
