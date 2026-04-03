---
layout: page
title: "Complete Binary Tree Inserter"
difficulty: Medium
category: Tree & Graph
tags: [Tree, Breadth-First Search, Design, Binary Tree]
leetcode_url: "https://leetcode.com/problems/complete-binary-tree-inserter"
---

# Complete Binary Tree Inserter / Chèn Vào Cây Nhị Phân Đầy Đủ

> **Track**: Tree & Graph | **Difficulty**: 🟡 Medium | **Pattern**: BFS Level-Order / Design
> **Frequency**: 📗 Tier 2 — Gặp ở Google, Amazon
> **See also**: [Count Complete Tree Nodes](https://leetcode.com/problems/count-complete-tree-nodes) | [Insert into a Binary Search Tree](https://leetcode.com/problems/insert-into-a-binary-search-tree)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng một khán đài bóng đá hình cây: khán giả phải ngồi lấp đầy từng hàng trái qua phải trước khi chuyển sang hàng tiếp theo. Mỗi chỗ ngồi "chưa có đủ 2 con" chính là slot sẵn sàng cho khán giả tiếp theo. Khi quản lý thêm khán giả mới, anh ta luôn biết ngay ai sẽ là "cha" của ghế tiếp theo — chính là người đứng đầu hàng đợi những "chỗ chưa đầy". Đây là cấu trúc CBTInserter: dùng deque các node chưa đủ 2 con.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Complete Binary Tree Inserter example:**

```
Initial tree:    1
                / \
               2   3

candidates (nodes with < 2 children): [3] (node 2 full, node 3 has no children)
Wait: node 2 has no children shown → candidates = [2, 3]

insert(4):
  parent = candidates.front() = 2 (leftmost incomplete)
  2.left = 4 → now 2 has 1 child
  push 4 to candidates: [2, 3, 4]
  return parent.val = 2

insert(5):
  parent = candidates.front() = 2
  2.right = 5 → now 2 full → pop 2
  push 5 to candidates: [3, 4, 5]
  return 2

Tree now:      1
              / \
             2   3
            / \
           4   5
```

---

## Problem Description

Design a class `CBTInserter` for a **complete binary tree**:

- `CBTInserter(root)`: Initialize with existing complete binary tree `root`
- `insert(val)`: Insert new node with value `val`, maintain complete binary tree property, return the parent's value
- `get_root()`: Return the root of the tree

**Example 1:**

```
CBTInserter([1,2,3]) → init
insert(4) → 2  (4 becomes left child of 2)
insert(5) → 2  (5 becomes right child of 2)
get_root() → [1,2,3,4,5]
```

**Constraints:** `1 ≤ Node.val ≤ 1000`, `1 ≤ n ≤ 1000` initially, `1 ≤ val ≤ 1000`, at most `10⁴` calls to `insert` and `get_root`

---

## 📝 Interview Tips

- **Maintain candidate deque** / Duy trì hàng đợi ứng viên: Queue chứa các node có ít hơn 2 con — node đầu queue chính là parent tiếp theo
- **BFS to init** / BFS để khởi tạo: Duyệt BFS cây ban đầu, thêm vào deque mọi node chưa đủ 2 con
- **Dequeue when full** / Xóa khi đủ con: Sau khi thêm con thứ 2 vào một node → pop nó khỏi deque (nó đã "đầy")
- **New node is also candidate** / Node mới cũng là ứng viên: Mỗi node mới thêm vào → push vào cuối deque (nó có thể có con sau)
- **O(1) insert** / Chèn O(1): Sau khi khởi tạo O(n), mỗi lần insert chỉ O(1) — truy cập đầu deque
- **Array-based alternative** / Thay thế dùng mảng: Lưu nodes[] theo BFS order, node i có parent tại `floor((i-1)/2)` — O(1) lookup

---

## Solutions

```typescript
/**
 * @complexity Init: O(n) | Insert: O(1) | get_root: O(1) | Space: O(n)
 * Maintain queue of nodes with < 2 children; front is always next parent
 */
class CBTInserter {
  private root: TreeNode;
  private candidates: TreeNode[];

  constructor(root: TreeNode) {
    this.root = root;
    this.candidates = [];
    const queue: TreeNode[] = [root];
    while (queue.length) {
      const node = queue.shift()!;
      if (!node.left || !node.right) this.candidates.push(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  insert(val: number): number {
    const newNode = new TreeNode(val);
    this.candidates.push(newNode);
    const parent = this.candidates[0];
    if (!parent.left) parent.left = newNode;
    else {
      parent.right = newNode;
      this.candidates.shift();
    }
    return parent.val;
  }

  get_root(): TreeNode {
    return this.root;
  }
}

/**
 * @complexity Init: O(n) | Insert: O(1) | Space: O(n)
 * Store all nodes in BFS-order array; parent of node[i] = node[floor((i-1)/2)]
 */
class CBTInserterArray {
  private root: TreeNode;
  private nodes: TreeNode[];

  constructor(root: TreeNode) {
    this.root = root;
    this.nodes = [];
    const queue: TreeNode[] = [root];
    while (queue.length) {
      const node = queue.shift()!;
      this.nodes.push(node);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  insert(val: number): number {
    const newNode = new TreeNode(val);
    this.nodes.push(newNode);
    const parentIdx = Math.floor((this.nodes.length - 2) / 2);
    const parent = this.nodes[parentIdx];
    if (!parent.left) parent.left = newNode;
    else parent.right = newNode;
    return parent.val;
  }

  get_root(): TreeNode {
    return this.root;
  }
}

// === Test Cases ===
const root = new TreeNode(1, new TreeNode(2), new TreeNode(3));
const ins = new CBTInserter(root);
console.log(ins.insert(4)); // → 2
console.log(ins.insert(5)); // → 2
console.log(ins.get_root().val); // → 1

const ins2 = new CBTInserterArray(new TreeNode(1));
console.log(ins2.insert(2)); // → 1
console.log(ins2.insert(3)); // → 1
```

---

## 🔗 Related Problems

| Problem                               | Difficulty | Link                                                                          |
| ------------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| Count Complete Tree Nodes             | Easy       | [LC 222](https://leetcode.com/problems/count-complete-tree-nodes)             |
| Serialize and Deserialize Binary Tree | Hard       | [LC 297](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) |
| Maximum Width of Binary Tree          | Medium     | [LC 662](https://leetcode.com/problems/maximum-width-of-binary-tree)          |
