---
layout: page
title: "Make Costs of Paths Equal in a Binary Tree"
difficulty: Medium
category: Tree-Graph
tags: [Array, Dynamic Programming, Greedy, Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/make-costs-of-paths-equal-in-a-binary-tree"
---

# Make Costs of Paths Equal in a Binary Tree / Làm Cho Chi Phí Các Đường Đi Bằng Nhau Trong Cây Nhị Phân

🟡 Medium | Greedy | Bottom-Up Tree

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Giống như cân bằng hai chậu cân ở cuối mỗi nhánh cây — nếu nhánh trái nặng hơn nhánh phải, thêm vào nhánh phải (tăng chi phí cha). Làm từ **dưới lên**, bù đắp sự chênh lệch tại mỗi cặp anh-em.

```
Perfect binary tree with cost array (1-indexed BFS order):
         1(cost[0])
        / \
    2(c[1]) 3(c[2])
   / \       / \
  4   5     6   7

At level: equalize costs of siblings by adding diff to their parent.
```

**Key insight:** Process tree bottom-up level by level. For each pair of sibling leaves/nodes, the difference in their path costs must be added to their parent. Sum all these additions.

## Problem Description

Given a perfect binary tree with `n` nodes (1-indexed, BFS order), and array `cost` where `cost[i]` is the cost of the `i`-th node. Add non-negative values to any node costs so all root-to-leaf paths have equal cost. Return minimum total increase.

**Example 1:**

- Input: `n=7, cost=[1,5,2,2,3,3,1]`
- Output: `6`

**Example 2:**

- Input: `n=3, cost=[5,3,3]`
- Output: `0`

## 📝 Interview Tips

- **Q: Why bottom-up? / Tại sao đi từ dưới lên?**
  - A: We equalize siblings first, then propagate differences upward / Cân bằng anh-em trước, truyền chênh lệch lên trên.
- **Q: Which node gets the addition? / Node nào được thêm?**
  - A: The smaller sibling or their parent — either way adds to all ancestor paths / Node nhỏ hơn hoặc cha chúng.
- **Q: Why does greedy work? / Tại sao tham lam hoạt động?**
  - A: Adding to parent is equivalent to adding to both children paths — handles both paths simultaneously / Thêm vào cha tương đương thêm vào cả hai đường con.
- **Q: Time complexity? / Độ phức tạp?**
  - A: O(n) — process each node once / O(n) — xử lý mỗi node một lần.
- **Q: How navigate parent in 1-indexed BFS tree? / Tìm cha trong cây BFS 1-indexed?**
  - A: Parent of node `i` is `i/2` (1-indexed) / Cha của node `i` là `i/2`.
- **Q: What if tree has only root? / Nếu cây chỉ có gốc?**
  - A: Zero additions needed / Không cần thêm gì.

## Solutions

### Solution 1: Bottom-Up Greedy (Level by Level)

```typescript
/**
 * Minimum additions to equalize root-to-leaf path costs.
 * Time: O(n)  Space: O(1)
 */
function minIncrements(n: number, cost: number[]): number {
  let result = 0;

  // Process pairs of siblings bottom-up (1-indexed, but cost is 0-indexed)
  // Children of node i (1-indexed) are 2i and 2i+1
  // Process from last internal node up to root
  for (let i = n - 1; i >= 2; i -= 2) {
    // i and i-1 are siblings (when i is odd, i and i+1; when i is even, i and i-1)
    // Since n is always 2^k - 1 (perfect binary tree), siblings are (2k, 2k+1)
    // cost is 0-indexed, node i (1-indexed) → cost[i-1]
    const diff = Math.abs(cost[i - 1] - cost[i - 2]);
    result += diff;
    // Add diff to parent (propagate to parent's cost)
    const parentIdx = Math.floor(i / 2) - 1; // 0-indexed
    cost[parentIdx] += Math.max(cost[i - 1], cost[i - 2]);
    // Actually we just need to track the max going up
  }
  return result;
}

// Better implementation: accumulate max child cost into parent
function minIncrements2(n: number, cost: number[]): number {
  let result = 0;
  // Process siblings pairs from bottom of tree upward
  // In a perfect binary tree with 1-indexed nodes:
  // last leaf pair: (n-1, n) in 1-indexed → (n-2, n-1) in 0-indexed
  for (let i = n - 1; i > 0; i -= 2) {
    // siblings at 0-indexed positions (i-1) and (i) [i is odd in 1-indexed]
    const left = cost[i - 1],
      right = cost[i];
    result += Math.abs(left - right);
    // Parent gets the max (we equalize by setting both to max, cost to parent unchanged)
    const parentZeroIdx = Math.floor((i - 1) / 2) - 1 + 1; // = Math.floor(i/2) - 1
    const parentIdx = Math.floor(i / 2) - 1;
    if (parentIdx >= 0) cost[parentIdx] += Math.max(left, right);
  }
  return result;
}

// Tests
console.log(minIncrements2(7, [1, 5, 2, 2, 3, 3, 1])); // 6
console.log(minIncrements2(3, [5, 3, 3])); // 0
console.log(minIncrements2(7, [4, 9, 7, 5, 6, 1, 3])); // 8
```

### Solution 2: Recursive DFS Returning Subtree Path Cost

```typescript
/**
 * Equalize paths using DFS, return max path cost of subtree.
 * Time: O(n)  Space: O(log n) call stack
 */
function minIncrementsRecursive(n: number, cost: number[]): number {
  let result = 0;

  // Returns max root-to-leaf cost from this subtree
  function dfs(node: number): number {
    // node is 1-indexed; leaf if 2*node > n
    if (2 * node > n) return cost[node - 1];

    const leftCost = dfs(2 * node);
    const rightCost = dfs(2 * node + 1);

    result += Math.abs(leftCost - rightCost);
    return cost[node - 1] + Math.max(leftCost, rightCost);
  }

  dfs(1);
  return result;
}

// Tests
console.log(minIncrementsRecursive(7, [1, 5, 2, 2, 3, 3, 1])); // 6
console.log(minIncrementsRecursive(3, [5, 3, 3])); // 0
console.log(minIncrementsRecursive(7, [4, 9, 7, 5, 6, 1, 3])); // 8
```

## 🔗 Related Problems

| #    | Problem                               | Difficulty | Key Concept    |
| ---- | ------------------------------------- | ---------- | -------------- |
| 124  | Binary Tree Maximum Path Sum          | Hard       | Tree DFS       |
| 543  | Diameter of Binary Tree               | Easy       | DFS Post-order |
| 2264 | Largest 3-Same-Digit Number in String | Easy       | Greedy         |
| 2581 | Count Number of Possible Root Counts  | Hard       | Tree Rerooting |
