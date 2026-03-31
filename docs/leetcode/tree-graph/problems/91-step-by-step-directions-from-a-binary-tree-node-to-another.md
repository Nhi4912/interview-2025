---
layout: page
title: "Step-By-Step Directions From a Binary Tree Node to Another"
difficulty: Medium
category: Tree-Graph
tags: [String, Tree, Depth-First Search, Binary Tree]
leetcode_url: "https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another"
---

# Step-By-Step Directions From a Binary Tree Node to Another / Step-By-Step Directions From a Binary Tree Node to Another

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DFS
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) | [Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống đi trong mê cung — bạn đi sâu hết một ngõ, nếu cụt thì quay lại ngã rẽ gần nhất chưa thử.

**Pattern Recognition:**

- Signal: "traverse tree/graph" + "all paths" → **DFS**
- Bài này thuộc dạng DFS — nhận diện qua keywords trong đề và constraints
- Key insight: xác định state/transition phù hợp trước khi code

**Visual — Step-By-Step Directions From a Binary Tree Node to Another example:**

```
       root
      /    \
     A      B
    / \      \
   C   D      E

DFS: root → A → C → D → B → E
Use: recursion or explicit stack
```

---

## Problem Description

Step-By-Step Directions From a Binary Tree Node to Another. ([LeetCode](https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another))

Difficulty: Medium | Acceptance: 56.3%

```
// TODO: Add concise problem statement (2-4 sentences)
// Example 1: input → output
// Example 2: input → output
```

Constraints:
- See [LeetCode problem page](https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another) for full constraints

---

## 📝 Interview Tips

1. **Clarify**: "Xác nhận input constraints, edge cases" / Confirm input size, types, edge cases with interviewer
2. **Brute force**: "Bắt đầu từ brute force, rồi optimize" / Always start with naive approach, then optimize
3. **Optimize**: "Phân tích bottleneck của brute force, tìm cách giảm" / Identify the bottleneck and reduce it
4. **Edge cases**: "Input rỗng, một phần tử, giá trị cực biên" / Empty input, single element, boundary values
5. **Follow-up**: "Nếu input rất lớn? Nếu cần streaming?" / What if input is huge? What about streaming?

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function stepByStepDirectionsFromABinaryTreeNodeToAnotherBruteForce(/* TODO: params */): unknown {
  // TODO: Implement brute force approach
  // Hint: Start with the most straightforward solution
  throw new Error('Not implemented');
}

/**
 * Solution 2: Optimized — DFS
 * Time: O(?) — TODO: analyze
 * Space: O(?) — TODO: analyze
 */
function stepByStepDirectionsFromABinaryTreeNodeToAnother(/* TODO: params */): unknown {
  // TODO: Implement optimal approach using DFS
  // Hint: Use recursion or stack, track visited nodes
  throw new Error('Not implemented');
}

// === Test Cases ===
// console.log(stepByStepDirectionsFromABinaryTreeNodeToAnother(/* example 1 */)); // expected
// console.log(stepByStepDirectionsFromABinaryTreeNodeToAnother(/* example 2 */)); // expected
// console.log(stepByStepDirectionsFromABinaryTreeNodeToAnother(/* edge case */)); // expected
```

---

## 🔗 Related Problems

- [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree) — same pattern: BFS
- [Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths) — same pattern: Backtracking
- [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree) — same pattern: DFS
- [Same Tree](https://leetcode.com/problems/same-tree) — same pattern: BFS
- [Step-By-Step Directions From a Binary Tree Node to Another — LeetCode](https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another) — problem page
