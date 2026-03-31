---
layout: page
title: "Employee Importance"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, Tree, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/employee-importance"
---

# Employee Importance / Tầm Quan Trọng Nhân Viên

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS/DFS on Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Smallest Common Region](https://leetcode.com/problems/smallest-common-region) | [Operations on Tree](https://leetcode.com/problems/operations-on-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy (VI):** Như tính tổng lương của một manager và tất cả cấp dưới của họ. Build map id→employee trước, rồi BFS/DFS từ target để cộng dồn importance.

**Analogy (EN):** Build an id→Employee map for O(1) lookup, then BFS/DFS from the target employee summing importance values, enqueuing all subordinates.

```
employees: [{id:1, imp:5, sub:[2,3]}, {id:2, imp:3, sub:[]}, {id:3, imp:3, sub:[]}]
target: 1

BFS from id=1:
  queue=[1]  sum=0
  pop 1 → sum=5, enqueue [2,3]
  pop 2 → sum=8, enqueue []
  pop 3 → sum=11, enqueue []
  → return 11
```

---

## 📝 Interview Tips

1. **Clarify / Xác nhận**: "subordinates có thể rỗng không?" / Subordinates list may be empty — handle gracefully
2. **Map first / Xây map trước**: Build id→Employee map để lookup O(1) thay vì O(n) mỗi lần / Always build lookup map first
3. **BFS vs DFS**: Cả hai O(n) — BFS dùng queue, DFS dùng recursion / Both equivalent; pick what feels natural
4. **Edge case / Biên**: Employee không có subordinates → chỉ cộng importance của bản thân / Leaf employee: just add its own importance
5. **Follow-up**: "Nếu muốn tính importance của một subtree cụ thể?" → same approach với different root
6. **Space / Bộ nhớ**: Map + queue/stack O(n) — acceptable cho n ≤ 2000

---

## Solutions

```typescript
// Definition for Employee (from LeetCode)
class Employee {
  id: number;
  importance: number;
  subordinates: number[];
  constructor(id: number, importance: number, subordinates: number[]) {
    this.id = id;
    this.importance = importance;
    this.subordinates = subordinates;
  }
}

/**
 * Solution 1: BFS with HashMap
 * Time: O(N) — visit every employee once
 * Space: O(N) — map + queue
 *
 * Build map rồi BFS từ target, cộng dồn importance.
 */
function getImportanceBFS(employees: Employee[], id: number): number {
  const map = new Map<number, Employee>();
  for (const emp of employees) map.set(emp.id, emp);

  let total = 0;
  const queue: number[] = [id];

  while (queue.length > 0) {
    const cur = queue.shift()!;
    const emp = map.get(cur)!;
    total += emp.importance;
    for (const sub of emp.subordinates) queue.push(sub);
  }
  return total;
}

/**
 * Solution 2: DFS Recursive with HashMap
 * Time: O(N) — visit every employee once
 * Space: O(N) — map + recursion stack depth
 *
 * DFS đệ quy — cộng importance của node hiện tại + tổng importance của tất cả sub.
 */
function getImportance(employees: Employee[], id: number): number {
  const map = new Map<number, Employee>();
  for (const emp of employees) map.set(emp.id, emp);

  function dfs(empId: number): number {
    const emp = map.get(empId)!;
    return emp.importance + emp.subordinates.reduce((s, sub) => s + dfs(sub), 0);
  }

  return dfs(id);
}

/**
 * Solution 3: Iterative DFS with Stack
 * Time: O(N) — visit every employee once
 * Space: O(N) — map + explicit stack
 *
 * Stack-based DFS — tránh recursion stack overflow cho cây sâu.
 */
function getImportanceStack(employees: Employee[], id: number): number {
  const map = new Map<number, Employee>();
  for (const emp of employees) map.set(emp.id, emp);

  let total = 0;
  const stack: number[] = [id];

  while (stack.length > 0) {
    const cur = stack.pop()!;
    const emp = map.get(cur)!;
    total += emp.importance;
    for (const sub of emp.subordinates) stack.push(sub);
  }
  return total;
}

// === Test Cases ===
const e1 = [new Employee(1, 5, [2, 3]), new Employee(2, 3, []), new Employee(3, 3, [])];
console.log(getImportance(e1, 1)); // 11
console.log(getImportanceBFS(e1, 1)); // 11
console.log(getImportanceStack(e1, 2)); // 3

const e2 = [new Employee(1, 2, [5]), new Employee(5, -3, [])];
console.log(getImportance(e2, 5)); // -3
console.log(getImportance(e2, 1)); // -1
```

---

## 🔗 Related Problems

| Problem                                                                                                  | Pattern     | Difficulty |
| -------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree) | BFS on Tree | 🟡 Medium  |
| [Operations on Tree](https://leetcode.com/problems/operations-on-tree)                                   | BFS/DFS     | 🟡 Medium  |
| [Smallest Common Region](https://leetcode.com/problems/smallest-common-region)                           | LCA         | 🟡 Medium  |
| [Reachable Nodes With Restrictions](https://leetcode.com/problems/reachable-nodes-with-restrictions)     | BFS         | 🟡 Medium  |
