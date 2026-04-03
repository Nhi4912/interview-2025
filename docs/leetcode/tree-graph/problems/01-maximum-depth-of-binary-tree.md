---
layout: page
title: "Maximum Depth of Binary Tree"
difficulty: Easy
category: Tree/Graph
tags: [Tree, DFS, BFS, Recursion]
leetcode_url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/"
leetcode_number: 104
pattern: "DFS Recursion"
frequency_tier: 1
companies: [Google, Amazon, Meta, Microsoft]
target_time_minutes: 10
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Maximum Depth of Binary Tree / Độ Sâu Tối Đa Của Cây Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: DFS Recursion
> **Frequency**: 🔥 Tier 1 — xuất hiện thường xuyên trong phone screen
> **Target**: ⏱️ 10 min | **Companies**: Google, Amazon, Meta, Microsoft
> **See also**: [Symmetric Tree](./04-symmetric-tree.md) | [Validate BST](./02-validate-binary-search-tree.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn đứng trước tòa nhà và đếm số tầng cao nhất. Không cần đếm hết mọi phòng — chỉ cần đi theo nhánh cao nhất từ tầng trệt lên mái. Cây nhị phân cũng vậy: độ sâu = số bước từ gốc đến lá xa nhất.

**Pattern Recognition:**

- Signal: "maximum depth / height of tree" → **DFS đệ quy: 1 + max(left, right)**
- Bài toán chia nhỏ tự nhiên: depth(node) = 1 + max(depth(left), depth(right))
- Base case: node null → return 0

**Visual — DFS trên cây [3,9,20,null,null,15,7]:**

```
        3          ← depth 1
       / \
      9  20        ← depth 2
        /  \
       15   7      ← depth 3  ✓ max = 3

maxDepth(3) = 1 + max(maxDepth(9), maxDepth(20))
            = 1 + max(1, 2)
            = 3
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                          |
| ---------------- | ----------------------------------------------------------------- |
| **When you see** | "depth", "height", "longest path from root to leaf"               |
| **Think**        | DFS Recursion — divide into left/right subtrees, take max         |
| **Template**     | `if (!root) return 0; return 1 + Math.max(dfs(left), dfs(right))` |
| **Time target**  | ⏱️ 10 min (Easy)                                                  |

> 💡 **Memory hook / Móc nhớ:** "Hỏi con trái, hỏi con phải, lấy đứa cao hơn + 1 — đệ quy tự nhiên!"

---

## Problem Description

Given the root of a binary tree, return its maximum depth — the number of nodes along the longest path from root to the farthest leaf.

```
Example 1: root = [3,9,20,null,null,15,7] → 3
Example 2: root = [1,null,2]             → 2
```

Constraints:

- `0 <= number of nodes <= 10⁴`
- `-100 <= Node.val <= 100`

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "Let me make sure I understand. We have a binary tree.
> We need to find the maximum depth — the longest root-to-leaf path length in nodes.
> Clarification: Depth counts nodes, not edges? Empty tree returns 0?"

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "I can use BFS and count levels — O(n) time, O(w) space where w is max width.
> But DFS recursion is cleaner: depth = 1 + max(left depth, right depth).
> O(n) time, O(h) space for the call stack. Should I go ahead?"

### Step 3 — Implement / Viết Code (3-5 min)

> "Base case: if root is null, return 0.
> Recursive case: return 1 + max of left depth and right depth.
> That's the entire function — just 2 lines."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace: tree [3,9,20,null,null,15,7].
> maxDepth(9) = 1 + max(0,0) = 1. maxDepth(15) = 1. maxDepth(7) = 1.
> maxDepth(20) = 1 + max(1,1) = 2. maxDepth(3) = 1 + max(1,2) = 3. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — visit every node. Space: O(h) — recursion stack, O(log n) balanced, O(n) skewed.
> Edge cases: empty tree → 0, single node → 1.
> Follow-up: min depth is different — must handle one-child nodes specially."

---

## 📝 Interview Tips

1. **Clarify**: "Depth = number of nodes or edges?" / "Độ sâu tính theo node hay cạnh?"
2. **Brute force**: BFS đếm từng level — O(n) time, O(w) space (w = width)
3. **Optimize**: DFS đệ quy — O(n) time, O(h) stack space, code gọn hơn
4. **Edge cases**: Empty tree → 0; single node → 1 / Cây rỗng hoặc chỉ có root
5. **Follow-up**: Min depth khác — không dùng max, phải xử lý nhánh null đặc biệt

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                      | Why Wrong / Tại sao sai                                     | Fix / Cách sửa                            |
| --- | -------------------------------------- | ----------------------------------------------------------- | ----------------------------------------- |
| 1   | Confuse depth vs height vs edges       | Different definitions lead to off-by-one errors             | Clarify: LeetCode counts nodes, not edges |
| 2   | Apply same logic for min depth         | `min(left, right)` fails when one child is null (returns 0) | For min depth, skip null children         |
| 3   | Forget to mention recursive space cost | Interviewer expects you to know O(h) stack space            | Always state: "O(h) space for call stack" |

---

## Solutions

```typescript
/**
 * Solution 1: BFS Level Count (Iterative)
 * Time: O(n) — visit every node once
 * Space: O(w) — queue holds at most one full level (width w)
 */
function maxDepthBFS(root: TreeNode | null): number {
  if (!root) return 0;
  const queue: TreeNode[] = [root];
  let depth = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    depth++;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return depth;
}

/**
 * Solution 2: DFS Recursive (Optimal)
 * Time: O(n) — visit every node once
 * Space: O(h) — recursion stack (O(log n) balanced, O(n) skewed)
 */
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// === Test Cases ===
// maxDepth([3,9,20,null,null,15,7]) → 3
// maxDepth([1,null,2])             → 2
// maxDepth(null)                   → 0
```

---

## 🔗 Related Problems

- [Symmetric Tree](./04-symmetric-tree.md) — cùng dùng DFS đệ quy trên cây
- [Binary Tree Level Order Traversal](./03-binary-tree-level-order-traversal.md) — BFS theo từng level
- [Validate BST](./02-validate-binary-search-tree.md) — DFS với điều kiện thêm
- [Minimum Depth of Binary Tree](https://leetcode.com/problems/minimum-depth-of-binary-tree/) — biến thể min, xử lý khác

---

## 📊 Self-Assessment / Tự Đánh Giá

| Metric / Tiêu chí                              | Result / Kết quả                         |
| ---------------------------------------------- | ---------------------------------------- |
| Solved without hints? / Giải không cần gợi ý?  | ☐ Yes ☐ Needed hint ☐ Looked at solution |
| Time taken / Thời gian                         | \_\_\_ min (target: 10 min)              |
| Confidence (1-5) / Độ tự tin                   | ☐1 ☐2 ☐3 ☐4 ☐5                           |
| Can explain to interviewer? / Giải thích được? | ☐ Yes ☐ Partially ☐ No                   |

**SRS Schedule / Lịch ôn tập:** Review in 1d → 3d → 7d → 14d → 30d after solving

| Date | Confidence | Time | Notes |
| ---- | ---------- | ---- | ----- |
|      |            |      |       |
