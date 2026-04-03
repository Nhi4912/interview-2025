---
layout: page
title: "Two Sum IV - Input is a BST"
difficulty: Easy
category: Tree-Graph
tags: [Hash Table, Two Pointers, Tree, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/two-sum-iv-input-is-a-bst"
---

# Two Sum IV - Input is a BST / Tổng Hai Phần Tử IV - BST

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: HashSet DFS / Two Pointers on BST
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Two Sum](https://leetcode.com/problems/two-sum) | [Two Sum III - Data structure design](https://leetcode.com/problems/two-sum-iii-data-structure-design)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bài này giống Two Sum cổ điển nhưng input là BST thay vì mảng. Có 3 cách:

1. **HashSet + DFS**: duyệt cây, kiểm tra `k - node.val` có trong set chưa → O(n) đơn giản nhất
2. **In-order + Two Pointers**: BST in-order cho mảng sorted → dùng two-pointer L/R → O(n) space
3. **BST Iterator**: dùng two BST iterators (forward + backward) như two-pointer trên BST

**Pattern Recognition:**

- "Find two elements summing to k in BST" → HashSet DFS hoặc sorted array + two pointers
- BST property: in-order traversal cho sorted sequence → two-pointer apply được

**Visual — HashSet DFS vs Two Pointers:**

```
BST:      5
         / \
        3   6
       / \   \
      2   4   7
k = 9

HashSet DFS:
  Visit 5: seen={}, 9-5=4 not in seen → add 5, seen={5}
  Visit 3: 9-3=6 not in seen → add 3, seen={5,3}
  Visit 2: 9-2=7 not in seen → add 2
  Visit 4: 9-4=5 ∈ seen → return true ✓

Two Pointers (in-order = [2,3,4,5,6,7]):
  L=0(2), R=5(7): 2+7=9 == k → true ✓
```

---

## Problem Description

Given the root of a Binary Search Tree and an integer `k`, return `true` if there exist **two different nodes** in the BST such that their values sum to `k`, `false` otherwise.

- `1 ≤ n ≤ 10^4`, `-10^4 ≤ Node.val ≤ 10^4`, `-10^5 ≤ k ≤ 10^5`
- The BST may contain duplicates

```
Example 1: root=[5,3,6,2,4,null,7], k=9 → true  (2+7=9 or 4+5=9)
Example 2: root=[5,3,6,2,4,null,7], k=28 → false  (max sum = 6+7=13)
Example 3: root=[2,1,3], k=4 → true  (1+3=4)
```

---

## 📝 Interview Tips

1. **BST không cần đặc biệt cho HashSet** — Cách 1 hoạt động với bất kỳ binary tree nào / _HashSet approach works for any binary tree — BST property not required_
2. **BST property cho Two Pointers** — In-order BST = sorted array → classic two-pointer O(n) time O(n) space / _BST in-order is sorted → enables O(n) two-pointer after collecting values_
3. **Same node warning** — Không được dùng cùng node hai lần: two-pointer tự tránh (L≠R); HashSet cần cẩn thận nếu có duplicate values (not values ≠ same node) / _Two-pointer naturally avoids same-node; HashSet is safe here since we check complement before adding_
4. **Space trade-off** — HashSet O(n) space; Two Pointers O(n) space for sorted array / _Both O(n) space; BFS iterator approach can achieve O(log n) space for balanced BST_
5. **Follow-up BST iterator** — Dùng stack để iterate BST forward/backward đồng thời: O(log n) space / _BST iterator with stack achieves O(log n) space for balanced BST_
6. **Edge case** — Single node tree → cannot have two different nodes → always false / _n=1 → false; k=2×only_value → still false (need two DIFFERENT nodes)_

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
 * Solution 1: HashSet + DFS
 * Time: O(n) — visit each node once
 * Space: O(n) — set + recursion stack
 * Works for any binary tree, not just BST.
 */
function findTargetHashSet(root: TreeNode | null, k: number): boolean {
  const seen = new Set<number>();

  function dfs(node: TreeNode | null): boolean {
    if (!node) return false;
    if (seen.has(k - node.val)) return true; // complement found!
    seen.add(node.val);
    return dfs(node.left) || dfs(node.right);
  }

  return dfs(root);
}

/**
 * Solution 2: In-order Traversal + Two Pointers
 * Time: O(n) — collect + scan
 * Space: O(n) — sorted array
 * Leverages BST property: in-order gives sorted sequence.
 */
function findTarget(root: TreeNode | null, k: number): boolean {
  // Step 1: collect BST values via in-order (produces sorted array)
  const vals: number[] = [];
  function inorder(node: TreeNode | null): void {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);

  // Step 2: classic two-pointer on sorted array
  let l = 0,
    r = vals.length - 1;
  while (l < r) {
    const sum = vals[l] + vals[r];
    if (sum === k) return true;
    if (sum < k) l++;
    else r--;
  }
  return false;
}

/**
 * Solution 3: BFS + HashSet (iterative, avoids recursion stack overflow)
 * Time: O(n), Space: O(n)
 */
function findTargetBFS(root: TreeNode | null, k: number): boolean {
  if (!root) return false;
  const seen = new Set<number>();
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (seen.has(k - node.val)) return true;
    seen.add(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return false;
}

// === Test Cases ===
function makeTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0]!);
  const q = [root];
  let i = 1;
  while (q.length && i < vals.length) {
    const n = q.shift()!;
    if (i < vals.length && vals[i] !== null) {
      n.left = new TreeNode(vals[i]!);
      q.push(n.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      n.right = new TreeNode(vals[i]!);
      q.push(n.right);
    }
    i++;
  }
  return root;
}

const bst = makeTree([5, 3, 6, 2, 4, null, 7]);
console.log(findTarget(bst, 9)); // true  (2+7 or 4+5)
console.log(findTarget(bst, 28)); // false
console.log(findTarget(makeTree([2, 1, 3]), 4)); // true  (1+3)
console.log(findTarget(makeTree([2, 1, 3]), 1)); // false

console.log(findTargetHashSet(bst, 9)); // true
console.log(findTargetBFS(bst, 9)); // true
```

---

## 🔗 Related Problems

| Problem                                                                                                       | Pattern       | Difficulty |
| ------------------------------------------------------------------------------------------------------------- | ------------- | ---------- |
| [Two Sum](https://leetcode.com/problems/two-sum)                                                              | Hash Map      | Easy       |
| [Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted)          | Two Pointers  | Medium     |
| [Count BST Nodes with Value in Given Range](https://leetcode.com/problems/count-nodes-with-the-highest-score) | BST traversal | Medium     |
| [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst)                  | BST in-order  | Medium     |
