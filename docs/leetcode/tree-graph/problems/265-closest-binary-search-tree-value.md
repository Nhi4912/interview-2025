---
layout: page
title: "Closest Binary Search Tree Value"
difficulty: Easy
category: Tree-Graph
tags: [Binary Search, Tree, Depth-First Search, Binary Search Tree, Binary Tree]
leetcode_url: "https://leetcode.com/problems/closest-binary-search-tree-value"
---

# Closest Binary Search Tree Value / Giá Trị Gần Nhất Trong BST

> **Track**: Tree-Graph | **Difficulty**: 🟢 Easy | **Pattern**: BST Iterative Search — Track Best
> **Frequency**: 📘 Tier 3 — Gặp ở Facebook, Microsoft
> **See also**: [272 Closest BST Value II](https://leetcode.com/problems/closest-binary-search-tree-value-ii) | [700 Search in a BST](https://leetcode.com/problems/search-in-a-binary-search-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đang tìm kiếm một con số trong kho lưu trữ được sắp xếp theo cấu trúc cây nhị phân — giống như tra từ điển nhưng theo dạng nhánh cây. Ở mỗi ngã rẽ, bạn so sánh target với giá trị của nút: nếu target nhỏ hơn, đi trái; lớn hơn, đi phải. Trong suốt hành trình, bạn luôn ghi nhớ "con số gần nhất mình đã thấy" — như người đi chợ luôn nhớ giá tốt nhất dù chưa mua. Khi đến null là dừng, trả về giá tốt nhất.

**Pattern Recognition:**

- Signal: "BST + find closest value to target (float)" → **Iterative BST traversal tracking minimum diff**
- Bài này thuộc dạng tìm kiếm trên BST, theo dõi best candidate trong khi duyệt
- Key insight: tận dụng tính chất BST để bỏ nửa cây mỗi bước; cập nhật best khi |node.val - target| < |best - target|

**Visual — BST traversal tracking closest:**

```
BST:
       4
      / \
     2   5
    / \
   1   3

target = 3.714286

Step 1: node=4, |4-3.714|=0.286, best=4, target<4 → go left? No: target=3.71 < 4 → left
Step 2: node=2, |2-3.714|=1.714, best=4 (0.286 < 1.714), target>2 → go right
Step 3: node=3, |3-3.714|=0.714, best=4 (0.286 < 0.714), target>3 → go right
Step 4: node=null → stop

Result: 4  ✅
```

---

## Problem Description

Given the root of a BST and a floating-point `target`, find the value in the BST that is closest to `target`. If there's a tie, return the smaller value. ([LeetCode](https://leetcode.com/problems/closest-binary-search-tree-value))

```
Example 1: root=[4,2,5,1,3], target=3.714286 → 4
Example 2: root=[1], target=4.428497 → 1
```

Constraints: 1 ≤ nodes ≤ 10⁴; -10⁹ ≤ node.val ≤ 10⁹; target is a double; unique node values.

---

## 📝 Interview Tips

1. **Iterative BST traversal: no recursion needed, O(h) time** — _Duyệt BST lặp: không cần đệ quy, O(h) thời gian và O(1) không gian_
2. **Track closest by comparing |node.val - target|** — _Theo dõi best bằng cách so sánh khoảng cách tuyệt đối với target_
3. **Use BST property to navigate: target < node → go left; target > node → go right** — _Tận dụng BST: target nhỏ hơn thì đi trái, lớn hơn đi phải — bỏ nửa cây mỗi bước_
4. **O(h) time, O(1) space — much better than O(n) in-order scan** — _O(h) thời gian, O(1) không gian — tốt hơn O(n) duyệt in-order_
5. **Tie-breaking: if |a-target| == |b-target|, return smaller (a < b → return a)** — _Khi hai giá trị bằng nhau về khoảng cách: trả về giá trị nhỏ hơn_
6. **Edge: root is null → problem guarantees non-empty, but handle anyway** — _Đề đảm bảo cây không rỗng, nhưng nên handle null root an toàn_

---

## Solutions

```typescript
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

/** Solution 1: Iterative BST traversal, O(h) time O(1) space
 * @complexity Time: O(h) | Space: O(1) */
function closestValue(root: TreeNode | null, target: number): number {
  let best = root!.val;
  let node = root;

  while (node) {
    // Update best if current is closer (or equal dist but smaller value)
    if (
      Math.abs(node.val - target) < Math.abs(best - target) ||
      (Math.abs(node.val - target) === Math.abs(best - target) && node.val < best)
    ) {
      best = node.val;
    }
    // BST navigation
    node = target < node.val ? node.left : node.right;
  }
  return best;
}

/** Solution 2: Recursive DFS inorder — finds closest via sorted traversal
 * @complexity Time: O(n) | Space: O(h) */
function closestValue2(root: TreeNode | null, target: number): number {
  let best = Infinity;
  let bestVal = 0;

  function inorder(node: TreeNode | null): void {
    if (!node) return;
    inorder(node.left);
    const diff = Math.abs(node.val - target);
    if (diff < best || (diff === best && node.val < bestVal)) {
      best = diff;
      bestVal = node.val;
    }
    // Early termination: once we pass target, further values only get farther
    if (node.val > target) return;
    inorder(node.right);
  }

  inorder(root);
  return bestVal;
}

/** Solution 3: Collect in-order then binary search (most straightforward for interview)
 * @complexity Time: O(n) | Space: O(n) */
function closestValue3(root: TreeNode | null, target: number): number {
  const vals: number[] = [];
  function inorder(node: TreeNode | null): void {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);

  return vals.reduce(
    (best, v) => (Math.abs(v - target) < Math.abs(best - target) ? v : best),
    vals[0],
  );
}

// === Test Cases ===
function mkNode(
  val: number,
  left: TreeNode | null = null,
  right: TreeNode | null = null,
): TreeNode {
  return { val, left, right };
}
const bst = mkNode(4, mkNode(2, mkNode(1), mkNode(3)), mkNode(5));
console.log(closestValue(bst, 3.714286)); // 4
console.log(closestValue(mkNode(1), 4.428497)); // 1
console.log(closestValue2(bst, 2.5)); // 2 (tie between 2 and 3, return smaller=2)
console.log(closestValue3(bst, 3.714286)); // 4
```

---

## 🔗 Related Problems

| #   | Problem                     | Difficulty | Pattern                    |
| --- | --------------------------- | ---------- | -------------------------- |
| 272 | Closest BST Value II        | Hard       | BST Inorder + Two Pointers |
| 700 | Search in a BST             | Easy       | BST Traversal              |
| 230 | Kth Smallest Element in BST | Medium     | BST Inorder                |
| 235 | LCA of BST                  | Medium     | BST Navigation             |
