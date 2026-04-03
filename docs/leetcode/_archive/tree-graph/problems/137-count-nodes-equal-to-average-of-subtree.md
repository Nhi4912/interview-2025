---
layout: page
title: "Count Nodes Equal to Average of Subtree"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/count-nodes-equal-to-average-of-subtree"
---

# Count Nodes Equal to Average of Subtree / Đếm Nút Bằng Trung Bình Cây Con

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Post-order DFS

---

## 🧠 Intuition / Tư Duy

**Analogy:** **VI**: Đây là bài toán "thông tin đi lên" — mỗi nút cần biết tổng và số lượng phần tử trong cây con của nó. Dùng DFS hậu thứ tự (post-order): xử lý con trái và con phải trước, rồi gộp kết quả lên nút cha. Tại mỗi nút, kiểm tra `Math.floor(sum / count) === node.val`.

**EN**: Each node needs subtree sum and count — information flows **bottom-up**. Post-order DFS returns `[sum, count]` pairs; at each node check `floor(sum/count) === val`.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Count Nodes Equal to Average of Subtree example:**

```
        4
       / \
      8   5
     / \   \
    0   1   6

DFS post-order:
  node 0: [0,1]
  node 1: [1,1]
  node 8: sum=0+1+8=9, count=3 → avg=3 ≠ 8
  node 6: [6,1]
  node 5: sum=6+5=11, count=2 → avg=5 ≠ 5? wait: floor(11/2)=5 ✓
  node 4: sum=9+11+4=24, count=7 → floor(24/7)=3 ≠ 4
Answer: 1 (only node 5)
```

---

## Problem Description

| #    | Title                           | Difficulty | Pattern             |
| ---- | ------------------------------- | ---------- | ------------------- |
| 543  | Diameter of Binary Tree         | 🟢 Easy    | Post-order DFS      |
| 124  | Binary Tree Maximum Path Sum    | 🔴 Hard    | Post-order DFS      |
| 1448 | Count Good Nodes in Binary Tree | 🟡 Medium  | DFS                 |
| 572  | Subtree of Another Tree         | 🟢 Easy    | DFS + Serialization |

---

## 📝 Interview Tips

- 🇻🇳 Post-order = xử lý con trước, cha sau — luồng thông tin đi từ lá lên gốc.
- 🇬🇧 Post-order DFS: process children first, then use their results at the parent.
- 🇻🇳 Hàm DFS trả về `[sum, count]` — tránh dùng biến global mutable.
- 🇬🇧 Return `[sum, count]` from DFS — avoids mutable global state.
- 🇻🇳 Dùng `Math.floor` để tính trung bình nguyên: `(sum / count) | 0`.
- 🇬🇧 Integer average: `Math.floor(sum / count)` or `(sum / count) | 0`.

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

// ─── Solution 1: Post-order DFS returning [sum, count] ───
// Time: O(n)  Space: O(h) where h = tree height
function averageOfSubtree(root: TreeNode | null): number {
  let count = 0;

  function dfs(node: TreeNode | null): [number, number] {
    if (!node) return [0, 0];
    const [ls, lc] = dfs(node.left);
    const [rs, rc] = dfs(node.right);
    const sum = ls + rs + node.val;
    const total = lc + rc + 1;
    if (Math.floor(sum / total) === node.val) count++;
    return [sum, total];
  }

  dfs(root);
  return count;
}

// ─── Solution 2: Explicit stack post-order (iterative) ───
// Time: O(n)  Space: O(n)
function averageOfSubtree2(root: TreeNode | null): number {
  if (!root) return 0;
  const sumMap = new Map<TreeNode, number>();
  const cntMap = new Map<TreeNode, number>();
  let result = 0;

  const stack: TreeNode[] = [];
  let curr: TreeNode | null = root;
  let lastVisited: TreeNode | null = null;

  while (curr || stack.length) {
    if (curr) {
      stack.push(curr);
      curr = curr.left;
    } else {
      const peek = stack[stack.length - 1];
      if (peek.right && lastVisited !== peek.right) {
        curr = peek.right;
      } else {
        stack.pop();
        const ls = sumMap.get(peek.left!) ?? 0;
        const lc = cntMap.get(peek.left!) ?? 0;
        const rs = sumMap.get(peek.right!) ?? 0;
        const rc = cntMap.get(peek.right!) ?? 0;
        const sum = ls + rs + peek.val;
        const cnt = lc + rc + 1;
        sumMap.set(peek, sum);
        cntMap.set(peek, cnt);
        if (Math.floor(sum / cnt) === peek.val) result++;
        lastVisited = peek;
      }
    }
  }
  return result;
}

// ─── Test helpers ───
function makeTree(vals: (number | null)[]): TreeNode | null {
  if (!vals.length) return null;
  const root = new TreeNode(vals[0] as number);
  const q: TreeNode[] = [root];
  let i = 1;
  while (i < vals.length) {
    const node = q.shift()!;
    if (vals[i] !== null) {
      node.left = new TreeNode(vals[i] as number);
      q.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = new TreeNode(vals[i] as number);
      q.push(node.right);
    }
    i++;
  }
  return root;
}

console.log(averageOfSubtree(makeTree([4, 8, 5, 0, 1, null, 6]))); // 1
console.log(averageOfSubtree(makeTree([1]))); // 1
console.log(averageOfSubtree2(makeTree([4, 8, 5, 0, 1, null, 6]))); // 1
```

---

## 🔗 Related Problems

| #    | Title                           | Difficulty | Pattern             |
| ---- | ------------------------------- | ---------- | ------------------- |
| 543  | Diameter of Binary Tree         | 🟢 Easy    | Post-order DFS      |
| 124  | Binary Tree Maximum Path Sum    | 🔴 Hard    | Post-order DFS      |
| 1448 | Count Good Nodes in Binary Tree | 🟡 Medium  | DFS                 |
| 572  | Subtree of Another Tree         | 🟢 Easy    | DFS + Serialization |
