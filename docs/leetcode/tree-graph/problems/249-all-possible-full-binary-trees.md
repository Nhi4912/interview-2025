---
layout: page
title: "All Possible Full Binary Trees"
difficulty: Medium
category: Tree & Graph
tags: [Dynamic Programming, Tree, Recursion, Memoization, Binary Tree]
leetcode_url: "https://leetcode.com/problems/all-possible-full-binary-trees"
---

# All Possible Full Binary Trees / Tất Cả Cây Nhị Phân Đầy Có Thể

> **Track**: Tree & Graph | **Difficulty**: 🟡 Medium | **Pattern**: Divide & Conquer + Memoization
> **Frequency**: 📘 Tier 3 — Gặp ở Amazon, Google
> **See also**: [Unique Binary Search Trees II](https://leetcode.com/problems/unique-binary-search-trees-ii) | [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses)

---

## Vietnamese Analogy (Ví dụ thực tế)

Hãy tưởng tượng bạn đang xây các tòa nhà đối xứng từ những viên gạch. Một "cây nhị phân đầy" giống như một tòa nhà mà mỗi tầng hoặc có đúng 2 cột con hoặc không có cột nào (lá). Cho trước n viên gạch, bạn phân chia: 1 viên cho mái (root), còn lại chia đôi cho cánh trái và phải. Vì phân đôi chỉ khả thi khi n lẻ, ta chỉ cần thử các cách chia (1,n-2), (3,n-4), ... — memoize để tránh tính lại.

## Visual (Minh họa trực quan)

```
n=7: need 7 nodes, all full binary trees

Split possibilities (left_nodes, right_nodes):
  (1, 5): root + 1-node left + 5-node right
  (3, 3): root + 3-node left + 3-node right
  (5, 1): root + 5-node left + 1-node right

For n=3: only (1,1) → one tree:
    *
   / \
  *   *

For n=5: splits (1,3) and (3,1) → two trees:
    *         *
   / \       / \
  *   *     *   *
     / \   / \
    *   * *   *

n=7: |FBT(1)|*|FBT(5)| + |FBT(3)|*|FBT(3)| + |FBT(5)|*|FBT(1)|
   =  1*2  +  1*1  +  2*1  = 5 trees total
```

## Problem (Bài toán)

Given an integer `n`, return a list of all possible **full binary trees** with exactly `n` nodes. A full binary tree is a binary tree where every node has either 0 or 2 children. Each node value should be `0`. Return the list in any order.

**Example 1:** `n=7` → list of 5 structurally distinct full binary trees
**Example 2:** `n=3` → `[[0,0,0]]` (one tree: root with two leaf children)
**Example 3:** `n=1` → `[[0]]` (single root node)

**Constraints:** `1 ≤ n ≤ 20`, if n is even → return `[]` (impossible)

## Tips (Mẹo phỏng vấn)

- **Only odd n is valid** / Chỉ n lẻ mới hợp lệ: Full binary tree luôn có số node lẻ — nếu n chẵn return `[]` ngay
- **Divide and conquer** / Chia để trị: Root chiếm 1 node, chia i node bên trái và (n-1-i) bên phải với i lẻ từ 1 đến n-2
- **Memoize by n** / Ghi nhớ theo n: `Map<number, TreeNode[]>` lưu kết quả theo n tránh tính lại các cây con
- **Create new nodes** / Tạo node mới: Mỗi combination (left, right) cần tạo node root mới — không tái sử dụng tránh sharing reference
- **Catalan number growth** / Tăng trưởng Catalan: Số cây tăng nhanh theo số Catalan — với n=19 có 1430 cây
- **Base case n=1** / Base case n=1: Trả về `[new TreeNode(0)]` — chỉ 1 lá duy nhất

## Solution 1 - Recursive without Memoization

```typescript
/**
 * @complexity Time: O(2^n) | Space: O(2^n) output size
 * Pure recursion: for each valid left size i, pair with all (n-1-i) right trees
 */
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

function allPossibleFBT(n: number): TreeNode[] {
  if (n % 2 === 0) return [];
  if (n === 1) return [new TreeNode(0)];
  const result: TreeNode[] = [];
  for (let left = 1; left < n - 1; left += 2) {
    const right = n - 1 - left;
    for (const l of allPossibleFBT(left)) {
      for (const r of allPossibleFBT(right)) {
        result.push(new TreeNode(0, l, r));
      }
    }
  }
  return result;
}
```

## Solution 2 - Memoized Recursion (Optimal)

```typescript
/**
 * @complexity Time: O(2^n) output bounded | Space: O(2^n) memo + output
 * Memoize results per n; avoid recomputing same subtree structures
 */
function allPossibleFBTMemo(n: number): TreeNode[] {
  const memo = new Map<number, TreeNode[]>();

  function dp(k: number): TreeNode[] {
    if (memo.has(k)) return memo.get(k)!;
    if (k % 2 === 0) return [];
    if (k === 1) return [new TreeNode(0)];

    const result: TreeNode[] = [];
    for (let left = 1; left < k - 1; left += 2) {
      const right = k - 1 - left;
      for (const l of dp(left)) {
        for (const r of dp(right)) {
          // Create fresh root each time to avoid sharing subtree refs
          result.push(new TreeNode(0, l, r));
        }
      }
    }
    memo.set(k, result);
    return result;
  }

  return dp(n);
}
```

## Test Cases

```typescript
console.log(allPossibleFBTMemo(1).length); // → 1
console.log(allPossibleFBTMemo(3).length); // → 1
console.log(allPossibleFBTMemo(5).length); // → 2
console.log(allPossibleFBTMemo(7).length); // → 5
console.log(allPossibleFBTMemo(2).length); // → 0 (even n)
console.log(allPossibleFBT(7).length); // → 5
// Verify structure: each tree has exactly n=7 nodes
function countNodes(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}
console.log(allPossibleFBTMemo(7).every((t) => countNodes(t) === 7)); // → true
```

## Related Problems

| Problem                           | Difficulty | Link                                                                      |
| --------------------------------- | ---------- | ------------------------------------------------------------------------- |
| Unique Binary Search Trees II     | Medium     | [LC 95](https://leetcode.com/problems/unique-binary-search-trees-ii)      |
| Different Ways to Add Parentheses | Medium     | [LC 241](https://leetcode.com/problems/different-ways-to-add-parentheses) |
| Count Complete Tree Nodes         | Easy       | [LC 222](https://leetcode.com/problems/count-complete-tree-nodes)         |
