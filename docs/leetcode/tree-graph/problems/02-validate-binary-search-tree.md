---
layout: page
title: "Validate Binary Search Tree"
difficulty: Medium
category: Tree/Graph
tags: [Tree, DFS, BST, Inorder]
leetcode_url: "https://leetcode.com/problems/validate-binary-search-tree/"
leetcode_number: 98
pattern: "DFS Inorder"
frequency_tier: 1
companies: [Amazon, Meta, Bloomberg, Microsoft]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Validate Binary Search Tree / Kiểm Tra Cây Tìm Kiếm Nhị Phân Hợp Lệ

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS (In-order)
> **Frequency**: 🔥 Tier 1 — câu hỏi kinh điển về BST trong mọi vòng phỏng vấn
> **Target**: ⏱️ 20 min | **Companies**: Amazon, Meta, Bloomberg, Microsoft
> **See also**: [Max Depth](./01-maximum-depth-of-binary-tree.md) | [Kth Smallest in BST](./10-kth-smallest-element-in-a-bst.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Kiểm tra danh bạ điện thoại: đọc từ trái sang phải, tên phải luôn tăng dần theo ABC. BST hợp lệ cũng vậy — duyệt in-order (trái → gốc → phải) phải cho ra dãy tăng dần. Thấy số nào không lớn hơn số trước → không hợp lệ.

**Pattern Recognition:**

- Signal: "valid BST?" → **DFS in-order, theo dõi prev**
- Sai lầm: chỉ so con trực tiếp với cha. Node 3 trong [5,1,4,null,null,3,6] bé hơn 5 nhưng nằm bên phải
- Hai cách: truyền range [min, max] hoặc in-order + prev

**Visual — In-order trên cây [5,1,4,null,null,3,6] (invalid):**

```
       5
      / \
     1   4      ← 4 < 5 nhưng ở nhánh phải → sai!
        / \
       3   6

In-order: 1 → 5 → 3 → 6
                  ↑
              3 < 5 = prev → return false
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                               |
| ---------------- | ---------------------------------------------------------------------- |
| **When you see** | "valid BST", "is this a BST", "BST property"                           |
| **Think**        | DFS Inorder — valid BST ↔ strictly increasing in-order sequence        |
| **Template**     | `if (prev !== null && node.val <= prev) return false; prev = node.val` |
| **Time target**  | ⏱️ 20 min (Medium)                                                     |

> 💡 **Memory hook / Móc nhớ:** "In-order BST = dãy tăng — thấy giảm là sai!"

---

## Problem Description

Given the root of a binary tree, determine if it is a valid BST. A valid BST requires: left subtree nodes < node < right subtree nodes (all nodes, not just direct children), and both subtrees are also valid BSTs.

```
Example 1: root = [2,1,3]                   → true
Example 2: root = [5,1,4,null,null,3,6]     → false  (4 in right subtree < 5)
```

Constraints:

- 0 <= number of nodes <= 10⁴
- -2³¹ <= Node.val <= 2³¹ - 1

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We need to check if a binary tree satisfies the BST property — every node in the left subtree is strictly less, every node in the right subtree is strictly greater. No duplicates allowed."

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "I could collect all values in-order and check if sorted — O(n) time and space. Better: in-order traversal tracking `prev` value — if current ≤ prev, return false. O(n) time, O(h) space. Alternatively, recursive range validation passing [min, max] bounds."

### Step 3 — Implement / Viết Code (5-7 min)

> "I'll use in-order with prev. Base case: null returns true. Recurse left. Check node.val > prev. Update prev. Recurse right."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace [5,1,4,null,null,3,6]: inorder left→1 (prev=null, ok, prev=1). Visit 5 (5>1, ok, prev=5). Recurse right→3 (3≤5, return false). Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — visit each node once. Space: O(h) — recursion stack. Edge cases: empty tree → true; single node → true; INT_MIN/MAX values — use null for prev instead of number."

---

## 📝 Interview Tips

1. **Clarify**: "Duplicates allowed?" / "BST có cho phép giá trị bằng nhau không?" (thường là không)
2. **Brute force**: Collect in-order into array, check sorted — O(n) space / Thu thập vào mảng
3. **Optimize**: In-order with `prev` tracking — O(h) space only / Theo dõi prev, không cần mảng
4. **Edge cases**: INT_MIN/MAX nodes — use `null` instead of number bounds / Dùng null thay số
5. **Follow-up**: "Find the swapped nodes?" — track the two violating nodes in in-order

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                              | Why Wrong / Tại sao sai                                                | Fix / Cách sửa                               |
| --- | ---------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------- |
| 1   | Only comparing node with direct parent         | Misses violations deeper in subtree (e.g., 3 < 5 but in right subtree) | Pass range [min, max] or use in-order + prev |
| 2   | Using `node.val < prev` instead of `<=`        | BST requires strictly increasing — duplicates are invalid              | Use `<=` for comparison                      |
| 3   | Initializing prev as `Number.MIN_SAFE_INTEGER` | Fails if tree contains that exact value                                | Use `null` and check `prev !== null`         |

---

## Solutions

```typescript
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

/**
 * Solution 1: Recursive with Range [min, max]
 * Time: O(n) — visit every node once
 * Space: O(h) — recursion stack depth = tree height
 */
function isValidBSTRange(root: TreeNode | null): boolean {
  function validate(node: TreeNode | null, min: number | null, max: number | null): boolean {
    if (!node) return true;
    if (min !== null && node.val <= min) return false;
    if (max !== null && node.val >= max) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, null, null);
}

/**
 * Solution 2: In-order with prev (Optimal)
 * Time: O(n) — visit every node once
 * Space: O(h) — recursion stack; no extra array
 */
function isValidBST(root: TreeNode | null): boolean {
  let prev: number | null = null;

  function inorder(node: TreeNode | null): boolean {
    if (!node) return true;
    if (!inorder(node.left)) return false;
    if (prev !== null && node.val <= prev) return false;
    prev = node.val;
    return inorder(node.right);
  }

  return inorder(root);
}

// === Test Cases ===
const t1: TreeNode = {
  val: 2,
  left: { val: 1, left: null, right: null },
  right: { val: 3, left: null, right: null },
};
console.log(isValidBST(t1)); // true

const t2: TreeNode = {
  val: 5,
  left: { val: 1, left: null, right: null },
  right: {
    val: 4,
    left: { val: 3, left: null, right: null },
    right: { val: 6, left: null, right: null },
  },
};
console.log(isValidBST(t2)); // false
```

---

## 🔗 Related Problems

- [Maximum Depth of Binary Tree](./01-maximum-depth-of-binary-tree.md) — DFS cơ bản trên cây
- [Kth Smallest Element in BST](./10-kth-smallest-element-in-a-bst.md) — in-order traversal tương tự
- [Inorder Successor in BST](./11-inorder-successor-in-bst.md) — khai thác tính chất in-order BST

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 20 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
