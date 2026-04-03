---
layout: page
title: "Symmetric Tree"
difficulty: Easy
category: Tree/Graph
tags: [Tree, Depth-First Search, Breadth-First Search]
leetcode_url: "https://leetcode.com/problems/symmetric-tree/"
leetcode_number: 101
pattern: "DFS Mirror Comparison"
frequency_tier: 2
companies: [Amazon, Microsoft, LinkedIn, Bloomberg]
target_time_minutes: 15
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Symmetric Tree / Cây Đối Xứng

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS / Mirror Comparison
> **Frequency**: ⭐ Tier 2 — Gặp ~50% interviews vòng junior/mid
> **See also**: [Same Tree](https://leetcode.com/problems/same-tree/) | [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn đứng trước gương — tay trái của bạn là tay phải của bản phản chiếu. Kiểm tra cây đối xứng cũng vậy: không so sánh `left.left` với `right.left`, mà phải so sánh **chéo** `left.left ↔ right.right` và `left.right ↔ right.left`.

**Pattern Recognition:**

- Signal: "mirror of itself", "symmetric around its center" → **DFS với cặp nodes đối xứng**
- So sánh chéo (cross-comparison): nhánh trái-trái ↔ nhánh phải-phải
- Base case: cả hai null → true; chỉ một null → false; giá trị khác nhau → false

**Visual — DFS Mirror Check:**

```
Input: [1, 2, 2, 3, 4, 4, 3]
        1
      /   \
     2     2
    / \   / \
   3   4 4   3

isMirror(L=2, R=2): 2==2 ✓
  isMirror(L.left=3, R.right=3): 3==3 ✓ → true
  isMirror(L.right=4, R.left=4): 4==4 ✓ → true
→ true ✅

Input: [1, 2, 2, null, 3, null, 3]
        1
      /   \
     2     2
      \     \
       3     3

isMirror(L=2, R=2): 2==2 ✓
  isMirror(L.left=null, R.right=null): → true
  isMirror(L.right=3,   R.left=null):  → false ❌
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                                      |
| ---------------- | ----------------------------------------------------------------------------- |
| **When you see** | "mirror of itself", "symmetric around center"                                 |
| **Think**        | DFS cross-comparison: left.left ↔ right.right AND left.right ↔ right.left    |
| **Template**     | `isMirror(L, R): L.val===R.val && mirror(L.left,R.right) && mirror(L.right,R.left)` |
| **Time target**  | ⏱️ 15 min (Easy)                                                              |

> 💡 **Memory hook / Móc nhớ:** "Gương = so chéo, không so thẳng — L.left phải khớp R.right!"

---

## Problem Description

Given the root of a binary tree, check whether it is a mirror of itself (symmetric around its center).

```
Example 1: root = [1,2,2,3,4,4,3]        → true
Example 2: root = [1,2,2,null,3,null,3]   → false
Example 3: root = [1]                      → true
```

Constraints:

- Number of nodes: [1, 1000]
- -100 <= Node.val <= 100

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1 min)

> "We need to check if the tree is a mirror of itself. So the left subtree must be a mirror reflection of the right subtree. Single-node tree is symmetric. Null tree is also symmetric."

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2 min)

> "I'll use recursive DFS comparing pairs of nodes. Key insight: I compare L.left with R.right and L.right with R.left — cross-comparison, not straight comparison. If either node is null or values differ, return false."

### Step 3 — Implement / Viết Code (4 min)

> "Write helper isMirror(left, right). Base cases: both null → true, one null → false, different values → false. Recurse with cross pairs: isMirror(left.left, right.right) AND isMirror(left.right, right.left)."

### Step 4 — Review / Kiểm Tra (1 min)

> "For [1,2,2,3,4,4,3]: isMirror(2,2)→ vals equal, check (3,3) and (4,4) → all equal → true. For [1,2,2,null,3,null,3]: isMirror(null, null)→true, isMirror(3, null)→false → false."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time O(n), space O(h). Iterative BFS version also works with a queue of node pairs."

---

## 📝 Interview Tips

1. **Clarify**: Does a single-node tree count as symmetric? (Yes.) What about null root? / Cây 1 node có đối xứng không? (Có.)
2. **Approach**: "I'll compare the left and right subtrees as mirrors using cross-comparison — left.left vs right.right, left.right vs right.left" / So sánh chéo, không phải thẳng
3. **Brute force**: Serialize entire tree to an array and check palindrome — but handling nulls is tricky / Serialize rồi check palindrome, khó xử lý null
4. **Optimize**: Recursive DFS is already O(n) — key insight is the cross-comparison, not sequential / Đệ quy đã O(n), insight chính là so sánh chéo
5. **Edge cases**: Two nodes with same value but one is left-child, one is right-child are NOT symmetric / Cùng giá trị nhưng vị trí khác nhau = không đối xứng

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                                 | Why Wrong / Tại sao sai                                       | Fix / Cách sửa                                              |
| --- | ------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | Comparing left.left with right.left (same side)   | Same-side comparison tests equality not symmetry              | Cross-compare: left.left ↔ right.right, left.right ↔ right.left |
| 2   | Not handling the case where both nodes are null   | Missing base case causes null pointer                         | Return true if both null (valid symmetric leaf)             |
| 3   | Comparing only the root's two children, not recursively | Misses deeper asymmetry                                  | Recurse both cross-pairs AND check values at each step      |

---

## Solutions

```typescript

// Note: TreeNode class is provided by LeetCode environment

/**

- Solution 1: Recursive DFS (Optimal — interview standard)
- Time: O(n) — visit each node once
- Space: O(h) — recursion stack depth equals tree height
  */
  function isSymmetric(root: TreeNode | null): boolean {
  function isMirror(left: TreeNode | null, right: TreeNode | null): boolean {
  if (!left && !right) return true;
  if (!left || !right) return false;
  return (
  left.val === right.val &&
  isMirror(left.left, right.right) && // cross-comparison
  isMirror(left.right, right.left)
  );
  }
  return isMirror(root?.left ?? null, root?.right ?? null);
  }

/**

- Solution 2: Iterative BFS with Queue (Non-recursive alternative)
- Time: O(n) — visit each node once
- Space: O(n) — queue holds up to n/2 node pairs at peak
  */
  function isSymmetricIterative(root: TreeNode | null): boolean {
  if (!root) return true;
  const queue: [TreeNode | null, TreeNode | null][] = [[root.left, root.right]];
  while (queue.length > 0) {
  const [left, right] = queue.shift()!;
  if (!left && !right) continue;
  if (!left || !right || left.val !== right.val) return false;
  queue.push([left.left, right.right]);
  queue.push([left.right, right.left]);
  }
  return true;
  }

// === Test Cases ===
const sym = new TreeNode(1,
new TreeNode(2, new TreeNode(3), new TreeNode(4)),
new TreeNode(2, new TreeNode(4), new TreeNode(3))
);
console.log(isSymmetric(sym)); // true ✅
console.log(isSymmetric(null)); // true ✅
console.log(isSymmetric(new TreeNode(1))); // true ✅

const asym = new TreeNode(1,
new TreeNode(2, null, new TreeNode(3)),
new TreeNode(2, null, new TreeNode(3))
);
console.log(isSymmetricIterative(asym)); // false ✅

```

---

## 🔗 Related Problems

- [Same Tree](https://leetcode.com/problems/same-tree/) — identical cross-comparison DFS logic, simpler variant
- [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/) — mirror tree manipulation
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) — BFS on trees prerequisite
- [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) — basic DFS tree traversal

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | ___ min (target: 15 min)                 |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
