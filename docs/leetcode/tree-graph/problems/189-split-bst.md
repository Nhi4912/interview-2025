---
layout: page
title: "Split BST"
difficulty: Medium
category: Tree-Graph
tags: [Tree, Binary Search Tree, Recursion, Binary Tree]
leetcode_url: "https://leetcode.com/problems/split-bst"
---

# Split BST / Chia BST

🟡 Medium | BST | Recursion

## 🧠 Intuition / Tư Duy

**Analogy / Tương tự:** Giống như chia một danh sách đã sắp xếp thành hai phần tại một ngưỡng — tất cả phần tử `≤ target` ở trái, `> target` ở phải. Trong BST, cấu trúc cây cho phép làm điều này **đệ quy một cách tự nhiên**.

```
BST:    4          Split at 2:
       / \
      2   6     Left (≤2):  Right (>2):
     / \           2            4
    1   3         /            / \
                 1            3   6

At node 4: val=4 > 2 → right subtree ≤2, left subtree >2
```

**Key insight:** If `root.val <= target`: root and its left subtree belong to the left split. Recursively split root.right; left part of that split becomes root.right. If `root.val > target`: root and its right subtree belong to the right split. Recursively split root.left; right part attaches to root.left.

## Problem Description

Given the root of a BST and an integer `target`, split the BST into two subtrees: one containing nodes with values `≤ target` and another with values `> target`. Return `[left_root, right_root]`.

**Example 1:**

- Input: root = [4,2,6,1,3,null,null], target = 2
- Output: [[2,1],[4,3,6]]

**Example 2:**

- Input: root = [1], target = 1
- Output: [[1],[]]

## 📝 Interview Tips

- **Q: Why recursion works here? / Tại sao đệ quy hoạt động ở đây?**
  - A: BST property ensures left < root < right — we can decide at each node / BST đảm bảo trái < gốc < phải.
- **Q: What's the base case? / Trường hợp cơ sở là gì?**
  - A: null node returns [null, null] / Node null trả về [null, null].
- **Q: When root.val <= target? / Khi root.val <= target?**
  - A: Root goes left; split right subtree, attach its left part to root.right / Gốc sang trái; chia phải, gắn phần trái vào root.right.
- **Q: When root.val > target? / Khi root.val > target?**
  - A: Root goes right; split left subtree, attach its right part to root.left / Gốc sang phải; chia trái, gắn phần phải vào root.left.
- **Q: Time complexity? / Độ phức tạp?**
  - A: O(h) where h is tree height / O(h) với h là chiều cao cây.
- **Q: Is the result still a valid BST? / Kết quả có phải BST hợp lệ không?**
  - A: Yes — we only reattach existing subtrees, BST property preserved / Có — chỉ gắn lại cây con hiện có.

## Solutions

### Solution 1: Recursive Split

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
 * Split BST into two trees at target value.
 * Time: O(h)  Space: O(h) call stack
 */
function splitBST(root: TreeNode | null, target: number): Array<TreeNode | null> {
  if (!root) return [null, null];

  if (root.val <= target) {
    // Root belongs to left tree
    // Split right subtree; its left part attaches to root.right
    const [leftPart, rightPart] = splitBST(root.right, target);
    root.right = leftPart;
    return [root, rightPart];
  } else {
    // Root belongs to right tree
    // Split left subtree; its right part attaches to root.left
    const [leftPart, rightPart] = splitBST(root.left, target);
    root.left = rightPart;
    return [leftPart, root];
  }
}

// Helper: build BST from array
function buildBST(vals: (number | null)[]): TreeNode | null {
  if (!vals.length || vals[0] === null) return null;
  const root = new TreeNode(vals[0] as number);
  const queue: TreeNode[] = [root];
  let i = 1;
  while (i < vals.length) {
    const node = queue.shift()!;
    if (vals[i] !== null) {
      node.left = new TreeNode(vals[i] as number);
      queue.push(node.left);
    }
    i++;
    if (i < vals.length && vals[i] !== null) {
      node.right = new TreeNode(vals[i] as number);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function treeToArr(root: TreeNode | null): (number | null)[] {
  if (!root) return [];
  const res: (number | null)[] = [];
  const q: (TreeNode | null)[] = [root];
  while (q.length) {
    const n = q.shift()!;
    if (!n) {
      res.push(null);
      continue;
    }
    res.push(n.val);
    q.push(n.left, n.right);
  }
  while (res[res.length - 1] === null) res.pop();
  return res;
}

// Tests
const t1 = buildBST([4, 2, 6, 1, 3]);
const [l1, r1] = splitBST(t1, 2);
console.log(treeToArr(l1), treeToArr(r1)); // [2,1] [4,3,6]

const t2 = buildBST([1]);
const [l2, r2] = splitBST(t2, 1);
console.log(treeToArr(l2), treeToArr(r2)); // [1] []
```

### Solution 2: Iterative Split

```typescript
/**
 * Split BST iteratively.
 * Time: O(h)  Space: O(1)
 */
function splitBSTIterative(root: TreeNode | null, target: number): Array<TreeNode | null> {
  let leftRoot: TreeNode | null = null,
    rightRoot: TreeNode | null = null;
  let leftCur: TreeNode | null = null,
    rightCur: TreeNode | null = null;

  while (root) {
    if (root.val <= target) {
      if (!leftRoot) leftRoot = root;
      if (leftCur) leftCur.right = root;
      leftCur = root;
      root = root.right;
      leftCur.right = null;
    } else {
      if (!rightRoot) rightRoot = root;
      if (rightCur) rightCur.left = root;
      rightCur = root;
      root = root.left;
      rightCur.left = null;
    }
  }
  return [leftRoot, rightRoot];
}

// Tests
const t3 = buildBST([4, 2, 6, 1, 3]);
const [l3, r3] = splitBSTIterative(t3, 2);
console.log(treeToArr(l3), treeToArr(r3)); // [2,1] [4,3,6]
```

## 🔗 Related Problems

| #   | Problem                     | Difficulty | Key Concept   |
| --- | --------------------------- | ---------- | ------------- |
| 450 | Delete Node in a BST        | Medium     | BST Recursion |
| 669 | Trim a Binary Search Tree   | Medium     | BST Recursion |
| 776 | Split BST                   | Medium     | BST           |
| 98  | Validate Binary Search Tree | Medium     | BST Property  |
