---
layout: page
title: "Binary Tree Level Order Traversal"
difficulty: Medium
category: Tree/Graph
tags: [Tree, BFS, Queue]
leetcode_url: "https://leetcode.com/problems/binary-tree-level-order-traversal/"
leetcode_number: 102
pattern: "BFS"
frequency_tier: 1
companies: [Amazon, Meta, Microsoft, Bloomberg]
target_time_minutes: 20
status: "unsolved"
confidence: null
solve_count: 0
last_reviewed: null
srs_dates: []
---

# Binary Tree Level Order Traversal / Duyệt Cây Nhị Phân Theo Từng Tầng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: BFS (Queue)
> **Frequency**: 🔥 Tier 1 — nền tảng cho mọi bài BFS cây, hỏi rất thường xuyên
> **Target**: ⏱️ 20 min | **Companies**: Amazon, Meta, Microsoft, Bloomberg
> **See also**: [Zigzag Level Order](./07-binary-tree-zigzag-level-order-traversal.md) | [Max Depth](./01-maximum-depth-of-binary-tree.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống điểm danh học sinh từng hàng ghế trong lớp — điểm xong hàng đầu mới sang hàng sau, từ trái qua phải. Queue giúp luôn xử lý hết một tầng trước khi sang tầng tiếp theo.

**Pattern Recognition:**

- Signal: "level by level", "theo từng tầng" → **BFS với queue, snapshot levelSize**
- Chìa khóa: chụp `levelSize = queue.length` _trước vòng lặp_ để phân biệt từng tầng
- Mọi biến thể (zigzag, right view, average...) đều dùng cùng skeleton BFS này

**Visual — BFS trên cây [3,9,20,null,null,15,7]:**

```
Queue:   [3]
Level 1: dequeue 3 → enqueue 9, 20       → [3]
Queue:   [9, 20]
Level 2: dequeue 9, dequeue 20 → +15, 7  → [9, 20]
Queue:   [15, 7]
Level 3: dequeue 15, dequeue 7           → [15, 7]
Result: [[3], [9,20], [15,7]]
```

---

## 🎯 Pattern Trigger / Nhận Dạng

| Trigger          | Response                                                           |
| ---------------- | ------------------------------------------------------------------ |
| **When you see** | "level order", "layer by layer", "breadth first on tree"           |
| **Think**        | BFS — queue + snapshot levelSize mỗi tầng                          |
| **Template**     | `while(queue.length) { size = queue.length; for(i<size) { ... } }` |
| **Time target**  | ⏱️ 20 min (Medium)                                                 |

> 💡 **Memory hook / Móc nhớ:** "Chụp size trước — xong tầng mới sang tầng mới!"

---

## Problem Description

Given the root of a binary tree, return the level-order traversal of its nodes' values — left to right, level by level.

```
Example 1: root = [3,9,20,null,null,15,7] → [[3],[9,20],[15,7]]
Example 2: root = [1]                     → [[1]]
Example 3: root = []                      → []
```

Constraints:

- 0 <= number of nodes <= 2000
- -1000 <= Node.val <= 1000

---

## 🗣️ Interview Script / Kịch Bản Phỏng Vấn

### Step 1 — Understand / Hiểu Đề (1-2 min)

> "We need to traverse a binary tree level by level, returning values grouped by level. Left to right within each level. Empty tree returns empty array."

### Step 2 — Match & Plan / Nhận Dạng & Lên Kế Hoạch (2-3 min)

> "I could use DFS with a level parameter — O(n) but less intuitive. BFS with a queue is the natural fit. Key trick: snapshot `levelSize = queue.length` before processing each level. O(n) time, O(w) space where w is max width."

### Step 3 — Implement / Viết Code (5-7 min)

> "Initialize queue with root. While queue not empty: snapshot levelSize, loop levelSize times dequeuing nodes, push children, collect values into currentLevel array."

### Step 4 — Review / Kiểm Tra (1-2 min)

> "Trace [3,9,20,null,null,15,7]: Queue=[3], size=1→dequeue 3, push 9,20→level=[3]. Queue=[9,20], size=2→dequeue 9 (no kids), dequeue 20 (push 15,7)→level=[9,20]. Queue=[15,7], size=2→dequeue both→level=[15,7]. Result [[3],[9,20],[15,7]]. Correct."

### Step 5 — Evaluate / Đánh Giá (1 min)

> "Time: O(n) — each node enqueued/dequeued once. Space: O(w) — queue holds at most one level. Edge cases: null root → []; single node → [[val]]."

---

## 📝 Interview Tips

1. **Clarify**: "Output as array-of-arrays per level?" / "Kết quả là mảng các mảng theo từng tầng?"
2. **Brute force**: DFS with level parameter — O(n) time/space, less intuitive / DFS với tham số level
3. **Optimize**: BFS with queue — snapshot `levelSize` to separate levels / BFS với queue
4. **Edge cases**: Empty tree → `[]`; single root → `[[val]]` / Cây rỗng, cây 1 node
5. **Follow-up**: Zigzag? → reverse alternate levels; Right view? → last element each level

---

## ❌ Common Mistakes / Sai Lầm Thường Gặp

| #   | Mistake / Sai lầm                              | Why Wrong / Tại sao sai                            | Fix / Cách sửa                                      |
| --- | ---------------------------------------------- | -------------------------------------------------- | --------------------------------------------------- |
| 1   | Not snapshotting `levelSize` before inner loop | Queue grows during iteration — levels mix together | Capture `const size = queue.length` before for-loop |
| 2   | Pushing null children into queue               | Causes null pointer errors on next dequeue         | Guard with `if (node.left)` / `if (node.right)`     |
| 3   | Using `queue.pop()` instead of `queue.shift()` | Pop removes from end → DFS behavior, not BFS       | Use `shift()` for FIFO or use proper deque          |

---

## Solutions

```typescript
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

/**
 * Solution 1: DFS with Level Index (Brute Force)
 * Time: O(n) — visit every node once
 * Space: O(n) — result array + O(h) recursion stack
 */
function levelOrderDFS(root: TreeNode | null): number[][] {
  const result: number[][] = [];

  function dfs(node: TreeNode | null, level: number): void {
    if (!node) return;
    if (level === result.length) result.push([]);
    result[level].push(node.val);
    dfs(node.left, level + 1);
    dfs(node.right, level + 1);
  }

  dfs(root, 0);
  return result;
}

/**
 * Solution 2: BFS with Queue (Optimal)
 * Time: O(n) — each node enqueued/dequeued once
 * Space: O(w) — queue holds at most one full level
 */
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}

// === Test Cases ===
const root: TreeNode = {
  val: 3,
  left: { val: 9, left: null, right: null },
  right: {
    val: 20,
    left: { val: 15, left: null, right: null },
    right: { val: 7, left: null, right: null },
  },
};
console.log(JSON.stringify(levelOrder(root))); // [[3],[9,20],[15,7]]
console.log(JSON.stringify(levelOrder(null))); // []
```

---

## 🔗 Related Problems

- [Binary Tree Zigzag Level Order](./07-binary-tree-zigzag-level-order-traversal.md) — BFS skeleton + direction flag
- [Maximum Depth of Binary Tree](./01-maximum-depth-of-binary-tree.md) — BFS đếm tầng = max depth
- [Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/) — BFS lấy phần tử cuối mỗi tầng

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
