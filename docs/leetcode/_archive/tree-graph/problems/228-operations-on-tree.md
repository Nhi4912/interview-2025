---
layout: page
title: "Operations on Tree"
difficulty: Medium
category: Tree-Graph
tags: [Array, Hash Table, Tree, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/operations-on-tree"
---

# Operations on Tree / Thao Tác Trên Cây

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Tree simulation
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Employee Importance](https://leetcode.com/problems/employee-importance) | [Smallest Common Region](https://leetcode.com/problems/smallest-common-region)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như hệ thống khóa tòa nhà — mỗi phòng có thể khóa bởi một người. Khóa nâng cấp (upgrade) như trưởng phòng khóa cả tầng: chỉ được dùng khi không có cấp trên nào đã khóa và có ít nhất một phòng con đang khóa.

**Visual — LockingTree operations:**

```
parent = [-1, 0, 0, 1, 1, 2, 2]
Tree:       0
           / \
          1   2
         / \ / \
        3  4 5  6

lock(2, user=1): node 2 not locked → lock(2,1) = true
lock(4, user=2): node 4 not locked → lock(4,2) = true
lock(0, user=3): node 0 not locked → lock(0,3) = true

upgrade(0, user=4):
  - node 0 ALREADY locked by user 3 → false

upgrade(2, user=4):
  - not locked ✓
  - ancestors: 0 (locked!) → false

After unlock(0, user=3): lock released
upgrade(2, user=4):
  - not locked ✓
  - ancestors: 0 (unlocked) ✓
  - descendants: 4 locked ✓
  → lock 2, unlock 4 → true
```

---

## Problem Description

Implement `LockingTree` with operations on a rooted tree (root=0): `lock(num, user)` locks if not locked; `unlock(num, user)` unlocks if owner matches; `upgrade(num, user)` locks node if (1) not locked, (2) no locked ancestors, (3) has ≥1 locked descendant — then unlocks all locked descendants. ([LeetCode 2003](https://leetcode.com/problems/operations-on-tree))

**Example:** parent=[-1,0,0,1,1,2,2]; lock(2,2)→T, lock(4,5)→T, lock(0,3)→T, upgrade(0,3)→F (node 0 locked), upgrade(3,4)→F (no locked descendants).

**Constraints:** 2 ≤ n ≤ 2000, 1 ≤ user ≤ 10⁴, ≤ 2000 calls total.

---

## 📝 Interview Tips

1. **Ancestor check**: Đi từ node lên root theo mảng parent / O(depth) per call.
2. **Descendant check**: DFS từ node xuống lá / Collect locked descendants in DFS.
3. **Upgrade atomicity**: Kiểm tra tất cả điều kiện trước khi thực hiện bất kỳ thay đổi nào / Check all, then act.
4. **Data structure**: Map<node,user> cho locked; children list xây dựng từ parent array / Hash map for locks.
5. **Edge case**: unlock node chưa khóa → false; upgrade node có locked ancestor → false.
6. **Follow-up**: "Nếu n = 10⁵?" / Need more efficient ancestor/descendant queries (Euler tour + segment tree).

---

## Solutions

```typescript
/**
 * Solution: Tree simulation with DFS for upgrade
 * Time per operation:
 *   lock/unlock: O(1)
 *   upgrade: O(n) — ancestor check O(depth) + DFS over subtree O(n)
 * Space: O(n)
 */
class LockingTree {
  private parent: number[];
  private children: number[][];
  private locked: Map<number, number>; // node → user

  constructor(parent: number[]) {
    const n = parent.length;
    this.parent = parent;
    this.children = Array.from({ length: n }, () => []);
    this.locked = new Map();

    for (let i = 1; i < n; i++) {
      this.children[parent[i]].push(i);
    }
  }

  /** Lock node for user if not already locked */
  lock(num: number, user: number): boolean {
    if (this.locked.has(num)) return false;
    this.locked.set(num, user);
    return true;
  }

  /** Unlock node if it's locked by the same user */
  unlock(num: number, user: number): boolean {
    if (this.locked.get(num) !== user) return false;
    this.locked.delete(num);
    return true;
  }

  /**
   * Upgrade: lock num if (1) not locked, (2) no locked ancestors,
   * (3) has ≥1 locked descendant → also unlock all locked descendants.
   */
  upgrade(num: number, user: number): boolean {
    // Condition 1: node must not be locked
    if (this.locked.has(num)) return false;

    // Condition 3: check no locked ancestors (walk up to root)
    let ancestor = this.parent[num];
    while (ancestor !== -1) {
      if (this.locked.has(ancestor)) return false;
      ancestor = this.parent[ancestor];
    }

    // Condition 2: must have at least one locked descendant
    // Collect all locked descendants via DFS
    const lockedDescendants: number[] = [];
    const dfs = (node: number): void => {
      for (const child of this.children[node]) {
        if (this.locked.has(child)) lockedDescendants.push(child);
        dfs(child);
      }
    };
    dfs(num);

    if (lockedDescendants.length === 0) return false;

    // All conditions met: lock num and unlock all locked descendants
    this.locked.set(num, user);
    for (const d of lockedDescendants) this.locked.delete(d);

    return true;
  }
}

// === Test Cases ===
const tree = new LockingTree([-1, 0, 0, 1, 1, 2, 2]);
console.log(tree.lock(2, 2)); // true
console.log(tree.unlock(2, 3)); // false (user 3 ≠ owner 2)
console.log(tree.unlock(2, 2)); // true
console.log(tree.lock(4, 5)); // true
console.log(tree.upgrade(0, 1)); // true (no ancestor, descendant 4 locked)
console.log(tree.lock(0, 1)); // false (already locked by upgrade)

const tree2 = new LockingTree([-1, 0, 0, 1, 1, 2, 2]);
console.log(tree2.lock(2, 2)); // true
console.log(tree2.lock(4, 5)); // true
console.log(tree2.lock(0, 3)); // true
console.log(tree2.upgrade(0, 4)); // false (node 0 is locked)
console.log(tree2.upgrade(3, 4)); // false (no locked descendants of 3)
```

---

## 🔗 Related Problems

| Problem                                                                                                      | Pattern  | Difficulty |
| ------------------------------------------------------------------------------------------------------------ | -------- | ---------- |
| [Employee Importance](https://leetcode.com/problems/employee-importance)                                     | Tree DFS | Medium     |
| [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree)     | Tree BFS | Medium     |
| [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) | Tree BFS | Hard       |
| [Reachable Nodes With Restrictions](https://leetcode.com/problems/reachable-nodes-with-restrictions)         | Tree DFS | Medium     |
| [Operations on Tree — LeetCode](https://leetcode.com/problems/operations-on-tree)                            | —        | Medium     |
