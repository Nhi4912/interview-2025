---
layout: page
title: "Unique Binary Search Trees II"
difficulty: Medium
category: Tree-Graph
tags: [Dynamic Programming, Backtracking, Tree, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/unique-binary-search-trees-ii"
---

# Unique Binary Search Trees II / Tất Cả BST Duy Nhất II

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Recursion + Memoization
> **Frequency**: 📘 Tier 3 — Gặp ở 6 companies
> **See also**: [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) | [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chọn đội trưởng nhóm rồi chia team — mỗi số i làm root, tất cả số < i tạo nên cây con trái, tất cả số > i tạo nên cây con phải. Ghép từng cặp (left, right) tạo ra 1 cây. Lặp cho mọi i.

**Pattern Recognition:**

- Signal: "generate all structures" + "divide by root choice" → **Recursive tree construction**
- BST property: root i → left ∈ [start, i-1], right ∈ [i+1, end]
- Key insight: với range [start, end], mỗi i trong đó làm root → combine left×right subtrees

**Visual — n=3: tất cả 5 BST:**

```
Root=1:        Root=2:      Root=3:
  1              2              3
   \           /   \           /
    2         1     3         2
     \                       /
      3                     1

1→(null,[2,3])  2→([1],[3])  3→([1,2],null)
= 2 trees       = 1 tree     = 2 trees  → 5 total (Catalan number C3)
```

---

## Problem Description

Cho `n`, tạo ra và trả về **tất cả** các BST có cấu trúc khác nhau chứa các giá trị 1 đến n. ([LeetCode](https://leetcode.com/problems/unique-binary-search-trees-ii))

**Example 1:** n=3 → 5 cây khác nhau (xem visual)

**Example 2:** n=1 → [[1]] (chỉ có 1 cây)

Constraints: `1 <= n <= 8`, số lượng cây là số Catalan Cn

---

## 📝 Interview Tips

1. **Clarify**: "Cần trả về tất cả cây hay chỉ đếm?" / Return all trees or just count? (count-only = problem 96)
2. **Divide**: "Mỗi i từ start..end làm root, đệ quy build left/right" / Each i as root, recurse on left and right ranges
3. **Combine**: "Với mỗi (leftTree, rightTree), tạo node(i) và gắn vào" / Create new root for each (left, right) pair
4. **Memoize**: "Memo theo (start, end) vì ranges tái sử dụng" / Memoize by range [start, end] since subproblems repeat
5. **Edge cases**: "start > end → return [null] (empty subtree, không phải [])" / Base case must return [null], not []
6. **Follow-up**: "Problem 95 = này, problem 96 = đếm bằng Catalan formula" / This vs count-only variant

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
 * Solution 1: Pure Recursion (no memo)
 * Time: O(n * Catalan(n)) — generate all trees
 * Space: O(n * Catalan(n)) — all trees stored
 */
function generateTreesNaive(n: number): Array<TreeNode | null> {
  function generate(start: number, end: number): Array<TreeNode | null> {
    if (start > end) return [null];
    const result: Array<TreeNode | null> = [];
    for (let i = start; i <= end; i++) {
      const leftTrees = generate(start, i - 1);
      const rightTrees = generate(i + 1, end);
      for (const left of leftTrees) {
        for (const right of rightTrees) {
          result.push(new TreeNode(i, left, right));
        }
      }
    }
    return result;
  }
  return generate(1, n);
}

/**
 * Solution 2: Recursion with Memoization
 * Time: O(n * Catalan(n)) — each subproblem computed once
 * Space: O(n² * Catalan(n)) — memo table
 */
function generateTrees(n: number): Array<TreeNode | null> {
  const memo = new Map<string, Array<TreeNode | null>>();

  function generate(start: number, end: number): Array<TreeNode | null> {
    const key = `${start},${end}`;
    if (memo.has(key)) return memo.get(key)!;
    if (start > end) return [null];

    const result: Array<TreeNode | null> = [];
    for (let i = start; i <= end; i++) {
      const leftTrees = generate(start, i - 1);
      const rightTrees = generate(i + 1, end);
      for (const left of leftTrees) {
        for (const right of rightTrees) {
          // Note: for memoized version, we create new nodes to avoid shared references
          result.push(new TreeNode(i, left, right));
        }
      }
    }
    memo.set(key, result);
    return result;
  }
  return generate(1, n);
}

// === Test Cases ===
function countTrees(trees: Array<TreeNode | null>): number {
  return trees.length;
}
function inorder(root: TreeNode | null): number[] {
  if (!root) return [];
  return [...inorder(root.left), root.val, ...inorder(root.right)];
}

console.log(countTrees(generateTrees(1))); // 1
console.log(countTrees(generateTrees(3))); // 5
console.log(countTrees(generateTrees(4))); // 14
// Verify all are valid BSTs
const trees3 = generateTrees(3);
console.log(
  trees3.every((t) => {
    const ord = inorder(t);
    return ord.every((v, i) => i === 0 || ord[i - 1] < v);
  }),
); // true — all inorders are sorted
```

---

## 🔗 Related Problems

- [Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees) — problem 96: chỉ đếm số lượng (Catalan), không cần build
- [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses) — cùng pattern divide-by-operator, collect all results
- [Binary Search Trees](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree) — xây BST từ sorted array
- [Serialize and Deserialize BST](https://leetcode.com/problems/serialize-and-deserialize-bst) — encode/decode BST structure
