---
layout: page
title: "Merge Two Binary Trees"
difficulty: Easy
category: Tree-Graph
tags: [Tree, Depth-First Search, Breadth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/merge-two-binary-trees"
---

# Merge Two Binary Trees / Gộp Hai Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: BFS
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Same Tree](https://leetcode.com/problems/same-tree) | [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree)

---

## 🧠 Intuition / Tư Duy

**Vietnamese Analogy:** Giống ghép hai tấm lưới cá — đặt hai tấm lưới chồng lên nhau, chỗ nào cả hai có nút thì tổng lại, chỗ nào chỉ một tấm có nút thì giữ nguyên nút đó. Đơn giản như ghép hai tờ giấy vẽ sơ đồ điện.

**Pattern Recognition:**

- Signal: "combine two trees node by node" + "sum overlapping" → **Recursive DFS đồng thời trên 2 cây**
- Key insight: xử lý 3 trường hợp: cả hai null, một null, cả hai có giá trị

**Visual — Merge Two Binary Trees example:**

```
Tree 1:    1          Tree 2:    2
          / \                   / \
         3   2                 1   3
        /                       \   \
       5                         4   7

Merge:     3
          / \
         4   5
        / \   \
       5   4   7

Overlay:
  root: 1+2=3
  left: 3+1=4 → children: 5+0=5, 0+4=4
  right: 2+3=5 → right: 0+7=7
```

---

## 📝 Problem Description

Given two binary trees `root1` and `root2`, merge them into a new tree. If two nodes overlap, their values are summed. If only one node exists at a position, use that node as-is.

**Example 1:** `root1=[1,3,2,5]`, `root2=[2,1,3,null,4,null,7]` → `[3,4,5,5,4,null,7]`
**Example 2:** `root1=[1]`, `root2=[1,2]` → `[2,2]`

Constraints: `0 ≤ nodes ≤ 2000` in each tree, `-10⁴ ≤ Node.val ≤ 10⁴`.

---

## 🎯 Interview Tips

1. **Base cases first**: if either node is null, return the other / Xử lý base case: nếu một cây null, trả cây kia
2. **Modify in-place or create new**: interview may specify / Hỏi interviewer: sửa tại chỗ hay tạo node mới?
3. **Recursive is most readable** / Đệ quy là dễ đọc nhất cho bài này
4. **Iterative BFS** is better for large trees (avoid stack overflow) / BFS iterative tốt hơn với cây sâu
5. **Both null**: return null immediately / Cả hai null → trả null ngay
6. **Test asymmetric trees** (one much deeper) / Test cây không cân bằng — một cây sâu hơn nhiều

---

## 💡 Solutions

### Approach 1: Recursive DFS — Most Readable

/\*_ @complexity Time: O(min(N1, N2)) | Space: O(min(H1, H2)) _/

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

function mergeTrees(root1: TreeNode | null, root2: TreeNode | null): TreeNode | null {
  // Base cases: if either is null, return the other
  if (!root1) return root2;
  if (!root2) return root1;
  // Both exist: create merged node and recurse
  const merged = new TreeNode(root1.val + root2.val);
  merged.left = mergeTrees(root1.left, root2.left);
  merged.right = mergeTrees(root1.right, root2.right);
  return merged;
}
```

### Approach 2: Iterative BFS — No Recursion Stack

/\*_ @complexity Time: O(min(N1, N2)) | Space: O(min(W1, W2)) _/

```typescript
function mergeTreesBFS(root1: TreeNode | null, root2: TreeNode | null): TreeNode | null {
  if (!root1) return root2;
  if (!root2) return root1;

  // Queue holds pairs of nodes to merge
  const queue: [TreeNode, TreeNode][] = [[root1, root2]];

  while (queue.length > 0) {
    const [n1, n2] = queue.shift()!;
    // Merge n2 into n1 (modify root1 in-place)
    n1.val += n2.val;

    // Handle left children
    if (n1.left && n2.left) {
      queue.push([n1.left, n2.left]);
    } else if (!n1.left) {
      n1.left = n2.left; // attach n2's subtree if n1 has no left
    }

    // Handle right children
    if (n1.right && n2.right) {
      queue.push([n1.right, n2.right]);
    } else if (!n1.right) {
      n1.right = n2.right;
    }
  }
  return root1;
}
```

---

## 🧪 Test Cases

```typescript
// Direct construction for test
const t1 = new TreeNode(1, new TreeNode(3, new TreeNode(5)), new TreeNode(2));
const t2 = new TreeNode(2, new TreeNode(1,null,new TreeNode(4)), new TreeNode(3,null,new TreeNode(7)));
const m = mergeTrees(t1, t2);
console.log(m?.val, m?.left?.val, m?.right?.val); // → 3 4 5
console.log(mergeTrees(new TreeNode(1), new TreeNode(1,new TreeNode(2)))?.left?.val); // → 2
console.log(mergeTrees(null, new TreeNode(1))?.val); // → 1
const m2 = mergeTreesBFS(new TreeNode(1,new TreeNode(3)),new TreeNode(2,new TreeNode(1)));
console.log(m2?.val, m2?.left?.val); // → 3 4
```

---

## Related Problems

| Problem                                                                  | Difficulty | Pattern |
| ------------------------------------------------------------------------ | ---------- | ------- |
| [Same Tree](https://leetcode.com/problems/same-tree)                     | Easy       | DFS     |
| [Symmetric Tree](https://leetcode.com/problems/symmetric-tree)           | Easy       | DFS/BFS |
| [Add One Row to Tree](https://leetcode.com/problems/add-one-row-to-tree) | Medium     | BFS/DFS |
